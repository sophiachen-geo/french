/* Prototype 4 · Antisèche
   Une feuille plastifiée : recto = 12 tuiles (une par fonction), verso = repères transversaux.
   Toutes les données viennent de SITE.meta (essentiels, moments, chains, scenarios, visuels)
   et de window.CADRES / window.VIZ. Rien n'est inventé ici, sauf les libellés d'interface. */
(function () {
  'use strict';

  const C = window.CADRES, S = window.SITE, V = window.VIZ;
  if (!C || !V || !S) return;
  const M = S.meta;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = C.esc, md = V.md, norm = C.norm;
  const pad = n => String(n).padStart(2, '0');
  const ROOT = document.documentElement;

  const ESS = {};
  M.essentiels.forEach(e => { ESS[e.tab] = e; });
  const ORDER = C.TAB_IDS.filter(t => ESS[t]);
  const MOD = C.MOD;
  const MOMENT = {};
  M.moments.forEach(m => m.tabs.forEach(t => { MOMENT[t] = m; }));

  /* ---------- Préférences (localStorage protégé) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('antiseche:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('antiseche:' + k, JSON.stringify(v)); } catch (e) { /* indisponible */ } }
  };
  const state = { qc: !!store.get('qc', false), ex: !!store.get('ex', false), side: 'recto', moment: null, card: null, opener: null };
  const reduce = () => C.reduceMotion();

  /* ---------- Pictogrammes : la ligne de schéma la plus parlante pour chaque fonction ---------- */
  const ICON = {
    1: ['relief', 1], 2: ['relatives', 0], 3: ['durees', 1], 4: ['cause', 0], 5: ['consequence', 0], 6: ['but', 0],
    7: ['si', 2], 8: ['concession', 0], 9: ['certitude', [1, 5]], 10: ['ajouter', 0], 11: ['discours', 0], 12: ['tours', 0]
  };
  /* Un pictogramme = le dessin seul : on retire les mots longs, on garde chiffres et signes. */
  const iconMarks = marks => marks.filter(m => m.k !== 'text').map(m => {
    const o = Object.assign({}, m);
    if ((o.k === 'box' || o.k === 'wall' || o.k === 'gap') && o.text && o.text.length > 3) delete o.text;
    return o;
  });
  function iconSpec(tab) {
    const [id, pick] = ICON[tab];
    const s = V.byId(id);
    if (!s) return null;
    if (Array.isArray(pick)) {
      /* Fonction 9 : deux jauges superposées (doute → subjonctif, opinion → indicatif). */
      const rows = pick.map(i => s.rows[i]);
      const marks = [];
      rows.forEach((r, lane) => iconMarks(r.marks).forEach(m => marks.push(Object.assign(m, { lane }))));
      return { spec: { lanes: 2, rows: [{ label: rows.map(r => r.label).join(' / '), sub: 'doute ou opinion', marks }] }, id, rows: pick };
    }
    const r = s.rows[pick];
    return {
      spec: { lanes: s.lanes, axis: s.axis, flow: s.flow, baseline: s.baseline, rows: [{ label: r.label, sub: r.sub, marks: iconMarks(r.marks) }] },
      id, rows: [pick]
    };
  }
  const iconHTML = tab => { const i = iconSpec(tab); return i ? V.render(i.spec, { title: false, examples: false }) : ''; };

  /* ---------- Petits composants ---------- */
  const kindOf = c => C.consKind(String(c).replace(/^\+\s*/, ''));
  const MODE_PANEL = { ind: 'ind', subj: 'subj', cond: 'cond', inf: 'inf', tense: 'ind' };
  function slot(c, asButton) {
    if (!c) return '';
    const txt = String(c).replace(/^\+\s*/, '');
    const k = kindOf(c);
    if (asButton && MODE_PANEL[k]) {
      return `<button type="button" class="slot k-${k}" data-goto="modes" data-mode="${MODE_PANEL[k]}" title="Voir « Quel mode ? » au verso">+ ${esc(txt)}</button>`;
    }
    return `<span class="slot k-${k}">+ ${esc(txt)}</span>`;
  }
  /* Registre : sur la tuile, seulement ce qui change l'usage (familier, soutenu) ; sur la fiche, le libellé complet. */
  function regs(r, full) {
    if (!r) return '';
    return r.split(',').map(x => x.trim()).filter(Boolean)
      .filter(code => full || code === 'F-QC' || code === 'S')
      .map(code => {
        const R = C.REG[code];
        const cls = 'rg-' + code.toLowerCase().replace(/[^a-z]/g, '');
        return `<abbr class="rg ${cls}" title="${R ? esc(R.label + ' : ' + R.def) : esc(code)}">${esc(full && R ? R.label : code)}</abbr>`;
      }).join('');
  }
  const isQC = r => /(^|,\s*)(F-)?QC\b/.test(r || '');
  const qcPick = e => e.qc.find(q => isQC(q.r)) || e.qc[0];

  /* Surligne l'expression dans l'exemple (orange = le cadre). */
  const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function hl(text, expr) {
    let s = esc(text);
    const pieces = String(expr).replace(/\s*\[[^\]]*\]/g, '')
      .split(/…|\.\.\.|\s\/\s/)
      .map(p => p.replace(/^[\s,.;:—–-]+|[\s,.;:?!—–-]+$/g, ''))
      .filter(p => p.length > 1);
    let from = 0;
    pieces.forEach(p => {
      const pat = reEsc(esc(p)).replace(/['’]/g, "['’]").replace(/\s+/g, '\\s+');
      let re;
      try { re = new RegExp('(?<![\\p{L}])' + pat + '(?![\\p{L}])', 'iu'); } catch (e) { return; }
      const m = re.exec(s.slice(from));
      if (!m) return;
      const at = from + m.index;
      const wrapped = `<b class="hl">${m[0]}</b>`;
      s = s.slice(0, at) + wrapped + s.slice(at + m[0].length);
      from = at + wrapped.length;
    });
    return s;
  }

  const modBullet = (id, cls) => `<span class="bullet${cls ? ' ' + cls : ''}" style="--m:var(--m${id});--on:var(--on${id})" aria-hidden="true">${id}</span>`;

  /* ---------- Ligne de la conversation (moments) ---------- */
  function renderStations() {
    $('#stations').innerHTML = M.moments.map(m =>
      `<li><button type="button" class="st-btn" data-moment="${esc(m.id)}" aria-pressed="false">
        <span class="st-dot" aria-hidden="true"></span>
        <span class="st-l">${esc(m.label)}</span>
        <span class="st-n">${m.tabs.map(pad).join(' ')}</span>
      </button></li>`).join('');
  }
  function setMoment(id) {
    state.moment = state.moment === id ? null : id;
    const m = M.moments.find(x => x.id === state.moment);
    $$('.st-btn').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.moment === state.moment)));
    $$('.tile').forEach(t => {
      const on = !m || m.tabs.includes(+t.dataset.tab);
      t.classList.toggle('is-dim', !on);
      t.classList.toggle('is-lit', !!m && on);
    });
    $('#cline-msg').innerHTML = m
      ? `<b>${esc(m.label)}</b> : ${m.tabs.map(t => `<a href="#carte-${t}">${pad(t)} ${esc(ESS[t].je)}</a>`).join(' · ')}`
      : '';
    $('#stations').classList.toggle('has-active', !!m);
  }

  /* ---------- Légende ---------- */
  function renderLegend() {
    const bar = c => `<svg class="lg-bar" viewBox="0 0 28 10" aria-hidden="true"><rect x="1" y="1" width="26" height="8" rx="4" class="lg-${c}"/></svg>`;
    $('#legend').innerHTML = `
      <span class="lg-g lg-pic"><span class="lg-h">Pictogramme</span>
        <span class="lg-i">${bar('cadre')}action du cadre</span>
        <span class="lg-i">${bar('main')}phrase principale</span></span>
      <span class="lg-g"><span class="lg-h">Après l’expression</span>
        <span class="lg-i"><span class="slot k-ind" title="indicatif">ind.</span><span class="lg-w">indicatif</span></span>
        <span class="lg-i"><span class="slot k-subj" title="subjonctif">subj.</span><span class="lg-w">subjonctif</span></span>
        <span class="lg-i"><span class="slot k-cond" title="conditionnel">cond.</span><span class="lg-w">conditionnel</span></span>
        <span class="lg-i"><span class="slot k-inf" title="infinitif">inf.</span><span class="lg-w">infinitif</span></span>
        <span class="lg-i"><span class="slot k-nom">nom</span></span></span>
      <span class="lg-g lg-qc"><span class="lg-i"><span class="qc-chip">QC</span>variante du Québec</span></span>`;
  }

  /* ---------- Recto : les 12 tuiles ---------- */
  function tileHTML(t) {
    const e = ESS[t], m = MOD[t];
    const pick = qcPick(e);
    const cles = e.cles.slice(0, 3).map(c => `
      <li><span class="f-row"><span class="f-e">${esc(c.e)}</span>${c.c ? `<span class="lead" aria-hidden="true"></span>${slot(c.c)}` : ''}${regs(c.r)}</span>
        <span class="f-ex">${hl(c.ex, c.e)}</span></li>`).join('');
    const qcs = e.qc.map(q => `
      <li class="${q === pick ? 'is-pick' : 'is-more'}"><span class="f-row"><span class="qc-chip">QC</span><span class="f-e">${esc(q.e)}</span>${q.c ? slot(q.c) : ''}${regs(q.r)}</span>
        <span class="f-ex">${hl(q.ex, q.e)}</span></li>`).join('');
    return `<article class="tile" data-tab="${t}" data-mod="${m.id}" style="--m:var(--m${m.id});--on:var(--on${m.id})">
      <div class="t-strip"><span class="t-mod" hidden>${modBullet(m.id, 'bullet-inv')}<span class="t-mod-t">${esc(m.title)}</span></span></div>
      <div class="t-top"><span class="t-num" aria-hidden="true">${pad(t)}</span>
        <h3 class="t-je"><a class="t-link" href="#carte-${t}"><span class="sr">Fiche ${t} : </span>${esc(e.je)}</a></h3></div>
      <div class="t-viz">${iconHTML(t)}</div>
      <ul class="t-cles">${cles}</ul>
      <ul class="t-qc" aria-label="Au Québec">${qcs}</ul>
    </article>`;
  }
  function renderGrid() {
    $('#grille').innerHTML = ORDER.map(tileHTML).join('');
    layoutStrips();
  }
  /* Les bandes de module courent sur les tuiles voisines : le titre n'apparaît qu'au début de chaque tronçon. */
  const wide = window.matchMedia('(min-width: 880px)');
  function layoutStrips() {
    const cols = wide.matches ? 4 : 2;
    const tiles = $$('.tile');
    tiles.forEach((el, i) => {
      const m = el.dataset.mod;
      const lab = $('.t-mod', el);
      const prev = i % cols === 0 ? null : tiles[i - 1].dataset.mod;
      if (prev === m) { lab.hidden = true; return; }
      let span = 1;
      while ((i + span) % cols !== 0 && tiles[i + span] && tiles[i + span].dataset.mod === m) span++;
      lab.hidden = false;
      lab.style.setProperty('--span', span);
      lab.classList.toggle('is-short', span === 1);
    });
  }

  const PANELS = [
    ['modes', 'Quel mode ?'], ['registres', 'Trois registres'], ['temps', 'Le temps en un coup d’œil'],
    ['structures', 'Nom, infinitif ou phrase'], ['lignes', 'Enchaîner'], ['situations', 'En situation']
  ];
  function renderTurn() {
    $('#turn').innerHTML = `<span class="turn-h">Au verso <svg viewBox="0 0 20 12" width="20" height="12" aria-hidden="true"><path d="M1 6h16M12 1l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2"/></svg></span>
      ${PANELS.map(([id, t], i) => `<button type="button" class="turn-b" data-goto="${id}"><span class="p-code">R${i + 1}</span>${esc(t)}</button>`).join('')}`;
  }

  /* ---------- Liens entre fonctions : lignes de métro ---------- */
  function metroHTML(steps, cur) {
    return `<ol class="metro" style="--n:${steps.length}">${steps.map(([lab, t]) => {
      const here = t === cur;
      return `<li class="mst${here ? ' is-cur' : ''}" style="--m:var(--m${MOD[t].id});--on:var(--on${MOD[t].id})">
        <button type="button" class="mst-b" data-open="${t}"${here ? ' aria-current="true"' : ''}>
          <span class="mst-dot" aria-hidden="true"></span>
          <span class="mst-l">${esc(lab)}</span>
          <span class="mst-n">${pad(t)} · ${esc(ESS[t].je)}</span>
        </button></li>`;
    }).join('')}</ol>`;
  }
  const chipsFor = (tabs, cur) => tabs.map(t => `<button type="button" class="tchip${t === cur ? ' is-cur' : ''}" data-open="${t}" style="--m:var(--m${MOD[t].id});--on:var(--on${MOD[t].id})"${t === cur ? ' aria-current="true"' : ''}><b>${pad(t)}</b> ${esc(ESS[t].je)}</button>`).join('');

  /* ---------- Verso ---------- */
  function tabFor(key) {
    const k = norm(key).replace(/[.…]+$/, '');
    for (const t of ORDER) if (ESS[t].cles.some(c => norm(c.e).replace(/[.…]+$/, '') === k)) return t;
    const l = C.BY_KEY.get(k);
    return l && l.length ? l[0].tab : null;
  }
  function panel(id, i, title, sub, body, cls) {
    return `<section class="panel p-${id}${cls ? ' ' + cls : ''}" id="p-${id}" aria-labelledby="ph-${id}">
      <header class="p-h"><span class="p-code">R${i}</span><h2 id="ph-${id}" tabindex="-1">${esc(title)}</h2></header>
      ${sub ? `<p class="p-sub">${sub}</p>` : ''}
      <div class="p-b">${body}</div></section>`;
  }
  function timeHTML() {
    const link = (row, spec) => '#carte-' + spec.tab;
    return ['durees', 'simultaneite'].map(id => V.byId(id)).filter(Boolean)
      .map(s => `<div class="p-col">${V.render(s, { examples: state.ex, link })}</div>`).join('');
  }
  function renderVerso() {
    const modes = V.byId('modes'), reg = V.byId('registres'), str = V.byId('structures');
    const html = [
      panel('modes', 1, 'Quel mode ?', 'Ce qui vient après l’expression. Touche une expression pour ouvrir sa fiche.', modes ? V.render(modes, { title: false }) : ''),
      panel('registres', 2, 'Trois registres', reg ? md(reg.intro) : '', reg ? V.render(reg, { title: false }) : ''),
      panel('temps', 3, 'Le temps en un coup d’œil', 'Frise : passé, aujourd’hui, futur. Deux voies : action du cadre en haut, phrase principale en bas.', `<div class="p-cols" id="time-box">${timeHTML()}</div>`, 'p-wide'),
      panel('structures', 4, 'Nom, infinitif ou phrase', str ? md(str.intro) : '', str ? V.render(str, { title: false }) : ''),
      panel('lignes', 5, 'Enchaîner', 'Les enchaînements fréquents : une idée en appelle une autre. Chaque arrêt ouvre sa fiche.',
        `<div class="lines">${M.chains.map(c => metroHTML(c.steps, null)).join('')}</div>`),
      panel('situations', 6, 'En situation', 'On te dit… quelles fiches prendre ?',
        `<ul class="sits">${M.scenarios.map(sc => `<li><span class="sit-k">${sc.type === 'nouvelle' ? 'On t’annonce' : 'On te demande'}</span>
          <q class="sit-q">${esc(sc.dit)}</q><span class="sit-c">${chipsFor(sc.fonctions)}</span></li>`).join('')}</ul>`)
    ].join('');
    $('#verso').innerHTML = `<div class="verso-grid">${html}</div>`;
    decorateModes($('#p-modes'));
  }
  /* « Quel mode ? » : en-têtes avec la même étiquette que sur les tuiles ; chaque expression ouvre sa fiche. */
  function decorateModes(root) {
    if (!root) return;
    const kinds = ['ind', 'subj', 'cond', 'inf'];
    $$('.vz-col', root).forEach((col, i) => {
      col.dataset.mode = kinds[i] || '';
      const h = $('h4', col);
      if (h && kinds[i]) h.insertAdjacentHTML('afterbegin', `<span class="slot k-${kinds[i]}">${['ind.', 'subj.', 'cond.', 'inf.'][i]}</span> `);
      $$('li', col).forEach(li => {
        const label = li.textContent.trim();
        const t = tabFor(label.split(' + ')[0]);
        if (!t) return;
        li.innerHTML = `<button type="button" class="mode-b" data-open="${t}" style="--m:var(--m${MOD[t].id});--on:var(--on${MOD[t].id})">${li.innerHTML}<span class="mode-n">${pad(t)}</span></button>`;
      });
    });
  }
  function refreshTime() { const b = $('#time-box'); if (b) b.innerHTML = timeHTML(); }

  /* ---------- Fiche complète (dialogue) ---------- */
  const dlg = $('#card');
  function siteRowHref(row, spec) {
    const key = String(row.label || '').replace(/\s*\[[^\]]+\]/g, '').replace(/\*/g, '').split(' + ')[0].split(' / ')[0].trim();
    if (!key) return null;
    const it = C.findItem(key, spec.tab) || C.findItem(key);
    return it ? C.siteLink(C.itemHref(it)) : null;
  }
  function allItemsHTML(t) {
    const groups = [];
    let cur = null;
    C.TABS[t].items.forEach(it => {
      if (!cur || cur.sec !== it.section) { cur = { sec: it.section, items: [] }; groups.push(cur); }
      cur.items.push(it);
    });
    return groups.map(g => `<div class="all-g"><h4>${g.sec.num ? `<span>${esc(g.sec.num)}</span> ` : ''}${esc(g.sec.title || '')}</h4>
      <ul>${g.items.map(it => `<li${it.regs.some(r => r === 'QC' || r === 'F-QC') ? ' class="is-qc"' : ''}>${C.inline(it.raw, { static: true })}</li>`).join('')}</ul></div>`).join('');
  }
  function cardHTML(t) {
    const e = ESS[t], tab = S.tabs[t], mom = MOMENT[t];
    const icon = iconSpec(t);
    const cles = e.cles.map(c => `<li>
        <div class="f-row"><span class="f-e">${esc(c.e)}</span>${c.c ? `<span class="lead" aria-hidden="true"></span>${slot(c.c, true)}` : ''}${regs(c.r, true)}</div>
        <p class="f-ex">${hl(c.ex, c.e)}</p></li>`).join('');
    const qcs = e.qc.map(q => `<li>
        <div class="f-row"><span class="qc-chip">QC</span><span class="f-e">${esc(q.e)}</span>${q.c ? slot(q.c, true) : ''}${regs(q.r, true)}</div>
        <p class="f-ex">${hl(q.ex, q.e)}</p></li>`).join('');
    const chains = M.chains.filter(c => c.steps.some(s => s[1] === t));
    const sits = M.scenarios.filter(sc => sc.fonctions.includes(t));
    const vizs = V.forTab(t).map(s => V.render(s, { examples: true, link: siteRowHref })).join('');
    const items = C.TABS[t].items.length;
    return `
      <header class="c-head">
        <span class="c-num" aria-hidden="true">${pad(t)}</span>
        <div class="c-ht">
          <h2 id="c-title" tabindex="-1">${esc(e.je)}</h2>
          <p class="c-quand">${esc(e.quand)}</p>
          <p class="c-meta"><span>Onglet ${t} · ${esc(tab.title)}</span>${mom ? `<span>Moment : <b>${esc(mom.label)}</b></span>` : ''}</p>
        </div>
        <div class="c-icon" aria-hidden="true">${iconHTML(t)}</div>
      </header>
      <div class="c-body">
        <div class="cd-main">
          <section class="c-sec c-cles"><h3 class="lab">Formules clés</h3><ol class="flist">${cles}</ol></section>
          <section class="c-sec c-qc"><h3 class="lab">Au Québec</h3><ul class="flist">${qcs}</ul></section>
          <section class="c-sec c-warn"><h3 class="lab"><svg viewBox="0 0 20 18" width="18" height="16" aria-hidden="true"><path d="M10 1 19 17H1Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M10 7v4.5M10 13.6v1.2" stroke="currentColor" stroke-width="2"/></svg>Attention</h3><p>${md(e.attention)}</p></section>
          <section class="c-sec c-rel"><h3 class="lab"><svg viewBox="0 0 22 18" width="20" height="16" aria-hidden="true"><path d="M2 2h13v9H7l-4 3v-3H2Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M17 6h3v8h-1v3l-4-3H9v-1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>Pour relancer</h3><p class="c-rel-q">${esc(e.relance)}</p></section>
        </div>
        <div class="cd-side">
          <section class="c-sec c-viz"><h3 class="lab">Les schémas</h3>
            <p class="c-note">Le pictogramme de la tuile est la ligne marquée <span class="pin">tuile</span>.</p>
            ${vizs}</section>
        </div>
      </div>
      <div class="c-links">
        ${mom ? `<section class="c-sec"><h3 class="lab">Même moment : ${esc(mom.label)}</h3><div class="tchips">${chipsFor(mom.tabs, t)}</div></section>` : ''}
        ${chains.length ? `<section class="c-sec c-l-chains"><h3 class="lab">S’enchaîne avec</h3><div class="lines">${chains.map(c => metroHTML(c.steps, t)).join('')}</div></section>` : ''}
        ${sits.length ? `<section class="c-sec"><h3 class="lab">Utile quand on te dit…</h3><ul class="sits">${sits.map(sc => `<li><q class="sit-q">${esc(sc.dit)}</q><span class="sit-c">${chipsFor(sc.fonctions, t)}</span></li>`).join('')}</ul></section>` : ''}
      </div>
      <details class="c-all"><summary><span>Toutes les expressions de l’onglet ${t}</span><span class="c-all-n">${items}</span></summary>
        <div class="all">${allItemsHTML(t)}</div>
        <p><a class="c-site" href="${esc(C.siteLink('#onglet-' + t))}">Ouvrir l’onglet ${t} sur le site complet →</a></p>
      </details>`;
  }
  function markIconRows(t) {
    const i = iconSpec(t);
    if (!i) return;
    const fig = $('#vz-' + i.id, dlg);
    if (!fig) return;
    const rows = $$('.vz-rows > .vz-row:not(.vz-head)', fig);
    i.rows.forEach(n => { if (rows[n]) rows[n].classList.add('is-icon'); });
  }
  function navLabel(t, dir) {
    return dir < 0
      ? `<span class="c-arr" aria-hidden="true">‹</span><span class="c-nt"><small>${pad(t)}</small> ${esc(ESS[t].je)}</span>`
      : `<span class="c-nt"><small>${pad(t)}</small> ${esc(ESS[t].je)}</span><span class="c-arr" aria-hidden="true">›</span>`;
  }
  function fillCard(t, dir) {
    const m = MOD[t];
    state.card = t;
    dlg.style.setProperty('--m', `var(--m${m.id})`);
    dlg.style.setProperty('--on', `var(--on${m.id})`);
    $('#c-mod').innerHTML = `${modBullet(m.id, 'bullet-inv')}<span>${esc(m.title)}</span>`;
    $('#c-pos').textContent = `Fiche ${ORDER.indexOf(t) + 1} / ${ORDER.length}`;
    const sc = $('#c-scroll');
    sc.innerHTML = cardHTML(t);
    sc.scrollTop = 0;
    markIconRows(t);
    const i = ORDER.indexOf(t);
    const prev = ORDER[(i - 1 + ORDER.length) % ORDER.length], next = ORDER[(i + 1) % ORDER.length];
    const bp = $('#c-prev'), bn = $('#c-next');
    bp.innerHTML = navLabel(prev, -1); bp.dataset.to = prev; bp.setAttribute('aria-label', `Fiche précédente : ${pad(prev)} ${ESS[prev].je}`);
    bn.innerHTML = navLabel(next, 1); bn.dataset.to = next; bn.setAttribute('aria-label', `Fiche suivante : ${pad(next)} ${ESS[next].je}`);
    if (dir && !reduce() && sc.animate) {
      sc.animate([{ opacity: 0, transform: `translateX(${dir * 28}px)` }, { opacity: 1, transform: 'none' }], { duration: 200, easing: 'cubic-bezier(.2,.7,.2,1)' });
    }
    setHash('#carte-' + t);
  }
  function openCard(t, opener) {
    if (!ESS[t]) return;
    if (dlg.open) { const d = ORDER.indexOf(t) > ORDER.indexOf(state.card) ? 1 : -1; fillCard(t, d); $('#c-title').focus({ preventScroll: true }); return; }
    state.opener = opener || null;
    fillCard(t, 0);
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    if (!reduce() && dlg.animate) {
      dlg.animate([{ opacity: 0, transform: 'translateY(14px) scale(.985)' }, { opacity: 1, transform: 'none' }], { duration: 220, easing: 'cubic-bezier(.2,.7,.2,1)' });
    }
    $('#c-title').focus({ preventScroll: true });
  }
  function closeCard() {
    if (dlg.open) { if (typeof dlg.close === 'function') dlg.close(); else dlg.removeAttribute('open'); }
  }
  dlg.addEventListener('close', () => {
    const t = state.card;
    state.card = null;
    setHash(state.side === 'verso' ? '#verso' : '');
    const back = state.opener && document.contains(state.opener) ? state.opener
      : (t && state.side === 'recto' ? $(`.tile[data-tab="${t}"] .t-link`) : null);
    if (back) back.focus({ preventScroll: false });
  });
  const step = d => {
    if (!state.card) return;
    const i = ORDER.indexOf(state.card);
    fillCard(ORDER[(i + d + ORDER.length) % ORDER.length], d);
  };
  $('#c-close').addEventListener('click', closeCard);
  $('#c-prev').addEventListener('click', () => step(-1));
  $('#c-next').addEventListener('click', () => step(1));
  dlg.addEventListener('click', e => { if (e.target === dlg) closeCard(); });
  dlg.addEventListener('keydown', e => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'summary' || tag === 'input') return;
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  });
  /* Glisser à gauche / à droite pour changer de fiche */
  (function swipe() {
    const sc = $('#c-scroll');
    let x0 = 0, y0 = 0, t0 = 0;
    sc.addEventListener('touchstart', e => { const p = e.touches[0]; x0 = p.clientX; y0 = p.clientY; t0 = Date.now(); }, { passive: true });
    sc.addEventListener('touchend', e => {
      const p = e.changedTouches[0], dx = p.clientX - x0, dy = p.clientY - y0;
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6 && Date.now() - t0 < 800) step(dx < 0 ? 1 : -1);
    }, { passive: true });
  })();

  /* ---------- Recto / verso ---------- */
  function setHash(h) {
    try { history.replaceState(null, '', h || location.pathname + location.search); } catch (e) { /* file:// strict */ }
  }
  function applySide(side) {
    state.side = side;
    $('#recto').hidden = side !== 'recto';
    $('#verso').hidden = side !== 'verso';
    $$('.seg [data-side]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.side === side)));
    $('#ctrl-side').textContent = side === 'verso' ? 'Verso : repères' : '';
    ROOT.dataset.side = side;
  }
  function setSide(side, then) {
    if (side === state.side) { if (then) then(); return; }
    const body = $('#sheet-body');
    const done = () => {
      applySide(side);
      if (!state.card) setHash(side === 'verso' ? '#verso' : '');
      const top = $('#ctrl').getBoundingClientRect().top + window.scrollY - 2;
      if (window.scrollY > top) window.scrollTo(0, top);
      if (then) then();
    };
    if (reduce() || !body.animate) { done(); return; }
    body.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(.04)', opacity: .6 }], { duration: 120, easing: 'ease-in' }).finished.then(() => {
      done();
      body.animate([{ transform: 'scaleX(.04)', opacity: .6 }, { transform: 'scaleX(1)', opacity: 1 }], { duration: 160, easing: 'ease-out' });
    });
  }
  function gotoPanel(id, mode) {
    closeCard();
    setSide('verso', () => {
      const p = $('#p-' + id);
      if (!p) return;
      p.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'start' });
      $$('.vz-col.is-flash').forEach(c => c.classList.remove('is-flash'));
      const target = mode ? $(`.vz-col[data-mode="${mode}"]`, p) : p;
      if (target) {
        target.classList.remove('is-flash'); void target.offsetWidth; target.classList.add('is-flash');
      }
      const h = $('h2', p);
      if (h) h.focus({ preventScroll: true });
    });
  }

  /* ---------- Bascules ---------- */
  function applyToggles() {
    ROOT.classList.toggle('qc-on', state.qc);
    ROOT.classList.toggle('ex-on', state.ex);
    $('#tog-qc').setAttribute('aria-pressed', String(state.qc));
    $('#tog-ex').setAttribute('aria-pressed', String(state.ex));
  }
  $('#tog-qc').addEventListener('click', () => { state.qc = !state.qc; store.set('qc', state.qc); applyToggles(); });
  $('#tog-ex').addEventListener('click', () => { state.ex = !state.ex; store.set('ex', state.ex); applyToggles(); refreshTime(); });
  $$('.seg [data-side]').forEach(b => b.addEventListener('click', () => setSide(b.dataset.side)));

  /* Thème clair / sombre */
  $('#theme-btn').addEventListener('click', () => {
    const cur = ROOT.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = cur === 'dark' ? 'light' : 'dark';
    ROOT.setAttribute('data-theme', next);
    store.set('theme', next);
  });

  /* ---------- Clics délégués ---------- */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#carte-"]');
    if (a) { e.preventDefault(); openCard(+a.getAttribute('href').slice(7), a); return; }
    const o = e.target.closest('[data-open]');
    if (o) { e.preventDefault(); if (+o.dataset.open !== state.card) openCard(+o.dataset.open, dlg.open ? state.opener : o); return; }
    const g = e.target.closest('[data-goto]');
    if (g) { e.preventDefault(); gotoPanel(g.dataset.goto, g.dataset.mode); return; }
    const s = e.target.closest('[data-moment]');
    if (s) { setMoment(s.dataset.moment); }
  });

  /* ---------- Démarrage ---------- */
  renderStations();
  renderLegend();
  renderGrid();
  renderTurn();
  renderVerso();
  applyToggles();
  if (wide.addEventListener) wide.addEventListener('change', layoutStrips); else if (wide.addListener) wide.addListener(layoutStrips);

  /* Liens profonds : #verso, #carte-4 (au chargement et si l'adresse change) */
  function fromHash(first) {
    const h = decodeURIComponent(location.hash || '');
    const mc = h.match(/^#carte-(\d+)$/);
    if (first) applySide(h === '#verso' ? 'verso' : 'recto');
    else if (h === '#verso' && state.side !== 'verso') setSide('verso');
    if (mc && ESS[+mc[1]] && state.card !== +mc[1]) openCard(+mc[1]);
  }
  window.addEventListener('hashchange', () => fromHash(false));
  fromHash(true);
})();
