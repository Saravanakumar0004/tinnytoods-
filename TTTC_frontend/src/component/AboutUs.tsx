import Header from "@/components/Header";
import AboutUs from "@/components/AboutUs";
import Footer from "@/components/Footer";
import RocketScrollToTop from "@/components/RocketScrollToTop";
import WhatsAppButton from "@/components/WhatsAppButton";
import ParticleBackground from "@/components/ParticleBackground";
import WaterWaveEffect from "@/components/WaterWaveEffect";
import SEO from "@/component/Seo";
import Stats from "@/components/Stats";
import TherapyTimeline from "@/components/TherapyTimeline";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import Testimonials from "@/components/Testimonials";
import Analytics from "@/components/Analytics";
const BASE_URL = import.meta.env.BASE_URL;

const AboutUsPage = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden relative">
      <SEO
        title="About Us | Tiny Todds Therapy Care"
        description="Learn about Tiny Todds Therapy Care, our experienced team, child-focused therapy approach, and commitment to helping children with autism grow with confidence."
        canonical={`${BASE_URL}/about-us`}
      />

      <WaterWaveEffect />
      <ParticleBackground />
      <Header />

      <div className="pt-[120px] md:pt-[130px]">
        <AboutUs />
        <Stats />
        <TherapyTimeline />
        <BeforeAfterSlider />
        <Testimonials />
        <Analytics />
      </div>

      <Footer />
      <RocketScrollToTop />
      <WhatsAppButton />
    </main>
  );
};

export default AboutUsPage;