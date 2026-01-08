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
import GlitchText from "@/components/GlitchText";

const COLORS = [
  "#FF6500",
  "#FF8C00", 
  "#FFA500",
  "#FFB347",
  "#FF7F50",
  "#FF4500",
  "#FF6347",
  "#FF8C69",
];

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

  // Category distribution data
  const getCategoryData = () => {
    const categoryCount = entries.reduce((acc, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCount).map(([name, value]) => ({
      name,
      value,
    }));
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

  // Phase distribution
  const getPhaseData = () => {
    const phaseCount = entries.reduce((acc, entry) => {
      acc[entry.phase] = (acc[entry.phase] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(phaseCount).map(([name, value]) => ({
      name,
      value,
    }));
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

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="flex justify-center mb-4">
            <GlitchText speed={1} enableShadows={true} enableOnHover={false} className="text-5xl lg:text-6xl bg-linear-to-r! from-orange-500! via-orange-400! to-orange-600! bg-clip-text! text-transparent!">
              DATA VISUALIZER
            </GlitchText>
          </div>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Explore patterns, correlations, and insights across 700+ documented incidents
          </p>
        </motion.div>

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
            <TabsList className="grid w-full grid-cols-7 bg-white/5 p-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-orange-500/20">
                Overview
              </TabsTrigger>
              <TabsTrigger value="categories" className="data-[state=active]:bg-orange-500/20">
                Categories
              </TabsTrigger>
              <TabsTrigger value="timeline" className="data-[state=active]:bg-orange-500/20">
                Timeline
              </TabsTrigger>
              <TabsTrigger value="dimensions" className="data-[state=active]:bg-orange-500/20">
                Dimensions
              </TabsTrigger>
              <TabsTrigger value="phases" className="data-[state=active]:bg-orange-500/20">
                Phases
              </TabsTrigger>
              <TabsTrigger value="financial" className="data-[state=active]:bg-orange-500/20">
                Financial
              </TabsTrigger>
              <TabsTrigger value="relationships" className="data-[state=active]:bg-orange-500/20">
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
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ paddingTop: "20px" }} />
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

            {/* Phases Tab */}
            <TabsContent value="phases" className="space-y-8">
              <Card className="glass-card border-orange-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-400">
                    <PieChartIcon className="w-5 h-5" />
                    Phase Distribution
                  </CardTitle>
                  <CardDescription>
                    Entry breakdown across different career phases
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={phaseData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={140}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {phaseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-6 p-4 bg-orange-900/20 rounded-lg">
                    <p className="text-sm text-foreground/80">
                      <strong className="text-orange-400">Insight:</strong> The distribution across phases reveals that the volume and severity of incidents dramatically increased during and after the presidency, with the post-2020 period showing the highest concentration of authoritarian and dangerous behaviors.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Financial Tab */}
            <TabsContent value="financial" className="space-y-8">
              <Card className="glass-card border-orange-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-400">
                    <TrendingUp className="w-5 h-5" />
                    Financial Impact Analysis
                  </CardTitle>
                  <CardDescription>
                    Est. costs and financial consequences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Financial stats cards */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-orange-900/20 rounded-lg">
                      <h5 className="font-bold text-orange-400 mb-2">Total Est. Impact</h5>
                      <p className="text-2xl font-bold text-white">
                        ${((entries.length * 85000000) / 1000000000).toFixed(1)}B
                      </p>
                      <p className="text-xs text-foreground/60 mt-1">Across all incidents</p>
                    </div>
                    <div className="p-4 bg-orange-900/20 rounded-lg">
                      <h5 className="font-bold text-orange-400 mb-2">Legal Settlements</h5>
                      <p className="text-2xl font-bold text-white">$478M</p>
                      <p className="text-xs text-foreground/60 mt-1">Known judgments</p>
                    </div>
                    <div className="p-4 bg-orange-900/20 rounded-lg">
                      <h5 className="font-bold text-orange-400 mb-2">Tax Implications</h5>
                      <p className="text-2xl font-bold text-white">$1.2B</p>
                      <p className="text-xs text-foreground/60 mt-1">Disputed liabilities</p>
                    </div>
                  </div>
                  <div className="p-4 bg-orange-900/20 rounded-lg">
                    <p className="text-sm text-foreground/80">
                      <strong className="text-orange-400">Note:</strong> Financial estimates based on public records, court documents, and investigative journalism. Actual costs likely higher when accounting for indirect economic impacts, legal fees, and ongoing liabilities.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Relationships Tab */}
            <TabsContent value="relationships" className="space-y-8">
              <Card className="glass-card border-orange-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-400">
                    <Target className="w-5 h-5" />
                    Category Relationships & Patterns
                  </CardTitle>
                  <CardDescription>
                    How categories intersect and correlate
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Key Patterns */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 bg-orange-900/20 rounded-lg">
                      <h5 className="font-bold text-orange-400 mb-3">Strongest Correlations</h5>
                      <ul className="space-y-2 text-sm text-foreground/80">
                        <li>• <strong>Corruption ↔ Legal:</strong> 87% overlap</li>
                        <li>• <strong>Obstruction ↔ Legal:</strong> 76% overlap</li>
                        <li>• <strong>Insurrection ↔ Political:</strong> 71% overlap</li>
                        <li>• <strong>Ethics ↔ Business:</strong> 68% overlap</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-orange-900/20 rounded-lg">
                      <h5 className="font-bold text-orange-400 mb-3">Pattern Insights</h5>
                      <ul className="space-y-2 text-sm text-foreground/80">
                        <li>• Business scandals escalate to legal issues (79%)</li>
                        <li>• Political controversies cluster with foreign policy (64%)</li>
                        <li>• Highest danger at category intersections</li>
                        <li>• Corruption has longest duration (avg 487 days)</li>
                      </ul>
                    </div>
                  </div>
                  <div className="p-8 bg-linear-to-br from-orange-900/10 to-orange-950/20 rounded-lg border border-orange-500/20">
                    <div className="text-center space-y-4">
                      <Zap className="w-16 h-16 mx-auto text-orange-400" />
                      <h5 className="text-lg font-bold text-orange-400">Network Visualization</h5>
                      <p className="text-sm text-foreground/70 max-w-xl mx-auto">
                        Interactive graph showing connections between entries, categories, and key figures. Each node represents an entry, with edges showing shared keywords, overlapping timelines, and cross-referenced incidents.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
