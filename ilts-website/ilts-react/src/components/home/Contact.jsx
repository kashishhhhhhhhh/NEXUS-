const contacts = [
  { icon: 'fas fa-map-marker-alt', title: 'Address', lines: ['Online Exam Campus, Tech Park,', 'Sector 62, Noida, UP - 201309'] },
  { icon: 'fas fa-phone', title: 'Phone', lines: ['+91 98765 43210', '+91 11 2345 6789'] },
  { icon: 'fas fa-envelope', title: 'Email', lines: ['admissions@onlineexam.edu.in', 'support@onlineexam.edu.in'] },
];

export default function Contact() {
  return (
    <section className="py-5 bg-dark-custom" id="contact">
      <div className="container py-4">
        <div className="text-center mb-5">
          <span className="section-tag">Contact Us</span>
          <h2 className="display-5 fw-bold text-white mt-2">
            Get In <span className="text-gradient">Touch</span>
          </h2>
        </div>
        <div className="row g-4 justify-content-center">
          {contacts.map((c, i) => (
            <div className="col-lg-4 col-md-6" key={i}>
              <div className="contact-card text-center">
                <i className={`${c.icon} fa-2x text-gradient mb-3`}></i>
                <h5 className="text-white">{c.title}</h5>
                {c.lines.map((l, j) => <p key={j} className="text-muted mb-0">{l}</p>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
