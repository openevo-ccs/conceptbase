# RFC-0009: Context-specific trajectories for SubStrand content (`contextAssumption` + `trajectoryVariants`)

**Type:** `content`

**Status:** `accepted`
**Author(s):** OpenEvo Computational Curriculum Studies Working Group
**Date:** 2026-07-21
**Accepted:** 2026-07-21, by Dustin Eirdosh (maintainer)

## Motivation

[`docs/design-notes/human-dimensions-k12-case-study.md`](../docs/design-notes/human-dimensions-k12-case-study.md) documents a real, evidence-backed design tension that the current schema has no way to represent as data: whether to introduce human-specific evolutionary content (and, by extension, any similarly agency-adjacent or context-sensitive content) early and repeatedly, or to defer it until a robust non-agentic causal model is established, is not a single right answer — it depends on an assumption about the classroom a student is actually in. Berkman, Pacheco & Plutzer (2008) and Branch, Reid & Plutzer (2021) document, with real national survey data, that US evolution instructional time varies roughly five-fold across classrooms. A "rich-scaffolding" design and a "minimal-prior-exposure" design can both be the *correct* design — for different, both real, classrooms.

OECB already has a mechanism for representing exactly this kind of unresolved theoretical disagreement **between** independently-governed LPMs (design principle 7, spec §8.6): `BIO-CORE` and `OE-INTERDISCIPLINARY` coexist as separate vocabularies rather than being reconciled into one. What it does not have is an equivalent mechanism **within** a single SubStrand — a way for one LPM to say "this specific grade-band slot has more than one defensible content path, each tagged with an explicit, named assumption about instructional context," without forking the entire LPM into parallel repositories just to vary one SubStrand.

The two existing mechanisms that might seem to already cover this do not:

- **`oe:required` (elective/optional)** marks a SubStrand as skippable, but carries no information about *why* it's optional or *which* classroom context would make it apply. An elective is "nice to have if there's room"; a trajectory variant is "the correct choice under this specific, statable assumption, in place of the alternative correct choice under a different assumption." These are different claims, and today's schema can express only the first.
- **`oe:recommendedSequence` / `oe:alternativeSequence`** (domain/range `oe:Strand` → `oe:Strand`, per `ontologies/core_v1.yaml`) order *sibling or cross-strand* relationships — which strand comes before which. They say nothing about two alternate *bodies* of content occupying the same conceptual slot, and are not designed to be conditioned on a declared context assumption at all.

Both were considered and are insufficient; a narrow, additive schema/ontology extension is proposed instead.

## Proposed change

### 1. New shared enum: `common.defs.yaml#/$defs/contextAssumption`

```yaml
contextAssumption:
  type: string
  enum: [rich-scaffolding, minimal-prior-exposure]
  description: >
    A named, explicit assumption about the instructional context a
    SubStrand (or SubStrand variant) is designed for, per the
    human-dimensions case study (docs/design-notes/
    human-dimensions-k12-case-study.md). "rich-scaffolding" assumes ample
    instructional time and prior exposure to the strand's foundational
    concepts; "minimal-prior-exposure" assumes thin or inconsistent prior
    coverage (per Branch, Reid & Plutzer 2021's documented reality for a
    large share of US middle schools) and favors more heavily scaffolded,
    later-introduced content. Adding a new enum value later (e.g. a
    third named context) is a MINOR, additive schema change via ordinary
    RFC review — not a specification-amendment, since it extends rather
    than redefines this vocabulary.
```

### 2. New optional field on `oe:SubStrand`: `contextAssumption`

Added to `schemas/strand.schema.yaml`:

```yaml
contextAssumption:
  type: array
  items:
    "$ref": "common.defs.yaml#/$defs/contextAssumption"
  minItems: 1
  description: >
    Which named instructional-context assumption(s) this SubStrand body
    is designed for (oe:contextAssumption). Optional and additive — a
    SubStrand with no contextAssumption makes no claim either way and
    remains fully valid, exactly as all existing SubStrand content does
    today. Semantically meaningful only on oe:SubStrand (mirrors the
    existing oe:required property's domain restriction, enforced by the
    ontology, not by this JSON Schema — see ontologies/core_v1.yaml).
```

