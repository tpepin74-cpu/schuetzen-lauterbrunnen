# Traductions : chinois simplifié, russe et coréen

## Livrables

- `src/i18n/zh.json` : chinois simplifié, 1 380 identifiants.
- `src/i18n/ru.json` : russe, 1 380 identifiants.
- `src/i18n/ko.json` : coréen, 1 380 identifiants.
- `src/i18n/ru-plurals.json` : 27 variantes russes complémentaires.

Chaque catalogue couvre les 1 069 entrées de `source-static.json` et les 311 entrées de `source-runtime.json`. Les valeurs sont rédigées pour un hôtel suisse : accueil chaleureux et professionnel, caractères chinois simplifiés, vouvoiement russe et coréen poli. Les titres répartis entre plusieurs éléments sont adaptés comme des ensembles ; les petites blagues des animations sont adaptées à la langue.

## Intégration des pluriels russes

Les catalogues principaux sont des objets `{ id: traduction }`. L’annexe russe est un objet `{ messageKey.category: traduction }`, à fusionner dans le dictionnaire de messages du runtime, **après** la conversion des identifiants en clés de messages.

Les formes `.one` viennent du catalogue principal. L’annexe apporte `.few`, `.many` et `.other` pour `guests.adults`, `guests.babies`, `guests.rooms`, `guests.people`, `stay.nights`, `age.years`, `availability.categories`, `stay.ideas` et `stay.savedIdeas`. Sélectionner la catégorie avec `Intl.PluralRules('ru')`. Les valeurs `.other` traitent aussi correctement les fractions, même si les champs du site utilisent des entiers.

Exemples : `1 ночь`, `2 ночи`, `5 ночей`, `21 ночь` ; `1 номер`, `3 номера`, `6 номеров` ; `1 год`, `2 года`, `5 лет`.

L’ancien fragment `se9cd239392` (`{0} idée{1} {2}`) est traduit avec les placeholders conservés. Son suffixe français `{1}` ne doit pas alimenter les interfaces localisées ; le rendu courant utilise les messages complets `stay.ideas` et `stay.savedIdeas`, comme confirmé par le responsable de l’intégration.

## Choix de traduction

- Les noms de marque, adresses postales, noms de vins et dénominations suisses des plats en seconde ligne restent identifiables. Les noms principaux des plats, ingrédients, régimes, catégories et descriptions d’images sont traduits.
- Les quantités, horaires, superficies, altitudes, tarifs et restrictions sont conservés. La Familiale reste à 5 personnes ; la Familiale Supérieure à 4 adultes maximum avec 6 couchages.
- Les messages électroniques utilisent de véritables retours à la ligne dans leurs valeurs JSON.
- Les libellés d’actions et d’accessibilité des surprises signalent le son lorsqu’il existe dans la source. Les options de réservation et de navigation gardent leur sens.
- Le petit billet du train utilise deux mots cohérents : `清新 / 山野`, `ГОРНЫЙ / ВОЗДУХ`, `상쾌한 / 자연`.
- Les déclarations de langues parlées par l’équipe demeurent allemand, anglais et français ; la traduction du site ne modifie pas ce fait.

## Vérifications

- JSON lisible et valide pour les trois catalogues.
- Exactement 1 380 entrées par langue ; aucun identifiant absent ou supplémentaire, aucune valeur vide.
- Multiensembles de placeholders strictement identiques aux sources pour chaque entrée.
- Aucun nombre factuel de la source omis après normalisation des séparateurs de milliers, décimales et heures.
- Aucun caractère japonais ou coréen accidentel dans le catalogue chinois.
- Les textes inchangés sont les marques, adresses, noms de plats locaux, unités ou gabarits sans mots.

Cette intervention ne modifie ni HTML, ni code d’intégration, ni mise en page. Les contrôles visuels des pages générées relèvent de l’intégration.
