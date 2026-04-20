import { Phone, Mail, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAbout } from "@/hooks/usePhone";
import { formatPhoneForDisplay, formatPhoneForTel } from "@/utils/phone";
import { useCallCount } from "@/services/modules/callcount";

const Footer = () => {
  const { about } = useAbout();

  const fallbackphone = "9941350646";
  const phoneRaw = about?.phone_no_one ?? fallbackphone;
  const phoneHref = formatPhoneForTel(phoneRaw) ?? `tel:+91${fallbackphone}`;
  const phoneText = formatPhoneForDisplay(phoneRaw) ?? `+91 ${fallbackphone}`;

  const phoneRaw2 = about?.phone_no_two ?? fallbackphone;
  const phoneHref2 = formatPhoneForTel(phoneRaw2) ?? `tel:+91${fallbackphone}`;
  const phoneText2 = formatPhoneForDisplay(phoneRaw2) ?? `+91${fallbackphone}`;

  const { increaseCallCount } = useCallCount();

  const handleCallClick = async (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ): Promise<void> => {
    e.preventDefault();
    try {
      await increaseCallCount();
    } catch (err) {
      console.error("Error increasing call count:", err);
    }
    window.location.href = href;
  };

  return (
    <footer className="bg-foreground text-background relative overflow-hidden">

      {/* Wave — purely decorative, does NOT overlap content */}
      <div className="w-full leading-none">
        <svg viewBox="0 0 1440 40" fill="none" className="w-full block">
          <path
            d="M0 40L1440 40L1440 20C1200 0 960 40 720 20C480 0 240 40 0 20L0 40Z"
            className="fill-foreground"
          />
        </svg>
      </div>

      {/* Content starts well below the wave */}
      <div className="container mx-auto px-6 pt-8 pb-6">

        <div className="grid md:grid-cols-3 gap-10 mb-8">

          {/* ── Brand ── */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-xl flex items-center justify-center">
                <img
                  src={logo}
                  alt="Tiny Todds"
                  className="w-34 h-14 rounded-sm"
                />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-background">
                  Tiny Todds
                </h3>
                <p className="text-xs text-background/60">Therapy Care</p>
              </div>
            </div>

            <p className="text-background/70 text-sm leading-relaxed">
              Care with Compassion. Helping children with autism reach their
              full potential through early intervention.
            </p>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h4 className="font-heading font-semibold text-base text-background mb-5">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/"
                  className="text-background/70 hover:text-primary transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/quiz"
                  className="text-background/70 hover:text-primary transition-colors text-sm"
                >
                  Quiz
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-background/70 hover:text-primary transition-colors text-sm"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/about-autism"
                  className="text-background/70 hover:text-primary transition-colors text-sm"
                >
                  About Autism
                </Link>
              </li>
              <li>
                <Link
                  to="/about-us"
                  className="text-background/70 hover:text-primary transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="text-background/70 hover:text-primary transition-colors text-sm"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  to="/videos"
                  className="text-background/70 hover:text-primary transition-colors text-sm"
                >
                  Videos
                </Link>
              </li>
              <li>
                <Link
                  to="/booking"
                  className="text-background/70 hover:text-primary transition-colors text-sm"
                >
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link
                  to="/branches"
                  className="text-background/70 hover:text-primary transition-colors text-sm"
                >
                  Branches
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-background/70 hover:text-primary transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* ── Contact Us ── */}
          <div>
            <h4 className="font-heading font-semibold text-base text-background mb-5">
              Contact Us
            </h4>
            <div className="space-y-3">
              <a
                href={phoneHref}
                onClick={(e) => handleCallClick(e, phoneHref)}
                className="flex items-center gap-3 text-background/70 hover:text-primary transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                {phoneText}
              </a>

              <a
                href={phoneHref2}
                onClick={(e) => handleCallClick(e, phoneHref2)}
                className="flex items-center gap-3 text-background/70 hover:text-primary transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                {phoneText2}
              </a>

              <a
                href="mailto:tinytoddstherapycare@gmail.com"
                className="flex items-center gap-3 text-background/70 hover:text-primary transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                tinytoddstherapycare@gmail.com
              </a>
            </div>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="pt-5 border-t border-background/10 text-center">
          <p className="text-background/50 text-sm flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-primary fill-current" /> for
            children everywhere
          </p>
          <p className="text-background/40 text-xs mt-2">
            © {new Date().getFullYear()} Tiny Todds Therapy Care. All rights
            reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;