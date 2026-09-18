"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { RESEARCH_CATEGORIES } from '@/lib/constants';
import styles from '../researcher.module.css';

export default function SubmitResearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    keywords: '',
    research_type: 'article',
    file_url: '',
    category: 'Cybersecurity',
    rights_confirmed: false,
  });

  const [authors, setAuthors] = useState([{ name: '', orcid: '', institution: '' }]);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    async function fetchResearchData() {
      setLoading(true);
      const res = await fetch('/api/researcher/submit?id=' + editId);
      if (res.ok) {
        const { data } = await res.json();
        if (data) {
          setFormData({
            title: data.title,
            abstract: data.abstract || '',
            category: data.category,
            file_url: data.file_url || '',
            keywords: data.keywords ? data.keywords.join(', ') : '',
            research_type: data.research_type || data.type || 'article',
            rights_confirmed: data.rights_confirmed || false,
          });
          if (data.authors && typeof data.authors === 'string') {
            try {
              const parsed = JSON.parse(data.authors);
              if (Array.isArray(parsed)) setAuthors(parsed);
            } catch {
              // fallback
            }
          }
        }
      }
      setLoading(false);
    }
    if (editId) fetchResearchData();
  }, [editId]);

  const handleAuthorChange = (index: number, field: string, value: string) => {
    const newAuthors = [...authors];
    newAuthors[index] = { ...newAuthors[index], [field]: value };
    setAuthors(newAuthors);
  };

  const addAuthor = () => setAuthors([...authors, { name: '', orcid: '', institution: '' }]);
  const removeAuthor = (index: number) => {
    if (authors.length > 1) {
      const newAuthors = authors.filter((_, i) => i !== index);
      setAuthors(newAuthors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (!formData.rights_confirmed) {
      setMessage({ type: 'error', text: 'You must confirm that you have the rights to submit this research.' });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) throw new Error("Authentication required.");
      const { user } = await res.json();

      const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const keywordsArray = formData.keywords.split(',').map(k => k.trim()).filter(k => k);

      const researchPayload = {
        title: formData.title,
        slug: editId ? undefined : `${slug}-${Date.now().toString().slice(-4)}`, // Don't update slug if editing
        abstract: formData.abstract,
        keywords: keywordsArray,
        research_type: formData.research_type,
        type: formData.research_type === 'video' ? 'video' : 'pdf', // Fallback for old schema
        file_url: formData.file_url,
        category: formData.category,
        rights_confirmed: formData.rights_confirmed,
        publication_status: editId ? undefined : 'submitted', // Keep existing status if editing
        published: false, // Force false until admin review
        submitter_id: user.id
      };
      const submitRes = await fetch('/api/researcher/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          editId,
          researchPayload,
          authorsPayload: authors.filter(a => a.name).map((a, i) => ({ 
            full_name: a.name, 
            institution: a.institution, 
            orcid: a.orcid, 
            author_order: i + 1 
          }))
        })
      });

      if (!submitRes.ok) {
        const err = await submitRes.json();
        throw new Error(err.error || 'Submission failed');
      }

      setMessage({ type: 'success', text: 'Research submitted successfully and is pending admin review.' });
      setTimeout(() => router.push('/researcher'), 2000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'An error occurred during submission.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.header}>
        <div>
          <h1>{editId ? 'Edit Submission' : 'Submit Research'}</h1>
          <p>Provide scholarly metadata for your publication.</p>
        </div>
      </div>

      <div className={styles.recentSection} style={{ maxWidth: '800px', margin: '0 auto' }}>
        {message.text && (
          <div style={{
            padding: '12px 16px', borderRadius: '8px', marginBottom: '24px',
            backgroundColor: message.type === 'error' ? '#fef2f2' : '#f0fdf4',
            color: message.type === 'error' ? '#991b1b' : '#166534',
            border: `1px solid ${message.type === 'error' ? '#fecaca' : '#bbf7d0'}`
          }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: '#cbd5e1', fontWeight: 500 }}>Research Title *</label>
            <input 
              type="text" 
              required
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#070d1a', color: 'white', width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: '#cbd5e1', fontWeight: 500 }}>Research Type</label>
              <select 
                value={formData.research_type}
                onChange={e => setFormData({...formData, research_type: e.target.value})}
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#070d1a', color: 'white', width: '100%' }}
              >
                <option value="article">Research Article</option>
                <option value="preprint">Preprint</option>
                <option value="technical_report">Technical Report</option>
                <option value="conference_paper">Conference Paper</option>
                <option value="review">Review</option>
                <option value="thesis">Thesis / Dissertation</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: '#cbd5e1', fontWeight: 500 }}>Category / Subject Area</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#070d1a', color: 'white', width: '100%' }}
              >
                {RESEARCH_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: '#cbd5e1', fontWeight: 500 }}>Abstract *</label>
            <textarea 
              required
              rows={6}
              value={formData.abstract}
              onChange={e => setFormData({...formData, abstract: e.target.value})}
              placeholder="Provide a comprehensive summary of your research..."
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#070d1a', color: 'white', width: '100%', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: '#cbd5e1', fontWeight: 500 }}>Keywords (comma separated)</label>
            <input 
              type="text" 
              value={formData.keywords}
              onChange={e => setFormData({...formData, keywords: e.target.value})}
              placeholder="e.g. Malware Analysis, Machine Learning, Threat Detection"
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#070d1a', color: 'white', width: '100%' }}
            />
          </div>

          <div style={{ borderTop: '1px solid #334155', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: 'white' }}>Authors</h3>
              <button type="button" onClick={addAuthor} className={styles.outlineBtn} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>+ Add Author</button>
            </div>
            
            {authors.map((author, index) => (
              <div key={index} style={{ padding: '16px', background: '#1e293b', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Author {index + 1}</span>
                  {authors.length > 1 && (
                    <button type="button" onClick={() => removeAuthor(index)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem' }}>Remove</button>
                  )}
                </div>
                <input 
                  type="text" placeholder="Full Name *" required
                  value={author.name} onChange={e => handleAuthorChange(index, 'name', e.target.value)}
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#070d1a', color: 'white' }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input 
                    type="text" placeholder="Institution / Affiliation" 
                    value={author.institution} onChange={e => handleAuthorChange(index, 'institution', e.target.value)}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#070d1a', color: 'white' }}
                  />
                  <input 
                    type="text" placeholder="ORCID (Optional)" 
                    value={author.orcid} onChange={e => handleAuthorChange(index, 'orcid', e.target.value)}
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#070d1a', color: 'white' }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #334155', paddingTop: '24px' }}>
            <label style={{ color: '#cbd5e1', fontWeight: 500 }}>PDF File URL *</label>
            <input 
              type="url" 
              required
              value={formData.file_url}
              onChange={e => setFormData({...formData, file_url: e.target.value})}
              placeholder="https://..."
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#070d1a', color: 'white', width: '100%' }}
            />
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Provide a direct link to the PDF manuscript (e.g. from Supabase Storage).</span>
          </div>

          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)', display: 'flex', gap: '12px', alignItems: 'flex-start', marginTop: '12px' }}>
            <input 
              type="checkbox" 
              id="rights" 
              checked={formData.rights_confirmed}
              onChange={e => setFormData({...formData, rights_confirmed: e.target.checked})}
              style={{ marginTop: '4px' }}
            />
            <label htmlFor="rights" style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5 }}>
              <strong>Deposit Agreement:</strong> I declare that I am the author (or authorized representative) of this work. I grant Elitech Hub the non-exclusive right to distribute this research in its repository. I confirm this deposit does not infringe upon any existing copyrights or publishing agreements.
            </label>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={styles.primaryBtn} 
            style={{ justifyContent: 'center', marginTop: '12px', padding: '14px', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Processing...' : (editId ? 'Update Submission' : 'Submit for Review')}
          </button>
        </form>
      </div>
    </div>
  );
}
