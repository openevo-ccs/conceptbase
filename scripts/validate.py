#!/usr/bin/env python3
"""Validate an OECB YAML data file against one of the schemas/*.schema.yaml files.

Every schema $refs common.defs.yaml by relative filename (e.g.
"common.defs.yaml#/$defs/lpmId"), which resolves against each schema's own
$id (https://www.w3id.org/openevo/schemas/...) to a URL that isn't actually
served by the w3id namespace today (only the *.schema.json pattern is
wired up, and common.defs itself isn't named that way -- see README
"Known issues"). Standard tools like check-jsonschema try to fetch that
URL over the network and fail. This script resolves $refs against the
schemas/ directory on disk instead, so validation works offline and
without relying on that still-open gap.

A vocabulary file (vocabularies/*.yaml) is a container -- a `meta:` block
plus a `concepts:` or `competencies:` list of entries, each individually
shaped like concept.schema.yaml / competency.schema.yaml, not like the
container itself. Passed directly, this script detects that shape and
validates each list entry separately instead of the container as a whole
-- this is what the CI workflow (.github/workflows/validate.yml) points
at every real vocabulary file, not just single-entry files like
alignments/*.yaml or examples/*.yaml.

Usage:
    python scripts/validate.py schemas/lpm.schema.yaml path/to/lpm.yaml [more.yaml ...]
    python scripts/validate.py schemas/concept.schema.yaml vocabularies/BIO-CORE-v1.0.0.yaml
"""
import pathlib
import sys

import yaml
from jsonschema import Draft202012Validator
from referencing import Registry, Resource
from referencing.exceptions import NoSuchResource

SCHEMAS_DIR = pathlib.Path(__file__).resolve().parent.parent / "schemas"
CONTAINER_KEYS = ("concepts", "competencies")


def _load_yaml(path):
    with open(path, encoding="utf-8") as f:
        return yaml.safe_load(f)


def _retrieve(uri: str):
    name = uri.rstrip("/").rsplit("/", 1)[-1]
    stem = (
        name.replace(".schema.json", "")
        .replace(".json", "")
        .replace(".schema.yaml", "")
        .replace(".yaml", "")
    )
    for candidate in (SCHEMAS_DIR / f"{stem}.schema.yaml", SCHEMAS_DIR / f"{stem}.yaml"):
        if candidate.exists():
            return Resource.from_contents(_load_yaml(candidate))
    raise NoSuchResource(ref=uri)


def _entries(data_path):
    """[(label, entry_dict), ...] -- one item per file, or one per list
    entry if data_path is a vocabulary container (see module docstring)."""
    data = _load_yaml(data_path)
    if isinstance(data, dict):
        for key in CONTAINER_KEYS:
            entries = data.get(key)
            if isinstance(entries, list):
                return [(f"{data_path}::{e.get('id', f'[{i}]')}", e) for i, e in enumerate(entries)]
    return [(str(data_path), data)]


def main(argv):
    if len(argv) < 3:
        print(__doc__)
        return 2

    schema_path, data_paths = argv[1], argv[2:]
    validator = Draft202012Validator(_load_yaml(schema_path), registry=Registry(retrieve=_retrieve))

    exit_code = 0
    for data_path in data_paths:
        for label, entry in _entries(data_path):
            errors = sorted(validator.iter_errors(entry), key=lambda e: list(e.path))
            if errors:
                exit_code = 1
                print(f"FAIL {label}")
                for err in errors:
                    loc = "/".join(str(p) for p in err.path) or "(root)"
                    print(f"  - {loc}: {err.message}")
            else:
                print(f"OK   {label}")
    return exit_code


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
