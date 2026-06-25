# OpenEvo Concept Base — Formal Infrastructure Specification

### Version 0.9.0 — Foundational Release Candidate

**Status:** Draft for Review
**Namespace:** `https://openevo.net/`
**Repository:** `OpenEvoCCS-lab/OpenEvo-ConceptBase`
**License:** CC BY 4.0 (specification); MIT (tooling)

---

## Preamble

This document is the authoritative specification for the **OpenEvo Concept Base (OECB)** — the semantic infrastructure layer of the OpenEvo Computational Curriculum Studies (CCS) ecosystem. It is written as a **formal infrastructure specification**, not a repository README, because the Concept Base functions as the foundational dependency for a distributed, multi-repository, evolutionarily-structured knowledge ecosystem.

The specification defines what exists in the ecosystem, how it is represented, how it relates, how it changes, how it is accessed, and how it is governed. It is intended to be read by:

- **Infrastructure architects** designing repositories within the OpenEvo organization
- **Knowledge contributors** creating curriculum theory objects, curriculum knowledge objects, and evidence objects
- **External collaborators** seeking to federate their projects with OpenEvo
- **AI systems and agents** querying the OpenEvo knowledge graph
- **Researchers** studying the ecosystem itself as a model of computational cultural evolution

The specification is organized into seventeen sections covering purpose, architecture, ontology, schemas, versioning, evolutionary dynamics, access, governance, and long-term vision.

---

## Table of Contents

1. Foundational Commitments
2. Namespace Architecture
3. Repository Organization
4. Upper Ontology Alignment
5. Core Relational Vocabulary
6. Object Schema Architecture
7. Curriculum Theory Object (CTO)
8. Curriculum Knowledge Object (CKO)
9. Theory Space Object (TSO)
10. Evidence Object (EVO)
11. Competency Object (CMO)
12. Conflict Object (CFO)
13. Agent Object (AGO)
14. Versioning Model
15. Evolutionary Metadata Layer
16. Graph Architecture
17. Access and Query Layer
18. Namespace Governance and Trust Tiers
19. Controlled Vocabularies
20. FAIR Compliance
21. External Standards Alignment
22. Governance Model
23. Long-Term Vision

---

## Section 1: Foundational Commitments

### 1.1 The Core Principle

> *The OpenEvo Concept Base defines how curriculum knowledge can be represented, while individual repositories contribute evolving instances of that knowledge.*

This distinction — between **representational infrastructure** and **knowledge instances** — is the single most important architectural decision in the ecosystem. It parallels:

- The distinction between **ontology and assertion** in description logics
- The distinction between **grammar and utterance** in linguistics
- The distinction between **theory and data** in philosophy of science
- The distinction between **schema and instance** in database architecture

Every design decision in this specification follows from this principle.

### 1.2 Core Purpose

The OpenEvo Concept Base provides:

- Shared formal concepts and entity types
- A defined relational vocabulary connecting those entities
- Machine-readable object schemas with epistemic structure
- Controlled vocabularies for consistent terminology
- An evolutionary metadata layer for tracking knowledge dynamics
- Versioning semantics for intellectual history
- A namespace architecture with defined trust tiers
- A graph generation pipeline for computational querying
- An access layer for AI agents and research interfaces

### 1.3 The Evolutionary Design Principle

The evolutionary metaphor central to this project is not decorative — it is a **design specification**. The GitHub organization functions as an evolutionary environment for curriculum knowledge:

```
repositories       =    populations of knowledge objects
commits            =    mutations to existing objects
forks              =    lineage divergence
pull requests      =    selection events
merges             =    inherited knowledge
deprecations       =    extinction events
conflicts          =    competitive exclusion dynamics
cross-repo links   =    horizontal knowledge transfer
```

Every schema element in this specification is designed with evolutionary dynamics in mind. This means that genealogy, selection pressure, adoption, fitness, and population structure are **first-class representational concerns**, not afterthoughts.

### 1.4 FAIR Commitment

All OpenEvo objects are designed to satisfy the FAIR principles:

| Principle | Operationalization |
|---|---|
| **Findable** | Persistent URIs; schema.org metadata; registry publication |
| **Accessible** | HTTP with content negotiation; SPARQL endpoint; open license |
| **Interoperable** | Alignment with Dublin Core, SKOS, ASN, Schema.org; RDF serialization |
| **Reusable** | Explicit CC BY 4.0 license on every object; rich provenance metadata |

### 1.5 Epistemological Commitments

Curriculum theories are often normative, interpretive, and contested by design. The Concept Base acknowledges this tension through a two-layer approach:

- The **formal representational layer** is stable enough for machine processing and computational interoperability. It represents structure, relationships, and epistemic status.
- The **interpretive annotation layer** accommodates contested, pluralistic, and normative content. It preserves theoretical richness without requiring formal consensus.

The system does not adjudicate between competing theories. It represents them, their relationships, their evidence bases, their conflicts, and their evolutionary histories.

---

## Section 2: Namespace Architecture

### 2.1 Root Namespace

```
https://openevo.net/
```

This is the **persistent identity layer** for all OpenEvo resources. All objects minted within the core namespace receive globally unique, persistent identifiers resolvable via HTTP.

### 2.2 Namespace Structure

```
https://openevo.net/

├── ontology/
│   ├── core/
│   └── extensions/
│
├── vocabulary/
│   ├── epistemic-status/
│   ├── evidence-type/
│   ├── disciplines/
│   ├── competencies/
│   └── selection-pressures/
│
├── schema/
│   ├── CTO/
│   ├── CKO/
│   ├── TSO/
│   ├── EVO/
│   ├── CMO/
│   ├── CFO/
│   └── AGO/
│
├── ccs/
│   ├── cto/
│   ├── cko/
│   ├── tso/
│   ├── evo/
│   ├── cmo/
│   ├── cfo/
│   └── ago/
│
├── evolution/
│
├── origins-of-science/
│
└── projects/
    └── {affiliated-project-id}/
```

### 2.3 Identifier Patterns

All identifiers follow a consistent pattern:

```
https://openevo.net/ccs/{object-type}/{ID}
```

Examples:

```
https://openevo.net/ccs/cto/CTO-CURRICULUM-COMPRESSION-001
https://openevo.net/ccs/cko/CKO-THURINGIA-BIOLOGY-001
https://openevo.net/ccs/tso/TSO-COMPUTATIONAL-CURRICULUM-001
https://openevo.net/ccs/evo/EVO-COMPRESSION-EVIDENCE-001
https://openevo.net/ccs/cmo/CMO-EVOLUTIONARY-REASONING-001
https://openevo.net/ccs/cfo/CFO-UNIT-OF-ANALYSIS-001
https://openevo.net/ccs/ago/AGO-RESEARCHER-001
```

Schema version identifiers:

```
https://openevo.net/schema/CTO/1.0
https://openevo.net/schema/CKO/1.0
https://openevo.net/schema/TSO/1.0
```

Vocabulary term identifiers:

```
https://openevo.net/vocabulary/epistemic-status/contested
https://openevo.net/vocabulary/evidence-type/meta-analysis
https://openevo.net/vocabulary/selection-pressures/empirical
```

---

## Section 3: Repository Organization

### 3.1 GitHub Organization Structure

```
OpenEvoCCS-lab/

├── OpenEvo-ConceptBase          ← this specification; all schemas; all vocabularies
│
├── OpenEvo-Graph                ← graph compilation pipeline; SPARQL endpoint
│
├── OpenEvo-CCS                  ← curriculum studies CTOs, CKOs, TSOs
│
├── OpenEvo-EvolutionEducation   ← evolution education domain objects
│
├── OpenEvo-OriginsScience       ← origins of science domain objects
│
├── OpenEvo-AgentSystems         ← AI agent definitions and interfaces
│
└── OpenEvo-Data                 ← raw data, annotations, empirical records
```

### 3.2 Dependency Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  OpenEvo Concept Base                    │
│          (ontology + schemas + vocabularies)             │
└─────────────┬─────────────┬──────────────┬──────────────┘
              │             │              │
              ▼             ▼              ▼
        ┌──────────┐ ┌──────────┐  ┌──────────────┐
        │ CCS Repo │ │ Evol.    │  │ Origins      │
        │          │ │ Repo     │  │ Science Repo │
        └────┬─────┘ └────┬─────┘  └──────┬───────┘
             │            │               │
             └────────────┼───────────────┘
                          ▼
              ┌───────────────────────┐
              │    OpenEvo Graph      │
              │ (compiled knowledge   │
              │      graph)           │
              └──────────┬────────────┘
                         │
              ┌──────────┼──────────────┐
              ▼          ▼              ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │  SPARQL  │ │ GraphQL  │ │  Visual- │
        │ Endpoint │ │   API    │ │ ization  │
        └────┬─────┘ └────┬─────┘ └──────────┘
             │            │
             └─────┬──────┘
                   ▼
          ┌─────────────────┐
          │    AI Agents    │
          │    Research     │
          │   Interfaces    │
          └─────────────────┘
```

### 3.3 The Concept Base as Shared Dependency

Every repository in the organization:

1. Declares its dependency on a specific **schema version** of the Concept Base
2. Validates all objects against the declared schema before merge
3. References only vocabulary terms defined in the Concept Base vocabulary registry
4. Mints object IDs only within its authorized namespace tier

---

## Section 4: Upper Ontology Alignment

### 4.1 Purpose of Upper Ontology Alignment

Upper ontologies provide the philosophical scaffolding that ensures semantic interoperability across domains. Without upper ontology alignment, two systems can share vocabulary while meaning incompatible things — a critical failure mode for distributed ecosystems.

### 4.2 Alignment Targets

The OpenEvo Concept Base aligns with the following upper ontologies:

| Upper Ontology | Alignment Purpose |
|---|---|
| **Basic Formal Ontology (BFO)** | Distinguishes continuants (persistent entities) from occurrents (processes and events). CTO and CKO are continuants; selection events and adoption events are occurrents. |
| **Dublin Core Metadata Initiative (DCMI)** | Basic bibliographic metadata (creator, date, subject, description, rights) |
| **SKOS (Simple Knowledge Organization System)** | Controlled vocabulary representation; concept schemes; broader/narrower/related relationships |
| **Schema.org** | Discoverability; structured data markup; CreativeWork, Dataset, EducationalOccupationalCredential |
| **PROV-O (Provenance Ontology)** | Provenance chains; entity-activity-agent triples; derivation and revision tracking |

### 4.3 Core Class Hierarchy

```
owl:Thing
│
├── oecb:ContinuantEntity
│   ├── oecb:KnowledgeObject
│   │   ├── oecb:CurriculumTheoryObject         (CTO)
│   │   ├── oecb:CurriculumKnowledgeObject      (CKO)
│   │   ├── oecb:TheorySpaceObject              (TSO)
│   │   ├── oecb:EvidenceObject                 (EVO)
│   │   ├── oecb:CompetencyObject               (CMO)
│   │   └── oecb:AgentObject                    (AGO)
│   │
│   └── oecb:ConceptualEntity
│       ├── oecb:TheoreticalClaim
│       ├── oecb:ConceptualDimension
│       └── oecb:TheoryConflict                 (CFO)
│
└── oecb:OccurrentEntity
    ├── oecb:SelectionEvent
    ├── oecb:AdoptionEvent
    ├── oecb:RevisionEvent
    └── oecb:MergerEvent
