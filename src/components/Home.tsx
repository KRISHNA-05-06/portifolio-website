import { motion } from "motion/react";
import { Link } from "react-router";
import { Sparkles, Cpu, Network, Skull, Zap } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect } from "react";

const worlds = [
  {
    id: "wizard",
    title: "Hogwarts Archives",
    subtitle: "About Me & Education",
    icon: Sparkles,
    path: "/wizard",
    gradient: "from-purple-600 via-amber-600 to-yellow-500",
    glowColor: "rgba(168, 85, 247, 0.6)",
  },
  {
    id: "automation",
    title: "Cybertron Data Forge",
    subtitle: "Data Engineering Projects",
    icon: Cpu,
    path: "/automation",
    gradient: "from-slate-500 via-blue-600 to-cyan-500",
    glowColor: "rgba(59, 130, 246, 0.6)",
  },
  {
    id: "cloud",
    title: "Kong Skill Island",
    subtitle: "Skills & Internships",
    icon: Skull,
    path: "/cloud",
    gradient: "from-orange-600 via-red-700 to-gray-800",
    glowColor: "rgba(249, 115, 22, 0.6)",
  },
  {
    id: "analytics",
    title: "Jurassic Data Park",
    subtitle: "Professional Certifications",
    icon: Network,
    path: "/analytics",
    gradient: "from-green-600 via-emerald-700 to-amber-600",
    glowColor: "rgba(34, 197, 94, 0.6)",
  },
  {
    id: "city",
    title: "Stark Tower Hologram Room",
    subtitle: "Contact",
    icon: Zap,
    path: "/city",
    gradient: "from-yellow-500 via-red-600 to-blue-600",
    glowColor: "rgba(234, 179, 8, 0.6)",
  },
];

export function Home() {
  useEffect(() => {
    document.title = 'Sri Krishna Sai Kota | Portfolio';
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Static Background */}
      <div className="fixed inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc3RyZWFtcyUyMG5ldHdvcmslMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3MDkxNjkyM3ww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Data network background"
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/10 to-black" />
      </div>

      {/* Static Gradient Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-cyan-950/20 via-transparent to-purple-950/20" />
      </div>

      {/* Minimal Vignette */}
      <div className="fixed inset-0 pointer-events-none z-40">
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-24 relative"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Title */}
          <motion.h1
            className="text-7xl md:text-[11rem] mb-10 bg-gradient-to-r from-cyan-200 via-blue-100 to-purple-200 bg-clip-text text-transparent relative z-10"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              textShadow: "0 0 60px rgba(6, 182, 212, 0.4)",
              letterSpacing: "-0.03em",
              fontWeight: 900,
            }}
          >
            Sri Krishna Sai Kota
          </motion.h1>

          {/* Subtitle */}
          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <p
              className="text-3xl md:text-5xl text-cyan-300 mb-6 tracking-[0.3em]"
              style={{
                textShadow: "0 0 20px rgba(6, 182, 212, 0.6)",
              }}
            >
              DATA ENGINEER
            </p>

            {/* Static Light Beam */}
            <div
              className="h-2 w-96 max-w-full mx-auto rounded-full mb-8"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.6), transparent)",
                boxShadow: "0 0 15px rgba(6, 182, 212, 0.4)",
              }}
            />

            <p className="text-lg md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Architecting Scalable, Fault-Tolerant Data Systems for Real-Time Analytics
            </p>
          </motion.div>
        </motion.div>

        {/* Portal Cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 max-w-[1900px] w-full"
        >
          {worlds.map((world, index) => {
            const Icon = world.icon;
            
            return (
              <motion.div
                key={world.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 1.2 + index * 0.1,
                  duration: 0.5,
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to={world.path}>
                  <div className="relative group cursor-pointer h-full">
                    {/* Glow on Hover */}
                    <div
                      className="absolute -inset-4 rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle, ${world.glowColor}, transparent 70%)`,
                      }}
                    />

                    {/* Card */}
                    <div 
                      className="relative bg-gradient-to-br from-black/70 via-black/50 to-black/70 backdrop-blur-xl border-2 border-white/10 rounded-3xl p-10 overflow-hidden transition-all duration-300 hover:border-white/30 h-full flex flex-col"
                      style={{
                        boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
                      }}
                    >
                      {/* Background Gradient on Hover */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${world.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                      />

                      {/* Icon */}
                      <div className="relative mb-10">
                        <div
                          className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${world.gradient} flex items-center justify-center mx-auto`}
                          style={{
                            boxShadow: `0 15px 40px ${world.glowColor}`,
                          }}
                        >
                          <Icon className="w-14 h-14 text-white" />
                        </div>
                      </div>

                      {/* Text */}
                      <div className="relative text-center flex-1 flex flex-col justify-end">
                        <h3 
                          className="text-3xl mb-4 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-200 group-hover:bg-clip-text transition-all duration-300"
                        >
                          {world.title}
                        </h3>
                        <p className="text-gray-400 text-base group-hover:text-gray-300 transition-colors">
                          {world.subtitle}
                        </p>

                        {/* Energy Line */}
                        <div className="mt-8 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                      </div>

                      {/* Corner Accents */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="mt-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <div className="flex flex-col items-center gap-4">
            <span className="text-cyan-400 tracking-[0.3em] text-lg">
              EXPLORE THE WORLDS
            </span>
            <div
              className="w-2 h-20 bg-gradient-to-b from-cyan-400 via-blue-500 to-transparent rounded-full"
              style={{
                boxShadow: "0 0 15px rgba(6, 182, 212, 0.4)",
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}