import React from 'react';
import { useApp } from '../../context/AppContext';

const ROLES = [
  { key: 'tpo', label: 'TPO Admin', icon: '🏢', color: '#6366f1' },
  { key: 'student', label: 'Student', icon: '🎓', color: '#22d3ee' },
  { key: 'alumni', label: 'Alumni', icon: '🤝', color: '#10b981' },
];

const NAV_ITEMS = {
  tpo: [
    { key: 'drives', label: 'Placement Drives', icon: '🚀' },
    { key: 'students', label: 'Student Database', icon: '👥' },
    { key: 'scheduler', label: 'Interview Scheduler', icon: '📅' },
    { key: 'analytics', label: 'Analytics', icon: '📊' },
  ],
  student: [
    { key: 'feed', label: 'My Opportunities', icon: '✨' },
    { key: 'tracker', label: 'Application Tracker', icon: '📋' },
    { key: 'resume', label: 'Resume Wizard', icon: '📄' },
    { key: 'skillgap', label: 'Skill Gap Analysis', icon: '🧠' },
    { key: 'bot', label: 'PlacementBot', icon: '🤖' },
  ],
  alumni: [
    { key: 'jobs', label: 'Job Referral Board', icon: '💼' },
    { key: 'mentorship', label: 'Mentorship Slots', icon: '🎯' },
  ],
};

export default function Sidebar({ view, setView }) {
  const { role, setRole, notifications, currentStudent } = useApp();
  const unread = notifications.filter(n => !n.read && n.studentId === currentStudent?.id).length;

  return (
    <aside style={{
      width: 240,
      background: 'var(--card)',
      borderRight: '1px solid var(--border)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-mono)',
          }}>P</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, letterSpacing: '-0.3px' }}>PlacementPro</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 1 }}>Campus Suite</div>
          </div>
        </div>
      </div>

      {/* Role Switcher */}
      <div style={{ padding: '16px 12px 8px' }}>
        <div style={{ fontSize: 10, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, paddingLeft: 4 }}>
          Switch Portal
        </div>
        {ROLES.map(r => (
          <button
            key={r.key}
            onClick={() => {
              setRole(r.key);
              setView(NAV_ITEMS[r.key][0].key);
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '8px 12px',
              borderRadius: 9, border: 'none',
              background: role === r.key ? `${r.color}22` : 'transparent',
              color: role === r.key ? r.color : 'var(--muted)',
              fontWeight: role === r.key ? 600 : 400,
              fontSize: 14, marginBottom: 2,
              transition: 'all 0.15s',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 15 }}>{r.icon}</span>
            {r.label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--border)', margin: '4px 12px 8px' }} />

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '4px 12px' }}>
        <div style={{ fontSize: 10, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, paddingLeft: 4 }}>
          Navigation
        </div>
        {NAV_ITEMS[role].map(item => {
          const isActive = view === item.key;
          const isBotWithUnread = item.key === 'bot' && unread > 0;
          return (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '9px 12px',
                borderRadius: 9, border: 'none',
                background: isActive ? 'var(--accent)' : 'transparent',
                color: isActive ? '#fff' : 'var(--muted)',
                fontWeight: isActive ? 600 : 400,
                fontSize: 14, marginBottom: 2,
                transition: 'all 0.15s',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span>{item.icon}</span>
                {item.label}
              </span>
              {isBotWithUnread && (
                <span style={{
                  background: 'var(--red)', color: '#fff',
                  borderRadius: '50%', width: 18, height: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700,
                }}>
                  {unread}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
        {role === 'student' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, flexShrink: 0,
            }}>
              AS
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Aarav Sharma
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>CS • CGPA 8.2</div>
            </div>
          </div>
        )}
        {role === 'tpo' && (
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>
            <div style={{ fontWeight: 600, color: 'var(--text)' }}>Dr. Rekha Iyer</div>
            <div>Placement Officer</div>
          </div>
        )}
        {role === 'alumni' && (
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>
            <div style={{ fontWeight: 600, color: 'var(--text)' }}>Divya Rao</div>
            <div>Google • Batch 2021</div>
          </div>
        )}
      </div>
    </aside>
  );
}
