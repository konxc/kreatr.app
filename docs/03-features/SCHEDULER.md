# Content Scheduler

Complete guide to kreatr.app's content scheduling system.

## Overview

The Content Scheduler allows you to plan, schedule, and automatically publish content across multiple social media platforms (TikTok, Instagram, Twitter).

## Features

### 1. Calendar View
- **Month/Week/Day Views** - Visualize your content schedule
- **Drag & Drop** - Easily reschedule posts
- **Color-Coded** - Different colors for each platform
- **Interactive** - Click events to edit or view details

### 2. Multi-Platform Scheduling
- Schedule to multiple platforms simultaneously
- Platform-specific optimizations
- Automatic posting at scheduled time
- Retry failed posts

### 3. Queue Management
- View upcoming posts
- See next post countdown
- Track publishing status
- Cancel or reschedule anytime

## How to Use

### Schedule a Post

1. **Create Content** first in Content Library
2. Go to **Scheduler** page
3. Click **"Schedule Post"** button
4. Select:
   - Content to schedule
   - Date & time
   - Target platforms (TikTok, Instagram, Twitter)
5. Click **"Schedule Post"**

### Reschedule a Post

**Method 1: Drag & Drop (Calendar View)**
- Simply drag the event to a new date/time
- Changes are saved automatically

**Method 2: Edit Modal**
- Click on the scheduled post
- Update date/time
- Click "Save"

### Cancel a Scheduled Post

1. Find the post in calendar or list view
2. Click **"Cancel"** button
3. Confirm cancellation
4. Post returns to draft status

## Calendar Views

### Month View
- See all scheduled posts for the month
- Best for long-term planning
- Shows post count per day

### Week View
- Detailed view of the week
- Shows exact times
- Better for fine-tuning schedule

### Day View
- Hour-by-hour schedule
- Perfect for busy days
- See all details

## Auto-Posting System

### How It Works

```
1. User schedules post
   ↓
2. Post stored in database (status: SCHEDULED)
   ↓
3. Cron job runs every minute
   ↓
4. Checks for posts due now
   ↓
5. Publishes to selected platforms
   ↓
6. Updates status (PUBLISHED/FAILED)
   ↓
7. Records analytics
```

### Cron Job

The scheduler uses a cron job that runs every minute:

**Endpoint:** `/api/cron/scheduler`
**Schedule:** `* * * * *` (every minute)
**Platform:** Vercel Cron (production) or manual trigger (development)

### Platform Publishing

#### TikTok
- Uploads video to TikTok
- Adds caption and hashtags
- Sets privacy settings
- Returns video ID

#### Instagram
- Uploads photo/video
- Adds caption
- Publishes to feed
- Returns media ID

#### Twitter
- Creates tweet
- Uploads media (if any)
- Returns tweet ID

## Queue Status

### Statistics

- **Scheduled This Week** - Posts in next 7 days
- **Next Post In** - Countdown to next post
- **Total Scheduled** - All upcoming posts

### Next Post

Shows:
- Title
- Scheduled time
- Target platforms
- Time until posting

## API Endpoints

### Get Scheduled Posts

```typescript
trpc.scheduler.getScheduled.useQuery({
  startDate: new Date(),
  endDate: new Date(),
  workspaceId: 'optional',
})
```

### Schedule a Post

```typescript
trpc.scheduler.schedulePost.useMutation({
  contentId: 'content-id',
  scheduledAt: new Date(),
  platforms: ['TIKTOK', 'INSTAGRAM'],
})
```

### Reschedule a Post

```typescript
trpc.scheduler.reschedulePost.useMutation({
  contentId: 'content-id',
  newScheduledAt: new Date(),
})
```

### Cancel Scheduled Post

```typescript
trpc.scheduler.cancelScheduled.useMutation({
  contentId: 'content-id',
})
```

### Get Queue Status

```typescript
trpc.scheduler.getQueueStatus.useQuery()
```

## Best Practices

### Timing

- **Peak Hours** - Schedule during audience's active hours
- **Consistency** - Post regularly (daily/weekly)
- **Time Zones** - Consider your audience's timezone
- **Platform-Specific** - Different platforms have different peak times

### Content Planning

- **Batch Creation** - Create multiple posts at once
- **Content Calendar** - Plan weeks/months ahead
- **Mix Content Types** - Vary your content
- **Test Times** - Experiment with posting times

### Platform Strategy

#### TikTok
- Best times: 6-10 PM
- Frequency: 1-3 times per day
- Content: Short, engaging videos

#### Instagram
- Best times: 11 AM - 1 PM, 7-9 PM
- Frequency: 1-2 times per day
- Content: High-quality images/videos

#### Twitter
- Best times: 8-10 AM, 6-9 PM
- Frequency: 3-5 times per day
- Content: Short updates, threads

## Troubleshooting

### Post Not Publishing

**Check:**
1. Social account is connected
2. Access token is valid
3. Content meets platform requirements
4. Scheduled time is in the future

**Solution:**
- Reconnect social account
- Check cron job logs
- Retry failed post manually

### Drag & Drop Not Working

**Check:**
1. Browser supports drag & drop
2. JavaScript is enabled
3. No console errors

**Solution:**
- Use Edit modal instead
- Try different browser
- Clear cache

### Wrong Timezone

**Check:**
1. Browser timezone settings
2. Server timezone configuration

**Solution:**
- Set timezone in settings
- Use UTC for consistency

## Development

### Manual Trigger (Development Only)

```bash
# Trigger cron job manually
curl -X POST http://localhost:3000/api/cron/scheduler
```

### Testing

```typescript
// Test scheduling
const result = await caller.scheduler.schedulePost({
  contentId: 'test-id',
  scheduledAt: new Date(Date.now() + 60000), // 1 minute from now
  platforms: ['TIKTOK'],
})

expect(result.success).toBe(true)
```

### Logs

```bash
# View cron job logs
vercel logs --follow

# Filter scheduler logs
vercel logs | grep "\[Scheduler\]"
```

## Configuration

### Environment Variables

```env
# Cron secret for security
CRON_SECRET="your-secret-key"

# Social media API keys
TIKTOK_CLIENT_KEY="..."
TIKTOK_CLIENT_SECRET="..."
INSTAGRAM_CLIENT_ID="..."
INSTAGRAM_CLIENT_SECRET="..."
TWITTER_API_KEY="..."
TWITTER_API_SECRET="..."
```

### Vercel Cron

```json
{
  "crons": [
    {
      "path": "/api/cron/scheduler",
      "schedule": "* * * * *"
    }
  ]
}
```

## Limitations

### Free Tier
- 100 scheduled posts per month
- 3 platforms maximum
- 1-minute cron interval

### Pro Tier
- Unlimited scheduled posts
- All platforms
- Real-time posting

## Future Enhancements

- [ ] Recurring posts (daily/weekly)
- [ ] Best time suggestions (AI-powered)
- [ ] Bulk scheduling
- [ ] Content templates
- [ ] A/B testing
- [ ] Auto-repost popular content

## Support

- **Issues:** [GitHub Issues](https://github.com/kreatr-app/kreatr/issues)
- **Docs:** [Documentation](../README.md)
- **Email:** support@kreatr.app

---

**Last Updated:** 2024-01-15
**Version:** 0.1.0
