'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ARCHETYPES, ArchetypeProfile, ScoreResult } from '@/data/beforeCybersecurityAssessment';

export default function AssessmentResultsPage() {
  const [result, setResult] = useState<ScoreResult | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bc_assessment_result');
      if (stored) {
        setResult(JSON.parse(stored));
      }
    } catch {
      // Fallback
    }
  }, []);

  const primary: ArchetypeProfile = result?.topArchetype || ARCHETYPES.defender;
  const secondary: ArchetypeProfile = result?.secondaryArchetype || ARCHETYPES.investigator;

  const dimensionLabels: Record<string, string> = {
    systems_thinking: 'Systems Thinking & Architecture',
    curiosity_investigation: 'Investigative Curiosity & Telemetry',
    defensive_hardening: 'Defensive Hardening & Blue Team',
    offensive_inquiry: 'Offensive Inquiry & Edge Cases',
    risk_governance: 'Risk, Governance & Law',
    human_factors: 'Human Factors & Communication',
    engineering_building: 'Engineering & Automation',
    structured_organization: 'Structured Process & Audit',
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0A0A',
      color: '#F5F5F7',
      fontFamily: 'var(--font-inter), system-ui, sans-serif',
      paddingBottom: '5rem',
    }}>
      {/* Top Bar */}
      <header style={{
        padding: '1.25rem 2rem',
        borderBottom: '1px solid #1F1F24',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#0D0D10',
      }}>
        <Link
          href="/before-cybersecurity"
          style={{ textDecoration: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          <span style={{
            background: '#C3151C',
            color: '#fff',
            fontSize: '0.7rem',
            fontWeight: 700,
            padding: '0.2rem 0.5rem',
            borderRadius: '4px',
            textTransform: 'uppercase',
          }}>
            Results
          </span>
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>BEFORE CYBERSECURITY</span>
        </Link>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link
            href="/before-cybersecurity/assessment"
            style={{ color: '#8E8E93', fontSize: '0.85rem', textDecoration: 'none' }}
          >
            ↻ Retake Assessment
          </Link>
          <Link
            href="/before-cybersecurity/dashboard"
            style={{
              background: '#18181B',
              border: '1px solid #2B2B30',
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '0.45rem 1rem',
              borderRadius: '6px',
              textDecoration: 'none',
            }}
          >
            Go to Dashboard
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '3.5rem 1.5rem 0' }}>
        {/* Banner */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{
            display: 'inline-block',
            color: '#C3151C',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '0.75rem',
          }}>
            Orientation Assessment Summary
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: 800,
            color: '#FFFFFF',
            lineHeight: 1.2,
            marginBottom: '1rem',
          }}>
            Your Starting Archetype: <span style={{ color: '#C3151C' }}>{primary.name}</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#A1A1AA', maxWidth: '720px', margin: '0 auto' }}>
            {primary.tagline}
          </p>
        </div>

        {/* Primary Profile Card */}
        <div style={{
          backgroundColor: '#0E0E11',
          border: '1px solid #24242A',
          borderRadius: '14px',
          padding: '2.5rem',
          marginBottom: '2rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem', borderBottom: '1px solid #1F1F24', paddingBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#C3151C', fontWeight: 700, fontFamily: 'monospace' }}>PRIMARY ARCHETYPE</span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginTop: '0.25rem' }}>{primary.name}</h2>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#71717A' }}>
              Secondary: <strong style={{ color: '#A1A1AA' }}>{secondary.name}</strong>
            </div>
          </div>

          <p style={{ color: '#D4D4D8', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '2rem' }}>
            {primary.description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.75rem' }}>
            <div>
              <h3 style={{ fontSize: '0.9rem', color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                Your Transferable Strengths
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {primary.transferableStrengths.map((str) => (
                  <li key={str} style={{ color: '#E4E4E7', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#10B981', fontWeight: 'bold' }}>✓</span> {str}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: '0.9rem', color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                Recommended Starting Roles
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {primary.recommendedRoles.map((role) => (
                  <li key={role} style={{ color: '#E4E4E7', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#C3151C', fontWeight: 'bold' }}>→</span> {role}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Dimension Breakdown Bar Chart */}
        <div style={{
          backgroundColor: '#0E0E11',
          border: '1px solid #202026',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2.5rem',
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '1.5rem' }}>
            Cognitive & Technical Dimension Balance
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {Object.entries(result?.dimensionScores || {
              systems_thinking: 9,
              curiosity_investigation: 12,
              defensive_hardening: 15,
              offensive_inquiry: 6,
              risk_governance: 6,
              human_factors: 3,
            }).map(([dim, score]) => {
              const label = dimensionLabels[dim] || dim;
              const maxPossible = 18;
              const pct = Math.min(100, Math.round((score / maxPossible) * 100));

              return (
                <div key={dim}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    <span style={{ color: '#D4D4D8', fontWeight: 500 }}>{label}</span>
                    <span style={{ color: '#71717A', fontFamily: 'monospace' }}>{pct}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#1A1A22', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      backgroundColor: pct > 60 ? '#C3151C' : pct > 35 ? '#EAB308' : '#3F3F46',
                      borderRadius: '4px',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Free vs Full Experience Upgrade Card */}
        <div style={{
          background: 'linear-gradient(180deg, #141418 0%, #0D0D10 100%)',
          border: '2px solid #C3151C',
          borderRadius: '16px',
          padding: '3rem 2.5rem',
          boxShadow: '0 15px 45px rgba(195, 21, 28, 0.12)',
          textAlign: 'center',
        }}>
          <div style={{
            display: 'inline-block',
            background: '#C3151C',
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '0.3rem 0.85rem',
            borderRadius: '9999px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '1rem',
          }}>
            Unlock Complete Access
          </div>

          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
            Turn Your Profile Into Real Capability
          </h2>

          <p style={{ color: '#A1A1AA', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
            You have discovered your baseline archetype. Unlock the complete <strong>Before Cybersecurity</strong> system to access your full personalized report, 30/60/90-day deliverable roadmap, 29-chapter interactive guide, and downloadable PDF edition.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            textAlign: 'left',
            maxWidth: '780px',
            margin: '0 auto 2.5rem',
          }}>
            <div style={{ background: '#0E0E12', border: '1px solid #202026', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ color: '#10B981', fontWeight: 'bold', marginBottom: '0.25rem' }}>✓ Full 29-Chapter Guide</div>
              <div style={{ color: '#71717A', fontSize: '0.8rem' }}>10 parts, exercises, and web reader</div>
            </div>
            <div style={{ background: '#0E0E12', border: '1px solid #202026', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ color: '#10B981', fontWeight: 'bold', marginBottom: '0.25rem' }}>✓ Downloadable PDF</div>
              <div style={{ color: '#71717A', fontSize: '0.8rem' }}>Offline standalone publication edition</div>
            </div>
            <div style={{ background: '#0E0E12', border: '1px solid #202026', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ color: '#10B981', fontWeight: 'bold', marginBottom: '0.25rem' }}>✓ 30/60/90 Deliverable Plan</div>
              <div style={{ color: '#71717A', fontSize: '0.8rem' }}>Actionable milestones for your archetype</div>
            </div>
            <div style={{ background: '#0E0E12', border: '1px solid #202026', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ color: '#10B981', fontWeight: 'bold', marginBottom: '0.25rem' }}>✓ Curated Resource Library</div>
              <div style={{ color: '#71717A', fontSize: '0.8rem' }}>Authoritative links for your starting focus</div>
            </div>
          </div>

          <Link
            href="/before-cybersecurity#pricing"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              backgroundColor: '#C3151C',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '1.05rem',
              padding: '1rem 2.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(195, 21, 28, 0.4)',
            }}
          >
            Unlock Full Experience (₦25,000 / $29) →
          </Link>
          <div style={{ fontSize: '0.8rem', color: '#71717A', marginTop: '1rem' }}>
            Instant access via Paystack, bank cards, and international checkout.
          </div>
        </div>
      </main>
    </div>
  );
}
