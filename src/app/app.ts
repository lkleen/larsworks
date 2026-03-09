import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from './shared/components/header/header';
import { FooterComponent } from './shared/components/footer/footer';
import { CookieBannerComponent } from './shared/components/cookie-banner/cookie-banner';
import { AnalyticsService } from './core/services/analytics';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CookieBannerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex flex-column">
      <app-header />
      <main class="flex-1 p-4">
        <div class="max-w-screen-lg mx-auto">
          <router-outlet />
        </div>
      </main>
      <app-footer />
      <app-cookie-banner />
    </div>
  `,
})
export class App {
  private readonly router = inject(Router);
  private readonly analytics = inject(AnalyticsService);

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.analytics.pageView(e.urlAfterRedirects));
  }
}
