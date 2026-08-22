# RFC-0019: Epistemic status for LPMs (`oe:epistemicStatus`) — declaring designed-thought-experiment vs. field-validated-curriculum

**Type:** `content`

**Status:** `accepted`
**Author(s):** OpenEvo Computational Curriculum Studies Working Group
**Date:** 2026-08-22
**Accepted:** 2026-08-22, by Dustin Eirdosh (maintainer)

## Motivation

`bio-core-k12` (`OE-LPM-000001`) and `interdisciplinary-k12` (`OE-LPM-000002`) were designed from day one as a paired thought experiment: a controlled comparison isolating one variable — which controlled vocabulary a strand is allowed to draw on — to study how vocabulary richness changes what a curriculum can structurally say about agency, selection, and cross-domain causal reasoning. Neither was ever intended as a field-tested, validated, or recommended curriculum for real classroom deployment. Both repos' READMEs now say this in prose (as of this session), but nothing in the *data* says it. A consumer reading `lpm.yaml` directly, resolving either ID through `registry/lpm-index.json`, or building a future tool against this ecosystem has no machine-readable way to learn that these two LPMs make a fundamentally different kind of claim than an ordinary curriculum entry would.

The existing schema has two lifecycle-shaped fields, and neither covers this:

- `status` (`common.defs.yaml#/$defs/status`) is a **maturity** axis — proposed → accepted → stable, or deprecated/superseded/retracted. An LPM can reach `status: stable` (mature, reviewed, unlikely to change) while still never being intended as real curriculum. Maturity and validation-intent are orthogonal.
- `sandboxMeta`/`sandboxStatus` (RFC-0001, RFC-0010) is a **time-boxed forking** axis for provisional entries awaiting a promote-or-archive decision. It doesn't apply to permanent-tier LPMs at all, and even for sandbox forks it says nothing about *why* a fork exists — only that it's provisional.

What's missing is a third, orthogonal axis: a permanent, structural declaration of what *kind* of claim an LPM's content makes — a deliberately synthetic comparison/demonstration object, versus curriculum that has actually been piloted or validated for real teaching. This RFC adds that axis.

## Proposed change

### 1. New shared defs: `common.defs.yaml#/$defs/epistemicStatus`, `epistemicStatusNote`

```yaml
epistemicStatus:
  type: string
  enum: [designed-thought-experiment, field-validated-curriculum]
  description: >
    Structural declaration of what kind of claim this oe:LPM makes,
    orthogonal to both `status` (lifecycle maturity) and `sandboxMeta`/
    `sandboxStatus` (time-boxed fork provisionality, RFC-0001/RFC-0010).
    `designed-thought-experiment` means the LPM is a deliberately
    synthetic comparison, demonstration, or methodology object — not a
    claim that this content should be taught as-is in a real classroom.
    `field-validated-curriculum` means it has actually been piloted,
    reviewed, or adopted as real instructional content. Additive enum —
    new values (e.g. `field-piloted` for partial validation) may be
    proposed later via ordinary RFC, same pattern as
    `contextAssumption`'s enum.

epistemicStatusNote:
  type: string
  description: >
    Optional free-text elaboration, mirroring `retractionNote`'s
    pattern. Recommended when `epistemicStatus: designed-thought-experiment`
    is set on an LPM that also genuinely instantiates a real academic
    position elsewhere in the ecosystem (e.g. a dispute-graph edge) —
    see "Relations" below for why those two facts don't contradict each
    other and should be stated together, not left for a reader to
    reconcile alone.
```

### 2. `schemas/lpm.schema.yaml`: new required property, both tiers

```yaml
properties:
  # ...(unchanged)...
  epistemicStatus:
    "$ref": "common.defs.yaml#/$defs/epistemicStatus"
  epistemicStatusNote:
    "$ref": "common.defs.yaml#/$defs/epistemicStatusNote"

required:
  - id
  - type
  - version
  - labels
  - authors
  - license
  - conceptbase
  - strands
  - epistemicStatus   # NEW — applies to both oneOf branches below
```

Added to the shared top-level `required` list (not inside either tier-specific `oneOf` branch), so it applies uniformly to permanent-tier **and** sandbox-tier LPMs alike — a sandbox fork inherits the question "what kind of claim is this making" from the moment it's created, not only once promoted. **MINOR** bump, `schemas/lpm.schema.yaml` 1.2.0 → 1.3.0.

### 3. `ontologies/core_v1.yaml`: new property

```yaml
oe:epistemicStatus:
  label: epistemic status
  domain: oe:LPM
  range: xsd:string
  status: accepted
  definition: >
    Declares whether an oe:LPM is a designed thought-experiment/
    comparison object or a field-validated curriculum. Value space
    constrained at the schema layer (common.defs.yaml#/$defs/epistemicStatus),
    not enumerated here — the same pattern already used for oe:status
    and oe:contextAssumption.
```

