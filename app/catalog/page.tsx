'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { TrumpEntry } from '@/types/database'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Copy, Check, TrendingUp, AlertTriangle } from 'lucide-react'

export default function CatalogPage() {
  const [entries, setEntries] = useState<TrumpEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [phaseFilter, setPhaseFilter] = useState('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('trump_entries')
        .select('*')
        .order('entry_number', { ascending: true })

      if (error) throw error
      setEntries(data || [])
    } catch (error) {
      console.error('Error fetching entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch = searchTerm === '' || 
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.synopsis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = categoryFilter === 'all' || entry.category === categoryFilter
      const matchesPhase = phaseFilter === 'all' || entry.phase === phaseFilter
      
      return matchesSearch && matchesCategory && matchesPhase
    })
  }, [entries, searchTerm, categoryFilter, phaseFilter])

  const categories = useMemo(() => {
    const cats = new Set(entries.map(e => e.category))
    return Array.from(cats).sort()
  }, [entries])

  const phases = useMemo(() => {
    const phs = new Set(entries.map(e => e.phase))
    return Array.from(phs).sort()
  }, [entries])

  const copyLink = async (entryNumber: number) => {
    const url = `${window.location.origin}/entry/${entryNumber}`
    await navigator.clipboard.writeText(url)
    setCopiedId(entryNumber.toString())
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getThermalColor = (score: number) => {
    if (score <= 3) return 'bg-green-500'
    if (score <= 6) return 'bg-yellow-500'
    if (score <= 8) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const ThermalBar = ({ label, score }: { label: string; score: number }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-foreground/70">{label}</span>
        <span className="font-mono">{score}/10</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${getThermalColor(score)}`}
          style={{ width: `${score * 10}%` }}
        />
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen golden-p-5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Trump Files Catalog</h1>
          <p className="text-foreground/70">
            Explore {entries.length} documented entries with comprehensive data and analysis
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card border-white/10 p-6 mb-8 space-y-4"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
            <Input
              placeholder="Search entries by title, synopsis, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10"
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={phaseFilter} onValueChange={setPhaseFilter}>
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="Filter by phase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Phases</SelectItem>
                {phases.map(phase => (
                  <SelectItem key={phase} value={phase}>{phase}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-foreground/70">
              Showing {filteredEntries.length} of {entries.length} entries
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('')
                setCategoryFilter('all')
                setPhaseFilter('all')
              }}
            >
              Clear Filters
            </Button>
          </div>
        </motion.div>

        {/* Entry Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.map((entry, index) => (
       <motion.div
            key={entry.id ?? `entry-${entry.entry_number}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="glass-card border-white/10 h-full hover:border-primary/30 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="border-primary/50 text-primary">
                      #{entry.entry_number}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyLink(entry.entry_number)}
                      className="h-8 w-8 p-0"
                    >
                      {copiedId === entry.entry_number.toString() ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{entry.title}</CardTitle>
                  <CardDescription>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {entry.category}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {entry.phase}
                      </Badge>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="summary" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-white/5">
                      <TabsTrigger value="summary">Summary</TabsTrigger>
                      <TabsTrigger value="data">Data</TabsTrigger>
                      <TabsTrigger value="debunk">Debunk</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="summary" className="mt-4 space-y-3">
                      <p className="text-sm text-foreground/80 line-clamp-4">
                        {entry.synopsis}
                      </p>
                      {entry.financial_cost && (
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="h-4 w-4 text-orange-500" />
                          <span>Cost: ${entry.financial_cost.toLocaleString()}</span>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="data" className="mt-4 space-y-3">
                      <ThermalBar label="Danger" score={entry.danger_score} />
                      <ThermalBar label="Lawlessness" score={entry.lawlessness_score} />
                      <ThermalBar label="Insanity" score={entry.insanity_score} />
                      <ThermalBar label="Absurdity" score={entry.absurdity_score} />
                      <ThermalBar label="Social Media" score={entry.social_media_score} />
                      <ThermalBar label="Media Attention" score={entry.media_attention_score} />
                    </TabsContent>
                    
                    <TabsContent value="debunk" className="mt-4">
                      {entry.fact_check ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">Fact Check</span>
                          </div>
                          <p className="text-sm text-foreground/80 line-clamp-6">
                            {entry.fact_check}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-foreground/50">No fact-check data available</p>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-foreground/50">No entries found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}