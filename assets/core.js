/* Les cadres — noyau de données (sans DOM).
   Analyse le contenu (content/*.js), produit le HTML des onglets et l'index,
   et expose le tout sur window.CADRES pour le site et les prototypes. */
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


  /* Lien vers le site principal depuis une sous-page (prototypes) : window.CADRES_BASE = '../../' */
  const siteLink = hash => (window.CADRES_BASE ? window.CADRES_BASE + 'reference/index.html' : '') + hash;
  /* Expression d'un onglet retrouvée par sa clé (« parce que », « bien que »…). */
  const findItem = (key, tab) => { const l = BY_KEY.get(norm(key)) || []; return l.find(it => !tab || it.tab === tab) || null; };

  window.CADRES = { S, M, TAB_IDS, MOD, $, $$, esc, norm, slug, uniq, pick, shuffle, store, reduceMotion, tabTitle, REG, regCls, parseTag, badge, tagHTML, CONS_RE, consKind, RULE_FOR, consHTML, frSpace, inline, analyse, parseBlocks, sectionize, renderBlocks, renderTabData, renderPageData, widget, chainsHTML, TABS, ITEMS, ITEM_BY_ID, BY_KEY, PAGES, DRAWER, FICHE, FICHE_BY_ID, ficheFor, xrefs, crumb, itemHref, INDEX, siteLink, findItem };
})();
