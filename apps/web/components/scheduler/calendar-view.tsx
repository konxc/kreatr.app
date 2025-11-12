'use client'

import { useState, useMemo } from 'react'
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

interface ScheduledContent {
  id: string
  title: string
  scheduledAt: Date
  status: string
  posts: Array<{
    platform: string
    account: {
      username: string
    }
  }>
}

interface CalendarViewProps {
  scheduledContent: ScheduledContent[]
  onSelectEvent: (event: any) => void
  onSelectSlot: (slotInfo: any) => void
  onEventDrop: (args: any) => void
}

export function CalendarView({
  scheduledContent,
  onSelectEvent,
  onSelectSlot,
  onEventDrop,
}: CalendarViewProps) {
  const [view, setView] = useState(Views.MONTH)
  const [date, setDate] = useState(new Date())

  // Transform scheduled content to calendar events
  const events = useMemo(() => {
    return scheduledContent.map((content) => ({
      id: content.id,
      title: content.title,
      start: new Date(content.scheduledAt),
      end: new Date(content.scheduledAt),
      resource: content,
    }))
  }, [scheduledContent])

  // Custom event style
  const eventStyleGetter = (event: any) => {
    const platforms = event.resource.posts.map((p: any) => p.platform)
    
    let backgroundColor = '#8b5cf6' // purple default
    
    if (platforms.includes('TIKTOK')) {
      backgroundColor = '#fe2c55' // TikTok pink
    } else if (platforms.includes('INSTAGRAM')) {
      backgroundColor = '#e4405f' // Instagram gradient
    } else if (platforms.includes('TWITTER')) {
      backgroundColor = '#1da1f2' // Twitter blue
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '12px',
        padding: '4px 8px',
      },
    }
  }

  // Custom event component
  const EventComponent = ({ event }: any) => {
    const platforms = event.resource.posts.map((p: any) => p.platform)
    
    return (
      <div className="flex items-center gap-1">
        <span className="truncate flex-1">{event.title}</span>
        <div className="flex gap-1">
          {platforms.map((platform: string) => (
            <span key={platform} className="text-xs opacity-75">
              {platform === 'TIKTOK' && '🎵'}
              {platform === 'INSTAGRAM' && '📷'}
              {platform === 'TWITTER' && '🐦'}
            </span>
          ))}
        </div>
      </div>
    )
  }

  // Custom toolbar
  const CustomToolbar = (toolbar: any) => {
    const goToBack = () => {
      toolbar.onNavigate('PREV')
    }

    const goToNext = () => {
      toolbar.onNavigate('NEXT')
    }

    const goToToday = () => {
      toolbar.onNavigate('TODAY')
    }

    const label = () => {
      const date = toolbar.date
      return format(date, 'MMMM yyyy')
    }

    return (
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            <CalendarIcon className="w-4 h-4 mr-2" />
            Today
          </Button>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={goToBack}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={goToNext}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-900">{label()}</h2>

        <div className="flex gap-2">
          <Button
            variant={view === Views.MONTH ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView(Views.MONTH)}
          >
            Month
          </Button>
          <Button
            variant={view === Views.WEEK ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView(Views.WEEK)}
          >
            Week
          </Button>
          <Button
            variant={view === Views.DAY ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView(Views.DAY)}
          >
            Day
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card className="p-6">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        onEventDrop={onEventDrop}
        eventPropGetter={eventStyleGetter}
        components={{
          toolbar: CustomToolbar,
          event: EventComponent,
        }}
        selectable
        resizable
        draggableAccessor={() => true}
        popup
      />
    </Card>
  )
}
