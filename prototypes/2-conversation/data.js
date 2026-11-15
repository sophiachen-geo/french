/* Prototype 2 · Fil de conversation — données propres au prototype.
   Les expressions, exemples, pièges et relances viennent de content/essentiels.js ;
   ici : ce que Sam ajoute à chaque situation, formes « prêtes à dire » des débuts
   de phrase, pictogrammes et teintes des fonctions. */
window.P2 = (function () {
  'use strict';

  /* Ce que Sam peut dire dans chaque situation (SITE.meta.scenarios).
     court   : le sujet, en 2-3 mots, pour les schémas
     suite   : Sam précise après une réaction (« Ah oui ? »)
     partage : Sam raconte quelque chose (invite à réagir)
     fait    : un fait d'où tirer une conséquence (situations « nouvelle »)
     raconte : une question qui invite à raconter */
  const SCN = {
    quebec: {
      court: 'choisir le Québec',
      partage: 'Moi, je viens de Lyon. Je devais rester un an… ça fait six ans !',
      suite: 'Pour vrai ! Au début, c’était l’hiver qui me faisait peur. Maintenant, j’adore ça.',
      raconte: 'Et ton arrivée, comment ça s’est passé ?'
    },
    emploi: {
      court: 'mon nouvel emploi',
      partage: 'Moi, je change de poste le mois prochain. J’ai hâte !',
      suite: 'Oui ! Je vais pouvoir travailler de la maison deux jours par semaine.',
      raconte: 'Ta première journée, ça s’est passé comment ?'
    },
    loterie: {
      court: 'gagner le gros lot',
      partage: 'Moi, je m’achèterais un chalet dans les Laurentides, c’est sûr.',
      suite: 'Ben oui ! Un petit chalet au bord d’un lac, avec un poêle à bois.',
      raconte: 'As-tu déjà gagné quelque chose, toi ? Raconte !'
    },
    ville: {
      court: 'Montréal',
      partage: 'Moi, je m’ennuie parfois de la mer. Ici, il y a juste le fleuve !',
      suite: 'C’est ça. Mais le fleuve, l’été, c’est quand même beau.',
      raconte: 'Qu’est-ce qui t’a surprise en arrivant à Montréal ?'
    },
    fds: {
      court: 'ma fin de semaine',
      partage: 'Moi, j’ai fait l’autocueillette de pommes à Rougemont.',
      suite: 'Oui ! On a rapporté deux gros sacs. Je vais faire des tartes toute la semaine.',
      raconte: 'Pis, qu’est-ce que tu as fait ensuite ?'
    },
    transport: {
      court: 'le transport',
      partage: 'Moi, la ligne orange était encore en panne ce matin…',
      suite: 'Oui ! J’ai attendu vingt minutes sur le quai, pis j’ai manqué ma réunion.',
      raconte: 'Ça t’est déjà arrivé, une panne de métro ?'
    },
    quartier: {
      court: 'mon quartier',
      partage: 'Moi, je viens de déménager dans Villeray. Il y a plein de petits cafés.',
      suite: 'Oui, pis le marché Jean-Talon est juste à côté. C’est parfait !',
      raconte: 'Comment tu l’as trouvé, ton logement ?'
    },
    annee: {
      court: 'l’an prochain',
      partage: 'Moi, je voudrais retourner aux études à temps partiel.',
      suite: 'Oui ! Un certificat en gestion, le soir. On verra si j’ai le temps.',
      raconte: 'Et cette année, comment ça s’est passé ?'
    },
    appart: {
      court: 'ton nouvel appart',
      suite: 'Un beau 4 ½ à Rosemont, proche du parc. Pis le loyer est raisonnable !',
      partage: 'Pis en plus, il y a une cour arrière !',
      fait: 'Je signe le bail samedi.',
      raconte: 'Toi, ça avait été long, trouver ton appart ?'
    },
    loyer: {
      court: 'loyer + 10 %',
      suite: 'Oui, 10 % ! Il dit que c’est à cause des rénovations.',
      partage: 'Pis il me donne juste deux semaines pour répondre.',
      fait: 'Je pense que je vais refuser l’augmentation.',
      raconte: 'Ça t’est déjà arrivé, à toi ?'
    },
    cours: {
      court: 'arrêter les cours',
      suite: 'Ben oui… J’ai trop de travail, pis le soir, j’ai plus d’énergie.',
      partage: 'En plus, mon groupe change d’horaire en janvier.',
      fait: 'Comme ça, je vais avoir plus de temps libre.',
      raconte: 'Toi, as-tu déjà pensé à arrêter ?'
    },
    rdv: {
      court: 'rendez-vous annulé',
      suite: 'Oui, pour la deuxième fois ! J’ai reçu le message ce matin.',
      partage: 'Pis j’ai encore mal au dos…',
      fait: 'Le prochain rendez-vous disponible, c’est dans trois semaines.',
      raconte: 'Ça t’est déjà arrivé, à toi ?'
    }
  };

  /* Ce que Sam demande pour t'inviter à utiliser une fonction (onglet).
     Reprend la « relance » des essentiels quand elle convient. */
  const ASK = {
    1: { q: 'Et toi, qu’est-ce qui compte le plus pour toi ?' },
    2: { q: 'C’est comment, exactement ? Décris-moi ça.' },
    3: { q: s => s.raconte },
    4: { q: 'Pourquoi tu dis ça ?' },
    5: { q: 'Et qu’est-ce que ça a changé pour toi ?', n: s => s.fait },
    6: { q: 'Qu’est-ce que tu aimerais faire, toi ?', n: 'Qu’est-ce que tu me conseilles de faire ?' },
    7: { q: 'Et si ça ne se passait pas comme prévu ?', n: 'Et toi, qu’est-ce que tu ferais à ma place ?' },
    8: { q: 'Il n’y a pas aussi des mauvais côtés ?', n: 'Il faut voir le bon côté, non ?' },
    9: { q: 'Qu’est-ce que tu en penses ?' },
    10: { q: 'Tu peux me donner un exemple ?' },
    11: { q: 'Si je comprends bien, tu veux dire que… ?' },
    12: { q: s => s.partage }
  };

  /* Comment Sam accueille ce que tu viens de dire (selon la fonction utilisée). */
  const ACK = {
    1: 'OK, je vois de quoi tu parles.',
    2: 'Ah, je vois le genre !',
    3: 'Ah oui ? Je savais pas ça.',
    4: 'Ah, je comprends mieux.',
    5: 'Ah, c’est logique.',
    6: 'Bonne idée !',
    7: 'Hmm, c’est pas bête.',
    8: 'C’est vrai, il y a deux côtés.',
    9: 'Intéressant, ce que tu dis.',
    10: 'Ah oui, je vois.',
    11: 'OK, c’est clair.',
    12: 'Ha ha, prends ton temps !'
  };
  /* Variante quand Sam vient d'annoncer une nouvelle : tu parles de SA situation. */
  const ACK_N = {
    4: 'Oui, tu as raison.',
    5: 'Oui, c’est ça !',
    9: 'Ouais, je pense comme toi.',
    11: 'Oui, c’est exactement ça.'
  };
  const CLOSING = 'Merci, c’était le fun de jaser avec toi ! On se reparle bientôt.';

  /* Formes « prêtes à dire » : « … » marque le trou que tu complètes à voix haute.
     Clé : onglet|expression telle qu'elle figure dans les essentiels. */
  const SAY = {
    '1|Ce qui m\'intéresse, c\'est…': 'Ce qui m’intéresse, c’est …',
    '4|vu que': 'Vu que …',
    '2|qui': 'C’est quelque chose qui …',
    '2|que': 'C’est quelque chose que …',
    '2|dont': 'C’est quelque chose dont …',
    '2|où': 'C’est un endroit où …',
    '2|la raison pour laquelle': 'C’est la raison pour laquelle …',
    '2|Mon frère, il…': 'Mon voisin, il …',
    '2|…, ce restaurant-là.': 'Il est vraiment …, ce coin-là.',
    '3|il y a': 'Je suis arrivée il y a …',
    '3|quand': 'Quand je suis arrivée, …',
    '3|après': 'Après avoir …',
    '3|tantôt': 'Tantôt, …',
    '3|la fin de semaine': 'La fin de semaine, …',
    '5|tellement… que': 'C’était tellement … que …',
    '7|si|+ imparfait → conditionnel': 'Si j’avais …',
    '7|au cas où': 'Au cas où …',
    '7|sauf si': 'Oui, sauf si …',
    '8|alors que': 'Moi, …, alors que …',
    '8|D\'un bord… de l\'autre…': 'D’un bord …, de l’autre …',
    '10|comme': 'Des choses comme …',
    '11|d\'abord… ensuite…': 'D’abord, … ; ensuite, …',
    '11|Fait que c\'est ça.': 'Fait que c’est ça, …',
    '12|Qu\'est-ce que tu veux dire ?': 'Qu’est-ce que tu veux dire par « … » ?'
  };

  /* Ligne du schéma de référence (visuels.js) quand le libellé ne suffit pas. */
  const ROW_ALIAS = {
    '1|a propos de': 'pour ce qui est de', '1|ce qui m\'interesse, c\'est': 'ce qui, c\'est',
    '1|en parlant de ca': 'quant a', '1|le probleme, la, c\'est que': 'le probleme, c\'est que',
    '4|vu que': 'puisque',
    '3|quand': 'au moment ou', '3|pis la': 'apres que', '3|tantot': 'dans', '3|la fin de semaine': 'pour',
    '5|c\'est pour ca que': 'donc', '5|ca fait que': 'fait que',
    '6|le but, c\'est de': 'pour', '6|question de': 'pour', '6|histoire de': 'pour',
    '7|mettons que': 'si + imparfait', '7|si jamais': 'si + present → futur',
    '8|oui, mais': 'par contre', '8|sauf que': 'par contre', '8|d\'un bord': 'par contre',
    '9|a mon avis': 'je pense que', '9|moi, je trouve que': 'je pense que', '9|me semble que': 'probablement',
    '10|comme': 'par exemple', '10|d\'ailleurs': 'en plus', '10|pis aussi': 'en plus', '10|genre': 'par exemple',
    '11|fait que c\'est ca': 'bref',
    '12|pour vrai': 'ah oui', '12|ah ouin': 'ah oui', '12|mets-en': 'ah oui', '12|fait que': 'et apres'
  };

  /* Nom court de chaque fonction (fil, bilan). */
  const SHORT = { 1: 'Sujet', 2: 'Décrire', 3: 'Raconter', 4: 'Pourquoi', 5: 'Résultat', 6: 'But', 7: 'Si…', 8: 'Nuancer', 9: 'Avis', 10: 'Ajouter', 11: 'Conclure', 12: 'Réagir' };

  /* Teinte (oklch) de chaque fonction. */
  const HUE = { 1: 252, 2: 222, 3: 148, 4: 42, 5: 72, 6: 118, 7: 300, 8: 16, 9: 274, 10: 95, 11: 330, 12: 355 };

  /* Pictogrammes : le même langage que les schémas (cases, flèches, drapeau…). */
  const P = {
    1: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3" class="fill"/>',
    2: '<rect x="2.5" y="8" width="8" height="8" rx="2"/><path d="M10.5 12h3"/><rect x="13.5" y="8.5" width="8" height="7" rx="2" class="fill-soft"/>',
    3: '<path d="M3 12h16"/><path d="m16 8.5 3.5 3.5-3.5 3.5"/><circle cx="7" cy="12" r="2" class="fill"/><circle cx="12.5" cy="12" r="2" class="fill"/>',
    4: '<rect x="2.5" y="7" width="8" height="10" rx="2"/><path d="M20 12h-7"/><path d="m15.5 9-3 3 3 3"/><circle cx="20" cy="12" r="1.8" class="fill"/>',
    5: '<circle cx="4.5" cy="12" r="1.8" class="fill"/><path d="M7 12h6"/><path d="m10.5 9 3 3-3 3"/><rect x="14.5" y="7" width="7" height="10" rx="2" class="fill-soft"/>',
    6: '<path d="M6 21V3.5"/><path d="M6 4h12l-2.5 4L18 12H6" class="fill-soft"/>',
    7: '<path d="M3 12h6"/><path d="m9 12 5-5h5"/><path d="m9 12 5 5h5" stroke-dasharray="2.4 2"/><path d="m17 5 2 2-2 2"/>',
    8: '<path d="M3 12h17"/><path d="m17 9 3 3-3 3"/><path d="M11 5v14" stroke-width="3.2"/>',
    9: '<path d="M4 17a8 8 0 0 1 16 0"/><path d="M12 17l4.5-6"/><circle cx="12" cy="17" r="1.6" class="fill"/>',
    10: '<rect x="2.5" y="7" width="8" height="10" rx="2"/><path d="M17 8v8M13 12h8"/>',
    11: '<path d="M3 5.5l7.5 6.5M3 12h7.5M3 18.5l7.5-6.5"/><path d="M10.5 12h5"/><rect x="16" y="9" width="6" height="6" rx="1.5" class="fill-soft"/>',
    12: '<path d="M3.5 4.5h11v7.5H8.5l-5 3.5z"/><path d="M17.5 9h3v8.5l-3-2.2h-6V14"/>'
  };
  const icon = (tab, size) => `<svg class="pic" viewBox="0 0 24 24" width="${size || 22}" height="${size || 22}" aria-hidden="true" focusable="false">${P[tab] || ''}</svg>`;

  /* Petits pictogrammes d'interface. */
  const UI = {
    shuffle: '<path d="M3 7h3.5c3 0 4.5 10 8 10H20"/><path d="M3 17h3.5c1.4 0 2.4-2 3.3-4.2M14 9.3C14.8 8 15.6 7 16.5 7H20"/><path d="m17.5 4.5 2.5 2.5-2.5 2.5M17.5 14.5l2.5 2.5-2.5 2.5"/>',
    list: '<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1" class="fill"/><circle cx="4" cy="12" r="1" class="fill"/><circle cx="4" cy="18" r="1" class="fill"/>',
    restart: '<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4.5h4.5"/>',
    speaker: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
    wave: '<path d="M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/>',
    spark: '<path d="M12 3v5M12 16v5M3 12h5M16 12h5"/><circle cx="12" cy="12" r="1.6" class="fill"/>',
    link: '<path d="M7 17 17 7"/><path d="M9 7h8v8"/>',
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    send: '<path d="M4 12h14"/><path d="m13 6 6 6-6 6"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>'
  };
  const ui = (name, size) => `<svg class="ui" viewBox="0 0 24 24" width="${size || 20}" height="${size || 20}" aria-hidden="true" focusable="false">${UI[name] || ''}</svg>`;

  return { SCN, ASK, ACK, ACK_N, CLOSING, SAY, ROW_ALIAS, SHORT, HUE, icon, ui, MAX_TURNS: 4 };
})();
