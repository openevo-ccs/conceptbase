# RFC-0007: Add `AI4K12-v1.0.0` vocabulary

**Type:** `content`
**Status:** `proposed`
**Author(s):** OpenEvo ConceptBase maintainers
**Date:** 2026-07-20

## Motivation

Per the ConceptBase ecosystem-population plan, AI competency/literacy frameworks (AI4K12, OECD, UNESCO) are named alongside official subject-area curriculum standards as canonical general frameworks to represent. AI4K12's "Five Big Ideas in Artificial Intelligence" is the first of these: a joint AAAI/CSTA initiative (NSF award DRL-1846073) with detailed K-2/3-5/6-8/9-12 grade-band progression charts for five Big Ideas (Perception, Representation & Reasoning, Learning, Natural Interaction, Societal Impact).

AI4K12's stated license is CC BY-NC-SA 4.0 — an exact match to OECB's own content license following [RFC-0004](0004-relicense-content-cc-by-nc-sa.md), so full statement text is includable with attribution; this is not a `citationOnly` (RFC-0005) case.

## Proposed change

Add `vocabularies/AI4K12-v1.0.0.yaml`: 381 `oe:Competency` entries transcribed from AI4K12's five progression-chart PDFs, structured as a three-level `skos:broader` hierarchy:

- **5 Big Idea entries** (`BI1`–`BI5`) — top level, one per Big Idea.
- **44 concept-row entries** (e.g. `1-A-i`, `3-B-ii`) — the progression charts' own sub-topic rows within each Big Idea, `skos:broader` → their Big Idea.
- **332 per-grade-band entries** — each filled cell in the source charts (a cell is absent, not authored, where the source itself marks it "N/A") contributes two entries, one for its Learning Objective (LO) and one for its Enduring Understanding (EU), each `skos:broader` → its concept-row, each tagged `educationLevel: [K-2|3-5|6-8|9-12]`.

**Design decisions, both flagged for reviewer confirmation since neither is dictated by the schema:**

1. **LO and EU as separate entries**, not combined into one. They are pedagogically distinct (what a student should *do* vs. what they should *know*), and keeping them separate lets each be independently aligned/compared later (e.g. against NGSS performance-expectation-style "do" statements) without conflating the two. The alternative — one entry per cell, EU as `statement` and LO folded into an extension field — was considered and rejected as losing that independent-alignment capability.
2. **"Unpacked" enrichment prose, "Activity," and "Resource" text are not reproduced.** Each entry's `statement` is a single concise statement (the LO or EU sentence only), matching CASE's own `fullStatement` convention rather than the source's much longer explanatory prose. This keeps entries citable and comparable at a consistent grain; the omitted material remains available at the cited source URL for anyone wanting the fuller pedagogical context.

`humanCodingScheme` values are not official AI4K12 identifiers (the source charts don't assign the LO/EU cells their own codes) — they're constructed as `{concept-row-code}.{band}.{LO|EU}` (e.g. `1-A-i.K-2.LO`) for local traceability back to the source table, and documented as such in the vocabulary file's header comment.

## Relations

- Uses `oe:Competency` (RFC-0002) and the `citationOnly`-capable schema (RFC-0005), though `citationOnly` is not set on any entry here since AI4K12's license permits full text.
- No alignment records yet to `BIO-CORE`/`OE-INTERDISCIPLINARY`/`NGSS-LIFE-SCIENCE` — left for a follow-up Phase 2 alignment RFC.
- Sets the `AI4K12` competency block in `GOVERNANCE.md`'s Competency ID blocks table (000200–000699 — wider than the customary 100-slot block, reserved up front since the full 3-level hierarchy's size was known before authoring began).

## Standards justification

Not a novel structure — a direct, unmodified use of `oe:Competency` (RFC-0002) and its `citationOnly`-capable extension (RFC-0005, unused here). The LO/EU-as-separate-entries choice is a vocabulary-authoring decision, not a schema change.

## ID block reservation

Reserves `OE-COMPETENCY-000200`–`000699` for `AI4K12`, per the updated Competency ID blocks table in `GOVERNANCE.md`. 381 of 500 slots used (`000200`–`000580`), leaving room for future AI4K12 additions (e.g. if the initiative's own progression charts are revised, or new Big Ideas are added) without a new block.

## Files affected

| File | Change | Status |
|---|---|---|
| `GOVERNANCE.md` | `AI4K12` row added to the Competency ID blocks table | Done, 2026-07-20 |
| `vocabularies/AI4K12-v1.0.0.yaml` | New — 381 `oe:Competency` entries | Done, 2026-07-20 |

## Review

- [ ] Domain editor approval (CS/AI-literacy domain)
- [ ] Maintainer approval
- [ ] Confirm the two flagged design decisions (LO/EU as separate entries; "Unpacked" prose omitted) — not dictated by the schema, open to being revisited before `proposed → accepted` promotion
