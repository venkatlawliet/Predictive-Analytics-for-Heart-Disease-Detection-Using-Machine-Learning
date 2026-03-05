import React, { useState, useEffect } from "react";
import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "../components/ui/button";
import { ResultsSummary } from "../components/ResultsSummary";
import { AISuggestions } from "../components/AISuggestions";
import { NearbyDoctors } from "../components/NearbyDoctors";
import { DietPlan } from "../components/DietPlan";
import { ExerciseGuide } from "../components/ExerciseGuide";
import { PatientDetails } from "../components/PatientDetails";
import { Footer } from "../components/Footer";
import { fetchFollowup, type Followup } from "../services/api";
import type { FormData } from "../components/PredictionForm";

interface ResultsPageProps {
  onBackToHome: () => void;
  riskLevel: "low" | "high";
  probability: number | null;
  patientData: FormData | null;
  // Optional pre-fetched followup for low-risk predictions
  initialFollowup?: Followup | undefined;
}

export function ResultsPage({
  onBackToHome,
  riskLevel,
  probability,
  patientData,
  initialFollowup,
}: ResultsPageProps) {
  const [showRecommendations, setShowRecommendations] = useState(
    riskLevel === "low"
  );
  const [showPrompt, setShowPrompt] = useState(riskLevel === "high");

  const [followupLoading, setFollowupLoading] = useState(false);
  const [followupError, setFollowupError] = useState<string | null>(null);
  const [followupData, setFollowupData] = useState<Followup | null>(
    initialFollowup ?? null
  );

  const handleRequestRecommendations = async () => {
    setShowRecommendations(true);
    setShowPrompt(false);

    // If we already have followup data (e.g., low-risk template), avoid refetching
    if (followupData) return;

    setFollowupLoading(true);
    setFollowupError(null);

    try {
      // Build patient inputs from patientData (stateless approach)
      const patientInputs = patientData
        ? {
            age: Number(patientData.age),
            sex: patientData.sex === "male" ? 1 : 0,
            trestbps: Number(patientData.restingBloodPressure),
            chol: Number(patientData.cholesterol),
            fbs: patientData.fastingBloodSugar === "high" ? 1 : 0,
            thalach: Number(patientData.maxHeartRate),
            exang: patientData.exerciseAngina === "yes" ? 1 : 0,
            oldpeak: Number(patientData.stDepression),
            chest_pain_flags: {
              cp1: patientData.typicalAnginalChest === "yes" ? 1 : 0,
              cp2: patientData.atypicalAnginalChest === "yes" ? 1 : 0,
              cp3: patientData.nonAnginalChestPain === "yes" ? 1 : 0,
            },
            restecg: {
              left: patientData.ecgLeftHypertrophy === "yes" ? 1 : 0,
              normal: patientData.ecgNormal === "yes" ? 1 : 0,
            },
            slope: {
              slope1: patientData.slopeUpsloping === "yes" ? 1 : 0,
              slope2: patientData.slopeFlat === "yes" ? 1 : 0,
            },
          }
        : undefined;

      // For low-risk users, we should already have a template followup from /predict.
      // Only call /get_followup when we have patient data and need high-risk, LLM-backed
      // recommendations or when template was not available.
      if (!patientInputs) {
        throw new Error(
          "Missing patient data for follow-up generation. Please resubmit the form."
        );
      }

      const label = riskLevel === "high" ? "positive" : "negative";

      const data = await fetchFollowup(patientInputs, label, probability ?? null);
      setFollowupData(data);
    } catch (err) {
      console.error("Failed to fetch followup:", err);
      setFollowupError(
        err instanceof Error ? err.message : "Failed to fetch recommendations"
      );
    } finally {
      setFollowupLoading(false);
    }
  };

  // Automatically fetch followup for low-risk users
  useEffect(() => {
    if (riskLevel === "low" && !followupData && !followupLoading) {
      handleRequestRecommendations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [riskLevel]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f6f6] to-white">
      {/* Header */}
      <div className="bg-white border-b border-[#E8F4FF] sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-[#E63946]" fill="#E63946" />
            <span className="text-2xl text-[#1C6DD0]">CardioPredict</span>
          </div>
          <Button
            onClick={onBackToHome}
            variant="outline"
            className="border-2 border-[#1C6DD0] text-[#1C6DD0] hover:bg-[#E8F4FF] rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        <ResultsSummary
          riskLevel={riskLevel}
          probability={probability}
          onRequestRecommendations={handleRequestRecommendations}
          showRecommendationPrompt={showPrompt}
        />

        {/* Patient Details */}
        {patientData && <PatientDetails patientData={patientData} />}

        {showRecommendations && (
          <>
            {/* Always show AISuggestions when recommendations are requested */}
            <AISuggestions
              followup={followupData}
              loading={followupLoading}
              error={followupError}
              riskLevel={riskLevel}
            />

            {/* Only show other components when loading is complete and data is available */}
            {!followupLoading && followupData && (
              <>
                <DietPlan followup={followupData} />
                <ExerciseGuide followup={followupData} />
                <NearbyDoctors />
              </>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
