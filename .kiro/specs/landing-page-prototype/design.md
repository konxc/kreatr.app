# Design Document: Landing Page Prototype

## Overview

The landing page prototype is a single-page static HTML website for kreatr.app that combines compelling storytelling with modern web design. It will be built as a self-contained HTML file with embedded CSS and minimal JavaScript, optimized for GitHub Pages deployment. The design emphasizes visual hierarchy, smooth scrolling experience, and responsive layout that works across all devices.

## Architecture

### Technology Stack

- **HTML5**: Semantic markup for content structure
- **CSS3**: Modern styling with CSS Grid and Flexbox for layouts
- **Vanilla JavaScript**: Minimal JS for smooth scrolling and interactive elements
- **No Build Tools**: Direct deployment without compilation or bundling
- **CDN Resources**: Google Fonts for typography, optional icon libraries

### File Structure

```
prototype/
├── index.html          # Main landing page (self-contained)
├── README.md           # Deployment instructions
└── assets/             # Optional folder for future images
    └── .gitkeep
```

### Design Philosophy

1. **Mobile-First**: Design starts with mobile layout, progressively enhanced for larger screens
2. **Performance-First**: Inline critical CSS, defer non-critical resources
3. **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation support
4. **Visual Storytelling**: Use of whitespace, typography hierarchy, and subtle animations

## Components and Interfaces

### 1. Hero Section

**Purpose**: Capture attention and communicate core value proposition immediately

**Visual Design**:
- Full viewport height (100vh) with gradient background
- Large, bold headline with multiple options (rotating or A/B testable)
- Subheadline in lighter weight
- Prominent CTA button with hover effects
- Optional: Animated background elements or particles

**Content Structure**:
```html
<section id="hero">
  <div class="container">
    <h1 class="hero-headline">[Headline]</h1>
    <p class="hero-subheadline">[Subheadline]</p>
    <div class="cta-group">
      <button class="btn-primary">Mulai Gratis</button>
      <button class="btn-secondary">Coba Demo</button>
    </div>
  </div>
</section>
```

**Styling Approach**:
- Typography: Large display font (48-72px desktop, 32-40px mobile)
- Color scheme: Vibrant gradient (purple to blue) reflecting innovation
- Button: High contrast, rounded corners, shadow for depth
- Animation: Fade-in on load, subtle floating effect

### 2. Problem Section

**Purpose**: Create empathy by addressing creator pain points

**Visual Design**:
- Grid layout with 4 problem cards
- Each card has icon, headline, and description
- Subtle shadow and hover effects
- Alternating layout on desktop (zigzag pattern)

**Content Structure**:
```html
<section id="problems">
  <div class="container">
    <h2 class="section-title">Tantangan Kreator Hari Ini</h2>
    <div class="problems-grid">
      <div class="problem-card">
        <div class="problem-icon">[Icon]</div>
        <h3>[Problem Title]</h3>
        <p>[Problem Description]</p>
      </div>
      <!-- Repeat for 3-4 problems -->
    </div>
  </div>
</section>
```

**Styling Approach**:
- Cards: White background, rounded corners, subtle shadow
- Grid: 2x2 on desktop, single column on mobile
- Icons: Large, colorful, custom or from icon library
- Spacing: Generous padding for readability

### 3. Solution Section

**Purpose**: Introduce kreatr.app as the comprehensive solution

**Visual Design**:
- Centered content with visual emphasis
- Split layout: text on one side, visual/diagram on other
- Highlight key workflow: Research → Create → Publish → Analyze

**Content Structure**:
```html
<section id="solution">
  <div class="container">
    <h2 class="section-title">Kenalkan: kreatr.app</h2>
    <p class="section-intro">[Solution introduction]</p>
    <div class="solution-workflow">
      <div class="workflow-step">
        <span class="step-number">1</span>
        <h4>Riset & Ide</h4>
        <p>[Description]</p>
      </div>
      <!-- Repeat for 4 steps -->
    </div>
  </div>
</section>
```

**Styling Approach**:
- Workflow: Horizontal timeline on desktop, vertical on mobile
- Step numbers: Large, circular badges with gradient
- Connecting lines: Dotted or solid lines between steps
- Background: Light gradient or pattern for visual interest

