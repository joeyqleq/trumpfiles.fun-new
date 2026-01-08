"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { AICompleteTrumpData } from "@/types/database";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Hash,
} from "lucide-react";

export default function EntryPage() {
  const params = useParams();
  const entryNumber = parseInt(params.entry_number as string);

  const [entry, setEntry] = useState<AICompleteTrumpData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [entryNumber]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/entry/${entryNumber}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch entry');
      }
      
      const data = await response.json();
      setEntry(data);
    } catch (err) {
      console.error("Error fetching entry:", err);
      setError("Failed to load entry");
    } finally {
      setLoading(false);
    }
  };

  const getThermalColor = (score: number) => {
    if (score <= 3) return "bg-green-500";
    if (score <= 6) return "bg-yellow-500";
    if (score <= 8) return "bg-gradient-to-r from-orange-500 to-red-500";
    return "bg-gradient-to-r from-red-500 to-red-600";
  };

  const ScoreDisplay = ({
    label,
    score,
  }: {
    label: string;
    score: number;
  }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-foreground/70">{label}</span>
        <span className="font-mono">{score}/10</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score * 10}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full ${getThermalColor(score)}`}
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/10 rounded w-1/3" />
          <div className="h-4 bg-white/10 rounded w-2/3" />
          <div className="h-64 bg-white/10 rounded" />
        </div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Entry not found</h1>
        <Button asChild>
          <Link href="/catalog">Back to Catalog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/catalog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Catalog
            </Link>
          </Button>

          <div className="flex items-start justify-between mb-4">
            <div>
              <Badge className="bg-orange-500/20 text-orange-500 border-orange-500/30 mb-2">
                Entry #{entry.entry_number} | Rank #{entry.fucked_up_rank}
              </Badge>
              <h1 className="text-4xl font-bold mb-2 font-heading bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                {entry.title}
              </h1>
              <div className="flex gap-4 text-sm text-foreground/70">
                {entry.date_start && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(entry.date_start).toLocaleDateString()}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Hash className="h-4 w-4" />
                  {entry.category}
                </span>
                <span className="font-mono text-orange-500">
                  Fucked-Up Score: {entry.fucked_up_score}/10
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Synopsis */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="font-heading bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent">Synopsis</CardTitle>
                {entry.subcategory && (
                  <CardDescription>Subcategory: {entry.subcategory}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  {entry.synopsis}
                </p>
                {entry.rationale_short && (
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <p className="text-sm text-orange-200/80 leading-relaxed">
                      <strong>Analysis:</strong> {entry.rationale_short}
                    </p>
                  </div>
                )}
                {entry.all_keywords && entry.all_keywords.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {entry.all_keywords.map((keyword, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="text-xs"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timeline Info */}
            {(entry.date_start || entry.phase) && (
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="font-heading bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent">Timeline & Context</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {entry.phase && (
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Phase:</span>
                      <span className="font-medium">{entry.phase}</span>
                    </div>
                  )}
                  {entry.age !== null && (
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Age at time:</span>
                      <span className="font-medium">{entry.age} years</span>
                    </div>
                  )}
                  {entry.start_year && (
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Year:</span>
                      <span className="font-medium">{entry.start_year}</span>
                    </div>
                  )}
                  {entry.duration_days && (
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Duration:</span>
                      <span className="font-medium">{entry.duration_days} days</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Scores */}
          <div className="space-y-8">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="font-heading bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent">AI Scoring Analysis</CardTitle>
                <CardDescription>
                  Algorithmic assessment across 8 dimensions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScoreDisplay label="Danger" score={entry.danger} />
                <ScoreDisplay label="Authoritarianism" score={entry.authoritarianism} />
                <ScoreDisplay label="Lawlessness" score={entry.lawlessness} />
                <ScoreDisplay label="Insanity" score={entry.insanity} />
                <ScoreDisplay label="Absurdity" score={entry.absurdity} />
                <ScoreDisplay label="Credibility Risk" score={entry.credibility_risk} />
                <ScoreDisplay label="Recency Intensity" score={entry.recency_intensity} />
                <ScoreDisplay label="Impact Scope" score={entry.impact_scope} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
