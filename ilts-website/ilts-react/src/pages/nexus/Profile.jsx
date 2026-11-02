import DashboardLayout from '../../components/nexus/DashboardLayout';
import { useAuth } from '../../context/useAuth';
import { STUDENTS, predictPerformance } from '../../data/nexusData';

export default function Profile() {
  const { user } = useAuth();
  const me = STUDENTS.find(s => s.id === 'NX001') || STUDENTS[0];
  const pred = predictPerformance(me);

  return (
    <DashboardLayout>
      <div className="fade-in">
        <h4 className="text-white fw-bold mb-4">My Profile</h4>

        <div className="row g-4">
          {/* Profile card */}
          <div className="col-lg-4">
            <div className="nx-card text-center">
              <div className="nx-avatar" style={{ width: 80, height: 80, fontSize: 28, margin: '0 auto 16px', background: 'linear-gradient(135deg,#6366f1,#a855f7)' }}>
                {user?.avatar}
              </div>
              <h5 className="text-white fw-bold mb-1">{user?.name}</h5>
              <p className="text-muted mb-2">{me.course} — Year {me.year}</p>
              <span className="nx-badge nx-badge-info">{me.id}</span>

              <div className="mt-4 d-flex justify-content-around">
                {[
                  ['CGPA', me.cgpa, '#6366f1'],
                  ['Attendance', me.attendance+'%', '#22c55e'],
                  ['Year', me.year, '#0ea5e9'],
                ].map(([label, val, color]) => (
                  <div key={label}>
                    <div className="fw-bold" style={{ color, fontSize: 20 }}>{val}</div>
                    <div className="text-muted" style={{ fontSize: 11 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="col-lg-8">
            <div className="nx-card">
              <h6 className="nx-card-title mb-4"><i className="fas fa-user me-2"></i>Personal Information</h6>
              <div className="row g-3">
                {[
                  ['Full Name',    user?.name],
                  ['Email',        user?.email],
                  ['Course',       me.course],
                  ['Year',         me.year],
                  ['Gender',       me.gender],
                  ['Phone',        me.phone],
                  ['City',         me.city],
                  ['Fee Status',   me.feeStatus],
                ].map(([k,v]) => (
                  <div className="col-md-6" key={k}>
                    <div className="nx-profile-field">
                      <span className="nx-profile-label">{k}</span>
                      <span className="nx-profile-value">{v}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ML prediction */}
            <div className="nx-card mt-4" style={{ border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.05)' }}>
              <h6 className="nx-card-title mb-3"><i className="fas fa-brain me-2 text-primary"></i>AI Performance Prediction</h6>
              <div className="row g-3">
                <div className="col-4 text-center">
                  <div className="fw-bold text-white" style={{ fontSize: 28 }}>{pred.predicted}</div>
                  <div className="text-muted" style={{ fontSize: 12 }}>Predicted CGPA</div>
                </div>
                <div className="col-4 text-center">
                  <div className="fw-bold" style={{ fontSize: 28, color: pred.risk==='Low'?'#22c55e':pred.risk==='Medium'?'#f59e0b':'#ef4444' }}>
                    {pred.risk}
                  </div>
                  <div className="text-muted" style={{ fontSize: 12 }}>Risk Level</div>
                </div>
                <div className="col-4 text-center">
                  <div className="fw-bold text-white" style={{ fontSize: 28 }}>{pred.confidence}%</div>
                  <div className="text-muted" style={{ fontSize: 12 }}>Confidence</div>
                </div>
              </div>
              <p className="text-muted mt-3 mb-0" style={{ fontSize: 12 }}>
                <i className="fas fa-info-circle me-1"></i>
                Prediction is based on attendance and current CGPA using a linear regression model. Values are indicative.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
