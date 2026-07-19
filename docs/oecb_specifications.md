# OpenEvo ConceptBase — Formal Infrastructure Specification

**Document status:** Normative
**Specification version:** 0.3.0
**Namespace:** `https://www.w3id.org/openevo/`
**Repository:** `github.com/openevo-ccs/conceptbase`
**License:** CC-BY-4.0 (this document and all ontology/schema/vocabulary artifacts); MIT (build and validation tooling)
**Editors:** OpenEvo Computational Curriculum Studies (CCS) Lab

---

## 0. Front Matter

### 0.1 Conformance Language

The keywords **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, **MAY**, and **REQUIRED** in this document are to be interpreted as described in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt). This specification uses them to distinguish binding requirements on conformant repositories and tooling from recommendations and optional extensions.

### 0.2 Purpose of This Document

This specification is the authoritative, normative description of the OpenEvo ConceptBase (OECB): its data model, namespace and identifier architecture, schema layer, controlled vocabulary structure, governance process, versioning rules, and conformance requirements. Where this document and any other artifact in the repository (README, code comments, prior draft specifications) disagree, **this document is the source of truth**.

This document supersedes all prior draft specifications (v0.1, v0.2-draft) circulated during the design phase of the ConceptBase.

### 0.3 Relationship to Other Documents

| Document | Role |
|---|---|
| This specification | Normative — defines what OECB *is* |
| `GOVERNANCE.md` | Normative — defines the RFC/review *process* by which this specification evolves |
| `CONTRIBUTING.md` | Informative — practical guide for contributors |
| `ontologies/core_v1.yaml`, `schemas/*.yaml` | Normative — machine-readable instantiations of §6 and §7 of this specification |
| `README.md` | Informative — orientation and quickstart, not authoritative on any technical detail |

---

## 1. Introduction and Scope

### 1.1 What OECB Is

The OpenEvo ConceptBase is the semantic registry infrastructure for the OpenEvo Computational Curriculum Studies ecosystem. It defines the ontology, schemas, controlled vocabularies, persistent identifiers, and validation rules that allow independently developed and independently governed repositories — Learning Progression Models (LPMs), Collections, Strand repositories, assessment banks, and AI-assisted curriculum tools — to interoperate through a shared, machine-readable data model.

OECB is analogous in architectural role to a package registry (e.g., npm) or a standards body (e.g., schema.org, SKOS): it defines a shared grammar and a shared set of stable identifiers, but it does not itself contain the artifacts built on top of it.

### 1.2 What OECB Is Not

OECB **MUST NOT** contain:

- Lesson plans, instructional units, or complete curricula.
- Complete Learning Progression Models, Collections, or Strand content.
- Assessment items, student data, or learner-facing materials.
- Multimedia or learning resources.

These artifacts live in independently governed repositories that *depend on* OECB (§10).

### 1.3 Scope of This Specification

This document specifies:

1. The namespace and persistent identifier architecture (§4).
2. The layered technical architecture — authoring format, compiled representation, query surface (§5).
3. The core ontology: classes, properties, and extension rules (§6).
4. The JSON Schema validation layer (§7).
5. The structure and disambiguation model of controlled vocabularies (§8).
6. The (forward-declared, Phase 2) cross-vocabulary alignment model (§9).
7. The federated repository dependency model (§10).
8. Governance, versioning, and deprecation rules (§11).
9. Standards alignment and profiling obligations (§12).
10. Validation and compatibility-checking requirements (§13).
11. The phased rollout plan and its normative implications (§14).
12. Conformance levels for repositories and tooling claiming OECB compatibility (§16).

---

## 2. Terminology

| Term | Definition |
|---|---|
| **Entity** | Any instance of an OECB ontology class (`oe:Concept`, `oe:LPM`, `oe:Strand`, `oe:SubStrand`, `oe:LearningObject`, and reserved future classes). |
| **Concept** | An instance of `oe:Concept` — a disambiguated unit of curricular meaning defined within exactly one controlled vocabulary. |
| **Vocabulary** | A versioned, governed collection of Concept instances sharing a scope and discipline (e.g., `BIO-CORE-v1.0.0`). |
| **LPM** | Learning Progression Model — a top-level structural container referencing Strands across a developmental span. |
| **Strand / SubStrand** | A thematic thread of curriculum structure; SubStrand is a subclass of Strand enabling recursive nesting. |
| **Alignment** | A Phase 2 artifact asserting a SKOS-typed relationship (e.g., `skos:closeMatch`) between Concepts in different vocabularies, carrying provenance. |
| **Manifest** | The `conceptbase:` block a dependent repository declares, pinning ontology and vocabulary versions it was built against. |
| **Dependent repository** | Any repository (LPM, Collection, Strand, tool) that references OECB entities via its manifest. |
| **RFC** | A structured change proposal submitted per the governance process (§11). |

