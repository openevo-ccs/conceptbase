# RFC-0017: Three sandbox-tier `OE-INTERDISCIPLINARY` concepts (Theory of Mind, Metacognition, Intuitive Theories)

**Type:** `content`
**Status:** `proposed`
**Author(s):** Claude (drafting pass, per RFC-0007/RFC-0016's precedent for maintainer-authored
content RFCs), for review by Dustin Eirdosh
**Date:** 2026-08-01

## Motivation

While building a crosswalk between `eva-graph`'s `mpi_eva/sub-units/ccp/metarepresentation`
knowledge graph (a real, working CCP-department tool on animal/human metarepresentation and
theory-of-mind research) and OpenEvo ConceptBase — direct `conceptbase_search` lookups against the
live registry found zero matches for three constructs that are central to that tool's entire
subject matter: **theory of mind / mental-state attribution**, **metacognition**, and **intuitive
theories** (the "folk physics/biology/psychology" sense, distinct from `oe:Concept` the schema
type). All three have real, citation-backed source material already sitting in
`metarepresentation`'s own `core.json`/`capacities.json`/`nodes/` — this is a found gap, not
speculative content invented for this RFC. Full crosswalk method and results:
`eva-graph/mpi_eva/sub-units/ccp/metarepresentation/metadata/openevo_ccs_crosswalk.json` and
`eva-graph/docs/metarepresentation-reusable-pattern-and-base-repo-crosswalk.md` (branch
`metarepresentation-pattern-template-and-crosswalk-evaluation`, not yet merged).

## Proposed change

Three new **sandbox-tier** concepts (`OE-SANDBOX-CONCEPT-000007`–`000009`) under
`OE-INTERDISCIPLINARY-v1.0.0` — the lightweight review path (GOVERNANCE.md, Sandbox/Provisional
Tier: single maintainer approval or 5-business-day no-objection window, no domain-editor sign-off
required, 12-month TTL) rather than the full `proposed → accepted` permanent-tier path, since none
of these have had any expert review yet:

- **`OE-SANDBOX-CONCEPT-000007` — Theory of Mind**: "The capacity to attribute mental states —
  beliefs, desires, intentions, knowledge — to oneself and others, and to use those attributions to
  interpret and predict behavior."
- **`OE-SANDBOX-CONCEPT-000008` — Metacognition**: "The capacity to monitor, evaluate, and
  regulate one's own cognitive processes — knowing what one knows, tracking how one is thinking,
  and adjusting strategies accordingly."
- **`OE-SANDBOX-CONCEPT-000009` — Intuitive Theories**: "Informal, domain-specific causal
  frameworks — folk physics, folk biology, folk psychology — that people spontaneously construct to
  explain and predict how the world works, typically without formal instruction."

Same MPI-EVA lineage as `OE-SANDBOX-LPM-000003` ("OE-Interdisciplinary: MPI-EVA Cross-Disciplinary
Capstone," authored 2026-07-21) and its four grounding sandbox concepts (`OE-SANDBOX-CONCEPT-000003`–`000006`)
— this RFC continues that same authoring context rather than starting a new one, though these three
entries are not yet wired into that capstone's own strand content (a separate, future step, not
assumed here).

## Relations

`skos:related`, reciprocated on both sides per `check_related_symmetry.py` (confirmed passing):

- Theory of Mind ↔ `OE-CONCEPT-000211` (Agency), `OE-SANDBOX-CONCEPT-000004` (Comparative
  Cognition), `OE-SANDBOX-CONCEPT-000008` (Metacognition), `OE-SANDBOX-CONCEPT-000009` (Intuitive
  Theories)
- Metacognition ↔ `OE-CONCEPT-000224` (Distributed Cognition), `OE-SANDBOX-CONCEPT-000007`
- Intuitive Theories ↔ `OE-SANDBOX-CONCEPT-000004` (Comparative Cognition), `OE-SANDBOX-CONCEPT-000007`

No relation asserted to `metarepresentation`'s own node ids (that graph is a separate, non-OECB
system per `eva-institutional-intelligence-platform-vision-and-integration-strategy.md`) — the
`openevo_ccs_crosswalk.json` file in `eva-graph` is the pointer in that direction, kept local to
that repo per the established "core record stays canonical, field-specific interpretation stays
local to the referencing repo" split (HumanBase/LiteratureBase's own schemas use the same rule).

## Standards justification

Not a novel structure — profiles `oe:Concept` (RFC-0001/0002) exactly as every other
`OE-INTERDISCIPLINARY` entry does. No new schema, no new class, no new relation type.

## ID block reservation

Not applicable — sandbox-tier concept ids are assigned sequentially within their own namespace,
independent of the permanent-tier block allocation (GOVERNANCE.md, Sandbox/Provisional Tier
section). `000007`–`000009` continue the existing `OE-SANDBOX-CONCEPT-######` sequence
(`000001`–`000006` already in use).

## Files affected

| File | Change | Status |
|---|---|---|
| `vocabularies/OE-INTERDISCIPLINARY-v1.0.0.yaml` | 3 new sandbox concept entries appended; reciprocal `skos:related` additions to `OE-CONCEPT-000211`, `OE-CONCEPT-000224`, `OE-SANDBOX-CONCEPT-000004` | Done, 2026-08-01 |
| `registry/concept/OE-SANDBOX-CONCEPT-000007.json`, `-000008.json`, `-000009.json` | New — generated via `scripts/build_registry.py` | Done, 2026-08-01 |
| `registry/concept/OE-CONCEPT-000211.json`, `OE-CONCEPT-000224.json`, `OE-SANDBOX-CONCEPT-000004.json` | Regenerated (reciprocal relations) | Done, 2026-08-01 |
| `registry/competency/OE-COMPETENCY-000700.json`–`000720.json` | Regenerated — **unrelated pre-existing drift** (EVO-ED-ASSESSMENT-TARGETS/RFC-0014 competencies never had the registry built for them), caught incidentally by running the generator as a baseline check, committed as its own separate commit before this RFC's actual content | Done, 2026-08-01 |
| `scripts/validate.py` (`schemas/concept.schema.yaml` against the vocabulary) | Confirms all 31 `OE-INTERDISCIPLINARY` entries pass, including the 3 new ones | Confirmed, 2026-08-01 |
| `scripts/check_related_symmetry.py` | Confirms symmetric across all 49 concepts in 5 vocabularies | Confirmed, 2026-08-01 |

## Review

- [ ] Domain editor approval — not required for sandbox-tier entries (GOVERNANCE.md); noted for
      completeness only
- [ ] Maintainer approval (or 5-business-day async no-objection window, per sandbox-tier process)
- [ ] Confirm whether these three should eventually be wired into `OE-SANDBOX-LPM-000003`'s (MPI-EVA
      capstone) own strand content, or stay standalone — not decided in this pass
- [ ] Confirm whether promotion to permanent tier is worth pursuing once `metarepresentation`'s own
      content has had any external review, given real source material already exists for all three
