# RFC-0028: Four-space vocabulary mapping and the Interdisciplinary extension

**Type:** `content`
**Status:** `proposed`
**Author(s):** Claude (AI drafting pass), for review by Dustin Eirdosh and by subject-matter editors for biology, culture and social science, computing and cognition.
**Date:** 2026-10-25

**Review state, stated first:** every definition, domain meaning and alignment in this RFC was drafted by AI and checked by a second AI. No subject-matter expert has reviewed any of it. Nothing here is ready to be registered as stable.

## Motivation

OpenLPM holds four synthetic learning progression spaces built to be compared with each other and with actual school curricula (first Sachsen, Germany):

- **Bio-Core**, **Social-Core** and **Computational-Core** are narrow. Each defines its concepts inside one discipline, in that discipline's terms only.
- **Interdisciplinary** defines each relevant concept in a general way that names what the domains share, gives a separate meaning for each domain where a documented process or practice fits, and says what does not carry over from one domain to another (for example whether intention is needed, or whether copies exist).

A comparison across the four spaces cannot use one merged vocabulary, because the spaces differ on exactly the definitions that matter (evolution, information, adaptation, model, agency). A first pilot that tagged Sachsen topics against one merged vocabulary of 64 concepts erased that difference. The work was redone with one vocabulary per space and a crosswalk between them. That raised three problems for ConceptBase:

1. Only two of the 29 Interdisciplinary concepts (Selection and Inheritance) had separate meanings per domain, and 20 concepts that the Core spaces define had no Interdisciplinary counterpart (for example adaptation, population, group, model, algorithm, feedback). Curriculum topics about them could not be described in the Interdisciplinary space.
2. Social-Core and Computational-Core exist only in OpenLPM. ConceptBase holds Bio-Core and Interdisciplinary, so no alignment can name a Social or Computational concept.
3. The national concepts of German school biology, the six KMK Basiskonzepte, appear in ConceptBase only as identifiers inside framework relations (RFC-0018). They are not concepts that an alignment can point to.

## Evidence

Source data and scripts are in the `deutsche_lp` repository, `land/sachsen/lp/data/per-space-tagging/`. All tags are AI-drafted and unaudited. Numbers are for 135 Sachsen Lernbereiche (1,646 Unterrichtsstunden of guidance), two independent AI passes per vocabulary.

- **Reach.** Topics that both passes tagged with a concept of the space: Bio-Core 17, Social-Core 68, Computational-Core 31, Interdisciplinary before the extension 85 (29 concepts), Interdisciplinary after it 100 (46 concepts). Hours attributed to the space: 67, 753, 174, 890 and 1,083.
- **What the extension changed.** The share of each subject's guidance hours that the Interdisciplinary space accounts for rose from 52 to 71 percent in Biologie, from 58 to 92 in Informatik and from 6 to 38 in Geographie. It did not rise in Ethik (50 to 47), where several topics use "normative" in the philosophical sense and "Modell" for worldviews, which the taggers marked as a different sense. Reach is not a quality measure, because a wider vocabulary reaches more by construction.
- **National anchor.** The six KMK Basiskonzepte reach 26 of the 41 Biologie and Sachunterricht topics (22 of 23 Biologie topics, 4 of 18 Sachunterricht topics). Agreement between the two passes was 92 percent. Bio-Core reaches 14 of the 41, all of them also reached by the KMK concepts. Struktur und Funktion (21 topics), Stoff- und Energieumwandlung (6) and Steuerung und Regelung (3) co-occur with Interdisciplinary concepts such as Adaptation, Development, Information and Communication. Neither Bio-Core nor Interdisciplinary defines what structure-function, metabolism or regulation are. These are gaps in both.
- **Agreement within the spaces.** Share of distinct concept-topic pairs that both passes tagged: Bio-Core 75, Social-Core 75, Computational-Core 61, Interdisciplinary 71 percent after the extension (73 before).

## Proposed change

### A. Alignments between Bio-Core and Interdisciplinary (included in this PR)

Eight new alignment records, `OE-ALIGN-000014` to `OE-ALIGN-000021`, status `proposed`. Each is derived from the crosswalk between the spaces and carries the crosswalk rationale and the Sachsen tagging counts. Numbering starts at 14 because the unmerged `rfc-0011-teacher-competency-frameworks` branch uses 6 to 13.

| Record | Bio-Core concept | Match | Interdisciplinary concept |
|---|---|---|---|
| 000014 | Natural Selection | relatedMatch | Evolutionary Process |
| 000015 | Mutation | broadMatch | Innovation |
| 000016 | Selection Pressure | relatedMatch | Niche Construction |
| 000017 | Selection Pressure | relatedMatch | Selection |
| 000018 | Fitness | relatedMatch | Selection |
| 000019 | Inheritance | broadMatch | Transmission |
| 000020 | Mutation | relatedMatch | Variation |
| 000021 | Allele | relatedMatch | Variation |

