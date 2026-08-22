# RFC-0018: Framework Relations, seeded with KMK Basiskonzepte Biologie coherence data

**Type:** `content`

**Status:** `proposed`
**Author(s):** OpenEvo ConceptBase Maintainers (drafted in support of KoMet, `openevo-ccs/KoMet`)
**Date:** 2026-08-22

## Motivation

`concept.schema.yaml`'s `relations` block only supports plain SKOS predicates
(`skos:broader`, `skos:narrower`, `skos:related`) between `oe:Concept`
instances. That covers taxonomic and associative relationships, but not
causal/mechanistic ones — and jurisdiction-specific organizing frameworks
like Germany's KMK "Basiskonzepte Biologie" are not `oe:Concept` instances in
the first place. EvoMentor's own `canonical-curriculum-item.schema.json`
already documents this explicitly: its `frameworkTags` field carries
Basiskonzepte tags through untouched because "this framework has no
ConceptBase representation."

That gap is not hypothetical. `EvoMentor_DE/data/basiskonzepte.json` (a real,
already-piloted Thuringia Gymnasium biology dataset) independently invented
its own ad hoc `bk_verbindungen` relation array to express exactly this need
— typed causal relations between the five KMK Basiskonzepte, with strings
like `ermöglicht` (enables), `wird_geregelt_durch` (is regulated by), and
`erklaert_entstehung_von` (explains the origin of). It is real, useful data
with no home in the shared FAIR infrastructure this ecosystem otherwise
relies on for exactly this kind of claim.

That same source data surfaced a concrete content gap worth fixing alongside
the schema gap: only one of the five Basiskonzepte (`bk_struktur_funktion`)
carried an explicit "is explained by evolution" relation back to
`bk_individuelle_evolutive_entwicklung`. The other three
(`bk_stoff_energie_umwandlung`, `bk_information_kommunikation`,
`bk_steuerung_regelung`) only had forward relations *toward* evolution
(enabling/regulating/implementing ontogeny), never the reverse claim that
their own existence is itself an evolutionary product — the biological
coherence thread associated with Dobzhansky's "nothing in biology makes
sense except in the light of evolution," left implicit for 3 of 5
Basiskonzepte. `basiskonzepte.json` v4.1 (2026-08-22) closes this, adding the
missing `wird_erklaert_durch`/`erklaert_entstehung_von` pairs with real
biological justification (evolutionary tinkering in metabolic pathways,
evolved rather than engineered signaling architecture, evolved control
architectures carrying historical trade-offs).

