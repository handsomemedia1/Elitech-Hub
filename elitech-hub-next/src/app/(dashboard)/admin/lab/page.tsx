"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FlaskConical, Search, FileText, Edit2, Trash2, ExternalLink, Plus } from 'lucide-react';
import styles from '../users/users.module.css';

export default function AdminLabList() {
  const [labs, setLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function fetchLabs() {
      const res = await fetch('/api/admin/lab');
      if (!res.ok) { setLoading(false); return; }
      const { data } = await res.json();
      if (data) setLabs(data);
      setLoading(false);
    }
    fetchLabs();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    setLabs(labs.filter(l => l.id !== id));
    await fetch('/api/admin/lab?id=' + id, { method: 'DELETE' });
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await fetch('/api/admin/lab', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });
    if (res.ok) {
      setLabs(labs.map(l => l.id === id ? { ...l, status: newStatus } : l));
    } else {
      alert('Error updating status');
    }
  };

  const filteredLabs = labs.filter(l => {
    const matchSearch = l.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Labs Management</h1>
          <p className={styles.subtitle}>Manage research labs and artifacts</p>
        </div>
        <div>
          <Link href="/admin/lab/create" className={styles.primaryBtn} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> Create Lab
          </Link>
        </div>
      </header>

      <div className={styles.controlsBar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search labs..." 
            className={styles.searchInput} 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <select className={styles.filterSelect} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="review">Review</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Difficulty</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{textAlign: 'center', padding: '2rem'}}>Loading labs...</td></tr>
            ) : filteredLabs.length === 0 ? (
              <tr><td colSpan={6} style={{textAlign: 'center', padding: '2rem'}}>No labs found.</td></tr>
            ) : filteredLabs.map(lab => (
              <tr key={lab.id}>
                <td className={styles.tdName}>
                  <div className={styles.avatar} style={{ background: '#3b82f6' }}><FlaskConical size={16} /></div>
                  <span style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lab.title}</span>
                </td>
                <td><span className={styles.badge}>{lab.category || 'General'}</span></td>
                <td>{lab.difficulty || 'N/A'}</td>
                <td style={{ fontSize: '0.85rem' }}>{new Date(lab.created_at).toLocaleDateString()}</td>
                <td>
                  <select 
                    value={lab.status} 
                    onChange={e => handleStatusChange(lab.id, e.target.value)}
                    style={{ 
                      padding: '4px 8px', borderRadius: '4px', border: '1px solid #334155', 
                      background: '#1e293b', color: 'white', fontSize: '0.85rem' 
                    }}
                  >
                    <option value="draft">Draft</option>
                    <option value="review">Review</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </td>
                <td>
                  <div className={styles.actionBtns}>
                    {(lab.status === 'published') && (
                      <Link href={`/lab/${lab.slug}`} target="_blank" className={styles.iconBtn} title="View Live"><ExternalLink size={16} /></Link>
                    )}
                    <Link href={`/admin/lab/create?id=${lab.id}`} className={styles.iconBtn} title="Edit"><Edit2 size={16} /></Link>
                    <button className={styles.iconBtn} title="Delete" onClick={() => handleDelete(lab.id, lab.title)}><Trash2 size={16} /></button>
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
