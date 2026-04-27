// ParticleBackground — DISABLED for performance
// The original ran 15 simultaneous Framer Motion animations fixed to the viewport,
// each with opacity + y + rotate keyframes repeating infinitely.
// This caused constant compositor work and raised TBT significantly.
// A CSS-only equivalent (subtle floating shapes) is added via App.css instead.
const ParticleBackground = () => null;
export default ParticleBackground;
