/* Atelier de ponts — banque « Temps » (onglet 3).
   Format : voir outils/exemple-banque.js. Balisage : {connecteur} <cadre> [forme changée]. */
ATELIER.ajouter([
  {
    id: 'temps-01', rel: 'temps', th: 'maison',
    a: 'Je rentre à la maison.', b: 'J’enlève mes bottes dans l’entrée.',
    as: 'je rentre', bs: 'bottes enlevées',
    ok: [
      { p: 'quand', c: 'a', s: '<{Quand} je rentre à la maison>, j’enlève mes bottes dans l’entrée.' },
      { p: 'lorsque', c: 'a', s: '<{Lorsque} je rentre à la maison>, j’enlève mes bottes dans l’entrée.' }
    ],
    non: [
      { p: 'depuis-que', why: '« Depuis que » donne le point de départ d’une situation qui dure encore ; ici, ce sont deux gestes qui se suivent chaque soir.' },
      { p: 'jusqu-a-ce-que', why: '« Jusqu’à ce que » + subjonctif marque une limite de fin : « j’enlève mes bottes jusqu’à ce que je rentre » n’a pas de sens. Ici, une action suit l’autre.' },
      { p: 'si-present', why: '« Si » rendrait le retour incertain ; or je rentre tous les jours.' }
    ],
    back: { p: 'apres-inf', c: 'a', s: '<{Après} [être rentrée] à la maison>, j’enlève mes bottes dans l’entrée.', fn: '« Après » + infinitif passé insiste sur l’ordre : d’abord rentrer, ensuite enlever les bottes. Même sujet, donc pas de verbe conjugué.' }
  },
  {
    id: 'temps-02', rel: 'temps', th: 'garderie',
    a: 'Mon fils va rentrer de la garderie.', b: 'On va jouer dehors.',
    as: 'retour garderie', bs: 'on joue dehors',
    ok: [
      { p: 'quand', c: 'a', s: '<{Quand} mon fils [rentrera] de la garderie>, on [ira] jouer dehors.' },
      { p: 'des-que', c: 'a', s: '<{Dès que} mon fils [rentrera] de la garderie>, on [ira] jouer dehors.' }
    ],
    non: [
      { p: 'depuis-que', why: '« Depuis que » regarde une situation commencée dans le passé et qui dure encore ; ici, tout se passe dans l’avenir.' },
      { p: 'si-present', why: '« Si » ferait du retour une simple possibilité ; ici, il est sûr que mon fils rentre.' }
    ],
    back: { p: 'apres-que', c: 'a', s: 'On [ira] jouer dehors <{après que} mon fils [sera rentré] de la garderie>.', fn: '« Après que » garde l’indicatif ; pour l’avenir, on met le futur antérieur (sera rentré) : le retour sera fini avant le jeu.' }
  },
  {
    id: 'temps-03', rel: 'temps', th: 'travail',
    a: 'Je sortais du bureau.', b: 'Ma patronne m’a appelée.',
    as: 'je sortais', bs: 'patronne appelle',
    ok: [
      { p: 'au-moment-ou', c: 'a', s: '<{Au moment où} je sortais du bureau>, ma patronne m’a appelée.' },
      { p: 'quand', c: 'b', s: 'Je sortais du bureau <{quand} ma patronne m’a appelée>.' }
    ],
    non: [
      { p: 'depuis-que', why: '« Depuis que » donne le début d’une situation qui dure encore ; ici, l’appel est un événement fini, à un moment précis.' },
      { p: 'une-fois-que', why: '« Une fois que » demande une action terminée (je suis sortie) ; ici, j’étais encore en train de sortir quand le téléphone a sonné.' },
      { p: 'parce-que', why: '« Parce que » donnerait une raison ; ici, on dit seulement à quel moment l’appel arrive.' }
    ],
    back: { p: 'avant-que', c: 'a', s: 'Ma patronne m’a appelée juste <{avant que} je [sorte] du bureau>.', fn: '« Avant que » décale l’appel un peu plus tôt : je n’étais pas encore sortie. Subjonctif (sorte), car les sujets sont différents.' }
  },
  {
    id: 'temps-04', rel: 'temps', th: 'transport',
    a: 'J’attends l’autobus.', b: 'J’écoute un balado.',
    as: 'j’attends le bus', bs: 'j’écoute un balado',
    ok: [
      { p: 'gerondif', c: 'a', s: 'J’écoute un balado <{en} [attendant] l’autobus>.' }
    ],
    non: [
      { p: 'avant-de', why: '« Avant de » + infinitif place une action avant l’autre ; ici, j’écoute le balado pendant l’attente, pas avant.' },
      { p: 'jusqu-a-ce-que', why: '« Jusqu’à ce que » + subjonctif fixe une limite de fin ; ici, les deux actions se font en même temps, sans limite.' },
      { p: 'au-lieu-de', why: '« Au lieu de » dirait qu’une action remplace l’autre ; ici, je fais les deux.' }
    ],
    back: { p: 'pendant-que', c: 'a', s: 'J’écoute un balado <{pendant que} j’attends l’autobus>.', fn: '« Pendant que » garde un verbe conjugué et répète le sujet ; il marche aussi quand les sujets sont différents, contrairement au gérondif.' }
  },
  {
    id: 'temps-05', rel: 'temps', th: 'famille',
    a: 'Je prépare le souper.', b: 'Mon mari donne le bain aux enfants.',
    as: 'je fais le souper', bs: 'bain des enfants',
    ok: [
      { p: 'pendant-que', c: 'b', s: 'Je prépare le souper <{pendant que} mon mari donne le bain aux enfants>.' }
    ],
    non: [
      { p: 'gerondif', why: 'Le gérondif (en + participe présent) exige le même sujet ; ici, c’est moi qui cuisine et mon mari qui donne le bain.' },
      { p: 'une-fois-que', why: '« Une fois que » place une action après la fin de l’autre ; ici, les deux se passent en même temps.' },
      { p: 'parce-que', why: '« Parce que » donnerait une raison ; le bain n’explique pas le souper.' }
    ],
    back: { p: 'apres-que', c: 'b', s: 'Je prépare le souper <{après que} mon mari [a donné] le bain aux enfants>.', fn: '« Après que » + indicatif : les deux actions ne sont plus en même temps ; le bain est fini avant le souper.' }
  },
  {
    id: 'temps-06', rel: 'temps', th: 'famille',
    a: 'Ma sœur est arrivée à Montréal.', b: 'On se voit tous les dimanches.',
    as: 'arrivée de ma sœur', bs: 'tous les dimanches',
    ok: [
      { p: 'depuis-que', c: 'a', s: '<{Depuis que} ma sœur est arrivée à Montréal>, on se voit tous les dimanches.' }
    ],
    non: [
      { p: 'quand', why: '« Quand » + passé composé désigne un moment fini ; il ne peut pas lancer une habitude qui dure encore au présent.' },
      { p: 'jusqu-a-ce-que', why: '« Jusqu’à ce que » marque la fin d’une situation ; ici, l’arrivée de ma sœur est le début des dimanches ensemble.' },
      { p: 'puisque', why: '« Puisque » donnerait une raison évidente ; ici, on dit à partir de quand.' }
    ],
    back: { p: 'avant-que', c: 'a', s: '<{Avant que} ma sœur [arrive] à Montréal>, on [ne se voyait jamais] le dimanche.', fn: 'On regarde la période d’avant : « avant que » + subjonctif (arrive), et l’imparfait pour l’ancienne situation.' }
  },
  {
    id: 'temps-07', rel: 'temps', th: 'météo',
    a: 'J’habite au Québec.', b: 'J’ai vu trois tempêtes de verglas.',
    as: 'au Québec', bs: 'trois tempêtes',
    ok: [
      { p: 'depuis-que', c: 'a', s: '<{Depuis que} j’habite au Québec>, j’ai vu trois tempêtes de verglas.' }
    ],
    non: [
      { p: 'tant-que', why: '« Tant que » veut dire « aussi longtemps que » et regarde vers la fin ; ici, on compte à partir d’un point de départ jusqu’à aujourd’hui.' },
      { p: 'au-moment-ou', why: '« Au moment où » désigne un seul point précis ; trois tempêtes ne tiennent pas dans un seul moment.' },
      { p: 'comme', why: '« Comme » présenterait une cause ; ici, on ne cherche pas pourquoi, mais depuis quand.' }
    ],
    back: { p: 'avant-de', c: 'a', s: '<{Avant d’}[habiter] au Québec>, je [n’avais jamais vu] de verglas.', fn: 'On regarde la période d’avant. Même sujet → « avant de » + infinitif ; le plus-que-parfait raconte l’ancienne situation.' }
  },
  {
    id: 'temps-08', rel: 'temps', th: 'épicerie',
    a: 'Je fais l’épicerie.', b: 'Je regarde les spéciaux dans la circulaire.',
    as: 'l’épicerie', bs: 'les spéciaux',
    ok: [
      { p: 'avant-de', c: 'a', s: '<{Avant de} [faire] l’épicerie>, je regarde les spéciaux dans la circulaire.' }
    ],
    non: [
      { p: 'avant-que', why: '« Avant que » + subjonctif sert quand les sujets sont différents ; ici, c’est moi qui fais les deux actions : « avant de » + infinitif.' },
      { p: 'des-que', why: '« Dès que » mettrait la lecture de la circulaire juste après l’épicerie ; or on la lit pour préparer ses achats.' }
    ],
    back: { p: 'apres-inf', c: 'b', s: '<{Après} [avoir regardé] les spéciaux dans la circulaire>, je fais l’épicerie.', fn: 'Le pont passe de l’autre côté : « après » s’accroche à la première action, à l’infinitif passé (avoir + participe).' }
  },
  {
    id: 'temps-09', rel: 'temps', th: 'travail',
    a: 'Mon collègue part en vacances.', b: 'Je lui pose mes questions.',
    as: 'départ en vacances', bs: 'mes questions',
    ok: [
      { p: 'avant-que', c: 'a', s: 'Je pose mes questions [à mon collègue] <{avant qu’}[il] [parte] en vacances>.' }
    ],
    non: [
      { p: 'avant-de', why: '« Avant de » + infinitif exige le même sujet ; ici, c’est mon collègue qui part et moi qui pose les questions.' },
      { p: 'depuis-que', why: '« Depuis que » regarde une situation déjà commencée et qui dure ; ici, le départ n’a pas encore eu lieu.' },
      { p: 'pour-que', why: '« Pour que » exprime un but ; ici, la question est « quand ? ».' }
    ],
    back: { p: 'apres-que', c: 'b', s: 'Mon collègue part en vacances <{après que} je lui [ai posé] mes questions>.', fn: '« Après que » s’accroche maintenant à mes questions et garde l’indicatif (ai posé), contrairement à « avant que ».' }
  },
  {
    id: 'temps-10', rel: 'temps', th: 'logement',
    a: 'Le propriétaire fait visiter l’appartement.', b: 'Je fais le ménage.',
    as: 'la visite', bs: 'le ménage',
    ok: [
      { p: 'avant-que', c: 'a', s: 'Je fais le ménage <{avant que} le propriétaire [fasse] visiter l’appartement>.' }
    ],
    non: [
      { p: 'avant-de', why: '« Avant de » ne marche qu’avec le même sujet ; ici, le propriétaire fait visiter et moi, je fais le ménage.' },
      { p: 'des-que', why: '« Dès que » placerait le ménage juste après la visite ; or l’appartement doit être propre pour la visite.' },
      { p: 'meme-si', why: '« Même si » présente un obstacle ; ici, rien ne s’oppose, on parle seulement de l’ordre.' }
    ],
    back: { p: 'une-fois-que', c: 'b', s: '<{Une fois que} j’[ai fait] le ménage>, le propriétaire fait visiter l’appartement.', fn: 'On part de l’autre action : « une fois que » + passé composé dit que le ménage est terminé avant la visite. Indicatif, pas de subjonctif.' }
  },
  {
    id: 'temps-11', rel: 'temps', th: 'hiver',
    a: 'Je déneige la voiture.', b: 'Je pars au travail.',
    as: 'je déneige', bs: 'je pars',
    ok: [
      { p: 'avant-de', c: 'b', s: 'Je déneige la voiture <{avant de} [partir] au travail>.' },
      { p: 'apres-inf', c: 'a', s: '<{Après} [avoir déneigé] la voiture>, je pars au travail.' }
    ],
    non: [
      { p: 'pendant-que', why: '« Pendant que » met les deux actions en même temps ; je ne peux pas déneiger la voiture et rouler vers le travail au même moment.' },
      { p: 'avant-que', why: '« Avant que » + subjonctif demande deux sujets différents ; ici, c’est moi qui déneige et moi qui pars.' }
    ],
    back: { p: 'des-que', c: 'a', s: '<{Dès que} [la voiture est déneigée]>, je pars au travail.', fn: '« Dès que » + indicatif insiste sur la rapidité : je pars tout de suite. La voiture devient le sujet (forme passive).' }
  },
  {
    id: 'temps-12', rel: 'temps', th: 'études',
    a: 'Je remets mon travail de session.', b: 'J’irai prendre un verre avec ma classe.',
    as: 'travail remis', bs: 'un verre',
    ok: [
      { p: 'une-fois-que', c: 'a', s: '<{Une fois que} j’[aurai remis] mon travail de session>, j’irai prendre un verre avec ma classe.' },
      { p: 'apres-inf', c: 'a', s: '<{Après} [avoir remis] mon travail de session>, j’irai prendre un verre avec ma classe.' }
    ],
    non: [
      { p: 'avant-que', why: '« Avant que » + subjonctif exige deux sujets différents ; ici, « je » fait les deux actions, et l’ordre serait inversé.' },
      { p: 'tant-que', why: '« Tant que » veut dire « aussi longtemps que » : les deux actions dureraient ensemble. Ici, l’une commence quand l’autre est finie.' }
    ],
    back: { p: 'avant-de', c: 'b', s: 'Je [remettrai] mon travail de session <{avant d’}[aller] prendre un verre avec ma classe>.', fn: 'On part de l’autre action : « avant de » + infinitif présent, même sujet. Le futur passe dans la phrase principale.' }
  },
  {
    id: 'temps-13', rel: 'temps', th: 'déneigement',
    a: 'La déneigeuse est passée.', b: 'Je sors la voiture.',
    as: 'la déneigeuse', bs: 'je sors la voiture',
    ok: [
      { p: 'apres-que', c: 'a', s: 'Je sors la voiture <{après que} la déneigeuse est passée>.' }
    ],
    non: [
      { p: 'apres-inf', why: '« Après » + infinitif passé exige le même sujet ; ici, c’est la déneigeuse qui passe et moi qui sors la voiture.' },
      { p: 'pendant-que', why: '« Pendant que » mettrait les deux actions en même temps ; or la déneigeuse est déjà passée quand je sors la voiture.' },
      { p: 'a-cause-de', why: '« À cause de » + nom donnerait une cause ; ici, on dit seulement dans quel ordre.' }
    ],
    back: { p: 'avant-que', c: 'b', s: 'La déneigeuse [passe] <{avant que} je [sorte] la voiture>.', fn: '« Avant que » s’accroche maintenant à ma voiture et demande le subjonctif (sorte), alors qu’« après que » garde l’indicatif.' }
  },
  {
    id: 'temps-14', rel: 'temps', th: 'voyage',
    a: 'Mon vol va atterrir à Montréal.', b: 'Je vais t’écrire.',
    as: 'atterrissage', bs: 'je t’écris',
    ok: [
      { p: 'des-que', c: 'a', s: '<{Dès que} mon vol [atterrira] à Montréal>, je t’[écrirai].' }
    ],
    non: [
      { p: 'jusqu-a-ce-que', why: '« Jusqu’à ce que » + subjonctif marque la fin d’une action qui dure ; ici, le message commence au moment de l’atterrissage.' },
      { p: 'pendant-que', why: '« Pendant que » demande deux actions qui durent en même temps ; l’atterrissage est un moment précis, et le message vient juste après.' },
      { p: 'si-present', why: '« Si » rendrait l’atterrissage incertain ; ici, on sait qu’il va avoir lieu.' }
    ],
    back: { p: 'avant-que', c: 'a', s: 'Je [ne t’écrirai pas] <{avant que} mon vol [ait atterri] à Montréal>.', fn: 'Même idée, par la négative : pas de message avant l’atterrissage. « Avant que » + subjonctif passé (ait atterri).' }
  },
  {
    id: 'temps-15', rel: 'temps', th: 'hiver',
    a: 'Il arrête de neiger.', b: 'On sort les pelles.',
    as: 'fin de la neige', bs: 'les pelles',
    ok: [
      { p: 'des-que', c: 'a', s: '<{Dès qu’}il arrête de neiger>, on sort les pelles.' }
    ],
    non: [
      { p: 'jusqu-a-ce-que', why: '« Jusqu’à ce que » + subjonctif marquerait la fin du pelletage ; or l’arrêt de la neige est le début du travail, pas sa fin.' },
      { p: 'si-imparfait', why: '« Si » + imparfait imaginerait une situation irréelle ; ici, c’est une habitude réelle de chaque hiver.' }
    ],
    back: { p: 'tant-que', c: 'a', s: '<{Tant qu’}il [neige]>, on [ne sort pas] les pelles.', fn: 'On regarde l’autre côté : « tant que » + indicatif, aussi longtemps qu’il neige ; la phrase principale devient négative.' }
  },
  {
    id: 'temps-16', rel: 'temps', th: 'famille',
    a: 'Mon fils s’endort.', b: 'Je reste à côté de lui.',
    as: 'il s’endort', bs: 'je reste là',
    ok: [
      { p: 'jusqu-a-ce-que', c: 'a', s: 'Je reste à côté de [mon fils] <{jusqu’à ce qu’}[il] [s’endorme]>.' },
      { p: 'en-attendant-que', c: 'a', s: 'Je reste à côté de [mon fils] <{en attendant qu’}[il] [s’endorme]>.' }
    ],
    non: [
      { p: 'apres-que', why: '« Après que » + indicatif placerait ma présence après son sommeil ; or je reste près de lui pendant qu’il s’endort.' },
      { p: 'tant-que', why: '« Tant que » veut dire « aussi longtemps que » : il faudrait dire « tant qu’il ne dort pas ». Pour marquer la limite, on dit « jusqu’à ce que ».' }
    ],
    back: { p: 'des-que', c: 'a', s: '<{Dès que} mon fils [s’est endormi]>, je [sors] de la chambre.', fn: '« Dès que » regarde l’après : quand il dort, l’attente est finie et je sors. Indicatif (passé composé), pas de subjonctif.' }
  },
  {
    id: 'temps-17', rel: 'temps', th: 'transport',
    a: 'Le métro repart.', b: 'On attend dans le wagon.',
    as: 'le métro repart', bs: 'on attend',
    ok: [
      { p: 'jusqu-a-ce-que', c: 'a', s: 'On attend dans le wagon <{jusqu’à ce que} le métro [reparte]>.' }
    ],
    non: [
      { p: 'des-que', why: '« Dès que » ferait commencer l’attente au moment où le métro repart : c’est le contraire.' },
      { p: 'depuis-que', why: '« Depuis que » + indicatif donne le début d’une situation ; ici, le départ du métro est la fin de l’attente, pas son début.' }
    ],
    back: { p: 'tant-que', c: 'a', s: '<{Tant que} le métro [ne repart pas]>, on attend dans le wagon.', fn: '« Tant que » + indicatif, avec une négation : aussi longtemps que le métro reste arrêté, on attend.' }
  },
  {
    id: 'temps-18', rel: 'temps', th: 'voisinage',
    a: 'Ma voisine habitait dans l’immeuble.', b: 'Elle gardait mes enfants le mercredi.',
    as: 'elle habitait ici', bs: 'garde le mercredi',
    ok: [
      { p: 'tant-que', c: 'a', s: '<{Tant que} ma voisine habitait dans l’immeuble>, elle gardait mes enfants le mercredi.' }
    ],
    non: [
      { p: 'depuis-que', why: '« Depuis que » regarde une situation qui dure encore, avec le présent ; ici, les deux situations sont finies (imparfait).' },
      { p: 'apres-que', why: '« Après que » placerait la garde après la période où elle habitait l’immeuble ; or les deux ont lieu en même temps.' },
      { p: 'si-imparfait', why: '« Si » + imparfait imaginerait une situation ; ici, ma voisine habitait vraiment dans l’immeuble.' }
    ],
    back: { p: 'jusqu-a-ce-que', c: 'a', s: '[Ma voisine] gardait mes enfants le mercredi <{jusqu’à ce qu’}[elle] [déménage]>.', fn: '« Jusqu’à ce que » regarde la fin : le déménagement arrête la garde. Subjonctif (déménage), sans « ne ».' }
  },
  {
    id: 'temps-19', rel: 'temps', th: 'santé',
    a: 'Je vais à la clinique.', b: 'J’attends au moins deux heures.',
    as: 'à la clinique', bs: 'deux heures',
    ok: [
      { p: 'chaque-fois-que', c: 'a', s: '<{Chaque fois que} je vais à la clinique>, j’attends au moins deux heures.' }
    ],
    non: [
      { p: 'depuis-que', why: '« Depuis que » donne le point de départ d’une situation qui dure ; ici, la même chose se répète à chaque visite.' },
      { p: 'une-fois-que', why: '« Une fois que » dit que la première action est finie avant la deuxième ; or j’attends à la clinique, pas après.' },
      { p: 'meme-si', why: '« Même si » présenterait la visite comme un obstacle ; ici, il n’y a pas d’opposition.' }
    ],
    back: { p: 'quand', c: 'a', s: '<{Quand} je vais à la clinique>, j’attends au moins deux heures.', fn: '« Quand » dit presque la même chose, mais n’insiste plus sur la répétition : c’est le pont « sœur », plus neutre.' }
  },
  {
    id: 'temps-20', rel: 'temps', th: 'épicerie',
    a: 'La caissière passe les articles.', b: 'Je remplis mes sacs.',
    as: 'la caisse', bs: 'mes sacs',
    ok: [
      { p: 'au-fur-et-a-mesure', c: 'a', s: 'Je remplis mes sacs <{au fur et à mesure que} la caissière passe les articles>.' },
      { p: 'pendant-que', c: 'a', s: 'Je remplis mes sacs <{pendant que} la caissière passe les articles>.' }
    ],
    non: [
      { p: 'gerondif', why: 'Le gérondif exige le même sujet ; ici, la caissière passe les articles et c’est moi qui remplis les sacs.' },
      { p: 'avant-que', why: '« Avant que » + subjonctif placerait mes sacs avant le passage des articles : impossible, ils ne sont pas encore passés à la caisse.' }
    ],
    back: { p: 'une-fois-que', c: 'a', s: '<{Une fois que} la caissière [a passé] tous les articles>, je remplis mes sacs.', fn: '« Une fois que » attend la fin : on ne fait plus les deux en même temps, mais l’un après l’autre (passé composé).' }
  },
  {
    id: 'temps-21', rel: 'temps', th: 'famille',
    a: 'Je parle avec ma mère au téléphone.', b: 'Je plie le linge.',
    as: 'appel à ma mère', bs: 'je plie le linge',
    ok: [
      { p: 'gerondif', c: 'a', s: 'Je plie le linge <{en} [parlant] avec ma mère au téléphone>.' },
      { p: 'pendant-que', c: 'a', s: 'Je plie le linge <{pendant que} je parle avec ma mère au téléphone>.' }
    ],
    non: [
      { p: 'des-que', why: '« Dès que » + indicatif placerait le pliage juste après l’appel ; ici, les deux actions se font en même temps.' },
      { p: 'une-fois-que', why: '« Une fois que » attend la fin d’une action pour commencer l’autre ; ici, je fais les deux à la fois.' }
    ],
    back: { p: 'apres-inf', c: 'a', s: '<{Après} [avoir parlé] avec ma mère au téléphone>, je plie le linge.', fn: '« Après » + infinitif passé sépare les deux actions : d’abord l’appel, puis le linge. On perd l’idée de « en même temps ».' }
  },
  {
    id: 'temps-22', rel: 'temps', th: 'logement',
    a: 'Nous avons signé le bail.', b: 'Il neigeait à gros flocons.',
    as: 'bail signé', bs: 'il neigeait',
    ok: [
      { p: 'lorsque', c: 'a', s: '<{Lorsque} nous avons signé le bail>, il neigeait à gros flocons.' },
      { p: 'au-moment-ou', c: 'a', s: '<{Au moment où} nous avons signé le bail>, il neigeait à gros flocons.' }
    ],
    non: [
      { p: 'depuis-que', why: '« Depuis que » demande une situation qui dure encore aujourd’hui ; ici, la neige tombait à ce moment-là, et c’est fini.' },
      { p: 'avant-de', why: '« Avant de » + infinitif exige le même sujet ; ici, « nous » signons et « il » neige.' },
      { p: 'comme', why: '« Comme » + indicatif présenterait une cause ; la neige et la signature ne s’expliquent pas l’une l’autre.' }
    ],
    back: { p: 'avant-que', c: 'a', s: 'Il [a commencé] à neiger <{avant que} nous [signions] le bail>.', fn: '« Avant que » + subjonctif (signions) : la neige a commencé avant la signature ; on ne dit plus que les deux étaient en même temps.' }
  },
  {
    id: 'temps-23', rel: 'temps', th: 'loisirs',
    a: 'J’entre sur la glace.', b: 'Je lace bien mes patins.',
    as: 'sur la glace', bs: 'mes patins',
    ok: [
      { p: 'avant-de', c: 'a', s: '<{Avant d’}[entrer] sur la glace>, je lace bien mes patins.' }
    ],
    non: [
      { p: 'avant-que', why: '« Avant que » + subjonctif s’emploie avec deux sujets différents ; ici, c’est moi qui lace et moi qui entre : « avant d’entrer ».' },
      { p: 'en-attendant-que', why: '« En attendant que » + subjonctif attend l’action d’une autre personne ; avec le même sujet, on dirait « en attendant d’entrer ».' }
    ],
    back: { p: 'apres-inf', c: 'b', s: '<{Après} [avoir bien lacé] mes patins>, j’entre sur la glace.', fn: '« Après » s’accroche maintenant aux patins, avec l’infinitif passé (avoir + participe) : même sujet, même ordre des actions.' }
  },
  {
    id: 'temps-24', rel: 'temps', th: 'déménagement',
    a: 'Le camion de déménagement va être là.', b: 'Je vide les armoires de la cuisine.',
    as: 'le camion', bs: 'les armoires',
    ok: [
      { p: 'avant-que', c: 'a', s: 'Je vide les armoires de la cuisine <{avant que} le camion de déménagement [soit] là>.' }
    ],
    non: [
      { p: 'avant-de', why: '« Avant de » + infinitif n’est possible qu’avec un seul sujet ; ici, le camion arrive et moi, je vide les armoires.' },
      { p: 'au-moment-ou', why: '« Au moment où » désigne un point précis ; vider des armoires prend du temps et doit être fini avant l’arrivée du camion.' }
    ],
    back: { p: 'apres-que', c: 'b', s: 'Le camion de déménagement [arrive] <{après que} j’[ai vidé] les armoires de la cuisine>.', fn: '« Après que » garde l’indicatif (ai vidé) : on raconte l’ordre à partir du camion, et l’action finie est au passé composé.' }
  },
  {
    id: 'temps-25', rel: 'temps', th: 'travail',
    a: 'J’ai fini mon quart de travail.', b: 'Je suis allée chercher les enfants à la garderie.',
    as: 'fin du quart', bs: 'à la garderie',
    ok: [
      { p: 'apres-inf', c: 'a', s: '<{Après} [avoir fini] mon quart de travail>, je suis allée chercher les enfants à la garderie.' }
    ],
    non: [
      { p: 'pendant-que', why: '« Pendant que » met deux actions en même temps ; je ne peux pas finir mon quart au travail et être à la garderie au même moment.' },
      { p: 'depuis-que', why: '« Depuis que » demande une situation qui dure encore ; ici, deux actions finies se suivent, une seule fois.' }
    ],
    back: { p: 'des-que', c: 'a', s: '<{Dès que} j’ai fini mon quart de travail>, je suis allée chercher les enfants à la garderie.', fn: '« Dès que » + indicatif garde le verbe conjugué (ai fini) et insiste sur la rapidité : tout de suite après.' }
  },
  {
    id: 'temps-26', rel: 'temps', th: 'famille',
    a: 'Ma fille est née.', b: 'On habitait à Laval.',
    as: 'naissance', bs: 'à Laval',
    ok: [
      { p: 'quand', c: 'a', s: '<{Quand} ma fille est née>, on habitait à Laval.' }
    ],
    non: [
      { p: 'depuis-que', why: '« Depuis que » demande une situation qui dure encore, au présent ; ici, l’imparfait décrit le décor d’un moment passé.' },
      { p: 'une-fois-que', why: '« Une fois que » demande que la première action soit finie avant le début de l’autre ; or on habitait déjà à Laval avant la naissance.' },
      { p: 'parce-que', why: '« Parce que » donnerait une raison ; la naissance n’explique pas où on habitait.' }
    ],
    back: { p: 'au-moment-ou', c: 'a', s: '<{Au moment où} ma fille est née>, on habitait à Laval.', fn: '« Au moment où » est le pont « sœur » de « quand » : il insiste sur le point précis, ici la naissance.' }
  },
  {
    id: 'temps-27', rel: 'temps', th: 'logement',
    a: 'Je suis arrivée à Montréal.', b: 'J’ai déménagé trois fois.',
    as: 'arrivée à Montréal', bs: 'trois fois',
    ok: [
      { p: 'depuis-que', c: 'a', s: '<{Depuis que} je suis arrivée à Montréal>, j’ai déménagé trois fois.' }
    ],
    non: [
      { p: 'tant-que', why: '« Tant que » veut dire « aussi longtemps que » ; il faudrait une situation qui dure, pas une arrivée qui se fait en un moment.' },
      { p: 'au-moment-ou', why: '« Au moment où » désigne un seul point précis ; trois déménagements ne peuvent pas avoir lieu au moment de l’arrivée.' }
    ],
    back: { p: 'apres-inf', c: 'a', s: '<{Après} [être arrivée] à Montréal>, j’ai déménagé trois fois.', fn: '« Après » + infinitif passé situe les déménagements après l’arrivée, mais ne dit plus que la période dure encore aujourd’hui.' }
  },
  {
    id: 'temps-28', rel: 'temps', th: 'démarches',
    a: 'Mon permis de travail va être renouvelé.', b: 'Je garde ma lettre de confirmation sur moi.',
    as: 'permis renouvelé', bs: 'la lettre',
    ok: [
      { p: 'jusqu-a-ce-que', c: 'a', s: 'Je garde ma lettre de confirmation sur moi <{jusqu’à ce que} mon permis de travail [soit] renouvelé>.' },
      { p: 'en-attendant-que', c: 'a', s: 'Je garde ma lettre de confirmation sur moi <{en attendant que} mon permis de travail [soit] renouvelé>.' }
    ],
    non: [
      { p: 'des-que', why: '« Dès que » + indicatif ferait commencer la garde de la lettre au renouvellement ; c’est l’inverse : je la garde jusque-là.' },
      { p: 'apres-que', why: '« Après que » placerait la lettre après le renouvellement ; or elle sert de preuve pendant l’attente.' }
    ],
    back: { p: 'une-fois-que', c: 'a', s: '<{Une fois que} mon permis de travail [sera] renouvelé>, je [n’aurai plus besoin] de la lettre.', fn: '« Une fois que » regarde l’après : la fin de l’attente. Indicatif futur (sera), pas de subjonctif.' }
  }
]);
