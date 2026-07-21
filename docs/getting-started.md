# Getting started as a dependent-repo developer

This is the walkthrough for the audience the main [README](../README.md)'s Quickstart is too abstract for: someone who wants to build their own Learning Progression Model (LPM), Strand, or Collection repository against OECB, and needs to see the whole pipeline work once, end to end, before starting their own.

It uses the two real reference repos — [`bio-core-k12`](https://github.com/openevo-ccs/bio-core-k12) and [`oe-interdisciplinary-k12`](https://github.com/openevo-ccs/oe-interdisciplinary-k12) — as the worked example throughout, not a synthetic one. Both are early/draft-stage, which is itself useful to see: this is what a real, still-evolving dependent repo looks like, not an idealized final state.

## 0. What you'll need

- A browser (step 1 needs nothing else).
- `git` and Python 3 with `pyyaml` + `jsonschema` (`pip install pyyaml jsonschema referencing`) for steps 3–4.
- No account, API key, or local server — the Explorer is a static app reading the public GitHub API, and the namespace is a public redirect service.

## 1. See the ecosystem live, before reading any code

Open the [ConceptBase Explorer](https://openevo-ccs.github.io/conceptbase/). It auto-loads both reference LPMs on page load — you don't need to configure anything for this first look.

Click the **Concept Lens** tab, then search for "Selection." You'll see:
- `OE-CONCEPT-000213` (`OE-INTERDISCIPLINARY`) — a concept defined four different ways (biology, culture, education, AI).
- Every substrand across both loaded LPMs that references it.
- The alignment records connecting it to `BIO-CORE`'s Natural Selection and to an NGSS performance expectation.

This is the thing OECB is actually for: the same idea, defined independently in different vocabularies, made comparable through explicit, provenance-carrying alignment records rather than hand-waving. The [Selection cross-domain case study](design-notes/selection-cross-domain-case-study.md) is the fully written-up version of exactly what you just clicked through.

## 2. See an identifier resolve

Pick any ID from what you just saw and hit its w3id URL directly:

```
https://www.w3id.org/openevo/concept/OE-CONCEPT-000213
https://www.w3id.org/openevo/competency/OE-COMPETENCY-000150
https://www.w3id.org/openevo/lpm/OE-LPM-000002
```

Every one of these is a real, live redirect — `www.w3id.org/openevo/` was registered in July 2026 ([perma-id/w3id.org#6389](https://github.com/perma-id/w3id.org/pull/6389)). This is the mechanism that makes an ID in your own future LPM permanently citable regardless of where OECB's own hosting lives in five years.

## 3. Look at a real dependent repo

Clone the reference LPM built on the simpler of the two vocabularies:

```bash
git clone https://github.com/openevo-ccs/bio-core-k12
```

Open `lpm.yaml`. Two things matter more than the rest of the file:

```yaml
id: OE-LPM-000001
conceptbase:
  ontology: "OE-ONTOLOGY-v1.0.0"
  vocabularies:
    - "BIO-CORE-v1.0.0"
strands:
  - id: "OE-STRAND-000101"
    repository: "lpms/bio-core-k12/strands/strand-101-variation-inheritance.yaml"
```

`conceptbase:` is the dependency declaration every dependent repo needs — which ontology and vocabulary versions this LPM was actually built and validated against, the same way a `package.json` pins its dependencies. `strands:` only points at IDs and file paths; the full strand content lives in `strands/*.yaml`, validated separately (next step).

Then open `strands/strand-101-variation-inheritance.yaml` and look at one `concepts:` entry:

```yaml
concepts:
  - id: OE-CONCEPT-000108   # Population
    emphasis: primary
```

`emphasis: primary` vs. `reinforcing` is what makes horizontal coherence (the same core concepts recurring across strands, not each strand inventing isolated vocabulary) something a validator can actually check, rather than a claim you have to take on faith.

## 4. Validate it locally

Standard JSON Schema tools (e.g. `check-jsonschema`) currently fail against these schemas with a network-resolution error, because every schema's `$ref` to `common.defs.yaml` resolves against a URL the live namespace doesn't serve yet (a known gap — see `scripts/validate.py`'s docstring for the exact mechanism). Use the repo's own offline validator instead, from a `conceptbase` checkout alongside `bio-core-k12`:

```bash
python scripts/validate.py schemas/lpm.schema.yaml ../bio-core-k12/lpm.yaml
python scripts/validate.py schemas/strand.schema.yaml ../bio-core-k12/strands/*.yaml
```

Both should print `OK` for every file — this is the same command the (still-manual, Phase 4 CI compatibility-checker isn't built yet) review process runs against a real submission.

## 5. Copy a minimal example instead of reverse-engineering a big one

Once you understand the shape, don't start from `bio-core-k12` (23 substrands) or `vocabularies/AI4K12-v1.0.0.yaml` (381 entries) — start from [`examples/`](../examples/): one minimal, heavily-commented instance of each type (`oe:Concept`, `oe:Competency` in both its full-text and citation-only forms, `oe:LPM`, `oe:Strand`, `oe:Alignment`), each validating cleanly against its schema. Copy the one you need and edit it.

## 6. Start your own dependent repo

1. **Decide what you're building** — an LPM (a full progression), a Strand (a standalone piece another LPM can reference), or a new controlled vocabulary of concepts/competencies. Each is a different schema in `schemas/`.
2. **Reserve an ID block** via the RFC process ([`GOVERNANCE.md`](../GOVERNANCE.md)'s Identifier Block Allocation) *before* minting real IDs — this is what keeps two independently authored repos from colliding on the same number. A sandbox-tier ID (`OE-SANDBOX-CONCEPT-######`, RFC-0001) is the lighter-weight option if you're still prototyping and don't want the permanent never-delete guarantee yet.
3. **Pin real `conceptbase:` versions** — the ontology and whichever vocabularies you're building against, exactly like `bio-core-k12/lpm.yaml`.
4. **Validate before you PR** — `scripts/validate.py` against every file you're adding, same as step 4 above.
5. **Register your LPM** by adding an entry to `registry/lpm-index.json` via a PR to this repo, so `w3id.org/openevo/lpm/{your-id}` resolves to your repo the same way `OE-LPM-000001`/`OE-LPM-000002` do.
6. **Anything genuinely new** (a new schema field, a new vocabulary, a new alignment mechanism) goes through the RFC process in [`proposals/`](../proposals/) — see [`GOVERNANCE.md`](../GOVERNANCE.md) and the existing RFCs there for the level of justification expected, especially the "why doesn't an existing standard already cover this" section every RFC requires.

## Where to go deeper

- [`docs/oecb_specifications.md`](oecb_specifications.md) — the full normative spec.
- [`GOVERNANCE.md`](../GOVERNANCE.md) — RFC process, ID block allocation, versioning policy.
- [`docs/design-notes/selection-cross-domain-case-study.md`](design-notes/selection-cross-domain-case-study.md) — what the alignment layer is *for*, worked through on a real cross-domain claim.
- [`docs/design-notes/state-standards-licensing.md`](design-notes/state-standards-licensing.md) — if you're ingesting a real-world standards source (CASE-formatted or not) and need to know whether you can reproduce its text.
