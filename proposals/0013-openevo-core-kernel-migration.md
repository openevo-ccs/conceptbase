# RFC-0013: Extract the shared kernel into `openevo-core`; narrow this repo's own governance scope

**Type:** `specification-amendment`

**Status:** `accepted`
**Author(s):** Claude (planning + execution), for Dustin Eirdosh
**Date:** 2026-07-26

## Motivation

ConceptBase was the OpenEvo CCS ecosystem's first mature, governed repo, built before any of its eight peer Foundational Repos (CompetencyBase, TeachingBase, ProjectBase, LiteratureBase, HumanBase, TheoryBase, QuestionBase, MethodsBase) existed even as stubs. Because of that founding-order accident, this repository ended up playing two roles at once: its own peer-equal entity registry (`oe:Concept`/`oe:LPM`/`oe:Strand`/`oe:LearningObject`/`oe:Competency` instances), and — via `GOVERNANCE.md`'s RFC process, `ontologies/core_v1.yaml`'s physical location, and the `www.w3id.org/openevo/` namespace root's redirect target — an accidental shared-kernel steward for every other Foundational Repo too. `lab_manager/docs/design-notes/ecosystem-base-graph-project-architecture-and-ontology-plan.md` §10 already committed the eight pending base-layer RFCs (`oe:Resource` promotion, `oe:Project`, `oe:Literature`, `oe:Person`+`oe:Group`, TheoryBase's whole node-type family, `oe:Question`, `oe:Method`) to be filed against `conceptbase/proposals/`, reviewed by this repo's own Maintainers and Domain editors — not by anyone representing the repo that would actually own the new class. This repo's own README stated the resulting topology plainly, until today: "OECB is the hub of a federated ecosystem." Full diagnosis: `lab_manager/docs/design-notes/ecosystem-shared-kernel-and-co-equal-governance-plan.md`.

Filed now, before those eight RFCs land here and the pattern cements further — see `openevo-core/proposals/0001-shared-kernel-founding-and-migration.md` for that repo's side of the same change.

## Proposed change

- The shared `oe:` upper ontology (`ontologies/core_v1.yaml`) moves to [`openevo-core`](https://github.com/openevo-ccs/openevo-core), unchanged in content. This repo's `ontologies/` directory keeps only a pointer (`ontologies/README.md`).
- The cross-repo RFC process, Roles table, and Identifier Block Allocation registry (`GOVERNANCE.md`) narrow to cover only this repo's own entity types; the generalized, cross-repo versions of the same now live in `openevo-core/GOVERNANCE.md`. This repo's existing block reservations (Concept, Strand, LPM, Competency) are copied there unchanged — not renumbered.
- `schemas/common.defs.yaml` is **not** moved — on inspection it is almost entirely this repo's own identifier patterns (`conceptId`, `lpmId`, `strandId`, `competencyId`, `alignmentId`, sandbox-tier counterparts, `alignmentConceptRef`, `conceptbaseManifest`), not generic cross-repo fragments. Moving it would break every `$ref` in this repo's own schema files for no real gain.
- The `www.w3id.org/openevo/` namespace root (`^$`), `/ontology`, and the cross-cutting `/schemas/*`/`/vocab/*` sub-paths now resolve against `openevo-core`. `/concept/{id}`, `/competency/{id}`, `/alignment/{id}`, `/lpm/{id}`, `/strand/{id}` are unchanged — already a peer-equal pattern, not the thing this RFC fixes. This repo's own `w3id-submission/openevo/` directory (the original RFC-0003 submission) is kept in place, unchanged, as historical record; the superseding four rules are staged in `openevo-core/w3id-submission/openevo/` instead.
- `README.md`, `GOVERNANCE.md`, `CONTRIBUTING.md`, and `docs/oecb_specifications.md` (§4.1, §6, §11) all carry inline amendment notes marking exactly what changed, per this repo's own established pattern for incorporating an RFC's effect into the living documents (e.g. RFC-0004's relicense note).

## Relations

Companion RFC to `openevo-core/proposals/0001-shared-kernel-founding-and-migration.md`, which is the fuller record of the rationale and target architecture. Does not invalidate or renumber `proposals/0001`–`0012` — all remain in place as historical record.

## Standards justification

Not a novel structure — see `openevo-core` RFC-0001's Standards justification section (the same `w3id.org`-internal and OBO-Foundry-style precedent for separating a shared root/kernel process from individual member repos' own governance).

## ID block reservation

Not applicable — no new vocabulary or LPM. Existing blocks are copied, not reallocated, into `openevo-core/GOVERNANCE.md`.

## Files affected

`ontologies/core_v1.yaml` (removed), `ontologies/README.md` (new pointer), `README.md`, `GOVERNANCE.md`, `CONTRIBUTING.md`, `docs/oecb_specifications.md` (§0.3, §4.1, §6, §11 amendment notes, version bump 0.5.0 → 0.6.0), this file.

## Review

- [x] Maintainer approval — Dustin Eirdosh, via direct instruction to execute the full migration in one pass (2026-07-26 session)
- [x] Explicit consensus recorded — this RFC's own drafting and execution *is* that record, per the same session, consistent with how this repo's other `specification-amendment` RFCs (e.g. RFC-0004) were handled
