# Design Document: Community Marketplace

## Overview

The Community Marketplace feature transforms kreatr.app into a comprehensive ecosystem where creators, engineers, and prompters can showcase their work, connect with clients, and participate in a vibrant community. This feature integrates external community platforms (Discord, Reddit, GitHub, Huggingface), provides a marketplace for creator services, enables portfolio showcasing, and supports BYOK (Bring Your Own Key) functionality for AI services.

The design follows a modular architecture that integrates seamlessly with the existing Next.js 16 application, leveraging the current tRPC API structure, Prisma database, and component library.

## Architecture

### Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: tRPC v11, Prisma ORM, PostgreSQL
- **Authentication**: NextAuth.js (existing)
- **File Storage**: Cloud storage for portfolio images (S3/Cloudinary)
- **API Integration**: External APIs for community metrics (Discord, GitHub, etc.)
- **Encryption**: crypto-js for API key encryption

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Landing Page                             │
│              (with Community CTA)                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Community Hub Page                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  External    │  │  Marketplace │  │  Community   │      │
│  │  Platforms   │  │  Browse      │  │  Highlights  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
┌──────────────────┐    ┌──────────────────┐
│  Creator Profile │    │  BYOK Settings   │
│  & Portfolio     │    │  Management      │
└──────────────────┘    └──────────────────┘
```

### File Structure

```
apps/web/
├── app/
│   ├── (marketing)/
│   │   └── community/
│   │       ├── page.tsx                    # Community hub
│   │       └── marketplace/
│   │           └── page.tsx                # Marketplace browse
│   ├── (dashboard)/
│   │   └── dashboard/
│   │       ├── portfolio/
│   │       │   ├── page.tsx                # Portfolio management
│   │       │   └── edit/
│   │       │       └── page.tsx            # Portfolio editor
│   │       └── api-keys/
│   │           └── page.tsx                # BYOK settings
│   └── portfolio/
│       └── [username]/
│           └── page.tsx                    # Public portfolio view
├── components/
│   ├── community/
│   │   ├── external-platform-card.tsx
│   │   ├── community-stats.tsx
│   │   └── activity-feed.tsx
│   ├── marketplace/
│   │   ├── creator-card.tsx
│   │   ├── creator-filters.tsx
│   │   └── contact-modal.tsx
│   └── portfolio/
│       ├── portfolio-item-card.tsx
│       ├── portfolio-editor.tsx
│       └── portfolio-gallery.tsx
└── lib/
    └── encryption.ts                       # API key encryption utilities

packages/api/src/routers/
├── community.ts                            # Community endpoints
├── marketplace.ts                          # Marketplace endpoints
├── portfolio.ts                            # Portfolio endpoints
└── byok.ts                                 # BYOK endpoints

packages/database/prisma/
└── schema.prisma                           # Extended with new models
```


## Components and Interfaces

### 1. Landing Page CTA Integration

**Component**: `CommunityCallToAction`

**Purpose**: Add prominent CTA on the landing page to drive traffic to the community hub

**Implementation**:
- Add CTA button in hero section alongside existing "Mulai Gratis" and "Lihat Demo"
- Add community section before footer with highlights
- Use existing Button component from UI library

**Props Interface**:
```typescript
interface CommunityCallToActionProps {
  variant?: 'hero' | 'section' | 'inline';
  showStats?: boolean;
}
```

**Visual Design**:
- Hero variant: Tertiary button with community icon
- Section variant: Full-width section with gradient background
- Display member count and active projects stats

### 2. Community Hub Page

**Route**: `/community`

**Purpose**: Central hub for community engagement and marketplace access

**Layout Structure**:
```typescript
interface CommunityHubLayout {
  header: {
    title: string;
    description: string;
  };
  externalPlatforms: ExternalPlatformCard[];
  communityStats: CommunityStats;
  activityFeed: ActivityItem[];
  marketplaceCTA: MarketplaceCTA;
}
```

**Sections**:
1. Hero section with community overview
2. External platform integration cards (4 platforms)
3. Community statistics dashboard
4. Recent activity feed
5. Featured creators/projects
6. Marketplace CTA section

### 3. External Platform Cards

**Component**: `ExternalPlatformCard`

**Purpose**: Display integration with Discord, Reddit, GitHub, and Huggingface

**Props Interface**:
```typescript
interface ExternalPlatformCardProps {
  platform: 'discord' | 'reddit' | 'github' | 'huggingface';
  memberCount?: number;
  activityLevel?: 'low' | 'medium' | 'high';
  description: string;
  link: string;
}
```

**Features**:
- Platform-specific branding and icons
- Live member count (cached, refreshed every 5 minutes)
- Activity indicator
- "Join Now" CTA button
- Opens in new tab

**Data Source**:
- Discord: Discord API for server stats
- GitHub: GitHub API for repository stats
- Reddit: Reddit API for subreddit stats
- Huggingface: Huggingface API for organization stats

### 4. Marketplace Browse Page

**Route**: `/community/marketplace`

**Purpose**: Browse and discover creator profiles and portfolios

**Layout Structure**:
```typescript
interface MarketplaceBrowseLayout {
  filters: CreatorFilters;
  searchBar: SearchInput;
  creatorGrid: CreatorCard[];
  pagination: Pagination;
}
```

**Filtering Options**:
- Category: AI Content Creator, Prompter, Creative Director, Technical Engineer
- Skills: Tags like "TikTok", "Instagram", "AI Prompting", "Video Editing"
- Availability: Available, Busy, Not Available
- Rating: 4+ stars, 3+ stars, etc.
- Sort: Newest, Most Popular, Highest Rated

### 5. Creator Card Component

**Component**: `CreatorCard`

**Purpose**: Display creator profile summary in marketplace grid

**Props Interface**:
```typescript
interface CreatorCardProps {
  creator: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    bio: string;
    skills: string[];
    availability: 'available' | 'busy' | 'unavailable';
    rating?: number;
    reviewCount?: number;
    portfolioPreview: PortfolioItem[];
  };
}
```

**Visual Design**:
- Card with hover lift effect
- Avatar with availability indicator
- Display name and username
- Short bio (truncated)
- Skill tags (max 3 visible)
- Portfolio preview (3 thumbnail images)
- Rating stars and review count
- "View Profile" button


### 6. Portfolio Management Dashboard

**Route**: `/dashboard/portfolio`

**Purpose**: Allow creators to manage their portfolio items

**Layout Structure**:
```typescript
interface PortfolioDashboardLayout {
  header: {
    title: string;
    createButton: Button;
  };
  portfolioItems: PortfolioItemCard[];
  emptyState?: EmptyState;
}
```

**Features**:
- Grid view of portfolio items
- Create new portfolio item button
- Edit/Delete actions per item
- Drag-and-drop reordering
- Visibility toggle (public/private)
- Preview button to see public view

### 7. Portfolio Editor

**Route**: `/dashboard/portfolio/edit/[id]` or `/dashboard/portfolio/new`

**Purpose**: Create or edit portfolio items

**Form Fields**:
```typescript
interface PortfolioItemForm {
  title: string;                    // Required
  description: string;              // Required, rich text
  category: PortfolioCategory;      // Required
  images: File[];                   // Max 10 images
  projectUrl?: string;              // Optional external link
  tags: string[];                   // Skills/technologies used
  visibility: 'public' | 'private'; // Default: public
  featured: boolean;                // Highlight on profile
}

