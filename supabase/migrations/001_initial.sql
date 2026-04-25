-- ============================================================
-- JOHNSON'S JERKY — Migration SQL initiale
-- À coller dans Supabase : SQL Editor > New Query > Run
-- ============================================================

-- ---- Extensions ----
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists products (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  description text not null default '',
  price_cents integer not null check (price_cents > 0),
  stock       integer not null default 0 check (stock >= 0),
  image_url   text,
  featured    boolean not null default false,
  created_at  timestamptz not null default now()
);

create table if not exists orders (
  id                  uuid primary key default uuid_generate_v4(),
  customer_name       text not null,
  customer_email      text not null,
  customer_phone      text not null default '',
  shipping_address    text not null,
  postcode            text not null,
  suburb              text not null,
  state               text not null default 'WA',
  shipping_method     text not null check (shipping_method in ('standard', 'express')),
  shipping_cost_cents integer not null default 0,
  total_cents         integer not null check (total_cents > 0),
  stripe_session_id   text unique,
  payment_status      text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  fulfillment_status  text not null default 'pending' check (fulfillment_status in ('pending', 'processing', 'shipped', 'delivered')),
  created_at          timestamptz not null default now()
);

create table if not exists order_items (
  id                      uuid primary key default uuid_generate_v4(),
  order_id                uuid not null references orders(id) on delete cascade,
  product_id              uuid references products(id) on delete set null,
  quantity                integer not null check (quantity > 0),
  price_at_purchase_cents integer not null check (price_at_purchase_cents > 0),
  created_at              timestamptz not null default now()
);

create table if not exists shipping_rates (
  id             uuid primary key default uuid_generate_v4(),
  method_name    text not null unique check (method_name in ('standard', 'express')),
  price_cents    integer not null check (price_cents >= 0),
  estimated_days text not null
);

create table if not exists site_config (
  key        text primary key,
  value      text not null default '',
  updated_at timestamptz not null default now()
);

-- ============================================================
-- INDEX
-- ============================================================

create index if not exists idx_orders_email         on orders(customer_email);
create index if not exists idx_orders_status        on orders(payment_status);
create index if not exists idx_orders_created       on orders(created_at desc);
create index if not exists idx_order_items_order_id on order_items(order_id);
create index if not exists idx_products_featured    on products(featured) where featured = true;

-- ============================================================
-- FONCTIONS STOCK (appelées depuis l'API checkout)
-- ============================================================

create or replace function decrement_stock(product_id uuid, qty integer)
returns void language plpgsql security definer as $$
begin
  update products
  set stock = greatest(0, stock - qty)
  where id = product_id;
end;
$$;

create or replace function increment_stock(product_id uuid, qty integer)
returns void language plpgsql security definer as $$
begin
  update products
  set stock = stock + qty
  where id = product_id;
end;
$$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table products        enable row level security;
alter table orders          enable row level security;
alter table order_items     enable row level security;
alter table shipping_rates  enable row level security;
alter table site_config     enable row level security;

-- Products : lecture publique
create policy "Public read products"
  on products for select using (true);

-- Products : écriture authentifiée (admin)
create policy "Admin write products"
  on products for all using (auth.role() = 'authenticated');

-- Orders : lecture/écriture admin uniquement
create policy "Admin all orders"
  on orders for all using (auth.role() = 'authenticated');

-- Order items : lecture/écriture admin
create policy "Admin all order_items"
  on order_items for all using (auth.role() = 'authenticated');

-- Shipping rates : lecture publique, écriture admin
create policy "Public read shipping_rates"
  on shipping_rates for select using (true);

create policy "Admin write shipping_rates"
  on shipping_rates for all using (auth.role() = 'authenticated');

-- Site config : lecture publique, écriture admin
create policy "Public read site_config"
  on site_config for select using (true);

create policy "Admin write site_config"
  on site_config for all using (auth.role() = 'authenticated');

-- ============================================================
-- SUPABASE STORAGE — bucket product-images
-- ============================================================

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Admin upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "Admin update product images"
  on storage.objects for update
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "Admin delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA
-- ============================================================

-- Tarifs de livraison
insert into shipping_rates (method_name, price_cents, estimated_days) values
  ('standard', 850,  '3–5 business days'),
  ('express',  1800, '1–2 business days')
on conflict (method_name) do nothing;

-- Produits exemples
insert into products (name, description, price_cents, stock, image_url, featured) values
  (
    'Outback Beef Jerky — Original',
    'Slow-dried premium beef with nothing but the essentials: salt, pepper, and the dry Outback air. Bold, clean, unforgettable. The one that started it all.',
    1800, 20,
    'https://placehold.co/400x400/B85C38/F5E6D3?text=Outback+Jerky',
    true
  ),
  (
    'Roo Biltong',
    'Kangaroo meat dried with traditional bush spices — native pepperberry, wattleseed, and sea salt. Lean, rich, and uniquely Australian. Not for the faint-hearted.',
    2200, 15,
    'https://placehold.co/400x400/8B3A1F/E8D5B7?text=Roo+Biltong',
    true
  ),
  (
    'Smoky Bushranger Jerky',
    'Beef smoked low and slow over ironbark chips, then hit with cracked pepper and roasted garlic. Ride hard. Eat harder. Named after the outlaws who roamed these red plains.',
    2500, 12,
    'https://placehold.co/400x400/3E2723/C9A961?text=Bushranger',
    true
  ),
  (
    'Spicy Desert Strips',
    'Chilli and smoked paprika-crusted beef strips with a slow, deep heat that builds like an Outback sunset. Not the hottest strip in the West — just the most satisfying.',
    1900, 18,
    'https://placehold.co/400x400/C9A961/3E2723?text=Spicy+Desert',
    true
  )
on conflict do nothing;

-- Configuration du site (contenu éditabl depuis l'admin)
insert into site_config (key, value) values
  ('hero_title',    'Johnson''s Jerky'),
  ('hero_subtitle', 'Premium Beef Jerky & Biltong from the Heart of Kalgoorlie'),
  ('hero_tagline',  'Born in the dust. Dried in the sun. Delivered to your door.'),
  ('about_text',    'Out here in Kalgoorlie, where the red earth meets a sky wide enough to swallow your troubles whole, Johnson started making jerky the old way — no shortcuts, no nonsense. Just quality cuts, honest spices, and the dry Outback air doing the rest.')
on conflict (key) do nothing;
