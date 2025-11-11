import axios, { AxiosInstance } from 'axios'
import type {
  UserProfile,
  PostAnalytics,
  MediaUploadResult,
  APIResponse,
} from './types'

export class TwitterAPI {
  private client: AxiosInstance
  private baseURL = 'https://api.twitter.com/2'

  constructor(bearerToken?: string) {
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        ...(bearerToken && { Authorization: `Bearer ${bearerToken}` }),
      },
    })
  }

  /**
   * Get user profile by username
   */
  async getUserByUsername(username: string): Promise<APIResponse<UserProfile>> {
    try {
      const response = await this.client.get(`/users/by/username/${username}`, {
        params: {
          'user.fields': 'id,name,username,description,profile_image_url,public_metrics,verified',
        },
      })

      const user = response.data.data

      return {
        success: true,
        data: {
          id: user.id,
          username: user.username,
          displayName: user.name,
          bio: user.description || '',
          followerCount: user.public_metrics?.followers_count || 0,
          followingCount: user.public_metrics?.following_count || 0,
          postCount: user.public_metrics?.tweet_count || 0,
          isVerified: user.verified || false,
          profileImageUrl: user.profile_image_url || '',
        },
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.errors?.[0]?.type || 'UNKNOWN_ERROR',
          message: error.response?.data?.errors?.[0]?.message || 'Failed to fetch user',
          details: error.response?.data,
        },
      }
    }
  }

  /**
   * Get authenticated user
   */
  async getMe(): Promise<APIResponse<UserProfile>> {
    try {
      const response = await this.client.get('/users/me', {
        params: {
          'user.fields': 'id,name,username,description,profile_image_url,public_metrics,verified',
        },
      })

      const user = response.data.data

      return {
        success: true,
        data: {
          id: user.id,
          username: user.username,
          displayName: user.name,
          bio: user.description || '',
          followerCount: user.public_metrics?.followers_count || 0,
          followingCount: user.public_metrics?.following_count || 0,
          postCount: user.public_metrics?.tweet_count || 0,
          isVerified: user.verified || false,
          profileImageUrl: user.profile_image_url || '',
        },
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.errors?.[0]?.type || 'UNKNOWN_ERROR',
          message: error.response?.data?.errors?.[0]?.message || 'Failed to fetch user',
          details: error.response?.data,
        },
      }
    }
  }

  /**
   * Create a tweet
   */
  async createTweet(
    text: string,
    mediaIds?: string[],
    replySettings?: 'everyone' | 'mentionedUsers' | 'following'
  ): Promise<APIResponse<{ tweetId: string; text: string }>> {
    try {
      const payload: any = { text }

      if (mediaIds && mediaIds.length > 0) {
        payload.media = {
          media_ids: mediaIds,
        }
      }

      if (replySettings) {
        payload.reply_settings = replySettings
      }

      const response = await this.client.post('/tweets', payload)

      return {
        success: true,
        data: {
          tweetId: response.data.data.id,
          text: response.data.data.text,
        },
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.errors?.[0]?.type || 'UNKNOWN_ERROR',
          message: error.response?.data?.errors?.[0]?.message || 'Failed to create tweet',
          details: error.response?.data,
        },
      }
    }
  }

  /**
   * Delete a tweet
   */
  async deleteTweet(tweetId: string): Promise<APIResponse<{ deleted: boolean }>> {
    try {
      const response = await this.client.delete(`/tweets/${tweetId}`)

      return {
        success: true,
        data: {
          deleted: response.data.data.deleted,
        },
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.errors?.[0]?.type || 'UNKNOWN_ERROR',
          message: error.response?.data?.errors?.[0]?.message || 'Failed to delete tweet',
          details: error.response?.data,
        },
      }
    }
  }

  /**
   * Get tweet by ID
   */
  async getTweet(tweetId: string): Promise<APIResponse<any>> {
    try {
      const response = await this.client.get(`/tweets/${tweetId}`, {
        params: {
          'tweet.fields': 'id,text,created_at,public_metrics,attachments',
          expansions: 'author_id,attachments.media_keys',
          'media.fields': 'url,preview_image_url',
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
          code: error.response?.data?.errors?.[0]?.type || 'UNKNOWN_ERROR',
          message: error.response?.data?.errors?.[0]?.message || 'Failed to fetch tweet',
          details: error.response?.data,
        },
      }
    }
  }

  /**
   * Get tweet metrics
   */
  async getTweetMetrics(tweetId: string): Promise<APIResponse<PostAnalytics>> {
    try {
      const response = await this.client.get(`/tweets/${tweetId}`, {
        params: {
          'tweet.fields': 'public_metrics',
        },
      })

      const metrics = response.data.data.public_metrics

      return {
        success: true,
        data: {
          views: metrics.impression_count || 0,
          likes: metrics.like_count || 0,
          comments: metrics.reply_count || 0,
          shares: metrics.retweet_count || 0,
          impressions: metrics.impression_count || 0,
          engagementRate: metrics.impression_count > 0 
            ? ((metrics.like_count + metrics.reply_count + metrics.retweet_count) / metrics.impression_count) * 100 
            : 0,
        },
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.errors?.[0]?.type || 'UNKNOWN_ERROR',
          message: error.response?.data?.errors?.[0]?.message || 'Failed to fetch metrics',
          details: error.response?.data,
        },
      }
    }
  }

  /**
   * Get user tweets
   */
  async getUserTweets(
    userId: string,
    maxResults: number = 10
  ): Promise<APIResponse<any[]>> {
    try {
      const response = await this.client.get(`/users/${userId}/tweets`, {
        params: {
          max_results: maxResults,
          'tweet.fields': 'id,text,created_at,public_metrics',
        },
      })

      return {
        success: true,
        data: response.data.data || [],
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.errors?.[0]?.type || 'UNKNOWN_ERROR',
          message: error.response?.data?.errors?.[0]?.message || 'Failed to fetch tweets',
          details: error.response?.data,
        },
      }
    }
  }

  /**
   * Upload media (requires v1.1 API)
   */
  async uploadMedia(
    mediaData: Buffer,
    mediaType: 'image/jpeg' | 'image/png' | 'video/mp4'
  ): Promise<APIResponse<MediaUploadResult>> {
    try {
      // Note: This uses Twitter API v1.1 for media upload
      const uploadClient = axios.create({
        baseURL: 'https://upload.twitter.com/1.1',
        headers: this.client.defaults.headers,
      })

      const formData = new FormData()
      formData.append('media', new Blob([mediaData], { type: mediaType }))

      const response = await uploadClient.post('/media/upload.json', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return {
        success: true,
        data: {
          mediaId: response.data.media_id_string,
          url: response.data.media_url || '',
          type: mediaType.startsWith('image') ? 'image' : 'video',
          size: response.data.size,
        },
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'UPLOAD_FAILED',
          message: 'Failed to upload media',
          details: error.message,
        },
      }
    }
  }

  /**
   * Search recent tweets
   */
  async searchTweets(
    query: string,
    maxResults: number = 10
  ): Promise<APIResponse<any[]>> {
    try {
      const response = await this.client.get('/tweets/search/recent', {
        params: {
          query,
          max_results: maxResults,
          'tweet.fields': 'id,text,created_at,public_metrics,author_id',
        },
      })

      return {
        success: true,
        data: response.data.data || [],
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.errors?.[0]?.type || 'UNKNOWN_ERROR',
          message: error.response?.data?.errors?.[0]?.message || 'Failed to search tweets',
          details: error.response?.data,
        },
      }
    }
  }
}
