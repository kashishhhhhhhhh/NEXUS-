// ============================================================
//  NEXUS Exam Module — Data Store
//  Exams, questions, submissions, analytics & ML helpers
// ============================================================

// ── Exams (with embedded questions) ─────────────────────────
export const EXAMS = [
  {
    id: 'EX001',
    title: 'Data Structures & Algorithms',
    subject: 'Programming',
    duration: 30,          // minutes
    totalMarks: 30,
    passPct: 50,
    status: 'active',      // draft | scheduled | active | completed
    scheduledDate: '2026-11-05',
    questions: [
      { id: 1, q: 'Which data structure uses LIFO principle?', opts: ['Queue', 'Stack', 'Linked List', 'Tree'], ans: 1, marks: 3, difficulty: 'easy' },
      { id: 2, q: 'What is the time complexity of binary search?', opts: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], ans: 2, marks: 3, difficulty: 'medium' },
      { id: 3, q: 'Which sorting algorithm has best average-case complexity?', opts: ['Bubble Sort', 'Insertion Sort', 'Merge Sort', 'Selection Sort'], ans: 2, marks: 3, difficulty: 'medium' },
      { id: 4, q: 'In a binary tree of height h, max nodes = ?', opts: ['2^h', '2^(h+1)-1', 'h²', 'h+1'], ans: 1, marks: 3, difficulty: 'hard' },
      { id: 5, q: 'Which is NOT a linear data structure?', opts: ['Array', 'Queue', 'Stack', 'Binary Tree'], ans: 3, marks: 3, difficulty: 'easy' },
      { id: 6, q: 'What does a hash table provide on average?', opts: ['O(n) lookup', 'O(1) lookup', 'O(log n) lookup', 'O(n²) lookup'], ans: 1, marks: 3, difficulty: 'medium' },
      { id: 7, q: 'DFS uses which data structure?', opts: ['Queue', 'Priority Queue', 'Stack', 'Heap'], ans: 2, marks: 3, difficulty: 'medium' },
      { id: 8, q: 'BFS uses which data structure?', opts: ['Stack', 'Queue', 'Tree', 'Graph'], ans: 1, marks: 3, difficulty: 'easy' },
      { id: 9, q: 'What is the height of a balanced BST with n nodes?', opts: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], ans: 1, marks: 3, difficulty: 'hard' },
      { id: 10, q: 'Which is a dynamic programming problem?', opts: ['BFS traversal', 'Fibonacci series', 'Binary search', 'Tree insertion'], ans: 1, marks: 3, difficulty: 'medium' },
    ],
  },
  {
    id: 'EX002',
    title: 'Database Management Systems',
    subject: 'DBMS',
    duration: 25,
    totalMarks: 30,
    passPct: 50,
    status: 'active',
    scheduledDate: '2026-11-07',
    questions: [
      { id: 1, q: 'What does SQL stand for?', opts: ['Structured Query Language', 'Simple Query Language', 'Standard Query Logic', 'Sequential Query Language'], ans: 0, marks: 3, difficulty: 'easy' },
      { id: 2, q: 'Which SQL command retrieves data?', opts: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'], ans: 2, marks: 3, difficulty: 'easy' },
      { id: 3, q: 'What is a primary key?', opts: ['Can be NULL', 'Uniquely identifies each record', 'A foreign key', 'A duplicate key'], ans: 1, marks: 3, difficulty: 'easy' },
      { id: 4, q: 'Which normal form eliminates transitive dependencies?', opts: ['1NF', '2NF', '3NF', 'BCNF'], ans: 2, marks: 3, difficulty: 'hard' },
      { id: 5, q: 'What does a JOIN do?', opts: ['Deletes tables', 'Combines rows from tables', 'Creates a table', 'Updates tables'], ans: 1, marks: 3, difficulty: 'medium' },
      { id: 6, q: 'Which removes all rows but keeps table structure?', opts: ['DROP', 'DELETE', 'TRUNCATE', 'REMOVE'], ans: 2, marks: 3, difficulty: 'medium' },
      { id: 7, q: 'What is an index?', opts: ['A backup', 'Speeds up queries', 'A type of join', 'A constraint'], ans: 1, marks: 3, difficulty: 'medium' },
      { id: 8, q: 'ACID stands for?', opts: ['Atomicity, Consistency, Isolation, Durability', 'Access, Control, Integrity, Data', 'Atomicity, Concurrency, Isolation, Data', 'None'], ans: 0, marks: 3, difficulty: 'hard' },
      { id: 9, q: 'Foreign key represents which relationship?', opts: ['One-to-One', 'Many-to-Many', 'One-to-Many', 'All'], ans: 2, marks: 3, difficulty: 'medium' },
      { id: 10, q: 'What does ER stand for in ER Diagram?', opts: ['Entity Relationship', 'Element Record', 'Entity Record', 'Element Relationship'], ans: 0, marks: 3, difficulty: 'easy' },
    ],
  },
  {
    id: 'EX003',
    title: 'Python Programming',
    subject: 'Programming',
    duration: 20,
    totalMarks: 30,
    passPct: 50,
    status: 'scheduled',
    scheduledDate: '2026-11-12',
    questions: [
      { id: 1, q: 'Which function returns list length?', opts: ['size()', 'count()', 'length()', 'len()'], ans: 3, marks: 3, difficulty: 'easy' },
      { id: 2, q: 'Output of: print(2 ** 3)?', opts: ['6', '8', '9', '5'], ans: 1, marks: 3, difficulty: 'easy' },
      { id: 3, q: 'Which is NOT a Python data type?', opts: ['list', 'tuple', 'array', 'dict'], ans: 2, marks: 3, difficulty: 'medium' },
      { id: 4, q: 'How to create a dictionary?', opts: ['[]', '()', '{}', 'set()'], ans: 2, marks: 3, difficulty: 'easy' },
      { id: 5, q: 'What does list.append() do?', opts: ['Inserts at start', 'Adds to end', 'Removes last', 'Sorts list'], ans: 1, marks: 3, difficulty: 'easy' },
      { id: 6, q: 'Which is immutable?', opts: ['list', 'dict', 'tuple', 'set'], ans: 2, marks: 3, difficulty: 'medium' },
      { id: 7, q: 'What is a decorator?', opts: ['A class', 'A function modifying functions', 'A loop', 'A variable'], ans: 1, marks: 3, difficulty: 'hard' },
      { id: 8, q: 'How to handle exceptions?', opts: ['if-else', 'try-except', 'switch', 'catch'], ans: 1, marks: 3, difficulty: 'medium' },
      { id: 9, q: 'What is list comprehension?', opts: ['A for loop', 'Concise list creation', 'A sort method', 'A filter'], ans: 1, marks: 3, difficulty: 'medium' },
      { id: 10, q: 'Which keyword defines a function?', opts: ['function', 'def', 'func', 'lambda'], ans: 1, marks: 3, difficulty: 'easy' },
    ],
  },
  {
    id: 'EX004',
    title: 'Operating Systems',
    subject: 'OS',
    duration: 30,
    totalMarks: 30,
    passPct: 50,
    status: 'completed',
    scheduledDate: '2026-10-20',
    questions: [
      { id: 1, q: 'Which scheduling is preemptive?', opts: ['FCFS', 'SJF', 'Round Robin', 'Priority (non-preemptive)'], ans: 2, marks: 3, difficulty: 'medium' },
      { id: 2, q: 'What is a deadlock?', opts: ['Process crash', 'All processes waiting forever', 'CPU overload', 'Memory leak'], ans: 1, marks: 3, difficulty: 'easy' },
      { id: 3, q: 'Which is NOT a deadlock condition?', opts: ['Mutual exclusion', 'Hold and wait', 'Preemption', 'Circular wait'], ans: 2, marks: 3, difficulty: 'hard' },
      { id: 4, q: 'What does a semaphore do?', opts: ['Schedules processes', 'Synchronizes access', 'Allocates memory', 'Manages I/O'], ans: 1, marks: 3, difficulty: 'medium' },
      { id: 5, q: 'Virtual memory uses?', opts: ['Cache only', 'Disk as RAM extension', 'CPU registers', 'ROM'], ans: 1, marks: 3, difficulty: 'medium' },
      { id: 6, q: 'Which page replacement is optimal?', opts: ['FIFO', 'LRU', 'Optimal', 'Random'], ans: 2, marks: 3, difficulty: 'hard' },
      { id: 7, q: 'What is a context switch?', opts: ['Saving/restoring CPU state', 'Process termination', 'Memory allocation', 'I/O operation'], ans: 0, marks: 3, difficulty: 'medium' },
      { id: 8, q: 'Which is a system call?', opts: ['printf', 'fork', 'malloc', 'main'], ans: 1, marks: 3, difficulty: 'hard' },
      { id: 9, q: 'What is paging?', opts: ['CPU scheduling', 'Memory management scheme', 'File system', 'I/O control'], ans: 1, marks: 3, difficulty: 'medium' },
      { id: 10, q: 'Which is NOT an OS type?', opts: ['Batch', 'Time-sharing', 'Real-time', 'Database'], ans: 3, marks: 3, difficulty: 'easy' },
    ],
  },
];

