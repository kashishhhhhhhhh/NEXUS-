import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import DashboardLayout from '../../components/nexus/DashboardLayout';
import { STUDENTS, ATTENDANCE_STATS } from '../../data/nexusData';
import { useAuth } from '../../context/useAuth';

const SUBJECTS = ['DBMS', 'Data Structures', 'Python', 'Web Tech', 'Calculus', 'Networks', 'AI/ML'];

function AttendanceRow({ student, record, onToggle, today }) {
  return (
    <tr>
      <td>
        <div className="d-flex align-items-center gap-2">
          <div className="nx-avatar-xs">{student.name.split(' ').map(w=>w[0]).join('')}</div>
          <div>
            <div className="text-white" style={{ fontSize: 13 }}>{student.name}</div>
            <div className="text-muted" style={{ fontSize: 11 }}>{student.id}</div>
          </div>
        </div>
      </td>
      <td className="text-muted" style={{ fontSize: 12 }}>{student.course}</td>
      <td>
        <div className="d-flex align-items-center gap-2">
          <div className="nx-mini-bar">
            <div className="nx-mini-fill" style={{ width: `${student.attendance}%`, background: student.attendance >= 75 ? '#22c55e' : '#ef4444' }}></div>
          </div>
          <span style={{ fontSize: 12, color: student.attendance >= 75 ? '#86efac' : '#fca5a5' }}>{student.attendance}%</span>
        </div>
      </td>
      <td>
        <span className={`nx-badge nx-badge-${student.attendance >= 75 ? 'success' : 'danger'}`}>
          {student.attendance >= 75 ? 'Good' : 'Low'}
        </span>
      </td>
      <td>
        <div className="d-flex gap-2">
          <button
            className={`nx-attend-btn nx-attend-present ${record === 'P' ? 'active' : ''}`}
            onClick={() => onToggle(student.id, 'P')}
            title="Present"
          >P</button>
          <button
            className={`nx-attend-btn nx-attend-absent ${record === 'A' ? 'active' : ''}`}
            onClick={() => onToggle(student.id, 'A')}
            title="Absent"
          >A</button>
          <button
            className={`nx-attend-btn nx-attend-late ${record === 'L' ? 'active' : ''}`}
            onClick={() => onToggle(student.id, 'L')}
            title="Late"
          >L</button>
        </div>
      </td>
    </tr>
  );
}

