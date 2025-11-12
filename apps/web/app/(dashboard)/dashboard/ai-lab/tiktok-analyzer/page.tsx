'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Video, Sparkles, TrendingUp, Hash, Zap, Copy } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { trpc } from '@/lib/trpc'
import { useToast } from '@/hooks/use-toast'

export default function TikTokAnalyzerPage() {
  const [videoUrl, setVideoUrl] = useState('')
  const { toast } = useToast()

  const analyzeMutation = trpc.ai.analyzeTikTok.useMutation({
    onSuccess: (data) => {
      toast({
        title: 'Analysis Complete!',
        description: 'TikTok video analyzed successfully',
      })
    },
    onError: (error) => {
      toast({
        title: 'Analysis Failed',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const handleAnalyze = () => {
    if (!videoUrl) {
      toast({
        title: 'URL Required',
        description: 'Please enter a TikTok video URL',
        variant: 'destructive',
      })
      return
    }

    analyzeMutation.mutate({ videoUrl })
  }

  const analysis = analyzeMutation.data

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Video className="w-8 h-8 text-pink-600" />
          TikTok Analyzer
        </h1>
        <p className="text-gray-600 mt-2">
          Analyze viral TikTok videos and extract winning strategies
        </p>
      </div>

      {/* Input Form */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="videoUrl">TikTok Video URL</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="videoUrl"
                placeholder="https://www.tiktok.com/@username/video/1234567890"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleAnalyze}
                disabled={analyzeMutation.isLoading}
                size="lg"
              >
                {analyzeMutation.isLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Paste any TikTok video URL to get AI-powered insights
            </p>
          </div>
        </div>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Video Info */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Video className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {analysis.title || 'TikTok Video'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    👁️ {analysis.views?.toLocaleString() || '0'} views
                  </Badge>
                  <Badge variant="secondary">
                    ❤️ {analysis.likes?.toLocaleString() || '0'} likes
                  </Badge>
                  <Badge variant="secondary">
                    💬 {analysis.comments?.toLocaleString() || '0'} comments
                  </Badge>
                  <Badge variant="secondary">
                    🔄 {analysis.shares?.toLocaleString() || '0'} shares
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Hook Analysis */}
          {analysis.hook && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-600" />
                <h3 className="text-lg font-semibold text-gray-900">Hook Analysis</h3>
                <Badge variant="default" className="ml-auto">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Detected
                </Badge>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-gray-900 font-medium mb-2">{analysis.hook}</p>
                <p className="text-sm text-gray-600">
                  This hook grabs attention in the first 3 seconds - crucial for TikTok success
                </p>
              </div>
            </Card>
          )}

          {/* Content Strategy */}
          {analysis.strategy && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Content Strategy</h3>
              </div>
              <div className="space-y-3">
                {analysis.strategy.map((point: string, index: number) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <p className="text-gray-700">{point}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Hashtags */}
          {analysis.hashtags && analysis.hashtags.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Hash className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Hashtags Used</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.hashtags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Key Insights */}
          {analysis.insights && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{analysis.insights}</p>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              <Copy className="w-4 h-4 mr-2" />
              Copy Insights
            </Button>
            <Button className="flex-1">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Similar Content
            </Button>
          </div>
        </div>
      )}

      {/* Example Videos */}
      {!analysis && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Try These Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Viral Dance Challenge',
                url: 'https://www.tiktok.com/@example/video/1',
                views: '2.5M',
              },
              {
                title: 'Educational Content',
                url: 'https://www.tiktok.com/@example/video/2',
                views: '1.8M',
              },
              {
                title: 'Comedy Skit',
                url: 'https://www.tiktok.com/@example/video/3',
                views: '3.2M',
              },
              {
                title: 'Product Review',
                url: 'https://www.tiktok.com/@example/video/4',
                views: '950K',
              },
            ].map((example, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:border-purple-300 transition-colors cursor-pointer"
                onClick={() => setVideoUrl(example.url)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Video className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{example.title}</p>
                    <p className="text-sm text-gray-600">{example.views} views</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
