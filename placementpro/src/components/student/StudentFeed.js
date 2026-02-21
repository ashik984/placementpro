import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, PageHeader, Btn, Badge, Empty } from '../shared/UI';

export default function StudentFeed() {
  const { drives, currentStudent, updateApplicationStatus } = useApp();
  const [applied, setApplied] = useState(
    currentStudent.applications.map(a => a.driveId)
  );

  const eligible = drives.filter(d =>
    currentStudent.cgpa >= d.minCGPA &&
    currentStudent.backlogs <= d.maxBacklogs &&
    d.branches.includes(currentStudent.branch)
  );

  const ineligible = drives.filter(d => !eligible.find(e => e.id === d.id));

  const handleApply = (driveId) => {
    setApplied(prev => [...prev, driveId]);
    updateApplicationStatus(currentStudent.id, driveId, 'Applied');
  };

  const DriveCard = ({ drive, isEligible }) => {
    const isApplied = applied.includes(drive.id);
    return (
      <Card style={{ opacity: isEligible ? 1 : 0.55, transition: 'all 0.2s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 12, flexShrink: 0,
              background: isEligible ? 'linear-gradient(135deg, #4f46e5, #0891b2)' : '#374151',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: '#fff',
            }}>{drive.logo}</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>{drive.company}</span>
                {isEligible
                  ? <Badge variant="green">✓ Eligible</Badge>
                  : <Badge variant="red">✗ Not Eligible</Badge>}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 2 }}>
                {drive.role} • <span style={{ color: 'var(--green)', fontWeight: 600 }}>{drive.package}</span> • {drive.date}
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                <Badge variant="yellow">CGPA ≥ {drive.minCGPA}</Badge>
                <Badge variant="gray">Backlogs ≤ {drive.maxBacklogs}</Badge>
                {drive.branches.map(b => <Badge key={b} variant="purple">{b}</Badge>)}
              </div>
            </div>
          </div>
          {isEligible && (
            <Btn
              variant={isApplied ? 'success' : 'primary'}
              onClick={() => !isApplied && handleApply(drive.id)}
              disabled={isApplied}
            >
              {isApplied ? '✓ Applied' : 'Apply Now →'}
            </Btn>
          )}
        </div>

        {/* Rounds */}
        {drive.rounds?.length > 0 && (
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>Rounds:</span>
            {drive.rounds.map((r, i) => (
              <React.Fragment key={r}>
                <span style={{ background: 'var(--card2)', borderRadius: 6, padding: '2px 10px', fontSize: 12, color: 'var(--muted)' }}>{r}</span>
                {i < drive.rounds.length - 1 && <span style={{ color: 'var(--border2)' }}>→</span>}
              </React.Fragment>
            ))}
            {drive.venue && (
              <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--muted)' }}>
                📍 {drive.venue}
              </span>
            )}
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="animate-fadeup">
      <PageHeader
        title="My Opportunities"
        subtitle="Personalized feed — only companies you're eligible for"
      />

      {/* Profile summary */}
      <Card style={{ marginBottom: 24, background: 'linear-gradient(135deg, #1e1b4b, #0c4a6e)', border: '1px solid #4338ca' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 16, flexShrink: 0,
            }}>
              {currentStudent.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{currentStudent.name}</div>
              <div style={{ color: '#a5b4fc', fontSize: 13, marginTop: 2 }}>
                {currentStudent.branch} • CGPA {currentStudent.cgpa} • {currentStudent.backlogs} Backlog{currentStudent.backlogs !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#6ee7b7', fontFamily: 'var(--font-mono)' }}>{eligible.length}</div>
              <div style={{ fontSize: 12, color: '#a5b4fc' }}>Eligible</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#fde68a', fontFamily: 'var(--font-mono)' }}>{applied.length}</div>
              <div style={{ fontSize: 12, color: '#a5b4fc' }}>Applied</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Eligible drives */}
      {eligible.length === 0 ? (
        <Empty icon="🔍" message="No eligible drives right now" sub="Check back soon or improve your CGPA & clear backlogs!" />
      ) : (
        <>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
            {eligible.length} Eligible {eligible.length === 1 ? 'Drive' : 'Drives'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
            {eligible.map(d => <DriveCard key={d.id} drive={d} isEligible={true} />)}
          </div>
        </>
      )}

      {/* Ineligible drives */}
      {ineligible.length > 0 && (
        <>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
            {ineligible.length} Other {ineligible.length === 1 ? 'Drive' : 'Drives'} (Not Eligible)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {ineligible.map(d => <DriveCard key={d.id} drive={d} isEligible={false} />)}
          </div>
        </>
      )}
    </div>
  );
}
