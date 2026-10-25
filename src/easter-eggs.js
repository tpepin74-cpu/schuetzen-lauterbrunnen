import './easter-eggs.css';
import { playEasterScene } from './easter-scenes.js';
import { getMenuSurprise, playMenuSurprise } from './menu-easter-eggs.js';

// Existing photos become small, optional discoveries. Framer keeps the outer wrappers.
const surprise = (kind, label, message, extra = {}) => ({
  kind, label, message, stop: 'Arrêter cette petite surprise', duration: 4600, ...extra,
});
const surprises = {
  'bernard.webp': surprise('dog', 'Demander la patte au Saint-Bernard', 'Tope là !', {
    stop: 'Laisser le Saint-Bernard reposer sa patte', duration: 6000,
    variant: import.meta.env.BASE_URL + 'assets/optimized/collage/bernard-paw-640.webp',
  }),
  'cow.webp': surprise('cow', 'Faire meugler la vache (son)', 'Meuh… bienvenue !', {
    stop: 'Arrêter le meuglement de la vache', audioKind: 'cow', duration: 3400,
  }),
  'cowbell.webp': surprise('bell', 'Faire tinter la cloche d’alpage (son)', 'L’appel des alpages !', {
    stop: 'Arrêter le tintement de la cloche', audioKind: 'bell', duration: 3400,
  }),
  'cable-car.webp': surprise('cable', 'Faire monter le téléphérique', 'Prochain arrêt : les nuages.'),
  'train.webp': surprise('train', 'Faire partir le petit train (son)', 'Un aller simple pour le grand air.', { audioKind: 'train' }),
  'geranium.webp': surprise('geranium', 'Faire fleurir les géraniums', 'Un petit bouquet pour vous.'),
  'edelweiss.webp': surprise('edelweiss', 'Révéler la constellation de l’edelweiss', 'Une étoile tombée des Alpes.'),
  'boots.webp': surprise('boots', 'Faire marcher les chaussures de randonnée', 'Les chaussures sont déjà parties !'),
  'sled.webp': surprise('sled', 'Lancer la luge dans la neige', 'Schuss… et chocolat chaud à l’arrivée !'),
  'alphorn.webp': surprise('alphorn', 'Faire résonner le cor des Alpes (son)', 'Allô les sommets ? Ici le Schützen.', { audioKind: 'horn' }),
  'fondue-friends.webp': surprise('friends', 'Faire trinquer la tablée de fondue (son)', 'Santé ! Et gare au pain dans la fondue.', { audioKind: 'toast' }),
  'postman-friendly.webp': surprise('postman', 'Recevoir le petit courrier du postier', 'Un bisou suisse, affranchi avec soin.', { audioKind: 'stamp' }),
  'restaurant-lettering.webp': surprise('lettering', 'Faire danser les lettres « Notre restaurant »', 'À taaable !'),
  'concierge.webp': surprise('concierge', 'Recevoir un clin d’œil du concierge', 'Entre nous… le chien connaît tous les secrets.', {
    variant: import.meta.env.BASE_URL + 'assets/optimized/collage/concierge-wink-480.webp', variantHold: 950, duration: 3400,
  }),
};

const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
const reducedMotion = () => motionQuery.matches || new URLSearchParams(location.search).get('motion') === 'reduce';
let active = null;
let bubble;
let moo;
let audioContext;
let voices = [];
let soundRevision = 0;
const announcement = document.createElement('div');
announcement.className = 'egg-announcement';
announcement.setAttribute('role', 'status');
announcement.setAttribute('aria-live', 'polite');
announcement.setAttribute('aria-atomic', 'true');
document.body.appendChild(announcement);
// Modal focus management makes the rest of the page inert; keep its status inside.
const guideAnnouncement = announcement.cloneNode(false);
document.querySelector('.cg')?.appendChild(guideAnnouncement);

function stopSound() {
  soundRevision++;
  if (moo) { moo.pause(); moo.currentTime = 0; }
  voices.forEach(({ source, gain }) => {
    try { source.stop(); } catch { /* Already finished. */ }
    source.disconnect();
    gain.disconnect();
  });
  voices = [];
}

function finishSurprise() {
  stopSound();
  if (!active) return;
  clearTimeout(active.timer);
  clearTimeout(active.poseTimer);
  active.animations.forEach(animation => animation.cancel());
  active.nodes.forEach(node => node.remove());
  active.button.classList.remove('is-playing', 'is-loading', 'has-alt-pose');
  active.button.removeAttribute('aria-busy');
  active.button.setAttribute('aria-label', active.config.label);
  active.wrapper.classList.remove('egg-is-active');
  if (bubble) { bubble.classList.remove('is-visible'); bubble.textContent = ''; }
  announcement.textContent = '';
  guideAnnouncement.textContent = '';
  active = null;
}

