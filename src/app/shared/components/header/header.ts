import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Menubar } from 'primeng/menubar';
import { Button } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [Menubar, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-menubar [model]="menuItems">
      <ng-template #start>
        <span
          class="font-bold text-xl cursor-pointer"
          (click)="navigateHome()"
          (keydown.enter)="navigateHome()"
          tabindex="0"
          role="link"
        >
          larsworks
        </span>
      </ng-template>
      <ng-template #end>
        <p-button
          [icon]="darkMode() ? 'pi pi-sun' : 'pi pi-moon'"
          [rounded]="true"
          [text]="true"
          (onClick)="toggleTheme()"
          [attr.aria-label]="darkMode() ? 'Switch to light mode' : 'Switch to dark mode'"
        />
      </ng-template>
    </p-menubar>
  `,
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);

  darkMode = signal(false);

  menuItems: MenuItem[] = [
    { label: 'Blog', icon: 'pi pi-home', command: () => this.router.navigate(['/']) },
    { label: 'About', icon: 'pi pi-user', command: () => this.router.navigate(['/about']) },
  ];

  navigateHome(): void {
    this.router.navigate(['/']);
  }

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
