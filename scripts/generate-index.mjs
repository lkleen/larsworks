// scripts/generate-index.mjs
// Reads .md frontmatter from each locale folder -> writes assets/blog/{locale}/index.json
// Also generates public/sitemap.xml with locale-prefixed routes and hreflang alternates.
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import matter from 'gray-matter';

const LOCALES = ['en', 'de'];
const DEFAULT_LOCALE = 'en';
const BASE_URL = process.env['BASE_URL'] ?? 'http://localhost:4200';
const postsByLocale = new Map();

for (const locale of LOCALES) {
  const dir = `src/assets/blog/${locale}`;
  if (!existsSync(dir)) continue; // skip 'de' until you create the folder

  const files = readdirSync(dir).filter(f => f.endsWith('.md'));
  const posts = files.map(file => {
    const raw = readFileSync(`${dir}/${file}`, 'utf8');
    const { data } = matter(raw);
    const wordCount = raw.split(/\s+/).length;
    // Normalize date: gray-matter parses YAML dates as Date objects
    const date = data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : String(data.date);
    return { ...data, date, readingTime: Math.ceil(wordCount / 200) };
  });

  posts.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  writeFileSync(`${dir}/index.json`, JSON.stringify(posts, null, 2));
  console.log(`[${locale}] Generated index.json with ${posts.length} posts`);

  postsByLocale.set(locale, posts);
}

const normalize = (value) => value.replace(/\/$/, '');
const toAbsolute = (path) => `${normalize(BASE_URL)}${path}`;

const staticPaths = ['/', '/about', '/impressum', '/datenschutz'];
const sitemapUrls = [];

for (const locale of LOCALES) {
  for (const path of staticPaths) {
    const localizedPath = `/${locale}${path === '/' ? '' : path}`;
    sitemapUrls.push(`  <url><loc>${toAbsolute(localizedPath)}</loc></url>`);
  }
}

const slugs = new Set();
for (const locale of LOCALES) {
  const localePosts = postsByLocale.get(locale) ?? [];
  for (const post of localePosts) {
    slugs.add(post.slug);
  }
}

for (const slug of slugs) {
  const canonicalPostPath = `/${DEFAULT_LOCALE}/posts/${slug}`;
  const canonicalPostUrl = toAbsolute(canonicalPostPath);
  const alternateLinks = LOCALES.map((locale) => {
    const localizedPath = `/${locale}/posts/${slug}`;
    return `    <xhtml:link rel="alternate" hreflang="${locale}" href="${toAbsolute(localizedPath)}" />`;
  }).join('\n');

  const defaultPost = (postsByLocale.get(DEFAULT_LOCALE) ?? []).find((post) => post.slug === slug);
  const lastmod = defaultPost?.date;
  const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';

  sitemapUrls.push(
    `  <url>\n    <loc>${canonicalPostUrl}</loc>${lastmodTag}\n${alternateLinks}\n  </url>`,
  );
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapUrls.join('\n')}
</urlset>`;

writeFileSync('public/sitemap.xml', sitemap);
console.log('Generated locale-prefixed sitemap.xml');
