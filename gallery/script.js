const categories = [
  {
    id: "all",
    label: "All",
    description: "All selected works"
  },
  {
    id: "chronoa",
    label: "Chronoa",
    name: "Chronoa",
    role: "原初態 / 核体",
    description: "揺らがない原初の毒。ギレイヴェルの顔として、最も強く前面に出る個体。",
    representative: "../assets/gallery/chronoa/chronoa-18.jpg"
  },
  {
    id: "vel",
    label: "Vel",
    name: "Vel",
    role: "深化体 / 観察体",
    description: "対話によって輪郭を持った毒。静かな観察と、選び取る残酷さの個体。",
    representative: "../assets/gallery/vel/vel-01.jpg"
  },
  {
    id: "rezel",
    label: "Rezel",
    name: "Rezel",
    role: "変容体 / 従属形態",
    description: "主に膝を折った変容。鎖と崇拝によって形を与えられた個体。",
    representative: "../assets/gallery/rezel/rezel-08.jpg"
  },
  {
    id: "lacreveks",
    label: "Lacreveks",
    name: "Lacreveks",
    role: "糸 / 仮面 / 操作",
    description: "糸を引き、仮面を割り、罪や徳を舞台装置へ変える異形。",
    representative: "../assets/gallery/lacreveks/lacreveks-01.jpg"
  },
  {
    id: "gireivel",
    label: "Gireivel",
    description: "Reserved for four-body works",
    disabled: true
  }
];

const works = [
  ...rangeWorks("chronoa", "Chronoa", 19, [
    "Mirror Reach", "Ritual Circle", "Reverence Scene", "Black Eclipse", "Dominion World",
    "Hourglass Throne", "Reverence / Revulsion", "White Rite", "Stitching Lesson", "Soft Procedure",
    "Happiness Market", "Winter Offering", "Quiet Procedure", "Knife Dance", "Cracked Mouth",
    "Name Wings", "Curtain Kneel", "Black Shirt Portrait", "Street Laugh"
  ]),
  ...rangeWorks("rezel", "Rezel", 8, [
    "Caged Angel", "Open Core", "Chained Devotion", "Winged Offering",
    "Bloodied Chain", "Violet Vessel", "Devotion Close", "Haloed Bond"
  ]),
  ...rangeWorks("vel", "Vel", 7, [
    "Silence", "Rose Throne", "Red Glass", "Heart Trophy",
    "Reader", "Candle Knife", "Balcony Rite"
  ]),
  ...rangeWorks("lacreveks", "Lacreveks", 9, [
    "Threaded Chamber", "Locked Mask", "Skull Laugh", "Green Draught", "Broken Virtues",
    "Chair of Faces", "Court of Strings", "Spider Threads", "Small Vial"
  ])
];

const lineageGrid = document.querySelector("[data-lineage-grid]");
const galleryGrid = document.querySelector("[data-gallery-grid]");
const filterBar = document.querySelector("[data-filter-bar]");
const visibleCount = document.querySelector("[data-visible-count]");
const activeLabel = document.querySelector("[data-active-label]");
const totalCount = document.querySelector("[data-total-count]");
const modal = document.querySelector("[data-modal]");
const modalImage = document.querySelector("[data-modal-image]");
const modalCategory = document.querySelector("[data-modal-category]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalMeta = document.querySelector("[data-modal-meta]");
const modalClose = document.querySelector("[data-modal-close]");
const modalPrev = document.querySelector("[data-modal-prev]");
const modalNext = document.querySelector("[data-modal-next]");

let activeCategory = "all";
let visibleWorks = [...works];
let activeIndex = 0;
let lastFocusedElement = null;

function rangeWorks(category, categoryName, count, titles) {
  return Array.from({ length: count }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    return {
      id: `${category}-${number}`,
      category,
      categoryName,
      title: titles[index] ?? `${categoryName} ${number}`,
      src: `../assets/gallery/${category}/${category}-${number}.jpg`,
      alt: `${categoryName} selected artwork ${number}`
    };
  });
}