function positionBubble() {
  if (!active || !bubble?.classList.contains('is-visible')) return;
  const target = active.button.getBoundingClientRect();
  const topBar = document.querySelector('[data-top]')?.getBoundingClientRect();
  const nav = document.querySelector('.app-nav')?.getBoundingClientRect();
  const topLimit = Math.max(12, topBar?.bottom || 0) + 10;
  const bottomLimit = nav?.height ? Math.min(innerHeight - 12, nav.top - 12) : innerHeight - 12;
  if (!target.width || !target.height || target.bottom < topLimit || target.top > bottomLimit) {
    finishSurprise();
    return;
  }
  const { width, height } = bubble.getBoundingClientRect();
  const above = target.top - height - 8;
  const idealTop = above >= topLimit ? above : target.bottom + 8;
  bubble.style.left = `${Math.round(Math.max(12, Math.min(innerWidth - width - 12, target.left + target.width / 2 - width / 2)))}px`;
  bubble.style.top = `${Math.round(Math.max(topLimit, Math.min(bottomLimit - height, idealTop)))}px`;
}

function say(message) {
  if (!bubble) {
    bubble = document.createElement('div');
    bubble.className = 'egg-bubble';
    bubble.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bubble);
  }
  bubble.dataset.inGuide = String(!!active?.button.closest('.cg'));
  bubble.textContent = message;
  const inGuide = !!active?.button.closest('.cg');
  announcement.textContent = inGuide ? '' : message;
  guideAnnouncement.textContent = inGuide ? message : '';
  bubble.classList.add('is-visible');
  positionBubble();
}

function playMoo() {
  if (!moo) {
    moo = document.createElement('audio');
    moo.src = import.meta.env.BASE_URL + 'assets/easter/cow-moo.mp3';
    moo.preload = 'none';
    moo.hidden = true;
    moo.dataset.easterAudio = 'cow';
    moo.setAttribute('aria-hidden', 'true');
    moo.volume = 0.7;
    document.body.appendChild(moo);
  }
  return moo.play();
}

// Tiny locally synthesized accents, created only by an intentional activation.
async function playSound(kind) {
  if (kind === 'cow') return playMoo();
  if (!kind) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  audioContext ||= new AudioContextClass();
  const revision = soundRevision;
  if (audioContext.state === 'suspended') await audioContext.resume();
  if (revision !== soundRevision || document.hidden) return;
  const start = audioContext.currentTime + .008;
  const tone = (frequency, offset, duration, level, type = 'sine') => {
    const source = audioContext.createOscillator();
    const gain = audioContext.createGain();
    source.type = type;
    source.frequency.setValueAtTime(frequency, start + offset);
    gain.gain.setValueAtTime(0, start + offset);
    gain.gain.linearRampToValueAtTime(level, start + offset + Math.min(.035, duration / 8));
    gain.gain.exponentialRampToValueAtTime(.0001, start + offset + duration);
    source.connect(gain); gain.connect(audioContext.destination);
    source.start(start + offset); source.stop(start + offset + duration + .03);
    voices.push({ source, gain });
  };
  if (kind === 'bell') {
    for (const [offset, strength] of [[0, 1], [.23, .5]]) {
      for (const [frequency, level] of [[620, .12], [1037, .065], [1443, .038], [1979, .019], [2596, .009]]) tone(frequency, offset, 1.1, level * strength);
    }
  } else if (kind === 'horn') {
    [[196, 0, .46], [261.63, .41, .48], [392, .84, .7]].forEach(([note, offset, duration]) => {
      tone(note, offset, duration, .085, 'triangle');
      tone(note * 2, offset, duration * .9, .025);
    });
  } else if (kind === 'train') {
    [0, .23].forEach(offset => { tone(392, offset, .2, .045, 'triangle'); tone(523.25, offset, .2, .025); });
  } else if (kind === 'toast') {
    [[1840, 0, .055], [2650, .045, .032], [3140, .045, .012]].forEach(([note, offset, level]) => tone(note, offset, .65, level));
  } else if (kind === 'stamp') {
    tone(135, 0, .08, .06, 'triangle');
    tone(78, .025, .1, .045);
  }
}

function animateOriginalSurprise(entry, reduced) {
  if (reduced || !entry.visual.animate || !['cow', 'bell'].includes(entry.config.kind)) return;
  const frames = entry.config.kind === 'bell'
    ? [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-13deg)' }, { transform: 'rotate(10deg)' }, { transform: 'rotate(-7deg)' }, { transform: 'rotate(4deg)' }, { transform: 'rotate(0deg)' }]
    : [{ transform: 'rotate(0deg) translateY(0)' }, { transform: 'rotate(-3deg) translateY(-3px)' }, { transform: 'rotate(2deg) translateY(0)' }, { transform: 'rotate(0deg) translateY(0)' }];
  entry.animations.push(entry.visual.animate(frames, { duration: entry.config.kind === 'bell' ? 1250 : 700, easing: 'ease-in-out', iterations: 1 }));
}

function endLater(entry, duration) {
  if (active === entry) entry.timer = setTimeout(() => { if (active === entry) finishSurprise(); }, duration);
}

