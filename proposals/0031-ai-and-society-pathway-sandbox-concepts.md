# RFC-0031: Eight sandbox concepts for the AI and society pathway of the ECS unit

**Type:** `content`
**Status:** `proposed`
**Author(s):** Claude (drafting pass), for review by Dustin Eirdosh and Susan Hanisch. Drafted with AI assistance, open for review.
**Date:** 2026-11-25

## Motivation

The ECS unit (Evolution, Cooperation and Sustainability; Hanisch, Eirdosh & Morgan, 2023) is being extended by a six-module pathway on people, machines and the commons. The pathway asks the unit's two guiding questions again for groups that now include machines, and it rests on one idea: collective information processing (Anwarzai et al. 2026), whose two parts are individuals processing information about the group and the group's sensitivity to how individual information is arranged.

ConceptBase already holds the broad concepts the pathway needs (Machine Culture, Hybrid Social Learning, Collective Intelligence, Selection, Variation, Technology, Agency). A search on 2026-11-25 found no entry for the eight terms below.

## Proposed change

Eight sandbox concepts in the existing `OE-INTERDISCIPLINARY-v1.0.0` vocabulary (the sandbox tier of RFC-0001, twelve months to expiry):

- Collective Information Processing
- Algorithmic Selection
- Generative Model
- Model Collapse
- Knowledge Commons
- Anthropomorphism
- Algorithm Aversion
- AI Development Race

Each entry has a definition drafted from the source it cites (a paper's abstract or, for Machine Culture terms, the lab's own TheoryBase statements), a short wording for students, an example and a non-example, and `skos:related` links to entries that exist on `main`. Each carries the namespaced extension `oe:ecs.origin` with the source of the definition and the review label.

**What the definitions rest on.** Collective Information Processing rests on the abstract of Anwarzai et al. (2026). Model Collapse rests on the abstract of Shumailov et al. (2024). Algorithm Aversion rests on the title and design of Dietvorst et al. (2015). AI Development Race rests on the abstract of Han et al. (2020). Algorithmic Selection and Generative Model rest on Brinkmann et al. (2023) as summarized in the lab's TheoryBase records. Anthropomorphism is a general definition with Heider and Simmel (1944) as a classic demonstration. Knowledge Commons rests on Hess and Ostrom (2007). The full texts of the 2025 and 2026 papers were not read for this draft.

**Left out on purpose.**
- Common-pool resource, social dilemma, free-riding: RFC-0030 (open) proposes them.
- Moral agent, moral patient, moral proxy: the three roles of Bonnefon, Rahwan and Shariff (2024) are worth entries once a reviewer who knows that literature has looked at them.
- Mind perception, trust calibration and recommender system as separate entries: the first two overlap with Anthropomorphism and Algorithm Aversion, and the third with Algorithmic Selection.

## Relations

All `skos:related` targets exist on `main`: Collective Intelligence, Distributed Cognition, Information, Knowledge, Selection, Variation, Technology, Agency, Learning, Machine Culture, Hybrid Social Learning, Comparative Cognition. No `skos:broader` or `skos:narrower` links are proposed, so the existing entries need no edit. The symmetry check lists the new links as not reciprocated, as it does for many existing entries.

## Standards justification

Not applicable: no new schema structure. The entries use the existing concept schema with the same namespaced extension as RFC-0030.

## ID block reservation

Not applicable. Sandbox ids are slugs (`OE-SANDBOX-CONCEPT-<vocab-slug>-<label-slug>`).

## Files affected

- `vocabularies/OE-INTERDISCIPLINARY-v1.0.0.yaml` (8 entries appended)
- `registry/concept/OE-SANDBOX-CONCEPT-oe-interdisciplinary-*.json` (8 new files, from `scripts/build_registry.py`)
- `proposals/RFC_LEDGER.md` (this RFC's row)
- `proposals/0031-ai-and-society-pathway-sandbox-concepts.md`

The registry build also wanted to regenerate other files on this machine (nine design-concept files, many alignment files, three sandbox files), and stopped at a file name too long for Windows. Only the eight new files are committed here.

## Open questions for review

1. Is Anthropomorphism better kept as a student-facing label that points to Agency, or as its own concept?
2. Should Algorithm Aversion carry the narrower claim of the original experiment (forecasting tasks) in its definition?
3. The Model Collapse entry reports a finding of one paper, with preliminary status in the lab's machine culture records. Should a sandbox concept hold a finding, or only a name for the phenomenon?
4. RFC-0030 (open) uses number 0030, so this RFC takes 0031. If 0030 is withdrawn, renumber.