enum PortfolioCategory {
  AI_CONTENT = 'AI Content',
  PROMPTS = 'Prompts',
  CREATIVE_DIRECTION = 'Creative Direction',
  VIDEO_EDITING = 'Video Editing',
  SOCIAL_MEDIA = 'Social Media Management',
  OTHER = 'Other'
}
```

**Validation**:
- Title: 5-100 characters
- Description: 50-2000 characters
- Images: Max 10 files, 5MB each, formats: jpg, png, webp
- Tags: Max 10 tags, 2-30 characters each

### 8. Public Portfolio Page

**Route**: `/portfolio/[username]`

**Purpose**: Display creator's public portfolio to visitors

**Layout Structure**:
```typescript
interface PublicPortfolioLayout {
  header: {
    avatar: string;
    displayName: string;
    username: string;
    bio: string;
    skills: string[];
    availability: AvailabilityStatus;
    contactButton: Button;
  };
  stats: {
    projectsCompleted?: number;
    rating?: number;
    reviewCount?: number;
  };
  portfolioGallery: PortfolioItem[];
  testimonials?: Testimonial[];
}
```

**Features**:
- Hero section with creator info
- Availability badge
- Contact/Hire button (opens modal)
- Portfolio items in masonry grid
- Lightbox for image viewing
- Social links (if provided)
- SEO optimized with meta tags

### 9. Contact Modal

**Component**: `ContactModal`

**Purpose**: Allow visitors to send inquiry to creators

**Form Fields**:
```typescript
interface ContactForm {
  name: string;           // Required
  email: string;          // Required, validated
  subject: string;        // Required
  message: string;        // Required, 50-1000 chars
  budget?: string;        // Optional
  timeline?: string;      // Optional
}
```

**Behavior**:
- Opens as modal overlay
- Form validation before submit
- Sends email notification to creator
- Stores inquiry in database
- Success message after submission
- Rate limiting: Max 3 inquiries per email per day

### 10. BYOK Settings Page

**Route**: `/dashboard/api-keys`

**Purpose**: Allow users to configure their own API keys for AI services

**Layout Structure**:
```typescript
interface BYOKSettingsLayout {
  header: {
    title: string;
    description: string;
  };
  apiKeyForms: APIKeyForm[];
  usageStats: UsageStatsCard;
}
```

**Supported Providers**:
```typescript
enum AIProvider {
  OPENAI = 'OpenAI',
  ANTHROPIC = 'Anthropic (Claude)',
  GOOGLE = 'Google (Gemini)',
  HUGGINGFACE = 'Huggingface'
}

interface APIKeyForm {
  provider: AIProvider;
  apiKey: string;           // Encrypted before storage
  status: 'active' | 'invalid' | 'not_configured';
  lastValidated?: Date;
  testButton: Button;       // Test API key validity
  saveButton: Button;
  removeButton?: Button;
}
```

**Security Features**:
- API keys encrypted using AES-256 before database storage
- Keys never displayed in full (show last 4 chars only)
- Validation before saving
- Secure transmission over HTTPS
- Keys stored per user, not shared

### 11. API Usage Dashboard

**Component**: `APIUsageStats`

**Purpose**: Display usage statistics for BYOK users

**Data Structure**:
```typescript
interface APIUsageStats {
  provider: AIProvider;
  currentPeriod: {
    startDate: Date;
    endDate: Date;
    totalCalls: number;
    estimatedCost?: number;
  };
  breakdown: {
    model: string;
    calls: number;
    tokens?: number;
  }[];
  chart: UsageChartData;
}
```

**Features**:
- Current billing period usage
- Breakdown by AI model
- Usage trend chart (last 30 days)
- Estimated costs (where API provides pricing)
- Export usage data as CSV


### 12. Community Activity Feed

**Component**: `CommunityActivityFeed`

**Purpose**: Display recent community activities and highlights

**Data Structure**:
```typescript
interface ActivityItem {
  id: string;
  type: 'project_featured' | 'creator_joined' | 'milestone' | 'announcement';
  title: string;
  description: string;
  timestamp: Date;
  actor?: {
    username: string;
    avatar: string;
  };
  metadata?: Record<string, any>;
}
```

**Features**:
- Real-time updates (polling every 2 minutes)
- Activity type icons
- Relative timestamps ("2 hours ago")
- Click to view details
- Load more pagination

### 13. Marketplace Profile Settings

**Route**: `/dashboard/settings/marketplace`

**Purpose**: Configure marketplace-specific profile settings

**Form Fields**:
```typescript
interface MarketplaceProfileSettings {
  displayName: string;              // Required
  bio: string;                      // Required, 50-500 chars
  avatar: File;                     // Optional, max 2MB
  bannerImage: File;                // Optional, max 5MB
  skills: string[];                 // Max 15 skills
  availability: AvailabilityStatus;
  hourlyRate?: number;              // Optional, in IDR
  projectRate?: number;             // Optional, in IDR
  socialLinks: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    website?: string;
  };
  contactEmail?: string;            // Optional, defaults to account email
  showEmail: boolean;               // Public visibility
}

