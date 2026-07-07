const rooms = [
  {
    id: "image-corridor",
    number: "01",
    title: "IMAGE CORRIDOR",
    jp: "Observation Corridor",
    href: "./image-corridor/"
  },
  {
    id: "resonance-hall",
    number: "02",
    title: "RESONANCE HALL",
    jp: "Voice Archive",
    href: "./sound/"
  },
  {
    id: "gireivel-gallery",
    number: "03",
    title: "GIREIVEL GALLERY",
    jp: "Selected Archive",
    href: "./gallery/"
  }
];

const roomDoors = document.querySelector("[data-room-doors]");
const mapLinks = document.querySelector("[data-map-links]");
const mapToggle = document.querySelector(".map-toggle");
const mapClose = document.querySelector(".map-close");
const manorMap = document.querySelector("[data-manor-map]");
const mapScrim = document.querySelector("[data-map-scrim]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let lastFocusedElement = null;
let pointerFrame = null;

function renderRooms() {
  if (roomDoors) {
    roomDoors.innerHTML = rooms.map((room) => `
      <a class="room-door" href="${room.href}" data-room-id="${room.id}">
        <span class="room-number">${room.number}</span>
        <span class="room-title">${room.title}</span>
        <span class="room-jp">${room.jp}</span>
      </a>
    `).join("");
  }

  if (mapLinks) {
    mapLinks.innerHTML = rooms.map((room) => `
      <a class="map-link" href="${room.href}">
        <span>${room.number}</span>
        <span>${room.title}</span>
      </a>
    `).join("");
  }
}

function openMap() {
  lastFocusedElement = document.activeElement;
  document.body.classList.add("is-map-open");
  mapToggle?.setAttribute("aria-expanded", "true");
  manorMap?.setAttribute("aria-hidden", "false");
  mapClose?.focus();
}

function closeMap() {
  if (!document.body.classList.contains("is-map-open")) return;

  document.body.classList.remove("is-map-open");
  mapToggle?.setAttribute("aria-expanded", "false");
  manorMap?.setAttribute("aria-hidden", "true");
  lastFocusedElement?.focus();
}

function setMotionVars(x = 0, y = 0) {
  document.documentElement.style.setProperty("--bg-shift-x", `${x * -7}px`);
  document.documentElement.style.setProperty("--bg-shift-y", `${y * -5}px`);
  document.documentElement.style.setProperty("--hero-shift-x", `${x * 2}px`);
  document.documentElement.style.setProperty("--hero-shift-y", `${y * 2}px`);
}

function handlePointerMove(event) {
  if (reducedMotion.matches) return;

  window.cancelAnimationFrame(pointerFrame);
  pointerFrame = window.requestAnimationFrame(() => {
    const x = (event.clientX / window.innerWidth - 0.5) * 2;
    const y = (event.clientY / window.innerHeight - 0.5) * 2;
    setMotionVars(x, y);
  });
}

renderRooms();

window.addEventListener("load", () => {
  document.body.classList.add("is-ready");
});

mapToggle?.addEventListener("click", openMap);
mapClose?.addEventListener("click", closeMap);
mapScrim?.addEventListener("click", closeMap);
window.addEventListener("pointermove", handlePointerMove, { passive: true });
window.addEventListener("pointerleave", () => setMotionVars());

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMap();
});
