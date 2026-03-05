import React from "react";
import { AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from "lucide-react";
import type { FormData } from "./PredictionForm";

interface PatientDetailsProps {
  patientData: FormData;
}

function getStatus(
  value: number,
  field: "restingBloodPressure" | "cholesterol" | "maxHeartRate" | "stDepression",
  age?: number
): {
  status: "normal" | "high" | "low";
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  message: string;
  reference: string;
} {
  if (field === "restingBloodPressure") {
    if (value >= 140) {
      return {
        status: "high",
        color: "#E63946",
        icon: AlertTriangle,
        message: "⚠️ High - Consider lifestyle changes and consult your doctor",
        reference: "Normal range: 90-120 mmHg | High: 120-140 mmHg | Very High: ≥140 mmHg",
      };
    }
    if (value >= 120) {
      return {
        status: "high",
        color: "#F59E0B",
        icon: TrendingUp,
        message: "⚠️ Elevated - Monitor and consider lifestyle changes",
        reference: "Normal range: 90-120 mmHg | High: 120-140 mmHg | Very High: ≥140 mmHg",
      };
    }
    if (value < 90) {
      return {
        status: "low",
        color: "#3B82F6",
        icon: TrendingDown,
        message: "ℹ️ Low - Monitor regularly",
        reference: "Normal range: 90-120 mmHg",
      };
    }
    return {
      status: "normal",
      color: "#10B981",
      icon: CheckCircle,
      message: "✓ Within normal range",
      reference: "Normal range: 90-120 mmHg",
    };
  }

  if (field === "cholesterol") {
    if (value >= 240) {
      return {
        status: "high",
        color: "#E63946",
        icon: AlertTriangle,
        message: "⚠️ Very High - Dietary changes and medical consultation recommended",
        reference: "Normal: <200 mg/dL | High: 200-240 mg/dL | Very High: ≥240 mg/dL",
      };
    }
    if (value >= 200) {
      return {
        status: "high",
        color: "#F59E0B",
        icon: TrendingUp,
        message: "⚠️ Elevated - Dietary changes recommended",
        reference: "Normal: <200 mg/dL | High: 200-240 mg/dL | Very High: ≥240 mg/dL",
      };
    }
    return {
      status: "normal",
      color: "#10B981",
      icon: CheckCircle,
      message: "✓ Within normal range",
      reference: "Normal: <200 mg/dL | High: 200-240 mg/dL | Very High: ≥240 mg/dL",
    };
  }

  if (field === "maxHeartRate" && age) {
    const maxHR = 220 - age;
    const percentMax = (value / maxHR) * 100;
    
    if (percentMax > 95) {
      return {
        status: "high",
        color: "#E63946",
        icon: AlertTriangle,
        message: "⚠️ Very high - Consult doctor",
        reference: `Max HR: 220 - Age = ${maxHR} bpm | Your value: ${value} bpm (${percentMax.toFixed(0)}%)`,
      };
    }
    if (percentMax < 50) {
      return {
        status: "low",
        color: "#3B82F6",
        icon: TrendingDown,
        message: "ℹ️ Low - May indicate reduced fitness",
        reference: `Max HR: 220 - Age = ${maxHR} bpm | Your value: ${value} bpm (${percentMax.toFixed(0)}%)`,
      };
    }
    return {
      status: "normal",
      color: "#10B981",
      icon: CheckCircle,
      message: `✓ Within expected range (${percentMax.toFixed(0)}% of max)`,
      reference: `Max HR: 220 - Age = ${maxHR} bpm | Target: 50-95% of max (${Math.round(maxHR * 0.5)}-${Math.round(maxHR * 0.95)} bpm)`,
    };
  }

  if (field === "stDepression") {
    if (value >= 2.0) {
      return {
        status: "high",
        color: "#E63946",
        icon: AlertTriangle,
        message: "⚠️ High - May indicate significant heart stress",
        reference: "Normal: 0-0.5 mm | Elevated: 0.5-2.0 mm | High: ≥2.0 mm",
      };
    }
    if (value >= 0.5) {
      return {
        status: "high",
        color: "#F59E0B",
        icon: TrendingUp,
        message: "⚠️ Elevated - May indicate heart stress during exercise",
        reference: "Normal: 0-0.5 mm | Elevated: 0.5-2.0 mm | High: ≥2.0 mm",
      };
    }
    return {
      status: "normal",
      color: "#10B981",
      icon: CheckCircle,
      message: "✓ Normal",
      reference: "Normal: 0-0.5 mm | Elevated: 0.5-2.0 mm | High: ≥2.0 mm",
    };
  }

  return {
    status: "normal",
    color: "#10B981",
    icon: CheckCircle,
    message: "✓ Normal",
    reference: "",
  };
}

export function PatientDetails({ patientData }: PatientDetailsProps) {
  const formatValue = (field: keyof FormData): string => {
    const value = patientData[field];

    if (field === "sex") return value === "male" ? "Male" : "Female";
    if (field === "fastingBloodSugar")
      return value === "high" ? "High (>120 mg/dL)" : "Normal (≤120 mg/dL)";
    if (field === "exerciseAngina") return value === "yes" ? "Yes" : "No";

    // Binary fields
    const binaryFields = [
      "atypicalAnginalChest",
      "nonAnginalChestPain",
      "typicalAnginalChest",
      "ecgLeftHypertrophy",
      "ecgNormal",
      "slopeFlat",
      "slopeUpsloping",
    ];
    if (binaryFields.includes(field)) {
      return value === "yes" ? "Yes" : "No";
    }

    return value.toString();
  };

  const age = Number(patientData.age);
  const bpStatus = getStatus(
    Number(patientData.restingBloodPressure),
    "restingBloodPressure"
  );
  const cholStatus = getStatus(Number(patientData.cholesterol), "cholesterol");
  const hrStatus = getStatus(
    Number(patientData.maxHeartRate),
    "maxHeartRate",
    age
  );
  const stStatus = getStatus(Number(patientData.stDepression), "stDepression");

  // Count statuses for summary
  const highCount = [bpStatus, cholStatus, hrStatus, stStatus].filter(
    (s) => s.status === "high"
  ).length;
  const elevatedCount = [bpStatus, cholStatus, hrStatus, stStatus].filter(
    (s) => s.status === "high" && s.color === "#F59E0B"
  ).length;
  const normalCount = [bpStatus, cholStatus, hrStatus, stStatus].filter(
    (s) => s.status === "normal"
  ).length;

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
      <h2 className="text-2xl font-bold text-[#1a202c] mb-6">Your Health Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Demographics */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#1a202c] mb-4">
            Demographics
          </h3>

          <div className="p-4 bg-[#f6f6f6] rounded-xl hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[#718096]">Age</span>
              <span className="font-semibold text-[#1a202c]">
                {patientData.age} years
              </span>
            </div>
          </div>

          <div className="p-4 bg-[#f6f6f6] rounded-xl hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[#718096]">Sex</span>
              <span className="font-semibold text-[#1a202c]">
                {formatValue("sex")}
              </span>
            </div>
          </div>
        </div>

        {/* Vital Signs */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#1a202c] mb-4">
            Vital Signs
          </h3>

          {/* Blood Pressure */}
          <div
            className="p-4 rounded-xl border-2 transition-all hover:shadow-lg"
            style={{
              backgroundColor: `${bpStatus.color}15`,
              borderColor: bpStatus.color,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <bpStatus.icon
                  className="w-5 h-5 shrink-0"
                  style={{ color: bpStatus.color }}
                />
                <span className="text-[#718096] font-medium">
                  Resting Blood Pressure
                </span>
              </div>
              <span className="font-bold text-[#1a202c] text-lg">
                {patientData.restingBloodPressure} mmHg
              </span>
            </div>
            <div className="text-xs font-medium mt-1" style={{ color: bpStatus.color }}>
              {bpStatus.message}
            </div>
            <div className="text-xs text-[#718096] mt-1">{bpStatus.reference}</div>
          </div>

          {/* Cholesterol */}
          <div
            className="p-4 rounded-xl border-2 transition-all hover:shadow-lg"
            style={{
              backgroundColor: `${cholStatus.color}15`,
              borderColor: cholStatus.color,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <cholStatus.icon
                  className="w-5 h-5 shrink-0"
                  style={{ color: cholStatus.color }}
                />
                <span className="text-[#718096] font-medium">Cholesterol</span>
              </div>
              <span className="font-bold text-[#1a202c] text-lg">
                {patientData.cholesterol} mg/dL
              </span>
            </div>
            <div
              className="text-xs font-medium mt-1"
              style={{ color: cholStatus.color }}
            >
              {cholStatus.message}
            </div>
            <div className="text-xs text-[#718096] mt-1">
              {cholStatus.reference}
            </div>
          </div>

          {/* Max Heart Rate */}
          <div
            className="p-4 rounded-xl border-2 transition-all hover:shadow-lg"
            style={{
              backgroundColor: `${hrStatus.color}15`,
              borderColor: hrStatus.color,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <hrStatus.icon
                  className="w-5 h-5 shrink-0"
                  style={{ color: hrStatus.color }}
                />
                <span className="text-[#718096] font-medium">Max Heart Rate</span>
              </div>
              <span className="font-bold text-[#1a202c] text-lg">
                {patientData.maxHeartRate} bpm
              </span>
            </div>
            <div
              className="text-xs font-medium mt-1"
              style={{ color: hrStatus.color }}
            >
              {hrStatus.message}
            </div>
            <div className="text-xs text-[#718096] mt-1">{hrStatus.reference}</div>
          </div>

          {/* ST Depression */}
          <div
            className="p-4 rounded-xl border-2 transition-all hover:shadow-lg"
            style={{
              backgroundColor: `${stStatus.color}15`,
              borderColor: stStatus.color,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <stStatus.icon
                  className="w-5 h-5 shrink-0"
                  style={{ color: stStatus.color }}
                />
                <span className="text-[#718096] font-medium">ST Depression</span>
              </div>
              <span className="font-bold text-[#1a202c] text-lg">
                {patientData.stDepression} mm
              </span>
            </div>
            <div
              className="text-xs font-medium mt-1"
              style={{ color: stStatus.color }}
            >
              {stStatus.message}
            </div>
            <div className="text-xs text-[#718096] mt-1">{stStatus.reference}</div>
          </div>
        </div>

        {/* Other Health Factors */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-[#1a202c] mb-4">
            Other Health Factors
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-[#f6f6f6] rounded-xl hover:shadow-md transition-shadow">
              <div className="text-sm text-[#718096] mb-1 font-medium">
                Fasting Blood Sugar
              </div>
              <div className="font-semibold text-[#1a202c]">
                {formatValue("fastingBloodSugar")}
              </div>
            </div>

            <div className="p-4 bg-[#f6f6f6] rounded-xl hover:shadow-md transition-shadow">
              <div className="text-sm text-[#718096] mb-1 font-medium">
                Exercise Angina
              </div>
              <div className="font-semibold text-[#1a202c]">
                {formatValue("exerciseAngina")}
              </div>
              <div className="text-xs text-[#718096] mt-1">
                {patientData.exerciseAngina === "yes"
                  ? "Chest pain during exercise"
                  : "No chest pain during exercise"}
              </div>
            </div>

            <div className="p-4 bg-[#f6f6f6] rounded-xl hover:shadow-md transition-shadow">
              <div className="text-sm text-[#718096] mb-1 font-medium">
                ECG Result
              </div>
              <div className="font-semibold text-[#1a202c]">
                {formatValue("ecgNormal")}
              </div>
              <div className="text-xs text-[#718096] mt-1">
                {patientData.ecgNormal === "yes"
                  ? "Resting ECG normal"
                  : "ECG abnormality present"}
              </div>
            </div>

            <div className="p-4 bg-[#f6f6f6] rounded-xl hover:shadow-md transition-shadow">
              <div className="text-sm text-[#718096] mb-1 font-medium">
                Chest Pain Type
              </div>
              <div className="font-semibold text-[#1a202c]">
                {patientData.typicalAnginalChest === "yes"
                  ? "Typical"
                  : patientData.atypicalAnginalChest === "yes"
                  ? "Atypical"
                  : patientData.nonAnginalChestPain === "yes"
                  ? "Non-anginal"
                  : "None"}
              </div>
              <div className="text-xs text-[#718096] mt-1">
                {patientData.typicalAnginalChest === "yes"
                  ? "Typical angina"
                  : patientData.atypicalAnginalChest === "yes"
                  ? "Atypical angina"
                  : patientData.nonAnginalChestPain === "yes"
                  ? "Non-cardiac related"
                  : "No chest pain"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      {(highCount > 0 || elevatedCount > 0) && (
        <div className="mt-8 p-6 bg-gradient-to-br from-[#E8F4FF] to-white rounded-2xl border-2 border-[#1C6DD0]">
          <h4 className="text-lg font-semibold text-[#1a202c] mb-3">Summary</h4>
          <div className="space-y-2 text-sm text-[#718096]">
            {highCount > 0 && (
              <div className="flex items-start gap-2">
                <span className="text-[#E63946] font-bold">•</span>
                <span>
                  <strong>{highCount} value{highCount > 1 ? "s" : ""} need{highCount === 1 ? "s" : ""} attention:</strong>{" "}
                  {bpStatus.status === "high" && bpStatus.color === "#E63946" && (
                    <>Resting Blood Pressure is high ({patientData.restingBloodPressure} mmHg). </>
                  )}
                  {cholStatus.status === "high" && cholStatus.color === "#E63946" && (
                    <>Cholesterol is very high ({patientData.cholesterol} mg/dL). </>
                  )}
                  {hrStatus.status === "high" && hrStatus.color === "#E63946" && (
                    <>Max Heart Rate is very high ({patientData.maxHeartRate} bpm). </>
                  )}
                  {stStatus.status === "high" && stStatus.color === "#E63946" && (
                    <>ST Depression is high ({patientData.stDepression} mm).</>
                  )}
                </span>
              </div>
            )}
            {elevatedCount > 0 && (
              <div className="flex items-start gap-2">
                <span className="text-[#F59E0B] font-bold">•</span>
                <span>
                  <strong>{elevatedCount} value{elevatedCount > 1 ? "s" : ""} elevated:</strong>{" "}
                  {bpStatus.status === "high" && bpStatus.color === "#F59E0B" && (
                    <>Resting Blood Pressure ({patientData.restingBloodPressure} mmHg) - monitor regularly. </>
                  )}
                  {cholStatus.status === "high" && cholStatus.color === "#F59E0B" && (
                    <>Cholesterol ({patientData.cholesterol} mg/dL) - consider dietary changes. </>
                  )}
                  {stStatus.status === "high" && stStatus.color === "#F59E0B" && (
                    <>ST Depression ({patientData.stDepression} mm) - monitor during exercise.</>
                  )}
                </span>
              </div>
            )}
            {normalCount > 0 && (
              <div className="flex items-start gap-2">
                <span className="text-[#10B981] font-bold">•</span>
                <span>
                  <strong>{normalCount} value{normalCount > 1 ? "s" : ""} normal:</strong>{" "}
                  {bpStatus.status === "normal" && "Resting Blood Pressure, "}
                  {cholStatus.status === "normal" && "Cholesterol, "}
                  {hrStatus.status === "normal" && "Max Heart Rate, "}
                  {stStatus.status === "normal" && "ST Depression "}
                  are within healthy ranges.
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

