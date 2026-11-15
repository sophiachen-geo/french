/* Métadonnées : modules, registres, situations, enchaînements, démonstration. */

SITE.set('title', 'Les cadres de la phrase et de la conversation');
SITE.set('subtitle', 'Construire, relier et développer ses idées en français — français standard et usages québécois');
SITE.set('objectif', "Apprendre à construire des phrases complexes, à relier spontanément ses idées et à participer à des conversations naturelles en français, particulièrement dans le contexte québécois.");

SITE.set('questions', [
  { q: "Qu'est-ce que je veux exprimer ?", d: 'Une cause, une conséquence, une opposition, une hypothèse, une précision…' },
  { q: 'Quelle construction me permet de l\'exprimer ?', d: 'Une préposition, une locution conjonctive, un pronom relatif, un marqueur discursif…' },
  { q: 'Comment le dirais-je naturellement ?', d: 'Dans une conversation quotidienne, une situation professionnelle ou un texte écrit.' }
]);

SITE.set('modules', [
  { id: 'A', title: 'Formuler et préciser', tabs: [1, 2] },
  { id: 'B', title: 'Relier des événements et des idées', tabs: [3, 4, 5, 6, 7, 8] },
  { id: 'C', title: 'Développer un raisonnement', tabs: [9, 10, 11] },
  { id: 'D', title: 'Converser et interagir', tabs: [12] }
]);

/* Registres : code → libellé et définition (Mode d'emploi, II.2). */
SITE.set('registres', [
  { code: 'C', label: 'Courant', def: "Naturel à l'oral et utilisable à l'écrit" },
  { code: 'O', label: 'Oral', def: 'Surtout employé dans la conversation' },
  { code: 'QC', label: 'Québec', def: 'Usage particulièrement courant ou caractéristique au Québec' },
  { code: 'F-QC', label: 'Familier québécois', def: 'Surtout dans des conversations informelles' },
  { code: 'S', label: 'Soutenu', def: 'Soutenu, administratif ou principalement écrit' },
  { code: 'R', label: 'À reconnaître', def: 'Utile à comprendre sans devoir le produire immédiatement' },
  { code: 'D', label: 'Déconseillé', def: "Déconseillé dans la langue standard ou l'écrit soigné" }
]);

SITE.set('priorites', [
  { id: 'essentielle', label: 'Essentielle', def: 'À automatiser pour parler spontanément.' },
  { id: 'developper', label: 'À développer', def: 'À utiliser pour produire des phrases plus complexes.' },
  { id: 'reconnaitre', label: 'À reconnaître', def: 'À comprendre dans les conversations ou les textes, sans obligation de production immédiate.' }
]);

/* Situations réelles (VIII.5) — utilisées pour tirer des consignes. */
SITE.set('situations', [
  'la vie quotidienne', 'le logement', 'le travail', 'les transports', 'les études',
  'les relations sociales', 'les démarches administratives', 'les discussions culturelles',
  'les opinions et les projets personnels'
]);

/* Enchaînements fréquents (VIII.6). Chaque étape renvoie à un onglet. */
SITE.set('chains', [
  { steps: [['Temps', 3], ['Cause', 4], ['Conséquence', 5]] },
  { steps: [['Opinion', 9], ['Justification', 4], ['Concession', 8]] },
  { steps: [['But', 6], ['Condition', 7], ['Moyen', 10]] },
  { steps: [['Description', 2], ['Précision', 10], ['Exemple', 10]] },
  { steps: [['Hypothèse', 7], ['Conséquence possible', 5], ['Réserve', 8]] },
  { steps: [['Reformulation', 11], ['Conclusion', 11]] }
]);

/* Démonstration « J'ai déménagé » (II.1). Le segment entre {…} est la construction. */
SITE.set('demo', {
  situation: "J'ai déménagé.",
  rows: [
    { intention: 'Temps', construction: 'depuis que', tab: 3, phrase: "{Depuis que} j'ai déménagé, je prends le métro." },
    { intention: 'Cause', construction: 'parce que', tab: 4, phrase: "J'ai déménagé {parce que} mon logement était trop petit." },
    { intention: 'Conséquence', construction: 'fait que [F-QC]', tab: 5, phrase: "Mon logement était trop petit, {fait que} j'ai déménagé." },
    { intention: 'But', construction: 'pour', tab: 6, phrase: "J'ai déménagé {pour} me rapprocher du travail." },
    { intention: 'Condition', construction: 'si', tab: 7, phrase: "{Si} je trouve un meilleur appartement, je déménagerai encore." },
    { intention: 'Concession', construction: 'même si', tab: 8, phrase: "J'ai déménagé {même si} j'aimais mon quartier." },
    { intention: 'Précision', construction: 'dont', tab: 2, phrase: "L'appartement {dont} je t'ai parlé est finalement disponible." },
    { intention: 'Mise en relief', construction: "ce qui… c'est", tab: 1, phrase: "{Ce qui} m'intéresse, {c'est} la proximité du métro." }
  ]
});

/* Les neuf étapes d'activités (V), communes à tous les onglets. */
SITE.set('etapes', [
  { n: 1, titre: 'Comprendre', objectif: 'Reconnaître la relation exprimée', activite: 'Associer une intention à une expression' },
  { n: 2, titre: 'Observer', objectif: 'Comprendre la construction', activite: 'Repérer les éléments de la phrase' },
  { n: 3, titre: 'Construire', objectif: 'Produire une phrase correcte', activite: 'Compléter oralement une structure' },
  { n: 4, titre: 'Transformer', objectif: 'Varier la formulation', activite: 'Dire la même idée autrement' },
  { n: 5, titre: 'Relier', objectif: 'Combiner plusieurs fonctions', activite: 'Fusionner deux ou trois propositions' },
  { n: 6, titre: 'Converser', objectif: 'Employer la construction spontanément', activite: 'Répondre à une question ouverte' },
  { n: 7, titre: 'Reconnaître le québécois', objectif: 'Comprendre une variante familière', activite: 'Écouter et interpréter une phrase' },
  { n: 8, titre: 'Adapter le registre', objectif: 'Choisir une formulation selon le contexte', activite: 'Passer du familier au neutre ou au soutenu' },
  { n: 9, titre: 'Réemployer', objectif: "Consolider l'apprentissage", activite: 'Réutiliser la construction dans un autre onglet' }
]);
