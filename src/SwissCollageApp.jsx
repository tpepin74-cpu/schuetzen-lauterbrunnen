import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig, motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowDown, ArrowRight, ArrowUpRight, Images, MapPin, X } from 'lucide-react';
import Gallery from './Gallery';
import './swiss-collage.css';

const BOOKING = 'https://www.booking.com/hotel/ch/restaurant-schutzen-ag.html';
const COPY = {
  fr: {
    discover: 'Découvrir', table: 'À table', photos: 'Le lieu en photos', reserve: 'Réserver',
    reserveLabel: 'Réserver un séjour sur Booking.com, nouvel onglet', bookingContext: 'Booking.com, nouvel onglet', language: 'Choisir la langue',
    heroAlt: 'Le chalet Schützen, sa façade en bois et son escalier au bord de la rue à Lauterbrunnen.',
    cardAlts: ['Façade du chalet Schützen à la tombée du jour.', 'Composition photographique d’une fondue suisse sur une table de terrasse.', 'La terrasse fleurie du Schützen ouverte sur la vallée.'],
    eyebrow: 'UN PETIT AIR DE FÊTE', title: ['La Suisse,', 'à savourer.'],
    intro: 'Un chalet à Lauterbrunnen. Des tablées généreuses. Et les Alpes tout autour.',
    explore: 'Feuilleter le carnet', location: 'Lauterbrunnen, Suisse', heroCaption: 'Notre petit coin de Suisse.',
    note: 'On est bien, ici.', dog: 'Grüezi, vous !', stamp: ['ALPES', '& BONHEUR'],
    ribbon: ['UN CHALET', 'DE GRANDES TABLÉES', 'LES ALPES TOUT AUTOUR'],
    catalogue: 'LE CARNET DE DÉCOUVERTE', catalogueTitle: ['À chaque envie,', 'son petit bonheur.'],
    catalogueBody: 'Posez les valises. Choisissez la suite.',
    cards: [
      { label: 'POSER SES VALISES', title: 'La vie de chalet.', body: 'Du bois, du caractère et un décor qu’on n’oublie pas.', action: 'Découvrir le lieu' },
      { label: 'PRENDRE SON TEMPS', title: 'Tous à table !', body: 'Du fromage qui file et des moments qui rapprochent.', action: 'Partager le moment' },
      { label: 'PRENDRE LE GRAND AIR', title: 'Les Alpes, en grand.', body: 'Lever les yeux. Respirer. Se sentir déjà en vacances.', action: 'Voir les alentours' },
    ],
    fondueEyebrow: 'LES BONNES CHOSES SE PARTAGENT', fondueTitle: ['La recette', 'du bonheur.'],
    fondueBody: 'Une table. Des amis. Le plaisir de prendre son temps. Il n’en faut parfois pas plus.',
    fondueNote: ['Encore', 'une bouchée ?'], fondueSticker: 'BON APPÉTIT !',
    footerEyebrow: 'ON GARDE UNE PLACE POUR VOUS ?', footerTitle: 'À bientôt, au Schützen.',
    footerCta: 'Préparer mon séjour', originals: 'Les 4 photos originales', about: 'À propos du collage',
    previous: 'La version précédente', close: 'Fermer',
    aboutTitle: 'Un carnet suisse, composé avec soin.',
    aboutBody: 'Les photos du chalet et de la vallée sont les photographies originales du lieu. Les animaux, les géraniums, le téléphérique et la tablée sont des créations photographiques détourées pour ce collage. Ils évoquent l’esprit suisse et les fêtes ; ils ne présentent pas les animaux, les clients ou les prestations actuels de l’hôtel.',
    skip: 'Aller au carnet de découverte',
  },
  en: {
    discover: 'Discover', table: 'At the table', photos: 'The place in pictures', reserve: 'Reserve',
    reserveLabel: 'Reserve a stay on Booking.com, new tab', bookingContext: 'Booking.com, new tab', language: 'Choose your language',
    heroAlt: 'The wooden Schützen chalet and its steps beside the street in Lauterbrunnen.',
    cardAlts: ['The façade of the Schützen chalet at dusk.', 'A photographic composition of Swiss fondue on a terrace table.', 'The flower-filled Schützen terrace overlooking the valley.'],
    eyebrow: 'A LITTLE FESTIVE SPIRIT', title: ['Switzerland,', 'to savour.'],
    intro: 'A chalet in Lauterbrunnen. Good company around the table. And the Alps all around.',
    explore: 'Open the scrapbook', location: 'Lauterbrunnen, Switzerland', heroCaption: 'Our little corner of Switzerland.',
    note: 'Feels good to be here.', dog: 'Grüezi, hello!', stamp: ['ALPS', '& JOY'],
    ribbon: ['A CHALET', 'GOOD COMPANY', 'THE ALPS ALL AROUND'],
    catalogue: 'THE DISCOVERY SCRAPBOOK', catalogueTitle: ['A little happiness,', 'your way.'],
    catalogueBody: 'Put down your bags. Pick your next moment.',
    cards: [
      { label: 'MAKE YOURSELF AT HOME', title: 'Chalet life.', body: 'Wood, character and a setting you will remember.', action: 'Discover the place' },
      { label: 'TAKE YOUR TIME', title: 'Everyone to the table!', body: 'Melting cheese and moments that bring us together.', action: 'Share the moment' },
      { label: 'STEP OUTSIDE', title: 'The great Alps.', body: 'Look up. Breathe. You are already on holiday.', action: 'See the surroundings' },
    ],
    fondueEyebrow: 'GOOD THINGS ARE MEANT TO BE SHARED', fondueTitle: ['The recipe', 'for happiness.'],
    fondueBody: 'A table. A few friends. Time to enjoy it all. Sometimes, that is all it takes.',
    fondueNote: ['One more', 'bite?'], fondueSticker: 'BON APPÉTIT!',
    footerEyebrow: 'SHALL WE SAVE YOU A PLACE?', footerTitle: 'See you at Schützen.',
    footerCta: 'Plan my stay', originals: 'The 4 original photographs', about: 'About this collage',
    previous: 'The previous version', close: 'Close', aboutTitle: 'A Swiss scrapbook, thoughtfully composed.',
    aboutBody: 'The chalet and valley photographs are the original images of the place. The animals, geraniums, cable car and group around the table are generated photographic cutouts created for this collage. They evoke Switzerland and the festive season; they do not depict the hotel’s current animals, guests or services.',
    skip: 'Skip to the discovery scrapbook',
  },
  de: {
    discover: 'Entdecken', table: 'Zu Tisch', photos: 'Der Ort in Bildern', reserve: 'Buchen',
    reserveLabel: 'Aufenthalt auf Booking.com buchen, neuer Tab', bookingContext: 'Booking.com, neuer Tab', language: 'Sprache wählen',
    heroAlt: 'Das Holzchalet Schützen mit seiner Treppe am Strassenrand in Lauterbrunnen.',
    cardAlts: ['Die Fassade des Chalets Schützen in der Abenddämmerung.', 'Eine fotografische Komposition mit Schweizer Fondue auf einem Terrassentisch.', 'Die blumengeschmückte Terrasse des Schützen mit Blick ins Tal.'],
    eyebrow: 'EIN HAUCH VON FESTTAGSFREUDE', title: ['Die Schweiz,', 'zum Geniessen.'],
    intro: 'Ein Chalet in Lauterbrunnen. Gesellige Runden am Tisch. Und die Alpen ringsum.',
    explore: 'Im Reisealbum blättern', location: 'Lauterbrunnen, Schweiz', heroCaption: 'Unser kleines Stück Schweiz.',
    note: 'Hier ist es schön.', dog: 'Grüezi mitenand!', stamp: ['ALPEN', '& GLÜCK'],
    ribbon: ['EIN CHALET', 'GESELLIGE RUNDEN', 'DIE ALPEN RINGSUM'],
    catalogue: 'DAS ENTDECKER-ALBUM', catalogueTitle: ['Für jeden Wunsch', 'ein kleines Glück.'],
    catalogueBody: 'Koffer abstellen. Den nächsten Moment wählen.',
    cards: [
      { label: 'SICH ZU HAUSE FÜHLEN', title: 'Das Chaletleben.', body: 'Holz, Charakter und eine Kulisse, die bleibt.', action: 'Den Ort entdecken' },
      { label: 'SICH ZEIT NEHMEN', title: 'Alle zu Tisch!', body: 'Schmelzender Käse und Momente, die verbinden.', action: 'Den Moment teilen' },
      { label: 'HINAUS INS FREIE', title: 'Die grossen Alpen.', body: 'Aufschauen. Durchatmen. Schon in den Ferien sein.', action: 'Die Umgebung ansehen' },
    ],
    fondueEyebrow: 'GUTE DINGE TEILT MAN GERN', fondueTitle: ['Das Rezept', 'zum Glück.'],
    fondueBody: 'Ein Tisch. Gute Freunde. Zeit zum Geniessen. Manchmal braucht es gar nicht mehr.',
    fondueNote: ['Noch', 'ein Bissen?'], fondueSticker: 'EN GUETE!',
    footerEyebrow: 'HALTEN WIR IHNEN EINEN PLATZ FREI?', footerTitle: 'Bis bald im Schützen.',
    footerCta: 'Meinen Aufenthalt planen', originals: 'Die 4 Originalfotos', about: 'Über die Collage',
    previous: 'Die vorherige Version', close: 'Schliessen', aboutTitle: 'Ein Schweizer Album, mit Sorgfalt gestaltet.',
    aboutBody: 'Die Bilder des Chalets und des Tals sind die Originalfotos des Ortes. Tiere, Geranien, Seilbahn und Tischrunde sind fotografische Freisteller, die für diese Collage generiert wurden. Sie vermitteln Schweizer Lebensgefühl und Festtagsstimmung, zeigen jedoch keine aktuellen Tiere, Gäste oder Angebote des Hotels.',
    skip: 'Zum Entdecker-Album',
  },
};

