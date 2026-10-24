import menuPhotos from './menu-photos.json';
import './menu-easter-eggs.css';

// Photo-only surprises. The menu's names, descriptions, prices and tabs stay native.
const groups = {
  cheese: ['fondue', 'raclette', 'macaronis'],
  fresh: ['salad-bowl', 'caprese', 'salade-berger', 'salade-poulet', 'wrap-vegetarien', 'wrap-poulet'],
  hot: ['soupe-patate-douce', 'frites', 'rosti-paysan', 'rosti-casimir', 'rosti-legumes', 'bratwurst', 'pierre-chaude', 'schnitzel', 'perche', 'saumon-grille', 'nuggets-poulet', 'nuggets-poisson'],
  burger: ['hamburger', 'cheeseburger', 'burger-paysan', 'chickenburger', 'burger-vegetal'],
  tarte: ['tarte-classique', 'tarte-vegetarienne', 'tarte-saumon'],
  bubbles: ['eau-staubbach', 'sirop', 'lager', 'weizen', 'cidre'],
  frost: ['the-froid', 'iced-coffees'],
  toast: ['vin-blanc', 'vin-rose', 'vin-rouge', 'aperitifs', 'vieille-prune', 'eaux-de-vie'],
  warm: ['chocolat-chaud', 'cafes', 'cafes-liqueur'],
};
const messages = {
  'soupe-patate-douce': 'Un petit nuage dans le bol.',
  'salad-bowl': 'Les feuilles prennent le large !',
  caprese: 'Le basilic fait son numéro.',
  'salade-berger': 'Le berger a semé de la bonne humeur.',
  'salade-poulet': 'Une salade qui bat des feuilles.',
  frites: 'Crousti-clic !',
  fondue: 'Qui a perdu son pain ?',
  raclette: 'Le fromage prend ses aises.',
  'rosti-paysan': 'Le rösti fait sa révérence.',
  'rosti-casimir': 'Casimir chauffe la piste !',
  'rosti-legumes': 'Les légumes ont le rösti dans la peau.',
  bratwurst: 'La pause qui fait « mmmh ».',
  macaronis: 'Le fil rouge ? Le fromage.',
  'pierre-chaude': 'Chaud devant, sommets derrière !',
  schnitzel: 'Un petit pas de pané.',
  perche: 'La perche fait des vagues.',
  'saumon-grille': 'Le saumon remonte à table.',
  hamburger: 'Le burger a du ressort.',
  cheeseburger: 'Sésame, ouvre-toi !',
  'burger-paysan': 'Un étage de bonheur en plus.',
  chickenburger: 'Ce poulet sait rebondir.',
  'burger-vegetal': 'Le potager fait son grand saut.',
  'tarte-classique': 'Une petite valse alsacienne.',
  'tarte-vegetarienne': 'La roquette entre en piste.',
  'tarte-saumon': 'Le saumon mène la danse.',
  'wrap-vegetarien': 'Le jardin s’est fait un câlin.',
  'wrap-poulet': 'Bien roulé, bien joué !',
  'nuggets-poulet': 'La jungle a rendez-vous à table.',
  'nuggets-poisson': 'Petits poissons, grande aventure.',
  'eau-staubbach': 'La cascade fait une pause.',
  'the-froid': 'Le thé a mis ses glaçons.',
  sirop: 'Un petit plouf de couleur !',
  lager: 'Les bulles prennent de l’altitude.',
  weizen: 'Un petit nuage de mousse.',
  cidre: 'La pomme a le cœur pétillant.',
  'vin-blanc': 'À vos Alpes !',
  'vin-rose': 'La vie voit les Alpes en rose.',
  'vin-rouge': 'On trinque aux beaux détours.',
  aperitifs: 'Tchin, tchin, les voisins !',
  'vieille-prune': 'La prune fait son petit salut.',
  'eaux-de-vie': 'Les fruits lèvent leur verre.',
  'chocolat-chaud': 'Un câlin qui se boit.',
  cafes: 'Le café a le cœur chaud.',
  'cafes-liqueur': 'Le café s’est mis sur son trente-et-un.',
  'iced-coffees': 'Le café part aux sports d’hiver.',
};
const actions = {
  cheese: 'Étirer le fromage', fresh: 'Faire danser les feuilles', hot: 'Faire apparaître un nuage gourmand',
  burger: 'Faire rebondir le burger', tarte: 'Faire valser la tarte', bubbles: 'Faire pétiller la photo',
  frost: 'Faire danser les glaçons', toast: 'Trinquer avec la photo', warm: 'Faire apparaître un cœur de vapeur',
};
const photoIndex = new Map(menuPhotos.map(photo => [photo.image, photo]));
const groupIndex = new Map(Object.entries(groups).flatMap(([group, ids]) => ids.map(id => [id, group])));

