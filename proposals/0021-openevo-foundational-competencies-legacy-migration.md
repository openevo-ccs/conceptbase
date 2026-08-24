# RFC-0021: Migrate `openevo-graph`'s 15 legacy competency nodes (`OPENEVO-CORE-COMPETENCIES`
Phase 4 + new `OPENEVO-FOUNDATIONAL-COMPETENCIES` vocabulary)

**Type:** `content` + schema
**Status:** `proposed`
**Author(s):** Claude (planning + drafting pass, per RFC-0016/0017/0020's precedent for
maintainer-authored content RFCs), for review by Dustin Eirdosh
**Date:** 2026-08-24

## Motivation

`openevo-graph/nodes/competencies.json` has held 15 real, fully-drafted competency nodes since
before CompetencyBase's OECB schema existed — full K-2→13-16 developmental progressions,
assessment approaches, and a real cross-link graph (`precursorCompetencies`, `linkedNodes`) — but
none of them were ever migrated into governed `OE-COMPETENCY-######` records. One of the 15,
`systems-thinking`, is explicitly named as Phase 4 of the four-competency roadmap (RFC-0016's
Motivation, `lab_manager/docs/design-notes/competencybase-ecosystem-review-and-core-competencies-
roadmap.md`); the other 14 (interdisciplinary-thinking, metacognitive-competencies,
metaconceptual-competencies, design-thinking, growth-mindset, evolutionary-thinking,
intellectual-humility, future-thinking, critical-thinking, evaluation-competencies,
intercultural-competencies, community-science-competencies, cooperation-competencies,
self-regulation-competencies) were not part of that roadmap but are the same kind of real,
unmigrated content sitting in the same file. This RFC migrates all 15 in one pass rather than
leaving 14 of them stranded once Systems Thinking moves.

Companion to RFC-0020 (Decentralized Causal Reasoning, same drafting session) — not dependent on
it, but the two are best reviewed together since both extend `OPENEVO-CORE-COMPETENCIES`.

## Proposed change

### 1. Schema amendment — `competencybase/schema/competency-record.schema.json`

