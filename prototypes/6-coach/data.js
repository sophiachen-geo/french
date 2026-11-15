/* Coach 5 minutes — données propres au prototype.
   Rien ici ne remplace le contenu du site : on relie seulement
   SITE.meta.essentiels (formules clés) aux schémas de content/visuels.js. */
window.COACH = {

  /* Pour chaque fonction (onglet), une entrée par formule clé (même ordre que essentiels.cles) :
     v = [id du schéma, n° de ligne] dans content/visuels.js
     k = expression à retrouver dans le site complet (clé ou début de l'expression). */
  map: {
    1: [
      { v: ['relief', 0], k: 'pour ce qui est de' },
      { v: ['relief', 0], k: 'à propos de' },
      { v: ['relief', 1], k: 'ce qui' },
      { v: ['relief', 2], k: "le problème, c'est que" }
    ],
    2: [
      { v: ['relatives', 0], k: 'qui' },
      { v: ['relatives', 1], k: 'que' },
      { v: ['relatives', 2], k: 'dont' },
      { v: ['relatives', 3], k: 'où' },
      { v: ['relatives', 4], k: 'la raison pour laquelle' }
    ],
    3: [
      { v: ['durees', 0], k: 'il y a' },
      { v: ['durees', 1], k: 'depuis que' },
      { v: ['simultaneite', 1], k: 'quand' },
      { v: ['simultaneite', 5], k: 'avant de' },
      { v: ['simultaneite', 3], k: 'après avoir/être' }
    ],
    4: [
      { v: ['cause', 0], k: 'parce que' },
      { v: ['cause', 1], k: 'comme' },
      { v: ['cause', 4], k: 'à cause de' },
      { v: ['cause', 3], k: 'grâce à' },
      { v: ['cause', 2], k: 'vu que' }
    ],
    5: [
      { v: ['consequence', 0], k: 'donc' },
      { v: ['consequence', 0], k: 'alors' },
      { v: ['consequence', 2], k: "c'est pour ça que" },
      { v: ['consequence', 4], k: 'tellement' }
    ],
    6: [
      { v: ['but', 0], k: 'pour' },
      { v: ['but', 1], k: 'pour que' },
      { v: ['but', 2], k: 'afin de' },
      { v: ['but', 2], k: "le but, c'est de" },
      { v: ['but', 4], k: 'pour ne pas' }
    ],
    7: [
      { v: ['si', 0], k: 'si + présent → futur' },
      { v: ['si', 2], k: 'si + imparfait' },
      { v: ['si', 4], k: 'au cas où' },
      { v: ['si', 5], k: 'à condition que' },
      { v: ['si', 6], k: 'sauf si' }
    ],
    8: [
      { v: ['concession', 5], k: 'par contre' },
      { v: ['concession', 4], k: 'alors que' },
      { v: ['concession', 0], k: 'même si' },
      { v: ['concession', 2], k: 'malgré' },
      { v: ['concession', 1], k: 'bien que' }
    ],
    9: [
      { v: ['certitude', 5], k: 'je trouve que' },
      { v: ['certitude', 5], k: 'je pense que' },
      { v: ['sources', 1], k: 'à mon avis' },
      { v: ['certitude', 1], k: 'je ne pense pas que' },
      { v: ['certitude', 3], k: 'peut-être que' }
    ],
    10: [
      { v: ['ajouter', 0], k: 'en plus' },
      { v: ['ajouter', 1], k: 'par exemple' },
      { v: ['ajouter', 2], k: 'comme' },
      { v: ['ajouter', 0], k: "d'ailleurs" },
      { v: ['ajouter', 4], k: "c'est-à-dire" }
    ],
    11: [
      { v: ['discours', 0], k: "d'abord" },
      { v: ['discours', 1], k: 'en fait' },
      { v: ['discours', 2], k: 'autrement dit' },
      { v: ['discours', 4], k: 'bref' },
      { v: ['discours', 5], k: 'finalement' }
    ],
    12: [
      { v: ['tours', 0], k: 'ah oui ?' },
      { v: ['tours', 0], k: 'je vois' },
      { v: ['tours', 1], k: "qu'est-ce que tu veux dire ?" },
      { v: ['tours', 2], k: 'et après ?' },
      { v: ['tours', 3], k: "c'est vrai, mais" }
    ]
  },

  /* « Ne confonds pas » : deux lignes de schéma qui illustrent le piège de la fonction. */
  contrast: {
    1: { spec: 'ce-quoi', rows: [0, 1] },
    2: { spec: 'prep-relatif', rows: [2, 0] },
    3: { spec: 'durees', rows: [0, 1] },
    4: { spec: 'cause', rows: [3, 4] },
    5: { mix: [['cause', 0], ['consequence', 0]], flow: true,
         legend: [['cadre', 'ce que l’expression introduit'], ['main', 'l’autre partie']] },
    6: { spec: 'but', rows: [0, 1] },
    7: { spec: 'si', rows: [0, 2] },
    8: { spec: 'concession', rows: [0, 1] },
    9: { spec: 'certitude', rows: [5, 1] },
    10: { spec: 'ajouter', rows: [1, 2] },
    11: { spec: 'discours', rows: [1, 2] },
    12: { spec: 'tours', rows: [0, 2] }
  },

  /* Pour chaque situation : un titre court, qui parle, et une réponse possible
     (une phrase par fonction, dans l'ordre de scenario.fonctions). */
  scenes: {
    quebec: { court: 'Pourquoi le Québec', qui: 'Une collègue, à la pause café', reponse: [
      "J'ai choisi le Québec **parce que** je voulais vivre dans une société francophone.",
      "Je suis venue **pour** trouver un emploi dans mon domaine et apprendre le français.",
      "Je suis arrivée **il y a** deux ans et, **depuis que** j'habite à Montréal, je me sens de plus en plus chez moi."
    ] },
    emploi: { court: 'Ton nouvel emploi', qui: 'Ta voisine, dans l’escalier', reponse: [
      "**Je trouve que** ça se passe bien : mes collègues sont vraiment accueillants.",
      "**Quand** j'ai commencé, je ne comprenais pas tout, mais maintenant c'est beaucoup plus facile.",
      "**Par contre**, les journées sont longues, **même si** j'aime ce que je fais."
    ] },
    loterie: { court: 'La loterie', qui: 'Un ami, au dépanneur', reponse: [
      "**Si** je gagnais à la loterie, j'achèterais d'abord une maison avec un grand jardin.",
      "Je voyagerais aussi, **pour** voir ma famille plus souvent.",
      "**En plus**, je donnerais une partie de l'argent à des organismes, **par exemple** une banque alimentaire."
    ] },
    ville: { court: 'Montréal ou ta ville', qui: 'Une amie de ton cours', reponse: [
      "Ma ville d'origine est calme, **alors que** Montréal bouge tout le temps.",
      "**À mon avis**, c'est plus facile de se faire des amis ici.",
      "J'habite dans un quartier **où** il y a plein de petits cafés **que** j'adore."
    ] },
    fds: { court: 'Ta fin de semaine', qui: 'Ton collègue, lundi matin', reponse: [
      "Samedi matin, j'ai fait mes courses ; **après avoir** dîné, je suis allée voir des amis.",
      "On a fait une marche sur le mont Royal. **En plus**, il faisait super beau !",
      "**Bref**, c'était une très belle fin de semaine."
    ] },
    transport: { court: 'Le transport en commun', qui: 'Un voisin, à l’arrêt d’autobus', reponse: [
      "**Je pense que** le métro est vraiment pratique.",
      "**Comme** je n'ai pas d'auto, je le prends tous les jours.",
      "**Par contre**, l'hiver, les autobus sont souvent en retard."
    ] },
    quartier: { court: 'Ton quartier', qui: 'Une nouvelle amie', reponse: [
      "C'est un quartier **où** il y a beaucoup de familles, avec un grand parc **que** j'adore.",
      "Il y a des épiceries, des cafés… **En plus**, le métro est à cinq minutes à pied.",
      "**À mon avis**, c'est un des quartiers les plus agréables de la ville."
    ] },
    annee: { court: 'Tes projets', qui: 'Une amie, au café', reponse: [
      "**Le but, c'est de** trouver un emploi dans mon domaine.",
      "**Si** je réussis mon examen de français, je m'inscrirai à une formation.",
      "Mais **avant de** commencer, je veux prendre quelques semaines de vacances."
    ] },
    appart: { court: 'Un appartement trouvé', qui: 'Ton amie Marie-Ève', reponse: [
      "**Ah oui ?** Bravo ! Il est dans quel quartier ?",
      "Tu cherchais depuis longtemps, **donc** ça doit être un gros soulagement.",
      "Moi, **quand** j'ai cherché le mien, **il y a** deux ans, ça m'a pris trois mois !"
    ] },
    loyer: { court: 'Hausse de loyer', qui: 'Ton voisin de palier', reponse: [
      "**Vraiment ?** Dix pour cent, c'est énorme !",
      "**Je ne pense pas qu'**il ait le droit de faire ça sans justification.",
      "**Si** j'étais toi, je contacterais le Tribunal administratif du logement."
    ] },
    cours: { court: 'Arrêter la francisation', qui: 'Une amie de ta classe de francisation', reponse: [
      "**Qu'est-ce que tu veux dire ?** Tu veux arrêter complètement ?",
      "**Même si** c'est fatigant, tu as fait beaucoup de progrès.",
      "Continue, **parce que** le français va t'ouvrir beaucoup de portes ici."
    ] },
    rdv: { court: 'Rendez-vous annulé', qui: 'Ta collègue Sophie', reponse: [
      "Encore ? **Je comprends**, c'est vraiment frustrant.",
      "Ça fait des semaines que tu attends, **alors** c'est normal d'être à bout.",
      "**Si jamais** ça recommence, appelle le 811 : on peut t'aider à trouver une autre clinique."
    ] }
  },

  /* Les 4 étapes de la séance, reliées aux étapes de la méthode (SITE.meta.etapes). */
  steps: [
    { n: 1, id: 'ecoute', titre: 'Écoute', duree: 30, methode: 1 },
    { n: 2, id: 'prepare', titre: 'Prépare', duree: 120, methode: 3 },
    { n: 3, id: 'parle', titre: 'Parle', duree: 90, methode: 6 },
    { n: 4, id: 'bilan', titre: 'Bilan', duree: 60, methode: 9 }
  ],

  /* Boîtes de Leitner : intervalle (en jours) avant le retour d'une formule. */
  intervals: [0, 1, 2, 4, 8, 16]
};
