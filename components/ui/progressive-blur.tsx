"use client";

import { cn } from "@/lib/utils";

interface ProgressiveBlurProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: string;
  position?: "top" | "bottom" | "both";
  blurLevels?: number[];
}

export function ProgressiveBlur({
  className,
  height = "30%",
  position = "bottom",
  blurLevels = [0.5, 1, 2, 4, 8, 16, 32, 64],
  ...props
}: ProgressiveBlurProps) {
  const blurStyle = (level: number) => ({
    backdropFilter: `blur(${level}px)`,
    WebkitBackdropFilter: `blur(${level}px)`,
  });

  const renderBlur = (pos: "top" | "bottom") => (
    <div
      className={cn(
        "absolute left-0 right-0",
        pos === "top" ? "top-0" : "bottom-0"
      )}
      style={{ height }}
    >
      {blurLevels.map((level, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            ...blurStyle(level),
            zIndex: blurLevels.length - i,
            clipPath:
              pos === "top"
                ? `inset(${
                    (i / blurLevels.length) * 100
                  }% 0% 0% 0%)`
                : `inset(0% 0% ${
                    (i / blurLevels.length) * 100
                  }% 0%)`,
          }}
        />
      ))}
    </div>
  );

  return (
    <>
      {(position === "top" || position === "both") && renderBlur("top")}
      {(position === "bottom" || position === "both") && renderBlur("bottom")}
    </>
  );
}
