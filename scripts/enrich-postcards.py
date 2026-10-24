"""Regenerate only the marked V7 blocks; preserve the supplied hotel HTML content."""
from pathlib import Path
from html import escape
import json, re

ROOT = Path(__file__).resolve().parents[1]
STAYS = json.loads((ROOT/'src/stays.json').read_text())
PAGES = ['index', 'chambres', 'restaurant', 'vallee', 'maison', 'infos', 'reservation', 'sejours']
SITE_CREDIT = '<span class="foot__credit">Réalisé par <a href="https://cerfalunettes.ch" target="_blank" rel="noopener noreferrer">Le Cerf à Lunettes · cerfalunettes.ch<span class="sr"> — nouvel onglet</span></a></span>'
NAV = [('index','Accueil'),('chambres','Chambres'),('restaurant','Restaurant'),('sejours','Idées de séjour'),('vallee','La vallée'),('maison','Le chalet'),('infos','Infos & accès')]
PATHS = {
 'arrow':'<path d="M5 12h14m-6-6 6 6-6 6"/>',
 'home':'<path d="m3 10 9-7 9 7v10H3zM9 20v-8h6v8"/>',
 'heart':'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
 'bed':'<path d="M3 17V6m18 14V10H3m0 7h18M3 20v-3m5-7V6h8v4"/>',
 'guide':'<path d="M4 4h16v13H9l-5 4zM8 8h8M8 12h5"/>',
 'calendar':'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
 'mountain':'<path d="m3 20 6-12 4 7 3-12 5 17H3ZM7 12l2 2 2-2m3-3 2 2 2-2"/>',
 'food':'<path d="M4 3v7a3 3 0 0 0 6 0V3M7 3v19M20 3v19M20 3c-5 3-5 10 0 10"/>',
 'pin':'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
 'info':'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
 'back':'<path d="m15 6-6 6 6 6"/>',
 'cross':'<path fill="currentColor" stroke="none" d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',
 'bookmark':'<path d="M5 3h14v19l-7-4-7 4z"/>'
}
def icon(k):
 return f'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{PATHS[k]}</svg>'
def block(name, html): return f'<!-- V7:{name}:START -->\n{html}\n<!-- V7:{name}:END -->'
def remove_block(s,name): return re.sub(r'<!-- V7:'+re.escape(name)+r':START -->.*?<!-- V7:'+re.escape(name)+r':END -->\s*','',s,flags=re.S)
def cutout(name, cls='', size='1000', y='-18'):
 from PIL import Image
 with Image.open(ROOT/f'public/assets/collage/{name}.webp') as im: w,h=im.size
 return f'<span class="pc-cut {cls}" data-paper data-paper-y="{y}" data-paper-rotate="3" aria-hidden="true"><img src="/assets/collage/{name}.webp" width="{w}" height="{h}" loading="lazy" decoding="async" alt="" draggable="false"></span>'
def photo(name,alt,cls='',sizes='(max-width:760px) 88vw, 36vw'):
 from PIL import Image
 with Image.open(ROOT/f'public/img/{name}.webp') as im: w,h=im.size
 small=ROOT/f'public/img/{name}-m.webp'
 srcset=f' srcset="img/{name}-m.webp 960w, img/{name}.webp {w}w" sizes="{sizes}"' if small.exists() else ''
 return f'<img class="{cls}" src="img/{name}.webp"{srcset} width="{w}" height="{h}" alt="{escape(alt,quote=True)}" loading="lazy" decoding="async">'
def stay_card(s,i):
 return f'''<article class="stay-card" data-stay-card data-category="{s['category']}" data-stay-id="{s['id']}">
 <a class="stay-card__image" href="sejours.html#{s['id']}" tabindex="-1" aria-hidden="true">{photo(s['image'], '',sizes='(max-width:760px) 80vw, 30vw')}<span class="stay-card__nights">{s['nights']} pour en profiter</span></a>
 <div class="stay-card__body"><p class="stay-card__label"><span>{s['label']}</span><span>0{i+1}</span></p><h3><a href="sejours.html#{s['id']}">{s['title']}</a></h3><p>{s['short']}</p><small>{s['season']}</small><div class="stay-card__foot"><a href="sejours.html#{s['id']}" class="link-arrow"><span>Découvrir l’idée</span>{icon('arrow')}</a><button class="stay-save" type="button" data-save-stay="{s['id']}" aria-pressed="false" aria-label="Garder l’idée : {s['label']}">{icon('bookmark')}</button></div></div>
 </article>'''