enum AvailabilityStatus {
  AVAILABLE = 'Available for hire',
  BUSY = 'Busy',
  UNAVAILABLE = 'Not available'
}
```

**Validation**:
- Display name: 2-50 characters
- Bio: 50-500 characters
- Skills: Each 2-30 characters
- URLs: Valid URL format
- Email: Valid email format

### 14. Admin Moderation Panel

**Route**: `/admin/marketplace/moderation`

**Purpose**: Allow administrators to moderate marketplace content

**Access Control**: Only users with ADMIN or OWNER role

**Features**:
```typescript
interface ModerationPanel {
  pendingReviews: PortfolioItem[];
  reportedContent: Report[];
  userManagement: UserModerationTools;
}

interface Report {
  id: string;
  reportedBy: User;
  reportedItem: PortfolioItem | User;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: Date;
}

interface ModerationAction {
  approve: () => void;
  reject: (reason: string) => void;
  flag: (reason: string) => void;
  suspend: (duration: number) => void;
  ban: (reason: string) => void;
}
```

**Moderation Actions**:
- Approve portfolio items
- Reject with reason (sends notification)
- Flag for further review
- Suspend user account (temporary)
- Ban user account (permanent)
- View moderation history


## Data Models

### Database Schema Extensions

The following models will be added to the existing Prisma schema:

```prisma
// ============================================
// COMMUNITY & MARKETPLACE
// ============================================

model CreatorProfile {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  displayName     String
  bio             String   @db.Text
  avatar          String?
  bannerImage     String?
  skills          String[]
  availability    AvailabilityStatus @default(UNAVAILABLE)
  
  // Pricing
  hourlyRate      Int?     // In IDR
  projectRate     Int?     // In IDR
  
  // Social Links
  twitterUrl      String?
  instagramUrl    String?
  linkedinUrl     String?
  websiteUrl      String?
  
  // Contact
  contactEmail    String?
  showEmail       Boolean  @default(false)
  
  // Stats
  rating          Float?   @default(0)
  reviewCount     Int      @default(0)
  projectsCompleted Int    @default(0)
  
  // Visibility
  isPublic        Boolean  @default(true)
  isFeatured      Boolean  @default(false)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  portfolioItems  PortfolioItem[]
  inquiries       Inquiry[]
  reviews         Review[]
  
  @@map("creator_profiles")
  @@index([userId])
  @@index([availability])
  @@index([isFeatured])
}

model PortfolioItem {
  id              String   @id @default(cuid())
  creatorId       String
  creator         CreatorProfile @relation(fields: [creatorId], references: [id], onDelete: Cascade)
  
  title           String
  description     String   @db.Text
  category        PortfolioCategory
  images          String[] // Array of image URLs
  projectUrl      String?
  tags            String[]
  
  visibility      Visibility @default(PUBLIC)
  featured        Boolean  @default(false)
  
  // Moderation
  moderationStatus ModerationStatus @default(PENDING)
  moderatedBy     String?
  moderatedAt     DateTime?
  moderationNotes String?  @db.Text
  
  // Stats
  views           Int      @default(0)
  likes           Int      @default(0)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@map("portfolio_items")
  @@index([creatorId])
  @@index([category])
  @@index([moderationStatus])
  @@index([visibility, featured])
}

model Inquiry {
  id              String   @id @default(cuid())
  creatorId       String
  creator         CreatorProfile @relation(fields: [creatorId], references: [id], onDelete: Cascade)
  
  name            String
  email           String
  subject         String
  message         String   @db.Text
  budget          String?
  timeline        String?
  
  status          InquiryStatus @default(UNREAD)
  repliedAt       DateTime?
  
  createdAt       DateTime @default(now())
  
  @@map("inquiries")
  @@index([creatorId, status])
  @@index([email])
}

model Review {
  id              String   @id @default(cuid())
  creatorId       String
  creator         CreatorProfile @relation(fields: [creatorId], references: [id], onDelete: Cascade)
  reviewerId      String
  reviewer        User     @relation(fields: [reviewerId], references: [id])
  
  rating          Int      // 1-5 stars
  comment         String?  @db.Text
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@map("reviews")
  @@index([creatorId])
  @@index([reviewerId])
  @@unique([creatorId, reviewerId]) // One review per user per creator
}

model APIKey {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  provider        AIProvider
  encryptedKey    String   @db.Text // AES-256 encrypted
  keyPreview      String   // Last 4 characters for display
  
  status          APIKeyStatus @default(NOT_VALIDATED)
  lastValidated   DateTime?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  usageLogs       APIUsageLog[]
  
  @@map("api_keys")
  @@unique([userId, provider])
  @@index([userId])
}

model APIUsageLog {
  id              String   @id @default(cuid())
  apiKeyId        String
  apiKey          APIKey   @relation(fields: [apiKeyId], references: [id], onDelete: Cascade)
  
  provider        AIProvider
  model           String   // e.g., "gpt-4", "claude-3-opus"
  operation       String   // e.g., "completion", "embedding"
  
  tokensUsed      Int?
  estimatedCost   Float?   // In USD
  
  success         Boolean  @default(true)
  errorMessage    String?  @db.Text
  
  createdAt       DateTime @default(now())
  
  @@map("api_usage_logs")
  @@index([apiKeyId, createdAt])
}

