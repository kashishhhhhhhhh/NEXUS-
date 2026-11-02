import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// NEXUS pages
import Login       from './pages/nexus/Login';
import Dashboard   from './pages/nexus/Dashboard';
import Students    from './pages/nexus/Students';
import Faculty     from './pages/nexus/Faculty';
import CoursesPage from './pages/nexus/Courses';
import Attendance  from './pages/nexus/Attendance';
import Marks       from './pages/nexus/Marks';
import Fees        from './pages/nexus/Fees';
import Analytics   from './pages/nexus/Analytics';
import MLInsights  from './pages/nexus/MLInsights';
import Profile     from './pages/nexus/Profile';
import OnlineExam  from './pages/nexus/OnlineExam';

// Auth + Theme
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { ThemeProvider }         from './context/ThemeContext';
import './nexus.css';

function RequireAuth({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function RequireRole({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* ── Root → NEXUS login ── */}
            <Route path="/"      element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />

            {/* ── NEXUS protected routes ── */}
            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />

            <Route path="/students" element={
              <RequireAuth><RequireRole roles={['admin','faculty']}><Students /></RequireRole></RequireAuth>
            } />
            <Route path="/faculty" element={
              <RequireAuth><RequireRole roles={['admin']}><Faculty /></RequireRole></RequireAuth>
            } />
            <Route path="/courses" element={
              <RequireAuth><RequireRole roles={['admin']}><CoursesPage /></RequireRole></RequireAuth>
            } />
            <Route path="/attendance" element={<RequireAuth><Attendance /></RequireAuth>} />
            <Route path="/marks"      element={<RequireAuth><Marks /></RequireAuth>} />
            <Route path="/fees"       element={<RequireAuth><Fees /></RequireAuth>} />

            <Route path="/analytics" element={
              <RequireAuth><RequireRole roles={['admin','faculty']}><Analytics /></RequireRole></RequireAuth>
            } />
            <Route path="/ml" element={
              <RequireAuth><RequireRole roles={['admin','faculty']}><MLInsights /></RequireRole></RequireAuth>
            } />
            <Route path="/profile" element={
              <RequireAuth><RequireRole roles={['student']}><Profile /></RequireRole></RequireAuth>
            } />
            <Route path="/online-exam" element={
              <RequireAuth><RequireRole roles={['student']}><OnlineExam /></RequireRole></RequireAuth>
            } />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
