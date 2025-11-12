'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useOnboarding } from '@/contexts/onboarding-context'
import { 
  Sparkles, 
  Link2, 
  FileText, 
  Calendar, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  X
} from 'lucide-react'
import Link from 'next/link'

const stepIcons = {
  welcome: Sparkles,
  'connect-social': Link2,
  'create-content': FileText,
  'schedule-post': Calendar,
  complete: CheckCircle,
}

export function OnboardingWizard() {
  const {
    isOnboarding,
    currentStep,
    steps,
    nextStep,
    previousStep,
    skipOnboarding,
    progress,
  } = useOnboarding()

  const step = steps[currentStep]
  const Icon = stepIcons[step?.id as keyof typeof stepIcons] || Sparkles

  if (!isOnboarding || !step) return null

  return (
    <Dialog open={isOnboarding} onOpenChange={skipOnboarding}>
      <DialogContent className="max-w-2xl">
        {/* Skip Button */}
        <button
          onClick={skipOnboarding}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Skip</span>
        </button>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-purple-600">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Content */}
        <div className="text-center py-8">
          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon className="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {step.title}
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {step.description}
          </p>

          {/* Step-specific Content */}
          {step.id === 'welcome' && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">What you can do:</h3>
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">AI Content</p>
                    <p className="text-xs text-gray-600">Generate ideas & posts</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">Schedule</p>
                    <p className="text-xs text-gray-600">Auto-post to platforms</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Link2 className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">Connect</p>
                    <p className="text-xs text-gray-600">Link social accounts</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">Analyze</p>
                    <p className="text-xs text-gray-600">Track performance</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step.id === 'connect-social' && (
            <div className="space-y-3 mb-6">
              <Link href="/dashboard/integrations">
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <span className="text-2xl mr-3">🎵</span>
                  <div className="text-left">
                    <p className="font-semibold">Connect TikTok</p>
                    <p className="text-xs text-gray-600">Schedule videos & track views</p>
                  </div>
                </Button>
              </Link>
              <Link href="/dashboard/integrations">
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <span className="text-2xl mr-3">📷</span>
                  <div className="text-left">
                    <p className="font-semibold">Connect Instagram</p>
                    <p className="text-xs text-gray-600">Post photos & stories</p>
                  </div>
                </Button>
              </Link>
              <Link href="/dashboard/integrations">
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <span className="text-2xl mr-3">🐦</span>
                  <div className="text-left">
                    <p className="font-semibold">Connect Twitter</p>
                    <p className="text-xs text-gray-600">Schedule tweets & threads</p>
                  </div>
                </Button>
              </Link>
            </div>
          )}

          {step.id === 'create-content' && (
            <div className="space-y-3 mb-6">
              <Link href="/dashboard/ai-lab/brainstorm">
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <Sparkles className="w-5 h-5 mr-3 text-purple-600" />
                  <div className="text-left">
                    <p className="font-semibold">AI Brainstorm</p>
                    <p className="text-xs text-gray-600">Generate content ideas</p>
                  </div>
                </Button>
              </Link>
              <Link href="/dashboard/ai-lab/generate">
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <FileText className="w-5 h-5 mr-3 text-blue-600" />
                  <div className="text-left">
                    <p className="font-semibold">Content Generator</p>
                    <p className="text-xs text-gray-600">Create posts with AI</p>
                  </div>
                </Button>
              </Link>
            </div>
          )}

          {step.id === 'schedule-post' && (
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <p className="text-sm text-gray-700 mb-4">
                Plan your content calendar and schedule posts to publish automatically
              </p>
              <Link href="/dashboard/scheduler">
                <Button className="w-full">
                  Go to Scheduler
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          )}

          {step.id === 'complete' && (
            <div className="space-y-4 mb-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <p className="text-gray-700 mb-4">
                  You're ready to start creating amazing content with AI!
                </p>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="bg-white rounded-lg p-3">
                    <p className="font-bold text-2xl text-purple-600">50</p>
                    <p className="text-gray-600">Free Credits</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="font-bold text-2xl text-blue-600">∞</p>
                    <p className="text-gray-600">Ideas</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="font-bold text-2xl text-green-600">24/7</p>
                    <p className="text-gray-600">Support</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {currentStep > 0 && step.id !== 'complete' && (
            <Button
              variant="outline"
              onClick={previousStep}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          )}
          <Button
            onClick={nextStep}
            className="flex-1"
          >
            {step.id === 'complete' ? 'Get Started' : 'Next'}
            {step.id !== 'complete' && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>

        {/* Skip Link */}
        {step.id !== 'complete' && (
          <button
            onClick={skipOnboarding}
            className="text-sm text-gray-500 hover:text-gray-700 mt-4 text-center w-full"
          >
            Skip tutorial
          </button>
        )}
      </DialogContent>
    </Dialog>
  )
}