**MINOR** bump, `ontologies/core_v1.yaml` 1.5.0 → 1.6.0.

### 4. Strand-level: comment-only, not schema-enforced

`strand.schema.yaml`'s `subStrands[]` is self-referential (`$ref: "#"`), so any field added to the shared `required` list there would cascade onto *every* SubStrand at every nesting depth in every LPM in the ecosystem — a large, disproportionate footprint for a concern that (per `registry/strand-index.json`'s range-based lookup) always resolves back to exactly one parent LPM anyway. Strand IDs are never independently registered; a consumer resolving `OE-STRAND-0002xx` already must resolve `OE-LPM-000002` first to find it. `epistemicStatus` therefore has exactly one authoritative source (the parent LPM) and does **not** get a schema field on `strand.schema.yaml`.

Recommended instead (convention, not schema-enforced, reviewable in normal PR review): every top-level Strand file's existing header comment block gets one added line, e.g.:

```yaml
# epistemicStatus: designed-thought-experiment (see ../lpm.yaml, OE-LPM-000002)
```

so the declaration is visible to a human browsing the file directly on GitHub without a schema round-trip, without a validated-and-therefore-must-be-kept-in-sync-forever field to maintain at every nesting depth.

### 5. Registry mirroring

`registry/lpm-index.json` and each `registry/sandbox-lpm/OE-SANDBOX-LPM-######.json` are the first hop of every w3id resolution — arguably the single highest-value place for this to be visible, since a consumer may stop there without ever fetching the full `lpm.yaml`. Both get an `epistemicStatus` field mirroring the source LPM's, kept in sync by the existing `scripts/build_registry.py` (already hand-regenerated per RFC-0010's own precedent for `registry/sandbox-lpm/`).

### 6. Backfill (the entire current LPM population — zero ambiguity)

`registry/lpm-index.json` currently lists exactly two permanent-tier LPMs, and `registry/sandbox-lpm/` exactly four sandbox forks — all four are `forkedFrom` one of the two thought-experiment LPMs. There is no third LPM anywhere in the ecosystem today that this backfill could get wrong:

| ID | epistemicStatus |
|---|---|
| `OE-LPM-000001` (bio-core-k12) | `designed-thought-experiment` |
| `OE-LPM-000002` (interdisciplinary-k12) | `designed-thought-experiment` |
| `OE-SANDBOX-LPM-000001`/`000002` (bio-core-k12 forks) | `designed-thought-experiment` (inherited via `forkedFrom` → `OE-LPM-000001`) |
| `OE-SANDBOX-LPM-000003`/`000004` (interdisciplinary-k12 forks) | `designed-thought-experiment` (inherited via `forkedFrom` → `OE-LPM-000002`) |

### 7. Symmetry note on `openevo-graph`'s `instantiatesIn` dispute edges

Discussed and resolved during review: the two `instantiatesIn` edges in `openevo-graph/edges/disputes/dispute-openevo-vs-kampourakis-edges.yaml` already carry an `authorshipProvenanceCrossCheck` field with careful, existing attribution-fairness language (e.g. *"consonant with, though not literally authored as, the DCR position"*; the sibling `holdsPosition` edge already says *"Not endorsed or reviewed by Kampourakis"*). That mechanism solves a different problem (authorship/endorsement provenance) than `epistemicStatus` solves (curriculum-validation status) and is not being changed. What was missing is symmetry of *discovery*: a reader traversing the dispute graph from the Position node outward to the strand would see the authorship caveat but nothing pointing back at the LPM's `epistemicStatus`. Each `instantiatesIn` edge's existing `note` field (already free text, no schema change needed) gets one added clause cross-referencing it, e.g.:

```yaml
note: "bio-core-k12/strands/strand-102-natural-selection-adaptation.yaml (epistemicStatus: designed-thought-experiment, see OE-LPM-000001)"
```

This is discoverability-only — it does not change, soften, or re-litigate the dispute grounding itself, per design principle 7 (OECB represents genuine disagreement, it does not adjudicate it).

## Relations

