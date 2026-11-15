/* Atelier de ponts — banque « But » (pour, pour que, afin de, afin que, pour ne pas,
   de peur de, de peur que, en vue de, de sorte que). Format : voir outils/exemple-banque.js. */
ATELIER.ajouter([
  {
    id: 'but-01', rel: 'but', th: 'francisation',
    a: 'Je suis des cours de francisation le soir.', b: 'Je travaille comme infirmière au Québec.',
    as: 'cours du soir', bs: 'infirmière ici',
    ok: [
      { p: 'pour', c: 'b', s: 'Je suis des cours de francisation le soir <{pour} [travailler] comme infirmière au Québec>.' }
    ],
    non: [
      { p: 'pour-que', why: '« Pour que » + subjonctif sert quand le sujet change ; ici, c’est moi qui suis les cours et moi qui veux travailler : même sujet, donc infinitif.' },
      { p: 'de-peur-de', why: '« De peur de » annonce une chose qu’on craint ; travailler comme infirmière est ce qu’on souhaite.' },
      { p: 'puisque', why: '« Puisque » donne une raison déjà vraie ; ici, l’emploi est un objectif.' }
    ],
    back: { p: 'parce-que', c: 'b', s: 'Je suis des cours de francisation le soir <{parce que} je [veux travailler] comme infirmière au Québec>.', fn: 'Avec « parce que », le but devient une raison : on ajoute « vouloir » au présent, suivi de l’infinitif.' }
  },
  {
    id: 'but-02', rel: 'but', th: 'garderie',
    a: 'J’écris un mot dans le cahier de communication.', b: 'L’éducatrice sait que Mila a mal dormi.',
    as: 'un mot écrit', bs: 'l’éducatrice sait',
    ok: [
      { p: 'pour-que', c: 'b', s: 'J’écris un mot dans le cahier de communication <{pour que} l’éducatrice [sache] que Mila a mal dormi>.' }
    ],
    non: [
      { p: 'pour', why: '« Pour » + infinitif ne marche qu’avec le même sujet : ici, c’est moi qui écris, mais c’est l’éducatrice qui doit savoir.' },
      { p: 'pour-ne-pas', why: '« Pour ne pas » sert à éviter quelque chose ; ici, on veut au contraire que l’éducatrice soit informée.' },
      { p: 'puisque', why: '« Puisque » donne une raison déjà connue ; l’éducatrice ne le sait pas encore.' }
    ],
    back: { p: 'si-bien-que', c: 'b', s: 'J’écris un mot dans le cahier de communication, <{si bien que} l’éducatrice sait que Mila a mal dormi>.', fn: 'Avec « si bien que », ce n’est plus un but mais un résultat réel : le verbe revient à l’indicatif (sait).' }
  },
  {
    id: 'but-03', rel: 'but', th: 'logement',
    a: 'Je colle des feutres sous les pattes des chaises.', b: 'Je ne dérange pas les voisins d’en bas.',
    as: 'des feutres', bs: 'pas déranger',
    ok: [
      { p: 'pour-ne-pas', c: 'b', s: 'Je colle des feutres sous les pattes des chaises <{pour ne pas} [déranger] les voisins d’en bas>.' }
    ],
    non: [
      { p: 'pour-que', why: '« Pour que » + subjonctif demande un autre sujet ; ici, c’est moi qui colle les feutres et moi qui ne veux pas déranger : même sujet, donc infinitif.' },
      { p: 'en-vue-de', why: '« En vue de » + nom prépare un objectif lointain (un examen, un déménagement) ; ici, on évite un petit problème de tous les jours.' },
      { p: 'quand', why: '« Quand » situe deux actions dans le temps ; ici, les feutres servent à éviter le bruit.' }
    ],
    back: { p: 'parce-que', c: 'b', s: 'Je colle des feutres sous les pattes des chaises <{parce que} je [ne veux pas déranger] les voisins d’en bas>.', fn: 'Avec « parce que », on dit la raison : « ne… pas » entoure maintenant « vouloir », et « déranger » reste à l’infinitif.' }
  },
  {
    id: 'but-04', rel: 'but', th: 'santé',
    a: 'J’appelle Info-Santé au 811.', b: 'Je parle à une infirmière.',
    as: 'j’appelle le 811', bs: 'une infirmière',
    ok: [
      { p: 'pour', c: 'b', s: 'J’appelle Info-Santé au 811 <{pour} [parler] à une infirmière>.' }
    ],
    non: [
      { p: 'pour-que', why: '« Pour que » + subjonctif sert quand une autre personne fait l’action visée ; ici, c’est moi qui appelle et moi qui parle.' },
      { p: 'pour-ne-pas', why: '« Pour ne pas parler à une infirmière » dirait le contraire : ici, on veut obtenir quelque chose, pas l’éviter.' },
      { p: 'avant-de', why: '« Avant de » situe l’appel dans le temps ; il ne dit pas à quoi il sert.' }
    ],
    back: { p: 'alors', c: 'a', s: 'Je [veux parler] à une infirmière, <{alors} j’appelle Info-Santé au 811>.', fn: 'Avec « alors », on part de ce qu’on veut (vouloir + infinitif) et le pont s’accroche à l’action : l’ordre des idées s’inverse.' }
  },
  {
    id: 'but-05', rel: 'but', th: 'démarches administratives',
    a: 'Je vous écris.', b: 'Je confirme ma présence à la séance d’information du 12 mars.',
    as: 'je vous écris', bs: 'confirmer',
    ok: [
      { p: 'afin-de', c: 'b', s: 'Je vous écris <{afin de} [confirmer] ma présence à la séance d’information du 12 mars>.' }
    ],
    non: [
      { p: 'afin-que', why: '« Afin que » + subjonctif exige deux sujets différents ; ici, c’est moi qui écris et moi qui confirme : on garde l’infinitif.' },
      { p: 'de-peur-de', why: '« De peur de » exprime une crainte ; confirmer sa présence est un objectif, pas une peur.' },
      { p: 'puisque', why: '« Puisque » donne une raison déjà connue de tous, pas le but du courriel.' }
    ],
    back: { p: 'parce-que', c: 'b', s: 'Je vous écris <{parce que} je [souhaite confirmer] ma présence à la séance d’information du 12 mars>.', fn: 'Avec « parce que », le but devient une raison : on ajoute un verbe de volonté (souhaiter) au présent, suivi de l’infinitif.' }
  },
  {
    id: 'but-06', rel: 'but', th: 'travail',
    a: 'Je vous envoie mes disponibilités.', b: 'Vous pouvez préparer l’horaire de décembre.',
    as: 'disponibilités', bs: 'l’horaire',
    ok: [
      { p: 'afin-que', c: 'b', s: 'Je vous envoie mes disponibilités <{afin que} vous [puissiez] préparer l’horaire de décembre>.' },
      { p: 'pour-que', c: 'b', s: 'Je vous envoie mes disponibilités <{pour que} vous [puissiez] préparer l’horaire de décembre>.' }
    ],
    non: [
      { p: 'afin-de', why: '« Afin de » + infinitif ne va qu’avec le même sujet ; ici, j’envoie les disponibilités, mais c’est vous qui préparez l’horaire.' },
      { p: 'au-cas-ou', why: '« Au cas où » prépare une précaution contre un problème possible ; ici, l’envoi sert un objectif précis.' },
      { p: 'des-que', why: '« Dès que » parle du moment ; il ne dit pas à quoi sert l’envoi.' }
    ],
    back: { p: 'parce-que', c: 'b', s: 'Je vous envoie mes disponibilités <{parce que} je [souhaite que] vous [puissiez] préparer l’horaire de décembre>.', fn: 'Avec « parce que », il faut ajouter « je souhaite que » : le subjonctif reste, mais c’est maintenant « souhaiter que » qui le demande.' }
  },
  {
    id: 'but-07', rel: 'but', th: 'voisinage',
    a: 'Je pellette l’entrée commune avant 7 h.', b: 'Ma voisine peut sortir sa voiture.',
    as: 'je pellette', bs: 'la voisine sort',
    ok: [
      { p: 'pour-que', c: 'b', s: 'Je pellette l’entrée commune avant 7 h <{pour que} ma voisine [puisse] sortir sa voiture>.' }
    ],
    non: [
      { p: 'pour', why: '« Pour » + infinitif voudrait dire que c’est moi qui sors la voiture ; ici, le sujet change (ma voisine), donc « pour que » + subjonctif.' },
      { p: 'de-peur-que', why: '« De peur que » annonce une chose qu’on craint ; ici, que ma voisine puisse sortir est ce qu’on souhaite.' },
      { p: 'avant-que', why: '« Avant que » situe deux actions dans le temps ; ici, on dit à quoi sert le pelletage.' }
    ],
    back: { p: 'c-est-pour-ca-que', c: 'a', s: '[Je veux que] ma voisine [puisse] sortir sa voiture, <{c’est pour ça que} je pellette l’entrée commune avant 7 h>.', fn: 'Avec « c’est pour ça que », on dit d’abord le but (je veux que + subjonctif), puis l’action : le pont s’accroche maintenant au pelletage.' }
  },
  {
    id: 'but-08', rel: 'but', th: 'francisation',
    a: 'La prof répète chaque consigne deux fois.', b: 'Tout le monde comprend ce qu’il faut faire.',
    as: 'elle répète', bs: 'tous comprennent',
    ok: [
      { p: 'pour-que', c: 'b', s: 'La prof répète chaque consigne deux fois <{pour que} tout le monde [comprenne] ce qu’il faut faire>.' }
    ],
    non: [
      { p: 'pour', why: '« Pour » + infinitif voudrait dire que c’est la prof qui comprend ; ici, le sujet change (tout le monde), donc subjonctif.' },
      { p: 'de-peur-que', why: '« De peur que » exprime une crainte ; que tout le monde comprenne est le résultat souhaité, pas une peur.' },
      { p: 'pendant-que', why: '« Pendant que » dit que deux actions se passent en même temps, pas à quoi sert la répétition.' }
    ],
    back: { p: 'parce-que', c: 'b', s: 'La prof répète chaque consigne deux fois <{parce qu’}elle [veut que] tout le monde [comprenne] ce qu’il faut faire>.', fn: 'Avec « parce que », on ajoute « elle veut que » : la volonté devient la raison, et le subjonctif reste après « vouloir que ».' }
  },
  {
    id: 'but-09', rel: 'but', th: 'épicerie',
    a: 'J’écris ma liste d’épicerie sur mon cellulaire.', b: 'J’oublie encore le lait.',
    as: 'ma liste', bs: 'oublier le lait',
    ok: [
      { p: 'de-peur-de', c: 'b', s: 'J’écris ma liste d’épicerie sur mon cellulaire <{de peur d’}[oublier] encore le lait>.' }
    ],
    non: [
      { p: 'de-peur-que', why: '« De peur que » + subjonctif s’emploie avec un autre sujet ; ici, c’est moi qui risque d’oublier : même sujet, donc « de peur de » + infinitif.' },
      { p: 'pour', why: '« Pour oublier le lait » dirait que je veux l’oublier : c’est le contraire. Il faut un pont qui dit ce qu’on veut éviter.' },
      { p: 'avant-de', why: '« Avant de » situe la liste dans le temps ; il ne dit pas ce qu’on veut éviter.' }
    ],
    back: { p: 'parce-que', c: 'b', s: 'J’écris ma liste d’épicerie sur mon cellulaire <{parce que} [j’ai peur d’oublier] encore le lait>.', fn: 'Avec « parce que », la crainte devient la raison : on conjugue « avoir peur de », suivi de l’infinitif.' }
  },
  {
    id: 'but-10', rel: 'but', th: 'hiver',
    a: 'Je mets du sel sur les marches.', b: 'Quelqu’un se fait mal sur la glace.',
    as: 'du sel', bs: 'quelqu’un tombe',
    ok: [
      { p: 'de-peur-que', c: 'b', s: 'Je mets du sel sur les marches <{de peur que} quelqu’un se [fasse] mal sur la glace>.' }
    ],
    non: [
      { p: 'de-peur-de', why: '« De peur de » + infinitif ne marche qu’avec le même sujet ; ici, c’est moi qui mets le sel, mais c’est quelqu’un d’autre qui risque de tomber.' },
      { p: 'pour-que', why: '« Pour que quelqu’un se fasse mal » dirait que je veux l’accident ! Il faut un pont qui exprime la crainte.' },
      { p: 'quand', why: '« Quand » situerait le sel au moment de l’accident ; ici, on veut l’éviter.' }
    ],
    back: { p: 'donc', c: 'a', s: '[J’ai peur que] quelqu’un se [fasse] mal sur la glace, <{donc} je mets du sel sur les marches>.', fn: 'Avec « donc », la crainte passe devant (j’ai peur que + subjonctif) et le pont s’accroche à l’action, qui devient la conséquence.' }
  },
  {
    id: 'but-11', rel: 'but', th: 'logement',
    a: 'Je mets de l’argent de côté chaque mois.', b: 'J’achète un condo dans deux ans.',
    as: 'j’épargne', bs: 'un condo',
    ok: [
      { p: 'en-vue-de', c: 'b', s: 'Je mets de l’argent de côté chaque mois <{en vue de} [l’achat d’un] condo dans deux ans>.' }
    ],
    non: [
      { p: 'pour-que', why: '« Pour que » demande un autre sujet + subjonctif ; ici, c’est moi qui épargne et moi qui achète.' },
      { p: 'de-peur-de', why: '« De peur de » exprime une crainte ; acheter un condo est un projet souhaité, pas une chose à éviter.' },
      { p: 'grace-a', why: '« Grâce à » + nom présente une cause positive déjà réelle, pas un projet.' }
    ],
    back: { p: 'parce-que', c: 'b', s: 'Je mets de l’argent de côté chaque mois <{parce que} je [veux acheter] un condo dans deux ans>.', fn: '« En vue de » demandait un nom (l’achat) ; avec « parce que », on retrouve un verbe conjugué : vouloir + infinitif.' }
  },
  {
    id: 'but-12', rel: 'but', th: 'famille',
    a: 'Je place le bureau près de la fenêtre.', b: 'Mon fils fait ses devoirs à la lumière du jour.',
    as: 'le bureau', bs: 'à la lumière',
    ok: [
      { p: 'de-sorte-que', c: 'b', s: 'Je place le bureau près de la fenêtre <{de sorte que} mon fils [fasse] ses devoirs à la lumière du jour>.' },
      { p: 'pour-que', c: 'b', s: 'Je place le bureau près de la fenêtre <{pour que} mon fils [fasse] ses devoirs à la lumière du jour>.' }
    ],
    non: [
      { p: 'pour', why: '« Pour » + infinitif voudrait dire que c’est moi qui fais les devoirs ; ici, le sujet change (mon fils), donc il faut un pont + subjonctif.' },
      { p: 'quand', why: '« Quand » situe deux actions dans le temps ; ici, on dit à quoi sert la place du bureau.' }
    ],
    back: { p: 'si-bien-que', c: 'b', s: 'Je place le bureau près de la fenêtre, <{si bien que} mon fils fait ses devoirs à la lumière du jour>.', fn: 'Avec l’indicatif (fait), ce n’est plus un but mais un résultat constaté. « De sorte que » + indicatif aurait aussi ce sens de conséquence.' }
  },
  {
    id: 'but-13', rel: 'but', th: 'citoyenneté',
    a: 'Je réussis l’examen de citoyenneté.', b: 'Je révise le guide d’étude tous les soirs.',
    as: 'réussir l’examen', bs: 'je révise',
    ok: [
      { p: 'pour', c: 'a', s: '<{Pour} [réussir] l’examen de citoyenneté>, je révise le guide d’étude tous les soirs.' }
    ],
    non: [
      { p: 'pour-que', why: '« Pour que » + subjonctif seulement si le sujet change ; ici, c’est moi qui révise et moi qui passe l’examen.' },
      { p: 'de-peur-de', why: '« De peur de réussir » n’a pas de sens : on a peur de ce qu’on veut éviter, pas de ce qu’on souhaite.' },
      { p: 'apres-inf', why: '« Après » + infinitif passé mettrait l’examen avant les révisions : l’ordre ne va pas.' }
    ],
    back: { p: 'c-est-pour-ca-que', c: 'b', s: 'Je [veux réussir] l’examen de citoyenneté, <{c’est pour ça que} je révise le guide d’étude tous les soirs>.', fn: 'Avec « c’est pour ça que », on dit d’abord ce qu’on veut (vouloir + infinitif), puis l’action : le pont s’accroche maintenant aux révisions.' }
  },
  {
    id: 'but-14', rel: 'but', th: 'loisirs',
    a: 'Je m’inscris à la ligue de balle molle du quartier.', b: 'Je me fais des amis québécois.',
    as: 'balle molle', bs: 'des amis',
    ok: [
      { p: 'pour', c: 'b', s: 'Je m’inscris à la ligue de balle molle du quartier <{pour} me [faire] des amis québécois>.' }
    ],
    non: [
      { p: 'pour-que', why: '« Pour que je me fasse des amis » ne se dit pas : c’est le même sujet (je), donc « pour » + infinitif, et on garde « me ».' },
      { p: 'de-peur-de', why: '« De peur de » annonce une crainte ; se faire des amis est ce qu’on souhaite.' },
      { p: 'puisque', why: '« Puisque » donne une raison déjà vraie ; ici, les amis sont un objectif.' }
    ],
    back: { p: 'parce-que', c: 'b', s: 'Je m’inscris à la ligue de balle molle du quartier <{parce que} je [veux] me [faire] des amis québécois>.', fn: 'Avec « parce que », on ajoute « vouloir » au présent ; « me faire » reste à l’infinitif, avec son pronom devant.' }
  },
  {
    id: 'but-15', rel: 'but', th: 'transport',
    a: 'Je recharge ma carte OPUS le dimanche.', b: 'Je ne fais pas la file le lundi matin.',
    as: 'carte OPUS', bs: 'pas de file',
    ok: [
      { p: 'pour-ne-pas', c: 'b', s: 'Je recharge ma carte OPUS le dimanche <{pour ne pas} [faire] la file le lundi matin>.' }
    ],
    non: [
      { p: 'pour-que', why: '« Pour que je ne fasse pas la file » ne se dit pas : c’est le même sujet (je), donc infinitif, avec « ne pas » placé devant.' },
      { p: 'si-present', why: '« Si » ferait de la file une condition ; ici, on agit pour l’éviter.' },
      { p: 'depuis-que', why: '« Depuis que » donne un point de départ dans le temps, pas un but.' }
    ],
    back: { p: 'alors', c: 'a', s: 'Je [ne veux pas faire] la file le lundi matin, <{alors} je recharge ma carte OPUS le dimanche>.', fn: 'Avec « alors », on part de ce qu’on veut éviter (ne pas vouloir + infinitif), puis le pont présente l’action comme une conséquence.' }
  }
]);
