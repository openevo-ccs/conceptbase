// Loads every vocabulary in the ConceptBase registry (not just the ones a
// currently-loaded LPM happens to declare in conceptbase.vocabularies) so
// features like the Concept Lens can look up ANY concept or competency
// across the whole ecosystem, independent of what's loaded into slots A/B.

import { fetchTree, fetchRawText } from "./githubClient.js";
import { parseYaml } from "./yaml.js";
import { CONCEPTBASE_REGISTRY } from "./config.js";

/**
 * @param {{owner, repo, ref}} [registrySource]
 * @returns {Promise<{vocabularies: object[], index: Map<string, {entry, vocabRef, kind, meta}>}>}
 */
export async function loadRegistryVocabularies(registrySource = CONCEPTBASE_REGISTRY) {
  const treePaths = await fetchTree(registrySource.owner, registrySource.repo, registrySource.ref);
  const vocabPaths = treePaths.filter((p) => p.startsWith("vocabularies/") && p.endsWith(".yaml"));

  const vocabularies = [];
  const index = new Map();

  for (const path of vocabPaths) {
    let data;
    try {
      const text = await fetchRawText(registrySource.owner, registrySource.repo, registrySource.ref, path);
      data = parseYaml(text);
    } catch (e) {
      console.warn(`[oecb-explorer] failed to load vocabulary ${path}:`, e);
      continue;
    }
    if (!data?.meta?.id) continue;
    const vocabRef = `${data.meta.id}-v${data.meta.version}`;

    // Two entry shapes coexist: oe:Concept vocabularies use `concepts:`
    // (BIO-CORE, OE-INTERDISCIPLINARY); oe:Competency vocabularies use
    // `competencies:` (NGSS-LIFE-SCIENCE, AI4K12 -- RFC-0006/0007). Both
    // are indexed the same way here so the lens doesn't care which.
    for (const entry of data.concepts || []) {
      index.set(entry.id, { entry, vocabRef, kind: "concept", meta: data.meta });
    }
    for (const entry of data.competencies || []) {
      index.set(entry.id, { entry, vocabRef, kind: "competency", meta: data.meta });
    }

    vocabularies.push({ ref: vocabRef, path, meta: data.meta, raw: data });
  }

  return { vocabularies, index };
}
