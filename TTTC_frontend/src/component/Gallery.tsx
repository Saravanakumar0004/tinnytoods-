// src/component/Gallery.tsx
import Header from "@/components/Header";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
import RocketScrollToTop from "@/components/RocketScrollToTop";
import WhatsAppButton from "@/components/WhatsAppButton";
import ParticleBackground from "@/components/ParticleBackground";
import WaterWaveEffect from "@/components/WaterWaveEffect";
import SEO from "@/component/Seo";

const GalleryPage = () => {
  return (
    <>
      {/* SEO outside <main> so Helmet injects into <head> correctly */}
      <SEO
        title="Photo Gallery | Tiny Todds Therapy Care Chennai"
        description="Explore photos of our therapy sessions, facilities, activities, and joyful moments at Tiny Todds Therapy Care in Chennai."
        keywords="autism therapy photos Chennai, therapy center gallery, child therapy activities Chennai"
        path="/gallery"
      />

      <main className="min-h-screen bg-background overflow-x-hidden relative">
        <WaterWaveEffect />
        <ParticleBackground />
        <Header />
        <div className="pt-[120px] md:pt-[130px]">
          <Gallery />
        </div>
        <Footer />
        <RocketScrollToTop />
        <WhatsAppButton />
      </main>
    </>
  );
};

export default GalleryPage;