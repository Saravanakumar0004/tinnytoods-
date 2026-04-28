import { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Phone, Mail, Clock, Home, Brain, Users, Stethoscope,
  MapPin, MessageCircle, Youtube, BarChart3, Images, ClipboardCheck, MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useAbout } from "@/hooks/usePhone";
import { formatPhoneForDisplay, formatPhoneForTel } from "@/utils/phone";
import { useCallCount } from "@/services/modules/callcount";
import { getVisitorCount, incrementVisitorCount } from "@/services/modules/visitors.api";

type NavItem = {
  name: string;
  href: string;
  icon: any;
  type: "scroll" | "route";
};

const navLinks: NavItem[] = [
  { name: "Home",     href: "/",             icon: Home,          type: "route" },
  { name: "Quiz",     href: "/quiz",          icon: ClipboardCheck, type: "route" },
  { name: "Services", href: "/services",      icon: Stethoscope,   type: "route" },
  { name: "Autism",   href: "/about-autism",  icon: Brain,         type: "route" },
  { name: "About",    href: "/about-us",      icon: Users,         type: "route" },
  { name: "Gallery",  href: "/gallery",       icon: Images,        type: "route" },
  { name: "Videos",   href: "/videos",        icon: Youtube,       type: "route" },
  { name: "Book",     href: "/booking",       icon: BarChart3,     type: "route" },
  { name: "Branches", href: "/branches",      icon: MapPin,        type: "route" },
  { name: "Contact",  href: "/contact",       icon: MessageCircle, type: "route" },
  { name: "TTTC",     href: "/tttc_profile",  icon: Home,          type: "route" },
];

// ✅ Defined outside component — stable reference, no re-creation
const DESKTOP_HIDDEN = new Set(["Gallery", "Videos", "Book", "Contact"]);

