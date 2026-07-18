// Robust resolution of a `repository` pointer field (used by lpm.schema.yaml's
// strands[] and strand.schema.yaml's learningObjects[]) against a repo's actual
// file tree. These pointers are frequently stale — e.g. an LPM extracted from a
// former monorepo still says "lpms/bio-core-k12/strands/foo.yaml" even though the
// file now lives at "strands/foo.yaml" in its own repo — so exact-path lookup
// alone is not "robust" per the brief; this module falls back through several
// strategies and reports which one succeeded for transparency in the UI.

import { parseGitHubRepoInput } from "./utils.js";

/**
 * @param {string} pointer - the repository field's raw string value.
 * @param {string[]} treePaths - full list of blob paths in the host repo.
 * @returns {{status: 'exact'|'basename'|'suffix'|'external'|'unresolved', path?: string, external?: {owner,repo,ref,path}|{url}, candidates?: string[]}}
 */
export function resolvePointer(pointer, treePaths) {
  if (!pointer) return { status: "unresolved" };
  const p = pointer.trim();

  if (/^https?:\/\/(www\.)?github\.com\//i.test(p)) {
    const parsed = parseGitHubRepoInput(p);
    const blobMatch = p.match(/github\.com\/[^/]+\/[^/]+\/blob\/([^/]+)\/(.+)$/);
    if (parsed && blobMatch) {
      return { status: "external", external: { owner: parsed.owner, repo: parsed.repo, ref: blobMatch[1], path: blobMatch[2] } };
    }
    return { status: "external", external: { url: p } };
  }
  if (/^https?:\/\//i.test(p)) {
    return { status: "external", external: { url: p } };
  }

  const clean = p.replace(/^\.?\//, "");
  const treeSet = new Set(treePaths);

  if (treeSet.has(clean)) return { status: "exact", path: clean };

  const basename = clean.split("/").pop();
  const basenameMatches = treePaths.filter((t) => t.split("/").pop() === basename);
  if (basenameMatches.length === 1) {
    return { status: "basename", path: basenameMatches[0] };
  }

  const segments = clean.split("/");
  for (let take = Math.min(3, segments.length - 1); take >= 1; take--) {
    const suffix = segments.slice(-take - 1).join("/");
    const suffixMatches = treePaths.filter((t) => t.endsWith("/" + suffix) || t === suffix);
    if (suffixMatches.length === 1) {
      return { status: "suffix", path: suffixMatches[0] };
    }
  }

  if (basenameMatches.length > 1) {
    return { status: "unresolved", candidates: basenameMatches };
  }

  return { status: "unresolved" };
}
