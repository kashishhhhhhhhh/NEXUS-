// ============================================================
//  NEXUS — Sample / Mock Data  (used when no backend is live)
// ============================================================

// ── Users (auth store) ──────────────────────────────────────
export const USERS = [
  { id: 1, username: 'admin',   password: 'admin123',   role: 'admin',   name: 'Dr. Rajesh Kumar',    avatar: 'RK', email: 'admin@nexus.edu' },
  { id: 2, username: 'faculty', password: 'faculty123', role: 'faculty', name: 'Prof. Meena Sharma',  avatar: 'MS', email: 'meena@nexus.edu' },
  { id: 3, username: 'student', password: 'student123', role: 'student', name: 'Arjun Verma',         avatar: 'AV', email: 'arjun@nexus.edu' },
];

// ── Students ────────────────────────────────────────────────
export const STUDENTS = [
  { id: 'NX001', name: 'Arjun Verma',       course: 'MCA',  year: 1, gender: 'Male',   phone: '9876543210', email: 'arjun@nexus.edu',    cgpa: 8.4, attendance: 88, feeStatus: 'paid',    city: 'Delhi' },
  { id: 'NX002', name: 'Priya Sharma',      course: 'MCA',  year: 2, gender: 'Female', phone: '9876543211', email: 'priya@nexus.edu',    cgpa: 9.1, attendance: 95, feeStatus: 'paid',    city: 'Mumbai' },
  { id: 'NX003', name: 'Rahul Gupta',       course: 'BCA',  year: 3, gender: 'Male',   phone: '9876543212', email: 'rahul@nexus.edu',    cgpa: 7.2, attendance: 72, feeStatus: 'pending', city: 'Pune' },
  { id: 'NX004', name: 'Anjali Singh',      course: 'MCA',  year: 1, gender: 'Female', phone: '9876543213', email: 'anjali@nexus.edu',   cgpa: 8.8, attendance: 91, feeStatus: 'paid',    city: 'Jaipur' },
  { id: 'NX005', name: 'Karan Mehta',       course: 'BSc',  year: 2, gender: 'Male',   phone: '9876543214', email: 'karan@nexus.edu',    cgpa: 6.9, attendance: 68, feeStatus: 'overdue', city: 'Lucknow' },
  { id: 'NX006', name: 'Sneha Patil',       course: 'MCA',  year: 2, gender: 'Female', phone: '9876543215', email: 'sneha@nexus.edu',    cgpa: 9.3, attendance: 97, feeStatus: 'paid',    city: 'Bangalore' },
  { id: 'NX007', name: 'Vikram Rao',        course: 'BCA',  year: 1, gender: 'Male',   phone: '9876543216', email: 'vikram@nexus.edu',   cgpa: 7.8, attendance: 80, feeStatus: 'paid',    city: 'Chennai' },
  { id: 'NX008', name: 'Divya Nair',        course: 'BSc',  year: 3, gender: 'Female', phone: '9876543217', email: 'divya@nexus.edu',    cgpa: 8.0, attendance: 85, feeStatus: 'pending', city: 'Hyderabad' },
  { id: 'NX009', name: 'Rohan Joshi',       course: 'MCA',  year: 1, gender: 'Male',   phone: '9876543218', email: 'rohan@nexus.edu',    cgpa: 7.5, attendance: 78, feeStatus: 'paid',    city: 'Ahmedabad' },
  { id: 'NX010', name: 'Pooja Desai',       course: 'BCA',  year: 2, gender: 'Female', phone: '9876543219', email: 'pooja@nexus.edu',    cgpa: 8.6, attendance: 90, feeStatus: 'paid',    city: 'Surat' },
  { id: 'NX011', name: 'Amit Kumar',        course: 'BSc',  year: 1, gender: 'Male',   phone: '9876543220', email: 'amit@nexus.edu',     cgpa: 6.5, attendance: 65, feeStatus: 'overdue', city: 'Kolkata' },
  { id: 'NX012', name: 'Neha Tiwari',       course: 'MCA',  year: 2, gender: 'Female', phone: '9876543221', email: 'neha@nexus.edu',     cgpa: 9.0, attendance: 94, feeStatus: 'paid',    city: 'Bhopal' },
];

