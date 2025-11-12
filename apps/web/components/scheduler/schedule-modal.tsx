'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, Clock, Instagram, Twitter } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { trpc } from '@/lib/trpc'
import { useToast } from '@/hooks/use-toast'

interface ScheduleModalProps {
  open: boolean
  onClose: () => void
  selectedDate?: Date
  contentId?: string
  onSuccess?: () => void
}

export function ScheduleModal({
  open,
  onClose,
  selectedDate,
  contentId,
  onSuccess,
}: ScheduleModalProps) {
  const { toast } = useToast()
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [scheduledDate, setScheduledDate] = useState(
    selectedDate ? selectedDate.toISOString().slice(0, 16) : ''
  )
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])

  const scheduleMutation = trpc.scheduler.schedulePost.useMutation({
    onSuccess: () => {
      toast({
        title: 'Post Scheduled!',
        description: 'Your content has been scheduled successfully',
      })
      onClose()
      onSuccess?.()
    },
    onError: (error) => {
      toast({
        title: 'Scheduling Failed',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const platforms = [
    { id: 'TIKTOK', name: 'TikTok', icon: '🎵', color: 'bg-pink-500' },
    { id: 'INSTAGRAM', name: 'Instagram', icon: '📷', color: 'bg-purple-500' },
    { id: 'TWITTER', name: 'Twitter', icon: '🐦', color: 'bg-blue-500' },
  ]

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId]
    )
  }

  const handleSchedule = () => {
    if (!contentId) {
      toast({
        title: 'Error',
        description: 'No content selected',
        variant: 'destructive',
      })
      return
    }

    if (selectedPlatforms.length === 0) {
      toast({
        title: 'Select Platform',
        description: 'Please select at least one platform',
        variant: 'destructive',
      })
      return
    }

    if (!scheduledDate) {
      toast({
        title: 'Select Date',
        description: 'Please select a date and time',
        variant: 'destructive',
      })
      return
    }

    scheduleMutation.mutate({
      contentId,
      scheduledAt: new Date(scheduledDate),
      platforms: selectedPlatforms as any,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Schedule Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Content Preview */}
          <div>
            <Label>Content</Label>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                {title || 'Select content to schedule'}
              </p>
            </div>
          </div>

          {/* Date & Time */}
          <div>
            <Label htmlFor="scheduledDate">Schedule Date & Time</Label>
            <div className="relative mt-2">
              <Input
                id="scheduledDate"
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Select when you want this content to be published
            </p>
          </div>

          {/* Platform Selection */}
          <div>
            <Label>Select Platforms</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedPlatforms.includes(platform.id)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <span className="text-2xl mb-2 block">{platform.icon}</span>
                    <p className="text-sm font-medium text-gray-900">
                      {platform.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Platforms Summary */}
          {selectedPlatforms.length > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900 mb-2">
                Will be posted to:
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedPlatforms.map((platformId) => {
                  const platform = platforms.find((p) => p.id === platformId)
                  return (
                    <Badge key={platformId} variant="secondary">
                      {platform?.icon} {platform?.name}
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSchedule}
              disabled={scheduleMutation.isLoading}
            >
              {scheduleMutation.isLoading ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Post
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