export function getMenuSurprise(image) {
  const source = image.dataset.originalSrc || image.getAttribute('src') || '';
  // Accept a same-page absolute URL as well as the manifest's root-relative paths.
  const path = source.startsWith('/') ? source : source.replace(/^https?:\/\/[^/]+/, '');
  const photo = photoIndex.get(path);
  const group = photo && groupIndex.get(photo.id);
  if (!group) return null;
  return {
    kind: `menu-${group}`, menuId: photo.id,
    label: `${actions[group]} : ${window.SCH_I18N?.t(photo.name) || photo.name}`,
    stop: `Arrêter la surprise : ${window.SCH_I18N?.t(photo.name) || photo.name}`,
    message: messages[photo.id], duration: 3900,
    ...(group === 'toast' ? { audioKind: 'toast' } : {}),
  };
}

function element(tag, className, parent) {
  const node = document.createElement(tag);
  node.className = className;
  parent.appendChild(node);
  return node;
}
function drawing(className, paths, parent, viewBox = '0 0 60 60') {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('class', className);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  paths.forEach(data => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', data);
    svg.appendChild(path);
  });
  parent.appendChild(svg);
  return svg;
}
function move(entry, node, keyframes, options = {}, reduced = false) {
  if (reduced || !node.animate) return;
  entry.animations.push(node.animate(keyframes, {
    duration: 1600, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'both', ...options,
  }));
}
function burst(entry, layer, shape, count, reduced) {
  for (let i = 0; i < count; i++) {
    const item = element('span', `menu-egg-bit menu-egg-bit--${shape}`, layer);
    const x = Math.cos((i / count) * Math.PI * 2) * (28 + i % 3 * 5);
    const y = Math.sin((i / count) * Math.PI * 2) * 28 - 18;
    item.style.setProperty('--bit-angle', `${i * 37}deg`);
    if (reduced) {
      item.style.left = `${50 + x / 2}%`;
      item.style.top = `${54 + y / 2}%`;
      item.style.opacity = '.75';
    } else {
      move(entry, item, [
        { transform: 'translate(-50%, -50%) scale(.2)', opacity: 0 },
        { offset: .25, opacity: 1 },
        { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${i * 37}deg) scale(1)`, opacity: .95, offset: .7 },
        { transform: `translate(calc(-50% + ${x * 1.12}px), calc(-50% + ${y + 16}px)) rotate(${i * 52}deg) scale(.6)`, opacity: 0 },
      ], { duration: 1750, delay: i * 45 }, reduced);
    }
  }
}
function steam(entry, layer, reduced, withHeart = false) {
  for (let i = 0; i < 3; i++) {
    const curl = drawing('menu-egg-steam', ['M14 54 C-1 41 31 32 15 18 C6 10 15 5 17 2'], layer, '0 0 30 60');
    curl.style.left = `${35 + i * 13}%`;
    move(entry, curl, [
      { transform: 'translateY(13px) scaleY(.65)', opacity: 0 },
      { offset: .3, opacity: .85 },
      { transform: 'translateY(-28px) scaleY(1.15)', opacity: 0 },
    ], { duration: 1800, delay: i * 170 }, reduced);
  }
  if (withHeart) {
    const heart = drawing('menu-egg-steam-heart', ['M30 48 C22 40 7 31 7 20 C7 6 24 5 30 17 C36 5 53 6 53 20 C53 31 38 40 30 48Z'], layer);
    move(entry, heart, [
      { transform: 'translate(-50%, 12px) scale(.3)', opacity: 0 },
      { offset: .45, transform: 'translate(-50%, -6px) scale(1)', opacity: .92 },
      { transform: 'translate(-50%, -24px) scale(1.12)', opacity: 0 },
    ], { duration: 2300, delay: 200 }, reduced);
  }
}
function cheese(entry, layer, reduced) {
  const threads = drawing('menu-egg-cheese', ['M47 68 C48 58 49 41 53 28', 'M49 68 C52 57 53 43 54 28'], layer, '0 0 100 100');
  const fork = element('span', 'menu-egg-fork', layer);
  move(entry, threads, [
    { transform: 'scaleY(.04)', opacity: 0 },
    { offset: .2, transform: 'scaleY(.08)', opacity: 1 },
    { offset: .62, transform: 'scaleY(1)', opacity: 1 },
    { offset: .82, transform: 'scaleY(1.05)', opacity: .95 },
    { transform: 'scaleY(.02)', opacity: 0 },
  ], { duration: 2600 }, reduced);
  move(entry, fork, [
    { transform: 'translate(9px, -12px) rotate(8deg)', opacity: 0 },
    { offset: .2, transform: 'translate(0, 12px) rotate(-4deg)', opacity: 1 },
    { offset: .62, transform: 'translate(8px, -34px) rotate(3deg)', opacity: 1 },
    { offset: .82, transform: 'translate(8px, -34px) rotate(3deg)', opacity: 1 },
    { transform: 'translate(18px, -44px) rotate(7deg)', opacity: 0 },
  ], { duration: 2600 }, reduced);
}
function bubbles(entry, layer, reduced) {
  for (let i = 0; i < 10; i++) {
    const bubble = element('span', 'menu-egg-bubble', layer);
    bubble.style.left = `${29 + (i * 13 % 43)}%`;
    bubble.style.top = `${40 + i % 3 * 10}%`;
    bubble.style.width = bubble.style.height = `${5 + i % 4 * 2}px`;
    move(entry, bubble, [
      { transform: 'translateY(20px) scale(.5)', opacity: 0 },
      { offset: .25, opacity: 1 },
      { transform: `translate(${i % 2 ? 6 : -6}px, -37px) scale(1.1)`, opacity: 0 },
    ], { duration: 1450 + i % 3 * 160, delay: i * 65 }, reduced);
  }
}
function toast(entry, layer, reduced) {
  for (const side of [-1, 1]) {
    const glass = drawing('menu-egg-glass', ['M14 6 H42 L39 23 C37 35 19 35 17 23Z', 'M28 33 V49 M17 51 H39'], layer);
    glass.style.left = `${50 + side * 10}%`;
    glass.style.transform = `translateX(-50%) rotate(${side * -14}deg)`;
    move(entry, glass, [
      { transform: `translateX(-50%) translateY(9px) rotate(${side * -22}deg)`, opacity: 0 },
      { offset: .35, transform: `translateX(calc(-50% + ${side * -8}px)) translateY(-3px) rotate(${side * 9}deg)`, opacity: 1 },
      { offset: .55, transform: `translateX(calc(-50% + ${side * -8}px)) translateY(-3px) rotate(${side * 9}deg)`, opacity: 1 },
      { transform: `translateX(-50%) translateY(4px) rotate(${side * -14}deg)`, opacity: 0 },
    ], { duration: 1700 }, reduced);
  }
  const spark = element('span', 'menu-egg-clink', layer);
  move(entry, spark, [{ opacity: 0, transform: 'scale(.2)' }, { opacity: 1, transform: 'scale(1)', offset: .35 }, { opacity: 0, transform: 'scale(1.5)' }], { duration: 700, delay: 450 }, reduced);
}

export function playMenuSurprise(entry, reduced = false) {
  const group = entry.config.kind.replace(/^menu-/, '');
  if (!Object.hasOwn(groups, group)) return;
  const layer = element('span', `menu-egg-layer menu-egg-layer--${group}`, entry.button);
  layer.setAttribute('aria-hidden', 'true');
  entry.nodes.push(layer);
  switch (group) {
    case 'cheese': cheese(entry, layer, reduced); break;
    case 'fresh':
      burst(entry, layer, 'leaf', 8, reduced);
      move(entry, entry.visual, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-5deg)', offset: .3 }, { transform: 'rotate(4deg)', offset: .6 }, { transform: 'rotate(0deg)' }], { duration: 1200 }, reduced);
      break;
    case 'hot':
      steam(entry, layer, reduced);
      move(entry, entry.visual, [{ transform: 'scale(1)' }, { transform: 'translateY(-4px) scale(1.025)', offset: .4 }, { transform: 'scale(1)' }], { duration: 1100 }, reduced);
      break;
    case 'burger':
      burst(entry, layer, 'seed', 10, reduced);
      move(entry, entry.visual, [{ transform: 'scale(1)' }, { transform: 'scale(1.06,.86)', offset: .22 }, { transform: 'translateY(-10px) scale(.96,1.06)', offset: .48 }, { transform: 'scale(1.025,.96)', offset: .72 }, { transform: 'scale(1)' }], { duration: 1100 }, reduced);
      break;
    case 'tarte':
      burst(entry, layer, 'herb', 6, reduced);
      move(entry, entry.visual, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-12deg) scale(.95)', offset: .18 }, { transform: 'rotate(84deg) scale(.84)', offset: .5 }, { transform: 'rotate(-3deg) scale(.97)', offset: .85 }, { transform: 'rotate(0deg)' }], { duration: 1800 }, reduced);
      break;
    case 'bubbles': bubbles(entry, layer, reduced); break;
    case 'frost':
      burst(entry, layer, 'ice', 6, reduced);
      move(entry, entry.visual, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-3deg)', offset: .25 }, { transform: 'rotate(3deg)', offset: .55 }, { transform: 'rotate(0deg)' }], { duration: 1400 }, reduced);
      break;
    case 'toast': toast(entry, layer, reduced); break;
    case 'warm': steam(entry, layer, reduced, true); break;
  }
}
