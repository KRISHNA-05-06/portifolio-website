import { motion } from "motion/react";
import { WorldLayout } from "./WorldLayout";
import { GlassCard } from "./GlassCard";
import { Database, Workflow, Server, GitBranch, ExternalLink, Zap, X, Shield, Cpu } from "lucide-react";
import { useState, useEffect } from "react";
import swordImg from "figma:asset/304c43ff1c9207df8957ceb731e53aefcf2bde9d.png";

// ─────────────────────────────────────────────────────────────────────────────
// Cybertron sword-strike click effect
// ─────────────────────────────────────────────────────────────────────────────

function ensureCybertronKeyframes() {
  if (document.getElementById("cybertron-keyframes")) return;
  const s = document.createElement("style");
  s.id = "cybertron-keyframes";
  s.textContent = `
    @keyframes energonRing {
      0%   { transform:translate(-50%,-50%) scale(0); opacity:1; }
      100% { transform:translate(-50%,-50%) scale(1); opacity:0; }
    }
    @keyframes swordSlash {
      0%   { transform:translate(-50%,-50%) scaleX(0) rotate(var(--angle,0deg)); opacity:1; }
      40%  { transform:translate(-50%,-50%) scaleX(1) rotate(var(--angle,0deg)); opacity:1; }
      100% { transform:translate(-50%,-50%) scaleX(1) rotate(var(--angle,0deg)); opacity:0; }
    }
    @keyframes metalShard {
      0%   { transform:translate(-50%,-50%) rotate(var(--rot,0deg)) scale(1); opacity:1; }
      100% { transform:translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) rotate(calc(var(--rot,0deg) + 360deg)) scale(0); opacity:0; }
    }
    @keyframes energonSpark {
      0%   { transform:translate(-50%,-50%) scale(1); opacity:1; }
      100% { transform:translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.2); opacity:0; }
    }
    @keyframes cybertronWord {
      0%   { transform:translate(-50%,-100%) scale(0.5); opacity:0; }
      20%  { transform:translate(-50%,-120%) scale(1.15); opacity:1; }
      75%  { transform:translate(-50%,-150%) scale(1); opacity:1; }
      100% { transform:translate(-50%,-180%) scale(0.9); opacity:0; }
    }
    @keyframes circuitPulse {
      0%   { transform:translate(-50%,-50%) scale(0) rotate(0deg); opacity:0.9; }
      60%  { transform:translate(-50%,-50%) scale(1) rotate(45deg); opacity:0.6; }
      100% { transform:translate(-50%,-50%) scale(1.3) rotate(90deg); opacity:0; }
    }
    @keyframes plasmaBurst {
      0%   { transform:translate(-50%,-50%) scale(0); opacity:1; }
      50%  { transform:translate(-50%,-50%) scale(1); opacity:0.7; }
      100% { transform:translate(-50%,-50%) scale(1.8); opacity:0; }
    }
  `;
  document.head.appendChild(s);
}

