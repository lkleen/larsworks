# larsworks — Personal Website Architecture Blueprint

## Overview

A production-ready Angular personal website for Lars Kleen, starting with a software development blog and designed to grow into a full personal site (portfolio, contact, booking). Built with scalability, internationalization, social sharing, analytics, and future comment support in mind.

---

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Framework | Angular 17+ (standalone components) | Modern, signals-based, SSR-ready |
| Rendering | Angular Universal / SSR | SEO, social preview, fast first paint |
| Content | Markdown files + `ngx-markdown` | Git-tracked, portable, no vendor lock-in |
| i18n | `@angular/localize` | English-only to start, easy to add locales later |
| Styling | SCSS + CSS custom properties (theme) | Single-theme control via variables |
| Analytics | GA4 via `gtag()` (no library) | Lean, direct, Consent Mode v2 compatible |
| Cookie Consent | Custom `ConsentService` + banner component | GDPR-compliant, no extra library |
| Routing | Angular Router with lazy loading | Performance |
| Social | Open Graph + Twitter Card meta tags | LinkedIn, Twitter, etc. |
| Comments (future) | Giscus (GitHub Discussions) | Dev-friendly, no backend needed |
| Testing | Jest + `jest-preset-angular` | Fast, no browser needed, great DX |
| Linting | ESLint via `angular-eslint` | Official Angular schematic |
| Formatting | Prettier + `eslint-config-prettier` | Auto-format, no style debates |
| Deployment | GitHub → Vercel (auto on push to main) | SSR-native, free, custom domain support |

---

## Project Structure

```
larsworks/
├── scripts/
│   └── generate-index.mjs               # Reads .md frontmatter → assets/blog/{locale}/index.json
├── public/
│   ├── robots.txt                        # SEO crawler instructions
│   └── sitemap.xml                       # Generated at build time by generate-index.mjs
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── services/
│   │   │   │   ├── blog.service.ts       # Load/parse blog posts
│   │   │   │   ├── seo.service.ts        # Meta tags, OG, Twitter Card
│   │   │   │   ├── analytics.service.ts  # GA4 event tracking wrapper
│   │   │   │   └── consent.service.ts    # Cookie consent state + localStorage
│   │   │   └── models/
│   │   │       └── blog-post.model.ts    # BlogPost interface
│   │   ├── features/
│   │   │   ├── blog-list/                # Home / post listing
│   │   │   ├── blog-post/                # Single post view
│   │   │   ├── about/                    # About page
│   │   │   ├── impressum/                # Impressum — legally required (§ 5 TMG)
│   │   │   ├── datenschutz/              # Datenschutzerklärung — legally required (DSGVO)
│   │   │   └── not-found/                # 404 page
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── header/
│   │   │   │   ├── footer/
│   │   │   │   ├── post-card/
│   │   │   │   ├── social-share/         # LinkedIn / Twitter share buttons
│   │   │   │   └── cookie-banner/        # GDPR consent banner
│   │   │   └── pipes/
│   │   │       └── reading-time.pipe.ts
│   │   └── app.routes.ts
│   ├── environments/
│   │   ├── environment.ts                # Dev config (GA4 disabled, localhost URL)
│   │   └── environment.prod.ts           # Prod config (GA4 ID, live URL)
│   ├── assets/
│   │   ├── blog/
│   │   │   ├── en/                       # English posts (Markdown)
│   │   │   │   └── my-first-post.md
│   │   │   └── de/                       # German posts (add when ready)
│   │   └── i18n/
│   │       ├── messages.en.xlf           # English UI strings (source of truth)
│   │       └── messages.de.xlf          # German UI strings (fill in when ready)
│   ├── styles/
│   │   ├── _theme.scss                   # All CSS custom properties (THE theme file)
│   │   ├── _typography.scss
│   │   ├── _layout.scss
│   │   └── styles.scss                   # Imports above
│   └── index.html
├── .eslintrc.json                        # ESLint rules (Angular + Prettier)
├── .prettierrc                           # Prettier config
├── .nvmrc                                # Pins Node.js version for local dev + Vercel
├── jest.config.ts                        # Jest configuration
├── README.md                             # Setup, scripts, and project overview
└── .vscode/
    └── settings.json                     # Format-on-save for the whole team
```

---

## Internationalization (i18n)

**Starting with English only.** The project is set up to make adding a second language straightforward later — but no extra configuration is needed now.

### Setup (run once)

```bash
ng add @angular/localize
```

Even for English-only, installing `@angular/localize` is worthwhile. It lets you annotate strings now (`i18n="@@home.title"`) so that if you ever add German or another language, you just run `ng extract-i18n` and you'll get a ready-to-translate `.xlf` file with no code changes required.

### Mark strings as you go (optional but recommended)

```html
<h1 i18n="@@home.title">Latest Posts</h1>
<p i18n="@@home.subtitle">Thoughts on software development</p>
```

### When you're ready to add a second language

```bash
# Extract all marked strings into a translation file
ng extract-i18n --output-path src/assets/i18n

# Add the new locale to angular.json, provide the translated .xlf, then:
ng build --localize
# Outputs: dist/en/, dist/de/  (or whichever locales you add)
```

### Blog post content

Posts live in locale subfolders — the structure is in place from day one, even though only `en/` is populated initially:

```
assets/blog/en/angular-signals.md        ← write posts here now
assets/blog/de/angular-signals.md        ← add German translations when ready
```

`BlogService` resolves the active locale at runtime and redirects to `/not-found` if a post slug doesn't exist:

