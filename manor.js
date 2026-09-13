(() => {
  const base = new URL('.', document.currentScript.src);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fixedHeadings = () => {
    document.querySelectorAll('h1[data-i18n-ignore], h1[data-manor-english]').forEach(el => { el.dataset.manorEnglish = ''; el.lang = 'en'; });
  };
  fixedHeadings();
  const toolbar = document.createElement('div');
  toolbar.className = 'manor-tools';
  const language = document.querySelector('[data-language-switch]');
  if (language) toolbar.append(language);
  const originalMap = document.querySelector('.map-toggle');
  const map = originalMap || document.createElement('button');
  if (!originalMap) {
    map.type = 'button';
    map.className = 'manor-map-button';
    map.textContent = 'MANOR MAP';
  }
  map.dataset.i18nIgnore = '';
  map.lang = 'en';
  toolbar.append(map);
  document.body.append(toolbar);

  if (!originalMap) {
    const dialog = document.createElement('dialog');
    dialog.className = 'manor-navigation';
    dialog.setAttribute('aria-label', 'MANOR MAP');
    dialog.dataset.i18nIgnore = '';
    dialog.lang = 'en';
    dialog.innerHTML = '<div class="manor-navigation-top"><p>MANOR MAP</p><button type="button" class="manor-navigation-close" aria-label="Close manor map">×</button></div><nav aria-label="Rooms"></nav>';
    const nav = dialog.querySelector('nav');
    const addLink = (label, number, url, active) => {
      const link = document.createElement('a');
      link.href = url;
      const index = document.createElement('span');
      index.textContent = number;
      const name = document.createElement('span');
      name.textContent = label;
      link.append(index, name);
      if (active) link.setAttribute('aria-current', 'page');
      nav.append(link);
    };
    addLink('GIREIVEL MANOR', '00', base.href, false);
    (window.GireivelRooms || []).forEach(room => {
      const url = new URL(room.href, base);
      addLink(room.title, room.number, url.href, location.pathname.startsWith(url.pathname));
    });
    document.body.append(dialog);
    map.setAttribute('aria-haspopup', 'dialog');
    map.setAttribute('aria-expanded', 'false');
    map.addEventListener('click', () => {
      dialog.showModal();
      document.body.classList.add('manor-map-active');
      map.setAttribute('aria-expanded', 'true');
      dialog.querySelector('button').focus();
    });
    dialog.querySelector('button').addEventListener('click', () => dialog.close());
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const controls = [...dialog.querySelectorAll('button, a[href]')];
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('manor-map-active');
      map.setAttribute('aria-expanded', 'false');
      map.focus();
    });
  }

  const veil = document.createElement('div');
  veil.className = 'manor-transition';
  veil.setAttribute('aria-hidden', 'true');
  document.body.append(veil);
  let leaving = false;
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || reduced.matches || link.download || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href, location.href);
    if (!['http:', 'https:', 'file:'].includes(url.protocol) || url.origin !== location.origin || !url.pathname.startsWith(base.pathname) || (url.pathname === location.pathname && url.search === location.search)) return;
    // Record permalinks have an in-page handler and must not become full navigation.
    if (url.searchParams.has('entry') || leaving) return;
    event.preventDefault();
    leaving = true;
    veil.classList.add('is-leaving');
    setTimeout(() => location.assign(url.href), 220);
  });
  window.addEventListener('pageshow', () => { leaving = false; veil.classList.remove('is-leaving'); });
  const pause = () => document.documentElement.classList.toggle('manor-paused', document.hidden);
  document.addEventListener('visibilitychange', pause);
  pause();

  const seen = new WeakSet();
  const reveal = 'main > section, .quiet-section, .sound-track, .entry, .room-layout';
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (!reduced.matches) entry.target.classList.add('manor-arrived');
      observer.unobserve(entry.target);
    });
  }, { threshold: .06 }) : null;
  const scan = root => {
    if (!(root instanceof Element)) return;
    fixedHeadings();
    const targets = [...root.querySelectorAll(reveal)];
    if (root.matches(reveal)) targets.unshift(root);
    targets.forEach(el => {
      if (seen.has(el) || el.closest('.manor-home') || el.classList.contains('chamber-view')) return;
      seen.add(el);
      observer?.observe(el);
    });
  };
  scan(document.body);
  new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(scan))).observe(document.querySelector('main') || document.body, { childList: true, subtree: true });
})();
