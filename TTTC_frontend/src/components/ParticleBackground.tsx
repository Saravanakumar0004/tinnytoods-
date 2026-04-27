import { memo } from "react";
import { Heart, Star, Sparkles, Cloud, Smile, Music, Puzzle } from "lucide-react";

const icons = [Heart, Star, Sparkles, Cloud, Smile, Music, Puzzle];
const colors = [
  "text-primary/20",
  "text-secondary/30",
  "text-accent/25",
  "text-lavender/30",
  "text-sky/25",
  "text-peach/30",
  "text-success/20",
];

// ✅ Generated once at module load — not on every render
const PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  Icon: icons[i % icons.length],
  left: `${10 + (i * 11) % 80}%`,
  top: `${5 + (i * 13) % 85}%`,
  size: 16 + (i % 3) * 8,
  // Stagger duration & delay using deterministic values (no Math.random)
  duration: 15 + (i % 4) * 5,
  delay: i * 0.6,
  color: colors[i % colors.length],
}));

const ParticleBackground = memo(() => {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className={`absolute ${p.color} opacity-0`}
          style={{
            left: p.left,
            top: p.top,
            // ✅ CSS animation instead of JS-driven framer-motion
            animation: `particleFloat ${p.duration}s ${p.delay}s linear infinite`,
            willChange: "transform, opacity",
          }}
        >
          <p.Icon
            size={p.size}
            className="fill-current opacity-50"
            aria-hidden="true"
          />
        </div>
      ))}

      {/* ✅ Single <style> tag — no runtime JS animation overhead */}
      <style>{`
        @keyframes particleFloat {
          0%   { opacity: 0;   transform: translateY(0)   rotate(0deg); }
          10%  { opacity: 0.6; }
          90%  { opacity: 0.6; }
          100% { opacity: 0;   transform: translateY(-220px) rotate(360deg); }
        }
      `}</style>
    </div>
  );
});

ParticleBackground.displayName = "ParticleBackground";

export default ParticleBackground;