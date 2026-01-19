"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShinyButton } from "@/components/ui/shiny-button";
import { PulsatingButton } from "@/components/ui/pulsating-button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Database, BarChart3, Shield, Zap } from "lucide-react";
import {
  TrumpFilesBrand,
  TrumpFilesHeading,
} from "@/components/TrumpFilesBrand";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { TextReveal } from "@/components/ui/text-reveal";
import { MagicCard } from "@/components/ui/magic-card";
import GradientBlinds from "@/components/GradientBlinds";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { Marquee } from "@/components/ui/marquee";
import { Sparkles, TrendingUp, Users, Zap as ZapIcon, AlertTriangle, Brain, Flame } from "lucide-react";
import { AICompleteTrumpData } from "@/types/database";

// Dynamically import 3D component to avoid SSR issues
const OrangeHero = dynamic(() => import("@/components/OrangeHero"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-[500px] flex items-center justify-center"
      data-oid="h8jonkb"
    >
      <div className="animate-pulse text-2xl text-primary" data-oid="a2_wyk0">
        Loading 3D Model...
      </div>
    </div>
  ),
});

const features = [
  {
    icon: Database,
    title: "377+ Documented Entries",
    description:
      "Meticulously structured data with sources, scores, and fact-checks.",
  },
  {
    icon: BarChart3,
    title: "Interactive Visualizations",
    description:
      "Discover patterns and relationships with D3.js-powered charts.",
  },
  {
    icon: Shield,
    title: "Fact-Checked",
    description:
      "Every entry includes rigorous fact-checking and source verification.",
  },
  {
    icon: Zap,
    title: "Real-time Analysis",
    description:
      "Thermal scoring system for danger, lawlessness, and absurdity metrics.",
  },
];

// Category color mapping
const getCategoryColor = (category: string) => {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    'Insurrection': { bg: 'bg-red-500/30', text: 'text-red-400', border: 'border-red-500/50' },
    'Corruption': { bg: 'bg-orange-500/30', text: 'text-orange-400', border: 'border-orange-500/50' },
    'Obstruction': { bg: 'bg-yellow-500/30', text: 'text-yellow-400', border: 'border-yellow-500/50' },
    'Legal': { bg: 'bg-blue-500/30', text: 'text-blue-400', border: 'border-blue-500/50' },
    'Political': { bg: 'bg-purple-500/30', text: 'text-purple-400', border: 'border-purple-500/50' },
    'Foreign Policy': { bg: 'bg-green-500/30', text: 'text-green-400', border: 'border-green-500/50' },
    'Ethics': { bg: 'bg-pink-500/30', text: 'text-pink-400', border: 'border-pink-500/50' },
    'Business': { bg: 'bg-cyan-500/30', text: 'text-cyan-400', border: 'border-cyan-500/50' },
  };
  return colors[category] || { bg: 'bg-gray-500/30', text: 'text-gray-400', border: 'border-gray-500/50' };
};

