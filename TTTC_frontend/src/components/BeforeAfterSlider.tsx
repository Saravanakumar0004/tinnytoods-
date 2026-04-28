import { memo, useCallback, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowLeftRight } from "lucide-react";

// ── Constants ─────────────────────────────────────────────────────────────────
const COMPARISONS = [
  {
    title: "Communication Skills",
    before: {
      label: "Before Therapy",
      points: ["Limited vocabulary", "Difficulty expressing needs", "Minimal eye contact", "Frustration tantrums"],
    },
    after: {
      label: "After 6 Months",
      points: ["Expanded vocabulary", "Clear communication", "Improved eye contact", "Better emotional control"],
    },
  },
  {
    title: "Social Interaction",
    before: {
      label: "Before Therapy",
      points: ["Prefers playing alone", "Difficulty making friends", "Avoids group activities", "Limited sharing"],
    },
    after: {
      label: "After 6 Months",
      points: ["Enjoys peer play", "Initiates friendships", "Participates in groups", "Shares and takes turns"],
    },
  },
  {
    title: "Daily Living Skills",
    before: {
      label: "Before Therapy",
      points: ["Needs constant assistance", "Routine difficulties", "Sensory overwhelm", "Limited independence"],
    },
    after: {
      label: "After 6 Months",
      points: ["Growing independence", "Follows routines", "Better sensory regulation", "Self-care improvements"],
    },
  },
] as const;

const INITIAL_POSITIONS = COMPARISONS.map(() => 50);

// ── Sub-component: single comparison card ─────────────────────────────────────
interface SliderCardProps {
  comparison: (typeof COMPARISONS)[number];
  index: number;
  position: number;
  onPositionChange: (index: number, value: number) => void;
  isInView: boolean;
}

const SliderCard = memo(({ comparison, index, position, onPositionChange, isInView }: SliderCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (e.buttons !== 1) return;
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
      onPositionChange(index, 100 - percent);
    },
    [index, onPositionChange]
  );

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
  }, []);

  // Stable clip-path strings — only recalculated when position changes
  const beforeClip = useMemo(() => `inset(0 ${position}% 0 0)`, [position]);
  const afterClip  = useMemo(() => `inset(0 0 0 ${100 - position}%)`, [position]);
  const dividerLeft = useMemo(() => ({ left: `${100 - position}%` }), [position]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15 }}
      className="glass-card rounded-2xl p-6 relative overflow-hidden"
    >
      <h3 className="font-heading font-bold text-lg text-foreground text-center mb-6">
        {comparison.title}
      </h3>

      <div ref={containerRef} className="relative h-64 rounded-xl overflow-hidden touch-none">

        {/* Before panel */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-destructive/20 to-destructive/10 p-4 flex flex-col"
          style={{ clipPath: beforeClip }}
        >
          <span className="text-xs font-semibold text-destructive bg-destructive/20 px-2 py-1 rounded-full w-fit mb-3">
            {comparison.before.label}
          </span>
          <ul className="space-y-2">
            {comparison.before.points.map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-destructive mt-0.5">✕</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* After panel */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-success/20 to-success/10 p-4 flex flex-col"
          style={{ clipPath: afterClip }}
        >
          <span className="text-xs font-semibold text-success bg-success/20 px-2 py-1 rounded-full w-fit mb-3">
            {comparison.after.label}
          </span>
          <ul className="space-y-2">
            {comparison.after.points.map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm text-foreground">
                <span className="text-success mt-0.5">✓</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Divider + handle */}
        <div className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10" style={dividerLeft}>
          <div
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
            className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2
                       w-8 h-8 bg-white rounded-full shadow-lg
                       flex items-center justify-center cursor-ew-resize"
            style={{ touchAction: "none" }}
          >
            <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      <p className="text-xs text-center text-muted-foreground mt-2">← Drag to compare →</p>
    </motion.div>
  );
});
SliderCard.displayName = "SliderCard";

// ── Main component ─────────────────────────────────────────────────────────────
const BeforeAfterSlider = memo(() => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [sliderPositions, setSliderPositions] = useState<number[]>(INITIAL_POSITIONS);

  const handlePositionChange = useCallback((index: number, value: number) => {
    setSliderPositions((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  return (
    <section className="py-10 bg-card relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-success/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-success/20 text-success rounded-full text-sm font-medium mb-4">
            <ArrowLeftRight className="w-4 h-4" />
            Real Progress
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            The <span className="text-gradient">Transformation</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See the typical progress children make during their therapy journey with us
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {COMPARISONS.map((comparison, index) => (
            <SliderCard
              key={comparison.title}
              comparison={comparison}
              index={index}
              position={sliderPositions[index]}
              onPositionChange={handlePositionChange}
              isInView={isInView}
            />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-muted-foreground mt-8 max-w-2xl mx-auto"
        >
          *Results vary for each child. This represents typical progress observed in our programs.
          Individual outcomes depend on various factors including therapy frequency and home support.
        </motion.p>
      </div>
    </section>
  );
});

BeforeAfterSlider.displayName = "BeforeAfterSlider";
export default BeforeAfterSlider;