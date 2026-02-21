import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Btn, PageHeader, Field, Badge, Empty, Modal } from '../shared/UI';

const BRANCH_OPTIONS = ['CS', 'MCA', 'IT', 'ECE', 'EEE'];
const STATUS_COLORS = { Upcoming: 'blue', Active: 'green', Completed: 'gray' };

export default function TPODrives() {
  const { drives, addDrive, getEligibleStudents, notifyStudents } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [notifiedIds, setNotifiedIds] = useState({});
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [form, setForm] = useState({
    company: '', role: '', package: '', minCGPA: '7.0',
    maxBacklogs: '0', branches: ['CS', 'MCA'],
    date: '', venue: '', rounds: '',
  });

  const handleToggleBranch = (b) => {
    setForm(f => ({
      ...f,
      branches: f.branches.includes(b)
        ? f.branches.filter(x => x !== b)
        : [...f.branches, b],
    }));
  };

  const handleCreate = () => {
    if (!form.company || !form.role) return;
    addDrive({
      company: form.company,
      role: form.role,
      package: form.package,
      minCGPA: parseFloat(form.minCGPA) || 6.0,
      maxBacklogs: parseInt(form.maxBacklogs) || 0,
      branches: form.branches,
      date: form.date,
      venue: form.venue,
      rounds: form.rounds.split(',').map(r => r.trim()).filter(Boolean),
      status: 'Upcoming',
      logo: form.company.slice(0, 3).toUpperCase(),
    });
    setShowModal(false);
    setForm({ company: '', role: '', package: '', minCGPA: '7.0', maxBacklogs: '0', branches: ['CS', 'MCA'], date: '', venue: '', rounds: '' });
  };

  const handleNotify = (drive) => {
    const count = notifyStudents(drive.id);
    setNotifiedIds(prev => ({ ...prev, [drive.id]: count }));
  };

  return (
    <div className="animate-fadeup">
      <PageHeader
        title="Placement Drives"
        subtitle="Create, manage, and notify students for campus recruitment drives"
        action={<Btn onClick={() => setShowModal(true)}>+ Create Drive</Btn>}
      />

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Drives', value: drives.length, color: 'var(--accent)' },
          { label: 'Upcoming', value: drives.filter(d => d.status === 'Upcoming').length, color: 'var(--accent2)' },
          { label: 'Avg Package', value: '10.5 LPA', color: 'var(--green)' },
        ].map(s => (
          <Card key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Drives list */}
      {drives.length === 0 ? (
        <Empty icon="🚀" message="No drives created yet" sub="Click '+ Create Drive' to add your first placement drive" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {drives.map(drive => {
            const eligible = getEligibleStudents(drive);
            const notifiedCount = notifiedIds[drive.id];
            return (
              <Card key={drive.id} style={{ transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  {/* Left */}
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                      background: 'linear-gradient(135deg, #4f46e5, #0891b2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: '#fff',
                    }}>
                      {drive.logo}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>{drive.company}</div>
                      <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 2 }}>{drive.role} • {drive.package} • {drive.date}</div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                        <Badge variant={STATUS_COLORS[drive.status] || 'gray'}>{drive.status}</Badge>
                        {drive.branches.map(b => <Badge key={b} variant="purple">{b}</Badge>)}
                        <Badge variant="yellow">CGPA ≥ {drive.minCGPA}</Badge>
                        <Badge variant="gray">Backlogs ≤ {drive.maxBacklogs}</Badge>
                      </div>
                    </div>
                  </div>
                  {/* Right — eligible count */}
                  <div style={{ textAlign: 'center', minWidth: 80 }}>
                    <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--accent2)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                      {eligible.length}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Eligible</div>
                  </div>
                </div>

                {/* Eligible Students */}
                <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Eligible Students
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                    {eligible.length === 0 ? (
                      <span style={{ color: 'var(--muted2)', fontSize: 13 }}>No students match the criteria</span>
                    ) : (
                      eligible.map(s => (
                        <span key={s.id} style={{
                          background: 'var(--card2)', border: '1px solid var(--border)',
                          borderRadius: 8, padding: '4px 12px', fontSize: 13,
                        }}>
                          {s.name} <span style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{s.cgpa}</span>
                        </span>
                      ))
                    )}
                  </div>

                  {/* Rounds */}
                  {drive.rounds?.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
                      {drive.rounds.map((r, i) => (
                        <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 6, padding: '3px 10px', fontSize: 12, color: 'var(--muted)' }}>
                            {i + 1}. {r}
                          </span>
                          {i < drive.rounds.length - 1 && <span style={{ color: 'var(--border2)', fontSize: 14 }}>→</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 10 }}>
                    {eligible.length > 0 && (
                      <Btn
                        variant={notifiedCount !== undefined ? 'success' : 'primary'}
                        onClick={() => handleNotify(drive)}
                        disabled={notifiedCount !== undefined}
                      >
                        {notifiedCount !== undefined
                          ? `✓ Notified ${notifiedCount} Students`
                          : `📣 Notify All ${eligible.length} Eligible`}
                      </Btn>
                    )}
                    <Btn variant="secondary" onClick={() => setSelectedDrive(drive)}>View Details</Btn>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Drive Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Create Placement Drive">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Company Name">
              <input placeholder="e.g. TCS Digital" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
            </Field>
            <Field label="Role">
              <input placeholder="e.g. Software Engineer" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
            </Field>
            <Field label="Package">
              <input placeholder="e.g. 7 LPA" value={form.package} onChange={e => setForm({ ...form, package: e.target.value })} />
            </Field>
            <Field label="Drive Date">
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </Field>
            <Field label="Min CGPA">
              <input type="number" step="0.1" min="0" max="10" placeholder="7.0" value={form.minCGPA} onChange={e => setForm({ ...form, minCGPA: e.target.value })} />
            </Field>
            <Field label="Max Backlogs">
              <input type="number" min="0" placeholder="0" value={form.maxBacklogs} onChange={e => setForm({ ...form, maxBacklogs: e.target.value })} />
            </Field>
          </div>
          <Field label="Venue">
            <input placeholder="e.g. Room 301, Academic Block" value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} />
          </Field>
          <Field label="Interview Rounds (comma-separated)">
            <input placeholder="Aptitude, Technical, HR" value={form.rounds} onChange={e => setForm({ ...form, rounds: e.target.value })} />
          </Field>
          <Field label="Eligible Branches">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
              {BRANCH_OPTIONS.map(b => (
                <button
                  key={b}
                  onClick={() => handleToggleBranch(b)}
                  style={{
                    padding: '5px 14px', borderRadius: 8,
                    border: `1px solid ${form.branches.includes(b) ? 'var(--accent)' : 'var(--border)'}`,
                    background: form.branches.includes(b) ? 'var(--accent)' : 'transparent',
                    color: form.branches.includes(b) ? '#fff' : 'var(--muted)',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >{b}</button>
              ))}
            </div>
          </Field>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <Btn onClick={handleCreate} style={{ flex: 1 }}>Create Drive</Btn>
            <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancel</Btn>
          </div>
        </div>
      </Modal>

      {/* Drive Details Modal */}
      <Modal open={!!selectedDrive} onClose={() => setSelectedDrive(null)} title={selectedDrive?.company}>
        {selectedDrive && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 14 }}>
              {[
                ['Role', selectedDrive.role],
                ['Package', selectedDrive.package],
                ['Date', selectedDrive.date],
                ['Venue', selectedDrive.venue],
                ['Min CGPA', selectedDrive.minCGPA],
                ['Max Backlogs', selectedDrive.maxBacklogs],
              ].map(([k, v]) => (
                <div key={k} style={{ background: 'var(--card2)', borderRadius: 8, padding: '10px 14px' }}>
                  <div style={{ color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>{k}</div>
                  <div style={{ fontWeight: 600, marginTop: 2 }}>{v || '—'}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
