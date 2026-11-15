/* Coach 5 minutes — prototype 6.
   Une routine quotidienne : Écoute → Prépare → Parle → Bilan.
   Les formules évaluées voyagent dans 5 boîtes de Leitner (localStorage, clé « coach6: »). */
(function () {
  'use strict';

  const S = window.SITE, M = S.meta, C = window.CADRES, V = window.VIZ, D = window.COACH;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const nb = h => String(h).replace(/ ([;:?!»])/g, '\u00A0$1').replace(/« /g, '«\u00A0');
  const esc = s => nb(C.esc(s));
  const md = s => nb(V.md(s));
  const MAIN = $('#main');
  const LIVE = $('#live');

  /* ---------- Données dérivées ---------- */
  const ESS = {};
  M.essentiels.forEach(e => { ESS[e.tab] = e; });
  const TABS = M.essentiels.map(e => e.tab);
  const MOMENT = {};
  M.moments.forEach(m => m.tabs.forEach(t => { MOMENT[t] = m; }));
  const SCEN = M.scenarios;
  const SCEN_BY = {};
  SCEN.forEach(s => { SCEN_BY[s.id] = s; });
  const ALL_CARDS = [];
  TABS.forEach(t => ESS[t].cles.forEach((k, i) => ALL_CARDS.push(t + '.' + i)));
  const TOTAL = ALL_CARDS.length;
  const INTERVAL = D.intervals;
  const ETAPE = {};
  M.etapes.forEach(e => { ETAPE[e.n] = e; });
  const RHYTHM = ['', 'chaque jour', 'tous les 2 jours', 'tous les 4 jours', 'tous les 8 jours', 'tous les 16 jours'];

  /* ---------- Stockage (toujours protégé) ---------- */
  const KEY = 'coach6:';
  const store = {
    get(k, d) { try { const v = localStorage.getItem(KEY + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(KEY + k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  };
  const blank = () => ({ cards: {}, days: [], sessions: 0, log: [] });
  let state = (() => {
    const s = store.get('state', null);
    return s && typeof s === 'object' && s.cards && Array.isArray(s.days) ? Object.assign(blank(), s) : blank();
  })();
  let prefs = store.get('prefs', null) || {};
  const saveState = () => store.set('state', state);
  const savePrefs = () => store.set('prefs', prefs);

  /* ---------- Dates ---------- */
  const pad = n => String(n).padStart(2, '0');
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const fromIso = s => { const p = s.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2], 12); };
  const dayNum = d => Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);
  const TODAY = (() => { const d = new Date(); d.setHours(12, 0, 0, 0); return d; })();
  const T = iso(TODAY);
  const TOMORROW = iso(addDays(TODAY, 1));
  const daysUntil = s => dayNum(fromIso(s)) - dayNum(TODAY);
  const fmtLong = d => { try { return d.toLocaleDateString('fr-CA', { weekday: 'long', day: 'numeric', month: 'long' }); } catch (e) { return iso(d); } };
  const DAY_LETTER = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  const DAY_NAME = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const scenarioFor = d => SCEN[((dayNum(d) % SCEN.length) + SCEN.length) % SCEN.length];
  const whenText = s => {
    const n = daysUntil(s);
    return n <= 0 ? 'à revoir aujourd’hui' : n === 1 ? 'revient demain' : `revient dans ${n} jours`;
  };

  /* ---------- État d'exemple (affiché seulement si le stockage est vide) ---------- */
  function exampleState() {
    const st = blank();
    [6, 4, 3, 2, 1].forEach(n => st.days.push(iso(addDays(TODAY, -n))));
    ALL_CARDS.forEach(id => {
      const [t, i] = id.split('.').map(Number);
      const h = (t * 7 + i * 13 + 3) % 11;
      if (h > 6) return;
      const box = 1 + ((h + t + i) % 5);
      st.cards[id] = { box, due: iso(addDays(TODAY, (h + i) % (INTERVAL[box] + 1))), seen: 1 + ((h + i) % 4), last: iso(addDays(TODAY, -1 - (h % 3))) };
    });
    st.sessions = 9;
    return st;
  }
  const EXAMPLE = exampleState();
  const isEmpty = () => !Object.keys(state.cards).length && !state.days.length;
  const isExample = () => isEmpty() && !prefs.hideExample;
  const viewState = () => (isExample() ? EXAMPLE : state);

  /* ---------- Statistiques ---------- */
  function streakOf(st) {
    const set = new Set(st.days);
    let d = TODAY, n = 0;
    if (!set.has(iso(d))) d = addDays(d, -1);
    while (set.has(iso(d))) { n++; d = addDays(d, -1); }
    return n;
  }
  function boxCounts(st, ids) {
    const c = [0, 0, 0, 0, 0, 0];
    (ids || ALL_CARDS).forEach(id => { const x = st.cards[id]; c[x ? x.box : 0]++; });
    return c;
  }
  const dueIds = (st, until) => ALL_CARDS.filter(id => st.cards[id] && st.cards[id].due <= (until || T))
    .sort((a, b) => st.cards[a].due.localeCompare(st.cards[b].due) || st.cards[a].box - st.cards[b].box);
  const mastery = (st, tab) => {
    const ids = ESS[tab].cles.map((k, i) => tab + '.' + i);
    const sum = ids.reduce((a, id) => a + (st.cards[id] ? st.cards[id].box : 0), 0);
    return Math.round(sum / (5 * ids.length) * 100);
  };

  /* ---------- Formules ---------- */
  function card(id) {
    const [tab, i] = id.split('.').map(Number);
    const k = ESS[tab].cles[i];
    return { id, tab, i, e: k.e, c: k.c || '', ex: k.ex, r: k.r || '', map: (D.map[tab] || [])[i] || null };
  }
  function siteHref(ci) {
    if (!ci.map) return C.siteLink('#onglet-' + ci.tab);
    const k = C.norm(ci.map.k).replace(/[\s.;:,!?]+$/, '');
    let it = C.findItem(k, ci.tab);
    if (!it) it = C.ITEMS.find(x => x.tab === ci.tab && C.norm(x.plain).startsWith(k));
    return C.siteLink(it ? C.itemHref(it) : '#onglet-' + ci.tab);
  }
  function consPill(c) {
    if (!c) return '';
    const k = C.consKind(c.replace(/^\+\s*/, ''));
    return `<span class="cons k-${k}">${esc(c)}</span>`;
  }
  const fullName = ci => ci.e + (ci.c && ci.tab === 7 ? ' ' + ci.c : '');

  /* Surligner la formule dans son exemple (élisions : qu’, d’, s’…). */
  const APO = "['’]";
  const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function wordRe(w) {
    const lw = w.toLowerCase();
    if (lw === 'que') return `(?:que|qu${APO})`;
    if (lw === 'de') return `(?:de|du|des|d${APO})`;
    if (lw === 'si') return `(?:si|s${APO})`;
    if (lw === 'le' || lw === 'la') return `(?:${lw}|l${APO})`;
    return reEsc(w).replace(/['’]/g, APO);
  }
  function findPart(text, part, from) {
    let words = part.split(/\s+/).filter(Boolean);
    while (words.length) {
      let re;
      try { re = new RegExp(`(?<!\\p{L})${words.map(wordRe).join('\\s+')}(?:(?<=['’])|(?!\\p{L}))`, 'giu'); } catch (e) { return null; }
      re.lastIndex = from;
      const m = re.exec(text);
      if (m) return [m.index, m.index + m[0].length];
      words = words.slice(0, -1);
    }
    return null;
  }
  function highlight(text, formula) {
    const ranges = [];
    formula.split(/\s+\/\s+/).forEach(alt => {
      let from = 0;
      alt.split('…').map(p => p.replace(/[\s?!.,;:]+$/, '').trim()).filter(Boolean).forEach(part => {
        const r = findPart(text, part, from);
        if (r && !ranges.some(x => r[0] < x[1] && x[0] < r[1])) { ranges.push(r); from = r[1]; }
      });
    });
    ranges.sort((a, b) => a[0] - b[0]);
    let out = '', i = 0;
    ranges.forEach(([a, b]) => { out += esc(text.slice(i, a)) + `<mark>${esc(text.slice(a, b))}</mark>`; i = b; });
    return out + esc(text.slice(i));
  }

  /* ---------- Schémas (specs construites à la volée pour VIZ.render) ---------- */
  function rowSpec(id, idx, keepLabel) {
    const base = V.byId(id);
    if (!base || !base.rows[idx]) return null;
    const spec = Object.assign({}, base);
    delete spec.id; delete spec.title; delete spec.intro;
    const row = base.rows[idx];
    spec.rows = [base.type === 'map' || keepLabel ? row : Object.assign({}, row, { label: row.sub || row.label, sub: '' })];
    return spec;
  }
  function contrastSpec(tab) {
    const c = D.contrast[tab];
    if (!c) return null;
    if (c.mix) return { flow: c.flow, legend: c.legend, rows: c.mix.map(([id, i]) => V.byId(id).rows[i]) };
    const base = V.byId(c.spec);
    if (!base) return null;
    const spec = Object.assign({}, base);
    delete spec.id; delete spec.title; delete spec.intro;
    spec.rows = c.rows.map(i => base.rows[i]).filter(Boolean);
    return spec;
  }
  const viz = (spec, examples) => (spec ? V.render(spec, { examples: !!examples, title: false }) : '');
  const turnSpec = () => ({
    lanes: 2, legend: [['main', 'l’autre personne'], ['cadre', 'toi : 3 temps, puis une relance']],
    rows: [{ label: 'Le tour de parole', sub: 'environ une minute', marks: [
      { k: 'bar', x1: 0, x2: 24, lane: 0 },
      { k: 'bar', x1: 27, x2: 46, c: 'cadre', lane: 1 }, { k: 'text', x: 36.5, text: '1', c: 'cadre', lane: 1, dy: 2.6 },
      { k: 'bar', x1: 48, x2: 67, c: 'cadre', lane: 1 }, { k: 'text', x: 57.5, text: '2', c: 'cadre', lane: 1, dy: 2.6 },
      { k: 'bar', x1: 69, x2: 86, c: 'cadre', lane: 1 }, { k: 'text', x: 77.5, text: '3', c: 'cadre', lane: 1, dy: 2.6 },
      { k: 'tag', x: 93, text: '?', c: 'cadre', lane: 1 },
      { k: 'point', x: 99, lane: 0 }
    ] }]
  });
  const POS = { 1: 24, 2: 42, 4: 60, 8: 78, 16: 96 };
  function returnSpec(moves) {
    return {
      axis: { labels: [[2, ''], [24, 'demain'], [42, '2 j'], [60, '4 j'], [78, '8 j'], [96, '16 j']] },
      legend: [['main', 'pratiquée aujourd’hui'], ['cadre', 'prochain rendez-vous']],
      rows: moves.map(m => {
        const ci = card(m.id), d = INTERVAL[m.to];
        return { label: fullName(ci), sub: `boîte ${m.to} · ${d === 1 ? 'demain' : 'dans ' + d + ' jours'}`, marks: [
          { k: 'point', x: 2 }, { k: 'arrow', x1: 5, x2: POS[d] - 3.5, c: 'muted', dashed: true }, { k: 'point', x: POS[d], c: 'cadre' }
        ] };
      })
    };
  }

  /* ---------- Icônes (SVG en ligne) ---------- */
  const svg = (inner, size) => `<svg viewBox="0 0 24 24" width="${size || 20}" height="${size || 20}" aria-hidden="true" focusable="false">${inner}</svg>`;
  const P = (d, w) => `<path d="${d}" fill="none" stroke="currentColor" stroke-width="${w || 2}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const I = {
    right: svg(P('M5 12h13M13 6l6 6-6 6', 2.2), 18),
    left: svg(P('M19 12H6M11 6l-6 6 6 6', 2.2), 18),
    check: svg(P('M5 12.5l4.2 4.2L19 7', 2.8), 18),
    x: svg(P('M6 6l12 12M18 6L6 18', 2.2), 20),
    ecoute: svg(P('M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 3.5V16A2.5 2.5 0 0 1 4 13.5z'), 18),
    prepare: svg(P('M12 3.5l8.5 4.5-8.5 4.5L3.5 8z') + P('M3.5 12.5l8.5 4.5 8.5-4.5'), 18),
    parle: svg(P('M12 3.5a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0v-5a3 3 0 0 1 3-3z') + P('M6 11a6 6 0 0 0 12 0M12 17v3.5'), 18),
    bilan: svg(P('M5 20v-6M10 20V9M15 20v-4M20 20V5'), 18),
    speaker: svg(P('M4 9.5h3.5L12 5.5v13l-4.5-4H4z') + P('M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11'), 20),
    stop: svg('<rect x="6" y="6" width="12" height="12" rx="2.5" fill="currentColor"/>', 18),
    play: svg('<path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/>', 18),
    pause: svg('<rect x="6.5" y="5.5" width="4" height="13" rx="1.2" fill="currentColor"/><rect x="13.5" y="5.5" width="4" height="13" rx="1.2" fill="currentColor"/>', 18),
    reset: svg(P('M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4.5v4h4'), 18),
    ext: svg(P('M14 4.5h5.5V10M19.5 4.5L11 13M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10'), 15),
    person: svg('<circle cx="12" cy="8.6" r="3.7" fill="currentColor"/><path d="M4.8 20a7.2 7.2 0 0 1 14.4 0z" fill="currentColor"/>', 22),
    bulb: svg(P('M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z'), 20)
  };
  const STEP_ICON = [null, I.ecoute, I.prepare, I.parle, I.bilan];

  /* ---------- Petits composants ---------- */
  const who = sc => { const p = sc.qui.split(', '); return { name: p[0], where: p.slice(1).join(', ') }; };
  const verbOf = scen => (scen.type === 'question' ? 'te demande' : 't’annonce');
  const typeLabel = scen => (scen.type === 'question' ? 'Question' : 'Nouvelle');
  function chainHTML(fns, cls) {
    return `<ol class="chain ${cls || ''}">${fns.map((t, k) => `<li class="s${k + 1}"><span class="disc" aria-hidden="true">${k + 1}</span><span>${esc(ESS[t].je)}</span></li>`).join('')}</ol>`;
  }
  function weekStrip(st) {
    const set = new Set(st.days);
    let h = '';
    for (let n = 6; n >= 0; n--) {
      const d = addDays(TODAY, -n), on = set.has(iso(d));
      h += `<li class="${on ? 'on' : ''}${n === 0 ? ' today' : ''}"><span class="wk-d" aria-hidden="true">${DAY_LETTER[d.getDay()]}</span><span class="wk-dot" aria-hidden="true">${on ? I.check : ''}</span><span class="sr">${DAY_NAME[d.getDay()]} : ${on ? 'séance faite' : n === 0 ? 'pas encore' : 'pas de séance'}</span></li>`;
    }
    return `<ol class="week">${h}</ol>`;
  }
  function ringHTML(st, size) {
    const counts = boxCounts(st), r = 52, Cf = 2 * Math.PI * r;
    let off = 0, segs = '';
    for (let b = 1; b <= 5; b++) {
      const len = counts[b] / TOTAL * Cf;
      if (len > 0) {
        segs += `<circle class="rg-seg" cx="64" cy="64" r="${r}" style="stroke:var(--b${b})" stroke-dasharray="${Math.max(len - 2, 0.6).toFixed(2)} ${Cf.toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}"><title>Boîte ${b} : ${counts[b]}</title></circle>`;
        off += len;
      }
    }
    const seen = TOTAL - counts[0];
    return `<div class="ring" style="--size:${size || 128}px"><svg viewBox="0 0 128 128" role="img" aria-label="${seen} expressions pratiquées sur ${TOTAL}"><circle class="rg-track" cx="64" cy="64" r="${r}"/><g transform="rotate(-90 64 64)">${segs}</g></svg><div class="ring-c"><strong>${seen}</strong><span>sur ${TOTAL}</span></div></div>`;
  }
  function boxLegend(st) {
    const c = boxCounts(st);
    return `<ul class="bx-legend">${[1, 2, 3, 4, 5].map(b => `<li><i style="background:var(--b${b})"></i>Boîte ${b}<b>${c[b]}</b></li>`).join('')}<li><i class="bx-none"></i>pas encore<b>${c[0]}</b></li></ul>`;
  }
  function miniRing(pct) {
    const r = 9, Cf = 2 * Math.PI * r;
    return `<svg class="mini-ring" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><circle cx="12" cy="12" r="${r}" class="mr-t"/><circle cx="12" cy="12" r="${r}" class="mr-v" transform="rotate(-90 12 12)" stroke-dasharray="${(pct / 100 * Cf).toFixed(2)} ${Cf.toFixed(2)}"/></svg>`;
  }
  function boxBadge(id, st) {
    const c = st.cards[id];
    if (!c) return '<span class="bx bx-new">Nouvelle</span>';
    return `<span class="bx"><i style="background:var(--b${c.box})"></i>Boîte ${c.box}${c.due <= T ? ' · à revoir' : ''}</span>`;
  }
  function moveHTML(from, to) {
    const d = INTERVAL[to];
    return `<span class="mv" aria-hidden="true"><span class="mvb${from ? '' : ' mv-new'}" style="${from ? `--bc:var(--b${from})` : ''}">${from || '+'}</span>${I.right}<span class="mvb" style="--bc:var(--b${to})">${to}</span></span><span>${from ? `Boîte ${from} → boîte ${to}` : `Entre en boîte ${to}`} · ${d === 1 ? 'revient demain' : `revient dans ${d} jours`}</span>`;
  }
  function timebar() {
    const steps = D.steps, total = steps.reduce((a, s) => a + s.duree, 0);
    const dur = s => (s.duree < 60 ? s.duree + ' s' : s.duree % 60 ? `${Math.floor(s.duree / 60)} min ${s.duree % 60}` : s.duree / 60 + ' min');
    return `<div class="timebar"><p class="tb-k">Ta séance · ${Math.round(total / 60)} minutes</p>
      <div class="tb-track" role="img" aria-label="${steps.map(s => `${s.titre} ${dur(s)}`).join(', ')}">${steps.map(s => `<span style="--g:${s.duree}"></span>`).join('')}</div>
      <div class="tb-labels" aria-hidden="true">${steps.map(s => `<span style="--g:${s.duree}"><b>${s.titre}</b>${dur(s)}</span>`).join('')}</div></div>`;
  }

  /* « Le chemin de ta réponse » : les 3 fonctions placées sur les moments d'une conversation. */
  function momentPath(fns) {
    const ms = M.moments, W = 340, H = 140, base = 106, R = 15;
    const xs = ms.map((m, i) => 34 + i * (W - 68) / (ms.length - 1));
    const stIdx = t => ms.findIndex(m => m.tabs.includes(t));
    const pos = fns.map((t, k) => {
      const si = stIdx(t);
      const stack = fns.slice(0, k).filter(t2 => stIdx(t2) === si).length;
      return { x: xs[si], y: base - 36 - stack * 42, k };
    });
    let g = `<defs><marker id="mp-arr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M1 1L9 5L1 9z" class="mp-head"/></marker></defs>`;
    g += `<line class="mp-line" x1="${xs[0]}" x2="${xs[xs.length - 1]}" y1="${base}" y2="${base}"/>`;
    ms.forEach((m, i) => {
      const used = fns.some(t => stIdx(t) === i);
      if (used) g += `<line class="mp-stem" x1="${xs[i]}" x2="${xs[i]}" y1="${base}" y2="${base - 36 + R}"/>`;
      g += `<circle class="mp-st${used ? ' on' : ''}" cx="${xs[i]}" cy="${base}" r="${used ? 5.5 : 4}"/><text class="mp-lab${used ? ' on' : ''}" x="${xs[i]}" y="${base + 24}" text-anchor="middle">${esc(m.label)}</text>`;
    });
    for (let k = 0; k < pos.length - 1; k++) {
      const a = pos[k], b = pos[k + 1];
      if (Math.abs(a.x - b.x) < 1) {
        const dir = b.y < a.y ? -1 : 1;
        g += `<path class="mp-link" d="M${a.x} ${a.y + dir * (R + 2)} L${b.x} ${b.y - dir * (R + 3)}" marker-end="url(#mp-arr)"/>`;
      } else {
        const right = b.x > a.x ? 1 : -1;
        const top = Math.max(4, Math.min(a.y, b.y) - 30);
        const sx = a.x + right * (R - 3), sy = a.y - R + 4, ex = b.x - right * (R - 2), ey = b.y - R + 2;
        g += `<path class="mp-link" d="M${sx} ${sy} Q ${(sx + ex) / 2} ${top} ${ex} ${ey}" marker-end="url(#mp-arr)"/>`;
      }
    }
    pos.forEach(p => {
      g += `<g class="mp-mk s${p.k + 1}"><circle cx="${p.x}" cy="${p.y}" r="${R}"/><text x="${p.x}" y="${p.y + 5}" text-anchor="middle">${p.k + 1}</text></g>`;
    });
    const desc = fns.map((t, k) => `${k + 1} : ${ESS[t].je} (${MOMENT[t].label.toLowerCase()})`).join(' ; ');
    return `<svg class="mpath" viewBox="0 0 ${W} ${H}" role="img" aria-label="Moments de la conversation. ${esc(desc)}">${g}</svg>`;
  }

  /* ---------- Séance ---------- */
  let SESSION = null;
  let PREV_VIEW = null;
  function pickFor(tab, n) {
    const rank = id => { const c = state.cards[id]; return c && c.due <= T ? 0 : !c ? 1 : 2; };
    return ESS[tab].cles.map((k, i) => ({ id: tab + '.' + i, i }))
      .map(x => Object.assign(x, { r: rank(x.id), due: (state.cards[x.id] || {}).due || '' }))
      .sort((a, b) => a.r - b.r || (a.r !== 1 ? a.due.localeCompare(b.due) : 0) || a.i - b.i)
      .slice(0, n).sort((a, b) => a.i - b.i).map(x => x.id);
  }
  function startSession(scen) {
    const fns = scen.fonctions.slice(0, 3);
    const bonus = dueIds(state).filter(id => !fns.includes(+id.split('.')[0])).slice(0, 2);
    SESSION = { id: scen.id, scen, fns, groups: fns.map(t => ({ tab: t, ids: pickFor(t, 2) })), bonus, ticks: new Set(), ratings: {}, saved: null };
    timerReset(true);
  }
  const sessionIds = () => SESSION.groups.reduce((a, g) => a.concat(g.ids), []).concat(SESSION.bonus);
  const slotOf = id => { const t = +id.split('.')[0]; const k = SESSION.fns.indexOf(t); return k < 0 || SESSION.bonus.includes(id) ? 'b' : String(k + 1); };
  const nextBox = (b, r) => (r === 'facile' ? Math.min(5, Math.max(b, 1) + 1) : r === 'moyen' ? Math.max(b, 1) : 1);

  /* ---------- Vues ---------- */
  function viewHome() {
    const scen = scenarioFor(TODAY), sc = D.scenes[scen.id], w = who(sc);
    const tomorrow = scenarioFor(addDays(TODAY, 1));
    const vs = viewState(), ex = isExample();
    const done = state.days.includes(T);
    const streak = streakOf(vs), due = dueIds(vs);
    const seen = TOTAL - boxCounts(vs)[0];
    return `<div class="home">
      <section class="hero" aria-labelledby="h-today">
        <div class="hero-top">
          <p class="eyebrow">${esc(fmtLong(TODAY))}</p>
          ${done ? `<p class="done-pill">${I.check}Séance faite aujourd’hui</p>` : ''}
        </div>
        <h1 id="h-today" tabindex="-1">Ta séance du jour</h1>
        <div class="scene">
          <p class="scene-who"><span class="avatar">${I.person}</span><span><strong>${esc(w.name)}</strong> ${verbOf(scen)} :${w.where ? `<small>${esc(w.where)}</small>` : ''}</span></p>
          <blockquote class="bubble bubble-xl"><p>${esc(scen.dit)}</p></blockquote>
        </div>
        <div class="plan">
          <p class="plan-k">Pour répondre, tu vas enchaîner 3 fonctions :</p>
          ${chainHTML(scen.fonctions)}
        </div>
        ${timebar()}
        <div class="hero-cta">
          <a class="btn btn-primary btn-xl" href="#seance/${scen.id}/1">${done ? 'Refaire la séance' : 'Commencer'}${I.right}</a>
          <a class="btn btn-ghost btn-xl" href="#situations">Choisir une situation</a>
        </div>
        <p class="hero-next">Demain : « ${esc(tomorrow.dit)} »</p>
      </section>

      <section class="stats" aria-labelledby="h-prog">
        <div class="sec-head"><h2 id="h-prog">Ta progression</h2>${ex ? '<span class="tag-ex">Exemple</span>' : isEmpty() ? '<button type="button" class="linkbtn" data-act="show-example">Voir un exemple</button>' : ''}</div>
        ${ex ? `<p class="ex-note">Aperçu fictif, pour te montrer l’écran : tes vraies données le remplacent dès ta première séance. <button type="button" class="linkbtn" data-act="hide-example">Masquer l’exemple</button></p>` : ''}
        <div class="stat-grid">
          <article class="stat stat-streak">
            <p class="stat-k">Série</p>
            <p class="streak-n"><strong>${streak}</strong><span>${streak > 1 ? 'jours de suite' : streak === 1 ? 'jour' : 'jour : ta première séance lance la série'}</span></p>
            ${weekStrip(vs)}
          </article>
          <article class="stat stat-ring">
            <p class="stat-k">Expressions pratiquées</p>
            <div class="ring-row">${ringHTML(vs, 124)}${boxLegend(vs)}</div>
          </article>
          <article class="stat stat-due">
            <p class="stat-k">À revoir aujourd’hui</p>
            <p class="due-n"><strong>${due.length}</strong><span>${due.length ? (due.length > 1 ? 'formules reviennent' : 'formule revient') : seen ? 'rien à revoir : bravo !' : 'rien pour l’instant'}</span></p>
            ${due.length ? `<ul class="due-list">${due.slice(0, 4).map(id => { const ci = card(id); return `<li><i style="background:var(--b${vs.cards[id].box})"></i>${esc(fullName(ci))}</li>`; }).join('')}${due.length > 4 ? `<li class="more">+ ${due.length - 4}</li>` : ''}</ul>
            <p class="stat-note">Elles s’ajoutent en bonus à ta séance du jour.</p>` : '<p class="stat-note">Chaque formule évaluée revient au bon moment : demain, dans 2 jours, 4 jours…</p>'}
            <a class="stat-link" href="#expressions">Voir mes 5 boîtes${I.right}</a>
          </article>
        </div>
      </section>
    </div>`;
  }

  /* --- Situations --- */
  const SIT = { type: '', fn: 0 };
  function scenCard(s, vs) {
    const sc = D.scenes[s.id], today = s.id === scenarioFor(TODAY).id;
    const avg = Math.round(s.fonctions.reduce((a, t) => a + mastery(vs, t), 0) / s.fonctions.length);
    return `<li class="scard${today ? ' is-today' : ''}">
      <div class="scard-top"><span class="pill">${typeLabel(s)}</span><span class="pill pill-soft">${esc(s.theme)}</span>${today ? '<span class="pill pill-acc">Aujourd’hui</span>' : ''}</div>
      <p class="scard-who">${esc(who(sc).name)} ${verbOf(s)} :</p>
      <p class="scard-line">« ${esc(s.dit)} »</p>
      ${chainHTML(s.fonctions, 'chain-sm')}
      <div class="scard-foot">
        <span class="scard-m" title="Maîtrise moyenne des 3 fonctions">${miniRing(avg)}<span><b>${avg} %</b> maîtrisé</span></span>
        <a class="btn btn-primary" href="#seance/${s.id}/1" aria-label="Pratiquer : ${esc(s.dit)}">Pratiquer${I.right}</a>
      </div>
    </li>`;
  }
  function matrixHTML() {
    const counts = TABS.map(t => SCEN.filter(s => s.fonctions.includes(t)).length);
    const max = Math.max.apply(null, counts);
    const cell = (t, inner) => `<span class="mx-c${SIT.fn === t ? ' hl' : ''}">${inner}</span>`;
    const head = `<div class="mx-row mx-head" aria-hidden="true"><span class="mx-l"></span>${TABS.map(t => cell(t, `<abbr title="${esc(ESS[t].je)}">${t}</abbr>`)).join('')}</div>`;
    const rows = SCEN.map(s => {
      const dim = (SIT.type && s.type !== SIT.type) || (SIT.fn && !s.fonctions.includes(SIT.fn));
      return `<a class="mx-row${dim ? ' dim' : ''}" href="#seance/${s.id}/1" aria-label="${esc(`Pratiquer « ${D.scenes[s.id].court} » : ${s.fonctions.map(t => ESS[t].je).join(', ')}`)}"><span class="mx-l">${esc(D.scenes[s.id].court)}</span>${TABS.map(t => { const k = s.fonctions.indexOf(t); return cell(t, k < 0 ? '<i class="mx-dot"></i>' : `<b class="mx-disc s${k + 1}">${k + 1}</b>`); }).join('')}</a>`;
    }).join('');
    const foot = `<div class="mx-row mx-foot" aria-hidden="true"><span class="mx-l">Situations</span>${counts.map((n, i) => cell(TABS[i], `<i class="mx-bar" style="height:${Math.round(n / max * 100)}%"></i><span class="mx-n">${n}</span>`)).join('')}</div>`;
    return `<div class="mx">${head}${rows}${foot}</div>`;
  }
  function viewSituations() {
    const vs = viewState();
    const list = SCEN.filter(s => (!SIT.type || s.type === SIT.type) && (!SIT.fn || s.fonctions.includes(SIT.fn)));
    const seg = [['', 'Toutes'], ['question', 'On te pose une question'], ['nouvelle', 'On t’annonce une nouvelle']];
    return `<header class="vhead">
        <p class="eyebrow">${SCEN.length} situations de la vie au Québec</p>
        <h1 tabindex="-1">Choisir une situation</h1>
        <p class="lead">Chaque situation fait travailler 3 fonctions, dans l’ordre où tu vas les dire. Choisis celle qui te parle, ou filtre selon ce que tu veux pratiquer.</p>
      </header>
      <div class="filters">
        <div class="seg" role="group" aria-label="Type de situation">${seg.map(([v, l]) => `<button type="button" data-act="sit-type" data-v="${v}" aria-pressed="${SIT.type === v}">${l}</button>`).join('')}</div>
        <label class="sel"><span>Fonction</span><select id="sit-fn">
          <option value="0">Toutes les fonctions</option>
          ${TABS.map(t => { const n = SCEN.filter(s => s.fonctions.includes(t)).length; return `<option value="${t}"${SIT.fn === t ? ' selected' : ''}${n ? '' : ' disabled'}>${t} · ${esc(ESS[t].je)} (${n})</option>`; }).join('')}
        </select></label>
      </div>
      <p class="count-line" aria-live="polite">${list.length} situation${list.length > 1 ? 's' : ''}${SIT.fn ? ` pour « ${esc(ESS[SIT.fn].je)} »` : ''}</p>
      <ul class="scards">${list.map(s => scenCard(s, vs)).join('')}</ul>
      <section class="card mx-card" aria-labelledby="h-mx">
        <h2 id="h-mx">Quelles fonctions pour quelles situations ?</h2>
        <p class="muted">Chaque ligne est une situation ; chaque colonne, une des 12 fonctions. Le chiffre donne l’ordre dans ta réponse. Touche une ligne pour la pratiquer.</p>
        ${matrixHTML()}
      </section>`;
  }

  /* --- Mes expressions --- */
  let LT_BOX = null;
  function leitnerHTML(vs) {
    const counts = boxCounts(vs);
    const byBox = [[], [], [], [], [], []];
    ALL_CARDS.forEach(id => { const c = vs.cards[id]; if (c) byBox[c.box].push(id); });
    byBox.forEach(l => l.sort((a, b) => vs.cards[a].due.localeCompare(vs.cards[b].due)));
    if (LT_BOX === null || !counts[LT_BOX]) LT_BOX = [1, 2, 3, 4, 5].find(b => counts[b]) || 1;
    const maxN = Math.max(1, Math.max.apply(null, counts.slice(1)));
    const cols = [1, 2, 3, 4, 5].map(b => {
      const ids = byBox[b], shown = ids.slice(0, 7);
      return `<button type="button" class="lt-col" data-act="lt-box" data-box="${b}" aria-pressed="${LT_BOX === b}" style="--bc:var(--b${b});--fill:${(counts[b] / maxN).toFixed(3)}">
        <span class="lt-n">${counts[b]}</span>
        <span class="lt-bin" aria-hidden="true"><span class="lt-stack">${shown.map(id => `<span class="lt-chip${vs.cards[id].due <= T ? ' due' : ''}"><span>${esc(fullName(card(id)))}</span></span>`).join('')}${ids.length > shown.length ? `<span class="lt-more">+${ids.length - shown.length}</span>` : ''}</span></span>
        <span class="lt-name">Boîte ${b}</span>
        <span class="lt-rh">${RHYTHM[b]}</span>
      </button>`;
    }).join('');
    const sel = byBox[LT_BOX];
    const detail = sel.length ? `<ul class="lt-list">${sel.map(id => {
      const ci = card(id), c = vs.cards[id];
      return `<li><span class="lt-li-main"><strong>${esc(fullName(ci))}</strong> ${ci.tab === 7 ? '' : consPill(ci.c)}<span class="lt-fn">${ci.tab} · ${esc(ESS[ci.tab].je)}</span></span><span class="lt-when${c.due <= T ? ' due' : ''}">${whenText(c.due)}</span><a class="ext" href="${esc(siteHref(ci))}" aria-label="« ${esc(ci.e)} » dans le site complet">${I.ext}</a></li>`;
    }).join('')}</ul>` : '<p class="muted">Aucune formule dans cette boîte pour l’instant.</p>';
    return `<div class="lt-rules" aria-label="Comment une formule change de boîte">
        <figure class="lt-rule"><svg viewBox="0 0 60 24" aria-hidden="true"><rect x="2" y="6" width="14" height="14" rx="3" class="r-a"/><path d="M20 13h17" class="r-arr"/><path d="M34 9l4 4-4 4" class="r-arr"/><rect x="42" y="6" width="14" height="14" rx="3" class="r-b"/></svg><figcaption><b>Facile</b> : elle avance d’une boîte</figcaption></figure>
        <figure class="lt-rule"><svg viewBox="0 0 60 24" aria-hidden="true"><rect x="23" y="8" width="14" height="14" rx="3" class="r-a"/><path d="M22 7a9 6 0 0 1 16 0" class="r-arr"/><path d="M35 3.5l3 3.5-4 1" class="r-arr"/></svg><figcaption><b>Moyen</b> : elle reste dans sa boîte</figcaption></figure>
        <figure class="lt-rule"><svg viewBox="0 0 60 24" aria-hidden="true"><rect x="2" y="8" width="14" height="14" rx="3" class="r-c"/><rect x="42" y="8" width="14" height="14" rx="3" class="r-a"/><path d="M49 7Q29 -6 10 6" class="r-arr r-back"/><path d="M13 2.5l-3.5 3.8 4.8 1.2" class="r-arr r-back"/></svg><figcaption><b>Difficile</b> : retour en boîte 1</figcaption></figure>
      </div>
      <div class="lt-cols">${cols}</div>
      <div class="lt-detail" id="lt-detail" aria-live="polite">
        <h3>Boîte ${LT_BOX} <span>· ${RHYTHM[LT_BOX]} · ${sel.length} formule${sel.length > 1 ? 's' : ''}</span></h3>
        ${detail}
      </div>
      <p class="lt-new"><span class="lt-new-bar" style="--w:${(counts[0] / TOTAL * 100).toFixed(1)}%"></span>${counts[0]} formule${counts[0] > 1 ? 's' : ''} pas encore pratiquée${counts[0] > 1 ? 's' : ''} : elles entrent dans les boîtes au fil des séances.</p>`;
  }
  function masteryHTML(vs) {
    const row = t => {
      const ids = ESS[t].cles.map((k, i) => t + '.' + i);
      const sorted = ids.slice().sort((a, b) => (vs.cards[b] ? vs.cards[b].box : 0) - (vs.cards[a] ? vs.cards[a].box : 0));
      const pct = mastery(vs, t);
      const n = SCEN.filter(s => s.fonctions.includes(t)).length;
      const seen = ids.filter(id => vs.cards[id]).length;
      return `<li class="ms-row">
        <span class="ms-num" aria-hidden="true">${t}</span>
        <div class="ms-main">
          <div class="ms-top"><span class="ms-name">${esc(ESS[t].je)}</span><span class="ms-pct">${pct} %</span></div>
          <div class="ms-bar" role="img" aria-label="${esc(`${ESS[t].je} : ${seen} formules pratiquées sur ${ids.length}, maîtrise ${pct} %`)}">${sorted.map(id => { const c = vs.cards[id]; return `<span class="ms-u" style="background:${c ? `var(--b${c.box})` : 'var(--track)'}" title="${esc(fullName(card(id)))} — ${c ? 'boîte ' + c.box : 'pas encore pratiquée'}"></span>`; }).join('')}</div>
          <div class="ms-sub"><span>${seen}/${ids.length} pratiquées</span>${n ? `<a href="#situations/${t}">${n} situation${n > 1 ? 's' : ''} pour pratiquer${I.right}</a>` : `<a href="${esc(C.siteLink('#onglet-' + t))}">Voir l’onglet ${t} dans le site complet${I.right}</a>`}</div>
        </div>
      </li>`;
    };
    return `<ul class="bx-legend bx-legend-line" aria-label="Légende">${[1, 2, 3, 4, 5].map(b => `<li><i style="background:var(--b${b})"></i>Boîte ${b}</li>`).join('')}<li><i class="bx-none"></i>pas encore</li></ul>
      <div class="ms-groups">${M.moments.map(m => `<div class="ms-group"><h3><span class="ms-moment">${esc(m.label)}</span></h3><ul class="ms-list">${m.tabs.map(row).join('')}</ul></div>`).join('')}</div>`;
  }
  function viewExpressions() {
    const vs = viewState(), ex = isExample();
    const counts = boxCounts(vs), due = dueIds(vs).length;
    return `<header class="vhead">
        <p class="eyebrow">Répétition espacée</p>
        <h1 tabindex="-1">Mes expressions</h1>
        <p class="lead">Chaque formule évaluée voyage de boîte en boîte. Plus elle avance, plus elle revient tard : tu revois au bon moment ce qui est fragile.</p>
      </header>
      ${ex ? `<p class="ex-note ex-note-box"><span class="tag-ex">Exemple</span> Aperçu fictif : tes vraies boîtes se remplissent dès ta première séance. <button type="button" class="linkbtn" data-act="hide-example">Masquer l’exemple</button></p>` : ''}
      <div class="exp-grid">
        <section class="card lt-card" aria-labelledby="h-lt">
          <div class="sec-head"><h2 id="h-lt">Les 5 boîtes</h2><p class="muted">${TOTAL - counts[0]} pratiquées sur ${TOTAL} · <b>${due}</b> à revoir aujourd’hui</p></div>
          <div id="lt">${leitnerHTML(vs)}</div>
        </section>
        <section class="card ms-card" aria-labelledby="h-ms">
          <div class="sec-head"><h2 id="h-ms">Maîtrise par fonction</h2><p class="muted">Les 12 fonctions, rangées selon le moment de la conversation où elles servent. Un bloc = une formule clé.</p></div>
          ${masteryHTML(vs)}
        </section>
      </div>`;
  }

  /* --- Séance : coque commune --- */
  function sessionShell(step, inner, foot) {
    const s = SESSION, sc = D.scenes[s.id];
    const steps = D.steps.map(st => {
      const done = st.n < step || (st.n === 4 && s.saved);
      const cls = st.n === step ? 'cur' : done ? 'done' : '';
      return `<li class="${cls}"><a href="#seance/${s.id}/${st.n}"${st.n === step ? ' aria-current="step"' : ''}><span class="st-dot">${done && st.n !== step ? I.check : STEP_ICON[st.n]}</span><span class="st-t">${st.titre}</span><span class="sr">${done ? ' (fait)' : ''}</span></a></li>`;
    }).join('');
    return `<div class="sess" data-step="${step}">
      <div class="s-sticky">
        <div class="s-row">
          <a class="s-quit" href="#accueil" aria-label="Quitter la séance « ${esc(sc.court)} »">${I.x}</a>
          <nav class="s-nav" aria-label="Étapes de la séance"><ol class="stepper" style="--p:${((step - 1) / 3).toFixed(3)}">${steps}</ol></nav>
        </div>
        ${step === 2 ? fnSwitch() : ''}
      </div>
      <div class="s-body">${inner}</div>
      <div class="s-foot">${foot}</div>
    </div>`;
  }
  function stepHead(step, title, lead) {
    const st = D.steps[step - 1], et = ETAPE[st.methode];
    return `<header class="s-head"><p class="eyebrow">Étape ${step} sur 4 <span class="meth" title="${esc(et.objectif)}">méthode · ${esc(et.titre.toLowerCase())}</span></p><h1 tabindex="-1">${title}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}</header>`;
  }
  const footBtn = (href, label, primary, icon) => `<a class="btn ${primary ? 'btn-primary' : 'btn-ghost'}" href="${href}">${icon === 'left' ? I.left : ''}<span class="fl">${label}</span>${icon === 'right' ? I.right : ''}</a>`;

  /* --- Étape 1 : Écoute --- */
  function stepEcoute() {
    const s = SESSION, scen = s.scen, sc = D.scenes[s.id], w = who(sc);
    const syn = !!window.speechSynthesis && typeof window.SpeechSynthesisUtterance === 'function';
    const inner = `${stepHead(1, 'Écoute', 'Imagine que quelqu’un te dit cette phrase, là, maintenant. Lis-la à voix haute, puis regarde le chemin de ta réponse.')}
      <div class="listen">
        <p class="scene-who"><span class="avatar">${I.person}</span><span><strong>${esc(w.name)}</strong> ${verbOf(scen)} :${w.where ? `<small>${esc(w.where)}</small>` : ''}</span></p>
        <blockquote class="bubble bubble-xxl"><p>${esc(scen.dit)}</p></blockquote>
        <div class="listen-row">
          ${syn ? `<button type="button" class="btn btn-ghost" data-act="speak">${I.speaker}<span>Écouter la phrase</span></button>` : ''}
          <span class="pill">${typeLabel(scen)}</span><span class="pill pill-soft">${esc(scen.theme)}</span>
        </div>
      </div>
      <div class="ecoute-grid">
        <section class="card" aria-labelledby="h-path">
          <h2 id="h-path">Ta réponse en 3 temps</h2>
          <p class="muted">Chaque temps est une fonction. Le schéma les place sur les moments d’une conversation.</p>
          <div class="mpath-wrap">${momentPath(s.fns)}</div>
          <ol class="fn-list">${s.fns.map((t, k) => `<li class="s${k + 1}"><span class="disc" aria-hidden="true">${k + 1}</span><div><strong>${esc(ESS[t].je)}</strong><span>${esc(ESS[t].quand)}</span></div></li>`).join('')}</ol>
        </section>
        <section class="card" aria-labelledby="h-turn">
          <h2 id="h-turn">Ton tour de parole</h2>
          <p class="muted">L’autre parle (violet), puis toi (orange) : tes 3 temps, et une question pour relancer.</p>
          <div class="viz-box">${viz(turnSpec())}</div>
        </section>
      </div>`;
    return sessionShell(1, inner, `${footBtn('#accueil', 'Accueil', false, 'left')}${footBtn(`#seance/${s.id}/2`, 'Préparer ma réponse', true, 'right')}`);
  }

  /* --- Étape 2 : Prépare --- */
  function fnSwitch() {
    return `<div class="fn-switch" role="group" aria-label="Aller à une fonction">${SESSION.fns.map((t, k) => `<button type="button" class="s${k + 1}" data-act="goto-fn" data-tab="${t}"><span class="disc" aria-hidden="true">${k + 1}</span><span>${esc(ESS[t].je)}</span></button>`).join('')}</div>`;
  }
  function formulaCard(id, st) {
    const ci = card(id);
    const spec = ci.map ? rowSpec(ci.map.v[0], ci.map.v[1]) : null;
    return `<article class="fcard">
      <div class="fcard-top"><h3 class="f-name">${esc(ci.e)}</h3>${consPill(ci.c)}${boxBadge(id, st)}</div>
      <p class="f-ex">« ${highlight(ci.ex, ci.e)} »</p>
      ${spec ? `<div class="f-viz"><p class="f-viz-k">Comment ça marche</p>${viz(spec)}</div>` : ''}
      <a class="f-link" href="${esc(siteHref(ci))}">Variantes dans le site complet${I.ext}</a>
    </article>`;
  }
  function fnSection(g, slot, st) {
    const e = ESS[g.tab], qc = e.qc[0];
    const cs = contrastSpec(g.tab);
    const wide = window.matchMedia && window.matchMedia('(min-width: 1100px)').matches;
    return `<section class="fn-sec s${slot}" id="fn-${g.tab}" aria-labelledby="fnh-${g.tab}">
      <header class="fn-head"><span class="disc" aria-hidden="true">${slot}</span><div><p class="fn-k">Temps ${slot} · ${esc(MOMENT[g.tab].label)}</p><h2 id="fnh-${g.tab}">${esc(e.je)}</h2><p class="fn-q">${esc(e.quand)}</p></div></header>
      ${g.ids.map(id => formulaCard(id, st)).join('')}
      ${qc ? `<p class="qc"><span class="qc-flag">QC</span><span>Au Québec, on entend aussi <strong>${esc(qc.e)}</strong>${qc.r ? ` <span class="reg">${esc(qc.r)}</span>` : ''}<em class="qc-ex">${esc(qc.ex)}</em></span></p>` : ''}
      ${cs ? `<details class="contrast"${wide ? ' open' : ''}><summary><span class="ct-k">Ne confonds pas</span><span class="ct-t">${md(e.attention)}</span></summary><div class="ct-viz">${viz(cs, true)}</div></details>` : ''}
    </section>`;
  }
  function stepPrepare() {
    const s = SESSION;
    const inner = `${stepHead(2, 'Prépare', 'Deux formules par fonction. Lis l’exemple, puis regarde le schéma : il montre comment la formule relie tes idées.')}
      <p class="legend-key"><span><i class="lk lk-cadre" aria-hidden="true"></i><span><b>Orange</b> : l’action du cadre, ce que l’expression introduit</span></span><span><i class="lk lk-main" aria-hidden="true"></i><span><b>Violet</b> : la phrase principale</span></span></p>
      <div class="prep-grid">${s.groups.map((g, k) => fnSection(g, k + 1, state)).join('')}</div>
      ${s.bonus.length ? `<section class="bonus" aria-labelledby="h-bonus"><div class="sec-head"><h2 id="h-bonus">Bonus : à revoir aujourd’hui</h2><p class="muted">Ces formules viennent d’autres fonctions. Glisse-les dans ta réponse si tu peux : c’est l’étape « réemployer » de la méthode.</p></div><div class="bonus-grid">${s.bonus.map(id => formulaCard(id, state)).join('')}</div></section>` : ''}`;
    return sessionShell(2, inner, `${footBtn(`#seance/${s.id}/1`, 'Écoute', false, 'left')}${footBtn(`#seance/${s.id}/3`, 'Passer à l’oral', true, 'right')}`);
  }

  /* --- Étape 3 : Parle --- */
  const RING_R = 86, RING_C = 2 * Math.PI * RING_R;
  const timer = { total: 60, left: 60, running: false, t0: 0, base: 60, id: null, said: {} };
  function timerHTML() {
    let ticks = '';
    for (let i = 0; i < 60; i += 5) {
      const a = (i / 60) * 2 * Math.PI - Math.PI / 2, r1 = 99, r2 = i % 15 === 0 ? 92 : 95;
      ticks += `<line x1="${(110 + r1 * Math.cos(a)).toFixed(1)}" y1="${(110 + r1 * Math.sin(a)).toFixed(1)}" x2="${(110 + r2 * Math.cos(a)).toFixed(1)}" y2="${(110 + r2 * Math.sin(a)).toFixed(1)}"/>`;
    }
    return `<div class="timer" data-state="idle">
      <div class="t-ring">
        <svg viewBox="0 0 220 220" aria-hidden="true"><g class="t-ticks">${ticks}</g><circle class="t-track" cx="110" cy="110" r="${RING_R}"/><circle class="t-arc" cx="110" cy="110" r="${RING_R}" transform="rotate(-90 110 110)" stroke-dasharray="${RING_C.toFixed(2)}" stroke-dashoffset="${RING_C.toFixed(2)}"/></svg>
        <div class="t-center"><span class="t-time" role="timer" aria-label="Temps restant">1:00</span><span class="t-sub">prête ?</span></div>
      </div>
      <div class="t-ctrl"><button type="button" class="btn btn-primary btn-xl t-go" data-act="timer">${I.play}<span>Démarrer</span></button><button type="button" class="btn btn-ghost btn-round" data-act="timer-reset" aria-label="Recommencer la minute">${I.reset}</button></div>
    </div>`;
  }
  function checkItem(id) {
    const ci = card(id), slot = slotOf(id);
    return `<li><label class="chk s${slot}"><input type="checkbox" data-id="${id}"${SESSION.ticks.has(id) ? ' checked' : ''}><span class="chk-box" aria-hidden="true">${I.check}</span><span class="chk-t"><strong>${esc(ci.e)}</strong>${consPill(ci.c)}</span></label></li>`;
  }
  function stepParle() {
    const s = SESSION, sc = D.scenes[s.id];
    const ids = sessionIds(), n = ids.length, k = ids.filter(id => s.ticks.has(id)).length;
    const rel = typeof sc.relance === 'string' ? sc.relance : ESS[sc.relance || s.fns[0]].relance;
    const others = s.fns.map(t => ESS[t].relance).filter(r => r !== rel);
    const inner = `${stepHead(3, 'Parle', 'Réponds à voix haute pendant une minute. Coche chaque formule dès que tu l’utilises : pas besoin d’être parfaite.')}
      <div class="speak-grid">
        <div class="speak-left">
          <blockquote class="bubble bubble-md"><p>${esc(s.scen.dit)}</p></blockquote>
          ${timerHTML()}
          <aside class="tip" aria-labelledby="h-tip">
            <p class="tip-k" id="h-tip">${I.bulb}Pour continuer :</p>
            <p class="tip-q">« ${esc(rel)} »</p>
            <p class="tip-more">Quand l’autre a répondu, tu peux encore dire : ${others.map(r => `« ${esc(r)} »`).join(' ou ')}</p>
          </aside>
        </div>
        <div class="speak-right">
          <section class="card checklist" aria-labelledby="h-chk">
            <div class="chk-head"><h2 id="h-chk">Tes formules</h2><span class="chk-count" aria-live="polite"><b>${k}</b> / ${n} utilisées</span></div>
            <div class="chk-prog" aria-hidden="true"><span style="width:${(k / n * 100).toFixed(1)}%"></span></div>
            ${s.groups.map((g, i) => `<div class="chk-group s${i + 1}"><p class="chk-g"><span class="disc" aria-hidden="true">${i + 1}</span>${esc(ESS[g.tab].je)}</p><ul>${g.ids.map(checkItem).join('')}</ul></div>`).join('')}
            ${s.bonus.length ? `<div class="chk-group sb"><p class="chk-g"><span class="disc" aria-hidden="true">+</span>Bonus à revoir</p><ul>${s.bonus.map(checkItem).join('')}</ul></div>` : ''}
          </section>
          <details class="card model">
            <summary>Voir une réponse possible</summary>
            <p class="answer">${sc.reponse.map((t, i) => `<span class="seg s${i + 1}"><span class="disc" aria-hidden="true">${i + 1}</span>${md(t)}</span>`).join(' ')}</p>
            <p class="muted small">À toi de la dire avec tes mots : change les détails, garde les formules.</p>
          </details>
        </div>
      </div>`;
    return sessionShell(3, inner, `${footBtn(`#seance/${s.id}/2`, 'Prépare', false, 'left')}${footBtn(`#seance/${s.id}/4`, 'Faire le bilan', true, 'right')}`);
  }

  /* --- Étape 4 : Bilan --- */
  const RATES = [['facile', 'Facile'], ['moyen', 'Moyen'], ['difficile', 'Difficile']];
  function rateRow(id) {
    const ci = card(id), slot = slotOf(id), r = SESSION.ratings[id];
    const from = state.cards[id] ? state.cards[id].box : 0;
    return `<fieldset class="rate s${slot}">
      <legend><span class="disc" aria-hidden="true">${slot === 'b' ? '+' : slot}</span><span class="r-e">${esc(ci.e)}</span>${consPill(ci.c)}<span class="r-meta">${SESSION.ticks.has(id) ? `<span class="r-used">${I.check}utilisée</span>` : ''}${boxBadge(id, state)}</span></legend>
      <div class="r-opts">${RATES.map(([v, l]) => `<label class="r-opt r-${v}"><input type="radio" name="r-${id.replace('.', '-')}" value="${v}" data-id="${id}"${r === v ? ' checked' : ''}><span>${l}</span></label>`).join('')}</div>
      <p class="r-move" data-move="${id}">${r ? moveHTML(from, nextBox(from, r)) : ''}</p>
    </fieldset>`;
  }
  function stepBilan() {
    const s = SESSION;
    if (s.saved) return stepDone();
    const ids = sessionIds(), n = ids.length, k = ids.filter(id => s.ratings[id]).length;
    const inner = `${stepHead(4, 'Bilan', 'Pour chaque formule : c’était facile, moyen ou difficile ? Le coach la range dans une boîte et la fait revenir au bon moment.')}
      <div class="bilan-grid">
        <div class="rate-list">${ids.map(rateRow).join('')}</div>
        <aside class="card rate-side">
          <h2>Comment ça marche</h2>
          <ul class="rate-rules">
            <li><b class="rr rr-f">Facile</b> la formule avance d’une boîte : elle revient plus tard.</li>
            <li><b class="rr rr-m">Moyen</b> elle reste dans sa boîte.</li>
            <li><b class="rr rr-d">Difficile</b> retour en boîte 1 : elle revient demain.</li>
          </ul>
          <div class="rate-boxes" aria-hidden="true">${[1, 2, 3, 4, 5].map(b => `<span style="--bc:var(--b${b})"><b>${b}</b>${INTERVAL[b]} j</span>`).join('')}</div>
          <p class="rate-count" aria-live="polite"><b>${k}</b> sur ${n} évaluées</p>
          <button type="button" class="btn btn-primary btn-xl btn-block" data-act="save"${k < n ? ' disabled' : ''}>Enregistrer mon bilan</button>
        </aside>
      </div>`;
    return sessionShell(4, inner, `${footBtn(`#seance/${s.id}/3`, 'Parle', false, 'left')}<button type="button" class="btn btn-primary" data-act="save"${k < n ? ' disabled' : ''}>Enregistrer${I.check}</button>`);
  }
  function stepDone() {
    const s = SESSION, res = s.saved;
    const streak = streakOf(state);
    const back = dueIds(state, TOMORROW);
    const tomorrow = scenarioFor(addDays(TODAY, 1));
    const nNew = res.moves.filter(m => !m.from).length;
    const nUp = res.moves.filter(m => m.from && m.to > m.from).length;
    const nDown = res.moves.filter(m => m.from && m.to < m.from).length;
    const parts = [];
    if (nNew) parts.push(`${nNew} ${nNew > 1 ? 'entrent' : 'entre'} dans les boîtes`);
    if (nUp) parts.push(`${nUp} ${nUp > 1 ? 'avancent' : 'avance'} d’une boîte`);
    if (nDown) parts.push(`${nDown} ${nDown > 1 ? 'reviennent' : 'revient'} en boîte 1`);
    const inner = `<header class="s-head done-head">
        <div class="done-badge" aria-hidden="true">${I.check}</div>
        <p class="eyebrow">Étape 4 sur 4 · bilan enregistré</p>
        <h1 tabindex="-1">Bravo, séance terminée !</h1>
        <p class="lead">${res.moves.length} formules évaluées : ${parts.join(', ')}.${res.ok ? '' : ' <strong>Attention :</strong> ton navigateur ne permet pas d’enregistrer ; cette progression disparaîtra si tu fermes la page.'}</p>
      </header>
      <div class="done-grid">
        <section class="card done-streak" aria-labelledby="h-streak">
          <h2 id="h-streak" class="sr">Ta série</h2>
          <p class="streak-n big"><strong>${streak}</strong><span>${streak > 1 ? 'jours de suite' : 'jour : la série commence'}</span></p>
          ${weekStrip(state)}
        </section>
        <section class="card" aria-labelledby="h-back">
          <h2 id="h-back">Ce qui revient demain</h2>
          ${back.length ? `<ul class="back-list">${back.map(id => { const ci = card(id); return `<li><i style="background:var(--b${state.cards[id].box})"></i><strong>${esc(fullName(ci))}</strong><span>${esc(ESS[ci.tab].je)}</span></li>`; }).join('')}</ul>` : '<p class="muted">Rien demain : tout ce que tu as vu aujourd’hui revient plus tard. Profites-en pour une nouvelle situation !</p>'}
          <p class="next-scene"><span class="eyebrow">Situation de demain</span>« ${esc(tomorrow.dit)} »</p>
        </section>
        <section class="card done-tl" aria-labelledby="h-tl">
          <h2 id="h-tl">Quand reviennent tes formules ?</h2>
          <p class="muted">Comme « dans + durée » : un point aujourd’hui, un rendez-vous plus loin sur la frise.</p>
          <div class="viz-box">${viz(returnSpec(res.moves))}</div>
        </section>
      </div>`;
    return sessionShell(4, inner, `${footBtn('#accueil', 'Accueil', false, 'left')}${footBtn('#expressions', 'Mes expressions', true, 'right')}`);
  }

  /* ---------- Minuterie ---------- */
  const fmtTime = s => { const t = Math.ceil(s); return `${Math.floor(t / 60)}:${pad(t % 60)}`; };
  function timerReset(silent) {
    clearInterval(timer.id); timer.id = null;
    timer.running = false; timer.left = timer.total; timer.said = {};
    if (!silent) timerPaint();
  }
  function timerToggle() {
    if (timer.running) {
      clearInterval(timer.id); timer.id = null; timer.running = false;
      timerPaint();
      return;
    }
    if (timer.left <= 0) { timer.left = timer.total; timer.said = {}; }
    timer.running = true; timer.t0 = Date.now(); timer.base = timer.left;
    timer.id = setInterval(timerTick, 200);
    timerPaint();
  }
  function timerTick() {
    timer.left = Math.max(0, timer.base - (Date.now() - timer.t0) / 1000);
    [30, 10].forEach(n => { if (timer.left <= n && !timer.said[n] && timer.left > 0) { timer.said[n] = 1; announce(`Encore ${n} secondes.`); } });
    if (timer.left <= 0) {
      clearInterval(timer.id); timer.id = null; timer.running = false;
      announce('Temps écoulé. Coche tes formules, puis passe au bilan.');
    }
    timerPaint();
  }
  function timerPaint() {
    const root = $('.timer');
    if (!root) return;
    const st = timer.running ? 'run' : timer.left <= 0 ? 'end' : timer.left < timer.total ? 'pause' : 'idle';
    root.dataset.state = st;
    $('.t-arc', root).setAttribute('stroke-dashoffset', (RING_C * (timer.left / timer.total)).toFixed(2));
    $('.t-time', root).textContent = fmtTime(timer.left);
    $('.t-sub', root).textContent = st === 'run' ? 'parle !' : st === 'pause' ? 'en pause' : st === 'end' ? 'terminé' : 'prête ?';
    const go = $('.t-go', root);
    go.innerHTML = st === 'run' ? `${I.pause}<span>Pause</span>` : st === 'pause' ? `${I.play}<span>Reprendre</span>` : st === 'end' ? `${I.reset}<span>Encore une minute</span>` : `${I.play}<span>Démarrer</span>`;
  }
  function announce(msg) { LIVE.textContent = ''; setTimeout(() => { LIVE.textContent = msg; }, 30); }

  /* ---------- Synthèse vocale (si le navigateur l'offre) ---------- */
  function speak(btn) {
    const syn = window.speechSynthesis;
    if (!syn || !SESSION) return;
    const label = btn.querySelector('span');
    if (syn.speaking) { syn.cancel(); label.textContent = 'Écouter la phrase'; return; }
    try {
      const u = new SpeechSynthesisUtterance(SESSION.scen.dit);
      u.lang = 'fr-CA'; u.rate = 0.92;
      const voices = syn.getVoices() || [];
      const v = voices.find(x => /^fr[-_]CA/i.test(x.lang)) || voices.find(x => /^fr/i.test(x.lang));
      if (v) u.voice = v;
      u.onend = u.onerror = () => { label.textContent = 'Écouter la phrase'; };
      syn.speak(u);
      label.textContent = 'Arrêter';
    } catch (e) { /* synthèse indisponible */ }
  }
  function speakStop() { try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) { /* rien */ } }

  /* ---------- Bilan : enregistrement ---------- */
  function saveBilan() {
    const s = SESSION;
    const ids = sessionIds();
    if (ids.some(id => !s.ratings[id])) return;
    const moves = ids.map(id => {
      const c = state.cards[id] || { box: 0, seen: 0 };
      const from = c.box, to = nextBox(from, s.ratings[id]);
      state.cards[id] = { box: to, due: iso(addDays(TODAY, INTERVAL[to])), seen: (c.seen || 0) + 1, last: T };
      return { id, from, to };
    });
    if (!state.days.includes(T)) state.days.push(T);
    state.days = state.days.slice(-400);
    state.sessions = (state.sessions || 0) + 1;
    state.log = (state.log || []).concat([{ d: T, s: s.id }]).slice(-100);
    s.saved = { moves, ok: saveState() };
    render(true);
    announce('Bilan enregistré.');
  }

  /* ---------- Routeur ---------- */
  let FIRST = true;
  function parseHash() {
    const h = decodeURIComponent(location.hash.replace(/^#/, ''));
    const p = h.split('/');
    return { view: p[0] || 'accueil', a: p[1], b: p[2] };
  }
  function render(keepScroll) {
    const r = parseHash();
    let view = r.view, html, title, nav = view;
    if (view !== 'seance' || !SESSION || r.a !== SESSION.id || r.b !== '3') { clearInterval(timer.id); timer.id = null; timer.running = false; }
    speakStop();
    if (view === 'seance' && SCEN_BY[r.a]) {
      const step = Math.min(4, Math.max(1, parseInt(r.b, 10) || 1));
      if (!SESSION || SESSION.id !== r.a || PREV_VIEW !== 'seance') startSession(SCEN_BY[r.a]);
      html = [null, stepEcoute, stepPrepare, stepParle, stepBilan][step]();
      title = `${D.steps[step - 1].titre} · ${D.scenes[r.a].court}`;
      nav = 'seance';
    } else if (view === 'situations') {
      const f = parseInt(r.a, 10);
      if (f >= 1 && f <= 12) SIT.fn = f;
      html = viewSituations();
      title = 'Choisir une situation';
    } else if (view === 'expressions') {
      html = viewExpressions();
      title = 'Mes expressions';
    } else {
      view = nav = 'accueil';
      html = viewHome();
      title = null;
    }
    document.body.classList.toggle('in-session', nav === 'seance');
    MAIN.innerHTML = `<div class="view view-${nav}">${html}</div>`;
    document.title = title ? `${title} · Coach 5 minutes` : 'Coach 5 minutes · Prototype 6';
    $$('#appnav a').forEach(a => { if (a.dataset.nav === nav) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    afterMount(nav, r);
    if (!keepScroll) window.scrollTo(0, 0);
    if (!FIRST) { const h1 = $('h1', MAIN); if (h1) h1.focus({ preventScroll: true }); }
    FIRST = false;
    PREV_VIEW = nav;
  }
  let IO = null;
  function afterMount(nav, r) {
    if (IO) { IO.disconnect(); IO = null; }
    if (nav === 'seance' && r.b === '3') timerPaint();
    if (nav === 'seance' && (r.b === '2') && 'IntersectionObserver' in window) {
      const btns = $$('.fn-switch button');
      IO = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (!en.isIntersecting) return;
          const t = en.target.id.replace('fn-', '');
          btns.forEach(b => b.classList.toggle('on', b.dataset.tab === t));
        });
      }, { rootMargin: '-35% 0px -55% 0px' });
      $$('.fn-sec').forEach(sec => IO.observe(sec));
    }
  }

  /* ---------- Événements ---------- */
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const act = el.dataset.act;
    if (act === 'hide-example' || act === 'show-example') { prefs.hideExample = act === 'hide-example'; savePrefs(); render(true); }
    else if (act === 'sit-type') { SIT.type = el.dataset.v; rerenderKeep(); }
    else if (act === 'lt-box') { LT_BOX = +el.dataset.box; const box = $('#lt'); if (box) box.innerHTML = leitnerHTML(viewState()); const b = $(`.lt-col[data-box="${LT_BOX}"]`); if (b) b.focus(); }
    else if (act === 'goto-fn') { const sec = $('#fn-' + el.dataset.tab); if (sec) sec.scrollIntoView({ behavior: C.reduceMotion() ? 'auto' : 'smooth', block: 'start' }); }
    else if (act === 'timer') timerToggle();
    else if (act === 'timer-reset') timerReset();
    else if (act === 'speak') speak(el);
    else if (act === 'save') saveBilan();
  });
  function rerenderKeep() {
    const y = window.scrollY;
    const focusSel = document.activeElement && document.activeElement.dataset && document.activeElement.dataset.act === 'sit-type' ? `[data-act="sit-type"][data-v="${document.activeElement.dataset.v}"]` : document.activeElement && document.activeElement.id ? '#' + document.activeElement.id : null;
    MAIN.innerHTML = `<div class="view view-situations no-anim">${viewSituations()}</div>`;
    window.scrollTo(0, y);
    if (focusSel) { const f = $(focusSel); if (f) f.focus({ preventScroll: true }); }
  }
  document.addEventListener('change', e => {
    const t = e.target;
    if (t.id === 'sit-fn') { SIT.fn = +t.value || 0; rerenderKeep(); return; }
    if (!SESSION) return;
    if (t.type === 'checkbox' && t.dataset.id) {
      if (t.checked) SESSION.ticks.add(t.dataset.id); else SESSION.ticks.delete(t.dataset.id);
      const ids = sessionIds(), k = ids.filter(id => SESSION.ticks.has(id)).length;
      const cnt = $('.chk-count'); if (cnt) cnt.innerHTML = `<b>${k}</b> / ${ids.length} utilisées`;
      const bar = $('.chk-prog span'); if (bar) bar.style.width = (k / ids.length * 100).toFixed(1) + '%';
      if (k === ids.length) announce('Toutes les formules sont utilisées. Bravo !');
    }
    if (t.type === 'radio' && t.dataset.id) {
      const id = t.dataset.id;
      SESSION.ratings[id] = t.value;
      const from = state.cards[id] ? state.cards[id].box : 0;
      const mv = $(`[data-move="${id}"]`);
      if (mv) mv.innerHTML = moveHTML(from, nextBox(from, t.value));
      const ids = sessionIds(), k = ids.filter(x => SESSION.ratings[x]).length;
      const rc = $('.rate-count'); if (rc) rc.innerHTML = `<b>${k}</b> sur ${ids.length} évaluées`;
      $$('[data-act="save"]').forEach(b => { b.disabled = k < ids.length; });
    }
  });

  /* ---------- Thème ---------- */
  const themeBtn = $('#theme-btn');
  const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;
  const effTheme = () => document.documentElement.getAttribute('data-theme') || (mq && mq.matches ? 'light' : 'dark');
  const paintThemeBtn = () => { themeBtn.setAttribute('aria-label', effTheme() === 'dark' ? 'Passer au thème clair' : 'Passer au thème sombre'); };
  themeBtn.addEventListener('click', () => {
    const next = effTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    store.set('theme', next);
    paintThemeBtn();
  });
  if (mq && mq.addEventListener) mq.addEventListener('change', paintThemeBtn);
  paintThemeBtn();

  window.addEventListener('hashchange', () => render(false));
  render(false);
})();