// ── Submissions (student exam results) ──────────────────────
export const EXAM_SUBMISSIONS = [
  { id: 'SUB001', examId: 'EX001', studentId: 'NX001', studentName: 'Arjun Verma',    answers: [1,2,2,1,3,1,2,1,1,1], score: 30, pct: 100, status: 'pass', submittedAt: '2026-11-05T10:25:00', timeTaken: 1800 },
  { id: 'SUB002', examId: 'EX001', studentId: 'NX002', studentName: 'Priya Sharma',   answers: [1,2,2,1,3,1,2,1,1,1], score: 30, pct: 100, status: 'pass', submittedAt: '2026-11-05T10:28:00', timeTaken: 1650 },
  { id: 'SUB003', examId: 'EX001', studentId: 'NX003', studentName: 'Rahul Gupta',     answers: [0,2,0,0,3,1,0,1,1,0], score: 18, pct: 60, status: 'pass', submittedAt: '2026-11-05T10:30:00', timeTaken: 1800 },
  { id: 'SUB004', examId: 'EX001', studentId: 'NX005', studentName: 'Karan Mehta',    answers: [0,0,0,0,3,1,0,1,0,0], score: 9,  pct: 30, status: 'fail', submittedAt: '2026-11-05T10:30:00', timeTaken: 1800 },
  { id: 'SUB005', examId: 'EX001', studentId: 'NX006', studentName: 'Sneha Patil',    answers: [1,2,2,1,3,1,2,1,1,1], score: 30, pct: 100, status: 'pass', submittedAt: '2026-11-05T10:22:00', timeTaken: 1450 },
  { id: 'SUB006', examId: 'EX001', studentId: 'NX007', studentName: 'Vikram Rao',     answers: [1,2,0,1,3,1,2,1,1,0], score: 24, pct: 80, status: 'pass', submittedAt: '2026-11-05T10:29:00', timeTaken: 1750 },
  { id: 'SUB007', examId: 'EX001', studentId: 'NX009', studentName: 'Rohan Joshi',    answers: [1,2,2,0,3,1,2,1,1,1], score: 27, pct: 90, status: 'pass', submittedAt: '2026-11-05T10:26:00', timeTaken: 1600 },
  { id: 'SUB008', examId: 'EX001', studentId: 'NX011', studentName: 'Amit Kumar',      answers: [0,0,0,0,3,0,0,1,0,0], score: 6,  pct: 20, status: 'fail', submittedAt: '2026-11-05T10:30:00', timeTaken: 1800 },
  { id: 'SUB009', examId: 'EX002', studentId: 'NX001', studentName: 'Arjun Verma',    answers: [0,2,1,2,1,2,1,0,2,0], score: 27, pct: 90, status: 'pass', submittedAt: '2026-11-07T10:20:00', timeTaken: 1400 },
  { id: 'SUB010', examId: 'EX002', studentId: 'NX002', studentName: 'Priya Sharma',   answers: [0,2,1,2,1,2,1,0,2,0], score: 30, pct: 100, status: 'pass', submittedAt: '2026-11-07T10:18:00', timeTaken: 1300 },
  { id: 'SUB011', examId: 'EX002', studentId: 'NX003', studentName: 'Rahul Gupta',     answers: [0,2,1,0,1,2,1,0,2,0], score: 24, pct: 80, status: 'pass', submittedAt: '2026-11-07T10:25:00', timeTaken: 1500 },
  { id: 'SUB012', examId: 'EX002', studentId: 'NX004', studentName: 'Anjali Singh',    answers: [0,2,1,2,1,2,1,0,2,0], score: 30, pct: 100, status: 'pass', submittedAt: '2026-11-07T10:19:00', timeTaken: 1350 },
  { id: 'SUB013', examId: 'EX002', studentId: 'NX005', studentName: 'Karan Mehta',    answers: [0,0,1,0,1,2,0,0,2,0], score: 15, pct: 50, status: 'pass', submittedAt: '2026-11-07T10:25:00', timeTaken: 1500 },
  { id: 'SUB014', examId: 'EX002', studentId: 'NX006', studentName: 'Sneha Patil',    answers: [0,2,1,2,1,2,1,0,2,0], score: 30, pct: 100, status: 'pass', submittedAt: '2026-11-07T10:17:00', timeTaken: 1200 },
  { id: 'SUB015', examId: 'EX002', studentId: 'NX011', studentName: 'Amit Kumar',      answers: [0,0,0,0,1,2,0,0,0,0], score: 6,  pct: 20, status: 'fail', submittedAt: '2026-11-07T10:25:00', timeTaken: 1500 },
  { id: 'SUB016', examId: 'EX004', studentId: 'NX001', studentName: 'Arjun Verma',    answers: [2,1,2,1,1,2,0,1,1,3], score: 27, pct: 90, status: 'pass', submittedAt: '2026-10-20T10:28:00', timeTaken: 1700 },
  { id: 'SUB017', examId: 'EX004', studentId: 'NX002', studentName: 'Priya Sharma',   answers: [2,1,2,1,1,1,0,1,1,3], score: 27, pct: 90, status: 'pass', submittedAt: '2026-10-20T10:26:00', timeTaken: 1600 },
  { id: 'SUB018', examId: 'EX004', studentId: 'NX003', studentName: 'Rahul Gupta',     answers: [0,1,2,1,1,0,0,1,1,3], score: 18, pct: 60, status: 'pass', submittedAt: '2026-10-20T10:30:00', timeTaken: 1800 },
  { id: 'SUB019', examId: 'EX004', studentId: 'NX005', studentName: 'Karan Mehta',    answers: [0,1,0,1,1,0,0,0,1,3], score: 12, pct: 40, status: 'fail', submittedAt: '2026-10-20T10:30:00', timeTaken: 1800 },
  { id: 'SUB020', examId: 'EX004', studentId: 'NX006', studentName: 'Sneha Patil',    answers: [2,1,2,1,1,2,0,1,1,3], score: 30, pct: 100, status: 'pass', submittedAt: '2026-10-20T10:24:00', timeTaken: 1500 },
  { id: 'SUB021', examId: 'EX004', studentId: 'NX007', studentName: 'Vikram Rao',     answers: [2,1,2,1,1,1,0,1,1,3], score: 24, pct: 80, status: 'pass', submittedAt: '2026-10-20T10:27:00', timeTaken: 1650 },
  { id: 'SUB022', examId: 'EX004', studentId: 'NX009', studentName: 'Rohan Joshi',    answers: [2,1,2,0,1,1,0,1,1,3], score: 21, pct: 70, status: 'pass', submittedAt: '2026-10-20T10:28:00', timeTaken: 1700 },
  { id: 'SUB023', examId: 'EX004', studentId: 'NX011', studentName: 'Amit Kumar',      answers: [0,1,0,0,1,0,0,0,1,3], score: 6,  pct: 20, status: 'fail', submittedAt: '2026-10-20T10:30:00', timeTaken: 1800 },
];