function spawnSwordStrikeEffect(x: number, y: number) {
  const ENERGON_COLORS = ["#38bdf8", "#60a5fa", "#93c5fd", "#7dd3fc", "#e0f2fe"];
  const METAL_COLORS   = ["#94a3b8", "#cbd5e1", "#f1f5f9", "#64748b", "#fbbf24"];
  const CALLOUTS = ["Transform!", "Roll Out!", "Energon!", "Autobot!", "AllSpark!", "Till All Are One!"];

  // 1. Plasma burst glow at strike point
  const plasma = document.createElement("div");
  plasma.style.cssText = `
    position:fixed;left:${x}px;top:${y}px;
    width:90px;height:90px;border-radius:50%;
    background:radial-gradient(circle, rgba(56,189,248,0.95) 0%, rgba(96,165,250,0.6) 40%, transparent 70%);
    pointer-events:none;z-index:99998;
    box-shadow:0 0 40px #38bdf8, 0 0 80px #3b82f6;
    animation:plasmaBurst 0.5s ease-out forwards;
  `;
  document.body.appendChild(plasma);
  setTimeout(() => plasma.remove(), 600);

  // 2. Expanding energon rings (2 rings with slight delay)
  [0, 100].forEach((delay, ri) => {
    const ring = document.createElement("div");
    const size = 70 + ri * 40;
    ring.style.cssText = `
      position:fixed;left:${x}px;top:${y}px;
      width:${size}px;height:${size}px;
      border-radius:50%;
      border:${3 - ri}px solid ${ri === 0 ? "#38bdf8" : "#dc2626"};
      box-shadow:0 0 15px ${ri === 0 ? "#38bdf8" : "#dc2626"};
      pointer-events:none;z-index:99999;
      animation:energonRing 0.6s ease-out ${delay}ms forwards;
    `;
    document.body.appendChild(ring);
    setTimeout(() => ring.remove(), 700 + delay);
  });

  // 3. Sword slash streaks (3 directional light beams like a blade swing)
  const slashAngles = [-30, 0, 30];
  slashAngles.forEach((angleDeg, i) => {
    const slash = document.createElement("div");
    slash.style.cssText = `
      position:fixed;left:${x}px;top:${y}px;
      width:${80 + i * 20}px;height:3px;
      background:linear-gradient(to right, rgba(255,255,255,0.9), rgba(56,189,248,0.8), transparent);
      border-radius:2px;
      box-shadow:0 0 8px #38bdf8, 0 0 16px #7dd3fc;
      pointer-events:none;z-index:99999;
      transform-origin:left center;
      --angle:${angleDeg}deg;
      animation:swordSlash 0.4s ease-out ${i * 40}ms forwards;
    `;
    document.body.appendChild(slash);
    setTimeout(() => slash.remove(), 500 + i * 40);
  });

  // 4. Circuit pattern hexagon
  const circuit = document.createElement("div");
  circuit.style.cssText = `
    position:fixed;left:${x}px;top:${y}px;
    width:60px;height:60px;
    border:2px solid #38bdf8;
    clip-path:polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%);
    box-shadow:0 0 20px #38bdf8, inset 0 0 20px rgba(56,189,248,0.3);
    pointer-events:none;z-index:99997;
    animation:circuitPulse 0.7s ease-out forwards;
  `;
  document.body.appendChild(circuit);
  setTimeout(() => circuit.remove(), 800);

  // 5. Metal sparks (small rectangular shards flying outward)
  for (let i = 0; i < 14; i++) {
    const angle  = (i / 14) * Math.PI * 2 + Math.random() * 0.4;
    const dist   = 50 + Math.random() * 70;
    const dx     = Math.cos(angle) * dist;
    const dy     = Math.sin(angle) * dist;
    const isEnergon = i % 3 === 0;
    const color  = isEnergon
      ? ENERGON_COLORS[Math.floor(Math.random() * ENERGON_COLORS.length)]
      : METAL_COLORS[Math.floor(Math.random() * METAL_COLORS.length)];
    const w = isEnergon ? 2 + Math.random() * 2 : 3 + Math.random() * 5;
    const h = isEnergon ? 2 + Math.random() * 2 : 1 + Math.random() * 2;
    const dur = 400 + Math.random() * 300;

    const shard = document.createElement("div");
    shard.style.cssText = `
      position:fixed;left:${x}px;top:${y}px;
      width:${w}px;height:${h}px;
      border-radius:${isEnergon ? "50%" : "1px"};
      background:${color};
      box-shadow:0 0 ${isEnergon ? 6 : 3}px ${color};
      pointer-events:none;z-index:99999;
      --dx:${dx}px;--dy:${dy}px;
      --rot:${Math.random() * 180}deg;
      animation:${isEnergon ? "energonSpark" : "metalShard"} ${dur}ms ease-out forwards;
    `;
    document.body.appendChild(shard);
    setTimeout(() => shard.remove(), dur + 50);
  }

  // 6. Autobot/Decepticon callout text
  const callout = document.createElement("div");
  callout.textContent = CALLOUTS[Math.floor(Math.random() * CALLOUTS.length)];
  callout.style.cssText = `
    position:fixed;left:${x}px;top:${y - 20}px;
    color:#38bdf8;
    text-shadow:0 0 10px #38bdf8, 0 0 20px #3b82f6, 0 0 40px #1d4ed8;
    pointer-events:none;z-index:99999;white-space:nowrap;
    transform:translate(-50%,-100%);
    animation:cybertronWord 1s ease-out forwards;
    font-family:monospace;letter-spacing:2px;font-size:15px;
    text-transform:uppercase;
  `;
  document.body.appendChild(callout);
  setTimeout(() => callout.remove(), 1100);
}

