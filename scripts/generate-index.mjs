// scripts/generate-index.mjs
// Reads .md frontmatter from each locale folder → writes assets/blog/{locale}/index.json
// Also generates public/sitemap.xml from the canonical English posts.
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import matter from 'gray-matter';

const LOCALES = ['en', 'de'];
const BASE_URL = process.env['BASE_URL'] ?? 'http://localhost:4200';
const allPosts = [];

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

  if (locale === 'en') allPosts.push(...posts); // use 'en' as canonical for sitemap
}

// Sitemap (canonical English URLs)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${BASE_URL}/</loc></url>
  <url><loc>${BASE_URL}/about</loc></url>
${allPosts
  .map(
    p => `  <url>
    <loc>${BASE_URL}/posts/${p.slug}</loc>
    <lastmod>${p.date}</lastmod>
  </url>`,
  )
  .join('\n')}
</urlset>`;

writeFileSync('public/sitemap.xml', sitemap);
console.log('Generated sitemap.xml');

