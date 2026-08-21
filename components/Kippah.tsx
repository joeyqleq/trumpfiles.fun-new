"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type KippahVariant = "closed" | "open";

export default function Kippah({
  size = "sm",
  variant = "closed",
  className = "",
}: {
  size?: "sm" | "lg";
  variant?: KippahVariant;
  className?: string;
}) {
  const isOpen = variant === "open";
  const width = isOpen
    ? size === "sm"
      ? 126
      : 168
    : size === "sm"
      ? 88
      : 126;
  const height = isOpen ? 72 : 54;
  const src = isOpen ? "/trumpstein_kippah.svg" : "/trumpstein_hasidic.svg";

  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none relative block select-none overflow-visible", className)}
      style={{ width, height }}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes={`${width}px`}
        className={cn("object-contain", isOpen ? "drop-shadow-[0_3px_10px_rgba(0,0,0,0.4)]" : "drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]")}
        priority={false}
      />
    </span>
  );
}
