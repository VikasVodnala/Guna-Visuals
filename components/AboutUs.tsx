"use client";

import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <section className="relative w-full max-w-5xl mx-auto px-4 py-32 z-10 flex flex-col items-center justify-center text-center">
      <div className="mb-12">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-4 text-white"
        >
          About <span className="text-neon-blue">Guna Visuals</span>
        </motion.h2>
        <div className="w-24 h-1 bg-white/20 mx-auto rounded-full overflow-hidden">
          <motion.div 
            initial={{ x: "-100%" }}
            whileInView={{ x: "0%" }}
            transition={{ duration: 1 }}
            className="w-full h-full bg-neon-blue"
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_0_30px_rgba(0,243,255,0.05)] text-left md:text-center"
      >
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-transparent rounded-3xl pointer-events-none" />
        
        <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-light relative z-10">
          At <strong className="text-white font-semibold">Guna Visuals</strong>, we believe in the absolute power of visual storytelling. 
          Operating at the intersection of creativity and modern technology, we are a premier digital media agency dedicated to helping businesses elevate their brand presence in a crowded digital landscape. 
          <br /><br />
          From high-impact commercial ads and cinematic video production to compelling content writing and striking graphic designs, we provide end-to-end media solutions tailored exactly to your unique vision. 
          Our mission is simple: to transform your ideas into captivating digital experiences that resonate deeply with your audience and drive meaningful growth.
        </p>
      </motion.div>
    </section>
  );
}