```

### 4.4 Namespace Prefix Declarations

```turtle
@prefix oecb:   <https://openevo.net/ontology/core#> .
@prefix oevo:   <https://openevo.net/vocabulary/> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix skos:   <http://www.w3.org/2004/02/skos/core#> .
@prefix prov:   <http://www.w3.org/ns/prov#> .
@prefix schema: <https://schema.org/> .
@prefix bfo:    <http://purl.obolibrary.org/obo/BFO_> .
@prefix owl:    <http://www.w3.org/2002/07/owl#> .
@prefix rdf:    <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs:   <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd:    <http://www.w3.org/2001/XMLSchema#> .
```

---

## Section 5: Core Relational Vocabulary

### 5.1 Purpose

The relational vocabulary defines the **typed edges** of the OpenEvo knowledge graph. Without defined relationships, the system cannot support inference, conflict detection, or AI agent querying. Every relationship in this vocabulary has a defined:

- **Domain**: the class of subject entities
- **Range**: the class of object entities
- **Inverse** (where applicable)
- **Semantic definition**
- **Evolutionary interpretation**

### 5.2 Primary Relationships

#### 5.2.1 Theory-Instance Relationships

```
oecb:instantiates
  domain:    CurriculumKnowledgeObject
  range:     CurriculumTheoryObject
  inverse:   oecb:isInstantiatedBy
  definition: A concrete educational artifact embodies or exemplifies the claims
              of a curriculum theory.
  example:   CKO-THURINGIA-BIOLOGY-001 oecb:instantiates CTO-CURRICULUM-COMPRESSION-001
  evolutionary: Instantiation density is a proxy for theoretical fitness in practice.
```

```
oecb:partiallyInstantiates
  domain:    CurriculumKnowledgeObject
  range:     CurriculumTheoryObject
  definition: The artifact embodies some but not all claims of the theory.
  note:      Use when a CKO reflects a theory's influence without full alignment.
```

#### 5.2.2 Evidence Relationships

```
oecb:supports
  domain:    EvidenceObject
  range:     TheoreticalClaim
  definition: Empirical or theoretical evidence increases the epistemic warrant
              for a theoretical claim.
  note:      strength is captured as a property of the support relationship,
             not of the EvidenceObject itself.

oecb:contradicts
  domain:    EvidenceObject
  range:     TheoreticalClaim
  definition: Evidence decreases the epistemic warrant for a theoretical claim
              or directly falsifies it.

oecb:qualifies
  domain:    EvidenceObject
  range:     TheoreticalClaim
  definition: Evidence neither supports nor contradicts but specifies boundary
              conditions, scope limitations, or contextual dependencies.

oecb:isNeutralToward
  domain:    EvidenceObject
  range:     TheoreticalClaim
  definition: Evidence is relevant to the domain of the claim but bears no
              discernible positive or negative epistemic relationship to it.
```

#### 5.2.3 Theory-Theory Relationships

```
oecb:extends
  domain:    CurriculumTheoryObject
  range:     CurriculumTheoryObject
  inverse:   oecb:isExtendedBy
  definition: One theory builds upon, refines, or adds to another while
              preserving its core claims.
  evolutionary: Extension is the primary mechanism of theoretical inheritance.

oecb:subsumes
  domain:    CurriculumTheoryObject
  range:     CurriculumTheoryObject
  inverse:   oecb:isSubsumedBy
  definition: One theory encompasses another as a special case.

oecb:competesWith
  domain:    CurriculumTheoryObject
  range:     CurriculumTheoryObject
  symmetric: true
  definition: Two theories make incompatible claims about the same domain
              such that both cannot be simultaneously true.
  evolutionary: Competition is the primary selection pressure between theories.

oecb:synthesizes
  domain:    CurriculumTheoryObject
  range:     CurriculumTheoryObject
  definition: A theory integrates claims from two or more previously separate theories.
  note:      The synthesizing theory should list all synthesized theories.
  evolutionary: Synthesis is the theoretical analog of horizontal gene transfer.

oecb:divergedFrom
  domain:    CurriculumTheoryObject
  range:     CurriculumTheoryObject
  definition: A theory branched from a common ancestor theory, developing
              distinct claims while retaining shared foundations.
  evolutionary: Direct analog of speciation.
```

#### 5.2.4 Genealogical Relationships

```
oecb:derivedFrom
  domain:    KnowledgeObject
  range:     KnowledgeObject
  definition: A knowledge object was produced by modifying, extending, or
              translating a prior knowledge object.
  note:      Applies across all object types.

oecb:branchedFrom
  domain:    KnowledgeObject
  range:     KnowledgeObject
  definition: A knowledge object was created as an independent fork of another,
              with the intention of developing separately.

oecb:mergedInto
  domain:    KnowledgeObject
  range:     KnowledgeObject
  definition: A knowledge object was absorbed into another, ceasing independent
              existence. The subject is deprecated; the object inherits its lineage.
```

#### 5.2.5 Theory Space Relationships

```
oecb:subsumesTheory
  domain:    TheorySpaceObject
  range:     CurriculumTheoryObject
  definition: A theory space contains a curriculum theory as one of its
              member positions.

oecb:associatesArtifact
  domain:    TheorySpaceObject
  range:     CurriculumKnowledgeObject
  definition: A theory space has an associated empirical artifact relevant
              to understanding its member theories.

oecb:identifiesGap
  domain:    TheorySpaceObject
  range:     oecb:ConceptualGap
  definition: A theory space formally identifies an unoccupied region — a
              position no existing theory has yet articulated.

oecb:containsTension
  domain:    TheorySpaceObject
  range:     ConflictObject
  definition: A theory space contains a formally registered conflict between
              two of its member theories.
```

#### 5.2.6 Competency Relationships

```
oecb:targetedBy
  domain:    CompetencyObject
  range:     CurriculumKnowledgeObject
  definition: A curriculum artifact explicitly targets a competency.

oecb:groundedIn
  domain:    CompetencyObject
  range:     CurriculumTheoryObject
  definition: A competency specification is theoretically grounded in a CTO.

oecb:prerequisiteFor
  domain:    CompetencyObject
  range:     CompetencyObject
  definition: Acquisition of one competency is a prerequisite for another.
```

### 5.3 Relationship Properties

Every instantiated relationship in the knowledge graph carries:

```yaml
relationship_instance:
  subject: "{object-URI}"
  predicate: "oecb:{relationship}"
  object: "{object-URI}"
  strength: strong | moderate | weak | contested | unknown
  confidence: high | medium | low
  asserted_by: "{AGO-URI}"
  asserted_date: "YYYY-MM-DD"
  reviewed_by: "{AGO-URI}"
  provenance_note: ""
  schema_version: "https://openevo.net/schema/relationships/1.0"
```

---

## Section 6: Object Schema Architecture

### 6.1 Schema Layer Overview

The Concept Base defines seven core object schemas:

| Schema | Abbrev | Purpose |
|---|---|---|
| Curriculum Theory Object | CTO | Abstract theoretical claims about curriculum |
| Curriculum Knowledge Object | CKO | Concrete educational artifacts and their annotations |
| Theory Space Object | TSO | Structured conceptual landscapes organizing CTOs |
| Evidence Object | EVO | Empirical and theoretical evidence bearing on claims |
| Competency Object | CMO | Specified learning competencies |
| Conflict Object | CFO | Formally registered theoretical conflicts |
| Agent Object | AGO | Contributors, reviewers, and system agents |

### 6.2 Universal Fields

Every object schema in the Concept Base shares a universal metadata block:

```yaml
# Universal Metadata Block — required on all OpenEvo objects

id: "https://openevo.net/ccs/{type}/{ID}"
type: "{ObjectType}"
schema_version: "https://openevo.net/schema/{Type}/1.0"
status: active | deprecated | merged | falsified | archived | sandbox
license: "https://creativecommons.org/licenses/by/4.0/"

provenance:
  created_by: "{AGO-URI}"
  created_date: "YYYY-MM-DD"
  reviewed_by: "{AGO-URI}"
  review_date: "YYYY-MM-DD"
  last_modified_by: "{AGO-URI}"
  last_modified_date: "YYYY-MM-DD"
  modification_note: ""
  source_repository: "https://github.com/OpenEvoCCS-lab/{repo}"

version:
  current: "1.0"
  history:
    - version: "1.0"
      date: "YYYY-MM-DD"
      change_type: initial | patch | minor | major | breaking
      change_summary: ""
      changed_by: "{AGO-URI}"

evolutionary_metadata:
  # See Section 15 — present on all objects
```

---

## Section 7: Curriculum Theory Object (CTO)

### 7.1 Purpose

The CTO represents **abstract theoretical claims** about curriculum — its structure, content, design, evolution, function, or epistemology. A CTO is the primary unit of theoretical knowledge in the ecosystem. It is not a summary of a paper or a description of a practice — it is a formal representation of a theoretical position with structured claims, specified scope, epistemic status, and evidence linkage.

### 7.2 Schema

```yaml
# ============================================================
# CURRICULUM THEORY OBJECT (CTO)
# Schema Version: 1.0
# https://openevo.net/schema/CTO/1.0
# ============================================================

# --- Universal Metadata Block ---
id: "https://openevo.net/ccs/cto/{CTO-ID}"
type: CurriculumTheoryObject
schema_version: "https://openevo.net/schema/CTO/1.0"
status: active
license: "https://creativecommons.org/licenses/by/4.0/"

