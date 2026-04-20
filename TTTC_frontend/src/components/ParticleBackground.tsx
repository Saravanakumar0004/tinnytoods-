import { motion } from "framer-motion";
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

interface Particle {
  id: number;
  Icon: typeof Heart;
  x: string;
  y: string;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

const generateParticles = (count: number): Particle[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    Icon: icons[i % icons.length],
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    size: 16 + Math.random() * 24,
    duration: 15 + Math.random() * 20,
    delay: Math.random() * 5,
    color: colors[i % colors.length],
  }));
};

const ParticleBackground = () => {
  const particles = generateParticles(15);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ 
            opacity: 0,
            x: particle.x,
            y: particle.y,
          }}
          animate={{ 
            opacity: [0, 0.6, 0.6, 0],
            y: [particle.y, `calc(${particle.y} - 200px)`],
            rotate: [0, 360],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          className={`absolute ${particle.color}`}
          style={{ 
            left: particle.x,
            top: particle.y,
          }}
        >
          <particle.Icon 
            size={particle.size} 
            className="fill-current opacity-50"
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ParticleBackground;
