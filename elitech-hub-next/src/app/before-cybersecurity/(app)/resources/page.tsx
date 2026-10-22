'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CURATED_RESOURCES, RESOURCE_CATEGORIES, CuratedResource } from '@/data/beforeCybersecurityResources';

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = CURATED_RESOURCES.filter((res) => {
    const matchesCategory = selectedCategory === 'all' || res.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      res.title.toLowerCase().includes(query) ||
      res.description.toLowerCase().includes(query) ||
      res.organization.toLowerCase().includes(query);

    return matchesCategory && matchesQuery;
  });

  return (
    <div>
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
          Curated Repository
        </div>
        <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
          Authoritative Resource Library
        </h1>
        <p style={{ color: '#8E8E93', fontSize: '1.05rem', maxWidth: '750px', lineHeight: '1.6' }}>
          Every resource is manually verified and tied directly to concepts in Before Cybersecurity. We do not aggregate generic or low-quality tutorials.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div style={{
        backgroundColor: '#0E0E12',
        border: '1px solid #1F1F24',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        <input
          type="text"
          placeholder="Search by topic, framework (e.g. NIST, Wireshark, Linux, NDPA)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            backgroundColor: '#141418',
            border: '1px solid #272730',
            borderRadius: '8px',
            padding: '0.85rem 1.25rem',
            color: '#FFFFFF',
            fontSize: '0.95rem',
            boxSizing: 'border-box',
            outline: 'none',
          }}
        />

        {/* Category Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {RESOURCE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                backgroundColor: selectedCategory === cat.id ? '#C3151C' : '#141418',
                border: `1px solid ${selectedCategory === cat.id ? '#C3151C' : '#272730'}`,
                color: selectedCategory === cat.id ? '#FFFFFF' : '#A1A1AA',
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
      }}>
        {filtered.map((res: CuratedResource) => (
          <div
            key={res.id}
            style={{
              backgroundColor: '#0E0E12',
              border: '1px solid #1F1F24',
              borderRadius: '12px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#C3151C', fontFamily: 'monospace', fontWeight: 700 }}>
                  {res.organization}
                </span>
                <span style={{
                  fontSize: '0.7rem',
                  background: res.cost === 'Free' ? 'rgba(16, 185, 129, 0.15)' : '#1F1F26',
                  color: res.cost === 'Free' ? '#10B981' : '#A1A1AA',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px',
                  fontWeight: 600,
                }}>
                  {res.cost}
                </span>
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                {res.title}
              </h2>

              <p style={{ color: '#8E8E93', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                {res.description}
              </p>

              {res.bookChapterRef && (
                <div style={{ fontSize: '0.8rem', color: '#71717A', marginBottom: '1rem' }}>
                  📖 Linked: <span style={{ color: '#A1A1AA' }}>{res.bookChapterRef}</span>
                </div>
              )}
            </div>

            <div style={{
              borderTop: '1px solid #1A1A22',
              paddingTop: '1rem',
              marginTop: 'auto',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: '0.75rem', color: '#71717A', background: '#141418', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                {res.level}
              </span>

              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#C3151C',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                Open Resource ↗
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
