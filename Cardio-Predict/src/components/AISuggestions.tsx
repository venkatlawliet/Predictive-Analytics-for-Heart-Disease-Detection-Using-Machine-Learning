// import { Lightbulb, Utensils, Activity, Heart, Pill, Brain } from 'lucide-react';

// const suggestions = [
//   {
//     icon: Utensils,
//     title: 'Diet Plan',
//     color: '#1C6DD0',
//     tips: [
//       'Increase omega-3 rich foods (salmon, walnuts, flaxseeds)',
//       'Reduce sodium intake to less than 2,300mg per day',
//       'Eat 5-7 servings of fruits and vegetables daily',
//       'Choose whole grains over refined carbohydrates',
//       'Limit saturated fats and avoid trans fats',
//     ],
//   },
//   {
//     icon: Activity,
//     title: 'Exercise Routine',
//     color: '#E63946',
//     tips: [
//       '150 minutes of moderate aerobic activity per week',
//       '30-minute brisk walks 5 days a week',
//       'Include strength training twice weekly',
//       'Practice low-impact exercises like swimming or cycling',
//       'Start slowly and gradually increase intensity',
//     ],
//   },
//   {
//     icon: Heart,
//     title: 'Lifestyle Changes',
//     color: '#10B981',
//     tips: [
//       'Quit smoking and avoid secondhand smoke',
//       'Limit alcohol consumption',
//       'Maintain a healthy weight (BMI 18.5-24.9)',
//       'Get 7-9 hours of quality sleep each night',
//       'Monitor blood pressure regularly at home',
//     ],
//   },
//   {
//     icon: Brain,
//     title: 'Stress Management',
//     color: '#8B5CF6',
//     tips: [
//       'Practice meditation or mindfulness for 10-15 minutes daily',
//       'Try deep breathing exercises when stressed',
//       'Engage in hobbies and activities you enjoy',
//       'Maintain strong social connections',
//       'Consider yoga or tai chi for relaxation',
//     ],
//   },
//   {
//     icon: Pill,
//     title: 'Medication Awareness',
//     color: '#F59E0B',
//     tips: [
//       'Discuss statin therapy with your doctor if appropriate',
//       'Consider low-dose aspirin after consulting physician',
//       'Take prescribed medications as directed',
//       'Monitor for side effects and report to doctor',
//       'Regular blood tests to check cholesterol levels',
//     ],
//   },
// ];

// export function AISuggestions() {
//   return (
//     <div className="space-y-6">
//       <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
//         <div className="flex items-center gap-3 mb-6">
//           <Lightbulb className="w-8 h-8 text-[#F59E0B]" />
//           <h2 className="text-[#1a202c]">Personalized AI Recommendations</h2>
//         </div>
//         <p className="text-[#718096] mb-8">
//           Based on your health profile, here are customized recommendations to improve your cardiovascular health:
//         </p>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {suggestions.map((suggestion, index) => {
//             const Icon = suggestion.icon;
//             return (
//               <div
//                 key={index}
//                 className="bg-[#f6f6f6] rounded-2xl p-6 hover:shadow-lg transition-shadow"
//               >
//                 <div className="flex items-center gap-3 mb-4">
//                   <div
//                     className="w-12 h-12 rounded-xl flex items-center justify-center"
//                     style={{ backgroundColor: `${suggestion.color}15` }}
//                   >
//                     <Icon className="w-6 h-6" style={{ color: suggestion.color }} />
//                   </div>
//                   <h3 className="text-[#1a202c]">{suggestion.title}</h3>
//                 </div>

//                 <ul className="space-y-2">
//                   {suggestion.tips.map((tip, tipIndex) => (
//                     <li key={tipIndex} className="flex items-start gap-2 text-sm text-[#718096]">
//                       <span
//                         className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
//                         style={{ backgroundColor: suggestion.color }}
//                       />
//                       <span>{tip}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";
import {
  Lightbulb,
  Utensils,
  Activity,
  Heart,
  Pill,
  Brain,
} from "lucide-react";

