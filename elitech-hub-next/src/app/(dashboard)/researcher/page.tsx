"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { BookOpen, FileText, Eye, TrendingUp, PlusCircle } from 'lucide-react';
import styles from './researcher.module.css';

export default function ResearcherOverview() {
  const [stats, setStats] = useState({ totalResearch: 0, publishedResearch: 0, totalViews: 0 });
  const [recentResearch, setRecentResearch] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      const res = await fetch('/api/auth/me');
      if (!res.ok) return;
      const { user } = await res.json();

      const { data: researchItems, error } = await supabase
        .from('research')
        .select('*')
        .eq('submitter_id', user.id)
        .order('created_at', { ascending: false });

      if (researchItems) {
        const published = researchItems.filter(r => r.published === true || r.publication_status === 'published').length;
        const views = researchItems.reduce((sum, item) => sum + (item.views || 0), 0);

        setStats({
          totalResearch: researchItems.length,
          publishedResearch: published,
          totalViews: views
        });
        setRecentResearch(researchItems.slice(0, 5));
      }
      setLoading(false);
    }
    fetchDashboardData();
  }, []);

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.header}>
        <div>
          <h1>Researcher Dashboard</h1>
          <p>Manage your academic submissions, preprints, and publications.</p>
        </div>
        <Link href="/researcher/submit" className={styles.primaryBtn}>
          <PlusCircle size={18} />
          <span>Submit Research</span>
        </Link>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <BookOpen size={24} />
          </div>
          <div className={styles.statInfo}>
            <p>Total Submissions</p>
            <h3>{loading ? '-' : stats.totalResearch}</h3>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
            <Eye size={24} />
          </div>
          <div className={styles.statInfo}>
            <p>Total Views</p>
            <h3>{loading ? '-' : stats.totalViews.toLocaleString()}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#fefce8', color: '#ca8a04' }}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.statInfo}>
            <p>Published</p>
            <h3>{loading ? '-' : stats.publishedResearch}</h3>
          </div>
        </div>
      </div>

      <div className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <h2>Recent Submissions</h2>
          <Link href="/researcher/submissions" className={styles.viewAllBtn}>View All</Link>
        </div>

        {loading ? (
          <div className={styles.loadingState}>Loading submissions...</div>
        ) : recentResearch.length === 0 ? (
          <div className={styles.emptyState}>
            <FileText size={48} className={styles.emptyIcon} />
            <h3>No submissions yet</h3>
            <p>You haven't submitted any research papers to the repository.</p>
            <Link href="/researcher/submit" className={styles.outlineBtn}>
              <PlusCircle size={18} />
              <span>Submit First Paper</span>
            </Link>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentResearch.map(item => (
                  <tr key={item.id}>
                    <td className={styles.titleCell}>{item.title}</td>
                    <td><span style={{textTransform: 'capitalize'}}>{item.research_type || item.type || 'Article'}</span></td>
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
                      <Link href={`/researcher/submit?id=${item.id}`} className={styles.editLink}>
                        Manage
                      </Link>
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
