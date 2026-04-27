import { motion } from "framer-motion";
import { Heart, Puzzle, Star, Brain, Sparkles } from "lucide-react";
import logo from "@/assets/logo.png";

const LoadingScreen = () => {
  const icons = [
    { Icon: Puzzle, color: "text-primary", delay: 0 },
    { Icon: Heart, color: "text-destructive", delay: 0.1 },
    { Icon: Star, color: "text-accent", delay: 0.2 },
    { Icon: Brain, color: "text-sky", delay: 0.3 },
    { Icon: Sparkles, color: "text-lavender", delay: 0.4 },
  ];

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center overflow-hidden"
    >
     
      <motion.div
        animate={{ 
          scale: [1, 1.5, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          scale: [1.5, 1, 1.5],
          rotate: [360, 180, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          scale: [1, 1.3, 1],
          x: [-100, 100, -100],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[400px] h-[400px] bg-sky/10 rounded-full blur-3xl"
      />

     
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => {
          const IconComp = icons[i % icons.length].Icon;
          const angle = (i / 12) * Math.PI * 2;
          const radius = 180 + (i % 3) * 40;
          return (
            <motion.div
              key={i}
              initial={{ 
                x: Math.cos(angle) * radius + "px",
                y: Math.sin(angle) * radius + "px",
                opacity: 0,
                scale: 0,
              }}
              animate={{ 
                x: [
                  Math.cos(angle) * radius,
                  Math.cos(angle + 0.5) * (radius + 20),
                  Math.cos(angle) * radius,
                ],
                y: [
                  Math.sin(angle) * radius,
                  Math.sin(angle + 0.5) * (radius + 20),
                  Math.sin(angle) * radius,
                ],
                opacity: [0.3, 0.7, 0.3],
                scale: [0.8, 1.2, 0.8],
                rotate: [0, 180, 360],
              }}
              transition={{ 
                duration: 3 + i * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.1,
              }}
              className={`absolute left-1/2 top-1/2 ${icons[i % icons.length].color}`}
              style={{ 
                marginLeft: -12,
                marginTop: -12,
              }}
            >
              <IconComp className="w-6 h-6" />
            </motion.div>
          );
        })}
      </div>

      
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "backOut" }}
        className="relative z-10 flex flex-col items-center"
      >
       
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            rotate: [-2, 2, -2],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <img 
            src={logo} 
            alt="Tiny Todds" 
            className="h-24 md:h-32 w-auto drop-shadow-lg"
          />
        </motion.div>

        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-lg md:text-xl font-heading font-bold text-foreground"
        >
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading magical moments
          </motion.span>
        </motion.p>

        
        <div className="flex gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.5, 1],
                backgroundColor: [
                  "hsl(var(--primary))",
                  "hsl(var(--accent))",
                  "hsl(var(--sky))",
                  "hsl(var(--primary))",
                ],
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-3 h-3 rounded-full bg-primary"
            />
          ))}
        </div>

        
        <motion.div
          className="mt-8 w-48 h-2 rounded-full bg-muted overflow-hidden"
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-full w-1/2 rounded-full"
            style={{
              background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--sky)), hsl(var(--lavender)))",
            }}
          />
        </motion.div>
      </motion.div>

     
      <motion.svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z"
          fill="hsl(var(--primary) / 0.1)"
          animate={{
            d: [
              "M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z",
              "M0,40 C240,0 480,120 720,40 C960,0 1200,120 1440,40 L1440,120 L0,120 Z",
              "M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z",
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M0,80 C360,40 720,120 1080,80 C1260,60 1380,100 1440,80 L1440,120 L0,120 Z"
          fill="hsl(var(--accent) / 0.1)"
          animate={{
            d: [
              "M0,80 C360,40 720,120 1080,80 C1260,60 1380,100 1440,80 L1440,120 L0,120 Z",
              "M0,60 C360,100 720,20 1080,60 C1260,80 1380,40 1440,60 L1440,120 L0,120 Z",
              "M0,80 C360,40 720,120 1080,80 C1260,60 1380,100 1440,80 L1440,120 L0,120 Z",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </motion.svg>
    </motion.div>
  );
};

export default LoadingScreen;
