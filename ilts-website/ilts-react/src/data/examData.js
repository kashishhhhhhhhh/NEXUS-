export const examQuestions = [
  // Programming (10)
  { q: 'Which data structure uses LIFO (Last In First Out) principle?', opts: ['Queue', 'Stack', 'Linked List', 'Tree'], ans: 1, subject: 'Programming' },
  { q: 'What is the time complexity of binary search?', opts: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], ans: 2, subject: 'Programming' },
  { q: 'Which keyword is used to define a class in Java?', opts: ['struct', 'define', 'class', 'object'], ans: 2, subject: 'Programming' },
  { q: 'What does HTML stand for?', opts: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'None'], ans: 0, subject: 'Programming' },
  { q: 'Which sorting algorithm has the best average-case time complexity?', opts: ['Bubble Sort', 'Insertion Sort', 'Merge Sort', 'Selection Sort'], ans: 2, subject: 'Programming' },
  { q: 'In Python, which function is used to get the length of a list?', opts: ['size()', 'count()', 'length()', 'len()'], ans: 3, subject: 'Programming' },
  { q: 'What is the output of: print(2 ** 3) in Python?', opts: ['6', '8', '9', '5'], ans: 1, subject: 'Programming' },
  { q: 'Which of the following is NOT an OOP concept?', opts: ['Inheritance', 'Polymorphism', 'Compilation', 'Encapsulation'], ans: 2, subject: 'Programming' },
  { q: 'What does CSS stand for?', opts: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'], ans: 1, subject: 'Programming' },
  { q: 'Which protocol is used for secure web communication?', opts: ['HTTP', 'FTP', 'HTTPS', 'SMTP'], ans: 2, subject: 'Programming' },
  // DBMS (10)
  { q: 'What does SQL stand for?', opts: ['Structured Query Language', 'Simple Query Language', 'Standard Query Logic', 'Sequential Query Language'], ans: 0, subject: 'DBMS' },
  { q: 'Which SQL command is used to retrieve data?', opts: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'], ans: 2, subject: 'DBMS' },
  { q: 'What is a primary key?', opts: ['A key that can be NULL', 'A key that uniquely identifies each record', 'A foreign key reference', 'A duplicate key'], ans: 1, subject: 'DBMS' },
  { q: 'Which normal form eliminates transitive dependencies?', opts: ['1NF', '2NF', '3NF', 'BCNF'], ans: 2, subject: 'DBMS' },
  { q: 'What is a JOIN in SQL?', opts: ['Deletes two tables', 'Combines rows from two or more tables', 'Creates a new table', 'Updates multiple tables'], ans: 1, subject: 'DBMS' },
  { q: 'Which command removes all rows from a table without deleting the table?', opts: ['DROP', 'DELETE', 'TRUNCATE', 'REMOVE'], ans: 2, subject: 'DBMS' },
  { q: 'What is an index in a database?', opts: ['A backup copy', 'A data structure to speed up queries', 'A type of join', 'A constraint'], ans: 1, subject: 'DBMS' },
  { q: 'ACID properties in DBMS stand for?', opts: ['Atomicity, Consistency, Isolation, Durability', 'Access, Control, Integrity, Data', 'Atomicity, Concurrency, Isolation, Data', 'None of these'], ans: 0, subject: 'DBMS' },
  { q: 'Which type of relationship is represented by a foreign key?', opts: ['One-to-One', 'Many-to-Many', 'One-to-Many', 'All of the above'], ans: 2, subject: 'DBMS' },
  { q: 'What does ER stand for in ER Diagram?', opts: ['Entity Relationship', 'Element Record', 'Entity Record', 'Element Relationship'], ans: 0, subject: 'DBMS' },
  // Aptitude (10)
  { q: 'If a train travels 360 km in 4 hours, what is its speed in km/h?', opts: ['80', '90', '100', '70'], ans: 1, subject: 'Aptitude' },
  { q: 'What is 15% of 200?', opts: ['25', '30', '35', '20'], ans: 1, subject: 'Aptitude' },
  { q: 'Find the next number: 2, 4, 8, 16, __', opts: ['24', '32', '28', '20'], ans: 1, subject: 'Aptitude' },
  { q: 'A can do a work in 10 days, B in 15 days. Together they finish in?', opts: ['5 days', '6 days', '8 days', '12 days'], ans: 1, subject: 'Aptitude' },
  { q: 'If APPLE = 50, then MANGO = ?', opts: ['50', '55', '60', '45'], ans: 1, subject: 'Aptitude' },
  { q: 'Simple interest on Rs.1000 at 10% per annum for 2 years?', opts: ['Rs.100', 'Rs.200', 'Rs.150', 'Rs.250'], ans: 1, subject: 'Aptitude' },
  { q: 'Which is the largest prime number less than 20?', opts: ['17', '19', '18', '16'], ans: 1, subject: 'Aptitude' },
  { q: 'If 5x = 25, then x = ?', opts: ['3', '4', '5', '6'], ans: 2, subject: 'Aptitude' },
  { q: 'A shopkeeper sells at 20% profit. Cost price is Rs.500. Selling price?', opts: ['Rs.550', 'Rs.600', 'Rs.650', 'Rs.700'], ans: 1, subject: 'Aptitude' },
  { q: 'How many seconds in 2 hours?', opts: ['3600', '7200', '1800', '5400'], ans: 1, subject: 'Aptitude' },
];

export const courses = [
  { icon: 'fas fa-brain', color: '#6366f1', title: 'AI & Machine Learning', desc: 'Deep learning, NLP, computer vision and intelligent systems.', seats: 60 },
  { icon: 'fas fa-cloud', color: '#0ea5e9', title: 'Cloud Computing', desc: 'AWS, Azure, GCP, DevOps and cloud-native architecture.', seats: 60 },
  { icon: 'fas fa-shield-alt', color: '#ef4444', title: 'Cybersecurity', desc: 'Ethical hacking, network security and digital forensics.', seats: 40 },
  { icon: 'fas fa-chart-bar', color: '#f59e0b', title: 'Data Science', desc: 'Big data, analytics, visualization and business intelligence.', seats: 60 },
  { icon: 'fas fa-code', color: '#22c55e', title: 'Full Stack Dev', desc: 'React, Node.js, databases and modern web development.', seats: 80 },
  { icon: 'fas fa-mobile-alt', color: '#a855f7', title: 'Mobile Development', desc: 'Android, iOS, Flutter and cross-platform app development.', seats: 40 },
];

export const testimonials = [
  { name: 'Priya Sharma', college: 'BCA, Delhi University', text: 'The Online Exam exam process was smooth and transparent. The online interview was professional and I got my result within 24 hours!', rating: 5 },
  { name: 'Rahul Verma', college: 'B.Sc CS, Pune University', text: 'Excellent platform for MCA entrance. The exam interface is user-friendly and the question quality is top-notch.', rating: 5 },
  { name: 'Anjali Singh', college: 'BCA, Lucknow University', text: 'I cleared both the exam and interview in one week. The process is very well organized. Highly recommend Online Exam!', rating: 5 },
];

export const interviewTopics = ['Data Structures', 'OOP Concepts', 'DBMS', 'Operating Systems', 'Networking', 'Python/Java', 'Web Technologies', 'Problem Solving', 'Project Discussion', 'Career Goals'];
