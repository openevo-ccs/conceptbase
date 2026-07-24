# RFC-0013: Migrate eva4k12's 7 strands into `oe-interdisciplinary-k12` — one new trunk Strand plus enrichment of the existing 3

**Type:** `content`

**Status:** `proposed`
**Author(s):** OpenEvo ConceptBase maintainers (drafted in support of the `eva4k12` consolidation and archival plan — see `lab_manager/docs/design-notes/eva4k12-consolidation-and-grant-poc-strategy.md`)
**Date:** 2026-07-22

## Motivation

RFC-0012 migrated eva4k12's concept- and cross-cutting-theme layer but explicitly deferred the 7 strands, naming two real blockers: `oe-interdisciplinary-k12`'s Strand ID block (`OE-STRAND-000200`–`000299`) has only 6 unused top-level slots against 7 source strands, and — the more important issue — folding the content in well is a curriculum-design decision, not a mechanical one. This RFC resolves both, on explicit direction to pursue genuine synthesis ("move, merge, integrate, synthesize... into oe-interdisciplinary-k12", not just append content alongside it) rather than maximum ID consumption.

**A fact this RFC treats as decision-relevant, not just background**: eva4k12's own objectives dataset was 18% complete (28 of 163 marked `"status": "complete"`). Auditing per strand (not just in aggregate, which RFC-0012 didn't do): **HBEC and HumOr each have 4 complete, fully-authored, grade-banded objectives (K-2/3-5/6-8/9-12) — real curricular content.** DLCE, DAG, CCP, EvoGen, and PrimEvo have **zero** complete objectives; their entries in the objectives dataset are bare priority-tracking stubs with no planned-content text. What those five strands *do* have, fully authored, is `eva4K12_strands.json`'s per-strand `methodologicalLenses[]` (each with a real classroom-accessible description and a `gradeBandEntry`) and `coreConcepts[]`. This split — two strands with finished lesson-level content, five with finished *structural* content but no lessons — is the single fact that shaped every decision below.

## Proposed change

### 1. Mapping decision: one new trunk Strand, not two, not seven

Rather than mirror eva4k12's 7 strands as 7 new top-level Strands (would exceed the 6 free slots) or force all 7 into the existing 3 (would blur three already-coherent trunk strands into an undifferentiated pile), this RFC uses a mapping grounded in what eva4k12's own `horizontalStrandLinks` and `cctActivation` data already implied but never structurally built:

| Source strand | Disposition | Rationale |
|---|---|---|
| **HumOr, DAG, EvoGen, DLCE** | New trunk Strand **`OE-STRAND-000204`**, "Evidence for Human Origins: Genes, Fossils, and Languages" | Not a discipline grab-bag — organized around the epistemic thread `CCT.EVID-METHOD` (activated `full` on all four) and `CCT.DEEP-TIME` (`primary` on HumOr) already named: fossil, genomic, and linguistic evidence as independent lines converging on the same deep-time questions. eva4k12's own `horizontalStrandLinks` tag HumOr↔DAG, DAG↔DLCE, and HumOr↔DLCE all as `"convergent-evidence"`, and DAG↔DLCE's link description explicitly calls the Bronze Age Steppe expansion "the primary 9-12 integration point" — a strand-worthy idea eva4k12 named but never gave a home. |
| **HBEC** | Enrichment of existing `OE-STRAND-000203` (Culture, Technology, Collective Systems) | Direct thematic match — HBEC's own core concepts (Evolution, Feedback, System) and its role as "the primary curricular home for machine-culture coevolution" is exactly Strand 3's existing scope, not an adjacent one. |
| **CCP** | Enrichment of existing `OE-STRAND-000202` (Agency, Development, Niche Construction) | CCP's core concepts (Representation, Perspective, Agency) and its coreQuestion ("How do human minds develop across cultures?") map directly onto Strand 2's existing agency/development framing. |
| **PrimEvo** | Woven into Strands 1, 2, and the new 204 as reinforcement, **not given its own strand** | eva4k12's own `horizontalStrandLinks` describe PrimEvo as a `"comparative-baseline"` for three *other* strands (HumOr, HBEC, CCP) in three separate link descriptions — the source data itself treats PrimEvo as a comparative lens applied throughout, not a peer topic. Making it a standalone 8th strand would have been truer to eva4k12's file structure but false to what eva4k12's own relational data says about PrimEvo's actual role. |

This uses 1 of the 6 available top-level slots (`204`), leaving `205`–`209` open — deliberately conservative, consistent with not over-claiming completeness (see §2).

### 2. Content honesty: what's ported vs. newly authored, marked inline