provenance:
  created_by: "{AGO-URI}"
  created_date: "YYYY-MM-DD"
  reviewed_by: "{AGO-URI}"
  review_date: "YYYY-MM-DD"
  last_modified_by: "{AGO-URI}"
  last_modified_date: "YYYY-MM-DD"
  modification_note: ""
  source_repository: ""

version:
  current: "1.0"
  history: []

# --- Identity Fields ---
title: ""
short_name: ""
description: |
  A full discursive description of the theory, its origins, its significance,
  and its position within the broader theory space.

# --- Theoretical Foundations ---
theoretical_foundations:
  parent_disciplines:
    - ""              # e.g. curriculum theory, cognitive science, evolutionary biology
  foundational_works:
    - citation: ""
      URI: ""
      relationship: foundational | critical | contextual
  related_CTOs:
    - id: "{CTO-URI}"
      relationship: extends | subsumes | competesWith | synthesizes | divergedFrom

# --- Structured Claims ---
# Each claim is an epistemic object, not a string.
claims:
  - id: "{CTO-ID}-CLAIM-01"
    text: ""
    claim_type: causal | constitutive | normative | descriptive | existential | universal
    scope:
      educational_level: early_childhood | primary | secondary | tertiary | vocational | lifelong | all
      jurisdiction_type: universal | national | regional | institutional
      subject_domain: ""       # e.g. biology, mathematics, all
      temporal_scope: ""       # e.g. post-2000, historical, timeless
    epistemic_status: well_supported | contested | speculative | falsified | unknown
    falsification_conditions:
      - ""
    supporting_evidence:
      - id: "{EVO-URI}"
        relationship_strength: strong | moderate | weak
    contradicting_evidence:
      - id: "{EVO-URI}"
        relationship_strength: strong | moderate | weak
    qualifying_evidence:
      - id: "{EVO-URI}"
        qualification_note: ""
    status_rationale: |
      Explanation of why this epistemic status has been assigned.

# --- Mechanisms ---
mechanisms:
  - id: "{CTO-ID}-MECH-01"
    name: ""
    description: |
      How this mechanism operates to produce the effects claimed by the theory.
    level: micro | meso | macro
    related_claims:
      - "{CTO-ID}-CLAIM-01"

# --- Scope and Applicability ---
scope:
  intended_domain: ""
  boundary_conditions:
    - ""
  known_limitations:
    - ""
  context_dependencies:
    - ""

# --- Related Concepts ---
related_concepts:
  - term: ""
    vocabulary_URI: "https://openevo.net/vocabulary/{term}"
    relationship: central | peripheral | contrasting

# --- Theory Space Membership ---
theory_spaces:
  - id: "{TSO-URI}"
    role: core | peripheral | critical | historical

# --- Competency Grounding ---
grounded_competencies:
  - "{CMO-URI}"

# --- Evolutionary Metadata ---
evolutionary_metadata:
  # See Section 15

# --- External Alignments ---
external_alignments:
  - standard: ""       # e.g. Dublin Core, SKOS, ASN
    mapped_element: ""
    mapping_URI: ""
```

### 7.3 Worked Example

```yaml
id: "https://openevo.net/ccs/cto/CTO-CURRICULUM-COMPRESSION-001"
type: CurriculumTheoryObject
schema_version: "https://openevo.net/schema/CTO/1.0"
status: active
license: "https://creativecommons.org/licenses/by/4.0/"

provenance:
  created_by: "https://openevo.net/ccs/ago/AGO-RESEARCHER-001"
  created_date: "2024-01-15"
  reviewed_by: "https://openevo.net/ccs/ago/AGO-RESEARCHER-002"
  review_date: "2024-02-01"
  last_modified_by: "https://openevo.net/ccs/ago/AGO-RESEARCHER-001"
  last_modified_date: "2024-03-10"
  modification_note: "Added Claim 03 following review."
  source_repository: "https://github.com/OpenEvoCCS-lab/OpenEvo-CCS"

version:
  current: "1.1"
  history:
    - version: "1.0"
      date: "2024-01-15"
      change_type: initial
      change_summary: "Initial object creation."
      changed_by: "https://openevo.net/ccs/ago/AGO-RESEARCHER-001"
    - version: "1.1"
      date: "2024-03-10"
      change_type: minor
      change_summary: "Added Claim 03; updated epistemic status of Claim 01."
      changed_by: "https://openevo.net/ccs/ago/AGO-RESEARCHER-001"

title: "Curriculum as Compression-Decompression"
short_name: "curriculum-compression"
description: |
  This theory proposes that curriculum design is fundamentally a process
  of selective compression — the reduction of expansive disciplinary
  knowledge structures into sequenced, learnable forms. Learning, in this
  framework, is the inverse process: guided decompression, in which learners
  reconstruct explanatory models from compressed representations.
  The theory draws on information theory, cognitive science, and curriculum
  epistemology to formalize what curriculum designers do intuitively.

theoretical_foundations:
  parent_disciplines:
    - curriculum theory
    - information theory
    - cognitive science
    - philosophy of education
  foundational_works:
    - citation: "Schwab, J.J. (1969). The Practical: A Language for Curriculum."
      URI: ""
      relationship: foundational
    - citation: "Bruner, J. (1960). The Process of Education."
      URI: "https://doi.org/..."
      relationship: foundational
  related_CTOs:
    - id: "https://openevo.net/ccs/cto/CTO-PEDAGOGICAL-CONTENT-KNOWLEDGE-001"
      relationship: extends
    - id: "https://openevo.net/ccs/cto/CTO-KNOWLEDGE-TRANSFORMATION-001"
      relationship: competesWith

claims:
  - id: "CTO-CURRICULUM-COMPRESSION-001-CLAIM-01"
    text: >
      Curriculum design involves selective compression of disciplinary knowledge
      such that the structural and explanatory relationships of the discipline
      are preserved in compressed form.
    claim_type: constitutive
    scope:
      educational_level: all
      jurisdiction_type: universal
      subject_domain: all
      temporal_scope: timeless
    epistemic_status: contested
    falsification_conditions:
      - >
        Evidence that documented curriculum design processes involve no selection
        among disciplinary knowledge elements.
      - >
        Evidence that compressed curriculum representations systematically fail
        to preserve disciplinary structure.
    supporting_evidence:
      - id: "https://openevo.net/ccs/evo/EVO-COMPRESSION-001"
        relationship_strength: moderate
    contradicting_evidence: []
    qualifying_evidence:
      - id: "https://openevo.net/ccs/evo/EVO-COMPRESSION-002"
        qualification_note: >
          Evidence suggests compression fidelity varies significantly by
          subject domain, with formal sciences preserving structure more
          reliably than interpretive disciplines.
    status_rationale: |
      The claim has moderate empirical support from curriculum analysis studies
      but faces theoretical contestation from constructivist frameworks that
      reject the information-theoretic framing.

  - id: "CTO-CURRICULUM-COMPRESSION-001-CLAIM-02"
    text: >
      Learning involves guided decompression: the reconstruction of explanatory
      models from compressed curriculum representations under teacher or
      environment scaffolding.
    claim_type: causal
    scope:
      educational_level: primary | secondary | tertiary
      jurisdiction_type: universal
      subject_domain: all
      temporal_scope: timeless
    epistemic_status: speculative
    falsification_conditions:
      - >
        Evidence that learners who successfully complete curriculum sequences
        do not develop structurally richer models than those presented in
        curriculum materials.
    supporting_evidence: []
    contradicting_evidence: []
    qualifying_evidence: []
    status_rationale: |
      The decompression claim is theoretically coherent but has not been
      directly tested empirically. Marked speculative pending designed study.

  - id: "CTO-CURRICULUM-COMPRESSION-001-CLAIM-03"
    text: >
      The fidelity of compression — the degree to which compressed curriculum
      forms preserve disciplinary structure — is a measurable property of
      curriculum artifacts.
    claim_type: existential
    scope:
      educational_level: all
      jurisdiction_type: universal
      subject_domain: all
      temporal_scope: timeless
    epistemic_status: speculative
    falsification_conditions:
      - >
        Demonstration that no operationalizable measure of structural
        preservation can be constructed or validated across subject domains.
    supporting_evidence: []
    contradicting_evidence: []
    qualifying_evidence: []
    status_rationale: |
      This claim is the foundational measurement premise of the theory.
      Without it, the theory is not scientifically tractable. Currently
      marked speculative as no validated measurement instrument exists.

mechanisms:
  - id: "CTO-CURRICULUM-COMPRESSION-001-MECH-01"
    name: "Selective Knowledge Reduction"
    description: |
      Curriculum designers apply selection criteria — often implicit —
      to determine which elements of disciplinary knowledge are included,
      simplified, sequenced, or excluded. These criteria reflect epistemic,
      pedagogical, social, and political pressures.
    level: meso
    related_claims:
      - "CTO-CURRICULUM-COMPRESSION-001-CLAIM-01"

scope:
  intended_domain: "Curriculum design and curriculum epistemology"
  boundary_conditions:
    - "Applies to formal curriculum design contexts with identifiable disciplinary sources"
  known_limitations:
    - "The information-theoretic framing may not transfer to arts and humanities curricula"
  context_dependencies:
    - "Assumes the existence of a reference discipline with recoverable structure"

related_concepts:
  - term: "curriculum"
    vocabulary_URI: "https://openevo.net/vocabulary/curriculum"
    relationship: central
  - term: "compression"
    vocabulary_URI: "https://openevo.net/vocabulary/compression"
    relationship: central
  - term: "disciplinary structure"
    vocabulary_URI: "https://openevo.net/vocabulary/disciplinary-structure"
    relationship: central
  - term: "pedagogical content knowledge"
    vocabulary_URI: "https://openevo.net/vocabulary/pedagogical-content-knowledge"
    relationship: peripheral

theory_spaces:
  - id: "https://openevo.net/ccs/tso/TSO-COMPUTATIONAL-CURRICULUM-001"
    role: core

grounded_competencies:
  - "https://openevo.net/ccs/cmo/CMO-CURRICULUM-DESIGN-ANALYSIS-001"
