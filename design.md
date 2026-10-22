# Kenneth's personal website

## Direction

A narrow, readable personal site, informed by https://jakub.kr/.
Use one 640px column, white by default, with sans-serif typography and generous
space between sections. No sidebar, display-sized employer headline, decorative
cards, arrows, gradients, or generated imagery.

Geist remains the body and heading face; Geist Mono is reserved for code and
technical metadata. The body is 16px with a unitless line height. Homepage section
headings are small; hierarchy comes from weight and spacing. `tokens.css` owns
the colors, type sizes, and spacing. The palette is neutral, with an explicit dark
mode and a red error token. Never introduce green or lime without a user request.

## Content

Home has a short introduction, two projects, open-source contributions, and recent
notes. Buildray links to its guide and public source. k_eff links to the studio,
which contains the other projects. Do not expand the old project inventory here.
The existing Projects URL shows the same two entries for bookmarked and agent
access. JSON, Markdown, and structured data use the same curated list.

Detailed Siemens work, career history, publications, and the portrait belong on
About. The portrait appears only there. Articles retain their content, dates,
technical examples, and attribution.

## Interaction

Use native text links with resting underlines. Search and theme are the only
icon controls in the header. They have 44px targets and descriptive accessible
names. List links use compact targets of at least 32px; inline prose links use
the native inline-link exception. Keyboard focus has a solid 2px outline with a
4px offset, including on shadcn controls. No decorative animation.

Project and contribution descriptions are 15px with a 24px line height. Keep
Buildray's source link next to its name; group PR links with their repository
heading, stacking below it on narrow screens. Buildray uses its name without an
icon. k_eff's mathematical wordmark is the project link, with an accessible name
and no duplicate text label. Its original italic serif lettering is a brand
asset; interface text remains Geist.

Text and underline colors transition over 120ms. Keep focus indicators immediate
and disable transitions for reduced motion.

Use the existing shadcn Dialog, Button, Input, Badge, and Separator. Keep search
local, preserve keyboard shortcuts and focus restoration, and contain scrolling
inside the search results. Homepage note rows link to the full article; Notes
keeps topic filters. Footer links lead to contact, RSS, and agent resources.

The search dialog stays within the viewport height, including on short screens.
Its close control has a 44px target. Use the same single focus outline as the
rest of the site, with space around results so their outlines are not clipped.
Underline result titles only; dates, topics, and keyboard hints are quiet 12px
metadata. Keep the dialog heading left-aligned at every size.

About uses a single greeting and an unframed portrait. Stack them on the smallest
screens so the name is not squeezed beside the image. Prose section headings
are 22px, with a 1.4 line height; paragraphs use a 1.8 line height. Publication
titles and their metadata share the text column without bullet indentation.

Articles use balanced title wrapping and a native, keyboard-operable Contents
disclosure so reading starts near the top. Keep every section link available
inside it. Code blocks can receive keyboard focus for horizontal scrolling.
Markdown and copy actions remain simple underlined controls with 44px targets.

## Writing

Use concrete, natural English. Explain the software and the contribution rather
than claiming importance or inventing an experience. Check current README and
PR records before changing implementation stages or stating that work merged.
Keep private repository URLs out of public project links.

Use ordinary spaces, straight quotes, hyphens, three-dot ellipses, and Unicode
NFC. Preserve accented names, source URLs, code, and technical notation.
