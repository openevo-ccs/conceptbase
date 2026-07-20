# OpenEvo Concept Base

> The semantic backbone of the OpenEvo Computational Curriculum Studies ecosystem.

[![OpenEvo Lab](https://img.shields.io/badge/OpenEvo%20Lab-openevo.eva.mpg.de-teal)](http://openevo.eva.mpg.de)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/Content%20License-CC--BY--NC--SA%204.0-lightgrey.svg)](LICENSE)
[![Tooling License: MIT](https://img.shields.io/badge/Code%20License-MIT-yellow.svg)](LICENSE-CODE)
[![Specification](https://img.shields.io/badge/Spec-v0.4.0-blue)](docs/oecb_specifications.md)
[![Namespace status](https://img.shields.io/badge/w3id%20registration-PR%20open-yellow)](https://github.com/perma-id/w3id.org/pull/6389)
[![Ontology](https://img.shields.io/badge/Ontology-v1.3.1-blue)](ontologies/core_v1.yaml)
[![FAIR](https://img.shields.io/badge/FAIR-Findable%20Accessible%20Interoperable%20Reusable-green)](https://www.go-fair.org/fair-principles/)
[![Namespace](https://img.shields.io/badge/Namespace-www.w3id.org%2Fopenevo-purple)](https://www.w3id.org/openevo/)
[![Formalism](https://img.shields.io/badge/Formalism-YAML%20→%20JSON--LD%20%2F%20RDF-orange)](schemas/)
[![Status](https://img.shields.io/badge/Status-Phase%201%20—%20Active%20Development-yellow)]()
[![Governance](https://img.shields.io/badge/Governance-RFC%20%2B%20Domain%20Review-blueviolet)](GOVERNANCE.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](CONTRIBUTING.md)

---

## What Is This?

The **OpenEvo Concept Base (OECB)** is the foundational semantic infrastructure of the [OpenEvo Computational Curriculum Studies (CCS) Lab](http://openevo.eva.mpg.de) — a research initiative studying how curriculum knowledge originates, develops, competes, and evolves across educational systems, disciplines, and cultures.

This repository is **infrastructure, not content**. It defines *how* curriculum knowledge can be represented — the ontology, schemas, controlled vocabularies, identifiers, and validation rules — so that independently maintained repositories of Learning Progression Models (LPMs), Collections, Strands, assessments, and AI-assisted curriculum tools can interoperate without every project reinventing its own data model.

> **Core principle:** The Concept Base defines *how* curriculum knowledge can be represented. Individual repositories contribute evolving, independently governed *instances* of that knowledge.

If you're familiar with how `npm`, `schema.org`, or [SKOS](https://www.w3.org/2004/02/skos/) function relative to the software and knowledge-organization ecosystems built on top of them, that's the role OECB plays here: a shared registry and grammar, not a monolithic curriculum database.

---

## Why Does This Exist?

Curriculum design research and practice are fragmented across theoretical traditions, national systems, subject-area silos, and incompatible metadata formats. Two research teams studying the same concept — say, "selection" in evolutionary theory — may have no way to discover that their models are talking about related ideas, let alone compare, align, or jointly reason over them computationally.

OECB exists to make curriculum knowledge:

- **Findable** — every concept, schema, and vocabulary has a persistent, resolvable identifier under the `www.w3id.org/openevo/` namespace.
- **Accessible** — openly licensed, Git-native, human- and machine-readable.
- **Interoperable** — built on existing knowledge-organization standards (SKOS, RDF/JSON-LD) rather than a bespoke, incompatible format.
- **Reusable** — versioned, provenance-tracked, and explicit about what is stable vs. still theoretical.

Rather than prescribing a single curriculum or a single theoretical stance on any contested question in a domain, OECB is deliberately **pluralistic**: it supports multiple grade-band systems, multiple subject taxonomies, and multiple controlled vocabularies representing genuinely different theoretical commitments — while still letting them interoperate through a shared ontology and identifier scheme.

---

## Namespace

All persistent identifiers in this ecosystem resolve under:

```
https://www.w3id.org/openevo/
```

using the [w3id.org](https://w3id.org) permanent identifier redirection service, which ensures that identifiers minted today remain resolvable indefinitely regardless of where the underlying infrastructure is hosted in the future. Concepts, ontology classes, schemas, and vocabularies are all addressed as sub-paths of this namespace — see [Quickstart](#quickstart) below for resolution examples.

---

## What's In Scope (and What Isn't)

**This repository stores:**

- ✅ Core ontology (classes and relations — the "types" of curriculum knowledge)
- ✅ JSON Schema definitions for validating concept, LPM, and strand data
- ✅ Controlled vocabularies (disambiguated, multi-discipline concept registries)
- ✅ The persistent identifier registry and resolution scheme
- ✅ Cross-vocabulary alignment records *(Phase 2)*
- ✅ Grade-band and subject-area schema registries *(Phase 3)*
- ✅ Competency, assessment, and evidence schemas, profiled against existing standards *(Phase 4)*

**This repository deliberately does *not* store:**

- ❌ Lesson plans, units, or full curricula
- ❌ Complete Learning Progression Models
- ❌ Assessment items or student data
- ❌ Multimedia or learning resources

Those live in independently governed companion repositories (see [The Ecosystem](#the-ecosystem) below) that *depend on* OECB the way an npm package depends on a registry — pinning specific versions of the ontology and vocabularies they were built against.

---

## Current Status

OECB is in **Phase 1** of a deliberately staged rollout (see [`docs/oecb_specifications.md`](docs/oecb_specifications.md) for the full rationale). Rather than stabilizing the entire vision at once, Phase 1 exists to validate the hardest, highest-leverage ideas — disambiguation and identifier stability — against one real pilot before expanding scope.

Two accepted RFCs have since pulled work forward from later phases ahead of schedule — see "Forward-implemented ahead of schedule" below the table.

| Phase | Status | Contents |
|---|---|---|
| **Phase 1 — Core** | 🟢 In progress | Core ontology (`Concept`, `LPM`, `Strand`, `SubStrand`, `LearningObject`, plus `Competency` — promoted early, see below); Concept/LPM/Strand/Competency schemas; seed vocabularies (`BIO-CORE-v1.0.0`, `OE-INTERDISCIPLINARY-v1.0.0`); governance process; sandbox tier and `retracted` status ([RFC-0001](proposals/0001-sandbox-tier-and-retraction.md)) |
| **Phase 2 — Alignment & Multilinguality** | 🟡 Started ahead of schedule | Two SKOS-based cross-vocabulary alignment records with provenance already drafted (see [`alignments/`](alignments/)); language-tagged labels/definitions beyond `en` still planned |
| **Phase 3 — Pluralism** | ⚪ Planned | Multiple grade-band schemas (US K–12, OECD, OpenEvo bands); multiple subject-area taxonomies; CASE/LOM/xAPI profile mappings |
| **Phase 4 — Ecosystem Tooling** | 🟡 Started ahead of schedule | `oe:Competency` profiled against CASE `CFItem` and promoted out of `reserved` ([RFC-0002](proposals/0002-competency-case-profile.md), see [`docs/design-notes/case-competency-profile.md`](docs/design-notes/case-competency-profile.md)); evidence schema, hosted SPARQL endpoint, and CI compatibility-checker action still planned |

Reserved ontology classes for later phases (`Collection`, `Assessment`, `Practice`, `Evidence`, `Resource`) already have stable IRIs declared in [`ontologies/core_v1.yaml`](ontologies/core_v1.yaml) under the `www.w3id.org/openevo/` namespace, so dependent repositories can forward-reference them without a future breaking change. `Competency` was reserved the same way and has since been promoted (see below).

### Forward-implemented ahead of schedule

The Phase 1 pilot review surfaced two changes worth making immediately rather than deferring to their originally-scheduled phase. Both went through the full RFC process (see [Governance & Contributing](#governance--contributing)):

- **[RFC-0001](proposals/0001-sandbox-tier-and-retraction.md)** — added a sandbox/provisional identifier tier (`OE-SANDBOX-CONCEPT-######`) for trying out controlled-vocabulary entries without the permanent registry's never-delete guarantee, a two-speed review process (lighter-weight for `proposed`-status and sandbox entries), and a `retracted` lifecycle status distinct from `deprecated`/`superseded`.
- **[RFC-0002](proposals/0002-competency-case-profile.md)** — profiled `oe:Competency` as an extension of CASE (1EdTech) `CFItem` and promoted it out of `reserved` into a stable Phase 1 class, ahead of its original Phase 4 slot, after verifying the mapping against a reference CASE implementation.

Ontology `v1.3.0` reflects both RFCs; spec `v0.3.0` reflects them, with `v0.3.1` adding the w3id namespace MVP resolution note (see below). Ontology `v1.3.1` and spec `v0.4.0` reflect [RFC-0004](proposals/0004-relicense-content-cc-by-nc-sa.md), which relicensed all OECB content from CC-BY-4.0 to CC-BY-NC-SA-4.0.

---

## Repository Structure

```
conceptbase/
├── README.md
├── GOVERNANCE.md             # RFC process, versioning policy, deprecation rules
├── CONTRIBUTING.md
├── LICENSE                   # CC-BY-NC-SA-4.0 (content)
├── LICENSE-CODE              # MIT (build/validation tooling, app/)
│
├── docs/
│   ├── oecb_specifications.md    # Full design specification (this is the source of truth)
│   └── design-notes/             # Investigation notes backing specific RFCs
│       └── case-competency-profile.md
│
├── ontologies/
│   └── core_v1.yaml          # TBox: Concept, LPM, Strand, SubStrand, LearningObject, Competency
│
├── schemas/
│   ├── common.defs.yaml      # Shared $defs: IDs, semver, localized strings, citations
│   ├── concept.schema.yaml
│   ├── lpm.schema.yaml
│   ├── strand.schema.yaml
│   ├── learningObject.schema.yaml
│   ├── competency.schema.yaml    # CASE CFItem profile (RFC-0002)
│   └── alignment.schema.yaml     # Phase 2 cross-vocabulary alignment records
│
├── vocabularies/
│   ├── BIO-CORE-v1.0.0.yaml
│   └── OE-INTERDISCIPLINARY-v1.0.0.yaml
│
├── alignments/                # Phase 2, forward-implemented — 2 records so far
│   ├── OE-ALIGN-000001.yaml
│   └── OE-ALIGN-000002.yaml
│
├── registry/                   # Generated (scripts/build_registry.py) — MVP flat-JSON
│   ├── concept/{id}.json        # resolution targets for the w3id namespace; NOT hand-edited,
│   ├── alignment/{id}.json      # re-run the script after editing vocabularies/ or alignments/
│   ├── lpm-index.json
│   └── strand-index.json
│
├── w3id-submission/openevo/    # Drafted .htaccess + readme.md awaiting PR to perma-id/w3id.org
│
├── app/                       # ConceptBase Explorer — static client-side app, see below
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── registry/resolve.html  # Static LPM/Strand ID -> owning-repo lookup (see registry/ above)
│
├── scripts/
│   ├── check_related_symmetry.py  # Standalone SKOS symmetry checker (not yet wired into CI)
│   └── build_registry.py          # Generates registry/ from vocabularies/ + alignments/
│
├── proposals/                 # RFC submissions (see GOVERNANCE.md)
│   ├── TEMPLATE.md
│   ├── 0001-sandbox-tier-and-retraction.md
│   └── 0002-competency-case-profile.md
│
└── .github/workflows/          # CI: deploys app/ + registry/ to GitHub Pages
```

Not yet created, but referenced elsewhere in this README as future scope: `grade-schemas/`, `subject-schemas/` (Phase 3), `evidence/` (Phase 4), `validation/`, `build/`, `examples/` — the full build/validation pipeline doesn't exist yet (`scripts/` holds standalone scripts in the meantime, not CI-wired, other than the Pages deploy).

---

## Design Principles

- **FAIR-compliant** — every entity is findable, accessible, interoperable, and reusable by design, not by convention.
- **Git-native** — authored and reviewed as YAML through pull requests; compiled to RDF/JSON-LD as a build artifact, never hand-edited.
- **Curriculum-independent, theory-independent** — OECB does not prescribe *which* pedagogical theory or curriculum standard is correct. It provides the shared grammar that lets different, even competing, theoretical models (see [Why Pluralism Matters](#why-pluralism-matters)) coexist and interoperate.
- **Standards-aligned, not standards-duplicating** — reuses existing knowledge-organization and ed-tech standards wherever they fit (see table below) rather than reinventing them.
- **Governed, not ad hoc** — every addition goes through an RFC review process; nothing is ever silently deleted, only deprecated with a `supersededBy` pointer (see [`GOVERNANCE.md`](GOVERNANCE.md)).
- **AI-ready** — structured for machine consumption (SPARQL, JSON index) from the start, not retrofitted for it later.

---

## Standards Alignment

OECB is built as a set of profiles and extensions of existing standards, not a parallel, incompatible format:

| Need | Standard Reused | What OECB Adds |
|---|---|---|
| Concept relations, cross-vocabulary mapping | **SKOS** (`skos:broader`, `skos:related`, `skos:closeMatch`, etc.) | Discipline-specific disambiguation; curriculum-specific concept types |
| Competency / standards frameworks | **CASE** (1EdTech) | `oe:Competency` profiled directly against CASE `CFItem` (see [`schemas/competency.schema.yaml`](schemas/competency.schema.yaml), [RFC-0002](proposals/0002-competency-case-profile.md)) |
| Learning object / resource metadata | **IEEE LOM**, **schema.org/LearningResource** | Grade/subject schema binding, strand nesting *(Phase 4)* |
| Evidence / activity records | **xAPI** | Evidence categories specific to progression modeling *(Phase 4)* |
| Graph serialization | **RDF / JSON-LD** | OpenEvo domain ontology (`oe:LPM`, `oe:Strand`, `oe:Concept`, …) under `www.w3id.org/openevo/` |

Any proposal for a novel schema structure must document why an existing standard doesn't already cover the need — this is enforced as part of the RFC review process, not left to convention.

---

## Quickstart

**Referencing a concept from a dependent repository:**

```yaml
# In your LPM or Strand repository's manifest
conceptbase:
  ontology: OE-ONTOLOGY-v1.0.0
  vocabularies:
    - BIO-CORE-v1.0.0
```

**Looking up a concept:**

The `www.w3id.org/openevo/` namespace itself is **not registered yet** — `https://www.w3id.org/openevo/` currently 404s. Registration PR [perma-id/w3id.org#6389](https://github.com/perma-id/w3id.org/pull/6389) is open and awaiting upstream review; see [`w3id-submission/openevo/`](w3id-submission/openevo/) for the submitted `.htaccess`/`readme.md`, and `docs/oecb_specifications.md` §4.2 for the interim resolution scheme once it's live:

```
https://www.w3id.org/openevo/concept/OE-CONCEPT-000102   →  flat JSON (generated, scripts/build_registry.py)
https://www.w3id.org/openevo/ontology#Concept             →  raw ontology YAML (the #fragment is client-side only)
https://www.w3id.org/openevo/vocab/BIO-CORE-v1.0.0        →  raw vocabulary YAML
```

Full content negotiation (JSON-LD, HTML, flat JSON per §4.2's target design) is Phase 4 scope; the flat-JSON/raw-YAML behavior above is an intentional MVP, not the end state.

**Validating a concept entry against the schema:**

The `validation/` tooling and `oecb-validate` CLI referenced by earlier drafts of this doc are planned (Phase 4 CI compatibility-checker), not yet built. In the meantime, validate a vocabulary entry against a schema with any standard JSON Schema validator, e.g.:

```bash
# using check-jsonschema (or any 2020-12-draft-compatible validator)
check-jsonschema --schemafile schemas/concept.schema.yaml vocabularies/BIO-CORE-v1.0.0.yaml
```

A dedicated `examples/` directory of minimal worked examples is also planned but not yet present — for now, the vocabulary files in [`vocabularies/`](vocabularies/) and the alignment records in [`alignments/`](alignments/) double as worked examples.

---

## The Ecosystem

OECB is the hub of a federated ecosystem — every other repository depends on it, but none of them live inside it:

```
                          conceptbase (this repo)
                     ontology · schemas · vocabularies
                        www.w3id.org/openevo/
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
     Learning Progression    Collections         Strand
       Models (LPMs)          Repositories      Repositories
              │                                       │
        e.g. bio-core-k12-lpm            e.g. origins-of-science-strand
        e.g. oe-interdisciplinary-k12-lpm
```

Two reference LPMs currently demonstrate this pattern end-to-end, each built strictly against a single seed vocabulary to test the ConceptBase's pluralism model in practice:

- **`bio-core-k12-lpm`** — a biology-centered K–12 progression built exclusively on `BIO-CORE-v1.0.0`.
- **`oe-interdisciplinary-k12-lpm`** — a cross-disciplinary K–12 progression (biology, social studies, computer science) built exclusively on `OE-INTERDISCIPLINARY-v1.0.0`.

### ConceptBase Explorer

A static, client-side app (in [`app/`](app/), deployed to GitHub Pages via [`.github/workflows/pages.yml`](.github/workflows/pages.yml)) for loading, exploring, comparing, and annotating ConceptBase-aligned LPM repositories directly from the GitHub API — no backend, no server-side state. It's the practical, hands-on way to browse the vocabularies and reference LPMs described above, and its annotation-export pattern (draft YAML in the browser → human-reviewed PR) is the template future import tooling (e.g. a CASE competency importer) is expected to follow, per RFC-0002.

### Why Pluralism Matters

These two pilot LPMs are deliberately built from *different* vocabularies rather than a shared one — this is a feature, not a gap. Evolution education research contains genuine, unresolved theoretical disagreement about whether organism/agent behavior belongs in a scientifically adequate causal explanation of evolutionary change (compare, e.g., Kampourakis 2020 with Hanisch et al. 2026). Rather than adjudicating that debate inside the ConceptBase, OECB's role is to let *both* positions be represented as internally consistent, independently valid vocabularies — `BIO-CORE` (decentralized-causation framing) and `OE-INTERDISCIPLINARY` (agency-inclusive framing) — that can still be formally compared once [Phase 2 alignment records](#current-status) exist. This is the pluralism the ConceptBase is designed to support: **contested theoretical questions in a field should be representable as data, not resolved by fiat in the infrastructure layer.**

---

## Governance & Contributing

Every addition — a new concept, relation, schema, or vocabulary — goes through a structured RFC process:

1. **Propose** via a PR to `proposals/`, using the template (motivation, proposed IRI under `www.w3id.org/openevo/`, why no existing standard covers it).
2. **Review**, split by how much permanence is at stake ([RFC-0001](proposals/0001-sandbox-tier-and-retraction.md)): a single maintainer (or a 5-business-day no-objection window) is enough for a new sandbox-tier entry or a `proposed`-status draft; the full domain-editor + maintainer bar applies specifically to `proposed → accepted` promotion and sandbox → permanent promotion — the moment the never-delete guarantee actually starts to apply.
3. **Lifecycle status** tracked explicitly: `proposed → accepted → stable → deprecated/superseded`, plus a parallel terminal `retracted` status ([RFC-0001](proposals/0001-sandbox-tier-and-retraction.md)) for entities accepted in error or no longer endorsed, with no implied replacement.
4. **Never deleted** (permanent tier only) — deprecated, superseded, and retracted entities all remain resolvable indefinitely, so dependent repositories are never broken by an upstream change. Controlled-vocabulary concepts can also be tried first in a **sandbox tier** (`OE-SANDBOX-CONCEPT-######`, 12-month expiry unless promoted) before taking on that permanence commitment.

Each vocabulary, schema, and ontology module is versioned independently using semver (`MAJOR.MINOR.PATCH`), with breaking changes requiring a major version bump and a documented migration path.

See [`GOVERNANCE.md`](GOVERNANCE.md) for the full process and [`CONTRIBUTING.md`](CONTRIBUTING.md) for how to get started. Domain editors are especially needed for underrepresented subject areas and grade-band systems as we approach Phase 3.

---

## Roadmap

- [x] Phase 1: Core ontology, schemas, and two seed vocabularies
- [x] Phase 1: End-to-end pilot with two independent reference LPMs
- [x] Phase 1: ConceptBase Explorer app for browsing/annotating pilot LPMs
- [x] Phase 1 (RFC-0001): Sandbox tier, two-speed review, `retracted` status
- [x] Phase 4 (RFC-0002, ahead of schedule): `oe:Competency` profiled against CASE `CFItem`
- [x] Phase 2 (ahead of schedule): First two SKOS alignment records between `BIO-CORE` and `OE-INTERDISCIPLINARY`
- [ ] Phase 2: Multilingual label/definition expansion beyond `en`
- [ ] Phase 3: Grade-band schema registry (US K–12, OECD, OpenEvo 4-band/6-band)
- [ ] Phase 3: Subject-area schema registry
- [ ] Phase 4: Assessment and evidence schemas (xAPI-profiled)
- [ ] Phase 4: Hosted SPARQL endpoint and CI compatibility-checker action
- [x] Fixed this repo's GitHub Pages deploy (Settings → Pages → Source → "GitHub Actions"); `pages.yml` now deploys cleanly
- [ ] **Blocking:** register the `www.w3id.org/openevo/` namespace (currently 404 — registration PR [perma-id/w3id.org#6389](https://github.com/perma-id/w3id.org/pull/6389) open and awaiting upstream review)

Progress is tracked via [GitHub Issues](../../issues) and [Milestones](../../milestones).

---

## Citation

If you use OECB in research or curriculum tooling, please cite:

```
OpenEvo CCS Lab (2025). OpenEvo Concept Base (v0.3.1) [Data infrastructure].
https://www.w3id.org/openevo/ · https://github.com/openevo-ccs/conceptbase
```

---

## License

- **Content** (ontology, schemas, vocabularies, documentation): [CC BY-NC-SA 4.0](LICENSE) — see [RFC-0004](proposals/0004-relicense-content-cc-by-nc-sa.md) for the relicense from CC-BY-4.0
- **Code** (build pipeline, validation tooling, [ConceptBase Explorer](app/)): [MIT](LICENSE-CODE)

---

## Links

- 🧪 Research lab: [openevo.eva.mpg.de](http://openevo.eva.mpg.de)
- 🌐 Persistent identifier namespace: [www.w3id.org/openevo/](https://www.w3id.org/openevo/)
- 📄 Full specification: [`docs/oecb_specifications.md`](docs/oecb_specifications.md)
- 🗳️ Governance & versioning policy: [`GOVERNANCE.md`](GOVERNANCE.md)
