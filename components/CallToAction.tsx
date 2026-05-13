"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="relative z-10 py-32 flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Footer background glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-neon-orange/10 to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 md:p-20 shadow-[0_0_40px_rgba(255,122,0,0.1)] relative"
      >
        <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">
          Ready to Elevate Your Brand?
        </h2>
        
        <a 
          href="https://wa.me/919666266256" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center space-x-4 bg-white text-black px-8 py-4 rounded-full font-bold text-xl md:text-2xl hover:bg-neon-orange hover:text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,122,0,0.5)]"
        >
          <span>Chat on WhatsApp</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </a>

        <div className="mt-8 text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-orange to-yellow-400">
          9666266256
        </div>
        
        <div className="flex items-center justify-center mt-12 space-x-3 text-gray-400 text-sm md:text-base border-t border-white/10 pt-8">
          <Sparkles className="w-5 h-5 text-neon-blue" />
          <p className="tracking-wide uppercase">Complete Media Solutions for Modern Businesses</p>
          <Sparkles className="w-5 h-5 text-neon-blue" />
        </div>
      </motion.div>
    </section>
  );
}
