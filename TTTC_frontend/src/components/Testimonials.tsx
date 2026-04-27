import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Sam Lijoe",
    role: "3 years",
    content: "I had send my child three months to this centre and experienced passionate staffs working here and a marvellous improvements in upbringing speech and cognitive development towards excellence in listening ,grasping and understanding skills needed for a full development of a child.",
    rating: 5,
    image: "https://lh3.googleusercontent.com/a-/ALV-UjWTlQ9gDWkoP5i7-2wghXEQ8Y4SB2HR1kt-F-DXqAl3b-D18bY=w90-h90-p-rp-mo-br100"
  },
  {
    name: "Anees fathima Begum",
    role: "1 years",
    content: "We are thankful to tiny todds therapy center since my son started speaking few words and he become a normal kid now so we are thankful for tiny todds therapy care",
    rating: 5,
    image: "https://lh3.googleusercontent.com/a/ACg8ocJ4_yq3av6wUxLOR-1iQkBg-u4BSRBAtyL9ewMNZieyZcAyXwg=w90-h90-p-rp-mo-ba2-br100"
  },
  {
    name: "Psychology Nivetha",
    role: "3 years",
    content: "Best speech therapy center it helps the children to develop their speech,learning.The staffs are very kind and good...",
    rating: 5,
    image: "https://lh3.googleusercontent.com/a-/ALV-UjUnfW8Tde0QewuXSmTrKXCl42ZWh_VAWv-qhwr7ebSKAFWzWtCg=w90-h90-p-rp-mo-br100"
  },
  {
    name: "Meenakshi M",
    role: "2 years",
    content: "I highly recommend tiny toodds for all those parents who are stuggling with their child developed delys i am sending my toddler to center since 4 years age and i am glad he showing improvement",
    rating: 5,
    image: "https://lh3.googleusercontent.com/a-/ALV-UjX1hb-qR06sWLmAm1wSO_hMm0nLhhKYDtAObJqyF-9wMQuJlTa0=w90-h90-p-rp-mo-br100"
  }
];

const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 bg-card relative overflow-hidden">
     
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Parent Stories
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            What <span className="text-gradient">Parents</span> Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real stories from real families who have experienced the transformative care at Tiny Todds
          </p>
        </motion.div>

      
        <div className="hidden lg:grid lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="glass-card-hover rounded-2xl p-6 h-full relative">
               
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Quote className="w-5 h-5 text-primary" />
                </div>
                
            
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-accent fill-current" />
                  ))}
                </div>
                
                <p className="text-muted-foreground text-sm mb-6 line-clamp-4">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center gap-3 mt-auto">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <div>
                    <p className="font-heading font-semibold text-foreground text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        
        <div className="lg:hidden">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex gap-1 mb-4">
              {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                <Star key={i} className="w-5 h-5 text-accent fill-current" />
              ))}
            </div>
            
            <p className="text-muted-foreground mb-6">
              "{testimonials[currentIndex].content}"
            </p>
            
            <div className="flex items-center gap-3">
              <img
                src={testimonials[currentIndex].image}
                alt={testimonials[currentIndex].name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20"
              />
              <div>
                <p className="font-heading font-semibold text-foreground">{testimonials[currentIndex].name}</p>
                <p className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</p>
              </div>
            </div>
          </motion.div>
          
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? "w-6 bg-primary" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
