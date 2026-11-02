import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import DashboardLayout from '../../components/nexus/DashboardLayout';
import { useAuth } from '../../context/useAuth';
import { EXAMS, EXAM_SUBMISSIONS } from '../../data/examModuleData';

const STATUS_META = {
  active:    { label: 'Available Now', color: '#22c55e', icon: 'fas fa-play-circle' },
  scheduled: { label: 'Upcoming',      color: '#f59e0b', icon: 'fas fa-clock' },
  completed: { label: 'Completed',     color: '#64748b', icon: 'fas fa-check-circle' },
};

/* ── Exam Instructions ── */
function ExamInstructions({ exam, onStart, onBack }) {
  return (
    <div className="nx-exam-launcher">
      <div className="nx-exam-launcher-icon"><i className="fas fa-laptop-code"></i></div>
      <h4 className="fw-bold mb-2" style={{ color: 'var(--nx-text)' }}>{exam.title}</h4>
      <p style={{ color: 'var(--nx-text-muted)', fontSize: 14 }} className="mb-4">{exam.subject}</p>
      <div className="nx-exam-info-chips">
        {[['fas fa-question-circle', `${exam.questions.length} Questions`],
          ['fas fa-clock', `${exam.duration} Minutes`],
          ['fas fa-star', `${exam.totalMarks} Marks`],
          ['fas fa-cut', `Cutoff: ${exam.passPct}%`]].map(([ic, lb]) => (
          <div className="nx-exam-info-chip" key={lb}>
            <i className={ic} style={{ color: '#6366f1' }}></i> {lb}
          </div>
        ))}
      </div>
      <div className="instructions-box text-start mb-4" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: 16 }}>
        <h6 className="mb-3" style={{ color: 'var(--nx-text)' }}><i className="fas fa-info-circle me-2" style={{ color: '#f59e0b' }}></i>Instructions</h6>
        <ul style={{ color: 'var(--nx-text-muted)', fontSize: 13 }} className="mb-0">
          <li>Each question carries {exam.totalMarks / exam.questions.length} marks. No negative marking.</li>
          <li>Navigate between questions using the question palette.</li>
          <li>The exam will auto-submit when time runs out.</li>
          <li>Do not refresh the browser during the exam.</li>
          <li>You need {exam.passPct}% to pass.</li>
        </ul>
      </div>
      <div className="d-flex gap-3 justify-content-center">
        <button className="btn btn-outline-secondary px-4" onClick={onBack}><i className="fas fa-arrow-left me-2"></i>Back</button>
        <button className="btn btn-gradient btn-lg px-5" onClick={onStart}><i className="fas fa-play me-2"></i>Start Exam</button>
      </div>
    </div>
  );
}

