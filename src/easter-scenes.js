import './easter-scenes.css';

// Small graphic accompaniments to the real photographic cutouts.
// The owner of entry removes nodes and cancels every animation on interruption.
const svg = (body, viewBox = '0 0 64 64') => `<svg viewBox="${viewBox}" fill="none" aria-hidden="true" focusable="false">${body}</svg>`;
const star = svg('<path d="m32 3 7 20 22 9-22 8-7 21-8-21L3 32l21-9Z" fill="currentColor" stroke="#fffdf7" stroke-width="3"/>');
const cloud = svg('<path d="M16 43C-1 43-2 21 14 18 15 1 40-2 46 15c20-5 30 28 7 28Z" fill="#fffdf7" stroke="#b8c6bd" stroke-width="1.3"/>', '0 0 72 48');
const footprint = svg('<path d="M25 3c11-5 20 2 20 15v17c-1 10-9 13-18 10-7-3-9-10-8-18l1-13c0-5 1-9 5-11Z" fill="currentColor"/><path d="M22 51c6-3 14-2 19 2l-2 9H22Z" fill="currentColor"/><path d="m24 17 16 3m-17 9 17 3" stroke="#fffdf7" stroke-width="3"/>');
const glass = svg('<path d="M20 6h24l-2 19c-1 8-5 11-10 11s-9-3-10-11L20 6Z" fill="#fff7df" stroke="#8f672f" stroke-width="2.8"/><path d="M22 19h20l-1 7c-1 6-5 8-9 8s-8-2-9-8Z" fill="#dcb65c"/><path d="M32 36v20m-10 3h20" stroke="#8f672f" stroke-width="3" stroke-linecap="round"/>');
const snow = svg('<path d="M32 5v54M9 18l46 28M9 46l46-28m-23-13 5 6m-5-6-5 6m5 48 5-6m-5 6-5-6M9 18l8-1m-8 1 3 7m43 21-8 1m8-1-3-7M9 46l3-7m-3 7 8 1m38-29-8-1m8 1-3 7" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>');
const postcard = svg('<rect x="2" y="2" width="86" height="54" rx="2" fill="#fffdf7" stroke="#c6bba7" stroke-width="2"/><path d="M42 9v39M51 29h28m-28 7h28m-28 7h20" stroke="#b8c6bd" stroke-width="2"/><rect x="64" y="8" width="16" height="16" fill="#b92e2d"/><path d="M72 11v10m-5-5h10" stroke="#fffdf7" stroke-width="3"/><path d="m9 41 13-21 8 12 5-7 5 16Z" fill="#284d3b"/><path d="m18 27 4-7 5 8-5-2Z" fill="#fffdf7"/>', '0 0 90 58');
const stamp = svg('<circle cx="32" cy="32" r="27" stroke="currentColor" stroke-width="2" stroke-dasharray="2 2"/><circle cx="32" cy="32" r="21" stroke="currentColor" stroke-width="1.4"/><path d="M32 20v24M20 32h24" stroke="currentColor" stroke-width="6"/><path d="M5 8h18M41 56h18" stroke="currentColor" stroke-width="2"/>');
const fork = svg('<path d="M22 5v18m7-18v18m7-18v18M22 18v7c0 9 14 9 14 0v-7M29 33v26" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>');
const knife = svg('<path d="M32 5c-12 13-14 27-2 29h5V5h-3Zm3 29v25" fill="currentColor" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>');

