'use strict';

const { apps, categories } = window.TapAxisCatalog;
const appById = new Map(apps.map(app => [app.id, app]));
const categoryById = new Map(categories.map(category => [category.id, category]));
const main = document.querySelector('#main');
const dock = document.querySelector('#dock');
const root = document.documentElement;
const menu = document.querySelector('#menu');
const install = document.querySelector('#install');
const support = document.querySelector('#support');
const chatMessages = document.querySelector('#chat-messages');
let webApp;
let inTelegram = false;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const glyphs = {
  home: '<path d="M3.5 10.5 12 3l8.5 7.5V21h-17z"/><path d="M9 21v-6h6v6"/>',
  search: '<circle cx="10.6" cy="10.6" r="6.6"/><path d="m15.5 15.5 5 5"/>',
  menu: '<path d="M3 5h18M3 12h18M3 19h18"/>',
  menuSmall: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  message: '<path d="M20.8 5.7a1.7 1.7 0 0 0-1.7-1.7H4.9a1.7 1.7 0 0 0-1.7 1.7v14l5-3.1h10.9a1.7 1.7 0 0 0 1.7-1.7z" fill="currentColor" stroke="none"/><circle cx="8" cy="10.4" r="1" fill="#254de6" stroke="none"/><circle cx="12" cy="10.4" r="1" fill="#254de6" stroke="none"/><circle cx="16" cy="10.4" r="1" fill="#254de6" stroke="none"/>',
  right: '<path d="m9 5 7 7-7 7"/>',
  left: '<path d="m15 5-7 7 7 7"/>',
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  apps: '<rect x="3.5" y="3.5" width="6" height="6" rx="1.5"/><rect x="14.5" y="3.5" width="6" height="6" rx="1.5"/><rect x="3.5" y="14.5" width="6" height="6" rx="1.5"/><rect x="14.5" y="14.5" width="6" height="6" rx="1.5"/>',
  external: '<path d="M13 4h7v7m0-7-9 9"/><path d="M10 5H5v14h14v-5"/>',
  play: '<path d="m8 4 13 8-13 8z" fill="currentColor" stroke="none"/>',
  send: '<path d="m21 3-7 18-3.5-7.5L3 10zM21 3 10.5 13.5"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 19v2h16v-2"/>',
  food: '<path d="M4 4v4a3 3 0 0 0 6 0V4M7 4v17m12 0V4c-3 2-4 5-4 8h4"/>',
  health: '<path d="M20.7 8.7c0 4.1-8.7 9.8-8.7 9.8s-8.7-5.7-8.7-9.8A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 8.7 1.7Z"/>',
  games: '<path d="M8 8h8a4 4 0 0 1 3.8 2.9l1.2 4.4a2.2 2.2 0 0 1-3.8 2.1L15 15H9l-2.2 2.4A2.2 2.2 0 0 1 3 15.3l1.2-4.4A4 4 0 0 1 8 8Z"/><path d="M7 11v4m-2-2h4m6.9-.9h.2m2.1 1.7h.2"/>',
  learning: '<path d="M12 6c-3.1-2-6-2.4-9-1v13c3-1.4 5.9-1 9 1 3.1-2 6-2.4 9-1V5c-3-1.4-5.9-1-9 1Zm0 0v13"/>',
  social: '<path d="M21 11a8 8 0 0 1-8 8H8l-4 2v-4a8 8 0 0 1 5-14h4a8 8 0 0 1 8 8Z"/><path d="M8 11h8"/>',
  shopping: '<path d="M5 8h14l1.5 12H3.5L5 8Zm4 2V7a3 3 0 0 1 6 0v3"/>',
  tools: '<path d="M14 6a5 5 0 0 0-6.6 6.6L3.5 17l3.5 3.5 4.4-3.9A5 5 0 0 0 18 10l-2.8 2.8-3-3L15 7Z"/>',
  travel: '<path d="M21 3 3 11l7 3 3 7L21 3Zm-11 11 5-5"/>',
  work: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V4h8v3M3 12c5 2 13 2 18 0m-9 1v3"/>',
  entertainment: '<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><path d="m10 9 5 3-5 3Z"/>',
  navigation: '<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
  finance: '<rect x="3" y="6" width="18" height="12" rx="2.5"/><path d="M3 10h18m-14 5h3"/>',
  star: '<path d="m12 3.5 2.6 5.4 6 .9-4.3 4.2 1 6-5.3-2.8-5.3 2.8 1-6-4.3-4.2 6-.9Z"/>'
};

const featured = ['vkontakte', 'minecraft', 'sber', 'avito', 'procreate-pocket', 'max-messenger'];
const highlights = ['sber', 'vkontakte', 'avito', 'max-messenger', 'minecraft', 'vk-video'];
const games = ['gta-san-andreas', 'minecraft', 'balatro', 'stardew-valley', 'farming-simulator-26', 'geometry-dash'];
const selected = ['mail-ru', 'avito', 'procreate-pocket', 'tbank', 'shadowrocket', 'dzen'];
const allFilters = [
  ['all', 'Все'],
  ['ru', 'Российские'],
  ['paid', 'Платные']
];