One new optional field, `prerequisiteOf`: array of `OE-COMPETENCY-######` ids, pattern-identical
to `narrower`. Preserves the legacy `precursorCompetencies` relation, which `broader`/`narrower`
(conceptual hierarchy — parent/sub-competency, e.g. CT's tree) doesn't correctly represent —
`precursorCompetencies` is a prerequisite-dependency relation between otherwise-unrelated
competencies (e.g. `critical-thinking` as a precursor to `evaluation-competencies`, not a broader
category containing it). Stored as the *forward* pointer (on the prerequisite competency, listing
what it's a prerequisite for) rather than as a field mirroring the legacy schema's own backward
`precursorCompetencies` naming, to fit this repo's existing forward/inverse pattern
(`broader`/`narrower`). `scripts/validate.py`'s existing `broader`/`narrower` resolution check is
extended to also resolve `prerequisiteOf`.

### 2. `OE-COMPETENCY-openevo-core-competencies-systems` — Phase 4, in the existing
   `OPENEVO-CORE-COMPETENCIES` vocabulary

One record (`000811` filename, continuing that block), migrating `systems-thinking` near-verbatim.
`relatedTheory` points at `OE-CROSSDOMAINCONSTRUCT-decentralized-causal-reasoning-domain-generality`
(systems-level, no-central-controller reasoning is the direct conceptual link to RFC-0020's DCR
competency) — named, not built out further this pass. Two overlap risks named but not resolved,
per the roadmap's own instruction: NGSS's Crosscutting Concepts (not yet an imported vocabulary)
and RFC-0011's still-unmerged `CCC` vocabulary.

### 3. New vocabulary: `OPENEVO-FOUNDATIONAL-COMPETENCIES` — the other 14 nodes

One unified vocabulary (not split by `competencyDomain`), preserving the legacy cross-link graph as
a single coherent set — `critical-thinking` is the hub (8 `prerequisiteOf` entries), matching the
legacy file's own note calling it "a precursor to most others." All 14: `status: proposed`,
`provenance.review_status: author-draft`.

**Field mapping** (mechanical, applied identically to all 15 records including Systems Thinking):

| Legacy field | OECB field | Notes |
|---|---|---|
| `desc` | `statement.en` | Direct copy — this is OpenEvo's own original text, not a third-party source, so no `citationOnly` concern applies (unlike EVO-ED-ASSESSMENT-TARGETS's Nehm & Kampourakis paraphrase issue). |
| `developmentalProgression` | `developmentalProgression` | Direct copy — schema shape already mirrors this file's shape verbatim (RFC-0016's original design intent). One record (`metaconceptual`) has no `K-2` band in the source; preserved as absent, not backfilled. |
| `assessmentApproaches` | `indicators[]` | Same mapping RFC-0016 itself used. |
| `precursorCompetencies` | `prerequisiteOf[]` (inverted) | A node's own `precursorCompetencies` becomes a `prerequisiteOf` entry on *the named precursor's* record, not a field on the node itself. Fully resolves within this 15-record set — every legacy `precursorCompetencies` target is one of the 15 migrated here. |
| `competencyDomain` | `domain` | Direct copy (`cognitive`/`creative`/`emotional`/`ethical`/`social`). |
| `caseLinks` | *(dropped)* | **Not** imported as a new licensed vocabulary, and **not** even preserved as informal prose citations — a stricter choice than originally planned (see Standards justification). Every legacy record's `contributor_notes` names which frameworks were dropped, for traceability, without reproducing their content. |
| `linkedNodes` (non-competency entries) | *(dropped)* | Content-anchor/thinking-tool cross-links from the wider `openevo-graph` file aren't this repo's business; each record's `contributor_notes` names what was dropped. |
| `linkedNodes` (competency entries) | *(superseded by `precursorCompetencies` inversion)* | The competency-to-competency subset of legacy `linkedNodes` substantially overlaps `precursorCompetencies`; not separately re-encoded. |
| — | `relatedTheory` | Left empty except `evolutionary-thinking` (→ `OE-CROSSDOMAINCONSTRUCT-natural-selection-domain-general`, already-existing real grounding) — no other record in this batch has comparable existing TheoryBase grounding, so none was forced. |
| — | `relatedLiterature` | Left empty on all 15 — legacy `desc`/`note` fields name real scholars informally (Dweck, Bennet's DMIS, Erickson, Ostrom) but none resolve to a verified LiteratureBase record yet; each such mention is flagged in `contributor_notes` rather than silently dropped or falsely linked. |

**One honesty flag surfaced during drafting, not resolved here:** `evolutionary-thinking`'s
migrated statement and developmental progression predate, and are not scoped against,
`og:dispute:openevo-vs-kampourakis` the way RFC-0020's `dcr-eco` record is — it is legacy content,
migrated as originally authored, not re-written to take a position in that dispute. A future
revision may need to reconcile the two.

## Relations

- Extends `OPENEVO-CORE-COMPETENCIES` (RFC-0016) for the Systems Thinking record — same
  vocabulary/block as Computational Thinking and RFC-0020's Decentralized Causal Reasoning records.
- Establishes `OPENEVO-FOUNDATIONAL-COMPETENCIES` as a third, separate OpenEvo-authored vocabulary.
- No relation to RFC-0011's unmerged `CCC`/`DIGCOMPEDU`/`UNESCO-AI-CFT`/`KMK-DIGITALE-WELT`
  content — deliberately kept apart; see Standards justification.

## Standards justification

`prerequisiteOf` is structurally identical to the already-precedented `narrower` (RFC-0016) — an
array of same-repo ids, not schema-enforced as reciprocal. The **deliberate decision not to
import any of the legacy `caseLinks`' external frameworks (NGSS Crosscutting Concepts, OECD
Learning Compass, IB MYP/DP, P21, CCSS-ELA, UN SDGs, C3 Social Studies, AP Biology, AAC&U VALUE,
ISTE)** as new CompetencyBase vocabularies or alignment records is the one substantive judgment
call in this RFC, and follows directly from investigating RFC-0011's status this same session:
RFC-0011 imported three comparable external frameworks (DigCompEdu, UNESCO AI CFT, KMK) and has
sat unmerged for 33+ days over unresolved licensing questions on two of the three. Importing ten
more comparable frameworks here — several with the same "no confirmed reuse grant found" profile
RFC-0011 hit — would manufacture the same problem at greater scale for content that, unlike
RFC-0011's CCC-vs-DigCompEdu crosswalk, isn't load-bearing for any argument this migration needs to
make. Framework names are preserved only as unlinked, non-reproduced prose in `contributor_notes`
for future traceability.