```typescript
// core/services/blog.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';
import { Observable, catchError, EMPTY } from 'rxjs';
import { Router } from '@angular/router';
import { BlogPost } from '../models/blog-post.model';

@Injectable({ providedIn: 'root' })
export class BlogService {
  private http   = inject(HttpClient);
  private locale = inject(LOCALE_ID);
  private router = inject(Router);

  getPosts(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`/assets/blog/${this.locale}/index.json`);
  }

  getPost(slug: string): Observable<string> {
    return this.http
      .get(`/assets/blog/${this.locale}/${slug}.md`, { responseType: 'text' })
      .pipe(
        catchError(() => {
          this.router.navigate(['/not-found']);
          return EMPTY;
        }),
      );
  }
}
```

The `generate-index.mjs` script runs per locale and generates a separate `index.json` for each:

```js
// scripts/generate-index.mjs
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import matter from 'gray-matter';

const LOCALES  = ['en', 'de'];
const BASE_URL = process.env['BASE_URL'] ?? 'http://localhost:4200';
const allPosts = [];

for (const locale of LOCALES) {
  const dir = `src/assets/blog/${locale}`;
  if (!existsSync(dir)) continue;           // skip 'de' until you create the folder

  const files = readdirSync(dir).filter(f => f.endsWith('.md'));
  const posts = files.map(file => {
    const raw       = readFileSync(`${dir}/${file}`, 'utf8');
    const { data }  = matter(raw);
    const wordCount = raw.split(/\s+/).length;
    return { ...data, readingTime: Math.ceil(wordCount / 200) };
  });

  posts.sort((a, b) => b.date.localeCompare(a.date));
  writeFileSync(`${dir}/index.json`, JSON.stringify(posts, null, 2));
  console.log(`[${locale}] Generated index.json with ${posts.length} posts`);

  if (locale === 'en') allPosts.push(...posts);   // use 'en' as canonical for sitemap
}

// Sitemap (canonical English URLs)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${BASE_URL}/</loc></url>
  <url><loc>${BASE_URL}/about</loc></url>
${allPosts.map(p => `  <url>
    <loc>${BASE_URL}/posts/${p.slug}</loc>
    <lastmod>${p.date}</lastmod>
  </url>`).join('\n')}
</urlset>`;

writeFileSync('public/sitemap.xml', sitemap);
console.log('Generated sitemap.xml');
```

---

## Environment Configuration

Angular's built-in environment files keep configuration values — like the GA4 measurement ID and the blog's base URL — out of hardcoded source and properly separated between development and production.

### Setup

`ng new` creates these files automatically. If they're missing:

```bash
ng generate environments
```

### src/environments/environment.ts (development)

```typescript
export const environment = {
  production: false,
  ga4MeasurementId: '',           // GA4 disabled in dev — no accidental tracking
  blogBaseUrl: 'http://localhost:4200',
};
```

### src/environments/environment.prod.ts (production)

```typescript
export const environment = {
  production: true,
  ga4MeasurementId: 'G-XXXXXXXXXX',   // ← replace with your real ID
  blogBaseUrl: 'https://larsworks.de',
};
```

Angular swaps `environment.ts` for `environment.prod.ts` automatically during `ng build`.

The full service implementations that consume these values are shown in their respective sections: `AnalyticsService` (GA4 section), `SeoService` and `SocialShareComponent` (SEO & Social Sharing section). Both import from `../../environments/environment` and guard on `ga4MeasurementId` being non-empty.

`generate-index.mjs` reads `BASE_URL` from a Node environment variable instead of the TypeScript environment files (which are not available to plain Node.js scripts):

```js
// scripts/generate-index.mjs — first line
const BASE_URL = process.env['BASE_URL'] ?? 'http://localhost:4200';
```

Set `BASE_URL=https://larsworks.de` in Vercel's project environment variables (Settings → Environment Variables) so the sitemap gets the correct production URL in CI builds.

---

## Single-Theme Styling

All visual design tokens live in one file: `_theme.scss`. Changing the theme means editing only this file.

```scss
// src/styles/_theme.scss

:root {
  // Brand colors
  --color-primary:       #0f62fe;
  --color-primary-hover: #0353e9;
  --color-accent:        #42be65;

  // Surfaces
  --color-bg:            #ffffff;
  --color-surface:       #f4f4f4;
  --color-border:        #e0e0e0;

  // Text
  --color-text:          #161616;
  --color-text-muted:    #525252;
  --color-text-inverse:  #ffffff;

  // Typography
  --font-display:        'Playfair Display', serif;
  --font-body:           'IBM Plex Sans', sans-serif;
  --font-mono:           'IBM Plex Mono', monospace;

  // Spacing scale
  --space-xs:  0.25rem;
  --space-sm:  0.5rem;
  --space-md:  1rem;
  --space-lg:  2rem;
  --space-xl:  4rem;

  // Radii
  --radius-sm: 4px;
  --radius-md: 8px;

  // Code block
  --color-code-bg:   #1e1e1e;
  --color-code-text: #d4d4d4;
}

// Dark mode (optional future toggle)
[data-theme="dark"] {
  --color-bg:       #161616;
  --color-surface:  #262626;
  --color-border:   #393939;
  --color-text:     #f4f4f4;
  --color-text-muted: #a8a8a8;
}
```

Components never hardcode colors — they reference `var(--color-primary)` etc. To retheme the entire blog: **edit one file**.

---

## Blog Post Format

Each post is a Markdown file with YAML frontmatter:

