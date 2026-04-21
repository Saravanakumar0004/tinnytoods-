// src/component/Viedos.tsx
import Header from "@/components/Header";
import YouTubeSection from "@/components/YouTubeSection";
import Footer from "@/components/Footer";
import RocketScrollToTop from "@/components/RocketScrollToTop";
import WhatsAppButton from "@/components/WhatsAppButton";
import ParticleBackground from "@/components/ParticleBackground";
import WaterWaveEffect from "@/components/WaterWaveEffect";
import SEO from "@/component/Seo";

const VideosPage = () => {
  return (
    <>
      {/* ✅ SEO outside <main> so Helmet injects into <head> */}
      <SEO
        title="Autism Therapy Videos | Tiny Todds Therapy Care Chennai"
        description="Watch Speech Therapy, Occupational Therapy, Behavioral Therapy guidance videos and autism awareness content from Tiny Todds Therapy Care, Chennai."
        // ✅ FIXED: use absolute URL, not BASE_URL which gives wrong path in production
        canonical="https://tinytoddstherapycare.com/videos"
        url="https://tinytoddstherapycare.com/videos"
      />

      <main className="min-h-screen bg-background overflow-x-hidden relative">
        <WaterWaveEffect />
        <ParticleBackground />
        <Header />

        <div className="pt-[120px] md:pt-[130px]">
          <YouTubeSection />
        </div>

        <Footer />
        <RocketScrollToTop />
        <WhatsAppButton />
      </main>
    </>
  );
};

export default VideosPage;