const Header = memo(() => {
  const [isMenuOpen, setIsMenuOpen]   = useState(false);
  const [isScrolled, setIsScrolled]   = useState(false);
  const [visitors, setVisitors]       = useState<number | null>(null);

  const { about }            = useAbout();
  const { increaseCallCount } = useCallCount();

  const fallbackphone = "9941350646";
  const phoneRaw  = about?.phone_no_one ?? fallbackphone;
  const phoneHref = formatPhoneForTel(phoneRaw)      ?? `tel:+91${fallbackphone}`;
  const phoneText = formatPhoneForDisplay(phoneRaw)  ?? `+91${fallbackphone}`;

  // ✅ rAF-throttled scroll listener — not firing on every pixel
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 50);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape key closes menu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Visitor count — runs once on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const key     = "visited_once";
        const already = localStorage.getItem(key);
        const count   = already ? await getVisitorCount() : await incrementVisitorCount();
        if (!cancelled) {
          setVisitors(count);
          if (!already) localStorage.setItem(key, "1");
        }
      } catch (err) {
        console.error("Visitors count error:", err);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleCallClick = useCallback(
    async (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      try { await increaseCallCount(); } catch (err) { console.error(err); }
      window.location.href = phoneHref;
    },
    [increaseCallCount, phoneHref]
  );

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  // ✅ useCallback — stable across renders
  const renderNavItem = useCallback(
    (link: NavItem, isMobile = false) => (
      <Link
        key={link.name}
        to={link.href}
        onClick={closeMenu}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-secondary transition-all ${
          isMobile ? "text-sm text-muted-foreground" : ""
        }`}
      >
        <link.icon className="w-4 h-4" />
        {link.name}
      </Link>
    ),
    [closeMenu]
  );

  return (
    <>
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-primary text-primary-foreground px-4 py-2">
          <div className="container mx-auto flex items-center justify-between gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs md:text-sm">
              <Clock className="w-4 h-4" />
              <span>9:30 AM - 8:00 PM, Mon - Sat</span>
            </div>
            <div className="flex sm:hidden items-center gap-2 text-xs">
              <Clock className="w-4 h-4" />
              <span>9:30 AM - 8:00 PM</span>
            </div>
            <div className="flex items-center gap-4">
              <a href={phoneHref} onClick={handleCallClick}
                className="flex items-center pr-3 gap-2 text-xs md:text-sm hover:opacity-80 transition-opacity">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">{phoneText}</span>
                <span className="sm:hidden">Call Now</span>
              </a>
              <a href="mailto:tinytoddstherapycare@gmail.com"
                className="hidden md:flex items-center gap-2 text-xs md:text-sm hover:opacity-80 transition-opacity">
                <Mail className="w-4 h-4" />
                <span className="hidden lg:inline">tinytoddstherapycare@gmail.com</span>
                <span className="lg:hidden">Email</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className={`fixed top-[32px] md:top-[34px] left-0 right-0 z-50 bg-card/100 backdrop-blur-md transition-shadow duration-200 ${
        isScrolled ? "shadow-md" : "shadow-soft"
      }`}>
        <div className="container mx-auto px-4 py-3 relative">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center transition-transform hover:scale-[1.02]">
              <img src={logo} alt="Tiny Todds Therapy Care"
                className="h-12 md:h-14 w-auto object-contain"
                width={56} height={56} // ✅ prevents layout shift
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden xl:flex items-center gap-3">
              {navLinks
                .filter((l) => !DESKTOP_HIDDEN.has(l.name))
                .map((link) => renderNavItem(link, false))}

              {/* Media dropdown */}
              <div className="relative group">
                <button type="button"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-secondary transition-all">
                  <Images className="w-4 h-4" />Media
                </button>
                <div className="absolute top-full left-0 mt-2 w-44 bg-white shadow-lg rounded-xl
                  opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <Link to="/gallery" className="flex items-center gap-2 px-4 py-3 hover:bg-secondary rounded-t-xl">
                    <Images className="w-4 h-4" />Gallery
                  </Link>
                  <Link to="/videos" className="flex items-center gap-2 px-4 py-3 hover:bg-secondary rounded-b-xl">
                    <Youtube className="w-4 h-4" />Videos
                  </Link>
                </div>
              </div>

              {/* Enquiry dropdown */}
              <div className="relative group">
                <button type="button"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-secondary transition-all">
                  <MessageSquare className="w-4 h-4" />Enquiry
                </button>
                <div className="absolute top-full left-0 mt-2 w-52 bg-white shadow-lg rounded-xl
                  opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <Link to="/contact" className="flex items-center gap-2 px-4 py-3 hover:bg-secondary rounded-t-xl">
                    <MessageCircle className="w-4 h-4" />Contact Form
                  </Link>
                  <Link to="/booking" className="flex items-center gap-2 px-4 py-3 hover:bg-secondary rounded-b-xl">
                    <BarChart3 className="w-4 h-4" />Book Appointment
                  </Link>
                </div>
              </div>
            </nav>

            {/* CTA */}
            <div className="hidden md:block">
              <Button variant="playful" size="lg" asChild>
                <a href={phoneHref} onClick={handleCallClick}>
                  <Phone className="w-4 h-4 mr-2" />Call Now
                </a>
              </Button>
            </div>

            {/* Hamburger */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen((o) => !o)}
              className="xl:hidden p-2 rounded-xl bg-secondary text-secondary-foreground"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <motion.div animate={{ rotate: isMenuOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.div>
            </motion.button>
          </div>

          {/* Visitor badge */}
          <div className="fixed top-[23px] right-[58px] sm:top-[30px] sm:right-[30px] md:top-[24px] md:right-[65px]
            lg:top-[25px] lg:right-[15px] xl:top-[70px] xl:right-[16px]
            min-[1500px]:right-[calc((100vw-1536px)/2+50px)] 2xl:right-[calc((100vw-1536px)/2+80px)]
            z-[23] flex items-center">
            <div className="relative bg-success text-white text-[11px] md:text-xs font-semibold px-2 py-1 md:px-3 md:py-2 rounded-l-full shadow">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 md:w-4 md:h-4" />Visitors
              </span>
              <div className="absolute right-[-7px] md:right-[-11px] top-1/2 -translate-y-1/2 w-0 h-0
                border-t-[7px] md:border-t-[10px] border-t-transparent
                border-b-[7px] md:border-b-[10px] border-b-transparent
                border-l-[7px] md:border-l-[10px] border-success" />
            </div>
            <div className="bg-white/90 backdrop-blur-md border border-success/80 shadow-lg rounded-r-full px-2 py-[0px] md:px-4 md:py-[3px]">
              <span className="text-[14px] md:text-sm font-bold text-success">{visitors ?? "--"}</span>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={closeMenu}
                className="fixed inset-0 bg-foreground/20 backdrop-blur-sm xl:hidden z-40"
              />
              <motion.div
                initial={{ opacity: 0, x: "100%" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed top-0 right-0 h-[90dvh] w-[280px] bg-card shadow-float xl:hidden z-50 flex flex-col overflow-y-auto"
              >
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <img src={logo} alt="Tiny Todds" className="h-10 w-auto" />
                  <motion.button whileTap={{ scale: 0.9 }} onClick={closeMenu}
                    className="p-2 rounded-xl bg-secondary text-secondary-foreground">
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                <nav className="p-4 flex flex-col gap-1 bg-white min-h-max">
                  {navLinks.map((link) => renderNavItem(link, true))}

                  <div className="mt-4 pt-4 border-t border-border space-y-3">
                    <a href={phoneHref} onClick={handleCallClick}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4 text-primary" />{phoneText}
                    </a>
                    <a href="mailto:tinytoddstherapycare@gmail.com"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground break-all">
                      <Mail className="w-4 h-4 text-primary" />tinytoddstherapycare@gmail.com
                    </a>
                  </div>

                  <Button variant="playful" className="mt-4 w-full" asChild>
                    <a href={phoneHref} onClick={handleCallClick}>
                      <Phone className="w-4 h-4 mr-2" />Call Now
                    </a>
                  </Button>
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  );
});

Header.displayName = "Header";
export default Header;