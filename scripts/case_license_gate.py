#!/usr/bin/env python3
"""
Classifies a CASE (1EdTech) CFPackage's CFDocument.licenseURI to determine
what an OECB importer may do with its CFItems, per RFC-0005 and the license
catalog precedent in docs/design-notes/case-competency-profile.md.

This is pattern-matching on license title/URI text, not a legal opinion.
It exists to make the *safe default* mechanical (fail closed on anything
not recognized) rather than to certify that a given verdict is definitely
correct — BLOCKED and CITATION_ONLY verdicts still warrant a human reading
the actual license before any ingestion PR is opened.

Verdicts (most to least permissive):
    ALLOW_FULL      Recognized as compatible with OECB's own CC-BY-NC-SA-4.0
                    content license (RFC-0004). CFItem.fullStatement MAY be
                    republished verbatim, with attribution.
    CITATION_ONLY   No redistribution grant found, but no explicit
                    prohibition either (e.g. a bare copyright notice).
                    Default-safe: represent via RFC-0005's `citationOnly`
                    entries (humanCodingScheme + provenance), never
                    fullStatement.
    BLOCKED         An explicit no-redistribution/no-republication (or
                    NoDerivatives) clause was detected. Even citationOnly
                    ingestion of this source needs an explicit human
                    sign-off before proceeding — this verdict exists to
                    make that prohibition impossible to miss, not to
                    silently permit citation-only as a workaround.

Usage:
    python scripts/case_license_gate.py path/to/CFPackage.json [more.json ...]

Exits non-zero if any package resolves to BLOCKED (signals "stop and get
a human to look at this before ingesting anything from it").

Standalone tooling, like scripts/check_related_symmetry.py — not yet
wired into any CI pipeline (see GOVERNANCE.md, "Tooling").
"""

import sys
import json
from dataclasses import dataclass

ALLOW_FULL = "ALLOW_FULL"
CITATION_ONLY = "CITATION_ONLY"
BLOCKED = "BLOCKED"

# Substrings checked against the lowercased license title + URI. Order
# matters: BLOCKED patterns are checked first, since an explicit
# prohibition should never be shadowed by an incidental "creative commons"
# mention elsewhere in the same title.
BLOCKED_PATTERNS = [
    "no redistribution",
    "no republication",
    "not redistributable",
    "in-app and alignment use only",
    "all rights reserved",
    "nd/",  # CC ...-nd (NoDerivatives) URL segment
    "-nd-",
]

ALLOW_FULL_PATTERNS = [
    "publicdomain/zero",
    "creativecommons.org/licenses/by/4.0",
    "creativecommons.org/licenses/by-sa/4.0",
    "creativecommons.org/licenses/by-nc-sa/4.0",
]


@dataclass
class Verdict:
    document_title: str
    license_title: str
    license_uri: str
    verdict: str
    reason: str


def classify_license(license_title, license_uri):
    haystack = f"{license_title or ''} {license_uri or ''}".lower()

    for pattern in BLOCKED_PATTERNS:
        if pattern in haystack:
            return BLOCKED, f"matched explicit-restriction pattern {pattern!r}"

    for pattern in ALLOW_FULL_PATTERNS:
        if pattern in haystack:
            return ALLOW_FULL, f"matched compatible-license pattern {pattern!r}"

    if not license_title and not license_uri:
        return BLOCKED, "no license information present — fail closed"

    return CITATION_ONLY, "no redistribution grant or explicit prohibition recognized — default-safe"


def classify_package(path):
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    doc = data.get("CFDocument", {})
    license_ref = doc.get("licenseURI") or {}
    license_title = license_ref.get("title")
    license_uri = license_ref.get("uri")

    verdict, reason = classify_license(license_title, license_uri)
    return Verdict(
        document_title=doc.get("title", path),
        license_title=license_title or "(none)",
        license_uri=license_uri or "(none)",
        verdict=verdict,
        reason=reason,
    )


def main():
    paths = sys.argv[1:]
    if not paths:
        print("Usage: python scripts/case_license_gate.py path/to/CFPackage.json [more.json ...]")
        return 1

    any_blocked = False
    for path in paths:
        v = classify_package(path)
        print(f"{v.document_title}")
        print(f"  license title : {v.license_title}")
        print(f"  license uri   : {v.license_uri}")
        print(f"  verdict       : {v.verdict}  ({v.reason})")
        print()
        if v.verdict == BLOCKED:
            any_blocked = True

    if any_blocked:
        print("BLOCKED verdict(s) present — get explicit human sign-off before ingesting anything from those sources, including citationOnly entries.")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
