import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/nexus/DashboardLayout';
import { useAuth } from '../../context/useAuth';
import { STUDENTS, predictPerformance } from '../../data/nexusData';
import { examQuestions } from '../../data/examData';
import { EXAMS, EXAM_SUBMISSIONS, getPassRate, getAvgMarks } from '../../data/examModuleData';

const COURSES = ['All', 'MCA', 'BCA', 'BSc', 'MBA'];
const FEE_STATUSES = ['All', 'paid', 'pending', 'overdue'];

/* ────────────────────────────────────────────────────────────
   Online Exam — embedded inside the Students page (tab)
   Runs the same 30-question MCQ exam engine inline.
   ──────────────────────────────────────────────────────────── */
function EmbeddedExam({ student, onComplete }) {
  const [phase, setPhase]     = useState('pre');    // pre | exam | result
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(new Array(examQuestions.length).fill(null));
  const [marked, setMarked]   = useState(new Array(examQuestions.length).fill(false));
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [showConfirm, setShowConfirm] = useState(false);
  const [result, setResult]   = useState(null);

  const TOTAL = examQuestions.length;

  // Timer
  useMemo(() => {
    if (phase !== 'exam') return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(id); submitExam(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  const submitExam = (ans = answers) => {
    let correct = 0, wrong = 0, skipped = 0;
    examQuestions.forEach((q, i) => {
      if (ans[i] === null) skipped++;
      else if (ans[i] === q.ans) correct++;
      else wrong++;
    });
    setResult({ score: correct * 3, correct, wrong, skipped, pct: Math.round((correct * 3 / 90) * 100) });
    setPhase('result');
    if (onComplete) onComplete({ score: correct * 3, correct, wrong, skipped });
  };

  const selectOption = (i) => {
    const next = [...answers]; next[currentQ] = i; setAnswers(next);
  };
  const toggleMark = () => {
    const next = [...marked]; next[currentQ] = !next[currentQ]; setMarked(next);
  };
  const getPaletteClass = (i) => {
    if (i === currentQ) return 'current';
    if (marked[i]) return 'review';
    if (answers[i] !== null) return 'answered';
    return '';
  };

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  const q = examQuestions[currentQ];
  const labels = ['A', 'B', 'C', 'D'];
  const answeredCount = answers.filter(a => a !== null).length;

  // ── Pre-exam screen ──
  if (phase === 'pre') {
    return (
      <div className="nx-exam-launcher">
        <div className="nx-exam-launcher-icon">
          <i className="fas fa-laptop-code"></i>
        </div>
        <h4 className="fw-bold mb-2" style={{ color: 'var(--nx-text)' }}>MCA Entrance Exam</h4>
        <p style={{ color: 'var(--nx-text-muted)', fontSize: 14 }} className="mb-4">
          Assigned to <strong>{student.name}</strong> ({student.id})
        </p>
        <div className="nx-exam-info-chips">
          {[['fas fa-question-circle', `${TOTAL} Questions`],
            ['fas fa-clock',          '30 Minutes'],
            ['fas fa-star',            '90 Marks'],
            ['fas fa-cut',             'Cutoff: 50%']
          ].map(([ic, lb]) => (
            <div className="nx-exam-info-chip" key={lb}>
              <i className={ic} style={{ color: '#6366f1' }}></i> {lb}
            </div>
          ))}
        </div>
        <div className="d-flex gap-2 justify-content-center flex-wrap mb-4">
          {['Programming (10)', 'DBMS (10)', 'Aptitude (10)'].map(s => (
            <span key={s} className="nx-badge nx-badge-info">{s}</span>
          ))}
        </div>
        <div className="instructions-box text-start mb-4" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: 16 }}>
          <h6 className="mb-3" style={{ color: 'var(--nx-text)' }}><i className="fas fa-info-circle me-2" style={{ color: '#f59e0b' }}></i>Instructions</h6>
          <ul style={{ color: 'var(--nx-text-muted)', fontSize: 13 }} className="mb-0">
            <li>Each question carries 3 marks. No negative marking.</li>
            <li>Navigate between questions using the question palette.</li>
            <li>The exam will auto-submit when time runs out.</li>
            <li>Do not refresh the browser during the exam.</li>
          </ul>
        </div>
        <button className="btn btn-gradient btn-lg px-5" onClick={() => setPhase('exam')}>
          <i className="fas fa-play me-2"></i>Start Exam
        </button>
      </div>
    );
  }

  // ── Result screen ──
  if (phase === 'result') {
    const passed = result.pct >= 50;
    return (
      <div className="nx-card text-center" style={{ maxWidth: 600, margin: '0 auto' }}>
        {passed
          ? <i className="fas fa-trophy fa-4x mb-3" style={{ color: '#f59e0b' }}></i>
          : <i className="fas fa-times-circle fa-4x mb-3" style={{ color: '#ef4444' }}></i>}
        <h4 className="fw-bold mb-2" style={{ color: 'var(--nx-text)' }}>
          {passed ? 'Passed!' : 'Better Luck Next Time'}
        </h4>
        <p style={{ color: 'var(--nx-text-muted)' }} className="mb-4">
          Score: {result.score}/90 ({result.pct}%) — {passed ? 'Qualified' : 'Below 50% cutoff'}
        </p>
        <div className="score-circle mx-auto my-3" style={{ '--score-pct': result.pct + '%' }}>
          <span>{result.score}</span><small>/90</small>
        </div>
        <div className="row g-3 mb-4">
          <div className="col-4"><div className="nx-summary-stat"><div className="nx-summary-stat-val" style={{ color: '#22c55e' }}>{result.correct}</div><div className="nx-summary-stat-label">Correct</div></div></div>
          <div className="col-4"><div className="nx-summary-stat"><div className="nx-summary-stat-val" style={{ color: '#ef4444' }}>{result.wrong}</div><div className="nx-summary-stat-label">Wrong</div></div></div>
          <div className="col-4"><div className="nx-summary-stat"><div className="nx-summary-stat-val" style={{ color: '#f59e0b' }}>{result.skipped}</div><div className="nx-summary-stat-label">Skipped</div></div></div>
        </div>
        <div className="d-flex gap-3 justify-content-center">
          <button className="btn btn-outline-secondary px-4" onClick={() => { setPhase('pre'); setAnswers(new Array(TOTAL).fill(null)); setMarked(new Array(TOTAL).fill(false)); setTimeLeft(30*60); setResult(null); }}>
            <i className="fas fa-redo me-2"></i>Retake
          </button>
          <button className="btn btn-gradient px-4" onClick={() => onComplete && onComplete(result, true)}>
            <i className="fas fa-check me-2"></i>Done
          </button>
        </div>
      </div>
    );
  }

  // ── Active exam ──
  return (
    <div>
      {/* Topbar */}
      <div className="exam-topbar" style={{ background: 'var(--nx-surface)', borderBottom: '1px solid var(--nx-card-border)' }}>
        <div className="container-fluid d-flex justify-content-between align-items-center py-2" style={{ maxWidth: 1100 }}>
          <div className="d-flex align-items-center gap-3">
            <span className="fw-bold" style={{ color: 'var(--nx-text)' }}><i className="fas fa-graduation-cap me-2"></i>Online Exam — {student.name}</span>
            <span className="badge bg-primary">{q.subject}</span>
          </div>
          <div className={`exam-timer ${timeLeft <= 300 ? 'warning' : ''}`} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 50, padding: '6px 20px', color: '#fca5a5', fontWeight: 700 }}>
            <i className="fas fa-clock me-2"></i>{mins}:{secs}
          </div>
          <span style={{ color: 'var(--nx-text-muted)', fontSize: 12 }}>{answeredCount}/{TOTAL} Answered</span>
        </div>
      </div>

      <div className="container-fluid py-3" style={{ maxWidth: 1100 }}>
        <div className="row g-3">
          {/* Question */}
          <div className="col-lg-8">
            <div className="question-card" style={{ background: 'var(--nx-card)', border: '1px solid var(--nx-card-border)', borderRadius: 16, padding: 30 }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span style={{ color: 'var(--nx-text-muted)', fontSize: 12 }}>Question {currentQ + 1} of {TOTAL}</span>
                <span className="badge" style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8' }}>{q.subject}</span>
              </div>
              <div className="progress mb-3" style={{ height: 4, background: 'var(--nx-input-bg)' }}>
                <div className="progress-bar bg-gradient-bar" style={{ width: `${((currentQ + 1) / TOTAL) * 100}%` }}></div>
              </div>
              <h5 className="mb-4" style={{ color: 'var(--nx-text)' }}>{q.q}</h5>
              <div className="options-list">
                {q.opts.map((opt, i) => (
                  <div key={i} className={`option-item ${answers[currentQ] === i ? 'selected' : ''}`}
                    style={{ background: answers[currentQ] === i ? 'rgba(99,102,241,0.2)' : 'var(--nx-card)', border: `1px solid ${answers[currentQ] === i ? '#6366f1' : 'var(--nx-card-border)'}`, color: answers[currentQ] === i ? '#fff' : 'var(--nx-text)' }}
                    onClick={() => selectOption(i)}>
                    <span className="option-label">{labels[i]}</span>
                    <span>{opt}</span>
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-outline-secondary px-4" disabled={currentQ === 0} onClick={() => setCurrentQ(q => q - 1)}>
                  <i className="fas fa-arrow-left me-2"></i>Previous
                </button>
                <button className="btn btn-outline-warning px-4" onClick={toggleMark}>
                  <i className="fas fa-bookmark me-2"></i>{marked[currentQ] ? 'Unmark' : 'Mark'}
                </button>
                {currentQ < TOTAL - 1
                  ? <button className="btn btn-gradient px-4" onClick={() => setCurrentQ(q => q + 1)}>Next <i className="fas fa-arrow-right ms-2"></i></button>
                  : <button className="btn btn-danger px-4" onClick={() => setShowConfirm(true)}>Finish</button>}
              </div>
            </div>
          </div>

          {/* Palette */}
          <div className="col-lg-4">
            <div className="palette-card" style={{ background: 'var(--nx-card)', border: '1px solid var(--nx-card-border)', borderRadius: 16, padding: 20, position: 'sticky', top: 70 }}>
              <h6 className="mb-3" style={{ color: 'var(--nx-text)' }}><i className="fas fa-th me-2"></i>Question Palette</h6>
              <div className="question-palette">
                {examQuestions.map((_, i) => (
                  <button key={i} className={`palette-btn ${getPaletteClass(i)}`} onClick={() => setCurrentQ(i)}>{i + 1}</button>
                ))}
              </div>
              <button className="btn btn-danger w-100 mt-3" onClick={() => setShowConfirm(true)}>
                <i className="fas fa-paper-plane me-2"></i>Submit Exam
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="nx-modal text-center" style={{ maxWidth: 400 }}>
            <i className="fas fa-exclamation-triangle fa-3x mb-3" style={{ color: '#f59e0b' }}></i>
            <h5 style={{ color: 'var(--nx-text)' }}>Submit Exam?</h5>
            <p style={{ color: 'var(--nx-text-muted)' }}>You have answered {answeredCount} out of {TOTAL} questions.</p>
            <div className="d-flex gap-3 justify-content-center mt-3">
              <button className="btn btn-outline-secondary px-4" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn btn-danger px-4" onClick={() => { setShowConfirm(false); submitExam(); }}>Submit Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────────────────────────────────────────
   Main Students page — with tabs (Students | Online Exam)
   ──────────────────────────────────────────────────────────── */
export default function Students() {
  const { user } = useAuth();
  const [tab, setTab] = useState('students');  // students | exam | results
  const [search, setSearch]   = useState('');
  const [course, setCourse]   = useState('All');
  const [feeFilter, setFeeFilter] = useState('All');
  const [sortBy, setSortBy]   = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', course: 'MCA', year: 1, email: '', phone: '', city: '' });
  const [students, setStudents] = useState(STUDENTS);
  const [examStudent, setExamStudent] = useState(null);
  const [examHistory, setExamHistory] = useState({});  // { studentId: [{score, correct, wrong, skipped, date}] }

  const filtered = useMemo(() => {
    let list = students.filter(s => {
      const ms = s.name.toLowerCase().includes(search.toLowerCase()) ||
                 s.id.toLowerCase().includes(search.toLowerCase()) ||
                 s.email.toLowerCase().includes(search.toLowerCase());
      const mc = course === 'All' || s.course === course;
      const mf = feeFilter === 'All' || s.feeStatus === feeFilter;
      return ms && mc && mf;
    });
    list = [...list].sort((a, b) => {
      let va = a[sortBy], vb = b[sortBy];
      if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
    return list;
  }, [students, search, course, feeFilter, sortBy, sortDir]);

  const toggleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('asc'); }
  };

  const SortIcon = ({ field }) => (
    <i className={`fas fa-sort${sortBy === field ? (sortDir === 'asc' ? '-up' : '-down') : ''} ms-1`}
      style={{ fontSize: 10, opacity: sortBy === field ? 1 : 0.3 }}></i>
  );

  const addStudent = () => {
    if (!newStudent.name || !newStudent.email) { alert('Name and email are required.'); return; }
    const id = 'NX' + String(students.length + 1).padStart(3, '0');
    setStudents(prev => [...prev, { ...newStudent, id, gender: 'Male', cgpa: 7.5, attendance: 80, feeStatus: 'pending' }]);
    setShowAdd(false);
    setNewStudent({ name: '', course: 'MCA', year: 1, email: '', phone: '', city: '' });
  };

  const deleteStudent = (id) => {
    if (window.confirm('Delete this student record?'))
      setStudents(prev => prev.filter(s => s.id !== id));
  };

  const pct = (s) => {
    if (s >= 9)  return { label: 'Excellent', color: '#22c55e' };
    if (s >= 7.5) return { label: 'Good',     color: '#6366f1' };
    if (s >= 6)  return { label: 'Average',   color: '#f59e0b' };
    return { label: 'Poor', color: '#ef4444' };
  };

  const handleExamComplete = (result, isDone) => {
    if (result && result.score !== undefined) {
      setExamHistory(prev => ({
        ...prev,
        [examStudent.id]: [...(prev[examStudent.id] || []), { ...result, date: new Date().toLocaleDateString('en-IN') }],
      }));
    }
    if (isDone) setExamStudent(null);
  };

  return (
    <DashboardLayout>
      <div className="fade-in">
        {/* Tabs */}
        <div className="nx-tab-bar mb-4">
          <button className={`nx-tab ${tab === 'students' ? 'active' : ''}`} onClick={() => setTab('students')}>
            <i className="fas fa-user-graduate"></i> Students
          </button>
          <button className={`nx-tab ${tab === 'exam' ? 'active' : ''}`} onClick={() => setTab('exam')}>
            <i className="fas fa-laptop-code"></i> Online Exam
          </button>
          <button className={`nx-tab ${tab === 'results' ? 'active' : ''}`} onClick={() => setTab('results')}>
            <i className="fas fa-chart-bar"></i> Exam Results
          </button>
        </div>

        {/* ════════ TAB 1: Students Management ════════ */}
        {tab === 'students' && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
              <div>
                <h4 className="fw-bold mb-1" style={{ color: 'var(--nx-text)' }}>Students</h4>
                <p style={{ color: 'var(--nx-text-muted)' }} className="mb-0">{filtered.length} of {students.length} records</p>
              </div>
              <button className="btn btn-gradient px-4" onClick={() => setShowAdd(true)}>
                <i className="fas fa-plus me-2"></i>Add Student
              </button>
            </div>

            <div className="nx-filter-bar mb-4">
              <div className="nx-input-wrap flex-grow-1" style={{ maxWidth: 320 }}>
                <i className="fas fa-search nx-input-icon"></i>
                <input className="nx-input" placeholder="Search by name, ID or email…" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="nx-select" value={course} onChange={e => setCourse(e.target.value)}>
                {COURSES.map(c => <option key={c}>{c}</option>)}
              </select>
              <select className="nx-select" value={feeFilter} onChange={e => setFeeFilter(e.target.value)}>
                {FEE_STATUSES.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>

            <div className="nx-card p-0">
              <div style={{ overflowX: 'auto' }}>
                <table className="nx-table">
                  <thead>
                    <tr>
                      <th onClick={() => toggleSort('id')} style={{ cursor: 'pointer' }}>ID <SortIcon field="id" /></th>
                      <th onClick={() => toggleSort('name')} style={{ cursor: 'pointer' }}>Name <SortIcon field="name" /></th>
                      <th onClick={() => toggleSort('course')} style={{ cursor: 'pointer' }}>Course <SortIcon field="course" /></th>
                      <th>Year</th>
                      <th onClick={() => toggleSort('cgpa')} style={{ cursor: 'pointer' }}>CGPA <SortIcon field="cgpa" /></th>
                      <th onClick={() => toggleSort('attendance')} style={{ cursor: 'pointer' }}>Attend% <SortIcon field="attendance" /></th>
                      <th>Fee</th>
                      <th>Performance</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(s => {
                      const perf = pct(s.cgpa);
                      return (
                        <tr key={s.id}>
                          <td><span style={{ color: 'var(--nx-text-muted)', fontSize: 12 }}>{s.id}</span></td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div className="nx-avatar-xs">{s.name.split(' ').map(w=>w[0]).join('')}</div>
                              <div>
                                <div className="fw-semibold" style={{ fontSize: 13, color: 'var(--nx-text)' }}>{s.name}</div>
                                <div style={{ color: 'var(--nx-text-muted)', fontSize: 11 }}>{s.email}</div>
                              </div>
                            </div>
                          </td>
                          <td><span className="nx-badge nx-badge-info">{s.course}</span></td>
                          <td style={{ color: 'var(--nx-text-muted)', fontSize: 13 }}>{s.year}</td>
                          <td><span className="fw-bold" style={{ color: perf.color }}>{s.cgpa}</span></td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div className="nx-mini-bar">
                                <div className="nx-mini-fill" style={{ width: `${s.attendance}%`, background: s.attendance >= 75 ? '#22c55e' : '#ef4444' }}></div>
                              </div>
                              <span style={{ fontSize: 12, color: s.attendance >= 75 ? '#22c55e' : '#ef4444' }}>{s.attendance}%</span>
                            </div>
                          </td>
                          <td>
                            <span className={`nx-badge nx-badge-${s.feeStatus === 'paid' ? 'success' : s.feeStatus === 'overdue' ? 'danger' : 'warning'}`}>{s.feeStatus}</span>
                          </td>
                          <td>
                            <span className="nx-badge" style={{ background: perf.color + '22', color: perf.color, border: `1px solid ${perf.color}44` }}>{perf.label}</span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button className="nx-icon-btn" title="View details" onClick={() => setSelected(s)}><i className="fas fa-eye"></i></button>
                              <button className="nx-icon-btn" title="Assign exam" onClick={() => { setTab('exam'); setExamStudent(s); }}><i className="fas fa-laptop-code"></i></button>
                              <button className="nx-icon-btn nx-icon-btn-danger" title="Delete" onClick={() => deleteStudent(s.id)}><i className="fas fa-trash"></i></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="text-center py-5" style={{ color: 'var(--nx-text-muted)' }}>
                    <i className="fas fa-search fa-2x mb-3 d-block"></i>No students match your filters.
                  </div>
                )}
              </div>
            </div>

            {/* Student Detail Modal */}
            {selected && (
              <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
                <div className="nx-modal">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0" style={{ color: 'var(--nx-text)' }}>Student Profile</h5>
                    <button className="nx-close-btn" onClick={() => setSelected(null)}><i className="fas fa-times"></i></button>
                  </div>
                  <div className="text-center mb-4">
                    <div className="nx-avatar nx-avatar-lg mx-auto mb-3" style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)' }}>{selected.name.split(' ').map(w=>w[0]).join('')}</div>
                    <h5 style={{ color: 'var(--nx-text)' }}>{selected.name}</h5>
                    <span className="nx-badge nx-badge-info">{selected.id}</span>
                  </div>
                  <div className="row g-3">
                    {[
                      ['Course', selected.course], ['Year', selected.year],
                      ['CGPA', selected.cgpa], ['Attendance', selected.attendance + '%'],
                      ['Email', selected.email], ['Phone', selected.phone],
                      ['City', selected.city], ['Gender', selected.gender],
                      ['Fee Status', selected.feeStatus],
                    ].map(([k, v]) => (
                      <div className="col-6" key={k}>
                        <div className="nx-profile-field">
                          <span className="nx-profile-label">{k}</span>
                          <span className="nx-profile-value">{v}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Exam history */}
                  {examHistory[selected.id]?.length > 0 && (
                    <div className="mt-4">
                      <h6 className="mb-2" style={{ color: 'var(--nx-text)' }}><i className="fas fa-laptop-code me-2"></i>Exam History</h6>
                      {examHistory[selected.id].map((h, i) => (
                        <div key={i} className="nx-exam-history-row">
                          <div className="nx-avatar-xs"><i className="fas fa-file-alt"></i></div>
                          <div className="flex-grow-1">
                            <div style={{ color: 'var(--nx-text)', fontSize: 12 }}>Attempt {i+1} — {h.date}</div>
                            <div style={{ color: 'var(--nx-text-muted)', fontSize: 11 }}>Score: {h.score}/90 · {h.correct} correct · {h.wrong} wrong</div>
                          </div>
                          <span className={`nx-badge nx-badge-${h.score/90 >= 0.5 ? 'success' : 'danger'}`}>{h.score/90 >= 0.5 ? 'PASS' : 'FAIL'}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ML Prediction */}
                  <div className="mt-4 p-3 rounded" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
                    <p className="mb-1" style={{ color: 'var(--nx-text-muted)', fontSize: 12 }}><i className="fas fa-brain me-1" style={{ color: '#6366f1' }}></i>ML Prediction</p>
                    {(() => {
                      const pred = predictPerformance(selected);
                      return (
                        <>
                          <p className="mb-1" style={{ color: 'var(--nx-text)' }}>Predicted CGPA: <strong style={{ color: '#a5b4fc' }}>{pred.predicted}</strong></p>
                          <p className="mb-0" style={{ color: 'var(--nx-text-muted)', fontSize: 12 }}>
                            Risk: <span style={{ color: pred.risk === 'High' ? '#ef4444' : pred.risk === 'Medium' ? '#f59e0b' : '#22c55e' }}>{pred.risk}</span>
                            &nbsp;· Confidence: {pred.confidence}%
                          </p>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* Add Student Modal */}
            {showAdd && (
              <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowAdd(false); }}>
                <div className="nx-modal">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0" style={{ color: 'var(--nx-text)' }}>Add New Student</h5>
                    <button className="nx-close-btn" onClick={() => setShowAdd(false)}><i className="fas fa-times"></i></button>
                  </div>
                  <div className="row g-3">
                    {[
                      ['Name *', 'name', 'text', 'Full name'],
                      ['Email *', 'email', 'email', 'student@nexus.edu'],
                      ['Phone', 'phone', 'tel', '+91 XXXXX XXXXX'],
                      ['City', 'city', 'text', 'City'],
                    ].map(([label, key, type, ph]) => (
                      <div className="col-6" key={key}>
                        <label className="nx-label">{label}</label>
                        <input className="nx-input" type={type} placeholder={ph} value={newStudent[key]} onChange={e => setNewStudent(p => ({ ...p, [key]: e.target.value }))} />
                      </div>
                    ))}
                    <div className="col-6">
                      <label className="nx-label">Course</label>
                      <select className="nx-input" value={newStudent.course} onChange={e => setNewStudent(p => ({ ...p, course: e.target.value }))}>
                        {['MCA','BCA','BSc','MBA'].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="nx-label">Year</label>
                      <select className="nx-input" value={newStudent.year} onChange={e => setNewStudent(p => ({ ...p, year: +e.target.value }))}>
                        {[1,2,3].map(y => <option key={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="d-flex gap-3 justify-content-end mt-4">
                    <button className="btn btn-outline-secondary px-4" onClick={() => setShowAdd(false)}>Cancel</button>
                    <button className="btn btn-gradient px-4" onClick={addStudent}><i className="fas fa-plus me-2"></i>Add Student</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ════════ TAB 2: Online Exam ════════ */}
        {tab === 'exam' && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
              <div>
                <h4 className="fw-bold mb-1" style={{ color: 'var(--nx-text)' }}>Entrance Exam</h4>
                <p style={{ color: 'var(--nx-text-muted)' }} className="mb-0">Assign &amp; run the MCA entrance exam for any student</p>
              </div>
            </div>

            {!examStudent ? (
              /* Student picker for exam */
              <div className="nx-card">
                <h6 className="nx-card-title mb-3"><i className="fas fa-user-graduate me-2"></i>Select Student to Take Exam</h6>
                <div className="nx-student-pick-list">
                  {students.map(s => (
                    <div key={s.id} className="nx-student-pick-item" onClick={() => setExamStudent(s)}>
                      <div className="nx-avatar-xs">{s.name.split(' ').map(w=>w[0]).join('')}</div>
                      <div className="flex-grow-1">
                        <div style={{ color: 'var(--nx-text)', fontSize: 13 }}>{s.name}</div>
                        <div style={{ color: 'var(--nx-text-muted)', fontSize: 11 }}>{s.id} · {s.course} · Year {s.year}</div>
                      </div>
                      {examHistory[s.id]?.length > 0 && (
                        <span className="nx-badge nx-badge-info">Previous: {examHistory[s.id].slice(-1)[0].score}/90</span>
                      )}
                      <i className="fas fa-arrow-right" style={{ color: 'var(--nx-text-muted)', fontSize: 12 }}></i>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Running exam */
              <div>
                <button className="btn btn-outline-secondary btn-sm mb-3" onClick={() => setExamStudent(null)}>
                  <i className="fas fa-arrow-left me-2"></i>Back to student list
                </button>
                <EmbeddedExam student={examStudent} onComplete={handleExamComplete} />
              </div>
            )}
          </>
        )}

        {/* ════════ TAB 3: Exam Results (Admin) ════════ */}
        {tab === 'results' && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
              <div>
                <h4 className="fw-bold mb-1" style={{ color: 'var(--nx-text)' }}>Exam Results</h4>
                <p style={{ color: 'var(--nx-text-muted)' }} className="mb-0">All student exam submissions across all exams</p>
              </div>
            </div>

            {/* Exam summary cards */}
            <div className="row g-3 mb-4">
              {EXAMS.map(exam => {
                const passRate = getPassRate(exam.id);
                const avgMarks = getAvgMarks(exam.id);
                const subs = EXAM_SUBMISSIONS.filter(s => s.examId === exam.id);
                return (
                  <div className="col-lg-3 col-md-6" key={exam.id}>
                    <div className="nx-card h-100">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-bold mb-0" style={{ color: 'var(--nx-text)', fontSize: 13 }}>{exam.title}</h6>
                        <span className={`nx-badge nx-badge-${exam.status === 'active' ? 'success' : exam.status === 'completed' ? 'info' : 'warning'}`} style={{ fontSize: 10 }}>{exam.status}</span>
                      </div>
                      <p style={{ color: 'var(--nx-text-muted)', fontSize: 11 }} className="mb-3">{exam.subject}</p>
                      <div className="d-flex justify-content-between">
                        <div className="text-center">
                          <div className="fw-bold" style={{ color: '#22c55e', fontSize: 20 }}>{passRate}%</div>
                          <div style={{ color: 'var(--nx-text-muted)', fontSize: 10 }}>Pass Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="fw-bold" style={{ color: '#6366f1', fontSize: 20 }}>{avgMarks}</div>
                          <div style={{ color: 'var(--nx-text-muted)', fontSize: 10 }}>Avg Marks</div>
                        </div>
                        <div className="text-center">
                          <div className="fw-bold" style={{ color: '#0ea5e9', fontSize: 20 }}>{subs.length}</div>
                          <div style={{ color: 'var(--nx-text-muted)', fontSize: 10 }}>Attempts</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* All submissions table */}
            <div className="nx-card p-0">
              <div className="nx-card-header px-4 pt-4">
                <h6 className="nx-card-title"><i className="fas fa-list me-2"></i>All Exam Submissions</h6>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="nx-table">
                  <thead>
                    <tr>
                      <th>Student</th><th>Exam</th><th>Subject</th><th>Score</th>
                      <th>Percentage</th><th>Status</th><th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {EXAM_SUBMISSIONS.map(sub => {
                      const exam = EXAMS.find(e => e.id === sub.examId);
                      return (
                        <tr key={sub.id}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div className="nx-avatar-xs">{sub.studentName.split(' ').map(w=>w[0]).join('')}</div>
                              <div>
                                <div style={{ color: 'var(--nx-text)', fontSize: 13, fontWeight: 600 }}>{sub.studentName}</div>
                                <div style={{ color: 'var(--nx-text-muted)', fontSize: 11 }}>{sub.studentId}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ color: 'var(--nx-text)', fontSize: 13 }}>{exam?.title || sub.examId}</td>
                          <td><span className="nx-badge nx-badge-info">{exam?.subject || '—'}</span></td>
                          <td><span className="fw-bold" style={{ color: 'var(--nx-text)' }}>{sub.score}/{exam?.totalMarks || '?'}</span></td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div className="nx-mini-bar" style={{ width: 80 }}>
                                <div className="nx-mini-fill" style={{ width: `${sub.pct}%`, background: sub.pct >= 50 ? '#22c55e' : '#ef4444' }}></div>
                              </div>
                              <span style={{ fontSize: 12, color: sub.pct >= 50 ? '#22c55e' : '#ef4444' }}>{sub.pct}%</span>
                            </div>
                          </td>
                          <td><span className={`nx-badge nx-badge-${sub.status === 'pass' ? 'success' : 'danger'}`}>{sub.status === 'pass' ? 'Pass' : 'Fail'}</span></td>
                          <td style={{ color: 'var(--nx-text-muted)', fontSize: 12 }}>{new Date(sub.submittedAt).toLocaleDateString('en-IN')}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
