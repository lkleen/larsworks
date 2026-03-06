import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';

import { SocialShareComponent } from './social-share';
import { BlogPost } from '../../../core/models/blog-post.model';

describe('SocialShareComponent', () => {
  let component: SocialShareComponent;
  let componentRef: ComponentRef<SocialShareComponent>;
  let fixture: ComponentFixture<SocialShareComponent>;

  const mockPost: BlogPost = {
    slug: 'test-post',
    title: 'Test Post',
    date: '2026-03-06',
    author: 'Test Author',
    tags: ['test'],
    excerpt: 'A test post excerpt',
    lang: 'en',
    readingTime: 3,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialShareComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialShareComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('post', mockPost);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
