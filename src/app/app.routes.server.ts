import { RenderMode, ServerRoute } from '@angular/ssr';
import { inject } from '@angular/core';
import { BlogService } from './core/services/blog';
import { firstValueFrom, map } from 'rxjs';
import { SUPPORTED_LOCALES } from './core/models/locale.model';
import type { Observable } from 'rxjs';

interface LocalizedPostLoader {
  getPostsForLocale: (locale: (typeof SUPPORTED_LOCALES)[number]) => Observable<{ slug: string }[]>;
}

const localeParams = SUPPORTED_LOCALES.map((locale) => ({ locale }));

export const serverRoutes: ServerRoute[] = [
  {
    path: ':locale',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return localeParams;
    },
  },
  {
    path: ':locale/about',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return localeParams;
    },
  },
  {
    path: ':locale/impressum',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return localeParams;
    },
  },
  {
    path: ':locale/datenschutz',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return localeParams;
    },
  },
  {
    path: ':locale/not-found',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return localeParams;
    },
  },
  {
    path: ':locale/posts/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const blogService = inject(BlogService) as unknown as LocalizedPostLoader;
      const localizedPostParams = await Promise.all(
        SUPPORTED_LOCALES.map((locale) =>
          firstValueFrom(
            blogService
              .getPostsForLocale(locale)
              .pipe(
                map((posts: { slug: string }[]) =>
                  posts.map((post: { slug: string }) => ({ locale, slug: post.slug })),
                ),
              ),
          ),
        ),
      );

      return localizedPostParams.flat();
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
