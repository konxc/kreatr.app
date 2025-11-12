'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileText, Sparkles, Copy, Download, RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { trpc } from '@/lib/trpc'
import { useToast } from '@/hooks/use-toast'

const platforms = ['Instagram', 'TikTok', 'Twitter', 'LinkedIn', 'Facebook']
const tones = ['Professional', 'Casual', 'Funny', 'Inspirational', 'Educational']

export default function GeneratePage() {
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('Instagram')
  const [tone, setTone] = useState('Casual')
  const [generatedContent, setGeneratedContent] = useState('')
  const { toast } = useToast()

  const generateMutation = trpc.ai.generateContent.useMutation({
    onSuccess: (data) => {
      setGeneratedContent(data.content)
      toast({
        title: 'Content Generated!',
        description: 'Your content is ready',
      })
    },
    onError: (error) => {
      toast({
        title: 'Generation Failed',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const handleGenerate = () => {
    if (!topic) {
      toast({
        title: 'Topic Required',
        description: 'Please enter a topic',
        variant: 'destructive',
      })
      return
    }

    generateMutation.mutate({
      topic,
      platform: platform.toLowerCase() as any,
      tone: tone.toLowerCase() as any,
    })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
    toast({
      title: 'Copied!',
      description: 'Content copied to clipboard',
    })
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-8 h-8 text-blue-600" />
          Content Generator
        </h1>
        <p className="text-gray-600 mt-2">
          Create engaging content with AI assistance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Settings</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="topic">Topic or Main Idea</Label>
              <Input
                id="topic"
                placeholder="e.g., Social media growth tips"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Platform</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {platforms.map((p) => (
                  <Button
                    key={p}
                    variant={platform === p ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPlatform(p)}
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Tone</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {tones.map((t) => (
                  <Button
                    key={t}
                    variant={tone === t ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTone(t)}
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!topic || generateMutation.isLoading}
              className="w-full"
              size="lg"
            >
              {generateMutation.isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Content
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Output */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Generated Content</h2>
            {generatedContent && (
              <Badge variant="secondary">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Generated
              </Badge>
            )}
          </div>

          {generatedContent ? (
            <div className="space-y-4">
              <Textarea
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={handleCopy}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={handleGenerate}
                  disabled={generateMutation.isLoading}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
                <Button size="sm" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500 mb-2">Character count</p>
                <p className="text-sm font-semibold text-gray-900">
                  {generatedContent.length} characters
                </p>
              </div>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Your generated content will appear here</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
