'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, Eye, Heart, Share2 } from 'lucide-react'

const metrics = [
  {
    label: 'Total Views',
    value: '12.5K',
    change: '+23%',
    icon: Eye,
    color: 'text-blue-600',
  },
  {
    label: 'Engagement',
    value: '3.2K',
    change: '+18%',
    icon: Heart,
    color: 'text-pink-600',
  },
  {
    label: 'Shares',
    value: '892',
    change: '+31%',
    icon: Share2,
    color: 'text-green-600',
  },
]

export function AnalyticsPreview() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Analytics Overview</h2>
        <Link href="/dashboard/analytics">
          <Button variant="ghost" size="sm">View Details</Button>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Chart Placeholder */}
        <div className="h-48 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Performance trending up</p>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon
            return (
              <div key={metric.label} className="text-center">
                <Icon className={`w-5 h-5 ${metric.color} mx-auto mb-2`} />
                <p className="text-lg font-bold text-gray-900">{metric.value}</p>
                <p className="text-xs text-gray-600">{metric.label}</p>
                <p className="text-xs text-green-600 font-medium mt-1">{metric.change}</p>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
