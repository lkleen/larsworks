import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpInterceptorFn } from '@angular/common/http';
import { of } from 'rxjs';

import { BlogPostComponent } from './blog-post';

// Mock interceptor to prevent real HTTP calls
const mockInterceptor: HttpInterceptorFn = () =>
  of(
    new (
      jest.requireActual('@angular/common/http') as typeof import('@angular/common/http')
    ).HttpResponse({ body: '' }),
  );

const mockActivatedRoute = {
  paramMap: of(convertToParamMap({ slug: 'test-slug' })),
  parent: {
    paramMap: of(convertToParamMap({ locale: 'en' })),
  },
};

describe('BlogPostComponent', () => {
  let component: BlogPostComponent;
  let fixture: ComponentFixture<BlogPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogPostComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        provideHttpClient(withInterceptors([mockInterceptor])),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogPostComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
