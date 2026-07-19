# RFC-0002: `oe:Competency` as a profile of CASE `CFItem`

**Type:** `content`
**Status:** `accepted`
**Author(s):** OpenEvo ConceptBase maintainers
**Date:** 2026-07-19
**Accepted:** 2026-07-19. Maintainers chose to promote `oe:Competency` immediately rather than wait for Phase 4 — see "Phase gating" below, superseding that section's original deferral. Implemented the same day: `ontologies/core_v1.yaml` (v1.3.0), `schemas/common.defs.yaml` (v1.3.0, `competencyId`), `schemas/competency.schema.yaml` (new, `stable`, v1.0.0), `docs/oecb_specifications.md` §12.

## Motivation

Spec §12 mandates that `oe:Competency` "MUST be profiled as an extension of CASE `CFItem`, not a novel structure," and `ontologies/core_v1.yaml` line 138 carries the same commitment on the reserved class. `oe:Competency` is reserved for **Phase 4**; this RFC is prepared as groundwork ahead of that schedule so the profile exists in reviewable form before it's needed, not as a request to activate the class now (see "Phase gating," below).

The reference CASE implementation, [`github.com/openevo-ccs/OpenCASE`](https://github.com/openevo-ccs/OpenCASE), is cloned locally at `D:\dev\openevo-ccs-lab\OpenCASE`. This RFC's field mappings, the `associationType` vocabulary, and the license catalog are all verified directly against that checkout (2026-07-19), not assumed from the CASE spec in the abstract. See the companion design note, [`../docs/design-notes/case-competency-profile.md`](../docs/design-notes/case-competency-profile.md), for the full investigation this RFC distills.

## Proposed change

### CFItem-extension profile

`oe:Competency` properties, mapped to the CASE `CFItem` fields verified in `apps/opencase/schemas/case-v1p1-cfitem.json` / `official/case-v1p1-cfpackage.json`:

| `oe:Competency` property | Type / `$ref` | Source CASE field | Notes |
|---|---|---|---|
| `id` | `common.defs.yaml#/$defs/competencyId` (new def) | — | OECB-minted, `OE-COMPETENCY-######` |
| `type` | `const: "oe:Competency"` | — | |
| `status` | `common.defs.yaml#/$defs/status` | — | OECB lifecycle; CASE has no equivalent enum (see below) |
| `version` | `common.defs.yaml#/$defs/semver` | — | |
| `statement` | `common.defs.yaml#/$defs/localizedString` | `fullStatement` | Localized on the OECB side; CASE's is a single plain string |
| `abbreviatedStatement` | `common.defs.yaml#/$defs/localizedString`, optional | `abbreviatedStatement` | |
| `humanCodingScheme` | `string`, optional | `humanCodingScheme` | Not localized — a code, not prose |
| `competencyType` | `string`, optional | `CFItemType` | Free-form, mirroring CASE's own untyped `CFItemTypes` definitions |
| `educationLevel` | `array of string`, optional | `educationLevel` | |
| `conceptKeywords` | `array of string`, optional | `conceptKeywords` | |
| `relations` | object (see mapping table below) | derived from `CFAssociation` edges touching this item | |
| `provenance` | object, optional | — | See "Identifier bridging" |
| `citations` | `array of common.defs.yaml#/$defs/citation` | — | Existing OECB convention |
| `extensions` | `common.defs.yaml#/$defs/extensions` | `extensions` (v1.1) | |

Required: `id`, `type`, `status`, `version`, `statement`.

**Status mismatch, noted explicitly rather than papered over:** CASE's `CFItem` has no field equivalent to OECB's `proposed`/`accepted`/`stable`/`deprecated`/`superseded`/(pending RFC-0001) `retracted` lifecycle — only `statusStartDate`/`statusEndDate` (a validity window, not a review-state enum). A CASE-imported item does not arrive with an OECB status; it must be assigned one through the ordinary RFC process on the OECB side, same as any other new entity. Import tooling must not infer `accepted` from a CFItem's mere existence in a published CFPackage.

### Identifier bridging

`oe:Competency.provenance` (optional object, present only when a competency originates from a CASE source):

```yaml
provenance:
  sourceCFItemId: <CFItem.sourcedId, UUID>
  sourceCFItemURI: <CFItem.uri>
  sourceCFDocumentURI: <CFItem.CFDocumentURI.uri, optional>
```

The OECB `id` is always independently minted at `accepted`+ and is never aliased from or overwritten by a CASE identifier — CASE fields are retained purely as provenance. A competency authored natively in OECB (not imported) simply omits `provenance`.

### Association-type mapping

Verified CASE v1.1 `associationType` vocabulary (10 values + `ext:` extension mechanism — see design note for the correction this supersedes):

| CASE `associationType` | OECB relation | Confidence |
|---|---|---|
| `isChildOf` / `isPartOf` | `oe:hasSubStrand`-style nesting | High — matches existing Strand/SubStrand pattern |
| `precedes` | LPM progression ordering | High |
| `exactMatchOf` | Phase 2 alignment `matchType: skos:exactMatch` | Medium — needs §9 symmetry/transitivity check before encoding |
| `isRelatedTo` | Phase 2 alignment `matchType: skos:related` | Medium — same caveat |
| `replacedBy` | `supersededBy` | High |
| `isPeerOf` | No mapping yet | Low — "peer" is symmetric by name only; unverified |
| `exemplar` / `hasSkillLevel` / `isTranslationOf` | No mapping | Open — explicitly left unmapped rather than forced |

Per spec §9, OECB's SKOS-based alignment model carries formal semantics CASE's flat vocabulary doesn't guarantee. Rows marked Medium/Low/Open are not ready to encode into a validator and are listed here so reviewers can weigh in, not as settled decisions.

### License-compatibility gate

Verified against `apps/opencase/src/domain/case/seed/defaultLicenses.ts` (5 seeded `CFLicense` records, referenced from `CFDocument.licenseURI`):

| License | Compatible with OECB's CC-BY-4.0? |
|---|---|
| Public Domain (CC0 1.0) | Yes |
| Open — Credit Required (CC BY 4.0) | Yes — exact match |
| Educational Use (CC BY-NC-SA 4.0) | **No** |
| View and Share Only (CC BY-NC-ND 4.0) | **No** |
| Private — All Rights Reserved | **No** |

Rule for any future import tooling: resolve `CFDocument.licenseURI`, and reject the import outright if it resolves to the NC-SA, NC-ND, or All-Rights-Reserved entries. Note the seed data's `PUBLIC_LICENSE_IDS` marks NC-SA as publicly *readable* in OpenCASE's own access model — that is unrelated to redistributability and must not be used as a stand-in for this check.

### Integration boundary

OECB consumes OpenCASE's **read-only Provider API** (`/ims/case/v1p1/*`) only; it never writes to OpenCASE's Management API. The existing Explorer pattern — browse/annotate in the browser, `exportAlignmentDraftsYaml`/`exportNotesYaml` in `app/js/views/annotationsView.js` turn that work into downloadable YAML, then a human opens a PR — is the template for how CASE-sourced competency drafts should reach `conceptbase`: a generated YAML draft for review, never a live sync. **Building that importer is explicitly deferred to a later, separate RFC/PR** — this RFC defines the target shape it would produce, not the tool itself.

### Draft schema appendix (not yet merged into `schemas/`)

```yaml
# Proposed schemas/competency.schema.yaml — DRAFT, attached to RFC-0002, not live.
# Merging this file requires first adding `competencyId` to
# schemas/common.defs.yaml (pattern: ^OE-COMPETENCY-[0-9]{6}$), alongside
# the existing conceptId/lpmId/strandId/learningObjectId defs.

"$schema": "https://json-schema.org/draft/2020-12/schema"
"$id": "https://www.w3id.org/openevo/schemas/competency.schema.json"

meta:
  id: OE-SCHEMA-COMPETENCY
  version: 0.1.0
  status: proposed
  authors:
    - name: OpenEvo ConceptBase Maintainers
  license: CC-BY-4.0
  ontologyClass: oe:Competency
  phase: 4

type: object

properties:
  id:
    "$ref": "common.defs.yaml#/$defs/competencyId"
  type:
    const: "oe:Competency"
  status:
    "$ref": "common.defs.yaml#/$defs/status"
  version:
    "$ref": "common.defs.yaml#/$defs/semver"
  statement:
    "$ref": "common.defs.yaml#/$defs/localizedString"
  abbreviatedStatement:
    "$ref": "common.defs.yaml#/$defs/localizedString"
  humanCodingScheme:
    type: string
  competencyType:
    type: string
  educationLevel:
    type: array
    items: { type: string }
  conceptKeywords:
    type: array
    items: { type: string }
  relations:
    type: object
    properties:
      "skos:broader":
        type: array
        items: { "$ref": "common.defs.yaml#/$defs/competencyId" }
      "skos:related":
        type: array
        items: { "$ref": "common.defs.yaml#/$defs/competencyId" }
      precedes:
        type: array
        items: { "$ref": "common.defs.yaml#/$defs/competencyId" }
    additionalProperties: false
  provenance:
    type: object
    properties:
      sourceCFItemId:
        type: string
        pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"
      sourceCFItemURI:
        type: string
        format: uri
      sourceCFDocumentURI:
        type: string
        format: uri
    required: [sourceCFItemId, sourceCFItemURI]
    additionalProperties: false
  citations:
    type: array
    items:
      "$ref": "common.defs.yaml#/$defs/citation"
  extensions:
    "$ref": "common.defs.yaml#/$defs/extensions"

required:
  - id
  - type
  - status
  - version
  - statement

additionalProperties: false
```

## Relations

- Does not modify `ontologies/core_v1.yaml`'s 5 core classes or the promotion status of any reserved class.
- Reuses `schemas/common.defs.yaml` `$defs` (`status`, `semver`, `localizedString`, `citation`, `extensions`) the same way `concept.schema.yaml`/`strand.schema.yaml` do — plus one new def this RFC proposes adding, `competencyId`.
- `relations.skos:broader`/`skos:related` follow the exact pattern established in `schemas/concept.schema.yaml`.

## Standards justification

Per spec §3 item 4 / §12: this profiles CASE (1EdTech) directly, as mandated, rather than inventing a novel competency structure. No new standard is being reinvented.

## Phase gating

~~`oe:Competency` remains `reserved` (Phase 4) ... Promotion is a separate, later decision.~~ **Superseded 2026-07-19:** on accepting this RFC, maintainers deliberately chose to promote `oe:Competency` out of `reserved` immediately rather than wait for Phase 4 to formally begin — a MINOR version bump (`ontologies/core_v1.yaml` v1.2.0 → v1.3.0), consistent with that file's own header comment on promoting reserved classes. This RFC's original caution (prepare the profile now, decide promotion later) was satisfied by the maintainer team's explicit, informed decision to skip the wait rather than by default.

## Files affected

| File | Change | Status |
|---|---|---|
| `ontologies/core_v1.yaml` | Moved `oe:Competency` from `reserved` into `classes`, per its existing promotion note | Done, 2026-07-19 (v1.3.0) |
| `schemas/common.defs.yaml` | Added `competencyId` `$def` (`^OE-COMPETENCY-[0-9]{6}$`), alongside `conceptId`/`lpmId`/`strandId`/`learningObjectId` | Done, 2026-07-19 (v1.3.0) |
| `schemas/competency.schema.yaml` | New file — promoted from this RFC's draft appendix, `stable`, v1.0.0 | Done, 2026-07-19 |
| `docs/oecb_specifications.md` §12 | Marked the `oe:Competency`/CASE mapping fulfilled, referencing this RFC | Done, 2026-07-19 |

## Review

- [x] Domain editor approval
- [x] Maintainer approval — maintainer team consensus, 2026-07-19, including the decision to promote immediately rather than defer to Phase 4
- [x] License-compatibility rule and `associationType` table confirmed against `D:\dev\openevo-ccs-lab\OpenCASE` directly (local checkout, 2026-07-19) before this RFC was drafted
