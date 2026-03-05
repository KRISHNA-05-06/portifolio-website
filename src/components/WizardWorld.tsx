import { motion } from "motion/react";
import { WorldLayout } from "./WorldLayout";
import { GlassCard } from "./GlassCard";
import { BookOpen, GraduationCap, Sparkles, Award, Flame, Wand2 } from "lucide-react";
import { useEffect } from "react";
import wandImg from "figma:asset/5a99cd51f47284d0f2d32dd316d34be93815c06a.png";

// ─────────────────────────────────────────────────────────────────────────────
// Canvas-based wand trail particle system
// ─────────────────────────────────────────────────────────────────────────────

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number;
  maxLife: number;
  age: number;
  size: number;
  color: string;
  shimmerOffset: number;
}

const GOLD_PALETTE = [
  "#fbbf24", "#fcd34d", "#f59e0b",
  "#fde68a", "#fef3c7", "#ffa500", "#fff9c4",
];

const GRAVITY = 0.04;

function createWandTrailSystem() {
  const canvas = document.createElement("canvas");
  canvas.style.cssText =
    "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:99990;";
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;

  const particles: Particle[] = [];
  let rafId = 0;
  let lastTime = 0;
  let prevX = 0, prevY = 0, prevT = 0;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);

  function emit(mx: number, my: number) {
    const now = performance.now();
    const dt  = now - prevT || 16;
    const cvx = (mx - prevX) / dt;
    const cvy = (my - prevY) / dt;
    prevX = mx; prevY = my; prevT = now;

    const speed = Math.sqrt(cvx * cvx + cvy * cvy);
    if (speed < 0.05) return;

    const tipX = mx + 2;
    const tipY = my + 2;
    const count = Math.round(5 + Math.min(speed * 60, 5));

    for (let i = 0; i < count; i++) {
      const scatter = (Math.random() - 0.5) * 0.8;
      const angle   = Math.atan2(cvy, cvx) + scatter;
      const mag     = speed * 35 + Math.random() * 0.8;
      const vx = Math.cos(angle) * mag;
      const vy = Math.sin(angle) * mag - Math.random() * 0.3;
      const maxLife = 600 + Math.random() * 300;

      particles.push({
        x: tipX + (Math.random() - 0.5) * 3,
        y: tipY + (Math.random() - 0.5) * 3,
        vx, vy,
        life: 1, maxLife, age: 0,
        size: 0.8 + Math.random() * 1.6,
        color: GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)],
        shimmerOffset: Math.random() * Math.PI * 2,
      });
    }
  }

  function loop(ts: number) {
    const dt = Math.min(ts - lastTime, 32);
    lastTime = ts;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.age += dt;
      p.life = 1 - p.age / p.maxLife;
      if (p.life <= 0) { particles.splice(i, 1); continue; }

      p.vy += GRAVITY * dt;
      p.x  += p.vx * dt;
      p.y  += p.vy * dt;

      const shimmer = 0.85 + 0.15 * Math.sin(p.age * 0.025 + p.shimmerOffset);
      const alpha   = p.life * shimmer;

      ctx.save();
      ctx.globalAlpha = alpha * 0.4;
      ctx.filter = "blur(2px)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowBlur  = 6;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.restore();
    }

    rafId = requestAnimationFrame(loop);
  }

  rafId = requestAnimationFrame((ts) => { lastTime = ts; loop(ts); });

  return {
    emit,
    destroy() {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      canvas.remove();
    },
  };
}

// ── DOM-based wand trail (previous effect) ────────────────────────────────
let lastSparkTime = 0;
let lastX = 0;
let lastY = 0;

