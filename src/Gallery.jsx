import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import './Gallery.css';

const PHOTOS = [
  { file: 'original-2.webp', caption: 'chalet' },
  { file: 'original-3.webp', caption: 'waterfall' },
  { file: 'original-1.webp', caption: 'cliff' },
  { file: 'original-4.webp', caption: 'terrace' },
];

const COPY = {
  fr: {
    title: 'Les photographies du lieu',
    close: 'Fermer la galerie',
    closeLabel: 'Fermer',
    previous: 'Photographie précédente',
    next: 'Photographie suivante',
    show: 'Voir la photographie',
    location: 'Lauterbrunnen, Suisse',
    count: (index) => `Photographie ${index + 1} sur ${PHOTOS.length}`,
    captions: {
      chalet: 'Le chalet, à la tombée du jour.',
      waterfall: 'La cascade et le chalet, dans la brume.',
      cliff: 'Au pied de la falaise.',
      terrace: 'La terrasse ouverte sur la vallée.',
    },
    alts: {
      chalet: 'Façade en bois et fenêtres éclairées de l’hôtel Schützen à la tombée du jour.',
      waterfall: 'La cascade de Lauterbrunnen sur la falaise, derrière le chalet de l’hôtel Schützen.',
      cliff: 'Le chalet de l’hôtel Schützen au pied de la grande falaise de Lauterbrunnen.',
      terrace: 'Tables de la terrasse de l’hôtel Schützen et vue sur les montagnes de la vallée.',
    },
  },
  en: {
    title: 'Photographs of the place',
    close: 'Close the gallery',
    closeLabel: 'Close',
    previous: 'Previous photograph',
    next: 'Next photograph',
    show: 'View photograph',
    location: 'Lauterbrunnen, Switzerland',
    count: (index) => `Photograph ${index + 1} of ${PHOTOS.length}`,
    captions: {
      chalet: 'The chalet, as evening falls.',
      waterfall: 'The waterfall and the chalet, in the mist.',
      cliff: 'At the foot of the cliff.',
      terrace: 'The terrace overlooking the valley.',
    },
    alts: {
      chalet: 'The wooden façade and illuminated windows of Hotel Schützen at dusk.',
      waterfall: 'The Lauterbrunnen waterfall falling from the cliff behind Hotel Schützen.',
      cliff: 'The chalet of Hotel Schützen at the foot of the tall Lauterbrunnen cliff.',
      terrace: 'Tables on the Hotel Schützen terrace with mountain views across the valley.',
    },
  },
  de: {
    title: 'Bilder dieses Ortes',
    close: 'Galerie schließen',
    closeLabel: 'Schließen',
    previous: 'Vorheriges Foto',
    next: 'Nächstes Foto',
    show: 'Foto ansehen',
    location: 'Lauterbrunnen, Schweiz',
    count: (index) => `Foto ${index + 1} von ${PHOTOS.length}`,
    captions: {
      chalet: 'Das Chalet in der Abenddämmerung.',
      waterfall: 'Wasserfall und Chalet im Nebel.',
      cliff: 'Am Fuß der Felswand.',
      terrace: 'Die Terrasse mit Blick ins Tal.',
    },
    alts: {
      chalet: 'Holzfassade und beleuchtete Fenster des Hotels Schützen in der Abenddämmerung.',
      waterfall: 'Der Lauterbrunner Wasserfall an der Felswand hinter dem Hotel Schützen.',
      cliff: 'Das Chalet des Hotels Schützen am Fuß der hohen Lauterbrunner Felswand.',
      terrace: 'Tische auf der Terrasse des Hotels Schützen mit Blick auf die Berge im Tal.',
    },
  },
};

const wrapIndex = (index) => ((index % PHOTOS.length) + PHOTOS.length) % PHOTOS.length;

