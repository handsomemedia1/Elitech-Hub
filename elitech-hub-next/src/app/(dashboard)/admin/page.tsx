"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { 
  Users, BookOpen, DollarSign, Award, TrendingUp, 
  ArrowUpRight, Clock, FileText 
} from 'lucide-react';
import styles from './admin.module.css';

export default function AdminOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    paidUsers: 0,
    courses: 0,
    applications: 0
  });
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safety timeout to prevent infinite loading if Supabase is offline
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function fetchAdminData() {
      // Fetch users
      const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
      const { count: paidCount } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('has_access', true);
      const { count: coursesCount } = await supabase.from('courses').select('*', { count: 'exact', head: true });
      
      const { data: apps, count: appsCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalUsers: usersCount || 0,
        paidUsers: paidCount || 0,
        courses: coursesCount || 0,
        applications: appsCount || 0
      });
      
      if (apps) setRecentApplications(apps);
      setLoading(false);
    }

    fetchAdminData();
  }, []);

  return (
    <div className={styles.adminWrapper}>
      <div className={styles.header}>
        <div>
          <h1>Admin Dashboard</h1>
          <p>System overview and key performance metrics.</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <Users size={24} />
          </div>
          <div className={styles.statInfo}>
            <p>Total Users</p>
            <h3>{loading ? '-' : stats.totalUsers}</h3>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
            <DollarSign size={24} />
          </div>
          <div className={styles.statInfo}>
            <p>Paid / Active Users</p>
            <h3>{loading ? '-' : stats.paidUsers}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#fefce8', color: '#ca8a04' }}>
            <BookOpen size={24} />
          </div>
          <div className={styles.statInfo}>
            <p>Total Courses</p>
            <h3>{loading ? '-' : stats.courses}</h3>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>
            <FileText size={24} />
          </div>
          <div className={styles.statInfo}>
            <p>Pending Apps</p>
            <h3>{loading ? '-' : stats.applications}</h3>
          </div>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.mainPanel}>
          <div className={styles.panelHeader}>
            <h2>Recent Applications</h2>
            <Link href="/admin/applications" className={styles.viewAllBtn}>View All</Link>
          </div>
          
          <div className={styles.tableWrapper}>
            {loading ? (
              <div className={styles.loadingState}>Loading data...</div>
            ) : recentApplications.length === 0 ? (
              <div className={styles.emptyState}>No applications found.</div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Program</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.map(app => (
                    <tr key={app.id}>
                      <td className={styles.nameCell}>
                        <div className={styles.nameText}>{app.full_name}</div>
                        <div className={styles.emailText}>{app.email}</div>
                      </td>
                      <td>{app.program_name || app.program}</td>
                      <td>
                        <span className={`${styles.badge} ${styles['badge' + app.status]}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className={styles.dateCell}>
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className={styles.sidePanel}>
          <div className={styles.quickActions}>
            <h2>Quick Actions</h2>
            <div className={styles.actionGrid}>
              <Link href="/admin/courses" className={styles.actionBtn}>
                <div className={styles.actionIcon} style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                  <BookOpen size={20} />
                </div>
                <span>Manage LMS</span>
                <ArrowUpRight size={16} className={styles.arrowIcon} />
              </Link>

              <Link href="/admin/users" className={styles.actionBtn}>
                <div className={styles.actionIcon} style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                  <Users size={20} />
                </div>
                <span>Grant Access</span>
                <ArrowUpRight size={16} className={styles.arrowIcon} />
              </Link>
              
              <Link href="/admin/certificates" className={styles.actionBtn}>
                <div className={styles.actionIcon} style={{ backgroundColor: '#fefce8', color: '#ca8a04' }}>
                  <Award size={20} />
                </div>
                <span>Issue Certificate</span>
                <ArrowUpRight size={16} className={styles.arrowIcon} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