def inspiration():
 filters=[('all','Toutes les envies'),('a-deux','À deux'),('famille','En famille'),('nature','Au grand air'),('train','Sans voiture'),('hiver','En hiver'),('saved','Mon carnet')]
 return block('inspiration',f'''<section class="sec pc-inspiration" id="inspiration" aria-labelledby="h-stays"><header class="shead shead--2"><div><p class="eyebrow">VOTRE POINT DE DÉPART : LE SCHÜTZEN</p><h2 class="h-l" id="h-stays">Six envies de partir.<br><em>Une seule envie de rester.</em></h2></div><div class="shead__r"><p>À deux, en famille ou le nez au vent. Piochez dans nos idées et composez vos journées autour de l’hôtel.</p><a class="link-arrow" href="sejours.html">Toutes nos idées de séjour {icon('arrow')}</a></div></header><div class="stay-filters" role="group" aria-label="Filtrer les idées de séjour">{''.join(f'<button type="button" data-stay-filter="{v}" aria-pressed="{str(v=="all").lower()}">{label}</button>' for v,label in filters)}</div><div class="stay-cards" data-stay-rail>{''.join(stay_card(s,i) for i,s in enumerate(STAYS))}</div><p class="stay-empty" data-stay-empty hidden>Votre carnet attend vos envies. Touchez le marque-page d’une idée pour la retrouver ici.</p><div class="stay-rail-foot"><span data-stay-count aria-live="polite">6 idées à découvrir</span><div class="stay-rail-controls"><button type="button" data-stay-prev aria-label="Idées précédentes">{icon('back')}</button><button type="button" data-stay-next aria-label="Idées suivantes">{icon('arrow')}</button></div></div><p class="stay-source-note">Des suggestions inspirées des offices de tourisme de Lauterbrunnen et de la Jungfrau Region. Activités et transports à organiser séparément.</p></section>''')
def guide_entry():
 choices=[('rooms','bed','Trouver ma chambre','À deux, en famille, en solo'),('stays','mountain','Imaginer mon séjour','Six envies de grand air'),('book','calendar','Préparer ma réservation','Dates, voyageurs, chambre'),('restaurant','food','Une envie de fondue','La carte et les horaires'),('access','pin','Préparer mon arrivée','Train, voiture et accès'),('practical','info','Une petite question','Les réponses utiles')]
 return block('guide-entry',f'''<section class="pc-guide-entry" id="votre-guide" aria-labelledby="h-guide-entry"><div class="pc-guide-entry__intro"><div class="pc-guide-avatar" aria-hidden="true"><img src="/assets/collage/bernard.webp" width="800" height="1200" alt="" loading="lazy" decoding="async"></div><p class="eyebrow">LE PETIT GUIDE DU SCHÜTZEN</p><h2 id="h-guide-entry">Un coup de patte<br><em>pour votre séjour ?</em></h2><p>Choisissez une envie. On vous montre le chemin.</p></div><div class="pc-guide-choices">{''.join(f'<button type="button" data-cg-ask="{intent}"><span class="pc-guide-choice-icon">{icon(ic)}</span><span><b>{title}</b><small>{sub}</small></span>{icon("arrow")}</button>' for intent,ic,title,sub in choices)}</div></section>''')
def mobile_nav(page):
 items=[('index','Accueil','home'),('sejours','Séjours','mountain'),('chambres','Chambres','bed'),('guide','Guide','guide'),('reservation','Réserver','calendar')]
 bits=[]
 for dest,label,ic in items:
  if dest=='guide': bits.append(f'<button type="button" data-cg-open aria-label="Ouvrir le concierge en ligne">{icon(ic)}<span>Concierge</span></button>')
  else:
   current = ' aria-current="page"' if dest==page else ''
   cls = 'mobile-reserve' if dest=='reservation' else ''
   bits.append(f'<a href="{dest}.html" class="{cls}"{current}>{icon(ic)}<span>{label}</span></a>')
 return block('mobile-nav','<nav class="app-nav" aria-label="Navigation mobile">'+''.join(bits)+'</nav>')
def souvenir(asset,label,side='right'):
 return f'<div class="pc-souvenir-stanza pc-souvenir-stanza--{side}" aria-hidden="true"><span class="pc-souvenir-dash"></span><span class="pc-souvenir-note">{label}<small>LAUTERBRUNNEN · SUISSE</small></span>{cutout(asset,"pc-souvenir-image")}{icon("cross")}</div>'