### 3. New optional field on `oe:SubStrand`: `trajectoryVariants`

Added to `schemas/strand.schema.yaml`:

```yaml
trajectoryVariants:
  type: array
  items:
    allOf:
      - "$ref": "#"
      - required: [contextAssumption]
  minItems: 1
  description: >
    Alternate, full SubStrand bodies (oe:hasTrajectoryVariant) occupying
    the same conceptual slot as this SubStrand, each tagged with a
    mandatory contextAssumption (unlike the optional top-level field
    above — a variant without a stated assumption would defeat the
    purpose of branching at all). The SubStrand carrying this field is
    itself the default/fallback body: a dependent repository or tool
    that has not declared which context assumption applies to it MUST
    use this SubStrand's own content and MAY ignore trajectoryVariants
    entirely, so nothing about existing consumer behavior changes. A
    context-aware consumer MAY instead select whichever variant's
    contextAssumption matches its own declared context.

    trajectoryVariants entries are alternate realizations of the same
    node, not children of it: they MUST NOT be counted toward the
    recommended two-level subStrands[] nesting-depth limit (spec §6.5),
    and — to keep this initial mechanism simple and avoid an unbounded
    variants-of-variants regress — a trajectoryVariants entry MUST NOT
    itself carry a non-empty subStrands[] or trajectoryVariants[].
    Validation tooling enforcing the nesting-depth limit MUST traverse
    subStrands[] only.
```

### 4. Ontology additions (`ontologies/core_v1.yaml`)

```yaml
  oe:contextAssumption:
    label: context assumption
    domain: oe:SubStrand
    range: xsd:string
    status: proposed
    definition: >
      Names an explicit assumption about instructional context this
      SubStrand body is designed for. Value space (rich-scaffolding |
      minimal-prior-exposure) is constrained at the schema layer
      (common.defs.yaml#/$defs/contextAssumption), not enumerated in the
      ontology itself — the same pattern already used for oe:status.

  oe:hasTrajectoryVariant:
    label: has trajectory variant
    domain: oe:SubStrand
    range: oe:SubStrand
    status: proposed
    definition: >
      Relates a SubStrand to an alternate SubStrand body occupying the
      same conceptual slot, tagged with a different oe:contextAssumption.
      Deliberately NOT a subproperty of oe:hasSubStrand: this is
      alternation between coequal realizations of one slot, not
      parent-child composition, and MUST NOT be traversed by tooling
      that enforces the oe:hasSubStrand nesting-depth limit (spec §6.5).
```

Both are additive (new properties; no existing class, property, domain, or range is changed or removed), so this is a **MINOR** version bump to `ontologies/core_v1.yaml` (1.3.1 → 1.4.0) and to `schemas/strand.schema.yaml` (1.1.1 → 1.2.0), per `GOVERNANCE.md`'s Independent Versioning rules — not a MAJOR/breaking change, and not a specification-amendment (this RFC does not touch spec §3 or §11).

### 5. Strand ID numbering convention for trajectory-variant SubStrands (documentation-only, no new block reservation)

`GOVERNANCE.md`'s existing per-strand ten-block convention (`0NN1` → substrands `111`–`114` for grade bands K-2/3-5/6-8/9-12, etc.) already leaves `0NN5`–`0NN9` unused within every strand's ten-block — no LPM currently uses more than four SubStrand slots per top-level Strand. This RFC proposes documenting, not reserving anew, a convention: a trajectory variant of the SubStrand at position `0NNk` (k = 1..4) takes ID `0NN(k+4)` — e.g. a first variant of `OE-STRAND-000223` (6-8, position 3 in its ten-block) would be `OE-STRAND-000227`. This uses capacity already inside each LPM's existing `000N00`–`000N99` block allocation, so it requires a documentation update to `GOVERNANCE.md`'s Strand ID blocks table (a clarifying addition, not a new reservation) rather than any new block grant. `0NN9` is left open per strand for a second variant or future use.

