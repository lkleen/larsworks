import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { ConsentService } from '../../../core/services/consent';
import { LocaleService } from '../../../core/services/locale';
import { TranslationService } from '../../../core/services/translation';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.html',
})
export class FooterComponent {
  protected readonly consent = inject(ConsentService);
  protected readonly currentYear = new Date().getFullYear();

  private readonly router = inject(Router);
  private readonly localeService = inject(LocaleService);
  private readonly i18n = inject(TranslationService);
  private readonly currentUrl = signal(this.router.url);

  protected readonly currentLocale = computed(() =>
    this.localeService.currentLocaleFromUrl(this.currentUrl()),
  );
  protected readonly impressumLink = computed(() => ['/', this.currentLocale(), 'impressum']);
  protected readonly datenschutzLink = computed(() => ['/', this.currentLocale(), 'datenschutz']);

  protected readonly labelImpressum = this.i18n.t('footer.impressum');
  protected readonly labelDatenschutz = this.i18n.t('footer.privacy-policy');
  protected readonly labelCookiePreferences = this.i18n.t('footer.cookiePreferences');

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => this.currentUrl.set(event.urlAfterRedirects));
  }
}
