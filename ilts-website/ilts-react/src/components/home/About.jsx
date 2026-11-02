const features = [
  { icon: 'fas fa-shield-alt', color: 'text-primary', title: 'Secure Exam', desc: 'Anti-cheat proctored system' },
  { icon: 'fas fa-clock', color: 'text-success', title: 'Real-time Results', desc: 'Instant score evaluation' },
  { icon: 'fas fa-video', color: 'text-warning', title: 'Online Interview', desc: 'Video-based interview round' },
  { icon: 'fas fa-certificate', color: 'text-danger', title: 'Certification', desc: 'Verified digital certificate' },
];

export default function About() {
  return (
    <section className="py-5 bg-dark-custom" id="about">
      <div className="container py-4">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <div className="about-img-wrapper">
              <img
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80"
                className="img-fluid rounded-4 shadow-lg" alt="Students"
              />
              <div className="about-badge">
                <i className="fas fa-award fa-2x text-warning"></i>
                <span>Trusted by 5000+ Students</span>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <span className="section-tag">About Online Exam</span>
            <h2 className="display-5 fw-bold text-white mt-2 mb-4">
              Empowering MCA <span className="text-gradient">Aspirants</span>
            </h2>
            <p className="text-muted fs-5 mb-4">
              Online Exam is a premier platform dedicated to conducting fair, transparent, and
              technology-driven entrance examinations for MCA programs across the country.
            </p>
            <div className="row g-3">
              {features.map((f, i) => (
                <div className="col-6" key={i}>
                  <div className="feature-card">
                    <i className={`${f.icon} ${f.color} mb-2 fa-lg`}></i>
                    <h6 className="text-white">{f.title}</h6>
                    <p className="text-muted small mb-0">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
