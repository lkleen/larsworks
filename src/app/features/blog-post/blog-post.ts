import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';
import { BlogService } from '../../core/services/blog';
import { SeoService } from '../../core/services/seo';
import { SocialShareComponent } from '../../shared/components/social-share/social-share';
import { BlogPost } from '../../core/models/blog-post.model';
import { combineLatest, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-blog-post',
  imports: [MarkdownComponent, SocialShareComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './blog-post.html',
})
export class BlogPostComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly blogService = inject(BlogService);
  private readonly seoService = inject(SeoService);

  post = signal<BlogPost | null>(null);
  markdownContent = signal<string | null>(null);

  content$ = combineLatest([this.route.paramMap, this.route.parent!.paramMap]).pipe(
    switchMap(([params]) => {
      const slug = params.get('slug')!;
      return this.blogService.getPost(slug).pipe(
        tap((post) => {
          this.post.set(post);
          this.markdownContent.set(post.content ?? null);
          this.seoService.setPostMeta(post);
        }),
      );
    }),
  );

  constructor() {
    this.content$.subscribe();
  }
}
