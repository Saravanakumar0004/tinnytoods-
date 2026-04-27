import { useState, useEffect, useCallback, useRef, memo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

// ✅ Max ripples on screen at once — prevents unbounded DOM growth
const MAX_RIPPLES = 6;
const THROTTLE_MS = 200;

const WaterWaveEffect = memo(() => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const isMobile = useIsMobile();
  const lastTimeRef = useRef(0);
  const idRef = useRef(0);

  const createRipple = useCallback((x: number, y: number) => {
    const id = ++idRef.current;

    // ✅ Cap ripple count — evict oldest if over limit
    setRipples((prev) => {
      const next = [...(prev.length >= MAX_RIPPLES ? prev.slice(1) : prev), { id, x, y }];
      return next;
    });

    // ✅ Remove after CSS animation ends (800ms) — no AnimatePresence overhead
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 800);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTimeRef.current < THROTTLE_MS) return;
      lastTimeRef.current = now;
      createRipple(e.clientX, e.clientY);
    };

    const handleClick = (e: MouseEvent) => {
      createRipple(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("click", handleClick, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("click", handleClick);
    };
  }, [createRipple, isMobile]);

  // ✅ Render nothing on mobile — no hook violations
  if (isMobile) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[60] overflow-hidden"
      aria-hidden="true"
    >
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute rounded-full ripple-wave"
          style={{
            left: ripple.x - 30,
            top: ripple.y - 30,
            width: 60,
            height: 60,
          }}
        />
      ))}

      {/* ✅ CSS animation — zero JS per frame, GPU composited */}
      <style>{`
        .ripple-wave {
          border: 3px solid hsl(var(--sky) / 0.7);
          box-shadow: 0 0 25px hsl(var(--sky) / 0.5), 0 0 15px hsl(var(--primary) / 0.3);
          animation: rippleExpand 0.8s ease-out forwards;
          will-change: transform, opacity;
        }
        @keyframes rippleExpand {
          from { transform: scale(0); opacity: 0.8; }
          to   { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
});

WaterWaveEffect.displayName = "WaterWaveEffect";

export default WaterWaveEffect;