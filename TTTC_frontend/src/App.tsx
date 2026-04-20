import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminPanel from "@/Admin/AdminPanel";
import AdminLogin from "./Admin/AdminLogin";
import AboutAutism from "./component/AboutAutism";
import AboutUs from "./component/AboutUs";
import AppointmentBookingPage from "./component/AppointmentBooking";
import ServicesPage from "./component/Services";
import VideosPage from "./component/Viedos";
import GalleryPage from "./component/Gallery";
import BranchesPage from "./component/Branches";
import AutismQuizPage from "./component/AutismQuiz";
import ContactPage from "./component/Contact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/about-autism" element={<AboutAutism />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/quiz" element={<AutismQuizPage />} />
        <Route path="/branches" element={<BranchesPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/booking" element={<AppointmentBookingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