export function MechWorld() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Sri Krishna Sai Kota | Portfolio';
  }, []);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      // Draw sword rotated 135° so blade tip points to top-left (cursor hotspot area)
      const SIZE = 72;
      const canvas = document.createElement("canvas");
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.save();
      // Translate center slightly toward bottom-right so tip lands near top-left
      ctx.translate(SIZE * 0.58, SIZE * 0.58);
      ctx.rotate((135 * Math.PI) / 180);

      const swordH = SIZE * 0.88;
      const swordW = swordH * (img.width / img.height);
      ctx.drawImage(img, -swordW / 2, -swordH / 2, swordW, swordH);
      ctx.restore();

      // Remove white / near-white background pixels → make them transparent
      const imageData = ctx.getImageData(0, 0, SIZE, SIZE);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        // If pixel is white or very light (threshold 220), set fully transparent
        if (r > 220 && g > 220 && b > 220) {
          data[i + 3] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);

      const dataUrl = canvas.toDataURL("image/png");
      // Hotspot at blade tip (~top-left quadrant after 135° rotation)
      const hotX = Math.round(SIZE * 0.16);
      const hotY = Math.round(SIZE * 0.16);
      const cursorVal = `url("${dataUrl}") ${hotX} ${hotY}, auto`;

      const styleEl = document.createElement("style");
      styleEl.id = "sword-cursor-override";
      styleEl.textContent = `*, *::before, *::after { cursor: ${cursorVal} !important; }`;
      document.head.appendChild(styleEl);
    };
    img.src = swordImg;

    // Sword strike click effect
    ensureCybertronKeyframes();
    const handleClick = (e: MouseEvent) => {
      spawnSwordStrikeEffect(e.clientX, e.clientY);
    };
    window.addEventListener("click", handleClick);

    return () => {
      document.getElementById("sword-cursor-override")?.remove();
      window.removeEventListener("click", handleClick);
    };
  }, []);

  const projects = [
    {
      title: "USF Smart Parking Data Pipeline & Optimization",
      codename: "Operation: Energon Flow",
      description: "Built an end-to-end big data pipeline to ingest and process 50K+ parking utilization records from CSV sources into a distributed HDFS-based data lake. Implemented distributed ETL using PySpark, created analytical datasets with Apache Hive, and automated orchestration via Airflow DAGs achieving 99%+ pipeline reliability.",
      tech: ["PySpark", "HDFS", "Apache Hive", "Apache Airflow", "Python", "SQL"],
      icon: Database,
      color: "from-blue-500 to-red-600",
      badge: "🔵 Autobot Protocol",
      highlights: [
        "Ingested and processed 50K+ parking utilization records from CSV into HDFS-based data lake",
        "Implemented distributed PySpark ETL pipelines — reduced invalid records by 25%",
        "Created analytical datasets using Apache Hive for SQL-based querying and reporting",
        "Generated 20+ time-series features (hour, weekday, lag-based) using Spark transformations",
        "Designed partitioned Hive tables (by timestamp & lot) — improved query performance by 35%",
        "Automated Airflow DAGs with data quality validation and logging — 99%+ pipeline reliability"
      ]
    },
    {
      title: "Real-Time Ride Demand Analytics Pipeline",
      codename: "Operation: AllSpark Stream",
      description: "Built a real-time data engineering pipeline processing 1M+ simulated ride events using Apache Kafka for streaming ingestion and Spark Structured Streaming for distributed transformations, reducing end-to-end latency by 40%. Deployed containerized services on Kubernetes for high availability and fault tolerance.",
      tech: ["Apache Kafka", "Apache Spark", "AWS S3", "Amazon Redshift", "Docker", "Kubernetes", "Apache Airflow", "Amazon CloudWatch"],
      icon: Zap,
      color: "from-red-600 to-purple-700",
      badge: "🟣 Decepticon Speed",
      highlights: [
        "Processed 1M+ simulated ride events using Apache Kafka for real-time streaming ingestion",
        "Built fault-tolerant Spark Structured Streaming pipelines with checkpointing — reduced latency by 40%",
        "Designed scalable data lake on Amazon S3 with layered raw/processed zones and partitioned storage",
        "Used Amazon Redshift as cloud data warehouse for analytics and reporting workloads",
        "Containerized streaming services with Docker and deployed scalable workloads on Kubernetes",
        "Orchestrated workflows with Apache Airflow and Amazon CloudWatch for reliable real-time availability"
      ]
    },
  ];

  return (
    <WorldLayout
      backgroundImage="https://images.unsplash.com/photo-1559861796-cc4eb7e3cf01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwcm9ib3QlMjBtYWNoaW5lcnklMjBibHVlJTIwcmVkfGVufDF8fHx8MTc3MTk5MzI5OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      title="Cybertron Data Forge"
      subtitle="Transform and Roll Out • More Than Meets The Eye"
      gradient="from-slate-400 via-blue-500 to-cyan-500"
      glowColor="rgba(100, 116, 139, 0.5)"
    >
      {/* Energon Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 
                ? "radial-gradient(circle, #3b82f6 0%, transparent 70%)" 
                : "radial-gradient(circle, #dc2626 0%, transparent 70%)",
              boxShadow: i % 2 === 0 
                ? "0 0 20px #3b82f6" 
                : "0 0 20px #dc2626",
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Cybertron HUD */}
      <div className="fixed top-32 right-8 z-0 pointer-events-none">
        <motion.div
          className="text-blue-400 font-mono text-xs space-y-2 opacity-50 border-2 border-blue-500/30 bg-black/30 backdrop-blur-sm p-4 rounded-lg"
          animate={{ 
            opacity: [0.5, 0.8, 0.5],
            borderColor: ["rgba(59, 130, 246, 0.3)", "rgba(220, 38, 38, 0.5)", "rgba(59, 130, 246, 0.3)"]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3" />
            <span>STATUS: <span className="text-green-400">ONLINE</span></span>
          </div>
          <div>ENERGON LEVELS: <span className="text-cyan-400">98%</span></div>
          <div>DATA THROUGHPUT: <span className="text-blue-400">10TB/DAY</span></div>
          <div>MISSIONS ACTIVE: <span className="text-red-400">{projects.length}</span></div>
          <div className="text-yellow-400 text-[10px] pt-2 border-t border-blue-500/30">
            ⚡ TRANSFORM AND ROLL OUT
          </div>
        </motion.div>
      </div>

      <div className="space-y-8">
        {/* Header Section */}
        <GlassCard delay={0.1}>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-blue-600 to-red-600 rounded-xl shadow-lg shadow-blue-500/50">
              <Cpu className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-4xl text-white bg-gradient-to-r from-blue-300 via-red-300 to-purple-300 bg-clip-text text-transparent">
                Mission Briefing
              </h2>
              <p className="text-gray-400 italic">More Than Meets The Eye</p>
            </div>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed">
            Welcome to Cybertron's Data Forge, where raw data transforms into powerful intelligence through 
            the ancient art of pipeline engineering. Like the <span className="text-blue-400 font-semibold">Autobots</span> and{" "}
            <span className="text-purple-400 font-semibold">Decepticons</span> wielding the power of the{" "}
            <span className="text-cyan-400 font-semibold">AllSpark</span>, these projects harness distributed systems, 
            real-time streaming, and machine learning to process millions of data points with precision and scale.{" "}
            <span className="text-yellow-400 font-semibold">Transform and roll out!</span>
          </p>
        </GlassCard>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
              >
                <GlassCard className="h-full group hover:bg-black/40 cursor-pointer relative overflow-hidden">
                  {/* Autobot/Decepticon Badge */}
                  <div className="absolute top-4 right-4 text-2xl opacity-20 group-hover:opacity-40 transition-opacity">
                    {index === 0 ? "🤖" : "⚡"}
                  </div>

                  <div className="flex flex-col h-full">
                    {/* Badge */}
                    <div className="mb-3">
                      <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-red-500/20 border border-blue-400/30 text-blue-300">
                        {project.badge}
                      </span>
                    </div>

                    {/* Icon Header */}
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`p-3 bg-gradient-to-br ${project.color} rounded-lg relative`}
                        style={{
                          boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)",
                        }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                        <motion.div
                          className="absolute inset-0 rounded-lg border-2 border-white/50"
                          animate={{
                            opacity: [0, 0.5, 0],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="text-xl text-white group-hover:text-blue-300 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-400 italic">{project.codename}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 mb-4 flex-1">{project.description}</p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-gradient-to-r from-slate-950/50 to-blue-950/50 border border-blue-500/30 rounded-md text-blue-300 text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setSelectedProject(index)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-red-600/20 border border-blue-500/50 rounded-lg text-blue-300 text-sm hover:bg-blue-600/30 transition-all hover:scale-105"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Deploy Mission
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Technical Arsenal */}
        <GlassCard delay={0.8}>
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-blue-400" />
            <h2 className="text-3xl text-white bg-gradient-to-r from-blue-300 to-red-300 bg-clip-text text-transparent">
              Cybertronian Arsenal
            </h2>
          </div>
          <p className="text-gray-400 mb-6 italic">// Weapons and Tools of the Data Wars</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="text-blue-300 text-lg flex items-center gap-2">
                <span className="text-2xl">🔵</span>
                Data Ingestion & Processing
              </h3>
              <div className="space-y-2 text-gray-300 text-sm">
                {[
                  { name: "Apache Kafka", pct: "95%" },
                  { name: "Apache Spark / PySpark", pct: "93%" },
                  { name: "Apache Hive", pct: "88%" },
                  { name: "HDFS", pct: "85%" },
                ].map((item, i) => (
                  <div key={item.name} className="flex justify-between items-center">
                    <span>{item.name}</span>
                    <div className="flex-1 mx-3 h-1 bg-slate-900/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        initial={{ width: 0 }}
                        animate={{ width: item.pct }}
                        transition={{ delay: 1 + i * 0.1, duration: 1 }}
                      />
                    </div>
                    <span className="text-xs text-blue-400">{item.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-red-300 text-lg flex items-center gap-2">
                <span className="text-2xl">🔴</span>
                Storage & Warehousing
              </h3>
              <div className="space-y-2 text-gray-300 text-sm">
                {[
                  { name: "Amazon S3", pct: "92%" },
                  { name: "Amazon Redshift", pct: "88%" },
                  { name: "Python", pct: "95%" },
                  { name: "SQL", pct: "90%" },
                ].map((item, i) => (
                  <div key={item.name} className="flex justify-between items-center">
                    <span>{item.name}</span>
                    <div className="flex-1 mx-3 h-1 bg-red-900/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-red-500 to-pink-500"
                        initial={{ width: 0 }}
                        animate={{ width: item.pct }}
                        transition={{ delay: 1.3 + i * 0.1, duration: 1 }}
                      />
                    </div>
                    <span className="text-xs text-red-400">{item.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-purple-300 text-lg flex items-center gap-2">
                <span className="text-2xl">🟣</span>
                Orchestration & DevOps
              </h3>
              <div className="space-y-2 text-gray-300 text-sm">
                {[
                  { name: "Apache Airflow", pct: "90%" },
                  { name: "Docker", pct: "87%" },
                  { name: "Kubernetes", pct: "85%" },
                  { name: "Amazon CloudWatch", pct: "82%" },
                ].map((item, i) => (
                  <div key={item.name} className="flex justify-between items-center">
                    <span>{item.name}</span>
                    <div className="flex-1 mx-3 h-1 bg-purple-900/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        initial={{ width: 0 }}
                        animate={{ width: item.pct }}
                        transition={{ delay: 1.6 + i * 0.1, duration: 1 }}
                      />
                    </div>
                    <span className="text-xs text-purple-400">{item.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AllSpark Quote */}
          <motion.div
            className="mt-8 p-4 bg-gradient-to-r from-blue-950/30 to-purple-950/30 border-l-4 border-cyan-500 rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
          >
            <p className="text-cyan-300 italic text-sm">
              "Before time began, there was the Cube. We know not where it comes from, only that it holds the power 
              to create worlds and fill them with life. That is how our race was born."
            </p>
            <p className="text-gray-500 text-xs mt-2">— Optimus Prime, on the AllSpark</p>
          </motion.div>
        </GlassCard>
      </div>

      {/* Project Details Modal */}
      {selectedProject !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <GlassCard className="relative">
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-300" />
              </button>

              {/* Project Header */}
              <div className="flex items-start gap-4 mb-6 pr-12">
                <div
                  className={`p-3 bg-gradient-to-br ${projects[selectedProject].color} rounded-lg flex-shrink-0 relative`}
                  style={{
                    boxShadow: "0 10px 30px rgba(59, 130, 246, 0.5)",
                  }}
                >
                  {(() => {
                    const Icon = projects[selectedProject].icon;
                    return <Icon className="w-8 h-8 text-white" />;
                  })()}
                  <motion.div
                    className="absolute inset-0 rounded-lg border-2 border-white/50"
                    animate={{
                      opacity: [0, 0.8, 0],
                      scale: [1, 1.3, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                </div>
                <div>
                  <div className="text-xs text-blue-400 mb-1">{projects[selectedProject].badge}</div>
                  <h2 className="text-2xl text-white mb-1">
                    {projects[selectedProject].title}
                  </h2>
                  <p className="text-sm text-purple-400 italic mb-2">{projects[selectedProject].codename}</p>
                  <p className="text-gray-300">
                    {projects[selectedProject].description}
                  </p>
                </div>
              </div>

              {/* Key Highlights */}
              <div className="mb-6">
                <h3 className="text-xl text-blue-300 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Mission Achievements
                </h3>
                <ul className="space-y-3">
                  {projects[selectedProject].highlights.map((highlight, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 text-gray-300"
                    >
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                      <span>{highlight}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack */}
              <div>
                <h3 className="text-xl text-red-300 mb-4">Arsenal Deployed</h3>
                <div className="flex flex-wrap gap-2">
                  {projects[selectedProject].tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-4 py-2 bg-gradient-to-r from-slate-950/50 to-blue-950/50 border border-blue-500/30 rounded-lg text-blue-300 text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Transform Quote */}
              <motion.div
                className="mt-6 p-4 bg-gradient-to-r from-blue-600/10 to-red-600/10 border border-blue-500/30 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-yellow-300 font-semibold text-center">
                  ⚡ MISSION STATUS: COMPLETE ⚡
                </p>
              </motion.div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </WorldLayout>
  );
}