const faq = [
  {
    title: 'Как установить приложение?',
    matches: /установ|скач|app store|апп стор|получить/,
    answer: 'Откройте карточку приложения и нажмите «Скачать». В инструкции есть кнопка перехода в App Store, где можно проверить цену и начать загрузку. Для остальных в инструкции есть официальный сайт и доступные варианты для iPhone.'
  },
  {
    title: 'Экранная задержка',
    matches: /задержк|час ждать|защита украден/,
    answer: 'Если iPhone показывает задержку безопасности, дождитесь времени, указанного на экране. Apple может запустить часовую задержку при изменении защищённых настроек. Для обычной загрузки в App Store менять настройки аккаунта не нужно.',
    helpUrl: 'https://support.apple.com/ru-ru/120340',
    helpLabel: 'Справка Apple'
  },
  {
    title: 'Таймер истёк / Неверные данные',
    matches: /таймер|неверн|ист[ее]к|ошибк/,
    answer: 'Откройте официальный сайт из карточки приложения. Если ошибка повторяется, проверьте раздел помощи на сайте разработчика.'
  },
  {
    title: 'Приложение недоступно',
    matches: /недоступ|регион|удален|пропал/,
    answer: 'Доступность приложений зависит от региона App Store. Если карточка магазина не открывается, проверьте ссылку на официальный сайт в карточке приложения.'
  }
];

const russianNumber = new Intl.NumberFormat('ru-RU');
const ratingNumber = new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const searchEntries = apps.map(app => ({
  app,
  name: normalize(app.name),
  text: normalize([app.name, app.aliases, app.id].join(' '))
}));

let activeRoute = readRoute();
let homeQuery = '';
let menuQuery = '';
let editorHasFocus = false;

