"use client";

import { motion } from "framer-motion";

// Neo-brutalist decorative SVG elements (extracted from combined_svg_decor.svg)
// Color-adjusted to match the orange/yellow/red theme

export const TwinkleStar = ({
    className = "",
    color = "#FF6500",
    size = 24
}: {
    className?: string;
    color?: string;
    size?: number;
}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        className={className}
        style={{ color }}
    >
        <path
            fill="currentColor"
            d="M25 0L28.5 21.5L50 25L28.5 28.5L25 50L21.5 28.5L0 25L21.5 21.5L25 0Z"
        />
    </svg>
);

export const BrutalistFlower = ({
    className = "",
    size = 80,
    color = "#FF6500"
}: {
    className?: string;
    size?: number;
    color?: string;
}) => (
    <motion.svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        className={className}
        initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
    >
        <circle cx="100" cy="100" r="85" fill="none" stroke={color} strokeWidth="4" />
        <circle cx="100" cy="100" r="50" fill={color} opacity="0.2" />
        {/* Petals */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <ellipse
                key={i}
                cx="100"
                cy="40"
                rx="15"
                ry="35"
                fill={color}
                opacity={0.6 + (i % 2) * 0.2}
                transform={`rotate(${angle} 100 100)`}
            />
        ))}
        <circle cx="100" cy="100" r="20" fill={color} />
    </motion.svg>
);

export const BrutalistStar = ({
    className = "",
    size = 60,
    color = "#FFA500"
}: {
    className?: string;
    size?: number;
    color?: string;
}) => (
    <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className={className}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
    >
        <polygon
            points="50,5 61,40 98,40 68,62 79,97 50,75 21,97 32,62 2,40 39,40"
            fill={color}
            stroke="#26103d"
            strokeWidth="3"
        />
    </motion.svg>
);

export const BrutalistCircle = ({
    className = "",
    size = 50,
    color = "#E53935"
}: {
    className?: string;
    size?: number;
    color?: string;
}) => (
    <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className={className}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
    >
        <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="8" />
        <circle cx="50" cy="50" r="25" fill={color} opacity="0.5" />
        <circle cx="50" cy="50" r="10" fill={color} />
    </motion.svg>
);

export const BrutalistX = ({
    className = "",
    size = 40,
    color = "#FF6500"
}: {
    className?: string;
    size?: number;
    color?: string;
}) => (
    <motion.svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        className={className}
        initial={{ opacity: 0, rotate: 45 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 0.4 }}
    >
        <line x1="5" y1="5" x2="45" y2="45" stroke={color} strokeWidth="8" strokeLinecap="round" />
        <line x1="45" y1="5" x2="5" y2="45" stroke={color} strokeWidth="8" strokeLinecap="round" />
    </motion.svg>
);

export const BrutalistDiamond = ({
    className = "",
    size = 50,
    color = "#FDD835"
}: {
    className?: string;
    size?: number;
    color?: string;
}) => (
    <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className={className}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <polygon
            points="50,5 95,50 50,95 5,50"
            fill={color}
            stroke="#26103d"
            strokeWidth="4"
        />
    </motion.svg>
);

export const BrutalistSpiral = ({
    className = "",
    size = 60,
    color = "#8E24AA"
}: {
    className?: string;
    size?: number;
    color?: string;
}) => (
    <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className={className}
        initial={{ opacity: 0, rotate: -180 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
    >
        <path
            d="M50 10 Q90 10 90 50 Q90 90 50 90 Q10 90 10 50 Q10 25 35 25 Q60 25 60 50 Q60 75 35 75 Q15 75 25 50 Q35 30 50 40"
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
        />
    </motion.svg>
);

// Timeline decorator - randomly selects a decorative element
const decoratorElements = [
    { Component: BrutalistStar, colors: ["#FF6500", "#FFA500", "#E53935"] },
    { Component: BrutalistCircle, colors: ["#E53935", "#FF6500", "#8E24AA"] },
    { Component: BrutalistX, colors: ["#FFA500", "#FF6500", "#FDD835"] },
    { Component: BrutalistDiamond, colors: ["#FDD835", "#FF6500", "#FFA500"] },
    { Component: TwinkleStar, colors: ["#FF6500", "#FFA500", "#FFD700"] },
];

export const TimelineDecorator = ({
    index,
    side = "left"
}: {
    index: number;
    side?: "left" | "right";
}) => {
    const elementIndex = index % decoratorElements.length;
    const { Component, colors } = decoratorElements[elementIndex];
    const color = colors[index % colors.length];

    return (
        <motion.div
            className={`absolute ${side === "left" ? "-left-16" : "-right-16"} top-1/2 -translate-y-1/2`}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 0.6, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
        >
            <Component size={40} color={color} />
        </motion.div>
    );
};

// Floating background decorations
export const FloatingDecorations = () => {
    const orangeShades = [
        "#FF6500", "#FF8C00", "#FFA500", "#FFB84D", "#FFCC80", "#E65C00", "#CC5200"
    ];

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* Twinkle stars scattered across the page */}
            {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute"
                    style={{
                        top: `${10 + (i * 4.5) % 85}%`,
                        left: `${(i * 7) % 95}%`,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0.2, 0.5, 0.2],
                        scale: [0.8, 1, 0.8],
                    }}
                    transition={{
                        duration: 3 + (i % 3),
                        repeat: Infinity,
                        delay: i * 0.3,
                    }}
                >
                    <TwinkleStar
                        size={8 + (i % 5) * 3}
                        color={orangeShades[i % orangeShades.length]}
                    />
                </motion.div>
            ))}
        </div>
    );
};

export default FloatingDecorations;
