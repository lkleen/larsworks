import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogPost } from '../../../core/models/blog-post.model';

@Component({
  selector: 'app-post-card',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './post-card.html',
})
export class PostCardComponent {
  post = input.required<BlogPost>();
}
