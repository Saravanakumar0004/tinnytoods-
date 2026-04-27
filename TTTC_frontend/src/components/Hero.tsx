import { lazy, Suspense, useState, useEffect } from "react";
import { ArrowRight, Play, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HomeStats, gethome } from "@/services/modules/home.api";

// Lazy-load Advertisement — it is below primary content
const Advertisement = lazy(() => import("./Advertisment"));

// Hero image: use a regular <img> with fetchpriority="high" so the browser
// starts loading it immediately without waiting for JS hydration.
// We keep the import for the src path but render it as a static img.
import heroImageSrc from "@/assets/hero-children.jpg";

const Hero = () => {
  const [stats, setStats] = useState<HomeStats | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

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

  return (
    <section id="home" className="relative min-h-[90vh] bg-hero-gradient overflow-hidden">
      {/* Blur orbs: replaced motion divs with CSS-only animation to avoid JS overhead */}
      <div className="absolute top-20 left-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute top-40 right-20 w-64 h-64 bg-secondary/30 rounded-full blur-3xl" />
      <div className="absolute bottom-40 left-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 py-20 lg:py-4">
        {/* Advertisement lazy-loaded */}
        <Suspense fallback={null}>
          <Advertisement />
        </Suspense>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content — no framer-motion on initial paint; use CSS animations instead */}
          <div className="text-center lg:text-left z-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-secondary/50 text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
              Care with Compassion
            </div>

            <p className="text-primary font-heading font-semibold text-lg mb-4">
              AUTISM IS CURABLE
            </p>

            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-6">
              If it is{" "}
              <span className="text-gradient">identified</span>
              <br />
              at the right time.
            </h1>

            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto lg:mx-0">
              Early intervention makes all the difference. Our expert team provides
              personalized therapy to help every child reach their full potential.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="playful" size="xl" asChild>
                <a href="/about-autism">
                  Learn More
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button variant="secondary" size="xl" asChild>
                <a href="/contact">Contact Us</a>
              </Button>
            </div>

            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border/50">
                {[
                  { value: `${stats.years_of_experience}+`, label: "Years Experience" },
                  { value: `${stats.happy_students}+`, label: "Happy Students" },
                  { value: `${stats.branches}+`, label: "Branches" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <p className="font-heading font-bold text-2xl md:text-3xl text-primary">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video / Thumbnail */}
          <div className="relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-lavender/30 to-peach/30 rounded-3xl transform rotate-2 scale-105" />
              <div className="relative rounded-2xl overflow-hidden shadow-float">
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
                    {/* fetchpriority="high" tells the browser to fetch this as a high-priority resource */}
                    <img
                      src="https://img.youtube.com/vi/wrZ17U1CQRE/maxresdefault.jpg"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://img.youtube.com/vi/wrZ17U1CQRE/hqdefault.jpg";
                      }}
                      alt="Tiny Todds Therapy Care video thumbnail"
                      className="w-full h-auto object-cover"
                      loading="eager"
                      // @ts-ignore — fetchpriority is valid HTML but not yet in React types
                      fetchpriority="high"
                      width={1280}
                      height={720}
                    />
                    <button
                      onClick={() => setIsVideoPlaying(true)}
                      className="absolute inset-0 flex items-center justify-center bg-foreground/20 backdrop-blur-sm group cursor-pointer"
                      aria-label="Play video"
                    >
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-white/90 rounded-full flex items-center justify-center shadow-2xl group-hover:bg-white transition-colors">
                        <Play className="w-8 h-8 md:w-10 md:h-10 text-primary fill-current ml-1" />
                      </div>
                      <span className="absolute bottom-4 left-4 text-white text-sm font-medium bg-foreground/50 backdrop-blur-sm px-3 py-1 rounded-full">
                        Watch Our Story
                      </span>
                    </button>
                  </>
                )}
              </div>

              {/* Qualified teachers badge */}
              <div className="absolute -bottom-4 -left-4 bg-card shadow-float rounded-xl p-4 flex items-center gap-3 border border-border">
                <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="font-heading font-bold text-foreground">
                    {stats?.qualified_teachers ?? "--"}+
                  </p>
                  <p className="text-xs text-muted-foreground">Qualified Teachers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full" aria-hidden="true">
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
