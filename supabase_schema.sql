-- ============================================================
-- TIMSA KPI Dashboard — Supabase Schema
-- Run in SQL Editor. If updating, run the DROP lines first.
-- ============================================================

-- DROP TABLE IF EXISTS kpi_clients;
-- DROP TABLE IF EXISTS kpi_sales;

-- 1. KPI summary table (daily % per division)
CREATE TABLE IF NOT EXISTS kpi_sales (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  date DATE NOT NULL,
  division TEXT NOT NULL,
  kpi NUMERIC(8,2) NOT NULL,
  total_venta NUMERIC(14,2) DEFAULT 0,
  total_proyeccion NUMERIC(14,2) DEFAULT 0,
  total_presupuesto NUMERIC(14,2) DEFAULT 0,
  total_venta_ant NUMERIC(14,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, division)
);

-- 2. Client-level detail table (latest upload per division)
CREATE TABLE IF NOT EXISTS kpi_clients (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  upload_date DATE NOT NULL,
  division TEXT NOT NULL,
  client_id TEXT,
  client_name TEXT NOT NULL,
  venta NUMERIC(14,2) DEFAULT 0,
  proyeccion NUMERIC(14,2) DEFAULT 0,
  presupuesto NUMERIC(14,2) DEFAULT 0,
  venta_ant NUMERIC(14,2) DEFAULT 0,
  venta_anio_ant NUMERIC(14,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(upload_date, division, client_name)
);

-- 3. Enable RLS
ALTER TABLE kpi_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_clients ENABLE ROW LEVEL SECURITY;

-- 4. Authenticated-only policies for kpi_sales
CREATE POLICY "Auth read kpi_sales" ON kpi_sales FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert kpi_sales" ON kpi_sales FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update kpi_sales" ON kpi_sales FOR UPDATE TO authenticated USING (true);

-- 5. Authenticated-only policies for kpi_clients
CREATE POLICY "Auth read kpi_clients" ON kpi_clients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert kpi_clients" ON kpi_clients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update kpi_clients" ON kpi_clients FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete kpi_clients" ON kpi_clients FOR DELETE TO authenticated USING (true);

-- 6. Indexes
CREATE INDEX IF NOT EXISTS idx_kpi_sales_date ON kpi_sales(date);
CREATE INDEX IF NOT EXISTS idx_kpi_clients_date ON kpi_clients(upload_date);
CREATE INDEX IF NOT EXISTS idx_kpi_clients_div ON kpi_clients(division);
