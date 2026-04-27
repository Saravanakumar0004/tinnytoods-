// src/pages/Index.tsx  — Performance-optimized version
import { useState, useEffect, lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SEO from "@/component/Seo";
import LocalBusinessSchema from "@/component/LocalBussinessSchema";

// Lazy-load every below-the-fold component
const AboutAutism     = lazy(() => import("@/components/AboutAutism"));
const AboutUs         = lazy(() => import("@/components/AboutUs"));
const Stats           = lazy(() => import("@/components/Stats"));
const Analytics       = lazy(() => import("@/components/Analytics"));
const TherapyTimeline = lazy(() => import("@/components/TherapyTimeline"));
const FAQ             = lazy(() => import("@/components/FAQ"));
const Contact         = lazy(() => import("@/components/Contact"));
const Footer          = lazy(() => import("@/components/Footer"));
const RocketScrollToTop = lazy(() => import("@/components/RocketScrollToTop"));
const WhatsAppButton  = lazy(() => import("@/components/WhatsAppButton"));
const Banner          = lazy(() => import("@/components/Banner"));
const LoadingScreen   = lazy(() => import("@/components/LoadingScreen"));

// ParticleBackground & WaterWaveEffect removed:
// - ParticleBackground: 15 infinite framer-motion loops fixed to viewport → constant repaints
// - WaterWaveEffect: mousemove listener creating state updates every 150ms → layout thrash

const LOADED_KEY = "tiny_todds_loaded";

const Index = () => {
  const [isLoading, setIsLoading] = useState(
    () => !sessionStorage.getItem(LOADED_KEY)
  );

  useEffect(() => {
    if (!isLoading) return;
    // Reduced 2500ms → 1200ms so LCP is not blocked by artificial wait
    const timer = setTimeout(() => {
      sessionStorage.setItem(LOADED_KEY, "1");
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <>
      <SEO
        title="Tiny Todds Therapy Care | Autism & Child Therapy Center in Chennai"
        description="Tiny Todds Therapy Care offers Speech Therapy, Occupational Therapy, Behavioral Therapy, Early Intervention, Special Education & Parent Training in Chennai."
        path="/"
      />
      <LocalBusinessSchema />

      <Suspense fallback={null}>
        <AnimatePresence mode="wait">
          {isLoading && <LoadingScreen key="loading" />}
        </AnimatePresence>
      </Suspense>

      <main className="min-h-screen bg-background overflow-x-hidden relative">
        <Header />
        <Suspense fallback={null}><Banner /></Suspense>
        <Hero />
        <Suspense fallback={null}>
          <AboutAutism />
          <AboutUs />
          <Stats />
          <Analytics />
          <TherapyTimeline />
          <FAQ />
          <Contact />
          <Footer />
          <RocketScrollToTop />
          <WhatsAppButton />
        </Suspense>
      </main>
    </>
  );
};

export default Index;
