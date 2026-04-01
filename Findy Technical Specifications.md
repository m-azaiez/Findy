# Cahier des charges technique — Findy

## 1. Objectif du produit

**Findy** est une application web/mobile-first de découverte de lieux, inspirée des usages de Tripadvisor, Google Maps et Pinterest.

Le MVP doit permettre à un utilisateur de :

- rechercher des lieux
- consulter une fiche lieu détaillée
- filtrer les résultats
- enregistrer des favoris
- publier des avis et notes
- créer une expérience fluide, visuelle et simple

L’objectif n’est pas de refaire Tripadvisor complet, mais de sortir une **v1 propre, rapide, crédible**.

---

## 2. Périmètre MVP

### 2.1 Fonctionnalités incluses

#### Authentification
- inscription par email/mot de passe
- connexion
- déconnexion
- reset mot de passe
- profil utilisateur simple

#### Recherche de lieux
- recherche par mot-clé
- recherche par ville ou zone
- liste des résultats
- tri par pertinence / note / popularité

#### Filtres
- catégorie
- note minimale
- prix
- distance
- ouvert maintenant
- tags

#### Fiche lieu
- nom
- description
- adresse
- photos
- note moyenne
- horaires
- catégories / tags
- avis utilisateurs
- bouton favori

#### Avis
- noter un lieu
- laisser un commentaire
- modifier ou supprimer son propre avis
- calcul de moyenne des notes

#### Favoris
- ajouter un lieu en favori
- retirer un favori
- afficher la liste des favoris du user connecté

#### Admin minimal
- créer / modifier / supprimer un lieu
- modérer un avis
- gérer les catégories

### 2.2 Hors MVP

À ne pas faire au début :

- chat
- recommandations IA complexes
- réservation native
- gamification
- système social avancé
- multi-langue complet
- notifications push avancées
- app mobile native
- back-office complexe

---

## 3. Utilisateurs et rôles

### 3.1 Visiteur
- consulter la home
- rechercher
- voir les fiches lieux
- lire les avis

### 3.2 Utilisateur connecté
- gérer son profil
- publier un avis
- enregistrer des favoris
- modifier ses contenus

### 3.3 Admin
- gérer lieux
- gérer catégories
- modérer les avis

---

## 4. Stack technique recommandée

### 4.1 Frontend
- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** pour composants
- **React Query / TanStack Query** pour cache et data fetching
- **Zod** pour validation
- **React Hook Form** pour formulaires

### 4.2 Backend
Option simple et réaliste :

- **Supabase**
  - Auth
  - PostgreSQL
  - Storage
  - Row Level Security
  - fonctions SQL si nécessaire

Pourquoi :
- rapide à lancer
- auth déjà prête
- DB relationnelle solide
- bon compromis pour solo dev

### 4.3 Cartographie / géolocalisation
- **Mapbox** ou **Google Maps**
- Mapbox conseillé au départ pour flexibilité UI

### 4.4 Images
- stockage Supabase Storage au début
- ou Cloudinary si besoin d’optimisation forte

### 4.5 Déploiement
- **Vercel** pour frontend
- **Supabase cloud** pour backend/db
- monitoring simple avec Sentry

---

## 5. Architecture globale

### 5.1 Architecture logique

#### Frontend
- pages Next.js
- composants UI
- hooks métiers
- services API
- state local léger

#### Backend
- Supabase Auth
- base PostgreSQL
- policies RLS
- API server actions ou routes Next.js si besoin
- storage images

#### Données externes
- API de géocodage
- API maps
- éventuellement import de lieux plus tard

---

## 6. Arborescence projet recommandée

