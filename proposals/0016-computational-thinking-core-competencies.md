# RFC-0016: `competencybase` fine-grained fields + `OPENEVO-CORE-COMPETENCIES` vocabulary (Computational Thinking)

**Type:** `content`
**Status:** `accepted` — merged 2026-08-02; one item below still open, see note
**Author(s):** Claude (planning + drafting pass, per RFC-0007's precedent for maintainer-authored
content RFCs), for review by Dustin Eirdosh
**Date:** 2026-07-31

## Motivation

Every one of CompetencyBase's 455 records (RFC-0015) transcribes an *external* standard —
NGSS-LIFE-SCIENCE, AI4K12, EVO-ED-ASSESSMENT-TARGETS. There is no vocabulary yet for the
competencies OpenEvo's own design concept actually revolves around, and the schema those 455
records validate against (`competency-record.schema.json`) is deliberately thin — `statement` +
`skos:broader` + `citations[]` — right for verbatim-migrated standards, but not expressive enough
for a fine-grained, internally-authored competency: sub-competency trees, grade-band
developmental progressions, or grounding links to the theory/literature that justify the
statement in the first place.

This RFC is the first of a planned four-competency series (Computational Thinking, Evolutionary
Causal Reasoning, Decentralized Causal Reasoning, Systems Thinking — see
`lab_manager/docs/design-notes/competencybase-ecosystem-review-and-core-competencies-roadmap.md`
for the full review and roadmap). Computational Thinking is built first because, unlike the other
three, it has *no* existing source material anywhere in the ecosystem to migrate — not in
`openevo-graph`'s 15 legacy competency nodes, not in AI4K12 (which covers AI-literacy Big Ideas —
perception, representation, learning — adjacent but genuinely distinct from CT's decomposition/
abstraction/algorithmic-thinking core), and LiteratureBase's corpus had zero CT records before
this RFC's companion literature batch (10 new records: Wing 2006/2008, Grover & Pea 2013,
Weintrop et al. 2016, Brennan & Resnick 2012, Barr & Stephenson 2011, Shute/Sun/Asbell-Clarke
2017, Lye & Koh 2014, Román-González et al. 2017, Denning & Tedre 2019 — all DOI-verified live
against Crossref, added on `literaturebase`'s `dispute-kampourakis-literature` branch). Building
CT end-to-end first, with real citations from day one, sets the pattern the other three follow-on
RFCs are expected to reuse.

## Proposed change

Two additive changes, bundled per RFC-0015's own precedent for spanning a schema decision and a
content decision in one document.

### 1. Schema amendment — `competencybase/schema/competency-record.schema.json`

Five new **optional** top-level properties, backward-compatible with all 455 existing records
(none of which populate any of these fields today):

- **`narrower`**: array of `OE-COMPETENCY-######` ids. The missing inverse of the existing
  `broader` — needed for parent/sub-competency trees like this RFC's own (one parent, six
  children). Not schema-enforced as reciprocal (mirrors how `broader` itself isn't checked for
  reciprocity either — `scripts/validate.py`'s existing `broader`-resolution check is extended to
  also resolve `narrower`, per this RFC's Files Affected).
- **`developmentalProgression`**: object, keys restricted to `K-2`/`3-5`/`6-8`/`9-12`/`13-16`,
  string values. Mirrors the shape `openevo-graph/nodes/competencies.json`'s legacy (pre-OECB,
  unmigrated) competency nodes already use — generalizing a pattern that already exists in the
  ecosystem into the governed schema, not inventing a new one.
- **`indicators`**: array of strings — observable, assessment-writable performance descriptors
  for the competency, at whatever grain the authoring vocabulary chooses.
- **`relatedTheory`**: array of strings, pattern
  `^(theory|proposition|mechanism|hypothesis|cross-domain-construct|design-principle|learning-dependency|misconception|curriculum-decision):[a-z0-9-]+$`
  — matches every real id namespace confirmed directly against `theorybase/schema/*.json`'s
  `pattern` constraints. Lets a competency point at the TheoryBase construct(s) that ground its
  statement (e.g. a future Decentralized Causal Reasoning competency pointing at
  `OE-THEORY-integrated-causal-reasoning`).
- **`relatedLiterature`**: array of strings, pattern `^lit:[a-z0-9-]+$` — matches
  LiteratureBase's current (pre-RFC, provisional) id scheme. Lets a competency point at the
  literature that grounds it, distinct from `citations[]` (which stays free-text/URL/DOI for
  quick inline display; `relatedLiterature` is the resolvable graph edge into LiteratureBase).

No existing property changes meaning or requiredness. `additionalProperties: false` stays in
place — these five names are added to the schema's `properties` object, nothing else changes.

### 2. New vocabulary: `OPENEVO-CORE-COMPETENCIES`

The first vocabulary of OpenEvo-authored (not externally transcribed) competencies. This RFC's
own content is its first entry — 7 records, `OE-COMPETENCY-000800`–`000806`:

- `000800` — parent: **Computational Thinking**
- `000801` — **Decomposition**
- `000802` — **Pattern Recognition & Generalization**
- `000803` — **Abstraction**
- `000804` — **Algorithmic Thinking**
- `000805` — **Debugging & Iterative Refinement**
- `000806` — **Data Practices**

The six sub-competencies follow Weintrop et al. (2016)'s CSTA-aligned taxonomy (data practices,
modeling & computational-problem-solving practices, systems-thinking practices — the last one
deliberately not built out as its own record yet, see Relations) rather than inventing a new
breakdown. Every record: `status: proposed`, `provenance.review_status: author-draft` (unreviewed
— same honesty precedent as EVO-ED-ASSESSMENT-TARGETS's own `author-draft` marking, not
overclaimed as `community-reviewed`), `developmentalProgression` K-2→13-16, `citations[]` +
`relatedLiterature[]` pointing at this RFC's companion LiteratureBase batch, and `broader`/
`narrower` wiring the parent↔children tree.

