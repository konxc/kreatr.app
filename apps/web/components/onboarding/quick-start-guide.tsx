'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Sparkles, 
  Link2, 
  FileText, 
  Calendar,
  CheckCircle,
  X
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface QuickStartStep {
  id: string
  title: string
  description: string
  icon: any
  href: string
  completed: boolean
}

export function QuickStartGuide() {
  const [isVisible, setIsVisible] = useState(true)
  const [steps, setSteps] = useState<QuickStartStep[]>([
    {
      id: 'connect',
      title: 'Connect Social Media',
      description: 'Link your accounts to start posting',
      icon: Link2,
      href: '/dashboard/integrations',
      completed: false,
    },
    {
      id: 'generate',
      title: 'Generate Content',
      description: 'Use AI to create your first post',
      icon: Sparkles,
      href: '/dashboard/ai-lab/generate',
      completed: false,
    },
    {
      id: 'schedule',
      title: 'Schedule a Post',
      description: 'Plan your content calendar',
      icon: Calendar,
      href: '/dashboard/scheduler',
      completed: false,
    },
  ])

  const completedCount = steps.filter((s) => s.completed).length
  const progress = (completedCount / steps.length) * 100

  const toggleStep = (stepId: string) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, completed: !step.completed } : step
      )
    )
  }

  if (!isVisible) return null

  return (
    <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 relative">
      {/* Close Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Quick Start Guide</h3>
          <Badge variant="secondary" className="text-xs">
            {completedCount}/{steps.length} Complete
          </Badge>
        </div>
        <p className="text-sm text-gray-600">
          Complete these steps to get the most out of kreatr.app
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step) => {
          const Icon = step.icon
          return (
            <div
              key={step.id}
              className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                step.completed
                  ? 'bg-white/50 opacity-75'
                  : 'bg-white hover:shadow-md'
              }`}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleStep(step.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  step.completed
                    ? 'bg-green-600 border-green-600'
                    : 'border-gray-300 hover:border-purple-500'
                }`}
              >
                {step.completed && <CheckCircle className="w-4 h-4 text-white" />}
              </button>

              {/* Icon */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                step.completed ? 'bg-gray-100' : 'bg-purple-100'
              }`}>
                <Icon className={`w-5 h-5 ${
                  step.completed ? 'text-gray-400' : 'text-purple-600'
                }`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className={`font-medium ${
                  step.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                }`}>
                  {step.title}
                </h4>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>

              {/* Action */}
              {!step.completed && (
                <Link href={step.href}>
                  <Button size="sm" variant="outline">
                    Start
                  </Button>
                </Link>
              )}
            </div>
          )
        })}
      </div>

      {/* Completion Message */}
      {completedCount === steps.length && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900">Great job! 🎉</p>
              <p className="text-sm text-green-700">
                You've completed the quick start guide. Keep creating!
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
