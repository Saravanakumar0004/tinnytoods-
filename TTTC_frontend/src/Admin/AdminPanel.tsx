import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  LogOut,
  Home,
  Brain,
  Users,
  Briefcase,
  Image,
  BookOpen,
  MapPin,
  Phone,
  Youtube,
  User,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { api } from "@/services/api/client";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { tokenStorage } from "@/lib/storage";
import { endpoints } from "@/services/api/endpoints";

/* ===== PAGE IMPORTS ===== */
import HomePage from "@/Admin/Pages/HomePage";
import Autism from "@/Admin/Pages/Autism";
import About from "@/Admin/Pages/About";
import Services from "@/Admin/Pages/Services";
import Gallery from "@/Admin/Pages/Gallery";
import Videos from "@/Admin/Pages/Videos";
import Book from "@/Admin/Pages/Book";
import Branches from "@/Admin/Pages/branches";
import Contact from "@/Admin/Pages/Contact";
import Question from "@/Admin/Pages/question";
import Profile from "@/Admin/Pages/profile";
import { routes } from "@/routes";

/* ===== TYPES ===== */
type PageKey =
  | "home"
  | "autism"
  | "about"
  | "services"
  | "gallery"
  | "videos"
  | "book"
  | "branches"
  | "contact"
  | "question"
  | "profile";

type AdminProfile = {
  full_name: string;
  is_active: boolean;
};

/* ===== NAV CONFIG ===== */
const NAV_ITEMS: { icon: React.ReactNode; label: string; key: PageKey }[] = [
  { icon: <Home />,      label: "Home",     key: "home" },
  { icon: <Briefcase />, label: "Services", key: "services" },
  { icon: <Brain />,     label: "Autism",   key: "autism" },
  { icon: <Users />,     label: "About",    key: "about" },
  { icon: <Image />,     label: "Gallery",  key: "gallery" },
  { icon: <Youtube />,   label: "Videos",   key: "videos" },
  { icon: <BookOpen />,  label: "Book",     key: "book" },
  { icon: <MapPin />,    label: "Branches", key: "branches" },
  { icon: <Phone />,     label: "Contact",  key: "contact" },
  { icon: <BookOpen />,  label: "Question", key: "question" },
];

/* ===== PAGE MAP ===== */
const PAGE_COMPONENTS: Record<PageKey, React.ReactNode> = {
  home:     <HomePage key="home-page" />,
  services: <Services />,
  autism:   <Autism />,
  about:    <About />,
  gallery:  <Gallery />,
  videos:   <Videos />,
  book:     <Book />,
  branches: <Branches />,
  contact:  <Contact />,
  question: <Question />,
  profile:  <Profile />,
};

