"use client";

import Link from "next/link";
import { Github, Twitter, Mail } from "lucide-react";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

// ASCII Art for THE TRUMP FILES - Block letter style
const ASCII_ART = `
████████╗██╗  ██╗███████╗
╚══██╔══╝██║  ██║██╔════╝
   ██║   ███████║█████╗  
   ██║   ██╔══██║██╔══╝  
   ██║   ██║  ██║███████╗
   ╚═╝   ╚═╝  ╚═╝╚══════╝

████████╗██████╗ ██╗   ██╗███╗   ███╗██████╗ 
╚══██╔══╝██╔══██╗██║   ██║████╗ ████║██╔══██╗
   ██║   ██████╔╝██║   ██║██╔████╔██║██████╔╝
   ██║   ██╔══██╗██║   ██║██║╚██╔╝██║██╔═══╝ 
   ██║   ██║  ██║╚██████╔╝██║ ╚═╝ ██║██║     
   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     

███████╗██╗██╗     ███████╗███████╗
██╔════╝██║██║     ██╔════╝██╔════╝
█████╗  ██║██║     █████╗  ███████╗
██╔══╝  ██║██║     ██╔══╝  ╚════██║
██║     ██║███████╗███████╗███████║
╚═╝     ╚═╝╚══════╝╚══════╝╚══════╝
`;

export default function AsciiFooter() {
  return (
    <footer className="relative border-t border-white/10 bg-black/50 backdrop-blur-sm overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <FlickeringGrid
          squareSize={4}
          gridGap={6}
          color="#f97316"
          maxOpacity={0.15}
          flickerChance={0.1}
          className="w-full h-full"
        />
      </div>
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* ASCII Art Brand Title */}
          <div className="md:col-span-2">
            <pre className="font-mono text-xs md:text-sm leading-none text-orange-500 whitespace-pre overflow-hidden select-none mb-4 bg-linear-to-r from-orange-500 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]">
              {ASCII_ART}
            </pre>
            <div className="font-mono text-xs text-orange-500/60 mt-2 tracking-widest">
              ════════════════════════════════
            </div>
            <p className="text-sm text-foreground/60 mt-6">
              A comprehensive, data-driven archive documenting 700+ incidents across 40+ years.
            </p>
          </div>

          {/* Links & Social */}
          <div className="space-y-6">
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
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 text-orange-400">Connect</h3>
              <div className="flex gap-4">
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
