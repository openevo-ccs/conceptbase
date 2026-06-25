# OpenEvo Concept Base — README

---

```markdown
# OpenEvo Concept Base

> The semantic backbone of the OpenEvo Computational Curriculum Studies ecosystem.
```

[![OpenEvo](https://img.shields.io/badge/OpenEvo-openevo.eva.mpg.de-teal)](http://openevo.eva.mpg.de)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Specification](https://img.shields.io/badge/Spec-v0.9.0-blue)](SPECIFICATION.md)
[![FAIR](https://img.shields.io/badge/FAIR-Findable%20Accessible%20Interoperable%20Reusable-green)](https://www.go-fair.org/fair-principles/)
[![Namespace](https://img.shields.io/badge/Namespace-openevo.net-purple)](https://openevo.net/)
[![Schema](https://img.shields.io/badge/Schema-YAML%20%7C%20JSON--LD%20%7C%20RDF-orange)](schemas/)
[![Status](https://img.shields.io/badge/Status-Draft%20v0.9.0-yellow)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](CONTRIBUTING.md)

---

## What Is This?

The **OpenEvo Concept Base (OECB)** is the foundational semantic infrastructure of the
[OpenEvo CCS Lab](http://openevo.eva.mpg.de) — a computational research environment
for studying how curriculum knowledge originates, spreads, competes, and evolves across
educational systems and cultures.

This repository does not store curriculum content directly.
It defines **how curriculum knowledge can be represented** — the shared schemas,
formal vocabularies, ontological commitments, and versioning rules that allow every
other repository in the OpenEvo ecosystem to create, link, and reason over curriculum
knowledge objects in a consistent, machine-readable, and FAIR-compliant way.

> **Core principle:** The Concept Base defines how curriculum knowledge
> can be represented. Individual repositories contribute evolving instances
> of that knowledge.

---

## The Big Picture

### Computational Curriculum Studies

**Computational Curriculum Studies (CCS)** is an emerging field at the intersection of
curriculum theory, data science, knowledge representation, and cultural evolutionary
modelling. It asks:

- How can curriculum theories be represented as formal, machine-readable objects?
- How do curriculum ideas spread, compete, and transform across educational systems?
- What can computational methods reveal about the structure and evolution of
  curriculum knowledge that traditional methods cannot?

The OpenEvo CCS Lab pursues these questions through a distributed digital ecosystem —
a network of linked repositories, each contributing knowledge objects that connect to a
shared semantic layer. The Concept Base **is** that shared semantic layer.

### Curriculum Knowledge as a Evolving System

A central theoretical commitment of this project is that curriculum knowledge
behaves like an **evolving cultural system**. Theories emerge, compete for adoption,
extend or absorb one another, get revised under empirical pressure, drift under social
and political pressure, and occasionally go extinct — only to be revived in new contexts.

The GitHub organisation itself is designed to model these dynamics:

| Git Concept | Evolutionary Analog |
|---|---|
| Repository | Population of knowledge objects |
| Commit | Mutation to existing knowledge |
| Branch | Exploratory variation |
| Pull request | Selection event |
| Merge | Inheritance and fixation |
| Fork | Lineage divergence |
| Deprecation | Extinction |
| Cross-repo link | Horizontal knowledge transfer |
| Release graph | Fossil record |

This is not metaphor for its own sake. The Concept Base includes an
**Evolutionary Metadata Layer** that makes these dynamics machine-readable and
queryable — enabling research into how curriculum knowledge actually changes over time.

---

## Repository Role in the Ecosystem

```
OpenEvoCCS-lab/

├── OpenEvo-ConceptBase        ← YOU ARE HERE
│                                schemas · vocabularies · ontology · this spec
├── OpenEvo-Graph              ← compiled knowledge graph · SPARQL endpoint
├── OpenEvo-CCS                ← curriculum studies objects (CTOs, CKOs, TSOs)
├── OpenEvo-EvolutionEducation ← evolution education domain objects
├── OpenEvo-OriginsScience     ← origins of science domain objects
├── OpenEvo-AgentSystems       ← AI agent definitions and query interfaces
└── OpenEvo-Data               ← raw data · empirical records · annotations
```

Every other repository in the organisation **depends on this one**.
They validate their objects against schemas defined here, use vocabulary
terms defined here, and mint identifiers within namespaces governed here.

```
          ┌─────────────────────────┐
          │   OpenEvo Concept Base  │
          │  schemas · vocab · onto │
          └────────────┬────────────┘
                       │ shared dependency
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   CCS Repo      Evol. Repo    Origins Repo
        └──────────────┼──────────────┘
                       ▼
              OpenEvo Graph
            (compiled KG + SPARQL)
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       SPARQL       GraphQL    AI Agents
```

---

## What Lives Here

```
OpenEvo-ConceptBase/
│
├── SPECIFICATION.md          ← full formal infrastructure specification
├── CONTRIBUTING.md
├── GOVERNANCE.md
│
├── ontology/
│   ├── core/                 ← OWL ontology · class hierarchy · RDF prefixes
│   └── extensions/           ← domain-specific ontology extensions
│
├── schemas/
│   ├── CTO/                  ← Curriculum Theory Object schema
│   ├── CKO/                  ← Curriculum Knowledge Object schema
│   ├── TSO/                  ← Theory Space Object schema
│   ├── EVO/                  ← Evidence Object schema
│   ├── CMO/                  ← Competency Object schema
│   ├── CFO/                  ← Conflict Object schema
│   ├── AGO/                  ← Agent Object schema
│   └── evolutionary-metadata/← Evolutionary Metadata Layer schema
│
├── vocabularies/
│   ├── epistemic-status/     ← well_supported · contested · speculative · falsified
│   ├── selection-pressures/  ← empirical · political · social · pedagogical ...
│   ├── evidence-type/        ← meta_analysis · empirical_study · practitioner_report ...
│   ├── claim-type/           ← causal · constitutive · normative · descriptive ...
│   ├── disciplines/
│   └── competencies/
│
├── registry/
│   ├── affiliated-projects.yaml
│   └── federated-projects.yaml
│
├── sandbox/                  ← experimental; excluded from production graph
│
└── .github/workflows/
    ├── validate.yml           ← schema validation on every PR
    ├── staging-graph.yml      ← staging graph build on merge to main
    └── production-graph.yml   ← production graph build on merge to release
```

---

## Core Object Types

The Concept Base defines seven types of knowledge object.
Each has a formal schema, a persistent URI pattern, and a defined
role in the knowledge graph.

| Object | Code | Purpose | Example URI |
|---|---|---|---|
| Curriculum Theory Object | CTO | Abstract theoretical claims about curriculum | `openevo.net/ccs/cto/CTO-001` |
| Curriculum Knowledge Object | CKO | Concrete educational artifacts and annotations | `openevo.net/ccs/cko/CKO-001` |
| Theory Space Object | TSO | Structured conceptual landscapes | `openevo.net/ccs/tso/TSO-001` |
| Evidence Object | EVO | Empirical/theoretical evidence for claims | `openevo.net/ccs/evo/EVO-001` |
| Competency Object | CMO | Specified learning competencies | `openevo.net/ccs/cmo/CMO-001` |
| Conflict Object | CFO | Formally registered theoretical conflicts | `openevo.net/ccs/cfo/CFO-001` |
| Agent Object | AGO | Contributors, reviewers, AI agents | `openevo.net/ccs/ago/AGO-001` |

### How They Connect

```
  TSO  ──contains──▶  CTO  ◀──instantiates──  CKO
                       │                        │
                    supports                 targets
                       │                        │
                      EVO                      CMO
                       
  CTO  ──competesWith──▶  CTO  ──▶  CFO (conflict registered)
  CTO  ──extends──────▶  CTO
  CTO  ──synthesizes──▶  CTO
```

### What Makes a CTO Different from a Summary

A **Curriculum Theory Object** is not a paper summary or a description of a practice.
It is a formal representation of a theoretical position with:

- **Structured claims** — each claim typed (`causal`, `normative`, `constitutive`...),
  scoped, and assigned an epistemic status (`well_supported`, `contested`, `speculative`,
  `falsified`)
- **Falsification conditions** — explicit statements of what evidence would refute each claim
- **Evidence linkage** — direct links to EVO objects that support, contradict, or qualify claims
- **Evolutionary metadata** — genealogy, selection history, adoption records, fitness indicators

```yaml
# Abbreviated CTO example
id: "https://openevo.net/ccs/cto/CTO-CURRICULUM-COMPRESSION-001"
type: CurriculumTheoryObject
title: "Curriculum as Compression-Decompression"

claims:
  - id: "CTO-CURRICULUM-COMPRESSION-001-CLAIM-01"
    text: >
      Curriculum design involves selective compression of disciplinary
      knowledge such that structural and explanatory relationships
      of the discipline are preserved in compressed form.
    claim_type: constitutive
    epistemic_status: contested
    falsification_conditions:
      - "Evidence that no selection occurs in documented curriculum design."
    supporting_evidence:
      - id: "https://openevo.net/ccs/evo/EVO-COMPRESSION-001"
        relationship_strength: moderate
```

---

## The Evolutionary Metadata Layer

Every object in the ecosystem — regardless of type — carries an
**Evolutionary Metadata Layer (EML)**. This is the component that
distinguishes the Concept Base from a conventional knowledge repository.

The EML records:

```yaml
evolutionary_metadata:

  genealogy:
    derived_from: []        # parent objects
    branched_from: null     # fork origin
    merged_into: null       # absorption target

  selection_history:
    - event_type: revision
      pressure_type: empirical
      pressure_source: "Meta-analysis contradicted Claim 01"
      resulting_change: "Epistemic status revised to contested"

  adoption_record:
    - community: "German secondary biology educators"
      adoption_level: partial
      adoption_timeframe:
        start: "2022"
        end: null

  fitness_indicators:
    theoretical_coherence: high
    empirical_support: moderate
    practical_applicability: high
    cross_context_robustness: low
```

Across the ecosystem, this layer enables questions like:

- *What is the full genealogical tree of constructivist curriculum theory
  across jurisdictions?*
- *In which theory spaces has empirical evidence driven revision, and
  where have political pressures dominated?*
- *Which regions of the computational curriculum theory space are
  currently unoccupied?*
- *How long does it take for a theoretical innovation to travel from
  academic publication to curriculum standards?*

---

## Namespace and Trust Architecture

All OpenEvo objects receive globally unique, persistent identifiers
under the `https://openevo.net/` namespace — the trust anchor of the ecosystem.

Three tiers of participation are defined:

| Tier | Namespace Pattern | Who Mints | Review Process |
|---|---|---|---|
| **Core** | `openevo.net/ccs/` | OpenEvo core team | Full editorial review |
| **Affiliated** | `openevo.net/projects/{id}/` | Registered partners | Schema validation + registration |
| **Federated** | `{external-domain}/openevo-compatible/` | Independent projects | Self-declared compatibility |

This structure keeps the core namespace stable as a trust anchor while
enabling genuine distributed participation.

---

## FAIR Compliance

All OpenEvo objects are designed to satisfy the
[FAIR principles](https://www.go-fair.org/fair-principles/):

| Principle | How |
|---|---|
| **Findable** | Persistent URIs; schema.org metadata; registry publication |
| **Accessible** | HTTP content negotiation; open SPARQL endpoint; CC BY 4.0 |
| **Interoperable** | RDF/JSON-LD serialisation; SKOS vocabularies; Dublin Core; PROV-O alignment |
| **Reusable** | Explicit licence on every object; full provenance chain; standards alignment |

### External Standards Alignment

The Concept Base aligns with and extends:

- **Dublin Core (DCMI)** — bibliographic metadata
- **SKOS** — controlled vocabulary representation
- **PROV-O** — provenance and derivation tracking
- **Schema.org** — discoverability and structured data
- **Basic Formal Ontology (BFO)** — upper ontology grounding
- **Achievement Standards Network (ASN)** — curriculum standards linked data
- **IMS Global CASE** — competency exchange compatibility

---

## Getting Started

### Reading the Specification

The full formal infrastructure specification is in [`SPECIFICATION.md`](SPECIFICATION.md).
It covers ontology, all seven schemas, versioning semantics, evolutionary metadata,
graph architecture, access layer, governance, and FAIR compliance in detail.

### Using a Schema

Schemas are available as both YAML Schema and JSON Schema:

```bash
schemas/CTO/CTO.schema.yaml
schemas/CTO/CTO.schema.json
schemas/CTO/CTO.example.yaml   # worked example
```

### Validating an Object

Every pull request is validated automatically via GitHub Actions.
To validate locally:

```bash
# Install dependencies
pip install pykwalify jsonschema

# Validate a YAML object against its schema
pykwalify -d your-object.yaml -s schemas/CTO/CTO.schema.yaml
```

### Contributing an Object

1. Choose the correct object type from the table above
2. Copy the relevant schema example from `schemas/{TYPE}/{TYPE}.example.yaml`
3. Fill all required fields (see the **Minimum Viable Object Checklist**
   in [`SPECIFICATION.md`](SPECIFICATION.md))
4. Place the file in the appropriate repository under the correct namespace tier
5. Open a pull request — automated validation will run on submission

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for full guidance.

---

## Versioning

Objects follow semantic versioning with defined increment semantics:

| Change | Version Bump | Example |
|---|---|---|
| Corrected error; clarified language | `PATCH` | `1.0.0 → 1.0.1` |
| New claim; new evidence link | `MINOR` | `1.0.0 → 1.1.0` |
| Core claim revised or removed | `MAJOR` | `1.1.0 → 2.0.0` |
| Schema field added or renamed | `BREAKING` | schema `1.0 → 2.0` |

Object statuses: `active` · `deprecated` · `merged` · `falsified` · `archived` · `sandbox`

---

## Governance

The Concept Base evolves slowly and deliberately at its core,
with faster experimentation permitted in `sandbox/` and extension branches.

| Change Type | Minimum Review |
|---|---|
| PATCH to any object | 48 hours · single reviewer |
| MINOR to core objects | 1 week · two reviewers |
| MAJOR to any object | 2 weeks · editorial board |
| Breaking schema change | 4 weeks · public comment period |

See [`GOVERNANCE.md`](GOVERNANCE.md) for the full governance model,
editorial board structure, and deprecation procedure.

---

## Links

| Resource | URL |
|---|---|
| OpenEvo Project | [openevo.eva.mpg.de](http://openevo.eva.mpg.de) |
| Full Specification | [`SPECIFICATION.md`](SPECIFICATION.md) |
| Namespace Root | [openevo.net](https://openevo.net/) |
| SPARQL Endpoint | `https://openevo.net/sparql` *(coming)* |
| REST API | `https://openevo.net/api/v1/` *(coming)* |
| Contributing | [`CONTRIBUTING.md`](CONTRIBUTING.md) |
| Governance | [`GOVERNANCE.md`](GOVERNANCE.md) |
| License | [`LICENSE`](LICENSE) — CC BY 4.0 |

---

## License

This specification and all schemas and vocabularies in this repository
are released under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
Tooling and validation scripts are released under [MIT](LICENSE).

---

*OpenEvo Concept Base · v0.9.0 · Draft for Review*
*Part of the [OpenEvo CCS Lab](http://openevo.eva.mpg.de) digital ecosystem*