function SwissCross({ className = '' }) {
  return <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M12 4h8v8h8v8h-8v8h-8v-8H4v-8h8V4Z" fill="currentColor" /></svg>;
}

function PaperStar({ className = '' }) {
  return <svg className={`sc-paper-star ${className}`} viewBox="0 0 100 100" aria-hidden="true"><path d="m50 3 10 31 29-16-17 30 25 12-33 6 5 30-20-24-23 21 8-31-31-9 32-9L20 16l27 17Z" fill="currentColor" /></svg>;
}

function Cutout({ src, className, style, eager = false }) {
  return <motion.img className={`sc-cutout ${className || ''}`} src={`/assets/collage/${src}.webp`} alt="" aria-hidden="true" draggable="false" loading={eager ? 'eager' : 'lazy'} decoding="async" style={style} />;
}

function BookLink({ copy, className = '', children }) {
  return <a className={`sc-button ${className}`} href={BOOKING} target="_blank" rel="noopener noreferrer" aria-label={`${children || copy.reserve} — ${copy.bookingContext}`}>{children || copy.reserve}<ArrowUpRight size={18} aria-hidden="true" /></a>;
}

function Hero({ copy, reduced, onGallery }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: .35 });
  const photoRotate = useTransform(progress, [0, 1], [3, -3]);
  const photoY = useTransform(progress, [0, 1], [0, -45]);
  const dogY = useTransform(progress, [0, .6, 1], [24, -48, -28]);
  const dogRotate = useTransform(progress, [0, 1], [-8, 3]);
  const flowersY = useTransform(progress, [0, 1], [0, -85]);
  const cabinX = useTransform(progress, [0, 1], [0, -105]);
  const cabinY = useTransform(progress, [0, 1], [0, 42]);
  const cabinRotate = useTransform(progress, [0, .5, 1], [6, -5, 4]);
  return <section ref={ref} className="sc-hero" id="accueil" aria-labelledby="hero-title">
    <div className="sc-hero-copy">
      <p className="sc-eyebrow"><SwissCross />{copy.eyebrow}</p>
      <h1 id="hero-title">{copy.title[0]}<span>{copy.title[1]}</span></h1>
      <p className="sc-hero-intro">{copy.intro}</p>
      <div className="sc-hero-actions"><a className="sc-button" href="#decouvrir">{copy.explore}<ArrowDown size={17} aria-hidden="true" /></a><button className="sc-text-button" onClick={() => onGallery(2)}>{copy.photos}<Images size={17} aria-hidden="true" /></button></div>
      <div className="sc-location"><MapPin size={15} aria-hidden="true" /><span>{copy.location}</span><span className="sc-location-rule" /></div>
    </div>
    <div className="sc-hero-collage">
      <div className="sc-gingham sc-hero-gingham" aria-hidden="true" />
      <motion.button className="sc-postcard" style={{ rotate: reduced ? 3 : photoRotate, y: reduced ? 0 : photoY }} onClick={() => onGallery(2)} aria-label={copy.photos}>
        <span className="sc-tape" aria-hidden="true" />
        <img className="sc-main-photo" src="/assets/original-1.webp" alt={copy.heroAlt} fetchPriority="high" />
        <span className="sc-postcard-caption"><span>01 / LAUTERBRUNNEN</span><span>{copy.heroCaption}</span><ArrowUpRight size={20} aria-hidden="true" /></span>
      </motion.button>
      <div className="sc-swiss-stamp" aria-hidden="true"><span>{copy.stamp[0]}</span><SwissCross /><span>{copy.stamp[1]}</span></div>
      <span className="sc-hand-note sc-hero-note" aria-hidden="true">{copy.note}</span>
      <Cutout src="geranium" className="sc-hero-flowers" eager style={{ y: reduced ? 0 : flowersY, rotate: -9 }} />
      <div className="sc-cable-line" aria-hidden="true" />
      <Cutout src="cable-car" className="sc-hero-cable" eager style={{ x: reduced ? 0 : cabinX, y: reduced ? 0 : cabinY, rotate: reduced ? 6 : cabinRotate }} />
      <Cutout src="bernard" className="sc-hero-dog" eager style={{ y: reduced ? 0 : dogY, rotate: reduced ? -8 : dogRotate }} />
      <span className="sc-dog-greeting" aria-hidden="true">{copy.dog}</span>
      <PaperStar className="sc-hero-star-one" /><PaperStar className="sc-hero-star-two" />
    </div>
  </section>;
}

