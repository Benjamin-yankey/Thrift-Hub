-- Widens the catalog beyond the original 5-item seed drop so the shop
-- page's filters (category, size, price) have more to actually filter —
-- one product each in categories not covered yet: t-shirts, trousers,
-- bags, boots. Run this once in the Supabase SQL Editor, same as
-- schema.sql and the earlier migrations.

insert into products (slug, name, category, price, sizes, description, images, image_alt, material, status, featured, sort_order) values
('boxy-graphic-tee', 'Boxy Graphic Tee, Screen-Stitched', 't-shirts', 75, array['S','M','L'], 'Oversized fit with a hand-stitched chest patch — the print never cracked because it was never printed, it was appliqued.', array['/products/boxy-graphic-tee.svg'], 'Illustration of a teal boxy t-shirt with a charcoal chest print patch', '100% cotton', 'new', false, 6),
('pleated-trousers', 'Pleated Trousers, Taken In', 'trousers', 140, array['30','32','34'], 'Front-pleat trousers taken in at the waist by hand. Gold pinstripe running the outseam, original crease still holding.', array['/products/pleated-trousers.svg'], 'Illustration of charcoal pleated trousers with a gold pinstripe', 'wool blend', 'low-stock', false, 7),
('canvas-tote', 'Canvas Tote, Patch-Repaired', 'bags', 60, array['One Size'], 'Heavyweight canvas tote with a hand-sewn teal patch over the one spot that wore through. Everything else on it has years left.', array['/products/canvas-tote.svg'], 'Illustration of a cream canvas tote bag with a teal patch repair', 'canvas', 'new', false, 8),
('combat-boots', 'Combat Boots, Resoled', 'boots', 195, array['41','42','43'], 'Full-grain leather boots, resoled in contrast teal rubber once the originals wore through. Laces swapped for gold paracord.', array['/products/combat-boots.svg'], 'Illustration of charcoal combat boots with a teal resoled sole and gold laces', 'full-grain leather', 'last-one', false, 9)
on conflict (slug) do nothing;
