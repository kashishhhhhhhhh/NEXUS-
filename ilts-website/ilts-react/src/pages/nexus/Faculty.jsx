import { useState } from 'react';
import DashboardLayout from '../../components/nexus/DashboardLayout';
import { FACULTY } from '../../data/nexusData';

export default function Faculty() {
  const [faculty, setFaculty] = useState(FACULTY);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', dept: 'Computer Science', subjects: '', exp: '', email: '', phone: '' });

  const filtered = faculty.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.dept.toLowerCase().includes(search.toLowerCase())
  );

  const addFaculty = () => {
    if (!form.name || !form.email) { alert('Name and email are required.'); return; }
    const id = 'FC' + String(faculty.length + 1).padStart(3, '0');
    setFaculty(prev => [...prev, {
      ...form,
      id,
      subjects: form.subjects.split(',').map(s => s.trim()).filter(Boolean),
      exp: +form.exp || 0,
      status: 'active',
    }]);
    setShowAdd(false);
    setForm({ name: '', dept: 'Computer Science', subjects: '', exp: '', email: '', phone: '' });
  };

  const deleteFaculty = (id) => {
    if (window.confirm('Delete this faculty record?'))
      setFaculty(prev => prev.filter(f => f.id !== id));
  };

  const DEPTS = ['Computer Science', 'IT', 'Mathematics', 'Management', 'Electronics'];

  return (
    <DashboardLayout>
      <div className="fade-in">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h4 className="text-white fw-bold mb-1">Faculty</h4>
            <p className="text-muted mb-0">{filtered.length} members</p>
          </div>
          <button className="btn btn-gradient px-4" onClick={() => setShowAdd(true)}>
            <i className="fas fa-plus me-2"></i>Add Faculty
          </button>
        </div>

        <div className="nx-input-wrap mb-4" style={{ maxWidth: 360 }}>
          <i className="fas fa-search nx-input-icon"></i>
          <input className="nx-input" placeholder="Search faculty…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="row g-4">
          {filtered.map(f => (
            <div className="col-lg-4 col-md-6" key={f.id}>
              <div className="nx-faculty-card">
                <div className="d-flex align-items-start gap-3 mb-3">
                  <div className="nx-avatar" style={{ background: '#6366f1', flexShrink: 0 }}>
                    {f.name.split(' ').filter(w => w !== 'Prof.' && w !== 'Dr.').map(w => w[0]).slice(0,2).join('')}
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="text-white fw-bold mb-0" style={{ fontSize: 14 }}>{f.name}</h6>
                    <p className="text-muted mb-1" style={{ fontSize: 12 }}>{f.dept}</p>
                    <span className={`nx-badge nx-badge-${f.status === 'active' ? 'success' : 'warning'}`}>{f.status}</span>
                  </div>
                  <span className="text-muted" style={{ fontSize: 11 }}>{f.id}</span>
                </div>

                <div className="d-flex flex-wrap gap-2 mb-3">
                  {f.subjects.map(s => (
                    <span key={s} className="nx-badge nx-badge-info">{s}</span>
                  ))}
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted" style={{ fontSize: 12 }}>
                    <i className="fas fa-briefcase me-1"></i>{f.exp} yrs exp
                  </span>
                  <div className="d-flex gap-2">
                    <button className="nx-icon-btn" onClick={() => setSelected(f)} title="View">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="nx-icon-btn nx-icon-btn-danger" onClick={() => deleteFaculty(f.id)} title="Delete">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Faculty Detail Modal */}
        {selected && (
          <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
            <div className="nx-modal">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="text-white fw-bold mb-0">Faculty Profile</h5>
                <button className="nx-close-btn" onClick={() => setSelected(null)}><i className="fas fa-times"></i></button>
              </div>
              <div className="text-center mb-4">
                <div className="nx-avatar nx-avatar-lg mx-auto mb-3" style={{ background: '#6366f1' }}>
                  {selected.name.split(' ').filter(w => w !== 'Prof.' && w !== 'Dr.').map(w=>w[0]).slice(0,2).join('')}
                </div>
                <h5 className="text-white">{selected.name}</h5>
                <span className="nx-badge nx-badge-info">{selected.id}</span>
              </div>
              <div className="row g-3">
                {[
                  ['Department', selected.dept],
                  ['Experience', `${selected.exp} years`],
                  ['Email', selected.email],
                  ['Phone', selected.phone],
                  ['Status', selected.status],
                ].map(([k,v]) => (
                  <div className="col-6" key={k}>
                    <div className="nx-profile-field">
                      <span className="nx-profile-label">{k}</span>
                      <span className="nx-profile-value">{v}</span>
                    </div>
                  </div>
                ))}
                <div className="col-12">
                  <div className="nx-profile-field">
                    <span className="nx-profile-label">Subjects</span>
                    <div className="d-flex flex-wrap gap-2 mt-1">
                      {selected.subjects.map(s => <span key={s} className="nx-badge nx-badge-info">{s}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Faculty Modal */}
        {showAdd && (
          <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowAdd(false); }}>
            <div className="nx-modal">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="text-white fw-bold mb-0">Add Faculty Member</h5>
                <button className="nx-close-btn" onClick={() => setShowAdd(false)}><i className="fas fa-times"></i></button>
              </div>
              <div className="row g-3">
                {[
                  ['Full Name *', 'name', 'text', 'Dr. / Prof. Name'],
                  ['Email *', 'email', 'email', 'name@nexus.edu'],
                  ['Phone', 'phone', 'tel', '+91 XXXXX XXXXX'],
                  ['Experience (yrs)', 'exp', 'number', '0'],
                ].map(([label, key, type, ph]) => (
                  <div className="col-6" key={key}>
                    <label className="nx-label">{label}</label>
                    <input className="nx-input" type={type} placeholder={ph}
                      value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
                  </div>
                ))}
                <div className="col-6">
                  <label className="nx-label">Department</label>
                  <select className="nx-input" value={form.dept}
                    onChange={e => setForm(p => ({ ...p, dept: e.target.value }))}>
                    {DEPTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="col-6">
                  <label className="nx-label">Subjects (comma-separated)</label>
                  <input className="nx-input" placeholder="DBMS, Python, OS"
                    value={form.subjects} onChange={e => setForm(p => ({ ...p, subjects: e.target.value }))} />
                </div>
              </div>
              <div className="d-flex gap-3 justify-content-end mt-4">
                <button className="btn btn-outline-secondary px-4" onClick={() => setShowAdd(false)}>Cancel</button>
                <button className="btn btn-gradient px-4" onClick={addFaculty}>
                  <i className="fas fa-plus me-2"></i>Add Faculty
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