function Discovery({ copy, reduced, onGallery }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center start'] });
  const p = useSpring(scrollYProgress, { stiffness: 115, damping: 25 });
  const cowY = useTransform(p, [0, .5, 1], [90, 0, -24]);
  const cowRotate = useTransform(p, [0, .6, 1], [16, -5, -8]);
  const items = [
    { photo: '/assets/original-2.webp', alt: copy.cardAlts[0], index: 0, rotate: -2.5 },
    { photo: '/assets/journey/fondue.webp', alt: copy.cardAlts[1], href: '#a-table', rotate: 2 },
    { photo: '/assets/original-4.webp', alt: copy.cardAlts[2], index: 3, rotate: -1.5 },
  ];
  return <section className="sc-discovery" id="decouvrir" ref={ref} aria-labelledby="discovery-title">
    <div className="sc-section-heading"><div><p className="sc-eyebrow">{copy.catalogue}</p><h2 id="discovery-title">{copy.catalogueTitle[0]}<br /><em>{copy.catalogueTitle[1]}</em></h2></div><p className="sc-section-lede">{copy.catalogueBody}</p></div>
    <div className="sc-cow-stage" aria-hidden="true"><div className="sc-cow-disc" /><Cutout src="cow" className="sc-cow" style={{ y: reduced ? 0 : cowY, rotate: reduced ? -5 : cowRotate }} /><PaperStar className="sc-cow-star" /></div>
    <div className="sc-catalogue-grid">
      {items.map((item, i) => {
        const text = copy.cards[i];
        const inside = <><div className="sc-card-photo"><img src={item.photo} alt={item.alt} loading="lazy" decoding="async" /><span className="sc-card-number">0{i + 1}</span></div><div className="sc-card-copy"><span className="sc-card-label">{text.label}</span><h3>{text.title}</h3><p>{text.body}</p><span className="sc-card-action">{text.action}<ArrowUpRight size={20} aria-hidden="true" /></span></div></>;
        const props = { className: 'sc-discovery-card', initial: reduced ? false : { opacity: 0, y: 45, rotate: item.rotate + 4 }, whileInView: { opacity: 1, y: 0, rotate: item.rotate }, viewport: { once: true, amount: .15 }, transition: { type: 'spring', stiffness: 105, damping: 20, delay: i * .06 }, whileHover: reduced ? undefined : { y: -8, rotate: 0 }, whileTap: { scale: .985 } };
        return item.href ? <motion.a key={item.photo} {...props} href={item.href}>{inside}</motion.a> : <motion.button key={item.photo} {...props} onClick={() => onGallery(item.index)}>{inside}</motion.button>;
      })}
    </div>
  </section>;
}

