# Project interface review - 2026-10-10

## Scope and coverage

Reviewed the homepage's k_eff section, the Projects page, the new navigation
link, the About studio paragraph, and project-related agent exports. React,
TypeScript, shadcn/ui, Tailwind v4, and the existing custom CSS/token system.
`design.md` and `tokens.css` define the visual conventions. `docs/content-sources.md`
records the copy sources. This is not a new audit of every article or older flow.

The six better-interface domain skills and their applicable references informed
the review. The existing flat layout, neutral surfaces, violet links, portrait
placement, and native navigation were retained.

| Domain | Evidence inspected | Result |
| --- | --- | --- |
| Accessibility | Heading hierarchy, lists, contextual link names, current-page state, 44px actions, keyboard focus and category anchors | Link-name issue fixed |
| Layout | Homepage and Projects at 1440, 640, 390 and 320px; grid reflow; header navigation | Clear after responsive header adjustment |
| Writing | User's studio positioning, current catalogue and GitHub READMEs, new descriptions and development stages | Clear |
| Typography | Geist roles, 16px body text, 1.65 line height, wrapping titles, 65ch description cap | Clear |
| Colors | Browser-computed light/dark text, background and focus colors; contrast calculations | Clear |
| UI | Resting underlines, flat rows, touch targets, empty link groups, existing reduced-motion rules | Clear |

## Findings

| Severity | Domain | Location | Before | After | Why |
| --- | --- | --- | --- | --- | --- |
| MEDIUM | Accessibility | `frontend/App.tsx:146` | Visible "Open project" had the accessible name "Open XS"; "Source on GitHub" omitted "Source" from its name | Names include the complete visible label and the project name | Speech users can use the visible label; assistive technology can distinguish projects. Fixed. |

No actionable findings remain in the inspected scope. The compact header was
also adjusted to accommodate three navigation links, and projects without public
links do not render an empty action group. No new rule suppressions were added.

## Verification

Passed:

- `WRANGLER_LOG_PATH=/tmp/personal-site-wrangler.log npm run verify`, through RTK:
  generated Worker types, TypeScript, production build, and all 10 tests.
- Desktop screenshot review of the homepage and Projects page at 1440px.
- Homepage width checks at 640, 390 and 320px; Projects at 320px. No horizontal
  overflow. Category links and long project descriptions wrap without truncation.
- Clicking a project category reaches its heading. Keyboard Tab from the XS
  action reaches Forge with a visible 2px outline and 4px offset.
- Theme switching preserves legibility. Text contrast against the page surface:
  light body 9.20:1, metadata 7.44:1, links 5.90:1, headings 16.20:1;
  dark body 11.66:1, metadata 8.58:1, links 10.51:1, headings 15.96:1.
  Focus contrast is 6.61:1 light and 11.60:1 dark.
- Browser WebMCP `read_page` returned the complete Projects Markdown. Tests check
  HTML/Markdown/JSON discovery, local links, known-page reads, and rejected
  arbitrary fetch paths. Project links and category links have spaces between
  them in generated Markdown.
- The seven public studio/app URLs returned HTTP 200. Source facts were checked
  against README/catalogue text, without claiming application benchmarks passed.
- Home has no portrait. Existing articles and protected copy are unchanged.

Not verified:

- Actual 200% browser zoom: the in-app browser did not change zoom in response to
  its keyboard shortcut. A 640px viewport tested comparable reflow, and 320px
  width was tested directly; those checks do not establish zoom behavior.
- Full screen-reader traversal, hardware WebGPU computation in linked products,
  and a new audit of search/filter/copy flows are outside this review.

## Copy check

Editing passes: two of two (initial drafting and contextual accessible-name
correction). Checks: straight-quotes normalization and the technical-mode pattern
detector ran; the detector returned no candidates. Factual preservation was a
source-by-source review, not a semantic claim from the detector. Residuals: none
found in the new editable prose. Stop reason: no further justified copy edits.

## Verdict

Approve for the six inspected domains and the stated project scope. No HIGH
findings remain. The zoom and broader-flow limits above still apply.