```

---

## Section 8: Curriculum Knowledge Object (CKO)

### 8.1 Purpose

The CKO represents **concrete educational artifacts** — documents, standards, curricula, lessons, assessments, textbooks, and policy texts — and their theoretical annotations. A CKO is always grounded in an identifiable, externally existing artifact. It is not a description of a hypothetical artifact or a general category of artifacts.

### 8.2 CKO Profiles

CKOs exist at three levels of engagement with their source artifacts. The profile must be declared.

```
Profile 1: Bibliographic
  — bibliographic metadata + persistent URI
  — no content extraction
  — no theoretical annotation
  — use when: artifact exists but has not yet been analyzed

Profile 2: Annotated
  — bibliographic metadata + persistent URI
  — theoretical annotations linking artifact to CTOs
  — no structured content extraction
  — use when: theoretical relevance is established but content not yet formalized

Profile 3: Structured Representation
  — bibliographic metadata + persistent URI
  — theoretical annotations
  — structured content extraction (competency maps, content excerpts, sequence structures)
  — use when: artifact has been formally analyzed and content formalized
```

### 8.3 Schema

```yaml
# ============================================================
# CURRICULUM KNOWLEDGE OBJECT (CKO)
# Schema Version: 1.0
# https://openevo.net/schema/CKO/1.0
# ============================================================

# --- Universal Metadata Block ---
id: "https://openevo.net/ccs/cko/{CKO-ID}"
type: CurriculumKnowledgeObject
schema_version: "https://openevo.net/schema/CKO/1.0"
profile: bibliographic | annotated | structured_representation
status: active
license: "https://creativecommons.org/licenses/by/4.0/"

provenance:
  created_by: "{AGO-URI}"
  created_date: "YYYY-MM-DD"
  reviewed_by: "{AGO-URI}"
  review_date: "YYYY-MM-DD"
  last_modified_by: "{AGO-URI}"
  last_modified_date: "YYYY-MM-DD"
  modification_note: ""
  source_repository: ""

version:
  current: "1.0"
  history: []

# --- Artifact Identity ---
artifact:
  title: ""
  artifact_type: >
    state_curriculum | national_curriculum | lesson_plan | assessment |
    textbook | policy_document | teacher_guide | framework | standard | case_study
  creators:
    - name: ""
      role: author | editor | institution | government_body
  publication_date: "YYYY"
  jurisdiction:
    country: ""
    region: ""
    educational_level: early_childhood | primary | secondary | tertiary | vocational | all
    subject_domain: ""
  language: ""        # ISO 639-1 code

# --- Access ---
access:
  primary_URI: ""
  access_type: open | paywalled | institutional | unavailable
  archived_URI: ""    # e.g. Wayback Machine or institutional archive
  access_note: ""

# --- Theoretical Annotations (Annotated + Structured profiles) ---
theoretical_annotations:
  instantiates:
    - CTO_id: "{CTO-URI}"
      instantiation_type: full | partial
      instantiated_claims:
        - "{CTO-ID}-CLAIM-01"
      annotation_note: ""
      annotated_by: "{AGO-URI}"
      annotation_date: "YYYY-MM-DD"
  contradicts_CTOs:
    - CTO_id: "{CTO-URI}"
      contradiction_note: ""
  contextualizes_CTOs:
    - CTO_id: "{CTO-URI}"
      context_note: ""

# --- Content Representation (Structured profile only) ---
content_representation:
  competency_map:
    - CMO_id: "{CMO-URI}"
      location_in_artifact: ""    # e.g. "Chapter 3, Grade 7 Standards"
      excerpt: ""
  sequence_structure:
    - unit: ""
      order: 1
      duration: ""
      competencies:
        - "{CMO-URI}"
  content_excerpts:
    - excerpt_id: "{CKO-ID}-EXCERPT-01"
      text: ""
      location: ""
      relevant_claims:
        - "{CTO-ID}-CLAIM-01"
      annotation: ""

# --- Relationships to Other CKOs ---
artifact_relationships:
  derived_from:
    - "{CKO-URI}"
  influences:
    - "{CKO-URI}"
  superseded_by:
    - "{CKO-URI}"
  companion_artifacts:
    - "{CKO-URI}"

# --- Theory Space Membership ---
theory_spaces:
  - id: "{TSO-URI}"

# --- Evolutionary Metadata ---
evolutionary_metadata:
  # See Section 15
```

### 8.4 Worked Example

```yaml
id: "https://openevo.net/ccs/cko/CKO-THURINGIA-BIOLOGY-001"
type: CurriculumKnowledgeObject
schema_version: "https://openevo.net/schema/CKO/1.0"
profile: annotated
status: active
license: "https://creativecommons.org/licenses/by/4.0/"

provenance:
  created_by: "https://openevo.net/ccs/ago/AGO-RESEARCHER-001"
  created_date: "2024-02-20"
  reviewed_by: "https://openevo.net/ccs/ago/AGO-RESEARCHER-003"
  review_date: "2024-03-01"
  last_modified_by: "https://openevo.net/ccs/ago/AGO-RESEARCHER-001"
  last_modified_date: "2024-03-01"
  modification_note: ""
  source_repository: "https://github.com/OpenEvoCCS-lab/OpenEvo-CCS"

version:
  current: "1.0"
  history:
    - version: "1.0"
      date: "2024-02-20"
      change_type: initial
      change_summary: "Initial object creation at annotated profile."
      changed_by: "https://openevo.net/ccs/ago/AGO-RESEARCHER-001"

artifact:
  title: "Lehrplan für das Gymnasium — Biologie (Thüringen)"
  artifact_type: state_curriculum
  creators:
    - name: "Thüringer Ministerium für Bildung, Jugend und Sport"
      role: government_body
  publication_date: "2019"
  jurisdiction:
    country: "DE"
    region: "Thuringia"
    educational_level: secondary
    subject_domain: biology
  language: "de"

access:
  primary_URI: "https://www.schulportal-thueringen.de/..."
  access_type: open
  archived_URI: ""
  access_note: "German language document. Full PDF available at primary URI."

theoretical_annotations:
  instantiates:
    - CTO_id: "https://openevo.net/ccs/cto/CTO-CURRICULUM-COMPRESSION-001"
      instantiation_type: partial
      instantiated_claims:
        - "CTO-CURRICULUM-COMPRESSION-001-CLAIM-01"
      annotation_note: >
        The curriculum exhibits clear selective compression of evolutionary
        biology: the concept of natural selection is presented as the
        organizing principle, with population genetics and molecular mechanisms
        compressed into supporting narrative rather than independent strands.
      annotated_by: "https://openevo.net/ccs/ago/AGO-RESEARCHER-001"
      annotation_date: "2024-02-20"

theory_spaces:
  - id: "https://openevo.net/ccs/tso/TSO-EVOLUTION-EDUCATION-001"
```

---

## Section 9: Theory Space Object (TSO)

### 9.1 Purpose

A TSO represents a **structured conceptual landscape** — a region of theory space defined by its central question, its dimensions of variation, its member theories, its identified gaps, and its internal tensions. A TSO is not a folder, a tag, or a curated list. It is a **computational object that guides research** by representing what has been theorized and what has not.

### 9.2 Schema

```yaml
# ============================================================
# THEORY SPACE OBJECT (TSO)
# Schema Version: 1.0
# https://openevo.net/schema/TSO/1.0
# ============================================================

# --- Universal Metadata Block ---
id: "https://openevo.net/ccs/tso/{TSO-ID}"
type: TheorySpaceObject
schema_version: "https://openevo.net/schema/TSO/1.0"
status: active
license: "https://creativecommons.org/licenses/by/4.0/"

provenance:
  created_by: "{AGO-URI}"
  created_date: "YYYY-MM-DD"
  reviewed_by: "{AGO-URI}"
  review_date: "YYYY-MM-DD"
  last_modified_by: "{AGO-URI}"
  last_modified_date: "YYYY-MM-DD"
  modification_note: ""
  source_repository: ""

version:
  current: "1.0"
  history: []

# --- Identity ---
title: ""
short_name: ""
central_question: |
  The primary intellectual question that defines the boundaries of this
  theory space. All member CTOs address some aspect of this question.

description: |
  A discursive account of the theory space, its historical development,
  its significance, and its relationship to adjacent theory spaces.

# --- Dimensional Structure ---
# The conceptual axes along which theories in this space vary.
dimensions:
  - id: "{TSO-ID}-DIM-01"
    name: ""
    description: ""
    pole_low:
      label: ""
      description: ""
    pole_high:
      label: ""
      description: ""
    relevant_CTOs:
      - CTO_id: "{CTO-URI}"
        position: low | mid_low | middle | mid_high | high
        position_note: ""

# --- Member Theories ---
member_theories:
  - id: "{CTO-URI}"
    role: core | peripheral | critical | historical | emerging
    role_note: ""
    dimensional_positions:
      - dimension_id: "{TSO-ID}-DIM-01"
        position: low | mid_low | middle | mid_high | high

# --- Associated Artifacts ---
associated_artifacts:
  - id: "{CKO-URI}"
    relevance: ""

# --- Attractors ---
# Well-developed theoretical positions that many theories converge toward.
attractors:
  - id: "{TSO-ID}-ATTR-01"
    name: ""
    description: ""
    converging_CTOs:
      - "{CTO-URI}"
    dimensional_position:
      - dimension_id: "{TSO-ID}-DIM-01"
        position: ""

# --- Identified Gaps ---
# Regions of the theory space where no theory yet exists but logically could.
gaps:
  - id: "{TSO-ID}-GAP-01"
    description: ""
    dimensions_affected:
      - "{TSO-ID}-DIM-01"
    research_priority: high | medium | low
    suggested_research_questions:
      - ""
    adjacent_CTOs:
      - "{CTO-URI}"

# --- Internal Tensions ---
tensions:
  - id: "{CFO-URI}"
    parties:
      - "{CTO-URI}"
      - "{CTO-URI}"
    tension_summary: ""

# --- Adjacent Theory Spaces ---
adjacent_theory_spaces:
  - id: "{TSO-URI}"
    relationship: overlapping | nested | adjacent | competing
    shared_dimensions:
      - ""

# --- Research Domains ---
research_domains:
  - ""

# --- Open Questions ---
open_questions:
  - id: "{TSO-ID}-OQ-01"
    question: ""
    priority: high | medium | low
    related_gaps:
      - "{TSO-ID}-GAP-01"
    related_CTOs:
      - "{CTO-URI}"

# --- Evolutionary Metadata ---
evolutionary_metadata:
  # See Section 15
