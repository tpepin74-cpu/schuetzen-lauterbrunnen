import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { ArrowDown, ArrowUp, ArrowUpRight, ChevronDown, Eye, Images, Menu, X } from 'lucide-react';
import Gallery from './Gallery';
import ImmersiveScene from './ImmersiveScene';
import './styles.css';

const BOOKING = 'https://www.booking.com/hotel/ch/restaurant-schutzen-ag.html';
const VIEW_STOPS = [0, 1];
const COPY = {
  fr: {
    country: 'Lauterbrunnen, Suisse', house: 'La maison', panorama: 'L’immersion', gallery: 'Les photographies', book: 'Réserver un séjour', bookShort: 'Réserver', bookingLabel: 'Réserver un séjour sur Booking.com (nouvel onglet)',
    menu: 'Ouvrir le menu', close: 'Fermer', lang: 'Choisir la langue', contact: 'Nous contacter', home: 'Hôtel Schützen', scroll: 'Faites défiler', top: 'Revenir au début', next: 'Découvrir la suite', photographs: 'Voir les 4 photographies', quiet: 'Contempler les photographies', restore: 'Afficher les textes', navigation: 'Navigation principale', chaptersLabel: 'Une immersion à Lauterbrunnen', immersion: 'AU PIED DU STAUBBACH', sceneDescription: 'Scène immersive de Lauterbrunnen avec le véritable restaurant Schützen, sa route et ses escaliers, devant la cascade du Staubbach. Des géraniums, des drapeaux suisses et des vaches complètent la mise en scène.',
    immersive: {eyebrow: 'SCHÜTZEN · LAUTERBRUNNEN', title1: 'Le temps', title2: 'suspendu.', body: 'Une adresse. Un monde à part.', endline: 'Au rythme de la nature.'},
    chapters: ['La maison', 'La cascade', 'L’arrivée'],
    scenes: [
      {eyebrow: 'HÔTEL & RESTAURANT · LAUTERBRUNNEN', line1: 'Le temps', line2: 'suspendu.', body: 'Une adresse. Un monde à part.'},
      {eyebrow: 'LE STAUBBACH · LAUTERBRUNNEN', line1: 'Lever', line2: 'les yeux.', body: 'La cascade. La falaise. Et vous, juste ici.'},
      {eyebrow: 'BIENVENUE AU SCHÜTZEN', line1: 'Quelques', line2: 'marches.', body: 'Et le rythme change.'},
    ],
    alts: ['Façade originale de l’hôtel restaurant Schützen, son enseigne, sa terrasse, ses escaliers et la route au premier plan.', 'Photographie originale de la cascade du Staubbach derrière le restaurant Schützen, avec ses parasols, son escalier et la rue.', 'Photographie originale du restaurant Schützen au bord de la route, avec l’escalier d’entrée et la falaise en arrière-plan.'],
  },
  en: {
    country: 'Lauterbrunnen, Switzerland', house: 'The house', panorama: 'The immersion', gallery: 'The photographs', book: 'Reserve your stay', bookShort: 'Reserve', bookingLabel: 'Reserve your stay on Booking.com (new tab)',
    menu: 'Open menu', close: 'Close', lang: 'Choose your language', contact: 'Contact us', home: 'Hotel Schützen', scroll: 'Scroll to discover', top: 'Back to the beginning', next: 'Discover the next view', photographs: 'View the 4 photographs', quiet: 'Contemplate the photographs', restore: 'Show the text', navigation: 'Main navigation', chaptersLabel: 'An immersion in Lauterbrunnen', immersion: 'BENEATH THE STAUBBACH', sceneDescription: 'An immersive Lauterbrunnen scene with the real Schützen restaurant, its street and steps, before the Staubbach waterfall. Geraniums, Swiss flags and cows complete the artistic composition.',
    immersive: {eyebrow: 'SCHÜTZEN · LAUTERBRUNNEN', title1: 'Time stands', title2: 'still.', body: 'One address. A world apart.', endline: 'At nature’s pace.'},
    chapters: ['The house', 'The waterfall', 'Your arrival'],
    scenes: [
      {eyebrow: 'HOTEL & RESTAURANT · LAUTERBRUNNEN', line1: 'Time stands', line2: 'still.', body: 'One address. A world apart.'},
      {eyebrow: 'STAUBBACH FALLS · LAUTERBRUNNEN', line1: 'Just', line2: 'look up.', body: 'The waterfall. The cliff. And you, right here.'},
      {eyebrow: 'WELCOME TO SCHÜTZEN', line1: 'A few', line2: 'steps.', body: 'And a different rhythm.'},
    ],
    alts: ['Original photograph of the Hotel Restaurant Schützen façade, sign, terrace, entrance steps and road.', 'Original photograph of the Staubbach waterfall behind Restaurant Schützen, with parasols, entrance steps and street.', 'Original photograph of Restaurant Schützen beside the road, with its entrance staircase and the cliff behind it.'],
  },
  de: {
    country: 'Lauterbrunnen, Schweiz', house: 'Das Haus', panorama: 'Eintauchen', gallery: 'Die Fotografien', book: 'Aufenthalt buchen', bookShort: 'Buchen', bookingLabel: 'Aufenthalt auf Booking.com buchen (neuer Tab)',
    menu: 'Menü öffnen', close: 'Schließen', lang: 'Sprache wählen', contact: 'Kontakt', home: 'Hotel Schützen', scroll: 'Weiter entdecken', top: 'Zurück zum Anfang', next: 'Die nächste Ansicht entdecken', photographs: 'Alle 4 Fotografien ansehen', quiet: 'Die Fotografien betrachten', restore: 'Texte anzeigen', navigation: 'Hauptnavigation', chaptersLabel: 'Lauterbrunnen erleben', immersion: 'AM FUSSE DES STAUBBACHS', sceneDescription: 'Eine immersive Szene in Lauterbrunnen mit dem echten Restaurant Schützen, seiner Straße und Treppe vor dem Staubbachfall. Geranien, Schweizer Fahnen und Kühe ergänzen die künstlerische Komposition.',
    immersive: {eyebrow: 'SCHÜTZEN · LAUTERBRUNNEN', title1: 'Die Zeit', title2: 'steht still.', body: 'Ein Ort. Eine eigene Welt.', endline: 'Im Rhythmus der Natur.'},
    chapters: ['Das Haus', 'Der Wasserfall', 'Ankommen'],
    scenes: [
      {eyebrow: 'HOTEL & RESTAURANT · LAUTERBRUNNEN', line1: 'Die Zeit', line2: 'steht still.', body: 'Ein Ort. Eine eigene Welt.'},
      {eyebrow: 'STAUBBACHFALL · LAUTERBRUNNEN', line1: 'Einfach', line2: 'hinaufsehen.', body: 'Der Wasserfall. Die Felswand. Und Sie mittendrin.'},
      {eyebrow: 'WILLKOMMEN IM SCHÜTZEN', line1: 'Ein paar', line2: 'Stufen.', body: 'Und ein anderer Rhythmus.'},
    ],
    alts: ['Originalfoto der Fassade des Hotels und Restaurants Schützen mit Schild, Terrasse, Eingangstreppe und Straße.', 'Originalfoto des Staubbachfalls hinter dem Restaurant Schützen mit Sonnenschirmen, Treppe und Straße.', 'Originalfoto des Restaurants Schützen an der Straße mit Eingangstreppe und Felswand im Hintergrund.'],
  },
};

