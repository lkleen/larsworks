import { Injectable, inject, LOCALE_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, EMPTY } from 'rxjs';
import { BlogPost } from '../models/blog-post.model';

@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly lang = inject(LOCALE_ID).split('-')[0]; // en-US → en

  getPosts(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`/assets/blog/${this.lang}/index.json`);
  }

  getPost(slug: string): Observable<string> {
    return this.http.get(`/assets/blog/${this.lang}/${slug}.md`, { responseType: 'text' }).pipe(
      catchError(() => {
        this.router.navigate(['/not-found']);
        return EMPTY;
      }),
    );
  }
}