// ── Faculty ─────────────────────────────────────────────────
export const FACULTY = [
  { id: 'FC001', name: 'Prof. Meena Sharma',  dept: 'Computer Science', subjects: ['DBMS', 'Data Structures'], exp: 12, email: 'meena@nexus.edu',   phone: '9811111111', status: 'active' },
  { id: 'FC002', name: 'Dr. Anil Verma',      dept: 'Mathematics',      subjects: ['Calculus', 'Statistics'],  exp: 18, email: 'anil@nexus.edu',    phone: '9811111112', status: 'active' },
  { id: 'FC003', name: 'Prof. Sunita Roy',    dept: 'IT',               subjects: ['Web Tech', 'Python'],      exp: 9,  email: 'sunita@nexus.edu',  phone: '9811111113', status: 'active' },
  { id: 'FC004', name: 'Dr. Manoj Patel',     dept: 'Computer Science', subjects: ['OS', 'Networks'],          exp: 15, email: 'manoj@nexus.edu',   phone: '9811111114', status: 'on-leave' },
  { id: 'FC005', name: 'Prof. Kavita Singh',  dept: 'IT',               subjects: ['AI/ML', 'Cloud'],          exp: 7,  email: 'kavita@nexus.edu',  phone: '9811111115', status: 'active' },
];

// ── Courses ─────────────────────────────────────────────────
export const COURSES = [
  { id: 'C001', name: 'MCA', fullName: 'Master of Computer Applications', duration: '2 Years', seats: 60, enrolled: 52, fee: 95000, dept: 'Computer Science' },
  { id: 'C002', name: 'BCA', fullName: 'Bachelor of Computer Applications', duration: '3 Years', seats: 80, enrolled: 71, fee: 65000, dept: 'IT' },
  { id: 'C003', name: 'BSc', fullName: 'Bachelor of Science (CS)', duration: '3 Years', seats: 60, enrolled: 48, fee: 55000, dept: 'Computer Science' },
  { id: 'C004', name: 'MBA', fullName: 'Master of Business Administration', duration: '2 Years', seats: 40, enrolled: 38, fee: 120000, dept: 'Management' },
];

// ── Attendance ───────────────────────────────────────────────
export const ATTENDANCE = [
  { student: 'NX001', subject: 'DBMS',     present: 22, total: 25 },
  { student: 'NX001', subject: 'Data Structures', present: 20, total: 23 },
  { student: 'NX001', subject: 'Python',   present: 18, total: 22 },
  { student: 'NX002', subject: 'DBMS',     present: 24, total: 25 },
  { student: 'NX002', subject: 'Data Structures', present: 23, total: 23 },
  { student: 'NX003', subject: 'Web Tech', present: 15, total: 22 },
  { student: 'NX003', subject: 'Python',   present: 16, total: 23 },
];

// ── Marks / Exam Results ────────────────────────────────────
export const MARKS = [
  { student: 'NX001', subject: 'DBMS',     internal: 22, external: 58, total: 80 },
  { student: 'NX001', subject: 'Data Structures', internal: 20, external: 55, total: 75 },
  { student: 'NX001', subject: 'Python',   internal: 24, external: 63, total: 87 },
  { student: 'NX002', subject: 'DBMS',     internal: 25, external: 70, total: 95 },
  { student: 'NX002', subject: 'Data Structures', internal: 23, external: 68, total: 91 },
  { student: 'NX003', subject: 'Web Tech', internal: 18, external: 45, total: 63 },
  { student: 'NX003', subject: 'Python',   internal: 17, external: 48, total: 65 },
  { student: 'NX004', subject: 'DBMS',     internal: 24, external: 66, total: 90 },
  { student: 'NX005', subject: 'Web Tech', internal: 15, external: 38, total: 53 },
];

// ── Fees ────────────────────────────────────────────────────
export const FEES = [
  { student: 'NX001', name: 'Arjun Verma',  course: 'MCA', amount: 95000, paid: 95000,  due: 0,     status: 'paid',    lastPaid: '2026-07-10' },
  { student: 'NX002', name: 'Priya Sharma', course: 'MCA', amount: 95000, paid: 95000,  due: 0,     status: 'paid',    lastPaid: '2026-07-05' },
  { student: 'NX003', name: 'Rahul Gupta',  course: 'BCA', amount: 65000, paid: 32500,  due: 32500, status: 'pending', lastPaid: '2026-05-20' },
  { student: 'NX004', name: 'Anjali Singh', course: 'MCA', amount: 95000, paid: 95000,  due: 0,     status: 'paid',    lastPaid: '2026-07-08' },
  { student: 'NX005', name: 'Karan Mehta',  course: 'BSc', amount: 55000, paid: 0,      due: 55000, status: 'overdue', lastPaid: '—' },
  { student: 'NX006', name: 'Sneha Patil',  course: 'MCA', amount: 95000, paid: 95000,  due: 0,     status: 'paid',    lastPaid: '2026-07-12' },
  { student: 'NX007', name: 'Vikram Rao',   course: 'BCA', amount: 65000, paid: 65000,  due: 0,     status: 'paid',    lastPaid: '2026-07-01' },
  { student: 'NX008', name: 'Divya Nair',   course: 'BSc', amount: 55000, paid: 27500,  due: 27500, status: 'pending', lastPaid: '2026-06-15' },
  { student: 'NX009', name: 'Rohan Joshi',  course: 'MCA', amount: 95000, paid: 95000,  due: 0,     status: 'paid',    lastPaid: '2026-07-11' },
  { student: 'NX010', name: 'Pooja Desai',  course: 'BCA', amount: 65000, paid: 65000,  due: 0,     status: 'paid',    lastPaid: '2026-07-03' },
  { student: 'NX011', name: 'Amit Kumar',   course: 'BSc', amount: 55000, paid: 0,      due: 55000, status: 'overdue', lastPaid: '—' },
  { student: 'NX012', name: 'Neha Tiwari',  course: 'MCA', amount: 95000, paid: 95000,  due: 0,     status: 'paid',    lastPaid: '2026-07-09' },
];

