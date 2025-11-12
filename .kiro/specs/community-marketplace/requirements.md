# Requirements Document

## Introduction

Platform ini akan mengembangkan ekosistem komunitas dan marketplace yang memungkinkan engineer, kreator konten, dan prompter untuk berkolaborasi, menampilkan portfolio, dan mendapatkan peluang bisnis. Fitur ini akan mengintegrasikan komunitas eksternal (Discord, Reddit, GitHub, Huggingface) dan memungkinkan pengguna membawa API key mereka sendiri untuk fleksibilitas maksimal.

## Glossary

- **Platform**: Sistem web aplikasi yang menyediakan layanan AI-powered content creation
- **Community Hub**: Halaman pusat yang menampilkan integrasi dengan platform komunitas eksternal
- **Marketplace**: Area dimana kreator dapat menampilkan dan menjual konten atau jasa mereka
- **Creator**: Pengguna yang membuat konten menggunakan AI-powered tools
- **Prompter**: Pengguna yang ahli dalam membuat dan mengoptimalkan prompts untuk AI
- **Portfolio**: Koleksi karya dan proyek yang ditampilkan oleh kreator atau engineer
- **BYOK**: Bring Your Own Key - fitur yang memungkinkan pengguna menggunakan API key mereka sendiri
- **External Platform**: Platform komunitas eksternal seperti Discord, Reddit, GitHub, atau Huggingface
- **Landing Page**: Halaman utama yang menjadi entry point pengguna ke platform
- **CTA**: Call To Action - elemen UI yang mendorong pengguna untuk melakukan aksi tertentu

## Requirements

### Requirement 1

**User Story:** As a visitor, I want to access the community hub from the landing page, so that I can explore the community and marketplace offerings

#### Acceptance Criteria

1. WHEN a visitor views the landing page, THE Platform SHALL display a prominent CTA button labeled "Join Community" or "Explore Marketplace"
2. WHEN a visitor clicks the community CTA, THE Platform SHALL navigate to the community hub page at "/community"
3. THE Platform SHALL display the community CTA in the hero section or navigation menu of the landing page
4. THE Platform SHALL ensure the community CTA is visually distinct with appropriate styling and iconography

### Requirement 2

**User Story:** As a visitor, I want to see integrated links to external community platforms, so that I can join discussions and connect with other members

#### Acceptance Criteria

1. THE Community Hub SHALL display integration cards for Discord, Reddit, GitHub, and Huggingface
2. WHEN a visitor clicks on an external platform card, THE Platform SHALL open the respective community link in a new browser tab
3. THE Community Hub SHALL display member count or activity metrics for each external platform where available
4. THE Community Hub SHALL display a brief description of what each external platform community offers
5. THE Community Hub SHALL display platform-specific icons and branding for each external community

### Requirement 3

**User Story:** As a creator, I want to create and display my portfolio on the platform, so that I can showcase my work to potential clients

#### Acceptance Criteria

1. WHEN a logged-in creator accesses the portfolio section, THE Platform SHALL display a portfolio creation interface
2. THE Platform SHALL allow creators to add portfolio items including title, description, images, and project links
3. THE Platform SHALL allow creators to categorize portfolio items by type such as "AI Content", "Prompts", "Creative Direction"
4. THE Platform SHALL allow creators to set portfolio items as public or private
5. WHEN a creator saves a portfolio item, THE Platform SHALL store the item in the database with creator association
6. THE Platform SHALL display a public portfolio page at "/portfolio/[username]" for each creator

### Requirement 4

**User Story:** As a visitor, I want to browse creator portfolios in the marketplace, so that I can find and hire talented creators for my projects

#### Acceptance Criteria

1. THE Marketplace SHALL display a grid or list view of creator profiles with portfolio previews
2. THE Marketplace SHALL allow visitors to filter creators by category, skills, or expertise
3. THE Marketplace SHALL allow visitors to search creators by name or keywords
4. WHEN a visitor clicks on a creator profile, THE Platform SHALL navigate to the creator's full portfolio page
5. THE Marketplace SHALL display creator ratings or endorsements where available
6. THE Marketplace SHALL display creator availability status such as "Available for hire" or "Busy"

