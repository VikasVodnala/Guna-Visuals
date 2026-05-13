"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import SocialLinks from "./SocialLinks";

export default function MediaPlayerMock() {
  return (
    <section className="relative w-full max-w-6xl mx-auto px-4 py-32 z-10 flex flex-col items-center justify-center">
      
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold mb-6 text-white"
        >
          Visual <span className="text-neon-blue">Storytelling</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-gray-400 max-w-2xl mx-auto text-lg"
        >
          Experience cinematic quality that scales across all platforms.
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="relative w-full aspect-video max-h-[70vh] rounded-2xl border border-neon-blue/30 bg-black/80 backdrop-blur-xl overflow-hidden flex items-center justify-center mb-16 shadow-[0_0_50px_rgba(0,243,255,0.15)] group"
      >
        {/* Background glow behind player */}
        <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue/10 to-transparent opacity-50" />
        
        {/* Mock UI Elements */}
        <div className="absolute top-0 left-0 w-full h-12 bg-black/90 border-b border-white/5 flex items-center px-6 space-x-3 z-20">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          <div className="ml-4 text-xs font-mono text-gray-500">project_render_vFinal.mp4</div>
        </div>
        
        {/* Central Play Button */}
        <motion.div 
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          className="w-24 h-24 rounded-full bg-neon-orange/20 flex items-center justify-center backdrop-blur-lg border-2 border-neon-orange cursor-pointer z-20 transition-all shadow-[0_0_30px_rgba(255,122,0,0.4)] group-hover:bg-neon-orange/30 group-hover:shadow-[0_0_50px_rgba(255,122,0,0.6)]"
        >
          <Play className="text-neon-orange w-10 h-10 ml-2" fill="currentColor" />
        </motion.div>
        
        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 w-full h-16 bg-black/90 border-t border-white/5 flex flex-col justify-center px-6 z-20">
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-3 cursor-pointer group/bar">
            <div className="w-1/3 h-full bg-neon-orange group-hover/bar:bg-neon-blue transition-colors"></div>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
            <span>01:24:05</span>
            <div className="flex space-x-3 items-center">
              <div className="w-10 h-1.5 bg-white/20 rounded-full"></div>
              <div className="w-5 h-1.5 bg-white/20 rounded-full"></div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Social Links placed here to associate with media presence */}
      <div className="text-center space-y-6">
        <h3 className="text-lg text-gray-400 tracking-widest uppercase">Connect With Us</h3>
        <SocialLinks />
      </div>

    </section>
  );
}
