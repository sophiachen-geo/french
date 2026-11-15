/* Prototype 1 · « Je veux… » — l'intention d'abord.
   Accueil : une question, des intentions rangées par moment de la conversation.
   Écran d'intention : formules clés (grandes cartes avec schéma), registre, Québec,
   piège, relance, schémas de l'onglet, et les intentions qui suivent souvent. */
(function () {
  'use strict';

  const S = window.SITE, M = S.meta, C = window.CADRES, V = window.VIZ, D = window.P1DATA;
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const md = s => V.md(s);
  /* Espaces insécables du français : « … », ? ! : ; (même longueur : les positions restent valables). */
  const nbsp = s => String(s == null ? '' : s).replace(/ ([;:?!»])/g, '\u00A0$1').replace(/« /g, '«\u00A0');
  const T = s => esc(nbsp(s));
  const key = s => C.norm(s).replace(/^[\s.,]+/, '').replace(/[\s.;:,!?]+$/, '');

  const ESS = {};
  M.essentiels.forEach(e => { ESS[e.tab] = e; });
  const MOMENTS = M.moments;
  const momentOf = tab => MOMENTS.find(m => m.tabs.includes(tab));
  const ORDER = MOMENTS.reduce((a, m) => a.concat(m.tabs), []);
  const tabLink = tab => C.siteLink('#onglet-' + tab);

  /* ---------- Stockage (préférences de ce navigateur seulement) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('p1:' + k); return v === null ? d : v; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('p1:' + k, v); } catch (e) { /* indisponible */ } }
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

  /* ---------- Schémas : trouver la ligne qui dessine une formule ---------- */
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
    const own = found.row.label === e || labelAlts(found.row.label).includes(key(String(e).split(/\s+\/\s+/)[0]));
    const cap = own ? '' : `<p class="mini-c">Même schéma que <b>${T(String(found.row.label).replace(/\s*\[[^\]]+\]/g, ''))}</b></p>`;
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
      let m, starts = [];
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
    const others = f.fonctions.filter(x => x.tab !== card.tab);
    if (!others.length) return '';
    const seen = new Set();
    const links = others.filter(x => !seen.has(x.tab) && seen.add(x.tab)).map(x =>
      `<a class="also-l" href="#t${x.tab}">${glyph(x.tab)}<span><b>${esc(x.fonction)}</b> · ${esc(ESS[x.tab].je)}</span></a>`).join('');
    return `<div class="also"><p class="also-h">Le même mot sert aussi à…</p>${links}</div>`;
  }

  /* ---------- Cartes ---------- */
  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';
  function speakBtn(text) {
    if (!canSpeak || !text) return '';
    return `<button type="button" class="say" data-say="${esc(text)}" aria-label="Écouter : ${esc(text)}"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>`;
  }

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
        { title: 'Pour un courriel, une lettre, une entrevue', note: hasS ? 'Expressions marquées « soutenu » dans le site.' : 'Aucune expression de cette fonction n’est marquée « soutenu » : ces formules courantes passent très bien à l’écrit.', cards: featured, rest },
        { title: 'Ça marche aussi en formel', cards: cles.filter(c => !informal(c)) },
        { title: 'À garder pour l’oral', cards: cles.filter(informal).map(c => Object.assign({ flagOral: true }, c)) }
      ];
    }
    return [{ title: 'Les formules clés', cards: cles }];
  }

  /* ---------- Légende des couleurs (celle du premier schéma de l'onglet) ---------- */
  function legendFor(tab) {
    const s = rowSpecs(tab).find(x => Array.isArray(x.legend)) || null;
    const items = s ? s.legend : [['cadre', 'ce que l’expression introduit'], ['main', 'la phrase principale']];
    const lanes = tab === 12 ? [['main', 'l’autre personne'], ['cadre', 'toi']] : items;
    return `<p class="lg">${lanes.map(([c, t]) => `<span class="lg-${c === 'main' ? 'm' : c === 'cadre' ? 'c' : 'x'}"><i></i>${esc(t)}</span>`).join('')}</p>`;
  }

  /* ---------- Schémas transversaux filtrés pour l'onglet ---------- */
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

  /* ---------- Liens entre fonctions ---------- */
  function nextOf(tab) {
    const out = [], seen = new Set([tab]);
    const add = (to, rel) => { if (seen.has(to) || !ESS[to]) return; seen.add(to); out.push({ to, rel }); };
    M.chains.forEach(c => c.steps.forEach((s, i) => { if (s[1] === tab && c.steps[i + 1]) add(c.steps[i + 1][1], `${s[0]} → ${c.steps[i + 1][0]}`); }));
    S.models.forEach(m => m.steps.forEach((s, i) => { if (s[1] === tab && m.steps[i + 1]) add(m.steps[i + 1][1], `${s[0]} → ${m.steps[i + 1][0]}`); }));
    M.scenarios.forEach(sc => sc.fonctions.forEach((f, i) => { if (f === tab && sc.fonctions[i + 1]) add(sc.fonctions[i + 1], `Souvent ensuite · ${sc.theme}`); }));
    /* Fin de la conversation : on relance l'autre, ou on ouvre un nouveau sujet. */
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

  function scenariosHTML(tab) {
    const list = M.scenarios.filter(s => s.fonctions.includes(tab)).slice(0, 2);
    if (!list.length) return '';
    return `<div class="scen">${list.map(s => `<div class="sc">
      <p class="sc-dit"><span class="sc-who">On te dit</span>«&nbsp;${T(s.dit)}&nbsp;»</p>
      <p class="sc-tu">Tu peux enchaîner :</p>
      <ol class="sc-chain">${s.fonctions.map(f => `<li>${f === tab ? `<span class="chip is-cur">${esc(ESS[f].je)}</span>` : `<a class="chip" href="#t${f}">${esc(ESS[f].je)}</a>`}</li>`).join('')}</ol>
    </div>`).join('')}</div>`;
  }

  /* ---------- Écrans ---------- */
  const app = () => document.getElementById('app');
  let REG = ['amis', 'neutre', 'formel'].includes(store.get('reg', 'neutre')) ? store.get('reg', 'neutre') : 'neutre';

  function homeHTML() {
    const stations = MOMENTS.map((m, i) => `
      <li class="station" id="m-${m.id}">
        <h2 class="st-h"><span class="st-n" aria-hidden="true">${i + 1}</span>${esc(m.label)}</h2>
        <ul class="ints${m.tabs.length > 2 ? ' many' : ''}">
          ${m.tabs.map(t => `<li><a class="int" href="#t${t}">
            ${glyph(t)}
            <span class="int-je">${esc(ESS[t].je)}</span>
            <span class="int-q">${esc(ESS[t].quand)}</span>
            <svg class="int-go" viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a></li>`).join('')}
        </ul>
      </li>`).join('');
    return `<div class="home wrap">
      <div class="home-q">
        <h1 class="q" tabindex="-1"><span class="nw">Qu’est-ce</span> que tu veux <span class="hl">faire</span>&nbsp;?</h1>
        <p class="q-sub">Choisis ce que tu veux dire. Tu auras les mots, un exemple et une image.</p>
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
      </section>`).join('');
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
    const E = ESS[tab], mo = momentOf(tab);
    const specs = V.forTab(tab);
    const link = rowLink(tab);
    const imgs = specs.concat(extraSpecs(tab)).map(s => `<div class="panel">${V.render(s, { examples: true, link })}</div>`).join('');
    return `<article class="intent" data-tab="${tab}">
      <header class="i-head wrap">
        <nav class="i-nav" aria-label="Où tu es">
          <a class="back" href="#m-${mo.id}"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M19 12H6M11 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>Autre chose</a>
          <ol class="mline">${MOMENTS.map(m => `<li class="${m.id === mo.id ? 'is-cur' : ''}"><a href="#m-${m.id}"${m.id === mo.id ? ' aria-current="step"' : ''}><span class="md" aria-hidden="true"></span><span class="ml">${esc(m.label)}</span></a></li>`).join('')}</ol>
        </nav>
        <p class="i-k">Je veux…</p>
        <h1 class="i-t" tabindex="-1"><span class="hl">${esc(E.je)}</span></h1>
        <p class="i-q">${esc(E.quand)}</p>
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
        <p class="s-sub">Chaque ligne mène à l’expression dans le site complet.</p>
        <div class="panels">${imgs}</div>
      </section>

      <section class="wrap next" aria-labelledby="next-h">
        <h2 class="s-h" id="next-h">Ensuite, tu peux…</h2>
        ${nextHTML(tab)}
        <div class="next-more">${modelHTML(tab)}${scenariosHTML(tab)}</div>
      </section>

      <footer class="wrap i-foot">
        <a class="site" href="${esc(tabLink(tab))}">Tout voir dans le site complet<span aria-hidden="true"> →</span></a>
        <span class="i-foot-s">Onglet ${tab} · ${esc(S.tabs[tab].title)}</span>
      </footer>
    </article>`;
  }

  /* ---------- Rendu et navigation ---------- */
  function render() {
    const h = location.hash || '';
    const m = h.match(/^#t(\d+)$/);
    const root = app();
    const tab = m ? +m[1] : null;
    document.body.classList.toggle('on-intent', !!(tab && ESS[tab]));
    if (tab && ESS[tab]) {
      root.innerHTML = intentHTML(tab);
      document.title = `${ESS[tab].je} — Je veux… (Prototype 1)`;
      window.scrollTo(0, 0);
      const t = root.querySelector('.i-t');
      if (t) t.focus({ preventScroll: true });
    } else {
      const wasHome = root.querySelector('.home');
      if (!wasHome) root.innerHTML = homeHTML();
      document.title = 'Je veux… — Prototype 1';
      const mm = h.match(/^#m-([a-z]+)$/);
      const target = mm && document.getElementById('m-' + mm[1]);
      if (target) {
        target.scrollIntoView({ block: 'start' });
        const a = target.querySelector('.int');
        if (a) a.focus({ preventScroll: true });
      } else if (!wasHome) {
        window.scrollTo(0, 0);
      }
    }
    root.classList.remove('enter');
    void root.offsetWidth;
    root.classList.add('enter');
  }

  function setReg(r) {
    if (!['amis', 'neutre', 'formel'].includes(r) || r === REG) return;
    REG = r;
    store.set('reg', r);
    const tab = +(document.querySelector('.intent') || {}).dataset.tab;
    if (!tab) return;
    const seg = document.querySelector('.seg');
    if (seg) seg.dataset.reg = r;
    const inp = document.getElementById('reg-' + r);
    if (inp) inp.checked = true;
    document.getElementById('groups').innerHTML = groupsHTML(tab);
    document.getElementById('qcband').innerHTML = qcStripHTML(tab);
  }

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

  function initTheme() {
    const btn = document.getElementById('theme-btn');
    const isDark = () => {
      const t = document.documentElement.getAttribute('data-theme');
      if (t) return t === 'dark';
      return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    };
    const sync = () => btn.setAttribute('aria-label', isDark() ? 'Passer au thème clair' : 'Passer au thème sombre');
    btn.addEventListener('click', () => {
      const next = isDark() ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('p1:theme', next); } catch (e) { /* indisponible */ }
      sync();
    });
    sync();
  }

  function init() {
    initTheme();
    document.addEventListener('change', e => { if (e.target && e.target.name === 'reg') setReg(e.target.value); });
    document.addEventListener('click', e => {
      const s = e.target.closest('[data-say]');
      if (s) { speak(s.getAttribute('data-say')); return; }
      const b = e.target.closest('[data-reg-set]');
      if (b) {
        setReg(b.getAttribute('data-reg-set'));
        const g = document.getElementById('groups');
        if (g) g.scrollIntoView({ block: 'start', behavior: C.reduceMotion() ? 'auto' : 'smooth' });
      }
    });
    window.addEventListener('hashchange', render);
    render();
  }

  window.P1 = { findDiagram, findRanges, lanesFor, sentenceHTML, formulaHTML, cardsFor, nextOf, key };
  if (typeof document !== 'undefined' && document.getElementById && document.getElementById('app')) init();
})();
