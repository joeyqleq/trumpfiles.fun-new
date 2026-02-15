"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { TrumpFilesBrand } from "@/components/TrumpFilesBrand";
import { Heart, Coins, Server, Globe, ShieldAlert } from "lucide-react";
import GradientBlinds from "@/components/GradientBlinds";
import PageDecorations from "@/components/PageDecorations";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DonatePage() {
    return (
        <div className="min-h-screen w-full relative">
            {/* Page Decorations */}
            <PageDecorations variant="wtf" />

            {/* Background */}
            <div className="fixed inset-0 w-full h-full z-0 opacity-30 pointer-events-none">
                <GradientBlinds
                    gradientColors={[
                        "#FF6B00",
                        "#FF8C00",
                        "#FFA500",
                        "#FFB733",
                        "#FF8C00",
                        "#FF6B00"
                    ]}
                    angle={45}
                    blindCount={24}
                    blindMinWidth={50}
                    noise={0.15}
                    mouseDampening={0.2}
                    spotlightRadius={0.6}
                    spotlightOpacity={0.8}
                    distortAmount={0.5}
                    mirrorGradient={true}
                    mixBlendMode="screen"
                />
            </div>

            <div className="container mx-auto px-4 max-w-4xl py-16 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-5xl lg:text-7xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent font-[family-name:var(--font-arctic-guardian-semi)]">
                            Support The
                        </span>{" "}
                        <TrumpFilesBrand size="2xl" className="inline-flex" />
                    </h1>
                    <p className="text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
                        Fighting the fog of war, amnesia, and misinformation—one database entry at a time.
                    </p>
                </motion.div>

                {/* The Costs / Mission */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-10"
                >
                    <Card className="glass-card border-orange-500/20 shadow-lg shadow-orange-500/10">
                        <CardContent className="p-8 space-y-6">
                            <div className="flex items-center gap-4 mb-4">
                                <Server className="w-8 h-8 text-orange-400" />
                                <h2 className="text-2xl font-bold text-orange-400">Why Donate? The Reality of Running This Archive</h2>
                            </div>
                            <p className="text-lg text-foreground/80 leading-relaxed">
                                <strong className="text-orange-300">This is a non-commercial project.</strong> I do not sell ads. I do not sell data. There is no paywall. This archive exists for the public record, accessible to everyone for free.
                            </p>
                            <p className="text-lg text-foreground/80 leading-relaxed">
                                However, keeping <strong className="text-orange-400">The Trump Files</strong> alive is expensive. I pay out of pocket for:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-foreground/80 pl-4">
                                <li><strong className="text-orange-300">AI Processing:</strong> Analyzing thousands of documents with LLMs to detect danger, absurdity, and lies.</li>
                                <li><strong className="text-orange-300">Server Costs:</strong> Hosting the database and the high-performance visualization engine.</li>
                                <li><strong className="text-orange-300">Scraping Infrastructure:</strong> Tools to continuously monitor news, social media, and government filings in real-time.</li>
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* The Personal Context (Lebanon) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-10"
                >
                    <Card className="glass-card border-orange-500/20 bg-gradient-to-br from-orange-950/30 to-black/30">
                        <CardContent className="p-8 space-y-6">
                            <div className="flex items-center gap-4 mb-4">
                                <Globe className="w-8 h-8 text-orange-400" />
                                <h2 className="text-2xl font-bold text-orange-400">A Message from the Creator</h2>
                            </div>

                            <div className="prose prose-invert max-w-none text-lg text-foreground/80 leading-relaxed space-y-4">
                                <p>
                                    I currently live in <strong className="text-orange-300">Lebanon</strong>. To put it mildly, it is not the easiest place to be right now. The region has been crippled by conflict and policy decisions that often trace back to U.S. foreign policy—specifically the chaotic, transactional, and destructive approach of the Trump administration and its allies.
                                </p>
                                <p>
                                    Living here gives me a unique perspective. I see the <strong className="text-orange-400">real-world consequences</strong> of the rhetoric and policies cataloged in this database. It’s what gives me the drive to build this—to ensure that the actions of powerful men are recorded, analyzed, and never forgotten.
                                </p>
                                <p>
                                    This website is my resistance. It allows me the freedom to fight back against the normalization of chaos, even from a place where daily life is often a struggle.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* The Ask / PayPal */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-12"
                >
                    <Card className="glass-card border-orange-500/40 shadow-[0_0_30px_rgba(249,115,22,0.15)] bg-gradient-to-r from-orange-950/40 via-black/40 to-orange-950/40">
                        <CardContent className="p-8 text-center space-y-8">
                            <div className="flex flex-col items-center gap-4">
                                <div className="p-4 rounded-full bg-orange-500/20 border border-orange-500/40">
                                    <Heart className="w-10 h-10 text-orange-500 fill-orange-500/20 animate-pulse" />
                                </div>
                                <h2 className="text-3xl font-bold text-white">Help Keep This Project Alive</h2>
                            </div>

                            <div className="text-left bg-black/40 p-6 rounded-xl border border-white/10 space-y-4">
                                <div className="flex gap-3 items-start">
                                    <ShieldAlert className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                                    <p className="text-foreground/80 text-sm italic">
                                        <strong>Note:</strong> Because of the financial situation in Lebanon, receiving international payments is incredibly difficult. PayPal does not operate directly here. I have to use trusted intermediaries to cash out any support. It is a hurdle, but currently, it represents the only viable way for me to sustain this work.
                                    </p>
                                </div>
                            </div>

                            <p className="text-xl text-foreground/90 font-medium max-w-2xl mx-auto">
                                If you value this archive and want to see it continue to grow, please consider donating. Even a small amount helps cover hosting costs and keeps the lights on.
                            </p>

                            <div className="pt-4">
                                <Link href="https://paypal.me/joeyleq" target="_blank">
                                    <Button className="w-full sm:w-auto px-12 py-6 text-xl font-bold rounded-full bg-gradient-to-r from-[#00457C] to-[#0079C1] hover:from-[#003a68] hover:to-[#006099] text-white shadow-lg shadow-blue-500/20 border border-blue-400/30 transition-all hover:scale-105">
                                        <Coins className="w-6 h-6 mr-3" />
                                        Donate via PayPal
                                    </Button>
                                </Link>
                                <p className="mt-4 text-sm text-foreground/50">
                                    Secure transaction via PayPal.me/joeyleq
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Footer Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-foreground/50 text-sm max-w-xl mx-auto"
                >
                    <p>
                        Whatever you can give allows me to spend more time scraping data and less time worrying about how to keep the servers running. Thank you for your solidarity.
                    </p>
                </motion.div>

            </div>
        </div>
    );
}