model CommunityStats {
  id              String   @id @default(cuid())
  platform        ExternalPlatform
  
  memberCount     Int      @default(0)
  activeMembers   Int      @default(0)
  activityLevel   ActivityLevel @default(MEDIUM)
  
  metadata        Json?    // Platform-specific data
  
  lastFetched     DateTime @default(now())
  
  @@map("community_stats")
  @@unique([platform])
}

model ActivityFeed {
  id              String   @id @default(cuid())
  type            ActivityType
  title           String
  description     String   @db.Text
  
  actorId         String?
  actor           User?    @relation(fields: [actorId], references: [id])
  
  metadata        Json?
  
  createdAt       DateTime @default(now())
  
  @@map("activity_feed")
  @@index([createdAt])
}

// ============================================
// ENUMS
// ============================================

enum AvailabilityStatus {
  AVAILABLE
  BUSY
  UNAVAILABLE
}

enum PortfolioCategory {
  AI_CONTENT
  PROMPTS
  CREATIVE_DIRECTION
  VIDEO_EDITING
  SOCIAL_MEDIA
  TECHNICAL
  OTHER
}

enum Visibility {
  PUBLIC
  PRIVATE
}

enum ModerationStatus {
  PENDING
  APPROVED
  REJECTED
  FLAGGED
}

enum InquiryStatus {
  UNREAD
  READ
  REPLIED
  ARCHIVED
}

enum AIProvider {
  OPENAI
  ANTHROPIC
  GOOGLE
  HUGGINGFACE
}

enum APIKeyStatus {
  NOT_VALIDATED
  ACTIVE
  INVALID
  EXPIRED
}

enum ExternalPlatform {
  DISCORD
  REDDIT
  GITHUB
  HUGGINGFACE
}

enum ActivityLevel {
  LOW
  MEDIUM
  HIGH
}

enum ActivityType {
  PROJECT_FEATURED
  CREATOR_JOINED
  MILESTONE
  ANNOUNCEMENT
}
```

### Relations to Existing Models

Add these relations to the existing User model:

```prisma
model User {
  // ... existing fields ...
  
  // New relations
  creatorProfile  CreatorProfile?
  apiKeys         APIKey[]
  reviews         Review[]
  activities      ActivityFeed[]
}
```


## API Endpoints (tRPC Routers)

### Community Router

```typescript
// packages/api/src/routers/community.ts

export const communityRouter = router({
  // Get community hub data
  getHubData: publicProcedure
    .query(async ({ ctx }) => {
      const stats = await ctx.db.communityStats.findMany();
      const activities = await ctx.db.activityFeed.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { actor: true }
      });
      return { stats, activities };
    }),
  
  // Get external platform stats
  getPlatformStats: publicProcedure
    .input(z.object({
      platform: z.enum(['DISCORD', 'REDDIT', 'GITHUB', 'HUGGINGFACE'])
    }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.communityStats.findUnique({
        where: { platform: input.platform }
      });
    }),
  
  // Refresh platform stats (admin only)
  refreshPlatformStats: protectedProcedure
    .input(z.object({
      platform: z.enum(['DISCORD', 'REDDIT', 'GITHUB', 'HUGGINGFACE'])
    }))
    .mutation(async ({ ctx, input }) => {
      // Call external API to fetch fresh stats
      const stats = await fetchExternalPlatformStats(input.platform);
      return await ctx.db.communityStats.upsert({
        where: { platform: input.platform },
        update: { ...stats, lastFetched: new Date() },
        create: { platform: input.platform, ...stats }
      });
    }),
});
```

### Marketplace Router

```typescript
// packages/api/src/routers/marketplace.ts

export const marketplaceRouter = router({
  // Browse creators
  browseCreators: publicProcedure
    .input(z.object({
      category: z.nativeEnum(PortfolioCategory).optional(),
      skills: z.array(z.string()).optional(),
      availability: z.nativeEnum(AvailabilityStatus).optional(),
      search: z.string().optional(),
      sortBy: z.enum(['newest', 'popular', 'rating']).default('popular'),
      page: z.number().default(1),
      limit: z.number().default(12)
    }))
    .query(async ({ ctx, input }) => {
      const where = {
        isPublic: true,
        ...(input.availability && { availability: input.availability }),
        ...(input.skills && { skills: { hasSome: input.skills } }),
        ...(input.search && {
          OR: [
            { displayName: { contains: input.search, mode: 'insensitive' } },
            { bio: { contains: input.search, mode: 'insensitive' } }
          ]
        })
      };
      
      const orderBy = input.sortBy === 'newest' ? { createdAt: 'desc' }
        : input.sortBy === 'rating' ? { rating: 'desc' }
        : { projectsCompleted: 'desc' };
      
      const [creators, total] = await Promise.all([
        ctx.db.creatorProfile.findMany({
          where,
          orderBy,
          skip: (input.page - 1) * input.limit,
          take: input.limit,
          include: {
            user: { select: { name: true, image: true } },
            portfolioItems: {
              where: { visibility: 'PUBLIC', featured: true },
              take: 3,
              orderBy: { createdAt: 'desc' }
            }
          }
        }),
        ctx.db.creatorProfile.count({ where })
      ]);
      
      return { creators, total, pages: Math.ceil(total / input.limit) };
    }),
  
  // Get creator profile
  getCreatorProfile: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.username }, // Assuming username is email or add username field
        include: {
          creatorProfile: {
            include: {
              portfolioItems: {
                where: { visibility: 'PUBLIC', moderationStatus: 'APPROVED' },
                orderBy: { featured: 'desc', createdAt: 'desc' }
              },
              reviews: {
                include: { reviewer: true },
                orderBy: { createdAt: 'desc' },
                take: 10
              }
            }
          }
        }
      });
      
      if (!user?.creatorProfile) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Creator not found' });
      }
      
      return user.creatorProfile;
    }),
  
  // Send inquiry
  sendInquiry: publicProcedure
    .input(z.object({
      creatorId: z.string(),
      name: z.string().min(2).max(100),
      email: z.string().email(),
      subject: z.string().min(5).max(200),
      message: z.string().min(50).max(1000),
      budget: z.string().optional(),
      timeline: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      // Rate limiting check
      const recentInquiries = await ctx.db.inquiry.count({
        where: {
          email: input.email,
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }
      });
      
      if (recentInquiries >= 3) {
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: 'Maximum 3 inquiries per day'
        });
      }
      
      const inquiry = await ctx.db.inquiry.create({
        data: input
      });
      
      // Send email notification to creator
      await sendInquiryNotification(inquiry);
      
      return inquiry;
    }),
});
```

### Portfolio Router

```typescript
// packages/api/src/routers/portfolio.ts

