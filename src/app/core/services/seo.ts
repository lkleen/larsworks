import { Injectable, inject, LOCALE_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { BlogPost } from '../models/blog-post.model';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly locale = inject(LOCALE_ID);

  setPostMeta(post: BlogPost): void {
    const url = `${environment.blogBaseUrl}/posts/${post.slug}`;

    this.title.setTitle(`${post.title} | Lars Kleen`);

    this.meta.updateTag({ name: 'description', content: post.excerpt });

    // Open Graph (LinkedIn, Facebook, Slack)
    this.meta.updateTag({ property: 'og:title', content: post.title });
    this.meta.updateTag({ property: 'og:description', content: post.excerpt });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: post.coverImage ?? '' });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'article:published_time', content: post.date });
    this.meta.updateTag({ property: 'article:tag', content: post.tags.join(',') });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: post.title });
    this.meta.updateTag({ name: 'twitter:description', content: post.excerpt });
    this.meta.updateTag({ name: 'twitter:image', content: post.coverImage ?? '' });
  }
}
