-- Seed data para la tabla bars
-- Datos migrados de lib/bars-data.ts

INSERT INTO bars (id, name, city, address, category, image_url) VALUES
  ('limantour-cdmx', 'Licoreria Limantour', 'Ciudad de Mexico', 'Av. Alvaro Obregon 106, Roma Norte', 'Bar de cocteles', '/bars/limantour.jpg'),
  ('handshake-cdmx', 'Handshake Speakeasy', 'Ciudad de Mexico', 'Amberes 65, Juarez', 'Speakeasy', '/bars/handshake.jpg'),
  ('baltra-cdmx', 'Baltra Bar', 'Ciudad de Mexico', 'Iztaccihuatl 36-D, Condesa', 'Bar de cocteles', '/bars/baltra.jpg'),
  ('ticuchi-cdmx', 'Ticuchi', 'Ciudad de Mexico', 'Zacatecas 173, Roma Norte', 'Mezcaleria', '/bars/ticuchi.jpg'),
  ('cityzen-rooftop-cdmx', 'Cityzen Rooftop', 'Ciudad de Mexico', 'Paseo de la Reforma 500, Cuauhtemoc', 'Rooftop', '/bars/cityzen.jpg'),
  ('salon-rios-cdmx', 'Salon Rios', 'Ciudad de Mexico', 'Rio Panuco 132, Cuauhtemoc', 'Cantina', '/bars/salon-rios.jpg'),
  ('pare-de-sufrir-gdl', 'Pare de Sufrir', 'Guadalajara', 'Calle Morelos 1278, Centro', 'Bar de cocteles', '/bars/pare-de-sufrir.jpg'),
  ('la-mezcalera-gdl', 'La Mezcalera', 'Guadalajara', 'Lopez Cotilla 1855, Lafayette', 'Mezcaleria', '/bars/la-mezcalera.jpg'),
  ('casa-bariachi-gdl', 'Casa Bariachi', 'Guadalajara', 'Av. Vallarta 2221, Arcos Vallarta', 'Tequileria', '/bars/casa-bariachi.jpg'),
  ('maviri-mty', 'Maviri', 'Monterrey', 'Rio Amazonas 215, Del Valle', 'Bar de cocteles', '/bars/maviri.jpg'),
  ('finca-altozano-mty', 'Finca Altozano', 'Monterrey', 'Jose Vasconcelos 150, San Pedro', 'Wine Bar', '/bars/finca-altozano.jpg'),
  ('cerveceria-insurgente-mty', 'Cerveceria Insurgente', 'Monterrey', 'Calzada del Valle 400, Del Valle', 'Cerveceria artesanal', '/bars/cerveceria-insurgente.jpg'),
  ('coco-bongo-cancun', 'Coco Bongo', 'Cancun', 'Blvd. Kukulcan Km 9.5, Zona Hotelera', 'Rooftop', '/bars/coco-bongo.jpg'),
  ('la-mezcaleria-cancun', 'La Casa del Mezcal', 'Cancun', 'Av. Tulum 25, Centro', 'Mezcaleria', '/bars/mezcal-cancun.jpg'),
  ('la-purificadora-puebla', 'Bar La Purificadora', 'Puebla', 'Callejon de la 10 Norte 802, Centro', 'Bar de cocteles', '/bars/la-purificadora.jpg'),
  ('cantina-la-reforma-puebla', 'Cantina La Reforma', 'Puebla', 'Av. Reforma 505, Centro', 'Cantina', '/bars/cantina-reforma.jpg'),
  ('mezcalogia-oaxaca', 'Mezcalogia', 'Oaxaca', 'Macedonio Alcala 706, Centro', 'Mezcaleria', '/bars/mezcalogia.jpg'),
  ('los-amantes-oaxaca', 'Los Amantes Mezcaleria', 'Oaxaca', 'Allende 107, Centro', 'Mezcaleria', '/bars/los-amantes.jpg'),
  ('apoala-merida', 'Apoala Mexican Cuisine', 'Merida', 'Calle 60 474, Centro', 'Bar de cocteles', '/bars/apoala.jpg'),
  ('la-negrita-merida', 'La Negrita Cantina', 'Merida', 'Calle 62 415, Centro', 'Cantina', '/bars/la-negrita.jpg')
ON CONFLICT (id) DO NOTHING;