export const portfolioRouter = router({
  // Get user's portfolio items
  getMyPortfolio: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.portfolioItem.findMany({
        where: { creator: { userId: ctx.session.user.id } },
        orderBy: { featured: 'desc', createdAt: 'desc' }
      });
    }),
  
  // Create portfolio item
  createPortfolioItem: protectedProcedure
    .input(z.object({
      title: z.string().min(5).max(100),
      description: z.string().min(50).max(2000),
      category: z.nativeEnum(PortfolioCategory),
      images: z.array(z.string()).max(10),
      projectUrl: z.string().url().optional(),
      tags: z.array(z.string()).max(10),
      visibility: z.nativeEnum(Visibility).default('PUBLIC'),
      featured: z.boolean().default(false)
    }))
    .mutation(async ({ ctx, input }) => {
      // Ensure creator profile exists
      let profile = await ctx.db.creatorProfile.findUnique({
        where: { userId: ctx.session.user.id }
      });
      
      if (!profile) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'Please complete your creator profile first'
        });
      }
      
      return await ctx.db.portfolioItem.create({
        data: {
          ...input,
          creatorId: profile.id,
          moderationStatus: 'PENDING'
        }
      });
    }),
  
  // Update portfolio item
  updatePortfolioItem: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().min(5).max(100).optional(),
      description: z.string().min(50).max(2000).optional(),
      category: z.nativeEnum(PortfolioCategory).optional(),
      images: z.array(z.string()).max(10).optional(),
      projectUrl: z.string().url().optional(),
      tags: z.array(z.string()).max(10).optional(),
      visibility: z.nativeEnum(Visibility).optional(),
      featured: z.boolean().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      
      // Verify ownership
      const item = await ctx.db.portfolioItem.findUnique({
        where: { id },
        include: { creator: true }
      });
      
      if (item?.creator.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }
      
      return await ctx.db.portfolioItem.update({
        where: { id },
        data: { ...data, moderationStatus: 'PENDING' }
      });
    }),
  
  // Delete portfolio item
  deletePortfolioItem: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const item = await ctx.db.portfolioItem.findUnique({
        where: { id: input.id },
        include: { creator: true }
      });
      
      if (item?.creator.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }
      
      return await ctx.db.portfolioItem.delete({
        where: { id: input.id }
      });
    }),
  
  // Get/Create creator profile
  getMyProfile: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.creatorProfile.findUnique({
        where: { userId: ctx.session.user.id }
      });
    }),
  
  updateMyProfile: protectedProcedure
    .input(z.object({
      displayName: z.string().min(2).max(50),
      bio: z.string().min(50).max(500),
      avatar: z.string().url().optional(),
      bannerImage: z.string().url().optional(),
      skills: z.array(z.string()).max(15),
      availability: z.nativeEnum(AvailabilityStatus),
      hourlyRate: z.number().positive().optional(),
      projectRate: z.number().positive().optional(),
      twitterUrl: z.string().url().optional(),
      instagramUrl: z.string().url().optional(),
      linkedinUrl: z.string().url().optional(),
      websiteUrl: z.string().url().optional(),
      contactEmail: z.string().email().optional(),
      showEmail: z.boolean().default(false)
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.creatorProfile.upsert({
        where: { userId: ctx.session.user.id },
        update: input,
        create: { ...input, userId: ctx.session.user.id }
      });
    }),
});
```


### BYOK Router

```typescript
// packages/api/src/routers/byok.ts

import { encrypt, decrypt } from '@/lib/encryption';

