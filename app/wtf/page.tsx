"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { TrumpFilesBrand } from "@/components/TrumpFilesBrand";
import { DotPattern } from "@/components/ui/dot-pattern";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import Image from "next/image";

export default function WTFPage() {
  return (
    <div
      className="min-h-screen w-full dark:bg-black bg-white dark:bg-grid-white/[0.05] bg-grid-black/[0.2] relative"
      data-oid="2l7-7a4"
    >
      <DotPattern className="absolute top-0 left-0" data-oid="oeggjbz" />
      <div
        className="container mx-auto px-4 max-w-4xl py-16"
        data-oid="dy-l:l5"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
          data-oid="4fjq2on"
        >
          <AnimatedShinyText
            className="text-4xl lg:text-6xl font-bold mb-4"
            data-oid="tz2c_66"
          >
            What The Fuck Are{" "}
            <TrumpFilesBrand
              size="2xl"
              className="inline-flex"
              data-oid="w3hnmwt"
            />
            ?
          </AnimatedShinyText>
        </motion.div>

        <div className="space-y-12" data-oid="_h97r5w">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            data-oid="umcw9lr"
          >
            <Card className="glass-card border-white/10" data-oid="xpz7z.p">
              <CardContent className="p-8" data-oid="pkx03mz">
                <h2
                  className="font-heading text-3xl mb-4 text-primary"
                  data-oid="l.zem8p"
                >
                  The Mission
                </h2>
                <p
                  className="text-lg text-foreground/80 leading-relaxed"
                  data-oid="zzmybx-"
                >
                  Welcome to the internet's most comprehensive attempt to
                  document **the single most absurd, dangerous, and fascinating
                  human being** to ever stumble into the presidency—twice. This
                  archive exists because **every single day with Trump is a
                  five-alarm dumpster fire**, and if we don't write it down,
                  we'll forget half of it by Wednesday.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <div
            className="grid md:grid-cols-3 gap-8 items-center"
            data-oid="grk483r"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="md:col-span-2"
              data-oid="ld91y74"
            >
              <h3 className="font-heading text-2xl mb-4" data-oid="dglexqd">
                The Three Hats
              </h3>
              <ul className="space-y-4" data-oid="btvunq:">
                <li data-oid="molv817">
                  <h4 className="font-bold text-xl" data-oid="j3s2j2j">
                    🎩 The Archive
                  </h4>
                  <p className="text-foreground/70" data-oid="rtuxqza">
                    So we don't forget this shit actually happened. Every lie,
                    every scam, every batshit press conference is here,
                    timestamped, sourced, and scored.
                  </p>
                </li>
                <li data-oid="88pqusp">
                  <h4 className="font-bold text-xl" data-oid="bjv.2px">
                    🔬 The Science
                  </h4>
                  <p className="text-foreground/70" data-oid="ojc-osl">
                    Turning chaos into data. Every entry is tagged, categorized,
                    and scored across eight dimensions so we can see the
                    patterns.
                  </p>
                </li>
                <li data-oid="zmvq3a.">
                  <h4 className="font-bold text-xl" data-oid="witx5-z">
                    😂 The Comedy
                  </h4>
                  <p className="text-foreground/70" data-oid=".h54ywv">
                    Because if you don't laugh, you'll scream. A monument to the
                    absurd, because the man is 70% grift, 20% dementia, and 10%
                    spray tan.
                  </p>
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              data-oid="auo3bzn"
            >
              <Image
                src="/images/ascii_box.png"
                alt="Trump Personality Pie Chart"
                width={300}
                height={300}
                className="mx-auto"
                data-oid="cee9_50"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            data-oid="2fw7-f6"
          >
            <h3
              className="font-heading text-2xl mb-4 text-center"
              data-oid=".e98a1i"
            >
              The 40-Year Trump Show
            </h3>
            <div className="flex justify-center" data-oid="p84xyd0">
              <ol
                className="relative border-l border-primary/50"
                data-oid="6ek4p54"
              >
                <li className="mb-10 ml-4" data-oid="vf1egvs">
                  <div
                    className="absolute w-3 h-3 bg-primary rounded-full mt-1.5 -left-1.5 border border-white"
                    data-oid="w_9si_e"
                  ></div>
                  <h4 className="text-xl font-semibold" data-oid="h42cxoa">
                    1970s: Racist Landlord
                  </h4>
                </li>
                <li className="mb-10 ml-4" data-oid="u_xumtu">
                  <div
                    className="absolute w-3 h-3 bg-primary rounded-full mt-1.5 -left-1.5 border border-white"
                    data-oid="3gfrrio"
                  ></div>
                  <h4 className="text-xl font-semibold" data-oid="ufpdkv7">
                    1980s: Failed Casino Mogul
                  </h4>
                </li>
                <li className="mb-10 ml-4" data-oid="foef6rg">
                  <div
                    className="absolute w-3 h-3 bg-primary rounded-full mt-1.5 -left-1.5 border border-white"
                    data-oid="81lyhb:"
                  ></div>
                  <h4 className="text-xl font-semibold" data-oid="i6023ia">
                    2000s: Reality TV Grifter
                  </h4>
                </li>
                <li className="mb-10 ml-4" data-oid="swuyld-">
                  <div
                    className="absolute w-3 h-3 bg-primary rounded-full mt-1.5 -left-1.5 border border-white"
                    data-oid="wim-uhy"
                  ></div>
                  <h4 className="text-xl font-semibold" data-oid="-38:dub">
                    2016: "Outsider" Populist
                  </h4>
                </li>
                <li className="mb-10 ml-4" data-oid="w:liad2">
                  <div
                    className="absolute w-3 h-3 bg-primary rounded-full mt-1.5 -left-1.5 border border-white"
                    data-oid="64dw5m7"
                  ></div>
                  <h4 className="text-xl font-semibold" data-oid="e6v6sxn">
                    2021: Attempted Coup
                  </h4>
                </li>
                <li className="ml-4" data-oid="vgyg-.1">
                  <div
                    className="absolute w-3 h-3 bg-primary rounded-full mt-1.5 -left-1.5 border border-white"
                    data-oid="x6nf5pz"
                  ></div>
                  <h4 className="text-xl font-semibold" data-oid="id1:oto">
                    2025: Full Fascist
                  </h4>
                </li>
              </ol>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
