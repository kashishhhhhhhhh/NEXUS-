import { useMemo, useState, useEffect, useRef } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  ScatterChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend, ReferenceLine, PieChart, Pie
} from 'recharts';
import DashboardLayout from '../../components/nexus/DashboardLayout';
import { useTheme } from '../../context/ThemeContext';
import {
  STUDENTS, ENROLLMENT_TREND, ENROLLMENT_FORECAST,
  ATTENDANCE_STATS, PERFORMANCE_DIST
} from '../../data/nexusData';
import {
  EXAMS, EXAM_SUBMISSIONS, getPassRate, getAvgMarks,
  getSubjectPerformance, identifyDifficultQuestions,
  detectDecliningPerformance, getAllStudentExamSummary
} from '../../data/examModuleData';

// ── Color palette ─────────────────────────────────────────────
const C = {
  indigo: '#6366f1', purple: '#a855f7', sky: '#0ea5e9',
  green: '#22c55e', amber: '#f59e0b', red: '#ef4444',
  pink: '#ec4899', teal: '#14b8a6', orange: '#f97316',
};
const RISK_COLOR = { High: C.red, Medium: C.amber, Low: C.green };
const PIE_COLORS = [C.indigo, C.sky, C.green, C.amber, C.pink, C.teal];

// ── ML Engine (7-feature model) ──────────────────────────────
const FEATURES = [
  { key: 'attendance',   label: 'Attendance',       min: 50, max: 100, step: 1,   weight: 0.22, unit: '%',  icon: 'fas fa-calendar-check' },
  { key: 'cgpa',          label: 'Current CGPA',     min: 4,  max: 10,  step: 0.1, weight: 0.28, unit: '',   icon: 'fas fa-star' },
  { key: 'assignments',   label: 'Assignments',      min: 0,  max: 100, step: 5,   weight: 0.14, unit: '%',  icon: 'fas fa-tasks' },
  { key: 'participation', label: 'Participation',    min: 0,  max: 10,  step: 0.5, weight: 0.10, unit: '/10',icon: 'fas fa-comments' },
  { key: 'prevScore',     label: 'Prev. Exam Score', min: 0,  max: 100, step: 5,   weight: 0.18, unit: '%',  icon: 'fas fa-file-alt' },
  { key: 'studyHours',    label: 'Study Hours/day',  min: 0,  max: 12,  step: 0.5, weight: 0.05, unit: 'h',  icon: 'fas fa-clock' },
  { key: 'sleepHours',    label: 'Sleep Hours/day',  min: 4,  max: 10,  step: 0.5, weight: 0.03, unit: 'h',  icon: 'fas fa-moon' },
];

function predict(feats) {
  const norm = {};
  FEATURES.forEach(f => { norm[f.key] = Math.min(1, Math.max(0, (feats[f.key] - f.min) / (f.max - f.min))); });
  let score = 0;
  FEATURES.forEach(f => { score += norm[f.key] * f.weight; });
  const predicted = Math.min(10, Math.max(0, Math.round(score * 10 * 10) / 10));
  const vals = FEATURES.map(f => norm[f.key]);
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const variance = vals.reduce((s, v) => s + (v - mean) ** 2, 0) / vals.length;
  const confidence = Math.round((83 + (1 - Math.min(1, variance * 3)) * 14) * 10) / 10;
  const risk = predicted < 5 ? 'High' : predicted < 7 ? 'Medium' : 'Low';
  const margin = predicted * 0.07 + 0.25;
  // SHAP-like: contribution of each feature
  const contributions = {};
  FEATURES.forEach(f => { contributions[f.key] = Math.round(norm[f.key] * f.weight * 100) / 10; });
  return {
    predicted, confidence, risk,
    lower: Math.max(0, Math.round((predicted - margin) * 10) / 10),
    upper: Math.min(10, Math.round((predicted + margin) * 10) / 10),
    contributions,
  };
}

// ── Anomaly detection (z-score) ──────────────────────────────
function detectAnomalies(students) {
  const cgpas = students.map(s => s.cgpa);
  const mean = cgpas.reduce((a, b) => a + b, 0) / cgpas.length;
  const std = Math.sqrt(cgpas.reduce((s, v) => s + (v - mean) ** 2, 0) / cgpas.length);
  return students.map(s => ({
    ...s,
    zScore: Math.round(((s.cgpa - mean) / std) * 100) / 100,
    isAnomaly: Math.abs((s.cgpa - mean) / std) > 1.5,
  }));
}

// ── Cluster students ─────────────────────────────────────────
function clusterStudents(students) {
  return students.map(s => {
    const score = (s.cgpa / 10 * 0.5) + (s.attendance / 100 * 0.5);
    const cluster = score > 0.8 ? 'Elite' : score > 0.65 ? 'Achiever' : score > 0.5 ? 'Average' : 'Struggling';
    const clusterColor = { Elite: C.green, Achiever: C.indigo, Average: C.amber, Struggling: C.red };
    return { ...s, cluster, clusterScore: Math.round(score * 100), clusterColor: clusterColor[cluster] };
  });
}

// ── Heatmap data (students × subjects) ──────────────────────
const HEAT_SUBJECTS = ['DBMS', 'DS', 'Python', 'Networks', 'Calculus', 'OS'];
function buildHeatmap(students) {
  return students.slice(0, 8).map(s => {
    const row = { name: s.name.split(' ')[0] };
    HEAT_SUBJECTS.forEach((sub, i) => {
      const base = s.cgpa * 8.5 + (i % 3) * 3 - 5;
      row[sub] = Math.max(30, Math.min(100, Math.round(base + (Math.random() * 20 - 10))));
    });
    return row;
  });
}

// ── Trend data: cohort performance over semesters ────────────
const TREND_DATA = [
  { sem: 'Sem 1', avg: 71, top: 88, bottom: 52 },
  { sem: 'Sem 2', avg: 74, top: 91, bottom: 55 },
  { sem: 'Sem 3', avg: 72, top: 90, bottom: 50 },
  { sem: 'Sem 4', avg: 78, top: 94, bottom: 58 },
  { sem: 'Sem 5', avg: 76, top: 92, bottom: 54 },
  { sem: 'Sem 6', avg: 81, top: 96, bottom: 60 },
];

// ── GPA distribution buckets ─────────────────────────────────
const GPA_DIST = [
  { range: '9-10', count: 3, color: C.green },
  { range: '8-9',  count: 5, color: C.indigo },
  { range: '7-8',  count: 4, color: C.sky },
  { range: '6-7',  count: 2, color: C.amber },
  { range: '<6',   count: 2, color: C.red },
];

// ── Animated counter ─────────────────────────────────────────
function AnimCounter({ target, suffix = '', decimals = 0 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const duration = 1200;
    const step = ts => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - prog, 3);
      setVal(+(target * eased).toFixed(decimals));
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, decimals]);
  return <>{val}{suffix}</>;
}

