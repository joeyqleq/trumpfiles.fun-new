"use client";

import { motion } from "framer-motion";

interface AnimatedFileIconProps {
  className?: string;
  size?: number;
  variant?: "default" | "classified";
}

export function AnimatedFileIcon({
  className = "",
  size = 24,
  variant = "default",
}: AnimatedFileIconProps) {
  const isClassified = variant === "classified";
  const color = isClassified ? "#ff3366" : "#FF6500";

  return (
    <motion.div
      className={`inline-flex items-center justify-center ${className}`}
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
        <motion.path
          d="M14 2v6h6"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeInOut" }}
        />
        {/* Content lines */}
        <motion.line
          x1="8" y1="13" x2="16" y2="13"
          stroke={color}
          strokeWidth="1"
          strokeOpacity="0.5"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 0.3 }}
        />
        <motion.line
          x1="8" y1="16" x2="13" y2="16"
          stroke={color}
          strokeWidth="1"
          strokeOpacity="0.5"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.4, duration: 0.3 }}
        />
        {isClassified && (
          <motion.text
            x="12"
            y="11"
            textAnchor="middle"
            fontSize="4"
            fontFamily="monospace"
            fill={color}
            fillOpacity="0.7"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.7] }}
            transition={{ delay: 1.6, duration: 0.5 }}
          >
            TOP SECRET
          </motion.text>
        )}
      </svg>
    </motion.div>
  );
}
