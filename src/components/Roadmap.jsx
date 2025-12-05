import { CheckCircle2 } from "lucide-react";

const Roadmap = () => {
  const items = [
    "Offline CBT Mode",
    "Personalized Study Planner",
    "AI-Powered Tutor",
    "Real-time Leaderboards",
  ];

  return (
    <section className="py-24 bg-base-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-base-200 rounded-3xl p-8 sm:p-12 border border-base-300 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 text-center">
            <h2 className="text-3xl font-bold text-base-content mb-8">
              What’s Coming Next
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-3 bg-base-100 p-4 rounded-xl shadow-sm">
                  <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />
                  <span className="font-medium text-base-content">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
