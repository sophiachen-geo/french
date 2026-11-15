/* Prototype 1 + 4 · B — « Je veux… + l’antisèche en poche ».
   Parcours principal = « Je veux… » (prototype 1) : une question, des intentions par moment,
   puis un écran d’intention (grandes formules, registre, Québec, attention, relance, schémas).
   En permanence : la « poche » = l’antisèche des 12 intentions (prototype 4), barre en bas sur
   téléphone (elle se déplie en feuille), colonne à droite sur ordinateur. Recto : tuiles ; verso :
   modes, registres, temps, structures.
   Nouveau : « Découvre une nouvelle forme » tire une expression de l’onglet jamais vue
   (CADRES.TABS[tab].items, statut « nouveau » dans PROGRES) et la montre en grand.
   Rien n’est inventé : exemples, nuances et schémas viennent du site ; sans exemple, on montre la forme seule. */
(function () {
  'use strict';

  const S = window.SITE, C = window.CADRES, V = window.VIZ, D = window.PBDATA;
  if (!S || !C || !V || !D) return;
  const M = S.meta;
  const P = window.PROGRES || {
    cle: s => C.norm(s), marquer() { return 'nouveau'; }, statut() { return 'nouveau'; }, get() { return null; },
    resume(l) { return { total: l.length, nouveau: l.length, vu: 0, 'en-cours': 0, maitrise: 0, revoir: 0 }; }, surChangement() {}
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const md = s => V.md(s);
  /* Espaces insécables du français : « … », ? ! : ; (même longueur : les positions restent valables). */
  const nbsp = s => String(s == null ? '' : s).replace(/ ([;:?!»])/g, '\u00A0$1').replace(/« /g, '«\u00A0');
  const T = s => esc(nbsp(s));
  const key = s => C.norm(s).replace(/^[\s.,]+/, '').replace(/[\s.;:,!?]+$/, '');
  const pad = n => String(n).padStart(2, '0');
  const ROOT = document.documentElement;
  const reduce = () => C.reduceMotion();

  const ESS = {};
  M.essentiels.forEach(e => { ESS[e.tab] = e; });
  const MOMENTS = M.moments;
  const MOMENT = {};
  MOMENTS.forEach(m => m.tabs.forEach(t => { MOMENT[t] = m; }));
  const ORDER = MOMENTS.reduce((a, m) => a.concat(m.tabs), []).filter(t => ESS[t]);
  const tabLink = tab => C.siteLink('#onglet-' + tab);
  const moVar = tab => `--m:var(--mo-${MOMENT[tab].id});--on:var(--on-${MOMENT[tab].id})`;

  /* ---------- Préférences de ce navigateur (protégées) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('p14b:' + k); return v === null ? d : v; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('p14b:' + k, v); } catch (e) { /* indisponible */ } }
  };

  /* ---------- Registres ---------- */
  const REGS = [
    { id: 'amis', label: 'Entre amis', lvl: 0 },
    { id: 'neutre', label: 'Neutre', lvl: 1 },
    { id: 'formel', label: 'Formel', lvl: 2 }
  ];
  const codesOf = r => (Array.isArray(r) ? r : String(r || 'C').split(/\s*,\s*/)).filter(Boolean);
  const levelOf = codes => codes.includes('S') ? 2 : codes.some(c => c === 'O' || c === 'QC' || c === 'F-QC') ? 0 : 1;
  const regText = codes => codes.map(c => D.regLabel[c] || c).join(' · ');
  const meter = lvl => `<span class="meter m${lvl}" aria-hidden="true"><i></i><i></i><i></i></span>`;
  let REG = ['amis', 'neutre', 'formel'].includes(store.get('reg', 'neutre')) ? store.get('reg', 'neutre') : 'neutre';
  const regLvl = () => REGS.find(r => r.id === REG).lvl;

  /* ---------- Schémas : la ligne qui dessine une formule ---------- */
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
  const isOwnRow = (found, e) => !!found && (found.row.label === e || labelAlts(found.row.label).includes(key(String(e).split(/\s+\/\s+/)[0])));

  /* Une seule ligne de schéma, sans libellé (la carte porte déjà l'expression). */
  function miniViz(found, e) {
    if (!found) return '';
    const s = found.spec;
    const spec = { type: 'rows', axis: s.axis, lanes: s.lanes, flow: s.flow, baseline: s.baseline, rows: [found.row] };
    const cap = isOwnRow(found, e) ? '' : `<p class="mini-c">Même schéma que <b>${T(String(found.row.label).replace(/\s*\[[^\]]+\]/g, ''))}</b></p>`;
    return `<div class="mini">${V.render(spec, { examples: false, title: false })}${cap}</div>`;
  }

  /* Pictogramme d'une intention (prototype 4) : le dessin seul, les mots longs retirés. Le même partout. */
  const iconMarks = marks => marks.filter(m => m.k !== 'text').map(m => {
    const o = Object.assign({}, m);
    if ((o.k === 'box' || o.k === 'wall' || o.k === 'gap') && o.text && o.text.length > 3) delete o.text;
    return o;
  });
  const ICONS = {};
  function iconSpec(tab) {
    if (ICONS[tab] !== undefined) return ICONS[tab];
    const [id, pick] = D.icon[tab] || [];
    const s = id && V.byId(id);
    let out = null;
    if (s && Array.isArray(pick)) {
      const rows = pick.map(i => s.rows[i]);
      const marks = [];
      rows.forEach((r, lane) => iconMarks(r.marks).forEach(m => marks.push(Object.assign(m, { lane }))));
      out = { lanes: 2, rows: [{ label: rows.map(r => r.label).join(' / '), marks }] };
    } else if (s) {
      const r = s.rows[pick];
      out = { lanes: s.lanes, axis: s.axis ? { today: s.axis.today, labels: [] } : null, flow: s.flow, baseline: s.baseline, rows: [{ label: r.label, marks: iconMarks(r.marks) }] };
    }
    ICONS[tab] = out;
    return out;
  }
  const iconHTML = (tab, cls) => { const sp = iconSpec(tab); return sp ? `<span class="icon${cls ? ' ' + cls : ''}" aria-hidden="true">${V.render(sp, { title: false, examples: false })}</span>` : ''; };

  /* Lien de chaque ligne de schéma vers l'expression dans le site complet. */
  const rowLink = tab => row => {
    if (!row || !row.label) return null;
    for (const a of labelAlts(row.label)) {
      const it = C.findItem(a, tab) || C.findItem(a);
      if (it) return C.siteLink(C.itemHref(it));
    }
    return tabLink(tab);
  };

  /* ---------- Phrase d'exemple : surligner l'expression, tracer les deux voies ---------- */
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
      if (/^\s*[,:]/.test(rest)) return null;          // marqueur détaché : toute la phrase
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
    /* Dialogue : une réplique par ligne — l'autre (violet), toi (orange). */
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
    const lanes = lanesFor(ex, ranges);
    return spansHTML(ex, 0, ex.length, lanes, hl);
  }

  /* ---------- La formule, avec la case « ce qui suit » ---------- */
  function slot(label, sub, tone) {
    return `<span class="slot s-${tone || 'c'}"><span class="slot-l">${esc(label)}</span>${sub ? `<span class="slot-s">${esc(sub)}</span>` : ''}</span>`;
  }
  const slotOf = cc => D.slots[cc] || [cc, ''];
  function formulaHTML(card) {
    const e = card.e, tab = card.tab;
    const cc = card.c ? String(card.c).replace(/^\+\s*/, '').trim() : '';
    const word = t => t.trim() ? `<span class="f-e">${T(t.trim())}</span>` : '';
    if (cc.includes('→')) {
      const [a, b] = cc.split('→').map(x => x.trim());
      return `${word(e)} ${slot('une phrase', a)} <span class="f-arr" aria-hidden="true">→</span> ${slot('une phrase', b, 'm')}`;
    }
    const cl = cc ? slotOf(cc) : null;
    const parts = e.split('…');
    const hasDots = parts.length > 1;
    const toks = [];
    if (tab === 2 && card.src === 'cle') toks.push(slot('un nom', '', 'm'));
    let usedC = false;
    parts.forEach((p, i) => {
      if (p.trim()) toks.push(word(p));
      if (i === parts.length - 1) return;               // un « … » suit cette partie : une case
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

  /* ---------- Expressions à plusieurs fonctions (fiches) ---------- */
  function alsoHTML(card) {
    const k = key(card.e.split(/\s+\/\s+/)[0]);
    const f = C.FICHE.get(k);
    if (!f) return '';
    const others = f.fonctions.filter(x => x.tab !== card.tab && ESS[x.tab]);
    if (!others.length) return '';
    const seen = new Set();
    const links = others.filter(x => !seen.has(x.tab) && seen.add(x.tab)).map(x =>
      `<a class="also-l" href="#t${x.tab}">${iconHTML(x.tab)}<span><b>${esc(x.fonction)}</b> · ${esc(ESS[x.tab].je)}</span></a>`).join('');
    return `<div class="also"><p class="also-h">Le même mot sert aussi à…</p>${links}</div>`;
  }

  /* ---------- Écouter ---------- */
  const canSpeak = 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';
  const SPK = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  function speakBtn(text, big) {
    if (!canSpeak || !text) return '';
    return big
      ? `<button type="button" class="say-l" data-say="${esc(text)}">${SPK}<span>Écouter</span></button>`
      : `<button type="button" class="say" data-say="${esc(text)}" aria-label="Écouter : ${esc(text)}">${SPK}</button>`;
  }
  function speak(text) {
    try {
      const synth = window.speechSynthesis;
      const u = new SpeechSynthesisUtterance(text.replace(/—/g, ' ').replace(/…/g, ', '));
      u.lang = 'fr-CA';
      const voices = synth.getVoices() || [];
      const v = voices.find(x => /^fr[-_]CA/i.test(x.lang)) || voices.find(x => /^fr/i.test(x.lang));
      if (v) u.voice = v;
      u.rate = 0.92;
      synth.cancel();
      synth.speak(u);
    } catch (e) { /* synthèse vocale indisponible */ }
  }

  /* ---------- Cartes de formules (écran d'intention) ---------- */
  function cardHTML(card, i) {
    const codes = codesOf(card.r);
    const lvl = levelOf(codes);
    const found = findDiagram(card.tab, card.e, card.c, card.diag);
    const it = card.item || C.findItem(key(card.e.split(/\s+\/\s+/)[0]), card.tab);
    const more = it ? C.siteLink(C.itemHref(it)) : tabLink(card.tab);
    const oral = card.flagOral ? '<p class="flag">Plutôt à l’oral : à l’écrit, préfère une formule neutre.</p>' : '';
    return `<article class="card lvl-${lvl}${card.src === 'formal' ? ' is-formal' : ''}" style="--i:${i}">
      <div class="card-top"><span class="reg">${meter(lvl)}<span>${esc(regText(codes))}</span></span>${speakBtn(card.ex)}</div>
      <p class="formula">${formulaHTML(card)}</p>
      ${card.ex ? `<p class="ex">${sentenceHTML(card.ex, card.e)}</p>` : ''}
      ${miniViz(found, card.e)}
      ${oral}
      ${alsoHTML(card)}
      <a class="more" href="${esc(more)}">Plus d’exemples dans le site<span aria-hidden="true"> →</span></a>
    </article>`;
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
        { title: 'Pour un courriel, une lettre, une entrevue', note: hasS ? 'Expressions marquées « soutenu » dans le site.' : 'Aucune expression de cette intention n’est marquée « soutenu » : ces formules courantes passent très bien à l’écrit.', cards: featured, rest },
        { title: 'Ça marche aussi en formel', cards: cles.filter(c => !informal(c)) },
        { title: 'À garder pour l’oral', cards: cles.filter(informal).map(c => Object.assign({ flagOral: true }, c)) }
      ];
    }
    return [{ title: 'Les formules clés', cards: cles }];
  }

  /* Légende des couleurs (celle du premier schéma de l'onglet). */
  function legendFor(tab) {
    const s = rowSpecs(tab).find(x => Array.isArray(x.legend)) || null;
    const items = s ? s.legend : [['cadre', 'ce que l’expression introduit'], ['main', 'la phrase principale']];
    const lanes = tab === 12 ? [['main', 'l’autre personne'], ['cadre', 'toi']] : items;
    return `<p class="lg">${lanes.map(([c, t]) => `<span class="lg-${c === 'main' ? 'm' : c === 'cadre' ? 'c' : 'x'}"><i></i>${esc(t)}</span>`).join('')}</p>`;
  }

  /* Schémas transversaux filtrés pour l'intention. */
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

  /* ---------- Liens entre intentions ---------- */
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
      <ul class="tree-to">${nx.map(n => `<li><a class="go" href="#t${n.to}" style="${moVar(n.to)}">
        <span class="go-rel">${esc(n.rel)}</span>
        <span class="go-je">${esc(ESS[n.to].je)}</span>
        ${iconHTML(n.to)}
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

  /* =====================================================================
     Découvrir une nouvelle forme
     ===================================================================== */
  const isSentence = s => { const t = String(s).trim(); return /[.!?]$/.test(t) && !/…/.test(t) && t.split(/\s+/).length >= 4; };

  /* Les formes d'un onglet : expressions des sections numérotées, regroupées par clé PROGRES. */
  const POOL = {};
  function pool(tab) {
    if (POOL[tab]) return POOL[tab];
    const map = new Map();
    C.TABS[tab].items.forEach(it => {
      if (it.section.kind !== 'section') return;
      if (/distingu|comparaison|nuance/i.test(it.sub || '')) return;
      if (/≠/.test(it.plain)) return;
      const k = P.cle(it.plain);
      if (!k || k.length < 2) return;
      if (!map.has(k)) map.set(k, { k, tab, items: [] });
      map.get(k).items.push(it);
    });
    const list = Array.from(map.values());
    list.forEach(en => { en.it = en.items[0]; en.sec = en.it.section; });
    const secs = [];
    list.forEach(en => {
      let g = secs.find(x => x.sec.id === en.sec.id);
      if (!g) { g = { sec: en.sec, entries: [] }; secs.push(g); }
      g.entries.push(en);
    });
    POOL[tab] = { list, secs, byKey: map };
    return POOL[tab];
  }
  const sumTab = tab => P.resume(pool(tab).list.map(en => en.k));
  const found = s => s.total - s.nouveau;
  const countText = s => { const n = found(s); return `${n} forme${n > 1 ? 's' : ''} découverte${n > 1 ? 's' : ''} sur ${s.total}`; };
  function progBar(s, cls) {
    const t = s.total || 1;
    const w = n => (n / t * 100).toFixed(2) + '%';
    return `<span class="pbar${cls ? ' ' + cls : ''}" aria-hidden="true"><i class="pb-m" style="width:${w(s.maitrise)}"></i><i class="pb-c" style="width:${w(s['en-cours'])}"></i><i class="pb-v" style="width:${w(s.vu)}"></i></span>`;
  }

  /* Nuances écrites dans le site : « Puisque : présente… » (distinctions), fiches, schémas, notes de liste. */
  const DIST = {};
  function distOf(tab) {
    if (DIST[tab]) return DIST[tab];
    const map = new Map();
    C.TABS[tab].items.forEach(it => {
      if (it.section.kind === 'section' && !/distingu|nuance/i.test(it.sub || '')) return;
      const m = it.plain.match(/^(.+?)\s:\s(.+)$/);
      if (!m) return;
      const k = P.cle(m[1]);
      if (!map.has(k)) map.set(k, []);
      map.get(k).push({ head: m[1], text: m[2] });
    });
    DIST[tab] = map;
    return map;
  }
  const cap1 = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  function ficheFn(en) {
    const f = C.FICHE.get(en.k) || C.FICHE.get(C.norm(en.it.head));
    return f ? f.fonctions.find(x => x.tab === en.tab) || null : null;
  }
  function ownRow(en) {
    for (const s of rowSpecs(en.tab)) for (const r of s.rows) if (labelAlts(r.label).some(a => P.cle(a) === en.k)) return { spec: s, row: r };
    return null;
  }
  function nuancesFor(en) {
    const out = [];
    const add = s => { s = String(s || '').trim().replace(/\.$/, ''); if (s && !out.some(o => o.toLowerCase() === s.toLowerCase())) out.push(s); };
    const d = distOf(en.tab).get(en.k);
    if (d) { if (d.length === 1) add(cap1(d[0].text)); else d.forEach(x => add(`${x.head} : ${x.text}`)); }
    const fn = ficheFn(en);
    if (fn) add(fn.sens || fn.sous);
    const r = ownRow(en);
    if (r && r.row.sub) add(cap1(r.row.sub));
    const rest = (en.it.rest || '').trim();
    if (/^[:,]/.test(rest)) add(cap1(rest.replace(/^[:,]\s*/, '')));
    return out.slice(0, 2);
  }

  /* Exemples réels seulement : essentiels, registre formel du prototype 1, fiches, démonstration, schémas. */
  const DEMO = (M.demo && M.demo.rows) || [];
  function examplesFor(en) {
    const out = [];
    const add = (ex, src) => { if (ex && !out.some(o => o.ex === ex)) out.push({ ex: String(ex).replace(/\*/g, ''), src }); };
    const E = ESS[en.tab];
    E.cles.concat(E.qc).forEach(x => { if (P.cle(x.e) === en.k) add(x.ex, 'À l’oral'); });
    const fn = ficheFn(en);
    if (fn) { add(fn.oral, 'À l’oral'); add(fn.ecrit, 'À l’écrit'); }
    (D.formal[en.tab] || []).forEach(f => { if (P.cle(f.key) === en.k) add(f.ex, 'À l’écrit'); });
    DEMO.forEach(r => { if (r.tab === en.tab && P.cle(r.construction) === en.k) add(r.phrase.replace(/[{}]/g, ''), 'Exemple du site'); });
    const r = ownRow(en);
    if (r && r.row.ex) add(r.row.ex, 'Exemple du schéma');
    if (isSentence(en.it.plain)) add(en.it.plain, 'Exemple du site');
    if (REG === 'formel') out.sort((a, b) => (b.src === 'À l’écrit') - (a.src === 'À l’écrit'));
    return out.slice(0, 2);
  }

  /* La forme, en grand, avec ses cases. */
  const CONS_RE = /^(nom|gn|pronom|ind\.|subj\.|cond\.|inf\.|durée|date|heure|moment|période|mois|adj\.|adv\.|proposition|relative|participe|précision|antécédent|présent|futur|imparfait|impératif|plus-que-parfait)/i;
  function discFormula(en) {
    const it = en.it;
    if (isSentence(it.plain)) return '';
    const core = it.plain.replace(/\s+:\s.*$/, '').replace(/,\s+(?:généralement|surtout|souvent)\b.*$/, '').trim();
    if (/\s→\s/.test(core) && !/\s\+\s/.test(core)) {
      const [a, b] = core.split(/\s→\s/);
      return `<span class="f-from">${T(a)}</span> <span class="f-arr" aria-hidden="true">→</span> <span class="f-e">${T(b)}</span>`;
    }
    const parts = core.split(/\s\+\s/);
    if (parts.length <= 2) return formulaHTML({ e: parts[0], c: parts[1] || null, tab: en.tab, src: 'disc' });
    const toks = [`<span class="f-e">${T(parts[0])}</span>`];
    parts.slice(1).forEach(p => {
      if (CONS_RE.test(p)) { const s = slotOf(p.replace(/\.$/, '.')); toks.push(slot(s[0], s[1])); }
      else toks.push(`<span class="f-e">${T(p)}</span>`);
    });
    return toks.join(' ');
  }
  const KIND_TXT = { ind: 'indicatif', subj: 'subjonctif', cond: 'conditionnel', inf: 'infinitif' };
  function consLine(en) {
    const c = en.it.cons;
    if (!c) return '';
    const k = C.consKind(c);
    const s = slotOf(c);
    const mode = KIND_TXT[k];
    const txt = s[1] && s[0] !== s[1] ? `${s[0]} (${s[1]})` : s[0];
    return `<p class="dc-cons"><span class="dc-k">Ensuite</span><span class="ktag k-${k}">+ ${esc(c)}</span><span>${esc(txt)}</span>${mode ? `<button type="button" class="dc-why" data-goto="modes" data-mode="${k}">Pourquoi ${mode === 'infinitif' ? 'l’' : 'le '}${mode} ?</button>` : ''}</p>`;
  }
  function regBadges(codes) {
    return codes.map(c => {
      const R = C.REG[c];
      return `<abbr class="rb r-${c.toLowerCase().replace(/[^a-z]/g, '')}" title="${esc(R ? R.def : c)}">${meter(levelOf([c]))}${esc(R ? R.label : c)}</abbr>`;
    }).join('');
  }

  const DISC = { tab: null, open: false, key: null, trail: {}, done: false, last: null };
  const ICO = {
    spark: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M12 2.5l2.2 6.3 6.3 2.2-6.3 2.2L12 19.5l-2.2-6.3L3.5 11l6.3-2.2z" fill="currentColor"/><path d="M19 15.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z" fill="currentColor"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4.5 12.5l5 5 10-11" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    again: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M7 3.5h10a1 1 0 0 1 1 1V21l-6-4-6 4V4.5a1 1 0 0 1 1-1z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/></svg>',
    next: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 7h11M11 3l4 4-4 4M20 17H9M13 13l-4 4 4 4" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    close: '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 3l10 10M13 3 3 13" stroke="currentColor" stroke-width="2.2" fill="none"/></svg>'
  };

  function pickNew(tab, secId) {
    const cand = pool(tab).list.filter(en => P.statut(en.k) === 'nouveau' && en.k !== DISC.key && (!secId || en.sec.id === secId));
    if (!cand.length) return null;
    const lvl = regLvl();
    const pref = cand.filter(en => levelOf(en.it.regs) === lvl);
    return C.pick(pref.length ? pref : cand);
  }

  function discStripHTML(tab) {
    const s = sumTab(tab);
    return `<section class="disc${DISC.open ? ' is-open' : ''}" id="disc" aria-labelledby="disc-h">
      <div class="ds">
        <div class="ds-txt">
          <h2 class="ds-h" id="disc-h">Découvre une nouvelle forme</h2>
          <p class="ds-n" id="ds-n">${esc(countText(s))}</p>
          ${progBar(s, 'pbar-l')}
          <p class="ds-lg" aria-hidden="true"><span class="k-m"><i></i>connue</span><span class="k-c"><i></i>en cours</span><span class="k-v"><i></i>vue</span><span class="k-n"><i></i>nouvelle</span></p>
        </div>
        <button type="button" class="ds-go" data-disc="open" aria-controls="disc-panel"${DISC.open ? ' hidden' : ''}>${ICO.spark}<span>Découvrir</span></button>
      </div>
      <div class="dpanel" id="disc-panel"${DISC.open ? '' : ' hidden'}>${DISC.open ? discPanelHTML(tab) : ''}</div>
    </section>`;
  }

  function discPanelHTML(tab) {
    const en = DISC.key && pool(tab).byKey.get(DISC.key);
    const card = en ? discCardHTML(en) : discDoneHTML(tab);
    return `<div class="dp-grid">${card}${mapHTML(tab)}</div>`;
  }

  function discDoneHTML(tab) {
    const rev = pool(tab).list.filter(en => { const r = P.get(en.k); return r && r.revoir; });
    return `<article class="dcard is-done" aria-labelledby="dc-h">
      <div class="dc-top"><span class="dc-new is-done">${ICO.check}Tout découvert</span><button type="button" class="dc-x" data-disc="close">${ICO.close}<span>Fermer</span></button></div>
      <h3 class="dc-done" id="dc-h" tabindex="-1">Tu as vu toutes les formes de « ${esc(ESS[tab].je)} ».</h3>
      ${rev.length ? `<p class="dc-p">À revoir :</p><p class="trail">${rev.slice(0, 12).map(en => `<button type="button" class="tchip s-r" data-disc-key="${esc(en.k)}">${esc(en.it.head)}</button>`).join('')}</p>` : '<p class="dc-p">Rien n’est marqué « à revoir ». Bravo&nbsp;!</p>'}
      <p class="dc-p"><a class="more" href="${esc(tabLink(tab))}">Tout l’onglet ${tab} dans le site complet<span aria-hidden="true"> →</span></a></p>
    </article>`;
  }

  function discCardHTML(en) {
    const it = en.it, tab = en.tab;
    const st = P.statut(en.k), rec = P.get(en.k) || {};
    const codes = it.regs;
    const sentence = isSentence(it.plain);
    const exs = examplesFor(en);
    const nu = nuancesFor(en);
    const head = it.head.replace(/\s*:.*$/, '');
    const fd = sentence ? null : findDiagram(tab, head, it.cons);
    const where = [it.row, it.sub].filter(Boolean)[0];
    const otherSecs = Array.from(new Set(en.items.filter(x => x.section.id !== en.sec.id).map(x => `${x.section.num} ${x.section.title}`)));
    const siblings = Array.from(new Set(en.items.slice(1).map(x => x.plain).filter(p => p !== it.plain)));
    const say = exs.length ? exs[0].ex : head;
    const statusTxt = { nouveau: 'Nouvelle forme', vu: 'Déjà vue', 'en-cours': 'En cours', maitrise: 'Connue' }[st];
    const itLink = C.siteLink(C.itemHref(it));
    const trail = (DISC.trail[tab] || []).filter(k => k !== en.k).slice(-8);
    return `<article class="dcard lvl-${levelOf(codes)}" aria-labelledby="dc-h">
      <div class="dc-top">
        <span class="dc-new s-${st}">${ICO.spark}${esc(statusTxt)}</span>
        <button type="button" class="dc-x" data-disc="close">${ICO.close}<span>Fermer</span></button>
      </div>
      <p class="dc-where"><span class="dc-sn">${esc(en.sec.num || '')}</span><span>${esc(en.sec.title || '')}${where ? ` <span class="dc-sub">› ${esc(where)}</span>` : ''}</span></p>
      ${sentence
        ? `<h3 class="dc-h is-sent" id="dc-h" tabindex="-1">${esc(where || en.sec.title)}</h3>`
        : `<h3 class="dc-h" id="dc-h" tabindex="-1"><span class="sr">${esc(statusTxt)} : </span>${discFormula(en)}</h3>`}
      <p class="dc-regs">${regBadges(codes)}</p>
      ${consLine(en)}
      ${nu.length ? `<div class="dc-nu"><p class="dc-k">En bref</p>${nu.map(n => `<p>${md(nbsp(n))}</p>`).join('')}</div>` : ''}
      ${exs.length
        ? `<div class="dc-exs">${exs.map((x, i) => `<div class="dc-ex"><p class="dc-k">${esc(x.src)}</p><p class="ex">${sentenceHTML(x.ex, head)}</p></div>`).join('')}</div>`
        : `<div class="dc-noex"><p class="dc-k">Pas encore d’exemple dans le site</p><p>Retiens la forme et ce qui la suit&nbsp;: c’est la case pointillée.</p></div>`}
      ${speakBtn(say, true)}
      ${fd ? `<div class="dc-viz"><p class="dc-k">En image</p>${miniViz(fd, head)}</div>` : ''}
      ${siblings.length ? `<p class="dc-also"><span class="dc-k">Même forme, autres constructions</span>${siblings.slice(0, 4).map(s => `<span class="sib">${esc(s)}</span>`).join('')}</p>` : ''}
      ${otherSecs.length ? `<p class="dc-also"><span class="dc-k">Aussi rangée dans</span>${otherSecs.map(s => `<span class="sib">${esc(s)}</span>`).join('')}</p>` : ''}
      <div class="dc-act" role="group" aria-label="Que fais-tu de cette forme ?">
        <button type="button" class="act act-ok" data-act="connu" aria-pressed="${rec.connu ? 'true' : 'false'}">${ICO.check}<span>Je connais</span></button>
        <button type="button" class="act act-rv" data-act="revoir" aria-pressed="${rec.revoir ? 'true' : 'false'}">${ICO.again}<span>À revoir</span></button>
        <button type="button" class="act act-nx" data-act="autre">${ICO.next}<span>Autre forme</span></button>
      </div>
      <a class="more dc-more" href="${esc(itLink)}">Voir cette forme dans le site<span aria-hidden="true"> →</span></a>
      ${trail.length ? `<div class="dc-trail"><p class="dc-k">Tes découvertes ici</p><p class="trail">${trail.map(k => { const e2 = pool(tab).byKey.get(k); const r = P.get(k) || {}; const cls = r.connu ? 's-m' : r.revoir ? 's-r' : 's-v'; return e2 ? `<button type="button" class="tchip ${cls}" data-disc-key="${esc(k)}">${esc(e2.it.head)}</button>` : ''; }).join('')}</p></div>` : ''}
    </article>`;
  }

  /* Carte de l'intention : une ligne par sous-section, un point par forme. */
  function mapHTML(tab) {
    const pl = pool(tab);
    const rows = pl.secs.map(g => {
      const s = P.resume(g.entries.map(e => e.k));
      const left = s.nouveau;
      const cur = DISC.key && g.entries.some(e => e.k === DISC.key);
      const dots = g.entries.map(e => {
        const st = P.statut(e.k), r = P.get(e.k);
        return `<i class="dt s-${st}${r && r.revoir ? ' is-rv' : ''}${e.k === DISC.key ? ' is-cur' : ''}"></i>`;
      }).join('');
      return `<li><button type="button" class="dm-row${cur ? ' is-cur' : ''}" data-disc-sec="${esc(g.sec.id)}"${left ? '' : ' aria-disabled="true"'}>
        <span class="dm-t"><span class="dm-n">${esc(g.sec.num || '')}</span>${esc(g.sec.title || '')}</span>
        <span class="dm-dots" aria-hidden="true">${dots}</span>
        <span class="dm-c">${found(s)}/${s.total}<span class="sr"> découvertes${left ? ' : touche pour en découvrir une ici' : ''}</span></span>
      </button></li>`;
    }).join('');
    return `<div class="dmap">
      <p class="dm-h">Toutes les formes de cette intention</p>
      <p class="dm-sub">Un point = une forme. Touche une ligne pour découvrir une forme de cette nuance.</p>
      <ol class="dm-list">${rows}</ol>
    </div>`;
  }

  function refreshDisc(focus) {
    const tab = DISC.tab;
    const box = $('#disc');
    if (!box || !tab) return;
    const s = sumTab(tab);
    $('#ds-n').textContent = countText(s);
    const bar = $('.pbar-l', box);
    if (bar) bar.outerHTML = progBar(s, 'pbar-l');
    box.classList.toggle('is-open', DISC.open);
    const go = $('.ds-go', box);
    go.hidden = DISC.open;
    const panel = $('#disc-panel');
    panel.hidden = !DISC.open;
    panel.innerHTML = DISC.open ? discPanelHTML(tab) : '';
    if (focus && DISC.open) {
      const h = $('#dc-h');
      if (h) h.focus({ preventScroll: true });
      const r = box.getBoundingClientRect();
      if (r.top < 0 || r.top > window.innerHeight * 0.5) box.scrollIntoView({ block: 'start', behavior: reduce() ? 'auto' : 'smooth' });
      const card = $('.dcard', panel);
      if (card && !reduce()) card.classList.add('enter');
    }
  }

  function showForm(tab, k, focus) {
    DISC.tab = tab;
    DISC.open = true;
    DISC.key = k;
    if (k) {
      P.marquer(k, 'vu', 'decouvrir');
      const t = DISC.trail[tab] || (DISC.trail[tab] = []);
      if (!t.includes(k)) { t.push(k); if (t.length > 12) t.shift(); }
    }
    refreshDisc(focus);
  }
  function discoverNext(tab, secId, focus) {
    const en = pickNew(tab, secId);
    if (!en && secId) { announce('Toutes les formes de cette nuance sont déjà découvertes.'); return; }
    showForm(tab, en ? en.k : null, focus !== false);
  }
  function act(kind) {
    const tab = DISC.tab, k = DISC.key;
    if (!tab || !k) return;
    const en = pool(tab).byKey.get(k);
    const name = en ? en.it.head : k;
    if (kind === 'autre') { discoverNext(tab); return; }
    const r = P.get(k) || {};
    const was = kind === 'connu' ? !!r.connu : !!r.revoir;
    P.marquer(k, kind, 'decouvrir');
    if (!was) {
      announce(kind === 'connu' ? `« ${name} » : notée comme connue. Voici une autre forme.` : `« ${name} » : ajoutée à tes formes à revoir. Voici une autre forme.`);
      discoverNext(tab);
    } else {
      announce(kind === 'connu' ? `« ${name} » n’est plus marquée comme connue.` : `« ${name} » n’est plus à revoir.`);
      refreshDisc(false);
      const b = $(`[data-act="${kind}"]`);
      if (b) b.focus();
    }
  }

  /* Les formules affichées à l'écran comptent comme « vues ». */
  function markShown(tab) {
    const cards = cardsFor(tab, REG).reduce((a, g) => a.concat(g.cards), []);
    cards.forEach(c => { const k = P.cle(c.e); if (k && P.statut(k) === 'nouveau') P.marquer(k, 'vu', 'decouvrir'); });
  }

  /* =====================================================================
     La poche : l'antisèche
     ===================================================================== */
  const SLOTK = c => C.consKind(String(c).replace(/^\+\s*/, ''));
  const tag = c => c ? `<span class="ktag k-${SLOTK(c)}">+ ${esc(String(c).replace(/^\+\s*/, ''))}</span>` : '';
  const isQC = r => /(^|,\s*)(F-)?QC\b/.test(r || '');
  const qcPick = e => e.qc.find(q => isQC(q.r)) || e.qc[0];
  const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function hl(text, expr) {
    let s = esc(text);
    const pieces = String(expr).replace(/\s*\[[^\]]*\]/g, '').split(/…|\.\.\.|\s\/\s/)
      .map(p => p.replace(/^[\s,.;:—–-]+|[\s,.;:?!—–-]+$/g, '')).filter(p => p.length > 1);
    let from = 0;
    pieces.forEach(p => {
      const pat = reEsc(esc(p)).replace(/['’]/g, "['’]").replace(/\s+/g, '\\s+');
      let re;
      try { re = new RegExp('(?<![\\p{L}])' + pat + '(?![\\p{L}])', 'iu'); } catch (e) { return; }
      const m = re.exec(s.slice(from));
      if (!m) return;
      const at = from + m.index;
      const wrapped = `<b class="thl">${m[0]}</b>`;
      s = s.slice(0, at) + wrapped + s.slice(at + m[0].length);
      from = at + wrapped.length;
    });
    return s;
  }

  const PO = { side: 'recto', qc: store.get('qc', '0') === '1', ex: store.get('ex', '0') === '1', open: false, cur: null };

  function tileHTML(t) {
    const e = ESS[t], mo = MOMENT[t];
    const pick = qcPick(e);
    const s = sumTab(t);
    const cles = e.cles.slice(0, 3).map(c => `<li><span class="f-row"><span class="f-w">${esc(c.e)}</span>${c.c ? `<span class="lead" aria-hidden="true"></span>${tag(c.c)}` : ''}</span><span class="f-ex">${hl(c.ex, c.e)}</span></li>`).join('');
    const qcs = e.qc.map(q => `<li class="${q === pick ? 'is-pick' : 'is-more'}"><span class="f-row"><span class="qc-chip">QC</span><span class="f-w">${esc(q.e)}</span></span><span class="f-ex">${hl(q.ex, q.e)}</span></li>`).join('');
    return `<article class="tile" data-tab="${t}" data-mo="${mo.id}" style="${moVar(t)}">
      <div class="t-strip"><span class="t-mod" hidden>${esc(mo.label)}</span></div>
      <div class="t-top"><span class="t-num" aria-hidden="true">${pad(t)}</span>
        <h3 class="t-je"><a class="t-link" href="#t${t}">${esc(e.je)}</a></h3></div>
      <div class="t-viz">${iconHTML(t)}</div>
      <ul class="t-cles">${cles}</ul>
      <ul class="t-qc" aria-label="Au Québec">${qcs}</ul>
      <div class="t-prog" title="${esc(countText(s))}">${progBar(s)}<span class="t-pn"><span class="sr">${esc(countText(s))}</span><span aria-hidden="true">${found(s)}/${s.total}</span></span></div>
      <span class="t-here">Tu es ici</span>
    </article>`;
  }
  function renderTiles() {
    $('#tiles').innerHTML = ORDER.map(tileHTML).join('');
    markCurrentTile();
    layoutStrips();
  }
  function refreshTileBars() {
    $$('.tile').forEach(el => {
      const t = +el.dataset.tab, s = sumTab(t);
      const box = $('.t-prog', el);
      box.title = countText(s);
      box.innerHTML = `${progBar(s)}<span class="t-pn"><span class="sr">${esc(countText(s))}</span><span aria-hidden="true">${found(s)}/${s.total}</span></span>`;
    });
  }
  /* Le nom du moment n'apparaît qu'au début de chaque tronçon de la grille. */
  function layoutStrips() {
    const grid = $('#tiles');
    const tpl = getComputedStyle(grid).gridTemplateColumns;
    const cols = tpl && tpl !== 'none' ? tpl.split(' ').filter(Boolean).length : 2;
    const tiles = $$('.tile', grid);
    tiles.forEach((el, i) => {
      const m = el.dataset.mo;
      const lab = $('.t-mod', el);
      const prev = i % cols === 0 ? null : tiles[i - 1].dataset.mo;
      if (prev === m) { lab.hidden = true; return; }
      let span = 1;
      while ((i + span) % cols !== 0 && tiles[i + span] && tiles[i + span].dataset.mo === m) span++;
      lab.hidden = false;
      lab.style.setProperty('--span', span);
    });
  }
  function markCurrentTile() {
    $$('.tile').forEach(el => {
      const on = +el.dataset.tab === PO.cur;
      el.classList.toggle('is-cur', on);
      const a = $('.t-link', el);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  function scrollTileIntoView() {
    const body = $('#poche-body');
    const el = PO.cur && $(`.tile[data-tab="${PO.cur}"]`);
    if (!body || !el || PO.side !== 'recto') return;
    const b = body.getBoundingClientRect(), r = el.getBoundingClientRect();
    if (r.top < b.top + 8 || r.bottom > b.bottom - 8) body.scrollTop += (r.top - b.top) - (b.height - r.height) / 2;
  }

  /* ---------- Verso : repères transversaux ---------- */
  function tabFor(label) {
    const k = C.norm(label).replace(/[.…]+$/, '');
    for (const t of ORDER) if (ESS[t].cles.some(c => C.norm(c.e).replace(/[.…]+$/, '') === k)) return t;
    const l = C.BY_KEY.get(k);
    return l && l.length ? l[0].tab : null;
  }
  function vpanel(id, title, sub, body) {
    return `<section class="vp" id="vp-${id}" aria-labelledby="vh-${id}">
      <h3 class="vp-h" id="vh-${id}" tabindex="-1">${esc(title)}</h3>
      ${sub ? `<p class="vp-sub">${sub}</p>` : ''}
      <div class="vp-b">${body}</div></section>`;
  }
  const VERSO = [['modes', 'Quel mode ?'], ['temps', 'Le temps'], ['registres', 'Trois registres'], ['structures', 'Nom, infinitif ou phrase']];
  function renderVerso() {
    const modes = V.byId('modes'), reg = V.byId('registres'), str = V.byId('structures');
    const cur = PO.cur;
    const timeSpecs = ['durees', 'simultaneite'].map(id => V.byId(id)).filter(Boolean);
    const html = `<nav class="vnav" aria-label="Repères du verso">${VERSO.map(([id, t]) => `<a href="#vp-${id}" data-vjump="${id}">${esc(t)}</a>`).join('')}</nav>
      ${vpanel('modes', 'Quel mode ?', 'Ce qui vient après l’expression. Touche une expression pour aller à son intention.' + (cur ? ' <span class="here-k">Encadrées : celles de l’intention où tu es.</span>' : ''), modes ? V.render(modes, { title: false }) : '')}
      ${vpanel('temps', 'Le temps en un coup d’œil', 'Frise&nbsp;: passé, aujourd’hui, futur. Deux voies&nbsp;: le cadre (orange) en haut, la phrase principale (violet) en bas.', timeSpecs.map(s => V.render(s, { examples: PO.ex })).join(''))}
      ${vpanel('registres', 'Trois registres', reg ? md(reg.intro) : '', reg ? V.render(reg, { title: false }) : '')}
      ${vpanel('structures', 'Nom, infinitif ou phrase', str ? md(str.intro) : '', str ? V.render(str, { title: false }) : '')}`;
    $('#verso').innerHTML = html;
    decorateModes($('#vp-modes'));
    /* Lignes de la grille liées à l'intention courante */
    const th = cur ? (THEMES[cur] || []) : [];
    ['registres', 'structures'].forEach(id => {
      const fig = $(`#vp-${id}`);
      if (!fig || !th.length) return;
      $$('.vz-gr', fig).forEach(r => { const t = $('.vz-th', r); if (t && th.includes(t.textContent.trim())) r.classList.add('is-here'); });
    });
  }
  function decorateModes(root) {
    if (!root) return;
    const kinds = ['ind', 'subj', 'cond', 'inf'];
    $$('.vz-col', root).forEach((col, i) => {
      col.dataset.mode = kinds[i] || '';
      const h = $('h4', col);
      if (h && kinds[i]) h.insertAdjacentHTML('afterbegin', `<span class="ktag k-${kinds[i]}">${['ind.', 'subj.', 'cond.', 'inf.'][i]}</span> `);
      $$('li', col).forEach(li => {
        const label = li.textContent.trim();
        const t = tabFor(label.split(' + ')[0]);
        if (!t) return;
        const here = t === PO.cur;
        li.innerHTML = `<a class="mode-b${here ? ' is-here' : ''}" href="#t${t}" style="${moVar(t)}">${li.innerHTML}<span class="mode-n">${pad(t)}</span></a>`;
      });
    });
  }

  function setSide(side) {
    PO.side = side;
    $('#recto').hidden = side !== 'recto';
    $('#verso').hidden = side !== 'verso';
    $$('.side-seg [data-side]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.side === side)));
    $('#poche-body').scrollTop = 0;
    if (side === 'recto') { layoutStrips(); scrollTileIntoView(); }
  }
  function gotoPanel(id, mode) {
    openPoche();
    setSide('verso');
    const p = $('#vp-' + id);
    if (!p) return;
    const body = $('#poche-body');
    body.scrollTop += p.getBoundingClientRect().top - body.getBoundingClientRect().top - 8;
    $$('.vz-col.is-flash').forEach(c => c.classList.remove('is-flash'));
    const target = mode ? $(`.vz-col[data-mode="${mode}"]`, p) : null;
    if (target) { void target.offsetWidth; target.classList.add('is-flash'); }
    const h = $('.vp-h', p);
    if (h) h.focus({ preventScroll: true });
  }
  function applyToggles() {
    ROOT.classList.toggle('qc-on', PO.qc);
    ROOT.classList.toggle('ex-on', PO.ex);
    $('#tog-qc').setAttribute('aria-pressed', String(PO.qc));
    $('#tog-ex').setAttribute('aria-pressed', String(PO.ex));
  }

  /* Téléphone : la barre du bas se déplie en feuille ; ordinateur : colonne toujours visible. */
  const wide = window.matchMedia('(min-width: 1100px)');
  const poche = $('#poche'), sheet = $('#poche-sheet'), bar = $('#poche-bar'), scrim = $('#scrim');
  function openPoche() {
    if (wide.matches || PO.open) return;
    PO.open = true;
    poche.classList.add('is-open');
    bar.setAttribute('aria-expanded', 'true');
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.setAttribute('aria-labelledby', 'poche-h');
    scrim.hidden = false;
    ['app', 'topbar'].forEach(id => { const el = document.getElementById(id); if (el) el.inert = true; });
    ROOT.classList.add('poche-open');
    layoutStrips();
    scrollTileIntoView();
    $('#poche-h').focus({ preventScroll: true });
  }
  function closePoche(refocus) {
    if (!PO.open) return;
    PO.open = false;
    poche.classList.remove('is-open');
    bar.setAttribute('aria-expanded', 'false');
    ['role', 'aria-modal', 'aria-labelledby'].forEach(a => sheet.removeAttribute(a));
    scrim.hidden = true;
    ['app', 'topbar'].forEach(id => { const el = document.getElementById(id); if (el) el.inert = false; });
    ROOT.classList.remove('poche-open');
    if (refocus !== false) bar.focus();
  }
  function syncBar() {
    const t = PO.cur;
    $('#pb-icon').innerHTML = t ? iconHTML(t) : '';
    $('#pb-cur').innerHTML = t ? `<b>${pad(t)}</b> ${esc(ESS[t].je)}` : 'Les 12 intentions · modes, temps, registres';
    poche.setAttribute('style', t ? moVar(t) : '');
    poche.classList.toggle('has-cur', !!t);
  }

  /* =====================================================================
     Écrans
     ===================================================================== */
  const app = () => document.getElementById('app');

  function homeHTML() {
    const stations = MOMENTS.map((m, i) => `
      <li class="station" id="m-${m.id}" style="--m:var(--mo-${m.id});--on:var(--on-${m.id})">
        <h2 class="st-h"><span class="st-n" aria-hidden="true">${i + 1}</span>${esc(m.label)}</h2>
        <ul class="ints${m.tabs.length > 2 ? ' many' : ''}">
          ${m.tabs.map(t => { const s = sumTab(t); return `<li><a class="int" href="#t${t}">
            ${iconHTML(t, 'int-ic')}
            <span class="int-je">${esc(ESS[t].je)}</span>
            <span class="int-q">${esc(ESS[t].quand)}</span>
            <span class="int-p" data-prog="${t}">${progBar(s)}<span>${esc(countText(s))}</span></span>
            <svg class="int-go" viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a></li>`; }).join('')}
        </ul>
      </li>`).join('');
    return `<div class="home wrap">
      <div class="home-q">
        <h1 class="q" tabindex="-1"><span class="nw">Qu’est-ce</span> que tu veux <span class="hl">faire</span>&nbsp;?</h1>
        <p class="q-sub">Choisis ce que tu veux dire. Tu auras les mots, un exemple et une image. Et chaque fois, une forme nouvelle à découvrir.</p>
        <p class="q-poche"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>L’antisèche reste <b>en poche</b>${'' /* */}<span class="q-poche-m"> : en bas de l’écran</span><span class="q-poche-d"> : à droite</span>. Touche une tuile pour sauter d’une intention à l’autre en pleine conversation.</span></p>
      </div>
      <ol class="line" aria-label="Les moments d’une conversation">${stations}</ol>
      <p class="home-foot"><a class="site" href="../../index.html">Tout voir dans le site complet<span aria-hidden="true"> →</span></a></p>
    </div>`;
  }

  function segHTML() {
    return `<fieldset class="seg" data-reg="${REG}">
      <legend class="seg-l">Tu parles…</legend>
      <div class="seg-in">
        ${REGS.map(r => `<input type="radio" name="reg" id="reg-${r.id}" value="${r.id}"${r.id === REG ? ' checked' : ''}><label for="reg-${r.id}">${meter(r.lvl)}<span>${r.label}</span></label>`).join('')}
        <span class="seg-thumb" aria-hidden="true"></span>
      </div>
    </fieldset>`;
  }

  function groupsHTML(tab) {
    let n = 0;
    return cardsFor(tab, REG).filter(g => g.cards.length || (g.rest && g.rest.length)).map(g => `
      <section class="group">
        <h2 class="g-h">${esc(g.title)}</h2>
        ${g.note ? `<p class="g-note">${esc(g.note)}</p>` : ''}
        <div class="cards">${g.cards.map(c => cardHTML(c, n++)).join('')}</div>
        ${g.rest && g.rest.length ? `<p class="rest"><span>Aussi soutenu :</span> ${g.rest.map(it => `<a href="${esc(C.siteLink(C.itemHref(it)))}">${esc(it.plain)}</a>`).join('')}</p>` : ''}
      </section>`).join('') + `<p class="again"><span>Tu connais déjà ces formules&nbsp;?</span><button type="button" class="again-b" data-disc="open">${ICO.spark}Découvre une forme nouvelle</button></p>`;
  }

  function qcStripHTML(tab) {
    if (REG !== 'neutre') return '';
    const E = ESS[tab];
    return `<section class="band" aria-labelledby="qc-h"><div class="wrap">
      <h2 class="band-h" id="qc-h">Entre amis, au Québec</h2>
      <ul class="qc">${E.qc.map(q => {
        const codes = codesOf(q.r || 'C');
        return `<li><p class="qc-e">${T(q.e)}<span class="qc-r">${meter(levelOf(codes))}${esc(regText(codes))}</span></p><p class="qc-x">${sentenceHTML(q.ex, q.e)}</p></li>`;
      }).join('')}</ul>
      <button type="button" class="band-btn" data-reg-set="amis">Voir tout en « Entre amis »</button>
    </div></section>`;
  }

  function intentHTML(tab) {
    const E = ESS[tab], mo = MOMENT[tab];
    const link = rowLink(tab);
    const imgs = V.forTab(tab).concat(extraSpecs(tab)).map(s => `<div class="panel">${V.render(s, { examples: true, link })}</div>`).join('');
    return `<article class="intent" data-tab="${tab}" style="${moVar(tab)}">
      <header class="i-head wrap">
        <nav class="i-nav" aria-label="Où tu es">
          <a class="back" href="#m-${mo.id}"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M19 12H6M11 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>Autre chose</a>
          <ol class="mline">${MOMENTS.map(m => `<li class="${m.id === mo.id ? 'is-cur' : ''}" style="--m:var(--mo-${m.id})"><a href="#m-${m.id}"${m.id === mo.id ? ' aria-current="step"' : ''}><span class="md" aria-hidden="true"></span><span class="ml">${esc(m.label)}</span></a></li>`).join('')}</ol>
        </nav>
        <div class="i-id">
          <div>
            <p class="i-k"><span class="i-num">${pad(tab)}</span>Je veux…</p>
            <h1 class="i-t" tabindex="-1"><span class="hl">${esc(E.je)}</span></h1>
            <p class="i-q">${esc(E.quand)}</p>
          </div>
          ${iconHTML(tab, 'i-ic')}
        </div>
        ${discStripHTML(tab)}
        <div class="i-tools">${segHTML()}${legendFor(tab)}</div>
      </header>

      <div class="wrap" id="groups">${groupsHTML(tab)}</div>
      <div id="qcband">${qcStripHTML(tab)}</div>

      <section class="wrap tips" aria-label="À retenir">
        <p class="attn"><svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M12 3 2.5 20h19z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M12 10v4.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><circle cx="12" cy="17.2" r="1.3" fill="currentColor"/></svg><span><b class="attn-k">Attention</b> ${md(nbsp(E.attention))}</span></p>
        <div class="relance"><p class="rl-k">Pour continuer la conversation&nbsp;:</p><p class="rl-q"><span>«&nbsp;${T(E.relance)}&nbsp;»</span>${speakBtn(E.relance)}</p></div>
      </section>

      <section class="wrap images" aria-labelledby="img-h">
        <h2 class="s-h" id="img-h">Comprendre en image</h2>
        <p class="s-sub">Orange&nbsp;: ce que l’expression introduit. Violet&nbsp;: la phrase principale. Chaque ligne mène à l’expression dans le site complet.</p>
        <div class="panels">${imgs}</div>
      </section>

      <section class="wrap next" aria-labelledby="next-h">
        <h2 class="s-h" id="next-h">Ensuite, tu peux…</h2>
        ${nextHTML(tab)}
        ${modelHTML(tab)}
      </section>

      <footer class="wrap i-foot">
        <a class="site" href="${esc(tabLink(tab))}">Tout voir dans le site complet<span aria-hidden="true"> →</span></a>
        <span class="i-foot-s">Onglet ${tab} · ${esc(S.tabs[tab].title)}</span>
      </footer>
    </article>`;
  }

  /* ---------- Rendu et navigation ---------- */
  function render() {
    const h = decodeURIComponent(location.hash || '');
    const m = h.match(/^#t(\d+)(-d)?$/);
    const root = app();
    const tab = m && ESS[+m[1]] ? +m[1] : null;
    const wasOpen = PO.open;
    if (wasOpen) closePoche(false);
    document.body.classList.toggle('on-intent', !!tab);
    PO.cur = tab;
    if (tab) {
      if (DISC.tab !== tab) { DISC.tab = tab; DISC.open = false; DISC.key = null; }
      if (m[2] && !DISC.open) { const en = pickNew(tab); DISC.open = true; DISC.key = en ? en.k : null; if (en) { P.marquer(en.k, 'vu', 'decouvrir'); DISC.trail[tab] = [en.k]; } }
      markShown(tab);
      root.innerHTML = intentHTML(tab);
      document.title = `${ESS[tab].je} — Je veux… en poche`;
      window.scrollTo(0, 0);
      const t = root.querySelector('.i-t');
      if (t) t.focus({ preventScroll: true });
    } else {
      DISC.tab = null; DISC.open = false; DISC.key = null;
      const wasHome = root.querySelector('.home');
      if (!wasHome) root.innerHTML = homeHTML();
      document.title = 'Je veux… en poche';
      const mm = h.match(/^#m-([a-z]+)$/);
      const target = mm && document.getElementById('m-' + mm[1]);
      if (target) {
        target.scrollIntoView({ block: 'start' });
        const a = target.querySelector('.int');
        if (a) a.focus({ preventScroll: true });
      } else if (!wasHome) {
        window.scrollTo(0, 0);
        const q = root.querySelector('.q');
        if (q && h) q.focus({ preventScroll: true });
      }
    }
    syncBar();
    markCurrentTile();
    renderVerso();
    if (PO.side === 'recto') scrollTileIntoView();
    root.classList.remove('enter');
    void root.offsetWidth;
    root.classList.add('enter');
  }

  function setReg(r) {
    if (!['amis', 'neutre', 'formel'].includes(r) || r === REG) return;
    REG = r;
    store.set('reg', r);
    const tab = +(document.querySelector('.intent') || { dataset: {} }).dataset.tab;
    if (!tab) return;
    const seg = $('.seg');
    if (seg) seg.dataset.reg = r;
    const inp = document.getElementById('reg-' + r);
    if (inp) inp.checked = true;
    markShown(tab);
    $('#groups').innerHTML = groupsHTML(tab);
    $('#qcband').innerHTML = qcStripHTML(tab);
  }

  let liveT = 0;
  function announce(msg) {
    const l = $('#live');
    l.textContent = '';
    clearTimeout(liveT);
    liveT = setTimeout(() => { l.textContent = msg; }, 60);
  }

  function onProgress() {
    if (DISC.tab) {
      const s = sumTab(DISC.tab);
      const n = $('#ds-n');
      if (n) n.textContent = countText(s);
      const b = $('#disc .pbar-l');
      if (b) b.outerHTML = progBar(s, 'pbar-l');
    }
    refreshTileBars();
    $$('[data-prog]').forEach(el => { const s = sumTab(+el.dataset.prog); el.innerHTML = `${progBar(s)}<span>${esc(countText(s))}</span>`; });
  }

  function initTheme() {
    const btn = $('#theme-btn');
    const isDark = () => {
      const t = ROOT.getAttribute('data-theme');
      if (t) return t === 'dark';
      return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    };
    const sync = () => btn.setAttribute('aria-label', isDark() ? 'Passer au thème clair' : 'Passer au thème sombre');
    btn.addEventListener('click', () => {
      const next = isDark() ? 'light' : 'dark';
      ROOT.setAttribute('data-theme', next);
      store.set('theme', next);
      sync();
    });
    sync();
  }

  function init() {
    initTheme();
    renderTiles();
    applyToggles();
    setSide('recto');

    document.addEventListener('change', e => { if (e.target && e.target.name === 'reg') setReg(e.target.value); });
    document.addEventListener('click', e => {
      const t = e.target;
      const s = t.closest('[data-say]');
      if (s) { speak(s.getAttribute('data-say')); return; }
      const b = t.closest('[data-reg-set]');
      if (b) {
        setReg(b.getAttribute('data-reg-set'));
        const g = $('#groups');
        if (g) g.scrollIntoView({ block: 'start', behavior: reduce() ? 'auto' : 'smooth' });
        return;
      }
      const d = t.closest('[data-disc]');
      if (d) {
        const tab = DISC.tab;
        if (!tab) return;
        if (d.dataset.disc === 'open') { if (DISC.open && DISC.key) refreshDisc(true); else discoverNext(tab); }
        else if (d.dataset.disc === 'close') { DISC.open = false; refreshDisc(false); const go = $('.ds-go'); if (go) go.focus(); }
        return;
      }
      const a = t.closest('[data-act]');
      if (a) { act(a.dataset.act); return; }
      const dk = t.closest('[data-disc-key]');
      if (dk) { showForm(DISC.tab, dk.dataset.discKey, true); return; }
      const ds = t.closest('[data-disc-sec]');
      if (ds) { if (ds.getAttribute('aria-disabled') === 'true') { announce('Toutes les formes de cette nuance sont déjà découvertes.'); return; } discoverNext(DISC.tab, ds.dataset.discSec); return; }
      const g = t.closest('[data-goto]');
      if (g) { e.preventDefault(); gotoPanel(g.dataset.goto, g.dataset.mode); return; }
      const vj = t.closest('[data-vjump]');
      if (vj) { e.preventDefault(); gotoPanel(vj.dataset.vjump); return; }
      const sd = t.closest('.side-seg [data-side]');
      if (sd) { setSide(sd.dataset.side); return; }
      /* Une tuile de l'intention courante : on referme simplement la poche. */
      const ln = t.closest('#poche a[href^="#t"]');
      if (ln && ln.getAttribute('href') === location.hash) { e.preventDefault(); closePoche(false); const h1 = $('.i-t'); if (h1) h1.focus(); }
    });
    bar.addEventListener('click', () => (PO.open ? closePoche() : openPoche()));
    $('#poche-close').addEventListener('click', () => closePoche());
    scrim.addEventListener('click', () => closePoche());
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && PO.open) { e.preventDefault(); closePoche(); } });
    $('#tog-qc').addEventListener('click', () => { PO.qc = !PO.qc; store.set('qc', PO.qc ? '1' : '0'); applyToggles(); });
    $('#tog-ex').addEventListener('click', () => { PO.ex = !PO.ex; store.set('ex', PO.ex ? '1' : '0'); applyToggles(); renderVerso(); });
    const onWide = () => { if (wide.matches) closePoche(false); layoutStrips(); };
    if (wide.addEventListener) wide.addEventListener('change', onWide); else if (wide.addListener) wide.addListener(onWide);
    let rt = 0;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(layoutStrips, 120); });
    P.surChangement(onProgress);
    window.addEventListener('hashchange', render);
    render();
  }

  window.PB = { pool, examplesFor, nuancesFor, pickNew, findDiagram, discFormula, sumTab };
  init();
})();
