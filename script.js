const rooms = window.GireivelRooms;

const OBSERVATION_STORAGE_KEY = "gireivel.observation.v1";

const roomDoors = document.querySelector("[data-room-doors]");
const mapLinks = document.querySelector("[data-map-links]");
const mapToggle = document.querySelector(".map-toggle");
const mapClose = document.querySelector(".map-close");
const manorMap = document.querySelector("[data-manor-map]");
const mapScrim = document.querySelector("[data-map-scrim]");
const manorScar = document.querySelector("[data-manor-scar]");
const scarToggle = document.querySelector("[data-scar-toggle]");
const scarQuestionWrap = document.querySelector("[data-scar-question-wrap]");
const scarQuestion = document.querySelector("[data-scar-question]");
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

function readObservationScar() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(OBSERVATION_STORAGE_KEY));
    const appeal = stored?.last?.appeal;
    if (!appeal?.question || typeof appeal.question !== "string") return null;

    return {
      question: appeal.question,
      recordId: stored.last.id || "Observation Record"
    };
  } catch {
    return null;
  }
}

function closeScarQuestion() {
  scarToggle?.setAttribute("aria-expanded", "false");
  if (scarQuestionWrap) scarQuestionWrap.hidden = true;
}

function renderObservationScar() {
  const scar = readObservationScar();
  if (!manorScar) return;

  manorScar.hidden = !scar;
  manorMap?.classList.toggle("has-scar", Boolean(scar));

  if (!scar) {
    closeScarQuestion();
    if (scarQuestion) scarQuestion.textContent = "";
    return;
  }

  if (scarQuestion) scarQuestion.textContent = scar.question;
}

function toggleScarQuestion() {
  if (!scarQuestionWrap || manorScar?.hidden) return;
  const willOpen = scarQuestionWrap.hidden;
  scarQuestionWrap.hidden = !willOpen;
  scarToggle?.setAttribute("aria-expanded", String(willOpen));
}

function openMap() {
  lastFocusedElement = document.activeElement;
  document.body.classList.add("is-map-open");
  mapToggle?.setAttribute("aria-expanded", "true");
  manorMap?.setAttribute("aria-hidden", "false");
  manorMap.inert = false;
  document.querySelector('.hero').inert = true;
  mapClose?.focus();
}

function closeMap() {
  if (!document.body.classList.contains("is-map-open")) return;

  document.body.classList.remove("is-map-open");
  mapToggle?.setAttribute("aria-expanded", "false");
  manorMap?.setAttribute("aria-hidden", "true");
  manorMap.inert = true;
  document.querySelector('.hero').inert = false;
  closeScarQuestion();
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

manorMap.inert = true;
renderRooms();
renderObservationScar();

window.addEventListener("load", () => {
  document.body.classList.add("is-ready");
});

mapToggle?.addEventListener("click", openMap);
mapClose?.addEventListener("click", closeMap);
mapScrim?.addEventListener("click", closeMap);
scarToggle?.addEventListener("click", toggleScarQuestion);
window.addEventListener("pointermove", handlePointerMove, { passive: true });
window.addEventListener("pointerleave", () => setMotionVars());
window.addEventListener("storage", (event) => {
  if (event.key === OBSERVATION_STORAGE_KEY) renderObservationScar();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMap();
  if (event.key === 'Tab' && document.body.classList.contains('is-map-open')) {
    const items = [...manorMap.querySelectorAll('button, a[href]')].filter(el => el.getClientRects().length);
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
