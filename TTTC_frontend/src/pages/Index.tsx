// src/pages/Index.tsx
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutAutism from "@/components/AboutAutism";
import AboutUs from "@/components/AboutUs";
import Stats from "@/components/Stats";
import TherapyTimeline from "@/components/TherapyTimeline";
import Analytics from "@/components/Analytics";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import RocketScrollToTop from "@/components/RocketScrollToTop";
import WhatsAppButton from "@/components/WhatsAppButton";
import ParticleBackground from "@/components/ParticleBackground";
import LoadingScreen from "@/components/LoadingScreen";
import WaterWaveEffect from "@/components/WaterWaveEffect";
import Banner from "@/components/Banner";
import SEO from "@/component/Seo";
import LocalBusinessSchema from "@/component/LocalBussinessSchema";

const LOADED_KEY = "tiny_todds_loaded";

const Index = () => {
  const [isLoading, setIsLoading] = useState(
    () => !sessionStorage.getItem(LOADED_KEY)
  );

  useEffect(() => {
    if (!isLoading) return;

    const timer = setTimeout(() => {
      sessionStorage.setItem(LOADED_KEY, "1");
      setIsLoading(false);
    }, 2500);

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

      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loading" />}
      </AnimatePresence>

      <main className="min-h-screen bg-background overflow-x-hidden relative">
        <WaterWaveEffect />
        <ParticleBackground />
        <Header />
        <Banner />
        <Hero />
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
      </main>
    </>
  );
};

export default Index;