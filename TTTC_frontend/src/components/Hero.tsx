import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, Heart, Eye, Users} from "lucide-react";
import { Button } from "@/components/ui/button";
import Advertisement from "./Advertisment";
import heroImage from "@/assets/hero-children.jpg";
import { useState, useEffect } from "react";
import { HomeStats, gethome } from "@/services/modules/home.api";

const Hero = () => {
  const [stats, setStats] = useState<HomeStats | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await gethome();
        setStats(res);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);
  
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <section id="home" className="relative min-h-[90vh] bg-hero-gradient overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute top-20 left-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute top-40 right-20 w-64 h-64 bg-secondary/30 rounded-full blur-3xl" />
      <div className="absolute bottom-40 left-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto  px-4 py-20 lg:py-4">
        {/* Advertisment*/}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >

          {/* 🔥 Advertisement block */}
          <Advertisement />
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left z-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-secondary/50 text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              Care with Compassion
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-primary font-heading font-semibold text-lg mb-4"
            >
              AUTISM IS CURABLE
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-6"
            >
              If it is{" "}
              <span className="text-gradient">identified</span>
              <br />
              at the right time.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Early intervention makes all the difference. Our expert team provides personalized therapy to help every child reach their full potential.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button variant="playful" size="xl" asChild>
                <a href="/about-autism">
                  Learn More
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button variant="secondary" size="xl" asChild>
                <a href="/contact">Contact Us</a>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border/50"
            >
              { stats && [
                { value: `${stats.years_of_experience}+`, label: "Years Experience" },
                { value: `${stats.happy_students}+`, label: "Happy Students" },
                { value: `${stats.branches}+`, label: "Branches" },
              ].map((stat, index) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <motion.p
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 + index * 0.1, type: "spring" }}
                    className="font-heading font-bold text-2xl md:text-3xl text-primary"
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Image/Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative z-10"
          >
            <div className="relative">
              {/* Background shape */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-lavender/30 to-peach/30 rounded-3xl transform rotate-2 scale-105" />
              {/* Image/Video container */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className="relative rounded-2xl overflow-hidden shadow-float"
              >
                {isVideoPlaying ? (
                  <div className="aspect-video">
                    <iframe
                      src="https://www.youtube.com/embed/wrZ17U1CQRE?autoplay=1"
                      title="Tiny Todds Therapy Care"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <>
                    <img
                      src="https://img.youtube.com/vi/wrZ17U1CQRE/maxresdefault.jpg"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://img.youtube.com/vi/wrZ17U1CQRE/hqdefault.jpg";
                      }}
                      alt="Tiny Todds Therapy Care video thumbnail"
                      className="w-full h-auto object-cover"
                    />

                    {/* Play button overlay */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsVideoPlaying(true)}
                      className="absolute inset-0 flex items-center justify-center bg-foreground/20 backdrop-blur-sm group cursor-pointer"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-20 h-20 md:w-24 md:h-24 bg-white/90 rounded-full flex items-center justify-center shadow-2xl group-hover:bg-white transition-colors"
                      >
                        <Play className="w-8 h-8 md:w-10 md:h-10 text-primary fill-current ml-1" />
                      </motion.div>
                      <span className="absolute bottom-4 left-4 text-white text-sm font-medium bg-foreground/50 backdrop-blur-sm px-3 py-1 rounded-full">
                        Watch Our Story
                      </span>
                    </motion.button>
                  </>
                )}
              </motion.div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute -bottom-4 -left-4 bg-card shadow-float rounded-xl p-4 flex items-center gap-3 border border-border"
              >
                <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="font-heading font-bold text-foreground">{stats?.qualified_teachers?? "--"}+</p>
                  <p className="text-xs text-muted-foreground">Qualified Teachers</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave decoration at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-card"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;