/* Hotel Schützen Lauterbrunnen — interactions (navigation, réservation, concierge) */
(() => {
  'use strict';
  const D = window.SCH || { site: {}, rooms: [], faq: [], events: [] };
  // Runtime phrases use complete templates; the static build supplies translated catalogs.
  const RUNTIME_FR = {
    "guests.adults.one": "{count} adulte",
    "guests.adults.other": "{count} adultes",
    "guests.babies.one": "{count} bébé",
    "guests.babies.other": "{count} bébés",
    "guests.rooms.one": "{count} chambre",
    "guests.rooms.other": "{count} chambres",
    "guests.people.one": "{count} personne",
    "guests.people.other": "{count} personnes",
    "stay.nights.one": "{count} nuit",
    "stay.nights.other": "{count} nuits",
    "age.years.one": "{count} an",
    "age.years.other": "{count} ans",
    "availability.categories.one": "{count} catégorie encore libre à ces dates.",
    "availability.categories.other": "{count} catégories encore libres à ces dates.",
    "room.capacity": "La {room} accueille jusqu’à {capacity} par chambre.",
    "room.capacityAdvice": "Pour {guests}, choisissez une chambre plus grande ou ajoutez une chambre.",
    "room.capacityAdviceRooms": "Pour {guests} dans {rooms}, choisissez une chambre plus grande ou ajoutez une chambre.",
    "room.direct": "La {room} se réserve en direct auprès de la réception ; elle n’est pas proposée sur Booking.com.",
    "room.email": "par e-mail",
    "room.selected": "{room} sélectionnée",
    "availability.loading": "Vérification des disponibilités…",
    "availability.none": "Plus de chambre libre sur Booking.com du {arrival} au {departure}.",
    "availability.otherDates": "Essayez d’autres dates, ou demandez à la réception : il reste parfois une chambre en direct.",
    "availability.roomUnavailable": "La {room} n’est plus disponible du {arrival} au {departure}.",
    "availability.alternatives": "Encore libres à ces dates :",
    "availability.roomAvailable": "La {room} est disponible à ces dates.",
    "stay.dates": "{arrival} → {departure} · {nights}",
    "stay.arrival": "Arrivée {arrival} · choisissez le départ",
    "stay.chooseDates": "Choisissez vos dates",
    "stay.choose": "Choisir",
    "stay.allRooms": "Toutes les chambres",
    "stay.mobile": "{arrival} → {departure} · {guests}",
    "stay.empty": "Arrivée, départ, hôtes",
    "calendar.restart": "Cliquez sur une date pour choisir une nouvelle arrivée.",
    "calendar.complete": "Dates choisies. Un nouveau clic recommence par l’arrivée.",
    "calendar.chooseDeparture": "Choisissez maintenant votre date de départ.",
    "calendar.chooseArrival": "Choisissez d’abord votre date d’arrivée.",
    "calendar.limit": "Au-delà de 30 nuits, contactez la réception.",
    "calendar.previous": "Mois précédent",
    "calendar.next": "Mois suivant",
    "calendar.arrival": "Arrivée",
    "calendar.departure": "Départ",
    "calendar.clear": "Effacer les dates",
    "baby.ageLabel": "Âge du bébé {number} au début du séjour",
    "baby.chooseAge": "Choisir l’âge",
    "baby.underOne": "Moins de 1 an",
    "mail.unspecified": "à préciser",
    "mail.adviseRoom": "à conseiller",
    "mail.undefinedDate": "à définir",
    "mail.bookingSubject": "Demande de réservation",
    "mail.bookingBody": "Bonjour,\n\nJe souhaite réserver à l’Hotel Schützen Lauterbrunnen :\nArrivée : {arrival}\nDépart : {departure}\nHôtes : {guests}\nChambre souhaitée : {room}\n\nMerci et à bientôt,\n",
    "mail.groupBody": "Demande d’événement · Hotel Schützen Lauterbrunnen\nType : {type}\nPersonnes : {count}\nDate : {date}\nChambres : {rooms}\nContact : {name} · {email}\nProjet : {project}",
    "mail.groupSubject": "Demande d’événement · {type}",
    "group.summary": "{type}, {people}",
    "guide.savedDates": "Vos dates sont déjà notées : {arrival} → {departure}. {guests}. Vous pourrez les modifier sur la page de réservation."
  };
  const i18n = window.SCH_I18N || {};
  const locale = i18n.locale || document.documentElement.lang || 'fr-CH';
  const language = locale.toLowerCase().split('-')[0];
  const bookingLang = i18n.bookingLang || (language === 'zh' ? 'zh-cn' : language);
  const googleLang = language === 'zh' ? 'zh-CN' : language;
  const number = (value) => new Intl.NumberFormat(locale).format(value);
  const interpolate = (text, values) => String(text).replace(/\{(\w+)\}/g, (match, key) => Object.hasOwn(values, key) ? String(values[key]) : match);
  const message = (key, values = {}) => {
    const translated = i18n.format?.(key, values);
    return translated && translated !== key ? translated : interpolate(RUNTIME_FR[key] || key, values);
  };
  const plural = (key, count) => {
    const translated = i18n.plural?.(key, count);
    if (translated && translated !== key) return translated;
    const category = new Intl.PluralRules(locale).select(count);
    const variant = RUNTIME_FR[`${key}.${category}`] ? category : 'other';
    return message(`${key}.${variant}`, { count: number(count) });
  };
  const html = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || new URLSearchParams(location.search).get('motion') === 'reduce';
  document.documentElement.dataset.reduced = String(reduce);
  const buzz = () => { try { navigator.vibrate && navigator.vibrate(8); } catch (e) {} };
  const store = {
    get(k, d) { try { const v = localStorage.getItem('sch.' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('sch.' + k, JSON.stringify(v)); } catch (e) {} },
  };
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const parse = (s) => {
    if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
    const [y, m, d] = s.split('-').map(Number), date = new Date(y, m - 1, d);
    return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d ? date : null;
  };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const today = () => { const t = new Date(); t.setHours(0, 0, 0, 0); return t; };
  const nightsOf = (a, b) => (a && b ? Math.round((parse(b) - parse(a)) / 864e5) : 0);
  const fmt = (s, o = { weekday: 'short', day: 'numeric', month: 'short' }) => (s ? new Intl.DateTimeFormat(locale, o).format(parse(s)) : '—');
  const chf = (n) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'CHF', maximumFractionDigits: 0 }).format(n);
  const roomById = (id) => D.rooms.find((r) => r.id === id);
  let cgOpen = false;

  /* ---------- native scrolling and accessible modal surfaces ---------- */
  let scrollStyle = null, modalEl = null, inertRecords = [];
  const lockScroll = (on) => {
    if (on && !scrollStyle) {
      const html = document.documentElement, body = document.body;
      scrollStyle = { overflow: html.style.overflow, padding: body.style.paddingRight };
      const gap = innerWidth - html.clientWidth;
      if (gap > 0) body.style.paddingRight = `${(parseFloat(getComputedStyle(body).paddingRight) || 0) + gap}px`;
      html.style.overflow = 'hidden';
    } else if (!on && scrollStyle) {
      document.documentElement.style.overflow = scrollStyle.overflow;
      document.body.style.paddingRight = scrollStyle.padding;
      scrollStyle = null;
    }
  };
  const smoothTo = (target, offset = 0) => {
    const top = typeof target === 'number' ? target + offset : target.getBoundingClientRect().top + scrollY + offset;
    scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' });
  };
  const focusable = (el) => $$('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])', el)
    .filter((node) => !node.closest('[hidden],[inert]') && node.getClientRects().length);
  const releaseModal = (el) => {
    if (el && modalEl !== el) return;
    inertRecords.forEach(([node, old]) => { node.inert = old; });
    inertRecords = []; modalEl = null;
  };
  const activateModal = (el, extras = []) => {
    releaseModal(); modalEl = el;
    const keep = [el, ...extras, $('[data-scrim]'), $('[data-toast]')].filter(Boolean);
    const branch = (node) => {
      if (keep.includes(node) || /^(SCRIPT|STYLE|LINK)$/.test(node.tagName)) return;
      if (keep.some((item) => node.contains(item))) { Array.from(node.children).forEach(branch); return; }
      inertRecords.push([node, node.inert]); node.inert = true;
    };
    Array.from(document.body.children).forEach(branch);
  };
  const restoreFocus = (node, fallback) => {
    const target = node && node.isConnected && !node.closest('[hidden],[inert]') && node.getClientRects().length ? node : fallback;
    target && target.focus({ preventScroll: true });
  };
  // Previous visits may contain the retired waterfall transition marker.
  document.documentElement.classList.remove('veil-in', 'veil-out');
  try { sessionStorage.removeItem('sch.veil'); } catch (e) {}

  /* ---------- toast & copy ---------- */
  const toastEl = $('[data-toast]');
  let toastT;
  const toast = (msg) => { if (!toastEl) return; toastEl.textContent = msg; toastEl.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('is-on'), 2600); };
  const copy = (txt, label) => {
    const done = () => toast(label || 'Copié dans le presse-papiers');
    try { navigator.clipboard.writeText(txt).then(done, () => fallbackCopy(txt, done)); } catch (e) { fallbackCopy(txt, done); }
  };
  function fallbackCopy(txt, done) {
    const ta = document.createElement('textarea'); ta.value = txt; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (e) { toast('Sélectionnez le texte pour le copier'); } ta.remove();
  }
  document.addEventListener('click', (e) => { const b = e.target.closest('[data-copy]'); if (b) { e.preventDefault(); copy(b.dataset.copy); } });

  /* ---------- booking state (remembered on this device) ---------- */
  const B = Object.assign({ in: '', out: '', adults: 2, kids: 0, ages: [], rooms: 1, room: '' }, store.get('booking', {}));
  if (!parse(B.in) || parse(B.in) < today()) { B.in = ''; B.out = ''; }
  if (!parse(B.out) || !B.in || parse(B.out) <= parse(B.in) || nightsOf(B.in, B.out) > 30) B.out = '';
  if (!roomById(B.room)) B.room = '';
  B.kids = Math.min(4, Math.max(0, Math.floor(+B.kids || 0))); B.rooms = Math.min(6, Math.max(1, Math.floor(+B.rooms || 1))); B.adults = Math.min(12, Math.max(1, Math.floor(+B.adults || 2)));
  const normalizeAges = () => { const old = Array.isArray(B.ages) ? B.ages : []; B.ages = Array.from({ length: B.kids }, (_, i) => Number.isInteger(old[i]) && old[i] >= 0 && old[i] <= 3 ? old[i] : null); };
  normalizeAges();
  const saveB = () => { normalizeAges(); store.set('booking', { in: B.in, out: B.out, adults: B.adults, kids: B.kids, ages: B.ages, rooms: B.rooms, room: B.room }); checkAvail(); syncLabels(); };
  const hasDates = () => !!(B.in && B.out);
  const hasAges = () => B.ages.length === B.kids && B.ages.every((age) => Number.isInteger(age));
  const guestsLabel = () => [plural('guests.adults', B.adults), B.kids ? plural('guests.babies', B.kids) : '', B.rooms > 1 ? plural('guests.rooms', B.rooms) : ''].filter(Boolean).join(' · ');
  const LAT = 46.5948196, LNG = 7.9070895;
  // Booking.com opens on the hotel page, at the guest's dates, scrolled to the chosen room type (#RD<id>);
  // without a room, or when the room is known to be taken, on the table of free rooms
  const bkOf = (r) => (r && r.bk ? r.bk : '');
  function bookingURL(roomId) {
    const u = new URL(D.site.booking), r = roomById(roomId === undefined ? B.room : roomId);
    if (hasDates()) { u.searchParams.set('checkin', B.in); u.searchParams.set('checkout', B.out); }
    u.searchParams.set('group_adults', B.adults); u.searchParams.set('group_children', B.kids);
    B.ages.forEach((age) => { if (Number.isInteger(age)) u.searchParams.append('age', String(age)); });
    u.searchParams.set('no_rooms', B.rooms); u.searchParams.set('selected_currency', 'CHF'); u.searchParams.set('lang', bookingLang);
    const bk = bkOf(r), taken = bk && AV.state === 'ok' && !AV.ids.includes(bk);
    u.hash = bk && !taken ? 'RD' + bk : 'availability_target';
    return u.toString();
  }
  // Google Maps hotel card: dates, length of stay and guests → every booking site with its price
  function googleURL() {
    const n = nightsOf(B.in, B.out), cid = D.site.gplace, geo = `!8m2!3d${LAT}!4d${LNG}`;
    const data = hasDates() && n > 0 ? `!4m10!3m9!1s${cid}!5m4!1s${B.in}!2i${n}!4m1!1i${B.adults}${geo}` : `!4m5!3m4!1s${cid}${geo}`;
    return `https://www.google.com/maps/place/Hotel+Restaurant+Sch%C3%BCtzen/data=${data}?hl=${encodeURIComponent(googleLang)}`;
  }
  function directMail() {
    const r = roomById(B.room);
    const body = message('mail.bookingBody', {
      arrival: B.in ? fmt(B.in, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : message('mail.unspecified'),
      departure: B.out ? fmt(B.out, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : message('mail.unspecified'),
      guests: guestsLabel(), room: r ? r.name : message('mail.adviseRoom'),
    });
    return `mailto:${D.site.email}?subject=${encodeURIComponent(message('mail.bookingSubject') + (B.in ? ' · ' + fmt(B.in, { day: 'numeric', month: 'short' }) : ''))}&body=${encodeURIComponent(body)}`;
  }
  /* ---------- room choice: capacity check, live availability (when an endpoint is configured) ---------- */
  const AV = { key: '', ids: [], state: 'idle' };
  let avT = 0;
  const stayKey = () => [B.in, B.out, B.adults, B.rooms].join('|');
  function checkAvail() {
    const ep = D.site.availability;
    if (!ep || !hasDates()) { AV.key = ''; AV.state = 'idle'; AV.ids = []; return; }
    const key = stayKey(); if (AV.key === key && AV.state !== 'error') return;
    AV.key = key; AV.state = 'loading'; AV.ids = [];
    clearTimeout(avT);
    avT = setTimeout(async () => {
      try {
        const u = new URL(ep, location.href); u.searchParams.set('checkin', B.in); u.searchParams.set('checkout', B.out); u.searchParams.set('adults', B.adults); u.searchParams.set('rooms', B.rooms);
        const r = await fetch(u, { headers: { accept: 'application/json' } }); if (!r.ok) throw new Error(r.status);
        const j = await r.json(); if (AV.key !== key) return;
        AV.ids = (j.available || []).map(String); AV.state = 'ok';
      } catch (e) { if (AV.key === key) AV.state = 'error'; }
      syncLabels();
    }, 250);
  }
  const perRoom = () => Math.ceil(B.adults / B.rooms);
  const shortD = (s) => fmt(s, { day: 'numeric', month: 'short' });
  const pickBtn = (r) => `<button type="button" class="ralert__pick" data-pick-room="${r.id}"><b>${html(r.name)}</b><small>${html(r.size)} · ${html(r.guests)}</small></button>`;
  function alertHTML() {
    const r = roomById(B.room), n = perRoom();
    if (r && n > r.cap) {
      const alt = D.rooms.filter((x) => x.cap >= n && x.id !== r.id).sort((a, b) => a.cap - b.cap).slice(0, 3);
      const capacity = message('room.capacity', { room: r.name, capacity: plural('guests.adults', r.cap) });
      const advice = message(B.rooms > 1 ? 'room.capacityAdviceRooms' : 'room.capacityAdvice', { guests: plural('guests.adults', B.adults), rooms: plural('guests.rooms', B.rooms) });
      return `<p class="ralert__warn"><b>${html(capacity)}</b> ${html(advice)}</p><div class="ralert__list">${alt.map(pickBtn).join('')}</div>`;
    }
    if (r && !r.bk) return `<p><b>${html(message('room.direct', { room: r.name }))}</b></p><p><a href="tel:${D.site.phone.replace(/\s/g, '')}">${html(D.site.phone)}</a> · <a href="${directMail()}">${html(message('room.email'))}</a></p>`;
    if (!hasDates() || AV.state === 'idle' || AV.state === 'error') return '';
    if (AV.state === 'loading') return `<p class="ralert__wait">${html(message('availability.loading'))}</p>`;
    const free = D.rooms.filter((x) => x.bk && AV.ids.includes(x.bk) && x.cap >= n);
    const dates = { arrival: shortD(B.in), departure: shortD(B.out) };
    if (!free.length) return `<p class="ralert__warn"><b>${html(message('availability.none', dates))}</b> ${html(message('availability.otherDates'))}</p><p><a href="tel:${D.site.phone.replace(/\s/g, '')}">${html(D.site.phone)}</a></p>`;
    if (r && !AV.ids.includes(r.bk)) return `<p class="ralert__warn"><b>${html(message('availability.roomUnavailable', { ...dates, room: r.name }))}</b> ${html(message('availability.alternatives'))}</p><div class="ralert__list">${free.map(pickBtn).join('')}</div>`;
    if (r) return `<p class="ralert__ok">${'\u2713'} ${html(message('availability.roomAvailable', { room: r.name }))}</p>`;
    return `<p class="ralert__ok">${html(plural('availability.categories', free.length))}</p>`;
  }
  function renderAlert() {
    const html = alertHTML(), r = roomById(B.room);
    $$('[data-room-alert]').forEach((el) => {
      el.innerHTML = html; el.hidden = !html;
      el.classList.toggle('is-warn', /ralert__warn/.test(html));
      el.classList.toggle('is-ok', /ralert__ok/.test(html));
    });
    $$('[data-sum-line]').forEach((e) => (e.textContent = guestsLabel() + (r ? ` · ${r.name}` : '')));
  }
  document.addEventListener('change', (e) => { const sel = e.target.closest('[data-room-select]'); if (sel) { B.room = sel.value; saveB(); } });

  function syncLabels() {
    const n = nightsOf(B.in, B.out), r = roomById(B.room);
    $$('[data-bb-in]').forEach((e) => (e.textContent = B.in ? fmt(B.in) : message('stay.choose')));
    $$('[data-bb-out]').forEach((e) => (e.textContent = B.out ? fmt(B.out) : message('stay.choose')));
    $$('[data-bb-guests],[data-sum-guests]').forEach((e) => (e.textContent = guestsLabel()));
    $$('[data-sum-dates]').forEach((e) => (e.textContent = hasDates() ? message('stay.dates', { arrival: fmt(B.in, { day: 'numeric', month: 'short' }), departure: fmt(B.out, { day: 'numeric', month: 'short' }), nights: plural('stay.nights', n) }) : B.in ? message('stay.arrival', { arrival: fmt(B.in) }) : message('stay.chooseDates')));
    $$('[data-sum-in]').forEach((e) => (e.textContent = B.in ? fmt(B.in, { weekday: 'long', day: 'numeric', month: 'long' }) : '—'));
    $$('[data-sum-out]').forEach((e) => (e.textContent = B.out ? fmt(B.out, { weekday: 'long', day: 'numeric', month: 'long' }) : '—'));
    $$('[data-sum-n]').forEach((e) => (e.textContent = n ? plural('stay.nights', n) : '—'));
    $$('[data-sum-room]').forEach((e) => (e.textContent = r ? r.name : message('stay.allRooms')));
    $$('[data-room-select]').forEach((e) => (e.value = B.room || ''));
    $$('[data-bb-mobile]').forEach((e) => (e.textContent = hasDates() ? message('stay.mobile', { arrival: fmt(B.in, { day: 'numeric', month: 'short' }), departure: fmt(B.out, { day: 'numeric', month: 'short' }), guests: guestsLabel() }) : message('stay.empty')));
    $$('[data-go="booking"]').forEach((a) => (a.href = bookingURL()));
    $$('[data-go="google"]').forEach((a) => (a.href = googleURL()));
    $$('[data-go="direct"]').forEach((a) => (a.href = directMail()));
    $$('[data-go="booking"],[data-go="google"]').forEach((a) => a.classList.toggle('is-wait', !hasDates()));
    renderAlert();
  }

  /* ---------- calendar ---------- */
  const cals = [];
  // Both calendars share the same selection phase. A rejected second click also
  // completes the attempt, so the next date starts a fresh stay.
  let restartDates = false, dateLimitReached = false;
  function Calendar(el, onChange) {
    if (!el) return null;
    let view = B.in ? parse(B.in) : today(); view = new Date(view.getFullYear(), view.getMonth(), 1);
    const dows = Array.from({ length: 7 }, (_, day) => new Intl.DateTimeFormat(locale, { weekday: language === 'zh' ? 'narrow' : 'short' }).format(new Date(2024, 0, 1 + day))); // Monday first, in every language.
    function month(base) {
      const y = base.getFullYear(), m = base.getMonth(); const first = new Date(y, m, 1); const offset = (first.getDay() + 6) % 7; const days = new Date(y, m + 1, 0).getDate();
      const t = today(), a = parse(B.in), b = parse(B.out);
      let cells = dows.map((w) => `<span class="dow">${w}</span>`).join('') + '<span></span>'.repeat(offset);
      for (let i = 1; i <= days; i++) {
        const d = new Date(y, m, i), s = iso(d); const cls = [];
        if (a && s === B.in) cls.push('start'); if (b && s === B.out) cls.push('end'); if (a && b && d > a && d < b) cls.push('in'); if (+d === +t) cls.push('today');
        cells += `<button type="button" data-day="${s}" class="${cls.join(' ')}" ${d < t ? 'disabled' : ''} aria-label="${fmt(s, { weekday: 'long', day: 'numeric', month: 'long' })}"${cls.includes('start') || cls.includes('end') ? ' aria-pressed="true"' : ''}>${number(i)}</button>`;
      }
      return `<div><div class="cal__head"><b>${new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(first)}</b></div><div class="cal__grid">${cells}</div></div>`;
    }
    function render() {
      const active = el.contains(document.activeElement) ? document.activeElement : null;
      const focusKey = active && (active.dataset.day ? `[data-day="${active.dataset.day}"]` : active.hasAttribute('data-cal-next') ? '[data-cal-next]' : active.hasAttribute('data-cal-prev') ? '[data-cal-prev]' : active.hasAttribute('data-cal-clear') ? '[data-cal-clear]' : null);
      const next = new Date(view.getFullYear(), view.getMonth() + 1, 1);
      const canPrev = view > new Date(today().getFullYear(), today().getMonth(), 1);
      const hint = message(dateLimitReached ? 'calendar.restart' : hasDates() ? 'calendar.complete' : B.in ? 'calendar.chooseDeparture' : 'calendar.chooseArrival');
      const longStay = dateLimitReached ? `<p class="cal__error"><a href="tel:${D.site.phone.replace(/\s/g, '')}">${html(message('calendar.limit'))}</a></p>` : '';
      el.innerHTML = `<div class="cal-wrap" style="grid-column:1/-1"><div class="cal-top"><button type="button" class="cal-nav" data-cal-prev ${canPrev ? '' : 'disabled'} aria-label="${html(message('calendar.previous'))}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 6l-6 6 6 6"/></svg></button>
      <div class="sum-dates"><div><small>${html(message('calendar.arrival'))}</small><b>${B.in ? fmt(B.in) : '—'}</b></div><div><small>${html(message('calendar.departure'))}</small><b>${B.out ? fmt(B.out) : '—'}</b></div></div>
      <button type="button" class="cal-nav" data-cal-next aria-label="${html(message('calendar.next'))}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 6l6 6-6 6"/></svg></button></div><div class="cal-controls"><div class="cal-feedback" role="status" aria-live="polite">${longStay}<p class="cal__hint">${html(hint)}</p></div><button type="button" class="cal-clear" data-cal-clear ${B.in || B.out ? '' : 'disabled'}>${html(message('calendar.clear'))}</button></div></div>${month(view)}${month(next)}`;
      if (focusKey) {
        const same = $(focusKey, el), fallback = $('[data-day]:not([disabled])', el);
        (same && !same.disabled ? same : fallback)?.focus({ preventScroll: true });
      }
    }
    el.addEventListener('click', (e) => {
      if (e.target.closest('[data-cal-prev]')) { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); render(); return; }
      if (e.target.closest('[data-cal-next]')) { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); render(); return; }
      if (e.target.closest('[data-cal-clear]')) {
        B.in = ''; B.out = ''; restartDates = false; dateLimitReached = false;
        saveB(); cals.forEach((c) => c.render()); onChange && onChange();
        return;
      }
      const b = e.target.closest('[data-day]'); if (!b || b.disabled) return;
      const s = b.dataset.day; buzz();
      if (!B.in || B.out || restartDates || parse(s) <= parse(B.in)) { B.in = s; B.out = ''; }
      else {
        if (nightsOf(B.in, s) > 30) {
          restartDates = true; dateLimitReached = true;
          cals.forEach((c) => c.render());
          return;
        }
        B.out = s;
      }
      restartDates = false; dateLimitReached = false;
      saveB(); cals.forEach((c) => c.render()); onChange && onChange();
    });
    render();
    const api = { render }; cals.push(api); return api;
  }

  /* ---------- steppers ---------- */
  const LIM = { adults: [1, 12], kids: [0, 4], rooms: [1, 6] };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-step]'); if (!b) return;
    const k = b.dataset.step, d = +b.dataset.d, lim = LIM[k];
    if (!lim || ![-1, 1].includes(d)) return;
    B[k] = Math.max(lim[0], Math.min(lim[1], B[k] + d)); buzz(); saveB(); renderSteppers();
  });
  function renderSteppers() {
    Object.keys(LIM).forEach((k) => {
      $$(`[data-out="${k}"]`).forEach((o) => (o.textContent = number(B[k])));
      $$(`[data-step="${k}"][data-d="-1"]`).forEach((x) => (x.disabled = B[k] <= LIM[k][0]));
      $$(`[data-step="${k}"][data-d="1"]`).forEach((x) => (x.disabled = B[k] >= LIM[k][1]));
    });
    $$('[data-step="kids"][data-d="1"]').forEach((button, n) => {
      const stepper = button.closest('.stepper'); if (!stepper) return;
      let ages = stepper.nextElementSibling;
      if (!ages?.hasAttribute('data-child-ages')) { ages = document.createElement('div'); ages.setAttribute('data-child-ages', ''); ages.className = 'child-ages'; stepper.after(ages); }
      const active = ages.contains(document.activeElement) ? document.activeElement.dataset.childAge : null;
      ages.hidden = B.kids === 0;
      ages.innerHTML = B.ages.map((age, i) => `<div class="field"><label for="baby-age-${n}-${i}">${html(message('baby.ageLabel', { number: number(i + 1) }))}</label><select class="select" id="baby-age-${n}-${i}" data-child-age="${i}" required><option value="">${html(message('baby.chooseAge'))}</option>${[0, 1, 2, 3].map((a) => `<option value="${a}"${age === a ? ' selected' : ''}>${html(a === 0 ? message('baby.underOne') : plural('age.years', a))}</option>`).join('')}</select></div>`).join('');
      if (active !== null) $(`[data-child-age="${active}"]`, ages)?.focus({ preventScroll: true });
    });
  }
  document.addEventListener('change', (e) => {
    const select = e.target.closest('[data-child-age]'); if (!select) return;
    B.ages[Number(select.dataset.childAge)] = select.value === '' ? null : Number(select.value);
    saveB(); renderSteppers();
  });

  /* ---------- scrim, sheets ---------- */
  const scrim = $('[data-scrim]');
  let openSheetEl = null, lastFocus = null;
  function openPanel(el) {
    if (!el) return;
    if (cgOpen) closeCg(true);
    if (menuOpen) closeMnav(true);
    lastFocus = document.activeElement; el.hidden = false; if (scrim) scrim.hidden = false;
    requestAnimationFrame(() => { el.dataset.open = 'true'; if (scrim) scrim.dataset.open = 'true'; });
    openSheetEl = el; activateModal(el); lockScroll(true);
    const f = el.querySelector('[data-day]:not([disabled]), button, [href], input'); setTimeout(() => { if (openSheetEl === el) f?.focus({ preventScroll: true }); }, reduce ? 0 : 60);
  }
  function closePanel(el) {
    el = el || openSheetEl; if (!el) return; el.dataset.open = 'false'; if (scrim) scrim.dataset.open = 'false';
    setTimeout(() => { if (el.dataset.open !== 'true') el.hidden = true; if (scrim && !cgOpen && !openSheetEl) scrim.hidden = true; }, reduce ? 0 : 420);
    openSheetEl = null; releaseModal(el); lockScroll(false);
    restoreFocus(lastFocus, $('[data-sheet-open]'));
  }
  const bookSheet = $('[data-sheet="book"]');
  let sheetCal = null;
  /* pick a room from its card, or from the alternatives (runs before the sheet opens) */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-pick-room]'); if (!a) return;
    B.room = a.dataset.pickRoom; saveB(); cals.forEach((c) => c.render());
    if (a.classList.contains('ralert__pick') && roomById(B.room)) { buzz(); toast(message('room.selected', { room: roomById(B.room).name })); }
  }, true);
  document.addEventListener('click', (e) => {
    const o = e.target.closest('[data-sheet-open]');
    if (o) { if (!bookSheet) return; e.preventDefault(); if (!sheetCal) sheetCal = Calendar($('[data-cal]', bookSheet)); else sheetCal.render(); renderSteppers(); openPanel(bookSheet); return; }
    if (e.target.closest('[data-sheet-close]')) { closePanel(); return; }
    if (e.target === scrim) { if (openSheetEl) closePanel(); if (cgOpen) closeCg(); }
    // Booking.com / Google: only once dates are chosen (they open with those dates)
    const go = e.target.closest('[data-go="booking"],[data-go="google"]');
    if (go) {
      if (!hasDates()) {
        e.preventDefault(); toast(B.in ? 'Choisissez votre date de départ' : 'Choisissez d’abord vos dates');
        if (bookSheet && !openSheetEl && !go.closest('[data-picker]')) { if (!sheetCal) sheetCal = Calendar($('[data-cal]', bookSheet)); else sheetCal.render(); renderSteppers(); openPanel(bookSheet); }
        return;
      }
      if (!hasAges()) {
        e.preventDefault(); toast('Précisez l’âge de chaque bébé au début du séjour.');
        let region = go.closest('[data-picker],[data-sheet]');
        if (!region && bookSheet) { if (!sheetCal) sheetCal = Calendar($('[data-cal]', bookSheet)); renderSteppers(); openPanel(bookSheet); region = bookSheet; }
        const missing = $$('[data-child-age]', region || document).find((select) => select.value === '');
        setTimeout(() => missing?.focus({ preventScroll: false }), reduce ? 0 : 80);
        return;
      }
      go.href = go.dataset.go === 'booking' ? bookingURL() : googleURL();
    }
  });
  /* ---------- header menu (tablet & mobile): pages of the site, contact, booking ---------- */
  const mnav = $('[data-mnav]'), mBtn = $('[data-mnav-toggle]');
  let menuOpen = false;
  function openMnav() {
    if (!mnav || !mBtn) return; if (cgOpen) closeCg(true); menuOpen = true; mnav.hidden = false; mBtn.setAttribute('aria-expanded', 'true'); mBtn.setAttribute('aria-label', 'Fermer le menu');
    document.documentElement.classList.add('mnav-open'); activateModal(mnav, [mBtn]); lockScroll(true); refreshTop();
    requestAnimationFrame(() => requestAnimationFrame(() => (mnav.dataset.open = 'true')));
    setTimeout(() => { if (menuOpen) $('a', mnav)?.focus({ preventScroll: true }); }, reduce ? 0 : 60);
  }
  function closeMnav(silent) {
    if (!mnav || !menuOpen) return; menuOpen = false; mnav.dataset.open = 'false'; mBtn.setAttribute('aria-expanded', 'false'); mBtn.removeAttribute('aria-label');
    document.documentElement.classList.remove('mnav-open'); releaseModal(mnav); lockScroll(false); refreshTop();
    setTimeout(() => { if (!menuOpen) mnav.hidden = true; }, reduce ? 0 : 220);
    if (!silent) mBtn.focus({ preventScroll: true });
  }
  if (mnav && mBtn) {
    mBtn.addEventListener('click', () => { buzz(); menuOpen ? closeMnav() : openMnav(); });
    mnav.addEventListener('click', (e) => { if (e.target.closest('[data-sheet-open]')) closeMnav(true); });
    matchMedia('(min-width:1101px)').addEventListener('change', (m) => { if (m.matches) closeMnav(true); });
  }

  /* ---------- optional bottom navigation (no animated page curtain) ---------- */
  const dockEl = $('[data-dock]');
  if (dockEl) dockEl.addEventListener('click', (e) => {
    const a = e.target.closest('.dock__it');
    if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.getAttribute('aria-current') === 'page' || a.dataset.dockTarget === 'top') { e.preventDefault(); smoothTo(0); }
  });

  /* ---------- lightbox (a room's photos, or the gallery) ---------- */
  const lb = $('[data-lightbox]'), lbImg = $('[data-lb-img]'), lbCap = $('[data-lb-cap]');
  let lbList = [], lbI = 0, lbCapT = '', lbFocus = null;
  const lbShow = () => { lbImg.src = `img/${lbList[lbI]}.webp`; lbImg.alt = lbCapT; lbCap.textContent = `${lbCapT} · ${number(lbI + 1)} / ${number(lbList.length)}`; };
  const lbStep = (d) => { lbI = (lbI + d + lbList.length) % lbList.length; lbShow(); };
  function closeLb() { if (!lb || lb.hidden) return; lb.hidden = true; releaseModal(lb); lockScroll(false); restoreFocus(lbFocus); }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-lb]');
    if (b && lb) { lbList = (b.dataset.lbSet || b.dataset.lb).split(',').filter(Boolean); if (!lbList.length) return; lbI = Math.max(0, lbList.indexOf(b.dataset.lb)); lbCapT = b.dataset.lbCap || ''; lbFocus = b; lbShow(); lb.hidden = false; activateModal(lb); lockScroll(true); $('[data-lb-close]', lb)?.focus(); return; }
    if (e.target.closest('[data-lb-close]') || e.target === lb) closeLb();
    if (e.target.closest('[data-lb-prev]')) lbStep(-1);
    if (e.target.closest('[data-lb-next]')) lbStep(1);
  });
  document.addEventListener('keydown', (e) => { if (!lb || lb.hidden) return; if (e.key === 'ArrowLeft') { e.preventDefault(); lbStep(-1); } if (e.key === 'ArrowRight') { e.preventDefault(); lbStep(1); } });
  let tx = 0; lb?.addEventListener('touchstart', (e) => (tx = e.touches[0].clientX), { passive: true });
  lb?.addEventListener('touchend', (e) => { const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) lbStep(dx < 0 ? 1 : -1); });
  if (lbCap) { lbCap.setAttribute('aria-live', 'polite'); lbCap.setAttribute('aria-atomic', 'true'); }

  /* ---------- room galleries: thumbnails under the photo, nothing on top of it ---------- */
  $$('[data-gal]').forEach((g) => {
    const main = $('.rgal__main', g), im = $('img', main), n = $('[data-gal-n]', g), ths = $$('[data-gal-i]', g);
    g.addEventListener('click', (e) => {
      const t = e.target.closest('[data-gal-i]'); if (!t || t.getAttribute('aria-pressed') === 'true') return;
      const name = t.dataset.src, k = +t.dataset.galI; buzz();
      ths.forEach((x) => x.setAttribute('aria-pressed', String(x === t)));
      main.dataset.lb = name; if (n) n.textContent = k + 1;
      const set = () => { im.srcset = `/img/${name}-m.webp 960w, /img/${name}.webp 1920w`; im.src = `/img/${name}.webp`; };
      if (reduce) { set(); return; }
      main.classList.add('is-swap'); const pre = new Image(); pre.onload = pre.onerror = () => { set(); requestAnimationFrame(() => main.classList.remove('is-swap')); };
      pre.src = innerWidth < 960 ? `img/${name}-m.webp` : `img/${name}.webp`;
    });
  });

  /* ---------- anchor bar on inner pages ---------- */
  const topEl = $('[data-top]');
  const anchorBar = $('[data-anchors]') ? AnchorBar($('[data-anchors]')) : null;
  function AnchorBar(bar) {
    const links = $$('[data-anchor]', bar), targets = links.map((a) => document.getElementById(a.dataset.anchor));
    const pill = $('.anchors__pill', bar), wrap = $('.anchors__wrap', bar), list = $('.anchors__list', bar), cur = $('[data-anchor-cur]', bar), toggle = $('.anchors__toggle', bar), prog = $('.anchors__progress i', bar);
    let active = -1, lock = 0;
    const H = () => bar.offsetHeight, T = () => (topEl ? topEl.offsetHeight : 0);
    function place() {
      if (bar.classList.contains('is-compact') || active < 0) { pill.style.opacity = '0'; return; }
      const a = links[active], x = a.getBoundingClientRect().left - wrap.getBoundingClientRect().left; pill.style.opacity = '1'; pill.style.width = a.offsetWidth + 'px'; pill.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
    }
    function fit() {
      bar.classList.remove('is-compact'); bar.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false');
      const tight = innerWidth < 900 || list.scrollWidth > wrap.clientWidth + 1;
      bar.classList.toggle('is-compact', tight); place();
    }
    function set(i) {
      if (i === active) return; active = i;
      links.forEach((a, k) => (k === i ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current')));
      cur.textContent = links[Math.max(0, i)].textContent; place();
    }
    function close() { bar.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }
    toggle.addEventListener('click', () => { const o = !bar.classList.contains('is-open'); bar.classList.toggle('is-open', o); toggle.setAttribute('aria-expanded', String(o)); buzz(); });
    document.addEventListener('click', (e) => { if (!bar.contains(e.target)) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    bar.addEventListener('click', (e) => {
      const top = e.target.closest('[data-anchor-top]'); if (top) { e.preventDefault(); smoothTo(0); close(); return; }
      const a = e.target.closest('[data-anchor]'); if (!a) return;
      const i = links.indexOf(a), t = targets[i]; if (!t) return; e.preventDefault(); buzz(); close();
      lock = performance.now() + 1500; set(i); smoothTo(t, -(H() + T()) + 1);
      try { history.replaceState(null, '', '#' + a.dataset.anchor); } catch (err) {}
    });
    function spy() {
      const off = H() + T() + innerHeight * 0.3; let i = -1;
      targets.forEach((t, k) => { if (t && t.getBoundingClientRect().top <= off) i = k; });
      const max = document.documentElement.scrollHeight - innerHeight; prog.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max).toFixed(4) : 0})`;
      bar.classList.toggle('is-stuck', bar.getBoundingClientRect().top <= T() + 0.5);
      if (performance.now() < lock) return; set(i);
    }
    fit(); addEventListener('resize', fit); if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    return { spy };
  }

  /* ---------- reservation & room pages: inline date picker ---------- */
  $$('[data-picker]').forEach((pk) => {
    Calendar($('[data-cal]', pk)); renderSteppers();
  });
  $$('[data-group-widget]').forEach((w, index) => {
    const id = (name) => `g-${index}-${name}`;
    w.innerHTML = `<form class="form-grid" novalidate>
      <div class="field"><label for="${id('type')}">Événement</label><select class="select" id="${id('type')}"><option>Fondue de groupe</option><option>Fête de famille</option><option>Mariage ou anniversaire</option><option>Séminaire ou sortie d’entreprise</option><option>Voyage de groupe</option></select></div>
      <div class="field"><label for="${id('n')}">Nombre de personnes</label><input class="input" id="${id('n')}" type="number" min="6" max="120" step="1" value="20" required></div>
      <div class="field"><label for="${id('date')}">Date souhaitée</label><input class="input" id="${id('date')}" type="date" min="${iso(today())}"></div>
      <div class="field"><label for="${id('rooms')}">Chambres nécessaires</label><select class="select" id="${id('rooms')}"><option>Aucune</option><option>Quelques chambres</option><option>Tout l’hôtel</option></select></div>
      <div class="field"><label for="${id('name')}">Nom & société</label><input class="input" id="${id('name')}" autocomplete="name" required></div>
      <div class="field"><label for="${id('mail')}">E-mail</label><input class="input" id="${id('mail')}" type="email" autocomplete="email" required></div>
      <div class="field full"><label for="${id('msg')}">Votre projet</label><textarea class="textarea" id="${id('msg')}" placeholder="Programme, horaires, menu, musique…"></textarea></div>
      <p class="err full" id="${id('error')}" data-gerr role="alert"></p><button class="btn btn--solid full" type="submit">Préparer ma demande</button></form>`;
    const groupForm = $('form', w), field = (name) => $('#' + id(name), w), value = (name) => field(name).value.trim();
    groupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const err = $('[data-gerr]', w);
      $$('[aria-invalid]', groupForm).forEach((node) => { node.removeAttribute('aria-invalid'); node.removeAttribute('aria-describedby'); });
      const fail = (name, message) => { err.textContent = message; field(name).setAttribute('aria-invalid', 'true'); field(name).setAttribute('aria-describedby', id('error')); field(name).focus(); };
      if (!value('name')) { fail('name', 'Indiquez votre nom pour préparer votre demande.'); return; }
      if (!field('mail').validity.valid || !value('mail')) { fail('mail', 'Indiquez une adresse e-mail valide.'); return; }
      const count = Number(value('n'));
      if (!Number.isInteger(count) || count < 6 || count > 120) { fail('n', 'Indiquez un nombre de personnes entre 6 et 120. Pour une autre taille de groupe, contactez la réception.'); return; }
      if (value('date') && (!parse(value('date')) || parse(value('date')) < today())) { fail('date', 'Choisissez une date à venir ou laissez la date à définir.'); return; }
      err.textContent = '';
      const body = message('mail.groupBody', {
        type: value('type'), count: number(count),
        date: value('date') ? fmt(value('date'), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : message('mail.undefinedDate'),
        rooms: value('rooms'), name: value('name'), email: value('mail'), project: value('msg') || '—',
      });
      const result = document.createElement('div'); result.className = 'success pane'; result.tabIndex = -1;
      const title = document.createElement('h3'); title.textContent = message('group.summary', { type: value('type'), people: plural('guests.people', count) });
      const description = document.createElement('p'); description.className = 'lead'; description.textContent = 'Votre demande est prête. Ouvrez votre messagerie pour la relire et l’envoyer à la réception.';
      const controls = document.createElement('div'); controls.className = 'hero__cta'; controls.style.justifyContent = 'center';
      const mail = document.createElement('a'); mail.className = 'btn btn--solid'; mail.textContent = 'Ouvrir ma messagerie'; mail.href = `mailto:${D.site.email}?subject=${encodeURIComponent(message('mail.groupSubject', { type: value('type') }))}&body=${encodeURIComponent(body)}`;
      const copyButton = document.createElement('button'); copyButton.type = 'button'; copyButton.className = 'btn'; copyButton.textContent = 'Copier la demande'; copyButton.dataset.copy = body;
      const edit = document.createElement('button'); edit.type = 'button'; edit.className = 'btn btn--ghost'; edit.textContent = 'Modifier';
      const phone = document.createElement('p'); phone.className = 'muted'; phone.textContent = D.site.phone;
      controls.append(mail, copyButton, edit); result.append(title, description, controls, phone);
      groupForm.hidden = true; w.appendChild(result); result.focus({ preventScroll: true });
      edit.addEventListener('click', () => { result.remove(); groupForm.hidden = false; field('name').focus({ preventScroll: true }); });
    });
  });
  /* restaurant menu tabs */
  $$('[data-carte]').forEach((c) => {
    const tabs = $$('[data-carte-tab]', c);
    const choose = (t, focus = false) => {
      tabs.forEach((x) => { x.setAttribute('aria-selected', String(x === t)); x.tabIndex = x === t ? 0 : -1; });
      $$('[role="tabpanel"]', c).forEach((p) => (p.hidden = p.id !== 'carte-' + t.dataset.carteTab));
      if (focus) t.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => { buzz(); choose(t); });
      t.addEventListener('keydown', (e) => {
        const k = e.key; let next;
        if (k === 'ArrowRight') next = (i + 1) % tabs.length;
        else if (k === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
        else if (k === 'Home') next = 0;
        else if (k === 'End') next = tabs.length - 1;
        if (next !== undefined) { e.preventDefault(); choose(tabs[next], true); }
      });
    });
    if (tabs.length) choose(tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0]);
  });

  /* ---------- pocket guide: explicit choices, real content and reservation links ---------- */
  const cg = $('[data-cg]'), log = $('[data-cg-log]'), chipsEl = $('[data-cg-chips]'), form = $('[data-cg-form]'), fab = $('.cg-tab');
  const cgMobile = matchMedia('(max-width:860px)');
  // One brief welcome per tab session; no perpetual attention animation.
  const welcomePortrait = () => {
    if (!fab || reduce || !matchMedia('(min-width:761px)').matches) return;
    try { if (sessionStorage.getItem('sch.concierge-welcomed')) return; sessionStorage.setItem('sch.concierge-welcomed', '1'); } catch (e) {}
    fab.classList.add('is-welcoming');
  };
  const conciergePortrait = fab?.querySelector('img');
  if (conciergePortrait?.complete && conciergePortrait.naturalWidth) welcomePortrait();
  else conciergePortrait?.addEventListener('load', welcomePortrait, { once: true });
  let cgFocus = null, cgCloseTimer = 0, cgFrame = 0, cgOpenFrame = 0;
  const CG = { history: [], theme: '' };
  const guideIcons = {
    rooms: '<path d="M3 18V8m18 10V8M3 14h18M6 10V6h12v4M3 18v3m18-3v3M3 11h18v3H3z"/>',
    stays: '<path d="m3 18 6-11 4 7 3-5 5 9H3Z"/><path d="m7 11 2 2 2-2M16 3v3m-2-1h4"/>',
    book: '<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v4m8-4v4M4 11h16m-11 5 2 2 4-4"/>',
    restaurant: '<path d="M5 3v7m3-7v7M3 7h7m-4 3v11M18 3c-3 3-3 8 0 9h2M20 3v18"/>',
    access: '<path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    practical: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.01"/>',
    arrow: '<path d="M4 12h15m-5-5 5 5-5 5"/>'
  };
  const guideSVG = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${guideIcons[name] || guideIcons.arrow}</svg>`;
  const guideMain = [
    ['rooms', 'Trouver ma chambre', 'Pour chaque compagnon de voyage'],
    ['stays', 'Imaginer mon séjour', 'Six envies de grand air'],
    ['book', 'Préparer ma réservation', 'Dates, voyageurs et disponibilités'],
    ['restaurant', 'Manger une fondue', 'La carte et les horaires'],
    ['access', 'Préparer mon arrivée', 'Train, voiture et accès'],
    ['practical', 'Une question pratique', 'Les réponses avant de partir']
  ];
  const guideStays = {
    'a-deux': { title: 'Une échappée à deux', image: 'sch-vue', text: 'Des panoramas à partager, le temps de se retrouver et le plaisir de rentrer au chalet.' },
    'en-famille': { title: 'Les Alpes en famille', image: 'murren', text: 'Une idée de séjour pour les petits curieux et les grands amateurs de plein air.' },
    cascades: { title: 'Au fil des cascades', image: 'valley-river', text: 'Un carnet d’inspiration autour de la vallée et de ses cascades, à adapter à la saison.' },
    randonnee: { title: 'L’appel des sommets', image: 'murren', text: 'Des idées de marches panoramiques, à choisir selon la saison, votre niveau et les conditions.' },
    'sans-voiture': { title: 'La Suisse sans voiture', image: 'sphinx', text: 'Prendre le temps du train, des villages et des grands paysages.' },
    hiver: { title: 'Un hiver au chalet', image: 'sch-hiver', text: 'Les envies de neige et de grand air, puis la chaleur d’un retour au Schützen.' }
  };
  const guideNode = (tag, className, text) => {
    const el = document.createElement(tag); if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  };
  const guideFaq = (i) => D.faq[i]?.[1] || 'La réception vous renseigne volontiers.';
  const reservationHref = () => 'reservation.html' + (CG.theme ? '?sejour=' + encodeURIComponent(CG.theme) : '');
  const guideAction = (label, href, primary = false) => ({ label, href, primary });
  const guideBookAction = (label = 'Préparer ma réservation') => guideAction(label, reservationHref(), true);
  const guideRoomCard = (r) => ({ href: 'chambres.html#' + r.id, image: r.imgs[0], title: r.name, subtitle: `${r.size} · ${r.guests} · ${r.view}` });
  function guideModel(key, raw = '') {
    if (key.startsWith('stay:')) {
      const id = key.slice(5), stay = guideStays[id];
      if (stay) return { title: stay.title, paragraphs: [stay.text], cards: [{ href: 'sejours.html#' + id, image: stay.image, title: 'Découvrir ce séjour', subtitle: 'Les idées, les étapes et les repères utiles' }], actions: [guideAction('Réserver mon séjour', 'reservation.html?sejour=' + id, true)], choices: [['stays', 'Une autre envie']] };
    }
    if (key.startsWith('room:')) {
      const kind = key.slice(5);
      if (kind === 'group') return { title: 'Votre tribu au Schützen', paragraphs: ['Pour plusieurs chambres, une sortie entre amis ou un groupe, dites-nous ce qui vous ferait plaisir. La réception vous aidera à préparer votre séjour.'], actions: [guideAction('Préparer ma demande', 'reservation.html#groupe', true), guideAction('Voir toutes les chambres', 'chambres.html')], choices: [['contact', 'Contacter la réception']] };
      const ids = kind === 'solo' ? ['simple'] : kind === 'family' ? ['familiale', 'familiale-superieure'] : ['double-superieure', 'double'];
      const rooms = ids.map(roomById).filter(Boolean);
      return { title: kind === 'solo' ? 'Votre petite pause alpine' : kind === 'family' ? 'De la place pour toute la famille' : 'Un balcon pour deux', paragraphs: [kind === 'family' ? 'La Familiale accueille 5 personnes. La Familiale Supérieure dispose de 6 couchages, avec un maximum de 4 adultes. Retrouvez le détail des lits et des équipements dans chaque fiche.' : kind === 'solo' ? 'Une chambre pour soi, avec vue sur la montagne et salle de bain privative. Découvrez ses équipements avant de choisir vos dates.' : 'Deux catégories à découvrir pour une escapade à deux. La fiche de chaque chambre vous présente la vue et les équipements.'], cards: rooms.map(guideRoomCard), actions: [guideBookAction()], choices: [['rooms', 'Comparer les autres chambres'], ['stays', 'Trouver une idée de séjour']] };
    }
    switch (key) {
      case 'rooms': return { title: 'Avec qui partez-vous ?', paragraphs: ['Huit catégories de chambres, et autant de façons de vivre le chalet. Je vous montre quelques pistes pour votre voyage.'], choices: [['room:duo', 'À deux'], ['room:family', 'En famille'], ['room:solo', 'En solo ou en randonnée'], ['room:group', 'En groupe']], actions: [guideAction('Voir les 8 catégories', 'chambres.html')] };
      case 'stays': case 'idea': return { title: 'Quelle est votre envie de Suisse ?', paragraphs: ['Choisissez une ambiance. Vous trouverez un carnet d’idées à explorer depuis le Schützen, puis un accès à la réservation.'], choices: Object.entries(guideStays).map(([id, s]) => ['stay:' + id, s.title]), actions: [guideAction('Tous les séjours à imaginer', 'sejours.html')] };
      case 'book': case 'prices': return { title: 'Votre prochaine escapade commence ici', paragraphs: [hasDates() ? message('guide.savedDates', { arrival: fmt(B.in), departure: fmt(B.out), guests: guestsLabel() }) : 'Choisissez vos dates et vos voyageurs sur la page de réservation. Vous pourrez ensuite consulter les disponibilités et les tarifs auprès de nos partenaires, ou contacter la réception.'], actions: [guideBookAction('Choisir mes dates'), guideAction('Comparer les chambres', 'chambres.html')], choices: [['stays', 'J’ai besoin d’inspiration'], ['contact', 'Je préfère contacter la réception']] };
      case 'restaurant': case 'carte': return { title: 'Un petit goût de Suisse', paragraphs: ['Fondue, raclette, rösti… Retrouvez la carte du Restaurant Schützen et préparez votre prochaine tablée.', guideFaq(3)], cards: [{ href: 'restaurant.html#carte', image: 'sch-fondue', title: 'À table, au Schützen', subtitle: 'Spécialités suisses, plats et boissons' }], actions: [guideAction('Ouvrir la carte', 'restaurant.html#carte', true)], choices: [['breakfast', 'Le petit-déjeuner'], ['resto-hours', 'Les horaires'], ['groupe', 'Nous venons en groupe']] };
      case 'resto-hours': return { title: 'Les horaires de la table', paragraphs: ['Petit-déjeuner de 7h30 à 10h, ouvert à tous. Restaurant de 11h à 21h, cuisine chaude de 12h à 20h, tous les jours.'], actions: [guideAction('Voir le restaurant', 'restaurant.html#horaires', true)], choices: [['restaurant', 'La carte et les spécialités'], ['groupe', 'Préparer une grande tablée']] };
      case 'table': return { title: 'Venez comme vous êtes', paragraphs: [guideFaq(3)], actions: [guideAction('Voir les horaires', 'restaurant.html#horaires', true), guideAction('Une demande pour un groupe', 'reservation.html#groupe')] };
      case 'groupe': return { title: 'Une grande tablée, un beau souvenir', paragraphs: ['Une fondue entre amis, une fête ou une sortie de groupe ? Préparez votre demande et envoyez-la à la réception depuis votre messagerie.'], actions: [guideAction('Préparer ma demande de groupe', 'reservation.html#groupe', true)], choices: [['restaurant', 'Découvrir le restaurant'], ['contact', 'Contacter la réception']] };
      case 'breakfast': return { title: 'Bien commencer la journée', paragraphs: [guideFaq(2)], actions: [guideAction('Le petit-déjeuner et les horaires', 'restaurant.html#horaires', true)], choices: [['book', 'Préparer ma réservation']] };
      case 'access': return { title: 'On vous attend à Lauterbrunnen', paragraphs: [guideFaq(0), guideFaq(5)], actions: [guideAction('Plan et itinéraire', 'infos.html#acces', true), guideAction('Horaires des trains CFF', 'https://www.sbb.ch')], choices: [['parking', 'Je viens en voiture'], ['hours', 'Arrivée et départ'], ['stay:sans-voiture', 'Un séjour sans voiture']] };
      case 'practical': return { title: 'Les petits détails qui changent tout', paragraphs: ['Voici les réponses pour arriver l’esprit tranquille. Pour une demande particulière, la réception vous renseigne directement.'], choices: [['hours', 'Arrivée et départ'], ['breakfast', 'Petit-déjeuner'], ['parking', 'Parking'], ['pets', 'Animaux'], ['family', 'Voyager avec des enfants'], ['contact', 'Contacter la réception']], actions: [guideAction('Toutes les questions fréquentes', 'infos.html#faq')] };
      case 'hours': return { title: 'Votre arrivée au chalet', paragraphs: [guideFaq(6)], actions: [guideAction('Les informations pratiques', 'infos.html#faq', true)], choices: [['access', 'Comment venir ?'], ['contact', 'Prévenir la réception']] };
      case 'parking': return { title: 'Venir en voiture', paragraphs: [guideFaq(4)], actions: [guideAction('Voir le plan d’accès', 'infos.html#acces', true)], choices: [['hours', 'À quelle heure arriver ?']] };
      case 'pets': return { title: 'Et votre compagnon à quatre pattes ?', paragraphs: [guideFaq(7)], actions: [guideAction('Découvrir le restaurant', 'restaurant.html', true)], choices: [['contact', 'Une question pour la réception']] };
      case 'family': return { title: 'Les petits aussi ont leur place', paragraphs: [guideFaq(9)], actions: [guideAction('Voir les chambres familiales', 'chambres.html#familles', true)], choices: [['room:family', 'Comparer les chambres'], ['stay:en-famille', 'Nos idées en famille']] };
      case 'winter': return guideModel('stay:hiver');
      case 'season': return { title: 'Chaque saison a sa carte postale', paragraphs: ['Grand air, balades ou envies de neige : choisissez votre ambiance. Les idées de séjour précisent les saisons et les informations à vérifier avant de partir.'], actions: [guideAction('Explorer les idées de séjour', 'sejours.html', true), guideAction('Les incontournables de la vallée', 'vallee.html#incontournables')] };
      case 'wifi': return { title: 'Garder le lien, même au chalet', paragraphs: ['Le Wi-Fi est offert dans l’hôtel.'], actions: [guideAction('Les équipements des chambres', 'chambres.html', true)], choices: [['practical', 'Une autre question']] };
      case 'access-rest': return { title: 'Préparer un accueil adapté', paragraphs: ['Décrivez vos besoins à la réception pour vérifier ensemble les accès et la chambre qui vous conviendra.'], actions: [guideAction('Contacter la réception', 'tel:' + D.site.phone.replace(/\s/g, ''), true), guideAction('Écrire à l’hôtel', 'mailto:' + D.site.email)], choices: [['practical', 'Les informations pratiques']] };
      case 'contact': return { title: 'Un mot à la réception', paragraphs: ['L’équipe du Schützen vous renseigne pour une question particulière ou une réservation en direct.', D.site.phone + ' · ' + D.site.email], actions: [guideAction('Appeler la réception', 'tel:' + D.site.phone.replace(/\s/g, ''), true), guideAction('Écrire un e-mail', 'mailto:' + D.site.email)], choices: [['book', 'Préparer ma réservation en ligne']] };
      case 'grosshorn': return { title: 'Le Chalet Grosshorn', paragraphs: ['Retrouvez les informations de l’appartement dans le catalogue. La réception vous renseignera sur votre projet.'], actions: [guideAction('Découvrir les hébergements', 'chambres.html', true), guideAction('Écrire à la réception', 'mailto:' + D.site.email)] };
      case 'events': return { title: 'Au rythme de la région', paragraphs: ['Retrouvez les temps forts et les inspirations dans la vallée. La réception vous renseigne sur les rendez-vous de votre séjour.'], actions: [guideAction('Explorer la vallée', 'vallee.html', true)], choices: [['contact', 'Demander à la réception']] };
      case 'thanks': return { title: 'À bientôt, au Schützen !', paragraphs: ['Avec plaisir. Un dernier détail à préparer avant de partir ?'], choices: [['book', 'Choisir mes dates'], ['stays', 'Garder une idée de séjour'], ['contact', 'Contacter la réception']] };
      default: return { title: 'Trouvons le bon interlocuteur', paragraphs: ['Je vous oriente à partir des informations du site. Pour cette question, la réception pourra vous répondre précisément. Vous pouvez aussi choisir un sujet ci-dessous.'], actions: [guideAction('Écrire à la réception', 'mailto:' + D.site.email + '?subject=' + encodeURIComponent('Question pour mon séjour') + '&body=' + encodeURIComponent(raw), true)], choices: guideMain };
    }
  }
  function guideCard(item) {
    const a = guideNode('a', 'msg-card'); a.href = item.href;
    const im = guideNode('img'); im.src = 'img/' + item.image + '-m.webp'; im.alt = ''; im.width = 96; im.height = 96; im.loading = 'lazy'; im.decoding = 'async';
    const text = guideNode('span'); text.append(guideNode('b', '', item.title), guideNode('small', '', item.subtitle));
    const arrow = guideNode('span', 'msg-card__arrow'); arrow.innerHTML = guideSVG('arrow');
    a.append(im, text, arrow); return a;
  }
  function guideActions(items) {
    const wrap = guideNode('div', 'cg-actions');
    items.forEach((item) => {
      const a = guideNode('a', 'cg-action' + (item.primary ? ' cg-action--primary' : ''), item.label); a.href = item.href;
      if (/^https:\/\//.test(item.href)) { a.target = '_blank'; a.rel = 'noopener'; a.append(guideNode('span', 'sr', ' (nouvel onglet)')); }
      const arrow = guideNode('span'); arrow.innerHTML = guideSVG('arrow'); a.append(arrow); wrap.append(a);
    });
    return wrap;
  }
  function renderGuide(focusChoices = false) {
    if (!log || !chipsEl) return;
    cancelAnimationFrame(cgFrame); cancelAnimationFrame(cgOpenFrame);
    log.replaceChildren();
    const intro = guideNode('div', 'msg msg--bot cg-welcome');
    intro.append(guideNode('strong', '', 'Grüezi, bonjour !'), guideNode('p', '', 'Bienvenue dans votre Concierge en ligne. Une chambre, une fondue ou une envie d’Alpes ? Choisissez, je vous oriente.'));
    log.append(intro);
    let latest = null;
    CG.history.forEach((turn, i) => {
      log.append(guideNode('div', 'msg msg--me', turn.label));
      const model = guideModel(turn.key, turn.raw), entry = guideNode('div', 'cg-turn' + (i === CG.history.length - 1 ? ' cg-turn--latest' : ''));
      entry.dataset.guideTurn = String(i);
      const bubble = guideNode('div', 'msg msg--bot'); bubble.append(guideNode('strong', 'cg-answer-title', model.title));
      (model.paragraphs || []).forEach((p) => bubble.append(guideNode('p', '', p)));
      entry.append(bubble); (model.cards || []).forEach((item) => entry.append(guideCard(item)));
      if (model.actions?.length) entry.append(guideActions(model.actions));
      log.append(entry); latest = model;
    });
    const choices = latest?.choices || (CG.history.length ? [['menu', 'Revenir aux choix de départ']] : guideMain);
    chipsEl.replaceChildren(); chipsEl.classList.toggle('cg__chips--home', !CG.history.length);
    choices.forEach(([key, label, subtitle]) => {
      const b = guideNode('button', 'cg-choice'); b.type = 'button'; b.dataset.q = key;
      if (!CG.history.length) { const icon = guideNode('span', 'cg-choice__icon'); icon.innerHTML = guideSVG(key); b.append(icon); }
      const copy = guideNode('span', 'cg-choice__copy'); copy.append(guideNode('b', '', label));
      if (subtitle && !CG.history.length) copy.append(guideNode('small', '', subtitle));
      b.append(copy); chipsEl.append(b);
    });
    const back = $('[data-cg-back]', cg), reset = $('[data-cg-reset]', cg), crumb = $('[data-cg-step]', cg), status = $('[data-cg-status]', cg);
    if (back) back.disabled = !CG.history.length;
    if (reset) reset.disabled = !CG.history.length;
    if (crumb) crumb.textContent = CG.history.length ? 'Votre conversation' : 'À vous de choisir';
    if (status) status.textContent = latest ? latest.title + '. ' + (latest.paragraphs?.[0] || '') : 'Choisissez une chambre, un séjour, une réservation, le restaurant, votre arrivée ou les informations pratiques.';
    cgFrame = requestAnimationFrame(() => {
      if (!cgOpen) return;
      if (CG.history.length) {
        const last = $('.cg-turn--latest', log), previous = last?.previousElementSibling;
        const lead = previous || last;
        if (lead) log.scrollTop = Math.max(0, lead.getBoundingClientRect().top - log.getBoundingClientRect().top + log.scrollTop - 12);
      } else log.scrollTop = 0;
      if (focusChoices) $('[data-q]', chipsEl)?.focus({ preventScroll: true });
    });
  }
  function guideNavigate(key, label, raw = '') {
    if (key === 'menu' || key === 'hello') { CG.history = []; CG.theme = ''; renderGuide(true); return; }
    const theme = key.startsWith('stay:') ? key.slice(5) : key === 'winter' ? 'hiver' : '';
    if (guideStays[theme]) CG.theme = theme;
    CG.history.push({ key, label: label || guideMain.find(([k]) => k === key)?.[1] || guideModel(key).title, raw });
    if (CG.history.length > 24) CG.history.shift();
    renderGuide(document.activeElement !== $('#cg-input'));
  }
  function updateGuideViewport() {
    if (!cg || !cgOpen) return;
    const viewport = window.visualViewport, height = viewport?.height || innerHeight;
    cg.dataset.compact = String(height < 540);
    cg.style.setProperty('--cg-view-height', `${height}px`);
    cg.style.setProperty('--cg-view-top', `${viewport?.offsetTop || 0}px`);
  }
  function guideTriggers() { return $$('[data-cg-open]'); }
  function openCg(intent) {
    if (!cg) return;
    const origin = document.activeElement;
    clearTimeout(cgCloseTimer); cancelAnimationFrame(cgFrame); cancelAnimationFrame(cgOpenFrame);
    if (menuOpen) closeMnav(true);
    if (openSheetEl) closePanel();
    if (!cgOpen) cgFocus = origin;
    cgOpen = true; cg.hidden = false; if (fab) fab.classList.add('is-off');
    guideTriggers().forEach((b) => { b.setAttribute('aria-expanded', 'true'); b.setAttribute('aria-controls', 'cg-panel'); });
    cg.setAttribute('aria-modal', String(cgMobile.matches));
    if (cgMobile.matches) { if (scrim) { scrim.hidden = false; scrim.dataset.open = 'true'; } activateModal(cg); lockScroll(true); }
    if (intent) {
      CG.history = []; CG.theme = '';
      const key = intent === 'idea' ? 'stays' : intent;
      const theme = key.startsWith('stay:') ? key.slice(5) : key === 'winter' ? 'hiver' : '';
      if (guideStays[theme]) CG.theme = theme;
      CG.history.push({ key, label: guideMain.find(([k]) => k === key)?.[1] || guideModel(key).title, raw: '' });
    }
    renderGuide(false); updateGuideViewport();
    cgOpenFrame = requestAnimationFrame(() => { if (!cgOpen) return; cg.dataset.open = 'true'; $('[data-cg-close]', cg)?.focus({ preventScroll: true }); });
  }
  function closeCg(silent = false) {
    if (!cg || !cgOpen) return;
    cancelAnimationFrame(cgFrame); cancelAnimationFrame(cgOpenFrame); clearTimeout(cgCloseTimer);
    cgOpen = false; cg.dataset.open = 'false'; releaseModal(cg);
    guideTriggers().forEach((b) => b.setAttribute('aria-expanded', 'false'));
    if (fab) fab.classList.remove('is-off');
    cgCloseTimer = setTimeout(() => { if (!cgOpen) cg.hidden = true; }, reduce ? 0 : 220);
    if (!openSheetEl) {
      if (scrim) { scrim.dataset.open = 'false'; setTimeout(() => { if (!cgOpen && !openSheetEl) scrim.hidden = true; }, reduce ? 0 : 220); }
      lockScroll(false);
    }
    if (!silent) restoreFocus(cgFocus, guideTriggers().find((b) => b.getClientRects().length));
  }
  cgMobile.addEventListener('change', (event) => {
    if (!cgOpen || !cg) return;
    cg.setAttribute('aria-modal', String(event.matches));
    if (event.matches) { if (scrim) { scrim.hidden = false; scrim.dataset.open = 'true'; } activateModal(cg); lockScroll(true); }
    else { releaseModal(cg); lockScroll(false); if (scrim && !openSheetEl) { scrim.dataset.open = 'false'; scrim.hidden = true; } }
    updateGuideViewport();
  });
  addEventListener('resize', updateGuideViewport);
  window.visualViewport?.addEventListener('resize', updateGuideViewport);
  window.visualViewport?.addEventListener('scroll', updateGuideViewport);
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-cg-open]');
    if (trigger) { e.preventDefault(); cgOpen ? closeCg() : openCg(); return; }
    const ask = e.target.closest('[data-cg-ask]');
    if (ask) { e.preventDefault(); openCg(ask.dataset.cgAsk); return; }
    if (e.target.closest('[data-cg-close]')) { closeCg(); return; }
    if (e.target.closest('[data-cg-back]')) {
      CG.history.pop();
      const lastTheme = [...CG.history].reverse().find((t) => t.key.startsWith('stay:'));
      CG.theme = lastTheme ? lastTheme.key.slice(5) : ''; renderGuide(true); return;
    }
    if (e.target.closest('[data-cg-reset]')) { CG.history = []; CG.theme = ''; renderGuide(true); }
  });
  chipsEl?.addEventListener('click', (e) => {
    const b = e.target.closest('[data-q]'); if (!b) return;
    buzz(); guideNavigate(b.dataset.q, $('b', b)?.textContent || b.textContent);
  });
  function guideIntent(q) {
    // Keep this vocabulary multilingual when compiling the page's display strings.
    const normalize = (text) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const s = normalize(q);
    const has = (...words) => words.some((word) => {
      const term = normalize(word);
      if (/[\u1100-\u11ff\u3400-\u9fff]/.test(term)) return s.includes(term);
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`(?:^|[^\\p{L}\\p{N}])${escaped}`, 'u').test(s);
    });
    if (has('sans voiture', 'train panoramique', 'car free', 'car-free', 'without a car', 'ohne auto', 'senza auto', 'sin coche', '无车', '不自驾', 'без машины', 'без автомобиля', '차 없이', '대중교통 여행')) return 'stay:sans-voiture';
    if (has('romant', 'amoureux', 'a deux', 'couple', 'zu zweit', 'coppia', 'pareja', '情侣', '浪漫', 'романтич', 'вдвоем', '커플', '로맨틱')) return 'stay:a-deux';
    if (has('randon', 'marche', 'hike', 'hiking', 'wander', 'escursion', 'trekking', 'senderismo', '徒步', '登山', 'поход', 'пеш', '하이킹', '등산')) return 'stay:randonnee';
    if (has('cascade', 'staubbach', 'trummelbach', 'waterfall', 'wasserfall', 'cascat', 'cascada', '瀑布', 'водопад', '폭포')) return 'stay:cascades';
    if (has('ski', 'hiver', 'neige', 'luge', 'winter', 'snow', 'schnee', 'schlittel', 'inverno', 'neve', 'sci', 'invierno', 'nieve', '冬', '滑雪', 'зим', 'лыж', 'снег', '겨울', '스키', '눈썰매')) return 'stay:hiver';
    if (has('table', 'couverts', 'tisch', 'tavolo', 'mesa', '订桌', '餐桌', 'столик', 'стол в', '테이블', '식당 예약')) return 'table';
    if (has('groupe', 'fete', 'entreprise', 'group', 'event', 'gruppe', 'feier', 'gruppo', 'festa', 'grupo', 'fiesta', '团体', '活动预订', 'групп', 'мероприят', '단체', '행사')) return 'groupe';
    if (has('petit dej', 'petit-dej', 'breakfast', 'fruhstuck', 'colazione', 'desayuno', '早餐', 'завтрак', '조식', '아침 식사')) return 'breakfast';
    if (has('chambre familiale', 'chambres familiales', 'family room', 'familienzimmer', 'camera familiare', 'habitacion familiar', '家庭房', 'семейный номер', '패밀리룸', '가족 객실')) return 'room:family';
    if (has('enfant', 'famille', 'bebe', 'family', 'children', 'baby', 'familie', 'kinder', 'famiglia', 'bambin', 'familia', 'nino', '家庭', '孩子', '婴儿', 'семь', 'ребен', 'дет', '가족', '어린이', '아이', '아기')) return 'family';
    if (has('reserv', 'dispo', 'tarif', 'prix', 'book', 'availability', 'price', 'buchen', 'buchung', 'verfugbar', 'preis', 'prenot', 'prezzo', 'disponibil', 'precio', '预订', '预定', '订房', '价格', '空房', 'бронир', 'заброни', 'цен', 'свободн', '예약', '요금', '가격')) return 'book';
    if (has('chambre', 'lit', 'balcon', 'zimmer', 'room', 'bed', 'camera', 'camere', 'letto', 'habitacion', 'cama', '客房', '房间', '床', 'номер', 'комнат', 'кроват', '객실', '방', '침대')) return 'rooms';
    if (has('fondue', 'raclette', 'rosti', 'manger', 'restaurant', 'carte', 'boire', 'menu', 'food', 'drink', 'essen', 'speisekarte', 'trinken', 'ristorante', 'mangiare', 'comida', 'carta', 'bebida', '餐厅', '菜单', '奶酪火锅', '吃饭', 'ресторан', 'меню', 'фондю', 'еда', '식당', '레스토랑', '메뉴', '퐁뒤', '음식')) return 'restaurant';
    if (has('animal', 'animaux', 'chien', 'chats', 'dog', 'pet', 'hund', 'haustier', 'cane', 'gatto', 'perro', 'mascota', '宠物', '狗', 'собак', 'питом', '반려', '강아지')) return 'pets';
    if (has('parking', 'voiture', 'car park', 'parkplatz', 'parcheggio', 'aparcamiento', 'estacionamiento', '停车', 'парков', '주차')) return 'parking';
    if (has('check', 'arrivee', 'depart', 'horaire', 'heure', 'arrival', 'departure', 'anreisezeit', 'abreise', 'arrivo', 'partenza', 'horario', 'llegada', 'salida', '入住时间', '退房', 'заезд', 'выезд', '체크인', '체크아웃')) return 'hours';
    if (has('fauteuil', 'accessib', 'handicap', 'wheelchair', 'rollstuhl', 'barrierefrei', 'disabil', 'silla de ruedas', '无障碍', '轮椅', 'инвалид', 'коляск', '휠체어', '장애인')) return 'access-rest';
    if (has('venir', 'acces', 'train', 'gare', 'itineraire', 'bus', 'direction', 'station', 'anfahrt', 'bahnhof', 'zug', 'come arrivare', 'treno', 'stazione', 'como llegar', 'tren', 'estacion', '怎么去', '交通', '火车', '路线', 'как добраться', 'вокзал', 'поезд', '오시는 길', '가는 길', '기차', '교통')) return 'access';
    if (has('wi-fi', 'wifi', 'internet', 'wlan', '无线网', '网络', 'интернет', 'вайфай', '와이파이', '인터넷')) return 'wifi';
    if (has('telephone', 'appel', 'mail', 'reception', 'contact', 'humain', 'phone', 'rezeption', 'kontakt', 'telefono', 'contatt', 'contac', '电话', '联系', '前台', 'телефон', 'контакт', 'рецепц', 'связаться', '전화', '연락', '프런트')) return 'contact';
    if (has('saison', 'meteo', 'quand', 'season', 'weather', 'wetter', 'jahreszeit', 'stagion', 'temporada', 'clima', '季节', '天气', 'погод', 'сезон', '날씨', '계절')) return 'season';
    if (has('grosshorn', 'appartement', 'apartment', 'ferienwohnung', 'appartamento', 'apartamento', '公寓', 'апартамент', '아파트')) return 'grosshorn';
    if (has('idee', 'sejour', 'visite', 'excursion', 'activite', 'murren', 'wengen', 'jungfrau', 'things to do', 'activity', 'visit', 'ausflug', 'aktivit', 'soggiorno', 'visita', 'actividad', '旅游', '景点', '游玩', 'экскурс', 'заняти', 'достопримеч', '관광', '여행', '즐길 거리')) return 'stays';
    if (has('bonjour', 'hello', 'salut', 'gruezi', 'hallo', 'ciao', 'buongiorno', 'hola', '你好', '您好', 'здравств', 'привет', '안녕')) return 'hello';
    if (has('merci', 'thanks', 'thank you', 'danke', 'grazie', 'gracias', '谢谢', 'спасибо', '감사', '고마워')) return 'thanks';
    return 'unknown';
  }
  form?.addEventListener('submit', (e) => {
    e.preventDefault(); const input = $('[name="q"]', form), q = input.value.trim().slice(0, 240); if (!q) return;
    input.value = ''; guideNavigate(guideIntent(q), q, q);
  });

  /* ---------- header and section navigation follow native scroll ---------- */
  const heroEl = $('.hero');
  function refreshTop() { if (topEl) topEl.classList.toggle('is-solid', menuOpen || (heroEl ? heroEl.getBoundingClientRect().bottom <= topEl.offsetHeight + 1 : true)); }
  let ticking = false;
  function frame() {
    ticking = false;
    if (anchorBar) anchorBar.spy();
    refreshTop();
  }
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  frame();

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (openSheetEl) { e.preventDefault(); closePanel(); }
      else if (lb && !lb.hidden) { e.preventDefault(); closeLb(); }
      else if (cgOpen) { e.preventDefault(); closeCg(); }
      else if (menuOpen) { e.preventDefault(); closeMnav(); }
      return;
    }
    if (e.key !== 'Tab' || !modalEl) return;
    const controls = modalEl === mnav ? [mBtn, ...focusable(mnav)].filter(Boolean) : focusable(modalEl);
    if (!controls.length) { e.preventDefault(); return; }
    const i = controls.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); controls.at(-1).focus(); }
    else if (!e.shiftKey && (i === controls.length - 1 || i < 0)) { e.preventDefault(); controls[0].focus(); }
  });

  syncLabels(); renderSteppers();
})();
