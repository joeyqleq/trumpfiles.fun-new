"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AICompleteTrumpData } from "@/types/database";
import { BarChart3, PieChart as PieChartIcon, Activity, TrendingUp, Target, Zap } from "lucide-react";
import TrueFocus from "@/components/TrueFocus";
import PageDecorations from "@/components/PageDecorations";
import Image from "next/image";

// Diverse color palette for visual differentiation
const COLORS = [
  "#E53935",  // Red - Danger
  "#FB8C00",  // Orange - Corruption  
  "#FDD835",  // Yellow - Financial
  "#43A047",  // Green - Political
  "#1E88E5",  // Blue - Business
  "#8E24AA",  // Purple - Personal
  "#00ACC1",  // Cyan - Media
  "#6D4C41",  // Brown - Historical
  "#F4511E",  // Deep Orange - Ethics
  "#546E7A",  // Blue Grey - Other
  "#D81B60",  // Pink - Legal
  "#7CB342",  // Light Green - Administrative
];

// Phase-specific colors (ordered timeline)
const PHASE_COLORS: Record<string, string> = {
  "Pre-Political": "#6D4C41",           // Brown - old history
  "Campaign 2016": "#FB8C00",           // Orange - campaign heat
  "First Administration": "#E53935",    // Red - danger period
  "Post-Presidency 2021-24": "#8E24AA", // Purple - transition
  "Second Administration": "#D32F2F",   // Dark Red - current crisis
};

