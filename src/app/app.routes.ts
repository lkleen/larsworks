import { CanActivateFn, Router, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { LocaleService } from './core/services/locale';
import { isSupportedLocale } from './core/models/locale.model';

export const redirectToPreferredLocaleGuard: CanActivateFn = (_, state) => {
  const router = inject(Router);
  const localeService = inject(LocaleService);
  const locale = localeService.resolveInitialLocale();
  return router.parseUrl(localeService.localizeUrl(state.url, locale));
};

export const supportedLocaleGuard: CanActivateFn = (route, state) => {
  const locale = route.paramMap.get('locale');
  if (locale && isSupportedLocale(locale)) {
    return true;
  }

  const router = inject(Router);
  const localeService = inject(LocaleService);
  const preferredLocale = localeService.resolveInitialLocale();
  return router.parseUrl(localeService.localizeUrl(state.url, preferredLocale));
};

const localizedRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/blog-list/blog-list').then((m) => m.BlogListComponent),
  },
  {
    path: 'posts/:slug',
    loadComponent: () => import('./features/blog-post/blog-post').then((m) => m.BlogPostComponent),
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about').then((m) => m.AboutComponent),
  },
  {
    path: 'imprint',
    loadComponent: () => import('./features/imprint/imprint').then((m) => m.ImprintComponent),
  },
  {
    path: 'privacy-policy',
    loadComponent: () =>
      import('./features/privacy-policy/privacy-policy').then((m) => m.PrivacyPolicyComponent),
  },
  {
    path: 'not-found',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFoundComponent),
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [redirectToPreferredLocaleGuard],
    loadComponent: () =>
      import('./shared/components/locale-redirect/locale-redirect').then(
        (m) => m.LocaleRedirectComponent,
      ),
  },
  {
    path: ':locale',
    canActivate: [supportedLocaleGuard],
    children: localizedRoutes,
  },
  {
    path: '**',
    canActivate: [redirectToPreferredLocaleGuard],
    loadComponent: () =>
      import('./shared/components/locale-redirect/locale-redirect').then(
        (m) => m.LocaleRedirectComponent,
      ),
  },
];
