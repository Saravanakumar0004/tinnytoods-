import Header from "@/components/Header";
import AboutAutism from "@/components/AboutAutism";
import Footer from "@/components/Footer";
import RocketScrollToTop from "@/components/RocketScrollToTop";
import WhatsAppButton from "@/components/WhatsAppButton";
import ParticleBackground from "@/components/ParticleBackground";
import WaterWaveEffect from "@/components/WaterWaveEffect";
import SEO from "@/component/Seo";
const BASE_URL = import.meta.env.BASE_URL;

const AboutAutismPage = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden relative">
      <SEO
        title="About Autism | Tiny Todds Therapy Care"
        description="Understand autism, early signs, intervention importance, and how Tiny Todds Therapy Care supports children through personalized therapy in Chennai."
        canonical={`${BASE_URL}/about-autism`}
      />

      <WaterWaveEffect />
      <ParticleBackground />
      <Header />

      <div className="pt-[120px] md:pt-[130px]">
        <AboutAutism />
      </div>

      <Footer />
      <RocketScrollToTop />
      <WhatsAppButton />
    </main>
  );
};

export default AboutAutismPage;