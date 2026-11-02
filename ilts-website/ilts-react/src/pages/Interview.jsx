import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { interviewTopics } from '../data/examData';

function useCountdown(targetDate) {
  const [time, setTime] = useState({ d: '00', h: '00', m: '00', s: '00', arrived: false });
  useEffect(() => {
    if (!targetDate) return;
    const tick = () => {
      const diff = targetDate - new Date();
      if (diff <= 0) { setTime(t => ({ ...t, arrived: true })); return; }
      setTime({
        d: String(Math.floor(diff / 86400000)).padStart(2, '0'),
        h: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
        s: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
        arrived: false,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
}

const infoCards = [
  { icon: 'fas fa-clock text-warning', title: 'Duration', sub: '15-20 Minutes' },
  { icon: 'fas fa-users text-primary', title: 'Panel', sub: '2-3 Expert Faculty' },
  { icon: 'fas fa-video text-success', title: 'Mode', sub: 'Video Conference' },
  { icon: 'fas fa-star text-danger', title: 'Marks', sub: '50 Points' },
];

const tips = [
  'Dress professionally (formal attire)',
  'Sit in a quiet, well-lit room',
  'Test camera and mic 15 mins before',
  'Keep your graduation documents ready',
  'Be confident and speak clearly',
  'Join 5 minutes before your slot',
];

/* ── Interview Room Modal ── */
function InterviewRoom({ onClose }) {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [messages, setMessages] = useState([{ from: 'panel', text: 'Welcome! Please introduce yourself.' }]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    setMessages(m => [...m, { from: 'you', text: input }]);
    setInput('');
  };

  const end = () => {
    if (window.confirm('Are you sure you want to end the interview?')) {
      onClose();
      alert('Interview ended. Results will be communicated via email within 48 hours.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box-xl">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-white mb-0"><i className="fas fa-video me-2 text-success"></i>Interview Room — Online Exam Panel</h5>
          <span className="badge bg-danger live-badge">● LIVE</span>
        </div>
        <div className="row g-3">
          <div className="col-md-8">
            <div className="video-main">
              <div className="video-placeholder">
                <i className="fas fa-user-tie fa-4x text-muted mb-3"></i>
                <p className="text-muted">Panel Member — Dr. Sharma</p>
                <span className="badge bg-success">Speaking</span>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="video-self mb-3">
              <div className="video-placeholder-sm">
                <i className="fas fa-user fa-2x text-muted mb-2"></i>
                <p className="text-muted small mb-0">You</p>
              </div>
            </div>
            <div className="interview-chat">
              <h6 className="text-white mb-2 small"><i className="fas fa-comments me-2"></i>Chat</h6>
              <div className="chat-messages">
                {messages.map((m, i) => (
                  <div key={i} className={`chat-msg ${m.from === 'panel' ? 'panel-msg' : 'user-msg'}`}>
                    <span className="chat-sender">{m.from === 'panel' ? 'Panel:' : 'You:'}</span> {m.text}
                  </div>
                ))}
              </div>
              <div className="input-group mt-2">
                <input className="custom-input" style={{ fontSize: 12 }} placeholder="Type message..."
                  value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()} />
                <button className="btn btn-gradient btn-sm ms-1" onClick={send}><i className="fas fa-paper-plane"></i></button>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center gap-3 mt-3">
          <button className={`btn control-btn ${micOn ? 'btn-dark' : 'btn-danger'}`} onClick={() => setMicOn(v => !v)}>
            <i className={`fas fa-microphone${micOn ? '' : '-slash'}`}></i>
          </button>
          <button className={`btn control-btn ${camOn ? 'btn-dark' : 'btn-danger'}`} onClick={() => setCamOn(v => !v)}>
            <i className={`fas fa-video${camOn ? '' : '-slash'}`}></i>
          </button>
          <button className="btn btn-dark control-btn"><i className="fas fa-desktop"></i></button>
          <button className="btn btn-danger control-btn" onClick={end}><i className="fas fa-phone-slash"></i></button>
        </div>
      </div>
    </div>
  );
}

/* ── System Check ── */
function SystemCheck() {
  const [checks, setChecks] = useState([
    { label: 'Camera', status: 'loading' },
    { label: 'Microphone', status: 'loading' },
    { label: 'Internet', status: 'loading' },
    { label: 'Browser', status: 'loading' },
  ]);

  const run = () => {
    setChecks(c => c.map(x => ({ ...x, status: 'loading' })));
    const results = [true, true, navigator.onLine, true];
    results.forEach((pass, i) => {
      setTimeout(() => {
        setChecks(c => c.map((x, j) => j === i ? { ...x, status: pass ? 'ok' : 'fail' } : x));
      }, (i + 1) * 600);
    });
  };

  useEffect(() => { run(); }, []);

  return (
    <div className="system-check-box mb-4">
      <h6 className="text-white mb-3"><i className="fas fa-cog me-2 text-warning"></i>System Check</h6>
      <div className="row g-2">
        {checks.map((c, i) => (
          <div className="col-6" key={i}>
            <div className="check-item">
              {c.status === 'loading' && <i className="fas fa-spinner fa-spin text-muted me-2"></i>}
              {c.status === 'ok' && <i className="fas fa-check-circle text-success me-2"></i>}
              {c.status === 'fail' && <i className="fas fa-times-circle text-danger me-2"></i>}
              <span style={{ color: c.status === 'ok' ? '#86efac' : c.status === 'fail' ? '#fca5a5' : '#94a3b8' }}>
                {c.label}{c.status !== 'loading' ? ` — ${c.status === 'ok' ? 'OK' : 'Failed'}` : ''}
              </span>
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-outline-primary btn-sm mt-3" onClick={run}>
        <i className="fas fa-redo me-2"></i>Run System Check
      </button>
    </div>
  );
}

/* ── Main Interview Page ── */
export default function Interview() {
  const [regId, setRegId] = useState('');
  const [schedule, setSchedule] = useState(null);
  const [showRoom, setShowRoom] = useState(false);

  const checkSchedule = () => {
    if (!regId.trim()) { alert('Please enter your Registration ID.'); return; }
    const name = localStorage.getItem('ilts_name') || 'Candidate';
    const date = new Date();
    date.setDate(date.getDate() + 3);
    setSchedule({ name, regId, date, dateStr: date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) });
  };

  const countdown = useCountdown(schedule?.date);

  return (
    <>
      <Navbar />
      <div className="page-header text-center text-white">
        <div className="container">
          <h1 className="display-5 fw-bold"><i className="fas fa-video me-3"></i>Online Interview</h1>
          <p className="lead text-muted">Congratulations on clearing the exam! Complete your interview to finalize admission.</p>
        </div>
      </div>

      <div className="container py-5">
        {/* Info Cards */}
        <div className="row g-4 mb-5">
          {infoCards.map((c, i) => (
            <div className="col-md-3 col-sm-6" key={i}>
              <div className="interview-info-card text-center">
                <i className={`${c.icon} fa-2x mb-3`}></i>
                <h5 className="text-white">{c.title}</h5>
                <p className="text-muted mb-0">{c.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* Schedule */}
          <div className="col-lg-7">
            <div className="form-card">
              <h4 className="text-white mb-4"><i className="fas fa-calendar-check me-2 text-gradient"></i>Your Interview Schedule</h4>

              {!schedule ? (
                <>
                  <p className="text-muted mb-3">Enter your Registration ID to view your interview slot.</p>
                  <div className="d-flex gap-2">
                    <input className="custom-input flex-grow-1" placeholder="Enter Registration ID (e.g. OE-2026-12345)"
                      value={regId} onChange={e => setRegId(e.target.value)} />
                    <button className="btn btn-gradient px-4" onClick={checkSchedule}>
                      <i className="fas fa-search me-2"></i>Check
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="schedule-card mb-4">
                    <div className="row g-3">
                      {[['Candidate Name', schedule.name], ['Registration ID', schedule.regId],
                        ['Interview Date', schedule.dateStr], ['Time Slot', '10:30 AM - 10:50 AM'],
                        ['Panel', 'Panel A — Dr. R. Sharma, Prof. M. Gupta']].map(([k, v]) => (
                        <div className="col-sm-6" key={k}>
                          <span className="text-muted small">{k}</span>
                          <p className="text-white fw-bold mb-0">{v}</p>
                        </div>
                      ))}
                      <div className="col-sm-6">
                        <span className="text-muted small">Status</span>
                        <p className="mb-0"><span className="badge bg-warning text-dark">Scheduled</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Countdown */}
                  <div className="countdown-box text-center mb-4">
                    {countdown.arrived
                      ? <p className="text-success">Interview time has arrived!</p>
                      : <>
                          <p className="text-muted small mb-2">Interview starts in</p>
                          <div className="d-flex justify-content-center gap-3">
                            {[['d','Days'],['h','Hours'],['m','Mins'],['s','Secs']].map(([k,lb])=>(
                              <div className="countdown-unit" key={k}>
                                <span>{countdown[k]}</span><small>{lb}</small>
                              </div>
                            ))}
                          </div>
                        </>
                    }
                  </div>

                  <SystemCheck />

                  <button className="btn btn-gradient w-100 btn-lg" onClick={() => setShowRoom(true)}>
                    <i className="fas fa-video me-2"></i>Join Interview Room
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Tips & Topics */}
          <div className="col-lg-5">
            <div className="form-card mb-4">
              <h5 className="text-white mb-3"><i className="fas fa-lightbulb me-2 text-warning"></i>Interview Tips</h5>
              <div className="tip-list">
                {tips.map((t, i) => (
                  <div className="tip-item" key={i}>
                    <i className="fas fa-check-circle text-success me-2"></i>
                    <span className="text-muted">{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="form-card">
              <h5 className="text-white mb-3"><i className="fas fa-book-open me-2 text-primary"></i>Topics to Prepare</h5>
              <div className="topic-tags">
                {interviewTopics.map(t => <span className="topic-tag" key={t}>{t}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showRoom && <InterviewRoom onClose={() => setShowRoom(false)} />}
    </>
  );
}
