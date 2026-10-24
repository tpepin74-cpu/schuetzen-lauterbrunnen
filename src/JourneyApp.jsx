import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, ChevronDown, Eye, Images, Info, RotateCcw, X } from 'lucide-react';
import EnvironmentJourney from './EnvironmentJourney';
import FondueJourney from './FondueJourney';
import Gallery from './Gallery';
import './experience.css';

const BOOKING = 'https://www.booking.com/hotel/ch/restaurant-schutzen-ag.html';
const STOPS = [0, .225, .34, .455, .595];
const STATIC_IMAGES = ['cascade.webp', '../original-1.webp', 'stairs.webp', 'terrace.webp', 'fondue.webp'];
const PHASE_BREAKS = [.17, .29, .39, .52, .625, .70, .755, .90, .975];
const COPY = {
  fr: {
    place:'Lauterbrunnen, Suisse', book:'Réserver', booking:'Réserver un séjour sur Booking.com, nouvel onglet', gallery:'Les photographies', originals:'Voir les quatre photographies originales', language:'Choisir la langue',
    chapters:['La cascade','Le chalet','Les marches','La terrasse','La fondue'], chapterNav:'Les étapes de votre arrivée',
    scroll:'Suivez le mouvement', next:'Poursuivre le voyage', restart:'Revivre l’instant', quiet:'Masquer les textes', restore:'Afficher les textes', about:'À propos de cette expérience', close:'Fermer',
    eyebrow:'HÔTEL SCHÜTZEN · LAUTERBRUNNEN', title:['Laissez-vous','emporter.'], intro:'De la cascade à la première bouchée.',
    house:['Quelques pas.','Un autre monde.'], stairs:'Juste quelques marches.', terrace:['Le feu crépite.','Vous êtes arrivés.'], fondue:['La montagne,','à votre table.'], final:['Le goût','d’être ici.'],
    actions:['Laissez-vous guider','Approchez du chalet','Montez les marches','Installez-vous près du feu','À votre table','Prenez un morceau de pain','Approchez la fourchette','Piquez. Plongez. Tournez.','Ramenez la bouchée vers vous','Savourez.'],
    description:'Une arrivée au Schützen en une seule scène : la cascade s’ouvre, le chalet apparaît, on monte ses marches vers la terrasse, puis les mains prennent du pain, le piquent, le plongent et le tournent dans la fondue avant de le porter vers soi.',
    conceptTitle:'Un voyage imaginé autour d’un lieu bien réel.', concept:'La façade et la rue sont votre photographie originale. La cascade d’ouverture, les vues rapprochées, la terrasse avec le feu et la dégustation sont des scènes générées à partir des quatre photographies du lieu pour cette proposition d’animation. Elles ne constituent pas un reportage des aménagements ou prestations actuels.', originalButton:'Retrouver les photos du lieu', previous:'Ouvrir la version précédente', reduced:'Animation réduite : explorez les étapes avec les boutons ci-dessous.'
  },
  en: {
    place:'Lauterbrunnen, Switzerland', book:'Reserve', booking:'Reserve a stay on Booking.com, new tab', gallery:'The photographs', originals:'View the four original photographs', language:'Choose your language',
    chapters:['The waterfall','The chalet','The steps','The terrace','The fondue'], chapterNav:'Your arrival, step by step',
    scroll:'Follow the moment', next:'Continue the journey', restart:'Relive the moment', quiet:'Hide the text', restore:'Show the text', about:'About this experience', close:'Close',
    eyebrow:'HOTEL SCHÜTZEN · LAUTERBRUNNEN', title:['Let yourself','be carried away.'], intro:'From the waterfall to the first bite.',
    house:['A few steps.','A world apart.'], stairs:'Just a few steps.', terrace:['The fire is glowing.','You have arrived.'], fondue:['The mountains,','at your table.'], final:['A taste','of being here.'],
    actions:['Let the journey unfold','Approach the chalet','Walk up the steps','Settle beside the fire','At your table','Pick up a piece of bread','Bring the fork closer','Pierce. Dip. Stir.','Bring the bite towards you','Savour the moment.'],
    description:'One continuous arrival at Schützen: the waterfall opens, the chalet comes into view, you climb to the terrace, then your hands pick up bread, pierce it, dip and stir it in the fondue before lifting it towards you.',
    conceptTitle:'An imagined journey around a real place.', concept:'The façade and street use the original photograph. The opening waterfall panorama, close-up views, the terrace fire and the fondue scene were generated from the four photographs for this animation concept. They are not documentary views of current facilities or services.', originalButton:'See the original photographs', previous:'Open the previous version', reduced:'Reduced motion: explore the scenes using the buttons below.'
  },
  de: {
    place:'Lauterbrunnen, Schweiz', book:'Buchen', booking:'Aufenthalt auf Booking.com buchen, neuer Tab', gallery:'Die Fotografien', originals:'Die vier Originalfotos ansehen', language:'Sprache wählen',
    chapters:['Der Wasserfall','Das Chalet','Die Treppe','Die Terrasse','Das Fondue'], chapterNav:'Ihre Ankunft, Schritt für Schritt',
    scroll:'Dem Moment folgen', next:'Die Reise fortsetzen', restart:'Noch einmal erleben', quiet:'Text ausblenden', restore:'Text anzeigen', about:'Über dieses Erlebnis', close:'Schließen',
    eyebrow:'HOTEL SCHÜTZEN · LAUTERBRUNNEN', title:['Lassen Sie sich','verzaubern.'], intro:'Vom Wasserfall bis zum ersten Bissen.',
    house:['Ein paar Schritte.','Eine andere Welt.'], stairs:'Nur ein paar Stufen.', terrace:['Das Feuer knistert.','Sie sind angekommen.'], fondue:['Die Berge,','an Ihrem Tisch.'], final:['So schmeckt','das Hiersein.'],
    actions:['Lassen Sie sich führen','Nähern Sie sich dem Chalet','Gehen Sie die Treppe hinauf','Nehmen Sie am Feuer Platz','An Ihrem Tisch','Nehmen Sie ein Stück Brot','Führen Sie die Gabel heran','Aufspießen. Eintauchen. Rühren.','Führen Sie den Bissen zu sich','Genießen.'],
    description:'Eine durchgehende Ankunft im Schützen: Der Wasserfall öffnet sich, das Chalet erscheint, Sie steigen zur Terrasse hinauf. Ihre Hände nehmen Brot, spießen es auf, tauchen es ins Fondue, rühren und heben es zu Ihnen.',
    conceptTitle:'Eine erdachte Reise zu einem echten Ort.', concept:'Fassade und Straße stammen aus dem Originalfoto. Das Wasserfallpanorama zu Beginn, die Nahaufnahmen, das Feuer auf der Terrasse und die Fondue-Szene wurden anhand der vier Fotos für diesen Animationsentwurf generiert. Sie dokumentieren keine aktuellen Einrichtungen oder Leistungen.', originalButton:'Die Originalfotos entdecken', previous:'Vorherige Version öffnen', reduced:'Reduzierte Bewegung: Erkunden Sie die Szenen über die Schaltflächen unten.'
  }
};

