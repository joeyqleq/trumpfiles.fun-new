'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { TrumpEntry } from '@/types/database'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Upload, 
  Database, 
  CheckCircle, 
  AlertTriangle, 
  FileJson,
  Users,
  MessageSquare,
  TrendingUp
} from 'lucide-react'

interface JsonValidationError {
  field: string
  message: string
  line?: number
}

export default function AdminPage() {
  const { isLoaded, isSignedIn } = useAuth()
  const [entries, setEntries] = useState<TrumpEntry[]>([])
  const [stats, setStats] = useState({
    totalEntries: 0,
    totalComments: 0,
    totalScores: 0,
    avgDanger: 0,
  })
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{
    success: boolean
    message: string
    errors?: JsonValidationError[]
  } | null>(null)
  const [jsonFile, setJsonFile] = useState<File | null>(null)
  const [jsonContent, setJsonContent] = useState<string>('')
  const [validationErrors, setValidationErrors] = useState<JsonValidationError[]>([])

  useEffect(() => {
    if (isSignedIn) {
      fetchData()
    }
  }, [isSignedIn])

  const fetchData = async () => {
    try {
      // Fetch entries
      const { data: entriesData, error: entriesError } = await supabase
        .from('trump_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      if (!entriesError) setEntries(entriesData || [])

      // Fetch stats
      const { count: entryCount } = await supabase
        .from('trump_entries')
        .select('*', { count: 'exact', head: true })

      const { count: commentCount } = await supabase
        .from('user_comments')
        .select('*', { count: 'exact', head: true })

      const { count: scoreCount } = await supabase
        .from('user_scores')
        .select('*', { count: 'exact', head: true })

      const { data: avgData } = await supabase
        .from('trump_entries')
        .select('danger_score')

      const avgDanger = avgData 
        ? avgData.reduce((acc, entry: any) => acc + entry.danger_score, 0) / avgData.length
        : 0

      setStats({
        totalEntries: entryCount || 0,
        totalComments: commentCount || 0,
        totalScores: scoreCount || 0,
        avgDanger: avgDanger,
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setJsonFile(file)
    const text = await file.text()
    setJsonContent(text)
    validateJson(text)
  }

  const validateJson = (content: string) => {
    const errors: JsonValidationError[] = []
    
    try {
      const data = JSON.parse(content)
      
      if (!Array.isArray(data)) {
        errors.push({
          field: 'root',
          message: 'JSON must be an array of entries'
        })
        setValidationErrors(errors)
        return
      }

      data.forEach((entry, index) => {
        // Required fields
        const requiredFields = [
          'entry_number', 'title', 'phase', 'category', 'synopsis',
          'danger_score', 'lawlessness_score', 'insanity_score',
          'absurdity_score', 'social_media_score', 'media_attention_score'
        ]

        requiredFields.forEach(field => {
          if (!(field in entry)) {
            errors.push({
              field: field,
              message: `Missing required field "${field}"`,
              line: index + 1
            })
          }
        })

        // Type checks
        const scoreFields = [
          'danger_score', 'lawlessness_score', 'insanity_score',
          'absurdity_score', 'social_media_score', 'media_attention_score'
        ]

        scoreFields.forEach(field => {
          if (field in entry && (typeof entry[field] !== 'number' || entry[field] < 0 || entry[field] > 10)) {
            errors.push({
              field: field,
              message: `${field} must be a number between 0 and 10`,
              line: index + 1
            })
          }
        })

        // Check for duplicate entry numbers
        const entryNumbers = data.map(e => e.entry_number)
        const duplicates = entryNumbers.filter((item, index) => entryNumbers.indexOf(item) !== index)
        if (duplicates.length > 0) {
          errors.push({
            field: 'entry_number',
            message: `Duplicate entry numbers found: ${duplicates.join(', ')}`
          })
        }
      })

    } catch (e) {
      errors.push({
        field: 'json',
        message: 'Invalid JSON format'
      })
    }

    setValidationErrors(errors)
  }

  const handleUpload = async () => {
    if (!jsonContent || validationErrors.length > 0) {
      setUploadResult({
        success: false,
        message: 'Please fix validation errors before uploading',
        errors: validationErrors
      })
      return
    }

    setUploading(true)
    try {
      const data = JSON.parse(jsonContent)
      
      // Insert entries one by one to handle conflicts
      const results = await Promise.allSettled(
        data.map(async (entry: any) => {
          // Remove id if it exists
          const { id, ...entryData } = entry
          
          // Ensure keywords is an array
          if (!entryData.keywords) {
            entryData.keywords = []
          }

          const { error } = await supabase
            .from('trump_entries')
            .upsert(entryData, {
              onConflict: 'entry_number'
            })

          if (error) throw error
          return entryData.entry_number
        })
      )

      const successful = results.filter(r => r.status === 'fulfilled').length
      const failed = results.filter(r => r.status === 'rejected').length

      setUploadResult({
        success: failed === 0,
        message: `Successfully uploaded ${successful} entries${failed > 0 ? `, ${failed} failed` : ''}`,
      })

      // Refresh data
      fetchData()
    } catch (error) {
      console.error('Upload error:', error)
      setUploadResult({
        success: false,
        message: 'Failed to upload entries',
      })
    } finally {
      setUploading(false)
    }
  }

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="glass-card border-white/10 p-8">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to access the admin panel
            </CardDescription>
          </CardHeader>
        </Card>
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
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-foreground/70">
            Manage Trump Files data and monitor system analytics
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-3">
              <CardDescription>Total Entries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Database className="h-8 w-8 text-primary" />
                <span className="text-3xl font-bold">{stats.totalEntries}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader className="pb-3">
              <CardDescription>User Comments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-8 w-8 text-accent" />
                <span className="text-3xl font-bold">{stats.totalComments}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader className="pb-3">
              <CardDescription>User Scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-8 w-8 text-blue-500" />
                <span className="text-3xl font-bold">{stats.totalScores}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader className="pb-3">
              <CardDescription>Avg Danger Score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-orange-500" />
                <span className="text-3xl font-bold">{stats.avgDanger.toFixed(1)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="upload" className="space-y-4">
          <TabsList className="bg-white/5">
            <TabsTrigger value="upload">JSON Upload</TabsTrigger>
            <TabsTrigger value="data">Data Table</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileJson className="h-5 w-5" />
                  Upload JSON Data
                </CardTitle>
                <CardDescription>
                  Upload a JSON file containing new Trump Files entries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-foreground/50 mx-auto mb-4" />
                  <Input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="max-w-sm mx-auto"
                  />
                  <p className="text-sm text-foreground/50 mt-2">
                    Select a JSON file to upload
                  </p>
                </div>

                {jsonFile && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <span className="text-sm">File: {jsonFile.name}</span>
                      <Badge variant={validationErrors.length === 0 ? "default" : "destructive"}>
                        {validationErrors.length === 0 ? "Valid" : `${validationErrors.length} errors`}
                      </Badge>
                    </div>

                    {validationErrors.length > 0 && (
                      <Alert className="bg-red-500/10 border-red-500/50">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <p className="font-semibold mb-2">Validation Errors:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {validationErrors.slice(0, 10).map((error, i) => (
                              <li key={i} className="text-sm">
                                {error.line && `Line ${error.line}: `}
                                {error.field} - {error.message}
                              </li>
                            ))}
                            {validationErrors.length > 10 && (
                              <li className="text-sm">
                                ...and {validationErrors.length - 10} more errors
                              </li>
                            )}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}

                    {uploadResult && (
                      <Alert className={uploadResult.success ? "bg-green-500/10 border-green-500/50" : "bg-red-500/10 border-red-500/50"}>
                        {uploadResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                        <AlertDescription>
                          {uploadResult.message}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      onClick={handleUpload}
                      disabled={uploading || validationErrors.length > 0}
                      className="w-full"
                    >
                      {uploading ? "Uploading..." : "Upload Entries"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle>Recent Entries</CardTitle>
                <CardDescription>
                  View and manage the latest entries in the database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-2">#</th>
                        <th className="text-left p-2">Title</th>
                        <th className="text-left p-2">Category</th>
                        <th className="text-left p-2">Phase</th>
                        <th className="text-left p-2">Danger</th>
                        <th className="text-left p-2">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.slice(0, 20).map((entry) => (
                        <tr key={entry.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="p-2">{entry.entry_number}</td>
                          <td className="p-2 max-w-xs truncate">{entry.title}</td>
                          <td className="p-2">
                            <Badge variant="secondary" className="text-xs">
                              {entry.category}
                            </Badge>
                          </td>
                          <td className="p-2">{entry.phase}</td>
                          <td className="p-2">
                            <span className={`font-mono ${
                              entry.danger_score >= 8 ? 'text-red-500' :
                              entry.danger_score >= 5 ? 'text-orange-500' :
                              'text-green-500'
                            }`}>
                              {entry.danger_score}/10
                            </span>
                          </td>
                          <td className="p-2 text-foreground/50">
                            {new Date(entry.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}