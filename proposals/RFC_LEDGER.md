# RFC Number Ledger

Append-only. Claiming a number is: (1) `git pull --ff-only` on `main`, (2) append a line below with
the next free number, (3) commit, (4) **push immediately** — before writing a single word of the
actual RFC. A rejected push means someone else claimed the same number in the same window; pull
and retry with the next number instead of resolving it by hand.

This exists because the old convention (grep the highest number in `proposals/`, add one) raced in
practice: as of 2026-08-24, three numbers were found independently double-claimed by unrelated,
unmerged branches — 0013, 0017, 0018 — discovered only by scanning every local and remote branch,
not just `main`. See `lab_manager/scripts/reserve_proposal_number.py`, which reads/writes this file.

**Claiming a number here does not reserve an ID block** — that is still a separate step in the RFC
itself (see `GOVERNANCE.md`'s Identifier Block Allocation table, or, for vocabularies founded after
2026-08-16, the direct-mint slug scheme that superseded block reservation for `oe:Competency` and
`oe:Concept`).

| Number | Claimed | Topic | Branch/location | Claimed by | Notes |
|---|---|---|---|---|---|
| 0001 | 2026 (pre-session) | sandbox-tier-and-retraction | main | — | |
| 0002 | 2026 (pre-session) | competency-case-profile | main | — | |
| 0003 | 2026 (pre-session) | w3id-namespace-mvp-resolution | main | — | |
| 0004 | 2026 (pre-session) | relicense-content-cc-by-nc-sa | main | — | |
| 0005 | 2026 (pre-session) | citation-only-competency-entries | main | — | |
| 0006 | 2026 (pre-session) | ngss-life-science-vocabulary | main | — | |
| 0007 | 2026 (pre-session) | ai4k12-vocabulary | main | — | |
| 0008 | 2026 (pre-session) | alignment-competency-support | main | — | |
| 0009 | 2026 (pre-session) | context-specific-trajectories | main | — | |
| 0010 | 2026 (pre-session) | sandbox-lpm-forking | main | — | |
| 0011 | 2026-07-22 | teacher-competency-frameworks-and-ccc | `rfc-0011-teacher-competency-frameworks` (unmerged) | — | Unmerged 33+ days at 2026-08-24; licensing on 2 of 3 imported frameworks unconfirmed; ID block collides with 0014/0016 |
| 0012 | 2026 (pre-session) | eva4k12-concept-migration | `rfc-0012-eva4k12-migration` (unmerged) | — | |
| 0013 | 2026 (pre-session) | **COLLISION** — eva4k12-strand-migration | `rfc-0012-eva4k12-migration` (unmerged) | — | Same number as the row below, different branch, different topic — found 2026-08-24 while seeding this ledger |
| 0013 | 2026 (pre-session) | **COLLISION** — openevo-core-kernel-migration | `rfc-0013-openevo-core-kernel-migration` (unmerged) | — | Same number as the row above |
| 0014 | 2026 (pre-session) | evo-ed-assessment-targets-vocabulary | main | — | |
| 0015 | 2026 (pre-session) | competencybase-relocation | main | — | |
| 0016 | 2026-07-31 | computational-thinking-core-competencies | main | — | |
| 0017 | 2026-08-05 | **COLLISION** — critical-ai-literacy-competencies-and-measuredby-field | untracked file, working tree only (never committed) | — | Cited throughout competencybase's real merged `CRITICAL-AI-LITERACY` content despite never being committed anywhere |
| 0017 | 2026 (pre-session) | **COLLISION** — metarepresentation-sandbox-concepts | `rfc-0017-metarepresentation-concepts` (unmerged) | — | Same number as the row above, unrelated topic |
| 0018 | 2026 (pre-session) | framework-relations-and-basiskonzepte-coherence | `rfc-0018-framework-relations-and-basiskonzepte-coherence` (unmerged) | — | RFC-0020 (below) avoided this number after finding the collision risk |
| 0019 | 2026 (pre-session) | lpm-epistemic-status | main | — | |
| 0020 | 2026-08-24 | decentralized-causal-reasoning-competency | `decentralized-causal-reasoning-competency` (unmerged) | lab-manager-b6 | Phase 3 of the four-competency roadmap |
| 0021 | 2026-08-24 | openevo-foundational-competencies-legacy-migration | `openevo-foundational-competencies-migration` (unmerged) | lab-manager-b6 | Phase 4 + 14-node legacy migration |
| 0022 | 2026-08-24T11:46:57Z | evolutionary-causal-reasoning-competency | (claimed, not yet a branch) | lab-manager-b6 | |
