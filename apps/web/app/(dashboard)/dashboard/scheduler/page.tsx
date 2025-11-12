'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon, Plus, Clock, List } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { CalendarView } from '@/components/scheduler/calendar-view'
import { ScheduleModal } from '@/components/scheduler/schedule-modal'
import { trpc } from '@/lib/trpc'
import { useToast } from '@/hooks/use-toast'
import { startOfMonth, endOfMonth } from 'date-fns'

export default function SchedulerPage() {
  const { toast } = useToast()
  const [view, setView] = useState<'calendar' | 'list'>('calendar')
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedContent, setSelectedContent] = useState<string>()

  // Get current month range
  const now = new Date()
  const startDate = startOfMonth(now)
  const endDate = endOfMonth(now)

  // Fetch scheduled content
  const { data: scheduledContent, refetch } = trpc.scheduler.getScheduled.useQuery({
    startDate,
    endDate,
  })

  // Fetch queue status
  const { data: queueStatus } = trpc.scheduler.getQueueStatus.useQuery()

  // Reschedule mutation (for drag & drop)
  const rescheduleMutation = trpc.scheduler.reschedulePost.useMutation({
    onSuccess: () => {
      toast({
        title: 'Post Rescheduled',
        description: 'Content has been moved to new date',
      })
      refetch()
    },
    onError: (error) => {
      toast({
        title: 'Reschedule Failed',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  // Cancel mutation
  const cancelMutation = trpc.scheduler.cancelScheduled.useMutation({
    onSuccess: () => {
      toast({
        title: 'Post Cancelled',
        description: 'Scheduled post has been cancelled',
      })
      refetch()
    },
    onError: (error) => {
      toast({
        title: 'Cancel Failed',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const handleSelectEvent = (event: any) => {
    setSelectedContent(event.id)
    setScheduleModalOpen(true)
  }

  const handleSelectSlot = (slotInfo: any) => {
    setSelectedDate(slotInfo.start)
    setScheduleModalOpen(true)
  }

  const handleEventDrop = ({ event, start }: any) => {
    rescheduleMutation.mutate({
      contentId: event.id,
      newScheduledAt: start,
    })
  }

  const handleCancelPost = (contentId: string) => {
    if (confirm('Are you sure you want to cancel this scheduled post?')) {
      cancelMutation.mutate({ contentId })
    }
  }

  const formatTimeUntil = (date: Date) => {
    const now = new Date()
    const diff = new Date(date).getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days}d ${hours % 24}h`
    }
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarIcon className="w-8 h-8 text-green-600" />
            Content Scheduler
          </h1>
          <p className="text-gray-600 mt-2">
            Plan and schedule your content across platforms
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === 'calendar' ? 'default' : 'outline'}
            onClick={() => setView('calendar')}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Calendar
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            onClick={() => setView('list')}
          >
            <List className="w-4 h-4 mr-2" />
            List
          </Button>
          <Button size="lg" onClick={() => setScheduleModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Post
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Scheduled This Week</p>
            <CalendarIcon className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {queueStatus?.upcoming || 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">Next 7 days</p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Next Post In</p>
            <Clock className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {queueStatus?.nextPost 
              ? formatTimeUntil(queueStatus.nextPost.scheduledAt!)
              : '-'
            }
          </p>
          <p className="text-xs text-gray-500 mt-1 truncate">
            {queueStatus?.nextPost?.title || 'No upcoming posts'}
          </p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Scheduled</p>
            <CalendarIcon className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {queueStatus?.total || 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">All upcoming posts</p>
        </Card>
      </div>

      {/* Calendar or List View */}
      {view === 'calendar' ? (
        <CalendarView
          scheduledContent={scheduledContent || []}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          onEventDrop={handleEventDrop}
        />
      ) : (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Posts</h2>
          <div className="space-y-4">
            {scheduledContent && scheduledContent.length > 0 ? (
              scheduledContent.map((content) => (
                <div
                  key={content.id}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CalendarIcon className="w-6 h-6 text-green-600" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{content.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {content.posts.map((post) => (
                        <Badge key={post.id} variant="secondary" className="text-xs">
                          {post.platform}
                        </Badge>
                      ))}
                      <span className="text-xs text-gray-500">
                        {content.scheduledAt 
                          ? new Date(content.scheduledAt).toLocaleString()
                          : 'Not scheduled'
                        }
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedContent(content.id)
                        setScheduleModalOpen(true)
                      }}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleCancelPost(content.id)}
                      disabled={cancelMutation.isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No scheduled posts</p>
                <p className="text-sm mt-1">Click "Schedule Post" to get started</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Schedule Modal */}
      <ScheduleModal
        open={scheduleModalOpen}
        onClose={() => {
          setScheduleModalOpen(false)
          setSelectedContent(undefined)
          setSelectedDate(undefined)
        }}
        selectedDate={selectedDate}
        contentId={selectedContent}
        onSuccess={() => refetch()}
      />
    </div>
  )
}
