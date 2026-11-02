import { useState } from 'react';
import DashboardLayout from '../../components/nexus/DashboardLayout';
import { COURSES } from '../../data/nexusData';

export default function CoursesPage() {
  const [courses, setCourses] = useState(COURSES);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', fullName: '', duration: '2 Years', seats: '', fee: '', dept: 'Computer Science' });
  const [editId, setEditId] = useState(null);

  const DEPTS = ['Computer Science', 'IT', 'Mathematics', 'Management', 'Electronics'];

  const addCourse = () => {
    if (!form.name || !form.fullName || !form.seats || !form.fee) { alert('Fill required fields.'); return; }
    if (editId) {
      setCourses(prev => prev.map(c => c.id === editId ? { ...c, ...form, seats: +form.seats, fee: +form.fee } : c));
      setEditId(null);
    } else {
      const id = 'C' + String(courses.length + 1).padStart(3, '0');
      setCourses(prev => [...prev, { ...form, id, seats: +form.seats, fee: +form.fee, enrolled: 0 }]);
    }
    setShowAdd(false);
    setForm({ name: '', fullName: '', duration: '2 Years', seats: '', fee: '', dept: 'Computer Science' });
  };

  const startEdit = (c) => {
    setForm({ name: c.name, fullName: c.fullName, duration: c.duration, seats: c.seats, fee: c.fee, dept: c.dept });
    setEditId(c.id);
    setShowAdd(true);
  };

  const deleteCourse = (id) => {
    if (window.confirm('Delete this course?')) setCourses(prev => prev.filter(c => c.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="fade-in">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h4 className="text-white fw-bold mb-1">Courses</h4>
            <p className="text-muted mb-0">{courses.length} programmes offered</p>
          </div>
          <button className="btn btn-gradient px-4" onClick={() => { setEditId(null); setShowAdd(true); }}>
            <i className="fas fa-plus me-2"></i>Add Course
          </button>
        </div>

        {/* Summary cards */}
        <div className="row g-4 mb-4">
          {courses.map(c => {
            const fill = Math.round((c.enrolled / c.seats) * 100);
            return (
              <div className="col-lg-3 col-md-6" key={c.id}>
                <div className="nx-card nx-course-card">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="text-white fw-black mb-1">{c.name}</h5>
                      <p className="text-muted mb-0" style={{ fontSize: 12 }}>{c.fullName}</p>
                    </div>
                    <span className="nx-badge nx-badge-info">{c.id}</span>
                  </div>
                  <div className="row g-2 mb-3">
                    {[
                      ['fas fa-clock', c.duration, '#6366f1'],
                      ['fas fa-users', `${c.enrolled}/${c.seats}`, '#0ea5e9'],
                      ['fas fa-rupee-sign', `₹${(c.fee/1000).toFixed(0)}K/yr`, '#22c55e'],
                      ['fas fa-building', c.dept, '#f59e0b'],
                    ].map(([ic, val, col]) => (
                      <div className="col-6" key={ic}>
                        <div className="d-flex align-items-center gap-1">
                          <i className={ic} style={{ color: col, fontSize: 11 }}></i>
                          <span className="text-muted" style={{ fontSize: 11 }}>{val}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Seat fill bar */}
                  <div className="mb-1 d-flex justify-content-between">
                    <span className="text-muted" style={{ fontSize: 11 }}>Seats filled</span>
                    <span style={{ fontSize: 11, color: fill > 80 ? '#ef4444' : fill > 60 ? '#f59e0b' : '#22c55e' }}>{fill}%</span>
                  </div>
                  <div className="nx-mini-bar mb-3">
                    <div className="nx-mini-fill" style={{ width: `${fill}%`, background: fill > 80 ? '#ef4444' : fill > 60 ? '#f59e0b' : '#22c55e' }}></div>
                  </div>
                  <div className="d-flex gap-2 justify-content-end">
                    <button className="nx-icon-btn" onClick={() => startEdit(c)} title="Edit"><i className="fas fa-edit"></i></button>
                    <button className="nx-icon-btn nx-icon-btn-danger" onClick={() => deleteCourse(c.id)} title="Delete"><i className="fas fa-trash"></i></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full table */}
        <div className="nx-card p-0">
          <div className="nx-card-header px-4 pt-4">
            <h6 className="nx-card-title"><i className="fas fa-list me-2"></i>All Courses</h6>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="nx-table">
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Full Name</th><th>Duration</th><th>Seats</th><th>Enrolled</th><th>Fee/yr</th><th>Department</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(c => (
                  <tr key={c.id}>
                    <td className="text-muted" style={{ fontSize: 12 }}>{c.id}</td>
                    <td><span className="text-white fw-semibold">{c.name}</span></td>
                    <td className="text-muted" style={{ fontSize: 12 }}>{c.fullName}</td>
                    <td className="text-muted" style={{ fontSize: 12 }}>{c.duration}</td>
                    <td className="text-muted" style={{ fontSize: 12 }}>{c.seats}</td>
                    <td><span className="text-white">{c.enrolled}</span></td>
                    <td className="text-white">₹{c.fee.toLocaleString('en-IN')}</td>
                    <td><span className="nx-badge nx-badge-info">{c.dept}</span></td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="nx-icon-btn" onClick={() => startEdit(c)} title="Edit"><i className="fas fa-edit"></i></button>
                        <button className="nx-icon-btn nx-icon-btn-danger" onClick={() => deleteCourse(c.id)} title="Delete"><i className="fas fa-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showAdd && (
          <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) { setShowAdd(false); setEditId(null); } }}>
            <div className="nx-modal">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="text-white fw-bold mb-0">{editId ? 'Edit' : 'Add'} Course</h5>
                <button className="nx-close-btn" onClick={() => { setShowAdd(false); setEditId(null); }}><i className="fas fa-times"></i></button>
              </div>
              <div className="row g-3">
                {[
                  ['Short Name *', 'name', 'text', 'e.g. MCA'],
                  ['Full Name *', 'fullName', 'text', 'Master of Computer Applications'],
                  ['Total Seats *', 'seats', 'number', '60'],
                  ['Annual Fee (₹) *', 'fee', 'number', '95000'],
                ].map(([label, key, type, ph]) => (
                  <div className="col-6" key={key}>
                    <label className="nx-label">{label}</label>
                    <input className="nx-input" type={type} placeholder={ph}
                      value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
                  </div>
                ))}
                <div className="col-6">
                  <label className="nx-label">Duration</label>
                  <select className="nx-input" value={form.duration}
                    onChange={e => setForm(p => ({ ...p, duration: e.target.value }))}>
                    {['1 Year','2 Years','3 Years','4 Years'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="col-6">
                  <label className="nx-label">Department</label>
                  <select className="nx-input" value={form.dept}
                    onChange={e => setForm(p => ({ ...p, dept: e.target.value }))}>
                    {DEPTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="d-flex gap-3 justify-content-end mt-4">
                <button className="btn btn-outline-secondary px-4" onClick={() => { setShowAdd(false); setEditId(null); }}>Cancel</button>
                <button className="btn btn-gradient px-4" onClick={addCourse}>
                  <i className="fas fa-save me-2"></i>{editId ? 'Save Changes' : 'Add Course'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
