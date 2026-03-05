import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Teacher, 52',
    rating: 5,
    quote: 'CardioPredict helped me identify my heart disease risk early. The personalized recommendations and diet plan have transformed my health journey.',
  },
  {
    name: 'Michael Chen',
    role: 'Engineer, 45',
    rating: 5,
    quote: 'The AI predictions were spot-on. I found an excellent cardiologist nearby and started preventive treatment. This platform literally saved my life.',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Nurse, 38',
    rating: 5,
    quote: 'As a healthcare professional, I\'m impressed by the accuracy and comprehensive approach. I recommend it to all my patients and colleagues.',
  },
  {
    name: 'David Williams',
    role: 'Business Owner, 58',
    rating: 4,
    quote: 'The exercise guide and stress management tips have been invaluable. I feel more in control of my heart health than ever before.',
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="mb-4 text-[#1a202c]">What Our Users Say</h2>
          <p className="text-[#718096] max-w-2xl mx-auto">
            Join thousands of satisfied users who have taken control of their heart health
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-[#E8F4FF] to-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full border-2 border-[#1C6DD0] bg-[#1C6DD0]/10 flex items-center justify-center text-[#1C6DD0]">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-[#1a202c]">{testimonial.name}</h4>
                  <p className="text-sm text-[#718096]">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[#FFD700]" fill="#FFD700" />
                ))}
              </div>

              <p className="text-sm text-[#718096] italic">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