The crosswalk also judges Interdisciplinary Selection broader than Bio-Core Natural Selection and Interdisciplinary Inheritance broader than Bio-Core Inheritance. `OE-ALIGN-000001` and `OE-ALIGN-000002` record both pairs as `skos:closeMatch`, status `contested`. They are left unchanged. A reviewer may want to add the broader reading to their rationale text.

### B. Extend the Interdisciplinary vocabulary (data attached, registration is a later step)

`proposals/0028-assets/interdisciplinary-extension.json` holds 63 entries, drafted by three AI drafters (67 entries) and checked by three separate AI reviewers who changed 46 of them and dropped 5. Two concepts drafted twice were merged by hand.

- **17 new concepts**, each placed under one of the five organizing concepts: The Evolutionary Pattern (Adaptation, Fitness, Population, Drift, Selection Pressure, Extinction, Descent); Culture and Social Structure (Group, Role, Incentive, Power, Diffusion); Learning, Minds and Discovery (Abstraction, Model); Information, Technology and Collective Systems (Algorithm, Feedback, Search).
- **26 existing concepts** gain proposed domain meanings and a note on what does not carry over between domains. The accepted definition is not changed.
- **12 Core concepts** are recorded as domain meanings of a general concept (for example Mutation under Innovation, Sexual Selection under Selection, Machine Learning under Learning). They get no concept of their own, so no domain ends up with two meanings.
- **8 concepts get no general entry on purpose**, for example Species and Speciation (species concepts conflict even within biology, and reproductive isolation has no counterpart in culture or code), State, and Social Change.

All of it is already loaded in OpenLPM with status `proposed` (OpenLPM migration 185). Registering it here means a new vocabulary version, `OE-INTERDISCIPLINARY-v1.1.0`, with domain meanings stored in `definitions.en.<domain>` as the existing entries do. That step waits for domain-editor review of each entry.

Two drafting findings belong in the record:

- Several machine-facing meanings are labelled `Technical reading`. The label means that computing uses a word that normally describes a mind (knowledge, agent, learning), and it makes no claim that software has a mind.
- The extension touches two live disputes: whether organisms are agents in evolution, and whether trial-and-error learning in one person counts as selection. Both are marked as contested views where they appear.

### C. A vocabulary for the KMK Basiskonzepte Biologie (proposed, a later step)

Register the six Basiskonzepte of the 2024 generation (Struktur und Funktion, Stoff- und Energieumwandlung, Information und Kommunikation, Steuerung und Regelung, Individuelle Entwicklung, Evolutive Entwicklung) as `KMK-BASISKONZEPTE-BIOLOGIE-2024` with minted `OE-CONCEPT-` ids. RFC-0025 leaves the Basiskonzepte to "ConceptBase's existing Basiskonzepte taxonomy", and RFC-0018 already uses the ids `bk_*` under the framework id `kmk-basiskonzepte-biologie-2024`. A registered vocabulary lets alignments point to them. The Sachsen tagging gives a first set of candidate alignments (`kmk-cooccurrence.json`): Evolutive Entwicklung with Adaptation in both Bio-Core and Interdisciplinary, Information und Kommunikation with Information and Communication. The wording of the 2024 resolution would be kept verbatim on the same basis as `kmk-biologie-msa-2024` in RFC-0025. The older 2004 generation (a System umbrella over three levels) stays a separate framework, as RFC-0018 describes.

### D. Register Social-Core and Computational-Core (proposed, a later step)

Both spaces are built in OpenLPM (15 concepts each). Register them as vocabularies with the epistemic status of RFC-0019 (synthetic and not validated) so that alignments to them are possible. The crosswalk has 38 records with a relation: 35 between a Core concept and an Interdisciplinary concept (12 for Social-Core, 12 for Bio-Core, 11 for Computational-Core) and 3 between Cores. The extension adds the counterparts of the 63 new entries (`crosswalk-interdisciplinary-extension.json`). Alignment records for those pairs follow once the vocabularies and the extension are registered.

### E. Gaps to open as sandbox concepts (proposed, a later step)

The tagging and the drafters' reports name concepts that no space defines and that curriculum topics need: structure and function (21 KMK topics), energy and matter transformation (6), regulation beyond feedback (3), classification (Artenkenntnis, identification keys), social learning (used without definition in three drafts), system and emergence, and trust and socialization. Each should enter as a sandbox concept (RFC-0001) with its evidence, so that nobody has to pretend an existing concept covers it.

### F. One correction to an existing relation

OE-INTERDISCIPLINARY lists Development as `skos:broader` of Evolutionary Process and Evolutionary Process as `skos:narrower` of Development. The same narrower list holds Analogical Reasoning, which is not a kind of evolutionary process. The relation works as a topic grouping. Change it to `skos:related`, or keep it and state that it does not mean "is a kind of".

### G. Alignment with AI4K12 (added 2026-10-26)

