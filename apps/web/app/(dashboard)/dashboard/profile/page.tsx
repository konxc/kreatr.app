'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Mail, Calendar, Award, TrendingUp } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function ProfilePage() {
  const { data: session } = useSession()

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <User className="w-8 h-8 text-purple-600" />
          Profile
        </h1>
        <p className="text-gray-600 mt-2">
          View and manage your profile information
        </p>
      </div>

      {/* Profile Card */}
      <Card className="p-8">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-3xl font-bold text-white">
              {session?.user?.name?.charAt(0) || 'U'}
            </span>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {session?.user?.name || 'User'}
            </h2>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="default">Free Plan</Badge>
              <Badge variant="secondary">Content Creator</Badge>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {session?.user?.email}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Joined {new Date().toLocaleDateString()}
              </div>
            </div>

            <div className="mt-6">
              <Link href="/dashboard/settings">
                <Button>Edit Profile</Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-gray-600">Content Created</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">24</p>
          <p className="text-xs text-gray-500 mt-1">Total pieces</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-gray-600">Total Views</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">12.5K</p>
          <p className="text-xs text-gray-500 mt-1">Across all platforms</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <User className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Followers</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">2.8K</p>
          <p className="text-xs text-gray-500 mt-1">Combined reach</p>
        </Card>
      </div>

      {/* Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'Created content', item: '10 Tips for Social Media', time: '2 hours ago' },
            { action: 'Scheduled post', item: 'TikTok Tutorial', time: '5 hours ago' },
            { action: 'Generated ideas', item: 'AI Brainstorm', time: '1 day ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-600 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {activity.action}: <span className="text-gray-600">{activity.item}</span>
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
