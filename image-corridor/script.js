const observations = [
  {
    id: "01",
    image: "../assets/images/observation-01.jpg",
    alt: "白い衣の人物から赤い花が伸びる、光に満ちた黒い聖堂",
    text: "何も起きていない。\nただ、終わったものだけが、静かに咲いている。",
    tags: ["沈黙", "開花"]
  },
  {
    id: "02",
    image: "../assets/images/observation-02.jpg",
    alt: "ガラスケースの中で白い枝花へ変わる肺の標本",
    text: "幸福は消えるのではない。片付けられる。",
    tags: ["幸福", "残骸"]
  },
  {
    id: "03",
    image: "../assets/images/observation-03.jpg",
    alt: "胸部に金色の心臓装置を抱えた黒衣の人物",
    text: "役目を終えた形は、まだ意味のふりをしてそこに残る。",
    tags: ["残骸", "形"]
  },
  {
    id: "04",
    image: "../assets/images/observation-04.jpg",
    alt: "黒い聖堂に置かれた白と深紅の巨大な献花",
    text: "近づきすぎれば、意味しか見えない。離れすぎれば、何も見えない。",
    tags: ["距離", "観測"]
  },
  {
    id: "05",
    image: "../assets/images/observation-05.jpg",
    alt: "白い温室のガラス展示に骨格と白百合が育つ標本室",
    text: "美しいと思ったものより、美しいと思った自分のほうが、貴方を黙らせる。",
    tags: ["倒錯", "自覚"]
  },
  {
    id: "06",
    image: "../assets/images/observation-06.jpg",
    alt: "無数の赤い糸と小さな標本が張り巡らされた黒い展示室",
    text: "これは不穏ではない。世界が正常なまま、少しだけ角度を変えただけだ。",
    tags: ["正常", "ずれ"]
  },
  {
    id: "07",
    image: "../assets/images/observation-07.jpg",
    alt: "多数の小さな人物標本をガラス瓶に収めた暗い回廊",
    text: "倒錯も、嗤いも、根ではない。それらは距離が生んだ影である。",
    tags: ["第零層", "距離"]
  },
  {
    id: "08",
    image: "../assets/images/observation-08.jpg",
    alt: "巨大な肖像の影と向き合う黒衣の人物",
    text: "影は似ているから恐ろしいのではない。貴方より先に、貴方の位置を知っている。",
    tags: ["影", "自己"]
  },
  {
    id: "09",
    image: "../assets/images/observation-09.jpg",
    alt: "鏡が果てしなく連なる黒い回廊と遠くに立つ人物",
    text: "出口は鏡の向こうにはない。振り返った場所から、すでに始まっている。",
    tags: ["終章", "鏡"]
  }
];

