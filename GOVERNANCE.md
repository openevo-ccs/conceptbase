# OpenEvo ConceptBase — Governance

**Status:** Normative (per [`docs/oecb_specifications.md`](docs/oecb_specifications.md) §0.3). Where this document and the specification disagree on process, the specification is authoritative; this document exists to make that process operable day to day.

This document defines the RFC/review process by which the ConceptBase evolves, the entity lifecycle, versioning rules, and the identifier block-allocation registry contributors must follow when minting new IDs.

---

## Roles

| Role | Responsibility |
|---|---|
| **Maintainers** | Merge rights on `main`; final arbitration; cut releases. |
| **Domain editors** | Required reviewers for RFCs touching their vocabulary/subject domain. |
| **Contributors** | Anyone; submit RFCs via pull request. |

## RFC Process

Any addition of a Concept, relation, schema, or vocabulary **MUST** be submitted as a pull request against `/proposals/`, using the RFC template (motivation, proposed IRI under `www.w3id.org/openevo/`, relations, justification for why no existing standard covers the need — see spec §3 item 4 and §12). Review ceremony is split by status transition (RFC-0001, spec §11.2):

- Merging a new `OE-SANDBOX-CONCEPT-######` entry, or a `proposed`-status permanent-tier entry, needs only one maintainer approval (or a 5-business-day async no-objection window) — no domain editor sign-off required.
- The `proposed → accepted` transition, and sandbox → permanent promotion, still require at least one domain editor approval and one maintainer approval before merge — that's the point where the permanence guarantee actually begins to apply.

Changes to specification §3 (Design Principles) or §11 (Governance and Versioning) are **MAJOR** changes to the specification itself and require explicit maintainer consensus via an RFC tagged `type: specification-amendment` (spec §11.6).

## Lifecycle Status

Every entity carries a `status` field. Status transitions along the primary chain only move forward:

```
proposed → accepted → stable → deprecated → superseded
                                    ↘
                                     retracted
```

A status **MUST NOT** revert (e.g. `deprecated` back to `stable`) without a new RFC. `retracted` (RFC-0001) is a parallel terminal state reachable directly from `accepted` or `stable` — not sequential after `deprecated` — and does not imply supersession.

## Deprecation Policy

No entity is ever removed once `status: accepted` or higher. A deprecated entity **MUST**:

- Remain resolvable at its existing identifier indefinitely.
- Carry a `supersededBy` pointer to its replacement, where one exists.
- Continue to appear in query results, so dependent repositories are never silently broken.

A `retracted` entity (RFC-0001) follows the same rules but **MUST NOT** carry a `supersededBy` pointer — it means "accepted in error, or no longer endorsed," not "superseded." It **MAY** carry a `retractionNote`.

## Sandbox/Provisional Tier

Per spec §4.5 (RFC-0001), controlled-vocabulary concept entries may also be authored in a parallel, structurally distinct `OE-SANDBOX-CONCEPT-######` space, exempt from the Deprecation Policy above by construction — sandbox entries carry `sandboxMeta.status` (`active | archived | promoted`), never the `status` enum above. Every sandbox entry is stamped with a 12-month `expiresOn` at creation and auto-archived if not promoted through the ordinary RFC process before then. Spec §4.5 is authoritative; this section exists only to surface the rule here for day-to-day operability.

## Independent Versioning

Each vocabulary, schema, and ontology module versions independently using semver (MAJOR.MINOR.PATCH):

- **MAJOR** — a concept, class, or property is removed or redefined incompatibly.
- **MINOR** — additive change (new concept, new optional property, promoted reserved class).
- **PATCH** — non-semantic change (wording, typo correction).

There is no single "ConceptBase version" governing all artifacts at once.

### Filename-Versioning Convention

Three normative artifact types coexist in this repository with three different filename conventions, each intentional and now fixed going forward (no retroactive renames are required of existing Phase 1 files):

