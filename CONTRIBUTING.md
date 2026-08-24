# Contributing to OpenEvo ConceptBase

**Status:** Informative (per [`docs/oecb_specifications.md`](docs/oecb_specifications.md) §0.3) — a practical getting-started guide. For the authoritative process, roles, and versioning rules, see [`GOVERNANCE.md`](GOVERNANCE.md).

## Before you start

Read [`README.md`](README.md) for orientation and [`docs/oecb_specifications.md`](docs/oecb_specifications.md) for the normative data model. This repository is infrastructure (ontology, schemas, controlled vocabularies, identifiers) — it does not accept lesson plans, full curricula, or learner-facing content (spec §1.2).

## Proposing a change

1. **Claim your RFC number first.** Run `python <lab_manager>/scripts/reserve_proposal_number.py --repo conceptbase --topic <your-topic-slug>` before drafting anything — it atomically reserves the next number via `proposals/RFC_LEDGER.md` and pushes immediately, turning a concurrent claim into a rejected push instead of a silent collision. Grepping the highest number in `proposals/` yourself is exactly how three numbers (0013, 0017, 0018) got independently double-claimed by unrelated branches on 2026-08-24 — don't do that.
2. **Open an RFC.** Every new Concept, relation, schema, or vocabulary goes through a pull request against [`proposals/`](proposals/), using the RFC template: motivation, proposed IRI under `www.w3id.org/openevo/`, relations to existing entities, and — for any novel schema structure — why no existing standard (SKOS, CASE, IEEE LOM, xAPI, schema.org) already covers the need.
3. **Reserve an ID block if needed.** If you're adding a new vocabulary or LPM, your RFC must reserve a numeric ID block per [`GOVERNANCE.md`](GOVERNANCE.md#identifier-block-allocation) before you author any entries.
4. **Get review.** Every RFC needs at least one domain editor approval (for RFCs touching their subject area) and one maintainer approval before merge.
5. **Validate before you submit.** Run [`scripts/check_related_symmetry.py`](scripts/check_related_symmetry.py) if your change touches `skos:related`. There is no CI pipeline yet (spec §5.2 is planned, not implemented), so this manual step is currently the only automated check available.

## Where things live

See the "Repository Structure" section of [`README.md`](README.md) for the current directory layout. In short: `ontologies/` (the TBox), `schemas/` (JSON Schema validation layer), `vocabularies/` (controlled vocabularies), `lpms/` (pilot Learning Progression Models), `alignments/` (Phase 2 cross-vocabulary mappings).

## Versioning and lifecycle

Entities move `proposed → accepted → stable → deprecated → superseded` and are never deleted once `accepted` or higher. Each artifact (ontology, each schema, each vocabulary) versions independently via semver. See [`GOVERNANCE.md`](GOVERNANCE.md) for the full rules, including the filename-versioning convention that differs by artifact type.

## Questions

Open a discussion via [GitHub Issues](../../issues) or reach out to the OpenEvo Computational Curriculum Studies Lab ([openevo.eva.mpg.de](http://openevo.eva.mpg.de)).