def append_section(s, id, html):
 start=re.search(r'<section\b[^>]*\bid="'+re.escape(id)+r'"[^>]*>',s)
 if not start: raise ValueError('Section not found: '+id)
 depth=1
 for match in re.finditer(r'</?section\b[^>]*>',s[start.end():]):
  depth+= -1 if match.group().startswith('</') else 1
  if depth==0:
   at=start.end()+match.start();return s[:at]+html+'\n'+s[at:]
 raise ValueError('Section not closed: '+id)
DECOR={
 'index':[('chambres','cowbell','Les beaux jours commencent ici.','left'),('restaurant','alphorn','La Suisse a bon goût.','right')],
 'chambres':[('doubles','cowbell','À chacun son petit bonheur.','right'),('familles','bernard','Toute la tribu est du voyage.','left'),('solo','boots','Demain, on prend l’air.','right')],
 'restaurant':[('specialites','cow','Un goût de chez nous.','left'),('carte','geranium','Encore une petite envie ?','right'),('groupes','alphorn','Les bons moments se partagent.','left')],
 'vallee':[('incontournables','boots','La tête dans les montagnes.','right')],
 'maison':[('histoire','alphorn','Un chalet, tant de souvenirs.','right'),('valeurs','cowbell','Le cœur bien suisse.','left'),('reperes','geranium','Un petit chez-vous dans les Alpes.','right')],
 'infos':[('contact','bernard','On est là pour vous.','right'),('distances','boots','Le grand air n’est jamais loin.','left'),('faq','edelweiss','Les vacances se préparent en douceur.','right')],
 'reservation':[('chambre','cowbell','On vous garde une envie d’Alpes.','right'),('restaurant-info','geranium','Le plaisir de se retrouver.','left'),('groupe','alphorn','Plus on est, plus on partage.','right')]
}
def stay_section(s,i):
 steps=''.join(f'<li><span>0{k+1}</span><div><h3>{title}</h3><p>{txt}</p></div></li>' for k,(title,txt) in enumerate(s['steps']))
 sources=''.join(f'<a href="{url}" target="_blank" rel="noopener noreferrer">{label} ↗</a>' for label,url in s['sources'])
 return f'''<section class="stay-story sec" id="{s['id']}" aria-labelledby="stay-{s['id']}"><div class="stay-story__visual"><figure class="pc-photo">{photo(s['image'],s['alt'])}<figcaption>{s['caption']}</figcaption></figure>{cutout(s['cutout'],'stay-story__cutout')}<span class="stay-story__number" aria-hidden="true">0{i+1}</span></div><div class="stay-story__copy"><p class="eyebrow">{s['label']} · {s['nights']} pour en profiter</p><h2 id="stay-{s['id']}">{s['title']}</h2><p class="stay-story__intro">{s['intro']}</p><span class="stay-season">{icon('calendar')}{s['season']}</span><ol class="stay-steps">{steps}</ol><details class="stay-practical"><summary>Le petit conseil avant de partir</summary><p>{s['note']}</p><div class="stay-sources">{sources}</div></details><div class="stay-story__actions"><a class="pill pill--rouge" href="reservation.html?sejour={s['id']}">Choisir mes dates au Schützen {icon('arrow')}</a><button class="stay-save stay-save--text" type="button" data-save-stay="{s['id']}" aria-pressed="false" aria-label="Garder l’idée : {s['label']}">{icon('bookmark')}<span>Garder l’idée</span></button></div></div></section>'''

