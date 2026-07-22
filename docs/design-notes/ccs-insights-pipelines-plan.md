# Local GWDG-Powered Agentic Insight Pipelines — Plan

| | |
|---|---|
| **Project** | Design for locally-run, GWDG-backed agentic pipelines that scan the OpenEvo CCS Lab's local repo clones, run a strategic mix of specific SAIA models/services (embeddings, LLM adjudication, RAG) per pipeline stage, and produce human-reviewed insight/metadata artifacts landed in the correct repo — never auto-merged. |
| **Relationship to existing work** | Companion to [`gwdg-saia-ecosystem-plan.md`](gwdg-saia-ecosystem-plan.md) (that doc covers *interactive* GWDG use — apps, chat, MCP tool-calling from a browser; this doc covers *batch/local* use — scripts Dustin runs against the whole dataset). Targets real, already-scaffolded-but-sparse infrastructure found while researching this: `ccs-graph/edges/*.json`'s relation schema, `openevo-graph`'s concept/competency network, and `conceptbase`'s sandbox tier (`GOVERNANCE.md`). |
| **Document status** | Draft planning pass — **not yet implemented, not yet RFC'd**. Sections marked **Open Decision** are checkpoints for Dustin. |
| **Author** | Claude (planning pass), for review by Dustin Eirdosh |
| **Date** | 2026-07-22 |

## Table of Contents

