import axios, { AxiosInstance } from 'axios'
import type { CalendarEvent, APIResponse } from './types'

export class GoogleCalendarAPI {
  private client: AxiosInstance
  private baseURL = 'https://www.googleapis.com/calendar/v3'

  constructor(accessToken?: string) {
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    })
  }

  /**
   * Create a calendar event
   */
  async createEvent(
    calendarId: string = 'primary',
    event: CalendarEvent
  ): Promise<APIResponse<CalendarEvent>> {
    try {
      const response = await this.client.post(`/calendars/${calendarId}/events`, {
        summary: event.title,
        description: event.description,
        location: event.location,
        start: {
          dateTime: event.startTime.toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: event.endTime.toISOString(),
          timeZone: 'UTC',
        },
        attendees: event.attendees?.map(email => ({ email })),
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 30 },
          ],
        },
      })

      return {
        success: true,
        data: {
          id: response.data.id,
          title: response.data.summary,
          description: response.data.description,
          startTime: new Date(response.data.start.dateTime),
          endTime: new Date(response.data.end.dateTime),
          location: response.data.location,
          attendees: response.data.attendees?.map((a: any) => a.email),
        },
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
          message: error.response?.data?.error?.message || 'Failed to create event',
          details: error.response?.data,
        },
      }
    }
  }

  /**
   * Update a calendar event
   */
  async updateEvent(
    calendarId: string = 'primary',
    eventId: string,
    updates: Partial<CalendarEvent>
  ): Promise<APIResponse<CalendarEvent>> {
    try {
      const payload: any = {}

      if (updates.title) payload.summary = updates.title
      if (updates.description) payload.description = updates.description
      if (updates.location) payload.location = updates.location
      if (updates.startTime) {
        payload.start = {
          dateTime: updates.startTime.toISOString(),
          timeZone: 'UTC',
        }
      }
      if (updates.endTime) {
        payload.end = {
          dateTime: updates.endTime.toISOString(),
          timeZone: 'UTC',
        }
      }
      if (updates.attendees) {
        payload.attendees = updates.attendees.map(email => ({ email }))
      }

      const response = await this.client.patch(
        `/calendars/${calendarId}/events/${eventId}`,
        payload
      )

      return {
        success: true,
        data: {
          id: response.data.id,
          title: response.data.summary,
          description: response.data.description,
          startTime: new Date(response.data.start.dateTime),
          endTime: new Date(response.data.end.dateTime),
          location: response.data.location,
          attendees: response.data.attendees?.map((a: any) => a.email),
        },
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
          message: error.response?.data?.error?.message || 'Failed to update event',
          details: error.response?.data,
        },
      }
    }
  }

  /**
   * Delete a calendar event
   */
  async deleteEvent(
    calendarId: string = 'primary',
    eventId: string
  ): Promise<APIResponse<void>> {
    try {
      await this.client.delete(`/calendars/${calendarId}/events/${eventId}`)

      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
          message: error.response?.data?.error?.message || 'Failed to delete event',
          details: error.response?.data,
        },
      }
    }
  }

  /**
   * Get calendar event
   */
  async getEvent(
    calendarId: string = 'primary',
    eventId: string
  ): Promise<APIResponse<CalendarEvent>> {
    try {
      const response = await this.client.get(
        `/calendars/${calendarId}/events/${eventId}`
      )

      return {
        success: true,
        data: {
          id: response.data.id,
          title: response.data.summary,
          description: response.data.description,
          startTime: new Date(response.data.start.dateTime),
          endTime: new Date(response.data.end.dateTime),
          location: response.data.location,
          attendees: response.data.attendees?.map((a: any) => a.email),
        },
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
          message: error.response?.data?.error?.message || 'Failed to fetch event',
          details: error.response?.data,
        },
      }
    }
  }

  /**
   * List calendar events
   */
  async listEvents(
    calendarId: string = 'primary',
    timeMin?: Date,
    timeMax?: Date,
    maxResults: number = 250
  ): Promise<APIResponse<CalendarEvent[]>> {
    try {
      const params: any = {
        maxResults,
        singleEvents: true,
        orderBy: 'startTime',
      }

      if (timeMin) {
        params.timeMin = timeMin.toISOString()
      }

      if (timeMax) {
        params.timeMax = timeMax.toISOString()
      }

      const response = await this.client.get(`/calendars/${calendarId}/events`, {
        params,
      })

      const events = response.data.items.map((item: any) => ({
        id: item.id,
        title: item.summary,
        description: item.description,
        startTime: new Date(item.start.dateTime || item.start.date),
        endTime: new Date(item.end.dateTime || item.end.date),
        location: item.location,
        attendees: item.attendees?.map((a: any) => a.email),
      }))

      return {
        success: true,
        data: events,
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
          message: error.response?.data?.error?.message || 'Failed to list events',
          details: error.response?.data,
        },
      }
    }
  }

  /**
   * Get calendar list
   */
  async getCalendarList(): Promise<APIResponse<any[]>> {
    try {
      const response = await this.client.get('/users/me/calendarList')

      return {
        success: true,
        data: response.data.items,
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
          message: error.response?.data?.error?.message || 'Failed to fetch calendar list',
          details: error.response?.data,
        },
      }
    }
  }

  /**
   * Quick add event (natural language)
   */
  async quickAdd(
    calendarId: string = 'primary',
    text: string
  ): Promise<APIResponse<CalendarEvent>> {
    try {
      const response = await this.client.post(
        `/calendars/${calendarId}/events/quickAdd`,
        null,
        {
          params: { text },
        }
      )

      return {
        success: true,
        data: {
          id: response.data.id,
          title: response.data.summary,
          description: response.data.description,
          startTime: new Date(response.data.start.dateTime),
          endTime: new Date(response.data.end.dateTime),
        },
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
          message: error.response?.data?.error?.message || 'Failed to quick add event',
          details: error.response?.data,
        },
      }
    }
  }
}
