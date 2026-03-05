// import { useState, useEffect } from "react";
// import type { FormData } from "../components/PredictionForm";
// import { predictHeartRisk, PredictionResult } from "../services/api";

// const STORAGE_KEY = "cardiopredict_result";

// const getStoredResult = (): PredictionResult => {
//   try {
//     const stored = localStorage.getItem(STORAGE_KEY);
//     if (stored) {
//       return JSON.parse(stored);
//     }
//   } catch (e) {
//     console.error("Failed to parse stored result", e);
//   }
//   return { riskLevel: "low", prediction: 0 };
// };

// interface UsePredictionReturn {
//   loading: boolean;
//   error: string | null;
//   result: PredictionResult;
//   submitPrediction: (formData: FormData) => Promise<boolean>;
//   resetError: () => void;
// }

// /**
//  * Custom hook to manage heart disease prediction state and API calls
//  */
// export function usePrediction(): UsePredictionReturn {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [result, setResult] = useState<PredictionResult>(getStoredResult);

//   // Save result to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
//   }, [result]);

//   const submitPrediction = async (formData: FormData): Promise<boolean> => {
//     setLoading(true);
//     setError(null);

//     try {
//       const predictionResult = await predictHeartRisk(formData);
//       setResult(predictionResult);
//       setLoading(false);
//       return true; // Success
//     } catch (err) {
//       console.error(err);
//       setError(
//         err instanceof Error
//           ? err.message
//           : "Could not connect to backend. Make sure the server is running."
//       );
//       setLoading(false);
//       return false; // Failure
//     }
//   };

//   const resetError = () => setError(null);

//   return {
//     loading,
//     error,
//     result,
//     submitPrediction,
//     resetError,
//   };
// }

// src/hooks/usePrediction.ts
import { useState, useEffect } from "react";
import type { FormData } from "../components/PredictionForm";
import { predictHeartRisk, type PredictionResult } from "../services/api";

const STORAGE_KEY = "cardiopredict_result";

const getDefaultResult = (): PredictionResult => ({
  riskLevel: "low",
  prediction: 0,
  probability: null,
});

const getStoredResult = (): PredictionResult => {
  if (typeof window === "undefined") {
    return getDefaultResult();
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // very light validation
      if (
        parsed &&
        (parsed.riskLevel === "low" || parsed.riskLevel === "high") &&
        (parsed.prediction === 0 || parsed.prediction === 1)
      ) {
        return {
          riskLevel: parsed.riskLevel,
          prediction: parsed.prediction,
          probability:
            typeof parsed.probability === "number" ? parsed.probability : null,
          followup: parsed.followup,
          patientInputs: parsed.patientInputs,
        };
      }
    }
  } catch (e) {
    console.error("Failed to parse stored result", e);
  }

  return getDefaultResult();
};

interface UsePredictionReturn {
  loading: boolean;
  error: string | null;
  result: PredictionResult;
  patientData: FormData | null;
  submitPrediction: (formData: FormData) => Promise<boolean>;
  resetError: () => void;
}

/**
 * Custom hook to manage heart disease prediction state and API calls
 */
export function usePrediction(): UsePredictionReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult>(getStoredResult);
  const [patientData, setPatientData] = useState<FormData | null>(null);

  // Save result to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    } catch (e) {
      console.error("Failed to persist prediction result", e);
    }
  }, [result]);

  const submitPrediction = async (formData: FormData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const predictionResult = await predictHeartRisk(formData);
      setResult(predictionResult);
      setPatientData(formData); // Store patient data
      setLoading(false);
      return true; // success
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Could not connect to backend. Make sure the server is running."
      );
      setLoading(false);
      return false; // failure
    }
  };

  const resetError = () => setError(null);

  return {
    loading,
    error,
    result,
    patientData,
    submitPrediction,
    resetError,
  };
}
