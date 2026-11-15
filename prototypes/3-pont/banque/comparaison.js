/* Atelier de ponts — banque : comparaison (plus… que, moins… que, aussi… que, autant (de)… que,
   comme, meilleur / mieux… que). Format : voir outils/exemple-banque.js. */
ATELIER.ajouter([
  {
    id: 'comparaison-01', rel: 'comparaison', th: 'logement',
    a: 'Mon loyer est de 1 100 $.', b: 'Ton loyer est de 900 $.',
    as: 'mon loyer 1 100 $', bs: 'ton loyer 900 $',
    ok: [
      { p: 'plus-que', c: 'b', s: 'Mon loyer est {plus} [cher] <{que} [le tien]>.' }
    ],
    non: [
      { p: 'aussi-que', why: '« Aussi… que » marque l’égalité ; or 1 100 $ et 900 $, ce n’est pas le même montant.' },
      { p: 'meilleur-que', why: '« Meilleur » remplace « plus bon » : il compare une qualité. Ici, on compare un prix : le loyer est plus cher.' },
      { p: 'alors-que', why: '« Alors que » oppose les deux montants, mais ne dit pas lequel est le plus élevé : il ne mesure pas.' }
    ],
    back: { p: 'moins-que', c: 'a', s: 'Ton loyer est {moins} [cher] <{que} [le mien]>.', fn: 'On part de l’autre loyer : « plus cher » devient « moins cher », et « le tien » devient « le mien ».' }
  },
  {
    id: 'comparaison-02', rel: 'comparaison', th: 'transport',
    a: 'En autobus, je mets 50 minutes pour aller au travail.', b: 'En métro, je mets 25 minutes.',
    as: 'autobus : 50 min', bs: 'métro : 25 min',
    ok: [
      { p: 'moins-que', c: 'a', s: 'En métro, je mets {moins de} [temps] <{qu’}en autobus> pour aller au travail.' }
    ],
    non: [
      { p: 'autant-que', why: '« Autant de temps que » dirait que les deux trajets durent pareil ; 25 et 50 minutes, ce n’est pas égal.' },
      { p: 'tandis-que', why: '« Tandis que » oppose les deux trajets sans mesurer l’écart ; ici, on compare des durées.' }
    ],
    back: { p: 'plus-que', c: 'b', s: 'En autobus, je mets {plus de} [temps] <{qu’}en métro> pour aller au travail.', fn: 'On part du trajet le plus long : « moins de temps » devient « plus de temps ». Devant un nom, on garde « de » : plus de, moins de.' }
  },
  {
    id: 'comparaison-03', rel: 'comparaison', th: 'famille',
    a: 'Mon fils mesure 1 m 60.', b: 'Ma fille mesure 1 m 60.',
    as: 'lui : 1 m 60', bs: 'elle : 1 m 60',
    ok: [
      { p: 'aussi-que', c: 'a', s: 'Ma fille est {aussi} [grande] <{que} [son frère]>.' }
    ],
    non: [
      { p: 'plus-que', why: '« Plus… que » dirait qu’elle est plus grande que lui ; or ils mesurent tous les deux 1 m 60.' },
      { p: 'meilleur-que', why: '« Meilleur » compare une qualité (bon → meilleur) ; ici, on compare une taille, et elle est la même.' },
      { p: 'contrairement-a', why: '« Contrairement à » marque une différence ; ici, le frère et la sœur ont la même taille.' }
    ],
    back: { p: 'autant-que', c: 'a', s: 'Ma fille mesure {autant} <{que} [son frère]>.', fn: 'Avec le verbe « mesurer », plus besoin d’adjectif : « est aussi grande que » devient « mesure autant que ».' }
  },
  {
    id: 'comparaison-04', rel: 'comparaison', th: 'travail',
    a: 'Je travaille 40 heures par semaine.', b: 'Mon mari travaille 40 heures par semaine.',
    as: 'moi : 40 h', bs: 'lui : 40 h',
    ok: [
      { p: 'autant-que', c: 'a', s: 'Mon mari travaille {autant} <{que} [moi]>.' }
    ],
    non: [
      { p: 'plus-que', why: '« Plus… que » dirait qu’il travaille davantage ; or c’est 40 heures des deux côtés.' },
      { p: 'meilleur-que', why: '« Mieux que » parlerait de la qualité du travail ; ici, on compare seulement le nombre d’heures.' },
      { p: 'alors-que', why: '« Alors que » oppose deux faits différents ; ici, nos deux semaines sont pareilles.' }
    ],
    back: { p: 'aussi-que', c: 'a', s: 'Mon mari travaille {aussi} [longtemps] <{que} [moi]>.', fn: 'Avec un adverbe (longtemps), on revient à « aussi… que » ; « autant » se plaçait directement après le verbe.' }
  },
  {
    id: 'comparaison-05', rel: 'comparaison', th: 'famille',
    a: 'J’ai trois enfants.', b: 'Ma sœur a trois enfants.',
    as: 'moi : 3 enfants', bs: 'elle : 3 enfants',
    ok: [
      { p: 'autant-que', c: 'a', s: 'Ma sœur a {autant d’}enfants <{que} [moi]>.' }
    ],
    non: [
      { p: 'aussi-que', why: '« Aussi » ne va pas devant un nom : « aussi d’enfants » ne se dit pas. Avec un nom, on dit « autant de… que ».' },
      { p: 'moins-que', why: '« Moins de… que » dirait qu’elle a moins d’enfants que moi ; or nous en avons trois chacune.' },
      { p: 'tandis-que', why: '« Tandis que » oppose deux faits ; ici, nos deux familles ont la même taille.' }
    ],
    back: { p: 'comme-comp', c: 'a', s: 'Ma sœur a trois enfants, <{comme} [moi]>.', fn: '« Comme moi » garde le nombre et dit seulement que c’est pareil ; « autant de… que » mesurait la quantité.' }
  },
  {
    id: 'comparaison-06', rel: 'comparaison', th: 'voisinage',
    a: 'Ma voisine est très gentille.', b: 'Sa fille est très gentille.',
    as: 'mère gentille', bs: 'fille gentille',
    ok: [
      { p: 'comme-comp', c: 'b', s: 'Ma voisine est très gentille, <{comme} sa fille>.' }
    ],
    non: [
      { p: 'plus-que', why: '« Plus… que » dirait que l’une est plus gentille que l’autre ; ici, elles se ressemblent.' },
      { p: 'autant-que', why: '« Autant » va avec un verbe ou un nom ; devant un adjectif (gentille), il faut « aussi… que », ou « comme ».' },
      { p: 'contrairement-a', why: '« Contrairement à » marque une différence ; ici, la mère et la fille sont pareilles.' }
    ],
    back: { p: 'aussi-que', c: 'a', s: 'Sa fille est {aussi} gentille <{que} [sa mère]>.', fn: '« Aussi… que » mesure le degré : la même gentillesse des deux côtés. « Comme » disait seulement qu’elles se ressemblent.' }
  },
  {
    id: 'comparaison-07', rel: 'comparaison', th: 'épicerie',
    a: 'Le pain du dépanneur est bon.', b: 'Le pain de la boulangerie est très bon.',
    as: 'pain du dépanneur', bs: 'pain boulangerie',
    ok: [
      { p: 'meilleur-que', c: 'a', s: 'Le pain de la boulangerie est {meilleur} <{que} [celui] du dépanneur>.' }
    ],
    non: [
      { p: 'plus-que', why: '« Plus bon » n’existe pas : avec l’adjectif « bon », on dit « meilleur ».' },
      { p: 'aussi-que', why: '« Aussi… que » marque l’égalité ; or le pain de la boulangerie est très bon, celui du dépanneur seulement bon.' },
      { p: 'par-contre', why: '« Par contre » oppose deux faits, mais ne mesure pas lequel des deux pains est le meilleur.' }
    ],
    back: { p: 'moins-que', c: 'b', s: 'Le pain du dépanneur est {moins} bon <{que} [celui] de la boulangerie>.', fn: 'Avec « moins », pas de forme spéciale : « moins bon » est correct. Seul « plus bon » devient « meilleur ».' }
  },
  {
    id: 'comparaison-08', rel: 'comparaison', th: 'études',
    a: 'Mon fils parle bien français.', b: 'Moi, je parle un peu français.',
    as: 'lui : bien', bs: 'moi : un peu',
    ok: [
      { p: 'meilleur-que', c: 'b', s: 'Mon fils parle {mieux} français <{que} [moi]>.' }
    ],
    non: [
      { p: 'plus-que', why: '« Plus bien » n’existe pas : avec un verbe (parler), le comparatif de « bien » est « mieux ».' },
      { p: 'comme-comp', why: '« Comme moi » dirait que nous parlons de la même façon ; or il parle bien, et moi un peu.' }
    ],
    back: { p: 'moins-que', c: 'a', s: 'Je parle {moins} [bien] français <{que} mon fils>.', fn: '« Moins bien » est correct : seul « plus bien » est remplacé par « mieux ». On part de moi, et mon fils passe après « que ».' }
  },
  {
    id: 'comparaison-09', rel: 'comparaison', th: 'hiver',
    a: 'Cet hiver, il est tombé 300 cm de neige à Québec.', b: 'À Montréal, il est tombé 200 cm.',
    as: 'Québec : 300 cm', bs: 'Montréal : 200 cm',
    ok: [
      { p: 'plus-que', c: 'b', s: 'Cet hiver, il est tombé {plus de} neige à Québec <{qu’}à Montréal>.' }
    ],
    non: [
      { p: 'autant-que', why: '« Autant de… que » marque l’égalité ; 300 cm et 200 cm, ce n’est pas la même quantité.' },
      { p: 'meilleur-que', why: '« Meilleur » compare une qualité (bon → meilleur) ; ici, on compare une quantité de neige.' },
      { p: 'tandis-que', why: '« Tandis que » oppose les deux villes sans dire où il est tombé le plus de neige.' }
    ],
    back: { p: 'moins-que', c: 'a', s: 'Cet hiver, il est tombé {moins de} neige à Montréal <{qu’}à Québec>.', fn: 'On part de Montréal : « plus de neige » devient « moins de neige », et les deux villes changent de place.' }
  }
]);