```markdown
---
title: "Understanding Angular Signals"
slug: understanding-angular-signals
date: 2024-03-15
author: Your Name
lang: en
tags: [angular, signals, reactivity]
excerpt: "A deep dive into Angular's new reactivity model..."
coverImage: /assets/images/angular-signals.jpg
---
```

The `generate-index.mjs` script (see i18n section) handles index generation and sitemap for all locales in one pass.

---

## SEO & Social Sharing

### SeoService

```typescript
// core/services/seo.service.ts
import { Injectable, inject, LOCALE_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { BlogPost } from '../models/blog-post.model';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private meta   = inject(Meta);
  private title  = inject(Title);
  private locale = inject(LOCALE_ID);

  setPostMeta(post: BlogPost): void {
    const url = `${environment.blogBaseUrl}/posts/${post.slug}`;

    this.title.setTitle(`${post.title} | YourBlog`);

    this.meta.updateTag({ name: 'description', content: post.excerpt });

    // Open Graph (LinkedIn, Facebook, Slack)
    this.meta.updateTag({ property: 'og:title',       content: post.title });
    this.meta.updateTag({ property: 'og:description', content: post.excerpt });
    this.meta.updateTag({ property: 'og:url',         content: url });
    this.meta.updateTag({ property: 'og:image',       content: post.coverImage ?? '' });
    this.meta.updateTag({ property: 'og:type',        content: 'article' });
    this.meta.updateTag({ property: 'article:published_time', content: post.date });
    this.meta.updateTag({ property: 'article:tag',    content: post.tags.join(',') });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card',        content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title',       content: post.title });
    this.meta.updateTag({ name: 'twitter:description', content: post.excerpt });
    this.meta.updateTag({ name: 'twitter:image',       content: post.coverImage ?? '' });

    // hreflang — add alternate language links here when German is live.
    // Example (add via this.meta or inject a DOCUMENT link element):
    // <link rel="alternate" hreflang="en" href="https://larsworks.de/posts/{slug}">
    // <link rel="alternate" hreflang="de" href="https://larsworks.de/posts/{slug}">
    // <link rel="alternate" hreflang="x-default" href="https://larsworks.de/posts/{slug}">
  }
}
```

> **Why SSR matters for social:** LinkedIn, Twitter, and Slack scrapers do not execute JavaScript. Angular Universal (SSR) ensures the `<meta>` tags are in the HTML when the scraper hits the URL. Without SSR, your post previews will be blank.

### Social Share Buttons

```typescript
// shared/components/social-share/social-share.component.ts
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-social-share',
  standalone: true,
  template: `
    <a [href]="linkedinUrl" target="_blank" rel="noopener">Share on LinkedIn</a>
    <a [href]="twitterUrl"  target="_blank" rel="noopener">Share on X</a>
  `
})
export class SocialShareComponent {
  @Input() post!: BlogPost;

  get linkedinUrl(): string {
    const url = encodeURIComponent(`${environment.blogBaseUrl}/posts/${this.post.slug}`);
    return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  }

  get twitterUrl(): string {
    const text = encodeURIComponent(this.post.title);
    const url  = encodeURIComponent(`${environment.blogBaseUrl}/posts/${this.post.slug}`);
    return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  }
}
```

---

## Google Analytics 4 (GA4)

No extra library needed. GA4 integrates cleanly via the `gtag()` global function already loaded by the `<script>` tag in `index.html`. A thin `AnalyticsService` wraps it and guards on consent.

### index.html — load GA4 with Consent Mode v2 default

```html
<!-- index.html — in <head> -->
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('consent', 'default', { analytics_storage: 'denied', wait_for_update: 500 });
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');  // replace with environment.prod.ts ga4MeasurementId value
</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

> The GA4 ID in `index.html` must match `environment.prod.ts`. Because `index.html` is static HTML, it cannot reference TypeScript environment files directly — keep the two in sync manually, or use Angular's `fileReplacements` in `angular.json` with a build-time token if you want to automate it.

### AnalyticsService — consent-aware, no library

```typescript
// core/services/analytics.service.ts
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { ConsentService } from './consent.service';

declare function gtag(...args: unknown[]): void;

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private consent = inject(ConsentService);

  updateConsent(granted: boolean): void {
    if (!environment.ga4MeasurementId) return;   // no-op in dev
    gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
    });
  }

  event(name: string, params?: Record<string, unknown>): void {
    if (this.consent.consent() !== 'accepted') return;
    if (!environment.ga4MeasurementId) return;   // no-op in dev
    gtag('event', name, params);
  }

  pageView(path: string): void {
    if (this.consent.consent() !== 'accepted') return;
    if (!environment.ga4MeasurementId) return;   // no-op in dev
    gtag('event', 'page_view', { page_path: path });
  }
}
```

### Wire page tracking to the Router

```typescript
// app.component.ts
export class AppComponent {
  constructor(router: Router, analytics: AnalyticsService) {
    router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(e => analytics.pageView((e as NavigationEnd).urlAfterRedirects));
  }
}
```

### app.config.ts — no GA library needed

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),          // ← required for BlogService
    provideClientHydration(),     // ← required for SSR
  ]
};
```

> **Remove** `angularx-google-analytics` from the project entirely — it is no longer needed.

---

## Cookie Consent (GDPR)

Under the GDPR and the German TTDSG, analytics cookies require **prior, informed, freely given consent** — GA4 must not load until the user explicitly accepts. This is implemented with a custom `ConsentService` (no third-party library needed) that gates GA4 initialization.

### ConsentService

