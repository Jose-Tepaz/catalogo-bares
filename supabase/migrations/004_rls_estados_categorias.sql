-- RLS para estados (lectura pública, sin escritura desde el cliente)
ALTER TABLE estados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Estados are viewable by everyone"
  ON estados FOR SELECT
  USING (true);

-- RLS para categorias (lectura pública, sin escritura desde el cliente)
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categorias are viewable by everyone"
  ON categorias FOR SELECT
  USING (true);
