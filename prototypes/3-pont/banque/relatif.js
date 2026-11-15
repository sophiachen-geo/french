/* Atelier de ponts — banque : Description, pronoms relatifs (qui, que, dont, où, auquel / à laquelle,
   préposition + lequel, préposition + qui). Format : voir outils/exemple-banque.js. */
ATELIER.ajouter([
  {
    id: 'relatif-01', rel: 'relatif', th: 'travail',
    a: 'Je travaille avec une collègue.', b: 'Cette collègue parle cinq langues.',
    as: 'je travaille avec', bs: 'cinq langues',
    ok: [
      { p: 'qui', c: 'b', s: 'Je travaille avec une collègue <{qui} parle cinq langues>.' }
    ],
    non: [
      { p: 'que', why: '« Que » remplace un complément direct ; dans B, c’est la collègue qui parle : elle est le sujet → qui.' },
      { p: 'dont', why: '« Dont » remplace un complément avec « de » ; dans B, il n’y a pas de « de » : la collègue est le sujet du verbe.' },
      { p: 'en-plus', why: '« En plus » ajouterait une nouvelle idée ; ici, B décrit la collègue de A.' }
    ],
    back: { p: 'prep-qui', c: 'a', s: '[La] collègue <{avec qui} je travaille> parle cinq langues.', fn: 'On inverse : B devient la phrase principale et A décrit la collègue. On travaille avec quelqu’un → « avec qui ».' }
  },
  {
    id: 'relatif-02', rel: 'relatif', th: 'hiver',
    a: 'J’ai acheté des bottes d’hiver.', b: 'Ces bottes résistent à moins quarante.',
    as: 'j’ai acheté', bs: 'moins quarante',
    ok: [
      { p: 'qui', c: 'b', s: 'J’ai acheté des bottes d’hiver <{qui} résistent à moins quarante>.' }
    ],
    non: [
      { p: 'que', why: '« Que » remplace un complément direct ; dans B, ce sont les bottes qui résistent : elles sont le sujet → qui, même pour une chose.' },
      { p: 'auquel', why: '« Auquel / auxquelles » remplace « à + chose » ; ici, le « à » de « résister à » va avec « moins quarante », pas avec les bottes, qui sont le sujet → qui.' }
    ],
    back: { p: 'que', c: 'a', s: '[Les] bottes d’hiver <{que} j’ai [achetées]> résistent à moins quarante.', fn: 'On inverse : B devient la phrase principale. Dans A, les bottes sont le complément direct → que, et le participe s’accorde avec « que » placé avant : achetées.' }
  },
  {
    id: 'relatif-03', rel: 'relatif', th: 'santé',
    a: 'Je vais souvent à une clinique sans rendez-vous.', b: 'Cette clinique ouvre à sept heures.',
    as: 'j’y vais souvent', bs: 'ouvre à 7 h',
    ok: [
      { p: 'qui', c: 'b', s: 'Je vais souvent à une clinique sans rendez-vous <{qui} ouvre à sept heures>.' }
    ],
    non: [
      { p: 'ou', why: '« Où » irait si la clinique était le lieu d’une autre action (« la clinique où je vais ») ; dans B, c’est la clinique qui ouvre : elle est le sujet → qui.' },
      { p: 'que', why: '« Que » remplace un complément direct ; « ouvrir à sept heures » n’en a pas, et la clinique est le sujet.' },
      { p: 'quand', why: '« Quand » situe un moment ; ici, B décrit la clinique de A.' }
    ],
    back: { p: 'ou', c: 'a', s: '[La] clinique sans rendez-vous <{où} je vais souvent> ouvre à sept heures.', fn: 'On inverse : B devient la phrase principale. Dans A, la clinique est un lieu (aller à la clinique) → où.' }
  },
  {
    id: 'relatif-04', rel: 'relatif', th: 'démarches',
    a: 'La lettre de Revenu Québec m’inquiète.', b: 'J’ai reçu cette lettre hier.',
    as: 'elle m’inquiète', bs: 'reçue hier',
    ok: [
      { p: 'que', c: 'b', s: 'La lettre de Revenu Québec <{que} j’ai [reçue] hier> m’inquiète.' }
    ],
    non: [
      { p: 'qui', why: '« Qui » remplace le sujet ; dans B, le sujet de « ai reçu » est « je », et la lettre est le complément direct → que.' },
      { p: 'dont', why: '« Dont » demande un verbe construit avec « de » ; on dit « recevoir une lettre », sans « de » → que.' },
      { p: 'quand', why: '« Quand » situerait un moment ; ici, B dit de quelle lettre on parle.' }
    ],
    back: { p: 'qui', c: 'a', s: 'J’ai reçu hier [une] lettre de Revenu Québec <{qui} m’inquiète>.', fn: 'On inverse : B devient la phrase principale. Dans A, c’est la lettre qui inquiète : elle est le sujet → qui. « Reçu » ne s’accorde pas, car le complément direct est après le verbe.' }
  },
  {
    id: 'relatif-05', rel: 'relatif', th: 'culture',
    a: 'Le film était difficile à comprendre.', b: 'On a vu ce film au cinéma du quartier.',
    as: 'difficile à suivre', bs: 'vu au cinéma',
    ok: [
      { p: 'que', c: 'b', s: 'Le film <{qu’}on a vu au cinéma du quartier> était difficile à comprendre.' }
    ],
    non: [
      { p: 'ou', why: '« Où » irait avec le cinéma (un lieu), mais le nom répété est « le film » : c’est le complément direct de « voir » → qu’.' },
      { p: 'qui', why: '« Qui » remplace le sujet ; dans B, le sujet est « on », et le film est le complément direct → que (qu’ devant une voyelle).' }
    ],
    back: { p: 'que', c: 'b', s: '[Ce] film, <{qu’}on a vu au cinéma du quartier>, était difficile à comprendre.', fn: 'Entre virgules, la relative ajoute un détail sur un film déjà connu ; sans virgules, elle sert à dire de quel film on parle.' }
  },
  {
    id: 'relatif-06', rel: 'relatif', th: 'loisirs',
    a: 'Nous sommes allés dans une cabane à sucre.', b: 'Mes collègues ont recommandé cette cabane à sucre.',
    as: 'cabane à sucre', bs: 'recommandée',
    ok: [
      { p: 'que', c: 'b', s: 'Nous sommes allés dans une cabane à sucre <{que} mes collègues ont [recommandée]>.' }
    ],
    non: [
      { p: 'ou', why: '« Où » irait si on faisait quelque chose dans la cabane ; dans B, la cabane est le complément direct de « recommander » → que.' },
      { p: 'qui', why: '« Qui » remplace le sujet ; dans B, le sujet est « mes collègues », et la cabane est le complément direct → que.' },
      { p: 'dont', why: '« Dont » demande un verbe construit avec « de » ; on dit « recommander une cabane », sans « de » → que.' }
    ],
    back: { p: 'ou', c: 'a', s: 'Mes collègues ont recommandé [la] cabane à sucre <{où} nous sommes allés>.', fn: 'On inverse : B devient la phrase principale. Dans A, la cabane est un lieu (aller dans la cabane) → où. « Recommandé » ne s’accorde plus : le complément direct est après le verbe.' }
  },
  {
    id: 'relatif-07', rel: 'relatif', th: 'logement',
    a: 'Nous allons visiter le quartier.', b: 'Je t’ai parlé de ce quartier.',
    as: 'on va visiter', bs: 'je t’en ai parlé',
    ok: [
      { p: 'dont', c: 'b', s: 'Nous allons visiter le quartier <{dont} je t’ai parlé>.' }
    ],
    non: [
      { p: 'que', why: '« Que » remplace un complément direct ; or on dit « parler de quelque chose » : avec « de », c’est dont.' },
      { p: 'ou', why: '« Où » irait si on faisait quelque chose dans le quartier (« le quartier où j’habite ») ; ici, le verbe est « parler de » → dont.' },
      { p: 'auquel', why: '« Auquel » va avec un verbe + « à » (penser à, participer à) ; ici, « parler » se construit avec « de » → dont.' }
    ],
    back: { p: 'que', c: 'a', s: 'Je t’ai parlé [du] quartier <{que} nous allons visiter>.', fn: 'On inverse : B devient la phrase principale, et « de ce quartier » devient « du quartier ». Dans A, le quartier est le complément direct de « visiter » → que.' }
  },
  {
    id: 'relatif-08', rel: 'relatif', th: 'démarches',
    a: 'Le formulaire est disponible en ligne.', b: 'Tu as besoin de ce formulaire pour ta demande.',
    as: 'en ligne', bs: 'tu en as besoin',
    ok: [
      { p: 'dont', c: 'b', s: 'Le formulaire <{dont} tu as besoin pour ta demande> est disponible en ligne.' }
    ],
    non: [
      { p: 'que', why: '« Que » ne va pas : on dit « avoir besoin de quelque chose », avec « de » → dont.' },
      { p: 'auquel', why: '« Auquel » va avec un verbe + « à » ; « avoir besoin » se construit avec « de » → dont.' },
      { p: 'parce-que', why: '« Parce que » donnerait une cause ; ici, B dit de quel formulaire on parle.' }
    ],
    back: { p: 'qui', c: 'a', s: 'Pour ta demande, tu as besoin [d’un] formulaire <{qui} est disponible en ligne>.', fn: 'On inverse : B devient la phrase principale. Dans A, le formulaire est le sujet de « est disponible » → qui.' }
  },
  {
    id: 'relatif-09', rel: 'relatif', th: 'voisinage',
    a: 'Mon voisin m’a donné un conseil.', b: 'Je me souviens encore de ce conseil.',
    as: 'un conseil', bs: 'je m’en souviens',
    ok: [
      { p: 'dont', c: 'b', s: 'Mon voisin m’a donné un conseil <{dont} je me souviens encore>.' }
    ],
    non: [
      { p: 'que', why: '« Que » ne va pas avec ce verbe : on dit « se souvenir de quelque chose », avec « de » → dont.' },
      { p: 'auquel', why: '« Auquel » irait avec « penser à » (« le conseil auquel je pense ») ; « se souvenir » demande « de » → dont.' },
      { p: 'qui', why: '« Qui » remplace le sujet ; dans B, le sujet est « je », pas le conseil.' }
    ],
    back: { p: 'que', c: 'b', s: 'Mon voisin m’a donné un conseil <{que} je me [rappelle] encore>.', fn: 'Même idée avec « se rappeler », qui se construit sans « de » : le conseil devient complément direct → que. C’est le verbe qui choisit le pronom.' }
  },
  {
    id: 'relatif-10', rel: 'relatif', th: 'famille',
    a: 'Sherbrooke est une ville étudiante.', b: 'Ma sœur vit dans cette ville depuis deux ans.',
    as: 'ville étudiante', bs: 'ma sœur y vit',
    ok: [
      { p: 'ou', c: 'b', s: 'Sherbrooke est une ville étudiante <{où} ma sœur vit depuis deux ans>.' },
      { p: 'prep-lequel', c: 'b', s: 'Sherbrooke est une ville étudiante <{dans [laquelle]} ma sœur vit depuis deux ans>.' }
    ],
    non: [
      { p: 'que', why: '« Que » remplace un complément direct ; or on vit dans une ville : c’est un lieu → où (ou « dans laquelle »).' },
      { p: 'qui', why: '« Qui » remplace le sujet ; dans B, le sujet de « vit » est « ma sœur », pas la ville.' }
    ],
    back: { p: 'qui', c: 'a', s: 'Ma sœur vit depuis deux ans [à] Sherbrooke, <{qui} est une ville étudiante>.', fn: 'On inverse : B devient la phrase principale et A ajoute une précision entre virgules. Sherbrooke est le sujet de « est » → qui.' }
  },
  {
    id: 'relatif-11', rel: 'relatif', th: 'immigration',
    a: 'Je n’oublierai jamais ce jour.', b: 'Je suis arrivée au Québec ce jour-là.',
    as: 'inoubliable', bs: 'arrivée au Québec',
    ok: [
      { p: 'ou', c: 'b', s: 'Je n’oublierai jamais [le] jour <{où} je suis arrivée au Québec>.' }
    ],
    non: [
      { p: 'que', why: '« Que » irait si le jour était complément direct ; dans B, « ce jour-là » dit quand je suis arrivée : c’est un moment → où.' },
      { p: 'quand', why: '« Quand » ne se place pas après un nom : on dit « le jour où », jamais « le jour quand ».' },
      { p: 'dont', why: '« Dont » demande un verbe construit avec « de » ; « arriver ce jour-là » n’en a pas.' }
    ],
    back: { p: 'que', c: 'a', s: 'Je suis arrivée au Québec [un] jour <{que} je n’oublierai jamais>.', fn: 'On inverse : B devient la phrase principale. Dans A, le jour est le complément direct de « oublier » → que, et non « où ».' }
  },
  {
    id: 'relatif-12', rel: 'relatif', th: 'garderie',
    a: 'La garderie a une grande cour.', b: 'Mon fils va à cette garderie.',
    as: 'grande cour', bs: 'mon fils y va',
    ok: [
      { p: 'ou', c: 'b', s: 'La garderie <{où} va mon fils> a une grande cour.' }
    ],
    non: [
      { p: 'auquel', why: '« À laquelle » va avec un verbe + « à » au sens abstrait (penser à, participer à) ; pour un lieu où l’on va, on emploie « où ».' },
      { p: 'que', why: '« Que » remplace un complément direct ; « aller » n’en a pas : on va à la garderie, un lieu → où.' },
      { p: 'qui', why: '« Qui » remplace le sujet ; dans B, le sujet de « va » est « mon fils », pas la garderie.' }
    ],
    back: { p: 'qui', c: 'a', s: 'Mon fils va à [une] garderie <{qui} a une grande cour>.', fn: 'On inverse : B devient la phrase principale. Dans A, la garderie est le sujet de « a » → qui.' }
  },
  {
    id: 'relatif-13', rel: 'relatif', th: 'emploi',
    a: 'L’atelier de recherche d’emploi était très utile.', b: 'J’ai participé à cet atelier la semaine dernière.',
    as: 'très utile', bs: 'j’y ai participé',
    ok: [
      { p: 'auquel', c: 'b', s: 'L’atelier de recherche d’emploi <{[auquel]} j’ai participé la semaine dernière> était très utile.' }
    ],
    non: [
      { p: 'dont', why: '« Dont » va avec un verbe + « de » ; « participer » demande « à » → auquel (à + lequel).' },
      { p: 'que', why: '« Que » oublierait la préposition : on participe à quelque chose → auquel.' }
    ],
    back: { p: 'que', c: 'b', s: 'L’atelier de recherche d’emploi <{que} j’ai [suivi] la semaine dernière> était très utile.', fn: 'Même idée avec « suivre un atelier », sans préposition : l’atelier devient complément direct → que. C’est le verbe qui choisit le pronom.' }
  },
  {
    id: 'relatif-14', rel: 'relatif', th: 'études',
    a: 'La formation en soins infirmiers dure trois ans.', b: 'Je m’intéresse à cette formation.',
    as: 'dure trois ans', bs: 'elle m’intéresse',
    ok: [
      { p: 'auquel', c: 'b', s: 'La formation en soins infirmiers <{à [laquelle]} je m’intéresse> dure trois ans.' }
    ],
    non: [
      { p: 'prep-qui', why: '« À qui » sert pour une personne ; pour une chose comme une formation, on emploie « à laquelle ».' },
      { p: 'dont', why: '« Dont » va avec « de » ; on dit « s’intéresser à quelque chose » → à laquelle.' },
      { p: 'que', why: '« Que » oublierait la préposition « à » de « s’intéresser à ».' }
    ],
    back: { p: 'qui', c: 'b', s: 'La formation en soins infirmiers <{qui} m’intéresse> dure trois ans.', fn: 'Même idée avec le verbe « intéresser » : la formation devient le sujet → qui. C’est plus simple à l’oral que « à laquelle je m’intéresse ».' }
  },
  {
    id: 'relatif-15', rel: 'relatif', th: 'travail',
    a: 'Le projet avance bien.', b: 'Je travaille sur ce projet depuis mars.',
    as: 'avance bien', bs: 'depuis mars',
    ok: [
      { p: 'prep-lequel', c: 'b', s: 'Le projet <{sur lequel} je travaille depuis mars> avance bien.' }
    ],
    non: [
      { p: 'que', why: '« Que » oublierait la préposition : on travaille sur un projet → sur lequel.' },
      { p: 'ou', why: '« Où » sert pour un lieu ou un moment ; un projet n’est ni l’un ni l’autre → sur lequel.' },
      { p: 'dont', why: '« Dont » remplace « de + nom » ; ici, la préposition est « sur ».' }
    ],
    back: { p: 'qui', c: 'a', s: 'Je travaille depuis mars sur [un] projet <{qui} avance bien>.', fn: 'On inverse : B devient la phrase principale. Dans A, le projet est le sujet de « avance » → qui.' }
  },
  {
    id: 'relatif-16', rel: 'relatif', th: 'hiver',
    a: 'La pelle est très légère.', b: 'Je déneige l’entrée avec cette pelle.',
    as: 'très légère', bs: 'je déneige',
    ok: [
      { p: 'prep-lequel', c: 'b', s: 'La pelle <{avec [laquelle]} je déneige l’entrée> est très légère.' }
    ],
    non: [
      { p: 'prep-qui', why: '« Avec qui » sert pour une personne ; une pelle est une chose → avec laquelle.' },
      { p: 'que', why: '« Que » oublierait la préposition : on déneige avec la pelle, elle n’est pas complément direct.' },
      { p: 'dont', why: '« Dont » remplace « de + nom » ; ici, la préposition est « avec ».' }
    ],
    back: { p: 'dont', c: 'b', s: 'La pelle <{dont} je [me sers pour déneiger] l’entrée> est très légère.', fn: 'Même idée avec « se servir de » : la préposition devient « de » → dont. C’est le verbe qui choisit le pronom.' }
  },
  {
    id: 'relatif-17', rel: 'relatif', th: 'santé',
    a: 'L’intervenante parle ukrainien.', b: 'J’ai rendez-vous avec cette intervenante jeudi.',
    as: 'parle ukrainien', bs: 'rendez-vous jeudi',
    ok: [
      { p: 'prep-qui', c: 'b', s: 'L’intervenante <{avec qui} j’ai rendez-vous jeudi> parle ukrainien.' }
    ],
    non: [
      { p: 'que', why: '« Que » oublierait la préposition : on a rendez-vous avec quelqu’un → avec qui.' },
      { p: 'qui', why: '« Qui » seul remplace le sujet ; dans B, le sujet est « je » : il faut garder la préposition → avec qui.' },
      { p: 'dont', why: '« Dont » remplace « de + nom » ; ici, la préposition est « avec ».' }
    ],
    back: { p: 'qui', c: 'a', s: 'Jeudi, j’ai rendez-vous avec [une] intervenante <{qui} parle ukrainien>.', fn: 'On inverse : B devient la phrase principale. Dans A, l’intervenante est le sujet de « parle » → qui, sans préposition.' }
  },
  {
    id: 'relatif-18', rel: 'relatif', th: 'voisinage',
    a: 'La voisine est très gentille.', b: 'Je fais du gardiennage pour cette voisine.',
    as: 'très gentille', bs: 'gardiennage',
    ok: [
      { p: 'prep-qui', c: 'b', s: 'La voisine <{pour qui} je fais du gardiennage> est très gentille.' }
    ],
    non: [
      { p: 'que', why: '« Que » oublierait la préposition : on travaille pour quelqu’un → pour qui.' },
      { p: 'auquel', why: '« À laquelle » remplace « à + nom » ; ici, la préposition est « pour » → pour qui.' },
      { p: 'pour-que', why: '« Pour que » exprime un but et demande le subjonctif ; ici, B décrit la voisine.' }
    ],
    back: { p: 'qui', c: 'a', s: 'Je fais du gardiennage pour [une] voisine <{qui} est très gentille>.', fn: 'On inverse : B devient la phrase principale. Dans A, la voisine est le sujet de « est » → qui.' }
  }
]);
