// WaterWaveEffect — DISABLED for performance
// The original added a mousemove listener firing every 150ms, updating React state
// to create ripple divs (each rendered as an AnimatePresence child).
// On desktop with active mouse movement this caused 6+ state updates/second + repaints.
// Removed entirely. Zero visual regression on mobile (it was already skipped there).
const WaterWaveEffect = () => null;
export default WaterWaveEffect;