export const byokRouter = router({
  // Get user's API keys (without actual keys)
  getMyAPIKeys: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.apiKey.findMany({
        where: { userId: ctx.session.user.id },
        select: {
          id: true,
          provider: true,
          keyPreview: true,
          status: true,
          lastValidated: true,
          createdAt: true
        }
      });
    }),
  
  // Add or update API key
  upsertAPIKey: protectedProcedure
    .input(z.object({
      provider: z.nativeEnum(AIProvider),
      apiKey: z.string().min(10)
    }))
    .mutation(async ({ ctx, input }) => {
      // Validate API key with provider
      const isValid = await validateAPIKey(input.provider, input.apiKey);
      
      if (!isValid) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid API key'
        });
      }
      
      // Encrypt the API key
      const encryptedKey = encrypt(input.apiKey);
      const keyPreview = `...${input.apiKey.slice(-4)}`;
      
      return await ctx.db.apiKey.upsert({
        where: {
          userId_provider: {
            userId: ctx.session.user.id,
            provider: input.provider
          }
        },
        update: {
          encryptedKey,
          keyPreview,
          status: 'ACTIVE',
          lastValidated: new Date()
        },
        create: {
          userId: ctx.session.user.id,
          provider: input.provider,
          encryptedKey,
          keyPreview,
          status: 'ACTIVE',
          lastValidated: new Date()
        }
      });
    }),
  
  // Test API key
  testAPIKey: protectedProcedure
    .input(z.object({
      provider: z.nativeEnum(AIProvider),
      apiKey: z.string().min(10)
    }))
    .mutation(async ({ ctx, input }) => {
      const isValid = await validateAPIKey(input.provider, input.apiKey);
      return { valid: isValid };
    }),
  
  // Remove API key
  removeAPIKey: protectedProcedure
    .input(z.object({
      provider: z.nativeEnum(AIProvider)
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.apiKey.delete({
        where: {
          userId_provider: {
            userId: ctx.session.user.id,
            provider: input.provider
          }
        }
      });
    }),
  
  // Get usage statistics
  getUsageStats: protectedProcedure
    .input(z.object({
      provider: z.nativeEnum(AIProvider).optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional()
    }))
    .query(async ({ ctx, input }) => {
      const apiKeys = await ctx.db.apiKey.findMany({
        where: {
          userId: ctx.session.user.id,
          ...(input.provider && { provider: input.provider })
        },
        include: {
          usageLogs: {
            where: {
              createdAt: {
                gte: input.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                lte: input.endDate || new Date()
              }
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      });
      
      // Aggregate usage data
      const stats = apiKeys.map(key => ({
        provider: key.provider,
        totalCalls: key.usageLogs.length,
        totalTokens: key.usageLogs.reduce((sum, log) => sum + (log.tokensUsed || 0), 0),
        estimatedCost: key.usageLogs.reduce((sum, log) => sum + (log.estimatedCost || 0), 0),
        breakdown: aggregateByModel(key.usageLogs)
      }));
      
      return stats;
    }),
  
  // Log API usage (internal use)
  logUsage: protectedProcedure
    .input(z.object({
      provider: z.nativeEnum(AIProvider),
      model: z.string(),
      operation: z.string(),
      tokensUsed: z.number().optional(),
      estimatedCost: z.number().optional(),
      success: z.boolean().default(true),
      errorMessage: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const apiKey = await ctx.db.apiKey.findUnique({
        where: {
          userId_provider: {
            userId: ctx.session.user.id,
            provider: input.provider
          }
        }
      });
      
      if (!apiKey) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'API key not found' });
      }
      
      return await ctx.db.apiUsageLog.create({
        data: {
          apiKeyId: apiKey.id,
          ...input
        }
      });
    }),
});

// Helper functions
async function validateAPIKey(provider: AIProvider, apiKey: string): Promise<boolean> {
  try {
    switch (provider) {
      case 'OPENAI':
        const openai = new OpenAI({ apiKey });
        await openai.models.list();
        return true;
      
      case 'ANTHROPIC':
        const anthropic = new Anthropic({ apiKey });
        await anthropic.messages.create({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1,
          messages: [{ role: 'user', content: 'test' }]
        });
        return true;
      
      // Add other providers...
      
      default:
        return false;
    }
  } catch (error) {
    return false;
  }
}

function aggregateByModel(logs: APIUsageLog[]) {
  const modelMap = new Map<string, { calls: number; tokens: number; cost: number }>();
  
  logs.forEach(log => {
    const existing = modelMap.get(log.model) || { calls: 0, tokens: 0, cost: 0 };
    modelMap.set(log.model, {
      calls: existing.calls + 1,
      tokens: existing.tokens + (log.tokensUsed || 0),
      cost: existing.cost + (log.estimatedCost || 0)
    });
  });
  
  return Array.from(modelMap.entries()).map(([model, stats]) => ({
    model,
    ...stats
  }));
}
```


## Error Handling

### Client-Side Error Handling

```typescript
// Error boundary for community pages
export function CommunityErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
      <p className="text-gray-600 mb-6">{error.message}</p>
      <Button onClick={() => window.location.reload()}>
        Try Again
      </Button>
    </div>
  );
}

// Toast notifications for user actions
const handleError = (error: TRPCError) => {
  const messages = {
    NOT_FOUND: 'Resource not found',
    FORBIDDEN: 'You do not have permission to perform this action',
    TOO_MANY_REQUESTS: 'Too many requests. Please try again later',
    BAD_REQUEST: 'Invalid input. Please check your data',
    INTERNAL_SERVER_ERROR: 'Server error. Please try again later'
  };
  
  toast.error(messages[error.code] || 'An error occurred');
};
```

### API Error Responses

```typescript
// Standardized error responses
export class APIError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500
  ) {
    super(message);
  }
}

// Error codes
export const ErrorCodes = {
  INVALID_API_KEY: 'INVALID_API_KEY',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  PORTFOLIO_LIMIT_REACHED: 'PORTFOLIO_LIMIT_REACHED',
  MODERATION_REQUIRED: 'MODERATION_REQUIRED',
  PROFILE_INCOMPLETE: 'PROFILE_INCOMPLETE',
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR'
};
```

### Validation Errors

```typescript
// Form validation with Zod
const portfolioItemSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must not exceed 100 characters'),
  description: z.string()
    .min(50, 'Description must be at least 50 characters')
    .max(2000, 'Description must not exceed 2000 characters'),
  images: z.array(z.string())
    .max(10, 'Maximum 10 images allowed'),
  tags: z.array(z.string())
    .max(10, 'Maximum 10 tags allowed')
});