function Crest({className=''}) {
  return <svg className={className} width="40" height="48" viewBox="0 0 40 48" fill="none" aria-hidden="true"><path d="M5 5h30v22c0 8-7 13-15 17C12 40 5 35 5 27V5Z" stroke="currentColor" strokeWidth=".85"/><path d="m10 27 7-11 5 7 4-6 5 10M12 31h16M17 8v5m6-5v5M20 23v13m-3-8v6m6-6v6" stroke="currentColor" strokeWidth=".85"/></svg>;
}

function MobileMenu({open,onClose,copy,lang,setLang,onGallery,goTo}) {
  const ref=useRef(null);
  useEffect(()=>{if(!open)return;const el=ref.current;const previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';el?.showModal();return()=>{el?.close();document.body.style.overflow=previousOverflow;};},[open]);
  const choose=fn=>{onClose();fn();};
  return <dialog ref={ref} className="menu-dialog" aria-label={copy.menu} onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===ref.current)onClose();}}><div className="menu-inner">
    <div className="menu-top"><span className="menu-brand">Schützen</span><button className="icon-button" onClick={onClose} aria-label={copy.close}><X size={23}/></button></div>
    <span className="eyebrow">LAUTERBRUNNEN</span>
    <nav><button onClick={()=>choose(()=>goTo(0))}>{copy.house}<ArrowUpRight/></button><button onClick={()=>choose(()=>goTo(1))}>{copy.panorama}<ArrowUpRight/></button><button onClick={()=>choose(onGallery)}>{copy.gallery}<ArrowUpRight/></button></nav>
    <div className="menu-languages" aria-label={copy.lang}>{['fr','en','de'].map(l=><button key={l} aria-pressed={l===lang} onClick={()=>setLang(l)}>{l.toUpperCase()}</button>)}</div>
    <a className="button-solid" href={BOOKING} target="_blank" rel="noopener noreferrer" aria-label={copy.bookingLabel}>{copy.book}<ArrowUpRight size={17}/></a>
    <a className="menu-contact" href="mailto:holidays@hotelschuetzen.com">{copy.contact}<ArrowUpRight size={14}/></a>
  </div></dialog>;
}

