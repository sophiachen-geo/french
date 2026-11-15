/* Série éclair (outil 2, variante D) — coller des morceaux, une carte à la fois.
   Accueil : Série de 10 · Choisir un lien · Mes erreurs.
   Carte : deux phrases → « Quelle sorte de lien ? » → « Quel pont ? » → explication
   (le bon pont + les schémas + la règle) → « Retourne le pont » → Suivante. Puis le bilan.
   Données : ../3-pont/catalogue.js et ../3-pont/banque/*.js. Progression : assets/progres.js. */
(function () {
  'use strict';

  const A = window.ATELIER, VIZ = window.VIZ, PR = window.PROGRES;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>');
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  /* Espaces fines insécables devant ; : ! ? » et après « (dans le texte seulement, pas dans les balises). */
  const typo = t => t.replace(/ ([;:!?»])/g, '\u202F$1').replace(/« /g, '«\u202F');
  const put = (el, h) => { if (el) el.innerHTML = String(h).replace(/>([^<]+)</g, (m, x) => '>' + typo(x) + '<'); };
  const reduce = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k, d) { try { const v = localStorage.getItem('eclair:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('eclair:' + k, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } }
  };

  const LIENS = A.liens, LIEN = {}; LIENS.forEach(l => { LIEN[l.id] = l; });
  const P = A.ponts;
  const banque = () => A.banque.filter(it => LIEN[it.rel] && it.ok && it.ok.length && it.ok.every(o => P[o.p])
    && (it.non || []).every(n => P[n.p]) && it.back && P[it.back.p]);
  /* Sortes de lien qu'on ne propose pas à la question 1, parce qu'elles seraient aussi défendables pour ces paires. */
  const AMBIGU = { but: ['cause'], condition: ['temps'], cause: ['temps', 'but'], temps: ['condition', 'cause'] };
  const N_SERIE = 10;

  /* ---------- Codes ---------- */
  const COURT = { temps: 'Temps', cause: 'Cause, conséquence', but: 'But', condition: 'Condition', opposition: 'Opposition',
    concession: 'Concession', comparaison: 'Comparaison', ajout: 'Ajout, exemple', relatif: 'Description' };
  const MODE = { ind: '+ ind', subj: '+ subj', cond: '+ cond', inf: '+ inf', infp: '+ inf passé', part: 'en + -ant',
    nom: '+ nom', adj: 'adj… que', seul: '+ phrase', rel: 'relatif' };
  const MODE_DIT = { ind: '+ indicatif', subj: '+ subjonctif', cond: '+ conditionnel', inf: '+ infinitif', infp: '+ infinitif passé',
    part: 'en + participe présent', nom: '+ nom', adj: 'adjectif … que / pour', seul: 'une phrase normale, le verbe ne change pas', rel: 'pronom relatif' };
  const REG = { O: 'oral', QC: 'Québec', 'F-QC': 'familier québécois', S: 'soutenu' };

  const sv = (d, w = 22, extra = '') => `<svg viewBox="0 0 24 24" width="${w}" height="${w}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;
  const IC_LIEN = {
    temps: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3.2 2"/>',
    cause: '<circle cx="5.5" cy="12" r="2.6"/><path d="M9.5 12h10M15.5 8l4 4-4 4"/>',
    but: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="12" cy="12" r=".9" fill="currentColor"/>',
    condition: '<path d="M3 12h6.5M9.5 12 14 7h6.5M9.5 12l4.5 5h6.5"/><path d="M18 4.5 20.5 7 18 9.5M18 14.5l2.5 2.5-2.5 2.5"/>',
    opposition: '<path d="M4 8h15M15.5 4.5 19 8l-3.5 3.5M20 16H5M8.5 12.5 5 16l3.5 3.5"/>',
    concession: '<path d="M12 21v-7.5" stroke-width="3.4"/><path d="M3 20.5Q12 -1 21 20.5"/><path d="M21 20.5l-4.2-1.6M21 20.5l.4-4.5"/>',
    comparaison: '<path d="M12 4v16M8 20h8M4 7.5h16"/><path d="M4 7.5 1.8 13.5h4.4ZM20 7.5l-2.2 6h4.4Z"/>',
    ajout: '<path d="M12 4.5v15M4.5 12h15" stroke-width="2.8"/>',
    relatif: '<path d="M3.5 3.5h7.6l9.4 9.4-7.6 7.6-9.4-9.4z"/><circle cx="8" cy="8" r="1.4"/>'
  };
  const icLien = (id, w) => sv(IC_LIEN[id] || '', w);
  const IC = {
    ok: sv('<path d="M5 12.5 9.8 17 19 7.5"/>', 18, ' stroke-width="3"'),
    ko: sv('<path d="M7 7l10 10M17 7 7 17"/>', 18, ' stroke-width="3"'),
    son: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    retourne: sv('<path d="M4.5 11a7.5 7.5 0 0 1 13.2-4.6M19.5 13a7.5 7.5 0 0 1-13.2 4.6"/><path d="M18.5 3v4h-4M5.5 21v-4h4"/>'),
    schema: sv('<rect x="3" y="4.5" width="9" height="5.5" rx="1.6"/><rect x="12" y="14" width="9" height="5.5" rx="1.6"/><path d="M7.5 10v6.8H12"/>', 18),
    regle: sv('<path d="M5 4.6A1.6 1.6 0 0 1 6.6 3H19v14H6.6A1.6 1.6 0 0 0 5 18.6zM5 18.6A1.6 1.6 0 0 0 6.6 20.2H19"/><path d="M9 7.5h6"/>', 18),
    eclair: '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M13.5 2.5 5 13.5h6.2L10 21.5l9-11.6h-6.3z" fill="currentColor"/></svg>',
    erreurs: sv('<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 3.5v4h4"/><path d="M12 8.5V12l2.5 1.5"/>', 26),
    fleche: sv('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    gauche: sv('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
    croix: sv('<path d="M6 6l12 12M18 6 6 18"/>'),
    bas: sv('<path d="M6 9l6 6 6-6"/>', 18),
    maison: sv('<path d="M4 11 12 4l8 7M6.5 9.5V20h11V9.5"/>')
  };
  const code = m => m ? `<span class="code" title="${esc(MODE_DIT[m] || m)}">${esc(MODE[m] || m)}</span>` : '';
  const regs = r => r ? r.split(/\s*,\s*/).map(x => `<span class="reg" title="${esc(REG[x] || x)}">${esc(x)}</span>`).join(' ') : '';
  const kb = t => `<span class="kb kb-only" aria-hidden="true">${esc(t)}</span>`;
  const lienPuce = id => `<span class="puce l-${id}"><span class="l-ic">${icLien(id, 17)}</span>${esc(COURT[id])}</span>`;

  /* ---------- Phrases balisées : {pont} <partie introduite> [forme changée] (repris de 35-atelier) ---------- */
  function phrase(s) {
    let out = '', inC = false, inM = false;
    const openM = () => { if (!inC && !inM) { out += '<span class="m">'; inM = true; } };
    const closeM = () => { if (inM) { out += '</span>'; inM = false; } };
    for (const ch of String(s)) {
      if (ch === '<') { closeM(); out += '<span class="cadre">'; inC = true; }
      else if (ch === '>') { out += '</span>'; inC = false; }
      else if (ch === '{') { openM(); out += '<b class="pont">'; }
      else if (ch === '}') out += '</b>';
      else if (ch === '[') { openM(); out += '<span class="chg">'; }
      else if (ch === ']') out += '</span>';
      else { openM(); out += esc(ch); }
    }
    closeM();
    return out;
  }
  const plain = s => String(s).replace(/[<>{}\[\]]/g, '');

  /* ---------- Schéma d'un pont avec les mots de la paire (repris de 35-atelier) ---------- */
  const cut = (s, n) => { s = String(s || ''); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
  function marksFor(k, C1, M1) {
    const c = cut(C1, 16), m = cut(M1, 16);
    switch (k) {
      case 't-point': return { lanes: 2, m: [{ k: 'point', x: 26, c: 'cadre', lane: 0 }, { k: 'text', x: 34, text: c, c: 'cadre', anchor: 'start', lane: 0 }, { k: 'box', x1: 30, x2: 96, text: m, lane: 1 }] };
      case 't-sim': return { lanes: 2, m: [{ k: 'box', x1: 4, x2: 96, c: 'cadre', text: c, lane: 0 }, { k: 'box', x1: 4, x2: 96, text: m, lane: 1 }] };
      case 't-moment': return { lanes: 2, m: [{ k: 'box', x1: 4, x2: 96, c: 'cadre', text: c, lane: 0 }, { k: 'point', x: 50, lane: 1 }, { k: 'text', x: 56, text: m, anchor: 'start', lane: 1 }] };
      case 't-depuis': return { lanes: 2, axis: { today: 62 }, m: [{ k: 'point', x: 14, c: 'cadre', lane: 0 }, { k: 'text', x: 20, text: c, c: 'cadre', anchor: 'start', lane: 0 }, { k: 'arrow', x1: 14, x2: 74, lane: 1 }, { k: 'text', x: 78, text: 'encore', anchor: 'start', lane: 1 }] };
      case 't-avant': return { lanes: 2, m: [{ k: 'box', x1: 2, x2: 48, text: m, lane: 1 }, { k: 'box', x1: 52, x2: 98, c: 'cadre', text: c, lane: 0 }] };
      case 't-apres': return { lanes: 2, m: [{ k: 'box', x1: 2, x2: 48, c: 'cadre', text: c, lane: 0 }, { k: 'box', x1: 52, x2: 98, text: m, lane: 1 }] };
      case 't-des': return { lanes: 2, m: [{ k: 'point', x: 10, c: 'cadre', lane: 0 }, { k: 'text', x: 16, text: c, c: 'cadre', anchor: 'start', lane: 0 }, { k: 'box', x1: 14, x2: 98, text: m, lane: 1 }] };
      case 't-unefois': return { lanes: 2, m: [{ k: 'box', x1: 2, x2: 42, c: 'cadre', text: c, lane: 0 }, { k: 'box', x1: 58, x2: 98, text: m, lane: 1 }] };
      case 't-jusqua': return { lanes: 2, m: [{ k: 'box', x1: 2, x2: 70, text: m, lane: 1 }, { k: 'point', x: 74, c: 'cadre', lane: 0 }, { k: 'text', x: 80, text: c, c: 'cadre', anchor: 'start', lane: 0 }] };
      case 't-tant': return { lanes: 2, m: [{ k: 'box', x1: 2, x2: 76, c: 'cadre', text: c, lane: 0 }, { k: 'box', x1: 2, x2: 76, text: m, lane: 1 }, { k: 'tick', x: 82, c: 'muted', lane: 0 }, { k: 'tick', x: 82, c: 'muted', lane: 1 }] };
      case 't-chaque': return { lanes: 2, m: [12, 44, 76].map(x => ({ k: 'point', x, c: 'cadre', lane: 0 })).concat([12, 44, 76].map(x => ({ k: 'bar', x1: x + 3, x2: x + 18, lane: 1 }))).concat([{ k: 'text', x: 2, text: c, c: 'cadre', anchor: 'start', lane: 0, dy: -9 }]) };
      case 't-fur': return { lanes: 2, m: [4, 28, 52, 76].map(x => ({ k: 'bar', x1: x, x2: x + 20, c: 'cadre', lane: 0 })).concat([4, 28, 52, 76].map(x => ({ k: 'bar', x1: x, x2: x + 20, lane: 1 }))) };
      case 'c-apres': return { m: [{ k: 'box', x1: 0, x2: 42, text: m }, { k: 'arrow', x1: 57, x2: 45, c: 'cadre' }, { k: 'box', x1: 58, x2: 100, c: 'cadre', text: c }] };
      case 'c-avant': return { m: [{ k: 'box', x1: 0, x2: 42, c: 'cadre', text: c }, { k: 'arrow', x1: 45, x2: 56, c: 'cadre' }, { k: 'box', x1: 58, x2: 100, text: m }] };
      case 'c-connue': return { m: [{ k: 'box', x1: 0, x2: 42, c: 'cadre', text: c + ' ✓' }, { k: 'arrow', x1: 45, x2: 56, c: 'cadre' }, { k: 'box', x1: 58, x2: 100, text: m }] };
      case 'c-pos': return { m: [{ k: 'box', x1: 0, x2: 42, c: 'cadre', text: c }, { k: 'sign', x: 50, text: '+' }, { k: 'box', x1: 58, x2: 100, text: m }] };
      case 'c-neg': return { m: [{ k: 'box', x1: 0, x2: 42, c: 'cadre', text: c }, { k: 'sign', x: 50, text: '−' }, { k: 'box', x1: 58, x2: 100, text: m }] };
      case 'c-manque': return { m: [{ k: 'box', x1: 0, x2: 42, c: 'cadre', text: c + ' ?', dashed: true }, { k: 'arrow', x1: 45, x2: 56, c: 'cadre' }, { k: 'box', x1: 58, x2: 100, text: m }] };
      case 'c-force': return { m: [0, 11, 22, 33].map(x => ({ k: 'box', x1: x, x2: x + 9, c: 'cadre' })).concat([{ k: 'arrow', x1: 45, x2: 56, c: 'cadre' }, { k: 'box', x1: 58, x2: 100, text: m }, { k: 'text', x: 21, text: c, c: 'cadre', dy: -11 }]) };
      case 'c-renfort': return { m: [{ k: 'box', x1: 0, x2: 34, text: m }, { k: 'box', x1: 40, x2: 62, c: 'muted', text: 'raison 1' }, { k: 'sign', x: 68, text: '+' }, { k: 'box', x1: 74, x2: 100, c: 'cadre', text: cut(C1, 10) }] };
      case 'c-csq': return { m: [{ k: 'box', x1: 0, x2: 42, text: m }, { k: 'arrow', x1: 45, x2: 56, c: 'cadre' }, { k: 'box', x1: 58, x2: 100, c: 'cadre', text: c }] };
      case 'c-intense': return { m: [{ k: 'bar', x1: 0, x2: 42 }, { k: 'text', x: 21, text: m, dy: -9 }, { k: 'arrow', x1: 45, x2: 56, c: 'cadre' }, { k: 'box', x1: 58, x2: 100, c: 'cadre', text: c }] };
      case 'c-trop': return { m: [{ k: 'bar', x1: 0, x2: 54 }, { k: 'tick', x: 38, c: 'muted' }, { k: 'text', x: 38, text: 'limite', dy: -11, c: 'muted' }, { k: 'box', x1: 62, x2: 100, c: 'cadre', text: c, cross: true }] };
      case 'c-assez': return { m: [{ k: 'bar', x1: 0, x2: 38 }, { k: 'tick', x: 38, c: 'muted' }, { k: 'text', x: 38, text: 'limite', dy: -11, c: 'muted' }, { k: 'arrow', x1: 42, x2: 58, c: 'cadre' }, { k: 'box', x1: 62, x2: 100, c: 'cadre', text: c }] };
      case 'b-meme': return { m: [{ k: 'person', x: 4, text: 'je' }, { k: 'arrow', x1: 10, x2: 40, c: 'cadre' }, { k: 'box', x1: 42, x2: 88, c: 'cadre', text: c }, { k: 'flag', x: 93, c: 'cadre' }] };
      case 'b-autre': return { m: [{ k: 'person', x: 4, text: 'je' }, { k: 'arrow', x1: 10, x2: 34, c: 'cadre' }, { k: 'person', x: 41, text: 'autre', c: 'cadre' }, { k: 'box', x1: 48, x2: 88, c: 'cadre', text: c }, { k: 'flag', x: 93, c: 'cadre' }] };
      case 'b-eviter': return { m: [{ k: 'person', x: 4, text: 'je' }, { k: 'arrow', x1: 10, x2: 40 }, { k: 'box', x1: 42, x2: 86, c: 'cadre', text: c, cross: true, dashed: true }, { k: 'flag', x: 92, c: 'neg', cross: true }] };
      case 'b-peur': return { m: [{ k: 'person', x: 4, text: 'je' }, { k: 'arrow', x1: 10, x2: 36 }, { k: 'sign', x: 42, text: '!', c: 'neg' }, { k: 'box', x1: 48, x2: 88, c: 'cadre', text: c, dashed: true }, { k: 'flag', x: 93, c: 'neg', dashed: true, cross: true }] };
      case 'b-loin': return { m: [{ k: 'person', x: 4, text: 'je' }, { k: 'arrow', x1: 10, x2: 54, c: 'cadre', dashed: true }, { k: 'box', x1: 56, x2: 90, c: 'cadre', text: c, dashed: true }, { k: 'flag', x: 95, c: 'cadre' }] };
      case 'h-reel': return { axis: { today: 40 }, m: [{ k: 'point', x: 52, c: 'cadre' }, { k: 'text', x: 52, text: c, c: 'cadre', dy: -9 }, { k: 'arrow', x1: 56, x2: 92 }, { k: 'text', x: 78, text: m, dy: 12 }] };
      case 'h-imag': return { axis: { today: 40 }, m: [{ k: 'box', x1: 20, x2: 54, c: 'cadre', text: c, dashed: true }, { k: 'arrow', x1: 56, x2: 96, dashed: true }, { k: 'text', x: 76, text: m, dy: -9 }] };
      case 'h-passe': return { axis: { today: 90 }, m: [{ k: 'box', x1: 0, x2: 38, c: 'cadre', text: c, dashed: true }, { k: 'box', x1: 44, x2: 82, text: m, dashed: true, cross: true }] };
      case 'h-cas': return { axis: { today: 40 }, m: [{ k: 'box', x1: 22, x2: 58, text: m }, { k: 'point', x: 80, c: 'cadre', fill: 'open', dashed: true }, { k: 'text', x: 80, text: c + ' ?', c: 'cadre', dy: -9 }] };
      case 'h-porte': return { m: [{ k: 'wall', x: 46, c: 'cadre', text: c }, { k: 'arrow', x1: 30, x2: 96 }, { k: 'text', x: 80, text: m, dy: 12 }] };
      case 'h-sauf': return { m: [{ k: 'arrow', x1: 2, x2: 82 }, { k: 'text', x: 20, text: m, dy: 12 }, { k: 'box', x1: 48, x2: 80, c: 'cadre', text: c, dashed: true }, { k: 'cross', x: 92 }] };
      case 'o-contraste': return { m: [{ k: 'box', x1: 0, x2: 42, text: m }, { k: 'sign', x: 50, text: '⇄', c: 'muted' }, { k: 'box', x1: 58, x2: 100, c: 'cadre', text: c }] };
      case 'o-plusmoins': return { m: [{ k: 'box', x1: 0, x2: 40, text: m }, { k: 'sign', x: 46, text: '−', c: 'neg' }, { k: 'sign', x: 54, text: '+', c: 'pos' }, { k: 'box', x1: 60, x2: 100, c: 'cadre', text: c }] };
      case 'o-sens': return { lanes: 2, m: [{ k: 'arrow', x1: 50, x2: 4, c: 'cadre', lane: 0 }, { k: 'text', x: 54, text: c, c: 'cadre', anchor: 'start', lane: 0 }, { k: 'arrow', x1: 50, x2: 96, lane: 1 }, { k: 'text', x: 46, text: m, anchor: 'end', lane: 1 }] };
      case 'o-remplace': return { m: [{ k: 'box', x1: 0, x2: 42, c: 'cadre', text: c, cross: true, dashed: true }, { k: 'arrow', x1: 45, x2: 56, c: 'muted' }, { k: 'box', x1: 58, x2: 100, text: m }] };
      case 'k-mur': return { m: [{ k: 'arrow', x1: 2, x2: 98 }, { k: 'wall', x: 44, c: 'cadre', text: c }, { k: 'text', x: 76, text: m, dy: 12 }] };
      case 'k-pourtant': return { m: [{ k: 'box', x1: 0, x2: 38, c: 'cadre', text: c }, { k: 'wall', x: 45, c: 'muted' }, { k: 'arrow', x1: 41, x2: 98 }, { k: 'text', x: 74, text: m, dy: 12 }] };
      case 'k-beau': return { m: [0, 12, 24].map(x => ({ k: 'box', x1: x, x2: x + 10, c: 'cadre' })).concat([{ k: 'text', x: 17, text: c, c: 'cadre', dy: -11 }, { k: 'arrow', x1: 38, x2: 54 }, { k: 'box', x1: 58, x2: 100, text: m, cross: true }]) };
      case 'm-plus': return { lanes: 2, m: [{ k: 'box', x1: 0, x2: 52, c: 'cadre', text: c, lane: 0 }, { k: 'box', x1: 0, x2: 86, text: m, lane: 1 }] };
      case 'm-moins': return { lanes: 2, m: [{ k: 'box', x1: 0, x2: 82, c: 'cadre', text: c, lane: 0 }, { k: 'box', x1: 0, x2: 46, text: m, lane: 1 }] };
      case 'm-egal': return { lanes: 2, m: [{ k: 'box', x1: 0, x2: 68, c: 'cadre', text: c, lane: 0 }, { k: 'box', x1: 0, x2: 68, text: m, lane: 1 }, { k: 'tick', x: 72, c: 'muted', lane: 0 }, { k: 'tick', x: 72, c: 'muted', lane: 1 }] };
      case 'm-comme': return { m: [{ k: 'box', x1: 0, x2: 42, text: m }, { k: 'sign', x: 50, text: '≈', c: 'muted' }, { k: 'box', x1: 58, x2: 100, c: 'cadre', text: c }] };
      case 'a-plus': return { m: [{ k: 'box', x1: 0, x2: 42, text: m }, { k: 'sign', x: 50, text: '+' }, { k: 'box', x1: 58, x2: 100, c: 'cadre', text: c }] };
      case 'a-exemple': return { m: [{ k: 'box', x1: 0, x2: 48, text: m }, { k: 'arrow', x1: 51, x2: 62, c: 'cadre' }, { k: 'box', x1: 64, x2: 100, c: 'cadre', text: c }] };
      case 'a-precis': return { m: [{ k: 'box', x1: 0, x2: 42, text: m }, { k: 'sign', x: 50, text: '=', c: 'muted' }, { k: 'box', x1: 58, x2: 100, c: 'cadre', text: c }] };
      case 'r-rel': return { m: [{ k: 'box', x1: 0, x2: 36, text: m }, { k: 'line', x1: 36, x2: 42, c: 'muted' }, { k: 'box', x1: 42, x2: 100, c: 'cadre', text: c }] };
      default: return { m: [{ k: 'box', x1: 0, x2: 42, text: m }, { k: 'arrow', x1: 45, x2: 56, c: 'muted' }, { k: 'box', x1: 58, x2: 100, c: 'cadre', text: c }] };
    }
  }
  function schema(id, item, c, sub) {
    const p = P[id];
    const cadre = c === 'a' ? item.as : item.bs, main = c === 'a' ? item.bs : item.as;
    const mk = marksFor(p.k, cadre, main);
    const spec = { lanes: mk.lanes || 1, flow: !mk.axis && (mk.lanes || 1) === 1, axis: mk.axis || null, rows: [{ label: p.e, sub: sub || '', marks: mk.m }] };
    if (mk.axis) spec.axis = { today: mk.axis.today, labels: [[mk.axis.today, 'maintenant']] };
    return VIZ.render(spec, { title: false });
  }
  /* Raison courte sous un schéma : la première moitié de l'explication, sans répéter le nom du pont. */
  function raisonCourte(why) {
    let s = String(why || '').split(/\s[;:]\s|\.\s/)[0];
    s = s.replace(/^«\s*[^»]+»\s*/, '').replace(/[*]/g, '');
    s = s.charAt(0).toUpperCase() + s.slice(1);
    return cut(s.replace(/[.\s]+$/, ''), 96);
  }
  const indice = rel => { const a = LIEN[rel].aide || ''; const i = a.indexOf(' :'); const t = (i > 0 ? a.slice(0, i) : a).replace(/\.$/, '') + '.'; return t.charAt(0).toLowerCase() + t.slice(1); };

  /* ---------- Voix ---------- */
  const canSpeak = 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';
  function speak(text) {
    if (!canSpeak) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'fr-CA'; u.rate = 0.92;
      const v = speechSynthesis.getVoices().find(x => /fr[-_]CA/i.test(x.lang)) || speechSynthesis.getVoices().find(x => /^fr/i.test(x.lang));
      if (v) u.voice = v;
      speechSynthesis.speak(u);
    } catch (e) { /* synthèse indisponible */ }
  }
  const ecouter = s => canSpeak ? `<button type="button" class="ecouter" data-say="${esc(plain(s))}">${IC.son}Écouter</button>` : '';

  /* ---------- Choix des paires ---------- */
  const RANG = { nouveau: 0, vu: 1, 'en-cours': 2, maitrise: 3 };
  const rang = it => Math.min(...it.ok.map(o => RANG[PR.statut(P[o.p].e)] || 0));
  function paresErreurs() {
    const rev = new Set(PR.aRevoir());
    return banque().filter(it => it.ok.some(o => rev.has(PR.cle(P[o.p].e))));
  }
  function choisir(list, n, varier) {
    const vus = store.get('vus', []);
    const tri = list.map(it => ({ it, s: rang(it) + (vus.includes(it.id) ? 2.5 : 0) + Math.random() * 2 })).sort((a, b) => a.s - b.s).map(x => x.it);
    if (!varier) return tri.slice(0, n);
    const out = [], par = {};
    tri.forEach(it => { if (out.length < n && (par[it.rel] || 0) < 2) { out.push(it); par[it.rel] = (par[it.rel] || 0) + 1; } });
    tri.forEach(it => { if (out.length < n && !out.includes(it)) out.push(it); });
    /* Éviter deux fois de suite la même sorte de lien. */
    const res = shuffle(out);
    for (let i = 1; i < res.length; i++) {
      if (res[i].rel === res[i - 1].rel) { const j = res.findIndex((x, k) => k > i && x.rel !== res[i - 1].rel); if (j > 0) [res[i], res[j]] = [res[j], res[i]]; }
    }
    return res;
  }
  function carte(it, sauterQ1) {
    const exclus = AMBIGU[it.rel] || [];
    const voisins = (A.voisins[it.rel] || []).filter(x => !exclus.includes(x));
    const autres = LIENS.map(l => l.id).filter(x => x !== it.rel && !voisins.includes(x) && !exclus.includes(x));
    return {
      it,
      liensOpts: shuffle([it.rel].concat(shuffle(voisins).slice(0, 2), shuffle(autres)).slice(0, 4)),
      pontsOpts: shuffle(it.ok.map(o => ({ p: o.p, ok: true, o })).concat(it.non.map(n => ({ p: n.p, ok: false, n })))),
      phase: sauterQ1 ? 'q2' : 'q1', sauterQ1: !!sauterQ1, ko1: [], choix: null, retourne: false, tous: false
    };
  }

  /* ---------- État ---------- */
  const S = { ecran: 'accueil', mode: 'mix', lien: null, serie: [], i: 0, revue: null, busy: false };
  const cur = () => S.serie[S.revue != null ? S.revue : S.i];
  const app = $('#app');

  function demarrer(mode, lien) {
    let list, varier = false;
    if (mode === 'lien') list = banque().filter(it => it.rel === lien);
    else if (mode === 'erreurs') list = paresErreurs();
    else { list = banque(); varier = true; }
    if (!list.length) { accueil(); return; }
    S.mode = mode; S.lien = lien || null; S.i = 0; S.revue = null; S.busy = false;
    S.serie = choisir(list, N_SERIE, varier).map(it => carte(it, mode === 'lien'));
    S.ecran = 'carte';
    vueCarte(true);
  }

  /* ---------- Écran : accueil ---------- */
  function accueil() {
    S.ecran = 'accueil'; S.revue = null;
    const nErr = paresErreurs().length;
    const d = store.get('dernier', null);
    put(app, `
      <section class="accueil">
        <div class="acc-h"><div><h1>Série éclair</h1><p>Deux phrases, un pont. Une carte à la fois.</p></div>
          <button type="button" class="aide-btn" data-act="codes" aria-label="Les codes (légende)">?</button></div>
        <div class="menu">
          <button type="button" class="gros gros-p" data-act="serie"><span class="gros-ic">${IC.eclair}</span><span class="txt"><b>Série de ${N_SERIE}</b><small>Tous les liens, mélangés</small></span><span class="fl">${IC.fleche}</span></button>
          <button type="button" class="gros" data-act="liens"><span class="gros-ic"><span class="nuancier" aria-hidden="true">${LIENS.map(l => `<i class="l-${l.id}"></i>`).join('')}</span></span><span class="txt"><b>Choisir un lien</b><small>Temps, cause, but…</small></span><span class="fl">${IC.fleche}</span></button>
          <button type="button" class="gros" data-act="erreurs"${nErr ? '' : ' disabled aria-describedby="note-err"'}><span class="gros-ic">${IC.erreurs}</span><span class="txt"><b>Mes erreurs</b><small>${nErr ? `${nErr} paire${nErr > 1 ? 's' : ''} à revoir` : 'Rien à revoir'}</small></span>${nErr ? `<span class="badge-n">${nErr}</span>` : ''}</button>
          ${nErr ? '' : '<p class="note" id="note-err">Quand tu te trompes de pont, la paire arrive ici.</p>'}
        </div>
        ${d && d.n ? `<p class="dernier">Dernière série <b>${d.ok}/${d.n}</b><span class="mini" aria-hidden="true">${d.res.map(r => `<i class="${r ? 'ok' : 'ko'}"></i>`).join('')}</span></p>` : ''}
      </section>`);
  }

  /* ---------- Écran : choisir un lien ---------- */
  function vueLiens() {
    S.ecran = 'liens';
    const b = banque();
    put(app, `
      <section>
        <div class="ecran-h"><button type="button" class="rond" data-act="accueil" aria-label="Retour à l’accueil">${IC.gauche}</button><h1>Choisis un lien</h1>
          <button type="button" class="aide-btn" data-act="codes" aria-label="Les codes (légende)">?</button></div>
        <div class="tuiles">${LIENS.map(l => {
          const n = b.filter(it => it.rel === l.id).length;
          return `<button type="button" class="tuile l-${l.id}" data-serie-lien="${l.id}"${n ? '' : ' disabled'}><span class="l-ic">${icLien(l.id, 22)}</span><b>${esc(COURT[l.id])}</b><small>${esc(l.q)}</small></button>`;
        }).join('')}</div>
      </section>`);
    const f = $('.tuile'); if (f) f.focus({ preventScroll: true });
  }

  /* ---------- Écran : la carte ---------- */
  function session() {
    const n = S.serie.length, rev = S.revue != null, idx = rev ? S.revue : S.i;
    const segs = S.serie.map((c, k) => {
      const cls = c.choix ? (c.choix.ok ? 'ok' : 'ko') : (k === idx ? 'cur' : '');
      return `<i class="${cls}"></i>`;
    }).join('');
    const gauche = rev
      ? `<button type="button" class="rond" data-act="bilan" aria-label="Retour au bilan">${IC.gauche}</button>`
      : `<button type="button" class="rond" data-act="quitter" aria-label="Quitter la série">${IC.croix}</button>`;
    return `<div class="session">${gauche}
      <div class="prog" style="--n:${n}" role="progressbar" aria-label="Progression de la série" aria-valuemin="0" aria-valuemax="${n}" aria-valuenow="${idx + 1}" aria-valuetext="Paire ${idx + 1} sur ${n}">${segs}</div>
      <span class="prog-n">${idx + 1}/${n}</span>
      <button type="button" class="aide-btn" data-act="codes" aria-label="Les codes (légende)">?</button></div>`;
  }

  function vueCarte(nouvelle) {
    const c = cur(), it = c.it, connu = c.phase !== 'q1';
    const gap = c.choix ? `<span class="gap-p fait">${esc(P[c.choix.ok ? c.choix.p : it.ok[0].p].e)}</span>` : '<span class="gap-p">?</span>';
    put(app, `${session()}
      <article class="carte${connu ? ` connu l-${it.rel}` : ''}" id="carte" aria-label="Paire de phrases">
        <div class="carte-top"><span class="carte-k">${S.revue != null ? 'Revoir' : S.mode === 'erreurs' ? 'Mes erreurs' : S.mode === 'lien' ? 'Un lien' : 'Série'}</span>
          <span id="puce">${connu ? lienPuce(it.rel) : '<span class="puce puce-vide">Lien ?</span>'}</span></div>
        <div class="paire">
          <p class="src"><span class="tag" aria-label="Phrase A">A</span><span>${esc(it.a)}</span></p>
          <div class="gap" aria-hidden="true">${gap}</div>
          <p class="src"><span class="tag" aria-label="Phrase B">B</span><span>${esc(it.b)}</span></p>
        </div>
        <section class="zone" id="zone" aria-live="polite"></section>
      </article>`);
    majZone(false);
    if (nouvelle) {
      try { window.scrollTo({ top: 0, behavior: 'auto' }); } catch (e) { window.scrollTo(0, 0); }
      const q = $('#zone .q'); if (q) q.focus({ preventScroll: true });
    }
  }

  function setConnu(c) {
    const card = $('#carte');
    card.classList.add('connu', 'l-' + c.it.rel);
    $('#puce').innerHTML = lienPuce(c.it.rel);
    const pu = $('#puce .puce'); if (pu) pu.classList.add('puce-new');
  }

  function majZone(anim) {
    const c = cur(), z = $('#zone');
    put(z, c.phase === 'q1' || c.phase === 'q1-aide' ? zoneQ1(c) : c.phase === 'q2' ? zoneQ2(c) : zoneExp(c));
    if (anim) { z.classList.remove('entre'); void z.offsetWidth; z.classList.add('entre'); }
  }

  function zoneQ1(c) {
    const it = c.it, aide = c.phase === 'q1-aide';
    const btns = c.liensOpts.map((id, k) => {
      const ko = c.ko1.includes(id), ok = aide && id === it.rel;
      const cls = `ch l-${id}${ko ? ' is-ko' : ''}${ok ? ' is-ok' : ''}${aide && !ok && !ko ? ' is-off' : ''}`;
      const dis = ko || aide;
      return `<button type="button" class="${cls}" data-lien="${id}"${dis ? ' aria-disabled="true"' : ''}><span class="l-ic">${icLien(id, 22)}</span><span class="txt"><b>${esc(COURT[id])}</b><small>${esc(LIEN[id].q)}</small></span><span class="etat">${ok ? IC.ok : IC.ko}</span>${kb(String(k + 1))}</button>`;
    }).join('');
    let fb = '';
    if (aide) fb = `<b class="sr">Réponse :</b>C’est <b style="color:var(--good)">${esc(COURT[it.rel])}</b> : ${esc(indice(it.rel))}`;
    else if (c.ko1.length) fb = `<b>Pas ça.</b> Indice : ${esc(indice(it.rel))}`;
    return `<h2 class="q" tabindex="-1"><span class="q-n">1</span>Quelle sorte de lien ?</h2>
      <div class="choix choix-liens">${btns}</div>
      <p class="fb" id="fb">${fb}</p>
      ${aide ? `<div class="suite"><button type="button" class="btn-p" data-act="continuer">Continuer ${IC.fleche}</button>${kb('Entrée')}</div>` : ''}`;
  }

  function zoneQ2(c) {
    const btns = c.pontsOpts.map((o, k) => {
      const p = P[o.p];
      return `<button type="button" class="ch" data-pont="${o.p}"><span class="txt"><b>${esc(p.e)}</b></span>${code(p.m)}${kb(String(k + 1))}</button>`;
    }).join('');
    return `<h2 class="q" tabindex="-1"><span class="q-n">2</span>Quel pont ?</h2>
      <div class="choix choix-ponts">${btns}</div>`;
  }

  function zoneExp(c) {
    const it = c.it, ch = c.choix, rev = S.revue != null;
    const bonChoisi = ch.ok;
    const main = bonChoisi ? ch.o : it.ok[0];
    const autre = it.ok.find(o => o.p !== main.p);
    const pm = P[main.p];
    const bandeau = bonChoisi
      ? `<div class="bandeau ok" id="bandeau" tabindex="-1"><span class="rond-s">${IC.ok}</span><div><p class="titre">Oui ! « ${esc(P[ch.p].e)} » colle A et B.</p></div></div>`
      : `<div class="bandeau ko" id="bandeau" tabindex="-1"><span class="rond-s">${IC.ko}</span><div><p class="titre">Pas « ${esc(P[ch.p].e)} ».</p><p class="pourquoi">${md(ch.n.why)}</p></div></div>`;

    /* 1. Le bon pont */
    const b1 = `<div class="bloc">
        <p class="bloc-h"><span class="bi vert">${IC.ok}</span><span>Le bon pont</span><b>${esc(pm.e)}</b>${code(pm.m)}</p>
        <p class="ph">${phrase(main.s)}</p>
        <div class="ph-row">${ecouter(main.s)}</div>
        <p class="cle" aria-label="Lecture des couleurs"><span><i class="hl"></i>le pont</span><span><i style="--c:var(--cadre)"></i>la partie qu’il introduit</span><span><i style="--c:var(--main)"></i>la phrase principale</span>${/\[/.test(main.s) ? '<span><i class="pt"></i>ce qui change</span>' : ''}</p>
        ${autre ? `<div class="aussi"><span class="aussi-k">Aussi possible · ${esc(P[autre.p].e)}</span><p class="ph">${phrase(autre.s)}</p></div>` : ''}
      </div>`;

    /* 2. Les schémas : le bon + celui choisi ; les autres sur demande */
    const one = (o, mien) => {
      const p = P[o.p];
      const sub = o.ok ? 'C’est le bon pont.' : raisonCourte(o.n.why);
      const c2 = o.ok ? o.o.c : 'b';
      return `<div class="sch ${o.ok ? 'ok' : 'ko'}${mien ? ' mien' : ''}"><span class="sch-mk" aria-label="${o.ok ? 'Bon pont' : 'Pas ce pont'}">${o.ok ? IC.ok : IC.ko}</span>${mien && !o.ok ? '<p class="sch-mien">Ton choix</p>' : ''}${schema(o.p, it, c2, sub)}</div>`;
    };
    const visibles = [c.pontsOpts.find(o => o.p === main.p)];
    if (!bonChoisi) visibles.push(ch);
    const reste = c.pontsOpts.filter(o => !visibles.includes(o));
    const b2 = `<div class="bloc">
        <p class="bloc-h"><span class="bi">${IC.schema}</span><span>Les schémas</span></p>
        ${visibles.map(o => one(o, o === ch)).join('')}
        ${reste.length ? `<div id="sch-reste"${c.tous ? '' : ' hidden'}>${reste.map(o => one(o, false)).join('')}</div>
        <button type="button" class="btn-t voir" data-act="tous" aria-expanded="${c.tous}" aria-controls="sch-reste">${c.tous ? 'Moins de schémas' : `Voir tous les schémas (${reste.length + visibles.length})`} ${IC.bas}</button>` : ''}
      </div>`;

    /* 3. La règle */
    const b3 = `<div class="bloc">
        <p class="bloc-h"><span class="bi">${IC.regle}</span><span>La règle</span>${code(pm.m)}${regs(pm.reg)}</p>
        <p class="regle">${md(pm.regle)}</p>
      </div>`;

    /* 4. Le pont retourné */
    let b4 = '';
    if (c.retourne) {
      const b = it.back, pb = P[b.p];
      b4 = `<div class="retour" id="retour" tabindex="-1">
          <p class="bloc-h"><span class="bi">${IC.retourne}</span><span>Pont retourné</span><b>${esc(pb.e)}</b>${code(pb.m)}</p>
          <p class="ph">${phrase(b.s)}</p>
          <div class="ph-row">${ecouter(b.s)}</div>
          <p class="change"><span class="change-k">Ce qui change</span>${md(b.fn)}</p>
          <div class="sch">${schema(b.p, it, b.c, '')}</div>
        </div>`;
    }

    let act;
    if (rev) act = `<button type="button" class="btn-p" data-act="bilan">${IC.gauche} Retour au bilan</button>`;
    else if (!c.retourne) act = `<button type="button" class="btn-p" data-act="retourner">${IC.retourne} Retourne le pont</button>`;
    else act = `<button type="button" class="btn-p" data-act="suivante">${S.i + 1 >= S.serie.length ? 'Voir le bilan' : 'Suivante'} ${IC.fleche}</button>`;

    return `${bandeau}${b1}${b2}${b3}${b4}<div class="suite">${act}${kb('Entrée')}</div>`;
  }

  /* ---------- Actions de la carte ---------- */
  function repLien(id, btn) {
    const c = cur();
    if (!c || c.phase !== 'q1' || S.busy || c.ko1.includes(id)) return;
    if (id === c.it.rel) {
      S.busy = true;
      btn.classList.add('is-ok');
      btn.querySelector('.etat').innerHTML = IC.ok;
      $$('#zone .ch').forEach(b => { b.setAttribute('aria-disabled', 'true'); if (b !== btn && !b.classList.contains('is-ko')) b.classList.add('is-off'); });
      put($('#fb'), `<b style="color:var(--good)">Oui : ${esc(COURT[id])}.</b>`);
      $('#fb').classList.add('bon');
      setConnu(c);
      setTimeout(() => { S.busy = false; if (cur() !== c) return; c.phase = 'q2'; majZone(true); const q = $('#zone .q'); if (q) q.focus({ preventScroll: true }); vise($('#zone')); }, 520);
    } else {
      c.ko1.push(id);
      if (c.ko1.length >= 2) {
        c.phase = 'q1-aide';
        setConnu(c);
        majZone(false);
        const b2 = $(`#zone [data-lien="${id}"]`); if (b2) b2.classList.add('secoue');
        const go = $('#zone [data-act="continuer"]');
        if (go) { go.focus({ preventScroll: true }); try { go.scrollIntoView({ block: 'nearest', behavior: reduce() ? 'auto' : 'smooth' }); } catch (e) { /* rien */ } }
      } else {
        btn.classList.add('is-ko', 'secoue');
        btn.setAttribute('aria-disabled', 'true');
        put($('#fb'), `<b>Pas ça.</b> Indice : ${esc(indice(c.it.rel))}`);
      }
    }
  }

  function repPont(id) {
    const c = cur();
    if (!c || c.phase !== 'q2' || c.choix || S.revue != null) return;
    const o = c.pontsOpts.find(x => x.p === id);
    if (!o) return;
    c.choix = o; c.phase = 'exp';
    if (o.ok) PR.marquer(P[o.p].e, 'ok', 'atelier');
    else { c.it.ok.forEach(k => PR.marquer(P[k.p].e, 'ko', 'atelier')); PR.marquer(P[o.p].e, 'vu', 'atelier'); }
    vueCarte(false);
    const z = $('#zone'); z.classList.add('entre');
    const b = $('#bandeau'); if (b) b.focus({ preventScroll: true });
    vise($('#carte'));
  }

  function retourner() {
    const c = cur();
    if (!c || c.phase !== 'exp' || c.retourne) return;
    c.retourne = true;
    PR.marquer(P[c.it.back.p].e, 'vu', 'atelier');
    majZone(false);
    const r = $('#retour'); if (r) { r.classList.add('entre'); r.focus({ preventScroll: true }); vise(r); }
  }

  function suivante() {
    const c = cur();
    if (!c || !c.choix) return;
    const vus = store.get('vus', []).filter(x => x !== c.it.id); vus.push(c.it.id); store.set('vus', vus.slice(-60));
    if (S.i + 1 >= S.serie.length) { finir(); return; }
    S.i++;
    vueCarte(true);
  }

  /* Faire défiler doucement jusqu'à un élément, sous la barre de progression. */
  function vise(el) {
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 70;
    try { window.scrollTo({ top: Math.max(0, top), behavior: reduce() ? 'auto' : 'smooth' }); } catch (e) { window.scrollTo(0, Math.max(0, top)); }
  }

  /* ---------- Écran : bilan ---------- */
  function finir() {
    const res = S.serie.map(c => !!(c.choix && c.choix.ok));
    store.set('dernier', { ok: res.filter(Boolean).length, n: res.length, res, mode: S.mode, lien: S.lien });
    S.revue = null;
    bilan(true);
  }
  function bilan(focusTop) {
    S.ecran = 'bilan';
    const n = S.serie.length, ok = S.serie.filter(c => c.choix && c.choix.ok).length;
    const ratio = n ? ok / n : 0;
    const msg = ratio === 1 ? 'Parfait, tous les ponts tiennent !' : ratio >= .8 ? 'Très bien !' : ratio >= .5 ? 'Bien. Revois les ponts en rouge.' : 'Ça viendra. Revois les ponts en rouge.';
    const manques = [];
    S.serie.forEach(c => { if (c.choix && !c.choix.ok) c.it.ok.forEach(o => { if (!manques.includes(o.p)) manques.push(o.p); }); });
    const nErr = paresErreurs().length;
    put(app, `
      <section class="bilan">
        <p class="bilan-k">${S.mode === 'erreurs' ? 'Mes erreurs' : S.mode === 'lien' ? esc(COURT[S.lien]) : 'Série'} terminée</p>
        <h1 class="score" tabindex="-1" id="score">${ok}<span>/${n}</span></h1>
        <p class="bilan-msg">${esc(msg)}</p>
        <div class="points">${S.serie.map((c, k) => {
          const bon = c.choix && c.choix.ok;
          return `<button type="button" class="point ${bon ? 'ok' : 'ko'}" data-revoir="${k}" aria-label="Paire ${k + 1} : ${bon ? 'réussie' : 'à revoir'}. Revoir.">${bon ? IC.ok : IC.ko}<i>${k + 1}</i></button>`;
        }).join('')}</div>
        <p class="points-aide">Touche un point pour revoir la paire.</p>
        ${manques.length ? `<div class="a-revoir"><h2>Ponts à revoir</h2><div class="chips">${manques.map(p => `<span class="chip l-${P[p].rel}">${esc(P[p].e)} ${code(P[p].m)}</span>`).join('')}</div></div>` : ''}
        <div class="bilan-act">
          <button type="button" class="btn-p" data-act="encore">${IC.eclair} Encore une série</button>
          <button type="button" class="btn-s" data-act="erreurs"${nErr ? '' : ' disabled'}>${IC.erreurs} Mes erreurs${nErr ? ` (${nErr})` : ''}</button>
        </div>
        <p><button type="button" class="btn-t" data-act="accueil">Accueil</button></p>
      </section>`);
    try { window.scrollTo(0, 0); } catch (e) { /* rien */ }
    if (focusTop) { const s = $('#score'); if (s) s.focus({ preventScroll: true }); }
  }

  /* ---------- Légende des codes ---------- */
  function codesHTML() {
    const ex = (cls, t) => `<span class="ph"><span class="${cls}">${t}</span></span>`;
    return `<div class="codes-top"><h2 id="codes-h">Les codes</h2><button type="button" class="rond" data-act="fermer" aria-label="Fermer">${IC.croix}</button></div>
      <h3>Une couleur par sorte de lien</h3>
      <ul class="lg-liens">${LIENS.map(l => `<li class="l-${l.id}"><span class="l-ic">${icLien(l.id, 17)}</span>${esc(COURT[l.id])}</li>`).join('')}</ul>
      <h3>Dans les phrases</h3>
      <ul class="lg">
        <li><span class="ex">${ex('pont', 'quand')}</span>le pont</li>
        <li><span class="ex">${ex('cadre', 'je rentre')}</span>la partie que le pont introduit (orange)</li>
        <li><span class="ex">${ex('m', 'je mange')}</span>la phrase principale (violet)</li>
        <li><span class="ex">${ex('chg', 'rentrée')}</span>ce qui change</li>
      </ul>
      <h3>Les réponses</h3>
      <ul class="lg">
        <li><span class="mk" style="background:var(--good)">${IC.ok}</span>bon pont, bonne réponse</li>
        <li><span class="mk" style="background:var(--bad)">${IC.ko}</span>pas celui-là</li>
      </ul>
      <h3>Ce qui suit le pont</h3>
      <ul class="lg-codes">${Object.keys(MODE).map(m => `<li>${code(m)}<span>${esc(MODE_DIT[m])}</span></li>`).join('')}
        ${Object.keys(REG).map(r => `<li><span class="reg">${esc(r)}</span><span>${esc(REG[r])}</span></li>`).join('')}</ul>
      <h3>Au clavier</h3>
      <ul class="lg-codes"><li><span class="kb">1</span>–<span class="kb">5</span><span>répondre</span></li><li><span class="kb">Entrée</span><span>étape suivante</span></li><li><span class="kb">?</span><span>les codes</span></li><li><span class="kb">Échap</span><span>fermer</span></li></ul>`;
  }
  const dlg = $('#codes');
  let dernierFocus = null;
  function ouvrirCodes() {
    if (!dlg || dlg.open) return;
    if (!$('#codes-in').innerHTML) put($('#codes-in'), codesHTML());
    dernierFocus = document.activeElement;
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    const f = $('#codes [data-act="fermer"]'); if (f) f.focus();
  }
  function fermerCodes() {
    if (!dlg) return;
    if (typeof dlg.close === 'function') dlg.close(); else dlg.removeAttribute('open');
  }
  if (dlg) {
    dlg.addEventListener('close', () => { if (dernierFocus && document.contains(dernierFocus)) dernierFocus.focus({ preventScroll: true }); });
    dlg.addEventListener('click', e => { if (e.target === dlg) fermerCodes(); });
  }

  /* ---------- Action principale (Entrée) ---------- */
  function principal() {
    if (S.ecran === 'bilan') { encore(); return; }
    if (S.ecran !== 'carte') return;
    const c = cur(); if (!c) return;
    if (S.revue != null) { bilan(false); return; }
    if (c.phase === 'q1-aide') { continuer(); return; }
    if (c.phase === 'exp') { if (!c.retourne) retourner(); else suivante(); }
  }
  function continuer() {
    const c = cur(); if (!c || c.phase !== 'q1-aide') return;
    c.phase = 'q2'; majZone(true);
    const q = $('#zone .q'); if (q) q.focus({ preventScroll: true });
    vise($('#zone'));
  }
  function encore() { demarrer(S.mode === 'erreurs' ? 'mix' : S.mode, S.lien); }

  /* ---------- Événements ---------- */
  document.addEventListener('click', e => {
    const t = e.target.closest('button');
    if (!t) return;
    if (t.getAttribute('aria-disabled') === 'true') return;
    const act = t.dataset.act;
    if (t.dataset.lien) { repLien(t.dataset.lien, t); return; }
    if (t.dataset.pont) { repPont(t.dataset.pont); return; }
    if (t.dataset.say) { speak(t.dataset.say); return; }
    if (t.dataset.serieLien) { demarrer('lien', t.dataset.serieLien); return; }
    if (t.dataset.revoir != null) { S.revue = +t.dataset.revoir; S.ecran = 'carte'; vueCarte(true); const b = $('#bandeau'); if (b) b.focus({ preventScroll: true }); return; }
    if (t.id === 'theme') {
      const curT = document.documentElement.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const next = curT === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next); store.set('theme', next);
      return;
    }
    switch (act) {
      case 'serie': demarrer('mix'); break;
      case 'liens': vueLiens(); break;
      case 'erreurs': demarrer('erreurs'); break;
      case 'accueil': accueil(); app.focus({ preventScroll: true }); break;
      case 'quitter': accueil(); app.focus({ preventScroll: true }); break;
      case 'codes': ouvrirCodes(); break;
      case 'fermer': fermerCodes(); break;
      case 'continuer': continuer(); break;
      case 'retourner': retourner(); break;
      case 'suivante': suivante(); break;
      case 'bilan': S.revue = null; bilan(false); break;
      case 'encore': encore(); break;
      case 'tous': {
        const c = cur(); if (!c) break;
        c.tous = !c.tous;
        const r = $('#sch-reste'); if (r) r.hidden = !c.tous;
        const n = $$('#zone .sch').length;
        t.setAttribute('aria-expanded', String(c.tous));
        t.innerHTML = `${c.tous ? 'Moins de schémas' : `Voir tous les schémas (${n})`} ${IC.bas}`;
        break;
      }
      default: break;
    }
  });

  document.addEventListener('keydown', e => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (dlg && dlg.open) return;
    if (e.key === '?') { e.preventDefault(); ouvrirCodes(); return; }
    if (S.ecran === 'carte' && /^[1-5]$/.test(e.key)) {
      const btns = $$('#zone .choix .ch');
      const b = btns[+e.key - 1];
      if (b && b.getAttribute('aria-disabled') !== 'true') { e.preventDefault(); b.click(); }
      return;
    }
    if (e.key === 'Enter') {
      const t = e.target;
      if (t && t.closest && t.closest('button, a, input, select, textarea, summary')) return;
      if (S.ecran === 'carte' || S.ecran === 'bilan') { e.preventDefault(); principal(); }
    }
  });

  accueil();
})();
