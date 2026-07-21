# RFC-0010: Sandbox-tier LPM forking (`OE-SANDBOX-LPM-######`, `oe:forkedFrom`, `oe:mergedInto`)

**Type:** `content`

**Status:** `accepted`
**Author(s):** OpenEvo Computational Curriculum Studies Working Group
**Date:** 2026-07-21
**Accepted:** 2026-07-21, by Dustin Eirdosh (maintainer)

## Motivation

RFC-0009 gives one LPM a way to hold multiple defensible *SubStrand-level* content paths (`trajectoryVariants`, tagged by `contextAssumption`). It has no answer for a coarser, genuinely different question raised directly by the human-dimensions case study and the working group's own discussion of it: what happens when the variation isn't "which instructional-context assumption applies to this one slot," but "an entire alternate theoretical or thematic lineage of the whole LPM" — e.g., a stricter, more-strictly-decentralized human-lineage extension of `bio-core-k12`; an `oe-interdisciplinary-k12` variant that deliberately tightens its causal framing toward `bio-core`'s; or one that deepens AI4K12/NGSS standards alignment specifically. These are not instructional-context variants of a slot — they're different bets about theoretical framing or standards focus, at the scope of a whole model, and `contextAssumption` would be the wrong vocabulary to force them into (see "Relations," below, for why the two mechanisms are deliberately kept orthogonal).

OECB already anticipates needing exactly this. Spec §4.5 scopes the existing sandbox/provisional tier explicitly: *"Scoped to controlled-vocabulary concept entries only; sandbox identifiers for other entity types are out of scope until a future RFC establishes a concrete need."* This RFC is that future RFC, for `oe:LPM` specifically.

Minting an ordinary `OE-LPM-######` today requires RFC approval per `GOVERNANCE.md` ("Sequentially assigned, one ID per LPM, at RFC approval time") — appropriate for a small number of deliberately-authored, citable pilot LPMs, but far too heavy for the kind of cheap, frequent, sometimes-abandoned experimentation implied by "some may resolve and merge, others may evolve and further branch." The sandbox tier already solves exactly this cost/permanence tradeoff for concepts (RFC-0001): free-ish to create, exempt from the never-delete guarantee, TTL'd, promotable to permanent status only through full review. This RFC applies that same shape to LPMs.

### A framing note on why this shape, not asserted as more than a framing note

The variation → (reviewed) retention/promotion → merge-or-abandon lifecycle this RFC proposes is structurally the variation-selection-retention (VSR) framework already cited in this ecosystem's own vocabulary (Mesoudi, A. (2011), *Cultural Evolution: How Darwinian Theory Can Explain Human Culture*, already a citation on `OE-CONCEPT-000213` in `OE-INTERDISCIPLINARY-v1.0.0`). Forking generates variation; promotion review is a retention filter; archiving an unpromoted sandbox fork is the analogue of a lineage not being retained. That structural parallel is worth naming, because it's part of why this shape felt like the right one to reach for rather than an arbitrary git-flavored decision. It is offered here strictly as *design inspiration*, not as a scientific claim this RFC is asserting or testing — consistent with design principle 7, infrastructure should not editorialize on the human-evolution debate the case study describes, and a governance mechanism modeled loosely on VSR is not itself evidence about whether cultural evolution operates the way Mesoudi describes. Two places the analogy should **not** be over-read, stated plainly so it isn't mistaken for more than it is: promotion is a deliberate, reviewed, non-random human decision (domain editor + maintainer judgment), not blind variation-filtering the way selection or drift operate on a population; and forks don't reproduce or compete for a shared resource pool the way organisms do — "how many forks exist" is bounded by contributor effort, not selection pressure. The mechanism borrows the VSR *shape* because it's a good governance fit, not because LPM forking is being proposed as a literal instance of the phenomenon the field studies.

## Proposed change

### 1. New identifier pattern: `common.defs.yaml#/$defs/sandboxLpmId`

```yaml
sandboxLpmId:
  type: string
  pattern: "^OE-SANDBOX-LPM-[0-9]{6}$"
  description: >
    Provisional identifier for a sandbox-tier LPM entry (RFC-0010, per
    the extension point spec §4.5 forward-declares). Structurally
    distinct from lpmId so the two can never be mistaken for each other.
    Not subject to the never-delete guarantee — exempt by construction,
    since sandbox LPMs carry sandboxMeta, never the permanent-tier
    status enum. Resolves under
    https://www.w3id.org/openevo/sandbox/lpm/{id}. Assigned sequentially
    within its own namespace, independent of the permanent OE-LPM-######
    sequence — see "ID block reservation" below.
```

