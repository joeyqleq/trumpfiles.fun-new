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
                                    <h2 className="text-3xl font-bold text-orange-400 mb-6 font-arctic-twotone">A Message from the Frontier</h2>
                                    <div className="space-y-4 text-lg text-foreground/80 leading-relaxed font-sans">
                                        <p>
                                            This project is the culmination of 15 years as a digital strategist and growth hacker in Dubai, mixed with a lifetime of "breaking things to learn them." I built this because the world needs to see the pattern—the systemic corruption, the calculated lies, and the devastating consequences of unchecked power.
                                        </p>
                                        <p>
                                            Living here gives me a unique perspective on the real-world consequences of the transactional and destructive rhetoric cataloged in this database. The Trump Files exists to document and contextualize the most dangerous man in modern history.
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
                            How to Support (and How to Hire Me)
                        </h2>

                        <div className="text-center text-lg text-foreground/80 max-w-3xl mx-auto mb-12">
                            I'm not a fan of "corporate speak" or begging for handouts. I'm currently growing my portfolio and looking for the next "Head-Scratcher." If you have a project that feels like it could change the world, let's talk.
                            <br /><br />
                            If you value this archive, here is how you can help keep the lights on:
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* PayPal */}
                            <Card className="glass-card border-orange-500/30 bg-black/60 shadow-[0_0_20px_rgba(255,101,0,0.1)] hover:shadow-[0_0_30px_rgba(255,101,0,0.2)] transition-shadow">
                                <CardContent className="p-8 text-center flex flex-col h-full justify-between items-center space-y-6">
                                    <div className="space-y-4 flex flex-col items-center">
                                        <div className="w-16 h-16 rounded-full bg-[#00457C]/20 flex items-center justify-center border border-[#0079C1]/50">
                                            <CreditCard className="w-8 h-8 text-[#0079C1]" />
                                        </div>
                                        <h3 className="text-2xl font-bold font-arctic-guardian">1. PayPal</h3>
                                        <p className="text-foreground/70 text-sm">Every contribution goes directly toward hosting and the AI-processing power required to scrape new data.</p>
                                    </div>
                                    <Link href="https://www.paypal.me/joeyq2" target="_blank" className="w-full group">
                                        <motion.div
                                            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(0, 121, 193, 0.4)" }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-[#00457C] to-[#0079C1] text-white flex items-center justify-center gap-3 cursor-pointer"
                                        >
                                            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.93A.77.77 0 0 1 5.703 2.3h6.181c2.052 0 3.748 1.644 3.748 3.696V13.88c0 2.052-1.696 3.697-3.748 3.697h-1.053l-.245 1.77a.61.61 0 0 1-.604.512h-1.999a.61.61 0 0 1-.604-.512l-.245-1.77H7.076Z"></path></svg>
                                            Donate via PayPal
                                        </motion.div>
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* Ko-Fi */}
                            <Card className="glass-card border-orange-500/30 bg-black/60 shadow-[0_0_20px_rgba(255,101,0,0.1)] hover:shadow-[0_0_30px_rgba(255,101,0,0.2)] transition-shadow">
                                <CardContent className="p-8 text-center flex flex-col h-full justify-between items-center space-y-6">
                                    <div className="space-y-4 flex flex-col items-center">
                                        <div className="w-16 h-16 rounded-full bg-[#29ABE0]/20 flex items-center justify-center border border-[#29ABE0]/50">
                                            <Heart className="w-8 h-8 text-[#29ABE0]" />
                                        </div>
                                        <h3 className="text-2xl font-bold font-arctic-guardian">2. Ko-Fi</h3>
                                        <p className="text-foreground/70 text-sm">Buy me a coffee on Ko-Fi. Quick, easy, no account required.</p>
                                    </div>
                                    <Link href="https://ko-fi.com/poi5on" target="_blank" className="w-full group">
                                        <motion.div
                                            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(41, 171, 224, 0.4)" }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full overflow-hidden rounded-xl cursor-pointer"
                                        >
                                            <Image
                                                src="/images/support_me_on_kofi_blue.png"
                                                alt="Support Me on Ko-Fi"
                                                width={400}
                                                height={60}
                                                className="w-full h-14 object-contain bg-[#29ABE0] rounded-xl hover:brightness-110 transition-all"
                                                style={{ width: 'auto', height: 'auto' }}
                                            />
                                        </motion.div>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Crypto Wallet */}
                        <div className="mt-8">
                            <Card className="glass-card border-orange-500/30 bg-black/60">
                                <CardContent className="p-8">
                                    <div className="flex flex-col md:flex-row gap-6 items-center mb-8">
                                        <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/50 flex-shrink-0">
                                            <Bitcoin className="w-8 h-8 text-orange-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold font-arctic-guardian text-orange-400">3. Crypto (The Survival Standard)</h3>
                                            <p className="text-foreground/70 text-sm">In a collapsed banking system, this is the most direct way to support.</p>
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

                    <div className="mt-16 text-center text-foreground/50 text-base max-w-2xl mx-auto italic border-t border-orange-500/20 pt-8">
                        "I'm looking forward to the conversation—and to the day I see Donald Trump finally held accountable for his crimes. I hope this project plays even the slightest part in that future."
                    </div>
                </div>
            </div>
        </div>
    );
}