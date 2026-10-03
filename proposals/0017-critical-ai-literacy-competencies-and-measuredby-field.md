# RFC-0017: `CRITICAL-AI-LITERACY` vocabulary + `competencybase` `measuredBy` field

**Type:** `content`

**Status:** `proposed`
**Author(s):** Claude (planning + drafting pass, per RFC-0007/RFC-0016's precedent for maintainer-authored content RFCs), for review by Dustin Eirdosh
**Date:** 2026-08-05

## Motivation

CompetencyBase's `AI4K12` block (`OE-COMPETENCY-000200`–`000699`, 381 records) covers AI as *subject-matter content knowledge* — the AAAI/CSTA Five Big Ideas (Perception, Representation & Reasoning, Learning, Natural Interaction, Societal Impact). It has no record for AI as something to be *critically evaluated as a practice* — conceptual clarity about what a given AI system actually is, critical evaluation of its outputs, awareness of whose infrastructure/knowledge systems it centers, respecting domain expertise over AI fluency, and resisting AI-adoption-speed pressure on scholarship. That gap was surfaced this session while integrating Guest, Suarez & van Rooij (2025) *Towards Critical Artificial Intelligence Literacies* and its companion position paper into `theorybase` (`theory:critical-ai-literacies`) — a real, citable framework now exists in this ecosystem with nothing in CompetencyBase to operationalize it as something a learner (or, honestly, this ecosystem's own contributors) should be able to do.

Separately, this session found that `competencybase`'s existing `relatedTheory`/`relatedLiterature` pattern (RFC-0016) has no inverse field on the MethodsBase side: a competency can point at the theory/literature that grounds it, but nothing points at *which method actually measures it*. `methodsbase`'s `method:evoflex-vignette-forced-choice-assessment-design` (RFC-0004, `status: validated`) is a real, working assessment instrument with no competency record pointing back at it. This RFC closes that gap with one new optional field, bundled here per RFC-0015/RFC-0016's own precedent for spanning a schema decision and a content decision in one document.

## Proposed change

### 1. Schema amendment — `competencybase/schema/competency-record.schema.json`

One new **optional** top-level property, backward-compatible with all existing records:

- **`measuredBy`**: array of strings, pattern `^method:[a-z0-9-]+$` — matches MethodsBase's current (pre-RFC, provisional) id scheme, the same maturity caveat `relatedLiterature`/`relatedTheory` already carry for their own target repos. Lets a competency point at the MethodsBase `research-method` record(s) that actually assess it, distinct from `indicators[]` (free-text performance descriptors with no resolvable target).

No existing property changes meaning or requiredness. `additionalProperties: false` stays in place.

**Not populated on any existing record by this RFC.** `OE-COMPETENCY-000800` (Computational Thinking) was considered as a demonstration target pointing at `method:evoflex-vignette-forced-choice-assessment-design`, and rejected: EvoFlex measures integrated vs. dichotomized causal reasoning about behavior/evolution, not computational-thinking skills — populating it would have been a false link manufactured to demonstrate the field rather than a true one. No method in this ecosystem currently measures either Computational Thinking or the Critical AI Literacy competencies this RFC adds below. The field ships empty everywhere; it exists for the next real assessment method (or a future `assessment-designer`-agent-produced CAIL instrument) to populate honestly.

### 2. New vocabulary: `CRITICAL-AI-LITERACY`

The second vocabulary of OpenEvo-authored (not externally transcribed) competencies, alongside `OPENEVO-CORE-COMPETENCIES` (RFC-0016). 6 records, `OE-COMPETENCY-000900`–`000905`:

- `000900` — parent: **Critical AI Literacy**
- `000901` — **Conceptual Clarity** (naming AI systems/practices precisely rather than through vague industry umbrella terms)
- `000902` — **Critical Thinking About AI Outputs** (evaluating AI-produced content rather than accepting it on fluency)
- `000903` — **Decoloniality of AI Infrastructure and Knowledge** (whose compute, data, language, and knowledge systems a given AI adoption choice centers)
- `000904` — **Respecting Domain Expertise Over AI Fluency** (AI augments, never bypasses or discounts, genuine expertise)
- `000905` — **Slow Science Under AI Acceleration Pressure** (deliberate evaluation sets scholarship's pace, not generation throughput)

Directly operationalizes `theory:critical-ai-literacies`'s five CAIL dimensions (theorybase, this session) as a competency tree, the same move RFC-0016 made for Woensdregt et al./Guest's virtuous-practices framework via Computational Thinking's sub-competencies.

**`developmentalProgression` translation note, stated honestly rather than smoothed over:** CAIL as published is a framework for academic/research practice, not a K-12 curriculum. The `K-2`–`9-12` bands below are this RFC's own pedagogical translation, not present in the source papers, and are marked `author-draft`/`proposed` precisely because that translation has not been checked by anyone with K-12 AI-literacy pedagogy expertise. The `13-16` band (post-secondary/adult) is the only one directly grounded in the source papers' own claims.

Every record: `status: proposed`, `provenance.review_status: author-draft` (unreviewed — same honesty precedent as `EVO-ED-ASSESSMENT-TARGETS`'s and `OPENEVO-CORE-COMPETENCIES`'s own marking), `relatedTheory: ["theory:critical-ai-literacies"]`, `relatedLiterature` pointing at `lit:doi-10-5281-zenodo-17786243` and `lit:doi-10-5281-zenodo-20082828`, `broader`/`narrower` wiring the parent↔children tree.

## Relations

- Extends `oe:Competency` (RFC-0002) and its resolution home (RFC-0015) — no new class.
- Grounds directly in `theory:critical-ai-literacies` (theorybase, 2026-08-05) — the first CompetencyBase vocabulary whose `relatedTheory` links resolve to same-session theorybase content rather than pre-existing records.
- No relation asserted to `AI4K12` — a natural Phase 2 alignment RFC (content-knowledge-about-AI vs. critical-practice-about-AI are related but distinct competency families, the same kind of relationship RFC-0016 left unbuilt between Computational Thinking and AI4K12's Big Ideas).
- No relation asserted to whatever RFC-0011 (`rfc-0011-teacher-competency-frameworks-and-ccc`, unmerged) turns out to contain — that branch was found this session to have an unresolved block-numbering conflict with RFC-0016 (see ID block reservation below), and this RFC does not attempt to resolve it.

## Standards justification

Not a novel structure. `measuredBy` is a typed cross-repo reference field of the same kind `relatedTheory`/`relatedLiterature` already are (RFC-0016), just resolving against MethodsBase's id namespace instead. The `CRITICAL-AI-LITERACY` vocabulary reuses the exact record shape RFC-0016 established — no schema change beyond `measuredBy` is needed to represent it.

## ID block reservation

Reserves `OE-COMPETENCY-000900`–`000999` for `CRITICAL-AI-LITERACY` (next free block after `OPENEVO-CORE-COMPETENCIES`' `000800`–`000899`), added to `GOVERNANCE.md`'s Competency ID blocks table. 6 of 100 slots used this pass; remaining slots reserved for future CAIL-family competencies (e.g. a K-12-appropriate "AI systems literacy" companion competency distinct from AI4K12's content-knowledge framing, not scoped in this pass).

**Flagged, not resolved, per RFC-0016's own precedent for this exact situation:** RFC-0016 itself recorded (Review section, 2026-08-02) that `rfc-0011-teacher-competency-frameworks-and-ccc` (unmerged branch) claims a reserved range described there as `000700`–`001099` across four frameworks, double-allocating against both RFC-0016's own `000800`–`000899` and RFC-0014's `000700`–`000799`, with the branch itself found this session to actually author records in the `000110`–`000139` range (inside `BIO-CORE`'s block) rather than the range RFC-0016's note described — the numbering picture is more tangled than RFC-0016 alone suggested, not less. This RFC's `000900`–`000999` reservation is not confirmed clear of that same unresolved branch. As with RFC-0016: no real collision exists in committed data (RFC-0011 was never merged), so this reservation stands as proposed, but only a maintainer can confirm the full scope of what RFC-0011 claims before any of `000700`–`001099` (including this RFC's `000900`–`000999`) is treated as settled.

## Files affected

| File | Change | Status |
|---|---|---|
| `GOVERNANCE.md` | `CRITICAL-AI-LITERACY` row added to the Competency ID blocks table, with the RFC-0011 numbering-risk flag carried forward | Proposed |
| `competencybase/schema/competency-record.schema.json` | Add `measuredBy` (optional) | Proposed |
| `competencybase/records/critical-ai-literacy-000900.yaml` … `-000905.yaml` | New — 6 `oe:Competency` entries | Proposed |
| `competencybase/README.md` | Describe the new framework honestly (author-draft, not yet reviewed; developmentalProgression bands below `13-16` are an unreviewed pedagogical translation) | Proposed |

## Review

- [ ] Domain editor approval (AI/CS Education, critical pedagogy)
- [ ] Maintainer approval (Dustin)
- [ ] **RFC-0011 numbering conflict must be resolved before this RFC's block reservation is treated as final** — carried forward from RFC-0016's own unresolved flag, not new to this RFC, but this RFC adds a second block (`000900`–`000999`) whose clearance depends on the same unresolved question.
- [ ] Whether the `developmentalProgression` K-2–9-12 pedagogical translation (not present in the source CAIL papers) should be reviewed by someone with K-12 AI-literacy curriculum expertise before this RFC's records move past `author-draft`.
