import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ClipboardCheck, 
  ChevronRight, 
  RotateCcw, 
  Sparkles,
  Brain,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";

const questions = [
  {
    id: 1,
    question: "Does your child make eye contact when you talk to them?",
    options: [
      { text: "Yes, always", autismScore: 0, adhdScore: 0 },
      { text: "Sometimes", autismScore: 2, adhdScore: 1 },
      { text: "Rarely", autismScore: 4, adhdScore: 1 },
      { text: "Never", autismScore: 5, adhdScore: 0 },
    ],
  },
  {
    id: 2,
    question: "How does your child respond when their name is called?",
    options: [
      { text: "Responds immediately", autismScore: 0, adhdScore: 0 },
      { text: "Usually responds after a delay", autismScore: 2, adhdScore: 3 },
      { text: "Only responds when busy doing something else", autismScore: 1, adhdScore: 4 },
      { text: "Rarely responds", autismScore: 4, adhdScore: 2 },
    ],
  },
  {
    id: 3,
    question: "Does your child have difficulty sitting still for activities?",
    options: [
      { text: "No, they can focus well", autismScore: 0, adhdScore: 0 },
      { text: "Sometimes fidgets", autismScore: 1, adhdScore: 3 },
      { text: "Often restless and moving", autismScore: 1, adhdScore: 4 },
      { text: "Cannot sit still at all", autismScore: 2, adhdScore: 5 },
    ],
  },
  {
    id: 4,
    question: "How does your child play with toys?",
    options: [
      { text: "Uses toys in creative, varied ways", autismScore: 0, adhdScore: 0 },
      { text: "Prefers repetitive play patterns", autismScore: 4, adhdScore: 1 },
      { text: "Quickly loses interest and moves to new toys", autismScore: 0, adhdScore: 4 },
      { text: "Lines up toys or focuses on parts", autismScore: 5, adhdScore: 0 },
    ],
  },
  {
    id: 5,
    question: "How does your child react to changes in routine?",
    options: [
      { text: "Adapts easily", autismScore: 0, adhdScore: 0 },
      { text: "Slight discomfort but adjusts", autismScore: 2, adhdScore: 1 },
      { text: "Gets quite upset", autismScore: 4, adhdScore: 2 },
      { text: "Has meltdowns or severe distress", autismScore: 5, adhdScore: 1 },
    ],
  },
  {
    id: 6,
    question: "Does your child have difficulty waiting their turn?",
    options: [
      { text: "No, waits patiently", autismScore: 0, adhdScore: 0 },
      { text: "Sometimes impatient", autismScore: 1, adhdScore: 2 },
      { text: "Often interrupts or can't wait", autismScore: 1, adhdScore: 4 },
      { text: "Extremely difficult to wait", autismScore: 2, adhdScore: 5 },
    ],
  },
];

const AutismQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption !== null) {
      const newAnswers = [...answers, selectedOption];
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        setShowResults(true);
      }
    }
  };

  const calculateResults = () => {
    let autismTotal = 0;
    let adhdTotal = 0;

    answers.forEach((answerIndex, questionIndex) => {
      const option = questions[questionIndex].options[answerIndex];
      autismTotal += option.autismScore;
      adhdTotal += option.adhdScore;
    });

    const maxAutism = 30; 
    const maxAdhd = 25; 

    const autismPercentage = Math.round((autismTotal / maxAutism) * 100);
    const adhdPercentage = Math.round((adhdTotal / maxAdhd) * 100);

    
    const total = autismPercentage + adhdPercentage;
    if (total > 0) {
      const normalizedAutism = Math.round((autismPercentage / total) * 100);
      const normalizedAdhd = 100 - normalizedAutism;
      return { autism: normalizedAutism, adhd: normalizedAdhd, rawAutism: autismPercentage, rawAdhd: adhdPercentage };
    }
    
    return { autism: 0, adhd: 0, rawAutism: 0, rawAdhd: 0 };
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedOption(null);
    setShowResults(false);
  };

  const results = showResults ? calculateResults() : null;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <section id="quiz" className="py-10 bg-mint-gradient relative overflow-hidden">
      
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 right-20 w-60 h-60 border-4 border-dashed border-primary/20 rounded-full"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-20 left-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl"
      />

  
      <motion.div
        animate={{ y: [-15, 15, -15], rotate: [-5, 5, -5] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-32 left-16 text-primary/40"
      >
        <Brain className="w-12 h-12" />
      </motion.div>
      <motion.div
        animate={{ y: [10, -10, 10], rotate: [5, -5, 5] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute bottom-40 right-24 text-accent/50"
      >
        <Lightbulb className="w-10 h-10" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
      
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-card text-primary px-4 py-2 rounded-full text-sm font-medium mb-4 shadow-soft"
          >
            <ClipboardCheck className="w-4 h-4" />
            Quick Assessment
          </motion.div>

          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Is Your Child Showing Signs of{" "}
            <span className="text-gradient">Autism or ADHD?</span>
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Take this quick 6-question assessment to understand your child's behavior patterns. 
            This is not a medical diagnosis - please consult with our specialists for proper evaluation.
          </p>
        </motion.div>

       
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-card rounded-3xl shadow-float p-8 md:p-12 border border-border/50 relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
            
            <AnimatePresence mode="wait">
              {!showResults ? (
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                 
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Question {currentQuestion + 1} of {questions.length}
                      </span>
                      <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                      />
                    </div>
                  </div>

                 
                  <h3 className="font-heading font-bold text-xl md:text-2xl text-foreground mb-8">
                    {questions[currentQuestion].question}
                  </h3>

                 
                  <div className="space-y-4 mb-8">
                    {questions[currentQuestion].options.map((option, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleOptionSelect(index)}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 ${
                          selectedOption === index
                            ? "bg-primary/10 border-primary shadow-colored"
                            : "bg-secondary/50 border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              selectedOption === index
                                ? "bg-primary border-primary"
                                : "border-muted-foreground"
                            }`}
                          >
                            {selectedOption === index && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 bg-white rounded-full"
                              />
                            )}
                          </div>
                          <span className="font-medium text-foreground">{option.text}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                 
                  <Button
                    variant="playful"
                    size="xl"
                    onClick={handleNext}
                    disabled={selectedOption === null}
                    className="w-full"
                  >
                    {currentQuestion === questions.length - 1 ? "See Results" : "Next Question"}
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </motion.div>

                  <h3 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">
                    Assessment Complete!
                  </h3>

                  <p className="text-muted-foreground mb-8">
                    Based on your answers, here's a preliminary indication:
                  </p>

                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                   
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gradient-to-br from-primary/10 to-lavender/10 rounded-2xl p-6 border-2 border-primary/30"
                    >
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Brain className="w-6 h-6 text-primary" />
                        <span className="font-heading font-bold text-lg text-foreground">Autism Traits</span>
                      </div>
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="none"
                            className="text-secondary"
                          />
                          <motion.circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="none"
                            strokeLinecap="round"
                            className="text-primary"
                            initial={{ strokeDasharray: "0 352" }}
                            animate={{ strokeDasharray: `${(results?.autism || 0) * 3.52} 352` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-heading font-bold text-3xl text-primary">
                            {results?.autism}%
                          </span>
                        </div>
                      </div>
                    </motion.div>

                  
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-gradient-to-br from-accent/10 to-peach/10 rounded-2xl p-6 border-2 border-accent/30"
                    >
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Lightbulb className="w-6 h-6 text-primary" />
                        <span className="font-heading font-bold text-lg text-foreground">ADHD Traits</span>
                      </div>
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="none"
                            className="text-secondary"
                          />
                          <motion.circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="none"
                            strokeLinecap="round"
                            className="text-accent"
                            initial={{ strokeDasharray: "0 352" }}
                            animate={{ strokeDasharray: `${(results?.adhd || 0) * 3.52} 352` }}
                            transition={{ duration: 1, delay: 0.6 }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-heading font-bold text-3xl text-primary">
                            {results?.adhd}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="bg-destructive/10 rounded-2xl p-4 mb-8 flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground text-left">
                      <strong className="text-foreground">Important:</strong> This is a screening tool only, 
                      not a medical diagnosis. Please consult with our certified therapists for a comprehensive evaluation.
                    </p>
                  </motion.div>

               
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={resetQuiz}
                      className="gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Take Again
                    </Button>
                    <Button
                      variant="playful"
                      size="lg"
                      asChild
                    >
                      <a href="tel:+919941350646" className="gap-2">
                        <Phone className="w-4 h-4" />
                        Book Consultation
                      </a>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

   
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-8 gap-2"
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
              className={`w-2 h-2 rounded-full ${
                i < currentQuestion + 1 ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AutismQuiz;
