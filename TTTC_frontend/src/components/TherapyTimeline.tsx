import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { 
  ClipboardCheck, 
  Users, 
  Target, 
  TrendingUp, 
  Award,
  ArrowRight
} from "lucide-react";

const milestones = [
  {
    step: 1,
    title: "Initial Assessment",
    description: "Comprehensive evaluation by our expert team to understand your child's unique needs and strengths.",
    icon: ClipboardCheck,
    duration: "Week 1-2",
    color: "from-primary to-primary/70"
  },
  {
    step: 2,
    title: "Personalized Plan",
    description: "Custom therapy plan designed specifically for your child's developmental goals and learning style.",
    icon: Target,
    duration: "Week 2-3",
    color: "bg-blue-600/50"
  },
  {
    step: 3,
    title: "Therapy Sessions",
    description: "Regular one-on-one and group sessions with certified therapists.",
    icon: Users,
    duration: "Ongoing",
    color: "from-success to-success/70"
  },
  {
    step: 4,
    title: "Progress Tracking",
    description: "Monthly progress reports, parent meetings, and plan adjustments to ensure optimal growth.",
    icon: TrendingUp,
    duration: "Monthly",
    color: "from-accent to-accent/70"
  },
  {
    step: 5,
    title: "Milestones Achieved",
    description: "Celebrate victories big and small as your child reaches their developmental milestones.",
    icon: Award,
    duration: "Continuous",
    color: "bg-blue-600/50"
  }
];

const TherapyTimeline = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="timeline" className="py-10 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.05)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--secondary)/0.05)_0%,transparent_50%)]" />
      
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            Your Child's Journey
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            The <span className="text-gradient">Therapy Journey</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A clear roadmap showing how we guide each child from assessment to achievement
          </p>
        </motion.div>

        {/* Desktop Timeline */}
        <div className="hidden lg:block relative max-w-5xl mx-auto">
          {/* Central line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-success to-lavender origin-top"
          />

          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.step}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.15 }}
              className={`relative flex items-center mb-12 ${
                index % 2 === 0 ? "flex-row" : "flex-row-reverse"
              }`}
            >
              {/* Content card */}
              <div className={`w-5/12 ${index % 2 === 0 ? "pr-12 text-right" : "pl-12 text-left"}`}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="glass-card-hover rounded-2xl p-6"
                >
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${milestone.color} text-white mb-3`}>
                    {milestone.duration }
                  </span>
                  <h3 className="font-heading font-bold text-xl text-foreground mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {milestone.description}
                  </p>
                </motion.div>
              </div>

              {/* Center icon */}
              <div className="absolute left-1/2 -translate-x-1/2 z-10">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0  }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ delay: 0.4 + index * 0.15, type: "spring" }}
                  className={`w-14 h-14 rounded-full bg-gradient-to-br ${milestone.color} flex items-center justify-center `}
                > 
                <div className="absolute inset-0 rounded-full bg-black/20"></div>

                  <milestone.icon className="w-6 h-6 text-white drop-shadow-lg"
                    />

                </motion.div>
              </div>

              {/* Step number */}
              <div className={`w-5/12 ${index % 2 === 0 ? "pl-12" : "pr-12"}`}>
                <span className="font-heading font-bold text-6xl text-muted/20">
                  0{milestone.step}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Timeline */}
        <div className="lg:hidden space-y-6">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.step}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * index }}
              className="flex gap-4"
            >
              {/* Icon & Line */}
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${milestone.color} flex items-center justify-center shadow-lg shrink-0`}>
                  <milestone.icon className="w-5 h-5 text-white" />
                </div>
                {index < milestones.length - 1 && (
                  <div className="w-0.5 flex-1 bg-gradient-to-b from-muted to-transparent mt-2" />
                )}
              </div>

              {/* Content */}
              <div className="pb-6">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${milestone.color} text-white mb-2`}>
                  Step {milestone.step} • {milestone.duration}
                </span>
                <h3 className="font-heading font-bold text-lg text-foreground mb-1">
                  {milestone.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {milestone.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
        </motion.div>
      </div>
    </section>
  );
};

export default TherapyTimeline;
