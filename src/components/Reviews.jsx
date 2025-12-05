import { Star } from "lucide-react";

const Reviews = () => {
  const reviews = [
    {
      name: "Sarah Adebayo",
      role: "JAMB Candidate",
      rating: 5,
      text: "This app helped me score 320 in my JAMB! The CBT practice is exactly like the real thing.",
    },
    {
      name: "Emmanuel Okonkwo",
      role: "University Student",
      rating: 5,
      text: "I wish I had this earlier. The explanations are so clear and the analytics helped me focus on my weak areas.",
    },
    {
      name: "Grace Ibrahim",
      role: "JAMB Candidate",
      rating: 4,
      text: "Great community support. Whenever I was stuck, someone was there to help explain the concepts.",
    },
    {
      name: "David Okafor",
      role: "Medical Student",
      rating: 5,
      text: "The best investment for my education. Highly recommended for anyone serious about admission.",
    },
  ];

  return (
    <section className="py-24 bg-base-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-base-content mb-16">
          Loved by Students
        </h2>

        <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-4 lg:overflow-visible">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="flex-none w-80 sm:w-auto snap-center bg-base-200 p-6 rounded-2xl shadow-sm border border-base-300 flex flex-col"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-base-content/80 mb-6 flex-grow italic">
                "{review.text}"
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 rounded-full bg-base-300 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold text-sm text-base-content">
                    {review.name}
                  </p>
                  <p className="text-xs text-base-content/60">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
