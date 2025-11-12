'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link2, Check, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const integrations = [
  {
    name: 'Instagram',
    description: 'Connect your Instagram account to schedule posts and track analytics',
    icon: '📷',
    connected: true,
    account: '@johndoe',
  },
  {
    name: 'TikTok',
    description: 'Publish content and analyze your TikTok performance',
    icon: '🎵',
    connected: true,
    account: '@johndoe_tiktok',
  },
  {
    name: 'Twitter / X',
    description: 'Schedule tweets and monitor engagement',
    icon: '🐦',
    connected: false,
    account: null,
  },
  {
    name: 'LinkedIn',
    description: 'Share professional content and grow your network',
    icon: '💼',
    connected: false,
    account: null,
  },
  {
    name: 'Facebook',
    description: 'Manage your Facebook page and schedule posts',
    icon: '👥',
    connected: false,
    account: null,
  },
  {
    name: 'YouTube',
    description: 'Upload videos and track channel analytics',
    icon: '📺',
    connected: false,
    account: null,
  },
  {
    name: 'Google Calendar',
    description: 'Sync your content schedule with Google Calendar',
    icon: '📅',
    connected: true,
    account: 'john@example.com',
  },
]

export default function IntegrationsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Link2 className="w-8 h-8 text-blue-600" />
          Integrations
        </h1>
        <p className="text-gray-600 mt-2">
          Connect your social media accounts and tools
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Connected Accounts</p>
          <p className="text-3xl font-bold text-gray-900">3</p>
          <p className="text-xs text-gray-500 mt-1">of 7 available</p>
        </Card>
        
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Total Reach</p>
          <p className="text-3xl font-bold text-gray-900">20.8K</p>
          <p className="text-xs text-gray-500 mt-1">Combined followers</p>
        </Card>
        
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Posts This Month</p>
          <p className="text-3xl font-bold text-gray-900">24</p>
          <p className="text-xs text-gray-500 mt-1">Across all platforms</p>
        </Card>
      </div>

      {/* Integrations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.name} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                  {integration.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                  {integration.connected && integration.account && (
                    <p className="text-sm text-gray-600">{integration.account}</p>
                  )}
                </div>
              </div>
              {integration.connected ? (
                <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                  <Check className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="outline">
                  <X className="w-3 h-3 mr-1" />
                  Not Connected
                </Badge>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-4">{integration.description}</p>

            {integration.connected ? (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Settings
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 text-red-600 hover:text-red-700">
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button className="w-full">Connect {integration.name}</Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
