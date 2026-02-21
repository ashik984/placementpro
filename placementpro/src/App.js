import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/shared/Sidebar';

// TPO
import TPODrives from './components/tpo/TPODrives';
import TPOStudents from './components/tpo/TPOStudents';
import InterviewScheduler from './components/tpo/InterviewScheduler';
import TPOAnalytics from './components/tpo/TPOAnalytics';

// Student
import StudentFeed from './components/student/StudentFeed';
import ApplicationTracker from './components/student/ApplicationTracker';
import ResumeWizard from './components/student/ResumeWizard';
import SkillGapAnalysis from './components/student/SkillGapAnalysis';
import PlacementBot from './components/student/PlacementBot';

// Alumni
import AlumniJobs from './components/alumni/AlumniJobs';
import AlumniMentorship from './components/alumni/AlumniMentorship';

const VIEW_MAP = {
  // TPO
  drives: TPODrives,
  students: TPOStudents,
  scheduler: InterviewScheduler,
  analytics: TPOAnalytics,
  // Student
  feed: StudentFeed,
  tracker: ApplicationTracker,
  resume: ResumeWizard,
  skillgap: SkillGapAnalysis,
  bot: PlacementBot,
  // Alumni
  jobs: AlumniJobs,
  mentorship: AlumniMentorship,
};

function AppContent() {
  const [view, setView] = useState('drives');
  const ViewComponent = VIEW_MAP[view] || TPODrives;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar view={view} setView={setView} />
      <main style={{ flex: 1, overflowY: 'auto', padding: '36px 40px', maxWidth: 'calc(100vw - 240px)' }}>
        <ViewComponent />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
