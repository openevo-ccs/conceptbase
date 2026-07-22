# LPMR Management App — Planning Specification

| | |
|---|---|
| **Project** | A new app in the ConceptBase Explorer ecosystem: GitHub-OAuth-gated exploration, review, and AI-assisted deliberation over any OECB-compatible Learning Progression Model Repository (LPMR) |
| **Relationship to existing repos** | Extends `conceptbase` (`app/`), reads from any LPMR (`bio-core-k12`, `oe-interdisciplinary-k12`, future sandbox forks), reads agent personas from `curriculum-agents`, calls the SAIA (GWDG) OpenAI-compatible LLM API |
| **Document status** | Draft planning specification — **not yet implemented, not yet RFC'd**. Structured like `eva_buch/app_specs.md` (living doc) crossed with this repo's RFC discipline: sections marked **Open Decision** are checkpoints for Dustin, not settled design. |
| **Author** | Claude (planning pass), for review by Dustin Eirdosh |
| **Date** | 2026-07-22 |

## Table of Contents

1. [Overview](#1-overview)
2. [Terminology](#2-terminology)
3. [What Already Exists (don't rebuild this)](#3-what-already-exists-dont-rebuild-this)
4. [Goals and Non-Goals](#4-goals-and-non-goals)
5. [Architecture: app-ecosystem shape](#5-architecture-app-ecosystem-shape)
6. [Authentication: GitHub OAuth](#6-authentication-github-oauth)
7. [Authorization: editorial / reviewer roles](#7-authorization-editorial--reviewer-roles)
8. [Data model: review, comment, flag, tag, link](#8-data-model-review-comment-flag-tag-link)
9. [Write path: from draft to PR](#9-write-path-from-draft-to-pr)
10. [SAIA (GWDG) LLM integration](#10-saia-gwdg-llm-integration)
11. [Curriculum Agents integration](#11-curriculum-agents-integration)
12. [Cross-linking to other OpenEvo tools](#12-cross-linking-to-other-openevo-tools)
13. [Security & privacy](#13-security--privacy)
14. [UI/UX shape](#14-uiux-shape)
15. [Phasing](#15-phasing)
16. [Open decisions (need Dustin's input before Phase 1 starts)](#16-open-decisions-need-dustins-input-before-phase-1-starts)
17. [Revision history](#17-revision-history)

---

## 1. Overview

The **LPMR Management App** is a new capability in the ConceptBase app ecosystem that lets
authenticated, authorized users open *any* OECB-compatible Learning Progression Model
Repository — not just the two bundled reference LPMs — and:

- explore and visualize its structure (reusing the existing Explorer views),
- **comment, flag, and tag** individual entities (LPM, Strand, SubStrand, Concept/Competency
  references) with real GitHub identity attached, not an anonymous free-text name,
- **link** findings across LPMRs, or out to other OpenEvo ecosystem artifacts (a
  `curriculum-agents` discussion/proposal, a ConceptBase alignment record),
- optionally invoke an **AI agent** — using OpenEvo's own `curriculum-agents` personas,
  run against GWDG's SAIA OpenAI-compatible endpoint with a user-supplied API key — to
  produce a first-pass review, and
- turn all of the above into a **human-reviewed pull request**, the same governance
  discipline every other change in this ecosystem goes through.

This is additive to the existing [ConceptBase Explorer](../../app/), not a replacement.
Read §3 before anything else — most of the hard infrastructure (GitHub client, caching,
draft-YAML export, theme, registry loading) already exists and should be reused, not
reinvented.

## 2. Terminology

- **LPM** — a single Learning Progression Model (`lpm.yaml` + `strands/*.yaml`), the
  content object defined by `schemas/lpm.schema.yaml`.
- **LPMR** (this doc's term, not yet used elsewhere in the codebase) — a **Learning
  Progression Model Repository**: an independently-governed git repo that hosts one LPM
  and validates it against OECB schemas — e.g. `bio-core-k12`, `oe-interdisciplinary-k12`,
  or any third party's repo that pins `conceptbase` the same way (see README
  ["Referencing a concept from a dependent repository"](../../README.md#quickstart)).
  "OECB-compatible" means: has a manifest pinning an `ontology`/`vocabularies` version and
  validates cleanly against `schemas/lpm.schema.yaml` + `strand.schema.yaml`.
- **Reviewer role** — can view, comment, flag, tag; cannot edit LPMR content or merge.
- **Editorial role** — reviewer permissions plus can open/merge PRs against the LPMR (in
  practice, gated by the person's actual GitHub permission on that repo — this app never
  grants permission GitHub itself doesn't already grant, see §7).

## 3. What Already Exists (don't rebuild this)

The existing Explorer (`app/`) already solves several of this app's hard problems. Reuse:

| Need | Existing solution | File |
|---|---|---|
| GitHub API access, ETag/TTL caching, rate-limit-aware errors | `apiFetch`, `fetchTree`, `fetchRawText`, `fetchAbsoluteRawText` | `app/js/githubClient.js` |
| Credential storage (currently PAT only) | `getToken`/`setToken` over `localStorage` | `app/js/githubClient.js`, `LS_KEYS` in `app/js/config.js` |
| Loading an arbitrary repo's LPM/strands | slot-based repo loader | `app/js/lpmLoader.js`, `app/js/loadPanel.js` |
| Draft-YAML-then-PR pattern for contributions | alignment drafts + `oe:userAnnotation` extension patches, exported as YAML the user pastes into a PR by hand | `app/js/annotations.js` (see its own header comment citing spec §7.4/§11.2) |
| Cross-vocabulary/cross-repo entity lookup | Concept Lens (any concept/competency, its definitions, referencing substrands, alignments) | `app/js/views/conceptLensView.js` |
| Theming, dark/light, OpenEvo palette (`#085E65`/`#272D63`) | `app/js/theme.js`, confirmed canonical via `eva_buch/app_specs.md` | `app/css/styles.css` |
| Tab/view registration pattern | flat `TABS` array + `state.activeTab` | `app/js/main.js` |

**Annotations today are anonymous-by-convention**: `annotations.js`'s `author` field is a
free-text name typed into a box (`LS_KEYS.authorName`), not a verified identity. This app's
entire value proposition over the existing Annotations tab is replacing that with a real,
GitHub-verified author and a real permission check — see §6–§7.

## 4. Goals and Non-Goals

**Goals**

- Real GitHub identity and real per-repo permission checks behind comment/flag/tag/edit actions.
- Works against *any* OECB-compatible LPMR the user points it at, not just the two bundled ones.
- Human review artifacts (comment/flag/tag/link) are structured, exportable, and PR-able —
  never silently written to a repo without a human-visible diff.
- Optional AI-assisted review using OpenEvo's own agent personas, clearly marked as
  agent-authored, never indistinguishable from a human reviewer's comment.
- No new backend *service* if at all avoidable — this ecosystem's static, git-native,
  no-server design principle is load-bearing (see README "Design Principles"), and any
  exception to it must be small, stateless, and justified (see §6).

**Non-goals (this round)**

- Not building multi-agent institutional deliberation (`processes/` in `curriculum-agents`)
  — that protocol has zero implemented processes upstream today (see §11). Building it here
  first would invert the dependency the READMEs already describe.
- Not letting any agent or human write directly to `conceptbase`'s permanent registry —
  ConceptBase-level findings still go through the sandbox tier + RFC process that already
  exists (RFC-0001, RFC-0010's pattern).
- Not a general-purpose GitHub PR review tool — scope is specifically OECB-schema-shaped
  content (LPM/Strand/SubStrand/Concept/Competency), not arbitrary code review.

## 5. Architecture: app-ecosystem shape

Today, `app/` is one static SPA with a flat tab list (`app/js/main.js`'s `TABS` array).
Making ConceptBase Explorer a genuine "flexible app ecosystem" — as opposed to just adding
another tab — means deciding how much structural change to take on now vs. later.

**Two shapes, not mutually exclusive over time:**

**A — Add tabs to the existing app** (small diff, ships fastest)
Add `"lpmr-manage"` (and maybe `"agent-review"`) to the existing `TABS` array, sharing
`state.js`, `githubClient.js`, `theme.js` as-is. This is how Concept Lens was added, and it
worked well. Risk: the single `TABS` array and single `state` object start accumulating
concerns (auth/session, role resolution, LLM credentials) that don't belong to "explore and
compare two LPMs," the app's original job.

**B — Extract a shared shell, make apps pluggable** (bigger diff, the literal ask)
Split `app/js/` into:
```
app/
├── shell/            # cross-app: theme, auth/session (new), github client, registry loader
├── apps/
│   ├── explorer/      # today's Dashboard/Vocabulary/Alignments/Concept Lens/Explorer/Annotations
│   └── lpmr-manager/  # this spec's new app
└── index.html         # app launcher / switcher
```
Each app under `apps/` owns its own tab set and state slice, but all read the same
`shell/session.js` (who's logged in, what role on which repo) and `shell/githubClient.js`.
This is what actually earns the phrase "app ecosystem" — Explorer and LPMR Manager become
two peers in it, and a third app (say, a future Curriculum Agents deliberation viewer) slots
in the same way rather than growing a fourth unrelated tab on an already-loaded `TABS` array.

**Recommendation:** do shape A first for a working v1 fast (Phase 2, §15), but land the auth
session layer (§6–§7) in `shell`-shaped modules from the start even while still shape-A —
so migrating to full shape B later (Phase 3+, once a second or third app clearly wants the
shared session) is a mechanical move, not a rewrite. Don't do the full directory split
speculatively before there are two apps that actually need it.

This is genuinely Dustin's call, not a default I should just take — see **Open Decision 1**.

## 6. Authentication: GitHub OAuth

### 6.1 Why this is harder than "add OAuth" sounds

The existing app authenticates with a **personal access token (PAT)** pasted into a
Settings box (`githubClient.js`'s `getToken`/`setToken`) — not OAuth. A real GitHub OAuth
*Authorization Code* flow needs a server to exchange `code` + `client_secret` for a token,
because the secret can't live in client-side JS. That's a real backend, which conflicts with
this ecosystem's static/no-backend principle stated throughout the README.

The practical way to get real GitHub sign-in **without** running a persistent backend
service:

**GitHub OAuth Device Flow.** The user visits `github.com/login/device`, enters a code shown
in-app, and the app polls GitHub for a token. Device Flow does **not** require a
`client_secret** — only a public `client_id` — so, unlike the Authorization Code flow, there's
no secret to protect. The catch: GitHub's OAuth token endpoints
(`github.com/login/device/code`, `github.com/login/oauth/access_token`) do **not** send
CORS headers, so a browser `fetch()` straight from a static page will be blocked by the
browser regardless of flow. This is a well-known limitation of building GitHub sign-in for a
purely static site, not specific to this app.

**Implication:** some non-static component is unavoidable, but it can be reduced to a small,
stateless, secret-free relay — a single serverless function (Cloudflare Worker / Netlify
Function / Vercel Edge Function) whose only job is forwarding the two Device Flow HTTP calls
and adding CORS headers back onto the response. It holds no secret (Device Flow needs none)
and no state (each call is a pass-through). This is meaningfully smaller than "run a backend"
but is **not nothing** — it's the first non-static infra this ecosystem would own, and
someone has to host/pay for/maintain it. See **Open Decision 2**.

### 6.2 Recommended flow

1. User clicks "Sign in with GitHub" → app requests a device code from the relay.
2. App shows the user code + a link to `github.com/login/device`.
3. App polls the relay (which polls GitHub) until the user approves.
4. App receives a **user-to-server token** scoped to whatever the GitHub App (not "OAuth
   App" — see below) was granted at install time, stores it exactly where the PAT is stored
   today (`LS_KEYS`-shaped entry in `localStorage`), and uses the *same* `githubClient.js`
   functions unchanged (they already just read a bearer token).
5. **PAT entry remains available** as a fallback for anyone who doesn't want to go through
   the relay, is running the app from a local clone, or is in an environment where the relay
   is unreachable — it's already built and shouldn't be removed.

**GitHub App vs. OAuth App:** register a **GitHub App** (not a classic OAuth App). GitHub
Apps support fine-grained, repo-scoped permissions (contents: write, pull requests: write,
metadata: read) rather than the coarse `repo` scope classic OAuth Apps require, so a
reviewer who authorizes the app isn't handing over blanket access to every private repo they
can see. Device Flow is supported for GitHub Apps.

### 6.3 What ships in Phase 1 vs. later

Phase 1 needs only sign-in (identity) — not write access yet. Request the minimal
`contents:read` + `metadata:read` permission set at first; add `contents:write` +
`pull_requests:write` only when the direct-PR-creation write path (§9.2) actually ships,
so the permission prompt a user sees always matches what the app can currently do.

## 7. Authorization: editorial / reviewer roles

GitHub already has a permission model per repo; don't invent a parallel one where GitHub's
suffices.

**Coarse gate (works everywhere, zero extra files):** call
`GET /repos/{owner}/{repo}/collaborators/{username}/permission` with the signed-in user's
token. Map the result:

| GitHub permission | App role |
|---|---|
| `admin` / `maintain` / `write` | **editorial** — can comment/flag/tag AND open/merge PRs |
| `triage` / `read` | **reviewer** — can comment/flag/tag; PR creation falls back to the export-and-paste path (§9.1) since they lack write access |
| none / repo not found (private, no access) | read-only if the repo is public; otherwise the app can't load it at all — same constraint the existing Explorer already has |

This requires no new file, no new governance process, and can't drift out of sync with the
LPMR's real GitHub access list — it *is* the real GitHub access list.

**Optional fine-grained layer (`Phase 3, needs its own RFC` — see §15):** for LPMRs that want
to invite reviewers who aren't GitHub collaborators (e.g. an external subject-matter
reviewer with no write access at all), an opt-in `.github/OECB_ROLES.yaml` in the LPMR,
governed the same way `curriculum-agents/.github/CODEOWNERS` already is (PR-reviewed, no
special tooling needed to read it — it's a flat list):

```yaml
# .github/OECB_ROLES.yaml — optional, read by the LPMR Management App only.
# Grants app-level roles to people who are not GitHub collaborators on this repo.
reviewers:
  - github: jane-example
    role: reviewer      # reviewer | editorial (editorial here still can't merge — GitHub write access still gates that)
    scope: []           # optional: restrict to specific strand/substrand ids; empty = whole LPM
```
This file is additive only — it can *grant* reviewer/commenter-level app access beyond
GitHub's own list, but it never overrides GitHub's own permission for anything that touches
actual repo writes (merging is always gated by real GitHub permission, never by this file).

## 8. Data model: review, comment, flag, tag, link

Extend, don't replace, the existing `oe:userAnnotation` extensions pattern
(`app/js/annotations.js`) — it already has the right shape (namespaced `extensions` patch,
per spec §7.4) and the right export discipline (draft YAML, human-reviewed, never
auto-merged). What's missing for this app:

- **Real authorship**: `author` becomes `{ githubLogin, avatarUrl }` resolved from the
  signed-in session, not a free-text field (the free-text field remains as a fallback for
  anonymous/PAT-only use).
- **Flag severity/category**, distinct from a plain tag: e.g. `factual-error`,
  `equity-concern`, `ambiguous-scope`, `cross-vocabulary-misalignment` — a small controlled
  list, extensible the same way other controlled vocabularies in this ecosystem are (RFC to
  add a category, not a free-for-all).
- **Status lifecycle** on a review record: `open → acknowledged → resolved | wontfix`,
  mirroring the `proposed → accepted → stable → deprecated/superseded` pattern this ecosystem
  already uses elsewhere (GOVERNANCE.md) rather than inventing a new shape.
- **Link records**: a review entity can point at another LPMR entity (cross-repo) or at an
  external OpenEvo artifact URL (a `curriculum-agents/artifacts/discussions/...` file, a
  ConceptBase alignment record) — structurally just another field on the same record, not a
  new entity type.
- **Agent provenance** (new, needed for §10–§11): when a review record is agent-authored,
  it must carry `authoredBy: { type: "agent", agentId, model, invokedBy: <human-githubLogin> }`
  and render visibly differently in the UI from a human comment. This is a hard requirement,
  not a nice-to-have — see §13 and `curriculum-agents`' own stated principle that an agent's
  output is "never an unreviewed autonomous change."

A formal `review.schema.yaml` (parallel to `alignment.schema.yaml`) belongs in `conceptbase`
proper once this design is validated in practice — **that is its own future RFC**, the same
way RFC-0010 surfaced follow-on RFCs while being drafted. Don't pre-write that schema now;
build against the shape above informally first (as `annotations.js` already does for
today's simpler case), and let real usage tell you what the schema needs to say.

## 9. Write path: from draft to PR

### 9.1 Export-and-paste (already exists, keep as universal fallback)

`annotations.js`'s current behavior: build draft YAML in-browser, user copies it out,
manually opens a PR. Works with zero write permission, zero OAuth. Keep this path for
read-only/`reviewer`-role users and anyone who prefers it.

### 9.2 Direct PR creation (new, requires `editorial` role + OAuth write scope)

For users with real write access (§7) and an OAuth session with `contents:write` +
`pull_requests:write` (§6.3), offer a one-click upgrade: create a branch, commit the same
draft YAML via the Contents API to a `reviews/` directory in the target LPMR, and open a PR
via the Pulls API — using the signed-in user's own token, so the PR is authored *by them*,
not by a shared bot identity. This is a strict upgrade of the existing export flow, not a
separate feature: same YAML shape, same human-reviewable diff, just fewer manual steps for
people who already have write access.

Never skip the PR. Nothing in this app writes to a default branch directly, ever — matching
`curriculum-agents`' own "every tool here is read-only [against ConceptBase]; proposing a
change means opening a PR" principle, extended here to LPMRs directly.

## 10. SAIA (GWDG) LLM integration

### 10.1 What SAIA is, concretely

Per [the GWDG SAIA docs](https://docs.hpc.gwdg.de/services/ai-services/saia/index.html):
OpenAI-API-compatible endpoint at `https://chat-ai.academiccloud.de/v1`, Bearer-token
auth, standard `/chat/completions` (plus `/embeddings`, `/models`, others not relevant
here). Keys are obtained by the user themselves via the KISSKI LLM Service booking page
using an Academic Cloud email — this app never issues or proxies keys, it only consumes a
key the user already has.

**Do not hardcode a model list in the implementation.** Fetch `/v1/models` at runtime and
let the user pick. (The specific model names surfaced during this planning pass — via an
automated fetch-and-summarize of the docs page — are illustrative only and may be
paraphrased/stale; treat the live `/v1/models` response as ground truth, not this document.)

### 10.2 Credential storage

Same trust model as the existing GitHub PAT: a `localStorage` entry
(e.g. `oecb-lpmr:saia-key`, next to `LS_KEYS` in `config.js`), plaintext in the browser,
never transmitted anywhere but directly from the browser to `chat-ai.academiccloud.de`. This
is an *accepted*, not new, risk in this codebase — the GitHub PAT already works this way —
so document it as consistent precedent rather than a fresh security decision.

### 10.3 Open risk: CORS

The docs fetched during this planning pass do not state whether
`chat-ai.academiccloud.de` sends CORS headers permitting direct browser `fetch()`. **This
must be spiked (a five-minute manual test) before committing to a client-only
architecture** — if CORS is absent, the same small stateless-relay pattern proposed for
GitHub Device Flow (§6.1) can carry SAIA requests too (forward the request, add CORS
headers, never inspect or log the body) — one small piece of shared relay infra instead of
two unrelated ones. If CORS *is* present, no relay is needed for this part at all. Don't
build the relay preemptively; test first.

### 10.4 Tool/function calling

SAIA is described as OpenAI-standard-compatible; if it supports the OpenAI `tools`
parameter (verify at implementation time — not guaranteed just because chat completions is
compatible), expose a small set of read-only JS functions that mirror
`curriculum-agents/tools/conceptbase-mcp`'s tool surface (`conceptbase_search`,
`conceptbase_get_concept`, `conceptbase_get_competency`, `conceptbase_get_concept_lens`,
`conceptbase_list_lpms`, `conceptbase_list_strands`) but implemented directly against
already-available browser-side data (the generated `registry/` JSON + raw GitHub content
via `githubClient.js`), since the real MCP server is a local stdio Python process and is not
reachable from a deployed static page. Same tool names/shapes as the upstream MCP server,
different transport — this keeps agent personas portable without needing a hosted MCP
bridge (which would itself be new backend infra, out of scope here).

## 11. Curriculum Agents integration

`curriculum-agents` already documents itself as **provider-agnostic**, with "Claude Code"
and "a Claude.ai Project's custom instructions" as its two existing reference bindings for
the exact same plain-markdown agent files (`agents/*.md`: YAML frontmatter + a task
description used as a system prompt). This app becomes a **third reference binding** — same
files, same tool contract (§10.4), SAIA/GWDG models instead of Claude.

**Fetch, don't fork:** pull `agents/*.md` bodies live from `curriculum-agents` via
`fetchAbsoluteRawText` (already exists in `githubClient.js`) rather than copying agent
definitions into this repo — they should only ever exist in one place.

**Scope to what's actually implemented upstream today** (per
`curriculum-agents/agents/README.md`): the 7 **individual-mode** agents are implemented and
tested — `conceptbase-navigator` is the most directly relevant starting point for LPMR
review (general lookup/consistency questions), `curriculum-evolutionist` for deeper
evolutionary/interdisciplinary critique. The 6 **institutional-mode** agents
(`analyst`, `comparativist`, `domain-expert`, `equity-auditor`, `synthesis`, `facilitator`)
and all 7 `processes/` (`deliberative`, `sociocratic`, etc.) are **specified but not
implemented** upstream — "enable agent review, deliberation" in this app's v1 must mean
**one agent, one human, one LPMR entity**, producing a single flagged/marked review record
(§8's agent-provenance shape), not a simulated multi-agent debate. Building deliberation
here first would invert the real dependency (`curriculum-agents` → this app, not the other
way around) and duplicate design work already underway in `curriculum-evolution`'s protocol
spec. Multi-agent deliberation in this app is explicitly gated on `curriculum-agents`
landing a working `process/` first (see Phase 5, §15).

**Untested combination, flag it as such in the UI:** these agent personas have only been
validated against Claude models. Running them against SAIA/GWDG models is new territory —
don't present the output with the same confidence as a Claude-run agent until it's been
spot-checked; the UI should visibly say which model actually produced a given review record
(part of the `authoredBy` provenance in §8), not just "AI-generated."

## 12. Cross-linking to other OpenEvo tools

A review/flag/link record (§8) can point at:
- another entity in the *same* LPMR (e.g. "this SubStrand contradicts Strand 3's framing"),
- an entity in a *different* LPMR (cross-repo — e.g. flagging that `bio-core-k12` and
  `oe-interdisciplinary-k12` define "Selection" incompatibly, the same kind of finding the
  [Selection cross-domain case study](selection-cross-domain-case-study.md) surfaced by hand),
- a `conceptbase` alignment record (`OE-ALIGN-######`) or Concept Lens deep link (`?lens=`),
- a `curriculum-agents` artifact (`artifacts/examples/...`, and later `discussions/`/
  `proposals/` once those exist upstream).

All of these are just URLs/IDs on a review record — no new infrastructure needed beyond
what §8 already specifies, as long as the record schema keeps this field generic (a
typed reference, not a hardcoded enum of "which repo").

## 13. Security & privacy

- **Two bearer tokens live in `localStorage`** once this ships: the GitHub token (already
  true today) and the SAIA API key (new). Neither should ever be sent anywhere except their
  respective APIs (`api.github.com`/`raw.githubusercontent.com` and
  `chat-ai.academiccloud.de`) — no analytics, no third relay. Any future relay (§6.1, §10.3)
  must be a dumb pass-through that never logs bodies or persists tokens server-side.
- **Least-privilege OAuth scope**: request only what the current phase's write path actually
  uses (§6.3) — don't request `contents:write` during Phase 1 (sign-in only) just because
  it'll be needed eventually.
- **Agent output must never be visually indistinguishable from human output** — this is a
  correctness *and* trust requirement, not just UX polish (§8, §11).
- **This app never gains write access ConceptBase's own governance wouldn't already allow a
  human contributor** — no code path here bypasses the RFC/sandbox-tier process for
  ConceptBase-level entities (§4 non-goals).
- Content licensing: LPMR content pulled in for display/LLM-context is whatever license that
  LPMR uses (most are CC-BY-NC-SA-4.0, matching `conceptbase` itself, per RFC-0004) — sending
  it to a third-party LLM API is a data-handling decision each LPMR's own governance may want
  visibility into; this should be called out to the user (a one-time notice, not a blocking
  gate) before the first SAIA call each session, not buried in a terms-of-service nobody reads.

## 14. UI/UX shape

Sketch only — real layout work belongs in an actual design pass once §16's open decisions
are resolved, not fully speculated here. Rough shape, assuming shape A (§5) for v1:

- New tab, **"LPMR Manager"**, alongside the existing Explorer tabs.
- Repo picker reuses the existing `loadPanel.js` slot pattern, but for *one* LPMR at a time
  (not the two-slot compare pattern Explorer uses) — this app's job is depth on one
  repository, not side-by-side comparison (that remains Explorer/Concept Lens's job).
- A signed-out visitor sees read-only browsing (identical to today's Explorer, minus
  comment/flag/tag affordances) with a "Sign in with GitHub" prompt gating write actions.
- Per-entity inspector (reuses `inspector.js`) gains a "Reviews" panel: existing
  comments/flags/tags/links on that entity, an add-comment/flag/tag form (visible once
  signed in), and — if a SAIA key is configured — an "Ask an agent" action that lets the
  user pick an available `curriculum-agents` persona and get a draft review record back for
  them to edit/discard/submit (never auto-submitted).
- Visually: OpenEvo dark-glass palette, `#085E65`/`#272D63` accents, consistent with the
  rest of the Explorer and with `eva_buch`'s confirmed palette — no new visual language.

## 15. Phasing

Checkpoint-gated — review each phase with Dustin before starting the next, per this
project's established norm (see `[[project-human-dimensions-initiative]]`-style working
mode already in use elsewhere in this lab).

- **Phase 0 — Spec sign-off + spikes.** Review this document; resolve §16. Two throwaway
  spikes before any real code: (a) does `chat-ai.academiccloud.de` send CORS headers for
  browser `fetch()`, (b) confirm GitHub App Device Flow mechanics end-to-end against a real
  test GitHub App. Neither spike commits to production code.
- **Phase 1 — Sign-in only.** GitHub App + Device Flow (+ relay if needed), session module,
  role resolution via GitHub collaborator-permission API (no `OECB_ROLES.yaml` yet), PAT
  path preserved as fallback. No write scope requested yet.
- **Phase 2 — LPMR Manager v1, human-only.** New tab/app per §5's chosen shape; load any
  OECB-compatible LPMR; comment/flag/tag records per §8 (informal shape, no schema RFC yet);
  export-and-paste write path (§9.1) for everyone, direct-PR creation (§9.2) for users with
  real write access.
- **Phase 3 — Formalize the data model.** `.github/OECB_ROLES.yaml` convention (§7);
  `review.schema.yaml` as an actual `conceptbase` RFC once real usage from Phase 2 informs
  its shape; cross-LPMR/cross-tool linking (§12).
- **Phase 4 — SAIA integration, single-agent review.** Credential store, `/v1/models`
  picker, tool-calling shim mirroring `conceptbase-mcp` (§10.4), fetch-live agent personas
  from `curriculum-agents` (§11), one-agent-one-record review flow with mandatory
  agent-provenance display (§8, §13).
- **Phase 5 — Multi-agent deliberation.** Explicitly gated on `curriculum-agents` shipping
  at least one working `processes/` implementation upstream first — check status before
  assuming this phase is unblocked, don't build it speculatively here.

## 16. Open decisions (need Dustin's input before Phase 1 starts)

1. **App-ecosystem shape (§5):** ship as new tabs in the existing monolith (shape A, fast),
   or invest in a shared-shell/pluggable-apps restructuring now (shape B, matches "flexible
   app ecosystem" literally)? Recommendation: A now, structured so B is a mechanical move
   later — but this is a real architecture call, not a default to just assume.
2. **Non-static relay (§6.1, §10.3):** this ecosystem has been static/backend-free
   end-to-end so far. A stateless CORS relay is small, but it's still the first piece of
   infra that isn't "files in a git repo served by GitHub Pages" — who hosts it, under what
   account/budget, and is that an acceptable first exception to the no-backend principle?
3. **Timing relative to `curriculum-agents`:** its institutional-mode agents and all
   `processes/` are unimplemented upstream today. Should LPMR Manager ship human-review-only
   first (Phases 1–3) and treat SAIA/agent integration (Phases 4–5) as a clearly separate,
   later decision point — or is there appetite to prioritize the AI-review angle sooner,
   accepting more upstream-dependency risk?
4. **GitHub App registration ownership:** a GitHub App needs to be registered under some
   GitHub account/org (presumably `openevo-ccs`) with real settings (callback handling for
   Device Flow, permission scopes). Who does this and when — is it a Phase 0 spike task or
   does it need its own separate sign-off first?

## 17. Revision history

| Date | Change |
|---|---|
| 2026-07-22 | Initial draft, written for review — not yet implemented, not yet RFC'd. |
