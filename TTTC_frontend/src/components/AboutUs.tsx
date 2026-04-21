  import { motion } from "framer-motion";
  import { Award, Users, Heart, Smile, CheckCircle, ArrowRight } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import {useEffect,useState} from "react";
  import { HomeStats,gethome } from "@/services/modules/home.api";


  const features = [
    "Personalized therapy plans for each child",
    "Qualified and experienced therapists",
    "State-of-the-art facilities",
    "Parent training and support",
    "Regular progress assessments",
    "Holistic approach to development",
  ];

  const AboutUs = () => {
    const [stats, setStats] = useState<HomeStats | null>(null);
    
      useEffect(() => {
        (async () => {
          try {
            const res = await gethome();
            setStats(res);
          } catch (err) {
            console.error(err);
          }
        })();
      }, []);
    return (
      <section id="about-us" className="py-10 bg-card relative overflow-hidden">
        
        {/* Background decorations */}
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-20 left-0 w-72 h-72 bg-secondary/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 50, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-20 right-0 w-64 h-64 bg-lavender/30 rounded-full blur-3xl"
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image/Visual Side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Cards grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Award, label: "Excellence", color: "bg-lavender" },
                  { icon: Users, label: "Teamwork", color: "bg-lavender" },
                  { icon: Heart, label: "Compassion", color: "bg-peach" },
                  { icon: Smile, label: "Happiness", color: "bg-sky" },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className={`${item.color} rounded-3xl p-8 text-center shadow-soft hover:shadow-float transition-all duration-300`}
                  >
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                      className="w-16 h-16 bg-card/50 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    >
                      <item.icon className="w-8 h-8 text-foreground" />
                    </motion.div>
                    <p className="font-heading font-bold text-foreground">{item.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Floating element */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-8 -right-8 bg-accent rounded-2xl p-4 shadow-float"
              >
                <span className="font-heading font-bold text-3xl text-accent-foreground">{stats?.years_of_experience ?? "--"}+</span>
                <p className="text-xs text-accent-foreground/80">Years</p>
              </motion.div>
            </motion.div>

            {/* Content Side */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4"
              >
                <Heart className="w-4 h-4" />
                About Us
              </motion.span>

              <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
                Why Choose{" "}
                <span className="text-gradient">Tiny Todds?</span>
              </h2>

              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                At Tiny Todds Therapy Care, we believe every child deserves the opportunity to thrive. 
                Our team of dedicated professionals provides comprehensive therapy services tailored to 
                each child's unique needs. With over {stats?.years_of_experience ?? "--"}+ years of experience and a network of {stats?.branches ?? "--"}+ branches, 
                we're committed to making quality care accessible.
              </p>
              {/* Features list */}
              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-foreground text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <Button variant="playful" size="lg" asChild>
                <a href="/contact">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    );
  };

  export default AboutUs;
