import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { ConsentService } from '../../../core/services/consent';
import { LocaleService } from '../../../core/services/locale';
import { TranslationService } from '../../../core/services/translation';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-cookie-banner',
  imports: [RouterLink, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cookie-banner.html',
})
export class CookieBannerComponent {
  protected consent = inject(ConsentService);

  private readonly router = inject(Router);
  private readonly localeService = inject(LocaleService);
  private readonly i18n = inject(TranslationService);
  private readonly currentUrl = signal(this.router.url);

  protected readonly privacyPolicyLink = computed(() => [
    '/',
    this.localeService.currentLocaleFromUrl(this.currentUrl()),
    'privacy-policy',
  ]);

  protected readonly cookieMessage = this.i18n.t('cookie.message');
  protected readonly cookiePrivacyPolicy = this.i18n.t('cookie.privacyPolicy');
  protected readonly cookieDecline = this.i18n.t('cookie.decline');
  protected readonly cookieAccept = this.i18n.t('cookie.accept');

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => this.currentUrl.set(event.urlAfterRedirects));
  }

  accept(): void {
    this.consent.accept();
  }

  decline(): void {
    this.consent.decline();
  }
}
