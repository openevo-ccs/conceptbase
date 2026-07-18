// Chart.js helpers, styled per the dataviz skill: thin marks, rounded bar
// ends, a single shared scale (never dual-axis), recessive gridlines, a
// legend whenever there is more than one series, and the built-in Chart.js
// tooltip as the hover layer. Chart.js itself is loaded globally via CDN
// (window.Chart) — see index.html.

import { currentMode } from "./theme.js";

const registry = new Map();

function ink(mode) {
  return {
    primary: mode === "dark" ? "#ffffff" : "#0b0b0b",
    secondary: mode === "dark" ? "#c3c2b7" : "#52514e",
    muted: "#898781",
    grid: mode === "dark" ? "#2c2c2a" : "#e1e0d9",
    axis: mode === "dark" ? "#383835" : "#c3c2b7",
    surface: mode === "dark" ? "#1a1a19" : "#fcfcfb",
  };
}

function baseFont() {
  return { family: "system-ui, -apple-system, 'Segoe UI', sans-serif", size: 12 };
}

export function destroyChart(canvas) {
  const existing = registry.get(canvas);
  if (existing) {
    existing.destroy();
    registry.delete(canvas);
  }
}

/**
 * Grouped/single-series bar chart. `datasets`: [{label, data, color}]
 * `horizontal`: renders as a horizontal bar (better for long category labels).
 */
export function barChart(canvas, { labels, datasets, horizontal = false, stacked = false, suggestedMax } = {}) {
  if (!window.Chart) return null;
  destroyChart(canvas);
  const mode = currentMode();
  const c = ink(mode);
  const showLegend = datasets.length > 1;

  const chart = new window.Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: datasets.map((d) => ({
        label: d.label,
        data: d.data,
        backgroundColor: d.color,
        borderRadius: 4,
        borderSkipped: false,
        maxBarThickness: 28,
        categoryPercentage: 0.7,
        barPercentage: 0.85,
      })),
    },
    options: {
      indexAxis: horizontal ? "y" : "x",
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 200 },
      interaction: { mode: "nearest", intersect: true },
      plugins: {
        legend: {
          display: showLegend,
          position: "top",
          align: "start",
          labels: { color: c.secondary, font: baseFont(), boxWidth: 12, usePointStyle: true, pointStyle: "circle" },
        },
        tooltip: {
          backgroundColor: c.surface,
          titleColor: c.primary,
          bodyColor: c.secondary,
          borderColor: c.axis,
          borderWidth: 1,
          padding: 10,
          cornerRadius: 6,
          displayColors: showLegend,
        },
      },
      scales: {
        x: {
          stacked,
          suggestedMax: horizontal ? suggestedMax : undefined,
          grid: { color: horizontal ? c.grid : "transparent", drawTicks: false },
          border: { color: c.axis },
          ticks: { color: c.muted, font: baseFont() },
        },
        y: {
          stacked,
          suggestedMax: horizontal ? undefined : suggestedMax,
          grid: { color: horizontal ? "transparent" : c.grid, drawTicks: false },
          border: { color: c.axis },
          ticks: { color: c.muted, font: baseFont(), beginAtZero: true },
          beginAtZero: true,
        },
      },
    },
  });
  registry.set(canvas, chart);
  return chart;
}

export function doughnutChart(canvas, { labels, data, colors }) {
  if (!window.Chart) return null;
  destroyChart(canvas);
  const mode = currentMode();
  const c = ink(mode);
  const chart = new window.Chart(canvas, {
    type: "doughnut",
    data: { labels, datasets: [{ data, backgroundColor: colors, borderColor: c.surface, borderWidth: 2 }] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "right", labels: { color: c.secondary, font: baseFont(), boxWidth: 12, usePointStyle: true, pointStyle: "circle" } },
        tooltip: { backgroundColor: c.surface, titleColor: c.primary, bodyColor: c.secondary, borderColor: c.axis, borderWidth: 1, padding: 10, cornerRadius: 6 },
      },
      cutout: "62%",
    },
  });
  registry.set(canvas, chart);
  return chart;
}