const staticSuggestions = [
  {
    icon: Utensils,
    title: "Diet Plan",
    color: "#1C6DD0",
    tips: [
      "Increase omega-3 rich foods (salmon, walnuts, flaxseeds)",
      "Reduce sodium intake to less than 2,300mg per day",
      "Eat 5-7 servings of fruits and vegetables daily",
      "Choose whole grains over refined carbohydrates",
      "Limit saturated fats and avoid trans fats",
    ],
  },
  {
    icon: Activity,
    title: "Exercise Routine",
    color: "#E63946",
    tips: [
      "150 minutes of moderate aerobic activity per week",
      "30-minute brisk walks 5 days a week",
      "Include strength training twice weekly",
      "Practice low-impact exercises like swimming or cycling",
      "Start slowly and gradually increase intensity",
    ],
  },
  {
    icon: Heart,
    title: "Lifestyle Changes",
    color: "#10B981",
    tips: [
      "Quit smoking and avoid secondhand smoke",
      "Limit alcohol consumption",
      "Maintain a healthy weight (BMI 18.5-24.9)",
      "Get 7-9 hours of quality sleep each night",
      "Monitor blood pressure regularly at home",
    ],
  },
  {
    icon: Brain,
    title: "Stress Management",
    color: "#8B5CF6",
    tips: [
      "Practice meditation or mindfulness for 10-15 minutes daily",
      "Try deep breathing exercises when stressed",
      "Engage in hobbies and activities you enjoy",
      "Maintain strong social connections",
      "Consider yoga or tai chi for relaxation",
    ],
  },
  {
    icon: Pill,
    title: "Medication Awareness",
    color: "#F59E0B",
    tips: [
      "Discuss statin therapy with your doctor if appropriate",
      "Consider low-dose aspirin after consulting physician",
      "Take prescribed medications as directed",
      "Monitor for side effects and report to doctor",
      "Regular blood tests to check cholesterol levels",
    ],
  },
];

interface AISuggestionsProps {
  followup?: any | null;
  loading?: boolean;
  error?: string | null;
  riskLevel?: "low" | "high";
}

function formatExerciseTips(exerciseArray: any[] | undefined) {
  if (!exerciseArray || !Array.isArray(exerciseArray)) return [];
  return exerciseArray.map((e) => {
    if (typeof e === "string") return e;
    const parts: string[] = [];
    if (e.activity) parts.push(e.activity);
    if (e.duration) parts.push(`(${e.duration})`);
    if (e.freq) parts.push(`- ${e.freq}`);
    return parts.join(" ");
  });
}

