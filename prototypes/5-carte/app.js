/* Prototype 5 · Carte des liens — la conversation comme un plan de transport.
   4 lignes = 4 modules, 12 stations = 12 intentions (SITE.meta.essentiels),
   correspondances = enchaînements (SITE.meta.chains, SITE.models) + expressions partagées (CADRES.BY_KEY) + fiches. */
(function () {
  'use strict';

  const C = window.CADRES, S = window.SITE, M = S.meta, K = window.CARTE, VIZ = window.VIZ;
  const esc = C.esc, norm = C.norm;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const TABS = C.TAB_IDS;
  const reduce = () => C.reduceMotion();
  const store = {
    get(k, d) { try { const v = localStorage.getItem('carte5:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('carte5:' + k, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } }
  };

  /* ---------- Stations, lignes, moments ---------- */
  const ESS = {}; M.essentiels.forEach(e => { ESS[e.tab] = e; });
  const LINE_OF = {}; M.modules.forEach(m => m.tabs.forEach(t => { LINE_OF[t] = m.id; }));
  const MODS = {}; M.modules.forEach(m => { MODS[m.id] = m; });
  const MOMENT_OF = {}; M.moments.forEach(m => m.tabs.forEach(t => { MOMENT_OF[t] = m; }));
  const MOMENTS = K.momentOrder.map(id => M.moments.find(m => m.id === id));
  const je = t => ESS[t].je;
  const DEMO = {}; M.demo.rows.forEach(r => { if (!DEMO[r.tab]) DEMO[r.tab] = r; });

  /* ---------- Petits outils de texte ---------- */
  const stripReg = s => String(s).replace(/\s*\[[^\]]*\]/g, '').trim();
  const regOf = s => { const m = String(s).match(/\[([^\]]+)\]/); return m ? m[1] : null; };
  const mdBold = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  const braces = s => esc(s).replace(/\{(.+?)\}/g, '<b>$1</b>');
  const boldParts = s => Array.from(String(s).matchAll(/\*\*(.+?)\*\*/g)).map(m => m[1].trim());
  const dots = f => { f = String(f).trim(); return /[…?!.]$/.test(f) ? f : f + '…'; };
  const plain = s => String(s).replace(/\*\*|[{}]/g, '');
  const isL = ch => !!ch && /\p{L}/u.test(ch);

  /* Met en gras la formule dans l'exemple (formule « a… b » cherchée dans l'ordre, variantes « x / y »). */
  function hl(text, formula) {
    const T = String(text), low = T.toLowerCase().replace(/’/g, "'");
    const alts = String(formula).split(/\s\/\s/);
    for (const alt of alts) {
      const parts = alt.split('…').map(p => p.replace(/[.;]+$/, '').trim()).filter(p => p.length > 1 || /^[a-zà-ÿ]$/i.test(p));
      const hits = []; let from = 0;
      for (const p0 of parts) {
        let words = p0.split(' '), hit = null;
        while (words.length && !hit) {
          const p1 = words.join(' ').toLowerCase().replace(/’/g, "'");
          const cands = C.uniq([p1, p1.replace(/\b(qu|j|c|d|l|n|m|t|s)e$/, "$1'"), p1.replace(/\bsi$/, "s'")]);
          for (const p of cands) {
            let i = low.indexOf(p, from);
            while (i >= 0) {
              const okL = i === 0 || !isL(low[i - 1]);
              const okR = /'$/.test(p) || !isL(low[i + p.length]);
              if (okL && okR) { hit = [i, i + p.length]; break; }
              i = low.indexOf(p, i + 1);
            }
            if (hit) break;
          }
          if (!hit && words.length > 1 && words[words.length - 1].length > 0) words = words.slice(0, -1); else break;
        }
        if (hit) { hits.push(hit); from = hit[1]; }
      }
      if (hits.length) {
        let out = '', pos = 0;
        hits.forEach(([a, b]) => { out += esc(T.slice(pos, a)) + '<b>' + esc(T.slice(a, b)) + '</b>'; pos = b; });
        return out + esc(T.slice(pos));
      }
    }
    return esc(T);
  }

  function regChips(r) {
    if (!r) return '';
    return r.split(/\s*,\s*/).filter(c => C.REG[c]).map(c =>
      `<abbr class="rg rg-${c.toLowerCase().replace(/[^a-z]/g, '')}" title="${esc(C.REG[c].label + ' : ' + C.REG[c].def)}">${esc(c)}</abbr>`).join('');
  }
  function consChip(c) {
    if (!c) return '';
    const k = C.consKind(String(c).replace(/^\+\s*/, ''));
    return `<span class="cs k-${k}">${esc(c)}</span>`;
  }
  const consFor = (tab, f) => { const n = norm(stripReg(f)); const k = ESS[tab].cles.find(x => norm(x.e).replace(/\.\.\.$/, '').startsWith(n)); return k ? k.c : null; };

  /* ---------- Correspondances (liens entre stations) ---------- */
  const LINKS = new Map();
  const keyOf = (a, b) => Math.min(a, b) + '-' + Math.max(a, b);
  const lk = (a, b) => {
    const key = keyOf(a, b);
    if (!LINKS.has(key)) LINKS.set(key, { a: Math.min(a, b), b: Math.max(a, b), key, seq: [], shared: [] });
    return LINKS.get(key);
  };
  const getLink = (a, b) => LINKS.get(keyOf(a, b)) || null;
  const addSeq = (src, list) => list.forEach((x, idx) => x.steps.forEach((s, i) => {
    const p = x.steps[i - 1];
    if (i && p[1] !== s[1]) lk(p[1], s[1]).seq.push({ src, idx, from: p, to: s, fi: i - 1, ti: i });
  }));
  addSeq('chain', M.chains);
  addSeq('model', S.models);
  const cleanHead = h => String(h).replace(/\s*…\s*$/, '').trim();
  const lowerHead = h => { h = cleanHead(h); return h.charAt(0).toLowerCase() + h.slice(1); };
  for (const [key, all] of C.BY_KEY) {
    const list = all.filter(i => i.filterable);
    const tabs = C.uniq(list.map(i => i.tab)).sort((a, b) => a - b);
    for (let i = 0; i < tabs.length; i++) for (let j = i + 1; j < tabs.length; j++) {
      lk(tabs[i], tabs[j]).shared.push({ key, head: lowerHead(list.find(it => it.tab === tabs[i]).head) });
    }
  }
  S.fiches.forEach(f => {
    const ts = C.uniq(f.fonctions.map(x => x.tab));
    for (let i = 0; i < ts.length; i++) for (let j = i + 1; j < ts.length; j++) {
      const l = lk(ts[i], ts[j]), k = norm(f.key);
      let sh = l.shared.find(s => s.key === k || norm(s.head).startsWith(k));
      if (!sh) { sh = { key: k, head: f.expression }; l.shared.push(sh); }
      sh.fiche = f;
    }
  });
  LINKS.forEach(l => {
    l.nSeq = C.uniq(l.seq.map(s => s.src + s.idx)).length;
    l.score = 2 * l.nSeq + l.shared.length;
    l.shared.sort((x, y) => (y.fiche ? 1 : 0) - (x.fiche ? 1 : 0));
  });
  const ALL_LINKS = Array.from(LINKS.values()).sort((x, y) => y.score - x.score);
  const MAXS = Math.max(...ALL_LINKS.map(l => l.score));
  const ADJ = new Set();
  Object.values(K.order).forEach(o => o.forEach((t, i) => { if (i) ADJ.add(keyOf(t, o[i - 1])); }));
  const isMajor = l => l.score >= 4 && !ADJ.has(l.key);
  const linksOf = t => ALL_LINKS.filter(l => l.a === t || l.b === t);

  /* Formule de chaque côté d'un enchaînement : celle du modèle si possible, sinon une formule de l'onglet. */
  const HINT = { Exemple: 'par exemple', 'Précision': "c'est-à-dire", Conclusion: 'bref', Reformulation: 'autrement dit', Justification: 'parce que',
    Opinion: 'je trouve que', Concession: 'même si', 'Réserve': 'par contre', 'Hypothèse': 'si', 'Conséquence possible': 'alors',
    'Conséquence': 'donc', Cause: 'parce que', Temps: 'quand', But: 'pour', Condition: 'si', Moyen: 'grâce à', Description: 'qui' };
  function tabFormula(tab, label) {
    const h = HINT[label];
    if (h && (C.findItem(h, tab) || ESS[tab].cles.some(k => norm(k.e).startsWith(norm(h))))) return h;
    if (DEMO[tab]) return stripReg(DEMO[tab].construction);
    return cleanHead(ESS[tab].cles[0].e);
  }
  function stepFormula(s, side) {
    const step = side === 'from' ? s.from : s.to, si = side === 'from' ? s.fi : s.ti;
    if (s.src === 'model') {
      const seg = S.models[s.idx].segments.find(g => g[0] === si && /\*\*/.test(g[1]));
      if (seg) return boldParts(seg[1]).join('… ');
    }
    return tabFormula(step[1], step[0]);
  }
  const stepLabel = t => {
    if (DEMO[t]) return DEMO[t].intention;
    for (const x of S.models.concat(M.chains)) { const s = x.steps.find(st => st[1] === t); if (s) return s[0]; }
    return je(t);
  };

  /* ---------- Itinéraires ---------- */
  const EDGES = {}; TABS.forEach(t => { EDGES[t] = []; });
  LINKS.forEach(l => { EDGES[l.a].push([l.b, l.score]); EDGES[l.b].push([l.a, l.score]); });
  ADJ.forEach(k => { if (!LINKS.has(k)) { const [a, b] = k.split('-').map(Number); EDGES[a].push([b, 2]); EDGES[b].push([a, 2]); } });
  function shortest(a, b) {
    const dist = {}, prev = {}, done = new Set();
    TABS.forEach(t => { dist[t] = Infinity; }); dist[a] = 0;
    while (done.size < TABS.length) {
      let u = null; TABS.forEach(t => { if (!done.has(t) && (u === null || dist[t] < dist[u])) u = t; });
      if (u === null || dist[u] === Infinity) break;
      done.add(u);
      if (u === b) break;
      EDGES[u].forEach(([v, sc]) => { const d = dist[u] + 1 + 4 / Math.max(sc, 1); if (d < dist[v]) { dist[v] = d; prev[v] = u; } });
    }
    const path = [b]; while (path[0] !== a && prev[path[0]] != null) path.unshift(prev[path[0]]);
    return path[0] === a ? path : [a, b];
  }

  const THEME_DEFAULT = K.themes.logement;
  function pool(tab, theme) {
    const out = [], e = ESS[tab];
    M.demo.rows.filter(r => r.tab === tab).forEach(r => out.push({
      html: braces(r.phrase), text: plain(r.phrase), f: stripReg(r.construction), reg: regOf(r.construction), c: consFor(tab, r.construction), w: theme === THEME_DEFAULT ? 2.5 : 0.8 }));
    e.cles.forEach((k, i) => out.push({ html: hl(k.ex, k.e), text: k.ex, f: cleanHead(k.e), c: k.c, reg: k.r, w: 1 - i * 0.05 }));
    e.qc.forEach((k, i) => out.push({ html: hl(k.ex, k.e), text: k.ex, f: cleanHead(k.e), c: k.c, reg: k.r || 'QC', w: 0.7 - i * 0.05 }));
    if (theme) out.forEach(o => { if (theme.test(o.text)) o.w += 2; });
    return out.sort((x, y) => y.w - x.w);
  }
  function stopsFromTabs(tabs, labels, theme) {
    const used = new Set();
    return tabs.map((t, i) => {
      const label = labels ? labels[i] : stepLabel(t);
      const p = pool(t, theme);
      const h = labels ? HINT[label] : null;
      let s = (h && p.find(x => !used.has(x.text) && norm(x.f).startsWith(norm(h)))) || p.find(x => !used.has(x.text)) || p[0];
      used.add(s.text);
      return Object.assign({ tab: t, label }, s);
    });
  }
  function modelRoute(mi) {
    const m = S.models[mi];
    const stops = m.steps.map(([label, tab], i) => {
      const raw = m.segments.filter(s => s[0] === i).map(s => s[1].replace(/\n/g, ' ').trim()).join(' … ');
      const f = boldParts(raw);
      return { tab, label, html: mdBold(raw), text: plain(raw), f: f.join('… '), c: f[0] ? consFor(tab, f[0]) : null, reg: null };
    });
    return { kind: 'model', idx: mi, kicker: `Modèle ${m.n}`, title: m.title, stops, segments: m.segments, steps: m.steps, dialogue: !!m.dialogue };
  }
  function chainRoute(ci) {
    const ch = M.chains[ci];
    return { kind: 'chain', idx: ci, kicker: 'Enchaînement fréquent', title: ch.steps.map(s => s[0]).join(' → '),
      stops: stopsFromTabs(ch.steps.map(s => s[1]), ch.steps.map(s => s[0]), THEME_DEFAULT) };
  }
  function scenarioRoute(si) {
    const sc = M.scenarios[si];
    return { kind: 'scenario', idx: si, kicker: sc.type === 'nouvelle' ? 'On t’annonce une nouvelle' : 'On te pose une question', title: sc.dit,
      question: sc.dit, stops: stopsFromTabs(sc.fonctions, null, K.themes[sc.theme] || null) };
  }
  function ficheRoute(fi) {
    const f = S.fiches[fi];
    return { kind: 'fiche', idx: fi, kicker: 'Une expression, plusieurs stations', title: `« ${f.expression} »`,
      stops: f.fonctions.map(fn => ({ tab: fn.tab, label: fn.fonction, html: hl(fn.oral, f.expression), text: fn.oral, f: f.expression, c: fn.construction === 'seul' ? null : fn.construction, reg: null, sub: fn.sous })) };
  }
  function pairRoute(a, b) {
    const mi = S.models.findIndex(m => m.steps[0][1] === a && m.steps[m.steps.length - 1][1] === b);
    if (mi >= 0) return Object.assign(modelRoute(mi), { kind: 'pair', via: 'model', a, b, kicker: `Trajet conseillé · modèle ${S.models[mi].n}` });
    const ci = M.chains.findIndex(ch => ch.steps[0][1] === a && ch.steps[ch.steps.length - 1][1] === b && a !== b);
    if (ci >= 0) return Object.assign(chainRoute(ci), { kind: 'pair', via: 'chain', a, b, kicker: 'Trajet conseillé · enchaînement fréquent' });
    const path = a === b ? [a] : shortest(a, b);
    return { kind: 'pair', a, b, kicker: 'Trajet le plus direct', title: `${je(a)} → ${je(b)}`, stops: stopsFromTabs(path, null, THEME_DEFAULT) };
  }
  const routeTabs = r => r.stops.map(s => s.tab).filter((t, i, a) => i === 0 || a[i - 1] !== t);

  /* ---------- Géométrie de la carte ---------- */
  let L = null, LNAME = null;
  const P = t => ({ x: L.st[t][0], y: L.st[t][1] });
  function expandLine(id) {
    return L.lines[id].map(p => typeof p === 'number' ? { x: L.st[p][0], y: L.st[p][1], st: p } : { x: p[0], y: p[1] });
  }
  function rounded(pts, r) {
    let d = `M${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i];
      if (i < pts.length - 1 && p.st == null) {
        const a = pts[i - 1], b = pts[i + 1];
        const la = Math.hypot(p.x - a.x, p.y - a.y), lb = Math.hypot(b.x - p.x, b.y - p.y);
        const rr = Math.min(r, la / 2, lb / 2);
        const p1 = { x: p.x - (p.x - a.x) / la * rr, y: p.y - (p.y - a.y) / la * rr };
        const p2 = { x: p.x + (b.x - p.x) / lb * rr, y: p.y + (b.y - p.y) / lb * rr };
        d += ` L${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q${p.x} ${p.y} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
      } else d += ` L${p.x} ${p.y}`;
    }
    return d;
  }
  function linkCurve(a, b) {
    const x = Math.min(a, b), y = Math.max(a, b), A = P(x), B = P(y);
    const dx = B.x - A.x, dy = B.y - A.y, len = Math.hypot(dx, dy) || 1;
    let bend = L.bends[x + '-' + y];
    if (bend == null) bend = 0.16;
    const cx = (A.x + B.x) / 2 + (-dy / len) * bend * len, cy = (A.y + B.y) / 2 + (dx / len) * bend * len;
    const [S0, E0] = a === x ? [A, B] : [B, A];
    return `M${S0.x} ${S0.y} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${E0.x} ${E0.y}`;
  }
  function segPath(a, b, used) {
    const la = LINE_OF[a];
    const pts = expandLine(la);
    const ia = pts.findIndex(p => p.st === a), ib = pts.findIndex(p => p.st === b);
    const lo = Math.min(ia, ib), hi = Math.max(ia, ib);
    const clash = used && ib >= 0 && (used[la] || []).some(([x, y]) => lo < y && hi > x);
    if (la === LINE_OF[b] && (!clash || ADJ.has(keyOf(a, b)) && !getLink(a, b))) {
      if (used) (used[la] = used[la] || []).push([lo, hi]);
      const sub = pts.slice(Math.min(ia, ib), Math.max(ia, ib) + 1);
      if (ia > ib) sub.reverse();
      return { d: rounded(sub, 26), line: la };
    }
    return { d: linkCurve(a, b), line: null };
  }

  /* Coupure équilibrée des étiquettes (« Dire de quoi / je parle ») */
  function wrap(text, max) {
    if (text.length <= max) return [text];
    const words = text.split(' ');
    for (let n = 2; n <= 4; n++) {
      let best = null, bestScore = Infinity;
      const rec = (start, k, acc) => {
        if (k === 1) {
          const line = words.slice(start).join(' ');
          if (line.length > max) return;
          const lines = acc.concat([line]), sc = Math.max(...lines.map(l => l.length));
          if (sc <= bestScore) { bestScore = sc; best = lines; }
          return;
        }
        for (let i = start + 1; i <= words.length - (k - 1); i++) {
          const line = words.slice(start, i).join(' ');
          if (line.length > max) break;
          rec(i, k - 1, acc.concat([line]));
        }
      };
      rec(0, n, []);
      if (best) return best;
    }
    return [text];
  }

  function labelSVG(t) {
    const [x, y, pos, wmax] = L.st[t];
    const lines = wrap(je(t), wmax || L.wrap), n = lines.length;
    const r = L.r, f = L.font, lh = L.lh, gap = 8;
    let anchor = 'middle', tx = x, ty;
    if (pos === 'e' || pos === 'w') { anchor = pos === 'e' ? 'start' : 'end'; tx = pos === 'e' ? x + r + gap : x - r - gap; ty = y - (n - 1) * lh / 2 + f * 0.36; }
    else if (pos === 'n') ty = y - r - gap - 2 - (n - 1) * lh;
    else ty = y + r + gap + f * 0.8;
    return `<text class="lbl" x="${tx}" y="${ty.toFixed(1)}" text-anchor="${anchor}" style="font-size:${f}px">${lines.map((l, i) => `<tspan x="${tx}" dy="${i ? lh : 0}">${esc(l)}</tspan>`).join('')}</text>`;
  }

  function mapSVG() {
    const { w, h } = L;
    let z = '';
    L.zones.forEach(([a, b], i) => {
      const m = MOMENTS[i];
      if (L.axis === 'x') {
        z += `<rect class="zn ${i % 2 ? 'zn-odd' : ''}" x="${a}" y="6" width="${b - a}" height="${h - 12}" rx="14"/>`;
        z += `<text class="zn-t" x="${(a + b) / 2}" y="26" text-anchor="middle">${esc(m.label)}</text>`;
      } else {
        z += `<rect class="zn ${i % 2 ? 'zn-odd' : ''}" x="4" y="${a}" width="${w - 8}" height="${b - a}" rx="12"/>`;
        z += `<text class="zn-t" transform="translate(16 ${(a + b) / 2}) rotate(-90)" text-anchor="middle">${esc(m.label)}</text>`;
      }
    });
    const k = L.axis === 'x' ? 0.62 : 0.5;
    const links = ALL_LINKS.slice().reverse().map(l => {
      const cls = ['lk', l.nSeq ? 'lk-seq' : 'lk-sh', isMajor(l) ? 'major' : 'minor', ADJ.has(l.key) ? 'adj' : ''].join(' ');
      const sw = (2 + Math.min(l.score, 9) * k).toFixed(1);
      const style = l.nSeq ? `stroke-width:${sw}` : `stroke-width:${sw};stroke-dasharray:0 ${(sw * 1.9).toFixed(1)}`;
      return `<path class="${cls}" data-k="${l.key}" d="${linkCurve(l.a, l.b)}" style="${style}"/>`;
    }).join('');
    let lines = '', cases = '';
    Object.keys(L.lines).forEach(id => {
      const d = rounded(expandLine(id), 30);
      cases += `<path class="ln-case" d="${d}" style="stroke-width:${L.lineW + 7}"/>`;
      lines += `<path class="ln ln-${id}" data-line="${id}" d="${d}" style="stroke-width:${L.lineW}"/>`;
    });
    const rds = Object.keys(L.roundel).map(id => {
      const [x, y] = L.roundel[id];
      return `<g class="rd ln-${id}" data-line="${id}"><circle cx="${x}" cy="${y}" r="${L.r + 1}"/><text x="${x}" y="${(y + L.r * 0.4).toFixed(1)}" text-anchor="middle" style="font-size:${L.r * 1.15}px">${id}</text></g>`;
    }).join('');
    const sts = TABS.map(t => {
      const { x, y } = P(t);
      return `<g class="st ln-${LINE_OF[t]}" data-st="${t}"><circle class="st-h" cx="${x}" cy="${y}" r="${L.r + 7}"/><circle class="st-c" cx="${x}" cy="${y}" r="${L.r}"/><text class="st-n" x="${x}" y="${(y + L.r * 0.36).toFixed(1)}" text-anchor="middle" style="font-size:${(L.r * 0.95).toFixed(1)}px">${t}</text>${labelSVG(t)}</g>`;
    }).join('');
    return `<svg class="map-svg" viewBox="0 0 ${w} ${h}" aria-hidden="true" focusable="false"><g class="zones">${z}</g><g class="links">${links}</g><g class="lines">${cases}${lines}</g><g class="route" id="route-g"></g><g class="rds">${rds}</g><g class="sts">${sts}</g></svg>`;
  }

  /* ---------- État ---------- */
  const state = { route: null, sel: null, mode: 'trajet', from: 9, to: 11, allLinks: false, routeKey: '' };
  const mapEl = () => $('#map');

  function renderMap() {
    const box = mapEl();
    const name = box.clientWidth < 620 ? 'tall' : 'wide';
    if (name === LNAME && box.querySelector('svg')) return;
    LNAME = name; L = K.layouts[name];
    box.style.aspectRatio = `${L.w} / ${L.h}`;
    box.dataset.layout = name;
    box.innerHTML = mapSVG() + `<div class="hits">${TABS.map(t => `<button type="button" class="hit" data-st="${t}" aria-controls="panel" aria-expanded="false" aria-label="Station ${t} : ${esc(je(t))}, ligne ${LINE_OF[t]}"></button>`).join('')}</div>`;
    placeHits();
    applyMapState(false);
  }
  function placeHits() {
    if (!L) return;
    const svg = $('#map svg');
    if (!svg) return;
    $$('.hit', mapEl()).forEach(b => {
      const g = svg.querySelector(`.st[data-st="${b.dataset.st}"]`);
      let bb; try { bb = g.getBBox(); } catch (e) { return; }
      const pad = 6;
      const x = bb.x - pad, y = bb.y - pad, w = bb.width + pad * 2, h = bb.height + pad * 2;
      Object.assign(b.style, { left: (x / L.w * 100) + '%', top: (y / L.h * 100) + '%', width: (w / L.w * 100) + '%', height: (h / L.h * 100) + '%' });
    });
  }

  function applyMapState(animate) {
    const box = mapEl(); if (!box || !L) return;
    const svg = box.querySelector('svg');
    box.classList.toggle('all-links', state.allLinks);
    $$('.on, .show, .sel, .stop, .start, .end', svg).forEach(n => n.classList.remove('on', 'show', 'sel', 'stop', 'start', 'end'));
    const rg = svg.querySelector('#route-g');
    rg.innerHTML = '';
    $$('.hit', box).forEach(b => b.setAttribute('aria-expanded', String(+b.dataset.st === state.sel)));
    if (state.sel != null) {
      box.classList.add('dim'); box.classList.add('selmode');
      const t = state.sel;
      svg.querySelector(`.st[data-st="${t}"]`).classList.add('on', 'sel');
      linksOf(t).forEach(l => {
        const o = l.a === t ? l.b : l.a;
        const p = svg.querySelector(`.lk[data-k="${l.key}"]`);
        if (p) p.classList.add('on', 'show');
        svg.querySelector(`.st[data-st="${o}"]`).classList.add('on');
      });
      svg.querySelector(`.ln-${LINE_OF[t]}[data-line]`).classList.add('on');
      return;
    }
    box.classList.remove('selmode');
    if (!state.route) { box.classList.remove('dim'); return; }
    box.classList.add('dim');
    const tabs = routeTabs(state.route);
    tabs.forEach((t, i) => {
      const g = svg.querySelector(`.st[data-st="${t}"]`);
      g.classList.add('on', 'stop');
      if (i === 0) g.classList.add('start');
      if (i === tabs.length - 1) g.classList.add('end');
    });
    let segs = '';
    const pieces = [], used = {};
    for (let i = 1; i < tabs.length; i++) {
      const sp = segPath(tabs[i - 1], tabs[i], used);
      pieces.push(sp);
      const lkEl = svg.querySelector(`.lk[data-k="${keyOf(tabs[i - 1], tabs[i])}"]`);
      if (lkEl && !sp.line) lkEl.classList.add('show');
    }
    pieces.forEach((sp, i) => {
      const w = sp.line ? L.lineW : (L.axis === 'x' ? 7 : 6);
      segs += `<path class="rt-case" d="${sp.d}" style="stroke-width:${w + 8}"/>`;
      segs += `<path class="rt ${sp.line ? 'rt-line ln-' + sp.line : 'rt-link'}" data-i="${i}" d="${sp.d}" style="stroke-width:${w}"/>`;
      segs += `<path class="rt-flow" d="${sp.d}"/>`;
    });
    rg.innerHTML = segs;
    if (animate && !reduce()) {
      $$('.rt, .rt-case', rg).forEach(p => {
        const len = p.getTotalLength();
        const i = +(p.dataset.i || p.nextElementSibling && p.nextElementSibling.dataset.i || 0);
        p.style.strokeDasharray = `${len} ${len}`;
        p.style.strokeDashoffset = len;
        p.getBoundingClientRect();
        p.style.transition = `stroke-dashoffset .55s cubic-bezier(.4,0,.2,1) ${i * 0.42}s`;
        p.style.strokeDashoffset = 0;
        p.addEventListener('transitionend', () => { p.style.strokeDasharray = ''; p.style.transition = ''; }, { once: true });
      });
      $$('.rt-flow', rg).forEach(p => { p.style.opacity = 0; setTimeout(() => { p.style.opacity = ''; }, pieces.length * 420 + 300); });
    }
  }

  /* ---------- Rendu d'un itinéraire ---------- */
  function lineBadge(id, small) { return `<span class="lb ln-${id}${small ? ' sm' : ''}" aria-hidden="true">${id}</span>`; }
  function stDot(t, cls) { return `<span class="sd ln-${LINE_OF[t]} ${cls || ''}" aria-hidden="true">${t}</span>`; }
  function miniStrip(tabs) {
    return `<span class="ms" aria-hidden="true">${tabs.map((t, i) => (i ? `<i class="ms-j ${LINE_OF[t] === LINE_OF[tabs[i - 1]] ? 'ln-' + LINE_OF[t] : 'x'}"></i>` : '') + stDot(t, 'xs')).join('')}</span>`;
  }
  function transfer(a, b) {
    if (a === b) return { cls: 'same', txt: 'On reste à cette station' };
    const l = getLink(a, b), parts = [];
    if (l && l.nSeq) parts.push('enchaînement fréquent');
    if (l && l.shared.length) parts.push(`en commun : ${l.shared.slice(0, 2).map(s => '« ' + esc(s.head) + ' »').join(', ')}`);
    const same = LINE_OF[a] === LINE_OF[b];
    return { cls: same ? 'line' : 'x', txt: (same ? `Même ligne ${LINE_OF[a]}` : `Correspondance · ligne ${LINE_OF[b]}`) + (parts.length ? ' · ' + parts.join(' · ') : '') };
  }

  const canSpeak = 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';
  function speak(text) {
    if (!canSpeak) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text).replace(/—/g, '').replace(/\s+/g, ' '));
      u.lang = 'fr-CA'; u.rate = 0.92;
      const vs = speechSynthesis.getVoices();
      const v = vs.find(x => /fr[-_]CA/i.test(x.lang)) || vs.find(x => /^fr/i.test(x.lang));
      if (v) u.voice = v;
      speechSynthesis.speak(u);
    } catch (e) { /* synthèse vocale indisponible */ }
  }
  const SPK = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  const speakBtn = (text, label) => canSpeak ? `<button type="button" class="spk" data-say="${esc(text)}" aria-label="${esc(label || 'Écouter')}">${SPK}</button>` : '';

  function discourseHTML(r) {
    if (r.kind === 'model' || ((r.kind === 'pair') && r.via === 'model')) {
      if (r.dialogue) {
        const lines = [[]];
        r.segments.forEach(([i, t]) => {
          const parts = t.split('\n');
          parts.forEach((p, k) => { if (k) lines.push([]); if (p.trim()) lines[lines.length - 1].push([i, p]); });
        });
        return `<div class="dlg">${lines.filter(l => l.length).map((l, n) => `<p class="dl ${n % 2 ? 'me' : 'other'}"><span class="who">${n % 2 ? 'Toi' : 'L’autre'}</span>${l.map(([i, p]) => `<span class="dc ${i == null ? '' : 'ln-' + LINE_OF[r.steps[i][1]]}">${mdBold(p.trim())}</span>`).join(' ')}</p>`).join('')}</div>`;
      }
      return `<p class="disc">${r.segments.map(([i, t]) => `<span class="dc ${i == null ? '' : 'ln-' + LINE_OF[r.steps[i][1]]}">${mdBold(t)}</span>`).join('')}</p>`;
    }
    const q = r.question ? `<p class="dl other"><span class="who">L’autre</span>${esc(r.question)}</p>` : '';
    const body = r.stops.map(s => `<span class="dc ln-${LINE_OF[s.tab]}">${s.html}</span>`).join(' ');
    return r.question ? `<div class="dlg">${q}<p class="dl me"><span class="who">Toi</span>${body}</p></div>` : `<p class="disc">${body}</p>`;
  }
  const discourseText = r => {
    if (r.segments) return r.segments.map(s => plain(s[1])).join(' ');
    return (r.question ? r.question + ' ' : '') + r.stops.map(s => s.text).join(' ');
  };

  function fluxSpec(r) {
    const X = { commencer: 0, raconter: 30, expliquer: 52, reagir: 74, conclure: 100 };
    const mx = t => X[MOMENT_OF[t].id];
    return {
      id: 'flux', title: 'Le trajet dans la conversation',
      intro: 'Chaque arrêt se place à un moment de l’échange : tu vois d’où tu pars et où tu arrives.',
      axis: { labels: MOMENTS.map(m => [X[m.id], m.label.toLowerCase()]) },
      legend: [['cadre', 'la formule de l’arrêt'], ['muted', 'le passage d’un arrêt à l’autre']],
      rows: r.stops.map((s, i) => {
        const marks = [];
        if (i) { const a = mx(r.stops[i - 1].tab), b = mx(s.tab); if (a !== b) marks.push({ k: 'arrow', x1: a, x2: b, c: 'muted', dashed: true }); else marks.push({ k: 'line', x1: a - 4, x2: a + 4, c: 'muted', dashed: true }); }
        marks.push({ k: 'point', x: mx(s.tab), c: 'cadre', fill: 'solid' });
        return { label: dots(s.f || je(s.tab)), sub: `${s.label} · station ${s.tab}`, marks };
      })
    };
  }

  function renderItin() {
    const r = state.route, out = $('#itin-out');
    if (!r) {
      $('#status').textContent = 'Aucun trajet sur la carte.';
      out.innerHTML = `<div class="empty"><p><b>Pas de trajet pour l’instant.</b></p><p>Choisis un départ et une arrivée, un modèle ou une question. Tu peux aussi toucher une station pour voir ses correspondances.</p></div>`;
      return;
    }
    const tabs = routeTabs(r);
    const lines = C.uniq(tabs.map(t => LINE_OF[t]));
    let xf = 0; for (let i = 1; i < tabs.length; i++) if (LINE_OF[tabs[i]] !== LINE_OF[tabs[i - 1]]) xf++;
    const meta = `${r.stops.length} arrêt${r.stops.length > 1 ? 's' : ''} · ${lines.length} ligne${lines.length > 1 ? 's' : ''} · ${xf} correspondance${xf > 1 ? 's' : ''}`;
    const stops = r.stops.map((s, i) => {
      const next = r.stops[i + 1];
      const tr = next ? transfer(s.tab, next.tab) : null;
      const segCls = tr ? (tr.cls === 'x' ? 'seg-x' : '') : 'last';
      return `<li class="stop ln-${LINE_OF[s.tab]} ${segCls}">
        ${stDot(s.tab, 'big' + (i === 0 ? ' first' : '') + (!next ? ' lastd' : ''))}
        <div class="stop-b">
          <p class="stop-k"><span class="stop-l">${esc(s.label)}</span><button type="button" class="stop-st" data-open="${s.tab}">${esc(je(s.tab))}<span class="sr"> — ouvrir la station ${s.tab}</span></button></p>
          ${s.f ? `<p class="stop-f"><span class="say">Dis :</span> <b>${esc(dots(s.f))}</b> ${consChip(s.c)}${regChips(s.reg)}</p>` : ''}
          <p class="stop-x">${s.html}${s.sub ? ` <span class="stop-sub">(${esc(s.sub)})</span>` : ''} ${speakBtn(s.text, 'Écouter la phrase')}</p>
          ${tr ? `<p class="xfer xfer-${tr.cls}">${tr.txt}</p>` : ''}
        </div></li>`;
    }).join('');
    $('#status').textContent = `Trajet : ${r.title}. ${meta}.`;
    out.innerHTML = `
      <div class="it-head">
        <p class="kicker">${esc(r.kicker)}</p>
        <h3 class="it-title">${esc(r.title)}</h3>
        <p class="it-meta">${lines.map(id => lineBadge(id, true)).join('')}<span>${meta}</span></p>
      </div>
      ${r.question ? `<p class="it-q"><span>${esc(r.kicker)} :</span> « ${esc(r.question)} »<br><small>Voici un trajet possible pour répondre.</small></p>` : ''}
      <ol class="strip">${stops}</ol>
      <section class="disc-box" aria-label="Le discours complet">
        <div class="disc-h"><h4>${r.kind === 'fiche' ? 'Les exemples, bout à bout' : 'Ton petit discours'}</h4>${speakBtn(discourseText(r), 'Écouter le discours')}</div>
        ${discourseHTML(r)}
        ${r.kind === 'model' || r.via === 'model' ? '<p class="src">Texte du modèle de discours du site.</p>' : '<p class="src">Phrases tirées des exemples du site ; la formule de chaque arrêt est en gras.</p>'}
      </section>
      <div class="viz-box">${VIZ.render(fluxSpec(r), { examples: false })}</div>`;
  }

  function setRoute(r, opts) {
    opts = opts || {};
    state.route = r;
    const key = r ? r.kind + ':' + (r.idx != null ? r.idx : r.a + '-' + r.b) : '';
    const changed = key !== state.routeKey;
    state.routeKey = key;
    renderItin();
    syncControls();
    if (state.sel == null) applyMapState(changed && !opts.silent);
    if (opts.scroll) {
      const target = window.matchMedia('(min-width: 1000px)').matches ? $('#itin') : $('#map-card');
      target.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'start' });
    }
  }

  /* ---------- Panneau de station ---------- */
  function board(t) {
    const ls = linksOf(t);
    const items = ls.map((l, n) => {
      const o = l.a === t ? l.b : l.a;
      const seqs = l.seq.slice().sort((x, y) => (y.from[1] === t) - (x.from[1] === t));
      let say = '', why = [];
      if (seqs.length) {
        const s = seqs[0];
        say = `<span class="dep-say"><span class="dep-fl">${esc(s.from[0])} → ${esc(s.to[0])} :</span> <b class="ln-${LINE_OF[s.from[1]]}">${esc(dots(stepFormula(s, 'from')))}</b> <b class="ln-${LINE_OF[s.to[1]]}">${esc(dots(stepFormula(s, 'to')))}</b></span>`;
        const mods = C.uniq(l.seq.filter(x => x.src === 'model').map(x => S.models[x.idx].title));
        const ch = l.seq.some(x => x.src === 'chain');
        if (mods.length) why.push(`modèle${mods.length > 1 ? 's' : ''} : ${mods.map(esc).join(', ')}`);
        if (ch) why.push('enchaînement fréquent');
      }
      if (l.shared.length) {
        const sh = l.shared[0];
        if (!seqs.length) {
          const fn = sh.fiche ? sh.fiche.fonctions : null;
          const ft = fn && fn.find(x => x.tab === t), fo = fn && fn.find(x => x.tab === o);
          say = `<span class="dep-say"><span class="dep-fl">Même expression :</span> <b>« ${esc(sh.head)} »</b>${ft && fo ? ` <span class="dep-fl">${esc(ft.fonction.toLowerCase())} ↔ ${esc(fo.fonction.toLowerCase())}</span>` : ''}</span>`;
        }
        why.push(`${l.shared.length} expression${l.shared.length > 1 ? 's' : ''} en commun : ${l.shared.slice(0, 3).map(s => '« ' + esc(s.head) + ' »').join(', ')}${l.shared.length > 3 ? '…' : ''}`);
      }
      const ws = (2 * l.nSeq) / MAXS * 100, wh = l.shared.length / MAXS * 100;
      return `<li${n >= 6 ? ' class="more" hidden' : ''}><div class="dep">
        <button type="button" class="dep-go" data-open="${o}" aria-label="Aller à la station ${o} : ${esc(je(o))}">${stDot(o)}</button>
        <div class="dep-main">
          <button type="button" class="dep-name" data-open="${o}">${esc(je(o))}</button>
          ${say}
          <span class="dep-why">${why.join(' · ')}</span>
        </div>
        <span class="dep-meter" role="img" aria-label="Force du lien : ${l.score}"><i class="m-seq ln-${LINE_OF[o]}" style="width:${ws.toFixed(1)}%"></i><i class="m-sh ln-${LINE_OF[o]}" style="width:${wh.toFixed(1)}%"></i></span>
        <button type="button" class="dep-trip" data-trip="${t}-${o}" aria-label="Tracer le trajet ${t} → ${o}">Trajet</button>
      </div></li>`;
    }).join('');
    return `<ol class="board">${items}</ol>${ls.length > 6 ? `<button type="button" class="btn-more" data-more>Voir les ${ls.length} correspondances</button>` : ''}
      <p class="board-key"><span><i class="m-seq"></i> enchaînements (modèles, enchaînements fréquents)</span><span><i class="m-sh"></i> expressions en commun</span></p>`;
  }

  function vizLink(tab) {
    return row => {
      const lab = plain(row.label || '').replace(/\[[^\]]*\]/g, '');
      const first = lab.split(/\s\/\s|\s\+\s|…|\(/)[0].trim();
      const it = first ? C.findItem(first, tab) : null;
      return it ? C.siteLink(C.itemHref(it)) : null;
    };
  }

  function panelHTML(t) {
    const e = ESS[t], line = LINE_OF[t], mod = MODS[line], tab = S.tabs[t];
    const mom = MOMENT_OF[t];
    const viz = VIZ.forTab(t).map(v => VIZ.render(v, { examples: true, link: vizLink(t) })).join('');
    return `
      <header class="pn-sign ln-${line}">
        <div class="pn-bar">${lineBadge(line)}<span>Ligne ${line} · ${esc(mod.title)}</span>
          <button type="button" class="pn-x" data-close aria-label="Fermer la station"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></button>
        </div>
        <div class="pn-title">${stDot(t, 'huge')}<div><h2 id="pn-title" tabindex="-1">${esc(e.je)}</h2><p>Onglet ${t} · ${esc(tab.title)}</p></div></div>
      </header>
      <div class="pn-body">
        <p class="pn-quand">${esc(e.quand)}</p>
        <div class="moments" role="img" aria-label="Moment de la conversation : ${esc(mom.label)}">${MOMENTS.map(m => `<span class="${m.id === mom.id ? 'cur' : ''}">${esc(m.label)}</span>`).join('')}</div>
        <div class="pn-acts">
          <button type="button" class="btn" data-from="${t}"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="7" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M11 12h9" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>Partir d’ici</button>
          <button type="button" class="btn" data-to="${t}"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 12h9" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><circle cx="17" cy="12" r="4" fill="currentColor"/></svg>Arriver ici</button>
        </div>
        <section class="pn-sec"><h3>Ce que tu peux dire</h3>
          <ul class="fl">${e.cles.map(k => `<li><p class="fl-e"><b>${esc(k.e)}</b> ${consChip(k.c)}${regChips(k.r)}</p><p class="fl-x">${hl(k.ex, k.e)} ${speakBtn(k.ex, 'Écouter l’exemple')}</p></li>`).join('')}</ul>
        </section>
        <section class="pn-sec pn-qc"><h3><span class="qc-flag">QC</span> Au Québec, on entend aussi</h3>
          <ul class="fl">${e.qc.map(k => `<li><p class="fl-e"><b>${esc(k.e)}</b> ${consChip(k.c)}${regChips(k.r)}</p><p class="fl-x">${hl(k.ex, k.e)} ${speakBtn(k.ex, 'Écouter l’exemple')}</p></li>`).join('')}</ul>
        </section>
        <div class="pn-duo">
          <section class="card warn"><h3>Attention</h3><p>${VIZ.md(e.attention)}</p></section>
          <section class="card relance"><h3>Pour relancer l’autre</h3><p>« ${esc(e.relance)} »</p></section>
        </div>
        <section class="pn-sec"><h3>Correspondances</h3><p class="pn-help">Les intentions qu’on enchaîne avec celle-ci, de la plus fréquente à la plus rare. La barre montre la force du lien.</p>${board(t)}</section>
        ${viz ? `<section class="pn-sec pn-viz"><h3>Schémas</h3><p class="pn-help">Orange = l’action introduite par l’expression ; violet = la phrase principale.</p>${viz}</section>` : ''}
        <p class="pn-site"><a href="${esc(C.siteLink('#onglet-' + t))}">Voir l’onglet ${t} complet sur le site →</a></p>
      </div>`;
  }

  /* Téléphone : la feuille couvre le bas de l'écran ; on remonte la station dans la partie visible. */
  function revealOnMap(btn) {
    if (window.matchMedia('(min-width: 1000px)').matches) return;
    const r = btn.getBoundingClientRect(), top = Math.max(0, $('.topbar').getBoundingClientRect().bottom);
    const free = window.innerHeight * 0.34;
    const target = top + Math.max(40, (free - top) / 2);
    const dy = (r.top + Math.min(r.height, 60) / 2) - target;
    if (Math.abs(dy) > 8) window.scrollBy({ top: dy, behavior: reduce() ? 'auto' : 'smooth' });
  }

  let lastFocus = null;
  function openStation(t) {
    const pn = $('#panel');
    if (state.sel == null) lastFocus = document.activeElement;
    state.sel = t;
    $('#pn-scroll').innerHTML = panelHTML(t);
    $('#pn-scroll').scrollTop = 0;
    pn.className = 'panel ln-' + LINE_OF[t];
    pn.hidden = false;
    document.body.classList.add('panel-open');
    requestAnimationFrame(() => { pn.classList.add('open'); $('#pn-title').focus({ preventScroll: true }); });
    applyMapState(false);
  }
  function closePanel() {
    const pn = $('#panel');
    if (state.sel == null) return;
    const t = state.sel;
    state.sel = null;
    pn.classList.remove('open');
    document.body.classList.remove('panel-open');
    const done = () => { if (state.sel == null) pn.hidden = true; };
    if (reduce()) done(); else setTimeout(done, 260);
    applyMapState(false);
    const back = (lastFocus && document.contains(lastFocus) && lastFocus !== document.body) ? lastFocus : $(`.hit[data-st="${t}"]`);
    if (back) back.focus({ preventScroll: true });
  }

  /* ---------- Commandes de l'itinéraire ---------- */
  function syncControls() {
    const r = state.route;
    $('#from').value = String(state.from);
    $('#to').value = String(state.to);
    $$('[data-model],[data-chain],[data-scen],[data-fiche]').forEach(b => {
      const on = r && ((b.dataset.model != null && r.kind === 'model' && r.idx === +b.dataset.model) ||
        (b.dataset.chain != null && r.kind === 'chain' && r.idx === +b.dataset.chain) ||
        (b.dataset.scen != null && r.kind === 'scenario' && r.idx === +b.dataset.scen) ||
        (b.dataset.fiche != null && r.kind === 'fiche' && r.idx === +b.dataset.fiche));
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }
  function setMode(m, focus) {
    state.mode = m;
    $$('.mode').forEach(b => { const on = b.dataset.mode === m; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); });
    $$('.pane').forEach(p => { p.hidden = p.dataset.pane !== m; });
  }
  function fromPair(scroll) { setRoute(pairRoute(state.from, state.to), { scroll }); }

  function controlsHTML() {
    const opts = TABS.map(t => `<option value="${t}">${t} · ${esc(je(t))}</option>`).join('');
    const models = S.models.map((m, i) => `<button type="button" class="pick" data-model="${i}" aria-pressed="false"><span class="pick-k">Modèle ${m.n}</span><span class="pick-t">${esc(m.title)}</span>${miniStrip(C.uniq(m.steps.map(s => s[1])).length ? m.steps.map(s => s[1]).filter((t, k, a) => !k || a[k - 1] !== t) : [])}</button>`).join('');
    const chains = M.chains.map((c, i) => `<button type="button" class="pick sm" data-chain="${i}" aria-pressed="false"><span class="pick-t">${esc(c.steps.map(s => s[0]).join(' → '))}</span>${miniStrip(c.steps.map(s => s[1]).filter((t, k, a) => !k || a[k - 1] !== t))}</button>`).join('');
    const scen = M.scenarios.map((s, i) => `<button type="button" class="pick q" data-scen="${i}" aria-pressed="false"><span class="pick-k">${s.type === 'nouvelle' ? 'Nouvelle' : 'Question'} · ${esc(s.theme)}</span><span class="pick-t">« ${esc(s.dit)} »</span>${miniStrip(s.fonctions)}</button>`).join('');
    return `
      <div class="modes" role="tablist" aria-label="Choisir un itinéraire">
        <button type="button" role="tab" class="mode" id="tab-trajet" data-mode="trajet" aria-controls="pane-trajet">Départ → arrivée</button>
        <button type="button" role="tab" class="mode" id="tab-modeles" data-mode="modeles" aria-controls="pane-modeles">Modèles</button>
        <button type="button" role="tab" class="mode" id="tab-questions" data-mode="questions" aria-controls="pane-questions">Répondre</button>
      </div>
      <div class="pane" id="pane-trajet" data-pane="trajet" role="tabpanel" aria-labelledby="tab-trajet">
        <div class="od">
          <label class="od-f"><span class="od-l"><i class="od-i start" aria-hidden="true"></i>Départ</span><select id="from">${opts}</select></label>
          <button type="button" class="od-swap" id="swap" aria-label="Inverser le départ et l’arrivée"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M8 4v15M8 19l-4-4M8 19l4-4M16 20V5M16 5l-4 4M16 5l4 4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          <label class="od-f"><span class="od-l"><i class="od-i end" aria-hidden="true"></i>Arrivée</span><select id="to">${opts}</select></label>
        </div>
        <p class="hint">Astuce : touche une station sur la carte, puis « Partir d’ici » ou « Arriver ici ».</p>
      </div>
      <div class="pane" id="pane-modeles" data-pane="modeles" role="tabpanel" aria-labelledby="tab-modeles" hidden>
        <p class="pane-h">Six lignes express : des discours complets du site.</p>
        <div class="picks">${models}</div>
        <p class="pane-h">Enchaînements fréquents</p>
        <div class="picks">${chains}</div>
      </div>
      <div class="pane" id="pane-questions" data-pane="questions" role="tabpanel" aria-labelledby="tab-questions" hidden>
        <p class="pane-h">Quelqu’un te dit… Choisis la phrase : la carte te montre quelles stations utiliser pour répondre.</p>
        <div class="picks">${scen}</div>
      </div>`;
  }

  /* ---------- Sections : passerelles, tableau, lignes ---------- */
  function passerellesHTML() {
    return S.fiches.map((f, i) => {
      const tabs = f.fonctions.map(x => x.tab);
      const n = tabs.length, W = 300, H = 96;
      const xs = tabs.map((_, k) => n === 1 ? W / 2 : 40 + k * (W - 80) / (n - 1));
      const svg = `<svg class="pw-svg" viewBox="0 0 ${W} ${H}" aria-hidden="true">${xs.map((x, k) => `<path class="pw-l ln-${LINE_OF[tabs[k]]}" d="M${W / 2} 26 C${W / 2} 52 ${x} 46 ${x} 72"/>`).join('')}<rect class="pw-node" x="${W / 2 - 66}" y="8" width="132" height="30" rx="15"/><text class="pw-node-t" x="${W / 2}" y="28" text-anchor="middle">${esc(f.expression)}</text>${xs.map((x, k) => `<g class="pw-st ln-${LINE_OF[tabs[k]]}"><circle cx="${x}" cy="76" r="13"/><text x="${x}" y="80.5" text-anchor="middle">${tabs[k]}</text></g>`).join('')}</svg>`;
      return `<article class="pw">
        ${svg}
        <h3 class="pw-e">${esc(f.expression)}</h3>
        <ul class="pw-fn">${f.fonctions.map(fn => `<li>${stDot(fn.tab, 'xs')}<div><p><b>${esc(fn.fonction)}</b> · ${esc(je(fn.tab))}</p><p class="pw-x">${hl(fn.oral, f.expression)}</p></div></li>`).join('')}</ul>
        <button type="button" class="btn ghost" data-fiche="${i}" aria-pressed="false">Voir sur la carte</button>
      </article>`;
    }).join('');
  }

  function matrixHTML() {
    const head = `<div class="mx-c mx-h"></div>${TABS.map(t => `<div class="mx-c mx-h">${stDot(t, 'xs')}</div>`).join('')}`;
    const rows = TABS.map(a => `<div class="mx-c mx-h">${stDot(a, 'xs')}</div>${TABS.map(b => {
      if (a === b) return `<div class="mx-c mx-d ln-${LINE_OF[a]}" aria-hidden="true"></div>`;
      const l = getLink(a, b);
      const sc = l ? l.score : 0;
      const lvl = sc === 0 ? 0 : sc <= 1 ? 1 : sc <= 2 ? 2 : sc <= 4 ? 3 : sc <= 6 ? 4 : 5;
      const desc = l ? `${l.nSeq ? l.nSeq + ' enchaînement' + (l.nSeq > 1 ? 's' : '') : ''}${l.nSeq && l.shared.length ? ', ' : ''}${l.shared.length ? l.shared.length + ' expression' + (l.shared.length > 1 ? 's' : '') + ' en commun' : ''}` : 'aucun lien direct';
      return `<button type="button" class="mx-c mx-v v${lvl}" data-trip="${a}-${b}" title="${a} ↔ ${b} : ${esc(desc)}" aria-label="De ${esc(je(a))} à ${esc(je(b))} : ${esc(desc)}">${l && l.nSeq ? '<i></i>' : ''}</button>`;
    }).join('')}`).join('');
    return `<div class="mx-scroll"><div class="mx" role="group" aria-label="Tableau des correspondances">${head}${rows}</div></div>
      <div class="mx-key"><span>Lien plus fort →</span>${[1, 2, 3, 4, 5].map(v => `<i class="mx-sw v${v}"></i>`).join('')}<span class="mx-dotk"><i></i> enchaînement attesté</span></div>`;
  }

  function linesHTML() {
    return M.modules.map(m => `<div class="lp ln-${m.id}"><p class="lp-h">${lineBadge(m.id)}<span><b>Ligne ${m.id}</b>${esc(m.title)}</span></p>
      <ol class="lp-st">${K.order[m.id].map(t => `<li><button type="button" class="lp-b" data-open="${t}">${stDot(t, 'xs')}<span>${esc(je(t))}</span></button></li>`).join('')}</ol></div>`).join('');
  }

  function legendHTML() {
    return `
      <ul class="lg">
        ${M.modules.map(m => `<li>${lineBadge(m.id, true)}<span><b>Ligne ${m.id}</b> · ${esc(m.title)}</span></li>`).join('')}
      </ul>
      <ul class="lg lg-sym">
        <li><svg viewBox="0 0 40 24" width="40" height="24" aria-hidden="true"><line x1="0" y1="12" x2="40" y2="12" class="k-line"/><circle cx="20" cy="12" r="8.5" class="k-st"/><text x="20" y="15.5" text-anchor="middle" class="k-n">4</text></svg><span><b>Station</b> = une intention (n° de l’onglet)</span></li>
        <li><svg viewBox="0 0 40 24" width="40" height="24" aria-hidden="true"><path d="M2 18 Q20 2 38 18" class="k-seq"/></svg><span><b>Trait plein</b> = enchaînement fréquent (modèles du site)</span></li>
        <li><svg viewBox="0 0 40 24" width="40" height="24" aria-hidden="true"><path d="M2 18 Q20 2 38 18" class="k-sh"/></svg><span><b>Pointillé</b> = mêmes expressions dans les deux</span></li>
        <li><svg viewBox="0 0 40 24" width="40" height="24" aria-hidden="true"><path d="M2 8 H38" class="k-thin"/><path d="M2 18 H38" class="k-thick"/></svg><span><b>Plus épais</b> = lien plus fort</span></li>
        <li><svg viewBox="0 0 40 24" width="40" height="24" aria-hidden="true"><rect x="1" y="2" width="18" height="20" rx="4" class="k-z1"/><rect x="21" y="2" width="18" height="20" rx="4" class="k-z2"/></svg><span><b>Bandes</b> = moments de la conversation</span></li>
      </ul>`;
  }

  /* ---------- Thème ---------- */
  function initTheme() {
    const saved = store.get('theme', null);
    if (saved === 'light' || saved === 'dark') document.documentElement.setAttribute('data-theme', saved);
    $('#theme').addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      store.set('theme', next);
    });
  }

  /* ---------- Démarrage ---------- */
  function init() {
    initTheme();
    $('#itin-ctrl').innerHTML = controlsHTML();
    $('#legend').innerHTML = legendHTML();
    $('#lines').innerHTML = linesHTML();
    $('#passerelles').innerHTML = passerellesHTML();
    $('#matrix').innerHTML = matrixHTML();
    $('#n-links').textContent = String(ALL_LINKS.length);
    $('#n-links2').textContent = String(ALL_LINKS.length);
    renderMap();
    setMode('trajet');
    state.from = 9; state.to = 11;
    setRoute(pairRoute(9, 11), { silent: false });

    document.addEventListener('click', e => {
      const t = e.target.closest('button, a');
      if (!t) return;
      if (t.classList.contains('hit')) { const n = +t.dataset.st; if (state.sel === n) closePanel(); else { openStation(n); revealOnMap(t); } return; }
      if (t.dataset.say != null) { speak(t.dataset.say); return; }
      if (t.dataset.open != null) { openStation(+t.dataset.open); return; }
      if (t.hasAttribute('data-close')) { closePanel(); return; }
      if (t.hasAttribute('data-more')) { $$('#panel .board .more').forEach(li => { li.hidden = false; }); t.remove(); return; }
      if (t.dataset.from != null || t.dataset.to != null) {
        if (t.dataset.from != null) state.from = +t.dataset.from; else state.to = +t.dataset.to;
        closePanel(); setMode('trajet'); fromPair(true); return;
      }
      if (t.dataset.trip) {
        const [a, b] = t.dataset.trip.split('-').map(Number);
        state.from = a; state.to = b;
        closePanel(); setMode('trajet'); fromPair(true); return;
      }
      if (t.dataset.model != null) { setRoute(modelRoute(+t.dataset.model)); return; }
      if (t.dataset.chain != null) { setRoute(chainRoute(+t.dataset.chain)); return; }
      if (t.dataset.scen != null) { setRoute(scenarioRoute(+t.dataset.scen)); return; }
      if (t.dataset.fiche != null) { closePanel(); setRoute(ficheRoute(+t.dataset.fiche), { scroll: true }); return; }
      if (t.dataset.mode) { setMode(t.dataset.mode); return; }
      if (t.id === 'swap') { [state.from, state.to] = [state.to, state.from]; fromPair(false); return; }
      if (t.id === 'reset-map') { closePanel(); setRoute(null); return; }
    });
    $('#from').addEventListener('change', e => { state.from = +e.target.value; fromPair(false); });
    $('#to').addEventListener('change', e => { state.to = +e.target.value; fromPair(false); });
    $('#all-links').addEventListener('change', e => { state.allLinks = e.target.checked; applyMapState(false); });
    $('.modes').addEventListener('keydown', e => {
      const ms = $$('.mode'), i = ms.findIndex(b => b.dataset.mode === state.mode);
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); const j = (i + (e.key === 'ArrowRight' ? 1 : ms.length - 1)) % ms.length; setMode(ms[j].dataset.mode, true); }
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && state.sel != null) { e.preventDefault(); closePanel(); } });

    let rt = null;
    const onResize = () => { clearTimeout(rt); rt = setTimeout(() => { const before = LNAME; renderMap(); if (before === LNAME) placeHits(); }, 120); };
    window.addEventListener('resize', onResize);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { placeHits(); });
    if (canSpeak) { try { speechSynthesis.getVoices(); } catch (e) { /* rien */ } }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
