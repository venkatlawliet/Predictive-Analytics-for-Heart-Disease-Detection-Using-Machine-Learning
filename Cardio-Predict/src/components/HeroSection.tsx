import { Heart } from "lucide-react";
import { Button } from "./ui/button";

export function HeroSection() {
  const scrollToForm = () => {
    const formElement = document.getElementById("prediction-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToFeatures = () => {
    const featuresElement = document.getElementById("features");
    if (featuresElement) {
      featuresElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-[#E8F4FF] via-white to-[#FFE8EA] overflow-hidden">
      {/* Abstract shapes */}
      <div
        className="absolute top-0 right-0 w-96 h-96 bg-[#1C6DD0] opacity-5 rounded-full blur-3xl pointer-events-none
"
      ></div>
      <div
        className="absolute bottom-0 left-0 w-96 h-96 bg-[#E63946] opacity-5 rounded-full blur-3xl pointer-events-none
"
      ></div>

      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-10 h-10 text-[#E63946]" fill="#E63946" />
              <span className="text-3xl text-[#1C6DD0]">CardioPredict</span>
            </div>

            <h1 className="text-[#1a202c]">
              Predict Heart Disease Risk in Minutes
            </h1>

            <p className="text-xl text-[#718096] max-w-xl">
              AI-powered analysis to help you stay ahead of heart conditions.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                onClick={scrollToForm}
                className="bg-[#1C6DD0] hover:bg-[#1557a8] text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Check Your Risk
              </Button>
              <Button
                onClick={scrollToFeatures}
                variant="outline"
                className="border-2 border-[#1C6DD0] text-[#1C6DD0] hover:bg-[#E8F4FF] px-8 py-6 rounded-xl"
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <div className="text-[#1C6DD0]">50K+</div>
                <div className="text-sm text-[#718096]">Predictions</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <div className="text-[#1C6DD0]">98%</div>
                <div className="text-sm text-[#718096]">Accuracy</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                <div className="text-[#E63946]">5K+</div>
                <div className="text-sm text-[#718096]">Doctors</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1C6DD0] to-[#E63946] rounded-3xl blur-2xl opacity-20"></div>
            <div className="relative rounded-3xl shadow-2xl w-full min-h-[420px] bg-gradient-to-br from-[#E8F4FF] to-white flex items-center justify-center border border-[#E8F4FF]">
              <div className="text-center px-6">
                <div className="mx-auto w-24 h-24 rounded-full bg-[#E63946]/10 flex items-center justify-center mb-4">
                  <Heart className="w-12 h-12 text-[#E63946]" fill="#E63946" />
                </div>
                <p className="text-[#718096]">Private local visual placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