1. [What's actually already there](#1-whats-actually-already-there)
2. [Pipeline architecture: retrieve cheap, reason expensive](#2-pipeline-architecture-retrieve-cheap-reason-expensive)
3. [Model-to-stage mapping](#3-model-to-stage-mapping)
4. [Where insights land, per repo](#4-where-insights-land-per-repo)
5. [Concrete Phase-1 pilot: the entropy record already asks for this](#5-concrete-phase-1-pilot-the-entropy-record-already-asks-for-this)
6. [Caching and rate-limit discipline](#6-caching-and-rate-limit-discipline)
7. [Quality control: the fabrication risk is real and specific](#7-quality-control-the-fabrication-risk-is-real-and-specific)
8. [Why local/batch is actually the *easier* GWDG integration](#8-why-localbatch-is-actually-the-easier-gwdg-integration)
9. [Phasing](#9-phasing)
10. [Open decisions](#10-open-decisions)
11. [Revision history](#11-revision-history)

---

## 1. What's actually already there

Before designing anything, it's worth being precise about what exists vs. what's aspirational,
because the answer changes the plan a lot.

**`ccs-graph`** is further along than its boilerplate `README.md` suggests. It already has:
- A genuinely rich JSON schema for a "relation" record
  (`ccs-graph/edges/entropy-shannon--learning-progressions--meso--001.json`, validated against
  `schema/relation.schema.json`): typed links to `computational_nodes`, `curricular_nodes`,
  `people_nodes`, `literature_nodes`; multi-scale (`micro`/`meso`/`global`) tagging;
  three-tier prose (`brief`/`standard`/`extended`); a structured `confidence` block
  (`theoretical_coherence`, `empirical_support`, `methodological_feasibility`, `composite` +
  free-text `notes`); `empirical_work` with per-citation `directness`; `open_questions`;
  a `worked_example` with explicit `data_needed`; `visualization_suggestions`;
  `related_relations`; `tags`; and — the important part for this doc — a `provenance` block
  with `added_by`, `review_status` (currently `"community-reviewed"`), `changelog`, and
  `contributor_notes`. **This schema already has a slot for exactly what an agentic pipeline
  would produce.** It just needs a new legitimate `review_status` value and an `added_by`
  convention for agent authorship (§4).
- Exactly **one** populated relation record (dated 2025-01-20, explicitly called "canonical
  first relation data file" in its own `contributor_notes`).
- `ccs-graph/data_development.csv`: a backlog of dozens of information-theory/computational
  measures (Shannon entropy, conditional entropy, KL/JS divergence, mutual information, ...)
  each with a pre-written `ccs_relevance_statement` — this is a literal worklist of candidate
  `computational_nodes` waiting to be formalized into full relation records the way the one
  entropy record was.
- `ccs-graph/docs/ccs-graph_plan.md` itself says the repo structure "needs to be updated for
  integration within the CCS Lab repository" — i.e. its final shape is still open, which is
  relevant to Open Decision 1 (§10).

**`openevo-graph`** has real content, not placeholders: `concepts.json`, `competencies.json`,
`edges.json`, `content_anchors.json`, `thinking_tools.json`, and a `metadata/crosswalk_index.json`
alongside `case_frameworks.json`/`case_standards.json` — i.e. a hand-built network of OpenEvo's
own design-concept vocabulary, apparently exported from a network-mapping tool (the raw CSV
`OE - CompetencyBase - Competencies - Extended Network (1).csv` is still sitting in `nodes/`),
cross-referenced against external standards frameworks. `oe-graph.json` is 3,034 lines — a real,
substantial graph, hand-curated, not generated.

**`conceptbase`'s sandbox tier** (`GOVERNANCE.md`) already has the exact governance shape an
agentic pipeline needs: `OE-SANDBOX-CONCEPT-######` / `OE-SANDBOX-LPM-######` /
`OE-SANDBOX-STRAND-######` entries carry `sandboxMeta.status` instead of the permanent-tier
`status` enum, need only lightweight review to merge, and **auto-archive after 12 months if
never promoted**. That auto-expiry is a genuinely good safety property for agent-drafted content
specifically — an unreviewed draft doesn't linger forever, it quietly ages out.

**Conclusion:** this isn't "design a new insight-record format and a new governance tier."
Both already exist, in two different repos, independently designed for human contribution.
The job is: build a pipeline that fills them, using GWDG models at the right stages, with agent
authorship as a first-class, clearly-marked, never-auto-merged contribution — reusing what's
there rather than inventing parallel infrastructure.

### 1.1 `openevo-graph` specifically: check before building, don't assume

`ccs-graph` and `openevo-graph` are not in the same state, and the plan below (§4, §9) treats
them differently as a result:

- **`ccs-graph` is actively developed** — commits as recent as 2026-06-24 doing real conceptual
  work (theory notes, schema restructuring), the one populated relation record, a genuine
  backlog. Distinct, non-overlapping scope: a knowledge graph *about* Computational Curriculum
  Studies as a research field (computational methods × curricular theory × people ×
  literature) — not curriculum content itself, which is `conceptbase`'s job. Nothing else in
  this ecosystem duplicates it. Treat it as live infrastructure worth the pipeline investment.
- **`openevo-graph` looks dormant and possibly superseded**, not just quiet: its last six
  commits are wording/capitalization fixes to the README (still template placeholder text
  otherwise, e.g. `<One paragraph describing the purpose...>`), last real content commit
  2026-06-08, and a repo-wide grep found **zero references to it from `conceptbase` or
  `curriculum-agents`** — nothing currently consumes it. Its content shows two concrete signs
  of having been superseded rather than merely unfinished:
  1. Its 9-content-anchor/6-thinking-tool/24-concept model
     (`openevo-graph/nodes/content_anchors.json`, `concepts.json`) uses ad hoc slug IDs
     (`"ancient-ancestors"`, `"abstraction"`) — not the `OE-CONCEPT-######`/w3id namespace
     `conceptbase` actually governs. The same content anchors are already canonically defined
     in `curriculum-agents/skills/content-anchor-mapper/SKILL.md`,
     `skills/thinking-tools-kit/SKILL.md`, and `docs/mapping-to-design-concept.md` — this looks
     like a pre-OECB prototype whose content has a newer authoritative home elsewhere.
  2. Each anchor node's `caseLinks` field asserts alignment to real external standards
     (`cfDocumentId: "ngss-2013"`, `"c3-social-studies"`, `"ib-myp"`) with **no licensing gate
     at all**. `conceptbase` has since built exactly the machinery this data needs —
     `scripts/case_license_gate.py`, RFC-0002/0004/0005, and
     `docs/design-notes/state-standards-licensing.md` (which documents a real case where a
     state-standards source turned out to require `CITATION_ONLY` treatment, not free
     redistribution — "government agency wrote this" is *not* a public-domain signal). Those
     `caseLinks` predate that discipline and have never been checked against it.

**Implication for this plan:** don't point a content-generation pipeline at `openevo-graph`
until Dustin decides what it actually is going forward. Two real options, not a false choice —
**(a) retire/migrate**: port whatever's still unique (the grade-band progression text looks
like real, non-duplicated authoring effort) into `conceptbase` proper with real IDs and RFC
review, run existing `caseLinks` retroactively through `case_license_gate.py` before any of
that data is treated as safe to keep, then archive the repo; or **(b) reactivate**: if it's
meant to stay a separate, faster-moving prototype layer ahead of `conceptbase`'s formal
governance, fix the ID-scheme mismatch and the licensing gap deliberately, and it becomes a
legitimate second pipeline target later. Either is fine — not deciding is what's risky, since
right now it's an unreferenced repo quietly holding ungated standards-alignment claims. See
Open Decision 5 (§10).

## 2. Pipeline architecture: retrieve cheap, reason expensive

A single shape run per target repo/corpus, mirroring the RAG-standard "retrieve cheap, reason
expensive" split — important given SAIA's per-user rate limits (§6) make brute-force
all-pairs LLM comparison across a multi-repo dataset a bad idea.

```
1. HARVEST   — local file read across repo clones, content-hash each unit
                (concept/competency/strand/ccs-graph node/edge/LPM strand/EvoMentor
                strategy entry). No GWDG call. Skip anything whose hash hasn't
                changed since the last run (see §6).

2. EMBED     — GWDG /embeddings on every new/changed unit. Cheap, high-volume,
                safe to run over the whole ecosystem every time. Store vectors in
                a local index (not committed — see §6).

3. CANDIDATE — pure local vector math (nearest-neighbor / cosine threshold), no
   GENERATION  GWDG call. Surfaces candidate pairs/clusters: near-duplicate
                concepts across vocabularies, a ccs-graph computational measure
                that plausibly applies to a curricular node it isn't yet linked
                to, an OE concept that plausibly crosswalks to a CASE/NGSS
                standard it isn't yet linked to.

4. TRIAGE    — small/cheap GWDG LLM, called only on Stage 3's candidates, binary
   (optional)  or coarse judgment ("plausible relation, yes/no") to shrink the set
                further before spending the expensive model. Worth adding once
                real usage shows Stage 3's candidate volume needs it — skip for
                v1 if candidate counts are already small.

5. ADJUDICATE — strong GWDG reasoning model, called only on the surviving
                candidates. Produces the actual judgment (duplicate / related /
                extends / contradicts / no-relation) plus drafted prose fields
                (ccs-graph's `descriptions.brief`/`standard`, a conceptbase
                alignment's `justification`, etc.) in the *exact* shape the
                target schema already uses.

6. GROUND     — for prose that cites literature or theory (ccs-graph's
   (RAG/Arcana)  `literature_nodes`/`empirical_work`, curriculum-evolutionist-style
                critique grounded in `curriculum-evolution`'s manual), retrieve
                supporting passages before/alongside Stage 5's call rather than
                letting the model free-associate citations. See §7 — this is a
                real, not theoretical, fabrication risk given ccs-graph's schema
                already carries citation and confidence-score fields.

7. STAMP      — every output record gets a provenance block identifying it as
                agent-drafted: which pipeline, which GWDG model(s), which run,
                which human invoked it. Reuses each target schema's existing
                provenance shape (§4) rather than inventing a new one.

8. STAGE      — write to a local branch / draft directory, never to `main`,
                never auto-committed. Human review → normal PR, same discipline
                as every other contribution path in this ecosystem.
```

## 3. Model-to-stage mapping

This is the "strategic set of GWDG services, specific models for specific parts" the plan
should make concrete, not generic:

| Stage | GWDG service | Why this one | Cost profile |
|---|---|---|---|
| Embed | `/embeddings` | Purpose-built for this, no reasoning needed | Cheap, run on everything |
| Triage (optional) | A small/fast chat model (fetched from `/models`, filtered by size class) | Binary judgment doesn't need a large model; keep this stage disposable | Cheap-moderate, run on Stage 3's output |
| Adjudicate/synthesize | The strongest available open-weight or commercial model on SAIA at run time (fetch `/models`, don't hardcode — see §6/§7) | Drafting `confidence` scores, multi-field prose, and relation judgments is the highest-stakes step; worth the larger model | Expensive, run only on the minority surviving Stage 3(+4) |
| Ground (RAG) | Arcana, corpus = `curriculum-evolution`'s manual + `docs/oecb_specifications.md` + whatever literature set a given ccs-graph node already cites | Reduces hallucinated-citation risk (§7) for exactly the fields most likely to be wrong if free-generated | Included in the adjudicate call's cost, not separate |
| Cross-check (periodic QA, not per-record) | A *second, different* GWDG model, run on a sample of already-published agent-drafted records | Cheap way to catch one model's systematic blind spots — an ensemble check, not a per-record cost | Low-volume, scheduled (e.g. monthly), not part of the main pipeline loop |

## 4. Where insights land, per repo

Each target reuses an existing data shape — no new schema invented in this doc.

| Repo | What the pipeline drafts | Landing shape | Review path |
|---|---|---|---|
| `ccs-graph` | New `edges/*.json` relation records, working through `data_development.csv`'s backlog of computational measures against real curricular content pulled from `conceptbase`/LPMRs | `ccs-graph/edges/{slug}.json`, same schema as the existing entropy record, `provenance.review_status: "agent-drafted"` (new value), `provenance.added_by: "agent:ccs-insights-pipeline/<model-id>"` | PR against `ccs-graph`, human promotes to `"community-reviewed"` on merge |
| `openevo-graph` | **Paused pending Open Decision 5 (§10).** *If* reactivated as an ongoing target: candidate crosswalk edges (OE concept/competency ↔ CASE/NGSS standard) surfaced by embedding similarity | A **sibling** `metadata/crosswalk_candidates.json`, never a direct write into the hand-curated `crosswalk_index.json` | Same caveat as the cell to the left — don't build this until §1.1's retire-vs-reactivate call is made; growing a possibly-superseded repo's dataset makes a later migration harder, not easier |
| `conceptbase` | Candidate concept/competency duplicates or near-duplicates across vocabularies; candidate alignment records | `OE-SANDBOX-CONCEPT-######` / sandbox alignment entries, per `GOVERNANCE.md`'s existing sandbox tier | Same lightweight sandbox review that tier already requires; unreviewed entries auto-archive at 12 months by construction — a real, pre-existing safety net, not something this pipeline needs to build |
| `bio-core-k12` / `oe-interdisciplinary-k12` (or any LPMR) | Cross-LPM drift/consistency findings (a computational analog of the [Selection cross-domain case study](selection-cross-domain-case-study.md), done at scale instead of by hand) | `oe:userAnnotation` flag records, the same extension mechanism `lpmr-management-app-spec.md` §8 already designs for human+agent review records — reuse it here too rather than a third shape | Export-and-paste or direct-PR path, same as that spec already lays out |
| `curriculum-agents` | A batch pipeline run is itself a worked example of individual-mode agent use at scale | New entry under `artifacts/examples/` | Same PR review as any other artifact there |
| `EvoMentor` | Nothing new — `evomentor_LC_MCP/evomentor_lc_mcp.py`'s logic (fetch → cross-reference → GWDG synthesis → export) should be **refactored to use this pipeline's shared harvest/embed/adjudicate/stamp modules** rather than staying a bespoke one-off script that will drift from whatever conventions this doc settles on (model-fetching, caching, provenance shape) | N/A — code consolidation, not a new artifact type | Normal PR to `EvoMentor` |

## 5. Concrete Phase-1 pilot: the entropy record already asks for this

The single existing `ccs-graph` relation record isn't just an example — its own
`worked_example` and `data_needed` fields are an unexecuted, fully-specified study:

> *"Step 1: Extract all content elements addressed at each grade band from the LP document...
> Step 2: Assign each content element to a topic category... Step 3: Compute the proportion of
> LP content elements devoted to each topic category at each grade band... Step 4: Compute
> H(X)..."* — applied by name to *"NGSS-aligned high school biology LP for natural selection and
> evolution"* — i.e. `bio-core-k12` itself.

This is the natural first pilot, for three reasons: it's real content already in this lab's
repos (`bio-core-k12`'s strands), it has a pre-written methodology so there's no design
ambiguity about what "the analysis" even is, and it needs GWDG for exactly one well-scoped
step — **Step 2's content-to-topic-category assignment is a semantic-judgment task** (deciding
which NGSS DCI/Mayr-category a given strand element belongs to), while entropy itself
(**Step 4**) is plain information-theory code, not an LLM call. That split is a good concrete
demonstration of "GWDG for the parts that need judgment, plain code for the parts that don't" —
worth using as the reference implementation before generalizing to the rest of §4's table.
Output: fills in that record's own `empirical_work` and answers its first `open_question`
("Does entropy decrease monotonically across grade bands...") with a real, reproducible number
instead of leaving it purely theoretical — directly strengthening `ccs-graph`'s stated identity
as "community-auditable," not just aspirationally so.

## 6. Caching and rate-limit discipline

SAIA's documented rate limits (per `gwdg-saia-ecosystem-plan.md` §6, restated here because it's
load-bearing for pipeline design specifically) are per-user, tiered (~1,000/min, ~10,000/hr,
~50,002/day example figures) — generous for embeddings-at-scale, tight if the adjudicate stage
were ever run unfiltered across the whole dataset.

- **Content-hash-based incremental runs.** Same principle `conceptbase-mcp` already uses for
  GitHub API caching and `scripts/build_registry.py` already uses for regenerating `registry/`
  from source YAML: hash each harvested unit, skip anything unchanged since the last recorded
  run. A full backfill only ever happens once; every subsequent run processes only deltas.
- **A local run manifest**, not committed, tracking per-unit: last-processed hash, which model
  (with version/date) produced its last embedding or adjudication, so a future model upgrade can
  selectively reprocess ("re-embed everything with the new embedding model" is a deliberate,
  visible operation, not something that happens silently).
- **Local vector index stays local**, not committed to git — regenerable from source content the
  same way `registry/` is regenerable from `vocabularies/*.yaml`, but unlike `registry/` it's a
  large, semi-opaque binary-ish artifact with no reason to be reviewed in a PR diff. A `.gitignore`
  entry for the pipeline's cache directory, analogous to the existing `__pycache__/` entry.
- **Never hardcode a model name**, same rule as `gwdg-saia-ecosystem-plan.md` §6/§3 already
  states, doubly true here since a pipeline runs many more calls than an interactive app and a
  stale model default silently degrades every run rather than one interactive session.

## 7. Quality control: the fabrication risk is real and specific

This isn't a generic "LLMs can hallucinate" caveat — it's a concrete risk visible in the actual
schema read for this doc. `ccs-graph`'s relation records carry `literature_nodes` (real citations
with a `relevance` tag), `empirical_work` (per-citation `directness`), and a `confidence` block
with three separately-scored dimensions plus a composite. **An adjudication call must not be
allowed to invent a citation ID or assign a confidence score without justification** — both are
exactly the kind of plausible-sounding-but-wrong output an LLM produces under this kind of
structured-extraction pressure.

Concrete constraints to build into Stage 5/6, not just a review-time hope:
- The adjudication prompt should supply a **closed candidate list** of literature node IDs
  already present in `ccs-graph/nodes/literature` (or explicitly flagged by the human as
  "new source to add") — never let the model mint a new `lit:` id freeform.
- `confidence.composite` and its sub-scores should either be **computed deterministically** from
  the sub-scores (the existing entropy record's `0.85`/`0.45`/`0.75` → `0.68` composite looks
  like a simple average — verify the actual formula, if any, before generating new records) or
  left for human assignment, not freely generated by the model as an unconstrained float.
- Every agent-drafted record's `contributor_notes` (an existing field) should state plainly that
  it's a first-pass draft pending human verification of citations and scores — mirrors the
  "agent output never indistinguishable from human output" principle already load-bearing in
  `lpmr-management-app-spec.md` §8/§13.

## 8. Why local/batch is actually the *easier* GWDG integration

Worth stating explicitly since `gwdg-saia-ecosystem-plan.md` spent real effort on infra
questions (CORS, a public relay, public MCP hosting) that **don't apply here at all**: a local
Python script calling `chat-ai.academiccloud.de` from Dustin's own machine has no browser, no
CORS restriction, no relay to host, and no localhost-MCP restriction to work around (it doesn't
need MCP at all — it calls GWDG's REST endpoints directly). It's strictly simpler
infrastructure than the browser-based LPMR Manager app's SAIA integration, and it can be built
and validated **independently and sooner** — real learnings from it (actual model roster
behavior, actual latency/cost at scale, actual embedding quality) are useful inputs to the
browser app's later SAIA work, not the other way around. Worth revising
`gwdg-saia-ecosystem-plan.md` §7's phase order once this is confirmed: this doc's pipeline work
doesn't need to wait behind the LPMR Manager app's Phase 4.

## 9. Phasing

- **Phase 0 — Sign-off.** Resolve §10. No code.
- **Phase 1 — Reference pilot.** Implement exactly §5's entropy worked-example against
  `bio-core-k12`: harvest strand content, GWDG-assisted topic categorization, local
  entropy computation, results written back into the existing relation record's
  `empirical_work`/`open_questions` fields as a draft PR. Deliberately narrow — one record,
  one repo, proves the harvest→GWDG-judgment→local-compute→stamp→PR loop end to end before
  generalizing.
- **Phase 2 — Shared pipeline modules.** Extract Phase 1's harvest/embed/stamp code into
  reusable modules (§2); refactor `EvoMentor/evomentor_LC_MCP/evomentor_lc_mcp.py` to use them
  (§4's last row) as the second real consumer, proving the abstraction isn't Phase-1-specific.
- **Phase 3 — Scale to `ccs-graph`'s backlog.** Work through `data_development.csv`'s
  unformalized measures, generating draft relation records per §2's full pipeline (embed →
  candidate → adjudicate → ground → stamp), gated on Phase 1/2 having already validated
  citation/confidence discipline (§7).
- **Phase 4 — `conceptbase` sandbox candidates, and `openevo-graph` crosswalk candidates *only
  if* Open Decision 5 resolves toward reactivation.** Same pipeline, different target schemas,
  per §4's table — by this phase the harvest/embed/adjudicate/stamp modules should need only
  new per-target adapters, not new pipeline design. If Open Decision 5 instead resolves toward
  retirement, this phase's `openevo-graph` half becomes a one-time migration task (port unique
  content into `conceptbase`, run `caseLinks` through `case_license_gate.py`, archive the repo)
  rather than an ongoing pipeline target.
- **Phase 5 — Periodic QA pass.** The cross-model agreement check from §3's last row, once
  enough agent-drafted records exist across repos to sample from.

## 10. Open decisions

1. **Where does the pipeline code live?** `ccs-graph` is the most natural home (it's already
   the repo whose stated job is "concepts, theories, methods, and measures... in CCS," and its
   own plan doc already flags its structure as unsettled) — but it's also plausible this
   deserves its own repo (`ccs-insights-pipelines` or similar) given it reads/writes *across*
   many repos rather than being one repo's internal tooling, closer in spirit to how `ccs-graph`
   and `openevo-graph` already sit alongside rather than inside `conceptbase`. Recommendation:
   default to a `pipelines/` (or `tools/`) directory inside `ccs-graph` for Phase 1–2, since it's
   the smallest change and the repo's plan doc already anticipates restructuring — but this is
   a real call, not a default to just take.
2. **New `review_status` value naming**, for `ccs-graph`'s provenance block (`"agent-drafted"`
   was used as a placeholder throughout this doc) — confirm the actual value before Phase 1
   writes a real record, since it becomes a de facto controlled vocabulary the moment the first
   record uses it.
3. **`confidence` score formula** (§7): is `composite` meant to be a fixed weighted function of
   the three sub-scores, or human judgment case-by-case? This determines whether Stage 5 can
   compute it deterministically (safe) or must leave it blank pending human input (safer still,
   if the formula isn't actually fixed today).
4. **Scope of Phase 3's backlog run**: `data_development.csv` has dozens of entries — run the
   full backlog in one large Phase 3 pass, or pilot on a handful (5–10) first to catch
   systematic quality issues before scaling, the same "small pilot before backfill" caution
   Phase 1 already applies at the single-record level?
5. **`openevo-graph`: retire/migrate or reactivate (§1.1)?** This determines whether Phase 4
   ever points a generation pipeline at it at all. Concretely: is the 9-anchor/6-thinking-tool/
   24-concept content in `openevo-graph/nodes/` still the working source of truth for anything,
   or has `curriculum-agents/skills/content-anchor-mapper` and `docs/mapping-to-design-concept.md`
   already superseded it? Separately, regardless of that answer: the existing `caseLinks`
   standards-alignment claims should probably be run through `scripts/case_license_gate.py`
   soon either way, since that risk exists whether or not the repo has a future.

## 11. Revision history

| Date | Change |
|---|---|
| 2026-07-22 | Initial draft, written for review — not yet implemented, not yet RFC'd. |
