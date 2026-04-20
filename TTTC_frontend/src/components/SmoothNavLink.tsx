import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface SmoothNavLinkProps {
  href: string;
  icon: LucideIcon;
  name: string;
  index: number;
  onClick?: () => void;
  isMobile?: boolean;
}

const SmoothNavLink = ({ href, icon: Icon, name, index, onClick, isMobile }: SmoothNavLinkProps) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    
    onClick?.();
  };

  if (isMobile) {
    return (
      <motion.a
        href={href}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
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
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -2 }}
      onClick={handleClick}
      className="px-3 py-2 rounded-xl text-foreground font-medium hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 flex items-center gap-2 group"
    >
      <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      <span className="text-sm">{name}</span>
    </motion.a>
  );
};

export default SmoothNavLink;
