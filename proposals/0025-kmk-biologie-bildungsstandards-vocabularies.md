# RFC-0025: KMK Biologie Bildungsstandards vocabularies in CompetencyBase

**Type:** `content`
**Status:** `proposed`
**Author(s):** Claude (drafting pass), for review by Dustin Eirdosh. Requested by Susan Hanisch (Uni Jena, Biologiedidaktik).
**Date:** 2026-10-11 (drafted); number reserved and records committed 2026-10-23, after Susan
asked directly, via OpenLPM's in-app feedback, to see these competencies in the Base Repo
Explorer. That request is why this RFC moved from draft to an open PR rather than sitting
further -- see "Open items before merge" below for what still isn't done.

## Motivation

CompetencyBase holds frameworks from the United States (NGSS, AI4K12) and OpenEvo's own vocabularies. It holds no German competency framework. The Thuringia Gymnasium Biologie Lehrplan 2026 (Erprobungsfassung) states its learning goals (Lernziele) without naming the competency each goal serves. Susan Hanisch, who teaches Biologiedidaktik I at Uni Jena, needs those links to teach and to review how the Lehrplan relates to the national standards. The links need a competency vocabulary to point at.

The national standards for Biologie are the KMK Bildungsstandards. Two documents apply to the Gymnasium: the Mittlerer Schulabschluss standards (Klassen 5 to 10) and the Abitur standards (Klassen 11 and 12).

## Proposed change

Add two vocabularies to CompetencyBase, each as a three-level tree: Kompetenzbereich (Sach-, Erkenntnisgewinnungs-, Kommunikations-, Bewertungskompetenz), Teilkompetenzbereich, and the individual standard.

| Vocabulary slug | Source | Records |
|---|---|---|
| `kmk-biologie-msa-2024` | Weiterentwickelte Bildungsstandards in den Naturwissenschaften, Fach Biologie (MSA), Beschluss vom 16.12.2004 i.d.F. vom 13.06.2024 | 4 areas, 13 Teilbereiche, 45 standards |
| `kmk-biologie-ahr-2020` | Bildungsstandards im Fach Biologie für die Allgemeine Hochschulreife, Beschluss vom 18.06.2020 | 4 areas, 12 Teilbereiche, 51 standards |

Ids follow `OE-COMPETENCY-<vocab-slug>-<code-slug>`, for example `OE-COMPETENCY-kmk-biologie-msa-2024-e-1-2` for standard E 1.2 (mikroskopieren). Statements are in German and use the document's wording. Each record cites the document and the printed page. All records carry `status: proposed` and `review_status: author-draft`.

A follow-up RFC or amendment will cover the link layer from Lernziele to these competencies. That layer lives in OpenLPM and records a reason for each link, its review state, and who reviewed it, matching the pattern of the existing method-to-Lernziel links.

## Relations

- Basiskonzepte: both documents apply the Basiskonzepte across all four Kompetenzbereiche. They are not competencies and are not part of this RFC. ConceptBase's existing Basiskonzepte taxonomy stays the home for them.
- The Abitur standards build on the MSA standards. No record-level relation between the two vocabularies is proposed yet, because the two numbering schemes do not map one-to-one. Susan Hanisch's review should decide whether to add one.

## Standards justification

No existing standard replaces these documents. The records use the same `oe:Competency` schema as the other frameworks and add no fields.

## Open items before merge

1. **Reuse rights for the wording.** Both documents are KMK resolutions, and the Abitur edition was published by Carl Link. No check of the reuse terms for verbatim quotation of the standards has happened. If the terms do not allow it, the records fall back to `citationOnly` with topic labels.
2. **Wording check.** The text came from the PDFs by script. The count of standards per area matches each document, and a person has not compared each wording against the source.
3. **Subject-expert review.** No Biologiedidaktik expert has reviewed the vocabulary structure. Susan Hanisch is the proposed reviewer.
4. **Source typo.** MSA Teilbereich E 2 reads "kriterienstet vergleichen" in the source. The records keep the spelling as published.

None of the four items above is resolved by this PR. All 129 records stay `status: proposed`,
`review_status: author-draft`. CompetencyBase's own promotion gate (CONTRIBUTING.md, "Promotion
gate") requires `review_status` of at least `peer-nominated` before a merge to `main` -- this PR
does not meet that bar yet and isn't meant to merge on its own. It's opened now, and the records
are synced into OpenLPM's admin-only Base Repo Explorer straight from this branch (not from
`main`), specifically so Susan Hanisch can review item 3 using the real OpenLPM content rather
than reading YAML -- the review this gate is waiting on. The explorer shows `review_status`
plainly on every record, so nothing here is presented as more finished than it is.

## ID block reservation

Confirmed collision-free by grepping every `.md`/`.yaml` file in both `conceptbase` and
`competencybase` for `kmk-biologie` before authoring (2026-10-23): no prior use of either slug.
Recorded in `conceptbase/GOVERNANCE.md`'s Competency ID blocks table (see the PR against that
repo).

## Files affected

- `competencybase/records/kmk-biologie-msa-2024-*.yaml` (62 files)
- `competencybase/records/kmk-biologie-ahr-2020-*.yaml` (67 files)
- `competencybase/README.md` (record count and vocabulary list)
- `conceptbase/GOVERNANCE.md` (Competency ID blocks table -- new row recording the two slugs)
- `conceptbase/proposals/RFC_LEDGER.md` (number reservation, already pushed to `main`)

## Review

- [ ] Domain editor approval (Susan Hanisch, Biologiedidaktik)
- [ ] Maintainer approval
- [ ] Reuse-rights check for the quoted wording
