"use client";

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// Import GradientBlinds dynamically to avoid SSR issues with OGL
const GradientBlinds = dynamic(() => import('@/components/GradientBlinds'), {
    ssr: false,
});

// Orange/dark color palette for "The Trump Files" theme
const ORANGE_COLORS = [
    '#FF6500',  // Bright orange
    '#FF4500',  // Orange-red  
    '#FF8C00',  // Dark orange
    '#1a1a1a',  // Dark background
    '#0a0a0a',  // Near black
    '#FF6500',  // Loop back to orange
];

interface AnimatedBackgroundProps {
    children: ReactNode;
}

export default function AnimatedBackground({ children }: AnimatedBackgroundProps) {
    return (
        <>
            {/* Fixed background layer with GradientBlinds */}
            <div
                className="fixed inset-0 z-0 pointer-events-none"
                aria-hidden="true"
            >
                <GradientBlinds
                    gradientColors={ORANGE_COLORS}
                    angle={75}
                    noise={0.25}
                    blindCount={12}
                    blindMinWidth={80}
                    mouseDampening={0.12}
                    scrollDampening={0.08}
                    mirrorGradient={true}
                    spotlightRadius={0.6}
                    spotlightSoftness={1.2}
                    spotlightOpacity={0.8}
                    distortAmount={0.3}
                    shineDirection="left"
                    mixBlendMode="normal"
                    className="opacity-30"
                />
            </div>

            {/* Content layer */}
            <div className="relative z-10">
                {children}
            </div>
        </>
    );
}
