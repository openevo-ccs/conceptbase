// Thin wrapper around the js-yaml UMD build loaded globally via CDN <script>
// in index.html (window.jsyaml). Centralized here so the rest of the app
// never touches the global directly, and so a load failure produces one
// clear error instead of scattered "jsyaml is not defined" crashes.

function lib() {
  if (!window.jsyaml) {
    throw new Error("js-yaml failed to load from CDN — check your network connection and reload.");
  }
  return window.jsyaml;
}

export function parseYaml(text) {
  return lib().load(text);
}

export function toYaml(obj) {
  return lib().dump(obj, { lineWidth: 100, noRefs: true, sortKeys: false });
}
