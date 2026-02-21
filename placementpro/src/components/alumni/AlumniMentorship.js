import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, PageHeader, Btn, Badge } from '../shared/UI';

export default function AlumniMentorship() {
  const { alumni, bookMentorSlot } = useApp();
  const [bookedSlots, setBookedSlots] = useState({});
  const [addingSlots, setAddingSlots] = useState(false);
  const [newSlot, setNewSlot] = useState('');

  const handleBook = (alumniId, slotId) => {
    bookMentorSlot(alumniId, slotId);
    setBookedSlots(prev => ({ ...prev, [`${alumniId}-${slotId}`]: true }));
  };

  return (
    <div className="animate-fadeup">
      <PageHeader
        title="Mentorship Slots"
        subtitle="Set your available hours for mock interviews and career guidance"
        action={<Btn onClick={() => setAddingSlots(!addingSlots)}>+ Add Slot</Btn>}
      />

      {/* Add slot panel */}
      {addingSlots && (
        <Card style={{ marginBottom: 20, border: '1px solid var(--accent)' }}>
          <div style={{ fontWeight: 600, marginBottom: 12 }}>Add Availability Slot</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              value={newSlot}
              onChange={e => setNewSlot(e.target.value)}
              placeholder="e.g. Mon 5:00 PM or Sat 11:00 AM"
              style={{ flex: 1 }}
            />
            <Btn onClick={() => { alert('Slot added! (Demo)'); setNewSlot(''); setAddingSlots(false); }}>
              Add
            </Btn>
            <Btn variant="secondary" onClick={() => setAddingSlots(false)}>Cancel</Btn>
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['Mon 5PM', 'Tue 7PM', 'Wed 6PM', 'Thu 6:30PM', 'Fri 5PM', 'Sat 10AM', 'Sun 3PM'].map(t => (
              <button key={t} onClick={() => setNewSlot(t)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontSize: 12, cursor: 'pointer' }}>{t}</button>
            ))}
          </div>
        </Card>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Active Mentors', value: alumni.length, color: 'var(--accent)' },
          { label: 'Total Slots', value: alumni.reduce((a, b) => a + b.slots.length, 0), color: 'var(--accent2)' },
          { label: 'Sessions Booked', value: Object.keys(bookedSlots).length, color: 'var(--green)' },
        ].map(s => (
          <Card key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Mentor cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {alumni.map(mentor => {
          const available = mentor.slots.filter(s => !s.booked && !bookedSlots[`${mentor.id}-${s.id}`]);
          const booked = mentor.slots.filter(s => s.booked || bookedSlots[`${mentor.id}-${s.id}`]);

          return (
            <Card key={mentor.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, #6366f1, #10b981)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: 18, color: '#fff',
                  }}>
                    {mentor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>{mentor.name}</div>
                    <div style={{ color: 'var(--accent2)', fontSize: 14, marginTop: 2 }}>
                      {mentor.role} @ {mentor.company}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
                      Batch {mentor.batch} • Expert in: {mentor.expertise}
                    </div>
                  </div>
                </div>
                <div>
                  <Badge variant={available.length > 0 ? 'green' : 'gray'}>
                    {available.length} slot{available.length !== 1 ? 's' : ''} available
                  </Badge>
                </div>
              </div>

              {/* Available slots */}
              <div style={{ paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
                  Available Slots
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {available.map(slot => (
                    <button
                      key={slot.id}
                      onClick={() => handleBook(mentor.id, slot.id)}
                      style={{
                        padding: '10px 18px', borderRadius: 10,
                        border: '1px solid var(--border2)',
                        background: 'var(--card2)',
                        color: 'var(--text)', fontWeight: 500, fontSize: 13,
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.target.style.borderColor = 'var(--green)'; e.target.style.color = '#6ee7b7'; }}
                      onMouseLeave={e => { e.target.style.borderColor = 'var(--border2)'; e.target.style.color = 'var(--text)'; }}
                    >
                      📅 {slot.label}
                    </button>
                  ))}
                  {available.length === 0 && (
                    <span style={{ color: 'var(--muted2)', fontSize: 13 }}>All slots booked</span>
                  )}
                </div>

                {booked.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                      Booked
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {booked.map(slot => (
                        <span key={slot.id} style={{
                          padding: '8px 16px', borderRadius: 10,
                          border: '1px solid var(--green)',
                          background: '#064e3b', color: '#6ee7b7',
                          fontWeight: 500, fontSize: 13,
                        }}>
                          ✓ {slot.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
