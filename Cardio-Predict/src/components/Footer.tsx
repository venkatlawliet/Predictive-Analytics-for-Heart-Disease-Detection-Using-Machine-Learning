import { Heart, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-50 to-red-50 border-t border-blue-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-8 h-8 text-[#E63946]" fill="#E63946" />
              <span className="text-2xl text-[#1C6DD0]">CardioPredict</span>
            </div>
            <p className="text-[#718096] max-w-md">
              AI-powered heart disease prediction platform helping you stay ahead of cardiovascular conditions with personalized health insights.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-[#1a202c]">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[#718096] hover:text-[#1C6DD0] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-[#718096] hover:text-[#1C6DD0] transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-[#718096] hover:text-[#1C6DD0] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-[#718096] hover:text-[#1C6DD0] transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="mb-4 text-[#1a202c]">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#1C6DD0] flex items-center justify-center text-white hover:bg-[#1557a8] transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#1C6DD0] flex items-center justify-center text-white hover:bg-[#1557a8] transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#1C6DD0] flex items-center justify-center text-white hover:bg-[#1557a8] transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#1C6DD0] flex items-center justify-center text-white hover:bg-[#1557a8] transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-200 mt-8 pt-8 text-center text-[#718096]">
          <p>© 2025 CardioPredict. All rights reserved. This is for educational purposes only.</p>
        </div>
      </div>
    </footer>
  );
}
