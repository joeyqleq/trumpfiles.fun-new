"use client";

import { useEffect, useRef, useState, memo } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DecorItem {
  id: number;
  src: string;
  size: number;
  top: string;
  left: string;
  rotate: number;
  duration: number;
  opacity: number;
  blur: number;
  zIndex: number;
}

interface MissileInstance {
  id: number;
  img: string;
  // start position (vw/vh units as percentages, can be negative/>100 for off-screen)
  startX: number;
  startY: number;
  // end position
  endX: number;
  endY: number;
  // visual angle (degrees) missile image should be rotated to face direction of travel
  angle: number;
  duration: number; // seconds
  delay: number;    // seconds
  startScale: number;
  endScale: number;
  startOpacity: number;
}

// ─── Config ──────────────────────────────────────────────────────────────────

const DECOR_SVGS = [
  { src: "/images/bg-decor_grey-x.svg",              minSize: 60,  maxSize: 200 },
  { src: "/images/bg-decor_orange-x.svg",            minSize: 50,  maxSize: 180 },
  { src: "/images/bg-decor_hula-hoops.svg",          minSize: 120, maxSize: 380 },
  { src: "/images/bg-decor_wireframe_donut.svg",     minSize: 150, maxSize: 400 },
  { src: "/images/bg-decor_twinkle_star.svg",        minSize: 40,  maxSize: 140 },
  { src: "/images/bg-decor_repeating_front-slash.svg", minSize: 80, maxSize: 220 },
  { src: "/images/bg-decor_vertical_ttf_initials.svg", minSize: 60, maxSize: 160 },
  { src: "/images/trump_logo_ascii.svg",             minSize: 80,  maxSize: 200 },
];

const MISSILE_IMGS = [
  "/images/trump_ascii_jack_1_no-bg.png",
  "/images/trump_ascii_jack_2_signature_no-bg.png",
  "/images/trump_ascii_jack_3_no-bg.png",
  "/images/trump_ascii_jack_4_red_signature_no-bg.png",
];

const DECOR_COUNT = 14;
const MAX_MISSILES = 3;
const MISSILE_INTERVAL_MIN = 6000;  // ms between launches
const MISSILE_INTERVAL_MAX = 14000;

// ─── Seeded PRNG (deterministic on server, no hydration mismatch) ────────────

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Decorator Layer ─────────────────────────────────────────────────────────

const DecorLayer = memo(function DecorLayer() {
  const rand = mulberry32(0xdeadbeef);

  const items: DecorItem[] = Array.from({ length: DECOR_COUNT }, (_, i) => {
    const def = DECOR_SVGS[i % DECOR_SVGS.length];
    const r = () => rand();
    const size = Math.round(def.minSize + r() * (def.maxSize - def.minSize));
    // Spread items across the full page (not just viewport) using percentage positions
    const topPct = r() * 95;
    const leftPct = r() * 95;
    const rotateDeg = Math.round(r() * 360);
    // Varied rotation speeds: slow (40-90s) and fast (8-20s) mixed
    const duration = r() > 0.6
      ? Math.round(8 + r() * 12)    // fast 8-20s
      : Math.round(40 + r() * 50);  // slow 40-90s
    const opacity = 0.03 + r() * 0.09; // 0.03–0.12
    const blur = r() > 0.5 ? 0 : Math.round(r() * 2 * 10) / 10; // 0 or 0-2px

    return {
      id: i,
      src: def.src,
      size,
      top: `${topPct.toFixed(1)}%`,
      left: `${leftPct.toFixed(1)}%`,
      rotate: rotateDeg,
      duration,
      opacity,
      blur,
      zIndex: 1,
    };
  });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute"
          style={{
            top: item.top,
            left: item.left,
            width: item.size,
            height: item.size,
            opacity: item.opacity,
            filter: item.blur > 0 ? `blur(${item.blur}px)` : undefined,
            zIndex: item.zIndex,
            animation: `spin-${item.duration > 20 ? "slow" : "fast"} ${item.duration}s linear infinite`,
            // Use CSS custom property so we can vary direction per item
            animationDirection: item.id % 3 === 0 ? "reverse" : "normal",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.src}
            alt=""
            width={item.size}
            height={item.size}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      ))}
    </div>
  );
});

// ─── Missile Component ───────────────────────────────────────────────────────

function Missile({ m }: { m: MissileInstance }) {
  const dx = m.endX - m.startX;
  const dy = m.endY - m.startY;
  // The translate keyframe uses these distances
  const translateX = `${dx}vw`;
  const translateY = `${dy}vh`;

  return (
    <div
      aria-hidden="true"
      className="absolute pointer-events-none"
      style={{
        left: `${m.startX}vw`,
        top: `${m.startY}vh`,
        width: 80,
        height: 80,
        zIndex: 2,
        animationName: "missile-fly",
        animationDuration: `${m.duration}s`,
        animationDelay: `${m.delay}s`,
        animationTimingFunction: "linear",
        animationFillMode: "both",
        // Pass trajectory as CSS vars for the keyframe
        ["--tx" as string]: translateX,
        ["--ty" as string]: translateY,
        ["--ss" as string]: m.startScale,
        ["--es" as string]: m.endScale,
        ["--so" as string]: m.startOpacity,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={m.img}
        alt=""
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          transform: `rotate(${m.angle}deg)`,
          filter: "drop-shadow(0 0 4px rgba(255,100,0,0.3))",
        }}
      />
    </div>
  );
}

