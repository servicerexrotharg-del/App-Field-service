-- =====================================================================
-- CALENDARIO DE SERVICIOS - Tabla para la nueva sección de la app
-- Ejecutar en Supabase: SQL Editor > New query > pegar > Run
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.scheduled_services (
  id text NOT NULL,
  fecha_inicio date NOT NULL,
  fecha_fin date NOT NULL,
  cliente text NOT NULL,
  motivo text DEFAULT ''::text,
  tecnicos jsonb DEFAULT '[]'::jsonb,
  estado text DEFAULT 'Programado'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT scheduled_services_pkey PRIMARY KEY (id)
);

-- Índice para acelerar las consultas por rango de fechas del calendario
CREATE INDEX IF NOT EXISTS idx_scheduled_services_fechas
  ON public.scheduled_services (fecha_inicio, fecha_fin);
