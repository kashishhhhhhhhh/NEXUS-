import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { examQuestions } from '../data/examData';

const TOTAL = examQuestions.length;
const TOTAL_TIME = 30 * 60;

/* ── Pre-exam screen ── */
function PreExam({ onStart }) {
  const [regId, setRegId] = useState('');
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="form-card text-center">
            <i className="fas fa-laptop-code fa-4x text-gradient mb-4"></i>
            <h2 className="text-white fw-bold">MCA Entrance Exam</h2>
            <p className="text-muted mb-4">Read the instructions carefully before starting.</p>
            <div className="exam-info-grid mb-4">
              {[['fas fa-question-circle text-primary','30 Questions'],['fas fa-clock text-warning','30 Minutes'],
                ['fas fa-star text-success','90 Marks'],['fas fa-cut text-danger','Cutoff: 50%']].map(([ic,lb],i)=>(
                <div className="exam-info-item" key={i}>
                  <i className={ic}></i><span className="text-white">{lb}</span>
                </div>
              ))}
            </div>
            <div className="instructions-box text-start mb-4">
              <h6 className="text-white mb-3"><i className="fas fa-info-circle me-2 text-warning"></i>Instructions</h6>
              <ul className="text-muted small">
                <li>Each question carries 3 marks. No negative marking.</li>
                <li>Do not refresh or close the browser during the exam.</li>
                <li>Navigate between questions using the question palette.</li>
                <li>The exam will auto-submit when time runs out.</li>
                <li>Subjects: Programming (10), DBMS (10), Aptitude (10)</li>
              </ul>
            </div>
            <div className="mb-4">
              <label className="form-label text-muted">Enter Registration ID to Start</label>
              <input className="custom-input text-center" placeholder="e.g. OE-2026-12345"
                value={regId} onChange={e => setRegId(e.target.value)} />
            </div>
            <button className="btn btn-gradient btn-lg px-5" onClick={() => {
              if (!regId.trim()) { alert('Please enter your Registration ID.'); return; }
              onStart();
            }}>
              <i className="fas fa-play me-2"></i>Start Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Result screen ── */
function Result({ score, correct, wrong, skipped }) {
  const navigate = useNavigate();
  const pct = Math.round((score / 90) * 100);
  const passed = pct >= 50;
  const circleStyle = { '--score-pct': pct + '%' };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="form-card text-center">
            {passed
              ? <i className="fas fa-trophy fa-5x text-warning mb-4"></i>
              : <i className="fas fa-times-circle fa-5x text-danger mb-4"></i>}
            <h2 className="text-white fw-bold">{passed ? 'Congratulations! You Passed!' : 'Better Luck Next Time'}</h2>
            <p className="text-muted">Score: {score}/90 ({pct}%) — {passed ? 'Qualified for Interview Round.' : 'Minimum 50% required.'}</p>
            <div className="score-circle mx-auto my-4" style={circleStyle}>
              <span>{score}</span><small>/90</small>
            </div>
            <div className="row g-3 mb-4">
              <div className="col-4"><div className="stat-box"><h4 className="text-success">{correct}</h4><p className="text-muted small mb-0">Correct</p></div></div>
              <div className="col-4"><div className="stat-box"><h4 className="text-danger">{wrong}</h4><p className="text-muted small mb-0">Wrong</p></div></div>
              <div className="col-4"><div className="stat-box"><h4 className="text-warning">{skipped}</h4><p className="text-muted small mb-0">Skipped</p></div></div>
            </div>
            {passed ? (
              <>
                <div className="alert mb-3" style={{background:'rgba(34,197,94,0.1)',border:'1px solid rgba(34,197,94,0.3)',borderRadius:12,color:'#86efac'}}>
                  <i className="fas fa-check-circle me-2"></i>You cleared the cutoff. Proceed to the Interview Round.
                </div>
                <button className="btn btn-gradient btn-lg px-5" onClick={() => navigate('/interview')}>
                  <i className="fas fa-video me-2"></i>Go to Interview
                </button>
              </>
            ) : (
              <>
                <div className="alert mb-3" style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:12,color:'#fca5a5'}}>
                  <i className="fas fa-info-circle me-2"></i>You did not meet the cutoff. Re-apply in the next cycle.
                </div>
                <button className="btn btn-gradient btn-lg px-5" onClick={() => navigate('/')}>
                  <i className="fas fa-home me-2"></i>Back to Home
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Exam ── */
export default function Exam() {
  const [phase, setPhase] = useState('pre'); // pre | exam | result
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(new Array(TOTAL).fill(null));
  const [marked, setMarked] = useState(new Array(TOTAL).fill(false));
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [showConfirm, setShowConfirm] = useState(false);
  const [result, setResult] = useState(null);
  const timerRef = useRef(null);

  const submitExam = useCallback((ans = answers) => {
    clearInterval(timerRef.current);
    let correct = 0, wrong = 0, skipped = 0;
    examQuestions.forEach((q, i) => {
      if (ans[i] === null) skipped++;
      else if (ans[i] === q.ans) correct++;
      else wrong++;
    });
    setResult({ score: correct * 3, correct, wrong, skipped });
    setPhase('result');
  }, [answers]);

  useEffect(() => {
    if (phase !== 'exam') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); submitExam(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  const q = examQuestions[currentQ];
  const labels = ['A', 'B', 'C', 'D'];
  const answeredCount = answers.filter(a => a !== null).length;

  const selectOption = (i) => {
    const next = [...answers];
    next[currentQ] = i;
    setAnswers(next);
  };

  const toggleMark = () => {
    const next = [...marked];
    next[currentQ] = !next[currentQ];
    setMarked(next);
  };

  const getPaletteClass = (i) => {
    if (i === currentQ) return 'current';
    if (marked[i]) return 'review';
    if (answers[i] !== null) return 'answered';
    return '';
  };

  if (phase === 'result') return (
    <>
      <nav className="exam-topbar py-2">
        <div className="container"><span className="text-white fw-bold"><i className="fas fa-graduation-cap me-2"></i>Online Exam</span></div>
      </nav>
      <Result {...result} />
    </>
  );

  if (phase === 'pre') return (
    <>
      <nav className="exam-topbar py-2">
        <div className="container d-flex justify-content-between align-items-center">
          <span className="text-white fw-bold"><i className="fas fa-graduation-cap me-2"></i>Online Exam</span>
          <span className="text-muted small">MCA Entrance Examination 2026</span>
        </div>
      </nav>
      <PreExam onStart={() => setPhase('exam')} />
    </>
  );

  return (
    <>
      {/* Topbar */}
      <div className="exam-topbar">
        <div className="container d-flex justify-content-between align-items-center py-2">
          <div className="d-flex align-items-center gap-3">
            <span className="text-white fw-bold"><i className="fas fa-graduation-cap me-2"></i>Online Exam</span>
            <span className="badge bg-primary">{q.subject}</span>
          </div>
          <div className={`exam-timer ${timeLeft <= 300 ? 'warning' : ''}`}>
            <i className="fas fa-clock me-2"></i>{mins}:{secs}
          </div>
          <div className="text-muted small">{answeredCount}/{TOTAL} Answered</div>
        </div>
      </div>

      <div className="container-fluid py-3" style={{ maxWidth: 1200 }}>
        <div className="row g-3">
          {/* Question */}
          <div className="col-lg-8">
            <div className="question-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted small">Question {currentQ + 1} of {TOTAL}</span>
                <span className="badge" style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8' }}>{q.subject}</span>
              </div>
              <div className="progress mb-3" style={{ height: 4, background: '#1a1a3e' }}>
                <div className="progress-bar bg-gradient-bar" style={{ width: `${((currentQ + 1) / TOTAL) * 100}%` }}></div>
              </div>
              <h5 className="text-white mb-4">{q.q}</h5>
              <div className="options-list">
                {q.opts.map((opt, i) => (
                  <div key={i} className={`option-item ${answers[currentQ] === i ? 'selected' : ''}`}
                    onClick={() => selectOption(i)}>
                    <span className="option-label">{labels[i]}</span>
                    <span>{opt}</span>
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-outline-secondary px-4" disabled={currentQ === 0}
                  onClick={() => setCurrentQ(q => q - 1)}>
                  <i className="fas fa-arrow-left me-2"></i>Previous
                </button>
                <button className="btn btn-outline-warning px-4" onClick={toggleMark}>
                  <i className={`fas fa-bookmark me-2`}></i>{marked[currentQ] ? 'Unmark' : 'Mark for Review'}
                </button>
                {currentQ < TOTAL - 1
                  ? <button className="btn btn-gradient px-4" onClick={() => setCurrentQ(q => q + 1)}>Next <i className="fas fa-arrow-right ms-2"></i></button>
                  : <button className="btn btn-danger px-4" onClick={() => setShowConfirm(true)}>Finish</button>
                }
              </div>
            </div>
          </div>

          {/* Palette */}
          <div className="col-lg-4">
            <div className="palette-card">
              <h6 className="text-white mb-3"><i className="fas fa-th me-2"></i>Question Palette</h6>
              <div className="palette-legend mb-3">
                {[['dot-answered','Answered'],['dot-unanswered','Not Answered'],['dot-review','Review'],['dot-current','Current']].map(([cls,lb])=>(
                  <span className="legend-item" key={cls}><span className={`dot ${cls}`}></span>{lb}</span>
                ))}
              </div>
              <div className="question-palette">
                {examQuestions.map((_, i) => (
                  <button key={i} className={`palette-btn ${getPaletteClass(i)}`}
                    onClick={() => setCurrentQ(i)}>{i + 1}</button>
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
          <div className="modal-box text-center">
            <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
            <h5 className="text-white">Submit Exam?</h5>
            <p className="text-muted">You have answered {answeredCount} out of {TOTAL} questions.</p>
            <div className="d-flex gap-3 justify-content-center mt-3">
              <button className="btn btn-outline-secondary px-4" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn btn-danger px-4" onClick={() => { setShowConfirm(false); submitExam(); }}>Submit Now</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
