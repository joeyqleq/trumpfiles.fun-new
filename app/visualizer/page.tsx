'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import * as d3 from 'd3'
import { supabase } from '@/lib/supabase'
import { TrumpEntry } from '@/types/database'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { BarChart3, LineChart, PieChart, TrendingUp } from 'lucide-react'

type ChartType = 'bar' | 'line' | 'scatter' | 'heatmap'
type YAxis = 'danger_score' | 'lawlessness_score' | 'insanity_score' | 'absurdity_score' | 'financial_cost' | 'count'
type XAxis = 'timeline' | 'category' | 'phase'

export default function VisualizerPage() {
  const [entries, setEntries] = useState<TrumpEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [chartType, setChartType] = useState<ChartType>('bar')
  const [yAxis, setYAxis] = useState<YAxis>('danger_score')
  const [xAxis, setXAxis] = useState<XAxis>('category')
  
  const svgRef = useRef<SVGSVGElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchEntries()
  }, [])

  useEffect(() => {
    if (entries.length > 0) {
      drawChart()
    }
  }, [entries, chartType, yAxis, xAxis])

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('trump_entries')
        .select('*')
        .order('date_occurred', { ascending: true })

      if (error) throw error
      setEntries(data || [])
    } catch (error) {
      console.error('Error fetching entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const prepareData = () => {
    if (xAxis === 'timeline') {
      // Group by year
      const grouped = d3.group(entries, d => {
        const date = d.date_occurred ? new Date(d.date_occurred) : null
        return date ? date.getFullYear() : 'Unknown'
      })
      
      return Array.from(grouped, ([key, values]) => {
        const aggregated = yAxis === 'count' 
          ? values.length
          : d3.mean(values, d => (d as any)[yAxis] || 0) || 0
        return { x: key, y: aggregated, values }
      }).sort((a, b) => {
        if (a.x === 'Unknown') return 1
        if (b.x === 'Unknown') return -1
        return Number(a.x) - Number(b.x)
      })
    } else if (xAxis === 'category') {
      const grouped = d3.group(entries, d => d.category)
      return Array.from(grouped, ([key, values]) => {
        const aggregated = yAxis === 'count'
          ? values.length
          : d3.mean(values, d => (d as any)[yAxis] || 0) || 0
        return { x: key, y: aggregated, values }
      })
    } else { // phase
      const grouped = d3.group(entries, d => d.phase)
      return Array.from(grouped, ([key, values]) => {
        const aggregated = yAxis === 'count'
          ? values.length
          : d3.mean(values, d => (d as any)[yAxis] || 0) || 0
        return { x: key, y: aggregated, values }
      })
    }
  }

  const drawChart = () => {
    if (!svgRef.current) return
    
    const data = prepareData()
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 20, right: 30, bottom: 60, left: 70 }
    const width = 800 - margin.left - margin.right
    const height = 500 - margin.top - margin.bottom

    const g = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    if (chartType === 'bar') {
      drawBarChart(g, data, width, height)
    } else if (chartType === 'line') {
      drawLineChart(g, data, width, height)
    } else if (chartType === 'scatter') {
      drawScatterPlot(g, entries, width, height)
    } else if (chartType === 'heatmap') {
      drawHeatmap(g, entries, width, height)
    }
  }

  const drawBarChart = (g: any, data: any[], width: number, height: number) => {
    const margin = { left: 70 }
    const x = d3.scaleBand()
      .domain(data.map(d => String(d.x)))
      .range([0, width])
      .padding(0.1)

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.y) as number])
      .nice()
      .range([height, 0])

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('fill', '#ffffff80')

    // Y axis
    g.append('g')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('fill', '#ffffff80')

    // Y axis label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('fill', '#ffffff80')
      .text(getYAxisLabel())

    // Bars with animation
    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (d: any) => x(String(d.x)) || 0)
      .attr('width', x.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .style('fill', '#FF4500')
      .on('mouseover', function(this: any, event: any, d: any) {
        d3.select(this).style('fill', '#FF6500')
        showTooltip(event, d)
      })
      .on('mouseout', function(this: any) {
        d3.select(this).style('fill', '#FF4500')
        hideTooltip()
      })
      .transition()
      .duration(800)
      .attr('y', (d: any) => y(d.y))
      .attr('height', (d: any) => height - y(d.y))
  }

  const drawLineChart = (g: any, data: any[], width: number, height: number) => {
    const x = d3.scalePoint()
      .domain(data.map(d => String(d.x)))
      .range([0, width])

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.y) as number])
      .nice()
      .range([height, 0])

    const line = d3.line()
      .x((d: any) => x(String(d.x)) || 0)
      .y((d: any) => y(d.y))
      .curve(d3.curveMonotoneX)

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('fill', '#ffffff80')

    // Y axis
    g.append('g')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('fill', '#ffffff80')

    // Line
    const path = g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#FF4500')
      .attr('stroke-width', 2)
      .attr('d', line)

    // Animate line
    const totalLength = path.node().getTotalLength()
    path
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(2000)
      .attr('stroke-dashoffset', 0)

    // Dots
    g.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', (d: any) => x(String(d.x)) || 0)
      .attr('cy', (d: any) => y(d.y))
      .attr('r', 0)
      .style('fill', '#FF4500')
      .on('mouseover', function(this: any, event: any, d: any) {
        d3.select(this).attr('r', 8)
        showTooltip(event, d)
      })
      .on('mouseout', function(this: any) {
        d3.select(this).attr('r', 5)
        hideTooltip()
      })
      .transition()
      .delay((d: any, i: number) => i * 100)
      .duration(500)
      .attr('r', 5)
  }

  const drawScatterPlot = (g: any, data: TrumpEntry[], width: number, height: number) => {
    const x = d3.scaleLinear()
      .domain([0, 10])
      .range([0, width])

    const y = d3.scaleLinear()
      .domain([0, 10])
      .range([height, 0])

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .append('text')
      .attr('x', width / 2)
      .attr('y', 40)
      .style('text-anchor', 'middle')
      .style('fill', '#ffffff80')
      .text('Danger Score')

    // Y axis
    g.append('g')
      .call(d3.axisLeft(y))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -50)
      .attr('x', -height / 2)
      .style('text-anchor', 'middle')
      .style('fill', '#ffffff80')
      .text('Absurdity Score')

    // Color scale
    const color = d3.scaleSequential(d3.interpolateRdYlGn)
      .domain([10, 0])

    // Dots
    g.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .attr('cx', (d: any) => x(d.danger_score))
      .attr('cy', (d: any) => y(d.absurdity_score))
      .attr('r', 0)
      .style('fill', (d: any) => color(d.insanity_score))
      .style('opacity', 0.7)
      .on('mouseover', function(this: any, event: any, d: any) {
        d3.select(this).attr('r', 10).style('opacity', 1)
        showTooltip(event, {
          x: d.title,
          y: `Danger: ${d.danger_score}, Absurdity: ${d.absurdity_score}, Insanity: ${d.insanity_score}`
        })
      })
      .on('mouseout', function(this: any) {
        d3.select(this).attr('r', 6).style('opacity', 0.7)
        hideTooltip()
      })
      .transition()
      .duration(1000)
      .attr('r', 6)
  }

  const drawHeatmap = (g: any, data: TrumpEntry[], width: number, height: number) => {
    const categories = Array.from(new Set(data.map(d => d.category))).sort()
    const phases = Array.from(new Set(data.map(d => d.phase))).sort()
    
    const x = d3.scaleBand()
      .domain(categories)
      .range([0, width])
      .padding(0.05)

    const y = d3.scaleBand()
      .domain(phases)
      .range([0, height])
      .padding(0.05)

    // Calculate averages for each cell
    const heatmapData: any[] = []
    categories.forEach(cat => {
      phases.forEach(phase => {
        const filtered = data.filter(d => d.category === cat && d.phase === phase)
        if (filtered.length > 0) {
          const avg = d3.mean(filtered, d => (d as any)[yAxis] || 0) || 0
          heatmapData.push({
            category: cat,
            phase: phase,
            value: avg,
            count: filtered.length
          })
        }
      })
    })

    const color = d3.scaleSequential(d3.interpolateRdYlGn)
      .domain([d3.max(heatmapData, d => d.value) as number, 0])

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('fill', '#ffffff80')

    // Y axis
    g.append('g')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('fill', '#ffffff80')

    // Cells
    g.selectAll('.cell')
      .data(heatmapData)
      .enter().append('rect')
      .attr('x', (d: any) => x(d.category) || 0)
      .attr('y', (d: any) => y(d.phase) || 0)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .style('fill', (d: any) => color(d.value))
      .style('opacity', 0)
      .on('mouseover', function(this: any, event: any, d: any) {
        d3.select(this).style('stroke', '#fff').style('stroke-width', 2)
        showTooltip(event, {
          x: `${d.category} / ${d.phase}`,
          y: `Avg: ${d.value.toFixed(2)} (${d.count} entries)`
        })
      })
      .on('mouseout', function(this: any) {
        d3.select(this).style('stroke', 'none')
        hideTooltip()
      })
      .transition()
      .duration(1000)
      .style('opacity', 1)
  }

  const showTooltip = (event: any, data: any) => {
    if (!tooltipRef.current) return
    
    const tooltip = d3.select(tooltipRef.current)
    tooltip
      .style('opacity', 1)
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 28) + 'px')
      .html(`
        <div class="bg-black/90 text-white p-2 rounded text-sm">
          <div class="font-bold">${data.x}</div>
          <div>${typeof data.y === 'number' ? data.y.toFixed(2) : data.y}</div>
        </div>
      `)
  }

  const hideTooltip = () => {
    if (!tooltipRef.current) return
    d3.select(tooltipRef.current).style('opacity', 0)
  }

  const getYAxisLabel = () => {
    const labels: Record<YAxis, string> = {
      danger_score: 'Danger Score',
      lawlessness_score: 'Lawlessness Score',
      insanity_score: 'Insanity Score',
      absurdity_score: 'Absurdity Score',
      financial_cost: 'Financial Cost ($)',
      count: 'Number of Entries'
    }
    return labels[yAxis]
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/10 rounded w-1/3" />
          <div className="h-96 bg-white/10 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen golden-p-5">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Data Visualizer</h1>
          <p className="text-foreground/70">
            Create custom charts to discover patterns and relationships in the data
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1">
            <Card className="glass-card border-white/10 sticky top-20">
              <CardHeader>
                <CardTitle>Chart Builder</CardTitle>
                <CardDescription>
                  Customize your visualization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Chart Type</label>
                  <Tabs value={chartType} onValueChange={(v) => setChartType(v as ChartType)}>
                    <TabsList className="grid w-full grid-cols-2 bg-white/5">
                      <TabsTrigger value="bar">Bar</TabsTrigger>
                      <TabsTrigger value="line">Line</TabsTrigger>
                    </TabsList>
                    <TabsList className="grid w-full grid-cols-2 bg-white/5 mt-2">
                      <TabsTrigger value="scatter">Scatter</TabsTrigger>
                      <TabsTrigger value="heatmap">Heat</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {chartType !== 'scatter' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Y-Axis (Metric)</label>
                      <Select value={yAxis} onValueChange={(v) => setYAxis(v as YAxis)}>
                        <SelectTrigger className="bg-white/5 border-white/10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="count">Entry Count</SelectItem>
                          <SelectItem value="danger_score">Danger Score</SelectItem>
                          <SelectItem value="lawlessness_score">Lawlessness Score</SelectItem>
                          <SelectItem value="insanity_score">Insanity Score</SelectItem>
                          <SelectItem value="absurdity_score">Absurdity Score</SelectItem>
                          <SelectItem value="financial_cost">Financial Cost</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {chartType !== 'heatmap' && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">X-Axis (Group By)</label>
                        <Select value={xAxis} onValueChange={(v) => setXAxis(v as XAxis)}>
                          <SelectTrigger className="bg-white/5 border-white/10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="timeline">Timeline</SelectItem>
                            <SelectItem value="category">Category</SelectItem>
                            <SelectItem value="phase">Phase</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </>
                )}

                <Separator className="bg-white/10" />

                <div className="space-y-2">
                  <p className="text-xs text-foreground/50">Data Points</p>
                  <p className="text-2xl font-bold text-primary">{entries.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <div className="lg:col-span-3">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle>Visualization</CardTitle>
                <CardDescription>
                  Hover over data points for detailed information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto">
                  <svg ref={svgRef}></svg>
                  <div 
                    ref={tooltipRef}
                    className="absolute pointer-events-none opacity-0 transition-opacity duration-200"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            <Card className="glass-card border-white/10 mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Quick Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-foreground/70">Highest Danger Score</p>
                    <p className="text-xl font-bold">
                      {d3.max(entries, d => d.danger_score)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-foreground/70">Total Financial Cost</p>
                    <p className="text-xl font-bold">
                      ${d3.sum(entries, d => d.financial_cost || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-foreground/70">Most Common Category</p>
                    <p className="text-xl font-bold">
                      {(() => {
                        const counts = d3.rollup(entries, v => v.length, d => d.category)
                        const maxEntry = Array.from(counts.entries()).reduce((a, b) => a[1] > b[1] ? a : b)
                        return maxEntry[0]
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
  )
}