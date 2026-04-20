import Header from "@/components/Header";
import Branches from "@/components/Branches";
import Footer from "@/components/Footer";
import RocketScrollToTop from "@/components/RocketScrollToTop";
import WhatsAppButton from "@/components/WhatsAppButton";
import ParticleBackground from "@/components/ParticleBackground";
import WaterWaveEffect from "@/components/WaterWaveEffect";
import SEO from "@/component/Seo";

const BASE_URL = import.meta.env.BASE_URL;

const BranchesPage = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden relative">
      <SEO
        title="Branches | Tiny Todds Therapy Care"
        description="Discover our branches and the services we offer at Tiny Todds Therapy Care. Find the nearest location to access quality therapy for your child."
        canonical={`${BASE_URL}/branches`}
      />
      <WaterWaveEffect />
      <ParticleBackground />
      <Header />

      <div className="pt-[120px] md:pt-[130px]">
        <Branches />
      </div>

      <Footer />
      <RocketScrollToTop />
      <WhatsAppButton />
    </main>
  );
};

export default BranchesPage;