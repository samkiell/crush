import Link from "next/link";

const CTA = () => {
  return (
    <section className="py-24 bg-base-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-base-content mb-6">
            Ready to Crush Your JAMB Exam?
          </h2>
          <p className="text-xl text-base-content/70 mb-10">
            Join thousands of students achieving outstanding results. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="btn btn-primary btn-lg px-10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-grey"
            >
              Start Now
            </Link>
            <Link
              href="/community"
              className="btn btn-outline btn-secondary btn-lg px-10 rounded-xl hover:bg-base-200 transition-all duration-300"
            >
              Join Community
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