`sandboxMeta`/`sandboxStatus` (already defined by RFC-0001) are reused as-is — they're already generic sandbox-lifecycle shapes, not concept-specific, so no change is needed there.

### 2. New shared reference type: `common.defs.yaml#/$defs/anyLpmRef`

```yaml
anyLpmRef:
  type: string
  description: >
    A reference to an LPM at either tier — used by oe:forkedFrom and
    oe:mergedInto, since a fork's parent (or a merge target) may itself
    be a permanent or a sandbox-tier LPM.
  oneOf:
    - "$ref": "#/$defs/lpmId"
    - "$ref": "#/$defs/sandboxLpmId"
```

### 3. `schemas/lpm.schema.yaml`: tier-conditional `id`/`status`, plus `forkedFrom`/`mergedInto`

The existing `required` list (`id, type, status, version, labels, authors, license, conceptbase, strands`) stays the shared baseline for **both** tiers — a sandbox-tier LPM is still a fully loadable, browsable `oe:LPM` instance; the Explorer app's loader (`app/js/lpmLoader.js`) needs no special-casing to fetch and render one, since it already parameterizes every fetch by `(owner, repo, ref, path)`. What changes is that `id`/`status` become tier-conditional, and `status` is replaced by `sandboxMeta` on the sandbox branch — the same substitution RFC-0001 already established for concepts, applied here correctly (see the honest gap noted in "Comprehensive ecosystem integration" below, since `concept.schema.yaml` never actually implemented this substitution despite `sandboxConceptId`/`sandboxMeta` existing since RFC-0001):

```yaml
properties:
  id:
    type: string  # narrowed by the oneOf branches below
  # status: removed from the unconditional properties block — now
  # tier-conditional, see oneOf below
  # ...(labels, authors, license, conceptbase, strands, extensions unchanged)...

  forkedFrom:
    "$ref": "common.defs.yaml#/$defs/anyLpmRef"
    description: >
      oe:forkedFrom. The LPM this one began as a fork of, if any. Absent
      for LPMs authored from scratch (including sandbox-tier LPMs that
      aren't forks — the sandbox tier also supports free-standing
      experimental LPMs, not only forks). Retained across promotion:
      once a sandbox fork is promoted to a permanent OE-LPM-######, its
      forkedFrom pointer is carried over so lineage remains queryable
      after the identifier changes tier.

  mergedInto:
    "$ref": "common.defs.yaml#/$defs/anyLpmRef"
    description: >
      oe:mergedInto. Set when this LPM's content has been substantively
      absorbed into another LPM and this one is being archived
      (sandboxMeta.status: archived) rather than independently promoted.
      Only meaningful on a sandbox-tier LPM — a promoted, permanent LPM
      MUST NOT set this (permanent-tier merges are represented via the
      existing status: deprecated + supersededBy pattern instead, per
      GOVERNANCE.md's Deprecation Policy, not by this field).

required: [id, type, version, labels, authors, license, conceptbase, strands]
# "status" removed from the unconditional list; each oneOf branch below
# adds back exactly one of status/sandboxMeta to required.

oneOf:
  - description: Permanent-tier LPM (unchanged from today).
    properties:
      id: { "$ref": "common.defs.yaml#/$defs/lpmId" }
      status: { "$ref": "common.defs.yaml#/$defs/status" }
    required: [id, status]
  - description: Sandbox-tier LPM (RFC-0010).
    properties:
      id: { "$ref": "common.defs.yaml#/$defs/sandboxLpmId" }
      sandboxMeta: { "$ref": "common.defs.yaml#/$defs/sandboxMeta" }
    required: [id, sandboxMeta]
```

This is additive and non-breaking: both existing LPM files (`OE-LPM-000001`, `OE-LPM-000002`) already satisfy the permanent-tier branch exactly as written today, so neither requires modification. **MINOR** bump, `schemas/lpm.schema.yaml` 1.0.2 → 1.1.0.

### 4. Ontology additions (`ontologies/core_v1.yaml`)

```yaml
  oe:forkedFrom:
    label: forked from
    domain: oe:LPM
    range: oe:LPM
    status: accepted
    definition: >
      Relates an LPM to the LPM it began as a fork of. Provenance only —
      does not imply the fork is a subset, a strict revision, or in any
      way subordinate; per design principle 7, a fork is exactly as
      internally valid as its parent, the same relationship BIO-CORE and
      OE-INTERDISCIPLINARY already have to each other (independently
      valid, not ranked), just discoverable via an explicit lineage
      pointer instead of leaving the relationship implicit.

  oe:mergedInto:
    label: merged into
    domain: oe:LPM
    range: oe:LPM
    status: accepted
    definition: >
      Relates a sandbox-tier LPM being archived to the LPM its content
      was substantively absorbed into. Not used on permanent-tier LPMs
      (see GOVERNANCE.md's existing status: deprecated / supersededBy
      pattern for that case) — scoped to the sandbox tier specifically,
      where archival rather than formal deprecation is the operative
      lifecycle event (spec §4.5).
```

