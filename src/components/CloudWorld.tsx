import { motion } from "motion/react";
import { WorldLayout } from "./WorldLayout";
import { GlassCard } from "./GlassCard";
import { Briefcase, Calendar, MapPin, TrendingUp, Skull as SkullIcon, Code, Database, Cloud, Wrench } from "lucide-react";
import { useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Kong Gorilla Fist cursor (canvas-drawn)
// ─────────────────────────────────────────────────────────────────────────────

function buildKongFistCursor(): string {
  const SIZE = 56;
  const c = document.createElement("canvas");
  c.width = SIZE; c.height = SIZE;
  const ctx = c.getContext("2d")!;

  // palm
  const palmX = 10, palmY = 22, palmW = 34, palmH = 28;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(palmX, palmY, palmW, palmH, 8);
  const pg = ctx.createLinearGradient(palmX, palmY, palmX + palmW, palmY + palmH);
  pg.addColorStop(0, "#5c3317"); pg.addColorStop(0.5, "#3d1f0a"); pg.addColorStop(1, "#1a0a02");
  ctx.fillStyle = pg; ctx.fill();
  ctx.strokeStyle = "#7a4520"; ctx.lineWidth = 1.2; ctx.stroke();
  ctx.restore();

  // four fingers
  [11, 19, 27, 35].forEach((fx) => {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(fx, 8, 7, 16, 4);
    const fg = ctx.createLinearGradient(fx, 8, fx + 7, 24);
    fg.addColorStop(0, "#6b3d1e"); fg.addColorStop(1, "#3d1f0a");
    ctx.fillStyle = fg; ctx.fill();
    ctx.strokeStyle = "#8a5228"; ctx.lineWidth = 1; ctx.stroke();
    ctx.restore();
    // knuckle
    ctx.save();
    ctx.beginPath();
    ctx.arc(fx + 3.5, 20, 3, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,180,80,0.28)"; ctx.fill();
    ctx.restore();
  });

  // thumb
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(4, 30, 9, 15, 5);
  const tg = ctx.createLinearGradient(4, 30, 13, 45);
  tg.addColorStop(0, "#6b3d1e"); tg.addColorStop(1, "#2e1306");
  ctx.fillStyle = tg; ctx.fill();
  ctx.strokeStyle = "#8a5228"; ctx.lineWidth = 1; ctx.stroke();
  ctx.restore();

  // fur lines
  ctx.save();
  ctx.strokeStyle = "rgba(255,140,50,0.18)"; ctx.lineWidth = 0.8;
  [[14,28,14,46],[22,28,22,46],[30,28,30,46],[38,28,38,46]].forEach(([x1,y1,x2,y2]) => {
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  });
  ctx.restore();

  // amber glow ring
  ctx.save();
  ctx.shadowBlur = 12; ctx.shadowColor = "#f59e0b";
  ctx.strokeStyle = "rgba(245,158,11,0.6)"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.roundRect(palmX, palmY, palmW, palmH, 8); ctx.stroke();
  ctx.restore();

  return c.toDataURL("image/png");
}

// ─────────────────────────────────────────────────────────────────────────────
// Kong Ground-Pound click effect
// ─────────────────────────────────────────────────────────────────────────────

function ensureKongKeyframes() {
  if (document.getElementById("kong-keyframes")) return;
  const s = document.createElement("style");
  s.id = "kong-keyframes";
  s.textContent = `
    @keyframes kongShockwave {
      0%   { transform:translate(-50%,-50%) scale(0); opacity:0.9; }
      100% { transform:translate(-50%,-50%) scale(1); opacity:0; }
    }
    @keyframes kongBoulder {
      0%   { transform:translate(-50%,-50%) rotate(0deg) scale(1); opacity:1; }
      100% { transform:translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) rotate(var(--spin)) scale(0.3); opacity:0; }
    }
    @keyframes kongLeaf {
      0%   { transform:translate(-50%,-50%) rotate(var(--r0)) scale(1); opacity:0.95; }
      60%  { opacity:0.8; }
      100% { transform:translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) rotate(var(--r1)) scale(0.4); opacity:0; }
    }
    @keyframes kongVine {
      0%   { transform:translate(-50%,-50%) scaleX(0) rotate(var(--ang)); opacity:1; transform-origin:left center; }
      50%  { transform:translate(-50%,-50%) scaleX(1) rotate(var(--ang)); opacity:0.9; transform-origin:left center; }
      100% { transform:translate(-50%,-50%) scaleX(1) rotate(var(--ang)); opacity:0; transform-origin:left center; }
    }
    @keyframes kongRoar {
      0%   { transform:translate(-50%,-120%) scale(0.4); opacity:0; }
      25%  { transform:translate(-50%,-140%) scale(1.2); opacity:1; }
      80%  { transform:translate(-50%,-175%) scale(1); opacity:1; }
      100% { transform:translate(-50%,-205%) scale(0.85); opacity:0; }
    }
    @keyframes kongDust {
      0%   { transform:translate(-50%,-50%) scale(0); opacity:0.55; }
      60%  { opacity:0.25; }
      100% { transform:translate(-50%,-50%) scale(1); opacity:0; }
    }
    @keyframes kongImpact {
      0%   { transform:translate(-50%,-50%) scale(0); opacity:1; }
      40%  { transform:translate(-50%,-50%) scale(1.1); opacity:0.9; }
      100% { transform:translate(-50%,-50%) scale(1.5); opacity:0; }
    }
  `;
  document.head.appendChild(s);
}

function spawnKongGroundPound(x: number, y: number) {
  const ROARS = ["ROAR!", "KONG!", "Skull Island!", "I Am Kong!", "Ground Pound!", "King of the Island!"];
  const DIRT  = ["#92400e","#78350f","#b45309","#a16207","#d97706","#c9a34a"];
  const LEAF_EMOJIS = ["🌿","🍃","🌱","🍀"];

  // 1. Impact flash
  const flash = document.createElement("div");
  flash.style.cssText = `
    position:fixed;left:${x}px;top:${y}px;
    width:80px;height:80px;border-radius:50%;
    background:radial-gradient(circle, rgba(245,158,11,0.9) 0%, rgba(34,197,94,0.55) 45%, transparent 70%);
    box-shadow:0 0 40px #f59e0b, 0 0 80px #16a34a;
    pointer-events:none;z-index:99998;
    animation:kongImpact 0.45s ease-out forwards;
  `;
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 550);

  // 2. Three concentric shockwave rings
  [0, 80, 170].forEach((delay, ri) => {
    const ring = document.createElement("div");
    const sz = 70 + ri * 55;
    const clr = ["#f59e0b","#22c55e","#a16207"][ri];
    ring.style.cssText = `
      position:fixed;left:${x}px;top:${y}px;
      width:${sz}px;height:${sz}px;border-radius:50%;
      border:${3-ri}px solid ${clr};
      box-shadow:0 0 18px ${clr};
      pointer-events:none;z-index:99999;
      animation:kongShockwave 0.7s ease-out ${delay}ms forwards;
    `;
    document.body.appendChild(ring);
    setTimeout(() => ring.remove(), 820+delay);
  });

  // 3. Wide dust cloud
  const dust = document.createElement("div");
  dust.style.cssText = `
    position:fixed;left:${x}px;top:${y+10}px;
    width:170px;height:65px;border-radius:50%;
    background:radial-gradient(ellipse, rgba(180,130,40,0.55) 0%, rgba(120,80,20,0.25) 50%, transparent 75%);
    pointer-events:none;z-index:99997;
    animation:kongDust 0.9s ease-out forwards;
  `;
  document.body.appendChild(dust);
  setTimeout(() => dust.remove(), 1000);

  // 4. Boulders / dirt chunks
  for (let i = 0; i < 14; i++) {
    const angle = (i/14)*Math.PI*2 + Math.random()*0.5;
    const dist  = 55 + Math.random()*80;
    const dx    = Math.cos(angle)*dist, dy = Math.sin(angle)*dist;
    const isDirt = i%3!==0;
    const color  = isDirt ? DIRT[Math.floor(Math.random()*DIRT.length)] : "#78350f";
    const w = isDirt ? 3+Math.random()*6 : 8+Math.random()*9;
    const h = isDirt ? 3+Math.random()*4 : 6+Math.random()*7;
    const dur = 450+Math.random()*300;

    const chunk = document.createElement("div");
    chunk.style.cssText = `
      position:fixed;left:${x}px;top:${y}px;
      width:${w}px;height:${h}px;
      border-radius:${isDirt?"50%":"3px"};
      background:${color};
      box-shadow:0 0 ${isDirt?4:6}px ${color};
      pointer-events:none;z-index:99999;
      --dx:${dx}px;--dy:${dy}px;
      --spin:${Math.random()*720-360}deg;
      animation:kongBoulder ${dur}ms ease-out forwards;
    `;
    document.body.appendChild(chunk);
    setTimeout(() => chunk.remove(), dur+60);
  }

  // 5. Jungle leaf bursts
  for (let i = 0; i < 9; i++) {
    const angle = (i/9)*Math.PI*2 + Math.random()*0.6;
    const dist  = 50+Math.random()*75;
    const dx    = Math.cos(angle)*dist, dy = Math.sin(angle)*dist;
    const dur   = 600+Math.random()*350;
    const r0    = Math.random()*360, r1 = r0+(Math.random()>0.5?180:-180);
    const leaf  = document.createElement("div");
    leaf.textContent = LEAF_EMOJIS[Math.floor(Math.random()*LEAF_EMOJIS.length)];
    leaf.style.cssText = `
      position:fixed;left:${x+(Math.random()-0.5)*10}px;top:${y+(Math.random()-0.5)*10}px;
      font-size:${12+Math.random()*10}px;line-height:1;
      pointer-events:none;z-index:99999;
      --dx:${dx}px;--dy:${dy}px;
      --r0:${r0}deg;--r1:${r1}deg;
      animation:kongLeaf ${dur}ms ease-out forwards;
    `;
    document.body.appendChild(leaf);
    setTimeout(() => leaf.remove(), dur+60);
  }

  // 6. Vine whip streaks (green light beams like vines slashing)
  [-45, 0, 45].forEach((angDeg, i) => {
    const vine = document.createElement("div");
    vine.style.cssText = `
      position:fixed;left:${x}px;top:${y}px;
      width:${75+i*15}px;height:3px;
      background:linear-gradient(to right, rgba(34,197,94,0.95), rgba(21,128,61,0.7), transparent);
      border-radius:2px;
      box-shadow:0 0 8px #22c55e, 0 0 16px #16a34a88;
      pointer-events:none;z-index:99999;
      --ang:${angDeg}deg;
      animation:kongVine 0.5s ease-out ${i*55}ms forwards;
    `;
    document.body.appendChild(vine);
    setTimeout(() => vine.remove(), 620+i*55);
  });

  // 7. Roar callout
  const roar = document.createElement("div");
  roar.textContent = ROARS[Math.floor(Math.random()*ROARS.length)];
  roar.style.cssText = `
    position:fixed;left:${x}px;top:${y}px;
    color:#f59e0b;
    text-shadow:0 0 12px #f59e0b, 0 0 24px #d97706, 0 0 50px #92400e;
    pointer-events:none;z-index:99999;white-space:nowrap;
    transform:translate(-50%,-120%);
    animation:kongRoar 1.1s ease-out forwards;
    font-family:Georgia,serif;letter-spacing:3px;font-size:17px;
    text-transform:uppercase;
  `;
  document.body.appendChild(roar);
  setTimeout(() => roar.remove(), 1200);
}

