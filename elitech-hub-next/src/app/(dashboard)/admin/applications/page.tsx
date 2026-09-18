"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Filter, MoreVertical, Check, X, FileText } from 'lucide-react';
import styles from './applications.module.css';

export default function AdminApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    setLoading(true);
    
    // Fetch Applications
    const { data: appsData, error: appsError } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    // Fetch Leads
    const { data: leadsData, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    const formattedLeads = (leadsData || []).map(lead => ({
      id: `lead_${lead.id}`,
      original_id: lead.id,
      full_name: 'Newsletter Lead',
      email: lead.email,
      phone_number: lead.whatsapp || '',
      program_name: `Lead Source: ${lead.source_page || 'popup'}`,
      status: 'pending',
      created_at: lead.created_at,
      is_lead: true
    }));

    const merged = [...(appsData || []), ...formattedLeads].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    setApplications(merged);
    setLoading(false);
  }

  const handleUpdateStatus = async (app: any, newStatus: string) => {
    if (app.is_lead) {
      // For leads, we might not have a status column yet, but we can fake it in UI
      setApplications(applications.map(a => 
        a.id === app.id ? { ...a, status: newStatus } : a
      ));
      return;
    }

    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', app.id);

    if (!error) {
      setApplications(applications.map(a => 
        a.id === app.id ? { ...a, status: newStatus } : a
      ));
    }
  };

  const filteredApps = applications.filter(app => 
    app.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    app.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.managerWrapper}>
      <div className={styles.header}>
        <div>
          <h1>Applications & Leads</h1>
          <p>Review student applications and contact inquiries.</p>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className={styles.filterBtn}>
          <Filter size={18} />
          <span>Filter</span>
        </button>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loadingState}>Loading applications...</div>
        ) : filteredApps.length === 0 ? (
          <div className={styles.emptyState}>
            <FileText size={48} className={styles.emptyIcon} />
            <h3>No applications found</h3>
            <p>You have no pending applications at the moment.</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Program / Interest</th>
                <th>Status</th>
                <th>Date Applied</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map(app => (
                <tr key={app.id}>
                  <td>
                    <div className={styles.applicantInfo}>
                      <span className={styles.nameText}>{app.full_name}</span>
                      <span className={styles.emailText}>{app.email}</span>
                      <span className={styles.phoneText}>{app.phone_number}</span>
                    </div>
                  </td>
                  <td>
                    <span className={styles.programBadge}>
                      {app.program_name || app.program || 'General Inquiry'}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles['badge' + (app.status || 'pending')]}`}>
                      {app.status || 'pending'}
                    </span>
                  </td>
                  <td className={styles.dateCell}>
                    {new Date(app.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button 
                        className={styles.approveBtn} 
                        onClick={() => handleUpdateStatus(app, 'reviewed')}
                        title="Mark as Reviewed"
                      >
                        <Check size={16} />
                      </button>
                      <button 
                        className={styles.rejectBtn} 
                        onClick={() => handleUpdateStatus(app, 'rejected')}
                        title="Reject"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