### 4. Features Section

**Purpose**: Showcase 5 key platform capabilities

**Visual Design**:
- Feature cards in grid layout (3 columns on desktop)
- Each feature has icon, title, description, and optional "Learn More" link
- Hover effects reveal more details or change card elevation

**Content Structure**:
```html
<section id="features">
  <div class="container">
    <h2 class="section-title">Fitur Unggulan</h2>
    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">[Icon]</div>
        <h3>[Feature Name]</h3>
        <p>[Feature Description]</p>
      </div>
      <!-- Repeat for 5 features -->
    </div>
  </div>
</section>
```

**Features to Include**:
1. AI Content Lab - Brainstorming and content generation
2. Smart Scheduler - Automated posting across platforms
3. Insight Dashboard - Analytics and performance tracking
4. Collaboration Space - Team and client collaboration
5. Boost Credit System - Flexible usage-based credits

**Styling Approach**:
- Grid: 3 columns desktop, 2 columns tablet, 1 column mobile
- Cards: Gradient borders, glass-morphism effect optional
- Icons: Consistent style, colorful accents
- Hover: Lift effect with increased shadow

### 5. Demo Section

**Purpose**: Visualize the user journey through the platform

**Visual Design**:
- Large centered area for video or animated walkthrough
- Step-by-step breakdown below the visual
- Screenshot placeholders with captions

**Content Structure**:
```html
<section id="demo">
  <div class="container">
    <h2 class="section-title">Lihat kreatr.app Beraksi</h2>
    <div class="demo-video">
      <div class="video-placeholder">
        [Video or Animation Placeholder]
      </div>
    </div>
    <div class="demo-steps">
      <div class="demo-step">
        <h4>1. Temukan Ide</h4>
        <p>[Description]</p>
      </div>
      <!-- Repeat for workflow steps -->
    </div>
  </div>
</section>
```

**Styling Approach**:
- Video area: 16:9 aspect ratio, centered, shadow
- Placeholder: Gradient background with play icon
- Steps: Horizontal cards on desktop, stacked on mobile
- Background: Contrasting color to separate from other sections

### 6. Testimonials Section

**Purpose**: Build trust through social proof

**Visual Design**:
- Carousel or grid of testimonial cards
- Each card shows quote, author name, role, and optional avatar
- Emphasis on community and collaboration

**Content Structure**:
```html
<section id="testimonials">
  <div class="container">
    <h2 class="section-title">Dipercaya Kreator Indonesia</h2>
    <div class="testimonials-grid">
      <div class="testimonial-card">
        <div class="testimonial-quote">"[Quote]"</div>
        <div class="testimonial-author">
          <div class="author-avatar">[Avatar]</div>
          <div class="author-info">
            <p class="author-name">[Name]</p>
            <p class="author-role">[Role]</p>
          </div>
        </div>
      </div>
      <!-- Repeat for 3-6 testimonials -->
    </div>
  </div>
</section>
```

**Styling Approach**:
- Cards: Light background, italic quote text
- Grid: 3 columns desktop, 1-2 columns mobile
- Avatars: Circular, colorful placeholder gradients
- Quote marks: Large decorative elements

### 7. Pricing Section

**Purpose**: Present subscription tiers with clear value propositions

**Visual Design**:
- Three pricing cards side-by-side
- Middle card (Boost) highlighted as "Most Popular"
- Each card shows tier name, key benefits, and CTA

**Content Structure**:
```html
<section id="pricing">
  <div class="container">
    <h2 class="section-title">Pilih Paket yang Tepat</h2>
    <div class="pricing-grid">
      <div class="pricing-card">
        <h3 class="tier-name">Free</h3>
        <p class="tier-description">[Description]</p>
        <ul class="tier-features">
          <li>[Feature 1]</li>
          <li>[Feature 2]</li>
          <li>[Feature 3]</li>
        </ul>
        <button class="btn-outline">Mulai Gratis</button>
      </div>
      <!-- Repeat for Boost and Pro -->
    </div>
  </div>
</section>
```

