#!/usr/bin/env python3
"""RFC-0023: transform openevo-graph's 9 Content Anchor nodes into
vocabularies/OPENEVO-CONTENT-ANCHORS-v1.0.0.yaml.

Source: ../openevo-graph/nodes/content_anchors.json

Only the governed subset migrates: label, a synthesized definition (from
`coreIdea`), the grade-band progression (-> extensions["oe:developmentalArc"]),
and sibling-anchor relations (-> skos:related). Fields with no ConceptBase
schema home that stay local to openevo-graph's own generated mirror
(discipline, subjectAreas, tags, caseLinks, lessonIdeas, graph x/y
coordinates) are deliberately NOT ported here -- see RFC-0023 "Proposed
change" for why (the CASE crosswalk in particular has its own upstreaming
path via conceptbase/alignments/, not this vocabulary).

Run from the conceptbase repo root: python scripts/migrate_content_anchors.py
"""
import json
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parent.parent
SOURCE_PATH = REPO_ROOT.parent / "openevo-graph" / "nodes" / "content_anchors.json"
OUT_PATH = REPO_ROOT / "vocabularies" / "OPENEVO-CONTENT-ANCHORS-v1.0.0.yaml"

VOCAB_SLUG = "openevo-content-anchors"


def load_source():
    with open(SOURCE_PATH, encoding="utf-8") as f:
        return json.load(f)


def symmetrize(nodes: list) -> dict:
    """openevo-graph's `relatedAnchors` is each node's own curated top-3
    "most related" list, not a symmetric relation -- ConceptBase's
    skos:related convention requires symmetry (enforced by
    scripts/check_related_symmetry.py). Union each pair's edge in both
    directions rather than silently dropping the asymmetric half."""
    related = {n["id"]: set(n.get("relatedAnchors", [])) for n in nodes}
    for src, targets in list(related.items()):
        for tgt in targets:
            related.setdefault(tgt, set()).add(src)
    return related


def build_entry(node: dict, related_by_id: dict) -> dict:
    concept_id = f"OE-CONCEPT-{VOCAB_SLUG}-{node['id']}"
    entry = {
        "id": concept_id,
        "type": "oe:Concept",
        "status": "proposed",
        "version": "1.0.0",
        "definedInVocabulary": "OPENEVO-CONTENT-ANCHORS-v1.0.0",
        "labels": {"en": node["label"]},
        "definitions": {"en": {"general": node["coreIdea"].strip()}},
    }
    related = sorted(related_by_id.get(node["id"], set()))
    if related:
        entry["relations"] = {
            "skos:related": [
                f"OE-CONCEPT-{VOCAB_SLUG}-{r}" for r in related
            ]
        }
    entry["extensions"] = {
        "oe:conceptRole": "content-anchor",
        "oe:openevoGraphSourceId": node["id"],
        "oe:developmentalArc": node.get("gradeProgression", {}),
    }
    return entry


def main():
    source = load_source()
    related_by_id = symmetrize(source["nodes"])
    entries = [build_entry(n, related_by_id) for n in source["nodes"]]

    doc = {
        "meta": {
            "id": "OPENEVO-CONTENT-ANCHORS",
            "version": "1.0.0",
            "status": "proposed",
            "scope": (
                "OpenEvo's own 9-anchor design-concept vocabulary -- the "
                "foundational disciplinary content structures around which "
                "OpenEvo curriculum design is organised. Migrated from "
                "openevo-graph/nodes/content_anchors.json (RFC-0023); that "
                "repo's copy becomes a generated mirror of this vocabulary "
                "once accepted, retaining the fuller field set (discipline, "
                "subjectAreas, tags, CASE crosswalk links, graph layout) "
                "this vocabulary deliberately does not duplicate."
            ),
            "discipline": "cross-disciplinary",
            "license": "CC-BY-NC-SA-4.0",
            "authors": [{"name": "OpenEvo ConceptBase Maintainers"}],
            "conformsTo": "OE-SCHEMA-CONCEPT-v1.0.0",
            "phase": 1,
        },
        "concepts": entries,
    }

    header = (
        "# ============================================================================\n"
        "# OpenEvo ConceptBase — Controlled Vocabulary: OPENEVO-CONTENT-ANCHORS\n"
        "# ============================================================================\n"
        "# Path: /vocabularies/OPENEVO-CONTENT-ANCHORS-v1.0.0.yaml\n"
        "#\n"
        "# OpenEvo's own 9 Content Anchors (RFC-0023), generated from\n"
        "# openevo-graph/nodes/content_anchors.json by\n"
        "# scripts/migrate_content_anchors.py -- do not hand-edit the migrated\n"
        "# fields (id/labels/definitions/relations/extensions) without also\n"
        "# updating the source or this script; hand-authored additions belong\n"
        "# in a field the script does not touch.\n"
        "# ============================================================================\n\n"
    )

    with open(OUT_PATH, "w", encoding="utf-8") as f:
        f.write(header)
        yaml.dump(
            doc,
            f,
            sort_keys=False,
            allow_unicode=True,
            width=100,
            default_flow_style=False,
        )

    print(f"Wrote {len(entries)} concepts to {OUT_PATH}")


if __name__ == "__main__":
    main()
