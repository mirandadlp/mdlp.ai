import { motion } from "motion/react";

export default function Hero() {
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

        {/* CTA — opens the user's email client */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="min-h-[50px] mt-2"
        >
          <a
            href="mailto:miranda.dlp@gmail.com"
            className="inline-block px-10 py-3 text-[14px] font-medium border border-white/10 rounded-full hover:border-white/30 hover:bg-white/[0.02] transition-all duration-300 text-white/90 backdrop-blur-sm cursor-pointer"
          >
            Get in touch
          </a>
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
