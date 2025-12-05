const AppPreview = () => {
  const previews = [
    { title: "CBT Workspace", caption: "Simulate real exams" },
    { title: "Study Mode", caption: "Master topics at your pace" },
    { title: "Question Bank", caption: "Thousands of questions" },
    { title: "Analytics", caption: "Track your progress" },
  ];

  return (
    <section className="py-24 bg-base-200 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-base-content mb-4">
            See What’s Inside
          </h2>
          <p className="text-lg text-base-content/70">
            A sneak peek into your new study companion.
          </p>
        </div>
      </div>

      {/* Horizontal Scroll Container - Mobile First */}
      <div className="flex overflow-x-auto pb-8 px-4 sm:px-6 lg:px-8 gap-6 snap-x snap-mandatory scrollbar-hide -mx-4 sm:mx-0">
        {previews.map((item, index) => (
          <div
            key={index}
            className="flex-none w-72 sm:w-80 snap-center first:pl-4 sm:first:pl-0 last:pr-4 sm:last:pr-0"
          >
            <div className="bg-base-100 rounded-2xl p-4 shadow-md border border-base-300 h-full">
              <div className="bg-base-300/50 aspect-[9/16] rounded-xl mb-4 w-full animate-pulse flex items-center justify-center text-base-content/20">
                {/* Placeholder for Screenshot */}
                <span className="text-sm font-medium">App Screenshot</span>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-base-content">
                  {item.title}
                </h3>
                <p className="text-sm text-base-content/60">{item.caption}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AppPreview;
