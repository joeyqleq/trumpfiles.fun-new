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
      data-oid="cb79b9h"
    >
      <div className="flex items-center gap-2" data-oid="31e0:6z">
        <div
          className="bg-primary h-2 w-2 rounded-full transition-all duration-300 group-hover:scale-[100.8]"
          data-oid="kk4c9fo"
        ></div>
        <span
          className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0"
          data-oid="_o3ldwo"
        >
          {children}
        </span>
      </div>
      <div
        className="text-primary-foreground absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100"
        data-oid="1s:gbt7"
      >
        <span data-oid="q59dj62">{children}</span>
        <ArrowRight data-oid="epo3plg" />
      </div>
    </button>
  );
}
