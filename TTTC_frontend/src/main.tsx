import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// ✅ FIX: Removed HelmetProvider from here — it already exists inside App.tsx
// Double-wrapping with two HelmetProviders causes <Helmet> / <SEO> tags to be ignored
createRoot(document.getElementById("root")!).render(<App />);