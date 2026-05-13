"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AnimatedBackground() {
  return (
    <>
      <div className="fixed inset-0 z-0 opacity-60 mix-blend-screen pointer-events-none overflow-hidden bg-black">
        <motion.div
          animate={{ 
            scale: [1.05, 1.15, 1.05],
            x: ["-2%", "2%", "-2%"],
            y: ["-1%", "1%", "-1%"]
          }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute inset-[-5%]"
        >
          <Image
            src="/assets/studio-bg.png"
            alt="Graphic Design Studio Setup"
            fill
            priority
            className="object-cover object-center"
          />
        </motion.div>
        
        {/* Gradients to blend content seamlessly with warm tones */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/70 via-[#2a1300]/20 to-[#050505]/95"></div>
      </div>
      
      {/* Warm cinematic volumetric lighting overlays */}
      <motion.div 
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vh] bg-orange-500/15 blur-[150px] rounded-full pointer-events-none z-0"
      />
      <motion.div 
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vh] bg-amber-600/15 blur-[150px] rounded-full pointer-events-none z-0"
      />
      <motion.div 
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="fixed top-[40%] left-[20%] w-[30vw] h-[30vh] bg-red-600/10 blur-[120px] rounded-full pointer-events-none z-0"
      />
    </>
  );
}
