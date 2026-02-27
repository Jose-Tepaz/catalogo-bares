# Guía de Configuración de Supabase

Esta guía te ayudará a configurar Supabase con MCP para tu aplicación "La Ruta Coctelera".

## Pasos de Configuración

### 1. Ejecutar Migraciones SQL

Las migraciones SQL están en `supabase/migrations/`. Ejecútalas en orden:

1. **001_initial_schema.sql**: Crea las tablas, políticas RLS e índices
2. **002_seed_bars.sql**: Pobla la tabla de bares con datos iniciales

**Cómo ejecutarlas:**
- Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
- Navega a **SQL Editor**
- Copia y pega el contenido de cada archivo SQL y ejecútalo

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

**Dónde encontrar estas credenciales:**
- Supabase Dashboard → Project Settings → API
- `NEXT_PUBLIC_SUPABASE_URL`: Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: anon/public key

### 3. Configurar Autenticación (Opcional pero Recomendado)

La aplicación está configurada para usar autenticación de Supabase. Puedes configurar:

- **Email/Password**: Ya está habilitado por defecto
- **OAuth providers**: Configúralos en Supabase Dashboard → Authentication → Providers

### 4. Verificar la Configuración

Después de ejecutar las migraciones, verifica:

```sql
-- Verificar tablas
SELECT COUNT(*) FROM bars;
SELECT COUNT(*) FROM participations;

-- Verificar políticas RLS
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
```

### 5. Probar la Aplicación

1. Inicia el servidor de desarrollo: `npm run dev`
2. La aplicación debería funcionar con Supabase
3. Las participaciones se guardarán en la base de datos en lugar de localStorage

## Estructura de Base de Datos

### Tabla `bars`
- `id` (TEXT, PK): Identificador único del bar
- `name` (TEXT): Nombre del bar
- `city` (TEXT): Ciudad donde está ubicado
- `address` (TEXT): Dirección completa
- `category` (TEXT): Categoría del bar (enum)
- `image_url` (TEXT): URL de la imagen
- `created_at` (TIMESTAMPTZ): Fecha de creación
- `updated_at` (TIMESTAMPTZ): Fecha de última actualización

### Tabla `participations`
- `id` (UUID, PK): Identificador único
- `user_id` (UUID, FK → auth.users): Usuario que creó la participación
- `bar_id` (TEXT, FK → bars.id): Bar relacionado
- `photo_data_url` (TEXT): URL o data URL de la foto
- `title` (TEXT): Título de la participación
- `story` (TEXT): Historia/anécdota
- `created_at` (TIMESTAMPTZ): Fecha de creación
- `updated_at` (TIMESTAMPTZ): Fecha de última actualización
- Constraint único: `(user_id, bar_id)` - Un usuario solo puede tener una participación por bar

## Row Level Security (RLS)

### Políticas para `bars`:
- **Lectura**: Pública (todos pueden ver los bares)
- **Escritura**: Solo usuarios autenticados

### Políticas para `participations`:
- **Lectura**: Pública (todos pueden ver las participaciones)
- **Escritura**: Solo el usuario propietario puede crear/actualizar/eliminar sus propias participaciones

## Migración desde localStorage

Si tenías datos en localStorage, necesitarás migrarlos manualmente o crear un script de migración. Los datos de localStorage no se migran automáticamente.

## Solución de Problemas

### Error: "Missing environment variables"
- Verifica que `.env.local` existe y tiene las variables correctas
- Reinicia el servidor de desarrollo después de crear/modificar `.env.local`

### Error: "relation does not exist"
- Asegúrate de haber ejecutado las migraciones SQL en orden
- Verifica que las tablas existen en Supabase Dashboard → Table Editor

### Error: "new row violates row-level security policy"
- Verifica que el usuario está autenticado
- Revisa las políticas RLS en Supabase Dashboard → Authentication → Policies

### Las participaciones no se guardan
- Verifica que el usuario está autenticado
- Revisa la consola del navegador para errores
- Verifica las políticas RLS

## Próximos Pasos

1. Configurar autenticación de usuarios (páginas de login/registro)
2. Considerar migrar imágenes a Supabase Storage en lugar de usar data URLs
3. Agregar más funcionalidades como favoritos, ratings, etc.
