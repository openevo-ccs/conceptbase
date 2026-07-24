# RFC-0012: Migrate eva4k12's 13 core concepts and 6 cross-cutting themes into a governed `EVA4K12-CONCEPTS` vocabulary

**Type:** `content`

**Status:** `proposed`
**Author(s):** OpenEvo ConceptBase maintainers (drafted in support of the `eva4k12` consolidation and archival plan — see `lab_manager/docs/design-notes/eva4k12-consolidation-and-grant-poc-strategy.md`)
**Date:** 2026-07-22

## Motivation

`eva4k12` is being retired and archived (not hard-deleted — see the linked lab_manager design note for the full rationale). It contains real, substantial content that predates this ecosystem's RFC/schema governance: 13 "compression concepts" and 6 cross-cutting themes forming the vertical/horizontal coherence spine of a K-12 evolutionary-anthropology framework, each with full four-grade-band developmental arcs, literature citations, and (for the cross-cutting themes) real sensitive-topic protocols. None of this currently has a governed home. Letting it disappear with the repo would be a real loss — the content itself is good; what it lacked was governance, not substance.

This RFC ports the concept- and theme-level content only (not the 7 strands or the learning objectives — see "Deferred" below and the lab_manager design note's phasing). It deliberately does not invent new ontology machinery: cross-cutting themes turn out to be a labeling/tagging concern on top of `oe:Concept`, not a distinct type requiring a schema change — see "Proposed change" below.

## Proposed change

**New vocabulary: `vocabularies/EVA4K12-CONCEPTS-v1.0.0.yaml`**, `oe:Concept` entries, block `000300`–`000399`.

Of eva4k12's 13 named concepts, 3 duplicate concepts this ecosystem already governs and are **not** re-minted as new entries:

| eva4k12 concept | Existing entry | Disposition |
|---|---|---|
| Evolution | `OE-CONCEPT-000101` (BIO-CORE) | Reuse existing ID. eva4k12's richer developmental-arc content (K-2 → 9-12 progression, literature citations) added to the existing entry's `extensions["oe:developmentalArc"]`, not a new entry. |
| Adaptation | `OE-CONCEPT-000104` (BIO-CORE) | Same treatment. |
| Agency | `OE-CONCEPT-000211` (OE-INTERDISCIPLINARY) | Same treatment. Note: this entry already carries the "deflationary vs. mentalistic" definitional-pluralism discussion documented in `docs/design-notes/human-dimensions-k12-case-study.md` — eva4k12's own Agency treatment is consistent with the deflationary reading already in use there, so this is reinforcement, not a new definitional conflict. |

The remaining **10 concepts are genuinely new** to this ecosystem and become new `EVA4K12-CONCEPTS` entries (`000300`–`000309`): Pattern, Structure, Relationship, System, Information, Representation, Argument, Perspective, Scale, Feedback.

**Cross-cutting themes are not a new ontology type.** eva4k12's 6 CCTs (Deep Time and Scale, Variation and Universals, Evidence/Method/Uncertainty, Human Place in Nature, Origins of Science, Machine-Culture Coevolution) are, structurally, `oe:Concept` entries that happen to be explicitly strand-spanning by design — they have a definition, relate to other concepts, and get referenced from multiple strands, which `skos:related` and `activeInStrands`-style tagging already handle. Rather than propose a new `oe:CrossCuttingTheme` type (more schema surface than the content needs), this RFC adds them as 6 more `EVA4K12-CONCEPTS` entries (`000310`–`000315`), tagged `extensions["oe:conceptRole"]: "cross-cutting-theme"` so tooling can distinguish them from ordinary concepts without a schema change. Each entry's `extensions` also carries the two fields that have no schema home yet — `sensitiveTopicFlags` (array of short tags) and `teacherNote` (free text) — copied verbatim from the source where present, most notably `CCT.ORIGIN-SCI` ("Origins of Science"), which carries real, citation-backed content on the history of scientific racism in evolutionary anthropology (`sensitiveTopicFlags: [scientific-racism-history, indigenous-knowledge, positionality-and-power]`) that should not be silently dropped in the port.

**Developmental-arc content** (the K-2/3-5/6-8/9-12 progression each concept carries — cognitive-mode label, student-facing description, classroom instantiation, educator bridging note) has no matching field in `concept.schema.yaml` (`definitions` is per-*discipline*, not per-*grade-band*). Carried forward losslessly via `extensions["oe:developmentalArc"]`, keyed by grade band, rather than lossily compressed into `definitions.en.general`. `definitions.en.general` instead gets a concise synthesis of the concept's core definition, so the entry is still useful to a consumer that ignores `extensions` entirely.

**Literature citations** (each eva4k12 concept carries 1-2 real citations grounding its developmental arc) map directly onto `concept.schema.yaml`'s existing `citations[]` array (`common.defs.yaml#/$defs/citation` — `text`/`url`/`doi`) — no extension needed here, this is exactly what that field is for.

**Mechanism**: authored via a small transform script (`scripts/migrate_eva4k12_concepts.py`, this RFC) reading the source JSON directly rather than hand-transcribed, given the volume (13 concepts × 4 grade bands + 6 CCTs) and the value of not introducing transcription errors into content that's already been through one authoring pass. Script output is reviewed and validated (`scripts/validate.py`) before merge, same as any other RFC's content.

## Deferred to a follow-up RFC (not resolved here)

- **The 7 eva4k12 strands and their learning objectives.** `oe-interdisciplinary-k12`'s Strand ID block (`000200`–`000299`, per `GOVERNANCE.md`) has only 6 unused top-level-strand slots (`204`–`209`) against eva4k12's 7 strands, and — more importantly than the numeric constraint — folding eva4k12's content in is a real curriculum-design decision (how much becomes new top-level Strands vs. enrichment of the existing 3 trunk Strands' substrand content) that this RFC does not make unilaterally. See the lab_manager design note's open decisions.
- Also worth naming honestly: eva4k12's own objectives dataset is only 18% complete by its own metadata (28 of 163 objectives marked `"status": "complete"`, the rest `"stub"` or missing) — the strand-level migration inherits that incompleteness and should not be described as porting a finished curriculum.
- The regional Thuringia crosswalk and its duplicate in `EvoMentor_DE` — tracked in the lab_manager design note, not schema-relevant.

