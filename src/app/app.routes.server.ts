import { RenderMode, ServerRoute } from '@angular/ssr';
import { inject } from '@angular/core';
import { BlogService } from './core/services/blog';
import { firstValueFrom, map } from 'rxjs';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'posts/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams() {
      return firstValueFrom(
        inject(BlogService)
          .getPosts()
          .pipe(map((posts) => posts.map((p) => ({ slug: p.slug })))),
      );
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
