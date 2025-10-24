'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { TrumpEntry, UserComment, UserScore, AggregatedUserScore } from '@/types/database'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Calendar, DollarSign, Hash, MessageSquare, BarChart, CheckCircle } from 'lucide-react'

export default function EntryPage() {
  const params = useParams()
  const entryNumber = parseInt(params.entry_number as string)
  
  const [entry, setEntry] = useState<TrumpEntry | null>(null)
  const [comments, setComments] = useState<UserComment[]>([])
  const [userScore, setUserScore] = useState<AggregatedUserScore | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [scoreSubmitted, setScoreSubmitted] = useState(false)
  
  // Form states
  const [commentForm, setCommentForm] = useState({ name: '', email: '', comment: '' })
  const [scores, setScores] = useState({
    danger: 5,
    lawlessness: 5,
    insanity: 5,
    absurdity: 5,
    social_media: 5,
    media_attention: 5,
  })

  useEffect(() => {
    fetchData()
  }, [entryNumber])

  const fetchData = async () => {
    try {
      // Fetch entry
      const { data: entryData, error: entryError } = await supabase
        .from('trump_entries')
        .select('*')
        .eq('entry_number', entryNumber)
        .single() as { data: TrumpEntry | null; error: any }

      if (entryError || !entryData) {
        console.error('Error fetching entry:', entryError)
        return
      }
      
      setEntry(entryData)

      // Fetch approved comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('user_comments')
        .select('*')
        .eq('entry_id', entryData.id)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })

      if (!commentsError) setComments(commentsData || [])

      // Fetch aggregated user scores
      const { data: scoresData, error: scoresError } = await supabase
        .from('user_scores')
        .select('*')
        .eq('entry_id', entryData.id)

      if (!scoresError && scoresData && scoresData.length > 0) {
        const aggregated: AggregatedUserScore = {
          entry_id: entryData.id,
          avg_danger_score: 0,
          avg_lawlessness_score: 0,
          avg_insanity_score: 0,
          avg_absurdity_score: 0,
          avg_social_media_score: 0,
          avg_media_attention_score: 0,
          total_votes: scoresData.length,
        }

        scoresData.forEach((score: UserScore) => {
          aggregated.avg_danger_score += score.danger_score
          aggregated.avg_lawlessness_score += score.lawlessness_score
          aggregated.avg_insanity_score += score.insanity_score
          aggregated.avg_absurdity_score += score.absurdity_score
          aggregated.avg_social_media_score += score.social_media_score
          aggregated.avg_media_attention_score += score.media_attention_score
        })

        Object.keys(aggregated).forEach(key => {
          if (key.startsWith('avg_')) {
            (aggregated as any)[key] = (aggregated as any)[key] / scoresData.length
          }
        })

        setUserScore(aggregated)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!entry) return
    
    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('user_comments')
        .insert({
          entry_id: entry.id,
          user_name: commentForm.name,
          user_email: commentForm.email,
          comment_text: commentForm.comment,
          is_approved: false,
        } as any)

      if (error) throw error
      
      alert('Comment submitted for review!')
      setCommentForm({ name: '', email: '', comment: '' })
    } catch (error) {
      console.error('Error submitting comment:', error)
      alert('Failed to submit comment')
    } finally {
      setSubmitting(false)
    }
  }

  const submitScores = async () => {
    if (!entry) return
    
    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('user_scores')
        .insert({
          entry_id: entry.id,
          danger_score: scores.danger,
          lawlessness_score: scores.lawlessness,
          insanity_score: scores.insanity,
          absurdity_score: scores.absurdity,
          social_media_score: scores.social_media,
          media_attention_score: scores.media_attention,
        } as any)

      if (error) throw error
      
      setScoreSubmitted(true)
      setTimeout(() => setScoreSubmitted(false), 3000)
      fetchData() // Refresh scores
    } catch (error) {
      console.error('Error submitting scores:', error)
      alert('Failed to submit scores')
    } finally {
      setSubmitting(false)
    }
  }

  const getThermalColor = (score: number) => {
    if (score <= 3) return 'bg-green-500'
    if (score <= 6) return 'bg-yellow-500'
    if (score <= 8) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const ScoreDisplay = ({ label, analystScore, userAvg }: { label: string; analystScore: number; userAvg?: number }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-foreground/70">{label}</span>
        <div className="flex gap-4">
          <span className="font-mono">Analyst: {analystScore}/10</span>
          {userAvg !== undefined && (
            <span className="font-mono text-accent">Users: {userAvg.toFixed(1)}/10</span>
          )}
        </div>
      </div>
      <div className="space-y-1">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${getThermalColor(analystScore)}`}
            style={{ width: `${analystScore * 10}%` }}
          />
        </div>
        {userAvg !== undefined && (
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${getThermalColor(userAvg)}`}
              style={{ width: `${userAvg * 10}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/10 rounded w-1/3" />
          <div className="h-4 bg-white/10 rounded w-2/3" />
          <div className="h-64 bg-white/10 rounded" />
        </div>
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Entry not found</h1>
        <Button asChild>
          <Link href="/catalog">Back to Catalog</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen golden-p-5">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/catalog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Catalog
            </Link>
          </Button>
          
          <div className="flex items-start justify-between mb-4">
            <div>
              <Badge className="bg-primary/20 text-primary border-primary/30 mb-2">
                Entry #{entry.entry_number}
              </Badge>
              <h1 className="text-4xl font-bold mb-2">{entry.title}</h1>
              <div className="flex gap-4 text-sm text-foreground/70">
                {entry.date_occurred && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(entry.date_occurred).toLocaleDateString()}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Hash className="h-4 w-4" />
                  {entry.category}
                </span>
                {entry.financial_cost && (
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    ${entry.financial_cost.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Synopsis */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle>Synopsis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 leading-relaxed">{entry.synopsis}</p>
                {entry.keywords.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {entry.keywords.map(keyword => (
                      <Badge key={keyword} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Fact Check */}
            {entry.fact_check && (
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-yellow-500">Fact Check</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 leading-relaxed">{entry.fact_check}</p>
                </CardContent>
              </Card>
            )}

            {/* Scores */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle>Thermal Scoring Analysis</CardTitle>
                <CardDescription>
                  Analyst scores vs. Average user scores {userScore && `(${userScore.total_votes} votes)`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScoreDisplay 
                  label="Danger Score" 
                  analystScore={entry.danger_score}
                  userAvg={userScore?.avg_danger_score}
                />
                <ScoreDisplay 
                  label="Lawlessness Score" 
                  analystScore={entry.lawlessness_score}
                  userAvg={userScore?.avg_lawlessness_score}
                />
                <ScoreDisplay 
                  label="Insanity Score" 
                  analystScore={entry.insanity_score}
                  userAvg={userScore?.avg_insanity_score}
                />
                <ScoreDisplay 
                  label="Absurdity Score" 
                  analystScore={entry.absurdity_score}
                  userAvg={userScore?.avg_absurdity_score}
                />
                <ScoreDisplay 
                  label="Social Media Score" 
                  analystScore={entry.social_media_score}
                  userAvg={userScore?.avg_social_media_score}
                />
                <ScoreDisplay 
                  label="Media Attention Score" 
                  analystScore={entry.media_attention_score}
                  userAvg={userScore?.avg_media_attention_score}
                />
              </CardContent>
            </Card>

            {/* Comments */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Comments ({comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="p-4 bg-white/5 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{comment.user_name}</span>
                        <span className="text-xs text-foreground/50">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-foreground/80">{comment.comment_text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-foreground/50">No comments yet. Be the first to comment!</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* User Scoring */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Rate This Entry
                </CardTitle>
                <CardDescription>
                  Use the sliders to score each metric
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {scoreSubmitted && (
                  <Alert className="bg-green-500/10 border-green-500/50">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-500">
                      Scores submitted successfully!
                    </AlertDescription>
                  </Alert>
                )}
                
                {Object.entries(scores).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <Label className="capitalize">{key.replace('_', ' ')}</Label>
                      <span className="font-mono">{value}/10</span>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={([newValue]) => 
                        setScores(prev => ({ ...prev, [key]: newValue }))
                      }
                      min={1}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                  </div>
                ))}
                
                <Button 
                  onClick={submitScores} 
                  className="w-full"
                  disabled={submitting}
                >
                  Submit Scores
                </Button>
              </CardContent>
            </Card>

            {/* Comment Form */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle>Leave a Comment</CardTitle>
                <CardDescription>
                  Comments are reviewed before publication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={submitComment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={commentForm.name}
                      onChange={(e) => setCommentForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={commentForm.email}
                      onChange={(e) => setCommentForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comment">Comment</Label>
                    <Textarea
                      id="comment"
                      value={commentForm.comment}
                      onChange={(e) => setCommentForm(prev => ({ ...prev, comment: e.target.value }))}
                      required
                      rows={4}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    Submit Comment
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}