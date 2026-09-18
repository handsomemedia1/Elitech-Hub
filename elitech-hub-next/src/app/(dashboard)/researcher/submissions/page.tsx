"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { FileText, PlusCircle, Search } from 'lucide-react';
import styles from '../researcher.module.css';

export default function ResearcherSubmissions() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchSubmissions() {
      const res = await fetch('/api/auth/me');
      if (!res.ok) return;
      const { user } = await res.json();

      const { data, error } = await supabase
        .from('research')
        .select('*')
        .eq('submitter_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setSubmissions(data);
      setLoading(false);
    }
    fetchSubmissions();
  }, []);

  const filtered = submissions.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.header}>
        <div>
          <h1>My Research</h1>
          <p>Manage all your submissions and publications.</p>
        </div>
        <Link href="/researcher/submit" className={styles.primaryBtn}>
          <PlusCircle size={18} />
          <span>New Submission</span>
        </Link>
      </div>

      <div className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#1e293b', padding: '8px 16px', borderRadius: '8px', border: '1px solid #334155' }}>
            <Search size={16} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Search by title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '0.9rem', width: '250px' }}
            />
          </div>
        </div>

        {loading ? (
          <div className={styles.loadingState}>Loading submissions...</div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <FileText size={48} className={styles.emptyIcon} />
            <h3>No submissions found</h3>
            <p>You haven't submitted anything yet, or no results matched your search.</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Title & Category</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item.id}>
                    <td className={styles.titleCell}>
                      <div>{item.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>{item.category}</div>
                    </td>
                    <td><span style={{textTransform: 'capitalize', fontSize: '0.85rem'}}>{item.research_type || item.type || 'Article'}</span></td>
                    <td>
                      <span className={`${styles.badge} ${
                        (item.publication_status === 'published' || item.published === true) 
                          ? styles.badgeSuccess 
                          : (item.publication_status === 'under_review' || item.publication_status === 'revision_required') 
                          ? styles.badgeWarning 
                          : styles.badgeDraft
                      }`}>
                        {(item.publication_status || (item.published ? 'published' : 'draft')).replace('_', ' ')}
                      </span>
                    </td>
                    <td className={styles.dateCell}>
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <Link href={`/researcher/submit?id=${item.id}`} className={styles.editLink}>
                          Edit
                        </Link>
                        {(item.published || item.publication_status === 'published') && (
                          <Link href={`/research/${item.slug}`} target="_blank" className={styles.editLink} style={{ color: '#10b981' }}>
                            View Public
                          </Link>
                        )}
                        <label style={{ color: '#60a5fa', fontSize: '0.85rem', cursor: 'pointer' }} title="Upload a revised version of this paper">
                          <input 
                            type="file" 
                            accept=".pdf"
                            style={{ display: 'none' }}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file || !item.id) return;
                              const formData = new FormData();
                              formData.append('file', file);
                              formData.append('researchId', item.id);
                              
                              const res = await fetch('/api/research/upload', {
                                method: 'POST',
                                body: formData
                              });
                              
                              const data = await res.json();
                              if (!res.ok) { alert('Upload failed: ' + data.error); return; }
                              
                              const newUrl = data.filePath;
                              await supabase.from('research_versions').insert([{
                                research_id: item.id,
                                file_url: newUrl,
                                changes_summary: 'Revised version uploaded by author',
                                version_number: Date.now()
                              }]);
                              await supabase.from('research').update({ file_url: newUrl }).eq('id', item.id);
                              alert('Revision uploaded successfully!');
                            }}
                          />
                          ↑ Revise
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
