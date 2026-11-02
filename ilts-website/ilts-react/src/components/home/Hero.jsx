import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function useCounter(ref, target, suffix) {
  useEffect(() => {
    let count = 0;
    const step = Math.ceil(target / 60);
    const interval = setInterval(() => {
      count += step;
      if (count >= target) { count = target; clearInterval(interval); }
      if (ref.current) ref.current.textContent = count + suffix;
    }, 30);
    return () => clearInterval(interval);
  }, []);
}

export default function Hero() {
  const c1 = useRef(null), c2 = useRef(null), c3 = useRef(null);
  useCounter(c1, 5240, '+');
  useCounter(c2, 128, '+');
  useCounter(c3, 94, '%');

  return (
    <section className="hero-section" id="home">
      <div className="hero-overlay"></div>
      <div className="container position-relative text-white text-center w-100">
        <div className="hero-badge mb-3">MCA Entrance Examination 2026</div>
        <h1 className="display-3 fw-bold mb-3">
          Welcome to <span className="text-gradient">Online Exam</span>
        </h1>
        <p className="lead mb-4 fs-5">
          Online Exam Platform<br />
          Your gateway to a successful MCA career starts here.
        </p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Link to="/register" className="btn btn-gradient btn-lg px-5 py-3">
            <i className="fas fa-user-plus me-2"></i>Register for Exam
          </Link>
          <a href="#process" className="btn btn-outline-light btn-lg px-5 py-3"
            onClick={e => { e.preventDefault(); document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' }); }}>
            <i className="fas fa-info-circle me-2"></i>How It Works
          </a>
        </div>
        <div className="mt-5 d-flex justify-content-center gap-5 flex-wrap">
          <div className="text-center">
            <h3 className="fw-bold text-gradient-yellow" ref={c1}>0+</h3>
            <p className="mb-0 small text-muted">Students Enrolled</p>
          </div>
          <div className="text-center">
            <h3 className="fw-bold text-gradient-yellow" ref={c2}>0+</h3>
            <p className="mb-0 small text-muted">Exams Conducted</p>
          </div>
          <div className="text-center">
            <h3 className="fw-bold text-gradient-yellow" ref={c3}>0%</h3>
            <p className="mb-0 small text-muted">Success Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
}
