# Johnson's Jerky — E-Commerce Site

Premium beef jerky & biltong from Kalgoorlie, WA. Built with Next.js 14 + Airtable as the product CMS.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS (custom western/outback theme)
- **Product CMS:** Airtable (owner manages products without touching code)
- **Payments:** Stripe Payment Links (one link per product, set in Airtable)
- **Hosting:** Vercel

---

## Airtable Setup

### 1. Create an Airtable account

Go to [airtable.com](https://airtable.com) and sign up for a free account.

### 2. Create a new Base

- Click **Add a base** → **Start from scratch**
- Name it something like `Johnsons Jerky`

### 3. Create the Products table

Inside your base, rename the default table to `Products` (must match `AIRTABLE_PRODUCTS_TABLE` exactly).

Add these columns with **exactly** these field names:

| Field name             | Field type          | Notes                                              |
|------------------------|---------------------|----------------------------------------------------|
| `name`                 | Single line text    | Product name                                       |
| `description`          | Long text           | Product description                                |
| `price`                | Number (decimal)    | Price in **dollars** (e.g. `18.00` for $18)        |
| `image`                | Attachment          | Upload product photo — first attachment is used    |
| `category`             | Single line text    | e.g. `Jerky`, `Biltong`                            |
| `available`            | Checkbox            | Unchecked = sold out / hidden from buy button      |
| `stripe_payment_link`  | URL                 | Stripe Payment Link URL for this product           |

> Field names are **case-sensitive**. Use lowercase with underscores exactly as shown.

### 4. Add your products

Click **+** to add a row for each product. Fill in all fields. For `image`, click the cell and upload a photo.

### 5. Get your API credentials

**Personal Access Token:**
1. Go to [airtable.com/create/tokens](https://airtable.com/create/tokens)
2. Click **Create new token**
3. Name: `johnsons-jerky-site`
4. Scopes: add `data.records:read`
5. Access: select your base → **Add a base**
6. Click **Create token** and copy it

**Base ID:**
- Open your base in the browser
- The URL looks like `https://airtable.com/appXXXXXXXXXXXXXX/...`
- Copy the `appXXXXXXXXXXXXXX` part

---

## Stripe Payment Links Setup

For each product, create a Stripe Payment Link:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Payment Links**
2. Click **New** → select or create the product → set the price
3. Copy the generated URL (e.g. `https://buy.stripe.com/XXXXXXXX`)
4. Paste it into the `stripe_payment_link` field in Airtable for that product

When a customer clicks "Order Now", they go directly to that Stripe-hosted payment page.

---

## Managing Products (Owner Guide)

Everything is done in Airtable — no code changes needed.

| Task | What to do |
|------|-----------|
| **Add a product** | Click `+` at the bottom of the Products table, fill in all fields |
| **Edit name/price/description** | Click the cell and type |
| **Change photo** | Click the image cell → remove old → upload new |
| **Mark as sold out** | Uncheck the `available` checkbox |
| **Bring back in stock** | Check the `available` checkbox |
| **Remove from site** | Uncheck `available` or delete the row |
| **Update buy link** | Paste new Stripe Payment Link into `stripe_payment_link` |

Changes appear on the website within **60 seconds** (the site caches Airtable data for 1 minute).

---

## Environment Variables

### Local development

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in:

```env
AIRTABLE_API_KEY=patXXXXXXXXXXXXXX.XXXXXXXX...
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_PRODUCTS_TABLE=Products
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Vercel (production)

In your Vercel project → **Settings** → **Environment Variables**, add:

| Variable | Value |
|----------|-------|
| `AIRTABLE_API_KEY` | Your personal access token |
| `AIRTABLE_BASE_ID` | Your base ID (`appXXXX...`) |
| `AIRTABLE_PRODUCTS_TABLE` | `Products` (or your table name) |
| `NEXT_PUBLIC_APP_URL` | Your production URL e.g. `https://johnsonsjerkykalgoorlie.com.au` |

> `AIRTABLE_API_KEY` is a **server-only** variable (no `NEXT_PUBLIC_` prefix) — it is never exposed to the browser.

---

## Local Development

```bash
npm install
cp .env.example .env.local
# fill in .env.local with real Airtable credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploying to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo
3. Add all environment variables (see table above)
4. Click **Deploy**

Every `git push` to `main` triggers an automatic redeploy.

---

## How the Site Works

```
Airtable (products CMS)
        ↓  every 60 seconds
/api/products  (server-side API route — key never reaches browser)
        ↓
Homepage + /products pages  (Next.js server components)
        ↓  "Order Now" button
Stripe Payment Link  (Stripe-hosted checkout)
```

The Airtable API key lives only on the server. Pages cache product data for 60 seconds (`revalidate: 60`) so changes propagate quickly without hammering the Airtable API.
