// Theme detection: an explicit user toggle (persisted, stamped as data-theme
// on <html>) wins over the OS prefers-color-scheme signal. Chart/word-cloud
// code that can't rely on CSS alone (canvas contexts) calls currentMode().

const KEY = "oecb-explorer:theme";

export function currentMode() {
  const stamped = document.documentElement.getAttribute("data-theme");
  if (stamped === "dark" || stamped === "light") return stamped;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function initTheme() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "dark" || saved === "light") {
      document.documentElement.setAttribute("data-theme", saved);
    }
  } catch {
    /* ignore */
  }
}

export function toggleTheme() {
  const next = currentMode() === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* ignore */
  }
  return next;
}

export function pick(colorPair) {
  return colorPair[currentMode()];
}
