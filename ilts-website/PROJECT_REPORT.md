# ILTS — Institute of Language & Technology Studies
## Online MCA Entrance Examination Portal
### Project Report — 2026

---

---

## DECLARATION

I hereby declare that the project entitled **"ILTS — Online MCA Entrance Examination Portal"** submitted for the partial fulfillment of the requirements of the MCA program is an original work carried out by me. The information and data given in the report are authentic to the best of my knowledge.

This project has not been submitted to any other university or institution for the award of any degree or diploma.

**Student Name:** ___________________________

**Roll No.:** ___________________________

**Course:** Master of Computer Applications (MCA)

**Institution:** ___________________________

**Date:** April 2026

**Signature:** ___________________________

---

## ACKNOWLEDGEMENT

I would like to express my sincere gratitude to all those who helped me in completing this project successfully.

First and foremost, I thank my **Project Guide** for their constant guidance, encouragement, and valuable suggestions throughout the development of this project.

I am also grateful to the **Head of the Department** and all faculty members of the MCA Department for their support and motivation.

Special thanks to my **family and friends** for their continuous moral support and encouragement during the entire project period.

Finally, I thank the **Almighty** for giving me the strength and wisdom to complete this project.

---

---

## TABLE OF CONTENTS

| Sr. No. | Topic | Page No. |
|---------|-------|----------|
| 1 | Declaration | 1 |
| 2 | Acknowledgement | 2 |
| 3 | Table of Contents | 3 |
| 4 | Introduction | 4 |
| 5 | Objectives | 5 |
| 6 | Software Requirements | 6 |
| 7 | Hardware Requirements | 7 |
| 8 | System Architecture | 8 |
| 9 | Implementation | 9 |
| 10 | Key Functionalities | 12 |
| 11 | Output and Screenshots (Description) | 15 |
| 12 | Database / LocalStorage | 17 |
| 13 | Conclusion | 18 |
| 14 | References | 19 |

---

---

## 1. INTRODUCTION

### 1.1 Overview

The **ILTS (Institute of Language & Technology Studies) Online MCA Entrance Examination Portal** is a full-stack web application designed to digitize and streamline the entire MCA admission process — from student registration to online examination and final interview.

In today's digital era, traditional paper-based entrance examinations are being replaced by online systems that offer greater efficiency, transparency, and accessibility. The ILTS portal addresses this need by providing a single unified platform where MCA aspirants can:

- Register for the entrance examination online
- Appear for a timed MCQ-based examination
- View their results instantly
- Schedule and attend an online interview (for qualified candidates)

### 1.2 Background

The MCA (Master of Computer Applications) is one of the most sought-after postgraduate programs in India. Thousands of students appear for entrance examinations every year. Managing this process manually is time-consuming, error-prone, and costly. The ILTS portal automates this entire workflow using modern web technologies.

### 1.3 Scope

The scope of this project covers:
- A responsive, mobile-friendly web portal
- Student registration with multi-step form validation
- Online MCQ examination with real-time timer and auto-submission
- Automated result calculation and pass/fail determination
- Online interview scheduling and virtual interview room simulation
- Data persistence using browser LocalStorage

---

---

## 2. OBJECTIVES

The primary objectives of the ILTS Online MCA Entrance Examination Portal are:

### 2.1 Main Objectives

1. **Digitize the Admission Process** — Eliminate paper-based registration and examination, replacing them with a fully online system.

2. **Provide a Seamless Student Experience** — Guide students through a clear 3-step process: Register → Exam → Interview.

3. **Conduct Fair and Transparent Examinations** — Deliver randomized MCQ questions across multiple subjects with a strict timer.

4. **Instant Result Declaration** — Calculate and display results immediately after exam submission without manual evaluation.

5. **Online Interview Facilitation** — Provide a virtual interview room with video, audio, and chat simulation for qualified candidates.

6. **Responsive Design** — Ensure the portal works seamlessly across desktops, tablets, and mobile devices.

### 2.2 Secondary Objectives

- Showcase MCA specialization programs available at ILTS
- Provide student testimonials to build trust
- Display contact information and institutional details
- Maintain session data using LocalStorage for continuity across pages

---

---

## 3. SOFTWARE REQUIREMENTS

