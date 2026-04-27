import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const WaterWaveEffect = () => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const isMobile = useIsMobile();

  const createRipple = useCallback((x: number, y: number) => {
    const id = Date.now() + Math.random();
    setRipples(prev => [...prev, { id, x, y }]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 800);
  }, []);

  useEffect(() => {
    
    if (isMobile) return;

    let lastTime = 0;
    const throttleMs = 150; 

    const handleMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime < throttleMs) return;
      lastTime = now;

      createRipple(e.clientX, e.clientY);
    };

    const handleClick = (e: MouseEvent) => {
      createRipple(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('click', handleClick);
    };
  }, [createRipple, isMobile]);

 
  if (isMobile) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute pointer-events-none rounded-full"
            style={{
              left: ripple.x - 30,
              top: ripple.y - 30,
              width: 60,
              height: 60,
              border: "3px solid hsl(var(--sky) / 0.7)",
              boxShadow: "0 0 25px hsl(var(--sky) / 0.5), 0 0 15px hsl(var(--primary) / 0.3)",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default WaterWaveEffect;