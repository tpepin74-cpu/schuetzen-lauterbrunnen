import { animate, scroll } from 'framer-motion/dom';
import './postcard.css';
import './stay-experience.css';
import './guide.css';
import './readability.css';
import './menu-gallery.css';
import './site-credit.css';
import './header-shield.css';
import './localization.css';
import './easter-eggs.js';
import './experience.js';

// Native HTML carries all content. Motion only moves decorative paper cutouts.
const reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');
const queryReduced = new URLSearchParams(location.search).get('motion') === 'reduce';
let cleanups = [];

function setupPaperMotion() {
  cleanups.forEach(cancel => cancel());
  cleanups = [];
  const reduced = queryReduced || reduceQuery.matches;
  document.documentElement.dataset.reduced = String(reduced);
  document.querySelectorAll('[data-paper]').forEach(el => {
    el.style.removeProperty('transform');
    if (reduced) return;
    const section = el.closest('section') || el.parentElement;
    const base = getComputedStyle(el).transform;
    const y = Number(el.dataset.paperY || -35);
    const rotation = Number(el.dataset.paperRotate || 4);
    const mobile = matchMedia('(max-width: 760px)').matches;
    const distance = mobile ? y * .5 : y;
    const animation = animate(el, {
      transform: [
        `${base === 'none' ? '' : base} translateY(${distance * -.4}px) rotate(${-rotation * .3}deg)`,
        `${base === 'none' ? '' : base} translateY(${distance}px) rotate(${rotation * .6}deg)`
      ]
    }, { duration: 1, ease: 'linear', autoplay: false });
    const cancel = scroll(animation, { target: section, offset: ['start end', 'end start'] });
    cleanups.push(() => { cancel(); animation.cancel(); el.style.removeProperty('transform'); });
  });
}

setupPaperMotion();
reduceQuery.addEventListener('change', setupPaperMotion);
// Smooth only intentional anchor clicks; focus and validation scroll immediately.
document.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest('a[href^="#"]');
  if (!link || link.classList.contains('skip') || link.hasAttribute('data-anchor') || link.hasAttribute('data-anchor-top')) return;
  const id = link.getAttribute('href').slice(1);
  const target = id && document.getElementById(decodeURIComponent(id));
  if (!target) return;
  event.preventDefault();
  const barHeight = document.querySelector('[data-top]')?.offsetHeight || 0;
  const shieldHeight = parseFloat(getComputedStyle(document.body).getPropertyValue('--shield-compact-height')) || 0;
  const top = Math.max(barHeight, shieldHeight + 8);
  const sections = document.querySelector('[data-anchors]')?.offsetHeight || 0;
  window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - top - sections - 12), behavior: document.documentElement.dataset.reduced === 'true' ? 'auto' : 'smooth' });
  history.replaceState(null, '', `#${id}`);
});
addEventListener('pagehide', () => cleanups.forEach(cancel => cancel()));
addEventListener('pageshow', e => { if (e.persisted) setupPaperMotion(); });
