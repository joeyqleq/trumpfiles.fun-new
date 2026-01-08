import { cn } from "@/lib/utils";

interface DotPatternProps {
  className?: string;
  size?: number;
  radius?: number;
  cx?: number;
  cy?: number;
}

export const DotPattern = ({ className, size = 16, radius = 1, cx = 1, cy = 1 }: DotPatternProps) => {
  return (
    <svg
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-neutral-400/80",
        className,
      )}
    >
      <defs>
        <pattern
          id="dot-pattern"
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
          x="0"
          y="0"
        >
          <circle id="pattern-circle" cx={cx} cy={cy} r={radius}></circle>
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill="url(#dot-pattern)"></rect>
    </svg>
  );
};