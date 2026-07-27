# RFC-0015: Relocate `oe:Competency`'s canonical home to CompetencyBase

**Type:** `specification-amendment` (resolution mechanism) + `content` (data migration)

**Status:** `proposed`
**Author(s):** OpenEvo ConceptBase maintainers
**Date:** 2026-07-27

## Motivation

`oe:Competency` was promoted as a ConceptBase class by RFC-0002, and every
competency vocabulary since (`NGSS-LIFE-SCIENCE`, RFC-0006; `AI4K12`,
RFC-0007; `DigCompEdu`/`UNESCO-AI-CFT`/`KMK-DIGITALE-WELT`/`CCC`, RFC-0011;
`EVO-ED-ASSESSMENT-TARGETS`, RFC-0014) has been authored directly inside
this repo's `vocabularies/`, resolved through ConceptBase's own internal
flat-JSON registry. This was never the intended end state:
`ecosystem-base-graph-project-architecture-and-ontology-plan.md` (§3.1,
§9.7) designates CompetencyBase as `oe:Competency`'s **eventual singular,
canonical, base-repo home** — the same base/graph/project layering every
other entity type (concepts, theories, literature, people) already
follows — with `competencybase`'s own README and provisional schema
explicitly built to receive this migration, and explicitly flagged as
"not yet canonical" pending this exact RFC. §15 of that plan records
progress as "Not started — plan only" as of its writing.

Concretely, `competencybase` today holds exactly 2 illustrative
placeholder records (`competency:ccc-domain-a-curriculum-interpretation`,
`competency:evo-ed-assessment-targets-nature-of-science`), both carrying
a `provisional.blocked_on` note naming this RFC by number. This RFC
resolves that block for the frameworks that are actually real today.

## Proposed change

1. **Resolution mechanism.** `oe:Competency` resolution moves from
   ConceptBase's internal registry to CompetencyBase's redirect-to-owning-
   repo pattern (`/lpm/{id}`), per `GOVERNANCE.md`'s updated Competency ID
   blocks section (this RFC). **Id-minting and block reservation stay in
   this repo's `GOVERNANCE.md`** — that's an allocation concern independent
   of where content resolves, and keeping one collision-free registry
   avoids forking that responsibility.
2. **Real (non-provisional) CompetencyBase schema.** Replaces the
   placeholder `competency:<slug>`-id schema with one keyed on the real,
   permanent `OE-COMPETENCY-######` id ConceptBase already minted —
   existing ids are preserved verbatim, not renumbered.
3. **Data migration, scoped to what's real today.** Every entry from the
   two frameworks already merged to this repo's `main`
   (`NGSS-LIFE-SCIENCE`, 53 entries; `AI4K12`, 381 entries) plus
   `EVO-ED-ASSESSMENT-TARGETS` (RFC-0014, 21 entries, migrated alongside
   its own RFC review since both are landing together) — 455 records
   total — becomes a real file in `competencybase/records/`.
   **`DigCompEdu`/`UNESCO-AI-CFT`/`KMK-DIGITALE-WELT`/`CCC` (RFC-0011) are
   explicitly out of scope for this RFC** — that branch is still
   unmerged, in-flight, separately owned work; migrating provisional
   content now would mean migrating it twice. Its own migration is a
   natural follow-up once RFC-0011 itself lands.
4. **`vocabularies/*.yaml` files are retained, not deleted.** They remain
   the historical authoring source for each framework — CompetencyBase
   becomes canonical for the *resolved record*, not a replacement for how
   new competency content gets authored/reviewed here.

## Relations

- Depends on: RFC-0002 (`oe:Competency` promotion), RFC-0006
  (`NGSS-LIFE-SCIENCE`), RFC-0007 (`AI4K12`).
- Complements RFC-0014 (`EVO-ED-ASSESSMENT-TARGETS`) — both land together;
  RFC-0014 remains the record of that vocabulary's own review status
  (`proposed`, licensing sign-off outstanding), carried over faithfully
  into its migrated CompetencyBase records rather than silently upgraded.
- Follow-up (not part of this RFC): migrate RFC-0011's four frameworks
  once that branch merges.

## Status carry-over, faithfully

Every ConceptBase vocabulary entry currently carries `status: proposed`
at the individual-entry level (including `NGSS-LIFE-SCIENCE` and `AI4K12`,
despite both vocabularies being merged to `main`) — this RFC does **not**
promote any entry to `accepted` as a side effect of migration; each
migrated record's `status` and a faithfully-derived `provenance.review_status`
are carried over as-is. `NGSS-LIFE-SCIENCE`/`AI4K12` entries get
`review_status: community-reviewed` (they cleared an actual RFC +
maintainer-approval merge); `EVO-ED-ASSESSMENT-TARGETS` entries get
`review_status: author-draft` (RFC-0014 itself is still unreviewed,
licensing sign-off outstanding).

## Files affected

| File | Change |
|---|---|
| `GOVERNANCE.md` | Relocation/resolution-mechanism note added to Competency ID blocks section |
| `competencybase/schema/competency-record.schema.json` | Replaced: real `OE-COMPETENCY-######`-keyed schema, `provisional` block dropped |
| `competencybase/records/*.yaml` | 455 new real records (`NGSS-LIFE-SCIENCE`, `AI4K12`, `EVO-ED-ASSESSMENT-TARGETS`) |
| `competencybase/records/evo-ed-assessment-targets-nature-of-science.yaml` | Removed — superseded by its real migrated record (`OE-COMPETENCY-000700`), same id, would otherwise duplicate |
| `competencybase/records/ccc-domain-a-curriculum-interpretation.yaml` | Untouched — CCC isn't in scope for this RFC (RFC-0011 unmerged) |
| `competencybase/README.md` | Updated to reflect real canonical content for the 3 migrated frameworks |

## Review

- [x] **Maintainer approval** (Dustin Eirdosh, 2026-07-27) — full RFC review signed off
- [x] **Domain editor approval** — not required for this merge: per `GOVERNANCE.md`'s RFC
      Process, merging `proposed`-status entries needs only one maintainer approval;
      domain editor sign-off applies at the later `proposed → accepted` transition
- [ ] Confirm `NGSS-LIFE-SCIENCE`/`AI4K12`'s `status: proposed` (despite
      being merged) isn't itself a separate, pre-existing gap worth its
      own follow-up RFC — **deferred** (Dustin Eirdosh, 2026-07-27): "we will handle the others soon"
