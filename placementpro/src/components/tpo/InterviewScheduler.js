import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, PageHeader, Btn, Badge } from '../shared/UI';

const TIME_SLOTS = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'];

export default function InterviewScheduler() {
  const { drives, students, getEligibleStudents } = useApp();
  const [selectedDrive, setSelectedDrive] = useState(drives[0]?.id || null);
  const [assignments, setAssignments] = useState({});
  const [drag, setDrag] = useState(null);

  const drive = drives.find(d => d.id === selectedDrive);
  const eligible = drive ? getEligibleStudents(drive) : [];

  const assigned = Object.values(assignments);
  const unassigned = eligible.filter(s => !assigned.find(a => a.studentId === s.id));

  const handleDrop = (slot) => {
    if (!drag) return;
    // Check if slot already taken
    if (assignments[slot]) return;
    setAssignments(prev => ({
      ...prev,
      [slot]: { studentId: drag.id, studentName: drag.name, slot },
    }));
    setDrag(null);
  };

  const removeAssignment = (slot) => {
    setAssignments(prev => {
      const updated = { ...prev };
      delete updated[slot];
      return updated;
    });
  };

  return (
    <div className="animate-fadeup">
      <PageHeader
        title="Interview Scheduler"
        subtitle="Drag and drop students into time slots to assign interviews"
      />

      {/* Drive Selector */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        {drives.map(d => (
          <button
            key={d.id}
            onClick={() => { setSelectedDrive(d.id); setAssignments({}); }}
            style={{
              padding: '8px 16px', borderRadius: 9, fontSize: 13, fontWeight: 600,
              border: `1px solid ${selectedDrive === d.id ? 'var(--accent)' : 'var(--border)'}`,
              background: selectedDrive === d.id ? 'var(--accent)' : 'transparent',
              color: selectedDrive === d.id ? '#fff' : 'var(--muted)',
              cursor: 'pointer',
            }}
          >{d.company}</button>
        ))}
      </div>

      {drive && (
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>
          {/* Student pool */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
              Eligible Students ({unassigned.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {unassigned.map(s => (
                <div
                  key={s.id}
                  draggable
                  onDragStart={() => setDrag(s)}
                  onDragEnd={() => setDrag(null)}
                  style={{
                    background: drag?.id === s.id ? 'var(--accent)' : 'var(--card)',
                    border: `1px solid ${drag?.id === s.id ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 9, padding: '10px 12px',
                    cursor: 'grab', transition: 'all 0.15s',
                    fontSize: 13,
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{s.name}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 11, marginTop: 2 }}>
                    {s.branch} • {s.cgpa} CGPA
                  </div>
                </div>
              ))}
              {unassigned.length === 0 && (
                <div style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
                  All students assigned!
                </div>
              )}
            </div>
          </div>

          {/* Time slots */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
              Interview Slots — {drive.date || 'Date TBD'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {TIME_SLOTS.map(slot => {
                const asgn = assignments[slot];
                return (
                  <div
                    key={slot}
                    onDragOver={e => { e.preventDefault(); }}
                    onDrop={() => handleDrop(slot)}
                    style={{
                      border: `2px dashed ${asgn ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: 10, padding: '12px 14px', minHeight: 80,
                      background: asgn ? '#1e1b4b' : 'var(--card2)',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 6 }}>{slot}</div>
                    {asgn ? (
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: '#a5b4fc' }}>{asgn.studentName}</div>
                        <button
                          onClick={() => removeAssignment(slot)}
                          style={{ fontSize: 11, color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 4, padding: 0 }}
                        >✕ Remove</button>
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: 'var(--muted2)' }}>Drop student here</div>
                    )}
                  </div>
                );
              })}
            </div>

            {Object.keys(assignments).length > 0 && (
              <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
                <Btn>💾 Save Schedule</Btn>
                <Btn variant="secondary" onClick={() => setAssignments({})}>Clear All</Btn>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
