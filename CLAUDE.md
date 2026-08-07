Contexte permanent du projet Griot.

**Ce qu'est le produit.** Un site où quelqu'un raconte une histoire personnelle et reçoit une chanson chantée à offrir — anniversaire, amour, mariage, réussite, hommage. La promesse centrale est « Écoutez votre chanson avant de payer ». Le public est ouest-africain francophone, sur Android d'entrée de gamme, en 3G, avec des données payées au mégaoctet.

**Ce que le produit n'est PAS.** Ce n'est pas un studio de production musicale. Il n'y a ni remix, ni boucles, ni changement de style, ni mode instrumental, ni transformation de voix. Si une maquette d'inspiration contient ces fonctions, **ignore-les** : on reprend l'habillage visuel, jamais le contenu fonctionnel.

**Le nom et la marque.** Le produit s'appelle **Griot**. Dans l'en-tête : l'icône à gauche, le mot « Griot » à côté. **Aucune signature du type « AI Music Studio »**, aucune mention de l'IA dans l'interface. On vend un cadeau, pas une technologie — annoncer la machine dévalue le présent.

**Trois interdits absolus**, qui priment sur toute maquette d'inspiration :
- Aucun dégradé sur un bouton, aucun texte en dégradé
- Aucun halo flou coloré, aucune « aura » radiale
- Pas de glassmorphism généralisé — un effet de verre au maximum sur **un** élément clé, jamais comme texture de fond

**La version mobile est construite et validée.** Barre de navigation basse avec bouton de création central, barre supérieure avec pastille de crédits, cartes empilées. **Ne la reconstruis pas, ne la refactorise pas.** Toute modification du design system ou du dashboard doit la laisser intacte — vérifie-le avant de conclure.

**Performance.** Budget de 150 Ko par page hors audio. `backdrop-filter` au maximum sur un élément par écran, jamais sur une liste. Aucune image photographique décorative. Animations uniquement sur `transform` et `opacity`. Respect de `prefers-reduced-motion`.

**Navigation desktop.** La barre latérale garde exactement ses entrées actuelles : Découvrir (Accueil, Explorer, Ma bibliothèque), Créer (Nouvelle chanson, Occasions, Styles), puis en bas la carte de crédits avec son bouton « Recharger », et l'aide.
