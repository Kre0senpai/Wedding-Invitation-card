import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays, Clock3, Heart, MapPin, Pause, Play,
  Send, Sparkles
} from "lucide-react";
import "./styles.css";

const WEDDING_DATE = new Date("2026-11-25T19:00:00+05:30");

function useCountdown(target) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const difference = Math.max(0, target - now);
  return {
    days: Math.floor(difference / 86400000),
    hours: Math.floor((difference / 3600000) % 24),
    minutes: Math.floor((difference / 60000) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

/* ==========================================================================
   SOOTHING CHIME SOUND (WEB AUDIO API)
   ========================================================================== */

function playSoothingChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === "suspended") ctx.resume();
    const freqs = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51, 1567.98];
    const t = ctx.currentTime;
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t + i * 0.09);
      gain.gain.setValueAtTime(0.001, t + i * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.2, t + i * 0.09 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.09 + 2.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t + i * 0.09);
      osc.stop(t + i * 0.09 + 2.5);
    });
  } catch (e) { /* silent fail */ }
}

/* ==========================================================================
   FLORAL CORNER SVG (FOR WELCOME CARD)
   ========================================================================== */

function FloralCornerSVG({ position }) {
  return (
    <div className={`floral-corner floral-corner-${position}`}>
      <svg viewBox="0 0 220 220" width="160" height="160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id={`rg1-${position}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff4d6d" />
            <stop offset="55%" stopColor="#d30f36" />
            <stop offset="100%" stopColor="#7a0017" />
          </radialGradient>
          <radialGradient id={`rg2-${position}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff8099" />
            <stop offset="60%" stopColor="#e8193f" />
            <stop offset="100%" stopColor="#960020" />
          </radialGradient>
          <linearGradient id={`lg-${position}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2d6a36" />
            <stop offset="100%" stopColor="#1a3d1f" />
          </linearGradient>
          <linearGradient id={`gv-${position}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5d98b" />
            <stop offset="50%" stopColor="#c9a36b" />
            <stop offset="100%" stopColor="#9e7535" />
          </linearGradient>
        </defs>
        <path d="M 8 8 L 200 8 L 8 8 L 8 200" stroke={`url(#gv-${position})`} strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M 18 18 L 160 18 L 18 18 L 18 160" stroke={`url(#gv-${position})`} strokeWidth="1" strokeDasharray="4 3" opacity="0.7"/>
        <path d="M 8 8 C 30 50 50 80 80 110 C 110 140 155 168 200 185" stroke={`url(#lg-${position})`} strokeWidth="2.8" fill="none" strokeLinecap="round"/>
        <path d="M 8 8 C 50 30 80 50 110 80 C 140 110 168 155 185 200" stroke={`url(#lg-${position})`} strokeWidth="2.8" fill="none" strokeLinecap="round"/>
        <path d="M 40 55 C 22 38 12 55 28 65 C 38 62 42 58 40 55 Z" fill={`url(#lg-${position})`}/>
        <path d="M 40 55 C 58 38 68 55 52 65 C 42 62 38 58 40 55 Z" fill={`url(#lg-${position})`} opacity="0.85"/>
        <path d="M 60 35 C 42 18 32 35 48 45 C 58 42 62 38 60 35 Z" fill={`url(#lg-${position})`}/>
        <path d="M 35 60 C 18 42 18 62 35 68 C 35 65 35 62 35 60 Z" fill={`url(#lg-${position})`}/>
        <g transform="translate(72, 72)">
          <path d="M 0 -32 C -22 -32 -38 -16 -38 4 C -38 24 -22 38 0 38 C 22 38 38 24 38 4 C 38 -16 22 -32 0 -32 Z" fill={`url(#rg1-${position})`}/>
          <path d="M 0 -22 C -16 -22 -27 -10 -27 4 C -27 18 -16 27 0 27 C 16 27 27 18 27 4 C 27 -10 16 -22 0 -22 Z" fill={`url(#rg2-${position})`}/>
        </g>
      </svg>
    </div>
  );
}

/* ==========================================================================
   BACKGROUND FALLING FLOWERS
   ========================================================================== */

function FallingFlowers() {
  const items = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${(i * 5.8 + 2) % 96}%`,
    duration: `${6 + (i % 6) * 1.5}s`,
    delay: `${(i * 0.4) % 5}s`,
    size: 20 + (i % 5) * 6,
    rotate: (i * 45) % 360,
  })), []);

  return (
    <div className="falling-flowers-container" aria-hidden="true">
      {items.map(it => (
        <div key={it.id} className="falling-flower-item"
          style={{
            "--left": it.left,
            "--duration": it.duration,
            "--delay": it.delay,
          }}>
          <svg width={it.size} height={it.size} viewBox="0 0 40 40" fill="none"
            style={{ transform: `rotate(${it.rotate}deg)` }}>
            <circle cx="20" cy="8" r="7" fill="#ff4d6d" opacity="0.85"/>
            <circle cx="32" cy="20" r="7" fill="#e8193f" opacity="0.85"/>
            <circle cx="20" cy="32" r="7" fill="#ff4d6d" opacity="0.85"/>
            <circle cx="8" cy="20" r="7" fill="#c8082b" opacity="0.85"/>
            <circle cx="20" cy="20" r="5" fill="#f5d98b"/>
          </svg>
        </div>
      ))}
    </div>
  );
}

/* ==========================================================================
   FLOWER BURST CANVAS (OPEN INVITATION ANIMATION)
   ========================================================================== */

function FlowerBurstCanvas({ active, onDone }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);
    const originX = width / 2;
    const originY = height / 2;

    const petals = Array.from({ length: 90 }, (_, i) => {
      const angle = (i / 90) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const speed = 6 + Math.random() * 11;
      return {
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        size: 14 + Math.random() * 16,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.15,
        color: ["#ff4d6d", "#d30f36", "#e8193f", "#f5d98b", "#ff8099", "#8b001d"][i % 6],
        alpha: 1,
        decay: 0.012 + Math.random() * 0.008,
      };
    });

    let startTime = performance.now();

    function render(now) {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      let alive = false;
      petals.forEach(p => {
        if (p.alpha <= 0) return;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // gravity
        p.rotation += p.vRot;
        p.alpha = Math.max(0, p.alpha - p.decay);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#fff3cd";
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      if (alive && elapsed < 1800) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        onDone();
      }
    }

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [active, onDone]);

  if (!active) return null;
  return <canvas ref={canvasRef} className="burst-canvas" />;
}

/* ==========================================================================
   NEW ROYAL INDIAN VECTOR DESIGN COMPONENTS (EXACT AS USER REFERENCE IMAGES)
   ========================================================================== */

/* 1. Golden Lord Ganesha Emblem */
function GaneshaIconSVG({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ganeshaGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f7e096"/>
          <stop offset="40%" stopColor="#c9a36b"/>
          <stop offset="100%" stopColor="#875e29"/>
        </linearGradient>
      </defs>
      {/* Crown / Mukut */}
      <path d="M 50 6 L 42 22 H 58 Z" fill="url(#ganeshaGold)" stroke="#875e29" strokeWidth="1"/>
      <circle cx="50" cy="11" r="2.5" fill="#c8082b"/>
      {/* Ears & Face Outline */}
      <path d="M 30 28 C 16 22 14 42 32 44 C 36 52 42 56 45 62 C 47 68 43 74 50 74 C 57 74 61 68 56 62 C 53 58 51 52 51 44 C 69 42 70 22 56 28" stroke="url(#ganeshaGold)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Trunk */}
      <path d="M 47 44 C 44 54 43 68 52 70 C 58 71 61 65 57 61 C 54 57 48 60 50 64" stroke="url(#ganeshaGold)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Tilak */}
      <path d="M 44 26 Q 50 23 56 26 M 45 30 Q 50 28 55 30 M 47 34 Q 50 33 53 34" stroke="#c8082b" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="50" cy="21" r="2" fill="#c8082b"/>
    </svg>
  );
}

/* 2. Golden Hanging Bells (Ghanti) */
function HangingBellsSVG() {
  return (
    <div className="hanging-bells-wrap">
      <svg width="85" height="170" viewBox="0 0 85 170" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bellGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fceabb"/>
            <stop offset="50%" stopColor="#c9a36b"/>
            <stop offset="100%" stopColor="#875e29"/>
          </linearGradient>
        </defs>
        {/* Bell String 1 */}
        <line x1="22" y1="0" x2="22" y2="70" stroke="#c9a36b" strokeWidth="1.5" strokeDasharray="3 3"/>
        <circle cx="22" cy="22" r="3" fill="url(#bellGold)"/>
        <circle cx="22" cy="46" r="4" fill="url(#bellGold)"/>
        <path d="M 22 70 C 13 70 10 84 8 92 H 36 C 34 84 31 70 22 70 Z" fill="url(#bellGold)"/>
        <rect x="7" y="92" width="30" height="4" rx="2" fill="#875e29"/>
        <circle cx="22" cy="100" r="3.5" fill="url(#bellGold)"/>

        {/* Bell String 2 (longer) */}
        <line x1="60" y1="0" x2="60" y2="105" stroke="#c9a36b" strokeWidth="1.5" strokeDasharray="3 3"/>
        <circle cx="60" cy="30" r="3" fill="url(#bellGold)"/>
        <circle cx="60" cy="62" r="4.5" fill="url(#bellGold)"/>
        <circle cx="60" cy="88" r="3.5" fill="url(#bellGold)"/>
        <path d="M 60 105 C 49 105 45 120 43 130 H 77 C 75 120 71 105 60 105 Z" fill="url(#bellGold)"/>
        <rect x="42" y="130" width="36" height="5" rx="2" fill="#875e29"/>
        <circle cx="60" cy="140" r="4" fill="url(#bellGold)"/>
      </svg>
    </div>
  );
}

/* 3. Lush Magenta Bougainvillea Drape (Top Corner Floral Vine) */
function BougainvilleaDrapeSVG({ side = "right" }) {
  const isRight = side === "right";
  return (
    <div className={`bougainvillea-drape bougainvillea-${side}`}>
      <svg width="220" height="240" viewBox="0 0 220 240" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ transform: isRight ? "none" : "scaleX(-1)" }}>
        <defs>
          <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3d6b38"/>
            <stop offset="100%" stopColor="#1e3b1a"/>
          </linearGradient>
          <radialGradient id="pinkFlower" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff4d8d"/>
            <stop offset="60%" stopColor="#d91458"/>
            <stop offset="100%" stopColor="#7a0022"/>
          </radialGradient>
          <radialGradient id="deepFlower" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff70a6"/>
            <stop offset="70%" stopColor="#c20d49"/>
            <stop offset="100%" stopColor="#5c001a"/>
          </radialGradient>
        </defs>

        {/* Vines */}
        <path d="M 220 0 C 175 20 140 65 120 120 C 105 160 80 195 30 230" stroke="#3d2817" strokeWidth="3" strokeLinecap="round"/>
        <path d="M 220 35 C 185 60 160 100 145 150 C 135 180 115 210 85 228" stroke="#3d2817" strokeWidth="2" strokeLinecap="round"/>

        {/* Leaves */}
        <path d="M 165 40 C 145 30 140 50 155 60 C 170 55 170 45 165 40 Z" fill="url(#leafGrad)"/>
        <path d="M 130 95 C 110 85 105 105 120 115 C 135 110 135 100 130 95 Z" fill="url(#leafGrad)"/>
        <path d="M 95 150 C 75 140 70 160 85 170 C 100 165 100 155 95 150 Z" fill="url(#leafGrad)"/>

        {/* Bougainvillea Flower Clusters */}
        <g opacity="0.95">
          <circle cx="190" cy="20" r="15" fill="url(#pinkFlower)"/>
          <circle cx="205" cy="35" r="13" fill="url(#deepFlower)"/>
          <circle cx="175" cy="35" r="12" fill="url(#pinkFlower)"/>
          <circle cx="190" cy="50" r="14" fill="url(#deepFlower)"/>

          <circle cx="150" cy="75" r="14" fill="url(#pinkFlower)"/>
          <circle cx="165" cy="90" r="13" fill="url(#deepFlower)"/>
          <circle cx="135" cy="95" r="12" fill="url(#pinkFlower)"/>
          <circle cx="150" cy="110" r="15" fill="url(#deepFlower)"/>

          <circle cx="115" cy="140" r="13" fill="url(#pinkFlower)"/>
          <circle cx="130" cy="155" r="12" fill="url(#deepFlower)"/>
          <circle cx="100" cy="160" r="11" fill="url(#pinkFlower)"/>

          <circle cx="68" cy="200" r="11" fill="url(#pinkFlower)"/>
          <circle cx="80" cy="210" r="10" fill="url(#deepFlower)"/>
          <circle cx="42" cy="225" r="8" fill="url(#pinkFlower)"/>
        </g>
      </svg>
    </div>
  );
}

/* 4. Ornate Mughal Arch / Jharokha Frame */
function JharokhaArchSVG({ children }) {
  return (
    <div className="jharokha-arch-wrapper">
      <div className="jharokha-arch-border">
        {children}
      </div>
    </div>
  );
}

/* 5. Ornate Filigree Gold Corners */
function OrnateFiligreeCornerSVG({ position = "tl" }) {
  return (
    <div className={`filigree-corner filigree-${position}`}>
      <svg width="65" height="65" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 4 4 H 96 M 4 4 V 96" stroke="#c9a36b" strokeWidth="2.5"/>
        <path d="M 12 12 H 80 M 12 12 V 80" stroke="#9e7535" strokeWidth="1" strokeDasharray="3 2"/>
        <path d="M 4 45 C 24 45 45 24 45 4" stroke="#c9a36b" strokeWidth="1.5" fill="none"/>
        <circle cx="18" cy="18" r="4" fill="#c9a36b"/>
        <circle cx="32" cy="12" r="2.5" fill="#9e7535"/>
        <circle cx="12" cy="32" r="2.5" fill="#9e7535"/>
      </svg>
    </div>
  );
}

/* 6. Gold Card Center Ornament Divider */
function CardDividerSVG() {
  return (
    <div className="card-divider-wrap">
      <svg width="200" height="28" viewBox="0 0 200 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 10 14 H 75 M 125 14 H 190" stroke="#c9a36b" strokeWidth="1.2"/>
        <circle cx="75" cy="14" r="3" fill="#c9a36b"/>
        <circle cx="125" cy="14" r="3" fill="#c9a36b"/>
        <path d="M 100 3 L 107 14 L 100 25 L 93 14 Z" fill="#c9a36b"/>
        <path d="M 100 7 C 88 7 80 14 80 14 C 80 14 88 21 100 21 C 112 21 120 14 120 14 C 120 14 112 7 100 7 Z" stroke="#9e7535" strokeWidth="1" fill="none"/>
      </svg>
    </div>
  );
}

/* ==========================================================================
   SHARED COMPONENTS
   ========================================================================== */

function RoyalCornerOrnament({ position }) {
  return (
    <div className={`royal-corner-motif corner-${position}`}>
      <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
        <path d="M 5 5 L 95 5 M 5 5 L 5 95" stroke="#c9a36b" strokeWidth="2.5"/>
        <path d="M 13 13 L 72 13 M 13 13 L 13 72" stroke="#9e7535" strokeWidth="1" strokeDasharray="3 2"/>
        <path d="M 5 58 C 18 22 58 5 95 5" stroke="#c9a36b" strokeWidth="1.2" fill="none"/>
        <circle cx="20" cy="20" r="5" fill="#c9a36b"/>
        <circle cx="34" cy="12" r="3" fill="#9e7535"/>
        <circle cx="12" cy="34" r="3" fill="#9e7535"/>
      </svg>
    </div>
  );
}

function RoyalMandalaSVG({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="46" stroke="#c9a36b" strokeWidth="1.5" strokeDasharray="3 3"/>
      <circle cx="50" cy="50" r="36" stroke="#9e7535" strokeWidth="1"/>
      <circle cx="50" cy="50" r="26" stroke="#c9a36b" strokeWidth="1.5"/>
      <g stroke="#9e7535" strokeWidth="1.2"><path d="M 50 12 L 50 88 M 12 50 L 88 50"/><path d="M 23 23 L 77 77 M 23 77 L 77 23"/></g>
      <circle cx="50" cy="50" r="8" fill="#c9a36b"/>
      <circle cx="50" cy="50" r="4" fill="#fffdf9"/>
    </svg>
  );
}

function November2026Calendar() {
  const daysOfWeek = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  return (
    <div className="calendar-card">
      <RoyalCornerOrnament position="tl"/><RoyalCornerOrnament position="tr"/>
      <RoyalCornerOrnament position="bl"/><RoyalCornerOrnament position="br"/>
      <div className="calendar-header"><CalendarDays className="cal-icon" size={24}/><h4>NOVEMBER 2026</h4></div>
      <div className="calendar-grid-header">{daysOfWeek.map(d => <span key={d}>{d}</span>)}</div>
      <div className="calendar-grid">
        {days.map(day => (
          <div key={day} className={`cal-day ${day === 25 ? "wedding-highlight" : ""}`}>
            {day === 25
              ? <div className="wedding-day-box"><Heart size={13} className="cal-heart" fill="currentColor"/><span className="day-num">25</span></div>
              : <span>{day}</span>}
          </div>
        ))}
      </div>
      <div className="calendar-footer-note"><Sparkles size={15}/><span>WEDDING DAY · WEDNESDAY, 25 NOVEMBER 2026 · 7:00 PM</span></div>
    </div>
  );
}

/* ==========================================================================
   PAGE 1 — WELCOME / OPENING INVITATION CARD
   ========================================================================== */

function WelcomePage({ onOpen }) {
  return (
    <motion.div className="welcome-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: 0.6 }}>
      <FallingFlowers/>
      <div className="welcome-card-wrap">
        <motion.div className="welcome-card" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
          <FloralCornerSVG position="tl"/><FloralCornerSVG position="tr"/>
          <FloralCornerSVG position="bl"/><FloralCornerSVG position="br"/>
          <div className="card-inner-border"/>
          <div className="heart-seal"><Heart size={20} fill="currentColor"/></div>
          <p className="small-caps">TOGETHER WITH THEIR FAMILIES</p>
          <div className="couple-names-header">
            <h1 className="name-title">AARZOO</h1>
            <div className="ampersand-wrapper"><span className="line-dec"/><span className="ampersand">&</span><span className="line-dec"/></div>
            <h1 className="name-title">AKASH</h1>
          </div>
          <p className="date-line">NOVEMBER 25, 2026</p>
          <p className="invite-line">CORDIALLY INVITE YOU TO CELEBRATE THE WEDDING OF</p>
          <motion.button className="primary-btn open-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.94 }} onClick={onOpen}>
            <span>OPEN INVITATION</span><Sparkles size={17}/>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   COUNTDOWN INLINE
   ========================================================================== */

function CountdownInline() {
  const cd = useCountdown(WEDDING_DATE);
  return (
    <div className="ms-countdown">
      {Object.entries(cd).map(([label, value]) => (
        <div className="ms-count-box" key={label}>
          <strong>{String(value).padStart(2, "0")}</strong>
          <span>{label.toUpperCase()}</span>
        </div>
      ))}
    </div>
  );
}

/* ==========================================================================
   PAGE 2 — MAIN INVITATION CARD (PURE LUXURY DESIGN, NO MONUMENT IMAGES)
   ========================================================================== */

function MainPage({ dateText, playing, onToggleMusic }) {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <motion.div className="main-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <FallingFlowers/>
      <button className="music-btn" onClick={onToggleMusic} aria-label="TOGGLE MUSIC">
        {playing ? <Pause size={18}/> : <Play size={18}/>}
      </button>

      <div className="main-content-wrapper">

        {/* ── 1. MAIN INVITATION CARD HEADER (EXACT REFERENCE DESIGN) ── */}
        <section className="card-section main-hero-card">
          <HangingBellsSVG/>
          <BougainvilleaDrapeSVG side="right"/>
          <OrnateFiligreeCornerSVG position="tl"/>
          <OrnateFiligreeCornerSVG position="tr"/>
          <OrnateFiligreeCornerSVG position="bl"/>
          <OrnateFiligreeCornerSVG position="br"/>

          <div className="card-top-emblem">
            <GaneshaIconSVG size={60}/>
            <p className="shlok-line">॥ श्री गणेशाय नमः ॥</p>
          </div>

          <JharokhaArchSVG>
            <p className="eyebrow-small">TOGETHER WITH THEIR FAMILIES</p>

            <div className="parents-names-row">
              <span>MR. &amp; MRS. SINGH</span>
              <span className="dot-sep">·</span>
              <span>MR. &amp; MRS. SINGH</span>
            </div>

            <p className="invite-announcement">WE JOYFULLY ANNOUNCE THE WEDDING OF OUR CHILDREN</p>

            <div className="couple-card-names">
              <h1 className="couple-name">AARZOO SINGH</h1>
              <div className="amp-divider">
                <span className="amp-line"/>
                <span className="amp-sym">&amp;</span>
                <span className="amp-line"/>
              </div>
              <h1 className="couple-name">AKASH SINGH</h1>
            </div>

            <p className="wedding-event-date">{dateText}</p>
            <p className="wedding-venue-line"><MapPin size={13}/>&nbsp;VIRAJ INTERNATIONAL HOTEL · VARANASI</p>

            <div className="hero-countdown-wrap">
              <p className="cd-title">COUNTDOWN TO THE CELEBRATION</p>
              <CountdownInline/>
            </div>
          </JharokhaArchSVG>
        </section>

        {/* ── 2. SHUBH VIVAH BLESSING & SACRED VOWS ── */}
        <section className="card-section">
          <OrnateFiligreeCornerSVG position="tl"/>
          <OrnateFiligreeCornerSVG position="tr"/>
          <OrnateFiligreeCornerSVG position="bl"/>
          <OrnateFiligreeCornerSVG position="br"/>
          <CardDividerSVG/>
          <p className="shlok-title">॥ शुभ विवाह ॥</p>
          <h2 className="section-title">WE INVITE YOU TO CELEBRATE</h2>
          <p className="body-copy">
            As two souls bind together in eternal love, we request the honour of your presence
            to bestow your grace and blessings upon Aarzoo and Akash as they take their sacred vows.
          </p>
          <div className="royal-divider"><span className="div-line"/><Heart size={14} fill="#c9a36b"/><span className="div-line"/></div>
        </section>

        {/* ── 3. SAVE THE DATE & CALENDAR ── */}
        <section className="card-section">
          <OrnateFiligreeCornerSVG position="tl"/>
          <OrnateFiligreeCornerSVG position="tr"/>
          <OrnateFiligreeCornerSVG position="bl"/>
          <OrnateFiligreeCornerSVG position="br"/>
          <CardDividerSVG/>
          <p className="eyebrow">SAVE THE DATE</p>
          <h2 className="section-title">NOVEMBER 2026</h2>
          <November2026Calendar/>
        </section>

        {/* ── 4. WEDDING EVENTS ── */}
        <section className="card-section">
          <OrnateFiligreeCornerSVG position="tl"/>
          <OrnateFiligreeCornerSVG position="tr"/>
          <OrnateFiligreeCornerSVG position="bl"/>
          <OrnateFiligreeCornerSVG position="br"/>
          <CardDividerSVG/>
          <p className="eyebrow">CEREMONY &amp; EVENTS</p>
          <h2 className="section-title">THE CELEBRATIONS</h2>
          <div className="event-grid">
            {[
              { name:"HALDI", icon:"🌼", desc:"A morning filled with laughter, turmeric, and bright yellow hues.", date:"To Be Announced", clr:"#f5c842" },
              { name:"MEHNDI", icon:"🌿", desc:"Intricate henna patterns, sweet music and warm conversations.", date:"To Be Announced", clr:"#4a7c5c" },
              { name:"SANGEET", icon:"🎶", desc:"A night of music, dance performances and festive joy.", date:"To Be Announced", clr:"#7a4a8c" },
              { name:"WEDDING", icon:"💍", desc:"The main ceremony — seven sacred vows and eternal union.", date:"25 NOVEMBER 2026", clr:"#c8082b", highlight:true },
            ].map((ev, i) => (
              <div key={ev.name} className={`event-box ${ev.highlight ? "event-box-main" : ""}`} style={{"--accent": ev.clr}}>
                <span className="event-icon-badge">{ev.icon}</span>
                <h4>{ev.name}</h4>
                <p>{ev.desc}</p>
                <span className="event-badge">{ev.date}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5. LOCATION & VENUE (WITH LIVE GOOGLE MAPS) ── */}
        <section className="card-section venue-card-section">
          <OrnateFiligreeCornerSVG position="tl"/>
          <OrnateFiligreeCornerSVG position="tr"/>
          <OrnateFiligreeCornerSVG position="bl"/>
          <OrnateFiligreeCornerSVG position="br"/>
          <CardDividerSVG/>
          <p className="eyebrow">WEDDING VENUE</p>
          <h2 className="section-title">VIRAJ INTERNATIONAL HOTEL</h2>

          <div className="venue-card-split">
            <div className="venue-info-pane">
              <p className="venue-address"><MapPin size={14} className="pin-icon"/>&nbsp;Babatpur, Varanasi, Uttar Pradesh</p>
              <p className="venue-timing"><Clock3 size={14} className="pin-icon"/>&nbsp;Wednesday · 25 November 2026 · 7:00 PM</p>
              <a className="primary-btn map-direct-btn" target="_blank" rel="noreferrer"
                href="https://www.google.com/maps/search/?api=1&query=Viraj+International+Hotel+Babatpur+Varanasi">
                <MapPin size={15}/>&nbsp;OPEN IN GOOGLE MAPS
              </a>
            </div>

            <div className="venue-map-pane">
              <div className="google-map-frame">
                <iframe
                  title="Viraj International Hotel, Varanasi"
                  src="https://maps.google.com/maps?q=Viraj+International+Hotel+Babatpur+Varanasi+Uttar+Pradesh&output=embed&z=15"
                  width="100%" height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. DRESS CODE ── */}
        <section className="card-section">
          <OrnateFiligreeCornerSVG position="tl"/>
          <OrnateFiligreeCornerSVG position="tr"/>
          <OrnateFiligreeCornerSVG position="bl"/>
          <OrnateFiligreeCornerSVG position="br"/>
          <CardDividerSVG/>
          <p className="eyebrow">A LITTLE SUGGESTION</p>
          <h2 className="section-title">DRESS CODE</h2>
          <p className="body-copy">Festive Indian Attire · Traditional Elegance, Pastels &amp; Floral hues</p>
          <div className="dress-swatches">
            <span className="swatch-1" title="PASTEL PEACH"/>
            <span className="swatch-2" title="DEEP ROSE"/>
            <span className="swatch-3" title="GOLDEN AMBER"/>
            <span className="swatch-4" title="FESTIVE RED"/>
          </div>
        </section>

        {/* ── 7. GUESTBOOK ── */}
        <section className="card-section">
          <OrnateFiligreeCornerSVG position="tl"/>
          <OrnateFiligreeCornerSVG position="tr"/>
          <OrnateFiligreeCornerSVG position="bl"/>
          <OrnateFiligreeCornerSVG position="br"/>
          <RoyalMandalaSVG size={54}/>
          <p className="eyebrow">LEAVE A BLESSING</p>
          <h2 className="section-title">GUESTBOOK</h2>
          {!sent
            ? <form onSubmit={e => { e.preventDefault(); if (message.trim()) setSent(true); }} className="guest-form">
                <textarea value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="Write your warm wishes for Aarzoo & Akash..." rows="4"/>
                <button className="primary-btn" type="submit"><Send size={14}/>&nbsp;SEND BLESSING</button>
              </form>
            : <motion.div className="success-message" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <Heart fill="#c8082b" size={24}/>
                <p>YOUR BLESSING HAS BEEN RECEIVED. THANK YOU!</p>
              </motion.div>
          }
        </section>

        {/* ── 8. FOOTER ── */}
        <footer className="card-footer">
          <RoyalMandalaSVG size={58}/>
          <h2 className="footer-title">AARZOO <span>&amp;</span> AKASH</h2>
          <p className="footer-sub">WE CAN'T WAIT TO CELEBRATE WITH YOU.</p>
          <div className="footer-meta">
            <CalendarDays size={14}/>&nbsp;25 · 11 · 2026&nbsp;
            <span className="sep">·</span>
            &nbsp;<Clock3 size={14}/>&nbsp;7:00 PM&nbsp;
            <span className="sep">·</span>
            &nbsp;<MapPin size={14}/>&nbsp;VARANASI
          </div>
        </footer>

      </div>
    </motion.div>
  );
}

/* ==========================================================================
   APP ROUTER
   ========================================================================== */

function App() {
  const [page, setPage] = useState("welcome");
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const dateText = useMemo(() =>
    new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
      .format(WEDDING_DATE).toUpperCase(),
  []);

  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { try { await audio.play(); setPlaying(true); } catch { /* silent */ } }
  }

  function handleOpenInvitation() {
    playSoothingChime();
    setPage("bursting");
    toggleMusic();
  }

  const handleBurstDone = useCallback(() => {
    setPage("main");
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <>
      <audio ref={audioRef} loop src="/music/perfect.mp3"/>
      <FlowerBurstCanvas active={page === "bursting"} onDone={handleBurstDone}/>
      <AnimatePresence mode="wait">
        {(page === "welcome" || page === "bursting") && <WelcomePage key="welcome" onOpen={handleOpenInvitation}/>}
        {page === "main" && <MainPage key="main" dateText={dateText} playing={playing} onToggleMusic={toggleMusic}/>}
      </AnimatePresence>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App/>);
