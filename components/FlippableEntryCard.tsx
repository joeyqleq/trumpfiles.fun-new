"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AICompleteTrumpData } from "@/types/database";
import { MagicCard } from "@/components/ui/magic-card";
import { ThumbsUp, Mail, Twitter, Facebook, RotateCw, ExternalLink } from "lucide-react";

// Source type from the database
interface Source {
  url: string;
  title: string;
  publisher: string;
  source_type: string;
}

// Extended entry type with sources
interface EntryWithSources extends AICompleteTrumpData {
  sources?: Source[];
}

interface FlippableEntryCardProps {
  entry: EntryWithSources;
  index: number;
  onEmailClick?: () => void;
}

// Domain aliases for logo matching (normalized domain -> logo filename)
// Rule: always use the EXACT filename as it exists in /public/brand_logos/
const DOMAIN_LOGO_MAP: Record<string, string> = {
  // Major news — verified against actual files in /public/brand_logos/
  'theguardian.com':    'theguardian-com.png',
  'guardian.com':       'theguardian-com.png',
  'bbc.com':            'bbc-com.png',
  'bbc.co.uk':          'bbc-co-uk.png',
  'cnn.com':            'cnn-com.png',
  'nytimes.com':        'nytimes-com.png', // nytimes-com.png exists (also nytimes.png — use hyphenated)
  'washingtonpost.com': 'washingtonpost.png', // actual file is washingtonpost.png (no -com)
  'reuters.com':        'reuters-com.png',
  'apnews.com':         'apnews-com.png',
  'ap.org':             'apnews-com.png',
  'npr.org':            'npr-org.png',
  'pbs.org':            'pbs-org.png',
  'time.com':           'time-com.png',
  'politico.com':       'politico-com.png',
  'axios.com':          'axios-com.png',
  'cbsnews.com':        'cbsnews-com.png',
  'nbcnews.com':        'nbcnews-com.png',
  'nbcnews.co':         'nbcnews-com.png',
  'vox.com':            'vox-com.png',
  'theatlantic.com':    'theatlantic-com.png',
  'newyorker.com':      'newyorker-com.png',
  'latimes.com':        'latimes-com.png',
  'wsj.com':            'wsj-com.png',
  'bloomberg.com':      'bloomberg-com.png',
  'cnbc.com':           'cnbc-com.png',
  'motherjones.com':    'motherjones-com.png',
  'thehill.com':        'thehill-com.png',
  'hill.com':           'thehill-com.png',
  'politifact.com':     'politifact-com.png',
  'wikipedia.org':      'en-wikipedia-org.png',
  'en.wikipedia.org':   'en-wikipedia-org.png',
  'usatoday.com':       'usatoday-com.png',
  'newsweek.com':       'newsweek-com.png',
  'businessinsider.com':'businessinsider-com.png',
  'propublica.org':     'propublica-org.png',
  'thedailybeast.com':  'thedailybeast-com.png',
  'dailybeast.com':     'thedailybeast-com.png',
  'aclu.org':           'aclu-org.png',
  'justice.gov':        'justice-gov.png',
  'whitehouse.gov':     'whitehouse-gov.png',
  'congress.gov':       'congress-gov.png',
  'abcnews.go.com':     'abcnews-go-com.png',
  'go.com':             'abcnews-go-com.png',
  'americanprogress.org': 'americanprogress-org.png',
  'brennancenter.org':  'brennancenter-org.png',
  'citizensforethics.org': 'citizensforethics-org.png',
  'kff.org':            'kff-org.png',
  'nwlc.org':           'nwlc-org.png',
  'state.gov':          'whitehouse-gov.png',
};

// Map domain to logo filename with smart fallbacks
const getDomainLogoFile = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    // Normalize domain - remove www and any subdomains for matching
    const domain = urlObj.hostname.replace(/^www\./, '').replace(/^www2\./, '');

    // Check direct mapping first
    if (DOMAIN_LOGO_MAP[domain]) {
      return DOMAIN_LOGO_MAP[domain];
    }

    // Try without subdomain (e.g., news.bbc.com -> bbc.com)
    const parts = domain.split('.');
    if (parts.length > 2) {
      const baseDomain = parts.slice(-2).join('.');
      if (DOMAIN_LOGO_MAP[baseDomain]) {
        return DOMAIN_LOGO_MAP[baseDomain];
      }
    }

    // Default: convert domain to filename format
    return domain.replace(/\./g, '-') + '.png';
  } catch {
    return null;
  }
};

