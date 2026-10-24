import { defineConfig } from 'vite';
import { emitLocaleResources, minifyLocaleResources, localizationPlugin, locales, pages } from './scripts/localize-site.mjs';
export default defineConfig(async ({command}) => {
emitLocaleResources({strict: command === 'build'});
if(command==='build')await minifyLocaleResources();
return {
  esbuild: { jsx: 'automatic' },
  server: { host: '0.0.0.0', allowedHosts: true },
  plugins: [localizationPlugin()],
  build: {
    target: 'es2020', emptyOutDir: true,
    rollupOptions: {
      input: Object.fromEntries(Object.keys(locales).flatMap(lang => pages.map(page => [lang+'-'+page, (lang==='fr'?'':lang+'/')+page+'.html']))),
    },
  },
};});
