// src/services/api.ts
import type { FormData } from "../components/PredictionForm";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
export interface Followup {
  diet_plan: string[];
  exercise_routine: Array<{
    activity: string;
    duration?: string;
    freq?: string;
  }>;
  lifestyle_changes: string[];
  stress_management: string[];
  medication_awareness: string[];
  meal_plan: {
    breakfast: { calories: string; items: string[] };
    lunch: { calories: string; items: string[] };
    dinner: { calories: string; items: string[] };
    snacks: { calories: string; items: string[] };
  };
  foods_to_avoid: string[];
  weekly_nutrition_goals: {
    servings_fruits_veggies: string;
    fish_meals_per_week: string;
    sodium_mg: string;
    glasses_of_water: string;
  };
  heart_safe_exercise_guide: {
    aerobic_exercises: Array<{
      activity: string;
      duration?: string;
      freq?: string;
    }>;
    strength_training: Array<{
      activity: string;
      duration?: string;
      freq?: string;
    }>;
    flexibility_balance: string[];
    low_impact_cardio: Array<{
      activity: string;
      duration?: string;
      freq?: string;
    }>;
    exercise_safety_tips: string[];
  };
  urgency: {
    level: string;
    // High-risk templates use days_to_consult; low-risk templates may use
    // alternative keys like "Consultation per month". Make this flexible.
    days_to_consult?: number;
    [key: string]: any;
  };
  immediate_actions: string[];
  recommended_tests_or_info: string[];
  followup_message: string;
  use_tracker: boolean;
  rationale: string;
  confidence: "low" | "medium" | "high";
  [key: string]: any;
}

export interface PredictionResponse {
  // backend returns "positive" / "negative"
  prediction: "positive" | "negative" | 0 | 1 | "0" | "1";
  probability: number | null;
  error?: string;
  // For low-risk predictions, backend may include a template followup
  followup?: Followup;
  patient_inputs?: any;
}

export interface FollowupResponse {
  followup: Followup;
  used_llm?: boolean;
  error?: string;
}

export interface PredictionResult {
  riskLevel: "low" | "high";
  prediction: 0 | 1;
  probability: number | null;
  // For low-risk (negative) predictions, this may contain the template followup
  followup?: Followup;
  // Patient inputs as understood by backend, for stateless /get_followup
  patientInputs?: any;
}

/**
 * Converts form data to the backend payload format
 */
function buildPayload(formData: FormData) {
  const toBinary = (v: string) => (v === "yes" ? 1 : 0);

  return {
    age: Number(formData.age),
    trestbps: Number(formData.restingBloodPressure),
    chol: Number(formData.cholesterol),
    fbs: formData.fastingBloodSugar === "high" ? 1 : 0,
    thalach: Number(formData.maxHeartRate),
    exang: toBinary(formData.exerciseAngina),
    oldpeak: Number(formData.stDepression),
    sex: formData.sex === "male" ? 1 : 0,
    cp1: toBinary(formData.atypicalAnginalChest),
    cp2: toBinary(formData.nonAnginalChestPain),
    cp3: toBinary(formData.typicalAnginalChest),
    restecg_left: toBinary(formData.ecgLeftHypertrophy),
    restecg_normal: toBinary(formData.ecgNormal),
    slope1: toBinary(formData.slopeUpsloping),
    slope2: toBinary(formData.slopeFlat),
  };
}

/**
 * Calls the prediction API and returns the result
 */
