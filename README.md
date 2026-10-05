# Kenneth Assogba

A personal site about software engineering, AI-assisted development and small
experiments. React + Vite build complete static HTML; shadcn/ui supplies the
interactive controls. Markdown remains the source of the writing.

Production URL: [kennethassogba.github.io](https://kennethassogba.github.io/).

## Run locally

Use Node.js 24 or newer.

```sh
npm ci
npm run dev
```

Open `http://localhost:4173`. This builds once, then serves the result. After an
edit, run `npm run build` and refresh; `npm run preview` serves an existing build.

```sh
npm run verify
```

Verification generates the Worker binding types, checks TypeScript, builds all
pages, and tests content integrity, agent tools, discovery and negotiation.
Generated runtime types and `dist/` are ignored.

## Edit the site

- `frontend/profile.ts`: homepage work and projects.
- `frontend/App.tsx`: page layouts, about text, search and filters.
- `content/notes/*.md` and `content/publications/*.md`: writing, with the existing
  HTML-comment metadata format. Old publication and note URLs are preserved.
- `tokens.css`, `frontend/styles.css`, `design.md`: the shared design system.
- `frontend/components/ui/`: actual shadcn registry components, locally owned.
- `docs/content-sources.md`: evidence behind the new professional copy.

The original PRPL sources remain in `src/` and `scripts/build.js` for reference.
`npm run build:legacy` builds those old sources into `dist/`; the regular build
replaces that output with the current site.

## Agent-readable interface

Every page has a static Markdown alternate: `/index.md`, `/about/index.md`,
`/notes/index.md`, and `/notes/<slug>/index.md`. Full HTML is available without
JavaScript. The build also emits:

- `llms.txt` and `llms-full.txt`;
- `api/content.json`, `api/profile.json`, `api/pages.json`;
- `.well-known/api-catalog` and `api/openapi.json`;
- `robots.txt`, `sitemap.xml`, RSS `feed.xml`, and JSON-LD.

`robots.txt` declares the owner's chosen Content Signals:
`search=yes, ai-input=yes, ai-train=yes`. Signals express usage preferences;
they are not enforced by this server and do not change third-party licenses.

The browser registers experimental WebMCP `search_content` and `read_page`
tools when the API is available. Search shares the UI's local search function;
reading accepts only known local routes. There is no model call, account or
write operation. Browsers without WebMCP still have every static resource.

## Hosting

The GitHub Actions workflow verifies pull requests and deploys the static build
on a push to `master`. `.nojekyll` preserves the well-known directory. GitHub
Pages serves the explicit Markdown files; it cannot run the edge adapter or
add its custom HTTP headers. No deployment or scanner score is implied by a
local build.

An optional Cloudflare Workers setup is included in `wrangler.jsonc` and
`edge/`. It uses the same static output, adding `Accept: text/markdown`
negotiation, `Vary: Accept`, correct MIME types and HTTP discovery links.
The local preview uses that same representation handler. To inspect the
Cloudflare bundle without publishing:

```sh
npm run build
npx wrangler deploy --dry-run --outdir /tmp/kenneth-worker-preview
```

For another production domain, set `SITE_ORIGIN` to its origin while building
so canonical URLs, feeds, JSON and Markdown agree. Deploying this adapter,
switching the production host, and DNS discovery remain separate operations.
