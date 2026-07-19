# RFC-NNNN: <Title>

**Type:** `content` | `specification-amendment`
<!--
  `content` — adding/changing a Concept, relation, schema, or vocabulary
  within the existing rules (spec §11.2).

  `specification-amendment` — changes to spec §3 (Design Principles) or
  §11 (Governance and Versioning) themselves. Requires explicit maintainer
  consensus per spec §11.6 / GOVERNANCE.md, distinct from ordinary content
  RFCs. If your change touches §3 or §11, it MUST use this type.
-->

**Status:** `proposed`
**Author(s):**
**Date:**

## Motivation

Why is this change needed? What problem does the current spec/schema/vocabulary fail to address?

## Proposed change

What, concretely, changes. For a `content` RFC: the proposed IRI(s) under `www.w3id.org/openevo/`, and the entity/entities being added or modified. For a `specification-amendment` RFC: the exact sections, files, and clauses being amended, quoted before/after.

## Relations

How this connects to existing entities, classes, or vocabulary entries (e.g. `subClassOf`, `skos:related`, supersession pointers).

## Standards justification

Per spec §3 item 4: if this RFC proposes a novel schema structure, document why no existing standard (SKOS, CASE, IEEE LOM, xAPI, schema.org) already satisfies the need. If this RFC reuses/profiles an existing standard instead, name it here.

## ID block reservation

Required only if this RFC introduces a new vocabulary or LPM. Reserve a numeric ID block per `GOVERNANCE.md#identifier-block-allocation` before authoring any entries under it.

## Files affected

List every file this RFC will change once merged (spec sections, `GOVERNANCE.md` sections, schema/ontology files), so reviewers can scope the diff before it exists.

## Review

- [ ] Domain editor approval (required for RFCs touching a specific vocabulary/subject domain)
- [ ] Maintainer approval
- [ ] For `specification-amendment` RFCs: explicit maintainer consensus recorded here (not just a single approving review)
