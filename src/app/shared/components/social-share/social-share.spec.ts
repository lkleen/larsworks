import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialShareComponent } from './social-share';

describe('SocialShare', () => {
  let component: SocialShareComponent;
  let fixture: ComponentFixture<SocialShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialShareComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialShareComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
