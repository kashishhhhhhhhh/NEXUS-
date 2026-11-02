import { Link } from 'react-router-dom';

const steps = [
  { num: '01', icon: 'fas fa-user-edit', title: 'Register', desc: 'Fill out the registration form with your academic details and pay the exam fee online.', link: '/register', label: 'Register Now' },
  { num: '02', icon: 'fas fa-laptop-code', title: 'Take Exam', desc: 'Appear for the online MCQ-based exam. Pass the cutoff to qualify for the next round.', link: '/exam', label: 'Go to Exam' },
  { num: '03', icon: 'fas fa-video', title: 'Interview', desc: 'Qualified candidates attend an online interview with our expert panel.', link: '/interview', label: 'Interview Info' },
];

export default function Process() {
  return (
    <section className="py-5" id="process" style={{ background: '#0a0a1a' }}>
      <div className="container py-4 text-center">
        <span className="section-tag">How It Works</span>
        <h2 className="display-5 fw-bold text-white mt-2 mb-5">
          Simple <span className="text-gradient">3-Step</span> Process
        </h2>
        <div className="row g-4">
          {steps.map((s, i) => (
            <div className="col-md-4" key={i}>
              <div className="process-card">
                <div className="process-number">{s.num}</div>
                <div className="process-icon"><i className={s.icon}></i></div>
                <h4 className="text-white mt-3">{s.title}</h4>
                <p className="text-muted">{s.desc}</p>
                <Link to={s.link} className="btn btn-sm btn-gradient mt-2">{s.label}</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