### Requirement 5

**User Story:** As a creator, I want to manage my marketplace profile, so that I can control how I appear to potential clients

#### Acceptance Criteria

1. WHEN a logged-in creator accesses profile settings, THE Platform SHALL display marketplace profile configuration options
2. THE Platform SHALL allow creators to set their availability status
3. THE Platform SHALL allow creators to add skills, expertise tags, and bio information
4. THE Platform SHALL allow creators to set hourly rates or project pricing where applicable
5. THE Platform SHALL allow creators to upload a profile picture and banner image
6. WHEN a creator updates their profile, THE Platform SHALL save changes to the database immediately

### Requirement 6

**User Story:** As a user, I want to bring my own API keys for AI services, so that I can use my existing subscriptions and control my usage

#### Acceptance Criteria

1. WHEN a logged-in user accesses API settings, THE Platform SHALL display a secure form for entering API keys
2. THE Platform SHALL support API key input for OpenAI, Anthropic Claude, and other supported AI providers
3. WHEN a user enters an API key, THE Platform SHALL encrypt the key before storing in the database
4. THE Platform SHALL allow users to test API key validity before saving
5. WHEN a user has a valid BYOK configured, THE Platform SHALL use the user's API key instead of platform credits for AI operations
6. THE Platform SHALL display current API key status as "Active", "Invalid", or "Not configured"
7. THE Platform SHALL allow users to remove or update their API keys at any time

### Requirement 7

**User Story:** As a user, I want to see my API usage when using BYOK, so that I can monitor my costs and consumption

#### Acceptance Criteria

1. WHEN a user with BYOK enabled accesses the dashboard, THE Platform SHALL display API usage statistics
2. THE Platform SHALL track and display the number of API calls made using the user's key
3. THE Platform SHALL display usage metrics grouped by AI service provider
4. THE Platform SHALL display usage metrics for the current billing period
5. WHERE the AI provider supports cost estimation, THE Platform SHALL display estimated costs based on usage

### Requirement 8

**User Story:** As a platform administrator, I want to moderate marketplace listings, so that I can ensure quality and prevent abuse

#### Acceptance Criteria

1. WHEN an administrator accesses the admin panel, THE Platform SHALL display a marketplace moderation interface
2. THE Platform SHALL allow administrators to review pending portfolio submissions
3. THE Platform SHALL allow administrators to approve, reject, or flag portfolio items
4. THE Platform SHALL allow administrators to suspend or ban creator accounts for policy violations
5. WHEN an administrator takes a moderation action, THE Platform SHALL log the action with timestamp and reason

### Requirement 9

**User Story:** As a creator, I want to receive inquiries from potential clients through the platform, so that I can get hired for projects

#### Acceptance Criteria

1. WHEN a visitor views a creator's portfolio, THE Platform SHALL display a "Contact" or "Hire Me" button
2. WHEN a visitor clicks the contact button, THE Platform SHALL display a contact form with fields for name, email, and message
3. WHEN a visitor submits the contact form, THE Platform SHALL send a notification to the creator via email
4. THE Platform SHALL store contact inquiries in the database for creator reference
5. WHEN a logged-in creator accesses their dashboard, THE Platform SHALL display received inquiries with unread indicators

### Requirement 10

**User Story:** As a community member, I want to see community activity and highlights on the hub page, so that I can stay engaged with the community

#### Acceptance Criteria

1. THE Community Hub SHALL display recent community highlights such as featured projects or top contributors
2. THE Community Hub SHALL display upcoming community events or announcements
3. WHERE available, THE Community Hub SHALL display recent activity feed from integrated external platforms
4. THE Community Hub SHALL display community statistics such as total members, active projects, or marketplace listings
5. THE Community Hub SHALL refresh community data at regular intervals not exceeding 5 minutes
