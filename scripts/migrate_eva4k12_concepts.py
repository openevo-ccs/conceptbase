#!/usr/bin/env python3
"""RFC-0012: transform eva4k12's 13 core concepts + 6 cross-cutting themes
into vocabularies/EVA4K12-CONCEPTS-v1.0.0.yaml.

Source: ../eva4k12/framework/eva4k12_v1_2/eva4K12_concepts.json,
        ../eva4k12/framework/eva4k12_v1_2/eva4K12_cct.json

Three source concepts (Evolution, Adaptation, Agency) duplicate existing
BIO-CORE/OE-INTERDISCIPLINARY entries and are deliberately NOT emitted here
-- see RFC-0012 "Proposed change". Their developmental-arc content is
printed at the end so it can be hand-merged into the existing entries'
extensions, rather than auto-patched (those files are hand-authored and
reviewed; a blind script patch risks corrupting content around it).

Run from the conceptbase repo root: python scripts/migrate_eva4k12_concepts.py
"""
import json
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parent.parent
EVA4K12_DIR = REPO_ROOT.parent / "eva4k12" / "framework" / "eva4k12_v1_2"
OUT_PATH = REPO_ROOT / "vocabularies" / "EVA4K12-CONCEPTS-v1.0.0.yaml"

REUSE_EXISTING = {
    "Evolution": "OE-CONCEPT-000101",
    "Adaptation": "OE-CONCEPT-000104",
    "Agency": "OE-CONCEPT-000211",
}


def load(name):
    with open(EVA4K12_DIR / name, encoding="utf-8") as f:
        return json.load(f)


def uri_to_label(uri: str) -> str:
    return uri.rstrip("/").rsplit("/", 1)[-1]


def build_concept_entry(c: dict, next_id: int) -> dict:
    label = c["prefLabel"]["en"]
    entry = {
        "id": f"OE-CONCEPT-{next_id:06d}",
        "type": "oe:Concept",
        "status": "proposed",
        "version": "1.0.0",
        "definedInVocabulary": "EVA4K12-CONCEPTS-v1.0.0",
        "labels": {"en": label},
        "definitions": {"en": {"general": c["definition"]["en"].strip()}},
    }
    if c.get("altLabel", {}).get("en"):
        entry["aliases"] = {"en": c["altLabel"]["en"]}

    relations = {}
    if c.get("skos:broader"):
        relations["skos:broader"] = [
            _resolve_related_id(c["skos:broader"])
        ]
    if c.get("skos:related"):
        relations["skos:related"] = [
            _resolve_related_id(r) for r in c["skos:related"]
        ]
    if relations:
        entry["relations"] = relations

    citations = []
    for lit in c.get("eva4k12:provenance", {}).get("literatureCitations", []):
        text = f"{lit['author']} ({lit['year']}). {lit['title']}. {lit['source']}."
        citation = {"text": text}
        if lit.get("openAlexURI"):
            citation["url"] = lit["openAlexURI"]
        citations.append(citation)
    if citations:
        entry["citations"] = citations

    ext = {
        "oe:eva4k12SourceURI": c["uri"],
        "oe:developmentalArc": c.get("eva4k12:developmentalArc", {}),
        "oe:accessibleInstantiations": c.get("accessibleInstantiations", []),
        "oe:scopeNote": c.get("scopeNote", {}).get("en", ""),
    }
    entry["extensions"] = ext
    return entry


def build_cct_entry(cct: dict, next_id: int) -> dict:
    entry = {
        "id": f"OE-CONCEPT-{next_id:06d}",
        "type": "oe:Concept",
        "status": "proposed",
        "version": "1.0.0",
        "definedInVocabulary": "EVA4K12-CONCEPTS-v1.0.0",
        "labels": {"en": cct["title"]},
        "definitions": {"en": {"general": cct["shortDescription"].strip()}},
    }
    ext = {
        "oe:conceptRole": "cross-cutting-theme",
        "oe:eva4k12SourceURI": cct["uri"],
        "oe:humanCodableIdentifier": cct["humanCodableIdentifier"],
        "oe:fullStatement": cct.get("fullStatement", ""),
        "oe:strandActivation": cct.get("strandActivation", []),
    }
    if cct.get("sensitiveTopicFlags"):
        ext["oe:sensitiveTopicFlags"] = cct["sensitiveTopicFlags"]
    if cct.get("sensitiveTopicNote"):
        ext["oe:sensitiveTopicNote"] = cct["sensitiveTopicNote"]
    entry["extensions"] = ext

    related = [
        _resolve_related_id(cc["conceptURI"])
        for cc in cct.get("coreConcepts", [])
    ]
    if related:
        entry["relations"] = {"skos:related": related}
    return entry


_id_by_label = {}  # populated during the main pass, used to resolve skos:related targets


def _resolve_related_id(uri_or_label: str) -> str:
    label = uri_to_label(uri_or_label) if uri_or_label.startswith("http") else uri_or_label
    return _id_by_label.get(label, label)  # falls back to the raw slug if unresolved


