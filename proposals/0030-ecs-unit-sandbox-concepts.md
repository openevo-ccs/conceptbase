# RFC-0030: Twenty-two sandbox concepts from the ECS unit (Evolution, Cooperation and Sustainability)

**Type:** `content`
**Status:** `proposed`
**Author(s):** Claude (drafting pass), for review by Dustin Eirdosh and Susan Hanisch. Drafted with AI assistance, open for review.
**Date:** 2026-11-25

## Motivation

The ECS unit (Hanisch, Eirdosh & Morgan, 2023, chapter 8) is modelled in an OpenLPM space. On 2026-11-05 its authors sorted the unit's 47 concepts into four groups: 3 that reuse an existing ConceptBase entry, 4 that add a sense to one, 17 that stay plain labels on purpose (they sit under a TheoryBase record or another base) and 23 that should become new concepts. None of the 23 has been filed. Learning-progression diagrams of the unit (structure of knowledge diagrams, drafted in lab_manager PR 129) need concept nodes that resolve to ConceptBase entries. In the first diagram, 19 of the 47 concept nodes are gaps for this reason.

Separately, two of the unit's ten principle classes (models and simulations; explaining behaviour by nearby and deep causes) held ideas and no concepts. Four concepts are added for the first of these and for comparing species with care.

## Proposed change

Twenty-two sandbox concepts in the existing `OE-INTERDISCIPLINARY-v1.0.0` vocabulary (the sandbox tier of RFC-0001, twelve months to expiry, one maintainer approval or a five-business-day no-objection window). No new vocabulary and no id block is needed.

- Common-Pool Resource
- Carrying Capacity
- Logistic Growth
- Maximum Sustainable Yield
- Diminishing Returns
- Efficiency
- Predator-Prey Dynamics
- Social Interaction
- Interdependence
- Free-Riding
- Collective Action
- Fairness
- Wicked Problems
- Fitness Interdependence
- Imitation Bias
- Complex Systems
- Emergence
- Non-Linear Change
- Model
- Simulation
- Chance in a model
- Comparing across species with care

**Definitions.** Where the unit's authors defined the term, the entry carries their definition (6 of the 18 that come from the unit's list). The other 12, and the four added ones, carry an AI draft that restates the unit's own wording. Each entry says which in `extensions.oe:ecs.origin.definitionAuthorship`. No person has reviewed the AI drafts, and they should be reworded or rejected in review.

**Left out on purpose.**
- Sustainability: draft proposal 14 of the lab's 2026-11-23 note already covers it (lab_manager, `conceptbase-draft-proposals-14-new-sandbox-concepts-2026-11-23.md`).
- Nearby cause and deep cause: proposal 10 of the same note (proximate and ultimate causes) covers them.
- The four concepts the authors proposed as new that ConceptBase already holds under the same label (kin selection, multilevel selection, group selection, frequency-dependent selection): reuse the BIO-CORE entries.
- The 17 plain labels and the 7 reuse or add-sense concepts: nothing to file here. Their stored ids need re-mapping on the ECS side, because the ECS vocabulary still holds ids from before the 2026-11-18 slug migration.

## Relations

Each entry lists `skos:related` links to existing entries the unit's authors named (mapped from their old numeric ids to current slug ids), and for the four added concepts to agent-based modeling, variation and comparative cognition. No `skos:broader` link is asserted.

## Standards justification

Not applicable: no new schema structure. The entries use the existing concept schema, with one namespaced extension (`oe:ecs.origin`) that records where each definition came from.

## ID block reservation

Not applicable. Sandbox ids are slugs (`OE-SANDBOX-CONCEPT-<vocab-slug>-<label-slug>`).

## Files affected

- `vocabularies/OE-INTERDISCIPLINARY-v1.0.0.yaml` (22 entries appended)
- `registry/concept/OE-SANDBOX-CONCEPT-oe-interdisciplinary-*.json` (22 new files, from `scripts/build_registry.py`)
- `proposals/RFC_LEDGER.md` (this RFC's row)
- `proposals/0030-ecs-unit-sandbox-concepts.md`

## Open questions for review

1. Should "Social Interaction" and "Efficiency" be concepts at all? They are broad terms in the unit's list. A reviewer may prefer to keep them as labels.
2. Is "Model" too general for the interdisciplinary vocabulary? Its definition follows the unit's own sentence about leaving things out on purpose.
3. Do the AI-drafted definitions hold up? Each is one or two sentences and can be replaced.
