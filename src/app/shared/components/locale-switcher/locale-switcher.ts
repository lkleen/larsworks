import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SelectButton } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { LocaleService } from '../../../core/services/locale';
import { SUPPORTED_LOCALES, SupportedLocale } from '../../../core/models/locale.model';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-locale-switcher',
  imports: [SelectButton, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './locale-switcher.html',
})
export class LocaleSwitcherComponent {
  private readonly router = inject(Router);
  private readonly localeService = inject(LocaleService);

  private readonly currentUrl = signal(this.router.url);

  readonly currentLocale = computed(() =>
    this.localeService.currentLocaleFromUrl(this.currentUrl()),
  );

  readonly localeOptions: { label: string; value: SupportedLocale }[] = SUPPORTED_LOCALES.map(
    (locale) => ({ label: locale.toUpperCase(), value: locale }),
  );

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => this.currentUrl.set(event.urlAfterRedirects));
  }

  switchLocale(locale: SupportedLocale): void {
    this.localeService.setSavedLocale(locale);
    const nextUrl = this.localeService.localizeUrl(this.currentUrl(), locale);
    void this.router.navigateByUrl(nextUrl).then(() => {
      this.currentUrl.set(this.router.url);
    });
  }
}
