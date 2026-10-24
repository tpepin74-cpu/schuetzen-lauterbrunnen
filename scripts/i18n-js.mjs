import { parseAst } from 'rollup/parseAst';
import { createHash } from 'node:crypto';

export const normalize = text => text.replace(/\s+/gu, ' ').trim();
export const messageId = text => 's' + createHash('sha1').update(normalize(text)).digest('hex').slice(0, 10);
const technical = /^(?:https?:|mailto:|tel:|[.#@/]|[\w-]+\.(?:html|webp|png|js|css|mp3)|data-|aria-|sch\.|--|\d)/;
const ignore = new Set(['use strict','success pane','btn btn--solid','btn btn--ghost','RD','SCRIPT','STYLE','LINK','IFRAME','INPUT','TEXTAREA','SELECT','BUTTON','IMG','A','GET','POST','Escape','Enter','Tab','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','Space','Shift','Control','NFD','CHF','CH','BE','SVG']);
export function isCopy(text) {
  const t = normalize(text);
  return t && !technical.test(t) && !ignore.has(t) && !t.includes('=>') && !/^M[\d. -]/.test(t) && !/^(?:egg-|menu-egg-|msg |<)/.test(t)
    && /[A-Za-zÀ-ž]/.test(t.replace(/\{\w+\}/g,''))
    && (/[À-ž]/.test(t) || /^[A-Z]/.test(t) || /[a-zA-Z] [a-zA-Z]/.test(t))
    && !/^[-\w]+(?:\.[-\w]+)+$/.test(t);
}
const preserveSpace = (source, output) => source.match(/^\s*/u)[0] + output + source.match(/\s*$/u)[0];
const escapeHtml = value => value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

export function htmlCopy(source, translate) {
  return source.split(/(<[^>]*>)/g).map(part => {
    if (part.startsWith('<')) return part.replace(/\b(aria-label|title|alt|placeholder)=(['"])(.*?)\2/g, (all, attr, quote, value) => {
      const next=translate(value); return `${attr}=${quote}${next===value?value:escapeHtml(next)}${quote}`;
    });
    if (!isCopy(part)) return part;
    const next = translate(part);
    return next === part ? part : escapeHtml(next);
  }).join('');
}

/** Translate source literals at build time, leaving identifiers and expressions intact. */
export function translateJS(source, dictionary = {}, { collect, runtime = false, context = '' } = {}) {
  const ast = parseAst(source);
  const tr = value => {
    if (!isCopy(value)) return value;
    const normalized=normalize(value), id=messageId(normalized);
    collect?.({id,text:normalized,context});
    const next=dictionary[id];
    return typeof next === 'string' ? preserveSpace(value,next) : value;
  };
  function render(node, parent, field) {
    if (!node || typeof node.type !== 'string') return '';
    if (node.type === 'FunctionDeclaration' && node.id?.name === 'guideIntent') return source.slice(node.start,node.end);
    if (node.type === 'Literal' && typeof node.value === 'string') {
      if ((parent?.type === 'Property' && field === 'key' && !parent.computed) || parent?.type.startsWith('Import') || (parent?.type === 'MemberExpression' && field==='property' && !parent.computed)) return source.slice(node.start,node.end);
      const html = /<[a-z][\w:-]*(?:\s|>)/i.test(node.value);
      const next = html ? htmlCopy(node.value,tr) : tr(node.value);
      if (runtime && isCopy(node.value) && !html) return `window.SCH_I18N.t(${JSON.stringify(node.value)})`;
      return next !== node.value ? JSON.stringify(next) : source.slice(node.start,node.end);
    }
    if (node.type === 'TemplateLiteral') {
      let template=node.quasis.map((q,i)=>(q.value.cooked ?? q.value.raw)+(i<node.expressions.length?`{${i}}`:'')).join('');
      const hasHtml=/<[a-z][\w:-]*(?:\s|>)/i.test(template);
      const next=hasHtml?htmlCopy(template,tr):tr(template);
      const expressions=node.expressions.map(e=>render(e,node,'expression'));
      if(runtime && !hasHtml && isCopy(template)) return `window.SCH_I18N.template(${JSON.stringify(template)},[${expressions.join(',')}])`;
      const bits=next.split(/(\{\d+\})/g).map(bit=>{
        if(/^\{\d+\}$/.test(bit)) { const i=+bit.slice(1,-1); if(i<expressions.length) return '${'+expressions[i]+'}'; }
        return bit.replaceAll('\\','\\\\').replaceAll('`','\\`').replaceAll('${','\\${');
      });
      return '`'+bits.join('')+'`';
    }
    const children=[];
    for(const [key,value] of Object.entries(node)) {
      if(key==='parent')continue;
      if(Array.isArray(value)) value.forEach(n=>{if(n?.type)children.push([n,key]);});
      else if(value?.type) children.push([value,key]);
    }
    children.sort((a,b)=>a[0].start-b[0].start);
    let out='',cursor=node.start;
    for(const [child,key] of children) {
      if(child.start<cursor)continue;
      out+=source.slice(cursor,child.start)+render(child,node,key);cursor=child.end;
    }
    return out+source.slice(cursor,node.end);
  }
  return render(ast);
}
