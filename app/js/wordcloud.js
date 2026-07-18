// Wrapper around wordcloud2.js (window.WordCloud, loaded via CDN). Falls back
// to a simple CSS tag-cloud (sized <span> list) if the canvas library isn't
// available (e.g. blocked CDN, or a browser without canvas 2D support), so
// the vocabulary comparison never goes blank.

import { escapeHtml, clear } from "./utils.js";

export function renderWordCloud(container, wordWeights, { color = "#2a78d6", onClick } = {}) {
  clear(container);
  if (!wordWeights.length) {
    container.appendChild(Object.assign(document.createElement("div"), { className: "empty-hint", textContent: "No concepts to display." }));
    return;
  }
  const maxW = Math.max(...wordWeights.map((w) => w[1]));

  if (window.WordCloud && window.WordCloud.isSupported) {
    const canvas = document.createElement("canvas");
    canvas.width = container.clientWidth || 480;
    canvas.height = 320;
    canvas.className = "wordcloud-canvas";
    container.appendChild(canvas);
    const list = wordWeights.map(([w, weight]) => [w, 8 + (weight / maxW) * 34]);
    window.WordCloud(canvas, {
      list,
      gridSize: 8,
      weightFactor: 1,
      fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
      color: () => color,
      backgroundColor: "transparent",
      rotateRatio: 0.15,
      rotationSteps: 2,
      shuffle: true,
      drawOutOfBound: false,
      shrinkToFit: true,
      click: onClick ? (item) => onClick(item[0]) : undefined,
      hover: (item, dimension) => {
        canvas.title = item ? `${item[0]} (${item[2]})` : "";
      },
    });
    return;
  }

  // Fallback: plain tag cloud.
  const wrap = document.createElement("div");
  wrap.className = "tagcloud-fallback";
  for (const [word, weight] of wordWeights) {
    const span = document.createElement("span");
    const size = 0.75 + (weight / maxW) * 1.6;
    span.style.fontSize = `${size}em`;
    span.style.color = color;
    span.textContent = word;
    span.title = `${word} (${weight})`;
    if (onClick) {
      span.style.cursor = "pointer";
      span.addEventListener("click", () => onClick(word));
    }
    wrap.appendChild(span);
  }
  container.appendChild(wrap);
  if (!wordWeights.length) container.innerHTML = `<div class="empty-hint">${escapeHtml("No concepts to display.")}</div>`;
}
