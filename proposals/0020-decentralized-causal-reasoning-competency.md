# RFC-0020: Decentralized Causal Reasoning competency (`OPENEVO-CORE-COMPETENCIES`, Phase 3)

**Type:** `content`
**Status:** `proposed`
**Author(s):** Claude (planning + drafting pass, per RFC-0016/0017's precedent for maintainer-authored
content RFCs), for review by Dustin Eirdosh
**Date:** 2026-08-24

## Motivation

This is Phase 3 of the four-competency roadmap RFC-0016 opened (`lab_manager/docs/design-notes/
competencybase-ecosystem-review-and-core-competencies-roadmap.md`): Computational Thinking (Phase 1,
RFC-0016, built), Evolutionary Causal Reasoning (Phase 2, not attempted here), Decentralized Causal
Reasoning (Phase 3, this RFC), Systems Thinking (Phase 4, RFC-0021's companion). The roadmap itself
called Phase 3 "the most novel of the four to formalize... it currently exists only as theory-level/
discourse-level terminology, never promoted to its own competency statement anywhere" — real, but
diffuse: `theorybase/records/propositions.yaml` carries roughly 15 propositions contrasting
"decentralized" and "agential" causal reasoning; `OE-COMPETENCY-openevo-core-competencies-ct-algo`
already carries a one-way `relatedTheory` forward hook toward it (RFC-0016); real classroom-adjacent
discourse uses the term (`bio-core-k12` strand-review artifacts). TheoryBase already has an
accepted cross-domain-construct naming this directly,
`OE-CROSSDOMAINCONSTRUCT-decentralized-causal-reasoning-domain-generality` (`ecological-evolutionary`/
`cognitive-self`/`social` domains, accepted 2026-08-06) — this RFC's grounding, not new theory work.

The Open Decisions Register (`lab_manager/docs/design-notes/open-decisions-register.md`) flags the
one real risk building this competency runs: three live, open `openevo-graph` disputes bear directly
on its content —

- **`og:dispute:openevo-vs-kampourakis`** — whether organism/agent behavior legitimately plays a
  causal role in evolutionary explanation (ICR) or should be abstracted out in favor of invariant
  decentralized principles (DCR). `OE-PROPOSITION-invariant-expert-reasoning` (DCR) and
  `OE-PROPOSITION-contextual-flexibility-as-expertise` (ICR) directly contest each other over what
  "expert reasoning" itself even means here.
- **`og:dispute:openevo-vs-decentralized-self-overreach`** — whether decentralized neural structure
  implies "no genuine self-unity," or is compatible with a real, functionally meaningful self.
- **`og:dispute:openevo-vs-ct-generalizability-critique`** — whether computational-thinking-style
  reasoning genuinely transfers across domains, or only looks similar without shared causal structure.

A "Decentralized Causal Reasoning" competency sits at the intersection of all three, not just the
first. This RFC's Proposed Change section states, explicitly, how each record avoids asserting a
contested side — the register's own requirement that this competency "doesn't silently take a side."

## Proposed change

One content-only change (no schema amendment needed — this pass uses fields RFC-0016/0017 already
added) plus one same-session TheoryBase extension this RFC depends on.

### 1. Four new records in the existing `OPENEVO-CORE-COMPETENCIES` vocabulary

`OE-COMPETENCY-000807`–`000810` (continuing RFC-0016's already-reserved `000800`–`000899` block —
no new block reservation needed):

- `000807` — parent: **Decentralized Causal Reasoning**
- `000808` — **Ecological/Evolutionary** (`dcr-eco`)
- `000809` — **Cognitive/Self** (`dcr-cog`)
- `000810` — **Computational** (`dcr-comp`)

Three sub-competencies, not four — mirroring the cross-domain-construct's own three *developed*
domains (`ecological-evolutionary`, `cognitive-self`, and the newly-added `computational`) and
deliberately *not* building a `social` sub-competency, since the construct itself marks that domain
"unexplored." All four records: `status: proposed`, `provenance.review_status: author-draft` —
stricter than RFC-0016's already-`accepted`-status precedent, matching RFC-0017's more cautious
posture for genuinely novel/dispute-adjacent content.

**How each record avoids taking a side** (the substantive part of this RFC):

- **Parent (`dcr`)**: statement frames decentralized explanation as *one* legitimate explanatory
  tool, never the only correct one and never excluding agential co-causes by default. `relatedTheory`
  deliberately cites *both* `OE-PROPOSITION-invariant-expert-reasoning` (DCR) and
  `OE-PROPOSITION-contextual-flexibility-as-expertise` (ICR) rather than only the DCR-flavored one
  its name might suggest — `contributor_notes` states outright that the record's actual content
  follows the ICR (contextual-flexibility) account, not DCR's invariant-application account.
- **`dcr-eco`**: 9-12/13-16 bands name real cases (niche construction, behavioral plasticity) where
  both decentralized selection and organism behavior plausibly co-contribute, then explicitly frame
  the underlying scholarly disagreement as open rather than resolved.
- **`dcr-cog`**: every developmental band keeps "the neural substrate is decentralized"
  (uncontroversial, both dispute parties accept it) distinct from "therefore no genuine self-unity"
  (Smith's contested inference) — this is the one instruction from
  `dispute-openevo-vs-decentralized-self-overreach`'s `pedagogical-stakes-of-decentering` divergence
  this record exists to satisfy.
- **`dcr-comp`**: 13-16 band is deliberately skeptical about cross-domain transfer claims
  (Salomon & Perkins 1989's low-road/high-road distinction, already used by
  `og:dispute:openevo-vs-ct-generalizability-critique`), rather than assuming this competency's own
  cross-domain framing is automatically valid.

### 2. TheoryBase extension this RFC depends on (companion commit, `theorybase`)

`OE-CROSSDOMAINCONSTRUCT-decentralized-causal-reasoning-domain-generality` gains a fourth domain,
`computational` (Resnick/Wilensky agent-based modeling — StarLogo/NetLogo — and Goldstone & Wilensky
2008), so `dcr-comp` has real TheoryBase grounding rather than an unbuilt bridge. Additive extension
of an already-`accepted` record (version 1.0.0 → 1.1.0), not a new proposal in its own right.

## Relations

- Extends `OPENEVO-CORE-COMPETENCIES` (RFC-0016) — same vocabulary/block, per RFC-0016's own
  confirmed intent to keep all four core competencies together as "one coherent, cross-linked set."
- Closes `OE-COMPETENCY-openevo-core-competencies-ct-algo`'s forward hook (RFC-0016) toward this
  competency — that record's `relatedTheory` already pointed at
  `OE-THEORY-integrated-causal-reasoning`; `dcr-comp`'s `contributor_notes` documents the reverse
  connection in prose (relatedTheory's schema pattern only accepts TheoryBase ids, so this
  competency-to-competency link isn't a schema-typed edge yet — flagged, not silently resolved).
- Leaves Phase 2 (Evolutionary Causal Reasoning) and Phase 4 (Systems Thinking, RFC-0021) as the
  remaining roadmap items — Phase 2 not attempted in this pass; it is the most dispute-sensitive of
  the four (goes further into `og:dispute:openevo-vs-kampourakis`'s actual contested content than
  this RFC's `dcr-eco` does) and was not requested for this pass.

## Standards justification

No schema change. `narrower`/`broader`/`developmentalProgression`/`indicators`/`relatedTheory`/
`relatedLiterature` are all RFC-0016 fields already in production use by seven existing records in
the same vocabulary — this RFC populates them for four more records in the same pattern, nothing new.

## ID block reservation

No new reservation. Uses four slots (`000807`–`000810`) inside RFC-0016's already-reserved
`000800`–`000899` `OPENEVO-CORE-COMPETENCIES` block (7 of 100 previously used, 11 of 100 after this
RFC). Reserved-for-Phase-2/4 slots remain available for RFC-0021 and any future Phase 2 work.

**Numbering-collision note (same honesty precedent as RFC-0016 §"Note for maintainer awareness"):**
at drafting time, both RFC-0017 and RFC-0018 are claimed by *two different, unrelated, unmerged*
proposals apiece (`0017-critical-ai-literacy-competencies-and-measuredby-field.md` vs. a
`rfc-0017-metarepresentation-concepts` branch's `0017-metarepresentation-sandbox-concepts.md`;
`main`'s own committed `0019-lpm-epistemic-status.md` vs. a live
`rfc-0018-framework-relations-and-basiskonzepte-coherence` branch) — evidence of concurrent
authorship happening faster than numbers are being coordinated. This RFC uses `0020`, one past the
highest number found anywhere (`0019`, already on `main`) at scan time — but that scan cannot rule
out another concurrent session claiming `0020` (or `0021`, RFC-0021's own number) in the same window.
Not resolved here; a maintainer must confirm collision-free before merge, same as RFC-0016 flagged
for RFC-0011 and was subsequently proven right to flag.

## Files affected

| File | Change | Status |
|---|---|---|
| `theorybase/records/cross-domain-constructs.yaml` | Add `computational` domain + instantiation to `OE-CROSSDOMAINCONSTRUCT-decentralized-causal-reasoning-domain-generality` | Done, 2026-08-24 (branch `decentralized-causal-reasoning-computational-domain`) |
| `competencybase/records/openevo-core-competencies-000807.yaml` … `-000810.yaml` | New — 4 `oe:Competency` entries | Done, 2026-08-24 |

## Review

- [ ] Domain editor approval (evolutionary-education / cognitive-science domains, given
      dispute-adjacency)
- [ ] Maintainer approval (Dustin)
- [ ] Numbering collision check (0020, and 0021 for RFC-0021) confirmed collision-free — see ID
      block reservation note above
- [ ] Confirm the "no `social` sub-competency yet" scoping decision (matching the cross-domain
      construct's own "unexplored" marking) rather than building a thin fourth sub-competency
      without real grounding
