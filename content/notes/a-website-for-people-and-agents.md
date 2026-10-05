<!--
title: Making this website AI-native
slug: notes/a-website-for-people-and-agents
date: 2026-10-05
description: Markdown pages, WebMCP tools, and content discovery based on Cloudflare’s recommendations.
categories: AI & agents
-->

I’m making this website AI-native, following [Cloudflare’s agent-readiness recommendations](https://blog.cloudflare.com/agent-readiness/) and [Double Slash’s implementation](https://double-slash.dev/articles/is-it-agent-ready/).

For this site, that means an agent can find the content, read it as Markdown, and search the notes and publications. Here’s what I added.

## Markdown pages

The notes are written in Markdown. The build generates full HTML pages with React and shadcn/ui, plus a Markdown version of each page. The HTML already contains the content before JavaScript runs.

Every article has a **Read as Markdown** link and a copy button. The homepage is available at [/index.md](/index.md); this note is at [/notes/a-website-for-people-and-agents/index.md](/notes/a-website-for-people-and-agents/index.md).

## Content discovery

The build generates these files:

- [/llms.txt](/llms.txt): a list of pages and Markdown URLs;
- [/llms-full.txt](/llms-full.txt): the complete text;
- [/api/content.json](/api/content.json): titles, dates, topics, URLs and plain text;
- [/api/profile.json](/api/profile.json): my profile and projects;
- [/sitemap.xml](/sitemap.xml): the public pages;
- [/feed.xml](/feed.xml): the RSS feed for new notes.

The JSON endpoints are listed in [the API catalog](/.well-known/api-catalog), with an [OpenAPI description](/api/openapi.json). They are static files and don’t require an account or API key.

## WebMCP tools

The search button and ⌘ / Ctrl K open a local search over the writing. The query stays in the browser.

In browsers with WebMCP support, the page registers two tools:

- `search_content`: searches the notes and publications using the same function as the search interface;
- `read_page`: reads the Markdown of a known page on this site.

Both tools are read-only. WebMCP is still experimental, so the Markdown files and JSON endpoints are also available directly.

## Content Signals

I allow search, AI input, and model training. These preferences are declared in [robots.txt](/robots.txt):

```text
Content-Signal: search=yes, ai-input=yes, ai-train=yes
```

Crawlers that support Content Signals can read these preferences. The signals themselves don’t enforce them.

## Hosting

GitHub Pages serves the HTML and Markdown files. It can’t run the server code needed to return Markdown from an HTML URL using `Accept: text/markdown`, so agents should use the explicit Markdown URLs there.

I included an optional Cloudflare Worker adapter for content negotiation. It also adds HTTP `Link` discovery headers and `Vary: Accept` so caches distinguish HTML from Markdown. The adapter is in the repository and isn’t deployed.

DNS-based discovery would require a domain I control. The `github.io` subdomain doesn’t provide that access.

The [For agents page](/agents.html) lists the resources. The build tests check the content exports, the browser tools, and content negotiation.

## References

- [Cloudflare: Agent readiness](https://blog.cloudflare.com/agent-readiness/)
- [Double Slash: Is it agent ready?](https://double-slash.dev/articles/is-it-agent-ready/)
- [Is it agent ready? — scanner](https://isitagentready.com/)
- [Content Signals](https://contentsignals.org/)
- [RFC 9727 — API catalog discovery](https://www.rfc-editor.org/rfc/rfc9727.html)
- [WebMCP proposal](https://github.com/webmachinelearning/webmcp)
