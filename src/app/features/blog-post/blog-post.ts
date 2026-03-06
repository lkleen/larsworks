import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';
import { BlogService } from '../../core/services/blog';
import { SeoService } from '../../core/services/seo';
import { SocialShareComponent } from '../../shared/components/social-share/social-share';
import { BlogPost } from '../../core/models/blog-post.model';
import { switchMap, tap } from 'rxjs';
import matter from 'gray-matter';

@Component({
  selector: 'app-blog-post',
  imports: [MarkdownComponent, SocialShareComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (post(); as post) {
      <article class="container page-content">
        <header>
          <h1>{{ post.title }}</h1>
          <div class="post-meta">
            <time [attr.datetime]="post.date">{{ post.date }}</time>
            <span>&middot;</span>
            <span>{{ post.readingTime }} min read</span>
          </div>
        </header>
        @if (markdownContent(); as content) {
          <markdown [data]="content" />
        }
        <app-social-share [post]="post" />
      </article>
    }
  `,
})
export class BlogPostComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly blogService = inject(BlogService);
  private readonly seoService = inject(SeoService);

  post = signal<BlogPost | null>(null);
  markdownContent = signal<string | null>(null);

  content$ = this.route.paramMap.pipe(
    switchMap((params) => {
      const slug = params.get('slug')!;
      return this.blogService.getPost(slug).pipe(
        tap((raw) => {
          const { data, content } = matter(raw);
          const wordCount = raw.split(/\s+/).length;
          const post: BlogPost = {
            ...(data as Omit<BlogPost, 'readingTime'>),
            readingTime: Math.ceil(wordCount / 200),
            content,
          };
          this.post.set(post);
          this.markdownContent.set(content);
          this.seoService.setPostMeta(post);
        }),
      );
    }),
  );

  constructor() {
    // Subscribe to trigger the pipeline
    this.content$.subscribe();
  }
}