# Use the original complete template for all shared business interactions.
base=(ROOT/'index.html').read_text()
head='''<!doctype html><html lang="fr-CH" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>Idées de séjour à Lauterbrunnen · Hotel Schützen</title><meta name="description" content="Six envies de séjour autour du Schützen : à deux, en famille, cascades, randonnées, trains panoramiques et hiver au chalet. Inspirez-vous, puis choisissez vos dates."><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#f8f4e9"><link rel="icon" type="image/png" href="img/favicon-64.png"><link rel="apple-touch-icon" href="img/apple-touch-icon.png"><link rel="stylesheet" href="css/site-base.css"><link rel="preload" href="/assets/manrope-latin.woff" as="font" type="font/woff" crossorigin><link rel="preload" href="/assets/cormorant-garamond-italic.woff" as="font" type="font/woff" crossorigin><link rel="manifest" href="manifest.webmanifest"></head>'''
hero=f'''<section class="pc-hero pc-hero--sejours" id="top" aria-labelledby="h-page"><div class="pc-hero__copy"><ol class="pc-crumbs"><li><a href="index.html">Accueil</a></li><li>Idées de séjour</li></ol><p class="eyebrow">UN CARNET À REMPLIR DE SOUVENIRS</p><h1 id="h-page">Les Alpes.<br><em>À votre façon.</em></h1><p class="pc-hero__intro">Six idées pour faire du Schützen votre point de départ. Du temps à deux, du grand air en famille, des trains et des sommets.</p><div class="pc-hero__actions"><a class="pill pill--rouge" href="#vos-envies">Trouver mon idée {icon('arrow')}</a><button class="link-arrow" type="button" data-cg-ask="stays">Laissez-vous guider {icon('guide')}</button></div><p class="pc-location">{icon('cross')}Hotel Schützen · Lauterbrunnen · Suisse</p></div><div class="pc-hero__art"><div class="pc-gingham pc-hero-gingham" aria-hidden="true"></div><div class="pc-postmark" aria-hidden="true"><span>LAUTERBRUNNEN</span><b>GRÜEZI !</b><small>UN PETIT COIN DE SUISSE</small></div><figure class="pc-photo pc-photo--main">{photo('valley-aerial','La vallée de Lauterbrunnen et ses villages vus depuis les hauteurs')}<figcaption>Il y a tant de façons d’être bien, ici.</figcaption></figure><figure class="pc-photo pc-photo--small">{photo('train-yellow','Un train de montagne dans les Alpes suisses')}<figcaption>Le plaisir du voyage.</figcaption></figure>{cutout('boots','pc-hero-stayboots')}{cutout('edelweiss','pc-hero-stayflowers')}<div class="pc-stamp" aria-hidden="true"><small>HELVETIA</small>{icon('cross')}<b>3822</b></div></div></section>'''
jumps='<nav class="stay-jumps" id="vos-envies" aria-label="Choisir une idée de séjour">'+''.join(f'<a href="#{s["id"]}">{s["label"]}</a>' for s in STAYS)+'</nav>'
intro='<div class="stay-editorial-note"><span>DES IDÉES, À VOTRE RYTHME</span><p>Ces suggestions vous aident à composer votre voyage. Réservez votre chambre au Schützen ; choisissez séparément vos activités, repas et transports.</p></div>'
ending=f'''<section class="pc-stay-outro sec"><p class="eyebrow">LE MEILLEUR MOMENT ? LE VÔTRE.</p><h2 class="h-l">Le programme vous ressemble.<br><em>La chambre vous attend.</em></h2><p>Choisissez vos dates pour consulter les disponibilités.</p><a class="pill pill--rouge" href="reservation.html">Préparer mon séjour {icon('arrow')}</a><a class="link-arrow" href="https://jungfrauregion.swiss/en/service/operating-status.html" target="_blank" rel="noopener noreferrer">Consulter les ouvertures dans la région ↗</a></section>'''
new=head+base.split('</head>',1)[1]
new=re.sub(r'<body class="[^"]*">','<body class="postcard-site page-sejours">',new,count=1)
new=re.sub(r'<main\b[^>]*>.*?</main>',f'<main id="main" data-page="sejours">{hero}{jumps}{intro}{"".join(stay_section(s,i) for i,s in enumerate(STAYS))}{ending}</main>',new,count=1,flags=re.S)
(ROOT/'sejours.html').write_text(new)

