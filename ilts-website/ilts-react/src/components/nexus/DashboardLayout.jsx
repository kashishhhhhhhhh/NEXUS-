import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { NOTIFICATIONS } from '../../data/nexusData';

// ── Nav config per role ─────────────────────────────────────
// Results (/marks) visible to ALL roles
const NAV = {
  admin: [
    { path: '/dashboard',  icon: 'fas fa-tachometer-alt',       label: 'Dashboard' },
    { path: '/students',   icon: 'fas fa-user-graduate',         label: 'Students' },
    { path: '/faculty',    icon: 'fas fa-chalkboard-teacher',    label: 'Faculty' },
    { path: '/courses',    icon: 'fas fa-book-open',             label: 'Courses' },
    { path: '/attendance', icon: 'fas fa-calendar-check',        label: 'Attendance' },
    { path: '/marks',      icon: 'fas fa-star',                  label: 'Results' },
    { path: '/fees',       icon: 'fas fa-rupee-sign',            label: 'Fees' },
    { path: '/analytics',  icon: 'fas fa-chart-bar',             label: 'Analytics' },
    { path: '/ml',         icon: 'fas fa-brain',                 label: 'ML Insights' },
  ],
  faculty: [
    { path: '/dashboard',  icon: 'fas fa-tachometer-alt',       label: 'Dashboard' },
    { path: '/students',   icon: 'fas fa-user-graduate',         label: 'Students' },
    { path: '/attendance', icon: 'fas fa-calendar-check',        label: 'Attendance' },
    { path: '/marks',      icon: 'fas fa-star',                  label: 'Results' },
    { path: '/analytics',  icon: 'fas fa-chart-bar',             label: 'Analytics' },
    { path: '/ml',         icon: 'fas fa-brain',                 label: 'ML Insights' },
  ],
  student: [
    { path: '/dashboard',    icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { path: '/online-exam',  icon: 'fas fa-laptop-code',    label: 'Online Exam' },
    { path: '/profile',      icon: 'fas fa-user',           label: 'My Profile' },
    { path: '/attendance',   icon: 'fas fa-calendar-check', label: 'Attendance' },
    { path: '/marks',        icon: 'fas fa-star',           label: 'My Results' },
    { path: '/fees',         icon: 'fas fa-rupee-sign',     label: 'Fee Details' },
  ],
};

const ROLE_COLORS = { admin: '#6366f1', faculty: '#0ea5e9', student: '#22c55e' };
const ROLE_ICONS  = {
  admin:   'fas fa-shield-alt',
  faculty: 'fas fa-chalkboard-teacher',
  student: 'fas fa-user-graduate',
};

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { theme, toggle: toggleTheme, isDark } = useTheme();
  const location  = useLocation();
  const navigate  = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  const navItems  = NAV[user?.role] || [];
  const roleColor = ROLE_COLORS[user?.role] || '#6366f1';
  const isActive  = path => location.pathname === path;

  const handleLogout = () => { logout(); navigate('/login'); };

  const tooltipStyle = {
    background: isDark ? '#0f0f2e' : '#1e293b',
    border: '1px solid rgba(99,102,241,0.3)',
    borderRadius: 10,
    color: '#e2e8f0',
  };

  return (
    <div className="nx-layout">

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className={`nx-sidebar ${sidebarOpen ? 'nx-sidebar-open' : 'nx-sidebar-collapsed'} ${mobileOpen ? 'nx-sidebar-mobile-open' : ''}`}>

        {/* Brand */}
        <div className="nx-sidebar-brand">
          <div className="nx-sidebar-logo" style={{ background: roleColor + '22', color: roleColor }}>
            <i className="fas fa-atom"></i>
          </div>
          {sidebarOpen && (
            <div className="nx-sidebar-brand-text">
              <span className="fw-black" style={{ fontSize: 18 }}>NEXUS</span>
              <span style={{ fontSize: 10, letterSpacing: 1, color: 'var(--nx-text-dim)' }}>INSTITUTE MGMT</span>
            </div>
          )}
          <button
            className="nx-sidebar-toggle d-none d-lg-flex"
            onClick={() => setSidebarOpen(v => !v)}
            aria-label="Toggle sidebar"
          >
            <i className={`fas fa-chevron-${sidebarOpen ? 'left' : 'right'}`}></i>
          </button>
        </div>

        {/* Role badge */}
        {sidebarOpen && (
          <div className="nx-role-badge" style={{ borderColor: roleColor + '44', background: roleColor + '11' }}>
            <i className={ROLE_ICONS[user?.role]} style={{ color: roleColor, fontSize: 12 }}></i>
            <span style={{ color: roleColor, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {user?.role}
            </span>
          </div>
        )}

        {/* Nav links */}
        <nav className="nx-sidebar-nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nx-nav-item ${isActive(item.path) ? 'nx-nav-active' : ''}`}
              onClick={() => setMobileOpen(false)}
              title={!sidebarOpen ? item.label : ''}
            >
              <i className={item.icon}></i>
              {sidebarOpen && <span>{item.label}</span>}
              {isActive(item.path) && (
                <div className="nx-nav-indicator" style={{ background: roleColor }}></div>
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="nx-sidebar-bottom">
          {sidebarOpen && (
            <div className="nx-sidebar-user">
              <div className="nx-avatar" style={{ background: roleColor, flexShrink: 0 }}>{user?.avatar}</div>
              <div className="flex-grow-1 overflow-hidden">
                <div className="fw-semibold text-truncate" style={{ fontSize: 13, color: 'var(--nx-text)' }}>{user?.name}</div>
                <div className="text-truncate" style={{ fontSize: 11, color: 'var(--nx-text-dim)' }}>{user?.email}</div>
              </div>
            </div>
          )}
          <button className="nx-logout-btn" onClick={handleLogout} title="Logout">
            <i className="fas fa-sign-out-alt"></i>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="nx-mobile-overlay" onClick={() => setMobileOpen(false)}></div>
      )}

      {/* ── Main area ───────────────────────────────────────── */}
      <main className={`nx-main ${sidebarOpen ? 'nx-main-wide' : 'nx-main-full'}`}>

        {/* Topbar */}
        <header className="nx-topbar">
          <div className="d-flex align-items-center gap-3">
            <button
              className="nx-topbar-btn d-lg-none"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Open menu"
            >
              <i className="fas fa-bars"></i>
            </button>
            <div>
              <h5 className="fw-bold mb-0" style={{ fontSize: 16, color: 'var(--nx-text)' }}>
                {navItems.find(n => isActive(n.path))?.label || 'NEXUS'}
              </h5>
              <span style={{ fontSize: 12, color: 'var(--nx-text-muted)' }}>
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">

            {/* 🌙 / ☀️  Theme toggle */}
            <button
              className="nx-theme-toggle"
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
              aria-label="Toggle theme"
            >
              <i className={`fas fa-${isDark ? 'sun' : 'moon'}`}></i>
            </button>

            {/* Notifications */}
            <div className="nx-notif-wrap">
              <button
                className="nx-topbar-btn nx-notif-btn"
                onClick={() => setNotifOpen(v => !v)}
                aria-label="Notifications"
              >
                <i className="fas fa-bell"></i>
                <span className="nx-notif-dot"></span>
              </button>
              {notifOpen && (
                <div className="nx-notif-dropdown">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-semibold" style={{ fontSize: 14, color: 'var(--nx-text)' }}>Notifications</span>
                    <button className="btn btn-link p-0" style={{ fontSize: 11, color: '#6366f1' }}
                      onClick={() => setNotifOpen(false)}>Mark all read</button>
                  </div>
                  {NOTIFICATIONS.map(n => (
                    <div key={n.id} className="nx-notif-item">
                      <div className={`nx-notif-icon nx-notif-${n.type}`}>
                        <i className={
                          n.type === 'alert'   ? 'fas fa-exclamation-triangle' :
                          n.type === 'success' ? 'fas fa-check-circle' :
                          n.type === 'warning' ? 'fas fa-exclamation-circle' :
                          'fas fa-info-circle'
                        }></i>
                      </div>
                      <div className="flex-grow-1">
                        <p className="mb-0" style={{ fontSize: 12, color: 'var(--nx-text)' }}>{n.message}</p>
                        <span style={{ fontSize: 10, color: 'var(--nx-text-muted)' }}>{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User chip */}
            <div className="nx-topbar-user">
              <div className="nx-avatar nx-avatar-sm" style={{ background: roleColor }}>{user?.avatar}</div>
              <div className="d-none d-md-block">
                <div className="fw-semibold" style={{ fontSize: 13, color: 'var(--nx-text)' }}>{user?.name}</div>
                <div style={{ fontSize: 10, color: roleColor, textTransform: 'uppercase', fontWeight: 600 }}>{user?.role}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="nx-content">{children}</div>
      </main>
    </div>
  );
}
