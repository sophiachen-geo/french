/* IV. Structure détaillée de chaque fiche d'expression.
   Les fiches ci-dessous sont des fiches modèles pour les expressions à fonctions multiples.
   Le niveau (Échelle québécoise) reste à valider expression par expression. */

SITE.page({
  id: 'fiches',
  title: "Fiches d'expression",
  kicker: 'IV',
  lead: 'Une seule fiche par expression, plusieurs chemins pour y accéder.',
  md: String.raw`
## Structure d'une fiche

Chaque expression dispose d'une fiche uniforme.

| Champ | Contenu attendu |
|---|---|
| Fonction | Intention communicative principale |
| Sous-fonction | Relation plus précise : cause connue, conséquence directe, concession… |
| Expression | Forme exacte à apprendre |
| Catégorie grammaticale | Préposition, locution prépositive, conjonction, pronom relatif, marqueur discursif… |
| Construction | + nom, + inf., + ind., + subj., + cond., etc. |
| Sens | Explication courte et précise |
| Registre | Courant, oral, familier québécois, soutenu |
| Priorité | Essentielle, à développer, à reconnaître |
| Niveau | Niveau indicatif selon l'Échelle québécoise |
| Exemple oral | Phrase naturelle dans une situation réelle au Québec |
| Exemple écrit | Phrase employable dans un courriel ou un texte |
| Équivalent ukrainien | Traduction ou correspondance approximative |
| Nuance | Différence avec une expression voisine |
| Piège | Erreur grammaticale ou confusion fréquente |
| Variante québécoise | Variante orale pertinente, lorsqu'elle existe |
| Expressions associées | Synonymes, alternatives, constructions voisines |
| Réemploi | Autres onglets dans lesquels l'expression est utile |

## Expressions à plusieurs fonctions

Certaines expressions possèdent **plusieurs fonctions**. Chaque expression a une fiche principale et des renvois vers ses autres fonctions.

| Expression | Fonction 1 | Fonction 2 |
|---|---|---|
| Alors que | Temps | Opposition |
| Depuis que | Temps | Relation entre deux situations |
| Comme | Cause | Comparaison |
| Fait que | Conséquence | Progression ou relance du discours |
| Mettons | Hypothèse | Illustration ou approximation |
| Dans le fond | Reformulation | Retour à l'idée essentielle |
| En fait | Correction | Précision |
| Tant que | Durée | Condition |
| De sorte que | Conséquence | But |
| Pour | But | Durée, attribution ou autres relations |
`
});

SITE.fiche({
  key: 'alors que',
  expression: 'alors que',
  categorie: 'Locution conjonctive',
  registre: ['C'],
  priorite: 'essentielle',
  fonctions: [
    { fonction: 'Temps', sous: 'Simultanéité : une action en cours', tab: 3, construction: '+ ind.',
      sens: "Au moment où une action se déroule ; souvent avec l'imparfait.",
      oral: "Le téléphone a sonné alors que je sortais de l'appartement.",
      ecrit: "L'incendie s'est déclaré alors que les locataires étaient absents." },
    { fonction: 'Opposition', sous: 'Contraste entre deux faits', tab: 8, construction: '+ ind.',
      sens: 'Met en contraste deux faits ou deux situations, souvent simultanés.',
      oral: 'Mon ancien appartement était grand, alors que celui-ci est plus petit.',
      ecrit: 'Les loyers ont augmenté de 10 %, alors que les salaires sont restés stables.' }
  ],
  ukrainien: 'у той час як, тоді як — couvrent, comme *alors que*, le temps et l’opposition ; коли (temps) ; а (opposition)',
  nuance: "Pour le temps, *pendant que* insiste sur la durée et *au moment où* sur un point précis. Pour l'opposition, *tandis que* est presque équivalent ; *par contre* et *en revanche* relient deux phrases indépendantes.",
  piege: "Toujours l'indicatif : *alors qu'il soit* ✗. Ne pas confondre avec *alors* seul, qui introduit une conséquence ou une suite.",
  varianteQC: "À l'oral, l'opposition passe souvent par *sauf que…* ou *par contre…*.",
  associees: ['tandis que', 'pendant que', 'au moment où', 'par contre', 'en revanche']
});