export function CloudWorld() {
  useEffect(() => {
    document.title = 'Sri Krishna Sai Kota | Portfolio';
  }, []);

  // ── Kong fist cursor + ground-pound click effect ─────────────────────────
  useEffect(() => {
    ensureKongKeyframes();

    // Build cursor from canvas
    const dataUrl = buildKongFistCursor();
    // Hotspot = top-center of the fist (middle finger knuckle area)
    const HOT_X = 28, HOT_Y = 8;
    const cursorVal = `url("${dataUrl}") ${HOT_X} ${HOT_Y}, pointer`;

    const styleEl = document.createElement("style");
    styleEl.id = "kong-cursor-override";
    styleEl.textContent = `*, *::before, *::after { cursor: ${cursorVal} !important; }`;
    document.head.appendChild(styleEl);

    const handleClick = (e: MouseEvent) => {
      spawnKongGroundPound(e.clientX, e.clientY);
    };
    window.addEventListener("click", handleClick);

    return () => {
      document.getElementById("kong-cursor-override")?.remove();
      window.removeEventListener("click", handleClick);
    };
  }, []);

  const skillCategories = [
    {
      title: "Languages",
      skills: ["Python", "SQL", "Scala"],
      icon: Code,
      color: "from-orange-600 to-red-700",
    },
    {
      title: "Data Pipelines",
      skills: ["AWS Glue", "AWS EMR", "Databricks", "Apache Kafka"],
      icon: Database,
      color: "from-red-600 to-orange-700",
    },
    {
      title: "Orchestration",
      skills: ["Apache Airflow", "dbt"],
      icon: Wrench,
      color: "from-orange-700 to-gray-700",
    },
    {
      title: "Data Processing",
      skills: ["Apache Spark", "Hadoop"],
      icon: Wrench,
      color: "from-red-700 to-gray-800",
    },
    {
      title: "Cloud & Warehousing",
      skills: ["AWS Redshift", "AWS S3", "GCP BigQuery", "Snowflake", "Hive"],
      icon: Cloud,
      color: "from-orange-600 to-gray-700",
    },
    {
      title: "Databases",
      skills: ["PostgreSQL", "MySQL", "MongoDB", "Oracle", "HDFS"],
      icon: Database,
      color: "from-red-600 to-gray-600",
    },
    {
      title: "Data Architecture",
      skills: ["Data Modeling", "Data Lakes", "Data Warehouses", "Streaming & Batch Processing"],
      icon: Database,
      color: "from-orange-700 to-gray-800",
    },
    {
      title: "DevOps & Tools",
      skills: ["Docker", "Git", "Kubernetes", "Jenkins"],
      icon: Wrench,
      color: "from-red-600 to-orange-600",
    },
    {
      title: "Monitoring",
      skills: ["AWS CloudWatch", "Grafana"],
      icon: TrendingUp,
      color: "from-orange-600 to-red-700",
    },
  ];

  const experiences = [
    {
      role: "Data Engineering Intern",
      company: "Magnum Wings",
      location: "Onsite",
      period: "May 2023 - June 2024",
      description: [
        "Implemented idempotent real-time data ingestion workflows to capture UAV telemetry and geolocation data using REST APIs and WebSockets, processing 10K+ data points/day.",
        "Designed scalable streaming data pipelines to process and synchronize flight data, improving system responsiveness by 35% and reducing latency by 25%.",
        "Integrated Google Maps geospatial APIs for real-time tracking and analytics, enabling accurate location updates with sub-second refresh rates.",
        "Optimized backend data flow and API performance through asynchronous processing and efficient request handling, increasing throughput by 30%.",
        "Collaborated in an Agile environment using Git/GitHub for pipeline versioning and CI/CD workflows, improving deployment stability and reducing integration issues by 20%.",
      ],
      color: "from-orange-600 to-red-700",
    },
    {
      role: "Web Development Intern",
      company: "Prospect Infosystem Inc.",
      location: "Onsite",
      period: "May 2022 - July 2022",
      description: [
        "Developed and maintained a dynamic company website using HTML, CSS, JavaScript, PHP, and MySQL, ensuring responsive UI and reliable backend data handling.",
        "Structured and tuned MySQL database queries for storing and retrieving user and transactional data, improving data access efficiency by 30%.",
        "Implemented backend form processing and PHP mail services with data validation, enabling structured data capture and improving communication workflows by 25%.",
        "Analyzed user interaction and traffic data to support website improvements, contributing to a 50% increase in traffic and 35% boost in engagement.",
      ],
      color: "from-red-700 to-gray-700",
    },
  ];

  return (
    <WorldLayout
      backgroundImage="https://images.unsplash.com/photo-1612763294279-341b0c8af538?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwc3Rvcm0lMjBjbGlmZiUyMG9jZWFufGVufDF8fHx8MTc3MDkxNjA2OXww&ixlib=rb-4.1.0&q=80&w=1080"
      title="Kong Skill Island"
      subtitle="Experience & Professional Arsenal"
      gradient="from-orange-400 via-red-600 to-gray-700"
      glowColor="rgba(249, 115, 22, 0.6)"
    >
      {/* Storm Effect with Lightning */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-red-950/30 to-black/60"
          animate={{
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      {/* Lightning Strikes */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`lightning-${i}`}
          className="fixed w-1 bg-gradient-to-b from-orange-300 via-red-400 to-transparent pointer-events-none z-0"
          style={{
            left: `${20 + i * 30}%`,
            top: 0,
            height: "40%",
            filter: "blur(2px)",
          }}
          animate={{
            opacity: [0, 1, 0],
            scaleY: [0, 1, 0],
          }}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            repeatDelay: Math.random() * 8 + 4,
            delay: i * 2,
          }}
        />
      ))}

      {/* Thunder Flash */}
      <motion.div
        className="fixed inset-0 bg-red-100 pointer-events-none z-0"
        animate={{
          opacity: [0, 0.15, 0],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatDelay: 6,
        }}
      />

      {/* Rain Effect */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={`rain-${i}`}
            className="absolute w-px bg-gradient-to-b from-gray-400 to-transparent"
            style={{
              left: `${Math.random() * 100}%`,
              height: `${Math.random() * 30 + 20}px`,
            }}
            initial={{
              y: -50,
              opacity: 0.3,
            }}
            animate={{
              y: window.innerHeight + 50,
              opacity: [0.3, 0.6, 0],
            }}
            transition={{
              duration: Math.random() * 0.5 + 0.5,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="space-y-8">
        {/* Welcome Header */}
        <GlassCard delay={0.1}>
          <div className="flex items-center gap-4 mb-4">
            <motion.div 
              className="p-4 bg-gradient-to-br from-orange-600 to-red-700 rounded-xl shadow-lg relative"
              animate={{
                boxShadow: [
                  "0 0 30px rgba(249, 115, 22, 0.5)",
                  "0 0 50px rgba(239, 68, 68, 0.8)",
                  "0 0 30px rgba(249, 115, 22, 0.5)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <SkullIcon className="w-10 h-10 text-white" />
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <div>
              <h2 className="text-4xl text-white bg-gradient-to-r from-orange-300 via-red-300 to-gray-300 bg-clip-text text-transparent">
                Survival Arsenal
              </h2>
              <p className="text-gray-400 italic">Where Skills Weather the Storm</p>
            </div>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed">
            Welcome to <span className="text-orange-400 font-semibold">Kong Skill Island</span>, where expertise is 
            forged in the storm. Like the legendary titan who rules this untamed realm, these skills have been 
            battle-tested and refined through <span className="text-red-400 font-semibold">real-world challenges</span>.
          </p>
        </GlassCard>

        {/* Skills Section */}
        <GlassCard delay={0.2}>
          <div className="flex items-start gap-6 mb-8">
            <motion.div 
              className="p-4 bg-gradient-to-br from-red-600 to-gray-800 rounded-xl relative"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(239, 68, 68, 0.5)",
                  "0 0 40px rgba(249, 115, 22, 0.8)",
                  "0 0 20px rgba(239, 68, 68, 0.5)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Code className="w-8 h-8 text-white" />
              <motion.div
                className="absolute inset-0 rounded-xl border-2 border-orange-500"
                animate={{
                  opacity: [0, 0.5, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <div className="flex-1">
              <h2 className="text-4xl mb-4 text-white bg-gradient-to-r from-red-300 to-orange-300 bg-clip-text text-transparent">
                Technical Arsenal
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                Weathered through countless storms and proven in production environments—a comprehensive 
                toolkit built for scalability, reliability, and performance.
              </p>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skillCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                  className="bg-black/40 border-2 border-orange-500/30 rounded-xl p-6 hover:border-red-500/60 transition-all hover:bg-black/50 relative overflow-hidden group"
                >
                  {/* Lightning Effect */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent"
                    animate={{
                      opacity: [0, 0.8, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                  />

                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 bg-gradient-to-br ${category.color} rounded-lg relative`}>
                      <Icon className="w-5 h-5 text-white" />
                      <motion.div
                        className="absolute inset-0 rounded-lg bg-white/20"
                        animate={{
                          opacity: [0, 0.5, 0],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.3,
                        }}
                      />
                    </div>
                    <h3 className="text-xl text-orange-300 group-hover:text-red-300 transition-colors">{category.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 + skillIndex * 0.05 }}
                        className="px-3 py-1 bg-red-900/20 border border-orange-500/40 rounded-md text-gray-300 text-sm hover:bg-orange-900/40 hover:border-red-500/60 hover:text-orange-300 transition-all"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>

        {/* Experience Section Header */}
        <GlassCard delay={0.8}>
          <div className="flex items-start gap-6">
            <motion.div 
              className="p-4 bg-gradient-to-br from-orange-600 to-gray-800 rounded-xl"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(234, 88, 12, 0.5)",
                  "0 0 40px rgba(234, 88, 12, 0.8)",
                  "0 0 20px rgba(234, 88, 12, 0.5)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Briefcase className="w-8 h-8 text-white" />
            </motion.div>
            <div className="flex-1">
              <h2 className="text-4xl mb-4 text-white bg-gradient-to-r from-orange-300 to-gray-300 bg-clip-text text-transparent">
                Island Expeditions
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                Professional journeys through uncharted territories, where challenges were conquered 
                and new frontiers of data engineering were discovered.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Experience Timeline */}
        <div className="relative">
          {/* Timeline Path */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-600 via-red-600 to-gray-800 opacity-50" />

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.role}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.3, duration: 0.8 }}
              className="relative mb-12 last:mb-0"
            >
              {/* Timeline Marker */}
              <motion.div
                className="absolute left-5 top-8 w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-red-600 border-4 border-black z-10"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 + index * 0.3, type: "spring", stiffness: 200 }}
                style={{
                  boxShadow: "0 0 30px rgba(249, 115, 22, 0.8)",
                }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-orange-400"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </motion.div>

              <div className="ml-24">
                <GlassCard className="hover:bg-black/50 transition-all group">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                    <div>
                      <motion.h3 
                        className="text-3xl text-white mb-2 group-hover:text-orange-300 transition-colors"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.3 }}
                      >
                        {exp.role}
                      </motion.h3>
                      <p className="text-2xl text-orange-300 mb-2">{exp.company}</p>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-3">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-5 h-5" />
                        <span className="text-lg">{exp.period}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin className="w-5 h-5" />
                        <span className="text-lg">{exp.location}</span>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-3 text-gray-300">
                    {exp.description.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + index * 0.3 + i * 0.1 }}
                        className="flex items-start gap-4 text-lg"
                      >
                        <motion.div
                          className={`mt-2 w-3 h-3 rounded-full bg-gradient-to-br ${exp.color} flex-shrink-0`}
                          animate={{
                            boxShadow: [
                              "0 0 5px rgba(249, 115, 22, 0.5)",
                              "0 0 15px rgba(249, 115, 22, 0.8)",
                              "0 0 5px rgba(249, 115, 22, 0.5)",
                            ],
                          }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                        />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </GlassCard>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Storm Warning */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <GlassCard className="border-2 border-orange-500/30">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-red-600 to-gray-800 rounded-lg">
                <SkullIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl text-orange-300 mb-2">⚠️ Island Protocol</h3>
                <p className="text-gray-300 italic leading-relaxed">
                  "This island doesn't just test your technical skills—it forges them. In the eye of the storm, 
                  when systems fail and data floods in, that's when true engineering excellence emerges. 
                  Like the titan who rules these cliffs, adapt, survive, and dominate."
                </p>
                <p className="text-gray-500 text-sm mt-3">— Monarch Field Operations Manual</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </WorldLayout>
  );
}