**Pricing Tiers**:
1. **Free**: Basic features, limited credits, perfect for trying out
2. **Boost**: Most popular, more credits, advanced features
3. **Pro**: Unlimited access, priority support, team collaboration

**Styling Approach**:
- Cards: Equal height, bordered or shadowed
- Highlighted card: Larger, different color, "Popular" badge
- Features list: Checkmarks, clear typography
- CTA buttons: Different styles per tier (outline vs filled)

### 8. Final CTA Section

**Purpose**: Drive conversion with compelling closing message

**Visual Design**:
- Full-width section with gradient background
- Large headline and supporting text
- Multiple CTA options (sign up, demo, contact)

**Content Structure**:
```html
<section id="final-cta">
  <div class="container">
    <h2 class="cta-headline">Mulai Eksperimen Hari Ini</h2>
    <p class="cta-subheadline">[Supporting text]</p>
    <div class="cta-buttons">
      <button class="btn-primary-large">Daftar Sekarang</button>
      <button class="btn-secondary-large">Jadwalkan Demo</button>
    </div>
  </div>
</section>
```

**Styling Approach**:
- Background: Vibrant gradient matching hero
- Text: White or light color for contrast
- Buttons: Large, prominent, with hover animations
- Spacing: Generous padding for impact

### 9. Footer

**Purpose**: Provide navigation, legal links, and contact information

**Visual Design**:
- Multi-column layout on desktop, stacked on mobile
- Logo and tagline on left
- Link groups in middle columns
- Social media icons on right

**Content Structure**:
```html
<footer id="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <h3>kreatr.app</h3>
        <p>[Tagline]</p>
      </div>
      <div class="footer-links">
        <h4>Produk</h4>
        <ul>
          <li><a href="#features">Fitur</a></li>
          <li><a href="#pricing">Harga</a></li>
        </ul>
      </div>
      <div class="footer-links">
        <h4>Perusahaan</h4>
        <ul>
          <li><a href="#">Tentang</a></li>
          <li><a href="#">Blog</a></li>
        </ul>
      </div>
      <div class="footer-links">
        <h4>Legal</h4>
        <ul>
          <li><a href="#">Terms of Service</a></li>
          <li><a href="#">Privacy Policy</a></li>
        </ul>
      </div>
      <div class="footer-social">
        <h4>Ikuti Kami</h4>
        <div class="social-icons">
          [Social media icons]
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2025 kreatr.app. All rights reserved.</p>
    </div>
  </div>
</footer>
```

**Styling Approach**:
- Background: Dark color (navy or charcoal)
- Text: Light gray for readability
- Links: Hover effects, smooth transitions
- Grid: 4-5 columns desktop, stacked mobile

## Data Models

### Content Configuration

The landing page content will be structured as JavaScript objects for easy updates:

```javascript
const content = {
  hero: {
    headlines: [
      "Laboratorium AI untuk Kreator Konten",
      "Dari Ide ke Viral dalam Satu Platform",
      // ... more options
    ],
    subheadline: "Platform AI yang membantu kreator...",
    cta: {
      primary: "Mulai Gratis",
      secondary: "Coba Demo"
    }
  },
  problems: [
    {
      icon: "💭",
      title: "Kehabisan Ide",
      description: "..."
    },
    // ... more problems
  ],
  features: [
    {
      icon: "🧪",
      name: "AI Content Lab",
      description: "..."
    },
    // ... more features
  ],
  testimonials: [
    {
      quote: "...",
      author: "...",
      role: "..."
    },
    // ... more testimonials
  ],
  pricing: [
    {
      tier: "Free",
      description: "...",
      features: [],
      cta: "Mulai Gratis"
    },
    // ... more tiers
  ]
};
```

## Error Handling

### Graceful Degradation

1. **No JavaScript**: Page remains fully functional without JS
2. **Slow Connections**: Progressive loading with skeleton screens
3. **Old Browsers**: Fallback styles for unsupported CSS features
4. **Missing Resources**: Inline critical assets, CDN fallbacks

### Accessibility Considerations

