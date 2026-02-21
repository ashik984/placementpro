import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, PageHeader, Btn, ProgressBar, Badge } from '../shared/UI';
import { MARKET_SKILLS } from '../../data/mockData';

const LEARNING_PATHS = {
  PowerBI: { platform: 'Microsoft Learn', duration: '2 weeks', url: '#', free: true },
  TensorFlow: { platform: 'Coursera', duration: '4 weeks', url: '#', free: false },
  'System Design': { platform: 'Grokking SDI', duration: '3 weeks', url: '#', free: false },
  Docker: { platform: 'Docker Docs', duration: '1 week', url: '#', free: true },
  TypeScript: { platform: 'TypeScript Handbook', duration: '1 week', url: '#', free: true },
  Redis: { platform: 'Redis University', duration: '2 weeks', url: '#', free: true },
  Tableau: { platform: 'Tableau Public', duration: '2 weeks', url: '#', free: true },
  Statistics: { platform: 'Khan Academy', duration: '3 weeks', url: '#', free: true },
};

export default function SkillGapAnalysis() {
  const { currentStudent } = useApp();
  const [targetRole, setTargetRole] = useState('Software Engineer');

  const marketSkills = MARKET_SKILLS[targetRole] || [];
  const studentSkills = currentStudent.skills.map(s => s.toLowerCase());

  const matched = marketSkills.filter(s => studentSkills.includes(s.toLowerCase()));
  const missing = marketSkills.filter(s => !studentSkills.includes(s.toLowerCase()));
  const score = Math.round((matched.length / marketSkills.length) * 100);

  const scoreColor = score >= 75 ? 'var(--green)' : score >= 50 ? 'var(--yellow)' : 'var(--red)';

  return (
    <div className="animate-fadeup">
      <PageHeader
        title="Skill Gap Analysis"
        subtitle="Compare your profile against market demands and get a personalized learning path"
      />

      {/* Role selector */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 12 }}>Select Target Role</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Object.keys(MARKET_SKILLS).map(role => (
            <button
              key={role}
              onClick={() => setTargetRole(role)}
              style={{
                padding: '8px 16px', borderRadius: 9, fontSize: 13, fontWeight: 600,
                border: `1px solid ${targetRole === role ? 'var(--accent)' : 'var(--border)'}`,
                background: targetRole === role ? 'var(--accent)' : 'transparent',
                color: targetRole === role ? '#fff' : 'var(--muted)',
                cursor: 'pointer',
              }}
            >{role}</button>
          ))}
        </div>
      </Card>

      {/* Match score */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <Card style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(circle at center, ${scoreColor}11, transparent 70%)`,
          }} />
          <div style={{ fontSize: 64, fontWeight: 900, color: scoreColor, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
            {score}%
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 8 }}>Match Score for</div>
          <div style={{ fontWeight: 700, fontSize: 16, marginTop: 2 }}>{targetRole}</div>
          <ProgressBar value={score} max={100} color={scoreColor} style={{ marginTop: 16 }} />
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card style={{ background: '#064e3b22', border: '1px solid #059669' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
              ✓ Skills You Have ({matched.length})
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {matched.map(s => <Badge key={s} variant="green">{s}</Badge>)}
              {matched.length === 0 && <span style={{ color: 'var(--muted)', fontSize: 13 }}>None matched yet</span>}
            </div>
          </Card>
          <Card style={{ background: '#7f1d1d22', border: '1px solid #dc2626' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fca5a5', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
              ✗ Skills to Learn ({missing.length})
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {missing.map(s => <Badge key={s} variant="red">{s}</Badge>)}
              {missing.length === 0 && <span style={{ color: 'var(--green)', fontSize: 13 }}>You're fully equipped!</span>}
            </div>
          </Card>
        </div>
      </div>

      {/* AI Insight */}
      <Card style={{ marginBottom: 24, background: 'linear-gradient(135deg, #1e1b4b, #0f2027)', border: '1px solid #4338ca' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ fontSize: 24, flexShrink: 0 }}>🤖</div>
          <div>
            <div style={{ fontWeight: 700, color: '#a5b4fc', marginBottom: 6 }}>PlacementPro Insight</div>
            <div style={{ fontSize: 14, color: '#e0e7ff', lineHeight: 1.7 }}>
              You are targeting <strong>{targetRole}</strong> roles.{' '}
              {matched.length > 0 && `You already have ${matched.join(', ')} which is great! `}
              {missing.length > 0 && (
                <>
                  However, <strong>{missing[0]}</strong> is required by{' '}
                  <strong>{Math.round((1 / marketSkills.length) * 100 * 80)}%</strong> of placed students in this role, but you don't have it yet.
                  {' '}Start with the recommended learning path below to close this gap.
                </>
              )}
              {missing.length === 0 && 'Your skillset fully matches market requirements for this role. Start applying!'}
            </div>
          </div>
        </div>
      </Card>

      {/* Learning paths */}
      {missing.length > 0 && (
        <>
          <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 14 }}>
            Recommended Learning Path
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {missing.map((skill, i) => {
              const path = LEARNING_PATHS[skill];
              return (
                <Card key={skill} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: 'var(--accent)', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontFamily: 'var(--font-mono)', fontSize: 14,
                    }}>{i + 1}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{skill}</div>
                      {path ? (
                        <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 2 }}>
                          {path.platform} • ⏱ {path.duration} &nbsp;
                          {path.free
                            ? <Badge variant="green">Free</Badge>
                            : <Badge variant="yellow">Paid</Badge>}
                        </div>
                      ) : (
                        <div style={{ color: 'var(--muted)', fontSize: 13 }}>Search on YouTube or Udemy</div>
                      )}
                    </div>
                  </div>
                  {path && <Btn variant="secondary">Start Learning →</Btn>}
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
