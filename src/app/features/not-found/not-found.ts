import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="container page-content">
      <h1 i18n="@@notFound.title">Page not found</h1>
      <p i18n="@@notFound.message">The page you're looking for doesn't exist.</p>
      <a routerLink="/" i18n="@@notFound.backHome">← Back to home</a>
    </main>
  `,
})
export class NotFoundComponent {}
