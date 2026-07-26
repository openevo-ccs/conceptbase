# `ontologies/` — moved

The `oe:` upper ontology (`core_v1.yaml`) that used to live in this directory moved to
[`openevo-core/ontologies/core_v1.yaml`](https://github.com/openevo-ccs/openevo-core/blob/main/ontologies/core_v1.yaml)
on 2026-07-26, unchanged in content — no class, property, or version number
changed as part of the move.

**Why:** the `oe:` upper ontology is shared infrastructure across all nine
Foundational Repos (ConceptBase, CompetencyBase, TeachingBase, ProjectBase,
LiteratureBase, HumanBase, TheoryBase, QuestionBase, MethodsBase), not
ConceptBase's own content — it only lived here because ConceptBase was, for
a time, the only mature repo in the ecosystem. See
[`proposals/0013-openevo-core-kernel-migration.md`](../proposals/0013-openevo-core-kernel-migration.md)
for this repo's own record of the change, and
[`openevo-core`'s founding RFC](https://github.com/openevo-ccs/openevo-core/blob/main/proposals/0001-shared-kernel-founding-and-migration.md)
for the full rationale.

**What didn't move:** `../schemas/`, `../vocabularies/`, `../alignments/` — those
are ConceptBase's own entity-specific content (Concept/LPM/Strand/Competency/
Alignment identifier patterns and vocabularies), unaffected by this change.
ConceptBase's own `oe:Concept`/`oe:LPM`/`oe:Strand`/`oe:LearningObject`/
`oe:Competency` *instances* are equally unaffected — this repo remains their
canonical registry.
