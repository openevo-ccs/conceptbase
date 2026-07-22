# RFC-0011: Add `DIGCOMPEDU`, `UNESCO-AI-CFT`, `KMK-DIGITALE-WELT` vocabularies and a native `CCC` (Computational Curriculum Competencies) extension layer

**Type:** `content`

**Status:** `proposed`
**Author(s):** OpenEvo ConceptBase maintainers (drafted in support of the KoMet project, Friedrich-Schiller-Universität Jena)
**Date:** 2026-07-22

## Motivation

KoMet (a BMBFSFJ-funded proposal in preparation, targeting the "Digitale Souveränität" module of the Bund-Länder-Initiative "Digitales Lehren und Lernen") argues that OpenEvo's ConceptBase infrastructure can operationalize existing digital/AI teacher-competency frameworks rather than compete with them. That argument currently exists only as narrative (`Framework connection notes.md` in the KoMet planning repo) — no OECB vocabulary actually represents DigCompEdu, UNESCO's AI competency framework for teachers, or the KMK's "Kompetenzen in der digitalen Welt", and nothing names the specific competency gap (working with *machine-readable curricula*, as opposed to digital resources or AI tools generally) that KoMet's own infrastructure fills.

This is also independently consistent with the ConceptBase ecosystem-population plan referenced in RFC-0007's motivation, which already names "AI competency/literacy frameworks (AI4K12, OECD, UNESCO)... as canonical general frameworks to represent" — UNESCO's AI CFT was anticipated, not a new scope decision.

Confirmed via the Rahmenbekanntmachung for the BMBFSFJ funding line (§1.1, footnote 2): DigCompEdu, the UNESCO AI CFT, and the KMK strategy are explicitly named as reference frameworks applicants are expected to engage with — this is not speculative framing but a stated scoring-relevant expectation for any project in this funding line, KoMet included.

## Proposed change

Four new artifacts, all under `www.w3id.org/openevo/`:

1. **`vocabularies/DIGCOMPEDU-v1.0.0.yaml`** — 28 `oe:Competency` entries (6 competence-area parents + 22 competencies) transcribed from the European Framework for the Digital Competence of Educators (Redecker, 2017), structured as a 2-level `skos:broader` hierarchy.
2. **`vocabularies/UNESCO-AI-CFT-v1.0.0.yaml`** — 20 `oe:Competency` entries (5 dimension parents + 15 progression-level competency blocks) transcribed from UNESCO's *AI competency framework for teachers* (2024), structured as a 2-level `skos:broader` hierarchy. `humanCodingScheme` follows the source's own `{dimension}.{level}` numbering.
3. **`vocabularies/KMK-DIGITALE-WELT-v1.0.0.yaml`** — 89 `oe:Competency` entries (6 Kompetenzbereich parents + 22 sub-area parents + 61 individual competencies) transcribed from the KMK's "Kompetenzen in der digitalen Welt" (2016/2017), structured as a 3-level `skos:broader` hierarchy — the same LPM-scale pattern RFC-0007 used for AI4K12.
4. **`vocabularies/CCC-v1.0.0.yaml`** — 25 `oe:Competency` entries (5 domain parents + 20 capabilities), **natively authored** by OpenEvo (not imported from an external source): Computational Curriculum Competencies, naming the specific gap the three imported frameworks above do not cover — working directly with machine-readable curriculum representations. This is the vocabulary that turns KoMet's "extension layer" pitch into a registry entry a reviewer can open.
5. **`alignments/OE-ALIGN-000006.yaml` through `OE-ALIGN-000013.yaml`** — 8 `skos:relatedMatch` records cross-walking CCC's five domains to specific competencies in the three imported frameworks (KMK ×2, DigCompEdu ×4, UNESCO AI CFT ×2), operationalizing the "three-layer model" table from `Framework connection notes.md` as checkable data rather than a slide.

## Licensing — flagged for maintainer review, not resolved by this RFC

All three imported frameworks are treated conservatively, consistent with `docs/design-notes/state-standards-licensing.md`'s default-closed posture:

- **DigCompEdu**: no explicit license/reuse statement was found on the JRC framework page at authoring time. Treated as unconfirmed.
- **UNESCO AI CFT**: explicit **CC-BY-SA 3.0 IGO** grant confirmed in the source PDF's front matter — but this is a different version than the four `ALLOW_FULL` patterns `scripts/case_license_gate.py` currently recognizes (all 4.0), *and* raises a substantive question independent of the gate's pattern list: OECB's own content license is CC-BY-NC-SA-4.0 (RFC-0004), and incorporating CC-BY-SA-3.0-IGO material into a differently-restricted (NC-added) corpus is a real share-alike compatibility question that needs a legal read, not a mechanical pattern match.
- **KMK "Kompetenzen in der digitalen Welt"**: bare "© 2016 KMK Berlin" copyright notice, no reuse grant found — a `CITATION_ONLY`-tier case by the gate's own logic (no redistribution grant, no explicit prohibition either).

**What was actually done to stay safe regardless of how those three questions resolve:** only each framework's own short competency **titles** are reproduced (2-6 word functional phrases, e.g. "1.1 Organisational communication", "Human agency", "1.1.1 Arbeits- und Suchinteressen klären und festlegen") — never the frameworks' longer descriptive/explanatory prose, which none of these three vocabularies reproduce at all. This is the same low-risk category the existing design note already carves out ("a small number of hand-picked, clearly-attributed illustrative quotes... sits in much stronger fair-use territory than systematic corpus-wide reproduction").

