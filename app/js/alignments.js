// Cross-vocabulary comparison: matches formal Alignment records (spec §9)
// against whatever vocabularies are currently loaded, and separately proposes
// *candidate* overlaps between concepts that have no formal alignment yet —
// "other methods for comparing alignments or points of conflict" per the brief.

import { localized, tokenize, jaccard } from "./utils.js";

function parseAlignmentRef(ref) {
  const idx = ref.lastIndexOf(":");
  if (idx === -1) return { vocabRef: null, conceptId: ref };
  return { vocabRef: ref.slice(0, idx), conceptId: ref.slice(idx + 1) };
}

/**
 * @param {object[]} records raw alignment YAML docs from /alignments/
 * @param {Map<string,{concept,vocabRef}>} conceptIndexA
 * @param {Map<string,{concept,vocabRef}>} conceptIndexB
 */
export function matchAlignments(records, conceptIndexA, conceptIndexB) {
  const matched = [];
  for (const rec of records || []) {
    const subj = parseAlignmentRef(rec.subject);
    const obj = parseAlignmentRef(rec.object);
    const subjInA = conceptIndexA?.get(subj.conceptId);
    const subjInB = conceptIndexB?.get(subj.conceptId);
    const objInA = conceptIndexA?.get(obj.conceptId);
    const objInB = conceptIndexB?.get(obj.conceptId);

    const relevant =
      (subjInA && objInB) || (subjInB && objInA) || (subjInA && objInA) || (subjInB && objInB);
    if (!relevant) continue;

    matched.push({
      record: rec,
      subject: { ...subj, resolved: subjInA || subjInB || null, slot: subjInA ? "A" : subjInB ? "B" : null },
      object: { ...obj, resolved: objInA || objInB || null, slot: objInA ? "A" : objInB ? "B" : null },
    });
  }
  return matched;
}

/**
 * Best-effort candidate overlaps between two distinct vocabularies' *used*
 * concepts, based on label equality / token-Jaccard similarity on labels +
 * definitions. This is heuristic, not authoritative — surfaced to the user
 * as a starting point for manual review/annotation, never as a claim of fact.
 */
export function findCandidateOverlaps(bundleA, bundleB, existingAlignmentPairs, { threshold = 0.3 } = {}) {
  if (!bundleA || !bundleB) return [];
  const vocabA = bundleA.vocabularies[0]?.ref;
  const vocabB = bundleB.vocabularies[0]?.ref;
  if (!vocabA || !vocabB || vocabA === vocabB) return [];

  const conceptsA = [...bundleA.usedConcepts.keys()]
    .map((id) => bundleA.conceptIndex.get(id))
    .filter(Boolean);
  const conceptsB = [...bundleB.usedConcepts.keys()]
    .map((id) => bundleB.conceptIndex.get(id))
    .filter(Boolean);

  const results = [];
  for (const a of conceptsA) {
    const labelA = localized(a.concept.labels).toLowerCase();
    const tokensA = new Set(tokenize(labelA + " " + Object.values(a.concept.definitions?.en || {}).join(" ")));
    for (const b of conceptsB) {
      const pairKey = `${a.concept.id}|${b.concept.id}`;
      if (existingAlignmentPairs.has(pairKey) || existingAlignmentPairs.has(`${b.concept.id}|${a.concept.id}`)) continue;
      const labelB = localized(b.concept.labels).toLowerCase();
      let score;
      if (labelA === labelB) {
        score = 1;
      } else {
        const tokensB = new Set(tokenize(labelB + " " + Object.values(b.concept.definitions?.en || {}).join(" ")));
        score = jaccard(tokensA, tokensB);
        if (labelA.includes(labelB) || labelB.includes(labelA)) score = Math.max(score, 0.55);
      }
      if (score >= threshold) {
        results.push({ a, b, score });
      }
    }
  }
  return results.sort((x, y) => y.score - x.score).slice(0, 40);
}

export function existingAlignmentPairSet(records) {
  const set = new Set();
  for (const rec of records || []) {
    const subj = parseAlignmentRef(rec.subject).conceptId;
    const obj = parseAlignmentRef(rec.object).conceptId;
    set.add(`${subj}|${obj}`);
  }
  return set;
}
