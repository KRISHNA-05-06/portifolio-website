import { motion } from "motion/react";
import { Link } from "react-router";
import { ReactNode } from "react";
import { ArrowLeft, Home as HomeIcon } from "lucide-react";

interface WorldLayoutProps {
  children: ReactNode;
  backgroundImage: string;
  title: string;
  subtitle: string;
  gradient: string;
  glowColor: string;
}

export function WorldLayout({
  children,
  backgroundImage,
  title,
  subtitle,
  gradient,
  glowColor,
}: WorldLayoutProps) {
  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0">
        <img
          src={backgroundImage}
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div className={`absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black`} />
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`} />
      </div>

      {/* Fog/Atmosphere Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link to="/">
            <motion.div
              className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full hover:border-white/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-white" />
              <span className="text-white text-sm">Back</span>
            </motion.div>
          </Link>
          <Link to="/">
            <motion.div
              className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full hover:border-white/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <HomeIcon className="w-5 h-5 text-white" />
              <span className="text-white text-sm">Home</span>
            </motion.div>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1
              className={`text-6xl md:text-8xl mb-4 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
              style={{
                textShadow: `0 0 60px ${glowColor}`,
              }}
            >
              {title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300">{subtitle}</p>
          </motion.div>

          {/* Content Sections */}
          {children}
        </div>
      </div>
    </div>
  );
}