1. **Semantic HTML**: Proper heading hierarchy, landmarks
2. **ARIA Labels**: For interactive elements and icons
3. **Keyboard Navigation**: Tab order, focus indicators
4. **Screen Readers**: Alt text, descriptive labels
5. **Color Contrast**: WCAG AA compliance minimum

## Testing Strategy

### Browser Testing

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Testing Tools**: BrowserStack or manual device testing

### Responsive Testing

- **Breakpoints**:
  - Mobile: 320px - 767px
  - Tablet: 768px - 1023px
  - Desktop: 1024px - 1440px
  - Large Desktop: 1441px+

### Performance Testing

- **Lighthouse Audit**: Target scores
  - Performance: 90+
  - Accessibility: 95+
  - Best Practices: 90+
  - SEO: 90+
- **Page Load**: Under 3 seconds on 3G
- **First Contentful Paint**: Under 1.5 seconds

### Validation

- **HTML Validation**: W3C Markup Validation Service
- **CSS Validation**: W3C CSS Validation Service
- **Link Checking**: Verify all internal anchors work
- **Form Testing**: If contact forms added later

## Deployment Strategy

### GitHub Pages Setup

1. Create `prototype` folder in repository root
2. Add `index.html` and supporting files
3. Enable GitHub Pages in repository settings
4. Set source to `main` branch, `/prototype` folder
5. Access via `https://[username].github.io/[repo]/prototype/`

### Custom Domain (Optional)

1. Add `CNAME` file with custom domain
2. Configure DNS records at domain registrar
3. Enable HTTPS in GitHub Pages settings

### Continuous Updates

- Direct commits to `main` branch auto-deploy
- Preview changes locally before pushing
- Use GitHub's built-in preview for pull requests

## Design Tokens

### Color Palette

```css
:root {
  /* Primary Colors */
  --color-primary: #6366f1;      /* Indigo */
  --color-primary-dark: #4f46e5;
  --color-primary-light: #818cf8;
  
  /* Secondary Colors */
  --color-secondary: #ec4899;    /* Pink */
  --color-secondary-dark: #db2777;
  --color-secondary-light: #f472b6;
  
  /* Neutral Colors */
  --color-dark: #1e293b;
  --color-gray: #64748b;
  --color-light: #f1f5f9;
  --color-white: #ffffff;
  
  /* Semantic Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  
  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
  --gradient-hero: linear-gradient(180deg, #1e293b 0%, #334155 100%);
}
```

### Typography

```css
:root {
  /* Font Families */
  --font-display: 'Inter', -apple-system, sans-serif;
  --font-body: 'Inter', -apple-system, sans-serif;
  
  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
  --text-6xl: 3.75rem;   /* 60px */
  
  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  
  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}
```

### Spacing

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
}
```

### Shadows

```css
:root {
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
```

### Border Radius

```css
:root {
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 0.75rem;   /* 12px */
  --radius-xl: 1rem;      /* 16px */
  --radius-full: 9999px;  /* Fully rounded */
}
```

## Animation Guidelines

### Transitions

- **Duration**: 150ms for micro-interactions, 300ms for larger changes
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` for smooth, natural feel
- **Properties**: Transform and opacity for performance

### Scroll Animations

- **Fade In**: Elements fade in as they enter viewport
- **Slide Up**: Cards slide up slightly on scroll
- **Stagger**: Sequential animation for lists/grids
- **Implementation**: Intersection Observer API or CSS scroll-driven animations

### Hover Effects

- **Buttons**: Scale slightly (1.05), increase shadow
- **Cards**: Lift effect with shadow increase
- **Links**: Color change, underline animation
- **Icons**: Rotate or bounce subtly

## Content Integration

The design will integrate the storytelling content from the brainstorming session, including:

1. **Hero Headlines**: Multiple options for A/B testing
2. **Pain Points**: 4 specific creator challenges
3. **Solution Narrative**: End-to-end workflow explanation
4. **Feature Descriptions**: Detailed benefits for each capability
5. **Demo Script**: Step-by-step user journey
6. **Testimonials**: Community-focused social proof
7. **Pricing Copy**: Value-focused tier descriptions
8. **CTA Messaging**: Motivational, curiosity-driven language

All content will be in Bahasa Indonesia with professional yet approachable tone.
