import { memo } from "react";
import { motion } from "framer-motion";
import { Heart, Puzzle, Star, Brain, Sparkles } from "lucide-react";
import logo from "@/assets/logo.png";

const RING_ICONS = [
  { Icon: Puzzle, color: "text-primary/60" },
  { Icon: Heart, color: "text-destructive/60" },
  { Icon: Star, color: "text-accent/60" },
  { Icon: Brain, color: "text-sky/60" },
  { Icon: Sparkles, color: "text-lavender/60" },
  { Icon: Puzzle, color: "text-primary/40" },
  { Icon: Heart, color: "text-destructive/40" },
  { Icon: Star, color: "text-accent/40" },
];

const DOTS = [0, 1, 2];

const LoadingScreen = memo(() => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ✅ 2 simple CSS-pulsing blobs instead of 3 complex framer-motion blobs */}
      <div
        className="absolute w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl"
        style={{ animation: "blobPulse 8s ease-in-out infinite" }}
        aria-hidden="true"
      />
      <div
        className="absolute w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl"
        style={{ animation: "blobPulse 10s ease-in-out infinite reverse" }}
        aria-hidden="true"
      />

      {/* ✅ Single rotating ring container — 1 CSS animation drives all icons */}
      <div
        className="absolute w-[360px] h-[360px]"
        style={{ animation: "orbitRing 20s linear infinite" }}
        aria-hidden="true"
      >
        {RING_ICONS.map((item, i) => {
          const angle = (i / RING_ICONS.length) * 360;
          return (
            <div
              key={i}
              className={`absolute ${item.color}`}
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${angle}deg) translateY(-180px) rotate(-${angle}deg)`,
              }}
            >
              <item.Icon className="w-5 h-5 fill-current opacity-60" />
            </div>
          );
        })}
      </div>

      {/* Logo + text */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [-1.5, 1.5, -1.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src={logo} alt="Tiny Todds" className="h-24 md:h-32 w-auto drop-shadow-lg" />
        </motion.div>

        <p className="mt-6 text-lg md:text-xl font-heading font-bold text-foreground">
          <span style={{ animation: "textFade 1.5s ease-in-out infinite" }}>
            Loading magical moments
          </span>
        </p>

        {/* ✅ CSS-animated dots instead of framer-motion per dot */}
        <div className="flex gap-2 mt-4" aria-hidden="true">
          {DOTS.map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-primary"
              style={{ animation: `dotBounce 1s ${i * 0.2}s ease-in-out infinite` }}
            />
          ))}
        </div>

        {/* Progress shimmer bar */}
        <div className="mt-8 w-48 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full w-1/2 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--sky)), hsl(var(--lavender)))",
              animation: "shimmerBar 1.5s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      {/* Single CSS style block — no JS animation per element */}
      <style>{`
        @keyframes orbitRing {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes blobPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50%       { transform: scale(1.25); opacity: 0.3; }
        }
        @keyframes dotBounce {
          0%, 100% { transform: scale(1); background-color: hsl(var(--primary)); }
          50%       { transform: scale(1.6); background-color: hsl(var(--accent)); }
        }
        @keyframes shimmerBar {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes textFade {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
      `}</style>
    </motion.div>
  );
});

LoadingScreen.displayName = "LoadingScreen";

export default LoadingScreen;