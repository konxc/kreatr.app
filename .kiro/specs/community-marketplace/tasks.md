# Implementation Plan

- [ ] 1. Database schema and migrations
  - Create Prisma schema extensions for community marketplace models
  - Add CreatorProfile, PortfolioItem, Inquiry, Review, APIKey, APIUsageLog, CommunityStats, and ActivityFeed models
  - Add enums: AvailabilityStatus, PortfolioCategory, Visibility, ModerationStatus, InquiryStatus, AIProvider, APIKeyStatus, ExternalPlatform, ActivityLevel, ActivityType
  - Update User model with new relations (creatorProfile, apiKeys, reviews, activities)
  - Generate and apply database migration
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 7.1, 7.2, 7.3, 7.4, 7.5, 9.1, 9.2, 9.3, 9.4, 9.5, 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 2. API key encryption utilities
  - Create encryption utility module with AES-256-GCM encryption
  - Implement encrypt() function for API key encryption
  - Implement decrypt() function for API key decryption
  - Add environment variable validation for ENCRYPTION_KEY
  - _Requirements: 6.3, 6.4_

- [ ] 3. tRPC API routers
- [ ] 3.1 Community router
  - Create community.ts router file
  - Implement getHubData endpoint for community hub page data
  - Implement getPlatformStats endpoint for external platform statistics
  - Implement refreshPlatformStats endpoint for admin stats refresh
  - Add helper functions for fetching external API data (Discord, Reddit, GitHub, Huggingface)
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 3.2 Marketplace router
  - Create marketplace.ts router file
  - Implement browseCreators endpoint with filtering, search, and pagination
  - Implement getCreatorProfile endpoint for public portfolio view
  - Implement sendInquiry endpoint with rate limiting
  - Add inquiry email notification function
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 3.3 Portfolio router
  - Create portfolio.ts router file
  - Implement getMyPortfolio endpoint for user's portfolio items
  - Implement createPortfolioItem endpoint with validation
  - Implement updatePortfolioItem endpoint with ownership verification
  - Implement deletePortfolioItem endpoint with ownership verification
  - Implement getMyProfile endpoint for creator profile
  - Implement updateMyProfile endpoint with upsert logic
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 3.4 BYOK router
  - Create byok.ts router file
  - Implement getMyAPIKeys endpoint (without exposing actual keys)
  - Implement upsertAPIKey endpoint with encryption and validation
  - Implement testAPIKey endpoint for API key validation
  - Implement removeAPIKey endpoint
  - Implement getUsageStats endpoint with aggregation
  - Implement logUsage endpoint for internal usage tracking
  - Add validateAPIKey helper for OpenAI, Anthropic, Google, Huggingface
  - Add aggregateByModel helper for usage statistics
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 4. Landing page CTA integration
  - Update apps/web/app/page.tsx to add community CTA button in hero section
  - Create CommunityStatCard component for displaying platform statistics
  - Add community section before footer with stats and CTA
  - Style community CTA with appropriate icons and colors
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 5. Community hub page
- [ ] 5.1 Create community hub layout and page
  - Create apps/web/app/(marketing)/community/page.tsx
  - Implement hero section with community overview
  - Create layout structure for external platforms, stats, and activity feed
  - Add navigation to marketplace
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 5.2 External platform cards component
  - Create components/community/external-platform-card.tsx
  - Implement platform-specific branding and icons
  - Add member count display with live data
  - Add activity level indicator
  - Implement "Join Now" CTA that opens in new tab
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 5.3 Community stats and activity feed
  - Create components/community/community-stats.tsx for statistics dashboard
  - Create components/community/activity-feed.tsx for recent activities
  - Implement real-time updates with polling (2-minute interval)
  - Add relative timestamps and activity type icons
  - Implement load more pagination for activity feed
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_


