"use client";

import Link from "next/link";
import Image from "next/image";
import { Sun, Moon, Eye } from "lucide-react";
import { useTheme } from "../utils/theme";
import Footer from "../components/Footer";

export default function Home() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") return setTheme("dark");
    if (theme === "dark") return setTheme("eye-care");
    return setTheme("light");
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-accent text-base-content py-24 rounded-b-3xl shadow-xl">


        <div className="absolute top-6 left-6 flex items-center space-x-2">

          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.png" className="w-10" alt="Logo" />
            <span className="text-lg font-bold text-white select-none">D2C</span>

          </Link>

        </div>

        <div className="absolute top-6 right-6">
          <button
            onClick={cycleTheme}
            className="btn btn-circle bg-base-200 border border-base-300 shadow-lg"
          >
            {theme === "light" && <Sun />}
            {theme === "dark" && <Moon />}
            {theme === "eye-care" && <Eye />}
          </button>
        </div>

        <div className="container mx-auto px-6 text-center">
          <h1 className="text-6xl font-bold mb-6 drop-shadow-lg">
            DEVOUR TO CRUSH
          </h1>

          <p className="text-xl mb-10 max-w-2xl mx-auto text-base-content/90">
            Your ultimate JAMB exam preparation platform. Master the questions,
            Crush the exam, and Secure your future.
          </p>

          <div className="flex justify-center gap-4">
            <Link href="/auth/register" className="btn btn-primary px-10 py-3 rounded-xl shadow-md">
              Get Started
            </Link>

            <Link href="/community" className="btn btn-secondary px-10 py-3 rounded-xl shadow-md">
              Join Community
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-14">Why Choose DEVOUR TO CRUSH?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: "📚", title: "Comprehensive Question Bank" },
              { icon: "⏱️", title: "Exam Simulator" },
              { icon: "📊", title: "Progress Tracking" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-base-200 shadow hover:shadow-lg transition"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-base-300 flex items-center justify-center text-4xl">
                  {item.icon}
                </div>

                <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                <p className="text-base-content/70">
                  High-quality JAMB prep tools designed for top performance.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-base-200 py-20 rounded-2xl mx-4 my-10">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 text-center">
          <div>
            <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
            <div className="text-base-content/70">Questions</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-secondary mb-2">50,000+</div>
            <div className="text-base-content/70">Students</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-accent mb-2">95%</div>
            <div className="text-base-content/70">Success Rate</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
            <div className="text-base-content/70">Support</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Crush Your JAMB Exam?</h2>
        <p className="text-xl mb-10 text-base-content/70">
          Join thousands of students achieving outstanding results.
        </p>

        <Link href="/auth/register" className="btn btn-primary px-12 py-4 rounded-xl shadow-lg">
          Start Your Journey Today
        </Link>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