/* ── Active Exam Engine ── */
function ExamRunner({ exam, onSubmit, onExit }) {
  const TOTAL = exam.questions.length;
  const TOTAL_TIME = exam.duration * 60;
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(new Array(TOTAL).fill(null));
  const [marked, setMarked] = useState(new Array(TOTAL).fill(false));
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [showConfirm, setShowConfirm] = useState(false);
  const timerRef = useRef(null);

  const submitExam = useCallback((ans = answers) => {
    clearInterval(timerRef.current);
    let correct = 0, wrong = 0, skipped = 0;
    exam.questions.forEach((q, i) => {
      if (ans[i] === null) skipped++;
      else if (ans[i] === q.ans) correct++;
      else wrong++;
    });
    const score = correct * (exam.totalMarks / TOTAL);
    const pct = Math.round((score / exam.totalMarks) * 100);
    const status = pct >= exam.passPct ? 'pass' : 'fail';
    onSubmit({ score, correct, wrong, skipped, pct, status, answers: ans });
  }, [answers, exam, onSubmit, TOTAL]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); submitExam(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [submitExam]);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  const q = exam.questions[currentQ];
  const labels = ['A', 'B', 'C', 'D'];
  const answeredCount = answers.filter(a => a !== null).length;

  const selectOption = i => { const n = [...answers]; n[currentQ] = i; setAnswers(n); };
  const toggleMark = () => { const n = [...marked]; n[currentQ] = !n[currentQ]; setMarked(n); };
  const paletteClass = i => i === currentQ ? 'current' : marked[i] ? 'review' : answers[i] !== null ? 'answered' : '';

  return (
    <div>
      {/* Topbar */}
      <div className="exam-topbar" style={{ background: 'var(--nx-surface)', borderBottom: '1px solid var(--nx-card-border)' }}>
        <div className="container-fluid d-flex justify-content-between align-items-center py-2" style={{ maxWidth: 1100 }}>
          <div className="d-flex align-items-center gap-3">
            <span className="fw-bold" style={{ color: 'var(--nx-text)' }}><i className="fas fa-graduation-cap me-2"></i>{exam.title}</span>
            <span className="badge bg-primary">{exam.subject}</span>
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
                <span className="badge" style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8' }}>
                  {q.difficulty === 'hard' ? 'Hard' : q.difficulty === 'medium' ? 'Medium' : 'Easy'}
                </span>
              </div>
              <div className="progress mb-3" style={{ height: 4, background: 'var(--nx-input-bg)' }}>
                <div className="progress-bar bg-gradient-bar" style={{ width: `${((currentQ + 1) / TOTAL) * 100}%` }}></div>
              </div>
              <h5 className="mb-4" style={{ color: 'var(--nx-text)' }}>{q.q}</h5>
              <div className="options-list">
                {q.opts.map((opt, i) => (
                  <div key={i} className={`option-item ${answers[currentQ] === i ? 'selected' : ''}`}
                    style={{ background: answers[currentQ] === i ? 'rgba(99,102,241,0.2)' : 'var(--nx-card)', border: `1px solid ${answers[currentQ] === i ? '#6366f1' : 'var(--nx-card-border)'}`, color: answers[currentQ] === i ? 'var(--nx-accent)' : 'var(--nx-text)', cursor: 'pointer', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, transition: 'all 0.2s' }}
                    onClick={() => selectOption(i)}>
                    <span className="option-label">{labels[i]}</span>
                    <span>{opt}</span>
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-outline-secondary px-4" disabled={currentQ === 0} onClick={() => setCurrentQ(c => c - 1)}>
                  <i className="fas fa-arrow-left me-2"></i>Previous
                </button>
                <button className="btn btn-outline-warning px-4" onClick={toggleMark}>
                  <i className="fas fa-bookmark me-2"></i>{marked[currentQ] ? 'Unmark' : 'Mark'}
                </button>
                {currentQ < TOTAL - 1
                  ? <button className="btn btn-gradient px-4" onClick={() => setCurrentQ(c => c + 1)}>Next <i className="fas fa-arrow-right ms-2"></i></button>
                  : <button className="btn btn-danger px-4" onClick={() => setShowConfirm(true)}>Finish</button>}
              </div>
            </div>
          </div>

          {/* Palette */}
          <div className="col-lg-4">
            <div className="palette-card" style={{ background: 'var(--nx-card)', border: '1px solid var(--nx-card-border)', borderRadius: 16, padding: 20, position: 'sticky', top: 70 }}>
              <h6 className="mb-3" style={{ color: 'var(--nx-text)' }}><i className="fas fa-th me-2"></i>Question Palette</h6>
              <div className="palette-legend mb-3">
                {[['dot-answered','Answered'],['dot-unanswered','Not Answered'],['dot-review','Review'],['dot-current','Current']].map(([cls,lb]) => (
                  <span className="legend-item" key={cls}><span className={`dot ${cls}`}></span>{lb}</span>
                ))}
              </div>
              <div className="question-palette">
                {exam.questions.map((_, i) => (
                  <button key={i} className={`palette-btn ${paletteClass(i)}`} onClick={() => setCurrentQ(i)}>{i + 1}</button>
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
          <div className="nx-modal text-center" style={{ maxWidth: 420 }}>
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

/* ── Exam Result Screen ── */
function ExamResult({ exam, result, onBack }) {
  const passed = result.status === 'pass';
  return (
    <div className="nx-card text-center" style={{ maxWidth: 600, margin: '0 auto' }}>
      {passed
        ? <i className="fas fa-trophy fa-4x mb-3" style={{ color: '#f59e0b' }}></i>
        : <i className="fas fa-times-circle fa-4x mb-3" style={{ color: '#ef4444' }}></i>}
      <h4 className="fw-bold mb-2" style={{ color: 'var(--nx-text)' }}>
        {passed ? 'Passed!' : 'Better Luck Next Time'}
      </h4>
      <p style={{ color: 'var(--nx-text-muted)' }} className="mb-4">
        {exam.title} — Score: {result.score}/{exam.totalMarks} ({result.pct}%)
      </p>
      <div className="score-circle mx-auto my-3" style={{ '--score-pct': result.pct + '%' }}>
        <span>{result.score}</span><small>/{exam.totalMarks}</small>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-4"><div className="nx-summary-stat"><div className="nx-summary-stat-val" style={{ color: '#22c55e' }}>{result.correct}</div><div className="nx-summary-stat-label">Correct</div></div></div>
        <div className="col-4"><div className="nx-summary-stat"><div className="nx-summary-stat-val" style={{ color: '#ef4444' }}>{result.wrong}</div><div className="nx-summary-stat-label">Wrong</div></div></div>
        <div className="col-4"><div className="nx-summary-stat"><div className="nx-summary-stat-val" style={{ color: '#f59e0b' }}>{result.skipped}</div><div className="nx-summary-stat-label">Skipped</div></div></div>
      </div>
      <div className="mb-3">
        <span className={`nx-badge nx-badge-${passed ? 'success' : 'danger'}`} style={{ fontSize: 14, padding: '6px 16px' }}>
          {passed ? '✓ Passed' : '✗ Failed'} — Cutoff: {exam.passPct}%
        </span>
      </div>
      <button className="btn btn-gradient px-5" onClick={onBack}>
        <i className="fas fa-list me-2"></i>Back to Exams
      </button>
    </div>
  );
}

/* ── Main Page ── */
export default function OnlineExam() {
  const { user } = useAuth();
  const myId = 'NX001'; // logged-in student
  const [phase, setPhase] = useState('list'); // list | instructions | exam | result
  const [activeExam, setActiveExam] = useState(null);
  const [result, setResult] = useState(null);
  const [mySubmissions, setMySubmissions] = useState(
    EXAM_SUBMISSIONS.filter(s => s.studentId === myId)
  );

  const availableExams = useMemo(() => EXAMS.filter(e => e.status === 'active'), []);
  const scheduledExams = useMemo(() => EXAMS.filter(e => e.status === 'scheduled'), []);
  const completedExams = useMemo(() => EXAMS.filter(e => e.status === 'completed'), []);

  const myResults = useMemo(() => {
    return mySubmissions.map(sub => {
      const exam = EXAMS.find(e => e.id === sub.examId);
      return { ...sub, examTitle: exam?.title, examSubject: exam?.subject, examTotal: exam?.totalMarks };
    });
  }, [mySubmissions]);

  const startExam = (exam) => { setActiveExam(exam); setPhase('instructions'); };
  const beginExam = () => setPhase('exam');
  const handleSubmit = (res) => {
    setResult(res);
    setPhase('result');
    // Save submission locally
    const newSub = {
      id: 'SUB' + Date.now(),
      examId: activeExam.id,
      studentId: myId,
      studentName: user?.name || 'Student',
      answers: res.answers,
      score: res.score,
      pct: res.pct,
      status: res.status,
      submittedAt: new Date().toISOString(),
      timeTaken: activeExam.duration * 60,
    };
    setMySubmissions(prev => [...prev, newSub]);
  };

  const backToList = () => { setPhase('list'); setActiveExam(null); setResult(null); };

  // ── Render by phase ──
  if (phase === 'instructions' && activeExam)
    return <DashboardLayout><div className="fade-in"><ExamInstructions exam={activeExam} onStart={beginExam} onBack={backToList} /></div></DashboardLayout>;

  if (phase === 'exam' && activeExam)
    return <DashboardLayout><ExamRunner exam={activeExam} onSubmit={handleSubmit} onExit={backToList} /></DashboardLayout>;

  if (phase === 'result' && activeExam && result)
    return <DashboardLayout><div className="fade-in"><ExamResult exam={activeExam} result={result} onBack={backToList} /></div></DashboardLayout>;

  // ── Default: exam list ──
  return (
    <DashboardLayout>
      <div className="fade-in">
        <div className="mb-4">
          <h4 className="fw-bold mb-1" style={{ color: 'var(--nx-text)' }}>
            <i className="fas fa-laptop-code me-2" style={{ color: '#6366f1' }}></i>Online Exam
          </h4>
          <p style={{ color: 'var(--nx-text-muted)' }} className="mb-0">View available exams, take tests, and check your results</p>
        </div>

        {/* Stats */}
        <div className="row g-3 mb-4">
          {[
            ['fas fa-play-circle', availableExams.length, 'Available', '#22c55e'],
            ['fas fa-clock',       scheduledExams.length,  'Upcoming',  '#f59e0b'],
            ['fas fa-check-circle', myResults.length,       'Completed', '#6366f1'],
            ['fas fa-trophy',      myResults.filter(r => r.status === 'pass').length, 'Passed', '#f59e0b'],
          ].map(([ic, val, lb, color]) => (
            <div className="col-lg-3 col-sm-6" key={lb}>
              <div className="nx-kpi-card">
                <div className="nx-kpi-icon" style={{ background: color + '22', color }}><i className={ic}></i></div>
                <div>
                  <p className="mb-1" style={{ color: 'var(--nx-text-muted)', fontSize: 13 }}>{lb}</p>
                  <h3 className="fw-bold mb-0" style={{ color: 'var(--nx-text)', fontSize: 28 }}>{val}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Available Exams */}
        <h6 className="nx-card-title mb-3"><i className="fas fa-play-circle me-2 text-success"></i>Available Exams</h6>
        <div className="row g-4 mb-4">
          {availableExams.length === 0 && (
            <div className="col-12"><div className="nx-card text-center py-4"><p style={{ color: 'var(--nx-text-muted)' }} className="mb-0"><i className="fas fa-info-circle me-2"></i>No exams available right now. Check back later.</p></div></div>
          )}
          {availableExams.map(exam => (
            <div className="col-lg-6" key={exam.id}>
              <div className="nx-card h-100">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="fw-bold mb-1" style={{ color: 'var(--nx-text)' }}>{exam.title}</h5>
                    <span className="nx-badge nx-badge-info">{exam.subject}</span>
                  </div>
                  <span className="nx-badge nx-badge-success">{STATUS_META[exam.status].label}</span>
                </div>
                <div className="nx-exam-info-chips mb-3">
                  {[['fas fa-question-circle', `${exam.questions.length} Qs`],
                    ['fas fa-clock', `${exam.duration} min`],
                    ['fas fa-star', `${exam.totalMarks} marks`],
                    ['fas fa-cut', `${exam.passPct}% pass`]].map(([ic, lb]) => (
                    <div className="nx-exam-info-chip" key={lb}><i className={ic} style={{ color: '#6366f1', fontSize: 11 }}></i> {lb}</div>
                  ))}
                </div>
                <button className="btn btn-gradient w-100" onClick={() => startExam(exam)}>
                  <i className="fas fa-play me-2"></i>Start Exam
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Exams */}
        {scheduledExams.length > 0 && (
          <>
            <h6 className="nx-card-title mb-3"><i className="fas fa-clock me-2 text-warning"></i>Upcoming Exams</h6>
            <div className="row g-4 mb-4">
              {scheduledExams.map(exam => (
                <div className="col-lg-6" key={exam.id}>
                  <div className="nx-card h-100" style={{ opacity: 0.85 }}>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="fw-bold mb-1" style={{ color: 'var(--nx-text)' }}>{exam.title}</h5>
                        <span className="nx-badge nx-badge-info">{exam.subject}</span>
                      </div>
                      <span className="nx-badge nx-badge-warning">Upcoming</span>
                    </div>
                    <div className="nx-exam-info-chips mb-3">
                      {[['fas fa-calendar', exam.scheduledDate],
                        ['fas fa-question-circle', `${exam.questions.length} Qs`],
                        ['fas fa-clock', `${exam.duration} min`]].map(([ic, lb]) => (
                        <div className="nx-exam-info-chip" key={lb}><i className={ic} style={{ color: '#f59e0b', fontSize: 11 }}></i> {lb}</div>
                      ))}
                    </div>
                    <button className="btn btn-outline-secondary w-100" disabled>
                      <i className="fas fa-lock me-2"></i>Not Available Yet
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* My Results */}
        {myResults.length > 0 && (
          <>
            <h6 className="nx-card-title mb-3"><i className="fas fa-star me-2 text-primary"></i>My Exam Results</h6>
            <div className="nx-card p-0">
              <div style={{ overflowX: 'auto' }}>
                <table className="nx-table">
                  <thead>
                    <tr><th>Exam</th><th>Subject</th><th>Score</th><th>Percentage</th><th>Status</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {myResults.map(r => (
                      <tr key={r.id}>
                        <td><span style={{ color: 'var(--nx-text)', fontWeight: 600 }}>{r.examTitle}</span></td>
                        <td><span className="nx-badge nx-badge-info">{r.examSubject}</span></td>
                        <td><span className="fw-bold" style={{ color: 'var(--nx-text)' }}>{r.score}/{r.examTotal}</span></td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="nx-mini-bar" style={{ width: 80 }}>
                              <div className="nx-mini-fill" style={{ width: `${r.pct}%`, background: r.pct >= 50 ? '#22c55e' : '#ef4444' }}></div>
                            </div>
                            <span style={{ fontSize: 12, color: r.pct >= 50 ? '#22c55e' : '#ef4444' }}>{r.pct}%</span>
                          </div>
                        </td>
                        <td><span className={`nx-badge nx-badge-${r.status === 'pass' ? 'success' : 'danger'}`}>{r.status === 'pass' ? 'Pass' : 'Fail'}</span></td>
                        <td style={{ color: 'var(--nx-text-muted)', fontSize: 12 }}>{new Date(r.submittedAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
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