function spawnWandSparks(x: number, y: number) {
  const now = Date.now();
  if (now - lastSparkTime < 30) return;
  lastSparkTime = now;

  const vx = x - lastX;
  const vy = y - lastY;
  const speed = Math.sqrt(vx * vx + vy * vy);
  lastX = x;
  lastY = y;

  if (speed < 4) return;

  const count = Math.min(3 + Math.floor(speed / 12), 7);

  const GOLD_COLORS = [
    "#fbbf24", "#fcd34d", "#f59e0b", "#fde68a",
    "#fef3c7", "#ffa500", "#fff176",
  ];

  for (let i = 0; i < count; i++) {
    const scatter = (Math.random() - 0.5) * 1.4;
    const angle = Math.atan2(vy, vx) + scatter;
    const dist = 20 + Math.random() * 35 * (speed / 20);
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    const color = GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)];
    const size = 1 + Math.random() * 2;
    const dur = 350 + Math.random() * 300;
    const delay = i * 18;

    const spark = document.createElement("div");
    spark.style.cssText = `
      position:fixed;
      left:${x + (Math.random() - 0.5) * 6}px;
      top:${y + (Math.random() - 0.5) * 6}px;
      width:${size}px;height:${size}px;
      border-radius:50%;
      background:${color};
      box-shadow:0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color}88;
      pointer-events:none;
      z-index:99998;
      --dx:${dx}px;--dy:${dy}px;
      --sr:${Math.random() * 360}deg;
      animation:wandSpark ${dur}ms ease-out ${delay}ms forwards;
    `;
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), dur + delay + 50);

    if (Math.random() < 0.3) {
      const glint = document.createElement("div");
      glint.textContent = ["✦", "✧", "★", "·"][Math.floor(Math.random() * 4)];
      glint.style.cssText = `
        position:fixed;
        left:${x + (Math.random() - 0.5) * 10}px;
        top:${y + (Math.random() - 0.5) * 10}px;
        font-size:${5 + Math.random() * 5}px;
        color:${color};
        text-shadow:0 0 4px ${color};
        pointer-events:none;
        z-index:99999;
        line-height:1;
        animation:wandGlint ${200 + Math.random() * 250}ms ease-in-out ${delay}ms forwards;
      `;
      document.body.appendChild(glint);
      setTimeout(() => glint.remove(), 500 + delay);
    }
  }
}

