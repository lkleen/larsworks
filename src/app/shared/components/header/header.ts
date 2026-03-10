import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { DOCUMENT } from '@angular/common';
import { LocaleService } from '../../../core/services/locale';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LocaleSwitcherComponent } from '../locale-switcher/locale-switcher';
import { TranslationService } from '../../../core/services/translation';

@Component({
  selector: 'app-header',
  imports: [RouterLink, Button, Menubar, LocaleSwitcherComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly localeService = inject(LocaleService);
  private readonly i18n = inject(TranslationService);

  darkMode = signal(false);
  private readonly currentUrl = signal(this.router.url);

  private readonly currentLocale = computed(() =>
    this.localeService.currentLocaleFromUrl(this.currentUrl()),
  );

  readonly homeLink = computed(() => ['/', this.currentLocale()]);

  readonly menuItems = computed<MenuItem[]>(() => [
    { label: this.i18n.t('header.blog')(), routerLink: ['/', this.currentLocale()] },
    { label: this.i18n.t('header.about')(), routerLink: ['/', this.currentLocale(), 'about'] },
  ]);

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
}
