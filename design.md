# Kenneth's personal workshop

Modern, vivid, soft and informal. A personal place to show actual engineering,
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

An airy pastel palette: lavender for the introduction and website project,
peach for La Bulle, blue for writing, and mint for developer tools and contact.
Deep violet marks interactive text; dark ink keeps body copy readable. Pastels
are large surfaces, not low-contrast text. Geist display and body;
Geist Mono only for dates, code and tiny interface labels. Roman headings,
tight tracking, generous but purposeful spacing. `tokens.css` is authoritative.
Fonts are self-hosted. Shared tokens apply across all pages and dark mode.

All colors use named OKLCH tokens. Dark mode uses the same hue families on
deeper surfaces with lighter ink. Social previews read the same palette from
`tokens.css`. No gradients, decorative blobs, or simulated app screenshots.

## Interaction

shadcn/ui Button, Badge, Dialog, Input and Separator from the official registry.
Keep their accessibility behavior; customize the presentation. Search is local,
keyboard accessible, and shared with the experimental WebMCP search tool.
Buttons and navigation never wrap. Long article titles may wrap normally.
Visible, instant keyboard focus. No scrolling reveals or decorative animation.
Text links have a visible violet underline in their resting state. Primary
actions use filled rounded controls; navigation uses a compact pill treatment.
Hover adds a soft tinted background. Link indicators never use arrows, chevrons,
or replacement icons. Icons are reserved for actual controls and project types.
La Bulle explains the session and the recap with real product details, rather
than a slogan or empty decorative space.

## Voice

Personal and specific: compiler algorithms, agent skills, MCP, C++, Python,
real experiments. No invented metrics, availability claims, or customer logos.
Home uses concise paraphrases of LinkedIn; `docs/content-sources.md` records
provenance. Older research stays available without defining current positioning.

## Exports

### CSS

The complete light and dark system is in [`tokens.css`](tokens.css). The core light palette is:

```css
:root {
  --color-paper: oklch(98% 0.009 300);
  --color-ink: oklch(23% 0.032 280);
  --color-ink-2: oklch(39% 0.034 270);
  --color-muted: oklch(44% 0.027 270);
  --color-rule: oklch(85% 0.026 280);
  --color-accent: oklch(50% 0.18 285);
  --color-lavender: oklch(94% 0.045 300);
  --color-mint: oklch(93% 0.054 160);
  --color-peach: oklch(94% 0.051 40);
  --color-blue: oklch(92.5% 0.048 250);
  --color-focus: oklch(48% 0.21 285);
}
```

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
    "paper": { "$type": "color", "$value": "oklch(98% 0.009 300)" },
    "ink": { "$type": "color", "$value": "oklch(23% 0.032 280)" },
    "accent": { "$type": "color", "$value": "oklch(50% 0.18 285)" },
    "lavender": { "$type": "color", "$value": "oklch(94% 0.045 300)" },
    "mint": { "$type": "color", "$value": "oklch(93% 0.054 160)" },
    "peach": { "$type": "color", "$value": "oklch(94% 0.051 40)" },
    "blue": { "$type": "color", "$value": "oklch(92.5% 0.048 250)" }
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
  --primary: var(--color-accent);
  --primary-foreground: var(--color-paper);
  --accent: var(--color-accent-soft);
  --accent-foreground: var(--color-accent-text);
  --border: var(--color-rule);
  --input: var(--color-control-rule);
  --ring: var(--color-focus);
}
```
