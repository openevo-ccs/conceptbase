import { el, clear, escapeHtml } from "../utils.js";
import { slottedBundles } from "../state.js";
import { computeBundleStats } from "../stats.js";
import { barChart, doughnutChart } from "../charts.js";
import { pick } from "../theme.js";
import { SERIES_COLOR, GRADE_BAND_ORDER } from "../config.js";

function statTile(label, values) {
  // values: [{slot, value, color}]
  const tile = el("div", { class: "stat-tile" });
  tile.appendChild(el("div", { class: "stat-tile-label" }, label));
  const row = el("div", { class: "stat-tile-values" });
  for (const v of values) {
    row.appendChild(el("div", { class: "stat-tile-value", style: `color:${v.color}` }, String(v.value)));
  }
  tile.appendChild(row);
  return tile;
}

function issuesPanel(bundles) {
  const anyIssues = bundles.some((b) => b.issues.length);
  if (!anyIssues) return null;
  const details = el("details", { class: "issues-panel" });
  const totalWarn = bundles.reduce((n, b) => n + b.issues.filter((i) => i.severity !== "info").length, 0);
  details.appendChild(el("summary", {}, `Load notes & issues (${totalWarn} warning(s)/error(s))`));
  for (const b of bundles) {
    if (!b.issues.length) continue;
    details.appendChild(el("h4", {}, `${b.source.owner}/${b.source.repo}`));
    const list = el("ul", { class: "issue-list" });
    for (const issue of b.issues) {
      list.appendChild(el("li", { class: `issue issue-${issue.severity}` }, `[${issue.kind}] ${issue.message}`));
    }
    details.appendChild(list);
  }
  return details;
}

export function renderDashboard(container) {
  clear(container);
  const loaded = slottedBundles();
  if (!loaded.length) {
    container.appendChild(el("div", { class: "empty-state" }, "Load at least one LPM repository above to see its dashboard."));
    return;
  }
  const bundles = loaded.map((x) => x.bundle);

  const stats = loaded.map(({ slot, bundle }) => ({ bundle, s: computeBundleStats(bundle), slot }));

  container.appendChild(el("h2", {}, "Comparative dashboard"));
  container.appendChild(el("p", { class: "muted" }, bundles.length === 2 ? "Side-by-side statistics for both loaded LPMs." : "Statistics for the loaded LPM. Load a second repository to compare."));

  const tileGrid = el("div", { class: "stat-grid" });
  const metrics = [
    ["Top-level strands", (s) => s.strandCount],
    ["Sub-strands", (s) => s.subStrandCount],
    ["Unique concepts used", (s) => s.uniqueConceptsUsed],
    ["Vocabulary coverage", (s) => `${s.conceptCoveragePct}%`],
    ["Performance indicators", (s) => s.performanceIndicatorCount],
    ["Learning objects", (s) => s.learningObjectCount],
    ["Reinforcing ratio", (s) => `${Math.round(s.reinforcingRatio * 100)}%`],
    ["Concepts reinforced ≥2 strands", (s) => s.reinforcedAcrossMultiple],
  ];
  for (const [label, fn] of metrics) {
    tileGrid.appendChild(
      statTile(
        label,
        stats.map((entry) => ({ slot: entry.slot, value: fn(entry.s), color: pick(SERIES_COLOR[entry.slot]) }))
      )
    );
  }
  container.appendChild(tileGrid);

  const legend = el("div", { class: "series-legend" }, stats.map((entry) =>
    el("span", { class: "legend-item" }, [
      el("span", { class: "legend-dot", style: `background:${pick(SERIES_COLOR[entry.slot])}` }),
      `LPM ${entry.slot}: ${entry.s.lpmLabel}`,
    ])
  ));
  container.appendChild(legend);

  // Grade band coverage
  container.appendChild(el("h3", {}, "Strand/sub-strand count by grade band"));
  const gbWrap = el("div", { class: "chart-box" });
  const gbCanvas = el("canvas");
  gbWrap.appendChild(gbCanvas);
  container.appendChild(gbWrap);

  // Structure comparison (top strands / substrands / concepts / PIs) as grouped bars
  container.appendChild(el("h3", {}, "Structure comparison"));
  const structWrap = el("div", { class: "chart-box" });
  const structCanvas = el("canvas");
  structWrap.appendChild(structCanvas);
  container.appendChild(structWrap);

  // Top reinforced concepts per bundle
  for (const entry of stats) {
    container.appendChild(el("h3", {}, `Most-referenced concepts — LPM ${entry.slot}`));
    const wrap = el("div", { class: "chart-box chart-box-tall" });
    const canvas = el("canvas");
    wrap.appendChild(canvas);
    container.appendChild(wrap);
    requestAnimationFrame(() => {
      const top = entry.s.topConceptsByUsage.slice(0, 10).reverse();
      barChart(canvas, {
        labels: top.map((c) => c.label),
        datasets: [{ label: "References", data: top.map((c) => c.count), color: pick(SERIES_COLOR[entry.slot]) }],
        horizontal: true,
      });
    });
  }

  // Status distribution doughnuts
  const statusRow = el("div", { class: "chart-row" });
  for (const entry of stats) {
    const box = el("div", { class: "chart-box chart-box-small" });
    box.appendChild(el("div", { class: "chart-box-title" }, `Strand lifecycle status — LPM ${entry.slot}`));
    const canvas = el("canvas");
    box.appendChild(canvas);
    statusRow.appendChild(box);
    requestAnimationFrame(() => {
      const labels = Object.keys(entry.s.statusCounts);
      doughnutChart(canvas, {
        labels,
        data: labels.map((l) => entry.s.statusCounts[l]),
        colors: labels.map((_, i) => [pick(SERIES_COLOR.A), pick(SERIES_COLOR.B), "#eda100", "#4a3aa7"][i % 4]),
      });
    });
  }
  container.appendChild(statusRow);

  const issues = issuesPanel(bundles);
  if (issues) container.appendChild(issues);

  requestAnimationFrame(() => {
    const allBands = GRADE_BAND_ORDER.filter((b) => stats.some((e) => e.s.gradeBandCounts[b]));
    barChart(gbCanvas, {
      labels: allBands.length ? allBands : ["(no grade-band data)"],
      datasets: stats.map((entry) => ({
        label: `LPM ${entry.slot}`,
        data: (allBands.length ? allBands : ["(no grade-band data)"]).map((b) => entry.s.gradeBandCounts[b] || 0),
        color: pick(SERIES_COLOR[entry.slot]),
      })),
    });

    const structLabels = ["Top strands", "Sub-strands", "Unique concepts", "Perf. indicators", "Learning objects"];
    barChart(structCanvas, {
      labels: structLabels,
      datasets: stats.map((entry) => ({
        label: `LPM ${entry.slot}`,
        data: [entry.s.strandCount, entry.s.subStrandCount, entry.s.uniqueConceptsUsed, entry.s.performanceIndicatorCount, entry.s.learningObjectCount],
        color: pick(SERIES_COLOR[entry.slot]),
      })),
    });
  });
}
