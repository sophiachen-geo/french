/* Les cadres de la phrase et de la conversation — moteur du site.
   Aucune dépendance : le contenu (content/*.js) est du Markdown enrichi,
   rendu ici avec badges de registre, notations de construction, filtres,
   recherche, renvois entre onglets, fiches et activités. */
(function () {
  'use strict';

  const S = window.SITE;
  const M = S.meta;
  const TAB_IDS = Object.keys(S.tabs).map(Number).sort((a, b) => a - b);
  const MOD = {};
  M.modules.forEach(m => m.tabs.forEach(t => { MOD[t] = m; }));

  /* ---------- Utilitaires ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const norm = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[’`]/g, "'").replace(/…/g, '...').replace(/\s+/g, ' ').trim();
  const slug = s => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const uniq = a => Array.from(new Set(a));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const store = {
    get(k, d) { try { const v = localStorage.getItem('cadres:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('cadres:' + k, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } }
  };
  const reduceMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tabTitle = id => S.tabs[id] ? S.tabs[id].title : '';

  /* ---------- Registres ---------- */
  const REG = {};
  M.registres.forEach(r => { REG[r.code] = r; });
  const REG_ALIAS = { 'familier QC': 'F-QC' };
  const regCls = c => 'r-' + c.toLowerCase().replace(/[^a-z]/g, '');

  function parseTag(inner) {
    const codes = [], notes = [];
    inner.split(',').map(s => s.trim()).filter(Boolean).forEach(p => {
      const c = REG[p] ? p : REG_ALIAS[p];
      if (c) codes.push(c); else notes.push(p);
    });
    return { codes, note: notes.join(', ') };
  }
  function badge(c) {
    return `<abbr class="reg ${regCls(c)}" title="${esc(REG[c].label + ' : ' + REG[c].def)}">${c}</abbr>`;
  }
  function tagHTML(t) {
    return `<span class="tag">${t.codes.map(badge).join('')}${t.note ? `<span class="tag-note">${t.note}</span>` : ''}</span>`;
  }

  /* ---------- Notations de construction (+ nom, + subj.…) ---------- */
  const CONS = ['inf. passé', 'participe présent', 'participe passé', 'proposition interrogative indirecte',
    'proposition interrogative', 'interrogation indirecte', 'imparfait/plus-que-parfait', 'plus-que-parfait',
    'conditionnel présent', 'conditionnel passé', 'nom/date/durée', 'nom/pronom', 'nom/proposition', 'nom/inf.',
    'nom / GN', 'inf./nom', 'subj./ind.', 'adj./adv.', 'mois/année', 'proposition', 'antécédent', 'relative',
    'précision', 'pronom', 'nom', 'GN', 'inf.', 'ind.', 'subj.', 'cond.', 'adj.', 'adv.', 'durée', 'date',
    'heure', 'moment', 'période', 'présent', 'futur', 'impératif', 'imparfait'];
  const reEsc = s => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
  const CONS_ALT = CONS.slice().sort((a, b) => b.length - a.length).map(reEsc).join('|');
  const CONS_RE = new RegExp('(^|[\\s(>])\\+\\s(' + CONS_ALT + ')(?![\\wÀ-ÿ])', 'g');
  const ITEM_RE = new RegExp('^(.*?)\\s\\+\\s(' + CONS_ALT + ')(?![\\wÀ-ÿ])(.*)$');

  function consKind(c) {
    if (/^ind\./.test(c)) return 'ind';
    if (/^subj\./.test(c)) return 'subj';
    if (/^cond\./.test(c)) return 'cond';
    if (/^(inf\.|participe)/.test(c)) return 'inf';
    if (/^(nom|GN|pronom)/.test(c)) return 'nom';
    if (/^(adj\.|adv\.)/.test(c)) return 'adj';
    if (/^(proposition|relative|interrogation|antécédent|précision)/.test(c)) return 'prop';
    if (/^(durée|date|heure|moment|période|mois)/.test(c)) return 'time';
    return 'tense';
  }
  const RULE_FOR = { ind: 'regles-2-indicatif', subj: 'regles-2-subjonctif', cond: 'regles-2-conditionnel', inf: 'regles-1', nom: 'regles-1', prop: 'regles-1' };
  function consHTML(c, isStatic) {
    const k = consKind(c), r = RULE_FOR[k], label = '+ ' + c;
    if (r && !isStatic) return `<button type="button" class="cons k-${k}" data-rule="${r}" title="Voir la règle">${label}</button>`;
    return `<span class="cons k-${k}">${label}</span>`;
  }

  /* ---------- Rendu en ligne ---------- */
  const frSpace = s => s.replace(/ ([;:?!»])/g, ' $1').replace(/« /g, '« ');
  function inline(raw, o) {
    o = o || {};
    let s = frSpace(esc(raw));
    s = s.replace(/\[([^\]]+)\]/g, (m, inner) => {
      const t = parseTag(inner);
      return t.codes.length ? tagHTML(t) : `<span class="tag"><span class="tag-note">${inner}</span></span>`;
    });
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^\w*])\*(?=\S)(.+?)\*(?![\w*])/g, '$1<em>$2</em>');
    s = s.replace(CONS_RE, (m, pre, c) => pre + consHTML(c, o.static));
    return s;
  }

  /* ---------- Analyse d'une expression ---------- */
  function analyse(raw) {
    const codes = [];
    raw.replace(/\[([^\]]+)\]/g, (m, inner) => { codes.push(...parseTag(inner).codes); return m; });
    const plain = raw.replace(/\s*\[[^\]]+\]/g, '').replace(/\*/g, '').trim();
    let head = plain, cons = null, rest = '';
    const m = plain.match(ITEM_RE);
    if (m) { head = m[1]; cons = m[2]; rest = m[3].trim(); }
    else { const p = plain.indexOf(' + '); if (p > 0) head = plain.slice(0, p); }
    const base = head.split(/\s(?::|≠|→)\s/)[0];
    const keys = base.split(' / ')
      .map(k => norm(k).replace(/[\s.;:,!?]+$/, '').trim())
      .filter(Boolean);
    return { regs: codes.length ? uniq(codes) : ['C'], plain, head: head.replace(/[\s;]+$/, ''), cons, rest, keys };
  }

  /* ---------- Markdown → blocs ---------- */
  function parseBlocks(md) {
    const L = md.replace(/\r/g, '').split('\n');
    const out = [];
    const isStart = l => /^(#{2,3} |\||- |\d+\. |>|\{\{|---)/.test(l);
    let i = 0;
    while (i < L.length) {
      const l = L[i];
      let m;
      if (!l.trim()) { i++; continue; }
      if ((m = l.match(/^(#{2,3}) (.*)$/))) { out.push({ t: m[1].length === 2 ? 'h2' : 'h3', text: m[2].trim() }); i++; continue; }
      if ((m = l.match(/^\{\{(\w+)\}\}\s*$/))) { out.push({ t: 'widget', name: m[1] }); i++; continue; }
      if (/^---+\s*$/.test(l)) { out.push({ t: 'hr' }); i++; continue; }
      if (l.startsWith('|')) {
        const rows = [];
        while (i < L.length && L[i].startsWith('|')) rows.push(L[i++]);
        const cells = r => r.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
        out.push({ t: 'table', head: cells(rows[0]), rows: rows.slice(2).map(cells) });
        continue;
      }
      if (/^- /.test(l)) {
        const items = [];
        while (i < L.length && /^- /.test(L[i])) items.push(L[i++].slice(2));
        out.push({ t: 'ul', items });
        continue;
      }
      if (/^\d+\. /.test(l)) {
        const items = [];
        while (i < L.length && /^\d+\. /.test(L[i])) items.push(L[i++].replace(/^\d+\. /, ''));
        out.push({ t: 'ol', items });
        continue;
      }
      if (/^>/.test(l)) {
        const paras = [[]];
        while (i < L.length && /^>/.test(L[i])) {
          const x = L[i++].replace(/^> ?/, '');
          if (!x.trim()) paras.push([]); else paras[paras.length - 1].push(x);
        }
        out.push({ t: 'quote', paras: paras.filter(p => p.length).map(p => p.join(' ')) });
        continue;
      }
      const buf = [];
      while (i < L.length && L[i].trim() && !isStart(L[i])) buf.push(L[i++]);
      out.push({ t: 'p', text: buf.join(' ') });
    }
    return out;
  }

  const NUM_RE = /^((?:\d+\.)*\d+|[IVX]+)\.?\s+(.+)$/;
  function sectionize(blocks) {
    const intro = [], sections = [];
    let cur = null;
    blocks.forEach(b => {
      if (b.t === 'h2') {
        const m = b.text.match(NUM_RE);
        cur = { num: m ? m[1] : null, title: m ? m[2] : b.text, subs: [{ title: null, blocks: [] }] };
        sections.push(cur);
      } else if (b.t === 'h3') {
        if (!cur) { cur = { num: null, title: null, subs: [] }; sections.push(cur); }
        cur.subs.push({ title: b.text, blocks: [] });
      } else {
        (cur ? cur.subs[cur.subs.length - 1].blocks : intro).push(b);
      }
    });
    return { intro, sections };
  }

  function noteKind(title) {
    const t = norm(title);
    if (/activite orale/.test(t)) return 'activity';
    if (/piege/.test(t)) return 'piege';
    if (/reconnaitre/.test(t)) return 'reconnaitre';
    if (/distingu|distinction|nuance|comparaison/.test(t)) return 'distinction';
    if (/grammatica/.test(t)) return 'grammaire';
    if (/quebec/.test(t)) return 'qc';
    return 'note';
  }
  function subKind(title) {
    const t = norm(title);
    if (/quebec/.test(t)) return 'qc';
    if (/comparaison|nuance|distingu/.test(t)) return 'distinction';
    if (/conversationnel/.test(t)) return 'oral';
    if (/prioritaire/.test(t)) return 'prio';
    if (/avancee/.test(t)) return 'adv';
    return 'plain';
  }
  const NOTE_LABEL = { piege: 'Pièges', reconnaitre: 'À reconnaître', distinction: 'À distinguer', grammaire: 'Grammaire', qc: 'Québec', note: 'Repère' };

  /* ---------- Blocs → HTML ---------- */
  function renderBlocks(blocks, ctx) { return blocks.map(b => renderBlock(b, ctx)).join(''); }
  function renderBlock(b, ctx) {
    switch (b.t) {
      case 'p': {
        const label = /^\*\*[^*]+\*\*$/.test(b.text.trim());
        return `<p${label ? ' class="label-p"' : ''}>${inline(b.text)}</p>`;
      }
      case 'ul': return renderList(b, ctx);
      case 'ol': return `<ol class="ol">${b.items.map(x => `<li>${inline(x)}</li>`).join('')}</ol>`;
      case 'quote': return `<blockquote class="quote">${b.paras.map(p => `<p>${inline(p)}</p>`).join('')}</blockquote>`;
      case 'table': return renderTable(b, ctx);
      case 'hr': return '<hr>';
      case 'widget': return widget(b.name);
      default: return '';
    }
  }
  function renderList(b, ctx) {
    const semi = b.items.filter(x => /;\s*$/.test(x)).length >= b.items.length / 2;
    const items = b.items.map((x, i) => {
      let s = x.trim().replace(/\s*;\s*$/, '');
      if (semi && i === b.items.length - 1 && /\.$/.test(s) && !/\b(?:ind|subj|cond|inf|adj|adv)\.$/.test(s)) s = s.replace(/\s*\.$/, '');
      return s;
    });
    if (ctx.track) return `<ul class="xl">${items.map(s => itemHTML(s, ctx, 'li')).join('')}</ul>`;
    return `<ul class="ul">${items.map(s => `<li>${inline(s)}</li>`).join('')}</ul>`;
  }
  const EXPR_COL = /expression|variante|français|construction|pronom|formes|usages|registre/i;
  function renderTable(b, ctx) {
    const exprCols = b.head.map(h => !!ctx.track && EXPR_COL.test(h));
    const head = `<thead><tr>${b.head.map(h => `<th scope="col">${inline(h)}</th>`).join('')}</tr></thead>`;
    const body = b.rows.map(r => {
      const rowLabel = exprCols[0] ? null : r[0].replace(/\*/g, '');
      return '<tr>' + r.map((c, j) => {
        const lab = ` data-label="${esc((b.head[j] || '').replace(/\*/g, ''))}"`;
        if (exprCols[j]) {
          ctx.row = rowLabel;
          const html = c.split(/\s*;\s*/).filter(Boolean).map(ch => itemHTML(ch, ctx, 'span')).join('');
          ctx.row = null;
          return `<td${lab}><span class="chunks">${html}</span></td>`;
        }
        return `<td${lab}>${inline(c)}</td>`;
      }).join('') + '</tr>';
    }).join('');
    return `<div class="tbl-wrap"><table class="tbl cols-${b.head.length}">${head}<tbody>${body}</tbody></table></div>`;
  }
  function itemHTML(s, ctx, tag) {
    const a = analyse(s);
    const id = ctx.idp + (++ctx.n);
    ctx.items.push(Object.assign({ id, tab: ctx.tab, raw: s, section: ctx.section, sub: ctx.sub, row: ctx.row || null, filterable: !!ctx.filterable }, a));
    const reg = ctx.filterable ? ` data-reg="${a.regs.map(c => c.toLowerCase()).join(' ')}"` : '';
    return `<${tag} class="it" id="${id}"${reg}><span class="it-t">${inline(s)}</span></${tag}>`;
  }

  /* ---------- Onglets ---------- */
  function renderTabData(tab) {
    const { sections } = sectionize(parseBlocks(tab.md));
    const ctx = { tab: tab.id, items: [], n: 0, idp: `t${tab.id}-`, track: true };
    const toc = [], secs = [];
    let activity = '', html = '';
    sections.forEach(s => {
      const isNum = !!s.num;
      const kind = isNum ? 'section' : noteKind(s.title || '');
      if (kind === 'activity') { activity = s.subs.map(x => renderBlocks(x.blocks, {})).join(''); return; }
      const id = isNum ? 's' + s.num.replace(/\./g, '-') : 'n-' + slug(s.title);
      const sec = { id, num: s.num, title: s.title, kind, tab: tab.id };
      secs.push(sec);
      ctx.section = sec;
      ctx.filterable = isNum;
      toc.push(sec);
      const subs = s.subs.map(sub => {
        ctx.sub = sub.title;
        const inner = renderBlocks(sub.blocks, ctx);
        if (!sub.title) return inner ? `<div class="sub">${inner}</div>` : '';
        const sk = subKind(sub.title);
        const flag = sk === 'qc' ? '<span class="qc-flag" aria-hidden="true">QC</span>' : '';
        return `<div class="sub sub-${sk}" id="${id}-${slug(sub.title)}"><h3>${flag}${inline(sub.title)}</h3>${inner}</div>`;
      }).join('');
      html += isNum
        ? `<section class="sec" id="${id}"><h2><span class="sec-n">${s.num}</span><span>${inline(s.title)}</span></h2>${subs}</section>`
        : `<section class="note note-${kind}" id="${id}"><p class="note-k">${NOTE_LABEL[kind]}</p><h2>${inline(s.title)}</h2>${subs}</section>`;
    });
    return { html, toc, secs, items: ctx.items, activity };
  }

  /* ---------- Pages ---------- */
  function renderPageData(page, idp) {
    const { intro, sections } = sectionize(parseBlocks(page.md || ''));
    const ctx = {};
    const toc = [];
    let html = renderBlocks(intro, ctx);
    sections.forEach(s => {
      const id = idp + page.id + '-' + slug(s.num || s.title || 'x');
      toc.push({ id, num: s.num, title: s.title });
      const subs = s.subs.map(sub => {
        const inner = renderBlocks(sub.blocks, ctx);
        if (!sub.title) return inner;
        return `<div class="psub" id="${id}-${slug(sub.title)}"><h3>${inline(sub.title)}</h3>${inner}</div>`;
      }).join('');
      html += `<section class="psec" id="${id}"><h2>${s.num ? `<span class="sec-n">${s.num}</span>` : ''}<span>${inline(s.title)}</span></h2>${subs}</section>`;
    });
    return { html, toc };
  }

  /* ---------- Widgets insérés dans les pages ---------- */
  function widget(name) {
    if (name === 'organisation') {
      const rows = M.modules.map(m => m.tabs.map((t, i) => `<tr>${i === 0 ? `<th scope="rowgroup" rowspan="${m.tabs.length}" class="org-mod mod-${m.id}"><span class="mod-letter">${m.id}</span> ${esc(m.title)}</th>` : ''}<td><a href="#onglet-${t}"><span class="org-n">${t}.</span> ${esc(tabTitle(t))}</a></td><td>${esc(S.tabs[t].aim)}</td></tr>`).join('')).join('');
      return `<div class="tbl-wrap"><table class="tbl org"><thead><tr><th scope="col">Module</th><th scope="col">Onglet</th><th scope="col">Objectif</th></tr></thead><tbody>${rows}</tbody></table></div>`;
    }
    if (name === 'registres') {
      return `<div class="tbl-wrap"><table class="tbl regs"><thead><tr><th scope="col">Étiquette</th><th scope="col">Signification</th></tr></thead><tbody>${M.registres.map(r => `<tr><td>${badge(r.code)} <span class="reg-l">${esc(r.label)}</span></td><td>${esc(r.def)}</td></tr>`).join('')}</tbody></table></div>`;
    }
    if (name === 'chains') return chainsHTML(M.chains);
    return '';
  }
  function chainsHTML(chains) {
    return `<ul class="chains">${chains.map(c => `<li class="chain">${c.steps.map((s, k) => `<a class="cstep" href="#onglet-${s[1]}"><span>${esc(s[0])}</span><span class="cstep-t">${s[1]}</span></a>`).join('<span class="arrow" aria-hidden="true">→</span>')}</li>`).join('')}</ul>`;
  }

  /* ---------- Pré-rendu et index ---------- */
  const TABS = {};
  const ITEMS = [];
  const ITEM_BY_ID = new Map();
  const BY_KEY = new Map();
  TAB_IDS.forEach(id => {
    const d = renderTabData(S.tabs[id]);
    TABS[id] = d;
    d.items.forEach(it => {
      ITEMS.push(it);
      ITEM_BY_ID.set(it.id, it);
      it.keys.forEach(k => { if (!BY_KEY.has(k)) BY_KEY.set(k, []); BY_KEY.get(k).push(it); });
    });
  });
  const PAGES = {};
  Object.keys(S.pages).forEach(id => { PAGES[id] = renderPageData(S.pages[id], ''); });
  const DRAWER = renderPageData(S.pages.regles, 'dr-');

  const FICHE = new Map();
  const FICHE_BY_ID = new Map();
  S.fiches.forEach(f => {
    f.id = 'f-' + slug(f.expression);
    FICHE_BY_ID.set(f.id, f);
    [f.key].concat(f.aliases || []).forEach(k => FICHE.set(norm(k), f));
  });
  const ficheFor = it => { for (const k of it.keys) { const f = FICHE.get(k); if (f) return f; } return null; };

  function xrefs(it) {
    const seen = new Set([it.tab + '|' + it.section.id]);
    const out = [];
    it.keys.forEach(k => (BY_KEY.get(k) || []).forEach(o => {
      const key = o.tab + '|' + o.section.id;
      if (o === it || seen.has(key)) return;
      seen.add(key);
      out.push(o);
    }));
    return out;
  }

  const crumb = it => `Onglet ${it.tab} · ${it.section.num ? it.section.num + ' ' : ''}${it.section.title}${it.row ? ' › ' + it.row : ''}${it.sub && it.section.kind === 'section' ? ' › ' + it.sub : ''}`;
  const itemHref = it => `#onglet-${it.tab}--${it.id}`;

  const INDEX = [];
  TAB_IDS.forEach(id => {
    const t = S.tabs[id];
    INDEX.push({ kind: 'tab', n: norm(`${t.title} ${t.aim} ${t.verb}`), tab: id });
    TABS[id].secs.forEach(s => INDEX.push({ kind: 'sec', n: norm(s.title), tab: id, sec: s }));
  });
  ITEMS.forEach(it => INDEX.push({ kind: 'item', n: norm(it.plain), keys: it.keys, it }));
  S.fiches.forEach(f => INDEX.push({ kind: 'fiche', n: norm(`${f.expression} ${f.fonctions.map(x => x.fonction).join(' ')}`), keys: [norm(f.key)], f }));
  Object.keys(PAGES).forEach(pid => PAGES[pid].toc.forEach(s => INDEX.push({ kind: 'page', n: norm(s.title), page: pid, sec: s })));

  /* ---------- Filtres de registre ---------- */
  const HIDDEN = new Set(store.get('hidden', []).filter(c => REG[c]));
  function applyHide() {
    const css = Array.from(HIDDEN).map(c => `.it[data-reg~="${c.toLowerCase()}"]:not(.force)`).join(',');
    $('#hide-style').textContent = css ? css + '{display:none}' : '';
    $$('[data-reg-toggle]').forEach(b => b.setAttribute('aria-pressed', String(!HIDDEN.has(b.dataset.regToggle))));
    const out = $('.filters-count');
    if (out) {
      const n = $$('.it[data-reg]', VIEW).filter(el => el.dataset.reg.split(' ').some(c => HIDDEN.has(c.toUpperCase()))).length;
      out.textContent = n ? `${n} expression${n > 1 ? 's' : ''} masquée${n > 1 ? 's' : ''}` : '';
    }
  }
  function filterBar() {
    return `<div class="filters" role="group" aria-label="Registres affichés">
      <span class="filters-l">Afficher</span>
      ${M.registres.map(r => `<button type="button" class="fchip" data-reg-toggle="${r.code}" aria-pressed="true" title="${esc(r.label + ' : ' + r.def)}">${badge(r.code)}<span>${esc(r.label)}</span></button>`).join('')}
      <span class="filters-count" aria-live="polite"></span>
    </div>`;
  }

  /* ---------- Vues ---------- */
  const VIEW = $('#view');

  function viewHome() {
    const d = M.demo;
    return `
    <section class="hero">
      <p class="eyebrow">Français standard · usages québécois</p>
      <h1>${esc(M.title)}</h1>
      <p class="lede">${esc(M.subtitle.split(' — ')[0])}.</p>
      <p class="hero-obj">${esc(M.objectif)}</p>
    </section>

    <section class="block" aria-labelledby="h-q">
      <h2 class="h-sm" id="h-q">L'apprentissage repose sur trois questions</h2>
      <ol class="qs">${M.questions.map((q, i) => `<li><span class="qs-n">${i + 1}</span><strong>${esc(q.q)}</strong><span>${esc(q.d)}</span></li>`).join('')}</ol>
    </section>

    <section class="demo" aria-labelledby="h-demo">
      <div class="demo-head">
        <h2 id="h-demo">Une idée, huit relations</h2>
        <p>Un <strong>cadre</strong> enrichit une même information selon ce qu'on veut exprimer.</p>
      </div>
      <p class="demo-sit"><span class="demo-k">Situation</span> ${esc(d.situation)}</p>
      <div class="demo-tabs" role="tablist" aria-label="Relation à exprimer">${d.rows.map((r, i) => `<button type="button" role="tab" id="demo-t${i}" aria-selected="${i === 0}" aria-controls="demo-out" data-demo="${i}">${esc(r.intention)}</button>`).join('')}</div>
      <div class="demo-out" id="demo-out" role="tabpanel" aria-labelledby="demo-t0">${demoRow(0)}</div>
    </section>

    <section class="block map" aria-labelledby="h-map">
      <h2 id="h-map">Que voulez-vous faire ?</h2>
      <p class="sub-lede">Le matériel est organisé par fonction communicative, et non par catégorie grammaticale.</p>
      ${M.modules.map(m => `
        <div class="map-mod mod-${m.id}">
          <h3><span class="mod-letter">${m.id}</span>${esc(m.title)}</h3>
          <div class="cards">${m.tabs.map(tabCard).join('')}</div>
        </div>`).join('')}
    </section>

    <section class="block" aria-labelledby="h-paths">
      <h2 class="h-sm" id="h-paths">Repères transversaux</h2>
      <div class="paths">
        ${pathCard('guide', "Mode d'emploi", 'Cadres, notation grammaticale, registres et priorités.')}
        ${pathCard('relier', 'Relier les onglets', 'Six modèles qui combinent plusieurs fonctions dans un même discours.')}
        ${pathCard('fiches', "Fiches d'expression", 'Les expressions à plusieurs fonctions, avec exemples, nuances et pièges.')}
        ${pathCard('regles', 'Règles transversales', 'Nom, infinitif ou proposition ; choix du mode ; verbes et prépositions.')}
        ${pathCard('methode', 'Méthode et progression', 'Les neuf étapes d’activités, les quatre niveaux, le résultat visé.')}
      </div>
    </section>

    <p class="principle">${inline("**Principe central :** apprendre à organiser sa pensée directement en français, à partir de fonctions communicatives et de constructions réutilisables.")}</p>`;
  }
  function demoRow(i) {
    const r = M.demo.rows[i];
    const phrase = frSpace(esc(r.phrase)).replace(/\{([^}]+)\}/g, '<mark>$1</mark>');
    return `<p class="demo-phrase">${phrase}</p>
      <p class="demo-meta"><span class="demo-k">${esc(r.intention)}</span> ${inline(r.construction)} <a href="#onglet-${r.tab}">Onglet ${r.tab} · ${esc(tabTitle(r.tab))} <span aria-hidden="true">→</span></a></p>`;
  }
  function tabCard(t) {
    const tb = S.tabs[t];
    return `<a class="card" href="#onglet-${t}"><span class="card-n">${t}</span><span class="card-v">${esc(tb.verb)}</span><span class="card-t">${esc(tb.title)}</span><span class="card-a">${esc(tb.aim)}</span></a>`;
  }
  function pathCard(id, title, desc) {
    return `<a class="path" href="#${id}"><span class="path-t">${esc(title)}</span><span class="path-d">${esc(desc)}</span></a>`;
  }

  function sequencesFor(id) {
    const seqs = [];
    M.chains.forEach(c => { if (c.steps.some(s => s[1] === id)) seqs.push({ steps: c.steps, from: 'chain' }); });
    S.models.forEach(m => { if (m.steps.some(s => s[1] === id)) seqs.push({ steps: m.steps, from: 'model', model: m }); });
    return seqs;
  }

  function viewTab(id) {
    const tab = S.tabs[id], d = TABS[id], mod = MOD[id];
    const i = TAB_IDS.indexOf(id), prev = TAB_IDS[i - 1], next = TAB_IDS[i + 1];
    const toc = d.toc.map(t => `<a href="#onglet-${id}--${t.id}" class="toc-${t.kind}">${t.num ? `<span class="toc-n">${t.num}</span>` : ''}${esc(t.title)}</a>`).join('');
    return `
    <article class="tab mod-${mod.id}">
      <header class="page-head">
        <p class="eyebrow"><span class="mod-letter">${mod.id}</span>${esc(mod.title)} <span class="sep" aria-hidden="true">/</span> Onglet ${id}</p>
        <h1>${esc(tab.title)}</h1>
        <p class="lede">${inline(tab.objectif)}</p>
        ${tab.note ? `<p class="head-note">${inline(tab.note)}</p>` : ''}
      </header>
      <div class="tab-grid">
        <div class="tab-main">
          ${filterBar()}
          <div class="tab-body">${d.html}</div>
          ${activitiesHTML(id)}
          ${enchainerHTML(id)}
          <nav class="pager" aria-label="Onglets voisins">
            ${prev ? `<a class="pg pg-prev" href="#onglet-${prev}"><span>← Onglet ${prev}</span>${esc(tabTitle(prev))}</a>` : '<span></span>'}
            ${next ? `<a class="pg pg-next" href="#onglet-${next}"><span>Onglet ${next} →</span>${esc(tabTitle(next))}</a>` : '<span></span>'}
          </nav>
        </div>
        <details class="toc" id="toc">
          <summary>Sur cette page</summary>
          <nav aria-label="Sur cette page">${toc}<a href="#onglet-${id}--activites" class="toc-act">Activités</a><a href="#onglet-${id}--enchainer" class="toc-act">Enchaîner</a></nav>
        </details>
      </div>
    </article>`;
  }

  function enchainerHTML(id) {
    const chains = M.chains.filter(c => c.steps.some(s => s[1] === id));
    const models = S.models.filter(m => m.steps.some(s => s[1] === id));
    return `<section class="block ench" id="enchainer">
      <h2>Enchaîner avec d'autres fonctions</h2>
      ${chains.length ? `<p class="h-sm">Enchaînements fréquents</p>${chainsHTML(chains)}` : ''}
      ${models.length ? `<p class="h-sm">Modèles de discours qui utilisent cet onglet</p><ul class="mlinks">${models.map(m => `<li><a href="#relier--m${m.n}"><span class="ml-n">${m.n}</span>${esc(m.title)}<span class="ml-s">${m.steps.map(s => esc(s[0])).join(' → ')}</span></a></li>`).join('')}</ul>` : ''}
    </section>`;
  }

  /* ---------- Activités (V) ---------- */
  function activitiesHTML(id) {
    return `<section class="acts" id="activites">
      <div class="acts-head">
        <h2>Activités</h2>
        <p>Neuf étapes, de la compréhension au réemploi. La production orale d'abord : dites vos réponses à voix haute.</p>
      </div>
      <ol class="steps">${M.etapes.map(st => `
        <li class="step">
          <details${st.n === 1 || st.n === 6 ? ' open' : ''}>
            <summary><span class="step-n">${st.n}</span><span class="step-t">${esc(st.titre)}</span><span class="step-o">${esc(st.objectif)}</span></summary>
            <div class="step-b" data-step="${st.n}"><p class="step-act">${esc(st.activite)}</p><div class="step-x"></div></div>
          </details>
        </li>`).join('')}
      </ol>
    </section>`;
  }

  const QUIZ_EXCLUDE = /grammatica/;
  const poolIntent = id => TABS[id].items.filter(it => it.filterable && !QUIZ_EXCLUDE.test(norm(it.section.title)) && it.plain.length < 90);
  const CORE = ['nom', 'inf.', 'ind.', 'subj.', 'cond.'];
  const poolCons = id => TABS[id].items.filter(it => it.filterable && it.cons && CORE.includes(it.cons) && (!it.rest || /^,/.test(it.rest)) && it.head.length < 60);
  const itemLink = it => `<a class="ilink" href="${itemHref(it)}">${inline(it.raw, { static: true })}</a>`;

  function fillActivities(id) {
    const root = $('#activites');
    if (!root) return;
    const box = n => $(`.step-b[data-step="${n}"] .step-x`, root);
    stepComprendre(id, box(1));
    stepObserver(id, box(2));
    stepConstruire(id, box(3));
    stepTransformer(id, box(4));
    stepRelier(id, box(5));
    stepConverser(id, box(6));
    stepQuebec(id, box(7));
    stepRegistre(id, box(8));
    stepReemployer(id, box(9));
  }

  function quizShell(el, score) {
    el.innerHTML = `<div class="quiz"><div class="quiz-q"></div><div class="quiz-f"><span class="score" aria-live="polite">${score.ok} / ${score.n}</span><button type="button" class="btn quiz-next">Question suivante</button></div></div>`;
  }
  function answerQuiz(el, btn, ok, score, fbHTML) {
    $$('.q-opt', el).forEach(b => {
      b.disabled = true;
      if (b.dataset.ok === '1') b.classList.add('is-ok');
    });
    if (!ok) btn.classList.add('is-bad');
    score.n++; if (ok) score.ok++;
    $('.score', el).textContent = `${score.ok} / ${score.n}`;
    $('.q-fb', el).innerHTML = (ok ? '<strong class="fb-ok">Oui.</strong> ' : '<strong class="fb-bad">Pas tout à fait.</strong> ') + fbHTML;
  }

  function stepComprendre(id, el) {
    const pool = poolIntent(id);
    const secs = uniq(pool.map(it => it.section));
    if (pool.length < 3 || secs.length < 2) { el.innerHTML = '<p class="muted">Pas assez de sous-sections dans cet onglet pour ce jeu.</p>'; return; }
    const others = TAB_IDS.filter(t => t !== id).flatMap(t => TABS[t].secs.filter(s => s.kind === 'section' && !QUIZ_EXCLUDE.test(norm(s.title))));
    const score = { ok: 0, n: 0 };
    quizShell(el, score);
    const ask = () => {
      const it = pick(pool);
      const correct = it.section;
      let distract = shuffle(secs.filter(s => s !== correct)).slice(0, 3);
      if (distract.length < 3) distract = distract.concat(shuffle(others).slice(0, 3 - distract.length));
      const opts = shuffle([correct].concat(distract));
      $('.quiz-q', el).innerHTML = `
        <p class="q-prompt">À quelle intention correspond cette expression ?</p>
        <p class="q-item">${inline(it.raw, { static: true })}</p>
        <div class="q-opts">${opts.map(o => `<button type="button" class="q-opt" data-ok="${o === correct ? 1 : 0}">${esc(o.title)}${o.tab !== id ? ` <small>onglet ${o.tab}</small>` : ''}</button>`).join('')}</div>
        <p class="q-fb" aria-live="polite"></p>`;
      $$('.q-opt', el).forEach(b => b.addEventListener('click', () => answerQuiz(el, b, b.dataset.ok === '1', score,
        `${it.row ? `${esc(it.row)} — ` : ''}<a href="${itemHref(it)}">${correct.num} ${esc(correct.title)}</a>`)));
    };
    $('.quiz-next', el).addEventListener('click', ask);
    ask();
  }

  function stepObserver(id, el) {
    const pool = poolCons(id);
    if (pool.length < 2) {
      el.innerHTML = `<p class="muted">Les expressions de cet onglet ne sont pas notées avec + nom, + inf. ou + mode. Observez plutôt la structure de chaque exemple : où se place l'expression, et qu'est-ce qui la suit ?</p>`;
      return;
    }
    const score = { ok: 0, n: 0 };
    quizShell(el, score);
    const ask = () => {
      const it = pick(pool);
      $('.quiz-q', el).innerHTML = `
        <p class="q-prompt">Qu'est-ce qui suit cette expression ?</p>
        <p class="q-item"><span class="q-head">${inline(it.head, { static: true })}</span> <span class="slot" aria-label="à compléter">?</span></p>
        <p class="q-ctx">${esc(it.section.title)}${it.row ? ' — ' + esc(it.row) : ''}</p>
        <div class="q-opts q-opts-cons">${CORE.map(c => `<button type="button" class="q-opt" data-ok="${c === it.cons ? 1 : 0}">${consHTML(c, true)}</button>`).join('')}</div>
        <p class="q-fb" aria-live="polite"></p>`;
      const rule = RULE_FOR[consKind(it.cons)];
      $$('.q-opt', el).forEach(b => b.addEventListener('click', () => answerQuiz(el, b, b.dataset.ok === '1', score,
        `${inline(it.raw, { static: true })} ${rule ? `<button type="button" class="linkish" data-rule="${rule}">Voir la règle</button>` : ''}`)));
    };
    $('.quiz-next', el).addEventListener('click', ask);
    ask();
  }

  function drawBox(el, render) {
    el.innerHTML = `<div class="draw"><div class="draw-c"></div><button type="button" class="btn draw-again">Autre consigne</button></div>`;
    const go = () => { $('.draw-c', el).innerHTML = render(); };
    $('.draw-again', el).addEventListener('click', go);
    go();
  }

  function stepConstruire(id, el) {
    const pool = poolIntent(id).length ? poolIntent(id) : TABS[id].items;
    drawBox(el, () => {
      const it = pick(pool);
      return `<p class="draw-sit">Sujet : <strong>${esc(pick(M.situations))}</strong></p>
        <p class="q-item">${itemLink(it)}</p>
        <p class="hint">Dites une phrase complète à voix haute. Puis une deuxième, en changeant le sujet ou le temps du verbe.</p>`;
    });
  }

  function stepTransformer(id, el) {
    const groups = {};
    poolIntent(id).forEach(it => { (groups[it.section.id] = groups[it.section.id] || []).push(it); });
    const usable = Object.values(groups).filter(g => g.length >= 3);
    if (!usable.length) { el.innerHTML = '<p class="muted">Reformulez une phrase de l’onglet avec une autre expression de la même sous-section.</p>'; return; }
    drawBox(el, () => {
      const g = pick(usable);
      const three = shuffle(g).slice(0, 3);
      return `<p class="draw-sit">${esc(g[0].section.title)} — exprimez la même idée de trois façons :</p>
        <ol class="tri">${three.map(it => `<li>${itemLink(it)}</li>`).join('')}</ol>
        <p class="hint">Gardez le même sens ; changez la construction (nom, infinitif, proposition) ou le registre.</p>`;
    });
  }

  function stepRelier(id, el) {
    const seqs = sequencesFor(id);
    if (!seqs.length) { el.innerHTML = '<p class="muted">Aucun enchaînement défini pour cet onglet.</p>'; return; }
    drawBox(el, () => {
      const seq = pick(seqs);
      const parts = seq.steps.map(([label, t]) => {
        const pool = t === id ? poolIntent(id) : poolIntent(t);
        const it = pool.length ? pick(pool) : null;
        return `<li><span class="rl-l">${esc(label)} <small>onglet ${t}</small></span>${it ? itemLink(it) : ''}</li>`;
      }).join('');
      return `<p class="draw-sit">Sujet : <strong>${esc(pick(M.situations))}</strong> — enchaînez ${seq.steps.length} propositions :</p>
        <ol class="relier">${parts}</ol>
        ${seq.model ? `<p class="hint">Modèle : <a href="#relier--m${seq.model.n}">${esc(seq.model.title)}</a></p>` : '<p class="hint">Fusionnez-les en une ou deux phrases, puis recommencez avec d’autres expressions.</p>'}`;
    });
  }

  let TIMER = null;
  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  function stepConverser(id, el) {
    const text = TABS[id].activity || '<p>Répondez à une question ouverte en employant au moins trois expressions de cet onglet.</p>';
    const def = /deux minutes/.test(S.tabs[id].md) ? 120 : 60;
    el.innerHTML = `<div class="oral"><p class="oral-k">Activité orale</p>${text}</div>
      <div class="timer" role="group" aria-label="Minuterie">
        <div class="timer-presets">${[20, 60, 120].map(s => `<button type="button" class="tp" data-sec="${s}" aria-pressed="${s === def}">${fmt(s)}</button>`).join('')}</div>
        <output class="timer-o">${fmt(def)}</output>
        <button type="button" class="btn timer-go">Démarrer</button>
        <button type="button" class="btn-ghost timer-reset">Remettre</button>
        <span class="timer-end" aria-live="polite"></span>
      </div>`;
    let total = def, left = def, running = false;
    const out = $('.timer-o', el), go = $('.timer-go', el), end = $('.timer-end', el);
    const stop = () => { clearInterval(TIMER); TIMER = null; running = false; go.textContent = 'Démarrer'; };
    const reset = s => { stop(); total = left = s; out.textContent = fmt(s); end.textContent = ''; el.classList.remove('timer-done'); };
    $$('.tp', el).forEach(b => b.addEventListener('click', () => {
      $$('.tp', el).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      reset(+b.dataset.sec);
    }));
    $('.timer-reset', el).addEventListener('click', () => reset(total));
    go.addEventListener('click', () => {
      if (running) { stop(); return; }
      if (left <= 0) reset(total);
      clearInterval(TIMER);
      running = true; go.textContent = 'Pause'; end.textContent = '';
      TIMER = setInterval(() => {
        left--; out.textContent = fmt(Math.max(left, 0));
        if (left <= 0) { stop(); end.textContent = 'Temps écoulé.'; el.classList.add('timer-done'); }
      }, 1000);
    });
  }

  function stepQuebec(id, el) {
    const items = TABS[id].items.filter(it => it.regs.some(c => c === 'QC' || c === 'F-QC') || (it.sub && /quebec/.test(norm(it.sub))));
    if (!items.length) {
      el.innerHTML = '<p class="muted">Pas de variante québécoise notée dans cet onglet. Écoutez comment ces constructions sont employées à l’oral autour de vous.</p>';
      return;
    }
    el.innerHTML = `<p class="hint">Lisez chaque formule à voix haute avec l'intonation de la conversation, puis donnez son équivalent en registre neutre.</p>
      <ul class="pills">${items.slice(0, 18).map(it => `<li>${itemLink(it)}</li>`).join('')}</ul>`;
  }

  function stepRegistre(id, el) {
    const items = TABS[id].items.filter(it => it.filterable);
    const col = (label, f) => {
      const list = items.filter(f).slice(0, 6);
      return `<div class="rcol"><p class="rcol-h">${label}</p>${list.length ? `<ul>${list.map(it => `<li>${itemLink(it)}</li>`).join('')}</ul>` : '<p class="muted">—</p>'}</div>`;
    };
    el.innerHTML = `<p class="hint">Choisissez une idée et dites-la dans les trois registres.</p>
      <div class="rcols">
        ${col('Familier québécois', it => it.regs.includes('F-QC'))}
        ${col('Courant', it => !it.regs.includes('F-QC') && !it.regs.includes('S') && !it.regs.includes('D'))}
        ${col('Soutenu', it => it.regs.includes('S'))}
      </div>`;
  }

  function stepReemployer(id, el) {
    const rows = [];
    const seen = new Set();
    TABS[id].items.forEach(it => {
      const x = xrefs(it).filter(o => o.tab !== id);
      const k = it.keys[0];
      if (!x.length || seen.has(k)) return;
      seen.add(k);
      rows.push(`<li><span class="re-e">${inline(it.head || it.plain, { static: true })}</span><span class="re-to">${x.slice(0, 3).map(o => `<a href="${itemHref(o)}">onglet ${o.tab} · ${esc(o.section.title)}</a>`).join('')}</span></li>`);
    });
    el.innerHTML = rows.length
      ? `<p class="hint">Ces expressions servent aussi ailleurs. Réutilisez-en une dans la fonction de l'autre onglet.</p><ul class="reemploi">${rows.slice(0, 10).join('')}</ul>`
      : '<p class="muted">Aucune expression de cet onglet n’est reprise ailleurs telle quelle. Réutilisez-les dans les activités des onglets liés ci-dessous.</p>';
  }

  /* ---------- Pages ---------- */
  function viewPage(id) {
    const p = S.pages[id], d = PAGES[id];
    const toc = d.toc.length > 2 ? `<nav class="ptoc" aria-label="Sur cette page">${d.toc.map(t => `<a href="#${id}--${t.id}">${t.num ? `<span class="toc-n">${t.num}</span>` : ''}${esc(t.title)}</a>`).join('')}</nav>` : '';
    let body = d.html;
    if (id === 'relier') body = relierHTML();
    if (id === 'fiches') body = fichesGrid() + body;
    return `<article class="page page-${id}">
      <header class="page-head">
        <p class="eyebrow">${esc(p.kicker)}</p>
        <h1>${esc(p.title)}</h1>
        <p class="lede">${inline(p.lead)}</p>
      </header>
      ${id === 'relier' ? '' : toc}
      <div class="page-body">${body}</div>
    </article>`;
  }

  function relierHTML() {
    const seg = ([k, t]) => {
      const lead = t.match(/^\s*/)[0];
      const txt = t.trim();
      return k === null ? lead + inline(txt) : `${lead}<span class="seg st-${k}">${inline(txt)}</span>`;
    };
    const models = S.models.map(m => {
      let body;
      if (m.dialogue) {
        const lines = [[]];
        m.segments.forEach(([k, t]) => {
          const nl = t.endsWith('\n');
          lines[lines.length - 1].push([k, t.replace(/\n$/, '')]);
          if (nl) lines.push([]);
        });
        body = lines.filter(l => l.length).map(l => `<p class="line">— ${l.map(seg).join('')}</p>`).join('');
      } else body = `<p>${m.segments.map(seg).join('')}</p>`;
      const steps = m.steps.map((s, k) => `<a class="mstep st-${k}" href="#onglet-${s[1]}"><span class="mstep-dot" aria-hidden="true"></span>${esc(s[0])}<span class="mstep-tab">onglet ${s[1]}</span></a>`).join('<span class="arrow" aria-hidden="true">→</span>');
      return `<article class="model" id="m${m.n}">
        <h2><span class="sec-n">${m.n}</span><span>${esc(m.title)}</span></h2>
        <div class="msteps">${steps}</div>
        <blockquote class="mtext">${body}</blockquote>
      </article>`;
    }).join('');
    return `<div class="models">${models}</div><p class="muted">${esc(M.relierNote || '')}</p>`;
  }

  function fichesGrid() {
    return `<section class="psec" id="fiches-modeles">
      <h2><span>Fiches modèles</span></h2>
      <p>Les dix expressions à plusieurs fonctions disposent d'une fiche complète. ${inline('Le **niveau** (Échelle québécoise de francisation) et la **priorité** sont des propositions à valider expression par expression.')}</p>
      <div class="fgrid">${S.fiches.map(f => `
        <button type="button" class="fcard" data-fiche="${f.id}">
          <span class="fcard-e">${esc(f.expression)}</span>
          <span class="fcard-c">${inline(f.categorie, { static: true })}</span>
          <span class="fcard-f">${f.fonctions.map(fn => `<span>${esc(fn.fonction)} <small>${fn.tab}</small></span>`).join('')}</span>
        </button>`).join('')}
      </div>
    </section>`;
  }

  function ficheHTML(f) {
    const prio = M.priorites.find(p => p.id === f.priorite);
    const tabs = uniq(f.fonctions.map(fn => fn.tab).concat(ITEMS.filter(it => ficheFor(it) === f).map(it => it.tab))).sort((a, b) => a - b);
    return `<div class="fiche">
      <dl class="fiche-meta">
        <div><dt>Catégorie</dt><dd>${inline(f.categorie)}</dd></div>
        <div><dt>Registre</dt><dd>${f.registre.map(badge).join(' ')}</dd></div>
        <div><dt>Priorité</dt><dd><span class="prio prio-${f.priorite}">${prio ? prio.label : '—'}</span></dd></div>
        <div><dt>Niveau</dt><dd><span class="tbd">${f.niveau ? esc(f.niveau) : 'À valider'}</span></dd></div>
      </dl>
      <ol class="fns">${f.fonctions.map((fn, i) => `
        <li class="fn">
          <p class="fn-k">Fonction ${i + 1}</p>
          <h3>${esc(fn.fonction)} <span class="fn-sub">${inline(fn.sous)}</span></h3>
          <p class="fn-cons"><span class="fn-e">${esc(f.expression)}</span> ${fn.construction === 'seul' ? '<span class="cons k-seul">seul</span>' : inline(fn.construction)}</p>
          <p class="fn-sens">${inline(fn.sens)}</p>
          <dl class="ex">
            <div><dt>Oral</dt><dd>${inline(fn.oral)}</dd></div>
            <div><dt>Écrit</dt><dd>${inline(fn.ecrit)}</dd></div>
          </dl>
          <a class="fn-tab" href="#onglet-${fn.tab}">Onglet ${fn.tab} · ${esc(tabTitle(fn.tab))} <span aria-hidden="true">→</span></a>
        </li>`).join('')}
      </ol>
      <dl class="fiche-dl">
        <div><dt>Équivalent ukrainien</dt><dd>${inline(f.ukrainien)}</dd></div>
        <div><dt>Nuance</dt><dd>${inline(f.nuance)}</dd></div>
        <div class="dl-piege"><dt>Piège</dt><dd>${inline(f.piege)}</dd></div>
        <div class="dl-qc"><dt>Variante québécoise</dt><dd>${inline(f.varianteQC)}</dd></div>
        <div><dt>Expressions associées</dt><dd class="assoc">${f.associees.map(a => `<span>${esc(a)}</span>`).join('')}</dd></div>
        <div><dt>Réemploi</dt><dd class="assoc">${tabs.map(t => `<a href="#onglet-${t}">${t} · ${esc(tabTitle(t))}</a>`).join('')}</dd></div>
      </dl>
    </div>`;
  }

  /* ---------- Après affichage ---------- */
  function decorate(root) {
    $$('.it', root).forEach(el => {
      const it = ITEM_BY_ID.get(el.id);
      if (!it) return;
      const x = xrefs(it), f = ficheFor(it);
      if (!x.length && !f) return;
      const tools = document.createElement('span');
      tools.className = 'it-x';
      if (f) tools.insertAdjacentHTML('beforeend', `<button type="button" class="mini mini-f" data-fiche="${f.id}">Fiche</button>`);
      if (x.length) tools.insertAdjacentHTML('beforeend', `<button type="button" class="mini" data-xref="${it.id}" aria-label="Aussi dans ${x.length} autre${x.length > 1 ? 's' : ''} section${x.length > 1 ? 's' : ''}" title="Aussi ailleurs">↔ ${x.length}</button>`);
      el.appendChild(tools);
    });
  }

  function afterMount(view) {
    decorate(VIEW);
    applyHide();
    const m = view.match(/^onglet-(\d+)$/);
    if (m) {
      fillActivities(+m[1]);
      const toc = $('#toc');
      if (toc && window.matchMedia('(min-width: 1180px)').matches) toc.open = true;
    }
    if (view === 'fiches') {
      $$('.page-fiches .psec table tbody tr').forEach(tr => {
        const td = tr.firstElementChild;
        const f = td && FICHE.get(norm(td.textContent));
        if (f) td.innerHTML = `<button type="button" class="linkish" data-fiche="${f.id}">${td.innerHTML}</button>`;
      });
    }
  }

  /* ---------- Navigation latérale ---------- */
  function buildNav() {
    const link = (href, label, extra) => `<a href="#${href}" data-nav="${href}"${extra || ''}>${label}</a>`;
    $('#nav').innerHTML = `
      ${link('accueil', 'Accueil')}
      ${link('guide', "Mode d'emploi")}
      ${M.modules.map(m => `
        <div class="nav-mod mod-${m.id}">
          <p class="nav-h"><span class="mod-letter">${m.id}</span>${esc(m.title)}</p>
          ${m.tabs.map(t => link(`onglet-${t}`, `<span class="nav-n">${t}</span><span>${esc(tabTitle(t))}</span>`, ' class="nav-tab"')).join('')}
        </div>`).join('')}
      <div class="nav-mod">
        <p class="nav-h">Transversal</p>
        ${link('relier', 'Relier les onglets')}
        ${link('fiches', "Fiches d'expression")}
        ${link('regles', 'Règles transversales')}
        ${link('methode', 'Méthode et progression')}
      </div>`;
  }
  function setNavCurrent(view) {
    $$('#nav a').forEach(a => { if (a.dataset.nav === view) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  }

  /* ---------- Tiroir des règles ---------- */
  const DRAWER_EL = $('#drawer');
  function buildDrawer() {
    $('#drawer-body').innerHTML = DRAWER.html;
    $('#drawer-toc').innerHTML = DRAWER.toc.map(t => `<button type="button" data-rule="${t.id.replace(/^dr-/, '')}">${t.num ? `<span class="toc-n">${t.num}</span>` : ''}${esc(t.title)}</button>`).join('');
  }
  function openDrawer(rule) {
    DRAWER_EL.hidden = false;
    requestAnimationFrame(() => DRAWER_EL.classList.add('open'));
    $('#rules-btn').setAttribute('aria-expanded', 'true');
    document.body.classList.add('drawer-open');
    if (rule) {
      const el = document.getElementById('dr-' + rule);
      if (el) {
        const body = $('#drawer-body');
        body.scrollTo({ top: el.offsetTop - body.offsetTop - 8, behavior: reduceMotion() ? 'auto' : 'smooth' });
        flash(el);
      }
    } else $('#drawer-close').focus();
  }
  function closeDrawer() {
    DRAWER_EL.classList.remove('open');
    $('#rules-btn').setAttribute('aria-expanded', 'false');
    document.body.classList.remove('drawer-open');
    setTimeout(() => { if (!DRAWER_EL.classList.contains('open')) DRAWER_EL.hidden = true; }, 220);
  }

  /* ---------- Feuille modale (fiches, renvois) ---------- */
  const SHEET = $('#sheet');
  function openSheet(kicker, title, html) {
    $('#sheet-kicker').textContent = kicker;
    $('#sheet-title').innerHTML = title;
    $('#sheet-body').innerHTML = html;
    if (typeof SHEET.showModal === 'function') { if (!SHEET.open) SHEET.showModal(); } else SHEET.setAttribute('open', '');
    $('#sheet-body').scrollTop = 0;
  }
  function closeSheet() { if (SHEET.open) { if (typeof SHEET.close === 'function') SHEET.close(); else SHEET.removeAttribute('open'); } }
  function openFiche(fid) {
    const f = FICHE_BY_ID.get(fid);
    if (f) openSheet("Fiche d'expression", esc(f.expression), ficheHTML(f));
  }
  function openXref(iid) {
    const it = ITEM_BY_ID.get(iid);
    if (!it) return;
    const all = [it].concat(xrefs(it));
    const f = ficheFor(it);
    openSheet('Une expression, plusieurs chemins', `« ${esc(it.head || it.plain)} »`,
      `<p class="muted">Cette expression apparaît dans ${all.length} sections. Le contenu grammatical reste le même ; l’emploi change selon la fonction.</p>
       <ul class="xref">${all.map(o => `<li${o === it ? ' class="here"' : ''}><a href="${itemHref(o)}"><span class="xref-c">${esc(crumb(o))}${o === it ? ' <em>(ici)</em>' : ''}</span><span class="xref-t">${inline(o.raw, { static: true })}</span></a></li>`).join('')}</ul>
       ${f ? `<button type="button" class="btn" data-fiche="${f.id}">Ouvrir la fiche « ${esc(f.expression)} »</button>` : ''}`);
  }

  /* ---------- Recherche ---------- */
  const Q = $('#q'), RES = $('#results');
  let resIdx = -1;
  function search(q) {
    const nq = norm(q).replace(/[«»"]/g, '').trim();
    if (nq.length < 2) return [];
    const words = nq.split(' ');
    const out = [];
    INDEX.forEach(e => {
      if (!words.every(w => e.n.includes(w))) return;
      let sc = 0;
      if (e.keys && e.keys.includes(nq)) sc += 100;
      else if (e.keys && e.keys.some(k => k.startsWith(nq))) sc += 55;
      if (e.n.startsWith(nq)) sc += 25;
      if (e.kind === 'tab') sc += 45;
      if (e.kind === 'fiche') sc += 40;
      if (e.kind === 'sec' || e.kind === 'page') sc += 15;
      sc -= e.n.length / 40;
      out.push([sc, e]);
    });
    return out.sort((a, b) => b[0] - a[0]).slice(0, 40).map(x => x[1]);
  }
  function resultHTML(e, i) {
    const a = (href, t, c, extra) => `<a class="res" role="option" id="res-${i}" href="${href}"${extra || ''}><span class="res-t">${t}</span><span class="res-c">${c}</span></a>`;
    if (e.kind === 'item') return a(itemHref(e.it), inline(e.it.raw, { static: true }), esc(crumb(e.it)));
    if (e.kind === 'tab') return a(`#onglet-${e.tab}`, esc(tabTitle(e.tab)), `Onglet ${e.tab} · ${esc(S.tabs[e.tab].aim)}`);
    if (e.kind === 'sec') return a(`#onglet-${e.tab}--${e.sec.id}`, esc(e.sec.title), `Onglet ${e.tab} · section ${e.sec.num || ''}`);
    if (e.kind === 'page') return a(`#${e.page}--${e.sec.id}`, esc(e.sec.title), esc(S.pages[e.page].title));
    if (e.kind === 'fiche') return `<button type="button" class="res" role="option" id="res-${i}" data-fiche="${e.f.id}"><span class="res-t">${esc(e.f.expression)}</span><span class="res-c">Fiche · ${e.f.fonctions.map(x => esc(x.fonction)).join(' · ')}</span></button>`;
    return '';
  }
  function runSearch() {
    const q = Q.value;
    const r = search(q);
    resIdx = -1;
    if (!q.trim() || norm(q).length < 2) { RES.hidden = true; Q.setAttribute('aria-expanded', 'false'); return; }
    RES.innerHTML = r.length
      ? `<p class="res-n">${r.length === 40 ? '40 premiers résultats' : `${r.length} résultat${r.length > 1 ? 's' : ''}`}</p>${r.map(resultHTML).join('')}`
      : `<p class="res-none">Aucun résultat pour « ${esc(q)} ». Essayez sans accent ou avec un seul mot.</p>`;
    RES.hidden = false;
    Q.setAttribute('aria-expanded', 'true');
  }
  function moveRes(d) {
    const list = $$('.res', RES);
    if (!list.length) return;
    resIdx = (resIdx + d + list.length) % list.length;
    list.forEach((el, i) => el.classList.toggle('is-active', i === resIdx));
    list[resIdx].scrollIntoView({ block: 'nearest' });
    Q.setAttribute('aria-activedescendant', list[resIdx].id);
  }
  function closeSearch() {
    RES.hidden = true;
    Q.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('search-open');
  }

  /* ---------- Routage (#vue ou #vue--ancre) ---------- */
  let current = null;
  function flash(el) {
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 1800);
  }
  function route() {
    const raw = decodeURIComponent(location.hash.replace(/^#/, ''));
    let [view, anchor] = raw.split('--');
    if (!view) view = 'accueil';
    let m = view.match(/^onglet-(\d+)$/);
    const known = (m && S.tabs[+m[1]]) || S.pages[view] || view === 'accueil';
    if (!known) view = 'accueil';
    const changed = view !== current;
    if (changed) {
      clearInterval(TIMER); TIMER = null;
      if (current !== null && DRAWER_EL.classList.contains('open')) closeDrawer();
      let title;
      if (m && S.tabs[+m[1]]) { VIEW.innerHTML = viewTab(+m[1]); title = `${m[1]}. ${tabTitle(+m[1])}`; }
      else if (S.pages[view]) { VIEW.innerHTML = viewPage(view); title = S.pages[view].title; }
      else { VIEW.innerHTML = viewHome(); title = null; }
      current = view;
      document.title = title ? `${title} · Cadres de la phrase` : M.title;
      afterMount(view);
      setNavCurrent(view);
    }
    closeNav();
    closeSearch();
    closeSheet();
    $$('.it.force').forEach(el => el.classList.remove('force'));
    if (anchor) {
      const el = document.getElementById(anchor);
      if (el) {
        if (el.classList.contains('it')) el.classList.add('force');
        const det = el.closest('details');
        if (det) det.open = true;
        el.scrollIntoView({ block: el.classList.contains('it') ? 'center' : 'start', behavior: changed || reduceMotion() ? 'auto' : 'smooth' });
        flash(el);
        return;
      }
    }
    if (changed) { window.scrollTo(0, 0); VIEW.focus({ preventScroll: true }); }
  }

  /* ---------- Menu mobile et thème ---------- */
  function openNav() { document.body.classList.add('nav-open'); $('#scrim').hidden = false; $('#menu-btn').setAttribute('aria-expanded', 'true'); }
  function closeNav() { document.body.classList.remove('nav-open'); $('#scrim').hidden = true; $('#menu-btn').setAttribute('aria-expanded', 'false'); }
  function effectiveTheme() {
    const t = document.documentElement.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /* ---------- Événements ---------- */
  document.addEventListener('click', e => {
    const t = e.target.closest('button, a, [data-close]');
    if (!t) {
      if (!e.target.closest('#search')) closeSearch();
      return;
    }
    if (t.matches('[data-reg-toggle]')) {
      const c = t.dataset.regToggle;
      if (HIDDEN.has(c)) HIDDEN.delete(c); else HIDDEN.add(c);
      store.set('hidden', Array.from(HIDDEN));
      applyHide();
      return;
    }
    if (t.matches('[data-rule]')) { e.preventDefault(); openDrawer(t.dataset.rule); return; }
    if (t.matches('[data-fiche]')) { e.preventDefault(); closeSearch(); openFiche(t.dataset.fiche); return; }
    if (t.matches('[data-xref]')) { e.preventDefault(); openXref(t.dataset.xref); return; }
    if (t.matches('[data-demo]')) {
      const i = +t.dataset.demo;
      $$('[data-demo]').forEach(b => b.setAttribute('aria-selected', String(b === t)));
      const out = $('#demo-out');
      out.innerHTML = demoRow(i);
      out.setAttribute('aria-labelledby', t.id);
      return;
    }
    if (t.matches('[data-close]')) { closeSheet(); return; }
    if (t.id === 'menu-btn') { if (document.body.classList.contains('nav-open')) closeNav(); else openNav(); return; }
    if (t.id === 'rules-btn') { if (DRAWER_EL.classList.contains('open')) closeDrawer(); else openDrawer(); return; }
    if (t.id === 'drawer-close') { closeDrawer(); return; }
    if (t.id === 'search-btn') { document.body.classList.add('search-open'); Q.focus(); return; }
    if (t.id === 'theme-btn') {
      const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      store.set('theme', next);
      return;
    }
    if (t.tagName === 'A' && t.closest('#sheet') && t.getAttribute('href') === location.hash) { closeSheet(); route(); }
  });
  $('#scrim').addEventListener('click', closeNav);
  SHEET.addEventListener('click', e => { if (e.target === SHEET) closeSheet(); });

  Q.addEventListener('input', runSearch);
  Q.addEventListener('focus', () => { if (Q.value.trim()) runSearch(); });
  Q.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); moveRes(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); moveRes(-1); }
    else if (e.key === 'Enter') {
      const list = $$('.res', RES);
      const el = list[resIdx >= 0 ? resIdx : 0];
      if (el) { e.preventDefault(); el.click(); Q.blur(); }
    } else if (e.key === 'Escape') { closeSearch(); Q.blur(); }
  });
  RES.addEventListener('click', e => {
    const a = e.target.closest('a.res');
    if (!a) return;
    if (a.getAttribute('href') === location.hash) { e.preventDefault(); route(); }
    closeSearch();
    Q.blur();
  });
  document.addEventListener('keydown', e => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (e.key === '/' && !typing) { e.preventDefault(); document.body.classList.add('search-open'); Q.focus(); Q.select(); }
    else if (e.key === 'Escape') {
      if (DRAWER_EL.classList.contains('open')) closeDrawer();
      closeNav();
      closeSearch();
    }
  });
  window.addEventListener('hashchange', route);

  buildNav();
  buildDrawer();
  route();
})();
