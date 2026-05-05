"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// Asset-based decorations using actual PNG/SVG files from public/images

interface DecorationProps {
    className?: string;
    opacity?: number;
    size?: number;
}

// ASCII Jack decorations - the asterisk-shaped trump cards (MAIN DECORATIONS)
export const AsciiJack1 = ({ className = "", opacity = 0.25, size = 150 }: DecorationProps) => (
    <motion.div
        className={`pointer-events-none ${className}`}
        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
        animate={{ opacity, scale: 1, rotate: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
    >
        <Image
            src="/images/trump_ascii_jack_1_no-bg.png"
            alt=""
            width={size}
            height={size}
            className="object-contain"
            style={{ width: 'auto', height: 'auto' }}
        />
    </motion.div>
);

export const AsciiJack2 = ({ className = "", opacity = 0.25, size = 150 }: DecorationProps) => (
    <motion.div
        className={`pointer-events-none ${className}`}
        initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
        animate={{ opacity, scale: 1, rotate: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
    >
        <Image
            src="/images/trump_ascii_jack_2_signature_no-bg.png"
            alt=""
            width={size}
            height={size}
            className="object-contain"
            style={{ width: 'auto', height: 'auto' }}
        />
    </motion.div>
);

export const AsciiJack3 = ({ className = "", opacity = 0.25, size = 150 }: DecorationProps) => (
    <motion.div
        className={`pointer-events-none ${className}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
    >
        <Image
            src="/images/trump_ascii_jack_3_no-bg.png"
            alt=""
            width={size}
            height={size}
            className="object-contain"
            style={{ width: 'auto', height: 'auto' }}
        />
    </motion.div>
);

export const AsciiJack4Red = ({ className = "", opacity = 0.25, size = 150 }: DecorationProps) => (
    <motion.div
        className={`pointer-events-none ${className}`}
        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
        animate={{ opacity, scale: 1, rotate: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
    >
        <Image
            src="/images/trump_ascii_jack_4_red_signature_no-bg.png"
            alt=""
            width={size}
            height={size}
            className="object-contain"
            style={{ width: 'auto', height: 'auto' }}
        />
    </motion.div>
);

// ASCII Box decoration
export const AsciiBox = ({ className = "", opacity = 0.2, size = 150 }: DecorationProps) => (
    <motion.div
        className={`pointer-events-none ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
    >
        <Image
            src="/images/ascii_box.png"
            alt=""
            width={size}
            height={size}
            className="object-contain"
            style={{ width: 'auto', height: 'auto' }}
        />
    </motion.div>
);

// Orange X decoration (SVG)
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
            style={{ width: 'auto', height: 'auto' }}
        />
    </motion.div>
);

// Grey X decoration (SVG)
export const GreyX = ({ className = "", opacity = 0.2, size = 50 }: DecorationProps) => (
    <motion.div
        className={`pointer-events-none ${className}`}
        initial={{ opacity: 0, rotate: -45 }}
        animate={{ opacity, rotate: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
    >
        <Image
            src="/images/bg-decor_grey-x.svg"
            alt=""
            width={size}
            height={size}
            className="object-contain"
            style={{ width: 'auto', height: 'auto' }}
        />
    </motion.div>
);

// Twinkle Star decoration (SVG) - in various orange shades
export const TwinkleStar = ({
    className = "",
    opacity = 0.5,
    size = 30,
}: DecorationProps) => (
    <motion.div
        className={`pointer-events-none ${className}`}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
            opacity: [opacity * 0.5, opacity, opacity * 0.5],
            scale: [0.9, 1, 0.9]
        }}
        transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }}
    >
        <Image
            src="/images/bg-decor_twinkle_star.svg"
            alt=""
            width={size}
            height={size}
            className="object-contain"
            style={{ width: 'auto', height: 'auto' }}
        />
    </motion.div>
);

// Vertical TTF Initials decoration (SVG) - MORE VISIBLE
export const VerticalInitials = ({ className = "", opacity = 0.35, size = 300 }: DecorationProps) => (
    <motion.div
        className={`pointer-events-none ${className}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
    >
        <Image
            src="/images/bg-decor_vertical_ttf_initials.svg"
            alt=""
            width={size * 0.3}
            height={size}
            className="object-contain"
            style={{ width: 'auto', height: 'auto' }}
        />
    </motion.div>
);

// Floating page decorations using actual assets
// PRIORITY: Use the 4 ASCII Trump PNGs prominently on every page!
export const PageDecorations = ({ variant = "default" }: { variant?: "default" | "catalog" | "visualizer" | "wtf" | "enigma" | "contact" }) => {
    // Different decoration layouts for different pages - ASCII Jacks are PRIMARY decorations
    const decorationConfigs = {
        default: [
            // ASCII Jacks - main decorations
            { Component: AsciiJack1, position: "top-20 left-[-3%]", size: 140, opacity: 0.2 },
            { Component: AsciiJack3, position: "top-[40%] right-[-2%]", size: 130, opacity: 0.18 },
            { Component: AsciiJack2, position: "bottom-32 left-[-2%]", size: 120, opacity: 0.18 },
            // Supporting decorations
            { Component: TwinkleStar, position: "top-32 right-[8%]", size: 25, opacity: 0.4 },
            { Component: OrangeX, position: "top-[55%] left-[5%]", size: 45, opacity: 0.25 },
            { Component: TwinkleStar, position: "top-[70%] right-[6%]", size: 22, opacity: 0.35 },
            { Component: TwinkleStar, position: "bottom-20 right-[10%]", size: 28, opacity: 0.4 },
        ],
        catalog: [
            // ASCII Jacks - scattered around edges
            { Component: AsciiJack1, position: "top-20 left-[-4%]", size: 160, opacity: 0.22 },
            { Component: AsciiJack4Red, position: "top-[35%] right-[-3%]", size: 140, opacity: 0.2 },
            { Component: AsciiJack3, position: "top-[65%] left-[-3%]", size: 130, opacity: 0.18 },
            { Component: AsciiJack2, position: "bottom-24 right-[-2%]", size: 150, opacity: 0.2 },
            // Supporting decorations
            { Component: TwinkleStar, position: "top-16 right-[6%]", size: 28, opacity: 0.45 },
            { Component: OrangeX, position: "top-[50%] right-[5%]", size: 50, opacity: 0.25 },
            { Component: TwinkleStar, position: "bottom-40 left-[8%]", size: 24, opacity: 0.4 },
        ],
        visualizer: [
            // ASCII Jacks - main decorations
            { Component: AsciiJack2, position: "top-24 right-[-3%]", size: 150, opacity: 0.22 },
            { Component: AsciiJack1, position: "top-[45%] left-[-4%]", size: 140, opacity: 0.2 },
            { Component: AsciiJack4Red, position: "bottom-32 right-[-2%]", size: 145, opacity: 0.22 },
            { Component: AsciiJack3, position: "bottom-[20%] left-[-3%]", size: 130, opacity: 0.18 },
            // Supporting decorations  
            { Component: TwinkleStar, position: "top-20 left-[5%]", size: 26, opacity: 0.45 },
            { Component: OrangeX, position: "top-[35%] right-[4%]", size: 48, opacity: 0.25 },
            { Component: TwinkleStar, position: "top-[60%] right-[6%]", size: 22, opacity: 0.4 },
        ],
        wtf: [
            // ASCII Jacks - main decorations
            { Component: AsciiJack3, position: "top-28 left-[-4%]", size: 155, opacity: 0.22 },
            { Component: AsciiJack1, position: "top-[40%] right-[-3%]", size: 140, opacity: 0.2 },
            { Component: AsciiBox, position: "top-[55%] left-[-2%]", size: 120, opacity: 0.18 },
            { Component: AsciiJack4Red, position: "bottom-28 right-[-3%]", size: 150, opacity: 0.22 },
            // Supporting decorations
            { Component: TwinkleStar, position: "top-16 right-[7%]", size: 30, opacity: 0.5 },
            { Component: OrangeX, position: "top-[30%] left-[6%]", size: 55, opacity: 0.28 },
            { Component: TwinkleStar, position: "bottom-40 left-[5%]", size: 26, opacity: 0.45 },
        ],
        enigma: [
            // TTF Initials - MORE VISIBLE
            { Component: VerticalInitials, position: "top-24 left-0", size: 350, opacity: 0.4 },
            // ASCII Jacks - main decorations
            { Component: AsciiJack4Red, position: "top-20 right-[-3%]", size: 150, opacity: 0.22 },
            { Component: AsciiJack2, position: "top-[45%] right-[-2%]", size: 140, opacity: 0.2 },
            { Component: AsciiJack1, position: "top-[70%] left-[-3%]", size: 135, opacity: 0.2 },
            { Component: AsciiJack3, position: "bottom-24 right-[-2%]", size: 145, opacity: 0.22 },
            // Supporting decorations
            { Component: TwinkleStar, position: "top-32 right-[8%]", size: 28, opacity: 0.5 },
            { Component: OrangeX, position: "top-[35%] left-[8%]", size: 50, opacity: 0.28 },
            { Component: TwinkleStar, position: "bottom-40 left-[10%]", size: 24, opacity: 0.45 },
        ],
        contact: [
            // ASCII Jacks - main decorations
            { Component: AsciiJack2, position: "top-24 left-[-3%]", size: 145, opacity: 0.22 },
            { Component: AsciiJack3, position: "top-[45%] right-[-3%]", size: 140, opacity: 0.2 },
            { Component: AsciiJack1, position: "bottom-28 left-[-2%]", size: 130, opacity: 0.2 },
            // Supporting decorations
            { Component: TwinkleStar, position: "top-20 right-[6%]", size: 28, opacity: 0.5 },
            { Component: OrangeX, position: "top-[55%] left-[5%]", size: 50, opacity: 0.25 },
            { Component: TwinkleStar, position: "bottom-36 right-[8%]", size: 26, opacity: 0.45 },
            { Component: GreyX, position: "bottom-20 left-[10%]", size: 40, opacity: 0.2 },
        ],
    };

    const decorations = decorationConfigs[variant] || decorationConfigs.default;

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {decorations.map((dec, index) => {
                const { Component, position, size, opacity } = dec;
                return (
                    <div key={index} className={`absolute ${position}`}>
                        <Component size={size} opacity={opacity} />
                    </div>
                );
            })}
        </div>
    );
};

export default PageDecorations;
