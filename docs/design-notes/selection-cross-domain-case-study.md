# Case study: does "Selection" actually hold up as a cross-domain mechanism?

**Status:** Informative — a research artifact synthesizing existing alignment records ([`OE-ALIGN-000001`](../../alignments/OE-ALIGN-000001.yaml), [`OE-ALIGN-000003`](../../alignments/OE-ALIGN-000003.yaml), [`OE-ALIGN-000004`](../../alignments/OE-ALIGN-000004.yaml)), not itself a proposal. Written to test a specific claim already made in production content — `oe-interdisciplinary-k12`'s Strand 1 — against real standards, not just the vocabulary's own say-so.

## The claim being tested

`oe-interdisciplinary-k12`'s Strand 1 (`OE-STRAND-000201`, "Inheritance, Variation, and Selection Across Systems") is built around the premise that Selection is a genuine transferable mechanism across biology, culture, and AI — not a loose metaphor. Its 9-12 substrand (`OE-STRAND-000214`) asks students to:

> "Compares all four disciplinary definitions of Selection (biology, culture, education, AI) for a single unifying feature: differential persistence of variants." ... "Explains what is genuinely analogous and what is genuinely different between biological selection and algorithmic selection (e.g., a genetic algorithm's fitness function)."

That performance indicator draws directly on `OE-INTERDISCIPLINARY`'s Selection concept (`OE-CONCEPT-000213`), which is multiply defined:

| Discipline | Definition |
|---|---|
| biology | Differential reproductive success among heritable variants. |
| culture | Differential persistence or spread of cultural variants — ideas, practices, or artifacts — based on their fit to a social or environmental context. |
| education | Choosing among available instructional pathways or resources. |
| ai | A search or optimization process that favors candidates scoring higher against an objective function. |

— with a worked example: "A genetic algorithm retaining higher-fitness candidate solutions across generations."

This case study checks each disciplinary claim against real, external, independently-authored standards rather than treating the vocabulary's own confidence in the analogy as sufficient. Three checks; one holds up cleanly, two reveal something more interesting than a clean match.

## Check 1: the biology claim — strong, confirmed

`OE-CONCEPT-000213`'s biology sense and `BIO-CORE`'s Natural Selection (`OE-CONCEPT-000102`, "Differential reproductive success among heritable variants within a population, resulting from their interaction with the environment") were already aligned as `skos:closeMatch` in `OE-ALIGN-000001` — but that alignment is deliberately recorded `status: contested`, because it surfaces a genuine, unresolved theoretical question (see "The DCR/ICR tension" below), not because the biology-sense mapping itself is shaky.

Checked independently against an official government science standard — NGSS's `HS-LS4-4` ("Construct an explanation based on evidence for how natural selection leads to adaptation of populations") — the match is strong enough to record as `skos:closeMatch` outright (`OE-ALIGN-000003`), no contested flag needed. Two independently-authored sources (a research vocabulary and a 26-state science standards consortium) converge on the same mechanism. This is the result you'd want before trusting the vocabulary's other, more speculative disciplinary senses.

## The DCR/ICR tension, briefly

`OE-ALIGN-000001` and `OE-ALIGN-000002` (drafted in the original two-LPM pilot, before this case study) already flag that `BIO-CORE`'s Natural Selection is defined in strictly decentralized causal terms — no organism-agency concept exists in `BIO-CORE` to qualify "interaction with the environment" — while `OE-INTERDISCIPLINARY`'s Selection is reinforced against Agency (`OE-CONCEPT-000211`) and Niche Construction (`OE-CONCEPT-000209`) within its own vocabulary. Whether that makes the two Selection concepts fully equivalent or subtly broader in `OE-INTERDISCIPLINARY`'s case is exactly the kind of genuine disagreement in evolution-education research (Kampourakis 2020 vs. Hanisch et al. 2026) the pluralism model is designed to hold open, not resolve. It matters here because it's the same tension driving Strand 2's Agency claim (Check 3).

## Check 2: the AI claim — the vocabulary is more confident than the curriculum

This is the finding worth taking seriously. `OE-CONCEPT-000213`'s `ai` sense doesn't hedge — it names genetic algorithms and fitness functions specifically, and Strand 1's performance indicator asks students to compare biological selection against exactly that mechanism.