export default function Gallery({ open, onClose, lang = 'fr', initialIndex = 0 }) {
  const [index, setIndex] = useState(() => wrapIndex(initialIndex));
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const closeRef = useRef(onClose);
  const reduceMotion = useReducedMotion();
  const copy = COPY[lang] || COPY.fr;
  const photo = PHOTOS[index];

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;

    setIndex(wrapIndex(initialIndex));
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      const currentPadding = Number.parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;
      document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';
    const focusFrame = requestAnimationFrame(() => closeButtonRef.current?.focus({ preventScroll: true }));

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        closeRef.current?.();
        return;
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        setIndex((current) => wrapIndex(current + (event.key === 'ArrowRight' ? 1 : -1)));
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = Array.from(dialogRef.current?.querySelectorAll(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) || []).filter((element) => element.getClientRects().length > 0);
      if (!focusable.length) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const currentFocus = document.activeElement;
      if (event.shiftKey && (currentFocus === first || !dialogRef.current?.contains(currentFocus))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (currentFocus === last || !dialogRef.current?.contains(currentFocus))) {
        event.preventDefault();
        first.focus();
      }
    };

    const onFocusIn = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        closeButtonRef.current?.focus({ preventScroll: true });
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('focusin', onFocusIn);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [open, initialIndex]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="hotel-gallery"
          ref={dialogRef}
          className="gallery-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gallery-title"
          tabIndex={-1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.25 }}
        >
          <header className="gallery-header">
            <div className="gallery-brand">
              <span className="gallery-brand-name">Schützen</span>
              <span className="gallery-brand-place">Lauterbrunnen</span>
            </div>
            <h2 id="gallery-title" className="gallery-title">{copy.title}</h2>
            <button
              type="button"
              ref={closeButtonRef}
              className="gallery-close"
              onClick={onClose}
              aria-label={copy.close}
            >
              <span>{copy.closeLabel}</span>
              <X size={21} strokeWidth={1.3} aria-hidden="true" />
            </button>
          </header>

          <div className="gallery-stage">
            <span className="gallery-stage-index" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}<span> / 04</span>
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                className="gallery-figure"
                key={photo.file}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
                transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
              >
                <img
                  className="gallery-image"
                  src={`/assets/${photo.file}`}
                  alt={copy.alts[photo.caption]}
                  decoding="async"
                  draggable="false"
                />
              </motion.figure>
            </AnimatePresence>
            <button
              type="button"
              className="gallery-arrow gallery-arrow-previous"
              onClick={() => setIndex((current) => wrapIndex(current - 1))}
              aria-label={copy.previous}
            >
              <ArrowLeft size={23} strokeWidth={1.25} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="gallery-arrow gallery-arrow-next"
              onClick={() => setIndex((current) => wrapIndex(current + 1))}
              aria-label={copy.next}
            >
              <ArrowRight size={23} strokeWidth={1.25} aria-hidden="true" />
            </button>
          </div>

          <footer className="gallery-footer">
            <div className="gallery-caption" aria-live="polite" aria-atomic="true">
              <span className="gallery-location">{copy.location}</span>
              <p>{copy.captions[photo.caption]}</p>
              <span className="gallery-sr-only">{copy.count(index)}</span>
            </div>
            <nav className="gallery-thumbnails" aria-label={copy.title}>
              {PHOTOS.map((item, itemIndex) => (
                <button
                  type="button"
                  className={`gallery-thumbnail${itemIndex === index ? ' gallery-thumbnail-active' : ''}`}
                  key={item.file}
                  aria-label={`${copy.show} ${itemIndex + 1} : ${copy.captions[item.caption]}`}
                  aria-pressed={itemIndex === index}
                  onClick={() => setIndex(itemIndex)}
                >
                  <img src={`/assets/${item.file}`} alt="" loading="lazy" draggable="false" />
                </button>
              ))}
            </nav>
            <span className="gallery-footer-count" aria-hidden="true">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <span className="gallery-count-line" />
              <span>04</span>
            </span>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
