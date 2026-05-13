"use client";

import { motion } from "framer-motion";
import { FaInstagram, FaYoutube } from "react-icons/fa";

export default function SocialLinks() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="flex items-center justify-center space-x-8 z-20 relative"
    >
      <a href="https://www.instagram.com/gunaa_visuals?igsh=cWZiZ245ZG9tYTVy" target="_blank" rel="noopener noreferrer" className="p-3 rounded-2xl bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 hover:scale-110 transition-transform shadow-[0_0_20px_rgba(236,72,153,0.6)]">
        <FaInstagram className="w-10 h-10 text-white" />
      </a>

      <a href="#" className="p-3 rounded-2xl bg-red-600 hover:scale-110 transition-transform shadow-[0_0_20px_rgba(220,38,38,0.6)]">
        <FaYoutube className="w-10 h-10 text-white" />
      </a>
    </motion.div>
  );
}
