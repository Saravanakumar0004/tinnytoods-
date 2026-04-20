import Header from "@/components/Header";
import YouTubeSection from "@/components/YouTubeSection";
import Footer from "@/components/Footer";
import RocketScrollToTop from "@/components/RocketScrollToTop";
import WhatsAppButton from "@/components/WhatsAppButton";
import ParticleBackground from "@/components/ParticleBackground";
import WaterWaveEffect from "@/components/WaterWaveEffect";
import SEO from "@/component/Seo";
const BASE_URL = import.meta.env.BASE_URL;

const VideosPage = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden relative">
      <SEO
        title="Autism Therapy Videos | Tiny Todds Therapy Care"
        description="Watch autism awareness videos, therapy guidance, child development content, and educational resources from Tiny Todds Therapy Care."
        canonical={`${BASE_URL}/videos`}
      />

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
  );
};

export default VideosPage;