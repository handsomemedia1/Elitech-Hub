"use client";

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import styles from '../../upload/upload.module.css';

export default function EditResearchPaper({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    category: 'Computer Science',
    keywords: '',
    doi: '',
    seo_title: '',
    seo_description: '',
    published: true,
  });

  const [authors, setAuthors] = useState([
    { name: '', institution: '', orcid: '' }
  ]);

  useEffect(() => {
    async function fetchPaper() {
      const { data, error } = await supabase
        .from('research')
        .select('*')
        .eq('id', id)
        .single();
        
      if (data) {
        setFormData({
          title: data.title || '',
          abstract: data.abstract || '',
          category: data.category || 'Computer Science',
          keywords: data.keywords ? data.keywords.join(', ') : '',
          doi: data.doi || '',
          seo_title: data.seo_title || '',
          seo_description: data.seo_description || '',
          published: data.published ?? true,
        });
        
        if (data.authors && Array.isArray(data.authors) && data.authors.length > 0) {
          setAuthors(data.authors);
        } else if (data.author) {
          setAuthors([{ name: data.author, institution: '', orcid: '' }]);
        }
      }
      setLoading(false);
    }
    fetchPaper();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
    }));
  };

  const handleAuthorChange = (index: number, field: string, value: string) => {
    const newAuthors = [...authors];
    newAuthors[index] = { ...newAuthors[index], [field]: value };
    setAuthors(newAuthors);
  };

  const addAuthor = () => {
    setAuthors([...authors, { name: '', institution: '', orcid: '' }]);
  };

  const removeAuthor = (index: number) => {
    if (authors.length > 1) {
      setAuthors(authors.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      if (!formData.title || !formData.abstract) {
        throw new Error("Title and Abstract are required.");
      }

      // Generate slug from title
      const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + id.substring(0,4);
      
      const cleanAuthors = authors.filter(a => a.name.trim() !== '');
      const keywordArray = formData.keywords.split(',').map(k => k.trim()).filter(k => k);

      const updatedPaper = {
        title: formData.title,
        slug,
        category: formData.category,
        published: formData.published,
        abstract: formData.abstract,
        authors: cleanAuthors,
        keywords: keywordArray,
        doi: formData.doi || null,
        seo_title: formData.seo_title || null,
        seo_description: formData.seo_description || null,
      };

      const { error } = await supabase.from('research').update(updatedPaper).eq('id', id);
      
      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/lab');
      }, 2000);

    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error updating research paper');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/admin/lab" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <ArrowLeft size={16} /> Back to Lab
        </Link>
        <h1 className={styles.title}>Edit Research Publication</h1>
      </div>

      {success && (
        <div className={styles.successMessage}>
          <CheckCircle2 size={20} />
          <span>Research paper updated successfully! Redirecting...</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.card}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#f8fafc', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>Basic Metadata</h2>
          
          <div className={styles.formGroup}>
            <label>Title of Paper *</label>
            <input type="text" name="title" className={styles.input} value={formData.title} onChange={handleInputChange} required />
          </div>

          <div className={styles.formGroup}>
            <label>Abstract *</label>
            <textarea name="abstract" className={styles.textarea} style={{ minHeight: '150px' }} value={formData.abstract} onChange={handleInputChange} required></textarea>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className={styles.formGroup}>
              <label>Category</label>
              <select name="category" className={styles.select} value={formData.category} onChange={handleInputChange}>
                <option value="Computer Science">Computer Science</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Information Security">Information Security</option>
                <option value="Data Science">Data Science</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Keywords (comma separated)</label>
              <input type="text" name="keywords" className={styles.input} value={formData.keywords} onChange={handleInputChange} />
            </div>
          </div>
          
          <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            <input type="checkbox" name="published" id="published" checked={formData.published} onChange={handleInputChange} style={{ width: 'auto' }} />
            <label htmlFor="published" style={{ marginBottom: 0 }}>Published (Visible to public)</label>
          </div>
        </div>

        <div className={styles.card}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#f8fafc', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>Authorship</h2>
          
          {authors.map((author, idx) => (
            <div key={idx} className={styles.authorRow} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '1rem' }}>
              <div className={styles.formGroup} style={{ flex: 1, marginBottom: 0 }}>
                <label>Author Name</label>
                <input type="text" className={styles.input} value={author.name} onChange={(e) => handleAuthorChange(idx, 'name', e.target.value)} />
              </div>
              <div className={styles.formGroup} style={{ flex: 1, marginBottom: 0 }}>
                <label>Institution</label>
                <input type="text" className={styles.input} value={author.institution || ''} onChange={(e) => handleAuthorChange(idx, 'institution', e.target.value)} />
              </div>
              <button type="button" className={styles.removeBtn} onClick={() => removeAuthor(idx)} disabled={authors.length === 1} style={{ padding: '0.75rem', background: '#334155', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>
                Remove
              </button>
            </div>
          ))}
          
          <button type="button" className={styles.addBtn} onClick={addAuthor} style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'transparent', border: '1px dashed #64748b', color: '#94a3b8', borderRadius: '8px', cursor: 'pointer' }}>
            + Add Another Author
          </button>
        </div>

        <div className={styles.card}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#f8fafc', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>Academic Identifiers & SEO</h2>
          
          <div className={styles.formGroup}>
            <label>DOI (Digital Object Identifier)</label>
            <input type="text" name="doi" className={styles.input} value={formData.doi} onChange={handleInputChange} />
          </div>

          <div className={styles.formGroup}>
            <label>SEO Title Override</label>
            <input type="text" name="seo_title" className={styles.input} value={formData.seo_title} onChange={handleInputChange} />
          </div>

          <div className={styles.formGroup}>
            <label>SEO Description</label>
            <textarea name="seo_description" className={styles.textarea} style={{ minHeight: '80px' }} value={formData.seo_description} onChange={handleInputChange}></textarea>
          </div>
        </div>

        <div className={styles.actions} style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <Link href="/admin/lab" style={{ flex: 1 }}>
            <button type="button" className={styles.cancelBtn} style={{ width: '100%', padding: '1rem', background: '#1e293b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
          </Link>
          <button type="submit" className={styles.submitBtn} disabled={saving} style={{ flex: 2, padding: '1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            {saving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
          </button>
        </div>
      </form>
    </div>
  );
}