async function activate(button, wrapper, visual, config, variant) {
  if (active?.button === button) { finishSurprise(); return; }
  finishSurprise();
  const entry = { button, wrapper, visual, config, animations: [], nodes: [], timer: 0, poseTimer: 0 };
  active = entry;
  button.setAttribute('aria-label', config.stop);
  wrapper.classList.add('egg-is-active');
  if (variant) {
    button.classList.add('is-loading');
    button.setAttribute('aria-busy', 'true');
    variant.loading = 'eager';
    if (!variant.getAttribute('src')) variant.src = config.variant;
    try {
      if (!variant.complete || !variant.naturalWidth) await variant.decode();
    } catch {
      if (active === entry) {
        button.classList.remove('is-loading'); button.removeAttribute('aria-busy');
        say(config.kind === 'dog' ? 'Une petite caresse ?' : 'Un petit secret entre nous.');
        endLater(entry, 2200);
      }
      return;
    }
    if (active !== entry) return;
    button.classList.remove('is-loading'); button.removeAttribute('aria-busy');
    button.classList.add('has-alt-pose');
    if (config.variantHold) entry.poseTimer = setTimeout(() => {
      if (active === entry) button.classList.remove('has-alt-pose');
    }, config.variantHold);
  }
  if (active !== entry) return;
  const reduced = reducedMotion();
  button.classList.add('is-playing');
  if (config.audioKind) Promise.resolve(playSound(config.audioKind)).catch(() => { /* The visible scene and its caption remain usable without sound. */ });
  if (config.kind.startsWith('menu-')) playMenuSurprise(entry, reduced);
  else if (['cow', 'bell', 'dog'].includes(config.kind)) animateOriginalSurprise(entry, reduced);
  else playEasterScene(entry, reduced);
  say(config.message);
  endLater(entry, config.duration || 4600);
}

let forkPreload;
function prepareFork() {
  if (!forkPreload) { forkPreload = new Image(); forkPreload.decoding = 'async'; forkPreload.src = import.meta.env.BASE_URL + 'assets/optimized/easter/fondue-fork-320.webp'; }
}

const images = document.querySelectorAll('.pc-cut > img, .dish__visual > img, .pc-guide-avatar > img, .cg__avatar > img, .pc-restaurant-lettering > img, .pc-postman > img');
images.forEach(image => {
  const filename = (image.dataset.originalSrc || image.getAttribute('src'))?.split('/').pop();
  const config = surprises[filename] || getMenuSurprise(image);
  if (!config || image.closest('a,button')) return;
  const wrapper = image.parentElement;
  const stanza = wrapper.closest('.pc-souvenir-stanza');
  wrapper.removeAttribute('aria-hidden');
  wrapper.classList.add('egg-cutout');
  if (stanza) {
    stanza.removeAttribute('aria-hidden');
    [...stanza.children].filter(child => child !== wrapper).forEach(child => child.setAttribute('aria-hidden', 'true'));
  }
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `egg-trigger egg-trigger--${config.kind}`;
  button.dataset.easterEgg = config.kind;
  button.setAttribute('aria-label', config.label);
  const visual = document.createElement('span');
  visual.className = 'egg-picture';
  visual.setAttribute('aria-hidden', 'true');
  image.classList.add('egg-original');
  // Inserting before the image preserves siblings, including the postman's service link.
  wrapper.insertBefore(button, image);
  visual.appendChild(image); button.appendChild(visual);
  let variant;
  if (config.variant) {
    variant = document.createElement('img');
    variant.alt = '';
    variant.width = image.width;
    variant.height = image.height;
    variant.loading = 'lazy';
    variant.decoding = 'async';
    variant.fetchPriority = 'low';
    variant.draggable = false;
    variant.className = `egg-variant${config.kind === 'dog' ? ' egg-dog-paw' : ''}`;
    visual.appendChild(variant);
    const warmImage = () => { variant.loading = 'eager'; if (!variant.getAttribute('src')) variant.src = config.variant; };
    button.addEventListener('pointerenter', warmImage, { once: true });
    button.addEventListener('focus', warmImage, { once: true });
  }
  if (config.kind === 'menu-cheese') {
    button.addEventListener('pointerenter', prepareFork, { once: true });
    button.addEventListener('focus', prepareFork, { once: true });
  }
  button.addEventListener('click', () => activate(button, wrapper, visual, config, variant));
});

// One scene at a time, no queued replay, and no sound continuing in the background.
document.addEventListener('keydown', event => { if (event.key === 'Escape') finishSurprise(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) finishSurprise(); });
document.addEventListener('click', event => { if (active && !event.target.closest('.egg-trigger')) finishSurprise(); });
document.addEventListener('toggle', () => { if (active && !active.button.getClientRects().length) finishSurprise(); }, true);
addEventListener('pagehide', finishSurprise);
addEventListener('resize', positionBubble, { passive: true });
let scrollFrame = 0;
addEventListener('scroll', () => {
  if (!active || scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => { scrollFrame = 0; positionBubble(); });
}, { passive: true });
motionQuery.addEventListener('change', finishSurprise);
