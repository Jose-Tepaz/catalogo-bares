-- ============================================================
-- Nuevas columnas en bars
-- ============================================================
ALTER TABLE bars
  ADD COLUMN IF NOT EXISTS hero_drinks     TEXT[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS google_maps_url TEXT;

-- ============================================================
-- Relaciones de bars con estados y ciudades
-- (confirmación — FKs ya existen desde migraciones anteriores)
--   bars.state_id → estados(id)  [migración 003]
--   bars.city_id  → ciudades(id) [migración 007]
-- Índices ya creados:
--   idx_bars_state_id [migración 003]
--   idx_bars_city_id  [migración 007]
-- ============================================================
-- Índice adicional para búsquedas combinadas estado + ciudad
CREATE INDEX IF NOT EXISTS idx_bars_state_city ON bars(state_id, city_id);
