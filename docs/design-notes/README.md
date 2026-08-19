# design-notes/ — status index

This folder holds `conceptbase`'s working design notes — planning docs, case studies, and
background reasoning that inform ConceptBase's schema, content, and app work but aren't
themselves RFCs (see [`../../proposals/`](../../proposals/) for those). Unlike `lab_manager`'s
equivalent folder, this one has no single documented convention every entry follows: **3 of
the 7 documents below carry a full status table** (**Project / Relationship to existing work /
Document status / Author / Date**) plus an explicit, numbered "Open Decisions" section — the
same discipline `lab_manager`'s design-notes folder documents throughout. **The other 4 carry
only a short `Status:` line** describing what kind of artifact they are (an informative case
study or background design note, not a proposal) and have no formal Open Decisions section —
where they name open items, it's inline, as unresolved questions embedded in the prose rather
than collected in one place. This index classifies each document honestly against whichever
convention it actually follows, rather than assuming the stricter one applies everywhere. (Whether
that gap is worth closing — i.e. whether every design note here should adopt the fuller
convention — is a question for `conceptbase`'s own maintainers, not something this index
decides.)

No document in this folder self-declares as closed, superseded, or fully resolved, so there is
no "Archived" section here — see the policy `lab_manager`'s own index states explicitly: a doc
only moves to an archive on the strength of its *own* stated closure, never on a size or age
basis, and none of these 7 make that claim.

## Start here

- **[`open-decisions-register.md`](open-decisions-register.md)** — a flat inventory of every
  open decision or unresolved question named across all 7 documents below (26 total, grouped by
  source document), extracted from each doc's own "Open Decisions"/"Open questions" section
  where one exists, or from equivalent inline language ("not yet decided," "needs Dustin's
  call," "worth revisiting if...") where it doesn't. Faithful inventory only — no priority
  ranking, no recommendations.

## Planning docs — own status table, explicit Open Decisions section

All three are dated 2026-07-22, marked **Draft — not yet implemented, not yet RFC'd**, and use
the same `Project / Relationship to existing work / Document status / Author / Date` header
`lab_manager`'s design notes use.

| Document | Status |
|---|---|
| [`ccs-insights-pipelines-plan.md`](ccs-insights-pipelines-plan.md) | Design for locally-run, GWDG-backed agentic batch pipelines (harvest → embed → candidate-generation → adjudicate → ground → stamp → stage) that scan the lab's local repo clones and draft insight/metadata artifacts into `ccs-graph`'s existing relation schema, `conceptbase`'s existing sandbox tier, and other repos' existing extension points — reusing what's there rather than inventing new schemas, never auto-merged. Companion to `gwdg-saia-ecosystem-plan.md` (that doc covers interactive/browser SAIA use; this one covers batch/local use, and argues it's the *easier* GWDG integration to build first). §10 names 5 open decisions, none resolved in the doc's own text. |
| [`gwdg-saia-ecosystem-plan.md`](gwdg-saia-ecosystem-plan.md) | Maps GWDG's full SAIA/KISSKI AI-service ecosystem (Chat AI, Arcana/RAG, embeddings, MCP tool support, CoCo AI, Image/Voice/Protein AI) against integration points across `conceptbase`, `curriculum-agents`, and `EvoMentor`, and gives federated LPMR maintainers' distinct GWDG-access relationship (self-service Academic Cloud key, no OpenEvo brokering) its own section (§5). §8 names 3 open decisions. |
| [`lpmr-management-app-spec.md`](lpmr-management-app-spec.md) | Full planning spec for a new GitHub-OAuth-gated **LPMR Management App** in the ConceptBase Explorer ecosystem: explore/review/comment/flag/tag any OECB-compatible LPMR with real GitHub identity, optionally invoke a `curriculum-agents` persona over SAIA for a first-pass AI review, and turn any of it into a human-reviewed PR — never a silent write. §16 names 4 open decisions gating Phase 1. |

## Case studies & background design notes — short `Status:` line, no formal status table

These carry a one-line `Status:` declaring what kind of artifact they are (research/case-study
or background reasoning, explicitly **not** a proposal) but no `Project/Relationship/Document
status/Author/Date` table and no numbered "Open Decisions" section. Status below is inferred
from each document's own content, not fabricated against a template it doesn't use.

| Document | Status (inferred) |
|---|---|
| [`case-competency-profile.md`](case-competency-profile.md) | **Informative — a pre-RFC design input, not itself a proposal.** Verified 2026-07-19 directly against a local OpenCASE checkout, correcting two material errors in an earlier GitHub-only-sourced draft (the `associationType` vocabulary and the license catalog). Already fed a real RFC — [`../../proposals/0002-competency-case-profile.md`](../../proposals/0002-competency-case-profile.md) was drafted from this note. Several association-type mappings and the Phase 4 deployment model are named as explicitly still open, stated inline rather than in a dedicated section. |
| [`human-dimensions-k12-case-study.md`](human-dimensions-k12-case-study.md) | **Informative — a research artifact**, structured after `selection-cross-domain-case-study.md`: states a claim, checks it against independent evidence and the real `bio-core-k12`/`oe-interdisciplinary-k12` strand content, and reports honestly what holds up. Per OECB design principle 7, deliberately does not propose a resolution to the underlying scholarly disagreement (Kampourakis 2020 vs. Hanisch et al. 2025 on when human examples belong in a K-12 evolution progression). Closes with an explicit 5-item "Open questions" section. |
| [`selection-cross-domain-case-study.md`](selection-cross-domain-case-study.md) | **Informative — a research artifact** testing `oe-interdisciplinary-k12`'s Strand 1 claim that "Selection" is a genuine transferable cross-domain mechanism (biology/culture/education/AI) against real, independently-authored standards (NGSS, AI4K12). One of three checks (biology ↔ NGSS) held up cleanly; two (AI ↔ AI4K12, twice) surfaced real, specific gaps, recorded as `skos:relatedMatch` rather than `skos:closeMatch`. No formal Open Decisions section, but names unresolved follow-ups inline. |
| [`state-standards-licensing.md`](state-standards-licensing.md) | **Informative — background reasoning**, not a proposal. Documents a real case (Virginia's CASE Satchel pilot) behind how OECB decides what a state/government standards source may contribute. Already load-bearing, not merely a plan: referenced by [`../../proposals/0004-relicense-content-cc-by-nc-sa.md`](../../proposals/0004-relicense-content-cc-by-nc-sa.md), [`../../proposals/0005-citation-only-competency-entries.md`](../../proposals/0005-citation-only-competency-entries.md), and `scripts/case_license_gate.py`. No formal Open Decisions section; one unresolved verification item is named inline. |
