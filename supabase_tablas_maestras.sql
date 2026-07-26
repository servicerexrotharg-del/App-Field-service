-- =====================================================================
-- TABLAS MAESTRAS SINCRONIZADAS (categorías, tipos de servicio,
-- contratos y roles de técnico compartidos entre dispositivos)
-- Ejecutar en Supabase: SQL Editor > New query > pegar > Run
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.app_options (
  key text NOT NULL,
  items jsonb DEFAULT '[]'::jsonb,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT app_options_pkey PRIMARY KEY (key)
);
