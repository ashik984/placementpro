import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, PageHeader, Btn, Badge, Field, Modal } from '../shared/UI';

export default function AlumniJobs() {
  const { jobReferrals, addJobReferral, currentAlumni } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [applied, setApplied] = useState({});
  const [form, setForm] = useState({
    company: '', role: '', location: '', package: '',
    skills: '', description: '',
  });

  const handlePost = () => {
    if (!form.company || !form.role) return;
    addJobReferral({
      alumniId: currentAlumni.id,
      alumniName: currentAlumni.name,
      company: form.company,
      role: form.role,
      location: form.location,
      package: form.package,
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      description: form.description,
    });
    setForm({ company: '', role: '', location: '', package: '', skills: '', description: '' });
    setShowModal(false);
  };

  return (
    <div className="animate-fadeup">
      <PageHeader
        title="Job Referral Board"
        subtitle="Post openings from your company and help juniors get referred"
        action={<Btn onClick={() => setShowModal(true)}>+ Post a Job</Btn>}
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Jobs Posted', value: jobReferrals.length, color: 'var(--accent)' },
          { label: 'Total Applicants', value: jobReferrals.reduce((a, b) => a + b.applicants, 0), color: 'var(--green)' },
          { label: 'Alumni Contributing', value: new Set(jobReferrals.map(j => j.alumniId)).size, color: 'var(--accent2)' },
        ].map(s => (
          <Card key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Jobs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {jobReferrals.map(job => (
          <Card key={job.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>{job.company}</div>
                  <Badge variant="blue">{job.role}</Badge>
                </div>
                <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
                  Posted by <strong style={{ color: 'var(--accent-light)' }}>{job.alumniName}</strong>
                  {' '}• 📍 {job.location}
                  {job.package && ` • 💰 ${job.package}`}
                  {' '}• {job.posted}
                </div>

                {job.description && (
                  <div style={{ marginTop: 10, fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, background: 'var(--card2)', borderRadius: 8, padding: '10px 14px' }}>
                    {job.description}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>Required:</span>
                  {job.skills.map(s => <Badge key={s} variant="purple">{s}</Badge>)}
                </div>

                <div style={{ marginTop: 10, fontSize: 12, color: 'var(--muted2)' }}>
                  👥 {job.applicants} applicant{job.applicants !== 1 ? 's' : ''} so far
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Btn
                  variant={applied[job.id] ? 'success' : 'primary'}
                  onClick={() => !applied[job.id] && setApplied(prev => ({ ...prev, [job.id]: true }))}
                  disabled={!!applied[job.id]}
                >
                  {applied[job.id] ? '✓ Referred' : '🤝 Refer Me'}
                </Btn>
                <Btn variant="secondary">Share Link</Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Post Job Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Post a Job Opening">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Company Name">
              <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Your company" />
            </Field>
            <Field label="Role">
              <input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="e.g. SDE I" />
            </Field>
            <Field label="Location">
              <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Bangalore / Remote" />
            </Field>
            <Field label="Package (CTC)">
              <input value={form.package} onChange={e => setForm({ ...form, package: e.target.value })} placeholder="e.g. 12-18 LPA" />
            </Field>
          </div>
          <Field label="Required Skills (comma-separated)">
            <input value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="React, Node.js, DSA..." />
          </Field>
          <Field label="Job Description">
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Brief description of the role and ideal candidate..." />
          </Field>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn onClick={handlePost} style={{ flex: 1 }}>Post Job</Btn>
            <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancel</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}
