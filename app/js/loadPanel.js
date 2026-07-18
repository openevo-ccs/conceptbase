// Persistent top-of-page control surface: pick 1-2 GitHub repos to load as
// ConceptBase-aligned LPMs. Kept outside the tab system since "load a repo"
// is the primary action of the whole app, not something to bury in a tab.

import { el, clear, parseGitHubRepoInput, debounce } from "./utils.js";
import { DEFAULT_SLOTS, CONCEPTBASE_REGISTRY, SLOT_KEYS, SERIES_COLOR } from "./config.js";
import { state, emit } from "./state.js";
import { loadLpmBundle, loadAlignments } from "./lpmLoader.js";
import * as gh from "./githubClient.js";
import * as storePrefs from "./store.js";
import { pick } from "./theme.js";

let root, registryOverride = null;

function slotInputValues(slot) {
  const def = DEFAULT_SLOTS[slot];
  const saved = storePrefs.getLastSlots();
  return (saved && saved[slot]) || def;
}

function buildSlotCard(slot) {
  const initial = slotInputValues(slot);
  const card = el("div", { class: "slot-card", id: `slot-card-${slot}` });
  const color = pick(SERIES_COLOR[slot]);

  const repoInput = el("input", { type: "text", value: `${initial.owner}/${initial.repo}`, placeholder: "owner/repo or GitHub URL", "aria-label": `LPM ${slot} repository` });
  const refInput = el("input", { type: "text", value: initial.ref || "", placeholder: "branch (default)" });
  const pathInput = el("input", { type: "text", value: initial.lpmPath || "lpm.yaml", placeholder: "lpm.yaml" });
  const statusEl = el("div", { class: "slot-status" });
  const loadBtn = el("button", { class: "btn btn-primary btn-sm" }, "Load");
  const clearBtn = el("button", { class: "btn btn-ghost btn-sm" }, "Clear");

  async function doLoad() {
    const parsed = parseGitHubRepoInput(repoInput.value);
    if (!parsed) {
      statusEl.innerHTML = `<span class="status-error">Enter as "owner/repo".</span>`;
      return;
    }
    const source = {
      owner: parsed.owner,
      repo: parsed.repo,
      ref: refInput.value.trim() || parsed.ref || "",
      lpmPath: pathInput.value.trim() || "lpm.yaml",
    };
    state.loading[slot] = true;
    state.loadErrors[slot] = null;
    loadBtn.disabled = true;
    statusEl.innerHTML = `<span class="status-loading">Loading…</span>`;
    emit("loading-changed", slot);
    try {
      const bundle = await loadLpmBundle(source, registryOverride || CONCEPTBASE_REGISTRY);
      state.slots[slot] = bundle;
      gh.pushRecentRepo({ owner: source.owner, repo: source.repo, ref: bundle.source.ref });
      const saved = storePrefs.getLastSlots() || {};
      saved[slot] = { ...source, ref: bundle.source.ref };
      storePrefs.setLastSlots(saved);
      const issueCount = bundle.issues.filter((i) => i.severity !== "info").length;
      statusEl.innerHTML = `<span class="status-ok">Loaded ${bundle.flatStrands.length} strand nodes${issueCount ? `, ${issueCount} issue(s)` : ""}.</span>`;
      if (!state.alignmentRecords.length) {
        try {
          state.alignmentRecords = await loadAlignments(registryOverride || CONCEPTBASE_REGISTRY);
        } catch (e) {
          console.warn("[oecb-explorer] alignment load failed:", e);
        }
      }
    } catch (e) {
      state.loadErrors[slot] = e.message;
      statusEl.innerHTML = `<span class="status-error">${e.message}</span>`;
      console.error(e);
    } finally {
      state.loading[slot] = false;
      loadBtn.disabled = false;
      emit("loading-changed", slot);
      emit("bundle-changed", slot);
    }
  }

  loadBtn.addEventListener("click", doLoad);
  clearBtn.addEventListener("click", () => {
    state.slots[slot] = null;
    statusEl.innerHTML = "";
    emit("bundle-changed", slot);
  });
  [repoInput, refInput, pathInput].forEach((inp) =>
    inp.addEventListener("keydown", (e) => { if (e.key === "Enter") doLoad(); })
  );

  card.appendChild(el("div", { class: "slot-card-head" }, [
    el("span", { class: "slot-dot", style: `background:${color}` }),
    el("strong", {}, `LPM ${slot}`),
  ]));
  card.appendChild(el("div", { class: "field-row" }, [
    el("div", { class: "field grow" }, [el("div", { class: "field-label" }, "Repository"), repoInput]),
    el("div", { class: "field" }, [el("div", { class: "field-label" }, "Ref"), refInput]),
  ]));
  card.appendChild(el("div", { class: "field" }, [el("div", { class: "field-label" }, "LPM root file path"), pathInput]));
  card.appendChild(el("div", { class: "field-row" }, [loadBtn, clearBtn]));
  card.appendChild(statusEl);

  card._doLoad = doLoad;
  return card;
}

