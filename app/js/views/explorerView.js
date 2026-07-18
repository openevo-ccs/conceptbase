import { el, clear, localized } from "../utils.js";
import { slottedBundles } from "../state.js";
import { open as openInspector } from "../inspector.js";
import { pick } from "../theme.js";
import { SERIES_COLOR } from "../config.js";

function conceptChip(ref, bundle, slot) {
  const hit = bundle.conceptIndex.get(ref.id);
  const label = hit ? localized(hit.concept.labels) : ref.id;
  const chip = el("button", { class: `chip chip-btn ${ref.emphasis === "primary" ? "chip-primary" : "chip-reinforcing"}` }, label);
  chip.addEventListener("click", (e) => {
    e.stopPropagation();
    if (hit) openInspector({ type: "concept", id: ref.id, label, slot, vocabRef: hit.vocabRef, data: hit.concept });
  });
  return chip;
}

function strandNode(node, bundle, slot) {
  const wrapper = el("li", { class: "tree-node" });
  const row = el("div", { class: "tree-row" });
  const toggle = node.subStrands?.length ? el("span", { class: "tree-toggle" }, "▸") : el("span", { class: "tree-toggle tree-toggle-empty" });
  row.appendChild(toggle);
  row.appendChild(el("span", { class: "tree-label" }, localized(node.labels)));
  if (node.typicalGradeBand) row.appendChild(el("span", { class: "badge badge-muted badge-sm" }, node.typicalGradeBand));
  if (node.required === false) row.appendChild(el("span", { class: "badge badge-warn badge-sm" }, "optional"));
  row.addEventListener("click", () => openInspector({ type: node.type === "oe:SubStrand" ? "substrand" : "strand", id: node.id, label: localized(node.labels), slot, data: node }));
  wrapper.appendChild(row);

  if (node.concepts?.length) {
    const chipRow = el("div", { class: "tree-chips" }, node.concepts.map((c) => conceptChip(c, bundle, slot)));
    wrapper.appendChild(chipRow);
  }

  if (node.subStrands?.length) {
    const childList = el("ul", { class: "tree-children" });
    for (const child of node.subStrands) childList.appendChild(strandNode(child, bundle, slot));
    wrapper.appendChild(childList);
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const collapsed = childList.classList.toggle("collapsed");
      toggle.textContent = collapsed ? "▸" : "▾";
    });
  }
  return wrapper;
}

export function renderExplorer(container) {
  clear(container);
  const loaded = slottedBundles();
  if (!loaded.length) {
    container.appendChild(el("div", { class: "empty-state" }, "Load at least one LPM repository above to explore its structure."));
    return;
  }

  container.appendChild(el("h2", {}, "Structure explorer"));
  container.appendChild(el("p", { class: "muted" }, "Browse each LPM's strand hierarchy. Click a strand for its full detail, or a concept chip to inspect that concept. Primary concept references are solid; reinforcing references are outlined."));

  const cols = el("div", { class: "explorer-columns" });
  for (const { slot, bundle } of loaded) {
    const col = el("div", { class: "explorer-column" });
    col.appendChild(el("div", { class: "chart-box-title" }, [
      el("span", { class: "legend-dot", style: `background:${pick(SERIES_COLOR[slot])}` }),
      ` LPM ${slot} — ${localized(bundle.lpm.labels)}`,
    ]));
    const openLpm = el("button", { class: "btn btn-ghost btn-sm", style: "margin-bottom:8px" }, "Inspect LPM metadata");
    openLpm.addEventListener("click", () => openInspector({ type: "lpm", id: bundle.lpm.id, label: localized(bundle.lpm.labels), slot, data: bundle.lpm }));
    col.appendChild(openLpm);

    const tree = el("ul", { class: "tree-root" });
    for (const top of bundle.strandTree) tree.appendChild(strandNode(top, bundle, slot));
    col.appendChild(tree);
    cols.appendChild(col);
  }
  container.appendChild(cols);
}
