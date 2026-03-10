import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SeoService } from './seo';

describe('SeoService', () => {
  let service: SeoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
    service = TestBed.inject(SeoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
