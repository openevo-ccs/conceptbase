# RFC-0001: Sandbox tier, two-speed review, and a `retracted` status

**Type:** `specification-amendment`
**Status:** `proposed`
**Author(s):** OpenEvo ConceptBase maintainers
**Date:** 2026-07-19

## Motivation

The "never delete" guarantee in spec §3 item 5 / §11.4 is the entire value proposition of the permanent registry tier — it is what lets an `OE-CONCEPT-######` ID function like a citable DOI. But that guarantee currently applies uniformly to *everything* that enters the core registry, including a first, tentative `proposed`-status draft. Two consequences follow from that:

1. There is no cheap way to try a concept or vocabulary entry in the open without immediately taking on a permanence commitment the contributor may not have intended yet.
2. Review ceremony (domain editor + maintainer, spec §11.2) is identical whether a change is a first `proposed` draft or the `proposed → accepted` promotion that actually activates the permanence guarantee — so the ceremony cost is front-loaded onto experimentation rather than reserved for the moment that needs it.

This is scoped narrowly to the core registry (`ontologies/`, `schemas/`, `vocabularies/`). Dependent repositories (LPMs, Strands, Collections, tools) are already independently governed per spec §1.1/§1.2/§10 and are free to delete or rewrite their own content today — nothing here changes that.

## Proposed change

Three additions, deliberately kept separate so none of them requires weakening §3 item 5 itself:

### 1. Sandbox/provisional tier (new spec §4.5)

A parallel identifier space for controlled-vocabulary concept entries, structurally distinct from the permanent one so the two can never be mistaken for each other:

- Pattern: `OE-SANDBOX-CONCEPT-[0-9]{6}`, versus the permanent `OE-CONCEPT-[0-9]{6}`.
- Governed by a separate, minimal status field (`active` | `archived` | `promoted`) — **not** the `proposed`/`accepted`/.../`retracted` lifecycle in §11.3. Sandbox entries never carry that field, so they are exempt from §11.4's never-delete rule by construction, not by a carved-out exception to that rule's text.
- Each entry carries a `created` date and an `expiresOn` date, set 12 months out at creation (Internet-Draft style). An entry not promoted before `expiresOn` is auto-archived (tooling to enforce this is a separate, later concern — this RFC specifies the policy, not the script).
- Promotion into the permanent tier (`OE-SANDBOX-CONCEPT-000123` → a newly minted `OE-CONCEPT-######`) goes through the ordinary RFC process in full — nothing skips review on the way to becoming a citable, permanent entity.
- Scope for this RFC: controlled-vocabulary concept entries only. Sandbox identifiers for Strands, LPMs, or ontology classes are out of scope here and would need their own RFC if a concrete need arises — this keeps the amendment surgical rather than opening every entity type at once.
- §10.3's future compatibility checker gets one additional rule (documented now, implemented when that Phase 4 tool is built): loudly flag any dependent-repo manifest that references a `SANDBOX` identifier, since that repo is knowingly depending on something with no permanence guarantee.

### 2. Two-speed review (amends §11.2)

- Merging a new `OE-SANDBOX-CONCEPT-######` entry, or a `proposed`-status permanent-tier entry, requires only a single maintainer approval (or an async no-objection window of 5 business days) — no domain editor sign-off required at this stage.
- The full domain-editor + maintainer bar in §11.2 is reserved specifically for the `proposed → accepted` transition in the permanent tier and for sandbox → permanent promotion — the one moment where the never-delete guarantee actually begins to apply.

### 3. `retracted` status (amends §11.3, §11.4)

- A new terminal status value, added to the enum: `proposed`, `accepted`, `stable`, `deprecated`, `superseded`, `retracted`.
- `retracted` is a parallel terminal state to `deprecated`/`superseded`, reachable directly from `accepted` or `stable` — it is not sequential after `deprecated`. It means "this was accepted in error, or is no longer endorsed by the maintainers; use at your own judgment," with **no implied replacement**, unlike `deprecated`'s implicit "superseded by something better."
- Same never-delete, always-resolvable mechanics as every other status at `accepted`+ (§11.4 continues to apply in full).
- An optional `retractionNote` free-text field may be attached, explaining why — additive, not required, so it doesn't force a schema migration on existing entries.

## Relations

- Does not modify the 5 core ontology classes or the 6 reserved classes in `ontologies/core_v1.yaml` — this RFC operates at the controlled-vocabulary-entry level, not the class level.
- Does not change §1.1/§1.2/§10's treatment of dependent repositories, which remains untouched.
- `retracted` sits alongside `deprecated`/`superseded` in the lifecycle graph defined in §11.3; sandbox status (`active`/`archived`/`promoted`) is a wholly separate, smaller enum that never intersects with §11.3's values.

## Standards justification

Not applicable in the §3-item-4 sense (no novel *data* structure is being modeled from scratch) — this is a governance/process change to how existing entity types move through review, plus one new field-level enum value and one new identifier pattern, not a new standard-worthy structure. The TTL/auto-archive pattern follows the IETF Internet-Draft convention (documents expire after N months unless actively renewed), and the `retracted` status follows the academic-publishing retraction convention (a tombstone distinct from "superseded").

## ID block reservation

Not applicable — this RFC does not introduce a new vocabulary or LPM.

## Files affected

| File | Change |
|---|---|
| `docs/oecb_specifications.md` | §3 item 5 — add cross-reference to new §4.5 scope note. New §4.5 "Sandbox/Provisional Tier." §10.3 — add the SANDBOX-reference flag rule. §11.2 — split review ceremony by status transition. §11.3 — add `retracted` to the lifecycle enum and diagram, documented as a parallel terminal branch. §11.4 — add `retracted` semantics; note sandbox-tier exemption. |
| `GOVERNANCE.md` | RFC Process section — mirror the two-speed review split. Lifecycle Status section — add `retracted`, redraw as a branching (not strictly linear) diagram. Deprecation Policy section — add `retracted` semantics and the sandbox exemption note. Compatibility Checking section — add the future SANDBOX-flag requirement. |
| `schemas/common.defs.yaml` | Add `sandboxConceptId` pattern (`^OE-SANDBOX-CONCEPT-[0-9]{6}$`) alongside the existing `conceptId` def (near line 35). Add a `sandboxMeta` def (`created`, `expiresOn`, `status: [active, archived, promoted]`). Extend `status` enum (line 96) to add `retracted`. Add optional `retractionNote` field definition. |
| `ontologies/core_v1.yaml` | Update `oe:status` property definition text (lines 166-174) to list `retracted` and note it is a parallel terminal state, not sequential after `deprecated`. |

## Review

- [ ] Domain editor approval — not required for this RFC's initial merge under its own proposed two-speed rule, but since that rule doesn't exist yet at time of filing, this RFC follows the *current* §11.2 process (domain editor + maintainer) until adopted.
- [ ] Maintainer approval
- [ ] Explicit maintainer consensus recorded here per spec §11.6, since this is a `specification-amendment` touching §3 and §11
