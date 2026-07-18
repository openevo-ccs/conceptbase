import { el, clear, localized } from "../utils.js";
import { state, slottedBundles } from "../state.js";
import { matchAlignments, findCandidateOverlaps, existingAlignmentPairSet } from "../alignments.js";
import { open as openInspector } from "../inspector.js";
import { STATUS_COLOR } from "../config.js";
import { pick } from "../theme.js";

function statusBadge(status) {
  const map = { accepted: "good", proposed: "warning", contested: "critical" };
  const key = map[status] || "warning";
  return el("span", { class: "badge badge-status", style: `background:${pick(STATUS_COLOR[key])}22;color:${pick(STATUS_COLOR[key])};border-color:${pick(STATUS_COLOR[key])}55` }, status);
}

function formalAlignmentCard(match, loaded) {
  const rec = match.record;
  const card = el("div", { class: "align-card" });
  card.appendChild(el("div", { class: "align-card-head" }, [
    el("code", { class: "id-code-sm" }, rec.id),
    statusBadge(rec.status),
    el("span", { class: "badge badge-muted" }, rec.matchType),
  ]));
  const row = el("div", { class: "align-pair" });
  for (const side of [match.subject, match.object]) {
    const label = side.resolved ? localized(side.resolved.concept.labels) : side.conceptId;
    const btn = el("button", { class: "btn btn-link" }, `${label} (${side.vocabRef || "?"})`);
    if (side.resolved && side.slot) {
      btn.addEventListener("click", () =>
        openInspector({ type: "concept", id: side.resolved.concept.id, label, slot: side.slot, vocabRef: side.resolved.vocabRef, data: side.resolved.concept })
      );
    } else {
      btn.disabled = true;
    }
    row.appendChild(btn);
  }
  card.appendChild(row);
  card.appendChild(el("p", { class: "align-rationale" }, rec.rationale));
  card.appendChild(el("p", { class: "muted small" }, `Asserted by ${(rec.assertedBy || []).join(", ")} on ${rec.date}`));
  return card;
}

function candidateCard(cand, loaded) {
  const card = el("div", { class: "align-card align-card-candidate" });
  card.appendChild(el("div", { class: "align-card-head" }, [
    el("span", { class: "badge badge-muted" }, "candidate overlap"),
    el("span", { class: "badge badge-muted" }, `similarity ${Math.round(cand.score * 100)}%`),
  ]));
  const row = el("div", { class: "align-pair" });
  const aSlot = loaded.find((l) => l.bundle.conceptIndex.get(cand.a.concept.id))?.slot;
  const bSlot = loaded.find((l) => l.bundle.conceptIndex.get(cand.b.concept.id))?.slot;
  row.appendChild(
    el("button", { class: "btn btn-link", onclick: () => openInspector({ type: "concept", id: cand.a.concept.id, label: localized(cand.a.concept.labels), slot: aSlot, vocabRef: cand.a.vocabRef, data: cand.a.concept }) },
      `${localized(cand.a.concept.labels)} (${cand.a.vocabRef})`)
  );
  row.appendChild(
    el("button", { class: "btn btn-link", onclick: () => openInspector({ type: "concept", id: cand.b.concept.id, label: localized(cand.b.concept.labels), slot: bSlot, vocabRef: cand.b.vocabRef, data: cand.b.concept }) },
      `${localized(cand.b.concept.labels)} (${cand.b.vocabRef})`)
  );
  card.appendChild(row);
  card.appendChild(el("p", { class: "muted small" }, "No formal alignment record exists yet for this pair — label/definition similarity suggests it may be worth reviewing. Open either concept to propose an alignment."));
  return card;
}

export function renderAlign(container) {
  clear(container);
  const loaded = slottedBundles();
  if (!loaded.length) {
    container.appendChild(el("div", { class: "empty-state" }, "Load at least one LPM repository above to see alignments and conflicts."));
    return;
  }

  container.appendChild(el("h2", {}, "Alignments & conflicts"));
  container.appendChild(
    el("p", { class: "muted" }, "Formal cross-vocabulary alignment records from the ConceptBase registry, plus heuristic candidate overlaps for pairs with no formal record yet. A \"contested\" status is intentional per the ConceptBase pluralism model — it means the theoretical question is still open, not that the data is broken.")
  );

  const [first, second] = loaded;
  const conceptIndexA = first?.bundle.conceptIndex;
  const conceptIndexB = second?.bundle.conceptIndex;

  const matches = matchAlignments(state.alignmentRecords, conceptIndexA, conceptIndexB);
  container.appendChild(el("h3", {}, `Formal alignment records (${matches.length})`));
  if (!matches.length) {
    container.appendChild(el("div", { class: "empty-hint" }, state.alignmentRecords.length ? "No registered alignment records connect concepts used by the loaded LPM(s)." : "No alignment records loaded yet."));
  } else {
    const grid = el("div", { class: "align-grid" }, matches.map((m) => formalAlignmentCard(m, loaded)));
    container.appendChild(grid);
  }

  if (loaded.length === 2) {
    const existingPairs = existingAlignmentPairSet(state.alignmentRecords);
    const candidates = findCandidateOverlaps(first.bundle, second.bundle, existingPairs);
    container.appendChild(el("h3", {}, `Candidate overlaps without a formal alignment (${candidates.length})`));
    container.appendChild(el("p", { class: "muted small" }, "Heuristic label/definition similarity between concepts across the two loaded vocabularies — not an authoritative claim, a starting point for review."));
    if (!candidates.length) {
      container.appendChild(el("div", { class: "empty-hint" }, "No candidate overlaps found above the similarity threshold."));
    } else {
      container.appendChild(el("div", { class: "align-grid" }, candidates.map((c) => candidateCard(c, loaded))));
    }
  } else {
    container.appendChild(el("div", { class: "empty-hint" }, "Load a second LPM (built on a different vocabulary) to see candidate overlap detection."));
  }
}
