-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- If you already ran the previous schema, run the DROP line first.

-- DROP TABLE IF EXISTS kpi_sales;

-- 1. Create the KPI sales table
CREATE TABLE kpi_sales (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  date DATE NOT NULL,
  division TEXT NOT NULL,
  kpi NUMERIC(8,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, division)
);

-- 2. Enable Row Level Security
ALTER TABLE kpi_sales ENABLE ROW LEVEL SECURITY;

-- 3. Only authenticated users can read/write
CREATE POLICY "Authenticated users can read" ON kpi_sales
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert" ON kpi_sales
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update" ON kpi_sales
  FOR UPDATE TO authenticated USING (true);

-- 4. Create an index for fast month-based queries
CREATE INDEX idx_kpi_sales_date ON kpi_sales(date);