```txt
findy/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── search/
│   │   └── places/[slug]/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── dashboard/
│   │   ├── favorites/
│   │   ├── reviews/
│   │   └── profile/
│   ├── admin/
│   │   ├── places/
│   │   ├── categories/
│   │   └── reviews/
│   └── api/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── places/
│   ├── reviews/
│   └── filters/
├── lib/
│   ├── supabase/
│   ├── utils/
│   ├── validations/
│   └── constants/
├── services/
│   ├── places.service.ts
│   ├── reviews.service.ts
│   ├── favorites.service.ts
│   └── auth.service.ts
├── hooks/
├── types/
├── public/
├── supabase/
│   ├── migrations/
│   ├── seeds/
│   └── policies/
└── tests/
```

---

## 7. Modèle de données

### 7.1 Tables principales

#### users
Stocke les infos de profil utilisateur.

```sql
users
- id (uuid, pk)
- auth_user_id (uuid, unique)
- username
- full_name
- avatar_url
- bio
- role (user | admin)
- created_at
- updated_at
```

#### places
Référence les lieux.

```sql
places
- id (uuid, pk)
- slug
- name
- description
- address
- city
- country
- latitude
- longitude
- price_range
- phone
- website
- cover_image_url
- status (draft | published)
- created_by
- created_at
- updated_at
```

#### categories
Catégories principales.

```sql
categories
- id (uuid, pk)
- name
- slug
- icon
- created_at
```

#### place_categories
Relation many-to-many.

```sql
place_categories
- id (uuid, pk)
- place_id
- category_id
```

#### place_images
Galerie d’images.

```sql
place_images
- id (uuid, pk)
- place_id
- image_url
- alt_text
- position
- created_at
```

#### reviews
Avis utilisateurs.

```sql
reviews
- id (uuid, pk)
- place_id
- user_id
- rating (int, 1..5)
- title
- content
- status (published | hidden | flagged)
- created_at
- updated_at
```

#### favorites
Favoris utilisateur.

```sql
favorites
- id (uuid, pk)
- user_id
- place_id
- created_at
```

#### opening_hours
Horaires d’ouverture.

```sql
opening_hours
- id (uuid, pk)
- place_id
- day_of_week
- opens_at
- closes_at
- is_closed
```

#### tags
Tags libres ou contrôlés.

```sql
tags
- id (uuid, pk)
- name
- slug
```

#### place_tags
Relation many-to-many.

```sql
place_tags
- id (uuid, pk)
- place_id
- tag_id
```

---

## 8. Contraintes métier

### 8.1 Règles fonctionnelles
- un utilisateur ne peut publier qu’un avis par lieu
- un utilisateur ne peut modifier que ses propres avis
- seuls les admins peuvent créer/modifier/supprimer des lieux depuis l’admin
- les lieux non publiés ne sont pas visibles publiquement
- la note moyenne d’un lieu doit être recalculée après ajout/modif/suppression d’avis
- un favori doit être unique par couple `(user_id, place_id)`

### 8.2 Règles de validation
- nom du lieu obligatoire
- slug unique
- rating entre 1 et 5
- email valide
- mot de passe avec longueur minimale
- commentaire d’avis limité en taille

---

## 9. API / services à prévoir

Avec Next.js + Supabase, tu peux faire une partie en accès direct Supabase côté client sécurisé + certaines routes serveur.

### 9.1 Endpoints logiques

#### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/reset-password`

#### Places
- `GET /places`
- `GET /places/:slug`
- `POST /places` admin
- `PATCH /places/:id` admin
- `DELETE /places/:id` admin

#### Reviews
- `GET /places/:id/reviews`
- `POST /places/:id/reviews`
- `PATCH /reviews/:id`
- `DELETE /reviews/:id`

#### Favorites
- `GET /me/favorites`
- `POST /favorites`
- `DELETE /favorites/:id`

#### Categories / tags
- `GET /categories`
- `GET /tags`

---

## 10. Écrans à développer

### Public
- Home
- Page résultats de recherche
- Fiche lieu
- Login
- Register

### User connecté
- Mon profil
- Mes favoris
- Mes avis

### Admin
- Liste des lieux
- Création / édition d’un lieu
- Liste des avis
- Gestion des catégories

---

## 11. UX minimale attendue

