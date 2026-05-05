"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Mail } from "lucide-react";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { useEntryCount } from "@/hooks/useEntryCount";

// ASCII Art - Simple block letters using only standard ASCII
const ASCII_ART = `
████████╗██╗  ██╗███████╗
   ██╔══╝██║  ██║██╔════╝
   ██║   ███████║█████╗
   ██║   ██╔══██║██╔══╝
   ██║   ██║  ██║███████╗
   ╚═╝   ╚═╝  ╚═╝╚══════╝

████████╗██████╗ ██╗   ██╗███╗   ███╗██████╗
   ██╔══╝██╔══██╗██║   ██║████╗ ████║██╔══██╗
   ██║   ██████╔╝██║   ██║██╔████╔██║██████╔╝
   ██║   ██╔══██╗██║   ██║██║╚██╔╝██║██╔═══╝
   ██║   ██║  ██║╚██████╔╝██║ ╚═╝ ██║██║
   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝

███████╗██╗██╗     ███████╗███████╗
██╔════╝██║██║     ██╔════╝██╔════╝
█████╗  ██║██║     █████╗  ███████╗
██╔══╝  ██║██║     ██╔══╝  ╚════██║
██║     ██║███████╗███████╗███████║
╚═╝     ╚═╝╚══════╝╚══════╝╚══════╝`;

export default function AsciiFooter() {
  const { formatted: entryCount, lastScrapedFormatted } = useEntryCount();
  return (
    <footer className="relative border-t border-white/10 bg-black/50 backdrop-blur-sm overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <FlickeringGrid
          squareSize={3}
          gridGap={5}
          color="#f97316"
          maxOpacity={0.3}
          flickerChance={0.2}
          className="w-full h-full"
        />
      </div>
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* ASCII Art Brand Title - Left Column */}
          <div className="flex flex-col justify-center">
            <pre
              className="leading-none text-orange-500 whitespace-pre overflow-hidden select-none mb-4 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]"
              style={{
                fontFamily: '"Menlo", "Monaco", "Courier New", monospace',
                fontSize: '0.65rem',
                letterSpacing: '-0.03em'
              }}
            >
              {ASCII_ART}
            </pre>
            <div className="font-mono text-xs text-orange-500/60 mt-2 tracking-widest">
              ════════════════════════════════
            </div>
            <p className="text-sm text-foreground/60 mt-6">
              A comprehensive, data-driven archive documenting {entryCount}+ incidents across 40+ years.
            </p>
            {lastScrapedFormatted && (
              <p className="text-xs text-orange-500/50 mt-2 font-mono tracking-wider">
                LAST UPDATED: {lastScrapedFormatted}
              </p>
            )}
          </div>

          {/* Trump Bathtub Image - Center Column (Centered Both Horizontally & Vertically) */}
          <div className="flex items-center justify-center self-center">
            <div className="relative group">
              <Image
                src="/images/trump_bathtub.png"
                alt="Trump in Bathtub"
                width={280}
                height={280}
                className="w-auto h-auto max-w-[280px] object-contain drop-shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all duration-500 group-hover:drop-shadow-[0_0_30px_rgba(249,115,22,0.6)] group-hover:scale-105"
                style={{ width: 'auto', height: 'auto' }}
              />
              {/* Animated border glow */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500/20 via-transparent to-orange-500/20 animate-pulse opacity-50 pointer-events-none" />
            </div>
          </div>

          {/* Links & Social - Right Column */}
          <div className="space-y-6 text-right flex flex-col justify-center">
            <div>
              <h3 className="text-lg font-bold mb-4 text-orange-400">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-foreground/70 hover:text-orange-400 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/catalog" className="text-foreground/70 hover:text-orange-400 transition-colors">
                    Catalog
                  </Link>
                </li>
                <li>
                  <Link href="/visualizer" className="text-foreground/70 hover:text-orange-400 transition-colors">
                    Data Visualizer
                  </Link>
                </li>
                <li>
                  <Link href="/wtf" className="text-foreground/70 hover:text-orange-400 transition-colors">
                    What The Fuck?
                  </Link>
                </li>
                <li>
                  <Link href="/enigma" className="text-foreground/70 hover:text-orange-400 transition-colors">
                    Enigma
                  </Link>
                </li>
                <li>
                  <Link href="/donate" className="text-foreground/70 hover:text-orange-400 transition-colors">
                    WHOAMI?
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 text-orange-400">Connect</h3>
              <div className="flex gap-4 justify-end">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 hover:text-orange-400 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 hover:text-orange-400 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="mailto:contact@trumpfiles.fun"
                  className="text-foreground/70 hover:text-orange-400 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-foreground/50">
          <p>
            © {new Date().getFullYear()} The Trump Files. All rights reserved. | Built with spite and data.
          </p>
          <p className="mt-2 text-xs">
            <strong className="text-orange-400">Disclaimer:</strong> This website is a satirical archive and analytical tool. All entries are sourced and fact-checked. No endorsement of any political party or candidate implied.
          </p>
        </div>
      </div>
    </footer>
  );
}
