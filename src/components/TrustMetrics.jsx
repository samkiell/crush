const TrustMetrics = () => {
  const metrics = [
    { value: "10,000+", label: "Questions" },
    { value: "50,000+", label: "Students" },
    { value: "95%", label: "Success Rate" },
    { value: "24/7", label: "Support" },
  ];

  return (
    <section className="py-20 bg-base-200 border-y border-base-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {metrics.map((metric, index) => (
            <div key={index} className="p-4">
              <div className="text-4xl sm:text-5xl font-extrabold text-primary mb-2">
                {metric.value}
              </div>
              <div className="text-sm sm:text-base font-medium text-base-content/60 uppercase tracking-wider">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustMetrics;
