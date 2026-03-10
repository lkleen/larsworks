import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LocaleService } from './core/services/locale';
import { redirectToPreferredLocaleGuard, supportedLocaleGuard } from './app.routes';

describe('app locale route guards', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: {
            parseUrl: (value: string) => ({ redirectedTo: value }),
          },
        },
        {
          provide: LocaleService,
          useValue: {
            resolveInitialLocale: jest.fn().mockReturnValue('de'),
            localizeUrl: jest.fn((url: string, locale: string) => {
              const segments = url.split('/').filter(Boolean);
              if (segments[0] && /^[a-z]{2}$/i.test(segments[0])) {
                segments[0] = locale;
              } else {
                segments.unshift(locale);
              }
              return `/${segments.join('/')}`;
            }),
          },
        },
      ],
    });
  });

  it('redirects non-localized entries to the preferred locale', () => {
    const result = TestBed.runInInjectionContext(() =>
      redirectToPreferredLocaleGuard({} as never, { url: '/about' } as never),
    );

    expect(result).toEqual({ redirectedTo: '/de/about' });
  });

  it('allows supported locale route params', () => {
    const result = TestBed.runInInjectionContext(() =>
      supportedLocaleGuard(
        {
          paramMap: { get: () => 'de' },
        } as never,
        { url: '/de/about' } as never,
      ),
    );

    expect(result).toBe(true);
  });

  it('redirects unsupported locale params', () => {
    const result = TestBed.runInInjectionContext(() =>
      supportedLocaleGuard(
        {
          paramMap: { get: () => 'fr' },
        } as never,
        { url: '/fr/about' } as never,
      ),
    );

    expect(result).toEqual({ redirectedTo: '/de/about' });
  });
});
