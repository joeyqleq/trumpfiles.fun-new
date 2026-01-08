"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import GlitchText from "@/components/GlitchText";
import { Calendar, MapPin, Users, Heart, DollarSign, Skull, Crown } from "lucide-react";

export default function EnigmaPage() {
  const bioData = [
    { label: "Full Name", value: "Donald John Trump", icon: Users },
    { label: "Born", value: "June 14, 1946 (Age: 78)", icon: Calendar },
    { label: "Where From", value: "Queens, New York, USA", icon: MapPin },
    { label: "Family", value: "5 Children, 10 Grandchildren", icon: Users },
    { label: "Marriages", value: "3 (and counting?)", icon: Heart },
    { label: "Divorces", value: "2 (so far)", icon: Heart },
    { label: "Current Spouse", value: "Melania 'Doom Terminator' Trump", icon: Heart },
    { label: "Recognized Children", value: "Don Jr., Ivanka, Eric, Tiffany, Barron", icon: Users },
    { label: "Unclear/Unrecognized", value: "Allegedly more than we know", icon: Skull },
    { label: "Pornstars Paid", value: "Not nearly enough!", icon: DollarSign },
  ];

  const timelineEvents = [
    {
      year: "1946",
      title: "Birth of a 'Stable Genius'",
      description: "Born into wealth in Queens, NY. Fred Trump's son begins his journey to becoming 'the chosen one'.",
      impact: "The world never recovered.",
      color: "from-orange-500 to-yellow-500"
    },
    {
      year: "1968",
      title: "Dodging Drafts, Not Responsibilities",
      description: "Avoided Vietnam War with bone spurs. Too busy building an empire of debt.",
      impact: "Set precedent for avoiding accountability.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      year: "1973",
      title: "First Major Lawsuit",
      description: "DOJ sues Trump & father for housing discrimination. Settled without admitting guilt.",
      impact: "Legal pattern established early.",
      color: "from-orange-500 to-red-500"
    },
    {
      year: "1977-1990",
      title: "The Casino Years",
      description: "Built casinos in Atlantic City. Most went bankrupt. Trump Tower opens. Art of the Deal published.",
      impact: "Created persona of 'successful businessman' despite failures.",
      color: "from-red-500 to-orange-500"
    },
    {
      year: "1991-2004",
      title: "Bankruptcy Season",
      description: "Multiple casino bankruptcies. Taj Mahal, Plaza Hotel, Trump Hotels & Casino Resorts all fail.",
      impact: "Perfected the art of losing other people's money.",
      color: "from-orange-500 to-red-600"
    },
    {
      year: "2004-2015",
      title: "Reality TV Star Era",
      description: "The Apprentice premieres. 'You're fired!' becomes catchphrase. Celebrity status cemented.",
      impact: "Mainstream fame enabled political ambitions.",
      color: "from-orange-400 to-orange-600"
    },
    {
      year: "2015",
      title: "The Escalator Descent",
      description: "Announces presidential campaign calling Mexicans 'rapists and criminals'. Political career begins.",
      impact: "Democracy's worst nightmare becomes real.",
      color: "from-orange-600 to-red-700"
    },
    {
      year: "2016",
      title: "Against All Odds (and Logic)",
      description: "Defeats Hillary Clinton despite losing popular vote. Electoral College victory.",
      impact: "Reality TV host becomes Commander-in-Chief.",
      color: "from-red-600 to-red-800"
    },
    {
      year: "2017-2021",
      title: "The Presidential Years",
      description: "2 impeachments, 30k+ lies, pandemic mismanagement, family separation, Jan 6 insurrection.",
      impact: "Democracy shaken to its core. 400k+ COVID deaths.",
      color: "from-red-700 to-red-900"
    },
    {
      year: "2021",
      title: "January 6th: The Attempted Coup",
      description: "Incites mob to storm Capitol. Refuses to accept election results. Democracy attacked.",
      impact: "First president to refuse peaceful transfer of power.",
      color: "from-red-900 to-black"
    },
    {
      year: "2022-2023",
      title: "Legal Reckoning",
      description: "4 criminal indictments: Georgia RICO, Jan 6, Mar-a-Lago documents, NY business fraud.",
      impact: "First former president indicted on federal charges.",
      color: "from-red-800 to-orange-700"
    },
    {
      year: "2024",
      title: "The Return Attempt",
      description: "Runs for president again despite legal troubles. Cult of personality stronger than ever.",
      impact: "Democracy's stress test continues.",
      color: "from-orange-600 to-red-700"
    },
    {
      year: "2025+",
      title: "Future Roadmap: TBD",
      description: "Will it be prison? Mar-a-Lago exile? Another run? The grift continues either way.",
      impact: "History will not be kind. Neither will we.",
      color: "from-red-600 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <div className="flex justify-center mb-4">
            <GlitchText 
              speed={1} 
              enableShadows={true} 
              enableOnHover={false}
              className="text-4xl lg:text-6xl bg-linear-to-r! from-orange-500! via-orange-400! to-red-500! bg-clip-text! text-transparent!"
            >
              THE ENIGMA
            </GlitchText>
          </div>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto italic">
            "The Enigma" - The nickname given by Trump to Jeffrey Epstein and himself in that controversial birthday card
          </p>
        </motion.div>

        {/* Bio Section with ProfileCard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid lg:grid-cols-2 gap-8 mb-16"
        >
          {/* Left: Biographical Info */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold mb-6 bg-linear-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Basic Biographical Information
            </h2>
            {bioData.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Card className="glass-card border-orange-500/20 hover:border-orange-500/40 transition-all">
                    <CardContent className="p-4 flex items-center gap-4">
                      <Icon className="w-6 h-6 text-orange-400 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-foreground/60">{item.label}</p>
                        <p className="text-lg font-semibold text-orange-400">{item.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Right: ProfileCard with Birthday Drawing */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-start"
          >
            <Card className="glass-card border-orange-500/30 overflow-hidden w-full">
              <CardContent className="p-0">
                <div className="relative w-full h-[600px]">
                  <Image
                    src="/images/enigmas_birthday_drawing.png"
                    alt="Trump's Birthday Card to Epstein"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="p-6 bg-linear-to-t from-black/80 to-transparent">
                  <h3 className="text-2xl font-bold text-orange-400 mb-2">
                    The Infamous Birthday Card
                  </h3>
                  <p className="text-foreground/70">
                    The birthday card Trump wrote to Jeffrey Epstein, signing it "The Enigma" - 
                    a reference he claims never happened. The evidence says otherwise.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Timeline Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold mb-8 text-center bg-linear-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Timeline: A Life of Scandal & Spectacle
          </h2>
          <p className="text-center text-foreground/60 mb-12 max-w-3xl mx-auto">
            From Queens real estate heir to reality TV star to President to indicted criminal - 
            a journey that proves the American Dream can become everyone else's nightmare.
          </p>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-linear-to-b from-orange-500 via-red-500 to-purple-600 h-full" />

            {/* Timeline Events */}
            <div className="space-y-12">
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center gap-8`}
                >
                  {/* Content Card */}
                  <div className="flex-1">
                    <Card className={`glass-card border-2 bg-linear-to-br ${event.color} bg-opacity-10 hover:scale-105 transition-all duration-300`}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <Crown className="w-6 h-6 text-orange-400" />
                          <span className="text-2xl font-bold text-orange-400">{event.year}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-white">{event.title}</h3>
                        <p className="text-foreground/80 mb-3">{event.description}</p>
                        <div className="pt-3 border-t border-white/10">
                          <p className="text-sm text-orange-400 font-semibold">
                            Impact: <span className="text-foreground/70 font-normal">{event.impact}</span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline Dot */}
                  <div className="relative flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-orange-500 to-red-500 border-4 border-black shadow-lg shadow-orange-500/50 z-10" />
                  </div>

                  {/* Spacer for opposite side */}
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Closing Card */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="glass-card border-orange-500/30 bg-linear-to-br from-orange-900/20 to-red-950/20">
            <CardContent className="p-12 text-center">
              <h3 className="text-3xl font-bold mb-4 text-orange-400">
                The Enigma Continues...
              </h3>
              <p className="text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
                From humble beginnings as a millionaire's son to reality TV icon to the most controversial 
                president in modern history, Donald Trump has left an indelible mark on America. 
                Whether that mark is a stain or a badge depends on who you ask. 
                But one thing is certain: <span className="text-orange-400 font-bold">The receipts are all here.</span>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
