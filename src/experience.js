import staysSource from './stays.json';
const stays = staysSource.map(stay => ({ ...stay, title: window.SCH_I18N?.t(stay.title) || stay.title, label: window.SCH_I18N?.t(stay.label) || stay.label }));

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches || new URLSearchParams(location.search).get('motion') === 'reduce';
const top = document.querySelector('[data-top]');
let headerFrame = 0;
const compactHeader = () => { headerFrame = 0; top?.classList.toggle('is-compact', scrollY > 70 || !!document.querySelector('[data-mnav]:not([hidden])')); };
compactHeader();
addEventListener('scroll', () => { if (!headerFrame) headerFrame = requestAnimationFrame(compactHeader); }, { passive: true });
const menu = document.querySelector('[data-mnav]');
if (menu) new MutationObserver(compactHeader).observe(menu, { attributes: true, attributeFilter: ['hidden'] });
// Keep the page clear of the mobile bar even with enlarged text or custom spacing.
const appNav = document.querySelector('.app-nav');
if (appNav) new ResizeObserver(() => {
  const height = appNav.getBoundingClientRect().height;
  if (height) document.documentElement.style.setProperty('--app-nav-offset', `${Math.ceil(height)}px`);
}).observe(appNav);

// Keep the larger concierge launcher clear of actions and menu names/prices.
const conciergeLauncher = document.querySelector('.cg-tab');
const importantActions = [...document.querySelectorAll('.pill,.btn,.pc-postman-button,.pc-ticket-field,.foot__contact a,.stay-card__foot,.dish__body,.menu-category,.egg-trigger')];
const visibleActions = new Set();
let conciergePlacementFrame = 0;
function placeConciergeLauncher() {
  conciergePlacementFrame = 0;
  if (!conciergeLauncher || matchMedia('(max-width:760px)').matches) return;
  const box = conciergeLauncher.getBoundingClientRect();
  if (!box.width) return;
  const portrait = conciergeLauncher.querySelector('img')?.getBoundingClientRect();
  const extraTop = portrait ? Math.max(0, box.top - portrait.top) : 0;
  const obstacles = [...visibleActions].map(el => el.getBoundingClientRect()).filter(r => r.width && r.bottom > 0 && r.top < innerHeight && r.right > box.left && r.left < box.right);
  let bestBottom = 22, leastOverlap = Infinity;
  for (const bottom of [22, 138, 254]) {
    const top = innerHeight - bottom - box.height - extraTop;
    const overlap = obstacles.reduce((sum, r) => sum + Math.max(0, Math.min(r.bottom, top + box.height + extraTop) - Math.max(r.top, top)) * Math.max(0, Math.min(r.right, box.right) - Math.max(r.left, box.left)), 0);
    if (overlap < leastOverlap) { leastOverlap = overlap; bestBottom = bottom; }
  }
  conciergeLauncher.style.setProperty('--cg-launcher-bottom', `${bestBottom}px`);
}
function queueConciergePlacement() {
  if (!conciergePlacementFrame) conciergePlacementFrame = requestAnimationFrame(placeConciergeLauncher);
}
addEventListener('scroll', queueConciergePlacement, { passive: true });
addEventListener('resize', queueConciergePlacement, { passive: true });
addEventListener('load', queueConciergePlacement, { once: true });
document.addEventListener('toggle', queueConciergePlacement, true);
if ('IntersectionObserver' in window) {
  const actionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting ? visibleActions.add(entry.target) : visibleActions.delete(entry.target));
    queueConciergePlacement();
  }, { rootMargin: '120px' });
  importantActions.forEach(element => actionObserver.observe(element));
} else importantActions.forEach(element => visibleActions.add(element));
queueConciergePlacement();

const knownIds = new Set(stays.map(stay => stay.id));
let favorites = new Set();
try {
  const stored = JSON.parse(localStorage.getItem('sch.stay-favorites') || '[]');
  if (Array.isArray(stored)) favorites = new Set(stored.filter(id => knownIds.has(id)));
} catch { /* The carnet remains usable in memory if storage is unavailable. */ }
const filterButtons = [...document.querySelectorAll('[data-stay-filter]')];
const cards = [...document.querySelectorAll('[data-stay-card]')];
const rail = document.querySelector('[data-stay-rail]');
let currentFilter = 'all';
const prev = document.querySelector('[data-stay-prev]');
const next = document.querySelector('[data-stay-next]');