function Crest(){return <svg width="34" height="44" viewBox="0 0 40 48" fill="none" aria-hidden="true"><path d="M5 5h30v22c0 8-7 13-15 17C12 40 5 35 5 27V5Z" stroke="currentColor" strokeWidth=".9"/><path d="m10 27 7-11 5 7 4-6 5 10M12 31h16M20 23v13m-3-8v6m6-6v6" stroke="currentColor" strokeWidth=".9"/></svg>;}

function StoryText({progress,start,end,children,className='',opening=false,quiet=false}){
  const opacity=useTransform(progress, opening?[0,end-.045,end]:[Math.max(0,start-.018),start,end-.018,end],opening?[1,1,0]:[0,1,1,0]);
  const y=useTransform(progress,[start,end],[18,-28]);
  return <motion.div className={`story-text ${className}`} style={{opacity,y}} aria-hidden="true"><div className={quiet?'copy-hidden':''}>{children}</div></motion.div>;
}

function ConceptDialog({open,onClose,copy,onGallery}){
  const ref=useRef(null);
  useEffect(()=>{
    if(!open)return;
    const dialog=ref.current;
    const previousOverflow=document.body.style.overflow;
    const previousPadding=document.body.style.paddingRight;
    const scrollbarWidth=window.innerWidth-document.documentElement.clientWidth;
    if(scrollbarWidth>0){
      const padding=Number.parseFloat(getComputedStyle(document.body).paddingRight)||0;
      document.body.style.paddingRight=`${padding+scrollbarWidth}px`;
    }
    document.body.style.overflow='hidden';
    if(!dialog.open)dialog.showModal();
    return()=>{
      if(dialog.open)dialog.close();
      document.body.style.overflow=previousOverflow;
      document.body.style.paddingRight=previousPadding;
    };
  },[open]);
  return <dialog ref={ref} className="concept-dialog" onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===ref.current)onClose();}} aria-labelledby="concept-title"><div className="concept-inner"><button className="icon-button concept-close" onClick={onClose} aria-label={copy.close}><X size={22}/></button><span className="eyebrow">SCHÜTZEN · L’ATELIER</span><h2 id="concept-title">{copy.conceptTitle}</h2><p>{copy.concept}</p><button className="concept-link" onClick={onGallery}>{copy.originalButton}<Images size={17}/></button><a className="concept-previous" href="/version-2/" target="_blank" rel="noopener noreferrer">{copy.previous}<ArrowUpRight size={15}/></a></div></dialog>;
}

