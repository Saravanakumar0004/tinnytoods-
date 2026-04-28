import { memo, useRef, useEffect, useState, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, Users, Award, Activity, BarChart3, PieChart, LineChart, Zap } from "lucide-react";
import { getabout, type About } from "@/services/modules/about.api";
import { useHome } from "@/hooks/useHome";

const analyticsData = [
  { year: "2007", students: 20  },
  { year: "2010", students: 40  },
  { year: "2013", students: 120 },
  { year: "2016", students: 180 },
  { year: "2019", students: 280 },
  { year: "2022", students: 380 },
  { year: "2025", students: 780 },
];

const therapyBreakdown = [
  { name: "Speech Therapy",       percentage: 35, color: "bg-primary" },
  { name: "Occupational Therapy", percentage: 28, color: "bg-accent"  },
  { name: "Behavioral Therapy",   percentage: 22, color: "bg-primary" },
  { name: "Sensory Integration",  percentage: 15, color: "bg-accent"  },
];

const BASE_KEY_METRICS = [
  { key: "success_rate",       icon: TrendingUp, suffix: "%", label: "Success Rate",       color: "bg-success/20",   iconColor: "text-success"           },
  { key: "parent_satisfaction",icon: Users,      suffix: "%", label: "Parent Satisfaction",color: "bg-primary/20",   iconColor: "text-primary"           },
  { key: "improvement_rate",   icon: Award,      suffix: "%", label: "Improvement Rate",   color: "bg-accent/70",    iconColor: "text-accent-foreground" },
  { key: "early_detection",    icon: Activity,   suffix: "%", label: "Early Detection",    color: "bg-lavender/70",  iconColor: "text-lavender-foreground"},
] as const;

// ✅ CSS-only progress bar — no useState/useEffect per item
const AnimatedProgress = memo(({ value, color, isInView }: { value: number; color: string; isInView: boolean }) => (
  <div className="h-2 bg-muted rounded-full overflow-hidden">
    <div
      className={`h-full ${color} rounded-full transition-all duration-[1500ms] ease-out`}
      style={{ width: isInView ? `${value}%` : "0%" }}
    />
  </div>
));
AnimatedProgress.displayName = "AnimatedProgress";

// ✅ CSS-only animated bar
const AnimatedBar = memo(({ height, delay, isInView, label, value }: {
  height: number; delay: number; isInView: boolean; label: string; value: number;
}) => (
  <div className="flex flex-col items-center gap-2 group">
    <div className="relative" style={{ height: 160, display: "flex", alignItems: "flex-end" }}>
      <div
        className="w-8 md:w-12 bg-gradient-to-t from-primary to-accent rounded-t-lg"
        style={{
          height: isInView ? height : 0,
          transition: `height 1s ${delay}s ease-out`,
        }}
      />
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-card px-2 py-1 rounded text-xs font-bold shadow-soft opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {value}
      </div>
    </div>
    <span className="text-xs text-muted-foreground font-medium">{label}</span>
  </div>
));
AnimatedBar.displayName = "AnimatedBar";

