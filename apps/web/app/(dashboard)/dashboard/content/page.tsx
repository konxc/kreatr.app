'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FolderKanban, Plus, Search, Filter, FileText, MoreVertical } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const contentItems = [
  {
    id: '1',
    title: '10 Tips for Better Social Media Engagement',
    platform: 'Instagram',
    status: 'published',
    date: '2024-01-15',
    views: '2.5K',
  },
  {
    id: '2',
    title: 'How to Grow Your TikTok Following',
    platform: 'TikTok',
    status: 'scheduled',
    date: '2024-01-20',
    views: '-',
  },
  {
    id: '3',
    title: 'Content Marketing Strategy 2024',
    platform: 'Twitter',
    status: 'draft',
    date: '2024-01-14',
    views: '-',
  },
  {
    id: '4',
    title: 'Behind the Scenes: Content Creation Process',
    platform: 'Instagram',
    status: 'published',
    date: '2024-01-12',
    views: '1.8K',
  },
  {
    id: '5',
    title: 'LinkedIn Growth Hacks for 2024',
    platform: 'LinkedIn',
    status: 'draft',
    date: '2024-01-10',
    views: '-',
  },
]

export default function ContentPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FolderKanban className="w-8 h-8 text-purple-600" />
            Content Library
          </h1>
          <p className="text-gray-600 mt-2">
            Manage all your content in one place
          </p>
        </div>
        <Link href="/dashboard/ai-lab/generate">
          <Button size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Create Content
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-1">Total Content</p>
          <p className="text-2xl font-bold text-gray-900">24</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-1">Published</p>
          <p className="text-2xl font-bold text-green-600">12</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-1">Scheduled</p>
          <p className="text-2xl font-bold text-blue-600">8</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-1">Drafts</p>
          <p className="text-2xl font-bold text-gray-600">4</p>
        </Card>
      </div>

      {/* Content List */}
      <Card className="p-6">
        <div className="space-y-4">
          {contentItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {item.platform}
                  </Badge>
                  <Badge
                    variant={
                      item.status === 'published'
                        ? 'default'
                        : item.status === 'scheduled'
                        ? 'secondary'
                        : 'outline'
                    }
                    className="text-xs"
                  >
                    {item.status}
                  </Badge>
                  <span className="text-xs text-gray-500">{item.date}</span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{item.views}</p>
                <p className="text-xs text-gray-500">views</p>
              </div>

              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
