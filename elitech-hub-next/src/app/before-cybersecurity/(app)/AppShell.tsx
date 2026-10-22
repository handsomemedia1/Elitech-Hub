'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BeforeCybersecurityAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Overview', path: '/before-cybersecurity/dashboard', icon: '📊' },
    { name: 'My Assessment', path: '/before-cybersecurity/assessment', icon: '🧭' },
    { name: 'My Report', path: '/before-cybersecurity/report', icon: '📑' },
    { name: 'My Roadmap', path: '/before-cybersecurity/roadmap', icon: '🎯' },
    { name: 'The Guide', path: '/before-cybersecurity/guide', icon: '📖' },
    { name: 'Resource Library', path: '/before-cybersecurity/resources', icon: '🧰' },
    { name: 'Account & Access', path: '/before-cybersecurity/account', icon: '👤' },
  ];

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#0A0A0A',
      color: '#F5F5F7',
      fontFamily: 'var(--font-inter), system-ui, sans-serif',
    }}>
      {/* Desktop Sidebar */}
      <aside style={{
        width: '270px',
        backgroundColor: '#0D0D10',
        borderRight: '1px solid #1E1E24',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.75rem 1.25rem',
        position: 'sticky',
        top: 0,
        height: '100vh',
        boxSizing: 'border-box',
        zIndex: 50,
      }}>
        {/* Brand Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            color: '#C3151C',
            fontWeight: 700,
            letterSpacing: '0.1em',
            marginBottom: '0.35rem',
          }}>
            Product Workspace
          </div>
          <Link
            href="/before-cybersecurity"
            style={{
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '1.15rem',
              color: '#FFFFFF',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              display: 'block',
            }}
          >
            BEFORE<br />CYBERSECURITY
          </Link>
          <div style={{
            fontSize: '0.75rem',
            color: '#71717A',
            marginTop: '0.35rem',
          }}>
            Orientation Edition v1.0
          </div>
        </div>

        {/* Primary Navigation */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.path || (item.path === '/before-cybersecurity/guide' && pathname.startsWith('/before-cybersecurity/guide/'));
            return (
              <Link
                key={item.name}
                href={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  color: isActive ? '#FFFFFF' : '#8E8E93',
                  backgroundColor: isActive ? 'rgba(195, 21, 28, 0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(195, 21, 28, 0.3)' : '1px solid transparent',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontSize: '1.05rem' }}>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Hub Return */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '1.5rem',
          borderTop: '1px solid #1E1E24',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}>
          <Link
            href="/before-cybersecurity"
            style={{
              color: '#A1A1AA',
              textDecoration: 'none',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            ↗ Public Product Page
          </Link>
          <Link
            href="/"
            style={{
              color: '#71717A',
              textDecoration: 'none',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            ← Back to Elitech-Hub
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile Header Bar */}
        <header style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid #1E1E24',
          backgroundColor: '#0D0D10',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              background: '#C3151C',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: '0.15rem 0.45rem',
              borderRadius: '4px',
              textTransform: 'uppercase',
            }}>
              App
            </span>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Before Cybersecurity</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: '#18181C',
              border: '1px solid #2B2B32',
              color: '#fff',
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            {mobileMenuOpen ? '✕ Close' : '☰ Menu'}
          </button>
        </header>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div style={{
            backgroundColor: '#121216',
            borderBottom: '1px solid #222228',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}>
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={closeMobile}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '6px',
                    color: isActive ? '#fff' : '#8E8E93',
                    backgroundColor: isActive ? 'rgba(195, 21, 28, 0.15)' : 'transparent',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {item.icon} {item.name}
                </Link>
              );
            })}
            <div style={{ borderTop: '1px solid #202026', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
              <Link href="/" onClick={closeMobile} style={{ color: '#71717A', fontSize: '0.85rem', textDecoration: 'none' }}>
                ← Return to Elitech-Hub
              </Link>
            </div>
          </div>
        )}

        {/* Main Routed Page Container */}
        <main style={{
          flex: 1,
          padding: '2.5rem clamp(1.25rem, 3vw, 3rem)',
          maxWidth: '1050px',
          width: '100%',
          boxSizing: 'border-box',
          margin: '0 auto',
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
