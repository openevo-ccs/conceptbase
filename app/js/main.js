import { el, clear } from "./utils.js";
import { state, on, emit } from "./state.js";
import { initTheme, toggleTheme, currentMode } from "./theme.js";
import { mountLoadPanel, triggerAutoLoad } from "./loadPanel.js";
import { mountWelcomeBanner } from "./welcomeBanner.js";
import { mountInspector, close as closeInspector, render as rerenderInspector, isOpen as inspectorOpen } from "./inspector.js";
import { renderDashboard } from "./views/dashboardView.js";
import { renderVocab } from "./views/vocabView.js";
import { renderAlign } from "./views/alignView.js";
import { renderExplorer } from "./views/explorerView.js";
import { renderAnnotations } from "./views/annotationsView.js";
import { renderConceptLens } from "./views/conceptLensView.js";

const TABS = [
  { id: "dashboard", label: "Dashboard", render: renderDashboard },
  { id: "vocabulary", label: "Vocabulary", render: renderVocab },
  { id: "alignments", label: "Alignments & Conflicts", render: renderAlign },
  { id: "conceptlens", label: "Concept Lens", render: renderConceptLens },
  { id: "explorer", label: "Explorer", render: renderExplorer },
  { id: "annotations", label: "My Annotations", render: renderAnnotations },
];

function currentTabDef() {
  return TABS.find((t) => t.id === state.activeTab) || TABS[0];
}

function renderActiveTab() {
  const body = document.getElementById("tab-body");
  currentTabDef().render(body);
}

function buildHeader() {
  const header = document.getElementById("app-header");
  clear(header);
  header.appendChild(
    el("div", { class: "header-inner" }, [
      el("div", { class: "brand" }, [
        el("span", { class: "brand-mark" }, "◈"),
        el("div", {}, [
          el("div", { class: "brand-title" }, "OpenEvo ConceptBase Explorer"),
          el("div", { class: "brand-sub" }, "Load, compare, and annotate ConceptBase-aligned LPM repositories"),
        ]),
      ]),
      el("div", { class: "header-actions" }, [
        el("a", { class: "btn btn-ghost btn-sm", href: "https://github.com/openevo-ccs/conceptbase", target: "_blank", rel: "noopener" }, "ConceptBase spec ↗"),
        el("button", {
          class: "btn btn-ghost btn-sm theme-toggle",
          onclick: (e) => {
            const mode = toggleTheme();
            e.target.textContent = mode === "dark" ? "☀ Light" : "🌙 Dark";
            rerenderInspector();
            renderActiveTab();
          },
        }, currentMode() === "dark" ? "☀ Light" : "🌙 Dark"),
      ]),
    ])
  );
}

function buildTabs() {
  const nav = document.getElementById("tab-nav");
  clear(nav);
  for (const tab of TABS) {
    const btn = el("button", { class: `tab-btn ${state.activeTab === tab.id ? "active" : ""}` }, tab.label);
    btn.addEventListener("click", () => {
      state.activeTab = tab.id;
      buildTabs();
      renderActiveTab();
    });
    nav.appendChild(btn);
  }
}

function wireGlobalEvents() {
  on("bundle-changed", () => {
    renderActiveTab();
  });
  on("loading-changed", () => {
    // slot cards manage their own status text; nothing else to do globally.
  });
  on("annotations-changed", () => {
    if (state.activeTab === "annotations") renderActiveTab();
  });
  on("navigate-tab", (tabId) => {
    state.activeTab = tabId;
    buildTabs();
    renderActiveTab();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && inspectorOpen()) closeInspector();
  });

  window.addEventListener("resize", () => {
    // Chart.js canvases resize themselves via maintainAspectRatio:false + the
    // container; a re-render on tab switch is enough, so nothing extra here.
  });
}

function boot() {
  initTheme();
  buildHeader();
  mountWelcomeBanner(document.getElementById("welcome-banner"));
  mountLoadPanel(document.getElementById("load-panel"));
  mountInspector(document.getElementById("app-shell"));

  const params = new URLSearchParams(location.search);
  // Shareable deep link, e.g. ?lens=Selection -- lands straight on Concept
  // Lens pre-filtered to that query. Used by docs/design-notes/*.md and the
  // welcome banner (which sets the same state directly, without a reload).
  const lensQuery = params.get("lens");
  if (lensQuery) {
    state.conceptLensQuery = lensQuery;
    state.activeTab = "conceptlens";
  }

  buildTabs();
  wireGlobalEvents();
  renderActiveTab();

  if (params.get("autoload") !== "0") {
    // Auto-load the two default example repos on first visit so the app is
    // never blank; explicit user edits + reload always override this.
    setTimeout(() => triggerAutoLoad(), 50);
  }
}

document.addEventListener("DOMContentLoaded", boot);
