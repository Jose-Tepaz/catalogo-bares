-- ============================================================
-- Tabla: estados
-- ============================================================
CREATE TABLE IF NOT EXISTS estados (
  id   TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
);

INSERT INTO estados (id, name, slug) VALUES
  ('cdmx',         'CDMX',         'cdmx'),
  ('guadalajara',  'Guadalajara',  'guadalajara'),
  ('riviera-maya', 'Riviera Maya', 'riviera-maya')
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

-- Guadalajara
UPDATE bars SET state_id = 'guadalajara' WHERE id IN (
  'pare-de-sufrir-gdl',
  'la-mezcalera-gdl',
  'casa-bariachi-gdl'
);

-- Riviera Maya
UPDATE bars SET state_id = 'riviera-maya' WHERE id IN (
  'coco-bongo-cancun',
  'la-mezcaleria-cancun'
);

-- ============================================================
-- Bares de relleno (placeholder hasta tener info real)
-- ============================================================
INSERT INTO bars (id, name, city, address, category, image_url, state_id) VALUES
  -- Ciudad de México
  ('xaman-cdmx',        'Xaman Bar',            'Ciudad de Mexico', 'Colima 378, Roma Norte',              'Bar de cocteles',      NULL, 'cdmx'),
  ('pulqueria-ingrata',  'Pulquería La Ingrata', 'Ciudad de Mexico', 'Mesones 26, Centro Histórico',        'Cantina',              NULL, 'cdmx'),
  -- Guadalajara
  ('parker-gdl',         'Parker & Lenox',       'Guadalajara',      'Av. Inglaterra 3128, Vallarta Norte', 'Speakeasy',            NULL, 'guadalajara'),
  ('diana-rooftop-gdl',  'Diana Rooftop',        'Guadalajara',      'Av. López Mateos Sur 2077, Chapalita','Rooftop',              NULL, 'guadalajara'),
  ('sabina-gdl',         'Sabina Berrer',        'Guadalajara',      'Hidalgo 1935, Americana',             'Bar de cocteles',      NULL, 'guadalajara'),
  -- Sin estado asignado (Monterrey no corresponde a ninguno de los 3 estados)
  ('hangar-mty',         'Hangar 33',            'Monterrey',        'Av. Constitución 110, Centro',        'Cerveceria artesanal', NULL, NULL),
  ('catedral-bar-mty',   'Bar Catedral',         'Monterrey',        'Padre Mier 248, Centro',              'Cantina',              NULL, NULL),
  ('ix-rooftop-mty',     'IX Rooftop',           'San Pedro Garza García', 'Calzada del Valle 106, Del Valle', 'Rooftop',           NULL, NULL)
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