### 3.1 Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React.js | 19.2.4 | UI component framework |
| React Router DOM | 7.14.0 | Client-side routing / navigation |
| Vite | 8.0.4 | Build tool and development server |
| Bootstrap | 5.3.2 | Responsive CSS framework |
| Font Awesome | 6.5.0 | Icon library |
| HTML5 | — | Markup structure |
| CSS3 | — | Custom styling, animations, gradients |
| JavaScript (ES6+) | — | Application logic |

### 3.2 Development Tools

| Tool | Purpose |
|------|---------|
| Node.js (v18+) | JavaScript runtime environment |
| npm | Package manager |
| VS Code / Kiro IDE | Code editor |
| Git | Version control |
| ESLint | Code linting and quality |
| Vite Dev Server | Hot module replacement during development |

### 3.3 Browser Support

| Browser | Version |
|---------|---------|
| Google Chrome | 90+ |
| Mozilla Firefox | 88+ |
| Microsoft Edge | 90+ |
| Safari | 14+ |
| Opera | 76+ |

### 3.4 Operating System (Development)

- Windows 10/11
- macOS 12+
- Ubuntu 20.04+

---

---

## 4. HARDWARE REQUIREMENTS

### 4.1 Development Machine (Minimum)

| Component | Minimum Requirement | Recommended |
|-----------|--------------------|-----------  |
| Processor | Intel Core i3 / AMD Ryzen 3 | Intel Core i5 / AMD Ryzen 5 |
| RAM | 4 GB | 8 GB or more |
| Storage | 10 GB free space | 20 GB SSD |
| Display | 1280 x 720 | 1920 x 1080 |
| Internet | 2 Mbps | 10 Mbps+ |

### 4.2 Client Machine (End User — Minimum)

| Component | Requirement |
|-----------|-------------|
| Processor | Any dual-core processor (2010 or later) |
| RAM | 2 GB |
| Storage | 500 MB free (browser cache) |
| Display | 1024 x 768 minimum |
| Internet | 1 Mbps stable connection |
| Webcam | Required for Interview Round |
| Microphone | Required for Interview Round |
| Browser | Any modern browser (Chrome recommended) |

### 4.3 Server Requirements (for Deployment)

| Component | Requirement |
|-----------|-------------|
| Web Server | Nginx / Apache / Vercel / Netlify |
| Node.js | v18+ (for build process) |
| RAM | 512 MB minimum |
| Storage | 1 GB |
| SSL Certificate | Required (HTTPS) |

---

---

## 5. SYSTEM ARCHITECTURE

### 5.1 Application Architecture

The ILTS portal follows a **Single Page Application (SPA)** architecture using React.js with client-side routing.

```
┌─────────────────────────────────────────────────────┐
│                   BROWSER (Client)                   │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  React   │  │  React   │  │   Bootstrap CSS  │  │
│  │  19.x    │  │  Router  │  │   + Custom CSS   │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │              Component Tree                  │    │
│  │  App.jsx                                     │    │
│  │  ├── / → Home.jsx                           │    │
│  │  │   ├── Navbar.jsx                         │    │
│  │  │   ├── Hero.jsx                           │    │
│  │  │   ├── About.jsx                          │    │
│  │  │   ├── Process.jsx                        │    │
│  │  │   ├── Courses.jsx                        │    │
│  │  │   ├── Testimonials.jsx                   │    │
│  │  │   └── Contact.jsx                        │    │
│  │  ├── /register → Register.jsx               │    │
│  │  ├── /exam → Exam.jsx                       │    │
│  │  └── /interview → Interview.jsx             │    │
│  └─────────────────────────────────────────────┘    │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │           Data Layer                         │    │
│  │  examData.js (questions, courses, etc.)      │    │
│  │  LocalStorage (regId, name, session)         │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### 5.2 Page Flow Diagram

```
[Home Page]
     │
     ▼
[Register Page] ──── 4-Step Form ────► [Success Modal]
                                              │
                                              ▼
                                       [Exam Page]
                                              │
                              ┌───────────────┴───────────────┐
                              │                               │
                         [PASS ≥50%]                    [FAIL <50%]
                              │                               │
                              ▼                               ▼
                      [Interview Page]                  [Home Page]
                              │
                              ▼
                      [Virtual Interview Room]
