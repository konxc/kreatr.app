# kreatr.app Landing Page Prototype

Landing page static HTML untuk kreatr.app - AI-powered Social Media Lab untuk kreator konten.

## 🚀 Quick Start

Landing page ini adalah single HTML file yang self-contained dan siap untuk di-deploy ke GitHub Pages tanpa build process.

### Local Testing

1. Buka file `index.html` langsung di browser Anda
2. Atau gunakan local server sederhana:

```bash
# Menggunakan Python
python -m http.server 8000

# Menggunakan Node.js (http-server)
npx http-server

# Menggunakan PHP
php -S localhost:8000
```

3. Buka browser dan akses `http://localhost:8000`

## 📦 Deployment ke GitHub Pages

### Metode 1: Deploy dari Repository Root

1. Push folder `prototype` ke repository GitHub Anda
2. Buka **Settings** > **Pages** di repository
3. Pilih **Source**: Deploy from a branch
4. Pilih branch `main` dan folder `/prototype`
5. Klik **Save**
6. Landing page akan tersedia di: `https://[username].github.io/[repo-name]/prototype/`

### Metode 2: Deploy sebagai Root Site

Jika ingin landing page menjadi root site (`https://[username].github.io/[repo-name]/`):

1. Pindahkan `index.html` ke root repository
2. Di **Settings** > **Pages**, pilih folder `/ (root)`
3. Klik **Save**

### Metode 3: Custom Domain

1. Tambahkan file `CNAME` di folder prototype dengan isi domain Anda:
```
www.kreatr.app
```

2. Di registrar domain Anda, tambahkan DNS records:
```
Type: CNAME
Name: www
Value: [username].github.io
```

3. Enable **Enforce HTTPS** di GitHub Pages settings

## 🎨 Struktur File

```
prototype/
├── index.html          # Landing page lengkap (self-contained)
├── README.md           # Dokumentasi ini
└── assets/             # Folder untuk future images (optional)
    └── .gitkeep
```

## ✏️ Updating Content

Semua konten ada di dalam `index.html`. Untuk mengupdate:

### Hero Section
Cari section dengan `id="hero"` dan edit:
- `.hero-headline` - Headline utama
- `.hero-subheadline` - Subheadline
- Button text di `.cta-group`

### Problem Section
Cari section dengan `id="problems"` dan edit:
- `.problem-card` - Setiap card berisi icon, title, dan description

### Features Section
Cari section dengan `id="features"` dan edit:
- `.feature-card` - Setiap card berisi icon, title, dan description

### Pricing Section
Cari section dengan `id="pricing"` dan edit:
- `.pricing-card` - Setiap tier berisi name, description, features list, dan CTA

### Testimonials
Cari section dengan `id="testimonials"` dan edit:
- `.testimonial-card` - Quote, author name, dan role

## 🎯 Features

- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Smooth scroll animations
- ✅ Intersection Observer untuk scroll-triggered effects
- ✅ SEO optimized dengan meta tags
- ✅ Open Graph & Twitter Card support
- ✅ Accessibility compliant (WCAG AA)
- ✅ No build tools required
- ✅ Fast loading (< 3s on 3G)
- ✅ Modern CSS with custom properties
- ✅ Minimal JavaScript (vanilla JS only)

## 🎨 Design Tokens

Landing page menggunakan CSS custom properties untuk konsistensi:

```css
/* Colors */
--color-primary: #6366f1
--color-secondary: #ec4899
--color-dark: #1e293b
--color-light: #f1f5f9

/* Typography */
--font-display: 'Inter'
--text-base: 1rem
--text-xl: 1.25rem
--text-4xl: 2.25rem

/* Spacing */
--space-4: 1rem
--space-8: 2rem
--space-16: 4rem
```

Edit nilai-nilai