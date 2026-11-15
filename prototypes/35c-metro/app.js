/* Outil 2 · C · Le métro des ponts — la carte est l'exercice.
   Une paire de phrases = un trajet : Départ (A) → Arrivée (B).
   1. Quelle ligne prends-tu ? (la sorte de lien)   2. À quelle station ? (le pont)
   3. Pourquoi : le bon pont + les schémas des choix + la règle   4. Retourne le pont.
   Données : ../3-pont/catalogue.js (liens, ponts) et ../3-pont/banque/*.js (paires).
   Progression : assets/progres.js (partagée avec l'atlas). */
(function () {
  'use strict';

  const A = window.ATELIER, VIZ = window.VIZ, PR = window.PROGRES;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  /* Typographie française : espace insécable avant ? ! : ; » et après « */
  const nb = s => String(s).replace(/ ([?!:;»])/g, '\u00a0$1').replace(/« /g, '«\u00a0');
  const esc = s => nb(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>');
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const reduce = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desk = () => window.matchMedia && window.matchMedia('(min-width: 1000px)').matches;
  const store = {
    get(k, d) { try { const v = localStorage.getItem('metro:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('metro:' + k, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } }
  };

  /* ---------- Données ---------- */
  const LIENS = A.liens, LIEN = {}; LIENS.forEach(l => { LIEN[l.id] = l; });
  const P = A.ponts;
  const IDS = Object.keys(P);
  const valide = it => LIEN[it.rel] && it.ok && it.ok.length && it.ok.concat(it.non || []).every(o => P[o.p]);
  const BANQUE = A.banque.filter(valide);
  const banque = () => BANQUE;
  /* Sortes de lien qu'on n'allume pas à la question 1, parce qu'elles seraient aussi défendables pour ces paires
     (un but peut se lire comme une conséquence ; « quand » et « si » se rejoignent ; une cause suit souvent dans le temps). */
  const AMBIGU = { but: ['cause'], condition: ['temps'], cause: ['temps', 'but'], temps: ['condition', 'cause'] };
  const pontsDe = rel => IDS.filter(k => P[k].rel === rel);
  const statutPont = id => PR.statut(P[id].e);
  const SHORT = { temps: 'Temps', cause: 'Cause', but: 'But', condition: 'Condition', opposition: 'Opposition', concession: 'Concession', comparaison: 'Comparaison', ajout: 'Ajout', relatif: 'Description' };
  const CODE = { ind: '+ IND', subj: '+ SUBJ', cond: '+ COND', inf: '+ INF', infp: '+ INF. PASSÉ', part: 'EN + -ANT', nom: '+ NOM', adj: 'ADJ … QUE', seul: '2 PHRASES', rel: 'RELATIF' };
  const CODE_DEF = { ind: 'indicatif', subj: 'subjonctif', cond: 'conditionnel', inf: 'infinitif', infp: 'infinitif passé (avoir / être + participe)', part: 'en + participe présent (-ant)', nom: 'un nom', adj: 'adjectif … + que / pour', seul: 'entre deux phrases : le verbe ne change pas', rel: 'pronom relatif : remplace un nom' };
  const REG = { O: 'oral', S: 'soutenu, plutôt écrit', QC: 'Québec', 'F-QC': 'familier, Québec' };

  /* ---------- Icônes (SVG en ligne) ---------- */
  const ico = (d, w = 20, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" width="${w}" height="${w}" aria-hidden="true" focusable="false">${d}</svg>`;
  const ICON_D = {
    temps: '<circle cx="12" cy="12" r="8"/><path d="M12 7.5V12l3.2 2.2"/>',
    cause: '<circle cx="5.5" cy="12" r="2.4" fill="currentColor" stroke="none"/><path d="M10 12h9.5M15.5 7.8l4 4.2-4 4.2"/>',
    but: '<path d="M6.5 21V3.5"/><path d="M6.5 4.5h11l-2.6 3.7 2.6 3.8h-11"/>',
    condition: '<path d="M12 21v-7.5M12 13.5 6.5 6M12 13.5 17.5 6"/><circle cx="6.5" cy="4.6" r="1.7" fill="currentColor" stroke="none"/><circle cx="17.5" cy="4.6" r="1.7" fill="currentColor" stroke="none"/>',
    opposition: '<path d="M4 8h15M15.5 4.5 19 8l-3.5 3.5M20 16H5M8.5 12.5 5 16l3.5 3.5"/>',
    concession: '<path d="M12 13.5V21" stroke-width="3.6"/><path d="M3.5 19C4.5 8.5 19.5 8.5 20.5 19"/><path d="M17.4 16.8l3.1 2.4 1.3-3.6"/>',
    comparaison: '<path d="M5.5 20v-6M12 20V9M18.5 20V4"/>',
    ajout: '<path d="M12 5v14M5 12h14"/>',
    relatif: '<path d="M10.5 13.5a3.8 3.8 0 0 0 5.4 0l3-3a3.8 3.8 0 0 0-5.4-5.4l-1.2 1.2"/><path d="M13.5 10.5a3.8 3.8 0 0 0-5.4 0l-3 3a3.8 3.8 0 0 0 5.4 5.4l1.2-1.2"/>'
  };
  const lineIcon = id => ico(ICON_D[id] || '', 20);
  const CHECK = '<path d="M5 12.5l4.5 4.5L19 7.5"/>';
  const CROSS = '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>';
  const UNDO = '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 4.2v4.9h4.9"/>';
  const ARROW = '<path d="M5 12h14M13 6l6 6-6 6"/>';
  const CHEV = '<path d="M6 9l6 6 6-6"/>';
  const SPEAK = '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>';
  const roundel = (id, cls = '') => `<span class="rd ${cls} l-${id}" aria-hidden="true">${lineIcon(id)}</span>`;
  const codeChip = m => `<span class="code" title="${esc(A.modes[m] || '')}">${esc(CODE[m] || m)}</span>`;
  const regChip = r => r ? r.split(/\s*,\s*/).map(x => `<span class="reg" title="${esc(REG[x] || x)}">${esc(x)}</span>`).join('') : '';

  /* ---------- Phrases balisées : {pont} <cadre> [forme changée] ---------- */
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

  /* ---------- Schéma d'un pont (une ligne de VIZ, avec les mots de la paire) ---------- */
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

  /* ---------- Remplissage d'une station (progression) ---------- */
  function fillOf(id) {
    const s = statutPont(id);
    if (s === 'maitrise') return 1;
    if (s === 'en-cours') { const r = PR.get(P[id].e); return r && r.ok >= 2 ? 0.75 : 0.5; }
    return 0;
  }
  const STATUT_TXT = { nouveau: 'nouveau', vu: 'nouveau', 'en-cours': 'en cours', maitrise: 'maîtrisé' };

  /* ---------- État ---------- */
  const st = {
    filtre: store.get('filtre', 'tout'), item: null, phase: 'ligne', essais: 0, tried: new Set(), hint: '',
    liensOpts: [], pontsOpts: [], choix: null, retour: false, vus: new Set(), score: store.get('score', { faits: 0, justes: 0 })
  };
  if (st.filtre !== 'tout' && !LIEN[st.filtre]) st.filtre = 'tout';
  if (!st.score || typeof st.score.faits !== 'number') st.score = { faits: 0, justes: 0 };

  function pool() {
    let list = banque();
    if (st.filtre !== 'tout') list = list.filter(it => it.rel === st.filtre);
    if (!list.length) list = banque();
    const rank = it => Math.min(...it.ok.map(o => ({ nouveau: 0, vu: 1, 'en-cours': 2, maitrise: 3 })[statutPont(o.p)]));
    const fresh = list.filter(it => !st.vus.has(it.id));
    const base = fresh.length ? fresh : list;
    const minR = Math.min(...base.map(rank));
    return base.filter(it => rank(it) <= minR + 1);
  }

  function suivant() {
    closeSheet();
    const list = pool();
    if (!list.length) { $('#ask').innerHTML = '<p class="ask-hint">Aucune paire de phrases n’est chargée.</p>'; return; }
    let it = list[Math.floor(Math.random() * list.length)];
    if (st.item && list.length > 1 && it.id === st.item.id) it = list.find(x => x.id !== st.item.id) || it;
    st.vus.add(it.id);
    st.item = it; st.essais = 0; st.tried = new Set(); st.hint = ''; st.choix = null; st.retour = false;
    if (st.filtre !== 'tout') {
      st.liensOpts = [it.rel]; st.phase = 'station';
    } else {
      const exclus = AMBIGU[it.rel] || [];
      const voisins = (A.voisins[it.rel] || []).filter(x => !exclus.includes(x));
      const autres = LIENS.map(l => l.id).filter(x => x !== it.rel && !voisins.includes(x) && !exclus.includes(x));
      st.liensOpts = [it.rel].concat(shuffle(voisins).slice(0, 2), shuffle(autres)).slice(0, 4);
      st.phase = 'ligne';
    }
    st.pontsOpts = shuffle(it.ok.map(o => ({ p: o.p, ok: true, o })).concat((it.non || []).map(n => ({ p: n.p, ok: false, n }))));
    $('#ov').innerHTML = '';
    renderAll();
  }

  /* ---------- Construction de la carte (une seule fois) ---------- */
  function buildMap() {
    $('#lines').innerHTML = '<li class="spine" aria-hidden="true" role="presentation"></li>' + LIENS.map(l => `
      <li class="ln l-${l.id}" data-line="${l.id}">
        <button type="button" class="ln-pick" data-pick="${l.id}"><span class="sr">Ligne ${esc(SHORT[l.id])} (${esc(l.label)})</span></button>
        <span class="ln-n" aria-hidden="true">${esc(SHORT[l.id])}</span>
        <span class="rd" aria-hidden="true">${lineIcon(l.id)}<span class="rd-x">${ico(CROSS, 20)}</span></span>
        <div class="track">${pontsDe(l.id).map(id => `<button type="button" class="st" data-st="${id}" disabled tabindex="-1"><span class="node"><span class="dot"></span><span class="mk" aria-hidden="true"></span></span><span class="st-n">${esc(P[id].e)}</span></button>`).join('')}</div>
      </li>`).join('');
  }
  const row = id => $(`.ln[data-line="${id}"]`);
  const stationEl = id => $(`.st[data-st="${id}"]`);

  function updateFills() {
    $$('.st').forEach(b => { b.style.setProperty('--f', fillOf(b.dataset.st)); });
    renderFoot();
  }

  function applyMap() {
    const map = $('#carte'), it = st.item;
    if (!it) return;
    map.classList.toggle('q1', st.phase === 'ligne');
    map.classList.toggle('q2', st.phase === 'station');
    map.classList.toggle('done', st.phase === 'done');
    const lit = new Set(st.phase !== 'ligne' ? st.pontsOpts.map(o => o.p) : []);
    if (st.retour && it.back) lit.add(it.back.p);
    LIENS.forEach(l => {
      const li = row(l.id), pick = $('.ln-pick', li);
      const offered = st.liensOpts.includes(l.id);
      const q1 = st.phase === 'ligne';
      const has = pontsDe(l.id).some(id => lit.has(id));
      li.classList.toggle('off', q1 && !offered);
      li.classList.toggle('tried', q1 && st.tried.has(l.id));
      li.classList.toggle('reveal', q1 && st.essais >= 2 && l.id === it.rel);
      li.classList.toggle('chosen', !q1 && l.id === it.rel);
      li.classList.toggle('has-lit', !q1 && l.id !== it.rel && has);
      li.classList.toggle('slim', !q1 && l.id !== it.rel && !has);
      pick.disabled = !(q1 && offered && !st.tried.has(l.id) && (st.essais < 2 || l.id === it.rel));
      $('.track', li).setAttribute('aria-hidden', q1 || !has && l.id !== it.rel ? 'true' : 'false');
    });
    $$('.st').forEach(b => {
      const id = b.dataset.st, o = st.pontsOpts.find(x => x.p === id);
      const isLit = lit.has(id);
      const done = st.phase === 'done';
      const isBack = st.retour && it.back && id === it.back.p;
      b.classList.toggle('lit', isLit);
      b.classList.toggle('is-ok', done && !!o && o.ok);
      b.classList.toggle('is-ko', done && !!o && !o.ok);
      b.classList.toggle('mine', done && !!st.choix && st.choix.p === id);
      b.classList.toggle('back', isBack && !o);
      const on = st.phase === 'station' && isLit;
      b.disabled = !on;
      b.tabIndex = on ? 0 : -1;
      b.style.setProperty('--f', fillOf(id));
      const mk = $('.mk', b);
      let lab = P[id].e;
      if (done && o) { mk.innerHTML = ico(o.ok ? CHECK : CROSS, 13); lab += o.ok ? ' : bon pont' : ' : mauvais pont'; }
      else if (isBack && !o) { mk.innerHTML = ico(UNDO, 13); lab += ' : pont retourné'; }
      else mk.innerHTML = '';
      if (isLit) lab += ` (${STATUT_TXT[statutPont(id)]})`;
      b.setAttribute('aria-label', lab);
      if (!isLit) b.removeAttribute('title'); else b.title = `${P[id].e} · ${STATUT_TXT[statutPont(id)]}`;
    });
    requestAnimationFrame(placeSpine);
  }

  /* Le couloir de correspondance relie les pastilles des 9 lignes (« la gare des phrases »). */
  function placeSpine() {
    const sp = $('.spine'), list = $('#lines');
    const rds = $$('.ln > .rd');
    if (!sp || !rds.length) return;
    const lb = list.getBoundingClientRect();
    const a = rds[0].getBoundingClientRect(), b = rds[rds.length - 1].getBoundingClientRect();
    sp.style.top = (a.top + a.height / 2 - lb.top) + 'px';
    sp.style.height = Math.max(0, (b.top + b.height / 2) - (a.top + a.height / 2)) + 'px';
    sp.style.left = (a.left + a.width / 2 - lb.left - 4) + 'px';
  }

  /* ---------- Rendu : trajet, question, pied de carte, panneau ---------- */
  function renderTicket() {
    const it = st.item, tk = $('#ticket');
    const l = st.phase !== 'ligne' ? it.rel : null;
    let br = '';
    if (st.choix) {
      br = `<span class="tk-br ${st.choix.ok ? 'ok' : 'ko'}"><span class="mk-s">${ico(st.choix.ok ? CHECK : CROSS, 12)}</span>${esc(P[st.choix.p].e)}</span>`;
    } else if (l) br = `<span class="tk-br q l-${l}" aria-label="pont à trouver">?</span>`;
    tk.className = 'ticket' + (l ? ' on l-' + l : '');
    tk.innerHTML = `
      <span class="tk-ic a" aria-hidden="true"><i></i></span>
      <div class="tk-a"><p class="tk-k">Départ</p><p class="tk-s">${esc(it.a)}</p></div>
      <span class="tk-ic m" aria-hidden="true">${l ? roundel(l, 'xs') : '<span class="tk-q">?</span>'}</span>
      <div class="tk-m">${l ? `<span class="sr">Ligne ${esc(SHORT[l])}. </span>` : ''}${br}</div>
      <span class="tk-ic b" aria-hidden="true"><i></i></span>
      <div class="tk-b"><p class="tk-k">Arrivée</p><p class="tk-s">${esc(it.b)}</p></div>`;
    document.documentElement.style.setProperty('--tkh', tk.offsetHeight + 'px');
  }

  function renderAsk() {
    let n = 1, t = 'Quelle ligne prends-tu ?';
    if (st.phase === 'station') { n = 2; t = 'À quelle station ?'; }
    if (st.phase === 'done') { n = st.retour ? 4 : 3; t = st.retour ? 'Le pont retourné' : 'Pourquoi ce pont ?'; }
    t = esc(t).replace('prends-tu\u00a0?', '<span class="nw">prends-tu\u00a0?</span>');
    $('#ask').innerHTML = `<p class="ask-q"><span class="ask-n" aria-hidden="true">${n}</span><span class="ask-t" id="ask-t" tabindex="-1"><span class="sr">Étape ${n} sur 4. </span>${t}</span></p>
      ${st.phase !== 'done' ? '<button type="button" class="ask-skip" data-skip>Passer</button>' : '<span></span>'}
      <p class="ask-hint" id="hint">${st.hint}</p>`;
  }

  const pleines = () => IDS.filter(id => statutPont(id) === 'maitrise').length;
  function renderFoot() {
    const f = st.filtre;
    const btn = f === 'tout'
      ? `<button type="button" class="flt" data-open-lignes aria-haspopup="dialog"><span class="all" aria-hidden="true"></span>Toutes les lignes${ico(CHEV, 18)}</button>`
      : `<button type="button" class="flt" data-open-lignes aria-haspopup="dialog">${roundel(f, 'sm')}Ligne ${esc(SHORT[f])}${ico(CHEV, 18)}</button><button type="button" class="flt-x" data-filtre="tout" aria-label="Revenir à toutes les lignes">${ico(CROSS, 18)}</button>`;
    $('#map-foot').innerHTML = `<div class="flt-g">${btn}</div><span class="mf-stat"><span class="mini-dot" aria-hidden="true"></span><span><b>${pleines()}</b>/${IDS.length} stations pleines</span></span>`;
  }

  function guideHTML() {
    const steps = [['La ligne', 'quelle sorte de lien ?'], ['La station', 'quel pont ?'], ['Pourquoi', 'schémas et règle'], ['Retour', 'retourne le pont']];
    const cur = st.phase === 'ligne' ? 0 : 1;
    return `<div class="guide">
      <h2 class="g-h">Ton trajet en 4 arrêts</h2>
      <ol class="g-steps">${steps.map(([b, d], i) => `<li class="${i === cur ? 'cur' : i < cur ? 'past' : ''}"><span class="g-n">${i + 1}</span><span><b>${b}</b><span class="g-d">${esc(d)}</span></span></li>`).join('')}</ol>
      <div class="g-stats"><div><b>${st.score.faits}</b><span>${st.score.faits > 1 ? 'trajets faits' : 'trajet fait'}</span></div><div><b>${pleines()}</b><span>stations pleines sur ${IDS.length}</span></div></div>
      <p class="g-key"><span><i class="sd" aria-hidden="true"></i>nouveau</span><span><i class="sd" style="--f:.5" aria-hidden="true"></i>en cours</span><span><i class="sd" style="--f:1" aria-hidden="true"></i>maîtrisé</span></p>
      <button type="button" class="lnk" data-open-codes>Tous les codes</button>
    </div>`;
  }

  function card(id, o, item, mine) {
    const p = P[id], ok = !!o.ok;
    const head = `<header class="c-h"><span class="c-mk ${ok ? 'ok' : 'ko'}" aria-hidden="true">${ico(ok ? CHECK : CROSS, 15)}</span>${roundel(p.rel, 'xs')}<b class="c-e">${esc(p.e)}</b>${codeChip(p.m)}${regChip(p.reg)}${mine && (!ok || st.pontsOpts.filter(x => x.ok).length > 1) ? '<span class="c-mine">ton choix</span>' : ''}<span class="sr">${ok ? 'Bon pont.' : 'Mauvais pont.'}</span></header>`;
    if (ok) {
      return `<article class="card ok l-${p.rel}${mine ? ' mine' : ''}">${head}
        <p class="ph">${phrase(o.o.s)}</p>
        <div class="c-acts">${speakBtn(plain(o.o.s))}<span class="key" aria-hidden="true"><span class="k-c"><i></i>avec le pont</span><span class="k-m"><i></i>phrase principale</span></span></div>
        <div class="c-viz">${schema(id, item, o.o.c, 'bon pont')}</div>
        <p class="c-rule"><span class="c-rule-k">Règle</span>${md(p.regle)}</p>
      </article>`;
    }
    const why = o.n && o.n.why ? md(o.n.why) : `« ${esc(p.e)} » exprime : ${esc(LIEN[p.rel].label.toLowerCase())}.`;
    return `<article class="card ko l-${p.rel}${mine ? ' mine' : ''}">${head}
      <div class="c-viz">${schema(id, item, 'b', 'mauvais pont')}</div>
      <p class="c-why">${why}</p>
    </article>`;
  }

  function renderPanel() {
    const pn = $('#panel');
    if (st.phase !== 'done') { pn.classList.remove('min'); pn.innerHTML = guideHTML(); return; }
    const it = st.item, o = st.choix;
    const oks = st.pontsOpts.filter(x => x.ok).sort((x, y) => (y.p === o.p) - (x.p === o.p));
    const kos = st.pontsOpts.filter(x => !x.ok).sort((x, y) => (y.p === o.p) - (x.p === o.p));
    pn.innerHTML = `
      <div class="sh-head">
        <span class="res ${o.ok ? 'ok' : 'ko'}" aria-hidden="true">${ico(o.ok ? CHECK : CROSS, 22)}</span>
        <h2 class="res-t" id="res-t" tabindex="-1"><b>${o.ok ? 'Bonne station' : 'Pas cette station'}</b><span>${o.ok ? '' : 'Tu as choisi '}« ${esc(P[o.p].e)} »</span></h2>
        <button type="button" class="sh-tg" data-sheet aria-expanded="true" aria-controls="sh-body" aria-label="Réduire pour voir la carte">${ico(CHEV, 22)}</button>
      </div>
      <div class="sh-body" id="sh-body">
        <h3 class="sec">${oks.length > 1 ? 'Les bons ponts' : 'Le bon pont'}</h3>
        ${oks.map(x => card(x.p, x, it, x.p === o.p)).join('')}
        <h3 class="sec">${kos.length > 1 ? 'Les autres stations' : 'L’autre station'}</h3>
        ${kos.map(x => card(x.p, x, it, x.p === o.p)).join('')}
        <section class="ret" id="ret" hidden></section>
      </div>
      <div class="sh-foot" id="sh-foot">${footHTML()}</div>`;
  }
  function footHTML() {
    const back = st.item && st.item.back && P[st.item.back.p];
    return `${back && !st.retour ? `<button type="button" class="btn ghost" data-retour>${ico(UNDO, 20)}Retourne le pont</button>` : ''}<button type="button" class="btn main" data-next>Paire suivante${ico(ARROW, 20)}</button>`;
  }

  function retourHTML() {
    const it = st.item, b = it.back, p = P[b.p], from = it.ok[0].p, f = P[from];
    const same = from === b.p;
    const stn = (id) => `<span class="cs l-${P[id].rel}"><span class="cs-n"><span class="dot" style="--f:${fillOf(id)}"></span></span><b>${esc(P[id].e)}</b></span>`;
    return `<h3 class="sec">${ico(UNDO, 18)}Le pont retourné</h3>
      ${same ? `<div class="corr" style="grid-template-columns:1fr">${stn(from)}</div>` : `<div class="corr" role="group" aria-label="${esc(`De « ${f.e} » à « ${p.e} »`)}">${stn(from)}<span class="cs-link" aria-hidden="true"><i></i></span>${stn(b.p)}</div>`}
      <div class="card l-${p.rel}" style="border-style:solid">
        <header class="c-h">${roundel(p.rel, 'xs')}<b class="c-e">${esc(p.e)}</b>${codeChip(p.m)}${regChip(p.reg)}</header>
        <p class="ph">${phrase(b.s)}</p>
        <div class="c-acts">${speakBtn(plain(b.s))}</div>
        <div class="c-viz">${schema(b.p, it, b.c, 'pont retourné')}</div>
        <p class="fn"><b>Ce qui change</b>${md(b.fn)}</p>
      </div>`;
  }

  function renderAll() {
    renderTicket(); renderAsk(); applyMap(); renderFoot(); renderPanel();
  }

  /* ---------- Feuille du bas (téléphone) ---------- */
  function openSheet() {
    const pn = $('#panel');
    pn.classList.add('open'); pn.classList.remove('min');
    document.body.classList.add('sheet-open');
    const tg = $('[data-sheet]', pn); if (tg) { tg.setAttribute('aria-expanded', 'true'); tg.setAttribute('aria-label', 'Réduire pour voir la carte'); }
  }
  function closeSheet() {
    const pn = $('#panel');
    pn.classList.remove('open', 'min');
    document.body.classList.remove('sheet-open');
  }
  function toggleSheet() {
    const pn = $('#panel'), min = !pn.classList.contains('min');
    pn.classList.toggle('min', min);
    const tg = $('[data-sheet]', pn);
    if (tg) { tg.setAttribute('aria-expanded', String(!min)); tg.setAttribute('aria-label', min ? 'Voir l’explication' : 'Réduire pour voir la carte'); }
    if (min && st.item) {
      const li = row(st.item.rel);
      if (li) li.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'center' });
      if (st.retour) setTimeout(() => drawConnection(false), reduce() ? 0 : 450);
    }
  }

  /* ---------- Correspondance animée sur la carte ---------- */
  function drawConnection(animate) {
    const ov = $('#ov');
    ov.innerHTML = '';
    const it = st.item;
    if (!st.retour || !it || !it.back) return;
    const from = it.ok[0].p, to = it.back.p;
    if (from === to) return;
    const body = $('#map-body'), bb = body.getBoundingClientRect();
    const d1 = $('.dot', stationEl(from)), d2 = $('.dot', stationEl(to));
    if (!d1 || !d2) return;
    const r1 = d1.getBoundingClientRect(), r2 = d2.getBoundingClientRect();
    const x1 = r1.left + r1.width / 2 - bb.left, y1 = r1.top + r1.height / 2 - bb.top;
    const x2 = r2.left + r2.width / 2 - bb.left, y2 = r2.top + r2.height / 2 - bb.top;
    ov.setAttribute('width', bb.width); ov.setAttribute('height', bb.height);
    ov.setAttribute('viewBox', `0 0 ${bb.width.toFixed(1)} ${bb.height.toFixed(1)}`);
    let d;
    if (Math.abs(y1 - y2) < 10) {
      const h = Math.min(34, Math.abs(x2 - x1) / 3 + 14);
      d = `M${x1.toFixed(1)} ${(y1 - r1.height / 2).toFixed(1)} C${x1.toFixed(1)} ${(y1 - h).toFixed(1)} ${x2.toFixed(1)} ${(y2 - h).toFixed(1)} ${x2.toFixed(1)} ${(y2 - r2.height / 2).toFixed(1)}`;
    } else {
      const down = y2 > y1 ? 1 : -1;
      const sy = y1 + down * r1.height / 2, ey = y2 - down * r2.height / 2, my = (sy + ey) / 2;
      d = `M${x1.toFixed(1)} ${sy.toFixed(1)} C${x1.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${ey.toFixed(1)}`;
    }
    ov.innerHTML = `<path class="cx-case" d="${d}"/><path class="cx-in" d="${d}"/>`;
    if (animate && !reduce()) {
      $$('path', ov).forEach((p, i) => { const len = Math.ceil(p.getTotalLength()) + 2; p.style.setProperty('--len', len); p.classList.add('draw'); if (i) p.classList.add('d2'); });
    }
  }

  /* ---------- Actions ---------- */
  function pickLine(id, kb) {
    const it = st.item;
    if (!it || st.phase !== 'ligne') return;
    if (id === it.rel) {
      st.phase = 'station'; st.hint = '';
      renderTicket(); renderAsk(); applyMap(); renderPanel();
      const li = row(id);
      if (li && !desk()) {
        const r = li.getBoundingClientRect(), tk = $('#ticket').offsetHeight;
        if (r.top < tk + 8 || r.bottom > window.innerHeight) li.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'nearest' });
      }
      if (kb) { const first = $('.st.lit:enabled'); if (first) first.focus(); }
      return;
    }
    st.essais++;
    st.tried.add(id);
    const l = LIEN[it.rel];
    st.hint = st.essais >= 2
      ? `C’est la <span class="hint-l l-${l.id}">${roundel(l.id, 'xs')}ligne ${esc(SHORT[l.id])}</span>${esc(' : « ' + l.q + ' »')} Touche-la.`
      : `<b>Pas cette ligne.</b> ${esc('Pose-toi la question : « ' + l.q + ' »')}`;
    renderAsk(); applyMap();
    const li = row(id);
    if (li) { li.classList.remove('flash'); void li.offsetWidth; li.classList.add('flash'); li.addEventListener('animationend', () => li.classList.remove('flash'), { once: true }); }
    if (kb) {
      const next = st.essais >= 2 ? $(`.ln-pick[data-pick="${it.rel}"]`) : $('.ln-pick:enabled');
      if (next) next.focus();
    }
  }

  function pickStation(id, kb) {
    const it = st.item;
    if (!it || st.phase !== 'station') return;
    const o = st.pontsOpts.find(x => x.p === id);
    if (!o) return;
    st.choix = o; st.phase = 'done';
    st.score.faits++; if (o.ok) st.score.justes++;
    store.set('score', st.score);
    renderTicket(); renderAsk(); applyMap(); renderPanel();
    /* Progression : la station du bon pont se remplit (transition CSS). */
    if (o.ok) PR.marquer(P[o.p].e, 'ok', 'atelier');
    else { it.ok.forEach(k => PR.marquer(P[k.p].e, 'ko', 'atelier')); PR.marquer(P[o.p].e, 'vu', 'atelier'); }
    updateFills();
    it.ok.forEach(k => { const b = stationEl(k.p); if (b && !reduce()) { b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse'); setTimeout(() => b.classList.remove('pulse'), 2100); } });
    if (desk()) { if (kb) $('#res-t').focus(); }
    else setTimeout(() => { if (st.phase === 'done' && st.choix === o) { openSheet(); if (kb) $('#res-t').focus({ preventScroll: true }); } }, reduce() ? 0 : 650);
  }

  function retourner(kb) {
    const it = st.item;
    if (!it || !it.back || st.phase !== 'done' || st.retour) return;
    st.retour = true;
    PR.marquer(P[it.back.p].e, 'vu', 'atelier');
    renderAsk(); applyMap(); updateFills();
    const sec = $('#ret');
    if (sec) { sec.innerHTML = retourHTML(); sec.hidden = false; }
    $('#sh-foot').innerHTML = footHTML();
    requestAnimationFrame(() => requestAnimationFrame(() => drawConnection(true)));
    if (sec) {
      const body = $('#sh-body');
      const top = sec.getBoundingClientRect().top - body.getBoundingClientRect().top + body.scrollTop - 8;
      body.scrollTo({ top, behavior: reduce() ? 'auto' : 'smooth' });
      if (kb) { const h = $('.sec', sec); if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); } }
    }
    if (kb) { const nb = $('[data-next]'); if (nb && !sec) nb.focus(); }
  }

  function next(kb) {
    suivant();
    if (!desk()) {
      const tk = $('#ticket');
      if (tk.getBoundingClientRect().top < 0 || window.scrollY > 0) window.scrollTo({ top: 0, behavior: reduce() ? 'auto' : 'smooth' });
    }
    if (kb) $('#ask-t').focus();
  }

  /* ---------- Voix ---------- */
  const canSpeak = 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';
  const speakBtn = t => canSpeak ? `<button type="button" class="say" data-say="${esc(t)}" aria-label="Écouter la phrase">${ico(SPEAK, 18)}Écouter</button>` : '';
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

  /* ---------- Dialogues : codes et lignes ---------- */
  function codesHTML() {
    return `
      <p class="cd-sec">Les lignes = les sortes de liens</p>
      <ul class="cd-list">${LIENS.map(l => `<li>${roundel(l.id)}<span><b>${esc(SHORT[l.id])}</b> · ${esc(l.q)}${l.label !== SHORT[l.id] ? `<small>${esc(l.label)}</small>` : ''}</span></li>`).join('')}</ul>
      <p class="cd-sec">Les stations = les ponts</p>
      <ul class="cd-list">
        <li><i class="sd" aria-hidden="true"></i><span>vide : nouveau</span></li>
        <li><i class="sd" style="--f:.5" aria-hidden="true"></i><span>à moitié : en cours</span></li>
        <li><i class="sd" style="--f:1" aria-hidden="true"></i><span>pleine : maîtrisé</span></li>
        <li><i class="sd" style="width:24px;height:24px;border-width:4px;box-shadow:0 0 0 5px color-mix(in srgb, var(--ink-2) 25%, transparent)" aria-hidden="true"></i><span>grande station allumée : tu peux la choisir</span></li>
        <li><i class="sd" style="opacity:.35" aria-hidden="true"></i><span>ligne pâle : pas pour ce trajet</span></li>
      </ul>
      <p class="cd-sec">Les réponses</p>
      <ul class="cd-list">
        <li><span class="c-mk ok" aria-hidden="true">${ico(CHECK, 15)}</span><span>bon pont</span></li>
        <li><span class="c-mk ko" aria-hidden="true">${ico(CROSS, 15)}</span><span>mauvais pont</span></li>
        <li><span class="c-mk" style="background:var(--ink);color:var(--card)" aria-hidden="true">${ico(UNDO, 15)}</span><span>pont retourné</span></li>
      </ul>
      <p class="cd-sec">Dans les phrases et les schémas</p>
      <p class="cd-ph ph">${phrase('<{Comme} il pleut>, je prends le [métro].')}</p>
      <ul class="cd-list">
        <li><span class="key"><span class="k-c"><i></i></span></span><span>orange : la partie qui commence par le pont</span></li>
        <li><span class="key"><span class="k-m"><i></i></span></span><span>violet : la phrase principale</span></li>
        <li><span class="ph" style="margin:0;font-size:15px;line-height:1"><b class="pont">pont</b></span><span>surligné : le pont</span></li>
        <li><span class="ph" style="margin:0;font-size:15px;line-height:1"><span class="chg">mot</span></span><span>pointillé : ce qui change</span></li>
      </ul>
      <p class="cd-sec">Après le pont</p>
      <div class="cd-codes">${Object.keys(CODE).map(m => `${codeChip(m)}<span>${esc(CODE_DEF[m])}</span>`).join('')}</div>
      <p class="cd-sec">Registre</p>
      <div class="cd-codes">${Object.keys(REG).map(r => `${regChip(r)}<span>${esc(REG[r])}</span>`).join('')}</div>`;
  }
  function lignesHTML() {
    const n = id => banque().filter(it => it.rel === id).length;
    const opt = (id, inner) => `<button type="button" class="ln-opt${id !== 'tout' ? ' l-' + id : ''}" data-filtre="${id}" aria-pressed="${st.filtre === id}">${inner}</button>`;
    return opt('tout', `<span class="all" aria-hidden="true"></span><span><b>Toutes les lignes</b><small>${banque().length} trajets · tu choisis la ligne</small></span><span></span>`) +
      LIENS.map(l => {
        const ids = pontsDe(l.id), full = ids.filter(id => statutPont(id) === 'maitrise').length;
        const pct = Math.round(100 * ids.reduce((s, id) => s + fillOf(id), 0) / ids.length);
        return opt(l.id, `${roundel(l.id)}<span><b>${esc(SHORT[l.id])}</b><small>${n(l.id)} trajets · ${full}/${ids.length} pleines</small></span><span class="bar" aria-hidden="true"><i style="width:${pct}%"></i></span>`);
      }).join('');
  }
  function openDialog(id) {
    const d = $('#' + id);
    if (id === 'dlg-codes') $('#codes-body').innerHTML = codesHTML();
    if (id === 'dlg-lignes') $('#lignes-body').innerHTML = lignesHTML();
    $$('.dlg-x', d).forEach(b => { b.innerHTML = ico(CROSS, 20); });
    if (typeof d.showModal === 'function') { if (!d.open) d.showModal(); } else d.setAttribute('open', '');
  }
  function closeDialog(d) { if (d.open && typeof d.close === 'function') d.close(); else d.removeAttribute('open'); }

  /* ---------- Événements ---------- */
  document.addEventListener('click', e => {
    const t = e.target.closest('button');
    if (!t) return;
    const kb = e.detail === 0;
    if (t.dataset.pick) { pickLine(t.dataset.pick, kb); return; }
    if (t.dataset.st) { pickStation(t.dataset.st, kb); return; }
    if (t.hasAttribute('data-retour')) { retourner(kb); return; }
    if (t.hasAttribute('data-next') || t.hasAttribute('data-skip')) { next(kb); return; }
    if (t.hasAttribute('data-sheet')) { toggleSheet(); return; }
    if (t.dataset.say) { speak(t.dataset.say); return; }
    if (t.hasAttribute('data-open-lignes')) { openDialog('dlg-lignes'); return; }
    if (t.hasAttribute('data-open-codes') || t.id === 'codes') { openDialog('dlg-codes'); return; }
    if (t.hasAttribute('data-close')) { closeDialog(t.closest('dialog')); return; }
    if (t.dataset.filtre) {
      st.filtre = t.dataset.filtre; store.set('filtre', st.filtre);
      const d = t.closest('dialog'); if (d) closeDialog(d);
      next(kb);
      return;
    }
    if (t.id === 'theme') {
      const cur = document.documentElement.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const nx = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nx); store.set('theme', nx);
    }
  });
  /* Clic sur le fond d'un dialogue : fermer */
  $$('dialog').forEach(d => d.addEventListener('click', e => { if (e.target === d) closeDialog(d); }));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !desk() && $('#panel').classList.contains('open') && !$('dialog[open]') && !$('#panel').classList.contains('min')) { toggleSheet(); }
  });
  let rz = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(rz);
    rz = requestAnimationFrame(() => {
      placeSpine();
      if (st.retour) drawConnection(false);
      const tk = $('#ticket'); if (tk) document.documentElement.style.setProperty('--tkh', tk.offsetHeight + 'px');
      if (desk()) { document.body.classList.remove('sheet-open'); }
      else if (st.phase === 'done') { $('#panel').classList.add('open'); document.body.classList.add('sheet-open'); }
    });
  });
  PR.surChangement(() => { updateFills(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { placeSpine(); if (st.retour) drawConnection(false); });

  buildMap();
  suivant();
})();
