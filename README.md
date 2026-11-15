# Les cadres de la phrase et de la conversation

Site d'apprentissage : construire, relier et développer ses idées en français — français standard et usages québécois. Les expressions sont classées par **fonction communicative** (12 onglets, 4 modules), pas par catégorie grammaticale.

Site statique, sans étape de compilation ni dépendance : il fonctionne sur GitHub Pages et en ouvrant `index.html` directement dans un navigateur.

## Fonctionnalités

- **12 onglets** rendus depuis le contenu, avec badges de registre (`[C]`, `[O]`, `[QC]`, `[F-QC]`, `[S]`, `[R]`, `[D]`) et notations de construction (`+ ind.`, `+ subj.`…) dessinées comme des cases à remplir. Un clic sur une notation de mode ouvre la règle correspondante.
- **Filtres de registre** : masquer le familier, le soutenu, le déconseillé… (mémorisé dans le navigateur).
- **Recherche** globale, sans accents obligatoires (touche `/`).
- **Renvois automatiques** (`↔ n`) : une expression présente dans plusieurs sections renvoie à ses autres emplois.
- **Fiches d'expression** pour les dix expressions à plusieurs fonctions (alors que, comme, fait que, mettons…).
- **Activités en 9 étapes** dans chaque onglet, générées à partir du contenu : quiz « quelle intention ? », quiz « quel mode ? », tirages de consignes, enchaînements, minuterie pour l'activité orale.
- **Règles transversales** accessibles depuis toutes les pages (bouton « Règles »).
- Pages *Mode d'emploi*, *Relier les onglets*, *Fiches*, *Règles*, *Méthode et progression*.
- Thème clair/sombre, mise en page mobile.

## Modifier le contenu

Chaque onglet est un fichier `content/onglet-NN.js` contenant du Markdown :

```
## 4.1. Donner une raison directement      ← section numérotée
- parce que + ind. ;                        ← expression (le « ; » final est retiré à l'affichage)
- car + ind. [S] ;                          ← [S] devient un badge de registre

### Français parlé au Québec                ← sous-bloc (style québécois si le titre contient « Québec »)

## Distinctions essentielles                ← section non numérotée = encadré (distinction, piège, usage…)
## Activité orale                           ← reprise dans l'étape 6 des activités
```

- Tableaux Markdown : dans les colonnes dont l'en-tête contient *Expression*, *Variante*, *Français*, *Construction*, *Pronom*, *Formes*, *Usages* ou *Registre*, chaque élément séparé par `;` devient une expression filtrable et cherchable.
- Les fiches se trouvent dans `content/fiches.js` ; les modèles de discours (section III) dans `content/relier.js` ; modules, registres et enchaînements dans `content/meta.js`.

## Structure

```
index.html            accueil : les deux outils et la progression
reference/index.html  référence complète (12 onglets, routage par #ancre)
prototypes/           outils (Découvrir, Atelier de ponts), feuille maîtresse, autres prototypes
assets/app.js         moteur : rendu, filtres, recherche, renvois, activités
assets/styles.css     thèmes et mise en page
assets/registry.js    registre du contenu
content/              contenu (onglets, pages, fiches, modèles)
```

## Publication

GitHub Pages : *Settings → Pages → Build and deployment → Deploy from a branch*, choisir la branche et le dossier `/ (root)`.
