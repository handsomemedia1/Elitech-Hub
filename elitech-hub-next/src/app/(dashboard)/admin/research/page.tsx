"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FlaskConical, Search, FileText, Edit2, Trash2, ExternalLink, CheckCircle } from 'lucide-react';
import styles from '../users/users.module.css';

export default function AdminLab() {
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function fetchResearch() {
      const res = await fetch('/api/admin/research');
      if (!res.ok) { setLoading(false); return; }
      const { data } = await res.json();
      if (data) setPapers(data);
      setLoading(false);
    }
    fetchResearch();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    setPapers(papers.filter(p => p.id !== id));
    await fetch('/api/admin/research?id=' + id, { method: 'DELETE' });
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await fetch('/api/admin/research', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, publication_status: newStatus }),
    });
    if (res.ok) {
      const isPublished = newStatus === 'published';
      setPapers(papers.map(p => p.id === id ? { ...p, publication_status: newStatus, published: isPublished } : p));
    } else {
      alert('Error updating status');
    }
  };

  const filteredPapers = papers.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || 
                        (statusFilter === 'published' && p.published) || 
                        (p.publication_status === statusFilter);
    return matchSearch && matchStatus;
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Research Lab (Admin Review)</h1>
          <p className={styles.subtitle}>Review submissions and manage the repository</p>
        </div>
        <div>
          <Link href="/admin/lab/upload" className={styles.primaryBtn} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <FlaskConical size={18} /> Upload New Paper
          </Link>
        </div>
      </header>

      <div className={styles.controlsBar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search publications..." 
            className={styles.searchInput} 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <select className={styles.filterSelect} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="submitted">Submitted (Pending Review)</option>
          <option value="under_review">Under Review</option>
          <option value="revision_required">Revision Required</option>
          <option value="accepted">Accepted</option>
          <option value="published">Published</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Submitter</th>
              <th>Type</th>
              <th>Date</th>
              <th>Workflow Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{textAlign: 'center', padding: '2rem'}}>Loading submissions...</td></tr>
            ) : filteredPapers.length === 0 ? (
              <tr><td colSpan={6} style={{textAlign: 'center', padding: '2rem'}}>No research papers found.</td></tr>
            ) : filteredPapers.map(paper => (
              <tr key={paper.id}>
                <td className={styles.tdName}>
                  <div className={styles.avatar} style={{ background: '#3b82f6' }}><FileText size={16} /></div>
                  <span style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{paper.title}</span>
                </td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>{paper.submitter?.name || paper.author || 'Admin/Unknown'}</div>
                </td>
                <td><span className={styles.badge}>{paper.research_type || paper.type}</span></td>
                <td style={{ fontSize: '0.85rem' }}>{new Date(paper.created_at).toLocaleDateString()}</td>
                <td>
                  <select 
                    value={paper.publication_status || (paper.published ? 'published' : 'draft')} 
                    onChange={e => handleStatusChange(paper.id, e.target.value)}
                    style={{ 
                      padding: '4px 8px', borderRadius: '4px', border: '1px solid #334155', 
                      background: '#1e293b', color: 'white', fontSize: '0.85rem' 
                    }}
                  >
                    <option value="draft">Draft</option>
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="revision_required">Revision Required</option>
                    <option value="accepted">Accepted</option>
                    <option value="published">Published</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td>
                  <div className={styles.actionBtns}>
                    {(paper.published || paper.publication_status === 'published') && (
                      <Link href={`/research/${paper.slug || ''}`} target="_blank" className={styles.iconBtn} title="View Live"><ExternalLink size={16} /></Link>
                    )}
                    <Link href={`/admin/lab/edit/${paper.id}`} className={styles.iconBtn} title="Edit/Review"><Edit2 size={16} /></Link>
                    <button className={styles.iconBtn} title="Delete" onClick={() => handleDelete(paper.id, paper.title)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}