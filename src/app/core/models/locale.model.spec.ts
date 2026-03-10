import {
  DEFAULT_LOCALE,
  localeFromPathname,
  normalizeToSupportedLocale,
  pickLocaleFromAcceptLanguage,
} from './locale.model';

describe('locale model helpers', () => {
  it('normalizes locale strings to supported locales', () => {
    expect(normalizeToSupportedLocale('de-DE')).toBe('de');
    expect(normalizeToSupportedLocale('EN')).toBe('en');
    expect(normalizeToSupportedLocale('fr-FR')).toBeNull();
  });

  it('reads locale from pathname prefixes', () => {
    expect(localeFromPathname('/de/posts/test')).toBe('de');
    expect(localeFromPathname('/en')).toBe('en');
    expect(localeFromPathname('/about')).toBeNull();
  });

  it('chooses locale from accept-language list with fallback', () => {
    expect(pickLocaleFromAcceptLanguage('de-DE,de;q=0.9,en;q=0.8')).toBe('de');
    expect(pickLocaleFromAcceptLanguage('fr-FR,es;q=0.9')).toBe(DEFAULT_LOCALE);
  });
});
