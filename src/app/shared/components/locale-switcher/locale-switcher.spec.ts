import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { LocaleSwitcherComponent } from './locale-switcher';

describe('LocaleSwitcherComponent', () => {
  let component: LocaleSwitcherComponent;
  let fixture: ComponentFixture<LocaleSwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocaleSwitcherComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LocaleSwitcherComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to en locale', () => {
    expect(component.currentLocale()).toBe('en');
  });

  it('should expose EN and DE options', () => {
    expect(component.localeOptions.map((o) => o.value)).toEqual(['en', 'de']);
  });
});
