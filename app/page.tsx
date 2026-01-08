"use client";

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
import { Sparkles, TrendingUp, Users, Zap as ZapIcon } from "lucide-react";

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

export default function Home() {
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
        className="relative overflow-hidden h-screen flex items-center justify-center pt-0" // Removed top padding, added justify-center
      >
        <div className="absolute inset-0 bg-linear-to-br from-orange-500/10 via-background to-purple-500/10" />
        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col md:flex-row items-center justify-center"> {/* Changed to flex for better centering */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full max-w-7xl mx-auto"> {/* Adjusted gap and max-width */}
            <div className="lg:col-span-1 flex flex-col justify-center items-center lg:items-start order-2 lg:order-1"> {/* Centering adjustments */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8 text-center lg:text-left" // Increased spacing
              >
                <Badge
                  className="bg-linear-to-r from-orange-500/20 to-red-500/20 text-orange-500 border-orange-500/30 px-4 py-1 text-sm lg:text-base mb-2" // Increased size
                >
                  The Definitive Data-Driven Encyclopedia of Political Absurdity
                </Badge>
                <div className="flex flex-col gap-2 justify-center lg:justify-start"> {/* Stacked for mobile, row for desktop? No, user wanted multi-font on separate lines potentially or just huge */}
                  {/* Keeping them inline-block/flex-wrap but huge */}
                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start leading-none">
                    <span className="font-heading font-bold text-6xl lg:text-8xl bg-linear-to-r from-orange-500 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-lg">THE</span>
                    <span className="font-arctic-laser italic text-6xl lg:text-8xl bg-linear-to-r from-orange-500 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-lg">TRUMP</span>
                    <span className="font-arctic-3d text-6xl lg:text-8xl bg-linear-to-r from-orange-500 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-lg">FILES</span>
                  </div>
                </div>
                <p className="text-lg lg:text-2xl text-foreground/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans font-medium"> {/* Increased text size */}
                  A comprehensive, data-driven archive of the 45th U.S.
                  President's most controversial and impactful moments. Explore,
                  analyze, and understand the data behind the headlines.
                </p>
                <div
                  className="flex flex-wrap gap-6 pt-6 justify-center lg:justify-start" // Increased gap and padding
                >
                  <Link href="/catalog">
                    <ShinyButton className="text-lg px-8 py-4 bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/50">
                      Explore The Files
                    </ShinyButton>
                  </Link>
                  <Link href="/visualizer">
                    <PulsatingButton className="text-lg px-8 py-4 bg-orange-600 hover:bg-orange-700">
                      Visualize The Data
                    </PulsatingButton>
                  </Link>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-1 flex items-center justify-center order-1 lg:order-2 h-[40vh] lg:h-[60vh] w-full"> {/* Increased height for model container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative w-full h-full"
              >
                <OrangeHero />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="golden-p-8 border-t border-white/10"
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
      <section className="py-24 border-t border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 via-background to-orange-500/5" />
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

      {/* Mission Statement */}
      <section className="relative py-24 overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 via-background to-purple-500/5" />
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
