import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, PageHeader, Btn, Field } from '../shared/UI';

export default function ResumeWizard() {
  const { currentStudent } = useApp();
  const [form, setForm] = useState({
    name: currentStudent.name,
    email: currentStudent.email,
    phone: currentStudent.phone,
    branch: currentStudent.branch,
    cgpa: currentStudent.cgpa,
    year: currentStudent.year,
    college: 'State University of Technology',
    skills: currentStudent.skills.join(', '),
    projects: currentStudent.projects.join('\n'),
    internship: '',
    achievements: '',
    objective: `Motivated ${currentStudent.branch} student seeking software roles where I can apply my skills in ${currentStudent.skills.slice(0, 2).join(' and ')}.`,
  });
  const [generated, setGenerated] = useState(false);
  const [step, setStep] = useState(1);

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const ResumePreview = () => (
    <div style={{ background: '#fff', color: '#111', fontFamily: "'DM Sans', sans-serif", borderRadius: 12, overflow: 'hidden', fontSize: 13, lineHeight: 1.6 }}>
      {/* Header */}
      <div style={{ background: '#312e81', color: '#fff', padding: '24px 28px 20px' }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>{form.name}</div>
        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>
          {form.branch} Student • Year {form.year} • CGPA {form.cgpa}/10
        </div>
        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <span>✉ {form.email}</span>
          <span>📞 {form.phone}</span>
          <span>🏫 {form.college}</span>
        </div>
      </div>

      <div style={{ padding: '20px 28px', display: 'grid', gridTemplateColumns: '1fr 160px', gap: 24 }}>
        {/* Left */}
        <div>
          {form.objective && (
            <section style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 800, fontSize: 11, color: '#312e81', textTransform: 'uppercase', letterSpacing: 1.5, borderBottom: '2px solid #312e81', paddingBottom: 4, marginBottom: 8 }}>
                Objective
              </div>
              <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.7 }}>{form.objective}</div>
            </section>
          )}

          <section style={{ marginBottom: 18 }}>
            <div style={{ fontWeight: 800, fontSize: 11, color: '#312e81', textTransform: 'uppercase', letterSpacing: 1.5, borderBottom: '2px solid #312e81', paddingBottom: 4, marginBottom: 10 }}>
              Projects
            </div>
            {form.projects.split('\n').filter(Boolean).map((p, i) => (
              <div key={i} style={{ marginBottom: 6, display: 'flex', gap: 8, fontSize: 12 }}>
                <span style={{ color: '#6366f1', flexShrink: 0 }}>▸</span>
                <span>{p}</span>
              </div>
            ))}
          </section>

          {form.internship && (
            <section style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 800, fontSize: 11, color: '#312e81', textTransform: 'uppercase', letterSpacing: 1.5, borderBottom: '2px solid #312e81', paddingBottom: 4, marginBottom: 10 }}>
                Internship / Experience
              </div>
              <div style={{ fontSize: 12 }}>{form.internship}</div>
            </section>
          )}

          {form.achievements && (
            <section>
              <div style={{ fontWeight: 800, fontSize: 11, color: '#312e81', textTransform: 'uppercase', letterSpacing: 1.5, borderBottom: '2px solid #312e81', paddingBottom: 4, marginBottom: 10 }}>
                Achievements
              </div>
              {form.achievements.split('\n').filter(Boolean).map((a, i) => (
                <div key={i} style={{ fontSize: 12, marginBottom: 4, display: 'flex', gap: 8 }}>
                  <span style={{ color: '#10b981' }}>★</span><span>{a}</span>
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Right sidebar */}
        <div>
          <section style={{ marginBottom: 18 }}>
            <div style={{ fontWeight: 800, fontSize: 11, color: '#312e81', textTransform: 'uppercase', letterSpacing: 1.5, borderBottom: '2px solid #312e81', paddingBottom: 4, marginBottom: 10 }}>
              Skills
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {form.skills.split(',').map(sk => sk.trim()).filter(Boolean).map(sk => (
                <div key={sk} style={{ background: '#e0e7ff', color: '#3730a3', borderRadius: 5, padding: '3px 8px', fontSize: 11, fontWeight: 600 }}>
                  {sk}
                </div>
              ))}
            </div>
          </section>

          <section>
            <div style={{ fontWeight: 800, fontSize: 11, color: '#312e81', textTransform: 'uppercase', letterSpacing: 1.5, borderBottom: '2px solid #312e81', paddingBottom: 4, marginBottom: 10 }}>
              Education
            </div>
            <div style={{ fontSize: 11 }}>
              <div style={{ fontWeight: 700 }}>{form.branch}</div>
              <div style={{ color: '#6b7280' }}>{form.college}</div>
              <div style={{ color: '#6366f1', fontWeight: 700 }}>CGPA: {form.cgpa}</div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: '#f8fafc', borderTop: '1px solid #e5e7eb', padding: '8px 28px', fontSize: 10, color: '#9ca3af', textAlign: 'right' }}>
        Generated by PlacementPro • {new Date().toLocaleDateString()}
      </div>
    </div>
  );

  return (
    <div className="animate-fadeup">
      <PageHeader title="Resume Wizard" subtitle="Build your college-branded PDF resume in minutes" />

      <div style={{ display: 'grid', gridTemplateColumns: generated ? '1fr 1fr' : '1fr', gap: 24 }}>
        {/* Form */}
        <div>
          {/* Steps */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 20 }}>
            {['Personal', 'Academic', 'Skills & Projects'].map((s, i) => (
              <button
                key={s}
                onClick={() => setStep(i + 1)}
                style={{
                  flex: 1, padding: '10px 8px', fontSize: 12, fontWeight: 600,
                  border: '1px solid var(--border)', cursor: 'pointer',
                  borderRadius: i === 0 ? '8px 0 0 8px' : i === 2 ? '0 8px 8px 0' : 0,
                  background: step === i + 1 ? 'var(--accent)' : 'var(--card2)',
                  color: step === i + 1 ? '#fff' : 'var(--muted)',
                  borderRight: i < 2 ? 'none' : '1px solid var(--border)',
                }}
              >{i + 1}. {s}</button>
            ))}
          </div>

          <Card>
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Field label="Full Name"><input value={form.name} onChange={e => update('name', e.target.value)} /></Field>
                  <Field label="Email"><input value={form.email} onChange={e => update('email', e.target.value)} /></Field>
                  <Field label="Phone"><input value={form.phone} onChange={e => update('phone', e.target.value)} /></Field>
                  <Field label="College"><input value={form.college} onChange={e => update('college', e.target.value)} /></Field>
                </div>
                <Field label="Career Objective">
                  <textarea value={form.objective} onChange={e => update('objective', e.target.value)} rows={3} />
                </Field>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <Field label="Branch"><input value={form.branch} onChange={e => update('branch', e.target.value)} /></Field>
                  <Field label="CGPA"><input type="number" step="0.1" min="0" max="10" value={form.cgpa} onChange={e => update('cgpa', e.target.value)} /></Field>
                  <Field label="Year"><input type="number" min="1" max="4" value={form.year} onChange={e => update('year', e.target.value)} /></Field>
                </div>
                <Field label="Internship / Work Experience">
                  <textarea placeholder="Company, Role, Duration, Key contributions..." value={form.internship} onChange={e => update('internship', e.target.value)} rows={3} />
                </Field>
                <Field label="Achievements (one per line)">
                  <textarea placeholder="e.g. 1st place in state-level hackathon..." value={form.achievements} onChange={e => update('achievements', e.target.value)} rows={3} />
                </Field>
              </div>
            )}

            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Field label="Skills (comma-separated)">
                  <input value={form.skills} onChange={e => update('skills', e.target.value)} placeholder="React, Node.js, Python, SQL..." />
                </Field>
                <Field label="Projects (one per line)">
                  <textarea value={form.projects} onChange={e => update('projects', e.target.value)} rows={5} placeholder="E-Commerce Portal using React & Node.js..." />
                </Field>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              {step > 1 && <Btn variant="secondary" onClick={() => setStep(s => s - 1)}>← Back</Btn>}
              {step < 3 && <Btn onClick={() => setStep(s => s + 1)}>Next →</Btn>}
              {step === 3 && <Btn onClick={() => setGenerated(true)}>✨ Generate Resume</Btn>}
            </div>
          </Card>
        </div>

        {/* Preview */}
        {generated && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
              Preview
            </div>
            <ResumePreview />
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <Btn variant="success" style={{ flex: 1 }}>⬇ Download PDF</Btn>
              <Btn variant="secondary" onClick={() => setGenerated(false)}>Edit</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
