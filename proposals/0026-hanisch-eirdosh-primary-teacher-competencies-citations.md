# RFC-0026: Citation evidence from Hanisch & Eirdosh (2023) on 9 existing BIO-CORE / OE-INTERDISCIPLINARY concepts

**Type:** `content`
**Status:** `proposed`
**Author(s):** agent:claude-code/claude-sonnet-5, requested by Dustin Eirdosh
**Date:** 2026-10-23

## Motivation

Dustin Eirdosh (co-author) asked for a full ingestion of Hanisch & Eirdosh (2023), "Developing
Teacher Competencies for Teaching Evolution across the Primary School Curriculum" (*Education
Sciences* 13(8):797, DOI `10.3390/educsci13080797`), across ConceptBase, MethodsBase, and
LiteratureBase. LiteratureBase and MethodsBase both already have a citation record / new method
records for this paper (see `literaturebase` PR #11 and `methodsbase` PR #6, both open at the
time of this RFC). ConceptBase is the third leg: the paper's Table 1 and Table 2 synthesize the
existing evolution-education literature's instructional methods for roughly 20 evolutionary/
interdisciplinary concept themes, and several of those concepts already exist in this repo's
`BIO-CORE` and `OE-INTERDISCIPLINARY` vocabularies. Those existing concepts currently carry no
citation evidence at all pointing to this paper (or, in most cases, to any primary-school-level
pedagogical source), despite it being a directly on-topic, peer-reviewed synthesis of exactly
what each concept's `citations[]` field exists for.

This RFC does **not** propose any new Concept, relation, or schema change — it proposes adding
one `citations[]` entry, using the existing `common.defs.yaml#/$defs/citation` shape (`text` /
`url` / `doi`), to each of 9 already-`accepted`/`stable` concepts below. It is filed as an RFC
rather than a direct edit because `CONTRIBUTING.md` states every change to a Concept goes through
this process, with no carve-out for additive evidence on an existing entry — this RFC follows
that rule rather than assuming an exception.

## Proposed change

Add one entry to each target concept's `citations[]` array:

```yaml
- text: "Hanisch, S., & Eirdosh, D. (2023). Developing Teacher Competencies for Teaching Evolution
    across the Primary School Curriculum: A Design Study of a Pre-Service Teacher Education
    Module. Education Sciences, 13(8), 797."
  doi: "10.3390/educsci13080797"
```

To these 9 concepts:

| Concept ID | Vocabulary | Why this paper is relevant evidence |
|---|---|---|
| `OE-CONCEPT-bio-core-natural-selection` | BIO-CORE | Table 1's largest theme: methods for teaching natural selection while addressing teleological thinking (story books, simulation games, domesticated-animal examples, computer models). |
| `OE-CONCEPT-bio-core-adaptation` | BIO-CORE | Table 1: exploring organisms' traits and environmental function as a stepping-stone to adaptation. |
| `OE-CONCEPT-bio-core-inheritance` | BIO-CORE | Table 1: observing family resemblance, seed-saving, and the biological-vs-cultural-inheritance distinction via adoption/migration vignettes. |
| `OE-CONCEPT-bio-core-drift` | BIO-CORE | Table 1: simulation games for genetic drift/founder effect, a theme the paper notes is otherwise rarely addressed at the primary level. |
| `OE-CONCEPT-bio-core-common-ancestor` | BIO-CORE | Table 1: family-tree and evolutionary-tree-modeling activities building toward common ancestry and tree thinking. |
| `OE-CONCEPT-bio-core-speciation` | BIO-CORE | Table 1: stories of geographic isolation as the entry point to divergence between populations. |
| `OE-CONCEPT-oe-interdisciplinary-variation` | OE-INTERDISCIPLINARY | Table 1's foundational theme: documenting within-species variation among students and other species, addressing essentialism directly. |
| `OE-CONCEPT-oe-interdisciplinary-selection` | OE-INTERDISCIPLINARY | The cross-cutting process underlying both Table 1 (natural/sexual/artificial selection) and Table 2 (selection as a mechanism in cultural-evolution/iterative-design activities). |
| `OE-CONCEPT-oe-interdisciplinary-cooperation` | OE-INTERDISCIPLINARY | Table 2's explicit argument that cooperation is underused relative to competition/predator-prey framings in primary evolution education, with a stone-age collective-hunt game and cooperative-group natural-selection story as concrete methods. |

Not proposed in this RFC (deliberately scoped down, see "Files affected" for the fuller map): the
paper's other Table 1/2 themes (deep time, sexual selection as its own row, cultural evolution via
iterative design, teaching/language evolution, emotions, evolutionary mismatch, individual-level
adaptation, our evolved sense of fairness) either have no clearly-matching existing ConceptBase
concept yet, or a match exists but is lower-confidence than the 9 above. A full concept-by-concept
map, including which themes have no existing concept at all, is kept in
`lab_manager/docs/design-notes/` (see that repo's note on this ingestion) for whoever picks up a
follow-on RFC proposing new concepts for the uncovered themes, rather than rushed into this one.

## Relations

Purely additive to 9 existing, already-`accepted`/`stable` concepts. No `skos:broader`/`narrower`/
`related` edges are added or changed. No new IRIs are minted.

## Standards justification

Not a novel structure — this reuses the existing `citation` definition in `common.defs.yaml`
exactly as specified (RFC-0002's original profile), applied to 9 additional entries. No new
standard or structure is introduced.

## ID block reservation

Not applicable — no new vocabulary, LPM, or Concept; only additive citation evidence on existing
entries.

## Files affected

| File | Change |
|---|---|
| `vocabularies/BIO-CORE-v1.0.0.yaml` | Add one `citations[]` entry each to `bio-core-natural-selection`, `bio-core-adaptation`, `bio-core-inheritance`, `bio-core-drift`, `bio-core-common-ancestor`, `bio-core-speciation`. Patch version bump per `GOVERNANCE.md`'s additive-change rule. |
| `vocabularies/OE-INTERDISCIPLINARY-v1.0.0.yaml` | Add one `citations[]` entry each to `oe-interdisciplinary-variation`, `oe-interdisciplinary-selection`, `oe-interdisciplinary-cooperation`. Patch version bump. |

Not yet implemented in this RFC (left for review feedback to confirm scope before more are added):
the actual YAML edits are not included in this proposal text — per this repo's RFC-first process,
the edits themselves would be made after this RFC's motivation and concept list are reviewed, to
avoid producing a diff before the target list is confirmed correct.

## Review

Per `lab_manager/docs/design-notes/rfc-governance-proportionality-review-and-lightweight-proposal.md`
(2026-08-26, Dustin): this repo has one actual decision-maker, so this RFC skips the
Domain-editor/Maintainer two-checkbox split (the same person checking both boxes isn't a second
opinion) in favor of a single honest line. ConceptBase's own `TEMPLATE.md` hasn't had the
mechanical Phase-B rollout of that decision applied yet, so this is written in the decision's
spirit rather than matching the current template byte-for-byte.

Accepted — pending. Will read: `Accepted — <name>, <date>, <context>` once reviewed.