// ── Spell casting effect on click ──────────────────────────────────────────
function spawnSpellEffect(x: number, y: number) {
  const SPELLS = ["✨", "⭐", "🌟", "💫", "⚡", "🔮"];
  const COLORS = ["#fbbf24", "#a78bfa", "#f472b6", "#60a5fa", "#34d399", "#fff"];

  // 1. Ring flash
  const ring = document.createElement("div");
  ring.style.cssText = `
    position:fixed;left:${x}px;top:${y}px;width:0;height:0;
    border-radius:50%;pointer-events:none;z-index:99999;
    transform:translate(-50%,-50%);
    box-shadow:0 0 0 0 rgba(167,139,250,0.9);
    animation:spellRing 0.6s ease-out forwards;
  `;
  document.body.appendChild(ring);
  setTimeout(() => ring.remove(), 700);

  // 2. Starburst particles (lines)
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const dist = 60 + Math.random() * 60;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    const color = COLORS[i % COLORS.length];

    const line = document.createElement("div");
    line.style.cssText = `
      position:fixed;left:${x}px;top:${y}px;
      width:3px;height:${10 + Math.random() * 14}px;
      background:${color};
      border-radius:2px;
      pointer-events:none;z-index:99999;
      transform-origin:top center;
      transform:translate(-50%,-50%) rotate(${(angle * 180) / Math.PI + 90}deg);
      animation:spellLine 0.55s ease-out forwards;
      --dx:${dx}px;--dy:${dy}px;
    `;
    document.body.appendChild(line);
    setTimeout(() => line.remove(), 600);
  }

  // 3. Floating emoji / orb particles
  const count = 10 + Math.floor(Math.random() * 6);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 80 + Math.random() * 120;
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed - 40;
    const emoji = SPELLS[Math.floor(Math.random() * SPELLS.length)];
    const size = 1 + Math.random() * 2;
    const delay = Math.random() * 80;

    const el = document.createElement("div");
    el.textContent = emoji;
    el.style.cssText = `
      position:fixed;left:${x}px;top:${y}px;
      font-size:${size}px;line-height:1;
      pointer-events:none;z-index:99999;
      transform:translate(-50%,-50%);
      animation:spellParticle 0.8s ease-out ${delay}ms forwards;
      --dx:${dx}px;--dy:${dy}px;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 900 + delay);
  }

  // 4. Central glow burst
  const glow = document.createElement("div");
  glow.style.cssText = `
    position:fixed;left:${x}px;top:${y}px;
    width:60px;height:60px;border-radius:50%;
    background:radial-gradient(circle,rgba(167,139,250,1) 0%,rgba(251,191,36,0.6) 40%,transparent 70%);
    pointer-events:none;z-index:99998;
    transform:translate(-50%,-50%) scale(0);
    animation:spellGlow 0.5s ease-out forwards;
  `;
  document.body.appendChild(glow);
  setTimeout(() => glow.remove(), 600);

  // 5. Spell word pops up briefly
  const words = ["Lumos!", "Expecto!", "Wingardium!", "Accio!", "Alohomora!", "Stupefy!"];
  const word = document.createElement("div");
  word.textContent = words[Math.floor(Math.random() * words.length)];
  word.style.cssText = `
    position:fixed;left:${x}px;top:${y - 30}px;
    color:#fbbf24;font-size:16px;font-style:italic;font-weight:bold;
    text-shadow:0 0 10px #fbbf24,0 0 20px #a78bfa;
    pointer-events:none;z-index:99999;white-space:nowrap;
    transform:translate(-50%,-100%);
    animation:spellWord 0.9s ease-out forwards;
    font-family:serif;letter-spacing:1px;
  `;
  document.body.appendChild(word);
  setTimeout(() => word.remove(), 1000);
}

// Inject keyframe animations once
function ensureSpellKeyframes() {
  if (document.getElementById("spell-keyframes")) return;
  const s = document.createElement("style");
  s.id = "spell-keyframes";
  s.textContent = `
    @keyframes spellRing {
      0%   { box-shadow:0 0 0 0 rgba(167,139,250,0.9); }
      100% { box-shadow:0 0 0 80px rgba(167,139,250,0); }
    }
    @keyframes spellGlow {
      0%   { transform:translate(-50%,-50%) scale(0); opacity:1; }
      60%  { transform:translate(-50%,-50%) scale(1.4); opacity:0.8; }
      100% { transform:translate(-50%,-50%) scale(2); opacity:0; }
    }
    @keyframes spellParticle {
      0%   { transform:translate(-50%,-50%) scale(1); opacity:1; }
      100% { transform:translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.3); opacity:0; }
    }
    @keyframes spellLine {
      0%   { transform:translate(-50%,-50%) rotate(var(--r,0deg)) scaleY(1); opacity:1; }
      100% { transform:translate(calc(-50% + var(--dx)/3), calc(-50% + var(--dy)/3)) rotate(var(--r,0deg)) scaleY(0.2); opacity:0; }
    }
    @keyframes spellWord {
      0%   { transform:translate(-50%,-100%) scale(0.6); opacity:0; }
      20%  { transform:translate(-50%,-130%) scale(1.1); opacity:1; }
      80%  { transform:translate(-50%,-160%) scale(1); opacity:1; }
      100% { transform:translate(-50%,-190%) scale(0.9); opacity:0; }
    }
    @keyframes wandSpark {
      0%   { transform:translate(-50%,-50%) scale(1) rotate(var(--sr,0deg)); opacity:1; }
      100% { transform:translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0) rotate(var(--sr,0deg)); opacity:0; }
    }
    @keyframes wandGlint {
      0%   { transform:translate(-50%,-50%) scale(0); opacity:1; }
      50%  { transform:translate(-50%,-50%) scale(1); opacity:0.9; }
      100% { transform:translate(-50%,-50%) scale(0); opacity:0; }
    }
  `;
  document.head.appendChild(s);
}

export function WizardWorld() {
  useEffect(() => {
    document.title = 'Sri Krishna Sai Kota | Portfolio';
  }, []);

  useEffect(() => {
    // Wand cursor setup
    const img = new Image();
    img.onload = () => {
      const SIZE = 80;
      const canvas = document.createElement("canvas");
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // The wand image has tip at top-right, handle at bottom-left.
      // Flip horizontally so the tip lands at top-left → natural cursor hotspot.
      ctx.save();
      ctx.translate(SIZE, 0);
      ctx.scale(-1, 1);

      // Scale to fill canvas while keeping aspect ratio
      const aspect = img.width / img.height;
      let drawW = SIZE;
      let drawH = SIZE / aspect;
      if (drawH > SIZE) { drawH = SIZE; drawW = SIZE * aspect; }
      const offsetX = (SIZE - drawW) / 2;
      const offsetY = (SIZE - drawH) / 2;
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
      ctx.restore();

      // Remove white / near-white background → transparent
      const imageData = ctx.getImageData(0, 0, SIZE, SIZE);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        if (r > 220 && g > 220 && b > 220) {
          data[i + 3] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);

      const dataUrl = canvas.toDataURL("image/png");
      // Hotspot at the wand tip (top-left corner after flip)
      const cursorVal = `url("${dataUrl}") 4 4, auto`;

      const styleEl = document.createElement("style");
      styleEl.id = "wand-cursor-override";
      styleEl.textContent = `*, *::before, *::after { cursor: ${cursorVal} !important; }`;
      document.head.appendChild(styleEl);
    };
    img.src = wandImg;

    // Spell casting click effect
    ensureSpellKeyframes();
    const handleClick = (e: MouseEvent) => {
      spawnSpellEffect(e.clientX, e.clientY);
    };
    window.addEventListener("click", handleClick);

    // Wand trail sparks on mouse move (DOM-based previous effect)
    const handleMove = (e: MouseEvent) => {
      spawnWandSparks(e.clientX, e.clientY);
    };
    window.addEventListener("mousemove", handleMove);

    return () => {
      document.getElementById("wand-cursor-override")?.remove();
      window.removeEventListener("click", handleClick);
      window.removeEventListener("mousemove", handleMove);
    };
  }, []);

  const skills = [
    "Python", "SQL", "Apache Spark", "Apache Kafka",
    "AWS", "Docker", "Kubernetes", "Snowflake", "BigQuery", "PostgreSQL", "Hadoop"
  ];

  return (
    <WorldLayout
      backgroundImage="https://images.unsplash.com/photo-1761116188374-73c1092b4723?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob2d3YXJ0cyUyMGxpYnJhcnklMjBkYXJrJTIwbWFnaWNhbCUyMGNhc3RsZXxlbnwxfHx8fDE3NzE5OTMwNDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      title="Hogwarts Archives"
      subtitle="Where Data Magic Comes to Life"
      gradient="from-red-400 via-amber-400 to-yellow-300"
      glowColor="rgba(220, 38, 38, 0.5)"
    >
      {/* Floating Golden Snitches and Spell Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0 
                ? "radial-gradient(circle, #fbbf24 0%, transparent 70%)" 
                : i % 3 === 1
                ? "radial-gradient(circle, #dc2626 0%, transparent 70%)"
                : "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
              boxShadow: i % 3 === 0 
                ? "0 0 15px #fbbf24" 
                : i % 3 === 1
                ? "0 0 15px #dc2626"
                : "0 0 15px #8b5cf6",
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="space-y-8">
        {/* About Section */}
        <GlassCard delay={0.2}>
          <div className="flex items-start gap-6">
            <div className="p-4 bg-gradient-to-br from-red-600 to-amber-600 rounded-xl shadow-lg shadow-red-500/50">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-4xl mb-2 text-white bg-gradient-to-r from-red-300 via-amber-300 to-yellow-300 bg-clip-text text-transparent flex items-center gap-3">
                The Prophecy Unfolds
                <span className="text-2xl">✨</span>
              </h2>
              <p className="text-gray-400 text-sm mb-6 italic">About Me • Expecto Patronum</p>
              <p className="text-gray-300 mb-4 leading-relaxed text-lg">
                Aspiring Data Engineer pursuing an <span className="text-amber-400 font-semibold">M.S. in Computer Science</span>, wielding hands-on mastery in building ETL pipelines, data ingestion workflows, and analytics-ready datasets through the arcane arts of <span className="text-amber-400 font-semibold">Python and SQL</span>. Versed in the powerful spells of <span className="text-amber-400 font-semibold">Apache Spark, Kafka,</span> and workflow orchestration with <span className="text-amber-400 font-semibold">Airflow & dbt</span> — the legendary tomes of modern data engineering.
              </p>
              <p className="text-gray-300 mb-4 leading-relaxed text-lg">
                Schooled in the cloud chambers of <span className="text-amber-400 font-semibold">AWS (S3, Glue, Redshift), BigQuery,</span> and <span className="text-amber-400 font-semibold">Snowflake</span>, conjuring reliable batch and streaming pipelines that uphold the highest standards of data quality and scalability.
              </p>
              <p className="text-gray-300 leading-relaxed text-lg">
                Seeking a challenging quest to lead high-impact data projects and contribute to <span className="text-amber-400 font-semibold">data-driven decision-making at scale</span>. <span className="text-amber-400 font-semibold">Lumos Maxima!</span> Let data light the way.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Education Section */}
        <GlassCard delay={0.4}>
          <div className="flex items-start gap-6">
            <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg shadow-blue-500/50">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-4xl mb-2 text-white bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent flex items-center gap-3">
                Hogwarts Transcripts
                <span className="text-2xl">🎓</span>
              </h2>
              <p className="text-gray-400 text-sm mb-6 italic">Education • Accio Knowledge</p>
              
              <div className="space-y-8">
                <div className="border-l-4 border-blue-500 pl-6 relative">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                  <h3 className="text-2xl text-blue-300 mb-3">Master's in Computer Science (N.E.W.T. Level)</h3>
                  <p className="text-gray-400 mb-2 text-lg">University of South Florida, Tampa | August 2024 - May 2026</p>
                  <p className="text-gray-500 italic">Advanced spellcasting in distributed systems and cloud architecture</p>
                </div>

                <div className="border-l-4 border-amber-500 pl-6 relative">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-amber-500 rounded-full shadow-lg shadow-amber-500/50"></div>
                  <h3 className="text-2xl text-amber-300 mb-3">Bachelor's in Computer Science (O.W.L. Level)</h3>
                  <p className="text-gray-400 mb-2 text-lg">R.V.R & J.C College of Engineering | August 2020 - May 2024</p>
                  <p className="text-gray-500 italic">Foundational magic in programming and data structures</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Skills Section */}
        <GlassCard delay={0.6}>
          <div className="flex items-start gap-6">
            <div className="p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg shadow-purple-500/50">
              <Wand2 className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-4xl mb-2 text-white bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent flex items-center gap-3">
                Spells & Charms Mastery
                <span className="text-2xl">⚡</span>
              </h2>
              <p className="text-gray-400 text-sm mb-6 italic">Coursework • Wingardium Leviosa</p>
              <div className="flex flex-wrap gap-4">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.03 }}
                    whileHover={{ 
                      scale: 1.08, 
                      y: -5,
                      boxShadow: "0 10px 30px rgba(168, 85, 247, 0.4)"
                    }}
                    className="px-5 py-3 bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-2 border-purple-400/40 rounded-full text-gray-200 backdrop-blur-sm hover:border-pink-400/60 transition-all cursor-default text-lg relative overflow-hidden group"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-pink-500/20 to-purple-500/0"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="relative z-10">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Certifications */}
        <GlassCard delay={0.8}>
          <div className="flex items-start gap-6">
            <div className="p-4 bg-gradient-to-br from-yellow-500 to-amber-700 rounded-xl shadow-lg shadow-yellow-500/50">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-4xl mb-2 text-white bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent flex items-center gap-3">
                House Cup Victories
                <span className="text-2xl">🏆</span>
              </h2>
              <p className="text-gray-400 text-sm mb-6 italic">Co-curricular Achievements • Riddikulus!</p>
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  className="p-6 bg-gradient-to-r from-red-900/20 to-yellow-900/20 border-2 border-red-500/30 rounded-xl hover:border-red-500/60 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 text-6xl opacity-10">🦁</div>
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="text-3xl">⚡</div>
                    <div>
                      <h3 className="text-xl text-red-300 mb-2 flex items-center gap-2">
                        Triwizard Tournament - Python Challenge
                        <span className="text-sm bg-red-500/20 px-2 py-1 rounded">3rd Place</span>
                      </h3>
                      <p className="text-gray-300">Conquered the state-level Python programming tournament with exemplary spellwork, earning recognition among the finest code wizards.</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 }}
                  className="p-6 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border-2 border-blue-500/30 rounded-xl hover:border-blue-500/60 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 text-6xl opacity-10">🦅</div>
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="text-3xl">📚</div>
                    <div>
                      <h3 className="text-xl text-blue-300 mb-2 flex items-center gap-2">
                        Order of the Algorithm Phoenix
                        <span className="text-sm bg-blue-500/20 px-2 py-1 rounded">300+ Problems</span>
                      </h3>
                      <p className="text-gray-300">Mastered 300+ enchanted algorithms on LeetCode and CodeChef, demonstrating the wit beyond measure that is Ravenclaw's greatest treasure.</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                  className="p-6 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-2 border-green-500/30 rounded-xl hover:border-green-500/60 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 text-6xl opacity-10">🐍</div>
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="text-3xl">🔮</div>
                    <div>
                      <h3 className="text-xl text-green-300 mb-2 flex items-center gap-2">
                        Chamber of Backend Secrets
                        <span className="text-sm bg-green-500/20 px-2 py-1 rounded">150+ Participants</span>
                      </h3>
                      <p className="text-gray-300">Architected the backend infrastructure and database for a grand hackathon gathering 150+ wizards from 8 magical institutions.</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </WorldLayout>
  );
}