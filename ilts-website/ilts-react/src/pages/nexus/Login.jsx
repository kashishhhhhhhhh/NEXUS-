import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const DEMO = [
  { role: 'Admin',   username: 'admin',   password: 'admin123',   icon: 'fas fa-shield-alt',  color: '#6366f1' },
  { role: 'Faculty', username: 'faculty', password: 'faculty123', icon: 'fas fa-chalkboard-teacher', color: '#0ea5e9' },
  { role: 'Student', username: 'student', password: 'student123', icon: 'fas fa-user-graduate', color: '#22c55e' },
];

const ROLES = [
  { value: 'student', label: 'Student', icon: 'fas fa-user-graduate' },
  { value: 'faculty', label: 'Faculty', icon: 'fas fa-chalkboard-teacher' },
  { value: 'admin',   label: 'Admin',   icon: 'fas fa-shield-alt' },
];

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Tab: 'signin' | 'signup'
  const [tab, setTab] = useState('signin');

  // Sign in form
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  // Sign up form
  const [reg, setReg] = useState({ name: '', email: '', username: '', password: '', role: 'student' });
  const [regError, setRegError] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const setRegField = k => e => setReg(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.username || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const res = await login(form.username, form.password);
    setLoading(false);
    if (res.ok) navigate('/dashboard');
    else setError(res.error);
  };

  const handleRegister = async e => {
    e.preventDefault();
    setRegError('');
    if (!reg.name || !reg.email || !reg.username || !reg.password) {
      setRegError('Please fill in all fields.'); return;
    }
    if (reg.password.length < 4) { setRegError('Password must be at least 4 characters.'); return; }
    setRegLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const res = await register(reg.name, reg.email, reg.username, reg.password, reg.role);
    setRegLoading(false);
    if (res.ok) navigate('/dashboard');
    else setRegError(res.error);
  };

  const fillDemo = d => { setForm({ username: d.username, password: d.password }); setTab('signin'); };

  return (
    <div className="nx-login-page">
      <div className="nx-blob nx-blob-1"></div>
      <div className="nx-blob nx-blob-2"></div>

      <div className="nx-login-container">
        {/* Left panel — branding */}
        <div className="nx-login-left d-none d-lg-flex">
          <div className="nx-login-brand">
            <div className="nx-logo-ring mb-4">
              <i className="fas fa-atom fa-3x"></i>
            </div>
            <h1 className="display-4 fw-black text-white mb-3">NEXUS</h1>
            <p className="lead" style={{ color: '#a5b4fc' }}>
              Next-Generation Educational<br />eXperience &amp; Unified System
            </p>
            <div className="nx-login-features mt-5">
              {[
                ['fas fa-chart-line', 'Real-time Analytics'],
                ['fas fa-brain',      'ML-powered Insights'],
                ['fas fa-shield-alt', 'Role-based Access'],
                ['fas fa-mobile-alt', 'Responsive Design'],
              ].map(([ic, lb]) => (
                <div className="nx-login-feature" key={lb}>
                  <i className={ic} style={{ color: '#818cf8' }}></i>
                  <span>{lb}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="nx-login-right">
          <div className="nx-login-card">
            {/* Mobile header */}
            <div className="d-flex align-items-center gap-3 mb-5 d-lg-none">
              <div className="nx-logo-ring-sm">
                <i className="fas fa-atom"></i>
              </div>
              <div>
                <h4 className="text-white fw-black mb-0">NEXUS</h4>
                <p className="text-muted small mb-0">Institute Management</p>
              </div>
            </div>

            {/* Tab toggle */}
            <div className="nx-tab-bar mb-4">
              <button className={`nx-tab ${tab === 'signin' ? 'active' : ''}`} onClick={() => { setTab('signin'); setError(''); }}>
                <i className="fas fa-sign-in-alt"></i> Sign In
              </button>
              <button className={`nx-tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => { setTab('signup'); setRegError(''); }}>
                <i className="fas fa-user-plus"></i> Sign Up
              </button>
            </div>

            {/* ═══ Sign In ═══ */}
            {tab === 'signin' && (
              <>
                <h2 className="text-white fw-bold mb-1">Welcome back</h2>
                <p className="text-muted mb-4">Sign in to access your dashboard</p>

                {error && (
                  <div className="nx-alert nx-alert-error mb-4">
                    <i className="fas fa-exclamation-circle me-2"></i>{error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="nx-label">Username</label>
                    <div className="nx-input-wrap">
                      <i className="fas fa-user nx-input-icon"></i>
                      <input className="nx-input" placeholder="Enter username" value={form.username} onChange={set('username')} autoComplete="username" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="nx-label">Password</label>
                    <div className="nx-input-wrap">
                      <i className="fas fa-lock nx-input-icon"></i>
                      <input className="nx-input" type={showPw ? 'text' : 'password'} placeholder="Enter password" value={form.password} onChange={set('password')} autoComplete="current-password" />
                      <button type="button" className="nx-input-eye" onClick={() => setShowPw(v => !v)} aria-label="Toggle password visibility">
                        <i className={`fas fa-eye${showPw ? '-slash' : ''}`}></i>
                      </button>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-gradient w-100 py-3 fw-bold" disabled={loading}>
                    {loading ? <><i className="fas fa-spinner fa-spin me-2"></i>Signing in…</> : <><i className="fas fa-sign-in-alt me-2"></i>Sign In</>}
                  </button>
                </form>

                {/* Demo credentials */}
                <div className="nx-demo-section mt-5">
                  <p className="text-muted small text-center mb-3">
                    <i className="fas fa-info-circle me-1"></i>Demo Credentials — click to fill
                  </p>
                  <div className="d-flex flex-column gap-2">
                    {DEMO.map(d => (
                      <button key={d.role} className="nx-demo-btn" onClick={() => fillDemo(d)} type="button">
                        <div className="nx-demo-icon" style={{ background: d.color + '22', color: d.color }}>
                          <i className={d.icon}></i>
                        </div>
                        <div className="text-start flex-grow-1">
                          <div className="text-white fw-semibold" style={{ fontSize: 13 }}>{d.role}</div>
                          <div className="text-muted" style={{ fontSize: 11 }}>{d.username} / {d.password}</div>
                        </div>
                        <i className="fas fa-arrow-right text-muted" style={{ fontSize: 11 }}></i>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ═══ Sign Up ═══ */}
            {tab === 'signup' && (
              <>
                <h2 className="text-white fw-bold mb-1">Create account</h2>
                <p className="text-muted mb-4">Register to access the NEXUS platform</p>

                {regError && (
                  <div className="nx-alert nx-alert-error mb-4">
                    <i className="fas fa-exclamation-circle me-2"></i>{regError}
                  </div>
                )}

                <form onSubmit={handleRegister}>
                  <div className="mb-3">
                    <label className="nx-label">Full Name</label>
                    <div className="nx-input-wrap">
                      <i className="fas fa-id-card nx-input-icon"></i>
                      <input className="nx-input" placeholder="Enter your full name" value={reg.name} onChange={setRegField('name')} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="nx-label">Email</label>
                    <div className="nx-input-wrap">
                      <i className="fas fa-envelope nx-input-icon"></i>
                      <input className="nx-input" type="email" placeholder="your@email.com" value={reg.email} onChange={setRegField('email')} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="nx-label">Username</label>
                    <div className="nx-input-wrap">
                      <i className="fas fa-user nx-input-icon"></i>
                      <input className="nx-input" placeholder="Choose a username" value={reg.username} onChange={setRegField('username')} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="nx-label">Password</label>
                    <div className="nx-input-wrap">
                      <i className="fas fa-lock nx-input-icon"></i>
                      <input className="nx-input" type={showPw ? 'text' : 'password'} placeholder="Choose a password" value={reg.password} onChange={setRegField('password')} />
                      <button type="button" className="nx-input-eye" onClick={() => setShowPw(v => !v)} aria-label="Toggle password visibility">
                        <i className={`fas fa-eye${showPw ? '-slash' : ''}`}></i>
                      </button>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="nx-label">Register as</label>
                    <div className="d-flex gap-2">
                      {ROLES.map(r => (
                        <button
                          key={r.value}
                          type="button"
                          className={`nx-role-pick ${reg.role === r.value ? 'active' : ''}`}
                          onClick={() => setReg(f => ({ ...f, role: r.value }))}
                        >
                          <i className={r.icon}></i>
                          <span>{r.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <button type="submit" className="btn btn-gradient w-100 py-3 fw-bold" disabled={regLoading}>
                    {regLoading ? <><i className="fas fa-spinner fa-spin me-2"></i>Creating account…</> : <><i className="fas fa-user-plus me-2"></i>Sign Up</>}
                  </button>
                </form>

                <p className="text-center text-muted mt-4" style={{ fontSize: 12 }}>
                  Already have an account? <button className="btn btn-link p-0" style={{ fontSize: 12, color: '#6366f1' }} onClick={() => setTab('signin')}>Sign in</button>
                </p>
              </>
            )}

            <p className="text-center text-muted mt-4" style={{ fontSize: 12 }}>
              NEXUS — Institute Management System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
