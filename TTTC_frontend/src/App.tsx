import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// Eagerly load the home page (critical path)
import Index from "./pages/Index";

// Lazy-load all other routes — they are never needed on initial paint
const NotFound            = lazy(() => import("./pages/NotFound"));
const AdminPanel          = lazy(() => import("@/Admin/AdminPanel"));
const AdminLogin          = lazy(() => import("./Admin/AdminLogin"));
const AboutAutismPage     = lazy(() => import("./component/AboutAutism"));
const AboutUsPage         = lazy(() => import("./component/AboutUs"));
const AppointmentBooking  = lazy(() => import("./component/AppointmentBooking"));
const ServicesPage        = lazy(() => import("./component/Services"));
const VideosPage          = lazy(() => import("./component/Viedos"));
const GalleryPage         = lazy(() => import("./component/Gallery"));
const BranchesPage        = lazy(() => import("./component/Branches"));
const AutismQuizPage      = lazy(() => import("./component/AutismQuiz"));
const ContactPage         = lazy(() => import("./component/Contact"));

// Configure QueryClient with sensible caching defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 min — avoids re-fetching on every mount
      gcTime:    10 * 60 * 1000,  // 10 min cache
      retry: 1,
    },
  },
});

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Suspense fallback={null}>
            <Routes>
              <Route path="/"             element={<Index />} />
              <Route path="/about-us"     element={<AboutUsPage />} />
              <Route path="/about-autism" element={<AboutAutismPage />} />
              <Route path="/services"     element={<ServicesPage />} />
              <Route path="/quiz"         element={<AutismQuizPage />} />
              <Route path="/branches"     element={<BranchesPage />} />
              <Route path="/gallery"      element={<GalleryPage />} />
              <Route path="/videos"       element={<VideosPage />} />
              <Route path="/booking"      element={<AppointmentBooking />} />
              <Route path="/contact"      element={<ContactPage />} />
              <Route path="/admin/login"  element={<AdminLogin />} />
              <Route path="/admin"        element={<AdminPanel />} />
              <Route path="*"             element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
