/* III. Relier les 12 onglets entre eux.
   Chaque modèle : étapes [libellé, onglet] et segments de texte.
   Segment : [indice d'étape ou null, texte]. **gras** = construction clé. "\n" = nouvelle réplique. */

SITE.page({
  id: 'relier',
  title: 'Relier les 12 onglets',
  kicker: 'III',
  lead: "L'objectif n'est pas seulement de maîtriser chaque catégorie séparément, mais de pouvoir combiner plusieurs fonctions dans un même discours.",
  md: ''
});

SITE.model({
  n: 1,
  title: 'Construire une explication',
  steps: [['Sujet', 1], ['Cause', 4], ['Conséquence', 5], ['Précision', 1]],
  segments: [
    [0, "**Pour ce qui est du** logement, j'ai eu plusieurs difficultés."],
    [1, ' **Comme** les prix ont augmenté,'],
    [2, " j'ai dû élargir mes recherches."],
    [3, " **Ce qui** me dérange surtout, **c'est** le manque d'options près du métro."]
  ]
});

SITE.model({
  n: 2,
  title: 'Développer une opinion',
  steps: [['Opinion', 9], ['Justification', 4], ['Concession', 8], ['Conclusion', 11]],
  segments: [
    [0, '**Je trouve que** le transport collectif est important,'],
    [1, " **notamment parce qu'**il facilite les déplacements."],
    [2, " **Même si** le service n'est pas parfait,"],
    [3, " **je pense qu'il faudrait** continuer à investir dans le réseau."]
  ]
});

SITE.model({
  n: 3,
  title: 'Raconter un événement',
  steps: [['Contexte', 3], ['Événement', 3], ['Conséquence', 5], ['Situation actuelle', 3]],
  segments: [
    [0, "**Ça faisait** deux ans **que** je cherchais un appartement"],
    [1, " **quand** j'ai finalement trouvé celui-ci."],
    [2, " Le propriétaire m'a appelée **le lendemain** de ma visite."],
    [3, " **Depuis ce moment-là**, j'habite dans le même quartier."]
  ]
});

SITE.model({
  n: 4,
  title: 'Formuler une hypothèse',
  steps: [['Situation hypothétique', 7], ['Condition', 7], ['Objectif', 6], ['Conséquence possible', 7]],
  segments: [
    [0, '**Mettons que** je trouve un nouvel emploi à Québec.'],
    [1, ' **Si** les conditions sont bonnes, je pourrais déménager'],
    [2, ' **pour** me rapprocher du bureau.'],
    [3, " **Par contre**, **il faudrait que** je trouve un logement abordable."]
  ]
});

SITE.model({
  n: 5,
  title: 'Exprimer une idée complexe',
  steps: [['Mise en relief', 1], ['Description', 2], ['Opposition', 8], ['Reformulation', 11]],
  segments: [
    [0, "**Ce qui** m'intéresse, **c'est**"],
    [1, ' la façon **dont** les gens s\'adaptent aux changements.'],
    [2, " Certains s'adaptent rapidement, **alors que** d'autres ont besoin de plus de temps."],
    [3, " **Dans le fond**, **ce que** je veux comprendre, **c'est** pourquoi ces différences existent."]
  ]
});

SITE.model({
  n: 6,
  title: 'Participer à une conversation québécoise',
  steps: [['Réaction', 12], ['Question', 12], ['Explication', 8], ['Conséquence', 5]],
  dialogue: true,
  segments: [
    [null, "J'ai finalement trouvé un appartement !\n"],
    [0, '**Ah ouin ?**'],
    [1, ' **Dans quel quartier ?**\n'],
    [2, "À Rosemont. Il est un peu plus loin du métro, **mais** il est beaucoup moins cher.\n"],
    [0, "Ah, c'est bien !"],
    [3, ' **Fait que** tu déménages quand ?\n'],
    [null, 'Dans deux semaines, si tout se passe comme prévu.']
  ]
});

SITE.set('relierNote', 'Ces modèles sont liés aux onglets correspondants, de manière à permettre le réemploi d’une même construction dans différentes situations.');