export async function predictHeartRisk(
  formData: FormData
): Promise<PredictionResult> {
  const payload = buildPayload(formData);

  const res = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Prediction request failed (${res.status})`);
  }

  const data: PredictionResponse = await res.json();

  if (data.error) {
    throw new Error(data.error);
  }

  const rawPrediction = data.prediction;

  const isHigh =
    rawPrediction === "positive" ||
    rawPrediction === 1 ||
    rawPrediction === "1";

  const probability =
    typeof data.probability === "number" ? data.probability : null;

  // For low-risk predictions, backend returns a deterministic template followup
  const followup =
    !isHigh && data.followup && typeof data.followup === "object"
      ? data.followup
      : undefined;

  return {
    riskLevel: isHigh ? "high" : "low",
    prediction: isHigh ? 1 : 0,
    probability,
    followup,
    patientInputs: data.patient_inputs,
  };
}

/**
 * Fetch followup recommendations from the backend using /get_followup.
 * This is stateless: caller passes patientInputs, prediction label, and probability.
 */
export async function fetchFollowupRecommendations(
  patientInputs?: any,
  prediction?: string,
  probability?: number | null
): Promise<Followup> {
  if (!patientInputs || !prediction) {
    throw new Error(
      "patientInputs and prediction are required to fetch followup recommendations"
    );
  }

  const res = await fetch(`${API_BASE_URL}/get_followup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      prediction,
      probability,
      patient_inputs: patientInputs,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Followup request failed (${res.status})`);
  }

  const data: FollowupResponse = await res.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data.followup;
}

/**
 * LEGACY HELPERS BELOW
 * The new backend exposes a single /get_followup endpoint that returns
 * the complete Followup object. The functions below are kept only for
 * backward compatibility and are no-ops against the current backend.
 */
export async function fetchFollowupEndpoint<T = any>(
  endpoint: string
): Promise<T | null> {
  try {
    const r = await fetch(`${API_BASE_URL}${endpoint}`, { method: "GET" });
    if (!r.ok) {
      return null;
    }
    const json = await r.json();
    return json;
  } catch {
    return null;
  }
}

// Legacy no-op helpers (left exported so existing imports don’t break).
// They all resolve to empty data because the backend no longer serves
// these granular endpoints.

export async function fetchDietPlan(): Promise<string[]> {
  return [];
}

export async function fetchExerciseRoutine(): Promise<
  Array<{ activity: string; duration?: string; freq?: string }>
> {
  return [];
}

export async function fetchLifestyleChanges(): Promise<string[]> {
  return [];
}

export async function fetchStressManagement(): Promise<string[]> {
  return [];
}

export async function fetchMedicationAwareness(): Promise<string[]> {
  return [];
}

export async function fetchMealPlan(): Promise<Record<string, any>> {
  return {};
}

export async function fetchBreakfast(): Promise<Record<string, any>> {
  return {};
}

export async function fetchLunch(): Promise<Record<string, any>> {
  return {};
}

export async function fetchDinner(): Promise<Record<string, any>> {
  return {};
}

export async function fetchSnacks(): Promise<Record<string, any>> {
  return {};
}

export async function fetchFoodsToAvoid(): Promise<string[]> {
  return [];
}

export async function fetchWeeklyNutritionGoals(): Promise<
  Record<string, any>
> {
  return {};
}

export async function fetchHeartSafeExerciseGuide(): Promise<
  Record<string, any>
> {
  return {};
}

export async function fetchAerobicExercises(): Promise<
  Array<{ activity: string; duration?: string; freq?: string }>
> {
  return [];
}

export async function fetchStrengthTraining(): Promise<
  Array<{ activity: string; duration?: string; freq?: string }>
> {
  return [];
}

export async function fetchFlexibilityBalance(): Promise<string[]> {
  return [];
}

export async function fetchLowImpactCardio(): Promise<
  Array<{ activity: string; duration?: string; freq?: string }>
> {
  return [];
}

export async function fetchExerciseSafetyTips(): Promise<string[]> {
  return [];
}

export async function fetchUrgency(): Promise<Record<string, any>> {
  return {};
}

export async function fetchImmediateActions(): Promise<string[]> {
  return [];
}

export async function fetchRecommendedTests(): Promise<string[]> {
  return [];
}

export async function fetchFollowupMessage(): Promise<string> {
  return "";
}

export async function fetchPredictionSummary(): Promise<{
  prediction: string;
  probability: number | null;
  confidence: string;
}> {
  return { prediction: "", probability: null, confidence: "" };
}

/**
 * Fetch the complete Followup object from backend /get_followup.
 * Convenience wrapper around fetchFollowupRecommendations.
 */
export async function fetchFollowup(
  patientInputs: any,
  prediction: string,
  probability: number | null
): Promise<Followup> {
  return fetchFollowupRecommendations(patientInputs, prediction, probability);
}
