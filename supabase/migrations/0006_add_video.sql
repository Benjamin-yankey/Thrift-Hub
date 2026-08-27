-- Adds an optional video per product (e.g. a short clip alongside the
-- photos), uploaded from the admin CMS the same way images are. Run this
-- once in the Supabase SQL Editor, same as schema.sql and the earlier
-- migrations.
--
-- Uploaded video files land in the same `product-images` Storage bucket
-- the photos use (see src/lib/supabase/storage.ts) — if that bucket has an
-- "Allowed MIME types" restriction configured in the Supabase dashboard
-- (Storage -> product-images -> bucket settings), add `video/*` to it, and
-- check its max file size covers a short product clip (the app itself
-- caps uploads at 60MB — see MAX_VIDEO_BYTES in
-- src/app/api/admin/upload/route.ts).

alter table products
  add column if not exists video_url text not null default '';
