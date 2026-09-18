"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Building, MapPin, CheckCircle2 } from 'lucide-react';
import styles from '../researcher.module.css';

export default function ResearcherProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState({
    full_name: '',
    display_name: '',
    orcid: '',
    institution: '',
    department: '',
    country: '',
    biography: ''
  });

  useEffect(() => {
    async function loadProfile() {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const { user } = await res.json();
        const { data } = await supabase
          .from('researcher_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setProfile(data);
        } else {
          setProfile(prev => ({ ...prev, full_name: user.user_metadata?.full_name || '' }));
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const res = await fetch('/api/auth/me');
    if (!res.ok) return;
    const { user } = await res.json();

    const { error } = await supabase
      .from('researcher_profiles')
      .upsert({ 
        id: user.id, 
        ...profile,
        updated_at: new Date().toISOString()
      });

    setSaving(false);
    if (error) {
      setMessage('Error saving profile');
    } else {
      setMessage('Profile updated successfully');
    }
  };

  if (loading) return <div className={styles.dashboardWrapper}>Loading...</div>;

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.header}>
        <div>
          <h1>Researcher Profile</h1>
          <p>Manage your public author details and academic affiliations.</p>
        </div>
      </div>

      {message && (
        <div style={{ padding: '12px', background: message.includes('Error') ? '#7f1d1d' : '#14532d', color: 'white', borderRadius: '8px', marginBottom: '20px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <CheckCircle2 size={18} /> {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>Full Name *</label>
            <input 
              type="text" 
              required
              value={profile.full_name} 
              onChange={e => setProfile({...profile, full_name: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>ORCID iD</label>
            <input 
              type="text" 
              value={profile.orcid} 
              onChange={e => setProfile({...profile, orcid: e.target.value})}
              placeholder="e.g. 0000-0002-1825-0097"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>Institution</label>
            <input 
              type="text" 
              value={profile.institution} 
              onChange={e => setProfile({...profile, institution: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>Department</label>
            <input 
              type="text" 
              value={profile.department} 
              onChange={e => setProfile({...profile, department: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>Country</label>
            <input 
              type="text" 
              value={profile.country} 
              onChange={e => setProfile({...profile, country: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>Biography</label>
          <textarea 
            rows={4}
            value={profile.biography} 
            onChange={e => setProfile({...profile, biography: e.target.value})}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: 'white' }}
          />
        </div>

        <button type="submit" disabled={saving} style={{ alignSelf: 'flex-start', background: '#3b82f6', color: 'white', padding: '10px 24px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
