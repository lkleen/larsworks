import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { BlogListComponent } from './blog-list';

const mockActivatedRoute = {
  parent: {
    paramMap: of(convertToParamMap({ locale: 'en' })),
  },
};

describe('BlogListComponent', () => {
  let component: BlogListComponent;
  let fixture: ComponentFixture<BlogListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogListComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }, provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
