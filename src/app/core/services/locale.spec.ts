import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { LocaleService } from './locale';
import { LOCALE_STORAGE_KEY } from '../models/locale.model';

describe('LocaleService', () => {
  let service: LocaleService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [LocaleService],
    });
    service = TestBed.inject(LocaleService);
  });

  it('resolves initial locale from browser when no preference exists', () => {
    const document = TestBed.inject(DOCUMENT);
    Object.defineProperty(document.defaultView?.navigator, 'language', {
      value: 'de-DE',
      configurable: true,
    });

    expect(service.resolveInitialLocale()).toBe('de');
  });

  it('prefers saved locale over browser locale', () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'en');
    const document = TestBed.inject(DOCUMENT);
    Object.defineProperty(document.defaultView?.navigator, 'language', {
      value: 'de-DE',
      configurable: true,
    });

    expect(service.resolveInitialLocale()).toBe('en');
  });

  it('persists and clears user locale preference', () => {
    service.setSavedLocale('de');
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('de');

    service.clearSavedLocale();
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBeNull();
  });

  it('localizes URLs by replacing existing locale prefixes', () => {
    expect(service.localizeUrl('/en/posts/test?x=1#y', 'de')).toBe('/de/posts/test?x=1#y');
    expect(service.localizeUrl('/about', 'de')).toBe('/de/about');
  });
});