def main():
    concepts_doc = load("eva4K12_concepts.json")
    cct_doc = load("eva4K12_cct.json")

    concepts = concepts_doc["concepts"]
    ccts = cct_doc["crossCuttingThemes"]

    # First pass: assign IDs and record label->ID for relation resolution.
    next_id = 300
    reused_notes = []
    new_concepts = []
    for c in concepts:
        label = c["prefLabel"]["en"]
        if label in REUSE_EXISTING:
            _id_by_label[uri_to_label(c["uri"])] = REUSE_EXISTING[label]
            reused_notes.append((label, REUSE_EXISTING[label], c))
            continue
        cid = f"OE-CONCEPT-{next_id:06d}"
        _id_by_label[uri_to_label(c["uri"])] = cid
        new_concepts.append((next_id, c))
        next_id += 1

    cct_start = next_id
    for cct in ccts:
        _id_by_label[uri_to_label(cct["uri"])] = f"OE-CONCEPT-{next_id:06d}"
        next_id += 1

    # Second pass: build entries now that all IDs are known (for relation resolution).
    entries = [build_concept_entry(c, cid) for cid, c in new_concepts]
    entries += [
        build_cct_entry(cct, cct_start + i) for i, cct in enumerate(ccts)
    ]

    # skos:related must be symmetric (scripts/check_related_symmetry.py) --
    # add missing back-edges. Within this vocabulary's own new entries that's
    # enough; edges pointing at reused external IDs (Evolution/Adaptation/
    # Agency) can't be fixed here since those entries live in other files --
    # printed at the end so the reciprocal edge can be added there by hand.
    by_id = {e["id"]: e for e in entries}
    external_reciprocals_needed = []
    for e in entries:
        for target in e.get("relations", {}).get("skos:related", []):
            if target in by_id:
                back = by_id[target].setdefault("relations", {}).setdefault("skos:related", [])
                if e["id"] not in back:
                    back.append(e["id"])
            elif target in REUSE_EXISTING.values():
                external_reciprocals_needed.append((target, e["id"]))

    header = f"""\
# ============================================================================
# OpenEvo ConceptBase -- Controlled Vocabulary: EVA4K12-CONCEPTS
# ============================================================================
# Path: /vocabularies/EVA4K12-CONCEPTS-v1.0.0.yaml
#
# Migrated from the eva4k12 repository (now archived -- see
# lab_manager/docs/design-notes/eva4k12-consolidation-and-grant-poc-strategy.md)
# per RFC-0012. 13 "compression concepts" and 6 cross-cutting themes forming
# eva4k12's K-12 evolutionary-anthropology coherence spine. Generated by
# scripts/migrate_eva4k12_concepts.py from eva4k12's source JSON -- do not
# hand-edit the developmental-arc/citation content without also updating the
# source repo's own archived copy for provenance consistency.
#
# Three source concepts (Evolution, Adaptation, Agency) are NOT re-minted
# here -- they duplicate OE-CONCEPT-000101, OE-CONCEPT-000104, and
# OE-CONCEPT-000211 respectively. See RFC-0012.
#
# Cross-cutting themes are tagged via extensions["oe:conceptRole"] =
# "cross-cutting-theme" rather than a new ontology type -- see RFC-0012
# "Standards justification".
# ============================================================================

meta:
  id: EVA4K12-CONCEPTS
  version: 1.0.0
  status: proposed
  scope: >
    10 core "compression concepts" (Pattern, Structure, Relationship,
    System, Information, Representation, Argument, Perspective, Scale,
    Feedback) and 6 cross-cutting themes migrated from eva4k12, forming a
    K-12 evolutionary-anthropology curriculum's vertical/horizontal
    coherence spine. Disaffiliation note (carried forward from eva4k12's
    own metadata): this content uses evolutionary anthropology research as
    seed material and does not represent, speak for, or claim endorsement
    from any research institution.
  discipline: interdisciplinary
  license: CC-BY-NC-SA-4.0
  authors:
    - name: OpenEvo ConceptBase Maintainers
    - name: Dustin Eirdosh
    - name: Susan Hanisch
  conformsTo: OE-SCHEMA-CONCEPT-v1.2.0
  phase: 1

concepts:
"""

    body = yaml.safe_dump(
        entries, sort_keys=False, allow_unicode=True, width=88
    )
    # Indent the flat list under `concepts:` at 2 spaces, list markers at 2 spaces too,
    # matching this repo's existing vocabulary file indentation convention.
    indented = "\n".join(
        ("  " + line if line.strip() else line) for line in body.splitlines()
    )

    OUT_PATH.write_text(header + indented + "\n", encoding="utf-8")
    print(f"Wrote {OUT_PATH} ({len(entries)} entries: "
          f"{len(new_concepts)} concepts + {len(ccts)} cross-cutting themes)")

    print("\n--- Reused existing IDs (NOT emitted as new entries) ---")
    for label, existing_id, c in reused_notes:
        print(f"\n{label} -> {existing_id}")
        print("  extensions['oe:developmentalArc'] to merge:")
        print(f"  {json.dumps(c.get('eva4k12:developmentalArc', {}), indent=2)[:300]}...")

    if external_reciprocals_needed:
        print("\n--- Reciprocal skos:related edges needed on external entries ---")
        for target, source in sorted(set(external_reciprocals_needed)):
            print(f"  {target}: add {source!r} to relations.skos:related")


if __name__ == "__main__":
    main()
