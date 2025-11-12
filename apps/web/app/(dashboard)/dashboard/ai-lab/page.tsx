import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, Lightbulb, FileText, Video, TrendingUp } from 'lucide-react'

const aiTools = [
  {
    title: 'AI Brainstorm',
    description: 'Generate unlimited content ideas with AI-powered brainstorming',
    icon: Lightbulb,
    href: '/dashboard/ai-lab/brainstorm',
    color: 'from-purple-500 to-pink-500',
    features: ['Topic suggestions', 'Trend analysis', 'Niche ideas'],
  },
  {
    title: 'Content Generator',
    description: 'Create engaging posts, captions, and scripts with AI',
    icon: FileText,
    href: '/dashboard/ai-lab/generate',
    color: 'from-blue-500 to-cyan-500',
    features: ['Multiple platforms', 'Custom tone', 'SEO optimized'],
  },
  {
    title: 'TikTok Analyzer',
    description: 'Analyze viral TikTok content and get insights',
    icon: Video,
    href: '/dashboard/ai-lab/tiktok-analyzer',
    color: 'from-pink-500 to-rose-500',
    features: ['Viral analysis', 'Trend detection', 'Hook extraction'],
  },
  {
    title: 'Trend Finder',
    description: 'Discover trending topics and hashtags in your niche',
    icon: TrendingUp,
    href: '/dashboard/ai-lab/trends',
    color: 'from-green-500 to-emerald-500',
    features: ['Real-time trends', 'Hashtag research', 'Competitor analysis'],
  },
]

export default function AILabPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-purple-600" />
          AI Lab
        </h1>
        <p className="text-gray-600 mt-2">
          Supercharge your content creation with AI-powered tools
        </p>
      </div>

      {/* AI Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {aiTools.map((tool) => {
          const Icon = tool.icon
          return (
            <Card key={tool.href} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <Link href={tool.href}>
                  <Button>Try Now</Button>
                </Link>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{tool.title}</h3>
              <p className="text-gray-600 mb-4">{tool.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {tool.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Usage Stats */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your AI Usage</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Credits Remaining</p>
            <p className="text-3xl font-bold text-gray-900">50</p>
            <p className="text-xs text-gray-500 mt-1">25 used this month</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Content Generated</p>
            <p className="text-3xl font-bold text-gray-900">127</p>
            <p className="text-xs text-gray-500 mt-1">+23 this week</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Ideas Created</p>
            <p className="text-3xl font-bold text-gray-900">89</p>
            <p className="text-xs text-gray-500 mt-1">+15 this week</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
