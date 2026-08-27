-- Adds the fabric/material field called for in thrift-hup-system.md section 2.1
-- ("Each product: ... fabric/material info") that was missed in the original schema.
-- Run this once in the Supabase SQL Editor, same as schema.sql.

alter table products
  add column if not exists material text not null default '';
