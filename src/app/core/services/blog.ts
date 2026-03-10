import { Injectable, inject, LOCALE_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, EMPTY, forkJoin, map, of } from 'rxjs';
import { BlogPost } from '../models/blog-post.model';
import { DEFAULT_LOCALE, SupportedLocale } from '../models/locale.model';
import { LocaleService } from './locale';

/** Strips the YAML frontmatter fence and returns only the markdown body. */
function stripFrontmatter(raw: string): string {
  return raw.replace(/^---[\s\S]*?---\r?\n?/, '');
}

@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly localeId = inject(LOCALE_ID);
  private readonly localeService = inject(LocaleService);

  getPosts(): Observable<BlogPost[]> {
    return this.getPostsForLocale(this.activeLocale());
  }

  getPostsForLocale(locale: SupportedLocale): Observable<BlogPost[]> {
    return this.http
      .get<BlogPost[]>(`/assets/blog/${locale}/index.json`)
      .pipe(catchError(() => of([])));
  }

  getPost(slug: string): Observable<BlogPost> {
    const locale = this.activeLocale();
    const meta$ = this.getPostsForLocale(locale).pipe(
      map((posts) => posts.find((p) => p.slug === slug)!),
    );

    const body$ = this.http.get(`/assets/blog/${locale}/${slug}.md`, { responseType: 'text' }).pipe(
      map(stripFrontmatter),
      catchError(() => {
        this.router.navigate(['/', locale, 'not-found']);
        return EMPTY;
      }),
    );

    return forkJoin({ meta: meta$, body: body$ }).pipe(
      map(({ meta, body }) => ({ ...meta, content: body })),
    );
  }

  private activeLocale(): SupportedLocale {
    const fromUrl = this.localeService.currentLocaleFromUrl(this.router.url);
    if (fromUrl) return fromUrl;
    return this.localeService.fromLocaleId(this.localeId) ?? DEFAULT_LOCALE;
  }
}
