import { memo, useCallback, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CheckCircle2, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import { postBookConsultation } from "@/services/modules/book.api";

// ── Constants outside component ──────────────────────────────────────────────
const TIME_SLOTS = [
  "09:30 AM", "10:30 AM", "11:30 AM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM",
] as const;

const THERAPY_TYPES = [
  "Speech Therapy", "Occupational Therapy", "Behavioral Therapy",
  "Sensory Integration", "Special Education", "General Assessment",
] as const;

const BRANCHES = [
  "Adambakkam","Adyar","Ambattur","Anna Nagar","Avadi","Ayanavaram",
  "Chinna Nilangarar Kuppam","Choolaimedu","Chromepet","Coimbatore",
  "Egmore","Elandancheri","Kelambakkam","Kodungaiyur East","K.K. Nagar",
  "Mannadi George Town","Medavakkam","Mogappair","Mugalivakkam","Mylapore",
  "Nagercoil","Neelankarai","Pallavaram","Perambur","Porur","Porur Lake Near",
  "Ramapuram","Saidapet","Selaiyur","Sholinganallur","Tambaram","Tharmani",
  "Thiruvanmiyur","Velachery","Vinayagapuram","West Mambalam",
] as const;

const PHONE_NUMBER = "919941350646";
const INITIAL_FORM = { parentName: "", childName: "", phone: "", email: "", message: "" };

// ── Stable today reference helper ────────────────────────────────────────────
function isDisabledDate(d: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const check = new Date(d);
  check.setHours(0, 0, 0, 0);
  return check < today || d.getDay() === 0;
}

// ── Sub-components ────────────────────────────────────────────────────────────
const SuccessCard = memo(() => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="glass-card rounded-3xl p-12 text-center"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, type: "spring" }}
      className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6"
    >
      <CheckCircle2 className="w-10 h-10 text-success" />
    </motion.div>
    <h3 className="font-heading font-bold text-2xl text-foreground mb-2">Appointment Requested!</h3>
    <p className="text-muted-foreground">We'll call you within 24 hours to confirm your appointment.</p>
  </motion.div>
));
SuccessCard.displayName = "SuccessCard";

