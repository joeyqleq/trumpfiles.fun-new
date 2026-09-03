"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface TrumpFilesBrandProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "hero";
  inline?: boolean;
  static?: boolean;
}

const ORANGE_GRADIENT = "bg-gradient-to-r from-orange-500 via-amber-400 to-red-500 bg-clip-text text-transparent";

const GLASS_EFFECT = `
  drop-shadow-[0_0_8px_rgba(255,100,0,0.4)]
  drop-shadow-[0_0_20px_rgba(255,100,0,0.2)]
`;

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
    sm: { text: "text-base", gap: "gap-0.5" },
    md: { text: "text-lg", gap: "gap-1" },
    lg: { text: "text-2xl", gap: "gap-1.5" },
    xl: { text: "text-3xl", gap: "gap-2" },
    "2xl": { text: "text-4xl", gap: "gap-2" },
    "3xl": { text: "text-5xl", gap: "gap-2.5" },
    "4xl": { text: "text-6xl", gap: "gap-3" },
    "5xl": { text: "text-7xl", gap: "gap-3.5" },
    hero: { text: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl", gap: "gap-1.5 sm:gap-2 md:gap-3" },
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
      {/* TRUMP — Arctic Guardian Laser */}
      <span
        className={cn("tracking-tight", textSize)}
        style={{
          fontFamily: 'var(--font-arctic-guardian-laser)',
          background: size === 'sm'
            ? 'linear-gradient(180deg, #ffffff 0%, #ffffff 45%, #ff8c00 65%, #ff6b00 100%)'
            : 'linear-gradient(180deg, #ffffff 0%, #ffffff 40%, #f97316 60%, #ef4444 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        TRUMP
      </span>

      {/* STEIN — Arctic Guardian Two Tone Italic */}
      <span
        className={cn("tracking-tight", textSize)}
        style={{
          fontFamily: 'var(--font-arctic-guardian-twotone-italic)',
          fontStyle: 'italic',
          background: size === 'sm'
            ? 'linear-gradient(180deg, #ffffff 0%, #ffffff 45%, #ff8c00 65%, #ff6b00 100%)'
            : 'linear-gradient(180deg, #ffffff 0%, #ffffff 40%, #f97316 60%, #ef4444 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        STEIN
      </span>

      {/* FILES — Arctic Guardian 3D with glitch */}
      {isStatic ? (
        <span
          className={cn("tracking-wider", textSize, ORANGE_GRADIENT)}
          style={{ fontFamily: 'var(--font-arctic-guardian-3d)' }}
        >
          FILES
        </span>
      ) : (
        <FilesGlitchEffect>
          <span
            className={cn("tracking-wider", textSize, ORANGE_GRADIENT)}
            style={{ fontFamily: 'var(--font-arctic-guardian-3d)' }}
          >
            FILES
          </span>
        </FilesGlitchEffect>
      )}
    </div>
  );
};

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

export function TrumpsteinInline({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline gap-0", className)}>
      <span
        style={{
          fontFamily: 'var(--font-arctic-guardian-laser)',
          background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 45%, #ff8c00 65%, #ff6b00 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        Trump
      </span>
      <span
        style={{
          fontFamily: 'var(--font-arctic-guardian-half-italic)',
          fontStyle: 'italic',
          background: 'linear-gradient(180deg, #ff8c00 0%, #ff6b00 50%, #ffffff 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        stein
      </span>
    </span>
  );
}
