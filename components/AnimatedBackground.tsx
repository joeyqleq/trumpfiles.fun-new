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
        <div className="relative min-h-screen">
            {/* Extremely lightweight subtle gradient animation */}
            <div
                className="fixed inset-0 z-0 pointer-events-none opacity-20"
                style={{
                    background: "radial-gradient(circle at 50% 50%, #FF6500 0%, #1a1a1a 100%)",
                    backgroundSize: "200% 200%",
                    animation: "pulse-subtle 15s ease infinite alternate",
                }}
                aria-hidden="true"
            ></div>

            <style jsx global>{`
                @keyframes pulse-subtle {
                    0% { background-position: 0% 0%; opacity: 0.15; }
                    50% { opacity: 0.25; }
                    100% { background-position: 100% 100%; opacity: 0.15; }
                }
            `}</style>

            {/* Content layer */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
}