Both additive. **MINOR** bump, `ontologies/core_v1.yaml`.

**Version-sequencing note (resolved):** RFC-0009 and RFC-0010 were accepted together on 2026-07-21. `common.defs.yaml` went 1.4.0 → 1.6.0 (RFC-0009's `contextAssumption` def, then RFC-0010's `sandboxLpmId`/`anyLpmRef` defs) and `core_v1.yaml` went 1.3.1 → 1.5.0 (RFC-0009's two properties, then RFC-0010's two), applied as one combined change rather than two intermediate commits.

### 5. `GOVERNANCE.md`: extend the Sandbox/Provisional Tier section to LPMs

Add an LPM row to the two-speed review table (mirroring the existing sandbox-concept row exactly): merging a new `OE-SANDBOX-LPM-######` entry needs only one maintainer approval or a 5-business-day no-objection window — no domain-editor sign-off. Promotion to a permanent `OE-LPM-######` requires the full RFC process (domain editor + maintainer approval), identical to sandbox → permanent concept promotion.

Add to Identifier Block Allocation: sandbox LPM IDs are assigned sequentially within their own `OE-SANDBOX-LPM-######` namespace, independent of the permanent `OE-LPM-######` sequence (which stays reserved for promoted, citable models) — consistent with how sandbox concept IDs already don't consume permanent-tier concept-block numbering.

### 6. `docs/oecb_specifications.md`: realize the §4.5 forward declaration

Amend §4.5's scope sentence from "Scoped to controlled-vocabulary concept entries only... out of scope until a future RFC establishes a concrete need" to name `oe:LPM` as now in scope per this RFC, and add `sandboxLpmId` to Appendix A's quick reference alongside `sandboxConceptId`. This is a §4 content change, not a §3/§11 change, so it does **not** require `specification-amendment` type per `GOVERNANCE.md`'s own rule — consistent with how RFC-0002 promoted `oe:Competency` out of `reserved` as an ordinary `content` RFC.

### 7. Practical realization: a fork is a git ref, not a content copy

Consistent with the loose-coupling pattern already used throughout OECB (`strands[].repository`, `learningObjects[].repository`), a sandbox-tier LPM registry entry (`registry/sandbox-lpm/OE-SANDBOX-LPM-######.json`) is proposed as a **lightweight pointer record** — `{id, sandboxMeta, forkedFrom, labels, repository, ref}` — not a full copy of the fork's strand content. The `repository`/`ref` pair points at wherever the fork's actual files live. This is deliberately git-native: `app/js/lpmLoader.js` already fetches every file via `fetchRawText(owner, repo, ref, path)` — a `ref` parameter already flows through the entire loading path today, just always pointing at a repository's default branch in current usage. A fork realized as an actual git branch (recommended default — e.g. a `sandbox/<short-name>` branch on the trunk LPM's own repository, or a separate lightweight repository where a clean break is more appropriate) is loadable by the existing app with **zero loader changes** — only a way for a user to choose a non-default ref, which is Explorer UI, out of this RFC's scope (noted for whoever picks up Phase 6-adjacent work later).

## Relations

- Deliberately orthogonal to RFC-0009's `contextAssumption`/`trajectoryVariants`, which operate one level down (SubStrand-slot alternation within one LPM) and encode a different axis (instructional-context assumption, not theoretical/thematic framing). A forked LPM is free to define its own `trajectoryVariants` independently; no schema coupling exists or is needed between the two mechanisms. Fork rationale belongs in free-text `description` on the LPM, not in `contextAssumption`'s controlled vocabulary — keeping the two axes separate is a deliberate modeling choice, not an oversight.
- Extends the sandbox/provisional tier (RFC-0001, spec §4.5) to a new entity type, exactly as that section already forward-declares.
- `oe:forkedFrom` mirrors, at the LPM level, the same non-hierarchical-pluralism relationship `BIO-CORE` and `OE-INTERDISCIPLINARY` already have as independently valid vocabularies (design principle 7) — a fork is not asserted as lesser than its parent.
- Grounded in [`docs/design-notes/human-dimensions-k12-case-study.md`](../docs/design-notes/human-dimensions-k12-case-study.md) and the working discussion that followed it, the same relationship RFC-0009 has to that document.

## Standards justification

