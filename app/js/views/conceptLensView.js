// Concept Lens: pick any concept or competency from the WHOLE ConceptBase
// registry (every vocabularies/*.yaml file, not just what a loaded LPM
// happens to declare) and see, in one place: its full definition/statement,
// every substrand in a currently-loaded LPM that references it, and every
// Phase 2 alignment record connecting it to something in another vocabulary.

import { el, clear, localized } from "../utils.js";
import { state } from "../state.js";
import { slottedBundles } from "../state.js";
import { loadRegistryVocabularies } from "../registryLoader.js";
import { loadAlignments } from "../lpmLoader.js";
import { CONCEPTBASE_REGISTRY } from "../config.js";
import { pick } from "../theme.js";
import { SERIES_COLOR } from "../config.js";

function parseAlignmentRef(ref) {
  const idx = ref.lastIndexOf(":");
  if (idx === -1) return { vocabRef: null, conceptId: ref };
  return { vocabRef: ref.slice(0, idx), conceptId: ref.slice(idx + 1) };
}

function labelFor(id) {
  const hit = state.registry.index.get(id);
  if (!hit) return id;
  return hit.kind === "competency"
    ? `${hit.entry.humanCodingScheme || localized(hit.entry.statement)}`
    : localized(hit.entry.labels);
}

function matchTypeBadgeClass(matchType) {
  if (matchType === "skos:exactMatch" || matchType === "skos:closeMatch") return "badge-status";
  return "badge-muted";
}

function renderDefinitions(hit) {
  const { kind, entry } = hit;
  const wrap = el("div", { class: "detail" });

  if (kind === "concept") {
    const defs = entry.definitions?.en || {};
    for (const [discipline, text] of Object.entries(defs)) {
      wrap.appendChild(el("div", { class: "field" }, [el("div", { class: "field-label" }, discipline), el("p", {}, text)]));
    }
    if (entry.examples?.length) {
      wrap.appendChild(el("div", { class: "field" }, [el("div", { class: "field-label" }, "Examples"), el("ul", {}, entry.examples.map((x) => el("li", {}, x)))]));
    }
    if (entry.nonExamples?.length) {
      wrap.appendChild(el("div", { class: "field" }, [el("div", { class: "field-label" }, "Non-examples"), el("ul", {}, entry.nonExamples.map((x) => el("li", {}, x)))]));
    }
  } else {
    if (entry.humanCodingScheme) {
      wrap.appendChild(el("div", { class: "field" }, [el("div", { class: "field-label" }, "Code"), el("p", {}, entry.humanCodingScheme)]));
    }
    if (entry.citationOnly) {
      wrap.appendChild(el("div", { class: "field" }, [
        el("div", { class: "field-label" }, "Statement"),
        el("p", { class: "muted" }, "Citation-only entry (RFC-0005) — the source license does not permit reproducing this item's statement text. See provenance below."),
      ]));
    } else if (entry.statement) {
      wrap.appendChild(el("div", { class: "field" }, [el("div", { class: "field-label" }, "Statement"), el("p", {}, localized(entry.statement))]));
    }
    if (entry.educationLevel?.length) {
      wrap.appendChild(el("div", { class: "field" }, [el("div", { class: "field-label" }, "Grade band"), el("p", {}, entry.educationLevel.join(", "))]));
    }
    if (entry.provenance) {
      wrap.appendChild(el("div", { class: "field" }, [
        el("div", { class: "field-label" }, "Provenance"),
        el("p", {}, [
          entry.provenance.sourceCFItemURI
            ? el("a", { href: entry.provenance.sourceCFItemURI, target: "_blank", rel: "noopener" }, "Source CASE CFItem ↗")
            : "Natively authored (no CASE source)",
        ]),
      ]));
    }
    if (entry.citations?.length) {
      wrap.appendChild(el("div", { class: "field" }, [
        el("div", { class: "field-label" }, "Citations"),
        el("ul", {}, entry.citations.map((c) => el("li", {}, c.url ? el("a", { href: c.url, target: "_blank", rel: "noopener" }, c.text) : c.text))),
      ]));
    }
  }

  const rel = entry.relations || {};
  for (const [title, key] of [["Broader", "skos:broader"], ["Narrower", "skos:narrower"], ["Related", "skos:related"]]) {
    const ids = rel[key];
    if (!ids?.length) continue;
    wrap.appendChild(el("div", { class: "field" }, [
      el("div", { class: "field-label" }, title),
      el("ul", { class: "chip-list" }, ids.map((id) => {
        const chip = el("li", { class: "chip chip-ref chip-btn" }, `${labelFor(id)} (${id})`);
        if (state.registry.index.has(id)) chip.addEventListener("click", () => selectAndRender(id));
        return chip;
      })),
    ]));
  }

  return wrap;
}

