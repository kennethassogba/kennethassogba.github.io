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
heading, stacking below it on narrow screens. Projects have unframed monochrome
marks: Buildray's existing chart symbol and k_eff's existing mathematical
wordmark. The wordmark retains its original italic serif lettering as a brand
asset; interface text remains Geist. Marks are decorative and hidden from
assistive technology because the adjacent link names the project.

Text and underline colors transition over 120ms. Keep focus indicators immediate
and disable transitions for reduced motion.

Use the existing shadcn Dialog, Button, Input, Badge, and Separator. Keep search
local, preserve keyboard shortcuts and focus restoration, and contain scrolling
inside the search results. Homepage note rows link to the full article; Notes
keeps topic filters. Footer links lead to contact, RSS, and agent resources.

## Writing

Use concrete, natural English. Explain the software and the contribution rather
than claiming importance or inventing an experience. Check current README and
PR records before changing implementation stages or stating that work merged.
Keep private repository URLs out of public project links.

Use ordinary spaces, straight quotes, hyphens, three-dot ellipses, and Unicode
NFC. Preserve accented names, source URLs, code, and technical notation.
