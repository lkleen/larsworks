import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConsentService } from '../../../core/services/consent';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="site-footer">
      <nav class="container" aria-label="Legal">
        <a routerLink="/impressum" i18n="@@footer.impressum">Impressum</a>
        <a routerLink="/datenschutz" i18n="@@footer.datenschutz">Datenschutz</a>
        <a
          (click)="consent.revoke()"
          (keydown.enter)="consent.revoke()"
          role="button"
          tabindex="0"
          i18n="@@footer.cookiePreferences"
          >Cookie-Einstellungen</a
        >
      </nav>
    </footer>
  `,
})
export class FooterComponent {
  protected consent = inject(ConsentService);
}
