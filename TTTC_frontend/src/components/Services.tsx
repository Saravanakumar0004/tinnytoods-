import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { 
  Eye, Target, HandHeart, Brain, Puzzle, Lightbulb, Ear, Activity, Sparkles, 
  LucideIcon, Baby, Users, Smile, Star, Stethoscope, HeartPulse, 
  HelpingHand, GraduationCap, Mic, BookOpen, HelpCircle
} from "lucide-react";
import { getservices, type Services } from "@/services/modules/services.api";
import { useEffect, useMemo, useState } from "react";


const ICONS: Record<string, LucideIcon> = {
  Eye, Target, HandHeart, Brain, Puzzle, Ear, Activity, Sparkles, Lightbulb,
  Baby, Users, Smile, Star, Stethoscope, HeartPulse, HelpingHand,
  GraduationCap, Mic, BookOpen, HelpCircle
};

const STYLE_PRESETS = [
  { color: "bg-primary/20", iconColor: "text-secondary-foreground" },
  { color: "bg-lavender", iconColor: "text-lavender-foreground" },
  { color: "bg-peach", iconColor: "text-peach-foreground" },
  { color: "bg-accent", iconColor: "text-accent-foreground" },
  { color: "bg-sky", iconColor: "text-sky-foreground" },
  { color: "bg-success", iconColor: "text-success-foreground" },
  { color: "bg-primary/20", iconColor: "text-primary" },
  { color: "bg-accent/90", iconColor: "text-accent-foreground" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15, duration: 0.6 }
  }
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { delay: 0.2, type: "spring" } }
};

const Services = () => {
  const [services, setServices] = useState<Services[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

 
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const blobY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const blobX = useTransform(scrollYProgress, [0, 1], [0, -50]);

  useEffect(() => {
    (async () => {
      try {
        const response = await getservices();
        const data = Array.isArray(response) 
          ? response 
          : (response as any)?.data || (response as any)?.results || [];
        setServices(data);
      } catch (e) {
        console.error("Services API error", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const renderedServices = useMemo(() => {
    return services.map((s, index) => {
      const Icon = ICONS[s.icon] ?? HelpCircle;
      const style = STYLE_PRESETS[index % STYLE_PRESETS.length];
      return { ...s, Icon, ...style };
    });
  }, [services]);

  if (loading) {
    return (
      <section className="py-32 bg-gradient-to-b from-background to-card flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full mx-auto mb-4"
          />
          <p className="text-muted-foreground animate-pulse">Loading services...</p>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      id="services" 
      className="py-20 bg-card relative overflow-hidden"
    >
     
      <motion.div 
        style={{ y: blobY }}
        className="absolute top-20 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"
      />
      <motion.div 
        style={{ x: blobX }}
        className="absolute bottom-20 left-0 w-80 h-80 bg-lavender/20 rounded-full blur-3xl"
      />
      
      <div className="container mx-auto px-4 relative z-10">
        
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            variants={badgeVariants}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            <Lightbulb className="w-4 h-4" />
            Services We Provide
          </motion.span>
          
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Providing Good Qualities
            <br />
            <span className="text-gradient">For Your Loving Kids</span>
          </h2>
          
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Comprehensive therapy services designed to support your child's unique developmental journey.
          </p>
        </motion.div>

        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {renderedServices.length > 0 ? (
            renderedServices.map((service, idx) => (
              <motion.div
                key={service.title + idx}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                className="group"
              >
                <div className="bg-background rounded-2xl p-6 h-full shadow-soft hover:shadow-float transition-all duration-300 border border-border/50">
                  
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className={`w-14 h-14 ${service.color} rounded-xl flex items-center justify-center mb-5`}
                  >
                    <service.Icon className={`w-7 h-7 ${service.iconColor} transition-transform group-hover:scale-110`} />
                  </motion.div>

                  
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-16"
            >
              <div className="inline-flex flex-col items-center gap-4 text-muted-foreground">
                <Sparkles className="w-12 h-12 opacity-30" />
                <p className="text-lg">No services available at the moment.</p>
                <p className="text-sm">Check back soon for our amazing offerings.</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;