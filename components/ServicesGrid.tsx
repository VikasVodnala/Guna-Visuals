"use client";

import { motion } from "framer-motion";
import { Video, PenTool, Camera, Layout, Film, Cpu } from "lucide-react";
import Link from "next/link";

const services = [
  { id: "commercial-ads", title: "Commercial Ads", icon: Video, desc: "High-impact advertisements that drive conversion.", color: "border-neon-orange", glow: "rgba(255,122,0,0.5)", delay: 0 },
  { id: "content-writing", title: "Content Writing", icon: PenTool, desc: "Compelling narratives that resonate with your audience.", color: "border-neon-blue", glow: "rgba(0,243,255,0.5)", delay: 0.1 },
  { id: "cinematography", title: "Cinematography", icon: Camera, desc: "Cinematic visuals tailored for modern brands.", color: "border-neon-orange", glow: "rgba(255,122,0,0.5)", delay: 0.2 },
  { id: "poster-designing", title: "Poster Designing", icon: Layout, desc: "Striking graphics that capture immediate attention.", color: "border-neon-blue", glow: "rgba(0,243,255,0.5)", delay: 0.3 },
  { id: "video-editing", title: "Video Editing", icon: Film, desc: "Short & Long-form editing optimized for retention.", color: "border-neon-orange", glow: "rgba(255,122,0,0.5)", delay: 0.4 },
  { id: "ai-videos", title: "AI Videos", icon: Cpu, desc: "Next-gen AI generated content for scalable media.", color: "border-neon-blue", glow: "rgba(0,243,255,0.5)", delay: 0.5 },
];

export default function ServicesGrid() {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 py-32 z-10">
      <div className="text-center mb-20">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-orange to-neon-blue">Expertise watch below </span>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <Link key={service.id} href={`/services/${service.id}`} className="block group">
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: service.delay }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`h-full relative overflow-hidden bg-black/40 backdrop-blur-xl border ${service.color} rounded-2xl p-8 transition-all`}
                style={{ boxShadow: `0 0 20px ${service.glow.replace("0.5", "0.1")}` }}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at center, ${service.glow.replace("0.5", "0.2")}, transparent 70%)` }}
                />
                
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 rounded-full bg-black border ${service.color}`} style={{ boxShadow: `0 0 15px ${service.glow}` }}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight">{service.title}</h3>
                  <p className="text-gray-400 font-light leading-relaxed">{service.desc}</p>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

