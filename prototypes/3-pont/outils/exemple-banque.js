/* Exemple de format (une paire). Les vraies paires sont dans les autres fichiers. */
ATELIER.ajouter([
  {
    id: 'exemple-01', rel: 'cause', th: 'météo',
    a: 'Je reste à la maison.', b: 'Il pleut à boire debout.',
    as: 'je reste', bs: 'il pleut',
    ok: [
      { p: 'parce-que', c: 'b', s: 'Je reste à la maison <{parce qu’}il pleut à boire debout>.' },
      { p: 'comme', c: 'b', s: '<{Comme} il pleut à boire debout>, je reste à la maison.' }
    ],
    non: [
      { p: 'grace-a', why: '« Grâce à » présente une cause positive, suivie d’un nom ; ici la pluie est un problème, et c’est une phrase complète.' },
      { p: 'bien-que' }
    ],
    back: { p: 'donc', c: 'a', s: 'Il pleut à boire debout, <{donc} je reste à la maison>.', fn: 'Le pont s’accroche maintenant au résultat : la cause passe devant.' }
  }
]);
