// Small shared helpers used across modules.

export function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else if (v !== null && v !== undefined) node.setAttribute(k, v);
  }
  for (const child of [].concat(children)) {
    if (child === null || child === undefined || child === false) continue;
    node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

export function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export function downloadText(filename, text, mime = "text/yaml") {
  const blob = new Blob([text], { type: mime + ";charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function localized(field, lang = "en") {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field[lang] || field.en || Object.values(field)[0] || "";
}

export function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Deterministic pseudo-random 6-digit numeric suffix from a string seed,
// used to generate draft alignment IDs that are stable across re-exports
// of the same annotation.
export function hashToSixDigits(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return String(900000 + (h % 99999)).padStart(6, "0");
}

export function uid() {
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// Simple English tokenizer for fuzzy label / definition overlap comparisons.
const STOPWORDS = new Set([
  "the", "a", "an", "of", "and", "or", "to", "in", "on", "for", "is", "are",
  "that", "this", "with", "as", "by", "from", "at", "be", "its", "it", "into",
  "across", "within", "their", "than", "which", "not", "but", "over",
]);

export function tokenize(text) {
  if (!text) return [];
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

export function jaccard(setA, setB) {
  if (!setA.size && !setB.size) return 0;
  let inter = 0;
  for (const x of setA) if (setB.has(x)) inter++;
  const union = setA.size + setB.size - inter;
  return union === 0 ? 0 : inter / union;
}

export function parseGitHubRepoInput(input) {
  // Accepts "owner/repo", full GitHub URLs, or "owner/repo@ref".
  if (!input) return null;
  let s = input.trim();
  s = s.replace(/^https?:\/\/(www\.)?github\.com\//i, "").replace(/\.git$/, "");
  s = s.replace(/\/$/, "");
  let ref = null;
  const treeMatch = s.match(/^([^/]+\/[^/]+)\/tree\/([^/]+)(\/.*)?$/);
  if (treeMatch) {
    s = treeMatch[1];
    ref = treeMatch[2];
  }
  const atMatch = s.match(/^(.+)@([^@/]+)$/);
  if (!ref && atMatch) {
    s = atMatch[1];
    ref = atMatch[2];
  }
  const parts = s.split("/").filter(Boolean);
  if (parts.length < 2) return null;
  return { owner: parts[0], repo: parts[1], ref: ref || null };
}
