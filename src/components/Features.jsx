import { BookOpen, Clock, BarChart2, Users } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      title: "Comprehensive Question Bank",
      description: "Access thousands of past questions and detailed solutions.",
    },
    {
      icon: <Clock className="w-8 h-8 text-secondary" />,
      title: "Exam Simulator",
      description: "Practice under real exam conditions with timed sessions.",
    },
    {
      icon: <BarChart2 className="w-8 h-8 text-accent" />,
      title: "Progress Tracking",
      description: "Monitor your performance and identify areas for improvement.",
    },
    {
      icon: <Users className="w-8 h-8 text-info" />,
      title: "Community Support",
      description: "Join a vibrant community of students and expert tutors.",
    },
  ];

  return (
    <section className="py-24 bg-base-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-base-content mb-4">
            Why Choose DEVOUR TO CRUSH?
          </h2>
          <p className="text-lg text-base-content/70">
            Everything you need to ace your exams in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-base-200/50 border border-base-300 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-base-100 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-3">
                {feature.title}
              </h3>
              <p className="text-base-content/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
