// Guest list functionality removed.

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function spawnPetal(imgName, container = null) {
  const imgs = [
    "Flor1.png",
    "Flor2.png",
    "Flor3.png",
    "Flor4.png",
    "Flor5.png",
  ];
  const c = container || document.getElementById("petal-field");
  if (!c) return null;
  const d = randomBetween(8, 15).toFixed(2) + "s";
  const delay = randomBetween(0, 6).toFixed(2) + "s";
  const drift = Math.floor(randomBetween(-40, 40)) + "px";
  const size = Math.floor(randomBetween(28, 48)) + "px";
  const o = randomBetween(0.75, 1).toFixed(2);
  const left = Math.floor(randomBetween(0, 100)) + "%";

  const div = document.createElement("div");
  div.className = "petal";
  div.style.left = left;
  div.style.setProperty("--drift", drift);
  div.style.setProperty("--d", d);
  div.style.setProperty("--delay", delay);
  div.style.setProperty("--size", size);
  div.style.setProperty("--o", o);

  const img = document.createElement("img");
  img.src =
    "images/" + (imgName || imgs[Math.floor(Math.random() * imgs.length)]);
  img.alt = "";
  div.appendChild(img);

  const MAX = window._petalLimit || 120;
  if (c.children.length >= MAX) {
    c.removeChild(c.firstElementChild);
  }

  c.appendChild(div);

  const removeAfter = (parseFloat(d) + parseFloat(delay)) * 1000 + 500;
  const tid = setTimeout(() => {
    if (div.parentNode === c) c.removeChild(div);
    clearTimeout(tid);
  }, removeAfter);

  return div;
}

function generatePetals(count = 40) {
  const container = document.getElementById("petal-field");
  if (!container) return;
  container.innerHTML = "";
  for (let i = 0; i < count; i++) spawnPetal(null, container);
  container.style.pointerEvents = "none";
}

// spawner incremental
window._petalSpawnerId = null;
window._petalLimit = 120;
function startPetalSpawner(intervalMs = 600, maxPetals = 120) {
  stopPetalSpawner();
  window._petalLimit = maxPetals;
  const container = document.getElementById("petal-field");
  if (!container) return;
  // spawn immediately alguns
  for (let i = 0; i < Math.min(6, Math.floor(maxPetals / 10)); i++)
    spawnPetal();
  window._petalSpawnerId = setInterval(() => {
    spawnPetal();
  }, intervalMs);
  return window._petalSpawnerId;
}

function stopPetalSpawner() {
  if (window._petalSpawnerId) clearInterval(window._petalSpawnerId);
  window._petalSpawnerId = null;
}

window.startPetalSpawner = startPetalSpawner;
window.stopPetalSpawner = stopPetalSpawner;

// DOM ready
document.addEventListener("DOMContentLoaded", () => {
  // iniciar spawner incremental de pétalas (padrão)
  try {
    startPetalSpawner(600, 120); // spawn a cada 600ms, máximo 120
  } catch (err) {
    console.warn("startPetalSpawner failed", err);
  }
});
