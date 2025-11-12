'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Sparkles,
  Calendar,
  BarChart3,
  Users,
  Rocket,
  FolderKanban,
  Link2,
} from 'lucide-react'

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'AI Lab',
    href: '/dashboard/ai-lab',
    icon: Sparkles,
  },
  {
    title: 'Content',
    href: '/dashboard/content',
    icon: FolderKanban,
  },
  {
    title: 'Scheduler',
    href: '/dashboard/scheduler',
    icon: Calendar,
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    title: 'SMM Boost',
    href: '/dashboard/boost',
    icon: Rocket,
  },
  {
    title: 'Workspaces',
    href: '/dashboard/workspaces',
    icon: Users,
  },
  {
    title: 'Integrations',
    href: '/dashboard/integrations',
    icon: Link2,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="w-64 border-r bg-white min-h-[calc(100vh-4rem)] p-4">
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-purple-50 text-purple-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
