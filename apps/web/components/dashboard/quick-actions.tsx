'use client'

import Link from 'next/link'
import { Sparkles, Calendar, Rocket, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const actions = [
  {
    title: 'AI Brainstorm',
    description: 'Generate fresh content ideas',
    icon: Sparkles,
    href: '/dashboard/ai-lab/brainstorm',
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Create Content',
    description: 'Write with AI assistance',
    icon: Sparkles,
    href: '/dashboard/ai-lab/generate',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Schedule Post',
    description: 'Plan your content calendar',
    icon: Calendar,
    href: '/dashboard/scheduler',
    color: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Boost Content',
    description: 'Get SMM services',
    icon: Rocket,
    href: '/dashboard/boost',
    color: 'from-orange-500 to-red-500',
  },
]

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Link key={action.href} href={action.href}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
