"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Construction, Wrench, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnderConstructionModalProps {
    onClose?: () => void;
}

export const UnderConstructionModal = ({ onClose }: UnderConstructionModalProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show modal after a short delay for better UX
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        onClose?.();
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90%] max-w-md"
                    >
                        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-orange-500/30 shadow-2xl shadow-orange-500/20 overflow-hidden">
                            {/* Close button */}
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 transition-colors z-10"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5 text-white/60 hover:text-white" />
                            </button>

                            {/* Decorative header bar */}
                            <div className="h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-red-500" />

                            <div className="p-8 text-center">
                                {/* Icon */}
                                <div className="flex justify-center mb-4">
                                    <div className="relative">
                                        <Construction className="w-16 h-16 text-orange-500" />
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                            className="absolute -right-2 -top-2"
                                        >
                                            <Wrench className="w-6 h-6 text-amber-400" />
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Title */}
                                <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 bg-clip-text text-transparent">
                                    Under Construction
                                </h2>

                                {/* Message */}
                                <p className="text-foreground/70 mb-6 text-sm leading-relaxed">
                                    We're actively building new features and improvements!
                                    <br />
                                    <span className="text-orange-400 font-medium">Some areas may be incomplete or buggy.</span>
                                </p>

                                {/* Features coming soon */}
                                <div className="bg-white/5 rounded-lg p-4 mb-6 text-left">
                                    <h3 className="text-xs uppercase tracking-wider text-orange-400 font-semibold mb-2 flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> Coming Soon
                                    </h3>
                                    <ul className="text-xs text-foreground/60 space-y-1">
                                        <li>• Advanced search & filtering</li>
                                        <li>• Interactive network visualization</li>
                                        <li>• Community voting & comments</li>
                                        <li>• Public API for researchers</li>
                                    </ul>
                                </div>

                                {/* CTA */}
                                <Button
                                    onClick={handleClose}
                                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium px-6"
                                >
                                    Got It, Let's Explore!
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default UnderConstructionModal;
