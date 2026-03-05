import { Brain, FileHeart, MapPin } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Risk Prediction',
    description: 'Advanced machine learning algorithms analyze your health data to predict cardiovascular risk with 98% accuracy.',
    color: '#1C6DD0',
  },
  {
    icon: FileHeart,
    title: 'Personalized Health Roadmap',
    description: 'Get customized diet plans, exercise routines, and lifestyle recommendations tailored to your health profile.',
    color: '#E63946',
  },
  {
    icon: MapPin,
    title: 'Nearby Doctors & Emergency Tips',
    description: 'Find top-rated cardiologists in your area and access emergency guidelines for heart-related issues.',
    color: '#1C6DD0',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="mb-4 text-[#1a202c]">Why Choose CardioPredict?</h2>
          <p className="text-[#718096] max-w-2xl mx-auto">
            Comprehensive heart health analysis powered by cutting-edge AI technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="p-8 bg-[#f6f6f6] rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <Icon className="w-8 h-8" style={{ color: feature.color }} />
                </div>
                <h3 className="mb-3 text-[#1a202c]">{feature.title}</h3>
                <p className="text-[#718096]">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
