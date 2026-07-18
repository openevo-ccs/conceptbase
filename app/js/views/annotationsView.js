import { el, clear, downloadText, todayIso } from "../utils.js";
import * as store from "../store.js";
import { emit } from "../state.js";
import { exportAlignmentDraftsYaml, exportNotesYaml, exportFullBackupYaml } from "../annotations.js";
import { parseYaml } from "../yaml.js";
import { importAnnotations } from "../store.js";

function noteCard(note) {
  const card = el("div", { class: "note-card note-card-full" });
  card.appendChild(el("div", { class: "note-card-head" }, [
    el("strong", {}, note.entityLabel || note.entityId),
    el("span", { class: "badge badge-muted" }, `LPM ${note.slot}`),
    el("span", { class: "badge badge-muted" }, note.entityType),
  ]));
  if (note.tags?.length) card.appendChild(el("div", { class: "chip-list" }, note.tags.map((t) => el("span", { class: "chip" }, t))));
  if (note.note) card.appendChild(el("p", {}, note.note));
  for (const e of note.evidence || []) card.appendChild(el("p", { class: "muted small" }, `Evidence: ${e.text}${e.url ? " — " + e.url : ""}`));
  card.appendChild(el("p", { class: "muted small" }, `Updated ${new Date(note.updatedAt).toLocaleString()}`));
  card.appendChild(
    el("button", { class: "btn btn-ghost btn-sm", onclick: () => { store.deleteNoteAnnotation(note.id); emit("annotations-changed"); render(); } }, "Delete")
  );
  return card;
}

function alignCard(draft) {
  const card = el("div", { class: "note-card note-card-full" });
  card.appendChild(el("div", { class: "note-card-head" }, [
    el("strong", {}, `${draft.subjectLabel} → ${draft.objectLabel}`),
    el("span", { class: "badge badge-muted" }, draft.matchType),
    el("span", { class: "badge badge-muted" }, draft.status),
  ]));
  card.appendChild(el("p", { class: "muted small" }, `${draft.subjectRef}  ↔  ${draft.objectRef}`));
  if (draft.rationale) card.appendChild(el("p", {}, draft.rationale));
  card.appendChild(el("p", { class: "muted small" }, `Asserted by ${draft.assertedBy} on ${draft.date}`));
  card.appendChild(
    el("button", { class: "btn btn-ghost btn-sm", onclick: () => { store.deleteAlignmentDraft(draft.id); emit("annotations-changed"); render(); } }, "Delete")
  );
  return card;
}

let containerRef = null;

export function renderAnnotations(container) {
  containerRef = container;
  render();
}

function render() {
  const container = containerRef;
  clear(container);
  const data = store.getAllAnnotations();

  container.appendChild(el("h2", {}, "My annotations"));
  container.appendChild(
    el("p", { class: "muted" }, "Everything here is stored only in this browser (localStorage). Export to a YAML file to keep it, share it, or turn it into a real pull request against a ConceptBase-conformant repository.")
  );

  const exportRow = el("div", { class: "field-row" }, [
    el("button", { class: "btn btn-primary btn-sm", onclick: () => downloadText(`oecb-alignment-drafts-${todayIso()}.yaml`, exportAlignmentDraftsYaml(data.alignments)) }, "Export alignment drafts (YAML)"),
    el("button", { class: "btn btn-primary btn-sm", onclick: () => downloadText(`oecb-annotations-${todayIso()}.yaml`, exportNotesYaml(data.notes)) }, "Export tags/notes (YAML)"),
    el("button", { class: "btn btn-secondary btn-sm", onclick: () => downloadText(`oecb-explorer-backup-${todayIso()}.yaml`, exportFullBackupYaml(data)) }, "Export full backup"),
  ]);
  container.appendChild(exportRow);

  const importInput = el("input", { type: "file", accept: ".yaml,.yml", style: "display:none" });
  importInput.addEventListener("change", async () => {
    const file = importInput.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = parseYaml(text);
      importAnnotations(parsed, { merge: true });
      emit("annotations-changed");
      render();
      alert("Import complete.");
    } catch (e) {
      alert(`Could not import file: ${e.message}`);
    }
  });
  const importBtn = el("button", { class: "btn btn-ghost btn-sm", onclick: () => importInput.click() }, "Import backup YAML");
  const clearBtn = el("button", {
    class: "btn btn-ghost btn-sm",
    onclick: () => {
      if (confirm("Clear all annotations and alignment drafts stored in this browser? This cannot be undone.")) {
        store.clearAllAnnotations();
        emit("annotations-changed");
        render();
      }
    },
  }, "Clear all");
  container.appendChild(el("div", { class: "field-row" }, [importBtn, importInput, clearBtn]));

  container.appendChild(el("h3", {}, `Alignment drafts (${data.alignments.length})`));
  if (!data.alignments.length) container.appendChild(el("div", { class: "empty-hint" }, "None yet — open a concept in the Explorer or Vocabulary tab and use \"Propose alignment\"."));
  else container.appendChild(el("div", { class: "align-grid" }, data.alignments.map(alignCard)));

  container.appendChild(el("h3", {}, `Tags & notes (${data.notes.length})`));
  if (!data.notes.length) container.appendChild(el("div", { class: "empty-hint" }, "None yet — open any strand or concept and use \"Add annotation\"."));
  else container.appendChild(el("div", { class: "align-grid" }, data.notes.map(noteCard)));
}
