/* Prototype 1 + 4 · C · « L’escalier des formes » — données propres au prototype.
   Tout le contenu vient du site (SITE.meta.essentiels, SITE.meta.visuels, CADRES.TABS…).
   Repris du prototype 1 (« Je veux… ») : glyph, alias, custom, formal, lanes, slots.

   - glyph   : la petite image de chaque intention (une ligne d'un schéma du site).
   - alias   : clé d'une forme → ligne de schéma du même onglet qui la dessine (« même image que… »).
   - custom  : schémas construits pour des formules qui n'en ont pas (même langage de marques).
   - formal  : exemples écrits pour des expressions soutenues ou plutôt écrites.
   - lanes   : découpage manuel « cadre / principale » d'un exemple ({…} = orange ; reste = violet).
   - alias2  : (ajout C) correspondances supplémentaires pour les marches 2 et 3.
   - noDiag  : (ajout C) formes à ne PAS rapprocher d'un schéma malgré un libellé voisin.
   - written : (ajout C) formes courantes surtout écrites, placées sur la marche 3
               (colonne « Soutenu » du schéma « Une même idée, trois registres » + exemples écrits du prototype 1). */
window.P14C = {

  glyph: {
    1: ['relief', 0], 2: ['relatives', 0], 3: ['durees', 1], 4: ['cause', 0],
    5: ['consequence', 0], 6: ['but', 1], 7: ['si', 5], 8: ['concession', 0],
    9: ['certitude', 5], 10: ['ajouter', 0], 11: ['discours', 4], 12: ['tours', 1]
  },

  /* clé normalisée de la formule → libellé de la ligne de schéma (même onglet) */
  alias: {
    1: { "ce qui m'interesse, c'est": 'Ce qui…, c’est…', "le probleme, la, c'est que": 'Le problème, c’est que…',
         'relativement a': 'Pour ce qui est de…', 'au chapitre de': 'Pour ce qui est de…' },
    3: { 'depuis que': 'depuis', 'apres': 'après que / après + inf. passé', 'dorenavant': 'à partir de', 'a compter de': 'à partir de',
         "a l'issue de": 'au bout de' },
    4: { 'vu que': 'puisque', "c'est parce que": 'parce que', "ben, c'est parce que": 'parce que',
         'car': 'parce que', 'du fait que': 'comme', 'par suite de': 'à cause de + nom', 'cela tient au fait que': 'parce que' },
    5: { "c'est pour ca que": 'donc / alors', 'ca fait que': 'fait que [F-QC]', 'par consequent': 'donc / alors',
         "c'est pourquoi": 'donc / alors', "d'ou": 'donc / alors' },
    6: { 'question de': 'pour + inf.', 'histoire de': 'pour + inf.', 'dans le but de': 'pour + inf.', 'de maniere a': 'pour + inf.' },
    7: { 'mettons que': 'si + imparfait → conditionnel', 'si jamais': 'au cas où + cond.', "dans l'hypothese ou": 'au cas où + cond.',
         'pour peu que': 'à condition que + subj.', 'faute de quoi': 'sauf si / à moins que', 'le cas echeant': 'au cas où + cond.' },
    8: { 'oui, mais': 'par contre / en revanche', 'sauf que': 'par contre / en revanche', "d'un bord... de l'autre": 'alors que / tandis que',
         'en depit de': 'malgré + nom', 'quand bien meme': 'même si + ind.', 'or': 'par contre / en revanche', "a l'instar de": 'aussi… que / autant que' },
    9: { 'a mon avis': 'je pense que / je trouve que', 'moi, je trouve que': 'je pense que / je trouve que',
         'a mon sens': 'je pense que / je trouve que', "j'estime que": 'je pense que / je trouve que', 'de toute evidence': 'il est évident que' },
    10: { 'pis aussi': 'en plus / de plus', 'en outre': 'en plus / de plus', "a titre d'exemple": 'par exemple',
          'a savoir': 'c’est-à-dire', 'qui plus est': 'non seulement… mais aussi' },
    11: { "fait que c'est ca": 'bref / en somme', 'en premier lieu': 'd’abord… ensuite… enfin', "en d'autres termes": 'autrement dit / c’est-à-dire',
          'somme toute': 'bref / en somme', 'en definitive': 'finalement' },
    12: { 'ah ouin': 'Ah oui ? / Je vois', 'pour vrai': 'Ah oui ? / Je vois', 'fait que': 'Et après ? / Pis ? [F-QC]',
          'dans quelle mesure': 'Qu’est-ce que tu veux dire ?' }
  },

  /* Schémas construits pour ce prototype : base = id du schéma dont on reprend l'axe, les voies, la légende. */
  custom: {
    1: {
      'a propos de': { base: 'relief', marks: [{ k: 'box', x1: 0, x2: 44, c: 'cadre', text: 'la réunion' }, { k: 'arrow', x1: 47, x2: 55, c: 'muted' }, { k: 'box', x1: 58, x2: 100, text: 'maintenue ?' }] },
      'en parlant de ca': { base: 'relief', marks: [{ k: 'box', x1: 0, x2: 32, c: 'muted', dashed: true, text: 'déjà dit' }, { k: 'arrow', x1: 35, x2: 46, c: 'cadre' }, { k: 'box', x1: 49, x2: 100, text: 'une garderie ?' }] },
      'a cet egard': { base: 'relief', marks: [{ k: 'box', x1: 0, x2: 40, c: 'cadre', text: 'bien desservi', dashed: true }, { k: 'arrow', x1: 56, x2: 43, c: 'muted' }, { k: 'box', x1: 58, x2: 100, text: 'le métro' }] }
    },
    2: {
      'la raison pour laquelle': { base: 'relatives', marks: [{ k: 'box', x1: 0, x2: 30, text: 'la raison' }, { k: 'line', x1: 30, x2: 34, c: 'muted' }, { k: 'box', x1: 34, x2: 100, c: 'cadre', text: 'pour laquelle j’ai changé' }] },
      'mon frere, il': { base: 'relatives', marks: [{ k: 'box', x1: 0, x2: 34, text: 'mon frère' }, { k: 'arrow', x1: 36, x2: 44, c: 'muted' }, { k: 'box', x1: 46, x2: 100, c: 'cadre', text: 'il travaille à Québec' }] },
      'ce restaurant-la': { base: 'relatives', marks: [{ k: 'box', x1: 0, x2: 50, c: 'cadre', text: 'il est vraiment bon' }, { k: 'arrow', x1: 63, x2: 53, c: 'muted' }, { k: 'box', x1: 65, x2: 100, text: 'ce resto-là' }] },
      'dans lequel': { base: 'relatives', marks: [{ k: 'box', x1: 0, x2: 34, text: 'le contexte' }, { k: 'line', x1: 34, x2: 40, c: 'muted' }, { k: 'box', x1: 40, x2: 100, c: 'cadre', text: 'dans lequel j’ai immigré' }] },
      'dans laquelle': { base: 'relatives', marks: [{ k: 'box', x1: 0, x2: 34, text: 'la situation' }, { k: 'line', x1: 34, x2: 40, c: 'muted' }, { k: 'box', x1: 40, x2: 100, c: 'cadre', text: 'dans laquelle je suis' }] },
      'a laquelle': { base: 'relatives', marks: [{ k: 'box', x1: 0, x2: 34, text: 'une question' }, { k: 'line', x1: 34, x2: 40, c: 'muted' }, { k: 'box', x1: 40, x2: 100, c: 'cadre', text: 'à laquelle je réponds' }] }
    },
    3: {
      'quand': { base: 'simultaneite', marks: [{ k: 'point', x: 36, c: 'cadre', lane: 0 }, { k: 'bar', x1: 8, x2: 80, lane: 1 }] },
      'pis la': { base: 'durees', marks: [{ k: 'point', x: 6 }, { k: 'arrow', x1: 9, x2: 20, c: 'muted' }, { k: 'point', x: 24 }, { k: 'arrow', x1: 27, x2: 38, c: 'cadre' }, { k: 'point', x: 42, c: 'cadre', fill: 'solid' }] },
      'tantot': { base: 'durees', marks: [{ k: 'point', x: 38, c: 'cadre' }, { k: 'point', x: 62, c: 'cadre' }, { k: 'text', x: 34, text: 'plus tôt', dy: -9, c: 'muted' }, { k: 'text', x: 66, text: 'plus tard', dy: -9, c: 'muted' }] },
      'la fin de semaine': { base: 'durees', marks: [{ k: 'bar', x1: 70, x2: 90, c: 'cadre' }, { k: 'text', x: 80, text: 'sam. + dim.', dy: -9, c: 'muted' }] },
      "a l'heure actuelle": { base: 'durees', marks: [{ k: 'bar', x1: 42, x2: 58, c: 'cadre' }, { k: 'point', x: 50 }] },
      'sous peu': { base: 'durees', marks: [{ k: 'gap', x1: 50, x2: 62 }, { k: 'point', x: 62, c: 'cadre' }] }
    },
    6: {
      "le but, c'est de": { base: 'but', marks: [{ k: 'person', x: 4, text: 'je' }, { k: 'arrow', x1: 10, x2: 62, c: 'cadre' }, { k: 'box', x1: 65, x2: 90, c: 'cadre', text: 'un emploi' }, { k: 'flag', x: 94, c: 'cadre' }] }
    },
    9: {
      'me semble que': { base: 'certitude', marks: [{ k: 'bar', x1: 0, x2: 56 }, { k: 'tag', x: 68, text: 'ind.' }] },
      'conformement a': { base: 'certitude', marks: [{ k: 'bar', x1: 0, x2: 94 }, { k: 'tag', x: 30, text: 'règle', c: 'cadre' }] }
    },
    10: {
      'comme': { base: 'ajouter', marks: [{ k: 'box', x1: 0, x2: 34, text: 'des villes' }, { k: 'arrow', x1: 37, x2: 48, c: 'cadre' }, { k: 'box', x1: 51, x2: 72, c: 'cadre', text: 'Québec' }, { k: 'box', x1: 74, x2: 100, c: 'cadre', text: 'Sherbrooke' }] },
      "d'ailleurs": { base: 'ajouter', marks: [{ k: 'box', x1: 0, x2: 42, text: 'quartier vivant' }, { k: 'sign', x: 50, text: '+' }, { k: 'box', x1: 58, x2: 100, c: 'cadre', text: 'un festival' }] },
      'genre': { base: 'ajouter', marks: [{ k: 'box', x1: 0, x2: 40, text: 'il y avait' }, { k: 'sign', x: 49, text: '≈', c: 'muted' }, { k: 'box', x1: 58, x2: 100, c: 'cadre', text: 'cent personnes' }] }
    },
    12: {
      'mets-en': { base: 'tours', marks: [{ k: 'bar', x1: 4, x2: 50, lane: 0 }, { k: 'bar', x1: 53, x2: 66, c: 'cadre', lane: 1 }, { k: 'sign', x: 74, text: '+', lane: 1 }] }
    }
  },

  formal: {
    1: [
      { key: 'relativement à', ex: 'Relativement à votre demande, je vous confirme que le dossier est complet.' },
      { key: 'au chapitre de', ex: 'Au chapitre du logement, la situation s’est nettement améliorée.' },
      { key: 'à cet égard', ex: 'Le quartier est bien desservi. À cet égard, le nouveau métro a tout changé.' }
    ],
    2: [
      { key: 'Le contexte dans lequel', ex: 'Le contexte dans lequel j’ai immigré était difficile.', diag: 'dans lequel' },
      { key: 'La situation dans laquelle', ex: 'La situation dans laquelle je me trouve est temporaire.', diag: 'dans laquelle' },
      { key: 'La question à laquelle', ex: 'C’est une question à laquelle je n’ai pas encore de réponse.', diag: 'a laquelle' }
    ],
    3: [
      { key: "à l'heure actuelle", ex: 'À l’heure actuelle, je travaille à temps partiel.' },
      { key: 'sous peu', ex: 'Vous recevrez une réponse sous peu.' },
      { key: 'dorénavant', ex: 'Dorénavant, le bureau ouvrira à 8 h.' },
      { key: 'à compter de', ex: 'À compter du 1er juillet, le loyer sera de 1 200 $.' }
    ],
    4: [
      { key: 'car', ex: 'Je ne pourrai pas assister à la réunion, car je serai à l’extérieur de la ville.' },
      { key: 'du fait que', ex: 'Du fait que le formulaire était incomplet, la demande a été refusée.' },
      { key: 'par suite de', ex: 'Par suite de travaux, la station sera fermée cette fin de semaine.' },
      { key: 'cela tient au fait que', ex: 'Le retard est important. Cela tient au fait que les documents sont arrivés tard.' }
    ],
    5: [
      { key: 'par conséquent', ex: 'Le dossier est incomplet ; par conséquent, il ne peut pas être traité.' },
      { key: "c'est pourquoi", ex: 'Je déménage à Québec le 1er juillet. C’est pourquoi je souhaite résilier mon abonnement.' },
      { key: 'si bien que', ex: 'Il a beaucoup neigé, si bien que les cours ont été annulés.' },
      { key: "d'où", ex: 'Les taxes ont augmenté, d’où la hausse du loyer.' }
    ],
    6: [
      { key: 'afin que', ex: 'Je vous transmets ces documents afin que vous puissiez compléter mon dossier.' },
      { key: 'dans le but de', ex: 'Je suis des cours du soir dans le but d’obtenir mon diplôme.' },
      { key: 'en vue de', ex: 'Elle prépare son portfolio en vue d’une entrevue.' },
      { key: 'de manière à', ex: 'Classez vos documents de manière à les retrouver facilement.' }
    ],
    7: [
      { key: "dans l'hypothèse où", ex: 'Dans l’hypothèse où le contrat serait renouvelé, je resterais à Montréal.' },
      { key: 'le cas échéant', ex: 'Joignez une preuve de résidence et, le cas échéant, votre permis de travail.' },
      { key: 'pour peu que', ex: 'Le projet peut réussir, pour peu que chacun y mette du sien.' },
      { key: 'faute de quoi', ex: 'Veuillez payer avant le 30 juin, faute de quoi des frais s’appliqueront.' }
    ],
    8: [
      { key: 'en dépit de', ex: 'En dépit du froid, le festival a attiré beaucoup de monde.' },
      { key: 'quand bien même', ex: 'Quand bien même il neigerait, la réunion aurait lieu.' },
      { key: 'or', ex: 'Le formulaire devait arriver lundi. Or, il est arrivé mercredi.' },
      { key: "à l'instar de", ex: 'À l’instar de nombreux nouveaux arrivants, j’ai suivi des cours de francisation.' }
    ],
    9: [
      { key: 'à mon sens', ex: 'À mon sens, cette mesure est nécessaire.' },
      { key: "j'estime que", ex: 'J’estime que ma candidature répond à vos exigences.' },
      { key: 'de toute évidence', ex: 'De toute évidence, le dossier est incomplet.' },
      { key: 'conformément à', ex: 'Conformément à votre demande, je vous envoie les documents.' }
    ],
    10: [
      { key: 'en outre', ex: 'Le logement est bien situé ; en outre, le loyer est raisonnable.' },
      { key: "à titre d'exemple", ex: 'Plusieurs services sont offerts ; à titre d’exemple, des cours de francisation gratuits.' },
      { key: 'à savoir', ex: 'Deux documents sont requis, à savoir une pièce d’identité et une preuve de résidence.' },
      { key: 'qui plus est', ex: 'Le cours est gratuit et, qui plus est, il a lieu le soir.' }
    ],
    11: [
      { key: 'en premier lieu', ex: 'En premier lieu, j’aimerais vous remercier de votre accueil.' },
      { key: "en d'autres termes", ex: 'Le poste est comblé. En d’autres termes, ma candidature n’a pas été retenue.' },
      { key: 'somme toute', ex: 'Somme toute, l’expérience a été très positive.' },
      { key: 'en définitive', ex: 'En définitive, nous avons choisi de rester à Montréal.' }
    ],
    12: [
      { key: 'dans quelle mesure ?', ex: 'Dans quelle mesure ce changement vous touche-t-il ?' }
    ]
  },

  /* Découpages manuels (voir en-tête). */
  lanes: {
    "Ce qui m'intéresse, c'est la proximité du métro.": "{Ce qui m'intéresse,} c'est la proximité du métro.",
    "Le problème, c'est que le loyer a encore augmenté.": "{Le problème,} c'est que le loyer a encore augmenté.",
    "Le problème, là, c'est que personne répond au téléphone.": "{Le problème, là,} c'est que personne répond au téléphone.",
    "Fait que ? Tu l'as eu, l'emploi ?": false,
    "Qu'est-ce que tu fais en fin de semaine ?": "Qu'est-ce que tu fais {en fin de semaine ?}",
    "Le film que j'ai vu hier était excellent.": "Le film {que j'ai vu hier} était excellent.",
    "Le café où on s'est rencontrés a fermé.": "Le café {où on s'est rencontrés} a fermé.",
    'Mon frère, il travaille à Québec.': 'Mon frère, {il travaille à Québec.}',
    'Il est vraiment bon, ce restaurant-là.': '{Il est vraiment bon,} ce restaurant-là.',
    'Je suis arrivée au Québec il y a deux ans.': 'Je suis arrivée au Québec {il y a deux ans.}',
    "Le but, c'est de trouver un emploi dans mon domaine.": "Le but, c'est {de trouver un emploi dans mon domaine.}",
    'Je trouve que les gens sont très accueillants ici.': 'Je trouve que {les gens sont très accueillants ici.}',
    "Je pense que c'est une bonne idée.": "Je pense que {c'est une bonne idée.}",
    "Je ne pense pas qu'il soit disponible.": "Je ne pense pas qu'{il soit disponible.}",
    "Peut-être qu'il va venir plus tard.": false,
    "Moi, je trouve que c'est trop cher.": "Moi, je trouve que {c'est trop cher.}",
    "Me semble que c'était mieux avant.": "Me semble que {c'était mieux avant.}",
    'J’estime que ma candidature répond à vos exigences.': 'J’estime que {ma candidature répond à vos exigences.}',
    "D'un bord c'est pratique, de l'autre c'est bruyant.": "D'un bord c'est pratique, {de l'autre c'est bruyant.}",
    'Mettons que tu gagnes à la loterie : tu fais quoi ?': '{Mettons que tu gagnes à la loterie :} tu fais quoi ?',
    "J'étais tellement fatiguée que je me suis endormie dans le métro.": "J'étais tellement fatiguée {que je me suis endormie dans le métro.}",
    'Il y avait genre cent personnes.': 'Il y avait {genre cent personnes.}',
    'Je travaille à temps partiel, c\'est-à-dire trois jours par semaine.': "Je travaille à temps partiel, {c'est-à-dire trois jours par semaine.}",
    "D'abord, j'ai cherché sur Internet ; ensuite, j'ai visité.": "D'abord, j'ai cherché sur Internet ; {ensuite, j'ai visité.}",
    'Le retard est important. Cela tient au fait que les documents sont arrivés tard.': 'Le retard est important. {Cela tient au fait que les documents sont arrivés tard.}',
    'Le poste est comblé. En d’autres termes, ma candidature n’a pas été retenue.': 'Le poste est comblé. {En d’autres termes, ma candidature n’a pas été retenue.}',
    'Joignez une preuve de résidence et, le cas échéant, votre permis de travail.': 'Joignez une preuve de résidence et{, le cas échéant, votre permis de travail.}',
    'Le cours est gratuit et, qui plus est, il a lieu le soir.': 'Le cours est gratuit et{, qui plus est, il a lieu le soir.}',
    'C’est une question à laquelle je n’ai pas encore de réponse.': 'C’est une question {à laquelle je n’ai pas encore de réponse.}',
    'La situation dans laquelle je me trouve est temporaire.': 'La situation {dans laquelle je me trouve} est temporaire.',
    'Le contexte dans lequel j’ai immigré était difficile.': 'Le contexte {dans lequel j’ai immigré} était difficile.'
  },


  /* Ajout C — correspondances « même image que… » pour les marches 2 et 3 (clé de la forme → libellé de schéma).
     '#clé' = schéma construit (custom) ; '@mot' = ligne d'un schéma « A → B » où ce mot est en gras.
     Seulement quand la relation dessinée est vraiment la même. */
  alias2: {
    1: {
      'au sujet de': 'Pour ce qui est de…', 'concernant': 'Pour ce qui est de…', 'en ce qui concerne': 'Pour ce qui est de…',
      'en ce qui a trait à': 'Pour ce qui est de…', 'en matière de': 'Pour ce qui est de…', 'dans le domaine de': 'Pour ce qui est de…',
      'quant à moi': 'Quant à…', 'pour ma part': 'Quant à…',
      'à ce sujet': '#à cet égard', 'à propos de ça': '#à cet égard', 'là-dessus': '#à cet égard', 'sur ce point': '#à cet égard',
      'justement': '#en parlant de ça', 'pis, en parlant de ça': '#en parlant de ça',
      "ce qui me dérange, c'est": 'Ce qui…, c’est…', "ce que je trouve intéressant, c'est": 'Ce qui…, c’est…',
      "ce dont on parle, c'est": 'Ce qui…, c’est…', "ce à quoi je fais référence, c'est": 'Ce qui…, c’est…',
      "ce que j'essaie d'expliquer, c'est": 'Ce qui…, c’est…', "ce qui est important, c'est que": 'Ce qui…, c’est…',
      "ce que je veux surtout souligner, c'est": 'Ce qui…, c’est…', "la question, c'est de savoir si": 'Ce qui…, c’est…',
      "dans le fond, ce que je veux dire, c'est": 'Ce qui…, c’est…', "moi, ce que je trouve important, c'est": 'Ce qui…, c’est…'
    },
    2: {
      'le moment où': 'où', 'le jour où': 'où', "l'époque où": 'où', "l'endroit où": 'où',
      'la façon dont': 'dont', 'la manière dont': 'dont', 'celle dont': 'dont', 'ce dont': 'dont',
      'celui qui': 'qui', 'celle qui': 'qui', 'ceux qui': 'qui', 'celles qui': 'qui', 'ce qui': 'qui',
      'celui que': 'que', 'ce que': 'que',
      'le sujet auquel': 'auquel / sur lequel…', 'celui auquel': 'auquel / sur lequel…', 'celle à laquelle': 'auquel / sur lequel…',
      'sur lequel, sur laquelle, sur lesquels, sur lesquelles': 'auquel / sur lequel…',
      'dans lequel, dans laquelle, dans lesquels, dans lesquelles': '#dans lequel',
      'les circonstances dans lesquelles': '#dans laquelle',
      'les raisons pour lesquelles': '#la raison pour laquelle',
      'mon frère, il travaille à québec': '#mon frère, il', 'cette émission-là, je la connais': '#mon frère, il',
      'il est vraiment bon, ce restaurant-là': '#ce restaurant-là', 'je la connais bien, cette personne-là': '#ce restaurant-là',
      "c'est compliqué, cette situation-là": '#ce restaurant-là'
    },
    3: {
      'lorsque': '#quand', 'tandis que': 'pendant que', 'en même temps que': 'pendant que', 'pendant ce temps': 'pendant que',
      'aussi longtemps que': 'tant que', 'aussitôt que': 'dès que', 'à mesure que': 'au fur et à mesure que',
      'au fil de': 'au fur et à mesure que', 'petit à petit': 'au fur et à mesure que', 'progressivement': 'au fur et à mesure que',
      'toutes les fois que': 'chaque fois que', 'dès nom': 'à partir de', "d'ici à": 'd’ici', "en l'espace de": 'en',
      'durant': 'pendant', 'voilà': 'ça fait… que', 'ça fait': 'ça fait… que', "jusqu'au moment où": 'jusqu’à ce que',
      'en attendant que': 'jusqu’à ce que', 'après avoir/être': 'après que / après + inf. passé', 'après nom': 'après que / après + inf. passé',
      'avant nom': 'avant de / avant que', 'une fois': 'une fois que', 'depuis lors': 'depuis', 'au terme de': 'au bout de',
      'tout à l\'heure': '#tantôt', 'bientôt': '#sous peu', "d'ici peu": '#sous peu',
      'maintenant': "#à l'heure actuelle", 'actuellement': "#à l'heure actuelle", 'en ce moment': "#à l'heure actuelle",
      'présentement': "#à l'heure actuelle", 'astheure': "#à l'heure actuelle", 'ces temps-ci': "#à l'heure actuelle",
      'pour le moment': "#à l'heure actuelle", "pour l'instant": "#à l'heure actuelle",
      'en fin de semaine': '#la fin de semaine'
    },
    4: {
      'étant donné que': 'puisque', 'dès lors que': 'puisque', 'dans la mesure où': 'puisque',
      'parce que là': 'parce que', "c'est que": 'parce que', "la raison, c'est que": 'parce que', "cela s'explique par": 'parce que',
      'en effet': 'parce que', "ce qui explique cette situation, c'est": 'parce que',
      'en raison de': 'comme', 'du fait de': 'comme', 'compte tenu de': 'comme', 'étant donné': 'comme', 'vu nom': 'comme',
      'à la suite de': 'comme', 'ce qui explique que': 'comme', "ce qui m'a poussée à": 'comme', "ce qui m'a amenée à": 'comme',
      'par manque de': 'faute de + nom', 'en raison du manque de': 'faute de + nom',
      'surtout que': 'd’autant plus que', "d'autant que": 'd’autant plus que', 'notamment parce que': 'd’autant plus que',
      'en particulier parce que': 'd’autant plus que', "d'autant plus": 'd’autant plus que'
    },
    5: {
      'en conséquence': 'donc / alors', 'il en résulte que': 'donc / alors', 'ce qui fait que': 'donc / alors', 'de ce fait': 'donc / alors',
      'voilà pourquoi': 'donc / alors', 'dès lors': 'donc / alors', 'résultat': 'donc / alors', 'pour cette raison': 'donc / alors',
      'ce qui signifie que': 'donc / alors', 'cela implique que': 'donc / alors', 'de là': 'donc / alors', 'en conséquence de': 'donc / alors',
      'ça veut dire que': 'donc / alors', 'cela a pour conséquence de': 'donc / alors', 'ce qui entraîne': 'donc / alors', 'ce qui provoque': 'donc / alors',
      'fait que là': 'fait que [F-QC]', 'faque là': 'fait que [F-QC]',
      'de sorte que': 'si bien que + ind.', 'de manière que': 'si bien que + ind.', 'de façon que': 'si bien que + ind.',
      'au point que': 'tellement… que', 'à tel point que': 'tellement… que', 'au point de': 'tellement… que',
      'si adj./adv': 'tellement… que', 'tellement': 'tellement… que', 'tant de': 'tellement… que', 'tellement de': 'tellement… que',
      'verbe tellement que': 'tellement… que', 'verbe tant que': 'tellement… que',
      'trop adj./adv': 'trop… pour', 'assez adj./adv': 'assez… pour', 'suffisamment': 'assez… pour'
    },
    6: {
      'de sorte que': 'pour que + subj.', 'de manière que': 'pour que + subj.', 'de façon que': 'pour que + subj.',
      "dans l'intention de": 'pour + inf.', 'de façon à': 'pour + inf.', 'pour pouvoir': 'pour + inf.',
      'mon objectif est de': "#le but, c'est de", 'mon but est de': "#le but, c'est de", "l'objectif consiste à": "#le but, c'est de",
      "l'idée, c'est de": "#le but, c'est de", "ce que je vise, c'est": "#le but, c'est de", "ce que je veux, c'est": "#le but, c'est de",
      "ce que je cherche à faire, c'est": "#le but, c'est de", "ce à quoi j'aspire, c'est": "#le but, c'est de",
      "ce vers quoi je tends, c'est": "#le but, c'est de", "ce pour quoi je travaille, c'est": "#le but, c'est de",
      "ce que j'essaie de faire, c'est": "#le but, c'est de", 'à long terme, je voudrais': "#le but, c'est de",
      'dans le fond, je veux surtout': "#le but, c'est de",
      'pour que ne pas': 'pour ne pas / pour éviter de', "afin d'éviter de": 'pour ne pas / pour éviter de',
      'par précaution': 'pour ne pas / pour éviter de', 'dans le but de prévenir': 'pour ne pas / pour éviter de',
      'de crainte de': 'de peur de / de peur que', 'de crainte que': 'de peur de / de peur que'
    },
    7: {
      'si plus-que-parfait → conditionnel passé': 'si + plus-que-parfait → cond. passé',
      'imaginons que': 'si + imparfait → conditionnel', 'supposons que': 'si + imparfait → conditionnel',
      'à supposer que': 'si + imparfait → conditionnel', 'en supposant que': 'si + imparfait → conditionnel',
      'en admettant que': 'si + imparfait → conditionnel', 'admettons que': 'si + imparfait → conditionnel',
      'imagine que': 'si + imparfait → conditionnel', 'mettons, là, que': 'si + imparfait → conditionnel',
      'dans le cas où': 'au cas où + cond.', "dans l'éventualité où": 'au cas où + cond.', 'en cas de': 'au cas où + cond.',
      'dans ce cas': 'au cas où + cond.', "si c'est le cas": 'au cas où + cond.', 'si tel est le cas': 'au cas où + cond.',
      "s'il y a lieu": 'au cas où + cond.', 'au besoin': 'au cas où + cond.', 'si nécessaire': 'au cas où + cond.',
      'à condition de': 'à condition que + subj.', 'pourvu que': 'à condition que + subj.', 'du moment que': 'à condition que + subj.',
      'pour autant que': 'à condition que + subj.', 'sous réserve de': 'à condition que + subj.', 'sous réserve que': 'à condition que + subj.',
      'à moins de': 'sauf si / à moins que', 'excepté si': 'sauf si / à moins que', 'sauf nom': 'sauf si / à moins que',
      "à l'exception de": 'sauf si / à moins que', 'hormis': 'sauf si / à moins que',
      'sinon': 'sauf si / à moins que', 'autrement': 'sauf si / à moins que', 'sans quoi': 'sauf si / à moins que'
    },
    8: {
      'mais': 'par contre / en revanche', 'cependant': 'par contre / en revanche', 'toutefois': 'par contre / en revanche',
      'néanmoins': 'par contre / en revanche', 'ben oui, mais': 'par contre / en revanche', 'en même temps': 'par contre / en revanche',
      'certes mais': 'par contre / en revanche', "c'est vrai, mais": 'par contre / en revanche', 'je comprends, sauf que': 'par contre / en revanche',
      'pourtant': 'même si + ind.', 'quoique': 'bien que + subj.',
      'quand même': 'malgré + nom', 'tout de même': 'malgré + nom', 'malgré tout': 'malgré + nom', 'malgré cela': 'malgré + nom',
      'même là': 'malgré + nom', 'ça reste que': 'malgré + nom', 'il reste que': 'malgré + nom', "n'empêche que": 'malgré + nom',
      "quoi qu'il en soit": 'malgré + nom',
      'au contraire': 'contrairement à', "à l'inverse": 'contrairement à', 'inversement': 'contrairement à', 'à la différence de': 'contrairement à',
      'aussi adj': 'aussi… que / autant que', 'autant de': 'aussi… que / autant que', 'de même que': 'aussi… que / autant que',
      'ainsi que': 'aussi… que / autant que', 'comme nom/proposition': 'aussi… que / autant que', 'davantage que': 'plus… que',
      "d'un côté de l'autre": 'alors que / tandis que', "d'une part d'autre part": 'alors que / tandis que',
      "d'un autre côté": 'alors que / tandis que', 'en contrepartie': 'alors que / tandis que',
      'à la place de': 'au lieu de / plutôt que'
    },
    9: {
      'je crois que': 'je pense que / je trouve que', 'je considère que': 'je pense que / je trouve que', 'selon moi': 'je pense que / je trouve que',
      'pour ma part': 'je pense que / je trouve que', 'personnellement': 'je pense que / je trouve que',
      'en ce qui me concerne': 'je pense que / je trouve que', "j'ai l'impression que": 'je pense que / je trouve que',
      'je dirais que': 'je pense que / je trouve que', "j'aurais tendance à penser que": 'je pense que / je trouve que',
      'moi, je pense que': 'je pense que / je trouve que', 'dans le fond, moi, je pense que': 'je pense que / je trouve que',
      'il me semble que': '#me semble que', "j'ai comme l'impression que": '#me semble que',
      'je suis certain que': 'je suis certaine que', 'je suis convaincu que': 'je suis certaine que', 'il est certain que': 'je suis certaine que',
      'clairement': 'il est évident que', 'évidemment': 'il est évident que', 'sans aucun doute': 'il est évident que', 'assurément': 'il est évident que',
      'peut-être': 'peut-être que', 'possiblement': 'peut-être que', 'peut-être bien': 'peut-être que',
      'je ne suis pas sûr que': 'je ne pense pas que',
      'selon ce que': '@selon', "d'après ce que": '@d’après', 'aux yeux de': '@selon', 'à en croire': '@selon'
    },
    10: {
      'et': 'en plus / de plus', 'aussi': 'en plus / de plus', 'également': 'en plus / de plus', 'de même': 'en plus / de plus',
      'de même que': 'en plus / de plus', 'ainsi que': 'en plus / de plus', 'par ailleurs': 'en plus / de plus',
      'de surcroît': 'en plus / de plus', 'sans compter': 'en plus / de plus', 'sans compter que': 'en plus / de plus',
      'outre': 'en plus / de plus', 'pis': 'en plus / de plus',
      'non seulement mais encore': 'non seulement… mais aussi', 'voire': 'non seulement… mais aussi', 'voire même': 'non seulement… mais aussi',
      'en particulier': 'notamment', 'particulièrement': 'notamment', 'tel que': '#comme', 'tels que': '#comme',
      "prenons l'exemple de": 'par exemple', 'mettons': '#genre', 'disons': '#genre',
      'soit': 'c’est-à-dire', 'plus précisément': 'c’est-à-dire', 'plus spécifiquement': 'c’est-à-dire', 'en ce sens que': 'c’est-à-dire',
      "à l'aide de": 'grâce à / avec / en + participe', 'au moyen de': 'grâce à / avec / en + participe',
      'par nom': 'grâce à / avec / en + participe', "par l'intermédiaire de": 'grâce à / avec / en + participe',
      'par le biais de': 'grâce à / avec / en + participe', 'en passant par': 'grâce à / avec / en + participe',
      'en utilisant': 'grâce à / avec / en + participe', 'au moyen duquel': 'grâce à / avec / en + participe',
      'de cette manière': 'grâce à / avec / en + participe', 'de cette façon': 'grâce à / avec / en + participe'
    },
    11: {
      "d'abord… ensuite": 'd’abord… ensuite… enfin',
      "d'abord": 'd’abord… ensuite… enfin', "tout d'abord": 'd’abord… ensuite… enfin', 'pour commencer': 'd’abord… ensuite… enfin',
      'premièrement': 'd’abord… ensuite… enfin', 'dans un premier temps': 'd’abord… ensuite… enfin', 'ensuite': 'd’abord… ensuite… enfin',
      'puis': 'd’abord… ensuite… enfin', 'après': 'd’abord… ensuite… enfin', 'dans un deuxième temps': 'd’abord… ensuite… enfin',
      'par la suite': 'd’abord… ensuite… enfin', 'en deuxième lieu': 'd’abord… ensuite… enfin', 'bon, ensuite': 'd’abord… ensuite… enfin',
      'pis après': 'd’abord… ensuite… enfin', 'fait que là': 'd’abord… ensuite… enfin', 'pis là': 'd’abord… ensuite… enfin',
      "en d'autres mots": 'autrement dit / c’est-à-dire', 'ce qui revient à dire que': 'autrement dit / c’est-à-dire',
      'cela signifie que': 'autrement dit / c’est-à-dire', 'pour le dire autrement': 'autrement dit / c’est-à-dire',
      "ce que je veux dire, c'est": 'autrement dit / c’est-à-dire', "ce que j'essaie d'expliquer, c'est": 'autrement dit / c’est-à-dire',
      'je veux dire': 'autrement dit / c’est-à-dire', 'enfin, je veux dire': 'autrement dit / c’est-à-dire',
      "ce que je veux dire, là, c'est que": 'autrement dit / c’est-à-dire',
      'au fond': 'dans le fond', 'essentiellement': 'dans le fond',
      'en réalité': 'en fait', 'à vrai dire': 'en fait', 'ou plutôt': 'en fait', 'plus précisément': 'en fait', 'je me reprends': 'en fait',
      'ben, en fait': 'en fait', "c'est pas exactement ça": 'en fait', 'attends, je recommence': 'en fait', "maintenant que j'y pense": 'en fait',
      'réflexion faite': 'finalement', 'tout bien considéré': 'finalement', 'au bout du compte': 'finalement', 'tout compte fait': 'finalement',
      'en bref': 'bref / en somme', 'en gros': 'bref / en somme', 'pour résumer': 'bref / en somme', 'en résumé': 'bref / en somme',
      'pour conclure': 'bref / en somme', 'en conclusion': 'bref / en somme', 'bon ben': 'bref / en somme', 'en tout cas': 'bref / en somme'
    },
    12: {
      'oui': 'Ah oui ? / Je vois', 'ouais': 'Ah oui ? / Je vois', 'ok': 'Ah oui ? / Je vois', "d'accord": 'Ah oui ? / Je vois',
      "c'est ça": 'Ah oui ? / Je vois', 'effectivement': 'Ah oui ? / Je vois', 'tout à fait': 'Ah oui ? / Je vois',
      "t'sais": 'Ah oui ? / Je vois', 'sérieux': 'Ah oui ? / Je vois', "c'est pas vrai": 'Ah oui ? / Je vois',
      'voyons donc': 'Ah oui ? / Je vois', 'ben voyons': 'Ah oui ? / Je vois', 'coudon': 'Ah oui ? / Je vois',
      'exactement': '#mets-en', 'absolument': '#mets-en', "je suis d'accord": '#mets-en', "c'est vrai": '#mets-en',
      "tout à fait d'accord": '#mets-en', 'ben oui': '#mets-en', "c'est clair": '#mets-en',
      'je comprends, mais': 'C’est vrai, mais…', 'oui, sauf que': 'C’est vrai, mais…', 'ben oui, mais': 'C’est vrai, mais…', 'en même temps': 'C’est vrai, mais…',
      "qu'est-ce que tu veux dire par": 'Qu’est-ce que tu veux dire ?', 'tu veux dire que': 'Qu’est-ce que tu veux dire ?',
      'est-ce que tu peux préciser': 'Qu’est-ce que tu veux dire ?', 'tu peux donner un exemple': 'Qu’est-ce que tu veux dire ?',
      'comment ça': 'Qu’est-ce que tu veux dire ?', 'pourquoi': 'Qu’est-ce que tu veux dire ?', 'de quelle manière': 'Qu’est-ce que tu veux dire ?',
      'dans quel sens': 'Qu’est-ce que tu veux dire ?', 'en quoi': 'Qu’est-ce que tu veux dire ?', 'à quel point': 'Qu’est-ce que tu veux dire ?',
      'et ensuite': 'Et après ? / Pis ? [F-QC]', "qu'est-ce qui s'est passé": 'Et après ? / Pis ? [F-QC]',
      "et qu'est-ce que tu as fait": 'Et après ? / Pis ? [F-QC]', 'puis': 'Et après ? / Pis ? [F-QC]', 'et là': 'Et après ? / Pis ? [F-QC]',
      'juste une seconde': 'Attends… / Justement…', 'excuse-moi': 'Attends… / Justement…', 'je voudrais ajouter quelque chose': 'Attends… / Justement…',
      'pour revenir à ce que tu disais': 'Attends… / Justement…', 'à ce propos': 'Attends… / Justement…',
      "ce que je voulais dire, c'est": 'Attends… / Justement…', 'mais là': 'Attends… / Justement…', 'ben justement': 'Attends… / Justement…'
    }
  },

  /* Formes à ne pas rapprocher d'un schéma au libellé voisin (même mot, autre sens). */
  noDiag: {
    3: ['en mois/année', 'en participe présent', 'à heure', 'le date', 'avant', 'après'],
    10: ['sans nom'],
    12: ['ok']
  },

  /* Formes courantes surtout écrites (marche 3) pour les intentions sans forme marquée [S]. */
  written: {
    5: ['par conséquent', 'en conséquence', "c'est pourquoi", 'si bien que', "d'où", 'il en résulte que', 'de ce fait', 'dès lors',
        'cela implique que', 'en conséquence de', 'cela a pour conséquence de'],
    6: ['afin que', 'dans le but de', "dans l'intention de", 'en vue de', 'de manière à', 'de façon à', 'de manière que', 'de façon que',
        'de crainte de', 'de crainte que', "afin d'éviter de", 'dans le but de prévenir', "l'objectif consiste à"]
  },

  /* Ce qui suit l'expression, en mots simples. */
  slots: {
    'nom': ['un nom', 'le logement, la réunion…'],
    'GN': ['un nom', ''],
    'nom / GN': ['un nom', ''],
    'pronom': ['un pronom', 'moi, lui…'],
    'nom/pronom': ['un nom ou un pronom', ''],
    'nom/inf.': ['un nom ou un verbe', ''],
    'inf./nom': ['un verbe ou un nom', ''],
    'nom/proposition': ['un nom ou une phrase', ''],
    'nom/date/durée': ['un nom, une date ou une durée', ''],
    'ind.': ['une phrase', 'indicatif'],
    'subj.': ['une phrase', 'subjonctif'],
    'subj./ind.': ['une phrase', 'subjonctif ou indicatif'],
    'cond.': ['une phrase', 'conditionnel'],
    'inf.': ['un verbe', 'infinitif'],
    'inf. passé': ['avoir / être + participe', 'infinitif passé'],
    'participe passé': ['un participe passé', ''],
    'participe présent': ['un participe présent', '-ant'],
    'proposition': ['une phrase', ''],
    'proposition interrogative': ['une question', ''],
    'proposition interrogative indirecte': ['une question indirecte', ''],
    'interrogation indirecte': ['une question indirecte', ''],
    'relative': ['une relative', 'qui…, que…'],
    'précision': ['une précision', ''],
    'antécédent': ['un nom', 'antécédent'],
    'durée': ['une durée', 'deux ans, trois jours…'],
    'date': ['une date', 'le 1er juillet…'],
    'heure': ['une heure', ''],
    'moment': ['un moment', ''],
    'période': ['une période', 'semaine, mois…'],
    'mois/année': ['un mois ou une année', ''],
    'adj.': ['un adjectif', 'fatiguée, cher…'],
    'adv.': ['un adverbe', ''],
    'adj./adv.': ['un adjectif ou un adverbe', ''],
    'présent': ['une phrase', 'présent'],
    'imparfait': ['une phrase', 'imparfait'],
    'plus-que-parfait': ['une phrase', 'plus-que-parfait'],
    'imparfait/plus-que-parfait': ['une phrase', 'imparfait ou plus-que-parfait'],
    'futur': ['une phrase', 'futur'],
    'impératif': ['une phrase', 'impératif'],
    'conditionnel présent': ['une phrase', 'conditionnel présent'],
    'conditionnel passé': ['une phrase', 'conditionnel passé']
  },

  regLabel: { C: 'Courant', O: 'Oral', QC: 'Québec', 'F-QC': 'Familier québécois', S: 'Soutenu', R: 'À reconnaître', D: 'Déconseillé' }
};
