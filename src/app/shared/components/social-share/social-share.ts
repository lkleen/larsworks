import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BlogPost } from '../../../core/models/blog-post.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-social-share',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="social-share" aria-label="Share this post">
      <a [href]="linkedinUrl()" target="_blank" rel="noopener" i18n="@@social.linkedin"
        >Share on LinkedIn</a
      >
      <a [href]="twitterUrl()" target="_blank" rel="noopener" i18n="@@social.twitter">Share on X</a>
    </div>
  `,
})
export class SocialShareComponent {
  post = input.required<BlogPost>();

  linkedinUrl = computed(() => {
    const url = encodeURIComponent(`${environment.blogBaseUrl}/posts/${this.post().slug}`);
    return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  });

  twitterUrl = computed(() => {
    const text = encodeURIComponent(this.post().title);
    const url = encodeURIComponent(`${environment.blogBaseUrl}/posts/${this.post().slug}`);
    return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  });
}
