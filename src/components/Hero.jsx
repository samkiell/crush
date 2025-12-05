import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-base-content mb-6 drop-shadow-sm">
              DEVOUR TO <span className="text-primary">CRUSH</span>
            </h1>
            <p className="text-lg sm:text-xl text-base-content/80 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Your ultimate JAMB exam preparation platform. Master the questions,
              Crush the exam, and Secure your future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/register"
                className="btn btn-primary btn-lg px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-grey"
              >
                Get Started
              </Link>
              <Link
                href="/community"
                className="btn btn-outline btn-secondary btn-lg px-8 rounded-xl hover:bg-base-200 transition-all duration-300"
              >
                Join Community
              </Link>
            </div>
          </div>
          {/* Visual/Grid decoration or Image placeholder if needed, keeping it clean as per "improved grid spacing" */}
          <div className="hidden lg:block relative">
             <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
             <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
