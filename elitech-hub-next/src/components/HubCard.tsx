'use client';
import Link from 'next/link';
import { CSSProperties } from 'react';

interface HubCardProps {
  href: string;
  label: string;
  sub: string;
  color: string;
  icon?: string;
  cta?: string;
  features?: string[];
}

export function HubCard({ href, label, sub, color, icon, cta = 'View details →', features }: HubCardProps) {
  return (
    <a
      href={href}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        background: 'var(--color-bg-panel)',
        border: `1px solid ${color}33`,
        borderRadius: '14px',
        padding: '1.5rem',
        textDecoration: 'none',
        transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s',
      }}
      onMouseOver={e => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.transform = 'translateY(-4px)';
        el.style.borderColor = color + '88';
        el.style.boxShadow = `0 12px 30px ${color}22`;
      }}
      onMouseOut={e => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.transform = '';
        el.style.borderColor = color + '33';
        el.style.boxShadow = 'none';
      }}
    >
      {icon && <span style={{ fontSize: '1.75rem' }}>{icon}</span>}
      <span style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem' }}>{label}</span>
      <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>{sub}</span>
      {features && (
        <ul style={{ listStyle: 'none', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {features.map((f, i) => (
            <li key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem' }}>✓ {f}</li>
          ))}
        </ul>
      )}
      <span style={{ color, fontWeight: 700, fontSize: '0.82rem', marginTop: '0.5rem' }}>{cta}</span>
    </a>
  );
}