## Relations

- Extends `oe:Competency` (RFC-0002) and its resolution home (RFC-0015) — no new class.
- **Algorithmic Thinking** (`000804`) carries `relatedTheory: ["OE-THEORY-integrated-causal-reasoning"]`
  — the one deliberate cross-link this RFC makes toward Decentralized Causal Reasoning (reasoning
  about rule-based, locally-interacting, non-centrally-controlled processes is the real conceptual
  bridge between CT and DCR), flagged here as a forward hook and left for the DCR follow-on RFC to
  build out fully, not resolved in this pass.
- Weintrop et al. (2016)'s "systems-thinking practices" strand is the literature-level bridge
  between CT and the planned Systems Thinking competency (`openevo-graph`'s existing
  `systems-thinking` node, not yet migrated) — named in that record's `contributor_notes`, not
  built into a record here, per the same phasing decision.
- No alignment records yet to AI4K12 (adjacent AI-literacy Big Ideas) — a natural Phase 2
  alignment RFC once `OE-ALIGN` gets a second real worked example beyond its current two.

## Standards justification

Not a novel structure competing with an existing one. `developmentalProgression` profiles a
shape this ecosystem already uses informally (`openevo-graph`'s legacy nodes); `narrower` is
SKOS's own inverse of `broader` (`oe:Competency` already profiles SKOS via `broader`); `indicators`
is a plain string array, no new semantics; `relatedTheory`/`relatedLiterature` are typed
cross-repo reference fields of the same kind `citations[]` already is, just resolvable against
this ecosystem's own id namespaces rather than free text.

## ID block reservation

Reserves `OE-COMPETENCY-000800`–`000899` for `OPENEVO-CORE-COMPETENCIES` (next free block after
`EVO-ED-ASSESSMENT-TARGETS`'s `000700`–`000799`), added to `GOVERNANCE.md`'s Competency ID blocks
table. 7 of 100 slots used this pass (`000800`–`000806`); remaining slots reserved for Evolutionary
Causal Reasoning, Decentralized Causal Reasoning, and Systems Thinking's own follow-on records,
kept in this same vocabulary/block rather than each minting a separate block, since all four are
explicitly one interdependent "OpenEvo core competencies" set per the review doc.

**Note for maintainer awareness:** proposal numbers 0011–0013 are unaccounted for in `main`'s
`proposals/` directory (0011 exists only on an unmerged `rfc-0011-teacher-competency-frameworks`
branch; 0012/0013 not found anywhere searched). This RFC uses 0016 to avoid any collision with
whatever those numbers may already denote elsewhere — flagged here rather than silently resolved,
since only a maintainer can confirm whether 0012/0013 are truly free.

## Files affected

| File | Change | Status |
|---|---|---|
| `GOVERNANCE.md` | `OPENEVO-CORE-COMPETENCIES` row added to the Competency ID blocks table | Done, 2026-07-31 |
| `competencybase/schema/competency-record.schema.json` | Add `narrower`, `developmentalProgression`, `indicators`, `relatedTheory`, `relatedLiterature` (all optional) | Done, 2026-07-31 |
| `competencybase/scripts/validate.py` | Extend the existing `broader`-resolution check to also resolve `narrower` | Done, 2026-07-31 |
| `competencybase/records/openevo-core-competencies-000800.yaml` … `-000806.yaml` | New — 7 `oe:Competency` entries | Done, 2026-07-31 |
| `competencybase/README.md` | Describe the new framework honestly (author-draft, not yet reviewed) | Done, 2026-07-31 |
| `literaturebase/records/{wing-2006,wing-2008,grover-pea-2013,weintrop-2016,brennan-resnick-2012,barr-stephenson-2011,shute-2017,lye-koh-2014,roman-gonzalez-2017,denning-tedre-2019}.yaml` | New — 10 records, companion literature batch (not itself part of this RFC's OECB scope; LiteratureBase is pre-RFC/provisional, listed here for full traceability) | Done, 2026-07-31 |

## Review

- [ ] Domain editor approval (CS Education / Computational Thinking domain)
- [x] Maintainer approval (Dustin) — 2026-08-02
- [ ] **Still open, worse than originally flagged.** This RFC's own numbering (0016, to dodge an
      unclear 0011–0013 gap) turned out to be the least of it: `GOVERNANCE.md`'s Competency block
      table was found (2026-08-02 re-sync, `openevo-core/GOVERNANCE.md`) to have listed
      `UNESCO-AI-CFT` at this RFC's own `000800`–`000899` block, sourced from the unmerged
      `rfc-0011-teacher-competency-frameworks` branch. That branch's entire reserved range
      (`000700`–`001099`, four frameworks) is now double-allocated by this RFC and RFC-0014. This
      RFC's own block stands as correctly reserved (RFC-0011 was never merged, so no real
      collision exists in committed data) — but RFC-0011 cannot be merged as drafted and needs
      fresh block numbers before anyone touches it again. Not resolved here; flagged for Dustin.
- [x] Confirm keeping all four core competencies in one `OPENEVO-CORE-COMPETENCIES` block (rather
      than one block per competency) is the intended long-term shape before Evolutionary/
      Decentralized Causal Reasoning and Systems Thinking's follow-on records are authored —
      confirmed, Dustin, 2026-08-02
