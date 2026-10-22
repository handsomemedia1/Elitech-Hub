'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PARTS, CHAPTERS, BOOK_METADATA } from '@/data/beforeCybersecurityData';

export default function GuideIndexPage() {
  const [readChapters, setReadChapters] = useState<number[]>([]);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<{ type: 'error' | 'success' | 'info'; message: string } | null>(null);

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

  const totalChapters = CHAPTERS.length;
  const completedCount = readChapters.length;
  const progressPct = Math.round((completedCount / totalChapters) * 100);

  const handleDownloadPdf = async () => {
    setDownloadLoading(true);
    setDownloadNotice(null);

    try {
      const res = await fetch('/api/before-cybersecurity/download-pdf');
      const data = await res.json();

      if (res.ok && data.downloadUrl) {
        setDownloadNotice({
          type: 'success',
          message: 'Secure download link generated. Starting download...',
        });
        window.open(data.downloadUrl, '_blank');
      } else if (res.status === 401) {
        setDownloadNotice({
          type: 'error',
          message: 'Authentication required. Please log in to download the standalone PDF edition.',
        });
      } else if (res.status === 403) {
        setDownloadNotice({
          type: 'error',
          message: 'Active product entitlement required. Please unlock the full edition to download the PDF.',
        });
      } else if (data.code === 'FILE_PENDING_STORAGE_UPLOAD') {
        setDownloadNotice({
          type: 'info',
          message:
            'The standalone PDF file is prepared in your project. Once uploaded to the private Supabase Storage bucket "before-cybersecurity-assets", one-click signed downloads will stream directly. In the meantime, you can read every chapter right here in the online reader!',
        });
      } else {
        setDownloadNotice({
          type: 'error',
          message: data.error || 'Failed to download PDF.',
        });
      }
    } catch {
      setDownloadNotice({
        type: 'error',
        message: 'Network error communicating with download server.',
      });
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div>
      {/* Guide Header Banner */}
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
          Complete Field Guide
        </div>
        <h1 style={{ fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
          {BOOK_METADATA.title}
        </h1>
        <p style={{ color: '#8E8E93', fontSize: '1.05rem', maxWidth: '780px', lineHeight: '1.6' }}>
          {BOOK_METADATA.subtitle}. Authored by {BOOK_METADATA.author} ({BOOK_METADATA.authorTitle}).
        </p>
      </div>

      {/* PDF Standalone Card & Progress Tracker */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem',
      }}>
        {/* PDF Download Delivery Card */}
        <div style={{
          backgroundColor: '#0E0E12',
          border: '1px solid #202026',
          borderRadius: '12px',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#C3151C', fontWeight: 700, fontFamily: 'monospace' }}>
                STANDALONE EDITION
              </span>
              <span style={{ fontSize: '0.75rem', background: '#1A1A22', color: '#A1A1AA', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                PDF // 12 Pages / 3.0MB
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
              Download PDF Edition
            </h2>
            <p style={{ color: '#8E8E93', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
              Secure server-side delivery from private Supabase Storage. Offline reading formatted with full figures and tables.
            </p>
          </div>

          <div>
            <button
              onClick={handleDownloadPdf}
              disabled={downloadLoading}
              style={{
                backgroundColor: '#1C1C22',
                border: '1px solid #33333E',
                color: '#FFFFFF',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: downloadLoading ? 'wait' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                width: '100%',
                justifyContent: 'center',
              }}
            >
              {downloadLoading ? 'Checking Entitlement...' : '⬇ Download Private PDF'}
            </button>

            {downloadNotice && (
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                lineHeight: '1.5',
                backgroundColor: downloadNotice.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : downloadNotice.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                color: downloadNotice.type === 'error' ? '#FCA5A5' : downloadNotice.type === 'success' ? '#6EE7B7' : '#93C5FD',
                border: `1px solid ${downloadNotice.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : downloadNotice.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
              }}>
                {downloadNotice.message}
              </div>
            )}
          </div>
        </div>

        {/* Reading Progress Card */}
        <div style={{
          backgroundColor: '#0E0E12',
          border: '1px solid #202026',
          borderRadius: '12px',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#71717A', fontWeight: 700, fontFamily: 'monospace' }}>
              READING STATUS
            </span>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff', margin: '0.5rem 0' }}>
              {progressPct}% <span style={{ fontSize: '1rem', fontWeight: 500, color: '#8E8E93' }}>Complete</span>
            </div>
            <p style={{ color: '#8E8E93', fontSize: '0.85rem' }}>
              {completedCount} of {totalChapters} chapters marked as read.
            </p>
          </div>

          <div style={{ width: '100%', height: '8px', backgroundColor: '#1A1A22', borderRadius: '4px', overflow: 'hidden', margin: '1rem 0' }}>
            <div style={{ width: `${progressPct}%`, height: '100%', backgroundColor: '#C3151C', borderRadius: '4px' }} />
          </div>

          <Link
            href={`/before-cybersecurity/guide/${CHAPTERS[0].slug}`}
            style={{
              backgroundColor: '#C3151C',
              color: '#FFFFFF',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 600,
              textDecoration: 'none',
              textAlign: 'center',
            }}
          >
            {completedCount === 0 ? 'Start Reading Chapter 1 →' : 'Continue Reading →'}
          </Link>
        </div>
      </div>

      {/* Ten Parts Chapter Index */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {PARTS.map((part) => {
          const partChapters = CHAPTERS.filter((ch) => ch.partNumber === part.number);

          return (
            <div
              key={part.number}
              style={{
                backgroundColor: '#0D0D10',
                border: '1px solid #1F1F24',
                borderRadius: '12px',
                padding: '2rem',
              }}
            >
              {/* Part Header */}
              <div style={{ borderBottom: '1px solid #1E1E24', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#C3151C', fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase' }}>
                  PART 0{part.number}
                </div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff', margin: '0.25rem 0' }}>
                  {part.title}
                </h2>
                <div style={{ fontSize: '0.9rem', color: '#8E8E93' }}>{part.theme}</div>
              </div>

              {/* Chapters List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {partChapters.map((ch) => {
                  const isRead = readChapters.includes(ch.number);

                  return (
                    <Link
                      key={ch.number}
                      href={`/before-cybersecurity/guide/${ch.slug}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem 1.25rem',
                        backgroundColor: '#121216',
                        border: '1px solid #222228',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        transition: 'border-color 0.15s, background-color 0.15s',
                        gap: '1rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: isRead ? '#10B981' : '#1F1F26',
                          color: '#fff',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}>
                          {isRead ? '✓' : ch.number}
                        </span>
                        <div>
                          <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '1rem' }}>
                            {ch.title}
                          </div>
                          <div style={{ color: '#71717A', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                            {ch.subtitle || ch.summary.slice(0, 90) + '...'}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                        {ch.exercise && (
                          <span style={{
                            background: 'rgba(195, 21, 28, 0.12)',
                            color: '#FF5A60',
                            fontSize: '0.7rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            fontWeight: 600,
                          }}>
                            Ex. 0{ch.exercise.number}
                          </span>
                        )}
                        <span style={{ fontSize: '0.8rem', color: '#71717A', fontFamily: 'monospace' }}>
                          {ch.readTimeMinutes}m
                        </span>
                        <span style={{ color: '#C3151C', fontWeight: 'bold' }}>→</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
