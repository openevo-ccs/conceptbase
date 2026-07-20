# RFC-0005: Citation-only `oe:Competency` entries for license-restricted CASE sources

**Type:** `content`
**Status:** `proposed`
**Author(s):** OpenEvo ConceptBase maintainers
**Date:** 2026-07-20

## Motivation

The first CASE-sourced state-curriculum pilot (Virginia, via Standards Satchel) surfaced a case `schemas/competency.schema.yaml` cannot currently represent: a CASE `CFDocument` whose `licenseURI` does not permit republishing `CFItem.fullStatement` verbatim, but whose existence, code, and structure (`humanCodingScheme`, `CFItemType`, associations to other items) are still worth representing so the ConceptBase can model *that a standard exists and how it relates to others* without reproducing its protected expression.

Concretely: three of the four VA `CFDocument`s carry a bare "Copyright © 2023 by the Virginia Department of Education" notice with no redistribution grant, and the fourth (`Virginia Computer Science Standards of Learning (2024)`) states outright "In-app and alignment use only; no redistribution or republication." `oe:Competency`'s current schema requires `statement` unconditionally — there is no way to author a spec-conformant entry for a source like this without either copying restricted text (not permitted) or violating the schema (not conformant).

This is not a gap in CASE itself — CASE's information model assumes a live, federated Provider API where `licenseURI` is a terms-of-use signal to API consumers, not an instruction to omit fields from a *redistributed copy* of the data. OECB's model is structurally different: it publishes copies of ingested data as static files in a public git repository, which is exactly the kind of redistribution some source licenses (like VA's) prohibit. This RFC addresses that redistribution-vs-live-API distinction, which no existing standard (CASE, SKOS, IEEE LOM, xAPI, schema.org) resolves on OECB's behalf. See [`docs/design-notes/state-standards-licensing.md`](../docs/design-notes/state-standards-licensing.md) for the full fair-use/state-copyright reasoning behind why `citationOnly` defaults conservative rather than relying on a fair-use argument.

## Proposed change

Add an optional `citationOnly` boolean to `schemas/competency.schema.yaml`. When `true`:

- `statement` and `abbreviatedStatement` **MUST NOT** be populated with the source's protected text (the schema does not forbid the fields outright, since a citation-only entry may still carry an OECB-authored, non-verbatim gloss, but it must not be a reproduction of the license-restricted source statement).
- `humanCodingScheme` and `provenance` (with its existing required `sourceCFItemId`/`sourceCFItemURI`) become required instead of `statement`, so the entry is still anchored to a real, resolvable source — just not by copying its expression.

When `citationOnly` is absent or `false`, behavior is unchanged from the existing schema: `statement` remains required.

This is additive and backward-compatible: every existing entry in `BIO-CORE`/`OE-INTERDISCIPLINARY` has no `citationOnly` field, so it continues to require `statement` exactly as before.

## Relations

- Extends `oe:Competency` (RFC-0002's CASE `CFItem` profile) — does not redefine any existing property.
- Depends on `provenance`'s existing `required: [sourceCFItemId, sourceCFItemURI]` (already in the schema) to anchor citation-only entries to their source.
- Works alongside the license-compliance gate (`scripts/case_license_gate.py`) that classifies a `CFDocument.licenseURI` and determines whether a given source's entries may be ingested with `statement` populated, as `citationOnly`, or not at all pending human review.

## Standards justification

Not a novel structure duplicating an existing standard — see Motivation: this addresses OECB's redistribution model, which CASE's live-API assumption doesn't cover. `citationOnly` is a thin OECB-side flag, not a new competency/statement model.

## ID block reservation

Not applicable — no new vocabulary or LPM; this changes the schema all vocabularies validate against.

## Files affected

| File | Change | Status |
|---|---|---|
| `schemas/competency.schema.yaml` | Add `citationOnly` property; replace unconditional `statement` requirement with `if/then/else` branching on `citationOnly`; version 1.0.1 → 1.1.0 (MINOR — additive, per `GOVERNANCE.md`) | Done, 2026-07-20 |
| `scripts/case_license_gate.py` | New — classifies `CFDocument.licenseURI` for ingestion eligibility | Done, 2026-07-20 |
| `scripts/case_to_competency_prototype.py` | New — maps `CFItem`/`CFAssociation` to draft `oe:Competency` YAML, respecting the gate's verdict | Done, 2026-07-20 |

## Review

- [ ] Domain editor approval
- [ ] Maintainer approval