- design mobile-first
- temps de chargement perçu rapide
- boutons CTA visibles
- filtres simples
- carte non bloquante
- recherche accessible dès la home
- fiche lieu très visuelle
- formulaire d’avis très court
- navigation claire

---

## 12. Sécurité

### 12.1 Auth / accès
- auth gérée par Supabase
- routes protégées côté serveur et middleware
- RLS activée sur tables sensibles
- rôle admin vérifié côté backend

### 12.2 Données
- sanitation des inputs
- validation Zod
- protection contre duplicate submit
- limitation taille images
- logs des actions admin si possible

### 12.3 Permissions
- user : accès à ses données
- admin : accès CRUD admin
- public : lecture seules données publiées

---

## 13. Performance

- pagination des résultats
- lazy loading des images
- génération statique si utile sur pages publiques
- cache des requêtes
- index DB sur :
  - slug
  - city
  - category
  - place_id
  - user_id
  - created_at

---

## 14. SEO minimal

Important si l’app doit être découvrable.

- title unique par page
- meta description
- URLs propres via slug
- Open Graph de base
- schema markup possible plus tard
- pages lieux indexables

---

## 15. Observabilité et qualité

### 15.1 Logs / monitoring
- Sentry pour erreurs front/back
- logs serveur simples
- suivi des erreurs API

### 15.2 Tests
Minimum raisonnable :
- tests unitaires utilitaires
- tests d’intégration sur services critiques
- tests e2e sur flows majeurs :
  - login
  - recherche
  - ajout favori
  - publication avis

Outils :
- Vitest
- Playwright

---

## 16. Plan de développement réaliste

### Sprint 0 — Setup
- repo Git
- Next.js + Tailwind + TypeScript
- Supabase projet
- auth branchée
- structure dossier
- design system de base

### Sprint 1 — Data model + auth
- tables SQL
- migrations
- policies RLS
- login/register/logout
- profil user simple

### Sprint 2 — Places
- création table places + categories
- seed de données
- page listing
- page détail lieu
- moteur recherche simple

### Sprint 3 — Reviews + favorites
- CRUD avis
- calcul note moyenne
- favoris
- dashboard user

### Sprint 4 — Filtres + polish
- filtres avancés
- tri
- UX mobile
- perf
- erreurs / states vides

### Sprint 5 — Admin + déploiement
- panel admin minimal
- CRUD lieux
- modération avis
- déploiement Vercel
- QA finale

---

## 17. Priorités absolues

Ordre conseillé si tu codes seul :

1. auth
2. base de données propre
3. listing lieux
4. page détail lieu
5. avis
6. favoris
7. filtres
8. admin
9. optimisation

---

## 18. Dette technique à accepter au début

Pour aller vite, tu peux accepter :

- pas de microservices
- pas de back-office sophistiqué
- pas de moteur de recommandation avancé
- pas de recherche ultra complexe
- pas d’upload média complexe avec traitement lourd
- pas de multi-tenant

Le but est de lancer une base saine, pas une usine.

---

## 19. Définition de “Done” du MVP

Le MVP est considéré prêt quand :

- un utilisateur peut créer un compte
- rechercher des lieux
- voir une fiche lieu complète
- filtrer les résultats
- ajouter des favoris
- poster un avis
- l’admin peut gérer les lieux
- l’application est déployée et utilisable publiquement

---

## 20. Recommandation réaliste si tu es seul

Je te conseille ce combo :

- **Next.js**
- **Supabase**
- **Tailwind**
- **shadcn/ui**
- **Mapbox**
- **Vercel**

C’est le meilleur compromis entre :
- vitesse de build
- simplicité
- coût
- maintenabilité
- compatibilité avec un assistant de code comme Codex

---

## 21. Suite logique pour Codex

La meilleure prochaine étape est de produire ensuite :

- l’arborescence finale complète
- le schéma SQL prêt à exécuter
- les routes API détaillées
- les types TypeScript
- l’ordre exact des prompts à donner à Codex pour construire Findy étape par étape