// ── Analytics helpers ────────────────────────────────────────

// Pass percentage per exam
export function getPassRate(examId) {
  const subs = EXAM_SUBMISSIONS.filter(s => s.examId === examId);
  if (subs.length === 0) return 0;
  return Math.round((subs.filter(s => s.status === 'pass').length / subs.length) * 100);
}

// Average marks per exam
export function getAvgMarks(examId) {
  const subs = EXAM_SUBMISSIONS.filter(s => s.examId === examId);
  if (subs.length === 0) return 0;
  return Math.round(subs.reduce((s, x) => s + x.score, 0) / subs.length);
}

// Participation rate (students who took it vs total)
export function getParticipation(examId, totalStudents = 12) {
  const taken = EXAM_SUBMISSIONS.filter(s => s.examId === examId).length;
  return Math.round((taken / totalStudents) * 100);
}

// Subject-wise performance
export function getSubjectPerformance() {
  const subjects = {};
  EXAM_SUBMISSIONS.forEach(sub => {
    const exam = EXAMS.find(e => e.id === sub.examId);
    if (!exam) return;
    if (!subjects[exam.subject]) subjects[exam.subject] = { total: 0, count: 0, passCount: 0 };
    subjects[exam.subject].total += sub.pct;
    subjects[exam.subject].count++;
    if (sub.status === 'pass') subjects[exam.subject].passCount++;
  });
  return Object.entries(subjects).map(([subject, d]) => ({
    subject,
    avgPct: Math.round(d.total / d.count),
    passRate: Math.round((d.passCount / d.count) * 100),
    attempts: d.count,
  }));
}