The project lead asked that Computational-Core and Interdisciplinary align with AI4K12 (held in CompetencyBase) wherever possible, with a narrow computer science focus in Computational-Core and a richer cross-domain focus in Interdisciplinary. One AI drafter per space matched stages and concepts with AI4K12 items of the same grade band, and an independent AI reviewer re-rated every match against the AI4K12 text and the stage's performance indicators. Of 43 stage matches, the reviewers adjusted 18 and dropped 9. The drafts had overrated their own matches. The reviewed result is modest, and this RFC records it as it is.

| | Computational-Core | Interdisciplinary |
|---|---|---|
| Stages with at least one AI4K12 item | 10 of 12 | 13 of 16 |
| Stage matches (strong, partial, weak) | 21 (3, 1, 17) | 13 (0, 2, 11) |
| AI4K12 items inside the focus with no stage | 28 | 29 |

- **Computational-Core gaps.** AI4K12 teaches machine learning, search, neural networks and tree or graph structures from grades 3 to 5. Computational-Core has machine learning and search only in grades 9 to 12 and has no graphs, trees or neural networks. AI4K12 in turn has no items on programs, general algorithms, testing or information theory, so many Computational-Core stages have no AI4K12 counterpart. Extending Computational-Core to cover the AI4K12 gaps would change what the space is, so it is a decision for the project lead and not part of this RFC.
- **Interdisciplinary gaps.** Perception and sensing have no stage. Representation, Abstraction, Search, Algorithm, Feedback and Incentive have no primary stage. AI4K12 has nothing on variation, selection and transmission, so three Interdisciplinary stages match nothing.
- **Alignment records included.** Twenty records, `OE-ALIGN-000022` to `OE-ALIGN-000041`, link ten registered Interdisciplinary concepts (Representation, Learning, Information, Communication, Agency, Knowledge, Technology, Culture, Norms and Institutions) to AI4K12 concept rows, status `proposed`. The AI4K12 side uses the ids that ConceptBase's AI4K12 vocabulary file carries (`OE-COMPETENCY-0002xx`). CompetencyBase holds the same records under readable ids and the two carry the same `humanCodingScheme`. Intuitive Theories and Theory of Mind are sandbox concepts, and the alignment schema's id pattern does not accept a sandbox id as a subject, so they have no record yet. Computational-Core concepts can be aligned once part D registers the space.
- **Data attached.** `ai4k12-alignment-computational-core.json` and `ai4k12-alignment-interdisciplinary.json` hold every stage match with its relation, strength, reason and word-sense note, the concept matches and the gap lists.

## Relations

- RFC-0018 (framework relations): supplies the KMK Basiskonzepte identifiers that part C turns into concepts.
- RFC-0019 (LPM epistemic status): the status Social-Core and Computational-Core would carry.
- RFC-0025 (KMK Bildungsstandards competencies): leaves the Basiskonzepte to this taxonomy.
- RFC-0001 (sandbox tier): the route for the gaps in part E.
- RFC-0008 (alignment support) and `OE-ALIGN-000001` to `000005`: the record shape that part A follows.

## Standards justification

No new structure. Alignments use SKOS match types (`skos:broadMatch`, `skos:relatedMatch`) as `alignment.schema.yaml` defines them. Domain meanings use the existing `definitions.en.<domain>` field. The extension data file is an interchange file for reviewers, and the registered form would be ordinary vocabulary entries.

## ID block reservation

None needed for part A. Parts B to D mint ids under the direct-mint slug scheme for vocabularies founded after 2026-08-16 once the vocabularies are registered, and no block is reserved here.

## Open items before merge

1. A subject-matter editor for each domain (biology, culture and social science, computing, cognition) has to review the entries that touch the domain. The reviewers' main corrections show where to look: overstated claims about animal groups and dominance, a technology meaning of Institutions that was an analogy, and a Knowledge definition that contradicted itself. They were fixed, and the fixes are also AI work.
2. Domain-editor decision on whether the 26 extended concepts should change their stable definitions or keep the proposed wording beside them (the data keeps it beside them).
3. Decision on parts C to F: whether to continue as separate RFCs or inside this one.
4. The Sachsen numbers rest on AI tags that no person has audited. A sample audit decides how much weight they can carry.
5. Reconcile the alignment ids with `rfc-0011-teacher-competency-frameworks` if that branch merges with ids 6 to 13.

## Files affected

- `proposals/0028-four-space-vocabulary-mapping-and-interdisciplinary-extension.md` (this file)
- `proposals/0028-assets/interdisciplinary-extension.json`, `crosswalk-four-spaces.json`, `crosswalk-interdisciplinary-extension.json`, `kmk-cooccurrence.json`, `ai4k12-alignment-computational-core.json`, `ai4k12-alignment-interdisciplinary.json`
- `alignments/OE-ALIGN-000014.yaml` to `OE-ALIGN-000041.yaml`
- `proposals/RFC_LEDGER.md` (branch name in the 0028 row)

## Review

- [ ] Domain editor approval (biology)
- [ ] Domain editor approval (culture and social science)
- [ ] Domain editor approval (computing and AI)
- [ ] Domain editor approval (cognition and education)
- [ ] Maintainer approval
