"use client";

// Kippah (yarmulke) SVG component — Israeli flag colors (#0038B8 blue + white)
// size: "sm" = chat button (24px), "lg" = chat header (48px)

export default function Kippah({
  size = "sm",
  className = "",
}: {
  size?: "sm" | "lg";
  className?: string;
}) {
  const d = size === "sm" ? 24 : 48;
  const r = d / 2;

  // Proportional values
  const domeH = d * 0.62;  // dome height
  const rimH  = d * 0.15;  // rim height
  const rimY  = d - rimH;

  return (
    <svg
      width={d}
      height={d}
      viewBox={`0 0 ${d} ${d}`}
      xmlns="http://www.w3.org/2000/svg"
      className={`kippah ${size} ${className}`}
      style={{ overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`kippah-grad-${size}`} cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#1e5fc8" />
          <stop offset="60%" stopColor="#0038B8" />
          <stop offset="100%" stopColor="#001f6e" />
        </radialGradient>
        <radialGradient id={`kippah-sheen-${size}`} cx="40%" cy="20%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.35" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <filter id={`kippah-shadow-${size}`}>
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#0038B8" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* Drop shadow under rim */}
      <ellipse
        cx={r}
        cy={rimY + rimH * 0.9}
        rx={r * 0.88}
        ry={rimH * 0.45}
        fill="rgba(0,0,0,0.25)"
      />

      {/* Main dome body */}
      <path
        d={`
          M ${r * 0.12} ${rimY}
          Q ${r * 0.1} ${d * 0.05} ${r} ${d * 0.04}
          Q ${r * 1.9} ${d * 0.05} ${r * 1.88} ${rimY}
          Z
        `}
        fill={`url(#kippah-grad-${size})`}
        filter={`url(#kippah-shadow-${size})`}
      />

      {/* White horizontal stripe near top (Israeli flag motif) */}
      <path
        d={`
          M ${r * 0.22} ${d * 0.28}
          Q ${r * 0.18} ${d * 0.22} ${r} ${d * 0.2}
          Q ${r * 1.82} ${d * 0.22} ${r * 1.78} ${d * 0.28}
          Q ${r * 1.82} ${d * 0.35} ${r} ${d * 0.34}
          Q ${r * 0.18} ${d * 0.35} ${r * 0.22} ${d * 0.28}
          Z
        `}
        fill="white"
        opacity="0.85"
      />

      {/* White horizontal stripe near bottom */}
      <path
        d={`
          M ${r * 0.14} ${rimY - d * 0.12}
          Q ${r * 0.12} ${rimY - d * 0.17} ${r} ${rimY - d * 0.19}
          Q ${r * 1.88} ${rimY - d * 0.17} ${r * 1.86} ${rimY - d * 0.12}
          Q ${r * 1.88} ${rimY - d * 0.07} ${r} ${rimY - d * 0.08}
          Q ${r * 0.12} ${rimY - d * 0.07} ${r * 0.14} ${rimY - d * 0.12}
          Z
        `}
        fill="white"
        opacity="0.85"
      />

      {/* Glassy sheen */}
      <path
        d={`
          M ${r * 0.3} ${rimY * 0.85}
          Q ${r * 0.28} ${d * 0.06} ${r * 0.85} ${d * 0.05}
          Q ${r * 0.55} ${d * 0.05} ${r * 0.52} ${rimY * 0.85}
          Z
        `}
        fill={`url(#kippah-sheen-${size})`}
      />

      {/* Rim band */}
      <ellipse
        cx={r}
        cy={rimY}
        rx={r * 0.88}
        ry={rimH}
        fill="#001f6e"
      />
      <ellipse
        cx={r}
        cy={rimY - rimH * 0.2}
        rx={r * 0.88}
        ry={rimH * 0.6}
        fill="#0038B8"
        opacity="0.6"
      />

      {/* Subtle Star of David on large size only */}
      {size === "lg" && (
        <g transform={`translate(${r}, ${d * 0.52})`} opacity="0.25">
          <polygon
            points={`0,${-d * 0.07} ${d * 0.06},${d * 0.035} ${-d * 0.06},${d * 0.035}`}
            fill="white"
          />
          <polygon
            points={`0,${d * 0.07} ${d * 0.06},${-d * 0.035} ${-d * 0.06},${-d * 0.035}`}
            fill="white"
          />
        </g>
      )}

      <style>{`
        @keyframes kippah-bob {
          0%, 100% { transform: rotate(-3deg) translateY(0); }
          50% { transform: rotate(3deg) translateY(-1px); }
        }
        .kippah {
          animation: kippah-bob 3s ease-in-out infinite;
          transform-origin: center bottom;
        }
        @media (prefers-reduced-motion: reduce) {
          .kippah { animation: none; }
        }
      `}</style>
    </svg>
  );
}
