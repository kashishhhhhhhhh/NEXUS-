import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className={`main-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container d-flex align-items-center justify-content-between py-2">
        <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
          <i className="fas fa-graduation-cap" style={{ color: '#6366f1', fontSize: '1.4rem' }}></i>
          <span className="navbar-brand-text">Online Exam</span>
        </Link>

        {/* Desktop Nav */}
        <div className="d-none d-lg-flex align-items-center gap-4">
          {isHome ? (
            <>
              {['home','about','process','courses','contact'].map(id => (
                <button key={id} className="nav-link-custom btn btn-link p-0 text-capitalize"
                  onClick={() => scrollTo(id)}>{id}</button>
              ))}
            </>
          ) : (
            <Link to="/" className="nav-link-custom">Home</Link>
          )}
          <Link to="/login" className="btn btn-outline-secondary px-3 py-2" style={{ fontSize: 13, borderColor: 'rgba(99,102,241,0.4)', color: '#a5b4fc' }}>
            <i className="fas fa-atom me-2"></i>NEXUS
          </Link>
          <Link to="/register" className="btn btn-gradient px-4 py-2">Apply Now</Link>
        </div>

        {/* Mobile toggle */}
        <button className="btn btn-link d-lg-none text-white" onClick={() => setMenuOpen(!menuOpen)}>
          <i className={`fas fa-${menuOpen ? 'times' : 'bars'} fa-lg`}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="container pb-3 d-lg-none" style={{ borderTop: '1px solid rgba(99,102,241,0.2)' }}>
          <div className="d-flex flex-column gap-2 pt-3">
            {isHome && ['home','about','process','courses','contact'].map(id => (
              <button key={id} className="nav-link-custom btn btn-link p-0 text-start text-capitalize"
                onClick={() => scrollTo(id)}>{id}</button>
            ))}
            <Link to="/" className="nav-link-custom" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/register" className="btn btn-gradient px-4 py-2 mt-1" onClick={() => setMenuOpen(false)}>Apply Now</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
