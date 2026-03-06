import '@angular/localize/init';
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

// Mock gtag globally — GA4 is not available in test environment
(globalThis as Record<string, unknown>)['gtag'] = jest.fn();

setupZoneTestEnv({
  teardown: { destroyAfterEach: true },
});
