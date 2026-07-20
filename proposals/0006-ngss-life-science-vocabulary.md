# RFC-0006: Add `NGSS-LIFE-SCIENCE-v1.0.0` vocabulary

**Type:** `content`
**Status:** `proposed`
**Author(s):** OpenEvo ConceptBase maintainers
**Date:** 2026-07-20

## Motivation

Per the ConceptBase ecosystem-population plan (canonical representations of official curriculum standards across biology, social sciences/humanities, and computer science), the Next Generation Science Standards' Life Science domain is the first "official framework" source cleared for **full statement-text inclusion** without the RFC-0005 `citationOnly` fallback. Unlike the Virginia CASE Satchel finding (see `docs/design-notes/state-standards-licensing.md`), NGSS's own stated policy is unambiguous and permissive: "states, districts, schools, teachers and non-profit education entities may copy, reproduce, alter, adapt, edit, delete and rearrange any and all parts of the NGSS... without permission" (nextgenscience.org, "NGSS Trademarks and Copyright"). OpenEvo CCS Lab is a non-profit research initiative, so this grant applies directly.

## Proposed change

Add `vocabularies/NGSS-LIFE-SCIENCE-v1.0.0.yaml`: 53 `oe:Competency` entries covering NGSS topics LS1 (Structure and Function), LS2 (Ecosystems), LS3 (Heredity), LS4 (Biological Evolution), at both Middle School and High School bands — 8 topic-level parent entries plus 45 individual performance expectations, transcribed from the official DCI arrangement pages at `nextgenscience.org`.

This is the **first vocabulary authored as `oe:Competency` rather than `oe:Concept`** (contrast `BIO-CORE`/`OE-INTERDISCIPLINARY`, both concept-based). Structural precedent set here for future competency-based vocabularies:
- Top-level key is `competencies:`, not `concepts:` — `meta.conformsTo` points at `OE-SCHEMA-COMPETENCY-v1.1.0` accordingly.
- `provenance` is omitted on every entry, per the schema's existing allowance for natively-authored (non-CASE-sourced) competencies — these were transcribed from NGSS's public HTML pages, not pulled via a CASE Provider API, so there is no `CFItem.sourcedId`/`uri` to anchor to.
- Each performance expectation's `humanCodingScheme` carries its real NGSS code (e.g. `MS-LS1-1`); each topic (e.g. `MS-LS1`) is a separate parent entry, with child PEs linked via `relations.skos:broader`, mirroring RFC-0002's `isChildOf`/`isPartOf` → `skos:broader` mapping even though this source isn't CASE-formatted.
- Every entry carries a `citations` entry (NGSS Lead States, 2013 + the specific `nextgenscience.org` DCI arrangement page URL it was transcribed from).

## Relations

- Uses `oe:Competency` (RFC-0002) without extending or modifying the schema.
- Does not touch RFC-0005's `citationOnly` mechanism — not applicable here, since the source license permits full-text inclusion.
- Sets the `NGSS-LIFE-SCIENCE` competency block referenced in `GOVERNANCE.md`'s new Competency ID blocks table (added by this RFC, since RFC-0002 never populated it).
- No alignment records yet to `BIO-CORE`/`OE-INTERDISCIPLINARY` — left for a follow-up Phase 2 alignment RFC once this vocabulary is accepted.

## Standards justification

Not a novel structure — a direct, unmodified use of `oe:Competency` per RFC-0002's CASE `CFItem` profile. The topic → performance-expectation hierarchy uses the same `skos:broader` relation already established for CASE-sourced competencies.

## ID block reservation

Reserves `OE-COMPETENCY-000100`–`000199` for `NGSS-LIFE-SCIENCE`, per the new Competency ID blocks table added to `GOVERNANCE.md` by this RFC. 53 of 100 slots used (`000100`–`000152`), leaving room for later NGSS Life Science additions (e.g. elementary-band PEs, or the remaining DCI sub-ideas) without a new block.

## Files affected

| File | Change | Status |
|---|---|---|
| `GOVERNANCE.md` | New "Competency ID blocks" subsection under Identifier Block Allocation | Done, 2026-07-20 |
| `vocabularies/NGSS-LIFE-SCIENCE-v1.0.0.yaml` | New — 53 `oe:Competency` entries | Done, 2026-07-20 |

## Review

- [ ] Domain editor approval (biology/life-science domain)
- [ ] Maintainer approval