Checked against AI4K12 — the AAAI/CSTA-vetted K-12 AI-literacy framework, 381 real entries spanning all five Big Ideas and all four grade bands — **the terms "genetic algorithm," "fitness function," and "evolutionary computation" appear zero times.** Nowhere in the actual curriculum content is this mechanism taught. The closest real content is Big Idea 3's "Nature of Learning (Learning from experience)" row (`3-A-vi`), which teaches reinforcement learning's trial-and-error framing — structurally related to selection (an iterative process narrowing toward better-performing variants over repeated trials) but not the same mechanism (no heritable variation between "generations" of a single training run; the reinforcement signal is an externally-defined objective, not an emergent consequence of differential persistence). `OE-ALIGN-000004` records this relationship at `skos:relatedMatch`, deliberately weaker than the `skos:closeMatch` the biology case earned.

**What this means concretely:** Strand 1's 9-12 performance indicator asks students to reason about a mechanism (genetic algorithms) that isn't part of the AI-literacy curriculum they would actually have encountered under AI4K12. This isn't a flaw in the alignment process — it's exactly the kind of gap the alignment process exists to surface. Two honest ways to respond, not mutually exclusive:

1. **Revise the performance indicator** to reference what AI4K12 actually teaches (reinforcement learning's trial-and-error structure) rather than genetic algorithms, so the comparison students are asked to make is grounded in curriculum they've actually seen.
2. **Treat genetic algorithms/evolutionary computation as a real, named gap** in current K-12 AI-literacy standards — worth a future OECB-authored sandbox concept if the Selection-in-AI analogy is considered pedagogically important enough to keep teaching, rather than silently relying on a vocabulary definition no existing standard actually backs.

## Check 3: the Agency claim — reaching for adjacent, not identical, questions

Strand 2's elective 9-12 substrand (`OE-STRAND-000224`) makes a parallel move with Agency: "Analyzes a case where a designed system (e.g., a recommendation algorithm) exhibits both intentional design (agency) and emergent, non-designed behavior."

Worth flagging before even reaching AI4K12: `OE-CONCEPT-000211`'s own vocabulary definition ("the capacity of an individual or system to **act intentionally** and make choices that influence outcomes, rather than responding passively to external forces") and Strand 2's own restatement of it, three grade bands earlier in `OE-STRAND-000223` ("a capacity to regulate behavior toward a goal-state, **without requiring conscious intention**"), aren't quite saying the same thing — "act intentionally" reads as more mentalistic than the strand's own deliberately deflationary gloss. This is a small internal-consistency finding independent of anything checked against AI4K12: the strand's own pedagogical restatement has already drifted from the vocabulary's formal definition once, before an external framework was even brought into the comparison.

AI4K12's closest content, Big Idea 4's "Philosophy of Mind" row (`4-D-i`), addresses a related but genuinely different question — whether an AI system possesses consciousness or general intelligence — not OE-INTERDISCIPLINARY's narrower, deliberately non-conscious sense of Agency. `OE-ALIGN-000005` records this as `skos:relatedMatch` for the same reason as Check 2: recording it as a strong match would overstate the fit. A recommendation algorithm optimizing engagement is arguably a better fit for AI4K12's Big Idea 5 "Ethical AI" rows (e.g. `5-A-i`, on how designers' choices produce impacts on stakeholders) than for the consciousness-centered framing in Philosophy of Mind — worth revisiting if `OE-STRAND-000224` (currently `required: false`, an elective/frontier substrand) is ever fleshed out with real AI4K12 citations rather than its current parenthetical example.

## What this demonstrates about the method, not just this one concept

The point of this exercise wasn't to confirm Strand 1/2 were right — it was to make their cross-domain claims checkable against independent evidence instead of just plausible-sounding. One check came back strongly confirmed (biology ↔ NGSS); two came back as genuine, specific, actionable gaps (AI ↔ AI4K12, twice). That 1-for-3 result is itself the finding: an interdisciplinary curriculum vocabulary's confident cross-domain analogies do not automatically survive contact with independently-authored, real standards, and won't in general — which is exactly why Phase 2 alignment records (rather than an LPM's own unreviewed prose) are the right place to locate that confidence going forward. This is a template for testing any of `oe-interdisciplinary-k12`'s other forward-reaching claims (Strand 3's `OE-STRAND-000234` on collective intelligence and distributed cognition is the obvious next candidate) the same way.
