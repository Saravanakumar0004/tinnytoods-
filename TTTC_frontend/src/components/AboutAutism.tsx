import { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, TrendingUp, Sparkles, ArrowRight, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Autism, getautism } from "@/services/modules/services.api";

const formatIn = (n?: number | null) => (!n ? "--" : `1 in ${n.toLocaleString("en-IN")}`);

const AboutAutism = memo(() => {
  const [stats, setStats] = useState<Autism | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getautism();
        if (!cancelled) setStats(res);
      } catch (err) { console.error(err); }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <section id="about-autism" className="py-10 bg-sky-gradient relative overflow-hidden">
      {/* ✅ CSS animations — no framer-motion for purely decorative elements */}
      <div
        className="absolute top-10 right-10 w-40 h-40 border-4 border-dashed border-primary/20 rounded-full pointer-events-none"
        style={{ animation: "spin 40s linear infinite" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-20 left-10 w-60 h-60 bg-lavender/30 rounded-full blur-3xl pointer-events-none"
        style={{ animation: "blobScale 6s ease-in-out infinite" }}
        aria-hidden="true"
      />
      <style>{`
        @keyframes spin      { to { transform: rotate(360deg); } }
        @keyframes blobScale { 0%,100%{transform:scale(1)}50%{transform:scale(1.1)} }
        @keyframes floatBob  { 0%,100%{transform:translateY(-10px) rotate(-5deg)}50%{transform:translateY(10px) rotate(5deg)} }
      `}</style>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-card text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-soft">
              <Sparkles className="w-4 h-4" />They Are Special
            </motion.div>

            <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
              Understanding <span className="text-gradient">Autism</span>
            </h2>

            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>
                Autism, we all heard about this disorder and it is quite familiar in recent days.
                Earlier days it was a very rare disorder and in 1970,{" "}
                <strong className="text-foreground">{formatIn(stats?.autism_then)} children</strong> were affected.
              </p>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.2 }}
                className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-foreground mb-1">Rising Numbers</p>
                    <p className="text-muted-foreground">
                      Recently, statistics say <strong className="text-primary">{formatIn(stats?.autism_now)} children</strong> are affected.
                    </p>
                  </div>
                </div>
              </motion.div>

              <p>Many researchers say Autism is not curable, and it will remain throughout life. But when there is a problem, there must be a solution.</p>

              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                viewport={{ once: true }} transition={{ delay: 0.4 }}
                className="text-primary font-semibold italic">
                "Let's connect a few dots to find out what might be the major cause for Autism."
              </motion.p>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.5 }} className="mt-8">
              <Button variant="playful" size="lg" asChild>
                <a href="/about-us">Learn About Our Approach <ArrowRight className="w-5 h-5 ml-2" /></a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Stat cards */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
            <div className="grid gap-6">
              {[
                { year: "1970",  stat: formatIn(stats?.autism_then), color: "bg-success/20", borderColor: "border-success/30", textColor: "text-success" },
                { year: "Today", stat: formatIn(stats?.autism_now),  color: "bg-primary/20", borderColor: "border-primary/30", textColor: "text-primary" },
              ].map((item, index) => (
                <motion.div key={item.year} initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.2 }} whileHover={{ scale: 1.02 }}
                  className={`${item.color} ${item.borderColor} border-2 rounded-3xl p-8 text-center`}>
                  <p className="text-muted-foreground font-medium mb-2">{item.year}</p>
                  <p className={`font-heading font-bold text-4xl ${item.textColor}`}>{item.stat}</p>
                  <p className="text-muted-foreground mt-2">Children affected</p>
                </motion.div>
              ))}

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.7 }}
                className="bg-card rounded-3xl p-6 shadow-float flex items-center gap-4">
                <div className="w-14 h-14 bg-accent/80 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-heading font-bold text-xl text-foreground">250x Increase</p>
                  <p className="text-muted-foreground">Early detection is crucial</p>
                </div>
              </motion.div>
            </div>

            {/* ✅ CSS float animation */}
            <div
              className="absolute -top-8 -right-8 w-24 h-24 bg-accent rounded-3xl flex items-center justify-center shadow-colored rotate-12 pointer-events-none"
              style={{ animation: "floatBob 5s ease-in-out infinite" }}
              aria-hidden="true"
            >
              <Brain className="w-10 h-10 text-accent-foreground" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

AboutAutism.displayName = "AboutAutism";
export default AboutAutism;