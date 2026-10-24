# RFC-0027: `competencybase` `pedagogicalApproaches` field

**Type:** `schema`

**Status:** `proposed`
**Author(s):** Claude (OpenLPM design session), for review by Dustin Eirdosh
**Date:** 2026-10-24

## Motivation

Real feedback from Susan Hanisch (Uni Jena, Biologiedidaktik), submitted via OpenLPM's in-app
feedback widget on 2026-10-23 while browsing the admin Base Repo Explorer's CompetencyBase table:
"add a column on pedagogical approaches."

CompetencyBase has no field connecting a competency record to a specific teaching method.
`measuredBy` (RFC-0017) points at MethodsBase `research-method` records that *assess* a
competency — the opposite direction. MethodsBase's own `learningApproaches` field (e.g.
`forschend`, `handlungsorientiert`) is a style tag on a method record, not a link a competency
record can point out from. Nothing today lets a curator say "this competency is well taught using
these specific real methods."

## Proposed change

One new **optional** top-level property on `competency-record.schema.json`, backward-compatible
with all existing records:

- **`pedagogicalApproaches`**: array of strings, pattern `^OE-METHOD-[a-z0-9-]+$` — mirrors
  `measuredBy`'s exact shape. Not schema-enforced to only reference `methodClass:
  pedagogical-practice` records (a `research-method` record can sometimes double as a teaching
  activity); curators should prefer a real pedagogical-practice record where one fits.

No existing property changes meaning or requiredness. `additionalProperties: false` stays in
place. `main`'s existing 502 records validate unchanged (`python scripts/validate.py`, 0 issues).

## OpenLPM integration

No new UI mechanism needed. OpenLPM's Base Repo Explorer already generically resolves any
relation field listed in a repo's `relationFields` config to its target's real label (the same
path `methodsbase`'s own `relatedApproaches` and this RFC's sibling, `competencybase`'s `broader`,
already use) — adding `{ field: 'pedagogicalApproaches', targetRepo: 'methodsbase' }` to
`competencybase`'s entry is the only change needed there, and it surfaces in both the detail
panel's field dump and the Graph view, for free.

## Worked example

Not populated on any record in this PR — schema-only, so the diff stays reviewable on its own. A
real, topic-matched worked example (4 records from the still-open `kmk-biologie-bildungsstandards`
vocabulary PR — companion [openevo-ccs/competencybase#3](https://github.com/openevo-ccs/competencybase/pull/3)
— each linked to MethodsBase methods that actually fit their stated topic focus, e.g. the
"multiperspektivische Beurteilung von Sachverhalten" sub-area linked to Fishbowl Discussion and
World Café, both real multi-perspective discussion formats) is added as a follow-up commit
directly to that PR, since that's where the motivating content lives and where Susan will see it
during her own review. Deliberately not invented against an unrelated vocabulary just to populate
the field — a true link beats a demonstration link, same precedent RFC-0017 set for `measuredBy`.

## Companion PR

[openevo-ccs/competencybase#(pending)](https://github.com/openevo-ccs/competencybase) —
`rfc-0027-pedagogical-approaches-competency-linking` branch, schema-only.
