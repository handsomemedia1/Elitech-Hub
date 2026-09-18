"use client";

import React, { useState } from 'react';
import { Quote, X, Copy, Check } from 'lucide-react';

interface Props {
  title: string;
  authors: string;
  year: string;
  doi?: string | null;
  publisher?: string;
  url: string;
  slug: string;
}

const FORMATS = ['APA', 'MLA', 'Chicago', 'BibTeX'] as const;
type Format = typeof FORMATS[number];

function buildCitation(format: Format, { title, authors, year, doi, publisher, url }: Props): string {
  const pub = publisher || 'Elitech Hub';
  const doiLine = doi ? `https://doi.org/${doi}` : url;

  switch (format) {
    case 'APA':
      return `${authors} (${year}). ${title}. ${pub}. ${doiLine}`;
    case 'MLA':
      return `${authors}. "${title}." ${pub}, ${year}. ${doiLine}.`;
    case 'Chicago':
      return `${authors}. "${title}." ${pub} (${year}). ${doiLine}.`;
    case 'BibTeX':
      const key = authors.split(' ').pop()?.replace(/[^a-zA-Z]/g, '') + year;
      return `@article{${key},\n  title   = {${title}},\n  author  = {${authors}},\n  journal = {Elitech Hub Research Repository},\n  year    = {${year}},\n  publisher = {${pub}},\n  url     = {${doiLine}}\n}`;
    default:
      return '';
  }
}

export default function CiteModal(props: Props) {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<Format>('APA');
  const [copied, setCopied] = useState(false);

  const citation = buildCitation(format, props);

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
  };

  const copy = async () => {
    try {
      if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(citation);
      } else {
        await navigator.clipboard.writeText(citation);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      // Log citation
      fetch('/api/research/cite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: props.slug })
      }).catch(err => console.error("Failed to log citation", err));

    } catch (err) {
      console.error("Failed to copy", err);
      // Fallback
      fallbackCopyTextToClipboard(citation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
          background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155',
          padding: '0.9rem', borderRadius: '10px', fontWeight: 600,
          width: '100%', cursor: 'pointer', fontSize: '0.95rem',
          transition: 'background 0.15s',
        }}
      >
        <Quote size={18} /> Cite this Paper
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div style={{
            background: 'white', borderRadius: '20px', maxWidth: '620px', width: '100%',
            boxShadow: '0 25px 60px rgba(0,0,0,0.25)', overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #0f172a, #1e293b)',
              padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <h2 style={{ color: 'white', fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Cite this Paper</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '4px' }}>Choose a citation format to copy</p>
              </div>
              <button onClick={() => setOpen(false)} style={{
                background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
                borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '2rem' }}>
              {/* Format tabs */}
              <div style={{
                display: 'flex', gap: '0.5rem', marginBottom: '1.5rem',
                background: '#f1f5f9', borderRadius: '10px', padding: '4px',
              }}>
                {FORMATS.map(f => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    style={{
                      flex: 1, padding: '0.5rem', borderRadius: '7px', border: 'none',
                      fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                      background: format === f ? 'white' : 'transparent',
                      color: format === f ? '#0f172a' : '#64748b',
                      boxShadow: format === f ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                      transition: 'all 0.15s',
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Citation box */}
              <div style={{
                background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px',
                padding: '1.25rem', marginBottom: '1rem',
                fontFamily: format === 'BibTeX' ? 'monospace' : 'inherit',
                fontSize: '0.9rem', lineHeight: 1.7, color: '#334155',
                whiteSpace: format === 'BibTeX' ? 'pre' : 'normal',
                minHeight: '80px',
              }}>
                {citation}
              </div>

              {/* Copy + note */}
              <button
                onClick={copy}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                  background: copied ? '#10b981' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: 'white', border: 'none', borderRadius: '10px',
                  padding: '0.85rem', fontWeight: 700, fontSize: '0.95rem',
                  width: '100%', cursor: 'pointer', transition: 'background 0.2s',
                }}
              >
                {copied ? <><Check size={18} /> Copied!</> : <><Copy size={18} /> Copy Citation</>}
              </button>

              <p style={{ fontSize: '0.78rem', color: '#94a3b8', textAlign: 'center', marginTop: '1rem' }}>
                Each time you copy a citation, Elitech Hub logs it. Citations help track academic impact.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
