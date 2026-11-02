// ============================================================
//  NEXUS — API service layer
//  All calls go through here. Reads token from localStorage.
//  Falls back gracefully when backend is not running.
// ============================================================

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken() {
  try {
    const user = JSON.parse(localStorage.getItem('nexus_user') || '{}');
    return user.token || '';
  } catch { return ''; }
}

async function request(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// ── Auth ──────────────────────────────────────────────────────
export const authAPI = {
  login:    (username, password) => request('POST', '/auth/login',    { username, password }),
  register: (payload)            => request('POST', '/auth/register', payload),
  me:       ()                   => request('GET',  '/auth/me'),
};

// ── Students ──────────────────────────────────────────────────
export const studentsAPI = {
  getAll:    (params = {}) => request('GET', `/students?${new URLSearchParams(params)}`),
  getById:   (id)          => request('GET', `/students/${id}`),
  create:    (data)        => request('POST', '/students', data),
  update:    (id, data)    => request('PUT',  `/students/${id}`, data),
  delete:    (id)          => request('DELETE', `/students/${id}`),
};

// ── Faculty ───────────────────────────────────────────────────
export const facultyAPI = {
  getAll:  ()        => request('GET',    '/faculty'),
  create:  (data)    => request('POST',   '/faculty', data),
  update:  (id, d)   => request('PUT',    `/faculty/${id}`, d),
  delete:  (id)      => request('DELETE', `/faculty/${id}`),
};

// ── Courses ───────────────────────────────────────────────────
export const coursesAPI = {
  getAll:  ()        => request('GET',    '/courses'),
  create:  (data)    => request('POST',   '/courses', data),
  update:  (id, d)   => request('PUT',    `/courses/${id}`, d),
  delete:  (id)      => request('DELETE', `/courses/${id}`),
};

// ── Attendance ────────────────────────────────────────────────
export const attendanceAPI = {
  getAll:    (params = {}) => request('GET', `/attendance?${new URLSearchParams(params)}`),
  getSummary:(studentId)   => request('GET', `/attendance/summary/${studentId}`),
  save:      (data)        => request('POST', '/attendance', data),
};

// ── Marks ─────────────────────────────────────────────────────
export const marksAPI = {
  getAll:  (params = {}) => request('GET', `/marks?${new URLSearchParams(params)}`),
  save:    (data)        => request('POST', '/marks', data),
  delete:  (id)          => request('DELETE', `/marks/${id}`),
};

// ── Fees ──────────────────────────────────────────────────────
export const feesAPI = {
  getAll:        (params = {}) => request('GET', `/fees?${new URLSearchParams(params)}`),
  getByStudent:  (studentId)   => request('GET', `/fees/student/${studentId}`),
  pay:           (data)        => request('POST', '/fees/pay', data),
};

// ── Exams ─────────────────────────────────────────────────────
export const examsAPI = {
  getAll:         (params = {}) => request('GET', `/exams?${new URLSearchParams(params)}`),
  getById:        (examId)      => request('GET', `/exams/${examId}`),
  create:         (data)        => request('POST', '/exams', data),
  update:         (id, data)    => request('PUT',  `/exams/${id}`, data),
  delete:         (id)          => request('DELETE', `/exams/${id}`),
  submit:         (examId, data)=> request('POST', `/exams/${examId}/submit`, data),
  getResults:     (examId)      => request('GET',  `/exams/${examId}/results`),
  mySubmissions:  ()            => request('GET',  '/exams/my/submissions'),
};

// ── Analytics ─────────────────────────────────────────────────
export const analyticsAPI = {
  overview:           () => request('GET', '/analytics/overview'),
  courseDistribution: () => request('GET', '/analytics/course-distribution'),
  gradeDistribution:  () => request('GET', '/analytics/grade-distribution'),
  feeSummary:         () => request('GET', '/analytics/fee-summary'),
  attendanceBySubject:() => request('GET', '/analytics/attendance-by-subject'),
};

// ── Health check ──────────────────────────────────────────────
export const checkBackend = async () => {
  try {
    const data = await request('GET', '/health');
    return data.status === 'ok';
  } catch { return false; }
};