- **Orthogonal to `status`.** An LPM's lifecycle maturity (draft → stable) and its epistemic purpose (thought-experiment vs. validated curriculum) are independent axes. `status: stable` + `epistemicStatus: designed-thought-experiment` is a fully coherent combination: a mature, well-reviewed thought experiment.
- **Orthogonal to `sandboxMeta`/`sandboxStatus` (RFC-0001, RFC-0010).** Sandbox status is about *provisionality* (will this fork be promoted or archived); epistemic status is about *intent* (was this ever meant as real curriculum). RFC-0010's existing promote-or-abandon review is exactly the point where a maintainer could reclassify a fork's `epistemicStatus` too, if it were ever actually piloted — this RFC doesn't touch that lifecycle, it just adds a field the lifecycle can act on.
- **Does not weaken any real dispute-graph grounding.** `strand-202` (interdisciplinary-k12) and `strand-102` (bio-core-k12) genuinely instantiate opposite sides of the real, published Kampourakis/Nehm ICR-DCR academic dispute (openevo-graph's `instantiatesIn` edges). `epistemicStatus: designed-thought-experiment` is a claim about *curriculum-validation status* — has this been piloted and recommended for real classrooms — not a claim about the *theoretical seriousness* of the position it encodes. A designed thought experiment can still be a genuine, accurately-modeled instantiation of a real academic position; those are different questions, and `epistemicStatusNote` exists specifically so an LPM can say both things together rather than leaving a future reader to reconcile them alone.

## Standards justification

Per spec §3 item 4: no existing curriculum standard (CASE, IEEE LOM, xAPI, schema.org) has a field distinguishing a designed research/demonstration artifact from validated, deployable curriculum — this is closer to a research-methodology distinction than a curriculum-standards one. The relevant precedent is OECB's own prior art (`status`, `sandboxStatus` — both schema-layer-constrained string enums with a documented, additive value space), reused here rather than inventing a new shape.

## ID block reservation

Not applicable — this RFC mints no new identifiers, only a new field on the existing `oe:LPM` class.

## Files affected

| File | Change |
|---|---|
| `schemas/common.defs.yaml` | Add `epistemicStatus`, `epistemicStatusNote` defs. MINOR (1.10.0 → 1.11.0) |
| `schemas/lpm.schema.yaml` | Add `epistemicStatus`/`epistemicStatusNote` properties; add `epistemicStatus` to shared `required`. MINOR (1.2.0 → 1.3.0) |
| `ontologies/core_v1.yaml` | Add `oe:epistemicStatus` property. MINOR (1.5.0 → 1.6.0) |
| `registry/lpm-index.json` | Add `epistemicStatus` to both existing entries |
| `registry/sandbox-lpm/OE-SANDBOX-LPM-00000{1,2,3,4}.json` | Add `epistemicStatus` to all four |
| `bio-core-k12/lpm.yaml` | Add `epistemicStatus: designed-thought-experiment` + note |
| `interdisciplinary-k12/lpm.yaml` | Add `epistemicStatus: designed-thought-experiment` + note |
| Top-level Strand files in both repos | Add one-line header-comment cross-reference (convention, not schema-enforced) |
| Both repos' `README.md` | One added sentence cross-referencing the new machine-readable field, so prose and data agree |
| `openevo-graph/edges/disputes/dispute-openevo-vs-kampourakis-edges.yaml` | Add symmetry cross-reference to both `instantiatesIn` edges' existing `note` field (see §7) |

## Comprehensive ecosystem integration — checklist and honest gaps

| Layer | Change | Status |
|---|---|---|
| `schemas/common.defs.yaml` | Add `epistemicStatus`, `epistemicStatusNote` | Pending approval |
| `schemas/lpm.schema.yaml` | Add properties + required field | Pending approval |
| `ontologies/core_v1.yaml` | Add `oe:epistemicStatus` | Pending approval |
| `registry/lpm-index.json`, `registry/sandbox-lpm/*.json` | Mirror field | Pending approval |
| `bio-core-k12`, `interdisciplinary-k12` `lpm.yaml` | Backfill | Pending approval |
| Strand file header comments | Convention addition | Pending approval |
| `docs/oecb_specifications.md` | No forward-declared scope sentence exists to amend (unlike RFC-0010's §4.5) — optional documentation-only addition, not required for schema validity | Not planned unless requested |
| `scripts/build_registry.py` | No structural change needed — script already copies whatever fields exist on the source `lpm.yaml`/sandbox registry entries into its output, per RFC-0010's existing implementation | Verify, don't assume |
| Downstream repos/tools (curriculum-architect agent, dbr-cycle-facilitator, any future consumer) | Should treat `epistemicStatus: designed-thought-experiment` as a hard signal not to present these two LPMs' content as a real teaching recommendation | Out of scope for this RFC — a documentation/prompt-engineering follow-up, not a schema concern |

## Review

- [x] Domain editor approval (schema/ontology/governance domain) — Dustin Eirdosh, 2026-08-22
- [x] Maintainer approval — Dustin Eirdosh, 2026-08-22
- [x] Confirmed `epistemicStatus` should be `required` ecosystem-wide (both tiers) rather than optional
- [x] Confirmed Strand-level treatment (comment-only, not schema field) is the right proportionality call
- [x] Confirmed the two enum values and their names are right; a third value can wait for a future ordinary RFC
- [x] Confirmed the dispute-graph `instantiatesIn` framing (curriculum-validation ≠ theoretical-seriousness) and added the §7 symmetry-note follow-up
