/* Atelier de ponts — banque : concession (même si, bien que, quoique, malgré, pourtant, quand même,
   cependant, avoir beau). Format : voir outils/exemple-banque.js. */
ATELIER.ajouter([
  {
    id: 'concession-01', rel: 'concession', th: 'hiver',
    a: 'Il va peut-être faire −30 °C demain.', b: 'J’irai au travail à pied.',
    as: '−30 °C demain ?', bs: 'j’irai à pied',
    ok: [
      { p: 'meme-si', c: 'a', s: '<{Même s’}il [fait] −30 °C demain>, j’irai au travail à pied.' }
    ],
    non: [
      { p: 'bien-que', why: '« Bien que » (+ subjonctif) présente l’obstacle comme un fait sûr ; ici, le froid de demain n’est qu’une possibilité (peut-être). Pour une hypothèse : « même si » + indicatif.' },
      { p: 'si-present', why: '« Si » seul poserait une condition : j’irai à pied seulement s’il fait −30 °C ! C’est « même » qui dit que le froid ne m’arrêtera pas.' }
    ],
    back: { p: 'quand-meme', c: 'b', s: 'Il va peut-être faire −30 °C demain. <J’irai {quand même} au travail à pied>.', fn: 'Avec « quand même », l’obstacle garde sa phrase (il va peut-être faire…) et le pont se place juste après le verbe de l’action : j’irai quand même.' }
  },
  {
    id: 'concession-02', rel: 'concession', th: 'famille',
    a: 'Mon fils va peut-être pleurer le premier jour.', b: 'Je vais le laisser à la garderie.',
    as: 'il va pleurer ?', bs: 'à la garderie',
    ok: [
      { p: 'quand-meme', c: 'b', s: 'Mon fils va peut-être pleurer le premier jour. <Je vais {quand même} le laisser à la garderie>.' }
    ],
    non: [
      { p: 'quoique', why: '« Quoique » (+ subjonctif) présente l’obstacle comme un fait réel ; ici, on ne sait pas encore s’il va pleurer.' },
      { p: 'au-cas-ou', why: '« Au cas où » annonce une précaution (on apporte sa doudou au cas où il pleurerait) ; ici, les pleurs sont un obstacle, pas une raison d’agir.' }
    ],
    back: { p: 'meme-si', c: 'a', s: '<{Même si} mon fils [pleure] le premier jour>, je vais le laisser à la garderie.', fn: 'Avec « même si », l’obstacle passe devant et devient une hypothèse au présent : « va peut-être pleurer » devient « pleure ».' }
  },
  {
    id: 'concession-03', rel: 'concession', th: 'logement',
    a: 'Le propriétaire est au courant du problème de chauffage.', b: 'Il n’a toujours pas appelé de réparateur.',
    as: 'il est au courant', bs: 'pas de réparateur',
    ok: [
      { p: 'bien-que', c: 'a', s: '<{Bien que} le propriétaire [soit] au courant du problème de chauffage>, il n’a toujours pas appelé de réparateur.' }
    ],
    non: [
      { p: 'malgre', why: '« Malgré » doit être suivi d’un nom ; « être au courant » est un verbe, et « malgré que le propriétaire est au courant » est une faute.' },
      { p: 'parce-que', why: '« Parce que » ferait de l’information la raison de l’inaction : c’est l’inverse d’un obstacle.' },
      { p: 'par-contre', why: '« Par contre » oppose deux faits indépendants (un défaut, une qualité) ; ici, le premier fait devrait entraîner une réparation, et il ne le fait pas.' }
    ],
    back: { p: 'pourtant', c: 'b', s: 'Le propriétaire est au courant du problème de chauffage. <{Pourtant}, il n’a toujours pas appelé de réparateur>.', fn: '« Pourtant » laisse l’obstacle dans sa phrase, à l’indicatif (est), et annonce le résultat qui surprend.' }
  },
  {
    id: 'concession-04', rel: 'concession', th: 'études',
    a: 'Je ne comprends pas tous les mots.', b: 'J’aime beaucoup mon cours de francisation.',
    as: 'pas tous les mots', bs: 'j’aime mon cours',
    ok: [
      { p: 'bien-que', c: 'a', s: '<{Bien que} je ne [comprenne] pas tous les mots>, j’aime beaucoup mon cours de francisation.' },
      { p: 'meme-si', c: 'a', s: '<{Même si} je ne comprends pas tous les mots>, j’aime beaucoup mon cours de francisation.' }
    ],
    non: [
      { p: 'malgre', why: '« Malgré » + nom seulement : l’obstacle a ici un verbe et une négation (je ne comprends pas), et aucun nom simple ne le remplace.' },
      { p: 'a-cause-de', why: '« À cause de » ferait des mots incompris la raison de mon plaisir ; c’est un obstacle, pas une cause.' }
    ],
    back: { p: 'cependant', c: 'b', s: 'Je ne comprends pas tous les mots. <{Cependant}, j’aime beaucoup mon cours de francisation>.', fn: 'Avec « cependant », plus soigné, l’obstacle reste à l’indicatif dans sa propre phrase ; le pont annonce ce qui résiste.' }
  },
  {
    id: 'concession-05', rel: 'concession', th: 'transport',
    a: 'Notre vol a été annulé.', b: 'Nous sommes arrivés à temps pour le mariage de ma cousine.',
    as: 'vol annulé', bs: 'arrivés à temps',
    ok: [
      { p: 'malgre', c: 'a', s: '<{Malgré} [l’annulation] de notre vol>, nous sommes arrivés à temps pour le mariage de ma cousine.' }
    ],
    non: [
      { p: 'avoir-beau', why: '« Avoir beau » insiste sur un effort qui ne sert à rien (j’ai beau chercher…) ; une annulation n’est pas un effort qu’on fait, c’est un événement qu’on subit.' },
      { p: 'a-cause-de', why: '« À cause de » ferait de l’annulation la raison de notre arrivée à temps ; c’est le contraire.' }
    ],
    back: { p: 'quand-meme', c: 'b', s: 'Notre vol a été annulé. <Nous sommes {quand même} arrivés à temps pour le mariage de ma cousine>.', fn: 'Avec « quand même », l’obstacle reste une phrase complète. Dans un temps composé, le pont se place entre l’auxiliaire et le participe : sommes quand même arrivés.' }
  },
  {
    id: 'concession-06', rel: 'concession', th: 'démarches',
    a: 'J’épelle mon nom trois fois.', b: 'La réceptionniste l’écrit encore mal.',
    as: 'j’épelle 3 fois', bs: 'elle l’écrit mal',
    ok: [
      { p: 'avoir-beau', c: 'a', s: '<{J’ai beau} [épeler] mon nom trois fois>, la réceptionniste l’écrit encore mal.' }
    ],
    non: [
      { p: 'malgre', why: '« Malgré » demande un nom, et « malgré mes trois épellations » ne se dit pas. L’obstacle est une action répétée, donc un verbe.' },
      { p: 'parce-que', why: '« Parce que » ferait de mon épellation la cause de l’erreur ; c’est un effort qui aurait dû l’empêcher.' }
    ],
    back: { p: 'meme-si', c: 'a', s: '<{Même si} j’épelle mon nom trois fois>, la réceptionniste l’écrit encore mal.', fn: 'Avec « même si », le verbe reste conjugué (j’épelle). « Avoir beau » insistait davantage sur l’effort inutile.' }
  },
  {
    id: 'concession-07', rel: 'concession', th: 'santé',
    a: 'Je me couche à 21 h tous les soirs.', b: 'Je me réveille fatiguée.',
    as: 'couchée à 21 h', bs: 'fatiguée',
    ok: [
      { p: 'pourtant', c: 'b', s: 'Je me couche à 21 h tous les soirs. <{Pourtant}, je me réveille fatiguée>.' },
      { p: 'avoir-beau', c: 'a', s: '<{J’ai beau} me [coucher] à 21 h tous les soirs>, je me réveille fatiguée.' }
    ],
    non: [
      { p: 'malgre', why: '« Malgré » + nom : « me coucher à 21 h » est une action avec un verbe, et « malgré que je me couche… » est une faute.' },
      { p: 'donc', why: '« Donc » ferait de la fatigue une suite normale du coucher tôt ; c’est justement le contraire de ce qu’on attend.' }
    ],
    back: { p: 'meme-si', c: 'a', s: '<{Même si} je me couche à 21 h tous les soirs>, je me réveille fatiguée.', fn: '« Même si » fait passer l’obstacle devant, à l’indicatif ; « pourtant » le laissait dans sa phrase et annonçait la surprise.' }
  },
  {
    id: 'concession-08', rel: 'concession', th: 'travail',
    a: 'Je ne suis pas encore à l’aise en français.', b: 'J’ai obtenu un poste de préposée aux bénéficiaires.',
    as: 'pas à l’aise', bs: 'poste obtenu',
    ok: [
      { p: 'cependant', c: 'b', s: 'Je ne suis pas encore à l’aise en français. <{Cependant}, j’ai obtenu un poste de préposée aux bénéficiaires>.' }
    ],
    non: [
      { p: 'malgre', why: '« Malgré » a besoin d’un nom ; ici, l’obstacle est une phrase négative (je ne suis pas à l’aise), sans nom simple pour la remplacer.' },
      { p: 'donc', why: '« Donc » présenterait le poste comme une conséquence de mon français hésitant ; c’est un obstacle surmonté, pas une cause.' }
    ],
    back: { p: 'bien-que', c: 'a', s: '<{Bien que} je ne [sois] pas encore à l’aise en français>, j’ai obtenu un poste de préposée aux bénéficiaires.', fn: '« Bien que » fait passer l’obstacle devant, au subjonctif (je sois) ; avec « cependant », il restait à l’indicatif dans sa propre phrase.' }
  },
  {
    id: 'concession-09', rel: 'concession', th: 'famille',
    a: 'Je parle ukrainien à mes enfants.', b: 'Ils me répondent en français.',
    as: 'je parle ukrainien', bs: 'en français',
    ok: [
      { p: 'meme-si', c: 'a', s: '<{Même si} je parle ukrainien à mes enfants>, ils me répondent en français.' },
      { p: 'pourtant', c: 'b', s: 'Je parle ukrainien à mes enfants. <{Pourtant}, ils me répondent en français>.' }
    ],
    non: [
      { p: 'malgre', why: '« Malgré » doit être suivi d’un nom ; « malgré que je parle ukrainien » est une faute. Avec un verbe conjugué, il faut « même si » ou « bien que ».' },
      { p: 'comme', why: '« Comme » en tête de phrase donne une cause : l’ukrainien serait la raison du français. Ici, c’est un obstacle qui ne marche pas.' }
    ],
    back: { p: 'quand-meme', c: 'b', s: 'Je parle ukrainien à mes enfants. <Ils me répondent {quand même} en français>.', fn: '« Quand même » se place juste après le verbe (répondent) ; l’obstacle garde sa phrase, sans « si ».' }
  },
  {
    id: 'concession-10', rel: 'concession', th: 'voisinage',
    a: 'Je ne connais personne dans le quartier.', b: 'Je suis allée à la fête des voisins.',
    as: 'aucun voisin connu', bs: 'fête des voisins',
    ok: [
      { p: 'bien-que', c: 'a', s: '<{Bien que} je ne [connaisse] personne dans le quartier>, je suis allée à la fête des voisins.' }
    ],
    non: [
      { p: 'malgre', why: '« Malgré » + nom seulement ; « malgré que je ne connais personne » est une faute fréquente. Avec une phrase, on prend « bien que » ou « même si ».' },
      { p: 'au-lieu-de', why: '« Au lieu de » remplace une action par une autre ; ici, rien n’est remplacé : ne connaître personne est un obstacle.' }
    ],
    back: { p: 'meme-si', c: 'a', s: '<{Même si} je ne connais personne dans le quartier>, je suis allée à la fête des voisins.', fn: 'Avec « même si », le verbe revient à l’indicatif : « je connaisse » redevient « je connais ». Le sens ne change pas.' }
  },
  {
    id: 'concession-11', rel: 'concession', th: 'hiver',
    a: 'Ma fille ne veut jamais mettre sa tuque.', b: 'Elle est rarement malade.',
    as: 'pas de tuque', bs: 'rarement malade',
    ok: [
      { p: 'bien-que', c: 'a', s: '<{Bien que} ma fille ne [veuille] jamais mettre sa tuque>, elle est rarement malade.' },
      { p: 'quand-meme', c: 'b', s: 'Ma fille ne veut jamais mettre sa tuque. <Elle est {quand même} rarement malade>.' }
    ],
    non: [
      { p: 'avoir-beau', why: '« Avoir beau » sert pour un effort qui ne donne pas le résultat voulu (j’ai beau lui dire de mettre sa tuque…) ; refuser la tuque n’est pas un effort.' },
      { p: 'donc', why: '« Donc » ferait de la tuque oubliée la raison de sa bonne santé ; c’est un obstacle, pas une cause.' }
    ],
    back: { p: 'cependant', c: 'b', s: 'Ma fille ne veut jamais mettre sa tuque. <{Cependant}, elle est rarement malade>.', fn: '« Cependant », plus soigné, garde l’obstacle à l’indicatif (veut) dans sa propre phrase et annonce le fait qui surprend.' }
  },
  {
    id: 'concession-12', rel: 'concession', th: 'démarches',
    a: 'Personne ne m’a aidée.', b: 'J’ai rempli ma déclaration de revenus sans erreur.',
    as: 'aucune aide', bs: 'sans erreur',
    ok: [
      { p: 'meme-si', c: 'a', s: '<{Même si} personne ne m’a aidée>, j’ai rempli ma déclaration de revenus sans erreur.' },
      { p: 'bien-que', c: 'a', s: '<{Bien que} personne ne m’[ait] aidée>, j’ai rempli ma déclaration de revenus sans erreur.' }
    ],
    non: [
      { p: 'avoir-beau', why: '« Avoir beau » a besoin de quelqu’un qui fait un effort inutile ; ici, personne n’a rien fait, et « personne n’a beau m’aider » ne se dit pas.' },
      { p: 'parce-que', why: '« Parce que » ferait du manque d’aide la raison de ma réussite ; c’est un obstacle surmonté.' }
    ],
    back: { p: 'pourtant', c: 'b', s: 'Personne ne m’a aidée. <{Pourtant}, j’ai rempli ma déclaration de revenus sans erreur>.', fn: '« Pourtant » garde l’obstacle dans sa phrase, à l’indicatif (m’a aidée), et met en valeur le résultat qui surprend.' }
  },
  {
    id: 'concession-13', rel: 'concession', th: 'famille',
    a: 'Mon mari ne sait pas cuisiner.', b: 'Il prépare le souper tous les dimanches.',
    as: 'il ne sait pas', bs: 'le souper',
    ok: [
      { p: 'quoique', c: 'a', s: '<{Quoique} mon mari ne [sache] pas cuisiner>, il prépare le souper tous les dimanches.' }
    ],
    non: [
      { p: 'malgre', why: '« Malgré » + nom ; « ne pas savoir cuisiner » est une phrase avec un verbe et une négation, et « malgré qu’il ne sait pas » est une faute.' },
      { p: 'grace-a', why: '« Grâce à » + nom présente une cause positive ; ne pas savoir cuisiner n’aide pas à préparer le souper.' }
    ],
    back: { p: 'pourtant', c: 'b', s: 'Mon mari ne sait pas cuisiner. <{Pourtant}, il prépare le souper tous les dimanches>.', fn: '« Pourtant » garde l’obstacle à l’indicatif (sait) dans sa phrase, et annonce le fait qui surprend.' }
  },
  {
    id: 'concession-14', rel: 'concession', th: 'logement',
    a: 'Le loyer va peut-être augmenter en juillet.', b: 'Nous allons renouveler notre bail.',
    as: 'loyer en hausse ?', bs: 'on renouvelle',
    ok: [
      { p: 'meme-si', c: 'a', s: '<{Même si} le loyer [augmente] en juillet>, nous allons renouveler notre bail.' }
    ],
    non: [
      { p: 'malgre', why: '« Malgré » + nom présente un obstacle réel ; ici, la hausse n’est qu’une possibilité (peut-être). Pour une hypothèse : « même si » + indicatif.' },
      { p: 'a-condition-que', why: '« À condition que » poserait une condition nécessaire : nous renouvellerons notre bail seulement si le loyer augmente !' }
    ],
    back: { p: 'quand-meme', c: 'b', s: 'Le loyer va peut-être augmenter en juillet. <Nous allons {quand même} renouveler notre bail>.', fn: '« Quand même » se place après le verbe conjugué (allons) ; l’obstacle reste une phrase à part, au futur proche.' }
  }
]);
