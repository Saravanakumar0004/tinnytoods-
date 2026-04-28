import { useState, useEffect, useCallback, useRef, memo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const MAX_RIPPLES = 6;
const RIPPLE_DURATION = 800;
const THROTTLE_MS = 200;

// ✅ Injected once at module level — never re-injected on re-render
if (typeof document !== "undefined") {
  const styleId = "__water-wave-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
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
    `;
    document.head.appendChild(style);
  }
}

const WaterWaveEffect = memo(() => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const isMobile = useIsMobile();
  const lastTimeRef = useRef(0);
  const idRef = useRef(0);
  // ✅ Track pending timeouts so we can clear them on unmount
  const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const createRipple = useCallback((x: number, y: number) => {
    const id = ++idRef.current;

    setRipples((prev) => [
      ...(prev.length >= MAX_RIPPLES ? prev.slice(1) : prev),
      { id, x, y },
    ]);

    // ✅ Store timeout ID so unmount cleanup can clear it
    const tid = setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
      timeoutsRef.current.delete(tid);
    }, RIPPLE_DURATION);

    timeoutsRef.current.add(tid);
  }, []);

  useEffect(() => {
    // ✅ Clear all pending timeouts on unmount to avoid setState on dead component
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMove = (e: MouseEvent) => {
      // ✅ performance.now() is faster than Date.now() in hot paths
      const now = performance.now();
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

  if (isMobile) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[60] overflow-hidden"
      aria-hidden="true"
    >
      {ripples.map((ripple) => (
        // ✅ Stable inline style object avoids recalculation per ripple
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
    </div>
  );
});

WaterWaveEffect.displayName = "WaterWaveEffect";

export default WaterWaveEffect;