```

---

## Section 10: Evidence Object (EVO)

### 10.1 Purpose

The EVO represents **empirical or theoretical evidence** bearing on the claims of curriculum theories. Evidence objects are the primary mechanism by which the epistemic status of theoretical claims is updated. They connect the theoretical layer (CTOs) to the empirical world (studies, observations, practitioner reports, meta-analyses).

### 10.2 Schema

```yaml
# ============================================================
# EVIDENCE OBJECT (EVO)
# Schema Version: 1.0
# https://openevo.net/schema/EVO/1.0
# ============================================================

# --- Universal Metadata Block ---
id: "https://openevo.net/ccs/evo/{EVO-ID}"
type: EvidenceObject
schema_version: "https://openevo.net/schema/EVO/1.0"
status: active
license: "https://creativecommons.org/licenses/by/4.0/"

provenance:
  created_by: "{AGO-URI}"
  created_date: "YYYY-MM-DD"
  reviewed_by: "{AGO-URI}"
  review_date: "YYYY-MM-DD"
  last_modified_by: "{AGO-URI}"
  last_modified_date: "YYYY-MM-DD"
  modification_note: ""
  source_repository: ""

version:
  current: "1.0"
  history: []

# --- Evidence Source ---
source:
  citation: ""         # Full bibliographic citation
  URI: ""              # DOI or stable URL
  access_type: open | paywalled | grey_literature | unpublished
  archived_URI: ""
  source_type: >
    empirical_study | meta_analysis | systematic_review | theoretical_argument |
    practitioner_report | policy_document | historical_analysis | mixed_methods

# --- Methodology (for empirical sources) ---
methodology:
  research_design: >
    qualitative_case_study | quantitative_survey | randomized_controlled_trial |
    quasi_experiment | ethnography | content_analysis | document_analysis |
    computational_analysis | mixed_methods | theoretical | not_applicable
  sample_size: null
  sampling_strategy: ""
  context:
    country: ""
    educational_level: ""
    subject_domain: ""
  temporal_scope:
    start: "YYYY"
    end: "YYYY"
  limitations:
    - ""

# --- Claim Relationships ---
claim_relationships:
  - claim_id: "{CTO-ID}-CLAIM-XX"
    CTO_id: "{CTO-URI}"
    relationship: supports | contradicts | qualifies | is_neutral_toward
    strength: strong | moderate | weak | inconclusive
    directness: direct | indirect
    reasoning: |
      Explicit statement of why this evidence bears on this claim
      in this way at this strength.

# --- Summary ---
summary: |
  A concise, plain-language summary of what this evidence shows
  and why it is relevant to the claims it is linked to.

key_findings:
  - ""

# --- Quality Assessment ---
quality_assessment:
  assessed_by: "{AGO-URI}"
  assessment_date: "YYYY-MM-DD"
  methodological_rigor: high | medium | low | not_assessed
  replication_status: replicated | not_replicated | contested | not_applicable
  peer_reviewed: true | false
  quality_notes: ""
```

---

## Section 11: Competency Object (CMO)

### 11.1 Purpose

The CMO represents a **specified learning competency** — a defined, observable capability that a learner develops through engagement with curriculum. Competencies connect theoretical claims about learning (CTOs) to concrete curriculum content (CKOs) and provide the unit of analysis for curriculum design and assessment.

### 11.2 Schema

```yaml
# ============================================================
# COMPETENCY OBJECT (CMO)
# Schema Version: 1.0
# https://openevo.net/schema/CMO/1.0
# ============================================================

# --- Universal Metadata Block ---
id: "https://openevo.net/ccs/cmo/{CMO-ID}"
type: CompetencyObject
schema_version: "https://openevo.net/schema/CMO/1.0"
status: active
license: "https://creativecommons.org/licenses/by/4.0/"

provenance:
  created_by: "{AGO-URI}"
  created_date: "YYYY-MM-DD"
  reviewed_by: "{AGO-URI}"
  review_date: "YYYY-MM-DD"
  last_modified_by: "{AGO-URI}"
  last_modified_date: "YYYY-MM-DD"
  modification_note: ""
  source_repository: ""

version:
  current: "1.0"
  history: []

# --- Identity ---
title: ""
competency_type: >
  cognitive | metacognitive | procedural | affective |
  communicative | investigative | design | interdisciplinary

description: |
  A full description of what a learner demonstrating this competency
  can do, understand, and apply.

# --- Observable Indicators ---
observable_indicators:
  - id: "{CMO-ID}-IND-01"
    text: ""
    performance_level: foundational | developing | proficient | advanced

# --- Educational Level and Domain ---
educational_level: early_childhood | primary | secondary | tertiary | vocational | all
subject_domain: ""
cross_disciplinary: true | false

# --- Theoretical Grounding ---
theoretical_grounding:
  - CTO_id: "{CTO-URI}"
    grounding_note: ""

# --- Prerequisite Structure ---
prerequisites:
  - CMO_id: "{CMO-URI}"
    prerequisite_type: required | recommended

enables:
  - CMO_id: "{CMO-URI}"

# --- Curriculum Linkage ---
targeted_by:
  - CKO_id: "{CKO-URI}"
    location_in_artifact: ""

# --- External Standard Alignment ---
external_alignments:
  - standard_name: ""      # e.g. NGSS, Common Core, European Reference Framework
    standard_code: ""
    alignment_URI: ""
    alignment_strength: direct | partial | approximate
```

---

## Section 12: Conflict Object (CFO)

### 12.1 Purpose

The CFO formally registers **theoretical conflicts** — cases where two or more CTOs make incompatible claims about the same domain. Conflicts are not failures of the system; they are its most intellectually valuable content. They represent the frontier of theoretical knowledge, the sites of active contestation, and the engines of theoretical evolution. Without formal conflict representation, the system cannot model selection dynamics between competing theories.

### 12.2 Schema

```yaml
# ============================================================
# CONFLICT OBJECT (CFO)
# Schema Version: 1.0
# https://openevo.net/schema/CFO/1.0
# ============================================================

# --- Universal Metadata Block ---
id: "https://openevo.net/ccs/cfo/{CFO-ID}"
type: TheoreticalConflict
schema_version: "https://openevo.net/schema/CFO/1.0"
status: active
license: "https://creativecommons.org/licenses/by/4.0/"

provenance:
  created_by: "{AGO-URI}"
  created_date: "YYYY-MM-DD"
  reviewed_by: "{AGO-URI}"
  review_date: "YYYY-MM-DD"
  last_modified_by: "{AGO-URI}"
  last_modified_date: "YYYY-MM-DD"
  modification_note: ""
  source_repository: ""

version:
  current: "1.0"
  history: []

# --- Identity ---
title: ""
conflict_type: >
  incompatible_claims | unit_of_analysis | scope_dispute |
  methodological | normative | ontological | definitional

description: |
  A discursive account of the nature, origins, and significance of
  this theoretical conflict.

# --- Parties ---
parties:
  - CTO_id: "{CTO-URI}"
    position_summary: ""
    incompatible_claims:
      - "{CTO-ID}-CLAIM-XX"

# --- Domain of Conflict ---
conflict_domain: ""          # the subject matter over which the conflict occurs
theory_space: "{TSO-URI}"

# --- Incompatibility Analysis ---
incompatibility_analysis: |
  A precise statement of why the claims of the parties cannot both be true,
  and what empirical or conceptual resolution would look like.

# --- Resolution Status ---
resolution:
  status: unresolved | partially_resolved | resolved | dissolved | suspended
  resolution_type: >
    empirical_evidence | conceptual_clarification | scope_restriction |
    synthesis | one_party_retracted | declared_incommensurable
  resolution_summary: ""
  resolution_date: "YYYY-MM-DD"
  resolution_evidence:
    - "{EVO-URI}"
  resolution_CTO:
    - "{CTO-URI}"       # synthesizing theory, if applicable

# --- Research Implications ---
research_implications:
  - ""

# --- Evolutionary Significance ---
evolutionary_significance: |
  How this conflict is expected to drive theoretical evolution in its
  theory space, and what selection dynamics it instantiates.
```

---

## Section 13: Agent Object (AGO)

### 13.1 Purpose

The AGO represents **contributors, reviewers, and system agents** in the OpenEvo ecosystem. Attribution tracking, expertise mapping, network analysis of the contributor community, and governance role assignment all depend on a well-specified agent model.

### 13.2 Schema

```yaml
# ============================================================
# AGENT OBJECT (AGO)
# Schema Version: 1.0
# https://openevo.net/schema/AGO/1.0
# ============================================================

# --- Universal Metadata Block ---
id: "https://openevo.net/ccs/ago/{AGO-ID}"
type: AgentObject
schema_version: "https://openevo.net/schema/AGO/1.0"
status: active
license: "https://creativecommons.org/licenses/by/4.0/"

provenance:
  created_date: "YYYY-MM-DD"
  source_repository: ""

version:
  current: "1.0"
  history: []

# --- Agent Type ---
agent_type: human_researcher | institution | ai_system | collective

# --- Identity ---
display_name: ""
ORCID: ""               # for human researchers
ROR_id: ""              # for institutions
affiliation: ""

# --- Expertise ---
expertise_domains:
  - domain: ""
    vocabulary_URI: "https://openevo.net/vocabulary/{term}"
    level: primary | secondary

# --- Governance Role ---
governance_roles:
  - role: >
      core_maintainer | domain_editor | reviewer |
      contributor | external_affiliate | ai_agent
    scope: ""            # e.g. specific domain or repository
    since: "YYYY-MM-DD"
    until: "YYYY-MM-DD"  # null if ongoing

# --- Contribution Record ---
contributions:
  objects_created:
    - "{object-URI}"
  objects_reviewed:
    - "{object-URI}"
  objects_modified:
    - "{object-URI}"

