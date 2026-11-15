/* Visualisations des cadres — schémas SVG générés à partir de descriptions simples
   (content/visuels.js). Utilisable partout : window.VIZ.render(spec, options).

   Convention de couleurs :
     orange (cadre)  = l'action introduite par l'expression (le « cadre »)
     violet (main)   = la phrase principale
   Axe horizontal : x de 0 à 100 ; sur une frise, aujourd'hui = 50.

   Types :
     rows   — lignes « expression | schéma » (frises, relations, flèches, jauges)
     map    — correspondances « A → B » (verbe + préposition → relatif…)
     grid   — tableau de colonnes (échelle de registre, nom / infinitif / proposition)
     columns— colonnes de listes (modes verbaux…)                                     */
(function () {
  'use strict';

  const CSS = `
.vz { --vz-main:#6a5be2; --vz-main-soft:#ecebff; --vz-cadre:#e0603a; --vz-cadre-soft:#fde8df;
  --vz-muted:#8b91a3; --vz-muted-soft:#eef0f4; --vz-pos:#1d8a58; --vz-pos-soft:#ddf3e8; --vz-neg:#c43d2b; --vz-neg-soft:#fbe4e0;
  --vz-grid:#d7dbe5; --vz-ink:#1c2233; --vz-sub:#6b7286; --vz-bg:transparent;
  container-type:inline-size; margin:0 0 20px; color:var(--vz-ink); font-family:inherit; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) .vz {
  --vz-main:#a79cff; --vz-main-soft:#28244a; --vz-cadre:#ff8a65; --vz-cadre-soft:#3b231b; --vz-muted:#8f97ab; --vz-muted-soft:#232a3a;
  --vz-pos:#62d39c; --vz-pos-soft:#15332a; --vz-neg:#ff8d7e; --vz-neg-soft:#3a1d1d; --vz-grid:#2e3549; --vz-ink:#e7eaf2; --vz-sub:#98a0b4; } }
:root[data-theme="dark"] .vz {
  --vz-main:#a79cff; --vz-main-soft:#28244a; --vz-cadre:#ff8a65; --vz-cadre-soft:#3b231b; --vz-muted:#8f97ab; --vz-muted-soft:#232a3a;
  --vz-pos:#62d39c; --vz-pos-soft:#15332a; --vz-neg:#ff8d7e; --vz-neg-soft:#3a1d1d; --vz-grid:#2e3549; --vz-ink:#e7eaf2; --vz-sub:#98a0b4; }
.vz-t { margin:0 0 4px; font-weight:700; font-size:1.02em; }
.vz-i { margin:0 0 10px; color:var(--vz-sub); font-size:.88em; }
.vz-leg { display:flex; flex-wrap:wrap; gap:6px 18px; margin:0 0 8px; font-size:.8em; color:var(--vz-sub); }
.vz-leg span { display:inline-flex; align-items:center; gap:7px; }
.vz-leg i { width:18px; height:9px; border-radius:5px; border:1.5px solid var(--c); background:var(--cs); }
.vz-rows { display:grid; }
.vz-row { display:grid; grid-template-columns:minmax(0,1fr); gap:0 16px; padding:6px 0; border-top:1px solid color-mix(in srgb, var(--vz-grid) 55%, transparent); }
.vz-row:first-child { border-top:0; }
.vz-head { padding:0 0 2px; border-top:0; }
.vz-head .vz-l { display:none; }
.vz-l { display:grid; align-content:center; min-width:0; line-height:1.25; }
.vz-e { font-weight:700; color:inherit; text-decoration:none; }
a.vz-e:hover { text-decoration:underline; }
.vz-s { font-size:.8em; color:var(--vz-sub); }
.vz-x { font-size:.8em; font-style:italic; color:var(--vz-ink); opacity:.85; margin-top:2px; }
.vz-d { min-width:0; }
.vz-svg { display:block; width:100%; max-width:27rem; height:auto; overflow:visible; }
.vz-axis { position:relative; height:1.4em; max-width:27rem; font-size:.78em; color:var(--vz-sub); }
.vz-axis span { position:absolute; transform:translateX(-50%); white-space:nowrap; top:0; }
.vz-axis span:first-child { transform:none; }
.vz-axis span:last-child:not(:first-child) { transform:translateX(-100%); }
@container (min-width: 430px) {
  .vz-row { grid-template-columns:minmax(8.5rem,36%) minmax(0,1fr); align-items:center; padding:4px 0; }
  .vz-head .vz-l { display:block; }
}
.vz-svg text { fill:currentColor; font-size:8.4px; font-weight:600; font-family:inherit; }
.vz-svg .vz-small { font-size:7px; font-weight:600; }
.c-main { --c:var(--vz-main); --cs:var(--vz-main-soft); }
.c-cadre { --c:var(--vz-cadre); --cs:var(--vz-cadre-soft); }
.c-muted { --c:var(--vz-muted); --cs:var(--vz-muted-soft); }
.c-pos { --c:var(--vz-pos); --cs:var(--vz-pos-soft); }
.c-neg { --c:var(--vz-neg); --cs:var(--vz-neg-soft); }
.vz-base { stroke:var(--vz-grid); stroke-width:1; }
.vz-today { stroke:var(--vz-muted); stroke-width:1; stroke-dasharray:3 3; }
.vz-svg .s { stroke:var(--c); fill:none; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
.vz-svg .f { fill:var(--c); stroke:none; }
.vz-svg .sf { stroke:var(--c); fill:var(--cs); stroke-width:1.4; }
.vz-svg .d { stroke-dasharray:3.5 2.5; }
.vz-svg .gap { stroke:var(--vz-muted); stroke-width:1; stroke-dasharray:2.5 2; fill:none; }
.vz-svg .gaph { fill:var(--vz-muted); }
.vz-svg .tc { fill:var(--c); }
.vz-svg .ti { fill:var(--vz-ink); }
.vz-map .vz-row { grid-template-columns:minmax(0,1fr); }
.vz-m { display:flex; flex-wrap:wrap; align-items:center; gap:4px 10px; }
.vz-m b { color:var(--vz-cadre); }
.vz-from, .vz-to { padding:3px 9px; border-radius:7px; border:1.5px solid var(--c); background:var(--cs); }
.vz-arr { color:var(--vz-sub); font-weight:700; }
.vz-note { flex-basis:100%; font-size:.8em; color:var(--vz-sub); }
@container (min-width: 430px) {
  .vz-map .vz-row { grid-template-columns:minmax(0,1fr); }
  .vz-m { flex-wrap:nowrap; }
  .vz-note { flex-basis:auto; margin-left:auto; text-align:right; }
}
.vz-grid { overflow-x:auto; }
.vz-g { display:grid; gap:4px; min-width:30rem; font-size:.9em; }
.vz-gh, .vz-gr { display:grid; grid-template-columns:var(--cols); gap:6px; align-items:center; }
.vz-gh { font-size:.74em; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:var(--vz-sub); padding-bottom:6px; }
.vz-scale { height:6px; border-radius:3px; margin:0 0 8px; background:linear-gradient(90deg, var(--vz-cadre), var(--vz-muted), var(--vz-main)); }
.vz-gr { padding:5px 0; border-top:1px solid color-mix(in srgb, var(--vz-grid) 55%, transparent); }
.vz-th { font-size:.78em; color:var(--vz-sub); font-weight:700; }
.vz-cell { padding:3px 8px; border-radius:6px; background:var(--cs); border:1px solid color-mix(in srgb, var(--c) 45%, transparent); justify-self:start; }
.vz-cols { display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 12rem), 1fr)); gap:10px; }
.vz-col { border-radius:10px; padding:12px 14px; background:var(--cs); border:1.5px solid color-mix(in srgb, var(--c) 50%, transparent); }
.vz-col h4 { margin:0 0 2px; color:var(--c); font-size:1em; }
.vz-col p { margin:0 0 8px; font-size:.82em; color:var(--vz-sub); }
.vz-col ul { margin:0; padding:0; list-style:none; display:flex; flex-wrap:wrap; gap:5px; }
.vz-col li { font-size:.86em; background:color-mix(in srgb, var(--cs) 40%, white 0%); border:1px solid color-mix(in srgb, var(--c) 35%, transparent); border-radius:5px; padding:1px 7px; }
`;

  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  /* Mini-markdown : **gras** (couleur cadre), *italique* */
  const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(^|[^*])\*(?=\S)(.+?)\*(?!\*)/g, '$1<i>$2</i>');

  function injectCSS() {
    if (document.getElementById('vz-css')) return;
    const s = document.createElement('style');
    s.id = 'vz-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  const X = x => +(8 + x * 1.84).toFixed(2);              // 0..100 → 8..192 (viewBox 200)
  const pct = x => +(X(x) / 2).toFixed(2);                 // position en % de la largeur

  function head(x, y, dir, cls) {
    const b = x - dir * 6;
    return `<path class="f ${cls}" d="M${x} ${y} L${b} ${y - 4} L${b} ${y + 4} Z"/>`;
  }

  function mark(m, Y) {
    const c = 'c-' + (m.c || 'main');
    const y = Y(m.lane || 0);
    const d = m.dashed ? ' d' : '';
    switch (m.k) {
      case 'point': {
        const solid = m.fill ? m.fill === 'solid' : (m.c || 'main') === 'main';
        return solid
          ? `<circle class="f ${c}" cx="${X(m.x)}" cy="${y}" r="3.6"/>`
          : `<circle class="sf ${c}${d}" cx="${X(m.x)}" cy="${y}" r="4.6"/>`;
      }
      case 'line':
        return `<line class="s ${c}${d}" x1="${X(m.x1)}" x2="${X(m.x2)}" y1="${y}" y2="${y}"/>`;
      case 'arrow': {
        const dir = m.x2 >= m.x1 ? 1 : -1;
        const end = X(m.x2);
        return `<line class="s ${c}${d}" x1="${X(m.x1)}" x2="${end - dir * 4}" y1="${y}" y2="${y}"/>${head(end, y, dir, c)}`;
      }
      case 'bar': {
        const x1 = X(Math.min(m.x1, m.x2)), w = Math.abs(X(m.x2) - X(m.x1));
        return `<rect class="sf ${c}${d}" x="${x1}" y="${y - 4.5}" width="${w}" height="9" rx="4.5"/>`;
      }
      case 'box': {
        const x1 = X(Math.min(m.x1, m.x2)), w = Math.abs(X(m.x2) - X(m.x1));
        let s = `<rect class="sf ${c}${d}" x="${x1}" y="${y - 8}" width="${w}" height="16" rx="4"/>`;
        if (m.text) s += `<text class="ti" x="${x1 + w / 2}" y="${y + 3}" text-anchor="middle">${esc(m.text)}</text>`;
        if (m.cross) s += `<path class="s c-neg" style="opacity:.75" d="M${x1 + 3} ${y - 6} L${x1 + w - 3} ${y + 6} M${x1 + w - 3} ${y - 6} L${x1 + 3} ${y + 6}"/>`;
        return s;
      }
      case 'tick':
        return `<line class="s ${c}" style="stroke-width:2.4" x1="${X(m.x)}" x2="${X(m.x)}" y1="${y - 8}" y2="${y + 8}"/>`;
      case 'wall':
        return `<rect class="f ${c}" x="${X(m.x) - 2.2}" y="${y - 12}" width="4.4" height="24" rx="1.5"/>${m.text ? `<text class="tc ${c} vz-small" x="${X(m.x)}" y="${y - 14}" text-anchor="middle">${esc(m.text)}</text>` : ''}`;
      case 'gap': {
        const gy = y - 11, a = X(m.x1), b = X(m.x2);
        return `<line class="gap" x1="${a + 3}" x2="${b - 3}" y1="${gy}" y2="${gy}"/><path class="gaph" d="M${a} ${gy} l4 -2.6 v5.2 Z M${b} ${gy} l-4 -2.6 v5.2 Z"/>${m.text ? `<text class="vz-small" x="${(a + b) / 2}" y="${gy - 3}" text-anchor="middle" style="fill:var(--vz-sub)">${esc(m.text)}</text>` : ''}`;
      }
      case 'sign': {
        const cc = m.c ? c : (m.text === '+' ? 'c-pos' : m.text === '−' || m.text === '×' ? 'c-neg' : 'c-muted');
        return `<circle class="sf ${cc}" cx="${X(m.x)}" cy="${y}" r="6.2"/><text class="tc ${cc}" x="${X(m.x)}" y="${y + 3}" text-anchor="middle" style="font-size:9px;font-weight:800">${esc(m.text)}</text>`;
      }
      case 'cross': {
        const x = X(m.x);
        return `<path class="s c-neg" style="stroke-width:2.2" d="M${x - 4.5} ${y - 4.5} L${x + 4.5} ${y + 4.5} M${x + 4.5} ${y - 4.5} L${x - 4.5} ${y + 4.5}"/>`;
      }
      case 'flag': {
        const x = X(m.x);
        let s = `<line class="s ${c}" x1="${x}" x2="${x}" y1="${y + 9}" y2="${y - 10}"/><path class="sf ${c}${d}" d="M${x} ${y - 10} L${x + 11} ${y - 6} L${x} ${y - 2} Z"/>`;
        if (m.cross) s += `<path class="s c-neg" style="stroke-width:2.2" d="M${x - 5} ${y - 9} L${x + 9} ${y + 5} M${x + 9} ${y - 9} L${x - 5} ${y + 5}"/>`;
        return s;
      }
      case 'person':
        return `<circle class="sf ${c}" cx="${X(m.x)}" cy="${y}" r="7.5"/><text class="tc ${c}" x="${X(m.x)}" y="${y + 2.8}" text-anchor="middle" style="font-size:7.4px;font-weight:800">${esc(m.text || '')}</text>`;
      case 'tag': {
        const w = Math.max(16, (m.text || '').length * 4.6 + 8), x = X(m.x);
        return `<rect class="sf ${c}" x="${x - w / 2}" y="${y - 6.5}" width="${w}" height="13" rx="6.5"/><text class="tc ${c} vz-small" x="${x}" y="${y + 2.5}" text-anchor="middle">${esc(m.text)}</text>`;
      }
      case 'text':
        return `<text class="tc ${c} vz-small" x="${X(m.x)}" y="${y + (m.dy || 3)}" text-anchor="${m.anchor || 'middle'}">${esc(m.text)}</text>`;
      default:
        return '';
    }
  }

  function rowSVG(row, spec) {
    const lanes = spec.lanes || 1;
    const H = lanes === 2 ? 40 : 32;
    const Y = lane => lanes === 2 ? (lane === 1 ? 28 : 12) : 17;
    let g = '';
    if (spec.baseline !== false && !spec.flow) {
      for (let l = 0; l < lanes; l++) g += `<line class="vz-base" x1="0" x2="200" y1="${Y(l)}" y2="${Y(l)}"/>`;
    }
    if (spec.axis && spec.axis.today != null) g += `<line class="vz-today" x1="${X(spec.axis.today)}" x2="${X(spec.axis.today)}" y1="0" y2="${H}"/>`;
    (row.marks || []).forEach(m => { g += mark(m, Y); });
    const label = `${row.label}${row.sub ? ' : ' + row.sub : ''}`;
    return `<svg class="vz-svg" viewBox="0 0 200 ${H}" role="img" aria-label="${esc(label)}">${g}</svg>`;
  }

  function legendHTML(spec) {
    if (!spec.legend) return '';
    const items = spec.legend === true ? [['cadre', 'action du cadre'], ['main', 'phrase principale']] : spec.legend;
    return `<p class="vz-leg">${items.map(([c, t]) => `<span class="c-${c}"><i></i>${esc(t)}</span>`).join('')}</p>`;
  }

  function renderRows(spec, o) {
    const axis = spec.axis;
    const labels = axis && (axis.labels || (axis.today != null ? [[18, 'passé'], [axis.today, 'aujourd’hui'], [88, 'futur']] : null));
    const headRow = labels ? `<div class="vz-row vz-head"><div class="vz-l"></div><div class="vz-d"><div class="vz-axis">${labels.map(([x, t]) => `<span style="left:${pct(x)}%">${esc(t)}</span>`).join('')}</div></div></div>` : '';
    const rows = spec.rows.map(r => {
      const href = o.link ? o.link(r, spec) : null;
      const e = href ? `<a class="vz-e" href="${esc(href)}">${md(r.label)}</a>` : `<span class="vz-e">${md(r.label)}</span>`;
      return `<div class="vz-row"><div class="vz-l">${e}${r.sub ? `<span class="vz-s">${md(r.sub)}</span>` : ''}${o.examples && r.ex ? `<span class="vz-x">${md(r.ex)}</span>` : ''}</div><div class="vz-d">${rowSVG(r, spec)}</div></div>`;
    }).join('');
    return `${legendHTML(spec)}<div class="vz-rows">${headRow}${rows}</div>`;
  }

  function renderMap(spec, o) {
    return `${legendHTML(spec)}<div class="vz-rows">${spec.rows.map(r => {
      const href = o.link ? o.link(r, spec) : null;
      const to = href ? `<a class="vz-to c-${r.c || 'cadre'}" href="${esc(href)}">${md(r.to)}</a>` : `<span class="vz-to c-${r.c || 'cadre'}">${md(r.to)}</span>`;
      return `<div class="vz-row"><div class="vz-m"><span class="vz-from c-${r.cf || 'main'}">${md(r.from)}</span><span class="vz-arr" aria-hidden="true">→</span>${to}${r.note ? `<span class="vz-note">${md(r.note)}</span>` : ''}</div></div>`;
    }).join('')}</div>`;
  }

  function renderGrid(spec) {
    const n = spec.cols.length;
    const cols = `${spec.themes === false ? '' : '7rem '}repeat(${n}, minmax(0, 1fr))`;
    const tones = spec.tones || [];
    return `<div class="vz-grid"><div class="vz-g" style="--cols:${cols}">
      ${spec.scale ? `<div class="vz-gh" style="padding:0"><span></span><div class="vz-scale" style="grid-column:span ${n}"></div></div>` : ''}
      <div class="vz-gh">${spec.themes === false ? '' : '<span></span>'}${spec.cols.map(c => `<span>${esc(c)}</span>`).join('')}</div>
      ${spec.rows.map(r => `<div class="vz-gr">${spec.themes === false ? '' : `<span class="vz-th">${md(r.theme || '')}</span>`}${r.cells.map((c, i) => c ? `<span class="vz-cell c-${tones[i] || 'muted'}">${md(c)}</span>` : '<span></span>').join('')}</div>`).join('')}
    </div></div>`;
  }

  function renderColumns(spec) {
    return `<div class="vz-cols">${spec.cols.map(c => `<div class="vz-col c-${c.c || 'muted'}"><h4>${md(c.title)}</h4>${c.sub ? `<p>${md(c.sub)}</p>` : ''}<ul>${c.items.map(i => `<li>${md(i)}</li>`).join('')}</ul></div>`).join('')}</div>`;
  }

  function render(spec, o) {
    injectCSS();
    o = o || {};
    let body = '';
    if (spec.type === 'map') body = renderMap(spec, o);
    else if (spec.type === 'grid') body = renderGrid(spec, o);
    else if (spec.type === 'columns') body = renderColumns(spec, o);
    else body = renderRows(spec, o);
    const title = o.title === false ? '' : (spec.title ? `<p class="vz-t">${md(spec.title)}</p>` : '');
    const intro = o.title === false || !spec.intro ? '' : `<p class="vz-i">${md(spec.intro)}</p>`;
    return `<figure class="vz vz-${spec.type || 'rows'}"${spec.id ? ` id="vz-${esc(spec.id)}"` : ''}>${title}${intro}${body}</figure>`;
  }

  /* Accès pratique : schémas d'un onglet, schéma par id */
  function forTab(tab) { return (window.SITE && SITE.meta.visuels || []).filter(v => v.tab === tab); }
  function byId(id) { return (window.SITE && SITE.meta.visuels || []).find(v => v.id === id) || null; }

  window.VIZ = { render, forTab, byId, md, injectCSS };
})();
