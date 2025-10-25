"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { pool } from "@/lib/neon";
import { TrumpEntry } from "@/types/database";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Copy,
  Check,
  TrendingUp,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { TrumpFilesTitle } from "@/components/TrumpFilesBrand";
import { MagicCard } from "@/components/ui/magic-card";

export default function CatalogPage() {
  const [entries, setEntries] = useState<TrumpEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [phaseFilter, setPhaseFilter] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM ai_complete_trump_data ORDER BY fucked_up_rank ASC",
      );
      setEntries(rows || []);
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        searchTerm === "" ||
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.synopsis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entry.all_keywords &&
          entry.all_keywords.some((k) =>
            k.toLowerCase().includes(searchTerm.toLowerCase()),
          ));

      const matchesCategory =
        categoryFilter === "all" || entry.category === categoryFilter;
      const matchesPhase = phaseFilter === "all" || entry.phase === phaseFilter;

      return matchesSearch && matchesCategory && matchesPhase;
    });
  }, [entries, searchTerm, categoryFilter, phaseFilter]);

  const categories = useMemo(() => {
    const cats = new Set(entries.map((e) => e.category));
    return Array.from(cats).sort();
  }, [entries]);

  const phases = useMemo(() => {
    const phs = new Set(entries.map((e) => e.phase));
    return Array.from(phs).sort();
  }, [entries]);

  const copyLink = async (entryNumber: number) => {
    const url = `${window.location.origin}/entry/${entryNumber}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(entryNumber.toString());
    setTimeout(() => setCopiedId(null), 2000);
  };

  const scroll = (scrollOffset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollOffset, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8" data-oid="vrnc-v9">
        <div className="flex space-x-6" data-oid="eg9rb:j">
          {[...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-[500px] w-[400px]"
              data-oid="1.l:-qv"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen golden-p-5" data-oid="7g_b70t">
      <div className="container mx-auto px-4" data-oid="ewd5bw6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
          data-oid="rv2dy6."
        >
          <TrumpFilesTitle className="text-4xl mb-2" data-oid="ydsew5g" />
          <h2 className="text-2xl font-heading mb-2" data-oid="ks2s89z">
            Catalog
          </h2>
          <p className="text-foreground/70" data-oid="irkfd3r">
            Explore {entries.length} documented entries with comprehensive data
            and analysis
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card border-white/10 p-6 mb-8 space-y-4"
          data-oid="noy-k0g"
        >
          <div className="relative" data-oid="_uivfn0">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50"
              data-oid="37yrd:a"
            />
            <Input
              placeholder="Search entries by title, synopsis, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10"
              data-oid="b2114pn"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4" data-oid="xr8t1ln">
            <Select
              value={categoryFilter}
              onValueChange={setCategoryFilter}
              data-oid="aj_purc"
            >
              <SelectTrigger
                className="bg-white/5 border-white/10"
                data-oid="gpndze-"
              >
                <SelectValue
                  placeholder="Filter by category"
                  data-oid="-q917pj"
                />
              </SelectTrigger>
              <SelectContent data-oid="y7cws-h">
                <SelectItem value="all" data-oid="nk6rmog">
                  All Categories
                </SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat} data-oid="ah28pv.">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={phaseFilter}
              onValueChange={setPhaseFilter}
              data-oid="s3ptcce"
            >
              <SelectTrigger
                className="bg-white/5 border-white/10"
                data-oid="mhftm3i"
              >
                <SelectValue placeholder="Filter by phase" data-oid="494o:q:" />
              </SelectTrigger>
              <SelectContent data-oid="aa:wotu">
                <SelectItem value="all" data-oid="d6wt3dn">
                  All Phases
                </SelectItem>
                {phases.map((phase) => (
                  <SelectItem key={phase} value={phase} data-oid="enofxp0">
                    {phase}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between" data-oid="3zssuo8">
            <p className="text-sm text-foreground/70" data-oid="2hg_vlf">
              Showing {filteredEntries.length} of {entries.length} entries
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
                setPhaseFilter("all");
              }}
              data-oid="07yczw9"
            >
              Clear Filters
            </Button>
          </div>
        </motion.div>

        {/* Horizontal Scroll Section */}
        <div className="relative" data-oid="penrt1q">
          <div
            ref={scrollRef}
            className="flex space-x-6 overflow-x-auto pb-8 scrollbar-hide"
            data-oid="02tpt_q"
          >
            {filteredEntries.map((entry, index) => (
              <motion.div
                key={entry.entry_number}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="w-[400px] flex-shrink-0"
                data-oid="a2enc1r"
              >
                <MagicCard className="h-full" data-oid="ak9vz6n">
                  <CardContent className="p-6" data-oid="kxule9l">
                    <div
                      className="flex justify-between items-start"
                      data-oid="uv0oph:"
                    >
                      <Badge
                        variant="outline"
                        className="border-primary/50 text-primary"
                        data-oid="k7jbgmh"
                      >
                        Rank: {entry.fucked_up_rank}
                      </Badge>
                      <Badge variant="secondary" data-oid="mvtrcmb">
                        {entry.phase}
                      </Badge>
                    </div>
                    <CardTitle
                      className="mt-4 text-xl line-clamp-2 font-heading"
                      data-oid="i4is9jq"
                    >
                      {entry.title}
                    </CardTitle>
                    <p
                      className="text-sm text-foreground/70 mt-2 line-clamp-3"
                      data-oid="vmxgm:r"
                    >
                      {entry.synopsis}
                    </p>
                    <div className="mt-4 space-y-2" data-oid="8npdm7c">
                      <div
                        className="flex items-center justify-between text-sm"
                        data-oid="gc841j-"
                      >
                        <span className="font-bold" data-oid="0lijk14">
                          Fucked-up Score:
                        </span>
                        <span
                          className="font-mono text-primary font-bold text-lg"
                          data-oid="jj-ovo8"
                        >
                          {entry.fucked_up_score}
                        </span>
                      </div>
                      <div
                        className="flex items-center justify-between text-xs"
                        data-oid="vvofc.6"
                      >
                        <span data-oid="an6ox9t">Danger:</span>
                        <span data-oid="aobdkxr">{entry.danger}</span>
                      </div>
                      <div
                        className="flex items-center justify-between text-xs"
                        data-oid="cwl9n-."
                      >
                        <span data-oid=".bwokpk">Insanity:</span>
                        <span data-oid="xheua_q">{entry.insanity}</span>
                      </div>
                      <div
                        className="flex items-center justify-between text-xs"
                        data-oid="cqz_kek"
                      >
                        <span data-oid="u96nn7_">Absurdity:</span>
                        <span data-oid="2gwtxf.">{entry.absurdity}</span>
                      </div>
                    </div>
                  </CardContent>
                </MagicCard>
              </motion.div>
            ))}
          </div>
          <div
            className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full"
            data-oid="huk807n"
          >
            <Button
              onClick={() => scroll(-400)}
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12 -ml-6"
              data-oid="qlwm3g2"
            >
              <ArrowLeft data-oid="ctak66:" />
            </Button>
            <Button
              onClick={() => scroll(400)}
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12 -mr-6"
              data-oid="bdvhklq"
            >
              <ArrowRight data-oid="_7isqtb" />
            </Button>
          </div>
        </div>

        {filteredEntries.length === 0 && (
          <div className="text-center py-12" data-oid="fbjp:24">
            <p className="text-xl text-foreground/50" data-oid="-f2mpwv">
              No entries found matching your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