## Relations

- Builds directly on `oe:SubStrand` and `oe:hasSubStrand` (§6.1, §6.3) — extends, does not modify, the existing recursive composition model.
- Directly operationalizes design principle 7 / spec §8.6 (theoretical pluralism) at a finer grain than the existing vocabulary-level mechanism (`BIO-CORE` vs. `OE-INTERDISCIPLINARY`) — pluralism *within* one LPM's SubStrand, not only *between* LPMs.
- Grounded in [`docs/design-notes/human-dimensions-k12-case-study.md`](../docs/design-notes/human-dimensions-k12-case-study.md), which this RFC treats as its motivating research artifact per the same relationship the Selection cross-domain case study has to earlier alignment work.
- No existing entity's `status`, `definition`, or relations are changed by this RFC. No existing SubStrand file requires modification to remain valid (all 24 existing SubStrands across `bio-core-k12` and `oe-interdisciplinary-k12` currently use neither new field and are unaffected).

## Standards justification

Per spec §3 item 4 / §12: the closest existing standards territory is adaptive/branching learning-path specifications (e.g., work in the 1EdTech Adaptive Instructional Systems space). Those solve a different problem — runtime, learner-performance-driven branching decided during instruction — from what's needed here: an LPM *author* declaring, at authoring time, two or more pre-built, equally legitimate content paths, selected by a *deploying context's* stated assumption rather than by individual learner performance. CASE (already profiled for `oe:Competency` per RFC-0002) has association types for relationships between items but no notion of a context-conditional alternate content body. SKOS has no equivalent. No existing standard was found that covers this specific need (an authorial, context-declared, non-learner-adaptive branch point in curriculum structure), so a narrow, purely additive extension to the existing `oe:Strand`/`oe:SubStrand` model is proposed rather than adopting an external standard that solves an adjacent but different problem.

## ID block reservation

None required — this RFC does not introduce a new vocabulary or LPM. §5 above uses existing per-LPM block capacity; see that section for the documentation-only convention proposed for `GOVERNANCE.md`.

## Files affected — all applied 2026-07-21

| File | Change | Status |
|---|---|---|
| `schemas/common.defs.yaml` | Add `$defs/contextAssumption` enum. | Applied (1.4.0 → 1.6.0, combined with RFC-0010) |
| `schemas/strand.schema.yaml` | Add `contextAssumption` and `trajectoryVariants` optional properties. | Applied (1.1.1 → 1.2.0) |
| `ontologies/core_v1.yaml` | Add `oe:contextAssumption` and `oe:hasTrajectoryVariant`. | Applied (1.3.1 → 1.5.0, combined with RFC-0010) |
| `GOVERNANCE.md` | Document the `0NN(k+4)` trajectory-variant ID convention in the Strand ID blocks section. | Applied |
| `docs/oecb_specifications.md` | Cross-reference §6.3/§7.3 to the new properties; spec version 0.4.0 → 0.5.0. | Applied |

## Review

- [x] Domain editor approval (schema/ontology domain) — Dustin Eirdosh, 2026-07-21
- [x] Maintainer approval — Dustin Eirdosh, 2026-07-21
- [x] Field names and semantics confirmed as drafted — `trajectoryVariants` confirmed as a **core schema field**, not nested under `extensions`
- [x] `0NN(k+4)` ID convention confirmed

Applied to `schemas/common.defs.yaml` (1.4.0 → 1.6.0, combined with RFC-0010), `schemas/strand.schema.yaml` (1.1.1 → 1.2.0), `ontologies/core_v1.yaml` (1.3.1 → 1.5.0, combined with RFC-0010), `GOVERNANCE.md`, and `docs/oecb_specifications.md` (0.4.0 → 0.5.0) on 2026-07-21. Verified against positive and negative test fixtures (valid `trajectoryVariants`/`contextAssumption` usage accepted; a variant missing `contextAssumption` correctly rejected) before real content was built on top of it. Regression-checked against both `bio-core-k12` and `oe-interdisciplinary-k12`'s existing strand files — no breakage.
