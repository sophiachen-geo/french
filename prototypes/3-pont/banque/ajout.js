/* Atelier de ponts — banque : Ajout et exemple (en plus, de plus, d’ailleurs, non seulement… mais aussi,
   par exemple, notamment, c’est-à-dire). Format : voir outils/exemple-banque.js. */
ATELIER.ajouter([
  {
    id: 'ajout-01', rel: 'ajout', th: 'logement',
    a: 'Cet appartement est à deux pas du métro.', b: 'Le loyer est raisonnable.',
    as: 'près du métro', bs: 'loyer raisonnable',
    ok: [
      { p: 'en-plus', c: 'b', s: 'Cet appartement est à deux pas du métro, <et {en plus}, le loyer est raisonnable>.' }
    ],
    non: [
      { p: 'par-exemple', why: '« Par exemple » donne un cas d’une idée générale ; le loyer n’est pas un exemple de la distance jusqu’au métro, c’est une autre qualité.' },
      { p: 'c-est-a-dire', why: '« C’est-à-dire » redit la même idée plus clairement ; ici, le loyer est une information nouvelle.' },
      { p: 'par-contre', why: '« Par contre » oppose un avantage et un défaut ; ici, les deux phrases sont des avantages.' }
    ],
    back: { p: 'de-plus', c: 'b', s: 'Cet appartement est à deux pas du métro ; <{de plus}, le loyer est raisonnable>.', fn: 'Même ajout, dans un registre plus soigné : « de plus » convient mieux à l’écrit, dans une annonce ou un courriel au propriétaire.' }
  },
  {
    id: 'ajout-02', rel: 'ajout', th: 'travail',
    a: 'J’ai cinq ans d’expérience en comptabilité.', b: 'Je parle français, anglais et ukrainien.',
    as: '5 ans d’expérience', bs: 'trois langues',
    ok: [
      { p: 'de-plus', c: 'b', s: 'J’ai cinq ans d’expérience en comptabilité ; <{de plus}, je parle français, anglais et ukrainien>.' }
    ],
    non: [
      { p: 'notamment', why: '« Notamment » présenterait les langues comme un exemple de l’expérience en comptabilité ; ce sont deux atouts différents.' },
      { p: 'c-est-a-dire', why: '« C’est-à-dire » expliquerait ce que veut dire « cinq ans d’expérience » ; les langues sont un nouvel atout, pas une explication.' },
      { p: 'donc', why: '« Donc » ferait des langues une conséquence de l’expérience ; il n’y a pas de lien de cause.' }
    ],
    back: { p: 'en-plus', c: 'b', s: 'J’ai cinq ans d’expérience en comptabilité, <et {en plus}, je parle français, anglais et ukrainien>.', fn: 'Même ajout, plus spontané : « en plus » va bien à l’oral, en entrevue ; « de plus » convient mieux dans une lettre de présentation.' }
  },
  {
    id: 'ajout-03', rel: 'ajout', th: 'transport',
    a: 'Cette voiture est trop chère pour moi.', b: 'Je n’ai pas vraiment besoin d’une voiture en ville.',
    as: 'trop chère', bs: 'pas besoin',
    ok: [
      { p: 'd-ailleurs', c: 'b', s: 'Cette voiture est trop chère pour moi ; <{d’ailleurs}, je n’[en] ai pas vraiment besoin en ville>.' }
    ],
    non: [
      { p: 'par-exemple', why: '« Par exemple » donnerait un cas du prix trop élevé ; ne pas avoir besoin de voiture est une autre raison, pas un exemple.' },
      { p: 'c-est-a-dire', why: '« C’est-à-dire » redirait la même idée autrement ; or « trop chère » et « pas besoin » sont deux raisons différentes.' },
      { p: 'mais', why: '« Mais » annonce une opposition ; ici, les deux phrases vont dans le même sens : je n’achète pas cette voiture.' }
    ],
    back: { p: 'en-plus', c: 'b', s: 'Cette voiture est trop chère pour moi, <et {en plus}, je n’[en] ai pas vraiment besoin en ville>.', fn: '« En plus » met simplement les deux raisons côte à côte ; « d’ailleurs » présente la deuxième comme une confirmation : de toute façon, je n’en ai pas besoin.' }
  },
  {
    id: 'ajout-04', rel: 'ajout', th: 'francisation',
    a: 'Les cours de francisation sont gratuits.', b: 'Les élèves à temps plein peuvent recevoir une aide financière.',
    as: 'cours gratuits', bs: 'aide financière',
    ok: [
      { p: 'non-seulement', c: 'b', s: '{Non seulement} les cours de francisation sont gratuits, <{mais en plus} les élèves à temps plein peuvent recevoir une aide financière>.' }
    ],
    non: [
      { p: 'par-exemple', why: '« Par exemple » ferait de l’aide financière un cas de gratuité ; recevoir de l’argent va plus loin que ne rien payer : c’est un deuxième avantage.' },
      { p: 'c-est-a-dire', why: '« C’est-à-dire » expliquerait le mot « gratuits » ; l’aide financière est une idée nouvelle, pas une explication.' },
      { p: 'pourtant', why: '« Pourtant » annonce une surprise contre la première idée ; ici, les deux avantages vont dans le même sens.' }
    ],
    back: { p: 'en-plus', c: 'b', s: 'Les cours de francisation sont gratuits ; <{en plus}, les élèves à temps plein peuvent recevoir une aide financière>.', fn: 'Avec « en plus », les deux avantages sont simplement mis côte à côte ; « non seulement… mais en plus » insiste sur le deuxième, encore plus étonnant.' }
  },
  {
    id: 'ajout-05', rel: 'ajout', th: 'culture',
    a: 'La bibliothèque offre beaucoup d’activités gratuites.', b: 'Il y a des cafés-rencontres en français le samedi.',
    as: 'plein d’activités', bs: 'cafés-rencontres',
    ok: [
      { p: 'par-exemple', c: 'b', s: 'La bibliothèque offre beaucoup d’activités gratuites ; <{par exemple}, il y a des cafés-rencontres en français le samedi>.' }
    ],
    non: [
      { p: 'en-plus', why: '« En plus » ajouterait une idée différente ; ici, les cafés-rencontres font partie des activités gratuites : c’est un exemple.' },
      { p: 'c-est-a-dire', why: '« C’est-à-dire » voudrait dire que les activités gratuites, ce sont seulement les cafés-rencontres ; or il y en a beaucoup d’autres.' },
      { p: 'par-contre', why: '« Par contre » oppose deux faits ; ici, la deuxième phrase illustre la première.' }
    ],
    back: { p: 'notamment', c: 'b', s: 'La bibliothèque offre beaucoup d’activités gratuites : <il y a {notamment} des cafés-rencontres en français le samedi>.', fn: '« Notamment » se place après le verbe et présente l’exemple comme le plus important parmi plusieurs.' }
  },
  {
    id: 'ajout-06', rel: 'ajout', th: 'démarches',
    a: 'Les nouveaux arrivants ont plusieurs démarches à faire.', b: 'Il faut demander la carte d’assurance maladie.',
    as: 'des démarches', bs: 'assurance maladie',
    ok: [
      { p: 'notamment', c: 'b', s: 'Les nouveaux arrivants ont plusieurs démarches à faire : <il faut {notamment} demander la carte d’assurance maladie>.' }
    ],
    non: [
      { p: 'c-est-a-dire', why: '« C’est-à-dire » annoncerait toutes les démarches, ou la même idée dite autrement ; la carte d’assurance maladie n’est qu’une démarche parmi plusieurs.' },
      { p: 'de-plus', why: '« De plus » ajouterait une nouvelle idée à côté de la première ; ici, la carte fait partie des démarches : c’est un exemple, pas un ajout.' },
      { p: 'donc', why: '« Donc » présenterait la carte comme une conséquence ; ici, c’est un exemple de démarche.' }
    ],
    back: { p: 'par-exemple', c: 'b', s: 'Les nouveaux arrivants ont plusieurs démarches à faire ; <{par exemple}, il faut demander la carte d’assurance maladie>.', fn: '« Par exemple » présente un cas parmi d’autres, sans dire qu’il est le plus important. Il se place souvent en tête de phrase.' }
  },
  {
    id: 'ajout-07', rel: 'ajout', th: 'travail',
    a: 'Je travaille à temps partiel.', b: 'Je fais vingt heures par semaine.',
    as: 'temps partiel', bs: '20 h par semaine',
    ok: [
      { p: 'c-est-a-dire', c: 'b', s: 'Je travaille à temps partiel, <{c’est-à-dire} vingt heures par semaine>.' }
    ],
    non: [
      { p: 'en-plus', why: '« En plus » ajouterait une deuxième information ; ici, les vingt heures ne s’ajoutent pas au temps partiel : elles disent ce qu’il veut dire.' },
      { p: 'par-exemple', why: '« Par exemple » donnerait un cas parmi d’autres ; ici, il n’y a qu’une seule réalité : mon temps partiel, ce sont vingt heures par semaine.' },
      { p: 'mais', why: '« Mais » opposerait deux idées ; ici, la deuxième phrase précise la première.' }
    ],
    back: { p: 'c-est-a-dire', c: 'b', s: 'Je travaille à temps partiel, <{c’est-à-dire que} je fais vingt heures par semaine>.', fn: 'Avec « c’est-à-dire que », on garde une phrase complète (sujet + verbe) ; sans « que », un simple groupe de mots suffit.' }
  },
  {
    id: 'ajout-08', rel: 'ajout', th: 'santé',
    a: 'Il faut prendre ce médicament à jeun.', b: 'Il ne faut rien manger avant de le prendre.',
    as: 'à jeun', bs: 'rien manger avant',
    ok: [
      { p: 'c-est-a-dire', c: 'b', s: 'Il faut prendre ce médicament à jeun, <{c’est-à-dire qu’}il ne faut rien manger avant de le prendre>.' }
    ],
    non: [
      { p: 'par-exemple', why: '« Par exemple » donnerait un cas parmi d’autres ; ici, B explique ce que veut dire « à jeun » : c’est la même consigne.' },
      { p: 'en-plus', why: '« En plus » ajouterait une deuxième consigne ; or ne rien manger avant, c’est justement prendre le médicament à jeun.' },
      { p: 'alors-que', why: '« Alors que » oppose deux faits ; ici, les deux phrases disent la même chose.' }
    ],
    back: { p: 'c-est-a-dire', c: 'a', s: 'Il ne faut rien manger avant de prendre [ce médicament] ; <{autrement dit}, il faut [le] prendre à jeun>.', fn: 'On part de la consigne simple, puis « autrement dit » (un synonyme de « c’est-à-dire ») donne l’expression précise : « à jeun ».' }
  },
  {
    id: 'ajout-09', rel: 'ajout', th: 'voisinage',
    a: 'Mon voisin a déneigé mon entrée.', b: 'Il a gratté le pare-brise de ma voiture.',
    as: 'entrée déneigée', bs: 'pare-brise gratté',
    ok: [
      { p: 'non-seulement', c: 'b', s: 'Mon voisin a {non seulement} déneigé mon entrée, <{mais aussi} gratté le pare-brise de ma voiture>.' }
    ],
    non: [
      { p: 'c-est-a-dire', why: '« C’est-à-dire » redirait le déneigement autrement ; gratter le pare-brise est une deuxième action, pas une explication de la première.' },
      { p: 'notamment', why: '« Notamment » présenterait le pare-brise comme un exemple de l’entrée déneigée ; ce sont deux services différents.' },
      { p: 'pourtant', why: '« Pourtant » annonce une surprise contre la première idée ; ici, la deuxième action va dans le même sens.' }
    ],
    back: { p: 'en-plus', c: 'b', s: 'Mon voisin a déneigé mon entrée, <et {en plus}, il a gratté le pare-brise de ma voiture>.', fn: '« En plus » met les deux gestes côte à côte ; « non seulement… mais aussi » souligne que le voisin en a fait encore plus.' }
  },
  {
    id: 'ajout-10', rel: 'ajout', th: 'épicerie',
    a: 'Certains fruits coûtent très cher en hiver.', b: 'Les fraises coûtent le double en janvier.',
    as: 'fruits chers', bs: 'fraises au double',
    ok: [
      { p: 'par-exemple', c: 'b', s: 'Certains fruits coûtent très cher en hiver ; <{par exemple}, les fraises coûtent le double en janvier>.' }
    ],
    non: [
      { p: 'c-est-a-dire', why: '« C’est-à-dire » voudrait dire que « certains fruits », ce sont seulement les fraises ; or les fraises ne sont qu’un cas parmi d’autres.' },
      { p: 'non-seulement', why: '« Non seulement… mais aussi » demande deux éléments séparés ; ici, les fraises font partie des fruits de la première phrase : c’est un exemple.' },
      { p: 'parce-que', why: '« Parce que » ferait des fraises la cause du prix des fruits ; elles sont seulement un exemple.' }
    ],
    back: { p: 'par-exemple', c: 'b', s: 'Certains fruits coûtent très cher en hiver ; <les fraises, {par exemple}, coûtent le double en janvier>.', fn: '« Par exemple » peut aussi se placer au milieu de la phrase, entre virgules, juste après le nom qui sert d’exemple.' }
  },
  {
    id: 'ajout-11', rel: 'ajout', th: 'études',
    a: 'Ce programme mène à un emploi bien payé.', b: 'Les cours ont lieu le soir et la fin de semaine.',
    as: 'emploi bien payé', bs: 'cours le soir',
    ok: [
      { p: 'de-plus', c: 'b', s: 'Ce programme mène à un emploi bien payé ; <{de plus}, les cours ont lieu le soir et la fin de semaine>.' }
    ],
    non: [
      { p: 'notamment', why: '« Notamment » présenterait l’horaire comme un exemple d’emploi bien payé ; ce sont deux avantages différents du programme.' },
      { p: 'c-est-a-dire', why: '« C’est-à-dire » expliquerait ce que veut dire « emploi bien payé » ; l’horaire des cours est une autre information.' },
      { p: 'alors', why: '« Alors » présenterait l’horaire comme une conséquence du salaire ; il n’y a pas de lien de cause.' }
    ],
    back: { p: 'non-seulement', c: 'b', s: '{Non seulement} ce programme mène à un emploi bien payé, <{mais en plus} les cours ont lieu le soir et la fin de semaine>.', fn: '« Non seulement… mais en plus » donne plus de force au deuxième avantage : on insiste, comme dans une présentation.' }
  },
  {
    id: 'ajout-12', rel: 'ajout', th: 'hiver',
    a: 'Il fait moins trente dehors.', b: 'J’ai oublié mes mitaines.',
    as: 'moins trente', bs: 'pas de mitaines',
    ok: [
      { p: 'en-plus', c: 'b', s: 'Il fait moins trente dehors, <et {en plus}, j’ai oublié mes mitaines> !' }
    ],
    non: [
      { p: 'par-exemple', why: '« Par exemple » ferait de l’oubli des mitaines un cas du froid ; ce sont deux problèmes différents qui s’additionnent.' },
      { p: 'c-est-a-dire', why: '« C’est-à-dire » redirait le froid autrement ; oublier ses mitaines est un nouveau problème.' },
      { p: 'parce-que', why: '« Parce que » ferait de l’oubli des mitaines la cause du froid : impossible ! Les deux faits s’additionnent, sans lien de cause.' }
    ],
    back: { p: 'non-seulement', c: 'b', s: '{Non seulement} il fait moins trente dehors, <{mais en plus} j’ai oublié mes mitaines> !', fn: '« Non seulement… mais en plus » insiste : le deuxième problème rend la situation encore pire.' }
  }
]);
