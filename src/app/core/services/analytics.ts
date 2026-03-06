import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ConsentService } from './consent';

declare function gtag(...args: unknown[]): void;

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly consent = inject(ConsentService);

  updateConsent(granted: boolean): void {
    if (!environment.ga4MeasurementId) return; // no-op in dev
    gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
    });
  }

  event(name: string, params?: Record<string, unknown>): void {
    if (this.consent.consent() !== 'accepted') return;
    if (!environment.ga4MeasurementId) return; // no-op in dev
    gtag('event', name, params);
  }

  pageView(path: string): void {
    if (this.consent.consent() !== 'accepted') return;
    if (!environment.ga4MeasurementId) return; // no-op in dev
    gtag('event', 'page_view', { page_path: path });
  }
}
