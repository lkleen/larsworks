import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PostCardComponent } from './post-card';
import { BlogPost } from '../../../core/models/blog-post.model';
import { ComponentRef } from '@angular/core';

describe('PostCardComponent', () => {
  let component: PostCardComponent;
  let componentRef: ComponentRef<PostCardComponent>;
  let fixture: ComponentFixture<PostCardComponent>;

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
      imports: [PostCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PostCardComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('post', mockPost);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