function updateRailControls() {
  if (!rail) return;
  if (prev) prev.disabled = rail.scrollLeft < 4;
  if (next) next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
}
function renderFavorites() {
  document.querySelectorAll('[data-save-stay]').forEach(button => {
    const saved = favorites.has(button.dataset.saveStay);
    const stay = stays.find(item => item.id === button.dataset.saveStay);
    button.setAttribute('aria-pressed', String(saved));
    button.setAttribute('aria-label', `${saved ? 'Retirer du carnet' : 'Garder l’idée'} : ${stay?.label || 'ce séjour'}`);
    const label = button.querySelector('span');
    if (label) label.textContent = saved ? 'Dans mon carnet' : 'Garder l’idée';
  });
  const savedFilter = document.querySelector('[data-stay-filter="saved"]');
  if (savedFilter) savedFilter.textContent = `Mon carnet${favorites.size ? ` (${favorites.size})` : ''}`;
}
function filterCards(resetScroll = false) {
  let count = 0;
  cards.forEach(card => {
    const visible = currentFilter === 'all' || (currentFilter === 'saved' ? favorites.has(card.dataset.stayId) : card.dataset.category === currentFilter);
    card.hidden = !visible;
    if (visible) count++;
  });
  const empty = document.querySelector('[data-stay-empty]');
  if (empty) empty.hidden = count !== 0;
  const counter = document.querySelector('[data-stay-count]');
  if (counter) counter.textContent = window.SCH_I18N?.plural(currentFilter === 'saved' ? 'stay.savedIdeas' : 'stay.ideas', count) || `${count} idée${count > 1 ? 's' : ''} ${currentFilter === 'saved' ? 'dans votre carnet' : 'à découvrir'}`;
  filterButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.stayFilter === currentFilter)));
  if (resetScroll && rail) rail.scrollTo({ left: 0, behavior: 'instant' });
  requestAnimationFrame(updateRailControls);
}
filterButtons.forEach(button => button.addEventListener('click', () => { currentFilter = button.dataset.stayFilter; filterCards(true); }));
let feedback, feedbackTimeout;
document.addEventListener('click', event => {
  const button = event.target.closest('[data-save-stay]');
  if (!button) return;
  const id = button.dataset.saveStay;
  if (!knownIds.has(id)) return;
  const saved = !favorites.has(id);
  if (saved) favorites.add(id); else favorites.delete(id);
  let persisted = true;
  try { localStorage.setItem('sch.stay-favorites', JSON.stringify([...favorites])); } catch { persisted = false; }
  renderFavorites(); filterCards();
  if (!feedback) { feedback = document.createElement('div'); feedback.className = 'stay-feedback'; feedback.setAttribute('role', 'status'); document.body.appendChild(feedback); }
  clearTimeout(feedbackTimeout);
  feedback.textContent = saved ? (persisted ? 'Idée gardée dans votre carnet, sur cet appareil.' : 'Idée gardée pour cette visite.') : 'Idée retirée de votre carnet.';
  feedback.classList.add('is-visible');
  feedbackTimeout = setTimeout(() => feedback.classList.remove('is-visible'), 3200);
});
if (rail) {
  const step = direction => rail.scrollBy({ left: direction * (rail.querySelector('[data-stay-card]:not([hidden])')?.getBoundingClientRect().width + 15 || rail.clientWidth * .88), behavior: reduced() ? 'auto' : 'smooth' });
  prev?.addEventListener('click', () => step(-1));
  next?.addEventListener('click', () => step(1));
  rail.addEventListener('scroll', updateRailControls, { passive: true });
  new ResizeObserver(updateRailControls).observe(rail);
}
renderFavorites(); filterCards();
addEventListener('pageshow', () => { compactHeader(); updateRailControls(); });

const selected = stays.find(stay => stay.id === new URLSearchParams(location.search).get('sejour'));
const context = document.querySelector('[data-booking-stay]');
if (selected && context) {
  context.hidden = false;
  context.querySelector('[data-booking-stay-title]').textContent = selected.title;
  context.querySelector('[data-booking-stay-link]').href = `sejours.html#${selected.id}`;
}
