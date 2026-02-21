# PlacementPro — Integrated Campus Career Suite

> A role-based web application built for MCA Track 2 (TRACK-2) problem statement.

---

## Project Structure

```
placementpro/
├── public/
│   └── index.html                    # HTML entry point (Google Fonts loaded here)
├── src/
│   ├── index.js                      # React DOM render entry
│   ├── index.css                     # Global styles, CSS variables, animations
│   ├── App.js                        # Root app: view routing + AppProvider
│   │
│   ├── context/
│   │   └── AppContext.js             # Global state (drives, students, alumni, notifications)
│   │
│   ├── data/
│   │   └── mockData.js               # Mock students, drives, alumni, bot KB, market skills
│   │
│   ├── components/
│   │   ├── shared/
│   │   │   ├── Sidebar.js            # Left navigation + role switcher
│   │   │   └── UI.js                 # Reusable: Card, Btn, PageHeader, Modal, Field, Badge, etc.
│   │   │
│   │   ├── tpo/
│   │   │   ├── TPODrives.js          # Create drives + criteria engine + notify eligible
│   │   │   ├── TPOStudents.js        # Student database table with search & filter
│   │   │   ├── InterviewScheduler.js # Drag-and-drop time slot assignment
│   │   │   └── TPOAnalytics.js       # Recharts: bar, pie, skill analysis
│   │   │
│   │   ├── student/
│   │   │   ├── StudentFeed.js        # Personalized eligible drives feed
│   │   │   ├── ApplicationTracker.js # Pipeline tracker with status update
│   │   │   ├── ResumeWizard.js       # Multi-step form → college-branded resume preview
│   │   │   ├── SkillGapAnalysis.js   # Market skill comparison + learning path
│   │   │   └── PlacementBot.js       # Chatbot with knowledge base + typing indicator
│   │   │
│   │   └── alumni/
│   │       ├── AlumniJobs.js         # Job referral board (post & refer)
│   │       └── AlumniMentorship.js   # Mentor slot booking system
│
└── package.json
```

---

## Features Implemented

### 1. TPO Admin Dashboard
| Feature | File |
|---|---|
| Criteria Engine (CGPA, Backlogs, Branch filter) | `TPODrives.js` |
| One-click "Notify All Eligible" | `TPODrives.js` + `AppContext.js` |
| Create Drive with rounds & venue | `TPODrives.js` |
| Interview drag-and-drop scheduler | `InterviewScheduler.js` |
| Student database with search | `TPOStudents.js` |
| Analytics with charts | `TPOAnalytics.js` |

### 2. Student Portal
| Feature | File |
|---|---|
| Personalized opportunity feed | `StudentFeed.js` |
| Application tracker with pipeline | `ApplicationTracker.js` |
| Multi-step Resume Wizard + PDF preview | `ResumeWizard.js` |
| Skill Gap Analysis vs market roles | `SkillGapAnalysis.js` |
| PlacementBot 24/7 chatbot | `PlacementBot.js` |

### 3. Alumni Portal
| Feature | File |
|---|---|
| Job Referral Board | `AlumniJobs.js` |
| Mentorship slot booking | `AlumniMentorship.js` |

---

## Setup & Run

```bash
# 1. Clone or extract the project
cd placementpro

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

Open http://localhost:3000

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 |
| State Management | React Context API |
| Charts | Recharts |
| Routing | View-based state (no react-router needed) |
| Styling | CSS Variables + Inline styles |
| Fonts | Syne (display), DM Sans (body), JetBrains Mono |
| Icons | Emoji (no extra library needed) |

---

## Role Simulation

The sidebar lets you switch between three portals:
- **TPO Admin** — Manage drives, students, scheduler, analytics
- **Student** — Logged in as Aarav Sharma (CS, CGPA 8.2)
- **Alumni** — Logged in as Divya Rao (Google)

In a real app, these would be separated by authentication.

---

## Bonus Features Implemented
- ✅ Skill Gap Analysis with personalized learning paths
- ✅ PlacementBot with natural language understanding
- ✅ Drag-and-drop interview scheduler
- ✅ Real-time analytics dashboard with Recharts
- ✅ Alumni mentorship slot booking
- ✅ Resume Wizard with multi-step form + live preview
