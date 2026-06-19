import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check } from "lucide-react";

// Typewriter strings for the email placeholder (tailored to mdlp.ai).
const TYPE_OPEN = "Enter Your Email To Start The Conversation";
const TYPE_DONE = "Thank You — I'll Be In Touch Shortly";

export default function Hero() {
  const [showForm, setShowForm] = useState(false); // button <-> email form
  const [submitted, setSubmitted] = useState(false); // form submitted state
  const [email, setEmail] = useState("");
  const [placeholder, setPlaceholder] = useState(""); // typed-in placeholder

  // --- Typewriter: type the placeholder one character at a time (60ms) ---
  useEffect(() => {
    if (!showForm) {
      setPlaceholder("");
      return;
    }
    const target = submitted ? TYPE_DONE : TYPE_OPEN;
    setPlaceholder("");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setPlaceholder(target.slice(0, i));
      if (i >= target.length) clearInterval(id);
    }, 60);
    return () => clearInterval(id);
  }, [showForm, submitted]);

  // --- After submitting, reset back to the button state after 4 seconds ---
  useEffect(() => {
    if (!submitted) return;
    const t = setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
      setEmail("");
    }, 4000);
    return () => clearTimeout(t);
  }, [submitted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <section className="relative flex-1 flex flex-col items-center justify-center px-6">
      <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center justify-center w-full gap-12">
        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/80 text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase mb-4"
        >
          AI Systems · Automation · Strategic Technology
        </motion.p>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: "'Instrument Serif', serif" }}
          className="text-4xl md:text-[64px] font-medium tracking-[-0.01em] leading-[1.1] mb-6 bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent max-w-4xl"
        >
          A smarter way to build
          <br className="hidden md:block" /> and scale with AI
        </motion.h1>

        {/* CTA area — toggles between button and email form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="min-h-[50px] mt-2"
        >
          <AnimatePresence mode="wait">
            {!showForm ? (
              // ---- Button state ----
              <motion.button
                key="button"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setShowForm(true)}
                className="px-10 py-3 text-[14px] font-medium border border-white/10 rounded-full hover:border-white/30 hover:bg-white/[0.02] transition-all duration-300 text-white/90 backdrop-blur-sm cursor-pointer"
              >
                Get in touch
              </motion.button>
            ) : (
              // ---- Email form state ----
              <motion.form
                key="form"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmit}
                className="flex items-center gap-2 pl-5 pr-1.5 py-1.5 text-[14px] font-medium border border-white/20 rounded-full bg-white/[0.02] backdrop-blur-sm w-full max-w-[320px] focus-within:border-white/40 transition-colors duration-300"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder}
                  autoFocus
                  disabled={submitted}
                  className="flex-1 min-w-0 bg-transparent text-white placeholder-white/45 outline-none"
                />
                <button
                  type="submit"
                  aria-label="Submit email"
                  className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-white text-black hover:bg-white/90 transition-colors cursor-pointer"
                >
                  {submitted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Play video demo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <button className="text-white/80 hover:text-white/40 transition-colors duration-300 text-[13px] font-medium tracking-wide cursor-pointer">
            Play Video Demo
          </button>
        </motion.div>
      </div>
    </section>
  );
}
