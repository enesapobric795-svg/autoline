-- SQL to create the `parts` table for Supabase/Postgres
CREATE TABLE IF NOT EXISTS parts (
  id bigint PRIMARY KEY,
  name text NOT NULL,
  vehicleBrand text,
  catalogNumber text,
  qty integer DEFAULT 0,
  price numeric DEFAULT 0,
  location text,
  onPik boolean DEFAULT false,
  image text
);

-- optional: create an index on catalogNumber for faster lookups
CREATE INDEX IF NOT EXISTS parts_catalog_idx ON parts (catalogNumber);
