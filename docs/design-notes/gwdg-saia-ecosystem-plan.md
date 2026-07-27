# GWDG SAIA Ecosystem — Optimization Plan for OECB and OpenEvo CCS

| | |
|---|---|
| **Project** | Map GWDG's full SAIA/KISSKI AI-services ecosystem (Chat AI, Arcana/RAG, SAIA API gateway, MCP tool support, CoCo AI, Image/Voice/Protein AI) against real integration points across `conceptbase` (OECB), `curriculum-agents`, `EvoMentor`, and other OpenEvo CCS Lab repos — including how independently-governed, federated LPMR maintainers (not just the two reference LPMs) can use the same tools for their own work. |
| **Relationship to existing work** | Grounds and extends [`lpmr-management-app-spec.md`](lpmr-management-app-spec.md)'s §10 (SAIA integration for one app); this doc is ecosystem-wide, not app-specific. Builds on `curriculum-agents`' stated "provider-agnostic by design" principle (its `README.md`) and its open roadmap question about a public MCP server (`docs/roadmap.md`). |
| **Document status** | Draft planning pass — **not yet implemented, not yet RFC'd**. Same discipline as other `docs/design-notes/` entries: sections marked **Open Decision** are checkpoints for Dustin, not settled design. |
| **Author** | Claude (planning pass), for review by Dustin Eirdosh |
| **Date** | 2026-07-22 |

## Table of Contents