Stores the user's choice in `localStorage` and exposes a reactive signal. On change, it calls `AnalyticsService` to update GA4's consent state.

```typescript
// core/services/consent.service.ts
export type ConsentChoice = 'accepted' | 'declined' | null;

@Injectable({ providedIn: 'root' })
export class ConsentService {
  private readonly STORAGE_KEY = 'cookie_consent';

  readonly consent = signal<ConsentChoice>(this.loadFromStorage());

  // Lazy inject to avoid circular dependency
  private analytics = inject(AnalyticsService);

  accept(): void {
    this.consent.set('accepted');
    localStorage.setItem(this.STORAGE_KEY, 'accepted');
    this.analytics.updateConsent(true);
  }

  decline(): void {
    this.consent.set('declined');
    localStorage.setItem(this.STORAGE_KEY, 'declined');
    this.analytics.updateConsent(false);
  }

  revoke(): void {
    this.consent.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
    this.analytics.updateConsent(false);
  }

  get isPending(): boolean {
    return this.consent() === null;
  }

  private loadFromStorage(): ConsentChoice {
    if (typeof localStorage === 'undefined') return null; // SSR guard
    return (localStorage.getItem(this.STORAGE_KEY) as ConsentChoice) ?? null;
  }
}
```

### GA4 — Default Denied (already handled in index.html above)

### CookieBannerComponent

Shown on first visit (when consent is `null`). Dismissed on accept or decline and never shown again.

```typescript
// shared/components/cookie-banner/cookie-banner.component.ts
@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  template: `
    @if (consent.isPending) {
      <div class="cookie-banner" role="dialog" aria-label="Cookie consent">
        <p>
          This site uses Google Analytics to understand how readers find and use content.
          No data is collected without your consent.
          <a routerLink="/datenschutz">Datenschutzerklärung</a>
        </p>
        <div class="cookie-banner__actions">
          <button class="btn btn--secondary" (click)="decline()">Decline</button>
          <button class="btn btn--primary"   (click)="accept()">Accept analytics</button>
        </div>
      </div>
    }
  `,
  styleUrl: './cookie-banner.component.scss'
})
export class CookieBannerComponent {
  protected consent = inject(ConsentService);

  accept():  void { this.consent.accept(); }
  decline(): void { this.consent.decline(); }
}
```

```scss
// cookie-banner.component.scss
.cookie-banner {
  position: fixed;
  bottom: var(--space-lg);
  left: 50%;
  transform: translateX(-50%);
  width: min(560px, calc(100vw - 2rem));

  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md) var(--space-lg);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  z-index: 1000;

  display: flex;
  flex-direction: column;
  gap: var(--space-sm);

  &__actions {
    display: flex;
    gap: var(--space-sm);
    justify-content: flex-end;
  }
}
```

Add the banner to `app.component.html` so it appears on every page:

```html
<!-- app.component.html -->
<app-header />
<router-outlet />
<app-footer />
<app-cookie-banner />   <!-- ← add here -->
```

### "Manage Cookie Preferences" link

Users must be able to revoke consent at any time. Add a link in the footer:

```typescript
// footer.component.ts
export class FooterComponent {
  protected consent = inject(ConsentService);
}
```

```html
<!-- footer.component.html -->
<a (click)="consent.revoke()" role="button" tabindex="0">
  Cookie preferences
</a>
```

Clicking this resets consent to `null`, which makes the banner reappear.

All components use `AnalyticsService.event()` (defined in the GA4 section above), never `gtag()` directly.

### Consent Flow Summary

```
First visit
    └─ ConsentService.consent() === null
         └─ CookieBannerComponent renders
              ├─ Accept  → localStorage = "accepted" → GA4 granted → banner hides
              └─ Decline → localStorage = "declined" → GA4 denied  → banner hides

Return visit
    └─ ConsentService reads localStorage
         ├─ "accepted" → GA4 granted immediately, no banner
         └─ "declined" → GA4 denied,  no banner

Footer "Cookie preferences" link
    └─ consent.revoke() → localStorage cleared → banner reappears
```

---

## Comments (Future: Giscus)

