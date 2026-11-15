/* Atelier de ponts — banque « Condition et hypothèse » (si + présent, si + imparfait,
   si + plus-que-parfait, si jamais, au cas où, à condition que / de, pourvu que, à moins que,
   sauf si, en cas de, mettons que). Format : voir outils/exemple-banque.js. */
ATELIER.ajouter([
  {
    id: 'condition-01', rel: 'condition', th: 'loisirs',
    a: 'Il va peut-être faire beau samedi.', b: 'On va glisser au parc Jarry.',
    as: 'beau samedi ?', bs: 'on va glisser',
    ok: [
      { p: 'si-present', c: 'a', s: '<{S’}il [fait] beau samedi>, on va glisser au parc Jarry.' }
    ],
    non: [
      { p: 'si-imparfait', why: '« Si » + imparfait sert pour une situation imaginée, peu probable ; ici, le beau temps samedi est une possibilité réelle.' },
      { p: 'au-cas-ou', why: '« Au cas où » prépare une précaution contre un problème (« on apporte des tuques au cas où il ferait froid ») ; le beau temps n’est pas un problème.' },
      { p: 'quand', why: '« Quand » présente le beau temps comme sûr ; ici, on n’en est pas certain.' }
    ],
    back: { p: 'sauf-si', c: 'a', s: 'On va glisser au parc Jarry, <{sauf s’}il [fait mauvais] samedi>.', fn: 'Avec « sauf si », on part du projet (glisser) et on ne garde que l’exception : le mauvais temps. L’indicatif reste, comme après « si ».' }
  },
  {
    id: 'condition-02', rel: 'condition', th: 'démarches administratives',
    a: 'Ma demande de permis de travail sera peut-être acceptée.', b: 'Je commence à l’hôpital en janvier.',
    as: 'permis accepté ?', bs: 'je commence',
    ok: [
      { p: 'si-present', c: 'a', s: '<{Si} ma demande de permis de travail [est] acceptée>, je [commencerai] à l’hôpital en janvier.' }
    ],
    non: [
      { p: 'si-pqp', why: '« Si » + plus-que-parfait parle d’une condition passée qui ne s’est pas réalisée ; ici, la réponse n’est pas encore arrivée.' },
      { p: 'a-moins-que', why: '« À moins que » présente une exception qui annule tout : « à moins que ma demande soit acceptée » dirait le contraire.' },
      { p: 'des-que', why: '« Dès que » présente l’acceptation comme sûre ; ici, elle est seulement possible.' }
    ],
    back: { p: 'si-imparfait', c: 'a', s: '<{Si} ma demande de permis de travail [était] acceptée>, je [commencerais] à l’hôpital en janvier.', fn: 'Avec « si » + imparfait, la même idée devient moins sûre, presque un rêve : le résultat passe au conditionnel (commencerais).' }
  },
  {
    id: 'condition-03', rel: 'condition', th: 'santé',
    a: 'La fièvre de Sofia monte encore.', b: 'Tu m’appelles au travail.',
    as: 'la fièvre monte', bs: 'appelle-moi',
    ok: [
      { p: 'si-present', c: 'a', s: '<{Si} la fièvre de Sofia monte encore>, [appelle-moi] au travail.' }
    ],
    non: [
      { p: 'pourvu-que', why: '« Pourvu que » sert aussi à exprimer un souhait : « pourvu que la fièvre monte » donnerait l’impression qu’on souhaite la fièvre !' },
      { p: 'si-pqp', why: '« Si » + plus-que-parfait parle d’une occasion passée qui n’a pas eu lieu ; ici, c’est une consigne pour les prochaines heures.' },
      { p: 'jusqu-a-ce-que', why: '« Jusqu’à ce que » fixe une limite dans le temps ; ici, l’appel dépend de la fièvre.' }
    ],
    back: { p: 'sauf-si', c: 'a', s: '[Ne m’appelle pas] au travail, <{sauf si} la fièvre de Sofia monte encore>.', fn: 'Avec « sauf si », on part de la consigne inverse (ne m’appelle pas) : la fièvre devient la seule exception. Le verbe reste à l’indicatif.' }
  },
  {
    id: 'condition-04', rel: 'condition', th: 'logement',
    a: 'Le chauffage n’est pas réparé d’ici vendredi.', b: 'Je porte plainte au Tribunal administratif du logement.',
    as: 'pas réparé', bs: 'plainte au TAL',
    ok: [
      { p: 'si-present', c: 'a', s: '<{Si} le chauffage n’est pas réparé d’ici vendredi>, je [porterai] plainte au Tribunal administratif du logement.' }
    ],
    non: [
      { p: 'sauf-si', why: '« Sauf si » présente une exception : « je porterai plainte, sauf si le chauffage n’est pas réparé » dit le contraire de l’idée.' },
      { p: 'a-condition-de', why: '« À condition de » + infinitif demande le même sujet ; ici, le sujet change (le chauffage / je).' },
      { p: 'meme-si', why: '« Même si » présente un obstacle qui n’empêche rien ; ici, la panne non réparée déclenche la plainte.' }
    ],
    back: { p: 'a-moins-que', c: 'a', s: 'Je [porterai] plainte au Tribunal administratif du logement, <{à moins que} le chauffage [soit] réparé d’ici vendredi>.', fn: 'Avec « à moins que », la négation disparaît : la réparation devient l’exception qui annule la plainte, et le verbe passe au subjonctif (soit).' }
  },
  {
    id: 'condition-05', rel: 'condition', th: 'démarches administratives',
    a: 'Je suis ministre de l’Immigration.', b: 'Je simplifie tous les formulaires.',
    as: 'ministre', bs: 'formulaires',
    ok: [
      { p: 'si-imparfait', c: 'a', s: '<{Si} j’[étais] ministre de l’Immigration>, je [simplifierais] tous les formulaires.' }
    ],
    non: [
      { p: 'si-present', why: '« Si » + présent sert pour une possibilité réelle ; être ministre est une situation imaginée : imparfait, puis conditionnel.' },
      { p: 'en-cas-de', why: '« En cas de » + nom sert pour un cas pratique (« en cas de panne ») ; ici, on imagine une autre vie.' },
      { p: 'quand', why: '« Quand » présenterait la chose comme sûre ; ici, c’est un rêve.' }
    ],
    back: { p: 'si-pqp', c: 'a', s: '<{Si} j’[avais été] ministre de l’Immigration>, j’[aurais simplifié] tous les formulaires.', fn: 'Avec le plus-que-parfait, on imagine le passé : la situation n’a jamais eu lieu, et le résultat passe au conditionnel passé (aurais simplifié).' }
  },
  {
    id: 'condition-06', rel: 'condition', th: 'transport',
    a: 'Je n’ai pas de voiture.', b: 'J’irais voir ma sœur à Sherbrooke plus souvent.',
    as: 'pas de voiture', bs: 'voir ma sœur',
    ok: [
      { p: 'si-imparfait', c: 'a', s: '<{Si} j’[avais une] voiture>, j’irais voir ma sœur à Sherbrooke plus souvent.' }
    ],
    non: [
      { p: 'si-pqp', why: '« Si » + plus-que-parfait parlerait du passé (« si j’avais eu une voiture, j’aurais… ») ; ici, on parle d’aujourd’hui, et B est au conditionnel présent.' },
      { p: 'au-cas-ou', why: '« Au cas où » prépare une précaution ; ici, on imagine une autre situation, on ne se protège d’aucun risque.' },
      { p: 'meme-si', why: '« Même si » présente un obstacle qui n’empêche rien ; ici, le manque de voiture empêche justement les visites.' }
    ],
    back: { p: 'si-present', c: 'a', s: '<{Si} j’[achète une] voiture>, j’[irai] voir ma sœur à Sherbrooke plus souvent.', fn: 'Avec « si » + présent, la voiture devient un projet réel : on passe du rêve (imparfait → conditionnel) au possible (présent → futur).' }
  },
  {
    id: 'condition-07', rel: 'condition', th: 'logement',
    a: 'Je gagne le gros lot.', b: 'J’achète un duplex pour toute la famille.',
    as: 'le gros lot', bs: 'un duplex',
    ok: [
      { p: 'si-imparfait', c: 'a', s: '<{Si} je [gagnais] le gros lot>, j’[achèterais] un duplex pour toute la famille.' }
    ],
    non: [
      { p: 'si-pqp', why: '« Si » + plus-que-parfait parle d’une chance passée (« si j’avais gagné ») ; ici, on rêve à aujourd’hui ou à demain.' },
      { p: 'pourvu-que', why: '« Pourvu que » pose une condition suffisante ou un souhait ; pour imaginer ce qu’on ferait, on utilise « si » + imparfait → conditionnel.' },
      { p: 'quand', why: '« Quand » présenterait le gros lot comme une chose sûre.' }
    ],
    back: { p: 'si-present', c: 'a', s: '<{Si} je gagne le gros lot>, j’[achèterai] un duplex pour toute la famille.', fn: 'Avec « si » + présent, on parle comme si c’était vraiment possible (on a un billet !) : le résultat passe au futur. L’imparfait, lui, marque le rêve.' }
  },
  {
    id: 'condition-08', rel: 'condition', th: 'hiver',
    a: 'Je n’ai pas vu les panneaux de déneigement.', b: 'J’aurais déplacé ma voiture.',
    as: 'les panneaux', bs: 'auto déplacée',
    ok: [
      { p: 'si-pqp', c: 'a', s: '<{Si} j’[avais vu] les panneaux de déneigement>, j’aurais déplacé ma voiture.' }
    ],
    non: [
      { p: 'si-imparfait', why: '« Si » + imparfait parle d’aujourd’hui ou d’une habitude ; ici, l’occasion est passée et B est au conditionnel passé : il faut le plus-que-parfait.' },
      { p: 'au-cas-ou', why: '« Au cas où » sert à prévoir une précaution ; ici, c’est trop tard, on regrette le passé.' },
      { p: 'quand', why: '« Quand » raconterait un fait réel ; or je n’ai pas vu les panneaux.' }
    ],
    back: { p: 'si-present', c: 'a', s: 'La prochaine fois, <{si} je [vois] les panneaux de déneigement>, je [déplacerai] ma voiture.', fn: 'Avec « si » + présent, on regarde vers l’avenir : le regret devient une résolution pour la prochaine fois (présent → futur).' }
  },
  {
    id: 'condition-09', rel: 'condition', th: 'santé',
    a: 'Je ne savais pas que la clinique ouvrait le samedi.', b: 'Je ne serais pas allée aux urgences.',
    as: 'la clinique', bs: 'pas les urgences',
    ok: [
      { p: 'si-pqp', c: 'a', s: '<{Si} j’[avais su] que la clinique ouvrait le samedi>, je ne serais pas allée aux urgences.' }
    ],
    non: [
      { p: 'si-imparfait', why: '« Si je savais » parlerait du présent (« si je savais, je n’irais pas ») ; ici, l’occasion est passée et B est au conditionnel passé.' },
      { p: 'a-condition-de', why: '« À condition de » + infinitif pose une exigence pour l’avenir ; ici, on regrette une chose passée.' },
      { p: 'quand', why: '« Quand » raconterait un fait réel ; or je ne le savais pas.' }
    ],
    back: { p: 'parce-que', c: 'a', s: 'Je [suis allée] aux urgences <{parce que} je ne savais pas que la clinique ouvrait le samedi>.', fn: 'Avec « parce que », on revient à la réalité : ce qui s’est vraiment passé, sans hypothèse ni conditionnel.' }
  },
  {
    id: 'condition-10', rel: 'condition', th: 'loisirs',
    a: 'On n’a pas réservé le camping en février.', b: 'On aurait eu une place au bord du lac.',
    as: 'réservation', bs: 'bord du lac',
    ok: [
      { p: 'si-pqp', c: 'a', s: '<{Si} on [avait réservé] le camping en février>, on aurait eu une place au bord du lac.' }
    ],
    non: [
      { p: 'si-present', why: '« Si » + présent regarde l’avenir ; ici, février est passé et B est au conditionnel passé : plus-que-parfait.' },
      { p: 'a-moins-que', why: '« À moins que » présente une exception pour l’avenir, avec le subjonctif ; ici, on imagine un passé qui n’a pas eu lieu.' },
      { p: 'pour', why: '« Pour » ferait de la réservation un but ; ici, c’est la condition manquée.' }
    ],
    back: { p: 'a-condition-de', c: 'a', s: 'L’an prochain, on [aura] une place au bord du lac, <{à condition de} [réserver] le camping en février>.', fn: 'Avec « à condition de » + infinitif (même sujet : on), le regret devient une règle pour l’an prochain, avec le futur dans l’autre phrase.' }
  },
  {
    id: 'condition-11', rel: 'condition', th: 'voisinage',
    a: 'Tu as besoin d’aide pour déménager le 1er juillet.', b: 'Je peux venir avec ma camionnette.',
    as: 'besoin d’aide', bs: 'ma camionnette',
    ok: [
      { p: 'si-jamais', c: 'a', s: '<{Si jamais} tu as besoin d’aide pour déménager le 1er juillet>, je peux venir avec ma camionnette.' }
    ],
    non: [
      { p: 'a-moins-que', why: '« À moins que tu aies besoin d’aide » dirait le contraire : je viendrais seulement si tu n’as pas besoin de moi.' },
      { p: 'si-pqp', why: '« Si » + plus-que-parfait parle d’une occasion passée et manquée ; ici, le déménagement est à venir.' },
      { p: 'quand', why: '« Quand » présenterait ton besoin d’aide comme certain.' }
    ],
    back: { p: 'au-cas-ou', c: 'a', s: 'Je peux venir avec ma camionnette, <{au cas où} tu [aurais] besoin d’aide pour déménager le 1er juillet>.', fn: 'Avec « au cas où », le verbe passe au conditionnel (aurais) : on présente l’offre d’abord, puis le cas possible.' }
  },
  {
    id: 'condition-12', rel: 'condition', th: 'hiver',
    a: 'Je garde une pelle dans mon coffre.', b: 'Je reste prise dans la neige.',
    as: 'une pelle', bs: 'je reste prise',
    ok: [
      { p: 'au-cas-ou', c: 'b', s: 'Je garde une pelle dans mon coffre <{au cas où} je [resterais] prise dans la neige>.' }
    ],
    non: [
      { p: 'si-present', why: '« Si » rendrait la pelle conditionnelle : je la mettrais dans le coffre seulement une fois prise dans la neige. Ici, c’est une précaution prise d’avance.' },
      { p: 'pourvu-que', why: '« Pourvu que je reste prise » ressemblerait à un souhait : c’est le contraire d’une précaution.' },
      { p: 'avant-de', why: '« Avant de » situe deux actions dans le temps ; ici, la pelle sert en cas de problème.' }
    ],
    back: { p: 'si-jamais', c: 'b', s: '<{Si jamais} je [reste] prise dans la neige>, j’[ai] une pelle dans mon coffre.', fn: 'Avec « si jamais », le verbe revient à l’indicatif (reste) : on présente le problème d’abord, puis la solution déjà prête.' }
  },
  {
    id: 'condition-13', rel: 'condition', th: 'garderie',
    a: 'Je laisse mon numéro de cellulaire à l’éducatrice.', b: 'Il y a un problème avec Léo.',
    as: 'mon numéro', bs: 'un problème',
    ok: [
      { p: 'au-cas-ou', c: 'b', s: 'Je laisse mon numéro de cellulaire à l’éducatrice <{au cas où} il y [aurait] un problème avec Léo>.' },
      { p: 'en-cas-de', c: 'b', s: 'Je laisse mon numéro de cellulaire à l’éducatrice <{en cas de} [problème] avec Léo>.' }
    ],
    non: [
      { p: 'a-moins-que', why: '« À moins qu’il y ait un problème » dirait le contraire : je laisserais mon numéro, sauf s’il y a un problème.' },
      { p: 'si-imparfait', why: '« Si » + imparfait rendrait toute la phrase imaginaire ; ici, je laisse vraiment mon numéro, d’avance, par précaution.' },
      { p: 'des-que', why: '« Dès que » présenterait le problème comme sûr ; ici, il est seulement possible.' }
    ],
    back: { p: 'si-present', c: 'b', s: '<{S’}il y a un problème avec Léo>, [appelez-moi] sur mon cellulaire.', fn: 'Avec « si » + présent, le problème devient la condition d’une consigne (appelez-moi) : ce n’est plus une précaution prise d’avance.' }
  },
  {
    id: 'condition-14', rel: 'condition', th: 'logement',
    a: 'Je suis prête à signer le bail.', b: 'Le propriétaire repeint la cuisine.',
    as: 'je signe le bail', bs: 'cuisine repeinte',
    ok: [
      { p: 'a-condition-que', c: 'b', s: 'Je suis prête à signer le bail <{à condition que} le propriétaire [repeigne] la cuisine>.' },
      { p: 'pourvu-que', c: 'b', s: 'Je suis prête à signer le bail <{pourvu que} le propriétaire [repeigne] la cuisine>.' }
    ],
    non: [
      { p: 'a-condition-de', why: '« À condition de » + infinitif exige le même sujet ; ici, je signe, mais c’est le propriétaire qui repeint.' },
      { p: 'sauf-si', why: '« Sauf si » présente une exception : « sauf si le propriétaire repeint la cuisine » voudrait dire que la peinture m’empêche de signer.' },
      { p: 'pour-que', why: '« Pour que » ferait de la peinture le but de ma signature ; ici, c’est une exigence.' }
    ],
    back: { p: 'a-moins-que', c: 'b', s: 'Je [ne signerai pas] le bail, <{à moins que} le propriétaire [repeigne] la cuisine>.', fn: 'Avec « à moins que », on part du refus (je ne signerai pas) : la peinture devient la seule exception. Le subjonctif reste.' }
  },
  {
    id: 'condition-15', rel: 'condition', th: 'travail',
    a: 'J’accepte de travailler le dimanche.', b: 'J’ai congé le lundi.',
    as: 'le dimanche', bs: 'congé le lundi',
    ok: [
      { p: 'a-condition-de', c: 'b', s: 'J’accepte de travailler le dimanche <{à condition d’}[avoir] congé le lundi>.' }
    ],
    non: [
      { p: 'a-condition-que', why: '« À condition que » + subjonctif demande un autre sujet ; ici, c’est moi qui travaille et moi qui ai congé : même sujet, donc infinitif.' },
      { p: 'a-moins-que', why: '« À moins que » présente une exception : le congé du lundi m’empêcherait de travailler le dimanche, c’est le contraire.' },
      { p: 'meme-si', why: '« Même si » présenterait le congé comme un obstacle ; ici, c’est une exigence.' }
    ],
    back: { p: 'sauf-si', c: 'b', s: 'Je [n’accepte pas] de travailler le dimanche, <{sauf si} j’ai congé le lundi>.', fn: 'Avec « sauf si », on part du refus : le lundi de congé devient la seule exception, et le verbe reste à l’indicatif (j’ai).' }
  },
  {
    id: 'condition-16', rel: 'condition', th: 'famille',
    a: 'On fait un barbecue chez ma sœur samedi.', b: 'Il ne pleut pas.',
    as: 'un barbecue', bs: 'pas de pluie',
    ok: [
      { p: 'pourvu-que', c: 'b', s: 'On fait un barbecue chez ma sœur samedi, <{pourvu qu’}il ne [pleuve] pas>.' },
      { p: 'a-condition-que', c: 'b', s: 'On fait un barbecue chez ma sœur samedi, <{à condition qu’}il ne [pleuve] pas>.' }
    ],
    non: [
      { p: 'sauf-si', why: '« Sauf s’il ne pleut pas » dirait le contraire : on ferait le barbecue seulement sous la pluie.' },
      { p: 'au-cas-ou', why: '« Au cas où » prépare une précaution (« on apporte un parasol au cas où il ferait chaud ») ; ici, l’absence de pluie est une condition, pas un risque.' }
    ],
    back: { p: 'a-moins-que', c: 'b', s: 'On fait un barbecue chez ma sœur samedi, <{à moins qu’}il [pleuve]>.', fn: 'Avec « à moins que », on nomme directement l’exception (la pluie) : la négation disparaît, mais le subjonctif reste.' }
  },
  {
    id: 'condition-17', rel: 'condition', th: 'travail',
    a: 'Normalement, je travaille de la maison demain.', b: 'Mon patron a peut-être besoin de moi au bureau.',
    as: 'télétravail', bs: 'besoin au bureau',
    ok: [
      { p: 'a-moins-que', c: 'b', s: 'Normalement, je travaille de la maison demain, <{à moins que} mon patron [ait] besoin de moi au bureau>.' },
      { p: 'sauf-si', c: 'b', s: 'Normalement, je travaille de la maison demain, <{sauf si} mon patron a besoin de moi au bureau>.' }
    ],
    non: [
      { p: 'a-condition-que', why: '« À condition que » ferait du besoin du patron une condition nécessaire : je travaillerais de la maison seulement s’il a besoin de moi au bureau. C’est absurde.' },
      { p: 'pourvu-que', why: '« Pourvu que mon patron ait besoin de moi » ferait de son besoin la condition du télétravail : c’est le contraire de l’idée.' },
      { p: 'meme-si', why: '« Même si » dirait que je reste à la maison malgré le besoin du patron.' }
    ],
    back: { p: 'si-present', c: 'b', s: 'Normalement, je travaille de la maison demain, <{si} mon patron [n’a pas] besoin de moi au bureau>.', fn: 'Avec « si », on dit la condition à l’envers : il faut ajouter la négation (n’a pas besoin), et l’indicatif reste.' }
  },
  {
    id: 'condition-18', rel: 'condition', th: 'voisinage',
    a: 'On se voit au souper communautaire vendredi.', b: 'Il y a peut-être une tempête de neige.',
    as: 'souper vendredi', bs: 'une tempête',
    ok: [
      { p: 'sauf-si', c: 'b', s: 'On se voit au souper communautaire vendredi, <{sauf s’}il y a une tempête de neige>.' }
    ],
    non: [
      { p: 'si-present', why: '« S’il y a une tempête, on se voit » dirait le contraire : la tempête deviendrait la condition de la rencontre.' },
      { p: 'en-cas-de', why: '« En cas de tempête » annonce ce qu’on fera si elle arrive ; ici, la tempête annulerait la rencontre.' },
      { p: 'pendant-que', why: '« Pendant que » met deux actions en même temps ; ici, la tempête est une exception.' }
    ],
    back: { p: 'a-moins-que', c: 'b', s: 'On se voit au souper communautaire vendredi, <{à moins qu’}il y [ait] une tempête de neige>.', fn: '« À moins que » a le même sens que « sauf si », mais il demande le subjonctif : il y a → il y ait.' }
  },
  {
    id: 'condition-19', rel: 'condition', th: 'logement',
    a: 'N’utilisez pas l’ascenseur.', b: 'Il y a un incendie.',
    as: 'pas l’ascenseur', bs: 'un incendie',
    ok: [
      { p: 'en-cas-de', c: 'b', s: '<{En cas d’}[incendie]>, n’utilisez pas l’ascenseur.' },
      { p: 'si-present', c: 'b', s: '<{S’}il y a un incendie>, n’utilisez pas l’ascenseur.' }
    ],
    non: [
      { p: 'au-cas-ou', why: '« Au cas où » sert à prendre une précaution d’avance (« gardez une lampe au cas où il y aurait une panne ») ; ici, la consigne s’applique pendant l’incendie.' },
      { p: 'a-moins-que', why: '« À moins qu’il y ait un incendie » dirait le contraire : l’ascenseur serait interdit sauf pendant un incendie.' }
    ],
    back: { p: 'sauf-si', c: 'b', s: '[Utilisez] l’ascenseur, <{sauf s’}il y a un incendie>.', fn: 'Avec « sauf si », la consigne s’inverse : l’ascenseur est permis en temps normal, et l’incendie devient l’exception.' }
  },
  {
    id: 'condition-20', rel: 'condition', th: 'travail',
    a: 'Prévenez votre superviseur avant 8 h.', b: 'Vous êtes malade.',
    as: 'prévenir', bs: 'malade',
    ok: [
      { p: 'en-cas-de', c: 'b', s: '<{En cas de} [maladie]>, prévenez votre superviseur avant 8 h.' }
    ],
    non: [
      { p: 'si-imparfait', why: '« Si vous étiez malade » imaginerait une situation peu probable ; une consigne pratique parle d’un cas réel : « en cas de » + nom, ou « si » + présent.' },
      { p: 'a-moins-que', why: '« À moins que vous soyez malade » dirait le contraire : il faudrait prévenir tous les jours, sauf en cas de maladie.' },
      { p: 'a-cause-de', why: '« À cause de » + nom donne une cause réelle, pas un cas possible.' }
    ],
    back: { p: 'si-present', c: 'b', s: '<{Si} vous êtes malade>, prévenez votre superviseur avant 8 h.', fn: 'Avec « si », on retrouve une phrase complète, avec un verbe à l’indicatif ; « en cas de » demandait seulement le nom (maladie).' }
  },
  {
    id: 'condition-21', rel: 'condition', th: 'hiver',
    a: 'Il y a une panne de courant de trois jours.', b: 'Tu dors où ?',
    as: 'panne de courant', bs: 'tu dors où ?',
    ok: [
      { p: 'mettons-que', c: 'a', s: '<{Mettons qu’}il y a une panne de courant de trois jours>, tu dors où ?' }
    ],
    non: [
      { p: 'a-condition-que', why: '« À condition que » pose une exigence avant d’accepter quelque chose ; ici, on imagine une situation pour poser une question.' },
      { p: 'sauf-si', why: '« Sauf si » présente une exception ; ici, la panne n’est pas une exception, c’est la situation qu’on imagine.' },
      { p: 'quand', why: '« Quand » présenterait la panne comme sûre ; ici, on l’imagine.' }
    ],
    back: { p: 'si-imparfait', c: 'a', s: '<{S’}il y [avait] une panne de courant de trois jours>, où [dormirais-tu] ?', fn: 'En français standard (à l’écrit, au travail), on dit plutôt « si » + imparfait → conditionnel : la même hypothèse, plus soignée.' }
  }
]);