- [ ] 6. Marketplace browse page
- [ ] 6.1 Create marketplace page and layout
  - Create apps/web/app/(marketing)/community/marketplace/page.tsx
  - Implement grid layout for creator cards
  - Add search bar component
  - Add pagination controls
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ] 6.2 Creator filters component
  - Create components/marketplace/creator-filters.tsx
  - Implement category filter (AI Content, Prompter, Creative Director, etc.)
  - Implement skills filter with tag selection
  - Implement availability filter
  - Implement rating filter
  - Add sort options (Newest, Most Popular, Highest Rated)
  - _Requirements: 4.2, 4.3_

- [ ] 6.3 Creator card component
  - Create components/marketplace/creator-card.tsx
  - Display avatar with availability indicator
  - Show display name, username, and bio (truncated)
  - Display skill tags (max 3 visible)
  - Show portfolio preview thumbnails (3 images)
  - Display rating stars and review count
  - Add "View Profile" button with hover effects
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ] 7. Public portfolio page
- [ ] 7.1 Create public portfolio page
  - Create apps/web/app/portfolio/[username]/page.tsx
  - Implement hero section with creator info
  - Display avatar, display name, username, bio
  - Show skills tags and availability badge
  - Add contact/hire button
  - Display stats (projects completed, rating, review count)
  - _Requirements: 3.6, 9.1_

- [ ] 7.2 Portfolio gallery component
  - Create components/portfolio/portfolio-gallery.tsx
  - Implement masonry grid layout for portfolio items
  - Add lightbox for image viewing
  - Display portfolio item title and category
  - Add click to view details
  - _Requirements: 3.6_

- [ ] 7.3 Contact modal component
  - Create components/marketplace/contact-modal.tsx
  - Implement modal overlay with form
  - Add form fields: name, email, subject, message, budget, timeline
  - Implement form validation with Zod
  - Add rate limiting check (max 3 per day per email)
  - Show success message after submission
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 8. Portfolio management dashboard
- [ ] 8.1 Create portfolio dashboard page
  - Create apps/web/app/(dashboard)/dashboard/portfolio/page.tsx
  - Implement grid view of portfolio items
  - Add "Create New" button
  - Show edit/delete actions per item
  - Add visibility toggle (public/private)
  - Implement empty state for new users
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 8.2 Portfolio item card component
  - Create components/portfolio/portfolio-item-card.tsx
  - Display thumbnail image
  - Show title, category, and visibility status
  - Add moderation status badge
  - Implement edit and delete buttons
  - Add preview button to see public view
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 8.3 Portfolio editor page
  - Create apps/web/app/(dashboard)/dashboard/portfolio/edit/[id]/page.tsx
  - Create apps/web/app/(dashboard)/dashboard/portfolio/new/page.tsx
  - Implement form with title, description, category fields
  - Add image upload with preview (max 10 images, 5MB each)
  - Add project URL field (optional)
  - Implement tags input (max 10 tags)
  - Add visibility toggle and featured checkbox
  - Implement form validation with Zod
  - Add save and cancel buttons
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 9. Marketplace profile settings
- [ ] 9.1 Create marketplace profile settings page
  - Create apps/web/app/(dashboard)/dashboard/settings/marketplace/page.tsx
  - Implement form for display name, bio
  - Add avatar and banner image upload
  - Add skills input (max 15 skills)
  - Add availability status selector
  - Add pricing fields (hourly rate, project rate)
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 9.2 Social links and contact settings
  - Add social links fields (Twitter, Instagram, LinkedIn, Website)
  - Add contact email field with visibility toggle
  - Implement URL validation for social links
  - Add save button with success notification
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 10. BYOK settings page
- [ ] 10.1 Create BYOK settings page
  - Create apps/web/app/(dashboard)/dashboard/api-keys/page.tsx
  - Implement header with description of BYOK feature
  - Create layout for API key forms and usage stats
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

- [ ] 10.2 API key form components
  - Create API key form for each provider (OpenAI, Anthropic, Google, Huggingface)
  - Display current status (active, invalid, not_configured)
  - Show last 4 characters of saved keys
  - Add test button to validate API key
  - Add save button with encryption
  - Add remove button for existing keys
  - Implement form validation
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