// Get display name for publisher
const getPublisherDisplayName = (publisher: string, url: string): string => {
  if (publisher && publisher.trim()) return publisher;
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '');
    // Capitalize first letter of each word
    return domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);
  } catch {
    return 'Source';
  }
};

// Truncate synopsis if too long (for back of card)
const truncateSynopsis = (text: string, maxLength: number = 300): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export function FlippableEntryCard({ entry, index, onEmailClick }: FlippableEntryCardProps) {
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

  // Handle social sharing
  const handleTwitterShare = () => {
    const text = `Check out this Trump entry: "${entry.title}" - Score: ${parseFloat(entry.fucked_up_score).toFixed(2)}`;
    const url = `${window.location.origin}/entry/${entry.entry_number}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  const handleFacebookShare = () => {
    const url = `${window.location.origin}/entry/${entry.entry_number}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  const handleEmailShare = () => {
    // Use the contact modal if provided, otherwise open mail client
    if (onEmailClick) {
      onEmailClick();
    } else {
      const subject = `Trump Entry #${entry.entry_number}: ${entry.title}`;
      const body = `Check out this entry from TrumpFiles.fun:\n\n${entry.title}\nScore: ${parseFloat(entry.fucked_up_score).toFixed(2)}\n\n${entry.synopsis}\n\nView more: ${window.location.origin}/entry/${entry.entry_number}`;
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  };

  // Get sources array - ensure it's always an array
  const sources: Source[] = Array.isArray(entry.sources) ? entry.sources : [];

  // Check if synopsis is too long
  const isLongSynopsis = entry.synopsis.length > 300;
  const displaySynopsis = truncateSynopsis(entry.synopsis);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: Math.min(index * 0.05, 0.5), duration: 0.3 }}
      className="perspective-1000"
    >
      <div className="relative h-[680px]">
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
                <CardContent className="p-6 h-full flex flex-col">
                  {/* Header - Fixed height */}
                  <div className="flex justify-between items-start gap-2 mb-3 flex-shrink-0">
                    <Badge variant="outline" className="border-primary/50 text-primary font-mono">
                      #{entry.fucked_up_rank}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {entry.phase}
                    </Badge>
                  </div>

                  {/* Title & Category - Fixed height */}
                  <div className="flex-shrink-0 mb-3">
                    <h3 className="text-lg font-bold line-clamp-4 mb-1 text-orange-300/90 leading-snug" style={{ fontFamily: 'var(--font-outfit)', fontWeight: 700 }}>
                      {entry.title}
                    </h3>
                    <p className="text-xs text-primary font-arctic-left">{entry.category}</p>
                  </div>

                  {/* Synopsis - Fixed 3 lines */}
                  <p className="text-sm text-foreground/70 line-clamp-3 flex-shrink-0 mb-3">
                    {entry.synopsis}
                  </p>

                  {/* Metadata - Fixed height */}
                  <div className="text-xs text-foreground/60 space-y-1 flex-shrink-0 mb-3">
                    {entry.date_start && (
                      <div>Date: {new Date(entry.date_start).toLocaleDateString()}</div>
                    )}
                    {entry.duration_days !== null && entry.duration_days > 0 && (
                      <div>Duration: {entry.duration_days} days</div>
                    )}
                  </div>

                  {/* Fucked-up Score - Fixed height */}
                  <div className="pt-2 border-t border-white/10 flex-shrink-0 mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-arctic-half font-semibold">Fucked-up Score</span>
                      <span className="text-xl font-mono text-primary font-bold">
                        {parseFloat(entry.fucked_up_score).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Scoring Metrics - Flexible, takes remaining space */}
                  <div className="space-y-2 flex-1 min-h-0 overflow-hidden">
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

                  {/* Keywords - Fixed height */}
                  {entry.all_keywords && entry.all_keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2 flex-shrink-0">
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

                  {/* Spacer to push button down */}
                  <div className="flex-grow" />

                  {/* Flip Button - Always at bottom */}
                  <Button
                    onClick={() => setIsFlipped(true)}
                    className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-500/50 flex-shrink-0"
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
                <CardContent className="p-6 space-y-3 h-full flex flex-col overflow-auto">
                  {/* Back Header */}
                  <div className="flex justify-between items-center flex-shrink-0">
                    <h3 className="text-lg font-arctic-twotone text-orange-400">Entry Details</h3>
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
                  <div className="flex-shrink-0">
                    <h4 className="text-sm font-arctic-laser font-semibold text-orange-400 mb-1">Synopsis</h4>
                    <p className="text-sm text-foreground/80">
                      {displaySynopsis}
                      {isLongSynopsis && (
                        <span className="text-orange-400/70 text-xs ml-1">[See full discussion for more]</span>
                      )}
                    </p>
                    {entry.rationale_short && (
                      <p className="text-sm text-foreground/70 mt-2 italic">
                        Context: {entry.rationale_short}
                      </p>
                    )}
                  </div>

                  {/* Sources with Logos */}
                  <div className="flex-shrink-0">
                    <h4 className="text-sm font-arctic-half font-semibold text-orange-400 mb-2">Sources</h4>
                    <div className="flex gap-2 flex-wrap items-center">
                      {(() => {
                        // Filter out generic placeholder sources
                        const validSources = sources.filter(s =>
                          s.url &&
                          !s.url.includes('factcheck.org/person/') &&
                          !s.url.includes('politifact.com/personalities/') &&
                          !s.url.includes('wikipedia.org/wiki/Donald_Trump')
                        );

                        if (validSources.length > 0) {
                          return validSources.slice(0, 4).map((source, idx) => {
                            const logoFile = getDomainLogoFile(source.url);
                            const displayName = getPublisherDisplayName(source.publisher, source.url);
                            return (
                              <a
                                key={`${source.url}-${idx}`}
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-2 py-1.5 transition-all group"
                                title={source.title || displayName}
                              >
                                {logoFile ? (
                                  <img
                                    src={`/brand_logos/${logoFile}`}
                                    alt={displayName}
                                    className="w-5 h-5 object-contain rounded-sm"
                                    onError={(e) => {
                                      // Replace with ExternalLink icon on error
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      const parent = target.parentElement;
                                      if (parent && !parent.querySelector('.fallback-icon')) {
                                        const icon = document.createElement('span');
                                        icon.innerHTML = '🔗';
                                        icon.className = 'fallback-icon text-orange-400/60';
                                        parent.insertBefore(icon, target);
                                      }
                                    }}
                                  />
                                ) : (
                                  <ExternalLink className="w-4 h-4 text-orange-400/60 group-hover:text-orange-400" />
                                )}
                                <span className="text-xs text-foreground/70 group-hover:text-orange-400 transition-colors max-w-[100px] truncate">
                                  {displayName}
                                </span>
                              </a>
                            );
                          });
                        } else {
                          return <p className="text-xs text-foreground/50 italic">Sources pending verification</p>;
                        }
                      })()}
                    </div>
                  </div>

                  {/* 10-Point Voting System */}
                  <div className="flex-shrink-0">
                    <h4 className="text-sm font-arctic-left font-semibold text-orange-400 mb-2">
                      Rate This Entry ({voteCount} votes)
                    </h4>
                    <div className="grid grid-cols-10 gap-1">
                      {[...Array(10)].map((_, i) => {
                        const score = i + 1;
                        return (
                          <button
                            key={score}
                            onClick={() => handleVote(score)}
                            className={`aspect-square rounded ${userVote === score
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

                  {/* Social Sharing - NOW WITH WORKING BUTTONS */}
                  <div className="flex-shrink-0">
                    <h4 className="text-sm font-arctic-3d font-semibold text-orange-400 mb-2">Share</h4>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={handleTwitterShare}
                      >
                        <Twitter className="h-4 w-4 mr-1 text-orange-400" />
                        Twitter
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={handleFacebookShare}
                      >
                        <Facebook className="h-4 w-4 mr-1 text-orange-400" />
                        Facebook
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={handleEmailShare}
                      >
                        <Mail className="h-4 w-4 mr-1 text-orange-400" />
                        Email
                      </Button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="flex-shrink-0 mt-auto">
                    <h4 className="text-sm font-arctic-grad font-semibold text-orange-400 mb-2">Discussion</h4>
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
