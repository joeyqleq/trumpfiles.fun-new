"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { TrumpFilesBrand } from "@/components/TrumpFilesBrand";
import Image from "next/image";
import { BookOpen, TrendingUp, Laugh, Database, Network, BarChart3, Brain } from "lucide-react";

export default function WTFPage() {
  return (
    <div className="min-h-screen w-full dark:bg-black bg-white relative">
      <div className="container mx-auto px-4 max-w-6xl py-16">
        {/* Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="text-5xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent font-[family-name:var(--font-arctic-guardian-semi)]">
              What The Fuck Are
            </span>{" "}
            <TrumpFilesBrand size="2xl" className="inline-flex" />?
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            🥸 Encyclopedia meets Comedy Central meets Crime Scene Tape
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <Card className="glass-card border-orange-500/20 shadow-lg shadow-orange-500/10">
            <CardContent className="p-8">
              <p className="text-lg text-foreground/80 leading-relaxed mb-4">
                Welcome to <strong className="text-orange-400 text-xl">The Trump Files</strong>, a database for everyone who suspects the recent history of American democracy feels less like a <span className="text-orange-300 font-bold">government</span> and more like an <span className="text-orange-400 text-lg">absurdist reality show</span>, an open-mic <span className="font-bold text-orange-300">comedy roast</span>, and a <span className="text-orange-400 text-xl font-bold">four-alarm crime blotter</span> all at once.
              </p>
              <p className="text-lg text-foreground/80 leading-relaxed">
                This isn't your grandpa's presidential archive—unless your grandpa is into tracking every time one guy suggests nuking hurricanes, drinking bleach, or pardoning someone in exchange for hotel bookings.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Magazine-style Two-Column Section with Logo Float */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent font-[family-name:var(--font-arctic-guardian-semi)]">
            What The Fuck Is All This?
          </h2>
          <div className="relative">
            {/* Floating Trump Logo */}
            <Image
              src="/images/ascii_box.png"
              alt="Trump ASCII Logo"
              width={250}
              height={250}
              className="float-right ml-6 mb-4 mt-2"
            />
            <div className="text-lg text-foreground/80 leading-relaxed space-y-4">
              <p>
                The Trump Files is the internet's most <span className="text-orange-400 font-bold">comprehensive</span>, <span className="text-lg text-orange-300">absurd</span>, darkly <span className="font-bold">hilarious</span>, and [<span className="text-orange-400">painfully</span>] accurate attempt to document the nearly <span className="text-xl font-bold text-orange-400">unfathomable era</span> that is "life with Donald Trump."
              </p>
              <p>
                Over <span className="text-orange-400 font-bold text-xl">40 years</span>, this walking <span className="text-orange-300 font-bold">SNL sketch</span> (with <span className="text-orange-400 text-lg">nuclear codes!</span>) has stunned, trolled, and conned society while amassing scandals at a pace that would make <span className="font-bold text-orange-300">Machiavelli sweat</span>.
              </p>
              <p className="font-bold text-orange-400">
                Why?
              </p>
              <p>
                Because each new week brings so much chaos, we'd forget the coup attempt by Wednesday if we didn't keep historical receipts! This archive exists to say: <strong className="text-orange-400">YES, it was that bad</strong>—and here's 778 cited, timestamped, tagged, AI-rated records to prove it.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Project Vision */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent font-[family-name:var(--font-arctic-guardian-semi)]">
            Project Vision: Break The Cycle of Amnesia
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="glass-card border-orange-500/20">
              <CardContent className="p-6">
                <BookOpen className="w-12 h-12 text-orange-400 mb-4" />
                <h3 className="text-2xl font-bold mb-3 text-orange-400">The Ledger</h3>
                <p className="text-foreground/70">
                  No "it wasn't that bad" or "I don't recall" gaslighting. This is the receipts. The ledger. The failed grifts and the dangerous tantrums. Time-stamped. Source-linked. Scored.
                </p>
              </CardContent>
            </Card>
            <Card className="glass-card border-orange-500/20">
              <CardContent className="p-6">
                <Database className="w-12 h-12 text-orange-400 mb-4" />
                <h3 className="text-2xl font-bold mb-3 text-orange-400">The Science</h3>
                <p className="text-foreground/70">
                  This isn't a list, it's an AI-multimodal, semantically linked, pattern-extracted, SQL-embeddable, neural-network-scorable relational archive. (Translation: even machines can spot the bullshit now.)
                </p>
              </CardContent>
            </Card>
            <Card className="glass-card border-orange-500/20">
              <CardContent className="p-6">
                <Laugh className="w-12 h-12 text-orange-400 mb-4" />
                <h3 className="text-2xl font-bold mb-3 text-orange-400">The Comedy</h3>
                <p className="text-foreground/70">
                  If you don't laugh at "windmill cancer," "rake the forests," and "drink bleach" you'll cry. Jokes are mandatory because the subject matter is, at times, comically bleak.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Methodology */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent font-[family-name:var(--font-arctic-guardian-semi)]">
            Methodology: The Data Pipeline from Hell
          </h2>
          <Card className="glass-card border-orange-500/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-orange-400 uppercase tracking-wider">Multimodal AI Agents & Human Sadness</h3>
              <ul className="space-y-4 text-lg text-foreground/80">
                <li className="flex items-start">
                  <Network className="w-6 h-6 text-orange-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="text-orange-400">Source Network:</strong> Scrape everything—major news, obscure footnotes, the Trump Twitter Archive, Truth Social posts, DOJ dockets, PolitiFact, social media, Congressional hearings, even that one weird uncle's Facebook rant.
                  </div>
                </li>
                <li className="flex items-start">
                  <TrendingUp className="w-6 h-6 text-orange-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="text-orange-400">Validation:</strong> At least two independent sources or a primary doc. No, Truth Social alone is not a source.
                  </div>
                </li>
                <li className="flex items-start">
                  <BarChart3 className="w-6 h-6 text-orange-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="text-orange-400">Significance Filter:</strong> If it's not verifiably nuts, dangerous, or a pattern escalator, it doesn't make the cut. No trivia. Only platinum-graded "can't-believe-this-actually-happened" bits.
                  </div>
                </li>
                <li className="flex items-start">
                  <Brain className="w-6 h-6 text-orange-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="text-orange-400">AI Scoring:</strong> Each entry rated by AI agents across 8 dimensions (danger, insanity, absurdity, lawlessness, authoritarianism, lying, recency intensity, impact scope) with human "are you kidding me?" review as backup.
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Personality Pie Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent font-[family-name:var(--font-arctic-guardian-semi)]">
            🧠 Core Personality Pie Chart
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center">
              <Image
                src="/images/wtf_pie_chart.png"
                alt="Trump Core Personality Breakdown"
                width={400}
                height={400}
                className="rounded-lg"
              />
            </div>
            <Card className="glass-card border-orange-500/20">
              <CardContent className="p-6">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-orange-500/30">
                      <th className="pb-2 text-orange-400 font-bold">Trait</th>
                      <th className="pb-2 text-orange-400 font-bold text-right">%</th>
                    </tr>
                  </thead>
                  <tbody className="text-foreground/80">
                    <tr className="border-b border-white/10">
                      <td className="py-2">Narcissism</td>
                      <td className="py-2 text-right font-semibold">35</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-2">Grift</td>
                      <td className="py-2 text-right font-semibold">25</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-2">Racism</td>
                      <td className="py-2 text-right font-semibold">15</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-2">Compulsive Lying</td>
                      <td className="py-2 text-right font-semibold">15</td>
                    </tr>
                    <tr>
                      <td className="py-2">Spray Tan</td>
                      <td className="py-2 text-right font-semibold">10</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Analytics & Visualizations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent font-[family-name:var(--font-arctic-guardian-semi)]">
            📈 Analytics, Visualizations, and Custom Insights
          </h2>
          <Card className="glass-card border-orange-500/20">
            <CardContent className="p-8">
              <ul className="space-y-3 text-lg text-foreground/80">
                <li><strong className="text-orange-400">Timeline Heatmaps:</strong> Watch severity spikes and comedy gold clusters across years.</li>
                <li><strong className="text-orange-400">Cluster Maps:</strong> See which scandals flock together (spoiler: "election interference" and "pardons" are BFFs).</li>
                <li><strong className="text-orange-400">Language Evolution:</strong> Track "dog whistle" to "megaphone" in racist rhetoric.</li>
                <li><strong className="text-orange-400">Network Graphs:</strong> Uncover secret connections between cronies, grifters and coups.</li>
                <li><strong className="text-orange-400">AI-Generated Scores:</strong> Instantly see which moment was the peak "danger-stupid" intersection.</li>
                <li><strong className="text-orange-400">Impact Grid:</strong> Watch the dominoes fall as one scandal leads to another.</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* What Does This Teach Us */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent font-[family-name:var(--font-arctic-guardian-semi)]">
            What Does This Teach Us?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass-card border-orange-500/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 text-orange-400">Escalation is Real</h3>
                <p className="text-foreground/70">There's a chartable arc from "random New York grifter" to "openly courts fascism."</p>
              </CardContent>
            </Card>
            <Card className="glass-card border-orange-500/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 text-orange-400">Chaos is a Strategy</h3>
                <p className="text-foreground/70">Overwhelm is not the bug, it's the feature.</p>
              </CardContent>
            </Card>
            <Card className="glass-card border-orange-500/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 text-orange-400">Documentation IS Resistance</h3>
                <p className="text-foreground/70">Normalization is the enemy—comedy and memory are the cure.</p>
              </CardContent>
            </Card>
            <Card className="glass-card border-orange-500/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 text-orange-400">Impunity Breeds Boldness</h3>
                <p className="text-foreground/70">Every "get away with it" leads to something worse (and funnier/sadder).</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Our Goal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent font-[family-name:var(--font-arctic-guardian-semi)]">
            Our Goal
          </h2>
          <Card className="glass-card border-orange-500/20">
            <CardContent className="p-8">
              <p className="text-xl text-foreground/80 leading-relaxed">
                Democracy dies in darkness—but fascism thrives in mass amnesia and "lol nothing matters" culture. The Trump Files exists so when the grandkids ask "what happened, were you all high?" you can actually show them, with a chart, a meme, and a SQL query.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* What Can You Do */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent font-[family-name:var(--font-arctic-guardian-semi)]">
            What Can You Do?
          </h2>
          <Card className="glass-card border-orange-500/20">
            <CardContent className="p-8">
              <ul className="space-y-3 text-lg text-foreground/80">
                <li><strong className="text-orange-400">Semantic search:</strong> Find "every time Trump abused a pardon."</li>
                <li><strong className="text-orange-400">Sort:</strong> By composite score, by era, by "which scandal was dumbest, but most dangerous."</li>
                <li><strong className="text-orange-400">Filter:</strong> Narrow by year, severity, lawlessness, or "times he almost burned the place down."</li>
                <li><strong className="text-orange-400">Community Voting:</strong> Soon, users can up/downvote severity scores, flag missed connections, or submit sources ("No, injecting light was not medical advice!").</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* WTF is Next */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent font-[family-name:var(--font-arctic-guardian-semi)]">
            WTF is Next?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass-card border-orange-500/20">
              <CardContent className="p-6">
                <p className="text-foreground/70">Public API for nerds and researchers.</p>
              </CardContent>
            </Card>
            <Card className="glass-card border-orange-500/20">
              <CardContent className="p-6">
                <p className="text-foreground/70">Live dashboards and meme timelines.</p>
              </CardContent>
            </Card>
            <Card className="glass-card border-orange-500/20">
              <CardContent className="p-6">
                <p className="text-foreground/70">Crowdsourced ratings (because who's more critical than a news junkie with ADHD?)</p>
              </CardContent>
            </Card>
            <Card className="glass-card border-orange-500/20">
              <CardContent className="p-6">
                <p className="text-foreground/70">Chatbot for receipts: "Hey, did Trump actually tell people to nuke hurricanes?" Yup. Here's the receipt.</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Closing */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <Card className="glass-card border-orange-500/20 bg-gradient-to-br from-orange-900/20 to-orange-950/20">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4 text-orange-400">
                If You Made It This Far...
              </h2>
              <p className="text-lg text-foreground/80 leading-relaxed max-w-3xl mx-auto">
                Thank you. You're just as much part of the resistance to normalization as the poor AI and human souls who built this database. Enjoy the ride, laugh through the pain, and remember: <strong className="text-orange-400">if we don't record it, they'll say it never happened.</strong>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
