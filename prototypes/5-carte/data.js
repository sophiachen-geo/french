/* Prototype 5 · Carte des liens — géométrie de la carte (aucun contenu pédagogique ici :
   tout le texte vient de content/*.js via SITE et CADRES).

   Deux plans : « wide » (écran large, la conversation va de gauche à droite)
   et « tall » (téléphone, la conversation descend).
   st[n] = [x, y, position de l'étiquette (e/w/n/s), largeur max. en caractères]
   lines[id] = tracé : nombres = stations, [x, y] = points de passage (coins arrondis)
   roundel[id] = pastille de ligne (lettre du module)
   zones = bandes des moments de la conversation (SITE.meta.moments), dans l'ordre
   bends['a-b'] = courbure d'une correspondance (signe = côté)                         */
window.CARTE = {
  order: { A: [1, 2], B: [3, 4, 5, 6, 7, 8], C: [10, 9, 11], D: [12] },
  momentOrder: ['commencer', 'raconter', 'expliquer', 'reagir', 'conclure'],
  layouts: {
    wide: {
      w: 1120, h: 590, axis: 'x', r: 16, font: 16.5, lh: 19, lineW: 12, wrap: 17,
      zones: [[14, 178], [178, 302], [302, 780], [780, 958], [958, 1106]],
      st: {
        1: [104, 176, 's'],
        2: [486, 176, 'n', 20],
        3: [242, 336, 's'],
        4: [362, 336, 'n'],
        5: [474, 336, 's'],
        6: [586, 336, 'n'],
        7: [698, 336, 's'],
        8: [868, 336, 'n'],
        9: [868, 486, 's', 18],
        10: [622, 486, 's'],
        11: [1030, 406, 'n', 12],
        12: [868, 150, 'e', 18]
      },
      lines: {
        A: [[44, 176], 1, 2],
        B: [[188, 336], 3, 4, 5, 6, 7, 8],
        C: [[562, 486], 10, 9, [950, 486], 11],
        D: [[868, 72], 12]
      },
      roundel: { A: [44, 176], B: [188, 336], C: [562, 486], D: [868, 72] },
      bends: {
        '3-11': -0.2, '1-10': 0.12, '4-9': -0.12, '2-10': 0.18, '7-10': -0.2, '8-10': -0.2,
        '8-11': -0.25, '11-12': -0.28, '8-12': 0.28, '3-5': 0.4, '4-8': -0.22, '5-8': 0.24,
        '10-11': 0.16, '5-7': 0.32, '1-4': -0.2, '1-5': -0.18, '2-8': 0.2, '4-12': 0.12
      }
    },
    tall: {
      w: 390, h: 712, axis: 'y', r: 14, font: 13.6, lh: 15.5, lineW: 10, wrap: 15,
      zones: [[6, 102], [102, 172], [172, 468], [468, 612], [612, 706]],
      st: {
        1: [56, 64, 'e', 13],
        2: [56, 312, 'e', 13],
        3: [214, 138, 'e', 16],
        4: [214, 208, 'e', 19],
        5: [214, 274, 'e', 16],
        6: [214, 340, 'e', 16],
        7: [214, 412, 'e', 16],
        8: [214, 532, 'e', 16],
        9: [56, 532, 'e', 9],
        10: [56, 424, 'e', 15],
        11: [214, 668, 'e', 13],
        12: [328, 604, 'w', 9]
      },
      lines: {
        A: [[56, 22], 1, 2],
        B: [[214, 94], 3, 4, 5, 6, 7, 8],
        C: [[56, 376], 10, 9, [56, 572], [152, 668], 11],
        D: [[370, 604], 12]
      },
      roundel: { A: [56, 22], B: [214, 94], C: [56, 376], D: [370, 604] },
      bends: {
        '3-11': 0.3, '11-12': 0.2, '10-11': -0.22, '1-10': -0.08, '8-10': 0.16, '7-10': -0.2,
        '8-11': 0.4, '4-8': 0.3, '4-9': -0.16, '2-10': 0.3, '3-5': 0.5, '8-12': -0.2, '5-8': 0.3,
        '5-7': 0.45, '1-4': -0.15, '1-5': -0.2, '2-8': 0.2
      }
    }
  },
  /* Mots-repères pour choisir, dans le contenu, l'exemple le plus proche du thème d'une situation */
  themes: {
    logement: /logement|appart|déménag|loyer|quartier|propriétaire|bail|métro/i,
    travail: /travail|emploi|bureau|collègue|réunion|domaine/i,
    transports: /métro|autobus|transport|auto|retard/i,
    'projets personnels': /Québec|projet|économise|emploi|maison|loterie|acheter|argent/i,
    'vie quotidienne': /hiver|quartier|ville|froid|neige|pleu/i,
    'relations sociales': /fin de semaine|samedi|voisin|festival|jaser|ensemble/i,
    'études': /examen|étudi|cours|école|francisation/i,
    'démarches administratives': /rendez-vous|écris|dossier|clinique|confirmer/i
  }
};