// Marquee card component - larger with clickable title
const MarqueeCard = ({ entry }: { entry: AICompleteTrumpData }) => {
  const categoryStyle = getCategoryColor(entry.category);
  const dangerPercent = ((entry.danger || 0) / 10) * 100;
  const absurdityPercent = ((entry.absurdity || 0) / 10) * 100;

  return (
    <div className="w-[420px] mx-4 p-5 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 group">
      {/* Category Pill with unique color */}
      <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold mb-3 ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border} border`}>
        {entry.category}
      </div>

      {/* Clickable Title - opens in new tab */}
      <Link
        href={`/entry/${entry.entry_number}`}
        target="_blank"
        className="block"
      >
        <h4 className="text-base font-bold text-white/90 line-clamp-1 mb-2 group-hover:text-orange-400 transition-colors cursor-pointer underline-offset-2 hover:underline" style={{ fontFamily: 'var(--font-neuething)' }}>
          #{entry.entry_number}: {entry.title}
        </h4>
      </Link>

      {/* Synopsis - more lines */}
      <p className="text-sm text-foreground/70 line-clamp-3 mb-4 leading-relaxed" style={{ fontFamily: 'var(--font-neuething)', fontWeight: 400 }}>
        {entry.synopsis}
      </p>

      {/* Score Bars with clear /10 reference */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-xs text-red-400 w-16 flex items-center gap-1 font-medium">
            <Flame className="w-3.5 h-3.5" /> Danger
          </span>
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
              style={{ width: `${dangerPercent}%` }}
            />
          </div>
          <span className="text-xs text-white/80 w-10 text-right font-mono">{entry.danger?.toFixed(1)}/10</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-yellow-400 w-16 flex items-center gap-1 font-medium">
            <Brain className="w-3.5 h-3.5" /> Absurd
          </span>
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-400 rounded-full"
              style={{ width: `${absurdityPercent}%` }}
            />
          </div>
          <span className="text-xs text-white/80 w-10 text-right font-mono">{entry.absurdity?.toFixed(1)}/10</span>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [entries, setEntries] = useState<AICompleteTrumpData[]>([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch('/api/catalog-data');
        const data = await res.json();
        if (Array.isArray(data)) {
          setEntries(data);
        }
      } catch (error) {
        console.error('Error fetching catalog data:', error);
      }
    };
    fetchEntries();
  }, []);

  // Split entries for two marquee rows
  const topRowEntries = entries.slice(0, Math.ceil(entries.length / 2));
  const bottomRowEntries = entries.slice(Math.ceil(entries.length / 2));

  return (
    <div className="min-h-screen relative" data-oid="9xg3vmm">
      {/* Animated Gradient Blinds Background */}
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

      {/* All content now relative and above background */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section
          className="relative overflow-hidden min-h-[calc(100vh-80px)] flex items-start pt-16 pb-8"
        >

          {/* SVG Decorations */}
          {/* Wireframe Donut - Left Side with animated beam glow */}
          <div
            className="absolute -left-40 top-1/2 -translate-y-1/2 w-[625px] h-[625px] opacity-20 pointer-events-none"
          >
            {/* Base SVG */}
            <img
              src="/images/bg-decor_wireframe_donut.svg"
              alt=""
              className="absolute inset-0 w-full h-full object-contain"
            />
            {/* Animated glow overlay */}
            <div
              className="absolute inset-0 w-full h-full animate-beam-pulse"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255,165,0,0.3) 0%, transparent 60%)',
                mixBlendMode: 'overlay',
              }}
            />
          </div>

          {/* Hula Hoops - Right Side with animated beam glow */}
          <div
            className="absolute -right-24 top-1/3 w-[440px] h-[440px] opacity-15 pointer-events-none"
          >
            {/* Base SVG */}
            <img
              src="/images/bg-decor_hula-hoops.svg"
              alt=""
              className="absolute inset-0 w-full h-full object-contain"
            />
            {/* Animated ring glow overlay */}
            <div
              className="absolute inset-0 w-full h-full rounded-full animate-beam-rotate"
              style={{
                background: 'conic-gradient(from 0deg, transparent, rgba(255,100,0,0.4), transparent, rgba(255,165,0,0.4), transparent)',
                mixBlendMode: 'overlay',
              }}
            />
          </div>

          <div className="container mx-auto px-4 lg:px-12 relative z-10 w-full">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-stretch max-w-7xl mx-auto">
              {/* Left Content */}
              <div className="flex flex-col justify-between items-center lg:items-start order-2 lg:order-1 py-8">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-8 text-center lg:text-left"
                >
                  {/* Badge */}
                  <Badge
                    className="bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-500 border-orange-500/30 px-4 py-1.5 text-sm"
                  >
                    The Definitive Data-Driven Encyclopedia of Political Absurdity
                  </Badge>

                  {/* Brand Title - Single Row */}
                  <div className="py-4">
                    <TrumpFilesBrand size="hero" className="justify-center lg:justify-start whitespace-nowrap" />
                  </div>

                  {/* Description */}
                  <p className="text-lg lg:text-xl text-foreground/80 max-w-xl mx-auto lg:mx-0 leading-relaxed" style={{ fontFamily: 'var(--font-neuething)', fontWeight: 500 }}>
                    A comprehensive, data-driven archive of the 45th U.S.
                    President&apos;s most controversial and impactful moments. Explore,
                    analyze, and understand the data behind the headlines.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-6 pt-6 justify-center lg:justify-start">
                    <Link href="/catalog">
                      <ShinyButton className="text-base px-6 py-3 bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/50">
                        Explore The Files
                      </ShinyButton>
                    </Link>
                    <Link href="/visualizer">
                      <PulsatingButton className="text-base px-6 py-3 bg-orange-600 hover:bg-orange-700">
                        Visualize The Data
                      </PulsatingButton>
                    </Link>
                  </div>
                </motion.div>
              </div>

              {/* Right - 3D Model */}
              <div className="flex flex-col items-center justify-end order-1 lg:order-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative w-full h-[45vh] lg:h-[72vh]"
                >
                  <OrangeHero />
                </motion.div>
                {/* Single Front-Slash Divider - aligned with button row width */}
                <div className="hidden lg:flex justify-center mt-4">
                  <img
                    src="/images/bg-decor_repeating_front-slash.svg"
                    alt=""
                    className="w-[360px] h-14 opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          className="golden-p-8"
          data-oid="tp_lf37"
        >
          <div className="container mx-auto px-4" data-oid="y926rli">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
              data-oid="7ey6jjw"
            >
              <TrumpFilesHeading
                className="text-3xl lg:text-4xl font-bold mb-4"
                data-oid="4xrhvv-"
              >
                An Unprecedented Archive of a Presidency
              </TrumpFilesHeading>
              <p
                className="text-lg text-foreground/70 max-w-2xl mx-auto"
                data-oid="mnlha7d"
              >
                Our platform provides the tools to dissect, analyze, and
                comprehend the events that shaped a tumultuous era in American
                history.
              </p>
            </motion.div>

            <div
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
              data-oid="zy9j.50"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  data-oid="x7g1_td"
                >
                  <MagicCard
                    className="glass-card border-white/10 p-6 h-full hover:border-primary/30 transition-all duration-300"
                    data-oid="jsjk6as"
                  >
                    <feature.icon
                      className="h-10 w-10 text-primary mb-4"
                      data-oid=":gwk9tx"
                    />

                    <h3
                      className="text-xl font-semibold mb-2 font-heading bg-linear-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent"
                      data-oid="f_sl81f"
                    >
                      {feature.title}
                    </h3>
                    <p className="text-foreground/70" data-oid="8vs-gn9">
                      {feature.description}
                    </p>
                  </MagicCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* BentoGrid Showcase - Pre-Footer */}
        <section className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-linear-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent font-(family-name:--font-arctic-guardian-semi)">
                Explore The Platform
              </h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Interactive tools and insights to understand the most documented presidency in history
              </p>
            </motion.div>

            <BentoGrid className="mx-auto max-w-6xl">
              <BentoCard
                name="Interactive Catalog"
                className="col-span-3 lg:col-span-2"
                background={
                  <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 to-red-500/10" />
                }
                Icon={Database}
                description="Browse 700+ meticulously documented entries with advanced filtering, scoring, and real-time updates."
                href="/catalog"
                cta="Explore Catalog"
              />
              <BentoCard
                name="Data Visualizer"
                className="col-span-3 lg:col-span-1"
                background={
                  <div className="absolute inset-0 bg-linear-to-br from-purple-500/20 to-orange-500/10" />
                }
                Icon={BarChart3}
                description="5 interactive chart types revealing patterns, trends, and insights across all dimensions."
                href="/visualizer"
                cta="View Charts"
              />
              <BentoCard
                name="The Enigma"
                className="col-span-3 lg:col-span-1"
                background={
                  <div className="absolute inset-0 bg-linear-to-br from-red-500/20 to-orange-500/10" />
                }
                Icon={Users}
                description="Explore the biographical timeline and key events that shaped the most controversial presidency."
                href="/enigma"
                cta="Discover Timeline"
              />
              <BentoCard
                name="Real-Time Scoring"
                className="col-span-3 lg:col-span-2"
                background={
                  <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 to-yellow-500/10" />
                }
                Icon={TrendingUp}
                description="AI-powered thermal scoring across 8 dimensions: danger, lawlessness, insanity, absurdity, and more."
                href="/catalog"
                cta="See Scores"
              />
            </BentoGrid>
          </div>
        </section>

        {/* Data Stream Marquee */}
        {entries.length > 0 && (
          <section className="py-16 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10 mb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                {/* Title with translucent frame for better readability */}
                <div className="inline-block px-8 py-4 rounded-xl bg-black/50 backdrop-blur-sm border border-orange-500/30 mb-4">
                  <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent font-heading">
                    Live Data Stream
                  </h2>
                </div>
                <p className="text-base text-foreground/70">
                  {entries.length} documented incidents streaming in real-time
                </p>
              </motion.div>
            </div>

            {/* Single Row Marquee - Much slower: ~10 seconds per card to cross viewport */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
              <Marquee pauseOnHover className="[--duration:150s] [--gap:1.5rem]" repeat={2}>
                {entries.slice(0, 15).map((entry) => (
                  <MarqueeCard key={entry.entry_number} entry={entry} />
                ))}
              </Marquee>
            </div>
          </section>
        )}

        {/* Mission Statement */}
        <section className="relative py-24 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="glass-card p-12 text-center max-w-4xl mx-auto border-orange-500/20 shadow-lg shadow-orange-500/10">
              <h2 className="text-4xl lg:text-5xl font-bold mb-8 bg-linear-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent font-(family-name:--font-arctic-guardian-semi)">
                Our Mission
              </h2>
              <div className="space-y-6 text-lg text-foreground/80 leading-relaxed">
                <p>
                  <strong className="text-orange-400">The Trump Files</strong> is a scientific and entertainment exercise leveraging AI to scrape, catalogue, and analyze everything written about Trump's crimes, racism, narcissism, and compulsive lying.
                </p>
                <p>
                  This archive serves to <strong className="text-orange-400">understand what makes him tick</strong>, provide evidence for potential prosecution, chronicle the worst of the worst for the historical record, and offer data-driven insights into his mind and methods.
                </p>
                <p>
                  Our goal? <strong className="text-orange-400">Jail or bar from heaven</strong>—whichever comes first.
                </p>
                <div className="pt-6 flex gap-4 justify-center">
                  <Link href="/catalog">
                    <Button className="bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                      Explore The Archive
                    </Button>
                  </Link>
                  <Link href="/wtf">
                    <Button variant="outline" className="border-orange-500/30 text-orange-400 hover:bg-orange-500/20">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
