/* Progression de l'apprenante, partagée par tous les outils du site (même origine → même stockage).
   Une expression est identifiée par sa clé normalisée (« parce que », « bien que », « dont »…).
   Événements : 'vu' (affichée/ouverte), 'ok' (bonne réponse), 'ko' (erreur), 'connu' (je connais), 'revoir' (à revoir).
   Statuts : 'nouveau' → 'vu' → 'en-cours' → 'maitrise'.  Stockage : localStorage « cadres:progres ». */
(function () {
  'use strict';
  const KEY = 'cadres:progres';
  const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[’`]/g, "'").replace(/\[[^\]]*\]/g, '').replace(/\(.*?\)/g, '').replace(/…|\.\.\./g, ' ')
    .replace(/\s+\+\s.*$/, '').replace(/[\s.;:,!?]+$/, '').replace(/\s+/g, ' ').trim();
  let data = { v: 1, items: {}, jours: {} };
  try { const raw = localStorage.getItem(KEY); if (raw) { const d = JSON.parse(raw); if (d && d.items) data = d; } } catch (e) { /* stockage indisponible */ }
  const listeners = [];
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* stockage indisponible */ }
    listeners.forEach(fn => { try { fn(); } catch (e) { /* rien */ } });
  }
  const today = () => new Date().toISOString().slice(0, 10);
  function rec(k) { return data.items[k] || (data.items[k] = { vu: 0, ok: 0, ko: 0, serie: 0, connu: false, revoir: false, last: null, outils: {} }); }

  const PROGRES = {
    cle: norm,
    /* Enregistre un événement pour une expression. outil : 'decouvrir', 'atelier', 'carte'… (facultatif) */
    marquer(expr, ev, outil) {
      const k = norm(expr); if (!k) return null;
      const r = rec(k);
      if (ev === 'vu') r.vu++;
      else if (ev === 'ok') { r.ok++; r.serie++; r.revoir = false; }
      else if (ev === 'ko') { r.ko++; r.serie = 0; r.revoir = true; }
      else if (ev === 'connu') { r.connu = !r.connu; if (r.connu) r.revoir = false; }
      else if (ev === 'revoir') { r.revoir = !r.revoir; }
      r.last = today();
      if (outil) r.outils[outil] = (r.outils[outil] || 0) + 1;
      if (ev === 'ok' || ev === 'ko') data.jours[today()] = (data.jours[today()] || 0) + 1;
      save();
      return this.statut(k);
    },
    get(expr) { return data.items[norm(expr)] || null; },
    statut(expr) {
      const r = data.items[norm(expr)];
      if (!r) return 'nouveau';
      if (r.connu || (r.ok >= 3 && r.serie >= 2)) return 'maitrise';
      if (r.ok || r.ko) return 'en-cours';
      if (r.vu) return 'vu';
      return 'nouveau';
    },
    /* Résumé pour une liste d'expressions : { total, nouveau, vu, 'en-cours', maitrise, revoir } */
    resume(exprs) {
      const out = { total: 0, nouveau: 0, vu: 0, 'en-cours': 0, maitrise: 0, revoir: 0 };
      Array.from(new Set(exprs.map(norm))).filter(Boolean).forEach(k => {
        out.total++; out[this.statut(k)]++;
        if (data.items[k] && data.items[k].revoir) out.revoir++;
      });
      return out;
    },
    aRevoir() { return Object.keys(data.items).filter(k => data.items[k].revoir); },
    jours() { return Object.assign({}, data.jours); },
    toutes() { return JSON.parse(JSON.stringify(data.items)); },
    surChangement(fn) { listeners.push(fn); },
    effacer() { data = { v: 1, items: {}, jours: {} }; save(); },
    exporter() { return JSON.stringify(data); }
  };
  window.addEventListener('storage', e => { if (e.key === KEY) { try { data = JSON.parse(e.newValue) || data; listeners.forEach(fn => fn()); } catch (er) { /* rien */ } } });
  window.PROGRES = PROGRES;
})();