[Giscus](https://giscus.app) maps GitHub Discussions to blog posts — no backend, no database, authentication via GitHub. Perfect for a dev audience.

### Prerequisites

1. Your `larsworks` repo must be **public**
2. Enable the **Discussions** feature in your GitHub repo settings
3. Install the [Giscus GitHub App](https://github.com/apps/giscus) on the repo
4. Visit [giscus.app](https://giscus.app) to generate your `repo-id` and `category-id`

### Add to `blog-post.component.ts`

Create a wrapper component so the script loads lazily and only after user interaction (good for GDPR and performance):

```typescript
@Component({
  selector: 'app-comments',
  template: `
    @if (loaded) {
      <ng-container #giscusHost></ng-container>
    } @else {
      <button (click)="load()">Load comments</button>
    }
  `
})
export class CommentsComponent {
  loaded = false;

  load(): void {
    this.loaded = true;
    // Dynamically inject the Giscus script after click
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'yourname/larsworks');
    script.setAttribute('data-repo-id', 'YOUR_REPO_ID');
    script.setAttribute('data-category', 'Blog Comments');
    script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID');
    script.setAttribute('data-mapping', 'pathname');  // post URL → discussion
    script.setAttribute('data-theme', 'light');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    document.querySelector('ng-container')?.appendChild(script);
  }
}
```

The `data-mapping="pathname"` setting automatically creates a new Discussion thread for each post URL — no manual linking required.

---

## Server-Side Rendering (SSR)

SSR is **required** for social sharing previews (LinkedIn, etc.) and important for SEO.

```bash
ng add @angular/ssr
```

This adds Angular Universal. The blog post component calls `SeoService.setPostMeta()` in `ngOnInit`, which runs on the server and injects the correct `<meta>` tags into the HTML before it's served.

---

## Deployment: GitHub + Vercel + Custom Domain

This is the recommended setup: **GitHub repo as the source of truth, Vercel as the host**. Every push to `main` triggers an automatic deployment. No GitHub Actions workflow needed — Vercel handles CI/CD itself.

### Why not GitHub Pages?

GitHub Pages serves only static files. Angular SSR requires a running Node.js server to render pages on request. Without it, LinkedIn and other social scrapers receive a blank HTML shell and your post previews break. Vercel runs the Node server for you at no cost.

### Setup (one-time, ~10 minutes)

**1. Push your repo to GitHub**
```bash
git remote add origin https://github.com/yourname/larsworks.git
git push -u origin main
```

**2. Import the repo into Vercel**

- Go to [vercel.com](https://vercel.com) and sign in with your GitHub account (free tier is sufficient)
- Click **Add New → Project** and select your repository
- Vercel auto-detects Angular; set the build command to:
  ```
  npm run build
  ```
  and the output directory to:
  ```
  dist/larsworks/browser
  ```
  (Replace `larsworks` with whatever name you gave in `ng new`. Angular 17+ SSR output; Vercel picks up the `server/` folder automatically)
- Click **Deploy**

From this point on, every `git push origin main` triggers a new deployment automatically.

**3. Connect your custom domain**

- In your Vercel project, go to **Settings → Domains**
- Add your domain: `larsworks.de`
- Vercel provides DNS records (typically a CNAME or A record)
- Log in to your domain registrar and add those records to your DNS zone for `larsworks.de`
- Vercel provisions a free TLS certificate via Let's Encrypt automatically

> DNS propagation can take up to 24 hours, but is usually under 30 minutes.

### Preview deployments (bonus)

Every pull request or branch push gets its own preview URL (e.g. `larsworks-git-feature-x.vercel.app`). Useful for reviewing posts or new features before merging.

### robots.txt and sitemap.xml

Place `robots.txt` in `public/` — Angular copies everything in `public/` to the build output root. The sitemap is generated automatically by `generate-index.mjs` (see i18n section).

```
# public/robots.txt
User-agent: *
Allow: /
Sitemap: https://larsworks.de/sitemap.xml
```

Add the script as a `prebuild` step in `package.json` so it runs automatically before every build:

```json
"scripts": {
  "prebuild": "node scripts/generate-index.mjs",
  "build": "ng build"
}
```

---

## Local Development

Angular's dev server with SSR support runs the full stack locally — the same rendering path used in production.

### Node.js version — .nvmrc

Pin the Node.js version so your local environment and Vercel's build runner always match:

```
# .nvmrc
22
```

Use `nvm use` when entering the project to switch automatically. Vercel reads `.nvmrc` and uses the same version in CI.

```bash
nvm use       # switches to the version in .nvmrc
npm install   # always run after switching Node versions
```

```bash
ng serve                  # http://localhost:4200  (SSR dev server, hot reload)
ng serve --port 4201      # run on a different port if needed
```

The `prebuild` script (`generate-index.mjs`) does **not** run automatically during `ng serve`. Run it manually after adding or editing posts:

```bash
node scripts/generate-index.mjs && ng serve
```

Or add a convenience script to `package.json`:

```json
"scripts": {
  "start":    "node scripts/generate-index.mjs && ng serve",
  "prebuild": "node scripts/generate-index.mjs",
  "build":    "ng build",
  "test":     "jest",
  "test:watch": "jest --watch",
  "lint":     "ng lint",
  "format":   "prettier --write \"src/**/*.{ts,html,scss}\""
}
```

---

## Unit Testing (Jest)

Angular's default test runner is Karma, which launches a real browser. Jest runs in Node.js — faster, no browser overhead, and better suited to a CI environment like Vercel's build pipeline.

### Setup

```bash
# Remove Karma (added by ng new)
npm uninstall karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter

# Install Jest
npm install -D jest jest-preset-angular @types/jest

# Remove karma.conf.js and src/test.ts
```

### Additional dependencies

```bash
npm install -D ts-node jest-environment-jsdom jest-preset-angular
```

### jest.config.ts

```typescript
import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  collectCoverageFrom: ['src/app/**/*.ts', '!src/app/**/*.module.ts'],
  coverageReporters: ['text-summary', 'lcov'],
};

export default config;
```

### setup-jest.ts

```typescript
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();
```

### Update tsconfig.json

Add `esModuleInterop` to `compilerOptions` to suppress ts-jest warnings:

```json
"esModuleInterop": true
```

### Update tsconfig.spec.json

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": ["jest"]          // ← replace "jasmine" with "jest"
  },
  "include": ["src/**/*.spec.ts", "setup-jest.ts"]
}
```

### What to test

For a blog, focus tests where they provide the most value and skip trivial ones (KISS):

| What | Why |
|---|---|
| `BlogService` | Verify correct locale path is called, posts are sorted by date |
| `SeoService` | Assert correct `<meta>` tags are set per post |
| `ConsentService` | Test accept/decline/revoke state transitions and `localStorage` interaction |
| `AnalyticsService` | Verify events are dropped when consent is declined |
| `generate-index.mjs` | Smoke-test that index.json output matches expected shape |

Skip snapshot tests and pure template tests — they add maintenance burden with little signal.

### Example: ConsentService spec

```typescript
// consent.service.spec.ts
describe('ConsentService', () => {
  let service: ConsentService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsentService);
  });

  it('starts as pending when localStorage is empty', () => {
    expect(service.isPending).toBe(true);
  });

  it('stores accepted state in localStorage', () => {
    service.accept();
    expect(localStorage.getItem('cookie_consent')).toBe('accepted');
    expect(service.consent()).toBe('accepted');
  });

  it('clears state on revoke', () => {
    service.accept();
    service.revoke();
    expect(service.isPending).toBe(true);
    expect(localStorage.getItem('cookie_consent')).toBeNull();
  });
});
```

---

## Linting (ESLint)

Angular provides an official schematic that configures ESLint with Angular-specific rules.

### Setup

```bash
ng add @angular-eslint/schematics
```

This generates `.eslintrc.json` pre-configured for Angular. No manual rule setup needed.

### .eslintrc.json (after Prettier integration, see below)

```json
{
  "root": true,
  "ignorePatterns": ["projects/**/*"],
  "overrides": [
    {
      "files": ["*.ts"],
      "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@angular-eslint/recommended",
        "plugin:@angular-eslint/template/process-inline-templates",
        "prettier"                         // ← must be last; disables rules Prettier owns
      ],
      "rules": {
        "@angular-eslint/component-selector": ["error", { "type": "element", "prefix": "app", "style": "kebab-case" }],
        "@angular-eslint/directive-selector": ["error", { "type": "attribute", "prefix": "app", "style": "camelCase" }]
      }
    },
    {
      "files": ["*.html"],
      "extends": [
        "plugin:@angular-eslint/template/recommended",
        "plugin:@angular-eslint/template/accessibility",
        "prettier"
      ]
    }
  ]
}
```

---

## Code Formatting (Prettier)

Prettier enforces consistent formatting automatically — no manual style debates, no diff noise from mixed indentation.

### Setup

```bash
npm install -D prettier eslint-config-prettier
```

`eslint-config-prettier` disables any ESLint rules that conflict with Prettier's output (that's the `"prettier"` entry at the end of each `extends` array above).

### .prettierrc

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "bracketSameLine": false
}
```

