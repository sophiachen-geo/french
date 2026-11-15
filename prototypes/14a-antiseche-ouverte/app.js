/* Variante A · « L’antisèche qui s’ouvre » — prototypes 1 (« Je veux… ») + 4 (« Antisèche »).
   Accueil (recto) : l’antisèche — 12 tuiles rangées par moment de la conversation, chacune avec son
   pictogramme, l’intention, 3 formules (selon le registre), la variante québécoise et les formes découvertes.
   Une tuile s’ouvre : sur place (ordinateur) ou en plein écran (téléphone), avec l’écran « Je veux… »
   du prototype 1, puis « Découvrir d’autres formes » : tout le reste de l’onglet, 5 à la fois.
   Suivi : window.PROGRES (outil « decouvrir ») — « vu » à l’ouverture, « Je connais » / « À revoir ».
   Verso : le temps, les modes, les registres, les structures, les enchaînements. */
(function () {
  'use strict';

  const S = window.SITE, C = window.CADRES, V = window.VIZ, D = window.P14A;
  if (!S || !C || !V || !D) return;
  const M = S.meta;
  const P = window.PROGRES || {
    cle: s => C.norm(s), marquer() { return 'nouveau'; }, get() { return null; }, statut() { return 'nouveau'; },
    resume(l) { const n = new Set(l).size; return { total: n, nouveau: n, vu: 0, 'en-cours': 0, maitrise: 0, revoir: 0 }; },
    surChangement() {}
  };
  const TOOL = 'decouvrir';
  const STEP = 5;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const md = s => V.md(s);
  /* Espaces insécables du français : « … », ? ! : ; (même longueur : les positions restent valables). */
  const nbsp = s => String(s == null ? '' : s).replace(/ ([;:?!»])/g, '\u00A0$1').replace(/« /g, '«\u00A0');
  const T = s => esc(nbsp(s));
  const key = s => C.norm(s).replace(/^[\s.,]+/, '').replace(/[\s.;:,!?]+$/, '');
  const pad = n => String(n).padStart(2, '0');
  const reduce = () => C.reduceMotion();
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

  const ESS = {};
  M.essentiels.forEach(e => { ESS[e.tab] = e; });
  const MOMENTS = M.moments;
  const ORDER = MOMENTS.reduce((a, m) => a.concat(m.tabs), []).filter(t => ESS[t]);
  const MOM = {};
  MOMENTS.forEach((m, i) => m.tabs.forEach(t => { MOM[t] = { m, i }; }));
  const tabLink = tab => C.siteLink('#onglet-' + tab);

  /* ---------- Préférences (ce navigateur seulement) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('p14a:' + k); return v === null ? d : v; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('p14a:' + k, v); } catch (e) { /* indisponible */ } }
  };

  /* ---------- Registres ---------- */
  const REGS = [
    { id: 'amis', label: 'Entre amis', lvl: 0 },
    { id: 'neutre', label: 'Neutre', lvl: 1 },
    { id: 'formel', label: 'Formel', lvl: 2 }
  ];
  const REG_IDS = REGS.map(r => r.id);
  let REG = REG_IDS.includes(store.get('reg', 'neutre')) ? store.get('reg', 'neutre') : 'neutre';
  const codesOf = r => (Array.isArray(r) ? r : String(r || 'C').split(/\s*,\s*/)).filter(Boolean);
  const levelOf = codes => codes.includes('S') ? 2 : codes.some(c => c === 'O' || c === 'QC' || c === 'F-QC') ? 0 : 1;
  const regText = codes => codes.map(c => D.regLabel[c] || c).join(' · ');
  const meter = lvl => `<span class="meter m${lvl}" aria-hidden="true"><i></i><i></i><i></i></span>`;
  const TAG = { O: 'oral', QC: 'Québec', 'F-QC': 'familier', S: 'soutenu' };
  const tagsHTML = codes => codesOf(codes).filter(c => TAG[c]).map(c => `<span class="tg tg-${c.toLowerCase().replace(/[^a-z]/g, '')}">${TAG[c]}</span>`).join('');

  /* ---------- Schémas : trouver la ligne qui dessine une formule (repris du prototype 1) ---------- */
  const rowSpecs = tab => V.forTab(tab).filter(s => !s.type || s.type === 'rows');
  const labelKey = l => key(String(l).replace(/\[[^\]]+\]/g, ''));
  const labelAlts = l => String(l).replace(/\[[^\]]+\]/g, '').split(/\s+\/\s+/).map(a => key(a.replace(/\s\+\s.*$/, '')));

  function findDiagram(tab, e, c, diagKey) {
    const k = diagKey || key(e);
    const specs = rowSpecs(tab);
    const byLabel = label => { for (const s of specs) { const r = s.rows.find(x => x.label === label); if (r) return { spec: s, row: r }; } return null; };
    const al = (D.alias[tab] || {})[k];
    if (al) { const f = byLabel(al); if (f) return f; }
    const cu = (D.custom[tab] || {})[k];
    if (cu) { const base = V.byId(cu.base); if (base) return { spec: base, row: { label: e, marks: cu.marks } }; }
    const full = key(e + (c ? ' ' + c : ''));
    for (const s of specs) { const r = s.rows.find(x => labelKey(x.label) === full); if (r) return { spec: s, row: r }; }
    const alts = String(e).split(/\s+\/\s+/).map(key);
    for (const a of alts) for (const s of specs) { const r = s.rows.find(x => labelAlts(x.label).includes(a)); if (r) return { spec: s, row: r }; }
    for (const a of alts) if (a.length >= 6) for (const s of specs) { const r = s.rows.find(x => labelAlts(x.label).some(y => y.startsWith(a))); if (r) return { spec: s, row: r }; }
    return null;
  }

  /* Une seule ligne de schéma, sans libellé (la carte porte déjà l'expression). */
  function miniViz(found, e) {
    if (!found) return '';
    const s = found.spec;
    const spec = { type: 'rows', axis: s.axis, lanes: s.lanes, flow: s.flow, baseline: s.baseline, rows: [found.row] };
    const own = found.own || found.row.label === e || labelAlts(found.row.label).includes(key(String(e).split(/\s+\/\s+/)[0].split(/\s\+\s/)[0]));
    const cap2 = found.cap ? `<p class="mini-c">Sur la frise : <b>${T(found.cap.toLowerCase())}</b></p>`
      : own ? '' : `<p class="mini-c">Même schéma que <b>${T(String(found.row.label).replace(/\s*\[[^\]]+\]/g, ''))}</b></p>`;
    return `<div class="mini">${V.render(spec, { examples: false, title: false })}${cap2}</div>`;
  }

  /* Pictogramme d'une fonction (repris du prototype 4) : le dessin seul, sans les mots longs. */
  const iconMarks = marks => marks.filter(m => m.k !== 'text').map(m => {
    const o = Object.assign({}, m);
    if ((o.k === 'box' || o.k === 'wall' || o.k === 'gap') && o.text && o.text.length > 3) delete o.text;
    return o;
  });
  function iconSpec(tab) {
    const [id, pick] = D.icon[tab] || [];
    const s = id && V.byId(id);
    if (!s) return null;
    if (Array.isArray(pick)) {
      const rows = pick.map(i => s.rows[i]);
      const marks = [];
      rows.forEach((r, lane) => iconMarks(r.marks).forEach(m => marks.push(Object.assign(m, { lane }))));
      return { lanes: 2, rows: [{ label: rows.map(r => r.label).join(' / '), sub: 'doute ou opinion', marks }] };
    }
    const r = s.rows[pick];
    return { lanes: s.lanes, axis: s.axis, flow: s.flow, baseline: s.baseline, rows: [{ label: r.label, sub: r.sub, marks: iconMarks(r.marks) }] };
  }
  const iconHTML = tab => { const i = iconSpec(tab); return i ? V.render(i, { title: false, examples: false }) : ''; };
  const glyph = tab => `<span class="glyph" aria-hidden="true">${iconHTML(tab)}</span>`;

  /* Lien de chaque ligne de schéma vers l'expression dans le site complet. */
  const rowLink = tab => row => {
    if (!row || !row.label) return null;
    for (const a of labelAlts(row.label)) {
      const it = C.findItem(a, tab) || C.findItem(a);
      if (it) return C.siteLink(C.itemHref(it));
    }
    return tabLink(tab);
  };

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
    for (const alt of String(e).split(/\s+\/\s+/)) {
      const parts = alt.split('…').filter(x => trimP(x));
      const out = [];
      let pos = 0;
      parts.forEach(p => { const h = searchPart(p, ex, pos); if (h) { out.push(h); pos = h[1]; } });
      if (out.length) return out;
    }
    return [];
  }
  /* Toutes les parties de l'expression, mot pour mot (pour chercher un exemple dans le site). */
  function altsOf(e) {
    const alts = String(e).split(/\s+\/\s+/);
    const w0 = alts[0].split(/\s+/);
    return alts.map((a, i) => {
      const w = a.split(/\s+/);
      return i && w.length < w0.length ? w0.slice(0, w0.length - w.length).concat(w).join(' ') : a;
    });
  }
  function exactRanges(e, ex) {
    for (const alt of altsOf(e)) {
      const parts = alt.split('…').map(trimP).filter(Boolean);
      if (!parts.length) continue;
      const out = [];
      let pos = 0, ok = true;
      for (const p of parts) {
        const re = partRegex(p);
        const m = re && re.exec(ex.slice(pos));
        if (!m) { ok = false; break; }
        out.push([pos + m.index, pos + m.index + m[0].length]);
        pos += m.index + m[0].length;
      }
      if (ok) return out;
    }
    return null;
  }

  /* Voies : 'c' = ce que l'expression introduit (orange), 'm' = phrase principale (violet). */
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
    const ranges = findRanges(e, ex);
    const hl = new Array(ex.length).fill(false);
    ranges.forEach(([a, b]) => { for (let i = a; i < b; i++) hl[i] = true; });
    if (/^\s*—/.test(ex)) {
      const turns = [];
      const re = /—\s*/g;
      let m;
      const starts = [];
      while ((m = re.exec(ex))) starts.push([m.index, m.index + m[0].length]);
      starts.forEach((s, k) => { const end = k + 1 < starts.length ? starts[k + 1][0] : ex.length; turns.push([s[1], end]); });
      return `<span class="dlg">${turns.map(([a, b], k) => {
        let bb = b; while (bb > a && /\s/.test(ex[bb - 1])) bb--;
        const who = k % 2 === 0 ? 'm' : 'c';
        return `<span class="turn t-${who}"><span class="who">${who === 'm' ? 'l’autre' : 'toi'}</span><span>${spansHTML(ex, a, bb, null, hl)}</span></span>`;
      }).join('')}</span>`;
    }
    return spansHTML(ex, 0, ex.length, lanesFor(ex, ranges), hl);
  }
  /* Exemple court sur une tuile : seulement le surlignage. */
  function markHTML(ex, e) {
    const hl = new Array(ex.length).fill(false);
    findRanges(e, ex).forEach(([a, b]) => { for (let i = a; i < b; i++) hl[i] = true; });
    return spansHTML(ex, 0, ex.length, null, hl);
  }

  /* ---------- La formule, avec la case « ce qui suit » ---------- */
  function slot(label, sub, tone) {
    return `<span class="slot s-${tone || 'c'}"><span class="slot-l">${esc(label)}</span>${sub ? `<span class="slot-s">${esc(sub)}</span>` : ''}</span>`;
  }
  function formulaHTML(card) {
    const e = card.e, tab = card.tab;
    const cc = card.c ? String(card.c).replace(/^\+\s*/, '').trim() : '';
    const word = t => t.trim() ? `<span class="f-e">${T(t.trim())}</span>` : '';
    if (cc.includes('→')) {
      const [a, b] = cc.split('→').map(x => x.trim());
      return `${word(e)} ${slot('une phrase', a)} <span class="f-arr" aria-hidden="true">→</span> ${slot('une phrase', b, 'm')}`;
    }
    const cl = cc ? (D.slots[cc] || [cc, '']) : null;
    const parts = e.split('…');
    const hasDots = parts.length > 1;
    const toks = [];
    if (tab === 2 && card.src === 'cle') toks.push(slot('un nom', '', 'm'));
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
      else if (card.src === 'cle' && tab !== 12 && !ends) toks.push(slot('la suite', ''));
    } else if (/que$/.test(parts[parts.length - 1].trim()) && cl) {
      toks.push(slot('le résultat', ''));
    }
    return toks.join(' ').replace(/ (<span class="f-e">,)/g, '$1');
  }
  /* Formule d'une forme de l'onglet : « Il y a + durée + que + ind. », « si + présent → futur »… */
  function wordsHTML(t) {
    const parts = t.split('…');
    const toks = [];
    parts.forEach((p, i) => {
      if (p.trim()) toks.push(`<span class="f-e">${T(p.trim())}</span>`);
      if (i < parts.length - 1) toks.push(i === 0 && !p.trim() ? slot('une phrase', '', 'm') : slot('la suite', ''));
    });
    return toks.join(' ');
  }
  function formFormulaHTML(f) {
    const [left, right] = f.main.split(/\s→\s/);
    const toks = left.split(/\s\+\s/).map(s => s.trim()).filter(Boolean);
    const out = toks.map((t, i) => {
      const sl = i > 0 && D.slots[t];
      return sl ? slot(sl[0], sl[1]) : wordsHTML(t);
    });
    if (right) out.push(`<span class="f-arr" aria-hidden="true">→</span> ${slot('une phrase', right.trim(), 'm')}`);
    return out.join(' ').replace(/ (<span class="f-e">,)/g, '$1');
  }
  const consKind = c => C.consKind(String(c || '').replace(/^\+\s*/, ''));
  const chipHTML = c => c ? `<span class="chip k-${consKind(c)}">${esc(/^\+/.test(c) ? c : '+ ' + c)}</span>` : '';

  /* ---------- Progression (window.PROGRES) ---------- */
  const exprOf = e => String(e).split(/\s+\/\s+/)[0].replace(/^[\s.,…]+/, '').trim();
  const kOf = e => P.cle(exprOf(e));
  function stOf(k) {
    const r = P.get(k);
    if (r && r.revoir) return 'revoir';
    return P.statut(k);
  }
  const ST_LABEL = { nouveau: 'Nouvelle', vu: 'Vue', 'en-cours': 'En cours', maitrise: 'Je connais', revoir: 'À revoir' };
  const I_CHECK = '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M4 10.5 8.2 14.5 16 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const I_FLAG = '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M5 18V3" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M5 3.5h10l-2.4 3.6L15 10.7H5" fill="currentColor" fill-opacity=".22" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
  function pgHTML(e) {
    const ex = exprOf(e), k = P.cle(ex), r = P.get(k);
    return `<div class="pg" data-k="${esc(k)}" data-e="${esc(ex)}" role="group" aria-label="Où j’en suis avec « ${esc(ex)} »">
      <button type="button" class="pg-b pg-ok" data-pg="connu" aria-pressed="${!!(r && r.connu)}">${I_CHECK}<span>Je connais</span></button>
      <button type="button" class="pg-b pg-rev" data-pg="revoir" aria-pressed="${!!(r && r.revoir)}">${I_FLAG}<span>À revoir</span></button>
    </div>`;
  }
  function progVals(exprs) {
    const r = P.resume(exprs);
    const seen = r.total - r.nouveau;
    const pc = n => r.total ? Math.round(n / r.total * 1000) / 10 : 0;
    return { r, seen, ok: pc(r.maitrise), vu: pc(seen - r.maitrise) };
  }
  function progHTML(exprs, attr, long) {
    const v = progVals(exprs);
    return `<div class="prog${long ? ' prog-l' : ''}" ${attr}>
      <span class="pbar" aria-hidden="true"><i class="pb-ok" style="width:${v.ok}%"></i><i class="pb-vu" style="width:${v.vu}%"></i></span>
      <span class="pt"><b class="pt-n">${v.seen}</b> / <span class="pt-t">${v.r.total}</span> ${long ? 'formes découvertes' : 'découvertes'}<span class="pt-r"${v.r.revoir ? '' : ' hidden'}> · <span class="pt-rn">${v.r.revoir}</span> à revoir</span></span>
    </div>`;
  }
  function fillProg(el, exprs) {
    const v = progVals(exprs);
    const q = s => el.querySelector(s);
    q('.pb-ok').style.width = v.ok + '%';
    q('.pb-vu').style.width = v.vu + '%';
    q('.pt-n').textContent = v.seen;
    q('.pt-t').textContent = v.r.total;
    q('.pt-rn').textContent = v.r.revoir;
    q('.pt-r').hidden = !v.r.revoir;
  }

  /* ---------- Phrases réelles du site, pour trouver un exemple à chaque forme ---------- */
  let CORPUS = null;
  function corpus() {
    if (CORPUS) return CORPUS;
    const out = [];
    const add = (text, tabs) => { if (text && String(text).trim()) out.push({ text: String(text).trim(), tabs: tabs.filter(Boolean) }); };
    (M.essentiels || []).forEach(e => e.cles.concat(e.qc).forEach(x => add(x.ex, [e.tab])));
    (M.visuels || []).forEach(s => (s.rows || []).forEach(r => { if (r.ex) add(r.ex, [s.tab]); }));
    S.fiches.forEach(f => f.fonctions.forEach(fn => { add(fn.oral, [fn.tab]); add(fn.ecrit, [fn.tab]); }));
    Object.keys(D.formal).forEach(t => D.formal[t].forEach(x => add(x.ex, [+t])));
    ((M.demo && M.demo.rows) || []).forEach(r => add(r.phrase.replace(/[{}]/g, ''), [r.tab]));
    S.models.forEach(m => {
      const txt = m.segments.map(s => s[1]).join('').replace(/\*\*/g, '');
      const tabs = C.uniq(m.steps.map(s => s[1]));
      txt.split('\n').forEach(line => line.split(/(?<=[.!?])\s+(?=[A-ZÀ-ÖØ-Þ«—])/).forEach(sen => add(sen, tabs)));
    });
    if (S.pages.methode) C.parseBlocks(S.pages.methode.md).filter(b => b.t === 'quote').forEach(b => b.paras.forEach(p => p.replace(/\*/g, '').split(/(?<=[.!?])\s+(?=[A-ZÀ-ÖØ-Þ«—])/).forEach(sen => add(sen, []))));
    return (CORPUS = out);
  }
  const letters = k => k.replace(/[^a-z]/g, '').length;
  /* Ce que l'on cherche dans une phrase : les mots de la forme, sans les notations (+ nom, + ind.…). */
  function matchPattern(main) {
    const left = main.split(/\s→\s/)[0];
    return left.split(/\s\+\s/).map(s => s.trim()).filter((t, i) => i === 0 || !D.slots[t]).join('…').replace(/…{2,}/g, '…');
  }
  /* La phrase contient-elle vraiment cette forme (et pas une expression plus longue du site) ? */
  let KEYLIST = null;
  const keyList = () => KEYLIST || (KEYLIST = Array.from(C.BY_KEY.keys()));
  function fits(f, pat, text, strict) {
    const rg = exactRanges(pat, text);
    if (!rg) return false;
    if (!strict) return true;
    const a = rg[0][0], b = rg[rg.length - 1][1];
    if (a > 0 && /[-'’]/.test(text[a - 1])) return false;
    if (/[?!]\s*$/.test(f.head) && !/^\s*[?!]/.test(text.slice(b))) return false;
    const m = text.slice(a, b), before = text.slice(0, a);
    const after = text.slice(b).replace(/(^|\s)qu['’]\S*/gi, '$1que').replace(/(^|\s)d['’]\S*/gi, '$1de').replace(/(^|\s)s['’]il/gi, '$1si');
    for (let k = 1; k <= 3; k++) {
      const pm = before.match(new RegExp(`(?:\\S+\\s+){${k}}$`));
      if (!pm) break;
      const cand = key(pm[0] + m);
      if (keyList().some(x => x === cand || x.startsWith(cand + ' ') || x.startsWith(cand + ','))) return false;
    }
    for (let k = 1; k <= 2; k++) {
      const nm = after.match(new RegExp(`^(?:\\s*[^\\s,.;:!?]+){${k}}`));
      if (!nm) break;
      const cand = key(m + nm[0]);
      if (cand !== f.k && C.BY_KEY.has(cand)) return false;
    }
    return true;
  }
  /* Une ligne de schéma « porte » la forme si la tête et la construction correspondent. */
  function rowCarries(f, label) {
    const itemCons = consNorm(f.main.split(/\s\+\s/).slice(1).join(' + '));
    const head = key(f.head);
    return String(label).replace(/\[[^\]]+\]/g, '').split(/\s+\/\s+/).some(alt => {
      const parts = alt.split(/\s\+\s/);
      return key(parts[0]) === head && consMatch(consNorm(parts.slice(1).join(' + ')), itemCons);
    });
  }
  function exampleFor(f) {
    if (f.exDone) return f.ex;
    f.exDone = true;
    if ((D.noex[f.tab] || []).includes(f.main)) return (f.ex = null);
    const pat = matchPattern(f.main);
    for (const s of rowSpecs(f.tab)) for (const r of s.rows) {
      if (r.ex && rowCarries(f, r.label) && fits(f, pat, r.ex)) return (f.ex = { text: r.ex });
    }
    for (const fi of S.fiches) {
      const keys = [fi.key].concat(fi.aliases || []).map(x => P.cle(x));
      if (!keys.includes(f.k)) continue;
      const fn = fi.fonctions.find(x => x.tab === f.tab && fits(f, pat, x.oral));
      if (fn) return (f.ex = { text: fn.oral, sens: fn.sens });
    }
    const fo = (D.formal[f.tab] || []).find(x => P.cle(x.key) === f.k && fits(f, pat, x.ex));
    if (fo) return (f.ex = { text: fo.ex });
    const lt = letters(f.k), words = f.k.split(/\s+/).length;
    if (words >= 2 ? lt >= 4 : lt >= 6) {
      for (const c of corpus()) if (c.tabs.includes(f.tab) && fits(f, pat, c.text, true)) return (f.ex = { text: c.text });
    }
    if (words >= 2 ? lt >= 8 : lt >= 9) {
      for (const c of corpus()) if (!c.tabs.includes(f.tab) && fits(f, pat, c.text, true)) return (f.ex = { text: c.text, other: true });
    }
    return (f.ex = null);
  }

  /* ---------- Formes à découvrir : le reste de l'onglet ---------- */
  const DISC = {}, DSENS = {}, FORM = {};
  const consNorm = c => C.norm(String(c || '').replace(/^\+\s*/, '')).replace(/\bcond\.(?=\s|$)/g, 'conditionnel').replace(/\bind\.(?=\s|$)/g, 'indicatif').trim();
  const consMatch = (a, b) => {
    if (!a || !b || a === b) return true;
    const [lo, sh] = a.length > b.length ? [a, b] : [b, a];
    return lo.startsWith(sh) && !/\+/.test(lo.slice(sh.length));
  };
  const isQCsub = f => /qu[ée]bec/i.test(f.sub || '');
  /* Expression suivie dans PROGRES : les mots jusqu'à la première notation (« pour + lequel » → « pour lequel »). */
  function trackOf(main) {
    const toks = main.split(/\s→\s/)[0].split(/\s\+\s/).map(x => x.trim());
    let n = 1;
    while (n < toks.length && !D.slots[toks[n]]) n++;
    return toks.slice(0, n).join(' ');
  }
  function discover(tab) {
    if (DISC[tab]) return DISC[tab];
    const E = ESS[tab];
    const ess = E.cles.concat(E.qc).map(x => ({ k: kOf(x.e), c: consNorm(x.c) }));
    const sens = new Map();
    const addSens = (k, t) => {
      if (!k || !t) return;
      t = cap(String(t).trim().replace(/[.\s]+$/, ''));
      const a = sens.get(k) || [];
      if (!a.includes(t)) a.push(t);
      sens.set(k, a);
    };
    const raw = [];
    C.TABS[tab].items.forEach(it => {
      const plain = it.plain.replace(/\s+/g, ' ').trim();
      if (/≠/.test(plain)) return;
      let main = plain, note = '';
      const mc = plain.match(/^(.+?)\s:\s(.+)$/);
      if (mc) { main = mc[1]; note = mc[2]; }
      else if (it.rest && /^,/.test(it.rest)) { main = plain.slice(0, plain.length - it.rest.length).trim(); note = it.rest.replace(/^,\s*/, ''); }
      main = main.replace(/[\s;]+$/, '');
      if (/\s→\s/.test(main) && !/\s\+\s/.test(main.split(/\s→\s/)[0])) return;
      const track = trackOf(main);
      const k = P.cle(track);
      if (!k) return;
      if (it.section.kind !== 'section') { if (note) addSens(k, note); return; }
      if (note) addSens(k, note);
      raw.push({ it, main, track, k, defOnly: !!note && !/\s\+\s/.test(main) });
    });
    S.fiches.forEach(fi => fi.fonctions.forEach(fn => {
      if (fn.tab !== tab) return;
      [fi.key].concat(fi.aliases || []).forEach(x => addSens(P.cle(x), fn.sens));
    }));
    const list = [], seen = new Set();
    raw.forEach(r => {
      const cons = consNorm(r.main.split(/\s\+\s/).slice(1).join(' + '));
      const sig = r.k + '|' + cons;
      if (seen.has(sig)) return;
      if (r.defOnly && (raw.some(o => o !== r && !o.defOnly && o.k === r.k) || ess.some(s => s.k === r.k))) return;
      seen.add(sig);
      if (ess.some(s => s.k === r.k && consMatch(s.c, cons))) return;
      const it = r.it;
      const head = r.main.split(/\s\+\s/)[0].split(/\s→\s/)[0].trim();
      const after = r.main.slice(head.length).trim();
      const f = { id: 'd-' + it.id, tab, it, main: r.main, track: r.track, head, after, k: r.k, regs: it.regs, sec: it.section, sub: it.sub, row: it.row };
      FORM[f.id] = f;
      list.push(f);
    });
    list.forEach(f => { f.sens = (f.row ? [f.row] : []).concat(sens.get(f.k) || []).filter((x, i, a) => a.indexOf(x) === i).slice(0, 2); });
    DSENS[tab] = sens;
    return (DISC[tab] = list);
  }
  function diagFor(f) {
    if ((D.nodiag[f.tab] || []).includes(f.main)) return null;
    const rv = D.rowviz[f.tab] && f.row && D.rowviz[f.tab][f.row];
    if (rv) { const base = V.byId('durees'); if (base) return { spec: base, row: { label: f.main, marks: rv }, own: true, cap: f.row }; }
    const sv = D.subviz[f.tab] && f.sub && D.subviz[f.tab][f.sub];
    if (sv) { const s = V.byId(sv[0]); if (s && s.rows[sv[1]]) return { spec: s, row: s.rows[sv[1]] }; }
    const rest = f.main.split(/\s\+\s/).slice(1).join(' + ');
    return findDiagram(f.tab, f.head, rest ? '+ ' + rest : null);
  }

  const EXPRS = {};
  function tabExprs(tab) {
    if (EXPRS[tab]) return EXPRS[tab];
    const E = ESS[tab];
    return (EXPRS[tab] = E.cles.concat(E.qc).map(x => exprOf(x.e)).concat(discover(tab).map(f => f.track)));
  }
  let ALL = null;
  const allExprs = () => ALL || (ALL = ORDER.reduce((a, t) => a.concat(tabExprs(t)), []));

  /* ---------- Cartes de formules (écran « Je veux… ») ---------- */
  const canSpeak = 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';
  const I_SAY = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  function speakBtn(text, labelled) {
    if (!canSpeak || !text) return '';
    return labelled
      ? `<button type="button" class="say-l" data-say="${esc(text)}">${I_SAY}<span>Écouter</span></button>`
      : `<button type="button" class="say" data-say="${esc(text)}" aria-label="Écouter : ${esc(text)}">${I_SAY}</button>`;
  }

  function cardHTML(card, i) {
    const codes = codesOf(card.r);
    const lvl = levelOf(codes);
    const found = findDiagram(card.tab, card.e, card.c, card.diag);
    const it = card.item || C.findItem(key(card.e.split(/\s+\/\s+/)[0]), card.tab);
    const more = it ? C.siteLink(C.itemHref(it)) : tabLink(card.tab);
    const oral = card.flagOral ? '<p class="flag">Plutôt à l’oral : à l’écrit, préfère une formule neutre.</p>' : '';
    const sens = (DSENS[card.tab] && DSENS[card.tab].get(kOf(card.e))) || [];
    return `<article class="card lvl-${lvl}${card.src === 'formal' ? ' is-formal' : ''}" style="--i:${i}" data-seen data-e="${esc(exprOf(card.e))}">
      <div class="card-top"><span class="reg">${meter(lvl)}<span>${esc(regText(codes))}</span></span>${speakBtn(card.ex)}</div>
      <p class="formula">${formulaHTML(card)}</p>
      ${sens.length ? `<p class="sens"><b>Sens</b> ${sens.map(s => md(nbsp(s))).join(' · ')}</p>` : ''}
      ${card.ex ? `<p class="ex">${sentenceHTML(card.ex, card.e)}</p>` : ''}
      ${miniViz(found, card.e)}
      ${oral}
      ${alsoHTML(card)}
      <div class="card-foot">${pgHTML(card.e)}<a class="more" href="${esc(more)}">Plus d’exemples dans le site<span aria-hidden="true"> →</span></a></div>
    </article>`;
  }

  function alsoHTML(card) {
    const f = C.FICHE.get(key(card.e.split(/\s+\/\s+/)[0]));
    if (!f) return '';
    const seen = new Set();
    const others = f.fonctions.filter(x => x.tab !== card.tab && ESS[x.tab] && !seen.has(x.tab) && seen.add(x.tab));
    if (!others.length) return '';
    return `<div class="also"><p class="also-h">Le même mot sert aussi à…</p>${others.map(x =>
      `<a class="also-l" href="#t${x.tab}">${glyph(x.tab)}<span><b>${esc(x.fonction)}</b> · ${esc(ESS[x.tab].je)}</span></a>`).join('')}</div>`;
  }

  function cardsFor(tab, reg) {
    const E = ESS[tab];
    const cles = E.cles.map(x => ({ tab, e: x.e, c: x.c, ex: x.ex, r: x.r || 'C', src: 'cle' }));
    const qc = E.qc.map(x => ({ tab, e: x.e, c: x.c, ex: x.ex, r: x.r || 'C', src: 'qc' }));
    const informal = c => levelOf(codesOf(c.r)) === 0;
    if (reg === 'amis') {
      return [
        { title: 'Entre amis, au Québec', note: 'Ce que tu entends tous les jours, à Montréal comme à Québec.', cards: qc.concat(cles.filter(informal)) },
        { title: 'Ça marche aussi entre amis', cards: cles.filter(c => !informal(c)) }
      ];
    }
    if (reg === 'formel') {
      const featured = [];
      const used = new Set();
      (D.formal[tab] || []).forEach(f => {
        const it = C.findItem(key(f.key), tab);
        if (!it) return;
        used.add(it.id);
        featured.push({ tab, e: it.head.replace(/…$/, '') + (/…$/.test(it.head) ? '…' : ''), c: it.cons, ex: f.ex, r: it.regs, src: 'formal', item: it, diag: f.diag });
      });
      const hasS = C.TABS[tab].items.some(x => x.regs.includes('S'));
      const seen = new Set();
      const rest = C.TABS[tab].items.filter(x => x.regs.includes('S') && !used.has(x.id) && !seen.has(x.plain) && seen.add(x.plain));
      return [
        { title: 'Pour un courriel, une lettre, une entrevue', note: hasS ? 'Expressions marquées « soutenu » dans le site.' : 'Aucune expression de cette fonction n’est marquée « soutenu » : ces formules courantes passent très bien à l’écrit.', cards: featured, rest },
        { title: 'Ça marche aussi en formel', cards: cles.filter(c => !informal(c)) },
        { title: 'À garder pour l’oral', cards: cles.filter(informal).map(c => Object.assign({ flagOral: true }, c)) }
      ];
    }
    return [{ title: 'Les formules clés', cards: cles }];
  }

  function groupsHTML(tab) {
    let n = 0;
    discover(tab);
    return cardsFor(tab, REG).filter(g => g.cards.length || (g.rest && g.rest.length)).map(g => `
      <section class="group">
        <h3 class="g-h">${esc(g.title)}</h3>
        ${g.note ? `<p class="g-note">${esc(g.note)}</p>` : ''}
        <div class="cards">${g.cards.map(c => cardHTML(c, n++)).join('')}</div>
        ${g.rest && g.rest.length ? `<p class="rest"><span>Aussi soutenu :</span> ${g.rest.map(it => {
          const fid = 'd-' + it.id;
          return FORM[fid] ? `<button type="button" class="rest-b" data-spot="${fid}">${esc(it.plain)}</button>` : `<a class="rest-b" href="${esc(C.siteLink(C.itemHref(it)))}">${esc(it.plain)}</a>`;
        }).join('')}</p>` : ''}
      </section>`).join('');
  }

  function legendFor(tab) {
    const s = rowSpecs(tab).find(x => Array.isArray(x.legend)) || null;
    const items = s ? s.legend : [['cadre', 'ce que l’expression introduit'], ['main', 'la phrase principale']];
    const lanes = tab === 12 ? [['main', 'l’autre personne'], ['cadre', 'toi']] : items;
    return `<p class="lg">${lanes.map(([c, t]) => `<span class="lg-${c === 'main' ? 'm' : c === 'cadre' ? 'c' : 'x'}"><i></i>${esc(t)}</span>`).join('')}</p>`;
  }

  function qcBandHTML(tab) {
    if (REG !== 'neutre') return '';
    const E = ESS[tab];
    return `<section class="band" aria-labelledby="qc-h">
      <h3 class="band-h" id="qc-h">Entre amis, au Québec</h3>
      <ul class="qc">${E.qc.map(q => {
        const codes = codesOf(q.r || 'C');
        return `<li data-seen data-e="${esc(exprOf(q.e))}"><p class="qc-e">${T(q.e)}<span class="qc-r">${meter(levelOf(codes))}${esc(regText(codes))}</span>${speakBtn(q.ex)}</p><p class="qc-x">${sentenceHTML(q.ex, q.e)}</p></li>`;
      }).join('')}</ul>
      <button type="button" class="band-btn" data-reg-set="amis">Voir tout en « Entre amis »</button>
    </section>`;
  }

  /* Schémas transversaux filtrés pour l'onglet (prototype 1) */
  const THEMES = { 3: ['Temps', 'Maintenant', 'Attente'], 4: ['Cause'], 5: ['Conséquence'], 6: ['But'], 7: ['Hypothèse', 'Condition'], 8: ['Opposition', 'Deux côtés', 'Concession'], 10: ['Ajout'] };
  function extraSpecs(tab) {
    const out = [];
    const th = THEMES[tab] || [];
    ['registres', 'structures'].forEach(id => {
      const s = V.byId(id);
      if (!s) return;
      const rows = s.rows.filter(r => th.includes(r.theme));
      if (rows.length) out.push(Object.assign({}, s, { rows, themes: false }));
    });
    const modes = V.byId('modes');
    if (modes) {
      const cols = modes.cols.map(c => Object.assign({}, c, { items: c.items.filter(x => C.findItem(key(x.replace(/\s\+.*$/, '')), tab)) })).filter(c => c.items.length);
      if (cols.length >= 2) out.push(Object.assign({}, modes, { cols, intro: 'Seulement les expressions de cette intention.' }));
    }
    return out;
  }

  /* Liens entre fonctions (prototype 1) */
  function nextOf(tab) {
    const out = [], seen = new Set([tab]);
    const add = (to, rel) => { if (seen.has(to) || !ESS[to]) return; seen.add(to); out.push({ to, rel }); };
    M.chains.forEach(c => c.steps.forEach((s, i) => { if (s[1] === tab && c.steps[i + 1]) add(c.steps[i + 1][1], `${s[0]} → ${c.steps[i + 1][0]}`); }));
    S.models.forEach(m => m.steps.forEach((s, i) => { if (s[1] === tab && m.steps[i + 1]) add(m.steps[i + 1][1], `${s[0]} → ${m.steps[i + 1][0]}`); }));
    M.scenarios.forEach(sc => sc.fonctions.forEach((f, i) => { if (f === tab && sc.fonctions[i + 1]) add(sc.fonctions[i + 1], `Souvent ensuite · ${sc.theme}`); }));
    if (out.length < 2) { add(12, 'Conclusion → Relance'); add(1, 'Nouveau sujet'); }
    return out.slice(0, 3);
  }
  function nextHTML(tab) {
    const nx = nextOf(tab);
    if (!nx.length) return '';
    return `<div class="tree">
      <p class="tree-from"><span class="dot" aria-hidden="true"></span>${esc(ESS[tab].je)}</p>
      <ul class="tree-to">${nx.map(n => `<li><a class="go" href="#t${n.to}">
        <span class="go-rel">${esc(n.rel)}</span>
        <span class="go-je">${esc(ESS[n.to].je)}</span>
        ${glyph(n.to)}
      </a></li>`).join('')}</ul>
    </div>`;
  }
  function modelHTML(tab) {
    const m = S.models.find(x => x.steps.some(s => s[1] === tab));
    if (!m) return '';
    const rows = m.segments.map(([k, t]) => {
      const step = k == null ? null : m.steps[k];
      const cur = step && step[1] === tab;
      const label = step ? (cur ? `<span class="st-l is-cur">${esc(step[0])}</span>` : `<a class="st-l" href="#t${step[1]}">${esc(step[0])}</a>`) : '<span class="st-l is-other">l’autre</span>';
      return `<li class="${cur ? 'is-cur' : ''}${step ? '' : ' is-other'}"><span class="st-dot" aria-hidden="true"></span>${label}<span class="st-t">${md(nbsp(t.replace(/\n/g, ' ').trim()))}</span></li>`;
    }).join('');
    return `<div class="model"><p class="model-h">Dans une vraie conversation · <b>${esc(m.title)}</b></p><ol class="steps">${rows}</ol></div>`;
  }

  /* Ligne de la conversation : où se place cette intention */
  function mlineHTML(tab) {
    const cur = MOM[tab].m.id;
    return `<ol class="mline" aria-label="Moment de la conversation">${MOMENTS.map((m, i) => `<li class="${m.id === cur ? 'is-cur' : ''}"${m.id === cur ? ' aria-current="step"' : ''}><span class="md" aria-hidden="true">${i + 1}</span><span class="ml">${esc(m.label)}</span></li>`).join('')}</ol>`;
  }

  /* ---------- Découvrir d'autres formes ---------- */
  const DSHOWN = {};
  const DOPEN = new Set();
  const shownOf = tab => Math.min(discover(tab).length, DSHOWN[tab] || STEP);
  const regFits = f => REG === 'formel' ? f.regs.includes('S') : REG === 'amis' ? (levelOf(f.regs) === 0 || isQCsub(f)) : false;

  function tryHTML(f) {
    const toks = f.main.split(/\s→\s/)[0].split(/\s\+\s/).slice(1).map(t => D.slots[t]).filter(Boolean);
    const what = toks.length ? ` + ${toks.map(s => s[0]).join(' + ')}` : '';
    return `<span class="d-try-k">À toi</span> Fais ta propre phrase avec «&nbsp;${T(f.head)}&nbsp;»${esc(what)}. <span class="d-try-s">Pas encore d’exemple dans le site pour cette forme.</span>`;
  }
  function formBodyHTML(f) {
    const ex = exampleFor(f);
    const found = diagFor(f);
    const codes = codesOf(f.regs);
    const lvl = levelOf(codes);
    const sens = f.sens.slice();
    if (ex && ex.sens && !sens.includes(ex.sens)) sens.push(ex.sens);
    const pat = matchPattern(f.main);
    return `<div class="d-in">
      <div class="d-top"><span class="reg">${meter(lvl)}<span>${esc(regText(codes))}</span></span>${f.sub ? `<span class="d-sub">${esc(f.sub)}</span>` : ''}</div>
      <p class="formula f-sm">${formFormulaHTML(f)}</p>
      ${sens.length ? `<p class="sens"><b>Sens</b> ${sens.map(s => md(nbsp(s))).join(' · ')}</p>` : ''}
      ${ex ? `<p class="ex">${sentenceHTML(ex.text, pat)}</p>${ex.other ? '<p class="d-src">Exemple pris ailleurs dans le site.</p>' : ''}` : `<p class="d-try">${tryHTML(f)}</p>`}
      ${found ? miniViz(found, f.main) : ''}
      <div class="d-acts">${speakBtn(ex ? ex.text : f.head, true)}${pgHTML(f.track)}<a class="more" href="${esc(C.siteLink(C.itemHref(f.it)))}">Dans le site<span aria-hidden="true"> →</span></a></div>
    </div>`;
  }
  const I_CHEV = '<svg class="d-chev" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="M5 7.5 10 12.5 15 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function formItemHTML(f) {
    const open = DOPEN.has(f.id);
    const st = stOf(f.k);
    return `<li class="d-it${open ? ' is-open' : ''}${regFits(f) ? ' is-reg' : ''}" id="${f.id}" data-k="${esc(f.k)}" data-st="${st}">
      <button type="button" class="d-btn" aria-expanded="${open}" aria-controls="${f.id}-b">
        <span class="st-dot" aria-hidden="true"></span>
        <span class="d-name"><span class="d-e">${T(f.head)}</span>${f.after ? ` <span class="d-a">${esc(f.after)}</span>` : ''}${isQCsub(f) ? ' <span class="tg tg-qc">Québec</span>' : ''}${tagsHTML(f.regs)}</span>
        <span class="d-st"><span class="sr">, </span><span class="st-t">${ST_LABEL[st]}</span></span>
        ${I_CHEV}
      </button>
      <div class="d-body" id="${f.id}-b"${open ? '' : ' hidden'}>${open ? formBodyHTML(f) : ''}</div>
    </li>`;
  }
  function bySection(list) {
    const groups = [];
    list.forEach(f => { let g = groups[groups.length - 1]; if (!g || g.sec.id !== f.sec.id) groups.push(g = { sec: f.sec, items: [] }); g.items.push(f); });
    return groups;
  }
  function listHTML(tab) {
    const list = discover(tab).slice(0, shownOf(tab));
    return bySection(list).map(g => `<section class="d-g" aria-labelledby="dh-${tab}-${g.sec.id}">
      <h4 class="d-h" id="dh-${tab}-${g.sec.id}" tabindex="-1"><span class="d-h-n">${esc(g.sec.num || '')}</span>${esc(g.sec.title)}</h4>
      <ul class="d-ul">${g.items.map(formItemHTML).join('')}</ul></section>`).join('');
  }
  function moreHTML(tab) {
    const n = discover(tab).length, shown = shownOf(tab);
    if (shown >= n) return `<p class="d-end">${I_CHECK}<span>Tu as tout parcouru : ${n} forme${n > 1 ? 's' : ''}.</span></p>`;
    const next = Math.min(STEP, n - shown);
    return `<button type="button" class="d-more-b" data-more="${tab}">Découvrir ${next} autre${next > 1 ? 's' : ''} forme${next > 1 ? 's' : ''}</button>
      <span class="d-count">${shown} sur ${n}</span>
      <button type="button" class="d-all" data-all="${tab}">Tout afficher</button>`;
  }
  function dmapHTML(tab) {
    const groups = bySection(discover(tab));
    const LG = [['nouveau', 'nouvelle'], ['vu', 'vue'], ['maitrise', 'je connais'], ['revoir', 'à revoir']];
    return `<div class="d-map">
      <p class="d-map-h">Un point = une forme. Touche une ligne pour y aller.</p>
      <p class="d-lg">${LG.map(([s, t]) => `<span data-st="${s}"><i></i>${t}</span>`).join('')}</p>
      <ul class="d-rows">${groups.map(g => {
        const n = g.items.filter(f => stOf(f.k) !== 'nouveau').length;
        return `<li><button type="button" class="d-row" data-reveal="${tab}|${g.sec.id}">
          <span class="d-row-n">${esc(g.sec.num || '')}</span><span class="d-row-t">${esc(g.sec.title)}</span>
          <span class="d-dots" aria-hidden="true">${g.items.map(f => `<i data-k="${esc(f.k)}" data-st="${stOf(f.k)}"></i>`).join('')}</span>
          <span class="d-row-c"><span class="sr">Découvertes : </span>${n}/${g.items.length}</span></button></li>`;
      }).join('')}</ul></div>`;
  }
  function spotHTML(tab) {
    if (REG === 'neutre') return '';
    const pick = discover(tab).filter(regFits);
    if (!pick.length) return `<p class="d-spot-n">${REG === 'formel' ? 'Aucune autre forme de cette intention n’est marquée « soutenu ».' : 'Pas d’autre forme familière ou québécoise pour cette intention.'}</p>`;
    return `<p class="d-spot-h">${meter(REG === 'formel' ? 2 : 0)}${REG === 'formel' ? 'En formel, essaie aussi :' : 'Entre amis, au Québec, essaie aussi :'}</p>
      <div class="d-spot-l">${pick.slice(0, 10).map(f => `<button type="button" class="chip-b" data-spot="${f.id}">${T(f.head)}</button>`).join('')}</div>`;
  }
  function discoverHTML(tab) {
    const list = discover(tab);
    if (!list.length) return '';
    return `<section class="disc" id="p-disc" aria-labelledby="disc-h">
      <h3 class="s-h" id="disc-h" tabindex="-1">Découvrir d’autres formes</h3>
      <p class="s-sub">Au-delà des formules clés, cette intention a <b>${list.length}</b> autres formes dans le site. Ouvre-les ${STEP} par ${STEP}&nbsp;: chaque carte ouverte compte comme «&nbsp;vue&nbsp;».</p>
      ${dmapHTML(tab)}
      <div class="d-spot" id="d-spot">${spotHTML(tab)}</div>
      <div class="d-list" id="d-list" data-tab="${tab}">${listHTML(tab)}</div>
      <div class="d-more" id="d-more">${moreHTML(tab)}</div>
    </section>`;
  }

  /* ---------- La carte ouverte ---------- */
  function panelHTML(tab) {
    const E = ESS[tab], mo = MOM[tab];
    const n = discover(tab).length;
    const link = rowLink(tab);
    const imgs = V.forTab(tab).concat(extraSpecs(tab)).map(s => `<div class="panel-v">${V.render(s, { examples: true, link })}</div>`).join('');
    return `
    <div class="p-bar">
      <button type="button" class="p-back" data-close>
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M19 12H6M11 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span class="p-back-m">L’antisèche</span><span class="p-back-d">Refermer la carte</span>
      </button>
      <p class="p-crumb"><span class="p-num">${pad(tab)}</span><span>${esc(mo.m.label)}</span></p>
    </div>
    <div class="p-in">
      <header class="p-head">
        <div class="p-head-t">
          <p class="i-k">Je veux…</p>
          <h2 class="i-t" id="p-title" tabindex="-1"><span class="hl">${esc(E.je)}</span></h2>
          <p class="i-q">${esc(E.quand)}</p>
          ${mlineHTML(tab)}
        </div>
        <figure class="p-pic">
          <div class="p-pic-v" aria-hidden="true">${iconHTML(tab)}</div>
          <figcaption>${legendFor(tab)}</figcaption>
        </figure>
      </header>
      <div class="p-prog">
        ${progHTML(tabExprs(tab), `data-prog-tab="${tab}"`, true)}
        <nav class="p-jump" aria-label="Dans cette carte">
          <button type="button" data-jump="p-forms">Formules</button>
          <button type="button" data-jump="p-img">En image</button>
          ${n ? `<button type="button" data-jump="p-disc" class="is-strong">D’autres formes <span class="j-n">${n}</span></button>` : ''}
          <button type="button" data-jump="p-next">Ensuite</button>
        </nav>
      </div>

      <section id="p-forms" class="p-sec" aria-label="Les formules">
        <div id="p-groups">${groupsHTML(tab)}</div>
        <div id="p-qcband">${qcBandHTML(tab)}</div>
      </section>

      <section class="tips" aria-label="À retenir">
        <p class="attn"><svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M12 3 2.5 20h19z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M12 10v4.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><circle cx="12" cy="17.2" r="1.3" fill="currentColor"/></svg><span><b class="attn-k">Attention</b> ${md(nbsp(E.attention))}</span></p>
        <div class="relance"><p class="rl-k">Pour continuer la conversation&nbsp;:</p><p class="rl-q"><span>«&nbsp;${T(E.relance)}&nbsp;»</span>${speakBtn(E.relance)}</p></div>
      </section>

      <section class="p-sec images" id="p-img" aria-labelledby="img-h">
        <h3 class="s-h" id="img-h" tabindex="-1">Comprendre en image</h3>
        <p class="s-sub">Orange : ce que l’expression introduit. Violet : la phrase principale. Chaque ligne mène à l’expression dans le site complet.</p>
        <div class="panels">${imgs}</div>
      </section>

      ${discoverHTML(tab)}

      <section class="p-sec next" id="p-next" aria-labelledby="next-h">
        <h3 class="s-h" id="next-h" tabindex="-1">Ensuite, tu peux…</h3>
        ${nextHTML(tab)}
        <div class="next-more">${modelHTML(tab)}</div>
      </section>

      <footer class="p-foot">
        <a class="site" href="${esc(tabLink(tab))}">Tout voir dans le site complet<span aria-hidden="true"> →</span></a>
        <span class="p-foot-s">Onglet ${tab} · ${esc(S.tabs[tab].title)}</span>
        <button type="button" class="p-close-b" data-close>Refermer la carte</button>
      </footer>
    </div>`;
  }

  /* ---------- Tuiles (recto) ---------- */
  const qcPick = e => e.qc.find(q => /(^|,\s*)(F-)?QC\b/.test(q.r || '')) || e.qc[0];
  function tileForms(t) {
    const all = [];
    cardsFor(t, REG).forEach(g => g.cards.forEach(c => { if (!c.flagOral) all.push(c); }));
    return all.slice(0, 3);
  }
  function tileBodyHTML(t) {
    const E = ESS[t];
    const forms = tileForms(t);
    const q = REG !== 'amis' ? qcPick(E) : null;
    return `<ul class="t-f">${forms.map(c => `<li>
        <span class="tf-row"><span class="tf-e">${T(c.e)}</span>${c.c ? `<span class="tf-lead" aria-hidden="true"></span>${chipHTML(c.c)}` : ''}${tagsHTML(c.r)}</span>
        ${c.ex ? `<span class="tf-x">${markHTML(c.ex, c.e)}</span>` : ''}</li>`).join('')}</ul>
      ${q ? `<p class="t-qc"><span class="qc-chip">QC</span><span class="tf-e">${T(q.e)}</span>${tagsHTML(q.r || 'C')}</p>` : ''}`;
  }
  function tileHTML(t, i) {
    const E = ESS[t], mo = MOM[t];
    return `<article class="tile" data-tab="${t}" data-moment="${mo.m.id}" style="--i:${i}">
      <div class="t-strip"><span class="t-mo"><span class="t-mo-n" aria-hidden="true">${mo.i + 1}</span>${esc(mo.m.label)}</span></div>
      <h3 class="t-h"><button type="button" class="t-open" data-open="${t}" aria-expanded="false"><span class="t-n" aria-hidden="true">${pad(t)}</span><span class="t-je">${esc(E.je)}</span><svg class="t-go" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button></h3>
      <div class="t-viz" aria-hidden="true">${iconHTML(t)}</div>
      <div class="t-body">${tileBodyHTML(t)}</div>
      ${progHTML(tabExprs(t), `data-prog-tab="${t}"`, false)}
    </article>`;
  }

  /* ---------- Coquille de la page ---------- */
  function segHTML() {
    return `<fieldset class="seg" data-reg="${REG}">
      <legend class="seg-l">Tu parles…</legend>
      <div class="seg-in">
        ${REGS.map(r => `<input type="radio" name="reg" id="reg-${r.id}" value="${r.id}"${r.id === REG ? ' checked' : ''}><label for="reg-${r.id}">${meter(r.lvl)}<span>${r.label}</span></label>`).join('')}
        <span class="seg-thumb" aria-hidden="true"></span>
      </div>
    </fieldset>`;
  }
  function clineHTML() {
    return `<div class="cl"><h2 class="cl-h">Où en est la conversation&nbsp;?</h2>
      <ol class="cline">${MOMENTS.map((m, i) => `<li><button type="button" class="cl-b" data-moment="${m.id}">
        <span class="cl-dot" aria-hidden="true">${i + 1}</span><span class="cl-l">${esc(m.label)}</span><span class="cl-n">${m.tabs.length} intention${m.tabs.length > 1 ? 's' : ''}</span></button></li>`).join('')}</ol></div>`;
  }
  function shellHTML() {
    return `<div class="sheet">
      <header class="s-head">
        <div class="s-tt">
          <p class="s-k">Antisèche · ${ORDER.length} intentions</p>
          <h1 class="s-h1">Qu’est-ce que tu veux dire&nbsp;?</h1>
          <p class="s-lead">Touche une intention : la carte s’ouvre avec les formules, un exemple, une image… et d’autres formes à découvrir.</p>
        </div>
        <div class="s-all">
          <p class="s-all-h">Tout le site</p>
          ${progHTML(allExprs(), 'data-prog-all', true)}
        </div>
      </header>
      <div class="tools" id="tools">
        ${segHTML()}
        <div class="tools-x">
          <button type="button" class="tog" id="tog-ex" aria-pressed="false"><span class="tog-box" aria-hidden="true">${I_CHECK}</span>Exemples</button>
          <button type="button" class="side-b" id="side-b" data-side="verso"><span class="side-t">Verso : repères</span>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 7h13l-3-3M20 17H7l3 3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        </div>
      </div>
      <div class="sides" id="sides">
        <section id="recto" class="recto" aria-label="Recto : les ${ORDER.length} intentions">
          ${clineHTML()}
          <div class="grid" id="grid">${ORDER.map((t, i) => tileHTML(t, i)).join('')}</div>
          <p class="r-foot">Au verso : le temps, les modes, les registres, les structures. <button type="button" class="link-b" data-side="verso">Retourner la feuille</button></p>
        </section>
        <section id="verso" class="verso" aria-labelledby="v-h" hidden></section>
      </div>
    </div>`;
  }

  /* ---------- Verso ---------- */
  function tabFor(label) {
    const k = C.norm(label).replace(/[.…]+$/, '').trim();
    for (const t of ORDER) if (ESS[t].cles.some(c => C.norm(c.e).replace(/[.…]+$/, '') === k)) return t;
    const l = C.BY_KEY.get(k);
    return l && l.length ? l[0].tab : null;
  }
  function metroHTML(steps) {
    return `<ol class="metro">${steps.map(([lab, t]) => `<li class="mst"><button type="button" class="mst-b" data-open="${t}">
      <span class="mst-dot" aria-hidden="true"></span><span class="mst-l">${esc(lab)}</span><span class="mst-n">${pad(t)} · ${esc(ESS[t].je)}</span></button></li>`).join('')}</ol>`;
  }
  function vPanel(id, title, sub, body, wide) {
    return `<section class="v-p${wide ? ' v-wide' : ''}" id="v-${id}" aria-labelledby="vh-${id}">
      <h3 class="v-ph" id="vh-${id}">${esc(title)}</h3>${sub ? `<p class="v-sub">${sub}</p>` : ''}<div class="v-b">${body}</div></section>`;
  }
  function versoHTML() {
    const reg = V.byId('registres'), modes = V.byId('modes'), str = V.byId('structures');
    const link = (row, spec) => '#t' + spec.tab;
    const time = ['durees', 'simultaneite'].map(id => V.byId(id)).filter(Boolean).map(s => `<div class="v-col">${V.render(s, { examples: true, link })}</div>`).join('');
    return `<div class="v-head">
        <div><p class="s-k">Verso</p><h2 class="v-h" id="v-h" tabindex="-1">Les repères</h2>
        <p class="s-lead">Ce qui sert pour toutes les intentions. Touche une expression : sa carte s’ouvre.</p></div>
      </div>
      <div class="v-grid">
        ${vPanel('temps', 'Le temps en un coup d’œil', 'Une frise&nbsp;: passé · aujourd’hui · futur. À deux voies&nbsp;: en haut (orange) l’action introduite par l’expression, en bas (violet) la phrase principale.', `<div class="v-cols">${time}</div>`, true)}
        ${modes ? vPanel('modes', 'Quel mode après l’expression ?', 'Ce qui vient après l’expression. Touche une expression pour ouvrir sa carte.', V.render(modes, { title: false })) : ''}
        ${reg ? vPanel('registres', 'Trois registres', `${md(reg.intro)} La colonne de ton registre est surlignée.`, `<div class="v-reg" data-reg="${REG}">${V.render(reg, { title: false })}</div>`) : ''}
        ${str ? vPanel('structures', 'Nom, infinitif ou phrase', md(str.intro), V.render(str, { title: false })) : ''}
        ${vPanel('lignes', 'Enchaîner', 'Une idée en appelle une autre. Chaque arrêt ouvre sa carte.', `<div class="lines">${M.chains.map(c => metroHTML(c.steps)).join('')}</div>`, true)}
      </div>
      <p class="r-foot"><button type="button" class="link-b" data-side="recto">Retourner la feuille : les ${ORDER.length} intentions</button></p>`;
  }
  function decorateModes(root) {
    if (!root) return;
    $$('.vz-col', root).forEach(col => {
      $$('li', col).forEach(li => {
        const label = li.textContent.trim();
        const t = tabFor(label.split(' + ')[0]);
        if (!t) return;
        li.innerHTML = `<button type="button" class="mode-b" data-open="${t}" title="${esc(ESS[t].je)}">${li.innerHTML}<span class="mode-n">${pad(t)}</span></button>`;
      });
    });
  }

  /* ---------- État, rendu, navigation ---------- */
  let OPEN = null;
  let SIDE = 'recto';
  let pushedOpen = false;
  const wideMQ = window.matchMedia('(min-width: 900px)');
  const INERT = ['.topbar', '.skip', '.s-head', '.tools-x', '#sides'];

  function colsOf(grid) {
    const v = getComputedStyle(grid).gridTemplateColumns;
    return v && v !== 'none' ? v.split(/\s+/).filter(Boolean).length : 1;
  }
  function layoutStrips() {
    const grid = $('#grid');
    if (!grid) return;
    const n = colsOf(grid);
    grid.dataset.cols = n;
    const tiles = $$('.tile', grid);
    tiles.forEach((el, i) => {
      const prev = tiles[i - 1];
      const sameRow = prev && i % n !== 0;
      const same = prev && prev.dataset.moment === el.dataset.moment;
      el.classList.toggle('is-cont', !!(sameRow && same));
      el.classList.toggle('has-label', n === 1 ? !same : !(sameRow && same));
    });
  }

  function setOverlay(pan, on) {
    document.documentElement.classList.toggle('has-overlay', on);
    pan.classList.toggle('is-overlay', on);
    if (on) { pan.setAttribute('role', 'dialog'); pan.setAttribute('aria-modal', 'true'); }
    else { pan.setAttribute('role', 'region'); pan.removeAttribute('aria-modal'); }
    INERT.forEach(sel => $$(sel).forEach(el => { el.inert = on; }));
  }
  function placePanel() {
    const pan = $('#panel');
    if (!pan) return;
    const grid = $('#grid');
    if (wideMQ.matches) {
      if (pan.classList.contains('is-overlay')) setOverlay(pan, false);
      const tiles = $$('.tile', grid);
      const n = colsOf(grid);
      const i = tiles.findIndex(t => +t.dataset.tab === OPEN);
      if (i < 0) return;
      const end = Math.min(tiles.length - 1, Math.floor(i / n) * n + n - 1);
      if (tiles[end].nextElementSibling !== pan) tiles[end].after(pan);
      const tr = tiles[i].getBoundingClientRect(), gr = grid.getBoundingClientRect();
      pan.style.setProperty('--notch', Math.round(tr.left + tr.width / 2 - gr.left) + 'px');
    } else {
      if (pan.parentNode !== document.body) document.body.appendChild(pan);
      if (!pan.classList.contains('is-overlay')) setOverlay(pan, true);
    }
  }

  let io = null;
  const SEEN = new Set();
  function watchSeen(root) {
    if (!('IntersectionObserver' in window)) return;
    if (!io) {
      io = new IntersectionObserver(entries => entries.forEach(en => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        const e = en.target.getAttribute('data-e');
        const k = P.cle(e);
        if (!k || SEEN.has(k)) return;
        SEEN.add(k);
        P.marquer(e, 'vu', TOOL);
      }), { threshold: 0.6 });
    }
    $$('[data-seen]', root).forEach(el => io.observe(el));
  }

  function openPanelDom(tab) {
    const old = $('#panel');
    if (OPEN === tab && old) { placePanel(); return; }
    if (old) removePanel(false);
    OPEN = tab;
    const pan = document.createElement('section');
    pan.id = 'panel';
    pan.className = 'panel';
    pan.dataset.tab = tab;
    pan.setAttribute('aria-labelledby', 'p-title');
    pan.innerHTML = panelHTML(tab);
    $('#grid').appendChild(pan);
    $$('.t-open').forEach(b => b.setAttribute('aria-expanded', String(+b.dataset.open === tab)));
    $$('.tile').forEach(t => t.classList.toggle('is-open', +t.dataset.tab === tab));
    placePanel();
    watchSeen(pan);
    doRefresh();
    document.title = `${ESS[tab].je} — L’antisèche qui s’ouvre`;
    const title = $('#p-title', pan);
    if (pan.classList.contains('is-overlay')) {
      pan.scrollTop = 0;
    } else {
      const tile = $(`.tile[data-tab="${tab}"]`);
      const top = tile.getBoundingClientRect().top + window.scrollY - ($('#tools').offsetHeight || 0) - 14;
      window.scrollTo({ top: Math.max(0, top), behavior: reduce() || old ? 'auto' : 'smooth' });
    }
    if (title) title.focus({ preventScroll: true });
    if (!reduce() && pan.animate) {
      pan.animate(pan.classList.contains('is-overlay')
        ? [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }]
        : [{ opacity: 0, transform: 'translateY(-10px)' }, { opacity: 1, transform: 'none' }],
      { duration: 240, easing: 'cubic-bezier(.2,.7,.2,1)' });
    }
  }
  function removePanel(restore) {
    const pan = $('#panel');
    const t = OPEN;
    OPEN = null;
    if (pan) {
      if (pan.classList.contains('is-overlay')) setOverlay(pan, false);
      pan.remove();
    }
    if (io) io.disconnect();
    $$('.t-open').forEach(b => b.setAttribute('aria-expanded', 'false'));
    $$('.tile.is-open').forEach(x => x.classList.remove('is-open'));
    document.title = 'L’antisèche qui s’ouvre — Prototype 1 + 4 · A';
    if (restore && t) {
      const b = $(`.t-open[data-open="${t}"]`);
      if (b) {
        b.focus({ preventScroll: true });
        const r = b.closest('.tile').getBoundingClientRect();
        if (r.top < 0 || r.bottom > window.innerHeight) b.closest('.tile').scrollIntoView({ block: 'center' });
      }
    }
  }

  function showSide(side) {
    if (side === SIDE && !(side === 'verso' && !$('#verso').innerHTML)) return;
    const prev = SIDE;
    SIDE = side;
    const v = $('#verso');
    if (side === 'verso' && !v.innerHTML) { v.innerHTML = versoHTML(); decorateModes($('#v-modes')); }
    const swap = () => {
      $('#recto').hidden = side !== 'recto';
      v.hidden = side !== 'verso';
      const b = $('#side-b');
      b.dataset.side = side === 'verso' ? 'recto' : 'verso';
      $('.side-t', b).textContent = side === 'verso' ? 'Recto : intentions' : 'Verso : repères';
      document.documentElement.dataset.face = side;
      if (side === 'recto') layoutStrips();
    };
    const body = $('#sides');
    if (prev === side || reduce() || !body.animate) { swap(); return; }
    body.animate([{ transform: 'perspective(1400px) rotateY(0)' }, { transform: 'perspective(1400px) rotateY(88deg)', opacity: .5 }], { duration: 150, easing: 'ease-in' }).finished.then(() => {
      swap();
      body.animate([{ transform: 'perspective(1400px) rotateY(-88deg)', opacity: .5 }, { transform: 'perspective(1400px) rotateY(0)', opacity: 1 }], { duration: 190, easing: 'ease-out' });
    });
  }

  function route() {
    const h = location.hash || '';
    const m = h.match(/^#t(\d+)$/);
    if (h === '#verso') {
      removePanel(false);
      showSide('verso');
    } else {
      showSide('recto');
      if (m && ESS[+m[1]]) openPanelDom(+m[1]);
      else if (OPEN != null) removePanel(true);
    }
  }
  function nav(hash, replace) {
    const url = hash || (location.pathname + location.search);
    try { history[replace ? 'replaceState' : 'pushState']({ p14a: hash || 'home' }, '', url); }
    catch (e) { if (replace) location.replace(hash || '#'); else location.hash = hash || ''; return; }
    route();
  }
  function openTab(t) {
    const inPanel = /^#t\d+$/.test(location.hash);
    if (!inPanel) pushedOpen = true;
    nav('#t' + t, inPanel);
  }
  function closePanel() {
    if (pushedOpen && history.state && /^#t\d+$/.test(history.state.p14a || '')) { pushedOpen = false; history.back(); }
    else nav(SIDE === 'verso' ? '#verso' : '', true);
  }

  /* ---------- Progression : mise à jour de tout ce qui est affiché ---------- */
  let rq = 0;
  function refresh() { if (rq) return; rq = requestAnimationFrame(() => { rq = 0; doRefresh(); }); }
  function doRefresh() {
    $$('[data-prog-tab]').forEach(el => fillProg(el, tabExprs(+el.dataset.progTab)));
    $$('[data-prog-all]').forEach(el => fillProg(el, allExprs()));
    $$('[data-k]').forEach(el => {
      const k = el.dataset.k, st = stOf(k);
      el.dataset.st = st;
      if (el.classList.contains('d-it')) { const t = $('.st-t', el); if (t) t.textContent = ST_LABEL[st]; }
      if (el.classList.contains('pg')) {
        const r = P.get(k);
        $('[data-pg="connu"]', el).setAttribute('aria-pressed', String(!!(r && r.connu)));
        $('[data-pg="revoir"]', el).setAttribute('aria-pressed', String(!!(r && r.revoir)));
      }
    });
    $$('.d-row').forEach(row => {
      const dots = $$('.d-dots i', row);
      const n = dots.filter(d => d.dataset.st !== 'nouveau').length;
      const c = $('.d-row-c', row);
      if (c) c.innerHTML = `<span class="sr">Découvertes : </span>${n}/${dots.length}`;
    });
  }

  /* ---------- Registre ---------- */
  function setReg(r) {
    if (!REG_IDS.includes(r) || r === REG) return;
    REG = r;
    store.set('reg', r);
    document.documentElement.dataset.reg = r;
    const seg = $('.seg');
    if (seg) seg.dataset.reg = r;
    const inp = $('#reg-' + r);
    if (inp) inp.checked = true;
    $$('.tile').forEach(t => { $('.t-body', t).innerHTML = tileBodyHTML(+t.dataset.tab); });
    const vr = $('.v-reg');
    if (vr) vr.dataset.reg = r;
    const pan = $('#panel');
    if (pan) {
      const tab = +pan.dataset.tab;
      $('#p-groups', pan).innerHTML = groupsHTML(tab);
      $('#p-qcband', pan).innerHTML = qcBandHTML(tab);
      const sp = $('#d-spot', pan);
      if (sp) sp.innerHTML = spotHTML(tab);
      $$('.d-it', pan).forEach(li => { const f = FORM[li.id]; if (f) li.classList.toggle('is-reg', regFits(f)); });
      watchSeen(pan);
    }
  }

  /* ---------- Découvrir : ouvrir, montrer plus ---------- */
  function rerenderList(tab) {
    const pan = $('#panel');
    if (!pan) return;
    $('#d-list', pan).innerHTML = listHTML(tab);
    $('#d-more', pan).innerHTML = moreHTML(tab);
  }
  function toggleForm(li, force) {
    const f = FORM[li.id];
    if (!f) return;
    const btn = $('.d-btn', li), body = $('.d-body', li);
    const open = force != null ? force : btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(open));
    li.classList.toggle('is-open', open);
    if (open) {
      if (!body.innerHTML.trim()) body.innerHTML = formBodyHTML(f);
      body.hidden = false;
      DOPEN.add(f.id);
      P.marquer(f.track, 'vu', TOOL);
      doRefresh();
    } else {
      body.hidden = true;
      DOPEN.delete(f.id);
    }
  }
  function revealTo(tab, idx) {
    const list = discover(tab);
    if (idx < 0) return;
    const need = Math.min(list.length, Math.max(shownOf(tab), Math.ceil((idx + 1) / STEP) * STEP));
    if (need !== shownOf(tab)) { DSHOWN[tab] = need; rerenderList(tab); }
  }
  const scrollOpts = () => ({ behavior: reduce() ? 'auto' : 'smooth', block: 'start' });

  function speak(text) {
    try {
      const synth = window.speechSynthesis;
      const u = new SpeechSynthesisUtterance(text.replace(/—/g, ' '));
      u.lang = 'fr-CA';
      const voices = synth.getVoices() || [];
      const v = voices.find(x => /^fr[-_]CA/i.test(x.lang)) || voices.find(x => /^fr/i.test(x.lang));
      if (v) u.voice = v;
      u.rate = 0.92;
      synth.cancel();
      synth.speak(u);
    } catch (e) { /* synthèse vocale indisponible */ }
  }

  function flashMoment(id) {
    const tiles = $$(`.tile[data-moment="${id}"]`);
    if (!tiles.length) return;
    if (OPEN != null) closePanel();
    tiles[0].scrollIntoView(scrollOpts());
    tiles.forEach(t => { t.classList.remove('is-flash'); void t.offsetWidth; t.classList.add('is-flash'); });
    setTimeout(() => tiles.forEach(t => t.classList.remove('is-flash')), 1600);
    const b = $('.t-open', tiles[0]);
    if (b) b.focus({ preventScroll: true });
  }

  function initTheme() {
    const btn = $('#theme-btn');
    if (!btn) return;
    const root = document.documentElement;
    const isDark = () => {
      const t = root.getAttribute('data-theme');
      if (t) return t === 'dark';
      return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    };
    const sync = () => btn.setAttribute('aria-label', isDark() ? 'Passer au thème clair' : 'Passer au thème sombre');
    btn.addEventListener('click', () => {
      const next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store.set('theme', next);
      sync();
    });
    sync();
  }

  function applyEx(on) {
    document.documentElement.classList.toggle('ex-on', on);
    const b = $('#tog-ex');
    if (b) b.setAttribute('aria-pressed', String(on));
  }

  function onClick(e) {
    const tg = e.target;
    if (!tg || !tg.closest) return;
    if (tg.closest('[data-close]')) { closePanel(); return; }
    const op = tg.closest('[data-open]');
    if (op) {
      e.preventDefault();
      const t = +op.dataset.open;
      if (OPEN === t && op.classList.contains('t-open')) closePanel(); else openTab(t);
      return;
    }
    const a = tg.closest('a[href^="#t"]');
    if (a && /^#t\d+$/.test(a.getAttribute('href'))) { e.preventDefault(); openTab(+a.getAttribute('href').slice(2)); return; }
    const say = tg.closest('[data-say]');
    if (say) { speak(say.getAttribute('data-say')); return; }
    const pg = tg.closest('[data-pg]');
    if (pg) { const box = pg.closest('.pg'); P.marquer(box.dataset.e, pg.dataset.pg, TOOL); doRefresh(); return; }
    const db = tg.closest('.d-btn');
    if (db) { toggleForm(db.closest('.d-it')); return; }
    const more = tg.closest('[data-more]');
    if (more) {
      const tab = +more.dataset.more, from = shownOf(tab);
      DSHOWN[tab] = Math.min(discover(tab).length, from + STEP);
      rerenderList(tab);
      const f = discover(tab)[from];
      const nb = f && $(`#${f.id} .d-btn`);
      if (nb) nb.focus({ preventScroll: false });
      return;
    }
    const all = tg.closest('[data-all]');
    if (all) { const tab = +all.dataset.all; const from = shownOf(tab); DSHOWN[tab] = discover(tab).length; rerenderList(tab); const f = discover(tab)[from]; const nb = f && $(`#${f.id} .d-btn`); if (nb) nb.focus(); return; }
    const rv = tg.closest('[data-reveal]');
    if (rv) {
      const [tab, sec] = rv.dataset.reveal.split('|');
      const list = discover(+tab);
      let last = -1;
      list.forEach((f, i) => { if (f.sec.id === sec) last = i; });
      revealTo(+tab, last);
      const h = $(`#dh-${tab}-${sec}`);
      if (h) { h.scrollIntoView(scrollOpts()); h.focus({ preventScroll: true }); }
      return;
    }
    const sp = tg.closest('[data-spot]');
    if (sp) {
      const f = FORM[sp.dataset.spot];
      if (!f) return;
      revealTo(f.tab, discover(f.tab).indexOf(f));
      const li = $('#' + f.id);
      if (li) { toggleForm(li, true); li.scrollIntoView(scrollOpts()); $('.d-btn', li).focus({ preventScroll: true }); }
      return;
    }
    const jp = tg.closest('[data-jump]');
    if (jp) {
      const el = $('#' + jp.dataset.jump);
      if (el) { el.scrollIntoView(scrollOpts()); const h = $('.s-h, .g-h', el); if (h) { if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } }
      return;
    }
    const sd = tg.closest('[data-side]');
    if (sd) {
      const to = sd.dataset.side;
      if (to === 'verso') nav('#verso', SIDE === 'verso'); else nav('', false);
      const h = to === 'verso' ? $('#v-h') : null;
      window.scrollTo({ top: Math.min(window.scrollY, ($('#tools').getBoundingClientRect().top + window.scrollY) - 4) });
      if (h) h.focus({ preventScroll: true });
      return;
    }
    const mo = tg.closest('[data-moment]');
    if (mo) { flashMoment(mo.dataset.moment); return; }
    const rs = tg.closest('[data-reg-set]');
    if (rs) { setReg(rs.dataset.regSet); const g = $('#p-forms'); if (g) g.scrollIntoView(scrollOpts()); return; }
    if (tg.closest('#tog-ex')) { const on = !document.documentElement.classList.contains('ex-on'); applyEx(on); store.set('ex', on ? '1' : '0'); }
  }

  function init() {
    const app = $('#app');
    if (!app) return;
    document.documentElement.dataset.reg = REG;
    app.innerHTML = shellHTML();
    initTheme();
    applyEx(store.get('ex', '0') === '1');
    layoutStrips();
    document.addEventListener('click', onClick);
    document.addEventListener('change', e => { if (e.target && e.target.name === 'reg') setReg(e.target.value); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && OPEN != null && !e.defaultPrevented) { e.preventDefault(); closePanel(); }
    });
    window.addEventListener('popstate', route);
    window.addEventListener('hashchange', route);
    let rt = 0;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { layoutStrips(); placePanel(); }, 80); });
    const onMQ = () => { layoutStrips(); placePanel(); };
    if (wideMQ.addEventListener) wideMQ.addEventListener('change', onMQ); else if (wideMQ.addListener) wideMQ.addListener(onMQ);
    P.surChangement(refresh);
    route();
  }

  window.P14A_APP = { discover, exampleFor, diagFor, tabExprs, allExprs, kOf, stOf, matchPattern, nextOf };
  init();
})();
