// Orchestrates loading one full "bundle" for a loaded-repo slot: the LPM root
// file, every externally-referenced Strand/SubStrand file (recursively, since
// strand.schema.yaml's subStrands[] nests inline but strands[]/learningObjects[]
// are loosely-coupled external pointers per the spec), the Learning Objects
// they reference, and the controlled vocabularies + alignment records the LPM
// depends on (fetched from the canonical ConceptBase registry repo).

import { fetchTree, fetchDefaultBranch, fetchRawText, fetchAbsoluteRawText, GitHubError } from "./githubClient.js";
import { resolvePointer } from "./resolver.js";
import { parseYaml } from "./yaml.js";
import { CONCEPTBASE_REGISTRY } from "./config.js";

const MAX_FILE_FETCHES = 250;

async function fetchAndParse(owner, repo, ref, path) {
  const text = await fetchRawText(owner, repo, ref, path);
  return parseYaml(text);
}

async function resolveAndFetch(pointer, ctx, issues, kind) {
  const resolution = resolvePointer(pointer, ctx.treePaths);
  if (resolution.status === "unresolved") {
    issues.push({
      severity: "warn",
      kind: `unresolved-${kind}`,
      message: `Could not resolve ${kind} pointer "${pointer}" in ${ctx.owner}/${ctx.repo}@${ctx.ref}` +
        (resolution.candidates ? ` (ambiguous — matched ${resolution.candidates.length} files)` : ""),
    });
    return null;
  }
  ctx.fetchCount++;
  if (ctx.fetchCount > MAX_FILE_FETCHES) {
    issues.push({ severity: "warn", kind: "fetch-limit", message: `Stopped resolving further files after ${MAX_FILE_FETCHES} fetches.` });
    return null;
  }
  try {
    if (resolution.status === "external") {
      if (resolution.external.url) {
        const text = await fetchAbsoluteRawText(resolution.external.url);
        return { data: parseYaml(text), sourcePath: resolution.external.url, resolutionStatus: "external" };
      }
      const { owner, repo, ref, path } = resolution.external;
      const data = await fetchAndParse(owner, repo, ref, path);
      return { data, sourcePath: `${owner}/${repo}@${ref}/${path}`, resolutionStatus: "external" };
    }
    const data = await fetchAndParse(ctx.owner, ctx.repo, ctx.ref, resolution.path);
    return { data, sourcePath: resolution.path, resolutionStatus: resolution.status };
  } catch (e) {
    issues.push({
      severity: "warn",
      kind: `fetch-failed-${kind}`,
      message: `Failed to fetch resolved ${kind} "${resolution.path || pointer}": ${e.message}`,
    });
    return null;
  }
}

async function loadLearningObjectRefs(loRefs, ctx, issues) {
  const out = [];
  for (const ref of loRefs || []) {
    if (!ref.repository) {
      out.push({ id: ref.id, required: ref.required !== false, unresolved: true, missingPointer: true });
      continue;
    }
    const fetched = await resolveAndFetch(ref.repository, ctx, issues, "learningObject");
    if (fetched) {
      out.push({ ...fetched.data, required: ref.required !== false, sourcePath: fetched.sourcePath });
    } else {
      out.push({ id: ref.id, required: ref.required !== false, unresolved: true });
    }
  }
  return out;
}

function flattenStrandNode(node, depth, parentId, out) {
  out.push({ ...node, depth, parentId, subStrands: undefined });
  for (const child of node.subStrands || []) {
    flattenStrandNode(child, depth + 1, node.id, out);
  }
}

async function loadStrandRecursive(rawNode, ctx, issues, depth) {
  // rawNode already parsed strand/substrand data (from file or inline).
  const learningObjects = await loadLearningObjectRefs(rawNode.learningObjects, ctx, issues);
  const subStrands = [];
  for (const child of rawNode.subStrands || []) {
    subStrands.push(await loadStrandRecursive(child, ctx, issues, depth + 1));
  }
  if (depth > 2) {
    issues.push({
      severity: "info",
      kind: "depth-limit",
      message: `Strand "${rawNode.id}" (${rawNode.labels?.en || ""}) exceeds the recommended 2-level nesting depth (spec §6.5/§13.4).`,
    });
  }
  return { ...rawNode, learningObjects, subStrands };
}