### .prettierignore

```
dist/
.angular/
node_modules/
src/assets/blog/
src/assets/i18n/
```

### VS Code integration (recommended)

Add `.vscode/settings.json` to the repo so every contributor gets format-on-save automatically:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[html]":       { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[scss]":       { "editor.defaultFormatter": "esbenp.prettier-vscode" }
}
```

### Pre-commit hook (optional but recommended)

Prevent unformatted code from ever reaching the repo:

```bash
npm install -D husky lint-staged
npx husky init
```

`.husky/pre-commit`:
```bash
npx lint-staged
```

`package.json`:
```json
"lint-staged": {
  "src/**/*.{ts,html,scss}": ["prettier --write", "eslint --fix"]
}
```

---

## Legal Compliance (Germany / DSGVO)

German law requires specific legal pages to be in place **before the site goes live**. Violations are actively pursued in Germany — this is not optional.

### What is required and why

| Document | Legal basis | Trigger |
|---|---|---|
| **Impressum** | § 5 TMG, § 55 RStV | Any website with commercial or professional purpose |
| **Datenschutzerklärung** | Art. 13 DSGVO | Any processing of personal data (analytics, server logs, forms) |
| **Cookie consent** | TTDSG § 25, DSGVO Art. 6 | Any non-essential cookies or tracking (GA4) |
| **Vercel DPA** | DSGVO Art. 28 | Vercel processes personal data (IP addresses in server logs) on your behalf |

### Vercel Data Processing Agreement

Accept Vercel's DPA before going live: Vercel Dashboard → Settings → Legal → Data Processing Agreement. This is a DSGVO Art. 28 requirement — without it, using Vercel to serve a site to EU visitors is non-compliant.

### Routes

Two separate routes — the Impressum and Datenschutzerklärung must be independently linkable and are distinct documents:

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '',              loadComponent: () => import('./features/blog-list/blog-list.component') },
  { path: 'posts/:slug',   loadComponent: () => import('./features/blog-post/blog-post.component') },
  { path: 'about',         loadComponent: () => import('./features/about/about.component') },
  { path: 'impressum',     loadComponent: () => import('./features/impressum/impressum.component') },
  { path: 'datenschutz',   loadComponent: () => import('./features/datenschutz/datenschutz.component') },
  { path: '**',            loadComponent: () => import('./features/not-found/not-found.component') },
];
```

### Footer links

Both pages must be reachable from every page via the footer — this is a legal requirement, not a UX suggestion:

```html
<!-- shared/components/footer/footer.component.html -->
<footer>
  <nav aria-label="Legal">
    <a routerLink="/impressum">Impressum</a>
    <a routerLink="/datenschutz">Datenschutz</a>
    <a (click)="consent.revoke()" role="button" tabindex="0">Cookie-Einstellungen</a>
  </nav>
</footer>
```

### Impressum stub

