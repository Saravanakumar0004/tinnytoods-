import Header from "@/components/Header";
import AppointmentBooking from "@/components/AppointmentBooking";
import Footer from "@/components/Footer";
import RocketScrollToTop from "@/components/RocketScrollToTop";
import WhatsAppButton from "@/components/WhatsAppButton";
import ParticleBackground from "@/components/ParticleBackground";
import WaterWaveEffect from "@/components/WaterWaveEffect";
import SEO from "@/component/Seo";
const BASE_URL = import.meta.env.BASE_URL;
const AppointmentBookingPage = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden relative">
      <SEO
        title="Appointment Booking | Tiny Todds Therapy Care"
        description="Book an appointment with our experienced team at Tiny Todds Therapy Care. Schedule a consultation to discuss your child's therapy needs."
        canonical={`${BASE_URL}/booking`}
      />      
      <WaterWaveEffect />
      <ParticleBackground />
      <Header />

      <div className="pt-[120px] md:pt-[130px]">
        <AppointmentBooking />
      </div>

      <Footer />
      <RocketScrollToTop />
      <WhatsAppButton />
    </main>
  );
};

export default AppointmentBookingPage;