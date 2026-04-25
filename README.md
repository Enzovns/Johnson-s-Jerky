# 🤠 Johnson's Jerky — E-Commerce Site

Premium beef jerky & biltong shop. Far West texan × Outback australien.
Built with **Next.js 14 + TypeScript + Tailwind CSS + Supabase + Stripe**.

---

## Stack technique

| Technologie | Rôle |
|---|---|
| **Next.js 14** (App Router) | Framework React, SSR, routing |
| **TypeScript** | Types, maintenabilité |
| **Tailwind CSS** | Styles utilitaires + thème western |
| **Supabase** | PostgreSQL + Auth + Storage |
| **Stripe Checkout** | Paiements sécurisés (hébergé par Stripe) |
| **Vercel** | Déploiement recommandé |

---

## Installation rapide

```bash
# 1. Cloner le repo
git clone <url-du-repo>
cd johnsons-jerky

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Remplir les valeurs dans .env.local (voir section Variables d'env ci-dessous)

# 4. Lancer en développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## Variables d'environnement

Copier `.env.example` en `.env.local` et remplir :

```env
# Supabase (trouvées dans Project Settings > API)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe (Dashboard > Developers > API Keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Configuration Supabase

### 1. Créer un projet Supabase

1. Aller sur [supabase.com](https://supabase.com) → New Project
2. Noter l'URL et les clés API (Project Settings > API)

### 2. Lancer la migration SQL

1. Dans le Dashboard Supabase : **SQL Editor** → **New Query**
2. Copier-coller le contenu de `supabase/migrations/001_initial.sql`
3. Cliquer **Run**

Cela crée toutes les tables, active RLS, seed les produits exemples et les tarifs de livraison.

### 3. Créer le compte admin

Dans le SQL Editor Supabase, aller dans **Authentication > Users** :

1. Cliquer **+ Add user**
2. Renseigner email et mot de passe
3. Ce compte est le seul qui peut accéder à `/admin`

> **Sécurité** : il n'y a pas d'inscription publique. Pour changer le mot de passe : Authentication > Users > Edit.

---

## Configuration Stripe

### 1. Récupérer les clés API

Dashboard Stripe → **Developers** → **API Keys**
- Copier la **Publishable key** (`pk_test_...`) → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Copier la **Secret key** (`sk_test_...`) → `STRIPE_SECRET_KEY`

### 2. Configurer le webhook

Pour que le statut de commande soit mis à jour après paiement :

**En développement (local) :**
```bash
# Installer la CLI Stripe
npm install -g stripe

# Écouter les webhooks en local
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copier le webhook secret affiché (whsec_...) → STRIPE_WEBHOOK_SECRET
```

**En production (Vercel) :**
1. Stripe Dashboard → **Developers** → **Webhooks** → **Add endpoint**
2. URL : `https://votre-domaine.vercel.app/api/webhooks/stripe`
3. Événements à écouter :
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.payment_failed`
4. Copier le **Signing secret** → `STRIPE_WEBHOOK_SECRET`

---

## Lancer en développement

```bash
npm run dev
```

- Site public : [http://localhost:3000](http://localhost:3000)
- Admin : [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Déploiement sur Vercel (recommandé)

```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer
vercel
```

Ou connecter le repo GitHub directement dans le dashboard Vercel.

**Variables d'environnement sur Vercel :**
Aller dans le projet Vercel → **Settings** → **Environment Variables** → ajouter toutes les variables de `.env.local` (sauf `NEXT_PUBLIC_APP_URL` qui sera l'URL de production).

---

## Structure des fichiers

```
/
├── app/
│   ├── (public)/              # Routes publiques
│   │   ├── page.tsx           # Home
│   │   ├── products/          # Catalogue + page produit
│   │   ├── cart/              # Panier
│   │   ├── checkout/          # Formulaire de commande
│   │   └── confirmation/      # Confirmation après paiement
│   ├── admin/                 # Dashboard admin (protégé)
│   │   ├── login/             # Connexion admin
│   │   ├── products/          # CRUD produits
│   │   ├── orders/            # Tableau des commandes
│   │   └── settings/          # Frais de livraison + contenu
│   └── api/
│       ├── checkout/          # Création session Stripe
│       ├── shipping-rates/    # Tarifs de livraison
│       └── webhooks/stripe/   # Webhook Stripe
├── components/
│   ├── ui/                    # Button, Input, Badge
│   ├── decorations/           # SVG western (kangaroo, headframe, guitare, étoile)
│   ├── layout/                # Header, Footer, AdminNav
│   ├── cart/                  # CartProvider (localStorage)
│   └── products/              # AddToCartButton, QuantitySelector
├── lib/
│   ├── supabase/              # Clients Supabase (browser, server, admin)
│   ├── stripe/                # Client Stripe
│   └── utils/                 # Formatage, validation postcodes
├── public/
│   └── logo.png               # ← REMPLACER par le vrai logo
├── supabase/
│   └── migrations/
│       └── 001_initial.sql    # Schéma complet + seed
└── .env.example               # Variables d'environnement à configurer
```

---

## Remplacer le logo

1. Créer un logo au format PNG (transparent de préférence), taille recommandée 200×200px
2. Remplacer `public/logo.png` par votre fichier
3. Les `<!-- LOGO PLACEHOLDER -->` dans le code sont dans `components/layout/Header.tsx`

---

## Zone de livraison (postcodes)

Par défaut, les commandes sont acceptées pour les codes postaux :

| Postcode | Localité |
|---|---|
| 6430 | Kalgoorlie |
| 6431 | Boulder |
| 6432 | Kambalda |
| 6433 | Norseman |
| 6434 | Widgiemooltha |
| 6435 | Coolgardie |
| 6436 | Leonora |
| 6437 | Laverton |
| 6438 | Leinster |

Pour modifier la zone : `lib/utils/postcodes.ts`

---

## Palette de couleurs

| Nom | Hex | Usage |
|---|---|---|
| Terra cotta | `#B85C38` | Boutons principaux, accents |
| Dark terra | `#8B3A1F` | Ombres, bordures |
| Sand | `#E8D5B7` | Textes clairs |
| Parchment | `#F5E6D3` | Fond cartes produits |
| Leather | `#3E2723` | Header, footer, fond sombre |
| Dark leather | `#5D4037` | Nuances cuir |
| Gold | `#C9A961` | Titres, accents western |
| Charcoal | `#1A1A1A` | Textes principaux |

---

## Fonts Google

- **Titres** : [Rye](https://fonts.google.com/specimen/Rye) — style western/wanted poster
- **Corps** : [Special Elite](https://fonts.google.com/specimen/Special+Elite) — machine à écrire rustique

Chargées via `next/font/google` dans `app/layout.tsx` (pas d'impact sur les performances).

---

## Questions fréquentes

**Comment changer le prix d'un produit ?**
Admin → Products → Edit → modifier le prix → Save.

**Comment changer les frais de livraison ?**
Admin → Settings → Shipping Rates → modifier → Save.

**Comment voir les commandes ?**
Admin → Orders → tableau complet avec statuts.

**Comment marquer une commande comme expédiée ?**
Admin → Orders → bouton "Mark Shipped" sur la ligne de commande.

**Stripe prend combien ?**
En mode test (`pk_test_...`), les paiements sont fictifs. Passer en mode live nécessite de créer un compte Stripe vérifié et de remplacer les clés test par les clés live.

---

*Built with ❤️ for Johnson's Jerky, Kalgoorlie WA*
