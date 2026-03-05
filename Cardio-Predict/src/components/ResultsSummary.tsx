import * as React from "react";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";

interface ResultsSummaryProps {
  riskLevel: "low" | "high";
  probability: number | null;
  onRequestRecommendations?: () => void;
  showRecommendationPrompt: boolean;
}

export function ResultsSummary({
  riskLevel,
  probability,
  onRequestRecommendations,
  showRecommendationPrompt,
}: ResultsSummaryProps) {
  const config = {
    low: {
      color: "#10B981",
      bg: "#D1FAE5",
      icon: CheckCircle,
      title: "Low Risk",
      description:
        "Your heart disease risk is low based on the provided data. Keep up the healthy lifestyle!",
    },
    high: {
      color: "#E63946",
      bg: "#FEE2E2",
      icon: AlertCircle,
      title: "High Risk",
      description:
        "You have elevated risk factors. Please consult a cardiologist soon for a professional evaluation.",
    },
  };

  const { color, bg, icon: Icon, title, description } = config[riskLevel];

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
      <div className="text-center">
        <div
          className="w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: bg }}
        >
          <Icon className="w-16 h-16" style={{ color }} />
        </div>

        <h2 className="mb-4 text-[#1a202c]">Prediction Result</h2>
        <div
          className="inline-block px-8 py-3 rounded-xl mb-4"
          style={{ backgroundColor: bg }}
        >
          <span className="text-2xl" style={{ color }}>
            {title}
          </span>
        </div>

        {probability !== null && (
          <div className="mb-6 px-6 py-4 rounded-2xl border-2 max-w-md mx-auto" style={{ 
            backgroundColor: `${riskLevel === "high" ? "#E63946" : "#10B981"}15`,
            borderColor: riskLevel === "high" ? "#E63946" : "#10B981"
          }}>
            <p className="text-base text-[#718096] mb-3 text-center">
              Risk Probability
            </p>
            <div className="text-center mb-3">
              <span 
                className="text-4xl font-bold"
                style={{ color: riskLevel === "high" ? "#E63946" : "#10B981" }}
              >
                {(probability * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
              <div
                className="h-4 rounded-full transition-all duration-500 shadow-sm"
                style={{
                  width: `${probability * 100}%`,
                  backgroundColor: riskLevel === "high" ? "#E63946" : "#10B981"
                }}
              />
            </div>
          </div>
        )}

        <div
          className="mb-6 max-w-xl mx-auto px-6 py-4 rounded-2xl border-2 border-gray-300 bg-gray-50"
        >
          <p className="text-lg font-medium text-[#1a202c]">
            {description}
          </p>
        </div>

        {showRecommendationPrompt && (
          <div className="mt-8 p-4 bg-[#E8F4FF] rounded-xl border-l-4 border-[#1C6DD0]">
            <p className="text-sm text-[#718096]">
              <strong className="text-[#1a202c]">Disclaimer:</strong> This is an
              AI prediction for educational purposes only. Always consult with a
              qualified healthcare professional for medical advice.
            </p>
          </div>
        )}

        {/* Recommendation Prompt for High Risk */}
        {showRecommendationPrompt && riskLevel === "high" && (
          <div className="mt-8 p-6 bg-gradient-to-br from-[#E8F4FF] to-white rounded-2xl border-2 border-[#1C6DD0]">
            <h3 className="text-[#1a202c] mb-3 text-center">
              Would you like AI-powered follow-up recommendations?
            </h3>
            <p className="text-sm text-[#718096] mb-6 text-center">
              Get personalized diet plans, exercise guides, nearby doctors, and
              lifestyle suggestions to improve your heart health.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={onRequestRecommendations}
                className="bg-[#1C6DD0] hover:bg-[#1557a8] text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Yes, Show Recommendations
              </Button>
              <Button
                onClick={onRequestRecommendations}
                variant="outline"
                className="border-2 border-[#718096] text-[#718096] hover:bg-[#f6f6f6] px-8 py-3 rounded-xl"
              >
                No, Thanks
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
