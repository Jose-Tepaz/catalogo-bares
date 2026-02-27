-- Crear tabla bars
CREATE TABLE IF NOT EXISTS bars (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'Rooftop',
    'Speakeasy',
    'Bar de cocteles',
    'Cantina',
    'Mezcaleria',
    'Tequileria',
    'Wine Bar',
    'Cerveceria artesanal'
  )),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear tabla participations
CREATE TABLE IF NOT EXISTS participations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bar_id TEXT NOT NULL REFERENCES bars(id) ON DELETE CASCADE,
  photo_data_url TEXT,
  title TEXT,
  story TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, bar_id)
);

-- Habilitar RLS en ambas tablas
ALTER TABLE bars ENABLE ROW LEVEL SECURITY;
ALTER TABLE participations ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para bars (lectura pública, escritura solo para autenticados)
CREATE POLICY "Bars are viewable by everyone"
  ON bars FOR SELECT
  USING (true);

CREATE POLICY "Bars are insertable by authenticated users"
  ON bars FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Bars are updatable by authenticated users"
  ON bars FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Políticas RLS para participations
CREATE POLICY "Participations are viewable by everyone"
  ON participations FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own participations"
  ON participations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participations"
  ON participations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own participations"
  ON participations FOR DELETE
  USING (auth.uid() = user_id);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_bars_city ON bars(city);
CREATE INDEX IF NOT EXISTS idx_bars_category ON bars(category);
CREATE INDEX IF NOT EXISTS idx_participations_user_id ON participations(user_id);
CREATE INDEX IF NOT EXISTS idx_participations_bar_id ON participations(bar_id);
CREATE INDEX IF NOT EXISTS idx_participations_created_at ON participations(created_at DESC);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER update_bars_updated_at
  BEFORE UPDATE ON bars
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_participations_updated_at
  BEFORE UPDATE ON participations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