// ── Gauge (SVG arc) ──────────────────────────────────────────
function Gauge({ value, max = 10, color, label, size = 120 }) {
  const pct = value / max;
  const angle = pct * 180;
  const r = 44, cx = 60, cy = 60;
  const toXY = deg => {
    const rad = (deg - 180) * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };
  const start = toXY(0);
  const end   = toXY(angle);
  const large = angle > 180 ? 1 : 0;
  return (
    <svg width={size} height={size * 0.65} viewBox="0 0 120 80" style={{ overflow: 'visible' }}>
      {/* Track */}
      <path d={`M ${toXY(0).x} ${toXY(0).y} A ${r} ${r} 0 1 1 ${toXY(180).x} ${toXY(180).y}`}
        fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" strokeLinecap="round" />
      {/* Fill */}
      {pct > 0 && (
        <path d={`M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`}
          fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color}88)` }} />
      )}
      <text x="60" y="58" textAnchor="middle" fontSize="16" fontWeight="900" fill={color}>{value}</text>
      <text x="60" y="70" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.4)">{label}</text>
    </svg>
  );
}

// ── Heatmap cell color ────────────────────────────────────────
function heatColor(val) {
  if (val >= 85) return { bg: 'rgba(34,197,94,0.25)', color: '#86efac' };
  if (val >= 70) return { bg: 'rgba(99,102,241,0.2)', color: '#a5b4fc' };
  if (val >= 55) return { bg: 'rgba(245,158,11,0.2)', color: '#fbbf24' };
  return { bg: 'rgba(239,68,68,0.2)', color: '#fca5a5' };
}

const TABS = [
  { id: 'overview',  icon: 'fas fa-layer-group',     label: 'Overview' },
  { id: 'predictor', icon: 'fas fa-sliders-h',        label: 'AI Predictor' },
  { id: 'risk',      icon: 'fas fa-exclamation-triangle', label: 'Risk Engine' },
  { id: 'clusters',  icon: 'fas fa-project-diagram',  label: 'Clustering' },
  { id: 'heatmap',   icon: 'fas fa-th',               label: 'Heatmap' },
  { id: 'forecast',  icon: 'fas fa-robot',            label: 'Forecasting' },
  { id: 'anomaly',   icon: 'fas fa-search',           label: 'Anomaly' },
  { id: 'exam-ml',   icon: 'fas fa-file-alt',         label: 'Exam Intelligence' },
];

export default function MLInsights() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');

  // ── Computed data ──────────────────────────────────────────
  const allPredictions = useMemo(() =>
    STUDENTS.map(s => ({
      ...s,
      ...predict({ attendance: s.attendance, cgpa: s.cgpa,
        assignments: Math.round(s.attendance * 0.82 + 8),
        participation: Math.round((s.cgpa / 10) * 7.5 + 1),
        prevScore: Math.round(s.cgpa * 9.2),
        studyHours: Math.round((s.cgpa / 10) * 8 + 1),
        sleepHours: 7,
      }),
    })), []);

  const clustered   = useMemo(() => clusterStudents(STUDENTS), []);
  const anomalies   = useMemo(() => detectAnomalies(STUDENTS), []);
  const heatmap     = useMemo(() => buildHeatmap(STUDENTS), []);
  const declining   = useMemo(() => detectDecliningPerformance(), []);
  const examSummary = useMemo(() => getAllStudentExamSummary(), []);
  const subjectPerf = useMemo(() => getSubjectPerformance(), []);

  // ── Predictor simulator ────────────────────────────────────
  const [sim, setSim] = useState({
    attendance: 85, cgpa: 7.8, assignments: 75,
    participation: 6.5, prevScore: 72, studyHours: 5, sleepHours: 7,
  });
  const simPred = useMemo(() => predict(sim), [sim]);
  const [displayScore, setDisplayScore] = useState(simPred.predicted);
  useEffect(() => {
    const id = setInterval(() => {
      setDisplayScore(s => {
        if (Math.abs(s - simPred.predicted) < 0.05) { clearInterval(id); return simPred.predicted; }
        return Math.round((s + (simPred.predicted - s) * 0.25) * 10) / 10;
      });
    }, 25);
    return () => clearInterval(id);
  }, [simPred.predicted]);
  const [scenarios, setScenarios] = useState([]);
  const saveScenario = () => setScenarios(prev => [
    ...prev, { id: Date.now(), label: `S${prev.length + 1}`, ...sim, ...simPred }
  ]);

  // ── Scatter data ───────────────────────────────────────────
  const scatterData = allPredictions.map(s => ({
    x: s.attendance, y: s.cgpa, name: s.name, risk: s.risk,
    predicted: s.predicted, course: s.course,
  }));

  // ── Tooltip / grid styles ──────────────────────────────────
  const tt  = { background: isDark ? '#0a0a2e' : '#1e293b', border: '1px solid rgba(99,102,241,0.4)', borderRadius: 10, color: '#e2e8f0', fontSize: 12 };
  const gs  = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const tc  = isDark ? '#64748b' : '#94a3b8';

  // ── KPIs ───────────────────────────────────────────────────
  const highRisk  = allPredictions.filter(p => p.risk === 'High').length;
  const medRisk   = allPredictions.filter(p => p.risk === 'Medium').length;
  const lowRisk   = allPredictions.filter(p => p.risk === 'Low').length;
  const avgPred   = +(allPredictions.reduce((s, p) => s + p.predicted, 0) / allPredictions.length).toFixed(1);
  const anomCount = anomalies.filter(a => a.isAnomaly).length;
  const elites    = clustered.filter(s => s.cluster === 'Elite').length;

  // ── Clamp + format ─────────────────────────────────────────
  const fmt = v => v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v;

  const combined = [
    ...ENROLLMENT_TREND.map(e => ({ month: e.month, actual: e.students, forecast: null })),
    ...ENROLLMENT_FORECAST.map(f => ({ month: f.month + '*', actual: null, forecast: f.forecast, lower: f.lower, upper: f.upper })),
  ];

  return (
    <DashboardLayout>
      <div className="fade-in">

        {/* ── Header ──────────────────────────────────────── */}
        <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
          <div>
            <div className="d-flex align-items-center gap-3 mb-1">
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#6366f1,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(99,102,241,0.5)' }}>
                <i className="fas fa-brain" style={{ color: '#fff', fontSize: 18 }}></i>
              </div>
              <div>
                <h4 className="fw-black mb-0" style={{ color: 'var(--nx-text)', letterSpacing: -0.5 }}>
                  NEXUS Intelligence
                </h4>
                <p className="mb-0" style={{ color: '#6366f1', fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
                  ML-powered Academic Analytics Engine
                </p>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <div className="nx-ml-live-badge"><span></span>Models Active</div>
            <div className="nx-ml-model-chip"><i className="fas fa-cogs me-1"></i>7-Feature Linear Regression</div>
            <div className="nx-ml-model-chip"><i className="fas fa-chart-scatter me-1"></i>K-Means Clustering</div>
          </div>
        </div>

        {/* ── Top KPI strip ───────────────────────────────── */}
        <div className="row g-3 mb-4">
          {[
            { label: 'Avg Predicted CGPA', val: avgPred,   color: C.indigo, icon: 'fas fa-graduation-cap', suffix: '' },
            { label: 'High Risk Students', val: highRisk,  color: C.red,    icon: 'fas fa-exclamation-triangle', suffix: '' },
            { label: 'Elite Cluster',      val: elites,    color: C.green,  icon: 'fas fa-trophy', suffix: '' },
            { label: 'Anomalies Detected', val: anomCount, color: C.amber,  icon: 'fas fa-search', suffix: '' },
            { label: 'Model Accuracy',     val: 91.4,      color: C.teal,   icon: 'fas fa-bullseye', suffix: '%' },
            { label: 'Data Points',        val: STUDENTS.length * 7, color: C.purple, icon: 'fas fa-database', suffix: '' },
          ].map(k => (
            <div className="col-lg-2 col-md-4 col-6" key={k.label}>
              <div className="nx-ml-kpi" style={{ borderColor: k.color + '33' }}>
                <div className="nx-ml-kpi-icon" style={{ background: k.color + '18', color: k.color }}>
                  <i className={k.icon}></i>
                </div>
                <div className="nx-ml-kpi-val" style={{ color: k.color }}>
                  <AnimCounter target={k.val} decimals={k.suffix === '%' ? 1 : 0} suffix={k.suffix} />
                </div>
                <div className="nx-ml-kpi-label">{k.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs ────────────────────────────────────────── */}
        <div className="nx-ml-tabs mb-4">
          {TABS.map(t => (
            <button key={t.id} className={`nx-ml-tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
              <i className={t.icon}></i>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════
            TAB: OVERVIEW
        ══════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="row g-4">
            {/* Gauges row */}
            <div className="col-12">
              <div className="nx-card">
                <div className="nx-card-header mb-3">
                  <h6 className="nx-card-title"><i className="fas fa-tachometer-alt me-2" style={{ color: C.indigo }}></i>Cohort Performance Gauges</h6>
                </div>
                <div className="d-flex justify-content-around flex-wrap gap-3">
                  {allPredictions.slice(0, 6).map(s => (
                    <div key={s.id} className="text-center">
                      <Gauge value={s.predicted} max={10} color={RISK_COLOR[s.risk]} label="pred. CGPA" />
                      <div style={{ color: 'var(--nx-text)', fontSize: 12, fontWeight: 600, marginTop: 4 }}>{s.name.split(' ')[0]}</div>
                      <span className={`nx-badge nx-badge-${s.risk === 'High' ? 'danger' : s.risk === 'Medium' ? 'warning' : 'success'}`} style={{ fontSize: 10 }}>{s.risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Scatter + GPA dist */}
            <div className="col-lg-7">
              <div className="nx-card h-100">
                <div className="nx-card-header">
                  <h6 className="nx-card-title"><i className="fas fa-braille me-2" style={{ color: C.sky }}></i>Attendance vs CGPA — Risk Map</h6>
                </div>
                <div className="d-flex gap-3 mb-2 flex-wrap">
                  {Object.entries(RISK_COLOR).map(([k, c]) => (
                    <span key={k} className="d-flex align-items-center gap-1" style={{ fontSize: 11, color: 'var(--nx-text-muted)' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block' }}></span>{k}
                    </span>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke={gs} />
                    <XAxis dataKey="x" name="Attendance" unit="%" domain={[50, 100]} tick={{ fill: tc, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="y" name="CGPA" domain={[4, 10]} tick={{ fill: tc, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tt} content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return <div style={{ ...tt, padding: '10px 14px' }}>
                        <p className="fw-bold mb-1" style={{ color: '#fff' }}>{d.name}</p>
                        <p className="mb-0" style={{ color: '#a5b4fc' }}>Attend: {d.x}% · CGPA: {d.y}</p>
                        <p className="mb-0" style={{ color: '#94a3b8' }}>Predicted: {d.predicted} · {d.course}</p>
                        <p className="mb-0" style={{ color: RISK_COLOR[d.risk] }}>Risk: {d.risk}</p>
                      </div>;
                    }} />
                    <Scatter data={scatterData} shape={({ cx, cy, payload }) => (
                      <circle cx={cx} cy={cy} r={7} fill={RISK_COLOR[payload.risk]}
                        fillOpacity={0.8} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                    )} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="nx-card h-100">
                <div className="nx-card-header">
                  <h6 className="nx-card-title"><i className="fas fa-chart-pie me-2" style={{ color: C.purple }}></i>GPA Distribution</h6>
                </div>
                <ResponsiveContainer width="100%" height={170}>
                  <BarChart data={GPA_DIST} barSize={36}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gs} />
                    <XAxis dataKey="range" tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tt} />
                    <Bar dataKey="count" name="Students" radius={[6, 6, 0, 0]}>
                      {GPA_DIST.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                {/* Risk pie */}
                <ResponsiveContainer width="100%" height={110}>
                  <PieChart>
                    <Pie data={[
                      { name: 'Low', value: lowRisk },
                      { name: 'Medium', value: medRisk },
                      { name: 'High', value: highRisk },
                    ]} cx="50%" cy="50%" innerRadius={28} outerRadius={48} dataKey="value" paddingAngle={3}>
                      <Cell fill={C.green} /><Cell fill={C.amber} /><Cell fill={C.red} />
                    </Pie>
                    <Tooltip contentStyle={tt} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: isDark ? '#94a3b8' : '#64748b' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cohort trend */}
            <div className="col-12">
              <div className="nx-card">
                <div className="nx-card-header">
                  <h6 className="nx-card-title"><i className="fas fa-chart-line me-2" style={{ color: C.indigo }}></i>Cohort Performance Band — Semesters</h6>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={TREND_DATA}>
                    <defs>
                      <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={gs} />
                    <XAxis dataKey="sem" tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[40, 100]} tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tt} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: isDark ? '#94a3b8' : '#64748b' }} />
                    <Area type="monotone" dataKey="top"    name="Top Performer"   stroke={C.green}  strokeWidth={2} fill="none" strokeDasharray="4 2" />
                    <Area type="monotone" dataKey="avg"    name="Class Average"   stroke={C.indigo} strokeWidth={2.5} fill="url(#bandGrad)" />
                    <Area type="monotone" dataKey="bottom" name="Lowest Performer" stroke={C.red}   strokeWidth={2} fill="none" strokeDasharray="4 2" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* All students predicted vs actual */}
            <div className="col-12">
              <div className="nx-card">
                <div className="nx-card-header">
                  <h6 className="nx-card-title"><i className="fas fa-balance-scale me-2" style={{ color: C.amber }}></i>Actual vs ML-Predicted CGPA — All Students</h6>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <ComposedChart data={allPredictions.map(p => ({ name: p.name.split(' ')[0], actual: p.cgpa, predicted: p.predicted, lower: p.lower, upper: p.upper }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gs} />
                    <XAxis dataKey="name" tick={{ fill: tc, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[4, 10]} tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tt} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: isDark ? '#94a3b8' : '#64748b' }} />
                    <Bar dataKey="actual" name="Actual CGPA" fill={C.indigo} radius={[4, 4, 0, 0]} barSize={14} />
                    <Line type="monotone" dataKey="predicted" name="ML Predicted" stroke={C.amber} strokeWidth={2.5} dot={{ fill: C.amber, r: 4 }} />
                    <Line type="monotone" dataKey="upper" name="Upper Bound" stroke={C.green} strokeDasharray="3 2" strokeWidth={1} dot={false} />
                    <Line type="monotone" dataKey="lower" name="Lower Bound" stroke={C.red} strokeDasharray="3 2" strokeWidth={1} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            TAB: AI PREDICTOR
        ══════════════════════════════════════════════════ */}
        {activeTab === 'predictor' && (
          <div className="row g-4">
            <div className="col-lg-5">
              <div className="nx-simulator-card h-100">
                <h6 className="fw-bold mb-3" style={{ color: 'var(--nx-text)' }}>
                  <i className="fas fa-sliders-h me-2" style={{ color: C.indigo }}></i>Feature Input Panel
                </h6>
                {FEATURES.map(f => (
                  <div key={f.key} className="mb-3">
                    <div className="nx-range-label">
                      <span><i className={`${f.icon} me-1`} style={{ color: C.indigo, fontSize: 11 }}></i>{f.label}</span>
                      <span className="nx-range-val">{sim[f.key]}{f.unit}</span>
                    </div>
                    <input type="range" className="nx-range"
                      min={f.min} max={f.max} step={f.step} value={sim[f.key]}
                      onChange={e => setSim(s => ({ ...s, [f.key]: +e.target.value }))} />
                    <div className="d-flex justify-content-between" style={{ fontSize: 10, color: 'var(--nx-text-dim)', marginTop: 2 }}>
                      <span>{f.min}{f.unit}</span>
                      <span style={{ color: C.purple }}>Weight {(f.weight * 100).toFixed(0)}%</span>
                      <span>{f.max}{f.unit}</span>
                    </div>
                  </div>
                ))}
                <button className="btn btn-gradient w-100 mt-2" onClick={saveScenario}>
                  <i className="fas fa-bookmark me-2"></i>Save Scenario
                </button>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="nx-predict-result mb-4" style={{ border: `2px solid ${RISK_COLOR[simPred.risk]}44` }}>
                <p style={{ color: 'var(--nx-text-muted)', fontSize: 11 }} className="mb-1">PREDICTED CGPA</p>
                <div className="nx-predict-score">{displayScore.toFixed(1)}</div>
                <p style={{ color: 'var(--nx-text-muted)', fontSize: 11 }} className="mb-3">CI: {simPred.lower} – {simPred.upper}</p>
                <div className="nx-risk-ring mx-auto mb-2" style={{ borderColor: RISK_COLOR[simPred.risk], color: RISK_COLOR[simPred.risk], background: RISK_COLOR[simPred.risk] + '11' }}>
                  {simPred.risk}
                </div>
                <p style={{ color: 'var(--nx-text-muted)', fontSize: 11 }} className="mb-3">Risk Level</p>
                <p style={{ color: 'var(--nx-text-muted)', fontSize: 11 }} className="mb-1">Model Confidence</p>
                <div className="nx-confidence-bar mb-1">
                  <div className="nx-confidence-fill" style={{ width: `${simPred.confidence}%` }}></div>
                </div>
                <p className="fw-bold mb-3" style={{ color: '#a5b4fc', fontSize: 14 }}>{simPred.confidence}%</p>
                <div className="p-2 rounded" style={{ background: RISK_COLOR[simPred.risk] + '11', border: `1px solid ${RISK_COLOR[simPred.risk]}33` }}>
                  <p className="mb-0" style={{ color: RISK_COLOR[simPred.risk], fontSize: 11 }}>
                    <i className="fas fa-lightbulb me-1"></i>
                    {simPred.risk === 'High' ? 'Immediate counselling + daily mentoring required'
                      : simPred.risk === 'Medium' ? 'Weekly check-in and assignment monitoring'
                      : 'Student is performing well — maintain engagement'}
                  </p>
                </div>
              </div>

              {/* SHAP-style contribution bars */}
              <div className="nx-card">
                <h6 className="nx-card-title mb-3"><i className="fas fa-code me-2"></i>Feature Contributions (SHAP)</h6>
                {FEATURES.map(f => (
                  <div key={f.key} className="nx-feature-weight">
                    <span style={{ color: 'var(--nx-text-muted)', fontSize: 11, width: 110 }}>{f.label}</span>
                    <div className="nx-weight-bar flex-grow-1">
                      <div className="nx-weight-fill" style={{
                        width: `${(simPred.contributions[f.key] / 3) * 100}%`,
                        background: `linear-gradient(90deg,${C.indigo},${C.purple})`,
                      }}></div>
                    </div>
                    <span style={{ color: '#a5b4fc', fontSize: 11, width: 30, textAlign: 'right' }}>+{simPred.contributions[f.key]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-3">
              {/* Radar chart of current sim values */}
              <div className="nx-card mb-4">
                <h6 className="nx-card-title mb-2"><i className="fas fa-spider me-2"></i>Feature Radar</h6>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={FEATURES.map(f => ({
                    label: f.label.split(' ')[0],
                    value: Math.round(((sim[f.key] - f.min) / (f.max - f.min)) * 100),
                  }))}>
                    <PolarGrid stroke={gs} />
                    <PolarAngleAxis dataKey="label" tick={{ fill: tc, fontSize: 10 }} />
                    <Radar dataKey="value" stroke={C.indigo} fill={C.indigo} fillOpacity={0.3} />
                    <Tooltip contentStyle={tt} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              {/* Saved scenarios */}
              {scenarios.length > 0 && (
                <div className="nx-card">
                  <div className="d-flex justify-content-between mb-2">
                    <h6 className="nx-card-title mb-0">Scenarios</h6>
                    <button className="nx-card-link" onClick={() => setScenarios([])}>Clear</button>
                  </div>
                  {scenarios.map(sc => (
                    <div key={sc.id} className="nx-list-row">
                      <div className="nx-avatar-xs" style={{ background: RISK_COLOR[sc.risk] + '22', color: RISK_COLOR[sc.risk] }}>{sc.label}</div>
                      <div className="flex-grow-1">
                        <div style={{ color: 'var(--nx-text)', fontSize: 12 }}>CGPA: {sc.predicted} ({sc.lower}–{sc.upper})</div>
                        <div style={{ color: 'var(--nx-text-muted)', fontSize: 11 }}>Conf: {sc.confidence}%</div>
                      </div>
                      <span className={`nx-badge nx-badge-${sc.risk === 'High' ? 'danger' : sc.risk === 'Medium' ? 'warning' : 'success'}`}>{sc.risk}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            TAB: RISK ENGINE
        ══════════════════════════════════════════════════ */}
        {activeTab === 'risk' && (
          <div className="row g-4">
            {/* Risk summary */}
            {[
              { label: 'High Risk', students: allPredictions.filter(p => p.risk === 'High'), color: C.red, badge: 'danger', action: 'Immediate counselling + academic support' },
              { label: 'Medium Risk', students: allPredictions.filter(p => p.risk === 'Medium'), color: C.amber, badge: 'warning', action: 'Weekly mentoring & progress monitoring' },
              { label: 'Low Risk', students: allPredictions.filter(p => p.risk === 'Low'), color: C.green, badge: 'success', action: 'Maintain current trajectory' },
            ].map(group => (
              <div className="col-lg-4" key={group.label}>
                <div className="nx-card h-100" style={{ borderColor: group.color + '44', borderWidth: 2 }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold mb-0" style={{ color: group.color }}><i className="fas fa-users me-2"></i>{group.label}</h6>
                    <span className="fw-black" style={{ color: group.color, fontSize: 28 }}>{group.students.length}</span>
                  </div>
                  <p style={{ color: 'var(--nx-text-muted)', fontSize: 11 }} className="mb-3">
                    <i className="fas fa-lightbulb me-1"></i>{group.action}
                  </p>
                  {group.students.map(s => (
                    <div key={s.id} className="nx-list-row">
                      <div className="nx-avatar-xs">{s.name.split(' ').map(w=>w[0]).join('')}</div>
                      <div className="flex-grow-1">
                        <div style={{ color: 'var(--nx-text)', fontSize: 12 }}>{s.name}</div>
                        <div style={{ color: 'var(--nx-text-muted)', fontSize: 10 }}>{s.course} · Attend: {s.attendance}% · CGPA: {s.cgpa}</div>
                      </div>
                      <div className="text-end">
                        <div style={{ color: group.color, fontWeight: 700, fontSize: 14 }}>{s.predicted}</div>
                        <div style={{ color: 'var(--nx-text-muted)', fontSize: 10 }}>{s.confidence}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Declining performance */}
            <div className="col-12">
              <div className="nx-card p-0">
                <div className="nx-card-header px-4 pt-4">
                  <h6 className="nx-card-title"><i className="fas fa-chart-line me-2" style={{ color: C.red }}></i>Declining Performance Detection</h6>
                  <span className="nx-badge nx-badge-danger">{declining.length} Flagged</span>
                </div>
                {declining.length === 0 ? (
                  <div className="text-center py-5" style={{ color: 'var(--nx-text-muted)' }}>
                    <i className="fas fa-check-circle fa-2x mb-2 d-block" style={{ color: C.green }}></i>No declining performance detected
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="nx-table">
                      <thead><tr><th>Student</th><th>Previous %</th><th>Latest %</th><th>Change</th><th>Action</th></tr></thead>
                      <tbody>
                        {declining.map((s, i) => (
                          <tr key={i}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div className="nx-avatar-xs">{s.studentName.split(' ').map(w=>w[0]).join('')}</div>
                                <div>
                                  <div style={{ color: 'var(--nx-text)', fontSize: 13 }}>{s.studentName}</div>
                                  <div style={{ color: 'var(--nx-text-muted)', fontSize: 11 }}>{s.studentId}</div>
                                </div>
                              </div>
                            </td>
                            <td><span style={{ color: C.green }}>{s.prevPct}%</span></td>
                            <td><span style={{ color: C.amber }}>{s.latestPct}%</span></td>
                            <td><span style={{ color: C.red, fontWeight: 700 }}>{s.decline}%</span></td>
                            <td><span className="nx-badge nx-badge-danger">Intervention Needed</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            TAB: CLUSTERING
        ══════════════════════════════════════════════════ */}
        {activeTab === 'clusters' && (
          <div className="row g-4">
            <div className="col-12">
              <div className="nx-card">
                <div className="nx-card-header mb-3">
                  <h6 className="nx-card-title"><i className="fas fa-project-diagram me-2" style={{ color: C.purple }}></i>K-Means Student Clustering (CGPA × Attendance)</h6>
                </div>
                {/* Cluster legend */}
                <div className="d-flex gap-3 mb-4 flex-wrap">
                  {['Elite', 'Achiever', 'Average', 'Struggling'].map((c, i) => {
                    const col = [C.green, C.indigo, C.amber, C.red][i];
                    const n = clustered.filter(s => s.cluster === c).length;
                    return (
                      <div key={c} className="d-flex align-items-center gap-2 px-3 py-2 rounded" style={{ background: col + '15', border: `1px solid ${col}33` }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: col, display: 'inline-block' }}></span>
                        <span style={{ color: col, fontWeight: 700, fontSize: 13 }}>{c}</span>
                        <span className="nx-badge" style={{ background: col + '22', color: col, border: `1px solid ${col}44` }}>{n}</span>
                      </div>
                    );
                  })}
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke={gs} />
                    <XAxis dataKey="attendance" name="Attendance" unit="%" domain={[60, 100]} tick={{ fill: tc, fontSize: 10 }} axisLine={false} tickLine={false}
                      label={{ value: 'Attendance %', position: 'insideBottom', offset: -5, fill: tc, fontSize: 11 }} />
                    <YAxis dataKey="cgpa" name="CGPA" domain={[4, 10]} tick={{ fill: tc, fontSize: 10 }} axisLine={false} tickLine={false}
                      label={{ value: 'CGPA', angle: -90, position: 'insideLeft', fill: tc, fontSize: 11 }} />
                    <Tooltip contentStyle={tt} content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return <div style={{ ...tt, padding: '10px 14px' }}>
                        <p className="fw-bold mb-1" style={{ color: '#fff' }}>{d.name}</p>
                        <p className="mb-0" style={{ color: d.clusterColor }}>Cluster: {d.cluster} ({d.clusterScore}/100)</p>
                        <p className="mb-0" style={{ color: '#94a3b8' }}>CGPA: {d.cgpa} · Attend: {d.attendance}%</p>
                      </div>;
                    }} />
                    <Scatter data={clustered} shape={({ cx, cy, payload }) => (
                      <g>
                        <circle cx={cx} cy={cy} r={10} fill={payload.clusterColor} fillOpacity={0.25} />
                        <circle cx={cx} cy={cy} r={6}  fill={payload.clusterColor} fillOpacity={0.85} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
                      </g>
                    )} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Cluster cards */}
            {['Elite', 'Achiever', 'Average', 'Struggling'].map((cl, i) => {
              const col = [C.green, C.indigo, C.amber, C.red][i];
              const members = clustered.filter(s => s.cluster === cl);
              return (
                <div className="col-lg-3 col-md-6" key={cl}>
                  <div className="nx-card h-100" style={{ borderColor: col + '44' }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="fw-bold mb-0" style={{ color: col }}>{cl}</h6>
                      <span style={{ color: col, fontWeight: 900, fontSize: 24 }}>{members.length}</span>
                    </div>
                    <div style={{ color: 'var(--nx-text-muted)', fontSize: 11, marginBottom: 12 }}>
                      Avg CGPA: {members.length ? (members.reduce((s, m) => s + m.cgpa, 0) / members.length).toFixed(1) : '—'} ·
                      Avg Att: {members.length ? Math.round(members.reduce((s, m) => s + m.attendance, 0) / members.length) : '—'}%
                    </div>
                    {members.map(s => (
                      <div key={s.id} className="d-flex align-items-center gap-2 mb-2">
                        <div className="nx-avatar-xs" style={{ background: col + '22', color: col }}>{s.name.split(' ').map(w=>w[0]).join('')}</div>
                        <div>
                          <div style={{ color: 'var(--nx-text)', fontSize: 12 }}>{s.name}</div>
                          <div style={{ color: 'var(--nx-text-muted)', fontSize: 10 }}>Score: {s.clusterScore}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            TAB: HEATMAP
        ══════════════════════════════════════════════════ */}
        {activeTab === 'heatmap' && (
          <div className="nx-card">
            <div className="nx-card-header mb-3">
              <h6 className="nx-card-title"><i className="fas fa-th me-2" style={{ color: C.teal }}></i>Subject Performance Heatmap — Student × Subject</h6>
            </div>
            <div className="d-flex gap-4 mb-3 flex-wrap">
              {[['≥85', 'Excellent', C.green], ['70–84', 'Good', C.indigo], ['55–69', 'Average', C.amber], ['<55', 'Poor', C.red]].map(([r, lb, c]) => (
                <div key={lb} className="d-flex align-items-center gap-2">
                  <div style={{ width: 16, height: 16, borderRadius: 4, background: c + '33', border: `1px solid ${c}66` }}></div>
                  <span style={{ color: 'var(--nx-text-muted)', fontSize: 12 }}>{r} — {lb}</span>
                </div>
              ))}
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'separate', borderSpacing: 4, minWidth: 500 }}>
                <thead>
                  <tr>
                    <th style={{ padding: '4px 8px', color: 'var(--nx-text-dim)', fontSize: 11, fontWeight: 600 }}>Student</th>
                    {HEAT_SUBJECTS.map(s => (
                      <th key={s} style={{ padding: '4px 8px', color: 'var(--nx-text-dim)', fontSize: 11, fontWeight: 600, textAlign: 'center' }}>{s}</th>
                    ))}
                    <th style={{ padding: '4px 8px', color: 'var(--nx-text-dim)', fontSize: 11, fontWeight: 600 }}>Avg</th>
                  </tr>
                </thead>
                <tbody>
                  {heatmap.map((row, ri) => {
                    const vals = HEAT_SUBJECTS.map(s => row[s]);
                    const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
                    const { bg: avgBg, color: avgColor } = heatColor(avg);
                    return (
                      <tr key={ri}>
                        <td style={{ padding: '6px 10px', color: 'var(--nx-text)', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>{row.name}</td>
                        {HEAT_SUBJECTS.map(s => {
                          const { bg, color } = heatColor(row[s]);
                          return (
                            <td key={s} title={`${s}: ${row[s]}%`} style={{ padding: 4 }}>
                              <div style={{ width: 64, height: 40, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color, fontWeight: 700, fontSize: 13, cursor: 'default', transition: 'transform 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                                {row[s]}
                              </div>
                            </td>
                          );
                        })}
                        <td style={{ padding: 4 }}>
                          <div style={{ width: 52, height: 40, borderRadius: 8, background: avgBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: avgColor, fontWeight: 900, fontSize: 13 }}>{avg}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Subject averages */}
            <div className="mt-4">
              <h6 className="nx-card-title mb-3"><i className="fas fa-chart-bar me-2"></i>Subject Average Scores</h6>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={HEAT_SUBJECTS.map(s => {
                  const vals = heatmap.map(r => r[s]);
                  return { subject: s, avg: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) };
                })} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gs} />
                  <XAxis dataKey="subject" tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tt} />
                  <ReferenceLine y={75} stroke={C.green} strokeDasharray="4 2" label={{ value: '75%', fill: C.green, fontSize: 10 }} />
                  <Bar dataKey="avg" name="Avg Score" radius={[6, 6, 0, 0]}>
                    {HEAT_SUBJECTS.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            TAB: FORECASTING
        ══════════════════════════════════════════════════ */}
        {activeTab === 'forecast' && (
          <div className="row g-4">
            <div className="col-12">
              <div className="nx-card">
                <div className="nx-card-header mb-3">
                  <h6 className="nx-card-title"><i className="fas fa-robot me-2" style={{ color: C.sky }}></i>Enrollment Forecast — Time Series with Confidence Bands</h6>
                  <span className="nx-badge nx-badge-info"><i className="fas fa-asterisk me-1" style={{ fontSize: 8 }}></i>* = ML Forecast</span>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <ComposedChart data={combined}>
                    <defs>
                      <linearGradient id="fg1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={C.indigo} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={C.indigo} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={gs} />
                    <XAxis dataKey="month" tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tt} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: isDark ? '#94a3b8' : '#64748b' }} />
                    <Area type="monotone" dataKey="actual" name="Actual" stroke={C.indigo} strokeWidth={2.5} fill="url(#fg1)" connectNulls />
                    <Line type="monotone" dataKey="forecast" name="Forecast" stroke={C.amber} strokeWidth={2} strokeDasharray="5 3" dot={{ r: 5, fill: C.amber }} connectNulls />
                    <Line type="monotone" dataKey="upper" name="Upper CI" stroke={C.green} strokeWidth={1} strokeDasharray="3 2" dot={false} connectNulls />
                    <Line type="monotone" dataKey="lower" name="Lower CI" stroke={C.red} strokeWidth={1} strokeDasharray="3 2" dot={false} connectNulls />
                  </ComposedChart>
                </ResponsiveContainer>
                <div className="d-flex gap-4 flex-wrap mt-3">
                  {ENROLLMENT_FORECAST.map(f => (
                    <div key={f.month} className="nx-forecast-chip">
                      <span style={{ color: 'var(--nx-text-muted)', fontSize: 11 }}>{f.month} — ML Forecast</span>
                      <span className="fw-bold" style={{ color: C.amber, fontSize: 18 }}>{f.forecast}</span>
                      <span style={{ color: 'var(--nx-text-muted)', fontSize: 11 }}>CI: {f.lower} – {f.upper}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="nx-card h-100">
                <h6 className="nx-card-title mb-3"><i className="fas fa-chart-area me-2" style={{ color: C.purple }}></i>Subject Participation Trend</h6>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={[
                    { week: 'W1', dbms: 88, ds: 82, python: 75, networks: 79 },
                    { week: 'W2', dbms: 91, ds: 78, python: 80, networks: 74 },
                    { week: 'W3', dbms: 86, ds: 85, python: 77, networks: 81 },
                    { week: 'W4', dbms: 93, ds: 88, python: 82, networks: 83 },
                    { week: 'W5', dbms: 89, ds: 91, python: 85, networks: 78 },
                    { week: 'W6', dbms: 95, ds: 90, python: 88, networks: 85 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gs} />
                    <XAxis dataKey="week" tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[60, 100]} tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tt} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: isDark ? '#94a3b8' : '#64748b' }} />
                    <Area type="monotone" dataKey="dbms"     name="DBMS"     stroke={C.indigo} fill={C.indigo + '22'} strokeWidth={2} />
                    <Area type="monotone" dataKey="ds"       name="DS"       stroke={C.sky}    fill={C.sky + '22'}    strokeWidth={2} />
                    <Area type="monotone" dataKey="python"   name="Python"   stroke={C.green}  fill={C.green + '22'}  strokeWidth={2} />
                    <Area type="monotone" dataKey="networks" name="Networks" stroke={C.amber}  fill={C.amber + '22'}  strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="nx-card h-100">
                <h6 className="nx-card-title mb-3"><i className="fas fa-graduation-cap me-2" style={{ color: C.green }}></i>Fee Collection Forecast</h6>
                <ResponsiveContainer width="100%" height={220}>
                  <ComposedChart data={[
                    { month: 'Jul', collected: 10.2, forecast: null },
                    { month: 'Aug', collected: 9.8, forecast: null },
                    { month: 'Sep', collected: 11.1, forecast: null },
                    { month: 'Oct', collected: 10.5, forecast: null },
                    { month: 'Nov*', collected: null, forecast: 11.8 },
                    { month: 'Dec*', collected: null, forecast: 10.2 },
                    { month: 'Jan*', collected: null, forecast: 12.4 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gs} />
                    <XAxis dataKey="month" tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}L`} />
                    <Tooltip contentStyle={tt} formatter={v => [`₹${v}L`]} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: isDark ? '#94a3b8' : '#64748b' }} />
                    <Bar dataKey="collected" name="Collected" fill={C.green} radius={[4, 4, 0, 0]} barSize={28} />
                    <Line type="monotone" dataKey="forecast" name="Forecast" stroke={C.amber} strokeWidth={2.5} strokeDasharray="5 3" dot={{ r: 5, fill: C.amber }} connectNulls />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            TAB: ANOMALY DETECTION
        ══════════════════════════════════════════════════ */}
        {activeTab === 'anomaly' && (
          <div className="row g-4">
            <div className="col-12">
              <div className="nx-card mb-0">
                <div className="nx-card-header mb-3">
                  <h6 className="nx-card-title"><i className="fas fa-search me-2" style={{ color: C.amber }}></i>Z-Score Anomaly Detection — CGPA Outliers</h6>
                  <span className="nx-badge nx-badge-warning">{anomCount} Anomalies</span>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <ComposedChart data={anomalies.map(s => ({ name: s.name.split(' ')[0], cgpa: s.cgpa, zScore: s.zScore, isAnomaly: s.isAnomaly }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gs} />
                    <XAxis dataKey="name" tick={{ fill: tc, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" domain={[4, 10]} tick={{ fill: tc, fontSize: 10 }} axisLine={false} tickLine={false} label={{ value: 'CGPA', angle: -90, position: 'insideLeft', fill: tc, fontSize: 10 }} />
                    <YAxis yAxisId="right" orientation="right" domain={[-3, 3]} tick={{ fill: tc, fontSize: 10 }} axisLine={false} tickLine={false} label={{ value: 'Z-Score', angle: 90, position: 'insideRight', fill: tc, fontSize: 10 }} />
                    <Tooltip contentStyle={tt} />
                    <ReferenceLine yAxisId="right" y={1.5}  stroke={C.red}   strokeDasharray="4 2" label={{ value: '+1.5σ', fill: C.red,   fontSize: 10 }} />
                    <ReferenceLine yAxisId="right" y={-1.5} stroke={C.red}   strokeDasharray="4 2" label={{ value: '-1.5σ', fill: C.red,   fontSize: 10 }} />
                    <ReferenceLine yAxisId="right" y={0}    stroke={C.indigo} strokeDasharray="4 2" label={{ value: 'μ',      fill: C.indigo, fontSize: 10 }} />
                    <Bar yAxisId="left" dataKey="cgpa" name="CGPA" radius={[4, 4, 0, 0]} barSize={22}>
                      {anomalies.map((a, i) => <Cell key={i} fill={a.isAnomaly ? C.red : C.indigo} fillOpacity={a.isAnomaly ? 1 : 0.6} />)}
                    </Bar>
                    <Line yAxisId="right" type="monotone" dataKey="zScore" name="Z-Score" stroke={C.amber} strokeWidth={2} dot={{ r: 4, fill: C.amber }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="col-12">
              <div className="nx-card p-0">
                <div className="nx-card-header px-4 pt-4">
                  <h6 className="nx-card-title"><i className="fas fa-table me-2"></i>Anomaly Report</h6>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="nx-table">
                    <thead>
                      <tr><th>Student</th><th>CGPA</th><th>Z-Score</th><th>Deviation</th><th>Anomaly</th><th>Interpretation</th></tr>
                    </thead>
                    <tbody>
                      {anomalies.map(s => (
                        <tr key={s.id}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div className="nx-avatar-xs" style={{ background: s.isAnomaly ? C.red + '22' : 'var(--nx-accent-soft)', color: s.isAnomaly ? C.red : C.indigo }}>
                                {s.name.split(' ').map(w=>w[0]).join('')}
                              </div>
                              <div>
                                <div style={{ color: 'var(--nx-text)', fontSize: 13 }}>{s.name}</div>
                                <div style={{ color: 'var(--nx-text-muted)', fontSize: 11 }}>{s.course}</div>
                              </div>
                            </div>
                          </td>
                          <td><span className="fw-bold" style={{ color: s.cgpa >= 8 ? C.green : s.cgpa >= 6 ? C.indigo : C.red }}>{s.cgpa}</span></td>
                          <td><span style={{ color: Math.abs(s.zScore) > 1.5 ? C.amber : 'var(--nx-text-muted)' }}>{s.zScore > 0 ? '+' : ''}{s.zScore}</span></td>
                          <td>
                            <div className="nx-mini-bar">
                              <div className="nx-mini-fill" style={{ width: `${Math.min(100, Math.abs(s.zScore) / 2 * 100)}%`, background: Math.abs(s.zScore) > 1.5 ? C.red : C.indigo }}></div>
                            </div>
                          </td>
                          <td>
                            {s.isAnomaly
                              ? <span className="nx-badge nx-badge-danger"><i className="fas fa-exclamation me-1"></i>Yes</span>
                              : <span className="nx-badge nx-badge-success">Normal</span>}
                          </td>
                          <td style={{ color: 'var(--nx-text-muted)', fontSize: 12 }}>
                            {s.isAnomaly ? (s.zScore > 0 ? 'Exceptional outlier — verify data' : 'Significant underperformer — investigate') : 'Within expected range'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            TAB: EXAM INTELLIGENCE
        ══════════════════════════════════════════════════ */}
        {activeTab === 'exam-ml' && (
          <div className="row g-4">
            {/* Pass rates */}
            <div className="col-lg-6">
              <div className="nx-card h-100">
                <h6 className="nx-card-title mb-3"><i className="fas fa-percentage me-2" style={{ color: C.green }}></i>Pass Rate per Exam</h6>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={EXAMS.filter(e => e.status !== 'scheduled').map(e => ({
                    name: e.title.split(' ').slice(0, 2).join(' '),
                    passRate: getPassRate(e.id),
                    avgMarks: getAvgMarks(e.id),
                  }))} barSize={36}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gs} />
                    <XAxis dataKey="name" tick={{ fill: tc, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tt} formatter={v => [`${v}%`]} />
                    <ReferenceLine y={50} stroke={C.red} strokeDasharray="4 2" label={{ value: 'Pass Line', fill: C.red, fontSize: 10 }} />
                    <Bar dataKey="passRate" name="Pass Rate" radius={[6, 6, 0, 0]}>
                      {EXAMS.filter(e => e.status !== 'scheduled').map((_, i) => (
                        <Cell key={i} fill={getPassRate(EXAMS.filter(e => e.status !== 'scheduled')[i]?.id) >= 60 ? C.green : C.amber} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Subject performance */}
            <div className="col-lg-6">
              <div className="nx-card h-100">
                <h6 className="nx-card-title mb-3"><i className="fas fa-book me-2" style={{ color: C.sky }}></i>Subject-wise Performance</h6>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={subjectPerf} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gs} />
                    <XAxis dataKey="subject" tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tt} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: isDark ? '#94a3b8' : '#64748b' }} />
                    <Bar dataKey="avgPct"  name="Avg Score%"  fill={C.indigo} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="passRate" name="Pass Rate%" fill={C.green}  radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Difficult questions */}
            <div className="col-12">
              <div className="nx-card p-0">
                <div className="nx-card-header px-4 pt-4">
                  <h6 className="nx-card-title"><i className="fas fa-skull me-2" style={{ color: C.red }}></i>Difficult Questions — Lowest Correct Rate (Exam: Data Structures)</h6>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="nx-table">
                    <thead>
                      <tr><th>Q#</th><th>Question</th><th>Difficulty</th><th>Correct Rate</th><th>Attempts</th><th>ML Label</th></tr>
                    </thead>
                    <tbody>
                      {identifyDifficultQuestions('EX001').map(q => (
                        <tr key={q.questionNo}>
                          <td style={{ color: C.indigo, fontWeight: 700 }}>Q{q.questionNo}</td>
                          <td style={{ color: 'var(--nx-text)', fontSize: 12, maxWidth: 300 }}>{q.question}</td>
                          <td><span className={`nx-badge nx-badge-${q.difficulty === 'hard' ? 'danger' : q.difficulty === 'medium' ? 'warning' : 'success'}`}>{q.difficulty}</span></td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div className="nx-mini-bar" style={{ width: 70 }}>
                                <div className="nx-mini-fill" style={{ width: `${q.correctRate}%`, background: q.correctRate >= 60 ? C.green : q.correctRate >= 40 ? C.amber : C.red }}></div>
                              </div>
                              <span style={{ color: q.correctRate >= 60 ? C.green : q.correctRate >= 40 ? C.amber : C.red, fontSize: 12 }}>{q.correctRate}%</span>
                            </div>
                          </td>
                          <td style={{ color: 'var(--nx-text-muted)' }}>{q.totalAttempts}</td>
                          <td>
                            {q.correctRate < 40
                              ? <span className="nx-badge nx-badge-danger"><i className="fas fa-robot me-1"></i>Needs Revision</span>
                              : q.correctRate < 65
                              ? <span className="nx-badge nx-badge-warning">Moderately Hard</span>
                              : <span className="nx-badge nx-badge-success">Well Understood</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Student exam summary */}
            <div className="col-12">
              <div className="nx-card p-0">
                <div className="nx-card-header px-4 pt-4">
                  <h6 className="nx-card-title"><i className="fas fa-user-chart me-2" style={{ color: C.purple }}></i>Student Exam Performance Summary — ML Scored</h6>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="nx-table">
                    <thead>
                      <tr><th>Student</th><th>Exams</th><th>Avg Score</th><th>Pass Rate</th><th>Performance Bar</th><th>ML Verdict</th></tr>
                    </thead>
                    <tbody>
                      {examSummary.map(s => (
                        <tr key={s.studentId}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div className="nx-avatar-xs">{s.name.split(' ').map(w=>w[0]).join('')}</div>
                              <div>
                                <div style={{ color: 'var(--nx-text)', fontSize: 13, fontWeight: 600 }}>{s.name}</div>
                                <div style={{ color: 'var(--nx-text-muted)', fontSize: 11 }}>{s.studentId}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ color: 'var(--nx-text-muted)' }}>{s.examsTaken}</td>
                          <td><span className="fw-bold" style={{ color: s.avgPct >= 75 ? C.green : s.avgPct >= 50 ? C.indigo : C.red }}>{s.avgPct}%</span></td>
                          <td><span style={{ color: s.passRate >= 75 ? C.green : s.passRate >= 50 ? C.amber : C.red, fontWeight: 700 }}>{s.passRate}%</span></td>
                          <td>
                            <div className="nx-mini-bar" style={{ width: 100 }}>
                              <div className="nx-mini-fill" style={{ width: `${s.avgPct}%`, background: s.avgPct >= 75 ? C.green : s.avgPct >= 50 ? C.indigo : C.red }}></div>
                            </div>
                          </td>
                          <td>
                            {s.avgPct >= 80 ? <span className="nx-badge nx-badge-success"><i className="fas fa-star me-1"></i>Excellent</span>
                              : s.avgPct >= 60 ? <span className="nx-badge nx-badge-info">Good</span>
                              : s.avgPct >= 50 ? <span className="nx-badge nx-badge-warning">Needs Work</span>
                              : <span className="nx-badge nx-badge-danger"><i className="fas fa-exclamation me-1"></i>At Risk</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
