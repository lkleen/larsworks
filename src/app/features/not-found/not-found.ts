import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { LocaleService } from '../../core/services/locale';
import { TranslationService } from '../../core/services/translation';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './not-found.html',
})
export class NotFoundComponent {
  private readonly router = inject(Router);
  private readonly localeService = inject(LocaleService);
  private readonly i18n = inject(TranslationService);
  private readonly currentUrl = signal(this.router.url);

  protected readonly homeLink = computed(() => [
    '/',
    this.localeService.currentLocaleFromUrl(this.currentUrl()),
  ]);

  protected readonly title = this.i18n.t('notFound.title');
  protected readonly message = this.i18n.t('notFound.message');
  protected readonly backHome = this.i18n.t('notFound.backHome');

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => this.currentUrl.set(event.urlAfterRedirects));
  }
}
