"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AICompleteTrumpData } from "@/types/database";
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
import { TrumpFilesBrand } from "@/components/TrumpFilesBrand";
import { MagicCard } from "@/components/ui/magic-card";
import GlitchText from "@/components/GlitchText";
import { FlippableEntryCard } from "@/components/FlippableEntryCard";

export default function CatalogPage() {
  const [entries, setEntries] = useState<AICompleteTrumpData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [phaseFilter, setPhaseFilter] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchEntries();
  }, []);

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

  const filteredEntries = useMemo(() => {
    const filtered = entries.filter((entry) => {
      const matchesSearch =
        searchTerm === "" ||
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.synopsis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entry.all_keywords &&
          entry.all_keywords.some((k) =>
            k.toLowerCase().includes(searchTerm.toLowerCase()),
          ));

      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(entry.category);
      const matchesPhase = phaseFilter === "all" || entry.phase === phaseFilter;

      return matchesSearch && matchesCategory && matchesPhase;
    });
    return filtered;
  }, [entries, searchTerm, selectedCategories, phaseFilter]);

  const paginatedEntries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredEntries.slice(startIndex, endIndex);
  }, [filteredEntries, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (increment: number) => {
    const newAmount = itemsPerPage + increment;
    if (newAmount >= 50) {
      setItemsPerPage(newAmount);
      setCurrentPage(1);
    }
  };

  const categories = useMemo(() => {
    const cats = new Set(entries.map((e) => e.category));
    return Array.from(cats).sort();
  }, [entries]);

  const phases = useMemo(() => {
    const phs = new Set(entries.map((e) => e.phase));
    return Array.from(phs).sort();
  }, [entries]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Insurrection': 'bg-linear-to-r from-orange-500/20 to-red-500/20 border-orange-500 text-orange-400 hover:from-orange-500/30 hover:to-red-500/30',
      'Corruption': 'bg-orange-500/20 border-orange-500 text-orange-400 hover:bg-orange-500/30',
      'Obstruction': 'bg-yellow-500/20 border-yellow-500 text-yellow-400 hover:bg-yellow-500/30',
      'Legal': 'bg-blue-500/20 border-blue-500 text-blue-400 hover:bg-blue-500/30',
      'Political': 'bg-purple-500/20 border-purple-500 text-purple-400 hover:bg-purple-500/30',
      'Foreign Policy': 'bg-green-500/20 border-green-500 text-green-400 hover:bg-green-500/30',
      'Ethics': 'bg-pink-500/20 border-pink-500 text-pink-400 hover:bg-pink-500/30',
      'Business': 'bg-cyan-500/20 border-cyan-500 text-cyan-400 hover:bg-cyan-500/30',
    };
    return colors[category] || 'bg-gray-500/20 border-gray-500 text-gray-400 hover:bg-gray-500/30';
  };

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
              className="h-[500px] w-[400px] bg-linear-to-br from-orange-500/20 to-orange-600/10 animate-pulse"
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
        >
          <TrumpFilesBrand size="3xl" className="mb-2" />
          <div className="flex justify-center mb-2">
            <GlitchText speed={1} enableShadows={true} enableOnHover={false} className="text-4xl lg:text-5xl bg-linear-to-r! from-orange-500! via-orange-400! to-red-500! bg-clip-text! text-transparent!">
              CATALOG
            </GlitchText>
          </div>
          <p className="text-foreground/70" data-oid="irkfd3r">
            Explore <span className="text-orange-400 font-semibold">{entries.length}</span> documented entries with comprehensive data
            and analysis{filteredEntries.length !== entries.length && (
              <span className="text-orange-400 ml-2">
                ({filteredEntries.length} filtered)
              </span>
            )}
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

          {/* Toggle Filters Button */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-linear-to-r from-orange-500/20 to-red-500/20 border-orange-500/30 text-orange-400 hover:from-orange-500/30 hover:to-red-500/30 font-heading"
            >
              {showFilters ? 'Hide Filters' : 'Show Category Filters'}
              {selectedCategories.length > 0 && (
                <Badge className="ml-2 bg-orange-500 text-white border-none">
                  {selectedCategories.length}
                </Badge>
              )}
            </Button>
            {selectedCategories.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategories([])}
                className="bg-linear-to-r from-orange-500/10 to-red-500/10 text-orange-400 hover:from-orange-500/20 hover:to-red-500/20 font-heading"
              >
                Clear Category Filters
              </Button>
            )}
          </div>

          {/* Category Filter Buttons - Collapsible */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant="outline"
                    size="sm"
                    onClick={() => toggleCategory(cat)}
                    className={`transition-all ${
                      selectedCategories.includes(cat)
                        ? getCategoryColor(cat)
                        : 'bg-white/5 border-white/20 text-foreground/70 hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Phase Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Filter by Phase</label>
            <Select
              value={phaseFilter}
              onValueChange={setPhaseFilter}
            >
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="Filter by phase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  All Phases
                </SelectItem>
                {phases.map((phase) => (
                  <SelectItem key={phase} value={phase}>
                    {phase}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-foreground/70">
              Showing {filteredEntries.length} of {entries.length} entries
              {selectedCategories.length > 0 && (
                <span className="ml-2 text-orange-400">({selectedCategories.length} categor{selectedCategories.length === 1 ? 'y' : 'ies'} selected)</span>
              )}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategories([]);
                setPhaseFilter("all");
              }}
              className="text-foreground/70"
            >
              Clear All Filters
            </Button>
          </div>
        </motion.div>

        {/* Pagination Controls Top */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2 items-center">
            <span className="text-sm text-foreground/70">Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredEntries.length)} of {filteredEntries.length}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleItemsPerPageChange(50)}
              className="text-xs"
            >
              +50 per page
            </Button>
            {itemsPerPage > 50 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleItemsPerPageChange(-50)}
                className="text-xs"
              >
                -50 per page
              </Button>
            )}
            <span className="text-xs text-foreground/60">({itemsPerPage}/page)</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-foreground/70 px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Multi-row Grid with FlippableEntryCard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedEntries.map((entry, index) => (
            <FlippableEntryCard key={entry.entry_number} entry={entry} index={index} />
          ))}
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
