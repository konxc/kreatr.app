import axios, { AxiosInstance } from 'axios'
import type {
  SocialMediaPost,
  PostAnalytics,
  UserProfile,
  MediaUploadResult,
  APIResponse,
} from './types'

export class TikTokAPI {
  private client: AxiosInstance
  private baseURL = 'https://open.tiktokapis.com/v2'

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
   * Get OAuth authorization URL
   */
  getAuthorizationUrl(
    clientKey: string,
    redirectUri: string,
    state: string,
    scope: string[] = ['user.info.basic', 'video.list', 'video.upload']
  ): string {
    const params = new URLSearchParams({
      client_key: clientKey,
      scope: scope.join(','),
      response_type: 'code',
      redirect_uri: redirectUri,
      state,
    })

    return `https://www.tiktok.com/v2/auth/authorize?${params.toString()}`
  }

  /**
   * Exchange authorization code for access token
   */
  async getAccessToken(
    clientKey: string,
    clientSecret: string,
    code: string,
    redirectUri: string
  ): Promise<{
    accessToken: string
    refreshToken: string
    expiresIn: number
    openId: string
  }> {
    const response = await axios.post(
      'https://open.tiktokapis.com/v2/oauth/token/',
      {
        client_key: clientKey,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }
    )

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
      openId: response.data.open_id,
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(
    clientKey: string,
    refreshToken: string
  ): Promise<{
    accessToken: string
    refreshToken: string
    expiresIn: number
  }> {
    const response = await axios.post(
      'https://open.tiktokapis.com/v2/oauth/token/',
      {
        client_key: clientKey,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }
    )

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
    }
  }

  /**
   * Get user profile information
   */
  async getUserProfile(): Promise<APIResponse<UserProfile>> {
    try {
      const response = await this.client.get('/user/info/', {
        params: {
          fields: 'open_id,union_id,avatar_url,display_name,bio_description,is_verified,follower_count,following_count,likes_count,video_count',
        },
      })

      const data = response.data.data.user

      return {
        success: true,
        data: {
          id: data.open_id,
          username: data.display_name,
          displayName: data.display_name,
          bio: data.bio_description || '',
          followerCount: data.follower_count || 0,
          followingCount: data.following_count || 0,
          postCount: data.video_count || 0,
          isVerified: data.is_verified || false,
          profileImageUrl: data.avatar_url || '',
        },
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
          message: error.response?.data?.error?.message || 'Failed to fetch user profile',
          details: error.response?.data,
        },
      }
    }
  }

  /**
   * Get user's videos
   */
  async getUserVideos(
    cursor?: string,
    maxCount: number = 20
  ): Promise<APIResponse<{
    videos: any[]
    cursor: string
    hasMore: boolean
  }>> {
    try {
      const response = await this.client.post('/video/list/', {
        max_count: maxCount,
        cursor: cursor || 0,
      })

      return {
        success: true,
        data: {
          videos: response.data.data.videos || [],
          cursor: response.data.data.cursor,
          hasMore: response.data.data.has_more,
        },
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
          message: error.response?.data?.error?.message || 'Failed to fetch videos',
          details: error.response?.data,
        },
      }
    }
  }

  /**
   * Initialize video upload
   */
  async initializeVideoUpload(
    videoSize: number
  ): Promise<APIResponse<{
    uploadUrl: string
    uploadId: string
  }>> {
    try {
      const response = await this.client.post('/post/publish/video/init/', {
        source_info: {
          source: 'FILE_UPLOAD',
          video_size: videoSize,
        },
      })

      return {
        success: true,
        data: {
          uploadUrl: response.data.data.upload_url,
          uploadId: response.data.data.publish_id,
        },
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
          message: error.response?.data?.error?.message || 'Failed to initialize upload',
          details: error.response?.data,
        },
      }
    }
  }

  /**
   * Upload video file
   */
  async uploadVideo(
    uploadUrl: string,
    videoBuffer: Buffer
  ): Promise<APIResponse<void>> {
    try {
      await axios.put(uploadUrl, videoBuffer, {
        headers: {
          'Content-Type': 'video/mp4',
        },
      })

      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'UPLOAD_FAILED',
          message: 'Failed to upload video',
          details: error.message,
        },
      }
    }
  }

  /**
   * Publish video
   */
  async publishVideo(
    publishId: string,
    caption: string,
    privacyLevel: 'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 'SELF_ONLY' = 'PUBLIC_TO_EVERYONE',
    disableComment: boolean = false,
    disableDuet: boolean = false,
    disableStitch: boolean = false
  ): Promise<APIResponse<{ publishId: string }>> {
    try {
      const response = await this.client.post('/post/publish/video/init/', {
        post_info: {
          title: caption,
          privacy_level: privacyLevel,
          disable_comment: disableComment,
          disable_duet: disableDuet,
          disable_stitch: disableStitch,
        },
        source_info: {
          source: 'FILE_UPLOAD',
        },
      })

      return {
        success: true,
        data: {
          publishId: response.data.data.publish_id,
        },
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
          message: error.response?.data?.error?.message || 'Failed to publish video',
          details: error.response?.data,
        },
      }
    }
  }

  /**
   * Get video analytics
   */
  async getVideoAnalytics(videoId: string): Promise<APIResponse<PostAnalytics>> {
    try {
      const response = await this.client.get(`/video/query/`, {
        params: {
          fields: 'id,view_count,like_count,comment_count,share_count',
          filters: {
            video_ids: [videoId],
          },
        },
      })

      const video = response.data.data.videos[0]

      return {
        success: true,
        data: {
          views: video.view_count || 0,
          likes: video.like_count || 0,
          comments: video.comment_count || 0,
          shares: video.share_count || 0,
          engagementRate: video.view_count > 0 
            ? ((video.like_count + video.comment_count + video.share_count) / video.view_count) * 100 
            : 0,
        },
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
          message: error.response?.data?.error?.message || 'Failed to fetch analytics',
          details: error.response?.data,
        },
      }
    }
  }

  /**
   * Check rate limit
   */
  getRateLimitInfo(headers: any): {
    remaining: number
    resetAt: Date
  } | null {
    const remaining = headers['x-rate-limit-remaining']
    const reset = headers['x-rate-limit-reset']

    if (!remaining || !reset) return null

    return {
      remaining: parseInt(remaining),
      resetAt: new Date(parseInt(reset) * 1000),
    }
  }
}
