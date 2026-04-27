import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import { postBookConsultation } from "@/services/modules/book.api"
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

const timeSlots = [
  "09:30 AM", "10:30 AM", "11:30 AM", 
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"
];

const therapyTypes = [
  "Speech Therapy",
  "Occupational Therapy",
  "Behavioral Therapy",
  "Sensory Integration",
  "Special Education",
  "General Assessment"
];

const branches = [
  "Adambakkam",
  "Adyar",
  "Ambattur",
  "Anna Nagar",
  "Avadi",
  "Ayanavaram",
  "Chinna Nilangarar Kuppam",
  "Choolaimedu",
  "Chromepet",
  "Coimbatore",
  "Egmore",
  "Elandancheri",
  "Kelambakkam",
  "Kodungaiyur East",
  "K.K. Nagar",
  "Mannadi George Town",
  "Medavakkam",
  "Mogappair",
  "Mugalivakkam",
  "Mylapore",
  "Nagercoil",
  "Neelankarai",
  "Pallavaram",
  "Perambur",
  "Porur",
  "Porur Lake Near",
  "Ramapuram",
  "Saidapet",
  "Selaiyur",
  "Sholinganallur",
  "Tambaram",
  "Tharmani",
  "Thiruvanmiyur",
  "Velachery",
  "Vinayagapuram",
  "West Mambalam"
];
const AppointmentBooking = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>();
  const [selectedTherapy, setSelectedTherapy] = useState<string>();
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [branchOpen, setBranchOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    parentName: "",
    childName: "",
    phone: "",
    email: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
      setSubmitting(true)

      const datestr = format(date, "yyyy-MM-dd")
      
      await postBookConsultation({
        date:datestr,
        time:selectedTime,
        branch: selectedBranch,
        therapy_type:selectedTherapy,
        parent_name: formData.parentName.trim(),
        child_name: formData.childName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        notes: formData.message.trim(),
        status: "pending",
      });

      toast.success("Appointment request submitted!.", {
        description: "Redirecting to WhatsApp to confirm your appointment.",
      });

    

      const phoneNumber = "919941350646";
      const message = `🗓️ *New Appointment Request*

      *Parent Name:* ${formData.parentName.trim()}
      *Child's Name:* ${formData.childName.trim()}
      *Phone:* ${formData.phone.trim()}
      *Email:* ${formData.email.trim() || "Not provided"}
      *Preferred Date:* ${format(date, "PPP")}
      *Preferred Time:* ${selectedTime}
      *Therapy Type:* ${selectedTherapy}
      *Branch:* ${selectedBranch}
      *Additional Notes:* ${formData.message.trim() || "None"}`;

      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
      setIsSubmitted(true)

   
      setTimeout(() => {
      setIsSubmitted(false);
      setDate(undefined);
      setSelectedTime(undefined);
      setSelectedTherapy(undefined);
      setSelectedBranch("");
      setFormData({ parentName: "", childName: "", phone: "", email: "", message: "" });
    }, 3000);
    } catch (err:any){
      console.error("Booking submitted error", err);

      const msg = 
      err?.reponse?.data?.detail ||
      err?.reponse?.data?.message ||
      "Faild to book, please try again.";

      toast.error(msg);
    } finally {
      setSubmitting(false)
    }
  };

  return (
    <section id="booking" className="py-10 bg-card relative overflow-hidden">
  
      <div className="absolute top-20 right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-60 h-60 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {isSubmitted ? (
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
              <p className="text-muted-foreground">
                We'll call you within 24 hours to confirm your appointment.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 md:p-10">
              <div className="grid md:grid-cols-2 gap-8">
               
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      Select Date
                    </label>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal h-12",
                            !date && "text-muted-foreground"
                          )}
                        >
                          {date ? format(date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={date}
                          onSelect={(d) => setDate(d ?? undefined)}
                          disabled={(d) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);

                            const check = new Date(d);
                            check.setHours(0, 0, 0, 0);

                            return check < today || d.getDay() === 0; 
                          }}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      Select Time
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((time) => (
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
                  <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Select Branch
                  </label>

                  <Popover open={branchOpen} onOpenChange={setBranchOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between h-12"
                      >
                        {selectedBranch || "Select branch..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent align="end" className="p-0 w-full">
                      <Command>
                        <CommandInput placeholder="Search branch..." />
                        <CommandEmpty>No branch found.</CommandEmpty>

                        <CommandGroup className="max-h-60 overflow-auto">
                          {branches.map((branch) => (
                            <CommandItem
                              key={branch}
                              value={branch}
                              onSelect={(currentValue) => {
                                setSelectedBranch(currentValue);
                                setBranchOpen(false);
                              }}
                            >
                              {branch}
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  selectedBranch === branch
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">
                      Therapy Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {therapyTypes.map((therapy) => (
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

                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        Parent Name
                      </label>
                      <Input
                        value={formData.parentName}
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        placeholder="Your name"
                        required
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Child's Name
                      </label>
                      <Input
                        value={formData.childName}
                        onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                        placeholder="Child's name"
                        required
                        className="h-12"
                      />
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
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      title="Phone number must be exactly 10 digits"
                      onKeyDown={(e) => {
                          if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
                            e.preventDefault();
                          }
                        }}
                      required
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      Email
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-primary" />
                      Additional Notes
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your child's needs..."
                      rows={3}
                    />
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
};

export default AppointmentBooking;
