import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useAuth } from '../../context/useAuth';
import DashboardLayout from '../../components/nexus/DashboardLayout';
import {
  STUDENTS, FACULTY, COURSES, FEES,
  ENROLLMENT_TREND, PERFORMANCE_DIST, FEE_TREND, COURSE_POPULARITY,
  detectAtRisk
} from '../../data/nexusData';

const PIE_COLORS = ['#6366f1', '#0ea5e9', '#22c55e', '#f59e0b'];
const GRADE_COLORS = ['#22c55e','#6366f1','#0ea5e9','#f59e0b','#f97316','#ef4444'];

function KpiCard({ icon, label, value, sub, color, trend }) {
  return (
    <div className="nx-kpi-card">
      <div className="nx-kpi-icon" style={{ background: color + '22', color }}>
        <i className={icon}></i>
      </div>
      <div className="flex-grow-1">
        <p className="text-muted mb-1" style={{ fontSize: 13 }}>{label}</p>
        <h3 className="text-white fw-bold mb-0" style={{ fontSize: 28 }}>{value}</h3>
        {sub && <p className="mb-0 mt-1" style={{ fontSize: 11, color: trend === 'up' ? '#22c55e' : trend === 'down' ? '#ef4444' : '#64748b' }}>
          {trend === 'up' && <i className="fas fa-arrow-up me-1"></i>}
          {trend === 'down' && <i className="fas fa-arrow-down me-1"></i>}
          {sub}
        </p>}
      </div>
    </div>
  );
}

