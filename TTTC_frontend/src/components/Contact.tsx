import { memo, useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, Clock, MapPin, Send, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { postClientContact } from "@/services/modules/clientcontact.api";
import { useAbout } from "@/hooks/usePhone";
import { formatPhoneForDisplay, formatPhoneForTel } from "@/utils/phone";
import { useCallCount } from "@/services/modules/callcount";

// ── Constants ─────────────────────────────────────────────────────────────────
const FALLBACK_PHONE = "9941350646";
const WA_NUMBER = "919941350646";
const INITIAL_FORM = { name: "", email: "", phone: "", message: "" };

// Stable animation variants
const spinnerVariants = {
  animate: { scale: [1, 1.2, 1], rotate: [0, 180, 360] },
  transition: { duration: 20, repeat: Infinity },
} as const;

const iconHoverTransition = { duration: 0.4 } as const;

// ── Sub-component: contact info row ──────────────────────────────────────────
interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
  color: string;
  index: number;
  onPhoneClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const InfoRow = memo(({ icon: Icon, label, value, href, color, index, onPhoneClick }: InfoRowProps) => {
  const inner = (
    <>
      <motion.div
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={iconHoverTransition}
        className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shadow-soft flex-shrink-0`}
      >
        <Icon className="w-6 h-6 text-foreground" />
      </motion.div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className={`font-heading font-semibold text-foreground ${href ? "group-hover:text-primary transition-colors" : ""}`}>
          {value}
        </p>
      </div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ x: 10 }}
      className="group"
    >
      {href ? (
        <a href={href} onClick={onPhoneClick} className="flex items-center gap-4">
          {inner}
        </a>
      ) : (
        <div className="flex items-center gap-4">{inner}</div>
      )}
    </motion.div>
  );
});
InfoRow.displayName = "InfoRow";

// ── Main component ─────────────────────────────────────────────────────────────
const Contact = memo(() => {
  const { about } = useAbout();
  const { increaseCallCount } = useCallCount();

  const phoneRaw  = about?.phone_no_one ?? FALLBACK_PHONE;
  const phoneHref = formatPhoneForTel(phoneRaw) ?? `tel:+91${FALLBACK_PHONE}`;
  const phoneText = formatPhoneForDisplay(phoneRaw) ?? `+91${FALLBACK_PHONE}`;

  // Memoized so array isn't rebuilt every render
  const contactInfo = useMemo(() => [
    { icon: Phone, label: "Phone",        value: phoneText,                          href: phoneHref,                               color: "bg-lavender" },
    { icon: Mail,  label: "Email",        value: "tinytoddstherapycare@gmail.com",   href: "mailto:tinytoddstherapycare@gmail.com", color: "bg-lavender" },
    { icon: Clock, label: "Working Hours",value: "Mon - Sat: 9:30 AM - 8:00 PM",    href: undefined,                               color: "bg-peach"    },
    { icon: MapPin,label: "Head Office",  value: "Chennai, Tamil Nadu, India",       href: undefined,                               color: "bg-sky"      },
  ], [phoneText, phoneHref]);

  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);

  // Single stable handler for all text fields
  const handleField = useCallback(
    (field: keyof typeof INITIAL_FORM) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setFormData((prev) => ({ ...prev, [field]: e.target.value })),
    []
  );

  const handlePhoneKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") e.preventDefault();
  }, []);

  const handleCallClick = useCallback(
    async (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      try { await increaseCallCount(); } catch (err) { console.error("Error increasing call count:", err); }
      window.location.href = phoneHref;
    },
    [increaseCallCount, phoneHref]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        setSubmitting(true);
        await postClientContact({
          name:    formData.name.trim(),
          email:   formData.email.trim(),
          phone:   formData.phone.trim(),
          message: formData.message.trim(),
        });

        toast.success("Message sent Successfully!", {
          icon: <Heart className="w-5 h-5 text-primary" />,
        });

        const waText =
          `*New Contact Form Submission*%0A%0A` +
          `*Name:* ${encodeURIComponent(formData.name)}%0A` +
          `*Email:* ${encodeURIComponent(formData.email)}%0A` +
          `*Phone:* ${encodeURIComponent(formData.phone)}%0A` +
          `*Message:* ${encodeURIComponent(formData.message)}`;

        window.open(`https://wa.me/${WA_NUMBER}?text=${waText}`, "_blank", "noopener,noreferrer");
        setFormData(INITIAL_FORM);
      } catch (err: any) {
        console.error("Contact submit error:", err);
        toast.error(
          err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Failed to send message. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    },
    [formData]
  );

  return (
    <section id="contact" className="py-10 bg-sky-gradient relative overflow-hidden">
      
      <motion.div
        {...spinnerVariants}
        className="absolute top-20 right-10 w-32 h-32 border-4 border-dashed border-primary/20 rounded-full pointer-events-none"
      />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-lavender/30 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-card text-primary px-4 py-2 rounded-full text-sm font-medium mb-4 shadow-soft"
          >
            <Mail className="w-4 h-4" />
            Get in Touch
          </motion.span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            We'd Love to <span className="text-gradient">Hear From You</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Have questions about our services? Contact us and we'll be happy to help.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* Left: contact info + map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {contactInfo.map((info, index) => (
              <InfoRow
                key={info.label}
                {...info}
                index={index}
                onPhoneClick={info.label === "Phone" ? handleCallClick : undefined}
              />
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-8 bg-card rounded-3xl p-6 shadow-soft overflow-hidden"
            >
              <div className="aspect-video rounded-2xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.9601890257013!2d80.21717937484256!3d13.038206087283363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52676a48755ba7%3A0x2ab661213efe9ef3!2sTiny%20Todds%20Therapy%20Care!5e0!3m2!1sen!2sin!4v1769331134313!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Tiny Todds Therapy Care Location"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Right: contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="bg-card rounded-3xl p-8 shadow-float">
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Your Name</label>
                    <Input
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleField("name")}
                      required
                      className="rounded-xl border-border bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Email Address</label>
                    <Input
                      type="email"
                      placeholder="your@gmail.com"
                      value={formData.email}
                      onChange={handleField("email")}
                      required
                      className="rounded-xl border-border bg-background"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Phone Number</label>
                  <Input
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={handleField("phone")}
                    maxLength={10}
                    pattern="[0-9]{10}"
                    title="Phone number must be exactly 10 digits"
                    onKeyDown={handlePhoneKeyDown}
                    required
                    className="rounded-xl border-border bg-background"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Your Message</label>
                  <Textarea
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={handleField("message")}
                    required
                    rows={5}
                    className="rounded-xl border-border bg-background resize-none"
                  />
                </div>

                <Button type="submit" variant="playful" size="lg" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send via Whatsapp
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

Contact.displayName = "Contact";
export default Contact;