---

## 3. Design Principles

OECB is governed by the following non-negotiable design commitments. Any proposed change that violates one of these principles **MUST** be rejected during RFC review unless the principle itself is formally amended (§11.6).

1. **Infrastructure, not content.** OECB defines representational capacity; it does not adjudicate curricular, theoretical, or pedagogical questions (§1.2, §8.6).
2. **FAIR by construction.** Every entity **MUST** be Findable (persistent identifier), Accessible (open license, resolvable URI), Interoperable (typed relations via existing standards), and Reusable (versioned, provenance-tracked) from the moment it is accepted, not retrofitted later.
3. **Git-native authoring, compiled distribution.** All entities **MUST** be authored as human-reviewable YAML through pull requests. Compiled RDF/JSON-LD, SPARQL endpoints, and flat JSON indices are build artifacts and **MUST NOT** be hand-edited (§5).
4. **Standards reuse over reinvention.** Any RFC proposing a novel schema structure **MUST** document why no existing standard (SKOS, CASE, IEEE LOM, xAPI, schema.org) already satisfies the need (§12).
5. **Never delete, always deprecate.** No entity is ever removed once `status: accepted` or higher. Deprecated entities remain resolvable indefinitely with a `supersededBy` pointer (§11.4). This guarantee applies to the permanent identifier space (`OE-*`); the parallel sandbox/provisional tier (`OE-SANDBOX-*`) is explicitly exempt by construction, not by exception carved into this rule — see §4.5.
6. **Independent versioning per artifact.** The ontology, each vocabulary, and each schema version independently using semver; there is no single monolithic "ConceptBase version" (§11.5).
7. **Theoretical pluralism as a first-class capability.** Where a field contains genuine, unresolved theoretical disagreement, OECB **MUST** support multiple internally consistent vocabularies representing competing positions rather than adjudicating between them in the infrastructure layer (§8.6).

---

## 4. Namespace and Identifier Architecture

### 4.1 Canonical Namespace

The canonical namespace for all OECB-minted IRIs is:

```
https://www.w3id.org/openevo/
```

