import { motion } from "framer-motion";
import { Youtube, Play, Bell, ExternalLink, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getyoutube } from "@/services/modules/youtube.api";

const YouTubeSection = () => {
  const [videos, setVideos] = useState<
    Array<{ id: string; title: string; thumbnail: string; youtubeUrl: string }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const featuredId = videos[0]?.id ?? "3rsJc8e8Vo4";

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setApiError(null);

        const res = await getyoutube();

        const mapped = res
          .filter(v => v.video_id) 
          .map(v => ({
            id: v.video_id,
            title: v.title,
            thumbnail: v.thumbnail || `https://img.youtube.com/vi/${v.video_id}/hqdefault.jpg`,
            youtubeUrl: v.youtube_url || `https://www.youtube.com/watch?v=${v.video_id}`,
          }));

        if (mounted) setVideos(mapped);
      } catch (e: any) {
        if (mounted) setApiError(e?.message ?? "Failed to load videos");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);



  const channelUrl = "https://www.youtube.com/channel/UCap6cC3CV2ZcLUBeGzo6GQw";
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const VISIBLE = isMobile ? 1:3;
  const [index, setIndex] = useState(0);

  const maxIndex = Math.max(0, videos.length - VISIBLE);

  const sliderRef = useRef(null);

  const scrollNext = () => {
    const el = sliderRef.current;
    if (!el) return;
    const nextIndex = index < maxIndex ? index + 1 : 0;
    setIndex(nextIndex);
    el.scrollBy({ left: el.clientWidth * 0.85, behavior: "smooth" });
  };

  const scrollPrev = () => {
    const el = sliderRef.current;
    if (!el) return;
    const prevIndex = index > 0 ? index - 1 : maxIndex;
    setIndex(prevIndex);
    el.scrollBy({ left: -(el.clientWidth * 0.85), behavior: "smooth" });
  };
// slide 
  useEffect(() => {
    const autoScroll = setInterval(() => {
      const el = sliderRef.current;
      if (!el) return;

      const nextIndex = index < maxIndex ? index + 1 : 0;
      setIndex(nextIndex);

      el.scrollTo({
        left: nextIndex * el.clientWidth * 0.85,
        behavior: "smooth",
      });
    }, 2000);

    return () => clearInterval(autoScroll);
  }, [index, maxIndex]);

  return (
    <section id="videos" className="py-20 bg-background relative overflow-hidden">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-10 right-10 w-32 h-32 bg-destructive/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [-20, 20, -20] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-20 left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"
      />

      <motion.div
        animate={{ y: [-5, 5, -5], rotate: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-20 left-20 text-destructive/40"
      >
        <Youtube className="w-12 h-12" />
      </motion.div>
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute bottom-40 right-20 text-accent/50"
      >
        <Star className="w-8 h-8 fill-current" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            <Youtube className="w-4 h-4" />
            Watch & Learn
          </motion.div>

          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Our <span className="text-gradient">YouTube</span> Channel
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-8">
            Subscribe to our channel for educational content, therapy tips, success stories, and updates about autism awareness.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Button
              size="xl"
              className="bg-destructive hover:bg-destructive/90 text-white gap-2 shadow-lg hover:shadow-xl transition-all"
              asChild
            >
              <a href={channelUrl} target="_blank" rel="noopener noreferrer">
                <Bell className="w-5 h-5 animate-wiggle" />
                Subscribe Now
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="relative aspect-video max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-float group">
            <iframe
              src={`https://www.youtube.com/embed/${featuredId}?rel=0`}
              title="Featured Video - Tiny Todds Therapy Care"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            
            <div className="absolute inset-0 pointer-events-none border-4 border-primary/20 rounded-3xl" />
          </div>
        </motion.div>

        <div className="relative px-10 py-10">

       
        <button
          onClick={scrollPrev}
          className="absolute left-2 md:-left-3 top-1/2 -translate-y-1/2 z-20
                      bg-primary/80 shadow-lg rounded-full
                      w-11 h-11 md:w-20 md:h-20
                      flex items-center justify-center"
        >
          <ChevronLeft className="w-8 h-8 md:w-8 md:h-8 text-white"/>
        </button>

       
        <button
          onClick={scrollNext}
          className="absolute right-2 md:-right-3 top-1/2 -translate-y-1/2 z-20
                      bg-primary/80 shadow-lg rounded-full
                      w-11 h-11 md:w-20 md:h-20
                      flex items-center justify-center"
        >
          <ChevronRight className="w-8 h-8 md:w-8 md:h-8 text-white"/>
        </button>

        
        <div className="w-full">
          <div
            ref={sliderRef}
            className="
              flex gap-10
              overflow-x-auto
              scroll-smooth
              snap-x snap-mandatory
              [-webkit-overflow-scrolling:touch]
              pl-8
              md:overflow-hidden
            "
          >
            {videos.map((video, i) => (
              <a
                key={video.id + i}
                href={`https://www.youtube.com/watch?v=${video.youtubeUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group block flex-shrink-0
                  snap-center
                  w-[85%] sm:w-[70%]
                  md:w-auto md:basis-1/3
                "
              >
                
                <div className="bg-primary/10 rounded-3xl overflow-hidden shadow-soft hover:shadow-float transition-all duration-500 border border-border/100">
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-center"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 md:w-16 md:h-16 bg-destructive rounded-full flex items-center justify-center shadow-lg">
                        <Play className="w-6 h-6 md:w-6 md:h-6 text-white ml-1" fill="white" />
                      </div>
                    </div>

                    <div className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-xs font-semibold text-foreground">
                        Video {i + 1}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Youtube className="w-4 h-4 text-destructive" />
                      
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>


        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex justify-center"
        >
          <div className="inline-flex items-center gap-8 bg-card rounded-full px-8 py-4 shadow-soft border border-border/50">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary fill-current" />
              <span className="font-heading font-bold text-foreground">2.27K+</span>
              <span className="text-muted-foreground text-sm">Subscribers</span>
            </div>
            <div className="w-px h-6 bg-border" />
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-destructive" />
              <span className="font-heading font-bold text-foreground">155+</span>
              <span className="text-muted-foreground text-sm">Videos</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default YouTubeSection;