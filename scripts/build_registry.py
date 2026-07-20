#!/usr/bin/env python3
"""
Generates the MVP flat-JSON resolution registry consumed by the w3id.org
namespace redirects (see /w3id-submission/openevo/.htaccess).

This is NOT the Phase 4 build/validation pipeline (spec Sec5.2/Sec13) - no
JSON-LD, no RDF, no SHACL, no content negotiation. It is the smallest slice
of Phase 4's Sec5.3.1 "flat JSON index" pulled forward so that
www.w3id.org/openevo/concept/{id} etc. have something real to redirect to,
the same way RFC-0001/0002 pulled other Phase 2/4 work forward early.

Reads:
    vocabularies/*.yaml   -> registry/concept/{id}.json      (one per oe:Concept)
    vocabularies/*.yaml   -> registry/competency/{id}.json   (one per oe:Competency, RFC-0008)
    alignments/*.yaml     -> registry/alignment/{id}.json    (one per record)
    (hand-maintained, mirrors GOVERNANCE.md "Identifier Block Allocation")
                          -> registry/lpm-index.json
                          -> registry/strand-index.json

Output is committed to the repo and published as-is via the existing
GitHub Pages deploy (app/js .htaccess rules point at
https://openevo-ccs.github.io/conceptbase/registry/...).

Usage:
    python scripts/build_registry.py
"""

import glob
import json
import os
import sys

import yaml

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REGISTRY_DIR = os.path.join(REPO_ROOT, "registry")

# Mirrors GOVERNANCE.md's "Identifier Block Allocation" tables. Update this
# alongside that file's tables until Phase 4 tooling derives one from the
# other automatically.
LPM_INDEX = {
    "OE-LPM-000001": {
        "owner": "openevo-ccs",
        "repo": "bio-core-k12",
        "ref": "main",
        "vocabulary": "BIO-CORE-v1.0.0",
    },
    "OE-LPM-000002": {
        "owner": "openevo-ccs",
        "repo": "oe-interdisciplinary-k12",
        "ref": "main",
        "vocabulary": "OE-INTERDISCIPLINARY-v1.0.0",
    },
}

# Strand ID numeric ranges -> owning LPM, per GOVERNANCE.md's "Strand ID
# blocks" table (bio-core-k12: 000100-000199, oe-interdisciplinary-k12:
# 000200-000299 - same block-per-hundred convention as the concept blocks).
STRAND_RANGES = [
    {"min": 100, "max": 199, "lpm": "OE-LPM-000001"},
    {"min": 200, "max": 299, "lpm": "OE-LPM-000002"},
]


def write_json(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False, sort_keys=True)
        f.write("\n")


def build_concepts():
    count = 0
    for vocab_path in sorted(glob.glob(os.path.join(REPO_ROOT, "vocabularies", "*.yaml"))):
        with open(vocab_path, encoding="utf-8") as f:
            vocab = yaml.safe_load(f)
        for concept in vocab.get("concepts", []):
            concept_id = concept["id"]
            out_path = os.path.join(REGISTRY_DIR, "concept", f"{concept_id}.json")
            write_json(out_path, concept)
            count += 1
    return count


def build_competencies():
    # RFC-0008: vocabularies authored as oe:Competency (NGSS-LIFE-SCIENCE,
    # AI4K12) use a top-level `competencies:` key instead of `concepts:` -
    # this was never wired in when RFC-0002 introduced oe:Competency,
    # despite common.defs.yaml's competencyId doc-comment already promising
    # https://www.w3id.org/openevo/competency/{id} resolves.
    count = 0
    for vocab_path in sorted(glob.glob(os.path.join(REPO_ROOT, "vocabularies", "*.yaml"))):
        with open(vocab_path, encoding="utf-8") as f:
            vocab = yaml.safe_load(f)
        for competency in vocab.get("competencies", []):
            competency_id = competency["id"]
            out_path = os.path.join(REGISTRY_DIR, "competency", f"{competency_id}.json")
            write_json(out_path, competency)
            count += 1
    return count


def build_alignments():
    count = 0
    for align_path in sorted(glob.glob(os.path.join(REPO_ROOT, "alignments", "*.yaml"))):
        with open(align_path, encoding="utf-8") as f:
            record = yaml.safe_load(f)
        align_id = record["id"]
        out_path = os.path.join(REGISTRY_DIR, "alignment", f"{align_id}.json")
        write_json(out_path, record)
        count += 1
    return count


def build_lpm_index():
    write_json(os.path.join(REGISTRY_DIR, "lpm-index.json"), LPM_INDEX)


def build_strand_index():
    strand_index = {"ranges": STRAND_RANGES, "lpm": LPM_INDEX}
    write_json(os.path.join(REGISTRY_DIR, "strand-index.json"), strand_index)


def main():
    n_concepts = build_concepts()
    n_competencies = build_competencies()
    n_alignments = build_alignments()
    build_lpm_index()
    build_strand_index()
    print(f"Wrote {n_concepts} concept file(s), {n_competencies} competency file(s), "
          f"{n_alignments} alignment file(s), and lpm-index.json/strand-index.json "
          f"under {os.path.relpath(REGISTRY_DIR, REPO_ROOT)}/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