// Display validation errors
const { errors } = useForm({
  resolver: zodResolver(portfolioItemSchema)
});
```

### Rate Limiting

```typescript
// Rate limiting middleware
export const rateLimiter = {
  inquiry: {
    maxRequests: 3,
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    message: 'Maximum 3 inquiries per day'
  },
  apiKeyValidation: {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Maximum 5 validation attempts per hour'
  }
};
```

## Testing Strategy

### Unit Tests

**Portfolio Service Tests**:
```typescript
describe('Portfolio Service', () => {
  it('should create portfolio item with valid data', async () => {
    const item = await portfolioService.create({
      title: 'Test Project',
      description: 'A test project description that is long enough',
      category: 'AI_CONTENT',
      images: ['https://example.com/image.jpg'],
      tags: ['ai', 'content']
    });
    
    expect(item).toBeDefined();
    expect(item.moderationStatus).toBe('PENDING');
  });
  
  it('should reject portfolio item with short description', async () => {
    await expect(
      portfolioService.create({
        title: 'Test',
        description: 'Too short',
        category: 'AI_CONTENT',
        images: [],
        tags: []
      })
    ).rejects.toThrow();
  });
});
```

**BYOK Encryption Tests**:
```typescript
describe('API Key Encryption', () => {
  it('should encrypt and decrypt API key correctly', () => {
    const originalKey = 'sk-test-1234567890abcdef';
    const encrypted = encrypt(originalKey);
    const decrypted = decrypt(encrypted);
    
    expect(decrypted).toBe(originalKey);
    expect(encrypted).not.toBe(originalKey);
  });
  
  it('should validate OpenAI API key', async () => {
    const isValid = await validateAPIKey('OPENAI', process.env.TEST_OPENAI_KEY);
    expect(isValid).toBe(true);
  });
});
```

### Integration Tests

**Marketplace Flow Tests**:
```typescript
describe('Marketplace Integration', () => {
  it('should complete full creator onboarding flow', async () => {
    // 1. Create creator profile
    const profile = await createCreatorProfile({
      displayName: 'Test Creator',
      bio: 'A test creator bio that is long enough to pass validation',
      skills: ['AI', 'Content Creation']
    });
    
    // 2. Create portfolio item
    const portfolioItem = await createPortfolioItem({
      creatorId: profile.id,
      title: 'Test Portfolio',
      description: 'A detailed description of the portfolio item',
      category: 'AI_CONTENT'
    });
    
    // 3. Verify profile is visible in marketplace
    const creators = await browseCreators({});
    expect(creators.some(c => c.id === profile.id)).toBe(true);
  });
  
  it('should send inquiry and notify creator', async () => {
    const inquiry = await sendInquiry({
      creatorId: 'test-creator-id',
      name: 'Test Client',
      email: 'client@example.com',
      subject: 'Project Inquiry',
      message: 'I would like to hire you for a project. This is a detailed message.'
    });
    
    expect(inquiry).toBeDefined();
    // Verify email was sent (mock email service)
    expect(mockEmailService.send).toHaveBeenCalled();
  });
});
```

### E2E Tests

**User Journey Tests**:
```typescript
describe('Community Marketplace E2E', () => {
  it('should allow visitor to browse and contact creator', async () => {
    // 1. Visit landing page
    await page.goto('/');
    
    // 2. Click community CTA
    await page.click('[data-testid="community-cta"]');
    expect(page.url()).toContain('/community');
    
    // 3. Navigate to marketplace
    await page.click('[data-testid="marketplace-link"]');
    
    // 4. Browse creators
    await page.waitForSelector('[data-testid="creator-card"]');
    
    // 5. Click on a creator
    await page.click('[data-testid="creator-card"]:first-child');
    
    // 6. Open contact modal
    await page.click('[data-testid="contact-button"]');
    
    // 7. Fill and submit form
    await page.fill('[name="name"]', 'Test Client');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="subject"]', 'Project Inquiry');
    await page.fill('[name="message"]', 'I would like to discuss a project opportunity with you.');
    await page.click('[data-testid="submit-inquiry"]');
    
    // 8. Verify success message
    await page.waitForSelector('[data-testid="success-message"]');
  });
});
```

### Performance Tests

**Load Testing**:
```typescript
describe('Performance Tests', () => {
  it('should load marketplace page within 2 seconds', async () => {
    const startTime = Date.now();
    await page.goto('/community/marketplace');
    await page.waitForSelector('[data-testid="creator-card"]');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000);
  });
  
  it('should handle 100 concurrent creator profile views', async () => {
    const promises = Array.from({ length: 100 }, () =>
      fetch('/api/trpc/marketplace.getCreatorProfile?input={"username":"test"}')
    );
    
    const results = await Promise.all(promises);
    const successCount = results.filter(r => r.ok).length;
    
    expect(successCount).toBe(100);
  });
});
```


## Security Considerations

### API Key Security

1. **Encryption at Rest**:
   - Use AES-256-GCM encryption for API keys
   - Store encryption key in environment variable (never in code)
   - Use unique IV (Initialization Vector) for each encryption

```typescript
// lib/encryption.ts
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!; // Must be 32 bytes
const ALGORITHM = 'aes-256-gcm';

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  // Return IV + authTag + encrypted data
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

export function decrypt(encryptedData: string): string {
  const parts = encryptedData.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];
  
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

2. **Transmission Security**:
   - Always use HTTPS
   - Never log API keys
   - Clear API keys from memory after use

3. **Access Control**:
   - Users can only access their own API keys
   - Admin cannot view user API keys
   - Implement row-level security in database

### Content Moderation

1. **Automated Filtering**:
   - Scan portfolio images for inappropriate content
   - Filter profanity in text content
   - Detect spam patterns

2. **Manual Review**:
   - All new portfolio items require approval
   - Flagged content reviewed by moderators
   - Appeal process for rejected content

3. **User Reporting**:
   - Report button on all public content
   - Track reporter reputation to prevent abuse
   - Automatic action on multiple reports

### Rate Limiting

```typescript
// middleware/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!
});

export const rateLimiters = {
  inquiry: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '24 h'),
    analytics: true
  }),
  
  apiValidation: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 h'),
    analytics: true
  }),
  
  portfolioCreation: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 d'),
    analytics: true
  })
};
```

### Input Validation

1. **File Upload Security**:
   - Validate file types (whitelist: jpg, png, webp)
   - Limit file sizes (max 5MB per image)
   - Scan for malware
   - Strip EXIF data for privacy

2. **XSS Prevention**:
   - Sanitize all user input
   - Use Content Security Policy headers
   - Escape HTML in user-generated content

3. **SQL Injection Prevention**:
   - Use Prisma ORM (parameterized queries)
   - Never concatenate user input in queries
   - Validate all input with Zod schemas

## Performance Optimization

### Caching Strategy

```typescript
// Cache external platform stats for 5 minutes
export async function getCommunityStats(platform: ExternalPlatform) {
  const cacheKey = `community:stats:${platform}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const stats = await fetchExternalPlatformStats(platform);
  await redis.setex(cacheKey, 300, JSON.stringify(stats)); // 5 minutes
  
  return stats;
}

