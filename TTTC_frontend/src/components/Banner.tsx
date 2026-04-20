import { motion } from "framer-motion";
import {
  HeartHandshake,
  Brain,
  Users,
  Speech,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";

const SERVICES = [
  {
    title: "Speech & Communication Therapy",
    desc: "Helping children improve speech clarity, language development, and confident communication.",
    Icon: Speech,
  },
  {
    title: "Behavioral Support Therapy",
    desc: "Structured therapy plans that encourage positive routines, focus, and emotional balance.",
    Icon: Brain,
  },
  {
    title: "Child Development Care",
    desc: "Personalized support that strengthens social, emotional, and developmental growth.",
    Icon: HeartHandshake,
  },
  {
    title: "Parent & Family Guidance",
    desc: "Compassionate guidance for families to support progress at home and in daily life.",
    Icon: Users,
  },
];

const BANNER_IMAGES = [
  "/images/banner.jpeg",
  "/images/banner1.jpeg",
  "/images/banner2.jpeg",
  "/images/banner3.png",
  "/images/banner4.jpeg",
  "/images/banner5.jpeg",
];

const TherapyBanner = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [nextSlide, setNextSlide] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const serviceTimer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SERVICES.length);
    }, 2000);

    return () => clearInterval(serviceTimer);
  }, []);

  useEffect(() => {
    const sliderTimer = setInterval(() => {
      handleSlideChange((currentSlide + 1) % BANNER_IMAGES.length);
    }, 5000);

    return () => clearInterval(sliderTimer);
  }, [currentSlide]);

  const handleSlideChange = (newIndex: number) => {
    if (newIndex === currentSlide || isTransitioning) return;

    setNextSlide(newIndex);
    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentSlide(newIndex);
      setIsTransitioning(false);
    }, 700);
  };

  return (
    <div className="w-full overflow-x-hidden" id="home">
      <section
        id="home"
        className="relative w-full min-h-screen flex items-center overflow-hidden scroll-mt-36 bg-black"
      >
        {/* Background images */}
        <div className="absolute inset-0 z-0 bg-black">
          {/* Current image */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            <img
              src={BANNER_IMAGES[currentSlide]}
              alt="Therapy Banner"
              className="w-full h-full object-cover object-center"
              draggable={false}
            />
          </div>

          {/* Next image */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isTransitioning ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={BANNER_IMAGES[nextSlide]}
              alt="Therapy Banner Next"
              className="w-full h-full object-cover object-center"
              draggable={false}
            />
          </div>
        </div>

        {/* Single overlay wrapper */}
        <div className="absolute inset-0 z-[1]">
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-black/15" />
          <div className="absolute bottom-0 left-0 w-full h-24 sm:h-20 bg-gradient-to-t from-white via-white/40 to-transparent" />
        </div>

        {/* Dots */}
        <div className="absolute bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-[3] flex items-center gap-2">
          {BANNER_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === index && !isTransitioning
                  ? "w-8 bg-primary"
                  : nextSlide === index && isTransitioning
                  ? "w-8 bg-primary"
                  : "w-2.5 bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 md:pt-20 pb-10 sm:pb-16">
          <div className="flex items-center justify-center min-h-[calc(100vh-120px)] sm:min-h-[calc(100vh-220px)]">
            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col justify-center items-center text-center w-full"
            >
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 mt-5 sm:mt-5 rounded-full border border-white/25 bg-white px-3 py-1.5 sm:px-4 sm:py-2 text-black text-[10px] sm:text-sm font-medium backdrop-blur-md mb-4 sm:mb-5">
                  <HeartHandshake className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  Trusted Pediatric Therapy & Early Support
                </div>

                <h2 className="text-white text-2xl sm:text-4xl lg:text-3xl font-bold leading-snug sm:leading-tight">
                  Personalized Care That Helps Children
                  <span className="block text-primary mt-1 sm:mt-2">
                    Grow with Confidence
                  </span>
                </h2>

                <p className="mt-4 sm:mt-5 text-white/85 text-xs sm:text-base md:text-lg leading-6 sm:leading-7 max-w-xl sm:max-w-2xl mx-auto px-1">
                  Our dedicated therapy programs are designed to support every
                  child’s unique journey through professional guidance,
                  structured care, and family-centered support.
                </p>

                <div className="mt-6 sm:mt-8 flex flex-row flex-wrap gap-2 sm:gap-4 justify-center">
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-primary text-white px-4 sm:px-7 py-2.5 sm:py-3.5 font-semibold text-xs sm:text-base shadow-xl hover:opacity-90 transition duration-300"
                  >
                    Get Started
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </a>

                  <a
                    href="/services"
                    className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full border border-white/35 bg-white text-black px-4 sm:px-7 py-2.5 sm:py-3.5 font-semibold text-xs sm:text-base backdrop-blur-md hover:bg-white transition duration-300"
                  >
                    Explore Services
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Services Row */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden sm:block mt-10 sm:mt-14"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {SERVICES.map((service, index) => {
                const Icon = service.Icon;
                const isActive = index === activeIndex;

                return (
                  <motion.div
                    key={service.title}
                    animate={{
                      y: isActive ? -6 : 0,
                      scale: isActive ? 1.03 : 1,
                      opacity: isActive ? 1 : 0.9,
                    }}
                    transition={{ duration: 0.35 }}
                    className="text-center px-3 py-3"
                  >
                    <div className="mb-3 flex justify-center">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isActive ? "bg-primary shadow-lg" : "bg-white/15"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            isActive ? "text-white" : "text-primary"
                          }`}
                        />
                      </div>
                    </div>

                    <h3 className="text-white text-sm sm:text-base font-semibold">
                      {service.title}
                    </h3>

                    <p className="mt-2 text-white/80 text-xs sm:text-sm leading-6">
                      {service.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TherapyBanner;