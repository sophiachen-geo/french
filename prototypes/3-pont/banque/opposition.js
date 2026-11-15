/* Atelier de ponts — banque : opposition (mais, par contre, en revanche, alors que, tandis que,
   contrairement à, au lieu de, plutôt que). Format : voir outils/exemple-banque.js. */
ATELIER.ajouter([
  {
    id: 'opposition-01', rel: 'opposition', th: 'logement',
    a: 'Mon appartement est petit.', b: 'Il est très lumineux.',
    as: 'petit', bs: 'très lumineux',
    ok: [
      { p: 'mais', c: 'b', s: 'Mon appartement est petit, <{mais} il est très lumineux>.' }
    ],
    non: [
      { p: 'contrairement-a', why: '« Contrairement à » oppose deux personnes ou deux choses (contrairement à ton appartement…) ; ici, les deux faits parlent du même appartement.' },
      { p: 'au-lieu-de', why: '« Au lieu de » remplace une action par une autre ; ici, rien n’est remplacé : l’appartement est petit et lumineux en même temps.' },
      { p: 'pourtant', why: '« Pourtant » annonce une surprise après un obstacle ; être petit n’empêche pas d’être lumineux.' }
    ],
    back: { p: 'par-contre', c: 'a', s: '[Mon appartement] est très lumineux. <{Par contre}, [il] est petit>.', fn: 'On commence par la qualité, et « par contre » annonce le défaut. Le fait placé après le pont est celui qui reste en tête.' }
  },
  {
    id: 'opposition-02', rel: 'opposition', th: 'travail',
    a: 'Mon nouveau poste est loin de chez moi.', b: 'Le salaire est excellent.',
    as: 'poste loin', bs: 'bon salaire',
    ok: [
      { p: 'par-contre', c: 'b', s: 'Mon nouveau poste est loin de chez moi. <{Par contre}, le salaire est excellent>.' },
      { p: 'en-revanche', c: 'b', s: 'Mon nouveau poste est loin de chez moi. <{En revanche}, le salaire est excellent>.' }
    ],
    non: [
      { p: 'plutot-que', why: '« Plutôt que » présente un choix entre deux actions ; ici, on ne choisit rien : la distance et le salaire sont vrais tous les deux.' },
      { p: 'donc', why: '« Donc » annoncerait une conséquence ; le bon salaire ne vient pas de la distance.' }
    ],
    back: { p: 'mais', c: 'a', s: 'Le salaire est excellent, <{mais} mon nouveau poste est loin de chez moi>.', fn: 'On inverse l’ordre : avec « mais », c’est le dernier fait qui pèse le plus. Ici, la distance a le dernier mot.' }
  },
  {
    id: 'opposition-03', rel: 'opposition', th: 'études',
    a: 'Les cours de francisation du soir sont complets.', b: 'Il reste des places dans les cours de jour.',
    as: 'soir : complet', bs: 'jour : des places',
    ok: [
      { p: 'en-revanche', c: 'b', s: 'Les cours de francisation du soir sont complets. <{En revanche}, il reste des places dans les cours de jour>.' }
    ],
    non: [
      { p: 'plutot-que', why: '« Plutôt que » exprime une préférence entre deux actions ; ici, personne ne choisit : ce sont deux faits vrais en même temps.' },
      { p: 'meme-si', why: '« Même si » présente un obstacle ; les cours du soir complets n’empêchent rien : ce sont deux situations différentes.' },
      { p: 'parce-que', why: '« Parce que » donnerait une cause ; les places libres le jour ne viennent pas des cours du soir complets.' }
    ],
    back: { p: 'alors-que', c: 'a', s: 'Il reste des places dans les cours de jour, <{alors que} les cours de francisation du soir sont complets>.', fn: '« Alors que » + indicatif réunit les deux faits dans une seule phrase ; on peut commencer par la bonne nouvelle.' }
  },
  {
    id: 'opposition-04', rel: 'opposition', th: 'hiver',
    a: 'Mon mari adore l’hiver.', b: 'Moi, je le trouve trop long.',
    as: 'il adore l’hiver', bs: 'je le trouve long',
    ok: [
      { p: 'alors-que', c: 'b', s: 'Mon mari adore l’hiver, <{alors que} moi, je le trouve trop long>.' },
      { p: 'tandis-que', c: 'b', s: 'Mon mari adore l’hiver, <{tandis que} moi, je le trouve trop long>.' }
    ],
    non: [
      { p: 'au-lieu-de', why: '« Au lieu de » sert quand une action en remplace une autre ; ici, deux personnes ont deux avis différents, et rien n’est remplacé.' },
      { p: 'comme-comp', why: '« Comme » dirait que nous avons le même avis ; or nos deux avis sont opposés.' },
      { p: 'pourtant', why: '« Pourtant » annonce une surprise après un obstacle ; l’avis de mon mari n’est pas un obstacle au mien.' }
    ],
    back: { p: 'contrairement-a', c: 'a', s: '<{Contrairement à} mon mari>, je trouve [l’hiver] trop long.', fn: 'Avec « contrairement à », la phrase de mon mari se réduit à un nom : on ne garde que la personne qu’on oppose.' }
  },
  {
    id: 'opposition-05', rel: 'opposition', th: 'travail',
    a: 'Ma collègue travaille de jour.', b: 'Je fais les quarts de nuit.',
    as: 'elle : de jour', bs: 'moi : de nuit',
    ok: [
      { p: 'tandis-que', c: 'b', s: 'Ma collègue travaille de jour, <{tandis que} je fais les quarts de nuit>.' }
    ],
    non: [
      { p: 'au-lieu-de', why: '« Au lieu de » remplace une action par une autre chez la même personne ; ici, ce sont deux personnes, et chacune garde son horaire.' },
      { p: 'pendant-que', why: '« Pendant que » parle du temps : deux actions au même moment. Ici, l’une se fait le jour et l’autre la nuit : on oppose deux horaires.' }
    ],
    back: { p: 'par-contre', c: 'a', s: 'Je fais les quarts de nuit. <{Par contre}, ma collègue travaille de jour>.', fn: 'Avec « par contre », chaque fait garde sa propre phrase ; on peut commencer par soi, et le pont présente l’autre personne.' }
  },
  {
    id: 'opposition-06', rel: 'opposition', th: 'loisirs',
    a: 'Je n’aime pas le hockey.', b: 'Mon fils adore le hockey.',
    as: 'je n’aime pas', bs: 'mon fils adore',
    ok: [
      { p: 'contrairement-a', c: 'a', s: '<{Contrairement à} [moi]>, mon fils adore le hockey.' }
    ],
    non: [
      { p: 'plutot-que', why: '« Plutôt que » exprime une préférence entre deux actions de la même personne ; ici, on oppose deux personnes et leurs goûts.' },
      { p: 'malgre', why: '« Malgré » présente un obstacle, et « malgré moi » veut dire « contre ma volonté ». Ici, il n’y a pas d’obstacle, seulement deux goûts opposés.' },
      { p: 'comme-comp', why: '« Comme moi » dirait que nous aimons la même chose ; or nos goûts sont opposés.' }
    ],
    back: { p: 'alors-que', c: 'a', s: 'Mon fils adore le hockey, <{alors que} moi, je ne [l’]aime pas>.', fn: '« Alors que » + indicatif garde une vraie phrase avec un verbe, au lieu du simple pronom « moi ». « Le hockey » devient « l’ » pour ne pas le répéter.' }
  },
  {
    id: 'opposition-07', rel: 'opposition', th: 'travail',
    a: 'Ce matin, je n’ai pas pris l’ascenseur.', b: 'J’ai monté les six étages à pied.',
    as: 'pas l’ascenseur', bs: 'à pied',
    ok: [
      { p: 'au-lieu-de', c: 'a', s: 'Ce matin, j’ai monté les six étages à pied <{au lieu de} [prendre] l’ascenseur>.' }
    ],
    non: [
      { p: 'contrairement-a', why: '« Contrairement à » + nom oppose deux personnes ou deux choses ; ici, c’est la même personne qui fait une action à la place d’une autre.' },
      { p: 'tandis-que', why: '« Tandis que » met côte à côte deux faits vrais ; or je n’ai pas pris l’ascenseur : une action en remplace une autre.' },
      { p: 'pour', why: '« Pour » donne un but ; je n’ai pas monté à pied pour prendre l’ascenseur.' }
    ],
    back: { p: 'plutot-que', c: 'a', s: 'Ce matin, j’ai monté les six étages à pied <{plutôt que de} [prendre] l’ascenseur>.', fn: '« Plutôt que de » ajoute l’idée d’un choix : j’ai préféré l’escalier. « Au lieu de » disait seulement qu’une action a remplacé l’autre.' }
  },
  {
    id: 'opposition-08', rel: 'opposition', th: 'famille',
    a: 'Les enfants regardent des vidéos sur la tablette.', b: 'Ils ne jouent pas dehors.',
    as: 'des vidéos', bs: 'pas dehors',
    ok: [
      { p: 'au-lieu-de', c: 'b', s: 'Les enfants regardent des vidéos sur la tablette <{au lieu de} [jouer] dehors>.' },
      { p: 'plutot-que', c: 'b', s: 'Les enfants regardent des vidéos sur la tablette <{plutôt que de} [jouer] dehors>.' }
    ],
    non: [
      { p: 'contrairement-a', why: '« Contrairement à » + nom oppose deux personnes ; ici, ce sont les mêmes enfants, avec deux activités.' },
      { p: 'par-contre', why: '« Par contre » oppose deux faits vrais, souvent un défaut et une qualité ; ici, une activité prend la place de l’autre.' }
    ],
    back: { p: 'mais', c: 'a', s: '[Les enfants] ne jouent pas dehors, <{mais} [ils] regardent des vidéos sur la tablette>.', fn: 'Avec « ne… pas, mais », les deux verbes restent conjugués : on dit d’abord ce qui ne se fait pas, puis ce qui le remplace.' }
  },
  {
    id: 'opposition-09', rel: 'opposition', th: 'travail',
    a: 'Je pourrais acheter un repas à la cafétéria.', b: 'J’apporte mon lunch au travail.',
    as: 'acheter un repas', bs: 'mon lunch',
    ok: [
      { p: 'plutot-que', c: 'a', s: 'J’apporte mon lunch au travail <{plutôt que d’}acheter un repas à la cafétéria>.' }
    ],
    non: [
      { p: 'contrairement-a', why: '« Contrairement à » a besoin d’un nom (contrairement à mes collègues) ; ici, on choisit entre deux actions à l’infinitif.' },
      { p: 'en-revanche', why: '« En revanche » relie deux faits vrais qui s’opposent ; ici, acheter un repas n’arrive pas : c’est un choix entre deux actions.' },
      { p: 'donc', why: '« Donc » annoncerait une conséquence ; apporter mon lunch n’est pas causé par la cafétéria.' }
    ],
    back: { p: 'au-lieu-de', c: 'a', s: 'J’apporte mon lunch au travail <{au lieu d’}acheter un repas à la cafétéria>.', fn: '« Au lieu de » dit seulement qu’une action remplace l’autre ; « plutôt que de » ajoutait l’idée de préférence. Devant une voyelle : « au lieu d’ ».' }
  },
  {
    id: 'opposition-10', rel: 'opposition', th: 'démarches',
    a: 'Mon rendez-vous à la SAAQ n’est pas mardi.', b: 'C’est mercredi à 9 h.',
    as: 'pas mardi', bs: 'mercredi 9 h',
    ok: [
      { p: 'mais', c: 'b', s: 'Mon rendez-vous à la SAAQ n’est pas mardi, <{mais} mercredi à 9 h>.' }
    ],
    non: [
      { p: 'par-contre', why: '« Par contre » oppose deux faits vrais (un défaut, une qualité) ; ici, on corrige une erreur. Après « ne… pas », seul « mais » corrige.' },
      { p: 'alors-que', why: '« Alors que » met deux faits vrais côte à côte ; or le rendez-vous n’est pas mardi : il n’y a qu’une seule bonne date.' },
      { p: 'pourtant', why: '« Pourtant » annonce une surprise malgré un obstacle ; ici, on corrige simplement une date.' }
    ],
    back: { p: 'au-lieu-de', c: 'a', s: 'Mon rendez-vous à la SAAQ est mercredi à 9 h <{au lieu de} mardi>.', fn: '« Au lieu de » + nom : on donne d’abord la bonne date, puis celle qu’elle remplace. Plus besoin de négation.' }
  },
  {
    id: 'opposition-11', rel: 'opposition', th: 'voisinage',
    a: 'Mon voisin de gauche déneige son entrée lui-même.', b: 'Celui de droite paie une entreprise de déneigement.',
    as: 'il déneige seul', bs: 'il paie quelqu’un',
    ok: [
      { p: 'alors-que', c: 'b', s: 'Mon voisin de gauche déneige son entrée lui-même, <{alors que} celui de droite paie une entreprise de déneigement>.' }
    ],
    non: [
      { p: 'au-lieu-de', why: '« Au lieu de » remplace une action par une autre chez la même personne (je paie au lieu de déneiger) ; ici, on compare deux voisins.' },
      { p: 'comme-comp', why: '« Comme » marquerait une ressemblance ; or mes deux voisins font des choses différentes.' },
      { p: 'meme-si', why: '« Même si » présente un obstacle ; ce que fait un voisin n’empêche rien chez l’autre.' }
    ],
    back: { p: 'contrairement-a', c: 'a', s: '<{Contrairement à} mon voisin de gauche>, celui de droite paie une entreprise de déneigement.', fn: 'Avec « contrairement à », le premier voisin n’est plus qu’un nom : on garde la personne qu’on oppose, sans son verbe.' }
  },
  {
    id: 'opposition-12', rel: 'opposition', th: 'santé',
    a: 'La clinique sans rendez-vous est fermée le dimanche.', b: 'Info-Santé répond jour et nuit au 811.',
    as: 'clinique fermée', bs: '811 ouvert',
    ok: [
      { p: 'mais', c: 'b', s: 'La clinique sans rendez-vous est fermée le dimanche, <{mais} Info-Santé répond jour et nuit au 811>.' },
      { p: 'par-contre', c: 'b', s: 'La clinique sans rendez-vous est fermée le dimanche. <{Par contre}, Info-Santé répond jour et nuit au 811>.' }
    ],
    non: [
      { p: 'plutot-que', why: '« Plutôt que » + infinitif présente un choix entre deux actions ; ici, ce sont deux services, et les deux faits sont vrais.' },
      { p: 'parce-que', why: '« Parce que » donnerait une cause ; la clinique n’est pas fermée à cause d’Info-Santé.' }
    ],
    back: { p: 'tandis-que', c: 'a', s: 'Info-Santé répond jour et nuit au 811, <{tandis que} la clinique sans rendez-vous est fermée le dimanche>.', fn: '« Tandis que » + indicatif réunit les deux services dans une seule phrase ; on peut commencer par celui qui est toujours ouvert.' }
  }
]);