async function loadTopStrand(ref, ctx, issues) {
  if (!ref.repository) {
    issues.push({ severity: "error", kind: "missing-pointer", message: `Strand ${ref.id} has no repository pointer.` });
    return null;
  }
  const fetched = await resolveAndFetch(ref.repository, ctx, issues, "strand");
  if (!fetched) return null;
  const loaded = await loadStrandRecursive(fetched.data, ctx, issues, 0);
  return { ...loaded, required: ref.required !== false, sequence: ref.sequence, sourcePath: fetched.sourcePath, resolutionStatus: fetched.resolutionStatus };
}

function collectUsedConcepts(strandTree) {
  const used = new Map();
  function bump(conceptId, emphasis, strandId) {
    if (!conceptId) return;
    if (!used.has(conceptId)) used.set(conceptId, { count: 0, primary: 0, reinforcing: 0, strandIds: new Set() });
    const rec = used.get(conceptId);
    rec.count++;
    if (emphasis === "primary") rec.primary++;
    else if (emphasis === "reinforcing") rec.reinforcing++;
    rec.strandIds.add(strandId);
  }
  function walk(node) {
    for (const c of node.concepts || []) bump(c.id, c.emphasis, node.id);
    for (const lo of node.learningObjects || []) {
      for (const c of lo.concepts || []) bump(c.id, c.emphasis, node.id);
    }
    for (const child of node.subStrands || []) walk(child);
  }
  for (const top of strandTree) walk(top);
  return used;
}

async function resolveVocabularyFile(vocabRef, registryCtx, issues) {
  const exactPath = `vocabularies/${vocabRef}.yaml`;
  if (registryCtx.treePaths.includes(exactPath)) {
    try {
      const data = await fetchAndParse(registryCtx.owner, registryCtx.repo, registryCtx.ref, exactPath);
      return data;
    } catch (e) {
      issues.push({ severity: "warn", kind: "vocab-fetch-failed", message: `Failed to fetch vocabulary ${vocabRef}: ${e.message}` });
      return null;
    }
  }
  // Fallback: scan vocabularies/*.yaml for meta.id + '-v' + meta.version match.
  const candidates = registryCtx.treePaths.filter((p) => p.startsWith("vocabularies/") && p.endsWith(".yaml"));
  for (const path of candidates) {
    try {
      const data = await fetchAndParse(registryCtx.owner, registryCtx.repo, registryCtx.ref, path);
      const id = `${data?.meta?.id}-v${data?.meta?.version}`;
      if (id === vocabRef) return data;
    } catch {
      /* keep scanning */
    }
  }
  issues.push({ severity: "error", kind: "vocab-not-found", message: `Vocabulary "${vocabRef}" was not found in ${registryCtx.owner}/${registryCtx.repo}@${registryCtx.ref}/vocabularies/.` });
  return null;
}

/**
 * @param {{owner, repo, ref, lpmPath}} source
 * @param {{owner, repo, ref}} [registrySource] defaults to CONCEPTBASE_REGISTRY
 */
