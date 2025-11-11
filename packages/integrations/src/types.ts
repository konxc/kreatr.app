export interface SocialMediaPost {
  id?: string
  platform: 'TIKTOK' | 'INSTAGRAM' | 'TWITTER'
  content: {
    text?: string
    mediaUrls: string[]
    hashtags: string[]
  }
  scheduledAt?: Date
  publishedAt?: Date
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  analytics?: PostAnalytics
}

export interface PostSchedule {
  postId: string
  platform: 'TIKTOK' | 'INSTAGRAM' | 'TWITTER'
  scheduledAt: Date
  content: {
    text?: string
    mediaUrls: string[]
    hashtags: string[]
  }
  accountId: string
}

export interface PlatformCredentials {
  platform: 'TIKTOK' | 'INSTAGRAM' | 'TWITTER'
  accessToken: string
  refreshToken?: string
  expiresAt?: Date
  userId: string
  username: string
}

export interface PostAnalytics {
  views: number
  likes: number
  comments: number
  shares: number
  saves?: number
  reach?: number
  impressions?: number
  engagementRate: number
  clickThroughRate?: number
}

export interface UserProfile {
  id: string
  username: string
  displayName: string
  bio: string
  followerCount: number
  followingCount: number
  postCount: number
  isVerified: boolean
  profileImageUrl: string
  website?: string
}

export interface MediaUploadResult {
  mediaId: string
  url: string
  type: 'image' | 'video'
  size: number
  duration?: number
}

export interface CalendarEvent {
  id?: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  location?: string
  attendees?: string[]
  metadata?: Record<string, any>
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  rateLimit?: {
    remaining: number
    resetAt: Date
  }
}

export interface PlatformLimits {
  maxTextLength: number
  maxMediaCount: number
  supportedMediaTypes: string[]
  maxVideoSize: number
  maxImageSize: number
  maxVideoDuration: number
}

export interface WebhookPayload {
  platform: 'TIKTOK' | 'INSTAGRAM' | 'TWITTER'
  event: string
  data: any
  timestamp: Date
  signature?: string
}