for page in PAGES:
 p=ROOT/(page+'.html');s=p.read_text()
 s=re.sub(r'<span class="pc-brand-word">.*?</small></span>','',s,flags=re.S)
 s=s.replace('src="img/logo-s.webp" width="273" height="347" alt="Hotel Schützen Lauterbrunnen, accueil"','src="img/logo.webp" srcset="img/logo-s.webp 273w, img/logo.webp 547w" sizes="(max-width:760px) 104px, 135px" width="547" height="694" alt="Hotel Schützen Lauterbrunnen, accueil"')
 nav='<nav class="top__nav" aria-label="Menu principal"><ul>'+''.join(f'<li><a href="{dest}.html"'+(' aria-current="page"' if dest==page else '')+f'>{label}</a></li>' for dest,label in NAV)+'</ul></nav>'
 s=re.sub(r'<nav class="top__nav".*?</nav>',nav,s,count=1,flags=re.S)
 menu='<ul class="mnav__list">'+''.join(f'<li><a href="{dest}.html"'+(' aria-current="page"' if dest==page else '')+f'><span>{label}</span>{icon("arrow")}</a></li>' for dest,label in NAV+[('reservation','Réserver')])+'</ul>'
 s=re.sub(r'<ul class="mnav__list">.*?</ul>',menu,s,count=1,flags=re.S)
 if '<li><a href="sejours.html">Idées de séjour</a></li>' not in s.split('<footer',1)[1]:
  s=s.replace('<h3 class="foot__h">L’hôtel</h3><ul>','<h3 class="foot__h">L’hôtel</h3><ul><li><a href="index.html">Accueil</a></li><li><a href="sejours.html">Idées de séjour</a></li>')
 if 'class="foot__credit"' not in s:
  s=re.sub(r'(<div class="foot__base">.*?)(</div>)',lambda m:m[1]+SITE_CREDIT+m[2],s,count=1,flags=re.S)
 s=re.sub(r'(<a class="top__brand"[^>]*?) aria-current="page"',r'\1',s)
 s=re.sub(r'<p class="pc-location">.*?</p>','',s,flags=re.S)
 if page=='index':
  s=re.sub(r'<a[^>]+href="#decouvrir"[^>]*>.*?</a>','',s,count=1,flags=re.S)
  s=s.replace('escapade suisse.','Réservez votre séjour').replace('VOTRE PROCHAINE','LE SCHÜTZEN VOUS ATTEND')
 s=remove_block(s,'mobile-nav')
 s=s.replace('</body>',mobile_nav(page)+'\n</body>')
 for id,asset,label,side in DECOR.get(page,[]):
  name='souvenir-'+id;s=remove_block(s,name)
  s=append_section(s,id,block(name,souvenir(asset,label,side)))
 if page=='index':
  for name in ['guide-entry','inspiration']:s=remove_block(s,name)
  s=s.replace('<section class="pc-love-letter"',inspiration()+'\n<section class="pc-love-letter"',1)
  s=s.replace('<section class="pc-discovery sec"',guide_entry().replace('LE PETIT GUIDE DU SCHÜTZEN','VOTRE CONCIERGE EN LIGNE').replace('Un coup de patte<br><em>pour votre séjour ?</em>','Grüezi !<br><em>On prépare vos vacances ?</em>').replace('bernard.webp','concierge.webp').replace('Choisissez une envie. On vous montre le chemin.','Chambres, bonnes idées et petits conseils. Choisissez une envie, je vous accompagne.')+'\n<section class="pc-discovery sec"',1)
 elif page=='vallee':
  s=remove_block(s,'stays-link')
  call=block('stays-link',f'<div class="pc-stays-callout"><span>{icon("mountain")}</span><div><p class="eyebrow">ON VOUS DONNE DES IDÉES ?</p><h3>Transformez une envie en quelques jours dans les Alpes.</h3><p>Six suggestions de séjour à composer autour du Schützen.</p></div><a class="pill pill--rouge" href="sejours.html">Trouver mon séjour {icon("arrow")}</a></div>')
  s=append_section(s,'incontournables',call)
 elif page=='reservation':
  s=remove_block(s,'booking-stay')
  s=s.replace('<section class="sec sec--paper" id="chambre"',block('booking-stay','<aside class="booking-stay-context" data-booking-stay hidden aria-label="Votre idée de séjour"><span class="booking-stay-context__icon">'+icon('mountain')+'</span><div><small>VOTRE ENVIE D’ALPES</small><b data-booking-stay-title></b><p>Commençons par votre chambre. Les activités et transports se préparent séparément.</p></div><a class="link-arrow" data-booking-stay-link href="sejours.html">Revoir l’idée '+icon('arrow')+'</a></aside>')+'\n<section class="sec sec--paper" id="chambre"',1)
 # Inject the agent-owned guide fragment when available.
 fragment=ROOT/'src/guide-panel.html'
 if fragment.exists():
  s=re.sub(r'<button class="cg-tab".*?</section>',lambda _:fragment.read_text().strip(),s,count=1,flags=re.S)
 p.write_text(s)
print('Eight pages enriched; original business sections retained.')