```

---

---

## 6. IMPLEMENTATION

### 6.1 Project Structure

```
ilts-website/
├── ilts-react/                    ← React Application Root
│   ├── index.html                 ← Entry HTML
│   ├── package.json               ← Dependencies
│   ├── vite.config.js             ← Vite configuration
│   └── src/
│       ├── main.jsx               ← React DOM entry point
│       ├── App.jsx                ← Router setup
│       ├── index.css              ← Global styles
│       ├── data/
│       │   └── examData.js        ← All static data
│       ├── components/
│       │   ├── Navbar.jsx         ← Navigation bar
│       │   └── home/
│       │       ├── Hero.jsx       ← Hero section
│       │       ├── About.jsx      ← About section
│       │       ├── Process.jsx    ← 3-step process
│       │       ├── Courses.jsx    ← MCA courses
│       │       ├── Testimonials.jsx ← Student reviews
│       │       └── Contact.jsx    ← Contact info
│       └── pages/
│           ├── Home.jsx           ← Home page
│           ├── Register.jsx       ← Registration form
│           ├── Exam.jsx           ← Online exam
│           └── Interview.jsx      ← Online interview
```

### 6.2 Key Implementation Details

#### 6.2.1 Routing (App.jsx)
```jsx
<BrowserRouter>
  <Routes>
    <Route path="/"          element={<Home />} />
    <Route path="/register"  element={<Register />} />
    <Route path="/exam"      element={<Exam />} />
    <Route path="/interview" element={<Interview />} />
  </Routes>
