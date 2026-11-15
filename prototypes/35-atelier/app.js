/* Atelier de ponts (prototypes 3 + 5) — exercice.
   1. Deux phrases  2. Quelle sorte de lien ?  3. Quel pont ?
   4. Réponse : le bon pont + les schémas des choix + la règle  5. Retourne le pont.
   Données : ../3-pont/catalogue.js (liens, ponts) et ../3-pont/banque/*.js (paires).
   Progression : assets/progres.js (partagée avec l'atlas). */
(function () {
  'use strict';

  const A = window.ATELIER, C = window.CADRES, VIZ = window.VIZ, PR = window.PROGRES;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>');
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const reduce = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k, d) { try { const v = localStorage.getItem('atelier:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('atelier:' + k, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } }
  };

  const LIENS = A.liens, LIEN = {}; LIENS.forEach(l => { LIEN[l.id] = l; });
  const P = A.ponts;
  const banque = () => A.banque.filter(it => LIEN[it.rel] && it.ok && it.ok.length);
  /* Sortes de lien qu'on ne propose pas à la question 1, parce qu'elles seraient aussi défendables pour ces paires
     (un but peut se lire comme une conséquence ; « quand » et « si » se rejoignent ; une cause suit souvent dans le temps). */
  const AMBIGU = { but: ['cause'], condition: ['temps'], cause: ['temps', 'but'], temps: ['condition', 'cause'] };
  const pontsDe = rel => Object.keys(P).filter(k => P[k].rel === rel);
  const cle = id => PR.cle(P[id].e);
  const statutPont = id => PR.statut(P[id].e);

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

  /* ---------- Schéma d'un pont (une ligne de VIZ) ---------- */
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

  /* ---------- État ---------- */
  const st = {
    filtre: store.get('filtre', 'tout'), pont: null, item: null, etape: 1, essais: 0, lienOk: false, choix: null, retourne: false,
    vus: new Set(), score: store.get('score', { faits: 0, liens: 0, ponts: 0 })
  };

  function pool() {
    let list = banque();
    if (st.pont) list = list.filter(it => it.ok.some(o => o.p === st.pont));
    else if (st.filtre !== 'tout') list = list.filter(it => it.rel === st.filtre);
    if (!list.length) list = banque();
    const rank = it => Math.min(...it.ok.map(o => ({ nouveau: 0, vu: 1, 'en-cours': 2, maitrise: 3 })[statutPont(o.p)]));
    const fresh = list.filter(it => !st.vus.has(it.id));
    const base = fresh.length ? fresh : list;
    const minR = Math.min(...base.map(rank));
    return base.filter(it => rank(it) <= minR + 1);
  }
  function suivant() {
    const list = pool();
    if (!list.length) { $('#ex').innerHTML = '<p class="vide">Aucune paire de phrases n’est encore chargée. <button type="button" class="btn-txt" data-next>Réessayer</button></p>'; return; }
    const it = list[Math.floor(Math.random() * list.length)];
    st.vus.add(it.id);
    st.item = it; st.etape = 1; st.essais = 0; st.lienOk = false; st.choix = null; st.retourne = false;
    const exclus = AMBIGU[it.rel] || [];
    const voisins = (A.voisins[it.rel] || []).filter(x => !exclus.includes(x));
    const autres = LIENS.map(l => l.id).filter(x => x !== it.rel && !voisins.includes(x) && !exclus.includes(x));
    st.liensOpts = shuffle([it.rel].concat(shuffle(voisins).slice(0, 2), shuffle(autres)).slice(0, 4));
    st.pontsOpts = shuffle(it.ok.map(o => ({ p: o.p, ok: true, o })).concat(it.non.map(n => ({ p: n.p, ok: false, n }))));
    render(true);
  }

  /* ---------- Rendu ---------- */
  const modeChip = m => `<span class="mode m-${m}">${esc(A.modes[m] || m)}</span>`;
  const regChip = r => r ? r.split(/\s*,\s*/).map(x => `<span class="reg">${esc(x)}</span>`).join('') : '';
  const speakBtn = t => canSpeak ? `<button type="button" class="spk" data-say="${esc(t)}" aria-label="Écouter la phrase"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>` : '';

  function bench(it) {
    return `<div class="bench">
      <div class="idee"><span class="tag">A</span><p>${esc(it.a)}</p></div>
      <div class="arche ${st.choix ? (st.choix.ok ? 'ok' : 'ko') : ''}" aria-hidden="true">
        <svg viewBox="0 0 120 40"><path d="M4 34 Q60 -6 116 34" class="arc"/><path d="M4 34H116" class="tab"/>${[24, 42, 60, 78, 96].map(x => `<line x1="${x}" x2="${x}" y1="34" y2="${(34 - (1 - Math.pow((x - 60) / 56, 2)) * 22).toFixed(1)}"/>`).join('')}</svg>
        <span class="arche-t">${st.choix ? esc(P[st.choix.p].e) : '?'}</span>
      </div>
      <div class="idee"><span class="tag">B</span><p>${esc(it.b)}</p></div>
    </div>`;
  }

  function etapeLien(it) {
    const done = st.etape > 1;
    const head = `<h2 class="step-h"><span class="num">1</span>Quelle sorte de lien ?</h2>`;
    if (done) {
      const l = LIEN[it.rel];
      return `<div class="step done">${head}<p class="answer"><span class="lien l-${l.id}">${esc(l.label)}</span><span class="q">${esc(l.q)}</span>${st.essais === 0 ? '<span class="bravo">Bien vu</span>' : ''}</p></div>`;
    }
    return `<div class="step">${head}
      <div class="opts liens">${st.liensOpts.map(id => { const l = LIEN[id]; return `<button type="button" class="opt l-${id}" data-lien="${id}"><b>${esc(l.label)}</b><span>${esc(l.q)}</span></button>`; }).join('')}</div>
      <p class="fb" id="fb-lien"></p></div>`;
  }

  function etapePont(it) {
    if (st.etape < 2) return '';
    const head = `<h2 class="step-h"><span class="num">2</span>Quel pont ?</h2>`;
    const opts = st.pontsOpts.map(o => {
      const p = P[o.p];
      let cls = 'opt pont';
      if (st.choix) { cls += o.ok ? ' is-ok' : (st.choix.p === o.p ? ' is-ko' : ' is-off'); }
      return `<button type="button" class="${cls}" data-pont="${o.p}"${st.choix ? ' disabled' : ''}><b>${esc(p.e)}</b>${modeChip(p.m)}${regChip(p.reg)}</button>`;
    }).join('');
    let fb = '';
    if (st.choix) {
      fb = st.choix.ok ? `<p class="fb good"><b>Oui.</b> « ${esc(P[st.choix.p].e)} » relie bien ces deux phrases.</p>`
        : `<p class="fb bad"><b>Pas celui-là.</b> ${st.choix.n && st.choix.n.why ? md(st.choix.n.why) : `« ${esc(P[st.choix.p].e)} » sert à exprimer : ${esc(LIEN[P[st.choix.p].rel].label.toLowerCase())}.`}</p>`;
    }
    return `<div class="step${st.choix ? ' done' : ''}">${head}<div class="opts ponts">${opts}</div>${fb}</div>`;
  }

  function etapeReponse(it) {
    if (!st.choix) return '';
    const bons = it.ok.map(o => `<div class="phrase"><p class="ph">${phrase(o.s)} ${speakBtn(plain(o.s))}</p><p class="ph-meta"><b>${esc(P[o.p].e)}</b>${modeChip(P[o.p].m)}${regChip(P[o.p].reg)}</p></div>`).join('');
    const schemas = st.pontsOpts.map(o => {
      const p = P[o.p];
      const why = o.ok ? 'bon pont' : (o.n.why ? cut(o.n.why.replace(/[*«»]/g, ''), 90) : `exprime : ${LIEN[p.rel].label.toLowerCase()}`);
      const c = o.ok ? o.o.c : 'b';
      return `<div class="sch ${o.ok ? 'sch-ok' : 'sch-ko'}${st.choix.p === o.p ? ' sch-mine' : ''}"><span class="sch-mark" aria-label="${o.ok ? 'Bon pont' : 'Mauvais pont'}">${o.ok ? '✓' : '✗'}</span>${schema(o.p, it, c, why)}</div>`;
    }).join('');
    const regles = it.ok.map(o => { const p = P[o.p], l = LIEN[p.rel]; return `<div class="regle"><p class="regle-h"><b>${esc(p.e)}</b>${modeChip(p.m)}</p><p>${md(p.regle)}</p><a href="${esc(C.siteLink('#onglet-' + l.tab))}">Voir l’onglet ${l.tab} du site</a></div>`; }).join('');
    return `<div class="step reponse">
      <h2 class="step-h"><span class="num">3</span>La réponse</h2>
      <div class="rep-grid">
        <section class="rep rep-pont"><h3>Le bon pont</h3>${bons}<p class="cle-lecture"><span class="k-c">orange</span> = la partie introduite par le pont · <span class="k-m">violet</span> = la phrase principale · <span class="k-chg">encadré</span> = ce qui change</p></section>
        <section class="rep rep-schemas"><h3>Les schémas des choix</h3>${schemas}</section>
        <section class="rep rep-regle"><h3>La règle du pont</h3>${regles}</section>
      </div>
    </div>`;
  }

  function etapeRetour(it) {
    if (!st.choix) return '';
    const b = it.back;
    const head = `<h2 class="step-h"><span class="num">4</span>Retourne le pont</h2>`;
    if (!st.retourne) {
      return `<div class="step">${head}<p class="hint">Même idée, autre pont : qu’est-ce qui change ?</p><button type="button" class="btn" data-retour>Retourner le pont</button></div>`;
    }
    const p = P[b.p];
    return `<div class="step retour">${head}
      <div class="ret-grid">
        <div><p class="ret-k">Avant</p><p class="ph">${phrase(it.ok[0].s)}</p></div>
        <div><p class="ret-k">Retourné · <b>${esc(p.e)}</b> ${modeChip(p.m)}</p><p class="ph">${phrase(b.s)} ${speakBtn(plain(b.s))}</p></div>
      </div>
      <p class="fn">${md(b.fn)}</p>
      <div class="ret-sch">${schema(b.p, it, b.c, 'pont retourné')}</div>
      <p class="regle-mini">${md(p.regle)}</p>
    </div>`;
  }

  function render(fresh) {
    const it = st.item;
    if (!it) return;
    const l = LIEN[it.rel];
    $('#ex').innerHTML = `
      <div class="ex-head"><span class="ex-k">Paire ${it.id.replace(/^[a-z]+-/, '#')}${st.pont ? ` · pont « ${esc(P[st.pont].e)} »` : st.filtre !== 'tout' ? ` · ${esc(LIEN[st.filtre].label)}` : ''}</span>
        <button type="button" class="btn-txt" data-next>${st.choix ? 'Paire suivante →' : 'Passer'}</button></div>
      ${bench(it)}
      ${etapeLien(it)}
      ${etapePont(it)}
      ${etapeReponse(it)}
      ${etapeRetour(it)}
      ${st.choix ? `<div class="next-row"><button type="button" class="btn btn-main" data-next>Paire suivante</button></div>` : ''}`;
    if (fresh) { const ex = $('#ex'); if (ex.getBoundingClientRect().top < 0) ex.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'start' }); }
    void l;
  }

  /* ---------- Filtres et carte des ponts ---------- */
  function renderFiltres() {
    $('#filters').innerHTML = `<span class="f-l">Pratiquer</span>` + [['tout', 'Tout']].concat(LIENS.map(l => [l.id, l.label])).map(([id, lab]) => {
      const n = id === 'tout' ? banque().length : banque().filter(it => it.rel === id).length;
      return `<button type="button" class="f l-${id}" data-filtre="${id}" aria-pressed="${!st.pont && st.filtre === id}">${esc(lab)}<span>${n}</span></button>`;
    }).join('') + (st.pont ? `<button type="button" class="f f-pont" data-filtre="${st.filtre}" aria-pressed="true">Pont « ${esc(P[st.pont].e)} » ✕</button>` : '');
  }
  function renderCarte() {
    const all = Object.keys(P);
    const res = PR.resume(all.map(id => P[id].e));
    $('#score').innerHTML = `<div class="sc"><b>${res.maitrise}</b><span>${res.maitrise > 1 ? 'ponts maîtrisés' : 'pont maîtrisé'}</span></div><div class="sc"><b>${res['en-cours']}</b><span>en cours</span></div><div class="sc"><b>${st.score.faits}</b><span>${st.score.faits > 1 ? 'paires faites' : 'paire faite'}</span></div>`;
    $('#carte').innerHTML = LIENS.map(l => {
      const ids = pontsDe(l.id);
      const r = PR.resume(ids.map(id => P[id].e));
      return `<div class="ligne l-${l.id}">
        <p class="ligne-h"><span class="pastille"></span><b>${esc(l.label)}</b><span class="ligne-n">${r.maitrise}/${ids.length}</span></p>
        <div class="stations">${ids.map(id => `<button type="button" class="station s-${statutPont(id)}${st.pont === id ? ' cur' : ''}" data-pont-filtre="${id}" title="${esc(P[id].e)} : ${statutPont(id).replace('-', ' ')}"><i></i><span>${esc(P[id].e)}</span></button>`).join('')}</div>
      </div>`;
    }).join('');
  }

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

  /* ---------- Événements ---------- */
  document.addEventListener('click', e => {
    const t = e.target.closest('button');
    if (!t) return;
    const it = st.item;
    if (t.dataset.lien && it && st.etape === 1) {
      if (t.dataset.lien === it.rel) {
        st.lienOk = st.essais === 0; st.etape = 2;
        if (st.lienOk) st.score.liens++;
        render(false);
        const s2 = $$('.step')[1]; if (s2) s2.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'nearest' });
      } else {
        st.essais++;
        t.classList.add('is-ko'); t.disabled = true;
        const l = LIEN[it.rel];
        $('#fb-lien').innerHTML = st.essais >= 2
          ? `<b>C’est un lien de type « ${esc(l.label)} ».</b> ${esc(l.aide)} <button type="button" class="btn-txt" data-lien-go>Continuer</button>`
          : `<b>Pas tout à fait.</b> Indice : pose-toi la question « ${esc(l.q)} »`;
        if (st.essais >= 2) $$('.opt.liens, .liens .opt').forEach(b => { if (b.dataset.lien === it.rel) b.classList.add('is-ok'); });
      }
      return;
    }
    if (t.hasAttribute('data-lien-go')) { st.etape = 2; render(false); return; }
    if (t.dataset.pont && it && !st.choix) {
      const o = st.pontsOpts.find(x => x.p === t.dataset.pont);
      st.choix = o;
      st.score.faits++;
      if (o.ok) { st.score.ponts++; PR.marquer(P[o.p].e, 'ok', 'atelier'); }
      else { it.ok.forEach(k => PR.marquer(P[k.p].e, 'ko', 'atelier')); PR.marquer(P[o.p].e, 'vu', 'atelier'); }
      store.set('score', st.score);
      render(false); renderCarte();
      const rep = $('.reponse'); if (rep) rep.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'start' });
      return;
    }
    if (t.hasAttribute('data-retour')) { st.retourne = true; if (it) PR.marquer(P[it.back.p].e, 'vu', 'atelier'); render(false); renderCarte(); const r = $('.retour'); if (r) r.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'nearest' }); return; }
    if (t.hasAttribute('data-next')) { suivant(); return; }
    if (t.dataset.say) { speak(t.dataset.say); return; }
    if (t.dataset.filtre) { st.filtre = t.dataset.filtre; st.pont = null; store.set('filtre', st.filtre); renderFiltres(); renderCarte(); suivant(); return; }
    if (t.dataset.pontFiltre) { st.pont = t.dataset.pontFiltre; renderFiltres(); renderCarte(); suivant(); return; }
    if (t.id === 'theme') {
      const cur = document.documentElement.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next); store.set('theme', next);
    }
  });
  PR.surChangement(() => renderCarte());

  if (st.filtre !== 'tout' && !LIEN[st.filtre]) st.filtre = 'tout';
  renderFiltres();
  renderCarte();
  suivant();
})();
