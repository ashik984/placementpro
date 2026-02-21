import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card, PageHeader, StatCard, ProgressBar } from '../shared/UI';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const CHART_COLORS = ['#6366f1', '#22d3ee', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function TPOAnalytics() {
  const { students, drives } = useApp();

  const placed = students.filter(s => s.applications.some(a => a.status === 'Selected')).length;
  const avgCGPA = (students.reduce((a, b) => a + b.cgpa, 0) / students.length).toFixed(2);

  // Branch-wise data
  const branchData = [...new Set(students.map(s => s.branch))].map(b => ({
    branch: b,
    count: students.filter(s => s.branch === b).length,
    placed: students.filter(s => s.branch === b && s.applications.some(a => a.status === 'Selected')).length,
  }));

  // Skill frequency
  const skillCount = {};
  students.forEach(s => s.skills.forEach(sk => { skillCount[sk] = (skillCount[sk] || 0) + 1; }));
  const skillData = Object.entries(skillCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([skill, count]) => ({ skill, count }));

  // CGPA distribution
  const cgpaBuckets = [
    { range: '6-7', count: students.filter(s => s.cgpa >= 6 && s.cgpa < 7).length },
    { range: '7-8', count: students.filter(s => s.cgpa >= 7 && s.cgpa < 8).length },
    { range: '8-9', count: students.filter(s => s.cgpa >= 8 && s.cgpa < 9).length },
    { range: '9-10', count: students.filter(s => s.cgpa >= 9).length },
  ];

  // Application status pie
  const statusCounts = {};
  students.forEach(s => s.applications.forEach(a => {
    statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
  }));
  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  const tooltipStyle = { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13 };

  return (
    <div className="animate-fadeup">
      <PageHeader title="Analytics Dashboard" subtitle="Placement insights and recruitment statistics" />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Students" value={students.length} color="var(--accent)" icon="👥" />
        <StatCard label="Selected" value={placed} color="var(--green)" icon="🎯" />
        <StatCard label="Avg CGPA" value={avgCGPA} color="var(--accent2)" icon="📊" />
        <StatCard label="Active Drives" value={drives.length} color="var(--yellow)" icon="🚀" />
      </div>

      {/* Charts row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Branch-wise */}
        <Card>
          <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 16 }}>Students by Branch</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={branchData} barCategoryGap="30%">
              <XAxis dataKey="branch" tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
              <Bar dataKey="count" fill="var(--accent)" radius={[6, 6, 0, 0]} name="Total" />
              <Bar dataKey="placed" fill="var(--green)" radius={[6, 6, 0, 0]} name="Placed" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* CGPA distribution */}
        <Card>
          <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 16 }}>CGPA Distribution</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={cgpaBuckets}>
              <XAxis dataKey="range" tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Students">
                {cgpaBuckets.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Skills + Pie */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        <Card>
          <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 16 }}>Top Skills Across Students</div>
          {skillData.map(({ skill, count }, i) => (
            <div key={skill} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                <span style={{ fontWeight: 500 }}>{skill}</span>
                <span style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{count}/{students.length} students</span>
              </div>
              <ProgressBar value={count} max={students.length} color={CHART_COLORS[i % CHART_COLORS.length]} />
            </div>
          ))}
        </Card>

        <Card>
          <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 8 }}>Application Statuses</div>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {pieData.map(({ name, value }, i) => (
                  <div key={name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)' }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: CHART_COLORS[i], display: 'inline-block' }} />
                      {name}
                    </span>
                    <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center', paddingTop: 40 }}>No applications yet</div>
          )}
        </Card>
      </div>
    </div>
  );
}
