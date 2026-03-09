import { Injectable, inject, LOCALE_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, EMPTY, forkJoin, map } from 'rxjs';
import { BlogPost } from '../models/blog-post.model';

/** Strips the YAML frontmatter fence and returns only the markdown body. */
function stripFrontmatter(raw: string): string {
  return raw.replace(/^---[\s\S]*?---\r?\n?/, '');
}

@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly lang = inject(LOCALE_ID).split('-')[0];

  getPosts(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`/assets/blog/${this.lang}/index.json`);
  }

  getPost(slug: string): Observable<BlogPost> {
    const meta$ = this.http
      .get<BlogPost[]>(`/assets/blog/${this.lang}/index.json`)
      .pipe(map((posts) => posts.find((p) => p.slug === slug)!));

    const body$ = this.http
      .get(`/assets/blog/${this.lang}/${slug}.md`, { responseType: 'text' })
      .pipe(
        map(stripFrontmatter),
        catchError(() => {
          this.router.navigate(['/not-found']);
          return EMPTY;
        }),
      );

    return forkJoin({ meta: meta$, body: body$ }).pipe(
      map(({ meta, body }) => ({ ...meta, content: body })),
    );
  }
}
