'use client'

import { Card } from '@/components/ui/card'
import { FileText, Calendar, TrendingUp, Zap } from 'lucide-react'

interface DashboardOverviewProps {
  stats?: {
    totalContent: number
    scheduledPosts: number
    totalViews: number
    creditsRemaining: number
  }
}

export function DashboardOverview({ stats }: DashboardOverviewProps) {
  const displayStats = [
    {
      title: 'Total Content',
      value: stats?.totalContent?.toString() || '0',
      change: '+12%',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Scheduled Posts',
      value: stats?.scheduledPosts?.toString() || '0',
      change: '+3',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Views',
      value: stats?.totalViews ? `${(stats.totalViews / 1000).toFixed(1)}K` : '0',
      change: '+23%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'AI Credits',
      value: stats?.creditsRemaining?.toString() || '0',
      change: '25 used',
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayStats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-sm text-green-600 font-medium">{stat.change}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.title}</p>
          </Card>
        )
      })}
    </div>
  )
}