// Cache creator profiles for 1 hour
export async function getCreatorProfile(username: string) {
  const cacheKey = `creator:profile:${username}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const profile = await db.creatorProfile.findUnique({
    where: { user: { email: username } },
    include: { portfolioItems: true, reviews: true }
  });
  
  await redis.setex(cacheKey, 3600, JSON.stringify(profile)); // 1 hour
  
  return profile;
}
```

### Image Optimization

1. **Upload Pipeline**:
   - Resize images to standard dimensions
   - Convert to WebP format
   - Generate thumbnails (small, medium, large)
   - Use CDN for delivery

2. **Lazy Loading**:
   - Implement intersection observer for images
   - Load images as they enter viewport
   - Use blur placeholder while loading

### Database Optimization

1. **Indexes**:
   - Index frequently queried fields
   - Composite indexes for common filters
   - Partial indexes for specific queries

2. **Query Optimization**:
   - Use `select` to limit returned fields
   - Implement pagination for large datasets
   - Use database-level aggregations

3. **Connection Pooling**:
   - Configure Prisma connection pool
   - Set appropriate pool size
   - Monitor connection usage

## Deployment Considerations

### Environment Variables

```bash
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://kreatr.app"

# Encryption
ENCRYPTION_KEY="..." # 32-byte hex string

# External APIs
DISCORD_BOT_TOKEN="..."
GITHUB_TOKEN="..."
REDDIT_CLIENT_ID="..."
REDDIT_CLIENT_SECRET="..."
HUGGINGFACE_TOKEN="..."

# File Storage
AWS_S3_BUCKET="..."
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="..."

# Redis (for caching and rate limiting)
UPSTASH_REDIS_URL="..."
UPSTASH_REDIS_TOKEN="..."

# Email
SMTP_HOST="..."
SMTP_PORT="..."
SMTP_USER="..."
SMTP_PASSWORD="..."

# AI Providers (for platform usage)
OPENAI_API_KEY="..."
ANTHROPIC_API_KEY="..."
```

### Database Migration

```bash
# Generate migration
npx prisma migrate dev --name add_community_marketplace

# Apply migration to production
npx prisma migrate deploy

# Seed initial data
npx prisma db seed
```

### Monitoring

1. **Application Monitoring**:
   - Track API response times
   - Monitor error rates
   - Alert on high latency

2. **Database Monitoring**:
   - Query performance
   - Connection pool usage
   - Slow query log

3. **User Analytics**:
   - Track feature usage
   - Monitor conversion funnel
   - A/B test results

## Integration with Existing Features

### Landing Page Integration

**Modification to `apps/web/app/page.tsx`**:

```typescript
// Add community CTA in hero section
<div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
  <Link href="/register">
    <Button size="lg">Mulai Gratis</Button>
  </Link>
  <Link href="/demo">
    <Button size="lg" variant="outline">Lihat Demo</Button>
  </Link>
  <Link href="/community">
    <Button size="lg" variant="secondary">
      <Users className="mr-2 h-5 w-5" />
      Join Community
    </Button>
  </Link>
</div>

// Add community section before footer
<section className="container mx-auto px-4 py-20">
  <div className="max-w-4xl mx-auto text-center">
    <h2 className="text-3xl md:text-4xl font-bold mb-6">
      Bergabung dengan Komunitas Kreator
    </h2>
    <p className="text-xl text-gray-600 mb-8">
      Terhubung dengan ribuan kreator, engineer, dan prompter. 
      Tampilkan portfolio Anda dan dapatkan peluang kolaborasi.
    </p>
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      <CommunityStatCard platform="discord" count="2.5K+" label="Members" />
      <CommunityStatCard platform="github" count="500+" label="Contributors" />
      <CommunityStatCard platform="reddit" count="1K+" label="Subscribers" />
      <CommunityStatCard platform="huggingface" count="100+" label="Models" />
    </div>
    <Link href="/community">
      <Button size="lg">Explore Community</Button>
    </Link>
  </div>
</section>
```

### Dashboard Integration

**Add navigation items**:

```typescript
// components/dashboard/nav.tsx
const navItems = [
  // ... existing items
  {
    title: 'Portfolio',
    href: '/dashboard/portfolio',
    icon: Briefcase
  },
  {
    title: 'API Keys',
    href: '/dashboard/api-keys',
    icon: Key
  }
];
```

### Credit System Integration

**BYOK users bypass credit system**:

```typescript
// When generating AI content
async function generateContent(userId: string, prompt: string) {
  // Check if user has BYOK configured
  const apiKey = await db.apiKey.findFirst({
    where: {
      userId,
      provider: 'OPENAI',
      status: 'ACTIVE'
    }
  });
  
  if (apiKey) {
    // Use user's API key
    const decryptedKey = decrypt(apiKey.encryptedKey);
    const openai = new OpenAI({ apiKey: decryptedKey });
    const result = await openai.chat.completions.create({...});
    
    // Log usage
    await logAPIUsage({
      apiKeyId: apiKey.id,
      model: 'gpt-4',
      tokensUsed: result.usage.total_tokens
    });
    
    return result;
  } else {
    // Use platform credits
    await deductCredits(userId, CONTENT_GENERATION_COST);
    return await generateWithPlatformKey(prompt);
  }
}
```

## Future Enhancements

1. **Marketplace Features**:
   - Escrow payment system
   - Project management tools
   - Contract templates
   - Dispute resolution

2. **Community Features**:
   - In-app messaging
   - Community forums
   - Live events/webinars
   - Mentorship program

3. **Portfolio Features**:
   - Video portfolio items
   - Interactive demos
   - Analytics on portfolio views
   - Portfolio templates

4. **BYOK Features**:
   - Support more AI providers
   - Cost optimization suggestions
   - Usage alerts and budgets
   - Team API key sharing

