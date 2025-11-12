'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Plus, Settings, Crown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const workspaces = [
  {
    id: '1',
    name: 'Personal Workspace',
    role: 'owner',
    members: 1,
    content: 24,
    isPrimary: true,
  },
  {
    id: '2',
    name: 'Marketing Team',
    role: 'admin',
    members: 5,
    content: 48,
    isPrimary: false,
  },
  {
    id: '3',
    name: 'Client Projects',
    role: 'member',
    members: 3,
    content: 12,
    isPrimary: false,
  },
]

export default function WorkspacesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-8 h-8 text-purple-600" />
            Workspaces
          </h1>
          <p className="text-gray-600 mt-2">
            Collaborate with your team on content creation
          </p>
        </div>
        <Button size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Create Workspace
        </Button>
      </div>

      {/* Current Workspace */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Current Workspace</h3>
              <Badge variant="default">
                <Crown className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
            <p className="text-gray-600">Personal Workspace</p>
          </div>
          <Button variant="outline">Switch Workspace</Button>
        </div>
      </Card>

      {/* Workspaces List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces.map((workspace) => (
          <Card key={workspace.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              {workspace.isPrimary && (
                <Badge variant="default" className="bg-purple-100 text-purple-700 border-purple-200">
                  Primary
                </Badge>
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{workspace.name}</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Role:</span>
                <Badge variant="secondary" className="text-xs capitalize">
                  {workspace.role}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Members:</span>
                <span className="font-medium text-gray-900">{workspace.members}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Content:</span>
                <span className="font-medium text-gray-900">{workspace.content}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Settings className="w-4 h-4 mr-2" />
                Manage
              </Button>
              {!workspace.isPrimary && (
                <Button size="sm" className="flex-1">
                  Switch
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Team Members */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Team Members</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-purple-600">JD</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">John Doe</p>
                <p className="text-sm text-gray-600">john@example.com</p>
              </div>
            </div>
            <Badge variant="default">Owner</Badge>
          </div>

          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No other members yet</p>
            <Button variant="outline" size="sm" className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Invite Members
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
