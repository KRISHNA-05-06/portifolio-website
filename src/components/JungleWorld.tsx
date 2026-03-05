import { motion, AnimatePresence } from "motion/react";
import { WorldLayout } from "./WorldLayout";
import { GlassCard } from "./GlassCard";
import { Award, CheckCircle, Clock, Shield, Dna, Zap, TreePine, AlertTriangle, X, ChevronDown, ExternalLink } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import certImage from "figma:asset/6196dafc9cdc5532bf004813e77051e620a67775.png";
import algoCertImage from "figma:asset/6f9cccfabaf38d676af45c1d1de272e061f2a848.png";
import cmdGitCertImage from "figma:asset/c0ec374e1f2b7144d069866e09b4f56a575f7d75.png";
import sqlCertImage from "figma:asset/6db1588f9e14db40b9b6d2c478e1b53134049d80.png";
import prodDbCertImage from "figma:asset/9a2b51a4099184d7f5173be7d74bbf3fe61579e6.png";

// ─────────────────────────────────────────────────────────────────────────────
// DNA Syringe cursor (canvas-drawn, animated bubble)
// ─────────────────────────────────────────────────────────────────────────────

function buildSyringeCursor(bubblePhase: number): string {
  const W = 52, H = 52;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;

  // needle tip pointing top-left
  ctx.save();
  ctx.strokeStyle = "#86efac"; ctx.lineWidth = 1.8;
  ctx.shadowBlur = 6; ctx.shadowColor = "#4ade80";
  ctx.beginPath(); ctx.moveTo(4, 4); ctx.lineTo(16, 16); ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 0.7;
  ctx.beginPath(); ctx.moveTo(5, 3); ctx.lineTo(14, 12); ctx.stroke();
  ctx.restore();

  // barrel body (rotated -45°, centred at 28,28)
  ctx.save();
  ctx.translate(28, 28); ctx.rotate(-Math.PI / 4);

  const barrelGrad = ctx.createLinearGradient(-6, -14, 6, -14);
  barrelGrad.addColorStop(0, "rgba(30,60,30,0.85)");
  barrelGrad.addColorStop(0.5, "rgba(60,120,60,0.9)");
  barrelGrad.addColorStop(1, "rgba(20,50,20,0.85)");
  ctx.beginPath(); ctx.roundRect(-6, -14, 12, 26, 3);
  ctx.fillStyle = barrelGrad; ctx.fill();
  ctx.strokeStyle = "#4ade80"; ctx.lineWidth = 1.2;
  ctx.shadowBlur = 8; ctx.shadowColor = "#22c55e"; ctx.stroke();

  // liquid fill with animated level
  const liquidH = 18 + Math.sin(bubblePhase) * 1.5;
  const liquidGrad = ctx.createLinearGradient(-5, -13 + (26 - liquidH), 5, 12);
  liquidGrad.addColorStop(0, "rgba(74,222,128,0.55)");
  liquidGrad.addColorStop(0.5, "rgba(34,197,94,0.8)");
  liquidGrad.addColorStop(1, "rgba(21,128,61,0.9)");
  ctx.save();
  ctx.beginPath(); ctx.roundRect(-5, -13 + (26 - liquidH), 10, liquidH, 2);
  ctx.fillStyle = liquidGrad; ctx.fill(); ctx.restore();

  // animated bubbles inside barrel
  [0, 1, 2].forEach((i) => {
    const bx = -2.5 + i * 2.5;
    const by = -4 + Math.sin(bubblePhase + i * 1.2) * 6;
    ctx.beginPath(); ctx.arc(bx, by, 1.3, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(187,247,208,0.75)"; ctx.fill();
  });

  // plunger cap
  ctx.beginPath(); ctx.roundRect(-6, 11, 12, 4, 2);
  ctx.fillStyle = "#4ade80"; ctx.fill();
  ctx.strokeStyle = "#16a34a"; ctx.lineWidth = 0.8; ctx.stroke();

  // plunger rod + handle
  ctx.beginPath(); ctx.moveTo(0, 15); ctx.lineTo(0, 20);
  ctx.strokeStyle = "#86efac"; ctx.lineWidth = 2; ctx.stroke();
  ctx.beginPath(); ctx.roundRect(-5, 19, 10, 3, 1.5);
  ctx.fillStyle = "#4ade80"; ctx.fill();

  // measurement tick marks
  ctx.strokeStyle = "rgba(134,239,172,0.5)"; ctx.lineWidth = 0.8;
  [-6, -1, 4].forEach((ty) => {
    ctx.beginPath(); ctx.moveTo(-5, ty); ctx.lineTo(-3, ty); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(3, ty); ctx.lineTo(5, ty); ctx.stroke();
  });

  ctx.restore();
  return c.toDataURL("image/png");
}

// ─────────────────────────────────────────────────────────────────────────────
// DNA Helix hover follower
// ─────────────────────────────────────────────────────────────────────────────

function createHelixFollower(): HTMLDivElement {
  const el = document.createElement("div");
  el.id = "dna-helix-follower";
  el.innerHTML = `
    <svg width="26" height="32" viewBox="0 0 28 34" fill="none">
      <style>
        @keyframes hFollowSpin { 0%{transform:rotateY(0deg)}100%{transform:rotateY(360deg)} }
        .hg { animation:hFollowSpin 1.6s linear infinite; transform-origin:14px 17px; }
      </style>
      <g class="hg">
        <path d="M6 2 C6 8,22 10,22 17 C22 24,6 26,6 32" stroke="#4ade80" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <path d="M22 2 C22 8,6 10,6 17 C6 24,22 26,22 32" stroke="#86efac" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <line x1="9" y1="7" x2="19" y2="9" stroke="#bbf7d0" stroke-width="1.2" opacity="0.85"/>
        <line x1="7" y1="13" x2="21" y2="13" stroke="#bbf7d0" stroke-width="1.2" opacity="0.85"/>
        <line x1="9" y1="21" x2="19" y2="21" stroke="#bbf7d0" stroke-width="1.2" opacity="0.85"/>
        <line x1="7" y1="27" x2="21" y2="25" stroke="#bbf7d0" stroke-width="1.2" opacity="0.85"/>
      </g>
    </svg>`;
  el.style.cssText = `
    position:fixed;pointer-events:none;z-index:99995;
    opacity:0;transition:opacity 0.18s ease;
    filter:drop-shadow(0 0 6px #22c55e) drop-shadow(0 0 12px #16a34a);
    transform:translate(18px,-6px);
  `;
  document.body.appendChild(el);
  return el as HTMLDivElement;
}

// ─────────────────────────────────────────────────────────────────────────────
// CSS keyframes for click effects
// ─────────────────────────────────────────────────────────────────────────────

function ensureDNAKeyframes() {
  if (document.getElementById("dna-keyframes")) return;
  const s = document.createElement("style");
  s.id = "dna-keyframes";
  s.textContent = `
    @keyframes dnaStrand {
      0%   { transform:translate(-50%,-50%) scaleY(0) rotate(var(--ang,0deg)); opacity:1; transform-origin:bottom center; }
      40%  { transform:translate(-50%,-50%) scaleY(1) rotate(var(--ang,0deg)); opacity:0.9; transform-origin:bottom center; }
      100% { transform:translate(calc(-50% + var(--dx,0px)),calc(-50% + var(--dy,-120px))) scaleY(0.6) rotate(calc(var(--ang,0deg) + 540deg)); opacity:0; transform-origin:bottom center; }
    }
    @keyframes dnaHelixRise {
      0%   { transform:translate(-50%,-50%) scale(0) rotate(0deg); opacity:1; }
      20%  { transform:translate(-50%,-50%) scale(1) rotate(60deg); opacity:1; }
      80%  { transform:translate(-50%,calc(-50% - 85px)) scale(1) rotate(300deg); opacity:0.85; }
      100% { transform:translate(-50%,calc(-50% - 140px)) scale(0.7) rotate(540deg); opacity:0; }
    }
    @keyframes dnaOrb {
      0%   { transform:translate(-50%,-50%) scale(0); opacity:1; }
      50%  { transform:translate(-50%,-50%) scale(1); opacity:0.7; }
      100% { transform:translate(-50%,-50%) scale(2.2); opacity:0; }
    }
    @keyframes dnaParticle {
      0%   { transform:translate(-50%,-50%) scale(1); opacity:1; }
      100% { transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(0.15); opacity:0; }
    }
    @keyframes dnaLabel {
      0%   { transform:translate(-50%,-50%) scale(0.5); opacity:0; }
      20%  { transform:translate(-50%,-65%) scale(1.1); opacity:1; }
      80%  { transform:translate(-50%,-95%) scale(1); opacity:1; }
      100% { transform:translate(-50%,-120%) scale(0.9); opacity:0; }
    }
    @keyframes labScreen {
      0%   { opacity:0; clip-path:inset(50% 0 50% 0); }
      30%  { opacity:1; clip-path:inset(0% 0 0% 0); }
      78%  { opacity:0.9; clip-path:inset(0% 0 0% 0); }
      100% { opacity:0; clip-path:inset(0% 0 0% 0); }
    }
    @keyframes scanLine {
      0%   { top:0%;   opacity:0.9; }
      100% { top:100%; opacity:0.1; }
    }
  `;
  document.head.appendChild(s);
}

// ─────────────────────────────────────────────────────────────────────────────
// Click: full DNA extraction sequence
// ─────────────────────────────────────────────────────────────────────────────

function spawnDNAExtraction(x: number, y: number) {
  const LABELS = ["DNA Extracted!", "Sequence Loaded", "Genome Mapped", "Sample Acquired", "Analysis Ready", "Helix Decoded"];
  const GREEN  = ["#4ade80","#86efac","#22c55e","#bbf7d0","#dcfce7","#16a34a"];

  // 1. Central impact orb
  const orb = document.createElement("div");
  orb.style.cssText = `
    position:fixed;left:${x}px;top:${y}px;
    width:64px;height:64px;border-radius:50%;
    background:radial-gradient(circle,rgba(74,222,128,0.9) 0%,rgba(34,197,94,0.5) 50%,transparent 75%);
    box-shadow:0 0 30px #4ade80,0 0 60px #22c55e;
    pointer-events:none;z-index:99998;
    animation:dnaOrb 0.5s ease-out forwards;
  `;
  document.body.appendChild(orb);
  setTimeout(() => orb.remove(), 580);

  // 2. Central glowing strand rising straight up
  const strandUp = document.createElement("div");
  strandUp.style.cssText = `
    position:fixed;left:${x}px;top:${y}px;
    width:5px;height:55px;
    background:linear-gradient(to top,#4ade80,#86efac,rgba(187,247,208,0.2));
    border-radius:3px;
    box-shadow:0 0 14px #4ade80,0 0 28px #22c55e88;
    pointer-events:none;z-index:99999;
    --ang:0deg;--dx:0px;--dy:-140px;
    animation:dnaStrand 1s ease-out forwards;
  `;
  document.body.appendChild(strandUp);
  setTimeout(() => strandUp.remove(), 1100);

  // 3. Spinning helix rising from click point
  const helix = document.createElement("div");
  helix.innerHTML = `<svg width="22" height="28" viewBox="0 0 28 34" fill="none">
    <path d="M6 2 C6 8,22 10,22 17 C22 24,6 26,6 32" stroke="#4ade80" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M22 2 C22 8,6 10,6 17 C6 24,22 26,22 32" stroke="#86efac" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <line x1="9" y1="7" x2="19" y2="9" stroke="#bbf7d0" stroke-width="1.5" opacity="0.9"/>
    <line x1="7" y1="13" x2="21" y2="13" stroke="#bbf7d0" stroke-width="1.5" opacity="0.9"/>
    <line x1="9" y1="21" x2="19" y2="21" stroke="#bbf7d0" stroke-width="1.5" opacity="0.9"/>
    <line x1="7" y1="27" x2="21" y2="25" stroke="#bbf7d0" stroke-width="1.5" opacity="0.9"/>
  </svg>`;
  helix.style.cssText = `
    position:fixed;left:${x}px;top:${y}px;
    pointer-events:none;z-index:99999;
    filter:drop-shadow(0 0 8px #22c55e) drop-shadow(0 0 16px #16a34a);
    animation:dnaHelixRise 1.35s ease-out forwards;
  `;
  document.body.appendChild(helix);
  setTimeout(() => helix.remove(), 1450);

  // 4. Diagonal strands fanning out
  [-65,-35,35,65].forEach((angDeg, idx) => {
    const rad  = (angDeg * Math.PI) / 180;
    const dist = 65 + Math.random() * 30;
    const s2   = document.createElement("div");
    s2.style.cssText = `
      position:fixed;left:${x}px;top:${y}px;
      width:4px;height:38px;
      background:linear-gradient(to top,#22c55e,#86efac,transparent);
      border-radius:2px;
      box-shadow:0 0 8px #4ade80;
      pointer-events:none;z-index:99999;
      --ang:${angDeg}deg;
      --dx:${Math.cos(rad)*dist}px;
      --dy:${Math.sin(rad)*dist - dist * 0.8}px;
      animation:dnaStrand 0.8s ease-out ${idx * 60}ms forwards;
    `;
    document.body.appendChild(s2);
    setTimeout(() => s2.remove(), 1000);
  });

  // 5. Nucleotide particle burst
  for (let i = 0; i < 18; i++) {
    const angle  = (i / 18) * Math.PI * 2;
    const dist   = 40 + Math.random() * 65;
    const dx     = Math.cos(angle) * dist, dy = Math.sin(angle) * dist;
    const color  = GREEN[Math.floor(Math.random() * GREEN.length)];
    const size   = 2 + Math.random() * 4;
    const dur    = 380 + Math.random() * 380;
    const isRing = i % 5 === 0;

    const p = document.createElement("div");
    p.style.cssText = `
      position:fixed;left:${x}px;top:${y}px;
      width:${isRing ? size * 3 : size}px;height:${isRing ? size * 3 : size}px;
      border-radius:50%;
      background:${isRing ? "transparent" : color};
      border:${isRing ? `1.5px solid ${color}` : "none"};
      box-shadow:0 0 ${size * 2}px ${color};
      pointer-events:none;z-index:99999;
      --dx:${dx}px;--dy:${dy}px;
      animation:dnaParticle ${dur}ms ease-out ${i * 18}ms forwards;
    `;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), dur + i * 18 + 60);
  }

  // 6. Lab screen activation panel
  const screen = document.createElement("div");
  screen.style.cssText = `
    position:fixed;left:${x + 20}px;top:${y - 110}px;
    width:168px;height:96px;
    border:1px solid rgba(74,222,128,0.65);
    border-radius:8px;
    background:rgba(0,18,10,0.88);
    backdrop-filter:blur(6px);
    box-shadow:0 0 22px rgba(34,197,94,0.45),inset 0 0 22px rgba(74,222,128,0.07);
    pointer-events:none;z-index:99996;overflow:hidden;
    animation:labScreen 1.5s ease-out forwards;
  `;
  screen.innerHTML = `
    <div style="padding:8px 10px;font-family:'Courier New',monospace;font-size:9px;color:#4ade80;line-height:1.65;position:relative;z-index:1;">
      <div style="color:#86efac;margin-bottom:3px;letter-spacing:1px;">▶ JURASSIC LAB SEQUENCER</div>
      <div>SAMPLE &nbsp;: <span style="color:#bbf7d0">EXTRACTED ✓</span></div>
      <div>BASE PAIRS: <span style="color:#86efac">3.2B</span></div>
      <div>HELIX &nbsp;&nbsp;: <span style="color:#4ade80">MAPPED ✓</span></div>
      <div style="color:#22c55e;margin-top:3px;letter-spacing:1px;">▓▓▓▓▓▓▓▓▓ 100%</div>
    </div>
    <div style="position:absolute;left:0;right:0;height:2px;background:linear-gradient(to right,transparent,#4ade80,transparent);box-shadow:0 0 8px #4ade80;animation:scanLine 0.85s linear 0.25s infinite;"></div>
  `;
  document.body.appendChild(screen);
  setTimeout(() => screen.remove(), 1600);

  // 7. Callout label
  const label = document.createElement("div");
  label.textContent = LABELS[Math.floor(Math.random() * LABELS.length)];
  label.style.cssText = `
    position:fixed;left:${x}px;top:${y}px;
    color:#4ade80;
    text-shadow:0 0 10px #4ade80,0 0 20px #22c55e,0 0 40px #16a34a;
    pointer-events:none;z-index:99999;white-space:nowrap;
    animation:dnaLabel 1.25s ease-out forwards;
    font-family:'Courier New',monospace;letter-spacing:2px;font-size:13px;
  `;
  document.body.appendChild(label);
  setTimeout(() => label.remove(), 1350);
}

