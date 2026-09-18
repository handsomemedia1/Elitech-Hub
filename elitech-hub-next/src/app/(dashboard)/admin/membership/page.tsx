'use client';

import React, { useState, useEffect } from 'react';
import { Users, FlaskConical, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { fetchMembershipApplications, updateMembershipStatusAction } from './actions';

type Application = {
  id: string;
  full_name: string;
  email: string;
  professional_title?: string;
  institution?: string;
  research_interests?: string;
  motivation?: string;
  status: string;
  created_at: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  reviewing: '#3b82f6',
  approved: '#22c55e',
  rejected: '#ef4444',
  waitlisted: '#8b5cf6',
};

export default function MembershipApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const result = await fetchMembershipApplications();
    if (result.error) setError(result.error);
    setApplications(result.data);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const res = await updateMembershipStatusAction(id, status);
    if (!res.success) { alert('Failed to update status: ' + res.error); return; }
    setApplications(apps => apps.map(a => a.id === id ? { ...a, status } : a));
    if (selectedApp?.id === id) setSelectedApp(prev => prev ? { ...prev, status } : null);
  };

  const statusCount = (s: string) => applications.filter(a => a.status === s).length;

  if (loading) return (
    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
      Loading applications...
    </div>
  );

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <FlaskConical size={28} style={{ color: 'var(--color-accent)' }} />
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>Research Membership Applications</h1>
          <p style={{ color: 'var(--color-text-secondary)', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
            Review and manage applications for the 2027 Research Membership cohort
          </p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem' }}>
          <StatBadge label="Total" value={applications.length} color="#64748b" />
          <StatBadge label="Pending" value={statusCount('pending')} color="#f59e0b" />
          <StatBadge label="Approved" value={statusCount('approved')} color="#22c55e" />
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Error: {error}. Make sure the <code>research_membership_applications</code> table has been created in Supabase.
        </div>
      )}

      {applications.length === 0 && !error ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-secondary)', background: 'var(--color-bg-panel)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
          <Users size={48} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.3 }} />
          <p style={{ fontSize: '1.1rem', margin: 0 }}>No applications received yet.</p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.7 }}>When researchers apply via <strong>/research/membership/apply</strong>, they will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedApp ? '1fr 380px' : '1fr', gap: '1.5rem' }}>
          {/* Table */}
          <div style={{ background: 'var(--color-bg-panel)', borderRadius: '12px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {['Name', 'Institution', 'Status', 'Applied', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id} style={{ borderBottom: '1px solid var(--color-border)', background: selectedApp?.id === app.id ? 'rgba(var(--color-accent-rgb, 99,102,241),0.08)' : 'transparent' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.95rem' }}>{app.full_name}</div>
                      <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>{app.email}</div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                      {app.institution || '—'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ background: (STATUS_COLORS[app.status] || '#64748b') + '22', color: STATUS_COLORS[app.status] || '#64748b', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' }}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => setSelectedApp(selectedApp?.id === app.id ? null : app)} title="View Details"
                          style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: 'none', borderRadius: '6px', padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '0.75rem' }}>
                          <Eye size={14} />
                        </button>
                        {app.status !== 'approved' && (
                          <button onClick={() => updateStatus(app.id, 'approved')} title="Approve"
                            style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: 'none', borderRadius: '6px', padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '0.75rem' }}>
                            <CheckCircle size={14} />
                          </button>
                        )}
                        {app.status !== 'rejected' && (
                          <button onClick={() => updateStatus(app.id, 'rejected')} title="Reject"
                            style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'none', borderRadius: '6px', padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '0.75rem' }}>
                            <XCircle size={14} />
                          </button>
                        )}
                        {app.status !== 'reviewing' && (
                          <button onClick={() => updateStatus(app.id, 'reviewing')} title="Mark as Reviewing"
                            style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: 'none', borderRadius: '6px', padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '0.75rem' }}>
                            <Clock size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detail Panel */}
          {selectedApp && (
            <div style={{ background: 'var(--color-bg-panel)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.5rem', height: 'fit-content', position: 'sticky', top: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Application Details</h2>
                <button onClick={() => setSelectedApp(null)} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
              </div>
              <DetailRow label="Full Name" value={selectedApp.full_name} />
              <DetailRow label="Email" value={selectedApp.email} />
              <DetailRow label="Professional Title" value={selectedApp.professional_title} />
              <DetailRow label="Institution" value={selectedApp.institution} />
              <DetailRow label="Status">
                <span style={{ color: STATUS_COLORS[selectedApp.status] || '#64748b', fontWeight: 600, textTransform: 'capitalize' }}>{selectedApp.status}</span>
              </DetailRow>
              {selectedApp.research_interests && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Research Interests</div>
                  <p style={{ color: 'var(--color-text-primary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>{selectedApp.research_interests}</p>
                </div>
              )}
              {selectedApp.motivation && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Motivation</div>
                  <p style={{ color: 'var(--color-text-primary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>{selectedApp.motivation}</p>
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                <button onClick={() => updateStatus(selectedApp.id, 'approved')} style={{ flex: 1, background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', padding: '0.6rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>✓ Approve</button>
                <button onClick={() => updateStatus(selectedApp.id, 'reviewing')} style={{ flex: 1, background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', padding: '0.6rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>Review</button>
                <button onClick={() => updateStatus(selectedApp.id, 'rejected')} style={{ flex: 1, background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', padding: '0.6rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>✕ Reject</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatBadge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ background: 'var(--color-bg-panel)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '0.5rem 1rem', textAlign: 'center' }}>
      <div style={{ fontSize: '1.4rem', fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    </div>
  );
}

function DetailRow({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  if (!value && !children) return null;
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>{label}</div>
      {children || <div style={{ color: 'var(--color-text-primary)', fontSize: '0.9rem' }}>{value}</div>}
    </div>
  );
}
