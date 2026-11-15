/* Schémas visuels, par onglet. Rendu : assets/viz.js (window.VIZ.render).
   Couleurs : 'cadre' (orange) = action introduite par l'expression ; 'main' (violet) = phrase principale.
   x de 0 à 100 ; sur les frises, aujourd'hui = 50.
   Marques : point, line, arrow, bar, box, tick, wall, gap, sign, cross, flag, person, tag, text. */

SITE.set('visuels', [

  /* ---------- Onglet 1 : introduire un sujet, mettre en relief ---------- */
  {
    id: 'relief', tab: 1, title: 'Annoncer le sujet, puis dire ce qu’on en pense',
    intro: 'Le cadre (orange) pose le thème ; la suite (violet) apporte ce qui compte.',
    flow: true, legend: [['cadre', 'thème mis en avant'], ['main', 'ce qu’on en dit']],
    rows: [
      { label: 'Pour ce qui est de…', sub: 'délimiter le sujet', ex: 'Pour ce qui est du logement, j’ai trouvé.',
        marks: [{ k: 'box', x1: 0, x2: 44, c: 'cadre', text: 'du logement' }, { k: 'arrow', x1: 47, x2: 55, c: 'muted' }, { k: 'box', x1: 58, x2: 100, text: 'j’ai trouvé' }] },
      { label: 'Ce qui…, c’est…', sub: 'mise en relief', ex: 'Ce qui me dérange, c’est le bruit.',
        marks: [{ k: 'box', x1: 0, x2: 50, c: 'cadre', text: 'ce qui me dérange' }, { k: 'sign', x: 59, text: '=', c: 'muted' }, { k: 'box', x1: 68, x2: 100, text: 'le bruit' }] },
      { label: 'Le problème, c’est que…', sub: 'nommer la difficulté', ex: 'Le problème, c’est que c’est loin.',
        marks: [{ k: 'box', x1: 0, x2: 40, c: 'cadre', text: 'le problème' }, { k: 'sign', x: 49, text: '=', c: 'muted' }, { k: 'box', x1: 58, x2: 100, text: 'c’est loin' }] },
      { label: 'Quant à…', sub: 'passer à un autre thème', ex: 'Mon frère reste. Quant à moi, je pars.',
        marks: [{ k: 'box', x1: 0, x2: 34, c: 'muted', text: 'mon frère', dashed: true }, { k: 'arrow', x1: 36, x2: 46, c: 'muted' }, { k: 'box', x1: 49, x2: 72, c: 'cadre', text: 'moi' }, { k: 'box', x1: 75, x2: 100, text: 'je pars' }] }
    ]
  },
  {
    id: 'ce-quoi', tab: 1, type: 'map', title: 'Verbe + préposition → « ce + pronom »',
    intro: 'La préposition exigée par le verbe choisit la forme.',
    rows: [
      { from: 'ça **m’intéresse** (sujet)', to: '**Ce qui** m’intéresse, c’est…' },
      { from: 'je **veux** quelque chose (complément direct)', to: '**Ce que** je veux, c’est…' },
      { from: 'avoir besoin **de**', to: '**Ce dont** j’ai besoin, c’est…' },
      { from: 'penser **à**', to: '**Ce à quoi** je pense, c’est…' },
      { from: 'travailler **sur**', to: '**Ce sur quoi** je travaille, c’est…' },
      { from: 'croire **en**', to: '**Ce en quoi** je crois, c’est…' }
    ]
  },

  /* ---------- Onglet 2 : décrire avec les relatifs ---------- */
  {
    id: 'relatives', tab: 2, title: 'La relative s’accroche au nom',
    intro: 'Le nom (violet) reçoit une information (orange) sans être répété.',
    flow: true, legend: [['main', 'le nom'], ['cadre', 'la relative']],
    rows: [
      { label: 'qui', sub: 'sujet du verbe', ex: 'La collègue qui parle cinq langues.',
        marks: [{ k: 'box', x1: 0, x2: 34, text: 'la collègue' }, { k: 'line', x1: 34, x2: 40, c: 'muted' }, { k: 'box', x1: 40, x2: 100, c: 'cadre', text: 'qui parle cinq langues' }] },
      { label: 'que', sub: 'complément direct', ex: 'Le film que j’ai vu.',
        marks: [{ k: 'box', x1: 0, x2: 34, text: 'le film' }, { k: 'line', x1: 34, x2: 40, c: 'muted' }, { k: 'box', x1: 40, x2: 100, c: 'cadre', text: 'que j’ai vu' }] },
      { label: 'dont', sub: 'verbe + de', ex: 'Le quartier dont je t’ai parlé.',
        marks: [{ k: 'box', x1: 0, x2: 34, text: 'le quartier' }, { k: 'line', x1: 34, x2: 40, c: 'muted' }, { k: 'box', x1: 40, x2: 100, c: 'cadre', text: 'dont je t’ai parlé' }] },
      { label: 'où', sub: 'lieu ou moment', ex: 'Le jour où je suis arrivée.',
        marks: [{ k: 'box', x1: 0, x2: 34, text: 'le jour' }, { k: 'line', x1: 34, x2: 40, c: 'muted' }, { k: 'box', x1: 40, x2: 100, c: 'cadre', text: 'où je suis arrivée' }] },
      { label: 'auquel / sur lequel…', sub: 'verbe + à, sur, avec…', ex: 'Le projet auquel je participe.',
        marks: [{ k: 'box', x1: 0, x2: 34, text: 'le projet' }, { k: 'line', x1: 34, x2: 40, c: 'muted' }, { k: 'box', x1: 40, x2: 100, c: 'cadre', text: 'auquel je participe' }] }
    ]
  },
  {
    id: 'prep-relatif', tab: 2, type: 'map', title: 'Verbe + préposition → pronom relatif',
    rows: [
      { from: 'parler **de**', to: 'le sujet **dont** on parle' },
      { from: 'avoir besoin **de**', to: 'l’outil **dont** j’ai besoin' },
      { from: 'participer **à**', to: 'le projet **auquel** je participe' },
      { from: 'penser **à**', to: 'la question **à laquelle** je pense' },
      { from: 'travailler **sur**', to: 'le dossier **sur lequel** je travaille' },
      { from: 'travailler **avec** (personne)', to: 'la personne **avec qui** je travaille' },
      { from: 'habiter **dans** (lieu)', to: 'le quartier **où** j’habite' }
    ]
  },

  /* ---------- Onglet 3 : le temps ---------- */
  {
    id: 'durees', tab: 3, title: 'Situer et mesurer dans le temps',
    axis: { today: 50 },
    rows: [
      { label: 'il y a', sub: 'un point passé', ex: 'Je suis arrivée il y a deux ans.',
        marks: [{ k: 'gap', x1: 20, x2: 50 }, { k: 'point', x: 20, c: 'cadre' }] },
      { label: 'depuis', sub: 'ça dure encore', ex: 'J’habite ici depuis deux ans.',
        marks: [{ k: 'point', x: 20 }, { k: 'arrow', x1: 20, x2: 58 }] },
      { label: 'ça fait… que', sub: 'durée écoulée jusqu’à maintenant', ex: 'Ça fait deux ans que j’habite ici.',
        marks: [{ k: 'gap', x1: 20, x2: 50, text: 'deux ans' }, { k: 'line', x1: 20, x2: 50 }, { k: 'point', x: 20 }] },
      { label: 'pendant', sub: 'durée terminée', ex: 'J’ai étudié pendant deux ans.',
        marks: [{ k: 'bar', x1: 6, x2: 30 }] },
      { label: 'en', sub: 'temps pour finir', ex: 'J’ai fait le ménage en une heure.',
        marks: [{ k: 'bar', x1: 10, x2: 32 }, { k: 'point', x: 32, c: 'cadre' }] },
      { label: 'au bout de', sub: 'après une attente', ex: 'Au bout de trois jours, il a rappelé.',
        marks: [{ k: 'gap', x1: 8, x2: 34 }, { k: 'line', x1: 8, x2: 34, c: 'muted', dashed: true }, { k: 'point', x: 34, c: 'cadre' }] },
      { label: 'dans', sub: 'un point à venir', ex: 'Je pars dans deux semaines.',
        marks: [{ k: 'gap', x1: 50, x2: 82 }, { k: 'point', x: 82, c: 'cadre' }] },
      { label: 'pour', sub: 'durée prévue', ex: 'Je pars pour trois jours.',
        marks: [{ k: 'bar', x1: 56, x2: 92, dashed: true }] },
      { label: 'jusqu’à', sub: 'point d’arrivée', ex: 'Je travaille jusqu’à vendredi.',
        marks: [{ k: 'line', x1: 0, x2: 74 }, { k: 'tick', x: 75, c: 'cadre' }] },
      { label: 'à partir de', sub: 'dès : tout de suite', ex: 'À partir de lundi, je commence à 8 h.',
        marks: [{ k: 'tick', x: 30 }, { k: 'arrow', x1: 30, x2: 100 }] },
      { label: 'd’ici', sub: 'délai à respecter', ex: 'Envoie-le d’ici vendredi.',
        marks: [{ k: 'line', x1: 50, x2: 80 }, { k: 'tick', x: 82, c: 'cadre' }] }
    ]
  },
  {
    id: 'simultaneite', tab: 3, title: 'Relier deux actions dans le temps',
    lanes: 2, legend: true,
    rows: [
      { label: 'pendant que', sub: 'en même temps', ex: 'Je cuisine pendant qu’il travaille.',
        marks: [{ k: 'bar', x1: 8, x2: 92, c: 'cadre', lane: 0 }, { k: 'bar', x1: 8, x2: 92, lane: 1 }] },
      { label: 'au moment où', sub: 'un point dans une action en cours', ex: 'Le téléphone a sonné au moment où je sortais.',
        marks: [{ k: 'bar', x1: 8, x2: 92, c: 'cadre', lane: 0 }, { k: 'point', x: 50, lane: 1 }] },
      { label: 'dès que', sub: 'tout de suite après', ex: 'Dès qu’il arrive, on mange.',
        marks: [{ k: 'point', x: 16, c: 'cadre', lane: 0 }, { k: 'bar', x1: 20, x2: 92, lane: 1 }] },
      { label: 'après que / après + inf. passé', sub: 'la principale suit la fin du cadre', ex: 'Après avoir mangé, on est sortis.',
        marks: [{ k: 'bar', x1: 8, x2: 40, c: 'cadre', lane: 0 }, { k: 'bar', x1: 42, x2: 92, lane: 1 }] },
      { label: 'une fois que', sub: 'après, avec un écart', ex: 'Une fois que tu auras fini, appelle-moi.',
        marks: [{ k: 'bar', x1: 8, x2: 32, c: 'cadre', lane: 0 }, { k: 'bar', x1: 50, x2: 92, lane: 1 }] },
      { label: 'avant de / avant que', sub: 'la principale d’abord', ex: 'Avant de partir, j’ai tout vérifié.',
        marks: [{ k: 'bar', x1: 8, x2: 40, lane: 1 }, { k: 'bar', x1: 56, x2: 92, c: 'cadre', lane: 0 }] },
      { label: 'jusqu’à ce que', sub: 'arrêt à l’événement', ex: 'Attends jusqu’à ce qu’il arrive.',
        marks: [{ k: 'bar', x1: 8, x2: 70, lane: 1 }, { k: 'point', x: 72, c: 'cadre', lane: 0 }] },
      { label: 'tant que', sub: 'les deux s’arrêtent ensemble', ex: 'Tant qu’il neige, on reste ici.',
        marks: [{ k: 'bar', x1: 8, x2: 70, c: 'cadre', lane: 0 }, { k: 'bar', x1: 8, x2: 70, lane: 1 }, { k: 'tick', x: 72, c: 'muted', lane: 0 }, { k: 'tick', x: 72, c: 'muted', lane: 1 }] },
      { label: 'au fur et à mesure que', sub: 'progression parallèle', ex: 'Au fur et à mesure que j’avance, je comprends.',
        marks: [8, 30, 52, 74].map(x => ({ k: 'bar', x1: x, x2: x + 18, c: 'cadre', lane: 0 })).concat([8, 30, 52, 74].map(x => ({ k: 'bar', x1: x, x2: x + 18, lane: 1 }))) },
      { label: 'chaque fois que', sub: 'à chaque répétition', ex: 'Chaque fois qu’il pleut, le métro ralentit.',
        marks: [12, 44, 76].map(x => ({ k: 'point', x, c: 'cadre', lane: 0 })).concat([12, 44, 76].map(x => ({ k: 'bar', x1: x + 3, x2: x + 18, lane: 1 }))) }
    ]
  },

  /* ---------- Onglet 4 : la cause ---------- */
  {
    id: 'cause', tab: 4, title: 'D’où vient la situation ?',
    intro: 'La flèche va toujours de la cause vers l’effet ; l’ordre des cases suit l’ordre de la phrase.',
    flow: true, legend: [['cadre', 'la cause (introduite par l’expression)'], ['main', 'l’effet']],
    rows: [
      { label: 'parce que', sub: 'l’effet d’abord, puis la raison', ex: 'Je suis en retard parce que le métro était arrêté.',
        marks: [{ k: 'box', x1: 0, x2: 40, text: 'en retard' }, { k: 'arrow', x1: 58, x2: 43, c: 'cadre' }, { k: 'box', x1: 60, x2: 100, c: 'cadre', text: 'métro arrêté' }] },
      { label: 'comme', sub: 'la cause en tête de phrase', ex: 'Comme il pleuvait, on a pris l’autobus.',
        marks: [{ k: 'box', x1: 0, x2: 40, c: 'cadre', text: 'il pleuvait' }, { k: 'arrow', x1: 43, x2: 58, c: 'cadre' }, { k: 'box', x1: 60, x2: 100, text: 'l’autobus' }] },
      { label: 'puisque', sub: 'une raison déjà connue', ex: 'Puisque tu es là, aide-moi.',
        marks: [{ k: 'box', x1: 0, x2: 40, c: 'cadre', text: 'tu es là ✓' }, { k: 'arrow', x1: 43, x2: 58, c: 'cadre' }, { k: 'box', x1: 60, x2: 100, text: 'aide-moi' }] },
      { label: 'grâce à + nom', sub: 'cause favorable', ex: 'Grâce à mon voisin, j’ai trouvé un emploi.',
        marks: [{ k: 'box', x1: 0, x2: 40, c: 'cadre', text: 'mon voisin' }, { k: 'sign', x: 50, text: '+' }, { k: 'box', x1: 60, x2: 100, text: 'un emploi' }] },
      { label: 'à cause de + nom', sub: 'cause défavorable', ex: 'À cause de la neige, le vol est annulé.',
        marks: [{ k: 'box', x1: 0, x2: 40, c: 'cadre', text: 'la neige' }, { k: 'sign', x: 50, text: '−' }, { k: 'box', x1: 60, x2: 100, text: 'vol annulé' }] },
      { label: 'faute de + nom', sub: 'une ressource absente', ex: 'Faute de temps, je n’ai pas fini.',
        marks: [{ k: 'box', x1: 0, x2: 40, c: 'cadre', text: 'temps ?', dashed: true }, { k: 'arrow', x1: 43, x2: 58, c: 'cadre' }, { k: 'box', x1: 60, x2: 100, text: 'pas fini' }] },
      { label: 'à force de', sub: 'la répétition produit l’effet', ex: 'À force de pratiquer, elle parle couramment.',
        marks: [{ k: 'box', x1: 0, x2: 9, c: 'cadre' }, { k: 'box', x1: 11, x2: 20, c: 'cadre' }, { k: 'box', x1: 22, x2: 31, c: 'cadre' }, { k: 'box', x1: 33, x2: 42, c: 'cadre' }, { k: 'arrow', x1: 45, x2: 58, c: 'cadre' }, { k: 'box', x1: 60, x2: 100, text: 'elle parle' }] },
      { label: 'd’autant plus que', sub: 'une raison qui s’ajoute', ex: 'Je reste, d’autant plus qu’il pleut.',
        marks: [{ k: 'box', x1: 0, x2: 30, text: 'je reste' }, { k: 'box', x1: 40, x2: 66, c: 'muted', text: 'raison 1' }, { k: 'sign', x: 72, text: '+' }, { k: 'box', x1: 78, x2: 100, c: 'cadre', text: 'il pleut' }] }
    ]
  },

  /* ---------- Onglet 5 : la conséquence ---------- */
  {
    id: 'consequence', tab: 5, title: 'Qu’est-ce que ça donne ?',
    intro: 'Ici, l’expression introduit le résultat (orange).',
    flow: true, legend: [['main', 'la situation de départ'], ['cadre', 'le résultat']],
    rows: [
      { label: 'donc / alors', sub: 'le résultat suit', ex: 'Il neigeait, alors on est restés à la maison.',
        marks: [{ k: 'box', x1: 0, x2: 40, text: 'il neigeait' }, { k: 'arrow', x1: 43, x2: 58, c: 'cadre' }, { k: 'box', x1: 60, x2: 100, c: 'cadre', text: 'on est restés' }] },
      { label: 'fait que [F-QC]', sub: 'même logique, à l’oral', ex: 'C’était complet, fait que je suis partie.',
        marks: [{ k: 'box', x1: 0, x2: 40, text: 'complet' }, { k: 'arrow', x1: 43, x2: 58, c: 'cadre' }, { k: 'box', x1: 60, x2: 100, c: 'cadre', text: 'je suis partie' }] },
      { label: 'si bien que + ind.', sub: 'résultat constaté', ex: 'Il a neigé, si bien que l’école a fermé.',
        marks: [{ k: 'box', x1: 0, x2: 40, text: 'il a neigé' }, { k: 'arrow', x1: 43, x2: 58, c: 'cadre' }, { k: 'box', x1: 60, x2: 100, c: 'cadre', text: 'école fermée ✓' }] },
      { label: 'de sorte que + subj.', sub: 'résultat visé (but)', ex: 'Parle fort, de sorte qu’on t’entende.',
        marks: [{ k: 'box', x1: 0, x2: 40, text: 'parle fort' }, { k: 'arrow', x1: 43, x2: 58, c: 'cadre', dashed: true }, { k: 'box', x1: 60, x2: 92, c: 'cadre', text: 'qu’on entende', dashed: true }, { k: 'flag', x: 95, c: 'cadre' }] },
      { label: 'tellement… que', sub: 'l’intensité déclenche', ex: 'J’étais tellement fatiguée que je me suis endormie.',
        marks: [{ k: 'bar', x1: 0, x2: 42 }, { k: 'text', x: 21, text: 'très, très…', dy: -9, c: 'muted' }, { k: 'arrow', x1: 45, x2: 58, c: 'cadre' }, { k: 'box', x1: 60, x2: 100, c: 'cadre', text: 'endormie' }] },
      { label: 'trop… pour', sub: 'la limite est dépassée', ex: 'Il est trop tard pour sortir.',
        marks: [{ k: 'bar', x1: 0, x2: 56 }, { k: 'tick', x: 40, c: 'muted' }, { k: 'text', x: 40, text: 'limite', dy: -11, c: 'muted' }, { k: 'box', x1: 64, x2: 100, c: 'cadre', text: 'sortir', cross: true }] },
      { label: 'assez… pour', sub: 'la limite est atteinte', ex: 'Elle est assez grande pour comprendre.',
        marks: [{ k: 'bar', x1: 0, x2: 40 }, { k: 'tick', x: 40, c: 'muted' }, { k: 'text', x: 40, text: 'limite', dy: -11, c: 'muted' }, { k: 'arrow', x1: 44, x2: 60, c: 'cadre' }, { k: 'box', x1: 64, x2: 100, c: 'cadre', text: 'comprendre' }] }
    ]
  },

  /* ---------- Onglet 6 : le but ---------- */
  {
    id: 'but', tab: 6, title: 'Vers quoi je vais ?',
    intro: 'Le drapeau marque l’objectif. Même sujet → infinitif ; autre sujet → subjonctif.',
    flow: true, legend: [['main', 'qui agit'], ['cadre', 'l’objectif']],
    rows: [
      { label: 'pour + inf.', sub: 'même sujet', ex: 'Je travaille pour apprendre.',
        marks: [{ k: 'person', x: 4, text: 'je' }, { k: 'arrow', x1: 10, x2: 74, c: 'cadre' }, { k: 'person', x: 82, text: 'je', c: 'cadre' }, { k: 'flag', x: 92, c: 'cadre' }] },
      { label: 'pour que + subj.', sub: 'un autre sujet', ex: 'Je travaille pour que mes enfants puissent étudier.',
        marks: [{ k: 'person', x: 4, text: 'je' }, { k: 'arrow', x1: 10, x2: 74, c: 'cadre' }, { k: 'person', x: 82, text: 'eux', c: 'cadre' }, { k: 'flag', x: 92, c: 'cadre' }] },
      { label: 'afin de / afin que', sub: 'même logique, plus soutenu', ex: 'Je vous écris afin de confirmer.',
        marks: [{ k: 'person', x: 4, text: 'je' }, { k: 'arrow', x1: 10, x2: 82, c: 'cadre' }, { k: 'flag', x: 90, c: 'cadre' }] },
      { label: 'en vue de + nom', sub: 'un objectif plus lointain', ex: 'Il étudie en vue de l’examen.',
        marks: [{ k: 'person', x: 4, text: 'il' }, { k: 'arrow', x1: 10, x2: 88, c: 'cadre', dashed: true }, { k: 'flag', x: 96, c: 'cadre' }] },
      { label: 'pour ne pas / pour éviter de', sub: 'ce qu’on veut éviter', ex: 'Je pars tôt pour ne pas manquer l’autobus.',
        marks: [{ k: 'person', x: 4, text: 'je' }, { k: 'arrow', x1: 10, x2: 70, c: 'main' }, { k: 'flag', x: 86, c: 'neg', cross: true }] },
      { label: 'de peur de / de peur que', sub: 'une crainte guide l’action', ex: 'Il a réservé de peur qu’il n’y ait plus de place.',
        marks: [{ k: 'person', x: 4, text: 'il' }, { k: 'arrow', x1: 10, x2: 58 }, { k: 'sign', x: 72, text: '!', c: 'neg' }, { k: 'flag', x: 88, c: 'neg', dashed: true, cross: true }] }
    ]
  },

  /* ---------- Onglet 7 : condition et hypothèse ---------- */
  {
    id: 'si', tab: 7, title: 'Si… : du possible à l’imaginaire',
    intro: 'Trait plein = réel ou possible. Pointillés = imaginé. Croix = ne s’est pas produit.',
    axis: { today: 50 }, legend: [['cadre', 'la condition (si…)'], ['main', 'la conséquence']],
    rows: [
      { label: 'si + présent → futur', sub: 'possible, réaliste', ex: 'Si j’ai le temps, je t’appellerai.',
        marks: [{ k: 'point', x: 60, c: 'cadre' }, { k: 'arrow', x1: 63, x2: 90 }] },
      { label: 'si + présent → présent', sub: 'vrai en général', ex: 'Si je bois du café le soir, je dors mal.',
        marks: [{ k: 'point', x: 30, c: 'cadre' }, { k: 'line', x1: 33, x2: 42 }, { k: 'point', x: 50, c: 'cadre' }, { k: 'line', x1: 53, x2: 62 }, { k: 'point', x: 70, c: 'cadre' }, { k: 'line', x1: 73, x2: 82 }] },
      { label: 'si + imparfait → conditionnel', sub: 'imaginaire, maintenant', ex: 'Si j’avais une auto, j’irais au chalet.',
        marks: [{ k: 'bar', x1: 38, x2: 54, c: 'cadre', dashed: true }, { k: 'arrow', x1: 56, x2: 84, dashed: true }, { k: 'text', x: 70, text: 'imaginé', dy: -9, c: 'muted' }] },
      { label: 'si + plus-que-parfait → cond. passé', sub: 'passé non réalisé', ex: 'Si j’avais su, je serais venue.',
        marks: [{ k: 'bar', x1: 6, x2: 20, c: 'cadre', dashed: true }, { k: 'arrow', x1: 22, x2: 40, dashed: true }, { k: 'cross', x: 30 }] },
      { label: 'au cas où + cond.', sub: 'précaution pour une possibilité', ex: 'Prends un parapluie au cas où il pleuvrait.',
        marks: [{ k: 'bar', x1: 44, x2: 56 }, { k: 'point', x: 78, c: 'cadre', fill: 'open', dashed: true }, { k: 'text', x: 78, text: '?', dy: -9, c: 'cadre' }] },
      { label: 'à condition que + subj.', sub: 'condition nécessaire', ex: 'Je viens à condition que tu m’attendes.',
        marks: [{ k: 'wall', x: 62, c: 'cadre', text: 'condition' }, { k: 'arrow', x1: 52, x2: 92 }] },
      { label: 'sauf si / à moins que', sub: 'une exception annule', ex: 'Je viendrai, sauf s’il neige trop.',
        marks: [{ k: 'arrow', x1: 52, x2: 92 }, { k: 'box', x1: 66, x2: 84, c: 'cadre', text: 'neige', dashed: true }, { k: 'cross', x: 96 }] }
    ]
  },

  /* ---------- Onglet 8 : opposer, concéder, comparer ---------- */
  {
    id: 'concession', tab: 8, title: 'Opposer et concéder',
    intro: 'Concession : l’obstacle (orange) existe, mais la principale (violet) passe quand même.',
    flow: true, legend: [['cadre', 'l’obstacle ou l’autre idée'], ['main', 'la phrase principale']],
    rows: [
      { label: 'même si + ind.', sub: 'l’obstacle n’empêche pas', ex: 'Je sors même s’il fait froid.',
        marks: [{ k: 'arrow', x1: 4, x2: 96 }, { k: 'wall', x: 50, c: 'cadre', text: 'il fait froid' }] },
      { label: 'bien que + subj.', sub: 'idem, plus soutenu', ex: 'Bien qu’il soit tard, je continue.',
        marks: [{ k: 'arrow', x1: 4, x2: 96 }, { k: 'wall', x: 50, c: 'cadre', text: 'il est tard' }] },
      { label: 'malgré + nom', sub: 'idem, devant un nom', ex: 'Malgré le froid, on est sortis.',
        marks: [{ k: 'arrow', x1: 4, x2: 96 }, { k: 'wall', x: 50, c: 'cadre', text: 'le froid' }] },
      { label: 'avoir beau + inf.', sub: 'l’effort ne suffit pas', ex: 'J’ai beau chercher, je ne trouve pas.',
        marks: [{ k: 'box', x1: 0, x2: 12, c: 'cadre' }, { k: 'box', x1: 14, x2: 26, c: 'cadre' }, { k: 'box', x1: 28, x2: 40, c: 'cadre' }, { k: 'arrow', x1: 44, x2: 60 }, { k: 'box', x1: 64, x2: 100, text: 'trouver', cross: true }] },
      { label: 'alors que / tandis que', sub: 'deux faits opposés', ex: 'J’aime l’hiver, alors que lui le déteste.',
        marks: [{ k: 'box', x1: 0, x2: 42, text: 'j’aime' }, { k: 'sign', x: 50, text: '⇄', c: 'muted' }, { k: 'box', x1: 58, x2: 100, c: 'cadre', text: 'il déteste' }] },
      { label: 'par contre / en revanche', sub: 'deux phrases qui s’opposent', ex: 'C’est cher, par contre c’est grand.',
        marks: [{ k: 'box', x1: 0, x2: 42, text: 'c’est cher', c: 'main' }, { k: 'sign', x: 50, text: '−', c: 'neg' }, { k: 'sign', x: 58, text: '+', c: 'pos' }, { k: 'box', x1: 66, x2: 100, c: 'cadre', text: 'c’est grand' }] },
      { label: 'au lieu de / plutôt que', sub: 'remplacer', ex: 'Je prends le vélo au lieu de l’auto.',
        marks: [{ k: 'box', x1: 0, x2: 40, c: 'cadre', text: 'l’auto', cross: true, dashed: true }, { k: 'arrow', x1: 43, x2: 58, c: 'muted' }, { k: 'box', x1: 60, x2: 100, text: 'le vélo' }] }
    ]
  },
  {
    id: 'comparer', tab: 8, title: 'Comparer',
    lanes: 2, legend: [['main', 'ce qu’on compare'], ['cadre', 'le point de comparaison']],
    rows: [
      { label: 'plus… que', sub: 'supériorité', ex: 'Montréal est plus grande que Québec.',
        marks: [{ k: 'bar', x1: 0, x2: 50, c: 'cadre', lane: 0 }, { k: 'bar', x1: 0, x2: 82, lane: 1 }] },
      { label: 'aussi… que / autant que', sub: 'égalité', ex: 'Il est aussi grand que moi.',
        marks: [{ k: 'bar', x1: 0, x2: 64, c: 'cadre', lane: 0 }, { k: 'bar', x1: 0, x2: 64, lane: 1 }] },
      { label: 'moins… que', sub: 'infériorité', ex: 'C’est moins cher que l’an dernier.',
        marks: [{ k: 'bar', x1: 0, x2: 70, c: 'cadre', lane: 0 }, { k: 'bar', x1: 0, x2: 36, lane: 1 }] },
      { label: 'contrairement à', sub: 'un contraste', ex: 'Contrairement à mon frère, j’aime l’hiver.',
        marks: [{ k: 'arrow', x1: 50, x2: 4, c: 'cadre', lane: 0 }, { k: 'arrow', x1: 50, x2: 96, lane: 1 }] }
    ]
  },

  /* ---------- Onglet 9 : opinion et certitude ---------- */
  {
    id: 'certitude', tab: 9, title: 'À quel point j’en suis sûre ?',
    intro: 'Plus on doute, plus le subjonctif apparaît.',
    axis: { labels: [[0, 'pas sûre'], [50, 'possible'], [100, 'certaine']] },
    rows: [
      { label: 'je doute que', sub: '+ subjonctif', ex: 'Je doute qu’il vienne.',
        marks: [{ k: 'bar', x1: 0, x2: 12, c: 'cadre' }, { k: 'tag', x: 24, text: 'subj.', c: 'cadre' }] },
      { label: 'je ne pense pas que', sub: '+ subjonctif', ex: 'Je ne pense pas qu’il soit là.',
        marks: [{ k: 'bar', x1: 0, x2: 22, c: 'cadre' }, { k: 'tag', x: 34, text: 'subj.', c: 'cadre' }] },
      { label: 'il est possible que / il se peut que', sub: '+ subjonctif', ex: 'Il se peut qu’il pleuve.',
        marks: [{ k: 'bar', x1: 0, x2: 40, c: 'cadre' }, { k: 'tag', x: 52, text: 'subj.', c: 'cadre' }] },
      { label: 'peut-être que', sub: '+ indicatif', ex: 'Peut-être qu’il va venir.',
        marks: [{ k: 'bar', x1: 0, x2: 48 }, { k: 'tag', x: 60, text: 'ind.' }] },
      { label: 'probablement', sub: 'adverbe', ex: 'Il va probablement pleuvoir.',
        marks: [{ k: 'bar', x1: 0, x2: 64 }] },
      { label: 'je pense que / je trouve que', sub: '+ indicatif', ex: 'Je pense que c’est une bonne idée.',
        marks: [{ k: 'bar', x1: 0, x2: 72 }, { k: 'tag', x: 84, text: 'ind.' }] },
      { label: 'je suis certaine que', sub: '+ indicatif', ex: 'Je suis certaine qu’il viendra.',
        marks: [{ k: 'bar', x1: 0, x2: 90 }, { k: 'point', x: 90 }] },
      { label: 'il est évident que', sub: '+ indicatif', ex: 'Il est évident que c’est trop cher.',
        marks: [{ k: 'bar', x1: 0, x2: 98 }, { k: 'point', x: 98 }] }
    ]
  },
  {
    id: 'sources', tab: 9, type: 'map', title: 'Fait, opinion ou ouï-dire ?',
    rows: [
      { from: 'je **sais** que', to: 'un fait que je connais', c: 'main' },
      { from: 'je **pense** que / à mon avis', to: 'mon opinion', c: 'cadre' },
      { from: '**selon** lui / **d’après** elle', to: 'l’avis de quelqu’un d’autre', c: 'muted' },
      { from: 'il **paraît** que / apparemment', to: 'une information non vérifiée', c: 'muted' }
    ]
  },

  /* ---------- Onglet 10 : ajouter, illustrer, préciser ---------- */
  {
    id: 'ajouter', tab: 10, title: 'Développer une idée',
    flow: true, legend: [['main', 'l’idée'], ['cadre', 'ce qu’on ajoute']],
    rows: [
      { label: 'en plus / de plus', sub: 'on ajoute un élément', ex: 'C’est proche, en plus c’est pas cher.',
        marks: [{ k: 'box', x1: 0, x2: 42, text: 'c’est proche' }, { k: 'sign', x: 50, text: '+' }, { k: 'box', x1: 58, x2: 100, c: 'cadre', text: 'pas cher' }] },
      { label: 'par exemple', sub: 'une illustration', ex: 'J’aime l’hiver, par exemple le patin.',
        marks: [{ k: 'box', x1: 0, x2: 50, text: 'l’hiver' }, { k: 'arrow', x1: 53, x2: 66, c: 'cadre' }, { k: 'box', x1: 69, x2: 100, c: 'cadre', text: 'le patin' }] },
      { label: 'entre autres', sub: 'un exemple parmi d’autres', ex: 'J’ai visité, entre autres, Québec.',
        marks: [{ k: 'box', x1: 0, x2: 36, text: 'des villes' }, { k: 'box', x1: 42, x2: 60, c: 'muted', dashed: true }, { k: 'box', x1: 62, x2: 80, c: 'cadre', text: 'Québec' }, { k: 'box', x1: 82, x2: 100, c: 'muted', dashed: true }] },
      { label: 'notamment', sub: 'l’exemple le plus représentatif', ex: 'Plusieurs services, notamment la francisation.',
        marks: [{ k: 'box', x1: 0, x2: 36, text: 'services' }, { k: 'box', x1: 42, x2: 56, c: 'muted' }, { k: 'box', x1: 58, x2: 86, c: 'cadre', text: 'francisation' }, { k: 'box', x1: 88, x2: 100, c: 'muted' }] },
      { label: 'c’est-à-dire', sub: 'la même idée, précisée', ex: 'À temps partiel, c’est-à-dire trois jours.',
        marks: [{ k: 'box', x1: 0, x2: 42, text: 'temps partiel' }, { k: 'sign', x: 50, text: '=', c: 'muted' }, { k: 'box', x1: 58, x2: 100, c: 'cadre', text: '3 jours' }] },
      { label: 'non seulement… mais aussi', sub: 'le second élément renforce', ex: 'Non seulement c’est beau, mais aussi c’est utile.',
        marks: [{ k: 'box', x1: 0, x2: 36, text: 'beau' }, { k: 'sign', x: 44, text: '+' }, { k: 'box', x1: 52, x2: 100, c: 'cadre', text: 'utile !' }] },
      { label: 'grâce à / avec / en + participe', sub: 'le moyen', ex: 'J’ai appris en écoutant la radio.',
        marks: [{ k: 'box', x1: 0, x2: 40, c: 'cadre', text: 'en écoutant' }, { k: 'arrow', x1: 43, x2: 58, c: 'muted' }, { k: 'box', x1: 60, x2: 100, text: 'j’ai appris' }] }
    ]
  },

  /* ---------- Onglet 11 : organiser, reformuler, conclure ---------- */
  {
    id: 'discours', tab: 11, title: 'Le chemin du discours',
    flow: true, legend: [['main', 'ce qu’on a dit'], ['cadre', 'ce que l’expression introduit']],
    rows: [
      { label: 'd’abord… ensuite… enfin', sub: 'mettre en ordre', ex: 'D’abord j’ai cherché, ensuite j’ai visité, enfin j’ai signé.',
        marks: [{ k: 'box', x1: 0, x2: 26, text: '1' }, { k: 'arrow', x1: 28, x2: 36, c: 'muted' }, { k: 'box', x1: 37, x2: 63, text: '2' }, { k: 'arrow', x1: 65, x2: 73, c: 'muted' }, { k: 'box', x1: 74, x2: 100, c: 'cadre', text: '3' }] },
      { label: 'en fait', sub: 'je corrige', ex: 'Je pensais que c’était lundi. En fait, c’est mardi.',
        marks: [{ k: 'box', x1: 0, x2: 40, text: 'lundi', cross: true }, { k: 'arrow', x1: 43, x2: 58, c: 'cadre' }, { k: 'box', x1: 60, x2: 100, c: 'cadre', text: 'mardi' }] },
      { label: 'autrement dit / c’est-à-dire', sub: 'je redis autrement', ex: 'Il est occupé. Autrement dit, il ne viendra pas.',
        marks: [{ k: 'box', x1: 0, x2: 42, text: 'occupé' }, { k: 'sign', x: 50, text: '=', c: 'muted' }, { k: 'box', x1: 58, x2: 100, c: 'cadre', text: 'il ne vient pas' }] },
      { label: 'dans le fond', sub: 'je vais à l’essentiel', ex: 'Dans le fond, je veux un endroit tranquille.',
        marks: [{ k: 'box', x1: 0, x2: 12, c: 'muted', dashed: true }, { k: 'box', x1: 14, x2: 26, c: 'muted', dashed: true }, { k: 'box', x1: 28, x2: 40, c: 'muted', dashed: true }, { k: 'arrow', x1: 43, x2: 58, c: 'cadre' }, { k: 'box', x1: 60, x2: 100, c: 'cadre', text: 'l’essentiel' }] },
      { label: 'bref / en somme', sub: 'je résume', ex: 'Bref, tout s’est bien passé.',
        marks: [{ k: 'box', x1: 0, x2: 12 }, { k: 'box', x1: 14, x2: 26 }, { k: 'box', x1: 28, x2: 40 }, { k: 'arrow', x1: 43, x2: 58, c: 'cadre' }, { k: 'box', x1: 60, x2: 82, c: 'cadre', text: 'bref' }] },
      { label: 'finalement', sub: 'la conclusion après réflexion', ex: 'Finalement, j’ai choisi le plus proche.',
        marks: [{ k: 'box', x1: 0, x2: 20, c: 'muted', text: '?' }, { k: 'box', x1: 22, x2: 42, c: 'muted', text: '?' }, { k: 'arrow', x1: 45, x2: 58, c: 'cadre' }, { k: 'box', x1: 60, x2: 100, c: 'cadre', text: 'décision ✓' }] }
    ]
  },

  /* ---------- Onglet 12 : la conversation ---------- */
  {
    id: 'tours', tab: 12, title: 'Qui parle, quand ?',
    intro: 'En haut, l’autre personne ; en bas, toi. Les petites réactions font avancer l’échange.',
    lanes: 2, legend: [['main', 'l’autre parle'], ['cadre', 'toi']],
    rows: [
      { label: 'Ah oui ? / Je vois', sub: 'montrer qu’on écoute', ex: '— … — Ah oui ? — … — Je vois.',
        marks: [{ k: 'bar', x1: 4, x2: 96, lane: 0 }, { k: 'point', x: 34, c: 'cadre', lane: 1 }, { k: 'point', x: 66, c: 'cadre', lane: 1 }] },
      { label: 'Qu’est-ce que tu veux dire ?', sub: 'demander une précision', ex: '— C’est compliqué. — Qu’est-ce que tu veux dire ?',
        marks: [{ k: 'bar', x1: 4, x2: 38, lane: 0 }, { k: 'bar', x1: 40, x2: 54, c: 'cadre', lane: 1 }, { k: 'bar', x1: 56, x2: 96, lane: 0 }] },
      { label: 'Et après ? / Pis ? [F-QC]', sub: 'relancer le récit', ex: '— Il m’a appelée… — Pis ? — Il m’a offert le poste !',
        marks: [{ k: 'bar', x1: 4, x2: 44, lane: 0 }, { k: 'point', x: 48, c: 'cadre', lane: 1 }, { k: 'bar', x1: 52, x2: 96, lane: 0 }] },
      { label: 'C’est vrai, mais…', sub: 'accepter, puis nuancer', ex: '— C’est cher ici. — C’est vrai, mais c’est central.',
        marks: [{ k: 'bar', x1: 4, x2: 44, lane: 0 }, { k: 'bar', x1: 47, x2: 62, c: 'cadre', lane: 1, dashed: true }, { k: 'bar', x1: 64, x2: 96, c: 'cadre', lane: 1 }] },
      { label: 'Attends… / Justement…', sub: 'prendre la parole', ex: '— Et donc je pense que… — Attends, justement…',
        marks: [{ k: 'bar', x1: 4, x2: 52, lane: 0 }, { k: 'tick', x: 54, c: 'muted', lane: 0 }, { k: 'bar', x1: 50, x2: 96, c: 'cadre', lane: 1 }] },
      { label: 'Si je comprends bien…', sub: 'reformuler pour vérifier', ex: '— Si je comprends bien, tu déménages ? — Oui !',
        marks: [{ k: 'bar', x1: 4, x2: 40, lane: 0 }, { k: 'bar', x1: 43, x2: 72, c: 'cadre', lane: 1, dashed: true }, { k: 'point', x: 78, lane: 0 }] }
    ]
  },

  /* ---------- Transversal : registres et modes ---------- */
  {
    id: 'registres', tab: null, type: 'grid', title: 'Une même idée, trois registres',
    intro: 'De la conversation entre amis au courriel officiel.',
    cols: ['Familier québécois', 'Courant', 'Soutenu'], tones: ['cadre', 'muted', 'main'], scale: true,
    rows: [
      { theme: 'Conséquence', cells: ['fait que', 'donc', 'par conséquent'] },
      { theme: 'Conséquence', cells: ['ça fait que', 'alors', 'en conséquence'] },
      { theme: 'Conséquence', cells: ['fait que là', 'c’est pour ça que', 'c’est pourquoi'] },
      { theme: 'Cause', cells: ['ben, c’est parce que', 'parce que', 'car'] },
      { theme: 'Opposition', cells: ['ben oui, mais', 'oui, mais', 'certes… mais'] },
      { theme: 'Deux côtés', cells: ['d’un bord… de l’autre', 'd’un côté… de l’autre', 'd’une part… d’autre part'] },
      { theme: 'Ajout', cells: ['pis aussi', 'en plus', 'en outre'] },
      { theme: 'Hypothèse', cells: ['mettons que', 'imaginons que', 'dans l’hypothèse où'] },
      { theme: 'Maintenant', cells: ['astheure', 'maintenant', 'à l’heure actuelle'] }
    ]
  },
  {
    id: 'modes', tab: null, type: 'columns', title: 'Quel mode après l’expression ?',
    cols: [
      { title: 'Indicatif', sub: 'un fait présenté comme réel', c: 'pos',
        items: ['parce que', 'puisque', 'depuis que', 'pendant que', 'après que', 'dès que', 'même si', 'si', 'alors que', 'je pense que'] },
      { title: 'Subjonctif', sub: 'pas (encore) réel : but, doute, condition, concession', c: 'main',
        items: ['pour que', 'avant que', 'jusqu’à ce que', 'bien que', 'à condition que', 'à moins que', 'sans que', 'je doute que', 'il faut que', 'je ne pense pas que'] },
      { title: 'Conditionnel', sub: 'une hypothèse', c: 'cadre',
        items: ['au cas où', 'dans le cas où', 'dans l’hypothèse où', 'quand bien même', 'si + imparfait → cond.'] },
      { title: 'Infinitif', sub: 'même sujet dans les deux parties', c: 'muted',
        items: ['pour', 'afin de', 'avant de', 'sans', 'au lieu de', 'à condition de'] }
    ]
  },
  {
    id: 'structures', tab: null, type: 'grid', title: 'Une relation, trois structures',
    intro: 'Plus la structure est longue, plus elle dit de choses (sujet, temps).',
    cols: ['Avec un nom', 'Avec un infinitif', 'Avec une proposition'], tones: ['muted', 'cadre', 'main'],
    rows: [
      { theme: 'Temps', cells: ['avant le départ', 'avant de partir', 'avant qu’il parte'] },
      { theme: 'Cause', cells: ['à cause de la pluie', 'faute d’avoir réservé', 'parce qu’il pleuvait'] },
      { theme: 'But', cells: ['en vue de l’examen', 'pour réussir', 'pour qu’elle réussisse'] },
      { theme: 'Concession', cells: ['malgré la pluie', 'malgré le fait d’être fatigué', 'bien qu’il pleuve'] },
      { theme: 'Condition', cells: ['en cas de pluie', 'à condition de partir', 'à condition qu’il parte'] },
      { theme: 'Absence', cells: ['sans aide', 'sans attendre', 'sans qu’il le sache'] },
      { theme: 'Attente', cells: ['en attendant le bus', 'en attendant de partir', 'en attendant qu’il arrive'] }
    ]
  }
]);
