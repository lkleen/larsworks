import { Injectable, Injector, inject, signal } from '@angular/core';
import { ConsentChoice, CONSENT_STORAGE_KEY } from '../models/consent.model';
import type { AnalyticsService } from './analytics';

@Injectable({ providedIn: 'root' })
export class ConsentService {
  private readonly injector = inject(Injector);

  readonly consent = signal<ConsentChoice>(this.loadFromStorage());

  accept(): void {
    this.consent.set('accepted');
    localStorage.setItem(CONSENT_STORAGE_KEY, 'accepted');
    this.getAnalytics().updateConsent(true);
  }

  decline(): void {
    this.consent.set('declined');
    localStorage.setItem(CONSENT_STORAGE_KEY, 'declined');
    this.getAnalytics().updateConsent(false);
  }

  revoke(): void {
    this.consent.set(null);
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    this.getAnalytics().updateConsent(false);
  }

  get isPending(): boolean {
    return this.consent() === null;
  }

  // Lazy inject to avoid circular dependency with AnalyticsService
  private getAnalytics(): AnalyticsService {
    // Import the token lazily at runtime to break the circular reference.
    // The type-only import above is erased at compile time, so no cycle exists.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { AnalyticsService: Token } = require('./analytics');
    return this.injector.get(Token);
  }

  private loadFromStorage(): ConsentChoice {
    if (typeof localStorage === 'undefined') return null; // SSR guard
    return (localStorage.getItem(CONSENT_STORAGE_KEY) as ConsentChoice) ?? null;
  }
}
