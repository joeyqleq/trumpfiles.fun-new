import type React from "react";
import { cn } from "@/lib/utils";

interface TrumpFilesBrandProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "hero" | "nav";
}

/**
 * TrumpFilesBrand component - Creative typography using alternating Arctic Guardian fonts
 * Each word uses a different Arctic Guardian variant for visual interest
 */
export function TrumpFilesBrand({
  className,
  size = "md",
  variant = "default",
}: TrumpFilesBrandProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl lg:text-5xl",
    xl: "text-5xl lg:text-7xl",
  };

  const variantClasses = {
    default: "",
    hero: "tracking-tight",
    nav: "tracking-normal",
  };

  return (
    <span
      className={cn(
        "inline-flex flex-wrap items-center gap-2",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      data-oid="5:9i.cw"
    >
      <span className="font-arctic-3d" data-oid="6c_7z0h">
        The
      </span>
      <span className="font-arctic-grad text-primary" data-oid="a8:at5i">
        Trump
      </span>
      <span className="font-arctic-laser" data-oid="l8cfpci">
        Files
      </span>
    </span>
  );
}

/**
 * TrumpFilesTitle component - For section headers with creative typography
 */
export function TrumpFilesTitle({ className }: { className?: string }) {
  return (
    <h1 className={cn("font-bold", className)} data-oid="7l.y7ds">
      <span className="font-arctic-twotone" data-oid="..hldbd">
        Trump
      </span>{" "}
      <span className="font-arctic-half" data-oid="is6rbuh">
        Files
      </span>
    </h1>
  );
}

/**
 * TrumpFilesHeading component - Flexible heading with alternating fonts
 */
export function TrumpFilesHeading({
  children,
  className,
  as: Component = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}) {
  return (
    <Component className={cn("font-heading", className)} data-oid="aaqzjo2">
      {children}
    </Component>
  );
}