// ── Analytics: Enrollment Trend (monthly) ───────────────────
export const ENROLLMENT_TREND = [
  { month: 'Jan', students: 180 },
  { month: 'Feb', students: 195 },
  { month: 'Mar', students: 210 },
  { month: 'Apr', students: 225 },
  { month: 'May', students: 240 },
  { month: 'Jun', students: 209 },
  { month: 'Jul', students: 265 },
  { month: 'Aug', students: 280 },
  { month: 'Sep', students: 295 },
  { month: 'Oct', students: 310 },
];

// ── Analytics: Attendance by subject ────────────────────────
export const ATTENDANCE_STATS = [
  { subject: 'DBMS',          pct: 88 },
  { subject: 'Data Struct.',  pct: 82 },
  { subject: 'Python',        pct: 79 },
  { subject: 'Web Tech',      pct: 75 },
  { subject: 'Calculus',      pct: 91 },
  { subject: 'Networks',      pct: 84 },
  { subject: 'AI/ML',         pct: 93 },
];

// ── Analytics: Academic performance distribution ─────────────
export const PERFORMANCE_DIST = [
  { grade: 'A+ (90-100)', count: 18 },
  { grade: 'A  (80-89)',  count: 42 },
  { grade: 'B  (70-79)',  count: 65 },
  { grade: 'C  (60-69)',  count: 38 },
  { grade: 'D  (50-59)',  count: 20 },
  { grade: 'F  (<50)',    count: 7  },
];

// ── Analytics: Fee collection monthly ───────────────────────
export const FEE_TREND = [
  { month: 'Jan', collected: 820000, pending: 180000 },
  { month: 'Feb', collected: 750000, pending: 210000 },
  { month: 'Mar', collected: 900000, pending: 150000 },
  { month: 'Apr', collected: 680000, pending: 240000 },
  { month: 'May', collected: 950000, pending: 120000 },
  { month: 'Jun', collected: 870000, pending: 160000 },
  { month: 'Jul', collected: 1020000, pending: 90000 },
];

// ── Analytics: Course popularity ────────────────────────────
export const COURSE_POPULARITY = [
  { name: 'MCA',  value: 52 },
  { name: 'BCA',  value: 71 },
  { name: 'BSc',  value: 48 },
  { name: 'MBA',  value: 38 },
];

// ── ML: Performance Predictions ────────────────────────────
// Simple linear-regression-style mock predictions
// Features used: attendance%, last_cgpa → predicted_cgpa
export function predictPerformance(student) {
  const a = student.attendance / 100;
  const c = student.cgpa / 10;
  // weighted formula: attendance 40%, cgpa 60%
  const score = (a * 0.4 + c * 0.6) * 10;
  const predicted = Math.min(10, Math.round(score * 10) / 10);
  const risk = predicted < 6.5 ? 'High' : predicted < 7.5 ? 'Medium' : 'Low';
  return { predicted, risk, confidence: Math.round(78 + Math.random() * 15) };
}

// ── ML: Enrollment Forecast (next 3 months) ─────────────────
export const ENROLLMENT_FORECAST = [
  { month: 'Nov', actual: null, forecast: 325, lower: 310, upper: 340 },
  { month: 'Dec', actual: null, forecast: 312, lower: 295, upper: 330 },
  { month: 'Jan', actual: null, forecast: 340, lower: 320, upper: 360 },
];

// ── ML: At-risk student detection ───────────────────────────
export function detectAtRisk(students) {
  return students
    .map(s => ({ ...s, ...predictPerformance(s) }))
    .filter(s => s.risk !== 'Low')
    .sort((a, b) => a.predicted - b.predicted);
}

// ── Notifications ────────────────────────────────────────────
export const NOTIFICATIONS = [
  { id: 1, type: 'alert',   message: '3 students have overdue fees',           time: '2h ago' },
  { id: 2, type: 'info',    message: 'Semester exams scheduled for Nov 15',     time: '5h ago' },
  { id: 3, type: 'success', message: 'Monthly attendance report generated',     time: '1d ago' },
  { id: 4, type: 'warning', message: '5 students below 75% attendance',         time: '1d ago' },
  { id: 5, type: 'info',    message: 'New course registration window open',     time: '2d ago' },
];
