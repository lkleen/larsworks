import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { ConsentService } from '../../../core/services/consent';

@Component({
  selector: 'app-cookie-banner',
  imports: [RouterLink, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cookie-banner.html',
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
