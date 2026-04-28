import { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Sparkles } from "lucide-react";

const BUTTON_VARIANTS = {
  hidden: { opacity: 0, scale: 0, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0, y: 20 },
};

const GLOW_ANIMATE = { scale: [1, 1.2, 1] };
const GLOW_TRANSITION = { duration: 2, repeat: Infinity };

const SPIN_TRANSITION = { duration: 8, repeat: Infinity, ease: "linear" as const };

const ARROW_ANIMATE = { y: [2, -2, 2] };
const ARROW_TRANSITION = { duration: 1.5, repeat: Infinity };

const SPARKLE_ANIMATE = { rotate: 360, scale: [1, 1.2, 1] };
const SPARKLE_TRANSITION = { duration: 3, repeat: Infinity };

const HOVER = { scale: 1.1, y: -5 };
const TAP = { scale: 0.9 };

const ScrollToTop = memo(() => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          variants={BUTTON_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          whileHover={HOVER}
          whileTap={TAP}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 group"
          aria-label="Scroll to top"
        >
          <motion.div
            animate={GLOW_ANIMATE}
            transition={GLOW_TRANSITION}
            className="absolute inset-0 bg-primary/20 rounded-full blur-lg"
          />

          <div className="relative w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-float overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={SPIN_TRANSITION}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
            <motion.div animate={ARROW_ANIMATE} transition={ARROW_TRANSITION}>
              <ArrowUp className="w-6 h-6 text-white relative z-10" />
            </motion.div>
          </div>

          <motion.div
            animate={SPARKLE_ANIMATE}
            transition={SPARKLE_TRANSITION}
            className="absolute -top-2 -right-2 text-accent"
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>

          <motion.span
            initial={{ opacity: 0, x: 10 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-card text-foreground text-sm px-3 py-1.5 rounded-lg shadow-soft whitespace-nowrap font-medium"
          >
            Back to Top
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
});

ScrollToTop.displayName = "ScrollToTop";
export default ScrollToTop;