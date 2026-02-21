import React, { createContext, useContext, useState } from 'react';
import { STUDENTS, DRIVES_INIT, ALUMNI, JOB_REFERRALS_INIT } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [role, setRole] = useState('tpo'); // 'tpo' | 'student' | 'alumni'
  const [students, setStudents] = useState(STUDENTS);
  const [drives, setDrives] = useState(DRIVES_INIT);
  const [alumni, setAlumni] = useState(ALUMNI);
  const [jobReferrals, setJobReferrals] = useState(JOB_REFERRALS_INIT);
  const [notifications, setNotifications] = useState([]);

  // Logged-in student simulation (student[0])
  const currentStudent = students[0];
  // Logged-in alumni simulation (alumni[0])
  const currentAlumni = alumni[0];

  const addDrive = (drive) => {
    setDrives(prev => [...prev, { ...drive, id: Date.now() }]);
  };

  const notifyStudents = (driveId) => {
    const drive = drives.find(d => d.id === driveId);
    if (!drive) return;
    const eligible = students.filter(s =>
      s.cgpa >= drive.minCGPA &&
      s.backlogs <= drive.maxBacklogs &&
      drive.branches.includes(s.branch)
    );
    const newNotifs = eligible.map(s => ({
      id: Date.now() + s.id,
      studentId: s.id,
      driveId,
      message: `You are eligible for ${drive.company} – ${drive.role}. Apply now!`,
      time: new Date().toLocaleTimeString(),
      read: false,
    }));
    setNotifications(prev => [...prev, ...newNotifs]);
    return eligible.length;
  };

  const updateApplicationStatus = (studentId, driveId, status) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      const apps = s.applications.map(a =>
        a.driveId === driveId ? { ...a, status } : a
      );
      const exists = apps.find(a => a.driveId === driveId);
      return {
        ...s,
        applications: exists ? apps : [...apps, { driveId, status }],
      };
    }));
  };

  const getEligibleStudents = (drive) => {
    return students.filter(s =>
      s.cgpa >= drive.minCGPA &&
      s.backlogs <= drive.maxBacklogs &&
      drive.branches.includes(s.branch)
    );
  };

  const addJobReferral = (job) => {
    setJobReferrals(prev => [...prev, { ...job, id: Date.now(), posted: 'Just now', applicants: 0 }]);
  };

  const bookMentorSlot = (alumniId, slotId) => {
    setAlumni(prev => prev.map(a => {
      if (a.id !== alumniId) return a;
      return {
        ...a,
        slots: a.slots.map(s => s.id === slotId ? { ...s, booked: true } : s),
      };
    }));
  };

  return (
    <AppContext.Provider value={{
      role, setRole,
      students, setStudents,
      drives, addDrive,
      alumni, currentAlumni,
      jobReferrals, addJobReferral,
      notifications,
      currentStudent,
      notifyStudents,
      updateApplicationStatus,
      getEligibleStudents,
      bookMentorSlot,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
