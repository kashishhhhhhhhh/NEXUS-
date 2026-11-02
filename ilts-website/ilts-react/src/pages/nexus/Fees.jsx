import { useState, useMemo } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import DashboardLayout from '../../components/nexus/DashboardLayout';
import { FEES } from '../../data/nexusData';
import { useAuth } from '../../context/useAuth';

const STATUS_COLORS = { paid: '#22c55e', pending: '#f59e0b', overdue: '#ef4444' };

export default function Fees() {
  const { user } = useAuth();
  const [fees, setFees] = useState(FEES);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [payModal, setPayModal] = useState(null); // { fee record }
  const [payAmount, setPayAmount] = useState('');

  const isStudent = user?.role === 'student';
  const myFee = fees.find(f => f.student === 'NX001');

  const filtered = useMemo(() => {
    return fees.filter(f => {
      const matchFilter = filter === 'All' || f.status === filter;
      const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
                          f.student.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [fees, filter, search]);

  const totalCollected = fees.reduce((s, f) => s + f.paid, 0);
  const totalPending   = fees.reduce((s, f) => s + f.due, 0);
  const totalAmount    = fees.reduce((s, f) => s + f.amount, 0);

  const pieData = [
    { name: 'Collected', value: totalCollected },
    { name: 'Pending',   value: totalPending },
  ];

  const markPaid = (student, amt) => {
    const n = +amt;
    if (!n || n <= 0) { alert('Enter valid amount.'); return; }
    setFees(prev => prev.map(f => {
      if (f.student !== student) return f;
      const newPaid = Math.min(f.amount, f.paid + n);
      const newDue  = f.amount - newPaid;
      return { ...f, paid: newPaid, due: newDue, status: newDue === 0 ? 'paid' : 'pending', lastPaid: new Date().toISOString().split('T')[0] };
    }));
    setPayModal(null);
    setPayAmount('');
  };

  const exportCSV = () => {
    const rows = [
      ['Student ID', 'Name', 'Course', 'Amount', 'Paid', 'Due', 'Status', 'Last Paid'],
      ...fees.map(f => [f.student, f.name, f.course, f.amount, f.paid, f.due, f.status, f.lastPaid]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'nexus_fees.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="fade-in">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h4 className="text-white fw-bold mb-1">{isStudent ? 'Fee Details' : 'Fee Management'}</h4>
            <p className="text-muted mb-0">{isStudent ? 'Your fee payment status' : `${fees.filter(f=>f.status!=='paid').length} outstanding records`}</p>
          </div>
          {!isStudent && (
            <button className="btn btn-outline-secondary px-4" onClick={exportCSV}>
              <i className="fas fa-file-csv me-2"></i>Export CSV
            </button>
          )}
        </div>

        {/* Student: own fee */}
        {isStudent && myFee && (
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="nx-card">
                <h6 className="nx-card-title mb-4"><i className="fas fa-rupee-sign me-2"></i>Your Fee Summary</h6>
                {[
                  ['Course', myFee.course],
                  ['Total Fee', `₹${myFee.amount.toLocaleString('en-IN')}`],
                  ['Amount Paid', `₹${myFee.paid.toLocaleString('en-IN')}`],
                  ['Amount Due', `₹${myFee.due.toLocaleString('en-IN')}`],
                  ['Last Payment', myFee.lastPaid],
                ].map(([k,v]) => (
                  <div key={k} className="nx-list-row">
                    <span className="text-muted" style={{ fontSize: 13 }}>{k}</span>
                    <span className="text-white fw-semibold" style={{ fontSize: 13 }}>{v}</span>
                  </div>
                ))}
                <div className="mt-3">
                  <span className={`nx-badge nx-badge-${myFee.status === 'paid' ? 'success' : myFee.status === 'overdue' ? 'danger' : 'warning'}`} style={{ fontSize: 14, padding: '6px 16px' }}>
                    {myFee.status === 'paid' ? '✓ Fully Paid' : myFee.status === 'overdue' ? '⚠ Overdue' : '⚡ Partially Paid'}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="nx-card">
                <h6 className="nx-card-title mb-3"><i className="fas fa-chart-pie me-2"></i>Payment Progress</h6>
                <div className="text-center mt-2">
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="80" cy="80" r="60" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="16" />
                      <circle cx="80" cy="80" r="60" fill="none" stroke="#22c55e" strokeWidth="16"
                        strokeDasharray={`${(myFee.paid / myFee.amount) * 376} 376`} strokeLinecap="round" />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="text-white fw-bold" style={{ fontSize: 22 }}>{Math.round((myFee.paid/myFee.amount)*100)}%</span>
                      <span className="text-muted" style={{ fontSize: 11 }}>Paid</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin/Faculty view */}
        {!isStudent && (
          <>
            {/* KPI row */}
            <div className="row g-4 mb-4">
              <div className="col-lg-8">
                <div className="row g-3">
                  {[
                    ['Total Fee', `₹${(totalAmount/100000).toFixed(1)}L`, '#6366f1', 'fas fa-rupee-sign'],
                    ['Collected',  `₹${(totalCollected/100000).toFixed(1)}L`, '#22c55e', 'fas fa-check-circle'],
                    ['Pending',    `₹${(totalPending/100000).toFixed(1)}L`,   '#f59e0b', 'fas fa-clock'],
                    ['Overdue Students', fees.filter(f=>f.status==='overdue').length, '#ef4444', 'fas fa-exclamation-triangle'],
                  ].map(([label, val, color, ic]) => (
                    <div className="col-6" key={label}>
                      <div className="nx-kpi-card">
                        <div className="nx-kpi-icon" style={{ background: color+'22', color }}>
                          <i className={ic}></i>
                        </div>
                        <div>
                          <p className="text-muted mb-1" style={{ fontSize: 13 }}>{label}</p>
                          <h3 className="text-white fw-bold mb-0" style={{ fontSize: 22 }}>{val}</h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-lg-4">
                <div className="nx-card h-100">
                  <h6 className="nx-card-title mb-2">Collection vs Pending</h6>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65}
                        dataKey="value" nameKey="name" paddingAngle={3}>
                        <Cell fill="#22c55e" />
                        <Cell fill="#f59e0b" />
                      </Pie>
                      <Tooltip contentStyle={{ background: '#0f0f2e', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, color: '#e2e8f0' }}
                        formatter={v => [`₹${(v/100000).toFixed(2)}L`]} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Filter + Table */}
            <div className="nx-card p-0">
              <div className="nx-card-header px-4 pt-4 flex-wrap gap-3">
                <h6 className="nx-card-title"><i className="fas fa-list me-2"></i>Fee Records</h6>
                <div className="d-flex gap-2 flex-wrap">
                  <div className="nx-input-wrap" style={{ maxWidth: 220 }}>
                    <i className="fas fa-search nx-input-icon"></i>
                    <input className="nx-input" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                  {['All','paid','pending','overdue'].map(s => (
                    <button key={s}
                      className={`nx-filter-chip ${filter === s ? 'active' : ''}`}
                      onClick={() => setFilter(s)}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="nx-table">
                  <thead>
                    <tr>
                      <th>Student</th><th>Course</th><th>Total Fee</th><th>Paid</th><th>Due</th><th>Status</th><th>Last Payment</th><th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(f => (
                      <tr key={f.student}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="nx-avatar-xs">{f.name.split(' ').map(w=>w[0]).join('')}</div>
                            <div>
                              <div className="text-white fw-semibold" style={{ fontSize: 13 }}>{f.name}</div>
                              <div className="text-muted" style={{ fontSize: 11 }}>{f.student}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="nx-badge nx-badge-info">{f.course}</span></td>
                        <td className="text-white">₹{f.amount.toLocaleString('en-IN')}</td>
                        <td style={{ color: '#86efac' }}>₹{f.paid.toLocaleString('en-IN')}</td>
                        <td style={{ color: f.due > 0 ? '#fca5a5' : '#86efac' }}>₹{f.due.toLocaleString('en-IN')}</td>
                        <td>
                          <span className={`nx-badge nx-badge-${f.status === 'paid' ? 'success' : f.status === 'overdue' ? 'danger' : 'warning'}`}>
                            {f.status}
                          </span>
                        </td>
                        <td className="text-muted" style={{ fontSize: 12 }}>{f.lastPaid}</td>
                        <td>
                          {f.status !== 'paid' && (
                            <button className="nx-icon-btn" onClick={() => { setPayModal(f); setPayAmount(''); }} title="Record payment">
                              <i className="fas fa-plus"></i>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Payment Modal */}
        {payModal && (
          <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setPayModal(null); }}>
            <div className="nx-modal">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="text-white fw-bold mb-0">Record Payment</h5>
                <button className="nx-close-btn" onClick={() => setPayModal(null)}><i className="fas fa-times"></i></button>
              </div>
              <p className="text-muted mb-1">Student: <strong className="text-white">{payModal.name}</strong></p>
              <p className="text-muted mb-3">Outstanding: <strong className="text-warning">₹{payModal.due.toLocaleString('en-IN')}</strong></p>
              <label className="nx-label">Amount Received (₹)</label>
              <input className="nx-input" type="number" placeholder="Enter amount"
                value={payAmount} onChange={e => setPayAmount(e.target.value)} />
              <div className="d-flex gap-3 justify-content-end mt-4">
                <button className="btn btn-outline-secondary px-4" onClick={() => setPayModal(null)}>Cancel</button>
                <button className="btn btn-gradient px-4" onClick={() => markPaid(payModal.student, payAmount)}>
                  <i className="fas fa-check me-2"></i>Confirm Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
