import { React, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Activity } from "lucide-react";

export interface FormData {
  age: string;
  restingBloodPressure: string;
  cholesterol: string;
  fastingBloodSugar: string;
  maxHeartRate: string;
  exerciseAngina: string;
  stDepression: string;
  sex: string;
  atypicalAnginalChest: string;
  nonAnginalChestPain: string;
  typicalAnginalChest: string;
  ecgLeftHypertrophy: string;
  ecgNormal: string;
  slopeFlat: string;
  slopeUpsloping: string;
}

interface PredictionFormProps {
  onSubmit: (data: FormData) => void;
  loading?: boolean;
  error?: string | null;
}

export function PredictionForm({
  onSubmit,
  loading = false,
  error = null,
}: PredictionFormProps) {
  const [formData, setFormData] = useState<FormData>({
    age: "49",
    restingBloodPressure: "160",
    cholesterol: "180",
    fastingBloodSugar: "normal",
    maxHeartRate: "156",
    exerciseAngina: "no",
    stDepression: "1.0",
    sex: "female",
    atypicalAnginalChest: "no",
    nonAnginalChestPain: "yes",
    typicalAnginalChest: "no",
    ecgLeftHypertrophy: "no",
    ecgNormal: "yes",
    slopeFlat: "yes",
    slopeUpsloping: "no",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section
      id="prediction-form"
      className="py-20 bg-gradient-to-br from-[#f6f6f6] to-white"
    >
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className="w-10 h-10 text-[#E63946]" />
          </div>
          <h2 className="mb-4 text-[#1a202c]">Check Your Heart Risk Now</h2>
          <p className="text-[#718096] max-w-2xl mx-auto">
            Fill in your health information to get an instant AI-powered heart
            disease risk assessment
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Your age..."
                  value={formData.age}
                  onChange={(e) => updateField("age", e.target.value)}
                  className="rounded-xl border-2 border-[#E8F4FF] focus:border-[#1C6DD0]"
                  required
                />
              </div>

              {/* Resting Blood Pressure */}
              <div className="space-y-2">
                <Label htmlFor="restingBloodPressure">
                  Resting Blood Pressure
                </Label>
                <Input
                  id="restingBloodPressure"
                  type="number"
                  placeholder="A number in range [94-200]"
                  value={formData.restingBloodPressure}
                  onChange={(e) =>
                    updateField("restingBloodPressure", e.target.value)
                  }
                  className="rounded-xl border-2 border-[#E8F4FF] focus:border-[#1C6DD0]"
                  required
                  min="94"
                  max="200"
                />
              </div>

              {/* Cholesterol */}
              <div className="space-y-2">
                <Label htmlFor="cholesterol">Cholesterol</Label>
                <Input
                  id="cholesterol"
                  type="number"
                  placeholder="A number in range [126-564]"
                  value={formData.cholesterol}
                  onChange={(e) => updateField("cholesterol", e.target.value)}
                  className="rounded-xl border-2 border-[#E8F4FF] focus:border-[#1C6DD0]"
                  required
                  min="126"
                  max="564"
                />
              </div>

              {/* Fasting Blood Sugar */}
              <div className="space-y-2">
                <Label htmlFor="fastingBloodSugar">Fasting Blood Sugar</Label>
                <Select
                  value={formData.fastingBloodSugar}
                  onValueChange={(value: string) =>
                    updateField("fastingBloodSugar", value)
                  }
                  required
                >
                  <SelectTrigger className="rounded-xl border-2 border-[#E8F4FF] focus:border-[#1C6DD0]">
                    <SelectValue placeholder="---select option---" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">
                      &lt; 120 mg/dL (Normal)
                    </SelectItem>
                    <SelectItem value="high">&gt; 120 mg/dL (High)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Max Heart Rate */}
              <div className="space-y-2">
                <Label htmlFor="maxHeartRate">Max Heart Rate</Label>
                <Input
                  id="maxHeartRate"
                  type="number"
                  placeholder="A number in range [71-202]"
                  value={formData.maxHeartRate}
                  onChange={(e) => updateField("maxHeartRate", e.target.value)}
                  className="rounded-xl border-2 border-[#E8F4FF] focus:border-[#1C6DD0]"
                  required
                  min="71"
                  max="202"
                />
              </div>

              {/* Exercise-induced Angina */}
              <div className="space-y-2">
                <Label htmlFor="exerciseAngina">Exercise-induced Angina</Label>
                <Select
                  value={formData.exerciseAngina}
                  onValueChange={(value) =>
                    updateField("exerciseAngina", value)
                  }
                  required
                >
                  <SelectTrigger className="rounded-xl border-2 border-[#E8F4FF] focus:border-[#1C6DD0]">
                    <SelectValue placeholder="---select option---" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ST depression */}
              <div className="space-y-2">
                <Label htmlFor="stDepression">ST depression</Label>
                <Input
                  id="stDepression"
                  type="number"
                  step="0.1"
                  min="0"
                  max="6.2"
                  placeholder="ST depression, typically 0–6.2"
                  value={formData.stDepression}
                  onChange={(e) => updateField("stDepression", e.target.value)}
                  className="rounded-xl border-2 border-[#E8F4FF] focus:border-[#1C6DD0]"
                  required
                />
              </div>

              {/* Sex */}
              <div className="space-y-2">
                <Label htmlFor="sex">Sex</Label>
                <Select
                  value={formData.sex}
                  onValueChange={(value) => updateField("sex", value)}
                  required
                >
                  <SelectTrigger className="rounded-xl border-2 border-[#E8F4FF] focus:border-[#1C6DD0]">
                    <SelectValue placeholder="---select option---" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Atypical Anginal Chest */}
              <div className="space-y-2">
                <Label htmlFor="atypicalAnginalChest">
                  Atypical Anginal Chest
                </Label>
                <Select
                  value={formData.atypicalAnginalChest}
                  onValueChange={(value: string) =>
                    updateField("atypicalAnginalChest", value)
                  }
                  required
                >
                  <SelectTrigger className="rounded-xl border-2 border-[#E8F4FF] focus:border-[#1C6DD0]">
                    <SelectValue placeholder="---select option---" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Non-anginal Chest Pain */}
              <div className="space-y-2">
                <Label htmlFor="nonAnginalChestPain">
                  Non-anginal Chest Pain
                </Label>
                <Select
                  value={formData.nonAnginalChestPain}
                  onValueChange={(value: string) =>
                    updateField("nonAnginalChestPain", value)
                  }
                  required
                >
                  <SelectTrigger className="rounded-xl border-2 border-[#E8F4FF] focus:border-[#1C6DD0]">
                    <SelectValue placeholder="---select option---" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Typical Anginal Chest */}
              <div className="space-y-2">
                <Label htmlFor="typicalAnginalChest">
                  Typical Anginal Chest
                </Label>
                <Select
                  value={formData.typicalAnginalChest}
                  onValueChange={(value: string) =>
                    updateField("typicalAnginalChest", value)
                  }
                  required
                >
                  <SelectTrigger className="rounded-xl border-2 border-[#E8F4FF] focus:border-[#1C6DD0]">
                    <SelectValue placeholder="---select option---" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ECG_left hypertrophy */}
              <div className="space-y-2">
                <Label htmlFor="ecgLeftHypertrophy">ECG_left hypertrophy</Label>
                <Select
                  value={formData.ecgLeftHypertrophy}
                  onValueChange={(value: string) =>
                    updateField("ecgLeftHypertrophy", value)
                  }
                  required
                >
                  <SelectTrigger className="rounded-xl border-2 border-[#E8F4FF] focus:border-[#1C6DD0]">
                    <SelectValue placeholder="---select option---" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ECG_Normal */}
              <div className="space-y-2">
                <Label htmlFor="ecgNormal">ECG_Normal</Label>
                <Select
                  value={formData.ecgNormal}
                  onValueChange={(value: string) =>
                    updateField("ecgNormal", value)
                  }
                  required
                >
                  <SelectTrigger className="rounded-xl border-2 border-[#E8F4FF] focus:border-[#1C6DD0]">
                    <SelectValue placeholder="---select option---" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* slope of the peak exercise ST segment - Flat */}
              <div className="space-y-2">
                <Label htmlFor="slopeFlat">
                  slope of the peak exercise ST segment - Flat
                </Label>
                <Select
                  value={formData.slopeFlat}
                  onValueChange={(value: string) =>
                    updateField("slopeFlat", value)
                  }
                  required
                >
                  <SelectTrigger className="rounded-xl border-2 border-[#E8F4FF] focus:border-[#1C6DD0]">
                    <SelectValue placeholder="---select option---" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* slope of the peak exercise ST segment - Upsloping */}
              <div className="space-y-2">
                <Label htmlFor="slopeUpsloping">
                  slope of the peak exercise ST segment - Upsloping
                </Label>
                <Select
                  value={formData.slopeUpsloping}
                  onValueChange={(value: string) =>
                    updateField("slopeUpsloping", value)
                  }
                  required
                >
                  <SelectTrigger className="rounded-xl border-2 border-[#E8F4FF] focus:border-[#1C6DD0]">
                    <SelectValue placeholder="---select option---" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E63946] hover:bg-[#d62839] text-white py-6 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Predict My Heart Risk"}
            </Button>

            {error && (
              <div className="mt-6 p-6 rounded-xl text-center font-semibold text-lg bg-red-100 text-red-800 border-2 border-red-300">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
