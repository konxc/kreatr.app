'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Clock, MoreVertical } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { trpc } from '@/lib/trpc'

export function RecentContent() {
  const { data: content, isLoading } = trpc.content.getRecent.useQuery({ limit: 5 })

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
      </Card>
    )
  }

  const recentContent = content || []

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours} hours ago`
    return `${Math.floor(hours / 24)} days ago`
  }
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Content</h2>
        <Link href="/dashboard/content">
          <Button variant="ghost" size="sm">View All</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {recentContent.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No content yet</p>
            <p className="text-sm mt-1">Start creating with AI</p>
          </div>
        ) : (
          recentContent.map((item) => (
            <div
              key={item.id}
              className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className="text-xs capitalize">
                    {item.status}
                  </Badge>
                </div>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDate(item.createdAt)}
                </div>
              </div>
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
