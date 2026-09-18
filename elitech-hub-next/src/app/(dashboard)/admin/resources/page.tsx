'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Edit, Trash2, X, FileText, BookOpen, ExternalLink, Upload } from 'lucide-react';
import { saveResource, deleteResource } from './actions';
import styles from '../admin.module.css';
import AdminModal from '@/components/AdminModal';

const RESOURCE_TYPES = ['Guide', 'Report', 'Whitepaper', 'Research Paper', 'Template', 'Cheatsheet', 'Toolkit', 'Case Study', 'Other'];
const STATUS_OPTIONS = ['published', 'draft', 'review', 'archived'];

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.65rem 0.75rem',
  background: '#0f172a', border: '1px solid #334155',
  borderRadius: '6px', color: '#f1f5f9', fontSize: '0.875rem',
  boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = {
  display: 'block', marginBottom: '0.35rem',
  fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em',
};

const statusColors: Record<string, { bg: string; color: string }> = {
  published: { bg: '#dcfce7', color: '#15803d' },
  draft:     { bg: '#f1f5f9', color: '#64748b' },
  review:    { bg: '#fef9c3', color: '#854d0e' },
  archived:  { bg: '#fee2e2', color: '#991b1b' },
};

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [topic, setTopic] = useState('');
  const [resourceType, setResourceType] = useState('Guide');
  const [status, setStatus] = useState('published');
  const [fileUrl, setFileUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [publicationDate, setPublicationDate] = useState('');
  const [version, setVersion] = useState('');
  const [references, setReferences] = useState('');

  useEffect(() => { fetchResources(); }, []);

  const fetchResources = async () => {
    setLoading(true);
    const { data } = await supabase.from('resources').select('*').order('created_at', { ascending: false });
    if (data) setResources(data);
    setLoading(false);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle(''); setDescription(''); setAuthor(''); setTopic('');
    setResourceType('Guide'); setStatus('published');
    setFileUrl(''); setFile(null);
    setPublicationDate(''); setVersion(''); setReferences('');
  };

  const openNew = () => { resetForm(); setIsModalOpen(true); };

  const openEdit = (resource: any) => {
    setEditingId(resource.id);
    setTitle(resource.title || '');
    setDescription(resource.description || '');
    setAuthor(resource.author || '');
    setTopic(resource.topic || '');
    setResourceType(resource.resource_type || 'Guide');
    setStatus(resource.status || 'published');
    setFileUrl(resource.file_url || '');
    setFile(null);
    setPublicationDate(resource.publication_date ? resource.publication_date.split('T')[0] : '');
    setVersion(resource.version || '');
    setReferences(typeof resource.references === 'string' ? resource.references : (resource.references ? JSON.stringify(resource.references) : ''));
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (editingId) formData.append('id', editingId);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('author', author);
      formData.append('topic', topic);
      formData.append('resource_type', resourceType);
      formData.append('status', status);
      formData.append('version', version);
      formData.append('references', references);
      if (publicationDate) formData.append('publication_date', publicationDate);
      if (file) {
        formData.append('file', file);
      } else {
        formData.append('file_url', fileUrl);
      }
      await saveResource(formData);
      setIsModalOpen(false);
      fetchResources();
    } catch (err: any) {
      alert(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      try {
        await deleteResource(id);
        fetchResources();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const filtered = resources.filter(r => {
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchSearch = !search || r.title?.toLowerCase().includes(search.toLowerCase()) || r.topic?.toLowerCase().includes(search.toLowerCase()) || r.author?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className={styles.adminWrapper}>
      {/* Header */}
      <div className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={22} style={{ color: '#3b82f6' }} /> Resources Library
          </h1>
          <p>Manage public guides, reports, whitepapers, and research documents.</p>
        </div>
        <button onClick={openNew} className={styles.btnPrimary} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> Add Resource
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          type="text" placeholder="Search by title, topic, or author..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '200px', padding: '0.6rem 0.9rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#f1f5f9', fontSize: '0.875rem' }}
        />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: '0.6rem 0.9rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#f1f5f9', fontSize: '0.875rem' }}>
          <option value="all">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total', count: resources.length, color: '#3b82f6' },
          { label: 'Published', count: resources.filter(r => r.status === 'published').length, color: '#10b981' },
          { label: 'Draft', count: resources.filter(r => r.status === 'draft').length, color: '#64748b' },
          { label: 'In Review', count: resources.filter(r => r.status === 'review').length, color: '#f59e0b' },
        ].map(stat => (
          <div key={stat.label} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: stat.color }}>{stat.count}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading resources...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <FileText size={40} style={{ margin: '0 auto 1rem', opacity: 0.3, display: 'block' }} />
            <div style={{ fontWeight: 600 }}>No resources found</div>
            <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Add your first resource using the button above.</div>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Topic</th>
                <th>Author</th>
                <th>Version</th>
                <th>Status</th>
                <th>File</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(res => (
                <tr key={res.id}>
                  <td style={{ fontWeight: 600, maxWidth: '200px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={res.title}>
                      {res.title}
                    </div>
                    {res.description && <div style={{ fontSize: '0.75rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }} title={res.description}>{res.description}</div>}
                  </td>
                  <td><span style={{ fontSize: '0.75rem', background: '#1e293b', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #334155', whiteSpace: 'nowrap' }}>{res.resource_type}</span></td>
                  <td style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{res.topic || '—'}</td>
                  <td style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{res.author || '—'}</td>
                  <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{res.version || '—'}</td>
                  <td>
                    <span style={{
                      padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700,
                      backgroundColor: statusColors[res.status]?.bg || '#f1f5f9',
                      color: statusColors[res.status]?.color || '#64748b',
                    }}>
                      {res.status?.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {res.file_url ? (
                      <a href={`/api/resources/download?slug=${res.slug}`} target="_blank" rel="noopener noreferrer"
                        title="Download/View File"
                        style={{ color: '#3b82f6', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                        <ExternalLink size={13} /> View
                      </a>
                    ) : <span style={{ color: '#475569', fontSize: '0.8rem' }}>—</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openEdit(res)} title="Edit" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', padding: '4px' }}><Edit size={15} /></button>
                      <button onClick={() => handleDelete(res.id)} title="Delete" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal — rendered via portal to escape dashboard z-index stacking context */}
      {isModalOpen && (
        <AdminModal onClose={() => setIsModalOpen(false)}>
          <div style={{
            background: '#1e293b', border: '1px solid #334155', borderRadius: '12px',
            width: '100%', maxWidth: '680px', padding: '2rem', margin: '0 auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={18} style={{ color: '#3b82f6' }} />
                {editingId ? 'Edit Resource' : 'Add New Resource'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Title */}
              <div>
                <label style={labelStyle}>Title *</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} placeholder="e.g. Nigerian Threat Intelligence Report 2025" />
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>Description</label>
                <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Brief overview of what this resource covers..." />
              </div>

              {/* Author + Topic */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Author</label>
                  <input type="text" value={author} onChange={e => setAuthor(e.target.value)} style={inputStyle} placeholder="e.g. Elijah Adeyeye" />
                </div>
                <div>
                  <label style={labelStyle}>Topic / Category</label>
                  <input type="text" value={topic} onChange={e => setTopic(e.target.value)} style={inputStyle} placeholder="e.g. Threat Intelligence" />
                </div>
              </div>

              {/* Type + Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Resource Type</label>
                  <select value={resourceType} onChange={e => setResourceType(e.target.value)} style={inputStyle}>
                    {RESOURCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value)} style={inputStyle}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>
              </div>

              {/* Publication Date + Version */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Publication Date</label>
                  <input type="date" value={publicationDate} onChange={e => setPublicationDate(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Version</label>
                  <input type="text" value={version} onChange={e => setVersion(e.target.value)} style={inputStyle} placeholder="e.g. v1.0" />
                </div>
              </div>

              {/* References */}
              <div>
                <label style={labelStyle}>References / Sources</label>
                <textarea rows={2} value={references} onChange={e => setReferences(e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} placeholder="List references or source URLs (one per line or JSON array)..." />
              </div>

              {/* File Upload / URL */}
              <div style={{ background: '#0f172a', border: '1px dashed #334155', borderRadius: '8px', padding: '1.25rem' }}>
                <label style={{ ...labelStyle, marginBottom: '0.75rem' }}>
                  <Upload size={13} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }} />
                  File / PDF
                </label>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.35rem', display: 'block' }}>Upload a PDF file</label>
                  <input type="file" accept="application/pdf,.pdf" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} style={{ fontSize: '0.85rem', color: '#94a3b8' }} />
                  {file && <div style={{ marginTop: '0.35rem', fontSize: '0.78rem', color: '#10b981' }}>✓ {file.name} selected ({(file.size / 1024).toFixed(0)} KB)</div>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                  <div style={{ flex: 1, height: '1px', background: '#334155' }} /> or <div style={{ flex: 1, height: '1px', background: '#334155' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.35rem', display: 'block' }}>External URL (Google Drive, Dropbox, etc.)</label>
                  <input type="url" value={fileUrl} onChange={e => setFileUrl(e.target.value)} placeholder="https://drive.google.com/..." style={inputStyle} />
                </div>
                {editingId && fileUrl && !file && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: '#64748b' }}>Current file: <span style={{ color: '#94a3b8' }}>{fileUrl.length > 50 ? fileUrl.substring(0, 50) + '...' : fileUrl}</span></div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.65rem 1.25rem', background: '#334155', color: '#94a3b8', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting || (!fileUrl && !file && !editingId)} style={{
                  padding: '0.65rem 1.5rem', background: '#3b82f6', color: 'white', border: 'none',
                  borderRadius: '6px', fontWeight: 600, cursor: 'pointer',
                  opacity: (isSubmitting || (!fileUrl && !file && !editingId)) ? 0.6 : 1
                }}>
                  {isSubmitting ? 'Saving...' : (editingId ? 'Update Resource' : 'Add Resource')}
                </button>
              </div>
            </form>
          </div>
        </AdminModal>
      )}
    </div>
  );
}
