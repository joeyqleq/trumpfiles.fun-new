"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

interface DecorationProps {
    className?: string;
    opacity?: number;
    size?: number;
}

interface FloatingJackProps extends DecorationProps {
    src: string;
    rotateSpeed?: number; // seconds per full rotation, 0 = no rotation
    floatAmplitude?: number; // px of vertical float
    floatDuration?: number; // seconds per float cycle
    scrollFactor?: number; // parallax multiplier (1 = normal scroll, 0.5 = half speed)
}

// Core floating ASCII jack with continuous rotation + float + parallax
const FloatingJack = ({
    className = "",
    opacity = 0.22,
    size = 180,
    src,
    rotateSpeed = 0,
    floatAmplitude = 12,
    floatDuration = 8,
    scrollFactor = 1,
}: FloatingJackProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, -200 * scrollFactor]);

    return (
        <motion.div
            ref={ref}
            className={`pointer-events-none ${className}`}
            style={{ y }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{
                opacity,
                scale: 1,
                rotate: rotateSpeed > 0 ? [0, 360] : 0,
            }}
            transition={{
                opacity: { duration: 1.2, ease: "easeOut" },
                scale: { duration: 1.2, ease: "easeOut" },
                rotate: rotateSpeed > 0
                    ? { duration: rotateSpeed, repeat: Infinity, ease: "linear" }
                    : undefined,
            }}
        >
            <motion.div
                animate={{ y: [0, -floatAmplitude, 0] }}
                transition={{
                    duration: floatDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <Image
                    src={src}
                    alt=""
                    width={size}
                    height={size}
                    className="object-contain drop-shadow-[0_0_20px_rgba(255,100,0,0.15)]"
                    style={{ width: size, height: size }}
                />
            </motion.div>
        </motion.div>
    );
};

// Orange X decoration (SVG) — kept for enigma page usage
export const OrangeX = ({ className = "", opacity = 0.35, size = 60 }: DecorationProps) => (
    <motion.div
        className={`pointer-events-none ${className}`}
        initial={{ opacity: 0, rotate: 45 }}
        animate={{ opacity, rotate: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
    >
        <Image
            src="/images/bg-decor_orange-x.svg"
            alt=""
            width={size}
            height={size}
            className="object-contain"
            style={{ width: size, height: size }}
        />
    </motion.div>
);

// Twinkle Star (SVG) — small, faded, 4-spoke shapes in background
export const TwinkleStar = ({
    className = "",
    opacity = 0.3,
    size = 18,
    depth = 1,
    spinDuration = 50,
}: DecorationProps & { depth?: number; spinDuration?: number }) => (
    <motion.div
        className={`pointer-events-none absolute ${className}`}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
            opacity: [opacity * 0.5, opacity, opacity * 0.5],
            scale: [0.9, 1, 0.9],
            rotate: [0, 360],
        }}
        transition={{
            opacity: { duration: 5 + depth * 2, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 5 + depth * 2, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: spinDuration, repeat: Infinity, ease: "linear" },
        }}
        style={{ filter: depth > 1.5 ? `blur(${(depth - 1) * 0.6}px)` : undefined }}
    >
        <Image
            src="/images/bg-decor_twinkle_star.svg"
            alt=""
            width={size}
            height={size}
            className="object-contain"
            style={{ width: size, height: size }}
        />
    </motion.div>
);

// Scattered star field — very small, faded, barely-visible background texture
function ScatteredStars({ count = 12, seed = 0 }: { count?: number; seed?: number }) {
    const stars = Array.from({ length: count }, (_, i) => {
        const s = seed + i;
        const top = ((s * 17 + 31) % 90) + 3;
        const left = ((s * 23 + 7) % 85) + 5;
        const size = 10 + ((s * 13) % 14); // 10-24px — small
        const depth = 0.5 + ((s * 7) % 30) / 10;
        const opacity = depth > 2 ? 0.08 : depth > 1.2 ? 0.12 : 0.18; // very faded
        const spinDuration = 40 + ((s * 11) % 50);
        return { top, left, size, depth, opacity, spinDuration };
    });
    return (
        <>
            {stars.map((star, i) => (
                <div
                    key={`star-${i}`}
                    className="absolute pointer-events-none"
                    style={{ top: `${star.top}%`, left: `${star.left}%` }}
                >
                    <TwinkleStar
                        size={star.size}
                        opacity={star.opacity}
                        depth={star.depth}
                        spinDuration={star.spinDuration}
                    />
                </div>
            ))}
        </>
    );
}

// ASCII Jack images available
const JACK_SOURCES = [
    "/images/trump_ascii_jack_1_no-bg.png",
    "/images/trump_ascii_jack_2_signature_no-bg.png",
    "/images/trump_ascii_jack_3_no-bg.png",
    "/images/trump_ascii_jack_4_red_signature_no-bg.png",
];

// Per-page variant configurations for ASCII jacks
type JackConfig = {
    src: string;
    top: string;
    left?: string;
    right?: string;
    size: number;
    opacity: number;
    rotateSpeed: number; // 0 = no rotation
    floatAmplitude: number;
    floatDuration: number;
    scrollFactor: number;
};

const VARIANT_CONFIGS: Record<string, JackConfig[]> = {
    default: [
        { src: JACK_SOURCES[0], top: "5%", left: "-2%", size: 200, opacity: 0.18, rotateSpeed: 90, floatAmplitude: 15, floatDuration: 9, scrollFactor: 0.3 },
        { src: JACK_SOURCES[2], top: "35%", right: "-3%", size: 160, opacity: 0.14, rotateSpeed: 0, floatAmplitude: 10, floatDuration: 7, scrollFactor: 0.6 },
        { src: JACK_SOURCES[1], top: "65%", left: "2%", size: 140, opacity: 0.12, rotateSpeed: 120, floatAmplitude: 8, floatDuration: 11, scrollFactor: 0.8 },
        { src: JACK_SOURCES[3], top: "85%", right: "1%", size: 180, opacity: 0.16, rotateSpeed: 0, floatAmplitude: 12, floatDuration: 8, scrollFactor: 1.0 },
    ],
    catalog: [
        { src: JACK_SOURCES[0], top: "3%", left: "-4%", size: 220, opacity: 0.2, rotateSpeed: 80, floatAmplitude: 18, floatDuration: 10, scrollFactor: 0.2 },
        { src: JACK_SOURCES[3], top: "25%", right: "-2%", size: 180, opacity: 0.16, rotateSpeed: 0, floatAmplitude: 14, floatDuration: 8, scrollFactor: 0.5 },
        { src: JACK_SOURCES[1], top: "50%", left: "1%", size: 160, opacity: 0.14, rotateSpeed: 100, floatAmplitude: 10, floatDuration: 12, scrollFactor: 0.7 },
        { src: JACK_SOURCES[2], top: "75%", right: "0%", size: 190, opacity: 0.18, rotateSpeed: 0, floatAmplitude: 12, floatDuration: 9, scrollFactor: 0.9 },
        { src: JACK_SOURCES[0], top: "95%", left: "-1%", size: 150, opacity: 0.12, rotateSpeed: 140, floatAmplitude: 8, floatDuration: 7, scrollFactor: 1.1 },
    ],
    visualizer: [
        { src: JACK_SOURCES[1], top: "2%", right: "-1%", size: 190, opacity: 0.18, rotateSpeed: 70, floatAmplitude: 16, floatDuration: 9, scrollFactor: 0.25 },
        { src: JACK_SOURCES[0], top: "30%", left: "-3%", size: 170, opacity: 0.15, rotateSpeed: 0, floatAmplitude: 12, floatDuration: 10, scrollFactor: 0.5 },
        { src: JACK_SOURCES[3], top: "60%", right: "-2%", size: 200, opacity: 0.2, rotateSpeed: 110, floatAmplitude: 14, floatDuration: 8, scrollFactor: 0.75 },
        { src: JACK_SOURCES[2], top: "88%", left: "0%", size: 160, opacity: 0.14, rotateSpeed: 0, floatAmplitude: 10, floatDuration: 11, scrollFactor: 1.0 },
    ],
    wtf: [
        { src: JACK_SOURCES[2], top: "4%", left: "-2%", size: 210, opacity: 0.2, rotateSpeed: 60, floatAmplitude: 20, floatDuration: 8, scrollFactor: 0.2 },
        { src: JACK_SOURCES[0], top: "28%", right: "-4%", size: 180, opacity: 0.16, rotateSpeed: 0, floatAmplitude: 15, floatDuration: 9, scrollFactor: 0.5 },
        { src: JACK_SOURCES[3], top: "55%", left: "1%", size: 170, opacity: 0.15, rotateSpeed: 90, floatAmplitude: 12, floatDuration: 10, scrollFactor: 0.7 },
        { src: JACK_SOURCES[1], top: "80%", right: "2%", size: 190, opacity: 0.18, rotateSpeed: 0, floatAmplitude: 14, floatDuration: 7, scrollFactor: 0.95 },
    ],
    enigma: [
        { src: JACK_SOURCES[3], top: "2%", right: "-1%", size: 220, opacity: 0.22, rotateSpeed: 50, floatAmplitude: 18, floatDuration: 10, scrollFactor: 0.15 },
        { src: JACK_SOURCES[1], top: "22%", left: "-3%", size: 190, opacity: 0.18, rotateSpeed: 0, floatAmplitude: 14, floatDuration: 8, scrollFactor: 0.4 },
        { src: JACK_SOURCES[0], top: "48%", right: "-2%", size: 170, opacity: 0.16, rotateSpeed: 130, floatAmplitude: 10, floatDuration: 11, scrollFactor: 0.65 },
        { src: JACK_SOURCES[2], top: "72%", left: "2%", size: 200, opacity: 0.2, rotateSpeed: 0, floatAmplitude: 16, floatDuration: 9, scrollFactor: 0.85 },
        { src: JACK_SOURCES[3], top: "92%", right: "0%", size: 160, opacity: 0.14, rotateSpeed: 100, floatAmplitude: 8, floatDuration: 7, scrollFactor: 1.1 },
    ],
    contact: [
        { src: JACK_SOURCES[1], top: "5%", left: "-2%", size: 180, opacity: 0.16, rotateSpeed: 100, floatAmplitude: 12, floatDuration: 9, scrollFactor: 0.3 },
        { src: JACK_SOURCES[2], top: "40%", right: "-3%", size: 160, opacity: 0.14, rotateSpeed: 0, floatAmplitude: 10, floatDuration: 8, scrollFactor: 0.6 },
        { src: JACK_SOURCES[0], top: "75%", left: "1%", size: 170, opacity: 0.15, rotateSpeed: 80, floatAmplitude: 14, floatDuration: 10, scrollFactor: 0.9 },
    ],
};

export const PageDecorations = ({ variant = "default" }: { variant?: "default" | "catalog" | "visualizer" | "wtf" | "enigma" | "contact" }) => {
    const configs = VARIANT_CONFIGS[variant] || VARIANT_CONFIGS.default;

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 w-full h-full">
            {/* Scattered SVG twinkle stars — very small, very faded background texture */}
            <div className="absolute inset-0 pointer-events-none">
                <ScatteredStars count={10} seed={variant === "default" ? 0 : variant === "catalog" ? 42 : variant === "visualizer" ? 77 : 113} />
            </div>

            {/* ASCII Jack PNGs — larger, some rotating, scrolling with page, parallax */}
            {configs.map((config, i) => (
                <div
                    key={`jack-${variant}-${i}`}
                    className="absolute"
                    style={{
                        top: config.top,
                        ...(config.left != null && { left: config.left }),
                        ...(config.right != null && { right: config.right }),
                    }}
                >
                    <FloatingJack
                        src={config.src}
                        size={config.size}
                        opacity={config.opacity}
                        rotateSpeed={config.rotateSpeed}
                        floatAmplitude={config.floatAmplitude}
                        floatDuration={config.floatDuration}
                        scrollFactor={config.scrollFactor}
                    />
                </div>
            ))}
        </div>
    );
};

export default PageDecorations;
