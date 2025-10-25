"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { PulsatingButton } from "@/components/ui/pulsating-button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Database, BarChart3, Shield, Zap } from "lucide-react";
import {
  TrumpFilesBrand,
  TrumpFilesHeading,
} from "@/components/TrumpFilesBrand";
import { WarpBackground } from "@/components/ui/warp-background";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { TextReveal } from "@/components/ui/text-reveal";
import { MagicCard } from "@/components/ui/magic-card";

// Dynamically import 3D component to avoid SSR issues
const OrangeHero = dynamic(() => import("@/components/OrangeHero"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-[500px] flex items-center justify-center"
      data-oid="__06ozl"
    >
      <div className="animate-pulse text-2xl text-primary" data-oid="2.lth9j">
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
    <div className="min-h-screen" data-oid="9o0tanf">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden golden-p-8"
        data-oid="xp8w6qd"
      >
        <WarpBackground data-oid="en:wazl">
          <div className="container mx-auto px-4" data-oid="ls.d_bf">
            <div
              className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]"
              data-oid="z6yrtvt"
            >
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6 text-center lg:text-left"
                data-oid="qlgaef0"
              >
                <Badge
                  className="bg-primary/20 text-primary border-primary/30"
                  data-oid="38i:9p5"
                >
                  The Definitive Data-Driven Encyclopedia of Political Absurdity
                </Badge>
                <div
                  className="text-5xl lg:text-7xl font-bold"
                  data-oid="9bw45yu"
                >
                  <AnimatedShinyText data-oid="575gi2v">
                    <TrumpFilesBrand
                      size="xl"
                      variant="hero"
                      data-oid="r15csil"
                    />
                  </AnimatedShinyText>
                </div>
                <TextReveal data-oid="ey.tcnm">
                  A comprehensive, data-driven archive of the 45th U.S.
                  President's most controversial and impactful moments. Explore,
                  analyze, and understand the data behind the headlines.
                </TextReveal>
                <div
                  className="flex gap-4 pt-4 justify-center lg:justify-start"
                  data-oid="m5d7zs:"
                >
                  <Link href="/catalog" data-oid="ead5-p.">
                    <InteractiveHoverButton data-oid="5d5gr3u">
                      Explore The Files
                    </InteractiveHoverButton>
                  </Link>
                  <Link href="/visualizer" data-oid="ux-d1fu">
                    <PulsatingButton data-oid="27vtej.">
                      Visualize The Data
                    </PulsatingButton>
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative h-full w-full rounded-none"
                data-oid="m4z98w8"
              >
                <OrangeHero data-oid="84ehr1." />
              </motion.div>
            </div>
          </div>
        </WarpBackground>
      </section>

      {/* Features Section */}
      <section
        className="golden-p-8 border-t border-white/10"
        data-oid="2z1ecgn"
      >
        <div className="container mx-auto px-4" data-oid="m137f54">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
            data-oid="2ylwo77"
          >
            <TrumpFilesHeading
              className="text-3xl lg:text-4xl font-bold mb-4"
              data-oid="lj9ghsc"
            >
              An Unprecedented Archive of a Presidency
            </TrumpFilesHeading>
            <p
              className="text-lg text-foreground/70 max-w-2xl mx-auto"
              data-oid="q:.vm5o"
            >
              Our platform provides the tools to dissect, analyze, and
              comprehend the events that shaped a tumultuous era in American
              history.
            </p>
          </motion.div>

          <div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            data-oid="c1oa_12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                data-oid="bh_fh.c"
              >
                <MagicCard
                  className="glass-card border-white/10 p-6 h-full hover:border-primary/30 transition-all duration-300"
                  data-oid="cjif2ff"
                >
                  <feature.icon
                    className="h-10 w-10 text-primary mb-4"
                    data-oid="fym6j1s"
                  />

                  <h3
                    className="text-xl font-semibold mb-2 font-heading"
                    data-oid="6_qbjew"
                  >
                    {feature.title}
                  </h3>
                  <p className="text-foreground/70" data-oid="5gz2znf">
                    {feature.description}
                  </p>
                </MagicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