SITE.fiche({
  key: 'depuis que',
  expression: 'depuis que',
  categorie: 'Locution conjonctive',
  registre: ['C'],
  priorite: 'essentielle',
  fonctions: [
    { fonction: 'Temps', sous: "Point de départ d'une situation qui dure", tab: 3, construction: '+ ind.',
      sens: "Situe le début d'une situation encore vraie au moment où l'on parle.",
      oral: 'Depuis que j’habite à Rosemont, je prends le métro tous les jours.',
      ecrit: 'Depuis que le service a été prolongé, la fréquentation a augmenté.' },
    { fonction: 'Relation entre deux situations', sous: 'Changement lié à un point de départ', tab: 4, construction: '+ ind.',
      sens: 'Laisse entendre un lien de cause : la deuxième situation découle de la première.',
      oral: 'Depuis qu’elle fait du bénévolat, elle parle beaucoup mieux français.',
      ecrit: 'Depuis que les inscriptions se font en ligne, les délais ont diminué.' }
  ],
  ukrainien: 'відколи ; відтоді як ; з того часу, як',
  nuance: "*Depuis* + nom ou durée (*depuis deux ans*), *depuis que* + proposition. *Ça fait deux ans que…* exprime la même durée avec une autre structure.",
  piege: "*Depuis que deux ans* ✗ → *depuis deux ans*. Ne pas confondre avec *il y a*, qui situe un moment passé : *Je suis arrivée il y a deux ans* ≠ *J'habite ici depuis deux ans*.",
  varianteQC: "*Ça fait deux ans que…* est très fréquent à l'oral.",
  associees: ['depuis', 'ça fait… que', 'il y a… que', 'dès que', 'à partir de']
});

SITE.fiche({
  key: 'comme',
  expression: 'comme',
  categorie: 'Conjonction (cause) ; conjonction ou adverbe de comparaison',
  registre: ['C'],
  priorite: 'essentielle',
  fonctions: [
    { fonction: 'Cause', sous: 'Cause présentée avant le résultat', tab: 4, construction: '+ ind.',
      sens: 'Présente la cause en tête de phrase, avant la conséquence.',
      oral: "Comme il pleuvait, on a pris l'autobus.",
      ecrit: 'Comme le dossier était incomplet, la demande a été refusée.' },
    { fonction: 'Comparaison', sous: 'Ressemblance ou manière', tab: 8, construction: '+ nom/proposition',
      sens: 'Établit une ressemblance ou indique une manière.',
      oral: 'Elle parle comme une vraie Montréalaise.',
      ecrit: "Comme l'indiquait le rapport précédent, les besoins augmentent." },
    { fonction: 'Exemple', sous: 'Illustration', tab: 10, construction: '+ nom',
      sens: 'Introduit un ou plusieurs exemples.',
      oral: "J'aime les quartiers comme Verdun ou Villeray.",
      ecrit: 'Certains services, comme la francisation, sont gratuits.' }
  ],
  ukrainien: 'оскільки, через те що (cause) ; як (comparaison) ; як-от (exemple)',
  nuance: "*Comme* causal se place en tête ; *parce que* suit généralement la principale et répond à « pourquoi ? ».",
  piege: "En emploi causal, placer *comme* en tête : *Je suis partie comme j'étais fatiguée* est ambigu → *Comme j'étais fatiguée, je suis partie.*",
  varianteQC: "À l'oral, *vu que…* [O] remplace souvent *comme* causal.",
  associees: ['parce que', 'puisque', 'vu que', 'ainsi que', 'par exemple']
});

