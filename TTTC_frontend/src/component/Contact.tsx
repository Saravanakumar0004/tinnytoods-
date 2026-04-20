import Header from "@/components/Header";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import RocketScrollToTop from "@/components/RocketScrollToTop";
import WhatsAppButton from "@/components/WhatsAppButton";
import ParticleBackground from "@/components/ParticleBackground";
import WaterWaveEffect from "@/components/WaterWaveEffect";
import SEO from "@/component/Seo";
const BASE_URL = import.meta.env.BASE_URL;

const ContactPage = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden relative">
      <SEO
        title="Contact Tiny Todds Therapy Care | Chennai"
        description="Contact Tiny Todds Therapy Care in Chennai for autism therapy, speech therapy, occupational therapy, consultation booking, and parent support."
        canonical={`${BASE_URL}/contact`}
      />

      <WaterWaveEffect />
      <ParticleBackground />
      <Header />

      <div className="pt-[120px] md:pt-[130px]">
        <Contact />
      </div>

      <Footer />
      <RocketScrollToTop />
      <WhatsAppButton />
    </main>
  );
};

export default ContactPage;