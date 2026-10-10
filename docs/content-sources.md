# Content provenance — reviewed 2026-10-05

## User direction

Software engineer, with AI-assisted development and agent-native work; soft,
cool SF visual character. Allow search, AI input and training. No relocation,
availability, consulting, or seniority claim was supplied.

The 2026-10-05 review clarifies the engineering work: compiler-side placement
and partitioning for FPGA prototyping, with recently started work on netlist
qualification including clock handling. Intro copy explains the purpose to a
general software audience; the work section gives the EDA terminology. C++ is
the implementation language, not the language being compiled. No customer names,
FPGA physical place-and-route ownership, or specific clock transformations are
claimed.

The review also requests direct wording and removes homepage provenance prose,
slogans, and the extra Notes/footer wording. Source records remain in this file.

## LinkedIn (read in the signed-in browser)

Source: https://www.linkedin.com/in/kennethassogba/

Public professional sections only. Private analytics, messaging, recommendations
and advertisements are excluded from the website content.

- Title: Software Engineer at Siemens.
- About: C++ compiler algorithms, Python, developer tools, AI-assisted engineering.
- Siemens, September 2023–present: agent skills distilled from repository knowledge;
  MCP workflows from specification to implementation; circuit replication over 4x
  faster on production designs; graph pruning up to 60x faster on large circuits.
- Earlier CEA role, PhD at École polytechnique, Total internship.
- Origin: Benin. Home: Sceaux, France.
- Profile Activity and the full activity view both reported no posts. The recent
  work here comes from the current experience section, not invented updates.

Metrics come from the profile and retain their scope.
They are not presented as AI-caused improvements or independently benchmarked.
The new skills note combines these observed activities with clearly framed
engineering opinions; it does not invent a tool stack or internal process.

## FPGA prototyping context

The homepage and about page link to Siemens’ public explanation of Veloce
proFPGA CS and Veloce Prototyping Software (VPS):

https://blogs.sw.siemens.com/hardware-assisted-verification/2024/10/16/fpga-based-prototyping-from-do-it-yourself-to-an-essential-soc-verification-and-system-validation-tool/

The article explains mapping ASIC RTL onto one or more FPGAs, multi-FPGA
partitioning and testing hardware/software before silicon. It supplies product
context; the user's comments supply the scope of their own placement,
partitioning and netlist-qualification work. The page does not adopt the
article's marketing language or attribute every VPS capability to Kenneth.

## Projects

- La Bulle: current public README from kennethassogba/hodge-podge, main,
  blob 16916697b47ea5d3812285a2f5a0472f3f675760. Team project; voice coaching,
  protected silence, editable recap and approved Notion follow-up.
- cmake2graph: current public README from kennethassogba/cmake2graph, main,
  blob 3885199f833f977378412ecae3110ad30b04e8de. Dependency visualization.
  External-library filtering is explicitly unfinished; no claim of that feature
  being complete is added here.
- This website: features implemented in this repository, with tests and hosting
  limits recorded in README.md. No fabricated readiness score.

### La Bulle development note

Publication date requested by Kenneth: 2026-09-27. The local Hodge-Podge
checkout and public GitHub README agree at commit `0c71c1c`; the development
commits span September 26–27. The prior development conversation supplies the
documentation-first, Codex-assisted process; the current code verifies the stack.

- `wrangler.jsonc`: Workers static assets, D1, scheduled execution, text and voice models.
- `worker/index.ts`: Responses JSON schemas, WebRTC session setup, transcription,
  ownership checks, recaps, and content fingerprints for email requests.
- `worker/email.ts`: Resend, escaped HTML, optional UTF-8 transcript attachment,
  and idempotency key.
- `worker/notion-agents.ts`: three sequential calls using the text model,
  exact excerpt checks, persisted stages, and database leases.
- `public/app.js` and `docs/silence.md`: native turn-taking, explicit pauses,
  response recovery, transcript-save retries, and wake-lock lifecycle.
- Commit `b6666f8` records removal of broken browser turn timers. Later September
  27 commits add requested pauses, interrupted-response recovery, recap/email,
  and mobile fixes. The article claims implemented behavior, not a successful
  real-world Notion/email trial or measured coaching effectiveness.

Developer model names used within Codex were not recorded, so none are claimed.
The three named models are the verified application configuration.

## Design

Official shadcn registry (CLI 4.21.1): Button, Badge, Dialog, Input, Separator.
Customized import alias and transitions. Self-hosted Geist and Geist Mono.

Kenneth requested Teenage Engineering colors. Observed reference CSS on
https://teenage.engineering/products/field-system and
https://teenage.engineering/guides/ep-133/whats-new supplies neutral greys,
charcoal, and `#f05a24` orange. Small text colors are adjusted for contrast;
these are website theme choices, not a claim about an official brand guide.

The follow-up color review rejects that reference orange on this page. The
replacement is `#d94f00` for large type and `#af4100` for small text in light
mode, with `#ff702c` in dark mode. Tints, focus colors, and the social card
use the revised palette.

## Studio and project update - 2026-10-10

Kenneth supplied the studio positioning: k_eff is an independent software studio
focused on scientific computing and engineering tools. The homepage introduces
the studio after the Siemens work section. Projects also has its own page.

Sources checked for this update:

- The current `kennethassogba/keff.uk` catalogue, `content/projects.json`, lists
  XS, Forge, mc, La Bulle, Model Card, and AMATA°. It supplies the public app URLs.
- Current GitHub READMEs for buildray, heat, Demeter, human.mpi,
  pinn-experiment, cross-section-plot, and ClashRoyaleWarReport.
- Authenticated reads of the Lattice and dequantization READMEs. These projects
  have descriptions on the site but no links to private repositories.
- Forge's current README identifies the browser-based thermal and IR-drop
  floorplanner. Its repository description still refers to an older FPGA product;
  that description was not used. The README describes a stationary, uniform
  2D model, not chip sign-off analysis. The site calls its fields modeled maps.

The app catalogue, tools, and experiments are kept separate. Forks, profile
configuration, coursework, and repositories without enough information for a
description are excluded. Existing research notes and publications are unchanged.

Development stages come from the repositories. Buildray currently has a README
and tooling configuration, without an implementation. Demeter's solver and
benchmarks remain on its roadmap. mc is presented as a research prototype.
No new performance, validation, commercial availability, or customer claims
were added. Each of the seven studio/app URLs returned HTTP 200 on this review.

The new descriptions were drafted from these sources and checked with
avoid-ai-writing in technical mode. The editable prose went through the straight
quotes normalizer. The detector reported no candidate patterns; that result is a
writing check, not proof of authorship or factual accuracy. Source comparison was
reviewed separately. The existing portrait placement, work metrics, La Bulle
attribution exception, and publication dates were preserved.
