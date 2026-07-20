// Minimal shared app state with a plain pub/sub. Deliberately not a full
// reactive framework — views subscribe to the events they care about and
// re-render themselves; main.js owns the wiring.

const listeners = new Map();

export const state = {
  slots: { A: null, B: null }, // loaded bundles, see lpmLoader.js
  loading: { A: false, B: false },
  loadErrors: { A: null, B: null },
  alignmentRecords: [],
  activeTab: "load",
  inspector: { open: false, entity: null },
  // Whole-ecosystem registry (every vocabularies/*.yaml file, not scoped to
  // any loaded LPM's own conceptbase.vocabularies list) -- powers the
  // Concept Lens tab. Loaded lazily on first visit, see registryLoader.js.
  registry: { loading: false, loaded: false, error: null, vocabularies: [], index: new Map() },
};

export function on(event, fn) {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event).add(fn);
  return () => listeners.get(event).delete(fn);
}

export function emit(event, payload) {
  for (const fn of listeners.get(event) || []) fn(payload);
}

export function activeBundles() {
  return ["A", "B"].map((k) => state.slots[k]).filter(Boolean);
}

export function bundleFor(slot) {
  return state.slots[slot];
}

/** [{slot, bundle}] for every currently loaded slot, in A/B order. */
export function slottedBundles() {
  return ["A", "B"].filter((k) => state.slots[k]).map((k) => ({ slot: k, bundle: state.slots[k] }));
}
