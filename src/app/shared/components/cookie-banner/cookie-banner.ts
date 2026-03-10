import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { ConsentService } from '../../../core/services/consent';
import { LocaleService } from '../../../core/services/locale';
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
  private readonly currentUrl = signal(this.router.url);

  protected readonly datenschutzLink = computed(() => [
    '/',
    this.localeService.currentLocaleFromUrl(this.currentUrl()),
    'datenschutz',
  ]);

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