const corridorStage = document.querySelector("[data-corridor-stage]");
const corridorViewport = document.querySelector("[data-corridor-viewport]");
const corridorTrack = document.querySelector("[data-corridor-track]");
const corridorProgress = document.querySelector("[data-corridor-progress]");
const archiveGrid = document.querySelector("[data-archive-grid]");
const currentObservation = document.querySelector("[data-current-observation]");
const totalObservations = document.querySelector("[data-total-observations]");
const enterButton = document.querySelector("[data-enter]");
const returnButton = document.querySelector("[data-return-top]");
const worldReturnButton = document.querySelector("[data-world-return]");
const worldReturnMessage = document.querySelector("[data-world-return-message]");
const modal = document.querySelector("[data-modal]");
const modalImage = document.querySelector("[data-modal-image]");
const modalNumber = document.querySelector("[data-modal-number]");
const modalText = document.querySelector("[data-modal-text]");
const modalClose = document.querySelector("[data-modal-close]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const mobileLayout = window.matchMedia("(max-width: 760px)");
const shortLayout = window.matchMedia("(max-height: 620px)");

let ticking = false;
let lastFocusedElement;
let preserveFocusPosition = false;
let worldReturnTimer;
let panels = [];
let activeId = "01";
let wasVertical = isVerticalLayout();
let insideCorridor = false;

function isVerticalLayout() {
  return mobileLayout.matches || shortLayout.matches || reducedMotion.matches;
}

function createTagMarkup(tags) {
  return tags.map((tag) => `<span>${tag}</span>`).join("");
}

function renderObservations() {
  if (corridorTrack) {
    corridorTrack.innerHTML = observations.map((observation) => `
      <article class="art-panel" data-observation="${observation.id}">
        <button
          class="art-image-button"
          type="button"
          data-open-observation="${observation.id}"
          aria-label="Observation ${observation.id} を拡大する"
        >
          <img src="${observation.image}" alt="${observation.alt}" loading="lazy">
        </button>
        <div class="art-caption">
          <p class="art-number" data-i18n-ignore>Observation ${observation.id}</p>
          <p class="observation-text">${observation.text}</p>
          <div class="tags">${createTagMarkup(observation.tags)}</div>
        </div>
      </article>
    `).join("");
  }

  if (archiveGrid) {
    archiveGrid.innerHTML = observations.map((observation) => `
      <article class="archive-item">
        <button
          class="archive-button"
          type="button"
          data-open-observation="${observation.id}"
          aria-label="Observation ${observation.id} を拡大する"
        >
          <span class="archive-thumb">
            <img src="${observation.image}" alt="" loading="lazy">
          </span>
          <span class="archive-meta">
            <strong data-i18n-ignore>Observation ${observation.id}</strong>
            <span>${createTagMarkup(observation.tags)}</span>
          </span>
        </button>
      </article>
    `).join("");
  }

  if (totalObservations) {
    totalObservations.textContent = String(observations.length).padStart(2, "0");
  }
}

function setActiveObservation(id) {
  activeId = id;
  panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.observation === id);
  });
  if (currentObservation && currentObservation.textContent !== id) currentObservation.textContent = id;
}

function setupArrivalObserver() {
  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      // No persistent dimming, and no repeated animation on a return visit.
      if (!reducedMotion.matches) entry.target.classList.add("has-arrived");
      observer.unobserve(entry.target);
    });
  }, { threshold: .2 });
  document.querySelectorAll(".art-image-button").forEach(button => observer.observe(button));
}

function measureCorridor() {
  if (!corridorStage || !corridorTrack || !corridorProgress) return;

  if (isVerticalLayout()) {
    corridorStage.style.height = "auto";
    corridorTrack.style.transform = "none";
    corridorProgress.style.width = "0";
  } else {
    const travel = Math.max(0, corridorTrack.scrollWidth - corridorViewport.clientWidth);
    corridorStage.style.height = `${travel + corridorViewport.clientHeight}px`;
  }
  updateCorridor();
}

function updateCorridor() {
  if (!corridorStage || !corridorTrack || !corridorProgress) {
    ticking = false;
    return;
  }

  if (wasVertical !== isVerticalLayout()) {
    updateLayout();
    return;
  }
  const stageBounds = corridorStage.getBoundingClientRect();
  insideCorridor = stageBounds.top <= innerHeight / 2 && stageBounds.bottom >= innerHeight / 2;

  if (isVerticalLayout()) {
    const nearest = panels.map(panel => {
      const rect = panel.getBoundingClientRect();
      return { panel, distance: Math.abs(rect.top + rect.height / 2 - innerHeight / 2) };
    }).sort((a, b) => a.distance - b.distance)[0];
    if (nearest) setActiveObservation(nearest.panel.dataset.observation);
    ticking = false;
    return;
  }

  const stageTop = corridorStage.offsetTop;
  const travel = Math.max(0, corridorTrack.scrollWidth - corridorViewport.clientWidth);
  const progress = Math.min(1, Math.max(0, (window.scrollY - stageTop) / Math.max(travel, 1)));

  corridorTrack.style.transform = `translate3d(${-travel * progress}px, 0, 0)`;
  corridorProgress.style.width = `${progress * 100}%`;
  const index = Math.min(panels.length - 1, Math.round(travel * progress / corridorViewport.clientWidth));
  if (panels[index]) setActiveObservation(panels[index].dataset.observation);
  ticking = false;
}

