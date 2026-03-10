import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { DOCUMENT } from '@angular/common';
import { LocaleService } from '../../../core/services/locale';
import { SupportedLocale } from '../../../core/models/locale.model';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  imports: [RouterLink, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly localeService = inject(LocaleService);

  darkMode = signal(false);
  private readonly currentUrl = signal(this.router.url);

  readonly currentLocale = computed(() =>
    this.localeService.currentLocaleFromUrl(this.currentUrl()),
  );
  readonly homeLink = computed(() => ['/', this.currentLocale()]);
  readonly blogLink = computed(() => ['/', this.currentLocale()]);
  readonly aboutLink = computed(() => ['/', this.currentLocale(), 'about']);

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => this.currentUrl.set(event.urlAfterRedirects));
  }

  toggleTheme(): void {
    const isDark = !this.darkMode();
    this.darkMode.set(isDark);
    const element = this.document.documentElement;
    if (isDark) {
      element.classList.add('dark-mode');
    } else {
      element.classList.remove('dark-mode');
    }
  }

  switchLocale(locale: SupportedLocale): void {
    this.localeService.setSavedLocale(locale);
    const nextUrl = this.localeService.localizeUrl(this.currentUrl(), locale);
    // Force navigation and immediately update currentUrl so computed locale updates
    void this.router.navigateByUrl(nextUrl).then(() => {
      this.currentUrl.set(this.router.url);
    });
  }

  resetLocalePreference(): void {
    this.localeService.clearSavedLocale();
    const resolvedLocale = this.localeService.resolveInitialLocale();
    const nextUrl = this.localeService.localizeUrl(this.currentUrl(), resolvedLocale);
    // Force navigation and immediately update currentUrl so computed locale updates
    void this.router.navigateByUrl(nextUrl).then(() => {
      this.currentUrl.set(this.router.url);
    });
  }
}