export function AISuggestions({
  followup,
  loading,
  error,
  riskLevel,
}: AISuggestionsProps) {
  // Compose suggestions from followup if present
  const suggestions = followup
    ? [
        {
          icon: Utensils,
          title: "Diet Plan",
          color: "#1C6DD0",
          tips: Array.isArray(followup.diet_plan)
            ? followup.diet_plan.slice(0, 5)
            : [],
        },
        {
          icon: Activity,
          title: "Exercise Routine",
          color: "#E63946",
          tips: formatExerciseTips(followup.exercise_routine).slice(0, 5),
        },
        {
          icon: Heart,
          title: "Lifestyle Changes",
          color: "#10B981",
          tips: Array.isArray(followup.lifestyle_changes)
            ? followup.lifestyle_changes.slice(0, 5)
            : [],
        },
        {
          icon: Brain,
          title: "Stress Management",
          color: "#8B5CF6",
          tips: Array.isArray(followup.stress_management)
            ? followup.stress_management.slice(0, 5)
            : [],
        },
        {
          icon: Pill,
          title: "Medication Awareness",
          color: "#F59E0B",
          tips: Array.isArray(followup.medication_awareness)
            ? followup.medication_awareness.slice(0, 5)
            : [],
        },
      ]
    : staticSuggestions;

  // Determine title based on risk level
  const title =
    riskLevel === "low"
      ? "Generic Health Recommendations"
      : "Personalized AI Recommendations";

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb className="w-8 h-8 text-[#F59E0B]" />
          <h2 className="text-[#1a202c]">{title}</h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 px-6">
            {/* Animated Heart with Spinner */}
            <div className="relative mb-6">
              {/* Pulsing Heart Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart
                  className="w-16 h-16 text-[#E63946] animate-pulse"
                  fill="#E63946"
                />
              </div>
              {/* Spinning Ring */}
              <div className="w-20 h-20 border-4 border-[#E8F4FF] border-t-[#1C6DD0] rounded-full animate-spin"></div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-[#1a202c] mb-2">
              Generating Your Personalized Plan
            </h3>

            {/* Description */}
            <p className="text-[#718096] text-center max-w-md mb-4">
              Our AI is analyzing your health profile and creating customized
              recommendations for diet, exercise, and lifestyle changes.
            </p>

            {/* Loading Dots Animation */}
            <div className="flex gap-2 mt-4 items-center">
              <div
                className="w-2 h-2 bg-[#1C6DD0] rounded-full"
                style={{
                  animation: "wave 1.4s ease-in-out infinite",
                  animationDelay: "0ms",
                }}
              ></div>
              <div
                className="w-2 h-2 bg-[#1C6DD0] rounded-full"
                style={{
                  animation: "wave 1.4s ease-in-out infinite",
                  animationDelay: "200ms",
                }}
              ></div>
              <div
                className="w-2 h-2 bg-[#1C6DD0] rounded-full"
                style={{
                  animation: "wave 1.4s ease-in-out infinite",
                  animationDelay: "400ms",
                }}
              ></div>
            </div>
            <style>{`
              @keyframes wave {
                0%, 60%, 100% {
                  transform: translateY(0);
                }
                30% {
                  transform: translateY(-10px);
                }
              }
            `}</style>

            {/* Helpful Tip */}
            <div className="mt-8 p-4 bg-[#E8F4FF] rounded-xl max-w-md">
              <p className="text-sm text-[#1C6DD0] text-center">
                💡 <strong>Tip:</strong> While you wait, remember that small
                lifestyle changes can make a big difference in heart health!
              </p>
            </div>
          </div>
        ) : error ? (
          <p className="text-[#E63946]">
            Failed to load recommendations: {error}
          </p>
        ) : (
          <>
            <p className="text-[#718096] mb-8">
              Based on your health profile, here are customized recommendations
              to improve your cardiovascular health:
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {suggestions.map((suggestion, index) => {
                const Icon = suggestion.icon;
                const tips =
                  suggestion.tips && suggestion.tips.length
                    ? suggestion.tips
                    : ["No recommendations available"];
                return (
                  <div
                    key={index}
                    className="bg-[#f6f6f6] rounded-2xl p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${suggestion.color}15` }}
                      >
                        <Icon
                          className="w-6 h-6"
                          style={{ color: suggestion.color }}
                        />
                      </div>
                      <h3 className="text-[#1a202c]">{suggestion.title}</h3>
                    </div>

                    <ul className="space-y-2">
                      {tips.map((tip: string, tipIndex: number) => (
                        <li
                          key={tipIndex}
                          className="flex items-start gap-2 text-sm text-[#718096]"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                            style={{ backgroundColor: suggestion.color }}
                          />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Optionally show a small follow-up message or urgency info if present */}
      {followup && (followup.followup_message || followup.urgency) && (
        <div className="bg-white rounded-3xl shadow-xl p-6">
          {followup.urgency && (
            <div className="mb-4">
              <h4 className="text-sm text-[#1a202c] mb-1">Urgency</h4>
              <div className="text-sm text-[#718096] space-y-1">
                <div>
                  Level: {followup.urgency.level ?? "N/A"}
                </div>
                {typeof followup.urgency.days_to_consult === "number" && (
                  <div>
                    Days to consult: {followup.urgency.days_to_consult}
                  </div>
                )}
                {followup.urgency["Consultation per month"] && (
                  <div>
                    Recommended consultations per month:{" "}
                    {followup.urgency["Consultation per month"]}
                  </div>
                )}
              </div>
            </div>
          )}
          {followup.followup_message && (
            <div>
              <h4 className="text-sm text-[#1a202c] mb-1">
                Follow-up message for doctor
              </h4>
              <div className="text-sm text-[#718096]">
                {followup.followup_message}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