// Student performance trend across exams (for a student)
export function getStudentTrend(studentId) {
  return EXAM_SUBMISSIONS
    .filter(s => s.studentId === studentId)
    .map(s => {
      const exam = EXAMS.find(e => e.id === s.examId);
      return { exam: exam?.title?.split(' ').slice(0, 2).join(' ') || s.examId, score: s.pct, date: s.submittedAt };
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Overall pass/fail distribution
export function getOverallPassFail() {
  const pass = EXAM_SUBMISSIONS.filter(s => s.status === 'pass').length;
  const fail = EXAM_SUBMISSIONS.filter(s => s.status === 'fail').length;
  return [{ name: 'Passed', value: pass }, { name: 'Failed', value: fail }];
}

// ── ML helpers ──────────────────────────────────────────────

// Predict exam performance based on past submissions + attendance
export function predictExamPerformance(studentId, examId) {
  const pastSubs = EXAM_SUBMISSIONS.filter(s => s.studentId === studentId);
  const avgPast = pastSubs.length > 0
    ? pastSubs.reduce((s, x) => s + x.pct, 0) / pastSubs.length : 60;
  const exam = EXAMS.find(e => e.id === examId);
  const difficultyMultiplier = exam
    ? (exam.questions.filter(q => q.difficulty === 'hard').length / exam.questions.length) * 0.2
    : 0.1;
  const predicted = Math.max(0, Math.min(100, Math.round(avgPast * (1 - difficultyMultiplier))));
  const confidence = Math.round(75 + Math.random() * 15);
  const willPass = predicted >= (exam?.passPct || 50);
  return { predicted, confidence, willPass, avgPast: Math.round(avgPast) };
}

// Identify weak subjects for a student
export function identifyWeakSubjects(studentId) {
  const subs = EXAM_SUBMISSIONS.filter(s => s.studentId === studentId);
  const subjects = {};
  subs.forEach(s => {
    const exam = EXAMS.find(e => e.id === s.examId);
    if (!exam) return;
    if (!subjects[exam.subject]) subjects[exam.subject] = { total: 0, count: 0 };
    subjects[exam.subject].total += s.pct;
    subjects[exam.subject].count++;
  });
  return Object.entries(subjects)
    .map(([subject, d]) => ({ subject, avgPct: Math.round(d.total / d.count) }))
    .sort((a, b) => a.avgPct - b.avgPct);
}

// Detect declining performance (comparing latest vs previous)
export function detectDecliningPerformance() {
  const students = [...new Set(EXAM_SUBMISSIONS.map(s => s.studentId))];
  const results = [];
  students.forEach(sid => {
    const subs = EXAM_SUBMISSIONS.filter(s => s.studentId === sid)
      .sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));
    if (subs.length < 2) return;
    const latest = subs[subs.length - 1];
    const prev = subs[subs.length - 2];
    const trend = latest.pct - prev.pct;
    if (trend < -5) {
      results.push({
        studentId: sid,
        studentName: latest.studentName,
        prevPct: prev.pct,
        latestPct: latest.pct,
        decline: trend,
      });
    }
  });
  return results.sort((a, b) => a.decline - b.decline);
}

// Identify difficult questions (low correct rate)
export function identifyDifficultQuestions(examId) {
  const exam = EXAMS.find(e => e.id === examId);
  if (!exam) return [];
  const subs = EXAM_SUBMISSIONS.filter(s => s.examId === examId);
  return exam.questions.map((q, i) => {
    const correct = subs.filter(s => s.answers[i] === q.ans).length;
    const total = subs.length;
    const correctRate = total > 0 ? Math.round((correct / total) * 100) : 0;
    return {
      questionNo: i + 1,
      question: q.q,
      difficulty: q.difficulty,
      correctRate,
      correctCount: correct,
      totalAttempts: total,
    };
  }).sort((a, b) => a.correctRate - b.correctRate);
}

// All students' summary for admin
export function getAllStudentExamSummary() {
  const students = [...new Set(EXAM_SUBMISSIONS.map(s => s.studentId))];
  return students.map(sid => {
    const subs = EXAM_SUBMISSIONS.filter(s => s.studentId === sid);
    const name = subs[0]?.studentName || 'Unknown';
    const examsTaken = subs.length;
    const avgPct = examsTaken > 0 ? Math.round(subs.reduce((s, x) => s + x.pct, 0) / examsTaken) : 0;
    const passCount = subs.filter(s => s.status === 'pass').length;
    const passRate = examsTaken > 0 ? Math.round((passCount / examsTaken) * 100) : 0;
    return { studentId: sid, name, examsTaken, avgPct, passCount, passRate, failCount: examsTaken - passCount };
  }).sort((a, b) => b.avgPct - a.avgPct);
}
