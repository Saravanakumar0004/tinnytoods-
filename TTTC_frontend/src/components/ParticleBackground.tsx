import { memo } from "react";
import { Heart, Star, Sparkles, Cloud, Smile, Music, Puzzle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICONS: LucideIcon[] = [Heart, Star, Sparkles, Cloud, Smile, Music, Puzzle];

const COLORS = [
  "text-primary/20",
  "text-secondary/30",
  "text-accent/25",
  "text-lavender/30",
  "text-sky/25",
  "text-peach/30",
  "text-success/20",
] as const;

interface Particle {
  id: number;
  Icon: LucideIcon;
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

const PARTICLES: Particle[] = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  Icon: ICONS[i % ICONS.length],
  left: `${10 + (i * 11) % 80}%`,
  top: `${5 + (i * 13) % 85}%`,
  size: 16 + (i % 3) * 8,
  duration: 15 + (i % 4) * 5,
  delay: i * 0.6,
  color: COLORS[i % COLORS.length],
}));

const PARTICLE_STYLE = `
  @keyframes particleFloat {
    0%   { opacity: 0;   transform: translateY(0)      rotate(0deg); }
    10%  { opacity: 0.6; }
    90%  { opacity: 0.6; }
    100% { opacity: 0;   transform: translateY(-220px) rotate(360deg); }
  }
` as const;

const ParticleItem = memo(({ p }: { p: Particle }) => (
  <div
    className={`absolute ${p.color} opacity-0`}
    style={{
      left: p.left,
      top: p.top,
      animation: `particleFloat ${p.duration}s ${p.delay}s linear infinite`,
      willChange: "transform, opacity",
    }}
  >
    <p.Icon size={p.size} className="fill-current opacity-50" aria-hidden="true" />
  </div>
));
ParticleItem.displayName = "ParticleItem";

const ParticleBackground = memo(() => (
  <div
    className="fixed inset-0 pointer-events-none overflow-hidden z-0"
    aria-hidden="true"
  >
    <style>{PARTICLE_STYLE}</style>
    {PARTICLES.map((p) => (
      <ParticleItem key={p.id} p={p} />
    ))}
  </div>
));

ParticleBackground.displayName = "ParticleBackground";
export default ParticleBackground;