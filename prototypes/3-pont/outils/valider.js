/* Vérifie la banque de l'atelier de ponts.
   Usage : node prototypes/3-pont/outils/valider.js [fichier-banque.js ...]
   Sans argument : tous les fichiers de prototypes/3-pont/banque/. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const dir = path.join(__dirname, '..');
const ctx = { window: {} }; ctx.window.window = ctx.window; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(dir, 'catalogue.js'), 'utf8'), ctx);
const A = ctx.window.ATELIER;
let files = process.argv.slice(2);
if (!files.length) files = fs.readdirSync(path.join(dir, 'banque')).filter(f => f.endsWith('.js')).map(f => path.join(dir, 'banque', f));
const owner = {};
for (const f of files) {
  const before = A.banque.length;
  try { vm.runInContext(`window.ATELIER = window.ATELIER;` + fs.readFileSync(f, 'utf8').replace(/\bATELIER\./g, 'window.ATELIER.'), ctx); }
  catch (e) { console.log('ERREUR de syntaxe dans', f, ':', e.message); process.exitCode = 1; continue; }
  A.banque.slice(before).forEach(it => { owner[it.id] = path.basename(f); });
}
const P = A.ponts, L = new Set(A.liens.map(l => l.id));
const errs = [], warns = [], ids = new Set(), okCount = {}, nonCount = {};
const relsInFiles = new Set();
const checkS = (s, where) => {
  if (typeof s !== 'string' || !s.trim()) { errs.push(`${where} : phrase vide`); return; }
  if (!/\{[^}]+\}/.test(s)) errs.push(`${where} : le connecteur doit être entre {…} : ${s}`);
  if (/[<>]/.test(s) && !/<[^>]*\{[^}]+\}[^>]*>/.test(s) && !/<[^>]+>/.test(s)) errs.push(`${where} : balise < > mal fermée`);
  const opens = (s.match(/</g) || []).length, closes = (s.match(/>/g) || []).length;
  if (opens !== closes) errs.push(`${where} : nombre de < et > différent`);
  if ((s.match(/\[/g) || []).length !== (s.match(/\]/g) || []).length) errs.push(`${where} : crochets [ ] mal fermés`);
  if (!/[.!?»]\s*$/.test(s.replace(/[\]>]+$/, ''))) warns.push(`${where} : la phrase ne finit pas par une ponctuation`);
};
for (const it of A.banque) {
  const w = it.id || '(sans id)';
  if (!it.id) errs.push('Un élément n’a pas d’id');
  if (ids.has(it.id)) errs.push(`id en double : ${it.id}`); ids.add(it.id);
  if (!L.has(it.rel)) errs.push(`${w} : lien inconnu « ${it.rel} »`);
  relsInFiles.add(it.rel);
  for (const k of ['a', 'b']) if (typeof it[k] !== 'string' || !/[.!?]$/.test(it[k].trim())) errs.push(`${w} : la phrase ${k} doit être une phrase complète`);
  for (const k of ['as', 'bs']) if (typeof it[k] !== 'string' || !it[k].trim() || it[k].length > 18) errs.push(`${w} : ${k} doit faire 1 à 18 caractères (« ${it[k]} »)`);
  if (!Array.isArray(it.ok) || it.ok.length < 1 || it.ok.length > 2) errs.push(`${w} : ok doit contenir 1 ou 2 ponts`);
  if (!Array.isArray(it.non) || it.non.length < 2 || it.non.length > 3) errs.push(`${w} : non doit contenir 2 ou 3 ponts`);
  const all = [...(it.ok || []), ...(it.non || [])].map(x => x.p);
  if (new Set(all).size !== all.length) errs.push(`${w} : un même pont apparaît deux fois dans les choix`);
  (it.ok || []).forEach((o, i) => {
    if (!P[o.p]) { errs.push(`${w} ok[${i}] : pont inconnu « ${o.p} »`); return; }
    if (P[o.p].rel !== it.rel) errs.push(`${w} ok[${i}] : « ${o.p} » est un pont de type ${P[o.p].rel}, pas ${it.rel}`);
    if (o.c !== 'a' && o.c !== 'b') errs.push(`${w} ok[${i}] : c doit valoir 'a' ou 'b'`);
    checkS(o.s, `${w} ok[${i}]`);
    okCount[o.p] = (okCount[o.p] || 0) + 1;
  });
  let sameRel = 0;
  (it.non || []).forEach((o, i) => {
    if (!P[o.p]) { errs.push(`${w} non[${i}] : pont inconnu « ${o.p} »`); return; }
    if (P[o.p].rel === it.rel) { sameRel++; if (!o.why || o.why.length < 25) errs.push(`${w} non[${i}] : « ${o.p} » est du même type ; « why » doit expliquer précisément pourquoi il ne va pas`); }
    if (o.why != null && typeof o.why !== 'string') errs.push(`${w} non[${i}] : why doit être un texte`);
    nonCount[o.p] = (nonCount[o.p] || 0) + 1;
  });
  if (sameRel < 1) warns.push(`${w} : aucun distracteur du même type (le choix du pont est trop facile)`);
  if (!it.back || !P[it.back.p]) errs.push(`${w} : back.p manquant ou inconnu`);
  else {
    if (it.back.c !== 'a' && it.back.c !== 'b') errs.push(`${w} back : c doit valoir 'a' ou 'b'`);
    checkS(it.back.s, `${w} back`);
    if (!it.back.fn || it.back.fn.length < 15) errs.push(`${w} back : fn doit expliquer ce qui change`);
  }
}
const relsChecked = process.argv.length > 2 ? relsInFiles : L;
const missing = Object.keys(P).filter(k => relsChecked.has(P[k].rel) && !okCount[k]);
console.log(`${A.banque.length} paires, ${Object.keys(okCount).length} ponts utilisés comme bonne réponse.`);
const byRel = {}; A.banque.forEach(it => { byRel[it.rel] = (byRel[it.rel] || 0) + 1; });
console.log('Par lien :', JSON.stringify(byRel));
if (missing.length) { console.log(`\nPONTS JAMAIS UTILISÉS COMME BONNE RÉPONSE (${missing.length}) : ${missing.join(', ')}`); process.exitCode = 1; }
if (errs.length) { console.log(`\nERREURS (${errs.length}) :`); errs.forEach(e => console.log(' - ' + e)); process.exitCode = 1; }
if (warns.length) { console.log(`\nAvertissements (${warns.length}) :`); warns.slice(0, 40).forEach(e => console.log(' - ' + e)); }
if (!errs.length && !missing.length) console.log('\nOK : banque valide.');