export default function AdminPanel() {
  const [active, setActive]           = useState<PageKey>("home");
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [admin, setAdmin]             = useState<AdminProfile | null>(null);
  const [callCount, setCallCount]     = useState(0);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const navigate = useNavigate();

  /* ===== LOGOUT ===== */
  const handleLogout = useCallback(async () => {
    try {
      const access  = tokenStorage.getAccess();
      const refresh = tokenStorage.getRefresh();
      if (access && refresh) {
        await api.post(
          endpoints.admin.logout,
          { refresh },
          { headers: { Authorization: `Bearer ${access}` } }
        );
      }
    } catch {
      console.log("Logout API failed");
    } finally {
      tokenStorage.clear();
      navigate(routes.adminLogin, { replace: true });
    }
  }, [navigate]);

  /* ===== AUTH CHECK ===== */
  useEffect(() => {
    if (!tokenStorage.getAccess()) {
      navigate(routes.adminLogin, { replace: true });
    }
  }, [navigate]);

  /* ===== FETCH PROFILE ===== */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const access = tokenStorage.getAccess();
        if (!access) return;

        const res = await api.get(endpoints.admin.profile, {
          headers: { Authorization: `Bearer ${access}` },
        });

        setAdmin(res.data);
        setProfileLoaded(true);

        if (!res.data.is_active) {
          await handleLogout();
        }
      } catch (error: any) {
        console.error("Profile fetch error:", error);
        if (error.response?.status === 401) {
          await handleLogout();
        }
      }
    };

    fetchProfile();
  }, [handleLogout]);

  /* ===== INACTIVITY LOGOUT (15 min) ===== */
  useEffect(() => {
    if (!profileLoaded) return;

    let timer: ReturnType<typeof setTimeout>;

    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        console.log("User inactive. Logging out...");
        handleLogout();
      }, 15 * 60 * 1000);
    };

    const events = ["mousemove", "keydown", "click"] as const;
    events.forEach((e) => window.addEventListener(e, reset));
    reset();

    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [profileLoaded, handleLogout]);

  /* ===== CALL COUNT ===== */
  useEffect(() => {
    const fetchCallCount = async () => {
      try {
        const res = await api.get(endpoints.contact.call);
        setCallCount(res.data.call_count);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchCallCount();
  }, []);

  return (
    <>
      <Helmet>
        <title>Admin Panel | Tiny Todds Therapy Care</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-muted">
        {/* ===== SIDEBAR ===== */}
        <aside
          className={`
            fixed top-0 left-0 h-screen w-64 bg-background p-4 pb-10
            flex flex-col gap-2 shadow-lg overflow-y-auto z-50
            transform transition-transform duration-300
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0 md:w-[16.666667%]
          `}
        >
          <div className="flex justify-between items-center md:hidden">
            <img src={logo} alt="Logo" className="w-32" />
            <button onClick={() => setMobileOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <img src={logo} alt="Logo" className="w-40 mb-2 hidden md:block" />
          <b className="mb-4 text-lg">Admin Panel</b>

          <nav className="flex flex-col gap-1 flex-1">
            {NAV_ITEMS.map(({ icon, label, key }) => (
              <Side key={key} icon={icon} label={label} k={key} a={active} s={setActive} />
            ))}
          </nav>
        </aside>

        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* ===== HEADER ===== */}
        <header className="fixed top-0 right-0 left-0 md:left-[16.666667%] h-16 bg-background shadow flex items-center justify-between px-4 md:px-6 z-30">
          <button className="md:hidden" onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <div className="text-sm font-medium">
              Total Calls: {callCount}
            </div>

            {/* PROFILE SECTION */}
            <div
              className="flex items-center gap-3 cursor-pointer relative"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <div className="flex items-center gap-3 bg-muted px-3 py-2 rounded-lg hover:bg-muted/70 transition">
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>

                <div className="text-left leading-tight">
                  <div className="text-sm font-semibold">
                    {admin?.full_name ?? "Loading..."}
                  </div>
                  <div className={`text-xs ${admin?.is_active ? "text-green-500" : "text-red-500"}`}>
                    {admin?.is_active ? "Active" : "Inactive"}
                  </div>
                </div>

                <ChevronDown className="w-4 h-4" />
              </div>

              {profileOpen && (
                <div className="absolute right-0 top-14 w-48 bg-background border rounded-lg shadow-lg p-2 space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => { setActive("profile"); setProfileOpen(false); }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>

                  <Button
                    variant="destructive"
                    className="w-full justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ===== CONTENT ===== */}
        <main className="pt-20 p-4 md:p-6 md:ml-[16.666667%]">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {PAGE_COMPONENTS[active]}
          </motion.div>
        </main>
      </div>
    </>
  );
}

/* ===== SIDEBAR BUTTON ===== */
function Side({
  icon,
  label,
  k,
  a,
  s,
}: {
  icon: React.ReactNode;
  label: string;
  k: PageKey;
  a: PageKey;
  s: (v: PageKey) => void;
}) {
  return (
    <Button
      variant={a === k ? "default" : "ghost"}
      className="justify-start"
      onClick={() => s(k)}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </Button>
  );
}