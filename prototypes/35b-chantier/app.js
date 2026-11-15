/* Le chantier (outil 2 · variante B) — construire le pont pièce par pièce.
   1. Deux phrases, une rivière entre elles.
   2. « Quelle sorte de lien ? » : tuiles de couleur ; la bonne colore la rivière. Erreur : indice ; 2 erreurs : réponse.
   3. « Quel pont ? » : on pose une pièce dans le trou (toucher, ou glisser à la souris). La phrase s'assemble.
   4. Explication : ✓ le bon pont (phrase + Écouter), schémas de tous les choix (✓ / ✗), règle (+ code du mode).
   5. « Retourne le pont » : les morceaux changent de place, schéma du pont retourné, ce qui change.
   Série de 10 paires, puis bilan.
   Données : ../3-pont/catalogue.js et ../3-pont/banque/*.js. Progression : assets/progres.js (partagée). */
(function () {
  'use strict';

  const A = window.ATELIER, VIZ = window.VIZ, PR = window.PROGRES;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  /* Typographie française : espace insécable avant ? ! : ; » et après « (pas de « ? » seul en début de ligne). */
  const nb = s => String(s == null ? '' : s).replace(/« /g, '«\u00a0').replace(/ ([»?!:;])/g, '\u00a0$1');
  const md = s => esc(nb(s)).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>');
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const reduce = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const wait = ms => new Promise(r => setTimeout(r, reduce() ? Math.min(ms, 60) : ms));
  const store = {
    get(k, d) { try { const v = localStorage.getItem('chantier:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('chantier:' + k, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } }
  };

  const stageEl = $('#stage');
  if (!A || !VIZ || !PR || !stageEl) return;

  const P = A.ponts, LIENS = A.liens, LIEN = {};
  LIENS.forEach(l => { LIEN[l.id] = l; });
  const SERIE = 10;

  /* ---------- Codes ---------- */
  const COURT0 = {
    temps: ['Temps', 'Quand ?'], cause: ['Cause', 'Pourquoi ?'], but: ['But', 'Pour quoi faire ?'],
    condition: ['Condition', 'Et si… ?'], opposition: ['Opposition', 'Quelle différence ?'], concession: ['Concession', 'Malgré quoi ?'],
    comparaison: ['Comparaison', 'Plus ou moins ?'], ajout: ['Ajout', 'Quoi d’autre ?'], relatif: ['Description', 'Lequel ?']
  };
  const INDICE0 = {
    temps: 'Une action se place avant, après ou pendant l’autre.',
    cause: 'Une phrase est la raison de l’autre.',
    but: 'Une action sert à obtenir (ou à éviter) l’autre.',
    condition: 'Une action dépend de l’autre : elle arrive seulement si…',
    opposition: 'Deux faits vrais qui contrastent, ou l’un remplace l’autre.',
    concession: 'Un obstacle existe, mais il n’empêche pas l’action.',
    comparaison: 'On mesure deux choses : plus, moins ou pareil.',
    ajout: 'Une phrase ajoute une idée ou un exemple à l’autre.',
    relatif: 'Une phrase décrit un nom de l’autre phrase.'
  };
  const COURT = {}, INDICE = {};
  Object.keys(COURT0).forEach(k => { COURT[k] = COURT0[k].map(nb); INDICE[k] = nb(INDICE0[k]); });
  /* Ce qui suit le pont : code court (étiquette) + sens (légende). */
  const MODE = {
    ind: ['+IND', 'indicatif'], subj: ['+SUBJ', 'subjonctif'], cond: ['+COND', 'conditionnel'], inf: ['+INF', 'infinitif'],
    infp: ['+INF PASSÉ', 'infinitif passé'], part: ['EN …ANT', 'en + participe présent'],
    nom: ['+NOM', 'un nom'], adj: ['+ADJ', 'adjectif + que / pour'], seul: ['PHRASE', 'phrase entière, verbe inchangé'],
    rel: ['RELATIF', 'qui, que, dont, où…']
  };
  const REG = { O: 'oral', QC: 'Québec', 'F-QC': 'familier · Québec', S: 'soutenu' };
  /* Sortes de lien qu'on ne propose pas à la question 1, parce qu'elles seraient aussi défendables pour ces paires. */
  const AMBIGU = { but: ['cause'], condition: ['temps'], cause: ['temps', 'but'], temps: ['condition', 'cause'] };

  /* ---------- Icônes (SVG en ligne) ---------- */
  const I = {
    temps: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.2V12l3.4 2.3"/>',
    cause: '<circle cx="5.6" cy="12" r="2.8" class="fill"/><path d="M10 12h10M15.6 7.5 20 12l-4.4 4.5"/>',
    but: '<path d="M6 21V3.5"/><path d="M6 4.2h12l-3.2 4.2L18 12.6H6" class="soft"/>',
    condition: '<path d="M12 21v-7M12 14 6.4 6.5M12 14l5.6-7.5"/><path d="M5.2 10.2 6.2 6l4.2.5M18.8 10.2 17.8 6l-4.2.5"/>',
    opposition: '<path d="M4 8h15M15.5 4.5 19 8l-3.5 3.5M20 16H5M8.5 12.5 5 16l3.5 3.5"/>',
    concession: '<rect x="10.2" y="12.5" width="4.6" height="8.5" rx="1" class="fill"/><path d="M3 15.5C5 7.5 15.5 4.5 19.5 10.5"/><path d="M15.8 10.8l3.9-.2.3-3.9"/>',
    comparaison: '<path d="M5.5 20.5v-6M12 20.5V9.5M18.5 20.5V4" style="stroke-width:3.4"/>',
    ajout: '<circle cx="12" cy="12" r="8.5"/><path d="M12 8v8M8 12h8"/>',
    relatif: '<path d="M3.5 12.6V4h8.6l8.9 8.9-8.4 8.4z"/><circle cx="8.1" cy="8.6" r="1.7" class="fill"/>',
    ok: '<path d="M5 12.5 10 17.5 19.5 7" style="stroke-width:3"/>',
    ko: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11" style="stroke-width:3"/>',
    ampoule: '<path d="M9 17.5h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V17h5.2v-1.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
    main: '<path d="M9 11V5.2a1.6 1.6 0 0 1 3.2 0V11M12.2 10.5V9a1.6 1.6 0 0 1 3.2 0v2M15.4 11a1.6 1.6 0 0 1 3.2 0v3.5c0 4-2.4 6.5-6 6.5-2.6 0-4-1.1-5.4-3.2L4.6 14a1.6 1.6 0 0 1 2.7-1.7L9 14.5"/>',
    retour: '<path d="M4.5 10a7.8 7.8 0 0 1 13.6-3.6L20 8.5M20 3.8v4.7h-4.7M19.5 14a7.8 7.8 0 0 1-13.6 3.6L4 15.5M4 20.2v-4.7h4.7"/>',
    fleche: '<path d="M4 12h15M13.5 6.5 19 12l-5.5 5.5"/>',
    son: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" class="fill"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
    schema: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M6.5 10h6M6.5 14.5h11"/><circle cx="16.5" cy="10" r="1.6" class="fill"/>',
    regle: '<path d="M5 4.5h10.5a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h10.5M9 8.5h6"/>',
    change: '<path d="M7 4v16M7 20l-3.5-3.5M7 20l3.5-3.5M17 20V4M17 4l-3.5 3.5M17 4l3.5 3.5"/>',
    piece: '<rect x="3" y="8" width="18" height="9" rx="2.5"/><path d="M3 14.5h18"/>',
    fermer: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>'
  };
  const svg = (name, s = 22) => `<svg class="i" viewBox="0 0 24 24" width="${s}" height="${s}" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${I[name] || ''}</svg>`;
  const mk = (kind, s = 14) => `<span class="mk ${kind}" aria-hidden="true">${svg(kind, s)}</span>`;
  const code = m => MODE[m] ? `<span class="code" title="${esc(MODE[m][1])}">${esc(MODE[m][0])}</span>` : '';
  const regs = r => r ? r.split(/\s*,\s*/).map(x => REG[x] ? `<span class="reg">${esc(REG[x])}</span>` : '').join('') : '';

  /* ---------- Phrases en mots (pour les faire glisser) ----------
     Balisage : {pont} <partie introduite par le pont> [forme changée].
     Chaque mot porte son origine : 'a' ou 'b' (phrase de départ) ou 'p' (le pont). */
  const plain = s => String(s).replace(/[<>{}\[\]]/g, '');
  const cle = w => w.toLowerCase().replace(/[’`]/g, '\'').replace(/[.,;:!?«»"()… ]/g, '');

  function chars(markup) {
    const out = []; let cad = false, pt = false, chg = false;
    for (const ch of String(markup)) {
      if (ch === '<') cad = true; else if (ch === '>') cad = false;
      else if (ch === '{') pt = true; else if (ch === '}') pt = false;
      else if (ch === '[') chg = true; else if (ch === ']') chg = false;
      else out.push({ ch, cad, pt, chg });
    }
    return out;
  }
  function wordsOf(cs) {
    const raw = []; let cur = [];
    cs.forEach(c => { if (c.ch === ' ') { if (cur.length) raw.push(cur); cur = []; } else cur.push(c); });
    if (cur.length) raw.push(cur);
    const txt = w => w.map(c => c.ch).join('');
    const res = [];
    for (let i = 0; i < raw.length; i++) {
      const w = raw[i], t = txt(w), prev = res[res.length - 1];
      const glue = c => Object.assign({}, c, { ch: ' ' });
      if (prev && (/^[:;!?»$%.,]+$/.test(t) || (/^\d+$/.test(txt(prev)) && /^\d/.test(t)))) { prev.push(glue(w[0])); prev.push(...w); }
      else if (prev && txt(prev) === '«') { prev.push(glue(w[0])); prev.push(...w); }
      else res.push(w.slice());
    }
    return res;
  }
  /* Un pont en plusieurs mots (« à cause de ») ou une forme changée en plusieurs mots ([la Fête nationale])
     forment une seule pièce : ils bougent ensemble et gardent un seul surlignage. */
  function unitsOf(ws) {
    const ponct = /[.,;:!?»« ]/;
    /* Un mot à cheval sur le pont (« d’une », « qu’il ») est coupé en deux morceaux collés (glue). */
    const pieces = [];
    ws.forEach(w => {
      let cur = null;
      w.forEach(c => {
        if (!cur || cur.pt !== c.pt) { cur = { pt: c.pt, glue: !!cur, w: [] }; pieces.push(cur); }
        cur.w.push(c);
      });
    });
    const kind = w => w.some(c => c.pt) ? 'p' : (w.some(c => c.chg) && w.every(c => c.chg || ponct.test(c.ch)) ? 'c' : '');
    const units = [];
    pieces.forEach(pc => {
      const k = kind(pc.w), last = units[units.length - 1];
      if (k && last && last.k === k) {
        const prev = last.w[last.w.length - 1];
        if (!pc.glue) last.w.push({ ch: ' ', cad: prev.cad, pt: k === 'p', chg: k === 'c' });
        last.w.push(...pc.w);
      } else units.push({ k, glue: pc.glue, w: pc.w.slice() });
    });
    return units;
  }
  const runCls = c => [c.cad ? 'cad' : 'mai', c.pt ? 'pt' : '', c.chg ? 'chg' : ''].filter(Boolean).join(' ');
  function unitHTML(w, side, trail) {
    const pont = w.some(c => c.pt);
    const first = w.find(c => !c.pt) || w[0];
    const o = pont ? 'p' : (first.cad ? side.cad : side.main);
    let html = '', run = null, buf = '';
    const flush = () => { if (buf) html += `<span class="${run}">${esc(buf)}</span>`; buf = ''; };
    w.forEach(c => { const k = runCls(c); if (k !== run) { flush(); run = k; } buf += c.ch; });
    flush();
    /* L'espace qui suit reste dans la pièce (insécable) : le soulignement continue d'un mot à l'autre. */
    if (trail != null) html += `<span class="${trail}"> </span>`;
    return `<span class="w" data-k="${esc(cle(w.map(c => c.ch).join('')))}" data-o="${o}">${html}</span>`;
  }
  /* Phrase de départ (rive A ou B) */
  function rive(text, o) {
    const ws = wordsOf(chars(text));
    return `<span class="sr">${esc(text)}</span><span aria-hidden="true">${ws.map(w => `<span class="w" data-k="${esc(cle(w.map(c => c.ch).join('')))}" data-o="${o}">${esc(w.map(c => c.ch).join(''))}</span>`).join(' ')}</span>`;
  }
  /* Phrase reliée : c = côté introduit par le pont ('a' ou 'b'). Entre deux pièces : espace sans largeur (retour à la ligne possible). */
  function reliee(markup, c) {
    const side = { cad: c, main: c === 'a' ? 'b' : 'a' };
    const us = unitsOf(wordsOf(chars(markup)));
    const html = us.map((u, i) => {
      const nx = us[i + 1], a = u.w[u.w.length - 1];
      const trail = !nx || nx.glue ? null : (a.cad === nx.w[0].cad ? (a.cad ? 'cad' : 'mai') : '');
      return (i && u.glue ? '⁠' : i ? '​' : '') + unitHTML(u.w, side, trail);
    }).join('');
    return `<span class="sr">${esc(plain(markup))}</span><span aria-hidden="true">${html}</span>`;
  }

  /* ---------- Schéma d'un pont, avec les mots de la paire (repris de 35-atelier) ---------- */
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
  function diag(id, it, c) {
    const p = P[id];
    const cadre = c === 'a' ? it.as : it.bs, main = c === 'a' ? it.bs : it.as;
    const mkr = marksFor(p.k, cadre, main);
    const spec = { lanes: mkr.lanes || 1, flow: !mkr.axis && (mkr.lanes || 1) === 1, axis: null, rows: [{ label: p.e, sub: 'schéma', marks: mkr.m }] };
    if (mkr.axis) spec.axis = { today: mkr.axis.today, labels: [[mkr.axis.today, 'maintenant']] };
    return VIZ.render(spec, { title: false });
  }

  /* ---------- État ---------- */
  const st = {
    filtre: store.get('filtre', 'tout'), item: null, stage: 'lien', essais: 0, liensOpts: [], pontsOpts: [],
    choix: null, shown: null, retourne: false, busy: false, tok: 0, serie: [], vus: new Set()
  };
  if (st.filtre !== 'tout' && !LIEN[st.filtre]) st.filtre = 'tout';

  const banque = () => A.banque.filter(it => LIEN[it.rel] && it.ok && it.ok.length && it.ok.every(o => P[o.p]) && it.back && P[it.back.p]);
  function pool() {
    let list = banque();
    if (st.filtre !== 'tout') list = list.filter(it => it.rel === st.filtre);
    if (!list.length) list = banque();
    const rang = it => Math.min(...it.ok.map(o => ({ nouveau: 0, vu: 1, 'en-cours': 2, maitrise: 3 })[PR.statut(P[o.p].e)]));
    const fresh = list.filter(it => !st.vus.has(it.id));
    const base = fresh.length ? fresh : list;
    const min = Math.min(...base.map(rang));
    return base.filter(it => rang(it) <= min + 1);
  }

  function setStage(s) { st.stage = s; document.body.dataset.stage = s; }
  function setBusy(b) { st.busy = b; if (b) document.body.dataset.busy = '1'; else delete document.body.dataset.busy; }
  function annonce(t) { const a = $('#annonce'); a.textContent = ''; setTimeout(() => { a.textContent = t; }, 30); }
  function focusSans(el) { if (el) { try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } } }

  function suivant(focus) {
    const list = pool();
    st.tok++;
    setBusy(false);
    if (!list.length) { setStage('vide'); stageEl.innerHTML = '<p class="vide">Aucune paire de phrases n’est chargée.</p>'; return; }
    const it = list[Math.floor(Math.random() * list.length)];
    st.vus.add(it.id);
    Object.assign(st, { item: it, essais: 0, choix: null, shown: null, retourne: false });
    const exclus = AMBIGU[it.rel] || [];
    const voisins = (A.voisins[it.rel] || []).filter(x => !exclus.includes(x));
    const autres = LIENS.map(l => l.id).filter(x => x !== it.rel && !voisins.includes(x) && !exclus.includes(x));
    st.liensOpts = shuffle([it.rel].concat(shuffle(voisins).slice(0, 2), shuffle(autres)).slice(0, 4));
    st.pontsOpts = shuffle(it.ok.map(o => ({ p: o.p, ok: true, o })).concat(it.non.map(n => ({ p: n.p, ok: false, n }))));
    setStage('lien');
    render();
    if (focus) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      focusSans($('#qh'));
    }
  }

  /* ---------- Rendu ---------- */
  function render() {
    const s = st.stage;
    if (s === 'lien' || s === 'pont') stageEl.innerHTML = chantier() + panel();
    else if (s === 'explic') stageEl.innerHTML = explic();
    else if (s === 'bilan') stageEl.innerHTML = bilan();
    renderProg();
  }

  function chantier() {
    const it = st.item, on = st.stage !== 'lien';
    return `<div class="chantier${on ? ' has-lien l-' + it.rel : ''}" id="ch">
      <div class="bank" data-bank="a"><span class="tag" aria-hidden="true">A</span><p class="txt">${rive(it.a, 'a')}</p></div>
      <div class="river" aria-hidden="true">
        <span class="water"></span>
        <span class="river-tag">${on ? riverTag(it.rel) : ''}</span>
        <div class="slot" id="slot"><span class="slot-q">?</span></div>
      </div>
      <div class="bank" data-bank="b"><span class="tag" aria-hidden="true">B</span><p class="txt">${rive(it.b, 'b')}</p></div>
    </div>`;
  }
  const riverTag = rel => `<span class="rt l-${rel}">${svg(rel, 16)}<span class="rt-l">${esc(COURT[rel][0])}</span></span>`;

  function panel() {
    if (st.stage === 'lien') {
      return `<section class="panel" id="panel" aria-labelledby="qh">
        <h2 class="qh" id="qh" tabindex="-1"><span class="n" aria-hidden="true">1</span>Quelle sorte de lien&nbsp;?</h2>
        <div class="tiles">${st.liensOpts.map(id => `<button type="button" class="tile l-${id}" data-lien="${id}"><span class="t-ico">${svg(id, 24)}</span><span class="t-txt"><b>${esc(COURT[id][0])}</b><span>${esc(COURT[id][1])}</span></span></button>`).join('')}</div>
        <div class="fb" id="fb"></div>
      </section>`;
    }
    return `<section class="panel" id="panel" aria-labelledby="qh">
      <h2 class="qh" id="qh" tabindex="-1"><span class="n" aria-hidden="true">2</span>Quel pont&nbsp;?</h2>
      <div class="pieces">${st.pontsOpts.map(o => { const p = P[o.p]; return `<button type="button" class="piece" data-pont="${o.p}" aria-label="Poser « ${esc(p.e)} » : ${esc(MODE[p.m] ? MODE[p.m][1] : '')}"><b>${esc(p.e)}</b>${code(p.m)}</button>`; }).join('')}</div>
      <p class="geste">${svg('main', 18)}<span class="g-fin">Glisse une pièce dans le trou, ou clique dessus.</span><span class="g-doigt">Touche une pièce pour la poser.</span></p>
    </section>`;
  }

  function court(why) { const i = why.indexOf(' ; '); return i > 0 ? why.slice(0, i) + '.' : why; }
  const ecoute = (t, petit) => canSpeak ? `<button type="button" class="ecoute${petit ? ' petit' : ''}" data-say="${esc(t)}"${petit ? ' aria-label="Écouter"' : ''}>${svg('son', 18)}${petit ? '' : '<span>Écouter</span>'}</button>` : '';

  function carte(x) {
    const p = P[x.p], mine = st.choix && st.choix.p === x.p;
    const c = x.ok ? x.o.c : st.shown.c;
    const r = x.ok ? '' : (x.n && x.n.why ? (mine ? x.n.why : court(x.n.why)) : `« ${p.e} » : ${COURT[p.rel][0].toLowerCase()}.`);
    return `<div class="card ${x.ok ? 'ok' : 'ko'}${mine ? ' mine' : ''}">
      <p class="card-h">${mk(x.ok ? 'ok' : 'ko', 12)}<span class="sr">${x.ok ? 'Bon pont :' : 'Pas ce pont :'}</span><b class="pt">${esc(p.e)}</b>${code(p.m)}${mine ? '<span class="toi">ton choix</span>' : ''}</p>
      ${diag(x.p, st.item, c)}
      ${r ? `<p class="card-r">${md(r)}</p>` : ''}
    </div>`;
  }

  function explic() {
    const it = st.item, o = st.choix, sh = st.shown, rel = it.rel;
    const autres = it.ok.filter(k => k !== sh);
    const verdict = o.ok
      ? `<p class="verdict ok">${mk('ok', 14)}<span>Oui&nbsp;!</span></p>`
      : `<p class="verdict ko">${mk('ko', 14)}<span>Pas «&nbsp;${esc(P[o.p].e)}&nbsp;»</span></p>`;
    const rang = x => x.ok ? (x.o === sh ? 0 : 1) : (x.p === o.p ? 2 : 3);
    const ordre = st.pontsOpts.slice().sort((x, y) => rang(x) - rang(y));
    return `<div class="explic l-${rel}">
      <section class="part p1" aria-labelledby="h-p1">
        <div class="p1-top">${verdict}</div>
        <div class="p1-h"><h2 class="part-h" id="h-p1" tabindex="-1">${mk('ok', 12)}Le bon pont</h2><span class="lien-chip l-${rel}">${svg(rel, 16)}${esc(COURT[rel][0])}</span></div>
        <p class="ph" id="ph-main">${reliee(sh.s, sh.c)}</p>
        <div class="p1-act">${ecoute(plain(sh.s))}</div>
        ${autres.map(k => `<div class="aussi"><p class="aussi-k">Aussi ${mk('ok', 10)}</p><p class="ph ph-2">${reliee(k.s, k.c)}</p>${ecoute(plain(k.s), true)}</div>`).join('')}
        <p class="key" aria-hidden="true"><span class="s-pt">pont</span><span class="s-cad">partie du pont</span><span class="s-mai">phrase principale</span><span class="s-chg">change</span></p>
      </section>
      <section class="part p2" aria-labelledby="h-p2">
        <h2 class="part-h" id="h-p2">${svg('schema', 16)}Les schémas des choix</h2>
        <div class="cards">${ordre.map(carte).join('')}</div>
      </section>
      <section class="part p3" aria-labelledby="h-p3">
        <h2 class="part-h" id="h-p3">${svg('regle', 16)}La règle</h2>
        ${it.ok.map(k => { const p = P[k.p]; return `<div class="regle"><p class="regle-h"><b class="pt">${esc(p.e)}</b>${code(p.m)}${regs(p.reg)}</p><p class="regle-t">${md(p.regle)}</p></div>`; }).join('')}
      </section>
      ${st.retourne ? retourHTML(true) : ''}
      ${actions()}
    </div>`;
  }

  function actions() {
    const fin = st.serie.length >= SERIE;
    return `<div class="act" id="act">
      ${st.retourne ? '' : `<button type="button" class="btn btn-flip" data-retour>${svg('retour', 22)}Retourne le pont</button>`}
      <button type="button" class="btn ${st.retourne ? 'btn-main' : 'btn-2'}" data-next>${fin ? 'Voir le bilan' : 'Paire suivante'}${svg('fleche', 20)}</button>
    </div>`;
  }

  function retourHTML(fini) {
    const it = st.item, b = it.back, p = P[b.p];
    return `<section class="part retour" id="retour" aria-labelledby="h-ret">
      <h2 class="part-h" id="h-ret" tabindex="-1">${svg('retour', 16)}Le pont retourné</h2>
      <p class="ph" id="ph-back">${fini ? reliee(b.s, b.c) : reliee(st.shown.s, st.shown.c)}</p>
      <div class="r-more">
        <div class="p1-act">${ecoute(plain(b.s))}</div>
        <div class="card ok back"><p class="card-h"><b class="pt">${esc(p.e)}</b>${code(p.m)}${regs(p.reg)}</p>${diag(b.p, it, b.c)}</div>
        <p class="change">${svg('change', 18)}<span><b>Ce qui change&nbsp;:</b> ${md(b.fn)}</span></p>
      </div>
    </section>`;
  }

  function bilan() {
    const n = st.serie.filter(s => s.ok).length;
    const revoir = Array.from(new Set(st.serie.filter(s => !s.ok).map(s => s.p)));
    return `<section class="bilan" aria-labelledby="h-bilan">
      <h2 id="h-bilan" tabindex="-1">Série terminée</h2>
      <p class="score"><b>${n}</b><span>/ ${SERIE}</span></p>
      <p class="bilan-k">${n === SERIE ? 'Tous tes ponts tiennent.' : n >= 7 ? 'Solide&nbsp;!' : 'Ça se construit.'}</p>
      ${revoir.length ? `<p class="bilan-k">${mk('ko', 12)} À revoir</p><p class="chips">${revoir.map(id => `<span class="pt">${esc(P[id].e)}</span>`).join('')}</p>` : ''}
      <div class="act act-1"><button type="button" class="btn btn-main" data-serie>Nouvelle série${svg('fleche', 20)}</button></div>
      <p class="bilan-lien"><a href="../0-atlas/index.html">Ma feuille de progression</a></p>
    </section>`;
  }

  function renderProg() {
    const n = st.serie.length, okN = st.serie.filter(s => s.ok).length;
    const actif = st.stage === 'lien' || st.stage === 'pont';
    const cur = actif ? n : -1;
    const num = Math.min(actif ? n + 1 : n, SERIE);
    $('#prog').innerHTML = `<div class="segs" role="progressbar" aria-label="Série en cours" aria-valuemin="0" aria-valuemax="${SERIE}" aria-valuenow="${n}" aria-valuetext="${n} paires faites sur ${SERIE}, ${okN} réussies">${Array.from({ length: SERIE }, (_, i) => `<span class="seg${i < n ? (st.serie[i].ok ? ' ok' : ' ko') : ''}${i === cur ? ' cur' : ''}"></span>`).join('')}</div><span class="prog-n" aria-hidden="true">${num}/${SERIE}</span>`;
  }

  function renderFiltres() {
    $('#filtres').innerHTML = [['tout', 'Tout']].concat(LIENS.map(l => [l.id, COURT[l.id][0]])).map(([id, lab]) =>
      `<button type="button" class="chip l-${id}" data-filtre="${id}" aria-pressed="${st.filtre === id}">${id === 'tout' ? '<span class="dot-all" aria-hidden="true"></span>' : svg(id, 18)}${esc(lab)}</button>`).join('');
  }

  /* ---------- Légende (« ? ») : une page, tous les codes ---------- */
  function renderLegende() {
    const d = $('#legende');
    d.innerHTML = `<div class="leg-in">
      <div class="leg-top"><h2 id="leg-h" tabindex="-1" autofocus>Les codes du chantier</h2><button type="button" class="ib ib-x" data-close aria-label="Fermer">${svg('fermer', 22)}</button></div>
      <ol class="leg-steps">
        <li><span class="n">1</span><b>Le lien</b><span>la sorte</span></li>
        <li><span class="n">2</span><b>Le pont</b><span>la pièce</span></li>
        <li><span class="n">3</span><b>Pourquoi</b><span>schémas, règle</span></li>
        <li><span class="n">4</span><b>Retourne</b><span>l’autre sens</span></li>
      </ol>
      <h3>Les sortes de lien</h3>
      <ul class="leg-liens">${LIENS.map(l => `<li class="l-${l.id}"><span class="t-ico">${svg(l.id, 18)}</span><b>${esc(COURT[l.id][0])}</b><span>${esc(COURT[l.id][1])}</span></li>`).join('')}</ul>
      <h3>Dans la phrase</h3>
      <ul class="leg-ph">
        <li><span class="pt">pont</span><span>le pont (la pièce jaune)</span></li>
        <li><span class="s-cad"></span><span>la partie qui suit le pont</span></li>
        <li><span class="s-mai"></span><span>la phrase principale</span></li>
        <li><span class="s-chg"></span><span>ce qui change</span></li>
      </ul>
      <h3>Après le pont</h3>
      <ul class="leg-modes">${Object.keys(MODE).map(m => `<li>${code(m)}<span>${esc(MODE[m][1])}</span></li>`).join('')}</ul>
      <h3>Réponses</h3>
      <ul class="leg-rep">
        <li>${mk('ok', 12)}<span>bon pont</span></li>
        <li>${mk('ko', 12)}<span>pas ce pont</span></li>
        <li><span class="mini-segs"><i class="ok"></i><i class="ko"></i><i></i></span><span>ta série de ${SERIE}</span></li>
      </ul>
      <div class="leg-go"><button type="button" class="btn btn-main" data-close>J’ai compris</button></div>
    </div>`;
  }
  function ouvrirLegende() {
    const d = $('#legende');
    if (typeof d.showModal === 'function') { if (!d.open) d.showModal(); } else d.setAttribute('open', '');
  }
  function fermerLegende() {
    const d = $('#legende');
    if (typeof d.close === 'function' && d.open) d.close(); else d.removeAttribute('open');
    store.set('intro', 1);
  }

  /* ---------- Animations ---------- */
  function secoue(el) {
    if (reduce() || !el || !el.animate) return;
    el.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(7px)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(3px)' }, { transform: 'translateX(0)' }], { duration: 420, easing: 'ease-out' });
  }
  function fantome(el, r) {
    const g = el.cloneNode(true);
    g.classList.add('ghost'); g.classList.remove('used', 'lifted');
    g.removeAttribute('data-pont'); g.setAttribute('aria-hidden', 'true'); g.tabIndex = -1;
    Object.assign(g.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
    document.body.appendChild(g);
    return g;
  }
  function vole(r0, el, cible) {
    if (reduce() || !el.animate) return Promise.resolve();
    const g = fantome(el, r0), r1 = cible.getBoundingClientRect();
    const dx = r1.left + r1.width / 2 - (r0.left + r0.width / 2), dy = r1.top + r1.height / 2 - (r0.top + r0.height / 2);
    const an = g.animate([{ transform: 'none' }, { transform: `translate(${dx}px, ${dy}px) scale(${Math.min(1.08, r1.height / r0.height) || 1})` }], { duration: 400, easing: 'cubic-bezier(.3,.7,.2,1)', fill: 'forwards' });
    return an.finished.then(() => g.remove(), () => g.remove());
  }
  function photo(root) {
    if (!root) return [];
    return $$('.w', root).map(el => {
      const cs = getComputedStyle(el);
      return { k: el.dataset.k, o: el.dataset.o, r: el.getBoundingClientRect(), html: el.innerHTML, fs: cs.fontSize, fw: cs.fontWeight, used: false };
    });
  }
  function disparait(p) {
    const g = document.createElement('span');
    g.className = 'w ghost-w' + (p.o === 'p' ? ' ghost-p' : '');
    g.setAttribute('aria-hidden', 'true');
    g.innerHTML = p.html;
    Object.assign(g.style, { left: p.r.left + 'px', top: p.r.top + 'px', fontSize: p.fs, fontWeight: p.fw });
    document.body.appendChild(g);
    const kf = p.o === 'p' ? [{ transform: 'rotateX(0)', opacity: 1 }, { transform: 'rotateX(90deg)', opacity: 0 }] : [{ opacity: 1 }, { opacity: 0, transform: 'translateY(-6px) scale(.9)' }];
    g.animate(kf, { duration: 340, easing: 'ease-in', fill: 'forwards' }).finished.then(() => g.remove(), () => g.remove());
  }
  /* Les mots glissent de leur ancienne place à la nouvelle (FLIP). Les nouveaux mots apparaissent ensuite. */
  function glisse(avant, root, depuis) {
    if (reduce() || !root || !root.animate) return;
    const els = $$('.w', root);
    const paires = els.map(el => {
      const k = el.dataset.k, o = el.dataset.o;
      let s = avant.find(p => !p.used && p.k === k && p.o === o);
      if (!s && o !== 'p') s = avant.find(p => !p.used && p.k === k && p.o !== 'p');
      if (s) s.used = true;
      return [el, s];
    });
    avant.filter(p => !p.used).forEach(disparait);
    const ease = 'cubic-bezier(.2,.75,.25,1)';
    paires.forEach(([el, s], i) => {
      const r1 = el.getBoundingClientRect();
      if (s) {
        const sc = r1.height ? s.r.height / r1.height : 1;
        el.animate([{ transformOrigin: '0 0', transform: `translate(${s.r.left - r1.left}px, ${s.r.top - r1.top}px) scale(${sc})` }, { transformOrigin: '0 0', transform: 'none' }], { duration: 640, delay: 30 + i * 12, easing: ease, fill: 'backwards' });
      } else if (el.dataset.o === 'p' && depuis) {
        const dx = depuis.left + depuis.width / 2 - (r1.left + r1.width / 2), dy = depuis.top + depuis.height / 2 - (r1.top + r1.height / 2);
        el.animate([{ transform: `translate(${dx}px, ${dy}px)`, opacity: .4 }, { transform: 'none', opacity: 1 }], { duration: 640, easing: ease, fill: 'backwards' });
      } else if (el.dataset.o === 'p') {
        el.animate([{ transform: 'rotateX(-90deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 420, delay: 330, easing: 'ease-out', fill: 'backwards' });
      } else {
        el.animate([{ opacity: 0, transform: 'translateY(10px) scale(.8)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: 480, easing: 'ease-out', fill: 'backwards' });
      }
    });
  }

  /* ---------- Question 1 : la sorte de lien ---------- */
  function colore() {
    const ch = $('#ch'), it = st.item;
    if (!ch) return;
    ch.classList.add('has-lien', 'l-' + it.rel);
    const t = $('.river-tag', ch); if (t) t.innerHTML = riverTag(it.rel);
  }
  function marque(btn, kind) {
    btn.classList.add(kind === 'ok' ? 'is-ok' : 'is-ko');
    if (!$('.mk', btn)) btn.insertAdjacentHTML('beforeend', mk(kind, 14));
  }
  function onLien(btn) {
    if (st.stage !== 'lien' || st.busy || btn.disabled) return;
    const it = st.item, id = btn.dataset.lien, fb = $('#fb'), tok = st.tok;
    if (id === it.rel) {
      marque(btn, 'ok');
      $$('.tile').forEach(b => { b.disabled = true; });
      colore();
      fb.innerHTML = `<p class="fb-l good">${mk('ok', 12)}<span>Oui&nbsp;: <b>${esc(COURT[id][0])}</b>.</span></p>`;
      annonce(`Oui : ${COURT[id][0]}. Question 2 : quel pont ?`);
      setBusy(true);
      setTimeout(() => { if (tok === st.tok) { setBusy(false); versPont(); } }, reduce() ? 250 : 850);
      return;
    }
    st.essais++;
    marque(btn, 'ko'); btn.disabled = true; secoue(btn);
    if (st.essais >= 2) {
      const bon = $(`.tile[data-lien="${it.rel}"]`);
      if (bon) marque(bon, 'ok');
      $$('.tile').forEach(b => { b.disabled = true; });
      colore();
      fb.innerHTML = `<p class="fb-l">${svg('ampoule', 20)}<span>C’est <b class="lien-chip l-${it.rel}">${svg(it.rel, 16)}${esc(COURT[it.rel][0])}</b>&nbsp;: ${esc(INDICE[it.rel].charAt(0).toLowerCase() + INDICE[it.rel].slice(1))}</span></p>
        <button type="button" class="btn btn-main" data-lien-go>Quel pont&nbsp;?${svg('fleche', 20)}</button>`;
      annonce(`C’est : ${COURT[it.rel][0]}. ${INDICE[it.rel]}`);
      focusSans($('[data-lien-go]'));
    } else {
      fb.innerHTML = `<p class="fb-l">${svg('ampoule', 20)}<span>${esc(INDICE[it.rel])}</span></p>`;
      annonce(`Pas tout à fait. Indice : ${INDICE[it.rel]}`);
    }
  }
  function versPont() {
    if (st.stage !== 'lien') return;
    setStage('pont');
    colore();
    $('#panel').outerHTML = panel();
    renderProg();
    const ch = $('#ch');
    if (ch && ch.getBoundingClientRect().top < 0) ch.scrollIntoView({ block: 'start', behavior: reduce() ? 'auto' : 'smooth' });
    focusSans($('#qh'));
  }

  /* ---------- Question 2 : poser la pièce ---------- */
  function pose(slot, pid, kind, tourne) {
    const p = P[pid];
    slot.className = 'slot placed ' + kind;
    slot.innerHTML = `<span class="sp"><b>${esc(p.e)}</b>${code(p.m)}</span>${mk(kind, 14)}`;
    if (reduce() || !slot.animate) return;
    if (kind === 'ko') secoue(slot);
    else if (tourne) slot.firstElementChild.animate([{ transform: 'rotateX(90deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 380, easing: 'ease-out' });
    else slot.animate([{ transform: 'scale(1.14)' }, { transform: 'scale(1)' }], { duration: 300, easing: 'cubic-bezier(.3,1.6,.5,1)' });
  }
  async function onPont(btn, r0) {
    if (st.stage !== 'pont' || st.busy || !btn || btn.disabled) return;
    const it = st.item, pid = btn.dataset.pont, o = st.pontsOpts.find(x => x.p === pid), tok = st.tok;
    if (!o) return;
    setBusy(true);
    st.choix = o; st.shown = o.ok ? o.o : it.ok[0];
    if (o.ok) PR.marquer(P[pid].e, 'ok', 'atelier');
    else { it.ok.forEach(k => PR.marquer(P[k.p].e, 'ko', 'atelier')); PR.marquer(P[pid].e, 'vu', 'atelier'); }
    st.serie.push({ id: it.id, ok: o.ok, p: st.shown.p, mine: pid });
    $$('.piece').forEach(b => { b.disabled = true; });
    btn.classList.add('used');
    const slot = $('#slot');
    slot.classList.remove('over');
    await vole(r0 || btn.getBoundingClientRect(), btn, slot);
    if (tok !== st.tok) return;
    pose(slot, pid, o.ok ? 'ok' : 'ko');
    $('#ch').classList.add('built');
    annonce(o.ok ? `Oui ! « ${P[pid].e} » tient.` : `Non : « ${P[pid].e} » ne tient pas. Le bon pont : « ${P[st.shown.p].e} ».`);
    await wait(o.ok ? 600 : 700);
    if (tok !== st.tok) return;
    if (!o.ok) { pose(slot, st.shown.p, 'ok', true); await wait(700); if (tok !== st.tok) return; }
    assemble();
  }
  function assemble() {
    const avant = photo($('#ch')), depuis = $('#slot') ? $('#slot').getBoundingClientRect() : null;
    setStage('explic');
    render();
    const ex = $('.explic');
    if (ex && ex.getBoundingClientRect().top < 0) ex.scrollIntoView({ block: 'start', behavior: 'auto' });
    glisse(avant, $('#ph-main'), depuis);
    setBusy(false);
    focusSans($('#h-p1'));
  }

  /* ---------- Retourne le pont ---------- */
  function retourne() {
    if (st.stage !== 'explic' || st.retourne || st.busy) return;
    const it = st.item, b = it.back;
    st.retourne = true;
    PR.marquer(P[b.p].e, 'vu', 'atelier');
    $('#act').outerHTML = retourHTML(false) + actions();
    const ph = $('#ph-back'), sec = $('#retour');
    if (!reduce()) {
      const top = sec.getBoundingClientRect().top;
      if (top > window.innerHeight * 0.55 || top < 0) window.scrollBy({ top: top - 90, behavior: 'auto' });
    }
    const avant = photo(ph);
    ph.innerHTML = reliee(b.s, b.c);
    glisse(avant, ph, null);
    annonce(`Pont retourné : ${plain(b.s)}`);
    focusSans($('#h-ret'));
  }

  /* ---------- Glisser à la souris (bureau). Toucher reste le chemin principal. ---------- */
  let drag = null, sansClic = 0;
  function surTrou(x, y) {
    const s = $('#slot'); if (!s) return false;
    const r = s.getBoundingClientRect(), m = 28;
    return x > r.left - m && x < r.right + m && y > r.top - m && y < r.bottom + m;
  }
  document.addEventListener('pointerdown', e => {
    const pc = e.target.closest && e.target.closest('.piece');
    if (!pc || pc.disabled || e.pointerType !== 'mouse' || e.button !== 0 || st.stage !== 'pont' || st.busy) return;
    drag = { el: pc, x: e.clientX, y: e.clientY, on: false, id: e.pointerId };
  });
  document.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.on) {
      if (Math.hypot(dx, dy) < 7) return;
      drag.on = true;
      drag.g = fantome(drag.el, drag.el.getBoundingClientRect());
      drag.el.classList.add('lifted');
      document.body.classList.add('dragging');
    }
    e.preventDefault();
    drag.g.style.transform = `translate(${dx}px, ${dy}px) rotate(-2deg)`;
    const s = $('#slot'); if (s) s.classList.toggle('over', surTrou(e.clientX, e.clientY));
  });
  function finDrag(e, annule) {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    const d = drag; drag = null;
    document.body.classList.remove('dragging');
    if (!d.on) return;
    sansClic = performance.now() + 120;
    const s = $('#slot'); if (s) s.classList.remove('over');
    if (!annule && e && surTrou(e.clientX, e.clientY) && st.stage === 'pont' && !st.busy) {
      const r = d.g.getBoundingClientRect();
      d.g.remove();
      onPont(d.el, r);
      return;
    }
    const fin = () => { d.g.remove(); d.el.classList.remove('lifted'); };
    if (reduce() || !d.g.animate) { fin(); return; }
    d.g.animate([{ transform: d.g.style.transform }, { transform: 'none' }], { duration: 260, easing: 'ease-out', fill: 'forwards' }).finished.then(fin, fin);
  }
  document.addEventListener('pointerup', e => finDrag(e, false));
  document.addEventListener('pointercancel', e => finDrag(e, true));

  /* ---------- Voix ---------- */
  const canSpeak = 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';
  function speak(text) {
    if (!canSpeak) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'fr-CA'; u.rate = 0.92;
      const vs = speechSynthesis.getVoices();
      const v = vs.find(x => /fr[-_]CA/i.test(x.lang)) || vs.find(x => /^fr/i.test(x.lang));
      if (v) u.voice = v;
      speechSynthesis.speak(u);
    } catch (e) { /* synthèse indisponible */ }
  }

  /* ---------- Thème et menu ---------- */
  function basculeTheme() {
    const cur = document.documentElement.getAttribute('data-theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    store.set('theme', next);
  }
  function menu(ouvert) {
    const b = $('#menu'), n = $('#nav');
    const on = ouvert == null ? b.getAttribute('aria-expanded') !== 'true' : ouvert;
    b.setAttribute('aria-expanded', String(on));
    n.classList.toggle('open', on);
  }

  /* ---------- Événements ---------- */
  document.addEventListener('click', e => {
    const t = e.target.closest('button');
    if (!t) { if ($('#nav').classList.contains('open') && !e.target.closest('#nav')) menu(false); return; }
    if (t.id !== 'menu' && !t.closest('#nav')) menu(false);
    if (t.dataset.lien) { onLien(t); return; }
    if (t.hasAttribute('data-lien-go')) { versPont(); return; }
    if (t.dataset.pont && !t.classList.contains('ghost')) { if (performance.now() < sansClic) return; onPont(t); return; }
    if (t.hasAttribute('data-retour')) { retourne(); return; }
    if (t.hasAttribute('data-next')) { if (st.serie.length >= SERIE) { setStage('bilan'); render(); window.scrollTo({ top: 0 }); focusSans($('#h-bilan')); } else suivant(true); return; }
    if (t.hasAttribute('data-serie')) { st.serie = []; suivant(true); return; }
    if (t.dataset.say) { speak(t.dataset.say); return; }
    if (t.dataset.filtre) {
      if (st.busy) return;
      st.filtre = t.dataset.filtre; store.set('filtre', st.filtre); renderFiltres();
      if (st.stage === 'bilan') st.serie = [];
      suivant(false);
      return;
    }
    if (t.id === 'aide') { ouvrirLegende(); return; }
    if (t.hasAttribute('data-close')) { fermerLegende(); return; }
    if (t.hasAttribute('data-theme-toggle')) { basculeTheme(); return; }
    if (t.id === 'menu') { menu(); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#nav').classList.contains('open')) { menu(false); $('#menu').focus(); } });
  $('#legende').addEventListener('click', e => { if (e.target === e.currentTarget) fermerLegende(); });
  $('#legende').addEventListener('close', () => store.set('intro', 1));

  /* ---------- Départ ---------- */
  renderFiltres();
  renderLegende();
  suivant(false);
  if (!store.get('intro', 0)) ouvrirLegende();
})();
