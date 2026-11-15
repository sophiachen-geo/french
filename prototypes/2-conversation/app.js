/* Prototype 2 · Fil de conversation
   Une conversation tour par tour avec Sam : choisir un geste (fonction),
   prendre un début de phrase, dire la suite à voix haute, voir le schéma. */
(function () {
  'use strict';

  const C = window.CADRES, S = window.SITE, V = window.VIZ, D = window.P2;
  const { esc, norm } = C;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const MAX = D.MAX_TURNS;
  const ESS = {};
  S.meta.essentiels.forEach(e => { ESS[e.tab] = e; });
  const SCENARIOS = S.meta.scenarios;
  const SCN = {};
  SCENARIOS.forEach(s => { SCN[s.id] = s; });
  const reduce = () => C.reduceMotion();
  const fnStyle = tab => `--fh:${D.HUE[tab]}`;
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

  /* ---------- Liens entre fonctions : enchaînements et modèles ---------- */
  const SEQS = S.meta.chains.map(c => ({ kind: 'chain', steps: c.steps, tabs: c.steps.map(s => s[1]) }))
    .concat(S.models.map(m => ({ kind: 'model', m, steps: m.steps, tabs: m.steps.map(s => s[1]) })));
  const SUCC = {};
  SEQS.forEach(q => q.tabs.forEach((t, i) => {
    const n = q.tabs[i + 1];
    if (n && n !== t) { (SUCC[t] = SUCC[t] || []); if (!SUCC[t].includes(n)) SUCC[t].push(n); }
  }));

  /* ---------- Débuts de phrase ---------- */
  const clean = s => norm(s).replace(/\.\.\./g, ' ').replace(/[?!.«»]+/g, ' ').replace(/\s+,/g, ',')
    .replace(/\s+/g, ' ').trim().replace(/^,\s*/, '').replace(/,$/, '');
  const keyOf = e => clean((norm(e.split(' / ')[0]).split('...').find(p => p.replace(/[\s,.]/g, '')) || e));
  const COMMA = ['par contre', 'en plus', 'par exemple', "d'ailleurs", 'en fait', 'autrement dit', 'bref', 'finalement',
    'a mon avis', 'dans le fond', 'en parlant de ca', 'je vois'];

  function mkStarter(tab, k, qc) {
    const key = keyOf(k.e);
    let say = D.SAY[`${tab}|${k.e}|${k.c || ''}`] || D.SAY[`${tab}|${k.e}`];
    if (!say) {
      let s = cap(k.e.split(' / ')[0].trim());
      if (COMMA.includes(key)) s = s.replace(/[.…]+$/, '') + ', …';
      else if (s.includes('…')) s = s.replace(/\s*…/g, ' …');
      else s += ' …';
      say = s;
    }
    return { tab, e: k.e, say, c: k.c || '', r: k.r || '', ex: k.ex, key, qc };
  }
  const STARTERS = {};
  Object.keys(ESS).forEach(t => {
    const es = ESS[t];
    STARTERS[t] = es.cles.map(k => mkStarter(+t, k, false)).concat(es.qc.map(k => mkStarter(+t, k, true)));
  });
  /* 3 débuts visibles : 2 formules clés + 1 variante québécoise, puis rotation. */
  function visibleStarters(tab, rot) {
    const all = STARTERS[tab];
    const base = all.filter(s => !s.qc).slice(0, 2).concat(all.filter(s => s.qc).slice(0, 1));
    if (!rot) return base;
    const rest = all.filter(s => !base.includes(s));
    const pool = base.concat(rest);
    const out = [];
    for (let i = 0; i < 3; i++) out.push(pool[(rot * 3 + i) % pool.length]);
    return out.filter((s, i, a) => a.indexOf(s) === i);
  }

  const REG = { O: 'oral', QC: 'Québec', 'F-QC': 'familier QC', S: 'soutenu', 'O, QC': 'oral · Québec' };
  const regTag = r => r && REG[r] ? `<span class="tg tg-reg">${esc(REG[r])}</span>` : '';
  const MODE = { 'ind.': 'indicatif', 'subj.': 'subjonctif', 'inf.': 'infinitif', 'cond.': 'conditionnel', nom: 'un nom' };
  function consTag(c) {
    if (!c) return '';
    const m = Object.keys(MODE).find(k => c.includes(k));
    const k = /subj/.test(c) ? ' tg-subj' : '';
    return `<span class="tg tg-c${k}"${m ? ` title="suivi ${m === 'nom' ? 'd’' : 'de l’'}${MODE[m]}"` : ''}>${esc(c)}</span>`;
  }

  /* ---------- Correspondance avec les schémas et le site complet ---------- */
  function rowHeads(label) {
    const l = norm(String(label || '').replace(/\[[^\]]+\]/g, ''));
    return { full: l.replace(/\s+/g, ' ').trim(), heads: l.split(' / ').map(h => clean(h.replace(/\s\+\s.*$/, ''))).filter(Boolean) };
  }
  function findRow(st) {
    const specs = V.forTab(st.tab).filter(s => !s.type || s.type === 'rows');
    const alias = D.ROW_ALIAS[`${st.tab}|${st.key}`];
    const want = st.c ? norm(st.key + ' ' + st.c) : null;
    let best = null, score = 0;
    specs.forEach(spec => spec.rows.forEach((row, index) => {
      const r = rowHeads(row.label);
      let sc = 0;
      if (alias) { if (r.full.startsWith(alias) || r.heads.includes(clean(alias))) sc = 10; }
      else if (want && r.full === want) sc = 9;
      else if (r.heads.includes(st.key)) sc = 8;
      else if (r.heads.some(h => h.length > 2 && st.key.startsWith(h + ' '))) sc = 5;
      else if (r.heads.some(h => h.length > 3 && st.key.includes(h))) sc = 4;
      else if (r.heads.some(h => h.startsWith(st.key + ' '))) sc = 3;
      if (sc > score) { score = sc; best = { spec, row, index }; }
    }));
    return best;
  }
  function itemFor(tab, e) {
    const keys = String(e).split(' / ').map(keyOf);
    for (const k of keys) { const it = C.findItem(k, tab); if (it) return it; }
    const k0 = keys[0];
    return C.TABS[tab].items.find(it => it.keys.some(k => k.startsWith(k0) || (k.length > 3 && k0.startsWith(k)))) || null;
  }
  const tabLink = tab => C.siteLink('#onglet-' + tab);
  const itemLink = (tab, e) => { const it = itemFor(tab, e); return it ? C.siteLink(C.itemHref(it)) : tabLink(tab); };
  const rowLink = tab => row => row && row.label ? itemLink(tab, rowHeads(row.label).heads[0] || row.label) : tabLink(tab);
  const noId = spec => Object.assign({}, spec, { id: undefined });

  /* ---------- Schéma construit avec tes propres mots ---------- */
  const short = (s, n) => {
    n = n || 16;
    s = String(s || '').trim().replace(/[\s.,;:!?…]+$/, '').replace(/^[\s,;:]+/, '');
    if (s.length <= n) return s;
    const cut = s.slice(0, n), sp = cut.lastIndexOf(' ');
    return (sp > n * 0.5 ? cut.slice(0, sp) : cut).replace(/[\s,;:']+$/, '') + '…';
  };
  const tw = t => Math.max(14, String(t).length * 2.2 + 7);
  function splitAt(w, re) {
    const m = w.match(re);
    if (!m) return [w, ''];
    return [w.slice(0, m.index), w.slice(m.index + m[0].length)];
  }
  /* Deux cases reliées : L et R = { t, c, d (pointillés), x (barré) } */
  function pair(L, R, conn) {
    const g = conn.k === 'line' ? 6 : 16;
    let wl = tw(L.t), wr = tw(R.t);
    const free = 100 - g - wl - wr;
    if (free > 0) { wl += free / 2; wr += free / 2; } else { const f = (100 - g) / (wl + wr); wl *= f; wr *= f; }
    const a = +wl.toFixed(1), b = +(wl + g).toFixed(1), mid = (a + b) / 2;
    const m = [
      { k: 'box', x1: 0, x2: a, c: L.c, text: L.t, dashed: !!L.d, cross: !!L.x },
      { k: 'box', x1: b, x2: 100, c: R.c, text: R.t, dashed: !!R.d }
    ];
    if (conn.k === 'R') m.push({ k: 'arrow', x1: a + 1.5, x2: b - 1.5, c: conn.c || 'cadre', dashed: !!conn.d });
    if (conn.k === 'L') m.push({ k: 'arrow', x1: b - 1.5, x2: a + 1.5, c: conn.c || 'cadre', dashed: !!conn.d });
    if (conn.k === 'sign') m.push({ k: 'sign', x: mid, text: conn.t, c: conn.c });
    if (conn.k === 'line') m.push({ k: 'line', x1: a, x2: b, c: 'muted' });
    if (conn.k === 'wall') m.push({ k: 'wall', x: mid, c: 'cadre' });
    if (conn.label) m.push({ k: 'text', x: mid, text: conn.label, dy: -10, c: 'muted' });
    return m;
  }

  function liveSpec(t) {
    const st = t.st, k = st.key, W = (t.words || '').trim();
    const [a, b] = splitAt(W, /,\s*/);
    const ctx = short(t.ctx);
    const you = (txt, ph, c) => txt && txt.trim() ? { t: short(txt), c: c || 'cadre' } : { t: ph, c: c || 'cadre', d: true };
    const main = (txt, ph) => you(txt, ph, 'main');
    const rows = marks => [{ label: 'Ta phrase', marks }];
    const flowSpec = (legend, marks) => ({ flow: true, legend, rows: rows(marks) });
    switch (st.tab) {
      case 1: {
        const lg = [['cadre', 'le thème mis en avant'], ['main', 'ce que tu en dis']];
        if (/^le probleme/.test(k)) return flowSpec(lg, pair({ t: 'le problème', c: 'cadre' }, main(W, 'c’est que…'), { k: 'sign', t: '=', c: 'muted' }));
        if (/^ce qui/.test(k)) return flowSpec(lg, pair({ t: 'ce qui compte', c: 'cadre' }, main(W, 'c’est…'), { k: 'sign', t: '=', c: 'muted' }));
        if (/en parlant/.test(k)) return flowSpec(lg, pair({ t: ctx, c: 'cadre' }, main(W, 'ce que tu dis'), { k: 'R', c: 'muted' }));
        return flowSpec(lg, pair(you(a, 'le sujet'), main(b, 'ce que tu en dis'), { k: 'R', c: 'muted' }));
      }
      case 2: {
        const lg = [['main', 'le nom'], ['cadre', 'l’information ajoutée']];
        if (/^mon frere/.test(k)) return flowSpec([['cadre', 'la personne mise en avant'], ['main', 'ce que tu en dis']], pair({ t: 'mon voisin', c: 'cadre' }, main(W && 'il ' + W, 'il …'), { k: 'R', c: 'muted' }));
        if (/restaurant/.test(k)) return flowSpec([['main', 'ce que tu en dis'], ['cadre', 'la chose mise en avant']], pair(main(W && 'il est ' + W, 'il est …'), { t: 'ce coin-là', c: 'cadre' }, { k: 'L', c: 'muted' }));
        if (/raison/.test(k)) return flowSpec(lg, pair({ t: 'la raison', c: 'main' }, you(W && 'pour laquelle ' + W, 'pour laquelle…'), { k: 'line' }));
        const noun = k === 'ou' ? 'un endroit' : 'quelque chose';
        const rel = k === 'ou' ? 'où' : k;
        return flowSpec(lg, pair({ t: noun, c: 'main' }, you(W && rel + ' ' + W, rel + ' …'), { k: 'line' }));
      }
      case 3: {
        const ax = { today: 50 };
        if (k === 'il y a') return { axis: ax, legend: [['cadre', 'le moment passé']], rows: rows([{ k: 'gap', x1: 20, x2: 50, text: W ? short(W, 12) : 'combien ?' }, { k: 'point', x: 20, c: 'cadre' }]) };
        if (/^depuis/.test(k)) return { axis: ax, legend: [['cadre', 'le point de départ'], ['main', 'ce qui dure encore']], rows: rows([{ k: 'point', x: 18, c: 'cadre' }, { k: 'arrow', x1: 21, x2: 60 }, { k: 'text', x: 40, text: 'ça dure', dy: -9, c: 'muted' }]) };
        if (k === 'quand') return { axis: ax, lanes: 2, legend: true, rows: rows([{ k: 'point', x: 27, c: 'cadre', lane: 0 }, { k: 'bar', x1: 12, x2: 42, lane: 1 }]) };
        if (/^avant/.test(k)) return { axis: ax, lanes: 2, legend: true, rows: rows([{ k: 'bar', x1: 8, x2: 26, lane: 1 }, { k: 'bar', x1: 30, x2: 46, c: 'cadre', lane: 0 }]) };
        if (/^apres/.test(k)) return { axis: ax, lanes: 2, legend: true, rows: rows([{ k: 'bar', x1: 8, x2: 24, c: 'cadre', lane: 0 }, { k: 'bar', x1: 27, x2: 46, lane: 1 }]) };
        if (k === 'tantot') return { axis: ax, legend: [['cadre', 'plus tard aujourd’hui']], rows: rows([{ k: 'gap', x1: 50, x2: 62, text: 'tantôt' }, { k: 'point', x: 62, c: 'cadre' }]) };
        if (/fin de semaine/.test(k)) return { axis: ax, legend: [['cadre', 'samedi et dimanche']], rows: rows([{ k: 'bar', x1: 64, x2: 80, c: 'cadre', dashed: true }]) };
        return { axis: ax, legend: [['main', 'avant'], ['cadre', 'ce qui arrive ensuite']], rows: rows([{ k: 'bar', x1: 6, x2: 22 }, { k: 'arrow', x1: 24, x2: 31, c: 'muted' }, { k: 'bar', x1: 33, x2: 47, c: 'cadre' }]) };
      }
      case 4: {
        const lg = [['cadre', 'la cause'], ['main', 'l’effet']];
        if (['comme', 'vu que', 'a cause de', 'grace a'].includes(k)) {
          const conn = k === 'grace a' ? { k: 'sign', t: '+' } : k === 'a cause de' ? { k: 'sign', t: '−' } : { k: 'R' };
          return flowSpec(lg, pair(you(a, 'la cause'), b ? main(b) : { t: ctx, c: 'main' }, conn));
        }
        return flowSpec(lg, pair({ t: ctx, c: 'main' }, you(W, 'ta raison'), { k: 'L' }));
      }
      case 5: {
        const lg = [['main', 'la situation'], ['cadre', 'le résultat']];
        if (k === 'tellement') { const [x, y] = splitAt(W, /\s+que\s+|\s+qu['’]/); return flowSpec(lg, pair(main(x, 'très, très…'), you(y, 'le résultat'), { k: 'R' })); }
        return flowSpec(lg, pair({ t: ctx, c: 'main' }, you(W, 'le résultat'), { k: 'R' }));
      }
      case 6: {
        const neg = /ne pas/.test(k);
        const goal = you(W, 'ton objectif');
        return { flow: true, legend: [['main', 'toi'], ['cadre', neg ? 'ce que tu veux éviter' : 'ce que tu vises']], rows: rows([
          { k: 'person', x: 4, text: 'je' }, { k: 'arrow', x1: 10, x2: 26, c: neg ? 'main' : 'cadre' },
          { k: 'box', x1: 29, x2: 86, c: neg ? 'neg' : 'cadre', text: goal.t, dashed: !!goal.d },
          { k: 'flag', x: 91, c: neg ? 'neg' : 'cadre', cross: neg }
        ]) };
      }
      case 7: {
        const lg = [['cadre', 'la condition'], ['main', 'la conséquence']];
        const imag = /imparfait/.test(st.c) || k === 'mettons que';
        if (k === 'a condition que') return flowSpec(lg, pair({ t: ctx, c: 'main' }, you(W, 'la condition'), { k: 'wall' }));
        if (k === 'oui, sauf si' || k === 'sauf si') return flowSpec([['main', 'ce qui est prévu'], ['cadre', 'l’exception']], pair({ t: 'oui', c: 'main' }, Object.assign(you(W, 'l’exception'), { d: true }), { k: 'sign', t: '×' }));
        if (k === 'au cas ou') return flowSpec([['cadre', 'la possibilité'], ['main', 'la précaution']], pair(Object.assign(you(a, 'si jamais…'), { d: true }), main(b, 'la précaution'), { k: 'sign', t: '?', c: 'cadre' }));
        return flowSpec(lg, pair(Object.assign(you(a, 'la condition'), imag ? { d: true } : {}), main(b, 'alors…'), { k: 'R', c: 'main', d: imag, label: imag ? 'imaginé' : '' }));
      }
      case 8: {
        const lg = [['cadre', 'l’obstacle ou l’autre idée'], ['main', 'ta phrase principale']];
        if (['meme si', 'malgre', 'bien que'].includes(k)) return flowSpec(lg, pair(you(a, 'l’obstacle'), main(b, 'quand même…'), { k: 'R', c: 'main', label: 'quand même' }));
        if (k === 'alors que' || /^moi/.test(k)) { const [x, y] = splitAt(W, /,?\s*alors que\s*|,\s*/); return flowSpec(lg, pair(main(x, 'toi'), you(y, 'l’autre'), { k: 'sign', t: '⇄', c: 'muted' })); }
        if (/bord/.test(k)) { const [x, y] = splitAt(W, /,?\s*de l['’]autre,?\s*|,\s*/); return flowSpec(lg, pair(main(x, 'un côté'), you(y, 'l’autre côté'), { k: 'sign', t: '⇄', c: 'muted' })); }
        return flowSpec(lg, pair({ t: ctx, c: 'main' }, you(W, 'l’autre côté'), { k: 'sign', t: '⇄', c: 'muted' }));
      }
      case 9: {
        const POS = { 'je trouve que': 72, 'je pense que': 72, 'a mon avis': 70, 'je ne pense pas que': 22, 'peut-etre que': 48, 'moi, je trouve que': 78, 'me semble que': 60 };
        const pos = POS[k] || 66, subj = /subj/.test(st.c);
        const marks = [{ k: 'bar', x1: 0, x2: pos, c: subj ? 'cadre' : 'main' }];
        if (st.c) marks.push({ k: 'tag', x: Math.min(pos + 12, 92), text: subj ? 'subj.' : 'ind.', c: subj ? 'cadre' : 'main' });
        return { axis: { labels: [[0, 'pas sûre'], [50, 'possible'], [100, 'certaine']] }, legend: [[subj ? 'cadre' : 'main', subj ? 'tu doutes : subjonctif' : 'tu es assez sûre : indicatif']], rows: rows(marks) };
      }
      case 10: {
        const lg = [['main', 'l’idée'], ['cadre', 'ce que tu ajoutes']];
        const conn = ['en plus', 'pis aussi', "d'ailleurs"].includes(k) ? { k: 'sign', t: '+' } : k === "c'est-a-dire" ? { k: 'sign', t: '=', c: 'muted' } : { k: 'R' };
        return flowSpec(lg, pair({ t: ctx, c: 'main' }, you(W, 'ce que tu ajoutes'), conn));
      }
      case 11: {
        const lg = [['main', 'ce qu’on a dit'], ['cadre', 'ce que tu conclus']];
        if (/^d'abord/.test(k)) {
          const p = W ? W.split(/\s*[;,]\s*|\s+ensuite\s+|\s+enfin\s+/).filter(Boolean) : [];
          return flowSpec([['main', 'les étapes'], ['cadre', 'la dernière']], [
            { k: 'box', x1: 0, x2: 28, text: short(p[0], 9) || '1' }, { k: 'arrow', x1: 30, x2: 35, c: 'muted' },
            { k: 'box', x1: 36, x2: 64, text: short(p[1], 9) || '2', dashed: !p[1] }, { k: 'arrow', x1: 66, x2: 71, c: 'muted' },
            { k: 'box', x1: 72, x2: 100, c: 'cadre', text: short(p[2], 9) || '3', dashed: !p[2] }]);
        }
        if (k === 'en fait') return flowSpec(lg, pair({ t: ctx, c: 'main', x: true }, you(W, 'la correction'), { k: 'R' }));
        if (k === 'autrement dit') return flowSpec(lg, pair({ t: ctx, c: 'main' }, you(W, 'la même idée'), { k: 'sign', t: '=', c: 'muted' }));
        const g = you(W, 'l’essentiel');
        return flowSpec(lg, [{ k: 'box', x1: 0, x2: 9, c: 'muted', dashed: k === 'dans le fond' }, { k: 'box', x1: 11, x2: 20, c: 'muted', dashed: k === 'dans le fond' }, { k: 'box', x1: 22, x2: 31, c: 'muted', dashed: k === 'dans le fond' },
          { k: 'arrow', x1: 34, x2: 46, c: 'cadre' }, { k: 'box', x1: 49, x2: 100, c: 'cadre', text: g.t, dashed: !!g.d }]);
      }
      default: {
        const lg = [['main', 'Sam parle'], ['cadre', 'toi']];
        const lanes = marks => ({ lanes: 2, legend: lg, rows: rows(marks) });
        if (/veux dire|apres|^fait que/.test(k)) return lanes([{ k: 'bar', x1: 4, x2: 40, lane: 0 }, { k: 'bar', x1: 43, x2: 58, c: 'cadre', lane: 1 }, { k: 'bar', x1: 61, x2: 96, lane: 0, dashed: true }]);
        if (/vrai, mais/.test(k)) return lanes([{ k: 'bar', x1: 4, x2: 42, lane: 0 }, { k: 'bar', x1: 45, x2: 57, c: 'cadre', lane: 1, dashed: true }, { k: 'bar', x1: 59, x2: 80, c: 'cadre', lane: 1 }, { k: 'point', x: 86, lane: 0 }]);
        const m = [{ k: 'bar', x1: 4, x2: 44, lane: 0 }, { k: 'point', x: 48, c: 'cadre', lane: 1 }];
        if (W) m.push({ k: 'bar', x1: 53, x2: 66, c: 'cadre', lane: 1 });
        m.push({ k: 'bar', x1: W ? 70 : 54, x2: 96, lane: 0, dashed: true });
        return lanes(m);
      }
    }
  }

  /* ---------- Texte de ta réplique ---------- */
  function fullText(say, words) {
    const w = (words || '').trim();
    if (!w) return '';
    const parts = say.split('…');
    const head = parts[0].trim().replace(/[,;:]$/, '');
    if (head && norm(w).startsWith(norm(head))) return cap(w);
    const s = parts.length === 2 ? parts[0] + w + parts[1] : parts[0] + w;
    return s.replace(/\s+/g, ' ').replace(/\s+([,.])/g, '$1').trim();
  }
  function sentenceHTML(t) {
    const parts = t.st.say.split('…');
    const w = (t.words || '').trim();
    if (w) {
      const head = parts[0].trim().replace(/[,;:]$/, '');
      if (head && norm(w).startsWith(norm(head))) return `<span class="xp">${esc(cap(w).slice(0, head.length))}</span>${esc(cap(w).slice(head.length))}`;
      const tail = parts.length === 2 ? parts[1] : '';
      return `<span class="xp">${esc(parts[0].trimEnd())}</span> ${esc(w)}${esc(tail)}`.replace(/ ([,.])/g, '$1');
    }
    const blank = t.done ? `<span class="blank said" title="dit à voix haute">${D.ui('wave', 16)}<span class="sr">(dit à voix haute)</span></span>` : '<span class="blank"><span class="sr">(à compléter)</span></span>';
    return parts.map((p, i) => (i === 0 ? `<span class="xp">${esc(p)}</span>` : esc(p))).join(blank);
  }

  /* ---------- État ---------- */
  const st = {
    scn: null, x: null, turns: [], phase: 'moves', sel: null, rot: 0, invited: null,
    usedSuite: false, lastSam: 'open', asked: new Set(), samLines: [], token: 0, preview: null
  };
  const doneTurns = () => st.turns.filter(t => t.done);

  function askText(tab) {
    const a = D.ASK[tab];
    if (!a) return '';
    const v = st.scn.type === 'nouvelle' && a.n ? a.n : a.q;
    return typeof v === 'function' ? v(st.x) || '' : v;
  }
  function nextInvite(T) {
    const used = new Set(st.turns.map(t => t.tab));
    const fns = st.scn.fonctions;
    const ok = n => !used.has(n) && !st.asked.has(n) && !!askText(n);
    if (doneTurns().length === MAX - 1 && ok(11)) return 11;
    const succ = SUCC[T] || [];
    return succ.find(n => fns.includes(n) && ok(n)) || fns.find(ok) || succ.find(ok) || [9, 4, 10, 8, 3, 6, 1].find(ok) || null;
  }
  function options() {
    const used = new Set(st.turns.filter(t => t.done).map(t => t.tab));
    const last = doneTurns().slice(-1)[0];
    const list = [];
    const add = (tab, why) => { if (tab && !list.some(o => o.tab === tab)) list.push({ tab, why }); };
    if (st.invited) add(st.invited, 'invite');
    st.scn.fonctions.filter(n => !used.has(n)).forEach(n => add(n, 'scn'));
    if (last) (SUCC[last.tab] || []).filter(n => !used.has(n)).forEach(n => add(n, 'succ'));
    [9, 4, 10, 8, 3, 6, 5, 7, 1, 2, 11].filter(n => !used.has(n)).forEach(n => add(n, 'fill'));
    const out = list.filter(o => o.tab !== 12).slice(0, 3);
    const r = list.find(o => o.tab === 12);
    if (st.invited === 12) out.unshift(r); else out.push(r || { tab: 12, why: 'always' });
    if (out[out.length - 1].tab === 12 && out[out.length - 1].why !== 'invite') out[out.length - 1].why = 'always';
    return out;
  }
  const whyText = (o) => {
    const last = doneTurns().slice(-1)[0];
    if (o.why === 'invite') return 'Sam t’y invite';
    if (o.why === 'succ' && last) return `Suit souvent « ${D.SHORT[last.tab]} »`;
    if (o.why === 'scn') return 'Utile pour ce sujet';
    if (o.why === 'always') return 'Toujours possible';
    return 'Autre idée';
  };

  /* ---------- Rendu : messages ---------- */
  const THREAD = () => $('#thread');
  const DOCK = () => $('#dock');
  const canSpeak = 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';
  function speak(text) {
    if (!canSpeak) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      const vs = speechSynthesis.getVoices() || [];
      const v = vs.find(x => /fr[-_]CA/i.test(x.lang)) || vs.find(x => /^fr/i.test(x.lang));
      if (v) u.voice = v;
      u.lang = v ? v.lang : 'fr-CA';
      u.rate = 0.92;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } catch (e) { /* synthèse vocale indisponible */ }
  }
  const sayBtn = (text, label) => canSpeak ? `<button type="button" class="say" data-say="${esc(text)}" aria-label="${esc(label || 'Écouter')}">${D.ui('speaker', 18)}</button>` : '';

  function reveal(el, block) {
    if (!el) return;
    el.scrollIntoView({ block: block || 'start', behavior: reduce() ? 'auto' : 'smooth' });
  }
  function append(html) {
    const tpl = document.createElement('template');
    tpl.innerHTML = html.trim();
    const el = tpl.content.firstElementChild;
    THREAD().appendChild(el);
    return el;
  }
  function postSam(text, kind) {
    st.samLines.push(text);
    return append(`<div class="msg sam${kind ? ' sam-' + kind : ''}"><span class="av" aria-hidden="true">S</span><p class="bub"><span class="sr">Sam : </span>${esc(text)}</p>${sayBtn(text, 'Écouter Sam')}</div>`);
  }
  function typing() {
    return append('<div class="msg sam typing" aria-hidden="true"><span class="av">S</span><p class="bub"><i></i><i></i><i></i></p></div>');
  }
  const wait = ms => new Promise(r => setTimeout(r, ms));
  async function samSays(lines, tok) {
    for (const [text, kind] of lines) {
      const ty = typing();
      await wait(reduce() ? 120 : 550 + Math.min(text.length * 9, 700));
      ty.remove();
      if (tok !== st.token) return false;
      postSam(text, kind);
    }
    return true;
  }

  function meHTML(t) {
    const es = ESS[t.tab];
    return `<div class="msg me" style="${fnStyle(t.tab)}">
      <p class="me-tag">${D.icon(t.tab, 16)}<span>${esc(es.je)}</span></p>
      <p class="bub"><span class="sr">Toi : </span><span class="line">${sentenceHTML(t)}</span></p>
    </div>`;
  }
  function howHTML(t) {
    const s = t.st, es = ESS[t.tab];
    const match = findRow(s);
    const ref = match ? V.render(noId(Object.assign({}, match.spec, { rows: [match.row], legend: match.spec.legend })), { examples: true, title: false, link: rowLink(t.tab) }) : '';
    const all = V.forTab(t.tab);
    const allHTML = all.map(sp => V.render(noId(sp), { examples: true, link: rowLink(t.tab) })).join('');
    return `<section class="how" style="${fnStyle(t.tab)}" aria-label="Comment ça marche">
      <header class="how-h"><p class="kick">Comment ça marche</p>
        <p class="how-x"><b>${esc(s.e.split(' / ')[0])}</b> ${consTag(s.c)}${regTag(s.r)}</p></header>
      <div class="how-live"><p class="how-l">Ta phrase en schéma</p><div class="live" data-live>${V.render(liveSpec(t), { title: false })}</div></div>
      ${ref ? `<div class="how-ref"><p class="how-l">La formule, avec un exemple</p>${ref}</div>` : ''}
      <p class="trap"><span class="trap-k">À éviter</span> ${V.md(es.attention)}</p>
      <details class="all-viz"><summary>Tous les schémas : ${esc(es.je.toLowerCase())}</summary><div class="all-in">${allHTML}</div></details>
      <p class="how-go"><a href="${esc(itemLink(t.tab, s.e))}">« ${esc(s.e.split(' / ')[0])} » dans le site complet ${D.ui('link', 16)}</a></p>
    </section>`;
  }
  function markRow(root, match) {
    if (!root || !match) return;
    $$('figure.vz', root).forEach(fig => {
      const rows = $$('.vz-rows > .vz-row:not(.vz-head)', fig);
      const t = fig.querySelector('.vz-t');
      if (t && t.textContent.trim() === String(match.spec.title || '').replace(/\*/g, '').trim() && rows[match.index]) rows[match.index].classList.add('hit');
    });
  }
  function refreshTurn(t) {
    if (!t.el) return;
    $('.line', t.el).innerHTML = sentenceHTML(t);
    const live = t.how && $('[data-live]', t.how);
    if (live) live.innerHTML = V.render(liveSpec(t), { title: false });
  }

  /* ---------- Rendu : le panneau « Que fais-tu ? » ---------- */
  function movesHTML() {
    const opts = options();
    const n = doneTurns().length;
    const inv = st.invited ? ESS[st.invited].je.toLowerCase() : '';
    return `<div class="dock-in">
      <div class="dock-h"><h2 id="dock-t" tabindex="-1">Que fais-tu ?</h2><p class="dock-n">Tour ${n + 1} sur ${MAX}</p></div>
      <p class="dock-sub">${st.invited ? `Sam t’invite à <b>${esc(inv)}</b>. Mais c’est toi qui choisis.` : 'Choisis ce que tu veux faire avec ta réponse.'}</p>
      <div class="moves">${opts.map(o => {
        const es = ESS[o.tab];
        const eg = STARTERS[o.tab].filter(s => !s.qc).slice(0, 3).map(s => esc(s.e.split(' / ')[0].replace(/…$/, ''))).join(' · ');
        return `<button type="button" class="move${o.why === 'invite' ? ' invite' : ''}" style="${fnStyle(o.tab)}" data-move="${o.tab}">
          <span class="tile">${D.icon(o.tab, 24)}</span>
          <span class="mv-t"><span class="mv-v">${esc(es.je)}</span><span class="mv-eg">${eg}</span><span class="mv-why">${o.why === 'invite' ? D.ui('spark', 13) : ''}${esc(whyText(o))}</span></span>
        </button>`;
      }).join('')}</div>
      ${n >= 2 ? `<p class="dock-end"><button type="button" class="link-btn" data-act="bilan">${D.ui('check', 16)} Terminer et voir le bilan</button></p>` : ''}
    </div>`;
  }
  function startersHTML() {
    const tab = st.sel, es = ESS[tab];
    const list = visibleStarters(tab, st.rot);
    return `<div class="dock-in" style="${fnStyle(tab)}">
      <div class="picked"><span class="tile">${D.icon(tab, 22)}</span><div><p class="picked-v">${esc(es.je)}</p><p class="picked-q">${esc(es.quand)}</p></div>
        <button type="button" class="link-btn" data-act="moves" aria-label="Changer de geste">${D.ui('back', 16)} Changer</button></div>
      <h2 class="chips-h" id="dock-t" tabindex="-1">Prends un début de phrase</h2>
      <div class="chips">${list.map(s => `<button type="button" class="chip" data-starter="${STARTERS[tab].indexOf(s)}">
        <span class="chip-t">${esc(s.say).replace(/…/g, '<span class="dots">…</span>')}</span><span class="chip-tags">${consTag(s.c)}${regTag(s.r)}</span></button>`).join('')}</div>
      ${STARTERS[tab].length > 3 ? `<p class="chips-more"><button type="button" class="link-btn" data-act="rot">${D.ui('restart', 16)} D’autres débuts (${STARTERS[tab].length} en tout)</button></p>` : ''}
    </div>`;
  }
  function speakHTML(t) {
    return `<div class="dock-in speak" style="${fnStyle(t.tab)}">
      <div class="speak-h"><span class="mic">${D.ui('wave', 26)}</span><div><h2 id="dock-t" tabindex="-1">Dis la suite à voix haute</h2>
        <p>Termine la phrase pour Sam, comme dans une vraie conversation. L’écrire est facultatif.</p></div></div>
      <form class="speak-f" data-form>
        <label class="sr" for="words">Ta suite (facultatif)</label>
        <input id="words" name="words" type="text" autocomplete="off" autocapitalize="off" spellcheck="true" enterkeyhint="send" placeholder="ta suite… (facultatif)" value="${esc(t.words || '')}">
        <button type="submit" class="btn primary">${D.ui('check', 18)}<span>C’est dit</span></button>
      </form>
      <div class="speak-x">
        <button type="button" class="link-btn" data-act="idea" aria-expanded="false" aria-controls="idea">${D.ui('bulb', 16)} Besoin d’une idée ?</button>
        <button type="button" class="link-btn" data-act="restarter">${D.ui('back', 16)} Autre début</button>
      </div>
      <p class="idea" id="idea" hidden><span class="idea-k">Exemple</span> « ${esc(t.st.ex)} » ${sayBtn(t.st.ex, 'Écouter l’exemple')}</p>
    </div>`;
  }
  function endHTML() {
    return `<div class="dock-in dock-fin"><p>La conversation est finie. Tu veux recommencer ?</p>
      <div class="fin-b"><button type="button" class="btn primary" data-act="replay">${D.ui('restart', 18)}<span>Rejouer cette situation</span></button>
      <button type="button" class="btn" data-act="shuffle">${D.ui('shuffle', 18)}<span>Autre situation</span></button></div></div>`;
  }
  function renderDock(focus) {
    const dock = DOCK();
    let html = '';
    if (st.phase === 'moves') html = movesHTML();
    else if (st.phase === 'starters') html = startersHTML();
    else if (st.phase === 'speak') html = speakHTML(st.turns[st.turns.length - 1]);
    else if (st.phase === 'end') html = endHTML();
    dock.innerHTML = html;
    dock.hidden = !html;
    if (focus) {
      const target = focus === 'chip' ? $('.chip', dock) : $('#dock-t', dock);
      if (target) target.focus({ preventScroll: true });
    }
    renderFil();
    renderRef();
  }

  /* ---------- Fil (bandeau mobile + panneau large) ---------- */
  function seqTabs() { return st.turns.map(t => t.tab); }
  function lcs(a, b) {
    const d = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = a[i - 1] === b[j - 1] ? d[i - 1][j - 1] + 1 : Math.max(d[i - 1][j], d[i][j - 1]);
    return d[a.length][b.length];
  }
  function closest(kind) {
    const seq = doneTurns().map(t => t.tab);
    let best = null, score = -1;
    SEQS.filter(q => q.kind === kind).forEach(q => {
      const set = new Set(q.tabs);
      const sc = lcs(seq, q.tabs) * 2 + seq.filter((t, i) => seq.indexOf(t) === i && set.has(t)).length;
      if (sc > score) { score = sc; best = q; }
    });
    return score > 0 ? best : null;
  }
  function stepsChips(q, usedSet) {
    return q.steps.map(([label, tab]) => `<a class="mstep${usedSet.has(tab) ? ' on' : ''}" style="${fnStyle(tab)}" href="${esc(tabLink(tab))}">${D.icon(tab, 14)}<span>${esc(label)}</span>${usedSet.has(tab) ? D.ui('check', 14) : ''}</a>`).join('<span class="mstep-a" aria-hidden="true">→</span>');
  }
  function renderFil() {
    const strip = $('#strip');
    const turns = st.turns;
    if (strip) {
      let h = `<li class="s-sam"><span class="av av-s" aria-hidden="true">S</span><span class="sr">Sam ouvre la conversation</span></li>`;
      for (let i = 0; i < MAX; i++) {
        const t = turns[i];
        if (t) h += `<li class="s-step${t.done ? '' : ' now'}" style="${fnStyle(t.tab)}">${D.icon(t.tab, 15)}<span>${esc(D.SHORT[t.tab])}</span></li>`;
        else if (i === turns.length && st.phase === 'starters' && st.sel) h += `<li class="s-step now" style="${fnStyle(st.sel)}">${D.icon(st.sel, 15)}<span>${esc(D.SHORT[st.sel])}</span></li>`;
        else h += `<li class="s-slot"><span>${i + 1}</span><span class="sr">tour ${i + 1} à venir</span></li>`;
      }
      strip.innerHTML = h;
      const cur = $('.now', strip) || $('.s-slot', strip);
      if (cur && strip.parentElement && strip.parentElement.scrollWidth > strip.parentElement.clientWidth) strip.parentElement.scrollLeft = cur.offsetLeft - 40;
    }
    const panel = $('#fil-panel');
    if (!panel) return;
    const used = new Set(doneTurns().map(t => t.tab));
    const m = closest('model');
    let h = `<p class="kick">Ton fil</p><h2 class="side-h">Les gestes que tu enchaînes</h2><ol class="pfil">
      <li class="pf-sam"><span class="av av-s" aria-hidden="true">S</span><span>« ${esc(st.scn.dit)} »</span></li>`;
    turns.forEach((t, i) => {
      if (i > 0 && t.invite) h += `<li class="pf-link"><span>Sam : « ${esc(t.invite)} »</span></li>`;
      const line = fullText(t.st.say, t.words);
      h += `<li class="pf-step${t.done ? '' : ' now'}" style="${fnStyle(t.tab)}"><span class="tile">${D.icon(t.tab, 18)}</span><span class="pf-t"><b>${esc(ESS[t.tab].je)}</b><span>${line ? esc(line) : esc(t.st.say)}</span></span></li>`;
    });
    if (st.phase !== 'end' && turns.length < MAX) {
      const nx = st.phase === 'starters' ? st.sel : st.invited;
      if (turns.length && turns[turns.length - 1].done && st.invited) h += `<li class="pf-link"><span>Sam : « ${esc(askText(st.invited))} »</span></li>`;
      h += `<li class="pf-next"${nx ? ` style="${fnStyle(nx)}"` : ''}><span class="tile">${nx ? D.icon(nx, 18) : '?'}</span><span class="pf-t"><b>${st.phase === 'starters' && st.sel ? esc(ESS[st.sel].je) : 'À toi'}</b><span>${st.phase === 'starters' ? 'choisis un début' : nx ? 'Sam t’invite à : ' + esc(ESS[nx].je.toLowerCase()) : 'choisis un geste'}</span></span></li>`;
    }
    h += '</ol>';
    if (m) h += `<div class="pmodel"><p class="kick">Le modèle le plus proche</p><p class="pm-t"><a href="${esc(C.siteLink('#relier--m' + m.m.n))}">${esc(m.m.title)}</a></p><div class="msteps">${stepsChips(m, used)}</div></div>`;
    panel.innerHTML = h;
  }
  function focusTab() {
    if (st.preview) return st.preview;
    if (st.phase === 'starters') return st.sel;
    if (st.phase === 'speak') return st.turns[st.turns.length - 1].tab;
    if (st.phase === 'moves') return st.invited || st.scn.fonctions[0];
    const last = doneTurns().slice(-1)[0];
    return last ? last.tab : st.scn.fonctions[0];
  }
  let refTab = null, refKey = null;
  function renderRef() {
    const box = $('#ref-panel');
    if (!box || getComputedStyle(box.parentElement).display === 'none') return;
    const tab = focusTab();
    const cur = st.phase === 'speak' ? st.turns[st.turns.length - 1] : null;
    const key = tab + '|' + (cur ? cur.st.e + cur.st.c : '');
    if (key === refTab + '|' + refKey) return;
    refTab = tab; refKey = cur ? cur.st.e + cur.st.c : '';
    const es = ESS[tab];
    box.innerHTML = `<p class="kick" style="${fnStyle(tab)}">Schéma de la fonction</p>
      <h2 class="side-h ref-h" style="${fnStyle(tab)}"><span class="tile">${D.icon(tab, 18)}</span>${esc(es.je)}</h2>
      ${V.forTab(tab).map(sp => V.render(noId(sp), { examples: false, link: rowLink(tab) })).join('')}
      <p class="ref-go"><a href="${esc(tabLink(tab))}">Onglet ${tab} · ${esc(C.tabTitle(tab))} ${D.ui('link', 15)}</a></p>`;
    if (cur) markRow(box, findRow(cur.st));
  }

  /* ---------- Situations ---------- */
  function scnListHTML() {
    const group = (type, title) => `<p class="sl-g">${title}</p><ul class="sl">${SCENARIOS.filter(s => s.type === type).map(s => `
      <li><button type="button" class="sl-b" data-scn="${s.id}"${st.scn && st.scn.id === s.id ? ' aria-current="true"' : ''}>
        <span class="sl-d">« ${esc(s.dit)} »</span>
        <span class="sl-m"><span class="sl-th">${esc(s.theme)}</span><span class="sl-f">${s.fonctions.map(f => `<span class="sl-i" style="${fnStyle(f)}" title="${esc(ESS[f].je)}">${D.icon(f, 13)}</span>`).join('')}</span></span>
      </button></li>`).join('')}</ul>`;
    return group('question', 'Sam te pose une question') + group('nouvelle', 'Sam t’annonce une nouvelle');
  }
  function renderScnLists() {
    $$('[data-scn-list]').forEach(el => { el.innerHTML = scnListHTML(); });
  }

  /* ---------- Déroulement ---------- */
  function start(id) {
    st.token++;
    const scn = SCN[id] || SCENARIOS[0];
    Object.assign(st, { scn, x: D.SCN[scn.id] || {}, turns: [], phase: 'moves', sel: null, rot: 0, invited: scn.fonctions[0], usedSuite: false, lastSam: 'open', asked: new Set([scn.fonctions[0]]), samLines: [], preview: null });
    refTab = null;
    try { history.replaceState(null, '', '#' + scn.id); } catch (e) { /* file:// sans historique */ }
    $('#scn-theme').textContent = scn.theme;
    $('#scn-type').textContent = scn.type === 'question' ? 'te pose une question' : 't’annonce une nouvelle';
    THREAD().innerHTML = '';
    append(`<p class="sys"><span>${esc(cap(scn.theme))}</span> · Sam ${scn.type === 'question' ? 'te pose une question' : 't’annonce une nouvelle'}</p>`);
    postSam(scn.dit, 'open');
    renderScnLists();
    renderDock();
    window.scrollTo(0, 0);
  }

  function chooseMove(tab) {
    st.sel = tab; st.rot = 0; st.phase = 'starters'; st.preview = null;
    renderDock('chip');
    reveal(DOCK(), 'nearest');
  }
  function chooseStarter(i) {
    const s = STARTERS[st.sel][i];
    const prev = doneTurns().slice(-1)[0];
    const ctx = st.scn.type === 'question' && prev && prev.words ? prev.words : st.x.court || st.scn.theme;
    const t = { tab: st.sel, st: s, words: '', done: false, ctx, invite: st.turns.length ? st.samLines[st.samLines.length - 1] : st.scn.dit };
    st.turns.push(t);
    t.el = append(meHTML(t));
    t.how = append(howHTML(t));
    markRow(t.how, findRow(s));
    st.phase = 'speak';
    renderDock('title');
    reveal(t.el, 'start');
  }
  async function finishTurn(words) {
    const t = st.turns[st.turns.length - 1];
    t.words = (words || '').trim();
    t.done = true;
    refreshTurn(t);
    st.phase = 'wait';
    renderDock();
    const tok = st.token;
    const T = t.tab, n = doneTurns().length;
    let ack;
    if (T === 12) {
      if (!st.usedSuite && st.x.suite && (st.scn.type === 'nouvelle' || st.lastSam === 'partage')) { ack = st.x.suite; st.usedSuite = true; }
      else ack = st.lastSam === 'open' ? D.ACK[12] : 'Ha ha, oui !';
    } else ack = D.ACK[T];
    const lines = [[ack, 'ack']];
    let N = null;
    if (n < MAX) {
      N = nextInvite(T);
      if (N) { lines.push([askText(N), 'ask']); st.asked.add(N); }
    } else lines.push([D.CLOSING, 'ack']);
    const ok = await samSays(lines, tok);
    if (!ok) return;
    st.lastSam = N === 12 ? 'partage' : 'ask';
    st.invited = N;
    if (n >= MAX) return showBilan(tok);
    st.phase = 'moves'; st.sel = null;
    const hadFocus = !document.activeElement || document.activeElement === document.body || DOCK().contains(document.activeElement);
    renderDock(hadFocus ? 'title' : null);
    const lastSam = $$('.msg.sam', THREAD()).slice(-2)[0];
    reveal(lastSam, 'start');
  }
  async function endEarly() {
    const tok = st.token;
    st.phase = 'wait';
    renderDock();
    const ok = await samSays([[D.CLOSING, 'ack']], tok);
    if (ok) showBilan(tok);
  }

  /* ---------- Bilan ---------- */
  function lanesSpec() {
    const segs = [];
    const turns = doneTurns();
    const samBefore = turns.map((t, i) => (i === 0 ? st.scn.dit : t.invite || ''));
    turns.forEach((t, i) => {
      segs.push({ who: 0, n: samBefore[i].length });
      segs.push({ who: 1, n: (fullText(t.st.say, t.words) || t.st.say).length + (t.words ? 0 : 24) });
    });
    segs.push({ who: 0, n: D.CLOSING.length });
    const total = segs.reduce((a, s) => a + Math.max(s.n, 18), 0);
    let x = 1;
    const avail = 98 - segs.length * 1.2;
    const marks = segs.map(s => {
      const w = Math.max(s.n, 18) / total * avail;
      const m = { k: 'bar', x1: +x.toFixed(1), x2: +(x + w).toFixed(1), lane: s.who, c: s.who ? 'cadre' : 'main' };
      x += w + 1.2;
      return m;
    });
    return { lanes: 2, legend: [['main', 'Sam'], ['cadre', 'toi']], rows: [{ label: 'Votre échange', sub: `${turns.length} répliques chacun`, marks }] };
  }
  function showBilan(tok) {
    if (tok !== st.token) return;
    st.phase = 'end';
    const turns = doneTurns();
    const used = new Set(turns.map(t => t.tab));
    const model = closest('model');
    const chain = closest('chain');
    const flow = turns.map((t, i) => {
      const es = ESS[t.tab];
      const line = fullText(t.st.say, t.words);
      const link = i > 0 && t.invite ? `<li class="fl-link"><span>Sam : « ${esc(t.invite)} »</span></li>` : '';
      return `${link}<li class="fl-step" style="${fnStyle(t.tab)}">
        <div class="fl-h"><span class="tile">${D.icon(t.tab, 22)}</span><div><p class="fl-n">Geste ${i + 1}</p><p class="fl-v">${esc(es.je)}</p></div></div>
        <p class="fl-s">${line ? esc(line) : `<b>${esc(t.st.say.replace(/\s*…\s*/g, ' … ').trim())}</b> <span class="fl-said">(dit à voix haute)</span>`}</p>
        <div class="fl-viz">${V.render(liveSpec(t), { title: false })}</div>
        <p class="fl-go"><a href="${esc(itemLink(t.tab, t.st.e))}">« ${esc(t.st.e.split(' / ')[0])} »</a> · <a href="${esc(tabLink(t.tab))}">onglet ${t.tab}</a></p>
      </li>`;
    }).join('');
    const redis = turns.map(t => {
      const line = fullText(t.st.say, t.words);
      const parts = t.st.say.split('…');
      return line ? `<span class="rd" style="${fnStyle(t.tab)}">${esc(line)}</span>` : `<span class="rd" style="${fnStyle(t.tab)}"><b>${esc(parts[0].trim())}</b> …</span>`;
    }).join(' ');
    const html = `<section class="bilan" aria-labelledby="bilan-t">
      <header class="bl-h"><p class="kick">Bilan</p><h2 id="bilan-t" tabindex="-1">Ton fil de conversation</h2>
        <p>Tu as répondu à Sam en ${turns.length} gestes. Voici comment ils s’enchaînent.</p></header>
      <ol class="flow"><li class="fl-start"><span class="av" aria-hidden="true">S</span><span>« ${esc(st.scn.dit)} »</span></li>${flow}</ol>
      <div class="bl-grid">
        <section class="bl-card"><h3>Qui a parlé, quand ?</h3><p class="bl-sub">En haut Sam, en bas toi : chaque barre est une réplique.</p>${V.render(lanesSpec(), { title: false })}</section>
        ${model ? `<section class="bl-card bl-model"><h3>Le modèle le plus proche</h3>
          <p class="bl-mt"><span class="bl-mn">${model.m.n}</span>${esc(model.m.title)}</p>
          <div class="msteps">${stepsChips(model, used)}</div>
          <blockquote class="bl-q">${modelText(model.m)}</blockquote>
          ${chain ? `<p class="bl-sub">Enchaînement fréquent voisin :</p><div class="msteps">${stepsChips(chain, used)}</div>` : ''}
          <p class="bl-go"><a href="${esc(C.siteLink('#relier--m' + model.m.n))}">Voir ce modèle dans le site complet ${D.ui('link', 15)}</a></p></section>` : ''}
        <section class="bl-card bl-redis"><h3>Redis tout d’un trait</h3><p class="bl-sub">Sans regarder, à voix haute, en reliant tes phrases.</p><p class="rd-p">${redis}</p></section>
      </div>
    </section>`;
    const el = append(html);
    renderDock();
    reveal(el, 'start');
    const h = $('#bilan-t', el);
    if (h) h.focus({ preventScroll: true });
  }
  function modelText(m) {
    const seg = ([k, t]) => {
      const s = esc(t.replace(/\n$/, '')).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
      return k == null ? `<span class="mq-o">${s}</span>` : `<span class="mq" style="${fnStyle(m.steps[k][1])}">${s}</span>`;
    };
    if (!m.dialogue) return `<p>${m.segments.map(seg).join('')}</p>`;
    const lines = [[]];
    m.segments.forEach(s => { lines[lines.length - 1].push(s); if (s[1].endsWith('\n')) lines.push([]); });
    return lines.filter(l => l.length).map(l => `<p>— ${l.map(seg).join('')}</p>`).join('');
  }

  /* ---------- Thème ---------- */
  function applyTheme(t) {
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
    else document.documentElement.removeAttribute('data-theme');
  }
  function isDark() {
    const a = document.documentElement.getAttribute('data-theme');
    if (a) return a === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function syncThemeBtn() {
    const b = $('#theme-btn');
    if (!b) return;
    const dark = isDark();
    b.innerHTML = D.ui(dark ? 'sun' : 'moon', 18);
    b.setAttribute('aria-label', dark ? 'Passer au thème clair' : 'Passer au thème sombre');
  }

  /* ---------- Événements ---------- */
  function onClick(e) {
    const b = e.target.closest('button, [data-scn]');
    if (!b) return;
    if (b.dataset.say) { speak(b.dataset.say); return; }
    const dlg0 = $('#scn-dialog');
    if (dlg0 && dlg0.open && (b.dataset.scn || b.dataset.act === 'shuffle')) dlg0.close();
    if (b.dataset.scn) { start(b.dataset.scn); return; }
    if (b.dataset.move) { chooseMove(+b.dataset.move); return; }
    if (b.dataset.starter) { chooseStarter(+b.dataset.starter); return; }
    const act = b.dataset.act;
    if (!act) return;
    if (act === 'moves') { st.phase = 'moves'; st.sel = null; renderDock('title'); }
    else if (act === 'rot') { st.rot++; renderDock('chip'); }
    else if (act === 'idea') {
      const p = $('#idea'); p.hidden = !p.hidden; b.setAttribute('aria-expanded', String(!p.hidden));
    } else if (act === 'restarter') {
      const t = st.turns.pop();
      if (t) { t.el.remove(); t.how.remove(); }
      st.phase = 'starters';
      renderDock('chip');
      reveal(DOCK(), 'nearest');
    } else if (act === 'bilan') endEarly();
    else if (act === 'replay') start(st.scn.id);
    else if (act === 'shuffle') {
      const others = SCENARIOS.filter(s => s.id !== st.scn.id);
      start(others[Math.floor(Math.random() * others.length)].id);
    } else if (act === 'pick') {
      const dlg = $('#scn-dialog');
      if (dlg && typeof dlg.showModal === 'function') { renderScnLists(); dlg.showModal(); const cur = $('[aria-current="true"]', dlg) || $('.sl-b', dlg); if (cur) cur.focus(); }
    } else if (act === 'close') { const dlg = $('#scn-dialog'); if (dlg) dlg.close(); }
    else if (act === 'theme') {
      const next = isDark() ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('p2-theme', next); } catch (err) { /* stockage indisponible */ }
      syncThemeBtn();
    }
  }
  function onSubmit(e) {
    if (!e.target.matches('[data-form]')) return;
    e.preventDefault();
    if (st.phase !== 'speak') return;
    finishTurn($('#words').value);
  }
  function onInput(e) {
    if (e.target.id !== 'words' || st.phase !== 'speak') return;
    const t = st.turns[st.turns.length - 1];
    t.words = e.target.value;
    refreshTurn(t);
    renderFil();
  }
  function onPreview(e) {
    const m = e.target.closest && e.target.closest('[data-move]');
    const tab = m ? +m.dataset.move : null;
    if (st.phase !== 'moves') return;
    if (tab !== st.preview) { st.preview = tab; renderRef(); }
  }

  /* ---------- Démarrage ---------- */
  function init() {
    try { const t = localStorage.getItem('p2-theme'); if (t) applyTheme(t); } catch (e) { /* stockage indisponible */ }
    syncThemeBtn();
    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      if (mq.addEventListener) mq.addEventListener('change', syncThemeBtn);
    }
    $('#icon-pick').innerHTML = D.ui('list', 18);
    $('#icon-shuffle').innerHTML = D.ui('shuffle', 18);
    $('#icon-close').innerHTML = D.ui('close', 18);
    $('#icon-shuffle2').innerHTML = D.ui('shuffle', 18);
    $('#howto').innerHTML = [
      [12, 'Choisis un geste', 'expliquer, réagir, nuancer…'],
      [4, 'Prends un début de phrase', '« Parce que … »'],
      [null, 'Dis la suite à voix haute', 'puis regarde le schéma']
    ].map(([tab, a, b], i) => `<li${tab ? ` style="${fnStyle(tab)}"` : ''}><span class="tile">${tab ? D.icon(tab, 18) : D.ui('wave', 18)}</span><span><b>${i + 1}. ${a}</b><span>${b}</span></span></li>`).join('');
    document.addEventListener('click', onClick);
    document.addEventListener('submit', onSubmit);
    document.addEventListener('input', onInput);
    document.addEventListener('mouseover', onPreview);
    document.addEventListener('focusin', onPreview);
    const dlg = $('#scn-dialog');
    if (dlg) dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
    window.addEventListener('resize', () => { refTab = null; renderRef(); });
    const id = decodeURIComponent(location.hash.replace(/^#/, ''));
    start(SCN[id] ? id : 'quebec');
  }
  init();
})();
