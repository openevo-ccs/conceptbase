# Examples

Minimal, single-entry, heavily-commented instances of each `oe:*` type — the copy-paste starting point the main [README](../README.md) has long flagged as missing (`examples/` "planned but not yet present").

These are **illustrative only, not registered**: every ID here (`OE-CONCEPT-000900`, `OE-LPM-000900`, etc.) uses a block explicitly outside any block reserved in [`GOVERNANCE.md`](../GOVERNANCE.md)'s Identifier Block Allocation tables (all real blocks so far sit in `000100`–`000699`), and none of these files are wired into `registry/` or `vocabularies/*.yaml`. None of these IDs resolve at `w3id.org/openevo/`. If you're starting your own vocabulary or LPM, copy the shape, then reserve your own block via the RFC process (see [`GOVERNANCE.md`](../GOVERNANCE.md)) before minting real IDs.

Compare these against the real, much larger worked examples in [`vocabularies/`](../vocabularies/), [`alignments/`](../alignments/), and the two reference LPMs ([`bio-core-k12`](https://github.com/openevo-ccs/bio-core-k12), [`oe-interdisciplinary-k12`](https://github.com/openevo-ccs/oe-interdisciplinary-k12)) once you're past the "what shape is this file" stage — see [`docs/getting-started.md`](../docs/getting-started.md) for a guided walkthrough using those real repos end to end.

| File | Validates against | Notes |
|---|---|---|
| [`concept.example.yaml`](concept.example.yaml) | `schemas/concept.schema.yaml` | A single `oe:Concept` entry, the kind authored inside a `vocabularies/*.yaml` file's `concepts:` list. |
| [`competency.example.yaml`](competency.example.yaml) | `schemas/competency.schema.yaml` | A single `oe:Competency` entry with full `statement` text (the common case — see RFC-0002). |
| [`competency-citationonly.example.yaml`](competency-citationonly.example.yaml) | `schemas/competency.schema.yaml` | The RFC-0005 variant: source license forbids reproducing statement text, so `humanCodingScheme` + `provenance` anchor the entry instead. |
| [`lpm.example.yaml`](lpm.example.yaml) | `schemas/lpm.schema.yaml` | A minimal one-strand LPM manifest, the `conceptbase:` dependency-declaration pattern every dependent repo's root file follows. |
| [`strand.example.yaml`](strand.example.yaml) | `schemas/strand.schema.yaml` | A single `oe:Strand` with one nested `oe:SubStrand`, referencing `concept.example.yaml`'s concept. |
| [`alignment.example.yaml`](alignment.example.yaml) | `schemas/alignment.schema.yaml` | A Phase 2 cross-vocabulary alignment record connecting the example concept to the example competency. |

## Validating these files

```bash
python scripts/validate.py schemas/concept.schema.yaml examples/concept.example.yaml
python scripts/validate.py schemas/competency.schema.yaml examples/competency.example.yaml examples/competency-citationonly.example.yaml
python scripts/validate.py schemas/lpm.schema.yaml examples/lpm.example.yaml
python scripts/validate.py schemas/strand.schema.yaml examples/strand.example.yaml
python scripts/validate.py schemas/alignment.schema.yaml examples/alignment.example.yaml
```

`scripts/validate.py` resolves each schema's `common.defs.yaml` reference from disk — see that script's docstring for why a plain `check-jsonschema` invocation currently fails with a network-resolution error instead.
