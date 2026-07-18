// localStorage-backed persistence for annotations and light user prefs.
// This app has no backend (GitHub Pages is static), so annotation/tagging
// work is durable only via localStorage + explicit YAML export/import.

import { LS_KEYS } from "./config.js";
import { uid } from "./utils.js";

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("[oecb-explorer] could not persist to localStorage:", e);
  }
}

// --- Annotations -----------------------------------------------------------
// Shape of an annotation:
// {
//   id, entityId, entityType ('lpm'|'strand'|'substrand'|'concept'|'learningObject'),
//   entityLabel, slot ('A'|'B'), vocabRef,
//   tags: [string], note: string,
//   evidence: [{text, url, doi}],
//   createdAt, updatedAt
// }
//
// Shape of an alignment draft:
// {
//   id, subjectRef, subjectLabel, objectRef, objectLabel,
//   matchType, status, assertedBy, date, rationale, createdAt
// }

export function getAllAnnotations() {
  return read(LS_KEYS.annotations, { notes: [], alignments: [] });
}

function saveAll(data) {
  write(LS_KEYS.annotations, data);
}

export function addNoteAnnotation(partial) {
  const data = getAllAnnotations();
  const now = new Date().toISOString();
  const rec = { id: uid(), tags: [], note: "", evidence: [], createdAt: now, updatedAt: now, ...partial };
  data.notes.push(rec);
  saveAll(data);
  return rec;
}

export function updateNoteAnnotation(id, patch) {
  const data = getAllAnnotations();
  const rec = data.notes.find((n) => n.id === id);
  if (!rec) return null;
  Object.assign(rec, patch, { updatedAt: new Date().toISOString() });
  saveAll(data);
  return rec;
}

export function deleteNoteAnnotation(id) {
  const data = getAllAnnotations();
  data.notes = data.notes.filter((n) => n.id !== id);
  saveAll(data);
}

export function notesForEntity(entityId) {
  return getAllAnnotations().notes.filter((n) => n.entityId === entityId);
}

export function addAlignmentDraft(partial) {
  const data = getAllAnnotations();
  const now = new Date().toISOString();
  const rec = { id: uid(), createdAt: now, ...partial };
  data.alignments.push(rec);
  saveAll(data);
  return rec;
}

export function deleteAlignmentDraft(id) {
  const data = getAllAnnotations();
  data.alignments = data.alignments.filter((a) => a.id !== id);
  saveAll(data);
}

export function clearAllAnnotations() {
  saveAll({ notes: [], alignments: [] });
}

export function importAnnotations(data, { merge = true } = {}) {
  const incoming = { notes: data.notes || [], alignments: data.alignments || [] };
  if (!merge) {
    saveAll(incoming);
    return getAllAnnotations();
  }
  const existing = getAllAnnotations();
  const existingNoteIds = new Set(existing.notes.map((n) => n.id));
  const existingAlignIds = new Set(existing.alignments.map((a) => a.id));
  for (const n of incoming.notes) if (!existingNoteIds.has(n.id)) existing.notes.push(n);
  for (const a of incoming.alignments) if (!existingAlignIds.has(a.id)) existing.alignments.push(a);
  saveAll(existing);
  return existing;
}

// --- Light prefs -------------------------------------------------------------

export function getAuthorName() {
  try {
    return localStorage.getItem(LS_KEYS.authorName) || "";
  } catch {
    return "";
  }
}

export function setAuthorName(name) {
  try {
    localStorage.setItem(LS_KEYS.authorName, name || "");
  } catch {
    /* ignore */
  }
}

export function getLastSlots() {
  return read(LS_KEYS.lastSlots, null);
}

export function setLastSlots(slots) {
  write(LS_KEYS.lastSlots, slots);
}
