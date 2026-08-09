"use client";

import { motion } from "framer-motion";

interface NarrativeLedeProps {
  step: string;
  title: string;
  text: string;
}

export function NarrativeLede({ step, title, text }: NarrativeLedeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className="flex items-start gap-4 pt-10 pb-2"
    >
      <span className="font-mono text-[clamp(1.6rem,4vw,2.4rem)] leading-none font-bold text-orange-500/20 select-none">
        {step}
      </span>
      <div className="pt-0.5">
        <h2 className="font-mono text-base md:text-lg font-bold tracking-[0.08em] text-foreground uppercase">
          {title}
        </h2>
        <p className="mt-1.5 text-sm text-foreground/60 leading-relaxed max-w-3xl">
          {text}
        </p>
      </div>
    </motion.div>
  );
}
