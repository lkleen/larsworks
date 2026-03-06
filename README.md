# larsworks

Personal website for Lars Kleen — software development blog, built with Angular 17+, SSR, and Markdown. Future sections: portfolio, contact, booking.

**Live:** https://larsworks.de

---

## Prerequisites

- [nvm](https://github.com/nvm-sh/nvm) (recommended)
- Node.js (version pinned in `.nvmrc`)

## Setup

```bash
nvm use
npm install
```

## Development

```bash
npm start         # generate post index + start SSR dev server at localhost:4200
```

After adding or editing a Markdown post in `src/assets/blog/en/`, re-run `npm start`
to regenerate `index.json`.

## Scripts

| Command              | Description                            |
| -------------------- | -------------------------------------- |
| `npm start`          | Generate index + start dev server      |
| `npm run build`      | Production build (also runs index gen) |
| `npm test`           | Run Jest unit tests                    |
| `npm run test:watch` | Jest in watch mode                     |
| `npm run lint`       | ESLint                                 |
| `npm run format`     | Prettier (writes in place)             |

## Deployment

Push to `main` — Vercel deploys automatically to https://larsworks.de.

## Adding a blog post

1. Create `src/assets/blog/en/my-post-slug.md`
2. Add YAML frontmatter (see architecture doc for required fields)
3. Run `npm start` to pick up the new post locally
4. Push to `main` to publish

## Adding German (i18n)

See the architecture blueprint for the full checklist.

## Before going live

- [ ] Fill `src/app/features/impressum/` with real Impressum content
- [ ] Fill `src/app/features/datenschutz/` with generated Datenschutzerklärung (use erecht24.de)
- [ ] Accept Vercel DPA: Vercel Dashboard → Settings → Legal
- [ ] Verify cookie consent banner works correctly