// ─────────────────────────────────────────────────────────────────────────────
// Legacy inline cursor (kept for any remaining inline uses)
// ─────────────────────────────────────────────────────────────────────────────
const GLOVED_HAND_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 36 36'%3E%3Ctext y='30' font-size='30'%3E🧤%3C/text%3E%3C/svg%3E") 8 0, pointer`;

const curriculumParts = [
  {
    part: 1,
    title: "Introduction to Python",
    certImage: certImage,
    points: [
      "Built strong foundations in Python programming, including control flow, data structures (lists, dictionaries, sets), and modular function design.",
      "Implemented data processing workflows using loops, conditional logic, and file handling to manipulate structured datasets (CSV, text files).",
      "Applied object-oriented programming principles (classes, methods, encapsulation) to design reusable and maintainable code components.",
      "Worked with date/time manipulation, string formatting, and encoding systems (UTF-8, ASCII) to handle real-world data transformation challenges.",
      "Gained understanding of memory representation, binary systems, and performance considerations for efficient data processing.",
    ],
  },
  {
    part: 2,
    title: "Introduction to Algorithms",
    certImage: algoCertImage,
    points: [
      "Analyzed algorithm performance using Big-O notation, evaluating worst-case runtime and identifying bottlenecks in data processing workflows.",
      "Implemented and compared constant, logarithmic, and quadratic time algorithms, understanding scalability trade-offs for large-scale datasets.",
      "Applied binary search and sorting techniques (O(N log N)) to optimize lookup and transformation operations on structured data.",
      "Evaluated time–space trade-offs, leveraging preprocessing and hash-based lookups (sets/dictionaries) to improve query efficiency.",
      "Designed memory-conscious solutions by analyzing space complexity and understanding how data structures impact performance at scale.",
    ],
  },
  {
    part: 3,
    title: "The Command Line and Git",
    certImage: cmdGitCertImage,
    points: [
      "Developed proficiency in Linux command-line environments (Bash) to navigate hierarchical filesystems, manage files and directories, and automate workflows using shell commands.",
      "Leveraged pipelines, redirection, and standard streams (stdin, stdout, stderr) to chain Unix utilities and build efficient command-line data processing workflows.",
      "Applied text-processing tools such as grep, sort, cut, and cat to filter, transform, and analyze large text and CSV datasets directly from the terminal.",
      "Managed file permissions, ownership, and user roles in Unix systems using commands like chmod, chown, and sudo to control system access and security.",
      "Used Git for distributed version control, including repository initialization, commits, branching, merging, and remote collaboration through GitHub workflows.",
    ],
  },
  {
    part: 4,
    title: "Working with Data Sources Using SQL",
    certImage: sqlCertImage,
    points: [
      "Explored relational database structures by analyzing schemas, tables, and column relationships to understand how data is organized and stored.",
      "Wrote SQL queries to filter, sort, and retrieve relevant data using clauses such as SELECT, WHERE, ORDER BY, and LIMIT to efficiently extract insights from large datasets.",
      "Applied aggregate functions and grouping techniques (COUNT, SUM, AVG, GROUP BY) to compute summary statistics and perform data analysis directly within databases.",
      "Combined data from multiple tables using SQL joins and set operators to build comprehensive datasets for deeper analysis and reporting.",
      "Utilized advanced SQL features such as subqueries, views, and common table expressions (CTEs) to structure complex queries and improve query readability and efficiency.",
    ],
  },
  {
    part: 5,
    title: "Production Databases",
    certImage: prodDbCertImage,
    points: [
      "Designed and managed relational databases using PostgreSQL, including creating tables, defining appropriate data types, and structuring schemas for efficient data storage and retrieval.",
      "Built secure and reliable database operations using prepared statements and parameterized queries to prevent SQL injection and improve query performance.",
      "Implemented database optimization techniques such as indexing, query planning analysis, and performance debugging to improve query execution speed on large datasets.",
      "Managed production database environments by handling user roles, privileges, and access control, ensuring secure and organized database operations.",
      "Worked with modern data platforms including Snowflake for cloud data warehousing and NoSQL databases like MongoDB to handle scalable and flexible data storage for real-world applications.",
    ],
  },
  {
    part: 6,
    title: "Python for Large Datasets",
    certImage: null,
    points: [
      "Processed large datasets efficiently using NumPy and Pandas, applying vectorized operations, broadcasting, filtering, and aggregation for high-performance data analysis.",
      "Optimized data workflows by reducing DataFrame memory footprint, processing datasets in chunks, and integrating Pandas with SQLite to handle datasets larger than available memory.",
      "Implemented parallel data processing techniques using multiprocessing and MapReduce concepts to distribute computations across multiple CPU cores.",
      "Built and analyzed core data structures and algorithms including recursion, stacks, queues, and hash tables to support scalable data processing tasks.",
      "Implemented advanced tree-based data structures such as Binary Trees, AVL Trees, Binary Heaps, and B-Trees to enable efficient indexing, priority scheduling, and fast data retrieval in large datasets.",
    ],
  },
  {
    part: 7,
    title: "Distributed Data Processing",
    certImage: null,
    points: [
      "Apache Spark fundamentals",
      "Distributed computing concepts",
      "MapReduce paradigm",
      "Partitioning and fault tolerance",
    ],
  },
  {
    part: 8,
    title: "Containerization and Infrastructure",
    certImage: null,
    points: [
      "Docker containerization",
      "Building container images",
      "Infrastructure basics",
      "Deployment best practices",
    ],
  },
  {
    part: 9,
    title: "Pipeline Orchestration and Cloud Deployment",
    certImage: null,
    points: [
      "Apache Airflow fundamentals",
      "DAG design and scheduling",
      "Cloud deployment workflows",
      "Monitoring and logging pipelines",
    ],
  },
];

