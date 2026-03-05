import { React } from "react";
import { Heart, Shield, Activity, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";

interface IntroPageProps {
  onGetStarted: () => void;
}

export function IntroPage({ onGetStarted }: IntroPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F4FF] via-white to-[#f6f6f6]">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-[#E63946]" fill="#E63946" />
            <span className="text-2xl text-[#1a202c]">CardioPredict</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <div className="bg-gradient-to-br from-[#1C6DD0] to-[#E63946] p-8 rounded-3xl shadow-2xl">
              <Activity className="w-20 h-20 text-white" />
            </div>
          </div>

          <h1 className="text-5xl lg:text-6xl text-[#1a202c] mb-6">
            AI-Powered Heart Health Predictions
          </h1>
          <p className="text-xl text-[#718096] mb-12 max-w-2xl mx-auto">
            Get instant, personalized cardiovascular risk assessments using
            advanced machine learning. Take control of your heart health today.
          </p>

          <Button
            onClick={onGetStarted}
            className="bg-[#1C6DD0] hover:bg-[#1557a8] text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Get Started <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <div className="bg-[#E8F4FF] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-[#1C6DD0]" />
            </div>
            <h3 className="text-[#1a202c] mb-3">AI Analysis</h3>
            <p className="text-[#718096]">
              Advanced machine learning algorithms analyze your health data for
              accurate risk predictions
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <div className="bg-[#FEE2E2] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-[#E63946]" />
            </div>
            <h3 className="text-[#1a202c] mb-3">Personalized Insights</h3>
            <p className="text-[#718096]">
              Receive tailored recommendations for diet, exercise, and lifestyle
              improvements
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <div className="bg-[#E8F4FF] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-[#1C6DD0]" />
            </div>
            <h3 className="text-[#1a202c] mb-3">Trusted & Secure</h3>
            <p className="text-[#718096]">
              Your health data is protected with enterprise-grade security and
              privacy measures
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-[#718096]">
        <p>
          © 2025 CardioPredict. For informational purposes only. Consult
          healthcare professionals for medical advice.
        </p>
      </footer>
    </div>
  );
}
