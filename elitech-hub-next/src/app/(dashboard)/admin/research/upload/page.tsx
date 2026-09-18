"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Upload, Plus, Trash2, CheckCircle2, ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';
import { RESEARCH_CATEGORIES } from '@/lib/constants';
import styles from './upload.module.css';

export default function AdvancedUploadPortal() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [fetchingDoi, setFetchingDoi] = useState(false);
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    category: RESEARCH_CATEGORIES[0],
    keywords: '',
    doi: '',
    seo_title: '',
    seo_description: '',
  });

  const [authors, setAuthors] = useState([
    { name: '', institution: '', orcid: '' }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const fetchDoiMetadata = async () => {
    if (!formData.doi) {
      alert("Please enter a DOI first");
      return;
    }
    
    setFetchingDoi(true);
    try {
      // Clean DOI if user entered a full URL
      const cleanDoi = formData.doi.replace(/^(https?:\/\/)?(dx\.)?doi\.org\//, '').trim();
      
      const response = await fetch(`https://api.crossref.org/works/${encodeURIComponent(cleanDoi)}`, {
        headers: {
          'User-Agent': 'ElitechHub/1.0 (mailto:Elijah@elitechub.com)'
        }
      });
      
      if (!response.ok) throw new Error("Failed to fetch DOI metadata. Check if the DOI is correct.");
      
      const json = await response.json();
      const work = json.message;
      
      let abstract = work.abstract ? work.abstract.replace(/<[^>]*>?/gm, '') : formData.abstract; // strip JATS XML tags if present
      
      setFormData(prev => ({
        ...prev,
        title: work.title && work.title[0] ? work.title[0] : prev.title,
        abstract: abstract,
        doi: cleanDoi,
        seo_title: work.title && work.title[0] ? work.title[0] : prev.seo_title,
      }));
      
      if (work.author && Array.isArray(work.author)) {
        const parsedAuthors = work.author.map((a: any) => ({
          name: `${a.given || ''} ${a.family || ''}`.trim(),
          institution: (a.affiliation && a.affiliation[0] && a.affiliation[0].name) ? a.affiliation[0].name : '',
          orcid: a.ORCID ? a.ORCID.replace(/.*\//, '') : ''
        }));
        
        if (parsedAuthors.length > 0) {
          setAuthors(parsedAuthors);
        }
      }
      
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error fetching DOI');
    } finally {
      setFetchingDoi(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      if (!file) {
        throw new Error("Please select a PDF manuscript to upload.");
      }
      if (!formData.title || !formData.abstract) {
        throw new Error("Title and Abstract are required.");
      }

      // Generate slug from title
      const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();
      
      // Clean up authors list
      const cleanAuthors = authors.filter(a => a.name.trim() !== '');
      const keywordArray = formData.keywords.split(',').map(k => k.trim()).filter(k => k);

      // Upload file to private research-files bucket via secure API
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('researchId', slug);

      const uploadRes = await fetch('/api/research/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!uploadRes.ok) {
        const uploadJson = await uploadRes.json();
        throw new Error(`File upload failed: ${uploadJson.error}`);
      }

      const uploadJson = await uploadRes.json();
      const file_url = uploadJson.filePath; // Stored as private path; served via /api/research/download

      // Insert into database
      const newPaper = {
        title: formData.title,
        slug,
        type: fileExt || 'pdf',
        category: formData.category,
        file_url,
        publication_status: 'published',
        abstract: formData.abstract,
        authors: cleanAuthors,
        keywords: keywordArray,
        doi: formData.doi || null,
        seo_title: formData.seo_title || null,
        seo_description: formData.seo_description || null,
      };

      const { data, error } = await supabase.from('research').insert([newPaper]).select();
      
      if (error) {
        // If the advanced columns are not in the database yet, we fallback to the basic schema
        // This is a safety mechanism until the DB migration is fully executed
        if (error.code === 'PGRST204' || error.message.includes('column')) {
            throw new Error("Database schema update pending. Please run the SQL migration to enable advanced metadata.");
        }
        throw error;
      }

      if (data && data.length > 0 && formData.doi) {
        await supabase.from('research_identifiers').insert([
          { research_id: data[0].id, identifier_type: 'DOI', identifier_value: formData.doi }
        ]);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/lab');
      }, 2000);

    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error uploading research paper');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/admin/lab" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <ArrowLeft size={16} /> Back to Lab
        </Link>
        <h1 className={styles.title}>Submit Research Publication</h1>
        <p className={styles.subtitle}>Upload a new paper to the open-access SSRN-style repository.</p>
      </div>

      {success && (
        <div className={styles.successMessage}>
          <CheckCircle2 size={20} />
          <span>Research paper submitted successfully! Redirecting...</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.card}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#f8fafc', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>1. Manuscript Upload</h2>
          
          <div className={styles.fileDropZone} onClick={() => fileInputRef.current?.click()}>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".pdf" onChange={handleFileSelect} />
            {file ? (
              <div>
                <FileText size={48} className={styles.uploadIcon} style={{ color: '#3b82f6' }} />
                <div className={styles.fileDropText}>{file.name}</div>
                <div className={styles.fileDropSubtext}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
              </div>
            ) : (
              <div>
                <Upload size={48} className={styles.uploadIcon} />
                <div className={styles.fileDropText}>Click to upload PDF manuscript</div>
                <div className={styles.fileDropSubtext}>Maximum file size 50MB</div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.card}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#f8fafc', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>2. Basic Metadata</h2>
          
          <div className={styles.formGroup}>
            <label>Title of Paper *</label>
            <input type="text" name="title" className={styles.input} value={formData.title} onChange={handleInputChange} required placeholder="e.g. Analysis of Neural Architectures" />
          </div>

          <div className={styles.formGroup}>
            <label>Abstract *</label>
            <textarea name="abstract" className={styles.textarea} value={formData.abstract} onChange={handleInputChange} required placeholder="Paste the full abstract here..."></textarea>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className={styles.formGroup}>
              <label>Category</label>
              <select name="category" className={styles.select} value={formData.category} onChange={handleInputChange}>
                {RESEARCH_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Keywords (comma separated)</label>
              <input type="text" name="keywords" className={styles.input} value={formData.keywords} onChange={handleInputChange} placeholder="e.g. machine learning, NLP, transformer" />
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#f8fafc', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>3. Authorship</h2>
          
          {authors.map((author, idx) => (
            <div key={idx} className={styles.authorRow}>
              <div className={styles.formGroup} style={{ flex: 1, marginBottom: 0 }}>
                <label>Author Name</label>
                <input type="text" className={styles.input} value={author.name} onChange={(e) => handleAuthorChange(idx, 'name', e.target.value)} placeholder="Full Name" />
              </div>
              <div className={styles.formGroup} style={{ flex: 1, marginBottom: 0 }}>
                <label>Institution</label>
                <input type="text" className={styles.input} value={author.institution} onChange={(e) => handleAuthorChange(idx, 'institution', e.target.value)} placeholder="University or Company" />
              </div>
              <button type="button" className={styles.removeBtn} onClick={() => removeAuthor(idx)} disabled={authors.length === 1}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          
          <button type="button" className={styles.addBtn} onClick={addAuthor}>
            <Plus size={18} /> Add Another Author
          </button>
        </div>

        <div className={styles.card}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#f8fafc', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>4. Academic Identifiers & SEO</h2>
          
          <div className={styles.formGroup}>
            <label>DOI (Digital Object Identifier) - Optional</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input type="text" name="doi" className={styles.input} style={{ flex: 1 }} value={formData.doi} onChange={handleInputChange} placeholder="10.1234/example" />
              <button type="button" onClick={fetchDoiMetadata} disabled={fetchingDoi} style={{ padding: '0 1.5rem', background: '#475569', color: 'white', border: 'none', borderRadius: '8px', cursor: fetchingDoi ? 'not-allowed' : 'pointer', fontWeight: 500 }}>
                {fetchingDoi ? 'Fetching...' : 'Autofill Data'}
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>SEO Title Override (Optional)</label>
            <input type="text" name="seo_title" className={styles.input} value={formData.seo_title} onChange={handleInputChange} placeholder="Optimized title for search engines" />
          </div>

          <div className={styles.formGroup}>
            <label>SEO Description (Optional)</label>
            <textarea name="seo_description" className={styles.textarea} style={{ minHeight: '80px' }} value={formData.seo_description} onChange={handleInputChange} placeholder="Meta description for Google Scholar/Search"></textarea>
          </div>
        </div>

        <div className={styles.actions}>
          <Link href="/admin/lab">
            <button type="button" className={styles.cancelBtn}>Cancel</button>
          </Link>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Submitting...' : <><Upload size={18} /> Publish to Repository</>}
          </button>
        </div>
      </form>
    </div>
  );
}
