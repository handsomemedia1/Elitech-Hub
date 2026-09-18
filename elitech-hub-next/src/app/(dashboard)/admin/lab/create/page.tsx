"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Save, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function LabForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams?.get('id');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [formData, setFormData] = useState({
    title: '', slug: '', short_description: '', full_description: '', 
    category: '', difficulty: '', status: 'draft', 
    objectives: '', methodology: '', instructions: '', findings: '',
    yara_rules: '', sigma_rules: '', mitre_mappings: ''
  });

  useEffect(() => {
    if (id) {
      fetch('/api/admin/lab?id=' + id)
        .then(res => res.json())
        .then(data => {
          if (data.data) {
            setFormData({
              ...data.data,
              mitre_mappings: typeof data.data.mitre_mappings === 'object' ? JSON.stringify(data.data.mitre_mappings) : data.data.mitre_mappings || ''
            });
          }
          setFetching(false);
        });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      mitre_mappings: formData.mitre_mappings ? JSON.parse(formData.mitre_mappings) : null,
      published_at: formData.status === 'published' && !id ? new Date().toISOString() : undefined
    };

    const method = id ? 'PATCH' : 'POST';
    if (id) payload.id = id;

    const res = await fetch('/api/admin/lab', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    if (res.ok) {
      router.push('/admin/lab');
    } else {
      const err = await res.json();
      alert('Error: ' + err.error);
    }
  };

  const handleChange = (e: any) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (fetching) return <div style={{padding: '2rem'}}>Loading...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', color: 'white' }}>
      <Link href="/admin/lab" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', textDecoration: 'none', marginBottom: '2rem' }}>
        <ChevronLeft size={16} /> Back to Labs
      </Link>
      
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>{id ? 'Edit Lab' : 'Create New Lab'}</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Title *</label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Slug *</label>
            <input required type="text" name="slug" value={formData.slug} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Status</label>
            <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: '#1e293b', border: '1px solid #334155', color: 'white' }}>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Category</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Difficulty</label>
            <input type="text" name="difficulty" value={formData.difficulty} onChange={handleChange} placeholder="e.g. Intermediate" style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Short Description (Quick Answer)</label>
          <textarea name="short_description" value={formData.short_description} onChange={handleChange} rows={3} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Full Description (Markdown)</label>
          <textarea name="full_description" value={formData.full_description} onChange={handleChange} rows={6} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: '#1e293b', border: '1px solid #334155', color: 'white', fontFamily: 'monospace' }} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Instructions / Walkthrough (Markdown)</label>
          <textarea name="instructions" value={formData.instructions || ''} onChange={handleChange} rows={6} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: '#1e293b', border: '1px solid #334155', color: 'white', fontFamily: 'monospace' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Objectives</label>
            <textarea name="objectives" value={formData.objectives || ''} onChange={handleChange} rows={4} placeholder="What this lab aims to demonstrate or achieve..." style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Methodology</label>
            <textarea name="methodology" value={formData.methodology || ''} onChange={handleChange} rows={4} placeholder="Research approach and techniques used..." style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: '#1e293b', border: '1px solid #334155', color: 'white' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Findings / Results (Markdown)</label>
          <textarea name="findings" value={formData.findings || ''} onChange={handleChange} rows={5} placeholder="Document the findings, results, or conclusions from this lab..." style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: '#1e293b', border: '1px solid #334155', color: 'white', fontFamily: 'monospace' }} />
        </div>

        <div style={{ borderTop: '1px solid #334155', paddingTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#94a3b8', marginBottom: '1rem' }}>🔬 Detection Engineering</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>YARA Rules</label>
              <textarea name="yara_rules" value={formData.yara_rules || ''} onChange={handleChange} rows={7} placeholder="rule ExampleRule { condition: false }" style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: '#0d1117', border: '1px solid #334155', color: '#67e8f9', fontFamily: 'monospace', fontSize: '0.85rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Sigma Rules</label>
              <textarea name="sigma_rules" value={formData.sigma_rules || ''} onChange={handleChange} rows={7} placeholder="title: Example&#10;logsource:&#10;  category: process_creation" style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: '#0d1117', border: '1px solid #334155', color: '#86efac', fontFamily: 'monospace', fontSize: '0.85rem' }} />
            </div>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>MITRE ATT&amp;CK Mappings (JSON Array)</label>
            <textarea name="mitre_mappings" value={formData.mitre_mappings || ''} onChange={handleChange} placeholder='["T1059.001", "T1078"]' rows={3} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: '#0d1117', border: '1px solid #334155', color: '#a5d6ff', fontFamily: 'monospace' }} />
          </div>
        </div>

        <button type="submit" disabled={loading} style={{ background: '#3b82f6', color: 'white', padding: '1rem', borderRadius: '4px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1rem', marginTop: '1rem' }}>
          <Save size={18} /> {loading ? 'Saving...' : 'Save Lab'}
        </button>
      </form>
    </div>
  );
}
