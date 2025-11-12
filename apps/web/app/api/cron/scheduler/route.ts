import { NextRequest, NextResponse } from 'next/server'
import { postScheduler } from '@kreatr/api/src/services/post-scheduler'

/**
 * Cron job endpoint for processing scheduled posts
 * Should be called every minute by a cron service (Vercel Cron, GitHub Actions, etc.)
 * 
 * Security: Verify cron secret to prevent unauthorized access
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret) {
      console.error('[Cron] CRON_SECRET not configured')
      return NextResponse.json(
        { error: 'Cron not configured' },
        { status: 500 }
      )
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      console.error('[Cron] Unauthorized cron request')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('[Cron] Starting scheduled post processing...')

    // Process scheduled posts
    await postScheduler.processScheduledPosts()

    // Get stats
    const stats = await postScheduler.getStats()

    console.log('[Cron] Scheduled post processing complete', stats)

    return NextResponse.json({
      success: true,
      message: 'Scheduled posts processed',
      stats,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Cron] Error processing scheduled posts:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

/**
 * Manual trigger endpoint (for testing)
 * POST /api/cron/scheduler
 */
export async function POST(request: NextRequest) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Manual trigger not allowed in production' },
        { status: 403 }
      )
    }

    console.log('[Cron] Manual trigger - processing scheduled posts...')

    await postScheduler.processScheduledPosts()
    const stats = await postScheduler.getStats()

    return NextResponse.json({
      success: true,
      message: 'Manual trigger successful',
      stats,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Cron] Manual trigger error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