## Relations

- Uses `oe:Concept` (RFC-0002) exclusively — no schema changes, consistent with the "don't invent machinery you don't need" finding above.
- Three entries reuse existing `BIO-CORE`/`OE-INTERDISCIPLINARY` IDs rather than duplicating them (see table above) — this is itself worth recording as the reason no new alignment records are needed for those three; duplication was the alternative this RFC explicitly avoids.
- The 10 new concepts and 6 CCT entries are `skos:related` to each other and, where applicable, to existing `BIO-CORE`/`OE-INTERDISCIPLINARY` entries (e.g. `CCT.MACH-CULT` / Machine-Culture Coevolution relates to `OE-CONCEPT-000218` Technology) — populated by the migration script from eva4k12's existing `skos:related` and `cctConnections` data, not invented fresh.
- No alignment yet to `AI4K12`/`NGSS-LIFE-SCIENCE`/the RFC-0011 teacher-competency vocabularies — left for a later pass, same deferred-alignment pattern RFC-0007 and RFC-0011 both used.

## Standards justification

Direct, unmodified use of `oe:Concept` (RFC-0002) and its existing `citations`/`extensions` fields. The one structural question this RFC resolves — whether cross-cutting themes need a new ontology class — is answered "no, they're a tagged `oe:Concept` subset," on the basis that no behavior this ecosystem needs (validation, registry building, relation traversal) actually depends on CCTs being a distinct type; `extensions["oe:conceptRole"]` is sufficient and keeps this a `content` RFC rather than requiring `specification-amendment` review.

## ID block reservation

| Vocabulary | Block | Used |
|---|---|---|
| `EVA4K12-CONCEPTS` | `000300`–`000399` | 300–309 (10 new concepts), 310–315 (6 cross-cutting-theme-tagged concepts) |

## Files affected

| File | Change |
|---|---|
| `GOVERNANCE.md` | New row in the Concept ID blocks table (`EVA4K12-CONCEPTS`, `000300`–`000399`) |
| `vocabularies/EVA4K12-CONCEPTS-v1.0.0.yaml` | New — 16 `oe:Concept` entries |
| `vocabularies/BIO-CORE-v1.0.0.yaml` | `OE-CONCEPT-000101` (Evolution), `OE-CONCEPT-000104` (Adaptation) — `extensions["oe:developmentalArc"]` added, no other change |
| `vocabularies/OE-INTERDISCIPLINARY-v1.0.0.yaml` | `OE-CONCEPT-000211` (Agency) — same |
| `scripts/migrate_eva4k12_concepts.py` | New — the transform script |

## Review

- [ ] Domain editor approval (no existing domain editor for this content; the same reviewers as RFC-0011 — KoMet/lab_manager team — are the natural fit given direct authorship of the source material)
- [ ] Maintainer approval
- [ ] Confirm the "no new ontology type for cross-cutting themes" call (Standards justification) — this is the one real design decision in this RFC and worth an explicit second look before merge
- [ ] Sign-off on the deferred strand/objectives migration approach once a follow-up RFC proposes it (not blocking this RFC)