Generate the component and fill it with content from [erecht24.de](https://www.erecht24.de) or [impressum-generator.de](https://www.impressum-generator.de). The stub below marks the required fields:

```typescript
// features/impressum/impressum.component.ts
@Component({
  selector: 'app-impressum',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main>
      <h1>Impressum</h1>

      <h2>Angaben gemäß § 5 TMG</h2>
      <p>
        <!-- TODO: Replace with your full legal name and address -->
        Lars Kleen<br>
        [Straße und Hausnummer]<br>
        [PLZ] [Stadt]<br>
        Deutschland
      </p>

      <h2>Kontakt</h2>
      <p>
        <!-- TODO: Replace with your contact details -->
        E-Mail: [ihre@email.de]<br>
        Telefon: [+49 ...]
      </p>

      <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
      <p>
        Lars Kleen<br>
        [Adresse wie oben]
      </p>

      <!-- TODO: If self-employed / freelancer, add Berufsbezeichnung and
           zuständige Aufsichtsbehörde if applicable -->
    </main>
  `
})
export class ImpressumComponent {}
```

### Datenschutzerklärung stub

Generate the full text using [erecht24.de](https://www.erecht24.de) or [datenschutz-generator.de](https://datenschutz-generator.de) — these tools produce legally reviewed text tailored to your specific setup (GA4, Vercel hosting, Giscus). The stub marks the mandatory topics that must be covered:

```typescript
// features/datenschutz/datenschutz.component.ts
@Component({
  selector: 'app-datenschutz',
  standalone: true,
  template: `
    <main>
      <h1>Datenschutzerklärung</h1>

      <!-- TODO: Generate full text at erecht24.de or datenschutz-generator.de -->
      <!-- The generated text must cover ALL of the following: -->

      <!-- 1. Verantwortlicher (your name, address, email) -->
      <!-- 2. Hosting: Vercel Inc., San Francisco — server logs with IP addresses,
                       legal basis: Art. 6(1)(f) DSGVO (legitimate interest),
                       link to Vercel privacy policy -->
      <!-- 3. Google Analytics 4: what is collected, purpose, legal basis: Art. 6(1)(a)
                       DSGVO (consent), opt-out link, data transfer to USA (SCCs),
                       link to Google privacy policy -->
      <!-- 4. Kommentare via Giscus / GitHub (when enabled): GitHub processes data,
                       link to GitHub privacy policy -->
      <!-- 5. Betroffenenrechte: Art. 15–21 DSGVO
                       (Auskunft, Berichtigung, Löschung, Einschränkung,
                        Widerspruch, Datenübertragbarkeit) -->
      <!-- 6. Beschwerderecht bei der zuständigen Aufsichtsbehörde -->
      <!-- 7. SSL/TLS-Verschlüsselung -->

      <p>
        <em>Diese Seite wird derzeit aktualisiert.
        Bitte schauen Sie später wieder vorbei.</em>
      </p>
    </main>
  `
})
export class DatenschutzComponent {}
```

> **Before going live:** replace the stub content with the generated legal text. The site must not be publicly accessible with placeholder content in these pages.

### Checklist before going live

- [ ] Impressum filled with real name, address, email, phone
- [ ] Datenschutzerklärung generated and covers GA4, Vercel, and all data processing
- [ ] Cookie consent banner working (accept / decline / revoke)
- [ ] Both pages linked in footer on every route
- [ ] Vercel DPA accepted in Vercel dashboard
- [ ] GA4 Consent Mode v2 verified — check that `analytics_storage` starts as `denied` in browser devtools before accepting cookies

---



A `README.md` at the repo root documents everything a contributor (or future-you) needs to get up and running. Commit this alongside the initial project setup.

```markdown
# larsworks

Personal website for Lars Kleen — software development blog, built with Angular 17+, SSR, and Markdown. Future sections: portfolio, contact, booking.

**Live:** https://larsworks.de

---

## Prerequisites

