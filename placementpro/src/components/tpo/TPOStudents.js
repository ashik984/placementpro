import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, PageHeader, Badge, ProgressBar, Modal } from '../shared/UI';

export default function TPOStudents() {
  const { students } = useApp();
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const branches = ['All', ...new Set(students.map(s => s.branch))];

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.skills.some(sk => sk.toLowerCase().includes(search.toLowerCase()));
    const matchBranch = branchFilter === 'All' || s.branch === branchFilter;
    return matchSearch && matchBranch;
  });

  const cgpaColor = (cgpa) => cgpa >= 8 ? 'var(--green)' : cgpa >= 7 ? 'var(--yellow)' : 'var(--red)';

  return (
    <div className="animate-fadeup">
      <PageHeader
        title="Student Database"
        subtitle={`${students.length} students registered across all branches`}
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          placeholder="Search by name, email or skill..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
        />
        <div style={{ display: 'flex', gap: 6 }}>
          {branches.map(b => (
            <button
              key={b}
              onClick={() => setBranchFilter(b)}
              style={{
                padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                border: `1px solid ${branchFilter === b ? 'var(--accent)' : 'var(--border)'}`,
                background: branchFilter === b ? 'var(--accent)' : 'transparent',
                color: branchFilter === b ? '#fff' : 'var(--muted)',
                cursor: 'pointer',
              }}
            >{b}</button>
          ))}
        </div>
      </div>

      {/* Table-style list */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 80px 80px 80px 1fr 80px',
          padding: '12px 20px', borderBottom: '1px solid var(--border)',
          fontSize: 11, fontWeight: 700, color: 'var(--muted)',
          textTransform: 'uppercase', letterSpacing: 0.8,
        }}>
          <span>Student</span><span>Branch</span><span>CGPA</span><span>Backlogs</span><span>Skills</span><span>Applied</span>
        </div>
        {filtered.map((s, i) => (
          <div
            key={s.id}
            onClick={() => setSelected(s)}
            style={{
              display: 'grid', gridTemplateColumns: '2fr 80px 80px 80px 1fr 80px',
              padding: '14px 20px',
              borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
              cursor: 'pointer', transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--card2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
              <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 1 }}>{s.email}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Badge variant="purple">{s.branch}</Badge>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: cgpaColor(s.cgpa) }}>
                {s.cgpa}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: s.backlogs === 0 ? 'var(--green)' : 'var(--red)' }}>
                {s.backlogs}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              {s.skills.slice(0, 3).map(sk => (
                <Badge key={sk} variant="blue">{sk}</Badge>
              ))}
              {s.skills.length > 3 && <span style={{ fontSize: 11, color: 'var(--muted)' }}>+{s.skills.length - 3}</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>{s.applications.length}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--muted)' }}>
            No students match your search
          </div>
        )}
      </Card>

      {/* Student Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name}>
        {selected && (
          <div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              <Badge variant="purple">{selected.branch}</Badge>
              <Badge variant={selected.cgpa >= 7 ? 'green' : 'red'}>CGPA {selected.cgpa}</Badge>
              <Badge variant={selected.backlogs === 0 ? 'green' : 'red'}>{selected.backlogs} Backlog{selected.backlogs !== 1 ? 's' : ''}</Badge>
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>{selected.email} | {selected.phone}</div>

            <div style={{ margin: '16px 0', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Skills</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {selected.skills.map(sk => <Badge key={sk} variant="blue">{sk}</Badge>)}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Projects</div>
              {selected.projects.map(p => (
                <div key={p} style={{ background: 'var(--card2)', borderRadius: 8, padding: '8px 12px', fontSize: 13, marginBottom: 6 }}>
                  📁 {p}
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>CGPA Progress</div>
              <ProgressBar value={selected.cgpa} max={10} color={cgpaColor(selected.cgpa)} />
              <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{selected.cgpa} / 10.0</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
