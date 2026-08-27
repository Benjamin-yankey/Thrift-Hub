-- Thrift Hup — products schema
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.

create extension if not exists pgcrypto;

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null default 'uncategorized',
  price numeric not null,
  currency text not null default 'GHS',
  sizes text[] not null default '{}',
  description text not null default '',
  images text[] not null default '{}',
  image_alt text not null default '',
  status text not null default 'new' check (status in ('new','low-stock','last-one','sold-out','coming-soon')),
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_sort_order_idx on products (sort_order);

-- keep updated_at fresh on every edit
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on products;
create trigger products_set_updated_at
before update on products
for each row execute function set_updated_at();

-- RLS: anyone can read (the public site needs this), nobody can write
-- through the public API — writes only happen server-side via the
-- service_role key, from routes that check the admin's auth session first.
alter table products enable row level security;

drop policy if exists "Public read access" on products;
create policy "Public read access"
on products for select
to anon, authenticated
using (true);

-- Seed data ported from the existing static homepage, so the site keeps
-- working immediately and the admin has real rows to edit instead of an
-- empty table.
insert into products (slug, name, category, price, sizes, description, images, image_alt, status, featured, sort_order) values
('coachs-bomber', 'Coach''s Bomber, Chopped & Patched', 'jackets', 240, array['M','L'], 'Varsity bomber with the sleeves shortened and an elbow patch reworked from an old flight jacket.', array['/products/coachs-bomber.svg'], 'Illustration of a reworked orange and charcoal varsity bomber jacket with an elbow patch', 'new', true, 1),
('wide-leg-denim', 'Wide-Leg Denim, Sun-Bleached', 'jeans', 165, array['30','32','34'], 'Raw hem, faded true at the knee from someone else''s decade of wear.', array['/products/wide-leg-denim.svg'], 'Illustration of faded teal wide-leg denim jeans with a raw hem', 'low-stock', false, 2),
('chain-stitch-flannel', 'Chain-Stitch Flannel', 'shirts', 95, array['S','M'], 'Overshirt with hand chain-stitched cuffs, found with the tags still folded in the pocket.', array['/products/chain-stitch-flannel.svg'], 'Illustration of a charcoal and orange plaid flannel overshirt', 'new', false, 3),
('cargo-pants', 'Cargo Pants, Double-Knee', 'cargo-pants', 150, array['30','32'], 'Reinforced knee patch left visible on purpose. Six pockets, all of them functional.', array['/products/cargo-pants.svg'], 'Illustration of charcoal cargo pants with a teal knee patch', 'last-one', false, 4),
('canvas-high-tops', 'Canvas High-Tops, Re-Laced', 'sneakers', 130, array['40','41','42'], 'Cleaned by hand and re-laced in contrast teal. The sole still has some road left in it.', array['/products/canvas-high-tops.svg'], 'Illustration of charcoal canvas high-top sneakers with teal laces', 'sold-out', false, 5)
on conflict (slug) do nothing;
