"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AICompleteTrumpData } from "@/types/database";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Search,
  ArrowLeft,
  ArrowRight,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  Filter,
  Flame,
  Zap,
  Gavel,
  Brain
} from "lucide-react";
import { FlippableEntryCard } from "@/components/FlippableEntryCard";
import TrueFocus from "@/components/TrueFocus";
import PageDecorations from "@/components/PageDecorations";
import GlitchText from "@/components/GlitchText";
import { useEntryCount } from "@/hooks/useEntryCount";
import Image from "next/image";

type SortOption =
  | "entry_asc"
  | "entry_desc"
  | "score_desc"
  | "score_asc"
  | "date_desc"
  | "date_asc"
  | "danger_desc"
  | "lawlessness_desc"
  | "insanity_desc"
  | "absurdity_desc"
  | "title_asc"
  | "title_desc";



export default function CatalogPage() {
  const [entries, setEntries] = useState<AICompleteTrumpData[]>([]);
  const [loading, setLoading] = useState(true);
  const { count: maxEntry } = useEntryCount();

  const sortOptions = useMemo(() => [
    { value: "entry_desc", label: `Entry # (Newest to Oldest)` },
    { value: "entry_asc", label: `Entry # (Oldest to Newest)` },
    { value: "score_desc", label: "Total Score (High → Low)" },
    { value: "score_asc", label: "Total Score (Low → High)" },
    { value: "danger_desc", label: "Danger Level (Highest)" },
    { value: "lawlessness_desc", label: "Lawlessness (Highest)" },
    { value: "insanity_desc", label: "Insanity (Highest)" },
    { value: "absurdity_desc", label: "Absurdity (Highest)" },
    { value: "date_desc", label: "Most Recent First" },
    { value: "date_asc", label: "Oldest First" },
    { value: "title_asc", label: "Title (A → Z)" },
    { value: "title_desc", label: "Title (Z → A)" },
  ], [maxEntry]);

  // Basic Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [phaseFilter, setPhaseFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("entry_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  // Advanced Filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [minDanger, setMinDanger] = useState([0]);
  const [localMinDanger, setLocalMinDanger] = useState([0]);
  const [minAbsurdity, setMinAbsurdity] = useState([0]);
  const [localMinAbsurdity, setLocalMinAbsurdity] = useState([0]);
  const [minLawlessness, setMinLawlessness] = useState([0]);
  const [localMinLawlessness, setLocalMinLawlessness] = useState([0]);
  const [minTotalScore, setMinTotalScore] = useState([0]);
  const [localMinTotalScore, setLocalMinTotalScore] = useState([0]);

  // Scroll to top ref
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, phaseFilter, minDanger, minAbsurdity, minLawlessness, minTotalScore]);

  const fetchEntries = async () => {
    try {
      const res = await fetch('/api/catalog-data');
      const data = await res.json();
      setEntries(data || []);
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories and phases
  const categories = useMemo(() => {
    const cats = new Set(entries.map((e) => e.category));
    return Array.from(cats).sort();
  }, [entries]);

  const phases = useMemo(() => {
    const phs = new Set(entries.map((e) => e.phase));
    return Array.from(phs).sort();
  }, [entries]);

  // Filter and sort entries
  const filteredAndSortedEntries = useMemo(() => {
    // First filter
    const filtered = entries.filter((entry) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.synopsis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entry.all_keywords &&
          entry.all_keywords.some((k) =>
            k && k.toLowerCase().includes(searchTerm.toLowerCase()),
          ));

      // Category filter
      const matchesCategory = selectedCategory === "all" || entry.category === selectedCategory;

      // Phase filter
      const matchesPhase = phaseFilter === "all" || entry.phase === phaseFilter;

      // Advanced Numeric Filters
      const matchesDanger = (entry.danger || 0) >= minDanger[0];
      const matchesAbsurdity = (entry.absurdity || 0) >= minAbsurdity[0];
      const matchesLawlessness = (entry.lawlessness || 0) >= minLawlessness[0];
      const matchesTotalScore = parseFloat(entry.fucked_up_score || "0") >= minTotalScore[0];

      return matchesSearch && matchesCategory && matchesPhase && matchesDanger && matchesAbsurdity && matchesLawlessness && matchesTotalScore;
    });

    // Then sort
    filtered.sort((a, b) => {
      // Helper for date sorting
      const getDate = (d?: string) => d ? new Date(d).getTime() : 0;

      switch (sortBy) {
        case "entry_asc":
          return (a.entry_number || 0) - (b.entry_number || 0);
        case "entry_desc":
          return (b.entry_number || 0) - (a.entry_number || 0);
        case "score_desc":
          return parseFloat(b.fucked_up_score) - parseFloat(a.fucked_up_score);
        case "score_asc":
          return parseFloat(a.fucked_up_score) - parseFloat(b.fucked_up_score);
        case "danger_desc":
          return (b.danger || 0) - (a.danger || 0);
        case "lawlessness_desc":
          return (b.lawlessness || 0) - (a.lawlessness || 0);
        case "insanity_desc":
          return (b.insanity || 0) - (a.insanity || 0);
        case "absurdity_desc":
          return (b.absurdity || 0) - (a.absurdity || 0);
        case "date_desc":
          return getDate(b.date_start || undefined) - getDate(a.date_start || undefined);
        case "date_asc":
          return getDate(a.date_start || undefined) - getDate(b.date_start || undefined);
        case "title_asc":
          return a.title.localeCompare(b.title);
        case "title_desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [entries, searchTerm, selectedCategory, phaseFilter, sortBy, minDanger, minAbsurdity, minLawlessness, minTotalScore]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedEntries.length / itemsPerPage);
  const paginatedEntries = filteredAndSortedEntries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setPhaseFilter("all");
    setSortBy("entry_desc");
    setMinDanger([0]);
    setLocalMinDanger([0]);
    setMinAbsurdity([0]);
    setLocalMinAbsurdity([0]);
    setMinLawlessness([0]);
    setLocalMinLawlessness([0]);
    setMinTotalScore([0]);
    setLocalMinTotalScore([0]);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen py-8 md:py-16 relative" ref={topRef}>
      <PageDecorations variant="catalog" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          {/* Use CSS class to apply font and animation - simple and robust */}
          <div className="flex justify-center mb-6">
            <div className="font-arctic-twotone-italic">
              <TrueFocus
                sentence="THE TRUMP FILES"
                manualMode={false}
                blurAmount={5}
                borderColor="#FF6500"
                glowColor="rgba(255, 101, 0, 0.6)"
                animationDuration={0.8}
                pauseBetweenAnimations={2}
              />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 bg-clip-text text-transparent font-arctic-3d leading-tight mt-4">
            CATALOG
          </h1>

          <p className="text-xl text-foreground/70 max-w-2xl mx-auto mt-6 font-sans">
            A comprehensive, searchable database of {entries.length > 0 ? entries.length : maxEntry} documented incidents.
            Filter, sort, and explore the evidence.
          </p>
        </motion.div>

        {/* Satirical float */}
        <div className="flex justify-end mb-4 -mt-2 pr-4 md:pr-0">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative group"
          >
            <Image src="/images/art/pdf_pepperoni.png" alt="Pepperoni Trump" width={130} height={160} className="rounded-xl border border-orange-500/20 shadow-lg shadow-orange-500/10 group-hover:shadow-orange-500/30 transition-all duration-500 group-hover:scale-105 group-hover:rotate-2" />
          </motion.div>
        </div>

        {/* Filters Section */}
        <div className="glass-card p-6 md:p-8 mb-12 rounded-2xl border border-orange-500/30 shadow-[0_0_30px_rgba(255,101,0,0.15)] backdrop-blur-2xl bg-black/60 relative overflow-hidden transition-all duration-300">
          <div className="flex flex-col gap-6 relative z-10">
            <div className="mb-2">
              <GlitchText speed={1.5} enableShadows={true} className="text-xl md:text-2xl font-bold tracking-wider text-orange-400 inline-block">
                ARCHIVE SEARCH & FILTERS
              </GlitchText>
            </div>
            {/* Top Row: Search & Basic Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
                <Input
                  placeholder="Search entries, keywords, descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 bg-black/30 border-orange-500/20 focus:border-orange-500 focus:ring-orange-500/20"
                />
              </div>

              <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px] h-10 bg-black/30 border-orange-500/20">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={phaseFilter} onValueChange={setPhaseFilter}>
                  <SelectTrigger className="w-[180px] h-10 bg-black/30 border-orange-500/20">
                    <SelectValue placeholder="Phase" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Phases</SelectItem>
                    {phases.map((phase) => (
                      <SelectItem key={phase} value={phase}>
                        {phase}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                  <SelectTrigger className="w-[200px] h-10 bg-black/30 border-orange-500/20">
                    <ArrowUpDown className="w-4 h-4 mr-2 text-orange-400" />
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`h-10 px-4 border-orange-500/20 hover:bg-orange-500/10 ${showAdvancedFilters ? 'bg-orange-500/10 border-orange-500' : ''}`}
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Collapsible Advanced Filters Panel */}
            <AnimatePresence>
              {showAdvancedFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Danger Slider */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label className="text-white flex items-center gap-2">
                          <Flame className="w-4 h-4 text-red-500" />
                          Min Danger
                        </Label>
                        <span className="text-sm font-mono text-orange-400">{localMinDanger[0]}/10</span>
                      </div>
                      <Slider
                        value={localMinDanger}
                        onValueChange={setLocalMinDanger}
                        onValueCommit={setMinDanger}
                        min={0}
                        max={10}
                        step={1}
                        className="py-2"
                      />
                    </div>

                    {/* Absurdity Slider */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label className="text-white flex items-center gap-2">
                          <Brain className="w-4 h-4 text-yellow-500" />
                          Min Absurdity
                        </Label>
                        <span className="text-sm font-mono text-orange-400">{localMinAbsurdity[0]}/10</span>
                      </div>
                      <Slider
                        value={localMinAbsurdity}
                        onValueChange={setLocalMinAbsurdity}
                        onValueCommit={setMinAbsurdity}
                        min={0}
                        max={10}
                        step={1}
                        className="py-2"
                      />
                    </div>

                    {/* Lawlessness Slider */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label className="text-white flex items-center gap-2">
                          <Gavel className="w-4 h-4 text-orange-500" />
                          Min Lawlessness
                        </Label>
                        <span className="text-sm font-mono text-orange-400">{localMinLawlessness[0]}/10</span>
                      </div>
                      <Slider
                        value={localMinLawlessness}
                        onValueChange={setLocalMinLawlessness}
                        onValueCommit={setMinLawlessness}
                        min={0}
                        max={10}
                        step={1}
                        className="py-2"
                      />
                    </div>

                    {/* Total Score Slider */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label className="text-white flex items-center gap-2">
                          <Zap className="w-4 h-4 text-purple-500" />
                          Min Total Score
                        </Label>
                        <span className="text-sm font-mono text-orange-400">{localMinTotalScore[0]}/100</span>
                      </div>
                      <Slider
                        value={localMinTotalScore}
                        onValueChange={setLocalMinTotalScore}
                        onValueCommit={setMinTotalScore}
                        min={0}
                        max={100}
                        step={5}
                        className="py-2"
                      />
                    </div>

                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      variant="ghost"
                      onClick={resetFilters}
                      className="text-sm text-foreground/50 hover:text-white"
                    >
                      Reset All Filters
                      <X className="w-3 h-3 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results Count & Tags */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-orange-500/10 border-orange-500/30 text-orange-400">
                  {filteredAndSortedEntries.length} entries found
                </Badge>
                {(searchTerm || selectedCategory !== "all" || phaseFilter !== "all" || minDanger[0] > 0) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="h-6 text-xs text-foreground/50 hover:text-white px-2"
                  >
                    Clear Filters <X className="w-3 h-3 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Entries Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-[400px] w-full rounded-xl bg-orange-900/10" />
              </div>
            ))}
          </div>
        ) : filteredAndSortedEntries.length > 0 ? (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
              layout
            >
              <AnimatePresence mode="popLayout">
                {paginatedEntries.map((entry) => (
                  <motion.div
                    key={entry.entry_number}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FlippableEntryCard entry={entry} index={entry.entry_number} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="border-orange-500/20 hover:bg-orange-500/20"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>

                <span className="mx-4 text-sm font-mono">
                  Page <span className="text-orange-400">{currentPage}</span> of {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="border-orange-500/20 hover:bg-orange-500/20"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24 glass-card border-orange-500/10 rounded-xl">
            <div className="inline-block p-4 rounded-full bg-orange-500/10 mb-4">
              <Search className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No entries found</h3>
            <p className="text-foreground/60 mb-6">
              Try adjusting your filters or search term to find what you're looking for.
            </p>
            <Button onClick={resetFilters} variant="default" className="bg-orange-500 hover:bg-orange-600">
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Catalog footer art */}
        <div className="mt-16 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <Image src="/images/art/pdf_mushroom.png" alt="Mushroom Trump Art" width={200} height={200} className="rounded-xl border border-orange-500/20 shadow-[0_0_24px_rgba(255,101,0,0.12)] group-hover:shadow-orange-500/30 transition-all duration-500 group-hover:scale-105" />
          </motion.div>
        </div>
      </div>
    </div >
  );
}
