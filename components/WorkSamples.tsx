"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Maximize2 } from "lucide-react";

export default function WorkSamples() {
  const [activeMedia, setActiveMedia] = useState<"image" | "video" | null>(null);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveMedia(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (activeMedia) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [activeMedia]);

  return (
    <>
      <section className="relative w-full max-w-7xl mx-auto px-4 py-24 z-10 flex flex-col items-center">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4 text-white"
          >
            Our <span className="text-neon-orange">Work Samples</span>
          </motion.h2>
          <div className="w-24 h-1 bg-white/20 mx-auto rounded-full overflow-hidden">
            <motion.div 
              initial={{ x: "-100%" }}
              whileInView={{ x: "0%" }}
              transition={{ duration: 1 }}
              className="w-full h-full bg-neon-orange"
            />
          </div>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Sample Thumbnail */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            onClick={() => setActiveMedia("image")}
            className="relative w-full aspect-square md:aspect-video lg:aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(255,122,0,0.15)] group cursor-pointer"
          >
            <Image 
              src="/assets/work-samples.png" 
              alt="Work Samples Collage" 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
               <Maximize2 className="w-12 h-12 text-white drop-shadow-lg" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 pointer-events-none z-30">
              <span className="text-white font-semibold text-lg tracking-wide">Design Portfolio</span>
            </div>
          </motion.div>

          {/* Video Sample Thumbnail */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onClick={() => setActiveMedia("video")}
            className="relative w-full aspect-video lg:aspect-[4/3] rounded-2xl overflow-hidden border border-neon-blue/30 shadow-[0_0_40px_rgba(0,243,255,0.15)] bg-black/50 backdrop-blur-xl group flex items-center justify-center cursor-pointer"
          >
            <video 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 relative z-10 pointer-events-none"
              autoPlay 
              loop 
              muted 
              playsInline
            >
              <source src="/assets/work-video.mp4" type="video/mp4" />
            </video>
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
               <Maximize2 className="w-12 h-12 text-white drop-shadow-lg" />
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center z-0 text-gray-500 px-4 text-center">
               <span className="text-sm font-mono uppercase tracking-widest mb-2">Video Reel Placeholder</span>
               <span className="text-xs">Upload your video to <br/><code className="text-neon-blue">public/assets/work-video.mp4</code></span>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 z-30 pointer-events-none">
              <span className="text-white font-semibold text-lg tracking-wide">Video Production Reel</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-12"
            onClick={() => setActiveMedia(null)}
          >
            <button 
              className="absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
              onClick={() => setActiveMedia(null)}
            >
              <X className="w-6 h-6 md:w-8 md:h-8" />
            </button>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full h-full flex items-center justify-center max-w-6xl"
              onClick={(e) => e.stopPropagation()} // Prevent clicking media from closing modal
            >
              {activeMedia === "image" && (
                <div className="relative w-full h-full max-h-[85vh]">
                  <Image 
                    src="/assets/work-samples.png" 
                    alt="Work Samples Fullscreen" 
                    fill 
                    className="object-contain"
                  />
                </div>
              )}
              {activeMedia === "video" && (
                <video 
                  className="w-full max-h-[85vh] object-contain rounded-xl border border-neon-blue/20 shadow-[0_0_50px_rgba(0,243,255,0.2)] bg-black"
                  controls
                  autoPlay 
                  playsInline
                >
                  <source src="/assets/work-video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