function CurriculumModal({ onClose }: { onClose: () => void }) {
  const [openPart, setOpenPart] = useState<number | null>(null);
  const [activeCertPart, setActiveCertPart] = useState<number | null>(null);

  const activeCertData = curriculumParts.find((p) => p.part === activeCertPart);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 30, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(10,10,10,0.97) 0%, rgba(20,30,20,0.97) 100%)",
          border: "1px solid rgba(251,191,36,0.25)",
          boxShadow: "0 0 60px rgba(251,191,36,0.15), 0 0 120px rgba(34,197,94,0.08)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top glow line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60" />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                className="p-2 rounded-lg bg-gradient-to-br from-amber-600/40 to-green-700/40 border border-amber-500/30"
                animate={{ boxShadow: ["0 0 10px rgba(251,191,36,0.3)", "0 0 25px rgba(34,197,94,0.5)", "0 0 10px rgba(251,191,36,0.3)"] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Dna className="w-6 h-6 text-amber-400" />
              </motion.div>
              <div>
                <h2 className="text-xl text-white" style={{ background: "linear-gradient(90deg, #fbbf24, #4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Dataquest Data Engineer
                </h2>
                <p className="text-xs text-gray-400 font-mono mt-0.5">🧬 Curriculum Decomposition</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-black/40 hover:bg-amber-900/30 border border-amber-500/20 hover:border-amber-500/50 transition-all"
            >
              <X className="w-5 h-5 text-gray-300" />
            </button>
          </div>

          {/* Accordion Parts */}
          <div className="space-y-3">
            {curriculumParts.map((item, index) => {
              const isOpen = openPart === item.part;
              return (
                <motion.div
                  key={item.part}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="rounded-xl overflow-hidden border transition-all"
                  style={{
                    borderColor: isOpen ? "rgba(251,191,36,0.45)" : "rgba(251,191,36,0.15)",
                    background: isOpen
                      ? "linear-gradient(135deg, rgba(40,30,5,0.6) 0%, rgba(5,30,10,0.6) 100%)"
                      : "rgba(15,15,15,0.5)",
                    boxShadow: isOpen ? "0 0 20px rgba(251,191,36,0.1), 0 0 40px rgba(34,197,94,0.06)" : "none",
                  }}
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => setOpenPart(isOpen ? null : item.part)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left group"
                    style={{ cursor: GLOVED_HAND_CURSOR }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="flex items-center justify-center w-7 h-7 rounded-lg text-xs font-mono font-bold flex-shrink-0"
                        style={{
                          background: "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(34,197,94,0.2))",
                          border: "1px solid rgba(251,191,36,0.3)",
                          color: "#fbbf24",
                        }}
                        animate={isOpen ? { boxShadow: ["0 0 6px rgba(251,191,36,0.4)", "0 0 14px rgba(34,197,94,0.5)", "0 0 6px rgba(251,191,36,0.4)"] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {String(item.part).padStart(2, "0")}
                      </motion.div>
                      <div className="flex items-center gap-2">
                        <motion.span
                          className="text-sm"
                          animate={isOpen ? { textShadow: "0 0 8px rgba(34,197,94,0.6)" } : {}}
                        >
                          <Dna className={`w-3.5 h-3.5 inline mr-1.5 ${isOpen ? "text-green-400" : "text-amber-600"}`} />
                        </motion.span>
                        <span className={`text-sm transition-colors ${isOpen ? "text-amber-300" : "text-gray-300 group-hover:text-amber-300"}`}>
                          {item.title}
                        </span>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className={`w-4 h-4 ${isOpen ? "text-amber-400" : "text-gray-500"}`} />
                    </motion.div>
                  </button>

                  {/* Accordion Body */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-1 border-t border-amber-500/15">
                          <ul className="space-y-2 mt-3">
                            {item.points.map((point, pi) => (
                              <motion.li
                                key={pi}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: pi * 0.06 }}
                                className="flex items-start gap-2 text-gray-300 text-sm"
                              >
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-green-400"
                                  style={{ boxShadow: "0 0 6px rgba(34,197,94,0.8)" }}
                                />
                                {point}
                              </motion.li>
                            ))}
                          </ul>
                          {/* View Certification button — all parts */}
                          <motion.button
                            onClick={() => setActiveCertPart(item.part)}
                            className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono border relative overflow-hidden"
                            style={{
                              background: "linear-gradient(135deg, rgba(20,5,40,0.8), rgba(5,20,40,0.8))",
                              borderColor: "rgba(167,139,250,0.45)",
                              color: "#c4b5fd",
                              cursor: GLOVED_HAND_CURSOR,
                            }}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            animate={{
                              boxShadow: [
                                "0 0 8px rgba(167,139,250,0.2)",
                                "0 0 18px rgba(167,139,250,0.45)",
                                "0 0 8px rgba(167,139,250,0.2)",
                              ],
                            }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent"
                              initial={{ x: "-100%" }}
                              whileHover={{ x: "100%" }}
                              transition={{ duration: 0.55 }}
                            />
                            <ExternalLink className="w-3.5 h-3.5 relative z-10" />
                            <span className="relative z-10">View Certification</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-amber-500/20 text-center">
            <p className="text-xs text-gray-500 font-mono">🧬 DNA SEQUENCE: 9 PARTS FULLY EXTRACTED • CONTAINMENT: SECURED</p>
          </div>
        </div>

        {/* Bottom glow line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-40" />
      </motion.div>

      {/* Certificate Image Lightbox */}
      <AnimatePresence>
        {activeCertPart !== null && activeCertData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setActiveCertPart(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", duration: 0.45 }}
              className="relative max-w-3xl w-full rounded-2xl overflow-hidden"
              style={{
                boxShadow: "0 0 60px rgba(167,139,250,0.3), 0 0 120px rgba(251,191,36,0.1)",
                border: "1px solid rgba(167,139,250,0.3)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={() => setActiveCertPart(null)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 hover:bg-purple-900/60 border border-purple-500/30 hover:border-purple-400/60 transition-all"
              >
                <X className="w-4 h-4 text-gray-200" />
              </button>
              {/* Top label */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-amber-500/30 backdrop-blur-sm">
                <Dna className="w-3 h-3 text-amber-400" />
                <span className="text-xs font-mono text-amber-300">{activeCertData.title} • Certificate</span>
              </div>
              {activeCertData.certImage ? (
                <img
                  src={activeCertData.certImage}
                  alt={`${activeCertData.title} Certificate`}
                  className="w-full h-auto block"
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-8 bg-gray-900 text-center">
                  <Dna className="w-12 h-12 text-amber-400 mb-4" />
                  <p className="text-amber-300 font-mono text-sm">Certificate Coming Soon</p>
                  <p className="text-gray-500 text-xs mt-2">🧬 DNA SEQUENCE: PENDING EXTRACTION</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function JungleWorld() {
  const [showCurriculum, setShowCurriculum] = useState(false);
  const bubblePhaseRef = useRef(0);
  const rafRef         = useRef<number>(0);
  const styleElRef     = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    document.title = 'Sri Krishna Sai Kota | Portfolio';
  }, []);

  useEffect(() => {
    ensureDNAKeyframes();

    // Animated syringe cursor — redraw at ~12fps for bubble wobble
    let last = 0;
    function loop(ts: number) {
      if (ts - last > 80) {
        bubblePhaseRef.current += 0.18;
        const dataUrl   = buildSyringeCursor(bubblePhaseRef.current);
        const cursorVal = `url("${dataUrl}") 4 4, crosshair`;
        if (!styleElRef.current) {
          styleElRef.current = document.createElement("style");
          styleElRef.current.id = "syringe-cursor-override";
          document.head.appendChild(styleElRef.current);
        }
        styleElRef.current.textContent = `*, *::before, *::after { cursor: ${cursorVal} !important; }`;
        last = ts;
      }
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    // Helix follower — appears when hovering over interactive elements
    const follower = createHelixFollower();
    const onMove = (e: MouseEvent) => {
      follower.style.left = `${e.clientX}px`;
      follower.style.top  = `${e.clientY}px`;
      const isBtn = (e.target as HTMLElement).closest("button, a, [role='button'], .cursor-pointer");
      follower.style.opacity = isBtn ? "1" : "0";
    };
    window.addEventListener("mousemove", onMove);

    // Click — DNA extraction sequence
    const onClick = (e: MouseEvent) => spawnDNAExtraction(e.clientX, e.clientY);
    window.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      styleElRef.current?.remove();
      styleElRef.current = null;
      follower.remove();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      document.getElementById("dna-keyframes")?.remove();
    };
  }, []);

  const certifications = [
    {
      title: "Dataquest Data Engineer Career Path",
      issuer: "Dataquest",
      status: "Completed",
      description: "Comprehensive data engineering program covering Python, SQL, data pipelines, ETL processes, and database design",
      skills: ["Python", "SQL", "Data Pipelines", "ETL", "Database Design"],
      color: "from-amber-600 to-orange-700",
      icon: CheckCircle,
      dnaCode: "🧬 DNA SEQUENCE: COMPLETE",
      specimen: "Brachiosaurus Class",
      containment: "SECURED",
      hasCurriculum: true,
    },
    {
      title: "AWS Certified Data Engineer – Associate",
      issuer: "Amazon Web Services",
      status: "In Progress",
      description: "Professional certification validating expertise in designing, building, and maintaining AWS data solutions",
      skills: ["AWS Services", "Data Lakes", "Data Pipelines", "Security", "Cost Optimization"],
      color: "from-green-600 to-amber-600",
      icon: Clock,
      dnaCode: "🧬 DNA SEQUENCE: EXTRACTING",
      specimen: "Velociraptor Class",
      containment: "IN PROGRESS",
      hasCurriculum: false,
    },
  ];

  return (
    <WorldLayout
      backgroundImage="https://images.unsplash.com/photo-1695116137649-455529ab58ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVoaXN0b3JpYyUyMGp1bmdsZSUyMGZlcm5zJTIwYW1iZXIlMjB0cm9waWNhbHxlbnwxfHx8fDE3NzE5OTQzNjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      title="Jurassic Data Park"
      subtitle="Professional Certifications • Preserved in Amber"
      gradient="from-amber-500 via-orange-600 to-green-700"
      glowColor="rgba(251, 191, 36, 0.6)"
    >
      {/* InGen Control Panel */}
      <div className="fixed top-32 left-8 z-0 pointer-events-none">
        <motion.div
          className="text-amber-400 font-mono text-xs space-y-2 opacity-50 border-2 border-amber-500/30 bg-black/40 backdrop-blur-sm p-4 rounded-lg"
          animate={{ 
            opacity: [0.5, 0.7, 0.5],
            borderColor: ["rgba(251, 191, 36, 0.3)", "rgba(34, 197, 94, 0.5)", "rgba(251, 191, 36, 0.3)"]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div className="flex items-center gap-2 text-green-400 font-bold">
            <Dna className="w-3 h-3" />
            <span>INGEN SYSTEMS</span>
          </div>
          <div className="text-[10px] border-b border-amber-500/20 pb-2 text-gray-400">
            // CERTIFICATION ARCHIVE
          </div>
          <div>PARK STATUS: <span className="text-green-400">OPERATIONAL</span></div>
          <div>SPECIMENS: <span className="text-amber-400">{certifications.length}</span></div>
          <div>SECURITY: <span className="text-green-400">ACTIVE</span></div>
          <div className="text-[10px] pt-2 border-t border-amber-500/30 text-orange-400">
            ⚡ ELECTRIC FENCES: ONLINE
          </div>
        </motion.div>
      </div>

      {/* DNA Helix Animation */}
      <div className="fixed top-40 right-8 z-0 pointer-events-none">
        <motion.div
          className="relative w-16 h-64"
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`dna-${i}`}
              className="absolute w-2 h-2 rounded-full bg-amber-400"
              style={{
                left: i % 2 === 0 ? 0 : "100%",
                top: `${i * 12.5}%`,
                boxShadow: "0 0 10px rgba(251, 191, 36, 0.6)",
              }}
              animate={{
                x: i % 2 === 0 ? [0, 50, 0] : [0, -50, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </motion.div>
      </div>

      {/* Electric Fence Effect */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`fence-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"
            style={{ top: `${20 + i * 25}%`, left: 0, right: 0 }}
            animate={{
              opacity: [0, 0.6, 0],
              boxShadow: [
                "0 0 0px rgba(251, 191, 36, 0)",
                "0 0 20px rgba(251, 191, 36, 0.8)",
                "0 0 0px rgba(251, 191, 36, 0)",
              ],
            }}
            transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 4 + i * 0.5 }}
          />
        ))}
      </div>

      {/* Amber Particles Floating */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`amber-${i}`}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: "radial-gradient(circle, #fbbf24, #f59e0b)",
              boxShadow: "0 0 15px rgba(251, 191, 36, 0.6)",
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 8 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Jungle Fog Effect */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`fog-${i}`}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-green-900/20 to-transparent"
            animate={{ x: ["-100%", "100%"], opacity: [0, 0.5, 0] }}
            transition={{ duration: 25 + i * 5, repeat: Infinity, delay: i * 3, ease: "linear" }}
          />
        ))}
      </div>

      {/* Dinosaur Footprint Effect */}
      <div className="fixed bottom-40 left-20 z-0 pointer-events-none">
        <motion.div
          className="text-6xl opacity-10"
          animate={{ opacity: [0.05, 0.15, 0.05], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🦖
        </motion.div>
      </div>

      <div className="space-y-8">
        {/* Welcome Header */}
        <GlassCard delay={0.1}>
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              className="p-4 bg-gradient-to-br from-amber-600 to-green-700 rounded-xl shadow-lg relative"
              animate={{
                boxShadow: [
                  "0 0 30px rgba(251, 191, 36, 0.5)",
                  "0 0 50px rgba(34, 197, 94, 0.8)",
                  "0 0 30px rgba(251, 191, 36, 0.5)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <TreePine className="w-10 h-10 text-white" />
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <div>
              <h2 className="text-4xl text-white bg-gradient-to-r from-amber-300 via-green-300 to-orange-300 bg-clip-text text-transparent">
                Welcome to Jurassic Data Park
              </h2>
              <p className="text-gray-400 italic flex items-center gap-2">
                <Dna className="w-4 h-4" />
                Where Ancient Knowledge Meets Modern Innovation
              </p>
            </div>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed">
            Welcome to <span className="text-amber-400 font-semibold">Jurassic Data Park</span>, where professional
            certifications are preserved like ancient DNA in amber—extracted, studied, and brought to life. Each
            certification represents a{" "}
            <span className="text-green-400 font-semibold">carefully sequenced strand of expertise</span>, validated
            by industry leaders and contained within our secure systems. In this park, knowledge evolves, and{" "}
            <span className="text-orange-400 font-semibold">innovation finds a way</span>.
          </p>
        </GlassCard>

        {/* Certifications Header */}
        <GlassCard delay={0.2}>
          <div className="flex items-start gap-6">
            <motion.div
              className="p-4 bg-gradient-to-br from-green-600 to-amber-700 rounded-xl relative"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(34, 197, 94, 0.5)",
                  "0 0 40px rgba(251, 191, 36, 0.8)",
                  "0 0 20px rgba(34, 197, 94, 0.5)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Shield className="w-8 h-8 text-white" />
              <motion.div
                className="absolute inset-0 rounded-xl border-2 border-amber-400"
                animate={{ opacity: [0, 0.5, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <div className="flex-1">
              <h2 className="text-4xl mb-4 text-white bg-gradient-to-r from-green-300 to-amber-300 bg-clip-text text-transparent">
                Genetic Certification Archive
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                Like fossilized mosquitoes preserved in amber for millions of years, these certifications capture
                validated expertise and knowledge—ready to be extracted and applied to modern data engineering challenges.
                Each credential has been carefully contained and verified by InGen's rigorous quality standards.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {certifications.map((cert, index) => {
            const Icon = cert.icon;
            return (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.2, duration: 0.8 }}
              >
                <GlassCard className="h-full relative overflow-hidden group hover:bg-black/50 transition-all">
                  {/* Specimen Classification Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <motion.div
                      className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-amber-600/30 to-green-600/30 border border-amber-500/40 text-amber-300 font-mono"
                      animate={{
                        borderColor: ["rgba(251, 191, 36, 0.4)", "rgba(34, 197, 94, 0.4)", "rgba(251, 191, 36, 0.4)"],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      🦕 {cert.specimen}
                    </motion.div>
                  </div>

                  {/* DNA Strand Indicator */}
                  <div className="mb-4">
                    <span className="text-xs px-3 py-1 rounded-full bg-amber-900/30 border border-amber-500/30 text-amber-400 font-mono">
                      {cert.dnaCode}
                    </span>
                  </div>

                  {/* Electric Pulse on Card */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"
                    animate={{ opacity: [0, 0.8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                  />

                  {/* Status Icon with Animation */}
                  <div className="flex items-start gap-4 mb-6">
                    <motion.div
                      className={`p-4 bg-gradient-to-br ${cert.color} rounded-xl relative`}
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(251, 191, 36, 0.4)",
                          "0 0 40px rgba(34, 197, 94, 0.6)",
                          "0 0 20px rgba(251, 191, 36, 0.4)",
                        ],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-white/20"
                        animate={{ opacity: [0, 0.5, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>

                    <div className="flex-1">
                      <motion.h3
                        className="text-2xl text-white mb-2 group-hover:text-amber-300 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.2 }}
                      >
                        {cert.title}
                      </motion.h3>
                      <p className="text-green-400 text-lg mb-1">{cert.issuer}</p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            cert.status === "Completed"
                              ? "bg-green-900/40 text-green-300 border border-green-500/40"
                              : "bg-amber-900/40 text-amber-300 border border-amber-500/40"
                          }`}
                        >
                          {cert.containment}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-6 leading-relaxed">{cert.description}</p>

                  {/* Skills/DNA Tags */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-amber-400 font-mono">
                      <Dna className="w-4 h-4" />
                      <span>EXTRACTED DNA SEQUENCES:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cert.skills.map((skill, skillIndex) => (
                        <motion.span
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8 + index * 0.2 + skillIndex * 0.05 }}
                          className="px-3 py-1 bg-gradient-to-r from-amber-900/20 to-green-900/20 border border-amber-500/40 rounded-md text-gray-300 text-sm hover:bg-gradient-to-r hover:from-amber-900/40 hover:to-green-900/40 hover:border-green-500/60 hover:text-green-300 transition-all"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Curriculum Button — only for Dataquest */}
                  {cert.hasCurriculum && (
                    <div className="mt-5">
                      <motion.button
                        onClick={() => setShowCurriculum(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-mono border transition-all relative overflow-hidden group/btn"
                        style={{
                          background: "linear-gradient(135deg, rgba(40,25,0,0.7), rgba(5,25,10,0.7))",
                          borderColor: "rgba(251,191,36,0.4)",
                          color: "#fbbf24",
                          cursor: GLOVED_HAND_CURSOR,
                        }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        animate={{
                          boxShadow: [
                            "0 0 8px rgba(251,191,36,0.2)",
                            "0 0 20px rgba(34,197,94,0.3)",
                            "0 0 8px rgba(251,191,36,0.2)",
                          ],
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        {/* shimmer */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/15 to-transparent"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.6 }}
                        />
                        <Dna className="w-4 h-4 text-green-400 relative z-10" />
                        <span className="relative z-10">View Extracted DNA (Curriculum Breakdown)</span>
                      </motion.button>
                    </div>
                  )}

                  {/* Containment Status Footer */}
                  <div className="mt-6 pt-4 border-t border-amber-500/20">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-mono">SECURITY CLEARANCE:</span>
                      <div className="flex items-center gap-2">
                        <motion.div
                          className="w-2 h-2 rounded-full bg-green-400"
                          animate={{
                            boxShadow: [
                              "0 0 5px rgba(34, 197, 94, 0.5)",
                              "0 0 15px rgba(34, 197, 94, 1)",
                              "0 0 5px rgba(34, 197, 94, 0.5)",
                            ],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-green-400 font-mono">LEVEL 5</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Park Operations Note */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
          <GlassCard className="border-2 border-amber-500/30">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-amber-600 to-green-700 rounded-lg relative">
                <Zap className="w-6 h-6 text-white" />
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  animate={{
                    boxShadow: [
                      "0 0 0px rgba(251, 191, 36, 0)",
                      "0 0 20px rgba(251, 191, 36, 0.8)",
                      "0 0 0px rgba(251, 191, 36, 0)",
                    ],
                  }}
                  transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 3 }}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl text-amber-300 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  InGen Research Division - Archive Notice
                </h3>
                <p className="text-gray-300 italic leading-relaxed">
                  "Like Dr. Hammond's vision of bringing extinct species back to life, these certifications represent
                  the resurrection of ancient knowledge through modern validation. But remember—with great power comes
                  great responsibility. Each credential is more than a badge; it's a commitment to ethical engineering,
                  continuous learning, and the understanding that in our field, as in nature, adaptation is survival.
                  The question isn't whether innovation will find a way—it's whether we'll be ready when it does."
                </p>
                <p className="text-gray-500 text-sm mt-3">
                  — Dr. Henry Wu, InGen Certification & Training Division
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Park Statistics */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
          <GlassCard>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <motion.div
                  className="text-4xl text-amber-400 mb-2"
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(251, 191, 36, 0.5)",
                      "0 0 20px rgba(251, 191, 36, 0.8)",
                      "0 0 10px rgba(251, 191, 36, 0.5)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {certifications.filter((c) => c.status === "Completed").length}
                </motion.div>
                <div className="text-gray-400 text-sm font-mono">SPECIMENS SECURED</div>
              </div>
              <div className="text-center">
                <motion.div
                  className="text-4xl text-green-400 mb-2"
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(34, 197, 94, 0.5)",
                      "0 0 20px rgba(34, 197, 94, 0.8)",
                      "0 0 10px rgba(34, 197, 94, 0.5)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {certifications.filter((c) => c.status === "In Progress").length}
                </motion.div>
                <div className="text-gray-400 text-sm font-mono">DNA EXTRACTION IN PROGRESS</div>
              </div>
              <div className="text-center">
                <motion.div
                  className="text-4xl text-orange-400 mb-2"
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(249, 115, 22, 0.5)",
                      "0 0 20px rgba(249, 115, 22, 0.8)",
                      "0 0 10px rgba(249, 115, 22, 0.5)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  100%
                </motion.div>
                <div className="text-gray-400 text-sm font-mono">CONTAINMENT INTEGRITY</div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Curriculum Modal */}
      <AnimatePresence>
        {showCurriculum && <CurriculumModal onClose={() => setShowCurriculum(false)} />}
      </AnimatePresence>
    </WorldLayout>
  );
}