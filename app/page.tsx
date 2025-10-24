'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Database, BarChart3, Shield, Zap } from 'lucide-react'

// Dynamically import 3D component to avoid SSR issues
const OrangeHero = dynamic(() => import('@/components/OrangeHero'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] flex items-center justify-center">
      <div className="animate-pulse text-2xl text-primary">Loading 3D Model...</div>
    </div>
  ),
})

const features = [
  {
    icon: Database,
    title: '377+ Documented Entries',
    description: 'Meticulously structured data with sources, scores, and fact-checks.',
  },
  {
    icon: BarChart3,
    title: 'Interactive Visualizations',
    description: 'Discover patterns and relationships with D3.js-powered charts.',
  },
  {
    icon: Shield,
    title: 'Fact-Checked',
    description: 'Every entry includes rigorous fact-checking and source verification.',
  },
  {
    icon: Zap,
    title: 'Real-time Analysis',
    description: 'Thermal scoring system for danger, lawlessness, and absurdity metrics.',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden golden-p-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <Badge className="bg-primary/20 text-primary border-primary/30">
                The Definitive Data-Driven Encyclopedia
              </Badge>
              <h1 className="text-5xl lg:text-7xl font-bold">
                The <span className="text-primary">Trump</span> Files
              </h1>
              <p className="text-xl text-foreground/80 leading-relaxed">
                An analytical tool cataloging over 377 documented entries with 
                meticulously structured data, thermal scoring, and comprehensive 
                fact-checking. Explore patterns, discover relationships, and 
                understand the data.
              </p>
              <div className="flex gap-4 pt-4">
                <Button asChild size="lg" className="group">
                  <Link href="/catalog">
                    Explore Catalog
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/visualizer">Data Visualizer</Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <OrangeHero />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="golden-p-8 border-t border-white/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Professional Data Analysis Platform
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Built with cutting-edge technology to deliver comprehensive insights 
              through interactive exploration and visualization.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="glass-card border-white/10 p-6 h-full hover:border-primary/30 transition-all duration-300">
                  <feature.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-foreground/70">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="golden-p-8 border-t border-white/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="glass-card border-white/10 rounded-2xl p-12 text-center"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Explore the Data?
            </h2>
            <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
              Dive into the comprehensive catalog with advanced filtering, 
              thermal scoring visualizations, and fact-checked information.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg" className="group">
                <Link href="/catalog">
                  Start Exploring
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/visualizer">View Analytics</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
