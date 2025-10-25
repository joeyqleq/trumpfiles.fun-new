"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as d3 from "d3";
import { pool } from "@/lib/neon";
import { TrumpEntry } from "@/types/database";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { BarChart3, LineChart, PieChart, TrendingUp } from "lucide-react";
import { TrumpFilesHeading } from "@/components/TrumpFilesBrand";

type ChartType = "bar" | "line" | "scatter" | "heatmap";
type YAxis =
  | "danger_score"
  | "lawlessness_score"
  | "insanity_score"
  | "absurdity_score"
  | "financial_cost"
  | "count";
type XAxis = "timeline" | "category" | "phase";

export default function VisualizerPage() {
  const [entries, setEntries] = useState<TrumpEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [yAxis, setYAxis] = useState<YAxis>("danger_score");
  const [xAxis, setXAxis] = useState<XAxis>("category");

  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    if (entries.length > 0) {
      drawChart();
    }
  }, [entries, chartType, yAxis, xAxis]);

  const fetchEntries = async () => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM trump_entries ORDER BY date_occurred ASC",
      );
      setEntries(rows || []);
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const prepareData = () => {
    if (xAxis === "timeline") {
      // Group by year
      const grouped = d3.group(entries, (d) => {
        const date = d.date_occurred ? new Date(d.date_occurred) : null;
        return date ? date.getFullYear() : "Unknown";
      });

      return Array.from(grouped, ([key, values]) => {
        const aggregated =
          yAxis === "count"
            ? values.length
            : d3.mean(values, (d) => (d as any)[yAxis] || 0) || 0;
        return { x: key, y: aggregated, values };
      }).sort((a, b) => {
        if (a.x === "Unknown") return 1;
        if (b.x === "Unknown") return -1;
        return Number(a.x) - Number(b.x);
      });
    } else if (xAxis === "category") {
      const grouped = d3.group(entries, (d) => d.category);
      return Array.from(grouped, ([key, values]) => {
        const aggregated =
          yAxis === "count"
            ? values.length
            : d3.mean(values, (d) => (d as any)[yAxis] || 0) || 0;
        return { x: key, y: aggregated, values };
      });
    } else {
      // phase
      const grouped = d3.group(entries, (d) => d.phase);
      return Array.from(grouped, ([key, values]) => {
        const aggregated =
          yAxis === "count"
            ? values.length
            : d3.mean(values, (d) => (d as any)[yAxis] || 0) || 0;
        return { x: key, y: aggregated, values };
      });
    }
  };

  const drawChart = () => {
    if (!svgRef.current) return;

    const data = prepareData();
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 60, left: 70 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    if (chartType === "bar") {
      drawBarChart(g, data, width, height);
    } else if (chartType === "line") {
      drawLineChart(g, data, width, height);
    } else if (chartType === "scatter") {
      drawScatterPlot(g, entries, width, height);
    } else if (chartType === "heatmap") {
      drawHeatmap(g, entries, width, height);
    }
  };

  const drawBarChart = (g: any, data: any[], width: number, height: number) => {
    const margin = { left: 70 };
    const x = d3
      .scaleBand()
      .domain(data.map((d) => String(d.x)))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.y) as number])
      .nice()
      .range([height, 0]);

    // X axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("fill", "#ffffff80");

    // Y axis
    g.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", "#ffffff80");

    // Y axis label
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("fill", "#ffffff80")
      .text(getYAxisLabel());

    // Bars with animation
    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d: any) => x(String(d.x)) || 0)
      .attr("width", x.bandwidth())
      .attr("y", height)
      .attr("height", 0)
      .style("fill", "#FF4500")
      .on("mouseover", function (this: any, event: any, d: any) {
        d3.select(this).style("fill", "#FF6500");
        showTooltip(event, d);
      })
      .on("mouseout", function (this: any) {
        d3.select(this).style("fill", "#FF4500");
        hideTooltip();
      })
      .transition()
      .duration(800)
      .attr("y", (d: any) => y(d.y))
      .attr("height", (d: any) => height - y(d.y));
  };

  const drawLineChart = (
    g: any,
    data: any[],
    width: number,
    height: number,
  ) => {
    const x = d3
      .scalePoint()
      .domain(data.map((d) => String(d.x)))
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.y) as number])
      .nice()
      .range([height, 0]);

    const line = d3
      .line()
      .x((d: any) => x(String(d.x)) || 0)
      .y((d: any) => y(d.y))
      .curve(d3.curveMonotoneX);

    // X axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("fill", "#ffffff80");

    // Y axis
    g.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", "#ffffff80");

    // Line
    const path = g
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#FF4500")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Animate line
    const totalLength = path.node().getTotalLength();
    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(2000)
      .attr("stroke-dashoffset", 0);

    // Dots
    g.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d: any) => x(String(d.x)) || 0)
      .attr("cy", (d: any) => y(d.y))
      .attr("r", 0)
      .style("fill", "#FF4500")
      .on("mouseover", function (this: any, event: any, d: any) {
        d3.select(this).attr("r", 8);
        showTooltip(event, d);
      })
      .on("mouseout", function (this: any) {
        d3.select(this).attr("r", 5);
        hideTooltip();
      })
      .transition()
      .delay((d: any, i: number) => i * 100)
      .duration(500)
      .attr("r", 5);
  };

  const drawScatterPlot = (
    g: any,
    data: TrumpEntry[],
    width: number,
    height: number,
  ) => {
    const x = d3.scaleLinear().domain([0, 10]).range([0, width]);

    const y = d3.scaleLinear().domain([0, 10]).range([height, 0]);

    // X axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .append("text")
      .attr("x", width / 2)
      .attr("y", 40)
      .style("text-anchor", "middle")
      .style("fill", "#ffffff80")
      .text("Danger Score");

    // Y axis
    g.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("x", -height / 2)
      .style("text-anchor", "middle")
      .style("fill", "#ffffff80")
      .text("Absurdity Score");

    // Color scale
    const color = d3.scaleSequential(d3.interpolateRdYlGn).domain([10, 0]);

    // Dots
    g.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d: any) => x(d.danger_score))
      .attr("cy", (d: any) => y(d.absurdity_score))
      .attr("r", 0)
      .style("fill", (d: any) => color(d.insanity_score))
      .style("opacity", 0.7)
      .on("mouseover", function (this: any, event: any, d: any) {
        d3.select(this).attr("r", 10).style("opacity", 1);
        showTooltip(event, {
          x: d.title,
          y: `Danger: ${d.danger_score}, Absurdity: ${d.absurdity_score}, Insanity: ${d.insanity_score}`,
        });
      })
      .on("mouseout", function (this: any) {
        d3.select(this).attr("r", 6).style("opacity", 0.7);
        hideTooltip();
      })
      .transition()
      .duration(1000)
      .attr("r", 6);
  };

  const drawHeatmap = (
    g: any,
    data: TrumpEntry[],
    width: number,
    height: number,
  ) => {
    const categories = Array.from(new Set(data.map((d) => d.category))).sort();
    const phases = Array.from(new Set(data.map((d) => d.phase))).sort();

    const x = d3.scaleBand().domain(categories).range([0, width]).padding(0.05);

    const y = d3.scaleBand().domain(phases).range([0, height]).padding(0.05);

    // Calculate averages for each cell
    const heatmapData: any[] = [];
    categories.forEach((cat) => {
      phases.forEach((phase) => {
        const filtered = data.filter(
          (d) => d.category === cat && d.phase === phase,
        );
        if (filtered.length > 0) {
          const avg = d3.mean(filtered, (d) => (d as any)[yAxis] || 0) || 0;
          heatmapData.push({
            category: cat,
            phase: phase,
            value: avg,
            count: filtered.length,
          });
        }
      });
    });

    const color = d3
      .scaleSequential(d3.interpolateRdYlGn)
      .domain([d3.max(heatmapData, (d) => d.value) as number, 0]);

    // X axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("fill", "#ffffff80");

    // Y axis
    g.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", "#ffffff80");

    // Cells
    g.selectAll(".cell")
      .data(heatmapData)
      .enter()
      .append("rect")
      .attr("x", (d: any) => x(d.category) || 0)
      .attr("y", (d: any) => y(d.phase) || 0)
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", (d: any) => color(d.value))
      .style("opacity", 0)
      .on("mouseover", function (this: any, event: any, d: any) {
        d3.select(this).style("stroke", "#fff").style("stroke-width", 2);
        showTooltip(event, {
          x: `${d.category} / ${d.phase}`,
          y: `Avg: ${d.value.toFixed(2)} (${d.count} entries)`,
        });
      })
      .on("mouseout", function (this: any) {
        d3.select(this).style("stroke", "none");
        hideTooltip();
      })
      .transition()
      .duration(1000)
      .style("opacity", 1);
  };

  const showTooltip = (event: any, data: any) => {
    if (!tooltipRef.current) return;

    const tooltip = d3.select(tooltipRef.current);
    tooltip
      .style("opacity", 1)
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY - 28 + "px").html(`
        <div class="bg-black/90 text-white p-2 rounded text-sm">
          <div class="font-bold">${data.x}</div>
          <div>${typeof data.y === "number" ? data.y.toFixed(2) : data.y}</div>
        </div>
      `);
  };

  const hideTooltip = () => {
    if (!tooltipRef.current) return;
    d3.select(tooltipRef.current).style("opacity", 0);
  };

  const getYAxisLabel = () => {
    const labels: Record<YAxis, string> = {
      danger_score: "Danger Score",
      lawlessness_score: "Lawlessness Score",
      insanity_score: "Insanity Score",
      absurdity_score: "Absurdity Score",
      financial_cost: "Financial Cost ($)",
      count: "Number of Entries",
    };
    return labels[yAxis];
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8" data-oid="z05tgdk">
        <div className="animate-pulse space-y-4" data-oid="3:uqn4l">
          <div className="h-8 bg-white/10 rounded w-1/3" data-oid="nvdw4jm" />
          <div className="h-96 bg-white/10 rounded" data-oid="e19m9qm" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen golden-p-5" data-oid="rhp6gmh">
      <div className="container mx-auto px-4 max-w-7xl" data-oid="7cslx_5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
          data-oid="r9.zhhj"
        >
          <TrumpFilesHeading
            as="h1"
            className="text-4xl font-bold mb-2"
            data-oid="aw2_56j"
          >
            Data Visualizer
          </TrumpFilesHeading>
          <p className="text-foreground/70" data-oid="7s10-ct">
            Create custom charts to discover patterns and relationships in the
            data
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8" data-oid="ky-b51z">
          {/* Controls */}
          <div className="lg:col-span-1" data-oid="t2-nj.-">
            <Card
              className="glass-card border-white/10 sticky top-20"
              data-oid="-:k3skf"
            >
              <CardHeader data-oid="d5:9-ab">
                <CardTitle data-oid="dd_vu.v">Chart Builder</CardTitle>
                <CardDescription data-oid="pjk23c8">
                  Customize your visualization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4" data-oid="kpgd:5x">
                <div className="space-y-2" data-oid="wrr81q2">
                  <label className="text-sm font-medium" data-oid="kn7r7w-">
                    Chart Type
                  </label>
                  <Tabs
                    value={chartType}
                    onValueChange={(v) => setChartType(v as ChartType)}
                    data-oid="yzdbwd-"
                  >
                    <TabsList
                      className="grid w-full grid-cols-2 bg-white/5"
                      data-oid="k0n6m:5"
                    >
                      <TabsTrigger value="bar" data-oid="4zpzsuu">
                        Bar
                      </TabsTrigger>
                      <TabsTrigger value="line" data-oid="75pl-0m">
                        Line
                      </TabsTrigger>
                    </TabsList>
                    <TabsList
                      className="grid w-full grid-cols-2 bg-white/5 mt-2"
                      data-oid="eqp.l66"
                    >
                      <TabsTrigger value="scatter" data-oid="_g1_n8y">
                        Scatter
                      </TabsTrigger>
                      <TabsTrigger value="heatmap" data-oid="m-ll59y">
                        Heat
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {chartType !== "scatter" && (
                  <>
                    <div className="space-y-2" data-oid="dc7sjoc">
                      <label className="text-sm font-medium" data-oid="gjw6wkd">
                        Y-Axis (Metric)
                      </label>
                      <Select
                        value={yAxis}
                        onValueChange={(v) => setYAxis(v as YAxis)}
                        data-oid="ew74vga"
                      >
                        <SelectTrigger
                          className="bg-white/5 border-white/10"
                          data-oid="b:..hr8"
                        >
                          <SelectValue data-oid="n7ybw1f" />
                        </SelectTrigger>
                        <SelectContent data-oid="rnk:u:z">
                          <SelectItem value="count" data-oid="j9b-lw-">
                            Entry Count
                          </SelectItem>
                          <SelectItem value="danger_score" data-oid="6_j8kwx">
                            Danger Score
                          </SelectItem>
                          <SelectItem
                            value="lawlessness_score"
                            data-oid="-b5po0z"
                          >
                            Lawlessness Score
                          </SelectItem>
                          <SelectItem value="insanity_score" data-oid="oykru__">
                            Insanity Score
                          </SelectItem>
                          <SelectItem
                            value="absurdity_score"
                            data-oid="c87tvgh"
                          >
                            Absurdity Score
                          </SelectItem>
                          <SelectItem value="financial_cost" data-oid="p1kkeu4">
                            Financial Cost
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {chartType !== "heatmap" && (
                      <div className="space-y-2" data-oid="bxkvhnu">
                        <label
                          className="text-sm font-medium"
                          data-oid="d4asv8l"
                        >
                          X-Axis (Group By)
                        </label>
                        <Select
                          value={xAxis}
                          onValueChange={(v) => setXAxis(v as XAxis)}
                          data-oid="wtn4wzf"
                        >
                          <SelectTrigger
                            className="bg-white/5 border-white/10"
                            data-oid="hnoa0ke"
                          >
                            <SelectValue data-oid="ch_ufeh" />
                          </SelectTrigger>
                          <SelectContent data-oid="f5o8g2j">
                            <SelectItem value="timeline" data-oid="aklgv14">
                              Timeline
                            </SelectItem>
                            <SelectItem value="category" data-oid="olrwbsc">
                              Category
                            </SelectItem>
                            <SelectItem value="phase" data-oid="f_n_ijv">
                              Phase
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </>
                )}

                <Separator className="bg-white/10" data-oid="h0ek5nx" />

                <div className="space-y-2" data-oid="dtbz6fy">
                  <p className="text-xs text-foreground/50" data-oid="-3x55o1">
                    Data Points
                  </p>
                  <p
                    className="text-2xl font-bold text-primary"
                    data-oid="suhvv41"
                  >
                    {entries.length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <div className="lg:col-span-3" data-oid=".8kmx28">
            <Card className="glass-card border-white/10" data-oid="meh44e0">
              <CardHeader data-oid="p1sb43y">
                <CardTitle data-oid="08ezylv">Visualization</CardTitle>
                <CardDescription data-oid="9rj8tld">
                  Hover over data points for detailed information
                </CardDescription>
              </CardHeader>
              <CardContent data-oid="km23nvv">
                <div className="relative overflow-x-auto" data-oid="sjosmq7">
                  <svg ref={svgRef} data-oid="cye.z3s"></svg>
                  <div
                    ref={tooltipRef}
                    className="absolute pointer-events-none opacity-0 transition-opacity duration-200"
                    data-oid="8t8k:05"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            <Card
              className="glass-card border-white/10 mt-8"
              data-oid="h1z4pq:"
            >
              <CardHeader data-oid="8y18d2u">
                <CardTitle
                  className="flex items-center gap-2"
                  data-oid="4y07m_l"
                >
                  <TrendingUp
                    className="h-5 w-5 text-primary"
                    data-oid="jf22lp9"
                  />
                  Quick Insights
                </CardTitle>
              </CardHeader>
              <CardContent data-oid="onn7r8.">
                <div className="grid md:grid-cols-3 gap-4" data-oid="zsp9g40">
                  <div className="space-y-1" data-oid="c9kn_br">
                    <p
                      className="text-sm text-foreground/70"
                      data-oid="fagp36d"
                    >
                      Highest Danger Score
                    </p>
                    <p className="text-xl font-bold" data-oid="-_5ggd.">
                      {d3.max(entries, (d) => d.danger_score)}
                    </p>
                  </div>
                  <div className="space-y-1" data-oid="lna_yh9">
                    <p
                      className="text-sm text-foreground/70"
                      data-oid="woh5mrr"
                    >
                      Total Financial Cost
                    </p>
                    <p className="text-xl font-bold" data-oid="aii1cx3">
                      $
                      {d3
                        .sum(entries, (d) => d.financial_cost || 0)
                        .toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1" data-oid="xg-3s8f">
                    <p
                      className="text-sm text-foreground/70"
                      data-oid=":bbk329"
                    >
                      Most Common Category
                    </p>
                    <p className="text-xl font-bold" data-oid="t334cy0">
                      {(() => {
                        const counts = d3.rollup(
                          entries,
                          (v) => v.length,
                          (d) => d.category,
                        );
                        const maxEntry = Array.from(counts.entries()).reduce(
                          (a, b) => (a[1] > b[1] ? a : b),
                        );
                        return maxEntry[0];
                      })()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
