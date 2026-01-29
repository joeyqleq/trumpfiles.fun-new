"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface TrumpFilesBrandProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "hero";
  inline?: boolean;
  static?: boolean; // Disable glitch animation for static display (e.g., nav)
}

// Orange gradient with glass effect
const ORANGE_GRADIENT = "bg-gradient-to-r from-orange-500 via-amber-400 to-red-500 bg-clip-text text-transparent";

// Glowing glass effect styles
const GLASS_EFFECT = `
  drop-shadow-[0_0_8px_rgba(255,100,0,0.4)]
  drop-shadow-[0_0_20px_rgba(255,100,0,0.2)]
`;

// Subtle blur/glow glitch effect for the hollow "FILES" word
const FilesGlitchEffect = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [glitchActive, setGlitchActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Subtle glitch on random intervals (3-7 seconds)
    const runGlitch = () => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 100);
    };

    const scheduleGlitch = () => {
      const delay = 3000 + Math.random() * 4000;
      intervalRef.current = setTimeout(() => {
        runGlitch();
        scheduleGlitch();
      }, delay);
    };

    scheduleGlitch();

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, []);

  return (
    <span
      className={cn("relative inline-block", className)}
      style={{
        textShadow: glitchActive
          ? `
              2px 0 0 rgba(255, 100, 0, 0.5),
              -2px 0 0 rgba(255, 165, 0, 0.3),
              0 0 20px rgba(255, 100, 0, 0.6),
              0 0 40px rgba(255, 100, 0, 0.3)
            `
          : '0 0 15px rgba(255, 100, 0, 0.4), 0 0 30px rgba(255, 100, 0, 0.2)',
        filter: glitchActive ? 'blur(0.5px)' : 'none',
        transition: glitchActive ? 'none' : 'text-shadow 0.3s ease-out, filter 0.3s ease-out',
      }}
    >
      {children}
    </span>
  );
};

export const TrumpFilesBrand = ({
  className,
  size = "md",
  inline = false,
  static: isStatic = false,
}: TrumpFilesBrandProps) => {
  const sizeClasses = {
    sm: { text: "text-base", gap: "gap-1" },
    md: { text: "text-lg", gap: "gap-1.5" },
    lg: { text: "text-2xl", gap: "gap-2" },
    xl: { text: "text-3xl", gap: "gap-2" },
    "2xl": { text: "text-4xl", gap: "gap-2.5" },
    "3xl": { text: "text-5xl", gap: "gap-3" },
    "4xl": { text: "text-6xl", gap: "gap-3" },
    "5xl": { text: "text-7xl", gap: "gap-4" },
    hero: { text: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl", gap: "gap-2 sm:gap-3 md:gap-4" },
  };

  const { text: textSize, gap: gapSize } = sizeClasses[size];

  return (
    <div
      className={cn(
        "flex items-baseline flex-nowrap",
        gapSize,
        GLASS_EFFECT,
        className
      )}
    >
      {/* THE - Arctic Guardian Gradient Italic */}
      <span
        className={cn(
          "tracking-wide",
          textSize
        )}
        style={{
          fontFamily: 'var(--font-arctic-guardian-grad-italic)',
          fontStyle: 'italic',
          // Brighter gradient for small sizes to improve visibility
          background: size === 'sm'
            ? 'linear-gradient(to right, #ff8c00, #ffc107, #ff6b00)'
            : 'linear-gradient(to right, #f97316, #fbbf24, #ef4444)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent'
        }}
      >
        THE
      </span>

      {/* TRUMP - Arctic Guardian Laser Italic */}
      <span
        className={cn(
          "tracking-tight",
          textSize,
          ORANGE_GRADIENT
        )}
        style={{
          fontFamily: 'var(--font-arctic-guardian-laser-italic)',
          fontStyle: 'italic'
        }}
      >
        TRUMP
      </span>

      {/* FILES - Arctic Guardian 3D (hollow) with optional shimmer effect */}
      {isStatic ? (
        <span
          className={cn(
            "tracking-wider",
            textSize,
            ORANGE_GRADIENT
          )}
          style={{
            fontFamily: 'var(--font-arctic-guardian-3d)'
          }}
        >
          FILES
        </span>
      ) : (
        <FilesGlitchEffect>
          <span
            className={cn(
              "tracking-wider",
              textSize,
              ORANGE_GRADIENT
            )}
            style={{
              fontFamily: 'var(--font-arctic-guardian-3d)'
            }}
          >
            FILES
          </span>
        </FilesGlitchEffect>
      )}
    </div>
  );
};

// Heading component for other uses
export const TrumpFilesHeading = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h1
      className={cn(
        "bg-gradient-to-r from-orange-500 via-amber-400 to-red-500 bg-clip-text text-transparent",
        GLASS_EFFECT,
        className
      )}
      style={{ fontFamily: 'var(--font-arctic-guardian-3d)' }}
      {...props}
    />
  );
};
