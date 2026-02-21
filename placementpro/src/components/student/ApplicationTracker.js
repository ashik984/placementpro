import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, PageHeader, Btn, Badge } from '../shared/UI';

const STAGES = ['Applied', 'Aptitude', 'GD', 'Interview Scheduled', 'Selected', 'Rejected'];
const STAGE_COLORS = {
  Applied: 'blue', Aptitude: 'yellow', GD: 'purple',
  'Interview Scheduled': 'cyan', Selected: 'green', Rejected: 'red',
};

export default function ApplicationTracker() {
  const { currentStudent, drives, updateApplicationStatus } = useApp();
  const [localApps, setLocalApps] = useState(
    currentStudent.applications.map(a => {
      const drive = drives.find(d => d.id === a.driveId);
      return { ...a, company: drive?.company || 'Unknown', role: drive?.role, package: drive?.package };
    })
  );

  const handleStatusChange = (driveId, status) => {
    setLocalApps(prev => prev.map(a => a.driveId === driveId ? { ...a, status } : a));
    updateApplicationStatus(currentStudent.id, driveId, status);
  };

  const stageIndex = (status) => STAGES.indexOf(status);

  return (
    <div className="animate-fadeup">
      <PageHeader
        title="Application Tracker"
        subtitle="Track your application status across all companies"
      />

      {/* Pipeline overview */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 14 }}>Hiring Pipeline</div>
        <div style={{ display: 'flex', gap: 0, position: 'relative' }}>
          {STAGES.slice(0, 5).map((stage, i) => {
            const count = localApps.filter(a => STAGES.indexOf(a.status) >= i && a.status !== 'Rejected').length;
            return (
              <div key={stage} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                <div style={{
                  height: 8, background: i === 0 ? 'var(--accent)' : i < 3 ? 'var(--accent2)' : 'var(--green)',
                  opacity: count > 0 ? 1 : 0.15,
                  borderRadius: i === 0 ? '4px 0 0 4px' : i === 4 ? '0 4px 4px 0' : 0,
                }} />
                <div style={{ marginTop: 8, fontSize: 11, color: 'var(--muted)', fontWeight: 500 }}>{stage}</div>
                {count > 0 && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 800, color: 'var(--accent)' }}>{count}</div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Applications list */}
      {localApps.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <div style={{ fontWeight: 600, color: 'var(--muted)' }}>No applications yet</div>
          <div style={{ color: 'var(--muted2)', fontSize: 13, marginTop: 6 }}>Head to "My Opportunities" and apply to drives</div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {localApps.map(app => {
            const currentStage = stageIndex(app.status);
            const isRejected = app.status === 'Rejected';
            const isSelected = app.status === 'Selected';
            return (
              <Card key={app.driveId} style={{
                borderColor: isSelected ? 'var(--green)' : isRejected ? 'var(--red)' : 'var(--border)',
                background: isSelected ? '#064e3b22' : isRejected ? '#7f1d1d22' : 'var(--card)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>{app.company}</div>
                    <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 2 }}>
                      {app.role} {app.package && `• ${app.package}`}
                    </div>
                  </div>
                  <Badge variant={STAGE_COLORS[app.status]}>{app.status}</Badge>
                </div>

                {/* Progress steps */}
                <div style={{ marginTop: 16, display: 'flex', gap: 4 }}>
                  {STAGES.slice(0, 5).map((stage, i) => {
                    const reached = !isRejected && currentStage >= i;
                    const isCurrentStage = i === currentStage;
                    return (
                      <div key={stage} style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{
                          height: 6, borderRadius: 3,
                          background: reached ? 'var(--accent)' : 'var(--border)',
                          transition: 'background 0.4s',
                        }} />
                        <div style={{ fontSize: 10, color: isCurrentStage ? 'var(--accent-light)' : 'var(--muted2)', marginTop: 4, fontWeight: isCurrentStage ? 700 : 400 }}>
                          {stage}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Status changer */}
                {!isSelected && !isRejected && (
                  <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, color: 'var(--muted)', alignSelf: 'center' }}>Update status:</span>
                    {STAGES.map(stage => (
                      <button
                        key={stage}
                        onClick={() => handleStatusChange(app.driveId, stage)}
                        style={{
                          padding: '4px 12px', borderRadius: 7, fontSize: 12, fontWeight: 600,
                          border: `1px solid ${app.status === stage ? 'var(--accent)' : 'var(--border)'}`,
                          background: app.status === stage ? 'var(--accent)' : 'transparent',
                          color: app.status === stage ? '#fff' : 'var(--muted)',
                          cursor: 'pointer',
                        }}
                      >{stage}</button>
                    ))}
                  </div>
                )}
                {(isSelected || isRejected) && (
                  <div style={{ marginTop: 12, fontSize: 13, color: isSelected ? '#6ee7b7' : '#fca5a5', fontWeight: 600 }}>
                    {isSelected ? '🎉 Congratulations! You have been selected.' : '❌ Application not progressed further.'}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
