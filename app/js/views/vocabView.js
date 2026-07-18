import { el, clear, localized } from "../utils.js";
import { slottedBundles } from "../state.js";
import { renderWordCloud } from "../wordcloud.js";
import { open as openInspector } from "../inspector.js";
import { pick } from "../theme.js";
import { SERIES_COLOR } from "../config.js";

function vocabMetaTable(loaded) {
  const table = el("table", { class: "compare-table" });
  const rows = [
    ["Vocabulary", (v) => v.vocabularies.map((x) => x.ref).join(", ") || "—"],
    ["Discipline", (v) => v.vocabularies.map((x) => x.meta?.discipline).filter(Boolean).join(", ") || "—"],
    ["Scope", (v) => v.vocabularies.map((x) => (x.meta?.scope || "").trim()).filter(Boolean).join(" / ") || "—"],
    ["Concepts defined", (v) => v.vocabularies.reduce((n, x) => n + x.concepts.size, 0)],
    ["Concepts used by this LPM", (v) => v.usedConcepts.size],
    ["License", (v) => v.vocabularies.map((x) => x.meta?.license).filter(Boolean).join(", ") || "—"],
  ];
  const head = el("tr", {}, [el("th", {}, ""), ...loaded.map((l) => el("th", {}, `LPM ${l.slot}`))]);
  table.appendChild(el("thead", {}, head));
  const body = el("tbody");
  for (const [label, fn] of rows) {
    body.appendChild(el("tr", {}, [el("th", { class: "row-label" }, label), ...loaded.map((l) => el("td", {}, String(fn(l.bundle))))]));
  }
  table.appendChild(body);
  return table;
}

function wordWeightsFor(bundle) {
  return [...bundle.usedConcepts.entries()].map(([id, rec]) => {
    const hit = bundle.conceptIndex.get(id);
    return [hit ? localized(hit.concept.labels) : id, rec.count, id];
  });
}

export function renderVocab(container) {
  clear(container);
  const loaded = slottedBundles();
  if (!loaded.length) {
    container.appendChild(el("div", { class: "empty-state" }, "Load at least one LPM repository above to explore its vocabulary."));
    return;
  }

  container.appendChild(el("h2", {}, "Vocabulary comparison"));
  container.appendChild(el("p", { class: "muted" }, "Concept usage word clouds — sized by how many times each concept is referenced across the loaded LPM's strands. Click a word to inspect the concept."));

  container.appendChild(vocabMetaTable(loaded));

  const cloudRow = el("div", { class: "cloud-row" });
  for (const { slot, bundle } of loaded) {
    const box = el("div", { class: "cloud-box" });
    box.appendChild(el("div", { class: "chart-box-title" }, [
      el("span", { class: "legend-dot", style: `background:${pick(SERIES_COLOR[slot])}` }),
      ` LPM ${slot} — ${bundle.vocabularies.map((v) => v.ref).join(", ")}`,
    ]));
    const cloudHost = el("div", { class: "cloud-host" });
    box.appendChild(cloudHost);
    cloudRow.appendChild(box);
    requestAnimationFrame(() => {
      renderWordCloud(cloudHost, wordWeightsFor(bundle), {
        color: pick(SERIES_COLOR[slot]),
        onClick: (word) => {
          const entry = [...bundle.conceptIndex.entries()].find(([, v]) => localized(v.concept.labels) === word);
          if (entry) openInspector({ type: "concept", id: entry[0], label: word, slot, vocabRef: entry[1].vocabRef, data: entry[1].concept });
        },
      });
    });
  }
  container.appendChild(cloudRow);

  container.appendChild(el("h3", {}, "Concept browser"));
  const search = el("input", { type: "text", placeholder: "Filter concepts by label…", class: "concept-search" });
  container.appendChild(search);

  const listWrap = el("div", { class: "concept-list-grid" });
  container.appendChild(listWrap);

  function renderList(filter) {
    clear(listWrap);
    for (const { slot, bundle } of loaded) {
      const col = el("div", { class: "concept-column" });
      col.appendChild(el("div", { class: "chart-box-title" }, `LPM ${slot} vocabulary`));
      const ul = el("ul", { class: "concept-list" });
      const allConcepts = bundle.vocabularies.flatMap((v) => [...v.concepts.values()].map((c) => ({ c, vocabRef: v.ref })));
      const f = filter.trim().toLowerCase();
      const used = bundle.usedConcepts;
      const filtered = allConcepts.filter(({ c }) => !f || localized(c.labels).toLowerCase().includes(f) || c.id.includes(f.toUpperCase()));
      filtered.sort((a, b) => (used.has(b.c.id) ? 1 : 0) - (used.has(a.c.id) ? 1 : 0));
      for (const { c, vocabRef } of filtered.slice(0, 200)) {
        const isUsed = used.has(c.id);
        const li = el("li", { class: `concept-list-item ${isUsed ? "concept-used" : "concept-unused"}` });
        li.appendChild(el("span", {}, localized(c.labels)));
        li.appendChild(el("code", { class: "id-code-sm" }, c.id));
        li.addEventListener("click", () => openInspector({ type: "concept", id: c.id, label: localized(c.labels), slot, vocabRef, data: c }));
        ul.appendChild(li);
      }
      if (!filtered.length) ul.appendChild(el("li", { class: "empty-hint" }, "No matches."));
      col.appendChild(ul);
      listWrap.appendChild(col);
    }
  }
  search.addEventListener("input", () => renderList(search.value));
  renderList("");
}