**A genuine schema gap surfaced by this RFC:** RFC-0005's `citationOnly` mode requires a `provenance` object shaped around a CASE `CFItem` (`sourceCFItemId` as a UUID, `sourceCFItemURI`). None of the three imported sources here are CASE-formatted — they're plain PDF/HTML documents. `citationOnly` as currently specified is therefore unusable for non-CASE sources, which is why this RFC does not set `citationOnly: true` on any entry even where that would be the more conservative choice (KMK in particular). **Recommend a follow-up RFC** generalizing RFC-0005's provenance shape to accept a `sourceURI`-only variant for non-CASE sources, so future non-CASE citation-only ingestions don't have to route around the same gap via short-title-only full-text mode as this RFC does.

**CCC** (native content) has no licensing question — it's OECB's own writing under the standard CC-BY-NC-SA-4.0.

## Relations

- Uses `oe:Competency` (RFC-0002) exclusively — no schema changes.
- `CCC` is explicitly designed to be cross-walked to the three imported frameworks; the 8 alignment records in this RFC are a first, deliberately non-exhaustive demonstration set (predominantly `skos:relatedMatch`, reflecting that CCC names an genuine gap rather than a restatement of existing competencies — see each alignment's `rationale` for why `relatedMatch` rather than a tighter match type was chosen in each case).
- No alignment records yet between `DIGCOMPEDU`/`UNESCO-AI-CFT`/`KMK-DIGITALE-WELT` and `BIO-CORE`/`OE-INTERDISCIPLINARY`/`NGSS-LIFE-SCIENCE`/`AI4K12` — left for a follow-up Phase 2 alignment RFC, same pattern as RFC-0007.

## Standards justification

Not a novel structure — a direct, unmodified use of `oe:Competency` (RFC-0002) and ordinary `skos:broader` hierarchies (2 levels for DigCompEdu/UNESCO-AI-CFT/CCC, 3 levels for KMK, matching AI4K12's precedent). The alignment records use the existing Phase 2 alignment mechanism (RFC-0008) unmodified. The only forward-looking item is the citationOnly/non-CASE-provenance gap noted above, which this RFC surfaces but does not attempt to fix — that's follow-up work, not part of this change.

## ID block reservation

Per the updated Competency ID blocks table in `GOVERNANCE.md`:

| Vocabulary | Block | Used |
|---|---|---|
| `DIGCOMPEDU` | `000700`–`000799` | 700–727 (28 of 100) |
| `UNESCO-AI-CFT` | `000800`–`000899` | 800–819 (20 of 100) |
| `KMK-DIGITALE-WELT` | `000900`–`000999` | 900–988 (89 of 100) |
| `CCC` | `001000`–`001099` | 1000–1024 (25 of 100) |

Alignment IDs `OE-ALIGN-000006`–`000013` continue the existing sequential (non-blocked) allocation per `GOVERNANCE.md`'s current text.

## Files affected

| File | Change | Status |
|---|---|---|
| `GOVERNANCE.md` | 4 new rows added to the Competency ID blocks table | Done, 2026-07-22 |
| `vocabularies/DIGCOMPEDU-v1.0.0.yaml` | New — 28 `oe:Competency` entries | Done, 2026-07-22 |
| `vocabularies/UNESCO-AI-CFT-v1.0.0.yaml` | New — 20 `oe:Competency` entries | Done, 2026-07-22 |
| `vocabularies/KMK-DIGITALE-WELT-v1.0.0.yaml` | New — 89 `oe:Competency` entries | Done, 2026-07-22 |
| `vocabularies/CCC-v1.0.0.yaml` | New — 25 `oe:Competency` entries (native) | Done, 2026-07-22 |
| `alignments/OE-ALIGN-000006.yaml` – `OE-ALIGN-000013.yaml` | New — 8 `skos:relatedMatch` records | Done, 2026-07-22 |

All new files pass `scripts/validate.py` (162/162 competency entries, 8/8 alignment records) and `scripts/check_related_symmetry.py`; `scripts/build_registry.py` regenerates cleanly (596 competency files, 13 alignment files total).

## Review

- [ ] Domain editor approval (teacher-education / competency-frameworks domain — no existing domain editor assigned; KoMet project team proposed as reviewers given direct use of this content)
- [ ] Maintainer approval
- [ ] **Explicit legal/licensing sign-off requested** on the three open license questions above (DigCompEdu unconfirmed license; UNESCO AI CFT's CC-BY-SA-3.0-IGO vs. OECB's CC-BY-NC-SA-4.0 share-alike compatibility; KMK's bare-copyright CITATION_ONLY status) before any `proposed → accepted` promotion of `DIGCOMPEDU`, `UNESCO-AI-CFT`, or `KMK-DIGITALE-WELT` — `CCC` (native) is not subject to this blocker.
- [ ] Confirm whether a follow-up RFC generalizing RFC-0005's `citationOnly` provenance shape for non-CASE sources is wanted, given the gap this RFC surfaced but did not fix.
