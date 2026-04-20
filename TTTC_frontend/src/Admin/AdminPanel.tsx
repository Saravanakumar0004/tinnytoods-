import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

export default function AdminPanel() {
  const [active, setActive] = useState<PageKey>("home");
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [callCount, setCallCount] = useState(0);

  const navigate = useNavigate();

  /* ===== AUTH CHECK ===== */
  useEffect(() => {
    const access = tokenStorage.getAccess();
    if (!access) {
      navigate(routes.adminLogin, { replace: true });
    }
  }, [navigate]);

  /* ===== FETCH PROFILE ===== */
  const [profileLoaded, setProfileLoaded] = useState(false);
useEffect(() => {
  const fetchProfile = async () => {
    try {
      const access = tokenStorage.getAccess();
      if (!access) return;

      const res = await api.get(endpoints.admin.profile, {
        headers: { Authorization: `Bearer ${access}` },
      });

      setAdmin(res.data);
      setProfileLoaded(true); // ✅ mark profile ready

      if (!res.data.is_active) {
        await handleLogout();
      }

    } catch (error: any) {
      console.error("Profile fetch error:", error);

      if (error.response?.status === 401) {
        // Only logout if truly unauthorized
        await handleLogout();
      } else {
        console.log("Profile failed but staying logged in");
      }
    }
  };

  fetchProfile();
}, []);


useEffect(() => {
  if (!profileLoaded) return; // ⛔ wait until profile ready

  let timer: NodeJS.Timeout;

  const logoutByTimeout = async () => {
    console.log("User inactive. Logging out...");
    await handleLogout();
  };

  const resetTimer = () => {
    clearTimeout(timer);
    timer = setTimeout(logoutByTimeout, 15 * 60 * 1000); 
  };

  window.addEventListener("mousemove", resetTimer);
  window.addEventListener("keydown", resetTimer);
  window.addEventListener("click", resetTimer);

  resetTimer(); // start timer

  return () => {
    clearTimeout(timer);
    window.removeEventListener("mousemove", resetTimer);
    window.removeEventListener("keydown", resetTimer);
    window.removeEventListener("click", resetTimer);
  };
}, [profileLoaded]); // ✅ depends on profileLoaded
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

  /* ===== LOGOUT ===== */
  const handleLogout = async () => {
    try {
      const access = tokenStorage.getAccess();
      const refresh = tokenStorage.getRefresh();

      if (access && refresh) {
        await api.post(
          endpoints.admin.logout,
          { refresh },
          { headers: { Authorization: `Bearer ${access}` } }
        );
      }
    } catch (error) {
      console.log("Logout API failed");
    } finally {
      tokenStorage.clear();
      navigate(routes.adminLogin, { replace: true });
    }
  };

  const pages: Record<PageKey, React.ReactNode> = {
    home: <HomePage key="home-page"/>,
    services: <Services />,
    autism: <Autism />,
    about: <About />,
    gallery: <Gallery />,
    videos: <Videos />,
    book: <Book />,
    branches: <Branches />,
    contact: <Contact />,
    question: <Question />,
    profile: <Profile />,
  };
  return (
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

        <img
          src={logo}
          alt="Logo"
          className="w-40 mb-2 hidden md:block"
        />

        <b className="mb-4 text-lg">Admin Panel</b>

        <nav className="flex flex-col gap-1 flex-1">
          <Side icon={<Home />} label="Home" k="home" a={active} s={setActive} />
          <Side icon={<Briefcase />} label="Services" k="services" a={active} s={setActive} />
          <Side icon={<Brain />} label="Autism" k="autism" a={active} s={setActive} />
          <Side icon={<Users />} label="About" k="about" a={active} s={setActive} />
          <Side icon={<Image />} label="Gallery" k="gallery" a={active} s={setActive} />
          <Side icon={<Youtube />} label="Videos" k="videos" a={active} s={setActive} />
          <Side icon={<BookOpen />} label="Book" k="book" a={active} s={setActive} />
          <Side icon={<MapPin />} label="Branches" k="branches" a={active} s={setActive} />
          <Side icon={<Phone />} label="Contact" k="contact" a={active} s={setActive} />
          <Side icon={<BookOpen />} label="Question" k="question" a={active} s={setActive} />
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
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(true)}
        >
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

              {/* ✅ MOBILE + DESKTOP VISIBLE */}
              <div className="text-left leading-tight">
                <div className="text-sm font-semibold">
                  {admin?.full_name || "Loading..."}
                </div>
                <div
                  className={`text-xs ${
                    admin?.is_active
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
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
                  onClick={() => {
                    setActive("profile");
                    setProfileOpen(false);
                  }}
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
          {pages[active]}
        </motion.div>
      </main>
    </div>
  );
}

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