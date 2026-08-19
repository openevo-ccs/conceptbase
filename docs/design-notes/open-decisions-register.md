# Open Decisions Register

**What this is.** A single, flat inventory of every open decision or unresolved question named
across the 7 documents in `docs/design-notes/` (everything except this file and `README.md`
itself). It exists for the same reason `lab_manager`'s equivalent register does: re-reading every
document each session to rediscover what's still pending doesn't scale, even at 7 documents.

**How to use/maintain it.** This is a derived index, not a place to write new content directly.
When a new design doc lands, or an existing open decision gets resolved (in conversation, in a
doc's own revision-history note, or by a follow-on RFC), regenerate this file: re-read each
document's "Open Decisions" (or "Open questions") section where one exists, or — for the 4
documents that don't use that convention (see `README.md`) — the equivalent inline language
("not yet decided," "worth revisiting if...," "needs manual verification," "not... resolve[d]")
and pull out each individual item as its own line. Don't hand-edit stale entries out one at a
time; regenerate.

**What this is not.** Not a priority ranking, not a recommendation, not an analysis — a faithful
inventory only. Decisions are grouped by source document, in the same order as `README.md`.

---

### case-competency-profile.md

This document has no dedicated "Open Decisions" section; the items below are stated inline in
its "Proposed profile sketch" and "Operational weight" discussion.

- Whether `isPeerOf`'s CASE association type maps cleanly onto anything in OECB — the closest
  candidate is `skos:related`, but the note flags peer-ness as "symmetric-by-name only," needing
  its own check rather than being assumed equivalent.
- Whether `exemplar`, `hasSkillLevel`, and `isTranslationOf` (three CASE association types) have
  any OECB analogue at all — flagged as "no current OECB analogue," deliberately not forced into
  a mapping.
- Whether each proposed association-type mapping actually holds under "behavioral verification,
  not just label similarity" (per spec §9) before being encoded into a schema — none of the
  mapping-table rows have been verified this way yet.
- Whether Phase 4 assumes a shared reference OpenCASE deployment, per-repo self-hosting, or a
  schema-source-only relationship with no runtime dependency at all — left as "a decision for an
  actual Phase 4 RFC."
- Whether a future RFC proposing a *shared* OpenCASE deployment (which implies real Keycloak/OIDC
  user accounts and personal claims tied to authored frameworks) needs its own deliberate
  data-protection decision, rather than inheriting a default from "each dependent repo
  self-hosts."

### ccs-insights-pipelines-plan.md

- Where the pipeline code lives — a `pipelines/`/`tools/` directory inside `ccs-graph` (the
  doc's stated default, since it's the smallest change) vs. its own new repo
  (`ccs-insights-pipelines` or similar), given the pipeline reads/writes *across* many repos
  rather than being one repo's internal tooling.
- The actual name for the new `review_status` value used for agent-drafted `ccs-graph` records
  (`"agent-drafted"` is only a placeholder throughout the doc) — needs confirming before Phase 1
  writes a real record, since it becomes a de facto controlled-vocabulary value the moment it's
  used.
- Whether `ccs-graph`'s `confidence.composite` score is a fixed weighted function of its three
  sub-scores (computable deterministically, "safe") or meant to be human judgment case-by-case
  (left blank pending human input, "safer still") — the existing entropy record's numbers look
  like a simple average, not yet confirmed as the actual formula.
- Whether Phase 3 runs `data_development.csv`'s full backlog of computational measures in one
  large pass, or pilots on 5–10 first to catch systematic quality issues before scaling — the
  same "small pilot before backfill" caution Phase 1 already applies at the single-record level.
- Whether `openevo-graph` gets retired/migrated (port unique content into `conceptbase` with real
  IDs and RFC review, run its `caseLinks` through `case_license_gate.py`, then archive the repo)
  or reactivated (fix its ID-scheme mismatch and licensing gap deliberately, keep it as a
  legitimate second pipeline target) — determines whether Phase 4 ever points a generation
  pipeline at it at all. *(Independent of that answer, the doc separately flags the existing
  `caseLinks` claims as needing to run through `case_license_gate.py` soon either way.)*

### gwdg-saia-ecosystem-plan.md

- **Public MCP hosting** (§5, §6, Phase 3): does OpenEvo host one small shared, read-only
  `conceptbase-mcp` instance for the whole federation, or does the ecosystem instead invest in
  making self-hosting trivially easy (a one-command deploy target) so each federated maintainer
  runs their own?
- **How much of this doc's opportunity map is worth pursuing now vs. parked:** embeddings-based
  semantic search and Arcana/RAG-based doc grounding are both named as real, independent ideas
  with no upstream dependency — is there appetite to spike either before or in parallel with
  `lpmr-management-app-spec.md`'s own Phase 4, or should everything GWDG-related wait for that
  app to prove the pattern first (the doc's own default assumption, per its §7 Phase 1)?
- **Federated-maintainer outreach:** is there an actual near-term audience (a specific
  institution or partner already running or planning an OECB-compatible LPMR) who'd use a
  federated MCP/SAIA path today, or is §5 currently anticipatory design for a use case with no
  concrete first user yet? Changes how much to invest in the Phase 4 onboarding doc now vs.
  later.

### human-dimensions-k12-case-study.md

This document uses a "Open questions" heading rather than "Open Decisions"; items below are
copied from that section.

- Should the proposed "trajectory" mechanism (Phase 3 scope) live on `oe:SubStrand` as a new
  field, or is the existing `required` + `recommendedSequence` machinery sufficient with clearer
  documented conventions?
- Is `bio-core-k12`'s complete absence of human-named content better resolved by adding a
  non-agentic human-lineage substrand (Phase 7 of the initiative proposes drafting one), or is a
  documented, deliberate absence itself a legitimate design choice worth leaving as-is, once it's
  *recorded* as deliberate rather than silent?
- Does `OE-CONCEPT-oe-interdisciplinary-agency`'s formal definition need to be revised toward the
  more deflationary "without requiring conscious intention" framing before any new human-anchored
  content extends it, or should the strand-level restatement instead be brought back in line with
  the current formal definition? Both are named as live options; the document takes no position.
- Should `OE-STRAND-000224` be promoted from elective to required, given `OE-STRAND-000234`
  (required) already assumes required-track students have encountered agency-spectrum reasoning
  that `000224` alone actually develops? Or is the two-speed design (systems-level claim for
  everyone, individual-agency comparison for those who opt in) intentional and worth keeping?
- What would it take to build the integrated evolution-education / AI-literacy literature base
  that currently doesn't exist — the document notes the two relevant research literatures are
  "largely disconnected from each other right now" — and is that a research contribution
  OpenEvo/CCS is positioned to make directly?

### lpmr-management-app-spec.md

- **App-ecosystem shape** (§5): ship as new tabs in the existing Explorer monolith (shape A,
  fastest) now, or invest in a shared-shell/pluggable-apps restructuring (shape B) up front? The
  doc recommends A now, structured so B is a mechanical move later, but names this "a real
  architecture call, not a default to just assume."
- **Non-static relay** (§6.1, §10.3): a stateless CORS relay would be the first piece of infra in
  this ecosystem that isn't "files in a git repo served by GitHub Pages" — who hosts it, under
  what account/budget, and is that an acceptable first exception to the no-backend design
  principle?
- **Timing relative to `curriculum-agents`:** should LPMR Manager ship human-review-only first
  (Phases 1–3) and treat SAIA/agent integration (Phases 4–5) as a clearly separate, later
  decision point — or is there appetite to prioritize the AI-review angle sooner, accepting more
  upstream-dependency risk (`curriculum-agents`' institutional-mode agents and all `processes/`
  are unimplemented upstream today)?
- **GitHub App registration ownership:** a GitHub App needs to be registered under some GitHub
  account/org (presumably `openevo-ccs`) with real settings (callback handling for Device Flow,
  permission scopes) — who does this and when, and is it a Phase 0 spike task or does it need its
  own separate sign-off first?

### selection-cross-domain-case-study.md

This document has no dedicated "Open Decisions" section; the items below are stated inline,
mostly in "Check 2" and "Check 3."

- Whether to revise Strand 1's 9-12 performance indicator to reference what AI4K12 actually
  teaches (reinforcement learning's trial-and-error framing) instead of genetic
  algorithms/fitness functions, *or* to treat genetic algorithms/evolutionary computation as a
  real, named gap in current K-12 AI-literacy standards worth a future OECB-authored sandbox
  concept — presented explicitly as "two honest ways to respond, not mutually exclusive," neither
  chosen.
- Whether `OE-STRAND-000224` (currently elective, its Agency/AI comparison backed only by a
  parenthetical example) should be revisited with real AI4K12 citations — the document notes a
  recommendation-algorithm example arguably fits AI4K12's "Ethical AI" rows better than the
  consciousness-centered "Philosophy of Mind" row it's currently checked against — "worth
  revisiting if [it] is ever fleshed out."
- Whether the DCR/ICR tension means `BIO-CORE`'s and `OE-INTERDISCIPLINARY`'s Selection concepts
  are "fully equivalent or subtly broader" in the latter's case — named explicitly as "exactly
  the kind of genuine disagreement in evolution-education research... the pluralism model is
  designed to hold open, not resolve," i.e. deliberately left unresolved rather than overlooked.

### state-standards-licensing.md

This document has no dedicated "Open Decisions" section; one unresolved item is stated inline.

- Whether VDOE's own stated policy on its SOL documents (reportedly permitting "reproduction...
  for instructional purposes in public school classrooms," found only via public search results)
  is accurate — VDOE's own site returned a 403 to direct fetch, so this "needs manual
  verification" before treating either the stricter Satchel/CGLT `licenseURI` metadata or the
  looser reported VDOE policy as the final word for any given source.

---

## Fully resolved — nothing open

None. All 7 documents in this folder name at least one open decision or unresolved question
above — 3 in a formal "Open Decisions"/"Open questions" section, 4 stated inline — so there is
nothing to list here. Per the same discipline `README.md` uses for its skipped "Archived"
section: this heading is kept for structural parity with `lab_manager`'s register, not populated
just to have an entry.
