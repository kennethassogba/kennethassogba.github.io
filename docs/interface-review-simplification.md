# Simplified site review - 2026-10-22

## Scope and coverage

Reviewed the shared single-column layout, Home, Projects, About, Notes, an article,
agent resources, navigation, search, theme switching and the project exports.
The stack remains React, TypeScript, Tailwind v4, shadcn/ui and custom CSS tokens.
`design.md` records the new brief. No repository-specific AGENTS, CLAUDE or
CONTRIBUTING file was found; the supplied RTK and visual instructions apply.

The reference https://jakub.kr/ was inspected before implementation. This is an
adaptation of its reading scale and list structure, not a copy of its content.
All six better-interface domain skills were loaded; their applicable guidance
and the existing project conventions informed the review.

| Domain | Evidence inspected | Result |
| --- | --- | --- |
| Accessibility | Header and project links, focus, search dialog, Escape restoration, headings, portrait alt text | Focus contrast corrected |
| Layout | Home at 1280, 390 and 320px; About, Projects and agents at 320px; Notes and article at 390px | No overflow in tested views |
| Writing | Profile/Buildray READMEs and three GitHub PR records; new biography and project/contribution copy | Obsolete Planning label removed |
| Typography | Browser-computed 16px body, 640px measure, Geist, wrapping and compact note rows | Clear |
| Colors | Browser-computed light/dark page, prose, metadata, links and focus tokens | Contrast passes |
| UI | Underlined links, hover guards, static surfaces, search scroll containment, theme behavior | Clear |

## Findings

| Severity | Domain | Location | Before | After | Why |
| --- | --- | --- | --- | --- | --- |
| HIGH | Colors | `frontend/styles.css:50`, `frontend/components/ui/button.tsx:8` | The component's outline reset overrode the base focus rule, leaving a 50%-alpha focus ring, about 2.1:1 on white | Solid 2px focus outline outside the CSS layer, plus 4px offset; remove the toolbar's duplicate shadow | A custom focus indicator needs 3:1 contrast under WCAG 1.4.11. Fixed; the light focus token reaches 6.00:1. |

No HIGH findings remain. The obsolete Buildray Planning description was also
updated from its current README. The legacy Projects page now uses a coherent
heading outline for its two entries. No new rule suppressions were added.

## Verification

Passed:

- `rtk proxy env WRANGLER_LOG_PATH=/tmp/personal-site-wrangler.log npm run verify`:
  Worker types, TypeScript, 16 generated pages and all 10 tests.
- Home has two project rows and no portrait. The same two projects appear in
  Projects, Markdown, JSON and structured data. The three PR links appear in
  the homepage and exported Projects content.
- Runtime viewport checks: no page-level horizontal overflow at the widths
  listed above. The desktop main column measures 640px; body text is 16px.
- Notes' MPI filter returns three notes, and All restores the full list.
- Keyboard navigation reaches About and Search. Search opens by Enter, focuses
  its input, displays a recovery suggestion for a query with no results, closes
  with Escape and returns focus to Search. The corrected button outline is solid.
- Theme switching checked visually and through computed styles.
- Contrast, calculated from browser-computed neutral colors:
  light prose 11.31:1, metadata 6.54:1, links 13.64:1, focus token 6.00:1;
  dark prose 11.68:1, metadata 8.01:1, links 13.70:1, focus token 11.68:1.
- WebMCP read_page returned the new Projects Markdown, including only the two
  project entries and the three accepted contribution links.
- GitHub API confirmed the three PRs' authors and merged state. The studio,
  Buildray guide and public source URLs returned HTTP 200.

Not verified:

- Actual browser zoom at 200%, a full screen-reader walkthrough, and an RTL
  mirror. Narrow-width checks do not establish these behaviors.
- Every historical article visually. The existing content-preservation tests
  cover their complete Markdown bodies and local references; the shared article
  layout was checked with a representative note.

## Copy verification

Editing passes: one of two. Checks: straight-quotes normalizer and technical-mode
pattern detector executed on the changed prose; the detector returned no
candidates. NFC and hidden-character checks also ran. Factual preservation was
reviewed against the user brief, current READMEs and PR records, with existing
work details compared separately. Residuals: none found in the new prose.
Stop reason: no further justified copy edits. Source code and protected article
content were not passed through the prose normalizer.

## Verdict

Approve for the six inspected domains and the stated scope. No HIGH findings
remain; the unverified checks above are limits of this review.
