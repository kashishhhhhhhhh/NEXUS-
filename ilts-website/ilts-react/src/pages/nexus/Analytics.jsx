import { useState, useMemo, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  ComposedChart, PieChart, Pie, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, ReferenceLine, Brush
} from 'recharts';
import DashboardLayout from '../../components/nexus/DashboardLayout';
import { useTheme } from '../../context/ThemeContext';
import {
  STUDENTS, ENROLLMENT_TREND, ENROLLMENT_FORECAST,
  FEE_TREND, COURSE_POPULARITY, ATTENDANCE_STATS, PERFORMANCE_DIST
} from '../../data/nexusData';
import { EXAMS, EXAM_SUBMISSIONS, getPassRate, getAvgMarks } from '../../data/examModuleData';

// ── Palette ───────────────────────────────────────────────────
const C = {
  indigo:'#6366f1', purple:'#a855f7', sky:'#0ea5e9', green:'#22c55e',
  amber:'#f59e0b', red:'#ef4444', pink:'#ec4899', teal:'#14b8a6', orange:'#f97316',
};
const GRADE_COLORS = [C.green, C.indigo, C.sky, C.amber, C.orange, C.red];
const PIE_COLORS   = [C.indigo, C.sky, C.green, C.amber];

// ── Animated counter ──────────────────────────────────────────
function AnimCount({ to, decimals = 0, prefix = '', suffix = '' }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1000, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(+(to * e).toFixed(decimals));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [to, decimals]);
  return <>{prefix}{val}{suffix}</>;
}

