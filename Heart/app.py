import os
import json
import logging
import time as _time
import math
from urllib.parse import urlencode

import numpy as np
import pickle
import requests
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS

# ----------------------------------------------------------------
# ENV & LOGGING
# ----------------------------------------------------------------
load_dotenv()
logging.basicConfig(level=logging.INFO)

# ----------------------------------------------------------------
# MODEL LOADING (SAFE)
# ----------------------------------------------------------------
model = None
try:
    with open("xgb_model.pkl", "rb") as f:
        model = pickle.load(f)
    logging.info("Model loaded successfully from xgb_model.pkl")
except Exception as e:
    logging.error("Failed to load model xgb_model.pkl: %s", e)
    model = None


app = Flask(__name__)

cors_origins_str = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:8000,"
    "http://127.0.0.1:3000,"
    "http://localhost:3000"
)
cors_origins = [o.strip() for o in cors_origins_str.split(",") if o.strip()]


CORS(app, resources={
    r"/*": {
        "origins": [
            r"http://localhost:3000",
            r"http://127\.0\.0\.1:3000"
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Accept"],
        "supports_credentials": True,
    }
})

# ----------------------------------------------------------------
# LLM / EXTERNAL CONFIG
# ----------------------------------------------------------------
LLM_API_KEY = os.getenv("LLM_API_KEY")
LLM_API_URL = os.getenv("LLM_API_URL", "")
LLM_MODEL = os.getenv("LLM_MODEL", "gpt-4o-mini")
NPI_REGISTRY_URL = os.getenv("NPI_REGISTRY_URL", "")

if not LLM_API_KEY:
    logging.warning(
        "LLM_API_KEY not set in environment. High-risk followup will use deterministic template."
    )
if not NPI_REGISTRY_URL:
    logging.warning("NPI_REGISTRY_URL not set in environment.")


# ----------------------------------------------------------------
# HELPERS
# ----------------------------------------------------------------
def safe_post(url, headers, json_payload, tries=3, timeout=15):
    """Retrying POST wrapper for LLM calls."""
    for i in range(tries):
        try:
            r = requests.post(url, headers=headers, json=json_payload, timeout=timeout)
            r.raise_for_status()
            return r
        except Exception as e:
            logging.warning("safe_post attempt %d failed: %s", i + 1, e)
            if i == tries - 1:
                raise
            _time.sleep(2**i)


def score_confidence(prob):
    try:
        if prob is None:
            return "medium"
        p = float(prob)
        if p < 0.5:
            return "low"
        if p <= 0.8:
            return "medium"
        return "high"
    except Exception:
        return "medium"


def parse_int(data, key, default=None):
    val = data.get(key)
    if val is None or val == "":
        return default
    try:
        return int(val)
    except Exception:
        return default


def parse_float(data, key, default=None):
    val = data.get(key)
    if val is None or val == "":
        return default
    try:
        return float(val)
    except Exception:
        return default


# ----------------------------------------------------------------
# FOLLOWUP GENERATION
# ----------------------------------------------------------------
def build_prompt(patient_inputs, prediction_label, prediction_prob):
   schema = {
     "diet_plan": ["..."],
     "exercise_routine": [{"activity":"...","duration":"...","freq":"..."}],
     "lifestyle_changes": ["..."],
     "stress_management": ["..."],
     "medication_awareness": ["..."],
     "meal_plan": {
       "breakfast":{"calories":"...","items":["..."]},
       "lunch":{"calories":"...","items":["..."]},
       "dinner":{"calories":"...","items":["..."]},
       "snacks":{"calories":"...","items":["..."]}
     },
     "foods_to_avoid": ["..."],
     "weekly_nutrition_goals": {
       "servings_fruits_veggies":"...",
       "fish_meals_per_week":"...",
       "sodium_mg":"...",
       "glasses_of_water":"..."
     },
     "heart_safe_exercise_guide": {
       "aerobic_exercises": [{"activity":"...","duration":"...","freq":"..."}],
       "strength_training": [{"activity":"...","duration":"...","freq":"..."}],
       "flexibility_balance": ["..."],
       "low_impact_cardio": [{"activity":"...","duration":"...","freq":"..."}],
       "exercise_safety_tips": ["..."]
     },
     "urgency":{"level":"low|moderate|high","days_to_consult":0},
     "immediate_actions":["..."],
     "recommended_tests_or_info":["..."],
     "followup_message":"short text for doctor",
     "use_tracker": True,
     "rationale":"short reason",
     "confidence":"low|medium|high"
   }

   schema_json = json.dumps(schema, indent=2)
   patient_json = json.dumps(patient_inputs)

   prompt = f"""
You are part of a medical decision-support system.
Your role is **NOT** to diagnose disease** but to generate safe, guideline-aligned lifestyle, diet, exercise, and follow-up recommendations.

Every recommendation MUST be **personalized** based on:
- the patient's health inputs
- the model's label (positive/negative)
- the probability of risk

Your final output MUST strictly follow the JSON schema provided.
NO markdown, NO text outside JSON.

------------------------------------------------------------
SCHEMA (MUST FOLLOW EXACTLY, DO NOT ADD OR REMOVE KEYS)
------------------------------------------------------------
{schema_json}

------------------------------------------------------------
PATIENT INFORMATION
------------------------------------------------------------
Patient inputs: {patient_json}

Model output:
{{
 "label": "{prediction_label}",
 "probability": {prediction_prob if prediction_prob is not None else "null"}
}}

------------------------------------------------------------
PERSONALIZATION LOGIC (USE ALL RULES BELOW)
------------------------------------------------------------

Your recommendations must be **directly influenced by the patient’s values**, especially:

1. **Age**
  - Younger patients → higher exercise capacity, higher hydration.
  - Older patients → gentler routines, lower-impact exercises.

2. **Sex**
  - Males → slightly higher caloric needs.
  - Females → emphasize iron, calcium-rich foods.

3. **Blood Pressure (trestbps)**
  - If ≥140 → strong sodium reduction (<1500 mg/day).
  - If normal → moderate sodium limit.

4. **Cholesterol (chol)**
  - High (≥240) → strict low saturated fat, omega-3 rich foods.
  - Borderline (200–239) → moderate fat restrictions.
  - Normal → balanced diet.

5. **Fasting Blood Sugar (fbs)**
  - If 1 → avoid high glycemic foods.
  - If 0 → normal sugar guidelines.

6. **Maximum Heart Rate (thalach)**
  - Low (<120) → low intensity exercise.
  - Normal (120–160) → moderate activity.
  - High (>160) → good exercise tolerance.

7. **Exercise-induced Angina (exang)**
  - If 1 → avoid high-intensity exercise; safety focus.

8. **Oldpeak**
  - High (>2.0) → strong stress-management emphasis.

9. **Chest Pain Flags (cp1, cp2, cp3)**
  - `cp1=1` (typical angina) → conservative exercise.
  - `cp2=1` (atypical) → moderate caution.
  - `cp3=1` (non-anginal) → normal routine allowed.

10. **ECG Flags (restecg_left, restecg_normal)**
  - Abnormal → reduce strenuous exercise.

11. **Slope Flags (slope1, slope2)**
  - `slope1=1` → reduced exercise recovery; lower intensity.

------------------------------------------------------------
RISK-BASED RULES
------------------------------------------------------------

1. **If model label is "positive":**
  - urgency.level = "high"
  - urgency.days_to_consult = 1–3
  - recommendations must be stronger and more safety-focused.

2. **If model label is "negative":**
  - urgency.level = "low" or "moderate"
  - preventive, supportive recommendations.

3. **Confidence scoring:**
  - probability < 0.5 → "low"
  - 0.5–0.8 → "medium"
  - >0.8 → "high"

------------------------------------------------------------
CONTENT RULES
------------------------------------------------------------
- Each list must contain **2–6 items**.
- Exercise items must include: activity, duration, freq.
- Meal plan must specify calories + 2–4 items.
- Foods_to_avoid must match cholesterol, BP, and fbs values.
- No repeated text across patients.
- All values must be **numerically meaningful** (NOT placeholders).
- Hydration must depend on age + sex.
- Sodium_mg must depend on trestbps.
- Very important: **All content must be tailored to THIS patient only.**

------------------------------------------------------------
OUTPUT FORMAT
------------------------------------------------------------
Return **ONLY** the final JSON object. 
NO commentary, NO markdown, NO text before or after.
"""

   return prompt


def call_llm_for_followup(patient_inputs: dict, prediction_label: str, prediction_prob: float = None):
    if not LLM_API_KEY:
        logging.info("LLM_API_KEY not provided; skipping LLM call.")
        return {}
    if not LLM_API_URL:
        logging.info("LLM_API_URL not provided; skipping LLM call.")
        return {}

    prompt = build_prompt(patient_inputs, prediction_label, prediction_prob)
    headers = {
        "Authorization": f"Bearer {LLM_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": LLM_MODEL,
        "messages": [
            {
                "role": "system",
                "content": "You are a clinical guidance assistant. Provide safe follow-up recommendations (non-diagnostic).",
            },
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.0,
        "max_tokens": 1200,
    }

    try:
        resp = safe_post(LLM_API_URL, headers, payload, tries=3, timeout=30)
    except Exception as e:
        logging.warning("LLM call failed: %s", e)
        return {}

    try:
        data = resp.json()
    except Exception as e:
        logging.warning("LLM response JSON decode failed: %s", e)
        return {}

    assistant_text = ""
    try:
        assistant_text = (
            data.get("choices", [])[0].get("message", {}).get("content", "")
            if data.get("choices")
            else ""
        )
    except Exception:
        assistant_text = ""

    if not assistant_text:
        return {}

    # Try parse as JSON directly
    try:
        return json.loads(assistant_text)
    except json.JSONDecodeError:
        cleaned = assistant_text.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.strip("`").strip()
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            logging.warning(
                "LLM returned non-JSON or parse failed. Content snippet: %.300s",
                assistant_text,
            )
            return {}


def generate_followup_template(patient_inputs: dict, label: str, prob: float):
    """Deterministic, safe template (used for low-risk and as fallback)."""
    confidence = score_confidence(prob)

    # Standardize urgency to always use days_to_consult
    if label == "positive":
        urgency = {"level": "high", "days_to_consult": 3}
    else:
        urgency = {"level": "moderate", "days_to_consult": 30}

    diet_plan = [
        "Increase omega-3 rich foods (salmon, walnuts, flaxseeds)",
        "Reduce sodium intake to less than 2,300 mg per day",
        "Eat 5–7 servings of fruits and vegetables daily",
        "Choose whole grains over refined carbohydrates",
        "Limit saturated fats and avoid trans fats",
    ]

    exercise_routine = [
        {
            "activity": "Moderate aerobic activity (overall goal)",
            "duration": "150 min per week total",
            "freq": "Spread across at least 3–5 days/week",
        },
        {"activity": "Brisk walking", "duration": "30 min", "freq": "5 days/week"},
        {
            "activity": "Strength training (major muscle groups)",
            "duration": "20–30 min",
            "freq": "2 days/week",
        },
        {
            "activity": "Low-impact cardio (cycling or swimming)",
            "duration": "30 min",
            "freq": "2–3 days/week",
        },
    ]

    lifestyle_changes = [
        "Quit smoking and avoid secondhand smoke",
        "Limit alcohol consumption to moderate levels",
        "Aim for a healthy weight (BMI around 18.5–24.9)",
        "Get 7–9 hours of quality sleep each night",
        "Monitor blood pressure regularly at home",
    ]

    stress_management = [
        "Practice meditation or mindfulness for 10–15 minutes daily",
        "Use deep breathing exercises when stressed",
        "Engage regularly in hobbies you enjoy",
        "Maintain social connections with friends and family",
        "Consider yoga or tai chi for relaxation",
    ]

    medication_awareness = [
        "Discuss cholesterol-lowering medication (e.g., statins) with your doctor if appropriate",
        "Only consider low-dose aspirin after discussing risks and benefits with your doctor",
        "Take all prescribed medications exactly as directed",
        "Report any side effects promptly to your healthcare provider",
        "Keep an updated list of all medications and supplements",
    ]

    meal_plan = {
        "breakfast": {
            "calories": "400-500",
            "items": [
                "Oatmeal with berries and walnuts",
                "Low-fat Greek yogurt",
                "Green tea or black coffee without sugar",
            ],
        },
        "lunch": {
            "calories": "500-600",
            "items": [
                "Grilled fish or skinless chicken",
                "Quinoa or brown rice",
                "Mixed green salad with olive oil dressing",
            ],
        },
        "dinner": {
            "calories": "500-600",
            "items": [
                "Baked chicken or tofu",
                "Steamed vegetables (broccoli, carrots, spinach)",
                "Small portion of whole grains",
            ],
        },
        "snacks": {
            "calories": "200-300",
            "items": [
                "A handful of unsalted nuts",
                "Fresh fruit (apple, orange, or berries)",
                "Carrot sticks with hummus",
            ],
        },
    }

    foods_to_avoid = [
        "Processed meats (bacon, sausages, deli meats)",
        "Fried and fast foods",
        "High-sodium canned or packaged foods",
        "Sugary beverages and sodas",
        "Pastries, donuts, and foods high in trans fats",
    ]

    weekly_nutrition_goals = {
        "servings_fruits_veggies": "5-7",
        "fish_meals_per_week": "2-3",
        "sodium_mg": "<2300",
        "glasses_of_water": "8-10",
    }

    heart_safe_exercise_guide = {
        "aerobic_exercises": [
            {"activity": "Brisk Walking", "duration": "30 min", "freq": "5 days/week"},
            {"activity": "Swimming", "duration": "30 min", "freq": "3 days/week"},
            {"activity": "Cycling", "duration": "30 min", "freq": "3 days/week"},
        ],
        "strength_training": [
            {"activity": "Light Weights", "duration": "20 min", "freq": "2 days/week"},
            {
                "activity": "Resistance Bands",
                "duration": "20 min",
                "freq": "2 days/week",
            },
        ],
        "flexibility_balance": [
            "Stretching (10 min, daily)",
            "Yoga (30 min, 2–3 days/week)",
            "Tai Chi (30 min, 2 days/week)",
        ],
        "low_impact_cardio": [
            {"activity": "Elliptical", "duration": "25 min", "freq": "3 days/week"},
            {"activity": "Water aerobics", "duration": "30 min", "freq": "2 days/week"},
        ],
        "exercise_safety_tips": [
            "Warm up for 5–10 minutes before exercise",
            "Stay hydrated before, during, and after activity",
            "Stop and seek medical help for chest pain, severe shortness of breath, or dizziness",
            "Avoid exercising in extreme heat or cold",
            "Increase intensity gradually rather than suddenly",
        ],
    }

    immediate_actions = [
        "Schedule an appointment with your primary care provider to review cardiovascular risk",
        "Begin tracking blood pressure at home a few times per week",
        "Reduce daily sodium intake starting today",
        "Start light walking most days of the week at a comfortable pace",
    ]

    recommended_tests_or_info = [
        "Lipid panel (cholesterol profile)",
        "Repeat blood pressure checks over 1–2 weeks",
        "HbA1c to screen for elevated blood sugar, if not done recently",
        "Discuss need for ECG or other cardiac tests with your clinician",
    ]

    followup_message = (
        "Please review my cardiovascular risk factors and help me confirm a safe, "
        "personalized plan for diet, exercise, and any needed medications."
    )

    return {
        "diet_plan": diet_plan,
        "exercise_routine": exercise_routine,
        "lifestyle_changes": lifestyle_changes,
        "stress_management": stress_management,
        "medication_awareness": medication_awareness,
        "meal_plan": meal_plan,
        "foods_to_avoid": foods_to_avoid,
        "weekly_nutrition_goals": weekly_nutrition_goals,
        "heart_safe_exercise_guide": heart_safe_exercise_guide,
        "urgency": urgency,
        "immediate_actions": immediate_actions,
        "recommended_tests_or_info": recommended_tests_or_info,
        "followup_message": followup_message,
        "use_tracker": True,
        "rationale": "Personalized preventive guidance based on estimated risk and model prediction.",
        "confidence": confidence,
    }


def validate_followup(f):
    """Basic structural validation for LLM or template followup JSON."""
    if not isinstance(f, dict):
        return False

    required_top_keys = [
        "diet_plan",
        "exercise_routine",
        "meal_plan",
        "foods_to_avoid",
        "weekly_nutrition_goals",
        "heart_safe_exercise_guide",
        "urgency",
        "followup_message",
    ]
    for k in required_top_keys:
        if k not in f:
            return False

    urgency = f.get("urgency", {})
    if not isinstance(urgency, dict):
        return False
    if "days_to_consult" in urgency:
        try:
            d = int(urgency["days_to_consult"])
            if d < 0:
                return False
        except Exception:
            return False

    ex = f.get("exercise_routine", [])
    if not isinstance(ex, list):
        return False
    for item in ex:
        if not isinstance(item, dict) or not all(
            k in item for k in ("activity", "duration", "freq")
        ):
            return False

    mp = f.get("meal_plan", {})
    if not isinstance(mp, dict):
        return False
    for meal in ("breakfast", "lunch", "dinner", "snacks"):
        if meal not in mp or "items" not in mp[meal]:
            return False

    hseg = f.get("heart_safe_exercise_guide", {})
    if not isinstance(hseg, dict):
        return False
    for key in ("aerobic_exercises", "strength_training", "exercise_safety_tips"):
        if key not in hseg:
            return False

    return True


# ----------------------------------------------------------------
# ROUTES
# ----------------------------------------------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify(
        {
            "message": "Heart Disease Prediction API",
            "status": "running",
            "version": "2.0.0",
            "endpoints": {
                "health": "/health",
                "predict": "/predict",
                "followup": "/get_followup",
                "cardiologists": "/search_cardiologists",
            },
        }
    )


@app.route("/health", methods=["GET"])
def health():
    health_status = {
        "status": "healthy",
        "service": "heart-disease-prediction-api",
        "timestamp": _time.strftime("%Y-%m-%d %H:%M:%S", _time.gmtime()),
        "model_loaded": model is not None,
    }
    if model is not None:
        health_status["model_type"] = str(type(model))
        health_status["model_has_predict_proba"] = hasattr(model, "predict_proba")
    return jsonify(health_status), 200


@app.route("/predict", methods=["POST"])
def predict():
    """
    USER FLOW STEP 1:
    - User submits form.
    - Backend predicts label + prob.
    - If low-risk (negative): ALSO generates a template followup and returns it.
    - If high-risk (positive): DOES NOT call LLM yet; only returns prediction info.
    """

    if model is None:
        return jsonify({"error": "Model not available on server."}), 500

    # Accept JSON or form-data
    data = request.get_json(silent=True)
    if data is None:
        data = request.form.to_dict()

    # Parse safely EXACTLY like your working version
    def get_int(key, default=None):
        try: 
            return int(data.get(key)) if data.get(key) not in ("", None) else default
        except:
            return default

    def get_float(key, default=None):
        try:
            return float(data.get(key)) if data.get(key) not in ("", None) else default
        except:
            return default

    age = get_int("age")
    trestbps = get_int("trestbps")
    chol = get_int("chol")
    fbs = get_int("fbs", 0)
    thalach = get_int("thalach")
    exang = get_int("exang", 0)
    oldpeak = get_float("oldpeak", 0.0)
    sex = get_int("sex", 0)
    cp1 = get_int("cp1", 0)
    cp2 = get_int("cp2", 0)
    cp3 = get_int("cp3", 0)
    restecg_left = get_int("restecg_left", 0)
    restecg_normal = get_int("restecg_normal", 0)
    slope1 = get_int("slope1", 0)
    slope2 = get_int("slope2", 0)

    # Validate required fields
    required = {
        "age": age, "trestbps": trestbps, "chol": chol, "thalach": thalach
    }
    missing = [k for k, v in required.items() if v is None]
    if missing:
        return jsonify({
            "error": "Missing or invalid required fields",
            "missing_fields": missing
        }), 400

    # Patient inputs (for /get_followup)
    patient_inputs = {
        "age": age,
        "sex": sex,
        "trestbps": trestbps,
        "chol": chol,
        "fbs": fbs,
        "thalach": thalach,
        "exang": exang,
        "oldpeak": oldpeak,
        "chest_pain_flags": {"cp1": cp1, "cp2": cp2, "cp3": cp3},
        "restecg": {"left": restecg_left, "normal": restecg_normal},
        "slope": {"slope1": slope1, "slope2": slope2}
    }

    # EXACT feature structure your model expects (from your working reference)
    data_tuple = (
        age, trestbps, chol, fbs, thalach, exang, oldpeak, sex,
        cp1, cp2, cp3,
        restecg_left, restecg_normal,
        slope1, slope2
    )

    # IMPORTANT: dtype=object → REQUIRED for your XGBoost model!
    arr = np.asarray(data_tuple, dtype=object).reshape(1, -1)

    # Predict probability / label
    label = "negative"
    prob = None

    try:
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(arr)
            prob = float(probs[0][1])
            prob = max(0.0, min(1.0, prob))
            label = "positive" if prob >= 0.5 else "negative"
        else:
            pred = model.predict(arr)
            raw = float(pred[0])
            if 0.0 <= raw <= 1.0:
                prob = raw
            label = "positive" if round(raw) == 1 else "negative"

    except Exception as e:
        logging.error("Model prediction failed: %s", str(e))
        return jsonify({"error": "Model prediction failed"}), 500

    # Build prediction response
    response_payload = {
        "prediction": label,
        "probability": prob,
        "patient_inputs": patient_inputs
    }

    # If LOW RISK → IMMEDIATELY return template
    if label == "negative":
        template_followup = generate_followup_template(patient_inputs, label, prob)
        response_payload["followup"] = template_followup

    return jsonify(response_payload)


@app.route("/get_followup", methods=["POST"])
def get_followup():
    """
    USER FLOW STEP 2:
    - Front-end calls this ONLY when user clicks "Get Recommendations".
    - Body must include: prediction, probability (optional), and patient_inputs.

    High-risk (positive):
      - If LLM available: call LLM once, validate, return JSON.
      - If LLM fails or not configured: return deterministic template.

    Low-risk (negative):
      - Return deterministic template (same style as /predict low-risk).
    """
    data = request.get_json(silent=True) or {}
    label = data.get("prediction")
    prob = data.get("probability")
    patient_inputs = data.get("patient_inputs")

    missing = []
    if not label:
        missing.append("prediction")
    if not patient_inputs:
        missing.append("patient_inputs")

    if missing:
        return (
            jsonify(
                {
                    "error": "Missing required fields for followup generation",
                    "missing_fields": missing,
                }
            ),
            400,
        )

    # Ensure probability is float or None
    if prob is not None:
        try:
            prob = float(prob)
        except Exception:
            prob = None

    label = label.lower()

    # LOW-RISK: always template
    if label == "negative":
        followup_json = generate_followup_template(patient_inputs, label, prob)
        return jsonify({"followup": followup_json, "used_llm": False})

    # HIGH-RISK: use LLM if available, otherwise template
    used_llm = False
    followup_json = {}

    if label == "positive" and LLM_API_KEY and LLM_API_URL:
        try:
            candidate = call_llm_for_followup(patient_inputs, label, prob)
            if validate_followup(candidate):
                followup_json = candidate
                used_llm = True
            else:
                logging.warning(
                    "LLM followup failed validation; falling back to deterministic template."
                )
        except Exception as e:
            logging.warning("LLM call raised exception: %s", e)

    if not followup_json:
        followup_json = generate_followup_template(patient_inputs, label, prob)

    return jsonify({"followup": followup_json, "used_llm": used_llm})


@app.route("/search_cardiologists", methods=["POST"])
def search_cardiologists():
    """
    Stateless search for cardiologists using NPI Registry.
    Body: { "location": "City, ST or ZIP", "radius": 30 }  (radius currently unused)
    """
    try:
        data = request.get_json(silent=True) or {}
        location = (data.get("location") or "").strip()
        radius = data.get("radius", 30)  # currently not used in NPI query

        if not location:
            return (
                jsonify(
                    {
                        "success": False,
                        "error": "Location is required",
                        "results": [],
                    }
                ),
                400,
            )
        if not NPI_REGISTRY_URL:
            return (
                jsonify(
                    {
                        "success": False,
                        "error": "NPI_REGISTRY_URL is not configured",
                        "results": [],
                    }
                ),
                503,
            )

        # postal code detection
        zip_match = None
        compact = location.replace(",", "").replace(" ", "")
        if compact.isdigit():
            digits = "".join(c for c in compact if c.isdigit())
            if len(digits) >= 5:
                zip_match = digits[:5]

        base_url = NPI_REGISTRY_URL
        params = {
            "version": "2.1",
            "taxonomy_code": "207RC0000X",  # cardiovascular disease internal medicine
            "limit": 20,
        }

        if zip_match:
            params["postal_code"] = zip_match
        else:
            # very simple city extraction; in practice, front-end should send city/state separately
            city_part = location.split(",")[0].strip()
            if city_part:
                params["city"] = city_part

        logging.info("Searching NPI Registry with params: %s", params)
        response = requests.get(base_url, params=params, timeout=15)
        response.raise_for_status()

        npi_data = response.json()

        if "Errors" in npi_data:
            error_msg = ", ".join(
                [e.get("description", "") for e in npi_data["Errors"]]
            )
            return (
                jsonify(
                    {
                        "success": False,
                        "error": f"NPI API Error: {error_msg}",
                        "results": [],
                    }
                ),
                400,
            )

        result_count = npi_data.get("result_count", 0)
        providers = npi_data.get("results", [])

        formatted_results = []
        for provider in providers:
            basic = provider.get("basic", {})

            first_name = basic.get("first_name", "")
            middle_name = basic.get("middle_name", "")
            last_name = basic.get("last_name", "")
            credential = basic.get("credential", "")

            full_name = " ".join([first_name, middle_name, last_name]).strip()
            if credential:
                full_name = f"{full_name}, {credential}" if full_name else credential

            addresses = provider.get("addresses", [])
            primary_address = None
            for addr in addresses:
                if addr.get("address_purpose") == "LOCATION":
                    primary_address = addr
                    break
            if not primary_address and addresses:
                primary_address = addresses[0]

            address_dict = {}
            if primary_address:
                address_1 = primary_address.get("address_1", "")
                address_2 = primary_address.get("address_2", "")
                full_address = f"{address_1} {address_2}".strip()
                address_dict = {
                    "street": full_address,
                    "city": primary_address.get("city", ""),
                    "state": primary_address.get("state", ""),
                    "postal_code": primary_address.get("postal_code", ""),
                    "phone": primary_address.get("telephone_number", ""),
                    "fax": primary_address.get("fax_number", ""),
                }

            taxonomies = provider.get("taxonomies", [])
            specialty = "Cardiologist"
            for tax in taxonomies:
                desc = tax.get("desc", "")
                if "cardio" in desc.lower():
                    specialty = desc
                    break

            formatted_results.append(
                {
                    "npi": provider.get("number", ""),
                    "name": full_name,
                    "specialty": specialty,
                    "address": address_dict,
                    "organization": basic.get("organization_name", None),
                }
            )

        return jsonify(
            {
                "success": True,
                "count": result_count,
                "location_searched": location,
                "results": formatted_results,
            }
        )

    except requests.exceptions.RequestException as e:
        logging.error("NPI API request failed: %s", e)
        return (
            jsonify(
                {
                    "success": False,
                    "error": f"Failed to connect to NPI Registry: {str(e)}",
                    "results": [],
                }
            ),
            500,
        )
    except Exception as e:
        logging.error("Cardiologist search error: %s", e)
        return (
            jsonify(
                {
                    "success": False,
                    "error": f"Internal error: {str(e)}",
                    "results": [],
                }
            ),
            500,
        )
@app.route("/xgb_version")
def xgb_version():
    try:
        import xgboost as xgb
        return {"xgboost_version": xgb.__version__}
    except Exception as e:
        return {"error": str(e)}, 500


# ----------------------------------------------------------------
# AZURE-FRIENDLY ENTRYPOINT
# ----------------------------------------------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)
