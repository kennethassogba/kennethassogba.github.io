# Kenneth's personal workshop

Modern minimal, soft and informal. A personal place to show actual engineering,
experiments and writing. SF is the visual reference, not a claim about location.
Kenneth lives in Sceaux, France.

## Structure

- Home: personal workshop. Name, two-line introduction, work in production,
  an asymmetric pair of experiments, recent writing. No sales funnel.
- About: Long Document, with a compact work history and research links.
- Writing: chronological reading list with topics and honest draft labels.
- Articles: Long Document with a narrow measure, stable headings and code.
- For agents: a useful resource directory, not a score dashboard.

## Theme and typography

Teenage Engineering light greys, charcoal text, and orange accents. Geist display and body;
Geist Mono only for dates, code and tiny interface labels. Roman headings,
tight tracking, generous but purposeful spacing. `tokens.css` is authoritative.
Fonts are self-hosted. Shared tokens apply across all pages and dark mode.

Reference: [Teenage Engineering](https://teenage.engineering/) and its
[EP–133 guide](https://teenage.engineering/guides/ep-133/whats-new).
Observed CSS colors: `#f5f5f5`, `#e5e5e5`, `#f1f2f2`, `#0f0e12`, `#4d4d4d`,
and orange `#f05a24`. The site's accent is a deeper orange, `#d94f00`, chosen
after Kenneth's color review. Small orange text uses `#af4100` in light mode;
dark mode uses `#ff702c` for the accent and small text.
Secondary text uses `#626262` instead of the reference's lighter greys.

## Interaction

shadcn/ui Button, Badge, Dialog, Input and Separator from the official registry.
Keep their accessibility behavior; customize the presentation. Search is local,
keyboard accessible, and shared with the experimental WebMCP search tool.
Buttons and navigation never wrap. Long article titles may wrap normally.
Visible, instant keyboard focus. No scrolling reveals or decorative animation.

## Voice

Personal and specific: compiler algorithms, agent skills, MCP, C++, Python,
real experiments. No invented metrics, availability claims, or customer logos.
Home uses concise paraphrases of LinkedIn; `docs/content-sources.md` records
provenance. Older research stays available without defining current positioning.

## Exports

### CSS

Use the complete light and dark tokens in [`tokens.css`](tokens.css).

### Tailwind v4

```css
@theme inline {
  --color-background: var(--color-paper);
  --color-foreground: var(--color-ink);
  --color-accent: var(--color-accent-soft);
  --font-sans: var(--font-body);
  --font-mono: var(--font-outlier);
  --spacing-md: var(--space-md);
}
```

### DTCG

```json
{
  "color": {
    "paper": { "$type": "color", "$value": "#f5f5f5" },
    "ink": { "$type": "color", "$value": "#0f0e12" },
    "accent": { "$type": "color", "$value": "#d94f00" }
  },
  "font": {
    "body": { "$type": "fontFamily", "$value": "Geist Variable" },
    "mono": { "$type": "fontFamily", "$value": "Geist Mono Variable" }
  },
  "space": { "md": { "$type": "dimension", "$value": "1.5rem" } }
}
```

### shadcn/ui

Current shadcn/Tailwind v4 variables use full color values, rather than HSL triples.

```css
:root {
  --background: var(--color-paper);
  --foreground: var(--color-ink);
  --primary: var(--color-ink);
  --primary-foreground: var(--color-paper);
  --accent: var(--color-accent-soft);
  --accent-foreground: var(--color-accent-text);
  --border: var(--color-rule);
  --ring: var(--color-accent-text);
}
```
