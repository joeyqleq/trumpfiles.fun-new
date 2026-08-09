"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Card,
    CardContent,
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
    Area,
    AreaChart,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    PieChart,
    Pie,
    Cell,
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { AICompleteTrumpData } from "@/types/database";
import { BarChart3, PieChart as PieChartIcon, Activity, TrendingUp as LucideTrendingUp, Target, Zap, Loader2 } from "lucide-react";
import TrueFocus from "@/components/TrueFocus";
import PageDecorations from "@/components/PageDecorations";

const COLORS = ["#E53935", "#FB8C00", "#FDD835", "#43A047", "#1E88E5", "#8E24AA", "#00ACC1", "#6D4C41", "#F4511E", "#546E7A", "#D81B60", "#7CB342"];

export default function VisualizerClient({
    totalCount
}: {
    totalCount: number;
}) {
    const [activeTab, setActiveTab] = useState("overview");
    const [entries, setEntries] = useState<AICompleteTrumpData[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch all entries from API (no hard limit)
    useEffect(() => {
        setLoading(true);
        fetch("/api/visualizer-data")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setEntries(data);
                }
            })
            .catch((err) => console.error("Failed to fetch visualizer data:", err))
            .finally(() => setLoading(false));
    }, []);

    // Use the real total count from the DB for display, entries array for calculations
    const displayTotal = loading ? totalCount : entries.length;

    const getCategoryData = () => {
        const categoryCount = entries.reduce((acc, entry) => {
            const cat = entry.category || "Uncategorized";
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const sorted = Object.entries(categoryCount).sort(([, a], [, b]) => b - a);
        const topCategories = sorted.slice(0, 8).map(([name, value]) => ({ name, value }));
        const otherCount = sorted.slice(8).reduce((sum, [, val]) => sum + val, 0);
        if (otherCount > 0) topCategories.push({ name: "Other", value: otherCount });
        return topCategories;
    };

    const getTimelineData = () => {
        const yearlyData = entries.reduce((acc, entry) => {
            const year = entry.date_start ? new Date(entry.date_start).getFullYear() : "Unknown";
            if (year !== "Unknown") {
                if (!acc[year]) acc[year] = { year, count: 0, totalDanger: 0, totalAbsurdity: 0 };
                acc[year].count++;
                acc[year].totalDanger += entry.danger || 0;
                acc[year].totalAbsurdity += entry.absurdity || 0;
            }
            return acc;
        }, {} as Record<string, any>);
        return Object.values(yearlyData).map((d: any) => ({
            year: d.year.toString(),
            count: d.count,
            avgDanger: (d.totalDanger / d.count).toFixed(1),
            avgAbsurdity: (d.totalAbsurdity / d.count).toFixed(1),
        })).sort((a, b) => parseInt(a.year) - parseInt(b.year));
    };

    const getRadarData = () => {
        if (entries.length === 0) return [];
        const dimensions = ["danger", "lawlessness", "insanity", "absurdity", "authoritarianism"];
        return dimensions.map((dim) => {
            const avg = entries.reduce((sum, entry) => sum + ((entry as any)[dim] || 0), 0) / entries.length;
            return { dimension: dim.charAt(0).toUpperCase() + dim.slice(1), value: parseFloat(avg.toFixed(2)) };
        });
    };

    const getCategoryScoreData = () => {
        const categoryScores = entries.reduce((acc, entry) => {
            const cat = entry.category || "Uncategorized";
            if (!acc[cat]) acc[cat] = { category: cat, danger: 0, absurdity: 0, count: 0 };
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

    const getPhaseData = () => {
        // Map actual DB phase values to display groups
        const phaseMapping: Record<string, string> = {
            "Early Life": "Pre-Political Era",
            "Real Estate": "Pre-Political Era",
            "Early Business Career": "Pre-Political Era",
            "Business Empire": "Pre-Political Era",
            "Trump Organization CEO": "Pre-Political Era",
            "Media Mogul": "Pre-Political Era",
            "Pre-Presidential Campaign": "Campaign Trail",
            "Presidential Campaign": "Campaign Trail",
            "Campaign Trail": "Campaign Trail",
            "Candidate": "Campaign Trail",
            "Presidential Transition": "First Term (2017-2021)",
            "White House 1": "First Term (2017-2021)",
            "First Term": "First Term (2017-2021)",
            "President": "First Term (2017-2021)",
            "Post-Presidency": "Post-Presidency (2021-2024)",
            "Between Terms": "Post-Presidency (2021-2024)",
            "White House 2": "Second Term (2025+)",
        };
        const phaseOrder = ["Pre-Political Era", "Campaign Trail", "First Term (2017-2021)", "Post-Presidency (2021-2024)", "Second Term (2025+)"];
        return phaseOrder.map(phaseName => {
            const phaseEntries = entries.filter(e => {
                const mapped = phaseMapping[e.phase] || "Pre-Political Era";
                return mapped === phaseName;
            });
            const categories: Record<string, number> = {};
            phaseEntries.forEach(e => { const c = e.category || "Uncategorized"; categories[c] = (categories[c] || 0) + 1; });
            const sortedCats = Object.entries(categories).sort(([, a], [, b]) => b - a);
            return {
                name: phaseName, value: phaseEntries.length, count: phaseEntries.length,
                avgDanger: phaseEntries.length > 0 ? parseFloat((phaseEntries.reduce((s, e) => s + (e.danger || 0), 0) / phaseEntries.length).toFixed(1)) : 0,
                avgAbsurdity: phaseEntries.length > 0 ? parseFloat((phaseEntries.reduce((s, e) => s + (e.absurdity || 0), 0) / phaseEntries.length).toFixed(1)) : 0,
                topCategory: sortedCats[0] ? sortedCats[0][0] : "None",
            };
        }).filter(d => d.count > 0);
    };

    const getBehavioralTraits = () => {
        const patterns = {
            "Narcissism": ["narciss"], "Racism": ["racis"], "Corruption": ["corrupt"], "Lying": ["lie"],
            "Fraud": ["fraud"], "Misogyny": ["misogyn"], "Obstruction": ["obstruct"], "Incitement": ["incit"],
            "Authoritarianism": ["authoritarian"]
        };
        return Object.entries(patterns).map(([trait, keywords]) => {
            const count = entries.filter(entry => {
                const searchText = `${entry.title || ""} ${entry.synopsis || ""} ${(entry.all_keywords || []).join(" ")}`.toLowerCase();
                return keywords.some(keyword => searchText.includes(keyword));
            }).length;
            return { trait, count };
        }).sort((a, b) => b.count - a.count);
    };

    const getFinancialImpactData = () => {
        const categoryImpact = entries.reduce((acc, entry) => {
            const cat = entry.category || "Uncategorized";
            if (!acc[cat]) acc[cat] = { category: cat, totalScore: 0, count: 0, avgImpactScope: 0, totalImpact: 0 };
            acc[cat].totalScore += parseFloat(entry.fucked_up_score || "0");
            acc[cat].totalImpact += entry.impact_scope || 0;
            acc[cat].count++;
            return acc;
        }, {} as Record<string, any>);
        return Object.values(categoryImpact)
            .map((d: any) => ({
                category: d.category,
                avgScore: parseFloat((d.totalScore / d.count).toFixed(1)),
                avgImpact: parseFloat((d.totalImpact / d.count).toFixed(1)),
                count: d.count,
            }))
            .sort((a, b) => b.avgScore - a.avgScore)
            .slice(0, 12);
    };

    const getScoreDistribution = () => {
        const buckets = Array.from({ length: 10 }, (_, i) => ({
            range: `${i * 10}-${(i + 1) * 10}`,
            count: 0,
        }));
        entries.forEach(entry => {
            const score = parseFloat(entry.fucked_up_score || "0");
            const idx = Math.min(Math.floor(score / 10), 9);
            buckets[idx].count++;
        });
        return buckets;
    };

    const getRelationshipData = () => {
        // Cross-dimension correlation: entries grouped by top keywords
        const keywordCounts: Record<string, { keyword: string; count: number; avgDanger: number; avgAbsurdity: number; totalDanger: number; totalAbsurdity: number }> = {};
        entries.forEach(entry => {
            (entry.all_keywords || []).forEach(kw => {
                if (!kw) return;
                const keyword = kw.toLowerCase().trim();
                if (!keyword || keyword.length < 3) return;
                if (!keywordCounts[keyword]) keywordCounts[keyword] = { keyword, count: 0, avgDanger: 0, avgAbsurdity: 0, totalDanger: 0, totalAbsurdity: 0 };
                keywordCounts[keyword].count++;
                keywordCounts[keyword].totalDanger += entry.danger || 0;
                keywordCounts[keyword].totalAbsurdity += entry.absurdity || 0;
            });
        });
        return Object.values(keywordCounts)
            .filter(d => d.count >= 5)
            .map(d => ({
                keyword: d.keyword,
                count: d.count,
                avgDanger: parseFloat((d.totalDanger / d.count).toFixed(1)),
                avgAbsurdity: parseFloat((d.totalAbsurdity / d.count).toFixed(1)),
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 15);
    };

    const getDimensionCorrelation = () => {
        // Create a heatmap-style grid: how many entries at each danger x absurdity combo
        const grid: Record<string, number> = {};
        entries.forEach(e => {
            const d = e.danger || 0;
            const a = e.absurdity || 0;
            const key = `${d}-${a}`;
            grid[key] = (grid[key] || 0) + 1;
        });
        return Object.entries(grid).map(([key, count]) => {
            const [d, a] = key.split("-").map(Number);
            return { danger: d, absurdity: a, count };
        });
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black/90 border border-orange-500/30 p-3 rounded-lg shadow-lg">
                    <p className="font-bold text-orange-400">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm text-white">{entry.name}: <span className="font-bold">{entry.value}</span></p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const categoryData = getCategoryData();
    const timelineData = getTimelineData();
    const radarData = getRadarData();
    const categoryScoreData = getCategoryScoreData();
    const phaseData = getPhaseData();
    const behavioralData = getBehavioralTraits();
    const financialData = getFinancialImpactData();
    const scoreDistribution = getScoreDistribution();
    const relationshipData = getRelationshipData();
    const dimensionCorrelation = getDimensionCorrelation();

    return (
        <div className="min-h-screen py-16 relative">
            <PageDecorations variant="visualizer" />
            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
                    <div className="flex justify-center mb-6"><div className="font-arctic-3d"><TrueFocus sentence="DATA VISUALIZER" manualMode={false} blurAmount={3} borderColor="#FF6500" glowColor="rgba(255, 101, 0, 0.6)" animationDuration={0.8} pauseBetweenAnimations={2} /></div></div>
                    <p className="text-xl text-foreground/70 max-w-3xl mx-auto mt-4" data-testid="visualizer-subtitle">Explore patterns, correlations, and insights across {displayTotal.toLocaleString()} documented incidents</p>
                </motion.div>

                <div className="grid md:grid-cols-4 gap-6 mb-12">
                    <Card className="glass-card border-orange-500/20"><CardContent className="p-6"><div className="flex items-center gap-3 mb-2"><Target className="w-8 h-8 text-orange-400" /><div><p className="text-sm text-foreground/70">Total Entries</p><p className="text-3xl font-bold text-orange-400" data-testid="visualizer-total-entries">{displayTotal.toLocaleString()}</p></div></div></CardContent></Card>
                    <Card className="glass-card border-orange-500/20"><CardContent className="p-6"><div className="flex items-center gap-3 mb-2"><Zap className="w-8 h-8 text-orange-400" /><div><p className="text-sm text-foreground/70">Avg Danger</p><p className="text-3xl font-bold text-orange-400" data-testid="visualizer-avg-danger">{entries.length > 0 ? (entries.reduce((sum, e) => sum + (e.danger || 0), 0) / entries.length).toFixed(1) : "—"}</p></div></div></CardContent></Card>
                    <Card className="glass-card border-orange-500/20"><CardContent className="p-6"><div className="flex items-center gap-3 mb-2"><Activity className="w-8 h-8 text-orange-400" /><div><p className="text-sm text-foreground/70">Avg Absurdity</p><p className="text-3xl font-bold text-orange-400" data-testid="visualizer-avg-absurdity">{entries.length > 0 ? (entries.reduce((sum, e) => sum + (e.absurdity || 0), 0) / entries.length).toFixed(1) : "—"}</p></div></div></CardContent></Card>
                    <Card className="glass-card border-orange-500/20"><CardContent className="p-6"><div className="flex items-center gap-3 mb-2"><LucideTrendingUp className="w-8 h-8 text-orange-400" /><div><p className="text-sm text-foreground/70">Peak Danger</p><p className="text-3xl font-bold text-orange-400" data-testid="visualizer-peak-danger">{entries.length > 0 ? Math.max(...entries.map(e => e.danger || 0)).toFixed(1) : "—"}</p></div></div></CardContent></Card>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 className="w-10 h-10 text-orange-400 animate-spin" />
                        <p className="text-foreground/60 text-lg">Loading visualization data...</p>
                    </div>
                ) : (
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                        <TabsList className="flex w-full overflow-x-auto justify-start bg-white/5 p-1 space-x-1 md:space-x-2 scrollbar-thin scrollbar-thumb-orange-500/30 scrollbar-track-transparent pb-1">
                            <TabsTrigger value="overview" className="flex-shrink-0" data-testid="visualizer-tab-overview">Overview</TabsTrigger>
                            <TabsTrigger value="categories" className="flex-shrink-0" data-testid="visualizer-tab-categories">Categories</TabsTrigger>
                            <TabsTrigger value="timeline" className="flex-shrink-0" data-testid="visualizer-tab-timeline">Timeline</TabsTrigger>
                            <TabsTrigger value="dimensions" className="flex-shrink-0" data-testid="visualizer-tab-dimensions">Dimensions</TabsTrigger>
                            <TabsTrigger value="phases" className="flex-shrink-0" data-testid="visualizer-tab-phases">Phases</TabsTrigger>
                            <TabsTrigger value="financial" className="flex-shrink-0" data-testid="visualizer-tab-financial">Financial</TabsTrigger>
                            <TabsTrigger value="relationships" className="flex-shrink-0" data-testid="visualizer-tab-relationships">Relations</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-8">
                            <div className="grid lg:grid-cols-2 gap-8">
                                <Card className="glass-card border-orange-500/20"><CardHeader><CardTitle className="text-orange-400">Category Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={350}><PieChart><Pie data={categoryData} cx="50%" cy="45%" outerRadius={90} dataKey="value">{categoryData.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}</Pie><Tooltip content={<CustomTooltip />} /><Legend /></PieChart></ResponsiveContainer></CardContent></Card>
                                <Card className="glass-card border-orange-500/20"><CardHeader><CardTitle className="text-orange-400">Scoring Dimensions</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={350}><RadarChart data={radarData}><PolarGrid /><PolarAngleAxis dataKey="dimension" /><Radar dataKey="value" stroke="#FF6500" fill="#FF6500" fillOpacity={0.6} /><Tooltip content={<CustomTooltip />} /></RadarChart></ResponsiveContainer></CardContent></Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="categories"><Card className="glass-card border-orange-500/20"><CardHeader><CardTitle className="text-orange-400">Danger vs Absurdity by Category</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={400}><BarChart data={categoryScoreData}><CartesianGrid strokeOpacity={0.1} /><XAxis dataKey="category" angle={-45} textAnchor="end" height={100} /><YAxis /><Tooltip content={<CustomTooltip />} /><Legend /><Bar dataKey="danger" fill="#FF4500" /><Bar dataKey="absurdity" fill="#FFA500" /></BarChart></ResponsiveContainer></CardContent></Card></TabsContent>

                        <TabsContent value="timeline" className="space-y-8">
                            <div className="grid lg:grid-cols-1 gap-8">
                                <Card className="glass-card border-orange-500/20">
                                    <CardHeader><CardTitle className="text-orange-400">Incidents Over Time</CardTitle></CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <ComposedChart data={timelineData}>
                                                <CartesianGrid strokeOpacity={0.1} />
                                                <XAxis dataKey="year" />
                                                <YAxis yAxisId="left" />
                                                <YAxis yAxisId="right" orientation="right" />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend />
                                                <Bar yAxisId="left" dataKey="count" fill="#FF6500" name="Incident Count" />
                                                <Line yAxisId="right" type="monotone" dataKey="avgDanger" stroke="#FF4500" strokeWidth={2} name="Avg Danger" dot={{ fill: '#FF4500' }} />
                                                <Line yAxisId="right" type="monotone" dataKey="avgAbsurdity" stroke="#FFA500" strokeWidth={2} name="Avg Absurdity" dot={{ fill: '#FFA500' }} />
                                            </ComposedChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="dimensions" className="space-y-8">
                            <div className="grid lg:grid-cols-2 gap-8">
                                <Card className="glass-card border-orange-500/20">
                                    <CardHeader><CardTitle className="text-orange-400">Average Scoring Dimensions</CardTitle></CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={350}>
                                            <RadarChart data={radarData}>
                                                <PolarGrid />
                                                <PolarAngleAxis dataKey="dimension" />
                                                <PolarRadiusAxis angle={30} domain={[0, 10]} />
                                                <Radar dataKey="value" stroke="#FF6500" fill="#FF6500" fillOpacity={0.6} />
                                                <Tooltip content={<CustomTooltip />} />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                                <Card className="glass-card border-orange-500/20">
                                    <CardHeader><CardTitle className="text-orange-400">Behavioral Pattern Detection</CardTitle></CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={350}>
                                            <BarChart data={behavioralData} layout="vertical">
                                                <CartesianGrid strokeOpacity={0.1} />
                                                <XAxis type="number" />
                                                <YAxis type="category" dataKey="trait" width={120} />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Bar dataKey="count" fill="#FF6500" name="Mentions">
                                                    {behavioralData.map((_, i) => (
                                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </div>
                            <Card className="glass-card border-orange-500/20">
                                <CardHeader><CardTitle className="text-orange-400">Danger vs Absurdity Density</CardTitle></CardHeader>
                                <CardContent>
                                    <p className="text-xs text-foreground/50 mb-4">Bubble size = number of entries at that danger/absurdity combination. Based on all {entries.length.toLocaleString()} entries.</p>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <ScatterChart>
                                            <CartesianGrid strokeOpacity={0.1} />
                                            <XAxis type="number" dataKey="danger" name="Danger" domain={[0, 10]} label={{ value: "Danger Score", position: "insideBottom", offset: -5, fill: "#aaa" }} />
                                            <YAxis type="number" dataKey="absurdity" name="Absurdity" domain={[0, 10]} label={{ value: "Absurdity Score", angle: -90, position: "insideLeft", fill: "#aaa" }} />
                                            <Tooltip content={({ active, payload }: any) => {
                                                if (active && payload && payload.length) {
                                                    const d = payload[0].payload;
                                                    return (
                                                        <div className="bg-black/90 border border-orange-500/30 p-3 rounded-lg shadow-lg">
                                                            <p className="text-orange-400 font-bold">Danger: {d.danger} / Absurdity: {d.absurdity}</p>
                                                            <p className="text-white text-sm">{d.count} entries</p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }} />
                                            <Scatter data={dimensionCorrelation} fill="#FF6500" fillOpacity={0.7}>
                                                {dimensionCorrelation.map((entry, i) => (
                                                    <Cell key={i} fill={entry.count > 50 ? "#FF0000" : entry.count > 20 ? "#FF4500" : entry.count > 5 ? "#FF6500" : "#FFA500"} r={Math.max(4, Math.min(Math.sqrt(entry.count) * 3, 30))} />
                                                ))}
                                            </Scatter>
                                        </ScatterChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="phases" className="space-y-8">
                            <div className="grid lg:grid-cols-2 gap-8">
                                <Card className="glass-card border-orange-500/20">
                                    <CardHeader><CardTitle className="text-orange-400">Entries by Phase</CardTitle></CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={350}>
                                            <BarChart data={phaseData}>
                                                <CartesianGrid strokeOpacity={0.1} />
                                                <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} interval={0} tick={{ fontSize: 11 }} />
                                                <YAxis />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Bar dataKey="count" name="Incident Count">
                                                    {phaseData.map((_, i) => (
                                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                                <Card className="glass-card border-orange-500/20">
                                    <CardHeader><CardTitle className="text-orange-400">Avg Scores by Phase</CardTitle></CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={350}>
                                            <BarChart data={phaseData}>
                                                <CartesianGrid strokeOpacity={0.1} />
                                                <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} interval={0} tick={{ fontSize: 11 }} />
                                                <YAxis domain={[0, 10]} />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend />
                                                <Bar dataKey="avgDanger" fill="#FF4500" name="Avg Danger" />
                                                <Bar dataKey="avgAbsurdity" fill="#FFA500" name="Avg Absurdity" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </div>
                            <Card className="glass-card border-orange-500/20">
                                <CardHeader><CardTitle className="text-orange-400">Phase Summary</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {phaseData.map((phase, i) => (
                                            <div key={phase.name} className="p-4 rounded-lg bg-white/5 border border-white/10">
                                                <h4 className="font-bold text-orange-400 mb-2">{phase.name}</h4>
                                                <div className="space-y-1 text-sm text-foreground/70">
                                                    <p>Entries: <span className="text-white font-mono">{phase.count.toLocaleString()}</span></p>
                                                    <p>Avg Danger: <span className="text-red-400 font-mono">{phase.avgDanger}/10</span></p>
                                                    <p>Avg Absurdity: <span className="text-yellow-400 font-mono">{phase.avgAbsurdity}/10</span></p>
                                                    <p>Top Category: <span className="text-orange-300">{phase.topCategory}</span></p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="financial" className="space-y-8">
                            <div className="grid lg:grid-cols-2 gap-8">
                                <Card className="glass-card border-orange-500/20">
                                    <CardHeader><CardTitle className="text-orange-400">Impact Score by Category</CardTitle></CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <BarChart data={financialData} layout="vertical">
                                                <CartesianGrid strokeOpacity={0.1} />
                                                <XAxis type="number" />
                                                <YAxis type="category" dataKey="category" width={140} />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend />
                                                <Bar dataKey="avgScore" fill="#FF6500" name="Avg F*cked-Up Score" />
                                                <Bar dataKey="avgImpact" fill="#FFA500" name="Avg Impact Scope" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                                <Card className="glass-card border-orange-500/20">
                                    <CardHeader><CardTitle className="text-orange-400">Score Distribution</CardTitle></CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <AreaChart data={scoreDistribution}>
                                                <CartesianGrid strokeOpacity={0.1} />
                                                <XAxis dataKey="range" />
                                                <YAxis />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Area type="monotone" dataKey="count" stroke="#FF6500" fill="#FF6500" fillOpacity={0.3} name="Entries" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="relationships" className="space-y-8">
                            <Card className="glass-card border-orange-500/20">
                                <CardHeader><CardTitle className="text-orange-400">Top Keywords by Frequency</CardTitle></CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={450}>
                                        <BarChart data={relationshipData} layout="vertical">
                                            <CartesianGrid strokeOpacity={0.1} />
                                            <XAxis type="number" />
                                            <YAxis type="category" dataKey="keyword" width={140} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend />
                                            <Bar dataKey="count" fill="#FF6500" name="Frequency">
                                                {relationshipData.map((_, i) => (
                                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                            <Card className="glass-card border-orange-500/20">
                                <CardHeader><CardTitle className="text-orange-400">Keyword Danger vs Absurdity</CardTitle></CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <BarChart data={relationshipData}>
                                            <CartesianGrid strokeOpacity={0.1} />
                                            <XAxis dataKey="keyword" angle={-45} textAnchor="end" height={100} />
                                            <YAxis domain={[0, 10]} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend />
                                            <Bar dataKey="avgDanger" fill="#FF4500" name="Avg Danger" />
                                            <Bar dataKey="avgAbsurdity" fill="#FFA500" name="Avg Absurdity" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </div>
    );
}
