import { Link } from 'react-router-dom';
import { courses } from '../../data/examData';

export default function Courses() {
  return (
    <section className="py-5 bg-dark-custom" id="courses">
      <div className="container py-4">
        <div className="text-center mb-5">
          <span className="section-tag">Programs</span>
          <h2 className="display-5 fw-bold text-white mt-2">
            MCA <span className="text-gradient">Specializations</span>
          </h2>
        </div>
        <div className="row g-4">
          {courses.map((c, i) => (
            <div className="col-md-4 col-sm-6" key={i}>
              <div className="course-card fade-in">
                <div className="course-icon" style={{ background: c.color + '22' }}>
                  <i className={c.icon} style={{ color: c.color }}></i>
                </div>
                <h5 className="text-white mb-2">{c.title}</h5>
                <p className="text-muted small mb-3">{c.desc}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted small">
                    <i className="fas fa-users me-1"></i>{c.seats} Seats
                  </span>
                  <Link to="/register" className="btn btn-sm btn-gradient px-3">Apply</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
