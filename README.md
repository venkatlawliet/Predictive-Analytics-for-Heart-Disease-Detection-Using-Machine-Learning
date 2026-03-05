# Predictive Analytics for Heart Disease Detection Using Machine Learning

This repository contains two project folders:

- `Cardio-Predict` (frontend, React + Vite)
- `Heart` (backend/API + ML model, Python + Flask)

## Project Structure

```text
.
├── Cardio-Predict/
└── Heart/
```

## Run Locally

### 1) Backend (`Heart`)

```bash
cd Heart
python -m venv venv
# activate venv
pip install -r requirements.txt
python app.py
```

Backend runs on `http://127.0.0.1:8000` by default.

### 2) Frontend (`Cardio-Predict`)

```bash
cd Cardio-Predict
npm install
npm run dev
```

Frontend runs on Vite dev server (usually `http://127.0.0.1:5173`).

If needed, set `VITE_API_BASE_URL` in frontend `.env` to point to backend URL.

