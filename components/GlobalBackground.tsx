"use client";

import { useEffect, useRef, useState, memo } from "react";

// ─── ONLY these assets ───────────────────────────────────────────────────────

const JACK_IMGS = [
  "/images/trump_ascii_jack_1_no-bg.png",
  "/images/trump_ascii_jack_2_signature_no-bg.png",
  "/images/trump_ascii_jack_3_no-bg.png",
  "/images/trump_ascii_jack_4_red_signature_no-bg.png",
];

const STAR_SVG = "/images/bg-decor_twinkle_star.svg";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FloatingElement {
  id: number;
  type: "jack" | "star";
  src: string;
  x: number;       // % from left
  y: number;       // % from top
  size: number;    // px
  opacity: number;
  blur: number;    // px — depth effect
  drift: { x: number; y: number; duration: number }; // slow float direction
  delay: number;   // animation-delay seconds
}

// ─── Seeded random for SSR consistency ────────────────────────────────────────

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Generate static background elements ─────────────────────────────────────

function generateElements(): FloatingElement[] {
  const rand = mulberry32(0xCAFE);
  const elements: FloatingElement[] = [];
  let id = 0;

  // 6 ASCII Jack cards — scattered, varied sizes, depths
  for (let i = 0; i < 6; i++) {
    const src = JACK_IMGS[Math.floor(rand() * JACK_IMGS.length)];
    elements.push({
      id: id++,
      type: "jack",
      src,
      x: rand() * 90 + 5,               // 5%-95%
      y: rand() * 85 + 5,               // spread across page height
      size: 40 + rand() * 80,           // 40px-120px (varied)
      opacity: 0.03 + rand() * 0.06,    // very subtle: 0.03-0.09
      blur: rand() > 0.5 ? 0.5 + rand() * 2 : 0,  // some blurred (depth), some sharp
      drift: {
        x: (rand() - 0.5) * 12,         // slight horizontal drift ±6px
        y: (rand() - 0.5) * 8,          // slight vertical drift ±4px
        duration: 15 + rand() * 25,     // 15-40s per cycle
      },
      delay: rand() * 10,               // stagger start
    });
  }

  // 8 twinkling stars — smaller, varied positions
  for (let i = 0; i < 8; i++) {
    elements.push({
      id: id++,
      type: "star",
      src: STAR_SVG,
      x: rand() * 95 + 2.5,
      y: rand() * 90 + 5,
      size: 12 + rand() * 28,           // 12px-40px (small)
      opacity: 0.04 + rand() * 0.08,    // subtle: 0.04-0.12
      blur: rand() > 0.7 ? rand() * 1.5 : 0,
      drift: {
        x: (rand() - 0.5) * 6,
        y: (rand() - 0.5) * 6,
        duration: 20 + rand() * 30,
      },
      delay: rand() * 15,
    });
  }

  return elements;
}

const ELEMENTS = generateElements();

// ─── Missile system (ASCII Jacks flying across screen) ───────────────────────

interface MissileInstance {
  id: number;
  img: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  angle: number;
  duration: number;
  startScale: number;
  endScale: number;
  startOpacity: number;
}

