/* Prototype 1 + 4 · B — « Je veux… + l’antisèche en poche » : données propres au prototype.
   Reprises du prototype 1 (alias, schémas construits, registre formel, découpages, cases)
   et du prototype 4 (pictogrammes). Tout le reste vient du site (SITE.meta, CADRES, VIZ).

   - icon    : le pictogramme de chaque intention (une ligne d’un schéma du site), le même partout.
   - alias   : formule clé → ligne de schéma du même onglet qui la dessine déjà.
   - custom  : schémas construits pour des formules qui n’en ont pas (même langage de marques).
   - formal  : registre « Formel » — exemples écrits pour des expressions [S] de l’onglet.
   - lanes   : découpage manuel « cadre / principale » d’un exemple ({…} = orange ; le reste = violet).
   - slots   : ce qui suit l’expression, en mots simples.                                        */
window.PBDATA = {

  /* Pictogrammes du prototype 4 : [id du schéma, ligne] ; la fonction 9 superpose deux jauges. */
  icon: {
    1: ['relief', 1], 2: ['relatives', 0], 3: ['durees', 1], 4: ['cause', 0], 5: ['consequence', 0], 6: ['but', 0],
    7: ['si', 2], 8: ['concession', 0], 9: ['certitude', [1, 5]], 10: ['ajouter', 0], 11: ['discours', 0], 12: ['tours', 0]
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

  /* Registre « Formel » : expression du site (clé de recherche) + exemple écrit. */
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

  /* Ce qui suit l'expression, en mots simples. */
  slots: {
    'nom': ['un nom', 'le logement, la réunion…'],
    'ind.': ['une phrase', 'indicatif'],
    'subj.': ['une phrase', 'subjonctif'],
    'cond.': ['une phrase', 'conditionnel'],
    'inf.': ['un verbe', 'infinitif'],
    'inf. passé': ['avoir / être + participe', 'infinitif passé'],
    'durée': ['une durée', 'deux ans, trois jours…'],
    'date': ['une date', 'le 1er juillet…'],
    'adj.': ['un adjectif', 'fatiguée, cher…'],
    'nom/inf.': ['un nom ou un verbe', ''],
    'proposition': ['une phrase', '']
  },

  regLabel: { C: 'Courant', O: 'Oral', QC: 'Québec', 'F-QC': 'Familier québécois', S: 'Soutenu', R: 'À reconnaître', D: 'Déconseillé' }
};