export async function loadLpmBundle(source, registrySource = CONCEPTBASE_REGISTRY) {
  const issues = [];
  const owner = source.owner.trim();
  const repo = source.repo.trim();
  let ref = (source.ref || "").trim();
  if (!ref) {
    ref = await fetchDefaultBranch(owner, repo);
  }

  const treePaths = await fetchTree(owner, repo, ref);
  const ctx = { owner, repo, ref, treePaths, fetchCount: 0 };

  let lpmPath = (source.lpmPath || "lpm.yaml").trim().replace(/^\/+/, "");
  if (!treePaths.includes(lpmPath)) {
    const fallback = treePaths.find((p) => /(^|\/)lpm\.ya?ml$/i.test(p)) || treePaths.find((p) => /lpm.*\.ya?ml$/i.test(p));
    if (fallback) {
      issues.push({ severity: "info", kind: "lpm-path-fallback", message: `"${lpmPath}" not found; using "${fallback}" instead.` });
      lpmPath = fallback;
    }
  }

  let lpm;
  try {
    lpm = await fetchAndParse(owner, repo, ref, lpmPath);
  } catch (e) {
    throw new GitHubError(`Could not load an LPM root file from ${owner}/${repo}@${ref} (tried "${lpmPath}"): ${e.message}`, {});
  }
  if (!lpm || typeof lpm !== "object" || !lpm.strands) {
    throw new Error(`"${lpmPath}" in ${owner}/${repo}@${ref} does not look like a valid oe:LPM file (missing strands[]).`);
  }

  const strandTree = [];
  const sortedRefs = [...lpm.strands].sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
  for (const ref_ of sortedRefs) {
    const loaded = await loadTopStrand(ref_, ctx, issues);
    if (loaded) strandTree.push(loaded);
  }

  const flatStrands = [];
  for (const top of strandTree) flattenStrandNode(top, 0, null, flatStrands);

  const usedConcepts = collectUsedConcepts(strandTree);

  // --- Vocabularies -----------------------------------------------------
  const vocabRefs = lpm.conceptbase?.vocabularies || [];
  let registryTree = [];
  try {
    registryTree = await fetchTree(registrySource.owner, registrySource.repo, registrySource.ref);
  } catch (e) {
    issues.push({ severity: "error", kind: "registry-unreachable", message: `Could not reach ConceptBase registry ${registrySource.owner}/${registrySource.repo}: ${e.message}` });
  }
  const registryCtx = { ...registrySource, treePaths: registryTree };

  const vocabularies = [];
  const conceptIndex = new Map();
  for (const vocabRef of vocabRefs) {
    const vocabData = await resolveVocabularyFile(vocabRef, registryCtx, issues);
    if (!vocabData) continue;
    const conceptMap = new Map();
    // A vocabulary is either oe:Concept-shaped (`concepts:`) or
    // oe:Competency-shaped (`competencies:`, RFC-0006/0007) -- an LPM may in
    // principle depend on either, so both are indexed the same way here.
    for (const c of [...(vocabData.concepts || []), ...(vocabData.competencies || [])]) {
      conceptMap.set(c.id, c);
      conceptIndex.set(c.id, { concept: c, vocabRef });
    }
    vocabularies.push({ ref: vocabRef, meta: vocabData.meta, concepts: conceptMap });
  }

  for (const conceptId of usedConcepts.keys()) {
    if (!conceptIndex.has(conceptId)) {
      issues.push({ severity: "warn", kind: "concept-not-found", message: `Concept ${conceptId} is referenced by a strand but not defined in any loaded vocabulary.` });
    }
  }

  return {
    source: { owner, repo, ref, lpmPath },
    lpm,
    strandTree,
    flatStrands,
    usedConcepts,
    vocabularies,
    conceptIndex,
    issues,
    loadedAt: new Date().toISOString(),
  };
}

export async function loadAlignments(registrySource = CONCEPTBASE_REGISTRY) {
  const treePaths = await fetchTree(registrySource.owner, registrySource.repo, registrySource.ref);
  const alignPaths = treePaths.filter((p) => p.startsWith("alignments/") && p.endsWith(".yaml"));
  const records = [];
  for (const path of alignPaths) {
    try {
      const data = await fetchAndParse(registrySource.owner, registrySource.repo, registrySource.ref, path);
      records.push(data);
    } catch (e) {
      console.warn(`[oecb-explorer] failed to load alignment ${path}:`, e);
    }
  }
  return records;
}
