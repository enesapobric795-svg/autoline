-- SQL to create the `parts` table for Supabase/Postgres
CREATE TABLE IF NOT EXISTS parts (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  vehicleBrand text,
  catalogNumber text,
  qty integer DEFAULT 0,
  price numeric DEFAULT 0,
  location text,
  onPik boolean DEFAULT false,
  image text
);

CREATE INDEX IF NOT EXISTS parts_catalog_idx ON parts (catalogNumber);
