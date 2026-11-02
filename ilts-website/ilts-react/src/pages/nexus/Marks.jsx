import { useState, useMemo } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend
} from 'recharts';
import DashboardLayout from '../../components/nexus/DashboardLayout';
import { useTheme } from '../../context/ThemeContext';
import { STUDENTS, MARKS } from '../../data/nexusData';
import { useAuth } from '../../context/useAuth';

const SUBJECTS = ['DBMS', 'Data Structures', 'Python', 'Web Tech', 'Calculus', 'Networks'];

const gradeFor = total => {
  if (total >= 90) return { grade: 'A+', color: '#22c55e' };
  if (total >= 80) return { grade: 'A',  color: '#6366f1' };
  if (total >= 70) return { grade: 'B',  color: '#0ea5e9' };
  if (total >= 60) return { grade: 'C',  color: '#f59e0b' };
  if (total >= 50) return { grade: 'D',  color: '#f97316' };
  return { grade: 'F', color: '#ef4444' };
};

export default function Marks() {
  const { user } = useAuth();
  const { isDark } = useTheme();

  const isStudent = user?.role === 'student';
  const myId = 'NX001'; // logged-in student = NX001

  const [selectedStudent, setSelectedStudent] = useState(STUDENTS[0].id);
  const [showEntry, setShowEntry] = useState(false);
  const [newMark, setNewMark] = useState({ student: '', subject: 'DBMS', internal: '', external: '' });
  const [marks, setMarks] = useState(MARKS);
  const [search, setSearch] = useState('');

  const tooltipStyle = {
    background: isDark ? '#0f0f2e' : '#1e293b',
    border: '1px solid rgba(99,102,241,0.3)',
    borderRadius: 10,
    color: '#e2e8f0',
  };

  // Marks for the selected student (or own for students)
  const studentMarks = useMemo(() =>
    marks.filter(m => m.student === (isStudent ? myId : selectedStudent)),
  [marks, selectedStudent, isStudent]);

  const radarData = studentMarks.map(m => ({
    subject: m.subject, internal: m.internal, external: m.external,
  }));

  // Bar chart: total per subject
  const barData = studentMarks.map(m => ({
    subject: m.subject, total: m.total,
  }));

  const saveMark = () => {
    if (!newMark.student || !newMark.internal || !newMark.external) {
      alert('All fields required.'); return;
    }
    const total = +newMark.internal + +newMark.external;
    setMarks(prev => [...prev, { ...newMark, internal: +newMark.internal, external: +newMark.external, total }]);
    setShowEntry(false);
    setNewMark({ student: '', subject: 'DBMS', internal: '', external: '' });
  };

  const filteredAll = useMemo(() => {
    const q = search.toLowerCase();
    return marks.filter(m => {
      const st = STUDENTS.find(s => s.id === m.student);
      return !q || st?.name.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q);
    });
  }, [marks, search]);

  // Summary stats for the selected/student's marks
  const avgTotal = studentMarks.length > 0
    ? Math.round(studentMarks.reduce((s, m) => s + m.total, 0) / studentMarks.length) : 0;
  const bestSubject = studentMarks.length > 0
    ? studentMarks.reduce((b, m) => m.total > b.total ? m : b) : null;
  const worstSubject = studentMarks.length > 0
    ? studentMarks.reduce((w, m) => m.total < w.total ? m : w) : null;
  const overallGrade = gradeFor(avgTotal);

  return (
    <DashboardLayout>
      <div className="fade-in">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div className="nx-results-header">
            <h4 className="fw-bold mb-0" style={{ color: 'var(--nx-text)' }}>
              <i className="fas fa-star me-2" style={{ color: '#f59e0b' }}></i>
              {isStudent ? 'My Results' : 'Results'}
            </h4>
            <span className="nx-results-role-chip" style={{ background: isStudent ? 'rgba(34,197,94,0.15)' : 'rgba(99,102,241,0.15)', color: isStudent ? '#22c55e' : '#6366f1' }}>
              {user?.role} view
            </span>
          </div>
          {!isStudent && (
            <button className="btn btn-gradient px-4" onClick={() => setShowEntry(true)}>
              <i className="fas fa-plus me-2"></i>Enter Marks
            </button>
          )}
        </div>

        {/* ════════ Admin / Faculty: Student selector ════════ */}
        {!isStudent && (
          <div className="row g-4 mb-4">
            <div className="col-lg-3">
              <div className="nx-card">
                <h6 className="nx-card-title mb-3"><i className="fas fa-user-graduate me-2"></i>Select Student</h6>
                <div className="nx-input-wrap mb-3">
                  <i className="fas fa-search nx-input-icon"></i>
                  <input className="nx-input" placeholder="Search student…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="nx-student-pick-list">
                  {STUDENTS.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase())).map(s => (
                    <div key={s.id} className={`nx-student-pick-item ${selectedStudent === s.id ? 'active' : ''}`} onClick={() => setSelectedStudent(s.id)}>
                      <div className="nx-avatar-xs">{s.name.split(' ').map(w=>w[0]).join('')}</div>
                      <div>
                        <div style={{ color: 'var(--nx-text)', fontSize: 13 }}>{s.name}</div>
                        <div style={{ color: 'var(--nx-text-muted)', fontSize: 11 }}>{s.id} · {s.course}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-9">
              {/* Summary stats */}
              <div className="row g-3 mb-4">
                <div className="col-3">
                  <div className="nx-summary-stat">
                    <div className="nx-summary-stat-val" style={{ color: '#6366f1' }}>{avgTotal}</div>
                    <div className="nx-summary-stat-label">Average Score</div>
                  </div>
                </div>
                <div className="col-3">
                  <div className="nx-summary-stat">
                    <div className="nx-summary-stat-val" style={{ color: '#22c55e' }}>{bestSubject?.total || '—'}</div>
                    <div className="nx-summary-stat-label">Best: {bestSubject?.subject || '—'}</div>
                  </div>
                </div>
                <div className="col-3">
                  <div className="nx-summary-stat">
                    <div className="nx-summary-stat-val" style={{ color: '#ef4444' }}>{worstSubject?.total || '—'}</div>
                    <div className="nx-summary-stat-label">Lowest: {worstSubject?.subject || '—'}</div>
                  </div>
                </div>
                <div className="col-3">
                  <div className="nx-summary-stat">
                    <div className="nx-grade-pill" style={{ borderColor: overallGrade.color, color: overallGrade.color, margin: '0 auto' }}>{overallGrade.grade}</div>
                    <div className="nx-summary-stat-label">Overall Grade</div>
                  </div>
                </div>
              </div>

              {/* Marks table */}
              <div className="nx-card mb-4">
                <h6 className="nx-card-title mb-3">
                  <i className="fas fa-star me-2"></i>
                  {STUDENTS.find(s => s.id === selectedStudent)?.name}'s Results
                </h6>
                {studentMarks.length === 0
                  ? <p style={{ color: 'var(--nx-text-muted)' }}>No marks recorded for this student.</p>
                  : (
                    <div style={{ overflowX: 'auto' }}>
                      <table className="nx-table">
                        <thead>
                          <tr><th>Subject</th><th>Internal /25</th><th>External /75</th><th>Total /100</th><th>Grade</th></tr>
                        </thead>
                        <tbody>
                          {studentMarks.map(m => {
                            const g = gradeFor(m.total);
                            return (
                              <tr key={m.subject}>
                                <td style={{ color: 'var(--nx-text)' }}>{m.subject}</td>
                                <td style={{ color: 'var(--nx-text)' }}>{m.internal}</td>
                                <td style={{ color: 'var(--nx-text)' }}>{m.external}</td>
                                <td><span className="fw-bold" style={{ color: g.color }}>{m.total}</span></td>
                                <td><span className="nx-badge" style={{ background: g.color+'22', color: g.color, border:`1px solid ${g.color}44` }}>{g.grade}</span></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )
                }
              </div>

              {/* Charts */}
              <div className="row g-4">
                {radarData.length > 0 && (
                  <div className="col-lg-6">
                    <div className="nx-card">
                      <h6 className="nx-card-title mb-3"><i className="fas fa-spider me-2"></i>Performance Radar</h6>
                      <ResponsiveContainer width="100%" height={200}>
                        <RadarChart data={radarData}>
                          <PolarGrid stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }} />
                          <Radar name="Internal" dataKey="internal" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                          <Radar name="External" dataKey="external" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.2} />
                          <Tooltip contentStyle={tooltipStyle} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
                {barData.length > 0 && (
                  <div className="col-lg-6">
                    <div className="nx-card">
                      <h6 className="nx-card-title mb-3"><i className="fas fa-chart-bar me-2"></i>Subject-wise Total</h6>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={barData} barSize={28}>
                          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                          <XAxis dataKey="subject" tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                          <YAxis domain={[0,100]} tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={tooltipStyle} />
                          <Bar dataKey="total" name="Total" radius={[4,4,0,0]}>
                            {barData.map((d, i) => <Cell key={i} fill={d.total >= 80 ? '#22c55e' : d.total >= 60 ? '#6366f1' : '#f59e0b'} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════════ Student: own results ════════ */}
        {isStudent && (
          <>
            {/* Summary */}
            <div className="row g-3 mb-4">
              <div className="col-3">
                <div className="nx-summary-stat">
                  <div className="nx-summary-stat-val" style={{ color: '#6366f1' }}>{avgTotal}</div>
                  <div className="nx-summary-stat-label">Average Score</div>
                </div>
              </div>
              <div className="col-3">
                <div className="nx-summary-stat">
                  <div className="nx-summary-stat-val" style={{ color: '#22c55e' }}>{bestSubject?.total || '—'}</div>
                  <div className="nx-summary-stat-label">Best: {bestSubject?.subject || '—'}</div>
                </div>
              </div>
              <div className="col-3">
                <div className="nx-summary-stat">
                  <div className="nx-summary-stat-val" style={{ color: '#ef4444' }}>{worstSubject?.total || '—'}</div>
                  <div className="nx-summary-stat-label">Lowest: {worstSubject?.subject || '—'}</div>
                </div>
              </div>
              <div className="col-3">
                <div className="nx-summary-stat">
                  <div className="nx-grade-pill" style={{ borderColor: overallGrade.color, color: overallGrade.color, margin: '0 auto' }}>{overallGrade.grade}</div>
                  <div className="nx-summary-stat-label">Overall Grade</div>
                </div>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-lg-8">
                <div className="nx-card">
                  <h6 className="nx-card-title mb-3"><i className="fas fa-star me-2"></i>Semester Results</h6>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="nx-table">
                      <thead>
                        <tr><th>Subject</th><th>Internal /25</th><th>External /75</th><th>Total /100</th><th>Grade</th></tr>
                      </thead>
                      <tbody>
                        {marks.filter(m => m.student === myId).map(m => {
                          const g = gradeFor(m.total);
                          return (
                            <tr key={m.subject}>
                              <td style={{ color: 'var(--nx-text)' }}>{m.subject}</td>
                              <td style={{ color: 'var(--nx-text)' }}>{m.internal}</td>
                              <td style={{ color: 'var(--nx-text)' }}>{m.external}</td>
                              <td><span className="fw-bold" style={{ color: g.color }}>{m.total}</span></td>
                              <td><span className="nx-badge" style={{ background: g.color+'22', color: g.color, border:`1px solid ${g.color}44` }}>{g.grade}</span></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="nx-card">
                  <h6 className="nx-card-title mb-3"><i className="fas fa-spider me-2"></i>Performance Radar</h6>
                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={marks.filter(m=>m.student===myId).map(m=>({ subject:m.subject, internal:m.internal, external:m.external }))}>
                      <PolarGrid stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }} />
                      <Radar name="Internal" dataKey="internal" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                      <Radar name="External" dataKey="external" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.2} />
                      <Tooltip contentStyle={tooltipStyle} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ════════ All marks table (admin/faculty only) ════════ */}
        {!isStudent && (
          <div className="nx-card mt-4 p-0">
            <div className="nx-card-header px-4 pt-4">
              <h6 className="nx-card-title"><i className="fas fa-list me-2"></i>All Results — All Students</h6>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="nx-table">
                <thead>
                  <tr><th>Student</th><th>Subject</th><th>Internal</th><th>External</th><th>Total</th><th>Grade</th></tr>
                </thead>
                <tbody>
                  {filteredAll.map((m, i) => {
                    const st = STUDENTS.find(s => s.id === m.student);
                    const g = gradeFor(m.total);
                    return (
                      <tr key={i}>
                        <td>
                          <div style={{ color: 'var(--nx-text)', fontSize: 13 }}>{st?.name || m.student}</div>
                          <div style={{ color: 'var(--nx-text-muted)', fontSize: 11 }}>{m.student}</div>
                        </td>
                        <td style={{ color: 'var(--nx-text-muted)' }}>{m.subject}</td>
                        <td style={{ color: 'var(--nx-text)' }}>{m.internal}</td>
                        <td style={{ color: 'var(--nx-text)' }}>{m.external}</td>
                        <td><span className="fw-bold" style={{ color: g.color }}>{m.total}</span></td>
                        <td><span className="nx-badge" style={{ background: g.color+'22', color: g.color }}>{g.grade}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Enter Marks Modal */}
        {showEntry && (
          <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowEntry(false); }}>
            <div className="nx-modal">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0" style={{ color: 'var(--nx-text)' }}>Enter Marks</h5>
                <button className="nx-close-btn" onClick={() => setShowEntry(false)}><i className="fas fa-times"></i></button>
              </div>
              <div className="row g-3">
                <div className="col-12">
                  <label className="nx-label">Student *</label>
                  <select className="nx-input" value={newMark.student} onChange={e => setNewMark(p => ({ ...p, student: e.target.value }))}>
                    <option value="">Select student</option>
                    {STUDENTS.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                  </select>
                </div>
                <div className="col-12">
                  <label className="nx-label">Subject *</label>
                  <select className="nx-input" value={newMark.subject} onChange={e => setNewMark(p => ({ ...p, subject: e.target.value }))}>
                    {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-6">
                  <label className="nx-label">Internal (out of 25) *</label>
                  <input className="nx-input" type="number" min="0" max="25" placeholder="0-25" value={newMark.internal} onChange={e => setNewMark(p => ({ ...p, internal: e.target.value }))} />
                </div>
                <div className="col-6">
                  <label className="nx-label">External (out of 75) *</label>
                  <input className="nx-input" type="number" min="0" max="75" placeholder="0-75" value={newMark.external} onChange={e => setNewMark(p => ({ ...p, external: e.target.value }))} />
                </div>
                {newMark.internal && newMark.external && (
                  <div className="col-12">
                    <div className="nx-profile-field">
                      <span className="nx-profile-label">Total</span>
                      <span className="nx-profile-value fw-bold" style={{ color: '#a5b4fc' }}>
                        {+newMark.internal + +newMark.external} / 100 — {gradeFor(+newMark.internal + +newMark.external).grade}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="d-flex gap-3 justify-content-end mt-4">
                <button className="btn btn-outline-secondary px-4" onClick={() => setShowEntry(false)}>Cancel</button>
                <button className="btn btn-gradient px-4" onClick={saveMark}><i className="fas fa-save me-2"></i>Save Marks</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
