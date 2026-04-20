import Header from "@/components/Header";
import AutismQuiz from "@/components/AutismQuiz";
import Footer from "@/components/Footer";
import RocketScrollToTop from "@/components/RocketScrollToTop";
import WhatsAppButton from "@/components/WhatsAppButton";
import ParticleBackground from "@/components/ParticleBackground";
import WaterWaveEffect from "@/components/WaterWaveEffect";
import SEO from "@/component/Seo";
const BASE_URL = import.meta.env.BASE_URL;

const AutismQuizPage = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden relative">
      <SEO
        title="Autism Quiz | Tiny Todds Therapy Care"
        description="Take our autism quiz to learn more about autism spectrum disorder and how Tiny Todds Therapy Care can help your child."
        canonical={`${BASE_URL}/quiz`}
      />
      <WaterWaveEffect />
      <ParticleBackground />
      <Header />

      <div className="pt-[120px] md:pt-[130px]">
        <AutismQuiz />
      </div>

      <Footer />
      <RocketScrollToTop />
      <WhatsAppButton />
    </main>
  );
};

export default AutismQuizPage;