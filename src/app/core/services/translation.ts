import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, shareReplay, switchMap } from 'rxjs';
import { DEFAULT_LOCALE, SupportedLocale } from '../models/locale.model';
import { LocaleService } from './locale';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly localeService = inject(LocaleService);

  private readonly currentUrl = signal(this.router.url);

  readonly currentLocale = computed<SupportedLocale>(
    () => this.localeService.currentLocaleFromUrl(this.currentUrl()) ?? DEFAULT_LOCALE,
  );

  private readonly translations = toSignal(
    toObservable(this.currentLocale).pipe(
      switchMap((locale) =>
        this.http.get<Record<string, string>>(`/assets/i18n/${locale}.json`).pipe(shareReplay(1)),
      ),
    ),
    { initialValue: {} as Record<string, string> },
  );

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.currentUrl.set(e.urlAfterRedirects));
  }

  t(key: string): Signal<string> {
    return computed(() => this.translations()[key] ?? key);
  }
}
