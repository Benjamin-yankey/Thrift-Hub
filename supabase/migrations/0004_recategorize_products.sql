-- Moves products off the old four broad buckets (tops/bottoms/outerwear/
-- footwear) onto the specific garment-type taxonomy now used by the admin
-- CMS (see CATEGORIES in src/lib/site.ts), so the shop's category filter
-- can distinguish a shirt from a pair of cargo pants instead of lumping
-- both under "tops"/"bottoms". Run this once in the Supabase SQL Editor,
-- same as schema.sql and the earlier migrations.
--
-- Only the original seed rows are renamed by slug; any product an admin
-- already created with a custom category is left untouched.

update products set category = 'jackets' where slug = 'coachs-bomber' and category = 'outerwear';
update products set category = 'jeans' where slug = 'wide-leg-denim' and category = 'bottoms';
update products set category = 'shirts' where slug = 'chain-stitch-flannel' and category = 'tops';
update products set category = 'cargo-pants' where slug = 'cargo-pants' and category = 'bottoms';
update products set category = 'sneakers' where slug = 'canvas-high-tops' and category = 'footwear';
