export type SupportedLocale = 'en' | 'de';

export const SUPPORTED_LOCALES: readonly SupportedLocale[] = ['en', 'de'];
export const DEFAULT_LOCALE: SupportedLocale = 'en';
export const LOCALE_STORAGE_KEY = 'preferred_locale';
export const LOCALE_COOKIE_KEY = 'preferred_locale';

export function isSupportedLocale(value: string): value is SupportedLocale {
  return SUPPORTED_LOCALES.includes(value as SupportedLocale);
}

export function normalizeToSupportedLocale(
  value: string | null | undefined,
): SupportedLocale | null {
  if (!value) return null;
  const normalized = value.toLowerCase().split('-')[0];
  return isSupportedLocale(normalized) ? normalized : null;
}

export function localeFromPathname(pathname: string): SupportedLocale | null {
  const firstSegment = pathname
    .split('?')[0]
    .split('#')[0]
    .split('/')
    .find((segment) => segment.length > 0);
  return normalizeToSupportedLocale(firstSegment);
}

export function pickLocaleFromAcceptLanguage(
  acceptLanguageHeader: string | null | undefined,
): SupportedLocale {
  if (!acceptLanguageHeader) return DEFAULT_LOCALE;

  for (const part of acceptLanguageHeader.split(',')) {
    const candidate = normalizeToSupportedLocale(part.trim().split(';')[0]);
    if (candidate) return candidate;
  }

  return DEFAULT_LOCALE;
}
