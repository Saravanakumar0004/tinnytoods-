import Header from "@/components/Header";
import Services from "@/components/Services";
import Footer from "@/components/Footer";
import RocketScrollToTop from "@/components/RocketScrollToTop";
import WhatsAppButton from "@/components/WhatsAppButton";
import ParticleBackground from "@/components/ParticleBackground";
import WaterWaveEffect from "@/components/WaterWaveEffect";
import SEO from "@/component/Seo";

const BASE_URL = import.meta.env.BASE_URL;

const ServicesPage = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden relative">
      <SEO
        title="Therapy Services in Chennai | Tiny Todds Therapy Care"
        description="Explore speech therapy, occupational therapy, behavioral therapy, special education, and early intervention services for children at Tiny Todds Therapy Care."
        canonical={`${BASE_URL}/services`}
      />

      <WaterWaveEffect />
      <ParticleBackground />
      <Header />

      <div className="pt-[120px] md:pt-[130px]">
        <Services />
      </div>

      <Footer />
      <RocketScrollToTop />
      <WhatsAppButton />
    </main>
  );
};

export default ServicesPage;