// ─── Missile Manager ─────────────────────────────────────────────────────────

function MissileLayer() {
  const [missiles, setMissiles] = useState<MissileInstance[]>([]);
  const counterRef = useRef(0);
  const activeRef = useRef(0);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    function spawnMissile() {
      if (activeRef.current >= MAX_MISSILES) {
        timeout = setTimeout(spawnMissile, 2000);
        return;
      }

      const id = counterRef.current++;
      const img = MISSILE_IMGS[Math.floor(Math.random() * MISSILE_IMGS.length)];

      // Pick a random launch edge: 0=left, 1=right, 2=top, 3=bottom
      const edge = Math.floor(Math.random() * 4);
      let startX: number, startY: number, endX: number, endY: number, angle: number;

      // Travel distance: always crosses most of the screen
      const travelFrac = 0.6 + Math.random() * 0.35; // 60-95% of screen

      if (edge === 0) {
        // From left → right, going slightly upward or downward
        startX = -8;
        startY = 10 + Math.random() * 80;
        const spread = (Math.random() - 0.3) * 60; // bias upward
        endX = startX + 90 * travelFrac;
        endY = startY + spread * travelFrac;
        angle = Math.atan2((endY - startY) * (9 / 16), endX - startX) * (180 / Math.PI);
      } else if (edge === 1) {
        // From right → left
        startX = 108;
        startY = 10 + Math.random() * 80;
        const spread = (Math.random() - 0.5) * 50;
        endX = startX - 90 * travelFrac;
        endY = startY + spread * travelFrac;
        angle = Math.atan2((endY - startY) * (9 / 16), endX - startX) * (180 / Math.PI);
      } else if (edge === 2) {
        // From top → down-right or down-left
        startX = 10 + Math.random() * 80;
        startY = -8;
        const spreadX = (Math.random() - 0.5) * 60;
        endX = startX + spreadX * travelFrac;
        endY = startY + 80 * travelFrac;
        angle = Math.atan2((endY - startY) * (9 / 16), endX - startX) * (180 / Math.PI);
      } else {
        // From bottom → up (missiles going upward)
        startX = 10 + Math.random() * 80;
        startY = 108;
        const spreadX = (Math.random() - 0.5) * 50;
        endX = startX + spreadX * travelFrac;
        endY = startY - 80 * travelFrac;
        angle = Math.atan2((endY - startY) * (9 / 16), endX - startX) * (180 / Math.PI) - 180;
      }

      // Scale: starts bigger, ends smaller (fading into distance)
      const startScale = 0.5 + Math.random() * 0.3;
      const endScale = startScale * (0.2 + Math.random() * 0.3);
      const duration = 8 + Math.random() * 14;

      const missile: MissileInstance = {
        id,
        img,
        startX, startY, endX, endY,
        angle,
        duration,
        delay: 0,
        startScale,
        endScale,
        startOpacity: 0.25 + Math.random() * 0.35,
      };

      activeRef.current++;
      setMissiles((prev) => [...prev, missile]);

      // Remove after animation completes
      setTimeout(() => {
        activeRef.current = Math.max(0, activeRef.current - 1);
        setMissiles((prev) => prev.filter((m) => m.id !== id));
      }, duration * 1000 + 200);

      // Schedule next
      const interval = MISSILE_INTERVAL_MIN + Math.random() * (MISSILE_INTERVAL_MAX - MISSILE_INTERVAL_MIN);
      timeout = setTimeout(spawnMissile, interval);
    }

    // Stagger first launches
    const t1 = setTimeout(spawnMissile, 2000);
    const t2 = setTimeout(spawnMissile, 7000);
    const t3 = setTimeout(spawnMissile, 12000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true" style={{ zIndex: 2 }}>
      {missiles.map((m) => (
        <Missile key={m.id} m={m} />
      ))}
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export default function GlobalBackground() {
  return (
    <>
      {/* Decorators: fixed, behind everything */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
        aria-hidden="true"
      >
        <DecorLayer />
      </div>

      {/* Missiles */}
      <MissileLayer />

      {/* CSS keyframes injected once */}
      <style>{`
        @keyframes missile-fly {
          0%   { transform: translate(0, 0) scale(var(--ss)); opacity: var(--so); }
          10%  { opacity: var(--so); }
          85%  { opacity: calc(var(--so) * 0.3); }
          100% { transform: translate(var(--tx), var(--ty)) scale(var(--es)); opacity: 0; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spin-fast {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .missile-fly, [style*="missile-fly"] { animation: none !important; }
          [style*="spin-slow"], [style*="spin-fast"] { animation: none !important; }
        }
      `}</style>
    </>
  );
}
