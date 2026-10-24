import fs from 'node:fs';
import { translateJS, messageId, normalize } from './i18n-js.mjs';
const entries=new Map();
const known=new Set(JSON.parse(fs.readFileSync('src/i18n/source-static.json','utf8')).map(x=>x.id));
const collect=x=>{if(!known.has(x.id))entries.set(x.id,x);};
for(const file of ['public/js/site.js','src/experience.js','src/easter-eggs.js','src/easter-scenes.js','src/menu-easter-eggs.js']) {
  translateJS(fs.readFileSync(file,'utf8'),{},{collect,context:file});
}
for (const file of ['src/i18n/runtime-messages.json','src/i18n/runtime-extra.json']) if(fs.existsSync(file)) {
  for(const [key,text]of Object.entries(JSON.parse(fs.readFileSync(file,'utf8'))))collect({id:messageId(text),text:normalize(text),context:'message:'+key});
}
fs.writeFileSync('src/i18n/source-runtime.json',JSON.stringify([...entries.values()],null,2)+'\n');
console.log(`${entries.size} runtime entries; ${[...entries.values()].reduce((s,x)=>s+x.text.split(' ').length,0)} words`);