# --- Contact and Discovery ---
contact_URI: ""          # personal page, lab page, or institutional profile
github_handle: ""
```

---

## Section 14: Versioning Model

### 14.1 Version Increment Semantics

Every object in the Concept Base follows a three-tier versioning scheme:

```
MAJOR.MINOR.PATCH
```

| Tier | Triggers | Examples |
|---|---|---|
| **PATCH** | Corrected errors; improved descriptions; clarified language; no claim changes | Fixed typo; clarified scope note |
| **MINOR** | Added claims; added evidence linkages; added relationships; extended scope | New claim added; new EVO linked |
| **MAJOR** | Changed or removed core claims; changed theoretical foundations; changed object type | Claim 01 revised; foundational work removed |
| **BREAKING** | Schema changes that affect downstream consumers; object type redefined | Field renamed; required field added |

### 14.2 Object Status Vocabulary

```yaml
object_status_vocabulary:

  active:
    definition: "Current, maintained, and recommended for use."
    successor: null

  deprecated:
    definition: >
      Superseded by a newer version or a different object.
      Preserved for historical reference. Not recommended for new use.
    requires_field: deprecated_by    # URI of successor object

  merged:
    definition: >
      Absorbed into another object. Ceases independent existence.
      The successor object inherits this object's lineage.
    requires_field: merged_into      # URI of absorbing object

  falsified:
    definition: >
      Marked as empirically refuted. Core claims have been shown to be false.
      Preserved for historical and pedagogical reference.
    requires_field: falsified_by     # URI of EVO demonstrating falsification

  archived:
    definition: >
      Historically preserved but no longer active or maintained.
      May represent superseded curricula, obsolete standards, or closed theories.
    requires_field: archive_date

  sandbox:
    definition: >
      Experimental. Not validated against schema. Not included in production graph.
      Used for early-stage development and speculative extensions.
    requires_field: null
```

### 14.3 Relationship Versioning

Relationships in the knowledge graph are versioned independently of the objects they connect. Each relationship instance carries:

```yaml
relationship_version:
  asserted_in_schema_version: "1.0"
  asserted_date: "YYYY-MM-DD"
  retracted_date: null          # populated if relationship is later removed
  retraction_reason: ""
  graph_named_graph: "https://openevo.net/graph/release/1.0"
```

The graph maintains **named graphs per release** so that the graph at any prior release can be reconstructed.

### 14.4 Schema Version Compatibility

Every object declares its schema version:

```yaml
schema_version: "https://openevo.net/schema/CTO/1.0"
```

Schema changes of type BREAKING require a **migration guide** published alongside the new schema version. The graph compilation pipeline maintains backward compatibility for one major schema version.

---

## Section 15: Evolutionary Metadata Layer

### 15.1 Purpose

The evolutionary metadata layer is the component most distinctively aligned with the project's core vision. It transforms the Concept Base from a static knowledge repository into a **dynamic evolutionary record** capable of representing the population-level dynamics of curriculum knowledge over time.

This layer appears on **every object** in the ecosystem. It is not optional.

### 15.2 Schema

```yaml
# ============================================================
# EVOLUTIONARY METADATA LAYER
# Embedded in all object schemas
# Schema Version: 1.0
# https://openevo.net/schema/evolutionary-metadata/1.0
# ============================================================

evolutionary_metadata:

  # --- Genealogy ---
  genealogy:
    derived_from:
      - id: "{object-URI}"
        relationship_type: revision | translation | adaptation | response | extension
        derivation_note: ""
    branched_from:
      id: null                    # populated if this object is a fork
      branch_date: "YYYY-MM-DD"
      branch_reason: ""
    merged_into:
      id: null                    # populated if this object was absorbed
      merger_date: "YYYY-MM-DD"
      merger_reason: ""
    lineage_root: null            # URI of original ancestor object, if known

  # --- Selection History ---
  selection_history:
    - event_id: "{object-ID}-SEL-01"
      event_date: "YYYY-MM-DD"
      event_type: >
        revision | adoption | rejection | merger | split |
        extension | falsification | rehabilitation | recontextualization
      pressure_type: >
        empirical | political | social | pedagogical |
        theoretical | technological | institutional
      pressure_source: ""         # description of what drove the change
      pressure_agent: "{AGO-URI}" # who or what exerted the pressure
      resulting_change: ""        # what changed in the object as a result
      evidence_reference: "{EVO-URI}"

  # --- Adoption Record ---
  adoption_record:
    - community: ""               # educational community, jurisdiction, institution
      community_URI: ""
      adoption_level: full | partial | cited_not_adopted | rejected | unknown
      adoption_timeframe:
        start: "YYYY"
        end: null                 # null if ongoing
      adoption_evidence_URI: ""
      adoption_note: ""

  # --- Fitness Indicators ---
  # Assessments of theoretical or practical fitness in current context.
  fitness_indicators:
    theoretical_coherence:
      value: high | medium | low | unknown
      assessment_note: ""
      assessed_by: "{AGO-URI}"
      assessed_date: "YYYY-MM-DD"
    empirical_support:
      value: high | medium | low | unknown
      assessment_note: ""
      assessed_by: "{AGO-URI}"
      assessed_date: "YYYY-MM-DD"
    practical_applicability:
      value: high | medium | low | unknown
      assessment_note: ""
      assessed_by: "{AGO-URI}"
      assessed_date: "YYYY-MM-DD"
    cross_context_robustness:
      value: high | medium | low | unknown
      assessment_note: ""
      assessed_by: "{AGO-URI}"
      assessed_date: "YYYY-MM-DD"
    interdisciplinary_reach:
      value: high | medium | low | unknown
      assessment_note: ""
      assessed_by: "{AGO-URI}"
      assessed_date: "YYYY-MM-DD"

  # --- Population Structure ---
  # Which communities of practice hold, use, or contest this object.
  population_structure:
    holding_communities:
      - community: ""
        relationship: holds | contests | ignores | unaware
    geographic_distribution: ""
    linguistic_distribution: ""

  # --- Drift and Selection Distinction ---
  # Records whether changes appear driven by evidence or by social dynamics.
  change_attribution:
    - version_transition: "1.0 → 1.1"
      primary_driver: evidence_driven | socially_driven | politically_driven | unknown
      attribution_confidence: high | medium | low
      attribution_note: ""
```

### 15.3 Evolutionary Dynamics Across the Ecosystem

The evolutionary metadata layer enables ecosystem-level analyses:

```
Lineage reconstruction:
  Query: All objects derived_from CTO-001 across all repositories.
  Result: A phylogenetic tree of curriculum theories.

Selection pressure analysis:
  Query: All revision events with pressure_type = empirical in TSO-001.
  Result: The evidence-driven selection history of a theory space.

Fitness landscape mapping:
  Query: All CTOs in TSO-001 with theoretical_coherence and empirical_support values.
  Result: A two-dimensional fitness landscape of a theory space.

Adoption geography:
  Query: All adoption_records for CTO-CURRICULUM-COMPRESSION-001.
  Result: The geographic and temporal diffusion of a curriculum theory.

Drift detection:
  Query: All revision events with primary_driver = socially_driven.
  Result: Instances of theoretical drift — change without evidence.
```

---

## Section 16: Graph Architecture

### 16.1 Graph Model

The OpenEvo Graph uses **RDF as its primary graph model** with a property graph projection for Neo4j compatibility.

```
Primary model:    RDF 1.1 (subject-predicate-object triples)
Named graphs:     One named graph per release version
Serializations:   Turtle (.ttl), JSON-LD (.jsonld), N-Quads (.nq)
Property graph:   Neo4j-compatible node/edge JSON export
```

### 16.2 Compilation Pipeline

```
┌─────────────────────────────────────────────┐
│           Source Repositories                │
│   (YAML objects validated against schemas)  │
└────────────────────┬────────────────────────┘
                     │  GitHub Actions trigger
                     ▼
┌─────────────────────────────────────────────┐
│              Schema Validation              │
│   (YAML → JSON Schema validation)           │
│   (Relationship domain/range checking)      │
│   (Vocabulary term validation)              │
│   (ID uniqueness enforcement)               │
└────────────────────┬────────────────────────┘
                     │  on validation pass
                     ▼
┌─────────────────────────────────────────────┐
│              Graph Builder                  │
│   (YAML → RDF triple generation)            │
│   (Relationship instantiation)              │
│   (Evolutionary edge generation)            │
│   (Named graph assignment)                  │
└────────────────────┬────────────────────────┘
                     │
          ┌──────────┼───────────┐
          ▼          ▼           ▼
    ┌──────────┐ ┌────────┐ ┌────────────┐
    │  Turtle  │ │JSON-LD │ │  Neo4j     │
    │  (.ttl)  │ │        │ │  import    │
    └────┬─────┘ └───┬────┘ └─────┬──────┘
         │           │             │
         └───────────┼─────────────┘
                     ▼
┌─────────────────────────────────────────────┐
│           Published Graph Store             │
│   (Apache Jena Fuseki SPARQL endpoint)      │
│   (Neo4j property graph instance)           │
│   (Static JSON exports for visualization)  │
└─────────────────────────────────────────────┘
```

### 16.3 Provenance in the Graph

Every triple in the graph is attributed to a specific object version via named graphs:

```turtle
# Named graph per release
<https://openevo.net/graph/release/1.0> {
    <https://openevo.net/ccs/cko/CKO-THURINGIA-BIOLOGY-001>
        oecb:instantiates
        <https://openevo.net/ccs/cto/CTO-CURRICULUM-COMPRESSION-001> .
}
```

### 16.4 Conflict Handling

When two CKOs make contradictory annotations about the same CTO, both edges are preserved in the graph with full provenance, and a CFO is automatically drafted and flagged for human review:

```yaml
conflict_auto_draft:
  triggered_by: "Contradictory annotation detected"
  parties:
    - CKO-URI-A annotates CTO-X with instantiation_type: full
    - CKO-URI-B annotates CTO-X with contradicts_CTOs
  status: awaiting_human_review
  auto_draft_date: "YYYY-MM-DD"
```

### 16.5 Update Triggers

```
Production graph update:  Triggered by merge to `release` branch
Staging graph update:     Triggered by merge to `main` branch
Validation only:          Triggered by pull request
```

---

## Section 17: Access and Query Layer

### 17.1 SPARQL Endpoint

```
Endpoint URI:    https://openevo.net/sparql
Protocol:        SPARQL 1.1 Query and Update
Authentication:  Read: open; Write: token-authenticated
Rate limit:      100 queries/minute (unauthenticated); 1000/minute (authenticated)
```

Example query — "What curriculum theories explain this standard?":

```sparql
PREFIX oecb: <https://openevo.net/ontology/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?theory ?title ?claim ?epistemic_status
WHERE {
  <https://openevo.net/ccs/cko/CKO-THURINGIA-BIOLOGY-001>
      oecb:instantiates ?theory .
  ?theory rdfs:label ?title .
  ?theory oecb:hasClaim ?claim_node .
  ?claim_node oecb:claimText ?claim .
  ?claim_node oecb:epistemicStatus ?epistemic_status .
}
```

Example query — "What theory spaces connect collective intelligence and curriculum?":

```sparql
PREFIX oecb: <https://openevo.net/ontology/core#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

