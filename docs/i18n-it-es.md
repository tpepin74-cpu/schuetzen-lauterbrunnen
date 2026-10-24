# Italien et espagnol — catalogue complet

Vérification : 2026-10-24 16:05 UTC.

## Livrables

- `src/i18n/it.json` : italien, 1 380 entrées.
- `src/i18n/es.json` : espagnol, 1 380 entrées.
- Chaque objet utilise exactement les identifiants des 1 069 chaînes statiques et des 311 chaînes runtime.

## Vérifications effectuées

| Contrôle | Italien | Espagnol |
|---|---:|---:|
| Identifiants présents | 1380 | 1380 |
| Identifiants manquants | 0 | 0 |
| Valeurs vides | 0 | 0 |
| Identifiants inattendus | 0 | 0 |
| Chaînes à variables vérifiées | 38 | 38 |
| Erreurs de variables | 0 | 0 |

La lecture des huit titres H1 assemblés a été vérifiée contre les fragments HTML : accueil, chambres, restaurant, séjours, vallée, chalet, informations et réservation. Les descriptions, alternatives d’images, libellés accessibles, menus, filtres, réservation, calendrier, formulaire de groupe, concierge, carnet et surprises photographiques sont couverts. Les e-mails préremplis utilisent de vrais sauts de ligne.

## Choix éditoriaux

Le ton reste accueillant et lisible, avec des actions courtes. Le français « Concierge en ligne » devient « Concierge online » en italien et « Conserje en línea » en espagnol, de manière uniforme. Les jeux de mots des images ont été adaptés à chaque langue. Les accents et les caractères propres aux deux langues sont conservés.

Les marques, adresses, noms des villages, montagnes et appellations de vins sont conservés. Les petits sous-titres culinaires allemands déjà présents dans le menu restent en allemand : ils font partie du parti pris suisse du site. Les intitulés principaux, descriptions et suggestions de présentation sont traduits. Le nom de l’agence et `cerfalunettes.ch` ne changent pas.

Les huit catégories de chambres, surfaces, capacités, lits, horaires, montants et conditions sont conservés. La Familiale garde 5 personnes, la Familiale Superior un maximum de 4 adultes pour 6 couchages ; aucun retour de la catégorie Basic Randonneur. Les heures sont simplement mises au format local lisible, par exemple 7:30–10:00.

## Point d’intégration

La chaîne héritée `se9cd239392` (`{0} idée{1} {2}`) contient un suffixe de pluriel construit en français. Sa présence dans le catalogue préserve le contrat des variables, mais cette construction ne doit pas être utilisée en italien. Employer les quatre chaînes explicites de singularité/pluralité « idée(s) à découvrir » et « idée(s) dans votre carnet » (`s2b77aa7570`, `s2d2305566d`, `s6d7522bebc`, `s626aeb8d66`) : elles sont correctement traduites pour les deux langues.

Le rapport porte sur les catalogues et leur cohérence avec les sources. Les vérifications de mise en page dans le navigateur, de changement de langue et des parcours restent à faire par l’intégration centrale. Aucun HTML, CSS ou JS applicatif n’a été modifié pour cette traduction.
