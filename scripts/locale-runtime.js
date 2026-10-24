/* Shared locale helpers. Only the active language's small dictionary is loaded. */
(() => {
  const config = window.SCH_LOCALE;
  const normalize = value => String(value ?? '').replace(/\s+/gu, ' ').trim();
  const t = value => config.strings[normalize(value)] ?? value;
  const substitute = (message, values) => message.replace(/\{(\w+)\}/g, (token, key) => values[key] === undefined ? token : String(values[key]));
  const rules = new Intl.PluralRules(config.locale);
  const numbers = new Intl.NumberFormat(config.locale);
  const format = (key, vars = {}) => substitute(config.messages[key] ?? key, vars);
  window.SCH_I18N = {
    locale: config.locale, bookingLang: config.bookingLang, t,
    template: (source, vars) => substitute(t(source), vars),
    format,
    plural: (key, count) => {
      const category = rules.select(Number(count));
      return format(config.messages[key+'.'+category] ? key+'.'+category : key+'.other', {count:numbers.format(count)});
    }
  };
  delete window.SCH_LOCALE;
  document.addEventListener('click', event => {
    document.querySelectorAll('.language-picker[open]').forEach(picker => {
      if(!picker.contains(event.target)) picker.open=false;
    });
    const link=event.target.closest('[data-language-link]');
    if(link) {
      const next=new URL(link.href);
      for(const key of ['sejour','motion']) {
        const value=new URLSearchParams(location.search).get(key);
        if(value)next.searchParams.set(key,value);
      }
      next.hash=location.hash;
      link.href=next.toString();
    }
  });
  document.addEventListener('keydown',event=>{
    if(event.key!=='Escape')return;
    document.querySelectorAll('.language-picker[open]').forEach(picker=>{picker.open=false;picker.querySelector('summary')?.focus();});
  });
})();
