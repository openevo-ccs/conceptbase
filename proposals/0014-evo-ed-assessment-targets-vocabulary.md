# RFC-0014: Add `EVO-ED-ASSESSMENT-TARGETS` vocabulary (evolution-education assessment targets, operationalizing Nehm & Kampourakis 2022 Table 5)

**Type:** `content`

**Status:** `proposed`
**Author(s):** OpenEvo ConceptBase maintainers (drafted while integrating Nehm & Kampourakis (2022) and Hanisch et al. (2026) into the `og:dispute:openevo-vs-kampourakis` dispute graph)
**Date:** 2026-07-27

## Motivation

CompetencyBase is currently populated by exactly one illustrative record (`competency:ccc-domain-a-curriculum-interpretation`), and its own README names this as a real, flagged gap, not a design choice. Separately, the `og:dispute:openevo-vs-kampourakis` dispute graph (`openevo-graph/nodes/disputes/dispute-openevo-vs-kampourakis.yaml`) already grounds its central `og:divergence:expert-reasoner-model` divergence in `proposition:invariant-expert-reasoning`, whose sole `primarySource` is Nehm & Kampourakis (2022) (`lit:doi-10-48528-4sjc-kj23`) — but nothing in ConceptBase/CompetencyBase currently represents that same chapter's own explicit assessment-target framework (its Table 5, "Examples of possible assessment targets and associated learning objectives": Nature of Science, Language of Science, Evolution Knowledge, Science Practices, Cross-Cutting Concepts).

This is a genuine, checkable content gap: the chapter that grounds one side of a live OpenEvo dispute also contains a ready-made competency taxonomy that has never been turned into structured data, even though the dispute graph, TheoryBase, and LiteratureBase all already reference the chapter.

## Proposed change

One new artifact under `www.w3id.org/openevo/`:

**`vocabularies/EVO-ED-ASSESSMENT-TARGETS-v1.0.0.yaml`** — 21 `oe:Competency` entries (5 assessment-target parents + 16 constituent performance-objective children), structured as a 2-level `skos:broader` hierarchy, the same shape as `CCC-v1.0.0.yaml`. **Not a transcription** — see Licensing below.

## Licensing — flagged for maintainer review, not resolved by this RFC

LiteratureBase's own independent classification of the source (`literaturebase/records/nehm-2022.yaml`) records `license: citation-only` — no confirmed open-access or redistribution grant for the source chapter (Nehm, R., & Kampourakis, K. (2022), in *Learning Evolution Through Socioscientific Issues*, UA Editora) at authoring time.

Consistent with RFC-0011's treatment of DigCompEdu/KMK (unconfirmed-license sources): this vocabulary does **not** reproduce Table 5's text. The five top-level category labels used (Nature of Science, Language of Science, Evolution Knowledge, Science Practices, Cross-Cutting Concepts) are generic pedagogical terms — the same three-dimensional-learning vocabulary NGSS itself uses (Disciplinary Core Ideas / Science Practices / Cross-Cutting Concepts), not original expression specific to this chapter. All 16 child `statement` values are OpenEvo's own paraphrase of the learning-objective *examples* the chapter gives for each target, not quotations.

The `citationOnly: true` schema flag (RFC-0005) is **not** used here, for the same reason RFC-0011 left it unused for DigCompEdu/KMK: `citationOnly: true` requires `provenance.sourceCFItemId`/`sourceCFItemURI` (a CASE `CFItem` UUID/URI), and this source — a book chapter — has no CASE representation to anchor to. This is the same non-CASE-source gap RFC-0011 already surfaced and left for a follow-up RFC; this RFC does not attempt to fix it either.

## Relations

- Uses `oe:Competency` (RFC-0002) exclusively — no schema changes.
- Each parent entry's `citations` cites Nehm & Kampourakis (2022), `doi: 10.48528/4sjc-kj23` (`lit:doi-10-48528-4sjc-kj23`).
- Natural follow-up (not part of this RFC): an alignment or `openevo-graph` edge connecting this vocabulary to `theory:dichotomized-causal-reasoning`'s `assumption:dcr-primary-responsibility` and to `og:divergence:disciplinary-scope`, and/or a crosswalk to `NGSS-LIFE-SCIENCE`'s three-dimensional-learning framing — left for a follow-up RFC/graph-layer edge, same deferral pattern RFC-0011 used for CCC's cross-framework alignments.

## Standards justification

Not a novel structure — a direct, unmodified use of `oe:Competency` (RFC-0002) and an ordinary 2-level `skos:broader` hierarchy, matching `CCC-v1.0.0.yaml`'s precedent exactly.

## ID block reservation

Per `GOVERNANCE.md#identifier-block-allocation`, Competency ID blocks:

| Vocabulary | Block | Used |
|---|---|---|
| `EVO-ED-ASSESSMENT-TARGETS` | `000700`–`000799` | 700–720 (5 target parents + 16 objectives) |

## Files affected

| File | Change | Status |
|---|---|---|
| `GOVERNANCE.md` | 1 new row added to the Competency ID blocks table | Done, 2026-07-27 |
| `vocabularies/EVO-ED-ASSESSMENT-TARGETS-v1.0.0.yaml` | New — 21 `oe:Competency` entries | Done, 2026-07-27 |
| `competencybase/records/evo-ed-assessment-targets-nature-of-science.yaml` | New — illustrative mirror of the `A` (Nature of Science) parent entry, matching CompetencyBase's existing single-example pattern | Done, 2026-07-27 |

Not yet run against `scripts/validate.py` / `scripts/check_related_symmetry.py` in a live ConceptBase clone as part of this draft — flagged for the PR author to run before opening the PR, per this repo's own contributing instructions.

## Review

- [ ] Domain editor approval (evolution-education / competency-frameworks domain — no existing domain editor assigned)
- [ ] Maintainer approval
- [ ] **Explicit licensing sign-off requested** on the citation-only source treatment above before any `proposed → accepted` promotion
- [ ] Confirm whether the RFC-0011-flagged follow-up (generalizing RFC-0005's `citationOnly` provenance shape for non-CASE sources) should be prioritized, since this RFC hits the same gap a second time