/* ── Admin Dashboard ── */
function AdminDashboard() {
  const totalFee    = FEES.reduce((s, f) => s + f.amount, 0);
  const collectedFee= FEES.reduce((s, f) => s + f.paid, 0);
  const pendingFee  = totalFee - collectedFee;
  const atRisk      = useMemo(() => detectAtRisk(STUDENTS), []);

  return (
    <>
      {/* KPI Row */}
      <div className="nx-kpi-grid">
        <KpiCard icon="fas fa-user-graduate" label="Total Students"  value={STUDENTS.length} sub="+4 this month"   color="#6366f1" trend="up" />
        <KpiCard icon="fas fa-chalkboard-teacher" label="Faculty Members" value={FACULTY.length}  sub="4 active now"     color="#0ea5e9" />
        <KpiCard icon="fas fa-book-open"       label="Active Courses" value={COURSES.length}  sub="209 seats open"  color="#22c55e" />
        <KpiCard icon="fas fa-rupee-sign"      label="Fee Collected"  value={`₹${(collectedFee/100000).toFixed(1)}L`} sub={`₹${(pendingFee/100000).toFixed(1)}L pending`} color="#f59e0b" trend="up" />
      </div>

      <div className="row g-4 mt-1">
        {/* Enrollment Trend */}
        <div className="col-lg-8">
          <div className="nx-card">
            <div className="nx-card-header">
              <h6 className="nx-card-title"><i className="fas fa-chart-line me-2"></i>Student Enrollment Trend</h6>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={ENROLLMENT_TREND}>
                <defs>
                  <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0f0f2e', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, color: '#e2e8f0' }} />
                <Area type="monotone" dataKey="students" stroke="#6366f1" strokeWidth={2} fill="url(#enrollGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Distribution */}
        <div className="col-lg-4">
          <div className="nx-card h-100">
            <div className="nx-card-header">
              <h6 className="nx-card-title"><i className="fas fa-pie-chart me-2"></i>Enrollment by Course</h6>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={COURSE_POPULARITY} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                  dataKey="value" nameKey="name" paddingAngle={3}>
                  {COURSE_POPULARITY.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f0f2e', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, color: '#e2e8f0' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fee Trend */}
        <div className="col-lg-7">
          <div className="nx-card">
            <div className="nx-card-header">
              <h6 className="nx-card-title"><i className="fas fa-rupee-sign me-2"></i>Fee Collection vs Pending</h6>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={FEE_TREND} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={v => `${(v/100000).toFixed(0)}L`} />
                <Tooltip contentStyle={{ background: '#0f0f2e', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, color: '#e2e8f0' }}
                  formatter={v => [`₹${(v/100000).toFixed(2)}L`]} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                <Bar dataKey="collected" name="Collected" fill="#22c55e" radius={[4,4,0,0]} />
                <Bar dataKey="pending"   name="Pending"   fill="#f59e0b" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="col-lg-5">
          <div className="nx-card">
            <div className="nx-card-header">
              <h6 className="nx-card-title"><i className="fas fa-graduation-cap me-2"></i>Grade Distribution</h6>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={PERFORMANCE_DIST} layout="vertical" barSize={12}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="grade" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ background: '#0f0f2e', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, color: '#e2e8f0' }} />
                <Bar dataKey="count" name="Students" radius={[0,4,4,0]}>
                  {PERFORMANCE_DIST.map((_, i) => <Cell key={i} fill={GRADE_COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* At-risk students */}
        <div className="col-lg-6">
          <div className="nx-card">
            <div className="nx-card-header">
              <h6 className="nx-card-title"><i className="fas fa-exclamation-triangle me-2 text-warning"></i>At-Risk Students (ML)</h6>
              <Link to="/ml" className="nx-card-link">View All →</Link>
            </div>
            {atRisk.slice(0, 4).map(s => (
              <div key={s.id} className="nx-list-row">
                <div className="nx-avatar-sm-text">{s.name.split(' ').map(w=>w[0]).join('')}</div>
                <div className="flex-grow-1">
                  <div className="text-white fw-semibold" style={{ fontSize: 13 }}>{s.name}</div>
                  <div className="text-muted" style={{ fontSize: 11 }}>{s.course} · Attendance {s.attendance}%</div>
                </div>
                <span className={`nx-badge nx-badge-${s.risk === 'High' ? 'danger' : 'warning'}`}>
                  {s.risk} Risk
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent fees */}
        <div className="col-lg-6">
          <div className="nx-card">
            <div className="nx-card-header">
              <h6 className="nx-card-title"><i className="fas fa-rupee-sign me-2"></i>Fee Status Overview</h6>
              <Link to="/fees" className="nx-card-link">Manage →</Link>
            </div>
            {FEES.filter(f => f.status !== 'paid').slice(0, 4).map(f => (
              <div key={f.student} className="nx-list-row">
                <div className="nx-avatar-sm-text">{f.name.split(' ').map(w=>w[0]).join('')}</div>
                <div className="flex-grow-1">
                  <div className="text-white fw-semibold" style={{ fontSize: 13 }}>{f.name}</div>
                  <div className="text-muted" style={{ fontSize: 11 }}>{f.course} · Due: ₹{f.due.toLocaleString('en-IN')}</div>
                </div>
                <span className={`nx-badge nx-badge-${f.status === 'overdue' ? 'danger' : 'warning'}`}>
                  {f.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Faculty Dashboard ── */
function FacultyDashboard() {
  const avgAttendance = Math.round(STUDENTS.reduce((s,st) => s + st.attendance, 0) / STUDENTS.length);
  const atRisk = useMemo(() => detectAtRisk(STUDENTS), []);

  return (
    <>
      <div className="nx-kpi-grid">
        <KpiCard icon="fas fa-user-graduate"  label="My Students"       value={STUDENTS.length} color="#6366f1" />
        <KpiCard icon="fas fa-calendar-check" label="Avg Attendance"    value={`${avgAttendance}%`} sub="Target: 75%" color="#0ea5e9" trend="up" />
        <KpiCard icon="fas fa-star"           label="Avg CGPA"          value={(STUDENTS.reduce((s,st)=>s+st.cgpa,0)/STUDENTS.length).toFixed(1)} color="#22c55e" />
        <KpiCard icon="fas fa-exclamation-circle" label="At-Risk"       value={atRisk.length} sub="Need attention" color="#f59e0b" trend="down" />
      </div>
      <div className="row g-4 mt-1">
        <div className="col-lg-8">
          <div className="nx-card">
            <div className="nx-card-header">
              <h6 className="nx-card-title"><i className="fas fa-chart-bar me-2"></i>Student Performance</h6>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={STUDENTS.slice(0, 8).map(s => ({ name: s.name.split(' ')[0], cgpa: s.cgpa, attendance: s.attendance }))} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0f0f2e', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, color: '#e2e8f0' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                <Bar dataKey="cgpa"       name="CGPA"       fill="#6366f1" radius={[4,4,0,0]} />
                <Bar dataKey="attendance" name="Attendance%" fill="#0ea5e9" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="nx-card h-100">
            <div className="nx-card-header">
              <h6 className="nx-card-title"><i className="fas fa-exclamation-triangle me-2 text-warning"></i>At-Risk (ML)</h6>
            </div>
            {atRisk.slice(0, 5).map(s => (
              <div key={s.id} className="nx-list-row">
                <div className="flex-grow-1">
                  <div className="text-white" style={{ fontSize: 13 }}>{s.name}</div>
                  <div className="text-muted" style={{ fontSize: 11 }}>Predicted CGPA: {s.predicted}</div>
                </div>
                <span className={`nx-badge nx-badge-${s.risk === 'High' ? 'danger' : 'warning'}`}>{s.risk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Student Dashboard ── */
function StudentDashboard() {
  const { user } = useAuth();
  // In a real app this would come from API. We'll use NX001 as the logged-in student.
  const me = STUDENTS.find(s => s.id === 'NX001') || STUDENTS[0];

  return (
    <>
      {/* Welcome banner */}
      <div className="nx-welcome-banner mb-4">
        <div className="nx-avatar nx-avatar-lg">{user?.avatar}</div>
        <div>
          <h4 className="text-white fw-bold mb-1">Welcome back, {user?.name?.split(' ')[0]}! 👋</h4>
          <p className="text-muted mb-0">Here's your academic summary for this semester.</p>
        </div>
      </div>

      <div className="nx-kpi-grid">
        <KpiCard icon="fas fa-star"           label="Current CGPA"   value={me.cgpa}          sub="Out of 10.0"         color="#6366f1" trend="up" />
        <KpiCard icon="fas fa-calendar-check" label="Attendance"     value={`${me.attendance}%`} sub={me.attendance>=75?'✓ Good standing':'⚠ Below 75%'} color={me.attendance>=75?"#22c55e":"#f59e0b"} />
        <KpiCard icon="fas fa-book-open"      label="Course"         value={me.course}         sub={`Year ${me.year}`}   color="#0ea5e9" />
        <KpiCard icon="fas fa-rupee-sign"     label="Fee Status"     value={me.feeStatus === 'paid' ? 'Paid' : 'Due'}    sub={me.feeStatus === 'paid' ? 'All clear' : 'Action required'} color={me.feeStatus==='paid'?"#22c55e":"#ef4444"} />
      </div>

      <div className="row g-4 mt-1">
        <div className="col-lg-6">
          <div className="nx-card">
            <div className="nx-card-header">
              <h6 className="nx-card-title"><i className="fas fa-star me-2"></i>Subject-wise Marks</h6>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[
                { subject: 'DBMS', marks: 80 }, { subject: 'DS', marks: 75 },
                { subject: 'Python', marks: 87 }, { subject: 'Calc', marks: 70 }
              ]} barSize={30}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0,100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0f0f2e', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, color: '#e2e8f0' }} />
                <Bar dataKey="marks" name="Marks / 100" radius={[4,4,0,0]}>
                  {[80,75,87,70].map((v,i) => <Cell key={i} fill={v>=80?'#22c55e':v>=60?'#6366f1':'#f59e0b'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="nx-card">
            <div className="nx-card-header">
              <h6 className="nx-card-title"><i className="fas fa-calendar-check me-2"></i>Attendance by Subject</h6>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[
                { subject: 'DBMS', pct: 88 }, { subject: 'DS', pct: 87 },
                { subject: 'Python', pct: 82 }, { subject: 'Calc', pct: 90 }
              ]} barSize={30}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0,100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0f0f2e', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, color: '#e2e8f0' }} />
                <Bar dataKey="pct" name="Attendance%" radius={[4,4,0,0]}>
                  {[88,87,82,90].map((v,i) => <Cell key={i} fill={v>=75?'#22c55e':'#ef4444'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Route ─────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  return (
    <DashboardLayout>
      <div className="fade-in">
        {user?.role === 'admin'   && <AdminDashboard />}
        {user?.role === 'faculty' && <FacultyDashboard />}
        {user?.role === 'student' && <StudentDashboard />}
      </div>
    </DashboardLayout>
  );
}
