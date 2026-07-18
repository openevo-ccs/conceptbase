// Side-panel "inspector": shows full detail for any clicked entity (LPM,
// strand/substrand, concept, learning object) and hosts the annotate/tag
// form plus the "propose alignment to a concept in the other loaded LPM"
// action. This is the app's main entry point into the annotation system.

import { el, clear, escapeHtml, localized, todayIso } from "./utils.js";
import { state, bundleFor, activeBundles, emit } from "./state.js";
import * as store from "./store.js";
import { SERIES_COLOR } from "./config.js";
import { pick } from "./theme.js";

let panelEl = null;

export function mountInspector(root) {
  panelEl = el("aside", { class: "inspector", id: "inspector" });
  root.appendChild(panelEl);
  close();
  return panelEl;
}

export function close() {
  state.inspector = { open: false, entity: null };
  if (panelEl) {
    panelEl.classList.remove("open");
    clear(panelEl);
  }
}

export function open(entity) {
  state.inspector = { open: true, entity };
  render();
  panelEl.classList.add("open");
}

function relationList(title, ids, resolveLabel) {
  if (!ids || !ids.length) return null;
  return el("div", { class: "field" }, [
    el("div", { class: "field-label" }, title),
    el(
      "ul",
      { class: "chip-list" },
      ids.map((id) => el("li", { class: "chip chip-ref" }, resolveLabel(id)))
    ),
  ]);
}

function conceptDetail(entity) {
  const { data, slot, vocabRef } = entity;
  const bundle = bundleFor(slot);
  const resolveLabel = (id) => {
    const hit = bundle?.conceptIndex.get(id);
    return hit ? `${localized(hit.concept.labels)} (${id})` : id;
  };
  const wrap = el("div", { class: "detail" });
  wrap.appendChild(el("h3", {}, localized(data.labels)));
  wrap.appendChild(el("div", { class: "meta-row" }, [
    el("span", { class: "badge" }, data.status),
    el("span", { class: "badge badge-muted" }, `v${data.version}`),
    el("span", { class: "badge badge-muted" }, vocabRef || ""),
  ]));
  wrap.appendChild(el("code", { class: "id-code" }, data.id));

  const defs = data.definitions?.en || {};
  for (const [discipline, text] of Object.entries(defs)) {
    wrap.appendChild(
      el("div", { class: "field" }, [el("div", { class: "field-label" }, discipline), el("p", {}, text)])
    );
  }
  if (data.aliases?.en?.length) {
    wrap.appendChild(el("div", { class: "field" }, [el("div", { class: "field-label" }, "Aliases"), el("p", {}, data.aliases.en.join(", "))]));
  }
  const rel = data.relations || {};
  const r1 = relationList("Broader", rel["skos:broader"], resolveLabel);
  const r2 = relationList("Narrower", rel["skos:narrower"], resolveLabel);
  const r3 = relationList("Related", rel["skos:related"], resolveLabel);
  [r1, r2, r3].forEach((n) => n && wrap.appendChild(n));

  if (data.examples?.length) {
    wrap.appendChild(el("div", { class: "field" }, [el("div", { class: "field-label" }, "Examples"), el("ul", {}, data.examples.map((x) => el("li", {}, x)))]));
  }
  if (data.nonExamples?.length) {
    wrap.appendChild(el("div", { class: "field" }, [el("div", { class: "field-label" }, "Non-examples"), el("ul", {}, data.nonExamples.map((x) => el("li", {}, x)))]));
  }

  const usage = bundle?.usedConcepts.get(data.id);
  if (usage) {
    wrap.appendChild(
      el("div", { class: "field" }, [
        el("div", { class: "field-label" }, "Usage in this LPM"),
        el("p", {}, `Referenced ${usage.count}× across ${usage.strandIds.size} strand(s) — ${usage.primary} primary, ${usage.reinforcing} reinforcing.`),
      ])
    );
  }
  return wrap;
}

