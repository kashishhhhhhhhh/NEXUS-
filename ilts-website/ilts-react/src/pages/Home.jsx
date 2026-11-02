import Navbar from '../components/Navbar';
import Hero from '../components/home/Hero';
import About from '../components/home/About';
import Process from '../components/home/Process';
import Courses from '../components/home/Courses';
import Testimonials from '../components/home/Testimonials';
import Contact from '../components/home/Contact';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Process />
      <Courses />
      <Testimonials />
      <Contact />
      <footer className="py-4 text-center" style={{ background: '#050510', borderTop: '1px solid #1a1a3e' }}>
        <p className="text-muted mb-0">&copy; 2026 Online Exam — MCA Entrance Examination Portal. All rights reserved.</p>
      </footer>
    </>
  );
}
