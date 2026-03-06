import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogPost } from '../../../core/models/blog-post.model';

@Component({
  selector: 'app-post-card',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="post-card">
      <a [routerLink]="['/posts', post().slug]">
        <h2 class="post-card__title">{{ post().title }}</h2>
      </a>
      <div class="post-card__meta">
        <time [attr.datetime]="post().date">{{ post().date }}</time>
        <span>&middot;</span>
        <span>{{ post().readingTime }} min read</span>
      </div>
      <p class="post-card__excerpt">{{ post().excerpt }}</p>
      <ul class="post-card__tags" aria-label="Tags">
        @for (tag of post().tags; track tag) {
          <li class="post-card__tag">{{ tag }}</li>
        }
      </ul>
    </article>
  `,
  styleUrl: './post-card.scss',
})
export class PostCardComponent {
  post = input.required<BlogPost>();
}
