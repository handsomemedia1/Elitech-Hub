'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { MessageSquare, Star, Link as LinkIcon, Check, X, ShieldAlert, Plus, Copy } from 'lucide-react';
import { createCollectionRequestAction, revokeCollectionRequestAction, updateTestimonialStatusAction, toggleTestimonialFeaturedAction, fetchAdminTestimonialsData } from './actions';


type Testimonial = {
  id: string;
  source: string;
  author_name: string;
  author_role: string;
  organization: string;
  quote: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected' | 'archived';
  featured: boolean;
  author_type: string;
  created_at: string;
};

type CollectionRequest = {
  id: string;
  token: string;
  recipient_name: string;
  recipient_email: string;
  relationship_type: string;
  context: string;
  status: 'active' | 'submitted' | 'expired' | 'revoked';
  created_at: string;
};

const RELATIONSHIP_TYPES = [
  'Client', 'Student', 'Research Collaborator', 'Professor / Academic', 
  'Mentor', 'Colleague', 'Employer', 'Project Collaborator', 
  'Training Participant', 'Community Member', 'Other'
];

export default function AdminTestimonialsPage() {
  const [activeTab, setActiveTab] = useState<'testimonials' | 'links'>('testimonials');
  
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [collectionRequests, setCollectionRequests] = useState<CollectionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // New Request Form State
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [newReqName, setNewReqName] = useState('');
  const [newReqEmail, setNewReqEmail] = useState('');
  const [newReqRel, setNewReqRel] = useState('Client');
  const [newReqContext, setNewReqContext] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await fetchAdminTestimonialsData();
      if (result.error && result.testimonials.length === 0) {
        console.error('fetchAdminTestimonialsData error:', result.error);
      }
      setTestimonials(result.testimonials);
      setCollectionRequests(result.collectionRequests);
    } catch (err) {
      console.error('Error fetching data', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await updateTestimonialStatusAction(id, newStatus);
      if (!res.success) throw new Error(res.error);
        
      setTestimonials(items => items.map(item => item.id === id ? { ...item, status: newStatus as any } : item));
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const toggleFeatured = async (id: string, currentValue: boolean) => {
    try {
      const res = await toggleTestimonialFeaturedAction(id, currentValue);
      if (!res.success) throw new Error(res.error);
        
      setTestimonials(items => items.map(item => item.id === id ? { ...item, featured: !currentValue } : item));
    } catch (err: any) {
      alert(`Failed to update featured state: ${err.message}`);
    }
  };

  const createCollectionRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReqName) return;
    
    try {
      const res = await createCollectionRequestAction(newReqName, newReqEmail, newReqRel, newReqContext);
        
      if (!res.success || !res.data) throw new Error(res.error || 'Unknown error');
      
      setCollectionRequests([res.data as any, ...collectionRequests]);
      setShowNewRequestForm(false);
      setNewReqName('');
      setNewReqEmail('');
      setNewReqContext('');
      
    } catch (err: any) {
      alert(`Failed to create request: ${err.message}`);
      console.error(err);
    }
  };

  const revokeRequest = async (id: string) => {
    try {
      const res = await revokeCollectionRequestAction(id);
        
      if (!res.success) throw new Error(res.error);
      setCollectionRequests(items => items.map(item => item.id === id ? { ...item, status: 'revoked' } : item));
    } catch (err: any) {
      alert(`Failed to revoke request: ${err.message}`);
    }
  };

  const copyLink = (token: string) => {
    const url = `${window.location.origin}/testimonials/collect/${token}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  if (loading) return <div style={{ padding: '2rem', color: 'white' }}>Loading data...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#ffffff', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare style={{ color: '#3b82f6' }} /> Testimonial Management
          </h1>
          <p style={{ color: '#64748b', margin: 0 }}>Manage reviews and generate secure collection links.</p>
        </div>
        
        <div style={{ display: 'flex', background: '#070d1a', padding: '0.25rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <button 
            onClick={() => setActiveTab('testimonials')}
            style={{ 
              padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
              background: activeTab === 'testimonials' ? '#ff2a55' : 'transparent',
              color: activeTab === 'testimonials' ? 'white' : '#64748b'
            }}
          >
            Reviews
          </button>
          <button 
            onClick={() => setActiveTab('links')}
            style={{ 
              padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
              background: activeTab === 'links' ? '#ff2a55' : 'transparent',
              color: activeTab === 'links' ? 'white' : '#64748b'
            }}
          >
            Collection Links
          </button>
        </div>
      </div>

      {activeTab === 'testimonials' && (
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ padding: '1rem', background: '#070d1a', color: '#cbd5e1', fontWeight: 600, borderBottom: '1px solid #1e293b' }}>Author</th>
                <th style={{ padding: '1rem', background: '#070d1a', color: '#cbd5e1', fontWeight: 600, borderBottom: '1px solid #1e293b' }}>Quote</th>
                <th style={{ padding: '1rem', background: '#070d1a', color: '#cbd5e1', fontWeight: 600, borderBottom: '1px solid #1e293b', textAlign: 'center' }}>Source</th>
                <th style={{ padding: '1rem', background: '#070d1a', color: '#cbd5e1', fontWeight: 600, borderBottom: '1px solid #1e293b', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '1rem', background: '#070d1a', color: '#cbd5e1', fontWeight: 600, borderBottom: '1px solid #1e293b', textAlign: 'center' }}>Featured</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '1rem', verticalAlign: 'top' }}>
                    <div style={{ fontWeight: 600, color: 'white' }}>{t.author_name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                      {t.author_role} {t.organization ? `@ ${t.organization}` : ''}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#eab308', marginTop: '0.5rem', fontSize: '0.8rem' }}>
                      {t.rating || 5} <Star size={12} fill="currentColor" />
                    </div>
                  </td>
                  <td style={{ padding: '1rem', verticalAlign: 'top', maxWidth: '300px' }}>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', fontStyle: 'italic', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>"{t.quote}"</p>
                  </td>
                  <td style={{ padding: '1rem', verticalAlign: 'top', textAlign: 'center' }}>
                    <span style={{ background: '#1e293b', color: '#cbd5e1', fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px', textTransform: 'capitalize' }}>
                      {t.source}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', verticalAlign: 'top', textAlign: 'center' }}>
                    <select
                      value={t.status}
                      onChange={(e) => updateStatus(t.id, e.target.value)}
                      style={{
                        fontSize: '0.75rem', fontWeight: 600, borderRadius: '999px', padding: '0.25rem 0.75rem', border: '1px solid', cursor: 'pointer', outline: 'none', background: 'transparent',
                        ...(t.status === 'approved' ? { color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)', backgroundColor: 'rgba(16, 185, 129, 0.1)' } : {}),
                        ...(t.status === 'pending' ? { color: '#eab308', borderColor: 'rgba(234, 179, 8, 0.3)', backgroundColor: 'rgba(234, 179, 8, 0.1)' } : {}),
                        ...(t.status === 'rejected' ? { color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', backgroundColor: 'rgba(239, 68, 68, 0.1)' } : {}),
                        ...(t.status === 'archived' ? { color: '#64748b', borderColor: 'rgba(100, 116, 139, 0.3)', backgroundColor: 'rgba(100, 116, 139, 0.1)' } : {}),
                      }}
                    >
                      <option value="pending" style={{ background: '#0f172a', color: 'white' }}>Pending</option>
                      <option value="approved" style={{ background: '#0f172a', color: 'white' }}>Approved</option>
                      <option value="rejected" style={{ background: '#0f172a', color: 'white' }}>Rejected</option>
                      <option value="archived" style={{ background: '#0f172a', color: 'white' }}>Archived</option>
                    </select>
                  </td>
                  <td style={{ padding: '1rem', verticalAlign: 'top', textAlign: 'center' }}>
                    <button 
                      onClick={() => toggleFeatured(t.id, t.featured)}
                      style={{
                        padding: '0.4rem', borderRadius: '4px', cursor: 'pointer', border: 'none',
                        background: t.featured ? 'rgba(168, 85, 247, 0.2)' : '#1e293b',
                        color: t.featured ? '#c084fc' : '#64748b'
                      }}
                      title={t.featured ? "Remove from Featured" : "Add to Featured"}
                    >
                      <Star size={16} fill={t.featured ? "currentColor" : "none"} />
                    </button>
                  </td>
                </tr>
              ))}
              {testimonials.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <ShieldAlert size={48} style={{ opacity: 0.2 }} />
                      No testimonials found in the database.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'links' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'white', margin: 0 }}>Collection Requests</h2>
            <button 
              onClick={() => setShowNewRequestForm(!showNewRequestForm)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#3b82f6', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              <Plus size={16} /> New Request
            </button>
          </div>

          {showNewRequestForm && (
            <form onSubmit={createCollectionRequest} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', marginBottom: '1rem', marginTop: 0 }}>Generate Collection Link</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.4rem' }}>Recipient Name *</label>
                  <input type="text" required value={newReqName} onChange={e => setNewReqName(e.target.value)} style={{ width: '100%', background: '#070d1a', border: '1px solid #334155', borderRadius: '6px', padding: '0.6rem', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.4rem' }}>Recipient Email (Optional)</label>
                  <input type="email" value={newReqEmail} onChange={e => setNewReqEmail(e.target.value)} style={{ width: '100%', background: '#070d1a', border: '1px solid #334155', borderRadius: '6px', padding: '0.6rem', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.4rem' }}>Relationship</label>
                  <select value={newReqRel} onChange={e => setNewReqRel(e.target.value)} style={{ width: '100%', background: '#070d1a', border: '1px solid #334155', borderRadius: '6px', padding: '0.6rem', color: 'white' }}>
                    {RELATIONSHIP_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.4rem' }}>Context (Optional)</label>
                  <input type="text" placeholder="e.g. Cybersecurity Bootcamp 2025" value={newReqContext} onChange={e => setNewReqContext(e.target.value)} style={{ width: '100%', background: '#070d1a', border: '1px solid #334155', borderRadius: '6px', padding: '0.6rem', color: 'white' }} />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" style={{ background: '#3b82f6', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Generate Link</button>
                <button type="button" onClick={() => setShowNewRequestForm(false)} style={{ background: '#1e293b', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              </div>
            </form>
          )}

          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th style={{ padding: '1rem', background: '#070d1a', color: '#cbd5e1', fontWeight: 600, borderBottom: '1px solid #1e293b' }}>Recipient</th>
                  <th style={{ padding: '1rem', background: '#070d1a', color: '#cbd5e1', fontWeight: 600, borderBottom: '1px solid #1e293b' }}>Context</th>
                  <th style={{ padding: '1rem', background: '#070d1a', color: '#cbd5e1', fontWeight: 600, borderBottom: '1px solid #1e293b', textAlign: 'center' }}>Status</th>
                  <th style={{ padding: '1rem', background: '#070d1a', color: '#cbd5e1', fontWeight: 600, borderBottom: '1px solid #1e293b', textAlign: 'center' }}>Link</th>
                  <th style={{ padding: '1rem', background: '#070d1a', color: '#cbd5e1', fontWeight: 600, borderBottom: '1px solid #1e293b', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {collectionRequests.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600, color: 'white' }}>{r.recipient_name}</div>
                      {r.recipient_email && <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>{r.recipient_email}</div>}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>{r.relationship_type}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>{r.context}</div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{
                        fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '999px', textTransform: 'uppercase',
                        ...(r.status === 'active' ? { color: '#60a5fa', backgroundColor: 'rgba(59, 130, 246, 0.15)' } : {}),
                        ...(r.status === 'submitted' ? { color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.15)' } : {}),
                        ...(r.status === 'revoked' ? { color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.15)' } : {}),
                      }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {r.status === 'active' ? (
                        <button 
                          onClick={() => copyLink(r.token)} 
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#1e293b', color: '#94a3b8', border: 'none', padding: '0.4rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          <Copy size={14} /> Copy URL
                        </button>
                      ) : (
                        <span style={{ color: '#475569', fontSize: '0.8rem' }}>Unavailable</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      {r.status === 'active' && (
                        <button 
                          onClick={() => revokeRequest(r.id)} 
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {collectionRequests.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>No collection requests generated yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
