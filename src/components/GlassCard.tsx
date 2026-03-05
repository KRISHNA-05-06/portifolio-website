import { motion } from "motion/react";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function GlassCard({ children, delay = 0, className = "" }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className={`bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all ${className}`}
    >
      {children}
    </motion.div>
  );
}
