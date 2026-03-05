import * as React from "react";
import { Dumbbell, Heart, Bike, Waves } from "lucide-react";
import { useState, useEffect } from "react";
import type { Followup } from "../services/api";

const defaultExercises = [
  {
    icon: Heart,
    title: "Aerobic Exercises",
    color: "#E63946",
    activities: [
      { name: "Brisk Walking", duration: "30 min", frequency: "5 days/week" },
      { name: "Swimming", duration: "30 min", frequency: "3 days/week" },
      { name: "Dancing", duration: "30 min", frequency: "3 days/week" },
      { name: "Jogging", duration: "20 min", frequency: "3 days/week" },
    ],
  },
  {
    icon: Dumbbell,
    title: "Strength Training",
    color: "#1C6DD0",
    activities: [
      { name: "Light Weights", duration: "20 min", frequency: "2 days/week" },
      {
        name: "Resistance Bands",
        duration: "20 min",
        frequency: "2 days/week",
      },
      {
        name: "Bodyweight Exercises",
        duration: "15 min",
        frequency: "3 days/week",
      },
      { name: "Core Workouts", duration: "15 min", frequency: "3 days/week" },
    ],
  },
  {
    icon: Waves,
    title: "Flexibility & Balance",
    color: "#10B981",
    activities: [
      { name: "Yoga", duration: "30 min", frequency: "3 days/week" },
      { name: "Tai Chi", duration: "30 min", frequency: "2 days/week" },
      { name: "Stretching", duration: "10 min", frequency: "Daily" },
      { name: "Pilates", duration: "30 min", frequency: "2 days/week" },
    ],
  },
  {
    icon: Bike,
    title: "Low-Impact Cardio",
    color: "#F59E0B",
    activities: [
      { name: "Cycling", duration: "30 min", frequency: "3 days/week" },
      { name: "Elliptical", duration: "25 min", frequency: "3 days/week" },
      { name: "Water Aerobics", duration: "30 min", frequency: "2 days/week" },
      { name: "Rowing", duration: "20 min", frequency: "2 days/week" },
    ],
  },
];

const defaultSafetyTips = [
  "Always warm up for 5-10 minutes before exercising",
  "Stay hydrated before, during, and after workouts",
  "Stop immediately if you feel chest pain, dizziness, or severe shortness of breath",
  "Start slowly and gradually increase intensity over time",
  "Consult your cardiologist before starting any new exercise program",
  "Monitor your heart rate to stay within target zone",
  "Cool down with light activity and stretching",
];

interface ExerciseGuideProps {
  followup?: Followup | null;
}

const exerciseSlides = [
  {
    title: "Warm-Up Focus",
    description: "Start with light movement for 5-10 minutes before workouts.",
    icon: Heart,
    color: "#E63946",
  },
  {
    title: "Steady Cardio",
    description: "Maintain moderate intensity and monitor breathing rhythm.",
    icon: Bike,
    color: "#1C6DD0",
  },
  {
    title: "Recovery First",
    description: "Cool down gradually and avoid abrupt exertion changes.",
    icon: Waves,
    color: "#10B981",
  },
];

