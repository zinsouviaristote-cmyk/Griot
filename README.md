# Griot

SaaS de chansons personnalisées par IA pour l'Afrique de l'Ouest francophone :
on raconte une histoire, on écoute l'extrait gratuitement, on paie par Mobile
Money pour débloquer le MP3.

## Démarrer en local

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

Ajoutez `?vide=1` à l'URL du tableau de bord pour prévisualiser l'état d'un
tout nouvel utilisateur (aucune chanson, aucun crédit).

## Scripts

| Commande | Effet |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run lint` | ESLint |
| `npm run typecheck` | Vérification TypeScript stricte, sans émission |

## État actuel du projet

Phase 1 du plan d'implémentation, en cours : tableau de bord et navigation
construits sur des **données fictives** (`lib/data/mock-dashboard.ts`) —
aucune base de données, aucune authentification, aucun appel au moteur
musical pour l'instant. Ce module est isolé pour être remplacé sans toucher
aux composants lorsque Supabase arrive (Phase 2 du plan).

## Variables d'environnement

Aucune requise à ce stade. La liste complète des variables à venir
(Supabase, moteur musical, paiement Mobile Money, SMS/WhatsApp) est
documentée dans le plan d'implémentation, section « Gestion des secrets et
environnements » — elles seront introduites au fil des phases, jamais
committées.

## Design

Le système de tokens (couleurs, typographie, rayons, dégradés) vit dans
`tailwind.config.ts` — aucune valeur codée en dur dans les composants. Voir
`INSTRUCTIONS-DESIGN-SAAS.md` pour les règles de design suivies sur ce
projet.
