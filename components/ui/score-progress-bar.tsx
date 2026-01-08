"use client";

import { motion } from "framer-motion";

interface ScoreProgressBarProps {
  score: number;
  label: string;
}

export function ScoreProgressBar({ score, label }: ScoreProgressBarProps) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative h-32 w-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="absolute bottom-0 w-full bg-primary"
          initial={{ height: 0 }}
          animate={{ height: `${score * 10}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <span className="text-xs text-foreground/70">{label}</span>
    </div>
  );
}