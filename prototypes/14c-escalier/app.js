/* Prototype 1 + 4 · C · « L’escalier des formes »
   Découvrir de nouvelles constructions en montant un escalier, intention par intention.
     Marche 1 « Pour commencer »      : formules essentielles (essentiels.cles) + variantes du Québec (essentiels.qc).
     Marche 2 « Pour varier »         : autres formes courantes de l'onglet (CADRES.TABS[tab].items), groupées par nuance.
     Marche 3 « Pour aller plus loin » : formes soutenues, plutôt écrites, avancées ou à reconnaître.
   La marche suivante s'« éclaire » quand assez de formes sont marquées « Je connais » (jamais verrouillée).
   Progression partagée : window.PROGRES (outil 'decouvrir'). Schémas : window.VIZ. */
(function () {
  'use strict';

  const S = window.SITE, M = S && S.meta, C = window.CADRES, V = window.VIZ, P = window.PROGRES, D = window.P14C;
  if (!S || !C || !V || !P || !D) return;

  const TOOL = 'decouvrir';
  const NEED = [3, 5];               // « Je connais » nécessaires pour éclairer la marche 2, puis la marche 3
  const STEP_NAMES = ['Pour commencer', 'Pour varier', 'Pour aller plus loin'];
  const STEP_SUBS = [
    'Les formules essentielles, et ce qu’on entend entre amis au Québec.',
    'D’autres formes courantes. Chaque groupe montre une nuance.',
    'Des formes plus riches : soutenues, surtout écrites, ou à reconnaître.'
  ];

  /* ---------- Utilitaires ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const md = s => V.md(s);
  const nbsp = s => String(s == null ? '' : s).replace(/ ([;:?!»])/g, '\u00A0$1').replace(/« /g, '«\u00A0');
  const T = s => esc(nbsp(s));
  const pk = s => P.cle(s);
  const ckey = s => C.norm(String(s).replace(/\s*\[[^\]]+\]/g, '')).replace(/^[\s.,]+/, '').replace(/[\s.;:,!?]+$/, '');
  const pad = n => String(n).padStart(2, '0');
  const uniq = a => Array.from(new Set(a));
  const reduce = () => C.reduceMotion();
  const splitAlts = e => String(e).split(/\s+\/\s+/);
  const plur = (n, one, many) => `${n} ${n > 1 ? many : one}`;

  const ESS = {};
  M.essentiels.forEach(e => { ESS[e.tab] = e; });
  const ORDER = C.TAB_IDS.filter(t => ESS[t]);

  /* ---------- Registres (couleurs du prototype « Je veux… ») ---------- */
  const LEVELS = [
    { id: 'amis', label: 'Entre amis' },
    { id: 'neutre', label: 'Neutre' },
    { id: 'formel', label: 'Formel' },
    { id: 'rec', label: 'À reconnaître' }
  ];
  const codesOf = r => (Array.isArray(r) ? r : String(r || 'C').split(/\s*,\s*/)).filter(Boolean);
  const levelOf = (codes, badge) => {
    if (codes.includes('R') || codes.includes('D')) return 3;
    if (codes.includes('S') || badge === 'ecrit' || badge === 'avance') return 2;
    if (codes.some(c => c === 'O' || c === 'QC' || c === 'F-QC')) return 0;
    return 1;
  };
  const BADGE_TXT = { ecrit: 'surtout à l’écrit', avance: 'construction avancée' };
  const regText = f => f.codes.map(c => D.regLabel[c] || c).join(' · ') + (BADGE_TXT[f.badge] ? ' · ' + BADGE_TXT[f.badge] : '');
  const meter = lvl => lvl === 3
    ? '<span class="meter m3" aria-hidden="true"><i></i></span>'
    : `<span class="meter m${lvl}" aria-hidden="true"><i></i><i></i><i></i></span>`;

  /* ---------- Schémas : la ligne qui dessine une forme ---------- */
  const rowSpecs = tab => V.forTab(tab).filter(s => !s.type || s.type === 'rows');
  const mapSpecs = tab => V.forTab(tab).filter(s => s.type === 'map');
  const cleanLabel = l => String(l).replace(/\s*\[[^\]]+\]/g, '');
  const altsOf = l => cleanLabel(l).split(/\s+\/\s+/).map(pk);
  const altPairs = l => cleanLabel(l).split(/\s+\/\s+/).map(a => { const m = a.match(/\s\+\s(.+)$/); return { k: pk(a), cons: m ? m[1] : '' }; });
  const consOk = (a, b) => !a || !b || C.consKind(a) === C.consKind(b);
  const boldKeys = r => Array.from(String((r.from || '') + ' ' + (r.to || '')).matchAll(/\*\*(.+?)\*\*/g)).map(m => pk(m[1]));

  const rekey = obj => {
    const out = {};
    Object.keys(obj || {}).forEach(t => { out[t] = {}; Object.keys(obj[t]).forEach(k => { out[t][pk(k)] = obj[t][k]; }); });
    return out;
  };
  const ALIAS = rekey(D.alias), ALIAS2 = rekey(D.alias2), CUSTOM = rekey(D.custom);
  const NODIAG = {};
  Object.keys(D.noDiag || {}).forEach(t => { NODIAG[t] = new Set(D.noDiag[t].map(pk)); });
  const FORMAL = {};
  Object.keys(D.formal || {}).forEach(t => { FORMAL[t] = {}; D.formal[t].forEach(x => { FORMAL[t][pk(x.key)] = x; }); });
  const WRITTEN = {};
  Object.keys(D.written || {}).forEach(t => { WRITTEN[t] = new Set(D.written[t].map(pk)); });
  /* Colonne « Soutenu » du schéma des registres : ces formes vont aussi sur la marche 3. */
  const REG_SPEC = V.byId('registres');
  const SOUTENU = new Set(REG_SPEC ? REG_SPEC.rows.map(r => pk(r.cells[2])) : []);

  function byLabel(tab, label) {
    for (const s of rowSpecs(tab)) { const r = s.rows.find(x => x.label === label); if (r) return { spec: s, row: r }; }
    return null;
  }
  function customFor(tab, k, label) {
    const cu = (CUSTOM[tab] || {})[k];
    if (!cu) return null;
    const base = V.byId(cu.base);
    return base ? { spec: base, row: { label, marks: cu.marks }, own: true, custom: true } : null;
  }
  function findDiag(tab, f) {
    const keys = f.dkeys;
    if (NODIAG[tab] && keys.some(k => NODIAG[tab].has(k))) return null;
    if (f.diagKey) { const c = customFor(tab, pk(f.diagKey), f.e); if (c) return c; }
    /* 1. Construction complète (« si + imparfait → conditionnel »). */
    if (f.c) {
      const full = ckey(f.e + ' ' + f.c);
      for (const s of rowSpecs(tab)) { const r = s.rows.find(x => ckey(x.label) === full); if (r) return { spec: s, row: r, own: true }; }
    }
    for (const k of keys) {
      /* 2. Correspondances choisies à la main (« même image que… »). */
      const al = (ALIAS2[tab] || {})[k] || (ALIAS[tab] || {})[k];
      if (al) {
        if (al.charAt(0) === '#') { const c = customFor(tab, pk(al.slice(1)), f.e); if (c) return Object.assign(c, { own: false, via: al.slice(1) }); }
        if (al.charAt(0) === '@') {
          for (const s of mapSpecs(tab)) { const r = s.rows.find(x => boldKeys(x).includes(pk(al.slice(1)))); if (r) return { spec: s, row: r, own: false, map: true, via: al.slice(1) }; }
        }
        const r = byLabel(tab, al);
        if (r) return Object.assign(r, { own: false });
      }
      /* 3. Schémas construits par le prototype 1. */
      const c = customFor(tab, k, f.e);
      if (c) return c;
    }
    /* 4. Même libellé dans un schéma de l'onglet. */
    for (const k of keys) for (const s of rowSpecs(tab)) {
      const r = s.rows.find(x => altPairs(x.label).some(a => a.k === k && consOk(a.cons, f.cons)));
      if (r) return { spec: s, row: r, own: true };
    }
    /* 5. Mot en gras dans un schéma « A → B ». */
    for (const k of keys) for (const s of mapSpecs(tab)) {
      const r = s.rows.find(x => boldKeys(x).includes(k));
      if (r) return { spec: s, row: r, own: true, map: true };
    }
    return null;
  }

  function miniViz(found) {
    if (!found) return '';
    const s = found.spec;
    const spec = found.map
      ? { type: 'map', rows: [found.row] }
      : { type: 'rows', axis: s.axis, lanes: s.lanes, flow: s.flow, baseline: s.baseline, rows: [found.row] };
    const lab = found.via || cleanLabel(found.row.label || found.row.to || '').replace(/\*\*/g, '');
    const cap = found.own ? '' : `<p class="mini-c">Même image que <b>${T(lab)}</b></p>`;
    return `<div class="mini">${V.render(spec, { examples: false, title: false })}${cap}</div>`;
  }

  /* Petite image d'une intention (accueil, liens) : une ligne de schéma, sans texte. */
  function glyph(tab) {
    const g = D.glyph[tab];
    const spec = g && V.byId(g[0]);
    if (!spec) return '';
    const row = spec.rows[g[1]];
    const marks = row.marks.map(m => (m.k === 'sign' || m.k === 'person') ? m : Object.assign({}, m, { text: undefined }));
    const s = { type: 'rows', axis: spec.axis ? { today: spec.axis.today, labels: [] } : null, lanes: spec.lanes, flow: spec.flow, rows: [{ label: '', marks }] };
    return `<span class="glyph" aria-hidden="true">${V.render(s, { title: false })}</span>`;
  }

  /* ---------- Phrase d'exemple : surligner l'expression, tracer les deux voies (prototype 1) ---------- */
  const LET = 'A-Za-zÀ-ÖØ-öø-ÿŒœÆæ';
  const NB = `(?![${LET}])`;
  const trimP = s => s.replace(/^[\s,.;:!?…]+|[\s,.;:!?…]+$/g, '');
  function partRegex(p) {
    const s = trimP(p);
    if (!s) return null;
    let r = s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/['’]/g, "['’]").replace(/\s+/g, '\\s+');
    if (/(^|\\s\+)que$/i.test(r)) r = r.replace(/que$/i, `qu(?:e${NB}|['’])`);
    else if (/\\s\+de$/i.test(r)) r = r.replace(/de$/i, `d(?:e${NB}|u${NB}|es${NB}|['’])`);
    else if (/\\s\+à$/i.test(r)) r = r.replace(/à$/i, `(?:à|au|aux)${NB}`);
    else if (/(^|\\s\+)si$/i.test(r)) r = r.replace(/si$/i, `s(?:i${NB}|['’])`);
    else if (!/['’]\]$/.test(r)) r += NB;
    try { return new RegExp(`(?<![${LET}])` + r, 'iu'); } catch (e) { return null; }
  }
  function searchPart(p, ex, pos) {
    const tryRe = s => { const re = partRegex(s); if (!re) return null; const m = re.exec(ex.slice(pos)); return m ? [pos + m.index, pos + m.index + m[0].length] : null; };
    let h = tryRe(p);
    if (h) return h;
    const words = trimP(p).split(/\s+/);
    for (let len = words.length - 1; len >= 1; len--) {
      for (let i = 0; i + len <= words.length; i++) {
        const sub = words.slice(i, i + len).join(' ');
        if (len === 1 && sub.replace(/[^A-Za-zÀ-ÿ]/g, '').length < 4) continue;
        h = tryRe(sub);
        if (h) return h;
      }
    }
    return null;
  }
  function findRanges(e, ex) {
    for (const alt of splitAlts(e)) {
      const parts = alt.replace(/\s*\(e\)/g, '').split('…').filter(x => trimP(x));
      const out = [];
      let pos = 0;
      parts.forEach(p => { const h = searchPart(p, ex, pos); if (h) { out.push(h); pos = h[1]; } });
      if (out.length) return out;
    }
    return [];
  }
  function lanesFor(ex, ranges) {
    const n = ex.length;
    const arr = new Array(n).fill('');
    const fill = (a, b, v) => { for (let i = a; i < b; i++) arr[i] = v; };
    if (Object.prototype.hasOwnProperty.call(D.lanes, ex)) {
      const o = D.lanes[ex];
      if (!o) return null;
      let i = 0, inC = false;
      for (const ch of o) {
        if (ch === '{') { inC = true; continue; }
        if (ch === '}') { inC = false; continue; }
        if (i < n) arr[i++] = inC ? 'c' : 'm';
      }
      return arr;
    }
    if (!ranges.length) return null;
    const first = ranges[0], last = ranges[ranges.length - 1];
    if (!ex.slice(0, first[0]).trim()) {
      const rest = ex.slice(last[1]);
      if (/^\s*[,:]/.test(rest)) return null;
      const m = rest.search(/[,:;]/);
      if (m < 0) return null;
      const cut = last[1] + m + 1;
      fill(0, cut, 'c'); fill(cut, n, 'm');
      return arr;
    }
    fill(0, first[0], 'm'); fill(first[0], n, 'c');
    return arr;
  }
  function spansHTML(ex, from, to, lanes, hl) {
    ex = nbsp(ex);
    let out = '', i = from;
    while (i < to) {
      const ln = lanes ? lanes[i] : '', h = hl[i];
      let j = i;
      while (j < to && (lanes ? lanes[j] : '') === ln && hl[j] === h) j++;
      const t = esc(ex.slice(i, j));
      const cls = ln ? ` class="ln-${ln}"` : '';
      out += h ? `<mark${cls}>${t}</mark>` : (ln ? `<span${cls}>${t}</span>` : t);
      i = j;
    }
    return out;
  }
  function sentenceHTML(ex, e) {
    const ranges = e ? findRanges(e, ex) : [];
    const hl = new Array(ex.length).fill(false);
    ranges.forEach(([a, b]) => { for (let i = a; i < b; i++) hl[i] = true; });
    if (/^\s*—/.test(ex)) {
      const starts = [];
      const re = /—\s*/g;
      let m;
      while ((m = re.exec(ex))) starts.push([m.index, m.index + m[0].length]);
      return `<span class="dlg">${starts.map((s, k) => {
        let b = k + 1 < starts.length ? starts[k + 1][0] : ex.length;
        while (b > s[1] && /\s/.test(ex[b - 1])) b--;
        const who = k % 2 === 0 ? 'm' : 'c';
        return `<span class="turn t-${who}"><span class="who">${who === 'm' ? 'l’autre' : 'toi'}</span><span>${spansHTML(ex, s[1], b, null, hl)}</span></span>`;
      }).join('')}</span>`;
    }
    return spansHTML(ex, 0, ex.length, lanesFor(ex, ranges), hl);
  }

  /* ---------- La formule, avec la case « ce qui suit » (prototype 1) ---------- */
  function slot(label, sub, tone) {
    return `<span class="slot s-${tone || 'c'}"><span class="slot-l">${esc(label)}</span>${sub ? `<span class="slot-s">${esc(sub)}</span>` : ''}</span>`;
  }
  function formulaHTML(f) {
    const e = f.e;
    const cc = f.c ? String(f.c).replace(/^\+\s*/, '').trim() : '';
    const word = t => t.trim() ? `<span class="f-e">${T(t.trim())}</span>` : '';
    if (cc.includes('→')) {
      const [a, b] = cc.split('→').map(x => x.trim());
      const sa = (D.slots[a] || ['une phrase', a]), sb = (D.slots[b] || ['une phrase', b]);
      return `${word(e)} ${slot(sa[0], sa[1])} <span class="f-arr" aria-hidden="true">→</span> ${slot(sb[0], sb[1], 'm')}`;
    }
    const cl = cc ? (D.slots[cc] || [cc, '']) : null;
    const parts = e.split('…');
    const hasDots = parts.length > 1;
    const toks = [];
    if (f.tab === 2 && f.src === 'cle') toks.push(slot('un nom', '', 'm'));
    let usedC = false;
    parts.forEach((p, i) => {
      if (p.trim()) toks.push(word(p));
      if (i === parts.length - 1) return;
      if (i === 0 && !p.trim()) { toks.push(slot('une phrase', '', 'm')); return; }
      const lab = !usedC && cl ? cl : ['la suite', ''];
      usedC = usedC || !!cl;
      toks.push(slot(lab[0], lab[1]));
    });
    if (!hasDots) {
      const ends = /[?!.]$/.test(e.trim());
      if (cl) toks.push(slot(cl[0], cl[1]));
      else if (f.src === 'cle' && f.tab !== 12 && !ends) toks.push(slot('la suite', ''));
    } else if (/que$/.test(parts[parts.length - 1].trim()) && cl) {
      toks.push(slot('le résultat', ''));
    }
    return toks.join(' ').replace(/ (<span class="f-e">,)/g, '$1');
  }
  const plainForm = f => f.e + (f.cons ? ' …' : '');

  /* ---------- Modèle d'une intention : les trois marches ---------- */
  const FORMS = {};
  const MODEL = {};
  const subIsQC = s => /quebec/.test(C.norm(s || ''));
  const subIsDist = s => /comparaison|nuance|distingu/.test(C.norm(s || ''));
  const subIsAdv = s => /avancee/.test(C.norm(s || ''));
  const isSentence = p => /\.$/.test(p) && !/…/.test(p) && p.trim().split(/\s+/).length >= 4;
  const PREP_ONLY = /^(?:lequel|(?:à|de|avec|pour|sur|dans|parmi) \+ (?:lequel|lesquels))$/i;

  function model(tab) {
    if (MODEL[tab]) return MODEL[tab];
    const E = ESS[tab];
    const forms = [];
    const seen = new Set();
    const nuance = [];          // { k, mode, text }
    const confondre = [];       // notes « à ne pas confondre » (HTML)
    const qcNotes = [];         // « Points particuliers au Québec » (HTML)
    let n = 0;

    /* Identité d'une forme : sa clé ; pour un mot court (« en », « après », « si »…), la clé + ce qui suit. */
    const short = f => !!f.cons && !/\s/.test(String(f.e).trim()) && pk(f.e).length <= 5;
    const ident = f => f.arrow ? pk(f.track) : short(f) ? `${pk(f.e)} ${pk(f.cons)}` : pk(f.track);
    const seen1 = new Set();
    function add(f) {
      f.tab = tab;
      f.n = ++n;
      f.id = `t${tab}-${f.n}`;
      f.pk = pk(f.track);
      f.lvl = levelOf(f.codes, f.badge);
      const firstWord = /^[^\s,]+,/.test(f.e) ? [pk(f.e.split(',')[0])] : [];
      f.dkeys = f.arrow ? [pk(f.track)] : uniq([ident(f)].concat(splitAlts(f.e).map(pk), firstWord)).filter(Boolean);
      f.ckeys = splitAlts(f.e).map(ckey);
      forms.push(f);
      FORMS[f.id] = f;
      return f;
    }
    function take(f) {
      const id = ident(f);
      if (f.step === 1) {
        [id, pk(f.track)].concat(f.arrow ? [] : splitAlts(f.e).map(pk)).forEach(k => { seen1.add(k); seen.add(k); });
        return true;
      }
      if (seen.has(id)) return false;
      if (!f.arrow && !short(f) && splitAlts(f.e).some(a => seen1.has(pk(a)))) return false;
      seen.add(id);
      return true;
    }

    /* Marche 1 : essentiels */
    E.cles.forEach(c => {
      const arrow = /→/.test(c.c || '');
      const f = { step: 1, src: 'cle', e: c.e, c: c.c || '', cons: c.c ? c.c.replace(/^\+\s*/, '') : '', ex: c.ex, codes: codesOf(c.r || 'C'), arrow };
      f.track = arrow ? `${c.e} ${f.cons}`.replace(/conditionnel présent/, 'conditionnel') : c.e;
      take(f); add(f);
    });
    E.qc.forEach(q => {
      const f = { step: 1, src: 'qc', e: q.e, c: q.c || '', cons: q.c ? q.c.replace(/^\+\s*/, '') : '', ex: q.ex, codes: codesOf(q.r || 'C'), track: q.e };
      take(f); add(f);
    });

    /* Nuances et notes de l'onglet */
    const items = C.TABS[tab].items;
    items.forEach(it => {
      const numbered = it.section.kind === 'section';
      const dist = it.section.kind === 'distinction' || (numbered && subIsDist(it.sub));
      if (!dist && !(numbered && /≠/.test(it.plain))) {
        if (it.section.kind === 'qc' && !it.regs.some(r => r === 'R' || r === 'D')) qcNotes.push(C.inline(it.raw, { static: true }));
        return;
      }
      const m = it.plain.match(/^(.+?)\s:\s(.+)$/);
      if (m && !/≠/.test(it.plain)) {
        const mode = (m[1].match(/\+\s*(ind|subj)/i) || [])[1] || '';
        nuance.push({ k: pk(m[1]), mode: mode.toLowerCase(), text: m[2].replace(/\.$/, '') });
      } else {
        confondre.push(C.inline(it.raw, { static: true }));
      }
    });
    const nuanceFor = f => {
      const keys = f.dkeys;
      const list = nuance.filter(x => keys.includes(x.k));
      if (!list.length) return '';
      const kind = f.cons ? f.cons.slice(0, 3).toLowerCase() : '';
      const hit = list.find(x => x.mode && kind.startsWith(x.mode.slice(0, 3))) || list.find(x => !x.mode) || list[0];
      return hit.text;
    };

    /* Marches 2 et 3 : les autres formes de l'onglet */
    let pre = '';
    items.forEach(it => {
      if (it.section.kind !== 'section') {
        /* « Jusqu'à tant que » [F-QC, R] : une forme à reconnaître, pas seulement une note. */
        if (it.section.kind === 'qc' && it.regs.some(r => r === 'R' || r === 'D')) {
          const mm = it.raw.match(/\*([^*]+)\*/);
          if (!mm) return;
          const f = { step: 3, src: 'item', e: mm[1], c: '', cons: '', codes: it.regs, track: mm[1], item: it,
            sec: { key: 'rec', num: '', title: 'À reconnaître' }, group: '', note: C.inline(it.raw.replace(/\s*\[[^\]]+\]/g, ''), { static: true }) };
          if (take(f)) add(f);
        }
        return;
      }
      if (/≠/.test(it.plain) || subIsDist(it.sub)) return;
      if (/points grammaticaux/i.test(it.section.title || '') && /→/.test(it.plain)) return;
      if (PREP_ONLY.test(it.plain)) { pre = /\+/.test(it.plain) ? it.plain : ''; return; }
      const arrow = /^→/.test(it.rest || '');
      const sentence = !it.cons && isSentence(it.plain);
      let e = it.head;
      if (!it.cons && /\s\+\s/.test(it.plain)) e = it.plain;
      if (sentence) e = it.plain;
      let rest = !arrow && it.rest ? it.rest : '', restNu = '';
      const rm = rest.match(/^(.*?)\s*:\s+(.+)$/);
      if (rm) { rest = rm[1]; restNu = rm[2].replace(/[\s.]+$/, ''); }
      const f = {
        step: 2, src: 'item', e, cons: it.cons || '', codes: it.regs, item: it, arrow, sentence,
        consLabel: arrow ? `${it.cons} ${it.rest}` : (it.cons || ''),
        c: it.cons ? `+ ${it.cons}${arrow ? ' ' + it.rest : ''}` : '',
        restNote: rest.replace(/^[\s,:;(]+|[\s.;)]+$/g, ''), restNu,
        sec: { key: it.section.id, num: it.section.num, title: it.section.title },
        group: it.sub || it.row || '',
        groupQC: subIsQC(it.sub)
      };
      if (pre && /,/.test(it.plain)) { f.restNote = pre; }
      pre = '';
      f.track = arrow ? `${it.head} ${it.cons} ${it.rest}`.replace(/→\s*/, '→ ').replace(/conditionnel présent/, 'conditionnel')
        : (!it.cons && /\s\+\s/.test(it.plain)) ? it.plain.replace(/\s+\+\s+/g, ' ')
        : short(f) ? `${e} ${it.cons}` : e;
      if (!take(f)) return;
      const k = pk(f.track);
      if (it.regs.some(r => r === 'S' || r === 'R' || r === 'D')) f.step = 3;
      else if (subIsAdv(it.sub)) { f.step = 3; f.badge = 'avance'; }
      else if ((WRITTEN[tab] && WRITTEN[tab].has(k)) || SOUTENU.has(k)) { f.step = 3; f.badge = 'ecrit'; }
      add(f);
    });

    /* « Usage à reconnaître » (paragraphes du site) : formes à comprendre, pas à produire. */
    const parsed = C.sectionize(C.parseBlocks(S.tabs[tab].md || ''));
    parsed.sections.filter(s => !s.num && /reconna/i.test(C.norm(s.title || ''))).forEach(s => {
      s.subs.forEach(sub => sub.blocks.forEach(b => {
        const texts = b.t === 'p' ? [b.text] : b.t === 'ul' ? b.items : [];
        texts.forEach(txt => {
          const mm = txt.match(/\*([^*]+)\*/);
          if (!mm) return;
          const deconseille = /déconseill|critiqu/i.test(txt);
          const f = { step: 3, src: 'rec', e: mm[1], c: '', cons: '', codes: [deconseille ? 'D' : 'R'], track: mm[1],
            sec: { key: 'rec', num: '', title: 'À reconnaître' }, group: '', note: C.inline(txt, { static: true }) };
          if (take(f)) add(f);
        });
      }));
    });

    /* Schéma, exemple et nuance de chaque forme */
    forms.forEach(f => {
      f.diag = findDiag(tab, f);
      const nu = nuanceFor(f);
      if (f.src === 'cle' || f.src === 'qc') { f.nuance = nu; return; }
      let ex = '', exSrc = '', sens = '';
      const fo = f.dkeys.map(k => (FORMAL[tab] || {})[k]).find(Boolean);
      if (fo) {
        ex = fo.ex; exSrc = 'formal';
        if (!f.diag && fo.diag) { const c = customFor(tab, pk(fo.diag), f.e); if (c) f.diag = c; }
      }
      if (!ex) {
        for (const k of f.ckeys) {
          const fi = C.FICHE.get(k);
          const fn = fi && fi.fonctions.find(x => x.tab === tab && (!x.construction || !f.cons || ckey(x.construction).includes(ckey(f.cons).slice(0, 3))));
          if (fn) { ex = (f.step === 3 && fn.ecrit) ? fn.ecrit : (fn.oral || fn.ecrit || ''); sens = fn.sens || ''; exSrc = 'fiche'; break; }
        }
      }
      if (!ex && f.diag && f.diag.own && !f.diag.custom && !f.diag.map && f.diag.row.ex) { ex = f.diag.row.ex; exSrc = 'viz'; }
      if (f.sentence) { ex = f.e; exSrc = 'self'; }
      f.ex = ex; f.exSrc = exSrc;
      const sub = f.diag && f.diag.own && !f.diag.custom && !f.diag.map ? f.diag.row.sub || '' : '';
      f.nuance = nu || sens || f.restNu || (/^\+/.test(sub) ? '' : sub);
    });

    const m = { tab, forms, confondre: uniq(confondre), qcNotes: uniq(qcNotes) };
    MODEL[tab] = m;
    return m;
  }

  /* ---------- Progression ---------- */
  function statusOf(f) {
    const r = P.get(f.track);
    return { st: P.statut(f.track), connu: !!(r && r.connu), revoir: !!(r && r.revoir) };
  }
  function stats(tab) {
    const m = model(tab);
    const st = [1, 2, 3].map(step => {
      const fs = m.forms.filter(f => f.step === step);
      const keys = uniq(fs.map(f => f.pk));
      let known = 0, seen = 0, rev = 0;
      keys.forEach(k => {
        const s = P.statut(k);
        if (s === 'maitrise') known++;
        if (s !== 'nouveau') seen++;
        const r = P.get(k);
        if (r && r.revoir) rev++;
      });
      const mix = [0, 0, 0, 0];
      fs.forEach(f => { mix[f.lvl]++; });
      return { step, total: keys.length, known, seen, rev, mix };
    });
    st[0].need = Math.min(NEED[0], st[0].total);
    st[1].need = Math.min(NEED[1], st[1].total);
    st[0].lit = true;
    st[1].lit = st[0].known >= st[0].need;
    st[2].lit = st[1].lit && st[1].known >= st[1].need;
    const current = st[2].lit ? 2 : st[1].lit ? 1 : 0;
    return { st, current };
  }
  const SEEN = new Set();
  function markSeen(f) {
    if (!f || SEEN.has(f.pk)) return;
    SEEN.add(f.pk);
    P.marquer(f.track, 'vu', TOOL);
  }

  /* ---------- L'escalier (SVG) ---------- */
  const LV_COL = ['var(--l0)', 'var(--l1)', 'var(--l2)', 'var(--lrec)'];
  function treadSegs(x, y, w, h, mix) {
    const tot = mix.reduce((a, b) => a + b, 0);
    if (!tot) return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="var(--line-2)"/>`;
    let cx = x, out = '';
    mix.forEach((v, i) => {
      if (!v) return;
      const sw = +(w * v / tot).toFixed(2);
      out += `<rect x="${cx.toFixed(2)}" y="${y}" width="${sw}" height="${h}" fill="${LV_COL[i]}"/>`;
      cx += sw;
    });
    return out;
  }
  function stairSVG(S3, o) {
    o = o || {};
    const mini = !!o.mini;
    const G = mini
      ? { W: 70, H: 46, base: 44, unit: 12, bw: 20, gap: 3, x0: 2, tread: 3.2, r: 2 }
      : { W: 320, H: 150, base: 144, unit: 36, bw: 92, gap: 12, x0: 10, tread: 8, r: 6 };
    let g = '';
    const tops = [];
    S3.st.forEach((s, i) => {
      const x = G.x0 + i * (G.bw + G.gap);
      const h = G.unit * (i + 1);
      const top = G.base - h;
      tops.push([x + G.bw / 2, top]);
      const frac = v => s.total ? v / s.total : 0;
      const hk = +(h * frac(s.known)).toFixed(2), hs = +(h * frac(s.seen)).toFixed(2);
      const sel = o.sel === i + 1;
      const clip = `clip-${o.uid || 's'}-${i}`;
      let b = `<clipPath id="${clip}"><rect x="${x}" y="${top}" width="${G.bw}" height="${h}" rx="${G.r}"/></clipPath>`;
      b += `<g clip-path="url(#${clip})">`;
      b += `<rect class="blk-bg" x="${x}" y="${top}" width="${G.bw}" height="${h}"/>`;
      if (hs) b += `<rect class="blk-seen" x="${x}" y="${G.base - hs}" width="${G.bw}" height="${hs}"/>`;
      if (hk) b += `<rect class="blk-known" x="${x}" y="${G.base - hk}" width="${G.bw}" height="${hk}"/>`;
      b += treadSegs(x, top, G.bw, G.tread, s.mix);
      b += '</g>';
      b += `<rect class="blk${s.lit ? ' is-lit' : ' is-dim'}${sel ? ' is-sel' : ''}" x="${x}" y="${top}" width="${G.bw}" height="${h}" rx="${G.r}"/>`;
      if (!mini) {
        b += `<text class="blk-n" x="${x + 12}" y="${top + G.tread + 17}">${i + 1}</text>`;
        b += `<text class="blk-c" x="${x + G.bw / 2}" y="${G.base - 9}" text-anchor="middle">${s.known}<tspan class="blk-c2">/${s.total}</tspan></text>`;
      }
      if (!mini && o.tab && !o.static) {
        const label = `Marche ${i + 1}, ${STEP_NAMES[i]} : ${s.known} forme${s.known > 1 ? 's' : ''} connue${s.known > 1 ? 's' : ''} sur ${s.total}${s.lit ? '' : ' (pas encore éclairée)'}`;
        g += `<a class="blk-a" href="#t${o.tab}-${i + 1}" aria-label="${esc(label)}"${sel ? ' aria-current="true"' : ''}>${b}</a>`;
      } else g += b;
    });
    /* Le chemin qui monte */
    if (!mini) {
      const pts = tops.map(([x, y]) => `${x},${y - 4}`).join(' ');
      g = `<polyline class="path" points="${pts}"/>` + g;
    }
    /* « Toi » sur la marche où tu es */
    if (o.current != null) {
      const [cx, top] = tops[o.current];
      g += mini
        ? `<circle class="me" cx="${cx}" cy="${top - 4.6}" r="3.4"/>`
        : `<g class="me"><circle cx="${cx}" cy="${top - 23}" r="6.5"/><path d="M${cx - 9} ${top - 1} Q${cx} ${top - 22} ${cx + 9} ${top - 1} Z"/></g><text class="me-t" x="${cx + 14}" y="${top - 13}">toi</text>`;
    }
    const title = o.title ? `<title>${esc(o.title)}</title>` : '';
    return `<svg class="stair${mini ? ' stair-mini' : ''}" viewBox="0 0 ${G.W} ${G.H}" ${o.tab && !mini && !o.static ? 'role="group"' : 'role="img"'} aria-label="${esc(o.label || 'Escalier des formes')}">${title}${g}</svg>`;
  }
  function mixBar(mix) {
    const tot = mix.reduce((a, b) => a + b, 0);
    if (!tot) return '';
    const segs = mix.map((v, i) => v ? `<i class="mx-${i}" style="flex:${v}"></i>` : '').join('');
    const leg = mix.map((v, i) => v ? `<span class="mx-l"><b class="mx-d mx-${i}" aria-hidden="true"></b>${esc(LEVELS[i].label)} <small>${v}</small></span>` : '').join('');
    return `<div class="mix"><span class="mix-bar" aria-hidden="true">${segs}</span><span class="mix-leg"><span class="sr">Registres de cette marche : </span>${leg}</span></div>`;
  }

  /* ---------- Petits composants ---------- */
  const ICON = {
    check: '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M4 10.5 8.2 14.5 16 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    flag: '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M5 17.5V3.2M5 3.6h9.5l-2.2 3.4 2.2 3.4H5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    say: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    chev: '<svg class="chev" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="M5 7.5 10 12.5 15 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    up: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 19h5v-5h5V9h5V4" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    back: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M19 12H6M11 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    go: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    x: '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M5 5l10 10M15 5 5 15" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>'
  };
  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';
  const speakBtn = text => (!canSpeak || !text) ? '' :
    `<button type="button" class="say" data-say="${esc(text)}" aria-label="Écouter : ${esc(text)}">${ICON.say}<span class="say-t" aria-hidden="true">Écouter</span></button>`;

  const ST_TXT = { nouveau: 'Nouvelle', vu: 'Déjà vue', 'en-cours': 'En cours', maitrise: 'Je la connais' };
  function progHTML(f) {
    const s = statusOf(f);
    return `<div class="prog" data-pf="${f.id}">
      <span class="pst" data-st="${s.st}" data-rv="${s.revoir}"><span class="sd" aria-hidden="true"></span><span class="pst-t">${ST_TXT[s.st]}${s.revoir ? ' · à revoir' : ''}</span></span>
      <span class="pbs">
        <button type="button" class="pb pb-ok" data-act="connu" data-f="${f.id}" aria-pressed="${s.connu}">${ICON.check}Je connais</button>
        <button type="button" class="pb pb-rv" data-act="revoir" data-f="${f.id}" aria-pressed="${s.revoir}">${ICON.flag}À revoir</button>
      </span>
    </div>`;
  }
  const siteHref = f => {
    const it = f.item || C.findItem(ckey(splitAlts(f.e)[0]), f.tab);
    return it ? C.siteLink(C.itemHref(it)) : C.siteLink('#onglet-' + f.tab);
  };
  const BADGES = { S: 'Soutenu', R: 'À reconnaître', D: 'Déconseillé', O: 'Oral', QC: 'Québec', 'F-QC': 'Familier QC' };
  function badgeHTML(f) {
    const out = [];
    f.codes.forEach(c => { if (BADGES[c]) out.push(`<span class="bdg b-${c.toLowerCase().replace(/[^a-z]/g, '')}">${BADGES[c]}</span>`); });
    if (f.badge === 'ecrit') out.push('<span class="bdg b-ecrit">Écrit</span>');
    if (f.badge === 'avance') out.push('<span class="bdg b-avance">Avancé</span>');
    return out.join('');
  }

  /* Marche 1 : grandes cartes « Je veux… » */
  function cardHTML(f, i) {
    return `<article class="card lvl-${f.lvl}" id="f-${f.id}" data-card="${f.id}" style="--i:${i}">
      <div class="card-top"><span class="reg">${meter(f.lvl)}<span>${esc(regText(f))}</span></span>${speakBtn(f.ex || f.e)}</div>
      <p class="formula">${formulaHTML(f)}</p>
      ${f.nuance ? `<p class="nuance">${md(nbsp(f.nuance))}</p>` : ''}
      ${f.ex ? `<p class="ex">${sentenceHTML(f.ex, f.e)}</p>` : ''}
      ${miniViz(f.diag)}
      ${progHTML(f)}
    </article>`;
  }

  /* Marches 2 et 3 : pastilles qui s'ouvrent */
  function chipHTML(f, gid) {
    const s = statusOf(f);
    return `<li><button type="button" class="chip lvl-${f.lvl}" id="c-${f.id}" data-chip="${f.id}" data-g="${gid}" aria-expanded="false" aria-controls="det-${gid}">
      <span class="sd" data-st="${s.st}" data-rv="${s.revoir}" aria-hidden="true"></span>
      <span class="chip-e">${T(f.e)}</span>${f.consLabel ? `<span class="chip-c">+&nbsp;${esc(f.consLabel)}</span>` : ''}${badgeHTML(f)}
      <span class="sr chip-st">, ${ST_TXT[s.st].toLowerCase()}${s.revoir ? ', à revoir' : ''}</span>
    </button></li>`;
  }
  function detailHTML(f) {
    const formula = f.sentence ? '' : `<p class="formula formula-s">${formulaHTML(f)}${f.restNote ? `<span class="f-note">${T(f.restNote)}</span>` : ''}</p>`;
    const note = f.note ? `<p class="nuance">${f.note}</p>` : (f.nuance ? `<p class="nuance">${md(nbsp(f.nuance))}</p>` : '');
    const ex = f.ex ? `<p class="ex${f.sentence ? ' ex-self' : ''}">${sentenceHTML(f.ex, f.sentence ? '' : f.e)}</p>` : '';
    const where = f.group ? `<p class="det-g">${esc(f.sec.num ? f.sec.num + ' · ' : '')}${esc(f.group)}</p>` : '';
    return `<div class="det-in lvl-${f.lvl}" data-det="${f.id}">
      <div class="card-top"><span class="reg">${meter(f.lvl)}<span>${esc(regText(f))}</span></span>
        <span class="det-tools">${speakBtn(f.ex || f.e)}<button type="button" class="det-x" data-close="${f.id}" aria-label="Fermer la forme">${ICON.x}</button></span></div>
      ${where}${formula}${note}${ex}
      ${miniViz(f.diag)}
      ${progHTML(f)}
      <a class="more" href="${esc(siteHref(f))}">Voir dans le site complet<span aria-hidden="true"> →</span></a>
    </div>`;
  }
  function sectionsOf(forms) {
    const out = [];
    forms.forEach(f => {
      let s = out.find(x => x.key === f.sec.key);
      if (!s) { s = { key: f.sec.key, num: f.sec.num, title: f.sec.title, groups: [] }; out.push(s); }
      let g = s.groups.find(x => x.label === f.group);
      if (!g) { g = { label: f.group, qc: f.groupQC, forms: [] }; s.groups.push(g); }
      g.forms.push(f);
    });
    return out;
  }
  function secCount(forms) {
    let known = 0, seen = 0;
    uniq(forms.map(f => f.pk)).forEach(k => { const s = P.statut(k); if (s === 'maitrise') known++; if (s !== 'nouveau') seen++; });
    return { known, seen, total: uniq(forms.map(f => f.pk)).length };
  }
  function secBar(c) {
    const p = v => c.total ? (100 * v / c.total).toFixed(1) : 0;
    return `<span class="sec-bar" aria-hidden="true"><i class="sb-seen" style="width:${p(c.seen)}%"></i><i class="sb-known" style="width:${p(c.known)}%"></i></span>`;
  }
  function sectionsHTML(tab, forms, step) {
    const secs = sectionsOf(forms);
    return `<div class="secs">${secs.map((s, i) => {
      const all = s.groups.reduce((a, g) => a.concat(g.forms), []);
      const c = secCount(all);
      const open = (step === 3 || i === 0 || secs.length <= 2) ? ' open' : '';
      return `<details class="sec" data-sec="${esc(s.key)}"${open}>
        <summary><span class="sec-n">${esc(s.num || '·')}</span><span class="sec-t">${esc(s.title || '')}</span>
          <span class="sec-c" data-sc="${esc(s.key)}">${c.known ? `<b>${c.known}</b> / ` : ''}${plur(c.total, 'forme', 'formes')}</span>${secBar(c)}${ICON.chev}</summary>
        <div class="sec-b">${s.groups.map((g, j) => {
          const gid = `${tab}-${step}-${i}-${j}`;
          return `<div class="grp">
            ${g.label ? `<p class="grp-h">${g.qc ? '<span class="qcf">QC</span>' : ''}${esc(g.label)}</p>` : ''}
            <ul class="chips">${g.forms.map(f => chipHTML(f, gid)).join('')}</ul>
            <div class="det" id="det-${gid}" role="region" aria-label="Détail de la forme" hidden></div>
          </div>`;
        }).join('')}</div>
      </details>`;
    }).join('')}</div>`;
  }

  /* ---------- Schémas transversaux filtrés pour l'intention (prototype 1) ---------- */
  const THEMES = { 3: ['Temps', 'Maintenant', 'Attente'], 4: ['Cause'], 5: ['Conséquence'], 6: ['But'], 7: ['Hypothèse', 'Condition'], 8: ['Opposition', 'Deux côtés', 'Concession'], 10: ['Ajout'] };
  function gridFor(id, tab) {
    const s = V.byId(id);
    const th = THEMES[tab] || [];
    if (!s) return null;
    const rows = s.rows.filter(r => th.includes(r.theme));
    return rows.length ? Object.assign({}, s, { rows, themes: false }) : null;
  }
  function modesFor(tab) {
    const modes = V.byId('modes');
    if (!modes) return null;
    const cols = modes.cols.map(c => Object.assign({}, c, { items: c.items.filter(x => C.findItem(ckey(x.replace(/\s\+.*$/, '')), tab)) })).filter(c => c.items.length);
    return cols.length >= 2 ? Object.assign({}, modes, { cols, intro: 'Seulement les expressions de cette intention.' }) : null;
  }

  /* ---------- Liens entre intentions (prototype 1) ---------- */
  function nextOf(tab) {
    const out = [], seen = new Set([tab]);
    const add = (to, rel) => { if (seen.has(to) || !ESS[to]) return; seen.add(to); out.push({ to, rel }); };
    M.chains.forEach(c => c.steps.forEach((s, i) => { if (s[1] === tab && c.steps[i + 1]) add(c.steps[i + 1][1], `${s[0]} → ${c.steps[i + 1][0]}`); }));
    S.models.forEach(m => m.steps.forEach((s, i) => { if (s[1] === tab && m.steps[i + 1]) add(m.steps[i + 1][1], `${s[0]} → ${m.steps[i + 1][0]}`); }));
    M.scenarios.forEach(sc => sc.fonctions.forEach((f, i) => { if (f === tab && sc.fonctions[i + 1]) add(sc.fonctions[i + 1], `Souvent ensuite · ${sc.theme}`); }));
    if (out.length < 2) { add(12, 'Conclusion → Relance'); add(1, 'Nouveau sujet'); }
    return out.slice(0, 3);
  }

  /* ---------- Légende des deux voies ---------- */
  function legendFor(tab) {
    const s = rowSpecs(tab).find(x => Array.isArray(x.legend)) || null;
    const items = tab === 12 ? [['main', 'l’autre personne'], ['cadre', 'toi']]
      : s ? s.legend : [['cadre', 'ce que l’expression introduit'], ['main', 'la phrase principale']];
    return `<p class="lg">${items.map(([c, t]) => `<span class="lg-${c === 'main' ? 'm' : c === 'cadre' ? 'c' : 'x'}"><i></i>${esc(t)}</span>`).join('')}</p>`;
  }
  const STAIR_KEY = `<p class="skey"><span><i class="k-known"></i>connues</span><span><i class="k-seen"></i>déjà vues</span><span><i class="k-reg"></i>couleur du haut = registre</span></p>`;
  const REG_KEY = `<p class="rkey">${LEVELS.map((l, i) => `<span><b class="mx-d mx-${i}" aria-hidden="true"></b>${esc(l.label)}</span>`).join('')}</p>`;

  /* ---------- Écrans ---------- */
  const app = () => document.getElementById('app');
  const state = { view: null, tab: null, step: null };

  function homeStats() {
    const all = ORDER.map(t => stats(t));
    const st = [0, 1, 2].map(i => {
      const o = { total: 0, known: 0, seen: 0, mix: [0, 0, 0, 0], lit: true };
      all.forEach(a => { const s = a.st[i]; o.total += s.total; o.known += s.known; o.seen += s.seen; s.mix.forEach((v, j) => { o.mix[j] += v; }); });
      return o;
    });
    return { all, st };
  }
  function tileStairHTML(t, s) {
    const label = `Escalier : marche ${s.current + 1} ; ${s.st.map((x, i) => `marche ${i + 1} : ${x.known} sur ${x.total}`).join(', ')}`;
    const known = s.st.reduce((a, x) => a + x.known, 0);
    return `${stairSVG(s, { mini: true, current: s.current, label })}<span class="tl-st-t"><b>Marche ${s.current + 1}</b>${known ? ` · ${plur(known, 'connue', 'connues')}` : ''}</span>`;
  }
  function homeHTML() {
    const H = homeStats();
    const knownAll = H.st.reduce((a, s) => a + s.known, 0);
    const rev = P.aRevoir().length;
    const tiles = ORDER.map((t, i) => {
      const E = ESS[t];
      const s = H.all[i];
      return `<li><a class="tile" href="#t${t}" id="tile-${t}">
        <span class="tl-top"><span class="tl-n" aria-hidden="true">${pad(t)}</span><span class="tl-je">${esc(E.je)}</span></span>
        <span class="tl-mid">${glyph(t)}<span class="tl-st" data-tile="${t}">${tileStairHTML(t, s)}</span></span>
        <span class="tl-f">${E.cles.slice(0, 3).map(c => `<span>${T(c.e)}</span>`).join('<span class="dot" aria-hidden="true">·</span>')}</span>
      </a></li>`;
    }).join('');
    return `<div class="home wrap">
      <header class="hero">
        <div class="hero-t">
          <p class="kick">Découvrir de nouvelles constructions</p>
          <h1 class="h1" tabindex="-1">L’escalier des formes</h1>
          <p class="lead">Choisis ce que tu veux dire. Puis monte, marche par marche&nbsp;: de la formule la plus simple aux formes les plus riches.</p>
          <p class="hero-me" id="hero-me">${knownAll ? `Tu connais <b>${plur(knownAll, 'forme', 'formes')}</b>` : 'Aucune forme marquée pour l’instant'}${rev ? ` · <b>${rev}</b> à revoir` : ''}.</p>
        </div>
        <figure class="hero-fig">
          <div class="hero-stair" id="hero-stair">${stairSVG(H, { static: true, label: `Les trois marches, pour les 12 intentions : ${H.st.map((s, i) => `marche ${i + 1}, ${s.known} connues sur ${s.total}`).join(' ; ')}` })}</div>
          <ol class="hero-steps">${STEP_NAMES.map((n, i) => `<li><span class="hs-n">${i + 1}</span><span><b>${n}</b><small>${esc(STEP_SUBS[i])}</small></span></li>`).join('')}</ol>
          <figcaption>${STAIR_KEY}${REG_KEY}</figcaption>
        </figure>
      </header>

      <section class="tiles-sec" aria-labelledby="tiles-h">
        <div class="sec-head"><h2 class="s-h" id="tiles-h">Les 12 intentions</h2><p class="s-sub">Chaque tuile montre une image, trois formules clés et ton escalier.</p></div>
        <ol class="tiles">${tiles}</ol>
      </section>

      <section class="verso-cta" aria-labelledby="verso-h">
        <div><h2 class="s-h" id="verso-h">Au verso : les repères</h2>
        <p class="s-sub">Ce qui sert pour toutes les intentions : modes, registres, structures, le temps.</p></div>
        <ul class="v-links">
          <li><a href="#verso-modes"><b>Quel mode&nbsp;?</b><span>indicatif, subjonctif…</span></a></li>
          <li><a href="#verso-registres"><b>Trois registres</b><span>entre amis → formel</span></a></li>
          <li><a href="#verso-structures"><b>Nom, infinitif ou phrase</b><span>trois structures</span></a></li>
          <li><a href="#verso-temps"><b>Le temps</b><span>passé · aujourd’hui · futur</span></a></li>
        </ul>
      </section>
    </div>`;
  }

  function stairBlockHTML(tab, step) {
    const s = stats(tab);
    const svg = stairSVG(s, { tab, sel: step, current: s.current, uid: 'i' + tab, label: `L’escalier de « ${ESS[tab].je} »` });
    const bar = s.st.map((x, i) => {
      const cur = step === i + 1;
      return `<li><a class="sb${cur ? ' is-sel' : ''}${x.lit ? ' is-lit' : ' is-dim'}" href="#t${tab}-${i + 1}" data-step="${i + 1}"${cur ? ' aria-current="true"' : ''}>
        <span class="sb-n" aria-hidden="true">${i + 1}</span>
        <span class="sb-t"><span class="sb-l">${STEP_NAMES[i]}</span><span class="sb-c">${x.known}/${x.total}<span class="sr"> connues</span>${s.current === i ? '<span class="sb-me"> · toi</span>' : ''}</span></span>
        <span class="sb-p" aria-hidden="true"><i style="width:${x.total ? (100 * x.known / x.total).toFixed(1) : 0}%"></i></span>
      </a></li>`;
    }).join('');
    return `<div class="stair-svg">${svg}</div>${STAIR_KEY}<nav class="stepbar" aria-label="Les trois marches"><ol>${bar}</ol></nav>`;
  }

  function footHTML(tab, step) {
    const s = stats(tab);
    if (step === 3) {
      const i = ORDER.indexOf(tab), nx = ORDER[(i + 1) % ORDER.length];
      return `<div class="m-foot is-top"><p>${ICON.up}<span>Tu es en haut de l’escalier. Les formes de cette marche servent surtout à l’écrit ou à comprendre.</span></p>
        <a class="btn" href="#t${nx}">Intention suivante : ${esc(ESS[nx].je)}<span aria-hidden="true"> →</span></a></div>`;
    }
    const cur = s.st[step - 1], next = s.st[step];
    const left = Math.max(0, cur.need - cur.known);
    const msg = next.lit
      ? `<b>La marche ${step + 1} est éclairée.</b> Tu peux monter.`
      : `Marque encore <b>${plur(left, 'forme', 'formes')}</b> «&nbsp;Je connais&nbsp;» pour éclairer la marche ${step + 1}. Tu peux aussi y aller tout de suite.`;
    return `<div class="m-foot${next.lit ? ' is-lit' : ''}"><p>${ICON.up}<span>${msg}</span></p>
      <a class="btn" href="#t${tab}-${step + 1}">Marche ${step + 1} · ${STEP_NAMES[step]}<span aria-hidden="true"> →</span></a></div>`;
  }

  function marcheHTML(tab, step) {
    const m = model(tab), E = ESS[tab];
    const s = stats(tab).st[step - 1];
    const forms = m.forms.filter(f => f.step === step);
    let body = '';
    if (step === 1) {
      const cles = forms.filter(f => f.src === 'cle'), qc = forms.filter(f => f.src === 'qc');
      body = `<div class="cards">${cles.map(cardHTML).join('')}</div>
        ${qc.length ? `<h3 class="sub-h"><span class="mx-d mx-0" aria-hidden="true"></span>Entre amis, au Québec</h3>
        <p class="sub-p">Ce que tu entends tous les jours, à Montréal comme à Québec.</p>
        <div class="cards">${qc.map((f, i) => cardHTML(f, i + cles.length)).join('')}</div>` : ''}
        <p class="attn"><svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M12 3 2.5 20h19z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M12 10v4.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><circle cx="12" cy="17.2" r="1.3" fill="currentColor"/></svg><span><b>Attention</b> ${md(nbsp(E.attention))}</span></p>`;
    } else if (step === 2) {
      const str = gridFor('structures', tab);
      body = `${str ? `<div class="panel panel-x"><p class="px-h">Varier la structure</p>${V.render(str, { title: false })}</div>` : ''}
        <p class="how">Touche une forme pour voir ce qui suit, une image et un exemple quand il existe.</p>
        ${sectionsHTML(tab, forms, 2)}
        ${m.confondre.length ? `<div class="note note-d"><p class="note-h">À ne pas confondre</p><ul>${m.confondre.map(x => `<li>${x}</li>`).join('')}</ul></div>` : ''}`;
    } else {
      const reg = gridFor('registres', tab);
      const hasRec = forms.some(f => f.lvl === 3);
      body = `<div class="note note-w"><p>${meter(2)}<span><b>Soutenu, écrit</b> : pour un courriel, une lettre, un formulaire, une entrevue.</span></p>
          ${hasRec ? `<p>${meter(3)}<span><b>À reconnaître</b> : utile à comprendre quand tu l’entends ; pas besoin de le dire tout de suite.</span></p>` : ''}</div>
        ${reg ? `<div class="panel panel-x"><p class="px-h">Une même idée, trois registres</p>${V.render(reg, { title: false })}</div>` : ''}
        ${forms.length ? sectionsHTML(tab, forms, 3) : '<p class="how">Cette intention n’a pas de forme soutenue dans le site : les formes courantes passent bien à l’écrit.</p>'}
        ${m.qcNotes.length ? `<div class="note note-q"><p class="note-h"><span class="qcf">QC</span>Bon à savoir au Québec</p><ul>${m.qcNotes.map(x => `<li>${x}</li>`).join('')}</ul></div>` : ''}`;
    }
    return `<header class="m-head lvlh-${step}">
        <p class="m-k">Marche ${step} sur 3</p>
        <h2 class="m-t" id="m-h" tabindex="-1">${STEP_NAMES[step - 1]}</h2>
        <p class="m-sub">${esc(STEP_SUBS[step - 1])} <span class="m-n">${plur(s.total, 'forme', 'formes')}${s.known ? ` · ${s.known} connue${s.known > 1 ? 's' : ''}` : ''}</span></p>
        ${mixBar(s.mix)}
      </header>
      ${body}
      ${footHTML(tab, step)}`;
  }

  /* « Comprendre en image » : tous les schémas de l'intention, chaque ligne avec sa marche. */
  function rowIndex(tab) {
    const map = new Map();
    model(tab).forms.forEach(f => {
      if (!f.diag || !f.diag.own || f.diag.custom) return;
      const r = f.diag.row;
      if (!map.has(r) || map.get(r).step > f.step) map.set(r, f);
    });
    return map;
  }
  function imagesHTML(tab) {
    const idx = rowIndex(tab);
    const link = row => { const f = idx.get(row); return f ? `#t${tab}-${f.step}-${f.n}` : null; };
    const specs = V.forTab(tab);
    const extras = [modesFor(tab)].filter(Boolean);
    const panels = specs.map(s => `<div class="panel" data-spec="${esc(s.id)}">${V.render(s, { examples: true, link })}</div>`)
      .concat(extras.map(s => `<div class="panel">${V.render(s, {})}</div>`)).join('');
    return `<h2 class="s-h" id="img-h">Comprendre en image</h2>
      <p class="s-sub">Le petit numéro dit sur quelle marche se trouve chaque forme. Touche-la pour y aller.</p>
      ${legendFor(tab)}
      <div class="panels">${panels}</div>`;
  }
  function decorateImages(root, tab) {
    const idx = rowIndex(tab);
    $$('.panel[data-spec]', root).forEach(p => {
      const spec = V.byId(p.dataset.spec);
      if (!spec || !spec.rows) return;
      const rows = $$('.vz-rows > .vz-row:not(.vz-head)', p);
      rows.forEach((el, i) => {
        const f = idx.get(spec.rows[i]);
        if (!f) return;
        const host = $('.vz-l', el) || $('.vz-m', el);
        if (host) host.insertAdjacentHTML('beforeend', `<span class="stepb s${f.step}" title="${esc(STEP_NAMES[f.step - 1])}">marche ${f.step}</span>`);
      });
    });
  }

  function nextHTML(tab) {
    const nx = nextOf(tab);
    const i = ORDER.indexOf(tab);
    return `<h2 class="s-h" id="next-h">Ensuite, tu peux…</h2>
      <ul class="nexts">${nx.map(n => `<li><a class="go" href="#t${n.to}">
        <span class="go-rel">${esc(n.rel)}</span>
        <span class="go-je">${esc(ESS[n.to].je)}</span>
        ${glyph(n.to)}
      </a></li>`).join('')}</ul>
      <p class="i-foot"><a class="site" href="${esc(C.siteLink('#onglet-' + tab))}">Onglet ${tab} dans le site complet<span aria-hidden="true"> →</span></a>
        <span class="pn">${i > 0 ? `<a href="#t${ORDER[i - 1]}">‹ ${pad(ORDER[i - 1])}</a>` : ''}${i < ORDER.length - 1 ? `<a href="#t${ORDER[i + 1]}">${pad(ORDER[i + 1])} ›</a>` : ''}</span></p>`;
  }

  function intentHTML(tab, step) {
    const E = ESS[tab];
    const i = ORDER.indexOf(tab);
    const prev = ORDER[i - 1], next = ORDER[i + 1];
    return `<article class="intent" data-tab="${tab}">
      <div class="wrap">
        <nav class="crumbs" aria-label="Navigation">
          <a class="back" href="#tile-${tab}">${ICON.back}Les 12 intentions</a>
          <span class="pn">${prev ? `<a href="#t${prev}" aria-label="Intention précédente : ${esc(ESS[prev].je)}">‹ ${pad(prev)}</a>` : ''}<span class="pn-c">${pad(tab)} / ${pad(ORDER.length)}</span>${next ? `<a href="#t${next}" aria-label="Intention suivante : ${esc(ESS[next].je)}">${pad(next)} ›</a>` : ''}</span>
        </nav>
        <header class="i-head">
          <div class="i-ht">
            <p class="i-k">Je veux…</p>
            <h1 class="i-t" tabindex="-1"><span class="hl">${esc(E.je)}</span></h1>
            <p class="i-q">${esc(E.quand)}</p>
            ${legendFor(tab)}
          </div>
          <div class="i-stair" id="stair">${stairBlockHTML(tab, step)}</div>
        </header>
      </div>
      <section class="marche wrap" id="marche" data-step="${step}" aria-labelledby="m-h">${marcheHTML(tab, step)}</section>
      <section class="wrap images" id="images" aria-labelledby="img-h">${imagesHTML(tab)}</section>
      <section class="wrap next" aria-labelledby="next-h">${nextHTML(tab)}</section>
    </article>`;
  }

  /* Verso de l'antisèche : repères transversaux */
  function tabForKey(label) {
    const k = ckey(label);
    for (const t of ORDER) if (ESS[t].cles.some(c => ckey(c.e) === k)) return t;
    const l = C.BY_KEY.get(C.norm(label).replace(/[.…]+$/, ''));
    return l && l.length ? l[0].tab : null;
  }
  function versoHTML() {
    const modes = V.byId('modes'), reg = V.byId('registres'), str = V.byId('structures');
    const time = ['durees', 'simultaneite'].map(id => V.byId(id)).filter(Boolean);
    const link = (row, spec) => spec.tab ? `#t${spec.tab}` : null;
    const panel = (id, title, sub, body) => `<section class="vp" id="verso-${id}" aria-labelledby="vh-${id}">
      <h2 class="vp-h" id="vh-${id}" tabindex="-1">${esc(title)}</h2>${sub ? `<p class="s-sub">${sub}</p>` : ''}${body}</section>`;
    return `<div class="verso wrap">
      <nav class="crumbs" aria-label="Navigation"><a class="back" href="#">${ICON.back}Les 12 intentions</a></nav>
      <header class="v-head"><p class="i-k">Au verso</p><h1 class="i-t" tabindex="-1">Les repères</h1>
        <p class="i-q">Ce qui sert pour toutes les intentions. Touche une expression pour ouvrir son escalier.</p>
        <p class="lg"><span class="lg-c"><i></i>orange : ce que l’expression introduit</span><span class="lg-m"><i></i>violet : la phrase principale</span></p></header>
      <div class="v-grid">
        ${panel('modes', 'Quel mode ?', 'Ce qui vient après l’expression.', modes ? V.render(modes, { title: false }) : '')}
        ${panel('registres', 'Trois registres', reg ? md(reg.intro) : '', reg ? V.render(reg, { title: false }) : '')}
        ${panel('temps', 'Le temps en un coup d’œil', 'Frise : passé, aujourd’hui, futur. Deux voies : l’action de l’expression en haut, la phrase principale en bas.', `<div class="v-time">${time.map(s => `<div>${V.render(s, { examples: true, link })}</div>`).join('')}</div>`)}
        ${panel('structures', 'Nom, infinitif ou phrase', str ? md(str.intro) : '', str ? V.render(str, { title: false }) : '')}
      </div>
    </div>`;
  }
  function decorateModes(root) {
    $$('#verso-modes .vz-col li', root).forEach(li => {
      const t = tabForKey(li.textContent.trim().split(' + ')[0]);
      if (t) li.innerHTML = `<a href="#t${t}" title="${esc(ESS[t].je)}">${li.innerHTML}<span class="mode-n">${pad(t)}</span></a>`;
    });
  }

  /* ---------- Rendu, navigation ---------- */
  function parseHash() {
    const h = decodeURIComponent(location.hash || '');
    let m = h.match(/^#t(\d+)(?:-(\d))?(?:-(\d+))?$/);
    if (m && ESS[+m[1]]) return { view: 'tab', tab: +m[1], step: m[2] ? Math.min(3, Math.max(1, +m[2])) : null, form: m[3] ? +m[3] : null };
    m = h.match(/^#verso(?:-([a-z]+))?$/);
    if (m) return { view: 'verso', panel: m[1] || null };
    m = h.match(/^#tile-(\d+)$/);
    return { view: 'home', tile: m ? +m[1] : null };
  }

  function enter(root) {
    if (reduce()) return;
    root.classList.remove('enter'); void root.offsetWidth; root.classList.add('enter');
  }

  function render() {
    const r = parseHash();
    const root = app();
    document.body.classList.toggle('on-intent', r.view === 'tab');
    if (r.view === 'tab') {
      const step = r.step || stats(r.tab).current + 1;
      if (state.view === 'tab' && state.tab === r.tab) {
        if (state.step !== step) showStep(step, true);
      } else {
        root.innerHTML = intentHTML(r.tab, step);
        state.view = 'tab'; state.tab = r.tab; state.step = step;
        decorateImages(root, r.tab);
        observeCards();
        document.title = `${ESS[r.tab].je} — L’escalier des formes`;
        window.scrollTo(0, 0);
        enter(root);
        if (!r.form) { const t = $('.i-t', root); if (t) t.focus({ preventScroll: true }); }
      }
      if (r.form) openForm(r.tab, r.form);
      return;
    }
    if (r.view === 'verso') {
      if (state.view !== 'verso') {
        root.innerHTML = versoHTML();
        decorateModes(root);
        state.view = 'verso'; state.tab = null;
        document.title = 'Au verso : les repères — L’escalier des formes';
        window.scrollTo(0, 0);
        enter(root);
      }
      const target = r.panel && document.getElementById('verso-' + r.panel);
      if (target) { target.scrollIntoView({ block: 'start' }); const h = $('h2', target); if (h) h.focus({ preventScroll: true }); }
      else { const t = $('.i-t', root); if (t) t.focus({ preventScroll: true }); }
      return;
    }
    const was = state.view === 'home';
    if (!was) {
      root.innerHTML = homeHTML();
      state.view = 'home'; state.tab = null;
      document.title = 'L’escalier des formes — Prototype 1 + 4 · C';
      enter(root);
    }
    const tile = r.tile && document.getElementById('tile-' + r.tile);
    if (tile) { tile.scrollIntoView({ block: 'center' }); tile.focus({ preventScroll: true }); }
    else if (!was) { window.scrollTo(0, 0); const h = $('.h1', root); if (h) h.focus({ preventScroll: true }); }
  }

  function showStep(step, fromUser) {
    const tab = state.tab;
    state.step = step;
    const sec = $('#marche');
    if (!sec) return;
    sec.dataset.step = step;
    sec.innerHTML = marcheHTML(tab, step);
    refreshStair();
    observeCards();
    enter(sec);
    if (fromUser) {
      const h = $('#m-h');
      const top = h.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * 0.55) h.scrollIntoView({ block: 'start', behavior: reduce() ? 'auto' : 'smooth' });
      h.focus({ preventScroll: true });
    }
  }

  function openForm(tab, n) {
    const f = FORMS[`t${tab}-${n}`];
    if (!f) return;
    if (state.step !== f.step) showStep(f.step, false);
    if (f.step === 1) {
      const card = document.getElementById('f-' + f.id);
      if (card) { card.scrollIntoView({ block: 'center' }); card.classList.add('is-flash'); const b = $('.pb-ok', card); if (b) b.focus({ preventScroll: true }); }
      return;
    }
    const chip = document.getElementById('c-' + f.id);
    if (!chip) return;
    const d = chip.closest('details');
    if (d) d.open = true;
    toggleChip(chip, true);
    chip.scrollIntoView({ block: 'center' });
    chip.focus({ preventScroll: true });
  }

  function toggleChip(btn, forceOpen) {
    const f = FORMS[btn.dataset.chip];
    const det = document.getElementById('det-' + btn.dataset.g);
    if (!f || !det) return;
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    $$(`[data-g="${btn.dataset.g}"]`).forEach(b => b.setAttribute('aria-expanded', 'false'));
    if (isOpen && !forceOpen) { det.hidden = true; det.innerHTML = ''; return; }
    btn.setAttribute('aria-expanded', 'true');
    det.innerHTML = detailHTML(f);
    det.hidden = false;
    det.setAttribute('aria-label', `Détail : ${f.e}`);
    enter(det);
    markSeen(f);
  }

  /* Marche 1 : une carte vue à l'écran compte comme « vue ». */
  let io = null;
  function observeCards() {
    if (io) io.disconnect();
    if (!('IntersectionObserver' in window)) return;
    io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting && en.intersectionRatio >= 0.6) { markSeen(FORMS[en.target.dataset.card]); io.unobserve(en.target); }
      });
    }, { threshold: [0.6] });
    $$('[data-card]').forEach(el => io.observe(el));
  }

  /* ---------- Mise à jour après un changement de progression ---------- */
  let lastLit = null;
  function announce(msg) {
    const live = document.getElementById('live');
    if (!live) return;
    live.textContent = '';
    setTimeout(() => { live.textContent = msg; }, 30);
  }
  function refreshStair() {
    const box = document.getElementById('stair');
    if (!box || !state.tab) return;
    const a = document.activeElement;
    const focusStep = a && box.contains(a) ? (a.dataset.step || (a.getAttribute('href') || '').slice(-1)) : null;
    const focusSvg = a && a.classList && a.classList.contains('blk-a');
    box.innerHTML = stairBlockHTML(state.tab, state.step);
    if (focusStep) {
      const el = focusSvg ? $(`.blk-a[href$="-${focusStep}"]`, box) : $(`.sb[data-step="${focusStep}"]`, box);
      if (el) el.focus({ preventScroll: true });
    }
  }
  function refreshForms() {
    $$('[data-pf]').forEach(el => {
      const f = FORMS[el.dataset.pf];
      if (!f) return;
      const s = statusOf(f);
      const pst = $('.pst', el);
      pst.dataset.st = s.st; pst.dataset.rv = s.revoir;
      $('.pst-t', el).textContent = ST_TXT[s.st] + (s.revoir ? ' · à revoir' : '');
      $('.pb-ok', el).setAttribute('aria-pressed', String(s.connu));
      $('.pb-rv', el).setAttribute('aria-pressed', String(s.revoir));
    });
    $$('[data-chip]').forEach(b => {
      const f = FORMS[b.dataset.chip];
      const s = statusOf(f);
      const sd = $('.sd', b);
      sd.dataset.st = s.st; sd.dataset.rv = s.revoir;
      $('.chip-st', b).textContent = `, ${ST_TXT[s.st].toLowerCase()}${s.revoir ? ', à revoir' : ''}`;
    });
    $$('details.sec').forEach(d => {
      const key = d.dataset.sec;
      const forms = $$('[data-chip]', d).map(b => FORMS[b.dataset.chip]);
      const c = secCount(forms);
      const sc = $('.sec-c', d);
      if (sc) sc.innerHTML = `${c.known ? `<b>${c.known}</b> / ` : ''}${plur(c.total, 'forme', 'formes')}`;
      const bar = $('.sec-bar', d);
      if (bar) bar.outerHTML = secBar(c);
      void key;
    });
  }
  function refresh() {
    if (state.view === 'tab' && state.tab) {
      const s = stats(state.tab);
      const lit = s.st.map(x => x.lit);
      if (lastLit && lastLit.tab === state.tab) {
        lit.forEach((v, i) => { if (v && !lastLit.lit[i]) { announce(`Bravo ! La marche ${i + 1}, « ${STEP_NAMES[i]} », est éclairée.`); flashStep(i + 1); } });
      }
      lastLit = { tab: state.tab, lit };
      refreshStair();
      refreshForms();
      const foot = $('#marche .m-foot');
      if (foot) foot.outerHTML = footHTML(state.tab, state.step);
      const mn = $('#marche .m-n');
      if (mn) { const x = s.st[state.step - 1]; mn.textContent = `${plur(x.total, 'forme', 'formes')}${x.known ? ` · ${x.known} connue${x.known > 1 ? 's' : ''}` : ''}`; }
    } else if (state.view === 'home') {
      ORDER.forEach(t => { const el = document.querySelector(`[data-tile="${t}"]`); if (el) el.innerHTML = tileStairHTML(t, stats(t)); });
      const H = homeStats();
      const hs = document.getElementById('hero-stair');
      if (hs) hs.innerHTML = stairSVG(H, { static: true, label: 'Les trois marches, pour les 12 intentions' });
    }
  }
  function flashStep(n) {
    if (reduce()) return;
    setTimeout(() => {
      const el = document.querySelector(`#stair .sb[data-step="${n}"]`);
      if (el) { el.classList.remove('is-new'); void el.offsetWidth; el.classList.add('is-new'); }
    }, 40);
  }

  function act(btn) {
    const f = FORMS[btn.dataset.f];
    if (!f) return;
    const r = P.get(f.track);
    if (btn.dataset.act === 'connu') {
      P.marquer(f.track, 'connu', TOOL);
    } else {
      if (r && r.connu && !r.revoir) P.marquer(f.track, 'connu', TOOL);   // « à revoir » : on ne la connaît plus vraiment
      P.marquer(f.track, 'revoir', TOOL);
    }
  }

  function speak(text) {
    try {
      const synth = window.speechSynthesis;
      const u = new SpeechSynthesisUtterance(String(text).replace(/—/g, ' ').replace(/…/g, ', '));
      u.lang = 'fr-CA';
      const voices = synth.getVoices() || [];
      const v = voices.find(x => /^fr[-_]CA/i.test(x.lang)) || voices.find(x => /^fr/i.test(x.lang));
      if (v) u.voice = v;
      u.rate = 0.92;
      synth.cancel();
      synth.speak(u);
    } catch (e) { /* synthèse vocale indisponible */ }
  }

  function initTheme() {
    const btn = document.getElementById('theme-btn');
    if (!btn) return;
    const root = document.documentElement;
    const isDark = () => {
      const t = root.getAttribute('data-theme');
      if (t) return t === 'dark';
      return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    };
    const sync = () => {
      btn.setAttribute('aria-label', isDark() ? 'Passer au thème clair' : 'Passer au thème sombre');
      btn.setAttribute('aria-pressed', String(isDark()));
    };
    btn.addEventListener('click', () => {
      const next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('p14c:theme', next); } catch (e) { /* stockage indisponible */ }
      sync();
    });
    sync();
  }

  function init() {
    initTheme();
    document.addEventListener('click', e => {
      const t = e.target;
      const say = t.closest('[data-say]');
      if (say) { speak(say.getAttribute('data-say')); return; }
      const a = t.closest('[data-act]');
      if (a) { act(a); return; }
      const chip = t.closest('[data-chip]');
      if (chip) { toggleChip(chip); return; }
      const x = t.closest('[data-close]');
      if (x) {
        const chipEl = document.getElementById('c-' + x.dataset.close);
        if (chipEl) { toggleChip(chipEl); chipEl.focus(); }
      }
    });
    P.surChangement(refresh);
    window.addEventListener('hashchange', render);
    render();
    if (state.view === 'tab') lastLit = { tab: state.tab, lit: stats(state.tab).st.map(x => x.lit) };
  }

  window.P14 = { model, stats, findDiag, FORMS, ORDER };
  init();
})();
