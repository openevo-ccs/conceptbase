#!/usr/bin/env python3
"""
Checks that every skos:related assertion across all controlled vocabularies
is reciprocated, per SKOS's own symmetric-relation semantics (inherited by
oe:Concept via subClassOf skos:Concept, per ontologies/core_v1.yaml).

Usage:
    python scripts/check_related_symmetry.py [vocabularies/*.yaml ...]

Exits non-zero and prints one line per missing reciprocal link if any
asymmetries are found; otherwise prints a pass message and exits 0.

This is a standalone check, not wired into any CI — the repository does
not yet have a build/validation pipeline (see GOVERNANCE.md, "Tooling").
"""

import sys
import glob
import yaml


def load_concepts(paths):
    concepts = {}
    for path in paths:
        with open(path, "r", encoding="utf-8") as f:
            doc = yaml.safe_load(f)
        for concept in doc.get("concepts", []):
            concepts[concept["id"]] = {
                "label": concept.get("labels", {}).get("en", concept["id"]),
                "vocab": path,
                "related": set(concept.get("relations", {}).get("skos:related", [])),
            }
    return concepts


def find_asymmetries(concepts):
    missing = []
    for source_id, source in concepts.items():
        for target_id in source["related"]:
            target = concepts.get(target_id)
            if target is None:
                missing.append((source_id, target_id, "target concept does not exist"))
                continue
            if source_id not in target["related"]:
                missing.append((source_id, target_id, "not reciprocated"))
    return missing


def main():
    paths = sys.argv[1:] or sorted(glob.glob("vocabularies/*.yaml"))
    if not paths:
        print("No vocabulary files found (pass paths explicitly or run from repo root).")
        return 1

    concepts = load_concepts(paths)
    asymmetries = find_asymmetries(concepts)

    if not asymmetries:
        print(f"OK: skos:related is symmetric across {len(concepts)} concepts in {len(paths)} vocabularies.")
        return 0

    print(f"FAIL: {len(asymmetries)} asymmetric skos:related assertion(s):\n")
    for source_id, target_id, reason in asymmetries:
        source = concepts[source_id]
        print(f"  {source_id} ({source['label']}) --related--> {target_id}  [{reason}]")
    return 1


if __name__ == "__main__":
    sys.exit(main())