function Header({copy,lang,setLang,onMenu,menuOpen,goTo,openGallery}) {
  return <header className="header">
    <button className="brand" aria-label={`${copy.home}, ${copy.top}`} onClick={()=>goTo(0)}><Crest className="brand-crest"/><span className="brand-type">Schützen<span>LAUTERBRUNNEN</span></span></button>
    <nav className="desktop-nav" aria-label={copy.navigation}><button onClick={()=>goTo(0)}>{copy.house}</button><button onClick={()=>goTo(1)}>{copy.panorama}</button><button onClick={openGallery}>{copy.gallery}</button></nav>
    <div className="header-right"><label className="language"><span className="sr-only">{copy.lang}</span><select value={lang} onChange={e=>setLang(e.target.value)}><option value="fr">FR</option><option value="en">EN</option><option value="de">DE</option></select><ChevronDown size={11}/></label>
      <a className="header-book" href={BOOKING} target="_blank" rel="noopener noreferrer" aria-label={copy.bookingLabel}><span className="desktop-book-label">{copy.book}</span><span className="mobile-book-label">{copy.bookShort}</span><ArrowUpRight size={16}/></a>
      <button className="mobile-menu-toggle icon-button" aria-label={copy.menu} aria-expanded={menuOpen} onClick={onMenu}><Menu size={21}/></button>
    </div>
  </header>;
}

function App(){
  const sectionRef=useRef(null);
  const atEndRef=useRef(false);
  const reducedMotion=useReducedMotion();
  const [mobile,setMobile]=useState(()=>window.matchMedia('(max-width:760px)').matches);
  const [lang,setLang]=useState('fr');
  const [quiet,setQuiet]=useState(false);
  const [atEnd,setAtEnd]=useState(false);
  const [galleryOpen,setGalleryOpen]=useState(false);
  const [menuOpen,setMenuOpen]=useState(false);
  const copy=COPY[lang];
  const {scrollYProgress}=useScroll({target:sectionRef,offset:['start start','end end']});
  useMotionValueEvent(scrollYProgress,'change',v=>{const next=v>.93;if(next!==atEndRef.current){atEndRef.current=next;setAtEnd(next);}});
  useEffect(()=>{const mq=window.matchMedia('(max-width:760px)');const handler=()=>setMobile(mq.matches);mq.addEventListener('change',handler);return()=>mq.removeEventListener('change',handler);},[]);
  useEffect(()=>{document.documentElement.lang=lang;},[lang]);
  useEffect(()=>{const onKey=e=>{if(e.key==='Escape'&&!galleryOpen&&!menuOpen)setQuiet(false);};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey);},[galleryOpen,menuOpen]);
  function goTo(n){
    if(reducedMotion){setQuiet(n===1);return;}
    const section=sectionRef.current;if(!section)return;
    const top=section.getBoundingClientRect().top+window.scrollY;
    const travel=Math.max(0,section.offsetHeight-window.innerHeight);
    window.scrollTo({top:Math.max(0,top+travel*VIEW_STOPS[n]),behavior:reducedMotion?'auto':'smooth'});
  }
  const openGallery=()=>setGalleryOpen(true);
  return <MotionConfig reducedMotion="user"><main inert={galleryOpen}>
    <h1 className="sr-only">{copy.home} · {copy.country}</h1>
    <section ref={sectionRef} className={`scroll-experience immersive-experience ${reducedMotion?'motion-reduced':''}`} aria-label={copy.chaptersLabel}>
      <div className={`sticky-stage ${quiet?'is-quiet':''}`}>
        <ImmersiveScene progress={scrollYProgress} mobile={mobile} quiet={quiet} copy={copy} reducedMotion={Boolean(reducedMotion)}/>
        <Header copy={copy} lang={lang} setLang={setLang} onMenu={()=>setMenuOpen(true)} menuOpen={menuOpen} goTo={goTo} openGallery={openGallery}/>
        <footer className="journey-footer immersive-footer">
          {!reducedMotion&&<button className="scroll-cue" onClick={()=>goTo(atEnd?0:1)} aria-label={atEnd?copy.top:copy.next}><span className="scroll-cue-icon">{atEnd?<ArrowUp size={18}/>:<ArrowDown size={18}/>}</span><span>{atEnd?copy.top:copy.scroll}</span></button>}
          <div className="immersion-caption"><span>{copy.immersion}</span><span className="immersion-line" aria-hidden="true"><motion.i style={{scaleX:scrollYProgress}}/></span></div>
          <div className="view-actions"><button className="icon-button view-quiet" aria-label={quiet?copy.restore:copy.quiet} aria-pressed={quiet} onClick={()=>setQuiet(v=>!v)}>{quiet?<X size={17}/>:<Eye size={18}/>}</button><button className="gallery-open" onClick={openGallery} aria-label={copy.photographs}><Images size={17}/><span>04</span></button></div>
        </footer>
        {!reducedMotion&&<div className="progress-track" aria-hidden="true"><motion.div style={{scaleX:scrollYProgress}}/></div>}
      </div>
    </section>
    <MobileMenu open={menuOpen} onClose={()=>setMenuOpen(false)} copy={copy} lang={lang} setLang={setLang} onGallery={openGallery} goTo={goTo}/>
    <Gallery open={galleryOpen} onClose={()=>setGalleryOpen(false)} lang={lang} initialIndex={0}/>
  </main></MotionConfig>;
}

createRoot(document.getElementById('root')).render(<App/>);
