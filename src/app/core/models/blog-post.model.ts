export interface BlogPost {
  slug: string;
  title: string;
  date: string; // ISO 8601: "2024-03-15"
  author: string;
  tags: string[];
  excerpt: string;
  coverImage?: string;
  lang: 'en' | 'de'; // drives BlogService locale path
  readingTime: number; // minutes (computed by generate-index.mjs)
  content?: string; // Markdown body (loaded on-demand in blog-post route)
}
