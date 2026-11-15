/* Couche « essentiels » : pour chaque onglet, l'intention en langage simple,
   4 à 5 formules clés avec un exemple oral, les variantes québécoises,
   un piège à retenir et une relance pour continuer la conversation.
   r = registre ([C] par défaut) ; c = ce qui suit (notation). */

SITE.set('essentiels', [
  {
    tab: 1, je: 'Dire de quoi je parle', moment: 'commencer',
    quand: 'Pour lancer un sujet, changer de sujet ou mettre une idée en avant.',
    cles: [
      { e: 'Pour ce qui est de…', c: '+ nom', ex: "Pour ce qui est du logement, j'ai enfin trouvé quelque chose." },
      { e: 'À propos de…', c: '+ nom', ex: 'À propos de la réunion de demain, est-ce qu’elle est maintenue ?' },
      { e: "Ce qui m'intéresse, c'est…", ex: "Ce qui m'intéresse, c'est la proximité du métro." },
      { e: "Le problème, c'est que…", c: '+ ind.', ex: "Le problème, c'est que le loyer a encore augmenté." }
    ],
    qc: [
      { e: 'En parlant de ça…', r: 'O', ex: 'En parlant de ça, as-tu trouvé une garderie ?' },
      { e: "Le problème, là, c'est que…", r: 'F-QC', ex: "Le problème, là, c'est que personne répond au téléphone." }
    ],
    attention: '*Ce que* je veux dire (complément) ≠ *ce qui* me dérange (sujet).',
    relance: "Et toi, qu'est-ce qui compte le plus pour toi ?"
  },
  {
    tab: 2, je: 'Décrire quelqu’un ou quelque chose', moment: 'expliquer',
    quand: 'Pour ajouter une information sur une personne, un lieu, un objet, sans répéter les noms.',
    cles: [
      { e: 'qui', ex: "J'ai une collègue qui parle cinq langues." },
      { e: 'que', ex: "Le film que j'ai vu hier était excellent." },
      { e: 'dont', ex: "C'est le quartier dont je t'ai parlé." },
      { e: 'où', ex: "Le café où on s'est rencontrés a fermé." },
      { e: 'la raison pour laquelle', ex: "C'est la raison pour laquelle j'ai changé d'emploi." }
    ],
    qc: [
      { e: 'Mon frère, il…', r: 'O', ex: 'Mon frère, il travaille à Québec.' },
      { e: '…, ce restaurant-là.', r: 'O', ex: 'Il est vraiment bon, ce restaurant-là.' }
    ],
    attention: '*Le projet que je participe* ✗ → le projet **auquel** je participe.',
    relance: "Comment il est, ton quartier ?"
  },
  {
    tab: 3, je: 'Raconter ce qui s’est passé', moment: 'raconter',
    quand: 'Pour situer un événement, dire depuis quand, raconter dans l’ordre.',
    cles: [
      { e: 'il y a', c: '+ durée', ex: 'Je suis arrivée au Québec il y a deux ans.' },
      { e: 'depuis que', c: '+ ind.', ex: "Depuis que j'habite ici, je prends le métro." },
      { e: 'quand', c: '+ ind.', ex: 'Quand je suis arrivée, il faisait moins vingt.' },
      { e: 'avant de', c: '+ inf.', ex: "Avant de partir, j'ai tout vérifié." },
      { e: 'après', c: '+ inf. passé', ex: "Après avoir signé le bail, j'ai fait mon changement d'adresse." }
    ],
    qc: [
      { e: 'Pis là…', r: 'F-QC', ex: 'Pis là, le propriétaire m’appelle.' },
      { e: 'tantôt', r: 'QC', ex: "Je t'appelle tantôt." },
      { e: 'la fin de semaine', r: 'QC', ex: "Qu'est-ce que tu fais en fin de semaine ?" }
    ],
    attention: '*Il y a trois jours* (un moment) ≠ *depuis trois jours* (ça continue).',
    relance: "Et ensuite, qu'est-ce qui s'est passé ?"
  },
  {
    tab: 4, je: 'Expliquer pourquoi', moment: 'expliquer',
    quand: 'Pour donner une raison, justifier une décision.',
    cles: [
      { e: 'parce que', c: '+ ind.', ex: 'Je suis en retard parce que le métro était arrêté.' },
      { e: 'comme', c: '+ ind.', ex: "Comme il pleuvait, on a pris l'autobus." },
      { e: 'à cause de', c: '+ nom', ex: "À cause de la tempête, l'école est fermée." },
      { e: 'grâce à', c: '+ nom', ex: "Grâce à mon voisin, j'ai trouvé un emploi." },
      { e: 'vu que', c: '+ ind.', r: 'O', ex: 'Vu que tu es là, on peut commencer.' }
    ],
    qc: [
      { e: "C'est parce que…", ex: "— Pourquoi tu as déménagé ? — C'est parce que c'était trop petit." },
      { e: "Ben, c'est parce que…", r: 'F-QC', ex: "Ben, c'est parce que j'avais pas le choix." }
    ],
    attention: '*Grâce à* : cause positive. *À cause de* : cause souvent négative.',
    relance: 'Pourquoi tu dis ça ?'
  },
  {
    tab: 5, je: 'Dire ce qui en résulte', moment: 'expliquer',
    quand: 'Pour présenter le résultat, l’effet, la suite logique.',
    cles: [
      { e: 'donc', ex: 'Le magasin était fermé, donc je reviendrai demain.' },
      { e: 'alors', ex: 'Il neigeait beaucoup, alors on est restés à la maison.' },
      { e: "c'est pour ça que", c: '+ ind.', ex: "J'ai un examen lundi, c'est pour ça que j'étudie." },
      { e: 'tellement… que', c: '+ adj.', ex: "J'étais tellement fatiguée que je me suis endormie dans le métro." }
    ],
    qc: [
      { e: 'Fait que…', r: 'F-QC', ex: "C'était complet, fait que je suis partie." },
      { e: 'Ça fait que…', r: 'F-QC', ex: "J'ai manqué l'autobus, ça fait que je suis arrivée en retard." }
    ],
    attention: '*Parce que* répond à « pourquoi ? » ; *donc* et *fait que* donnent le résultat.',
    relance: "Et qu'est-ce que ça a changé pour toi ?"
  },
  {
    tab: 6, je: 'Dire ce que je veux faire', moment: 'expliquer',
    quand: 'Pour parler d’un objectif, d’une intention, de ce qu’on veut éviter.',
    cles: [
      { e: 'pour', c: '+ inf.', ex: "J'économise pour acheter une auto." },
      { e: 'pour que', c: '+ subj.', ex: 'Je parle lentement pour que tout le monde comprenne.' },
      { e: 'afin de', c: '+ inf.', ex: 'Je vous écris afin de confirmer mon rendez-vous.' },
      { e: "Le but, c'est de…", c: '+ inf.', ex: "Le but, c'est de trouver un emploi dans mon domaine." },
      { e: 'pour ne pas', c: '+ inf.', ex: "Je pars tôt pour ne pas manquer l'autobus." }
    ],
    qc: [
      { e: 'question de…', c: '+ inf.', r: 'O, QC', ex: 'On se voit samedi, question de jaser un peu.' },
      { e: 'histoire de…', c: '+ inf.', r: 'O', ex: 'Je vais faire un tour, histoire de voir le quartier.' }
    ],
    attention: 'Même sujet → *pour* + infinitif. Sujets différents → *pour que* + subjonctif.',
    relance: "Qu'est-ce que tu aimerais faire, toi ?"
  },
  {
    tab: 7, je: 'Imaginer, poser une condition', moment: 'expliquer',
    quand: 'Pour imaginer une situation, poser une condition, prévoir.',
    cles: [
      { e: 'si', c: '+ présent → futur', ex: "Si j'ai le temps, je t'appellerai." },
      { e: 'si', c: '+ imparfait → conditionnel', ex: "Si j'avais plus d'argent, j'achèterais une maison." },
      { e: 'au cas où', c: '+ cond.', ex: 'Prends un parapluie au cas où il pleuvrait.' },
      { e: 'à condition que', c: '+ subj.', ex: 'Je viens à condition que tu m’attendes.' },
      { e: 'sauf si', c: '+ ind.', ex: "Je viendrai, sauf s'il neige trop." }
    ],
    qc: [
      { e: 'Mettons que…', r: 'O, QC', ex: 'Mettons que tu gagnes à la loterie : tu fais quoi ?' },
      { e: 'Si jamais…', ex: "Si jamais tu as besoin d'aide, appelle-moi." }
    ],
    attention: '*Si j’avais…, je ferais…* — jamais *si j’aurais*.',
    relance: "Et toi, qu'est-ce que tu ferais à ma place ?"
  },
  {
    tab: 8, je: 'Nuancer, ne pas être d’accord', moment: 'reagir',
    quand: 'Pour comparer, opposer deux idées, reconnaître un point tout en gardant le sien.',
    cles: [
      { e: 'par contre', ex: "Le loyer est cher, par contre l'appartement est grand." },
      { e: 'alors que', c: '+ ind.', ex: "Moi, j'aime l'hiver, alors que mon mari le déteste." },
      { e: 'même si', c: '+ ind.', ex: "J'y vais même si je suis fatiguée." },
      { e: 'malgré', c: '+ nom', ex: 'Malgré le froid, on est sortis.' },
      { e: 'bien que', c: '+ subj.', ex: "Bien qu'il soit tard, je continue." }
    ],
    qc: [
      { e: 'Oui, mais…', ex: "Oui, mais c'est loin du métro." },
      { e: 'Sauf que…', ex: "C'est beau, sauf que c'est cher." },
      { e: "D'un bord… de l'autre…", r: 'F-QC', ex: "D'un bord c'est pratique, de l'autre c'est bruyant." }
    ],
    attention: '*Même si* + indicatif ; *bien que* + subjonctif.',
    relance: 'Tu vois ça comment, toi ?'
  },
  {
    tab: 9, je: 'Donner mon avis', moment: 'reagir',
    quand: 'Pour dire ce que je pense, à quel point j’en suis sûre.',
    cles: [
      { e: 'je trouve que', c: '+ ind.', ex: 'Je trouve que les gens sont très accueillants ici.' },
      { e: 'je pense que', c: '+ ind.', ex: "Je pense que c'est une bonne idée." },
      { e: 'à mon avis', ex: 'À mon avis, il faudrait attendre.' },
      { e: 'je ne pense pas que', c: '+ subj.', ex: "Je ne pense pas qu'il soit disponible." },
      { e: 'peut-être que', c: '+ ind.', ex: "Peut-être qu'il va venir plus tard." }
    ],
    qc: [
      { e: 'Moi, je trouve que…', ex: "Moi, je trouve que c'est trop cher." },
      { e: 'Me semble que…', r: 'F-QC', ex: "Me semble que c'était mieux avant." }
    ],
    attention: '*Je pense que* + indicatif ; *je ne pense pas que* + subjonctif.',
    relance: "Qu'est-ce que tu en penses ?"
  },
  {
    tab: 10, je: 'Ajouter, donner un exemple', moment: 'expliquer',
    quand: 'Pour développer une idée : ajouter, illustrer, préciser.',
    cles: [
      { e: 'en plus', ex: 'Il est gentil, en plus il cuisine bien.' },
      { e: 'par exemple', ex: "J'aime les sports d'hiver, par exemple le patin." },
      { e: 'comme', c: '+ nom', ex: "J'ai visité des villes comme Québec et Sherbrooke." },
      { e: "d'ailleurs", ex: "Ce quartier est très vivant. D'ailleurs, il y a un festival chaque été." },
      { e: "c'est-à-dire", ex: "Je travaille à temps partiel, c'est-à-dire trois jours par semaine." }
    ],
    qc: [
      { e: 'Pis aussi…', r: 'F-QC', ex: "C'est proche, pis aussi c'est pas cher." },
      { e: 'genre…', r: 'O', ex: 'Il y avait genre cent personnes.' }
    ],
    attention: '*Par exemple* : une illustration. *Entre autres* : un exemple parmi plusieurs.',
    relance: 'Tu peux me donner un exemple ?'
  },
  {
    tab: 11, je: 'Reformuler, conclure', moment: 'conclure',
    quand: 'Pour organiser ce que je dis, me corriger, résumer.',
    cles: [
      { e: "d'abord… ensuite…", ex: "D'abord, j'ai cherché sur Internet ; ensuite, j'ai visité." },
      { e: 'en fait', ex: "Je pensais que c'était lundi. En fait, c'est mardi." },
      { e: 'autrement dit', ex: 'Il est très occupé. Autrement dit, il ne viendra pas.' },
      { e: 'bref', ex: "Bref, tout s'est bien passé." },
      { e: 'finalement', ex: "Finalement, j'ai choisi l'appartement le plus proche." }
    ],
    qc: [
      { e: 'Dans le fond…', r: 'O, QC', ex: "Dans le fond, ce que je veux, c'est un endroit tranquille." },
      { e: "Fait que c'est ça.", r: 'F-QC', ex: "Fait que c'est ça, je commence lundi." }
    ],
    attention: '*En fait* : je corrige. *En effet* : je confirme.',
    relance: 'Si je comprends bien, tu veux dire que… ?'
  },
  {
    tab: 12, je: 'Réagir, relancer', moment: 'reagir',
    quand: 'Pour montrer que j’écoute, demander une précision, faire continuer l’autre.',
    cles: [
      { e: 'Ah oui ? / Vraiment ?', ex: "— J'ai trouvé un appartement ! — Ah oui ? Où ça ?" },
      { e: 'Je vois. / Je comprends.', ex: 'Je vois, ça doit être difficile.' },
      { e: "Qu'est-ce que tu veux dire ?", ex: "Qu'est-ce que tu veux dire par « compliqué » ?" },
      { e: 'Et après ?', ex: "Et après, qu'est-ce qui s'est passé ?" },
      { e: "C'est vrai, mais…", ex: "C'est vrai, mais il y a d'autres options." }
    ],
    qc: [
      { e: 'Ah ouin ?', r: 'F-QC', ex: '— Il a démissionné. — Ah ouin ?' },
      { e: 'Pour vrai ?', r: 'O, QC', ex: 'Pour vrai ? Je le savais pas !' },
      { e: 'Fait que ?', r: 'F-QC', ex: "Fait que ? Tu l'as eu, l'emploi ?" },
      { e: 'Mets-en !', r: 'F-QC', ex: '— Il fait froid ! — Mets-en !' }
    ],
    attention: '*Pis ?* et *Fait que ?* demandent la suite : ils ne veulent pas dire « et » ou « donc ».',
    relance: 'Pour vrai ? Raconte !'
  }
]);