// ── Sparkline ─────────────────────────────────────────────────
function Sparkline({ data, color }) {
  return (
    <ResponsiveContainer width="100%" height={44}>
      <AreaChart data={data} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
        <defs>
          <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2}
          fill={`url(#sg-${color.replace('#','')})`} dot={false} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── Derived / extra data ──────────────────────────────────────
const MONTHLY_ACTIVE = [
  { month: 'Jan', students: 145, exams: 2, avg: 68 },
  { month: 'Feb', students: 160, exams: 3, avg: 71 },
  { month: 'Mar', students: 172, exams: 2, avg: 70 },
  { month: 'Apr', students: 168, exams: 4, avg: 74 },
  { month: 'May', students: 185, exams: 3, avg: 72 },
  { month: 'Jun', students: 178, exams: 2, avg: 69 },
  { month: 'Jul', students: 210, exams: 5, avg: 77 },
  { month: 'Aug', students: 225, exams: 4, avg: 78 },
  { month: 'Sep', students: 240, exams: 4, avg: 80 },
  { month: 'Oct', students: 255, exams: 5, avg: 82 },
];

const DEPT_PERFORMANCE = [
  { dept: 'CS',   cgpa: 8.2, attendance: 87, fees: 94, exams: 78 },
  { dept: 'IT',   cgpa: 7.8, attendance: 83, fees: 88, exams: 72 },
  { dept: 'Maths',cgpa: 7.5, attendance: 79, fees: 91, exams: 68 },
  { dept: 'Mgmt', cgpa: 7.2, attendance: 76, fees: 85, exams: 65 },
];

const GENDER_DATA = [
  { gender: 'Male',   count: 7, color: C.indigo },
  { gender: 'Female', count: 5, color: C.pink },
];

const CITY_DATA = [
  { city: 'Delhi', count: 2 }, { city: 'Mumbai', count: 1 },
  { city: 'Pune', count: 1 },  { city: 'Jaipur', count: 1 },
  { city: 'Lucknow', count: 1 }, { city: 'Bangalore', count: 1 },
  { city: 'Chennai', count: 1 }, { city: 'Hyderabad', count: 1 },
  { city: 'Ahmedabad', count: 1 }, { city: 'Others', count: 2 },
];

const RETENTION_FUNNEL = [
  { stage: 'Registered',    count: 320, color: C.indigo },
  { stage: 'Enrolled',      count: 280, color: C.sky },
  { stage: 'Active',        count: 255, color: C.green },
  { stage: 'Exam Appeared', count: 210, color: C.amber },
  { stage: 'Passed',        count: 168, color: C.teal },
  { stage: 'Graduated',     count: 142, color: C.purple },
];

const COHORT_DATA = [
  { cohort: '2023', sem1: 68, sem2: 71, sem3: 74, sem4: 76 },
  { cohort: '2024', sem1: 70, sem2: 73, sem3: 76, sem4: 79 },
  { cohort: '2025', sem1: 72, sem2: 75, sem3: 78, sem4: null },
  { cohort: '2026', sem1: 74, sem2: null, sem3: null, sem4: null },
];

const HOURLY_ACTIVITY = [
  { hour: '6am', logins: 5 },  { hour: '8am', logins: 22 },
  { hour: '10am', logins: 68 }, { hour: '12pm', logins: 55 },
  { hour: '2pm', logins: 72 },  { hour: '4pm', logins: 85 },
  { hour: '6pm', logins: 91 },  { hour: '8pm', logins: 78 },
  { hour: '10pm', logins: 42 }, { hour: '12am', logins: 12 },
];

const TABS = [
  { id: 'overview',    icon: 'fas fa-layer-group',   label: 'Overview' },
  { id: 'enrollment',  icon: 'fas fa-user-plus',     label: 'Enrollment' },
  { id: 'academic',    icon: 'fas fa-graduation-cap',label: 'Academic' },
  { id: 'fees',        icon: 'fas fa-rupee-sign',    label: 'Finance' },
  { id: 'attendance',  icon: 'fas fa-calendar-check',label: 'Attendance' },
  { id: 'engagement',  icon: 'fas fa-fire',          label: 'Engagement' },
];

export default function Analytics() {
  const { isDark } = useTheme();
  const [tab, setTab] = useState('overview');
  const [dateFrom, setDateFrom] = useState('2026-01-01');
  const [dateTo,   setDateTo]   = useState('2026-10-31');
  const [courseFilter, setCourseFilter] = useState('All');
  const [yearFilter,   setYearFilter]   = useState('All');

  const tt  = { background: isDark ? '#0a0a2e' : '#1e293b', border: '1px solid rgba(99,102,241,0.4)', borderRadius: 10, color: '#e2e8f0', fontSize: 12 };
  const gs  = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const tc  = isDark ? '#64748b' : '#94a3b8';

  // Filtered students
  const filteredStudents = useMemo(() => STUDENTS.filter(s => {
    const mc = courseFilter === 'All' || s.course === courseFilter;
    const my = yearFilter   === 'All' || String(s.year) === yearFilter;
    return mc && my;
  }), [courseFilter, yearFilter]);

  const avgCGPA       = +(filteredStudents.reduce((s, st) => s + st.cgpa, 0) / (filteredStudents.length || 1)).toFixed(2);
  const avgAttendance = Math.round(filteredStudents.reduce((s, st) => s + st.attendance, 0) / (filteredStudents.length || 1));
  const totalFeeCollected = 715000;
  const feeCollectionRate = 82;

  const exportCSV = () => {
    const rows = [
      ['Student', 'Course', 'Year', 'CGPA', 'Attendance', 'Fee Status', 'Perf Index'],
      ...filteredStudents.map(s => [s.name, s.course, s.year, s.cgpa, s.attendance + '%', s.feeStatus, ((s.cgpa/10*0.6)+(s.attendance/100*0.4)*100).toFixed(1)]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'nexus_analytics.csv'; a.click();
  };

  return (
    <DashboardLayout>
      <div className="fade-in">

        {/* ── Header ──────────────────────────────────────── */}
        <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
          <div>
            <div className="d-flex align-items-center gap-3 mb-1">
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#0ea5e9,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(14,165,233,0.4)' }}>
                <i className="fas fa-chart-bar" style={{ color: '#fff', fontSize: 18 }}></i>
              </div>
              <div>
                <h4 className="fw-black mb-0" style={{ color: 'var(--nx-text)', letterSpacing: -0.5 }}>
                  NEXUS Analytics
                </h4>
                <p className="mb-0" style={{ color: C.sky, fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
                  Business Intelligence Dashboard
                </p>
              </div>
            </div>
          </div>
          <div className="d-flex gap-2 flex-wrap align-items-center">
            <select className="nx-select" value={courseFilter} onChange={e => setCourseFilter(e.target.value)}>
              {['All','MCA','BCA','BSc','MBA'].map(c => <option key={c}>{c}</option>)}
            </select>
            <select className="nx-select" value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
              {['All','1','2','3'].map(y => <option key={y}>{y}</option>)}
            </select>
            <input type="date" className="nx-input" style={{ width: 'auto' }} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            <input type="date" className="nx-input" style={{ width: 'auto' }} value={dateTo}   onChange={e => setDateTo(e.target.value)} />
            <button className="btn btn-gradient px-3" onClick={exportCSV}>
              <i className="fas fa-file-csv me-2"></i>Export CSV
            </button>
          </div>
        </div>

        {/* ── KPI Strip ───────────────────────────────────── */}
        <div className="row g-3 mb-4">
          {[
            { label: 'Total Students',  val: filteredStudents.length,    suffix: '',  color: C.indigo, icon: 'fas fa-user-graduate', spark: ENROLLMENT_TREND.map(d=>({v:d.students})) },
            { label: 'Avg CGPA',        val: avgCGPA,    decimals: 2,   suffix: '',  color: C.green,  icon: 'fas fa-star',          spark: MONTHLY_ACTIVE.map(d=>({v:d.avg/10})) },
            { label: 'Avg Attendance',  val: avgAttendance,             suffix: '%', color: C.sky,    icon: 'fas fa-calendar-check', spark: ATTENDANCE_STATS.map(d=>({v:d.pct})) },
            { label: 'Fee Collected',   val: 71.5, decimals: 1,         suffix: 'L', color: C.amber,  icon: 'fas fa-rupee-sign', prefix: '₹', spark: FEE_TREND.map(d=>({v:d.collected/100000})) },
            { label: 'Pass Rate',       val: 72,                        suffix: '%', color: C.teal,   icon: 'fas fa-check-circle',  spark: MONTHLY_ACTIVE.map(d=>({v:d.avg})) },
            { label: 'Active Exams',    val: EXAMS.filter(e=>e.status==='active').length, suffix: '', color: C.purple, icon: 'fas fa-laptop-code', spark: MONTHLY_ACTIVE.map(d=>({v:d.exams})) },
          ].map(k => (
            <div className="col-lg-2 col-md-4 col-6" key={k.label}>
              <div className="nx-an-kpi" style={{ borderColor: k.color + '33' }}>
                <div className="d-flex justify-content-between align-items-start mb-1">
                  <div className="nx-an-kpi-icon" style={{ background: k.color + '18', color: k.color }}>
                    <i className={k.icon}></i>
                  </div>
                  <div style={{ color: 'var(--nx-text-muted)', fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Live</div>
                </div>
                <div style={{ fontWeight: 900, fontSize: 22, color: k.color, lineHeight: 1, margin: '4px 0 2px' }}>
                  <AnimCount to={k.val} decimals={k.decimals || 0} prefix={k.prefix || ''} suffix={k.suffix} />
                </div>
                <div style={{ color: 'var(--nx-text-muted)', fontSize: 10, marginBottom: 6 }}>{k.label}</div>
                <Sparkline data={k.spark} color={k.color} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs ────────────────────────────────────────── */}
        <div className="nx-ml-tabs mb-4">
          {TABS.map(t => (
            <button key={t.id} className={`nx-ml-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              <i className={t.icon}></i><span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════
            TAB: OVERVIEW
        ══════════════════════════════════════════════════ */}
        {tab === 'overview' && (
          <div className="row g-4">
            {/* Enrollment + Exam activity composed chart */}
            <div className="col-12">
              <div className="nx-card">
                <div className="nx-card-header mb-3">
                  <h6 className="nx-card-title"><i className="fas fa-chart-line me-2" style={{ color: C.indigo }}></i>Monthly Student Activity — Enrollment, Exams &amp; Avg Score</h6>
                  <span className="nx-badge nx-badge-info">Brush to zoom</span>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <ComposedChart data={MONTHLY_ACTIVE}>
                    <defs>
                      <linearGradient id="ovGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={C.indigo} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={C.indigo} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={gs} />
                    <XAxis dataKey="month" tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left"  tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" domain={[0,10]} tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tt} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: isDark ? '#94a3b8' : '#64748b' }} />
                    <Brush dataKey="month" height={22} stroke="rgba(99,102,241,0.3)" fill={isDark ? '#0a0a2e' : '#f1f5f9'} travellerWidth={6} />
                    <Area yAxisId="left"  type="monotone" dataKey="students" name="Students"   stroke={C.indigo} strokeWidth={2.5} fill="url(#ovGrad)" />
                    <Bar  yAxisId="left"  dataKey="exams"    name="Exams Held"  fill={C.amber}  radius={[4,4,0,0]} barSize={12} opacity={0.7} />
                    <Line yAxisId="right" type="monotone" dataKey="avg" name="Avg Score%" stroke={C.green} strokeWidth={2.5} dot={{ r: 4, fill: C.green }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Dept radar + gender pie */}
            <div className="col-lg-5">
              <div className="nx-card h-100">
                <div className="nx-card-header mb-2">
                  <h6 className="nx-card-title"><i className="fas fa-spider me-2" style={{ color: C.purple }}></i>Department Radar</h6>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart data={DEPT_PERFORMANCE}>
                    <PolarGrid stroke={gs} />
                    <PolarAngleAxis dataKey="dept" tick={{ fill: tc, fontSize: 11 }} />
                    <Radar name="CGPA×10"    dataKey="cgpa"       stroke={C.indigo} fill={C.indigo} fillOpacity={0.25} />
                    <Radar name="Attendance" dataKey="attendance" stroke={C.sky}    fill={C.sky}    fillOpacity={0.2} />
                    <Radar name="Fee%"       dataKey="fees"       stroke={C.green}  fill={C.green}  fillOpacity={0.15} />
                    <Tooltip contentStyle={tt} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: isDark ? '#94a3b8' : '#64748b' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Course + Gender pies */}
            <div className="col-lg-4">
              <div className="nx-card mb-4">
                <h6 className="nx-card-title mb-2"><i className="fas fa-book me-2" style={{ color: C.sky }}></i>Course Distribution</h6>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={COURSE_POPULARITY} cx="50%" cy="50%" innerRadius={35} outerRadius={58} dataKey="value" nameKey="name" paddingAngle={3}>
                      {COURSE_POPULARITY.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={tt} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 10, color: isDark ? '#94a3b8' : '#64748b' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="nx-card">
                <h6 className="nx-card-title mb-2"><i className="fas fa-venus-mars me-2" style={{ color: C.pink }}></i>Gender Split</h6>
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie data={GENDER_DATA} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="count" nameKey="gender" paddingAngle={4}>
                      {GENDER_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip contentStyle={tt} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 10, color: isDark ? '#94a3b8' : '#64748b' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Retention funnel */}
            <div className="col-lg-3">
              <div className="nx-card h-100">
                <h6 className="nx-card-title mb-3"><i className="fas fa-filter me-2" style={{ color: C.teal }}></i>Student Funnel</h6>
                {RETENTION_FUNNEL.map((f, i) => (
                  <div key={f.stage} className="mb-2">
                    <div className="d-flex justify-content-between mb-1">
                      <span style={{ color: 'var(--nx-text)', fontSize: 11 }}>{f.stage}</span>
                      <span style={{ color: f.color, fontWeight: 700, fontSize: 11 }}>{f.count}</span>
                    </div>
                    <div style={{ height: 8, background: 'var(--nx-input-bg)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(f.count / RETENTION_FUNNEL[0].count) * 100}%`, background: f.color, borderRadius: 4, transition: 'width 0.6s ease' }}></div>
                    </div>
                    {i < RETENTION_FUNNEL.length - 1 && (
                      <div style={{ color: C.red, fontSize: 9, textAlign: 'right', marginTop: 1 }}>
                        -{RETENTION_FUNNEL[i].count - RETENTION_FUNNEL[i+1].count} dropped
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Performance comparison table */}
            <div className="col-12">
              <div className="nx-card p-0">
                <div className="nx-card-header px-4 pt-4">
                  <h6 className="nx-card-title"><i className="fas fa-table me-2"></i>Student Performance Leaderboard</h6>
                  <span style={{ color: 'var(--nx-text-muted)', fontSize: 12 }}>{filteredStudents.length} students</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="nx-table">
                    <thead>
                      <tr><th>Rank</th><th>Student</th><th>Course</th><th>CGPA</th><th>Attendance</th><th>Fee</th><th>Performance Index</th></tr>
                    </thead>
                    <tbody>
                      {[...filteredStudents].sort((a,b) => b.cgpa - a.cgpa).map((s, idx) => {
                        const pi = ((s.cgpa/10)*0.6 + (s.attendance/100)*0.4) * 100;
                        const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx+1}`;
                        return (
                          <tr key={s.id}>
                            <td style={{ fontWeight: 700, fontSize: idx < 3 ? 16 : 12, color: idx < 3 ? C.amber : 'var(--nx-text-muted)' }}>{medal}</td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div className="nx-avatar-xs">{s.name.split(' ').map(w=>w[0]).join('')}</div>
                                <div>
                                  <div style={{ color: 'var(--nx-text)', fontSize: 13, fontWeight: 600 }}>{s.name}</div>
                                  <div style={{ color: 'var(--nx-text-muted)', fontSize: 11 }}>{s.email}</div>
                                </div>
                              </div>
                            </td>
                            <td><span className="nx-badge nx-badge-info">{s.course}</span></td>
                            <td><span style={{ fontWeight: 700, color: s.cgpa>=8?C.green:s.cgpa>=7?C.indigo:C.amber }}>{s.cgpa}</span></td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div className="nx-mini-bar"><div className="nx-mini-fill" style={{ width:`${s.attendance}%`, background:s.attendance>=75?C.green:C.red }}></div></div>
                                <span style={{ fontSize:12, color:s.attendance>=75?C.green:C.red }}>{s.attendance}%</span>
                              </div>
                            </td>
                            <td><span className={`nx-badge nx-badge-${s.feeStatus==='paid'?'success':s.feeStatus==='overdue'?'danger':'warning'}`}>{s.feeStatus}</span></td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div className="nx-mini-bar" style={{ width:90 }}><div className="nx-mini-fill" style={{ width:`${pi.toFixed(0)}%`, background:`linear-gradient(90deg,${C.indigo},${C.purple})` }}></div></div>
                                <span style={{ fontSize:12, color:'#a5b4fc', fontWeight:700 }}>{pi.toFixed(1)}</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            TAB: ENROLLMENT
        ══════════════════════════════════════════════════ */}
        {tab === 'enrollment' && (
          <div className="row g-4">
            <div className="col-12">
              <div className="nx-card">
                <div className="nx-card-header mb-3">
                  <h6 className="nx-card-title"><i className="fas fa-user-plus me-2" style={{ color: C.indigo }}></i>Enrollment Trend + Forecast (with Brush)</h6>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <ComposedChart data={[
                    ...ENROLLMENT_TREND.map(e => ({ month: e.month, actual: e.students, forecast: null })),
                    ...ENROLLMENT_FORECAST.map(f => ({ month: f.month+'*', actual: null, forecast: f.forecast, lo: f.lower, hi: f.upper })),
                  ]}>
                    <defs>
                      <linearGradient id="enGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={C.indigo} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={C.indigo} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={gs} />
                    <XAxis dataKey="month" tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tt} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: isDark?'#94a3b8':'#64748b' }} />
                    <Brush dataKey="month" height={22} stroke="rgba(99,102,241,0.3)" fill={isDark?'#0a0a2e':'#f1f5f9'} travellerWidth={6} />
                    <Area type="monotone" dataKey="actual"   name="Actual"       stroke={C.indigo} strokeWidth={2.5} fill="url(#enGrad)" connectNulls />
                    <Line type="monotone" dataKey="forecast" name="ML Forecast"  stroke={C.amber}  strokeWidth={2}   strokeDasharray="5 3" dot={{ r:5, fill:C.amber }} connectNulls />
                    <Line type="monotone" dataKey="hi"       name="Upper CI"     stroke={C.green}  strokeWidth={1}   strokeDasharray="3 2" dot={false} connectNulls />
                    <Line type="monotone" dataKey="lo"       name="Lower CI"     stroke={C.red}    strokeWidth={1}   strokeDasharray="3 2" dot={false} connectNulls />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="nx-card h-100">
                <h6 className="nx-card-title mb-3"><i className="fas fa-map-marker-alt me-2" style={{ color: C.red }}></i>Students by City</h6>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={CITY_DATA} layout="vertical" barSize={14}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gs} horizontal={false} />
                    <XAxis type="number" tick={{ fill: tc, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="city" tick={{ fill: isDark?'#94a3b8':'#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={75} />
                    <Tooltip contentStyle={tt} />
                    <Bar dataKey="count" name="Students" radius={[0,4,4,0]}>
                      {CITY_DATA.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="nx-card h-100">
                <h6 className="nx-card-title mb-3"><i className="fas fa-history me-2" style={{ color: C.teal }}></i>Cohort Comparison — Avg Score by Semester</h6>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={[
                    { sem: 'Sem 1', ...Object.fromEntries(COHORT_DATA.map(c=>[c.cohort,c.sem1])) },
                    { sem: 'Sem 2', ...Object.fromEntries(COHORT_DATA.map(c=>[c.cohort,c.sem2])) },
                    { sem: 'Sem 3', ...Object.fromEntries(COHORT_DATA.map(c=>[c.cohort,c.sem3])) },
                    { sem: 'Sem 4', ...Object.fromEntries(COHORT_DATA.map(c=>[c.cohort,c.sem4])) },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gs} />
                    <XAxis dataKey="sem" tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[60,85]} tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tt} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: isDark?'#94a3b8':'#64748b' }} />
                    {COHORT_DATA.map((c, i) => (
                      <Line key={c.cohort} type="monotone" dataKey={c.cohort} name={c.cohort}
                        stroke={[C.indigo,C.sky,C.green,C.amber][i]} strokeWidth={2.5}
                        dot={{ r: 4 }} connectNulls />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            TAB: ACADEMIC
        ══════════════════════════════════════════════════ */}
        {tab === 'academic' && (
          <div className="row g-4">
            {/* Grade distribution */}
            <div className="col-lg-7">
              <div className="nx-card h-100">
                <h6 className="nx-card-title mb-3"><i className="fas fa-graduation-cap me-2" style={{ color: C.indigo }}></i>Grade Distribution — Semester Results</h6>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={PERFORMANCE_DIST} barSize={34}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gs} />
                    <XAxis dataKey="grade" tick={{ fill: tc, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: tc, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tt} />
                    <Bar dataKey="count" name="Students" radius={[6,6,0,0]}>
                      {PERFORMANCE_DIST.map((_,i) => <Cell key={i} fill={GRADE_COLORS[i]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                {/* Mini summary */}
                <div className="d-flex gap-3 flex-wrap mt-3">
                  {PERFORMANCE_DIST.map((d,i) => (
                    <div key={d.grade} className="d-flex align-items-center gap-2">
                      <div style={{ width:10,height:10,borderRadius:3,background:GRADE_COLORS[i] }}></div>
                      <span style={{ color:'var(--nx-text-muted)',fontSize:11 }}>{d.grade}: {d.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CGPA scatter */}
            <div className="col-lg-5">
              <div className="nx-card h-100">
                <h6 className="nx-card-title mb-3"><i className="fas fa-braille me-2" style={{ color: C.sky }}></i>CGPA vs Attendance</h6>
                <ResponsiveContainer width="100%" height={220}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke={gs} />
                    <XAxis dataKey="attendance" name="Attendance" unit="%" domain={[60,100]} tick={{ fill:tc,fontSize:10 }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="cgpa" name="CGPA" domain={[4,10]} tick={{ fill:tc,fontSize:10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tt} content={({ active, payload }) => {
                      if (!active||!payload?.length) return null;
                      const d = payload[0].payload;
                      return <div style={{ ...tt, padding:'10px 14px' }}>
                        <p style={{ color:'#fff', fontWeight:700, marginBottom:4 }}>{d.name}</p>
                        <p style={{ color:'#94a3b8', marginBottom:2 }}>CGPA: {d.cgpa} · Attend: {d.attendance}%</p>
                        <p style={{ color:'#a5b4fc', margin:0 }}>{d.course} · Year {d.year}</p>
                      </div>;
                    }} />
                    <ReferenceLine x={75}  stroke={C.red}   strokeDasharray="4 2" label={{ value:'75% min', fill:C.red,   fontSize:9 }} />
                    <ReferenceLine y={7}   stroke={C.amber} strokeDasharray="4 2" label={{ value:'CGPA 7',  fill:C.amber, fontSize:9 }} />
                    <Scatter data={filteredStudents.map(s=>({...s}))} shape={({ cx,cy,payload }) => (
                      <circle cx={cx} cy={cy} r={7} fill={payload.cgpa>=8?C.green:payload.cgpa>=7?C.indigo:C.amber}
                        fillOpacity={0.85} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                    )} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Course-wise exam pass rate */}
            <div className="col-lg-6">
              <div className="nx-card h-100">
                <h6 className="nx-card-title mb-3"><i className="fas fa-file-alt me-2" style={{ color: C.green }}></i>Exam Pass Rate by Subject</h6>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={EXAMS.filter(e=>e.status!=='scheduled').map(e=>({
                    name: e.title.split(' ').slice(0,2).join(' '),
                    pass: getPassRate(e.id),
                    avg: getAvgMarks(e.id),
                  }))} barSize={24}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gs} />
                    <XAxis dataKey="name" tick={{ fill:tc,fontSize:10 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0,100]} tick={{ fill:tc,fontSize:11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tt} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize:11,color:isDark?'#94a3b8':'#64748b' }} />
                    <ReferenceLine y={50} stroke={C.red} strokeDasharray="4 2" />
                    <Bar dataKey="pass" name="Pass Rate%" fill={C.green}  radius={[4,4,0,0]} />
                    <Bar dataKey="avg"  name="Avg Marks"  fill={C.indigo} radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trend chart: semester averages */}
            <div className="col-lg-6">
              <div className="nx-card h-100">
                <h6 className="nx-card-title mb-3"><i className="fas fa-chart-area me-2" style={{ color: C.purple }}></i>Academic Performance Band</h6>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={[
                    { sem:'Sem 1',top:88,avg:71,low:52 }, { sem:'Sem 2',top:91,avg:74,low:55 },
                    { sem:'Sem 3',top:90,avg:72,low:50 }, { sem:'Sem 4',top:94,avg:78,low:58 },
                    { sem:'Sem 5',top:92,avg:76,low:54 }, { sem:'Sem 6',top:96,avg:81,low:60 },
                  ]}>
                    <defs>
                      <linearGradient id="abGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={C.indigo} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={C.indigo} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={gs} />
                    <XAxis dataKey="sem" tick={{ fill:tc,fontSize:11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[40,100]} tick={{ fill:tc,fontSize:11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tt} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize:11,color:isDark?'#94a3b8':'#64748b' }} />
                    <Area type="monotone" dataKey="top" name="Top" stroke={C.green}  fill="none" strokeDasharray="4 2" strokeWidth={2} />
                    <Area type="monotone" dataKey="avg" name="Avg" stroke={C.indigo} fill="url(#abGrad)" strokeWidth={2.5} />
                    <Area type="monotone" dataKey="low" name="Low" stroke={C.red}    fill="none" strokeDasharray="4 2" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            TAB: FINANCE
        ══════════════════════════════════════════════════ */}
        {tab === 'fees' && (
          <div className="row g-4">
            {/* KPIs */}
            {[
              ['Total Revenue', '₹8.55L', C.green,  'fas fa-rupee-sign'],
              ['Collected',     '₹7.15L', C.indigo, 'fas fa-check-circle'],
              ['Pending',       '₹1.40L', C.amber,  'fas fa-clock'],
              ['Overdue',       '2 students', C.red, 'fas fa-exclamation'],
            ].map(([l,v,c,ic]) => (
              <div className="col-lg-3 col-sm-6" key={l}>
                <div className="nx-kpi-card" style={{ borderColor: c+'33' }}>
                  <div className="nx-kpi-icon" style={{ background:c+'18',color:c }}><i className={ic}></i></div>
                  <div>
                    <p className="mb-1" style={{ color:'var(--nx-text-muted)',fontSize:13 }}>{l}</p>
                    <h3 className="fw-bold mb-0" style={{ color:'var(--nx-text)',fontSize:22 }}>{v}</h3>
                  </div>
                </div>
              </div>
            ))}

            {/* Fee line chart */}
            <div className="col-lg-8">
              <div className="nx-card h-100">
                <h6 className="nx-card-title mb-3"><i className="fas fa-chart-line me-2" style={{ color: C.green }}></i>Monthly Fee Collection vs Pending</h6>
                <ResponsiveContainer width="100%" height={240}>
                  <ComposedChart data={FEE_TREND}>
                    <defs>
                      <linearGradient id="feeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={C.green} stopOpacity={0.25}/>
                        <stop offset="95%" stopColor={C.green} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={gs} />
                    <XAxis dataKey="month" tick={{ fill:tc,fontSize:11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill:tc,fontSize:11 }} axisLine={false} tickLine={false}
                      tickFormatter={v=>`₹${(v/100000).toFixed(1)}L`} />
                    <Tooltip contentStyle={tt} formatter={v=>[`₹${(v/100000).toFixed(2)}L`]} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize:11,color:isDark?'#94a3b8':'#64748b' }} />
                    <Brush dataKey="month" height={22} stroke="rgba(34,197,94,0.3)" fill={isDark?'#0a0a2e':'#f1f5f9'} travellerWidth={6} />
                    <Area  type="monotone" dataKey="collected" name="Collected" stroke={C.green}  fill="url(#feeGrad)" strokeWidth={2.5} />
                    <Bar   dataKey="pending"   name="Pending"   fill={C.amber}  radius={[4,4,0,0]} barSize={16} opacity={0.8} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Fee status pie */}
            <div className="col-lg-4">
              <div className="nx-card h-100">
                <h6 className="nx-card-title mb-3"><i className="fas fa-chart-pie me-2" style={{ color: C.amber }}></i>Fee Status Breakdown</h6>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={[
                      { name:'Paid',    value: 8, color: C.green },
                      { name:'Pending', value: 2, color: C.amber },
                      { name:'Overdue', value: 2, color: C.red },
                    ]} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" nameKey="name" paddingAngle={4}
                      label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                      labelLine={{ stroke:tc }}>
                      {[C.green,C.amber,C.red].map((c,i) => <Cell key={i} fill={c} />)}
                    </Pie>
                    <Tooltip contentStyle={tt} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="d-flex justify-content-around mt-2">
                  {[[C.green,'Paid','8'],[C.amber,'Pending','2'],[C.red,'Overdue','2']].map(([c,l,v]) => (
                    <div key={l} className="text-center">
                      <div style={{ fontWeight:900,fontSize:20,color:c }}>{v}</div>
                      <div style={{ color:'var(--nx-text-muted)',fontSize:11 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            TAB: ATTENDANCE
        ══════════════════════════════════════════════════ */}
        {tab === 'attendance' && (
          <div className="row g-4">
            <div className="col-12">
              <div className="nx-card">
                <h6 className="nx-card-title mb-3"><i className="fas fa-calendar-check me-2" style={{ color: C.sky }}></i>Subject-wise Attendance with 75% Reference</h6>
                <ResponsiveContainer width="100%" height={240}>
                  <ComposedChart data={ATTENDANCE_STATS}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gs} />
                    <XAxis dataKey="subject" tick={{ fill:tc,fontSize:11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0,100]} tick={{ fill:tc,fontSize:11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tt} formatter={v=>[`${v}%`,'Attendance']} />
                    <ReferenceLine y={75} stroke={C.red} strokeDasharray="5 3" label={{ value:'75% Min',fill:C.red,fontSize:10 }} />
                    <ReferenceLine y={90} stroke={C.green} strokeDasharray="5 3" label={{ value:'90% Target',fill:C.green,fontSize:10 }} />
                    <Bar dataKey="pct" name="Attendance%" radius={[6,6,0,0]} barSize={28}>
                      {ATTENDANCE_STATS.map((d,i) => <Cell key={i} fill={d.pct>=90?C.green:d.pct>=75?C.indigo:C.red} />)}
                    </Bar>
                    <Line type="monotone" dataKey="pct" stroke={C.amber} strokeWidth={2} dot={{ r:5,fill:C.amber }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="nx-card h-100">
                <h6 className="nx-card-title mb-3"><i className="fas fa-users me-2" style={{ color: C.purple }}></i>Student Attendance Status</h6>
                <ResponsiveContainer width="100%" height={210}>
                  <BarChart data={filteredStudents.map(s => ({ name: s.name.split(' ')[0], pct: s.attendance }))} barSize={22}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gs} />
                    <XAxis dataKey="name" tick={{ fill:tc,fontSize:10 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0,100]} tick={{ fill:tc,fontSize:11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tt} formatter={v=>[`${v}%`,'Attendance']} />
                    <ReferenceLine y={75} stroke={C.red} strokeDasharray="4 2" />
                    <Bar dataKey="pct" name="Attendance%" radius={[4,4,0,0]}>
                      {filteredStudents.map((s,i) => <Cell key={i} fill={s.attendance>=85?C.green:s.attendance>=75?C.indigo:C.red} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="nx-card h-100">
                <h6 className="nx-card-title mb-3"><i className="fas fa-chart-pie me-2" style={{ color: C.teal }}></i>Attendance Tier Distribution</h6>
                <ResponsiveContainer width="100%" height={210}>
                  <PieChart>
                    <Pie data={[
                      { name:'90-100%', value: filteredStudents.filter(s=>s.attendance>=90).length, color: C.green },
                      { name:'75-89%',  value: filteredStudents.filter(s=>s.attendance>=75&&s.attendance<90).length, color: C.indigo },
                      { name:'<75%',    value: filteredStudents.filter(s=>s.attendance<75).length, color: C.red },
                    ]} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name" paddingAngle={3}
                      label={({ name, percent }) => `${name} (${(percent*100).toFixed(0)}%)`} labelLine={{ stroke:tc }}>
                      {[C.green,C.indigo,C.red].map((c,i) => <Cell key={i} fill={c} />)}
                    </Pie>
                    <Tooltip contentStyle={tt} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            TAB: ENGAGEMENT
        ══════════════════════════════════════════════════ */}
        {tab === 'engagement' && (
          <div className="row g-4">
            {/* Hourly activity */}
            <div className="col-lg-7">
              <div className="nx-card h-100">
                <h6 className="nx-card-title mb-3"><i className="fas fa-fire me-2" style={{ color: C.orange }}></i>Platform Activity by Hour of Day</h6>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={HOURLY_ACTIVITY}>
                    <defs>
                      <linearGradient id="hGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={C.orange} stopOpacity={0.35}/>
                        <stop offset="95%" stopColor={C.orange} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={gs} />
                    <XAxis dataKey="hour" tick={{ fill:tc,fontSize:11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill:tc,fontSize:11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tt} />
                    <Area type="monotone" dataKey="logins" name="Active Users" stroke={C.orange} strokeWidth={2.5} fill="url(#hGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Weekly summary */}
            <div className="col-lg-5">
              <div className="nx-card h-100">
                <h6 className="nx-card-title mb-3"><i className="fas fa-calendar-week me-2" style={{ color: C.pink }}></i>Weekly Engagement Metrics</h6>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={[
                    { metric: 'Logins',   val: 85 },
                    { metric: 'Exams',    val: 72 },
                    { metric: 'Attend.',  val: 83 },
                    { metric: 'Assign.',  val: 68 },
                    { metric: 'Forum',    val: 55 },
                    { metric: 'Results',  val: 90 },
                  ]}>
                    <PolarGrid stroke={gs} />
                    <PolarAngleAxis dataKey="metric" tick={{ fill:tc,fontSize:11 }} />
                    <Radar dataKey="val" stroke={C.pink} fill={C.pink} fillOpacity={0.3} />
                    <Tooltip contentStyle={tt} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Monthly trend */}
            <div className="col-12">
              <div className="nx-card">
                <h6 className="nx-card-title mb-3"><i className="fas fa-chart-line me-2" style={{ color: C.teal }}></i>Monthly Engagement Trend — Logins, Exam Attempts, Assignments</h6>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={MONTHLY_ACTIVE.map(m => ({
                    month: m.month,
                    logins: Math.round(m.students * 0.92),
                    exams:  m.exams * 40,
                    assign: Math.round(m.students * 0.78),
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gs} />
                    <XAxis dataKey="month" tick={{ fill:tc,fontSize:11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill:tc,fontSize:11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tt} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize:11,color:isDark?'#94a3b8':'#64748b' }} />
                    <Line type="monotone" dataKey="logins" name="Platform Logins" stroke={C.indigo} strokeWidth={2.5} dot={{ r:4,fill:C.indigo }} />
                    <Line type="monotone" dataKey="exams"  name="Exam Attempts"   stroke={C.amber}  strokeWidth={2}   dot={{ r:4,fill:C.amber }} strokeDasharray="5 2" />
                    <Line type="monotone" dataKey="assign" name="Assignments"      stroke={C.teal}   strokeWidth={2}   dot={{ r:4,fill:C.teal }} strokeDasharray="3 2" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
