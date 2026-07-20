# Design note: licensing risk for state/government curriculum standards sources

**Status:** Informative — background reasoning for how OECB decides what a given official-standards source may contribute, not itself a proposal. Referenced by [RFC-0004](../../proposals/0004-relicense-content-cc-by-nc-sa.md), [RFC-0005](../../proposals/0005-citation-only-competency-entries.md), and `scripts/case_license_gate.py`.

## Why this exists

The first CASE Satchel pilot (Virginia, four `CFDocument`s pulled from `va.satchelcommons.com`) surfaced a licensing question worth documenting once rather than re-deriving every time a new state/government source is considered: **is it fair use to include referenced snippets of government-created curriculum standards, and does that mean full ingestion is fine too?** Short answer: no — those are two different questions with different answers, and the gap between them is exactly where `scripts/case_license_gate.py`'s `CITATION_ONLY`/`BLOCKED` tiers live.

## US state government works are not automatically public domain

Unlike the US **federal** government (works are public domain by statute, 17 U.S.C. §105), individual US states can and do hold copyright on their own works. Virginia does: its general web policy claims copyright on VDOE materials, permits non-commercial download with notices retained, and requires written permission for commercial use. "A government agency wrote this" is not, on its own, a public-domain signal for state-level content the way it is for federal content.

## Two license layers can disagree, and did here

Investigating the Virginia case turned up two distinct layers that don't necessarily say the same thing:

1. **The Satchel/CommonGoodLT (CGLT) `CFDocument.licenseURI` metadata** — what the four exported packages actually carry: three bare "Copyright © 2023 by the Virginia Department of Education" notices, and one (`Virginia Computer Science Standards of Learning (2024)`) an explicit "In-app and alignment use only; no redistribution or republication."
2. **VDOE's own stated policy on its primary-source documents** — per public search results (VDOE's own site returned 403 to direct fetch, so this needs manual verification, not just this note), VDOE's SOL documents reportedly carry language permitting "reproduction... for instructional purposes in public school classrooms," narrower than blanket reuse but potentially more permissive than Satchel's generic per-document metadata suggests.

These can diverge because CGLT's platform may apply its own default restriction to protect its hosted-data product, independent of what VDOE's actual publication says. **Do not assume the Satchel export's `licenseURI` is the final word on a state's actual policy** — for any source flagged `CITATION_ONLY` or `BLOCKED`, check the primary-source publication directly (and/or ask the agency) before assuming the stricter reading is unfixable.

## Fair use is a four-factor case-by-case test, not a bright line

17 U.S.C. §107 weighs four factors; they do not all point the same direction for "republish an entire framework's full statement text as a permanent, redistributable dataset":

| Factor | Favors OECB? |
|---|---|
| Purpose/character (non-commercial, transformative — crosswalks and progression structure, not a copy) | Yes |
| Nature of the work (standards are factual/functional, thin copyright protection) | Yes |
| Amount used (a few illustrative quotes vs. the *entire* statement corpus, verbatim) | **Only for excerpts, not bulk corpora** |
| Market effect (does republication substitute for the rights holder's own market?) | **No, when the rights holder's business is licensing this exact data (e.g. CGLT/Satchel)** |

Quoting a handful of attributed statements for commentary is defensible. Reproducing an entire framework's full item text as an openly redistributable database is a materially different act, and is exactly the scenario factors 3 and 4 argue against — which is presumably why CGLT wrote "no redistribution" in the first place.

## Why OECB defaults conservative even where fair use might apply

OECB's own governance model makes an aggressive fair-use bet unusually costly to be wrong about: accepted identifiers are **never deleted** (`GOVERNANCE.md`, Deprecation Policy). A successful takedown demand against a permanently-registered identifier would force a direct conflict between honoring a legitimate rights-holder objection and violating OECB's own never-delete guarantee — an asymmetry (cheap to avoid now, expensive to unwind later) that argues for the conservative default even in cases where a fair-use argument could plausibly be made. This is the reasoning behind `scripts/case_license_gate.py` failing closed (`BLOCKED`/`CITATION_ONLY` as defaults, `ALLOW_FULL` only for recognized, explicit open grants) rather than defaulting open and relying on an after-the-fact fair-use defense.

## What this does and doesn't block

- **Blocked/gated:** bulk verbatim reproduction of a source's full statement text where the license doesn't clearly permit it (RFC-0005's `citationOnly` pattern is the fallback: codes + structure + provenance, no protected expression).
- **Not blocked:** the metamodel structure itself — codes, grade-band hierarchy, progression (`skos:broader`), cross-framework alignments — which is largely factual/functional regardless of the source's statement-text license. Nor is a small number of hand-picked, clearly-attributed illustrative quotes used for commentary (e.g., in a design note), which sits in much stronger fair-use territory than systematic corpus-wide reproduction.
- **Best path for full-text inclusion:** prioritize sources that carry an explicit, unambiguous open grant (e.g. NGSS's stated permission for non-profit education entities to "copy, reproduce, alter, adapt, edit, delete and rearrange any and all parts... without permission"; AI4K12's CC-BY-NC-SA-4.0, now license-compatible with OECB itself per RFC-0004) — these don't need the citation-only fallback at all — or seek explicit permission from the rights holder for sources that don't.
