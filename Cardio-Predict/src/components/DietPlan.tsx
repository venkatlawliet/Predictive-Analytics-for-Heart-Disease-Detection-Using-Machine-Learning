import { Apple, AlertCircle } from "lucide-react";
import type { Followup } from "../services/api";
import { React, useState, useEffect } from "react";

const defaultMeals = [
  {
    name: "Breakfast",
    items: [
      "Oatmeal with berries and walnuts",
      "Green tea",
      "Low-fat Greek yogurt",
    ],
    portion: "400-500 calories",
  },
  {
    name: "Lunch",
    items: [
      "Grilled salmon with quinoa",
      "Mixed green salad",
      "Olive oil dressing",
    ],
    portion: "500-600 calories",
  },
  {
    name: "Dinner",
    items: [
      "Chicken breast with steamed vegetables",
      "Brown rice",
      "Herbal tea",
    ],
    portion: "500-600 calories",
  },
  {
    name: "Snacks",
    items: [
      "Raw almonds (handful)",
      "Apple or banana",
      "Carrot sticks with hummus",
    ],
    portion: "200-300 calories",
  },
];

const defaultFoodsToAvoid = [
  "Processed meats (bacon, sausages)",
  "Fried and fast foods",
  "High-sodium canned foods",
  "Sugary beverages and sodas",
  "Pastries and baked goods",
  "Trans fats and hydrogenated oils",
];

interface DietPlanProps {
  followup?: Followup | null;
}

export function DietPlan({ followup }: DietPlanProps) {
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [foodsToAvoid, setFoodsToAvoid] = useState<string[]>([]);
  const [nutritionGoals, setNutritionGoals] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      // Use followup data directly; if missing, fall back to static defaults.
      if (followup) {
        if (followup.meal_plan) {
          setMealPlan(followup.meal_plan);
        }
        if (followup.foods_to_avoid) {
          setFoodsToAvoid(followup.foods_to_avoid);
        }
        if (followup.weekly_nutrition_goals) {
          setNutritionGoals(followup.weekly_nutrition_goals);
        }
      }

      setLoading(false);
    };

    loadData();
  }, [followup]);

  // Convert meal_plan from API format to display format
  const meals = mealPlan
    ? [
        {
          name: "Breakfast",
          items: mealPlan.breakfast?.items || [],
          portion: mealPlan.breakfast?.calories || "400-500 calories",
        },
        {
          name: "Lunch",
          items: mealPlan.lunch?.items || [],
          portion: mealPlan.lunch?.calories || "500-600 calories",
        },
        {
          name: "Dinner",
          items: mealPlan.dinner?.items || [],
          portion: mealPlan.dinner?.calories || "500-600 calories",
        },
        {
          name: "Snacks",
          items: mealPlan.snacks?.items || [],
          portion: mealPlan.snacks?.calories || "200-300 calories",
        },
      ]
    : defaultMeals;

  const displayFoodsToAvoid =
    foodsToAvoid.length > 0 ? foodsToAvoid : defaultFoodsToAvoid;
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
      <div className="flex items-center gap-3 mb-6">
        <Apple className="w-8 h-8 text-[#10B981]" />
        <h2 className="text-[#1a202c]">Heart-Healthy Diet Plan</h2>
      </div>
      <p className="text-[#718096] mb-8">
        A balanced meal plan designed to support cardiovascular health
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Daily Meals - 2x2 Grid */}
        <div>
          <h3 className="text-[#1a202c] mb-4">Daily Meal Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meals.map((meal, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#E8F4FF] to-white p-6 rounded-2xl border-2 border-[#E8F4FF]"
              >
                <h4 className="text-[#1a202c] mb-2">{meal.name}</h4>
                <span className="inline-block text-sm text-[#1C6DD0] bg-[#E8F4FF] px-3 py-1 rounded-full mb-3">
                  {meal.portion}
                </span>
                <ul className="space-y-1">
                  {meal.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-start gap-2 text-sm text-[#718096]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-1.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Foods to Avoid - Full Width */}
        <div className="flex items-center">
          <div className="bg-[#FEE2E2] p-6 rounded-2xl border-2 border-[#E63946]/20 w-full">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-6 h-6 text-[#E63946]" />
              <h3 className="text-[#1a202c]">Foods to Avoid</h3>
            </div>
            <ul className="space-y-2">
              {displayFoodsToAvoid.map((food, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-[#718096]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E63946] mt-1.5 flex-shrink-0" />
                  <span>{food}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-[#f6f6f6] p-6 rounded-2xl">
        <h3 className="text-[#1a202c] mb-4">Weekly Nutrition Goals</h3>
        {loading ? (
          <div className="text-center text-[#718096]">
            Loading nutrition goals...
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-xl">
              <div className="text-2xl text-[#1C6DD0] mb-1">
                {nutritionGoals?.servings_fruits_veggies || "5-7"}
              </div>
              <div className="text-sm text-[#718096]">
                Servings of fruits/vegetables daily
              </div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl">
              <div className="text-2xl text-[#10B981] mb-1">
                {nutritionGoals?.fish_meals_per_week || "2-3"}
              </div>
              <div className="text-sm text-[#718096]">Fish meals per week</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl">
              <div className="text-2xl text-[#E63946] mb-1">
                {nutritionGoals?.sodium_mg || "<2300"}
              </div>
              <div className="text-sm text-[#718096]">mg sodium daily</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl">
              <div className="text-2xl text-[#F59E0B] mb-1">
                {nutritionGoals?.glasses_of_water || "8-10"}
              </div>
              <div className="text-sm text-[#718096]">
                Glasses of water daily
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
