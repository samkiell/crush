import Link from "next/link";
import { Instagram, Twitter, Facebook, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content pt-20 pb-10 rounded-t-3xl mt-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-base-content">
              DEVOUR TO CRUSH
            </h3>
            <p className="text-base-content/70 mb-6 leading-relaxed">
              Your ultimate JAMB exam preparation platform. Empowering students to achieve their academic dreams.
            </p>
            <div className="flex gap-4">
              <a href="#" className="btn btn-circle btn-sm btn-ghost hover:bg-base-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="btn btn-circle btn-sm btn-ghost hover:bg-base-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="btn btn-circle btn-sm btn-ghost hover:bg-base-300">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-base-content">Features</h4>
            <ul className="space-y-4 text-base-content/70">
              <li><Link href="/cbt" className="hover:text-primary transition-colors">CBT Practice</Link></li>
              <li><Link href="/study" className="hover:text-primary transition-colors">Study Mode</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Analytics</Link></li>
              <li><Link href="/community" className="hover:text-primary transition-colors">Community</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-base-content">Support</h4>
            <ul className="space-y-4 text-base-content/70">
              <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/status" className="hover:text-primary transition-colors">System Status</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-base-content">Company</h4>
            <ul className="space-y-4 text-base-content/70">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-base-content/10 pt-8 text-center text-base-content/60 text-sm">
          <p>© 2025 Crush EduPlace Intl. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
