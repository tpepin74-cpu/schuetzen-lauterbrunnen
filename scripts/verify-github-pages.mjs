import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = path.join(root, 'dist');
const origin = 'https://tpepin74-cpu.github.io';
const base = '/schuetzen-lauterbrunnen/';
const locales = ['fr', 'de', 'en', 'zh', 'ru', 'ko', 'it', 'es'];
const pages = ['index', 'chambres', 'restaurant', 'sejours', 'vallee', 'maison', 'infos', 'reservation'];
const errors = [];
let references = 0;
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"');
const exists = file => fs.existsSync(file) && fs.statSync(file).isFile();

function checkReference(value, source) {
  value = decode(value.trim());
  if (!value || /^(?:#|%23|data:|mailto:|tel:|blob:|javascript:)/i.test(value)) return;
  const url = new URL(value, origin + base + source);
  if (url.origin !== origin) return;
  references++;
  if (!url.pathname.startsWith(base)) {
    errors.push(`${source}: URL outside project: ${value}`);
    return;
  }
  const relative = decodeURIComponent(url.pathname.slice(base.length));
  const target = path.join(dist, relative.endsWith('/') || !relative ? relative + 'index.html' : relative);
  if (!exists(target)) errors.push(`${source}: missing resource: ${value}`);
}

for (const lang of locales) for (const page of pages) {
  const relative = (lang === 'de' ? '' : lang + '/') + page + '.html';
  const html = fs.readFileSync(path.join(dist, relative), 'utf8');
  const robots = [...html.matchAll(/<meta\b[^>]*name=["']robots["'][^>]*content=["']([^"']*)["'][^>]*>/gi)];
  if (robots.length !== 1 || !['noindex', 'nofollow', 'noimageindex'].every(rule => robots[0]?.[1].split(/\s*,\s*/).includes(rule))) errors.push(`${relative}: noindex policy missing or incomplete`);
  const expectedCanonical = origin + base + (lang === 'de' ? '' : lang + '/') + (page === 'index' ? '' : page + '.html');
  const canonical = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i)?.[1];
  if (canonical !== expectedCanonical) errors.push(`${relative}: canonical mismatch: ${canonical}`);
  const alternates = [...html.matchAll(/<link\b[^>]*rel=["']alternate["'][^>]*href=["']([^"']*)["']/gi)];
  if (alternates.length !== 9) errors.push(`${relative}: expected 9 language alternates`);
  for (const match of html.matchAll(/\s(?:src|href|poster|data-lb-src)=["']([^"']*)["']/gi)) checkReference(match[1], relative);
  for (const match of html.matchAll(/\ssrcset=["']([^"']*)["']/gi)) for (const candidate of match[1].split(',')) checkReference(candidate.trim().split(/\s+/)[0], relative);
  if (html.includes('schuetzen-lauterbrunnen-atelier.thibault-ds.chatgpt.site')) errors.push(`${relative}: old hosting URL remains`);
}

function walk(directory) {
  return fs.readdirSync(directory, {withFileTypes:true}).flatMap(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
}
for (const file of walk(dist)) {
  const relative = path.relative(dist, file).split(path.sep).join('/');
  if (file.endsWith('.css')) {
    const css = fs.readFileSync(file, 'utf8');
    for (const match of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) checkReference(match[1], relative);
  }
  if (relative.startsWith('locales/') && relative.endsWith('/site.js')) {
    const js = fs.readFileSync(file, 'utf8');
    if (/(?:["'`]|,\s*)\/?img\//.test(js)) errors.push(`${relative}: unprefixed runtime image URL`);
  }
}
for (const lang of locales) {
  const relative = `locales/${lang}/manifest.webmanifest`;
  const manifest = JSON.parse(fs.readFileSync(path.join(dist, relative), 'utf8'));
  if (manifest.id !== base || manifest.scope !== base || !manifest.start_url.startsWith(base)) errors.push(`${relative}: manifest scope or start_url mismatch`);
  checkReference(manifest.start_url, relative);
  for (const icon of manifest.icons) checkReference(icon.src, relative);
}
for (const media of ['assets/optimized/collage/bernard-paw-640.webp', 'assets/optimized/collage/concierge-wink-480.webp', 'assets/easter/cow-moo.mp3', 'assets/optimized/easter/fondue-fork-320.webp']) checkReference(base + media, 'index.html');
const notFound = fs.readFileSync(path.join(dist, '404.html'), 'utf8');
assert.match(notFound, /name="robots" content="noindex,nofollow,noimageindex"/);
assert(!exists(path.join(dist, 'sitemap.xml')), 'Unlisted build must not publish a sitemap');
assert(!exists(path.join(dist, 'llms.txt')), 'Unlisted build must not publish llms.txt');
assert.match(fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8'), /Allow: \/\s/);
assert(!fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8').includes('Disallow: /'), 'Crawlers must be able to read the noindex tags');

const report = {status:errors.length ? 'failed' : 'passed', contentPages:64, notFoundPage:true, locales:8, referencesChecked:references, basePath:base, noindex:true, sitemap:false, errors};
fs.mkdirSync(path.join(root, 'docs'), {recursive:true});
fs.writeFileSync(path.join(root, 'docs/github-pages-validation.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
