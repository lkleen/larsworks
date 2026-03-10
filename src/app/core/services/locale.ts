import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_KEY,
  LOCALE_STORAGE_KEY,
  SupportedLocale,
  localeFromPathname,
  normalizeToSupportedLocale,
  pickLocaleFromAcceptLanguage,
} from '../models/locale.model';

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  currentLocaleFromUrl(url: string): SupportedLocale {
    return localeFromPathname(url) ?? DEFAULT_LOCALE;
  }

  fromLocaleId(localeId: string): SupportedLocale {
    return normalizeToSupportedLocale(localeId) ?? DEFAULT_LOCALE;
  }

  resolveInitialLocale(acceptLanguageHeader?: string | null): SupportedLocale {
    const savedLocale = this.getSavedLocale();
    if (savedLocale) return savedLocale;

    const fromHeader = pickLocaleFromAcceptLanguage(acceptLanguageHeader);
    if (fromHeader !== DEFAULT_LOCALE || !!acceptLanguageHeader) return fromHeader;

    return this.getBrowserLocale();
  }

  setSavedLocale(locale: SupportedLocale): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    this.document.cookie = `${LOCALE_COOKIE_KEY}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }

  clearSavedLocale(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    this.document.cookie = `${LOCALE_COOKIE_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
  }

  getSavedLocale(): SupportedLocale | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return normalizeToSupportedLocale(localStorage.getItem(LOCALE_STORAGE_KEY));
  }

  localizeUrl(url: string, locale: SupportedLocale): string {
    const [pathAndQuery, hash = ''] = url.split('#');
    const [path = '/', query = ''] = pathAndQuery.split('?');
    const segments = path.split('/').filter(Boolean);

    const firstSegment = segments[0];
    const hasLocaleLikePrefix = !!firstSegment && /^[a-z]{2}$/i.test(firstSegment);

    if (hasLocaleLikePrefix) {
      segments[0] = locale;
    } else {
      segments.unshift(locale);
    }

    const normalizedPath = `/${segments.join('/')}`;
    const normalizedQuery = query ? `?${query}` : '';
    const normalizedHash = hash ? `#${hash}` : '';

    return `${normalizedPath}${normalizedQuery}${normalizedHash}`;
  }

  private getBrowserLocale(): SupportedLocale {
    if (!isPlatformBrowser(this.platformId)) return DEFAULT_LOCALE;
    return (
      normalizeToSupportedLocale(this.document.defaultView?.navigator.language) ?? DEFAULT_LOCALE
    );
  }
}