</BrowserRouter>
```

#### 6.2.2 Animated Counter Hook (Hero.jsx)
```jsx
function useCounter(ref, target, suffix) {
  useEffect(() => {
    let count = 0;
    const step = Math.ceil(target / 60);
    const interval = setInterval(() => {
      count += step;
      if (count >= target) { count = target; clearInterval(interval); }
      if (ref.current) ref.current.textContent = count + suffix;
    }, 30);
    return () => clearInterval(interval);
  }, []);
}
```

#### 6.2.3 Exam Timer (Exam.jsx)
```jsx
useEffect(() => {
  if (phase !== 'exam') return;
  timerRef.current = setInterval(() => {
    setTimeLeft(t => {
      if (t <= 1) { clearInterval(timerRef.current); submitExam(); return 0; }
      return t - 1;
    });
  }, 1000);
  return () => clearInterval(timerRef.current);
}, [phase]);
```

#### 6.2.4 Result Calculation (Exam.jsx)
```jsx
examQuestions.forEach((q, i) => {
  if (answers[i] === null) skipped++;
  else if (answers[i] === q.ans) correct++;
  else wrong++;
});
const score = correct * 3;
const pct = Math.round((score / 90) * 100);
const passed = pct >= 50;
```

#### 6.2.5 Multi-Step Form Validation (Register.jsx)
```jsx
const validate = (s) => {
  const required = {
    1: ['firstName','lastName','dob','gender','email','mobile','address','state','category'],
    2: ['degree','gradYear','gradPercent','university','twelfthPercent','tenthPercent','specialization'],
  };
  const errs = {};
  (required[s] || []).forEach(k => { if (!form[k]) errs[k] = true; });
  setErrors(errs);
  return Object.keys(errs).length === 0;
};
```

#### 6.2.6 Countdown Timer Hook (Interview.jsx)
```jsx
function useCountdown(targetDate) {
  const [time, setTime] = useState({ d:'00', h:'00', m:'00', s:'00' });
  useEffect(() => {
    const id = setInterval(() => {
      const diff = targetDate - new Date();
      setTime({
        d: String(Math.floor(diff / 86400000)).padStart(2,'0'),
        h: String(Math.floor((diff % 86400000) / 3600000)).padStart(2,'0'),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2,'0'),
        s: String(Math.floor((diff % 60000) / 1000)).padStart(2,'0'),
      });
    }, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
}
```

---

---

## 7. KEY FUNCTIONALITIES

### 7.1 Home Page

| Feature | Description |
|---------|-------------|
| Animated Hero Section | Full-screen hero with gradient background, animated particle-like glow effects |
| Counter Animation | Live counting animation for Students Enrolled (5240+), Exams Conducted (128+), Success Rate (94%) |
| About Section | Institutional overview with feature cards (Secure Exam, Real-time Results, Online Interview, Certification) |
| 3-Step Process | Visual cards explaining Register → Exam → Interview workflow |
| MCA Specializations | 6 course cards: AI/ML, Cloud Computing, Cybersecurity, Data Science, Full Stack Dev, Mobile Dev |
| Testimonials | Dot-navigation carousel with 3 student testimonials |
| Contact Section | Address, phone, and email contact cards |
| Responsive Navbar | Sticky navbar with scroll effect, smooth scroll to sections, mobile hamburger menu |

### 7.2 Registration Page (/register)

| Feature | Description |
|---------|-------------|
| 4-Step Wizard | Step 1: Personal Info → Step 2: Academic Info → Step 3: Documents → Step 4: Review & Submit |
| Step Indicators | Visual progress bar showing active, completed, and pending steps |
| Form Validation | Required field validation on each step before proceeding |
| Personal Info Fields | First Name, Last Name, DOB, Gender, Email, Mobile, Address, State, Category |
| Academic Info Fields | Degree, Graduation Year, Percentage/CGPA, University, 12th %, 10th %, Specialization |
| Document Upload | Passport Photo, Signature, Graduation Certificate, ID Proof (Aadhar/PAN) |
| Review Screen | Summary of all entered data before final submission |
| Success Modal | Displays unique Registration ID (e.g., ILTS-2026-XXXXX) on successful submission |
| LocalStorage Save | Saves Registration ID and Name for use in Exam and Interview pages |

### 7.3 Exam Page (/exam)

| Feature | Description |
|---------|-------------|
| Pre-Exam Screen | Instructions, exam info grid (30 questions, 30 mins, 90 marks, 50% cutoff), Registration ID entry |
| 30 MCQ Questions | 10 Programming + 10 DBMS + 10 Aptitude questions |
| 30-Minute Timer | Countdown timer with red warning animation when ≤ 5 minutes remain |
| Auto-Submit | Exam automatically submits when timer reaches zero |
| Question Navigation | Previous/Next buttons + question palette for direct navigation |
| Mark for Review | Students can flag questions for later review (shown in orange on palette) |
| Question Palette | Color-coded palette: Green (answered), Orange (review), Purple (current), Grey (unanswered) |
| Progress Bar | Visual progress bar showing current question position |
| Submit Confirmation | Modal asking confirmation before final submission |
| Result Screen | Score circle, correct/wrong/skipped counts, pass/fail status |
| Conditional Redirect | Pass → Interview page, Fail → Home page |

### 7.4 Interview Page (/interview)

| Feature | Description |
|---------|-------------|
| Info Cards | Duration (15-20 min), Panel (2-3 faculty), Mode (Video), Marks (50 points) |
| Schedule Lookup | Enter Registration ID to fetch interview schedule |
| Schedule Details | Candidate name, date, time slot, panel name, status badge |
| Live Countdown | Real-time countdown timer (Days, Hours, Minutes, Seconds) to interview |
| System Check | Automated checks for Camera, Microphone, Internet, Browser with pass/fail status |
| Interview Tips | 6 preparation tips for candidates |
| Topics to Prepare | 10 topic tags: Data Structures, OOP, DBMS, OS, Networking, etc. |
| Virtual Interview Room | Simulated video room with panel video placeholder and self-view |
| In-Room Chat | Real-time chat panel with send on Enter key |
| Media Controls | Mic toggle, Camera toggle, Screen share button, End call button |

---

---

## 8. OUTPUT AND SCREENSHOTS (DESCRIPTION)

### Screen 1 — Home Page (Hero Section)
- Dark gradient background (deep navy to purple)
- "MCA Entrance Examination 2026" badge
- Main heading: "Welcome to ILTS" with gradient text
- Two CTA buttons: "Register for Exam" and "How It Works"
- Three animated counters: 5240+ Students, 128+ Exams, 94% Success Rate

### Screen 2 — Home Page (About Section)
- Left: University campus image with "Trusted by 5000+ Students" badge overlay
- Right: Section heading, description paragraph, 4 feature cards in 2×2 grid

### Screen 3 — Home Page (Process Section)
- Three process cards with large background numbers (01, 02, 03)
- Each card has a gradient icon circle, title, description, and action button
- Hover effect lifts cards with purple glow shadow

### Screen 4 — Home Page (Courses Section)
- 6 course cards in a 3-column responsive grid
- Each card has a colored icon, title, description, seat count, and Apply button

### Screen 5 — Registration Page (Step 1 — Personal Info)
- Page header with step progress indicators
- Dark form card with custom-styled inputs
- Fields: First Name, Last Name, DOB, Gender, Email, Mobile, Address, State, Category
- Red border highlight on invalid fields

### Screen 6 — Registration Page (Step 2 — Academic Info)
- Fields: Degree, Graduation Year, Percentage, University, 12th %, 10th %, Specialization
- Back and Next navigation buttons

### Screen 7 — Registration Page (Step 3 — Documents)
- 4 dashed upload boxes with icons
- Green border and checkmark on successful file selection

### Screen 8 — Registration Page (Step 4 — Review & Submit)
- Full data summary in a review table
- Terms & Conditions checkbox
- Submit Application button

### Screen 9 — Registration Success Modal
- Green checkmark icon
- "Registration Successful!" heading
- Unique Registration ID displayed (e.g., ILTS-2026-47823)
- "Proceed to Exam" button

### Screen 10 — Exam Page (Pre-Exam Screen)
- Exam info grid (4 tiles)
- Yellow-bordered instructions box
- Registration ID input field
- "Start Exam" button

### Screen 11 — Exam Page (Active Exam)
- Top bar: ILTS logo, subject badge, red countdown timer, answered count
- Left panel: Question text, 4 option items with A/B/C/D labels
- Right panel: Color-coded question palette (30 buttons), Submit button
- Progress bar below question number

### Screen 12 — Exam Page (Result — Pass)
- Gold trophy icon
- "Congratulations! You Passed!" heading
- Score circle with conic gradient (e.g., 63/90 — 70%)
- Correct/Wrong/Skipped stats in 3 boxes
- Green success alert + "Go to Interview" button

### Screen 13 — Exam Page (Result — Fail)
- Red X circle icon
- "Better Luck Next Time" heading
- Score circle showing below 50%
- Red alert + "Back to Home" button

### Screen 14 — Interview Page (Schedule Check)
- 4 info cards at top
- Registration ID input with Check button
- Schedule details card (name, date, time, panel)
- Live countdown timer in 4 boxes

### Screen 15 — Interview Page (System Check)
- 4 check items with spinner → green checkmark animation
- "Run System Check" button
- "Join Interview Room" button

### Screen 16 — Virtual Interview Room
- Full-width modal overlay
- Large panel video placeholder (Dr. Sharma — Speaking badge)
- Small self-view video box
- Chat panel with message history
- Control bar: Mic, Camera, Screen Share, End Call buttons
- LIVE red badge in header

---

---

## 9. DATABASE / LOCALSTORAGE

Since this is a frontend-only application, data persistence is handled using the **browser's LocalStorage API** instead of a traditional database.

### 9.1 LocalStorage Keys

| Key | Type | Value Example | Set In | Read In |
|-----|------|---------------|--------|---------|
| `ilts_reg_id` | String | `"ILTS-2026-47823"` | Register.jsx | Exam.jsx, Interview.jsx |
| `ilts_name` | String | `"Priya Sharma"` | Register.jsx | Interview.jsx |

### 9.2 LocalStorage Operations

```javascript
// Writing (Register.jsx — on form submit)
localStorage.setItem('ilts_reg_id', 'ILTS-2026-47823');
localStorage.setItem('ilts_name', 'Priya Sharma');

// Reading (Interview.jsx — on schedule check)
const name = localStorage.getItem('ilts_name') || 'Candidate';
```

### 9.3 In-Memory State (React useState)

All exam and form data is managed in React component state during the session:

| State Variable | Component | Type | Purpose |
|----------------|-----------|------|---------|
| `form` | Register.jsx | Object | All registration form fields |
| `step` | Register.jsx | Number | Current form step (1–4) |
| `answers` | Exam.jsx | Array[30] | Selected option index per question |
| `marked` | Exam.jsx | Array[30] | Review-marked questions |
| `timeLeft` | Exam.jsx | Number | Remaining seconds |
| `phase` | Exam.jsx | String | 'pre' / 'exam' / 'result' |
| `result` | Exam.jsx | Object | score, correct, wrong, skipped |
| `schedule` | Interview.jsx | Object | Interview schedule details |
| `messages` | Interview.jsx | Array | Chat messages in interview room |

### 9.4 Future Database Integration (Recommended)

For a production system, the following database schema is recommended:

```sql
-- Students Table
CREATE TABLE students (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  reg_id      VARCHAR(20) UNIQUE NOT NULL,
  first_name  VARCHAR(50),
  last_name   VARCHAR(50),
  email       VARCHAR(100) UNIQUE,
  mobile      VARCHAR(15),
  dob         DATE,
  gender      VARCHAR(10),
  category    VARCHAR(10),
  state       VARCHAR(50),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Academic Details Table
CREATE TABLE academic_details (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  student_id    INT REFERENCES students(id),
  degree        VARCHAR(100),
  grad_year     INT,
  grad_percent  VARCHAR(20),
  university    VARCHAR(200),
  specialization VARCHAR(100)
);

-- Exam Results Table
CREATE TABLE exam_results (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  student_id  INT REFERENCES students(id),
  score       INT,
  correct     INT,
  wrong       INT,
  skipped     INT,
  percentage  DECIMAL(5,2),
  status      ENUM('PASS','FAIL'),
  exam_date   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Interview Schedule Table
CREATE TABLE interview_schedule (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  student_id    INT REFERENCES students(id),
  interview_date DATE,
  time_slot     VARCHAR(30),
  panel         VARCHAR(100),
  status        ENUM('Scheduled','Completed','Cancelled')
);
```

---

---

## 10. CONCLUSION

The **ILTS Online MCA Entrance Examination Portal** successfully demonstrates a complete, end-to-end digital admission system built using modern web technologies. The project achieves all its stated objectives:

1. **Complete Digitization** — The entire admission workflow from registration to interview is handled online without any paper-based process.

2. **User-Friendly Interface** — The dark-themed, gradient-rich UI with smooth animations provides an engaging and professional experience for MCA aspirants.

3. **Robust Exam System** — The 30-question MCQ exam with a real-time countdown timer, question palette, mark-for-review feature, and auto-submission ensures a fair and controlled examination environment.

4. **Instant Results** — Scores are calculated and displayed immediately after submission, eliminating the wait time associated with manual evaluation.

5. **Interview Integration** — The virtual interview room with system checks, countdown timer, and chat functionality provides a complete interview experience.

6. **React Component Architecture** — The project is built using reusable React components, making it maintainable, scalable, and easy to extend.

7. **Responsive Design** — The portal works seamlessly across all screen sizes using Bootstrap 5's grid system and custom CSS media queries.

### Future Enhancements

- Backend integration with Node.js/Express and MySQL/MongoDB
- JWT-based authentication and secure login
- Admin dashboard for managing students, questions, and results
- Email notifications for registration confirmation and results
- Video proctoring using WebRTC for anti-cheating
- Payment gateway integration for exam fees
- Question bank management with randomization
- PDF generation for hall tickets and result certificates

---

---

## 11. REFERENCES

### Books
1. Flanagan, D. (2020). *JavaScript: The Definitive Guide* (7th ed.). O'Reilly Media.
2. Banks, A., & Porcello, E. (2020). *Learning React* (2nd ed.). O'Reilly Media.
3. Wieruch, R. (2022). *The Road to React*. Self-published.

### Official Documentation
4. React Documentation — https://react.dev
5. React Router Documentation — https://reactrouter.com
6. Vite Documentation — https://vitejs.dev
7. Bootstrap 5 Documentation — https://getbootstrap.com/docs/5.3
8. Font Awesome Icons — https://fontawesome.com
9. MDN Web Docs (JavaScript) — https://developer.mozilla.org
10. MDN Web Docs (LocalStorage API) — https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

### Online Resources
11. freeCodeCamp — https://www.freecodecamp.org
12. W3Schools React Tutorial — https://www.w3schools.com/react
13. CSS-Tricks — https://css-tricks.com
14. Stack Overflow — https://stackoverflow.com

### npm Packages Used
15. react@19.2.4 — https://www.npmjs.com/package/react
16. react-dom@19.2.4 — https://www.npmjs.com/package/react-dom
17. react-router-dom@7.14.0 — https://www.npmjs.com/package/react-router-dom
18. vite@8.0.4 — https://www.npmjs.com/package/vite

---

*End of Project Report*

**ILTS — Institute of Language & Technology Studies**
**Online MCA Entrance Examination Portal**
**© 2026 All Rights Reserved**
