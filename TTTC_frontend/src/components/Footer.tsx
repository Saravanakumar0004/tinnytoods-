import { Phone, Mail, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAbout } from "@/hooks/usePhone";
import { formatPhoneForDisplay, formatPhoneForTel } from "@/utils/phone";
import { useCallCount } from "@/services/modules/callcount";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/quiz", label: "Quiz" },
  { to: "/services", label: "Services" },
  { to: "/about-autism", label: "About Autism" },
  { to: "/about-us", label: "About Us" },
  { to: "/gallery", label: "Gallery" },
  { to: "/videos", label: "Videos" },
  { to: "/booking", label: "Book Appointment" },
  { to: "/branches", label: "Branches" },
  { to: "/contact", label: "Contact" },
];

const Footer = () => {
  const { about } = useAbout();
  const { increaseCallCount } = useCallCount();

  const fallback = "9941350646";

  const phoneRaw = about?.phone_no_one ?? fallback;
  const phoneHref = formatPhoneForTel(phoneRaw) ?? `tel:+91${fallback}`;
  const phoneText = formatPhoneForDisplay(phoneRaw) ?? `+91 ${fallback}`;

  const phoneRaw2 = about?.phone_no_two ?? fallback;
  const phoneHref2 = formatPhoneForTel(phoneRaw2) ?? `tel:+91${fallback}`;
  const phoneText2 = formatPhoneForDisplay(phoneRaw2) ?? `+91 ${fallback}`;

  const handleCallClick = async (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    try { await increaseCallCount(); } catch (err) { console.error(err); }
    window.location.href = href;
  };

  return (
    <footer className="bg-foreground text-background">
      
      <div className="w-full leading-none">
        <svg viewBox="0 0 1440 32" fill="none" className="w-full block">
          <path
            d="M0 32L1440 32L1440 16C1200 0 960 32 720 16C480 0 240 32 0 16L0 32Z"
            className="fill-foreground"
          />
        </svg>
      </div>

      <div className="container mx-auto px-6 pt-6 pb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-5">

          
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <img src={logo} alt="Tiny Todds" className="h-10 w-auto rounded-sm" />
              <div>
                <p className="font-heading font-bold text-sm text-background leading-tight">Tiny Todds</p>
                <p className="text-[10px] text-background/50">Therapy Care</p>
              </div>
            </div>
            <p className="text-background/60 text-xs leading-relaxed">
              Helping children with autism reach their full potential through early intervention.
            </p>
          </div>

         
          <div>
            <h4 className="font-heading font-semibold text-xs text-background/80 uppercase tracking-wide mb-3">
              Quick Links
            </h4>
            <ul className="space-y-1.5">
              {LINKS.slice(0, 5).map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-background/60 hover:text-primary transition-colors text-xs">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-[1.35rem]"> 
            <ul className="space-y-1.5">
              {LINKS.slice(5).map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-background/60 hover:text-primary transition-colors text-xs">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          
          <div>
            <h4 className="font-heading font-semibold text-xs text-background/80 uppercase tracking-wide mb-3">
              Contact
            </h4>
            <div className="space-y-2">
              <a href={phoneHref} onClick={(e) => handleCallClick(e, phoneHref)}
                className="flex items-center gap-2 text-background/60 hover:text-primary transition-colors text-xs">
                <Phone className="w-3 h-3 shrink-0" /> {phoneText}
              </a>
              <a href={phoneHref2} onClick={(e) => handleCallClick(e, phoneHref2)}
                className="flex items-center gap-2 text-background/60 hover:text-primary transition-colors text-xs">
                <Phone className="w-3 h-3 shrink-0" /> {phoneText2}
              </a>
              <a href="mailto:tinytoddstherapycare@gmail.com"
                className="flex items-center gap-2 text-background/60 hover:text-primary transition-colors text-xs break-all">
                <Mail className="w-3 h-3 shrink-0" /> tinytoddstherapycare@gmail.com
              </a>
            </div>
          </div>

        </div>

        
        <div className="pt-4 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-1">
          <p className="text-background/40 text-[11px] flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-primary fill-current" /> for children everywhere
          </p>
          <p className="text-background/30 text-[11px]">
            © {new Date().getFullYear()} Tiny Todds Therapy Care. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;