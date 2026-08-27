-- Adds the `messages` table backing the /contact form (thrift-hup-system.md
-- section 2.2: "General Contact page/form (name, email, message) for
-- wholesale/collab/other inquiries"). Run this once in the Supabase SQL
-- Editor, same as schema.sql and 0002_add_material.sql.

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists messages_created_at_idx on messages (created_at desc);

-- RLS: the public contact form (anon key, no session) needs to be able to
-- insert a row. Nobody — not even an authenticated site visitor — can read,
-- update, or delete through the public API; the /admin/messages page reads
-- via the service-role client instead, same pattern as product writes.
alter table messages enable row level security;

drop policy if exists "Public insert access" on messages;
create policy "Public insert access"
on messages for insert
to anon
with check (true);
