import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  private readonly document = inject(DOCUMENT);

  darkMode = signal(false);

  menuItems = [
    { label: 'Blog', routerLink: '/' },
    { label: 'About', routerLink: '/about' },
  ];

  toggleTheme(): void {
    const isDark = !this.darkMode();
    this.darkMode.set(isDark);
    const element = this.document.documentElement;
    if (isDark) {
      element.classList.add('dark-mode');
    } else {
      element.classList.remove('dark-mode');
    }
  }
}