Per spec §3 item 4 / §12: no existing curriculum standard (CASE, IEEE LOM, xAPI, schema.org) has a notion of provisional-identifier forking with differential-cost promotion — this is a governance/identifier-lifecycle pattern, not a curriculum-content structure, so the relevant precedent is OECB's own prior art (RFC-0001's sandbox concept tier) rather than an external standard. This RFC is explicitly an application of that existing internal precedent to a new entity type, not a novel invention — the closest thing to "reuse over reinvention" available here is reusing OECB's own established mechanism rather than designing a new one from scratch.

## ID block reservation

Not applicable in the permanent-tier sense (no `OE-LPM-######` block is reserved by this RFC). The new `OE-SANDBOX-LPM-######` namespace is sequential and self-contained, per §5 above — no block table entry needed, mirroring how sandbox concept IDs aren't listed in the Concept ID blocks table either.

## Comprehensive ecosystem integration — checklist and honest gaps

| Layer | Change | Status |
|---|---|---|
| `schemas/common.defs.yaml` | Add `sandboxLpmId`, `anyLpmRef` | Applied 2026-07-21 |
| `schemas/lpm.schema.yaml` | Tier-conditional `id`/`status` via `oneOf`; add `forkedFrom`, `mergedInto` | Applied 2026-07-21 (1.0.2 → 1.1.0). Verified against positive/negative test fixtures. |
| `ontologies/core_v1.yaml` | Add `oe:forkedFrom`, `oe:mergedInto` | Applied 2026-07-21 |
| `GOVERNANCE.md` | Extend Sandbox/Provisional Tier section and Identifier Block Allocation to LPMs | Applied 2026-07-21 |
| `docs/oecb_specifications.md` | Realize §4.5's forward declaration for `oe:LPM`; Appendix A addition | Applied 2026-07-21 (spec 0.4.0 → 0.5.0) |
| `scripts/build_registry.py` | `registry/sandbox-lpm/` output path added (`SANDBOX_LPM_INDEX` dict + `build_sandbox_lpms()`), same hand-maintained pattern as `LPM_INDEX`. Empty until the first sandbox LPM exists. | Applied 2026-07-21 — still genuinely untested against a real sandbox LPM entry, see honest gap below |
| `app/js/lpmLoader.js` | None required for basic load (already `ref`-parameterized) | No change needed |
| Explorer UI (ref/branch picker, sandbox badge) | New UI to let a user select a non-default ref and see tier | Out of scope for this RFC — Phase 6-adjacent future work |
| `bio-core-k12` / `oe-interdisciplinary-k12` | Recommend a `sandbox/<short-name>` branch-naming convention for forks realized in-repo | Convention only, not enforced by schema |

**Honest gap, found and then closed the same day:** while drafting this RFC, reading `concept.schema.yaml` closely showed that RFC-0001's sandbox-concept tier was never actually finished at the schema layer — `id`/`status` were still hardcoded to the permanent-tier-only refs, with no `oneOf` branch for `sandboxConceptId`/`sandboxMeta` despite both existing in `common.defs.yaml` since RFC-0001. Originally flagged here as deferred to a future follow-up. It stopped being deferrable once real sandbox concepts were needed to populate the four sandbox-LPM forks this RFC exists to support (bio-core/oe-interdisciplinary human-evolution and machine-culture-coevolution forks, 2026-07-21) — so it was fixed the same day, using the identical `oneOf` pattern this RFC applied to `lpm.schema.yaml` (`schemas/concept.schema.yaml` 1.0.1 → 1.1.0), verified against positive/negative test fixtures and a full regression pass of both existing vocabularies before any sandbox concept was authored against it.

## Files affected — all applied 2026-07-21

| File | Change |
|---|---|
| `schemas/common.defs.yaml` | Add `sandboxLpmId`, `anyLpmRef` defs |
| `schemas/lpm.schema.yaml` | `oneOf` tier branches; add `forkedFrom`, `mergedInto`. MINOR (1.0.2 → 1.1.0) |
| `ontologies/core_v1.yaml` | Add `oe:forkedFrom`, `oe:mergedInto` |
| `GOVERNANCE.md` | Sandbox tier + ID allocation sections extended to LPMs |
| `docs/oecb_specifications.md` | §4.5 scope amendment; Appendix A addition |
| `scripts/build_registry.py` | New `registry/sandbox-lpm/` output path |

## Review

- [x] Domain editor approval (schema/ontology/governance domain) — Dustin Eirdosh, 2026-07-21
- [x] Maintainer approval — Dustin Eirdosh, 2026-07-21
- [x] `forkedFrom`/`mergedInto` naming and sandbox-tier-only `mergedInto` scoping confirmed as drafted
- [x] `sandbox/<short-name>` branch-naming convention confirmed
- [ ] The `concept.schema.yaml` sandbox-wiring gap: flagged, deferred to a future follow-up RFC — not blocking this one
