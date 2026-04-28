import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface SmoothNavLinkProps {
  href: string;
  icon: LucideIcon;
  name: string;
  index: number;
  onClick?: () => void;
  isMobile?: boolean;
}

const MOBILE_INITIAL = { opacity: 0, x: -20 };
const DESKTOP_INITIAL = { opacity: 0, y: -20 };
const VISIBLE = { opacity: 1, x: 0, y: 0 };
const HOVER = { y: -2 };

const SmoothNavLink = memo(({
  href, icon: Icon, name, index, onClick, isMobile,
}: SmoothNavLinkProps) => {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const el = document.getElementById(href.replace("#", ""));
      if (el) {
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY - 80,
          behavior: "smooth",
        });
      }
      onClick?.();
    },
    [href, onClick]
  );

  if (isMobile) {
    return (
      <motion.a
        href={href}
        initial={MOBILE_INITIAL}
        animate={VISIBLE}
        transition={{ delay: index * 0.05 }}
        onClick={handleClick}
        className="px-4 py-3 rounded-xl text-foreground font-medium hover:bg-secondary transition-colors flex items-center gap-3 active:scale-95"
      >
        <Icon className="w-5 h-5 text-primary" />
        {name}
      </motion.a>
    );
  }

  return (
    <motion.a
      href={href}
      initial={DESKTOP_INITIAL}
      animate={VISIBLE}
      transition={{ delay: index * 0.1 }}
      whileHover={HOVER}
      onClick={handleClick}
      className="px-3 py-2 rounded-xl text-foreground font-medium hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 flex items-center gap-2 group"
    >
      <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      <span className="text-sm">{name}</span>
    </motion.a>
  );
});

SmoothNavLink.displayName = "SmoothNavLink";
export default SmoothNavLink;