function strandDetail(entity) {
  const { data } = entity;
  const wrap = el("div", { class: "detail" });
  wrap.appendChild(el("h3", {}, localized(data.labels)));
  wrap.appendChild(el("div", { class: "meta-row" }, [
    el("span", { class: "badge" }, data.type === "oe:SubStrand" ? "Sub-strand" : "Strand"),
    el("span", { class: "badge" }, data.status),
    data.typicalGradeBand ? el("span", { class: "badge badge-muted" }, data.typicalGradeBand) : null,
    data.required === false ? el("span", { class: "badge badge-warn" }, "optional") : null,
  ]));
  wrap.appendChild(el("code", { class: "id-code" }, data.id));
  if (data.description) wrap.appendChild(el("p", {}, localized(data.description)));
  if (data.associatedDomains?.length) {
    wrap.appendChild(el("div", { class: "field" }, [el("div", { class: "field-label" }, "Domains"), el("p", {}, data.associatedDomains.join(", "))]));
  }
  if (data.concepts?.length) {
    wrap.appendChild(
      el("div", { class: "field" }, [
        el("div", { class: "field-label" }, "Concepts"),
        el(
          "ul",
          { class: "chip-list" },
          data.concepts.map((c) =>
            el("li", { class: `chip ${c.emphasis === "primary" ? "chip-primary" : "chip-reinforcing"}` }, `${c.id} · ${c.emphasis}`)
          )
        ),
      ])
    );
  }
  if (data.performanceIndicators?.length) {
    wrap.appendChild(
      el("div", { class: "field" }, [
        el("div", { class: "field-label" }, "Performance indicators"),
        el("ul", {}, data.performanceIndicators.map((p) => el("li", {}, p))),
      ])
    );
  }
  if (data.learningObjects?.length) {
    wrap.appendChild(
      el("div", { class: "field" }, [
        el("div", { class: "field-label" }, "Learning objects"),
        el("ul", {}, data.learningObjects.map((lo) => el("li", {}, lo.unresolved ? `${lo.id} (unresolved)` : `${localized(lo.labels) || lo.id} — ${lo.kind || "?"}`))),
      ])
    );
  }
  return wrap;
}

function lpmDetail(entity) {
  const { data } = entity;
  const wrap = el("div", { class: "detail" });
  wrap.appendChild(el("h3", {}, localized(data.labels)));
  wrap.appendChild(el("div", { class: "meta-row" }, [el("span", { class: "badge" }, data.status), el("span", { class: "badge badge-muted" }, `v${data.version}`)]));
  wrap.appendChild(el("code", { class: "id-code" }, data.id));
  if (data.description) wrap.appendChild(el("p", {}, localized(data.description)));
  if (data.authors?.length) wrap.appendChild(el("div", { class: "field" }, [el("div", { class: "field-label" }, "Authors"), el("p", {}, data.authors.map((a) => a.name).join(", "))]));
  wrap.appendChild(el("div", { class: "field" }, [el("div", { class: "field-label" }, "Vocabularies"), el("p", {}, (data.conceptbase?.vocabularies || []).join(", "))]));
  return wrap;
}

function renderAlignPicker(entity, host) {
  const others = activeBundles().filter((b) => b !== bundleFor(entity.slot));
  if (entity.type !== "concept" || !others.length) return;

  const otherSlot = entity.slot === "A" ? "B" : "A";
  const otherBundle = bundleFor(otherSlot);
  if (!otherBundle) return;

  const options = [...otherBundle.usedConcepts.keys()].map((id) => {
    const hit = otherBundle.conceptIndex.get(id);
    return { id, label: hit ? localized(hit.concept.labels) : id };
  });
  options.sort((a, b) => a.label.localeCompare(b.label));

  const select = el(
    "select",
    { id: "align-target" },
    [el("option", { value: "" }, "— choose a concept —"), ...options.map((o) => el("option", { value: o.id }, `${o.label} (${o.id})`))]
  );
  const matchType = el("select", { id: "align-matchtype" }, [
    "skos:closeMatch", "skos:exactMatch", "skos:broadMatch", "skos:narrowMatch", "skos:relatedMatch",
  ].map((m) => el("option", { value: m }, m)));
  const status = el("select", { id: "align-status" }, ["proposed", "accepted", "contested"].map((s) => el("option", { value: s }, s)));
  const rationale = el("textarea", { id: "align-rationale", rows: "3", placeholder: "Why do these concepts relate? What's similar, what differs?" });

  host.appendChild(el("h4", {}, `Propose alignment → LPM ${otherSlot}`));
  host.appendChild(el("div", { class: "field" }, [el("div", { class: "field-label" }, `Target concept in ${otherBundle.lpm.labels ? localized(otherBundle.lpm.labels) : otherSlot}`), select]));
  host.appendChild(el("div", { class: "field-row" }, [
    el("div", { class: "field" }, [el("div", { class: "field-label" }, "Match type"), matchType]),
    el("div", { class: "field" }, [el("div", { class: "field-label" }, "Status"), status]),
  ]));
  host.appendChild(el("div", { class: "field" }, [el("div", { class: "field-label" }, "Rationale"), rationale]));
  host.appendChild(
    el("button", {
      class: "btn btn-primary",
      onclick: () => {
        if (!select.value) {
          select.focus();
          return;
        }
        const subjectRef = `${entity.vocabRef}:${entity.data.id}`;
        const objectVocab = otherBundle.conceptIndex.get(select.value)?.vocabRef;
        const objectRef = `${objectVocab}:${select.value}`;
        store.addAlignmentDraft({
          subjectRef,
          subjectLabel: localized(entity.data.labels),
          objectRef,
          objectLabel: options.find((o) => o.id === select.value)?.label,
          matchType: matchType.value,
          status: status.value,
          assertedBy: store.getAuthorName() || "Anonymous ConceptBase Explorer user",
          date: todayIso(),
          rationale: rationale.value,
        });
        emit("annotations-changed");
        render();
      },
    }, "Save alignment draft")
  );
}