function Fondue({ copy, reduced }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const p = useSpring(scrollYProgress, { stiffness: 95, damping: 24 });
  const y = useTransform(p, [0, .55, 1], [65, 0, -25]);
  const rotate = useTransform(p, [0, 1], [-5, 2]);
  return <section className="sc-fondue" id="a-table" ref={ref} aria-labelledby="fondue-title">
    <div className="sc-fondue-copy"><p className="sc-eyebrow">{copy.fondueEyebrow}</p><h2 id="fondue-title">{copy.fondueTitle[0]}<br /><em>{copy.fondueTitle[1]}</em></h2><p>{copy.fondueBody}</p><BookLink copy={copy}>{copy.footerCta}</BookLink></div>
    <div className="sc-table-collage"><div className="sc-gingham sc-table-gingham" aria-hidden="true" /><div className="sc-fondue-sticker" aria-hidden="true">{copy.fondueSticker}</div><Cutout src="fondue-friends" className="sc-fondue-friends" style={{ y: reduced ? 0 : y, rotate: reduced ? -2 : rotate }} /><div className="sc-paper-note" aria-hidden="true">{copy.fondueNote[0]}<br /><em>{copy.fondueNote[1]}</em><svg viewBox="0 0 100 50"><path d="M7 8c26 34 51 35 78 14m-13-2 15 1-5 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></div><PaperStar className="sc-table-star" /></div>
  </section>;
}