SITE.fiche({
  key: 'fait que',
  expression: 'fait que',
  categorie: 'Marqueur discursif',
  registre: ['F-QC'],
  priorite: 'reconnaitre',
  fonctions: [
    { fonction: 'Conséquence', sous: 'Conséquence directe', tab: 5, construction: '+ proposition',
      sens: "Introduit ce qui résulte de ce qui vient d'être dit ; équivaut à *donc*.",
      oral: 'Mon logement était trop petit, fait que j’ai déménagé.',
      ecrit: 'Mon logement était trop petit ; j’ai donc déménagé.' },
    { fonction: 'Progression ou relance du discours', sous: 'Enchaîner un récit, demander la suite', tab: 12, construction: 'seul',
      sens: "Fait avancer un récit ou relance l'interlocuteur, sans lien logique fort.",
      oral: "Fait que là, je suis arrivée au bureau… — Fait que ? Tu l'as eu, l'appartement ?",
      ecrit: 'Ensuite… / Et alors ?' }
  ],
  ukrainien: 'тож ; отже ; ну і… (relance)',
  nuance: "*Fait que* est très fréquent à l'oral québécois ; à l'écrit soigné, on emploie *donc*, *c'est pourquoi* ou *par conséquent*. Production possible en contexte informel.",
  piege: "Ne pas confondre avec *ce qui fait que* (courant, + ind.) ni avec *le fait que* (nominalisation : *Le fait qu'il soit absent…*).",
  varianteQC: '*Ça fait que*, *faque*, *fait que là* [F-QC].',
  associees: ['donc', 'alors', 'ça fait que', 'faque', 'pis là', 'du coup']
});

SITE.fiche({
  key: 'mettons',
  expression: 'mettons',
  categorie: 'Marqueur discursif (impératif figé de *mettre*)',
  registre: ['O', 'QC'],
  priorite: 'developper',
  fonctions: [
    { fonction: 'Hypothèse', sous: 'Poser une situation imaginaire', tab: 7, construction: '+ proposition',
      sens: 'Introduit une hypothèse ; équivaut à *supposons que*.',
      oral: "Mettons que tu gagnes à la loterie : qu'est-ce que tu fais ?",
      ecrit: 'Supposons que le projet soit accepté…' },
    { fonction: 'Illustration ou approximation', sous: 'Exemple, estimation', tab: 10, construction: '+ nom/proposition',
      sens: 'Introduit un exemple ou une valeur approximative ; équivaut à *disons* ou *par exemple*.',
      oral: 'On pourrait se voir, mettons, jeudi ? Ça coûte, mettons, 1 200 $ par mois.',
      ecrit: 'Nous pourrions nous rencontrer jeudi, par exemple. Le loyer est d’environ 1 200 $ par mois.' }
  ],
  ukrainien: 'припустімо (hypothèse) ; скажімо, наприклад, десь (exemple, approximation)',
  nuance: "*Mettons* peut aussi concéder un point : « Mettons, mais… » ≈ « admettons, mais… ». Le sens dépend du contexte et de l'intonation.",
  piege: "À l'écrit soigné, remplacer par *supposons que* ou *admettons que* (+ subj.), ou par *par exemple*, *environ*.",
  varianteQC: '*Mettons, là, que…* [F-QC].',
  associees: ['supposons que', 'admettons que', 'imaginons que', 'disons', 'par exemple', 'genre']
});

SITE.fiche({
  key: 'dans le fond',
  expression: 'dans le fond',
  categorie: 'Locution adverbiale (marqueur discursif)',
  registre: ['O', 'QC'],
  priorite: 'essentielle',
  fonctions: [
    { fonction: 'Reformulation', sous: 'Redire autrement, plus directement', tab: 11, construction: 'seul',
      sens: 'Annonce qu’on reformule sa pensée de façon plus directe.',
      oral: 'Dans le fond, ce que je veux dire, c’est que le loyer est trop cher.',
      ecrit: 'Au fond, le problème tient au coût du loyer.' },
    { fonction: "Retour à l'idée essentielle", sous: 'Aller au cœur du sujet', tab: 11, construction: 'seul',
      sens: 'Ramène à ce qui compte vraiment, après des détails.',
      oral: 'On a parlé de bien des affaires, mais dans le fond, je veux surtout un logement tranquille.',
      ecrit: 'Essentiellement, la demande porte sur la tranquillité du logement.' }
  ],
  ukrainien: 'по суті ; власне кажучи ; зрештою',
  nuance: "*En fait* corrige ou précise ; *dans le fond* ramène à l'essentiel. *Au fond* est l'équivalent courant à l'écrit.",
  piege: 'Ne pas en faire un tic : dans un texte, préférer *au fond*, *essentiellement* ou *en somme*.',
  varianteQC: '« Dans le fond, moi, je pense que… » est très naturel à l’oral québécois.',
  associees: ['au fond', 'en fait', 'essentiellement', 'bref', 'en gros']
});