- **HBEC's 4 complete objectives and HumOr's 4 complete objectives are ported near-verbatim** into the relevant SubStrand `performanceIndicators[]`, each tagged with a comment noting eva4k12 provenance and `status: complete`.
- **DAG/EvoGen/DLCE/PrimEvo/CCP contribute real material (their methodological lenses, placed at eva4k12's own specified `gradeBandEntry`) but no finished objectives existed to port.** Every performance indicator built from that material is explicitly prefixed `[Newly authored]` (or `[Method name, newly authored]`) in the source YAML and documented as such in this RFC — not silently presented as pre-existing eva4k12 content. This matters for how these strands get cited in any grant or public material: the *methods and concepts* are eva4k12's authored work; the *grade-band pedagogy built from them* is new, done as part of this migration.
- One case is flagship rather than incidental: `OE-STRAND-000244` (9-12 substrand of the new Strand 204)'s Bronze Age Steppe performance indicator is newly authored but directly operationalizes eva4k12's own explicit `horizontalStrandLinks` framing of that case as *the* 9-12 integration point between DAG and DLCE — a deliberate choice to finish work eva4k12 had already scoped rather than invent something unrelated.

### 3. Sensitive content: one authoritative placement, not duplicated

`CCT.ORIGIN-SCI`'s 9-12 content — the real, citation-backed treatment of scientific racism's history in evolutionary anthropology (Longino 1990, Marks 2017, Henrich 2016, Cajete 2000) — is placed in full, once, in `OE-STRAND-000234` (9-12 substrand of Strand 3), following `CCT.ORIGIN-SCI`'s own `strandActivation` data, which names HBEC ("science as cumulative culture; scientific institutions as cooperative structures") as its home. Its `sensitiveTopicFlags`/`sensitiveTopicNote` are carried forward verbatim via `extensions`, not paraphrased or softened. The theme's *other* named activation — CCP, "primary activation... WEIRD bias in research practice" — gets its own separate, non-sensitive performance indicator in `OE-STRAND-000224` (9-12 substrand of Strand 2), rather than a second copy of the sensitive material. Splitting by the source's own two named facets avoids both under-representing the theme and duplicating its most sensitive content across two strands where it could drift out of sync.

### 4. Cross-vocabulary and cross-CCT concept reinforcement

New Strand 204 and the enrichment substrands reference `EVA4K12-CONCEPTS` entries from RFC-0012 (`OE-CONCEPT-000300`–`000315`) as `reinforcing` concepts throughout, plus `OE-CONCEPT-000104` (Adaptation, BIO-CORE) in Strand 3's 3-5 substrand — the same reuse-not-duplicate discipline RFC-0012 established at the concept layer, now extended to the strand layer.

## Relations

- New Strand 204: `foundationalTo: [OE-STRAND-000202, OE-STRAND-000203]` (its evidence base underlies both agency/comparative-cognition content and culture/institutions content), `parallel: [OE-STRAND-000201]` (concurrent with, not prerequisite to, the general Selection/Variation strand).
- No change to `OE-SANDBOX-LPM-000003`'s (the de-personalized MPI-EVA capstone, RFC-0010 sandbox tier) own relations in this RFC — now that Strand 204 exists with real trunk content, a follow-up could deepen the capstone's `foundationalTo` to include it, but that's an independent, optional edit, not required by this migration.

## Standards justification

Direct use of `oe:Strand`/`oe:SubStrand` (existing schema, no changes) and the existing `extensions` escape hatch for the two fields with no schema home (`oe:eva4k12Consolidation` provenance note, `oe:sensitiveTopicFlags`/`oe:sensitiveTopicNote` — the same gap RFC-0012 flagged and, per that RFC, deliberately did not resolve with a schema change; still open as optional future work if this pattern recurs beyond eva4k12 migration).

## ID block reservation

Within `oe-interdisciplinary-k12`'s existing `OE-STRAND-000200`–`000299` block (no new block needed — this is capacity already reserved for this LPM per `GOVERNANCE.md`):

| Use | IDs |
|---|---|
| New top-level Strand | `OE-STRAND-000204` |
| New Strand's SubStrands (K-2/3-5/6-8/9-12) | `OE-STRAND-000241`–`000244` |
| Remaining unused top-level slots | `205`–`209` |

## Files affected

| File | Change |
|---|---|
| `GOVERNANCE.md` | Strand ID blocks table row for `oe-interdisciplinary-k12` updated (204 added, 205-209 noted unused) |
| `oe-interdisciplinary-k12/strands/strand-204-evidence-for-human-origins.yaml` | New — 1 top-level Strand + 4 SubStrands |
| `oe-interdisciplinary-k12/strands/strand-201-inheritance-variation-selection.yaml` | Enriched — 1 new performance indicator (PrimEvo comparative-method), 9-12 substrand |
| `oe-interdisciplinary-k12/strands/strand-202-agency-development-niche.yaml` | Enriched — 4 new performance indicators (CCP/PrimEvo) across all 4 grade bands |
| `oe-interdisciplinary-k12/strands/strand-203-culture-technology-collective.yaml` | Enriched — 5 new performance indicators (HBEC, all 4 grade bands, plus the CCT.ORIGIN-SCI sensitive-content entry) |
| `oe-interdisciplinary-k12/lpm.yaml` | New `strands[]` entry for `OE-STRAND-000204` |

All strand files re-validated against `schemas/strand.schema.yaml` (5/5 pass) after every edit in this RFC.

## Review

- [ ] Domain editor approval (same reviewers as RFC-0011/0012 — KoMet/lab_manager team)
- [ ] Maintainer approval
- [ ] **Explicit review of the CCT.ORIGIN-SCI placement and content (§3)** before this promotes past `status: proposed` — sensitive content warrants a second, deliberate read, not just schema validation
- [ ] Confirm the "PrimEvo gets no standalone strand" call (§1) — the one real judgment call in this RFC most likely to be second-guessed; reasoning is in §1's table, not just asserted
- [ ] Sign off on whether `205`–`209` should stay reserved for future ecosystem growth or be considered fully closed now that this migration is complete
