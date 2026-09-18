'use client';

import React, { useEffect, useState } from 'react';
import { Settings, Save, Globe, Mail, Shield, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './settings.module.css';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  
  // Cohort state
  const [cohortMonth, setCohortMonth] = useState('June 8');
  const [cohortSeats, setCohortSeats] = useState('10');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .eq('setting_key', 'elitechub_cohort')
      .single();

    if (data && data.setting_value) {
      setCohortMonth(data.setting_value.month || 'June 8');
      setCohortSeats(data.setting_value.seats || '10');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess('');
    const newValue = { month: cohortMonth, seats: cohortSeats, year: '2026' };
    
    const { data: existing } = await supabase.from('site_settings').select('id').eq('setting_key', 'elitechub_cohort').single();
    
    let error;
    if (existing) {
      const res = await supabase.from('site_settings').update({ setting_value: newValue }).eq('setting_key', 'elitechub_cohort');
      error = res.error;
    } else {
      const res = await supabase.from('site_settings').insert([{ setting_key: 'elitechub_cohort', setting_value: newValue }]);
      error = res.error;
    }

    setSaving(false);
    if (!error) {
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      alert('Error saving settings: ' + error.message);
    }
  };

  if (loading) return <div className={styles.container}>Loading settings...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Platform Settings</h1>
        <p className={styles.subtitle}>Manage global configuration and platform details</p>
      </header>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2><Calendar size={18} /> Cohort Configuration</h2>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.formGroup}>
            <label>Next Cohort Date (e.g., September)</label>
            <input 
              type="text" 
              className={styles.input} 
              value={cohortMonth}
              onChange={(e) => setCohortMonth(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Seats Available</label>
            <input 
              type="text" 
              className={styles.input} 
              value={cohortSeats}
              onChange={(e) => setCohortSeats(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2><Globe size={18} /> General Information</h2>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.formGroup}>
            <label>Platform Name</label>
            <input type="text" className={styles.input} defaultValue="Elitech Hub" />
          </div>
          <div className={styles.formGroup}>
            <label>Support Email</label>
            <input type="email" className={styles.input} defaultValue="support@elitechub.com" />
          </div>
        </div>
      </div>

      <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
        <Save size={18} /> {saving ? 'Saving...' : 'Save Settings'}
      </button>
      {success && <p style={{ color: '#10b981', marginTop: '1rem' }}>{success}</p>}
    </div>
  );
}