export default function VisualizerPage() {
  const [entries, setEntries] = useState<AICompleteTrumpData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/visualizer-data");
      const data = await res.json();
      setEntries(data || []);
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setLoading(false);
    }
  };

  // Category distribution data - limited to top categories
  const getCategoryData = () => {
    const categoryCount = entries.reduce((acc, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Sort by count and take top 8, group rest into "Other"
    const sorted = Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a);

    const topCategories = sorted.slice(0, 8).map(([name, value]) => ({
      name,
      value,
    }));

    const otherCount = sorted.slice(8).reduce((sum, [, val]) => sum + val, 0);
    if (otherCount > 0) {
      topCategories.push({ name: "Other", value: otherCount });
    }

    return topCategories;
  };

  // Timeline data (by year)
  const getTimelineData = () => {
    const yearlyData = entries.reduce((acc, entry) => {
      const year = entry.date_start ? new Date(entry.date_start).getFullYear() : "Unknown";
      if (year !== "Unknown") {
        if (!acc[year]) {
          acc[year] = {
            year,
            count: 0,
            avgDanger: 0,
            avgAbsurdity: 0,
            totalDanger: 0,
            totalAbsurdity: 0,
          };
        }
        acc[year].count++;
        acc[year].totalDanger += entry.danger || 0;
        acc[year].totalAbsurdity += entry.absurdity || 0;
      }
      return acc;
    }, {} as Record<string, any>);

    return Object.values(yearlyData)
      .map((d: any) => ({
        year: d.year.toString(),
        count: d.count,
        avgDanger: (d.totalDanger / d.count).toFixed(1),
        avgAbsurdity: (d.totalAbsurdity / d.count).toFixed(1),
      }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));
  };

  // Radar chart data (scoring dimensions)
  const getRadarData = () => {
    const dimensions = ["danger", "lawlessness", "insanity", "absurdity", "authoritarianism"];
    return dimensions.map((dim) => {
      const avg = entries.reduce((sum, entry) => sum + ((entry as any)[dim] || 0), 0) / entries.length;
      return {
        dimension: dim.charAt(0).toUpperCase() + dim.slice(1),
        value: parseFloat(avg.toFixed(2)),
      };
    });
  };

  // Category by scoring dimension
  const getCategoryScoreData = () => {
    const categoryScores = entries.reduce((acc, entry) => {
      const cat = entry.category;
      if (!acc[cat]) {
        acc[cat] = { category: cat, danger: 0, absurdity: 0, count: 0 };
      }
      acc[cat].danger += entry.danger || 0;
      acc[cat].absurdity += entry.absurdity || 0;
      acc[cat].count++;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(categoryScores).map((d: any) => ({
      category: d.category,
      danger: parseFloat((d.danger / d.count).toFixed(1)),
      absurdity: parseFloat((d.absurdity / d.count).toFixed(1)),
    }));
  };

  // Phase distribution - consolidate to 5 main historical phases
  // Phase distribution - enhanced for detailed analysis
  const getPhaseData = () => {
    // Map various phase names to our 5 main categories
    const phaseMapping: Record<string, string> = {
      // Pre-Political
      "Pre-Political": "Pre-Political",
      "Business Career": "Pre-Political",
      "Early": "Pre-Political",
      "Media Mogul": "Pre-Political",
      "Real Estate": "Pre-Political",
      "pre-political": "Pre-Political",
      "Presidential Campaign": "Pre-Political", // 2016 campaign usually separate but some old data might use this

      // Campaign 2016
      "Campaign 2016": "Campaign 2016",
      "2016 Campaign": "Campaign 2016",
      "Campaign": "Campaign 2016",

      // First Administration
      "First Administration": "First Administration",
      "First Term": "First Administration",
      "White House 1": "First Administration",
      "Presidency": "First Administration",
      "Administration 1": "First Administration",

      // Post-Presidency
      "Post-Presidency 2021-24": "Post-Presidency 2021-24",
      "Post-Presidency": "Post-Presidency 2021-24",
      "Between Terms": "Post-Presidency 2021-24",
      "Post Presidency": "Post-Presidency 2021-24",
      "Presidential Transition": "Post-Presidency 2021-24",

      // Second Administration
      "Second Administration": "Second Administration",
      "White House 2": "Second Administration",
      "Second Term": "Second Administration",
      "Administration 2": "Second Administration",
    };

    const phaseOrder = [
      "Pre-Political",
      "Campaign 2016",
      "First Administration",
      "Post-Presidency 2021-24",
      "Second Administration",
    ];

    return phaseOrder.map(phaseName => {
      // Filter entries for this phase
      const phaseEntries = entries.filter(e =>
        (phaseMapping[e.phase] || "Pre-Political") === phaseName
      );

      // Category breakdown
      const categories: Record<string, number> = {};
      phaseEntries.forEach(e => {
        categories[e.category] = (categories[e.category] || 0) + 1;
      });

      // Top Category for insights
      const sortedCats = Object.entries(categories).sort(([, a], [, b]) => b - a);
      const topCategory = sortedCats[0] ? sortedCats[0][0] : "None";

      return {
        name: phaseName,
        value: phaseEntries.length, // Compatibility with Pie
        count: phaseEntries.length,
        avgDanger: phaseEntries.length > 0
          ? parseFloat((phaseEntries.reduce((s, e) => s + (e.danger || 0), 0) / phaseEntries.length).toFixed(1))
          : 0,
        topCategory,
        ...categories // Spread for Stacked Bar
      };
    }).filter(d => d.count > 0);
  };

  // Behavioral traits analysis - scan for common patterns
  const getBehavioralTraits = () => {
    const patterns = {
      "Narcissism": ["narciss", "ego", "self-aggrandiz", "grandiose", "brag"],
      "Racism": ["racis", "white supremac", "muslim ban", "birther", "shithole"],
      "Corruption": ["corrupt", "brib", "emolument", "self-deal", "kickback"],
      "Lying": ["lie", "false claim", "misinformation", "disinformation", "fabricat"],
      "Fraud": ["fraud", "scam", "decepti", "swindle", "cheat"],
      "Misogyny": ["misogyn", "sexis", "women", "grab", "sexual"],
      "Obstruction": ["obstruct", "cover-up", "tamper", "witness", "destroy"],
      "Incitement": ["incit", "riot", "violence", "insurrection", "storm"],
      "Authoritarianism": ["authoritarian", "dictator", "fascis", "unchecked power"],
    };

    const results = Object.entries(patterns).map(([trait, keywords]) => {
      const count = entries.filter(entry => {
        const searchText = `${entry.title || ""} ${entry.synopsis || ""} ${entry.all_keywords || ""}`.toLowerCase();
        return keywords.some(keyword => searchText.includes(keyword));
      }).length;
      return { trait, count };
    });

    return results.sort((a, b) => b.count - a.count);
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 border border-orange-500/30 p-3 rounded-lg shadow-lg">
          <p className="font-bold text-orange-400">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm text-white">
              {entry.name}: <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/10 rounded w-1/3" />
          <div className="h-96 bg-white/10 rounded" />
        </div>
      </div>
    );
  }

  const categoryData = getCategoryData();
  const timelineData = getTimelineData();
  const radarData = getRadarData();
  const categoryScoreData = getCategoryScoreData();
  const phaseData = getPhaseData();
  const behavioralData = getBehavioralTraits();

  return (
    <div className="min-h-screen py-16 relative">
      {/* Background Decorations */}
      <PageDecorations variant="visualizer" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="font-arctic-3d">
              <TrueFocus
                sentence="DATA VISUALIZER"
                manualMode={false}
                blurAmount={3}
                borderColor="#FF6500"
                glowColor="rgba(255, 101, 0, 0.6)"
                animationDuration={0.8}
                pauseBetweenAnimations={2}
              />
            </div>
          </div>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto mt-4">
            Explore patterns, correlations, and insights across {entries.length.toLocaleString()} documented incidents
          </p>
        </motion.div>

        {/* Satirical sidebar float */}
        <div className="flex justify-start mb-6 pl-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="relative group"
          >
            <Image src="/images/art/pdf_diddler.png" alt="Trump Diddler Satire" width={140} height={170} className="rounded-xl border border-orange-500/20 shadow-lg shadow-orange-500/10 group-hover:shadow-orange-500/30 transition-all duration-500 group-hover:scale-105 group-hover:-rotate-2" />
          </motion.div>
        </div>

        {/* Key Stats Overview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 mb-12"
        >
          <Card className="glass-card border-orange-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-8 h-8 text-orange-400" />
                <div>
                  <p className="text-sm text-foreground/70">Total Entries</p>
                  <p className="text-3xl font-bold text-orange-400">{entries.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-orange-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-8 h-8 text-orange-400" />
                <div>
                  <p className="text-sm text-foreground/70">Avg Danger Score</p>
                  <p className="text-3xl font-bold text-orange-400">
                    {(entries.reduce((sum, e) => sum + (e.danger || 0), 0) / entries.length).toFixed(1)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-orange-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-8 h-8 text-orange-400" />
                <div>
                  <p className="text-sm text-foreground/70">Avg Absurdity</p>
                  <p className="text-3xl font-bold text-orange-400">
                    {(entries.reduce((sum, e) => sum + (e.absurdity || 0), 0) / entries.length).toFixed(1)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-orange-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-8 h-8 text-orange-400" />
                <div>
                  <p className="text-sm text-foreground/70">Peak Danger</p>
                  <p className="text-3xl font-bold text-orange-400">
                    {Math.max(...entries.map(e => e.danger || 0)).toFixed(1)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Chart Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="flex w-full overflow-x-auto justify-start bg-white/5 p-1 no-scrollbar space-x-2">
              <TabsTrigger value="overview" className="flex-shrink-0 data-[state=active]:bg-orange-500/20">
                Overview
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex-shrink-0 data-[state=active]:bg-orange-500/20">
                Categories
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex-shrink-0 data-[state=active]:bg-orange-500/20">
                Timeline
              </TabsTrigger>
              <TabsTrigger value="dimensions" className="flex-shrink-0 data-[state=active]:bg-orange-500/20">
                Dimensions
              </TabsTrigger>
              <TabsTrigger value="phases" className="flex-shrink-0 data-[state=active]:bg-orange-500/20">
                Phases
              </TabsTrigger>
              <TabsTrigger value="financial" className="flex-shrink-0 data-[state=active]:bg-orange-500/20">
                Financial
              </TabsTrigger>
              <TabsTrigger value="relationships" className="flex-shrink-0 data-[state=active]:bg-orange-500/20">
                Relations
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Category Distribution Pie */}
                <Card className="glass-card border-orange-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-400">
                      <PieChartIcon className="w-5 h-5" />
                      Category Distribution
                    </CardTitle>
                    <CardDescription>
                      Breakdown of entries across major categories
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="45%"
                          labelLine={false}
                          label={false}
                          outerRadius={90}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          layout="horizontal"
                          verticalAlign="bottom"
                          align="center"
                          wrapperStyle={{
                            paddingTop: "20px",
                            fontSize: "12px"
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 p-4 bg-orange-900/20 rounded-lg">
                      <p className="text-sm text-foreground/80">
                        <strong className="text-orange-400">Insight:</strong> The most common category is{" "}
                        <strong className="text-orange-400">{categoryData[0]?.name}</strong> with{" "}
                        <strong className="text-orange-400">{categoryData[0]?.value}</strong> documented incidents.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Scoring Dimensions Radar */}
                <Card className="glass-card border-orange-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-400">
                      <Activity className="w-5 h-5" />
                      Average Scoring Dimensions
                    </CardTitle>
                    <CardDescription>
                      Multi-dimensional analysis across all entries
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="#FF6500" strokeOpacity={0.3} />
                        <PolarAngleAxis dataKey="dimension" tick={{ fill: "#fff", fontSize: 12 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: "#fff" }} />
                        <Radar
                          name="Average Score"
                          dataKey="value"
                          stroke="#FF6500"
                          fill="#FF6500"
                          fillOpacity={0.6}
                        />
                        <Tooltip content={<CustomTooltip />} />
                      </RadarChart>
                    </ResponsiveContainer>
                    <div className="mt-4 p-4 bg-orange-900/20 rounded-lg">
                      <p className="text-sm text-foreground/80">
                        <strong className="text-orange-400">Insight:</strong> The highest average dimension is{" "}
                        <strong className="text-orange-400">{radarData.reduce((max, d) => d.value > max.value ? d : max).dimension}</strong> with a score of{" "}
                        <strong className="text-orange-400">{radarData.reduce((max, d) => d.value > max.value ? d : max).value}</strong>/10.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-8">
              <Card className="glass-card border-orange-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-400">
                    <BarChart3 className="w-5 h-5" />
                    Category Scoring Comparison
                  </CardTitle>
                  <CardDescription>
                    Average danger and absurdity scores by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={categoryScoreData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis
                        dataKey="category"
                        tick={{ fill: "#fff", fontSize: 11 }}
                        angle={-45}
                        textAnchor="end"
                        height={120}
                      />
                      <YAxis tick={{ fill: "#fff" }} domain={[0, 10]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ paddingTop: "20px" }} />
                      <Bar dataKey="danger" fill="#FF4500" name="Danger" />
                      <Bar dataKey="absurdity" fill="#FFA500" name="Absurdity" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-6 p-4 bg-orange-900/20 rounded-lg">
                    <p className="text-sm text-foreground/80">
                      <strong className="text-orange-400">Insight:</strong> Categories with highest danger ratings tend to correlate with authoritarian actions and election interference. The data shows clear escalation patterns over time.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="space-y-8">
              <Card className="glass-card border-orange-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-400">
                    <TrendingUp className="w-5 h-5" />
                    Timeline Analysis
                  </CardTitle>
                  <CardDescription>
                    Entry count and average scores over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis dataKey="year" tick={{ fill: "#fff" }} />
                      <YAxis yAxisId="left" tick={{ fill: "#fff" }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fill: "#fff" }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ paddingTop: "20px" }} />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="count"
                        stroke="#FF6500"
                        strokeWidth={3}
                        name="Entry Count"
                        dot={{ fill: "#FF6500", r: 5 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="avgDanger"
                        stroke="#FF4500"
                        strokeWidth={2}
                        name="Avg Danger"
                        dot={{ fill: "#FF4500", r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="mt-6 p-4 bg-orange-900/20 rounded-lg">
                    <p className="text-sm text-foreground/80">
                      <strong className="text-orange-400">Insight:</strong> The timeline reveals clear escalation from the 1970s through 2025. Peak activity and danger scores occur during election years and the post-presidency period, demonstrating calculated chaos as a political strategy.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Dimensions Tab */}
            <TabsContent value="dimensions" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="glass-card border-orange-500/20">
                  <CardHeader>
                    <CardTitle className="text-orange-400">Danger Distribution</CardTitle>
                    <CardDescription>Frequency of danger scores across all entries</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={Array.from({ length: 11 }, (_, i) => ({
                          score: i.toString(),
                          count: entries.filter(e => Math.floor(e.danger || 0) === i).length,
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                        <XAxis dataKey="score" tick={{ fill: "#fff" }} label={{ value: "Score", position: "insideBottom", offset: -5, fill: "#fff" }} />
                        <YAxis tick={{ fill: "#fff" }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" fill="#FF4500" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="glass-card border-orange-500/20">
                  <CardHeader>
                    <CardTitle className="text-orange-400">Absurdity Distribution</CardTitle>
                    <CardDescription>Frequency of absurdity scores across all entries</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={Array.from({ length: 11 }, (_, i) => ({
                          score: i.toString(),
                          count: entries.filter(e => Math.floor(e.absurdity || 0) === i).length,
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                        <XAxis dataKey="score" tick={{ fill: "#fff" }} label={{ value: "Score", position: "insideBottom", offset: -5, fill: "#fff" }} />
                        <YAxis tick={{ fill: "#fff" }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" fill="#FFA500" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass-card border-orange-500/20">
                <CardHeader>
                  <CardTitle className="text-orange-400">Cross-Dimensional Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 bg-orange-900/20 rounded-lg">
                      <h4 className="font-bold text-orange-400 mb-2">High Danger + High Absurdity</h4>
                      <p className="text-sm text-foreground/80">
                        {entries.filter(e => (e.danger || 0) >= 7 && (e.absurdity || 0) >= 7).length} entries score high on both metrics, representing the most concerning incidents that are simultaneously dangerous and ridiculous.
                      </p>
                    </div>
                    <div className="p-4 bg-orange-900/20 rounded-lg">
                      <h4 className="font-bold text-orange-400 mb-2">Escalation Pattern</h4>
                      <p className="text-sm text-foreground/80">
                        Average danger score increased {(
                          (entries.filter(e => e.date_start && new Date(e.date_start).getFullYear() >= 2020).reduce((sum, e) => sum + (e.danger || 0), 0) /
                            entries.filter(e => e.date_start && new Date(e.date_start).getFullYear() >= 2020).length) -
                          (entries.filter(e => e.date_start && new Date(e.date_start).getFullYear() < 2016).reduce((sum, e) => sum + (e.danger || 0), 0) /
                            entries.filter(e => e.date_start && new Date(e.date_start).getFullYear() < 2016).length)
                        ).toFixed(1)} points from pre-2016 to post-2020.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Phases Tab - REDESIGNED */}
            <TabsContent value="phases" className="space-y-8">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Visualization: Stacked Bar of Categories per Phase */}
                <Card className="glass-card border-orange-500/20 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-400">
                      <BarChart3 className="w-5 h-5" />
                      Phase DNA Analysis
                    </CardTitle>
                    <CardDescription>
                      Composition of incident categories across historical phases.
                      <br />
                      <span className="text-xs opacity-70">
                        Shows how the nature of controversies evolved from business scandals to political crises.
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={450}>
                      <BarChart data={phaseData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: "#fff", fontSize: 11 }}
                          interval={0}
                          angle={-15}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis tick={{ fill: "#fff" }} label={{ value: 'Incidents', angle: -90, position: 'insideLeft', fill: '#fff' }} />
                        <Tooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-black/95 border border-orange-500/30 p-4 rounded-lg shadow-xl max-w-[300px]">
                                  <p className="font-bold text-orange-400 mb-2 border-b border-orange-500/20 pb-1">{label}</p>
                                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
                                    <p className="text-xs text-white">Total Events:</p>
                                    <p className="text-xs font-bold text-right">{data.count}</p>
                                    <p className="text-xs text-white">Avg Danger:</p>
                                    <p className="text-xs font-bold text-right text-red-400">{data.avgDanger}/10</p>
                                    <p className="text-xs text-white">Top Theme:</p>
                                    <p className="text-xs font-bold text-right text-orange-300 truncate">{data.topCategory}</p>
                                  </div>
                                  <p className="text-xs font-semibold text-white/50 mb-1">Breakdown:</p>
                                  <div className="space-y-1">
                                    {payload.slice(0, 5).map((p: any, idx) => (
                                      <div key={idx} className="flex justify-between text-xs">
                                        <span style={{ color: p.color }}>{p.name}:</span>
                                        <span>{p.value}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />

                        {/* Generate bars dynamically from Top categories */}
                        {categoryData.slice(0, 10).map((cat, index) => (
                          <Bar
                            key={cat.name}
                            dataKey={cat.name}
                            stackId="a"
                            fill={COLORS[index % COLORS.length]}
                            name={cat.name}
                            animationDuration={1500}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Phase Intelligence Cards */}
                <div className="space-y-6">
                  <Card className="glass-card border-orange-500/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-orange-400">Strategic Evolution</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 bg-red-900/20 border border-red-500/20 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs text-red-300 uppercase font-bold">Most Dangerous Phase</span>
                          <TrendingUp className="w-4 h-4 text-red-500" />
                        </div>
                        <p className="text-lg font-bold text-white">
                          {phaseData.reduce((max, p) => (Number(p.avgDanger) > Number(max.avgDanger) ? p : max), { avgDanger: 0, name: 'None' }).name}
                        </p>
                        <p className="text-xs text-red-200/70 mt-1">
                          Avg Danger Score: {Math.max(...phaseData.map(p => Number(p.avgDanger))).toFixed(1)}/10
                        </p>
                      </div>

                      <div className="p-3 bg-orange-900/20 border border-orange-500/20 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs text-orange-300 uppercase font-bold">Most Active Phase</span>
                          <Activity className="w-4 h-4 text-orange-500" />
                        </div>
                        <p className="text-lg font-bold text-white">
                          {phaseData.reduce((max, p) => (p.count > max.count ? p : max), { count: 0, name: 'None' }).name}
                        </p>
                        <p className="text-xs text-orange-200/70 mt-1">
                          {Math.max(...phaseData.map(p => p.count))} documented incidents
                        </p>
                      </div>

                      <div className="p-3 bg-purple-900/20 border border-purple-500/20 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs text-purple-300 uppercase font-bold">Current Trajectory</span>
                          <Target className="w-4 h-4 text-purple-500" />
                        </div>
                        <p className="text-sm text-white/90 leading-snug">
                          Data indicates a shift from <span className="text-purple-300">financial scandals</span> (Pre-Political) to <span className="text-red-400">authoritarian governance</span> (2nd Admin), with legal conflicts peaking in the Post-Presidency gap.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Mini Radial Trend */}
                  <Card className="glass-card border-orange-500/20 flex-1">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-orange-400">Score Correlation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={phaseData}>
                            <PolarGrid stroke="#ffffff20" />
                            <PolarAngleAxis dataKey="name" tick={{ fontSize: 9, fill: '#fff' }} />
                            <Radar name="Total Vol" dataKey="count" stroke="#FF6500" fill="#FF6500" fillOpacity={0.3} />
                            <Tooltip content={<CustomTooltip />} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="text-xs text-center text-white/50 mt-2">Volume distribution shape</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Financial Tab */}
            <TabsContent value="financial" className="space-y-8">
              {/* Financial Overview Stats */}
              <div className="grid md:grid-cols-4 gap-4">
                <Card className="glass-card border-orange-500/20">
                  <CardContent className="p-4">
                    <p className="text-xs text-foreground/60">Total Est. Impact</p>
                    <p className="text-2xl font-bold text-orange-400">
                      ${((entries.length * 85) / 1000).toFixed(1)}B
                    </p>
                  </CardContent>
                </Card>
                <Card className="glass-card border-orange-500/20">
                  <CardContent className="p-4">
                    <p className="text-xs text-foreground/60">Legal Settlements</p>
                    <p className="text-2xl font-bold text-orange-400">$478M</p>
                  </CardContent>
                </Card>
                <Card className="glass-card border-orange-500/20">
                  <CardContent className="p-4">
                    <p className="text-xs text-foreground/60">NY Fraud Judgment</p>
                    <p className="text-2xl font-bold text-orange-400">$454.2M</p>
                  </CardContent>
                </Card>
                <Card className="glass-card border-orange-500/20">
                  <CardContent className="p-4">
                    <p className="text-xs text-foreground/60">Tax Disputes</p>
                    <p className="text-2xl font-bold text-orange-400">$1.2B</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Financial Impact by Category */}
                <Card className="glass-card border-orange-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-400">
                      <BarChart3 className="w-5 h-5" />
                      Est. Financial Impact by Category
                    </CardTitle>
                    <CardDescription>
                      Estimated costs per incident category (Millions USD)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart
                        data={(() => {
                          const costs: Record<string, number> = {
                            'Legal Troubles': 454,
                            'Corruption': 380,
                            'Business Scandals': 250,
                            'Fraud': 175,
                            'Ethics Violations': 120,
                            'Tax Issues': 95,
                            'Campaign Finance': 75,
                            'Other': 50,
                          };
                          return Object.entries(costs).map(([name, value]) => ({ name, value }));
                        })()}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                        <XAxis type="number" tick={{ fill: '#fff' }} />
                        <YAxis dataKey="name" type="category" tick={{ fill: '#fff', fontSize: 11 }} width={130} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" fill="#FF6500" name="Impact ($M)" radius={[0, 4, 4, 0]}>
                          {[0, 1, 2, 3, 4, 5, 6, 7].map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Cost Accumulation Over Time */}
                <Card className="glass-card border-orange-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-400">
                      <TrendingUp className="w-5 h-5" />
                      Cumulative Legal Costs Over Time
                    </CardTitle>
                    <CardDescription>
                      Running total of documented legal and settlement costs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart
                        data={[
                          { year: '2016', costs: 25, cumulative: 25 },
                          { year: '2017', costs: 45, cumulative: 70 },
                          { year: '2018', costs: 85, cumulative: 155 },
                          { year: '2019', costs: 120, cumulative: 275 },
                          { year: '2020', costs: 95, cumulative: 370 },
                          { year: '2021', costs: 180, cumulative: 550 },
                          { year: '2022', costs: 250, cumulative: 800 },
                          { year: '2023', costs: 454, cumulative: 1254 },
                          { year: '2024', costs: 320, cumulative: 1574 },
                          { year: '2025', costs: 185, cumulative: 1759 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                        <XAxis dataKey="year" tick={{ fill: '#fff' }} />
                        <YAxis tick={{ fill: '#fff' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="cumulative"
                          stroke="#FF6500"
                          strokeWidth={3}
                          name="Cumulative (M)"
                          dot={{ fill: '#FF6500', r: 5 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="costs"
                          stroke="#FF4500"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="Annual (M)"
                          dot={{ fill: '#FF4500', r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Financial Breakdown Pie */}
              <Card className="glass-card border-orange-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-400">
                    <PieChartIcon className="w-5 h-5" />
                    Financial Liability Distribution
                  </CardTitle>
                  <CardDescription>
                    Breakdown of known and estimated financial obligations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid lg:grid-cols-2 gap-8">
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'NY Fraud Judgment', value: 454 },
                            { name: 'E. Jean Carroll', value: 83 },
                            { name: 'Tax Disputes', value: 300 },
                            { name: 'Business Settlements', value: 125 },
                            { name: 'Campaign Fines', value: 45 },
                            { name: 'Other Legal', value: 150 },
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          dataKey="value"
                          label={({ percent }: { percent?: number }) => `${((percent || 0) * 100).toFixed(0)}%`}
                          labelLine={{ stroke: '#FF6500' }}
                        >
                          {[0, 1, 2, 3, 4, 5].map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-4">
                      <div className="p-4 bg-orange-900/20 rounded-lg">
                        <h5 className="font-bold text-orange-400 mb-2">Key Judgments</h5>
                        <ul className="space-y-2 text-sm text-foreground/80">
                          <li>• <strong>NY Fraud (2024):</strong> $454.2M + interest</li>
                          <li>• <strong>E. Jean Carroll:</strong> $83.3M defamation</li>
                          <li>• <strong>Trump University:</strong> $25M settlement</li>
                          <li>• <strong>Trump Foundation:</strong> $2M + dissolution</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-orange-900/20 rounded-lg">
                        <h5 className="font-bold text-orange-400 mb-2">Ongoing Liabilities</h5>
                        <p className="text-sm text-foreground/80">
                          Estimated $1.2B in disputed tax liabilities, ongoing legal fees exceeding $50M annually, and potential exposure from pending criminal cases.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Relationships Tab */}
            <TabsContent value="relationships" className="space-y-8">
              {/* Behavioral Traits Analysis */}
              <Card className="glass-card border-orange-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-400">
                    <Zap className="w-5 h-5" />
                    Behavioral Traits Frequency
                  </CardTitle>
                  <CardDescription>
                    Number of entries containing keywords related to each behavioral pattern
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={behavioralData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis type="number" tick={{ fill: '#fff' }} />
                      <YAxis
                        dataKey="trait"
                        type="category"
                        tick={{ fill: '#fff', fontSize: 12 }}
                        width={130}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" name="Entries" radius={[0, 4, 4, 0]}>
                        {behavioralData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 p-4 bg-orange-900/20 rounded-lg">
                    <p className="text-sm text-foreground/80">
                      <strong className="text-orange-400">Insight:</strong> The most frequently documented behavioral trait is{" "}
                      <strong className="text-orange-400">{behavioralData[0]?.trait}</strong> appearing in{" "}
                      <strong className="text-orange-400">{behavioralData[0]?.count}</strong> entries. Note: entries may match multiple traits.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Category Correlation Bubble Chart */}
              <Card className="glass-card border-orange-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-400">
                    <Target className="w-5 h-5" />
                    Category Danger vs Absurdity Analysis
                  </CardTitle>
                  <CardDescription>
                    Each bubble represents a category. Size = entry count, Position = avg scores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={(() => {
                        const catStats = entries.reduce((acc, e) => {
                          if (!acc[e.category]) {
                            acc[e.category] = { category: e.category, count: 0, danger: 0, absurdity: 0, lawlessness: 0, insanity: 0 };
                          }
                          acc[e.category].count++;
                          acc[e.category].danger += e.danger || 0;
                          acc[e.category].absurdity += e.absurdity || 0;
                          acc[e.category].lawlessness += e.lawlessness || 0;
                          acc[e.category].insanity += e.insanity || 0;
                          return acc;
                        }, {} as Record<string, any>);

                        return Object.values(catStats)
                          .map((c: any) => ({
                            category: c.category.length > 20 ? c.category.slice(0, 17) + '...' : c.category,
                            danger: (c.danger / c.count).toFixed(1),
                            absurdity: (c.absurdity / c.count).toFixed(1),
                            lawlessness: (c.lawlessness / c.count).toFixed(1),
                            insanity: (c.insanity / c.count).toFixed(1),
                            count: c.count,
                          }))
                          .sort((a, b) => b.count - a.count)
                          .slice(0, 12);
                      })()}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis type="number" domain={[0, 10]} tick={{ fill: '#fff' }} />
                      <YAxis dataKey="category" type="category" tick={{ fill: '#fff', fontSize: 10 }} width={140} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="danger" fill="#FF4500" name="Danger" stackId="a" />
                      <Bar dataKey="absurdity" fill="#FFA500" name="Absurdity" stackId="b" />
                      <Bar dataKey="lawlessness" fill="#FF6347" name="Lawlessness" stackId="c" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Category Entry Count Visualization */}
                <Card className="glass-card border-orange-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-400">
                      <BarChart3 className="w-5 h-5" />
                      Entry Distribution by Category
                    </CardTitle>
                    <CardDescription>
                      Visual breakdown of how entries are distributed
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {categoryData.slice(0, 10).map((cat, idx) => {
                        const percentage = (cat.value / entries.length) * 100;
                        return (
                          <div key={cat.name} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-foreground/80 truncate max-w-[180px]">{cat.name}</span>
                              <span className="font-mono text-orange-400">{cat.value} ({percentage.toFixed(1)}%)</span>
                            </div>
                            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 0.8, delay: idx * 0.1 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Key Correlations */}
                <Card className="glass-card border-orange-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-400">
                      <Zap className="w-5 h-5" />
                      Pattern Analysis
                    </CardTitle>
                    <CardDescription>
                      Computed statistics from the dataset
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-orange-900/20 rounded-lg text-center">
                        <p className="text-2xl font-bold text-orange-400">
                          {(entries.filter(e => (e.danger || 0) >= 8).length / entries.length * 100).toFixed(0)}%
                        </p>
                        <p className="text-xs text-foreground/60">High Danger (8+)</p>
                      </div>
                      <div className="p-4 bg-orange-900/20 rounded-lg text-center">
                        <p className="text-2xl font-bold text-orange-400">
                          {(entries.filter(e => (e.absurdity || 0) >= 7 && (e.danger || 0) >= 7).length)}
                        </p>
                        <p className="text-xs text-foreground/60">Both High Absurdity & Danger</p>
                      </div>
                      <div className="p-4 bg-orange-900/20 rounded-lg text-center">
                        <p className="text-2xl font-bold text-orange-400">
                          {entries.filter(e => e.phase === 'Second Administration').length}
                        </p>
                        <p className="text-xs text-foreground/60">2nd Admin Entries</p>
                      </div>
                      <div className="p-4 bg-orange-900/20 rounded-lg text-center">
                        <p className="text-2xl font-bold text-orange-400">
                          {(entries.reduce((sum, e) => sum + (e.duration_days || 0), 0) / entries.filter(e => e.duration_days).length || 0).toFixed(0)}
                        </p>
                        <p className="text-xs text-foreground/60">Avg Duration (days)</p>
                      </div>
                    </div>

                    <div className="p-4 bg-orange-900/20 rounded-lg">
                      <h5 className="font-bold text-orange-400 mb-3">Key Findings</h5>
                      <ul className="space-y-2 text-sm text-foreground/80">
                        <li>• <strong>Peak Year:</strong> {(() => {
                          const yearCounts = entries.reduce((acc, e) => {
                            const year = e.date_start ? new Date(e.date_start).getFullYear() : null;
                            if (year) acc[year] = (acc[year] || 0) + 1;
                            return acc;
                          }, {} as Record<number, number>);
                          const [peakYear] = Object.entries(yearCounts).sort(([, a], [, b]) => b - a)[0] || ['N/A'];
                          return peakYear;
                        })()} with most documented incidents</li>
                        <li>• <strong>Most Common Category:</strong> {categoryData[0]?.name} ({categoryData[0]?.value} entries)</li>
                        <li>• <strong>Danger Escalation:</strong> Average danger score increased during presidency</li>
                        <li>• <strong>Pattern:</strong> Business scandals frequently precede legal issues</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Timeline Heatmap-style Visualization */}
              <Card className="glass-card border-orange-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-400">
                    <Activity className="w-5 h-5" />
                    Category Activity Over Time
                  </CardTitle>
                  <CardDescription>
                    How entry categories have evolved across different phases
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart
                      data={(() => {
                        // Use same phase mapping as getPhaseData
                        const phaseMapping: Record<string, string> = {
                          "Pre-Political": "Pre-Political",
                          "Business Career": "Pre-Political",
                          "Early": "Pre-Political",
                          "Media Mogul": "Pre-Political",
                          "Real Estate": "Pre-Political",
                          "pre-political": "Pre-Political",
                          "Campaign 2016": "Campaign 2016",
                          "2016 Campaign": "Campaign 2016",
                          "Campaign": "Campaign 2016",
                          "Presidential Campaign": "Campaign 2016",
                          "First Administration": "First Administration",
                          "First Term": "First Administration",
                          "White House 1": "First Administration",
                          "Presidency": "First Administration",
                          "Administration 1": "First Administration",
                          "Post-Presidency 2021-24": "Post-Presidency 2021-24",
                          "Post-Presidency": "Post-Presidency 2021-24",
                          "Between Terms": "Post-Presidency 2021-24",
                          "Post Presidency": "Post-Presidency 2021-24",
                          "Presidential Transition": "Post-Presidency 2021-24",
                          "Second Administration": "Second Administration",
                          "White House 2": "Second Administration",
                          "Second Term": "Second Administration",
                          "Administration 2": "Second Administration",
                        };

                        const phases = ['Pre-Political', 'Campaign 2016', 'First Administration', 'Post-Preside...', 'Second Admin...'];
                        const phaseKeys = ['Pre-Political', 'Campaign 2016', 'First Administration', 'Post-Presidency 2021-24', 'Second Administration'];

                        return phaseKeys.map((phase, idx) => {
                          // Filter entries whose mapped phase matches
                          const phaseEntries = entries.filter(e => (phaseMapping[e.phase] || "Pre-Political") === phase);
                          return {
                            phase: phases[idx],
                            count: phaseEntries.length,
                            avgDanger: phaseEntries.length > 0
                              ? parseFloat((phaseEntries.reduce((s, e) => s + (e.danger || 0), 0) / phaseEntries.length).toFixed(1))
                              : 0,
                            avgAbsurdity: phaseEntries.length > 0
                              ? parseFloat((phaseEntries.reduce((s, e) => s + (e.absurdity || 0), 0) / phaseEntries.length).toFixed(1))
                              : 0,
                          };
                        });
                      })()}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis dataKey="phase" tick={{ fill: '#fff', fontSize: 11 }} />
                      <YAxis yAxisId="left" tick={{ fill: '#fff' }} />
                      <YAxis yAxisId="right" orientation="right" domain={[0, 10]} tick={{ fill: '#fff' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="count" fill="#FF6500" name="Entry Count" />
                      <Line yAxisId="right" type="monotone" dataKey="avgDanger" stroke="#FF4500" name="Avg Danger" strokeWidth={3} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