function annotateForm(entity, host) {
  const existing = store.notesForEntity(entity.id).filter((n) => n.slot === entity.slot);

  host.appendChild(el("h4", {}, "Tag & annotate"));
  const tagsInput = el("input", { type: "text", id: "note-tags", placeholder: "tags, comma, separated" });
  const noteInput = el("textarea", { id: "note-text", rows: "3", placeholder: "Notes, observations, questions…" });
  const evText = el("input", { type: "text", id: "ev-text", placeholder: "Evidence citation text" });
  const evUrl = el("input", { type: "text", id: "ev-url", placeholder: "https:// (optional)" });

  host.appendChild(el("div", { class: "field" }, [el("div", { class: "field-label" }, "Tags"), tagsInput]));
  host.appendChild(el("div", { class: "field" }, [el("div", { class: "field-label" }, "Note"), noteInput]));
  host.appendChild(el("div", { class: "field" }, [el("div", { class: "field-label" }, "Evidence (optional)"), evText, evUrl]));
  host.appendChild(
    el("button", {
      class: "btn btn-primary",
      onclick: () => {
        const tags = tagsInput.value.split(",").map((t) => t.trim()).filter(Boolean);
        const evidence = evText.value ? [{ text: evText.value, url: evUrl.value || undefined }] : [];
        store.addNoteAnnotation({
          entityId: entity.id,
          entityType: entity.type,
          entityLabel: entity.label,
          slot: entity.slot,
          vocabRef: entity.vocabRef,
          tags,
          note: noteInput.value,
          evidence,
          author: store.getAuthorName() || undefined,
        });
        emit("annotations-changed");
        render();
      },
    }, "Add annotation")
  );

  if (existing.length) {
    host.appendChild(el("div", { class: "field-label", style: "margin-top:14px" }, `Existing annotations (${existing.length})`));
    for (const n of existing) {
      const card = el("div", { class: "note-card" });
      if (n.tags?.length) card.appendChild(el("div", { class: "chip-list" }, n.tags.map((t) => el("span", { class: "chip" }, t))));
      if (n.note) card.appendChild(el("p", {}, n.note));
      for (const e of n.evidence || []) card.appendChild(el("p", { class: "muted small" }, `Evidence: ${e.text}${e.url ? " — " + e.url : ""}`));
      card.appendChild(
        el("button", { class: "btn btn-ghost btn-sm", onclick: () => { store.deleteNoteAnnotation(n.id); emit("annotations-changed"); render(); } }, "Remove")
      );
      host.appendChild(card);
    }
  }
}

export function render() {
  if (!panelEl || !state.inspector.open) return;
  clear(panelEl);
  const entity = state.inspector.entity;
  const header = el("div", { class: "inspector-header" }, [
    el("span", { class: "slot-dot", style: `background:${pick(SERIES_COLOR[entity.slot] || SERIES_COLOR.A)}` }),
    el("span", { class: "muted" }, `LPM ${entity.slot}`),
    el("button", { class: "btn btn-ghost btn-sm inspector-close", onclick: close }, "✕"),
  ]);
  panelEl.appendChild(header);

  let detailNode;
  if (entity.type === "concept") detailNode = conceptDetail(entity);
  else if (entity.type === "lpm") detailNode = lpmDetail(entity);
  else detailNode = strandDetail(entity);
  panelEl.appendChild(detailNode);

  const annotateHost = el("div", { class: "annotate-block" });
  annotateForm(entity, annotateHost);
  panelEl.appendChild(annotateHost);

  if (entity.type === "concept") {
    const alignHost = el("div", { class: "annotate-block" });
    renderAlignPicker(entity, alignHost);
    if (alignHost.childNodes.length) panelEl.appendChild(alignHost);
  }
}

export function isOpen() {
  return state.inspector.open;
}
