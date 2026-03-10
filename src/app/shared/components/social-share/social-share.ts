import { ChangeDetectionStrategy, Component, computed, input, inject } from '@angular/core';
import { BlogPost } from '../../../core/models/blog-post.model';
import { environment } from '../../../../environments/environment';
import { LocaleService } from '../../../core/services/locale';
import { Router } from '@angular/router';

@Component({
  selector: 'app-social-share',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './social-share.html',
})
export class SocialShareComponent {
  post = input.required<BlogPost>();

  private readonly localeService = inject(LocaleService);
  private readonly router = inject(Router);

  private readonly postUrl = computed(() => {
    const locale = this.localeService.currentLocaleFromUrl(this.router.url);
    return `${environment.blogBaseUrl}/${locale}/posts/${this.post().slug}`;
  });

  linkedinUrl = computed(() => {
    const url = encodeURIComponent(this.postUrl());
    return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  });

  twitterUrl = computed(() => {
    const text = encodeURIComponent(this.post().title);
    const url = encodeURIComponent(this.postUrl());
    return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  });
}
