import { useState, useEffect, useCallback, useRef } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { Upload, TrendingDown, TrendingUp, BarChart3, Table2, AlertTriangle, CheckCircle2, CalendarDays, X, LogOut } from "lucide-react";
import { supabase } from "./supabaseClient.js";

const LOGO_B64 = "data:image/png;base64,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";

// ─── March historical seed ───
const MARCH_SEED = [
  { date: "2026-03-01", division: "TORREÓN", kpi: -88.32 }, { date: "2026-03-01", division: "RAMOS", kpi: -76.20 }, { date: "2026-03-01", division: "BAJÍO", kpi: -58.66 }, { date: "2026-03-01", division: "TODOS", kpi: -75.73 },
  { date: "2026-03-02", division: "TORREÓN", kpi: -52.98 }, { date: "2026-03-02", division: "RAMOS", kpi: -69.13 }, { date: "2026-03-02", division: "BAJÍO", kpi: -29.02 }, { date: "2026-03-02", division: "TODOS", kpi: -51.40 },
  { date: "2026-03-03", division: "TORREÓN", kpi: -43.97 }, { date: "2026-03-03", division: "RAMOS", kpi: -39.87 }, { date: "2026-03-03", division: "BAJÍO", kpi: -21.59 }, { date: "2026-03-03", division: "TODOS", kpi: -36.14 },
  { date: "2026-03-04", division: "TORREÓN", kpi: -35.04 }, { date: "2026-03-04", division: "RAMOS", kpi: -30.26 }, { date: "2026-03-04", division: "BAJÍO", kpi: -15.33 }, { date: "2026-03-04", division: "TODOS", kpi: -27.75 },
  { date: "2026-03-05", division: "TORREÓN", kpi: -31.23 }, { date: "2026-03-05", division: "RAMOS", kpi: -32.77 }, { date: "2026-03-05", division: "BAJÍO", kpi: -40.99 }, { date: "2026-03-05", division: "TODOS", kpi: -34.56 },
  { date: "2026-03-06", division: "TORREÓN", kpi: -16.56 }, { date: "2026-03-06", division: "RAMOS", kpi: -11.43 }, { date: "2026-03-06", division: "BAJÍO", kpi: -7.64 }, { date: "2026-03-06", division: "TODOS", kpi: -12.28 },
  { date: "2026-03-08", division: "TORREÓN", kpi: -21.07 }, { date: "2026-03-08", division: "RAMOS", kpi: -9.70 }, { date: "2026-03-08", division: "BAJÍO", kpi: -8.43 }, { date: "2026-03-08", division: "TODOS", kpi: -13.65 },
  { date: "2026-03-09", division: "TORREÓN", kpi: -23.31 }, { date: "2026-03-09", division: "RAMOS", kpi: -11.91 }, { date: "2026-03-09", division: "BAJÍO", kpi: -10.14 }, { date: "2026-03-09", division: "TODOS", kpi: -15.72 },
  { date: "2026-03-10", division: "TORREÓN", kpi: -24.58 }, { date: "2026-03-10", division: "RAMOS", kpi: -7.14 }, { date: "2026-03-10", division: "BAJÍO", kpi: -7.78 }, { date: "2026-03-10", division: "TODOS", kpi: -13.94 },
  { date: "2026-03-11", division: "TORREÓN", kpi: -23.75 }, { date: "2026-03-11", division: "RAMOS", kpi: -5.09 }, { date: "2026-03-11", division: "BAJÍO", kpi: -7.26 }, { date: "2026-03-11", division: "TODOS", kpi: -12.80 },
  { date: "2026-03-12", division: "TORREÓN", kpi: -26.20 }, { date: "2026-03-12", division: "RAMOS", kpi: -8.62 }, { date: "2026-03-12", division: "BAJÍO", kpi: -16.71 }, { date: "2026-03-12", division: "TODOS", kpi: -17.63 },
  { date: "2026-03-13", division: "TORREÓN", kpi: -20.87 }, { date: "2026-03-13", division: "RAMOS", kpi: 1.23 }, { date: "2026-03-13", division: "BAJÍO", kpi: -4.15 }, { date: "2026-03-13", division: "TODOS", kpi: -8.71 },
  { date: "2026-03-16", division: "TORREÓN", kpi: -26.69 }, { date: "2026-03-16", division: "RAMOS", kpi: -3.44 }, { date: "2026-03-16", division: "BAJÍO", kpi: -7.88 }, { date: "2026-03-16", division: "TODOS", kpi: -13.54 },
  { date: "2026-03-17", division: "TORREÓN", kpi: -29.10 }, { date: "2026-03-17", division: "RAMOS", kpi: -4.79 }, { date: "2026-03-17", division: "BAJÍO", kpi: -9.51 }, { date: "2026-03-17", division: "TODOS", kpi: -15.38 },
  { date: "2026-03-18", division: "TORREÓN", kpi: -29.36 }, { date: "2026-03-18", division: "RAMOS", kpi: -4.73 }, { date: "2026-03-18", division: "BAJÍO", kpi: -8.38 }, { date: "2026-03-18", division: "TODOS", kpi: -15.13 },
  { date: "2026-03-19", division: "TORREÓN", kpi: -29.82 }, { date: "2026-03-19", division: "RAMOS", kpi: -6.62 }, { date: "2026-03-19", division: "BAJÍO", kpi: -15.50 }, { date: "2026-03-19", division: "TODOS", kpi: -17.99 },
  { date: "2026-03-20", division: "TORREÓN", kpi: -27.07 }, { date: "2026-03-20", division: "RAMOS", kpi: 0.50 }, { date: "2026-03-20", division: "BAJÍO", kpi: -8.23 }, { date: "2026-03-20", division: "TODOS", kpi: -12.48 },
];

