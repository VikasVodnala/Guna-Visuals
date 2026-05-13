"use client";

import { motion } from "framer-motion";

interface ServiceCardProps {
  title: string;
  delay: number;
  color?: "orange" | "blue";
  className?: string;
}

export default function ServiceCard({ title, delay, color = "orange", className = "" }: ServiceCardProps) {
  const glowColor = color === "orange" ? "rgba(255, 122, 0, 0.5)" : "rgba(0, 243, 255, 0.5)";
  const borderColor = color === "orange" ? "border-neon-orange" : "border-neon-blue";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      whileHover={{ scale: 1.05, filter: "brightness(1.2)" }}
      className={`animate-float flex items-center justify-center backdrop-blur-md bg-black/40 border ${borderColor} rounded-lg px-6 py-3 shadow-lg ${className}`}
      style={{ boxShadow: `0 0 15px ${glowColor}` }}
    >
      <span className="text-white font-medium text-sm md:text-base tracking-wide whitespace-nowrap">{title}</span>
    </motion.div>
  );
}