| Artifact type | Filename convention | Rationale |
|---|---|---|
| Ontology (`ontologies/`) | Bare `_v{MAJOR}` suffix (e.g. `core_v1.yaml`, becoming `core_v2.yaml` on the next MAJOR bump) | There is exactly one ontology; a major-only suffix signals breaking changes at a glance without churning the filename on every MINOR/PATCH release. MINOR/PATCH bumps update only the internal `version:` field. |
| Schemas (`schemas/`) | Unsuffixed (e.g. `strand.schema.yaml`) | Schemas are referenced by stable `$ref` paths from other schemas; embedding a version in the filename would break every cross-schema `$ref` on every bump. Version lives solely in the internal `meta.version` field. |
| Vocabularies (`vocabularies/`) | Full `MAJOR.MINOR.PATCH` semver suffix (e.g. `BIO-CORE-v1.0.0.yaml`) | The filename **MUST** match the `vocabRef` pattern (`schemas/common.defs.yaml#/$defs/vocabRef`) used to reference the vocabulary from `conceptbase.vocabularies` manifests and `definedInVocabulary` fields — the filename *is* part of the vocabulary's federated identity, so it **MUST** be renamed on every version bump (with the prior filename's content preserved under its own tag/commit for historical resolution). |

## Identifier Block Allocation

Every `OE-CONCEPT-######`, `OE-STRAND-######`, and `OE-LPM-######` identifier is permanent once `status: accepted` or higher (spec §4.4). To keep IDs collision-free across independently authored vocabularies and LPMs without a central sequence generator, each governed unit reserves a numeric block:

### Concept ID blocks (`OE-CONCEPT-0NNxxx`)

| Vocabulary | Block | Currently used |
|---|---|---|
| `BIO-CORE` | `000100`–`000199` | 101–116 |
| `OE-INTERDISCIPLINARY` | `000200`–`000299`, plus `000090`–`000099` for cross-cutting concepts shared with `BIO-CORE`'s numbering space | 090, 201–224 |

A new vocabulary reserves its own `000N00`–`000N99` block via its founding RFC (`/proposals/`), approved by a maintainer, before authoring any concept entries. Reserved blocks are recorded by adding a row to this table as part of that RFC — this table is the block registry.

### Strand ID blocks (`OE-STRAND-0NNxxx`)

Each LPM reserves one `000N00`–`000N99` block. Within it: `0NN0` is reserved for future use, top-level strands use `0NN1`–`0NN9` (currently `101`/`102`/`103` and `201`/`202`/`203`), and each top-level strand's SubStrands use the following ten-block (`0NN1` → substrands `111`–`114`; `0NN2` → substrands `121`–`124`; etc.), consistent with the existing K-2 / 3-5 / 6-8 / 9-12 four-substrand pattern.

| LPM | Block | Currently used |
|---|---|---|
| `bio-core-k12` (`OE-LPM-000001`) | `000100`–`000199` | 101–103 (strands), 111–114/121–124/131–134 (substrands) |
| `oe-interdisciplinary-k12` (`OE-LPM-000002`) | `000200`–`000299` | 201–203 (strands), 211–214/221–224/231–234 (substrands) |

### LPM ID blocks (`OE-LPM-######`)

Sequentially assigned, one ID per LPM, at RFC approval time — no sub-blocking needed since LPMs don't nest.

### Learning Object and Alignment ID blocks

Not yet allocated by block, since Phase 1 has zero Learning Object instances and only two Alignment records (`OE-ALIGN-000001`, `OE-ALIGN-000002`). Both `OE-LO-######` and `OE-ALIGN-######` are assigned sequentially for now; block allocation will be added to this table if/when a second independently governed repository starts minting either.

## Compatibility Checking

Per specification §10.3, a CI compatibility-checker (Phase 4 deliverable) **MUST**, on every push to a dependent repository, verify pinned-entity resolution, flag deprecated-without-acknowledgement references, flag newer-MAJOR-available pins, and (RFC-0001) loudly flag any reference to an `OE-SANDBOX-*` identifier. Until that tooling exists, dependent repositories are responsible for this verification manually.

## Tooling

This repository does not yet have a CI build/validation pipeline (spec §5.2, §13 — planned, not yet implemented). The only validation tooling that currently exists is:

- [`scripts/check_related_symmetry.py`](scripts/check_related_symmetry.py) — verifies that every `skos:related` assertion across `vocabularies/*.yaml` is reciprocated (SKOS's own symmetric-relation semantics, inherited by `oe:Concept`). Run manually: `python scripts/check_related_symmetry.py`.

Contributors adding new concepts with `skos:related` relations should run this script before opening a PR.
