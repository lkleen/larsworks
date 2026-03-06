import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BlogService } from '../../core/services/blog';
import { PostCardComponent } from '../../shared/components/post-card/post-card';

@Component({
  selector: 'app-blog-list',
  imports: [AsyncPipe, PostCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="container page-content">
      <h1 i18n="@@home.title">Latest Posts</h1>
      @if (posts$ | async; as posts) {
        @for (post of posts; track post.slug) {
          <app-post-card [post]="post" />
        }
      }
    </main>
  `,
})
export class BlogListComponent {
  private readonly blogService = inject(BlogService);
  posts$ = this.blogService.getPosts();
}
