import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-blog-post',
  imports: [],
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogPostComponent {}
