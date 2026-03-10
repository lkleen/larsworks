import { ChangeDetectionStrategy, Component, input, computed, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { BlogPost } from '../../../core/models/blog-post.model';
import { LocaleService } from '../../../core/services/locale';

@Component({
  selector: 'app-post-card',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './post-card.html',
})
export class PostCardComponent {
  post = input.required<BlogPost>();

  private readonly localeService = inject(LocaleService);
  private readonly router = inject(Router);

  postLink = computed(() => [
    '/',
    this.localeService.currentLocaleFromUrl(this.router.url),
    'posts',
    this.post().slug,
  ]);
}