function escapeHtml(value) {
  const replacements = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(value).replace(/[&<>"']/g, character => replacements[character]);
}

function icon(id) {
  return `<span class="glyph" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">${glyphs[id]}</svg></span>`;
}

function readRoute() {
  const hash = location.hash.slice(1);
  const [path, query = ''] = hash.split('?');
  if (path.startsWith('app/')) {
    const app = appById.get(path.slice(4));
    return app ? { page: 'app', app } : { page: 'missing' };
  }
  if (path === 'catalog') {
    const params = new URLSearchParams(query);
    const scope = params.get('view');
    const category = params.get('category');
    return {
      page: 'catalog',
      scope: allFilters.some(([id]) => id === scope) ? scope : 'all',
      category: categoryById.get(category),
      query: (params.get('q') ?? '').slice(0, 100)
    };
  }
  return { page: 'home' };
}

function appRoute(app) {
  return '#app/' + app.id;
}

function catalogRoute(scope = 'all', category = '', query = '') {
  const params = new URLSearchParams();
  if (scope !== 'all') params.set('view', scope);
  if (category) params.set('category', category);
  if (query) params.set('q', query);
  const encoded = params.toString();
  return '#catalog' + (encoded ? '?' + encoded : '');
}

function navigate(href, options = {}) {
  const prior = location.hash || '#home';
  closeDialog();
  if (prior !== href) {
    const keepState = { ...history.state, tapaxis: true, scroll: window.scrollY };
    history.replaceState(keepState, '');
    history.pushState({ tapaxis: true, from: prior, scroll: 0 }, '', href);
    activeRoute = readRoute();
    render(options.focusSearch);
    return;
  }
  if (options.focusSearch) document.querySelector('#catalog-search')?.focus({ preventScroll: true });
  else window.scrollTo(0, 0);
}

function render(focusSearch = false, scroll = 0, focusMain = true) {
  document.body.dataset.page = activeRoute.page;
  dock.hidden = activeRoute.page === 'app';
  const page = activeRoute.page;
  if (page === 'home') {
    document.title = 'TapAxis · Каталог для iPhone';
    renderHome();
  } else if (page === 'catalog') {
    document.title = 'Каталог · TapAxis';
    renderCatalog();
  } else if (page === 'app') {
    document.title = activeRoute.app.name + ' · TapAxis';
    renderDetail(activeRoute.app);
  } else {
    document.title = 'Карточка не найдена · TapAxis';
    main.innerHTML = `<div class="surface empty-state"><h1>Приложение не найдено</h1><p>Эта карточка отсутствует в каталоге.</p><a href="#catalog" data-route="#catalog" class="action">Открыть каталог</a></div>`;
  }
  updateNavigation();
  window.scrollTo(0, scroll);
  if (focusSearch) document.querySelector('#catalog-search')?.focus({ preventScroll: true });
  else if (focusMain) main.focus({ preventScroll: true });
}

function storeRating(app) {
  return app.store?.rating > 0 && app.store?.ratingCount > 0 ? ratingNumber.format(app.store.rating) : '';
}

function iconMarkup(app, eager = false) {
  const imgClass = app.webIcon ? ' web-icon' : '';
  const atlasStyle = app.atlas ? ` background-position:${app.atlas[0]}% ${app.atlas[1]}%;` : '';
  const picture = app.atlas
    ? `<span class="app-art" style="${atlasStyle}"></span>`
    : app.icon ? `<img src="${escapeHtml(app.icon)}" alt="" width="96" height="96" decoding="async" loading="${eager ? 'eager' : 'lazy'}">` : '';
  return `<span class="app-icon${imgClass}" style="--app-color:${app.color}" aria-hidden="true"><span>${escapeHtml(app.initials)}</span>${picture}</span>`;
}

function row(app, kind, optionId = '') {
  const rating = storeRating(app);
  const info = `<span class="row-body"><strong class="tile-name">${escapeHtml(app.name)}</strong><span class="row-note">${categoryById.get(app.category).name}${rating && kind !== 'suggest-row' ? ` · <span class="rating" aria-label="Оценка App Store ${rating}">★ ${rating}</span>` : ''}</span></span>`;
  const arrow = `<span class="row-chevron">${icon('right')}</span>`;
  const href = appRoute(app);
  if (kind === 'suggest-row') return `<li role="presentation"><button type="button" role="option" aria-selected="false" tabindex="-1" id="${optionId}" class="${kind}" data-route="${href}">${iconMarkup(app)}${info}${arrow}</button></li>`;
  return `<a class="${kind}" href="${href}" data-route="${href}">${iconMarkup(app)}${info}${arrow}</a>`;
}

function tile(app) {
  const score = storeRating(app);
  const href = appRoute(app);
  return `<a class="tile" href="${href}" data-route="${href}">
    <span class="tile-head">${iconMarkup(app)}${score ? `<span class="rating" aria-label="Оценка App Store ${score}">★ ${score}</span>` : ''}</span>
    <span><strong class="tile-name">${escapeHtml(app.name)}</strong><span class="tile-note">${categoryById.get(app.category).name}</span></span>
    <span class="tile-footer">Открыть ${icon('arrow')}</span>
  </a>`;
}

function sectionHeading(title, accessory = '') {
  return `<div class="section-heading"><h2>${title}</h2>${accessory}</div>`;
}

function sectionLink(title, href) {
  return `<a class="section-link" href="${href}" data-route="${href}">${title} ${icon('arrow')}</a>`;
}

function shelf(title, selection, href, compact = false, linkLabel = 'Все') {
  const cards = selection.map(id => appById.get(id)).filter(Boolean);
  return `<section class="page-section">
    ${sectionHeading(title, sectionLink(linkLabel, href))}
    <div class="shelf horizontal${compact ? ' compact' : ''}" aria-label="${title}" tabindex="0">
      ${cards.map(app => compact ? row(app, 'compact-tile') : tile(app)).join('')}
    </div>
  </section>`;
}

function categoryLink(label, badge, href) {
  return `<a class="category" href="${href}" data-route="${href}"><span class="category-icon" aria-hidden="true">${badge}</span><span class="category-name">${label}</span><span class="row-chevron">${icon('right')}</span></a>`;
}

function wordmark() {
  return '<a class="wordmark" href="#home" data-route="#home" aria-label="TapAxis, главная"><span class="brand-mark" aria-hidden="true"></span><span>TapAxis</span></a>';
}

function footer() {
  return `<footer class="footer">
    ${wordmark()}
    <p>Каталог приложений, игр и веб-сервисов для iPhone.</p>
    <button class="footer-support" type="button" data-action="support">Поддержка</button>
  </footer>`;
}

function searchForm(id, value, suggestions = false) {
  const auto = suggestions ? `role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="${id}-list"` : '';
  return `<form class="search-wrap" role="search" data-search="${id}">
    <label class="sr-only" for="${id}">Поиск приложений</label>
    <div class="search-box">
      ${icon('search')}
      <input id="${id}" name="q" type="search" ${auto} placeholder="Поиск приложений" value="${escapeHtml(value)}" inputmode="search" enterkeyhint="search" autocomplete="off" maxlength="100">
      <button class="clear-button" type="button" aria-label="Очистить поиск" data-clear ${value ? '' : 'hidden'}>${icon('close')}</button>
    </div>
    ${suggestions ? `<div class="suggestions" hidden><ul role="listbox" id="${id}-list" aria-label="Подходящие приложения"></ul><p class="suggest-empty" role="status" hidden>Ничего не нашли. Попробуйте другое название.</p><button class="suggest-bottom" type="submit">Показать все результаты</button></div>` : ''}
  </form>`;
}

function renderHome() {
  const showcase = featured.map(id => {
    const app = appById.get(id);
    const href = appRoute(app);
    return `<a class="hero-app" href="${href}" data-route="${href}" aria-label="${escapeHtml(app.name)}">${iconMarkup(app, true)}</a>`;
  }).join('');

  main.innerHTML = `
    <section class="hero-search surface" aria-labelledby="home-title">
      <div class="hero-main">
        <h1 id="home-title">Приложения <span>для iPhone</span></h1>
        ${searchForm('home-search', homeQuery, true)}
        <div class="hero-filters" aria-label="Разделы каталога">
          <a class="chip" href="#catalog?view=ru" data-route="#catalog?view=ru">Российские ${icon('right')}</a>
          <a class="chip" href="#catalog?view=paid" data-route="#catalog?view=paid">Платные ${icon('right')}</a>
        </div>
      </div>
      <div class="hero-showcase" aria-label="Приложения из каталога">${showcase}</div>
    </section>
    ${shelf('Популярное', highlights, '#catalog', true)}
    ${shelf('Игры', games, catalogRoute('all', 'games'), true, 'Ещё')}
    ${shelf('Из каталога', selected, '#catalog')}
    <section class="page-section">
      ${sectionHeading('Категории', `<span class="count">${categories.length}</span>`)}
      <div class="category-grid">${categories.map(category => categoryLink(category.name, icon(category.id), catalogRoute('all', category.id))).join('')}</div>
    </section>
    <a class="all-banner" href="#catalog" data-route="#catalog">${icon('apps')}<strong>Полный каталог</strong><span class="count">${apps.length}</span>${icon('arrow')}</a>
    ${footer()}`;
  wireSearch('home-search', query => { homeQuery = query; }, true);
}

function renderCatalog() {
  const title = activeRoute.category?.name ?? 'Все приложения';
  const chips = allFilters.map(([id, name]) => {
    const href = catalogRoute(id, activeRoute.category?.id, activeRoute.query);
    return `<a class="chip" data-filter="${id}" href="${href}" data-route="${href}" aria-current="${activeRoute.scope === id}">${name}</a>`;
  }).join('');
  main.innerHTML = `<section class="catalog-head surface">
    <h1>${title}</h1>
    ${searchForm('catalog-search', activeRoute.query)}
    <nav class="filters" aria-label="Фильтры каталога">${chips}
      ${activeRoute.category ? `<a class="chip" href="#catalog" data-route="#catalog">${icon('close')} Все категории</a>` : ''}
    </nav>
  </section>
  <section class="catalog-results" aria-label="Приложения">
    <div class="result-caption" id="result-caption" role="status"></div>
    <div id="catalog-results"></div>
  </section>`;
  const change = query => {
    activeRoute.query = query;
    const category = activeRoute.category?.id ?? '';
    const href = catalogRoute(activeRoute.scope, category, query);
    history.replaceState({ ...history.state, tapaxis: true }, '', href);
    main.querySelectorAll('[data-filter]').forEach(link => {
      const filterHref = catalogRoute(link.dataset.filter, category, query);
      link.href = filterHref;
      link.dataset.route = filterHref;
    });
    renderResults();
  };
  wireSearch('catalog-search', change);
  renderResults();
}

function renderResults() {
  const { query, scope, category } = activeRoute;
  const matches = search(query).filter(app => (scope === 'all' || app.group === scope) && (!category || app.category === category.id));
  document.querySelector('#result-caption').textContent = query.trim() ? `Найдено ${matches.length} из ${apps.length}` : `В каталоге ${matches.length} ${pluralApp(matches.length)}`;
  document.querySelector('#catalog-results').innerHTML = matches.length
    ? `<ul class="app-list">${matches.map(app => `<li>${row(app, 'app-row')}</li>`).join('')}</ul>`
    : `<div class="surface empty-state"><h2>Приложения не найдены</h2><p>Проверьте название или попробуйте поиск по всему каталогу.</p><a href="#catalog" class="chip" data-route="#catalog">Сбросить поиск</a></div>`;
}

function pluralApp(count) {
  const n = count % 100;
  if (n >= 11 && n <= 14) return 'приложений';
  if (n % 10 === 1) return 'приложение';
  if (n % 10 >= 2 && n % 10 <= 4) return 'приложения';
  return 'приложений';
}

function normalize(value) {
  return String(value).normalize('NFKC').toLowerCase().replaceAll('ё', 'е').replace(/[’']/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

function search(value) {
  const query = normalize(value);
  if (!query) return apps;
  const terms = query.split(' ');
  return searchEntries.filter(entry => terms.every(term => entry.text.includes(term)))
    .map(entry => ({
      app: entry.app,
      relevance: entry.name === query ? 4
        : entry.name.startsWith(query) ? 3
        : entry.name.includes(query) ? 2
        : entry.text.includes(query) ? 1 : 0
    }))
    .sort((first, second) => second.relevance - first.relevance)
    .map(entry => entry.app);
}

function wireSearch(id, onChange, hasSuggestions = false) {
  const input = document.getElementById(id);
  const form = input.form;
  const clear = form.querySelector('[data-clear]');
  const popover = form.querySelector('.suggestions');
  const list = popover?.querySelector('ul');
  let matches = [];
  let activeIndex = -1;

  function hide() {
    if (!hasSuggestions) return;
    popover.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    activeIndex = -1;
  }

  function updateSuggestions() {
    if (!hasSuggestions) return;
    if (!input.value.trim()) {
      hide();
      return;
    }
    matches = search(input.value).slice(0, 5);
    activeIndex = -1;
    list.innerHTML = matches.map((app, index) => row(app, 'suggest-row', `${id}-result-${index}`)).join('');
    popover.querySelector('.suggest-empty').hidden = matches.length > 0;
    popover.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    input.removeAttribute('aria-activedescendant');
  }

  function update() {
    onChange(input.value);
    clear.hidden = !input.value;
    updateSuggestions();
  }

  input.addEventListener('input', update);
  input.addEventListener('focus', updateSuggestions);
  clear.addEventListener('click', () => {
    input.value = '';
    input.focus();
    update();
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const query = input.value.trim();
    if (hasSuggestions) {
      if (activeIndex >= 0 && matches[activeIndex]) navigate(appRoute(matches[activeIndex]));
      else navigate(catalogRoute('all', '', query));
    } else input.blur();
  });
  form.addEventListener('focusout', event => {
    if (event.relatedTarget && !form.contains(event.relatedTarget)) hide();
  });
  form.addEventListener('tapaxis-hide-suggestions', hide);
  input.addEventListener('keydown', event => {
    if (!hasSuggestions || popover.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      hide();
      return;
    }
    if (!matches.length || !['ArrowDown', 'ArrowUp'].includes(event.key)) return;
    event.preventDefault();
    const step = event.key === 'ArrowDown' ? 1 : -1;
    activeIndex = activeIndex < 0 ? (step === 1 ? 0 : matches.length - 1) : (activeIndex + step + matches.length) % matches.length;
    list.querySelectorAll('[role=option]').forEach((option, index) => option.setAttribute('aria-selected', String(index === activeIndex)));
    const chosen = list.querySelectorAll('[role=option]')[activeIndex];
    input.setAttribute('aria-activedescendant', chosen.id);
    chosen.scrollIntoView({ block: 'nearest' });
  });
}

function priceText(app) {
  if (app.store?.price > 0) return app.store.priceLabel;
  if (app.group === 'paid') return app.store?.price === 0 ? 'Бесплатная загрузка · покупки в приложении' : 'Цена в App Store';
  return app.store ? 'Бесплатная загрузка' : 'На сайте разработчика';
}

function gallery(app) {
  if (!app.store?.screens?.length) return '';
  const figures = app.store.screens.map((url, index) => `<figure><span class="shot-fallback" hidden>Скриншот недоступен</span><img src="${escapeHtml(url)}" alt="${escapeHtml(app.name)}. Скриншот ${index + 1}" decoding="async" loading="${index === 0 ? 'eager' : 'lazy'}"></figure>`);
  return `<section class="gallery" aria-label="Скриншоты из App Store">
    <div class="gallery-track horizontal ${app.store.landscape ? 'landscape' : ''}" tabindex="0">${figures.join('')}</div>
    ${figures.length > 1 ? `<button class="gallery-prev" type="button" data-slide="-1" aria-label="Предыдущий скриншот">${icon('left')}</button>
    <button class="gallery-next" type="button" data-slide="1" aria-label="Следующий скриншот">${icon('right')}</button>` : ''}
    <span class="gallery-count" aria-live="polite">1 / ${figures.length}</span>
  </section>`;
}

function specGrid(app) {
  const store = app.store;
  const pairs = store
    ? [['Разработчик', store.seller], ['Размер', store.size], ['Возраст', store.age], ['Версия', store.version]]
    : [['Категория', categoryById.get(app.category).name], ['Где открыть', 'Официальный сайт']];
  return `<dl class="specs">${pairs.filter(([, value]) => value).map(([label, value]) => `<div><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</dl>`;
}

function stars(value) {
  const rounded = Math.min(5, Math.max(1, Math.round(value)));
  return `<span class="stars" aria-label="${value} из 5">${'★'.repeat(rounded)}${'☆'.repeat(5 - rounded)}</span>`;
}

function reviewCard(score, content) {
  return `<article class="review-card"><header><span class="review-caption">Пример отзыва</span>${stars(score)}</header><p>${escapeHtml(content)}</p></article>`;
}

function reviews(app) {
  const buttons = [1, 2, 3, 4, 5].map(value => `<input type="radio" name="score" value="${value}" id="score-${value}" required><label for="score-${value}" aria-label="${value} из 5">★</label>`).join('');
  return `<section class="page-section" aria-labelledby="reviews-title">
    <div class="section-heading"><h2 id="reviews-title">Отзывы и оценки</h2></div>
    <form class="review-form" id="review-form">
      <h3>Оставить отзыв</h3>
      <p>Отзыв можно посмотреть в этой карточке. После выхода из неё он исчезнет.</p>
      <div class="review-stars" role="radiogroup" aria-label="Ваша оценка">${buttons}</div>
      <label class="sr-only" for="review-text">Текст отзыва</label>
      <textarea id="review-text" name="text" maxlength="1000" required placeholder="Что понравилось, а что нет?"></textarea>
      <span class="review-count" id="review-count">0 / 1000</span>
      <button type="submit" class="action">Посмотреть отзыв</button>
    </form>
    <div id="review-preview" class="review-list" aria-live="polite" hidden></div>
    <div class="review-list" aria-label="Демонстрационные примеры отзывов">
      ${app.reviews.map(review => reviewCard(review.score, review.text)).join('')}
    </div>
  </section>`;
}

function renderDetail(app) {
  const score = storeRating(app);
  const category = categoryById.get(app.category);
  const related = apps.filter(other => other.id !== app.id && other.category === app.category).slice(0, 3);
  main.innerHTML = `
    <section class="detail-card surface">
      <div class="detail-intro">
        ${iconMarkup(app, true)}
        <div>
          <a class="detail-tag" href="${catalogRoute('all', category.id)}" data-route="${catalogRoute('all', category.id)}">${category.name}</a>
          <h1>${escapeHtml(app.name)}</h1>
          <p>${escapeHtml(app.subtitle)}</p>
        </div>
      </div>
      <div class="detail-actions">
        <button type="button" class="action" data-action="install" aria-haspopup="dialog" aria-controls="install">${icon('download')} Скачать</button>
        <button type="button" class="action secondary" data-action="back">Вернуться</button>
      </div>
    </section>
    ${gallery(app)}
    ${score ? `<div class="rating-summary">${stars(app.store.rating)}<strong>${score}</strong><span>${russianNumber.format(app.store.ratingCount)} оценок в App Store</span></div>` : ''}
    ${specGrid(app)}
    <section class="page-section">
      ${sectionHeading('Описание')}
      <p class="description">${escapeHtml(app.description)}</p>
      ${app.notice ? `<p class="store-notice">${escapeHtml(app.notice)}</p>` : ''}
      <a class="source-line" href="${escapeHtml(app.url)}" data-external>${app.store ? `Источник данных · App Store ${app.store.region}` : 'Официальная страница'} ${icon('external')}</a>
    </section>
    ${reviews(app)}
    ${related.length ? `<section class="page-section">${sectionHeading('В той же категории')}<ul class="app-list">${related.map(other => `<li>${row(other, 'app-row')}</li>`).join('')}</ul></section>` : ''}
    ${footer()}`;

  wireGallery();
  wireReview();
}

function wireGallery() {
  const galleryElement = main.querySelector('.gallery');
  if (!galleryElement) return;
  const track = galleryElement.querySelector('.gallery-track');
  const slides = [...track.children];
  const prev = galleryElement.querySelector('.gallery-prev');
  const next = galleryElement.querySelector('.gallery-next');
  if (slides.length <= 1) return;

  const position = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll > 0 && track.scrollLeft >= maxScroll - 2) return slides.length - 1;
    return slides.reduce((best, slide, index) =>
      Math.abs(track.scrollLeft - slide.offsetLeft) < Math.abs(track.scrollLeft - slides[best].offsetLeft) ? index : best, 0);

  };
  const update = () => {
    const index = position();
    const count = galleryElement.querySelector('.gallery-count');
    const label = `${index + 1} / ${slides.length}`;
    if (count.textContent !== label) count.textContent = label;
    prev.disabled = index === 0;
    next.disabled = index === slides.length - 1;
  };
  const goTo = index => {
    const target = slides[index];
    if (target) track.scrollTo({ left: target.offsetLeft, behavior: reduceMotion.matches ? 'instant' : 'smooth' });
  };
  prev.addEventListener('click', () => goTo(position() - 1));
  next.addEventListener('click', () => goTo(position() + 1));
  track.addEventListener('scroll', update, { passive: true });
  update();
}

function wireReview() {
  const form = main.querySelector('#review-form');
  const textarea = form.querySelector('textarea');
  const counter = form.querySelector('#review-count');
  const preview = main.querySelector('#review-preview');
  textarea.addEventListener('input', () => {
    textarea.setCustomValidity('');
    counter.textContent = `${textarea.value.length} / 1000`;
  });
  form.addEventListener('change', event => {
    if (event.target.name !== 'score') return;
    const score = Number(event.target.value);
    form.querySelectorAll('label[for^="score"]').forEach((label, index) => label.classList.toggle('is-filled', index < score));
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const content = textarea.value.trim();
    if (!content) {
      textarea.setCustomValidity('Напишите пару слов о приложении.');
      textarea.reportValidity();
      return;
    }
    const score = Number(new FormData(form).get('score'));
    const card = document.createElement('article');
    card.className = 'review-card edit-preview';
    card.innerHTML = `<header><strong>Ваш предпросмотр</strong>${stars(score)}</header><p></p>`;
    card.querySelector('p').textContent = content;
    preview.hidden = false;
    preview.replaceChildren(card);
    textarea.blur();
    preview.scrollIntoView({ block: 'nearest', behavior: reduceMotion.matches ? 'instant' : 'smooth' });
  });
}

function renderMenu() {
  document.querySelector('#menu-content').innerHTML = `
    ${searchForm('menu-search', menuQuery, true)}
    <nav class="drawer-links" aria-label="Меню каталога">
      ${categoryLink('Главная', icon('home'), '#home')}
      ${categoryLink('Все приложения', icon('apps'), '#catalog')}
      ${categoryLink('Платные приложения', icon('star'), catalogRoute('paid'))}
      <h3>Категории</h3>
      ${categories.map(category => categoryLink(category.name, icon(category.id), catalogRoute('all', category.id))).join('')}
    </nav>`;
  wireSearch('menu-search', query => { menuQuery = query; }, true);
}

function openInstall(app) {
  const isStore = Boolean(app.store || app.url.startsWith('https://apps.apple.com/'));
  const steps = isStore
    ? ['Нажмите «Открыть в App Store» внизу окна.', 'На странице приложения нажмите цену или «Загрузить».', 'Подтвердите загрузку на iPhone и дождитесь установки.']
    : ['Нажмите «Открыть официальный сайт» внизу окна.', 'Проверьте, предлагает ли разработчик приложение или веб-версию для iPhone.', 'Для веб-версии откройте страницу в Safari. Если сервис поддерживает ярлык, выберите «Поделиться», затем «На экран “Домой”».'];
  document.querySelector('#install-content').innerHTML = `<div class="install-body">
    <div class="install-top">
      <span class="install-tag">${iconMarkup(app, true)} ${escapeHtml(app.name)}</span>
      <button type="button" class="square-button close-button" data-action="close" aria-label="Закрыть инструкцию">${icon('close')}</button>
    </div>
    <h2 id="install-title">Инструкция по установке</h2>
    <p class="install-intro">${isStore ? escapeHtml(priceText(app)) + ' · наличие и цена зависят от региона.' : 'Условия установки и входа публикует разработчик.'}</p>
    <div class="install-steps"><h3>Полная текстовая инструкция</h3><ol>${steps.map(step => `<li>${step}</li>`).join('')}</ol></div>
    <p class="install-note">Используйте свой аккаунт Apple для App Store. Храните пароли и коды подтверждения при себе.</p>
    <button type="button" data-action="video" class="action outline" aria-expanded="false" aria-controls="install-video">${icon('play')} Смотреть видеоинструкцию</button>
    <video id="install-video" width="396" height="700" controls playsinline preload="none" hidden>
      <source src="./media/install-guide.mp4?v=2" type="video/mp4">
      <track kind="captions" src="./media/install-guide.vtt?v=2" srclang="ru" label="Русский">
    </video>
    <a class="action" href="${escapeHtml(app.url)}" data-external>${isStore ? 'Открыть в App Store' : 'Открыть официальный сайт'} ${icon('external')}</a>
  </div>`;
  showDialog(install);
  install.scrollTop = 0;
}

function addChatMessage(text, { sent = false, helpUrl, helpLabel } = {}) {
  const message = document.createElement('p');
  message.className = sent ? 'bubble sent' : 'bubble';
  message.textContent = text;
  if (helpUrl) {
    const link = document.createElement('a');
    link.href = helpUrl;
    link.dataset.external = '';
    link.textContent = helpLabel;
    message.append(' ', link);
  }
  chatMessages.append(message);
}

function answerChat(question, preset) {
  addChatMessage(question, { sent: true });
  const answer = preset ?? faq.find(item => item.matches.test(normalize(question)));
  if (answer) addChatMessage(answer.answer, answer);
  else addChatMessage('Если вопрос об установке, откройте нужную карточку и нажмите «Скачать». Там есть инструкция и официальный источник.');
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showDialog(dialog) {
  closeDialog();
  dialog.showModal();
  updateNavigation();
}

function closeDialog() {
  document.querySelector('dialog[open]')?.close();
}

function goBack() {
  if (document.querySelector('dialog[open]')) {
    closeDialog();
    return;
  }
  if (activeRoute.page === 'app' && history.state?.from) history.back();
  else navigate('#home');
}

function updateNavigation() {
  const menuOpen = menu.open;
  document.querySelectorAll('[data-action="menu"]').forEach(button => button.setAttribute('aria-expanded', String(menuOpen)));
  dock.style.setProperty('--nav-index', menuOpen ? 2 : activeRoute.page === 'catalog' ? 1 : 0);
  dock.querySelectorAll('a[data-nav]').forEach(link => {
    if (link.dataset.nav === activeRoute.page) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  if (!inTelegram || !webApp.BackButton) return;
  if (activeRoute.page !== 'home' || document.querySelector('dialog[open]')) webApp.BackButton.show();
  else webApp.BackButton.hide();
}

function openExternal(event, anchor) {
  const href = anchor.href;
  if (!inTelegram) return;
  if (new URL(href).hostname === 't.me' && typeof webApp.openTelegramLink === 'function') {
    event.preventDefault();
    webApp.openTelegramLink(href);
  } else if (typeof webApp.openLink === 'function') {
    event.preventDefault();
    webApp.openLink(href);
  }
}

function updateInsets() {
  const viewport = window.visualViewport;
  const keyboardInset = editorHasFocus && viewport ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop) : 0;
  root.style.setProperty('--kbd', `${keyboardInset}px`);
  root.classList.toggle('keyboard-open', keyboardInset > 110);
  if (inTelegram) {
    const isFullscreen = webApp.isFullscreen === true;
    root.style.setProperty('--tg-safe-top', isFullscreen ? `${(webApp.safeAreaInset?.top ?? 0) + (webApp.contentSafeAreaInset?.top ?? 0)}px` : '0px');
    root.style.setProperty('--tg-safe-bottom', isFullscreen ? `${Math.max(webApp.safeAreaInset?.bottom ?? 0, webApp.contentSafeAreaInset?.bottom ?? 0)}px` : '0px');
  }
}

document.querySelectorAll('[data-icon]').forEach(element => {
  element.innerHTML = icon(element.dataset.icon);
});

renderMenu();
document.querySelector('#chat-quick').innerHTML = faq.map((item, index) => `<button type="button" class="chip" data-faq="${index}">${escapeHtml(item.title)}</button>`).join('');
document.querySelector('#chat-form').addEventListener('submit', event => {
  event.preventDefault();
  const input = document.querySelector('#chat-input');
  const question = input.value.trim();
  if (!question) return;
  input.value = '';
  input.blur();
  answerChat(question);
});

document.querySelector('.skip-link').addEventListener('click', event => {
  event.preventDefault();
  main.focus();
});

document.addEventListener('pointerdown', event => {
  document.querySelectorAll('input[aria-expanded="true"]').forEach(input => {
    if (!input.form.contains(event.target)) input.form.dispatchEvent(new Event('tapaxis-hide-suggestions'));
  });
});

document.addEventListener('click', event => {
  const hit = event.target instanceof Element ? event.target : null;
  if (!hit || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

  const external = hit.closest('a[data-external]');
  if (external) {
    openExternal(event, external);
    return;
  }
  const route = hit.closest('[data-route]');
  if (route) {
    event.preventDefault();
    navigate(route.dataset.route, { focusSearch: route.hasAttribute('data-focus-search') });
    return;
  }
  const question = hit.closest('[data-faq]');
  if (question) {
    const preset = faq[Number(question.dataset.faq)];
    answerChat(preset.title, preset);
    return;
  }
  const action = hit.closest('[data-action]');
  if (!action) return;
  switch (action.dataset.action) {
    case 'menu': showDialog(menu); break;
    case 'support': showDialog(support); break;
    case 'close': closeDialog(); break;
    case 'back': goBack(); break;
    case 'install': openInstall(activeRoute.app); break;
    case 'video': {
      const video = install.querySelector('video');
      video.hidden = !video.hidden;
      action.setAttribute('aria-expanded', String(!video.hidden));
      if (video.hidden) video.pause();
      else {
        video.play().catch(() => {});
        video.scrollIntoView({ block: 'nearest', behavior: reduceMotion.matches ? 'instant' : 'smooth' });
      }
      break;
    }
  }
});

document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (dialog === install) dialog.querySelector('video')?.pause();
    updateNavigation();
  });
});

function restorePage() {
  if (location.hash === '#main') return;
  closeDialog();
  activeRoute = readRoute();
  render(false, history.state?.scroll ?? 0);
}

window.addEventListener('popstate', restorePage);
document.addEventListener('error', event => {
  if (event.target instanceof HTMLImageElement) {
    event.target.hidden = true;
    const fallback = event.target.previousElementSibling;
    if (fallback?.classList.contains('shot-fallback')) fallback.hidden = false;
  }
}, true);
window.visualViewport?.addEventListener('resize', updateInsets, { passive: true });
window.visualViewport?.addEventListener('scroll', updateInsets, { passive: true });
document.addEventListener('focusin', event => {
  editorHasFocus = event.target.matches?.('input:not([type="radio"]), textarea') ?? false;
  updateInsets();
});
document.addEventListener('focusout', () => requestAnimationFrame(() => {
  editorHasFocus = document.activeElement?.matches('input:not([type="radio"]), textarea') ?? false;
  updateInsets();
}));

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
function connectTelegram() {
  if (inTelegram) return;
  const client = window.Telegram?.WebApp;
  if (!client || (!client.initData && client.platform === 'unknown')) return;
  webApp = client;
  inTelegram = true;
  webApp.ready();
  webApp.expand();
  if (webApp.isVersionAtLeast('6.9')) {
    webApp.setHeaderColor('#f5f7fc');
    webApp.setBackgroundColor('#f5f7fc');
  }
  if (webApp.isVersionAtLeast('7.10')) webApp.setBottomBarColor('#f5f7fc');
  webApp.BackButton?.onClick(goBack);
  if (webApp.isVersionAtLeast('8.0')) {
    webApp.onEvent('safeAreaChanged', updateInsets);
    webApp.onEvent('contentSafeAreaChanged', updateInsets);
  }
  updateInsets();
  updateNavigation();
}

document.querySelector('#telegram-sdk').addEventListener('load', connectTelegram, { once: true });
render(false, 0, false);
connectTelegram();