export function playEasterScene(entry, reduced = false) {
  const kinds = ['cable', 'train', 'geranium', 'edelweiss', 'boots', 'sled', 'alphorn', 'friends', 'postman', 'lettering', 'concierge'];
  if (!kinds.includes(entry.config.kind)) return;
  const layer = document.createElement('span');
  layer.className = `egg-scene egg-scene--${entry.config.kind}`;
  layer.setAttribute('aria-hidden', 'true');
  entry.button.appendChild(layer);
  entry.nodes.push(layer);

  const part = (className, style = {}, content = '') => {
    const node = document.createElement('span');
    node.className = `egg-scene__piece ${className}`;
    Object.assign(node.style, style);
    if (content) node.innerHTML = content;
    layer.appendChild(node);
    return node;
  };
  const move = (target, keyframes, options = {}) => {
    if (reduced || typeof target.animate !== 'function') return;
    entry.animations.push(target.animate(keyframes, {
      duration: 1700, easing: 'cubic-bezier(.22,.7,.25,1)', fill: 'both', iterations: 1, ...options,
    }));
  };
  const visual = (frames, options) => move(entry.visual, frames.map(transform => ({ transform })), options);
  const reveal = (node, delay = 0) => move(node, [
    { opacity: 0, transform: 'scale(.45)' },
    { opacity: 1, transform: 'scale(1.1)', offset: .3 },
    { opacity: 1, transform: 'scale(1)' },
  ], { duration: 620, delay });

  switch (entry.config.kind) {
    case 'cable': {
      const line = part('egg-scene__cable');
      const puff = part('egg-scene__cloud', { left: '7%', top: '63%' }, cloud);
      const second = part('egg-scene__cloud egg-scene__cloud--small', { left: '65%', top: '29%' }, cloud);
      reveal(line);
      visual(['translate(0,0) rotate(0deg)', 'translate(5px,-25px) rotate(-5deg)', 'translate(-3px,-20px) rotate(3deg)', 'translate(0,0) rotate(0deg)'], { duration: 2200 });
      move(puff, [{ transform: 'translate(12px,0)', opacity: 0 }, { transform: 'translate(0,-5px)', opacity: .95, offset: .4 }, { transform: 'translate(-20px,2px)', opacity: 0 }], { duration: 2100 });
      move(second, [{ transform: 'translate(10px,0)', opacity: 0 }, { transform: 'translate(0,4px)', opacity: .9, offset: .5 }, { transform: 'translate(-14px,8px)', opacity: 0 }], { duration: 2000, delay: 170 });
      break;
    }
    case 'train': {
      const track = part('egg-scene__track');
      const ticket = part('egg-scene__ticket');
      const ticketText = document.createElement('span');
      ticketText.append(document.createTextNode('GRAND'), document.createElement('br'), document.createTextNode('AIR'));
      ticket.append(ticketText, document.createElement('i'));
      reveal(track);
      visual(['translateX(0)', 'translateX(7px) rotate(.6deg)', 'translateX(-22px) rotate(-.6deg)', 'translateX(0)'], { duration: 2000 });
      move(ticket, [{ transform: 'translate(15px,-8px) rotate(12deg) scale(.4)', opacity: 0 }, { transform: 'translate(0,0) rotate(-8deg) scale(1)', opacity: 1, offset: .38 }, { transform: 'translate(0,0) rotate(-8deg)', opacity: 1 }], { duration: 1600, delay: 180 });
      break;
    }
    case 'geranium': {
      visual(['rotate(0deg)', 'rotate(-5deg)', 'rotate(4deg)', 'rotate(-2deg)', 'rotate(0deg)'], { duration: 1050 });
      for (let i = 0; i < 8; i++) {
        const angle = i * Math.PI / 4;
        const x = Math.round(Math.cos(angle) * 32);
        const y = Math.round(Math.sin(angle) * 24) - 10;
        const petal = part('egg-scene__petal', { left: `${46 + Math.cos(angle) * 17}%`, top: `${30 + Math.sin(angle) * 14}%`, rotate: `${i * 43}deg` });
        move(petal, [{ opacity: 0, transform: 'translate(0,0) scale(.3)' }, { opacity: 1, transform: `translate(${x * .5}px,${y * .7}px) scale(1)`, offset: .42 }, { opacity: 0, transform: `translate(${x}px,${y + 25}px) scale(.6)` }], { duration: 1850, delay: i * 55 });
      }
      break;
    }
    case 'edelweiss': {
      visual(['scale(1) rotate(0deg)', 'scale(1.04) rotate(9deg)', 'scale(1) rotate(0deg)'], { duration: 1700 });
      const points = [[15, 20], [43, 5], [72, 22], [65, 65], [24, 70]];
      const constellation = part('egg-scene__constellation', {}, svg('<path d="m15 20 28-15 29 17-7 43-41 5-9-50" stroke="currentColor" stroke-width="1" stroke-dasharray="2 3"/>', '0 0 100 100'));
      reveal(constellation);
      points.forEach(([left, top], i) => {
        const spark = part('egg-scene__star', { left: `${left}%`, top: `${top}%` }, star);
        move(spark, [{ opacity: 0, transform: 'scale(.3) rotate(-30deg)' }, { opacity: 1, transform: 'scale(1.15) rotate(10deg)', offset: .5 }, { opacity: .8, transform: 'scale(.85) rotate(0deg)' }], { duration: 1000, delay: i * 120 });
      });
      break;
    }
    case 'boots': {
      visual(['translate(0,0) rotate(0deg)', 'translate(-6px,-6px) rotate(-5deg)', 'translate(7px,-3px) rotate(4deg)', 'translate(-3px,-5px) rotate(-3deg)', 'translate(0,0) rotate(0deg)'], { duration: 1650 });
      for (let i = 0; i < 4; i++) {
        const print = part('egg-scene__footprint', { left: `${14 + i * 18}%`, top: `${75 - (i % 2) * 13}%`, rotate: `${i % 2 ? -10 : 12}deg` }, footprint);
        move(print, [{ opacity: 0, transform: 'scale(1.4)' }, { opacity: .65, transform: 'scale(1)', offset: .3 }, { opacity: .4, transform: 'scale(1)' }], { duration: 1100, delay: i * 220 });
      }
      break;
    }
    case 'sled': {
      const trail = part('egg-scene__snow-track');
      reveal(trail);
      visual(['translate(0,0) rotate(0deg)', 'translate(-9px,-5px) rotate(-5deg)', 'translate(24px,12px) rotate(7deg)', 'translate(0,0) rotate(0deg)'], { duration: 2000 });
      for (let i = 0; i < 6; i++) {
        const flake = part('egg-scene__snowflake', { left: `${16 + i * 11}%`, top: `${61 + (i % 2) * 9}%` }, snow);
        move(flake, [{ opacity: 0, transform: 'translate(12px,0) scale(.3)' }, { opacity: 1, transform: `translate(${-i * 2}px,-14px) rotate(${i * 15}deg) scale(1)`, offset: .4 }, { opacity: 0, transform: `translate(${-12 - i * 3}px,8px) rotate(${i * 25}deg) scale(.6)` }], { duration: 1550, delay: i * 80 + 200 });
      }
      break;
    }
    case 'alphorn': {
      visual(['scale(1)', 'scale(1.02)', 'scale(1)'], { duration: 1800 });
      for (let i = 0; i < 3; i++) {
        const ring = part('egg-scene__sound-ring', { width: `${20 + i * 8}px`, height: `${28 + i * 9}px`, left: `${82 + i * 2}%`, top: `${65 - i * 3}%` });
        move(ring, [{ opacity: 0, transform: 'translateX(-5px) scale(.55)' }, { opacity: .9, transform: 'translateX(5px) scale(1)', offset: .35 }, { opacity: 0, transform: 'translateX(26px) scale(1.25)' }], { duration: 1550, delay: i * 230 });
      }
      break;
    }
    case 'friends': {
      const left = part('egg-scene__glass', { left: '36%', top: '8%', rotate: '-14deg' }, glass);
      const right = part('egg-scene__glass', { left: '53%', top: '8%', rotate: '14deg' }, glass);
      move(left, [{ transform: 'translate(-10px,8px)', opacity: 0 }, { transform: 'translate(6px,-5px) rotate(10deg)', opacity: 1, offset: .38 }, { transform: 'translate(0,0)', opacity: 1 }], { duration: 1600 });
      move(right, [{ transform: 'translate(10px,8px)', opacity: 0 }, { transform: 'translate(-6px,-5px) rotate(-10deg)', opacity: 1, offset: .38 }, { transform: 'translate(0,0)', opacity: 1 }], { duration: 1600 });
      const glint = part('egg-scene__star', { left: '48%', top: '2%' }, star);
      reveal(glint, 450);
      for (let i = 0; i < 3; i++) {
        const steam = part('egg-scene__steam', { left: `${43 + i * 6}%`, top: '38%' });
        move(steam, [{ opacity: 0, transform: 'translateY(8px) scaleY(.5)' }, { opacity: .8, transform: 'translateY(-7px) scaleY(1)', offset: .5 }, { opacity: 0, transform: 'translateY(-22px) scaleY(1.2)' }], { duration: 1700, delay: i * 180 });
      }
      break;
    }
    case 'postman': {
      const card = part('egg-scene__postcard', { left: '9%', top: '14%' }, postcard);
      const postmark = part('egg-scene__postmark', { left: '65%', top: '22%' }, stamp);
      move(card, [{ opacity: 0, transform: 'translate(32px,26px) rotate(15deg) scale(.35)' }, { opacity: 1, transform: 'translate(-8px,-13px) rotate(-12deg) scale(1)', offset: .55 }, { opacity: 1, transform: 'translate(0,0) rotate(-8deg)' }], { duration: 1900 });
      move(postmark, [{ opacity: 0, transform: 'scale(1.6) rotate(-15deg)' }, { opacity: .85, transform: 'scale(.95) rotate(-15deg)', offset: .3 }, { opacity: .7, transform: 'scale(1) rotate(-15deg)' }], { duration: 650, delay: 1100 });
      break;
    }
    case 'lettering': {
      const ribbon = part('egg-scene__vichy-ribbon');
      const left = part('egg-scene__cutlery', { left: '16%', top: '63%', rotate: '-12deg' }, fork);
      const right = part('egg-scene__cutlery', { left: '78%', top: '63%', rotate: '12deg' }, knife);
      move(ribbon, [{ transform: 'scaleX(0)', opacity: 0 }, { transform: 'scaleX(1.06)', opacity: 1, offset: .6 }, { transform: 'scaleX(1)', opacity: 1 }], { duration: 1100 });
      reveal(left, 170); reveal(right, 270);
      visual(['perspective(600px) rotateX(0deg)', 'perspective(600px) rotateX(-9deg) scaleY(.97)', 'perspective(600px) rotateX(3deg)', 'perspective(600px) rotateX(0deg)'], { duration: 1350 });
      break;
    }
    case 'concierge': {
      visual(['rotate(0deg)', 'rotate(-3deg)', 'rotate(0deg)'], { duration: 900 });
      const first = part('egg-scene__star', { left: '20%', top: '12%' }, star);
      const second = part('egg-scene__star egg-scene__star--small', { left: '67%', top: '21%' }, star);
      reveal(first, 160); reveal(second, 340);
      break;
    }
  }
}
