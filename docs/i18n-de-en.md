# Traductions allemand de Suisse et anglais britannique

## Livrables

- `src/i18n/de.json` : allemand de Suisse, vouvoiement avec **Sie**, orthographe sans **ß**.
- `src/i18n/en.json` : anglais britannique.
- Chaque fichier contient **1 380 entrées** : les **1 069 chaînes statiques** et les **311 chaînes runtime** du catalogue figé.

Les huit pages, le SEO, les textes alternatifs, les libellés accessibles, les formulaires, le calendrier, le concierge, les e-mails préparés, les états de réservation et les surprises interactives sont couverts. Aucun HTML, runtime ou comportement applicatif n’a été modifié dans cette tâche.

## Choix de rédaction

Le ton reste chaleureux, direct et évocateur d’un séjour au chalet. Les appels à l’action sont courts. Les fragments de titres ont été traduits ensemble pour conserver une phrase naturelle une fois réunis. Exemples : « Die Schweiz, wie aus Ihren Träumen. », « Unsere Zimmer warten auf Sie », « Mit der Familie in die Berge. », « Rooms waiting for you ».

Le carnet d’idées sauvegardées devient **Meine Merkliste** / **My saved ideas**, pour rendre immédiatement compréhensible sa fonction. Le vocabulaire de l’hôtellerie reste cohérent entre les pages, les options de formulaire et les réponses du concierge : **Superior-Doppelzimmer**, **Superior-Familienzimmer**, **Economy-Einzelzimmer** ; **Superior Double**, **Superior Family**, **Economy Single**.

La carte utilise un vocabulaire suisse en allemand : **Poulet, Peperoni, Egli, Rahm, grilliert**. L’anglais utilise notamment **chips, rocket, on draught, cot, enquiries, travellers**. Les sous-libellés allemands de la carte sont également traduits en anglais. Les noms propres, marques et appellations de vins sont conservés ; les salutations suisses « Grüezi » et « En Guete » gardent leur couleur locale.

Les petites blagues ont été adaptées au sens et à l’animation : « High paw! », « This burger has a spring in its bun. », « The Alps through rosé-tinted glasses. », « Eine Umarmung zum Trinken. » Les libellés accessibles décrivent toujours l’action et signalent les effets sonores.

Les heures sont localisées sans changer les horaires : par exemple 7h30–10h devient **7.30–10.00 Uhr** / **7.30–10am**, et 12h–20h devient **12–20 Uhr** / **noon–8pm**. Les e-mails préparés comportent des retours à la ligne pour rester lisibles dans la messagerie.

## Données conservées

- **25 chambres, 8 catégories**, conformément au catalogue actuel.
- Familiale : **27 m², 5 personnes** ; le détail des lits reste inchangé.
- Familiale Supérieure : **29 m², 4 adultes maximum, 6 couchages**. La limite de quatre adultes n’est jamais transformée en capacité de six adultes.
- Horaires, tarifs, âges, superficies, capacités, distances, altitudes, dates et coordonnées du catalogue sont conservés, avec uniquement leur format localisé.
- Aucun renseignement touristique, offre ou service supplémentaire n’a été inventé. Cette tâche traduit les données source ; elle ne constitue pas une nouvelle vérification de ces données.

## Vérifications effectuées

- Lecture JSON valide des deux livrables.
- Couverture exacte : **1 380 / 1 380 IDs** par langue, sans clé manquante ni clé surnuméraire.
- Aucune valeur vide ou de type incorrect.
- Correspondance exacte des placeholders, y compris leurs répétitions, pour les **38 entrées qui en contiennent** : `{count}`, `{arrival}`, `{departure}`, `{room}`, `{guests}`, `{0}`, etc.
- Aucun **ß** dans le catalogue allemand.
- Contrôle des fragments de titres et des principales capacités de chambres.
- `git diff --check` sans erreur pour les fichiers de traduction.

Références des catalogues source utilisés :

- `source-static.json` : SHA-256 `c720d8386c2041f56afcd21ac79b3e09b4681873f09a91e103845e3afb4ef3d0`.
- `source-runtime.json` : SHA-256 `9d638e08dfd84768774bb76f5cfa37650e419818e5a453152bdf27b91e6201e1`.

## Points à vérifier lors de l’intégration

1. Le titre décoratif **Notre restaurant** se trouve dans l’image `public/assets/collage/restaurant-lettering.webp`. Son texte alternatif et l’action de son Easter egg sont traduits, mais les lettres dans le raster restent françaises. Prévoir un titre HTML localisé ou un asset adapté si toute inscription visible doit changer de langue.
2. L’ancien format runtime `{0} idée{1} {2}` conserve tous ses placeholders. Pour le pluriel allemand, il faut utiliser les messages `stay.ideas.one/other` et `stay.savedIdeas.one/other`, qui donnent bien **Idee / Ideen**. `src/experience.js` utilise déjà ce chemin de pluriel ; il ne faut pas réintroduire un suffixe français `s` dans le texte allemand.
3. Le contrôle du rendu responsive, des retours à la ligne et des chaînes dans les parcours réels revient à l’intégration ; aucun navigateur, build ou déploiement n’a été lancé dans cette tâche.
