# RFC-0003: MVP resolution scheme for the `www.w3id.org/openevo/` namespace

**Type:** `content`
**Status:** `proposed`
**Author(s):** OpenEvo ConceptBase maintainers
**Date:** 2026-07-19

## Motivation

Spec §4.1 says the canonical namespace `https://www.w3id.org/openevo/` **MUST** be registered with the w3id.org permanent identifier redirection service. It isn't: `https://www.w3id.org/openevo/` currently returns 404. Every IRI minted by this repository — every ontology class, every concept, every schema `$id` — is defined under a namespace that doesn't resolve anywhere yet.

Separately, while investigating this, the one existing candidate redirect target turned out to be broken: `https://openevo-ccs.github.io/conceptbase/` is live, but serves GitHub's default Jekyll-rendered README rather than the `app/` Explorer, because the repository's Pages source is set to "Deploy from a branch" rather than "GitHub Actions" — the custom `.github/workflows/pages.yml` deploy has failed at the `configure-pages@v5` step on its only run (2026-07-18) and has not run successfully since.

Full content-negotiated resolution (JSON-LD/HTML/flat JSON per §4.2) depends on the `registry/` + `build/` pipeline, which is Phase 4 scope and not yet built (per `GOVERNANCE.md`'s "Tooling" section). A w3id.org PR can only redirect to things that already resolve, so registering the namespace at all requires *some* real, minimal resolution target for each §4.2 sub-path first — this RFC proposes that MVP scheme, pulling a thin slice of Phase 4's flat-JSON-index requirement (§5.3.1) forward, the same way RFC-0001 and RFC-0002 already pulled other work forward ahead of its scheduled phase.

## Proposed change

1. **`scripts/build_registry.py`** — a new standalone script (same convention as `scripts/check_related_symmetry.py`) that reads `vocabularies/*.yaml` and `alignments/*.yaml` and generates one flat JSON file per concept/alignment under `registry/`, plus `registry/lpm-index.json` and `registry/strand-index.json` (a small identifier → owning-dependent-repo lookup, mirroring `GOVERNANCE.md`'s existing "Identifier Block Allocation" table). Explicitly flat JSON only — no JSON-LD, RDF, or SHACL; that remains Phase 4.
2. **`app/registry/resolve.html`** — a small static page that resolves `/openevo/lpm/{id}` and `/openevo/strand/{id}` client-side (via the URL fragment, which never reaches the server) against the generated index files, then redirects to the owning dependent repository. Necessary because LPM/Strand content lives outside conceptbase entirely (spec §3 item 5 / README "What's In Scope").
3. **`.github/workflows/pages.yml`** — updated to assemble a combined site from `app/` and the generated `registry/` before upload, and to trigger on changes to `registry/**` too, so both the Explorer and the registry are served from the same GitHub Pages origin.
4. **`w3id-submission/openevo/.htaccess` + `readme.md`** — drafted, not yet submitted, implementing the sub-path → MVP-target mapping documented in spec §4.2's new "MVP resolution note." Every rule is pattern-based (e.g. `^concept/([A-Za-z0-9\-]+)$`), not one rule per identifier, so this file should not need to change again as new concepts/vocabularies/LPMs are added.
5. **`docs/oecb_specifications.md` §4.2** — added the "MVP resolution note" documenting the interim flat-JSON/raw-YAML behavior explicitly, so the spec doesn't overstate current capability the way earlier drafts did.

Two manual, non-code prerequisites this RFC depends on but doesn't itself resolve:
- Fixing the repository's GitHub Pages source setting (Settings → Pages → Source → "GitHub Actions") so `pages.yml` can succeed.
- Actually forking `perma-id/w3id.org` and opening the registration PR using the drafted files — a third-party, externally visible action outside this repository's own governance.

## Relations

- Amends spec §4.2 (adds the MVP resolution note; does not change §4.1's namespace or §4.3's identifier patterns).
- Does not modify `ontologies/core_v1.yaml` or any schema.
- `registry/lpm-index.json` is a machine-readable restatement of `GOVERNANCE.md`'s existing "Identifier Block Allocation" table and `app/js/config.js`'s `DEFAULT_SLOTS` — no new identifier-ownership decisions are made here, only reuse of ones already on record.

## Standards justification

Not a novel data structure — `registry/*.json` files are direct JSON serializations of the same vocabulary/alignment YAML already governed under §7/§9; the `.htaccess` follows w3id.org's own established contribution convention (verified against `perma-id/w3id.org`'s `ARK/` example: `.htaccess` for rules, `readme.md` for humans, pattern-based `RewriteRule`s).

## ID block reservation

Not applicable — no new vocabulary or LPM.

## Files affected

| File | Change | Status |
|---|---|---|
| `scripts/build_registry.py` | New | Done, 2026-07-19 |
| `registry/concept/*.json`, `registry/alignment/*.json`, `registry/lpm-index.json`, `registry/strand-index.json` | New (generated) | Done, 2026-07-19 |
| `app/registry/resolve.html` | New | Done, 2026-07-19 |
| `.github/workflows/pages.yml` | Assemble `app/` + `registry/` into one deploy; added `registry/**` to trigger paths | Done, 2026-07-19 |
| `w3id-submission/openevo/.htaccess`, `readme.md` | New, staged for external PR | Done, 2026-07-19 — **not yet submitted upstream** |
| `docs/oecb_specifications.md` §4.2, front matter, Appendix C | MVP resolution note; version 0.3.0 → 0.3.1 | Done, 2026-07-19 |
| `README.md` | Namespace-status badge, corrected Quickstart resolution examples, repository structure tree, roadmap | Done, 2026-07-19 |
| GitHub repo Settings → Pages | Source: "Deploy from a branch" → "GitHub Actions" | **Not done — manual step, outside this RFC's file scope** |
| PR to `perma-id/w3id.org` | Register `/openevo/` | **Not done — external submission, outside this RFC's file scope** |

## Review

- [ ] Domain editor approval
- [ ] Maintainer approval