function showPanel(panel, behavior = "instant") {
  if (!panel) return;
  if (isVerticalLayout()) {
    panel.scrollIntoView({ behavior, block: "start" });
  } else {
    // Native focus can scroll an overflow-hidden viewport independently of the track.
    corridorViewport.scrollLeft = 0;
    window.scrollTo({ top: corridorStage.offsetTop + panel.offsetLeft, behavior });
    updateCorridor();
  }
}

function updateLayout() {
  const vertical = isVerticalLayout();
  // Media-query styles have already changed geometry when their event arrives.
  const preservePosition = insideCorridor && wasVertical !== vertical;
  const current = panels.find(panel => panel.dataset.observation === activeId);
  wasVertical = vertical;
  measureCorridor();
  if (preservePosition) showPanel(current);
}

function requestCorridorUpdate() {
  if (!ticking) {
    window.requestAnimationFrame(updateCorridor);
    ticking = true;
  }
}

function openModal(id) {
  const observation = observations.find((item) => item.id === id);
  if (!observation || !modal || modal.open) return;

  lastFocusedElement = document.activeElement;
  modalImage.src = observation.image;
  modalImage.alt = observation.alt;
  modalNumber.textContent = `Observation ${observation.id}`;
  modalText.textContent = observation.text;
  window.GireivelI18n?.refresh(modal);
  modal.showModal();
  document.body.classList.add("is-modal-open");
  modalClose.focus({ preventScroll: true });
}

function closeModal() {
  if (!modal?.open) return;
  preserveFocusPosition = true;
  modal.close();
  restoreModalFocus();
}

function restoreModalFocus() {
  if (!document.body.classList.contains("is-modal-open")) return;
  document.body.classList.remove("is-modal-open");
  lastFocusedElement?.focus({ preventScroll: true });
  preserveFocusPosition = false;
}

renderObservations();
panels = [...document.querySelectorAll("[data-observation]")];
if (corridorTrack) setActiveObservation("01");
setupArrivalObserver();

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-open-observation]");
  if (trigger) openModal(trigger.dataset.openObservation);
});

enterButton?.addEventListener("click", () => {
  preserveFocusPosition = true;
  panels[0]?.querySelector("button").focus({ preventScroll: true });
  preserveFocusPosition = false;
  showPanel(panels[0], reducedMotion.matches ? "instant" : "smooth");
});

returnButton?.addEventListener("click", () => {
  enterButton?.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
});

corridorTrack?.addEventListener("focusin", event => {
  const panel = event.target.closest("[data-observation]");
  if (!modal?.open && !preserveFocusPosition && event.target.matches(":focus-visible") && panel) {
    const bounds = panel.getBoundingClientRect();
    if (!isVerticalLayout() && (corridorViewport.scrollLeft !== 0 || bounds.left < -1 || bounds.right > innerWidth + 1 || bounds.top < 0 || bounds.bottom > innerHeight)) {
      showPanel(panel);
    }
  }
});

worldReturnButton?.addEventListener("click", () => {
  if (!worldReturnMessage) return;

  window.clearTimeout(worldReturnTimer);
  worldReturnMessage.classList.add("is-visible");
  worldReturnTimer = window.setTimeout(() => {
    worldReturnMessage.classList.remove("is-visible");
  }, 2600);
});

modalClose?.addEventListener("click", closeModal);
modal?.addEventListener("close", restoreModalFocus);
modal?.addEventListener("keydown", event => {
  // The close button is the only control in this image viewer.
  if (event.key === "Tab") {
    event.preventDefault();
    modalClose.focus({ preventScroll: true });
  }
});

modal?.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

modal?.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeModal();
});

if (corridorStage) {
  window.addEventListener("scroll", requestCorridorUpdate, { passive: true });
}

window.addEventListener("resize", updateLayout);
reducedMotion.addEventListener("change", updateLayout);
mobileLayout.addEventListener("change", updateLayout);
shortLayout.addEventListener("change", updateLayout);

window.addEventListener("load", measureCorridor);
measureCorridor();
