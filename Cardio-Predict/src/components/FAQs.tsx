import { Heart, Mail, Phone } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

const faqs = [
  {
    question: 'Are cardiopulmonary problems hereditary?',
    answer: 'Yes, some cardiopulmonary problems have a genetic component and can run in families. Conditions such as high blood pressure, high cholesterol, coronary artery disease, and some types of arrhythmia have been shown to have a hereditary component.',
  },
  {
    question: 'What is cardioversion and will surgery hurt?',
    answer: 'Cardioversion is a medical procedure used to restore a normal heart rhythm in people with certain types of abnormal heartbeats. The procedure can be done with medications (chemical cardioversion) or with electric shocks (electrical cardioversion). If electrical cardioversion is needed, you will be sedated, so you won\'t feel any pain during the procedure.',
  },
  {
    question: 'How accurate is the AI prediction model?',
    answer: 'Our AI prediction model has been trained on extensive cardiovascular health datasets and achieves approximately 98% accuracy in risk assessment. However, this tool is designed to complement, not replace, professional medical diagnosis. Always consult with a qualified cardiologist for definitive diagnosis and treatment.',
  },
  {
    question: 'What should I do if I get a high-risk result?',
    answer: 'If you receive a high-risk result, don\'t panic. First, schedule an appointment with a cardiologist as soon as possible. In the meantime, start implementing the lifestyle recommendations provided, monitor your symptoms, and avoid strenuous activities. If you experience chest pain, severe shortness of breath, or other emergency symptoms, call emergency services immediately.',
  },
];

export function FAQs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="mb-8">
              <p className="text-[#718096] mb-2">FAQs</p>
              <h2 className="mb-4 text-[#1a202c]">What people mostly ask us</h2>
              <p className="text-[#718096]">
                Our team applies its wide healthcare experience to determining the strategies that will best enable our patient to recovery.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-2 border-[#E8F4FF] rounded-xl px-6 bg-white hover:border-[#1C6DD0] transition-colors"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#E63946] flex items-center justify-center flex-shrink-0 mt-1">
                        <Heart className="w-4 h-4 text-white" fill="white" />
                      </div>
                      <span className="text-[#1a202c]">{index + 1}. {faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#718096] pl-11 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1C6DD0] to-[#E63946] rounded-3xl blur-2xl opacity-10"></div>
            <div className="relative rounded-3xl shadow-2xl w-full min-h-[380px] bg-gradient-to-br from-[#E8F4FF] to-white flex items-center justify-center border border-[#E8F4FF]">
              <div className="text-center">
                <div className="mx-auto w-20 h-20 rounded-full bg-[#1C6DD0]/10 flex items-center justify-center mb-4">
                  <Heart className="w-10 h-10 text-[#1C6DD0]" />
                </div>
                <p className="text-[#718096]">Health Guidance Illustration</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Footer */}
        <div className="mt-16 bg-gradient-to-r from-[#1C6DD0] to-[#1557a8] rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm opacity-90">24/7 Emergency services</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm opacity-90">For any query contact us</div>
                <div>Private internal contact</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm opacity-90">Call us on</div>
                <div>1**********</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
