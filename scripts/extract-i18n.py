"""Gather the site's actual editorial copy, preserving a stable translation key."""
import json, re, hashlib
from pathlib import Path
from lxml import html

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'src/i18n'
PAGES = ['index','chambres','restaurant','sejours','vallee','maison','infos','reservation']
entries = {}

def add(value, context):
    text = re.sub(r'\s+', ' ', value or '').strip()
    if not text or not re.search(r'[A-Za-zÀ-ž]', text): return
    if re.fullmatch(r'[\d\s.,+–—/()×%²€:-]*(?:CHF|m²|min|km|m|h|JUNGFRAU|HELVETIA)?[\d\s.,+–—/()×%²€:-]*', text): return
    if re.match(r'^(?:https?://|mailto:|tel:)',text) or '@' in text or text in ('cerfalunettes.ch',): return
    key = 's' + hashlib.sha1(text.encode()).hexdigest()[:10]
    if key not in entries: entries[key] = {'id':key,'text':text,'context':context}

for name in PAGES:
    doc = html.fromstring((ROOT / (name+'.html')).read_text())
    for el in doc.iter():
        if not isinstance(el.tag,str): continue
        if el.tag in ('script','style'): continue
        context = name + ': ' + el.tag + ('.'+el.get('class','').split(' ')[0] if el.get('class') else '')
        add(el.text,context)
        if el.tail: add(el.tail, name+': inline continuation')
        for attr in ('alt','aria-label','placeholder','title'):
            add(el.get(attr),context+' @'+attr)
        if el.tag == 'meta' and (el.get('name') == 'description' or el.get('property') in ('og:title','og:description')):
            add(el.get('content'),name+': SEO')

data=json.loads((ROOT/'public/js/data.js').read_text().split('=',1)[1].rstrip(';\n'))
for room in data['rooms']:
    for field in ('name','guests','view','beds'): add(room[field],'room:'+room['id']+' '+field)
    for x in room['feats']: add(x,'room amenity')
for pair in data['faq']:
    for x in pair: add(x,'concierge FAQ')
for pair in data['events']:
    for x in pair: add(x,'regional event')
for x in data['pages']: add(x['title'],'page title')
for x in json.loads((ROOT/'src/stays.json').read_text()):
    for key,value in x.items():
        if key in ('title','label','intro','description','duration','season'): add(value,'stay:'+x['id']+' '+key)

DEST.mkdir(exist_ok=True)
(DEST/'source-static.json').write_text(json.dumps(list(entries.values()),ensure_ascii=False,indent=2)+'\n')
print(f'{len(entries)} source entries; {sum(len(x["text"].split()) for x in entries.values())} words')