function App(){
  const sectionRef=useRef(null);
  const modalReturnFocus=useRef(null);
  const restoreModalFocus=useRef(false);
  const reduced=Boolean(useReducedMotion()) || new URLSearchParams(window.location.search).get('motion')==='reduce';
  const [mobile,setMobile]=useState(()=>matchMedia('(max-width:760px)').matches);
  const [lang,setLang]=useState('fr');
  const [quiet,setQuiet]=useState(false);
  const [galleryOpen,setGalleryOpen]=useState(false);
  const [conceptOpen,setConceptOpen]=useState(false);
  const [phase,setPhase]=useState(0);
  const [staticChapter,setStaticChapter]=useState(0);
  const copy=COPY[lang];
  const {scrollYProgress}=useScroll({target:sectionRef,offset:['start start','end end']});
  const progress=useSpring(scrollYProgress,{stiffness:180,damping:34,mass:.32,restDelta:.00001});
  useMotionValueEvent(progress,'change',value=>{let next=PHASE_BREAKS.findIndex(point=>value<point);if(next<0)next=PHASE_BREAKS.length;setPhase(current=>current===next?current:next);});
  useEffect(()=>{const mq=matchMedia('(max-width:760px)');const change=()=>setMobile(mq.matches);mq.addEventListener('change',change);return()=>mq.removeEventListener('change',change);},[]);
  useEffect(()=>{document.documentElement.lang=lang;},[lang]);
  useEffect(()=>{const key=e=>{if(e.key==='Escape'&&!galleryOpen&&!conceptOpen)setQuiet(false);};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[galleryOpen,conceptOpen]);
  useEffect(()=>{
    if(galleryOpen||conceptOpen||!restoreModalFocus.current)return;
    restoreModalFocus.current=false;
    const frame=requestAnimationFrame(()=>{
      const target=modalReturnFocus.current;
      if(target instanceof HTMLElement&&target.isConnected)target.focus({preventScroll:true});
    });
    return()=>cancelAnimationFrame(frame);
  },[galleryOpen,conceptOpen]);
  const chapter=reduced?staticChapter:phase<1?0:phase<2?1:phase<3?2:phase<4?3:4;
  const action=reduced?copy.chapters[chapter]:copy.actions[phase];
  const atEnd=!reduced&&phase===9;
  function goTo(value){const section=sectionRef.current;if(!section)return;const top=section.getBoundingClientRect().top+window.scrollY;const distance=Math.max(0,section.offsetHeight-window.innerHeight);window.scrollTo({top:top+value*distance,behavior:reduced?'auto':'smooth'});}
  function goToChapter(i){setStaticChapter(i);if(!reduced)goTo(STOPS[i]);}
  function next(){if(reduced){setStaticChapter(v=>(v+1)%5);return;}const now=progress.get();const stop=[.225,.34,.455,.595,.68,.735,.82,.94,1].find(v=>v>now+.025);goTo(stop??0);}
  function rememberModalTrigger(event){
    const target=event?.currentTarget||document.activeElement;
    if(target instanceof HTMLElement)modalReturnFocus.current=target;
    restoreModalFocus.current=false;
  }
  const openGallery=event=>{rememberModalTrigger(event);setGalleryOpen(true);};
  const openConcept=event=>{rememberModalTrigger(event);setConceptOpen(true);};
  const closeGallery=()=>{restoreModalFocus.current=true;setGalleryOpen(false);};
  const closeConcept=()=>{restoreModalFocus.current=true;setConceptOpen(false);};
  const openGalleryFromConcept=()=>{setConceptOpen(false);setGalleryOpen(true);};
  return <MotionConfig reducedMotion="user"><main inert={galleryOpen||conceptOpen}>
    <section ref={sectionRef} className={`scroll-experience ${reduced?'is-reduced':''}`} aria-label={copy.description}>
      <div className={`sticky-stage ${quiet?'is-quiet':''} chapter-${chapter}`}>
        {reduced?<img className="static-scene" src={`/assets/journey/${chapter===4&&mobile?'fondue-mobile.webp':STATIC_IMAGES[chapter]}`} alt={copy.chapters[chapter]} />:<><EnvironmentJourney progress={progress} mobile={mobile}/><FondueJourney progress={progress} mobile={mobile}/></>}
        <div className="global-shade" aria-hidden="true"/>
        <header className="header">
          <button className="brand" onClick={()=>goToChapter(0)} aria-label={`Schützen · ${copy.restart}`}><Crest/><span className="brand-type">Schützen<span>LAUTERBRUNNEN</span></span></button>
          <div className="header-right">
            <button className="photo-link" onClick={openGallery}>{copy.gallery}<Images size={15}/></button>
            <label className="language"><span className="sr-only">{copy.language}</span><select value={lang} onChange={e=>setLang(e.target.value)}><option value="fr">FR</option><option value="en">EN</option><option value="de">DE</option></select><ChevronDown size={11}/></label>
            <a className="header-book" href={BOOKING} target="_blank" rel="noopener noreferrer" aria-label={copy.booking}>{copy.book}<ArrowUpRight size={16}/></a>
          </div>
        </header>
        <h1 className="sr-only">Schützen, {copy.place} · {copy.intro}</h1>
        {reduced?<div className={`static-title ${quiet?'copy-hidden':''}`}><p className="eyebrow">{copy.eyebrow}</p><h2>{copy.chapters[chapter]}</h2><p>{copy.reduced}</p></div>:<>
          <StoryText progress={progress} start={0} end={.135} opening quiet={quiet} className="opening-copy"><p className="eyebrow">{copy.eyebrow}</p><h2>{copy.title[0]}<em>{copy.title[1]}</em></h2><p className="opening-body">{copy.intro}</p><span className="fine-rule"/></StoryText>
          <StoryText progress={progress} start={.195} end={.285} quiet={quiet} className="house-copy"><p className="eyebrow">02 · SCHÜTZEN</p><h2>{copy.house[0]}<em>{copy.house[1]}</em></h2></StoryText>
          <StoryText progress={progress} start={.315} end={.38} quiet={quiet} className="stairs-copy"><p className="eyebrow">03 · {copy.chapters[2]}</p><h2>{copy.stairs}</h2></StoryText>
          <StoryText progress={progress} start={.415} end={.50} quiet={quiet} className="terrace-copy"><p className="eyebrow">04 · {copy.chapters[3]}</p><h2>{copy.terrace[0]}<em>{copy.terrace[1]}</em></h2></StoryText>
          <StoryText progress={progress} start={.545} end={.63} quiet={quiet} className="fondue-copy"><p className="eyebrow">05 · {copy.chapters[4]}</p><h2>{copy.fondue[0]}<em>{copy.fondue[1]}</em></h2></StoryText>
          <StoryText progress={progress} start={.945} end={1.05} quiet={quiet} className="final-copy"><p className="eyebrow">SCHÜTZEN · LAUTERBRUNNEN</p><h2>{copy.final[0]}<em>{copy.final[1]}</em></h2></StoryText>
        </>}
        <div className="journey-label" aria-hidden="true"><span className="label-dot"/><span>{copy.place}</span><span className="label-line"/></div>
        <footer className="experience-footer">
          <button className="scroll-cue" onClick={atEnd?()=>goTo(0):next} aria-label={atEnd?copy.restart:copy.next}><span className="scroll-circle">{atEnd?<RotateCcw size={18}/>:<ArrowDown size={18}/>}</span><span className="cue-copy"><span>{atEnd?copy.restart:copy.scroll}</span><small>{action}</small></span></button>
          <nav className="chapter-nav" aria-label={copy.chapterNav}>{copy.chapters.map((name,i)=><button key={i} onClick={()=>goToChapter(i)} aria-label={`${i+1}. ${name}`} aria-current={chapter===i?'step':undefined}><span className="chapter-number">0{i+1}</span><span className="chapter-name">{name}</span><span className="chapter-indicator"/></button>)}</nav>
          <div className="view-actions"><button className="icon-button quiet-button" aria-label={quiet?copy.restore:copy.quiet} aria-pressed={quiet} onClick={()=>setQuiet(v=>!v)}>{quiet?<X size={18}/>:<Eye size={19}/>}</button><button className="icon-button mobile-gallery" onClick={openGallery} aria-label={copy.originals}><Images size={18}/></button><button className="icon-button info-button" onClick={openConcept} aria-label={copy.about}><Info size={17}/></button></div>
        </footer>
        {!reduced&&<div className="progress-track" aria-hidden="true"><motion.div style={{scaleX:progress}}/></div>}
      </div>
    </section>
  </main><Gallery open={galleryOpen} onClose={closeGallery} lang={lang}/><ConceptDialog open={conceptOpen} onClose={closeConcept} copy={copy} onGallery={openGalleryFromConcept}/></MotionConfig>;
}

createRoot(document.getElementById('root')).render(<App/>);