function renderLpmUsage(id) {
  const loaded = slottedBundles();
  const wrap = el("div", { class: "field" });
  wrap.appendChild(el("div", { class: "field-label" }, "Appears in loaded LPMs"));
  let any = false;
  for (const { slot, bundle } of loaded) {
    const usage = bundle.usedConcepts.get(id);
    if (!usage) continue;
    any = true;
    const strandLabels = [...usage.strandIds].map((sid) => {
      const node = bundle.flatStrands.find((s) => s.id === sid);
      return node ? localized(node.labels) : sid;
    });
    wrap.appendChild(el("p", {}, [
      el("span", { class: "legend-dot", style: `background:${pick(SERIES_COLOR[slot])}` }),
      ` LPM ${slot} — referenced ${usage.count}× (${usage.primary} primary, ${usage.reinforcing} reinforcing) in: ${strandLabels.join(", ")}`,
    ]));
  }
  if (!any) wrap.appendChild(el("p", { class: "muted" }, loaded.length ? "Not referenced by any currently-loaded LPM." : "Load an LPM above to see where this is used."));
  return wrap;
}

function renderAlignments(id) {
  const wrap = el("div", { class: "field" });
  wrap.appendChild(el("div", { class: "field-label" }, "Alignments"));
  const records = state.alignmentRecords || [];
  const matches = [];
  for (const rec of records) {
    const subj = parseAlignmentRef(rec.subject);
    const obj = parseAlignmentRef(rec.object);
    if (subj.conceptId === id) matches.push({ rec, otherRef: rec.object, other: obj });
    else if (obj.conceptId === id) matches.push({ rec, otherRef: rec.subject, other: subj });
  }
  if (!matches.length) {
    wrap.appendChild(el("p", { class: "muted" }, "No alignment records reference this entry yet."));
    return wrap;
  }
  for (const { rec, otherRef, other } of matches) {
    const card = el("div", { class: "note-card" });
    card.appendChild(el("div", { class: "meta-row" }, [
      el("span", { class: `badge ${matchTypeBadgeClass(rec.matchType)}` }, rec.matchType),
      el("span", { class: "badge badge-muted" }, rec.status),
      el("code", { class: "id-code-sm" }, rec.id),
    ]));
    const otherLabel = state.registry.index.has(other.conceptId) ? `${labelFor(other.conceptId)} (${otherRef})` : otherRef;
    const otherLine = el("p", {}, ["→ ", el("strong", {}, otherLabel)]);
    if (state.registry.index.has(other.conceptId)) {
      otherLine.style.cursor = "pointer";
      otherLine.addEventListener("click", () => selectAndRender(other.conceptId));
      otherLine.title = "Jump the lens to this entry";
    }
    card.appendChild(otherLine);
    if (rec.rationale) card.appendChild(el("p", { class: "muted small" }, rec.rationale.trim()));
    wrap.appendChild(card);
  }
  return wrap;
}

let detailHost = null;
let listHost = null;
let searchInput = null;

function selectAndRender(id) {
  if (!detailHost) return;
  clear(detailHost);
  const hit = state.registry.index.get(id);
  if (!hit) {
    detailHost.appendChild(el("div", { class: "empty-hint" }, "Not found in the loaded registry."));
    return;
  }
  const { entry, vocabRef, kind } = hit;
  const label = kind === "competency" ? (entry.humanCodingScheme ? `${entry.humanCodingScheme} — ${localized(entry.statement)}` : localized(entry.statement)) : localized(entry.labels);

  detailHost.appendChild(el("h3", {}, label));
  detailHost.appendChild(el("div", { class: "meta-row" }, [
    el("span", { class: "badge" }, kind === "competency" ? "Competency" : "Concept"),
    el("span", { class: "badge badge-muted" }, entry.status),
    el("span", { class: "badge badge-muted" }, vocabRef),
    entry.version ? el("span", { class: "badge badge-muted" }, `v${entry.version}`) : null,
  ]));
  detailHost.appendChild(el("code", { class: "id-code" }, entry.id));

  detailHost.appendChild(renderDefinitions(hit));
  detailHost.appendChild(renderLpmUsage(id));
  detailHost.appendChild(renderAlignments(id));

  if (listHost) {
    for (const li of listHost.querySelectorAll(".concept-list-item")) {
      li.classList.toggle("lens-selected", li.dataset.id === id);
    }
  }
}