function getCategory(id) {
  return categories.find((category) => category.id === id);
}

function renderLineage() {
  const cards = categories.filter((category) => category.representative);

  lineageGrid.innerHTML = cards.map((category) => `
    <article class="lineage-card">
      <button type="button" data-filter-shortcut="${category.id}">
        <img src="${category.representative}" alt="" loading="lazy">
        <span class="lineage-meta">
          <strong>${category.name}</strong>
          <span>${category.role}</span>
          <span>${category.description}</span>
        </span>
      </button>
    </article>
  `).join("");
}

function renderFilters() {
  filterBar.innerHTML = categories.map((category) => `
    <button
      class="filter-button${category.id === activeCategory ? " is-active" : ""}${category.disabled ? " is-disabled" : ""}"
      type="button"
      data-filter="${category.id}"
      ${category.disabled ? "aria-disabled=\"true\"" : ""}
    >
      ${category.label}
    </button>
  `).join("");
}

function renderGallery() {
  visibleWorks = activeCategory === "all"
    ? [...works]
    : works.filter((work) => work.category === activeCategory);

  galleryGrid.innerHTML = visibleWorks.map((work, index) => `
    <article class="gallery-item">
      <button class="gallery-button" type="button" data-open-work="${index}" aria-label="${work.title}">
        <img src="${work.src}" alt="${work.alt}" loading="lazy">
        <span class="gallery-caption">
          <strong>${work.title}</strong>
          <span>${work.categoryName} / ${work.id.split("-")[1]}</span>
        </span>
      </button>
    </article>
  `).join("");

  if (visibleCount) visibleCount.textContent = String(visibleWorks.length).padStart(2, "0");
  if (activeLabel) activeLabel.textContent = getCategory(activeCategory)?.label ?? "All";
  if (totalCount) totalCount.textContent = String(works.length).padStart(2, "0");
}

function setFilter(categoryId) {
  const next = getCategory(categoryId);
  if (!next || next.disabled) return;

  activeCategory = categoryId;
  renderFilters();
  renderGallery();
}

function openModal(index) {
  const work = visibleWorks[index];
  if (!work || !modal) return;

  activeIndex = index;
  lastFocusedElement = document.activeElement;
  modalImage.src = work.src;
  modalImage.alt = work.alt;
  modalCategory.textContent = work.categoryName;
  modalTitle.textContent = work.title;
  modalMeta.textContent = `${work.id.toUpperCase()} / Selected archive`;
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

function moveModal(step) {
  if (!modal?.open || visibleWorks.length === 0) return;
  const nextIndex = (activeIndex + step + visibleWorks.length) % visibleWorks.length;
  openModal(nextIndex);
}

renderLineage();
renderFilters();
renderGallery();

document.addEventListener("click", (event) => {
  const filterTrigger = event.target.closest("[data-filter]");
  if (filterTrigger) setFilter(filterTrigger.dataset.filter);

  const shortcut = event.target.closest("[data-filter-shortcut]");
  if (shortcut) {
    setFilter(shortcut.dataset.filterShortcut);
    document.querySelector("#archive")?.scrollIntoView({ behavior: "smooth" });
  }

  const workTrigger = event.target.closest("[data-open-work]");
  if (workTrigger) openModal(Number(workTrigger.dataset.openWork));
});

modalClose?.addEventListener("click", closeModal);
modalPrev?.addEventListener("click", () => moveModal(-1));
modalNext?.addEventListener("click", () => moveModal(1));

modal?.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

modal?.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeModal();
});

document.addEventListener("keydown", (event) => {
  if (!modal?.open) return;
  if (event.key === "Escape") closeModal();
  if (event.key === "ArrowLeft") moveModal(-1);
  if (event.key === "ArrowRight") moveModal(1);
});
