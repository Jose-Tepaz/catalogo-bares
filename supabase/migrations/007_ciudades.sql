-- ============================================================
-- Asegurar que los estados requeridos existen
-- (la migración 003 pudo haber sido aplicada con IDs antiguos)
-- ============================================================
INSERT INTO estados (id, name, slug) VALUES
  ('guadalajara',  'Guadalajara',  'guadalajara'),
  ('riviera-maya', 'Riviera Maya', 'riviera-maya')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Tabla: ciudades
-- Relacionada con estados; bars.city_id → ciudades.id
-- Estados disponibles: cdmx | guadalajara | riviera-maya
-- ============================================================
CREATE TABLE IF NOT EXISTS ciudades (
  id       TEXT PRIMARY KEY,
  name     TEXT NOT NULL,
  slug     TEXT NOT NULL UNIQUE,
  state_id TEXT REFERENCES estados(id)
);

INSERT INTO ciudades (id, name, slug, state_id) VALUES
  -- Guadalajara
  ('tlaquepaque',     'Tlaquepaque',       'tlaquepaque',       'guadalajara'),
  -- Riviera Maya
  ('cancun',          'Cancún',            'cancun',            'riviera-maya'),
  ('playa-del-carmen','Playa del Carmen',  'playa-del-carmen',  'riviera-maya'),
  ('riviera-maya',    'Riviera Maya',      'riviera-maya',      'riviera-maya'),
  ('tulum',           'Tulum',             'tulum',             'riviera-maya'),
  -- CDMX — colonias y zonas
  ('reforma',         'Reforma',           'reforma',           'cdmx'),
  ('coyoacan',        'Coyoacán',          'coyoacan',          'cdmx'),
  ('roma',            'Roma',              'roma',              'cdmx'),
  ('lomas',           'Lomas',             'lomas',             'cdmx'),
  ('pedregal',        'Pedregal',          'pedregal',          'cdmx'),
  ('juarez',          'Juárez',            'juarez',            'cdmx'),
  ('roma-polanco',    'Roma / Polanco',    'roma-polanco',      'cdmx'),
  ('polanco',         'Polanco',           'polanco',           'cdmx'),
  ('condesa',         'Condesa',           'condesa',           'cdmx'),
  ('centro-historico','Centro Histórico',  'centro-historico',  'cdmx')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Vincular bares existentes a su ciudad
-- ============================================================
ALTER TABLE bars ADD COLUMN IF NOT EXISTS city_id TEXT REFERENCES ciudades(id);

UPDATE bars SET city_id = 'cancun' WHERE city IN ('Cancun', 'Cancún');

-- Índice para filtrar bares por ciudad
CREATE INDEX IF NOT EXISTS idx_bars_city_id ON bars(city_id);

-- ============================================================
-- RLS para ciudades (lectura pública, sin escritura desde cliente)
-- ============================================================
ALTER TABLE ciudades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ciudades are viewable by everyone"
  ON ciudades FOR SELECT
  USING (true);