SELECT DISTINCT ?tso ?tso_title ?cto ?cto_title
WHERE {
  ?tso a oecb:TheorySpaceObject ;
       rdfs:label ?tso_title ;
       oecb:subsumesTheory ?cto .
  ?cto rdfs:label ?cto_title ;
       oecb:relatedConcept ?concept1 ;
       oecb:relatedConcept ?concept2 .
  ?concept1 skos:prefLabel "collective intelligence" .
  ?concept2 skos:prefLabel "curriculum" .
}
```

### 17.2 REST API

```
Base URI:    https://openevo.net/api/v1/

Endpoints:

GET  /api/v1/{object-type}/{ID}
     Returns the object as JSON-LD

GET  /api/v1/{object-type}/{ID}/versions
     Returns version history

GET  /api/v1/{object-type}/{ID}/relationships
     Returns all relationships involving this object

GET  /api/v1/tso/{ID}/gap-map
     Returns the gap map for a theory space

GET  /api/v1/tso/{ID}/fitness-landscape
     Returns fitness indicator data for all CTOs in the space

GET  /api/v1/cto/{ID}/lineage
     Returns the full genealogical tree of a theory object

GET  /api/v1/graph/conflicts
     Returns all active CFOs

GET  /api/v1/graph/stats
     Returns ecosystem-level statistics
```

### 17.3 Content Negotiation

Every object URI supports content negotiation:

```
Accept: application/ld+json       → JSON-LD
Accept: text/turtle               → Turtle RDF
Accept: application/json          → Plain JSON (schema-valid YAML serialized)
Accept: text/html                 → Human-readable rendered view
```

### 17.4 AI Agent Interface

AI agents operating over the OpenEvo ecosystem use:

```
Primary interface:    SPARQL endpoint
Secondary interface:  REST API
Context provision:    JSON-LD frames for each object type (published at schema URIs)
Vocabulary grounding: SKOS concept schemes at vocabulary URIs
```

The system is designed to be compatible with agents that use retrieval-augmented generation (RAG) over the graph, structured query agents using SPARQL, and LLM-based agents using JSON-LD context for grounding.

---

## Section 18: Namespace Governance and Trust Tiers

### 18.1 Three-Tier Architecture

The `openevo.net` namespace functions as a **trust anchor**. Its integrity depends on defined governance of who may mint URIs within it.

```
┌────────────────────────────────────────────────────────┐
│                    Tier 1: Core                        │
│         https://openevo.net/ccs/                       │
│                                                        │
│  Minted by:       OpenEvo core team only              │
│  Review process:  Full peer review; editorial board   │
│  Change rate:     Slow; conservative                  │
│  Stability:       Guaranteed; persistent              │
│  Function:        Stable reference layer              │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│                 Tier 2: Affiliated                      │
│    https://openevo.net/projects/{project-id}/          │
│                                                        │
│  Minted by:       Registered affiliated projects      │
│  Review process:  Schema validation + registration    │
│  Change rate:     Moderate                            │
│  Stability:       Maintained by affiliate             │
│  Function:        Institutional and project namespace │
│  Requirements:    Valid schema; provenance; license   │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│                  Tier 3: Federated                      │
│      https://{external-domain}/openevo-compatible/     │
│                                                        │
│  Minted by:       Independent external projects       │
│  Review process:  Self-declared schema compatibility  │
│  Change rate:     At external project discretion      │
│  Stability:       External project responsibility     │
│  Function:        Federated network extension         │
│  Requirements:    Schema declaration; registration    │
│  Note:            Do NOT use openevo.net domain       │
└────────────────────────────────────────────────────────┘
```

### 18.2 Affiliate Registration

An external project becomes a Tier 2 affiliate by:

1. Submitting a registration request to the OpenEvo core team
2. Declaring a project identifier (used in their namespace path)
3. Demonstrating schema compliance with a sample object set
4. Accepting the OpenEvo contributor agreement (CC BY 4.0 for objects)
5. Maintaining a publicly accessible repository

Tier 2 affiliates may have their objects indexed in the OpenEvo Graph and appear in SPARQL query results.

### 18.3 Federated Project Registration

A Tier 3 federated project:

1. Hosts its own namespace on its own domain
2. Declares OpenEvo schema compatibility in its objects
3. Submits a registration request for graph indexing (optional)
4. Is indexed by OpenEvo Graph with `oecb:federatedSource` provenance metadata

---

## Section 19: Controlled Vocabularies

### 19.1 Vocabulary Architecture

All controlled vocabularies in the Concept Base are published as SKOS concept schemes at stable URIs under:

```
https://openevo.net/vocabulary/{scheme-name}/
```

Each term receives a persistent URI:

```
https://openevo.net/vocabulary/{scheme-name}/{term-slug}
```

### 19.2 Core Vocabulary Schemes

#### Epistemic Status Vocabulary

```yaml
scheme_URI: "https://openevo.net/vocabulary/epistemic-status/"
terms:
  - id: well_supported
    label: "Well Supported"
    definition: >
      The claim has substantial empirical support from multiple independent
      sources and has withstood significant scrutiny.
  - id: contested
    label: "Contested"
    definition: >
      The claim has some support but also significant opposition, either
      from contradicting evidence or from competing theoretical frameworks.
  - id: speculative
    label: "Speculative"
    definition: >
      The claim is theoretically coherent but has not yet been empirically
      tested or has only very preliminary support.
  - id: falsified
    label: "Falsified"
    definition: >
      The claim has been shown to be false by sufficiently strong
      contradicting evidence. The object is preserved for historical reference.
  - id: unknown
    label: "Unknown"
    definition: >
      Insufficient information to assess epistemic status at this time.
```

#### Selection Pressure Vocabulary

```yaml
scheme_URI: "https://openevo.net/vocabulary/selection-pressures/"
terms:
  - id: empirical
    label: "Empirical Pressure"
    definition: "Change driven by new or accumulated empirical evidence."
  - id: political
    label: "Political Pressure"
    definition: "Change driven by policy, government, or ideological forces."
  - id: social
    label: "Social Pressure"
    definition: "Change driven by social trends, public opinion, or community norms."
  - id: pedagogical
    label: "Pedagogical Pressure"
    definition: "Change driven by practitioner experience and educational practice."
  - id: theoretical
    label: "Theoretical Pressure"
    definition: "Change driven by development within adjacent theoretical frameworks."
  - id: technological
    label: "Technological Pressure"
    definition: "Change driven by the emergence of new educational or computational technologies."
  - id: institutional
    label: "Institutional Pressure"
    definition: "Change driven by institutional structures, accreditation, or standardization."
```

#### Evidence Type Vocabulary

```yaml
scheme_URI: "https://openevo.net/vocabulary/evidence-type/"
terms:
  - id: empirical_study
  - id: meta_analysis
  - id: systematic_review
  - id: theoretical_argument
  - id: practitioner_report
  - id: policy_document
  - id: historical_analysis
  - id: computational_analysis
  - id: mixed_methods
```

#### Claim Type Vocabulary

```yaml
scheme_URI: "https://openevo.net/vocabulary/claim-type/"
terms:
  - id: causal
    definition: "Claims that X produces, causes, or generates Y."
  - id: constitutive
    definition: "Claims about what something fundamentally is or consists of."
  - id: normative
    definition: "Claims about what ought to be the case."
  - id: descriptive
    definition: "Claims about what is the case, without causal implication."
  - id: existential
    definition: "Claims that a thing, property, or relationship exists."
  - id: universal
    definition: "Claims that hold across all instances of a domain."
```

---

## Section 20: FAIR Compliance

### 20.1 Findable

| Requirement | Implementation |
|---|---|
| Globally unique identifiers | Persistent URIs under `https://openevo.net/` |
| Rich metadata | Universal metadata block on all objects |
| Metadata registered in searchable resource | schema.org structured data at all object URIs; registration with re3data.org |
| Identifier in metadata | `id` field is mandatory and first in all schemas |

### 20.2 Accessible

| Requirement | Implementation |
|---|---|
| Retrievable by identifier using open protocol | HTTP with content negotiation; all Tier 1 objects open access |
| Metadata accessible even when data unavailable | CKO bibliographic profile available even when source artifact is paywalled |
| Authentication not required for read | SPARQL endpoint and REST API open for read |

### 20.3 Interoperable

| Requirement | Implementation |
|---|---|
| Formal, accessible, shared, broadly applicable language | RDF; JSON-LD; YAML with schema validation |
| Vocabulary from FAIR vocabularies | SKOS concept schemes; Dublin Core; PROV-O |
| Qualified references to other objects | All relationships use typed predicates with domain/range; no bare strings |

### 20.4 Reusable

| Requirement | Implementation |
|---|---|
| Plurality of accurate and relevant attributes | Rich schema fields; structured claims; evolutionary metadata |
| Released with clear and accessible data usage license | CC BY 4.0 mandatory field on all objects |
| Provenance | Full provenance block including creator, reviewer, modification history |
| Meet domain-relevant community standards | Alignment with ASN, CASE, LOM, IMS standards (Section 21) |

---

## Section 21: External Standards Alignment

### 21.1 Alignment Map

| OpenEvo Element | External Standard | Mapping |
|---|---|---|
| CTO `title` | Dublin Core `dcterms:title` | direct |
| CTO `description` | Dublin Core `dcterms:description` | direct |
| CTO `provenance.created_by` | PROV-O `prov:wasAttributedTo` | direct |
| CTO `provenance.created_date` | Dublin Core `dcterms:created` | direct |
| CTO `version.current` | Dublin Core `dcterms:hasVersion` | direct |
| CTO `claims` | (no standard equivalent; OpenEvo extension) | extension |
| CKO `artifact.title` | Dublin Core `dcterms:title` | direct |
| CKO `artifact.publication_date` | Dublin Core `dcterms:issued` | direct |
| CKO `access.primary_URI` | Dublin Core `dcterms:source` | direct |
| CKO `artifact.jurisdiction` | Achievement Standards Network `asn:jurisdiction` | approximate |
| CMO | CASE `CFItem`; IEEE LOM `Educational` | approximate |
| Vocabulary terms | SKOS `skos:Concept` | direct |
| AGO | PROV-O `prov:Agent` | direct |
| EVO | (no standard equivalent; OpenEvo extension) | extension |
| CFO | (no standard equivalent; OpenEvo extension) | extension |