function renderList(filter) {
  clear(listHost);
  const f = filter.trim().toLowerCase();
  const entries = [...state.registry.index.entries()];
  const filtered = entries.filter(([id, hit]) => {
    if (!f) return true;
    const label = hit.kind === "competency" ? `${hit.entry.humanCodingScheme || ""} ${localized(hit.entry.statement)}` : localized(hit.entry.labels);
    return label.toLowerCase().includes(f) || id.toLowerCase().includes(f);
  });
  filtered.sort((a, b) => {
    const la = a[1].kind === "competency" ? (a[1].entry.humanCodingScheme || "") : localized(a[1].entry.labels);
    const lb = b[1].kind === "competency" ? (b[1].entry.humanCodingScheme || "") : localized(b[1].entry.labels);
    return la.localeCompare(lb);
  });
  const ul = el("ul", { class: "concept-list" });
  for (const [id, hit] of filtered.slice(0, 300)) {
    const label = hit.kind === "competency" ? (hit.entry.humanCodingScheme || localized(hit.entry.statement)) : localized(hit.entry.labels);
    const li = el("li", { class: "concept-list-item", "data-id": id });
    li.appendChild(el("span", {}, label));
    li.appendChild(el("code", { class: "id-code-sm" }, hit.vocabRef));
    li.addEventListener("click", () => selectAndRender(id));
    ul.appendChild(li);
  }
  if (!filtered.length) ul.appendChild(el("li", { class: "empty-hint" }, "No matches."));
  listHost.appendChild(ul);
}

function renderLoaded(container) {
  clear(container);
  container.appendChild(el("h2", {}, "Concept Lens"));
  container.appendChild(el("p", { class: "muted" }, "Pick any concept or competency from every vocabulary in the ConceptBase registry — not just what's currently loaded — to see its full definition, where it's used across loaded LPMs, and every alignment record connecting it to another vocabulary."));

  searchInput = el("input", { type: "text", placeholder: "Filter by label, code, or ID…", class: "concept-search" });
  container.appendChild(searchInput);

  const layout = el("div", { class: "lens-layout" });
  listHost = el("div", { class: "lens-list" });
  detailHost = el("div", { class: "lens-detail" });
  detailHost.appendChild(el("div", { class: "empty-hint" }, "Select an entry to inspect it."));
  layout.appendChild(listHost);
  layout.appendChild(detailHost);
  container.appendChild(layout);

  // Deep-link prefill (see welcomeBanner.js / main.js's ?lens= param). Cleared
  // only on genuine user typing, not here -- this render can be replayed by
  // an unrelated bundle-changed event (e.g. the LPM autoload finishing
  // shortly after a ?lens= page load) before the user has touched anything,
  // and clearing eagerly would lose the prefill to that race.
  searchInput.addEventListener("input", () => {
    state.conceptLensQuery = null;
    renderList(searchInput.value);
  });

  searchInput.value = state.conceptLensQuery || "";
  renderList(state.conceptLensQuery || "");
}

export function renderConceptLens(container) {
  clear(container);

  if (state.registry.loaded) {
    renderLoaded(container);
    return;
  }

  if (state.registry.error) {
    container.appendChild(el("div", { class: "empty-state" }, `Failed to load the ConceptBase registry: ${state.registry.error}`));
    return;
  }

  container.appendChild(el("div", { class: "empty-state" }, "Loading the full ConceptBase registry (all vocabularies)…"));

  if (state.registry.loading) return; // a load is already in flight; its callback will re-render.

  state.registry.loading = true;
  // Alignment records are a registry-wide artifact, not scoped to any
  // loaded LPM -- load them here too if a bundle load hasn't already
  // populated state.alignmentRecords, so the lens works even when no LPM
  // is loaded at all.
  const alignmentsPromise = state.alignmentRecords.length
    ? Promise.resolve(state.alignmentRecords)
    : loadAlignments(CONCEPTBASE_REGISTRY).catch((e) => {
        console.warn("[oecb-explorer] alignment load failed:", e);
        return [];
      });

  Promise.all([loadRegistryVocabularies(CONCEPTBASE_REGISTRY), alignmentsPromise])
    .then(([{ vocabularies, index }, alignmentRecords]) => {
      state.registry.vocabularies = vocabularies;
      state.registry.index = index;
      state.registry.loaded = true;
      state.registry.loading = false;
      if (!state.alignmentRecords.length) state.alignmentRecords = alignmentRecords;
      if (document.getElementById("tab-body")?.contains(container) || document.body.contains(container)) {
        renderConceptLens(container);
      }
    })
    .catch((e) => {
      state.registry.error = e.message;
      state.registry.loading = false;
      renderConceptLens(container);
    });
}
