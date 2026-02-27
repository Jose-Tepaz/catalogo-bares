# Migraciones de Supabase

Este directorio contiene las migraciones SQL necesarias para configurar la base de datos de Supabase.

## Instrucciones para ejecutar las migraciones

### Opción 1: SQL Editor de Supabase Dashboard (Recomendado)

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Navega a **SQL Editor** en el menú lateral
3. Ejecuta las migraciones en orden:

   - Primero ejecuta `001_initial_schema.sql` para crear las tablas, políticas RLS e índices
   - Luego ejecuta `002_seed_bars.sql` para poblar la tabla de bares con datos iniciales

### Opción 2: Supabase CLI

Si tienes Supabase CLI instalado:

```bash
# Asegúrate de estar vinculado a tu proyecto
supabase link --project-ref your-project-ref

# Aplicar migraciones
supabase db push
```

## Estructura de las migraciones

### 001_initial_schema.sql
- Crea la tabla `bars` con todos los campos necesarios
- Crea la tabla `participations` con relaciones a usuarios y bares
- Configura Row Level Security (RLS) en ambas tablas
- Crea índices para optimizar consultas
- Configura triggers para actualizar `updated_at` automáticamente

### 002_seed_bars.sql
- Inserta los 20 bares iniciales del catálogo
- Los datos provienen de `lib/bars-data.ts`

## Configuración de variables de entorno

Después de ejecutar las migraciones, configura las variables de entorno en `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

Puedes encontrar estas credenciales en:
- Supabase Dashboard → Project Settings → API

## Verificación

Después de ejecutar las migraciones, verifica que:

1. Las tablas `bars` y `participations` existen
2. Las políticas RLS están activas
3. Los índices fueron creados correctamente
4. Los datos de bares fueron insertados (deberías ver 20 registros en la tabla `bars`)

Puedes verificar esto en el SQL Editor ejecutando:

```sql
SELECT COUNT(*) FROM bars;
SELECT COUNT(*) FROM participations;
```