export function ExerciseGuide({ followup }: ExerciseGuideProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [exerciseGuide, setExerciseGuide] = useState<any>(null);
  const [safetyTips, setSafetyTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      // Use followup data directly; if missing, fall back to static defaults.
      if (followup?.heart_safe_exercise_guide) {
        setExerciseGuide(followup.heart_safe_exercise_guide);
        if (followup.heart_safe_exercise_guide.exercise_safety_tips) {
          setSafetyTips(
            followup.heart_safe_exercise_guide.exercise_safety_tips
          );
        }
      }

      setLoading(false);
    };

    loadData();
  }, [followup]);

  // Convert exercise guide from API format to display format
  const formatActivity = (activity: any) => {
    if (typeof activity === "string") {
      return { name: activity, duration: "", frequency: "" };
    }
    return {
      name: activity.activity || "",
      duration: activity.duration || "",
      frequency: activity.freq || "",
    };
  };

  const exercises = exerciseGuide
    ? [
        {
          icon: Heart,
          title: "Aerobic Exercises",
          color: "#E63946",
          activities: (exerciseGuide.aerobic_exercises || []).map(
            formatActivity
          ),
        },
        {
          icon: Dumbbell,
          title: "Strength Training",
          color: "#1C6DD0",
          activities: (exerciseGuide.strength_training || []).map(
            formatActivity
          ),
        },
        {
          icon: Waves,
          title: "Flexibility & Balance",
          color: "#10B981",
          activities: (exerciseGuide.flexibility_balance || []).map(
            (item: any) => {
              if (typeof item === "string") {
                return { name: item, duration: "", frequency: "" };
              }
              return formatActivity(item);
            }
          ),
        },
        {
          icon: Bike,
          title: "Low-Impact Cardio",
          color: "#F59E0B",
          activities: (exerciseGuide.low_impact_cardio || []).map(
            formatActivity
          ),
        },
      ]
    : defaultExercises;

  const displaySafetyTips =
    safetyTips.length > 0 ? safetyTips : defaultSafetyTips;

  // Reset transition guard when index changes
  useEffect(() => {
    setIsTransitioning(false);
  }, [currentVideoIndex]);

  // Auto-rotate animations every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % exerciseSlides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const CurrentSlideIcon = exerciseSlides[currentVideoIndex].icon;

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
      <div className="flex items-center gap-3 mb-6">
        <Dumbbell className="w-8 h-8 text-[#E63946]" />
        <h2 className="text-[#1a202c]">Heart-Safe Exercise Guide</h2>
      </div>
      <p className="text-[#718096] mb-8">
        Recommended physical activities to strengthen your cardiovascular system
      </p>

      {loading ? (
        <div className="text-center text-[#718096] mb-8">
          Loading exercise recommendations...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {exercises.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-[#f6f6f6] to-white p-6 rounded-2xl border-2 border-[#E8F4FF] hover:border-[#1C6DD0] transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}15` }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: category.color }}
                    />
                  </div>
                  <h3 className="text-[#1a202c]">{category.title}</h3>
                </div>

                <div className="space-y-3">
                  {category.activities.length > 0 ? (
                    category.activities.map(
                      (activity: any, actIndex: number) => (
                        <div
                          key={actIndex}
                          className="flex items-center justify-between p-3 bg-white rounded-xl"
                        >
                          <span className="text-sm text-[#1a202c]">
                            {activity.name}
                          </span>
                          {(activity.duration || activity.frequency) && (
                            <div className="flex gap-2 text-xs">
                              {activity.duration && (
                                <span
                                  className="px-2 py-1 rounded-full"
                                  style={{
                                    backgroundColor: `${category.color}15`,
                                    color: category.color,
                                  }}
                                >
                                  {activity.duration}
                                </span>
                              )}
                              {activity.frequency && (
                                <span className="px-2 py-1 bg-[#E8F4FF] text-[#1C6DD0] rounded-full">
                                  {activity.frequency}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    )
                  ) : (
                    <div className="text-sm text-[#718096] p-3">
                      No specific recommendations available
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Exercise Animation Carousel and Safety Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="rounded-2xl overflow-hidden shadow-lg relative bg-white"
          style={{ aspectRatio: "4/3", minHeight: "400px" }}
        >
          <div
            className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            } bg-gradient-to-br from-[#E8F4FF] to-white flex items-center justify-center`}
          >
            <div className="text-center p-8 max-w-sm">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{
                  backgroundColor: `${exerciseSlides[currentVideoIndex].color}20`,
                }}
              >
                <CurrentSlideIcon
                  className="w-8 h-8"
                  style={{ color: exerciseSlides[currentVideoIndex].color }}
                />
              </div>
              <h3 className="text-[#1a202c] mb-2">
                {exerciseSlides[currentVideoIndex].title}
              </h3>
              <p className="text-[#718096] text-sm">
                {exerciseSlides[currentVideoIndex].description}
              </p>
            </div>
          </div>

          {/* Animation Indicator Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {exerciseSlides.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentVideoIndex
                    ? "bg-white w-6"
                    : "bg-white/50 w-2"
                }`}
                aria-label={`Animation ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="bg-[#E8F4FF] p-6 rounded-2xl">
          <h3 className="text-[#1a202c] mb-4">Exercise Safety Tips</h3>
          <ul className="space-y-3">
            {displaySafetyTips.map((tip, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-[#718096]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#1C6DD0] mt-1.5 flex-shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
