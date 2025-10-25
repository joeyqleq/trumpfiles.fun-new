import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

export function InteractiveHoverButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "group bg-background relative w-auto cursor-pointer overflow-hidden rounded-full border p-2 px-6 text-center font-semibold",
        className,
      )}
      {...props}
      data-oid=":8rd_4h"
    >
      <div className="flex items-center gap-2" data-oid="b-m.624">
        <div
          className="bg-primary h-2 w-2 rounded-full transition-all duration-300 group-hover:scale-[100.8]"
          data-oid="e613ub3"
        ></div>
        <span
          className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0"
          data-oid="br0cp2g"
        >
          {children}
        </span>
      </div>
      <div
        className="text-primary-foreground absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100"
        data-oid="b4xn2h:"
      >
        <span data-oid="b8qm6_e">{children}</span>
        <ArrowRight data-oid="x9:li3:" />
      </div>
    </button>
  );
}
