import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConsentService } from '../../../core/services/consent';

@Component({
  selector: 'app-cookie-banner',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (consent.isPending) {
      <div class="cookie-banner" role="dialog" aria-label="Cookie consent">
        <p i18n="@@cookie.message">
          This site uses Google Analytics to understand how readers find and use content. No data is
          collected without your consent.
          <a routerLink="/datenschutz">Datenschutzerklärung</a>
        </p>
        <div class="cookie-banner__actions">
          <button class="btn btn--secondary" (click)="decline()" i18n="@@cookie.decline">
            Decline
          </button>
          <button class="btn btn--primary" (click)="accept()" i18n="@@cookie.accept">
            Accept analytics
          </button>
        </div>
      </div>
    }
  `,
})
export class CookieBannerComponent {
  protected consent = inject(ConsentService);

  accept(): void {
    this.consent.accept();
  }

  decline(): void {
    this.consent.decline();
  }
}