function MissileLayer() {
  const [missiles, setMissiles] = useState<MissileInstance[]>([]);
  const counterRef = useRef(0);
  const activeRef = useRef(0);
  const MAX = 2;

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    function spawn() {
      if (activeRef.current >= MAX) {
        timeout = setTimeout(spawn, 3000);
        return;
      }

      const id = counterRef.current++;
      const img = JACK_IMGS[Math.floor(Math.random() * JACK_IMGS.length)];

      // Random edge: 0=left, 1=right, 2=top, 3=bottom
      const edge = Math.floor(Math.random() * 4);
      let startX: number, startY: number, endX: number, endY: number;

      if (edge === 0) {
        startX = -10; startY = 15 + Math.random() * 70;
        endX = 105 + Math.random() * 10; endY = startY + (Math.random() - 0.4) * 40;
      } else if (edge === 1) {
        startX = 110; startY = 15 + Math.random() * 70;
        endX = -10 - Math.random() * 10; endY = startY + (Math.random() - 0.5) * 35;
      } else if (edge === 2) {
        startX = 15 + Math.random() * 70; startY = -10;
        endX = startX + (Math.random() - 0.5) * 40; endY = 105 + Math.random() * 10;
      } else {
        startX = 15 + Math.random() * 70; startY = 110;
        endX = startX + (Math.random() - 0.5) * 40; endY = -10 - Math.random() * 10;
      }

      const angle = Math.atan2((endY - startY), (endX - startX)) * (180 / Math.PI);
      const startScale = 0.35 + Math.random() * 0.25;
      const endScale = startScale * (0.15 + Math.random() * 0.25);
      const duration = 10 + Math.random() * 18;

      const missile: MissileInstance = {
        id, img, startX, startY, endX, endY, angle, duration, startScale, endScale,
        startOpacity: 0.12 + Math.random() * 0.18,
      };

      activeRef.current++;
      setMissiles(prev => [...prev, missile]);

      setTimeout(() => {
        activeRef.current = Math.max(0, activeRef.current - 1);
        setMissiles(prev => prev.filter(m => m.id !== id));
      }, duration * 1000 + 500);

      // Next spawn: 10-25s apart (very infrequent)
      timeout = setTimeout(spawn, 10000 + Math.random() * 15000);
    }

    const t1 = setTimeout(spawn, 5000);
    const t2 = setTimeout(spawn, 18000);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(timeout); };
  }, []);

  return (
    <>
      {missiles.map(m => {
        const tx = `${m.endX - m.startX}vw`;
        const ty = `${m.endY - m.startY}vh`;
        return (
          <div
            key={m.id}
            className="absolute pointer-events-none"
            style={{
              left: `${m.startX}vw`,
              top: `${m.startY}vh`,
              width: 70,
              height: 70,
              zIndex: 2,
              animation: `missile-fly ${m.duration}s linear forwards`,
              ["--tx" as string]: tx,
              ["--ty" as string]: ty,
              ["--ss" as string]: m.startScale,
              ["--es" as string]: m.endScale,
              ["--so" as string]: m.startOpacity,
            }}
            aria-hidden="true"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={m.img}
              alt=""
              style={{
                width: "100%", height: "100%", objectFit: "contain",
                transform: `rotate(${m.angle}deg)`,
                opacity: 0.9,
              }}
            />
          </div>
        );
      })}
    </>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function GlobalBackground() {
  return (
    <>
      {/* Static floating elements — NO rotation, just gentle drift */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }} aria-hidden="true">
        {ELEMENTS.map(el => (
          <div
            key={el.id}
            className="absolute"
            style={{
              left: `${el.x}%`,
              top: `${el.y}%`,
              width: el.size,
              height: el.size,
              opacity: el.opacity,
              filter: el.blur > 0 ? `blur(${el.blur}px)` : undefined,
              animation: `drift-${el.id} ${el.drift.duration}s ease-in-out infinite alternate`,
              animationDelay: `${el.delay}s`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={el.src}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        ))}

        {/* Missiles */}
        <MissileLayer />
      </div>

      {/* Keyframes */}
      <style>{`
        ${ELEMENTS.map(el => `
          @keyframes drift-${el.id} {
            0% { transform: translate(0, 0); }
            100% { transform: translate(${el.drift.x}px, ${el.drift.y}px); }
          }
        `).join("")}

        @keyframes missile-fly {
          0%   { transform: translate(0, 0) scale(var(--ss)); opacity: var(--so); }
          15%  { opacity: var(--so); }
          80%  { opacity: calc(var(--so) * 0.25); }
          100% { transform: translate(var(--tx), var(--ty)) scale(var(--es)); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          [style*="drift-"], [style*="missile-fly"] { animation: none !important; }
        }
      `}</style>
    </>
  );
}