### 21.2 IMS Global / CASE Alignment

The CMO schema is designed to be compatible with the **IMS Global Competencies and Academic Standards Exchange (CASE)** format. A CASE export pipeline will be provided in the `OpenEvo-Graph` repository, enabling OpenEvo competency objects to be consumed by CASE-compatible platforms.

### 21.3 Achievement Standards Network (ASN) Alignment

CKOs representing curriculum standards are designed to align with the **Achievement Standards Network (ASN)** linked data schema. Where an ASN record exists for a curriculum document, the CKO should declare:

```yaml
external_alignments:
  - standard: "Achievement Standards Network"
    mapped_element: "asn:StandardDocument"
    mapping_URI: "http://asn.desire2learn.com/resources/..."
```

---

## Section 22: Governance Model

### 22.1 Governance Principles

The Concept Base must evolve **slowly and deliberately** at its core while enabling **rapid experimentation** at its periphery. This principle maps directly onto the namespace tier structure and the branch model.

### 22.2 Branch Architecture

```
main                  ← stable; graph staging environment
release               ← production; triggers production graph update
sandbox               ← experimental; not included in any graph build
extensions/{name}     ← domain-specific extensions under development
```

### 22.3 Review Process by Change Type

| Change Type | Process | Minimum Review Time |
|---|---|---|
| PATCH to any object | Single reviewer approval | 48 hours |
| MINOR to CTO/CKO/EVO | Two reviewer approvals | 1 week |
| MINOR to CMO/CFO | Single reviewer approval | 48 hours |
| MAJOR to any object | Editorial board review | 2 weeks |
| New object (Tier 1) | Full review + editorial board | 2 weeks |
| Schema change (MINOR) | Core team review | 2 weeks |
| Schema change (BREAKING) | Public comment period + core team | 4 weeks |

### 22.4 Editorial Board

The Editorial Board oversees Tier 1 namespace governance. It consists of:

- Core maintainers (permanent roles)
- Domain editors (appointed per theory space)
- External advisory members (rotating, 2-year terms)

### 22.5 Conflict Resolution Procedure

When a submitted object conflicts with an existing Tier 1 object:

1. A CFO is automatically drafted by the pipeline
2. The CFO is assigned to the relevant Domain Editor
3. Both object authors are notified
4. A resolution pathway is agreed within 30 days
5. If no resolution is reached, the conflict is formally registered as `unresolved` and both objects are published with `competesWith` relationship

### 22.6 Deprecation Procedure

An object may only be deprecated by:

1. A formal deprecation proposal citing the replacement object
2. Approval by the relevant Domain Editor
3. A minimum 90-day notice period before status change
4. Preservation of the deprecated object in the archive
5. Automatic update of all `deprecated_by` references in consuming objects

---

## Section 23: Long-Term Vision

### 23.1 What the Ecosystem Becomes

The OpenEvo Concept Base, at full maturity, is:

**A curriculum theory representation system** — the first formal, machine-readable, version-controlled, evidence-linked infrastructure for representing the theoretical knowledge of curriculum studies as computational objects.

**A shared vocabulary for computational curriculum studies** — enabling researchers across institutions, languages, and theoretical traditions to work within a common semantic framework without requiring theoretical consensus.

**An interoperability layer between educational projects** — allowing curriculum standards from Germany, research studies from Australia, lesson designs from Brazil, and theoretical frameworks from the United Kingdom to reference each other, contradict each other, and evolve in response to each other within a shared namespace.

**A version-controlled cultural evolution system for curriculum knowledge** — providing, for the first time, the infrastructure to study the actual evolutionary dynamics of curriculum theory: how theories spread, compete, mutate, merge, go extinct, and get revived across educational communities.

### 23.2 The Evolutionary Environment

The GitHub organization is the **evolutionary environment** of this ecosystem. Every structural feature of the version control system maps onto an evolutionary dynamic:

```
repositories        →   populations of knowledge objects
                        (different ecological niches; different selection pressures)

commits             →   mutations
                        (small changes to existing knowledge)

branches            →   exploratory variation
                        (unconstrained exploration before selection)

pull requests       →   selection events
                        (community evaluation of proposed changes)

merges              →   inheritance and fixation
                        (successful variants enter the stable population)

forks               →   lineage divergence
                        (new populations with shared ancestry but independent futures)

deprecations        →   extinction
                        (variants that fail selection are preserved but removed from active use)

cross-repo links    →   horizontal transfer
                        (ideas crossing between otherwise isolated populations)

the release graph   →   the fossil record
                        (a permanent, queryable record of what existed at each moment)
```

The evolutionary metadata layer captures these dynamics in machine-readable form. The OpenEvo Graph compiles them into a queryable evolutionary record. The AI agent interface makes this record accessible to researchers asking questions that could not be asked of any existing curriculum knowledge system.

### 23.3 The Research Questions This Infrastructure Enables

With the full Concept Base operational, the following research questions become computationally tractable:

```
Phylogenetic questions:
  "What is the complete lineage of constructivist curriculum theory
   across jurisdictions since 1970?"

Selection dynamics questions:
  "In which theory spaces has empirical evidence been the primary
   driver of theoretical revision, and in which have political
   pressures dominated?"

Fitness landscape questions:
  "Which regions of the computational curriculum studies theory space
   remain unoccupied, and what research would fill the most
   significant gaps?"

Diffusion questions:
  "How long does it take for a theoretical innovation originating
   in German curriculum research to appear in Australian curriculum
   standards?"

Conflict dynamics questions:
  "What is the resolution rate of formally registered theoretical
   conflicts in curriculum studies, and what types of evidence
   most reliably drive resolution?"

Drift detection questions:
  "Which curriculum theories show evidence of change attributable
   to social or political drift rather than empirical selection?"
```

These are not rhetorical questions. They are the research agenda that this infrastructure is designed to make possible.

### 23.4 The Namespace as Continuity

The `https://openevo.net/` namespace provides the **continuity that allows evolution to be tracked**. Without persistent, stable identifiers, there is no way to say that the CTO that exists in 2034 is a descendant of the CTO that was created in 2024. With persistent identifiers, version histories, genealogical metadata, and selection pressure records, the system accumulates exactly what evolutionary biology took centuries to develop for the natural world: **a theory of how knowledge changes, tested against a record of how knowledge has changed**.

The OpenEvo Concept Base is that record, and this specification is how it begins.

---

## Appendix A: File Structure of the ConceptBase Repository

```
OpenEvo-ConceptBase/
│
├── README.md
├── SPECIFICATION.md               ← this document
├── CONTRIBUTING.md
├── GOVERNANCE.md
├── LICENSE                        ← CC BY 4.0
│
├── ontology/
│   ├── core/
│   │   ├── oecb-core.ttl          ← core ontology in Turtle
│   │   ├── oecb-core.owl          ← OWL serialization
│   │   └── oecb-core.md           ← human-readable documentation
│   └── extensions/
│       ├── evolution-education/
│       └── computational-curriculum/
│
├── schemas/
│   ├── CTO/
│   │   ├── CTO.schema.yaml        ← YAML Schema
│   │   ├── CTO.schema.json        ← JSON Schema
│   │   └── CTO.example.yaml       ← worked example
│   ├── CKO/
│   ├── TSO/
│   ├── EVO/
│   ├── CMO/
│   ├── CFO/
│   ├── AGO/
│   └── evolutionary-metadata/
│       ├── EML.schema.yaml
│       └── EML.schema.json
│
├── vocabularies/
│   ├── epistemic-status/
│   │   ├── epistemic-status.skos.ttl
│   │   └── epistemic-status.yaml
│   ├── selection-pressures/
│   ├── evidence-type/
│   ├── claim-type/
│   ├── disciplines/
│   └── competencies/
│
├── registry/
│   ├── affiliated-projects.yaml
│   └── federated-projects.yaml
│
├── migration-guides/
│   └── (schema version migration guides)
│
├── sandbox/
│   └── (experimental extensions; not validated)
│
└── .github/
    └── workflows/
        ├── validate.yml           ← schema validation on PR
        ├── staging-graph.yml      ← staging graph build on merge to main
        └── production-graph.yml   ← production graph build on merge to release
```

---

## Appendix B: Minimum Viable Object Checklist

Before any object is submitted for review, it must satisfy:

```
Universal Requirements (all objects):
  [ ] id field is a valid, unique openevo.net URI
  [ ] schema_version field declares a valid schema version URI
  [ ] type field matches the declared schema
  [ ] status field is declared
  [ ] license field declares CC BY 4.0
  [ ] provenance.created_by is a valid AGO URI
  [ ] provenance.created_date is a valid ISO date
  [ ] version.current is declared
  [ ] evolutionary_metadata block is present (may be minimal)

CTO Additional Requirements:
  [ ] At least one structured claim with id, text, claim_type, and epistemic_status
  [ ] At least one falsification_condition per claim
  [ ] status_rationale present on all claims
  [ ] At least one theoretical_foundation declared

CKO Additional Requirements:
  [ ] profile declared
  [ ] artifact.title present
  [ ] artifact.artifact_type declared
  [ ] access.primary_URI present (may be noted as unavailable)
  [ ] At least one theoretical_annotation if profile is annotated or structured

EVO Additional Requirements:
  [ ] source.citation present
  [ ] source.source_type declared
  [ ] At least one claim_relationship with reasoning present
  [ ] quality_assessment block present
```

---

## Appendix C: Versioning Quick Reference

```
Change Type       Version Increment    Triggers
──────────────────────────────────────────────────────────────
Typo fix          1.0.0 → 1.0.1       PATCH
Clarification     1.0.0 → 1.0.1       PATCH
New claim added   1.0.0 → 1.1.0       MINOR
New EVO linked    1.0.0 → 1.1.0       MINOR
Claim revised     1.1.0 → 2.0.0       MAJOR
Foundation removed 1.1.0 → 2.0.0      MAJOR
Schema field added 1.0 → 1.1          MINOR (schema)
Schema field removed 1.1 → 2.0        BREAKING (schema)
Field renamed      1.1 → 2.0          BREAKING (schema)
```

---

*OpenEvo Concept Base Specification v0.9.0*
*OpenEvoCCS-lab/OpenEvo-ConceptBase*
*License: CC BY 4.0*
*Namespace: https://openevo.net/*
*Status: Draft for Review — not yet a released standard*
