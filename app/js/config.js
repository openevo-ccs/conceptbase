// ConceptBase Explorer — configuration constants

export const CONCEPTBASE_REGISTRY = {
  owner: "openevo-ccs",
  repo: "conceptbase",
  ref: "main",
};

export const DEFAULT_SLOTS = {
  A: { owner: "openevo-ccs", repo: "bio-core-k12", ref: "main", lpmPath: "lpm.yaml" },
  B: { owner: "openevo-ccs", repo: "oe-interdisciplinary-k12", ref: "main", lpmPath: "lpm.yaml" },
};

export const SLOT_KEYS = ["A", "B"];

// Fixed-order categorical palette (see dataviz skill: references/palette.md).
// Slot 1 = blue -> LPM A, Slot 2 = green -> LPM B. Never reassigned by rank.
export const SERIES_COLOR = {
  A: { light: "#2a78d6", dark: "#3987e5" },
  B: { light: "#008300", dark: "#008300" },
};

export const STATUS_COLOR = {
  good: { light: "#0ca30c", dark: "#0ca30c" },
  warning: { light: "#fab219", dark: "#fab219" },
  serious: { light: "#ec835a", dark: "#ec835a" },
  critical: { light: "#d03b3b", dark: "#d03b3b" },
};

export const LIFECYCLE_ORDER = ["proposed", "accepted", "stable", "deprecated", "superseded"];

export const GRADE_BAND_ORDER = ["PK", "K", "K-2", "3-5", "6-8", "9-12"];

export const LS_KEYS = {
  recentRepos: "oecb-explorer:recent-repos",
  token: "oecb-explorer:gh-token",
  annotations: "oecb-explorer:annotations",
  authorName: "oecb-explorer:author-name",
  lastSlots: "oecb-explorer:last-slots",
  welcomeDismissed: "oecb-explorer:welcome-dismissed",
};

export const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes, in-memory + sessionStorage
