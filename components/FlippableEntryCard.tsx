"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AICompleteTrumpData } from "@/types/database";
import { MagicCard } from "@/components/ui/magic-card";
import { ThumbsUp, Share2, Mail, Twitter, Facebook, RotateCw } from "lucide-react";
import Image from "next/image";

interface FlippableEntryCardProps {
  entry: AICompleteTrumpData;
  index: number;
}

export function FlippableEntryCard({ entry, index }: FlippableEntryCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [userVote, setUserVote] = useState<number | null>(null);
  const [voteCount, setVoteCount] = useState(Math.floor(Math.random() * 1000)); // TODO: Get from DB

  const handleVote = async (score: number) => {
    setUserVote(score);
    try {
      const response = await fetch('/api/user-vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entryNumber: entry.entry_number,
          score,
          userId: null // Will use IP address as fallback
        })
      });
      const data = await response.json();
      if (data.success) {
        setVoteCount(data.voteCount);
      }
    } catch (error) {
      console.error('Failed to submit vote:', error);
    }
  };

  const getVoteColor = (position: number) => {
    const percentage = position / 10;
    if (percentage <= 0.3) return "bg-green-500";
    if (percentage <= 0.6) return "bg-yellow-500";
    if (percentage <= 0.8) return "bg-orange-500";
    return "bg-red-500";
  };

  // Parse actual source domains from entry data
  const getSourceLogos = () => {
    if (!entry.sources || entry.sources.length === 0) return [];
    
    return entry.sources.slice(0, 3).map(sourceUrl => {
      try {
        const url = new URL(sourceUrl);
        const domain = url.hostname.replace('www.', '');
        const logoFile = `${domain.replace(/\./g, '-')}.png`;
        return {
          domain,
          logo: `/brand_logos/${logoFile}`,
          url: sourceUrl
        };
      } catch {
        return null;
      }
    }).filter(Boolean) as { domain: string; logo: string; url: string }[];
  };
  
  const sources = getSourceLogos();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: Math.min(index * 0.05, 0.5), duration: 0.3 }}
      className="perspective-1000"
    >
      <div className="relative h-[600px]">
        <AnimatePresence mode="wait">
          {!isFlipped ? (
            // FRONT SIDE
            <motion.div
              key="front"
              initial={{ rotateY: 0 }}
              exit={{ rotateY: 90 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <MagicCard className="h-full hover:border-primary/50 transition-all">
                <CardContent className="p-6 space-y-4 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex justify-between items-start gap-2">
                    <Badge variant="outline" className="border-primary/50 text-primary font-mono">
                      #{entry.fucked_up_rank}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {entry.phase}
                    </Badge>
                  </div>

                  {/* Title & Category */}
                  <div>
                    <h3 className="text-lg font-heading line-clamp-2 mb-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent">
                      {entry.title}
                    </h3>
                    <p className="text-xs text-primary">{entry.category}</p>
                  </div>

                  {/* Synopsis */}
                  <p className="text-sm text-foreground/70 line-clamp-3 flex-shrink-0">
                    {entry.synopsis}
                  </p>

                  {/* Metadata */}
                  <div className="text-xs text-foreground/60 space-y-1">
                    {entry.date_start && (
                      <div>Date: {new Date(entry.date_start).toLocaleDateString()}</div>
                    )}
                    {entry.duration_days !== null && entry.duration_days > 0 && (
                      <div>Duration: {entry.duration_days} days</div>
                    )}
                  </div>

                  {/* Fucked-up Score */}
                  <div className="pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold">Fucked-up Score</span>
                      <span className="text-xl font-mono text-primary font-bold">
                        {parseFloat(entry.fucked_up_score).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Scoring Metrics with Progress Bars */}
                  <div className="space-y-2 flex-1 overflow-auto">
                    {[
                      { label: "Danger", value: entry.danger, color: "from-orange-500 to-red-500" },
                      { label: "Authoritarianism", value: entry.authoritarianism, color: "from-orange-500 to-orange-600" },
                      { label: "Lawlessness", value: entry.lawlessness, color: "from-yellow-500 to-yellow-600" },
                      { label: "Insanity", value: entry.insanity, color: "from-purple-500 to-purple-600" },
                      { label: "Absurdity", value: entry.absurdity, color: "from-blue-500 to-blue-600" },
                    ].map((metric) => (
                      <div key={metric.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-foreground/70">{metric.label}</span>
                          <span className="font-mono text-orange-400">{metric.value}/10</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${metric.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(metric.value / 10) * 100}%` }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Keywords */}
                  {entry.all_keywords && entry.all_keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2">
                      {entry.all_keywords.slice(0, 3).map((keyword) => (
                        <Badge key={keyword} variant="outline" className="text-xs px-2 py-0 border-white/20">
                          {keyword}
                        </Badge>
                      ))}
                      {entry.all_keywords.length > 3 && (
                        <Badge variant="outline" className="text-xs px-2 py-0 border-white/20">
                          +{entry.all_keywords.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Flip Button */}
                  <Button
                    onClick={() => setIsFlipped(true)}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-500/50"
                  >
                    <RotateCw className="h-4 w-4 mr-2" />
                    See Details
                  </Button>
                </CardContent>
              </MagicCard>
            </motion.div>
          ) : (
            // BACK SIDE
            <motion.div
              key="back"
              initial={{ rotateY: -90 }}
              animate={{ rotateY: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <MagicCard className="h-full hover:border-primary/50 transition-all">
                <CardContent className="p-6 space-y-4 h-full flex flex-col overflow-auto">
                  {/* Back Header */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-orange-400">Entry Details</h3>
                    <Button
                      onClick={() => setIsFlipped(false)}
                      variant="ghost"
                      size="sm"
                      className="text-orange-400"
                    >
                      <RotateCw className="h-4 w-4 mr-1" />
                      Flip Back
                    </Button>
                  </div>

                  {/* Detailed Synopsis */}
                  <div>
                    <h4 className="text-sm font-semibold text-orange-400 mb-2">Full Synopsis</h4>
                    <p className="text-sm text-foreground/80">{entry.synopsis}</p>
                    {entry.rationale_short && (
                      <p className="text-sm text-foreground/70 mt-2 italic">
                        Context: {entry.rationale_short}
                      </p>
                    )}
                  </div>

                  {/* Sources with Logos */}
                  <div>
                    <h4 className="text-sm font-semibold text-orange-400 mb-2">Sources</h4>
                    <div className="flex gap-2 flex-wrap">
                      {sources.length > 0 ? (
                        sources.map((source) => (
                          <a
                            key={source.domain}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative w-12 h-12 bg-white/10 rounded p-1 hover:bg-white/20 transition-all cursor-pointer"
                            title={source.domain}
                          >
                            <Image
                              src={source.logo}
                              alt={source.domain}
                              width={48}
                              height={48}
                              className="object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </a>
                        ))
                      ) : (
                        <p className="text-xs text-foreground/60">No sources available</p>
                      )}
                    </div>
                  </div>

                  {/* 10-Point Voting System */}
                  <div>
                    <h4 className="text-sm font-semibold text-orange-400 mb-2">
                      Rate This Entry ({voteCount} votes)
                    </h4>
                    <div className="grid grid-cols-10 gap-1">
                      {[...Array(10)].map((_, i) => {
                        const score = i + 1;
                        return (
                          <button
                            key={score}
                            onClick={() => handleVote(score)}
                            className={`aspect-square rounded ${
                              userVote === score
                                ? `${getVoteColor(score)} ring-2 ring-white`
                                : `${getVoteColor(score)}/30 hover:${getVoteColor(score)}`
                            } transition-all flex items-center justify-center text-xs font-bold`}
                          >
                            {score}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Social Sharing */}
                  <div>
                    <h4 className="text-sm font-semibold text-orange-400 mb-2">Share</h4>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Twitter className="h-4 w-4 mr-1 text-orange-400" />
                        Twitter
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Facebook className="h-4 w-4 mr-1 text-orange-400" />
                        Facebook
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Mail className="h-4 w-4 mr-1 text-orange-400" />
                        Email
                      </Button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div>
                    <h4 className="text-sm font-semibold text-orange-400 mb-2">Discussion</h4>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => window.location.href = `/entry/${entry.entry_number}#comments`}
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        View Full Discussion
                      </Button>
                      <p className="text-xs text-foreground/60 text-center">
                        Comment moderation active to prevent spam
                      </p>
                    </div>
                  </div>
                </CardContent>
              </MagicCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
