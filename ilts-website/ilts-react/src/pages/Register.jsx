import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const STEPS = ['Personal Info', 'Academic Info', 'Documents', 'Confirm'];

const INIT = {
  firstName: '', lastName: '', dob: '', gender: '', email: '', mobile: '',
  address: '', state: '', category: '', degree: '', gradYear: '', gradPercent: '',
  university: '', twelfthPercent: '', tenthPercent: '', specialization: '',
};

export default function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INIT);
  const [errors, setErrors] = useState({});
  const [uploads, setUploads] = useState({ photo: '', sign: '', grad: '', id: '' });
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [regId, setRegId] = useState('');
  const navigate = useNavigate();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = (s) => {
    const required = {
      1: ['firstName','lastName','dob','gender','email','mobile','address','state','category'],
      2: ['degree','gradYear','gradPercent','university','twelfthPercent','tenthPercent','specialization'],
    };
    const errs = {};
    (required[s] || []).forEach(k => { if (!form[k]) errs[k] = true; });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => { if (validate(step)) setStep(s => s + 1); };
  const prev = () => setStep(s => s - 1);

  const handleUpload = (key, e) => {
    if (e.target.files[0]) setUploads(u => ({ ...u, [key]: e.target.files[0].name }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) { alert('Please agree to Terms & Conditions.'); return; }
    const id = 'OE-2026-' + Math.floor(10000 + Math.random() * 90000);
    localStorage.setItem('ilts_reg_id', id);
    localStorage.setItem('ilts_name', form.firstName + ' ' + form.lastName);
    setRegId(id);
    setSubmitted(true);
  };

  const inp = (key, placeholder, type = 'text') => (
    <input type={type} className={`custom-input ${errors[key] ? 'is-invalid' : ''}`}
      value={form[key]} onChange={set(key)} placeholder={placeholder} />
  );

  const sel = (key, options, placeholder) => (
    <select className={`custom-input ${errors[key] ? 'is-invalid' : ''}`} value={form[key]} onChange={set(key)}>
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  );

  const UploadBox = ({ label, fileKey, icon }) => (
    <div>
      <label className="form-label text-muted">{label} *</label>
      <label className={`upload-box d-block ${uploads[fileKey] ? 'uploaded' : ''}`}>
        <i className={`${icon} fa-2x text-muted mb-2`}></i>
        <p className="text-muted small mb-1">{uploads[fileKey] ? '✓ ' + uploads[fileKey] : 'Click to upload'}</p>
        <input type="file" className="d-none" onChange={e => handleUpload(fileKey, e)} />
      </label>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="page-header text-center text-white">
        <div className="container">
          <h1 className="display-5 fw-bold"><i className="fas fa-user-plus me-3"></i>Student Registration</h1>
          <p className="lead text-muted">MCA Entrance Examination 2026 — Fill all details carefully</p>
          <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
            {STEPS.map((s, i) => (
              <div key={i} className={`reg-step ${step === i+1 ? 'active' : step > i+1 ? 'completed' : ''}`}>
                <span className="step-num">{step > i+1 ? <i className="fas fa-check" style={{fontSize:10}}></i> : i+1}</span>
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="form-card">
              <form onSubmit={handleSubmit}>

                {/* Step 1 */}
                {step === 1 && (
                  <>
                    <h4 className="text-white mb-4"><i className="fas fa-user me-2 text-gradient"></i>Personal Information</h4>
                    <div className="row g-3">
                      <div className="col-md-6"><label className="form-label text-muted">First Name *</label>{inp('firstName','Enter first name')}</div>
                      <div className="col-md-6"><label className="form-label text-muted">Last Name *</label>{inp('lastName','Enter last name')}</div>
                      <div className="col-md-6"><label className="form-label text-muted">Date of Birth *</label>{inp('dob','','date')}</div>
                      <div className="col-md-6"><label className="form-label text-muted">Gender *</label>{sel('gender',['Male','Female','Other'],'Select Gender')}</div>
                      <div className="col-md-6"><label className="form-label text-muted">Email *</label>{inp('email','your@email.com','email')}</div>
                      <div className="col-md-6"><label className="form-label text-muted">Mobile *</label>{inp('mobile','+91 XXXXX XXXXX','tel')}</div>
                      <div className="col-12"><label className="form-label text-muted">Address *</label><textarea className={`custom-input ${errors.address?'is-invalid':''}`} rows="2" placeholder="Full address" value={form.address} onChange={set('address')}></textarea></div>
                      <div className="col-md-6"><label className="form-label text-muted">State *</label>{sel('state',['Uttar Pradesh','Delhi','Maharashtra','Karnataka','Tamil Nadu','Gujarat','Rajasthan','West Bengal','Other'],'Select State')}</div>
                      <div className="col-md-6"><label className="form-label text-muted">Category *</label>{sel('category',['General','OBC','SC','ST','EWS'],'Select Category')}</div>
                    </div>
                    <div className="d-flex justify-content-end mt-4">
                      <button type="button" className="btn btn-gradient px-5" onClick={next}>Next <i className="fas fa-arrow-right ms-2"></i></button>
                    </div>
                  </>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <>
                    <h4 className="text-white mb-4"><i className="fas fa-book me-2 text-gradient"></i>Academic Information</h4>
                    <div className="row g-3">
                      <div className="col-md-6"><label className="form-label text-muted">Graduation Degree *</label>{sel('degree',['B.Sc (Computer Science)','B.Sc (IT)','BCA','B.Tech (CS/IT)','B.Com with IT','Other'],'Select Degree')}</div>
                      <div className="col-md-6"><label className="form-label text-muted">Graduation Year *</label>{inp('gradYear','e.g. 2024','number')}</div>
                      <div className="col-md-6"><label className="form-label text-muted">Percentage / CGPA *</label>{inp('gradPercent','e.g. 75% or 8.5 CGPA')}</div>
                      <div className="col-md-6"><label className="form-label text-muted">University / College *</label>{inp('university','University name')}</div>
                      <div className="col-md-6"><label className="form-label text-muted">12th Percentage *</label>{inp('twelfthPercent','e.g. 80%')}</div>
                      <div className="col-md-6"><label className="form-label text-muted">10th Percentage *</label>{inp('tenthPercent','e.g. 85%')}</div>
                      <div className="col-12"><label className="form-label text-muted">Preferred Specialization *</label>{sel('specialization',['Artificial Intelligence & ML','Cloud Computing','Cybersecurity','Data Science & Analytics','Full Stack Development','Mobile App Development'],'Select Specialization')}</div>
                    </div>
                    <div className="d-flex justify-content-between mt-4">
                      <button type="button" className="btn btn-outline-secondary px-4" onClick={prev}><i className="fas fa-arrow-left me-2"></i>Back</button>
                      <button type="button" className="btn btn-gradient px-5" onClick={next}>Next <i className="fas fa-arrow-right ms-2"></i></button>
                    </div>
                  </>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <>
                    <h4 className="text-white mb-4"><i className="fas fa-file-upload me-2 text-gradient"></i>Upload Documents</h4>
                    <div className="row g-3">
                      <div className="col-md-6"><UploadBox label="Passport Photo" fileKey="photo" icon="fas fa-camera" /></div>
                      <div className="col-md-6"><UploadBox label="Signature" fileKey="sign" icon="fas fa-signature" /></div>
                      <div className="col-md-6"><UploadBox label="Graduation Certificate" fileKey="grad" icon="fas fa-file-pdf" /></div>
                      <div className="col-md-6"><UploadBox label="ID Proof (Aadhar/PAN)" fileKey="id" icon="fas fa-id-card" /></div>
                    </div>
                    <div className="d-flex justify-content-between mt-4">
                      <button type="button" className="btn btn-outline-secondary px-4" onClick={prev}><i className="fas fa-arrow-left me-2"></i>Back</button>
                      <button type="button" className="btn btn-gradient px-5" onClick={next}>Next <i className="fas fa-arrow-right ms-2"></i></button>
                    </div>
                  </>
                )}

                {/* Step 4 */}
                {step === 4 && (
                  <>
                    <h4 className="text-white mb-4"><i className="fas fa-check-circle me-2 text-gradient"></i>Review &amp; Submit</h4>
                    <div className="review-box mb-4">
                      {[['Full Name', form.firstName + ' ' + form.lastName], ['Email', form.email], ['Mobile', form.mobile],
                        ['Date of Birth', form.dob], ['Gender', form.gender], ['State', form.state], ['Category', form.category],
                        ['Degree', form.degree], ['Graduation Year', form.gradYear], ['Percentage/CGPA', form.gradPercent],
                        ['University', form.university], ['Specialization', form.specialization]
                      ].map(([k, v]) => (
                        <div className="review-row" key={k}>
                          <span className="review-label">{k}</span>
                          <span className="review-value">{v || '—'}</span>
                        </div>
                      ))}
                    </div>
                    <div className="form-check mb-3">
                      <input className="form-check-input" type="checkbox" id="agreeTerms"
                        checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                      <label className="form-check-label text-muted" htmlFor="agreeTerms">
                        I confirm all information is accurate and agree to the <a href="#" className="text-gradient">Terms &amp; Conditions</a>.
                      </label>
                    </div>
                    <div className="d-flex justify-content-between mt-2">
                      <button type="button" className="btn btn-outline-secondary px-4" onClick={prev}><i className="fas fa-arrow-left me-2"></i>Back</button>
                      <button type="submit" className="btn btn-gradient px-5"><i className="fas fa-paper-plane me-2"></i>Submit Application</button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {submitted && (
        <div className="modal-overlay">
          <div className="modal-box text-center">
            <i className="fas fa-check-circle fa-5x text-success mb-4"></i>
            <h3 className="text-white fw-bold">Registration Successful!</h3>
            <p className="text-muted mt-2">Your application has been submitted. Your Exam Hall Ticket will be sent to your registered email.</p>
            <div className="reg-id-box mt-3 mb-4">
              <span className="text-muted small">Your Registration ID</span>
              <h4 className="text-gradient fw-bold">{regId}</h4>
            </div>
            <button className="btn btn-gradient px-5" onClick={() => navigate('/exam')}>
              <i className="fas fa-laptop-code me-2"></i>Proceed to Exam
            </button>
          </div>
        </div>
      )}
    </>
  );
}
