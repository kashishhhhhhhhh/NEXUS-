# NEXUS — Next-Generation Educational eXperience & Unified System

Built on top of the existing Online Exam React + Vite project.  
All original Online Exam pages (Home, Register, Exam, Interview) are **untouched**.

---

## Quick Start

```bash
cd ilts-website/ilts-react
npm install
npm run dev
```

Open `http://localhost:5173`

---

## Access NEXUS

From the Online Exam home navbar, click **NEXUS** → or go directly to:

```
http://localhost:5173/nexus/login
```

### Demo Credentials

| Role    | Username  | Password    |
|---------|-----------|-------------|
| Admin   | admin     | admin123    |
| Faculty | faculty   | faculty123  |
| Student | student   | student123  |

---

## Features by Role

### Admin
- Dashboard with KPIs, enrollment trend, grade distribution, fee charts
- Student CRUD (add, view, delete, search, filter)
- Faculty CRUD (add, view, delete)
- Course management (add, edit, delete)
- Attendance marking (per subject, per date)
- Marks entry and review
- Fee management (record payments, CSV export)
- Full analytics dashboard
- ML Insights (at-risk detection, forecasts)

### Faculty
- Dashboard with student performance charts
- View students, mark attendance, enter marks
- Analytics and ML Insights

### Student
- Personal dashboard (CGPA, attendance, fee status)
- Profile page
- Attendance records
- Results / marks
- Fee details with payment progress ring

---

## ML Features (Frontend Implementation)

Since no Python backend is running, all ML is implemented in JS:

| Feature | Method | Location |
|---------|--------|----------|
| Performance Prediction | Weighted linear model (attendance 40% + CGPA 60%) | `src/data/nexusData.js → predictPerformance()` |
| At-Risk Detection | Threshold-based on predicted CGPA | `detectAtRisk()` |
| Enrollment Forecast | Static sample forecast data | `ENROLLMENT_FORECAST` |

In production, replace these with calls to a **FastAPI** endpoint:
```
GET /api/ml/predict?student_id=NX001
GET /api/ml/forecast?months=3
GET /api/ml/at-risk
```

---

## Project Structure (new files)

```
src/
├── context/
│   └── AuthContext.jsx          # Login / logout / role state
├── data/
│   └── nexusData.js             # All sample data + ML functions
├── components/nexus/
│   └── DashboardLayout.jsx      # Sidebar + topbar layout
├── pages/nexus/
│   ├── Login.jsx
│   ├── Dashboard.jsx            # Role-aware dashboard
│   ├── Students.jsx
│   ├── Faculty.jsx
│   ├── Courses.jsx
│   ├── Attendance.jsx
│   ├── Marks.jsx
│   ├── Fees.jsx
│   ├── Analytics.jsx
│   ├── MLInsights.jsx
│   └── Profile.jsx
├── nexus.css                    # Additive styles only (index.css untouched)
└── App.jsx                      # Extended with /nexus/* routes
```

---

## Design

- Reuses the same dark palette: `#0a0a1a` / `#0f0f2e` / `#050510`
- Same indigo-purple accent: `#6366f1` → `#a855f7`
- Same `.btn-gradient`, `.text-gradient`, `.form-card`, `.modal-overlay` etc.
- `nexus.css` only adds new component classes; `index.css` is never modified

---

## Backend (FastAPI — wiring guide)

When ready to connect a real backend:

1. Run FastAPI on `http://localhost:8000`
2. Add `proxy: { '/api': 'http://localhost:8000' }` to `vite.config.js`
3. Replace the static data imports in each page with `fetch('/api/...')` calls
4. Database: PostgreSQL with tables matching the data shapes in `nexusData.js`

### Sample tables
```sql
users, students, faculty, courses, attendance, marks, fees
```
