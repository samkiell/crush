import Link from 'next/link';
import { Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content/70 rounded-t-3xl">
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-base-content">DEVOUR TO CRUSH</h3>
            <p className="text-base-content/70">
              Your ultimate JAMB exam preparation platform.
            </p>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-4 text-base-content">Features</h4>
            <ul className="space-y-2 text-base-content/70">
              <li><Link href="/questions" className="hover:text-primary transition-colors">Question Bank</Link></li>
              <li><Link href="/exam" className="hover:text-primary transition-colors">Exam Simulator</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Progress Tracking</Link></li>
              <li><Link href="/community" className="hover:text-primary transition-colors">Community Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-4 text-base-content">Support</h4>
            <ul className="space-y-2 text-base-content/70">
              <li><Link href="/help-center" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-4 text-base-content">Connect</h4>
            <ul className="space-y-2 text-base-content/70">
              <li>
                <a
                  href="https://www.instagram.com/crush_eduplace/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                  <span>Instagram</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-base-content/20 mt-8 pt-8 text-center text-base-content/70">
          <p>&copy; 2025 Crush EduPlace Intl. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
