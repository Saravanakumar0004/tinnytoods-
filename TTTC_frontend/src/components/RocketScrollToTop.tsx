import { useState, useEffect, useCallback, forwardRef } from "react";
import { motion, AnimatePresence, useAnimation, HTMLMotionProps } from "framer-motion";
import { ArrowUp, Sparkles } from "lucide-react";


const MotionDiv = forwardRef<HTMLDivElement, HTMLMotionProps<"div">>((props, ref) => (
  <motion.div ref={ref} {...props} />
));

const RocketScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const rocketControls = useAnimation();
  const smokeControls = useAnimation();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300 && !isLaunching) {
        setIsVisible(true);
      } else if (!isLaunching) {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [isLaunching]);

  const launchRocket = useCallback(async () => {
    setIsLaunching(true);
    
  
    smokeControls.start({
      opacity: [0, 1, 1, 1],
      scale: [0.5, 1, 1.5, 2],
      y: [0, 20, 40, 60],
    });

    
    await rocketControls.start({
      x: [-2, 2, -2, 2, 0],
      transition: { duration: 0.3 },
    });

   
    await rocketControls.start({
      y: -window.innerHeight - 100,
      rotate: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.45, 0.02, 0.09, 0.98],
      },
    });

   
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });

  
    await rocketControls.set({ y: 100, opacity: 0 });
    
    setIsLaunching(false);
    setIsVisible(false);
    

    setTimeout(() => {
      rocketControls.set({ y: 0, opacity: 1, rotate: 0 });
    }, 300);
  }, [rocketControls, smokeControls]);

  return (
    <AnimatePresence>
      {(isVisible || isLaunching) && (
        <MotionDiv
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          className="fixed bottom-6 right-4 md:bottom-8 md:right-8 z-50"
        >
        
          <AnimatePresence>
            {isLaunching && (
              <>
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      opacity: 0.8, 
                      scale: 0.3, 
                      x: 0, 
                      y: 0,
                    }}
                    animate={{ 
                      opacity: 0, 
                      scale: [0.5, 1, 1.5],
                      x: (Math.random() - 0.5) * 100,
                      y: [0, 40, 100],
                    }}
                    transition={{ 
                      duration: 1,
                      delay: i * 0.05,
                      ease: "easeOut",
                    }}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
                  >
                    <div 
                      className="rounded-full "
                      style={{
                        width: 20 + Math.random() * 30,
                        height: 20 + Math.random() * 30,
                        background: `radial-gradient(circle, rgba(255,140,50,0.9) 0%, rgba(255,200,100,0.6) 40%, rgba(200,200,200,0.3) 70%, transparent 100%)`,
                      }}
                    />
                  </motion.div>
                ))}
                
               
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={`fire-${i}`}
                    initial={{ 
                      opacity: 1, 
                      scaleY: 0.5,
                      y: 30,
                    }}
                    animate={{ 
                      opacity: [1, 0.8, 0],
                      scaleY: [0.5, 1, 0.2],
                      y: [30, 60, 100],
                    }}
                    transition={{ 
                      duration: 0.5,
                      delay: i * 0.08,
                      repeat: isLaunching ? 2 : 0,
                    }}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none origin-top"
                  >
                    <div 
                      className="w-4 h-12 rounded-full"
                      style={{
                        background: `linear-gradient(to bottom, #FF6B35, #FF9F1C, #FFD166, transparent)`,
                        filter: "blur(2px)",
                      }}
                    />
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>

          
          <motion.button
            animate={rocketControls}
            onClick={launchRocket}
            whileHover={!isLaunching ? { scale: 1.1, y: -5 } : {}}
            whileTap={!isLaunching ? { scale: 0.9 } : {}}
            disabled={isLaunching}
            className="relative group"
            aria-label="Scroll to top"
          >
           
            <motion.div
              animate={!isLaunching ? { scale: [1, 1.2, 1] } : { scale: 1.3, opacity: 0.8 }}
              transition={{ duration: 2, repeat: isLaunching ? 0 : Infinity }}
              className={`absolute inset-0 rounded-full blur-lg ${
                isLaunching 
                  ? "bg-gradient-to-b from-orange-500/50 to-yellow-500/50" 
                  : "bg-primary/20"
              }`}
            />
            
            
            <motion.div 
              className={`relative flex items-center justify-center overflow-hidden transition-all duration-300 ${
                isLaunching 
                  ? "w-12 h-20 rounded-t-full rounded-b-lg" 
                  : "w-14 h-14 rounded-full"
              }`}
              style={{
                background: isLaunching 
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f64f59 100%)"
                  : "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
                boxShadow: isLaunching
                  ? "0 10px 40px -10px rgba(255, 100, 50, 0.5)"
                  : "0 10px 30px -10px hsl(var(--primary) / 0.4)",
              }}
            >
             
              <motion.div
                animate={!isLaunching ? { rotate: 360 } : {}}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
              
              <AnimatePresence mode="wait">
                {isLaunching ? (
                  
                  <motion.div
                    key="rocket"
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    className="relative z-10 flex flex-col items-center"
                  >
                    
                    <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-white/90 mb-1" />
                    
                    <div className="w-4 h-4 rounded-full bg-sky-200 border-2 border-white/50" />
                    
                    <div className="flex gap-3 mt-1">
                      <div className="w-2 h-4 bg-white/80 rounded-b-full -skew-x-12" />
                      <div className="w-2 h-4 bg-white/80 rounded-b-full skew-x-12" />
                    </div>
                  </motion.div>
                ) : (
                  
                  <motion.div
                    key="arrow"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, y: [2, -2, 2] }}
                    exit={{ scale: 0 }}
                    transition={{ 
                      scale: { duration: 0.2 },
                      y: { duration: 1.5, repeat: Infinity }
                    }}
                  >
                    <ArrowUp className="w-6 h-6 text-white relative z-10" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            
            {!isLaunching && (
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-2 -right-2 text-accent"
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
            )}

          
            {!isLaunching && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-card text-foreground text-sm px-3 py-1.5 rounded-lg shadow-soft whitespace-nowrap font-medium"
              >
                🚀 Launch to Top!
              </motion.span>
            )}
          </motion.button>

          
          <AnimatePresence>
            {isLaunching && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
              >
                <span className="text-xs font-bold text-primary animate-pulse">
                  3... 2... 1... 🚀
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
};

export default RocketScrollToTop;
