"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { TrumpFilesBrand } from "@/components/TrumpFilesBrand";
import { Link as LinkIcon, Heart, Copy, Check, Globe, Wallet, Bitcoin, CreditCard } from "lucide-react";
import PageDecorations from "@/components/PageDecorations";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AnimatedProfileCard, ProfileCardContent } from "@/components/ui/animated-profile-card";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import PixelCard from "@/components/PixelCard";

const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="border-orange-500/30 text-orange-400 hover:bg-orange-500/20"
        >
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? "Copied!" : "Copy"}
        </Button>
    );
};

export default function WhoAmIPage() {
    return (
        <div className="min-h-screen w-full relative bg-background overflow-x-hidden pb-24">
            <PageDecorations variant="wtf" />

            {/* Background Gradient */}
            <div className="fixed inset-0 w-full h-full z-0 opacity-20 pointer-events-none" style={{
                background: "radial-gradient(ellipse at top right, rgba(255, 101, 0, 0.4), transparent 50%), radial-gradient(ellipse at bottom left, rgba(255, 101, 0, 0.2), transparent 50%)"
            }} />

            <div className="container mx-auto px-4 max-w-5xl pt-24 relative z-10">
                {/* Hero - Who Am I */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 text-center lg:text-left flex flex-col lg:flex-row gap-8 items-center lg:items-start"
                >
                    <div className="flex-1 space-y-6">
                        <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 bg-clip-text text-transparent font-arctic-3d leading-tight">
                            WHOAMI?
                        </h1>
                        <div className="text-2xl text-foreground/80 font-arctic-laser italic text-white/50">
                            Creator of <TrumpFilesBrand size="lg" className="inline-flex ml-2" />
                        </div>

                        <div className="prose prose-invert max-w-none text-lg text-foreground/80 leading-relaxed font-sans space-y-4">
                            <p>
                                I am <strong className="text-orange-400 font-bold">Joe (aka joeyq)</strong>, a Mid-aged technologist from Lebanon and anti-kind of a big deal. Part music producer, part artist, part technologist, and part confused human trying to navigate this chaotic world.
                            </p>
                            <p>
                                I bridge the gap between heavy technical logic and high-level artistic creativity. Currently architecting better ways to survive the frontier.
                            </p>
                        </div>
                    </div>

                    {/* Profile Card - fixed dimensions to prevent overflow */}
                    <div className="flex-shrink-0 w-[280px] h-[340px] overflow-hidden rounded-3xl">
                        <div className="relative w-full h-full overflow-hidden rounded-3xl border-2 border-orange-500/40">
                            {/* Base card */}
                            <div className="absolute inset-0 w-full h-full">
                                <ProfileCardContent
                                    name="joeyq"
                                    location="Beirut, Lebanon"
                                    bio="Creative Technologist // The Nexus. Bridging the gap between heavy technical logic and high-level artistic creativity."
                                    avatarSrc="/images/jq_avatar.png"
                                    avatarFallback="JQ"
                                    showAvatar={true}
                                    className="bg-black/60 border-0 rounded-3xl h-full"
                                />
                            </div>
                            {/* Orange glow overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-600/0 hover:from-orange-500/10 hover:to-orange-600/20 transition-all duration-500 rounded-3xl" />
                            {/* Flickering grid accent on top edge */}
                            <div className="absolute top-0 left-0 right-0 h-24 opacity-30 pointer-events-none overflow-hidden rounded-t-3xl">
                                <FlickeringGrid
                                    squareSize={3}
                                    gridGap={2}
                                    color="#FF6500"
                                    maxOpacity={0.6}
                                    flickerChance={0.3}
                                    className="w-full h-full"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="space-y-12">
                    {/* The Project & Support Story */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="glass-card border-orange-500/20 backdrop-blur-xl bg-black/50 shadow-lg shadow-orange-500/5 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
                            <CardContent className="p-8 space-y-8 relative z-10">
                                <div>
                                    <h2 className="text-3xl font-bold text-orange-400 mb-6 font-arctic-twotone">Fighting the Fog: Why This Costs Money</h2>
                                    <div className="space-y-4 text-lg text-foreground/80 leading-relaxed font-sans">
                                        <p>
                                            The Trump Files is a non-commercial project. I don't sell ads, I don't sell your data, and there is no paywall. This archive exists for the public record, a comprehensive historical database of every lie, every contradiction, and every atrocity documented in the official record.
                                        </p>
                                        <ul className="list-none space-y-4 pt-4">
                                            <li className="flex gap-4">
                                                <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400 h-fit"><Globe className="w-5 h-5" /></div>
                                                <div><strong className="text-orange-300">AI Processing:</strong> Using LLMs to analyze thousands of documents for danger, absurdity, and deception metrics that help contextualize the archive.</div>
                                            </li>
                                            <li className="flex gap-4">
                                                <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400 h-fit"><Check className="w-5 h-5" /></div>
                                                <div><strong className="text-orange-300">Scraping Infrastructure:</strong> Continuous, real-time monitoring of news, social media, and legal filings.</div>
                                            </li>
                                            <li className="flex gap-4">
                                                <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400 h-fit"><Globe className="w-5 h-5" /></div>
                                                <div><strong className="text-orange-300">Server Architecture:</strong> Hosting the database and the D3.js-powered visualization engine that makes the data accessible and meaningful.</div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-orange-500/20">
                                    <h2 className="text-3xl font-bold text-orange-400 mb-6 font-arctic-twotone">Why This is Personal to Me</h2>
                                    <div className="space-y-4 text-lg text-foreground/80 leading-relaxed font-sans">
                                        <p>
                                            I am building this as an act of resistance. This work is not about money — it is about the fight against Zionist propaganda and American complicity in genocide. Israel has killed journalists at a rate unprecedented in modern warfare: over <strong className="text-orange-300">200 journalists killed</strong> in Gaza since October 2023, along with more than <strong className="text-orange-300">700 healthcare workers</strong> — numbers confirmed by CPJ, RSF, and WHO. These are not collateral damage. They are deliberate.
                                        </p>
                                        <p>
                                            Documenting and contextualizing Trump's record — his unconditional support for Netanyahu, his ICC sanctions against investigators of Israeli war crimes, his green light to the ethnic cleansing of Gaza — is part of that fight. This archive is AI resistance built from Lebanon, pointed at the machine.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* How to support */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-orange-400 mb-8 font-arctic-3d text-center">
                            How to Support This Work
                        </h2>

                        <div className="text-center text-lg text-foreground/80 max-w-3xl mx-auto mb-12">
                            I genuinely appreciate any kind of support. Running this archive — the AI compute, the servers, the database, the scraping infrastructure — costs real money out of pocket. I don't do this for money. I do it for the fight.
                            <br /><br />
                            For OpSec reasons I cannot link conventional payment platforms like PayPal to this project. If you want to support the continuation of this work, the best options are <strong className="text-orange-300">crypto</strong> (anonymous, direct) or reaching me through the <strong className="text-orange-300">encrypted contact form below</strong>.
                        </div>

                        {/* Crypto Wallet */}
                        <div className="mt-0">
                            <Card className="glass-card border-orange-500/30 bg-black/60">
                                <CardContent className="p-8">
                                    <div className="flex flex-col md:flex-row gap-6 items-center mb-8">
                                        <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/50 flex-shrink-0">
                                            <Bitcoin className="w-8 h-8 text-orange-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold font-arctic-guardian text-orange-400">1. Crypto — The Direct Route</h3>
                                            <p className="text-foreground/70 text-sm">Fully anonymous. No intermediary. Every satoshi goes toward AI compute, infrastructure, and keeping this resistance alive.</p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        {/* TRON */}
                                        <div className="bg-gradient-to-br from-red-950/40 to-black rounded-2xl border border-red-500/30 p-6 flex items-center gap-6 shadow-inner">
                                            <div className="bg-white p-2 rounded-xl flex-shrink-0">
                                                <Image src="/images/qr_tron.png" alt="Tron QR" width={80} height={80} className="rounded-lg" style={{ width: 'auto', height: 'auto' }} />
                                            </div>
                                            <div className="flex-1 w-full overflow-hidden">
                                                <h4 className="text-red-400 font-bold mb-2 flex items-center gap-2"><CreditCard className="w-4 h-4" /> USDT (TRON/TRC-20)</h4>
                                                <div className="bg-black/50 p-3 rounded border border-white/10 font-mono text-xs text-foreground/60 mb-3 truncate w-full">
                                                    TLQro76v2tA1kGst5V3R1811H2m8wk1ho
                                                </div>
                                                <CopyButton text="TLQro76v2tA1kGst5V3R1811H2m8wk1ho" />
                                            </div>
                                        </div>

                                        {/* POLYGON */}
                                        <div className="bg-gradient-to-br from-purple-950/40 to-black rounded-2xl border border-purple-500/30 p-6 flex items-center gap-6 shadow-inner">
                                            <div className="bg-white p-2 rounded-xl flex-shrink-0">
                                                <Image src="/images/qr_polygon.png" alt="Polygon QR" width={80} height={80} className="rounded-lg" style={{ width: 'auto', height: 'auto' }} />
                                            </div>
                                            <div className="flex-1 w-full overflow-hidden">
                                                <h4 className="text-purple-400 font-bold mb-2 flex items-center gap-2"><CreditCard className="w-4 h-4" /> USDT (Polygon)</h4>
                                                <div className="bg-black/50 p-3 rounded border border-white/10 font-mono text-xs text-foreground/60 mb-3 truncate w-full">
                                                    0x120818228122329381726eE678
                                                </div>
                                                <CopyButton text="0x120818228122329381726eE678" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>

                    {/* Contact option */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-8"
                    >
                        <Card className="glass-card border-orange-500/20 bg-black/50">
                            <CardContent className="p-8 flex flex-col md:flex-row gap-6 items-start">
                                <div className="w-14 h-14 rounded-full bg-orange-500/15 flex items-center justify-center border border-orange-500/30 flex-shrink-0">
                                    <LinkIcon className="w-6 h-6 text-orange-400" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-2xl font-bold font-arctic-guardian text-orange-400">2. Drop Me a Message</h3>
                                    <p className="text-foreground/70 leading-relaxed">
                                        If crypto isn&apos;t your thing, reach out through the contact form. The connection is end-to-end encrypted and I don&apos;t log IPs. We can figure out something from there — whether that&apos;s support, collaboration, or just a conversation about the work.
                                    </p>
                                    <p className="text-foreground/50 text-sm">
                                        Use the <strong className="text-orange-300/80">Contact</strong> button in the navigation above.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <div className="mt-16 text-center text-foreground/50 text-base max-w-2xl mx-auto italic border-t border-orange-500/20 pt-8">
                        "I want to continue building AI resistance against the system that enables mass atrocity. This archive exists because I believe documentation is a form of defiance. Thank you for being here."
                    </div>
                </div>
            </div>
        </div>
    );
}