function About({ open, onClose, copy }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const dialog = ref.current;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    const padding = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbar > 0) document.body.style.paddingRight = `${(parseFloat(getComputedStyle(document.body).paddingRight) || 0) + scrollbar}px`;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    return () => { dialog.close(); document.body.style.overflow = overflow; document.body.style.paddingRight = padding; if (previous instanceof HTMLElement) previous.focus({ preventScroll: true }); };
  }, [open]);
  return <dialog ref={ref} className="sc-about" aria-labelledby="about-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === ref.current) onClose(); }}><button className="sc-about-close" aria-label={copy.close} onClick={onClose}><X size={23} /></button><p className="sc-eyebrow">SCHÜTZEN · L’ATELIER</p><h2 id="about-title">{copy.aboutTitle}</h2><p>{copy.aboutBody}</p><a href="/version-fondue/" target="_blank" rel="noopener noreferrer">{copy.previous}<ArrowUpRight size={17} /></a></dialog>;
}

function App() {
  const [lang, setLang] = useState('fr');
  const [gallery, setGallery] = useState(null);
  const [about, setAbout] = useState(false);
  const reduced = Boolean(useReducedMotion()) || new URLSearchParams(window.location.search).get('motion') === 'reduce';
  const copy = COPY[lang];
  useEffect(() => { document.documentElement.lang = lang; document.documentElement.dataset.reduced = String(reduced); }, [lang, reduced]);
  const openGallery = index => setGallery(index);
  return <MotionConfig reducedMotion={reduced ? 'always' : 'user'}><a className="sc-skip" href="#decouvrir">{copy.skip}</a><div className="sc-site" inert={gallery !== null || about}>
    <header className="sc-header"><a className="sc-brand" href="#accueil" aria-label="Schützen, Lauterbrunnen — accueil"><SwissCross /><span>Schützen<small>LAUTERBRUNNEN · SUISSE</small></span></a><nav className="sc-nav" aria-label={copy.discover}><a href="#decouvrir">{copy.discover}</a><a href="#a-table">{copy.table}</a><button onClick={() => openGallery(0)}>{copy.photos}</button></nav><div className="sc-header-actions"><label className="sc-language"><span className="sc-sr-only">{copy.language}</span><select value={lang} onChange={event => setLang(event.target.value)}><option value="fr">FR</option><option value="en">EN</option><option value="de">DE</option></select></label><BookLink copy={copy} className="sc-header-book" /></div></header>
    <main><Hero copy={copy} reduced={reduced} onGallery={openGallery} /><div className="sc-ribbon" aria-hidden="true">{copy.ribbon.map(text => <React.Fragment key={text}><span>{text}</span><SwissCross /></React.Fragment>)}</div><Discovery copy={copy} reduced={reduced} onGallery={openGallery} /><Fondue copy={copy} reduced={reduced} /></main>
    <footer className="sc-footer"><div className="sc-footer-top"><div><p className="sc-eyebrow">{copy.footerEyebrow}</p><h2>{copy.footerTitle}</h2></div><BookLink copy={copy} className="sc-button-cream">{copy.footerCta}</BookLink><SwissCross className="sc-footer-cross" /></div><div className="sc-footer-bottom"><span>Schützen · {copy.location}</span><div><button onClick={() => openGallery(0)}>{copy.originals}</button><button onClick={() => setAbout(true)}>{copy.about}</button></div><a href="#accueil" className="sc-back-top" aria-label={lang === 'fr' ? 'Revenir en haut' : lang === 'de' ? 'Nach oben' : 'Back to top'}><ArrowUpRight size={20} /></a></div></footer>
  </div><Gallery open={gallery !== null} initialIndex={gallery ?? 0} onClose={() => setGallery(null)} lang={lang} /><About open={about} onClose={() => setAbout(false)} copy={copy} /></MotionConfig>;
}

createRoot(document.getElementById('root')).render(<App />);
