import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-blog-list',
  imports: [],
  templateUrl: './blog-list.html',
  styleUrl: './blog-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogListComponent {}