SITE.fiche({
  key: 'en fait',
  expression: 'en fait',
  categorie: 'Locution adverbiale (marqueur discursif)',
  registre: ['C'],
  priorite: 'essentielle',
  fonctions: [
    { fonction: 'Correction', sous: 'Rectifier une information', tab: 11, construction: 'seul',
      sens: "Corrige ce qui vient d'être dit ou ce que l'autre croit.",
      oral: "Je pensais que c'était lundi. En fait, c'est mardi.",
      ecrit: 'Le délai annoncé était de deux semaines ; il a en fait duré un mois.' },
    { fonction: 'Précision', sous: 'Expliquer la situation réelle', tab: 4, construction: 'seul',
      sens: 'Introduit une explication ou une précision sur la situation réelle.',
      oral: "En fait, j'ai déménagé parce que le propriétaire vendait l'immeuble.",
      ecrit: 'En fait, la majorité des demandes concernent le logement.' }
  ],
  ukrainien: 'насправді ; власне ; фактично',
  nuance: '*En fait* corrige ou précise ; *en effet* confirme ce qui précède ou le justifie.',
  piege: "Ne pas confondre *en fait* et *en effet* : « Il fait froid. — En effet ! » (confirmation) ≠ « Il fait froid ? — En fait, non. » (correction).",
  varianteQC: '*Ben, en fait…* [F-QC] pour amorcer une correction.',
  associees: ['en effet', 'en réalité', 'à vrai dire', 'dans le fond', 'plus précisément']
});

SITE.fiche({
  key: 'tant que',
  expression: 'tant que',
  categorie: 'Locution conjonctive',
  registre: ['C'],
  priorite: 'developper',
  fonctions: [
    { fonction: 'Durée', sous: 'Aussi longtemps que', tab: 3, construction: '+ ind.',
      sens: "Deux situations durent ensemble : l'une dure aussi longtemps que l'autre.",
      oral: "Tant qu'il neige, on reste à la maison.",
      ecrit: 'Le stationnement est interdit tant que les travaux sont en cours.' },
    { fonction: 'Condition', sous: 'Condition qui doit rester vraie', tab: 7, construction: '+ ind.',
      sens: 'Pose une condition ; proche de *du moment que* ou *pourvu que*.',
      oral: 'Tu peux emprunter mon auto, tant que tu me la ramènes ce soir.',
      ecrit: 'Le contrat reste valide tant que les deux parties respectent leurs engagements.' }
  ],
  ukrainien: 'поки, доки (durée) ; аби, якщо тільки (condition)',
  nuance: "*Tant que* + indicatif, mais *pourvu que* et *à condition que* + subjonctif. Pour l'avenir, le futur : *Tant que tu seras là, je serai rassurée* (contrairement à *si* + présent).",
  piege: "Ne pas confondre avec *tant… que* d'intensité (*Il a tant plu que…*, onglet 5) ni avec *tant qu'à* (*tant qu'à faire*). Pour *поки не* : *tant qu'il ne sera pas arrivé* (avec *ne… pas*) ou *jusqu'à ce qu'il arrive* (sans *ne*).",
  varianteQC: "*En autant que* s'entend au Québec au sens de condition, mais il est critiqué dans la langue soignée [D] ; on préfère *pourvu que* ou *dans la mesure où*.",
  associees: ['aussi longtemps que', 'pendant que', 'du moment que', 'pourvu que', "jusqu'à ce que"]
});

