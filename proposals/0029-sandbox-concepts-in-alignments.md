# RFC-0029: Allow sandbox concepts as the two ends of an alignment

**Type:** `content`

**Status:** `proposed` (Dustin Eirdosh chose this option on 2026-11-18. Merging this pull request is the maintainer approval. The schema change and the 29 alignments it allows are in the same pull request.)
**Author(s):** AI-drafted (Claude), for the OpenEvo Computational Curriculum Studies Working Group. No domain editor has reviewed it.
**Date:** 2026-11-18

## Motivation

The comparison of Pillow (2012), Barzilai and Chinn (2018, 2024) and Hanisch and Eirdosh (2023) produced three small framework vocabularies, written as sandbox concepts `OE-SANDBOX-CONCEPT-000039` to `000070` with the shared field concepts above them. Alignment records carry what a comparison needs: a match type, who asserted it, a status that can be contested, and a rationale. They accept only permanent-tier references (`{vocabulary}:OE-CONCEPT-...` or `OE-COMPETENCY-...`), so the sandbox vocabularies cannot be aligned yet.

Creating three permanent vocabularies first would need a review of the framework constructs that nobody has done. The sandbox tier exists so entries can be authored provisionally.

## Proposed change

Extend `alignmentConceptRef` in `schemas/common.defs.yaml` to also accept `OE-SANDBOX-CONCEPT-######`. An alignment that references a sandbox concept carries `status: proposed` or `contested` only, and it is dropped from the registry when either end expires or is promoted without a matching alignment. The decision sheet `metacognition-concept-alignment-decisions-2026-11-18.md` in lab_manager lists the pairs waiting for a person's decision. The 29 alignments in this pull request (`OE-ALIGN-000042` to `000070`) are the pairs Dustin Eirdosh accepted on 2026-11-18, all `proposed`.

## Relations

Uses the existing five SKOS match types. Within-vocabulary relations stay `skos:broader`, `skos:narrower` and `skos:related`.

## Standards justification

SKOS mapping properties are defined for links between concepts in different schemes, which is the use here. No new structure is added.

## ID block reservation

None. No new vocabulary is introduced.

## Files affected

`schemas/common.defs.yaml` (the `alignmentConceptRef` pattern), `GOVERNANCE.md` (one line on sandbox alignments), `scripts/build_registry.py` (accept the new reference form).
