import Hero from "@/components/Hero";
import Features from "@/components/Features";
import AppPreview from "@/components/AppPreview";
import Reviews from "@/components/Reviews";
import TrustMetrics from "@/components/TrustMetrics";
import Roadmap from "@/components/Roadmap";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Hero />
      <TrustMetrics />
      <Features />
      <AppPreview />
      <Reviews />
      <Roadmap />
      <CTA />
      <Footer />
    </div>
  );
}
