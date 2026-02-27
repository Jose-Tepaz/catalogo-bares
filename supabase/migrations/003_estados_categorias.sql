-- ============================================================
-- Tabla: estados
-- Solo 3 estados por ahora; info definitiva se agregará después
-- ============================================================
CREATE TABLE IF NOT EXISTS estados (
  id   TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
);

INSERT INTO estados (id, name, slug) VALUES
  ('cdmx',   'Ciudad de México', 'ciudad-de-mexico'),
  ('jal',    'Jalisco',          'jalisco'),
  ('nl',     'Nuevo León',       'nuevo-leon')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Vincular bares existentes a su estado
-- ============================================================
ALTER TABLE bars ADD COLUMN IF NOT EXISTS state_id TEXT REFERENCES estados(id);

-- CDMX
UPDATE bars SET state_id = 'cdmx' WHERE id IN (
  'limantour-cdmx',
  'handshake-cdmx',
  'baltra-cdmx',
  'ticuchi-cdmx',
  'cityzen-rooftop-cdmx',
  'salon-rios-cdmx'
);

-- Jalisco (Guadalajara)
UPDATE bars SET state_id = 'jal' WHERE id IN (
  'pare-de-sufrir-gdl',
  'la-mezcalera-gdl',
  'casa-bariachi-gdl'
);

-- Nuevo León (Monterrey)
UPDATE bars SET state_id = 'nl' WHERE id IN (
  'maviri-mty',
  'finca-altozano-mty',
  'cerveceria-insurgente-mty'
);

-- ============================================================
-- Bares de relleno (placeholder hasta tener info real)
-- ============================================================
INSERT INTO bars (id, name, city, address, category, image_url, state_id) VALUES
  -- Ciudad de México
  ('xaman-cdmx',        'Xaman Bar',            'Ciudad de Mexico', 'Colima 378, Roma Norte',              'Bar de cocteles',      NULL, 'cdmx'),
  ('pulqueria-ingrata',  'Pulquería La Ingrata', 'Ciudad de Mexico', 'Mesones 26, Centro Histórico',        'Cantina',              NULL, 'cdmx'),
  -- Jalisco
  ('parker-gdl',         'Parker & Lenox',       'Guadalajara',      'Av. Inglaterra 3128, Vallarta Norte', 'Speakeasy',            NULL, 'jal'),
  ('diana-rooftop-gdl',  'Diana Rooftop',        'Guadalajara',      'Av. López Mateos Sur 2077, Chapalita','Rooftop',              NULL, 'jal'),
  ('sabina-gdl',         'Sabina Berrer',        'Guadalajara',      'Hidalgo 1935, Americana',             'Bar de cocteles',      NULL, 'jal'),
  -- Nuevo León
  ('hangar-mty',         'Hangar 33',            'Monterrey',        'Av. Constitución 110, Centro',        'Cerveceria artesanal', NULL, 'nl'),
  ('catedral-bar-mty',   'Bar Catedral',         'Monterrey',        'Padre Mier 248, Centro',              'Cantina',              NULL, 'nl'),
  ('ix-rooftop-mty',     'IX Rooftop',           'San Pedro Garza García', 'Calzada del Valle 106, Del Valle', 'Rooftop',           NULL, 'nl')
ON CONFLICT (id) DO NOTHING;

-- Índice para filtrar bares por estado
CREATE INDEX IF NOT EXISTS idx_bars_state_id ON bars(state_id);

-- ============================================================
-- Tabla: categorias
-- Creada para uso futuro; no conectada a nada por ahora
-- ============================================================
CREATE TABLE IF NOT EXISTS categorias (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Categorías que ya se usan en bars.category (para referencia futura)
INSERT INTO categorias (name, slug) VALUES
  ('Rooftop',                'rooftop'),
  ('Speakeasy',              'speakeasy'),
  ('Bar de cocteles',        'bar-de-cocteles'),
  ('Cantina',                'cantina'),
  ('Mezcaleria',             'mezcaleria'),
  ('Tequileria',             'tequileria'),
  ('Wine Bar',               'wine-bar'),
  ('Cerveceria artesanal',   'cerveceria-artesanal')
ON CONFLICT (name) DO NOTHING;
