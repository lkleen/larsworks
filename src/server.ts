import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_KEY,
  normalizeToSupportedLocale,
  pickLocaleFromAcceptLanguage,
} from './app/core/models/locale.model';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

function localeFromCookie(header: string | undefined): string | null {
  if (!header) return null;
  const match = header
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${LOCALE_COOKIE_KEY}=`));
  if (!match) return null;
  return normalizeToSupportedLocale(match.split('=')[1]);
}

function localeFromRequest(req: express.Request): string {
  const fromCookie = localeFromCookie(req.headers.cookie);
  if (fromCookie) return fromCookie;
  return pickLocaleFromAcceptLanguage(req.headers['accept-language']) ?? DEFAULT_LOCALE;
}

function hasLocalePrefix(pathname: string): boolean {
  return /^\/(en|de)(\/|$)/.test(pathname);
}

// Redirect non-localized URLs before static/angular handlers so the first hit lands on /en or /de.
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    next();
    return;
  }

  if (hasLocalePrefix(req.path) || req.path.startsWith('/assets/') || req.path.includes('.')) {
    next();
    return;
  }

  const locale = localeFromRequest(req);
  const redirectedPath = req.path === '/' ? `/${locale}` : `/${locale}${req.path}`;
  const location = `${redirectedPath}${req.url.slice(req.path.length)}`;

  res.redirect(302, location);
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
