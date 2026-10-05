# Kenneth's personal workshop

Modern, restrained, soft and informal. A personal place to show actual engineering,
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

Neutral paper and dark ink, with one muted lavender accent for links and the
AI headline. La Bulle has a faint lavender tint. Other sections use neutral
surfaces or the page background. Geist display and body; Geist Mono for dates,
code and file formats. Roman headings, tight tracking, purposeful spacing.
`tokens.css` is authoritative and applies across all pages and dark mode.
Fonts are self-hosted. Social previews read the same palette from `tokens.css`.

## Interaction

shadcn/ui Button, Badge, Dialog, Input and Separator from the official registry.
Keep their accessibility behavior; customize the presentation. Search is local,
keyboard accessible, and shared with the experimental WebMCP search tool.
Buttons and navigation never wrap. Long article titles may wrap normally.
Visible, instant keyboard focus. No scrolling reveals or decorative animation.
Text links and primary actions have a visible underline in their resting state.
Primary actions use slightly heavier type and underlines. Navigation is text,
with an underline for the current page. Search, theme, filter and copy controls
use compact shapes with minimal rounding. Hover strengthens the underline. Link indicators never use arrows, chevrons,
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
  --color-paper: oklch(98.5% 0.005 285);
  --color-ink: oklch(23% 0.018 280);
  --color-ink-2: oklch(39% 0.012 270);
  --color-muted: oklch(44% 0.011 270);
  --color-rule: oklch(86% 0.01 280);
  --color-accent: oklch(50% 0.095 285);
  --color-lavender: oklch(96% 0.018 285);
  --color-focus: oklch(48% 0.15 285);
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
    "paper": {
      "$type": "color",
      "$value": "oklch(98.5% 0.005 285)"
    },
    "paper-2": {
      "$type": "color",
      "$value": "oklch(96.5% 0.005 285)"
    },
    "ink": {
      "$type": "color",
      "$value": "oklch(23% 0.018 280)"
    },
    "accent": {
      "$type": "color",
      "$value": "oklch(50% 0.095 285)"
    },
    "lavender": {
      "$type": "color",
      "$value": "oklch(96% 0.018 285)"
    }
  },
  "font": {
    "body": {
      "$type": "fontFamily",
      "$value": "Geist Variable"
    },
    "mono": {
      "$type": "fontFamily",
      "$value": "Geist Mono Variable"
    }
  },
  "space": {
    "md": {
      "$type": "dimension",
      "$value": "1.5rem"
    }
  }
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
  --input: var(--color-control-rule);
  --ring: var(--color-focus);
}
```
