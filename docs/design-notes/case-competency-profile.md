# Design note: profiling `oe:Competency` off CASE `CFItem`

**Status:** Informative — a pre-RFC design input, not itself a proposal. Does not touch spec §3/§11, so it does not need the `specification-amendment` process. See [`../../proposals/0002-competency-case-profile.md`](../../proposals/0002-competency-case-profile.md) for the formal `content`-type RFC drafted from this note.

**Grounding:** spec `docs/oecb_specifications.md` §12 requires `oe:Competency` to be "profiled as an extension of CASE `CFItem`, not a novel structure." `ontologies/core_v1.yaml` line 138 carries the same note on the reserved `oe:Competency` class. The reference implementation, **[github.com/openevo-ccs/OpenCASE](https://github.com/openevo-ccs/OpenCASE)** (a fork of 1EdTech's official OpenCASE, Apache-2.0, TypeScript, same `openevo-ccs` GitHub org as this repo), is now cloned locally at `D:\dev\openevo-ccs-lab\OpenCASE`. Everything below was verified directly against that checkout on 2026-07-19, and corrects two material errors in an earlier GitHub-only-sourced draft of this note (the `associationType` vocabulary and the license catalog, both flagged inline below).

## The CASE data model, as actually implemented

`apps/opencase/schemas/` holds two tiers of schema per CASE version (`v1p0`, `v1p1`):
- **Lightweight app schemas** (`case-v1p1-cfitem.json`, `-cfassociation.json`, `-cfdocument.json`, `-cfpackage.json`) — what OpenCASE actually loads to validate its own REST endpoints. Looser than the spec: `associationType` is typed as an unconstrained string, not enforced against any enum.
- **`official/case-v1p1-cfpackage.json`** — the unmodified IMS-authored schema (908 lines), the real interoperability target. It enforces `associationType` as a closed `oneOf`: one of a 10-value enum, or an `ext:`-prefixed custom string.

**CFItem** (required: `sourcedId` [UUID], `uri`, `fullStatement`, `lastChangeDateTime`, `CFDocumentURI` [a `LinkGenURI`: `title`+`identifier`+`uri`, optional `targetType` defaulting to `"CASE"`]). Optional: `humanCodingScheme`, `abbreviatedStatement`, `alternativeLabel`, `CFItemType`/`CFItemTypeURI`, `conceptKeywords`/`conceptKeywordsURI`, `notes`, `language`, `educationLevel` (string array), `licenseURI`, `statusStartDate`/`statusEndDate`, and — new in v1.1 only — `subject`/`subjectURI` and `extensions`.

**CFAssociation** (required: `sourcedId`, `uri`, `associationType`, `originNodeURI`, `destinationNodeURI`, `lastChangeDateTime`; optional: `CFDocumentURI`, `sequenceNumber`, `extensions`).

**`associationType` — corrected.** The real, enforced CASE v1.1 vocabulary (per `official/case-v1p1-cfpackage.json` and the schemas' own `README.md`, which agree with each other) is:

```
isChildOf, isPeerOf, isPartOf, exactMatchOf, precedes,
isRelatedTo, replacedBy, exemplar, hasSkillLevel, isTranslationOf
```

plus a `ext:[A-Za-z0-9._-]+` pattern for custom types. An earlier draft of this note listed a different 12-value set (`isChildOf, isParentOf, isPartOf, hasPart, isPeerOf, precedes, isRelatedTo, exactMatchOf, replacedBy, replaces, exemplar, isExemplarOf`) — that list is real, but it's stale CASE-1.0-era *description text* left inside the lightweight `case-v1p1-cfassociation.json` file, not an enforced constraint and not the current spec vocabulary. Use the 10-value list above for interoperability; don't assume OpenCASE's own API will reject the older values, since its live validator doesn't check the enum at all.

## Real API and auth model

Documented in `apps/opencase/docs/FRAMEWORK_EDITOR_BACKEND_INTEGRATION.md`:
- Auth: Keycloak-issued JWT (RS256), Authorization Code + PKCE for browser clients, **client-per-tenant** (`tenant-<tenantId>` Keycloak client), roles carried in `resource_access[clientId].roles`.
- **Provider API** (`/ims/case/v1p1/*`, also `v1p0`) — read-only, spec-aligned. **Management API** (`/management/*`) — non-standard writes/admin (`POST`/`PUT`/`DELETE`), always creates a new immutable version file on disk (`data/tenants/<tenantId>/v1p1/frameworks/<docId>/<docId>_v0001.json`, etc.).
- Publishing: `POST /management/tenants/{tenantId}/ims/case/v1p1/CFPackages` (full bundle, new revision) or targeted `PUT .../{CFDocuments|CFItems|CFAssociations}/{id}` (existing entities only — there's no `POST` for individual new items/associations outside a bundle).
- Unauthenticated `GET /public/tenant-lookup?email=...` always returns `202`, body optionally carrying `{ tenantId }` — deliberately silent on no-match to prevent enumeration.

**Recommendation: any OECB integration point should be the read-only Provider API only.** OECB never needs write access to OpenCASE — it consumes published frameworks, it doesn't author them there.

## License catalog — corrected, now confirmed

`apps/opencase/src/domain/case/seed/defaultLicenses.ts` seeds exactly 5 `CFLicense` records per tenant, attached to a framework via `CFDocument.licenseURI` (a link object referencing the `CFLicense` resource — never inline text):

| # | Title | URI | CC-BY-4.0 compatible? |
|---|---|---|---|
| 1 | Public Domain (CC0 1.0) | `creativecommons.org/publicdomain/zero/1.0/` | Yes — more permissive |
| 2 | Open — Credit Required (CC BY 4.0) | `creativecommons.org/licenses/by/4.0/` | Yes — exact match |
| 3 | Educational Use (CC BY-NC-SA 4.0) | `creativecommons.org/licenses/by-nc-sa/4.0/` | **No** — NC + ShareAlike conflict |
| 4 | View and Share Only (CC BY-NC-ND 4.0) | `creativecommons.org/licenses/by-nc-nd/4.0/` | **No** — NC + NoDerivatives |
| 5 | Private — All Rights Reserved | (none) | **No** |

A companion `PUBLIC_LICENSE_IDS` set marks #1–#3 as granting unauthenticated read access; that's an OpenCASE access-control concern, orthogonal to OECB's redistribution question — #3 is publicly readable but still not redistributable as CC-BY. Any future import tooling's license-compatibility gate should mechanically reject #3/#4/#5, not treat "publicly readable" as a proxy for "reusable."

## Proposed profile sketch

**Identifier bridging.** An `oe:Competency` minted from a CFItem retains its CASE origin as provenance — `CFItem.uri` (network-resolvable) and `CFItem.sourcedId` (UUID) — without reusing either as the OECB primary key. OECB mints its own permanent `OE-COMPETENCY-######` at `accepted`+, per the identifier scheme in `schemas/common.defs.yaml`.

**Association-type mapping**, using the corrected 10-value vocabulary:

| CASE `associationType` | Candidate OECB use |
|---|---|
| `isChildOf` / `isPartOf` | Strand/SubStrand nesting (`oe:hasSubStrand`) |
| `precedes` | Progression ordering within an LPM |
| `exactMatchOf` | Phase 2 alignment `matchType` ≈ `skos:exactMatch` |
| `isRelatedTo` | Phase 2 alignment `matchType` ≈ `skos:related` |
| `replacedBy` | Existing `supersededBy` deprecation pointer |
| `isPeerOf` | No clean OECB analogue yet — closest is `skos:related`, but peer-ness is symmetric-by-name only; needs its own check |
| `exemplar` / `hasSkillLevel` / `isTranslationOf` | No current OECB analogue — flag as open, don't force a mapping |

Per spec §9, OECB's SKOS-based alignment model carries formal semantics (transitivity, symmetry) that CASE's association vocabulary doesn't promise — each row above needs behavioral verification, not just label similarity, before being encoded into a schema.

**Reusable reference implementation.** `apps/editor/src/application/framework/mappers/case/snapshotToCaseDtos.ts` (and sibling files in that directory) already implement a clean, layered domain→CASE mapping (`domain/framework/model` → `application/framework` commands/mappers → `infrastructure/caseApi`). A future OECB importer going the other direction (CASE→OECB) should mirror that layering rather than inventing its own — it's a proven structural template, even though building the importer itself is out of scope for now.

**Operational weight — confirmed, still deferred.** OpenCASE runs 5 Docker services (Traefik, Keycloak, dev-only Mailpit, the `opencase` API, the `editor` frontend) with **no database** — all framework data persists as versioned files under `apps/opencase/data/`. Keycloak is a hard dependency in every documented mode; there's no lightweight/no-auth fallback. The lightest real footprint is `apps/opencase/docker-compose.yml`'s standalone variant (just `case-provider` + Keycloak, no Traefik/editor/Mailpit) — still requires Keycloak, but drops the other three services. HTTPS deployment needs a real domain (Let's Encrypt); the HTTP dev path runs on bare `localhost`. Whether Phase 4 assumes a shared reference deployment, per-repo self-hosting, or schema-source-only (no runtime dependency at all) remains a decision for an actual Phase 4 RFC.

**Data protection note.** The Keycloak/OIDC layer implies real user accounts and personal claims tied to authored frameworks. A future RFC proposing a *shared* OpenCASE deployment (rather than "each dependent repo self-hosts") crosses from static-registry into data-processing-service territory and deserves a deliberate decision, not an inherited default.

## Not in scope here

Spec §12 pairs CASE with `Competency` only. `Evidence` profiles off xAPI and `Assessment`/`Practice` have no standard assignment yet (per the reserved-class notes in `ontologies/core_v1.yaml`). Reaching for CFItem structures to model those, just because OpenCASE's tooling is already being examined, would need its own Design-Principle-4 justification independent of this note.
