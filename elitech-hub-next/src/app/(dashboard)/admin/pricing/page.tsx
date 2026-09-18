'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from '../admin.module.css';

type PriceRow = {
  id: string;
  course_id: string;
  currency_code: string;
  symbol: string;
  amount: number;
};

export default function PricingAdminPage() {
  const [prices, setPrices] = useState<PriceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Editing state
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<number | ''>('');
  
  // New entry state
  const [isAdding, setIsAdding] = useState(false);
  const [newCourseId, setNewCourseId] = useState('bootcamp');
  const [newCurrency, setNewCurrency] = useState('USD');
  const [newSymbol, setNewSymbol] = useState('$');
  const [newAmount, setNewAmount] = useState<number | ''>('');

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('course_prices')
      .select('*')
      .order('course_id')
      .order('currency_code');
    
    if (error) {
      console.error(error);
      setError('Failed to load prices. Did you run the SQL migration?');
    } else {
      setPrices(data || []);
    }
    setLoading(false);
  };

  const handleEdit = (row: PriceRow) => {
    setEditRowId(row.id);
    setEditAmount(row.amount);
  };

  const handleSave = async (id: string) => {
    if (editAmount === '') return;
    setSaving(true);
    const { error } = await supabase
      .from('course_prices')
      .update({ amount: Number(editAmount) })
      .eq('id', id);

    if (error) {
      setError('Failed to update price');
    } else {
      setEditRowId(null);
      await fetchPrices();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this price?')) return;
    setSaving(true);
    const { error } = await supabase
      .from('course_prices')
      .delete()
      .eq('id', id);
    if (error) setError('Failed to delete');
    else await fetchPrices();
    setSaving(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAmount === '') return;
    setSaving(true);
    const { error } = await supabase
      .from('course_prices')
      .insert([
        {
          course_id: newCourseId,
          currency_code: newCurrency.toUpperCase(),
          symbol: newSymbol,
          amount: Number(newAmount)
        }
      ]);

    if (error) {
      setError(error.message);
    } else {
      setIsAdding(false);
      setNewAmount('');
      await fetchPrices();
    }
    setSaving(false);
  };

  return (
    <div className={styles.adminPage}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Global Pricing Engine</h1>
          <p>Manage course prices for different regions.</p>
        </div>
        <button 
          className={styles.primaryBtn} 
          onClick={() => setIsAdding(!isAdding)}
        >
          {isAdding ? 'Cancel' : '+ Add Currency Price'}
        </button>
      </header>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      {isAdding && (
        <form className={styles.formCard} onSubmit={handleAdd} style={{ marginBottom: '2rem', padding: '1.5rem', background: '#1a1d21', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '1rem' }}>Add New Localized Price</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(150px, 100%), 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#a1a1aa' }}>Item ID (Course/Service)</label>
              <select 
                value={newCourseId} 
                onChange={(e) => setNewCourseId(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', background: '#090a0b', border: '1px solid #3f3f46', borderRadius: '4px', color: '#fff' }}
              >
                <optgroup label="Programs">
                  <option value="bootcamp">6-Week Bootcamp</option>
                  <option value="professional">16-Week Professional</option>
                  <option value="ai_training">AI Training</option>
                </optgroup>
                <optgroup label="Web Development">
                  <option value="web-basic">Basic Web Security</option>
                  <option value="web-dynamic">Dynamic One Page</option>
                  <option value="web-business">Standard Business Site</option>
                  <option value="web-ecommerce">Premium Fullstack Site</option>
                </optgroup>
                <optgroup label="AI Chatbots">
                  <option value="chatbot-basic">Basic Support Bot</option>
                  <option value="chatbot-standard">Agentic CRM Bot</option>
                  <option value="chatbot-premium">Custom Autonomous Agent</option>
                </optgroup>
                <optgroup label="Custom Scripts">
                  <option value="script-basic">Basic Automation Script</option>
                  <option value="script-standard">Advanced Security Automation</option>
                  <option value="script-premium">Enterprise DevOps Tooling</option>
                </optgroup>
                <optgroup label="Penetration Testing">
                  <option value="pentest-basic">Basic Web Vulnerability Scan</option>
                  <option value="pentest-standard">Standard Web App Pentest</option>
                  <option value="pentest-premium">Full Network Pentest</option>
                </optgroup>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#a1a1aa' }}>Currency Code</label>
              <input 
                type="text" 
                placeholder="e.g. USD" 
                value={newCurrency} 
                onChange={(e) => setNewCurrency(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', background: '#090a0b', border: '1px solid #3f3f46', borderRadius: '4px', color: '#fff' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#a1a1aa' }}>Symbol</label>
              <input 
                type="text" 
                placeholder="e.g. $" 
                value={newSymbol} 
                onChange={(e) => setNewSymbol(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', background: '#090a0b', border: '1px solid #3f3f46', borderRadius: '4px', color: '#fff' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#a1a1aa' }}>Amount</label>
              <input 
                type="number" 
                placeholder="e.g. 75000" 
                value={newAmount} 
                onChange={(e) => setNewAmount(e.target.value ? Number(e.target.value) : '')}
                style={{ width: '100%', padding: '0.75rem', background: '#090a0b', border: '1px solid #3f3f46', borderRadius: '4px', color: '#fff' }}
                required
              />
            </div>
          </div>
          <button type="submit" className={styles.primaryBtn} disabled={saving}>
            {saving ? 'Saving...' : 'Save Price'}
          </button>
        </form>
      )}

      {loading ? (
        <div>Loading prices...</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Course ID</th>
                <th>Currency</th>
                <th>Symbol</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((price) => (
                <tr key={price.id}>
                  <td style={{ textTransform: 'capitalize' }}>{price.course_id.replace('_', ' ')}</td>
                  <td>{price.currency_code}</td>
                  <td>{price.symbol}</td>
                  <td>
                    {editRowId === price.id ? (
                      <input 
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value ? Number(e.target.value) : '')}
                        style={{ padding: '0.5rem', background: '#090a0b', border: '1px solid #3f3f46', color: '#fff' }}
                      />
                    ) : (
                      `${price.symbol}${new Intl.NumberFormat('en-US').format(price.amount)}`
                    )}
                  </td>
                  <td>
                    <div className={styles.actionBtns}>
                      {editRowId === price.id ? (
                        <>
                          <button 
                            onClick={() => handleSave(price.id)}
                            style={{ padding: '0.25rem 0.75rem', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            disabled={saving}
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => setEditRowId(null)}
                            style={{ padding: '0.25rem 0.75rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            disabled={saving}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            className={styles.editBtn} 
                            onClick={() => handleEdit(price)}
                          >
                            <i className="fas fa-edit" />
                          </button>
                          <button 
                            className={styles.deleteBtn} 
                            onClick={() => handleDelete(price.id)}
                          >
                            <i className="fas fa-trash" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {prices.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                    No prices found. Please run the SQL migration or add one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

