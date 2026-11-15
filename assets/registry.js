/* Registre de contenu : chaque fichier de content/ appelle SITE.tab(), SITE.page(), SITE.fiche()… */
window.SITE = {
  meta: {},
  tabs: {},
  pages: {},
  fiches: [],
  models: [],
  tab(o) { this.tabs[o.id] = o; },
  page(o) { this.pages[o.id] = o; },
  fiche(o) { this.fiches.push(o); },
  model(o) { this.models.push(o); },
  set(key, value) { this.meta[key] = value; }
};
