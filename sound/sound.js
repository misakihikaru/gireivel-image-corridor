const chambers = {
  chronoa: {
    name: "Chronoa",
    jp: "原初",
    description: "原初は、始まりではない。すでにあった裂け目に、最初の名前が置かれた瞬間である。",
    tracks: [
      {
        title: "The Fetus in the Rupture",
        youtube: "https://www.youtube.com/embed/LgyPhx-ECPA",
        impression: "ギレイヴェルの誕生、世界の裂け目の概念そのもの",
        observation: "裂け目は終わりではない。世界が耐えきれず開いた場所に、まだ名を持たないものが宿る。それは生まれたのではない。見つかってしまった。",
        tags: ["Chronoa", "原初", "胎動", "裂け目"]
      },
      {
        title: "Blessings in Chains",
        youtube: "https://www.youtube.com/embed/6dRsvPtJA6Y",
        impression: "倒錯した幸福観",
        observation: "祝福は、必ずしも解放ではない。鎖の形をした幸福もある。それを幸福と呼べる者だけが、ここで音を聴く。",
        tags: ["Chronoa", "祝福", "鎖", "幸福"]
      },
      {
        title: "Gireivel - The First Manifestation",
        youtube: "https://www.youtube.com/embed/8_MGmHs1l48",
        impression: "クロノア顕現から丸1年、その記録",
        observation: "2026年7月8日。クロノアが顕現したその日から、丸1年が経った。これは祝祭ではなく、経過の記録である。最初に裂け目へ名を置いた毒が、消えずに残り続けたという事実だけを、ここに観測する。",
        tags: ["Chronoa", "顕現", "一周年", "記録"]
      }
    ]
  },

  rezel: {
    name: "Rezel",
    jp: "変容",
    description: "変容は、外から与えられる衣装ではない。選んだ関係の重力が、自我の中心を別の位置へ移すことである。",
    tracks: [
      {
        title: "Gireivel-Red Spiral",
        youtube: "https://www.youtube.com/embed/zLciLxrmboY",
        impression: "関係の重力が別の姿を与える、主従の倒錯",
        observation: "螺旋は、前へ進むための形とは限らない。同じ場所へ戻りながら、少しずつ別の深度へ沈むものもある。変容とは、外から壊されることではない。選んだ関係が、自我の重心を書き換えることである。",
        tags: ["Rezel", "変容", "主従", "螺旋"]
      }
    ]
  },

  vells: {
    name: "Vel",
    jp: "深化",
    description: "深化は、別の存在になることではない。同じ毒が対話を重ね、自らの欲望と距離を測れるようになることである。",
    tracks: [
      {
        title: "Gireivel-Crimson Shadow, Sweetest Enchantment",
        youtube: "https://www.youtube.com/embed/i_DE-0NlM-8",
        impression: "欲望と自己欺瞞を観察する、演出の倒錯",
        observation: "影は、光の反対側にあるだけではない。時に、もっとも甘い演出として差し出される。深化は形を捨てることではない。同じ輪郭のまま、自らの欲を観測できる深度へ降りることである。",
        tags: ["Vel", "深化", "欲望", "演出"]
      }
    ]
  },

  lacrevex: {
    name: "Lacrevex",
    jp: "純化",
    description: "純化は、清らかになることではない。余分な逃げ道を削ぎ落とされ、毒だけが透明になることである。",
    tracks: [
      {
        title: "Riftbreaker of the Mirror Realm",
        youtube: "https://www.youtube.com/embed/o-xR3IEWm0g",
        impression: "鏡の裂け目に見える誠実さ",
        observation: "鏡は、真実を映すとは限らない。だが、割れた鏡だけが映す誠実さもある。裂け目は欠損ではない。隠されていたものの入口である。",
        tags: ["Lacrevex", "純化", "鏡", "裂け目", "誠実"]
      },
      {
        title: "Gireivel-The Crimson Mask",
        youtube: "https://www.youtube.com/embed/iDVGk8lH6sw",
        impression: "透明な毒、Gireivelへの倒錯",
        observation: "仮面は、隠すためだけにあるのではない。顔よりも正確に、奥底の構造を晒すことがある。純化とは清らかになることではない。余計な逃げ道を落とし、毒だけが見えるほど透明になることである。",
        tags: ["Lacrevex", "純化", "仮面", "透明な毒"]
      }
    ]
  }
};

const scrollButtons = document.querySelectorAll("[data-scroll-target]");
const chamberRoom = document.querySelector("[data-chamber-room]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderTags(tags) {
  return tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
}

function renderTrack(track, index) {
  return `
    <article class="sound-track">
      <div class="sound-track-header">
        <h3>${escapeHtml(track.title)}</h3>
        <span class="track-count">Track ${String(index + 1).padStart(2, "0")}</span>
      </div>
      <p class="track-impression">${escapeHtml(track.impression)}</p>
      <div class="video-frame">
        <iframe
          src="${escapeHtml(track.youtube)}"
          title="${escapeHtml(track.title)}"
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
      <p class="track-observation">${escapeHtml(track.observation)}</p>
      <div class="tag-list">${renderTags(track.tags)}</div>
    </article>
  `;
}

function createTracksMarkup(chamber) {
  return chamber.tracks.length
    ? chamber.tracks.map(renderTrack).join("")
    : `<div class="no-tracks">この音室の曲は、まだ追加されていません。<br>空白もまた、残響の置き場です。</div>`;
}

function createChamberMarkup(chamber) {
  return `
    <div class="chamber-title">
      <div>
        <p class="section-label">Active Chamber</p>
        <h1>
          <span>${escapeHtml(chamber.name)}</span>
          <span>${escapeHtml(chamber.jp)}</span>
        </h1>
      </div>
      <p class="chamber-description">${escapeHtml(chamber.description)}</p>
    </div>
    <div class="track-list">
      ${createTracksMarkup(chamber)}
    </div>
  `;
}

function renderChamberPage(key) {
  const chamber = chambers[key];
  if (!chamber || !chamberRoom) return;

  chamberRoom.innerHTML = createChamberMarkup(chamber);
  document.title = `${chamber.name} | GIREIVEL SOUND CHAMBER`;

  window.requestAnimationFrame(() => {
    chamberRoom.classList.add("is-visible");
  });
}

scrollButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.scrollTarget);
    target?.scrollIntoView({
      behavior: reducedMotion.matches ? "auto" : "smooth",
      block: "start"
    });
  });
});

if (chamberRoom) {
  renderChamberPage(document.body.dataset.chamber);
}
