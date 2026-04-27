// LoadingScreen — lightweight version
// Original used 3 infinite rotating blur divs + 12 orbiting framer-motion icons
// + animated SVG path morphing. All running simultaneously during the most
// performance-critical window (initial page load). Replaced with CSS-only animation.
import logo from "@/assets/logo.png";

const LoadingScreen = () => (
  <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center">
    <img
      src={logo}
      alt="Tiny Todds"
      className="h-24 md:h-32 w-auto drop-shadow-lg animate-bounce"
      width={128}
      height={128}
    />
    <p className="mt-6 text-lg md:text-xl font-heading font-bold text-foreground animate-pulse">
      Loading magical moments
    </p>
    <div className="flex gap-2 mt-4">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-3 h-3 rounded-full bg-primary inline-block"
          style={{ animation: `pulse 1s ${i * 0.2}s infinite` }}
        />
      ))}
    </div>
    <div className="mt-8 w-48 h-2 rounded-full bg-muted overflow-hidden">
      <div className="h-full w-1/2 rounded-full loading-bar-shimmer" />
    </div>
  </div>
);

export default LoadingScreen;
