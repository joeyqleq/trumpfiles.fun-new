import { cn } from "@/lib/utils";

interface TrumpFilesBrandProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
}

// Standard orange gradient for all Arctic Guardian fonts
const ORANGE_GRADIENT = "bg-linear-to-r from-orange-500 via-orange-400 to-red-500 bg-clip-text text-transparent";

export const TrumpFilesBrand = ({
  className,
  size = "md",
}: TrumpFilesBrandProps) => {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
    xl: "text-2xl",
    "2xl": "text-3xl",
    "3xl": "text-4xl",
    "4xl": "text-5xl",
    "5xl": "text-7xl",
  };

  return (
    <div className={cn("flex flex-wrap gap-2 lg:gap-3", className)}>
      <span className={cn("font-arctic-grad", sizeClasses[size], ORANGE_GRADIENT)}>
        THE
      </span>
      <span className={cn("font-arctic-laser italic", sizeClasses[size], ORANGE_GRADIENT)}>
        TRUMP
      </span>
      <span className={cn("font-arctic-3d", sizeClasses[size], ORANGE_GRADIENT)}>
        FILES
      </span>
    </div>
  );
};

export const TrumpFilesHeading = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h1
      className={cn("font-heading", ORANGE_GRADIENT, className)}
      {...props}
    />
  );
};
