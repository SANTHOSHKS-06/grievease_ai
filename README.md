# GrievEase - AI-Powered College Grievance Platform

A modern, responsive, frontend-only prototype for college grievance reporting, instant AI neural triage, real-time stepper tracking, and administrative analytics.

Built with **React + Vite + Tailwind CSS + Recharts + React Router**.

---

## 🚀 Key Features & Screens

### 1. Landing Page (`/`)
- **Indigo Hero Section**: Vibrant gradient backdrop with glow orbs, value propositions, and dynamic campus metrics.
- **Direct Action Buttons**: "Submit Grievance" and "Admin Login".
- **Quick Ticket Tracker**: Fast search bar directly on the landing page with one-click sample tickets (`GRV-2026-101`, `GRV-2026-103`, `GRV-2026-108`).
- **Interactive Pillars**: 3-step visual workflow explaining how concerns are voiced, classified by AI, and resolved.
- **Domain Coverage**: Visual category grid highlighting recent cases across Hostel, Mess, Academics, Transport, Lab, and Library.

### 2. Grievance Submission with AI Triage (`/submit`)
- **Form Controls**:
  - Category selector (Hostel, Mess, Academics, Transport, Lab, Library, Sanitation, Infrastructure).
  - Quick test scenario preset chips (Hostel electrical shock, Mess food hygiene, Transport delays) to test in 1 click.
  - Title and detailed description inputs.
  - Anonymous toggle switch to protect student identity from faculty and wardens.
- **Faked AI Analysis Loading State**:
  - Animated neural scanning progress with step-by-step telemetry ("Scanning grievance syntax...", "Classifying campus operational category...", "Evaluating sentiment polarity & priority rating...").
- **Post-Analysis Result Screen**:
  - Auto-detected Category with confidence score (e.g., `Hostel • 98% Confidence`).
  - Sentiment analysis badge (`Negative / Frustrated`, `Neutral`, or `Positive`).
  - Triage Priority rating (`Critical`, `High`, `Medium`, `Low`).
  - Generated cryptographic Ticket ID (e.g., `GRV-2026-482`) with one-click clipboard copy.
  - Direct "Track Status in Real-Time Stepper" transition button.

### 3. Real-Time Status Stepper (`/track`)
- **Lookup by Ticket ID**: Supports direct input and URL query parameter (`/track?id=GRV-2026-101`).
- **Visual Stepper Stages**:
  1. **Submitted**: AI classified & recorded.
  2. **In Review**: Assigned to departmental field team for inspection.
  3. **Resolved**: Rectified on-site and verified closed.
- **Comprehensive Case Dossier**: Full student description, assigned administrative division, campus location, anonymity status, and milestone audit log.

### 4. Admin Dashboard (`/admin`)
- **Mock Authentication**: Pre-filled admin credentials (`admin@college.edu` / `admin123`) with a 1-click **Instant Demo Login** button.
- **5 KPI Summary Cards**:
  - Total Tickets
  - Under Active Review
  - Resolved Tickets & Resolution Rate %
  - Critical / High Priority Escalations
  - Average SLA Turnaround (1.8 Days)
- **3 Responsive Recharts Visualizations**:
  - **Category Breakdown**: Multi-colored bar chart showing distribution across campus branches.
  - **AI Sentiment Distribution**: Donut chart analyzing emotional polarity (Negative, Neutral, Positive).
  - **Weekly Grievance Trend**: Smooth indigo and emerald dual-area gradient chart tracking logged vs resolved volume.
- **Filterable & Searchable Table**:
  - Real-time text search (by ID, title, student name).
  - Dropdown filters for Category, Status, and Priority.
  - **Interactive Status Selector**: Admins can immediately switch any ticket between *Submitted*, *In Review*, and *Resolved*. Updates reflect instantly in state, persist in `localStorage`, and reflect live on the Student Stepper!
  - **Ticket Inspection Drawer**: Deep-dive modal with complete AI decision rationale and milestone timeline.

---

## 🛠️ Project Structure

```
f:/ebi/
├── index.html                    # HTML entry with Google Fonts (Plus Jakarta Sans, Inter)
├── package.json                  # Dependencies (React, React Router, Recharts, Lucide, Tailwind)
├── tailwind.config.js            # Tailwind v3 setup with indigo color system
├── postcss.config.js             # PostCSS configuration
├── src/
│   ├── main.jsx                  # React application root
│   ├── App.jsx                   # React Router route configuration
│   ├── App.css                   # Custom animation keyframes
│   ├── index.css                 # Tailwind directives & base styling
│   ├── context/
│   │   └── GrievanceContext.jsx  # LocalStorage state management & admin session
│   ├── data/
│   │   └── grievances.json       # 20 realistic college grievances
│   ├── utils/
│   │   └── aiSimulator.js        # Heuristic NLP engine for category, sentiment & priority
│   ├── components/
│   │   ├── Navbar.jsx            # Responsive navigation header
│   │   └── Footer.jsx            # Footer with one-click data reset button
│   └── pages/
│       ├── LandingPage.jsx       # Screen 1: Hero, metrics & quick track
│       ├── SubmitGrievance.jsx   # Screen 2: Submit form & AI analysis simulation
│       ├── TrackGrievance.jsx    # Screen 3: 3-step live stepper & audit log
│       └── AdminDashboard.jsx    # Screen 4: Mock login, KPIs, 3 Recharts & table
```

---

## 💻 Run Instructions

### Option A: One-Click Quick Launch (Windows)
Double-click `start.bat` or run:
```cmd
start.bat
```
This script will automatically:
1. Verify Node.js installation.
2. Install `node_modules` if not already installed (`npm install`).
3. Start the Vite development server and automatically open your default browser to `http://localhost:5173`.

---

### Option B: Manual Command Line
1. **Install Dependencies**:
```bash
npm install
```

2. **Start Development Server**:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production (Optional)
```bash
npm run build
npm run preview
```

---

## 🔑 Demo Admin Credentials
- **Email**: `admin@college.edu`
- **Password**: `admin123`
*(Or simply click the **"One-Click Instant Demo Login"** button on the admin page)*
