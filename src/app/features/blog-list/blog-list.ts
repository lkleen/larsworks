import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../core/services/blog';
import { PostCardComponent } from '../../shared/components/post-card/post-card';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-blog-list',
  imports: [AsyncPipe, PostCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './blog-list.html',
})
export class BlogListComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly blogService = inject(BlogService);

  posts$ = this.route.parent!.paramMap.pipe(switchMap(() => this.blogService.getPosts()));
}
