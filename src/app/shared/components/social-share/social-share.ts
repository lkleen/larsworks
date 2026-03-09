import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BlogPost } from '../../../core/models/blog-post.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-social-share',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './social-share.html',
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
