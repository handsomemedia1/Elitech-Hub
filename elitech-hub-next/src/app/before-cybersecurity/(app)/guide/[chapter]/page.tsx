'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { CHAPTERS, PARTS, BOOK_METADATA } from '@/data/beforeCybersecurityData';

export default function ChapterReaderPage() {
  const params = useParams();
  const slug = params?.chapter as string;

  const [readChapters, setReadChapters] = useState<number[]>([]);

  const chapterIndex = CHAPTERS.findIndex((c) => c.slug === slug);
  const chapter = CHAPTERS[chapterIndex];

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bc_read_chapters');
      if (stored) {
        setReadChapters(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  if (!chapter) {
    notFound();
  }

  const part = PARTS.find((p) => p.number === chapter.partNumber);
  const isRead = readChapters.includes(chapter.number);

  const prevChapter = chapterIndex > 0 ? CHAPTERS[chapterIndex - 1] : null;
  const nextChapter = chapterIndex < CHAPTERS.length - 1 ? CHAPTERS[chapterIndex + 1] : null;

  const toggleReadStatus = () => {
    let updated: number[];
    if (isRead) {
      updated = readChapters.filter((n) => n !== chapter.number);
    } else {
      updated = [...readChapters, chapter.number];
    }
    setReadChapters(updated);
    try {
      localStorage.setItem('bc_read_chapters', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  return (
    <article style={{
      maxWidth: '820px',
      margin: '0 auto',
      color: '#E4E4E7',
      lineHeight: '1.75',
      fontSize: '1.05rem',
      paddingBottom: '5rem',
    }}>
      {/* Top Breadcrumbs & Chapter Controls */}
      <nav style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        paddingBottom: '1.25rem',
        borderBottom: '1px solid #1E1E24',
        marginBottom: '2.5rem',
        fontSize: '0.85rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#71717A' }}>
          <Link href="/before-cybersecurity/guide" style={{ color: '#8E8E93', textDecoration: 'none' }}>
            Guide Index
          </Link>
          <span>/</span>
          <span style={{ color: '#A1A1AA' }}>Part 0{part?.number}</span>
          <span>/</span>
          <span style={{ color: '#C3151C', fontWeight: 600 }}>Chapter {chapter.number}</span>
        </div>

        <button
          onClick={toggleReadStatus}
          style={{
            background: isRead ? 'rgba(16, 185, 129, 0.15)' : '#16161B',
            border: `1px solid ${isRead ? 'rgba(16, 185, 129, 0.4)' : '#272730'}`,
            color: isRead ? '#10B981' : '#A1A1AA',
            padding: '0.35rem 0.85rem',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'all 0.15s',
          }}
        >
          {isRead ? '✓ Completed' : '○ Mark as Read'}
        </button>
      </nav>

      {/* Chapter Title & Metadata */}
      <header style={{ marginBottom: '2.5rem' }}>
        <div style={{
          fontSize: '0.8rem',
          color: '#C3151C',
          fontWeight: 700,
          fontFamily: 'monospace',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '0.5rem',
        }}>
          PART 0{part?.number} // {part?.title.toUpperCase()}
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 2.75rem)',
          fontWeight: 800,
          color: '#FFFFFF',
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          marginBottom: '0.75rem',
        }}>
          {chapter.title}
        </h1>

        {chapter.subtitle && (
          <div style={{
            fontSize: '1.2rem',
            color: '#A1A1AA',
            lineHeight: 1.5,
            marginBottom: '1rem',
          }}>
            {chapter.subtitle}
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: '1.25rem',
          fontSize: '0.85rem',
          color: '#71717A',
          fontFamily: 'monospace',
          borderTop: '1px solid #1E1E24',
          paddingTop: '0.75rem',
        }}>
          <span>CH. 0{chapter.number}</span>
          <span>EST. READ: {chapter.readTimeMinutes} MIN</span>
          <span>AUTHOR: {BOOK_METADATA.author}</span>
        </div>
      </header>

      {/* Key Principle Callout */}
      <div style={{
        backgroundColor: '#121216',
        borderLeft: '4px solid #C3151C',
        borderRadius: '0 8px 8px 0',
        padding: '1.5rem',
        marginBottom: '2.5rem',
      }}>
        <div style={{
          fontSize: '0.75rem',
          color: '#C3151C',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '0.35rem',
        }}>
          Core Principle
        </div>
        <div style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.5 }}>
          &ldquo;{chapter.keyPrinciple}&rdquo;
        </div>
      </div>

      {/* Main Chapter Text Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
        {chapter.content.map((paragraph, idx) => (
          <p key={idx} style={{ margin: 0, color: '#D4D4D8' }}>
            {paragraph}
          </p>
        ))}
      </div>

      {/* Analogy or Figure Box */}
      {chapter.analogyOrFigure && (
        <div style={{
          backgroundColor: '#0E0E12',
          border: '1px solid #202028',
          borderRadius: '10px',
          padding: '1.75rem',
          marginBottom: '3rem',
        }}>
          <div style={{ fontSize: '0.75rem', color: '#C3151C', fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            INTUITIVE CONCEPTUAL MODEL
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
            {chapter.analogyOrFigure.title}
          </h2>
          <p style={{ color: '#8E8E93', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            {chapter.analogyOrFigure.caption}
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {chapter.analogyOrFigure.keyPoints.map((pt, i) => (
              <li key={i} style={{ color: '#C4C4C8', fontSize: '0.9rem', display: 'flex', gap: '0.6rem' }}>
                <span style={{ color: '#C3151C', fontWeight: 'bold' }}>•</span> {pt}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Practical Lab Exercise Worksheet */}
      {chapter.exercise && (
        <div style={{
          backgroundColor: '#0D0D12',
          border: '1px solid rgba(195, 21, 28, 0.4)',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '3rem',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #202028', paddingBottom: '0.75rem' }}>
            <span style={{ background: '#C3151C', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '4px', textTransform: 'uppercase' }}>
              PRACTICAL EXERCISE 0{chapter.exercise.number}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#71717A', fontFamily: 'monospace' }}>OWNED LAB SYSTEM ONLY</span>
          </div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>
            {chapter.exercise.title}
          </h2>

          <div style={{ color: '#A1A1AA', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            <strong>Objective:</strong> {chapter.exercise.objective}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: '0.6rem' }}>
              Action Steps:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {chapter.exercise.steps.map((st, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', color: '#E4E4E7', fontSize: '0.95rem' }}>
                  <span style={{ color: '#C3151C', fontWeight: 700, fontFamily: 'monospace' }}>[{i + 1}]</span>
                  <span>{st}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#121217', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid #10B981' }}>
            <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Observation & Key Takeaway
            </div>
            <div style={{ color: '#D4D4D8', fontSize: '0.9rem' }}>
              {chapter.exercise.takeaway}
            </div>
          </div>
        </div>
      )}

      {/* Key Takeaways */}
      <div style={{
        backgroundColor: '#0E0E12',
        border: '1px solid #1E1E24',
        borderRadius: '10px',
        padding: '1.75rem',
        marginBottom: '2.5rem',
      }}>
        <div style={{ fontSize: '0.8rem', color: '#C3151C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
          Chapter Summary // Key Takeaways
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {chapter.keyTakeaways.map((point, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: '#E4E4E7', fontSize: '0.95rem' }}>
              <span style={{ color: '#10B981', fontWeight: 'bold' }}>✓</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Discussion & Reflection Questions */}
      {chapter.discussionQuestions && chapter.discussionQuestions.length > 0 && (
        <div style={{
          backgroundColor: '#0D0D10',
          border: '1px solid #1A1A20',
          borderRadius: '10px',
          padding: '1.5rem',
          marginBottom: '3rem',
        }}>
          <div style={{ fontSize: '0.8rem', color: '#71717A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
            Self-Inquiry & Reflection Questions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {chapter.discussionQuestions.map((q, i) => (
              <div key={i} style={{ color: '#A1A1AA', fontSize: '0.9rem', fontStyle: 'italic' }}>
                &ldquo;{q}&rdquo;
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Previous / Next Chapter Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '2rem',
        borderTop: '1px solid #1E1E24',
        gap: '1rem',
      }}>
        {prevChapter ? (
          <Link
            href={`/before-cybersecurity/guide/${prevChapter.slug}`}
            style={{
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.2rem',
            }}
          >
            <span style={{ fontSize: '0.75rem', color: '#71717A', textTransform: 'uppercase' }}>← Previous Chapter</span>
            <span style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.95rem' }}>{prevChapter.title}</span>
          </Link>
        ) : (
          <div />
        )}

        <Link
          href="/before-cybersecurity/guide"
          style={{
            color: '#8E8E93',
            fontSize: '0.85rem',
            textDecoration: 'none',
            border: '1px solid #24242A',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
          }}
        >
          All Chapters
        </Link>

        {nextChapter ? (
          <Link
            href={`/before-cybersecurity/guide/${nextChapter.slug}`}
            style={{
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '0.2rem',
              textAlign: 'right',
            }}
          >
            <span style={{ fontSize: '0.75rem', color: '#71717A', textTransform: 'uppercase' }}>Next Chapter →</span>
            <span style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.95rem' }}>{nextChapter.title}</span>
          </Link>
        ) : (
          <Link
            href="/before-cybersecurity/roadmap"
            style={{
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '0.2rem',
              textAlign: 'right',
            }}
          >
            <span style={{ fontSize: '0.75rem', color: '#C3151C', textTransform: 'uppercase' }}>Completed Guide →</span>
            <span style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.95rem' }}>Open 30/60/90 Roadmap</span>
          </Link>
        )}
      </div>
    </article>
  );
}
