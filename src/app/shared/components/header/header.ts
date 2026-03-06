import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="site-header">
      <nav class="container" aria-label="Main navigation">
        <a routerLink="/" class="site-header__logo" i18n="@@header.logo">larsworks</a>
        <ul class="site-header__nav">
          <li>
            <a
              routerLink="/"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
              i18n="@@header.blog"
              >Blog</a
            >
          </li>
          <li><a routerLink="/about" routerLinkActive="active" i18n="@@header.about">About</a></li>
        </ul>
      </nav>
    </header>
  `,
})
export class HeaderComponent {}
