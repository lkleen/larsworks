import { TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { BlogService } from './blog';

describe('BlogService', () => {
  let service: BlogService;
  let httpMock: HttpTestingController;
  let routerNavigateSpy: jest.SpyInstance;

  beforeEach(() => {
    const router = {
      url: '/de/posts/test-slug',
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: router },
        { provide: LOCALE_ID, useValue: 'en-US' },
      ],
    });
    service = TestBed.inject(BlogService);
    httpMock = TestBed.inject(HttpTestingController);
    routerNavigateSpy = jest.spyOn(TestBed.inject(Router), 'navigate');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads posts from the locale path derived from the route', () => {
    service.getPosts().subscribe();

    const request = httpMock.expectOne('/assets/blog/de/index.json');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('navigates to locale-prefixed not-found when post markdown is missing', () => {
    service.getPost('missing-post').subscribe();

    httpMock.expectOne('/assets/blog/de/index.json').flush([
      {
        slug: 'missing-post',
        title: 'Missing',
        date: '2026-01-01',
        author: 'Lars',
        tags: [],
        excerpt: 'x',
        lang: 'de',
        readingTime: 1,
      },
    ]);

    httpMock
      .expectOne('/assets/blog/de/missing-post.md')
      .flush('', { status: 404, statusText: 'Not Found' });

    expect(routerNavigateSpy).toHaveBeenCalledWith(['/', 'de', 'not-found']);
  });
});
