import { Routes } from '@angular/router';

export const routes: Routes = [
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
    path: 'impressum',
    loadComponent: () => import('./features/impressum/impressum').then((m) => m.ImpressumComponent),
  },
  {
    path: 'datenschutz',
    loadComponent: () =>
      import('./features/datenschutz/datenschutz').then((m) => m.DatenschutzComponent),
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFoundComponent),
  },
];
