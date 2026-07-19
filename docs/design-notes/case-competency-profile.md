# Design note: profiling `oe:Competency` off CASE `CFItem`

**Status:** Informative — a pre-RFC design input, not itself a proposal. Does not touch spec §3/§11, so it does not need the `specification-amendment` process in [`../../proposals/TEMPLATE.md`](../../proposals/TEMPLATE.md). When this is mature enough to act on, it becomes an ordinary `content`-type RFC against `/proposals/`, per spec §11.2 and §12.

**Grounding:** spec `docs/oecb_specifications.md` §12 requires `oe:Competency` to be "profiled as an extension of CASE `CFItem`, not a novel structure." `ontologies/core_v1.yaml` line 138 carries the same note on the reserved `oe:Competency` class. The reference implementation is a separate repository, **[github.com/openevo-ccs/OpenCASE](https://github.com/openevo-ccs/OpenCASE)** (a fork of 1EdTech's official OpenCASE, Apache-2.0, TypeScript) — it is not vendored into or part of `conceptbase`. Everything below was checked directly against that repository as of 2026-07-19; it supersedes an earlier analysis that mistakenly assumed this code lived at `apps/opencase/` inside `conceptbase` itself.

## What actually exists in OpenCASE

- `apps/opencase/schemas/` contains the real, vendored CASE JSON Schemas for both versions: `case-v1p1-cfpackage.json`, `-cfdocument.json`, `-cfitem.json`, `-cfassociation.json`, and the same four for `v1p0`, plus an `official/` subdirectory.
- `apps/opencase/docs/FRAMEWORK_EDITOR_BACKEND_INTEGRATION.md` documents a real integration pattern: a browser-based visual editor (React + react-flow) that persists frameworks to OpenCASE over REST, authenticated via Keycloak/JWT with a client-per-tenant model. It maps `CFDocument` → framework, `CFItem` → nodes, `CFAssociation` → edges, and recommends `POST .../CFPackages` for full-bundle publishes or targeted `PUT`s for individual entities.
- The `CFAssociation` schema's key fields, confirmed directly: `sourcedId` (UUID), `uri`, `originNodeURI` / `destinationNodeURI` (each a `LinkGenURI` object), optional `CFDocumentURI`, required `lastChangeDateTime`, optional `sequenceNumber`, optional `extensions`. (Correction to an earlier draft of this analysis: the field is `destinationNodeURI`, not `destNodeURI`, and the association's own identifier field is `sourcedId`, not `identifier`.)
- `associationType` is documented as an **extensible enumerated vocabulary**, not a closed enum. The values actually present in the schema: `isChildOf`, `isParentOf`, `isPartOf`, `hasPart`, `isPeerOf`, `precedes`, `isRelatedTo`, `exactMatchOf`, `replacedBy`, `replaces`, `exemplar`, `isExemplarOf`. (Correction: an earlier draft additionally listed `hasSkillLevel` and `isTranslationOf` — these were not found in the actual schema and should not be assumed present without a direct re-check before anything depends on them.)
- A license catalog resembling `defaultLicenses.ts` could **not** be confirmed — GitHub code search on this repo required authentication this session couldn't provide. Treat "what license options OpenCASE actually offers" as unverified until someone with direct repo access confirms it; don't build a license-compatibility gate against an assumed list.

## Proposed profile sketch

**Identifier bridging.** An `oe:Competency` minted from a CFItem should treat the OpenCASE-assigned CFItem `uri` (not `sourcedId` alone, since `uri` is the network-resolvable form) as authoritative provenance, retained on the OECB side as a required field (e.g. `oe:sourceCFItemURI`) rather than discarded. The OECB side still mints its own permanent `OE-COMPETENCY-######` identifier at `accepted`+, per the existing identifier scheme in `schemas/common.defs.yaml` — this is a new entity in OECB's own permanent space, provenance-linked to, not aliased from, the CASE source.

**Association-type mapping.** Using the verified enum above, not the earlier unverified one:

| CASE `associationType` | Candidate OECB use |
|---|---|
| `isChildOf` / `isPartOf` / `hasPart` / `isParentOf` | Strand/SubStrand nesting (`oe:hasSubStrand`) |
| `precedes` | Progression ordering within an LPM |
| `exactMatchOf` | Phase 2 alignment `matchType` ≈ `skos:exactMatch` |
| `isRelatedTo` | Phase 2 alignment `matchType` ≈ `skos:related` |
| `replacedBy` / `replaces` | Existing `supersededBy` deprecation pointer (and its inverse) |
| `exemplar` / `isExemplarOf` | No current OECB analogue — flag as open, don't force a mapping |

This table is a first draft for the eventual RFC to review, not a ratified mapping — per spec §9, OECB's SKOS-based alignment model carries formal semantics (transitivity, symmetry) that CASE's flat association vocabulary doesn't promise. Each row needs to be checked against actual behavior, not just label similarity, before being written into a schema.

**License-compatibility gate.** `conceptbase` is CC-BY-4.0 (Design Principle 2, FAIR by construction). Before any CASE-authored framework content is pulled toward a future `competencies/` directory, its `licenseURI` must be checked against CC0/CC-BY(-SA) compatibility. This check should be mechanical (part of import tooling), not a manual judgment call — but it can't be specified precisely until OpenCASE's actual license catalog is confirmed (see above).

**Operational weight — explicitly deferred.** OpenCASE requires Docker, Keycloak/OIDC, per-tenant JWT auth, and stateful file storage — materially heavier than `conceptbase`'s Git+YAML+build-step model. Whether Phase 4 assumes a shared reference deployment, requires each dependent repo to self-host, or treats OpenCASE as schema-source-only with no runtime dependency, is a real decision that belongs in a Phase 4 RFC, not something to inherit by default from convenience.

**Data protection note.** The Keycloak/OIDC layer implies real user accounts and personal claims tied to authored frameworks. If a future RFC ever proposes a *shared* OpenCASE deployment rather than "each dependent repo self-hosts," that crosses from static-registry into data-processing-service territory and deserves a deliberate decision, not an inherited default.

## Not in scope here

Spec §12 pairs CASE with `Competency` only. `Evidence` profiles off xAPI and `Assessment`/`Practice` have no standard assignment yet (per the reserved-class notes in `ontologies/core_v1.yaml`). Reaching for CFItem structures to model those, just because OpenCASE's tooling is already being examined, would need its own Design-Principle-4 justification independent of this note.

## Next step

When ready to formalize: open a `content`-type RFC against `/proposals/` using [`TEMPLATE.md`](../../proposals/TEMPLATE.md), scoped to the CFItem-extension profile and identifier-bridging rule above. Confirm the license catalog directly against the OpenCASE repo before that RFC asserts anything about it.