export default function Attendance() {
  const { user } = useAuth();
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [subject, setSubject] = useState('DBMS');
  const [records, setRecords] = useState({}); // { [studentId]: 'P'|'A'|'L' }
  const [saved, setSaved] = useState(false);

  const toggle = (id, val) => {
    setRecords(prev => ({ ...prev, [id]: val }));
    setSaved(false);
  };

  const markAll = (val) => {
    const next = {};
    STUDENTS.forEach(s => { next[s.id] = val; });
    setRecords(next);
    setSaved(false);
  };

  const saveAttendance = () => {
    setSaved(true);
    // In a real app, POST to /api/attendance
    setTimeout(() => setSaved(false), 3000);
  };

  const presentCount  = Object.values(records).filter(v => v === 'P').length;
  const absentCount   = Object.values(records).filter(v => v === 'A').length;
  const lateCount     = Object.values(records).filter(v => v === 'L').length;
  const markedCount   = Object.values(records).length;

  const isStudentRole = user?.role === 'student';

  return (
    <DashboardLayout>
      <div className="fade-in">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h4 className="text-white fw-bold mb-1">Attendance</h4>
            <p className="text-muted mb-0">{isStudentRole ? 'Your attendance records' : 'Mark and manage student attendance'}</p>
          </div>
          {!isStudentRole && (
            <button className="btn btn-gradient px-4" onClick={saveAttendance}>
              <i className="fas fa-save me-2"></i>{saved ? 'Saved!' : 'Save Attendance'}
            </button>
          )}
        </div>

        {/* Subject-wise attendance stats chart (all roles) */}
        <div className="row g-4 mb-4">
          <div className="col-lg-8">
            <div className="nx-card">
              <div className="nx-card-header">
                <h6 className="nx-card-title"><i className="fas fa-chart-bar me-2"></i>Subject-wise Attendance %</h6>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={ATTENDANCE_STATS} barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#0f0f2e', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, color: '#e2e8f0' }}
                    formatter={v => [`${v}%`, 'Attendance']} />
                  <Bar dataKey="pct" name="Attendance%" radius={[4,4,0,0]}>
                    {ATTENDANCE_STATS.map((d, i) => (
                      <Cell key={i} fill={d.pct >= 80 ? '#22c55e' : d.pct >= 75 ? '#6366f1' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="nx-card h-100">
              <h6 className="nx-card-title mb-3"><i className="fas fa-info-circle me-2"></i>Summary</h6>
              {[
                ['Students below 75%', STUDENTS.filter(s => s.attendance < 75).length, '#ef4444'],
                ['Students 75–85%',    STUDENTS.filter(s => s.attendance >= 75 && s.attendance < 85).length, '#f59e0b'],
                ['Students above 85%', STUDENTS.filter(s => s.attendance >= 85).length, '#22c55e'],
                ['Average Attendance', Math.round(STUDENTS.reduce((s,st)=>s+st.attendance,0)/STUDENTS.length)+'%', '#6366f1'],
              ].map(([label, val, color]) => (
                <div key={label} className="nx-list-row">
                  <div className="nx-notif-icon" style={{ background: color + '22', color }}>
                    <i className="fas fa-circle" style={{ fontSize: 8 }}></i>
                  </div>
                  <div className="flex-grow-1 text-white" style={{ fontSize: 13 }}>{label}</div>
                  <span className="fw-bold" style={{ color }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mark attendance (faculty / admin only) */}
        {!isStudentRole && (
          <div className="nx-card">
            <div className="nx-card-header flex-wrap gap-3">
              <h6 className="nx-card-title"><i className="fas fa-calendar-check me-2"></i>Mark Attendance</h6>
              <div className="d-flex gap-2 flex-wrap">
                <input type="date" className="nx-input" style={{ width: 'auto' }}
                  value={date} onChange={e => { setDate(e.target.value); setSaved(false); }} />
                <select className="nx-select" value={subject} onChange={e => { setSubject(e.target.value); setSaved(false); }}>
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
                <button className="nx-icon-btn" onClick={() => markAll('P')} title="Mark all present">All P</button>
                <button className="nx-icon-btn nx-icon-btn-danger" onClick={() => markAll('A')} title="Mark all absent">All A</button>
              </div>
            </div>

            {/* Summary chips */}
            <div className="d-flex gap-3 mb-3 flex-wrap">
              {[
                ['Present', presentCount, '#22c55e'],
                ['Absent',  absentCount,  '#ef4444'],
                ['Late',    lateCount,    '#f59e0b'],
                [`${markedCount}/${STUDENTS.length} marked`, null, '#6366f1'],
              ].map(([label, val, color]) => (
                <div key={label} className="nx-attend-chip" style={{ borderColor: color + '44', color }}>
                  {val !== null && <strong>{val}</strong>} {label}
                </div>
              ))}
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="nx-table">
                <thead>
                  <tr>
                    <th>Student</th><th>Course</th><th>Overall Attendance</th><th>Status</th><th>Today — {date}</th>
                  </tr>
                </thead>
                <tbody>
                  {STUDENTS.map(s => (
                    <AttendanceRow key={s.id} student={s} record={records[s.id]} onToggle={toggle} today={date} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Student: own attendance table */}
        {isStudentRole && (
          <div className="nx-card">
            <h6 className="nx-card-title mb-3"><i className="fas fa-calendar me-2"></i>Your Attendance Records</h6>
            <div style={{ overflowX: 'auto' }}>
              <table className="nx-table">
                <thead>
                  <tr><th>Subject</th><th>Present</th><th>Total</th><th>Percentage</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {ATTENDANCE_STATS.map(a => (
                    <tr key={a.subject}>
                      <td className="text-white">{a.subject}</td>
                      <td className="text-white">{Math.round(a.pct * 0.25)}</td>
                      <td className="text-muted">25</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="nx-mini-bar">
                            <div className="nx-mini-fill" style={{ width: `${a.pct}%`, background: a.pct>=75?'#22c55e':'#ef4444' }}></div>
                          </div>
                          <span style={{ color: a.pct>=75?'#86efac':'#fca5a5', fontSize: 12 }}>{a.pct}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`nx-badge nx-badge-${a.pct>=75?'success':'danger'}`}>
                          {a.pct>=75?'OK':'Low'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
