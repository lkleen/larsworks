import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BlogService } from '../../core/services/blog';
import { PostCardComponent } from '../../shared/components/post-card/post-card';

@Component({
  selector: 'app-blog-list',
  imports: [AsyncPipe, PostCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './blog-list.html',
})
export class BlogListComponent {
  private readonly blogService = inject(BlogService);
  posts$ = this.blogService.getPosts();
}
