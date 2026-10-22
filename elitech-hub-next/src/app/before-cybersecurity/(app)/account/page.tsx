'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface UserEntitlementData {
  authenticated: boolean;
  hasAccess: boolean;
  reason: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  productVersion?: string;
  grantedAt?: string;
}

export default function AccountPage() {
  const [data, setData] = useState<UserEntitlementData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/before-cybersecurity/entitlement')
      .then((r) => r.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        setData({ authenticated: false, hasAccess: false, reason: 'unauthenticated' });
        setLoading(false);
      });
  }, []);

  const handleResetAssessment = () => {
    if (confirm('Are you sure you want to reset your local assessment answers? This will allow you to retake the diagnostic.')) {
      localStorage.removeItem('bc_assessment_result');
      localStorage.removeItem('bc_assessment_progress');
      alert('Assessment reset. Redirecting...');
      window.location.href = '/before-cybersecurity/assessment';
    }
  };

  const handleClearReadProgress = () => {
    if (confirm('Are you sure you want to reset your chapter reading checkmarks?')) {
      localStorage.removeItem('bc_read_chapters');
      alert('Reading progress reset.');
      window.location.reload();
    }
  };

  return (
    <div style={{ maxWidth: '820px' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(195, 21, 28, 0.1)',
          border: '1px solid rgba(195, 21, 28, 0.25)',
          color: '#FF5A60',
          fontSize: '0.75rem',
          fontWeight: 700,
          padding: '0.25rem 0.65rem',
          borderRadius: '4px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '0.75rem',
        }}>
          Account & Entitlements
        </div>
        <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
          Your Account & Product Access
        </h1>
        <p style={{ color: '#8E8E93', fontSize: '1.05rem' }}>
          Manage your product entitlement, assessment history, and learning data.
        </p>
      </div>

      {/* Access Tier Box */}
      <div style={{
        backgroundColor: '#0E0E12',
        border: '1px solid #1F1F24',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #1E1E24', paddingBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              PRODUCT STATUS
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.25rem' }}>
              Before Cybersecurity
            </div>
          </div>
          <span style={{
            background: data?.hasAccess ? 'rgba(16, 185, 129, 0.15)' : '#1F1F26',
            color: data?.hasAccess ? '#10B981' : '#A1A1AA',
            border: `1px solid ${data?.hasAccess ? 'rgba(16, 185, 129, 0.3)' : '#2B2B34'}`,
            padding: '0.3rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 700,
          }}>
            {data?.hasAccess ? 'Full Product Edition' : 'Free Orientation Mode'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#71717A', textTransform: 'uppercase' }}>Current Version</div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>
              {data?.productVersion || '1.0 (2026 Interactive Edition)'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#71717A', textTransform: 'uppercase' }}>Account Email</div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>
              {loading ? 'Checking...' : data?.user?.email || 'Guest / Local Session'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#71717A', textTransform: 'uppercase' }}>Global Role</div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>
              {data?.user?.role || 'Visitor (Self-Study)'}
            </div>
          </div>
        </div>

        {!data?.hasAccess && (
          <div style={{
            background: '#121216',
            border: '1px solid #202028',
            borderRadius: '8px',
            padding: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <div style={{ color: '#D4D4D8', fontSize: '0.9rem' }}>
              Unlock the complete 29-chapter guide reader, downloadable PDF, and full 30/60/90 roadmap.
            </div>
            <Link
              href="/before-cybersecurity#pricing"
              style={{
                backgroundColor: '#C3151C',
                color: '#fff',
                padding: '0.55rem 1.25rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Get Full Edition →
            </Link>
          </div>
        )}
      </div>

      {/* Learning Data & Reset Controls */}
      <div style={{
        backgroundColor: '#0E0E12',
        border: '1px solid #1F1F24',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem',
      }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
          Session & Learning Data
        </h3>
        <p style={{ color: '#8E8E93', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
          Your assessment responses and chapter reading checkmarks are stored locally on your device to respect your privacy. You can retake the assessment or reset your progress at any time.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <button
            onClick={handleResetAssessment}
            style={{
              backgroundColor: '#16161B',
              border: '1px solid #272730',
              color: '#FFFFFF',
              padding: '0.65rem 1.25rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ↻ Retake Diagnostic Assessment
          </button>

          <button
            onClick={handleClearReadProgress}
            style={{
              backgroundColor: '#16161B',
              border: '1px solid #272730',
              color: '#A1A1AA',
              padding: '0.65rem 1.25rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Clear Reading Checkmarks
          </button>
        </div>
      </div>

      {/* Support & Legal Links */}
      <div style={{
        backgroundColor: '#0E0E12',
        border: '1px solid #1F1F24',
        borderRadius: '12px',
        padding: '2rem',
      }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
          Assistance & Policies
        </h3>
        <p style={{ color: '#8E8E93', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
          If you have questions about your purchase, billing, or access, contact the Elitech-Hub team.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.9rem' }}>
          <Link href="/contact" style={{ color: '#C3151C', textDecoration: 'none', fontWeight: 600 }}>
            Contact Support →
          </Link>
          <Link href="/policies" style={{ color: '#8E8E93', textDecoration: 'none' }}>
            Privacy & Terms →
          </Link>
          <Link href="/security" style={{ color: '#8E8E93', textDecoration: 'none' }}>
            Security Disclosure Policy →
          </Link>
        </div>
      </div>
    </div>
  );
}
