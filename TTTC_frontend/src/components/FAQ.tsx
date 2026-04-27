import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useMemo } from "react";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {getquestion, Questions} from "@/services/modules/question.api"

const FAQ = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const[questions, setquestions] = useState<Questions[]>([]);
    const[loading, setloading] = useState(true);
  
    useEffect(()=>{
      (async () =>{
        try {
          const response = await getquestion();
          setquestions(response)
        } catch (e) {
          console.error("Services APT error", e)
        }finally {
          setloading(false)
        }
      })();
    }, []);
  

  return (
    <section id="faq" className="py-10 bg-background relative overflow-hidden">
     
      <div className="absolute top-0 right-0 w-96 h-96 bg-lavender/20 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky/20 rounded-full blur-3xl translate-y-1/2" />
      
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-lavender/30 text-lavender-foreground rounded-full text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4" />
            Got Questions?
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our therapy services, enrollment, and care approach
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          {loading ? (
            <div className="text-center text-muted-foreground py-10">
              Loading FAQs...
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              No FAQs found.
            </div>
          ) : (
          <Accordion type="single" collapsible className="space-y-4">
            {questions.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.1 * index }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="glass-card rounded-xl px-6 border-none"
                >
                  <AccordionTrigger className="text-left font-heading font-semibold text-foreground hover:text-primary hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {faq.description}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
          )}
        </motion.div>

       
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            Contact our support team
            <span aria-hidden>→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
