import { motion } from "motion/react";
import { WorldLayout } from "./WorldLayout";
import { GlassCard } from "./GlassCard";
import { Mail, Linkedin, Github, Phone, Send, MapPin, Zap } from "lucide-react";
import { useState, useEffect } from "react";

export function FuturisticCityWorld() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent">("idle");

  useEffect(() => {
    document.title = 'Sri Krishna Sai Kota | Portfolio';
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    
    setTimeout(() => {
      setFormStatus("sent");
      setTimeout(() => {
        setFormStatus("idle");
        setFormData({ name: "", email: "", message: "" });
      }, 3000);
    }, 1500);
  };

  const socialLinks = [
    {
      name: "GitHub",
      icon: Github,
      url: "https://github.com/KRISHNA-05-06?tab=repositories",
      color: "from-gray-600 to-gray-800",
      glowColor: "rgba(107, 114, 128, 0.5)",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://www.linkedin.com/in/srikrishnasai/",
      color: "from-blue-500 to-cyan-600",
      glowColor: "rgba(59, 130, 246, 0.5)",
    },
    {
      name: "Email",
      icon: Mail,
      url: "mailto:srikrishnasaikota@gmail.com",
      color: "from-yellow-500 to-red-600",
      glowColor: "rgba(234, 179, 8, 0.5)",
    },
  ];

  return (
    <WorldLayout
      backgroundImage="https://images.unsplash.com/photo-1599727277643-b0c9cfb7705d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwdGVjaG5vbG9neSUyMGxhYm9yYXRvcnklMjBob2xvZ3JhbXxlbnwxfHx8fDE3NzI2ODQ2MTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      title="Stark Tower Hologram Room"
      subtitle="Establish Contact"
      gradient="from-yellow-400 via-red-500 to-blue-600"
      glowColor="rgba(234, 179, 8, 0.5)"
    >
      {/* Arc Reactor Pulse Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Central Arc Reactor Glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(96, 165, 250, 0.15) 0%, rgba(234, 179, 8, 0.1) 30%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Holographic Scan Lines */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`scan-${i}`}
            className="absolute left-0 right-0 h-px"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(96, 165, 250, 0.4) 50%, transparent 100%)",
              top: `${20 + i * 30}%`,
            }}
            animate={{
              y: [0, 100, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 1.3,
            }}
          />
        ))}

        {/* Energy Particles - Arc Reactor Style */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 3) * 25}%`,
              width: `${30 + i * 5}px`,
              height: `${30 + i * 5}px`,
              background: i % 3 === 0 
                ? "radial-gradient(circle, rgba(234, 179, 8, 0.2) 0%, transparent 70%)"
                : i % 3 === 1
                ? "radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(96, 165, 250, 0.2) 0%, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.2, 0.5, 0.2],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 3 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      <div className="space-y-8">
        {/* JARVIS Status Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  className="relative"
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-600 flex items-center justify-center relative">
                    <Zap className="w-8 h-8 text-white z-10" />
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "radial-gradient(circle, rgba(96, 165, 250, 0.6) 0%, transparent 70%)",
                      }}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  </div>
                </motion.div>
                <div>
                  <h3 className="text-xl text-white font-medium">JARVIS Communication System</h3>
                  <p className="text-sm text-cyan-400">Holographic Interface Active</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full">
                <motion.div
                  className="w-2 h-2 rounded-full bg-blue-400"
                  animate={{
                    boxShadow: [
                      "0 0 10px rgba(96, 165, 250, 0.5)",
                      "0 0 20px rgba(96, 165, 250, 0.9)",
                      "0 0 10px rgba(96, 165, 250, 0.5)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-blue-300 text-sm">System Online</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Contact Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form - Holographic Style */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <GlassCard>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 via-red-500 to-blue-500 rounded-full" />
                <h2 className="text-3xl text-white">Initiate Communication</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-cyan-300 mb-2 text-sm font-medium">Identity Protocol</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-black/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
                    placeholder="Enter your designation"
                  />
                </div>

                <div>
                  <label className="block text-cyan-300 mb-2 text-sm font-medium">Secure Channel</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-black/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/50 transition-all"
                    placeholder="your.email@stark.industries"
                  />
                </div>

                <div>
                  <label className="block text-cyan-300 mb-2 text-sm font-medium">Transmission Data</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-black/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all resize-none"
                    placeholder="Your encoded message..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={formStatus !== "idle"}
                  className={`w-full py-4 rounded-lg text-white flex items-center justify-center gap-3 transition-all relative overflow-hidden ${
                    formStatus === "idle"
                      ? "bg-gradient-to-r from-yellow-500 via-red-600 to-blue-600"
                      : formStatus === "sending"
                      ? "bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-emerald-600"
                  }`}
                  whileHover={formStatus === "idle" ? { scale: 1.02 } : {}}
                  whileTap={formStatus === "idle" ? { scale: 0.98 } : {}}
                  style={{
                    boxShadow: formStatus === "idle" 
                      ? "0 0 30px rgba(234, 179, 8, 0.4)" 
                      : formStatus === "sent"
                      ? "0 0 30px rgba(34, 197, 94, 0.4)"
                      : "none",
                  }}
                >
                  {formStatus === "idle" && (
                    <>
                      <Send className="w-5 h-5" />
                      <span className="font-medium">Deploy Transmission</span>
                    </>
                  )}
                  {formStatus === "sending" && (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Zap className="w-5 h-5" />
                      </motion.div>
                      <span>Processing...</span>
                    </>
                  )}
                  {formStatus === "sent" && <span>✓ Transmission Complete</span>}
                  
                  {formStatus === "idle" && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  )}
                </motion.button>
              </form>
            </GlassCard>
          </motion.div>

          {/* Contact Info & Social */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <GlassCard>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-400 via-cyan-400 to-blue-600 rounded-full" />
                  <h2 className="text-3xl text-white">Transmission Protocols</h2>
                </div>
                <div className="space-y-4">
                  <motion.div 
                    className="flex items-center gap-4 text-gray-300 p-3 rounded-lg bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/20"
                    whileHover={{ scale: 1.02, borderColor: "rgba(234, 179, 8, 0.4)" }}
                  >
                    <div className="p-3 bg-gradient-to-br from-yellow-500 to-red-600 rounded-lg relative">
                      <Mail className="w-5 h-5 text-white z-10 relative" />
                      <motion.div
                        className="absolute inset-0 rounded-lg"
                        animate={{
                          boxShadow: [
                            "0 0 10px rgba(234, 179, 8, 0.3)",
                            "0 0 20px rgba(234, 179, 8, 0.6)",
                            "0 0 10px rgba(234, 179, 8, 0.3)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                    <div>
                      <div className="text-sm text-yellow-400 font-medium">Primary Channel</div>
                      <div className="text-cyan-200">srikrishnasaikota@gmail.com</div>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-center gap-4 text-gray-300 p-3 rounded-lg bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20"
                    whileHover={{ scale: 1.02, borderColor: "rgba(239, 68, 68, 0.4)" }}
                  >
                    <div className="p-3 bg-gradient-to-br from-red-600 to-red-800 rounded-lg relative">
                      <Phone className="w-5 h-5 text-white z-10 relative" />
                      <motion.div
                        className="absolute inset-0 rounded-lg"
                        animate={{
                          boxShadow: [
                            "0 0 10px rgba(239, 68, 68, 0.3)",
                            "0 0 20px rgba(239, 68, 68, 0.6)",
                            "0 0 10px rgba(239, 68, 68, 0.3)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      />
                    </div>
                    <div>
                      <div className="text-sm text-red-400 font-medium">Direct Line</div>
                      <div className="text-cyan-200">+1 (813) 509-4528</div>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-center gap-4 text-gray-300 p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20"
                    whileHover={{ scale: 1.02, borderColor: "rgba(59, 130, 246, 0.4)" }}
                  >
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg relative">
                      <MapPin className="w-5 h-5 text-white z-10 relative" />
                      <motion.div
                        className="absolute inset-0 rounded-lg"
                        animate={{
                          boxShadow: [
                            "0 0 10px rgba(59, 130, 246, 0.3)",
                            "0 0 20px rgba(59, 130, 246, 0.6)",
                            "0 0 10px rgba(59, 130, 246, 0.3)",
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      />
                    </div>
                    <div>
                      <div className="text-sm text-blue-400 font-medium">Coordinates</div>
                      <div className="text-cyan-200">Tampa, FL</div>
                    </div>
                  </motion.div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <GlassCard>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 via-blue-400 to-purple-500 rounded-full" />
                  <h2 className="text-3xl text-white">Network Links</h2>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {socialLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <motion.a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-6 bg-black/50 border border-cyan-500/20 rounded-xl hover:border-cyan-400/50 transition-all group relative overflow-hidden"
                      >
                        <motion.div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{
                            background: `radial-gradient(circle at center, ${link.glowColor} 0%, transparent 70%)`,
                          }}
                        />
                        <div
                          className={`w-12 h-12 rounded-full bg-gradient-to-br ${link.color} flex items-center justify-center mb-3 mx-auto transition-all group-hover:shadow-lg relative z-10`}
                          style={{
                            boxShadow: `0 0 20px ${link.glowColor}`,
                          }}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-center text-cyan-300 text-sm group-hover:text-white transition-colors relative z-10">
                          {link.name}
                        </div>
                      </motion.a>
                    );
                  })}
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <GlassCard>
                <div className="text-center relative">
                  <motion.div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: "radial-gradient(circle at center, rgba(34, 197, 94, 0.3) 0%, transparent 70%)",
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                  />
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600/30 to-emerald-600/30 border border-green-400/40 rounded-full mb-4 relative z-10">
                    <motion.div
                      className="w-3 h-3 rounded-full bg-green-400"
                      animate={{
                        boxShadow: [
                          "0 0 10px rgba(34, 197, 94, 0.5)",
                          "0 0 20px rgba(34, 197, 94, 0.9)",
                          "0 0 10px rgba(34, 197, 94, 0.5)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-green-300 font-medium">Recruiting Protocol Active</span>
                  </div>
                  <p className="text-cyan-300 text-sm relative z-10">
                    Seeking mission-critical data engineering assignments and innovative project collaborations
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </WorldLayout>
  );
}