const DIVISIONS = ["TORREÓN", "RAMOS", "BAJÍO"];
const ALL_COLS = ["TORREÓN", "RAMOS", "BAJÍO", "TODOS"];

const TH = {
  navy: "#0B1A30", navyMid: "#122744", navyLight: "#1A3458",
  red: "#C8102E", redLight: "#E8293F",
  white: "#FFFFFF", offWhite: "#F4F6F9",
  g100: "#EDF0F4", g200: "#D5DAE3", g400: "#8E99AB", g600: "#5A6577", g800: "#2D3748",
  blue: "#2E7DDB", teal: "#1EAFC1", amber: "#E6A817",
};

const DC = { "TORREÓN": TH.red, "RAMOS": TH.blue, "BAJÍO": TH.amber, "TODOS": TH.teal };

function parseMoney(v) { return v ? parseFloat(v.replace(/[$,]/g, "")) || 0 : 0; }

function parseCSV(text) {
  const lines = text.split("\n").filter(l => l.trim());
  const headers = lines[0].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g).map(h => h.replace(/"/g, "").trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
    if (!vals) continue;
    const row = {};
    headers.forEach((h, idx) => { row[h] = (vals[idx] || "").replace(/"/g, "").trim(); });
    rows.push(row);
  }
  return { headers, rows };
}

function computeKPI(rows) {
  if (!rows?.length) return null;
  const pk = Object.keys(rows[0]).find(k => k.toLowerCase().includes("proyeccion"));
  const bk = Object.keys(rows[0]).find(k => k.toLowerCase().includes("presupuesto"));
  if (!pk || !bk) return null;
  const tp = rows.reduce((s, r) => s + parseMoney(r[pk]), 0);
  const tb = rows.reduce((s, r) => s + parseMoney(r[bk]), 0);
  return tb === 0 ? null : ((tp - tb) / tb) * 100;
}

function fmtDate(ds) {
  return new Date(ds + "T12:00:00").toLocaleDateString("es-MX", { day: "2-digit", month: "short" }).replace(".", "");
}
function fmtShort(ds) {
  return new Date(ds + "T12:00:00").toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit" });
}
function getMonthName(ds) {
  return new Date(ds + "T12:00:00").toLocaleDateString("es-MX", { month: "long", year: "numeric" });
}
function getMonthKey(ds) { return ds.substring(0, 7); }

function getAvailableMonths(data) {
  const m = new Set();
  Object.keys(data).forEach(d => m.add(getMonthKey(d)));
  return Array.from(m).sort();
}

// ─── Supabase data layer ───
function rowsToMap(rows) {
  const map = {};
  rows.forEach(r => {
    if (!map[r.date]) map[r.date] = {};
    map[r.date][r.division] = r.kpi;
  });
  return map;
}

async function loadAllData() {
  const { data, error } = await supabase.from("kpi_sales").select("*").order("date", { ascending: true });
  if (error) throw error;
  return rowsToMap(data || []);
}

async function upsertDayData(date, results) {
  const rows = Object.entries(results).map(([division, kpi]) => ({ date, division, kpi }));
  const { error } = await supabase.from("kpi_sales").upsert(rows, { onConflict: "date,division" });
  if (error) throw error;
}

async function seedIfEmpty() {
  const { count, error } = await supabase.from("kpi_sales").select("*", { count: "exact", head: true });
  if (error) throw error;
  if (count === 0) {
    const { error: insertError } = await supabase.from("kpi_sales").insert(MARCH_SEED);
    if (insertError) throw insertError;
    return true;
  }
  return false;
}

// ─── Components ───
function KPIBadge({ value, size = "normal" }) {
  if (value == null) return <span style={{ color: TH.g400 }}>—</span>;
  const pos = value >= 0;
  const c = pos ? "#22C55E" : TH.red;
  const bg = pos ? "rgba(34,197,94,0.08)" : "rgba(200,16,46,0.06)";
  if (size === "large") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 30, fontWeight: 700, color: c, fontFamily: "'Barlow Condensed', sans-serif" }}>
        {pos ? "+" : "−"}{Math.abs(value).toFixed(2)}%
      </span>
      {pos ? <TrendingUp size={22} color={c} /> : <TrendingDown size={22} color={c} />}
    </div>
  );
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 4, background: bg, border: `1px solid ${c}18` }}>
      {pos ? <TrendingUp size={12} color={c} /> : <TrendingDown size={12} color={c} />}
      <span style={{ fontSize: 13, fontWeight: 600, color: c, fontFamily: "'Barlow Condensed', sans-serif" }}>
        {pos ? "+" : "−"}{Math.abs(value).toFixed(2)}%
      </span>
    </div>
  );
}