SITE.fiche({
  key: 'de sorte que',
  expression: 'de sorte que',
  categorie: 'Locution conjonctive',
  registre: ['C'],
  priorite: 'developper',
  fonctions: [
    { fonction: 'Conséquence', sous: 'Résultat constaté', tab: 5, construction: '+ ind.',
      sens: 'Présente un résultat réel, constaté.',
      oral: 'Il a neigé toute la nuit, de sorte que les autobus étaient en retard.',
      ecrit: 'Le formulaire a été simplifié, de sorte que les demandes sont traitées plus rapidement.' },
    { fonction: 'But', sous: 'Résultat recherché', tab: 6, construction: '+ subj.',
      sens: 'Présente un résultat visé, encore à atteindre.',
      oral: "Parle plus fort, de sorte que tout le monde t'entende.",
      ecrit: 'Le bureau ouvre plus tôt de sorte que les travailleurs puissent s’y présenter avant leur quart.' }
  ],
  ukrainien: 'так що (conséquence) ; щоб (but)',
  nuance: "*Si bien que* n'exprime que la conséquence ; *pour que* et *afin que* n'expriment que le but. *De sorte que* fait les deux : le mode tranche.",
  piege: 'Choisir le mode selon le sens : résultat constaté → indicatif ; résultat recherché → subjonctif.',
  varianteQC: "À l'oral, la conséquence passe plutôt par *fait que* [F-QC] ou *ce qui fait que*.",
  associees: ['si bien que', 'de manière que', 'de façon que', 'pour que', 'afin que']
});

SITE.fiche({
  key: 'pour',
  expression: 'pour',
  categorie: 'Préposition',
  registre: ['C'],
  priorite: 'essentielle',
  fonctions: [
    { fonction: 'But', sous: 'Objectif', tab: 6, construction: '+ inf.',
      sens: "Indique l'objectif, quand le sujet ne change pas.",
      oral: "J'ai déménagé pour me rapprocher du travail.",
      ecrit: 'Inscrivez-vous en ligne pour obtenir un rendez-vous.' },
    { fonction: 'Durée', sous: 'Durée prévue', tab: 3, construction: '+ durée',
      sens: 'Indique une durée envisagée au moment de la décision.',
      oral: 'Je pars à Québec pour trois jours.',
      ecrit: 'Le bail est signé pour un an.' },
    { fonction: 'Cause', sous: "Motif d'une action passée", tab: 4, construction: '+ inf. passé',
      sens: "Donne la raison d'une sanction, d'une récompense, d'un reproche.",
      oral: 'Il a reçu une contravention pour avoir stationné au mauvais endroit.',
      ecrit: 'Elle a été récompensée pour avoir mené le projet à terme.' },
    { fonction: 'Attribution', sous: 'Destinataire, intérêt', tab: 2, construction: '+ nom',
      sens: 'Indique à qui ou à quoi une chose est destinée.',
      oral: "J'ai acheté un cadeau pour ma voisine.",
      ecrit: 'Ce guide est destiné aux personnes pour qui le français est une langue seconde.' }
  ],
  ukrainien: 'щоб (but) ; на (durée prévue : на три дні) ; за те, що (cause) ; для (destinataire)',
  nuance: "*Pour* + infinitif si le sujet reste le même ; *pour que* + subjonctif si le sujet change (onglet 6, Points grammaticaux).",
  piege: "*Pour* + durée exprime une durée prévue, non une durée accomplie : *J'ai étudié le français pour deux ans* ✗ → *pendant deux ans*.",
  varianteQC: "Sous l'influence de l'anglais *for*, *pour* + durée accomplie s'entend parfois à l'oral ; en français standard, on dit *pendant*.",
  associees: ['pour que', 'afin de', 'pendant', 'à cause de', 'pour qui']
});
