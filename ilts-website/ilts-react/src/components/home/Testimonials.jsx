import { useState } from 'react';
import { testimonials } from '../../data/examData';

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const t = testimonials[active];

  return (
    <section className="py-5" style={{ background: '#0a0a1a' }}>
      <div className="container py-4 text-center">
        <span className="section-tag">Testimonials</span>
        <h2 className="display-5 fw-bold text-white mt-2 mb-5">
          What <span className="text-gradient">Students Say</span>
        </h2>
        <div className="testimonial-card mx-auto fade-in" key={active}>
          <div className="text-warning mb-3" style={{ fontSize: '1.3rem' }}>{'★'.repeat(t.rating)}</div>
          <p className="text-muted fs-5 mb-4">"{t.text}"</p>
          <div className="d-flex align-items-center gap-3 justify-content-center">
            <div className="testimonial-avatar">{t.name[0]}</div>
            <div className="text-start">
              <h6 className="text-white mb-0">{t.name}</h6>
              <small className="text-muted">{t.college}</small>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center gap-2 mt-4">
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setActive(i)}
              style={{
                width: 10, height: 10, borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: i === active ? '#6366f1' : 'rgba(255,255,255,0.2)'
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