1. [Why this doc, and why now](#1-why-this-doc-and-why-now)
2. [The GWDG SAIA ecosystem, inventoried](#2-the-gwdg-saia-ecosystem-inventoried)
3. [What already touches GWDG in this ecosystem today](#3-what-already-touches-gwdg-in-this-ecosystem-today)
4. [Opportunity map](#4-opportunity-map)
5. [Federated LPMR managers: the distinct case](#5-federated-lpmr-managers-the-distinct-case)
6. [Constraints and risks](#6-constraints-and-risks)
7. [Phasing](#7-phasing)
8. [Open decisions](#8-open-decisions)
9. [Sources](#9-sources)
10. [Revision history](#10-revision-history)

---

## 1. Why this doc, and why now

`lpmr-management-app-spec.md` already committed one app to SAIA (§10 of that doc). This doc
asks the broader question implied by that commitment: GWDG's AI services are not just "an
OpenAI-compatible chat endpoint" — they're a small ecosystem (chat, RAG, coding assistance,
image/voice/protein models, an MCP tool-provider feature, an API gateway with its own rate
limits and model roster) run by a European academic-computing center under a data-protection
posture (KISSKI — "AI Service Centre for Sensitive and Critical Infrastructures") distinct
from a commercial vendor's. That posture, plus GWDG's Academic Cloud identity model, matters
specifically for a *federated* ecosystem like this one, where content is openly licensed but
individual institutions may have their own data-handling constraints and no obligation to use
whatever OpenEvo/OECB itself uses.

This doc inventories what's actually there (§2), what's already been built against it in this
lab (§3, so we don't re-derive what `EvoMentor` already learned the hard way), maps concrete
opportunities across repos (§4), and gives the federated-LPMR-maintainer case its own section
(§5) because it has a materially different trust/hosting model than anything built for OECB's
own two reference LPMs.

## 2. The GWDG SAIA ecosystem, inventoried

Per [GWDG's AI Services docs](https://docs.hpc.gwdg.de/services/ai-services/index.html) and
[SAIA (API Management)](https://docs.hpc.gwdg.de/services/ai-services/saia/index.html):

**SAIA** is the umbrella API gateway — routing, auth, and rate-limiting in front of several
backend services (self-hosted open-weight models on GWDG's own HPC infrastructure, plus some
commercial/Azure-hosted models). Everything below is reached through it via one
OpenAI-compatible base URL (`https://chat-ai.academiccloud.de/v1`) and one bearer API key per
user.

| Service | What it is | Relevant endpoint(s) |
|---|---|---|
| **Chat AI** | Chatbot web UI + API; tool integration and **MCP support** built in | `/chat/completions`, `/completions` |
| **Arcana** | Retrieval-Augmented Generation — enrich a prompt with retrieved context from an uploaded/ingested document set, no tool-calling loop required | via Chat AI, `enable-tools`/RAG params on `/chat/completions` |
| **CoCo AI** | Coding assistant | via Chat AI models tuned for code |
| **Image AI** | Image generation/editing | `/images/generations`, `/images/edits` |
| **Voice AI** | Speech transcription/translation | `/audio/transcriptions`, `/audio/translations` |
| **Protein AI** | Protein-structure/sequence models (domain-specific, not relevant to this lab) | — |
| **Embeddings** | Text embedding models | `/embeddings` |
| **Document conversion** | Turns uploaded documents into model-consumable text (feeds Arcana/RAG) | `/documents` |
| **Model roster** | Open-weight (Meta Llama, Mistral, Qwen, etc.) and commercial models, selectable per request | `/models` — **fetch at runtime, never hardcode** (see §3, §6) |

**Access model:** an individual gets a SAIA API key by holding an **Academic Cloud** account
(tied to their institution) and requesting a key through the **KISSKI LLM Service** booking
page. This is self-service, per-person, and **not something OpenEvo/OECB provisions, pays
for, or brokers** — structurally identical to "bring your own GitHub PAT," already this
ecosystem's trust model for GitHub access. Institutions without an existing Academic Cloud
relationship need one first (an "Academic Cloud Basis contract" — see [Institutional Access to
AI Services](https://docs.hpc.gwdg.de/start_here/using_ai_services/contracts_ai/index.html));
this mostly matters for European (especially German) institutions, not a global default.

**MCP support, specifically:** Chat AI can register a public MCP server as a tool provider —
paste an HTTPS URL, the model gets that server's tools. Documented constraint, load-bearing
for §5 and §6: **`http://localhost` MCP servers are explicitly not supported.** The server
must be reachable over the public internet. No auth-header configuration is documented, so
treat registering a private/authenticated MCP server as unsupported until proven otherwise.

## 3. What already touches GWDG in this ecosystem today

Two real precedents exist — read both before building anything new:

**`lpmr-management-app-spec.md` §10.** Already commits one app to SAIA, and already states
the two rules that should generalize to everything else in this doc: (a) fetch `/v1/models`
at runtime, never hardcode a model name, because the docs' own model list is described there
as "illustrative only and may be paraphrased/stale"; (b) CORS support for direct browser
`fetch()` to `chat-ai.academiccloud.de` is *unverified* — that spec treats it as an open spike,
not an assumption.

**`EvoMentor/evomentor_LC_MCP/evomentor_lc_mcp.py`.** A working script (not a browser app —
runs server-side/locally) that already does three things relevant here: (1) calls
`chat-ai.academiccloud.de/v1` directly from Python for reflective synthesis, (2) **hardcodes**
`GWDG_LLM_MODEL` to `meta-llama-3.1-70b-instruct` as a default — exactly the anti-pattern the
LPMR spec warns against, worth a follow-up fix but out of scope to touch in this planning pass
— and (3), most relevant to §5 below, calls a **separate, already-public MCP server**
(`kg.mcp.learningcommons.org/mcp`, the Learning Commons Knowledge Graph) over plain HTTPS with
its own API key. That third point is a concrete, working existence-proof inside this lab's own
codebase that "stand up a small public MCP server and point external tools at it" is a solved
problem here, not a hypothetical — it just hasn't been done yet for `openevo-mcp` itself.

**Correction, 2026-07-26: `conceptbase-mcp` no longer exists as a separate server.** It was
absorbed into `curriculum-agents/tools/openevo-mcp/server.py`, a single unified MCP server
covering eight tool modules — ConceptBase (the original conceptbase-mcp surface), agents/skills
full-text, LiteratureBase, `ccs-graph`, `lab_manager` health/journal, `openevo-graph` dispute
data, NetLogo models, and `ecosystem_status` — **all read-only**. Two facts change the rest of
this doc's assumptions, verified directly against `server.py` rather than inferred:

1. **It already speaks HTTP, not just stdio.** `python server.py --http --port 8000` runs a
   streamable-HTTP transport — the exact transport GWDG Chat AI's MCP tool-provider needs. Phase
   3's "public `conceptbase-mcp` spike" (§7) is materially cheaper than this doc assumed: the
   server-side work is already done, what's left is a public-reachability decision (a tunnel or
   small host in front of `--http` mode) and a "should everything be exposed" call — lower-stakes
   than it sounds, since every registered tool module is explicitly read-only by design.
2. **There is no `--repo` flag or repo-selection parameter.** §5 below originally assumed a
   federated LPMR maintainer could run "the same code, `--repo` pointed at their own LPMR." That
   was true of the *old* standalone `conceptbase-mcp`'s design intent but isn't how the unified
   server actually works today — it's wired to this lab's own repos (`ccs-graph`, `lab_manager`,
   `openevo-graph`, etc.), not parameterized for an arbitrary external LPMR. A federated
   maintainer wanting their own instance would need to fork and repoint paths, not pass a flag.
   Real open question, not yet decided: worth its own line in §8.

## 4. Opportunity map

Ranked roughly by leverage (how many repos/users benefit) vs. effort, not a commitment to
build in this order — see §7 for actual phasing logic.

| GWDG service | Opportunity | Where | Status |
|---|---|---|---|
| Chat AI MCP tool-provider | Run `openevo-mcp` in its existing `--http` mode behind a public HTTPS front-end and register it as a Chat AI tool provider, so anyone with just a browser and a SAIA key can chat with live ConceptBase/LPM/lab-health/literature data — no local Python/stdio setup | `curriculum-agents/tools/openevo-mcp`, consumed via `chat-ai.academiccloud.de` web UI | New — directly resolves the "no shared/public server yet" open question in `curriculum-agents/docs/roadmap.md`, and cheaper than originally scoped now that HTTP transport already exists in the server itself |
| SAIA `/chat/completions` | Third reference binding for `curriculum-agents/agents/*.md` personas (already scoped in `lpmr-management-app-spec.md` §11, Phase 4) | `conceptbase` app (LPMR Manager) | Already spec'd, not built |
| SAIA `/embeddings` | Semantic "find related concepts/competencies" — surfacing near-duplicate or thematically-close entries across vocabularies at RFC-review time, a concrete instance of the kind of cross-vocabulary drift the [Selection cross-domain case study](selection-cross-domain-case-study.md) found by hand | `conceptbase` (could live in `app/js/views/conceptLensView.js`'s data layer or as an offline `scripts/` helper for RFC authors) | New idea, no existing spec |
| Arcana (RAG) | Lower-effort alternative to full MCP tool-calling for **read-mostly grounding** — ingest `docs/oecb_specifications.md`, `curriculum-evolution`'s manual, or a target LPM's raw YAML as a RAG corpus so Chat AI answers questions "in character" without needing a tool-calling loop at all | Any read-only Q&A use case (teacher-facing help, contributor onboarding) | New idea — worth spiking before MCP for use cases that don't need live/mutable data |
| CoCo AI (esp. Zed) | Contributor-facing coding assistance for people authoring schema-shaped YAML (`oecb-schema-authoring` skill's audience) who don't have a Claude subscription/Claude Code — and, per §5.1, a working local-MCP path via Zed's own MCP client, not just chat/completion | Any LPMR contributor workflow | Confirmed live 2026-07-26 that Zed is an explicitly documented CoCo AI target with a real config example; the MCP angle (§5.1) raises this from "low priority nice-to-have" to a cheap, concrete spike worth trying before Phase 3 |
| Document conversion | Ingest PDF source material (e.g. a Teacher's Guide, a partner institution's existing curriculum doc) into YAML-draftable text as a first step before `oecb-schema-authoring` | Contribution/onboarding pipeline | New idea, speculative |
| Voice AI / Image AI / Protein AI | No identified fit in this ecosystem's current work | — | Not pursued |

## 5. Federated LPMR managers: the distinct case

This is the part of the prompt that doesn't reduce to "add SAIA to the `conceptbase` app."
A **federated LPMR maintainer** — someone running their own OECB-compatible repo the way
`bio-core-k12` or `oe-interdisciplinary-k12` do, per this ecosystem's stated pluralism (README
§"Why Does This Exist?": "independently maintained repositories... can interoperate without
every project reinventing its own data model") — has a genuinely different relationship to
GWDG's tools than OpenEvo/OECB itself does:

- **They don't need OpenEvo to provision anything.** SAIA/KISSKI access is self-service per
  Academic Cloud identity (§2). A federated maintainer at a German or EU institution can get
  their own key with zero coordination with this lab — same trust model this ecosystem already
  uses for GitHub PATs. OpenEvo's job is to make its *tools* consumable by someone bringing
  their own key, not to be a broker or reseller of GWDG access.
- **What OpenEvo should standardize so this actually works for *any* LPMR, not just the two
  reference ones:** the MCP tool *contract* — the ConceptBase-facing subset of `openevo-mcp`'s
  now-broader surface (`conceptbase_search`, `conceptbase_get_concept`,
  `conceptbase_get_competency`, `conceptbase_get_concept_lens`, `conceptbase_list_lpms`,
  `conceptbase_list_strands`, plus `conceptbase_validate_entry` — the exact tools
  `lpmr-management-app-spec.md` §10.4 already reuses) — needs to be documented as a stable,
  versioned interface *independent of* `curriculum-agents`' implementation of it. **This is
  materially harder than it was under the old standalone `conceptbase-mcp` design**, per the
  §3 correction above: the unified server has no `--repo`/repo-selection parameter today, so a
  federated LPMR maintainer can't just point "the same code" at their own LPMR — they'd need
  to fork `openevo-mcp` and repoint its ConceptBase-reading paths, or OpenEvo would need to add
  repo-selection support back in as a deliberate feature. Today the contract only exists
  implicitly, as "whatever `conceptbase_tools.py` happens to implement inside `openevo-mcp`" —
  worth writing down explicitly, and worth deciding whether repo-parameterization is worth
  re-adding, once a second consumer (Chat AI or a federated maintainer, not just Claude Code)
  actually depends on it.
- **The public-HTTPS MCP constraint (§2) turns a "someday" roadmap item into a forcing
  function.** `curriculum-agents/docs/roadmap.md` already flags "no shared/public server yet"
  as an open question with no urgency attached. GWDG Chat AI's explicit refusal to talk to
  `localhost` means any federated maintainer who wants to use Chat AI (not Claude Code) against
  live ConceptBase/LPM data needs *some* public instance to exist — either OpenEvo hosts one
  shared, read-only, rate-limited instance (small new infra, same category of decision as the
  LPMR spec's "Open Decision 2" about a stateless relay), or documents clearly enough that each
  federated maintainer can trivially self-host their own from the same code. Either is fine;
  not deciding is what blocks this specific use case.
- **Data-sovereignty angle, not just a fallback option.** KISSKI is explicitly positioned for
  data-protection-sensitive use ("AI Service Centre for Sensitive and Critical
  Infrastructures"), and GWDG is EU/German infrastructure. For a federated LPMR maintainer at
  an institution with its own data-handling policy (common at European universities and
  schools), SAIA may be the tool they're *required* to prefer over a US-based provider — this
  is a real reason a federated partner picks GWDG specifically, not merely "the free/backup
  option next to Claude." Worth stating explicitly in whatever onboarding doc eventually
  targets federated LPMR maintainers, so it reads as a first-class path rather than an
  afterthought.
- **Licensing carries over unchanged.** Whatever an LPMR's content license is (most
  `CC-BY-NC-SA-4.0`, per RFC-0004 as already noted in the LPMR spec §13), a federated
  maintainer sending their own content into Arcana/RAG ingestion or Chat AI is a data-handling
  decision for *their* governance, not OpenEvo's — this doc doesn't change who's responsible
  for that call, it just means the same disclosure discipline in `lpmr-management-app-spec.md`
  §13 should be written once, generically, rather than re-derived per app.

## 5.1 New finding (2026-07-26): CoCo AI + Zed sidesteps the public-MCP-hosting question for one real case

Verified live against GWDG's CoCo AI docs and Zed's own MCP docs, not assumed: GWDG's coding
assistant, **CoCo AI**, is "Chat AI... accessible via your SAIA API key" wired into several
editors — Continue, Zed, Emacs, OpenCode, Cline — with **Zed** explicitly documented
(`docs.hpc.gwdg.de/services/ai-services/coco-ai/code_completion/index.html#zed`), configured via
an OpenAI-compatible `language_models.openai` block in Zed's `settings.json` pointing at
`https://chat-ai.academiccloud.de/v1`, key entered through Zed's own UI (not the config file).

**Why this matters for §5/§6/§8's Open Decision 1, not just "another IDE option":** Zed's MCP
client is independent of which LLM backend is configured — confirmed via Zed's own docs
(`zed.dev/docs/ai/mcp`): local servers are added as `{"command": ..., "args": [...], "env": {}}`
entries that Zed launches as local processes, "no HTTP connection required... works with any
configured LLM backend." **This is a fundamentally different case from §2's GWDG-Chat-AI-web-UI
MCP registration**, where the constraint (`http://localhost` explicitly unsupported) exists
because Chat AI's *server* is the MCP client, reaching out from GWDG's infrastructure to a
publicly-hosted tool provider. In the Zed case, **Zed itself is the MCP client**, running on the
contributor's own machine — it can launch `openevo-mcp` as an ordinary local stdio process
exactly the way Claude Code already does (`python tools/openevo-mcp/server.py`, same invocation
`curriculum-agents/.mcp.json` already uses), then hand the tool results to whatever model backend
is configured (a GWDG model via CoCo AI, in this case). No public hosting, no CORS, no relay —
and, per the §3 correction, the contributor gets the *entire* unified surface this way (all eight
tool modules), not just the original six ConceptBase tools.

**Concrete implication:** a contributor without a Claude subscription could get real MCP
tool-calling against live ConceptBase/LPM/lab-health/literature/ccs-graph/dispute/NetLogo data —
using `curriculum-agents/tools/openevo-mcp` exactly as-is, zero new code — today, by running Zed
with CoCo AI configured and adding `openevo-mcp` as a local MCP server in Zed's settings. That's a
materially cheaper spike than Phase 3's public deployment (§7), and worth trying *first*: it
validates "GWDG + this lab's MCP tools are actually useful together" without touching Open
Decision 1 at all. Phase 3's public-hosting question still matters for the GWDG-*Chat-AI-web-UI*
case specifically (someone with only a browser, no local Zed/Claude Code install) — this finding
narrows, not replaces, what that phase needs to prove, and per §3's `--http` finding, Phase 3
itself is now cheaper too.

**Verified 2026-07-26, not just "docs on both sides say this should work."** No Zed install was
available this session, so the mechanism was validated directly instead: a script spawned
`openevo-mcp` over stdio (identical command an editor's MCP client would run), listed its 31 real
tools, offered them to a live GWDG model via the OpenAI-compatible tool-calling API
(`/chat/completions` with `tools`/`tool_choice`), and let the model decide what to do. Both models
tried — `devstral-2-123b-instruct-2512` and **`glm-4.7`** (the model actually configured in this
machine's `~/.continue/config.yaml`) — correctly chose to call `conceptbase_list_lpms({})` with no
prompting toward that specific tool, got the real result (`bio-core-k12`, `oe-interdisciplinary-k12`
from ConceptBase's live registry), and produced a correct grounded final answer. This confirms the
underlying claim end to end: **a GWDG model can drive `openevo-mcp` tools correctly through the
standard OpenAI tool-calling contract** — the same contract every documented local MCP client
(Zed, Continue.dev, Claude Code) implements, so this generalizes across editors rather than being
Zed-specific.

**Also found this session: `openevo-mcp` is already registered with Continue.dev on this
machine**, not just planned — `~/.continue/mcpServers/openevo.yaml` (global, loads in every
Continue session) plus project-level copies in `curriculum-agents/.continue/` and
`lab_manager/.continue/`, and `~/.continue/config.yaml` already has GLM-4.7 wired to
`chat-ai.academiccloud.de/v1` via CoCo AI. One piece of drift found and fixed in the same pass:
`lab_manager/.continue/mcpServers/conceptbase.yaml` still pointed at the deleted
`tools/conceptbase-mcp/server.py` — same stale-reference family as this doc's own §3 correction,
just in a config file instead of a design doc. Fixed to point at `openevo-mcp/server.py`.

## 6. Constraints and risks

- **MCP + localhost.** Restated from §2/§5 because it's the single fact that most changes what
  "add MCP support" can mean here: nothing running only on a contributor's laptop can be
  registered with Chat AI. Any GWDG-MCP integration implies a public endpoint decision.
- **Rate limits are per-user, not per-project.** SAIA's documented tiers (example figures:
  ~1,000/min, ~10,000/hr, ~50,002/day) are fine for one person's interactive use but make a
  **shared service key a bad idea** for anything automated at repo scale — e.g. wiring an AI
  review pass into `scripts/validate.py`/CI (mentioned only to rule out, not recommend) would
  either need every contributor's own key (impractical for CI) or a shared key that GWDG's own
  terms discourage ("DO NOT share your API key with other users"). Keep GWDG-model calls
  interactive/human-triggered, not CI-automatic, unless this gets revisited with GWDG directly.
- **Model staleness.** Both this doc's own research and `lpmr-management-app-spec.md` §10.1
  independently found the docs' listed model names untrustworthy as a fixed reference — always
  hit `/v1/models` at call time. `EvoMentor`'s hardcoded default is a live example of the
  failure mode this causes (a default that silently goes stale). A hardcoded fallback isn't
  inherently wrong — always calling `/v1/models` live has its own latency/failure-mode cost —
  but GWDG's model roster and availability change often enough that any hardcoded default
  needs a documented refresh cadence, not a one-time value left to rot.
- **Untested against this lab's actual agent personas.** `lpmr-management-app-spec.md` §11
  already flags this — `curriculum-agents/agents/*.md` personas have only been validated
  against Claude models. This doc doesn't change that; SAIA models remain an open
  quality question for agent-persona use specifically (separate from raw chat/RAG use, which
  carries no such caveat).
- **New public infra is a real exception, not a free action.** Both a public `openevo-mcp`
  instance (§5) and the CORS relay already flagged in the LPMR spec (§6.1/§10.3 there) are the
  same category of decision: this ecosystem's stated design principle is static/git-native/
  no-backend, and each is a small, justified exception — but "small" still means someone owns
  hosting, uptime, and budget indefinitely. Don't multiply these decisions independently per
  app; §8 below proposes deciding it once. The `--http` transport already existing (§3) lowers
  the *build* cost of this exception, not the *ownership* cost — someone still needs to run and
  keep that process alive indefinitely once it's public.

## 7. Phasing

Checkpoint-gated, matching this project's established working mode (see
`[[project-human-dimensions-initiative]]`-style phased review already in use elsewhere in this
lab, and `lpmr-management-app-spec.md` §15's own phasing).

- **Phase 0 — This doc's sign-off.** Resolve §8. No code.
- **Phase 1 — Ride along with `lpmr-management-app-spec.md`'s own Phase 4.** Don't build
  anything GWDG-related ahead of that app's existing SAIA plan; it's the nearest-term real
  consumer and will surface concrete lessons (CORS behavior, tool-calling support, actual model
  roster) cheaply.
- **Phase 2.5 — done (§5.1, §3 correction), 2026-07-26.** Spiked the underlying mechanism (GWDG
  model + local `openevo-mcp` via OpenAI-compatible tool-calling) directly — confirmed working
  with both `devstral-2-123b-instruct-2512` and `glm-4.7`. Separately confirmed `openevo-mcp` is
  already live-registered in this machine's real Continue.dev config (global + per-project), with
  GLM-4.7 already wired through CoCo AI — this ecosystem already has a working non-public MCP
  path today, not just a validated hypothesis. Actual Zed install/UI click-through still not done
  (no Zed on this machine) — lower priority now that Continue.dev already proves the same
  mechanism in a tool the user actually runs day to day.
- **Phase 2 — Document the MCP tool contract as a standalone interface**, independent of
  `curriculum-agents`' implementation, so it can be versioned and referenced by anything that
  wants to consume it (a federated LPMR's own `openevo-mcp`-derived instance, a future public
  instance, Chat AI registration). Pure documentation, no new code. Per §3's correction, this
  now also needs to state plainly that repo-selection isn't supported today, not just describe
  the tool surface.
- **Phase 3 — Public `openevo-mcp` spike**, gated on Open Decision 1 below. Cheaper than
  originally scoped: the server already supports `--http` streamable transport, so this phase is
  a public-reachability decision (tunnel/host) plus a live registration test, not new server
  code. If approved: one small, rate-limited public deployment (still read-only by construction,
  per §3), registered as a Chat AI MCP tool provider as a live test — success criterion is "a
  federated LPMR maintainer with only a browser and a SAIA key can ask Chat AI a live ConceptBase
  question," not a production SLA.
- **Phase 4 — Federated-maintainer onboarding doc.** Once Phase 3 proves the path works, write
  the actual onboarding material (where does a federated maintainer get an Academic Cloud
  account, a SAIA key, how do they point their own `openevo-mcp` fork or the shared public one
  at their repo — the repo-selection gap from §3 needs an actual answer by this phase, not just a
  flagged caveat). Not worth writing before Phase 3 confirms the mechanics.
- **Embeddings/semantic-search (§4) and Arcana/RAG (§4) are independent of this phase order** —
  either could be spiked opportunistically whenever someone has a concrete need (e.g. the next
  time a Selection-style cross-vocabulary drift case comes up), not gated on Phases 1–4.

## 8. Open decisions

1. **Public MCP hosting (§5, §6, Phase 3):** does OpenEvo host one small shared, read-only
   `openevo-mcp` instance (its existing `--http` mode) for the whole federation, or does the
   ecosystem instead invest in making self-hosting trivially easy (a one-command deploy target,
   e.g. a free-tier serverless/container platform) so each federated maintainer runs their own?
   Same shape of question as the LPMR spec's "Open Decision 2" (who hosts the CORS relay) — worth
   deciding both together rather than accumulating separate infra-ownership decisions per app.
   Lower priority than it was, given §5.1's Zed-local-MCP path covers the non-browser case
   already, for free, today.
4. **Repo-parameterization for `openevo-mcp` (new, §3 correction):** the unified server has no
   `--repo`/repo-selection flag, unlike what this doc originally assumed of standalone
   `conceptbase-mcp`. Is it worth adding back in (so a federated maintainer's fork, or a shared
   public instance, could serve a repo other than this lab's own), or does every federated
   maintainer just run their own fork with paths hardcoded to their own content? Blocks Phase 4's
   onboarding doc from being fully concrete either way.
2. **How much of this doc's opportunity map is worth pursuing now vs. parked:** embeddings-based
   semantic search (§4) and Arcana/RAG-based doc grounding (§4) are both real, independent
   ideas with no upstream dependency — is there appetite to spike either before or in parallel
   with `lpmr-management-app-spec.md`'s Phase 4, or should everything GWDG-related wait for
   that app to prove the pattern first (this doc's default assumption, §7 Phase 1)?
3. **Federated-maintainer outreach:** is there an actual near-term audience (a specific
   institution or partner already running or planning an OECB-compatible LPMR) who'd use a
   federated MCP/SAIA path today, or is §5 currently anticipatory design for a use case that
   doesn't have a concrete first user yet? Changes how much to invest in Phase 4's onboarding
   doc now vs. later.

## 9. Sources

- [GWDG AI Services overview](https://docs.hpc.gwdg.de/services/ai-services/index.html)
- [SAIA (API Management)](https://docs.hpc.gwdg.de/services/ai-services/saia/index.html)
- [Chat AI — MCP feature docs](https://docs.hpc.gwdg.de/services/ai-services/chat-ai/features/mcp/index.html)
- [Institutional Access to AI Services](https://docs.hpc.gwdg.de/start_here/using_ai_services/contracts_ai/index.html)
- [CoCo AI overview](https://docs.hpc.gwdg.de/services/ai-services/coco-ai/index.html)
- [CoCo AI — code completion / Zed setup](https://docs.hpc.gwdg.de/services/ai-services/coco-ai/code_completion/index.html#zed)
- [Zed — MCP server support](https://zed.dev/docs/ai/mcp)
- `lpmr-management-app-spec.md` (this repo, §10–§11, §13)
- `curriculum-agents/README.md`, `curriculum-agents/docs/roadmap.md` (local clone)
- `EvoMentor/evomentor_LC_MCP/evomentor_lc_mcp.py` (local clone, `openevo-ccs-lab/EvoMentor`)

## 10. Revision history

| Date | Change |
|---|---|
| 2026-07-22 | Initial draft, written for review — not yet implemented, not yet RFC'd. |
| 2026-07-26 | Reviewed against live GWDG SAIA/CoCo-AI/Zed docs (requested audit, not a scheduled recheck). Rate limits, model-fetch guidance, and the localhost-MCP constraint all confirmed unchanged. Added §5.1: CoCo AI explicitly supports Zed, and Zed's MCP client runs local stdio servers independent of LLM backend — a materially cheaper way to validate "GWDG + this lab's MCP tools" than Phase 3's public-hosting spike, worth trying first. Not yet tested end-to-end in this lab. Updated §4's CoCo AI row and §9 Sources accordingly. |
| 2026-07-26 | Second pass, same day: replaced every stale `conceptbase-mcp` reference with the real unified `openevo-mcp` server (§3 correction) after checking `server.py` directly. Two findings changed real assumptions: (a) `openevo-mcp` already supports `--http` streamable transport, making Phase 3's public spike cheaper than scoped (server work is done, only public reachability + ownership remain); (b) unlike the old design intent, there's no `--repo` flag — a federated maintainer can't just point "the same code" at their own LPMR today, added as new Open Decision 4. Updated §4, §5, §5.1, §6, §7, §8 throughout. |
| 2026-07-26 | Third pass, same day: ran the §5.1 spike for real (no Zed install available, so validated the underlying mechanism directly via script — stdio MCP client + live GWDG `/chat/completions` tool-calling). Confirmed working with `devstral-2-123b-instruct-2512` and with `glm-4.7` specifically (the model already configured in this machine's Continue.dev setup). Also discovered `openevo-mcp` is already registered with Continue.dev, globally and per-project, and fixed one real piece of drift found in the process: `lab_manager/.continue/mcpServers/conceptbase.yaml` still pointed at the deleted `conceptbase-mcp/server.py`, now points at `openevo-mcp/server.py`. Phase 2.5 marked done. |