/* Les moments d'une conversation (pour regrouper les intentions). */
SITE.set('moments', [
  { id: 'commencer', label: 'Commencer', tabs: [1] },
  { id: 'raconter', label: 'Raconter', tabs: [3] },
  { id: 'expliquer', label: 'Expliquer', tabs: [4, 5, 6, 7, 2, 10] },
  { id: 'reagir', label: 'Réagir', tabs: [12, 9, 8] },
  { id: 'conclure', label: 'Conclure', tabs: [11] }
]);

/* Situations de conversation : ce que l'autre personne dit,
   et les fonctions les plus utiles pour répondre. */
SITE.set('scenarios', [
  { id: 'quebec', type: 'question', dit: 'Pourquoi tu as choisi le Québec ?', fonctions: [4, 6, 3], theme: 'projets personnels' },
  { id: 'emploi', type: 'question', dit: 'Comment ça se passe, ton nouvel emploi ?', fonctions: [9, 3, 8], theme: 'travail' },
  { id: 'loterie', type: 'question', dit: "Qu'est-ce que tu ferais si tu gagnais à la loterie ?", fonctions: [7, 6, 10], theme: 'projets personnels' },
  { id: 'ville', type: 'question', dit: 'Tu préfères Montréal ou ta ville d’origine ?', fonctions: [8, 9, 2], theme: 'vie quotidienne' },
  { id: 'fds', type: 'question', dit: 'Pis, ta fin de semaine ? Raconte !', fonctions: [3, 10, 11], theme: 'relations sociales' },
  { id: 'transport', type: 'question', dit: 'Qu’est-ce que tu penses du transport en commun ici ?', fonctions: [9, 4, 8], theme: 'transports' },
  { id: 'quartier', type: 'question', dit: 'C’est comment, ton quartier ?', fonctions: [2, 10, 9], theme: 'logement' },
  { id: 'annee', type: 'question', dit: 'C’est quoi, tes projets pour l’année prochaine ?', fonctions: [6, 7, 3], theme: 'projets personnels' },
  { id: 'appart', type: 'nouvelle', dit: "J'ai finalement trouvé un appartement !", fonctions: [12, 5, 3], theme: 'logement' },
  { id: 'loyer', type: 'nouvelle', dit: 'Mon propriétaire veut augmenter le loyer de 10 %.', fonctions: [12, 9, 7], theme: 'logement' },
  { id: 'cours', type: 'nouvelle', dit: 'Je pense arrêter mes cours de francisation.', fonctions: [12, 8, 4], theme: 'études' },
  { id: 'rdv', type: 'nouvelle', dit: 'Ils ont annulé mon rendez-vous à la clinique, encore.', fonctions: [12, 5, 7], theme: 'démarches administratives' }
]);
