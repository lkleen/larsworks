import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-cookie-banner',
  imports: [],
  templateUrl: './cookie-banner.html',
  styleUrl: './cookie-banner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookieBannerComponent {}