// ── Main component ────────────────────────────────────────────────────────────
const AppointmentBooking = memo(() => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>();
  const [selectedTherapy, setSelectedTherapy] = useState<string>();
  const [selectedBranch, setSelectedBranch] = useState("");
  const [branchOpen, setBranchOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);

  // Stable field change handler — avoids new fn per field per render
  const handleField = useCallback(
    (field: keyof typeof INITIAL_FORM) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setFormData((prev) => ({ ...prev, [field]: e.target.value })),
    []
  );

  const handleDateSelect = useCallback((d: Date | undefined) => setDate(d ?? undefined), []);
  const handleBranchChange = useCallback((open: boolean) => setBranchOpen(open), []);

  const handlePhoneKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") e.preventDefault();
  }, []);

  // WhatsApp message built only when needed
  const buildWAMessage = useCallback(
    (fd: typeof INITIAL_FORM, d: Date, time: string, therapy: string, branch: string) =>
      `🗓️ *New Appointment Request*\n\n*Parent Name:* ${fd.parentName.trim()}\n*Child's Name:* ${fd.childName.trim()}\n*Phone:* ${fd.phone.trim()}\n*Email:* ${fd.email.trim() || "Not provided"}\n*Preferred Date:* ${format(d, "PPP")}\n*Preferred Time:* ${time}\n*Therapy Type:* ${therapy}\n*Branch:* ${branch}\n*Additional Notes:* ${fd.message.trim() || "None"}`,
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!date || !selectedTime || !selectedTherapy || !selectedBranch) {
        toast.error("Please select date, time, therapy type and branch");
        return;
      }
      if (!formData.parentName || !formData.childName || !formData.phone) {
        toast.error("Please fill in all required fields");
        return;
      }
      try {
        setSubmitting(true);
        await postBookConsultation({
          date: format(date, "yyyy-MM-dd"),
          time: selectedTime,
          branch: selectedBranch,
          therapy_type: selectedTherapy,
          parent_name: formData.parentName.trim(),
          child_name: formData.childName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          notes: formData.message.trim(),
          status: "pending",
        });

        toast.success("Appointment request submitted!", {
          description: "Redirecting to WhatsApp to confirm your appointment.",
        });

        window.open(
          `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(
            buildWAMessage(formData, date, selectedTime, selectedTherapy, selectedBranch)
          )}`,
          "_blank",
          "noopener,noreferrer"
        );

        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setDate(undefined);
          setSelectedTime(undefined);
          setSelectedTherapy(undefined);
          setSelectedBranch("");
          setFormData(INITIAL_FORM);
        }, 3000);
      } catch (err: any) {
        console.error("Booking submitted error", err);
        toast.error(
          err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Failed to book, please try again."
        );
      } finally {
        setSubmitting(false);
      }
    },
    [date, selectedTime, selectedTherapy, selectedBranch, formData, buildWAMessage]
  );

  // Memoize animation props
  const headerAnim = useMemo(() => ({
    initial: { opacity: 0, y: 30 },
    animate: isInView ? { opacity: 1, y: 0 } : {},
  }), [isInView]);

  const formAnim = useMemo(() => ({
    initial: { opacity: 0, y: 30 },
    animate: isInView ? { opacity: 1, y: 0 } : {},
    transition: { delay: 0.2 },
  }), [isInView]);

  return (
    <section id="booking" className="py-10 bg-card relative overflow-hidden">
      {/* Background blobs — purely decorative, no state */}
      <div className="absolute top-20 right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-60 h-60 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4" ref={ref}>
        <motion.div {...headerAnim} className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-success/20 text-success rounded-full text-sm font-medium mb-4">
            <Calendar className="w-4 h-4" />
            Easy Scheduling
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Book a <span className="text-gradient">Consultation</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Schedule a free consultation with our expert therapists. We'll assess your child's needs and create a personalized care plan.
          </p>
        </motion.div>

        <motion.div {...formAnim} className="max-w-4xl mx-auto">
          {isSubmitted ? (
            <SuccessCard />
          ) : (
            <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 md:p-10">
              <div className="grid md:grid-cols-2 gap-8">

                {/* ── Left column ── */}
                <div className="space-y-6">

                  {/* Date picker */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      Select Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal h-12", !date && "text-muted-foreground")}>
                          {date ? format(date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={date}
                          onSelect={handleDateSelect}
                          disabled={isDisabledDate}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Time slots */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      Select Time
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {TIME_SLOTS.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                            selectedTime === time
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/50 text-muted-foreground hover:bg-muted"
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Branch picker */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Select Branch</label>
                    <Popover open={branchOpen} onOpenChange={handleBranchChange}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" className="w-full justify-between h-12">
                          {selectedBranch || "Select branch..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="p-0 w-full">
                        <Command>
                          <CommandInput placeholder="Search branch..." />
                          <CommandEmpty>No branch found.</CommandEmpty>
                          <CommandGroup className="max-h-60 overflow-auto">
                            {BRANCHES.map((branch) => (
                              <CommandItem
                                key={branch}
                                value={branch}
                                onSelect={(val) => { setSelectedBranch(val); setBranchOpen(false); }}
                              >
                                {branch}
                                <Check className={cn("ml-auto h-4 w-4", selectedBranch === branch ? "opacity-100" : "opacity-0")} />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Therapy type */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">Therapy Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {THERAPY_TYPES.map((therapy) => (
                        <button
                          key={therapy}
                          type="button"
                          onClick={() => setSelectedTherapy(therapy)}
                          className={cn(
                            "px-3 py-2 rounded-lg text-sm font-medium transition-all text-left",
                            selectedTherapy === therapy
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/50 text-muted-foreground hover:bg-muted"
                          )}
                        >
                          {therapy}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Right column ── */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        Parent Name
                      </label>
                      <Input value={formData.parentName} onChange={handleField("parentName")} placeholder="Your name" required className="h-12" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Child's Name</label>
                      <Input value={formData.childName} onChange={handleField("childName")} placeholder="Child's name" required className="h-12" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={handleField("phone")}
                      placeholder="+91 XXXXX XXXXX"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      title="Phone number must be exactly 10 digits"
                      onKeyDown={handlePhoneKeyDown}
                      required
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      Email
                    </label>
                    <Input type="email" value={formData.email} onChange={handleField("email")} placeholder="your@email.com" required className="h-12" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-primary" />
                      Additional Notes
                    </label>
                    <Textarea value={formData.message} onChange={handleField("message")} placeholder="Tell us about your child's needs..." rows={3} />
                  </div>

                  <Button type="submit" variant="playful" size="xl" className="w-full mt-4" disabled={submitting}>
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Booking...
                      </>
                    ) : (
                      <>
                        <Calendar className="w-5 h-5 mr-2" />
                        Book Appointment
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
});

AppointmentBooking.displayName = "AppointmentBooking";
export default AppointmentBooking;