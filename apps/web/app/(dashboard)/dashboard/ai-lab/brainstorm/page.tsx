'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lightbulb, Sparkles, Copy, Save } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { trpc } from '@/lib/trpc'
import { useToast } from '@/hooks/use-toast'

export default function BrainstormPage() {
  const [topic, setTopic] = useState('')
  const [niche, setNiche] = useState('')
  const { toast } = useToast()

  const brainstormMutation = trpc.ai.brainstorm.useMutation({
    onSuccess: () => {
      toast({
        title: 'Ideas Generated!',
        description: 'Your content ideas are ready',
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

  const handleBrainstorm = () => {
    if (!topic) {
      toast({
        title: 'Topic Required',
        description: 'Please enter a topic to brainstorm',
        variant: 'destructive',
      })
      return
    }

    brainstormMutation.mutate({ topic, niche })
  }

  const ideas = brainstormMutation.data?.ideas || []

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Lightbulb className="w-8 h-8 text-purple-600" />
          AI Brainstorm
        </h1>
        <p className="text-gray-600 mt-2">
          Generate unlimited content ideas powered by AI
        </p>
      </div>

      {/* Input Form */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="topic">What topic do you want ideas for?</Label>
            <Input
              id="topic"
              placeholder="e.g., Social media marketing, fitness tips, cooking recipes"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="niche">Your niche (optional)</Label>
            <Input
              id="niche"
              placeholder="e.g., Tech, Fashion, Food, Travel"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="mt-2"
            />
          </div>

          <Button
            onClick={handleBrainstorm}
            disabled={!topic || brainstormMutation.isLoading}
            className="w-full"
            size="lg"
          >
            {brainstormMutation.isLoading ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Generating Ideas...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Ideas
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Results */}
      {ideas.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Generated Ideas ({ideas.length})
            </h2>
            <Badge variant="secondary">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Generated
            </Badge>
          </div>

          <div className="space-y-3">
            {ideas.map((idea: string, index: number) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">
                        #{index + 1}
                      </span>
                    </div>
                    <p className="text-gray-900 font-medium">{idea}</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Save className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleBrainstorm}
              disabled={brainstormMutation.isLoading}
            >
              Generate More Ideas
            </Button>
            <Button className="flex-1">
              Save All Ideas
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
