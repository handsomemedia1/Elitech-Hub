'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CHAPTERS, BOOK_METADATA } from '@/data/beforeCybersecurityData';
import { ScoreResult } from '@/data/beforeCybersecurityAssessment';

export default function DashboardPage() {
  const [assessmentResult, setAssessmentResult] = useState<ScoreResult | null>(null);
  const [readChapters, setReadChapters] = useState<number[]>([]);
  const [entitlement, setEntitlement] = useState<{ hasAccess: boolean; authenticated: boolean } | null>(null);

  useEffect(() => {
    // 1. Read assessment result
    try {
      const stored = localStorage.getItem('bc_assessment_result');
      if (stored) {
        setAssessmentResult(JSON.parse(stored));
      }
    } catch {
      // Ignore storage errors
    }

    // 2. Read chapter progress
    try {
      const read = localStorage.getItem('bc_read_chapters');
      if (read) {
        setReadChapters(JSON.parse(read));
      }
    } catch {
      // Ignore storage errors
    }

    // 3. Fetch user entitlement status
    fetch('/api/before-cybersecurity/entitlement')
      .then((r) => r.json())
      .then((data) => setEntitlement(data))
      .catch(() => setEntitlement({ hasAccess: false, authenticated: false }));
  }, []);

  const totalChapters = CHAPTERS.length;
  const readCount = readChapters.length;
  const readingProgressPct = Math.round((readCount / totalChapters) * 100);

  const nextChapter = CHAPTERS.find((ch) => !readChapters.includes(ch.number)) || CHAPTERS[0];
  const isAssessmentComplete = !!assessmentResult;
  const archetype = assessmentResult?.topArchetype;

  return (
    <div>
      {/* Welcome Banner */}
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
          Interactive Workspace
        </div>
        <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
          Welcome to Before Cybersecurity
        </h1>
        <p style={{ color: '#8E8E93', fontSize: '1.05rem', maxWidth: '720px' }}>
          Your digital orientation headquarters. Track your reading progress, complete your diagnostic assessment, and build your personalized learning roadmap.
        </p>
      </div>

      {/* Recommended Next Step Callout */}
      <div style={{
        background: 'linear-gradient(90deg, #16161B 0%, #101014 100%)',
        borderLeft: '4px solid #C3151C',
        borderTop: '1px solid #202026',
        borderRight: '1px solid #202026',
        borderBottom: '1px solid #202026',
        borderRadius: '0 10px 10px 0',
        padding: '1.5rem 1.75rem',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2.5rem',
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#C3151C', fontWeight: 700, letterSpacing: '0.08em' }}>
            Recommended Action
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginTop: '0.2rem' }}>
            {!isAssessmentComplete
              ? 'Complete Your Diagnostic Assessment'
              : `Continue Reading: Chapter ${nextChapter.number} — ${nextChapter.title}`}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#A1A1AA', marginTop: '0.2rem' }}>
            {!isAssessmentComplete
              ? 'Answer 14 practical questions to identify your starting archetype.'
              : `${nextChapter.readTimeMinutes} min read // ${nextChapter.subtitle || nextChapter.summary.slice(0, 75)}...`}
          </div>
        </div>

        <Link
          href={!isAssessmentComplete ? '/before-cybersecurity/assessment' : `/before-cybersecurity/guide/${nextChapter.slug}`}
          style={{
            backgroundColor: '#C3151C',
            color: '#FFFFFF',
            padding: '0.65rem 1.35rem',
            borderRadius: '6px',
            fontSize: '0.9rem',
            fontWeight: 600,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {!isAssessmentComplete ? 'Start Assessment →' : 'Read Next Chapter →'}
        </Link>
      </div>

      {/* Progress Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem',
      }}>
        {/* Guide Reading Progress Card */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>Guide Progress</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: '0.4rem 0' }}>
            {readCount} of {totalChapters} Chapters
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: '#1F1F26', borderRadius: '3px', overflow: 'hidden', margin: '0.75rem 0' }}>
            <div style={{ width: `${readingProgressPct}%`, height: '100%', backgroundColor: '#C3151C' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
            <span style={{ fontSize: '0.8rem', color: '#71717A' }}>{readingProgressPct}% completed</span>
            <Link href="/before-cybersecurity/guide" style={actionLinkStyle}>
              Open Guide Index →
            </Link>
          </div>
        </div>

        {/* Assessment Status Card */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>Your Assessment</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: '0.4rem 0' }}>
            {isAssessmentComplete ? archetype?.name : 'Not Started'}
          </div>
          <p style={{ color: '#8E8E93', fontSize: '0.85rem', lineHeight: '1.5', margin: '0.5rem 0 1rem' }}>
            {isAssessmentComplete
              ? archetype?.tagline
              : 'Discover your cognitive problem-solving tendencies and starting focus.'}
          </p>
          <div style={{ marginTop: 'auto' }}>
            <Link
              href={isAssessmentComplete ? '/before-cybersecurity/results' : '/before-cybersecurity/assessment'}
              style={actionLinkStyle}
            >
              {isAssessmentComplete ? 'View Results & Archetype →' : 'Take Free Assessment →'}
            </Link>
          </div>
        </div>

        {/* Report Card */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>Personalized Report</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: '0.4rem 0' }}>
            {isAssessmentComplete ? 'Generated' : 'Awaiting Assessment'}
          </div>
          <p style={{ color: '#8E8E93', fontSize: '0.85rem', lineHeight: '1.5', margin: '0.5rem 0 1rem' }}>
            {isAssessmentComplete
              ? 'Detailed breakdown of strengths, knowledge gaps, and recommended work roles.'
              : 'Complete your assessment to unlock your personalized report.'}
          </p>
          <div style={{ marginTop: 'auto' }}>
            <Link href="/before-cybersecurity/report" style={actionLinkStyle}>
              {isAssessmentComplete ? 'Open Report →' : 'View Report Preview →'}
            </Link>
          </div>
        </div>

        {/* Roadmap Card */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>30/60/90-Day Roadmap</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: '0.4rem 0' }}>
            Deliverables
          </div>
          <p style={{ color: '#8E8E93', fontSize: '0.85rem', lineHeight: '1.5', margin: '0.5rem 0 1rem' }}>
            Actionable milestones across Days 1–30 (Understand), Days 31–60 (Explore), and Days 61–90 (Build).
          </p>
          <div style={{ marginTop: 'auto' }}>
            <Link href="/before-cybersecurity/roadmap" style={actionLinkStyle}>
              View Milestones →
            </Link>
          </div>
        </div>
      </div>

      {/* Product Access & Entitlement Summary */}
      <div style={{
        backgroundColor: '#0E0E12',
        border: '1px solid #1F1F24',
        borderRadius: '12px',
        padding: '1.75rem',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.5rem',
        marginBottom: '3rem',
      }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Entitlement Tier
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginTop: '0.2rem' }}>
            {entitlement?.hasAccess ? 'Full Product Edition (Unlocked)' : 'Standard Free Orientation'}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#8E8E93', marginTop: '0.2rem' }}>
            {entitlement?.hasAccess
              ? 'You have active product access to all 29 chapters, PDF downloads, report, and roadmap.'
              : 'You are viewing the free orientation experience. Upgrade to unlock the full guide and PDF.'}
          </div>
        </div>

        {!entitlement?.hasAccess && (
          <Link
            href="/before-cybersecurity#pricing"
            style={{
              backgroundColor: '#1E1E24',
              color: '#FFFFFF',
              border: '1px solid #33333E',
              padding: '0.65rem 1.25rem',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Upgrade to Full Edition
          </Link>
        )}
      </div>

      {/* Core Principle of the Day */}
      <div style={{
        backgroundColor: '#0D0D10',
        border: '1px solid #1B1B20',
        borderRadius: '10px',
        padding: '1.5rem',
      }}>
        <div style={{ fontSize: '0.75rem', color: '#C3151C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
          Foundational Mindset // From Chapter 10
        </div>
        <div style={{ fontSize: '1.05rem', color: '#E4E4E7', fontStyle: 'italic', marginBottom: '0.4rem' }}>
          &ldquo;Don&apos;t collect tools. Learn problems. Tools change every few years; underlying network and operating system protocols remain stable for decades.&rdquo;
        </div>
        <div style={{ fontSize: '0.8rem', color: '#71717A' }}>
          — Elijah Adeyeye, {BOOK_METADATA.title}
        </div>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  backgroundColor: '#0E0E12',
  border: '1px solid #1F1F26',
  borderRadius: '12px',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
};

const cardHeaderStyle: React.CSSProperties = {
  color: '#8E8E93',
  fontSize: '0.8rem',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontWeight: 600,
};

const actionLinkStyle: React.CSSProperties = {
  color: '#C3151C',
  textDecoration: 'none',
  fontSize: '0.85rem',
  fontWeight: 600,
};
