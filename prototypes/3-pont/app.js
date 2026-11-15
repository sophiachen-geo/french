/* Prototype 3 · Pont d'idées — deux idées, un pont, une phrase. */
(function () {
  'use strict';

  const C = window.CADRES, S = window.SITE, M = S.meta, V = window.VIZ, P = window.PONT;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = C.esc;
  const other = id => (id === 'a' ? 'b' : 'a');

  const ESS = {};
  M.essentiels.forEach(e => { ESS[e.tab] = e; });
  const REL = {};
  P.rels.forEach(r => { REL[r.id] = r; });
  const TAB_REL = {};
  P.rels.forEach(r => { TAB_REL[r.tab] = r.id; });

  /* ---------- Stockage (toujours protégé) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('pont3:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('pont3:' + k, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } }
  };
  const reduceMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Typographie ---------- */
  const typo = s => String(s).replace(/'/g, '’').replace(/ ([?!;:»])/g, ' $1').replace(/« /g, '« ');
  const plain = s => typo(String(s).replace(/[<>{}[\]~]/g, ''));
  /* *italique* → em, **gras** → strong (après échappement) */
  const md = s => esc(typo(s)).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');

  /* ---------- Icônes (SVG en ligne) ---------- */
  const IC = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10"/><path d="M10 20v-5.5h4V20"/>',
    work: '<rect x="3" y="7.5" width="18" height="12.5" rx="2"/><path d="M8.5 7.5V5.5a1.5 1.5 0 0 1 1.5-1.5h4a1.5 1.5 0 0 1 1.5 1.5v2M3 13h18"/>',
    metro: '<rect x="5.5" y="3" width="13" height="14" rx="3"/><path d="M5.5 10.5h13M8.5 21l2-4M15.5 21l-2-4"/><path d="M9 14h.01M15 14h.01"/>',
    book: '<path d="M12 6.5C10 5 7 4.5 4 5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5Z"/><path d="M12 6.5v13"/>',
    snow: '<path d="M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8l16.4-9.6"/><path d="m9.5 4.5 2.5 2 2.5-2M9.5 19.5l2.5-2 2.5 2"/>',
    temps: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    cause: '<circle cx="6" cy="12" r="3"/><path d="M10.5 12H20M16.5 8.5 20 12l-3.5 3.5"/>',
    consequence: '<path d="M3 12h10.5M10 8.5l3.5 3.5-3.5 3.5"/><circle cx="18.5" cy="12" r="3"/>',
    but: '<path d="M6 21V3.5"/><path d="M6 4h11l-2.5 4L17 12H6"/>',
    condition: '<path d="M12 2.8 21.2 12 12 21.2 2.8 12Z"/><path d="M10 10a2 2 0 1 1 2.6 1.9c-.4.1-.6.5-.6.9v.4M12 16h.01"/>',
    concession: '<path d="M2.5 18c3-9.5 16-9.5 19 0"/><path d="M10.5 21v-9h3v9"/>',
    precision: '<circle cx="10" cy="10" r="6"/><path d="m14.5 14.5 6 6"/>',
    flip: '<path d="M4 8h13l-3.5-3.5M20 16H7l3.5 3.5"/>',
    sound: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.8"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    theme: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17A8.5 8.5 0 0 0 12 3.5Z" fill="currentColor"/>'
  };
  const icon = (n, cls) => `<svg class="ic${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${IC[n] || ''}</svg>`;

  /* ---------- État ---------- */
  const DEF = { pair: 'logement', chip: 'parce-que', flipped: false, practice: false };
  let st = Object.assign({}, DEF, store.get('state', {}));
  const pairOf = id => P.pairs.find(p => p.id === id) || P.pairs[0];
  const chipOf = (p, id) => p.links.find(c => c.id === id) || null;
  function validate() {
    const p = pairOf(st.pair);
    st.pair = p.id;
    if (!chipOf(p, st.chip)) { st.chip = p.links[0].id; st.flipped = false; }
    const c = chipOf(p, st.chip);
    if (st.flipped && (!c.flip || typeof c.flip !== 'object')) st.flipped = false;
  }
  validate();
  const save = () => store.set('state', { pair: st.pair, chip: st.chip, flipped: st.flipped });

  /* Idées résolues pour un pont (pont > relation > paire ; un pont retourné hérite du pont parent). */
  function ideasFor(p, c, parent) {
    if (parent) {
      const base = ideasFor(p, parent);
      return { a: c.a || base.a, b: c.b || base.b };
    }
    const r = (p.ideas && p.ideas[c.rel]) || {};
    return { a: c.a || r.a || p.a, b: c.b || r.b || p.b };
  }
  function resolve(p, c, parent) {
    return Object.assign({}, c, {
      parent: parent || null,
      ideas: ideasFor(p, c, parent),
      id: parent ? parent.id + '~flip' : c.id
    });
  }
  function current() {
    const p = pairOf(st.pair), c = chipOf(p, st.chip);
    if (st.flipped && c.flip && typeof c.flip === 'object') return resolve(p, c.flip, c);
    return resolve(p, c);
  }
  /* Le pont « retourné » du pont courant. */
  function flipOf(cur) {
    const p = pairOf(st.pair);
    if (cur.parent) return { cur: resolve(p, cur.parent), fn: cur.fn, back: true };
    if (!cur.flip) return null;
    if (typeof cur.flip === 'object') return { cur: resolve(p, cur.flip, chipOf(p, cur.id)), fn: cur.flip.fn };
    const t = chipOf(p, cur.flip);
    return t ? { cur: resolve(p, t), fn: cur.fn, chip: t.id } : null;
  }

  /* ---------- Liens vers le site complet ---------- */
  function itemLink(cur) {
    const rel = REL[cur.rel];
    const key = cur.k || cur.e.replace(/\s*\(.*\)$/, '');
    const it = C.findItem(key, rel.tab) || C.findItem(key);
    return it ? C.siteLink(C.itemHref(it)) : C.siteLink('#onglet-' + rel.tab);
  }

  /* ---------- Phrase balisée → HTML ---------- */
  function sentenceHTML(raw) {
    let out = '', buf = '';
    const f = { cadre: false, conn: false, chg: false, neutral: false };
    const flush = () => {
      if (!buf) return;
      const cls = [f.neutral ? 'seg-n' : f.cadre ? 'seg-c' : 'seg-m'];
      if (f.conn) cls.push('w-conn');
      if (f.conn && /'$/.test(buf)) cls.push('w-el');
      if (f.chg) cls.push('w-chg');
      out += `<span class="${cls.join(' ')}">${esc(typo(buf))}</span>`;
      buf = '';
    };
    for (const ch of raw) {
      if (ch === '<') { flush(); f.cadre = true; }
      else if (ch === '>') { flush(); f.cadre = false; }
      else if (ch === '{') { flush(); f.conn = true; }
      else if (ch === '}') { flush(); f.conn = false; }
      else if (ch === '[') { flush(); f.chg = true; }
      else if (ch === ']') { flush(); f.chg = false; }
      else if (ch === '~') { flush(); f.neutral = !f.neutral; }
      else buf += ch;
    }
    flush();
    return out;
  }

  const modeOf = cur => cur.m || 'ind';
  const tagOf = cur => cur.tag || P.modes[modeOf(cur)].label;
  const roleOf = (cur, id) => (cur.cadre === id ? 'cadre' : 'main');
  const label = (cur, id) => (cur.ds && cur.ds[id]) || cur.ideas[id].s;

  /* ---------- Schéma de LA phrase (VIZ, construit à la volée) ---------- */
  const RANGE = { passe: [4, 44], present: [10, 90], futur: [56, 96] };
  function phraseSpec(cur) {
    const v = cur.v || {}, k = v.k;
    const cId = cur.cadre, mId = other(cId);
    const col = id => roleOf(cur, id);
    const lab = id => label(cur, id);
    const legend = [['cadre', 'cadre · ' + lab(cId)], ['main', 'principale · ' + lab(mId)]];
    const row = { label: typo(cur.e), sub: typo(cur.note || REL[cur.rel].label.toLowerCase()), marks: [] };
    const mk = row.marks;
    const spec = { rows: [row], legend };
    const L = cur.first || 'a', R = other(L);
    const txt = (x, t, dy, c, anchor) => mk.push({ k: 'text', x, text: typo(t), dy, c, anchor });

    if (['cause', 'tellement', 'trop', 'but', 'wall', 'rel', 'two'].includes(k)) spec.flow = true;

    switch (k) {
      case 'cause': {
        const cz = v.cz;
        mk.push({ k: 'box', x1: 0, x2: 43, c: col(L), text: typo(lab(L)) }, { k: 'box', x1: 57, x2: 100, c: col(R), text: typo(lab(R)) });
        if (v.sign) mk.push({ k: 'sign', x: 50, text: v.sign });
        else mk.push(cz === L ? { k: 'arrow', x1: 45, x2: 55, c: 'cadre' } : { k: 'arrow', x1: 55, x2: 45, c: 'cadre' });
        txt(21.5, cz === L ? 'cause' : 'effet', 14, 'muted');
        txt(78.5, cz === R ? 'cause' : 'effet', 14, 'muted');
        break;
      }
      case 'tellement': {
        const cz = v.cz, ef = other(cz);
        mk.push({ k: 'box', x1: 0, x2: 43, c: col(cz), text: typo(lab(cz)) }, { k: 'arrow', x1: 45, x2: 55, c: 'cadre' },
          { k: 'box', x1: 57, x2: 100, c: col(ef), text: typo(lab(ef)) });
        txt(21.5, 'tellement…', -11, 'muted');
        txt(78.5, 'que…', -11, 'muted');
        break;
      }
      case 'trop':
        mk.push({ k: 'bar', x1: 0, x2: 54, c: col('a') }, { k: 'tick', x: 38, c: 'muted' },
          { k: 'box', x1: 62, x2: 100, c: col('b'), text: typo(lab('b')), cross: true });
        txt(38, 'limite', -11, 'muted');
        txt(18, lab('a'), 13, col('a'));
        break;
      case 'but': {
        const g = v.goal, act = other(g);
        mk.push({ k: 'box', x1: 0, x2: 37, c: col(act), text: typo(lab(act)) }, { k: 'arrow', x1: 39, x2: 48, c: 'cadre' },
          { k: 'box', x1: 50, x2: 90, c: col(g), text: typo(lab(g)), dashed: true },
          v.neg ? { k: 'flag', x: 95, c: 'neg', cross: true } : { k: 'flag', x: 95, c: col(g) });
        if (v.who) txt(70, v.who, -11, 'muted');
        txt(18.5, 'action', 14, 'muted');
        txt(70, v.neg ? 'à éviter' : 'but visé', 14, 'muted');
        break;
      }
      case 'wall': {
        const o = v.obs, ps = other(o);
        mk.push({ k: 'arrow', x1: 2, x2: 98, c: col(ps) }, { k: 'wall', x: 50, c: col(o), text: typo(lab(o)) });
        txt(98, lab(ps), 13, col(ps), 'end');
        txt(2, 'obstacle →', 13, 'muted', 'start');
        break;
      }
      case 'rel':
        mk.push({ k: 'box', x1: 0, x2: 33, c: col(other(cId)), text: typo(v.n) }, { k: 'line', x1: 33, x2: 36, c: 'muted' },
          { k: 'box', x1: 36, x2: 100, c: 'cadre', text: typo(v.r) });
        txt(16.5, 'le nom', 14, 'muted');
        txt(68, 'ce qu’on en dit', 14, 'muted');
        break;
      case 'two':
        mk.push({ k: 'box', x1: 0, x2: 45, c: col(L), text: typo(lab(L)) }, { k: 'box', x1: 49, x2: 100, c: col(R), text: typo(lab(R)) });
        txt(47, '.', 3, 'muted');
        txt(47, 'deux phrases, pas de pont', 14, 'muted');
        break;

      /* --- Temps : deux couloirs sur l'axe passé / aujourd'hui / futur --- */
      case 'depuis': case 'avant': case 'apres': case 'des': case 'tant': case 'jusqua': {
        spec.lanes = 2;
        spec.axis = { today: 50 };
        const [lo, hi] = RANGE[v.when || 'passe'], sp = hi - lo;
        const at = f => +(lo + sp * f).toFixed(1);
        const lc = (x, t, anchor) => txt(x, t, -8, 'cadre', anchor);           // couloir du haut (cadre)
        const lm = (x, t, anchor) => mk.push({ k: 'text', x, text: typo(t), dy: 12, c: 'main', anchor, lane: 1 });
        if (k === 'depuis') {
          mk.push({ k: 'point', x: 22, c: 'cadre', lane: 0 }, { k: 'arrow', x1: 22, x2: 84, lane: 1 });
          lc(22, lab(cId)); lm(53, lab(mId), 'start');
        } else if (k === 'avant') {
          mk.push({ k: 'bar', x1: lo, x2: at(.44), lane: 1 }, { k: 'bar', x1: at(.58), x2: hi, c: 'cadre', lane: 0 });
          lm(at(.22), lab(mId)); lc(at(.79), lab(cId));
        } else if (k === 'apres') {
          mk.push({ k: 'bar', x1: lo, x2: at(.42), c: 'cadre', lane: 0 }, { k: 'bar', x1: at(.56), x2: hi, lane: 1 });
          lc(at(.21), lab(cId)); lm(at(.78), lab(mId));
        } else if (k === 'des') {
          mk.push({ k: 'point', x: at(.1), c: 'cadre', lane: 0 }, { k: 'bar', x1: at(.18), x2: hi, lane: 1 });
          lc(at(.1), lab(cId), 'start'); lm(at(.59), lab(mId));
        } else if (k === 'tant') {
          mk.push({ k: 'bar', x1: lo, x2: at(.86), c: 'cadre', lane: 0 }, { k: 'bar', x1: lo, x2: at(.86), lane: 1 },
            { k: 'tick', x: at(.9), c: 'muted', lane: 0 }, { k: 'tick', x: at(.9), c: 'muted', lane: 1 });
          lc(at(.43), lab(cId)); lm(at(.43), lab(mId));
        } else if (k === 'jusqua') {
          mk.push({ k: 'bar', x1: lo, x2: at(.74), lane: 1 }, { k: 'point', x: at(.8), c: 'cadre', lane: 0 });
          lm(at(.37), lab(mId)); lc(at(.8), lab(cId));
        }
        break;
      }

      /* --- Condition : une ligne sur l'axe du temps --- */
      case 'si-reel':
        spec.axis = { today: 50 };
        mk.push({ k: 'point', x: 62, c: 'cadre' }, { k: 'arrow', x1: 66, x2: 94 });
        txt(62, lab(cId), -9, 'cadre');
        txt(80, lab(mId), 13, 'main');
        break;
      case 'si-imag':
        spec.axis = { today: 50 };
        mk.push({ k: 'bar', x1: 44, x2: 58, c: 'cadre', dashed: true }, { k: 'arrow', x1: 61, x2: 92, dashed: true });
        txt(51, lab(cId), -9, 'cadre');
        txt(77, lab(mId), 13, 'main');
        break;
      case 'si-pqp':
        spec.axis = { today: 50 };
        mk.push({ k: 'bar', x1: 4, x2: 18, c: 'cadre', dashed: true }, { k: 'arrow', x1: 21, x2: 44, dashed: true }, { k: 'cross', x: 33 });
        txt(2, lab(cId), -9, 'cadre', 'start');
        txt(33, lab(mId), 13, 'main');
        break;
      case 'cas':
        spec.axis = { today: 50 };
        mk.push({ k: 'bar', x1: 40, x2: 56 }, { k: 'point', x: 80, c: 'cadre', fill: 'open', dashed: true });
        txt(80, '?', -9, 'cadre');
        txt(48, lab(mId), -9, 'main');
        txt(80, lab(cId), 13, 'cadre');
        break;
      case 'condition':
        spec.axis = { today: 50 };
        mk.push({ k: 'arrow', x1: 52, x2: 94 }, { k: 'wall', x: 64, c: 'cadre', text: typo(lab(cId)) });
        txt(94, lab(mId), 13, 'main', 'end');
        break;
      default:
        break;
    }
    return spec;
  }
  const vizPhrase = cur => V.render(phraseSpec(cur), { examples: false, title: false });

  /* Ligne du schéma général (content/visuels.js) pour comparer. */
  function genericSpec(cur) {
    const [id, pre] = cur.gen || [];
    const spec = id && V.byId(id);
    if (!spec || !spec.rows) return null;
    const row = spec.rows.find(r => C.norm(r.label).startsWith(C.norm(pre)));
    if (!row) return null;
    return { spec: Object.assign({}, spec, { id: null, rows: [row] }), tab: spec.tab, title: spec.title };
  }

  /* ---------- Le pont (SVG dessiné à la main) ---------- */
  function logicOf(cur) {
    const v = cur.v || {}, c = cur.cadre, m = other(c);
    switch (v.k) {
      case 'cause': case 'tellement': return { from: v.cz, t1: 'cause', t2: 'effet' };
      case 'trop': return { from: 'a', t1: 'trop…', t2: 'impossible' };
      case 'but': return { from: other(v.goal), t1: 'action', t2: v.neg ? 'à éviter' : 'but' };
      case 'wall': return { from: v.obs, t1: 'obstacle', t2: 'quand même' };
      case 'rel': return { from: c, t1: 'détail', t2: 'nom' };
      case 'two': return null;
      case 'avant': case 'jusqua': return { from: m, t1: 'avant', t2: 'après' };
      case 'apres': case 'depuis': case 'des': return { from: c, t1: 'avant', t2: 'après' };
      case 'tant': return { from: 'both', t1: 'en même temps', t2: 'en même temps' };
      case 'cas': return { from: m, t1: 'précaution', t2: 'au cas où' };
      default: return { from: c, t1: 'si…', t2: 'alors' };
    }
  }

  function bridgeSVG(cur, W) {
    W = Math.max(280, Math.round(W));
    const H = 176;
    const ab = Math.round(Math.max(30, Math.min(46, W * 0.085)));
    const L = ab, R = W - ab, mid = W / 2;
    const dY = 102, dH = 10;            // tablier
    const railY = dY - 15;
    const k = (cur.v || {}).k, rel = cur.rel;
    const roleA = roleOf(cur, 'a'), roleB = roleOf(cur, 'b');
    const lg = logicOf(cur);
    let g = '';

    /* eau et culées */
    let wave = `M0 ${H - 9}`;
    for (let x = 0; x + 24 <= W; x += 24) wave += ` q6 -5 12 0 t12 0`;
    g += `<path class="br-water" d="${wave}"/>`;
    g += `<rect class="br-abut" x="0" y="${dY}" width="${ab}" height="${H - dY}"/><rect class="br-abut" x="${R}" y="${dY}" width="${ab}" height="${H - dY}"/>`;

    /* arche + suspentes */
    const y0 = H - 16, cy = 66;
    const archY = x => { const t = (x - L) / (R - L); return (1 - t) * (1 - t) * y0 + 2 * t * (1 - t) * cy + t * t * y0; };
    const broken = k === 'two';
    g += `<path class="br-arch${broken ? ' br-dash' : ''}" d="M${L} ${y0} Q${mid} ${cy} ${R} ${y0}"/>`;
    const n = Math.max(6, Math.round((R - L) / 34));
    for (let i = 1; i < n; i++) {
      const x = +(L + (R - L) * i / n).toFixed(1);
      if (broken && Math.abs(x - mid) < 30) continue;
      g += `<line class="br-hang" x1="${x}" x2="${x}" y1="${(archY(x)).toFixed(1)}" y2="${dY + dH}"/>`;
    }

    /* tablier en deux moitiés : côté A et côté B, couleur selon le rôle */
    const half = (side, role) => {
      const x1 = side === 'a' ? L : mid, x2 = side === 'a' ? mid : R;
      const gx1 = broken && side === 'b' ? mid + 26 : x1, gx2 = broken && side === 'a' ? mid - 26 : x2;
      let s = `<rect class="br-deck d-${role}" x="${gx1}" y="${dY}" width="${gx2 - gx1}" height="${dH}"/>`;
      s += `<line class="br-rail" x1="${gx1}" x2="${gx2}" y1="${railY}" y2="${railY}"/>`;
      for (let x = gx1 + 9; x < gx2 - 4; x += 18) s += `<line class="br-post" x1="${x}" x2="${x}" y1="${railY}" y2="${dY}"/>`;
      return s;
    };
    const condK = ['si-reel', 'si-imag', 'si-pqp', 'cas', 'condition'];
    const raise = condK.includes(k) ? (k === 'si-reel' || k === 'condition' ? -9 : k === 'cas' ? -6 : -15) : 0;
    const raisedSide = roleA === 'main' ? 'a' : 'b';            // pont-levis : la moitié « principale » se lève
    ['a', 'b'].forEach(side => {
      const role = side === 'a' ? roleA : roleB;
      const piv = side === 'a' ? `${L} ${dY + dH}` : `${R} ${dY + dH}`;
      const ang = raise && side === raisedSide ? (side === 'a' ? raise : -raise) : 0;
      g += ang ? `<g class="br-leaf${k !== 'si-reel' && k !== 'condition' ? ' br-dashg' : ''}" transform="rotate(${ang} ${piv})">${half(side, role)}</g>` : half(side, role);
    });
    if (raise) g += `<circle class="br-q" cx="${mid}" cy="${dY + dH + 12}" r="9"/><text class="br-qt" x="${mid}" y="${dY + dH + 16}" text-anchor="middle">?</text>`;
    if (k === 'si-pqp') g += `<path class="br-x" d="M${mid - 10} ${dY - 38} l20 20 M${mid + 10} ${dY - 38} l-20 20"/>`;
    if (broken) g += `<path class="br-x" d="M${mid - 8} ${dY - 4} l16 16 M${mid + 8} ${dY - 4} l-16 16"/>`;

    /* ornements par relation */
    if (rel === 'temps') {
      for (let x = L + 6; x < R - 2; x += 12) g += `<line class="br-tick" x1="${x}" x2="${x}" y1="${dY + dH}" y2="${dY + dH + ((Math.round((x - L) / 12) % 4) ? 3 : 6)}"/>`;
    }
    const arrowY = dY - 40;
    if (lg) {
      const tailLeft = lg.from === 'a';
      const x1 = tailLeft ? L + 12 : R - 12, x2 = tailLeft ? R - 12 : L + 12;
      if (k === 'wall') {
        const obsRole = roleOf(cur, (cur.v || {}).obs);
        g += `<rect class="br-wall w-${obsRole}" x="${mid - 5}" y="${dY - 34}" width="10" height="34" rx="1.5"/>`;
        g += `<path class="br-logic" d="M${x1} ${arrowY + 8} Q${mid} ${arrowY - 44} ${x2} ${arrowY + 8}" marker-end="url(#br-head)"/>`;
      } else if (lg.from === 'both') {
        g += `<line class="br-logic" x1="${L + 12}" x2="${R - 12}" y1="${arrowY}" y2="${arrowY}" marker-end="url(#br-head)" marker-start="url(#br-head-s)"/>`;
      } else {
        g += `<line class="br-logic${k === 'si-imag' || k === 'si-pqp' ? ' br-dash' : ''}" x1="${x1}" x2="${x2}" y1="${arrowY}" y2="${arrowY}" marker-end="url(#br-head)"/>`;
      }
      const ly = k === 'wall' ? arrowY + 22 : arrowY - 7;
      if (lg.from === 'both') {
        g += `<text class="br-lab" x="${mid}" y="${arrowY - 7}" text-anchor="middle">${esc(lg.t1)}</text>`;
      } else {
        g += `<text class="br-lab" x="${x1}" y="${ly}" text-anchor="${tailLeft ? 'start' : 'end'}">${esc(lg.t1)}</text>`;
        g += `<text class="br-lab" x="${x2}" y="${ly}" text-anchor="${tailLeft ? 'end' : 'start'}">${esc(lg.t2)}</text>`;
      }
      if (k === 'but') {
        const fx = tailLeft ? W - ab / 2 : ab / 2, d = tailLeft ? -1 : 1;
        g += `<line class="br-pole" x1="${fx}" x2="${fx}" y1="${dY}" y2="${dY - 50}"/><path class="br-flag${(cur.v || {}).neg ? ' f-neg' : ''}" d="M${fx} ${dY - 50} l${15 * d} 6 l${-15 * d} 6 Z"/>`;
        if ((cur.v || {}).neg) g += `<path class="br-x" d="M${fx + 7 * d - 9} ${dY - 52} l18 18 M${fx + 7 * d + 9} ${dY - 52} l-18 18"/>`;
      }
      if (k === 'rel') {
        const nx = tailLeft ? R - 22 : L + 22;
        g += `<circle class="br-loupe" cx="${nx}" cy="${dY - 58}" r="8"/><line class="br-loupe" x1="${nx + 6}" y1="${dY - 52}" x2="${nx + 11}" y2="${dY - 47}"/>`;
      }
    } else if (broken) {
      g += `<text class="br-lab" x="${mid}" y="${arrowY}" text-anchor="middle">pas de pont : deux phrases</text>`;
    }

    /* ordre dans la phrase : ① ② sur les culées */
    const ord = side => (cur.first === side ? 1 : 2);
    [['a', ab / 2], ['b', W - ab / 2]].forEach(([side, x]) => {
      g += `<circle class="br-ord" cx="${x}" cy="${dY + 30}" r="10"/><text class="br-ordt" x="${x}" y="${dY + 34.5}" text-anchor="middle">${ord(side)}</text>`;
      g += `<text class="br-side" x="${x}" y="${dY + 56}" text-anchor="middle">${side.toUpperCase()}</text>`;
    });

    const defs = `<defs><pattern id="br-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" class="br-hl"/></pattern>
      <marker id="br-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" class="br-mk"/></marker>
      <marker id="br-head-s" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" class="br-mk"/></marker></defs>`;
    const aria = `Pont entre l’idée A et l’idée B. Le pont « ${plain(cur.e)} » s’accroche à l’idée ${cur.cadre.toUpperCase()}.${lg && lg.from !== 'both' ? ` Sens : ${lg.t1} (${lg.from.toUpperCase()}) vers ${lg.t2} (${other(lg.from).toUpperCase()}).` : ''}`;
    return `<svg class="br-svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(aria)}">${defs}${g}</svg>`;
  }

  /* ---------- Rendu des zones ---------- */
  function renderPairs() {
    $('#pairs').innerHTML = P.pairs.map(p => `<button type="button" class="pair" data-pair="${p.id}" aria-pressed="${p.id === st.pair}">
      ${icon(p.icon)}<span class="pair-t">${esc(p.theme)}</span><span class="pair-s">${esc(typo(p.a.t.replace(/\.$/, '')))}…</span>${p.demo ? '<span class="pair-d" title="L’exemple « J’ai déménagé » du site complet"><span class="pd-l">exemple du </span>site</span>' : ''}</button>`).join('');
  }

  function cardHTML(cur, side) {
    const p = pairOf(st.pair);
    const idea = cur.ideas[side];
    const role = roleOf(cur, side);
    const variant = idea.t !== p[side].t;
    const ord = cur.first === side ? '1<sup>re</sup> dans la phrase' : '2<sup>e</sup> dans la phrase';
    return `<article class="card r-${role}" aria-label="Idée ${side.toUpperCase()}">
      <header class="card-h"><span class="card-k">${side.toUpperCase()}${variant ? '′' : ''}</span><span class="card-r">${role === 'cadre' ? `cadre · introduite par « ${esc(typo(cur.e))} »` : 'phrase principale'}</span></header>
      <p class="card-t">${esc(typo(idea.t))}</p>
      <p class="card-f"><span>${ord}</span>${variant ? `<span class="card-v" title="Idée de départ : ${esc(typo(p[side].t))}">${side.toUpperCase()}′ = variante pour ce lien</span>` : ''}</p>
    </article>`;
  }

  function renderBench(cur, animate) {
    $('#card-a').innerHTML = cardHTML(cur, 'a');
    $('#card-b').innerHTML = cardHTML(cur, 'b');
    const box = $('#bridge');
    const W = box.clientWidth || 340;
    box.querySelector('.br-draw').innerHTML = bridgeSVG(cur, W);
    const m = modeOf(cur);
    box.querySelector('.br-label').innerHTML = `<span class="br-chip m-${m}"><b>${esc(typo(cur.e))}</b><i>${esc(typo(tagOf(cur)))}</i></span>`;
    const rel = REL[cur.rel];
    $('#titleblock').innerHTML = `<span>relation <b>${esc(rel.label)}</b></span><span>mode <b>${esc(typo(tagOf(cur)))}</b></span><span>onglet <b>${rel.tab}</b></span>`;
    if (animate && !reduceMotion()) {
      box.classList.remove('is-new'); void box.offsetWidth; box.classList.add('is-new');
    }
  }

  function renderRels(cur) {
    const p = pairOf(st.pair);
    $('#rels').innerHTML = P.rels.map(r => {
      const n = p.links.filter(c => c.rel === r.id).length;
      const on = r.id === cur.rel || (cur.parent && cur.parent.rel === r.id && r.id === cur.rel);
      return `<button type="button" class="rel" data-rel="${r.id}" aria-pressed="${r.id === (cur.parent ? cur.parent.rel : cur.rel)}"${n ? '' : ' disabled'}>
        ${icon(r.id)}<span class="rel-t">${esc(r.label)}</span><span class="rel-q">${esc(typo('« ' + r.q + ' »'))} <span class="rel-n">· ${n}&nbsp;pont${n > 1 ? 's' : ''}</span></span></button>`;
    }).join('');
    const relId = cur.parent ? cur.parent.rel : cur.rel;
    const e = ESS[REL[relId].tab];
    $('#rel-hint').innerHTML = e ? `<b>${esc(typo(e.je))}.</b> ${esc(typo(e.quand))}` : '';
  }

  function renderChips(cur) {
    const p = pairOf(st.pair);
    const relId = cur.parent ? cur.parent.rel : cur.rel;
    const chips = p.links.filter(c => c.rel === relId);
    $('#chips-title').textContent = REL[relId].label;
    $('#chips').innerHTML = chips.map(c => {
      const on = c.id === st.chip;
      return `<button type="button" class="chip m-${c.m}" data-chip="${c.id}" aria-pressed="${on}">
        <span class="chip-e">${esc(typo(c.e))}</span><span class="chip-m">${esc(typo(c.tag || P.modes[c.m].label))}</span>${c.reg ? `<span class="chip-r" title="${c.reg === 'F-QC' ? 'Familier québécois' : 'Surtout à l’oral'}">${c.reg === 'F-QC' ? 'QC' : 'oral'}</span>` : ''}${c.demo ? '<span class="chip-d" title="Phrase de l’exemple « J’ai déménagé » du site">ex. du site</span>' : ''}</button>`;
    }).join('');
  }

  function changesHTML(cur) {
    const m = modeOf(cur);
    if (!cur.ch || !cur.ch.length) {
      return `<p class="chg-none">${icon('link')} Rien ne change : les deux idées gardent leur verbe tel quel (${m === 'ind' ? 'indicatif' : esc(P.modes[m].long)}).</p>`;
    }
    return `<ul class="chg">${cur.ch.map(([f, t, w]) => `<li><span class="chg-f">${esc(typo(f))}</span><span class="chg-a" aria-hidden="true">→</span><span class="chg-t">${esc(typo(t))}</span><span class="chg-w">${esc(typo(w))}</span></li>`).join('')}</ul>`;
  }

  function renderPhrase(cur, animate) {
    const rel = REL[cur.rel];
    const e = ESS[rel.tab];
    const m = modeOf(cur);
    const box = $('#phrase');
    box.className = 'panel phrase m-' + m + (st.practice ? ' is-practice' : '');
    $('#ph-meta').innerHTML = `<span class="tag t-rel">${icon(cur.rel)}${esc(rel.label)}</span><span class="tag m-${m}">${esc(typo(tagOf(cur)))}</span>${cur.reg ? `<span class="tag t-reg">${cur.reg === 'F-QC' ? 'familier québécois' : 'oral'}</span>` : ''}${cur.parent ? '<span class="tag t-flip">pont retourné</span>' : ''}`;
    $('#ph-ask').innerHTML = `<span class="ask-k mono">On te demande</span><span class="bubble">${esc(typo(rel.q))}</span><span class="ask-l">Tu réponds avec <b>${esc(typo(cur.e))}</b> :</span>`;
    $('#ph-text').innerHTML = sentenceHTML(cur.s);
    $('#ph-text').setAttribute('aria-label', plain(cur.s));
    $('#ph-hide').innerHTML = `<span>Dis la phrase à voix haute avec «\u202F<b>${esc(typo(cur.e))}</b>\u202F», puis touche ici pour vérifier.</span>`;
    $('#ph-chg').innerHTML = changesHTML(cur);
    $('#ph-relance').innerHTML = e ? `<span class="rl-k">Pour continuer la conversation</span> <q>${esc(typo(e.relance))}</q>` : '';
    $('#btn-practice').setAttribute('aria-pressed', String(!!st.practice));
    $('#btn-practice').querySelector('span').textContent = st.practice ? 'Montrer la phrase' : 'M’exercer (cacher)';
    $('#dock-text').innerHTML = `<b class="dock-c">${esc(typo(cur.e))}</b> ${esc(plain(cur.s))}`;
    if (animate && !reduceMotion()) { $('#ph-text').classList.remove('pop'); void $('#ph-text').offsetWidth; $('#ph-text').classList.add('pop'); }
  }

  function renderViz(cur) {
    $('#viz-mine').innerHTML = vizPhrase(cur);
    const g = genericSpec(cur);
    const rel = REL[cur.rel];
    if (g) {
      $('#viz-gen-h').innerHTML = `Le modèle général <span class="mono">· onglet ${g.tab}</span> <a class="lnk" href="${esc(C.siteLink('#onglet-' + g.tab))}">voir l’onglet ${icon('link')}</a>`;
      $('#viz-gen').innerHTML = `<p class="gen-title">${esc(typo(g.title))}</p>` + V.render(g.spec, { examples: true, title: false });
    } else {
      $('#viz-gen-h').innerHTML = `Le modèle général <span class="mono">· onglet ${rel.tab}</span>`;
      $('#viz-gen').innerHTML = '<p class="muted">Pas de schéma général pour ce pont.</p>';
    }
  }

  function renderFlip(cur) {
    const f = flipOf(cur);
    const box = $('#flip');
    if (!f) { box.hidden = true; return; }
    box.hidden = false;
    const t = f.cur;
    const relChange = t.rel !== cur.rel;
    $('#flip-note').innerHTML = `${md(f.fn || '')}${relChange ? ` <span class="tag t-rel">${icon(cur.rel)}${esc(REL[cur.rel].short || REL[cur.rel].label)} <span aria-hidden="true">⇄</span> ${esc(REL[t.rel].short || REL[t.rel].label)}</span>` : ''}`;
    $('#flip-now').innerHTML = `<p class="fl-k">Maintenant · <b>${esc(typo(cur.e))}</b></p><p class="fl-s">${sentenceHTML(cur.s)}</p>${vizPhrase(cur)}`;
    $('#flip-then').innerHTML = `<p class="fl-k">Retourné · <b>${esc(typo(t.e))}</b></p><p class="fl-s">${sentenceHTML(t.s)}</p>${vizPhrase(t)}`;
    $('#btn-flip').querySelector('span').textContent = f.back ? `Revenir à « ${typo(t.e)} »` : `Retourner le pont : « ${typo(t.e)} »`;
  }

  function renderRule(cur) {
    const r = P.rules[cur.rule || (cur.parent && cur.parent.rule)] || null;
    const rel = REL[cur.rel];
    const m = r ? r.m : modeOf(cur);
    let h = '';
    if (r) {
      h += `<h3 class="rule-t"><span class="tag m-${m}">${esc(P.modes[m].label)}</span> ${md(r.t)}</h3><p class="rule-d">${md(r.d)}</p>`;
    } else {
      h += `<h3 class="rule-t"><span class="tag m-${m}">${esc(P.modes[m].label)}</span> ${esc(typo(cur.e))}</h3><p class="rule-d">${esc(typo(P.modes[m].long))}.</p>`;
    }
    /* Échelle : nom → infinitif → proposition (content/visuels.js « structures ») */
    const st3 = V.byId('structures');
    const theme = { temps: 'Temps', cause: 'Cause', but: 'But', concession: 'Concession', condition: 'Condition' }[cur.rel];
    const row = st3 && theme && st3.rows.find(x => x.theme === theme);
    if (row) {
      const kinds = ['nom', 'inf', 'ind'];
      h += `<div class="ladder" role="group" aria-label="Une relation, trois structures"><p class="ladder-h">Une relation, trois structures <span class="mono">(${esc(theme.toLowerCase())})</span></p>
        ${row.cells.map((c, i) => `<div class="lad m-${kinds[i]}${modeOf(cur) === kinds[i] || (i === 2 && ['subj', 'cond'].includes(modeOf(cur))) ? ' is-on' : ''}"><span class="lad-k">${esc(st3.cols[i])}</span><span class="lad-bar" style="--w:${40 + i * 30}%"><span>${esc(typo(c))}</span></span></div>`).join('')}
        <p class="ladder-f">Plus la structure est longue, plus elle dit de choses (qui ? quand ?).</p></div>`;
    }
    const ruleLink = r ? C.siteLink(r.link) : C.siteLink('#regles');
    h += `<p class="rule-links"><a class="lnk" href="${esc(itemLink(cur))}">« ${esc(typo(cur.e))} » dans l’onglet ${rel.tab} ${icon('link')}</a><a class="lnk" href="${esc(ruleLink)}">La règle complète ${icon('link')}</a></p>`;
    $('#rule').innerHTML = h;
  }

  /* ---------- Carte des liens entre les fonctions ---------- */
  function renderMap(cur) {
    const W = 360, H = 268, cx = W / 2, cy = H / 2 - 4, rx = 128, ry = 100;
    const order = ['temps', 'cause', 'consequence', 'but', 'condition', 'concession', 'precision'];
    const pos = {};
    order.forEach((id, i) => {
      const a = -Math.PI / 2 + i * 2 * Math.PI / order.length;
      pos[id] = [+(cx + rx * Math.cos(a)).toFixed(1), +(cy + ry * Math.sin(a)).toFixed(1)];
    });
    const relId = cur.rel;
    const f = flipOf(cur);
    const fRel = f && f.cur.rel !== relId ? f.cur.rel : null;
    let g = '';
    P.links.forEach(l => {
      const [x1, y1] = pos[l.a], [x2, y2] = pos[l.b];
      const touch = l.a === relId || l.b === relId;
      const hot = fRel && ((l.a === relId && l.b === fRel) || (l.b === relId && l.a === fRel));
      g += `<line class="mp-e${touch ? ' is-touch' : ''}${hot ? ' is-hot' : ''}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    });
    order.forEach(id => {
      const [x, y] = pos[id], r = REL[id];
      const lab = r.short || r.label;
      const w = lab.length * 7.4 + 22;
      const on = id === relId, near = P.links.some(l => (l.a === relId && l.b === id) || (l.b === relId && l.a === id));
      g += `<g class="mp-n${on ? ' is-on' : ''}${near ? ' is-near' : ''}${id === fRel ? ' is-hot' : ''}" data-rel="${id}" tabindex="-1">
        <rect x="${(x - w / 2).toFixed(1)}" y="${y - 14}" width="${w.toFixed(1)}" height="28" rx="6"/><text x="${x}" y="${y + 4.5}" text-anchor="middle">${esc(lab)}</text></g>`;
    });
    $('#map-svg').innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Carte des liens entre les relations ; la relation actuelle est ${esc(REL[relId].label)}.">${g}</svg>`;
    const mine = P.links.filter(l => l.a === relId || l.b === relId);
    $('#map-list').innerHTML = mine.length ? mine.map(l => {
      const o = l.a === relId ? l.b : l.a;
      return `<li><button type="button" class="mp-go" data-rel="${o}">${icon(o)}<span><b>${esc(REL[relId].short || REL[relId].label)} ⇄ ${esc(REL[o].short || REL[o].label)}</b> — ${esc(typo(l.t))} <span class="mono">${esc(typo(l.ex))}</span></span></button></li>`;
    }).join('') : `<li class="muted">La précision s’accroche à un nom, pas à une autre phrase : elle se combine avec tous les liens.</li>`;
    /* Enchaînements fréquents (SITE.meta.chains) */
    $('#chains').innerHTML = M.chains.map(ch => `<li>${ch.steps.map(([t, tab]) => {
      const r = TAB_REL[tab];
      return r && r !== 'precision'
        ? `<button type="button" class="cs${r === relId ? ' is-on' : ''}" data-rel="${r}">${esc(t)}</button>`
        : `<a class="cs cs-out" href="${esc(C.siteLink('#onglet-' + tab))}">${esc(t)} <span class="mono">${tab}</span></a>`;
    }).join('<span class="cs-arr" aria-hidden="true">→</span>')}</li>`).join('');
  }

  /* ---------- Rendu global ---------- */
  function render(opts) {
    opts = opts || {};
    validate();
    const cur = current();
    renderPairs();
    renderBench(cur, opts.animate);
    renderRels(cur);
    renderChips(cur);
    renderPhrase(cur, opts.animate);
    renderViz(cur);
    renderFlip(cur);
    renderRule(cur);
    renderMap(cur);
    save();
  }

  /* ---------- Actions ---------- */
  function selectRel(relId) {
    const p = pairOf(st.pair);
    const first = p.links.find(c => c.rel === relId);
    if (!first) return;
    st.chip = first.id; st.flipped = false;
    render({ animate: true });
  }
  function doFlip() {
    const cur = current();
    const f = flipOf(cur);
    if (!f) return;
    if (cur.parent) st.flipped = false;
    else if (f.chip) { st.chip = f.chip; st.flipped = false; }
    else st.flipped = true;
    const box = $('#bridge');
    render({ animate: false });
    if (!reduceMotion()) { box.classList.remove('is-flip'); void box.offsetWidth; box.classList.add('is-flip'); }
  }

  document.addEventListener('click', e => {
    const t = e.target.closest('button, [data-rel]');
    if (!t) return;
    if (t.dataset.pair) {
      if (t.dataset.pair !== st.pair) {
        const relId = current().parent ? current().parent.rel : current().rel;
        st.pair = t.dataset.pair;
        const p = pairOf(st.pair);
        const same = p.links.find(c => c.rel === relId) || p.links[0];
        st.chip = same.id; st.flipped = false;
        render({ animate: true });
      }
      return;
    }
    if (t.dataset.chip) { st.chip = t.dataset.chip; st.flipped = false; render({ animate: true }); return; }
    if (t.dataset.rel) {
      selectRel(t.dataset.rel);
      if (t.closest('#map, #chains')) { const s = $('#s-rel'); if (s) s.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' }); }
      return;
    }
    if (t.id === 'btn-flip') { doFlip(); return; }
    if (t.id === 'btn-practice') { st.practice = !st.practice; renderPhrase(current()); if (!st.practice) $('#ph-text').focus(); return; }
    if (t.closest('#ph-hide')) { st.practice = false; renderPhrase(current()); return; }
    if (t.id === 'btn-say') { speak(plain(current().s).replace(/^—\s*/, '')); return; }
    if (t.id === 'dock-go') { $('#phrase').scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' }); return; }
    if (t.id === 'theme') { cycleTheme(); return; }
  });

  /* Flèches gauche/droite dans les groupes de boutons. */
  document.addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
    const grp = e.target.closest('#pairs, #rels, #chips');
    if (!grp) return;
    const items = $$('button:not([disabled])', grp);
    const i = items.indexOf(e.target);
    if (i < 0) return;
    e.preventDefault();
    const d = e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 1;
    items[(i + d + items.length) % items.length].focus();
  });

  /* ---------- Lecture à voix haute (synthèse vocale du navigateur, si disponible) ---------- */
  function speak(text) {
    try {
      if (!('speechSynthesis' in window)) return;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'fr-CA';
      const vs = window.speechSynthesis.getVoices();
      const v = vs.find(x => x.lang === 'fr-CA') || vs.find(x => /^fr/i.test(x.lang));
      if (v) u.voice = v;
      u.rate = 0.92;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch (err) { /* pas de synthèse vocale */ }
  }

  /* ---------- Thème ---------- */
  const THEMES = ['auto', 'light', 'dark'];
  const THEME_L = { auto: 'auto', light: 'clair', dark: 'sombre' };
  let theme = store.get('theme', 'auto');
  if (!THEMES.includes(theme)) theme = 'auto';
  function applyTheme() {
    if (theme === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', theme);
    const b = $('#theme');
    if (b) { b.querySelector('span').textContent = 'Thème : ' + THEME_L[theme]; b.setAttribute('aria-label', 'Changer le thème (actuel : ' + THEME_L[theme] + ')'); }
  }
  function cycleTheme() { theme = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length]; store.set('theme', theme); applyTheme(); }

  /* ---------- Barre « ta phrase » en bas (mobile) ---------- */
  function setupDock() {
    const dock = $('#dock');
    if (!('IntersectionObserver' in window)) return;
    let phraseVisible = false;
    const upd = () => { dock.hidden = phraseVisible; document.body.classList.toggle('has-dock', !dock.hidden); };
    new IntersectionObserver(es => { es.forEach(x => { phraseVisible = x.isIntersecting; }); upd(); }, { threshold: 0.5 }).observe($('#ph-text'));
  }

  /* Redessiner le pont si la largeur change. */
  let rz = null, lastW = 0;
  window.addEventListener('resize', () => {
    clearTimeout(rz);
    rz = setTimeout(() => {
      const w = $('#bridge').clientWidth;
      if (Math.abs(w - lastW) > 4) { lastW = w; renderBench(current(), false); }
    }, 120);
  });

  applyTheme();
  if (!('speechSynthesis' in window)) { const b = $('#btn-say'); if (b) b.hidden = true; }
  render();
  lastW = $('#bridge').clientWidth;
  setupDock();
})();