const Analytics = memo(() => {
  const [about, setAbout] = useState<About | null>(null);
  const ref      = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { stats } = useHome();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getabout();
        if (!cancelled) setAbout(res);
      } catch (err) { console.error(err); }
    })();
    return () => { cancelled = true; };
  }, []);

  const keyMetrics = useMemo(() =>
    BASE_KEY_METRICS.map((s) => ({ ...s, value: Number((about as any)?.[s.key] ?? 0) })),
  [about]);

  return (
    <section id="analytics" className="py-10 bg-sky-gradient relative overflow-hidden" ref={ref}>
      {/* ✅ Static decorative elements — CSS animation only */}
      <div className="absolute top-10 left-10 w-40 h-40 border-2 border-dashed border-primary/20 rounded-full pointer-events-none"
        style={{ animation: "spin 30s linear infinite" }} aria-hidden="true" />
      <div className="absolute bottom-20 right-10 w-60 h-60 bg-lavender/20 rounded-full blur-3xl pointer-events-none"
        style={{ animation: "blobPulse 5s ease-in-out infinite" }} aria-hidden="true" />
      <div className="absolute top-32 right-20 text-primary/30 pointer-events-none"
        style={{ animation: "floatY 5s ease-in-out infinite" }} aria-hidden="true">
        <BarChart3 className="w-16 h-16" />
      </div>
      <div className="absolute bottom-40 left-20 text-accent/40 pointer-events-none"
        style={{ animation: "floatRotate 4s ease-in-out infinite" }} aria-hidden="true">
        <PieChart className="w-12 h-12" />
      </div>

      <style>{`
        @keyframes spin        { to { transform: rotate(360deg); } }
        @keyframes blobPulse   { 0%,100%{transform:scale(1)}50%{transform:scale(1.2)} }
        @keyframes floatY      { 0%,100%{transform:translateY(-10px)}50%{transform:translateY(10px)} }
        @keyframes floatRotate { 0%,100%{transform:rotate(-10deg)}50%{transform:rotate(10deg)} }
      `}</style>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-16">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <LineChart className="w-4 h-4" />Data & Analytics
          </motion.div>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Our <span className="text-gradient">Growth</span> & Impact
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Real data showing our commitment to helping children with autism achieve their potential.
          </p>
        </motion.div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          {keyMetrics.map((metric, index) => (
            <motion.div key={metric.label}
              initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }} whileHover={{ y: -8, scale: 1.02 }}
              className="bg-card rounded-3xl p-6 shadow-soft hover:shadow-float transition-all duration-500 border border-border/50">
              <div className={`w-12 h-12 ${metric.color} rounded-2xl flex items-center justify-center mb-4`}>
                <metric.icon className={`w-6 h-6 ${metric.iconColor}`} />
              </div>
              <motion.p initial={{ scale: 0 }} animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                className="font-heading font-bold text-3xl md:text-4xl text-foreground">
                {metric.value}{metric.suffix}
              </motion.p>
              <p className="text-muted-foreground text-sm mt-1">{metric.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Bar chart */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }} className="bg-card rounded-3xl p-8 shadow-soft border border-border/50">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-foreground">Student Growth</h3>
                <p className="text-muted-foreground text-sm">Year over year enrollment</p>
              </div>
            </div>
            <div className="flex items-end justify-between h-48 px-4">
              {analyticsData.map((data, index) => (
                <AnimatedBar key={data.year}
                  height={(data.students / 600) * 160}
                  delay={0.5 + index * 0.1}
                  isInView={isInView}
                  label={data.year}
                  value={data.students}
                />
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-border/50 flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm text-muted-foreground">
                <strong className="text-foreground">371%</strong> growth since 2019
              </span>
            </div>
          </motion.div>

          {/* Therapy distribution */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 }} className="bg-card rounded-3xl p-8 shadow-soft border border-border/50">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-lavender/30 rounded-xl flex items-center justify-center">
                <PieChart className="w-5 h-5 text-lavender-foreground" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-foreground">Therapy Distribution</h3>
                <p className="text-muted-foreground text-sm">Services breakdown</p>
              </div>
            </div>

            <div className="space-y-5">
              {therapyBreakdown.map((item, index) => (
                <motion.div key={item.name} initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.6 + index * 0.1 }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-foreground font-medium">{item.name}</span>
                    <span className="font-heading font-bold text-foreground">{item.percentage}%</span>
                  </div>
                  <AnimatedProgress value={item.percentage} color={item.color} isInView={isInView} />
                </motion.div>
              ))}
            </div>

            {/* SVG donut */}
            <motion.div initial={{ opacity: 0, scale: 0 }} animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1, type: "spring" }}
              className="mt-6 pt-4 border-t border-border/50 flex items-center justify-center">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
                  <circle cx="48" cy="48" r="40" stroke="hsl(var(--primary))" strokeWidth="8" fill="none"
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: isInView ? "230 251" : "0 251",
                      transition: "stroke-dasharray 2s 1.2s ease-out",
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-heading font-bold text-xl text-foreground">92%</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-12 bg-gradient-to-r from-primary/10 via-accent/10 to-lavender/10 rounded-3xl p-8 text-center">
          <h3 className="font-heading font-bold text-2xl text-foreground mb-4">Together, We've Made a Difference</h3>
          <div className="flex flex-wrap justify-center gap-8">
            <div>
              <p className="font-heading font-bold text-4xl text-primary">2850+</p>
              <p className="text-muted-foreground">Children Recovered</p>
            </div>
            <div className="w-px bg-border hidden md:block" />
            <div>
              <p className="font-heading font-bold text-4xl">500+</p>
              <p className="text-muted-foreground">Families Supported</p>
            </div>
            <div className="w-px bg-border hidden md:block" />
            <div>
              <p className="font-heading font-bold text-4xl text-lavender-foreground">{stats?.years_of_experience ?? "--"}+</p>
              <p className="text-muted-foreground">Years of Excellence</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

Analytics.displayName = "Analytics";
export default Analytics;