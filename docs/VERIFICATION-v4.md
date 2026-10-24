# Archive — contrôles de la version fondue

# Vérification de la hero — 24 octobre 2026

## Contrôles effectués

Contrôle visuel dans Chrome sur l’aperçu de développement : fenêtre de bureau de 1363 × 936 px, et cadres de 390 × 844 et 360 × 780 px. Les cadres mobiles vérifient la mise en page responsive ; ce ne sont pas des essais sur des téléphones physiques.

- Premier plan des falaises, ouverture en deux panneaux et apparition de la photographie originale du chalet.
- Approche, escalier et arrivée sur la terrasse aux différents repères de la progression.
- Prise du pain, piquage, passage du pain à la fourchette, immersion, brassage, remontée avec fromage et gros plan final.
- Retour du gros plan à la prise de pain par un véritable défilement inverse.
- Cadrage portrait dédié à la fondue et maintien du poignet dans le cadre pendant le brassage. Inclinaison finale de référence : −60° sur mobile, −38° sur ordinateur.
- Mode réduit statique, navigation par étapes et changement de langue FR → DE.
- Panneau d’information, ouverture de la galerie depuis ce panneau et retour du focus à son déclencheur après fermeture de la galerie.
- Absence de débordement horizontal dans le cadre mobile de 390 px : largeur du document égale à sa largeur visible.
- Tous les assets référencés, y compris la version précédente, sont présents et non vides. `git diff --check` ne signale aucune erreur d’espacement.

Les erreurs récentes observées dans la console concernaient le script de l’extension du navigateur, sans erreur applicative visible dans cet échantillon. Aucun chiffre de fréquence d’images ou résultat de performance sur appareil physique n’est revendiqué.

## Captures

- `hero-fondue-hands.jpg` : transfert du pain vers la fourchette sur ordinateur.
- `hero-fondue-final.jpg` : gros plan final sur ordinateur.
- `hero-mobile-check.jpg` : dernier plan à 390 et 360 px et mode réduit en allemand.
- `hero-opening.jpg` : premier plan des falaises.

Les photographies générées servent à cette proposition d’animation ; les quatre photos originales sont conservées sans modification dans la galerie.
