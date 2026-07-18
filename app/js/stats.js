// Pure stat computation over a loaded LPM bundle (see lpmLoader.js). Kept
// side-effect-free so the dashboard/vocab views can call it directly and so
// it's easy to reason about / unit-test independently of rendering.

import { GRADE_BAND_ORDER, LIFECYCLE_ORDER } from "./config.js";
import { localized } from "./utils.js";

function normalizeGradeBand(raw) {
  if (!raw) return null;
  const s = String(raw);
  for (const band of GRADE_BAND_ORDER) {
    if (s.includes(band)) return band;
  }
  const m = s.match(/K\s*-\s*2|3\s*-\s*5|6\s*-\s*8|9\s*-\s*12/);
  return m ? m[0].replace(/\s/g, "") : null;
}

export function computeBundleStats(bundle) {
  const flat = bundle.flatStrands;
  const topStrands = flat.filter((s) => s.depth === 0);
  const subStrands = flat.filter((s) => s.depth > 0);
  const maxDepth = flat.reduce((m, s) => Math.max(m, s.depth), 0);

  const performanceIndicatorCount = flat.reduce((n, s) => n + (s.performanceIndicators?.length || 0), 0);
  const learningObjectCount = flat.reduce((n, s) => n + (s.learningObjects?.length || 0), 0);

  const gradeBandCounts = {};
  for (const s of flat) {
    const band = normalizeGradeBand(s.typicalGradeBand);
    if (band) gradeBandCounts[band] = (gradeBandCounts[band] || 0) + 1;
  }

  let primaryRefs = 0;
  let reinforcingRefs = 0;
  for (const rec of bundle.usedConcepts.values()) {
    primaryRefs += rec.primary;
    reinforcingRefs += rec.reinforcing;
  }

  const domainCounts = {};
  for (const s of flat) {
    for (const d of s.associatedDomains || []) domainCounts[d] = (domainCounts[d] || 0) + 1;
  }

  // Horizontal coherence proxy (spec §13.3): concepts genuinely reinforced
  // across >=2 distinct strands, vs. concepts only ever introduced once.
  let reinforcedAcrossMultiple = 0;
  let introducedOnly = 0;
  for (const rec of bundle.usedConcepts.values()) {
    if (rec.strandIds.size > 1) reinforcedAcrossMultiple++;
    else introducedOnly++;
  }

  const conceptsDefinedTotal = bundle.vocabularies.reduce((n, v) => n + v.concepts.size, 0);

  const topConceptsByUsage = [...bundle.usedConcepts.entries()]
    .map(([id, rec]) => ({ id, ...rec, label: localized(bundle.conceptIndex.get(id)?.concept?.labels) || id }))
    .sort((a, b) => b.count - a.count);

  const statusCounts = {};
  for (const s of flat) statusCounts[s.status] = (statusCounts[s.status] || 0) + 1;

  return {
    lpmLabel: localized(bundle.lpm.labels),
    strandCount: topStrands.length,
    subStrandCount: subStrands.length,
    maxNestingDepth: maxDepth,
    performanceIndicatorCount,
    learningObjectCount,
    uniqueConceptsUsed: bundle.usedConcepts.size,
    conceptsDefinedTotal,
    conceptCoveragePct: conceptsDefinedTotal ? Math.round((bundle.usedConcepts.size / conceptsDefinedTotal) * 100) : 0,
    avgConceptsPerStrand: flat.length ? +(primaryRefs + reinforcingRefs) / flat.length : 0,
    primaryRefs,
    reinforcingRefs,
    reinforcingRatio: primaryRefs + reinforcingRefs ? reinforcingRefs / (primaryRefs + reinforcingRefs) : 0,
    reinforcedAcrossMultiple,
    introducedOnly,
    gradeBandCounts,
    domainCounts,
    statusCounts,
    vocabularyRefs: bundle.vocabularies.map((v) => v.ref),
    topConceptsByUsage,
    issueCount: bundle.issues.filter((i) => i.severity !== "info").length,
  };
}

export function lifecycleIndex(status) {
  const i = LIFECYCLE_ORDER.indexOf(status);
  return i === -1 ? 0 : i;
}
