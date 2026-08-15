"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function InsightsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-[calc(100dvh-80px)] items-center justify-center bg-[#060608] px-5 text-white">
      <section className="w-full max-w-xl rounded-xl border border-orange-500/25 bg-black/70 p-6 sm:p-8">
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
          <AlertTriangle aria-hidden="true" size={22} />
        </div>
        <h1 className="font-heading text-2xl text-orange-300">This exhibit could not load</h1>
        <p className="mt-3 max-w-prose text-sm leading-6 text-white/65">
          The rest of the archive is still available. Retry this dashboard view or return to the stable overview.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-orange-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
          >
            <RefreshCw aria-hidden="true" size={16} />
            Retry view
          </button>
          <Link
            href="/insights?section=overview&view=totals"
            className="inline-flex min-h-11 items-center rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 transition-colors hover:border-orange-400/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
          >
            Open overview
          </Link>
        </div>
      </section>
    </main>
  );
}
