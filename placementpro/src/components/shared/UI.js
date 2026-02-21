import React from 'react';

// ─── CARD ─────────────────────────────────────────────────────────────────────
export function Card({ children, style, className, onClick }) {
  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: 20,
        transition: 'border-color 0.2s, box-shadow 0.2s',
        ...(onClick ? { cursor: 'pointer' } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── BUTTON ───────────────────────────────────────────────────────────────────
const BTN_STYLES = {
  primary:   { background: 'var(--accent)', color: '#fff', border: 'none' },
  secondary: { background: 'var(--card2)', color: 'var(--text)', border: '1px solid var(--border2)' },
  success:   { background: '#064e3b', color: '#6ee7b7', border: '1px solid #059669' },
  danger:    { background: '#7f1d1d', color: '#fca5a5', border: '1px solid #dc2626' },
  ghost:     { background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)' },
  cyan:      { background: '#0c4a6e', color: '#67e8f9', border: '1px solid #0284c7' },
};

export function Btn({ children, onClick, variant = 'primary', style, disabled, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '9px 18px',
        borderRadius: 9,
        fontWeight: 600,
        fontSize: 13,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'var(--font-body)',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        whiteSpace: 'nowrap',
        ...BTN_STYLES[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// ─── PAGE HEADER ──────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px' }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
export function StatCard({ label, value, color = 'var(--accent)', icon, sub }) {
  return (
    <Card style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 80, height: 80, borderRadius: '50%',
        background: color, opacity: 0.07,
      }} />
      {icon && <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>}
      <div style={{
        fontSize: 38, fontWeight: 800, color,
        fontFamily: 'var(--font-mono)', lineHeight: 1,
      }}>
        {value}
      </div>
      <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>{label}</div>
      {sub && <div style={{ color, fontSize: 12, marginTop: 4, fontWeight: 600 }}>{sub}</div>}
    </Card>
  );
}

// ─── FORM FIELD ───────────────────────────────────────────────────────────────
export function Field({ label, children, style }) {
  return (
    <div style={{ ...style }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── BADGE ────────────────────────────────────────────────────────────────────
export function Badge({ children, variant = 'gray' }) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
export function Empty({ icon = '📭', message, sub }) {
  return (
    <Card style={{ textAlign: 'center', padding: '48px 24px' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontWeight: 600, color: 'var(--muted)', fontSize: 15 }}>{message}</div>
      {sub && <div style={{ color: 'var(--muted2)', fontSize: 13, marginTop: 6 }}>{sub}</div>}
    </Card>
  );
}

// ─── DIVIDER ─────────────────────────────────────────────────────────────────
export function Divider({ style }) {
  return <div style={{ borderTop: '1px solid var(--border)', ...style }} />;
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
export function ProgressBar({ value, max, color = 'var(--accent)', style }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ background: 'var(--border)', borderRadius: 4, height: 6, overflow: 'hidden', ...style }}>
      <div style={{ width: `${pct}%`, background: color, height: '100%', borderRadius: 4, transition: 'width 0.6s ease' }} />
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 16, padding: 28, width: '100%', maxWidth: 520,
          animation: 'fadeUp 0.25s ease',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 20, lineHeight: 1, padding: '0 4px' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
