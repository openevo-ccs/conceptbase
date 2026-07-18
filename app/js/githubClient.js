// Thin GitHub API / raw-content client with in-memory + sessionStorage caching.
// Works entirely client-side: api.github.com and raw.githubusercontent.com both
// send Access-Control-Allow-Origin: * for GET requests, so no proxy is needed.

import { LS_KEYS, CACHE_TTL_MS } from "./config.js";

const memCache = new Map();

export class GitHubError extends Error {
  constructor(message, { status, url, rateLimited } = {}) {
    super(message);
    this.name = "GitHubError";
    this.status = status;
    this.url = url;
    this.rateLimited = !!rateLimited;
  }
}

export function getToken() {
  try {
    return localStorage.getItem(LS_KEYS.token) || "";
  } catch {
    return "";
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(LS_KEYS.token, token);
    else localStorage.removeItem(LS_KEYS.token);
  } catch {
    /* ignore */
  }
}

function cacheGet(key) {
  const hit = memCache.get(key);
  if (hit && Date.now() - hit.t < CACHE_TTL_MS) return hit.v;
  try {
    const raw = sessionStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.t < CACHE_TTL_MS) {
        memCache.set(key, parsed);
        return parsed.v;
      }
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

function cacheSet(key, v) {
  const entry = { t: Date.now(), v };
  memCache.set(key, entry);
  try {
    sessionStorage.setItem(key, JSON.stringify(entry));
  } catch {
    /* storage full or unavailable — memory cache still applies */
  }
}

async function apiFetch(url) {
  const cached = cacheGet(url);
  if (cached !== undefined) return cached;

  const headers = { Accept: "application/vnd.github+json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(url, { headers });
  } catch (e) {
    throw new GitHubError(`Network error contacting GitHub: ${e.message}`, { url });
  }

  if (!res.ok) {
    const remaining = res.headers.get("x-ratelimit-remaining");
    const rateLimited = res.status === 403 && remaining === "0";
    let detail = "";
    try {
      const body = await res.json();
      detail = body.message ? ` — ${body.message}` : "";
    } catch {
      /* ignore */
    }
    throw new GitHubError(
      rateLimited
        ? `GitHub API rate limit exceeded. Add a personal access token in Settings to raise the limit.`
        : `GitHub API request failed (${res.status})${detail}`,
      { status: res.status, url, rateLimited }
    );
  }

  const data = await res.json();
  cacheSet(url, data);
  return data;
}

/** Full recursive file tree for a repo at a ref. Returns [{path, type}]. */
export async function fetchTree(owner, repo, ref) {
  const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${encodeURIComponent(ref)}?recursive=1`;
  const data = await apiFetch(url);
  if (data.truncated) {
    console.warn(`[oecb-explorer] Tree listing for ${owner}/${repo}@${ref} was truncated by GitHub.`);
  }
  return (data.tree || []).filter((e) => e.type === "blob").map((e) => e.path);
}

/** Resolve the default branch for a repo (used when the user doesn't specify a ref). */
export async function fetchDefaultBranch(owner, repo) {
  const url = `https://api.github.com/repos/${owner}/${repo}`;
  const data = await apiFetch(url);
  return data.default_branch || "main";
}

/** Raw text content of a single file. Throws GitHubError on 404/network failure. */
export async function fetchRawText(owner, repo, ref, path) {
  const cleanPath = path.replace(/^\/+/, "");
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${cleanPath
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
  const cached = cacheGet(url);
  if (cached !== undefined) return cached;

  let res;
  try {
    res = await fetch(url);
  } catch (e) {
    throw new GitHubError(`Network error fetching ${cleanPath}: ${e.message}`, { url });
  }
  if (!res.ok) {
    throw new GitHubError(`File not found: ${owner}/${repo}@${ref}/${cleanPath} (${res.status})`, {
      status: res.status,
      url,
    });
  }
  const text = await res.text();
  cacheSet(url, text);
  return text;
}

/** Fetch raw text from an absolute https URL (used for repository pointers that
 *  are full URLs rather than paths within the current repo). */
export async function fetchAbsoluteRawText(url) {
  const cached = cacheGet(url);
  if (cached !== undefined) return cached;
  const res = await fetch(url);
  if (!res.ok) throw new GitHubError(`File not found at ${url} (${res.status})`, { status: res.status, url });
  const text = await res.text();
  cacheSet(url, text);
  return text;
}

export function clearCache() {
  memCache.clear();
  try {
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const k = sessionStorage.key(i);
      if (k && k.startsWith("https://")) sessionStorage.removeItem(k);
    }
  } catch {
    /* ignore */
  }
}

/** Recent-repo history persisted in localStorage. */
export function getRecentRepos() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEYS.recentRepos) || "[]");
  } catch {
    return [];
  }
}

export function pushRecentRepo(entry) {
  try {
    const list = getRecentRepos().filter(
      (r) => !(r.owner === entry.owner && r.repo === entry.repo && r.ref === entry.ref)
    );
    list.unshift(entry);
    localStorage.setItem(LS_KEYS.recentRepos, JSON.stringify(list.slice(0, 12)));
  } catch {
    /* ignore */
  }
}
