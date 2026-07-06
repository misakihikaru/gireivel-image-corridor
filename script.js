const observations = [
  {
    id: "01",
    image: "./assets/images/observation-01.jpg",
    alt: "白い衣の人物から赤い花が伸びる、光に満ちた黒い聖堂",
    text: "何も起きていない。だからこそ、見えてしまうものがある。",
    tags: ["日常", "空洞"]
  },
  {
    id: "02",
    image: "./assets/images/observation-02.jpg",
    alt: "ガラスケースの中で白い枝花へ変わる肺の標本",
    text: "幸福は消えるのではない。片付けられる。",
    tags: ["幸福", "残骸"]
  },
  {
    id: "03",
    image: "./assets/images/observation-03.jpg",
    alt: "胸部に金色の心臓装置を抱えた黒衣の人物",
    text: "役目を終えた形は、まだ意味のふりをしてそこに残る。",
    tags: ["残骸", "形"]
  },
  {
    id: "04",
    image: "./assets/images/observation-04.jpg",
    alt: "黒い聖堂に置かれた白と深紅の巨大な献花",
    text: "近づきすぎれば、意味しか見えない。離れすぎれば、何も見えない。",
    tags: ["距離", "観測"]
  },
  {
    id: "05",
    image: "./assets/images/observation-05.jpg",
    alt: "白い温室のガラス展示に骨格と白百合が育つ標本室",
    text: "美しいと思ったものより、美しいと思った自分のほうが、貴方を黙らせる。",
    tags: ["倒錯", "自覚"]
  },
  {
    id: "06",
    image: "./assets/images/observation-06.jpg",
    alt: "無数の赤い糸と小さな標本が張り巡らされた黒い展示室",
    text: "これは不穏ではない。世界が正常なまま、少しだけ角度を変えただけだ。",
    tags: ["正常", "ずれ"]
  },
  {
    id: "07",
    image: "./assets/images/observation-07.jpg",
    alt: "多数の小さな人物標本をガラス瓶に収めた暗い回廊",
    text: "倒錯も、嗤いも、根ではない。それらは距離が生んだ影である。",
    tags: ["第零層", "距離"]
  },
  {
    id: "08",
    image: "./assets/images/observation-08.jpg",
    alt: "巨大な肖像の影と向き合う黒衣の人物",
    text: "影は似ているから恐ろしいのではない。貴方より先に、貴方の位置を知っている。",
    tags: ["影", "自己"]
  },
  {
    id: "09",
    image: "./assets/images/observation-09.jpg",
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
const modal = document.querySelector("[data-modal]");
const modalImage = document.querySelector("[data-modal-image]");
const modalNumber = document.querySelector("[data-modal-number]");
const modalText = document.querySelector("[data-modal-text]");
const modalClose = document.querySelector("[data-modal-close]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const mobileLayout = window.matchMedia("(max-width: 760px)");

let activeObserver;
let ticking = false;
let lastFocusedElement;

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
          <p class="art-number">Observation ${observation.id}</p>
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
            <strong>Observation ${observation.id}</strong>
            <span>${observation.tags.join(" / ")}</span>
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
  document.querySelectorAll("[data-observation]").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.observation === id);
  });
  if (currentObservation) currentObservation.textContent = id;
}

function setupObservationObserver() {
  activeObserver?.disconnect();
  const panels = document.querySelectorAll("[data-observation]");
  if (!corridorViewport || panels.length === 0) return;

  activeObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible[0]) {
        setActiveObservation(visible[0].target.dataset.observation);
      }
    },
    {
      root: mobileLayout.matches ? null : corridorViewport,
      rootMargin: mobileLayout.matches ? "-30% 0px -30% 0px" : "0px -28% 0px -28%",
      threshold: [0.15, 0.35, 0.6]
    }
  );

  panels.forEach((panel) => {
    activeObserver.observe(panel);
  });
}

function measureCorridor() {
  if (!corridorStage || !corridorTrack || !corridorProgress) return;

  if (mobileLayout.matches) {
    corridorStage.style.height = "auto";
    corridorTrack.style.transform = "none";
    corridorProgress.style.width = "0";
    return;
  }

  const travel = Math.max(0, corridorTrack.scrollWidth - window.innerWidth);
  corridorStage.style.height = `${travel + window.innerHeight}px`;
  updateCorridor();
}

function updateCorridor() {
  if (!corridorStage || !corridorTrack || !corridorProgress) {
    ticking = false;
    return;
  }

  if (mobileLayout.matches) {
    ticking = false;
    return;
  }

  const stageTop = corridorStage.offsetTop;
  const travel = Math.max(0, corridorTrack.scrollWidth - window.innerWidth);
  const progress = Math.min(1, Math.max(0, (window.scrollY - stageTop) / Math.max(travel, 1)));

  corridorTrack.style.transform = `translate3d(${-travel * progress}px, 0, 0)`;
  corridorProgress.style.width = `${progress * 100}%`;
  ticking = false;
}

function requestCorridorUpdate() {
  if (!ticking) {
    window.requestAnimationFrame(updateCorridor);
    ticking = true;
  }
}

function openModal(id) {
  const observation = observations.find((item) => item.id === id);
  if (!observation || !modal) return;

  lastFocusedElement = document.activeElement;
  modalImage.src = observation.image;
  modalImage.alt = observation.alt;
  modalNumber.textContent = `Observation ${observation.id}`;
  modalText.textContent = observation.text;
  modal.showModal();
  document.body.classList.add("is-modal-open");
  modalClose.focus();
}

function closeModal() {
  if (!modal?.open) return;
  modal.close();
  document.body.classList.remove("is-modal-open");
  lastFocusedElement?.focus();
}

renderObservations();
if (corridorTrack) setActiveObservation("01");
setupObservationObserver();

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-open-observation]");
  if (trigger) openModal(trigger.dataset.openObservation);
});

enterButton?.addEventListener("click", () => {
  corridorStage.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth" });
});

returnButton?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
});

modalClose?.addEventListener("click", closeModal);

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

window.addEventListener("resize", () => {
  measureCorridor();
  setupObservationObserver();
});

window.addEventListener("load", measureCorridor);
measureCorridor();
