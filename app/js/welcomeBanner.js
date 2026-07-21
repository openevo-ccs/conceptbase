// First-run "New here?" banner. Points first-time visitors at the guided
// getting-started walkthrough instead of leaving them to reverse-engineer
// the app's six tabs on their own, and offers a one-click live example
// (the Selection cross-domain case study) via Concept Lens's one-shot
// query prefill (state.conceptLensQuery, consumed by conceptLensView.js).
import { el, clear } from "./utils.js";
import { state, emit } from "./state.js";
import { LS_KEYS } from "./config.js";

function dismiss(container) {
  localStorage.setItem(LS_KEYS.welcomeDismissed, "1");
  clear(container);
}

export function mountWelcomeBanner(container) {
  if (!container || localStorage.getItem(LS_KEYS.welcomeDismissed) === "1") return;

  const banner = el("div", { class: "welcome-banner" }, [
    el("div", { class: "welcome-banner-body" }, [
      el("strong", {}, "New here? "),
      el("span", {}, [
        "This app auto-loaded two real reference LPMs below. See ",
        el("a", { href: "https://github.com/openevo-ccs/conceptbase/blob/main/docs/getting-started.md", target: "_blank", rel: "noopener" }, "the getting-started guide"),
        " for a full walkthrough, or jump straight to a live example: ",
      ]),
      el("button", {
        class: "btn btn-primary btn-sm",
        onclick: () => {
          state.conceptLensQuery = "Selection";
          state.activeTab = "conceptlens";
          emit("navigate-tab", "conceptlens");
        },
      }, "Show me Selection across biology/culture/AI"),
    ]),
    el("button", { class: "btn btn-ghost btn-sm welcome-banner-dismiss", "aria-label": "Dismiss", onclick: () => dismiss(container) }, "✕"),
  ]);

  clear(container);
  container.appendChild(banner);
}
