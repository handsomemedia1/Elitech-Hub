"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Search, Download, Clock } from 'lucide-react';
import styles from '@/app/research/research.module.css';

import { RESEARCH_CATEGORIES } from '@/lib/constants';

export default function ResearchList() {
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const [sort, setSort] = useState('Newest');

  useEffect(() => {
    async function fetchPapers() {
      const { data, error } = await supabase
        .from('research')
        .select('*')
        .or('published.eq.true,publication_status.eq.published');
      
      if (data) setPapers(data);
      setLoading(false);
    }
    fetchPapers();
  }, []);

  const filteredPapers = papers
    .filter(p => {
      const searchLower = search.toLowerCase();
      const matchesSearch = 
        p.title?.toLowerCase().includes(searchLower) || 
        p.abstract?.toLowerCase().includes(searchLower) ||
        p.keywords?.some((k: string) => k.toLowerCase().includes(searchLower)) ||
        (p.authors && Array.isArray(p.authors) ? p.authors.some((a: any) => a.name?.toLowerCase().includes(searchLower) || a.institution?.toLowerCase().includes(searchLower)) : p.author?.toLowerCase().includes(searchLower));
      
      const matchesCategory = category === 'All' || p.category === category;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const dateA = new Date(a.published_at || a.created_at).getTime();
      const dateB = new Date(b.published_at || b.created_at).getTime();
      return sort === 'Newest' ? dateB - dateA : dateA - dateB;
    });

  const categories = ['All', ...RESEARCH_CATEGORIES];

  return (
    <>
      <div className={styles.filtersContainer} style={{ marginTop: '2rem' }}>
        <div className={styles.filtersWrapper} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <div className={styles.filtersList}>
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`${styles.filterBtn} ${category === cat ? styles.filterBtnActive : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  {cat === 'All' ? 'All Research' : cat}
                </button>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <select 
                value={sort} 
                onChange={e => setSort(e.target.value)}
                style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', outline: 'none', cursor: 'pointer' }}
              >
                <option value="Newest">Newest First</option>
                <option value="Oldest">Oldest First</option>
              </select>
              
              <div className={styles.searchWrapper}>
                <span className={styles.searchIcon}>🔍</span>
                <input 
                  type="text" 
                  className={styles.searchInput} 
                  placeholder="Search title, author, keyword..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.researchGrid} style={{ marginTop: '2rem', minHeight: '300px' }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#94a3b8', padding: '3rem' }}>
            <div className="fas fa-circle-notch fa-spin" style={{ fontSize: '2rem', marginBottom: '1rem' }}></div>
            <p>Loading repository...</p>
          </div>
        ) : filteredPapers.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#94a3b8', padding: '3rem', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <Search size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>No research matched your search</h3>
            <p>Try a different title, author, keyword, or category.</p>
            <button onClick={() => { setSearch(''); setCategory('All'); }} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6', borderRadius: '4px', cursor: 'pointer' }}>Clear Filters</button>
          </div>
        ) : (
          filteredPapers.map(paper => (
            <article key={paper.id} className={styles.researchCard} style={{ display: 'flex', flexDirection: 'column', background: '#1e293b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}>
              <div style={{ padding: '2rem' }}>
                <div className={styles.cardTags} style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>Published</span>
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)' }}>{paper.category}</span>
                  {paper.type === 'pdf' && (
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', gap: '4px' }}><Download size={10} /> PDF</span>
                  )}
                </div>
                
                <h3 className={styles.cardTitle} style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '1rem', lineHeight: 1.4 }}>
                  <Link href={`/research/${paper.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {paper.title}
                  </Link>
                </h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    EH
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <p style={{ fontSize: '0.875rem', color: '#cbd5e1', margin: 0, fontWeight: 500 }}>
                      {paper.authors && Array.isArray(paper.authors) && paper.authors.length > 0 
                        ? paper.authors.map((a: any) => a.name).join(', ')
                        : paper.author || 'Elitech Research Labs'}
                    </p>
                    {paper.authors && Array.isArray(paper.authors) && paper.authors[0]?.institution && (
                      <p style={{ fontSize: '0.7rem', color: '#64748b', margin: 0 }}>
                        {paper.authors[0].institution}
                      </p>
                    )}
                  </div>
                </div>

                <p className={styles.cardDesc} style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.6, flex: 1, marginBottom: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {paper.abstract || 'The full abstract is available within the research paper document. Click through to read the comprehensive analysis, methodology, and findings.'}
                </p>
                
                {paper.keywords && paper.keywords.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                    {paper.keywords.slice(0, 3).map((kw: string, i: number) => (
                      <span key={i} style={{ fontSize: '0.7rem', color: '#64748b', background: 'rgba(255,255,255,0.03)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>#{kw}</span>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ marginTop: 'auto', background: 'rgba(0,0,0,0.2)', padding: '1.25rem 2rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} /> {new Date(paper.published_at || paper.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <Link href={`/research/${paper.slug}`} style={{ color: '#3b82f6', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                  Read Research <span style={{ transition: 'transform 0.2s' }}>→</span>
                </Link>
              </div>
            </article>
          ))
        )}
      </div>

      <div style={{ marginTop: '3rem', padding: '3rem 2rem', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.8))', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>Have Research to Share?</h3>
        <p style={{ color: '#94a3b8', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
          Have relevant cybersecurity or technology research to share? Submit your work for consideration in the Elitech Hub Research Repository. Submissions are administratively reviewed.
        </p>
        <Link href="/researcher/submit" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0.85rem 2rem', borderRadius: '0.5rem', background: '#3b82f6', color: 'white', fontWeight: 600, textDecoration: 'none', transition: 'background 0.2s' }}>
          Submit Research
        </Link>
      </div>
    </>
  );
}
