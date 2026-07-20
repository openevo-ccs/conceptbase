# RFC-0008: Extend `alignmentConceptRef` to support `OE-COMPETENCY-######`

**Type:** `content`
**Status:** `proposed`
**Author(s):** OpenEvo ConceptBase maintainers
**Date:** 2026-07-20

## Motivation

Drafting the first alignment records between `OE-INTERDISCIPLINARY` concepts and the newly-added `NGSS-LIFE-SCIENCE`/`AI4K12` competency vocabularies (RFC-0006, RFC-0007) surfaced a schema gap: `schemas/common.defs.yaml`'s `alignmentConceptRef` pattern is hardcoded to `OE-CONCEPT-[0-9]{6}` only —

```
^[A-Z0-9\-]+-v[0-9]+\.[0-9]+\.[0-9]+:OE-CONCEPT-[0-9]{6}$
```

— because Phase 2's alignment mechanism (spec §9) was designed when only `oe:Concept`-based vocabularies existed. It cannot validate a reference to an `oe:Competency` entry at all, which blocks every concept-to-competency alignment the ecosystem-population plan calls for (e.g. aligning `OE-INTERDISCIPLINARY`'s Selection concept to a specific NGSS performance expectation).

## Proposed change

Widen the pattern to accept either identifier shape:

- **Before:** `^[A-Z0-9\-]+-v[0-9]+\.[0-9]+\.[0-9]+:OE-CONCEPT-[0-9]{6}$`
- **After:** `^[A-Z0-9\-]+-v[0-9]+\.[0-9]+\.[0-9]+:OE-(CONCEPT|COMPETENCY)-[0-9]{6}$`

No other change to the Alignment schema (`schemas/alignment.schema.yaml`) — `subject`/`object` already accept any `alignmentConceptRef`-shaped string on either side, so this single regex change is sufficient to permit concept↔competency, competency↔competency, and the existing concept↔concept alignments, without a `matchType` or structural change.

Drafting the alignment records also surfaced a second, related gap: `scripts/build_registry.py` (RFC-0003) only ever processed a vocabulary's `concepts:` key — `oe:Competency`-based vocabularies use `competencies:` (RFC-0006), so their entries were never written to `registry/` at all, despite `common.defs.yaml`'s `competencyId` doc-comment already promising `https://www.w3id.org/openevo/competency/{id}` resolves. Fixed alongside this RFC: `build_registry.py` now also emits `registry/competency/{id}.json`, and `w3id-submission/openevo/.htaccess`/`readme.md` gained the corresponding `^competency/...` redirect rule.

**Note:** this `.htaccess` change lands *after* the namespace registration PR ([perma-id/w3id.org#6389](https://github.com/perma-id/w3id.org/pull/6389)) was already opened — that PR's `.htaccess` is now one rule behind this repo's copy and will need a follow-up commit/update before or after merge.

## Relations

- Amends `schemas/common.defs.yaml#/$defs/alignmentConceptRef` only.
- Unblocks `OE-ALIGN-000003`–`000005` (this RFC's companion alignment records, see below).
- Does not touch `oe:Competency` (RFC-0002/0005) or `oe:Concept` themselves.

## Standards justification

Not a novel structure — SKOS's own alignment relations (`skos:closeMatch`, etc.) are already discipline-agnostic about what kind of resource they connect; this just lets OECB's own identifier-shape validation catch up to that generality.

## ID block reservation

Not applicable — no new vocabulary or LPM.

## Files affected

| File | Change | Status |
|---|---|---|
| `schemas/common.defs.yaml` | `alignmentConceptRef` pattern widened; version 1.3.1 → 1.4.0 (MINOR, additive) | Done, 2026-07-20 |
| `alignments/OE-ALIGN-000003.yaml`, `OE-ALIGN-000004.yaml`, `OE-ALIGN-000005.yaml` | New — first concept↔competency alignments, see companion rationale in each file | Done, 2026-07-20 |
| `scripts/build_registry.py` | Added `build_competencies()`; `registry/competency/*.json` now generated | Done, 2026-07-20 |
| `w3id-submission/openevo/.htaccess`, `readme.md` | Added `^competency/...` redirect rule and resolved-sub-path table row | Done, 2026-07-20 — **not yet reflected in the already-open [perma-id/w3id.org#6389](https://github.com/perma-id/w3id.org/pull/6389)** |
| `registry/competency/*.json` | New (generated) — one per `oe:Competency` entry across all vocabularies | Done, 2026-07-20 |

## Review

- [ ] Domain editor approval
- [ ] Maintainer approval
