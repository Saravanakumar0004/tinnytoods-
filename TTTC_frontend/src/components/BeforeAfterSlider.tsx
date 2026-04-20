import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowLeftRight } from "lucide-react";

const comparisons = [
  {
    title: "Communication Skills",
    before: {
      label: "Before Therapy",
      points: ["Limited vocabulary", "Difficulty expressing needs", "Minimal eye contact", "Frustration tantrums"]
    },
    after: {
      label: "After 6 Months",
      points: ["Expanded vocabulary", "Clear communication", "Improved eye contact", "Better emotional control"]
    }
  },
  {
    title: "Social Interaction",
    before: {
      label: "Before Therapy",
      points: ["Prefers playing alone", "Difficulty making friends", "Avoids group activities", "Limited sharing"]
    },
    after: {
      label: "After 6 Months",
      points: ["Enjoys peer play", "Initiates friendships", "Participates in groups", "Shares and takes turns"]
    }
  },
  {
    title: "Daily Living Skills",
    before: {
      label: "Before Therapy",
      points: ["Needs constant assistance", "Routine difficulties", "Sensory overwhelm", "Limited independence"]
    },
    after: {
      label: "After 6 Months",
      points: ["Growing independence", "Follows routines", "Better sensory regulation", "Self-care improvements"]
    }
  }
];

const BeforeAfterSlider = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [sliderPositions, setSliderPositions] = useState<number[]>(comparisons.map(() => 50));
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);


  const handleSliderChange = (index: number, value: number) => {
    const newPositions = [...sliderPositions];
    newPositions[index] = value;
    setSliderPositions(newPositions);
  };

  return (
    <section className="py-10 bg-card relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-success/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      
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
          {comparisons.map((comparison, index) => (
            <motion.div
              key={comparison.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15 }}
              className="glass-card rounded-2xl p-6 relative overflow-hidden"
            >
              <h3 className="font-heading font-bold text-lg text-foreground text-center mb-6">
                {comparison.title}
              </h3>
              
              {/* Comparison container */}
              <div
                ref={(el) => (containerRefs.current[index] = el)}
                className="relative h-64 rounded-xl overflow-hidden touch-one"
              >


                {/* Before side - clips from left as slider moves right */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-destructive/20 to-destructive/10 p-4 flex flex-col"
                  style={{ clipPath: `inset(0 ${sliderPositions[index]}% 0 0)` }}
                >
                  <span className="text-xs font-semibold text-destructive bg-destructive/20 px-2 py-1 rounded-full w-fit mb-3">
                    {comparison.before.label}
                  </span>
                  <ul className="space-y-2">
                    {comparison.before.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-destructive mt-0.5">✕</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* After side - clips from right as slider moves left */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-success/20 to-success/10 p-4 flex flex-col"
                  style={{ clipPath: `inset(0 0 0 ${100 - sliderPositions[index]}%)` }}
                >
                  <span className="text-xs font-semibold text-success bg-success/20 px-2 py-1 rounded-full w-fit mb-3">
                    {comparison.after.label}
                  </span>
                  <ul className="space-y-2">
                    {comparison.after.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="text-success mt-0.5">✓</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Slider handle - positioned at the boundary */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
                             
                  // style={{ left: `calc(${100 - sliderPositions[index]}% - 2px)` }}
                    style={{ left: `${100 - sliderPositions[index]}%` }}
                >
                  <div
                    onPointerDown={(e) => e.currentTarget.setPointerCapture(e.pointerId)}
                    onPointerUp={(e) => {
                    e.currentTarget.releasePointerCapture(e.pointerId);
                    }}
                    onPointerMove={(e) => {
                      if (e.buttons !== 1) return;

                      const container = containerRefs.current[index];
                      if (!container) return;

                      const rect = container.getBoundingClientRect();
                      const x = e.clientX - rect.left;

                      let percent = (x / rect.width) * 100;
                      percent = Math.max(0, Math.min(100, percent));

                      handleSliderChange(index, 100 - percent);
                    }}
                    className="
                              absolute top-1/2 -translate-y-1/2   /* ✅ CENTER VERTICALLY */
                              left-1/2 -translate-x-1/2
                              w-8 h-8 bg-white rounded-full shadow-lg
                              flex items-center justify-center
                              cursor-ew-resize
                            "
                            style={{ touchAction: "none" }}
                  >
                    
                    <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Slider input */}
              
              <p className="text-xs text-center text-muted-foreground mt-2">
                ← Drag to compare →
              </p>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer */}
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
};

export default BeforeAfterSlider;
