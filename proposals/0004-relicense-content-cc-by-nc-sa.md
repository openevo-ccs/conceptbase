# RFC-0004: Relicense OECB content from CC-BY-4.0 to CC-BY-NC-SA-4.0

**Type:** `specification-amendment`
**Status:** `proposed`
**Author(s):** OpenEvo ConceptBase maintainers
**Date:** 2026-07-20

## Motivation

While scoping the first standards-ingestion pilot (AI4K12 + a state CASE Satchel source, per the ecosystem-population roadmap under discussion), two license findings surfaced:

1. **AI4K12's "Five Big Ideas in AI" materials** (the intended general-framework pilot source) are licensed **CC BY-NC-SA 4.0** — NonCommercial + ShareAlike — per the license statement on `ai4k12.org`'s own published poster. OECB's prior blanket content license, CC-BY-4.0, cannot legally incorporate NC/ShareAlike-encumbered material: NC forbids exactly the "even commercially" clause CC-BY-4.0 grants, and ShareAlike would force any OECB content built from it back under NC-SA regardless of what license the rest of the repository claims.
2. Separately (and **not resolved by this RFC** — see "Out of scope" below), the four Virginia CASE Satchel exports pulled as the state-curriculum pilot source all carry **stricter** terms than either CC-BY or CC-BY-NC-SA: three are bare state-government copyright notices with no redistribution grant, and the fourth (`Virginia Computer Science Standards of Learning (2024)`) explicitly states "In-app and alignment use only; no redistribution or republication." No relicensing of OECB's own output license can make republishing that content lawful — that data can only be represented in OECB by code/citation reference (`humanCodingScheme` + a citation back to the official source), never by reproducing `fullStatement` text, regardless of what this RFC decides.

Rather than fragment OECB's content corpus into a per-vocabulary patchwork of licenses (some CC-BY, some CC-BY-NC-SA) — which would be difficult for downstream consumers to audit and would still block ever citing/adapting an NC-SA source's *structure* (e.g. drawing on AI4K12's Five Big Ideas grade-band organization as inspiration for `oe-interdisciplinary-k12`'s AI-literacy strands) — this RFC relicenses **all** OECB content uniformly to CC-BY-NC-SA-4.0, the more restrictive common denominator, so future NC-SA-licensed source frameworks can be represented without triggering a fresh license conflict each time one appears.

## Proposed change

Relicense all content covered by `LICENSE` (ontology, schemas, vocabularies, alignment records, proposals, documentation — everything except `app/`/`scripts/` tooling, which stays MIT under `LICENSE-CODE`) from CC-BY-4.0 to CC-BY-NC-SA-4.0.

This also requires amending spec §3 Design Principle 2 ("FAIR by construction"), since its current wording — "Accessible (open license, resolvable URI)" — uses "open license" in a sense that, under the Open Definition/OSI meaning of "open," a NonCommercial-restricted license does not satisfy. Rather than let the spec silently contradict its own licensing footer, this RFC amends the clause to name CC-BY-NC-SA-4.0 explicitly and flag the terminology gap:

- **Before:** "Accessible (open license, resolvable URI)"
- **After:** "Accessible (openly documented license terms under CC-BY-NC-SA-4.0, resolvable URI)" — with an inline note that the NonCommercial clause means OECB content does not meet the stricter Open Definition/OSI sense of "open."

## Relations

- Amends spec §3 Design Principle 2 (quoted above) and the spec's front-matter/footer license statements.
- Does not add, remove, or redefine any ontology class, schema property, or vocabulary concept — this is a licensing/governance change only, not a content change.
- Sets precedent for how future NC-SA-licensed source frameworks (AI4K12 being the first candidate) are represented: their *structure* may inform OECB-authored, non-verbatim entries under `citations`, now without a license conflict. Their prose may still not be copied verbatim without checking that specific source's own attribution/ShareAlike terms are satisfied.
- Explicitly does **not** resolve the Virginia CASE Satchel non-redistribution finding (see Motivation, item 2) — that remains gated by a code/citation-only representation pattern and a license-compliance gate in the forthcoming CASE importer, tracked separately.

## Standards justification

Not applicable — this RFC changes OECB's own output license, not a data structure or schema. No existing standard governs this choice.

## ID block reservation

Not applicable — no new vocabulary or LPM.

## Versioning note (flagged for maintainer review)

Per `GOVERNANCE.md`'s Independent Versioning policy, this change was treated as a **PATCH** bump on every independently-versioned artifact's internal `meta.version` field (a metadata-only change, no class/property/concept redefinition): ontology `1.3.0 → 1.3.1`; schemas `common.defs` `1.3.0→1.3.1`, `alignment` `1.0.0→1.0.1`, `competency` `1.0.0→1.0.1`, `concept` `1.0.0→1.0.1`, `learningObject` `1.0.0→1.0.1`, `lpm` `1.0.1→1.0.2`, `strand` `1.1.0→1.1.1`.

For the two vocabulary files, `GOVERNANCE.md`'s Filename-Versioning Convention normally requires renaming the file itself on any version bump (`BIO-CORE-v1.0.0.yaml → BIO-CORE-v1.0.1.yaml`), since the filename *is* part of the vocabulary's federated identity referenced by dependent LPM repositories' `conceptbase.vocabularies` manifests. This RFC deliberately does **not** rename `BIO-CORE-v1.0.0.yaml` or `OE-INTERDISCIPLINARY-v1.0.0.yaml`, and leaves their internal `version:` field at `1.0.0` unchanged, updating only the `license:` field in place — renaming would break the pinned vocabulary references in the external `bio-core-k12-lpm` and `oe-interdisciplinary-k12-lpm` repositories, which this repository cannot see or fix in the same change. **This is a judgment call, not a settled interpretation of the versioning policy, and needs explicit maintainer confirmation** — the alternative (rename + coordinate a matching update in both dependent repos) is still open for reviewers to require instead.

## Files affected

| File | Change | Status |
|---|---|---|
| `LICENSE` | Full text replaced: CC-BY-4.0 → CC-BY-NC-SA-4.0 | Done, 2026-07-20 |
| `README.md` | License badge, repo-structure comment, License section, roadmap/status note, Spec/Ontology version badges | Done, 2026-07-20 |
| `docs/oecb_specifications.md` | Front-matter license line, §3 principle 2 wording, footer license line, spec version 0.3.1→0.4.0, Appendix C changelog entry | Done, 2026-07-20 |
| `ontologies/core_v1.yaml` | `license` field; `version` 1.3.0→1.3.1 | Done, 2026-07-20 |
| `schemas/*.yaml` (7 files) | `license` field; `version` PATCH bump each (see Versioning note) | Done, 2026-07-20 |
| `vocabularies/*.yaml` (2 files) | `license` field only — no rename, no version bump (see Versioning note) | Done, 2026-07-20 |

## Review

- [ ] Domain editor approval
- [ ] Maintainer approval
- [ ] Explicit maintainer consensus recorded here (required for `specification-amendment` — see Versioning note above for the specific point needing confirmation)
