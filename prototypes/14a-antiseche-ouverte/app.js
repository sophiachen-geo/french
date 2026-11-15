/* L’antisèche qui s’ouvre — version simplifiée.
   Parcours : accueil (12 cartes) → une intention → une formule à la fois (① ② ③) → bilan → intention suivante.
   Codes constants : couleur du moment, couleur de « ce qui suit », points de registre, statut ○ ◐ ✓ ↺.
   Données : SITE.meta.essentiels, CADRES.TABS (toutes les formes), VIZ (schémas), P14A (alias, exemples écrits, icônes).
   Progression : PROGRES (partagée avec la feuille maîtresse). */
(function () {
  'use strict';

  const S = window.SITE, M = S.meta, C = window.CADRES, VIZ = window.VIZ, PR = window.PROGRES, D = window.P14A || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(^|[^*])\*(?=\S)(.+?)\*(?!\*)/g, '$1<i>$2</i>');
  const reduce = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k, d) { try { const v = localStorage.getItem('a14:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('a14:' + k, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } }
  };

  /* ---------- Codes ---------- */
  const MOMENTS = [
    { id: 'commencer', label: 'Commencer' }, { id: 'raconter', label: 'Raconter' }, { id: 'expliquer', label: 'Expliquer' },
    { id: 'reagir', label: 'Réagir' }, { id: 'conclure', label: 'Conclure' }
  ];
  const ESS = {}; M.essentiels.forEach(e => { ESS[e.tab] = e; });
  const ORDER = []; M.moments.forEach(m => m.tabs.forEach(t => { if (!ORDER.includes(t)) ORDER.push(t); }));
  const MOMENT_OF = {}; M.moments.forEach(m => m.tabs.forEach(t => { MOMENT_OF[t] = m.id; }));
  const NIV = {
    1: { label: 'L’essentiel', short: 'Essentiel' },
    2: { label: 'Pour varier', short: 'Varier' },
    3: { label: 'Pour aller plus loin', short: 'Plus loin' }
  };
  const SLOT_KIND = c => {
    const s = String(c || '').replace(/^\+\s*/, '');
    if (!s) return null;
    if (/^ind\./.test(s) || /^proposition|^relative|interrogati/.test(s)) return 'ind';
    if (/^subj/.test(s)) return 'subj';
    if (/^cond|conditionnel/.test(s)) return 'cond';
    if (/^inf|participe/.test(s)) return 'inf';
    if (/présent|futur|imparfait|impératif|plus-que/.test(s)) return 'temps';
    return 'nom';
  };
  const SLOT_TXT = {
    ind: ['+ une phrase', 'indicatif'], subj: ['+ une phrase', 'subjonctif'], cond: ['+ une phrase', 'conditionnel'],
    inf: ['+ un verbe', 'infinitif'], nom: ['+ un nom', ''], temps: ['', '']
  };
  function slotHTML(c) {
    const k = SLOT_KIND(c);
    if (!k) return '';
    const raw = String(c).replace(/^\+\s*/, '');
    const map = D.slots && D.slots[raw.split(',')[0].trim()];
    let a, b;
    if (k === 'temps') { a = '+ ' + raw; b = ''; }
    else if (map) { a = '+ ' + map[0]; b = map[1] || SLOT_TXT[k][1]; }
    else { [a, b] = SLOT_TXT[k]; }
    return `<span class="slot k-${k}"><b>${esc(a)}</b>${b ? `<span>${esc(b)}</span>` : ''}</span>`;
  }
  /* Registre : ●○○ entre amis, ●●○ neutre, ●●● formel ; R/D : à reconnaître */
  function regOf(r) {
    const codes = String(r || 'C').split(/\s*,\s*/);
    if (codes.includes('R') || codes.includes('D')) return { n: 0, label: codes.includes('D') ? 'à éviter à l’écrit' : 'à reconnaître' };
    if (codes.includes('S')) return { n: 3, label: 'formel' };
    if (codes.includes('F-QC') || codes.includes('O')) return { n: 1, label: codes.includes('F-QC') ? 'entre amis, au Québec' : 'à l’oral' };
    return { n: 2, label: codes.includes('QC') ? 'neutre, au Québec' : 'neutre' };
  }
  const regHTML = r => { const g = regOf(r); return `<span class="reg reg-${g.n}"><span class="dots" aria-hidden="true">${g.n ? [1, 2, 3].map(i => `<i class="${i <= g.n ? 'on' : ''}"></i>`).join('') : '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="2.8" fill="currentColor"/></svg>'}</span>${esc(g.label)}</span>`; };
  const STATUS = { nouveau: '○', vu: '◐', 'en-cours': '◐', maitrise: '✓' };

  /* ---------- Les cartes d'une intention ---------- */
  const firstPart = e => String(e).split('…')[0].split(' / ')[0].replace(/\s*\+.*$/, '').trim();
  function exampleRows(t) {
    const rows = {};
    VIZ.forTab(t).forEach(spec => (spec.rows || []).forEach(row => {
      if (!row.label) return;
      row.label.replace(/\[[^\]]*\]/g, '').split(/\s\/\s/).forEach(part => { const k = PR.cle(part); if (k && !rows[k]) rows[k] = { spec, row }; });
    }));
    return rows;
  }
  function vizFor(t, key, rows) {
    let hit = rows[key];
    if (!hit && D.alias && D.alias[t] && D.alias[t][key]) {
      const lab = D.alias[t][key];
      hit = rows[PR.cle(lab.split(' / ')[0])] || Object.values(rows).find(x => x.row.label === lab) || null;
    }
    return hit;
  }
  const CACHE = {};
  function cardsFor(t) {
    if (CACHE[t]) return CACHE[t];
    const e = ESS[t], cards = [], seen = new Set(), rows = exampleRows(t);
    const formal = {}; ((D.formal && D.formal[t]) || []).forEach(f => { formal[PR.cle(f.key)] = f.ex; });
    const fiche = {}; S.fiches.forEach(f => f.fonctions.forEach(fn => { if (fn.tab === t) fiche[PR.cle(f.key)] = fn.oral; }));
    const push = c => {
      const k = PR.cle(c.e);
      if (!k || seen.has(k)) return;
      seen.add(k); c.key = k;
      const v = vizFor(t, k, rows);
      if (v) { c.viz = v; if (!c.ex && v.row.ex) c.ex = v.row.ex; }
      if (!c.ex && formal[k]) c.ex = formal[k];
      if (!c.ex && fiche[k]) c.ex = fiche[k];
      cards.push(c);
    };
    e.cles.forEach(k => push({ e: k.e, c: k.c, ex: k.ex, r: k.r || 'C', niv: 1 }));
    e.qc.forEach(k => push({ e: k.e, c: k.c, ex: k.ex, r: k.r || 'QC', niv: 1 }));
    C.TABS[t].items.filter(i => i.filterable && !/grammatica/i.test(i.section.title)).forEach(i => {
      const adv = i.regs.some(r => r === 'S' || r === 'R' || r === 'D');
      const nuance = [i.section.title, i.row, i.sub].filter(Boolean).join(' · ');
      push({ e: (i.cons ? i.head : i.plain).replace(/[\s;]+$/, ''), c: i.cons ? '+ ' + i.cons : '', r: i.regs.join(', '), niv: adv ? 3 : 2, nuance });
    });
    cards.sort((a, b) => a.niv - b.niv);
    CACHE[t] = cards;
    return cards;
  }
  const statut = c => PR.statut(c.key);
  const revoir = c => { const r = PR.get(c.key); return !!(r && r.revoir); };
  function compte(t) {
    const cards = cardsFor(t);
    let ok = 0, vu = 0;
    cards.forEach(c => { const s = statut(c); if (s === 'maitrise') ok++; else if (s !== 'nouveau') vu++; });
    return { ok, vu, total: cards.length };
  }

  /* ---------- Mise en valeur de l'exemple ---------- */
  function exempleHTML(ex, e) {
    const T = String(ex);
    const parts = String(e).split(/…|\s\/\s/).map(p => p.replace(/\s*\+.*$/, '').replace(/[.,;:!?]+$/, '').trim()).filter(p => p.length > 1);
    const low = T.toLowerCase().replace(/’/g, "'");
    let out = '', pos = 0;
    parts.forEach(p => {
      const q = p.toLowerCase().replace(/’/g, "'");
      let i = low.indexOf(q, pos);
      if (i < 0 && /e$/.test(q)) i = low.indexOf(q.slice(0, -1) + "'", pos);
      if (i < 0) return;
      const len = q.length;
      out += esc(T.slice(pos, i)) + '<mark>' + esc(T.slice(i, i + len)) + '</mark>';
      pos = i + len;
    });
    return out + esc(T.slice(pos));
  }

  /* ---------- Voix ---------- */
  const canSpeak = 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';
  function speak(text) {
    if (!canSpeak) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text).replace(/—/g, ''));
      u.lang = 'fr-CA'; u.rate = 0.9;
      const vs = speechSynthesis.getVoices();
      const v = vs.find(x => /fr[-_]CA/i.test(x.lang)) || vs.find(x => /^fr/i.test(x.lang));
      if (v) u.voice = v;
      speechSynthesis.speak(u);
    } catch (e) { /* synthèse indisponible */ }
  }
  const SPK = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  /* ---------- Petit schéma ---------- */
  function rowSpec(spec, row, withLabel) {
    return Object.assign({}, spec, { title: '', intro: '', id: '', rows: [Object.assign({}, row, withLabel ? {} : { label: '', sub: '', ex: '' })] });
  }
  function iconHTML(t) {
    const ic = D.icon && D.icon[t];
    if (!ic) return '';
    const spec = VIZ.byId(ic[0]);
    if (!spec) return '';
    const idx = Array.isArray(ic[1]) ? ic[1][0] : ic[1];
    const row = spec.rows[idx];
    return row ? VIZ.render(Object.assign({}, rowSpec(spec, row, false), { legend: false }), { title: false }) : '';
  }

  /* ---------- État ---------- */
  const st = { vue: 'accueil', tab: null, i: 0, moment: store.get('moment', 'tout'), formules: store.get('formules', false), cacher: store.get('cacher', false) };
  const vusSession = new Set();
  const APP = $('#app');

  /* ---------- Accueil ---------- */
  function accueil() {
    const last = store.get('last', null);
    const tiles = ORDER.filter(t => st.moment === 'tout' || MOMENT_OF[t] === st.moment).map(t => {
      const e = ESS[t], n = compte(t), pct = n.total ? n.ok / n.total * 100 : 0, pv = n.total ? n.vu / n.total * 100 : 0;
      return `<a class="tile m-${MOMENT_OF[t]}" href="#t${t}">
        <span class="tile-band"></span>
        <span class="tile-icon" aria-hidden="true">${iconHTML(t)}</span>
        <span class="tile-t">${esc(e.je)}</span>
        ${st.formules ? `<span class="tile-f">${e.cles.slice(0, 3).map(k => `<span>${esc(k.e)}</span>`).join('')}</span>` : ''}
        <span class="tile-p"><span class="bar" aria-hidden="true"><i class="b-ok" style="width:${pct}%"></i><i class="b-vu" style="width:${pv}%"></i></span><span class="tile-n">${n.ok} / ${n.total}</span></span>
      </a>`;
    }).join('');
    const reprendre = last && ESS[last.t] ? (() => {
      const cards = cardsFor(last.t), i = Math.min(last.i || 0, cards.length - 1);
      return `<a class="resume m-${MOMENT_OF[last.t]}" href="#t${last.t}-${i + 1}"><span class="resume-k">Reprendre</span><b>${esc(ESS[last.t].je)}</b><span>carte ${i + 1} sur ${cards.length}</span><span class="go" aria-hidden="true">→</span></a>`;
    })() : '';
    APP.innerHTML = `
      <section class="home">
        <h1>Qu’est-ce que tu veux dire ?</h1>
        <p class="lede">Touche une carte. Tu découvres ses formules une par une.</p>
        ${reprendre}
        <div class="moments" role="group" aria-label="Moment de la conversation">
          <button type="button" class="mo m-tout" data-moment="tout" aria-pressed="${st.moment === 'tout'}">Tout</button>
          ${MOMENTS.map(m => `<button type="button" class="mo m-${m.id}" data-moment="${m.id}" aria-pressed="${st.moment === m.id}"><i aria-hidden="true"></i>${m.label}</button>`).join('')}
        </div>
        <div class="tiles">${tiles}</div>
        <div class="home-foot">
          <label class="switch"><input type="checkbox" id="formules"${st.formules ? ' checked' : ''}><span>Montrer les formules sur les cartes</span></label>
          <div class="home-btns">
            <a class="btn-soft mob-only" href="../0-atlas/index.html">Ma progression</a>
            <button type="button" class="btn-soft" data-sheet="codes"><span class="q" aria-hidden="true">?</span>Les codes</button>
            <button type="button" class="btn-soft" data-sheet="reperes">Repères : modes, temps, registres</button>
          </div>
        </div>
      </section>`;
  }

  /* ---------- Une intention : une carte à la fois ---------- */
  function visibleIdx(cards) {
    return cards.map((c, i) => i).filter(i => !st.cacher || statut(cards[i]) !== 'maitrise');
  }
  function intention() {
    const t = st.tab, e = ESS[t], cards = cardsFor(t);
    const list = visibleIdx(cards);
    if (st.i >= cards.length) return bilan();
    const c = cards[st.i];
    const s0 = statut(c);
    if (!vusSession.has(c.key)) { vusSession.add(c.key); if (s0 === 'nouveau') PR.marquer(c.e, 'vu', 'decouvrir'); }
    store.set('last', { t, i: st.i });
    const pos = list.filter(i => i < st.i).length, total = Math.max(list.length, pos + 1);
    const niveaux = [1, 2, 3].map(n => {
      const idx = cards.findIndex(x => x.niv === n);
      const nb = cards.filter(x => x.niv === n).length;
      return nb ? `<a class="niv${c.niv === n ? ' on' : ''}" href="#t${t}-${idx + 1}"${c.niv === n ? ' aria-current="step"' : ''}><span class="niv-n">${n}</span><span>${NIV[n].short}</span><span class="niv-c">${nb}</span></a>` : '';
    }).join('');
    const s = s0, rv = revoir(c);
    const viz = c.viz ? VIZ.render(rowSpec(c.viz.spec, c.viz.row, false), { title: false }) : '';
    APP.innerHTML = `
      <section class="int m-${MOMENT_OF[t]}">
        <div class="int-h">
          <a class="back" href="#accueil" aria-label="Retour à l’antisèche"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
          <div class="int-t"><span class="int-k"><i aria-hidden="true"></i>${esc(MOMENTS.find(m => m.id === MOMENT_OF[t]).label)}</span><h1>${esc(e.je)}</h1></div>
        </div>
        <nav class="nivs" aria-label="Niveaux">${niveaux}</nav>
        <div class="count"><span>Carte <b>${pos + 1}</b> sur ${total}</span><span class="bar" aria-hidden="true"><i class="b-ok" style="width:${(pos + 1) / Math.max(total, 1) * 100}%"></i></span></div>

        <article class="card s-${s}${rv ? ' is-rv' : ''}" id="card" aria-live="polite">
          <div class="card-top">
            <span class="badge-niv"><span class="niv-n">${c.niv}</span>${NIV[c.niv].label}</span>
            <span class="stat" title="${s === 'maitrise' ? 'Je connais' : s === 'nouveau' ? 'Nouvelle' : 'Déjà vue'}">${rv ? '↺' : STATUS[s]}</span>
          </div>
          <h2 class="formule">${esc(c.e)}</h2>
          <div class="meta">${slotHTML(c.c)}${regHTML(c.r)}</div>
          ${c.nuance ? `<p class="nuance">${esc(c.nuance)}</p>` : ''}
          ${c.ex ? `<div class="ex"><p>${exempleHTML(c.ex, c.e)}</p>${canSpeak ? `<button type="button" class="spk" data-say="${esc(c.ex)}" aria-label="Écouter l’exemple">${SPK}</button>` : ''}</div>` : ''}
          ${viz ? `<div class="viz">${viz}</div>` : ''}
        </article>

        <div class="actions">
          <button type="button" class="nav-b" data-go="-1" aria-label="Carte précédente"${pos <= 0 ? ' disabled' : ''}><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          <button type="button" class="act act-rv${rv ? ' on' : ''}" data-act="revoir" aria-pressed="${rv}"><span aria-hidden="true">↺</span>À revoir</button>
          <button type="button" class="act act-ok${s === 'maitrise' ? ' on' : ''}" data-act="connu" aria-pressed="${s === 'maitrise'}"><span aria-hidden="true">✓</span>Je connais</button>
          <button type="button" class="nav-b" data-go="1" aria-label="Carte suivante"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        </div>
        <p class="sous">
          <label class="switch small"><input type="checkbox" id="cacher"${st.cacher ? ' checked' : ''}><span>Sauter ce que je connais</span></label>
          <button type="button" class="link" data-sheet="codes">Les codes</button>
        </p>
      </section>`;
    bindSwipe($('#card'));
  }

  function suivantesDe(t) {
    const out = [];
    M.chains.concat(S.models).forEach(x => x.steps.forEach((s, i) => { if (s[1] === t && x.steps[i + 1] && x.steps[i + 1][1] !== t && !out.includes(x.steps[i + 1][1])) out.push(x.steps[i + 1][1]); }));
    return out.slice(0, 3);
  }
  function bilan() {
    const t = st.tab, n = compte(t), rv = cardsFor(t).filter(revoir).length;
    const next = suivantesDe(t);
    store.set('last', null);
    APP.innerHTML = `
      <section class="int m-${MOMENT_OF[t]}">
        <div class="int-h">
          <a class="back" href="#accueil" aria-label="Retour à l’antisèche"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
          <div class="int-t"><span class="int-k"><i aria-hidden="true"></i>Bilan</span><h1>${esc(ESS[t].je)}</h1></div>
        </div>
        <div class="card bilan">
          <p class="big">Tu as fait le tour.</p>
          <div class="bil">
            <div><b>${n.ok}</b><span>✓ je connais</span></div>
            <div><b>${n.vu}</b><span>◐ déjà vues</span></div>
            <div><b>${rv}</b><span>↺ à revoir</span></div>
          </div>
          <p class="attention"><b>À retenir :</b> ${md(ESS[t].attention)}</p>
          <p class="relance"><b>Pour continuer la conversation :</b> « ${esc(ESS[t].relance)} »</p>
        </div>
        ${next.length ? `<p class="next-h">Ensuite, tu peux…</p><div class="next">${next.map(x => `<a class="next-c m-${MOMENT_OF[x]}" href="#t${x}"><i aria-hidden="true"></i><span>${esc(ESS[x].je)}</span><span class="go" aria-hidden="true">→</span></a>`).join('')}</div>` : ''}
        <div class="bil-btns"><a class="btn" href="#t${t}-1">Recommencer</a><a class="btn btn-ghost" href="#accueil">Retour à l’antisèche</a></div>
      </section>`;
  }

  /* ---------- Feuilles : codes et repères ---------- */
  function sheet(kind) {
    const dlg = $('#sheet');
    if (kind === 'codes') {
      $('#sheet-t').textContent = 'Les codes';
      $('#sheet-b').innerHTML = `
        <div class="code-g">
          <h3>La couleur de la carte : le moment de la conversation</h3>
          <p class="code-row">${MOMENTS.map(m => `<span class="mo m-${m.id} static"><i></i>${m.label}</span>`).join('')}</p>
        </div>
        <div class="code-g">
          <h3>Ce qui suit la formule</h3>
          <p class="code-row">${slotHTML('+ ind.')}${slotHTML('+ subj.')}${slotHTML('+ cond.')}${slotHTML('+ inf.')}${slotHTML('+ nom')}</p>
          <p class="code-note">Vert : le verbe reste normal. Violet : le verbe change (subjonctif). Orange : conditionnel. Bleu : un verbe à l’infinitif.</p>
        </div>
        <div class="code-g">
          <h3>Le registre</h3>
          <p class="code-row">${regHTML('F-QC')}${regHTML('C')}${regHTML('S')}${regHTML('R')}</p>
        </div>
        <div class="code-g">
          <h3>Les niveaux</h3>
          <p class="code-row">${[1, 2, 3].map(n => `<span class="badge-niv"><span class="niv-n">${n}</span>${NIV[n].label}</span>`).join('')}</p>
        </div>
        <div class="code-g">
          <h3>Ton statut</h3>
          <p class="code-row stat-row"><span><b>○</b> nouvelle</span><span><b>◐</b> déjà vue</span><span><b>✓</b> je connais</span><span><b>↺</b> à revoir</span></p>
        </div>
        <div class="code-g">
          <h3>Dans les schémas</h3>
          <p class="code-row"><span class="lg-or"><i></i>ce que la formule introduit</span><span class="lg-vi"><i></i>la phrase principale</span></p>
        </div>`;
    } else {
      $('#sheet-t').textContent = 'Repères';
      const tabs = [['modes', 'Quel mode ?'], ['durees', 'Le temps'], ['simultaneite', 'Deux actions'], ['registres', 'Registres']];
      const cur = store.get('repere', 'modes');
      $('#sheet-b').innerHTML = `<div class="rep-tabs" role="tablist">${tabs.map(([id, l]) => `<button type="button" role="tab" data-rep="${id}" aria-selected="${id === cur}">${l}</button>`).join('')}</div><div class="rep-b">${VIZ.render(VIZ.byId(cur), { examples: true })}</div>`;
    }
    if (typeof dlg.showModal === 'function') { if (!dlg.open) dlg.showModal(); } else dlg.setAttribute('open', '');
  }

  /* ---------- Gestes ---------- */
  function go(d) {
    const cards = cardsFor(st.tab), list = visibleIdx(cards);
    let target;
    if (d > 0) { const k = list.findIndex(i => i > st.i); target = k >= 0 ? list[k] : undefined; }
    else { const before = list.filter(i => i < st.i); target = before.length ? before[before.length - 1] : undefined; if (target === undefined) return; }
    location.hash = target === undefined ? `#t${st.tab}-fin` : `#t${st.tab}-${target + 1}`;
  }
  function bindSwipe(el) {
    if (!el) return;
    let x0 = null, y0 = null;
    el.addEventListener('pointerdown', e => { x0 = e.clientX; y0 = e.clientY; }, { passive: true });
    el.addEventListener('pointerup', e => {
      if (x0 === null) return;
      const dx = e.clientX - x0, dy = e.clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
    });
  }

  /* ---------- Routage ---------- */
  function route() {
    const h = location.hash.replace(/^#/, '');
    const m = h.match(/^t(\d+)(?:-(\d+|fin))?$/);
    if (m && ESS[+m[1]]) {
      st.vue = 'int'; st.tab = +m[1];
      const cards = cardsFor(st.tab);
      if (m[2] === 'fin') st.i = cards.length;
      else if (m[2]) st.i = Math.max(0, Math.min(+m[2] - 1, cards.length - 1));
      else { const first = cards.findIndex(c => !st.cacher || statut(c) !== 'maitrise'); st.i = first < 0 ? cards.length : first; }
      intention();
      document.title = `${ESS[st.tab].je} · L’antisèche qui s’ouvre`;
    } else {
      st.vue = 'accueil'; accueil();
      document.title = 'L’antisèche qui s’ouvre';
    }
    window.scrollTo(0, 0);
  }

  document.addEventListener('click', e => {
    const b = e.target.closest('button, a');
    if (!b) return;
    if (b.dataset.moment) { st.moment = b.dataset.moment; store.set('moment', st.moment); accueil(); return; }
    if (b.dataset.sheet) { sheet(b.dataset.sheet); return; }
    if (b.dataset.rep) { store.set('repere', b.dataset.rep); sheet('reperes'); return; }
    if (b.hasAttribute('data-close')) { $('#sheet').close(); return; }
    if (b.dataset.say) { speak(b.dataset.say); return; }
    if (b.dataset.go) { go(+b.dataset.go); return; }
    if (b.dataset.act) {
      const c = cardsFor(st.tab)[st.i];
      if (!c) return;
      if (b.dataset.act === 'connu') {
        const was = statut(c) === 'maitrise';
        PR.marquer(c.e, 'connu', 'decouvrir');
        if (!was) { flash('ok'); setTimeout(() => go(1), reduce() ? 0 : 260); } else intention();
      } else {
        const was = revoir(c);
        PR.marquer(c.e, 'revoir', 'decouvrir');
        if (!was) { flash('rv'); setTimeout(() => go(1), reduce() ? 0 : 260); } else intention();
      }
      return;
    }
    if (b.id === 'theme') {
      const cur = document.documentElement.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next); store.set('theme', next);
    }
  });
  document.addEventListener('change', e => {
    if (e.target.id === 'formules') { st.formules = e.target.checked; store.set('formules', st.formules); accueil(); }
    if (e.target.id === 'cacher') { st.cacher = e.target.checked; store.set('cacher', st.cacher); }
  });
  document.addEventListener('keydown', e => {
    if (st.vue !== 'int' || $('#sheet').open || /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) return;
    if (e.key === 'ArrowRight') go(1);
    else if (e.key === 'ArrowLeft') go(-1);
  });
  $('#sheet').addEventListener('click', e => { if (e.target.id === 'sheet') e.target.close(); });
  function flash(kind) { const c = $('#card'); if (c) c.classList.add('flash-' + kind); }

  window.addEventListener('hashchange', route);
  route();
})();
