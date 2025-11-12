'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, TrendingUp, Eye, Heart, Share2, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const platformStats = [
  { platform: 'Instagram', followers: '12.5K', engagement: '4.2%', posts: 24 },
  { platform: 'TikTok', followers: '8.3K', engagement: '6.8%', posts: 18 },
  { platform: 'Twitter', followers: '5.1K', engagement: '2.9%', posts: 32 },
  { platform: 'LinkedIn', followers: '3.2K', engagement: '3.5%', posts: 12 },
]

const topContent = [
  { title: '10 Tips for Better Engagement', views: '5.2K', likes: '892', platform: 'Instagram' },
  { title: 'How to Grow on TikTok', views: '4.8K', likes: '756', platform: 'TikTok' },
  { title: 'Content Strategy Guide', views: '3.9K', likes: '623', platform: 'Twitter' },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            Analytics
          </h1>
          <p className="text-gray-600 mt-2">
            Track your content performance across platforms
          </p>
        </div>
        <Button variant="outline">
          Export Report
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <Badge variant="secondary" className="text-xs">+23%</Badge>
          </div>
          <p className="text-3xl font-bold text-gray-900">45.2K</p>
          <p className="text-sm text-gray-600 mt-1">Total Views</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Heart className="w-5 h-5 text-pink-600" />
            <Badge variant="secondary" className="text-xs">+18%</Badge>
          </div>
          <p className="text-3xl font-bold text-gray-900">8.9K</p>
          <p className="text-sm text-gray-600 mt-1">Total Likes</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Share2 className="w-5 h-5 text-green-600" />
            <Badge variant="secondary" className="text-xs">+31%</Badge>
          </div>
          <p className="text-3xl font-bold text-gray-900">2.1K</p>
          <p className="text-sm text-gray-600 mt-1">Total Shares</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-purple-600" />
            <Badge variant="secondary" className="text-xs">+12%</Badge>
          </div>
          <p className="text-3xl font-bold text-gray-900">29.1K</p>
          <p className="text-sm text-gray-600 mt-1">Total Followers</p>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Overview</h2>
        <div className="h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <p className="text-gray-600">Chart visualization coming soon</p>
            <p className="text-sm text-gray-500 mt-2">Track your growth over time</p>
          </div>
        </div>
      </Card>

      {/* Platform Stats */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Platform Performance</h2>
        <div className="space-y-4">
          {platformStats.map((stat) => (
            <div key={stat.platform} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{stat.platform}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span>{stat.followers} followers</span>
                  <span>•</span>
                  <span>{stat.engagement} engagement</span>
                  <span>•</span>
                  <span>{stat.posts} posts</span>
                </div>
              </div>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Top Content */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Performing Content</h2>
        <div className="space-y-4">
          {topContent.map((content, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-purple-600">#{index + 1}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{content.title}</h3>
                <div className="flex items-center gap-4 mt-1">
                  <Badge variant="secondary" className="text-xs">{content.platform}</Badge>
                  <span className="text-xs text-gray-600">{content.views} views</span>
                  <span className="text-xs text-gray-600">{content.likes} likes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
