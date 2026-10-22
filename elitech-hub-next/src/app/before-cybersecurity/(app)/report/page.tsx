'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ScoreResult, ARCHETYPES } from '@/data/beforeCybersecurityAssessment';

export default function ReportPage() {
  const [assessmentResult, setAssessmentResult] = useState<ScoreResult | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bc_assessment_result');
      if (stored) {
        setAssessmentResult(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  const primary = assessmentResult?.topArchetype || ARCHETYPES.defender;
  const secondary = assessmentResult?.secondaryArchetype || ARCHETYPES.investigator;
  const isAssessmentComplete = !!assessmentResult;

  return (
    <div>
      {/* Page Header */}
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
          Diagnostic Report
        </div>
        <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
          Personalized Orientation Report
        </h1>
        <p style={{ color: '#8E8E93', fontSize: '1.05rem', maxWidth: '720px' }}>
          A tailored analysis of your cognitive instincts, transferable strengths, knowledge gaps, and recommended initial work roles across the NIST NICE framework.
        </p>
      </div>

      {!isAssessmentComplete ? (
        // State when assessment has not yet been taken
        <div style={{
          backgroundColor: '#0E0E12',
          border: '1px solid #202026',
          borderRadius: '14px',
          padding: '3.5rem 2rem',
          textAlign: 'center',
          maxWidth: '680px',
          margin: '2rem auto',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧭</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>
            Assessment Not Yet Completed
          </h2>
          <p style={{ color: '#8E8E93', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            Your personalized report is generated directly from your assessment answers. Take the diagnostic assessment (approximately 14 questions, 5 minutes) to discover your archetype and populate this analysis.
          </p>
          <Link
            href="/before-cybersecurity/assessment"
            style={{
              display: 'inline-block',
              backgroundColor: '#C3151C',
              color: '#fff',
              fontWeight: 700,
              padding: '0.85rem 2rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.95rem',
            }}
          >
            Start Diagnostic Assessment Now →
          </Link>
        </div>
      ) : (
        // Report Content when assessment is completed
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Executive Summary Card */}
          <div style={{
            backgroundColor: '#0E0E12',
            border: '1px solid #24242A',
            borderRadius: '12px',
            padding: '2.5rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem', borderBottom: '1px solid #1E1E24', paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#C3151C', fontWeight: 700, fontFamily: 'monospace' }}>PRIMARY PROFILE</span>
                <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff', margin: '0.2rem 0' }}>
                  {primary.name}
                </h2>
                <div style={{ color: '#A1A1AA', fontSize: '1rem' }}>{primary.tagline}</div>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#71717A', textAlign: 'right' }}>
                Secondary Alignment:<br />
                <strong style={{ color: '#E4E4E7' }}>{secondary.name}</strong>
              </div>
            </div>

            <p style={{ color: '#D4D4D8', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '2rem' }}>
              {primary.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {/* Transferable Strengths */}
              <div>
                <h3 style={{ fontSize: '0.9rem', color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                  Your Transferable Strengths
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {primary.transferableStrengths.map((s) => (
                    <li key={s} style={{ color: '#E4E4E7', fontSize: '0.9rem', display: 'flex', gap: '0.5rem' }}>
                      <span style={{ color: '#10B981', fontWeight: 'bold' }}>✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Work Roles */}
              <div>
                <h3 style={{ fontSize: '0.9rem', color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                  Recommended NIST NICE Work Roles
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {primary.recommendedRoles.map((r) => (
                    <li key={r} style={{ color: '#E4E4E7', fontSize: '0.9rem', display: 'flex', gap: '0.5rem' }}>
                      <span style={{ color: '#C3151C', fontWeight: 'bold' }}>→</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* First Learning Priorities & Knowledge Gaps */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}>
            <div style={{
              backgroundColor: '#0E0E12',
              border: '1px solid #1F1F24',
              borderRadius: '12px',
              padding: '2rem',
            }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
                First Learning Priorities
              </h3>
              <p style={{ color: '#8E8E93', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Focus your next 30 days on these concrete concepts before jumping into complex tools.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {primary.firstLearningPriorities.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.6rem', color: '#D4D4D8', fontSize: '0.9rem' }}>
                    <span style={{ color: '#C3151C', fontWeight: 700 }}>0{i + 1}.</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              backgroundColor: '#0E0E12',
              border: '1px solid #1F1F24',
              borderRadius: '12px',
              padding: '2rem',
            }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
                Suggested Lab Deliverables
              </h3>
              <p style={{ color: '#8E8E93', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Proof-of-work artifacts you should produce to establish genuine competence.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {primary.initialDeliverables.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.6rem', color: '#D4D4D8', fontSize: '0.9rem' }}>
                    <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Book Anchor Reference */}
          <div style={{
            backgroundColor: '#121216',
            border: '1px solid #202028',
            borderRadius: '10px',
            padding: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#C3151C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Book Connection
              </div>
              <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.95rem' }}>
                {primary.bookReference}
              </div>
            </div>
            <Link
              href="/before-cybersecurity/roadmap"
              style={{
                backgroundColor: '#C3151C',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 600,
                padding: '0.55rem 1.15rem',
                borderRadius: '6px',
                textDecoration: 'none',
              }}
            >
              Open 30/60/90 Roadmap →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
