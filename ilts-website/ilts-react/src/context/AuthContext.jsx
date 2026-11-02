import { createContext, useState } from 'react';
import { authAPI } from '../api/api';

const DEMO_USERS = [
  { id: 1, username: 'admin',   password: 'admin123',   role: 'admin',   name: 'Dr. Rajesh Kumar',   avatar: 'RK', email: 'admin@nexus.edu'   },
  { id: 2, username: 'faculty', password: 'faculty123', role: 'faculty', name: 'Prof. Meena Sharma', avatar: 'MS', email: 'meena@nexus.edu'   },
  { id: 3, username: 'student', password: 'student123', role: 'student', name: 'Arjun Verma',        avatar: 'AV', email: 'arjun@nexus.edu'   },
];

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nexus_user') || 'null'); }
    catch { return null; }
  });

  const saveUser = (u, token = '') => {
    const stored = token ? { ...u, token } : u;
    localStorage.setItem('nexus_user', JSON.stringify(stored));
    setUser(stored);
  };

  const login = async (username, password) => {
    const demoUser = DEMO_USERS.find(u => u.username === username.trim() && u.password === password);
    if (demoUser) {
      const { password: _pw, ...safe } = demoUser;
      saveUser(safe);
      return { ok: true, user: safe };
    }

    try {
      const data = await authAPI.login(username, password);
      saveUser(data.user, data.token);
      return { ok: true, user: data.user };
    } catch {
      const found = DEMO_USERS.find(u => u.username === username.trim() && u.password === password);
      if (found) {
        const { password: _pw, ...safe } = found;
        saveUser(safe);
        return { ok: true, user: safe };
      }
      return { ok: false, error: 'Invalid username or password' };
    }
  };

  const register = async (name, email, username, password, role) => {
    try {
      const data = await authAPI.register({ name, email, username, password, role });
      saveUser(data.user, data.token);
      return { ok: true, user: data.user };
    } catch {
      if (DEMO_USERS.find(u => u.username === username.trim()))
        return { ok: false, error: 'Username already exists' };
      const newUser = {
        id: DEMO_USERS.length + 1, username: username.trim(),
        role: role || 'student', name, email,
        avatar: name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
      };
      DEMO_USERS.push({ ...newUser, password });
      saveUser(newUser);
      return { ok: true, user: newUser };
    }
  };

  const logout = () => {
    localStorage.removeItem('nexus_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
