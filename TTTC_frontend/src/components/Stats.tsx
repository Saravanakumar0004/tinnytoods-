import { memo, useRef, useEffect, useState, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { GraduationCap, Calendar, Users, MapPin } from "lucide-react";
import { useHome } from "@/hooks/useHome";

const BASE_STATS = [
  { key: "qualified_teachers",  icon: GraduationCap, suffix: "+", label: "Qualified Teachers",  color: "bg-lavender", iconColor: "text-lavender-foreground" },
  { key: "years_of_experience", icon: Calendar,       suffix: "+", label: "Years of Experience", color: "bg-lavender", iconColor: "text-lavender-foreground" },
  { key: "students_enrolled",   icon: Users,          suffix: "+", label: "Students Enrolled",   color: "bg-peach",    iconColor: "text-peach-foreground"    },
  { key: "branches",            icon: MapPin,         suffix: "+", label: "Total Branches",      color: "bg-sky",      iconColor: "text-sky-foreground"      },
] as const;

// ✅ rAF-based counter — smoother and cheaper than setInterval
const AnimatedCounter = memo(({ value, suffix, isInView }: { value: number; suffix: string; isInView: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView || value === 0) return;
    const duration = 2000;
    const start    = performance.now();

    let raf: number;
    const tick = (now: number) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, value]);

  return (
    <span className="font-heading font-bold text-3xl md:text-4xl text-foreground">
      {count}{suffix}
    </span>
  );
});
AnimatedCounter.displayName = "AnimatedCounter";

const Stats = memo(() => {
  // ✅ Shared hook — no duplicate gethome() fetch
  const { stats: home } = useHome();
  const ref      = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = useMemo(() =>
    BASE_STATS.map((s) => ({ ...s, value: Number((home as any)?.[s.key] ?? 0) })),
  [home]);

  return (
    <section className="py-10 bg-card relative overflow-hidden">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
            Our <span className="text-gradient">Impact</span> in Numbers
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, index) => (
            <motion.div key={stat.label}
              initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group"
            >
              <div className="bg-background rounded-2xl p-6 text-center shadow-soft hover:shadow-float transition-all duration-300 border border-border/50 h-full">
                <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-5`}>
                  <stat.icon className={`w-7 h-7 ${stat.iconColor}`} />
                </div>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} isInView={isInView} />
                <p className="text-muted-foreground mt-2 text-sm font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

Stats.displayName = "Stats";
export default Stats;