import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';
import { provideMarkdown } from 'ngx-markdown';

const AppPreset = definePreset(Aura, {
  semantic: {
    // Link tokens — consumed by styles.scss; respects dark mode via colorScheme
    link: {
      color: '{text.muted.color}',
      hoverColor: '{text.color}',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),
    provideMarkdown(),
    providePrimeNG({
      theme: {
        preset: AppPreset,
        options: {
          darkModeSelector: '.dark-mode',
        },
      },
    }),
  ],
};
