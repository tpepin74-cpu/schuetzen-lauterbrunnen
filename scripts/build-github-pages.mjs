import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const env = {
  ...process.env,
  SITE_BASE_PATH: '/schuetzen-lauterbrunnen/',
  SITE_PUBLIC_ORIGIN: 'https://tpepin74-cpu.github.io',
  SITE_AUDIENCE: 'public-unlisted',
  SITE_INDEXABLE: 'false',
};
const result = spawnSync(process.execPath, [path.join(root, 'node_modules/vite/bin/vite.js'), 'build'], {
  cwd: root, env, stdio: 'inherit',
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
fs.writeFileSync(path.join(root, 'dist/.nojekyll'), '');
fs.writeFileSync(path.join(root, 'dist/404.html'), `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noimageindex"><title>Page introuvable · Schützen</title>
<style>body{margin:0;padding:10vh 24px;background:#f8f4e9;color:#193a2d;font:18px/1.6 system-ui,sans-serif}main{max-width:640px;margin:auto}h1{font:clamp(32px,7vw,56px)/1.1 Georgia,serif}a{display:inline-block;background:#b92e2d;color:white;padding:14px 24px;border-radius:14px;text-decoration:none}a:focus-visible{outline:3px solid #193a2d;outline-offset:5px}</style>
</head><body><main><p>HOTEL SCHÜTZEN · LAUTERBRUNNEN</p><h1>Ce chemin ne mène pas au chalet.</h1><p>Retrouvez les chambres, le restaurant et les idées de séjour depuis l’accueil.</p><a href="/schuetzen-lauterbrunnen/">Revenir à l’accueil</a></main></body></html>`);
const audit = spawnSync(process.execPath, [path.join(root, 'scripts/verify-github-pages.mjs')], {
  cwd: root, env, stdio: 'inherit',
});
if (audit.error) throw audit.error;
process.exit(audit.status ?? 1);
