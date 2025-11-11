import axios, { AxiosInstance } from 'axios'
import type {
  UserProfile,
  PostAnalytics,
  MediaUploadResult,
  APIResponse,
} from './types'

export class InstagramAPI {
  private client: AxiosInstance
  private baseURL = 'https://graph.instagram.com'

  constructor(accessToken?: string) {
    this.client = axios.create({
      baseURL: this.baseURL,
      params: {
        access_token: accessToken,
      },
    })
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId: string = 'me'): Promise<APIResponse<UserProfile>> {
    try {
      const response = await this.client.get(`/${userId}`, {
        params: {
          fields: 'id,username,account_type,media_count,followers_count,follows_count',
        },
      })

      return {
        success: true,
        data: {
          id: response.data.id,
          username: response.data.username,
          displayName: response.data.username,
          bio: '',
          followerCount: response.data.followers_count || 0,
          followingCount: response.data.follows_count || 0,
          postCount: response.data.media_count || 0,
          isVerified: false,
          profileImageUrl: '',
        },
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
          message: error.response?.data?.error?.message || 'Failed to fetch profile',
          details: error.response?.data,
        },
      }
    }
  }

  /**
   * Create media container for image
   */
  async createImageContainer(
    userId: string,
    imageUrl: string,
    caption?: string
  ): Promise<APIResponse<{ containerId: string }>> {
    try {
      const response = await this.client.post(`/${userId}/media`, {
        image_url: imageUrl,
        caption: caption || '',
      })

      return {
        success: true,
        data: {
          containerId: response.data.id,
        },
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
          message: error.response?.data?.error?.message || 'Failed to create container',
          details: error.response?.data,
        },
      }
    }
  }

  /**
   * Create media container for carousel
   */
  async createCarouselContainer(
    userId: string,
    children: string[],
    caption?: string
  ): Promise<APIResponse<{ containerId: string }>> {
    try {
      const response = await this.client.post(`/${userId}/media`, {
        media_type: 'CAROUSEL',
        children: children,
        caption: caption || '',
      })

      return {
        success: true,
        data: {
          containerId: response.data.id,
        },
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
          message: error.response?.data?.error?.message || 'Failed to create carousel',
          details: error.response?.data,
        },
      }
    }
  }

  /**
   * Publish media container
   */
  async publishMedia(
    userId: string,
    containerId: string
  ): Promise<APIResponse<{ mediaId: string }>> {
    try {
      const response = await this.client.post(`/${userId}/media_publish`, {
        creation_id: containerId,
      })

      return {
        success: true,
        data: {
          mediaId: response.data.id,
        },
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
          message: error.response?.data?.error?.message || 'Failed to publish media',
          details: error.response?.data,
        },
      }
    }
  }

  /**
   * Get media insights
   */
  async getMediaInsights(mediaId: string): Promise<APIResponse<PostAnalytics>> {
    try {
      const response = await this.client.get(`/${mediaId}/insights`, {
        params: {
          metric: 'engagement,impressions,reach,saved,likes,comments,shares',
        },
      })

      const metrics = response.data.data.reduce((acc: any, item: any) => {
        acc[item.name] = item.values[0].value
        return acc
      }, {})

      return {
        success: true,
        data: {
          views: metrics.impressions || 0,
          likes: metrics.likes || 0,
          comments: metrics.comments || 0,
          shares: metrics.shares || 0,
          saves: metrics.saved || 0,
          reach: metrics.reach || 0,
          impressions: metrics.impressions || 0,
          engagementRate: metrics.impressions > 0 
            ? (metrics.engagement / metrics.impressions) * 100 
            : 0,
        },
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
          message: error.response?.data?.error?.message || 'Failed to fetch insights',
          details: error.response?.data,
        },
      }
    }
  }

  /**
   * Get user media
   */
  async getUserMedia(
    userId: string = 'me',
    limit: number = 25
  ): Promise<APIResponse<any[]>> {
    try {
      const response = await this.client.get(`/${userId}/media`, {
        params: {
          fields: 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count',
          limit,
        },
      })

      return {
        success: true,
        data: response.data.data,
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
          message: error.response?.data?.error?.message || 'Failed to fetch media',
          details: error.response?.data,
        },
      }
    }
  }

  /**
   * Get hashtag search
   */
  async searchHashtag(
    userId: string,
    hashtag: string
  ): Promise<APIResponse<{ hashtagId: string }>> {
    try {
      const response = await this.client.get(`/ig_hashtag_search`, {
        params: {
          user_id: userId,
          q: hashtag,
        },
      })

      return {
        success: true,
        data: {
          hashtagId: response.data.data[0]?.id,
        },
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
          message: error.response?.data?.error?.message || 'Failed to search hashtag',
          details: error.response?.data,
        },
      }
    }
  }

  /**
   * Get hashtag top media
   */
  async getHashtagTopMedia(
    hashtagId: string,
    userId: string
  ): Promise<APIResponse<any[]>> {
    try {
      const response = await this.client.get(`/${hashtagId}/top_media`, {
        params: {
          user_id: userId,
          fields: 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count',
        },
      })

      return {
        success: true,
        data: response.data.data,
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
          message: error.response?.data?.error?.message || 'Failed to fetch hashtag media',
          details: error.response?.data,
        },
      }
    }
  }
}
