export interface ContentIdea {
  id: string
  title: string
  description: string
  platform: 'TIKTOK' | 'INSTAGRAM' | 'TWITTER'
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedEngagement: 'low' | 'medium' | 'high'
  hashtags: string[]
  hooks: string[]
  callToAction?: string
}

export interface GeneratedCaption {
  caption: string
  hashtags: string[]
  hooks: string[]
  callToAction?: string
  tone: string
  length: number
}

export interface AIGenerationOptions {
  model?: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3-sonnet' | 'claude-3-haiku'
  temperature?: number
  maxTokens?: number
  platform?: 'TIKTOK' | 'INSTAGRAM' | 'TWITTER'
  tone?: 'casual' | 'professional' | 'funny' | 'inspirational' | 'educational'
  audience?: string
  brandVoice?: string
}

export interface BrainstormResult {
  ideas: ContentIdea[]
  trends: string[]
  recommendations: string[]
  totalCreditsUsed: number
}

export interface TikTokProfile {
  username: string
  displayName: string
  followerCount: number
  followingCount: number
  likeCount: number
  videoCount: number
  bio: string
  isVerified: boolean
  recentVideos: TikTokVideo[]
}

export interface TikTokVideo {
  id: string
  description: string
  viewCount: number
  likeCount: number
  commentCount: number
  shareCount: number
  hashtags: string[]
  createdAt: string
}

export interface ContentAnalysis {
  topPerformingTopics: string[]
  bestPostingTimes: string[]
  audienceInsights: {
    demographics: Record<string, number>
    interests: string[]
    engagementPatterns: Record<string, number>
  }
  contentGaps: string[]
  competitorAnalysis?: {
    similarCreators: string[]
    trendingContent: string[]
  }
}

export interface HashtagSuggestion {
  hashtag: string
  popularity: 'low' | 'medium' | 'high'
  competition: 'low' | 'medium' | 'high'
  relevance: number
  estimatedReach: number
}

export interface VoiceOverScript {
  script: string
  timing: {
    start: number
    end: number
    text: string
  }[]
  emotions: string[]
  pace: 'slow' | 'medium' | 'fast'
  totalDuration: number
}