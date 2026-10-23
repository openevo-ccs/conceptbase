# RFC-0025: KMK Biologie Bildungsstandards vocabularies in CompetencyBase

**Type:** `content`
**Status:** `proposed`
**Author(s):** Claude (drafting pass), for review by Dustin Eirdosh. Requested by Susan Hanisch (Uni Jena, Biologiedidaktik).
**Date:** 2026-10-11 (drafted); number reserved and records committed 2026-10-23, after Susan
asked directly, via OpenLPM's in-app feedback, to see these competencies in the Base Repo
Explorer. Two of the four "Open items before merge" were substantively worked the same day
(real reuse-rights research, a real automated wording check against the source PDFs) -- see
below for exactly what that did and didn't resolve. The one item that genuinely needs a human
(Susan's subject-expert review) is still open and cannot be done from here.

## Motivation

CompetencyBase holds frameworks from the United States (NGSS, AI4K12) and OpenEvo's own vocabularies. It holds no German competency framework. The Thuringia Gymnasium Biologie Lehrplan 2026 (Erprobungsfassung) states its learning goals (Lernziele) without naming the competency each goal serves. Susan Hanisch, who teaches Biologiedidaktik I at Uni Jena, needs those links to teach and to review how the Lehrplan relates to the national standards. The links need a competency vocabulary to point at.

The national standards for Biologie are the KMK Bildungsstandards. Two documents apply to the Gymnasium: the Mittlerer Schulabschluss standards (Klassen 5 to 10) and the Abitur standards (Klassen 11 and 12).

## Proposed change

Add two vocabularies to CompetencyBase, each as a three-level tree: Kompetenzbereich (Sach-, Erkenntnisgewinnungs-, Kommunikations-, Bewertungskompetenz), Teilkompetenzbereich, and the individual standard.

| Vocabulary slug | Source | Records | Wording |
|---|---|---|---|
| `kmk-biologie-msa-2024` | Weiterentwickelte Bildungsstandards in den Naturwissenschaften, Fach Biologie (MSA), Beschluss vom 16.12.2004 i.d.F. vom 13.06.2024 | 4 areas, 13 Teilbereiche, 45 standards | Verbatim (direct KMK resolution, no commercial imprint found) |
| `kmk-biologie-ahr-2020` | Bildungsstandards im Fach Biologie für die Allgemeine Hochschulreife, Beschluss vom 18.06.2020 | 4 areas, 12 Teilbereiche, 51 standards | `citationOnly` -- topic label only (Carl Link/Wolters Kluwer edition, own copyright claim found) |

Ids follow `OE-COMPETENCY-<vocab-slug>-<code-slug>`, for example `OE-COMPETENCY-kmk-biologie-msa-2024-e-1-2` for standard E 1.2 (mikroskopieren). All records carry `status: proposed` and `review_status: author-draft`.

**Updated 2026-10-23, after the reuse-rights research below**: the two vocabularies no longer carry
the same treatment. `kmk-biologie-msa-2024`'s 62 records keep the document's own wording in
`statement.de` (research found no commercial copyright claim on that document -- see "Open items
before merge" item 1). `kmk-biologie-ahr-2020`'s 67 records were converted to `citationOnly: true`
with a short, non-derivative German topic label in place of the wording, per this RFC's own
original fallback plan -- research found a real, named commercial copyright claim on that specific
edition. See item 1 below for the actual finding behind this split.

A follow-up RFC or amendment will cover the link layer from Lernziele to these competencies. That layer lives in OpenLPM and records a reason for each link, its review state, and who reviewed it, matching the pattern of the existing method-to-Lernziel links.

## Relations

- Basiskonzepte: both documents apply the Basiskonzepte across all four Kompetenzbereiche. They are not competencies and are not part of this RFC. ConceptBase's existing Basiskonzepte taxonomy stays the home for them.
- The Abitur standards build on the MSA standards. No record-level relation between the two vocabularies is proposed yet, because the two numbering schemes do not map one-to-one. Susan Hanisch's review should decide whether to add one.

## Standards justification

No existing standard replaces these documents. The records use the same `oe:Competency` schema as the other frameworks and add no fields.

## Open items before merge

1. **Reuse rights for the wording -- researched 2026-10-23, not a formal legal opinion.**
   Downloaded both real source PDFs directly from kmk.org (not a mirror) and read their actual
   imprint pages:
   - `kmk-biologie-ahr-2020` (`2020_06_18-BildungsstandardsAHR_Biologie.pdf`): has a full
     commercial imprint page -- ISBN `978-3-556-09043-5`, and an explicit copyright line,
     `© 2020 Wolters Kluwer Deutschland GmbH, Hürth` alongside `© 2020 KMK Bonn und Berlin`.
     No license or reuse-terms statement appears anywhere in the 30-page document (checked the
     full extracted text for "Nachdruck", "Vervielfältigung", "Genehmigung", "Lizenz", "CC BY" --
     zero matches). A named commercial publisher asserting its own copyright on this specific
     edition is a real, concrete risk, not a hypothetical one. **Converted to `citationOnly`**,
     the fallback this RFC already named in its first draft -- see the "Proposed change" update
     above.
   - `kmk-biologie-msa-2024` (`2024_06_13-WeBiS_Biologie_MSA.pdf`): has no imprint page, no
     publisher, no ISBN, no copyright line at all (checked the same way). It's the KMK's own
     resolution document (`Beschluss der Kultusministerkonferenz`), published directly on
     kmk.org. That's the fact pattern §5(2) UrhG's "amtliches Werk" carve-out describes --
     an official notice/decision published by a public body in the official interest for general
     knowledge (schools are bound to comply with it) -- which would mean no copyright protection
     applies at all. This is a real, researched legal argument, not a court ruling on this
     specific document, and still not the same thing as a lawyer's signed-off opinion. **Kept
     verbatim**, with this reasoning recorded in each record's `provenance.contributor_notes`.
2. **Wording check -- done 2026-10-23, automated, not yet a human proofread.** Extracted the
   real text of both source PDFs and checked all 62 `kmk-biologie-msa-2024` records
   (whitespace/hyphenation-normalized) against it. Result: the 17 Kompetenzbereich/Teilbereich
   parent statements match the source exactly; the 45 individual leaf standards (e.g. `S 1.1`)
   don't match character-for-character, because the source itself states each one as a lowercase
   continuation of a shared "Die Lernenden…" stem listed once per Teilbereich ("Die Lernenden…
   S 1.1 beschreiben…; S 1.2 erschließen…"), not as a repeated full sentence -- the original
   extraction pass reconstructed each into its own standalone sentence to fit one `statement`
   field per record. Checked the reconstructed core wording (stripping the added "Die Lernenden "
   prefix and adjusting only capitalization/punctuation) against the source instead: **all 45
   match exactly, zero real content discrepancies found.** No word was added, dropped, or
   changed -- only the sentence boundary. This is a real, scripted check against the actual
   source text, not a human reading every line side by side -- see item 3.
3. **Subject-expert review.** No Biologiedidaktik expert has reviewed the vocabulary structure.
   Susan Hanisch is the proposed reviewer, and this is the one item on this list that genuinely
   cannot be done without her -- items 1 and 2 above found real answers, but neither substitutes
   for her own domain judgment on whether the vocabulary structure itself (which standards group
   under which Teilbereich, whether the AHR/MSA split is even the right frame for her teaching)
   is sound.
4. **Source typo.** MSA Teilbereich E 2 reads "kriterienstet vergleichen" in the source (confirmed
   again during item 2's check -- the typo is really in the source PDF, not introduced by
   extraction). The records keep the spelling as published.

Items 1 and 2 now have real, checked answers; item 4 was reconfirmed. Item 3 is still open and
stays open until Susan actually does it -- nothing above substitutes for that. All 129 records
stay `status: proposed`, `review_status: author-draft`; none of this work changed that field,
since none of it is the kind of review the gate below means. CompetencyBase's own promotion gate
(CONTRIBUTING.md, "Promotion gate") requires `review_status` of at least `peer-nominated` before a
merge to `main` -- this PR does not meet that bar yet and isn't meant to merge on its own. It's
opened now, and the records are synced into OpenLPM's admin-only Base Repo Explorer straight from
this branch (not from `main`), specifically so Susan Hanisch can do item 3 using the real OpenLPM
content rather than reading YAML. The explorer shows `review_status` plainly on every record, so
nothing here is presented as more finished than it is.

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

- [ ] Domain editor approval (Susan Hanisch, Biologiedidaktik) -- the real blocker, see item 3
- [ ] Maintainer approval
- [x] Reuse-rights check for the quoted wording (2026-10-23, research not formal legal advice --
      see item 1: `kmk-biologie-ahr-2020` converted to `citationOnly` as a result)
