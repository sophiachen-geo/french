/* Atelier de ponts — banque « Cause et conséquence » (rel: 'cause').
   Format : voir outils/exemple-banque.js. */
ATELIER.ajouter([
  {
    id: 'cause-01', rel: 'cause', th: 'santé',
    a: 'Je ne vais pas travailler aujourd’hui.', b: 'J’ai une grosse grippe.',
    as: 'pas travailler', bs: 'grosse grippe',
    ok: [
      { p: 'parce-que', c: 'b', s: 'Je ne vais pas travailler aujourd’hui <{parce que} j’ai une grosse grippe>.' },
      { p: 'comme', c: 'b', s: '<{Comme} j’ai une grosse grippe>, je ne vais pas travailler aujourd’hui.' }
    ],
    non: [
      { p: 'faute-de', why: '« Faute de » exprime un manque ; ici il ne manque rien : c’est la grippe qui est là.' },
      { p: 'pour', why: '« Pour » annonce un but ; personne ne reste chez soi dans le but d’avoir la grippe.' }
    ],
    back: { p: 'donc', c: 'a', s: 'J’ai une grosse grippe, <{donc} je ne vais pas travailler aujourd’hui>.',
      fn: 'Le pont passe du côté du résultat : la grippe vient d’abord, puis « donc » annonce l’absence.' }
  },
  {
    id: 'cause-02', rel: 'cause', th: 'transport',
    a: 'Je suis arrivée en retard au bureau.', b: 'Le métro est tombé en panne.',
    as: 'retard au bureau', bs: 'panne de métro',
    ok: [
      { p: 'a-cause-de', c: 'b', s: 'Je suis arrivée en retard au bureau <{à cause d’}[une panne de métro]>.' },
      { p: 'parce-que', c: 'b', s: 'Je suis arrivée en retard au bureau <{parce que} le métro est tombé en panne>.' }
    ],
    non: [
      { p: 'grace-a', why: '« Grâce à » réserve la cause aux bonnes nouvelles ; une panne qui te met en retard n’en est pas une.' },
      { p: 'bien-que', why: '« Bien que » annonce un obstacle ; ici la panne explique le retard.' }
    ],
    back: { p: 'c-est-pour-ca-que', c: 'a', s: 'Le métro est tombé en panne, <{c’est pour ça que} je suis arrivée en retard au bureau>.',
      fn: 'Le pont s’accroche maintenant au résultat : la panne, redevenue une phrase avec un verbe, passe devant.' }
  },
  {
    id: 'cause-03', rel: 'cause', th: 'logement',
    a: 'J’ai trouvé un logement rapidement.', b: 'Une collègue m’a recommandée au propriétaire.',
    as: 'logement trouvé', bs: 'recommandation',
    ok: [
      { p: 'grace-a', c: 'b', s: 'J’ai trouvé un logement rapidement <{grâce à} [la recommandation d’une collègue]>.' }
    ],
    non: [
      { p: 'a-cause-de', why: '« À cause de » présente plutôt une cause négative ; une recommandation qui t’aide à trouver un logement est positive.' },
      { p: 'faute-de', why: '« Faute de » + nom sans article signale un manque ; ici, au contraire, tu as reçu de l’aide.' },
      { p: 'malgre', why: 'La recommandation n’est pas un obstacle, c’est une aide.' }
    ],
    back: { p: 'si-bien-que', c: 'a', s: 'Une collègue m’a recommandée au propriétaire, <{si bien que} j’ai trouvé un logement rapidement>.',
      fn: 'Le pont passe au résultat : la cause redevient une phrase complète (« une collègue m’a recommandée ») et vient en premier.' }
  },
  {
    id: 'cause-04', rel: 'cause', th: 'hiver',
    a: 'Je suis tombée deux fois ce matin.', b: 'Les trottoirs sont très glissants.',
    as: 'deux chutes', bs: 'très glissants',
    ok: [
      { p: 'tellement-que', c: 'a', s: 'Les trottoirs sont {tellement} glissants <{que} je suis tombée deux fois ce matin>.' }
    ],
    non: [
      { p: 'trop-pour', why: '« Trop… pour » + infinitif annonce un résultat devenu impossible ; or la chute a bel et bien eu lieu.' },
      { p: 'pourtant', why: '« Pourtant » annonce une surprise ; tomber sur un trottoir glissant n’a rien de surprenant.' }
    ],
    back: { p: 'parce-que', c: 'b', s: 'Je suis tombée deux fois ce matin <{parce que} les trottoirs sont très glissants>.',
      fn: 'Le pont passe à la cause : la chute vient d’abord, et « tellement » redevient « très », puisqu’il n’y a plus de « que ».' }
  },
  {
    id: 'cause-05', rel: 'cause', th: 'loisirs',
    a: 'Je ne vais pas au cours de zumba ce soir.', b: 'Je suis très fatiguée.',
    as: 'pas de zumba', bs: 'très fatiguée',
    ok: [
      { p: 'trop-pour', c: 'a', s: 'Je suis {trop} fatiguée <{pour} [aller] au cours de zumba ce soir>.' }
    ],
    non: [
      { p: 'assez-pour', why: '« Assez… pour » annonce un résultat rendu possible ; ici la fatigue t’empêche d’aller au cours, c’est l’inverse.' },
      { p: 'bien-que', why: '« Bien que » annonce un obstacle surmonté ; ici tu n’y vas pas.' }
    ],
    back: { p: 'parce-que', c: 'b', s: 'Je ne vais pas au cours de zumba ce soir <{parce que} je suis très fatiguée>.',
      fn: 'Avec « parce que », les deux phrases restent complètes : le verbe redevient conjugué (« je ne vais pas ») et « trop » redevient « très ».' }
  },
  {
    id: 'cause-06', rel: 'cause', th: 'logement',
    a: 'Nous ne pouvons pas vivre dans un trois et demie.', b: 'Notre famille est très nombreuse.',
    as: 'pas un 3 et demie', bs: 'très nombreuse',
    ok: [
      { p: 'trop-pour', c: 'a', s: 'Notre famille est {trop} nombreuse <{pour} [vivre] dans un trois et demie>.' }
    ],
    non: [
      { p: 'assez-pour', why: '« Assez… pour » dirait que la famille peut vivre dans ce trois et demie ; or c’est justement impossible.' },
      { p: 'meme-si', why: '« Même si » annonce un obstacle surmonté ; ici la taille de la famille explique le problème.' }
    ],
    back: { p: 'parce-que', c: 'b', s: 'Nous ne pouvons pas vivre dans un trois et demie <{parce que} notre famille est très nombreuse>.',
      fn: 'Le pont passe à la cause : le résultat retrouve son verbe conjugué (« nous ne pouvons pas vivre ») et vient en premier.' }
  },
  {
    id: 'cause-07', rel: 'cause', th: 'famille',
    a: 'Mon fils est grand maintenant.', b: 'Il peut prendre l’autobus tout seul.',
    as: 'fils grand', bs: 'autobus tout seul',
    ok: [
      { p: 'assez-pour', c: 'b', s: 'Mon fils est maintenant {assez} grand <{pour} [prendre] l’autobus tout seul>.' }
    ],
    non: [
      { p: 'trop-pour', why: '« Trop… pour » dirait que l’autobus lui est interdit ; or il peut justement le prendre.' },
      { p: 'faute-de', why: '« Faute de » signale un manque ; ici rien ne manque, ton fils a grandi.' },
      { p: 'meme-si', why: 'Grandir n’est pas un obstacle : c’est la raison.' }
    ],
    back: { p: 'comme', c: 'a', s: '<{Comme} mon fils est grand maintenant>, il peut prendre l’autobus tout seul.',
      fn: '« Comme » s’accroche à la cause, en tête de phrase ; « il peut prendre » retrouve son verbe conjugué, sans « assez ».' }
  },
  {
    id: 'cause-08', rel: 'cause', th: 'logement',
    a: 'Notre nouvel appartement est grand.', b: 'Il peut accueillir ma mère quand elle vient nous voir.',
    as: 'appartement grand', bs: 'accueillir ma mère',
    ok: [
      { p: 'assez-pour', c: 'b', s: 'Notre nouvel appartement est {assez} grand <{pour} [accueillir] ma mère quand elle vient nous voir>.' }
    ],
    non: [
      { p: 'trop-pour', why: '« Trop… pour » annonce un résultat impossible ; ici l’appartement peut bel et bien accueillir ta mère.' },
      { p: 'a-cause-de', why: '« À cause de » + nom présente une cause plutôt négative ; un grand appartement est un avantage.' },
      { p: 'pourtant', why: '« Pourtant » annonce une surprise ; ici, tout est logique.' }
    ],
    back: { p: 'vu-que', c: 'a', s: '<{Vu que} notre nouvel appartement est grand>, il peut accueillir ma mère quand elle vient nous voir.',
      fn: '« Vu que » s’accroche à la cause, sans « assez » ni infinitif : la deuxième phrase retrouve son verbe conjugué.' }
  },
  {
    id: 'cause-09', rel: 'cause', th: 'météo',
    a: 'Les écoles de Montréal sont fermées aujourd’hui.', b: 'Une forte tempête de neige frappe le sud du Québec.',
    as: 'écoles fermées', bs: 'tempête de neige',
    ok: [
      { p: 'en-raison-de', c: 'b', s: '<{En raison de} [la forte tempête de neige]>, les écoles de Montréal sont fermées aujourd’hui.' },
      { p: 'comme', c: 'b', s: '<{Comme} une forte tempête de neige frappe le sud du Québec>, les écoles de Montréal sont fermées aujourd’hui.' }
    ],
    non: [
      { p: 'a-force-de', why: '« À force de » + infinitif parle d’un effort répété ; une tempête n’est pas une action que quelqu’un répète.' },
      { p: 'malgre', why: '« Malgré » annonce un obstacle ; ici la tempête explique la fermeture.' }
    ],
    back: { p: 'si-bien-que', c: 'a', s: 'Une forte tempête de neige frappe le sud du Québec, <{si bien que} les écoles de Montréal sont fermées aujourd’hui>.',
      fn: 'Le pont passe au résultat : la tempête vient d’abord, avec son verbe (« frappe »), puis « si bien que » + la fermeture.' }
  },
  {
    id: 'cause-10', rel: 'cause', th: 'démarches',
    a: 'Le bureau de Services Québec sera fermé lundi.', b: 'Lundi, c’est la Fête nationale.',
    as: 'bureau fermé', bs: 'Fête nationale',
    ok: [
      { p: 'en-raison-de', c: 'b', s: '<{En raison de} [la Fête nationale]>, le bureau de Services Québec sera fermé lundi.' }
    ],
    non: [
      { p: 'faute-de', why: '« Faute de » exprime un manque ; ici rien ne manque, c’est un jour férié.' },
      { p: 'tellement-que', why: '« Tellement… que » demande une qualité qui peut être plus ou moins forte ; un jour férié, ça ne se mesure pas.' }
    ],
    back: { p: 'par-consequent', c: 'a', s: 'Lundi, c’est la Fête nationale ; <{par conséquent}, le bureau de Services Québec sera fermé [ce jour-là]>.',
      fn: 'Le pont passe au résultat et garde le ton des avis officiels : le jour férié d’abord, puis « par conséquent » + la fermeture.' }
  },
  {
    id: 'cause-11', rel: 'cause', th: 'études',
    a: 'J’ai réussi mon examen de français.', b: 'Ma tutrice m’a beaucoup aidée.',
    as: 'examen réussi', bs: 'aide de la tutrice',
    ok: [
      { p: 'grace-a', c: 'b', s: '<{Grâce à} [l’aide de ma tutrice]>, j’ai réussi mon examen de français.' }
    ],
    non: [
      { p: 'a-cause-de', why: '« À cause de » présente une cause négative ; l’aide de ta tutrice est positive, il faut « grâce à ».' },
      { p: 'malgre', why: '« Malgré » annonce un obstacle ; l’aide n’en est pas un.' }
    ],
    back: { p: 'donc', c: 'a', s: 'Ma tutrice m’a beaucoup aidée, <{donc} j’ai réussi mon examen de français>.',
      fn: 'Le pont passe au résultat : la cause redevient une phrase avec un verbe (« m’a aidée ») et vient en premier.' }
  },
  {
    id: 'cause-12', rel: 'cause', th: 'santé',
    a: 'Je n’ai presque plus mal au dos.', b: 'Je fais des exercices de physiothérapie tous les jours.',
    as: 'presque plus mal', bs: 'mes exercices',
    ok: [
      { p: 'a-force-de', c: 'b', s: '<{À force de} [faire] des exercices de physiothérapie tous les jours>, je n’ai presque plus mal au dos.' },
      { p: 'grace-a', c: 'b', s: '<{Grâce à} [mes exercices de physiothérapie quotidiens]>, je n’ai presque plus mal au dos.' }
    ],
    non: [
      { p: 'a-cause-de', why: '« À cause de » présente une cause négative ; ici les exercices te font du bien.' },
      { p: 'meme-si', why: '« Même si » annonce un obstacle ; les exercices expliquent le progrès.' }
    ],
    back: { p: 'c-est-pour-ca-que', c: 'a', s: 'Je fais des exercices de physiothérapie tous les jours, <{c’est pour ça que} je n’ai presque plus mal au dos>.',
      fn: 'Le pont passe au résultat : l’effort redevient une phrase conjuguée (« je fais ») et vient en premier.' }
  },
  {
    id: 'cause-13', rel: 'cause', th: 'loisirs',
    a: 'Je comprends mieux l’accent québécois.', b: 'J’écoute la radio en français tous les matins.',
    as: 'je comprends mieux', bs: 'radio le matin',
    ok: [
      { p: 'a-force-de', c: 'b', s: '<{À force d’}[écouter] la radio en français tous les matins>, je comprends mieux l’accent québécois.' }
    ],
    non: [
      { p: 'faute-de', why: '« Faute de » signale un manque ; ici, au contraire, tu écoutes beaucoup la radio.' },
      { p: 'bien-que', why: '« Bien que » annonce un obstacle ; la radio t’aide, au contraire.' }
    ],
    back: { p: 'si-bien-que', c: 'a', s: 'J’écoute la radio en français tous les matins, <{si bien que} je comprends mieux l’accent québécois>.',
      fn: 'Le pont passe au résultat : l’effort, redevenu une phrase conjuguée (« j’écoute »), vient d’abord.' }
  },
  {
    id: 'cause-14', rel: 'cause', th: 'travail',
    a: 'Je n’ai pas fini mon rapport.', b: 'Je n’avais pas assez de temps.',
    as: 'rapport pas fini', bs: 'pas assez de temps',
    ok: [
      { p: 'faute-de', c: 'b', s: '<{Faute de} [temps]>, je n’ai pas fini mon rapport.' },
      { p: 'parce-que', c: 'b', s: 'Je n’ai pas fini mon rapport <{parce que} je n’avais pas assez de temps>.' }
    ],
    non: [
      { p: 'grace-a', why: '« Grâce à » annonce une cause positive ; manquer de temps n’aide personne.' },
      { p: 'malgre', why: '« Malgré » annonce un obstacle surmonté ; ici le rapport n’est pas fini.' }
    ],
    back: { p: 'donc', c: 'a', s: 'Je n’avais pas assez de temps, <{donc} je n’ai pas fini mon rapport>.',
      fn: 'Le pont passe au résultat : le manque de temps vient d’abord, sous forme de phrase complète.' }
  },
  {
    id: 'cause-15', rel: 'cause', th: 'santé',
    a: 'Je vais à la clinique sans rendez-vous.', b: 'Je n’ai pas de médecin de famille.',
    as: 'sans rendez-vous', bs: 'pas de médecin',
    ok: [
      { p: 'faute-de', c: 'b', s: '<{Faute de} [médecin de famille]>, je vais à la clinique sans rendez-vous.' },
      { p: 'comme', c: 'b', s: '<{Comme} je n’ai pas de médecin de famille>, je vais à la clinique sans rendez-vous.' }
    ],
    non: [
      { p: 'a-force-de', why: '« À force de » + infinitif parle d’un effort répété ; ne pas avoir de médecin n’est pas un effort.' },
      { p: 'pourtant', why: '« Pourtant » annonce une surprise ; ici, aller à la clinique sans rendez-vous est logique.' }
    ],
    back: { p: 'c-est-pour-ca-que', c: 'a', s: 'Je n’ai pas de médecin de famille, <{c’est pour ça que} je vais à la clinique sans rendez-vous>.',
      fn: 'Le pont passe au résultat : la cause garde sa place devant, mais c’est maintenant le résultat que le pont présente.' }
  },
  {
    id: 'cause-16', rel: 'cause', th: 'famille',
    a: 'C’est toi qui conduis.', b: 'Tu as ton permis maintenant.',
    as: 'toi, tu conduis', bs: 'ton permis',
    ok: [
      { p: 'puisque', c: 'b', s: '<{Puisque} tu as ton permis maintenant>, c’est toi qui conduis.' },
      { p: 'vu-que', c: 'b', s: '<{Vu que} tu as ton permis maintenant>, c’est toi qui conduis.' }
    ],
    non: [
      { p: 'tellement-que', why: '« Tellement… que » demande une qualité qui peut être plus ou moins forte ; un permis, on l’a ou on ne l’a pas.' },
      { p: 'bien-que', why: '« Bien que » annonce un obstacle ; le permis est ici la raison du choix.' }
    ],
    back: { p: 'donc', c: 'a', s: 'Tu as ton permis maintenant, <{donc} c’est toi qui conduis>.',
      fn: 'Le pont passe au résultat ; on perd l’idée « tu le sais déjà » que donnait « puisque ».' }
  },
  {
    id: 'cause-17', rel: 'cause', th: 'épicerie',
    a: 'On n’a pas besoin d’acheter des œufs.', b: 'Il en reste une douzaine dans le frigo.',
    as: 'pas besoin d’œufs', bs: 'une douzaine',
    ok: [
      { p: 'puisque', c: 'b', s: 'On n’a pas besoin d’acheter des œufs, <{puisqu’}il en reste une douzaine dans le frigo>.' }
    ],
    non: [
      { p: 'faute-de', why: '« Faute de » signale un manque ; or il reste des œufs, rien ne manque.' },
      { p: 'pour', why: '« Pour » annonce un but ; les œufs qui restent sont une raison, pas un but.' }
    ],
    back: { p: 'alors', c: 'a', s: 'Il reste une douzaine [d’œufs] dans le frigo, <{alors} on n’a pas besoin [d’en] acheter>.',
      fn: 'Le pont passe au résultat, et les mots s’échangent : on nomme d’abord les œufs, puis « en » évite de les répéter.' }
  },
  {
    id: 'cause-18', rel: 'cause', th: 'garderie',
    a: 'La garderie fermera exceptionnellement à 16 h vendredi.', b: 'Deux éducatrices sont absentes cette semaine.',
    as: 'fermeture à 16 h', bs: 'deux absentes',
    ok: [
      { p: 'etant-donne-que', c: 'b', s: 'La garderie fermera exceptionnellement à 16 h vendredi, <{étant donné que} deux éducatrices sont absentes cette semaine>.' },
      { p: 'en-raison-de', c: 'b', s: '<{En raison de} [l’absence de deux éducatrices]>, la garderie fermera exceptionnellement à 16 h vendredi.' }
    ],
    non: [
      { p: 'fait-que', why: '« Fait que » appartient à l’oral entre amis ; dans un avis officiel de la garderie, il ne convient pas.' },
      { p: 'grace-a', why: '« Grâce à » suppose une cause positive ; l’absence des éducatrices est un problème pour les parents.' }
    ],
    back: { p: 'donc', c: 'a', s: 'Deux éducatrices sont absentes cette semaine ; <la garderie fermera {donc} exceptionnellement à 16 h vendredi>.',
      fn: 'Le pont passe au résultat ; à l’écrit, « donc » se glisse souvent après le verbe : « fermera donc ».' }
  },
  {
    id: 'cause-19', rel: 'cause', th: 'travail',
    a: 'Je ne pourrai pas assister à la formation sur le nouveau logiciel.', b: 'J’ai un rendez-vous médical jeudi matin.',
    as: 'pas à la formation', bs: 'rendez-vous jeudi',
    ok: [
      { p: 'car', c: 'b', s: 'Je ne pourrai pas assister à la formation sur le nouveau logiciel, <{car} j’ai un rendez-vous médical jeudi matin>.' }
    ],
    non: [
      { p: 'tellement-que', why: '« Tellement… que » demande une qualité qu’on peut intensifier (un adjectif) ; un rendez-vous, ça ne se mesure pas.' },
      { p: 'pourtant', why: '« Pourtant » annonce un contraste ; ici le rendez-vous explique l’absence.' }
    ],
    back: { p: 'donc', c: 'a', s: 'J’ai un rendez-vous médical jeudi matin, <{donc} je ne pourrai pas assister à la formation sur le nouveau logiciel>.',
      fn: 'Le pont passe au résultat : le rendez-vous vient d’abord, puis « donc » annonce l’absence à la formation.' }
  },
  {
    id: 'cause-20', rel: 'cause', th: 'famille',
    a: 'Mon fils sera absent de l’école demain.', b: 'Il fait de la fièvre depuis hier soir.',
    as: 'absent demain', bs: 'fièvre',
    ok: [
      { p: 'car', c: 'b', s: 'Mon fils sera absent de l’école demain, <{car} il fait de la fièvre depuis hier soir>.' },
      { p: 'parce-que', c: 'b', s: 'Mon fils sera absent de l’école demain <{parce qu’}il fait de la fièvre depuis hier soir>.' }
    ],
    non: [
      { p: 'a-force-de', why: '« À force de » + infinitif parle d’un effort qu’on répète ; la fièvre n’est pas un effort.' },
      { p: 'cependant', why: '« Cependant » annonce un contraste ; la fièvre et l’absence vont dans le même sens.' }
    ],
    back: { p: 'donc', c: 'a', s: '[Mon fils] fait de la fièvre depuis hier soir, <{donc} [il] sera absent de l’école demain>.',
      fn: 'Le pont passe au résultat : la fièvre vient d’abord, et « mon fils » et « il » échangent leur place.' }
  },
  {
    id: 'cause-21', rel: 'cause', th: 'études',
    a: 'Ce cours de francisation me plaît beaucoup.', b: 'L’enseignante est très patiente.',
    as: 'le cours me plaît', bs: 'prof patiente',
    ok: [
      { p: 'd-autant-plus-que', c: 'b', s: 'Ce cours de francisation me plaît beaucoup, <{d’autant plus que} l’enseignante est très patiente>.' }
    ],
    non: [
      { p: 'a-cause-de', why: '« À cause de » + nom présente une cause plutôt négative ; la patience de l’enseignante est un avantage.' },
      { p: 'malgre', why: '« Malgré » annonce un obstacle ; la patience n’en est pas un.' }
    ],
    back: { p: 'c-est-pour-ca-que', c: 'a', s: 'L’enseignante est très patiente, <{c’est pour ça que} ce cours de francisation me plaît beaucoup>.',
      fn: 'Le pont passe au résultat ; la nuance « en plus de mes autres raisons » disparaît : la patience devient la seule cause.' }
  },
  {
    id: 'cause-22', rel: 'cause', th: 'démarches',
    a: 'Ma demande de permis de travail était incomplète.', b: 'Le traitement a pris trois mois de plus.',
    as: 'demande incomplète', bs: '3 mois de plus',
    ok: [
      { p: 'si-bien-que', c: 'b', s: 'Ma demande de permis de travail était incomplète, <{si bien que} le traitement a pris trois mois de plus>.' },
      { p: 'par-consequent', c: 'b', s: 'Ma demande de permis de travail était incomplète ; <{par conséquent}, le traitement a pris trois mois de plus>.' }
    ],
    non: [
      { p: 'grace-a', why: '« Grâce à » annonce une cause positive ; une demande incomplète cause un retard, pas un avantage.' },
      { p: 'pour-que', why: '« Pour que » annonce un but ; personne ne souhaite un traitement plus long.' }
    ],
    back: { p: 'parce-que', c: 'a', s: 'Le traitement a pris trois mois de plus <{parce que} ma demande de permis de travail était incomplète>.',
      fn: 'Le pont passe à la cause : le retard vient d’abord, puis « parce que » + l’explication.' }
  },
  {
    id: 'cause-23', rel: 'cause', th: 'transport',
    a: 'Mon auto ne démarre plus.', b: 'Je prends l’autobus cette semaine.',
    as: 'auto en panne', bs: 'l’autobus',
    ok: [
      { p: 'fait-que', c: 'b', s: 'Mon auto ne démarre plus, <{fait que} je prends l’autobus cette semaine>.' },
      { p: 'alors', c: 'b', s: 'Mon auto ne démarre plus, <{alors} je prends l’autobus cette semaine>.' }
    ],
    non: [
      { p: 'tellement-que', why: '« Tellement… que » demande une qualité qui peut être plus ou moins forte ; une auto démarre ou ne démarre pas.' },
      { p: 'meme-si', why: '« Même si » annonce un obstacle surmonté ; ici la panne explique le choix de l’autobus.' }
    ],
    back: { p: 'parce-que', c: 'a', s: 'Je prends l’autobus cette semaine <{parce que} mon auto ne démarre plus>.',
      fn: 'Le pont passe à la cause : le résultat vient d’abord. « Parce que » convient aussi bien à l’oral qu’à l’écrit.' }
  },
  {
    id: 'cause-24', rel: 'cause', th: 'logement',
    a: 'Le chauffage ne fonctionne plus dans mon appartement.', b: 'J’ai appelé le propriétaire.',
    as: 'chauffage en panne', bs: 'appel au proprio',
    ok: [
      { p: 'c-est-pour-ca-que', c: 'b', s: 'Le chauffage ne fonctionne plus dans mon appartement, <{c’est pour ça que} j’ai appelé le propriétaire>.' },
      { p: 'alors', c: 'b', s: 'Le chauffage ne fonctionne plus dans mon appartement, <{alors} j’ai appelé le propriétaire>.' }
    ],
    non: [
      { p: 'a-force-de', why: '« À force de » + infinitif demande un effort répété ; une panne de chauffage n’est pas un effort.' },
      { p: 'pour-que', why: '« Pour que » annonce un but ; la panne est la raison de l’appel, pas son but.' }
    ],
    back: { p: 'comme', c: 'a', s: '<{Comme} le chauffage ne fonctionne plus dans mon appartement>, j’ai appelé le propriétaire.',
      fn: 'L’ordre reste le même, mais le pont change de côté : « comme » s’accroche à la cause, en tête de phrase.' }
  },
  {
    id: 'cause-25', rel: 'cause', th: 'travail',
    a: 'Le restaurant manque de personnel.', b: 'Je travaille aussi la fin de semaine.',
    as: 'manque d’employés', bs: 'fin de semaine',
    ok: [
      { p: 'c-est-pour-ca-que', c: 'b', s: 'Le restaurant manque de personnel, <{c’est pour ça que} je travaille aussi la fin de semaine>.' },
      { p: 'donc', c: 'b', s: 'Le restaurant manque de personnel, <{donc} je travaille aussi la fin de semaine>.' }
    ],
    non: [
      { p: 'grace-a', why: '« Grâce à » annonce une cause positive ; le manque de personnel est plutôt un problème pour toi.' },
      { p: 'pourtant', why: '« Pourtant » annonce une surprise ; travailler plus quand il manque du monde est logique.' }
    ],
    back: { p: 'parce-que', c: 'a', s: 'Je travaille aussi la fin de semaine <{parce que} le restaurant manque de personnel>.',
      fn: 'Le pont passe à la cause : on dit d’abord le résultat (ton horaire), puis « parce que » + la raison.' }
  },
  {
    id: 'cause-26', rel: 'cause', th: 'épicerie',
    a: 'Il n’y a plus de lait dans le frigo.', b: 'Je passe à l’épicerie en revenant du travail.',
    as: 'plus de lait', bs: 'à l’épicerie',
    ok: [
      { p: 'donc', c: 'b', s: 'Il n’y a plus de lait dans le frigo, <{donc} je passe à l’épicerie en revenant du travail>.' }
    ],
    non: [
      { p: 'trop-pour', why: '« Trop… pour » + infinitif annonce un résultat impossible ; ici, au contraire, tu vas bien à l’épicerie.' },
      { p: 'pour', why: '« Pour » + infinitif annonce un but ; « il n’y a plus de lait » est une raison, pas un but.' }
    ],
    back: { p: 'parce-que', c: 'a', s: 'Je passe à l’épicerie en revenant du travail <{parce qu’}il n’y a plus de lait dans le frigo>.',
      fn: 'Le pont passe à la cause : l’arrêt à l’épicerie vient d’abord, puis « parce que » explique pourquoi.' }
  },
  {
    id: 'cause-27', rel: 'cause', th: 'garderie',
    a: 'Mon cours de francisation finit tard le mardi.', b: 'Mon mari va chercher les enfants à la garderie ce jour-là.',
    as: 'cours tard', bs: 'mari à la garderie',
    ok: [
      { p: 'comme', c: 'a', s: '<{Comme} mon cours de francisation finit tard le mardi>, mon mari va chercher les enfants à la garderie ce jour-là.' }
    ],
    non: [
      { p: 'a-force-de', why: '« À force de » + infinitif annonce un effort répété qui finit par donner un résultat ; un horaire de cours n’est pas un effort.' },
      { p: 'pourtant', why: '« Pourtant » annonce une surprise ; ici, c’est logique que ton mari y aille.' }
    ],
    back: { p: 'c-est-pour-ca-que', c: 'b', s: 'Mon cours de francisation finit tard le mardi, <{c’est pour ça que} mon mari va chercher les enfants à la garderie ce jour-là>.',
      fn: '« C’est pour ça que » garde le même ordre, mais s’accroche au résultat ; « comme », lui, s’accrochait à la cause.' }
  },
  {
    id: 'cause-28', rel: 'cause', th: 'loisirs',
    a: 'Il fait très beau aujourd’hui.', b: 'Nous allons pique-niquer au parc La Fontaine.',
    as: 'beau temps', bs: 'pique-nique',
    ok: [
      { p: 'comme', c: 'a', s: '<{Comme} il fait très beau aujourd’hui>, nous allons pique-niquer au parc La Fontaine.' },
      { p: 'alors', c: 'b', s: 'Il fait très beau aujourd’hui, <{alors} nous allons pique-niquer au parc La Fontaine>.' }
    ],
    non: [
      { p: 'a-cause-de', why: '« À cause de » présente une cause plutôt négative ; le beau temps est une bonne nouvelle, et il faudrait un nom.' },
      { p: 'meme-si', why: '« Même si » annonce un obstacle ; le beau temps rend le pique-nique possible.' }
    ],
    back: { p: 'parce-que', c: 'a', s: 'Nous allons pique-niquer au parc La Fontaine <{parce qu’}il fait très beau aujourd’hui>.',
      fn: 'Le résultat passe devant, et « parce que » s’accroche à la cause après la phrase principale.' }
  },
  {
    id: 'cause-29', rel: 'cause', th: 'voisinage',
    a: 'Je n’arrive pas à me concentrer en télétravail.', b: 'Mes voisins du dessus font des rénovations.',
    as: 'pas concentrée', bs: 'rénovations',
    ok: [
      { p: 'a-cause-de', c: 'b', s: 'Je n’arrive pas à me concentrer en télétravail <{à cause des} [rénovations de mes voisins du dessus]>.' },
      { p: 'parce-que', c: 'b', s: 'Je n’arrive pas à me concentrer en télétravail <{parce que} mes voisins du dessus font des rénovations>.' }
    ],
    non: [
      { p: 'grace-a', why: '« Grâce à » demande une cause positive ; le bruit des rénovations te dérange.' },
      { p: 'bien-que', why: '« Bien que » annonce un obstacle surmonté ; ici tu n’arrives justement pas à te concentrer.' }
    ],
    back: { p: 'alors', c: 'a', s: 'Mes voisins du dessus font des rénovations, <{alors} je n’arrive pas à me concentrer en télétravail>.',
      fn: 'Le pont passe au résultat : les rénovations viennent d’abord, avec leur verbe (« font »), puis « alors » + le problème.' }
  },
  {
    id: 'cause-30', rel: 'cause', th: 'garderie',
    a: 'La garderie est fermée jusqu’à lundi.', b: 'Plusieurs enfants ont attrapé la gastro.',
    as: 'garderie fermée', bs: 'gastro',
    ok: [
      { p: 'a-cause-de', c: 'b', s: 'La garderie est fermée jusqu’à lundi <{à cause d’}[une éclosion de gastro]>.' }
    ],
    non: [
      { p: 'a-force-de', why: '« À force de » + infinitif suppose un effort répété ; attraper la gastro n’est pas un effort.' },
      { p: 'quand-meme', why: 'Pas d’obstacle surmonté ici : la gastro explique la fermeture.' }
    ],
    back: { p: 'si-bien-que', c: 'a', s: 'Plusieurs enfants ont attrapé la gastro, <{si bien que} la garderie est fermée jusqu’à lundi>.',
      fn: 'Le pont passe au résultat : la cause redevient une phrase complète (« plusieurs enfants ont attrapé… ») et vient en premier.' }
  },
  {
    id: 'cause-31', rel: 'cause', th: 'hiver',
    a: 'Je ne gèle plus à l’arrêt d’autobus.', b: 'J’ai acheté un bon manteau d’hiver.',
    as: 'je ne gèle plus', bs: 'bon manteau',
    ok: [
      { p: 'grace-a', c: 'b', s: '<{Grâce à} [mon nouveau manteau d’hiver]>, je ne gèle plus à l’arrêt d’autobus.' }
    ],
    non: [
      { p: 'a-cause-de', why: '« À cause de » annonce une cause négative ; ton manteau te protège du froid, c’est positif.' },
      { p: 'malgre', why: '« Malgré » annonce un obstacle ; le manteau t’aide, il ne te gêne pas.' }
    ],
    back: { p: 'donc', c: 'a', s: 'J’ai acheté un bon manteau d’hiver, <{donc} je ne gèle plus à l’arrêt d’autobus>.',
      fn: 'Le pont passe au résultat : l’achat redevient une phrase avec un verbe (« j’ai acheté ») et vient en premier.' }
  },
  {
    id: 'cause-32', rel: 'cause', th: 'famille',
    a: 'La gardienne est malade ce soir.', b: 'On annule notre souper au restaurant.',
    as: 'gardienne malade', bs: 'souper annulé',
    ok: [
      { p: 'alors', c: 'b', s: 'La gardienne est malade ce soir, <{alors} on annule notre souper au restaurant>.' }
    ],
    non: [
      { p: 'grace-a', why: '« Grâce à » demande une cause positive ; la maladie de la gardienne gâche votre soirée.' },
      { p: 'bien-que', why: '« Bien que » annonce un obstacle surmonté ; ici le souper est bel et bien annulé.' }
    ],
    back: { p: 'parce-que', c: 'a', s: 'On annule notre souper au restaurant <{parce que} la gardienne est malade ce soir>.',
      fn: 'Le pont passe à la cause : l’annulation vient d’abord, puis « parce que » + la raison.' }
  },
  {
    id: 'cause-33', rel: 'cause', th: 'travail',
    a: 'J’ai fini ma période de probation.', b: 'J’ai maintenant droit aux assurances collectives.',
    as: 'probation finie', bs: 'assurances',
    ok: [
      { p: 'donc', c: 'b', s: 'J’ai fini ma période de probation, <{donc} j’ai maintenant droit aux assurances collectives>.' },
      { p: 'c-est-pour-ca-que', c: 'b', s: 'J’ai fini ma période de probation, <{c’est pour ça que} j’ai maintenant droit aux assurances collectives>.' }
    ],
    non: [
      { p: 'a-cause-de', why: '« À cause de » + nom présente une cause plutôt négative ; finir sa probation est une bonne nouvelle.' },
      { p: 'pourtant', why: '« Pourtant » annonce une surprise ; ici, le droit aux assurances est logique.' }
    ],
    back: { p: 'puisque', c: 'a', s: 'J’ai maintenant droit aux assurances collectives, <{puisque} j’ai fini ma période de probation>.',
      fn: '« Puisque » s’accroche à la cause, placée après : tu présentes la fin de ta probation comme un fait connu.' }
  },
  {
    id: 'cause-34', rel: 'cause', th: 'loisirs',
    a: 'Le spectacle de l’humoriste était très drôle.', b: 'J’ai ri aux larmes.',
    as: 'spectacle drôle', bs: 'ri aux larmes',
    ok: [
      { p: 'tellement-que', c: 'b', s: 'Le spectacle de l’humoriste était {tellement} drôle <{que} j’ai ri aux larmes>.' }
    ],
    non: [
      { p: 'trop-pour', why: '« Trop… pour » + infinitif annonce un résultat impossible ; or tu as bel et bien ri aux larmes.' },
      { p: 'faute-de', why: '« Faute de » signale un manque ; ici rien ne manque, le spectacle était réussi.' },
      { p: 'malgre', why: '« Malgré » annonce un obstacle ; un spectacle drôle n’empêche pas de rire.' }
    ],
    back: { p: 'parce-que', c: 'a', s: 'J’ai ri aux larmes <{parce que} le spectacle de l’humoriste était très drôle>.',
      fn: 'Le pont passe à la cause : le fou rire vient d’abord, et « tellement » redevient « très », car le « que » a disparu.' }
  }
]);
