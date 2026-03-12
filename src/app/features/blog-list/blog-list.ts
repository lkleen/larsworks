import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../core/services/blog';
import { PostCardComponent } from '../../shared/components/post-card/post-card';
import { TranslationService } from '../../core/services/translation';
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
  private readonly i18n = inject(TranslationService);

  protected readonly title = this.i18n.t('home.title');

  posts$ = this.route.parent!.paramMap.pipe(switchMap(() => this.blogService.getPosts()));
}