## ID block reservation

**`OE-COMPETENCY-openevo-core-competencies-systems`**: no new reservation — continues RFC-0016's
already-reserved `000800`–`000899` block, filename `000811` (12 of 100 slots used after this RFC
and RFC-0020 combined).

**`OPENEVO-FOUNDATIONAL-COMPETENCIES`**: per `conceptbase/GOVERNANCE.md`'s post-2026-08-16
supersession, ids mint directly as `OE-COMPETENCY-openevo-foundational-competencies-<slug>` — no
numeric block reservation is required by the current scheme. Record filenames nonetheless continue
`001100`–`001113` for on-disk readability, chosen to sit one full block past RFC-0011's claimed
upper bound (`001099`) so this migration doesn't manufacture a *fourth* numbering collision on top
of the three already live on that table (`0011` vs. `0012`/`0013`'s branches never actually
colliding in practice; `0016`/`0017` vs. `0011`'s claimed range; `0017`/`0018` proposal-number
collisions found this session). A row was still added to `conceptbase/GOVERNANCE.md`'s historical
table for discoverability — see that table's new `OPENEVO-FOUNDATIONAL-COMPETENCIES` row for a
flagged self-contradiction between that file and `competencybase/GOVERNANCE.md` about whether the
id-scheme supersession happened at all. Not resolved here; a maintainer should reconcile the two
documents.

## Files affected

| File | Change | Status |
|---|---|---|
| `competencybase/schema/competency-record.schema.json` | Add `prerequisiteOf` (optional) | Done, 2026-08-24 |
| `competencybase/scripts/validate.py` | Extend `broader`/`narrower` resolution check to also resolve `prerequisiteOf` | Done, 2026-08-24 |
| `competencybase/records/openevo-core-competencies-000811.yaml` | New — Systems Thinking (Phase 4) | Done, 2026-08-24 |
| `competencybase/records/openevo-foundational-competencies-001100.yaml` … `-001113.yaml` | New — 14 `oe:Competency` entries | Done, 2026-08-24 |
| `competencybase/README.md` | Describe both additions honestly (author-draft, not yet reviewed) | Done, 2026-08-24 |
| `conceptbase/GOVERNANCE.md` | Add `OPENEVO-FOUNDATIONAL-COMPETENCIES` row to the (historical) Competency ID blocks table, flagging the id-scheme documentation contradiction | Done, 2026-08-24 |

## Review

- [ ] Domain editor approval
- [ ] Maintainer approval (Dustin)
- [ ] Numbering collision check for RFC-0021 itself (same open risk RFC-0020 flagged for `0020` —
      concurrent unmerged branches were found claiming `0017` and `0018` this session; `0021`
      wasn't independently found claimed at drafting time, but that scan cannot rule out a
      same-window claim by another concurrent session)
- [ ] Reconcile `conceptbase/GOVERNANCE.md` vs. `competencybase/GOVERNANCE.md`'s contradictory
      accounts of the 2026-08-16 id-scheme supersession (see ID block reservation section)
- [ ] Confirm the decision not to import any of the 10 external frameworks named in legacy
      `caseLinks` as new vocabularies/alignments (see Standards justification) — a deliberate,
      but reversible, scope-narrowing choice
- [ ] Confirm `evolutionary-thinking`'s migrated-as-is (not dispute-reconciled) statement is
      acceptable for now, or should be flagged/revised before promotion past `author-draft`