- [nvm](https://github.com/nvm-sh/nvm) (recommended)
- Node.js (version pinned in `.nvmrc`)

## Setup

```bash
nvm use
npm install
```

## Development

```bash
npm start         # generate post index + start SSR dev server at localhost:4200
```

After adding or editing a Markdown post in `src/assets/blog/en/`, re-run `npm start`
to regenerate `index.json`.

## Scripts

| Command              | Description                              |
|----------------------|------------------------------------------|
| `npm start`          | Generate index + start dev server        |
| `npm run build`      | Production build (also runs index gen)   |
| `npm test`           | Run Jest unit tests                      |
| `npm run test:watch` | Jest in watch mode                       |
| `npm run lint`       | ESLint                                   |
| `npm run format`     | Prettier (writes in place)               |

## Deployment

Push to `main` — Vercel deploys automatically to https://larsworks.de.

## Adding a blog post

1. Create `src/assets/blog/en/my-post-slug.md`
2. Add YAML frontmatter (see architecture doc for required fields)
3. Run `npm start` to pick up the new post locally
4. Push to `main` to publish

## Adding German (i18n)

See the architecture blueprint for the full checklist.

## Before going live

- [ ] Fill `src/app/features/impressum/` with real Impressum content
- [ ] Fill `src/app/features/datenschutz/` with generated Datenschutzerklärung (use erecht24.de)
- [ ] Accept Vercel DPA: Vercel Dashboard → Settings → Legal
- [ ] Verify cookie consent banner works correctly
```

---

## Getting Started (Step by Step)

```bash
# 1. Create the project
ng new larsworks --routing --style=scss --ssr

# 2. Pin Node.js version
echo "22" > .nvmrc

# 3. Add i18n support
ng add @angular/localize

# 4. Add Markdown rendering + frontmatter parsing
npm install ngx-markdown marked
npm install -D gray-matter

# 5. Add linting (ESLint)
ng add @angular-eslint/schematics

# 6. Add formatting (Prettier)
npm install -D prettier eslint-config-prettier

# 7. Add pre-commit hook (optional)
npm install -D husky lint-staged
npx husky init

# 8. Switch from Karma to Jest
npm uninstall karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter
npm install -D jest jest-preset-angular @types/jest
# → create jest.config.ts and setup-jest.ts (see Testing section)
# → delete karma.conf.js and src/test.ts

# 9. Generate environment files (if not already present)
ng generate environments

# 10. Generate core structure
ng generate service core/services/blog
ng generate service core/services/seo
ng generate service core/services/analytics
ng generate service core/services/consent

ng generate component features/blog-list
ng generate component features/blog-post
ng generate component features/about
ng generate component features/not-found
ng generate component features/impressum        # stub — fill before going live (§ 5 TMG)
ng generate component features/datenschutz      # stub — fill before going live (DSGVO)
ng generate component shared/components/post-card
ng generate component shared/components/social-share
ng generate component shared/components/cookie-banner

# 11. Run locally
npm start           # generates index.json then starts SSR dev server

# 12. Run tests
npm test

# 13. Deploy: push to main — Vercel does the rest
#     (Set BASE_URL=https://larsworks.de in Vercel environment variables)
git push origin main
```

---

## Data Model

```typescript
// core/models/blog-post.model.ts
export interface BlogPost {
  slug:        string;
  title:       string;
  date:        string;       // ISO 8601: "2024-03-15"
  author:      string;
  tags:        string[];
  excerpt:     string;
  coverImage?: string;
  lang:        'en' | 'de';  // drives BlogService locale path
  readingTime: number;       // minutes (computed by generate-index.mjs)
  content?:    string;       // Markdown body (loaded on-demand in blog-post route)
}
```

### App Routes

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '',              loadComponent: () => import('./features/blog-list/blog-list.component') },
  { path: 'posts/:slug',   loadComponent: () => import('./features/blog-post/blog-post.component') },
  { path: 'about',         loadComponent: () => import('./features/about/about.component') },
  { path: 'impressum',     loadComponent: () => import('./features/impressum/impressum.component') },
  { path: 'datenschutz',   loadComponent: () => import('./features/datenschutz/datenschutz.component') },
  { path: '**',            loadComponent: () => import('./features/not-found/not-found.component') },
];
```

---

## Key Architectural Decisions & Rationale

**Environment files (`environment.ts`)** — The GA4 measurement ID and blog base URL live in `environment.prod.ts`, not in source code. In development, `ga4MeasurementId` is empty so `AnalyticsService` no-ops silently — no accidental tracking of local sessions. `generate-index.mjs` reads `BASE_URL` from a Vercel environment variable for the same reason.

**`.nvmrc` for Node.js version pinning** — One file ensures local dev and Vercel's build runner use the same Node.js version. Without it, a Node.js major version mismatch between environments can produce builds that work locally but fail in CI.

**Jest over Karma** — Karma spins up a real browser for every test run, which is slow and fragile in CI. Jest runs in Node.js, starts in under a second, and has a vastly better developer experience (watch mode, inline coverage, clear error output). `jest-preset-angular` handles all the Angular-specific wiring.

**ESLint via `@angular-eslint/schematics`** — The official Angular schematic sets up ESLint with the correct Angular rules in one command. No manual configuration needed to get started.

**Prettier + `eslint-config-prettier`** — Prettier handles all formatting decisions; ESLint handles code quality. The `eslint-config-prettier` package disables any ESLint rules that would conflict with Prettier, so the two tools never fight each other. The pre-commit hook via `husky` + `lint-staged` ensures nothing unformatted reaches the repo.

**Markdown in Git vs. CMS** — Markdown files keep content portable and version-controlled. You can migrate to a headless CMS later by swapping out `BlogService` — the rest of the app stays the same.

**`@angular/localize` with locale subfolders from day one** — Starting English-only but the `en/` and `de/` folder structure, the `lang` field on `BlogPost`, and the `LOCALE_ID`-aware `BlogService` are all in place immediately. Adding German later means: translate the `.md` files, fill in `messages.de.xlf`, and configure the second locale in `angular.json` — no structural refactoring required.

**No `angularx-google-analytics`** — The library wraps `gtag()` but adds an unnecessary dependency and an extra initialization pattern. Calling `gtag()` directly in a thin `AnalyticsService` is simpler, lighter, and integrates more naturally with Consent Mode v2.

**GitHub + Vercel over GitHub Pages** — GitHub Pages is free but static-only. Vercel supports Angular SSR natively, connects to GitHub for auto-deploy, and provides free custom domain + TLS. The free tier comfortably covers a personal blog.

**Giscus for comments** — Maps GitHub Discussions to post URLs automatically. Zero backend, zero cost, and your audience (developers) already has GitHub accounts. The "Load comments" button pattern keeps it lazy — better performance and avoids GDPR concerns around third-party scripts loading automatically.

**Cookie consent via `ConsentService` + Consent Mode v2** — No third-party consent library needed. The custom service uses Angular signals to gate GA4 via Google's official API. Fully GDPR/TTDSG-compliant, keeps the bundle lean.

**Impressum and Datenschutzerklärung as separate routes** — German law requires both to be independently linkable from every page. Combining them into a single `/privacy` route would technically work but is bad practice — they serve different legal purposes and users (and authorities) expect to find them at predictable, separate URLs. Both are scaffolded as stubs that must be filled with generated legal text before the site goes live.

**SSR as a non-negotiable** — Without server-side rendering, social sharing previews (LinkedIn, Slack, iMessage) will show no title, description, or image. This is the single most impactful technical decision for a blog.