This namespace **MUST** be registered with the [w3id.org permanent identifier redirection service](https://github.com/perma-id/w3id.org), which decouples the identifier from the physical hosting location of the resolver. Migration of underlying infrastructure **MUST NOT** require re-minting any identifier; only the w3id.org redirect target is updated.

### 4.2 Sub-path Structure

| Sub-path | Resolves to |
|---|---|
| `.../ontology#{ClassName}` | Ontology class or property definition (§6) |
| `.../concept/{id}` | A Concept instance, content-negotiated (JSON-LD, HTML, flat JSON) |
| `.../lpm/{id}` | An LPM instance |
| `.../strand/{id}` | A Strand/SubStrand instance |
| `.../vocab/{name}` | A vocabulary registry entry |
| `.../schemas/{name}.schema.json` | A JSON Schema document identity (distinct concern from RDF resolution; see §7.1) |

### 4.3 Identifier Patterns

All entity identifiers **MUST** conform to the following patterns, enforced by `schemas/common.defs.yaml`:

| Entity type | Pattern | Example |
|---|---|---|
| Concept | `^OE-CONCEPT-[0-9]{6}$` | `OE-CONCEPT-000213` |
| LPM | `^OE-LPM-[0-9]{6}$` | `OE-LPM-000001` |
| Strand/SubStrand | `^OE-STRAND-[0-9]{6}$` | `OE-STRAND-000101` |
| Vocabulary reference | `^[A-Z0-9\-]+-v[0-9]+\.[0-9]+\.[0-9]+$` | `BIO-CORE-v1.0.0` |

### 4.4 Identifier Permanence

An identifier, once assigned to an entity with `status` at or above `accepted`, **MUST NOT** be reassigned, reused, or removed for the lifetime of the namespace. Labels, definitions, and relations attached to an identifier **MAY** change across versions; the identifier itself **MUST NOT**.

### 4.5 Sandbox/Provisional Tier

To allow lightweight experimentation without every draft immediately taking on the permanence guarantee of §4.4, OECB defines a parallel, structurally distinct identifier tier (introduced by RFC-0001):

- **Pattern**: `^OE-SANDBOX-CONCEPT-[0-9]{6}$` (`schemas/common.defs.yaml#/$defs/sandboxConceptId`), never mistakable for the permanent `OE-CONCEPT-######` pattern. Scoped to controlled-vocabulary concept entries only; sandbox identifiers for other entity types are out of scope until a future RFC establishes a concrete need.
- **Status**: sandbox entries carry `sandboxMeta.status` (`active | archived | promoted`) — a wholly separate, smaller vocabulary from the permanent-tier `status` enum (§11.3). They **MUST NOT** carry that enum, which is what exempts them from §3 item 5 / §11.4's never-delete guarantee by construction rather than by exception.
- **TTL**: every sandbox entry **MUST** carry `sandboxMeta.created` and `sandboxMeta.expiresOn`, the latter set 12 months out at authoring time (IETF Internet-Draft convention). An entry not promoted before `expiresOn` **MUST** be auto-archived (`sandboxMeta.status: archived`).
- **Promotion**: moving a sandbox entry into the permanent tier (minting a new `OE-CONCEPT-######`) **MUST** go through the ordinary RFC process in full (§11.2) — nothing skips review on the way to becoming a citable, permanent entity.
- **Compatibility checking**: per §10.3, the future compatibility checker **MUST** flag any dependent-repo manifest referencing a `SANDBOX` identifier, since that repo is knowingly depending on something with no permanence guarantee.

---

## 5. Layered Technical Architecture

OECB uses a three-layer architecture separating human authorship from machine consumption.

### 5.1 Authoring Layer (YAML)

All source content — ontology, schemas, vocabularies, alignments — **MUST** be authored in YAML and reviewed via GitHub pull request. This layer prioritizes human readability, diffability, and low barrier to contribution over machine efficiency.

### 5.2 Compiled Layer (RDF / JSON-LD)

A CI build pipeline (`/build/`) **MUST** compile authoring-layer YAML into:

- **JSON-LD / RDF**, using the `@context` mappings declared in `ontologies/core_v1.yaml`, conformant to the namespace in §4.
- A **SHACL or JSON Schema validation pass**, rejecting non-conformant instances before compilation proceeds.

Compiled outputs are build artifacts. They **MUST NOT** be hand-edited; any correction **MUST** originate in the authoring layer and be recompiled.

### 5.3 Query Layer

Two query surfaces **MUST** be generated from each tagged release:

1. **A flat JSON index** (`registry/index.json`) — ID-to-entity lookup, sufficient for the majority of dependent-repository tooling needs without standing up a graph store.
2. **A SPARQL-queryable graph** (hosted endpoint or embeddable store, e.g., Oxigraph), supporting relational queries across SKOS relations, alignments, and ontology properties.

This dual surface exists because flat lookup and graph traversal have different performance and simplicity trade-offs; dependent repositories **SHOULD** use the flat index for simple validation and the SPARQL endpoint for relational discovery (e.g., "all concepts aligned to X").

---

## 6. Ontology Specification

The formal ontology is defined in `ontologies/core_v1.yaml` and summarized normatively here. It is expressed in RDF/RDFS/OWL primitives with a JSON-LD `@context` binding the `oe:` prefix to `https://www.w3id.org/openevo/ontology#`.

### 6.1 Phase 1 Classes

| Class | Superclass(es) | Definition |
|---|---|---|
| `oe:Entity` | — (abstract) | Base class providing `oe:identifier`, `oe:status`, `oe:version` to all subclasses. **MUST NOT** be instantiated directly. |
| `oe:Concept` | `oe:Entity`, `skos:Concept` | A disambiguated unit of curricular meaning. Instances populated exclusively by controlled vocabulary files, never by the ontology itself. |
| `oe:LPM` | `oe:Entity` | A top-level structural container referencing Strands; independent of any single grade or subject system. |
| `oe:Strand` | `oe:Entity` | A thematic thread within an LPM, recursively composable. |
| `oe:SubStrand` | `oe:Strand` | A nested child Strand, connected to its parent via `oe:hasSubStrand`. Modeled as a subclass — not a sibling type — so recursion requires only one property, not one per depth level. |
| `oe:LearningObject` | `oe:Entity` | The smallest addressable curriculum unit referenced by a Strand; content itself lives outside OECB. |

### 6.2 Reserved Classes (Forward-Declared)

The following classes have stable IRIs declared but undefined internal structure, reserved for later phases:

| Class | Planned phase | Note |
|---|---|---|
| `oe:Collection` | 3 | Aggregates Strands/LPMs for a distributed collection repository. |
| `oe:Competency` | 4 | To be profiled as an extension of CASE `CFItem`. |
| `oe:Assessment` | 4 | — |
| `oe:Practice` | 4 | — |
| `oe:Evidence` | 4 | To be profiled as an extension of the xAPI statement structure. |
| `oe:Resource` | 4 | Profiled from IEEE LOM / schema.org/LearningResource. |

Promoting a reserved class into `classes` is a **MINOR** version bump to the ontology (additive; no existing reference changes). Removing or redefining a class's domain, range, or semantics is a **MAJOR** version bump requiring RFC review (§11).

### 6.3 Object Properties (Phase 1)

| Property | Domain → Range | Semantics |
|---|---|---|
| `oe:hasStrand` | `oe:LPM` → `oe:Strand` | LPM contains a top-level Strand. |
| `oe:hasSubStrand` | `oe:Strand` → `oe:SubStrand` | Recursive composition (§6.1). |
| `oe:partOfStrand` | `oe:SubStrand` → `oe:Strand` | Inverse of `oe:hasSubStrand`. |
| `oe:hasLearningObject` | `oe:Strand` → `oe:LearningObject` | Strand references a Learning Object. |
| `oe:hasConcept` | `{oe:Strand, oe:LearningObject}` → `oe:Concept` | Primary link between curriculum structure and vocabulary. |
| `oe:required` | `oe:SubStrand` → `xsd:boolean` | Obligate vs. optional/elective/regional-extension status. |
| `oe:recommendedSequence`, `oe:alternativeSequence`, `oe:parallel`, `oe:prerequisiteOf` | `oe:Strand` → `oe:Strand` | Pathway declarations supporting multiple valid curriculum sequences. |
| `oe:foundationalTo` | `oe:Strand` → `oe:Strand` | Spiral-curriculum relation: source is introduced before target but is expected to be revisited/reinforced alongside it, not gated behind it — weaker than `oe:prerequisiteOf`, and unlike `oe:parallel`, not symmetric. A strand pair **MUST NOT** assert `oe:prerequisiteOf` and `oe:parallel`/`oe:foundationalTo` in conflicting directions. |
| `oe:definedInVocabulary` | `oe:Concept` → `xsd:string` | References the Concept's single home vocabulary (§8). |

### 6.4 SKOS Relation Reuse

Because `oe:Concept` is declared `subClassOf skos:Concept`, all standard SKOS relations (`skos:broader`, `skos:narrower`, `skos:related`, `skos:closeMatch`, `skos:exactMatch`) are available on every Concept instance without redefinition. OECB **MUST NOT** define parallel or competing relation vocabularies for same-vocabulary relations. Cross-vocabulary relations are reified separately as Alignment records (§9), not asserted as direct Concept properties, so that each such claim can carry independent provenance.

### 6.5 Nesting Depth

Recommended maximum SubStrand nesting depth is **two levels**. This limit **MUST** be enforced by validation tooling (§13), not encoded as an ontology-level restriction, so that relaxing the limit in the future does not require a class-level breaking change.

---

## 7. Schema Layer Specification

### 7.1 Formalism

The schema layer uses **JSON Schema (draft 2020-12)**, authored in YAML, with a shared `$defs` library to avoid duplicating primitives across schemas. Schema `$id` values are a distinct namespace concern from ontology IRI resolution (§4.2) but share the same base path for operational consistency.

### 7.2 Shared Definitions (`common.defs.yaml`)

The following primitives **MUST** be defined once in `schemas/common.defs.yaml` and referenced via `$ref` by every other schema, never redefined locally:

- Identifier patterns (`conceptId`, `lpmId`, `strandId`, `vocabRef`)
- `semver`, `status` (lifecycle enum), `languageTag`
- Multilingual field shapes: `localizedString`, `localizedStringArray`, `localizedDisciplinaryDefinitions`
- `citation`, `author` structured objects
- `extensions` — an open, namespaced escape hatch for forward-compatible fields
- `conceptbaseManifest` — the federated dependency manifest shape (§10)

Any new schema introduced in a future phase **MUST** reuse these primitives rather than redefining equivalent structures.

### 7.3 Core Schemas (Phase 1)

| Schema | Validates | Key normative behaviors |
|---|---|---|
| `concept.schema.yaml` | `oe:Concept` instances | Requires `definedInVocabulary` (exactly one home vocabulary); `definitions` uses `localizedDisciplinaryDefinitions` to support per-discipline disambiguation (§8.4); SKOS relation targets validated for ID-pattern correctness only — referential integrity (target existence) is a build-pipeline concern, not a JSON Schema concern. |
| `lpm.schema.yaml` | `oe:LPM` instances | Embeds the `conceptbase` manifest (§10); `strands[]` entries are loosely coupled (`id` + external `repository` URI only) — full Strand structure is intentionally out of scope for this schema. |
| `strand.schema.yaml` | `oe:Strand` / `oe:SubStrand` instances | `concepts[].emphasis` (`primary` \| `reinforcing`) is **REQUIRED** on every concept reference, providing the machine-checkable basis for horizontal coherence auditing (§13.3); `subStrands[]` is self-referential (`$ref: "#"`) enabling recursive nesting per §6.1/§6.5; `learningObjects[]` entries are loosely coupled (`id` + external `repository`), mirroring `lpm.schema.yaml`'s `strands[]` pattern. |
| `learningObject.schema.yaml` | `oe:LearningObject` instances | `concepts[]` reuses the same `{id, emphasis}` shape as `strand.schema.yaml` (`common.defs.yaml#/$defs/conceptEmphasisRef`); content itself is out of scope (§1.2) — this schema validates structure only. |

### 7.4 Extension Mechanism

Every core schema **MUST** include an `extensions` property (per §7.2) permitting namespaced, forward-compatible fields to be attached to instances without requiring a breaking schema change. Keys **SHOULD** be namespaced (e.g., `oe:phase2.alignmentHint`).

---

## 8. Controlled Vocabulary Specification

### 8.1 Vocabulary as a Governed Unit

A controlled vocabulary is a versioned, independently governed collection of `oe:Concept` instances sharing a `scope` and `discipline`. Each vocabulary file **MUST** declare its own `meta` block (`id`, `version`, `status`, `scope`, `discipline`, `license`, `authors`, `conformsTo`) independent of any other vocabulary's versioning.

### 8.2 Concept Entry Structure

Every Concept instance **MUST** validate against `concept.schema.yaml` (§7.3) and **MUST** populate, at minimum: `id`, `type`, `status`, `version`, `definedInVocabulary`, `labels`, `definitions`.

### 8.3 One Home Vocabulary Per Concept

A Concept **MUST** be defined in exactly one home vocabulary (`definedInVocabulary`). A Concept **MAY** be the target of Alignment records (§9) from Concepts in other vocabularies, but **MUST NOT** be redefined or duplicated across vocabularies.

### 8.4 Disambiguation Model

The `definitions` field uses `localizedDisciplinaryDefinitions`: a map of language tag to (discipline key → definition text), where discipline keys are free-form (e.g., `biology`, `culture`, `education`, `ai`, `general`). This structure is the mechanism by which a single Concept (e.g., "Selection") **MAY** carry multiple, explicitly distinct, discipline-specific definitions rather than forcing a single canonical meaning. Vocabularies **SHOULD** populate multiple discipline keys only where a term's meaning genuinely differs by discipline, and **MAY** use a single `general` key where one cross-domain framing suffices.

### 8.5 Multilinguality

All `labels` and `definitions` fields **MUST** include an `en` entry as the ecosystem-wide fallback language. Additional language tags **MAY** be added at any time as an additive, non-breaking (MINOR or PATCH) change.

### 8.6 Pluralism Requirement

Where a field of curricular knowledge contains genuine, active theoretical disagreement (e.g., whether organism agency is a legitimate causal component of evolutionary explanation), OECB **MUST NOT** resolve the disagreement by omission, editorializing, or privileging one vocabulary as canonical. Instead:

- Competing theoretical positions **SHOULD** be represented as separate, internally consistent vocabularies (e.g., `BIO-CORE` vs. `OE-INTERDISCIPLINARY`).
- The disagreement **MAY** subsequently be made formally comparable via Alignment records (§9) once both vocabularies are stable, without requiring either to be modified to accommodate the other.

This is a load-bearing design principle (§3, item 7), not an incidental feature; it is what allows OECB to serve a research field with active theoretical disputes without the infrastructure layer taking a side.

---

## 9. Cross-Vocabulary Alignment (Phase 2 — Forward-Specified)

Although alignment records are a Phase 2 deliverable, their structure **MUST** conform to the following normative shape when implemented, so that Phase 1 vocabularies are built in a manner compatible with future alignment without rework.

### 9.1 Alignment Record Structure

```yaml
id: OE-ALIGN-{nnnnnn}
subject: {vocabulary}:{conceptId}
object: {vocabulary}:{conceptId}
matchType: skos:closeMatch | skos:exactMatch | skos:broadMatch | skos:narrowMatch | skos:relatedMatch
assertedBy: [{contributor identifiers}]
date: {ISO 8601 date}
status: proposed | accepted | contested
rationale: >
  {free text justification}
```

`subject` and `object` **MUST** reference the permanent `conceptId` (e.g. `BIO-CORE-v1.0.0:OE-CONCEPT-000102`), never a label. This matches every other reference mechanism in OECB — `skos:broader`/`skos:narrower`/`skos:related` and `oe:hasConcept` all target `OE-CONCEPT-{id}` — because labels **MAY** change across versions while identifiers **MUST NOT** (§4.4). An alignment keyed on a label would silently desynchronize from its target on a legitimate label edit, with no schema-level way to detect the break.

### 9.2 Normative Requirements

- Alignment records **MUST NOT** be asserted as direct properties on either Concept instance (§6.4); they **MUST** be reified as independent, separately versioned records under `/alignments/`.
- Every alignment record **MUST** carry `assertedBy`, `date`, `matchType`, and `status` — an alignment without provenance **MUST NOT** be accepted.
- A `status: contested` alignment **MUST** remain resolvable and visible in query results, not suppressed, so that ongoing theoretical disagreement about the alignment itself is representable as data (§3, item 7; §8.6).

---

## 10. Federated Repository Model

### 10.1 The Manifest

Every dependent repository **MUST** declare a `conceptbase` manifest conforming to `common.defs.yaml#/$defs/conceptbaseManifest`:

```yaml
conceptbase:
  ontology: OE-ONTOLOGY-v{semver}
  vocabularies:
    - {VOCAB}-v{semver}
    - ...
  gradeSchema: {reserved, Phase 3}
  subjectSchema: {reserved, Phase 3}
  acknowledgedDeprecations:
    - {entity id}
```

### 10.2 Version Pinning

A dependent repository's manifest **MUST** pin exact versions of every ontology and vocabulary it depends on. Unpinned or range-based version references **MUST NOT** be used, in order to guarantee reproducible validation.

### 10.3 Compatibility Checking

A CI compatibility-checker (distributed by OECB as a reusable action, §14 Phase 4) **MUST**, on every push to a dependent repository:

1. Verify that every referenced entity ID resolves at the pinned version.
2. Verify that no referenced entity has `status: deprecated` unless explicitly listed in `acknowledgedDeprecations`.
3. Flag (but not necessarily block) cases where a pinned dependency has a newer MAJOR version available, requiring explicit re-validation before the dependent repository tags its own next release.
4. Loudly flag any reference to an `OE-SANDBOX-*` identifier (§4.5, RFC-0001), since the dependent repository is knowingly depending on something with no permanence guarantee.

---

## 11. Governance and Versioning

### 11.1 Roles

| Role | Responsibility |
|---|---|
| **Maintainers** | Merge rights on `main`; final arbitration; cut releases. |
| **Domain editors** | Required reviewers for RFCs touching their vocabulary/subject domain. |
| **Contributors** | Anyone; submit RFCs via pull request. |

### 11.2 RFC Process

Any addition of a Concept, relation, schema, or vocabulary **MUST** be submitted as a pull request against `/proposals/`, using the fixed RFC template (motivation, proposed IRI, relations, justification for why no existing standard covers the need per §3 item 4). Review ceremony is split by status transition (RFC-0001):

- Merging a new `OE-SANDBOX-CONCEPT-######` entry, or a `proposed`-status permanent-tier entry, **MUST** receive at least one maintainer approval (or an async no-objection window of 5 business days) before merge — no domain editor sign-off is required at this stage.
- The `proposed → accepted` transition in the permanent tier, and sandbox → permanent promotion (§4.5), **MUST** receive at least one domain editor approval and one maintainer approval before merge — this is the point where the permanence guarantee (§3 item 5) actually begins to apply.

### 11.3 Lifecycle Status

Every entity **MUST** carry a `status` field with one of the following values. Status transitions along the primary chain **MUST** only move forward (a status **MUST NOT** revert from `deprecated` back to `stable`, for example, without a new RFC):

```
proposed → accepted → stable → deprecated → superseded
                                    ↘
                                     retracted
```

`retracted` (RFC-0001) is a parallel terminal state reachable directly from `accepted` or `stable` — it is not sequential after `deprecated`, and does not imply the entity was superseded by anything.

### 11.4 Deprecation Policy

An entity **MUST NOT** be deleted once it reaches `status: accepted` or higher. A deprecated entity **MUST**:

- Remain resolvable at its existing identifier indefinitely.
- Carry a `supersededBy` pointer to its replacement, where one exists.
- Continue to appear in query results (not silently filtered), so dependent repositories are never broken by an upstream change they have not yet acknowledged.

A `retracted` entity (RFC-0001) follows the same never-delete, always-resolvable rules above, but **MUST NOT** carry a `supersededBy` pointer — `retracted` means the entity was accepted in error or is no longer endorsed by the maintainers, with no implied replacement, unlike `deprecated`. It **MAY** carry a `retractionNote` explaining why.

Entities in the sandbox/provisional tier (§4.5, `OE-SANDBOX-*` identifiers) are explicitly exempt from this entire section — they carry no `status` field from §11.3 and may be deleted or archived freely.

### 11.5 Independent Versioning

Each vocabulary, schema, and ontology module **MUST** version independently using semantic versioning:

- **MAJOR** — a concept, class, or property is removed or redefined incompatibly.
- **MINOR** — additive change (new concept, new optional property, promoted reserved class).
- **PATCH** — non-semantic change (wording, typo correction).

There is no single "ConceptBase version" that governs all artifacts simultaneously; the specification document itself (this document) is versioned separately from the artifacts it describes.

### 11.6 Amending This Specification

Changes to §3 (Design Principles) or §11 (this section) itself **MUST** be treated as MAJOR changes to this specification document and **MUST** require explicit maintainer consensus, documented as an RFC with a `type: specification-amendment` tag, distinct from ordinary content RFCs.

---

## 12. Standards Alignment and Profiling Obligations

OECB **MUST** be built as a set of profiles and extensions of existing standards wherever a suitable standard exists, per §3 item 4. The following mappings are normative for the phases indicated:

| Need | Standard reused | OECB profiling obligation | Phase |
|---|---|---|---|
| Concept relations, cross-vocabulary mapping | SKOS | `oe:Concept subClassOf skos:Concept`; Alignment records use SKOS match types exclusively (§9) | 1 (relations), 2 (alignment) |
| Competency frameworks | CASE (1EdTech) | `oe:Competency` **MUST** be profiled as an extension of CASE `CFItem`, not a novel structure | 4 |
| Learning object metadata | IEEE LOM, schema.org/LearningResource | `oe:Resource` **MUST** be profiled from these, not redefined | 4 |
| Evidence/activity records | xAPI | `oe:Evidence` **MUST** be profiled as an extension of the xAPI statement structure | 4 |
| Graph serialization | RDF / JSON-LD | The OECB-specific ontology (§6) is the only permitted novel structure at the serialization layer | 1 |

Any RFC proposing a schema or ontology structure not covered by this table **MUST** include a documented justification for why existing standards are insufficient (§3 item 4), reviewed as part of ordinary RFC review (§11.2).

---

## 13. Validation and Compatibility Requirements

### 13.1 Schema Validation

Every entity file **MUST** validate against its corresponding JSON Schema (§7) as a required CI check before merge. This includes ID pattern conformance, required-field presence, and `additionalProperties: false` enforcement (no undeclared fields permitted at the top level of any core schema).

### 13.2 Referential Integrity

The build pipeline (§5.2) **MUST** verify, beyond JSON Schema's structural validation, that every SKOS relation target and every `oe:hasConcept` reference resolves to an entity that actually exists in the compiled graph. JSON Schema alone **MUST NOT** be relied upon for this check, since ID pattern conformance does not guarantee target existence.

### 13.3 Horizontal Coherence Auditing

Validation tooling **SHOULD** provide a coherence-auditing capability that, given an LPM and its dependent Strand files, computes:

- **Vertical coherence**: whether concept complexity and performance indicator sophistication increase monotonically across a Strand's `subStrands[]` sequence.
- **Horizontal coherence**: using the `concepts[].emphasis` field (§7.3) as evidence, whether a Strand's `primary` concepts are genuinely `reinforcing`-referenced by sibling and cross-strand Strands, rather than introduced once and never revisited.

This auditing capability is **RECOMMENDED**, not required, for Phase 1 conformance, but is expected to become a required CI check for LPM repositories no later than Phase 3.

### 13.4 Depth Limit Enforcement

Validation tooling **MUST** flag (though **MAY** allow with a warning rather than a hard failure) any `subStrands[]` nesting exceeding two levels, per the recommended limit in §6.5.

---

## 14. Phased Rollout

OECB's scope is deliberately staged rather than stabilized all at once (§3 rationale: validate the highest-leverage design decisions — disambiguation, identifier stability — against a real pilot before expanding surface area).

| Phase | Status as of this specification | Normative deliverables |
|---|---|---|
| **1 — Core** | Active | Ontology core classes (§6.1); Concept/LPM/Strand schemas (§7.3); ≥1 seed vocabulary with full disambiguation (§8.4); governance process (§11); end-to-end pilot LPM repository |
| **2 — Alignment & Multilinguality** | Planned | Alignment record type (§9) implemented and populated; language-tagged labels/definitions beyond `en` (§8.5) |
| **3 — Pluralism** | Planned | `grade-schemas/`, `subject-schemas/` populated with multiple systems each; CASE/LOM/xAPI profile mappings begun; horizontal coherence auditing (§13.3) becomes required |
| **4 — Ecosystem Tooling** | Planned | `oe:Competency`, `oe:Assessment`, `oe:Evidence`, `oe:Resource` promoted from reserved to defined (§6.2); hosted SPARQL endpoint (§5.3); CI compatibility-checker action published (§10.3) |

Promotion of a phase's deliverables to `stable` status **MUST** follow ordinary RFC review (§11.2); phase completion is not itself a specification-level event requiring amendment under §11.6, since phases describe scope sequencing, not the design principles in §3.

---

## 15. Repository Structure (Informative)

```
conceptbase/
├── README.md
├── GOVERNANCE.md
├── CONTRIBUTING.md
├── LICENSE / LICENSE-CODE
├── docs/
│   └── oecb_specifications.md   # This document
├── ontologies/core_v1.yaml
├── schemas/
│   ├── common.defs.yaml
│   ├── concept.schema.yaml
│   ├── lpm.schema.yaml
│   ├── strand.schema.yaml
│   ├── learningObject.schema.yaml
│   └── alignment.schema.yaml    # Phase 2
├── vocabularies/
│   ├── BIO-CORE-v1.0.0.yaml
│   └── OE-INTERDISCIPLINARY-v1.0.0.yaml
├── alignments/            # Phase 2
├── grade-schemas/         # Phase 3
├── subject-schemas/       # Phase 3
├── competencies/          # Phase 4
├── evidence/              # Phase 4
├── registry/              # Generated
├── validation/
├── build/
├── proposals/
└── examples/
```

This section is informative; the normative requirement is only that the artifacts described in §6–§9 exist somewhere in the repository with content conforming to their respective sections, not that they occupy these exact paths. Path conventions **SHOULD** be followed for ecosystem consistency but **MAY** be adapted by forks or derivative registries provided the manifest mechanism (§10) is preserved.

---

## 16. Conformance

### 16.1 Conformance Classes

This specification defines two conformance classes.

**A conformant Vocabulary** is one whose Concept entries validate against `concept.schema.yaml` (§7.3), whose `meta` block is complete (§8.1), and which does not redefine a Concept already homed in another vocabulary (§8.3).

**A conformant Dependent Repository** is one whose manifest (§10.1) pins exact versions, whose referenced entities all resolve at those pinned versions (§10.3), and whose Strand/LPM files validate against the corresponding schemas (§7.3).

### 16.2 Non-Conformance Handling

A repository that references OECB entities without a valid manifest, or that references deprecated entities without `acknowledgedDeprecations`, is **non-conformant** and **SHOULD** be flagged by the compatibility checker (§10.3), but this specification does not mandate that non-conformant repositories be technically prevented from doing so — enforcement mechanisms are a matter for individual dependent-repository CI configuration, not for OECB itself to police.

---

## Appendix A — Identifier Pattern Quick Reference

```
Concept:    ^OE-CONCEPT-[0-9]{6}$
LPM:        ^OE-LPM-[0-9]{6}$
Strand:     ^OE-STRAND-[0-9]{6}$
Vocabulary: ^[A-Z0-9\-]+-v[0-9]+\.[0-9]+\.[0-9]+$
Semver:     ^[0-9]+\.[0-9]+\.[0-9]+$
Language:   ^[a-z]{2}(-[A-Z]{2})?$
```

## Appendix B — Reserved Ontology Prefixes

```
oe:   https://www.w3id.org/openevo/ontology#
skos: http://www.w3.org/2004/02/skos/core#
owl:  http://www.w3.org/2002/07/owl#
rdfs: http://www.w3.org/2000/01/rdf-schema#
xsd:  http://www.w3.org/2001/XMLSchema#
dct:  http://purl.org/dc/terms/
```

## Appendix C — Specification Change Log

| Version | Date | Summary |
|---|---|---|
| 0.1.0 | Draft | Initial narrative specification; content/infrastructure separation established. |
| 0.2.0 | Draft, superseded by this document | Added governance model, SKOS relation adoption, RDF/JSON-LD formalism commitment, phased scope. |
| **0.2.0 (this document)** | Current | Reformatted as a normative formal specification with RFC 2119 conformance language; namespace finalized to `www.w3id.org/openevo/`; conformance classes (§16) added; all prior narrative content consolidated and made testable. |

---

*This specification is licensed under CC-BY-4.0. Amendments follow the process defined in §11.6 and `GOVERNANCE.md`.*