- [ ] 10.3 API usage dashboard component
  - Create components/byok/api-usage-stats.tsx
  - Display current billing period usage
  - Show breakdown by AI model
  - Implement usage trend chart (last 30 days)
  - Display estimated costs where available
  - Add export to CSV functionality
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 11. Dashboard navigation integration
  - Update components/dashboard/nav.tsx to add Portfolio and API Keys menu items
  - Add appropriate icons (Briefcase for Portfolio, Key for API Keys)
  - Ensure proper active state highlighting
  - _Requirements: 3.1, 6.1_

- [ ] 12. Admin moderation panel
- [ ] 12.1 Create admin moderation page
  - Create apps/web/app/(dashboard)/admin/marketplace/moderation/page.tsx
  - Add access control for ADMIN and OWNER roles only
  - Implement tabs for pending reviews, reported content, user management
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 12.2 Moderation actions and tools
  - Implement approve/reject actions for portfolio items
  - Add flag for further review functionality
  - Implement user suspension (temporary) and ban (permanent)
  - Add moderation notes field
  - Create moderation history log
  - Send notifications to users on moderation actions
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 13. Email notifications
  - Create email template for inquiry notifications to creators
  - Create email template for moderation action notifications
  - Implement email sending service integration
  - Add email queue for async processing
  - _Requirements: 9.4, 8.2_

- [ ] 14. File upload and storage
  - Implement image upload handler for portfolio and profile images
  - Add image validation (type, size, dimensions)
  - Integrate with cloud storage (S3 or Cloudinary)
  - Implement image optimization (resize, convert to WebP, generate thumbnails)
  - Add CDN configuration for image delivery
  - _Requirements: 3.2, 5.5_

- [ ] 15. Caching and performance optimization
  - Implement Redis caching for community stats (5-minute TTL)
  - Add caching for creator profiles (1-hour TTL)
  - Implement cache invalidation on profile updates
  - Add database query optimization with proper indexes
  - Implement lazy loading for images
  - _Requirements: 2.2, 2.3, 2.4, 2.5, 10.5_

- [ ] 16. Rate limiting implementation
  - Set up Upstash Redis for rate limiting
  - Implement rate limiter for inquiry submissions (3 per 24 hours)
  - Add rate limiter for API key validation (5 per hour)
  - Implement rate limiter for portfolio creation (10 per day)
  - Add rate limit error handling and user feedback
  - _Requirements: 9.3, 6.4_

- [ ] 17. Security hardening
  - Implement Content Security Policy headers
  - Add input sanitization for all user-generated content
  - Implement XSS prevention measures
  - Add CSRF protection for forms
  - Implement secure file upload validation
  - Add API key encryption key rotation mechanism
  - _Requirements: 6.3, 6.4, 8.1, 8.2, 8.3_

- [ ] 18. SEO optimization for public pages
  - Add meta tags for community hub page
  - Implement dynamic meta tags for public portfolio pages
  - Add Open Graph tags for social sharing
  - Create sitemap for public portfolio pages
  - Add structured data (JSON-LD) for creator profiles
  - _Requirements: 3.6, 4.1_

- [ ]* 19. Testing implementation
- [ ]* 19.1 Unit tests for core functionality
  - Write unit tests for encryption/decryption functions
  - Write unit tests for API key validation
  - Write unit tests for portfolio service methods
  - Write unit tests for inquiry rate limiting
  - _Requirements: All_

- [ ]* 19.2 Integration tests for API endpoints
  - Write integration tests for community router endpoints
  - Write integration tests for marketplace router endpoints
  - Write integration tests for portfolio router endpoints
  - Write integration tests for BYOK router endpoints
  - _Requirements: All_

- [ ]* 19.3 E2E tests for user journeys
  - Write E2E test for visitor browsing and contacting creator
  - Write E2E test for creator onboarding flow
  - Write E2E test for portfolio creation and management
  - Write E2E test for BYOK configuration
  - _Requirements: All_

- [ ] 20. Documentation and deployment
  - Update README with community marketplace features
  - Create user guide for creators
  - Document BYOK setup process
  - Add environment variables to deployment configuration
  - Create database migration deployment script
  - Update deployment checklist with new dependencies
  - _Requirements: All_