This RFC exists so that closed content gap has somewhere durable and
queryable to live, beyond one project's bespoke JSON file — and so the next
jurisdiction-specific framework (NGSS's practices/crosscutting concepts, a
future state's own Basiskonzepte variant) doesn't have to reinvent the same
ad hoc pattern a third time.

This is also directly relevant to KoMet (`openevo-ccs/KoMet`), whose own
subtitle is "Kohärenz durch Meta-Modellierung von Curricula" and whose
Framework connection notes propose a "Domain D: Curricular Meta-Modeling"
Computational Curriculum Competency. The KoMet strategy doc's proof-of-concept
roadmap (`Docs/KoMet_Grant_Strategy_and_Monitoring_Plan.md` §3) names "one
concrete interdisciplinary coherence demo" as the single most persuasive
artifact currently missing from the proposal. This RFC's seed content is a
smaller, already-available instance of exactly that claim (intra-subject
Basiskonzepte coherence, not yet interdisciplinary), buildable this semester
with no new infrastructure.

## Proposed change

Two new files, no changes to existing schemas:

1. **`/schemas/frameworkRelation.schema.yaml`** (new) — validates one typed
   relation record between two framework tags. Each record has `subject`,
   `object` (both `{frameworkId}:{tagId}` references, mirroring EvoMentor's
   own `frameworkTags` shape), a controlled `relationType` (`enables`,
   `requires`, `regulates`/`isRegulatedBy`, `implements`/`isImplementedBy`,
   `controls`/`isControlledBy`, `explainsOriginOf`/`isExplainedBy`),
   `assertedBy`, `date`, `status` (`proposed`/`accepted`/`contested`,
   mirroring `oe:Alignment`'s lifecycle), and free-text `rationale`.
   `frameworkId` is unconstrained (not an enum) so this generalizes past KMK
   Basiskonzepte to any future organizing framework, consistent with
   EvoMentor's own design choice for the same field.

2. **`/framework-relations/KMK-BASISKONZEPTE-BIOLOGIE-RELATIONS-v1.0.0.yaml`**
   (new) — 23 relation records transcribed directly from
   `EvoMentor_DE/data/basiskonzepte.json` v4.1's `bk_verbindungen` arrays
   (all five Basiskonzepte, not only the evolution-relevant subset),
   `conformsTo: OE-SCHEMA-FRAMEWORK-RELATION-v1.0.0`. Validated locally
   against the schema above with zero errors (23/23 records, 0 duplicate
   ids, all 10 relation types exercised) — see this RFC's commit for the
   validation run. `status: proposed` throughout, matching the schema's own
   `status: proposed`; nothing here is asserted as `accepted`.

No existing file changes. `concept.schema.yaml`, `alignment.schema.yaml`,
and `common.defs.yaml` are untouched — this is additive.

## Relations

- **Complements, does not replace, `concept.schema.yaml`'s `relations`
  block.** SKOS relations between `oe:Concept` instances are unaffected;
  `oe:FrameworkRelation` is a parallel mechanism for a different class of
  entity (framework tags) and a different class of claim (causal, not
  taxonomic).
- **Complements, does not replace, `alignment.schema.yaml`.** `oe:Alignment`
  asserts cross-vocabulary equivalence/closeness between concepts that
  already denote related ideas; `oe:FrameworkRelation` asserts causal
  structure among tags in one (or, in the general case, two) organizing
  framework(s). Different entities, different predicate vocabularies,
  different question being answered.
- Each `explainsOriginOf`/`isExplainedBy` pair in the seed content is a
  direct instance of the coherence claim `EvoMentor` (canonical-curriculum-
  item schema) and `KoMet` (Framework connection notes, Domain B/D) both
  gesture at in prose — this RFC is what makes it checkable data instead.

## Standards justification

Per spec §3 item 4: SKOS was evaluated and rejected as sufficient, because
SKOS's relation vocabulary (`broader`/`narrower`/`related`/`exactMatch`/etc.)
is taxonomic/associative by design and has no causal or directional-mechanism
semantics — there is no SKOS predicate that means "enables" or "explains the
origin of." IEEE LOM and xAPI were considered and are the wrong layer (they
describe learning objects/activity statements, not relations between
curriculum-framework concepts). No existing standard in the ecosystem's
usual comparison set (SKOS, CASE, IEEE LOM, xAPI, schema.org) covers typed
causal relations between curriculum-framework tags, so this RFC introduces a
novel, narrowly-scoped schema rather than reusing/profiling an existing one.

## ID block reservation

`OE-FRAMEWORK-RELATION-######` — assigned sequentially for now (Phase 1,
first-ever instances), following the same precedent GOVERNANCE.md already
applies to `OE-LO-######` and `OE-ALIGN-######`: block allocation is deferred
until a second independently governed repository starts minting this id
space. This RFC's seed content consumes `OE-FRAMEWORK-RELATION-000001`
through `-000023`.

## Files affected

- `schemas/frameworkRelation.schema.yaml` (new)
- `framework-relations/KMK-BASISKONZEPTE-BIOLOGIE-RELATIONS-v1.0.0.yaml` (new)
- `GOVERNANCE.md` — once accepted, add a short entry under "Learning Object
  and Alignment ID blocks" (or a new adjacent subsection) documenting the
  `OE-FRAMEWORK-RELATION-######` sequential-allocation precedent, mirroring
  the existing `OE-LO`/`OE-ALIGN` entry. Not changed by this RFC itself —
  left for the merge step, consistent with how prior content RFCs in this
  repo (e.g. RFC-0006/0007 vocabulary RFCs) treat GOVERNANCE.md updates as
  part of acceptance, not part of the proposal diff.
- `scripts/build_registry.py` / `scripts/validate.py` — would need a small
  addition to pick up `/framework-relations/*.yaml` in CI validation, same
  pattern as `/alignments/*.yaml`. Not made in this RFC (out of scope for a
  content proposal; flagged here so reviewers can scope the follow-up
  implementation PR).

## Review

- [ ] Domain editor approval (required for RFCs touching a specific
      vocabulary/subject domain — biology/Basiskonzepte editor)
- [ ] Maintainer approval
