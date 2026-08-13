"use client";

export default function Kippah({
  size = "sm",
  className = "",
}: {
  size?: "sm" | "lg";
  className?: string;
}) {
  const d = size === "sm" ? 22 : 40;

  return (
    <svg
      width={d}
      height={Math.round(d * 0.7)}
      viewBox="0 0 44 30"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`kippah-blue-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2962FF" />
          <stop offset="50%" stopColor="#0D47A1" />
          <stop offset="100%" stopColor="#0a3280" />
        </linearGradient>
        <radialGradient id={`kippah-shine-${size}`} cx="35%" cy="25%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.3" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="22" cy="28" rx="18" ry="3" fill="rgba(0,0,0,0.3)" />

      {/* Main dome — Israeli blue */}
      <path
        d="M 4 26 Q 4 4 22 2 Q 40 4 40 26 Z"
        fill={`url(#kippah-blue-${size})`}
      />

      {/* White stripe top — Israeli flag */}
      <path
        d="M 8 8 Q 8 6 22 5 Q 36 6 36 8 Q 36 11 22 10 Q 8 11 8 8 Z"
        fill="white"
        opacity="0.9"
      />

      {/* White stripe bottom — Israeli flag */}
      <path
        d="M 5.5 20 Q 5 18 22 17 Q 39 18 38.5 20 Q 39 22.5 22 22 Q 5 22.5 5.5 20 Z"
        fill="white"
        opacity="0.9"
      />

      {/* Star of David — center */}
      <g transform="translate(22, 14)" fill="none" stroke="#0D47A1" strokeWidth="1.2">
        <polygon points="0,-4.5 3.9,2.25 -3.9,2.25" />
        <polygon points="0,4.5 3.9,-2.25 -3.9,-2.25" />
      </g>

      {/* Glassy sheen */}
      <path
        d="M 10 20 Q 10 5 18 4 Q 14 4 12 20 Z"
        fill={`url(#kippah-shine-${size})`}
      />

      {/* Rim */}
      <ellipse cx="22" cy="26" rx="18" ry="3.5" fill="#0a3280" />
      <ellipse cx="22" cy="25.5" rx="18" ry="2.5" fill="#0D47A1" opacity="0.6" />

      <style>{`
        @keyframes kippah-sway {
          0%, 100% { transform: rotate(-1.5deg); }
          50% { transform: rotate(1.5deg); }
        }
        svg[aria-hidden="true"]:has(ellipse) {
          animation: kippah-sway 4s ease-in-out infinite;
          transform-origin: center bottom;
        }
        @media (prefers-reduced-motion: reduce) {
          svg[aria-hidden="true"]:has(ellipse) { animation: none; }
        }
      `}</style>
    </svg>
  );
}
