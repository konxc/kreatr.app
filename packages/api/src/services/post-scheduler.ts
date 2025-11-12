import { prisma } from '@kreatr/database'
import { TikTokAPI } from '@kreatr/integrations/src/tiktok'
import { InstagramAPI } from '@kreatr/integrations/src/instagram'
import { TwitterAPI } from '@kreatr/integrations/src/twitter'

/**
 * Post Scheduler Service
 * Handles automatic posting of scheduled content
 */
export class PostSchedulerService {
  private tiktokAPI: TikTokAPI
  private instagramAPI: InstagramAPI
  private twitterAPI: TwitterAPI

  constructor() {
    this.tiktokAPI = new TikTokAPI()
    this.instagramAPI = new InstagramAPI()
    this.twitterAPI = new TwitterAPI()
  }

  /**
   * Check and publish scheduled posts
   * Should be called every minute by cron job
   */
  async processScheduledPosts() {
    const now = new Date()
    
    console.log(`[Scheduler] Checking for posts to publish at ${now.toISOString()}`)

    // Find posts scheduled for now or earlier
    const dueContent = await prisma.content.findMany({
      where: {
        status: 'SCHEDULED',
        scheduledAt: {
          lte: now,
        },
      },
      include: {
        posts: {
          where: {
            status: 'SCHEDULED',
          },
          include: {
            account: true,
          },
        },
        author: true,
      },
    })

    console.log(`[Scheduler] Found ${dueContent.length} content items to publish`)

    // Process each content item
    for (const content of dueContent) {
      await this.publishContent(content)
    }
  }

  /**
   * Publish content to all scheduled platforms
   */
  private async publishContent(content: any) {
    console.log(`[Scheduler] Publishing content: ${content.title}`)

    const results = await Promise.allSettled(
      content.posts.map((post: any) => this.publishToPlat form(post, content))
    )

    // Check if all posts succeeded
    const allSucceeded = results.every((r) => r.status === 'fulfilled')

    // Update content status
    await prisma.content.update({
      where: { id: content.id },
      data: {
        status: allSucceeded ? 'PUBLISHED' : 'FAILED',
        publishedAt: allSucceeded ? new Date() : null,
      },
    })

    console.log(
      `[Scheduler] Content ${content.title} ${
        allSucceeded ? 'published successfully' : 'failed to publish'
      }`
    )
  }

  /**
   * Publish to specific platform
   */
  private async publishToPlatform(post: any, content: any) {
    const { platform, account } = post

    try {
      console.log(`[Scheduler] Publishing to ${platform} for account ${account.username}`)

      let platformId: string | undefined

      switch (platform) {
        case 'TIKTOK':
          platformId = await this.publishToTikTok(content, account)
          break
        case 'INSTAGRAM':
          platformId = await this.publishToInstagram(content, account)
          break
        case 'TWITTER':
          platformId = await this.publishToTwitter(content, account)
          break
        default:
          throw new Error(`Unsupported platform: ${platform}`)
      }

      // Update post status
      await prisma.post.update({
        where: { id: post.id },
        data: {
          status: 'PUBLISHED',
          platformId,
          publishedAt: new Date(),
        },
      })

      console.log(`[Scheduler] Successfully published to ${platform}`)
    } catch (error) {
      console.error(`[Scheduler] Failed to publish to ${platform}:`, error)

      // Update post status to failed
      await prisma.post.update({
        where: { id: post.id },
        data: {
          status: 'FAILED',
        },
      })

      throw error
    }
  }

  /**
   * Publish to TikTok
   */
  private async publishToTikTok(content: any, account: any): Promise<string> {
    // For now, return mock ID
    // In production, use actual TikTok API
    console.log(`[TikTok] Publishing: ${content.title}`)
    
    // const result = await this.tiktokAPI.uploadVideo({
    //   accessToken: account.accessToken,
    //   videoUrl: content.mediaUrls[0],
    //   caption: content.caption,
    //   hashtags: content.hashtags,
    // })
    
    // return result.videoId
    
    return `tiktok_${Date.now()}`
  }

  /**
   * Publish to Instagram
   */
  private async publishToInstagram(content: any, account: any): Promise<string> {
    console.log(`[Instagram] Publishing: ${content.title}`)
    
    // const result = await this.instagramAPI.publishPost({
    //   accessToken: account.accessToken,
    //   imageUrl: content.mediaUrls[0],
    //   caption: content.caption,
    // })
    
    // return result.mediaId
    
    return `instagram_${Date.now()}`
  }

  /**
   * Publish to Twitter
   */
  private async publishToTwitter(content: any, account: any): Promise<string> {
    console.log(`[Twitter] Publishing: ${content.title}`)
    
    // const result = await this.twitterAPI.createTweet({
    //   accessToken: account.accessToken,
    //   text: content.caption,
    //   mediaIds: content.mediaUrls,
    // })
    
    // return result.tweetId
    
    return `twitter_${Date.now()}`
  }

  /**
   * Retry failed posts
   */
  async retryFailedPosts() {
    const failedPosts = await prisma.post.findMany({
      where: {
        status: 'FAILED',
      },
      include: {
        content: true,
        account: true,
      },
      take: 10, // Limit retries
    })

    console.log(`[Scheduler] Retrying ${failedPosts.length} failed posts`)

    for (const post of failedPosts) {
      try {
        await this.publishToPlatform(post, post.content)
      } catch (error) {
        console.error(`[Scheduler] Retry failed for post ${post.id}:`, error)
      }
    }
  }

  /**
   * Get scheduler statistics
   */
  async getStats() {
    const [scheduled, publishing, published, failed] = await Promise.all([
      prisma.post.count({ where: { status: 'SCHEDULED' } }),
      prisma.post.count({ where: { status: 'PUBLISHING' } }),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.post.count({ where: { status: 'FAILED' } }),
    ])

    return {
      scheduled,
      publishing,
      published,
      failed,
      total: scheduled + publishing + published + failed,
    }
  }
}

// Export singleton instance
export const postScheduler = new PostSchedulerService()
