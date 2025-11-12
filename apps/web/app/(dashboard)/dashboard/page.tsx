'use client'

import { Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { DashboardOverview } from '@/components/dashboard/overview'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { RecentContent } from '@/components/dashboard/recent-content'
import { AnalyticsPreview } from '@/components/dashboard/analytics-preview'
import { QuickStartGuide } from '@/components/onboarding/quick-start-guide'
import { trpc } from '@/lib/trpc'
import { Card } from '@/components/ui/card'

function DashboardContent() {
  const { data: session } = useSession()
  const { data: stats, isLoading } = trpc.content.getStats.useQuery()

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {session?.user?.name?.split(' ')[0] || 'Creator'}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your content today.
        </p>
      </div>

      {/* Quick Start Guide */}
      <QuickStartGuide />

      {/* Quick Actions */}
      <QuickActions />

      {/* Overview Stats */}
      <DashboardOverview stats={stats} />

      {/* Recent Content & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentContent />
        <AnalyticsPreview />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