function StatCard({ title, value, subtitle, color }) {
  return (
    <div style={{ background: TH.white, borderRadius: 8, padding: "20px 22px", border: `1px solid ${TH.g200}`, position: "relative", overflow: "hidden", flex: 1, minWidth: 190 }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: 4, bottom: 0, background: color }} />
      <span style={{ fontSize: 11, fontWeight: 700, color: TH.g400, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'Barlow', sans-serif" }}>{title}</span>
      <div style={{ marginTop: 8 }}><KPIBadge value={value} size="large" /></div>
      {subtitle && <div style={{ marginTop: 8, fontSize: 11.5, color: TH.g400, fontFamily: "'Barlow', sans-serif" }}>{subtitle}</div>}
    </div>
  );
}

// ─── Main Dashboard ───
export default function KPIDashboard({ session }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  const [allData, setAllData] = useState({});
  const [activeMonth, setActiveMonth] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [uploadDate, setUploadDate] = useState(new Date().toISOString().split("T")[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const fileInputRef = useRef(null);

  // Load data from Supabase on mount
  useEffect(() => {
    (async () => {
      try {
        await seedIfEmpty();
        const data = await loadAllData();
        setAllData(data);
        const months = getAvailableMonths(data);
        setActiveMonth(months[months.length - 1]);
      } catch (err) {
        console.error("Failed to load data:", err);
        setLoadError(err.message);
      }
      setIsLoaded(true);
    })();
  }, []);

  const handleUpload = useCallback(async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true); setUploadResult(null);
    const dm = { torreon: "TORREÓN", ramos: "RAMOS", bajio: "BAJÍO", todos: "TODOS" };
    const results = {};
    for (const f of files) {
      const { rows } = parseCSV(await f.text());
      const n = f.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      let dk = null;
      for (const [p, l] of Object.entries(dm)) { if (n.includes(p)) { dk = l; break; } }
      if (!dk) continue;
      const kpi = computeKPI(rows);
      if (kpi != null) results[dk] = Math.round(kpi * 100) / 100;
    }
    if (Object.keys(results).length) {
      const ds = uploadDate;
      try {
        await upsertDayData(ds, results);
        const existed = allData[ds];
        // Reload all data from Supabase to stay in sync
        const freshData = await loadAllData();
        setAllData(freshData);
        setActiveMonth(getMonthKey(ds));
        setUploadResult({
          success: true,
          message: `${Object.keys(results).length} divisiones procesadas — ${fmtDate(ds)}${existed ? " (datos actualizados)" : ""}`,
          details: results,
        });
      } catch (err) {
        setUploadResult({ success: false, message: `Error al guardar: ${err.message}` });
      }
    } else {
      setUploadResult({ success: false, message: "No se pudieron procesar los archivos. Verifica el formato." });
    }
    setUploading(false);
    setShowDatePicker(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [uploadDate, allData]);

  // Filter by active month
  const monthData = {};
  Object.entries(allData).forEach(([d, v]) => {
    if (activeMonth && getMonthKey(d) === activeMonth) monthData[d] = v;
  });

  const sorted = Object.keys(monthData).sort();
  const latest = monthData[sorted[sorted.length - 1]] || {};
  const prev = sorted.length > 1 ? monthData[sorted[sorted.length - 2]] : {};
  const latestDate = sorted[sorted.length - 1];
  const availableMonths = getAvailableMonths(allData);

  const trendData = sorted.map(d => ({ date: fmtShort(d), ...monthData[d] }));
  const barData = ALL_COLS.map(d => ({ name: d === "TODOS" ? "Compañía" : d, value: latest[d] || 0, fill: DC[d] }));

  const dayChg = {};
  ALL_COLS.forEach(d => { if (latest[d] != null && prev[d] != null) dayChg[d] = Math.round((latest[d] - prev[d]) * 100) / 100; });

  const divE = DIVISIONS.map(d => ({ name: d, value: latest[d] })).filter(d => d.value != null);
  const best = divE.length ? divE.reduce((a, b) => a.value > b.value ? a : b) : null;
  const worst = divE.length ? divE.reduce((a, b) => a.value < b.value ? a : b) : null;

  const tabs = [
    { id: "overview", label: "Resumen", icon: BarChart3 },
    { id: "table", label: "Tabla KPI", icon: Table2 },
    { id: "trends", label: "Tendencias", icon: TrendingDown },
  ];

  const ttip = {
    contentStyle: { background: TH.navy, border: `1px solid ${TH.navyLight}`, borderRadius: 6, padding: "10px 14px", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" },
    labelStyle: { color: TH.g400, fontSize: 11, marginBottom: 4 },
    itemStyle: { color: TH.white, fontSize: 12, fontFamily: "'Barlow Condensed', sans-serif" },
  };

  const monthDisplayName = activeMonth ? getMonthName(activeMonth + "-01") : "";

  if (!isLoaded) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: TH.offWhite, fontFamily: "'Barlow', sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <img src={LOGO_B64} alt="TIMSA" style={{ height: 50, marginBottom: 20 }} />
        <p style={{ color: TH.g400, fontSize: 14 }}>Cargando datos...</p>
      </div>
    </div>
  );

  if (loadError) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: TH.offWhite, fontFamily: "'Barlow', sans-serif" }}>
      <div style={{ textAlign: "center", maxWidth: 400, padding: 40 }}>
        <AlertTriangle size={40} color={TH.red} style={{ marginBottom: 16 }} />
        <h2 style={{ color: TH.navy, fontSize: 18, marginBottom: 8 }}>Error de conexión</h2>
        <p style={{ color: TH.g400, fontSize: 13, lineHeight: 1.6 }}>{loadError}</p>
        <button onClick={() => window.location.reload()} style={{ marginTop: 16, padding: "10px 24px", background: TH.red, color: TH.white, border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontFamily: "'Barlow', sans-serif" }}>
          Reintentar
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: TH.offWhite, fontFamily: "'Barlow', sans-serif", color: TH.g800 }}>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${TH.navy} 0%, ${TH.navyMid} 60%, ${TH.navyLight} 100%)`, padding: "0 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, paddingBottom: 12, borderBottom: `1px solid ${TH.navyLight}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <img src={LOGO_B64} alt="TIMSA" style={{ height: 40 }} />
            <div style={{ width: 1, height: 28, background: TH.navyLight }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: TH.g400, textTransform: "uppercase", letterSpacing: "0.15em" }}>Inteligencia Comercial</span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", position: "relative" }}>
            <button onClick={() => setShowDatePicker(!showDatePicker)} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 6,
              border: `1px solid ${TH.navyLight}`, background: showDatePicker ? TH.navyLight : "transparent",
              color: showDatePicker ? TH.white : TH.g400, cursor: "pointer", fontSize: 12, fontWeight: 600,
              fontFamily: "'Barlow', sans-serif", transition: "all 0.2s",
            }}>
              <CalendarDays size={13} /> {uploadDate}
            </button>
            <label style={{
              display: "flex", alignItems: "center", gap: 7, padding: "8px 18px", borderRadius: 6,
              background: TH.red, color: TH.white, cursor: "pointer", fontSize: 12, fontWeight: 700,
              fontFamily: "'Barlow', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em",
              opacity: uploading ? 0.7 : 1,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = TH.redLight; }}
              onMouseLeave={e => { e.currentTarget.style.background = TH.red; }}>
              <Upload size={14} />{uploading ? "Procesando..." : "Subir CSVs"}
              <input ref={fileInputRef} type="file" multiple accept=".csv" onChange={handleUpload} style={{ display: "none" }} disabled={uploading} />
            </label>
            <button onClick={handleLogout} title="Cerrar sesión" style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 6,
              border: `1px solid ${TH.navyLight}`, background: "transparent",
              color: TH.g400, cursor: "pointer", fontSize: 12, fontWeight: 600,
              fontFamily: "'Barlow', sans-serif", transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = TH.g400; e.currentTarget.style.color = TH.white; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = TH.navyLight; e.currentTarget.style.color = TH.g400; }}>
              <LogOut size={14} />
            </button>
          </div>
        </div>

        {showDatePicker && (
          <div style={{ position: "absolute", right: 40, top: 64, zIndex: 100, background: TH.white, borderRadius: 8, padding: 16, border: `1px solid ${TH.g200}`, boxShadow: "0 12px 40px rgba(0,0,0,0.15)", minWidth: 260 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: TH.navy }}>Fecha de los datos</span>
              <button onClick={() => setShowDatePicker(false)} style={{ background: "none", border: "none", cursor: "pointer", color: TH.g400, padding: 2 }}><X size={16} /></button>
            </div>
            <input type="date" value={uploadDate} onChange={e => setUploadDate(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: `1px solid ${TH.g200}`, fontSize: 14, fontFamily: "'Barlow', sans-serif", color: TH.navy, outline: "none" }} />
            <p style={{ fontSize: 11, color: TH.g400, marginTop: 8, lineHeight: 1.5 }}>
              Selecciona la fecha y luego sube los CSVs. Si la fecha ya existe, los datos serán reemplazados.
            </p>
          </div>
        )}

        <div style={{ paddingTop: 20, paddingBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: TH.white, margin: 0, fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase", letterSpacing: "0.04em" }}>KPI de Ventas</h1>
            <p style={{ fontSize: 14, color: TH.g400, marginTop: 4, fontWeight: 500, textTransform: "capitalize" }}>
              {monthDisplayName} <span style={{ margin: "0 8px", opacity: 0.3 }}>|</span> Proyección vs Presupuesto
            </p>
          </div>
          {availableMonths.length > 1 && (
            <div style={{ display: "flex", gap: 6 }}>
              {availableMonths.map(mk => (
                <button key={mk} onClick={() => setActiveMonth(mk)} style={{
                  padding: "6px 14px", borderRadius: 6, border: `1px solid ${activeMonth === mk ? TH.red : TH.navyLight}`,
                  background: activeMonth === mk ? TH.red : "transparent",
                  color: activeMonth === mk ? TH.white : TH.g400,
                  fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Barlow', sans-serif",
                  textTransform: "capitalize",
                }}>
                  {getMonthName(mk + "-01").split(" ")[0]}
                </button>
              ))}
            </div>
          )}
        </div>

        {uploadResult && (
          <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 6, background: uploadResult.success ? "rgba(34,197,94,0.1)" : "rgba(200,16,46,0.1)", border: `1px solid ${uploadResult.success ? "#22C55E33" : TH.red + "33"}`, display: "flex", alignItems: "center", gap: 8 }}>
            {uploadResult.success ? <CheckCircle2 size={14} color="#22C55E" /> : <AlertTriangle size={14} color={TH.red} />}
            <span style={{ fontSize: 12, color: uploadResult.success ? "#22C55E" : TH.red, fontWeight: 600 }}>{uploadResult.message}</span>
            {uploadResult.details && <span style={{ fontSize: 11, color: TH.g400, marginLeft: 8 }}>{Object.entries(uploadResult.details).map(([k, v]) => `${k}: ${v.toFixed(2)}%`).join(" · ")}</span>}
            <button onClick={() => setUploadResult(null)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: TH.g400, padding: 2 }}><X size={14} /></button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, padding: "0 40px", background: TH.navy, borderBottom: `3px solid ${TH.red}` }}>
        {tabs.map(t => {
          const a = activeTab === t.id; const I = t.icon;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "12px 24px", border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: a ? 700 : 500, fontFamily: "'Barlow', sans-serif",
              textTransform: "uppercase", letterSpacing: "0.06em",
              color: a ? TH.white : TH.g400, background: a ? TH.red : "transparent",
            }}
              onMouseEnter={e => { if (!a) e.currentTarget.style.color = TH.white; }}
              onMouseLeave={e => { if (!a) e.currentTarget.style.color = TH.g400; }}>
              <I size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ padding: "28px 40px 60px" }}>
        {activeTab === "overview" && (
          <div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
              {ALL_COLS.map(d => (
                <StatCard key={d} title={d === "TODOS" ? "Compañía" : d} value={latest[d]}
                  subtitle={dayChg[d] != null ? `${dayChg[d] >= 0 ? "+" : ""}${dayChg[d].toFixed(2)}pp vs día anterior` : latestDate ? fmtDate(latestDate) : "—"}
                  color={DC[d]} />
              ))}
            </div>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              <div style={{ flex: 2, minWidth: 480, background: TH.white, borderRadius: 8, padding: 24, border: `1px solid ${TH.g200}` }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: TH.navy, margin: "0 0 20px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Evolución Mensual — Todas las Divisiones</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <defs>{ALL_COLS.map(d => (
                      <linearGradient key={d} id={`g-${d}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={DC[d]} stopOpacity={0.12} /><stop offset="100%" stopColor={DC[d]} stopOpacity={0.01} />
                      </linearGradient>
                    ))}</defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={TH.g100} />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: TH.g400 }} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: TH.g400 }} tickLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip {...ttip} formatter={v => [`${v.toFixed(2)}%`]} />
                    <ReferenceLine y={0} stroke="#22C55E" strokeDasharray="4 4" strokeWidth={1.5} />
                    {ALL_COLS.map(d => <Area key={d} type="monotone" dataKey={d} stroke={DC[d]} strokeWidth={2.5} fill={`url(#g-${d})`} dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }} />)}
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 11, fontFamily: "'Barlow', sans-serif", paddingTop: 12 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: 1, minWidth: 280, background: TH.white, borderRadius: 8, padding: 24, border: `1px solid ${TH.g200}`, display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: TH.navy, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Comparativa del Día</h3>
                <p style={{ fontSize: 11, color: TH.g400, margin: "0 0 16px" }}>{latestDate ? fmtDate(latestDate) : "—"}</p>
                <div style={{ flex: 1 }}>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={TH.g100} horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 10, fill: TH.g400 }} tickFormatter={v => `${v}%`} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: TH.g600, fontWeight: 600 }} width={80} />
                      <Tooltip {...ttip} formatter={v => [`${v.toFixed(2)}%`, "KPI"]} />
                      <ReferenceLine x={0} stroke="#22C55E" strokeDasharray="4 4" />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>{barData.map((e, i) => <rect key={i} fill={e.fill} />)}</Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ marginTop: 12, padding: "14px 16px", borderRadius: 6, background: TH.offWhite, border: `1px solid ${TH.g200}` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: TH.g400, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>Insights</div>
                  {best && <div style={{ fontSize: 12, color: TH.g600, marginBottom: 4, fontWeight: 500 }}><span style={{ color: "#22C55E", fontWeight: 700 }}>Mejor:</span> {best.name} ({best.value?.toFixed(2)}%)</div>}
                  {worst && <div style={{ fontSize: 12, color: TH.g600, fontWeight: 500 }}><span style={{ color: TH.red, fontWeight: 700 }}>Rezagada:</span> {worst.name} ({worst.value?.toFixed(2)}%)</div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "table" && (
          <div style={{ background: TH.white, borderRadius: 8, overflow: "hidden", border: `1px solid ${TH.g200}` }}>
            <div style={{ padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: `linear-gradient(135deg, ${TH.navy}, ${TH.navyMid})` }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: TH.white, margin: 0, fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>KPI Venta — {monthDisplayName}</h3>
                <p style={{ fontSize: 11, color: TH.g400, margin: "3px 0 0" }}>Diferencia porcentual: Proyección vs Presupuesto</p>
              </div>
              <div style={{ padding: "5px 12px", borderRadius: 4, background: TH.navyLight, fontSize: 11, color: TH.g400, fontWeight: 600 }}>{sorted.length} días</div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead><tr>
                  <th style={{ padding: "11px 24px", textAlign: "left", fontWeight: 700, color: TH.navy, fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: `2px solid ${TH.navy}`, background: TH.g100 }}>Fecha</th>
                  {ALL_COLS.map(d => <th key={d} style={{ padding: "11px 20px", textAlign: "center", fontWeight: 700, color: DC[d], fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: `2px solid ${DC[d]}`, background: TH.g100 }}>{d === "TODOS" ? "COMPAÑÍA" : d}</th>)}
                </tr></thead>
                <tbody>
                  {sorted.map((date, idx) => {
                    const row = monthData[date]; const isLast = idx === sorted.length - 1;
                    return (
                      <tr key={date} style={{ background: isLast ? "#FFF7ED" : idx % 2 === 0 ? TH.white : TH.offWhite }}
                        onMouseEnter={e => { if (!isLast) e.currentTarget.style.background = TH.g100; }}
                        onMouseLeave={e => { if (!isLast) e.currentTarget.style.background = idx % 2 === 0 ? TH.white : TH.offWhite; }}>
                        <td style={{ padding: "10px 24px", borderBottom: `1px solid ${TH.g100}`, fontWeight: isLast ? 700 : 500, color: isLast ? TH.navy : TH.g600, fontSize: 12.5, whiteSpace: "nowrap" }}>
                          {fmtDate(date)}
                          {isLast && <span style={{ marginLeft: 8, fontSize: 9, fontWeight: 700, color: TH.red, background: "rgba(200,16,46,0.06)", border: `1px solid ${TH.red}22`, padding: "2px 6px", borderRadius: 3, textTransform: "uppercase" }}>Último</span>}
                        </td>
                        {ALL_COLS.map(d => <td key={d} style={{ padding: "10px 20px", textAlign: "center", borderBottom: `1px solid ${TH.g100}` }}><KPIBadge value={row[d]} /></td>)}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "trends" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {ALL_COLS.map(div => {
              const dd = sorted.map(d => ({ date: fmtShort(d), value: monthData[d][div] })).filter(d => d.value != null);
              const imp = dd.length >= 2 ? dd[dd.length - 1].value - dd[0].value : null;
              return (
                <div key={div} style={{ background: TH.white, borderRadius: 8, padding: 24, border: `1px solid ${TH.g200}`, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: 4, bottom: 0, background: DC[div] }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: TH.navy, margin: 0, fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      {div === "TODOS" ? "Compañía Total" : div}
                    </h4>
                    {imp != null && (
                      <div style={{ padding: "3px 10px", borderRadius: 4, background: imp > 0 ? "rgba(34,197,94,0.08)" : "rgba(200,16,46,0.06)", fontSize: 11, fontWeight: 700, color: imp > 0 ? "#22C55E" : TH.red, fontFamily: "'Barlow Condensed', sans-serif" }}>
                        {imp > 0 ? "↑" : "↓"} {Math.abs(imp).toFixed(1)}pp
                      </div>
                    )}
                  </div>
                  <ResponsiveContainer width="100%" height={190}>
                    <AreaChart data={dd} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                      <defs><linearGradient id={`tg-${div}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={DC[div]} stopOpacity={0.18} /><stop offset="100%" stopColor={DC[div]} stopOpacity={0.02} /></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={TH.g100} />
                      <XAxis dataKey="date" tick={{ fontSize: 9, fill: TH.g400 }} tickLine={false} interval="preserveStartEnd" />
                      <YAxis tick={{ fontSize: 9, fill: TH.g400 }} tickLine={false} tickFormatter={v => `${v}%`} />
                      <Tooltip {...ttip} formatter={v => [`${v.toFixed(2)}%`, div]} />
                      <ReferenceLine y={0} stroke="#22C55E" strokeDasharray="3 3" strokeWidth={1} />
                      <Area type="monotone" dataKey="value" stroke={DC[div]} strokeWidth={2.5} fill={`url(#tg-${div})`} dot={{ r: 3, fill: DC[div], strokeWidth: 0 }} activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "16px 40px", background: TH.navy, borderTop: `3px solid ${TH.red}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: TH.g400, fontWeight: 500 }}>TIMSA — Transporte Intermodal Mexicano S.A.</span>
        <span style={{ fontSize: 10, color: TH.g400, opacity: 0.6 }}>Dashboard de Inteligencia Comercial</span>
      </div>

      <style>{`* { box-sizing: border-box; } ::-webkit-scrollbar { width: 5px; height: 5px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: ${TH.g200}; border-radius: 3px; }`}</style>
    </div>
  );
}