function buildAdvancedSettings() {
  const details = el("details", { class: "advanced-settings" });
  details.appendChild(el("summary", {}, "Advanced: registry source, GitHub token, your name"));

  const regOwner = el("input", { type: "text", value: CONCEPTBASE_REGISTRY.owner });
  const regRepo = el("input", { type: "text", value: CONCEPTBASE_REGISTRY.repo });
  const regRef = el("input", { type: "text", value: CONCEPTBASE_REGISTRY.ref });
  const tokenInput = el("input", { type: "password", value: gh.getToken(), placeholder: "ghp_… (optional, raises rate limit)" });
  const nameInput = el("input", { type: "text", value: storePrefs.getAuthorName(), placeholder: "Used as default 'assertedBy' on alignment drafts" });

  const applyReg = debounce(() => {
    registryOverride = { owner: regOwner.value.trim() || CONCEPTBASE_REGISTRY.owner, repo: regRepo.value.trim() || CONCEPTBASE_REGISTRY.repo, ref: regRef.value.trim() || CONCEPTBASE_REGISTRY.ref };
  }, 300);
  [regOwner, regRepo, regRef].forEach((i) => i.addEventListener("input", applyReg));
  tokenInput.addEventListener("input", () => gh.setToken(tokenInput.value.trim()));
  nameInput.addEventListener("input", () => storePrefs.setAuthorName(nameInput.value.trim()));

  details.appendChild(el("div", { class: "field-row" }, [
    el("div", { class: "field" }, [el("div", { class: "field-label" }, "Registry owner"), regOwner]),
    el("div", { class: "field" }, [el("div", { class: "field-label" }, "Registry repo"), regRepo]),
    el("div", { class: "field" }, [el("div", { class: "field-label" }, "Registry ref"), regRef]),
  ]));
  details.appendChild(el("div", { class: "field" }, [el("div", { class: "field-label" }, "GitHub token (optional — stored only in this browser)"), tokenInput]));
  details.appendChild(el("div", { class: "field" }, [el("div", { class: "field-label" }, "Your name / attribution"), nameInput]));
  details.appendChild(
    el("button", { class: "btn btn-ghost btn-sm", onclick: () => { gh.clearCache(); alert("Cache cleared. Reload repos to fetch fresh data."); } }, "Clear fetch cache")
  );
  return details;
}

export function mountLoadPanel(container) {
  root = container;
  clear(root);
  const panel = el("div", { class: "load-panel" });
  panel.appendChild(el("div", { class: "load-panel-intro" }, "Load one or two ConceptBase-aligned LPM repositories to explore, compare, and annotate them."));
  const cards = el("div", { class: "slot-cards" }, SLOT_KEYS.map(buildSlotCard));
  panel.appendChild(cards);
  panel.appendChild(buildAdvancedSettings());
  root.appendChild(panel);
  return { autoLoadAll: () => SLOT_KEYS.forEach((s) => document.getElementById(`slot-card-${s}`)?._doLoad?.()) };
}

export function triggerAutoLoad() {
  SLOT_KEYS.forEach((s) => {
    const card = document.getElementById(`slot-card-${s}`);
    card?._doLoad?.();
  });
}
