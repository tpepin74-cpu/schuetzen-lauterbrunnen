import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { translateJS, messageId, normalize } from './i18n-js.mjs';

export const pages=['index','chambres','restaurant','sejours','vallee','maison','infos','reservation'];
export const locales=JSON.parse(fs.readFileSync(new URL('../src/i18n/locales.json',import.meta.url),'utf8'));
const root=path.resolve(new URL('..',import.meta.url).pathname);
const readJSON=file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
const esc=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const decode=value=>value.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&nbsp;','\u00a0');
export const siteBasePath=`${(process.env.SITE_BASE_PATH||'/').replace(/\/+$/,'')}/`;
if(!siteBasePath.startsWith('/')||siteBasePath.startsWith('//')||/[?#\\]/.test(siteBasePath)||siteBasePath.split('/').some(part=>part==='.'||part==='..'))throw new Error('SITE_BASE_PATH must be an absolute URL path, such as /schuetzen-lauterbrunnen/.');
const assetPath=value=>value.startsWith(siteBasePath)?value:siteBasePath+value.replace(/^\/+/,'');
const route=(page,lang)=>`${siteBasePath}${lang==='fr'?'':lang+'/'}${page==='index'?'':page+'.html'}`;
function deploymentSettings(config){
  const originURL=new URL(process.env.SITE_PUBLIC_ORIGIN||config.origin);
  if(!['https:','http:'].includes(originURL.protocol)||originURL.pathname!=='/'||originURL.search||originURL.hash)throw new Error('SITE_PUBLIC_ORIGIN must contain only the origin; use SITE_BASE_PATH for a project subdirectory.');
  const audience=process.env.SITE_AUDIENCE||config.audience;
  const publicUnlisted=audience==='public-unlisted';
  const envIndexable=process.env.SITE_INDEXABLE;
  if(envIndexable!==undefined&&!['true','false'].includes(envIndexable))throw new Error('SITE_INDEXABLE must be true or false.');
  const indexable=!publicUnlisted&&(envIndexable===undefined?config.indexable===true:envIndexable==='true');
  return {origin:originURL.origin,audience,publicUnlisted,indexable};
}
const hreflang=lang=>lang==='zh'?'zh-Hans':lang;
const dictionary=lang=>lang==='fr'?{}:(fs.existsSync(path.join(root,`src/i18n/${lang}.json`))?readJSON(`src/i18n/${lang}.json`):{});
const translator=dict=>value=>{
  if(!value)return value;
  const cleaned=normalize(decode(value)), translated=dict[messageId(cleaned)];
  return typeof translated==='string' ? value.match(/^\s*/u)[0]+translated+value.match(/\s*$/u)[0] : decode(value);
};
function getAttr(tag,name){const match=tag.match(new RegExp(`\\b${name}=(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`));return match?.slice(1).find(x=>x!==undefined);}
function setAttr(tag,name,value){
  const pattern=new RegExp(`\\s${name}=(?:"[^"]*"|'[^']*'|[^\\s>]+)`);
  const attr=` ${name}="${esc(value)}"`;
  return pattern.test(tag)?tag.replace(pattern,attr):tag.replace(/\s*\/?>$/,end=>attr+end);
}
function localHref(value,lang) {
  const internal=value.match(/^(?:\.\/|\/)?(index|chambres|restaurant|sejours|vallee|maison|infos|reservation)\.html([?#].*)?$/);
  if(internal)return route(internal[1],lang)+(internal[2]||'');
  return value;
}
function languageLinks(page,lang,foot=false){return Object.entries(locales).map(([key,locale])=>`<a href="${route(page,key)}" lang="${locale.locale}" hreflang="${hreflang(key)}" data-language-link${key===lang?' aria-current="true"':''}>${locale.name}</a>`).join('');}
function languagePicker(page,lang,tr,mobile=false){return `<details class="language-picker${mobile?' language-picker--mobile':''}"><summary aria-label="${esc(tr('Choisir la langue'))}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-5 5-5 13 0 18m0-18c5 5 5 13 0 18"/></svg><span>${mobile?locales[lang].name:locales[lang].code}</span></summary><nav aria-label="${esc(tr('Langues'))}">${languageLinks(page,lang)}</nav></details>`;}

function imageTag(tag,manifest,lang){
  const original=getAttr(tag,'src');if(!original)return tag;
  const key='/'+original.replace(/^\/?/,'');
  const record=manifest.images?.[key];
  if(!record)return tag;
  tag=setAttr(tag,'width',record.original.width);
  tag=setAttr(tag,'height',record.original.height);
  // This is a logical lookup key for photo Easter eggs, not a requested asset URL.
  tag=setAttr(tag,'data-original-src',key);
  tag=setAttr(tag,'srcset',record.srcset);
  let sizes=getAttr(tag,'sizes');
  if(key.startsWith('/assets/collage/')) {
    const name=path.basename(key);
    sizes=name==='postman-friendly.webp'?'(max-width: 760px) calc(100vw - 44px), 460px':
      name==='restaurant-lettering.webp'?'(max-width: 760px) 90vw, 650px':
      name.includes('concierge')?'(max-width: 760px) 120px, 180px':
      name==='fondue-friends.webp'?'(max-width: 760px) 60vw, 350px':'(max-width: 760px) 160px, 280px';
  } else if(key.includes('/menu/')) sizes='220px';
  sizes ||= '(max-width: 760px) calc(100vw - 48px), (max-width: 1100px) 46vw, 640px';
  tag=setAttr(tag,'sizes',sizes);
  if(lang!=='fr'&&key.endsWith('/restaurant-lettering.webp')){
    tag=setAttr(tag,'src',`/locales/${lang}/restaurant-lettering.svg`);
    tag=tag.replace(/\s(?:srcset|sizes)="[^"]*"/g,'');
  }
  return tag;
}

export function prepareHTML(source,page,lang='fr') {
  const config=readJSON('src/seo-config.json'), locale=locales[lang], dict=dictionary(lang), tr=translator(dict);
  const {origin,indexable,publicUnlisted}=deploymentSettings(config),siteURL=origin+siteBasePath;
  const manifest=fs.existsSync(path.join(root,'docs/performance-assets.json'))?readJSON('docs/performance-assets.json'):{images:{}};
  let result=source.replace(/<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi,'');
  result=result.replace(/<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>|<!--[\s\S]*?-->|<[^>]+>|[^<]+/g,part=>{
    if(part.startsWith('<!--')||part.startsWith('<style'))return part;
    if(part.startsWith('<script'))return part.replace(/src="(?:\/?js\/)(data|site)\.js"/g,(_,name)=>`src="/locales/${lang}/${name}.js"`);
    if(part.startsWith('<')) {
      let tag=part.replace(/\b(alt|aria-label|placeholder|title|data-lb-cap)="([^"]*)"/g,(_,attr,text)=>`${attr}="${esc(tr(text))}"`);
      if(/^<meta\b/i.test(tag)&&/\b(?:name|property)="(?:description|og:title|og:description|twitter:title|twitter:description)"/.test(tag))tag=tag.replace(/\bcontent="([^"]*)"/,(_,text)=>`content="${esc(tr(text))}"`);
      tag=tag.replace(/\bhref="([^"]*)"/g,(_,value)=>`href="${esc(localHref(decode(value),lang))}"`);
      tag=tag.replace(/\b(src|href|poster)="(img\/|css\/|manifest\.webmanifest)([^"]*)"/g,'$1="/$2$3"');
      tag=tag.replace(/\bsrcset="([^"]*)"/g,(_,v)=>`srcset="${v.replace(/(^|,\s*)img\//g,'$1/img/')}"`);
      if(/^<img\b/i.test(tag))tag=imageTag(tag,manifest,lang);
      return tag;
    }
    return esc(tr(part));
  });
  result=result.replace(/<html\b[^>]*>/,tag=>setAttr(tag,'lang',locale.locale));
  const seoCopy=readJSON('src/i18n/seo.json')[lang][page];
  result=result.replace(/<title>[\s\S]*?<\/title>/,`<title>${esc(seoCopy.title)}</title>`);
  result=result.replace(/(<meta\b[^>]*(?:name|property)="(?:description|og:description|twitter:description)"[^>]*\bcontent=")[^"]*("[^>]*>)/g,(_,start,end)=>start+esc(seoCopy.description)+end);
  result=result.replace(/(<meta\b[^>]*(?:name|property)="(?:og:title|twitter:title)"[^>]*\bcontent=")[^"]*("[^>]*>)/g,(_,start,end)=>start+esc(seoCopy.title)+end);
  for(const [property,value]of [['og:title',seoCopy.title],['og:description',seoCopy.description]]){
    if(!result.includes(`property="${property}"`))result=result.replace('</head>',`<meta property="${property}" content="${esc(value)}">\n</head>`);
  }
  result=result.replace(/(<figure\b[^>]*class="[^"]*pc-photo--small[^>]*>\s*)(<img\b[^>]*>)/g,(_,start,img)=>start+setAttr(setAttr(img,'sizes','(max-width: 760px) 34vw, 18vw'),'loading','lazy'));
  result=result.replace(/<link rel="manifest"[^>]*>/,`<link rel="manifest" href="/locales/${lang}/manifest.webmanifest">`);
  result=result.replace(/<link\b[^>]*rel="(?:canonical|alternate)"[^>]*>/g,'');
  result=result.replace(/<meta\b[^>]*(?:property="og:(?:url|locale|image)"|name="twitter:image")[^>]*>/g,'');
  result=result.replace(/<meta\b[^>]*\bname=["'](?:robots|googlebot|bingbot)["'][^>]*>/gi,'');
  result=result.replace('</head>',`<meta name="robots" content="${publicUnlisted?'noindex,nofollow,noimageindex':indexable?'index,follow,max-image-preview:large':'noindex,follow'}">\n</head>`);
  const url=origin+route(page,lang);
  const title=decode(result.match(/<title>([\s\S]*?)<\/title>/i)?.[1]||config.hotelName);
  const description=decode(result.match(/<meta name="description" content="([^"]*)"/)?.[1]||'');
  const image=siteURL+'img/sch-facade-staubbach.webp';
  const graph=[{'@type':'WebPage','@id':url+'#page',url,name:title,description,inLanguage:locale.locale,isPartOf:{'@id':siteURL+'#website'},about:{'@id':siteURL+'#hotel'}},
    {'@type':'Hotel','@id':siteURL+'#hotel',name:config.hotelName,url:siteURL,telephone:config.phone,email:config.email,numberOfRooms:25,image,logo:siteURL+'img/logo.webp',address:{'@type':'PostalAddress',streetAddress:'Fuhren 439',postalCode:'3822',addressLocality:'Lauterbrunnen',addressRegion:'BE',addressCountry:'CH'},geo:{'@type':'GeoCoordinates',latitude:46.59482,longitude:7.90709}}];
  if(page==='index')graph.push({'@type':'WebSite','@id':siteURL+'#website',url:siteURL,name:config.hotelName,inLanguage:Object.values(locales).map(x=>x.locale)});
  else graph.push({'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:tr('Accueil'),item:origin+route('index',lang)},{'@type':'ListItem',position:2,name:tr({chambres:'Chambres',restaurant:'Restaurant',sejours:'Idées de séjour',vallee:'La vallée',maison:'Le chalet',infos:'Infos & accès',reservation:'Réservation'}[page]),item:url}]});
  if(page==='restaurant')graph.push({'@type':'Restaurant','@id':siteURL+'#restaurant',name:'Restaurant Schützen',url,hasMenu:url+'#carte',telephone:config.phone,servesCuisine:[{fr:'Cuisine suisse',de:'Schweizer Küche',en:'Swiss cuisine',zh:'瑞士菜',ru:'Швейцарская кухня',ko:'스위스 요리',it:'Cucina svizzera',es:'Cocina suiza'}[lang]],address:graph[1].address,image:siteURL+'img/sch-resto.webp',containedInPlace:{'@id':siteURL+'#hotel'},acceptsReservations:false});
  const seo=`<link rel="canonical" href="${url}">\n${Object.entries(locales).map(([key,l])=>`<link rel="alternate" hreflang="${hreflang(key)}" href="${origin+route(page,key)}">`).join('\n')}\n<link rel="alternate" hreflang="x-default" href="${origin+route(page,'fr')}">\n<meta property="og:url" content="${url}"><meta property="og:locale" content="${locale.og}"><meta property="og:image" content="${image}"><meta property="og:image:width" content="1920"><meta property="og:image:height" content="1446"><meta name="twitter:image" content="${image}">\n<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':graph}).replaceAll('<','\\u003c')}</script>`;
  result=result.replace('</head>',seo+'\n</head>');
  result=result.replace('<div class="top__acts">',`<div class="top__acts">${languagePicker(page,lang,tr)}`);
  result=result.replace('<nav aria-label="'+esc(tr('Pages du site'))+'">',`${languagePicker(page,lang,tr,true)}<nav aria-label="${esc(tr('Pages du site'))}">`);
  result=result.replace('<span class="foot__credit">',`<nav class="footer-languages" aria-label="${esc(tr('Langues'))}">${languageLinks(page,lang,true)}</nav><span class="foot__credit">`);
  const shortNav={de:['Start','Ideen','Zimmer','Hilfe','Buchen'],en:['Home','Ideas','Rooms','Help','Book'],zh:['首页','灵感','客房','咨询','预订'],ru:['Главная','Идеи','Номера','Помощь','Бронь'],ko:['홈','여행','객실','문의','예약'],it:['Inizio','Idee','Camere','Aiuto','Prenota'],es:['Inicio','Planes','Habitaciones','Ayuda','Reservar']};
  if(shortNav[lang])result=result.replace(/(<nav class="app-nav"[^>]*>)([\s\S]*?)(<\/nav>)/,(_,start,body,end)=>{let i=0;return start+body.replace(/<span>[^<]*<\/span>/g,()=>`<span>${shortNav[lang][i++]}</span>`)+end;});
  result=result.replace(/<span class="menu-category">([^<]*)(<small>([^<]*)<\/small>)?<\/span>/g,(_,name,sub='')=>`<span class="menu-category"><span>${name}</span>${lang==='fr'?sub:''}</span>`);
  // The locale must exist before any deferred application script or module runs.
  result=result.replace(/(<script\b[^>]*src="\/locales\/[^/]+\/data\.js"[^>]*>)/,`<script src="/locales/${lang}/runtime.js"></script>\n$1`);
  // Keep asset URLs unprefixed here: Vite resolves public files and applies its
  // matching base to src, srcset, stylesheets, fonts, scripts and manifests.
  return result;
}

export function emitLocaleResources({strict=false}={}){
  const sourceEntries=[...readJSON('src/i18n/source-static.json'),...readJSON('src/i18n/source-runtime.json')];
  const sourceIndex=new Map(sourceEntries.map(x=>[x.id,x]));
  const runtimeIds=new Set();
  for(const file of ['src/experience.js','src/easter-eggs.js','src/easter-scenes.js','src/menu-easter-eggs.js'])translateJS(fs.readFileSync(path.join(root,file),'utf8'),{},{collect:x=>runtimeIds.add(x.id)});
  for(const stay of readJSON('src/stays.json'))for(const key of ['title','label'])runtimeIds.add(messageId(stay[key]));
  for(const photo of readJSON('src/menu-photos.json'))runtimeIds.add(messageId(photo.name));
  const messages={...readJSON('src/i18n/runtime-messages.json'),...readJSON('src/i18n/runtime-extra.json')};
  const dataSource=JSON.parse(fs.readFileSync(path.join(root,'public/js/data.js'),'utf8').split('=')[1].replace(/;\s*$/,''));
  const deployment=deploymentSettings(readJSON('src/seo-config.json'));
  const report={languages:{},pageCount:pages.length*Object.keys(locales).length,origin:deployment.origin,basePath:siteBasePath,audience:deployment.audience,indexable:deployment.indexable};
  for(const [lang,locale]of Object.entries(locales)){
    const dict=dictionary(lang),tr=translator(dict);
    const missing=lang==='fr'?[]:sourceEntries.filter(x=>typeof dict[x.id]!=='string'||!dict[x.id].trim()).map(x=>x.id);
    if(strict&&missing.length)throw new Error(`${lang}: ${missing.length} translations are missing`);
    const dir=path.join(root,'public/locales',lang);fs.mkdirSync(dir,{recursive:true});
    const strings={};for(const id of runtimeIds){const entry=sourceIndex.get(id);if(entry)strings[entry.text]=tr(entry.text);}
    const localizedMessages=Object.fromEntries(Object.entries(messages).map(([key,value])=>[key,tr(value)]));
    if(lang==='ru'&&fs.existsSync(path.join(root,'src/i18n/ru-plurals.json')))Object.assign(localizedMessages,readJSON('src/i18n/ru-plurals.json'));
    const config={...locale,strings,messages:localizedMessages};
    fs.writeFileSync(path.join(dir,'runtime.js'),'window.SCH_LOCALE='+JSON.stringify(config).replaceAll('<','\\u003c')+';\n'+fs.readFileSync(path.join(root,'scripts/locale-runtime.js'),'utf8'));
    const data=structuredClone(dataSource);
    for(const room of data.rooms){for(const key of ['name','guests','view','beds'])room[key]=tr(room[key]);room.feats=room.feats.map(tr);}
    data.faq=data.faq.map(pair=>pair.map(tr));data.events=data.events.map(pair=>pair.map(tr));data.pages=data.pages.map(p=>({...p,title:tr(p.title)}));
    fs.writeFileSync(path.join(dir,'data.js'),'window.SCH='+JSON.stringify(data).replaceAll('<','\\u003c')+';\n');
    fs.writeFileSync(path.join(dir,'manifest.webmanifest'),JSON.stringify({id:siteBasePath,name:'Hotel Schützen Lauterbrunnen',short_name:'Schützen',lang:locale.locale,start_url:route('index',lang),scope:siteBasePath,display:'standalone',background_color:'#f8f4e9',theme_color:'#b92e2d',icons:[{src:assetPath('img/icon-512.png'),sizes:'512x512',type:'image/png'},{src:assetPath('img/apple-touch-icon.png'),sizes:'180x180',type:'image/png'}]}));
    let js=translateJS(fs.readFileSync(path.join(root,'public/js/site.js'),'utf8'),dict).replace(/([`'"]|,\s*)\/?img\//g,(_,prefix)=>prefix+assetPath('img/'));
    fs.writeFileSync(path.join(dir,'site.js'),js);
    const label=tr('Notre restaurant'), units=[...label].reduce((n,c)=>n+(/[\u2e80-\u9fff\uac00-\ud7af]/u.test(c)?1:.59),0), fontSize=Math.min(175,1260/units);
    fs.writeFileSync(path.join(dir,'restaurant-lettering.svg'),`<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="500" viewBox="0 0 1500 500"><path d="M90 387c320-55 1000-55 1320 0" stroke="#193a2d" stroke-width="12" fill="none"/><path d="M110 408c320-55 960-55 1280 0" stroke="#b92e2d" stroke-width="6" stroke-dasharray="20 8" fill="none"/><text x="750" y="300" text-anchor="middle" font-family="Georgia,serif" font-size="${fontSize.toFixed(1)}" font-weight="bold" fill="#b92e2d" stroke="#fffdf7" stroke-width="24" stroke-linejoin="round" paint-order="stroke">${esc(label)}</text></svg>`);
    report.languages[lang]={locale:locale.locale,translated:sourceEntries.length-missing.length,expected:sourceEntries.length,missing};
    if(lang!=='fr'){
      fs.mkdirSync(path.join(root,lang),{recursive:true});
      for(const page of pages)fs.writeFileSync(path.join(root,lang,page+'.html'),prepareHTML(fs.readFileSync(path.join(root,page+'.html'),'utf8'),page,lang));
    }
  }
  fs.writeFileSync(path.join(root,'docs/localization-verification.json'),JSON.stringify(report,null,2)+'\n');
  return report;
}

export async function finishBuild(){
  if(!fs.existsSync(path.join(root,'dist/index.html')))return;
  const config=readJSON('src/seo-config.json');
  const {origin,indexable,publicUnlisted}=deploymentSettings(config);
  if(publicUnlisted){
    // Crawlers must be able to read each page's noindex directive. A project's
    // robots.txt is informational; the host's root robots.txt remains authoritative.
    fs.writeFileSync(path.join(root,'dist/robots.txt'),'User-agent: *\nAllow: /\n');
    for(const file of ['sitemap.xml','llms.txt'])fs.rmSync(path.join(root,'dist',file),{force:true});
  }else{
  const urls=pages.flatMap(page=>Object.keys(locales).map(lang=>`<url><loc>${origin+route(page,lang)}</loc>${Object.entries(locales).map(([key,l])=>`<xhtml:link rel="alternate" hreflang="${hreflang(key)}" href="${origin+route(page,key)}"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="${origin+route(page,'fr')}"/></url>`));
  fs.writeFileSync(path.join(root,'dist/sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join('')}</urlset>`);
  fs.writeFileSync(path.join(root,'dist/robots.txt'),`User-agent: *\n${indexable?'Allow: /':'Disallow: /'}\nSitemap: ${origin+assetPath('sitemap.xml')}\n`);
  const data=JSON.parse(fs.readFileSync(path.join(root,'public/js/data.js'),'utf8').split('=')[1].replace(/;\s*$/,''));
  const facts=`# Hotel Schützen Lauterbrunnen\n\n> Chalet-hôtel de 25 chambres à Lauterbrunnen, Suisse. Restaurant, terrasse et vue sur le Staubbach.\n\n## Contact\nFuhren 439, 3822 Lauterbrunnen, Suisse\nTéléphone : ${config.phone}\nE-mail : ${config.email}\n\n## Chambres\n25 chambres, 8 catégories présentées sur le site.\n${data.rooms.map(r=>`- ${r.name} : ${r.size} ; ${r.guests} ; ${r.beds}.`).join('\n')}\n\n## Questions pratiques\n${data.faq.map(([q,a])=>`### ${q}\n${a}`).join('\n\n')}\n\n## Pages et langues\n${Object.entries(locales).map(([l,c])=>`- ${c.name} : ${origin+route('index',l)}`).join('\n')}\n\n- Chambres : ${origin+route('chambres','fr')}\n- Restaurant et carte : ${origin+route('restaurant','fr')}\n- Idées de séjour : ${origin+route('sejours','fr')}\n- La vallée : ${origin+route('vallee','fr')}\n- Le chalet : ${origin+route('maison','fr')}\n- Informations et accès : ${origin+route('infos','fr')}\n- Réservation : ${origin+route('reservation','fr')}\n`;
  fs.writeFileSync(path.join(root,'dist/llms.txt'),facts);
  }
  const mainManifest=path.join(root,'dist/manifest.webmanifest');
  if(fs.existsSync(mainManifest)){
    const manifest=JSON.parse(fs.readFileSync(mainManifest,'utf8'));
    manifest.id=siteBasePath;manifest.scope=siteBasePath;manifest.start_url=route('index','fr');
    manifest.icons=manifest.icons.map(icon=>({...icon,src:assetPath(icon.src)}));
    fs.writeFileSync(mainManifest,JSON.stringify(manifest));
  }
  for(const dir of ['version-2','version-collage','version-fondue','assets/immersive','assets/journey'])fs.rmSync(path.join(root,'dist',dir),{recursive:true,force:true});
  for(const name of fs.readdirSync(path.join(root,'dist/assets')))if(/^original-\d+\./.test(name))fs.rmSync(path.join(root,'dist/assets',name));
  for(const name of fs.readdirSync(path.join(root,'dist')))if(/^qa-.*\.html$/.test(name))fs.rmSync(path.join(root,'dist',name));
  const {transformWithEsbuild}=await import('vite');
  const cssFile=path.join(root,'dist/css/site-base.css');
  if(fs.existsSync(cssFile)){
    const result=await transformWithEsbuild(fs.readFileSync(cssFile,'utf8'),cssFile,{loader:'css',minify:true,target:'es2020',charset:'utf8',legalComments:'none'});
    fs.writeFileSync(cssFile,result.code);
  }
}

export async function minifyLocaleResources(){
  const {transformWithEsbuild}=await import('vite');
  await Promise.all(Object.keys(locales).flatMap(lang=>['runtime','data','site'].map(async name=>{
    const file=path.join(root,'public/locales',lang,name+'.js');
    const result=await transformWithEsbuild(fs.readFileSync(file,'utf8'),file,{loader:'js',minify:true,target:'es2020',charset:'utf8',legalComments:'none'});
    fs.writeFileSync(file,result.code);
  })));
}

export function localizationPlugin(){return{
  name:'schuetzen-localized-pages',
  transformIndexHtml:{order:'pre',handler(html,ctx){
    const file=path.basename(ctx.filename||'index.html','.html');if(!pages.includes(file))return html;
    const relative=path.relative(root,ctx.filename||'index.html');const possible=relative.split(path.sep)[0];const lang=locales[possible]?possible:'fr';
    return prepareHTML(fs.readFileSync(path.join(root,file+'.html'),'utf8'),file,lang);
  }},
  transform(code,id){if(/\/src\/(?:experience|easter-eggs|easter-scenes|menu-easter-eggs)\.js(?:\?|$)/.test(id))return {code:translateJS(code,{},{runtime:true}),map:null};},
  closeBundle:finishBuild
};}
